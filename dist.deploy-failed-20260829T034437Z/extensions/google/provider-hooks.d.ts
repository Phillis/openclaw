import { At as ProviderThinkingProfile, Dt as ProviderFailoverErrorContext, Ft as ProviderReplayPolicy, It as ProviderReplayPolicyContext, Lt as ProviderSanitizeReplayHistoryContext, Mt as ProviderNormalizeToolSchemasContext, Nt as ProviderReasoningOutputMode, Ot as ProviderWrapStreamFnContext, Pt as ProviderReasoningOutputModeContext, Rt as ProviderToolSchemaDiagnostic, _n as AnyAgentTool, kt as ProviderDefaultThinkingPolicyContext } from "../../acpx-D5fMZfg0.js";
import { y as StreamFn } from "../../types.openclaw-Ca71eRYk.js";
import { vn as AgentMessage } from "../../setup-wizard-types-BoxqfOlR.js";
import "../../types-d78mIH9j.js";
//#region extensions/google/provider-hooks.d.ts
declare function wrapGoogleThinkingStream(ctx: ProviderWrapStreamFnContext): StreamFn;
declare const GOOGLE_GEMINI_PROVIDER_HOOKS: {
  resolveThinkingProfile: (context: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | undefined;
  wrapStreamFn: typeof wrapGoogleThinkingStream;
  classifyFailoverReason: ({ code }: ProviderFailoverErrorContext) => "overloaded" | "timeout" | "server_error" | undefined;
  normalizeToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[];
  inspectToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[];
  buildReplayPolicy?: ((ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined) | undefined;
  sanitizeReplayHistory?: ((ctx: ProviderSanitizeReplayHistoryContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined) | undefined;
  resolveReasoningOutputMode?: ((ctx: ProviderReasoningOutputModeContext) => ProviderReasoningOutputMode | null | undefined) | undefined;
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS };