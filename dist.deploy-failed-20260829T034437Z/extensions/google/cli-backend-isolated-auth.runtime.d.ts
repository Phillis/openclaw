//#region extensions/google/cli-backend-isolated-auth.runtime.d.ts
declare const GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS: Record<string, string>;
type GeminiCliRestrictedAuthContext = {
  workspaceDir?: string;
  baseEnv?: Record<string, string>;
  systemSettingsPath?: string;
  isolatedCompletionPrompt?: string;
  isolatedCompletionSystemPrompt?: string;
};
type GeminiCliAmbientAuth = {
  selectedType?: string;
  envOverrides: Record<string, string>;
  safeSettings: Record<string, unknown>;
};
declare function isolatedCompletionInputError(message: string): Error & {
  code: "input-rejected";
};
declare function isolatedCompletionUnsupportedError(message: string): Error & {
  code: "unsupported";
};
declare function assertGeminiCliLiteralIsolatedPrompt(ctx: GeminiCliRestrictedAuthContext): boolean;
declare function readGeminiCliJsonObject(filePath: string | undefined): Promise<Record<string, unknown>>;
declare function resolveGeminiCliTrustedTransportEnv(ctx: GeminiCliRestrictedAuthContext): Promise<Record<string, string>>;
declare function resolveGeminiCliAmbientAuth(ctx: GeminiCliRestrictedAuthContext): Promise<GeminiCliAmbientAuth>;
//#endregion
export { GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS, GeminiCliRestrictedAuthContext, assertGeminiCliLiteralIsolatedPrompt, isolatedCompletionInputError, isolatedCompletionUnsupportedError, readGeminiCliJsonObject, resolveGeminiCliAmbientAuth, resolveGeminiCliTrustedTransportEnv };