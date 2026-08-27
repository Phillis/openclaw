import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import "./error-runtime-CmA1H4Zg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
//#region extensions/memory-core/src/dreaming-shared.ts
function extractAssistantText(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = asNullableRecord(messages[index]);
		if (message?.role !== "assistant") continue;
		if (typeof message.content === "string" && message.content.trim()) return message.content.trim();
		if (Array.isArray(message.content)) {
			const text = message.content.flatMap((part) => {
				const item = asNullableRecord(part);
				return (item?.type === "text" || item?.type === "output_text") && typeof item.text === "string" ? [item.text] : [];
			}).join("\n").trim();
			if (text) return text;
		}
	}
	return null;
}
function includesSystemEventToken(cleanedBody, eventText) {
	const normalizedBody = normalizeOptionalString(cleanedBody);
	const normalizedEventText = normalizeOptionalString(eventText);
	if (!normalizedBody || !normalizedEventText) return false;
	if (normalizedBody === normalizedEventText) return true;
	return normalizedBody.split(/\r?\n/).some((line) => {
		const trimmed = line.trim();
		if (trimmed === normalizedEventText) return true;
		return trimmed.replace(/^\[cron:[^\]]+\]\s*/, "") === normalizedEventText;
	});
}
//#endregion
export { includesSystemEventToken as n, extractAssistantText as t };
