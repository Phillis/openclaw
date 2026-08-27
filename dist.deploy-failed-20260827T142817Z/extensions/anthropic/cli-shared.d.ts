import { L as CliBackendConfig, R as CliBackendNormalizeConfigContext, V as CliBackendResolveExecutionArgsContext } from "../../types-R6eI-mj_.js";
import { a as CLAUDE_CLI_DEFAULT_MODEL_REF, c as CLAUDE_CLI_SESSION_ID_FIELDS, i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, n as CLAUDE_CLI_BACKEND_ID, o as CLAUDE_CLI_MODEL_ALIASES } from "../../cli-constants-3GA7CTnr.js";

//#region extensions/anthropic/cli-shared.d.ts
/** Environment variables removed before launching OpenClaw-managed Claude CLI runs. */
declare const CLAUDE_CLI_CLEAR_ENV: readonly ["ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY_OLD", "ANTHROPIC_API_TOKEN", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_BASE_URL", "ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_UNIX_SOCKET", "CLAUDE_CONFIG_DIR", "CLAUDE_CODE_AUTO_COMPACT_WINDOW", "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_OAUTH_REFRESH_TOKEN", "CLAUDE_CODE_OAUTH_SCOPES", "CLAUDE_CODE_OAUTH_TOKEN", "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR", "CLAUDE_CODE_PLUGIN_CACHE_DIR", "CLAUDE_CODE_PLUGIN_SEED_DIR", "CLAUDE_CODE_REMOTE", "CLAUDE_CODE_USE_COWORK_PLUGINS", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_VERTEX", "OTEL_EXPORTER_OTLP_ENDPOINT", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL", "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "OTEL_EXPORTER_OTLP_TRACES_PROTOCOL", "OTEL_LOGS_EXPORTER", "OTEL_METRICS_EXPORTER", "OTEL_SDK_DISABLED", "OTEL_TRACES_EXPORTER"];
/** Explicit thinking opt-out for Claude CLI routes unsupported by Claude Code. */
declare const CLAUDE_CLI_OFF_THINKING_PROFILE: {
  readonly levels: readonly [{
    readonly id: "off";
  }];
  readonly defaultLevel: "off";
};
/** Return whether a provider id refers to the Claude CLI backend. */
declare function isClaudeCliProvider(providerId: string): boolean;
/** Map OpenClaw's effective context budget to Claude Code's native compactor. */
declare function resolveClaudeCliAutoCompactEnv(contextTokenBudget: number | undefined): Record<string, string> | undefined;
/** Resolve final Claude CLI execution args for one backend invocation. */
declare function resolveClaudeCliExecutionArgs(context: CliBackendResolveExecutionArgsContext): string[];
/** Normalize Claude CLI backend config before registration or execution. */
declare function normalizeClaudeBackendConfig(config: CliBackendConfig, context?: CliBackendNormalizeConfigContext): CliBackendConfig;
//#endregion
export { CLAUDE_CLI_BACKEND_ID, CLAUDE_CLI_CLEAR_ENV, CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, CLAUDE_CLI_DEFAULT_MODEL_REF, CLAUDE_CLI_MODEL_ALIASES, CLAUDE_CLI_OFF_THINKING_PROFILE, CLAUDE_CLI_SESSION_ID_FIELDS, isClaudeCliProvider, normalizeClaudeBackendConfig, resolveClaudeCliAutoCompactEnv, resolveClaudeCliExecutionArgs };