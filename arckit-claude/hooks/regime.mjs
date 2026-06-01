// arckit-claude/hooks/regime.mjs
// True when the user's ArcKit governance framework is UK Gov. Claude Code
// exports plugin userConfig to hook subprocesses as CLAUDE_PLUGIN_OPTION_<FIELD>
// (see notify-stale-artifacts.mjs). Read at call time; off when unset.
export function ukGov() {
  return (process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK || '') === 'UK Gov';
}
