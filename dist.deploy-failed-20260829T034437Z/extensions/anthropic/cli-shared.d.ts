import { H as CliBackendResolveExecutionArgsContext, L as CliBackendConfig, z as CliBackendNormalizeConfigContext } from "../../plugin-entry-BZAeuuKK.js";
import "../../cli-backend-eVESRQMA.js";
import { a as CLAUDE_CLI_DEFAULT_MODEL_REF, d as CLAUDE_CLI_SESSION_ID_FIELDS, i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, o as CLAUDE_CLI_MODEL_ALIASES, r as CLAUDE_CLI_CLEAR_ENV, t as CLAUDE_CLI_BACKEND_ID } from "../../cli-constants-BV9xfuJz.js";
//#region extensions/anthropic/cli-shared.d.ts
/** Return whether a provider id refers to the Claude CLI backend. */
declare function isClaudeCliProvider(providerId: string): boolean;
/** Map OpenClaw's effective context budget to Claude Code's native compactor. */
declare function resolveClaudeCliAutoCompactEnv(contextTokenBudget: number | undefined): Record<string, string> | undefined;
/**
 * Map OpenClaw's fixed thinking levels to Claude Code's per-process budget.
 *
 * Claude Code 2.x reads MAX_THINKING_TOKENS for print-mode runs and a positive
 * integer requests that fixed token budget. Mandatory-adaptive models ignore
 * that projection, so they retain adaptive thinking and use --effort instead.
 * These fixed budgets match OpenClaw's canonical provider defaults in
 * packages/ai/src/providers/simple-options.ts.
 */
declare function resolveClaudeCliThinkingEnv(thinkingLevel: CliBackendResolveExecutionArgsContext["thinkingLevel"], modelId?: string): Record<string, string> | undefined;
/** Return whether the startup-probed Claude Code build supports the cache-control flag. */
declare function supportsClaudeDynamicSystemPromptSections(versionOutput: string | undefined): boolean;
/** Resolve final Claude CLI execution args for one backend invocation. */
declare function resolveClaudeCliExecutionArgs(context: CliBackendResolveExecutionArgsContext, options?: {
  excludeDynamicSystemPromptSections?: boolean;
}): string[];
/** Normalize Claude CLI backend config before registration or execution. */
declare function normalizeClaudeBackendConfig(config: CliBackendConfig, context?: CliBackendNormalizeConfigContext): CliBackendConfig;
//#endregion
export { CLAUDE_CLI_BACKEND_ID, CLAUDE_CLI_CLEAR_ENV, CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, CLAUDE_CLI_DEFAULT_MODEL_REF, CLAUDE_CLI_MODEL_ALIASES, CLAUDE_CLI_SESSION_ID_FIELDS, isClaudeCliProvider, normalizeClaudeBackendConfig, resolveClaudeCliAutoCompactEnv, resolveClaudeCliExecutionArgs, resolveClaudeCliThinkingEnv, supportsClaudeDynamicSystemPromptSections };