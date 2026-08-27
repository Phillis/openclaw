import { g as readStringValue } from "./string-coerce-CIXf7egm.js";
import { o as asRecord } from "./record-coerce-DItp3I4t.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./security-runtime-fAO34zGh.js";
import "./media-runtime-B_HWTN-G.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import * as path$1 from "node:path";
//#region extensions/canvas/src/cli-helpers.ts
/**
* Shared Canvas CLI helpers for snapshot payload parsing and temp paths.
*/
function normalizeCanvasSnapshotFormat(value) {
	const format = value?.trim().toLowerCase() ?? "";
	if (format === "png" || format === "jpg" || format === "jpeg") return format;
	return null;
}
function canonicalizeCanvasSnapshotBase64(value) {
	if (!value) return;
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 32 && code !== 9 && code !== 10 && code !== 12 && code !== 13 && code !== 32) return;
	}
	const canonical = canonicalizeBase64(value);
	if (!canonical) return;
	return Buffer.from(canonical, "base64").toString("base64") === canonical ? canonical : void 0;
}
/** Normalizes Canvas snapshot output extensions, mapping jpeg to jpg. */
function normalizeCanvasSnapshotFileExtension(value) {
	const format = normalizeCanvasSnapshotFormat(value.startsWith(".") ? value.slice(1) : value);
	if (!format) throw new Error("invalid canvas.snapshot format");
	return format === "jpeg" ? "jpg" : format;
}
/** Parses the node.invoke canvas.snapshot payload shape. */
function parseCanvasSnapshotPayload(value) {
	const obj = asRecord(value);
	const format = normalizeCanvasSnapshotFormat(readStringValue(obj.format));
	const base64 = canonicalizeCanvasSnapshotBase64(readStringValue(obj.base64));
	if (!format || !base64) throw new Error("invalid canvas.snapshot payload");
	return {
		format,
		base64
	};
}
function resolveCliName() {
	return "openclaw";
}
function resolveCanvasSnapshotId(id) {
	if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("invalid canvas snapshot id");
	return id;
}
function resolveTempPathParts(opts) {
	const tmpDir = opts.tmpDir ?? resolvePreferredOpenClawTmpDir();
	if (!opts.tmpDir) fs.mkdirSync(tmpDir, {
		recursive: true,
		mode: 448
	});
	return {
		tmpDir,
		id: resolveCanvasSnapshotId(opts.id ?? randomUUID()),
		ext: `.${normalizeCanvasSnapshotFileExtension(opts.ext)}`
	};
}
/** Builds a safe temp path for a Canvas snapshot output file. */
function canvasSnapshotTempPath(opts) {
	const { tmpDir, id, ext } = resolveTempPathParts(opts);
	const cliName = resolveCliName();
	return path$1.join(tmpDir, `${cliName}-canvas-snapshot-${id}${ext}`);
}
//#endregion
export { normalizeCanvasSnapshotFileExtension as n, parseCanvasSnapshotPayload as r, canvasSnapshotTempPath as t };
