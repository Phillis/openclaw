import fs from "node:fs";
//#region src/infra/file-read.ts
/** Fills a bounded positional-read buffer unless the file reaches EOF. */
async function readFileWindowFully(handle, buffer, position) {
	let bytesRead = 0;
	while (bytesRead < buffer.length) {
		const result = await handle.read(buffer, bytesRead, buffer.length - bytesRead, position + bytesRead);
		if (result.bytesRead === 0) break;
		bytesRead += result.bytesRead;
	}
	return bytesRead;
}
/** Synchronously fills a bounded positional-read buffer unless the file reaches EOF. */
function readFileWindowFullySync(fd, buffer, position) {
	let bytesRead = 0;
	while (bytesRead < buffer.length) {
		const count = fs.readSync(fd, buffer, bytesRead, buffer.length - bytesRead, position + bytesRead);
		if (count === 0) break;
		bytesRead += count;
	}
	return bytesRead;
}
//#endregion
export { readFileWindowFullySync as n, readFileWindowFully as t };
