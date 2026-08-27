//#region src/config/sessions/transcript-jsonl.ts
function serializeJsonlLines(lines) {
	return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}
//#endregion
export { serializeJsonlLines as t };
