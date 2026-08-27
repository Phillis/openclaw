import { f as stripReasoningTagsFromText } from "./assistant-visible-text-BMBDlrGB.js";
//#region src/shared/text/formatted-reasoning-message.ts
/** Strip provider-formatted Reasoning/Thinking preambles from visible text. */
function stripFormattedReasoningMessage(text) {
	const stripped = stripReasoningTagsFromText(text);
	const lines = stripped.split(/\r?\n/u);
	const prefix = lines[0]?.trim();
	if (prefix !== "Reasoning:" && !/^Thinking\.{0,3}$/u.test(prefix ?? "")) return stripped;
	if (/^Thinking\.{0,3}$/u.test(prefix ?? "")) {
		const trimmedBodyLine = lines.slice(1).find((line) => line.trim())?.trim() ?? "";
		if (!trimmedBodyLine || !(trimmedBodyLine.startsWith("_") && trimmedBodyLine.endsWith("_") && trimmedBodyLine.length >= 2)) return stripped;
	}
	let index = 1;
	while (index < lines.length) {
		const trimmed = lines[index]?.trim() ?? "";
		if (!trimmed || trimmed.startsWith("_") && trimmed.endsWith("_") && trimmed.length >= 2) {
			index += 1;
			continue;
		}
		break;
	}
	return lines.slice(index).join("\n").trim();
}
//#endregion
export { stripFormattedReasoningMessage as t };
