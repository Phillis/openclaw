import { C as resolveMessagePresentationButtonAction, c as isMessagePresentationInteractiveBlock, d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, h as reduceLegacyInteractiveReply } from "./payload-ByplrRCQ.js";
import { h as parseExecApprovalCommandText } from "./exec-approval-reply-CTrYYg-6.js";
import "./approval-reply-runtime-S91LFgMc.js";
import { c as hasTelegramApprovalCallbackPrefix, d as sanitizeTelegramCallbackData, n as buildTelegramOpaqueCallbackData, o as buildTelegramApprovalCallbackData, t as buildTelegramNativeCommandCallbackData, u as rewriteTelegramApprovalDecisionAlias } from "./native-command-callback-data-BhDUR-iz.js";
//#region extensions/telegram/src/question-callback-data.ts
const TELEGRAM_QUESTION_CALLBACK_PREFIX = "tgq1:";
const TELEGRAM_CALLBACK_DATA_MAX_BYTES = 64;
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function hasTelegramQuestionCallbackPrefix(data) {
	return data?.startsWith(TELEGRAM_QUESTION_CALLBACK_PREFIX) === true;
}
function buildTelegramQuestionCallbackData(callback) {
	if (!QUESTION_RECORD_ID_PATTERN.test(callback.questionId) || !Number.isInteger(callback.optionIndex) || callback.optionIndex < 0 || callback.optionIndex > 3) return;
	const data = `${TELEGRAM_QUESTION_CALLBACK_PREFIX}${callback.questionId}:${callback.optionIndex}`;
	return Buffer.byteLength(data, "utf8") <= TELEGRAM_CALLBACK_DATA_MAX_BYTES ? data : void 0;
}
function parseTelegramQuestionCallbackData(data) {
	if (!hasTelegramQuestionCallbackPrefix(data) || !data || Buffer.byteLength(data, "utf8") > TELEGRAM_CALLBACK_DATA_MAX_BYTES) return null;
	const match = /^tgq1:(ask_[a-f0-9]{32}):([0-3])$/u.exec(data);
	return match?.[1] && match[2] ? {
		questionId: match[1],
		optionIndex: Number(match[2])
	} : null;
}
//#endregion
//#region extensions/telegram/src/button-types.ts
const TELEGRAM_INTERACTIVE_ROW_SIZE = 3;
/** Reads only bounded, unambiguous Gateway-owned question option ordering. */
function resolveTelegramQuestionOptionIndices(payload) {
	const askUser = payload.channelData?.askUser;
	if (!askUser || typeof askUser !== "object" || Array.isArray(askUser)) return;
	const { questionId, optionValues } = askUser;
	if (typeof questionId !== "string" || !questionId || !Array.isArray(optionValues) || optionValues.length < 2 || optionValues.length > 4) return;
	const optionIndices = /* @__PURE__ */ new Map();
	for (const [optionIndex, optionValue] of optionValues.entries()) {
		if (typeof optionValue !== "string") return;
		const normalizedOptionValue = optionValue.trim().toLowerCase();
		if (!normalizedOptionValue || optionIndices.has(normalizedOptionValue)) return;
		optionIndices.set(normalizedOptionValue, optionIndex);
	}
	return /* @__PURE__ */ new Map([[questionId, optionIndices]]);
}
function toTelegramButtonStyle(style) {
	return style === "danger" || style === "success" || style === "primary" ? style : void 0;
}
function recordDroppedControl(button, options, reason, callbackData) {
	const callbackDataBytes = callbackData ? Buffer.byteLength(callbackData, "utf8") : void 0;
	options?.onDroppedControl?.({
		label: button.label,
		reason: callbackDataBytes !== void 0 && callbackDataBytes > 64 ? "callback_data_too_long" : reason,
		...callbackDataBytes !== void 0 ? { callbackDataBytes } : {}
	});
}
function toTelegramInlineButton(button, options) {
	const style = toTelegramButtonStyle(button.style);
	const action = resolveMessagePresentationButtonAction(button);
	if (!action) return recordDroppedControl(button, options, "invalid_action");
	if (action.type === "url") return {
		text: button.label,
		url: action.url,
		style
	};
	if (action.type === "web-app") return options?.allowWebAppButtons === true && action.url ? {
		text: button.label,
		web_app: { url: action.url },
		style
	} : recordDroppedControl(button, options, "web_app_unavailable");
	if (action.type === "approval") {
		const callbackData = buildTelegramApprovalCallbackData(action);
		return callbackData ? {
			text: button.label,
			callback_data: callbackData,
			style
		} : recordDroppedControl(button, options, "invalid_action");
	}
	if (action.type === "question") {
		const normalizedOptionValue = action.optionValue.trim().toLowerCase();
		const optionIndex = options?.questionOptionIndices?.get(action.questionId)?.get(normalizedOptionValue);
		if (optionIndex === void 0) return recordDroppedControl(button, options, "question_context_unavailable");
		const callbackData = buildTelegramQuestionCallbackData({
			questionId: action.questionId,
			optionIndex
		});
		if (!callbackData) return recordDroppedControl(button, options, "invalid_action");
		return {
			text: button.label,
			callback_data: callbackData,
			style
		};
	}
	if (action.type === "command") {
		const command = rewriteTelegramApprovalDecisionAlias(action.command.trim());
		const nativeCandidate = command ? buildTelegramNativeCommandCallbackData(command) : void 0;
		const callbackData = (nativeCandidate ? sanitizeTelegramCallbackData(nativeCandidate) : void 0) ?? (parseExecApprovalCommandText(command) ? sanitizeTelegramCallbackData(command) : void 0);
		return callbackData ? {
			text: button.label,
			callback_data: callbackData,
			style
		} : recordDroppedControl(button, options, "invalid_action", nativeCandidate);
	}
	const normalizedCallbackValue = action.value.trim();
	const callbackDataCandidate = Boolean(button.action) || hasTelegramApprovalCallbackPrefix(normalizedCallbackValue) || hasTelegramQuestionCallbackPrefix(normalizedCallbackValue) ? buildTelegramOpaqueCallbackData(action.value) : action.value;
	const callbackData = sanitizeTelegramCallbackData(callbackDataCandidate);
	return callbackData ? {
		text: button.label,
		callback_data: callbackData,
		style
	} : recordDroppedControl(button, options, "invalid_action", callbackDataCandidate);
}
function chunkInteractiveButtons(buttons, rows, options) {
	for (let i = 0; i < buttons.length; i += TELEGRAM_INTERACTIVE_ROW_SIZE) {
		const row = buttons.slice(i, i + TELEGRAM_INTERACTIVE_ROW_SIZE).map((button) => toTelegramInlineButton(button, options)).filter((button) => Boolean(button));
		if (row.length > 0) rows.push(row);
	}
}
/**
* @deprecated Use buildTelegramPresentationButtons with MessagePresentation.
*/
function buildTelegramInteractiveButtons(interactive, options) {
	const rows = reduceLegacyInteractiveReply(interactive, [], (state, block) => {
		if (block.type === "buttons") {
			chunkInteractiveButtons(block.buttons, state, options);
			return state;
		}
		if (block.type === "select") chunkInteractiveButtons(block.options.map((option) => ({
			label: option.label,
			action: option.action,
			value: option.value
		})), state, options);
		return state;
	});
	return rows.length > 0 ? rows : void 0;
}
/** Convert portable presentation controls to Telegram inline keyboard rows. */
function buildTelegramPresentationButtons(presentation, options) {
	const rows = [];
	for (const block of presentation?.blocks ?? []) {
		if (!isMessagePresentationInteractiveBlock(block)) continue;
		if (block.type === "buttons") {
			chunkInteractiveButtons(block.buttons, rows, options);
			continue;
		}
		chunkInteractiveButtons(block.options.map((option) => ({
			label: option.label,
			action: option.action,
			value: option.value
		})), rows, options);
	}
	return rows.length > 0 ? rows : void 0;
}
/** Resolve Telegram inline buttons, preserving explicit and legacy button precedence. */
function resolveTelegramInlineButtons(params, options) {
	return params.buttons ?? buildTelegramInteractiveButtons(normalizeLegacyInteractiveReply(params.interactive), options) ?? buildTelegramPresentationButtons(normalizeMessagePresentation(params.presentation), options);
}
//#endregion
export { parseTelegramQuestionCallbackData as a, hasTelegramQuestionCallbackPrefix as i, resolveTelegramInlineButtons as n, resolveTelegramQuestionOptionIndices as r, buildTelegramPresentationButtons as t };
