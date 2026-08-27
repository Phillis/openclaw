import { n as validateAgentParams, r as validateAgentWaitParams } from "./src-Bo4ezI_n.js";
import { h as waitForGatewayDispatch, m as unwrapGatewayMethodDispatchResponse, p as throwIfGatewayDispatchAborted } from "./server-plugins-gslZ7Mx7.js";
import { t as createAgentTurnService } from "./agent-turn-service-CivZuHPA.js";
import { n as validateGatewayMethodParams } from "./validation-CsGeElrb.js";
import { a as runWithGatewayRequestEnvelope, r as createRequestGatewayMethodRegistry, t as authorizeGatewayRequestPreDispatch } from "./server-methods-DRfU7gmf.js";
import { n as resolveAgentTurnRunObserver, r as prepareAgentRequestPreflight, t as captureAgentTurnPrincipal } from "./principal-BFhHeQvA.js";
//#region src/gateway/agent-turn/internal-facade.ts
function throwEnvelopeRejection(method, error) {
	return unwrapGatewayMethodDispatchResponse(method, {
		ok: false,
		error
	});
}
/** Typed, frame-free access to agent turns owned by the running Gateway instance. */
function createInternalAgentTurnFacade(options) {
	const isWebchatConnect = options.isWebchatConnect ?? (() => false);
	const getMethodRegistry = options.getMethodRegistry ?? createRequestGatewayMethodRegistry;
	const dispatchRaw = async (request, dispatchOptions = {}) => {
		const method = "agent";
		throwIfGatewayDispatchAborted(method, dispatchOptions.signal);
		const context = options.getContext();
		const methodRegistry = getMethodRegistry();
		const authorization = await authorizeGatewayRequestPreDispatch({
			method,
			requestParams: request,
			client: options.client,
			context,
			methodRegistry
		});
		if (authorization.error) return {
			ok: false,
			error: authorization.error
		};
		const validationError = validateGatewayMethodParams(request, validateAgentParams, method);
		if (validationError) return {
			ok: false,
			error: validationError
		};
		let acceptance;
		let final;
		let resolveAcceptance;
		let rejectAcceptance;
		let resolveFinal;
		let rejectFinal;
		let postAcceptanceError;
		const acceptancePromise = new Promise((resolve, reject) => {
			resolveAcceptance = resolve;
			rejectAcceptance = reject;
		});
		const createFinalPromise = () => new Promise((resolve, reject) => {
			resolveFinal = resolve;
			rejectFinal = reject;
			if (postAcceptanceError) reject(postAcceptanceError);
			else if (final) resolve(final);
		});
		const io = {
			emitAcceptance: (frame, meta) => {
				if (!acceptance) {
					acceptance = {
						ok: frame[0],
						payload: frame[1],
						error: frame[2],
						...meta ? { meta } : {}
					};
					resolveAcceptance?.(acceptance);
				}
			},
			emitFinal: (frame, meta) => {
				if (!final) {
					final = {
						ok: frame[0],
						payload: frame[1],
						error: frame[2],
						...meta ? { meta } : {}
					};
					resolveFinal?.(final);
				}
			}
		};
		runWithGatewayRequestEnvelope(method, options.client, async () => {
			const principal = captureAgentTurnPrincipal(options.client);
			const preflight = prepareAgentRequestPreflight({
				request,
				context,
				client: principal,
				io
			});
			if (!preflight) return;
			const onRunObserved = resolveAgentTurnRunObserver({
				principal,
				registerToolEventRecipient: context.registerToolEventRecipient
			});
			await createAgentTurnService({
				context,
				isWebchatConnect
			}).startTurn({
				preflight,
				principal,
				io,
				onRunObserved
			});
		}, {
			context,
			isWebchatConnect,
			methodRegistry,
			reject: (error) => io.emitAcceptance([
				false,
				void 0,
				error
			])
		}).then(() => {
			if (!acceptance) rejectAcceptance?.(/* @__PURE__ */ new Error(`Gateway method "${method}" completed without a response.`));
		}, (error) => {
			const dispatchError = error instanceof Error ? error : new Error(String(error));
			if (acceptance) {
				postAcceptanceError = dispatchError;
				rejectFinal?.(dispatchError);
				return;
			}
			rejectAcceptance?.(dispatchError);
		});
		return await waitForGatewayDispatch(method, (async () => {
			const first = acceptance ?? await acceptancePromise;
			if (dispatchOptions.expectFinal !== true || first.payload?.status !== "accepted") return first;
			dispatchOptions.onAccepted?.(first.payload);
			if (postAcceptanceError) throw postAcceptanceError;
			return final ?? await createFinalPromise();
		})(), dispatchOptions.timeoutMs, dispatchOptions.signal, dispatchOptions.onSignalAbort);
	};
	const dispatch = async (request, dispatchOptions = {}) => {
		return unwrapGatewayMethodDispatchResponse("agent", await dispatchRaw(request, typeof dispatchOptions === "number" ? { timeoutMs: dispatchOptions } : dispatchOptions));
	};
	const wait = async (params, timeoutMs, signal, onSignalAbort) => {
		const method = "agent.wait";
		throwIfGatewayDispatchAborted(method, signal);
		const context = options.getContext();
		const methodRegistry = getMethodRegistry();
		const authorization = await authorizeGatewayRequestPreDispatch({
			method,
			requestParams: params,
			client: options.client,
			context,
			methodRegistry
		});
		if (authorization.error) return throwEnvelopeRejection(method, authorization.error);
		const validationError = validateGatewayMethodParams(params, validateAgentWaitParams, method);
		if (validationError) return throwEnvelopeRejection(method, validationError);
		return await waitForGatewayDispatch(method, runWithGatewayRequestEnvelope(method, options.client, () => createAgentTurnService({
			context,
			isWebchatConnect
		}).waitForTurn(params), {
			context,
			isWebchatConnect,
			methodRegistry,
			reject: (error) => throwEnvelopeRejection(method, error)
		}), timeoutMs, signal, onSignalAbort);
	};
	return {
		dispatch,
		dispatchRaw,
		wait
	};
}
//#endregion
export { createInternalAgentTurnFacade as t };
