//#region src/agents/mcp-codex-tool-approval.ts
const APPROVAL_MODES = /* @__PURE__ */ new Set([
	"auto",
	"prompt",
	"approve"
]);
function normalizeApprovalMode(value) {
	return typeof value === "string" && APPROVAL_MODES.has(value) ? value : void 0;
}
function isOpenClawLoopbackServer(name, server) {
	return name === "openclaw" && typeof server.url === "string" && /^https?:\/\/(?:127\.0\.0\.1|localhost):\d+\/mcp(?:[?#].*)?$/.test(server.url);
}
/** Mirrors the approval default projected into Codex native MCP config. */
function resolveProjectedMcpCodexToolApprovalMode(serverName, server) {
	const codex = server.codex && typeof server.codex === "object" && !Array.isArray(server.codex) ? server.codex : {};
	return normalizeApprovalMode(codex.defaultToolsApprovalMode) ?? normalizeApprovalMode(codex.default_tools_approval_mode) ?? (isOpenClawLoopbackServer(serverName, server) ? "approve" : void 0);
}
function resolveMcpCodexToolApprovalMode(serverName, server) {
	return resolveProjectedMcpCodexToolApprovalMode(serverName, server) ?? "auto";
}
function normalizeMcpCodexToolAnnotations(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const record = value;
	const result = {};
	for (const key of [
		"readOnlyHint",
		"destructiveHint",
		"idempotentHint",
		"openWorldHint"
	]) if (typeof record[key] === "boolean") result[key] = record[key];
	return result;
}
/** Mirrors Codex `auto` approval semantics for unattended dynamic execution. */
function requiresMcpCodexToolApproval(params) {
	if (params.mode === "approve") return false;
	if (params.mode === "prompt") return true;
	const annotations = params.annotations ?? {};
	if (annotations.destructiveHint === true) return true;
	if (annotations.readOnlyHint === true) return false;
	return annotations.destructiveHint !== false || annotations.openWorldHint !== false;
}
//#endregion
export { resolveProjectedMcpCodexToolApprovalMode as i, requiresMcpCodexToolApproval as n, resolveMcpCodexToolApprovalMode as r, normalizeMcpCodexToolAnnotations as t };
