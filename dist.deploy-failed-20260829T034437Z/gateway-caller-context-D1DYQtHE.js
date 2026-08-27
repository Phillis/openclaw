import { r as getGatewayContextResolver } from "./gateway-request-scope-B19X7f09.js";
import { i as copyInternalToolExecutionPreparer, r as attachInternalToolExecutionPreparer, s as getInternalToolExecutionPreparer } from "./internal-hooks-BK9FsMLA.js";
import { r as copyCodeModeControlToolIdentity } from "./code-mode-control-tools-BA6DDloF.js";
import { i as getPluginToolMeta, n as copyPluginToolMeta } from "./tools-DL5ef4Om.js";
import { i as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-KQIZywud.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/before-tool-call-metadata.ts
const BEFORE_TOOL_CALL_WRAPPED = Symbol("beforeToolCallWrapped");
const BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS = Symbol("beforeToolCallDiagnosticOptions");
const BEFORE_TOOL_CALL_SOURCE_TOOL = Symbol("beforeToolCallSourceTool");
const BEFORE_TOOL_CALL_HOOK_CONTEXT = Symbol("beforeToolCallHookContext");
function withBeforeToolCallMetadata(tool) {
	return tool;
}
function getBeforeToolCallSourceTool(tool) {
	return withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_SOURCE_TOOL];
}
function getBeforeToolCallHookContext(tool) {
	return withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_HOOK_CONTEXT];
}
function clearBeforeToolCallWrappedMarker(tool) {
	delete withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_WRAPPED];
}
/** Return true when a tool already carries the before_tool_call wrapper marker. */
function isToolWrappedWithBeforeToolCallHook(tool) {
	return withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_WRAPPED] === true;
}
/** Toggle diagnostic event emission on an existing before_tool_call wrapper. */
function setBeforeToolCallDiagnosticsEnabled(tool, enabled) {
	const options = withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS];
	if (options) options.emitDiagnostics = enabled;
}
function getBeforeToolCallDiagnosticOptions(tool) {
	return withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS];
}
/** Copy before_tool_call marker metadata when another wrapper replaces a tool. */
function copyBeforeToolCallHookMarker(source, target) {
	if (!isToolWrappedWithBeforeToolCallHook(source)) return;
	Object.defineProperty(target, BEFORE_TOOL_CALL_WRAPPED, {
		value: true,
		enumerable: true
	});
	const diagnosticOptions = withBeforeToolCallMetadata(source)[BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS];
	if (diagnosticOptions) Object.defineProperty(target, BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS, {
		value: diagnosticOptions,
		enumerable: false
	});
	const sourceTool = getBeforeToolCallSourceTool(source);
	if (sourceTool) Object.defineProperty(target, BEFORE_TOOL_CALL_SOURCE_TOOL, {
		value: sourceTool,
		enumerable: false
	});
	const hookContext = getBeforeToolCallHookContext(source);
	Object.defineProperty(target, BEFORE_TOOL_CALL_HOOK_CONTEXT, {
		value: hookContext,
		enumerable: false
	});
}
//#endregion
//#region src/agents/channel-tool-metadata.ts
const channelAgentToolMeta = /* @__PURE__ */ new WeakMap();
/** Read channel metadata attached to a channel-owned agent tool. */
function getChannelAgentToolMeta(tool) {
	return channelAgentToolMeta.get(tool);
}
/** Attach channel ownership metadata to a concrete agent tool. */
function setChannelAgentToolMeta(tool, meta) {
	channelAgentToolMeta.set(tool, meta);
}
/** Copy channel metadata when wrapping or replacing a channel-owned tool. */
function copyChannelAgentToolMeta(source, target) {
	const meta = channelAgentToolMeta.get(source);
	if (meta) channelAgentToolMeta.set(target, meta);
}
//#endregion
//#region src/agents/tool-terminal-presentation.ts
const terminalPresentationByTool = /* @__PURE__ */ new WeakMap();
function setToolTerminalPresentation(tool, formatter) {
	terminalPresentationByTool.set(tool, formatter);
	return tool;
}
function getToolTerminalPresentation(tool) {
	return terminalPresentationByTool.get(tool);
}
function copyToolTerminalPresentation(source, target) {
	const formatter = terminalPresentationByTool.get(source);
	if (formatter) terminalPresentationByTool.set(target, formatter);
}
//#endregion
//#region src/agents/agent-tool-metadata.ts
const actionDescriptors = /* @__PURE__ */ new WeakMap();
function bindAgentToolActionDescriptor(tool, descriptor) {
	actionDescriptors.set(tool, descriptor);
}
function getAgentToolActionDescriptor(tool) {
	return actionDescriptors.get(tool);
}
function copyAgentToolActionDescriptor(source, target) {
	const descriptor = actionDescriptors.get(source);
	if (descriptor) actionDescriptors.set(target, descriptor);
}
/** Preserve only the metadata owned by a before-tool-call wrapper rebuild. */
function copyBeforeToolCallWrapperMetadata(source, target) {
	copyPluginToolMeta(source, target);
	copyChannelAgentToolMeta(source, target);
	copyToolTerminalPresentation(source, target);
	copyAgentToolActionDescriptor(source, target);
}
/** Bind the broad family at final assembly from private, process-stable owner metadata. */
function bindAssembledAgentToolActionDescriptor(tool) {
	if (actionDescriptors.has(tool)) return;
	const kind = getPluginToolMeta(tool)?.kind;
	const memory = kind === "memory" || Array.isArray(kind) && kind.includes("memory");
	actionDescriptors.set(tool, memory ? {
		family: "data",
		operation: "memory"
	} : {
		family: "tool",
		operation: "openclaw"
	});
}
/**
* Preserve identity-backed tool metadata that object spread cannot carry.
* Losing it detaches policy, hooks, presentation, and control-flow ownership.
*/
function copyAgentToolMetadata(source, target) {
	if (source === target) return target;
	copyPluginToolMeta(source, target);
	copyChannelAgentToolMeta(source, target);
	copyBeforeToolCallHookMarker(source, target);
	copyToolTerminalPresentation(source, target);
	copyCodeModeControlToolIdentity(source, target);
	copyInternalToolExecutionPreparer(source, target);
	copyAgentToolActionDescriptor(source, target);
	return target;
}
//#endregion
//#region src/agents/tools/gateway-caller-context.ts
const gatewayToolCallerStorage = new AsyncLocalStorage();
function bindGatewayToolContextResolver(resolveGatewayContext) {
	if (!resolveGatewayContext) return;
	let admittedContext;
	try {
		admittedContext = resolveGatewayContext();
	} catch {
		return () => void 0;
	}
	if (!admittedContext) return () => void 0;
	return () => {
		try {
			return resolveGatewayContext() === admittedContext ? admittedContext : void 0;
		} catch {
			return;
		}
	};
}
function composeReceiptAuthority(...predicates) {
	const checks = predicates.filter((predicate, index) => predicate !== void 0 && predicates.indexOf(predicate) === index);
	return checks.length === 0 ? void 0 : () => {
		let active = true;
		for (const check of checks) try {
			active = check() !== false && active;
		} catch {
			active = false;
		}
		return active;
	};
}
/** Builds host-owned Gateway authority from the exact admitted execution. */
function createAdmittedGatewayToolCallerIdentity(params) {
	const agentId = params.agentId?.trim();
	const sessionKey = params.sessionKey?.trim();
	if (!agentId || !sessionKey) return;
	const delegatedAuthority = getAdmittedRunDelegatedAuthority(params.admittedRunContext);
	return {
		agentId,
		sessionKey,
		operationalRunInstance: params.admittedRunContext.operationalRunInstance,
		executionIdentityToken: params.admittedRunContext.executionIdentityToken,
		gatewayContextResolver: bindGatewayToolContextResolver(getGatewayContextResolver(params.admittedRunContext)),
		receiptAuthority: composeReceiptAuthority(() => delegatedAuthority !== void 0 && getAdmittedRunDelegatedAuthority(params.admittedRunContext) === delegatedAuthority, params.receiptAuthority),
		turnSourceChannel: params.turnSourceChannel,
		turnSourceLocal: params.turnSourceLocal,
		turnSourceTo: params.turnSourceTo,
		turnSourceAccountId: params.turnSourceAccountId,
		turnSourceThreadId: params.turnSourceThreadId
	};
}
function getGatewayToolCallerIdentity() {
	return gatewayToolCallerStorage.getStore();
}
/** Process-owned work must not retain the turn that authorized its launch. */
function withoutGatewayToolCallerIdentity(run) {
	return gatewayToolCallerStorage.exit(run);
}
async function withGatewayToolCallerIdentity(identity, run) {
	if (!identity?.agentId?.trim() || !identity.sessionKey?.trim()) return await run();
	const inherited = gatewayToolCallerStorage.getStore();
	const suppliedRun = identity.operationalRunInstance;
	const inheritedRun = inherited?.operationalRunInstance;
	const inheritedOwner = !suppliedRun || inheritedRun?.instanceId === suppliedRun.instanceId && inheritedRun.runId === suppliedRun.runId ? inherited : void 0;
	const operationalRunInstance = inheritedOwner?.operationalRunInstance ?? identity.operationalRunInstance;
	const signedAgentRuntimeIdentityToken = inheritedOwner?.signedAgentRuntimeIdentityToken ?? identity.signedAgentRuntimeIdentityToken?.trim();
	const executionIdentityToken = inheritedOwner?.executionIdentityToken ?? identity.executionIdentityToken;
	const receiptAuthority = composeReceiptAuthority(inheritedOwner?.receiptAuthority, identity.receiptAuthority);
	const workerTurnClaim = inheritedOwner?.workerTurnClaim ?? identity.workerTurnClaim;
	const workerTurnExecutionIdentityCapability = inheritedOwner?.workerTurnExecutionIdentityCapability ?? identity.workerTurnExecutionIdentityCapability;
	const gatewayContextResolver = inheritedOwner?.gatewayContextResolver ?? bindGatewayToolContextResolver(identity.gatewayContextResolver);
	const cronSelfManagementJobId = identity.cronSelfManagementJobId?.trim() ?? inheritedOwner?.cronSelfManagementJobId;
	const cronToolsAllowCapture = identity.cronToolsAllowCapture ?? inheritedOwner?.cronToolsAllowCapture;
	const cronCreatorAuthorityGrant = identity.cronCreatorAuthorityGrant ?? inheritedOwner?.cronCreatorAuthorityGrant;
	const turnSourceChannel = inheritedOwner?.turnSourceChannel ?? identity.turnSourceChannel?.trim();
	const turnSourceLocal = inheritedOwner?.turnSourceLocal ?? identity.turnSourceLocal;
	const turnSourceTo = inheritedOwner?.turnSourceTo ?? identity.turnSourceTo?.trim();
	const turnSourceAccountId = inheritedOwner?.turnSourceAccountId ?? identity.turnSourceAccountId?.trim();
	const turnSourceThreadId = inheritedOwner?.turnSourceThreadId ?? identity.turnSourceThreadId;
	return await gatewayToolCallerStorage.run({
		agentId: inheritedOwner?.agentId ?? identity.agentId.trim(),
		sessionKey: inheritedOwner?.sessionKey ?? identity.sessionKey.trim(),
		...operationalRunInstance ? { operationalRunInstance } : {},
		...identity.approvalOwnerPluginId?.trim() ? { approvalOwnerPluginId: identity.approvalOwnerPluginId.trim() } : inheritedOwner?.approvalOwnerPluginId ? { approvalOwnerPluginId: inheritedOwner.approvalOwnerPluginId } : {},
		...signedAgentRuntimeIdentityToken ? { signedAgentRuntimeIdentityToken } : {},
		...cronSelfManagementJobId ? { cronSelfManagementJobId } : {},
		...cronToolsAllowCapture ? { cronToolsAllowCapture } : {},
		...cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant } : {},
		...executionIdentityToken ? { executionIdentityToken } : {},
		...receiptAuthority ? { receiptAuthority } : {},
		...workerTurnClaim ? { workerTurnClaim } : {},
		...workerTurnExecutionIdentityCapability ? { workerTurnExecutionIdentityCapability } : {},
		...gatewayContextResolver ? { gatewayContextResolver } : {},
		...turnSourceChannel ? { turnSourceChannel } : {},
		...turnSourceLocal === true ? { turnSourceLocal: true } : {},
		...turnSourceTo ? { turnSourceTo } : {},
		...turnSourceAccountId ? { turnSourceAccountId } : {},
		...turnSourceThreadId !== void 0 ? { turnSourceThreadId } : {}
	}, run);
}
/** Narrows one host-owned approval call to the exact registered policy/harness owner. */
async function withGatewayToolApprovalOwner(pluginId, run) {
	const identity = gatewayToolCallerStorage.getStore();
	const approvalOwnerPluginId = pluginId?.trim();
	if (!identity || !approvalOwnerPluginId) return await run();
	return await withGatewayToolCallerIdentity({
		...identity,
		approvalOwnerPluginId
	}, run);
}
function wrapToolWithGatewayCallerIdentity(tool, identity) {
	if (!identity?.agentId?.trim() || !identity.sessionKey?.trim() || !tool.execute) return tool;
	const wrapped = {
		...tool,
		execute: async (...args) => await withGatewayToolCallerIdentity(identity, async () => await tool.execute?.(...args))
	};
	copyAgentToolMetadata(tool, wrapped);
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (sourcePreparer) attachInternalToolExecutionPreparer(wrapped, async (params) => {
		const prepared = await withGatewayToolCallerIdentity(identity, () => sourcePreparer(params));
		return prepared.kind === "ready" ? {
			...prepared,
			execute: (start) => withGatewayToolCallerIdentity(identity, () => prepared.execute(start))
		} : prepared;
	});
	return wrapped;
}
function createGatewayToolCallerWrapper(agentId, source) {
	const identity = agentId && source?.agentSessionKey?.trim() ? {
		agentId,
		sessionKey: source.agentSessionKey.trim(),
		turnSourceChannel: source.agentChannel,
		turnSourceTo: source.currentMessagingTarget ?? source.currentChannelId ?? source.agentTo,
		turnSourceAccountId: source.agentAccountId,
		turnSourceThreadId: source.currentThreadTs ?? source.agentThreadId
	} : void 0;
	return (tool) => wrapToolWithGatewayCallerIdentity(tool, identity);
}
//#endregion
export { getBeforeToolCallHookContext as C, setBeforeToolCallDiagnosticsEnabled as E, getBeforeToolCallDiagnosticOptions as S, isToolWrappedWithBeforeToolCallHook as T, BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS as _, withGatewayToolCallerIdentity as a, BEFORE_TOOL_CALL_WRAPPED as b, bindAgentToolActionDescriptor as c, copyBeforeToolCallWrapperMetadata as d, getAgentToolActionDescriptor as f, setChannelAgentToolMeta as g, getChannelAgentToolMeta as h, withGatewayToolApprovalOwner as i, bindAssembledAgentToolActionDescriptor as l, setToolTerminalPresentation as m, createGatewayToolCallerWrapper as n, withoutGatewayToolCallerIdentity as o, getToolTerminalPresentation as p, getGatewayToolCallerIdentity as r, wrapToolWithGatewayCallerIdentity as s, createAdmittedGatewayToolCallerIdentity as t, copyAgentToolMetadata as u, BEFORE_TOOL_CALL_HOOK_CONTEXT as v, getBeforeToolCallSourceTool as w, clearBeforeToolCallWrappedMarker as x, BEFORE_TOOL_CALL_SOURCE_TOOL as y };
