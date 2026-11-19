# Modelo de amenazas — johnfelipe/arc-kit (ArcKit)

Fork de `tractorjuice/arc-kit`. Este documento parte de `plugins/arckit-claude/docs/ENFORCEMENT.md` (qué se aplica en código, qué se pide al modelo y qué pone la organización) y del código.

## 1. Sistema y fronteras de confianza

ArcKit es un arnés de gobernanza que corre **dentro del agente de IA del usuario** (Claude Code, Codex, Gemini, Kimi, OpenCode, Copilot, Paperclip, Vibe). Escribe artefactos `projects/NNN-*/ARC-*.md` en el repositorio del usuario. Los hooks (procesos Node lanzados por el runtime) son la única capa que se aplica en código (Tier 1); el resto son instrucciones al modelo (Tier 2).

Fronteras:

- **Contenido no confiable → contexto del agente:** páginas web y MCP de investigación, documentos en `projects/*/external/`, ofertas de proveedores en `projects/*/vendors/`, `.arckit/memory/sessions.md` (asuntos de commit), `specs/`. Los hooks deben tratarlo como datos.
- **Agente → sistema de archivos/shell del usuario:** los gates PreToolUse (`file-protection`, `secret-detection`, `validate-arc-filename`, `supplier-isolation`) limitan qué puede escribir/leer el agente.
- **Internet → Worker de certificación** `certification-api.arckit.org` (Cloudflare).
- **Repositorio → paquetes publicados:** converter, `push-extensions.sh`, release workflow, marketplace.

## 2. Componentes

| Componente | Código |
|---|---|
| Hooks Claude | `plugins/arckit-claude/hooks/`, `plugins/arckit-claude/hooks/hooks.json` |
| Hooks otros runtimes | `extensions/arckit-codex/hooks/` (a mano), `extensions/arckit-gemini/hooks/scripts/` (a mano), `plugins/arckit-claude/hooks/kimi-hook-adapter.mjs` |
| Contenido del plugin | `plugins/arckit-*/` (commands, agents, skills, templates, references, `scripts/`, `.mcp.json`) |
| CLI | `src/arckit_cli/`, `hatch_build.py`, `pyproject.toml` |
| Build y release | `scripts/` (converter, push-extensions, bump-version), `.github/workflows/` |
| Worker de certificación | `certification/worker/` (`wrangler.toml`, `src/*.mjs`), páginas `docs/certification/` |
| Sitio y páginas | `docs/` (arckit.org, GitHub Pages), plantilla `/arckit:pages` (`.arckit/templates/pages-template.html` y copia en plugin) |
| Paperclip | `extensions/arckit-paperclip/src/` |

Casi todo `extensions/` es copia generada (gitignored) de `plugins/`; la causa raíz se corrige en `plugins/`.

## 3. Puntos de entrada y quién los alcanza

- Payloads de hooks (stdin JSON del runtime): rutas de herramientas, comandos Bash, prompts — controlados por el modelo, que puede estar bajo prompt injection.
- Archivos del repositorio del usuario leídos por hooks al iniciar sesión o en `/arckit:pages`, `/arckit:health`, `/arckit:traceability` (cualquiera que pueda hacer push al repo del usuario).
- `arckit init` (rutas de destino, symlinks, datos del paquete).
- Worker: `GET /awareness/questions`, `POST /awareness/submit`, `GET /<id de credencial>` — público, sin login; CORS a `https://arckit.org`; rate limit 5/min por IP y ubicación.
- CI: workflows en push/PR y release por tag (`contents: write`).

## 4. Activos (críticos según el usuario)

El usuario marcó como críticos los cuatro:

1. **Clave de firma RS256 (`SIGNING_KEY`) y validez de las credenciales**, más `DRAW_HMAC_KEY` y los bancos de preguntas con respuestas (KV `QUESTIONS`).
2. **Secretos y equipo del usuario:** `.env*`, claves SSH, `.git/config`, credenciales; ejecución de código en la máquina del usuario.
3. **Confidencialidad de ofertas de proveedores** (`supplier-isolation.mjs`: el orquestador no lee la oferta cruda durante `/arckit:evaluate` y `/arckit:score`).
4. **Integridad de los paquetes publicados** (marketplace `tractorjuice/arckit-claude`, extensiones publicadas, wheel de PyPI).

Otros: datos personales en credenciales (nombre), sitio arckit.org.

## 5. Atacantes

Según el usuario, **todos importan; no se descarta ninguno**:

- Contenido hostil que el agente lee (prompt injection) para saltarse hooks o exfiltrar.
- Cualquiera en internet contra el Worker (falsificar credenciales, obtener respuestas, agotar cuota KV).
- Contribuidor malicioso vía PR, CI o cadena de suministro de releases.
- Quien puede hacer push al repo del usuario (commits, archivos en `external/`).

## 6. Controles existentes

- Tier 1 de `ENFORCEMENT.md`: protección de archivos (resuelve symlinks), detección de secretos en escritura y prompt, nombres `ARC-*`, aislamiento de proveedor, contexto de sesión cercado como datos, ningún hook concede permisos, fallo cerrado para artefactos ArcKit y documentos de proveedor (Claude Code ≥ v2.1.295).
- Worker: JWS RS256, HMAC del sorteo con nonce de un solo uso, rate limit, CORS restringido, logs sin cuerpo de petición.
- CI: acciones fijadas por SHA (`check-action-pins.py`).

## 7. Fuera de alcance / riesgo aceptado

El usuario indicó que **nada está fuera de alcance**: todos los runtimes (incluidos los que no tienen gates y Kimi) y las copias en `extensions/` cuentan.

## 8. Preguntas abiertas

- ¿Qué hallazgos ya tienen PR upstream en `tractorjuice/arc-kit`? (etiqueta `Upstream`).
