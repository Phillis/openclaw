import "./fs-safe-defaults-BPVQr7Lx.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { t as normalizeLowercaseStringOrEmpty } from "./string-coerce-6TL5VVOL.js";
import { t as getNativeBinding } from "./native-CIvGO3cR.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region node_modules/@openclaw/fs-safe/dist/archive-kind.js
const TAR_SUFFIXES = [
	".tgz",
	".tar.gz",
	".tar"
];
const NATIVE_TAR_SUFFIXES = [{
	suffixes: [
		".tbz2",
		".tbz",
		".tar.bz2"
	],
	kind: "tar-bzip2"
}, {
	suffixes: [
		".tzst",
		".tar.zst",
		".tar.zstd"
	],
	kind: "tar-zstd"
}];
function requireNativeArchiveKind(kind) {
	if (!getNativeBinding()) throw new FsSafeError("helper-unavailable", `${kind} archives require a supported bundled native binding; use FS_SAFE_NATIVE_MODE=auto or require on a supported platform`);
	return kind;
}
function resolveArchiveKind(filePath) {
	const lower = normalizeLowercaseStringOrEmpty(filePath);
	if (lower.endsWith(".zip")) return "zip";
	for (const { suffixes, kind } of NATIVE_TAR_SUFFIXES) if (suffixes.some((suffix) => lower.endsWith(suffix))) return requireNativeArchiveKind(kind);
	if (TAR_SUFFIXES.some((suffix) => lower.endsWith(suffix))) return "tar";
	return null;
}
async function hasPackedRootMarker(extractDir, rootMarkers) {
	for (const marker of rootMarkers) {
		const trimmed = marker.trim();
		if (!trimmed) continue;
		try {
			await fs.stat(path.join(extractDir, trimmed));
			return true;
		} catch {}
	}
	return false;
}
async function resolvePackedRootDir(extractDir, options) {
	const direct = path.join(extractDir, "package");
	try {
		if ((await fs.stat(direct)).isDirectory()) return direct;
	} catch {}
	if ((options?.rootMarkers?.length ?? 0) > 0) {
		if (await hasPackedRootMarker(extractDir, options?.rootMarkers ?? [])) return extractDir;
	}
	const dirs = (await fs.readdir(extractDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
	if (dirs.length !== 1) throw new Error(`unexpected archive layout (dirs: ${dirs.join(", ")})`);
	const onlyDir = dirs[0];
	if (!onlyDir) throw new Error("unexpected archive layout (no package dir found)");
	return path.join(extractDir, onlyDir);
}
//#endregion
export { resolvePackedRootDir as n, resolveArchiveKind as t };
