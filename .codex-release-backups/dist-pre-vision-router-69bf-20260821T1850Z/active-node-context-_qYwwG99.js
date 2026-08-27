//#region src/infra/active-node-context.ts
let activeNodeContext = null;
function snapshotActiveNodeContext(context) {
	return {
		nodeId: context.nodeId,
		...context.pairingGeneration ? { pairingGeneration: context.pairingGeneration } : {}
	};
}
/** Publishes the gateway's current active-node choice without volatile timestamps. */
function setActiveNodeContext(next, options) {
	activeNodeContext = next ? {
		...next,
		...options
	} : null;
}
/** Revalidates the published node before projecting it into an agent prompt. */
function getCurrentActiveNodeContext() {
	if (!activeNodeContext) return null;
	try {
		if (activeNodeContext.isCurrent && !activeNodeContext.isCurrent()) return null;
	} catch {
		return null;
	}
	return snapshotActiveNodeContext(activeNodeContext);
}
/** Formats the stable authenticated id; node-controlled labels stay out of prompt text. */
function formatActiveNodeContextLabel(context) {
	return context?.nodeId;
}
//#endregion
export { getCurrentActiveNodeContext as n, setActiveNodeContext as r, formatActiveNodeContextLabel as t };
