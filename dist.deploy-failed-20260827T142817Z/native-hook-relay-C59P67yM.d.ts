import { n as OpenClawConfig } from "./types.openclaw-CNftZ6Ix.js";
import { Dr as HookContext, Er as BeforeToolCallFailureDisposition, Tr as AgentHarnessHostCapabilities } from "./types-lxuSJRGv.js";
import { m as PluginHookToolRequesterContext } from "./hook-types-Ap6ctfh9.js";

//#region src/agents/harness/native-hook-relay-types.d.ts
type NativeHookRelayApprovalContext = Pick<HookContext, "approvalReviewerDeviceId" | "trigger" | "turnSourceAccountId" | "turnSourceChannel" | "turnSourceThreadId" | "turnSourceTo">;
declare const NATIVE_HOOK_RELAY_EVENTS: readonly ["pre_tool_use", "post_tool_use", "permission_request", "before_agent_finalize"];
declare const NATIVE_HOOK_RELAY_PROVIDERS: readonly ["codex"];
type NativeHookRelayEvent = (typeof NATIVE_HOOK_RELAY_EVENTS)[number];
type NativeHookRelayProvider = (typeof NATIVE_HOOK_RELAY_PROVIDERS)[number];
type NativeHookRelayRegistration = {
  relayId: string;
  provider: NativeHookRelayProvider;
  generationMismatchGraceExpiresAtMs?: number;
  generationMismatchGraceAcceptedGeneration?: string;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  requester?: PluginHookToolRequesterContext;
  approvalContext?: NativeHookRelayApprovalContext;
  allowedEvents: readonly NativeHookRelayEvent[];
  expiresAtMs: number;
  signal?: AbortSignal; /** Exact host policy capability for authority-bearing native callbacks. */
  runBeforeToolCall?: AgentHarnessHostCapabilities["runBeforeToolCall"]; /** Revalidates the exact admitted owner after authority-bearing awaits. */
  assertActive?: AgentHarnessHostCapabilities["assertActive"];
  onPreToolUseFailure?: (failure: {
    toolName: string;
    toolCallId: string;
    disposition: Exclude<BeforeToolCallFailureDisposition, "blocked">;
    durationMs: number;
  }) => void | Promise<void>;
};
type NativeHookRelayRegistrationHandle = NativeHookRelayRegistration & {
  generation?: string;
  shouldRelayEvent: (event: NativeHookRelayEvent) => boolean;
  toolMatcherForEvent: (event: NativeHookRelayEvent) => readonly string[] | undefined;
  commandForEvent: (event: NativeHookRelayEvent, options?: NativeHookRelayCommandForEventOptions) => string;
  renew: (ttlMs?: number) => void;
  unregister: () => void;
};
type RegisterNativeHookRelayParams = {
  provider: NativeHookRelayProvider;
  relayId?: string;
  generation?: string;
  generationMismatchGraceMs?: number;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  requester?: PluginHookToolRequesterContext;
  approvalContext?: NativeHookRelayApprovalContext;
  allowedEvents?: readonly NativeHookRelayEvent[]; /** Whether this relay should run OpenClaw loop detection from native PreToolUse hooks. */
  preToolUseLoopDetection?: boolean;
  ttlMs?: number;
  command?: NativeHookRelayCommandOptions;
  signal?: AbortSignal;
  runBeforeToolCall?: NativeHookRelayRegistration["runBeforeToolCall"];
  assertActive?: NativeHookRelayRegistration["assertActive"];
  onPreToolUseFailure?: NativeHookRelayRegistration["onPreToolUseFailure"];
};
type NativeHookRelayCommandOptions = {
  executable?: string;
  nice?: number | false;
  nodeExecutable?: string;
  timeoutMs?: number;
};
type NativeHookRelayCommandForEventOptions = {
  timeoutMs?: number;
};
type ActiveNativeHookRelayRegistrationHandle = NativeHookRelayRegistrationHandle & {
  generation: string;
};
//#endregion
//#region src/agents/harness/native-hook-relay.d.ts
/** Private bundled-runtime callbacks for retained direct-child hook policy. */
type NativeHookRelayRetention = Readonly<{
  readClaim: (rawPayload: unknown) => string | undefined;
  shouldRetainAfterForegroundClose: () => boolean;
  allowPreToolUse: (claim: string) => boolean;
  awaitForegroundAdmission?: (claim: string) => Promise<(() => boolean) | undefined>;
  onDispose: () => void;
}>;
//#endregion
export { ActiveNativeHookRelayRegistrationHandle as n, RegisterNativeHookRelayParams as r, NativeHookRelayRetention as t };