import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./error-runtime-CmlvK1A3.js";
import { n as rawDataToString } from "./ws-C3ckvj65.js";
import "./webhook-ingress-Bh_CUqSI.js";
import { t as buildOpenAIQuicksilverDelegationPrompt } from "./realtime-quicksilver-instructions-CUVT6eIm.js";
import { d as parseOpenAIQuicksilverEvent, n as boundOpenAIQuicksilverDelegationResult, s as chunkOpenAIQuicksilverAppendText, t as boundOpenAIQuicksilverContextItems } from "./realtime-quicksilver-wire-Y8vgTEVb.js";
//#region extensions/openai/realtime-quicksilver-delegation-controller.ts
const WEBSOCKET_OPEN = 1;
const CONSULT_FAILURE_TEXT = "The agent task failed. Tell the user it did not complete and offer to try again.";
function shortFailureReason(error) {
	return formatErrorMessage(error).replaceAll(/\s+/g, " ").trim().slice(0, 180) || "unknown error";
}
function readWireEventType(payload) {
	try {
		const decoded = JSON.parse(payload);
		return typeof decoded.type === "string" ? decoded.type : void 0;
	} catch {
		return;
	}
}
/** Owns the provider's single active delegation and its once-consumed transcript context. */
var OpenAIQuicksilverDelegationController = class {
	constructor(options) {
		this.options = options;
		this.stopped = false;
		this.transcript = [];
	}
	handleFrame(data, isBinary) {
		if (isBinary) {
			this.fail(/* @__PURE__ */ new Error("OpenAI GPT-Live sideband returned an unexpected binary frame"));
			return;
		}
		const payload = rawDataToString(data);
		if (this.options.onWireEventType) {
			const eventType = readWireEventType(payload);
			if (eventType) this.options.onWireEventType(eventType);
		}
		const event = parseOpenAIQuicksilverEvent(payload);
		if (event) this.handleEvent(event);
	}
	handleEvent(event) {
		if (this.stopped || event.kind === "ignored") return;
		if (event.kind === "unknown") {
			this.options.logger.debug?.(`OpenAI GPT-Live ignored sideband event: ${event.eventType}`);
			return;
		}
		if (event.kind === "session-started") {
			this.options.onSessionStarted?.(event.expiresAt);
			return;
		}
		if (event.kind === "transcript-delta" || event.kind === "transcript-done") {
			this.appendTranscript(event);
			this.options.onTranscript?.(event.role, event.text, event.kind === "transcript-done");
			return;
		}
		if (event.kind === "error") {
			const error = /* @__PURE__ */ new Error(`OpenAI GPT-Live sideband error: ${event.message}`);
			this.options.logger.warn(error.message);
			if (event.fatalAuth) this.options.onFatalError(error);
			return;
		}
		if (event.kind === "audio") return;
		this.startDelegation(event.id, event.prompt);
	}
	sendToActiveDelegation(text, channel) {
		const content = text.trim();
		if (this.activeDelegationId && content) this.sendAppend(this.activeDelegationId, content, channel);
	}
	stop(reason) {
		if (this.stopped) return;
		this.stopped = true;
		this.pendingDelegation = void 0;
		this.activeDelegationId = void 0;
		this.consultController?.abort(reason);
		this.consultController = void 0;
	}
	appendTranscript(event) {
		const last = this.transcript.at(-1);
		if (event.kind === "transcript-delta") {
			if (last?.role === event.role && this.partialTranscriptRole === event.role) last.text += event.text;
			else this.transcript.push({
				role: event.role,
				text: event.text
			});
			this.partialTranscriptRole = event.role;
		} else {
			if (last?.role === event.role && this.partialTranscriptRole === event.role) last.text = event.text;
			else this.transcript.push({
				role: event.role,
				text: event.text
			});
			this.partialTranscriptRole = void 0;
		}
		this.transcript = boundOpenAIQuicksilverContextItems(this.transcript);
	}
	startDelegation(id, input) {
		if (this.stopped || this.options.signal.aborted || !input.trim()) return;
		const transcript = this.transcript;
		this.transcript = [];
		this.partialTranscriptRole = void 0;
		const delegation = {
			id,
			prompt: buildOpenAIQuicksilverDelegationPrompt({
				input,
				transcript
			})
		};
		this.activeDelegationId = id;
		if (this.consultController) {
			this.pendingDelegation = delegation;
			this.consultController.abort(/* @__PURE__ */ new Error("GPT-Live delegation superseded"));
			return;
		}
		this.launchDelegation(delegation);
	}
	launchDelegation(delegation) {
		if (this.stopped || this.options.signal.aborted) return;
		const controller = new AbortController();
		this.consultController = controller;
		this.activeDelegationId = delegation.id;
		const signal = AbortSignal.any([this.options.signal, controller.signal]);
		this.runDelegation(delegation, signal).catch((error) => this.fail(toErrorObject(error, "OpenAI GPT-Live delegation failed"))).finally(() => {
			if (this.consultController !== controller) return;
			this.consultController = void 0;
			const pending = this.pendingDelegation;
			this.pendingDelegation = void 0;
			if (pending) this.launchDelegation(pending);
			else this.activeDelegationId = void 0;
		});
	}
	async runDelegation(delegation, signal) {
		let text;
		try {
			const result = await this.options.runAgentConsult({
				prompt: delegation.prompt,
				signal
			});
			if (signal.aborted) return;
			text = boundOpenAIQuicksilverDelegationResult(result.text);
		} catch (error) {
			if (signal.aborted || this.options.isCanceledError?.(error)) return;
			this.options.logger.warn(`OpenAI GPT-Live delegation consult failed: ${shortFailureReason(error)}`);
			text = CONSULT_FAILURE_TEXT;
		}
		this.sendAppend(delegation.id, text, "speakable");
	}
	sendAppend(delegationId, text, channel) {
		const socket = this.options.getSocket();
		if (this.stopped || !socket || socket.readyState !== WEBSOCKET_OPEN) return;
		for (const chunk of chunkOpenAIQuicksilverAppendText(text)) socket.send(JSON.stringify({
			type: "delegation.context.append",
			delegation_item_id: delegationId,
			channel,
			content: [{
				type: "input_text",
				text: chunk
			}]
		}));
	}
	fail(error) {
		if (this.stopped) return;
		this.options.logger.warn(error.message);
		this.options.onFatalError(error);
	}
};
//#endregion
export { OpenAIQuicksilverDelegationController as t };
