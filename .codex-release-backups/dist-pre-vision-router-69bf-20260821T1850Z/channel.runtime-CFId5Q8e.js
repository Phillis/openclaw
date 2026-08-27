import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./channel-outbound-CI0BSGM5.js";
import { b as createReplyToFanout, f as sendPayloadMediaSequence } from "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { v as renderMessagePresentationFallbackText } from "./payload-ByplrRCQ.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-_WMqEo47.js";
import "./error-runtime-oXQewkZq.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as runChannelProbe } from "./text-utility-runtime-BSdEoze8.js";
import { t as chunkTextForOutbound } from "./text-chunking-BrrQ2GHk.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { t as attachChannelToResult } from "./channel-send-result-BFAnsv6z.js";
import { b as cleanupMatrixDeliveryPlans, i as sendPollMatrix, r as sendMessageMatrix, s as sendTypingMatrix, x as reconcileMatrixUnknownSend } from "./send-suj0miew.js";
import { t as isBunRuntime } from "./runtime-BefyhPWv.js";
import { r as resolveMatrixAuth } from "./create-client-CaXqBpjI.js";
import "./client-qgFLhuDL.js";
import { n as listMatrixDirectoryPeersLive, t as listMatrixDirectoryGroupsLive } from "./directory-live-DZJNcAg_.js";
import "./runtime-api-yu9H_0mB.js";
import { t as resolveMatrixTargets } from "./resolve-targets-DQl9-ksf.js";
//#region extensions/matrix/src/matrix/probe.ts
const loadMatrixProbeRuntimeDeps = createLazyRuntimeModule(() => import("./probe.runtime-BeWbMWsd.js").then((runtimeModule) => ({ createMatrixClient: runtimeModule.createMatrixClient })));
async function probeMatrix(params) {
	return await runChannelProbe(void 0, async () => {
		const result = {
			ok: false,
			status: null,
			error: null
		};
		if (isBunRuntime()) return {
			...result,
			error: "Matrix probe requires Node (bun runtime not supported)"
		};
		if (!params.homeserver?.trim()) return {
			...result,
			error: "missing homeserver"
		};
		if (!params.accessToken?.trim()) return {
			...result,
			error: "missing access token"
		};
		const { createMatrixClient } = await loadMatrixProbeRuntimeDeps();
		const inputUserId = normalizeOptionalString(params.userId);
		const userId = await (await createMatrixClient({
			homeserver: params.homeserver,
			userId: void 0,
			accessToken: params.accessToken,
			deviceId: params.deviceId,
			persistStorage: false,
			localTimeoutMs: params.timeoutMs,
			accountId: params.accountId,
			allowPrivateNetwork: params.allowPrivateNetwork,
			ssrfPolicy: params.ssrfPolicy,
			dispatcherPolicy: params.dispatcherPolicy
		})).getUserId();
		if (inputUserId && inputUserId !== userId) return {
			...result,
			error: "Matrix access token user does not match configured userId"
		};
		return {
			...result,
			ok: true,
			userId
		};
	}, (error) => ({
		ok: false,
		status: typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : null,
		error: formatErrorMessage(error)
	}));
}
//#endregion
//#region extensions/matrix/src/outbound.ts
const MATRIX_OPENCLAW_PRESENTATION_KEY = "com.openclaw.presentation";
const MATRIX_OPENCLAW_PRESENTATION_TYPE = "message.presentation";
const MATRIX_EMPTY_PRESENTATION_FALLBACK_TEXT = "---";
function resolveMatrixChannelData(payload) {
	const raw = asOptionalRecord(payload.channelData)?.matrix;
	return asOptionalRecord(raw) ?? {};
}
function buildMatrixPresentationContent(presentation) {
	return {
		...presentation,
		version: 1,
		type: MATRIX_OPENCLAW_PRESENTATION_TYPE
	};
}
function resolveMatrixPresentationContent(payload) {
	const presentation = asOptionalRecord(asOptionalRecord(resolveMatrixChannelData(payload).extraContent)?.[MATRIX_OPENCLAW_PRESENTATION_KEY]);
	if (!presentation || presentation.version !== 1 || presentation.type !== MATRIX_OPENCLAW_PRESENTATION_TYPE) return;
	return presentation;
}
function renderMatrixPresentationPayload(params) {
	const matrixData = resolveMatrixChannelData(params.payload);
	const fallbackText = renderMessagePresentationFallbackText({
		text: params.payload.text,
		presentation: params.presentation,
		emptyFallback: MATRIX_EMPTY_PRESENTATION_FALLBACK_TEXT
	});
	return {
		...params.payload,
		text: fallbackText,
		channelData: {
			...params.payload.channelData,
			matrix: {
				...matrixData,
				extraContent: { [MATRIX_OPENCLAW_PRESENTATION_KEY]: buildMatrixPresentationContent(params.presentation) }
			}
		}
	};
}
function resolveMatrixPayloadText(payload) {
	const text = payload.text ?? "";
	if (text.trim() || !resolveMatrixPresentationContent(payload)) return text;
	return MATRIX_EMPTY_PRESENTATION_FALLBACK_TEXT;
}
function resolveMatrixExtraContent(payload) {
	const presentation = resolveMatrixPresentationContent(payload);
	return presentation ? { [MATRIX_OPENCLAW_PRESENTATION_KEY]: presentation } : void 0;
}
function resolveMatrixDeliveryProgress(onDeliveryResult) {
	return onDeliveryResult ? async (result) => {
		await onDeliveryResult(attachChannelToResult("matrix", result));
	} : void 0;
}
//#endregion
//#region extensions/matrix/src/channel.runtime.ts
const matrixChannelRuntime = {
	cleanupMatrixDeliveryPlans,
	listMatrixDirectoryGroupsLive,
	listMatrixDirectoryPeersLive,
	matrixOutbound: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "markdown",
		textChunkLimit: 4e3,
		presentationCapabilities: {
			supported: true,
			buttons: true,
			selects: true,
			context: true,
			divider: true,
			limits: { text: {
				markdownDialect: "markdown",
				supportsEdit: true
			} }
		},
		renderPresentation: ({ payload, presentation }) => renderMatrixPresentationPayload({
			payload,
			presentation
		}),
		sendPayload: async ({ cfg, to, payload, mediaLocalRoots, mediaReadFile, mediaAccess, deps, replyToId, replyToIdSource, replyToMode, threadId, accountId, audioAsVoice, deliveryQueueId, onPlatformSendDispatch, onDeliveryResult }) => {
			const send = resolveOutboundSendDep(deps, "matrix") ?? sendMessageMatrix;
			const resolvedThreadId = threadId !== void 0 && threadId !== null ? String(threadId) : void 0;
			const resolveReplyToId = createReplyToFanout({
				...replyToId != null ? { replyToId } : {},
				...replyToIdSource !== void 0 ? { replyToIdSource } : {},
				...replyToMode !== void 0 ? { replyToMode } : {}
			});
			const urls = resolveSendableOutboundReplyParts(payload).mediaUrls;
			const payloadText = resolveMatrixPayloadText(payload);
			if (urls.length > 0) {
				const sentResults = [];
				const lastResult = await sendPayloadMediaSequence({
					text: payloadText,
					mediaUrls: urls,
					send: async ({ text, mediaUrl, index, isFirst }) => await send(to, text, {
						cfg,
						mediaUrl,
						mediaAccess,
						mediaLocalRoots,
						mediaReadFile,
						replyToId: resolveReplyToId(),
						threadId: resolvedThreadId,
						accountId: accountId ?? void 0,
						audioAsVoice: payload.audioAsVoice ?? audioAsVoice,
						deliveryQueueId,
						deliveryPartIndex: index,
						deliveryPartCount: urls.length,
						onPlatformSendDispatch,
						extraContent: isFirst ? resolveMatrixExtraContent(payload) : void 0,
						onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
					}),
					onResult: (result) => {
						sentResults.push(result);
					}
				});
				if (lastResult !== void 0) {
					const receipt = createMessageReceiptFromOutboundResults({ results: sentResults });
					receipt.parts = receipt.parts.map((part, index) => ({
						...part,
						index
					}));
					return attachChannelToResult("matrix", {
						...lastResult,
						primaryMessageId: receipt.primaryPlatformMessageId,
						receipt,
						content: sentResults.map((result) => result.content).join("\n")
					});
				}
			}
			return attachChannelToResult("matrix", await send(to, payloadText, {
				cfg,
				mediaAccess,
				mediaLocalRoots,
				mediaReadFile,
				replyToId: resolveReplyToId(),
				threadId: resolvedThreadId,
				accountId: accountId ?? void 0,
				audioAsVoice: payload.audioAsVoice ?? audioAsVoice,
				deliveryQueueId,
				deliveryPartIndex: 0,
				deliveryPartCount: 1,
				onPlatformSendDispatch,
				extraContent: resolveMatrixExtraContent(payload),
				onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
			}));
		},
		sendText: async ({ cfg, to, text, deps, replyToId, threadId, accountId, audioAsVoice, deliveryQueueId, deliveryPartIndex, deliveryPartCount, onPlatformSendDispatch, onDeliveryResult }) => {
			return attachChannelToResult("matrix", await (resolveOutboundSendDep(deps, "matrix") ?? sendMessageMatrix)(to, text, {
				cfg,
				replyToId: replyToId ?? void 0,
				threadId: threadId !== void 0 && threadId !== null ? String(threadId) : void 0,
				accountId: accountId ?? void 0,
				audioAsVoice,
				deliveryQueueId,
				deliveryPartIndex,
				...deliveryQueueId !== void 0 ? { deliveryPartCount } : {},
				onPlatformSendDispatch,
				onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
			}));
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, mediaReadFile, mediaAccess, deps, replyToId, threadId, accountId, audioAsVoice, deliveryQueueId, deliveryPartIndex, deliveryPartCount, onPlatformSendDispatch, onDeliveryResult }) => {
			return attachChannelToResult("matrix", await (resolveOutboundSendDep(deps, "matrix") ?? sendMessageMatrix)(to, text, {
				cfg,
				mediaUrl,
				mediaLocalRoots,
				mediaReadFile,
				mediaAccess,
				replyToId: replyToId ?? void 0,
				threadId: threadId !== void 0 && threadId !== null ? String(threadId) : void 0,
				accountId: accountId ?? void 0,
				audioAsVoice,
				deliveryQueueId,
				deliveryPartIndex,
				...deliveryQueueId !== void 0 ? { deliveryPartCount } : {},
				onPlatformSendDispatch,
				onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
			}));
		},
		sendPoll: async ({ cfg, to, poll, threadId, accountId }) => {
			const result = await sendPollMatrix(to, poll, {
				cfg,
				threadId: threadId !== void 0 && threadId !== null ? threadId : void 0,
				accountId: accountId ?? void 0
			});
			return {
				channel: "matrix",
				messageId: result.eventId,
				roomId: result.roomId,
				pollId: result.eventId
			};
		}
	},
	probeMatrix,
	resolveMatrixAuth,
	resolveMatrixTargets,
	reconcileMatrixUnknownSend,
	sendMessageMatrix,
	sendTypingMatrix
};
//#endregion
export { matrixChannelRuntime };
