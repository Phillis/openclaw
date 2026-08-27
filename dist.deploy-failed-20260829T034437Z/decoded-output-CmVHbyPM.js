import { t as createWindowsOutputDecoder } from "./windows-encoding-BFYUNnZu.js";
//#region src/process/decoded-output.ts
function onDecodedOutput(stream, listener, onRaw) {
	const decoder = createWindowsOutputDecoder();
	const emit = (text) => {
		if (text) listener(text);
	};
	let flushed = false;
	const flush = () => {
		if (flushed) return;
		flushed = true;
		emit(decoder.flush());
	};
	stream.on("data", (chunk) => {
		onRaw?.(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
		emit(decoder.decode(chunk));
	});
	stream.once("end", flush);
	stream.once("close", flush);
}
//#endregion
export { onDecodedOutput as t };
