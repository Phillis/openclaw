//#region extensions/anthropic/cli-constants.d.ts
/**
 * Shared Claude CLI constants. These identify the synthetic backend, default
 * model refs, aliases, and session-id fields used across runtime and setup.
 */
/** Synthetic provider/backend id for Claude Code CLI-backed Anthropic models. */
declare const CLAUDE_CLI_BACKEND_ID = "claude-cli";
/** Retired OpenClaw auth profile replaced by Claude CLI's native login. */
declare const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
/** Explicit thinking opt-out for Claude CLI routes unsupported by Claude Code. */
declare const CLAUDE_CLI_OFF_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }];
  readonly defaultLevel: "off";
};
/** Non-secret marker telling OpenClaw that the installed Claude CLI owns auth. */
declare const CLAUDE_CLI_NATIVE_AUTH_MARKER: string;
/** Environment variables removed before launching OpenClaw-managed Claude CLI runs. */
declare const CLAUDE_CLI_CLEAR_ENV: readonly ["ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY_OLD", "ANTHROPIC_API_TOKEN", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_BASE_URL", "ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_UNIX_SOCKET", "CLAUDE_CODE_AUTO_COMPACT_WINDOW", "CLAUDE_CODE_DISABLE_1M_CONTEXT", "CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING", "MAX_THINKING_TOKENS", "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_OAUTH_REFRESH_TOKEN", "CLAUDE_CODE_OAUTH_SCOPES", "CLAUDE_CODE_OAUTH_TOKEN", "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR", "CLAUDE_CODE_PLUGIN_CACHE_DIR", "CLAUDE_CODE_PLUGIN_SEED_DIR", "CLAUDE_CODE_REMOTE", "CLAUDE_CODE_USE_COWORK_PLUGINS", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_VERTEX", "OTEL_EXPORTER_OTLP_ENDPOINT", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL", "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "OTEL_EXPORTER_OTLP_TRACES_PROTOCOL", "OTEL_LOGS_EXPORTER", "OTEL_METRICS_EXPORTER", "OTEL_SDK_DISABLED", "OTEL_TRACES_EXPORTER"];
/** Default Claude CLI model ref for agent defaults and live tests. */
declare const CLAUDE_CLI_DEFAULT_MODEL_REF = "claude-cli/claude-opus-5";
/** Canonical model ref routed to the Claude CLI backend by Anthropic setup. */
declare const CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF: string;
/** Default Claude CLI models allowed when setup seeds the model allowlist. */
declare const CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS: readonly ["claude-cli/claude-opus-5", "claude-cli/claude-sonnet-5", "claude-cli/claude-fable-5", "claude-cli/claude-opus-4-8", "claude-cli/claude-opus-4-7", "claude-cli/claude-sonnet-4-6", "claude-cli/claude-opus-4-6"];
/**
 * Claude CLI model ids probed when detecting an existing CLI route, canonical
 * default first. Route detection must not depend on which model is currently
 * the default: existing configs route older Claude models, so probing only the
 * default would stop advertising session creation after a default bump.
 */
declare const CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS: string[];
/** User-facing Claude CLI model aliases normalized before execution. */
declare const CLAUDE_CLI_MODEL_ALIASES: Record<string, string>;
/** JSONL fields that may contain Claude CLI session ids. */
declare const CLAUDE_CLI_SESSION_ID_FIELDS: readonly ["session_id", "sessionId", "conversation_id", "conversationId"];
//#endregion
export { CLAUDE_CLI_DEFAULT_MODEL_REF as a, CLAUDE_CLI_OFF_THINKING_PROFILE as c, CLAUDE_CLI_SESSION_ID_FIELDS as d, CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS as i, CLAUDE_CLI_PROFILE_ID as l, CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF as n, CLAUDE_CLI_MODEL_ALIASES as o, CLAUDE_CLI_CLEAR_ENV as r, CLAUDE_CLI_NATIVE_AUTH_MARKER as s, CLAUDE_CLI_BACKEND_ID as t, CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS as u };