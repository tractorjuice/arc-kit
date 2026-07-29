"""Tests for BYO LLM — local endpoint wiring, retry logic, and build command flags."""

import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock, AsyncMock
from dataclasses import asdict

import httpx
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "src"))

from arckit_cli.llm import (
    LLMConfig,
    resolve_config,
    call_llm,
    _RETRY_DELAYS,
)
from arckit_cli.local import _get_config_path, _load_config, _save_config, _ping_endpoint
from arckit_cli import build  # CLI command


# ---------------------------------------------------------------------------
# LLMConfig — dataclass
# ---------------------------------------------------------------------------

def test_llm_config_defaults():
    cfg = LLMConfig(
        provider="openai-compatible",
        base_url="http://127.0.0.1:8080",
        model="Qwen3.6-27B",
        api_key="",
    )
    assert cfg.max_tokens == 128000
    assert cfg.temperature == 0.0
    assert cfg.base_url == "http://127.0.0.1:8080"


def test_llm_config_serializable():
    cfg = LLMConfig(
        provider="ollama",
        base_url="http://127.0.0.1:11434",
        model="llama3",
        api_key="",
        max_tokens=4096,
        temperature=0.7,
    )
    d = asdict(cfg)
    assert d["provider"] == "ollama"
    assert d["max_tokens"] == 4096


# ---------------------------------------------------------------------------
# resolve_config — precedence chain
# ---------------------------------------------------------------------------

def test_resolve_requires_base_url():
    """Missing base URL raises RuntimeError."""
    env = {k: v for k, v in os.environ.items() if k not in ("LLM_BASE_URL", "LLM_MODEL", "OPENAI_API_KEY", "ANTHROPIC_API_KEY")}
    with patch.dict(os.environ, env, clear=True):
        with patch("arckit_cli.llm._load_config", return_value={}):
            with pytest.raises(RuntimeError, match="No LLM base URL"):
                resolve_config()


def test_resolve_requires_model():
    """Missing model raises RuntimeError."""
    env = {k: v for k, v in os.environ.items() if k not in ("LLM_BASE_URL", "LLM_MODEL", "OPENAI_API_KEY", "ANTHROPIC_API_KEY")}
    with patch.dict(os.environ, env, clear=True):
        with patch("arckit_cli.llm._load_config", return_value={"llm": {"base_url": "http://localhost:8080"}}):
            with pytest.raises(RuntimeError, match="No LLM model"):
                resolve_config()


def test_resolve_cli_overrides_config():
    """CLI flags win over config file."""
    with patch("arckit_cli.llm._load_config", return_value={"llm": {
        "base_url": "http://old:8000",
        "model": "old-model",
    }}):
        cfg = resolve_config(cli_base_url="http://cli:9000", cli_model="new-model")
    assert cfg.base_url == "http://cli:9000"
    assert cfg.model == "new-model"


def test_resolve_env_fills_gap():
    """Env vars fill in when CLI flags are absent."""
    env = {k: v for k, v in os.environ.items() if k not in ("LLM_BASE_URL", "LLM_MODEL", "OPENAI_API_KEY", "ANTHROPIC_API_KEY")}
    env["LLM_BASE_URL"] = "http://env:7000"
    env["LLM_MODEL"] = "env-model"
    with patch.dict(os.environ, env, clear=True):
        with patch("arckit_cli.llm._load_config", return_value={}):
            cfg = resolve_config()
    assert cfg.base_url == "http://env:7000"
    assert cfg.model == "env-model"


def test_resolve_precedence_chain():
    """CLI > env > config file for every field."""
    env = {k: v for k, v in os.environ.items() if k not in ("LLM_BASE_URL", "LLM_MODEL", "OPENAI_API_KEY", "ANTHROPIC_API_KEY")}
    env["LLM_BASE_URL"] = "http://env:7000"
    env["LLM_MODEL"] = "env-model"
    with patch.dict(os.environ, env, clear=True):
        with patch("arckit_cli.llm._load_config", return_value={"llm": {
            "base_url": "http://config:6000",
            "model": "config-model",
        }}):
            cfg = resolve_config(cli_base_url="http://cli:5000", cli_model="cli-model")
    assert cfg.base_url == "http://cli:5000"
    assert cfg.model == "cli-model"


# ---------------------------------------------------------------------------
# call_llm — retry logic
# ---------------------------------------------------------------------------

def _mock_client(post_fn):
    """Return a mock httpx.AsyncClient that calls post_fn."""
    client = MagicMock()
    client.post = AsyncMock(side_effect=post_fn)
    client.__aenter__ = AsyncMock(return_value=client)
    client.__aexit__ = AsyncMock(return_value=None)
    return client


CONFIG = LLMConfig(
    provider="openai-compatible",
    base_url="http://localhost:8080",
    model="test",
    api_key="",
)


@pytest.mark.asyncio
async def test_call_retries_on_connect_error():
    """ConnectError triggers retry with backoff."""
    calls = []

    async def post(*a, **kw):
        calls.append(True)
        if len(calls) < 3:
            raise httpx.ConnectError("refused")
        resp = MagicMock()
        resp.status_code = 200
        resp.json.return_value = {"choices": [{"message": {"content": "OK"}}]}
        return resp

    with patch("arckit_cli.llm.httpx.AsyncClient", return_value=_mock_client(post)):
        with patch("arckit_cli.llm.asyncio.sleep", new_callable=AsyncMock):
            result = await call_llm(messages=[{"role": "user", "content": "hi"}], tools=[], config=CONFIG)

    assert len(calls) == 3  # 1 initial + 2 retries
    assert result["choices"][0]["message"]["content"] == "OK"


@pytest.mark.asyncio
async def test_call_exhausts_retries():
    """After 4 attempts (3 retries), raises RuntimeError."""
    async def post(*a, **kw):
        raise httpx.ConnectError("refused")

    with patch("arckit_cli.llm.httpx.AsyncClient", return_value=_mock_client(post)):
        with patch("arckit_cli.llm.asyncio.sleep", new_callable=AsyncMock):
            with pytest.raises(RuntimeError, match="after 4 attempts"):
                await call_llm(messages=[{"role": "user", "content": "hi"}], tools=[], config=CONFIG)


@pytest.mark.asyncio
async def test_call_retries_on_429():
    """HTTP 429 rate limit triggers retry."""
    calls = []

    async def post(*a, **kw):
        calls.append(True)
        if len(calls) == 1:
            resp = MagicMock()
            resp.status_code = 429
            resp.text = "rate limited"
            resp.request = MagicMock()
            return resp
        resp = MagicMock()
        resp.status_code = 200
        resp.json.return_value = {"choices": [{"message": {"content": "OK"}}]}
        return resp

    with patch("arckit_cli.llm.httpx.AsyncClient", return_value=_mock_client(post)):
        with patch("arckit_cli.llm.asyncio.sleep", new_callable=AsyncMock):
            result = await call_llm(messages=[{"role": "user", "content": "hi"}], tools=[], config=CONFIG)

    assert len(calls) == 2
    assert result["choices"][0]["message"]["content"] == "OK"


@pytest.mark.asyncio
async def test_call_no_retry_on_500():
    """HTTP 500 is NOT retried — raised immediately."""
    async def post(*a, **kw):
        resp = MagicMock()
        resp.status_code = 500
        resp.text = "Internal Server Error"
        resp.request = MagicMock()
        return resp

    with patch("arckit_cli.llm.httpx.AsyncClient", return_value=_mock_client(post)):
        with pytest.raises(httpx.HTTPStatusError):
            await call_llm(messages=[{"role": "user", "content": "hi"}], tools=[], config=CONFIG)


@pytest.mark.asyncio
async def test_call_retries_on_timeout():
    """Timeout triggers retry."""
    calls = []

    async def post(*a, **kw):
        calls.append(True)
        if len(calls) < 2:
            raise httpx.TimeoutException("timed out")
        resp = MagicMock()
        resp.status_code = 200
        resp.json.return_value = {"choices": [{"message": {"content": "OK"}}]}
        return resp

    with patch("arckit_cli.llm.httpx.AsyncClient", return_value=_mock_client(post)):
        with patch("arckit_cli.llm.asyncio.sleep", new_callable=AsyncMock):
            result = await call_llm(messages=[{"role": "user", "content": "hi"}], tools=[], config=CONFIG)

    assert len(calls) == 2
    assert result["choices"][0]["message"]["content"] == "OK"


# ---------------------------------------------------------------------------
# local.py — ping & config
# ---------------------------------------------------------------------------

def test_ping_endpoint_success():
    """Ping returns connected=True for 200 response."""
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "usage": {"prompt_tokens": 5, "completion_tokens": 1},
        "choices": [{"message": {"content": "OK"}}],
    }
    with patch("arckit_cli.local.httpx.post", return_value=mock_resp):
        result = _ping_endpoint("http://localhost:8080", "test-model")
    assert result["connected"] is True
    assert result["status"] == 200


def test_ping_endpoint_failure():
    """Ping returns connected=False for non-200 response."""
    mock_resp = MagicMock()
    mock_resp.status_code = 401
    with patch("arckit_cli.local.httpx.post", return_value=mock_resp):
        result = _ping_endpoint("http://localhost:8080", "test-model")
    assert result["connected"] is False
    assert result["status"] == 401


def test_ping_endpoint_connect_error():
    """Ping raises ConnectError for unreachable endpoints."""
    with patch("arckit_cli.local.httpx.post", side_effect=httpx.ConnectError("refused")):
        with pytest.raises(httpx.ConnectError):
            _ping_endpoint("http://localhost:9999", "test-model")


def test_config_save_load(tmp_path, monkeypatch):
    """Config save/load round-trips LLM values."""
    import platformdirs
    from arckit_cli import local

    monkeypatch.setattr(
        platformdirs,
        "user_config_dir",
        lambda *a: str(tmp_path / "config"),
    )
    local._get_config_path = lambda: tmp_path / "config.yaml"

    cfg = {"llm": {"base_url": "http://127.0.0.1:8080", "model": "Qwen3.6-27B"}}
    local._save_config(cfg)

    loaded = local._load_config()
    assert loaded["llm"]["base_url"] == "http://127.0.0.1:8080"
    assert loaded["llm"]["model"] == "Qwen3.6-27B"


# ---------------------------------------------------------------------------
# __init__.py — build command flags
# ---------------------------------------------------------------------------

def test_build_command_has_byo_llm_flags():
    """arckit build exposes --base-url, --model, --config, --parallel, --resume."""
    import inspect
    sig = inspect.signature(build)
    params = list(sig.parameters.keys())
    for flag in ("base_url", "model", "config", "parallel", "resume"):
        assert flag in params, f"Missing flag: {flag}"


# ---------------------------------------------------------------------------
# Retry delay schedule
# ---------------------------------------------------------------------------

def test_retry_delays_exist():
    """Retry schedule has 3 delays (max 4 attempts)."""
    assert len(_RETRY_DELAYS) == 3
    assert _RETRY_DELAYS == [2.0, 4.0, 8.0]
