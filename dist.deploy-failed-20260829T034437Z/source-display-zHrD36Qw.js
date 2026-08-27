import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { p as shortenHomeInString } from "./utils-Bw16L5tB.js";
import { n as resolvePluginSourceRoots } from "./roots-Cb7EhqtT.js";
import path from "node:path";
//#region src/plugins/source-display.ts
/** Formats plugin source paths for user-facing status output. */
const TABLE_SOURCE_MAX_CHARS = 48;
function middleTruncatePath(value) {
	if (value.length <= TABLE_SOURCE_MAX_CHARS) return value;
	return `${sliceUtf16Safe(value, 0, Math.floor((TABLE_SOURCE_MAX_CHARS - 3) / 2))}...${sliceUtf16Safe(value, -22)}`;
}
function tryRelative(root, filePath) {
	if (!isPathInside(root, filePath)) return null;
	const rel = path.relative(root, filePath);
	if (!rel || rel === ".") return null;
	return rel.replaceAll("\\", "/");
}
/** Formats a plugin source path for status tables using known source roots. */
function formatPluginSourceForTable(plugin, roots) {
	const raw = plugin.source;
	if (plugin.origin === "bundled" && roots.stock) {
		const rel = tryRelative(roots.stock, raw);
		if (rel) return {
			value: `stock:${rel}`,
			rootKey: "stock"
		};
	}
	if (plugin.origin === "workspace" && roots.workspace) {
		const rel = tryRelative(roots.workspace, raw);
		if (rel) return {
			value: `workspace:${rel}`,
			rootKey: "workspace"
		};
	}
	if (plugin.origin === "global" && roots.global) {
		const rel = tryRelative(roots.global, raw);
		if (rel) return {
			value: `global:${rel}`,
			rootKey: "global"
		};
	}
	return { value: middleTruncatePath(shortenHomeInString(raw)) };
}
//#endregion
export { formatPluginSourceForTable, resolvePluginSourceRoots };
