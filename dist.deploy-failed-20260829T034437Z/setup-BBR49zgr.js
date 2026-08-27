import "./utils-Bw16L5tB.js";
import "./types.secrets-Bre8L6Ts.js";
import "./detect-binary-T1YoxrQG.js";
import "./setup-helpers-ChQBLW6h.js";
import "./setup-wizard-helpers-JxuPdtZE.js";
import "./setup-credential-Cg5429p2.js";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
	if (params.resolved.length === 0 && params.unresolved.length === 0) return;
	return [params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0, params.unresolved.length > 0 ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}` : void 0].filter(Boolean).join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
