import { r as broadcastApprovalResolvedEvent } from "./approval-shared-BVHQZO7B.js";
//#region src/gateway/server-methods/approval-publication.ts
async function runSideEffect(params) {
	try {
		await params.run();
	} catch (error) {
		params.context.logGateway?.error?.(`${params.approvalKind} approvals: unified resolve ${params.effect} failed: ${String(error)}`);
	}
}
function runSynchronousSideEffect(params) {
	try {
		params.run();
	} catch (error) {
		params.context.logGateway?.error?.(`${params.approvalKind} approvals: unified resolve internal-subscriber failed: ${String(error)}`);
	}
}
async function publishAppliedApprovalResolution(params) {
	const decision = params.record.decision ?? "deny";
	const resolvedBy = params.liveRecord.resolvedBy ?? null;
	const ts = params.record.resolvedAtMs ?? Date.now();
	const event = {
		id: params.record.id,
		decision,
		resolvedBy,
		ts,
		request: params.liveRecord.request
	};
	await runSideEffect({
		context: params.context,
		approvalKind: params.record.kind,
		effect: "broadcast",
		run: () => broadcastApprovalResolvedEvent({
			approvalKind: params.record.kind,
			context: params.context,
			event,
			record: params.liveRecord
		})
	});
	const nativeApprovalKind = params.record.kind;
	if (nativeApprovalKind === "exec" || nativeApprovalKind === "plugin") runSynchronousSideEffect({
		context: params.context,
		approvalKind: nativeApprovalKind,
		run: () => params.context.approvalEvents?.publishResolved(nativeApprovalKind, event)
	});
	if (params.record.kind === "exec" && params.forwarder) await runSideEffect({
		context: params.context,
		approvalKind: "exec",
		effect: "forwarder",
		run: () => params.forwarder.handleResolved(event)
	});
	if (params.record.kind === "exec" && params.iosPushDelivery?.handleResolved) await runSideEffect({
		context: params.context,
		approvalKind: "exec",
		effect: "ios-push",
		run: () => params.iosPushDelivery.handleResolved(event)
	});
	if (params.record.kind === "plugin" && params.forwarder?.handlePluginApprovalResolved) await runSideEffect({
		context: params.context,
		approvalKind: "plugin",
		effect: "forwarder",
		run: () => params.forwarder.handlePluginApprovalResolved(event)
	});
	if (params.record.kind === "plugin" && params.pluginIosPushDelivery?.handleResolved) await runSideEffect({
		context: params.context,
		approvalKind: "plugin",
		effect: "ios-push",
		run: () => params.pluginIosPushDelivery.handleResolved(event)
	});
}
//#endregion
export { publishAppliedApprovalResolution as t };
