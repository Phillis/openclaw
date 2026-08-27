import { n as PlatformMessageNotDispatchedError } from "./deliver-types-w6kiySpD.js";
//#region src/channels/plugins/runtime-forwarders.ts
/**
* Runtime adapter forwarders.
*
* Creates directory and outbound adapters whose methods delegate to lazily resolved runtimes.
*/
async function resolveForwardedMethod(params) {
	try {
		const runtime = await params.getRuntime();
		const method = params.resolve(runtime);
		if (method) return method;
		throw new Error(params.unavailableMessage ?? "Runtime method is unavailable");
	} catch (error) {
		if (!params.notDispatched || error instanceof PlatformMessageNotDispatchedError) throw error;
		throw new PlatformMessageNotDispatchedError(params.unavailableMessage ?? (error instanceof Error && error.message.trim() ? error.message : "Runtime method is unavailable"), { cause: error });
	}
}
/**
* Creates a directory adapter whose methods forward to a lazily resolved runtime.
*/
function createRuntimeDirectoryLiveAdapter(params) {
	const adapter = {};
	if (params.self) adapter.self = async (ctx) => await (await resolveForwardedMethod({
		getRuntime: params.getRuntime,
		resolve: params.self
	}))(ctx);
	if (params.listPeersLive) adapter.listPeersLive = async (ctx) => await (await resolveForwardedMethod({
		getRuntime: params.getRuntime,
		resolve: params.listPeersLive
	}))(ctx);
	if (params.listGroupsLive) adapter.listGroupsLive = async (ctx) => await (await resolveForwardedMethod({
		getRuntime: params.getRuntime,
		resolve: params.listGroupsLive
	}))(ctx);
	if (params.listGroupMembers) adapter.listGroupMembers = async (ctx) => await (await resolveForwardedMethod({
		getRuntime: params.getRuntime,
		resolve: params.listGroupMembers
	}))(ctx);
	return adapter;
}
/**
* Creates outbound delegates whose methods forward to a lazily resolved runtime.
*/
function createRuntimeOutboundDelegates(params) {
	return {
		renderPresentation: params.renderPresentation ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			resolve: params.renderPresentation.resolve,
			unavailableMessage: params.renderPresentation.unavailableMessage
		}))(ctx) : void 0,
		sendPayload: params.sendPayload ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendPayload.resolve,
			unavailableMessage: params.sendPayload.unavailableMessage
		}))(ctx) : void 0,
		sendText: params.sendText ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendText.resolve,
			unavailableMessage: params.sendText.unavailableMessage
		}))(ctx) : void 0,
		sendMedia: params.sendMedia ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendMedia.resolve,
			unavailableMessage: params.sendMedia.unavailableMessage
		}))(ctx) : void 0,
		sendPoll: params.sendPoll ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendPoll.resolve,
			unavailableMessage: params.sendPoll.unavailableMessage
		}))(ctx) : void 0
	};
}
//#endregion
export { createRuntimeOutboundDelegates as n, createRuntimeDirectoryLiveAdapter as t };
