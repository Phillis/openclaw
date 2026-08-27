import "./fs-safe-defaults-BPVQr7Lx.js";
import { t as replaceFileAtomic } from "./replace-file-sXUFaaUi.js";
//#region src/infra/json-files.ts
/** Writes text through the repo atomic replace helper with durable fsync by default. */
async function writeTextAtomic(filePath, content, options) {
	await replaceFileAtomic({
		filePath,
		content: options?.trailingNewline && !content.endsWith("\n") ? `${content}\n` : content,
		mode: options?.mode ?? 384,
		dirMode: options?.dirMode ?? 511 & ~process.umask(),
		copyFallbackOnPermissionError: true,
		syncTempFile: options?.durable !== false,
		syncParentDir: options?.durable !== false,
		...options?.beforeRename ? { beforeRename: options.beforeRename } : {},
		...options?.tempPrefix ? { tempPrefix: options.tempPrefix } : {}
	});
}
//#endregion
export { writeTextAtomic as t };
