//#region packages/agent-core/src/internal-hooks.ts
const beforeToolBatchByAgent = /* @__PURE__ */ new WeakMap();
const toolBatchLifecycleByResult = /* @__PURE__ */ new WeakMap();
const syncSteeringGetterByCallback = /* @__PURE__ */ new WeakMap();
const toolExecutionPreparerByTool = /* @__PURE__ */ new WeakMap();
/** Install OpenClaw-owned loop control without adding a plugin-facing Agent option. */
function setInternalBeforeToolBatch(agent, hook) {
	if (hook) beforeToolBatchByAgent.set(agent, hook);
	else beforeToolBatchByAgent.delete(agent);
}
function getInternalBeforeToolBatch(agent) {
	return beforeToolBatchByAgent.get(agent);
}
/** Attach scheduler lifecycle ownership without widening the public admission result. */
function attachInternalToolBatchLifecycle(result, lifecycle) {
	toolBatchLifecycleByResult.set(result, lifecycle);
	return result;
}
function takeInternalToolBatchLifecycle(result) {
	const lifecycle = toolBatchLifecycleByResult.get(result);
	toolBatchLifecycleByResult.delete(result);
	return lifecycle;
}
/** Attach Agent-owned synchronous draining to the exact public async callback identity. */
function attachInternalSyncSteeringGetter(callback, syncGetter) {
	syncSteeringGetterByCallback.set(callback, syncGetter);
	return callback;
}
function getInternalSyncSteeringGetter(callback) {
	return syncSteeringGetterByCallback.get(callback);
}
/** Attach OpenClaw-owned two-phase execution without changing the public AgentTool shape. */
function attachInternalToolExecutionPreparer(tool, preparer) {
	toolExecutionPreparerByTool.set(tool, preparer);
	return tool;
}
function getInternalToolExecutionPreparer(tool) {
	return toolExecutionPreparerByTool.get(tool);
}
/** Preserve private execution ownership when an adapter replaces a tool object. */
function copyInternalToolExecutionPreparer(source, target) {
	const preparer = toolExecutionPreparerByTool.get(source);
	if (preparer) toolExecutionPreparerByTool.set(target, preparer);
	return target;
}
//#endregion
export { getInternalBeforeToolBatch as a, setInternalBeforeToolBatch as c, copyInternalToolExecutionPreparer as i, takeInternalToolBatchLifecycle as l, attachInternalToolBatchLifecycle as n, getInternalSyncSteeringGetter as o, attachInternalToolExecutionPreparer as r, getInternalToolExecutionPreparer as s, attachInternalSyncSteeringGetter as t };
