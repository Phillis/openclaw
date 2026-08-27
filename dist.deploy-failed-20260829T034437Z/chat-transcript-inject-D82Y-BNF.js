import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { b as persistSessionTranscriptTurn } from "./session-accessor-B-FKZX9M.js";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-ElcBJoCH.js";
//#region src/gateway/server-methods/chat-transcript-inject.ts
function resolveInjectedAssistantContent(params) {
	const labelPrefix = params.label ? `[${params.label}]\n\n` : "";
	if (params.content && params.content.length > 0) {
		if (!labelPrefix) return params.content;
		const first = params.content[0];
		if (first && typeof first === "object" && first.type === "text" && typeof first.text === "string") return [{
			...first,
			text: `${labelPrefix}${first.text}`
		}, ...params.content.slice(1)];
		return [{
			type: "text",
			text: labelPrefix.trim()
		}, ...params.content];
	}
	return [{
		type: "text",
		text: `${labelPrefix}${params.message}`
	}];
}
/** Clone Gateway display blocks into the transcript's assistant-content boundary. */
function prepareGatewayInjectedAssistantContent(content) {
	return content.map((block) => Object.assign({}, block));
}
/** Append a gateway-authored assistant message while preserving transcript parent links. */
async function appendInjectedAssistantMessageToTranscript(params) {
	const now = params.now ?? Date.now();
	const usage = {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
	const resolvedContent = resolveInjectedAssistantContent({
		message: params.message,
		label: params.label,
		content: params.content
	});
	const rawDeliveryFacts = applyAssistantDeliveryDirectives({
		role: "assistant",
		content: [{
			type: "text",
			text: params.message
		}]
	}).openclawDelivery;
	const messageBody = applyAssistantDeliveryDirectives({
		role: "assistant",
		content: prepareGatewayInjectedAssistantContent(resolvedContent),
		timestamp: now,
		stopReason: "stop",
		usage,
		api: "openai-responses",
		provider: "openclaw",
		model: "gateway-injected",
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...params.ttsSupplement ? { openclawTtsSupplement: params.ttsSupplement } : {},
		...params.abortMeta ? { openclawAbort: {
			aborted: true,
			origin: params.abortMeta.origin,
			runId: params.abortMeta.runId
		} } : {}
	});
	if (rawDeliveryFacts && messageBody.openclawDelivery === void 0) messageBody.openclawDelivery = rawDeliveryFacts;
	try {
		if (!params.transcriptPath && (!params.storePath || !params.sessionId || !params.sessionKey)) return {
			ok: false,
			error: "transcript identity not resolved"
		};
		const appended = (await persistSessionTranscriptTurn({
			sessionKey: params.sessionKey ?? "",
			...params.transcriptPath ? { sessionFile: params.transcriptPath } : {},
			...params.storePath ? { storePath: params.storePath } : {},
			...params.sessionId ? { sessionId: params.sessionId } : {},
			...params.agentId ? { agentId: params.agentId } : {}
		}, {
			updateMode: "inline",
			...params.abortMeta ? { runId: params.abortMeta.runId } : {},
			touchSessionEntry: Boolean(params.storePath && params.sessionId && params.sessionKey),
			...params.config ? { config: params.config } : {},
			messages: [{
				message: messageBody,
				idempotencyLookup: "scan-assistant",
				now,
				useRawWhenLinear: true
			}]
		})).messages[0];
		if (!appended) return {
			ok: false,
			error: "gateway-injected assistant message was not appended"
		};
		return {
			ok: true,
			messageId: appended.messageId,
			message: appended.message
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
export { prepareGatewayInjectedAssistantContent as n, appendInjectedAssistantMessageToTranscript as t };
