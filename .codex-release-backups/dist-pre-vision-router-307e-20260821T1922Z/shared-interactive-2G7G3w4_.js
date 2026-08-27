import { C as resolveMessagePresentationButtonAction, S as resolveMessagePresentationActionValue, T as resolveMessagePresentationOptionAction, h as reduceLegacyInteractiveReply } from "./payload-ByplrRCQ.js";
import { Y as parseCustomId } from "./discord-BinpTEur.js";
import { t as buildDiscordApprovalCustomId } from "./approval-custom-id-CGSBieYi.js";
//#region extensions/discord/src/custom-id-codec.ts
/**
* URI-component codec for values embedded in `k=v;` custom-id grammars
* (exec approvals, model picker, command args, agent components).
* Decode falls back to the raw value: Discord redelivers old component ids
* indefinitely and historical values may predate strict encoding.
*/
function encodeCustomIdComponent(value) {
	return encodeURIComponent(value);
}
function decodeCustomIdComponent(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
/**
* Minimal field escape for the versioned `occomp`/`ocmodal` grammar: only `%`
* and the `;` field separator are escaped to preserve the 100-char custom-id
* budget. The wire format is versioned (`e=1`); do not swap this for the URI
* codec — in-flight component ids must keep decoding byte-exactly.
*/
function escapeCustomIdFieldValue(value) {
	return value.replace(/%/g, "%25").replace(/;/g, "%3B");
}
function needsCustomIdFieldEscaping(value) {
	return /[%;]/.test(value);
}
function unescapeCustomIdFieldValue(value) {
	return value.replace(/%(25|3B)/gi, (match) => match.toLowerCase() === "%25" ? "%" : ";");
}
//#endregion
//#region extensions/discord/src/component-custom-id.ts
const DISCORD_COMPONENT_CUSTOM_ID_KEY = "occomp";
const DISCORD_MODAL_CUSTOM_ID_KEY = "ocmodal";
const DISCORD_ACTIVITY_CUSTOM_ID_KEY = "ocactivity";
const ENCODED_CUSTOM_ID_VERSION = "1";
const DISCORD_ACTIVITY_CUSTOM_ID_PREFIX = `${DISCORD_ACTIVITY_CUSTOM_ID_KEY}${ENCODED_CUSTOM_ID_VERSION}_`;
function isValidDiscordActivityWidgetId(widgetId) {
	return /^[A-Za-z0-9_-]{22}$/.test(widgetId);
}
function buildDiscordActivityCustomId(widgetId) {
	return `${DISCORD_ACTIVITY_CUSTOM_ID_PREFIX}${widgetId}`;
}
function parseDiscordActivityCustomId(id) {
	if (id.startsWith(DISCORD_ACTIVITY_CUSTOM_ID_PREFIX)) {
		const widgetId = id.slice(DISCORD_ACTIVITY_CUSTOM_ID_PREFIX.length);
		return isValidDiscordActivityWidgetId(widgetId) ? { widgetId } : null;
	}
	const parsed = parseCustomId(id);
	if (parsed.key !== DISCORD_ACTIVITY_CUSTOM_ID_KEY || parsed.data.v !== ENCODED_CUSTOM_ID_VERSION || typeof parsed.data.wid !== "string" || !isValidDiscordActivityWidgetId(parsed.data.wid)) return null;
	return { widgetId: parsed.data.wid };
}
function parseDiscordActivityCustomIdForInteraction(id) {
	const parsed = parseDiscordActivityCustomId(id);
	return parsed ? {
		key: DISCORD_ACTIVITY_CUSTOM_ID_KEY,
		data: { widgetId: parsed.widgetId }
	} : parseCustomId(id);
}
function decodeParsedCustomIdData(data) {
	if (data.e !== ENCODED_CUSTOM_ID_VERSION) return data;
	return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, typeof value === "string" ? unescapeCustomIdFieldValue(value) : value]));
}
function buildDiscordComponentCustomId(params) {
	const encoded = needsCustomIdFieldEscaping(params.componentId) || needsCustomIdFieldEscaping(params.modalId ?? "");
	const componentId = encoded ? escapeCustomIdFieldValue(params.componentId) : params.componentId;
	const base = encoded ? `${DISCORD_COMPONENT_CUSTOM_ID_KEY}:e=${ENCODED_CUSTOM_ID_VERSION};cid=${componentId}` : `${DISCORD_COMPONENT_CUSTOM_ID_KEY}:cid=${componentId}`;
	const modalId = params.modalId;
	if (!modalId) return base;
	return `${base};mid=${encoded ? escapeCustomIdFieldValue(modalId) : modalId}`;
}
function buildDiscordModalCustomId(modalId) {
	return needsCustomIdFieldEscaping(modalId) ? `${DISCORD_MODAL_CUSTOM_ID_KEY}:e=${ENCODED_CUSTOM_ID_VERSION};mid=${escapeCustomIdFieldValue(modalId)}` : `${DISCORD_MODAL_CUSTOM_ID_KEY}:mid=${modalId}`;
}
function parseDiscordComponentCustomId(id) {
	const parsed = parseCustomId(id);
	if (parsed.key !== "occomp") return null;
	const data = decodeParsedCustomIdData(parsed.data);
	const componentId = data.cid;
	if (typeof componentId !== "string" || !componentId.trim()) return null;
	const modalId = data.mid;
	return {
		componentId,
		modalId: typeof modalId === "string" && modalId.trim() ? modalId : void 0
	};
}
function parseDiscordModalCustomId(id) {
	const parsed = parseCustomId(id);
	if (parsed.key !== "ocmodal") return null;
	const modalId = decodeParsedCustomIdData(parsed.data).mid;
	if (typeof modalId !== "string" || !modalId.trim()) return null;
	return modalId;
}
function isDiscordComponentWildcardRegistrationId(id) {
	return /^__openclaw_discord_component_[a-z_]+_wildcard__$/.test(id);
}
function parseDiscordComponentCustomIdForInteraction(id) {
	if (id === "*" || isDiscordComponentWildcardRegistrationId(id)) return {
		key: "*",
		data: {}
	};
	const parsed = parseCustomId(id);
	if (parsed.key !== "occomp") return parsed;
	return {
		key: "*",
		data: decodeParsedCustomIdData(parsed.data)
	};
}
function parseDiscordModalCustomIdForInteraction(id) {
	if (id === "*" || isDiscordComponentWildcardRegistrationId(id)) return {
		key: "*",
		data: {}
	};
	const parsed = parseCustomId(id);
	if (parsed.key !== "ocmodal") return parsed;
	return {
		key: "*",
		data: decodeParsedCustomIdData(parsed.data)
	};
}
//#endregion
//#region extensions/discord/src/question-custom-id.ts
const DISCORD_QUESTION_CUSTOM_ID_MAX_CHARS = 100;
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function buildDiscordQuestionCustomId(callback) {
	if (!QUESTION_RECORD_ID_PATTERN.test(callback.questionId) || !Number.isInteger(callback.optionIndex) || callback.optionIndex < 0 || callback.optionIndex > 3) return;
	const customId = `ocq:id=${callback.questionId};i=${callback.optionIndex}`;
	return customId.length <= DISCORD_QUESTION_CUSTOM_ID_MAX_CHARS ? customId : void 0;
}
function parseDiscordQuestionData(data) {
	const questionId = typeof data.id === "string" ? data.id : "";
	const rawIndex = typeof data.i === "string" ? data.i : typeof data.i === "number" ? String(data.i) : "";
	if (!QUESTION_RECORD_ID_PATTERN.test(questionId) || !/^[0-3]$/u.test(rawIndex)) return null;
	return {
		questionId,
		optionIndex: Number(rawIndex)
	};
}
//#endregion
//#region extensions/discord/src/shared-interactive.ts
function resolveDiscordInteractiveButtonStyle(style) {
	return style ?? "secondary";
}
function resolveDiscordSelectOptionValue(option) {
	return resolveMessagePresentationActionValue(resolveMessagePresentationOptionAction(option));
}
function resolveDiscordSelectCallbackDataKind(options) {
	const renderableOptions = options.filter((option) => resolveDiscordSelectOptionValue(option));
	if (renderableOptions.length === 0) return;
	if (renderableOptions.every((option) => option.action?.type === "command")) return "command";
	if (renderableOptions.every((option) => option.action?.type === "callback")) return "callback";
	if (renderableOptions.some((option) => option.action)) return "mixed";
}
const DISCORD_INTERACTIVE_BUTTON_ROW_SIZE = 5;
function buildDiscordButtonComponent(button, optionIndex) {
	const action = resolveMessagePresentationButtonAction(button);
	if (!action) return;
	if (action.type === "approval") {
		const internalCustomId = buildDiscordApprovalCustomId(action);
		if (!internalCustomId) return;
		return {
			label: button.label,
			style: resolveDiscordInteractiveButtonStyle(button.style),
			internalCustomId,
			...button.disabled === true ? { disabled: true } : {}
		};
	}
	if (action.type === "question") {
		const internalCustomId = buildDiscordQuestionCustomId({
			questionId: action.questionId,
			optionIndex
		});
		return internalCustomId ? {
			label: button.label,
			style: resolveDiscordInteractiveButtonStyle(button.style),
			internalCustomId,
			...button.disabled === true ? { disabled: true } : {}
		} : void 0;
	}
	if (action.type === "web-app" && action.widgetId && isValidDiscordActivityWidgetId(action.widgetId)) return {
		label: button.label,
		style: resolveDiscordInteractiveButtonStyle(button.style),
		internalCustomId: buildDiscordActivityCustomId(action.widgetId),
		...button.disabled === true ? { disabled: true } : {},
		...button.reusable === true ? { reusable: true } : {}
	};
	if (action.type === "web-app" && !action.url) return;
	const component = {
		label: button.label,
		style: action.type === "url" || action.type === "web-app" ? "link" : resolveDiscordInteractiveButtonStyle(button.style)
	};
	if (action.type === "url" || action.type === "web-app") component.url = action.url;
	else {
		component.callbackData = action.type === "command" ? action.command : action.value;
		if (button.action?.type === "command" || button.action?.type === "callback") component.callbackDataKind = button.action.type;
	}
	if (button.disabled === true) component.disabled = true;
	if (button.reusable === true) component.reusable = true;
	return component;
}
function appendDiscordButtonBlocks(blocks, buttons) {
	const components = buttons.map((button, optionIndex) => buildDiscordButtonComponent(button, optionIndex)).filter((button) => Boolean(button));
	for (let index = 0; index < components.length; index += DISCORD_INTERACTIVE_BUTTON_ROW_SIZE) blocks.push({
		type: "actions",
		buttons: components.slice(index, index + DISCORD_INTERACTIVE_BUTTON_ROW_SIZE)
	});
}
function appendDiscordSelectBlock(blocks, block) {
	const options = block.options.map((option) => ({
		label: option.label,
		value: resolveDiscordSelectOptionValue(option)
	})).filter((option) => Boolean(option.value));
	if (options.length === 0) return;
	const callbackDataKind = resolveDiscordSelectCallbackDataKind(block.options);
	if (callbackDataKind === "mixed") return;
	blocks.push({
		type: "actions",
		select: {
			type: "string",
			placeholder: block.placeholder,
			options,
			callbackDataKind
		}
	});
}
/**
* @deprecated Use buildDiscordPresentationComponents with MessagePresentation.
*/
function buildDiscordInteractiveComponents(interactive) {
	const blocks = reduceLegacyInteractiveReply(interactive, [], (state, block) => {
		if (block.type === "text") {
			const text = block.text.trim();
			if (text) state.push({
				type: "text",
				text
			});
			return state;
		}
		if (block.type === "buttons") {
			appendDiscordButtonBlocks(state, block.buttons);
			return state;
		}
		if (block.type === "select") appendDiscordSelectBlock(state, block);
		return state;
	});
	return blocks.length > 0 ? { blocks } : void 0;
}
function buildDiscordPresentationComponents(presentation) {
	if (!presentation) return;
	const blocks = [];
	if (presentation.title) blocks.push({
		type: "text",
		text: presentation.title
	});
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			const text = block.text.trim();
			if (text) blocks.push({
				type: "text",
				text: block.type === "context" ? `-# ${text}` : text
			});
			continue;
		}
		if (block.type === "divider") {
			blocks.push({ type: "separator" });
			continue;
		}
		if (block.type === "buttons") {
			appendDiscordButtonBlocks(blocks, block.buttons);
			continue;
		}
		if (block.type === "select") appendDiscordSelectBlock(blocks, block);
	}
	return blocks.length ? { blocks } : void 0;
}
//#endregion
export { DISCORD_MODAL_CUSTOM_ID_KEY as a, buildDiscordModalCustomId as c, parseDiscordComponentCustomId as d, parseDiscordComponentCustomIdForInteraction as f, encodeCustomIdComponent as g, decodeCustomIdComponent as h, DISCORD_COMPONENT_CUSTOM_ID_KEY as i, parseDiscordActivityCustomId as l, parseDiscordModalCustomIdForInteraction as m, buildDiscordPresentationComponents as n, buildDiscordActivityCustomId as o, parseDiscordModalCustomId as p, parseDiscordQuestionData as r, buildDiscordComponentCustomId as s, buildDiscordInteractiveComponents as t, parseDiscordActivityCustomIdForInteraction as u };
