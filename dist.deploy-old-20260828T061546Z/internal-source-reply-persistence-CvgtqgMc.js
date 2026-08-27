import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { r as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-LK0MNWC3.js";
import { D as readTranscriptEventMessage, R as isOpenClawDeliveryMirrorAssistantMessage, g as findTranscriptEvent } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
import "./sessions-BI8dPUCI.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DXU5onHR.js";
import { r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-CtOvegzo.js";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-Bc9PJVw6.js";
import { l as removeManagedOutgoingMediaBlocks, o as createManagedOutgoingMediaBlocks } from "./managed-image-attachments-BmbhAxU8.js";
import { n as prepareGatewayInjectedAssistantContent } from "./chat-transcript-inject-DXxFzOXf.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/internal-source-reply-persistence.ts
const internalSourceReplyPersistenceLeases = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.internalSourceReplyPersistenceLeases"));
function collectSourceReplyMediaUrls(payload) {
	return Array.from(/* @__PURE__ */ new Set([...payload.mediaUrl ? [payload.mediaUrl] : [], ...payload.mediaUrls ?? []])).filter((value) => value.trim().length > 0);
}
async function hasPersistedInternalSourceReply(params) {
	if (!params.expectedSessionId || !params.idempotencyKey) return false;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	return await findTranscriptEvent({
		agentId: params.agentId,
		sessionId: params.expectedSessionId,
		sessionKey: params.sessionKey,
		storePath
	}, (event) => {
		const message = readTranscriptEventMessage(event);
		return message?.idempotencyKey === params.idempotencyKey && isOpenClawDeliveryMirrorAssistantMessage(message);
	}) !== void 0;
}
function resolveInternalSourceReplyPersistenceLeaseKey(params) {
	if (!params.idempotencyKey) return;
	return JSON.stringify([
		params.agentId ?? "",
		params.sessionKey,
		params.expectedSessionId ?? "",
		params.idempotencyKey
	]);
}
/** Persist the private WebChat source reply before its successful tool result becomes visible. */
async function persistInternalSourceReply(params) {
	const leaseKey = resolveInternalSourceReplyPersistenceLeaseKey(params);
	const lease = leaseKey ? internalSourceReplyPersistenceLeases.reserve([leaseKey]) : void 0;
	await lease?.wait();
	try {
		if (await hasPersistedInternalSourceReply(params)) return;
		const mediaUrls = collectSourceReplyMediaUrls(params.payload);
		const messageId = randomUUID();
		const mediaBlocks = await createManagedOutgoingMediaBlocks({
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			mediaUrls,
			messageId,
			localRoots: getAgentScopedMediaLocalRootsForSources({
				cfg: params.cfg,
				agentId: params.agentId,
				mediaSources: mediaUrls
			})
		});
		const content = [...params.payload.text ? [{
			type: "text",
			text: params.payload.text
		}] : [], ...mediaBlocks];
		const writerFence = getOwnedSessionTranscriptWriterFence();
		const appended = await appendAssistantMessageToSessionTranscript({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
			...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
			...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
			content: prepareGatewayInjectedAssistantContent(content),
			eventId: messageId,
			idempotencyKey: params.idempotencyKey,
			runId: params.runId,
			...params.sourceReplyFinal !== void 0 ? { deliveryMirror: {
				kind: "message-tool-source-reply",
				final: params.sourceReplyFinal,
				...params.toolCallId ? { toolCallId: params.toolCallId } : {},
				...params.sourceTurnId ? { sourceTurnId: params.sourceTurnId } : {}
			} } : {},
			config: params.cfg
		});
		if (!appended.ok) {
			await removeManagedOutgoingMediaBlocks({
				blocks: mediaBlocks,
				messageId
			});
			throw new Error(`Internal source reply persistence failed: ${appended.reason}`);
		}
		if (appended.messageId !== messageId) await removeManagedOutgoingMediaBlocks({
			blocks: mediaBlocks,
			messageId
		});
	} finally {
		lease?.release();
	}
}
//#endregion
export { persistInternalSourceReply };
