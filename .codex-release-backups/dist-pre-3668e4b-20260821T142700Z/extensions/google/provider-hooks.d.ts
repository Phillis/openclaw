import { C as ProviderReplayPolicyContext, S as ProviderReplayPolicy, T as ProviderToolSchemaDiagnostic, b as ProviderReasoningOutputMode, f as ProviderDefaultThinkingPolicyContext, h as ProviderWrapStreamFnContext, it as AnyAgentTool, m as ProviderFailoverErrorContext, p as ProviderThinkingProfile, w as ProviderSanitizeReplayHistoryContext, x as ProviderReasoningOutputModeContext, y as ProviderNormalizeToolSchemasContext } from "../../types-BC3VLVBd.js";
import { y as StreamFn } from "../../types.openclaw-eGZBtvai.js";
import { rn as AgentMessage } from "../../setup-wizard-types-u0truel5.js";
//#region extensions/google/provider-hooks.d.ts
declare function wrapGoogleThinkingStream(ctx: ProviderWrapStreamFnContext): StreamFn;
declare const GOOGLE_GEMINI_PROVIDER_HOOKS: {
  resolveThinkingProfile: (context: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | undefined;
  wrapStreamFn: typeof wrapGoogleThinkingStream;
  classifyFailoverReason: ({
    code
  }: ProviderFailoverErrorContext) => "timeout" | "overloaded" | "server_error" | undefined;
  normalizeToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[];
  inspectToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[];
  buildReplayPolicy?: ((ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined) | undefined;
  sanitizeReplayHistory?: ((ctx: ProviderSanitizeReplayHistoryContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined) | undefined;
  resolveReasoningOutputMode?: ((ctx: ProviderReasoningOutputModeContext) => ProviderReasoningOutputMode | null | undefined) | undefined;
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS };