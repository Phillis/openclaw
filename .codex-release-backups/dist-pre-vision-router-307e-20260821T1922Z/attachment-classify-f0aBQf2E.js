import { c as isZipContainerMime, d as normalizeMimeType, n as detectMime, u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
//#region packages/media-core/src/attachment-classify.ts
const TEXT_APPLICATION_MIME = /^application\/(?:json|javascript|xml|yaml|x-yaml)$/;
const DOCUMENT_MIME = /^application\/(?:pdf|msword|x-cfb|vnd\.(?:apple\.(?:keynote|numbers|pages)|ms-.+|oasis\.opendocument\..+|openxmlformats-officedocument\..+))$/;
const ARCHIVE_MIME = /^application\/(?:gzip|vnd\.rar|x-7z-compressed|x-gzip|x-rar-compressed|x-tar|x-zip-compressed|zip)$/;
const WORDISH_CHAR = /[\p{L}\p{N}]/u;
function attachmentClassFromMime(mime) {
	const normalized = normalizeMimeType(mime);
	if (!normalized) return "binary";
	if (normalized.startsWith("text/") || TEXT_APPLICATION_MIME.test(normalized) || normalized.endsWith("+json") || normalized.endsWith("+xml")) return "text";
	if (normalized.startsWith("image/")) return "image";
	if (normalized.startsWith("audio/")) return "audio";
	if (normalized.startsWith("video/")) return "video";
	if (DOCUMENT_MIME.test(normalized)) return "document";
	return ARCHIVE_MIME.test(normalized) || isZipContainerMime(normalized) ? "archive" : "binary";
}
function resolveUtf16Charset(buffer) {
	if (buffer.length < 2) return;
	const bom = buffer.readUInt16LE(0);
	if (bom === 65279) return "utf-16le";
	if (bom === 65534) return "utf-16be";
	const sampleLength = Math.min(buffer.length, 2048);
	let zeroEven = 0;
	let zeroOdd = 0;
	for (let index = 0; index < sampleLength; index += 1) if (buffer[index] === 0) if (index % 2 === 0) zeroEven += 1;
	else zeroOdd += 1;
	if ((zeroEven + zeroOdd) / sampleLength <= .2) return;
	return zeroOdd >= zeroEven ? "utf-16le" : "utf-16be";
}
function textRatios(text) {
	let printable = 0;
	let control = 0;
	let wordish = 0;
	for (const char of text) {
		const code = char.codePointAt(0) ?? 0;
		if (code === 9 || code === 10 || code === 13 || code === 32) {
			printable += 1;
			wordish += 1;
		} else if (code < 32 || code >= 127 && code <= 159) control += 1;
		else {
			printable += 1;
			wordish += Number(WORDISH_CHAR.test(char));
		}
	}
	const total = printable + control;
	return total === 0 ? [0, 0] : [printable / total, wordish / total];
}
function looksLikeText(buffer) {
	if (buffer.length === 0) return false;
	const sample = buffer.subarray(0, Math.min(buffer.length, 4096));
	try {
		return textRatios(new TextDecoder("utf-8", { fatal: true }).decode(sample))[0] > .85;
	} catch {
		const [printable, wordish] = textRatios(new TextDecoder("windows-1252").decode(sample));
		return printable > .95 && wordish > .3;
	}
}
async function classifyAttachmentBytes(params) {
	const mime = await detectMime({
		buffer: params.buffer,
		headerMime: params.declaredMime,
		additionalMimeHints: params.additionalMimeHints,
		filePath: params.name ?? void 0
	});
	const detectedClass = attachmentClassFromMime(mime);
	const charset = resolveUtf16Charset(params.buffer);
	const hasUtf16Bom = params.buffer.length >= 2 && (params.buffer.readUInt16LE(0) === 65279 || params.buffer.readUInt16LE(0) === 65534);
	if (mime === "application/octet-stream" || mime?.startsWith("application/vnd.") || detectedClass !== "binary" && !hasUtf16Bom) return detectedClass === "text" && charset ? {
		mime,
		class: detectedClass,
		charset
	} : {
		mime,
		class: detectedClass
	};
	const signature = params.buffer.length >= 4 ? params.buffer.readUInt32BE(0) : 0;
	if (signature === 1347093252 || signature === 1347092738 || signature === 1347093766) return {
		mime,
		class: "archive"
	};
	if (!charset && !looksLikeText(params.buffer)) return {
		mime,
		class: "binary"
	};
	const extensionMime = mimeTypeFromFilePath(params.name);
	const firstLine = new TextDecoder(charset ?? "utf-8").decode(params.buffer.subarray(0, Math.min(params.buffer.length, 8192))).split(/\r?\n/, 1)[0];
	return {
		mime: (attachmentClassFromMime(extensionMime) === "text" ? extensionMime : void 0) ?? (firstLine?.includes(",") ? "text/csv" : firstLine?.includes("	") ? "text/tab-separated-values" : "text/plain"),
		class: "text",
		...charset ? { charset } : {}
	};
}
//#endregion
export { classifyAttachmentBytes as n, attachmentClassFromMime as t };
