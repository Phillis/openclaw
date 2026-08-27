import { O as getActiveDiagnosticTraceContext } from "./diagnostic-events-Djn4AVRp.js";
import { b as runBeforeToolCallHook, l as rewrapToolWithBeforeToolCallHook, m as bindAgentToolSourceExecutionGuard } from "./agent-tools.before-tool-call-BzRsADjV.js";
import { r as attachInternalToolExecutionPreparer, s as getInternalToolExecutionPreparer } from "./internal-hooks-BK9FsMLA.js";
import { a as isRetainedAdmittedRunDelegatedAuthorityActive, i as getAdmittedRunDelegatedAuthority, l as retainAdmittedRunDelegatedAuthority } from "./admitted-run-context-BxSN0sUe.js";
import { c as withGatewayToolApprovalOwner, d as copyAgentToolMetadata, l as withGatewayToolCallerIdentity, o as createAdmittedGatewayToolCallerIdentity, t as callGatewayTool, u as wrapToolWithGatewayCallerIdentity } from "./gateway-O0XoIBU1.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-D6EJ_Q3z.js";
import { t as wrapToolWithAbortSignal } from "./agent-tools.abort-Ck8DW_UL.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-Mtb_s-wH.js";
import path from "node:path";
//#region src/agents/harness/host-capability.ts
const MAX_NATIVE_OPERATION_CWD_BYTES = 4096;
const retainedBeforeToolCallRunners = /* @__PURE__ */ new WeakMap();
/** Internal core-only lease for an already-created host policy callback. */
function retainBeforeToolCallForNativeHookRelay(runBeforeToolCall) {
	return retainedBeforeToolCallRunners.get(runBeforeToolCall)?.();
}
function normalizeNativeOperationCwd(value, attemptCwd) {
	if (typeof value !== "string") throw new Error("native operation cwd must be a string");
	const normalized = value.trim();
	if (!normalized) throw new Error("native operation cwd must not be empty");
	if (Buffer.byteLength(normalized, "utf8") > MAX_NATIVE_OPERATION_CWD_BYTES) throw new Error(`native operation cwd must not exceed ${MAX_NATIVE_OPERATION_CWD_BYTES} bytes`);
	for (let index = 0; index < normalized.length; index += 1) {
		const code = normalized.charCodeAt(index);
		if (code < 32 || code === 127) throw new Error("native operation cwd must not contain control characters");
	}
	return path.resolve(attemptCwd ?? process.cwd(), normalized);
}
function freezeSnapshot(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object" || seen.has(value)) return value;
	seen.add(value);
	for (const nested of Object.values(value)) freezeSnapshot(nested, seen);
	return Object.freeze(value);
}
function cloneSnapshot(value) {
	return freezeSnapshot(structuredClone(value));
}
function gateBoundTool(tool, assertActive) {
	const execute = tool.execute;
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (!execute && !sourcePreparer) return tool;
	const gated = {
		...tool,
		...execute ? { execute: async (...args) => {
			assertActive();
			const result = await execute(...args);
			assertActive();
			return result;
		} } : {}
	};
	copyAgentToolMetadata(tool, gated);
	if (sourcePreparer) attachInternalToolExecutionPreparer(gated, async (preparationParams) => {
		assertActive();
		const prepared = await sourcePreparer(preparationParams);
		try {
			assertActive();
		} catch (error) {
			prepared.dispose();
			throw error;
		}
		if (prepared.kind === "immediate") return prepared;
		return {
			...prepared,
			execute: async (onImplementationStart) => {
				assertActive();
				const result = await prepared.execute(onImplementationStart);
				assertActive();
				return result;
			}
		};
	});
	return gated;
}
function createBoundCallerIdentity(params) {
	return createAdmittedGatewayToolCallerIdentity({
		admittedRunContext: params.admittedRunContext,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		turnSourceChannel: params.messageChannel ?? params.messageProvider,
		turnSourceTo: params.currentMessagingTarget ?? params.currentChannelId,
		turnSourceAccountId: params.agentAccountId,
		turnSourceThreadId: params.currentThreadTs
	});
}
/** Creates a closure-bound capability before plugin invocation. */
function createAgentHarnessHostCapabilities(params) {
	const attempt = params.attempt;
	const operationalRunInstance = attempt.admittedRunContext.operationalRunInstance;
	const delegatedAuthority = getAdmittedRunDelegatedAuthority(attempt.admittedRunContext);
	if (!delegatedAuthority) throw new Error("agent harness host capability requires active admitted run authority");
	let active = true;
	const capabilityAbortController = new AbortController();
	const assertActive = () => {
		if (!active || attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance || getAdmittedRunDelegatedAuthority(attempt.admittedRunContext) !== delegatedAuthority) throw new Error("agent harness host capability is no longer active");
	};
	const callerIdentity = createBoundCallerIdentity(attempt);
	const requester = {
		...attempt.messageChannel ?? attempt.messageProvider ? { channel: attempt.messageChannel ?? attempt.messageProvider ?? void 0 } : {},
		...attempt.agentAccountId ? { accountId: attempt.agentAccountId } : {},
		...attempt.senderId ? { senderId: attempt.senderId } : {},
		...attempt.senderIsOwner !== void 0 ? { senderIsOwner: attempt.senderIsOwner } : {},
		...attempt.memberRoleIds?.length ? { roleIds: Object.freeze([...attempt.memberRoleIds]) } : {}
	};
	const config = attempt.config ? cloneSnapshot(attempt.config) : void 0;
	const skillsSnapshot = attempt.skillsSnapshot ? cloneSnapshot(attempt.skillsSnapshot) : void 0;
	const skillUsagePaths = attempt.sandbox?.skillUsagePaths ? cloneSnapshot(attempt.sandbox.skillUsagePaths) : void 0;
	const hookContext = Object.freeze({
		...attempt.agentId ? { agentId: attempt.agentId } : {},
		...config ? { config } : {},
		...attempt.cwd ? { cwd: attempt.cwd } : {},
		...attempt.workspaceDir ? { workspaceDir: attempt.workspaceDir } : {},
		...attempt.sessionKey ? { sessionKey: attempt.sessionKey } : {},
		...attempt.sessionId ? { sessionId: attempt.sessionId } : {},
		runId: attempt.runId,
		...buildAgentHookContextChannelFields(attempt),
		...Object.keys(requester).length > 0 ? { requester: Object.freeze(requester) } : {},
		...getActiveDiagnosticTraceContext() ? { trace: getActiveDiagnosticTraceContext() } : {},
		...skillsSnapshot ? { skillsSnapshot } : {},
		...skillUsagePaths ? { skillUsagePaths } : {},
		...attempt.onToolOutcome ? { onToolOutcome: attempt.onToolOutcome } : {},
		...attempt.allocateToolOutcomeOrdinal ? { allocateToolOutcomeOrdinal: attempt.allocateToolOutcomeOrdinal } : {},
		...attempt.sandbox?.enabled && attempt.sandbox.workspaceAccess === "rw" && attempt.sandbox.fsBridge ? { sandbox: Object.freeze({
			root: attempt.sandbox.workspaceDir,
			bridge: attempt.sandbox.fsBridge
		}) } : {},
		loopDetection: cloneSnapshot(resolveToolLoopDetectionConfig({
			cfg: config,
			agentId: attempt.agentId
		})),
		trigger: attempt.trigger,
		approvalReviewerDeviceId: attempt.approvalReviewerDeviceId,
		turnSourceChannel: attempt.messageChannel ?? attempt.messageProvider,
		turnSourceTo: attempt.currentMessagingTarget ?? attempt.currentChannelId,
		turnSourceAccountId: attempt.agentAccountId,
		turnSourceThreadId: attempt.currentThreadTs
	});
	const withCaller = async (run) => await withGatewayToolCallerIdentity(callerIdentity, run);
	const assertRetainedActive = () => {
		if (attempt.abortSignal?.aborted || attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance || !isRetainedAdmittedRunDelegatedAuthorityActive(attempt.admittedRunContext)) throw new Error("agent harness retained host policy is no longer active");
	};
	const runBeforeToolCallWithAssertion = async (assertCurrent, { nativeOperation, approvalMode, ...request }) => {
		assertCurrent();
		const hostApprovalMode = approvalMode === "defer" ? "defer" : "request";
		const actionCwd = nativeOperation?.cwd !== void 0 ? normalizeNativeOperationCwd(nativeOperation.cwd, hookContext.cwd) : void 0;
		const actionHookContext = actionCwd ? Object.freeze({
			...hookContext,
			cwd: actionCwd
		}) : hookContext;
		const result = await withCaller(async () => await runBeforeToolCallHook({
			...request,
			approvalMode: hostApprovalMode,
			ctx: actionHookContext
		}));
		assertCurrent();
		return result;
	};
	const runBeforeToolCall = async (request) => await runBeforeToolCallWithAssertion(assertActive, request);
	retainedBeforeToolCallRunners.set(runBeforeToolCall, () => {
		const release = retainAdmittedRunDelegatedAuthority(attempt.admittedRunContext);
		return release ? Object.freeze({
			assertActive: assertRetainedActive,
			release,
			runBeforeToolCall: async (request) => await runBeforeToolCallWithAssertion(assertRetainedActive, request)
		}) : void 0;
	});
	return {
		capabilities: Object.freeze({
			kind: "agent-harness-host-capability",
			version: 1,
			assertActive,
			bindToolSurface: (tools, options) => {
				assertActive();
				const boundAbortSignal = attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, capabilityAbortController.signal]) : capabilityAbortController.signal;
				const bindingCwd = options?.cwd !== void 0 ? normalizeNativeOperationCwd(options.cwd, hookContext.cwd) : void 0;
				const bindingHookContext = bindingCwd ? Object.freeze({
					...hookContext,
					cwd: bindingCwd
				}) : hookContext;
				return tools.map((tool) => bindAgentToolSourceExecutionGuard(tool, assertActive)).map((tool) => rewrapToolWithBeforeToolCallHook(tool, bindingHookContext)).map((tool) => callerIdentity ? wrapToolWithGatewayCallerIdentity(tool, callerIdentity) : tool).map((tool) => wrapToolWithAbortSignal(tool, boundAbortSignal)).map((tool) => gateBoundTool(tool, assertActive));
			},
			runBeforeToolCall,
			requestApproval: async (request) => {
				assertActive();
				const result = await withCaller(async () => await withGatewayToolApprovalOwner(params.pluginId, async () => await callGatewayTool("plugin.approval.request", { timeoutMs: request.transportTimeoutMs ?? request.timeoutMs }, {
					title: request.title,
					description: request.description,
					severity: request.severity,
					toolName: request.toolName,
					toolCallId: request.toolCallId,
					timeoutMs: request.timeoutMs,
					twoPhase: true,
					...request.allowedDecisions ? { allowedDecisions: request.allowedDecisions } : {}
				}, {
					expectFinal: false,
					requireAgentRuntimeIdentity: true
				})));
				assertActive();
				return result;
			},
			waitForApproval: async (request) => {
				assertActive();
				const result = await withCaller(async () => await callGatewayTool("plugin.approval.waitDecision", { timeoutMs: request.transportTimeoutMs ?? request.timeoutMs }, { id: request.approvalId }, { signal: request.signal }));
				assertActive();
				return result?.id === request.approvalId ? result.decision : void 0;
			}
		}),
		close: () => {
			if (!active) return;
			active = false;
			capabilityAbortController.abort();
		}
	};
}
//#endregion
export { retainBeforeToolCallForNativeHookRelay as n, createAgentHarnessHostCapabilities as t };
