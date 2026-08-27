import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-D9gvQMP6.js";
//#region scripts/lib/recommended-tool-installs.json
var entries = [
	{
		"id": "ollama",
		"brandId": "ollama",
		"label": "Ollama",
		"hint": "Run open models locally",
		"website": "https://ollama.com/download",
		"icon": "https://cdn.simpleicons.org/ollama"
	},
	{
		"id": "lmstudio",
		"label": "LM Studio",
		"hint": "Local model desktop app",
		"website": "https://lmstudio.ai/download",
		"icon": "https://cdn.simpleicons.org/lmstudio"
	},
	{
		"id": "claude-code",
		"brandId": "claude",
		"label": "Claude Code",
		"hint": "Anthropic's coding agent CLI",
		"website": "https://code.claude.com/docs/en/quickstart",
		"icon": "https://cdn.simpleicons.org/claudecode"
	},
	{
		"id": "codex-cli",
		"brandId": "openai",
		"label": "Codex CLI",
		"hint": "OpenAI's coding agent CLI",
		"website": "https://developers.openai.com/codex/cli/",
		"icon": "https://github.com/openai.png"
	},
	{
		"id": "pi",
		"label": "Pi",
		"hint": "Open-source coding agent",
		"website": "https://pi.dev/",
		"icon": "https://cdn.simpleicons.org/pi"
	},
	{
		"id": "opencode",
		"brandId": "opencode",
		"label": "OpenCode",
		"hint": "Open-source coding agent",
		"website": "https://opencode.ai/docs/",
		"icon": "https://cdn.simpleicons.org/opencode"
	},
	{
		"id": "gemini-cli",
		"brandId": "gemini",
		"label": "Gemini CLI",
		"hint": "Google's coding agent CLI",
		"website": "https://geminicli.com/docs/get-started/installation/",
		"icon": "https://cdn.simpleicons.org/googlegemini"
	},
	{
		"id": "kimi-code",
		"brandId": "kimi",
		"label": "Kimi Code",
		"hint": "Moonshot's coding agent CLI",
		"website": "https://www.kimi.com/code",
		"icon": "https://cdn.simpleicons.org/kimi"
	},
	{
		"id": "grok-build",
		"brandId": "grok",
		"label": "Grok Build",
		"hint": "xAI's coding agent CLI",
		"website": "https://x.ai/cli",
		"icon": "https://github.com/xai-org.png"
	}
];
//#endregion
//#region src/plugins/recommended-tool-installs.ts
function normalizeHttpsUrl(value) {
	if (typeof value !== "string" || !value.trim()) return;
	const normalized = value.trim();
	try {
		const url = new URL(normalized);
		const canonical = url.toString();
		return url.protocol === "https:" && url.hostname && !url.username && !url.password && canonical.length <= 2048 ? canonical : void 0;
	} catch {
		return;
	}
}
function listRecommendedToolInstalls() {
	const entries$1 = entries;
	if (!Array.isArray(entries$1)) return [];
	const seenIds = /* @__PURE__ */ new Set();
	const installs = [];
	for (const entry of entries$1) {
		if (!isRecord(entry)) continue;
		const id = typeof entry.id === "string" ? entry.id.trim() : "";
		const brandId = typeof entry.brandId === "string" ? entry.brandId.trim() : "";
		const label = typeof entry.label === "string" ? entry.label.trim() : "";
		const hint = typeof entry.hint === "string" ? entry.hint.trim() : "";
		const website = normalizeHttpsUrl(entry.website);
		const icon = normalizeHttpsUrl(entry.icon);
		if (!id || seenIds.has(id) || !label || !hint || !website || !icon) continue;
		seenIds.add(id);
		installs.push({
			id,
			...brandId ? { brandId } : {},
			label,
			hint,
			website,
			icon
		});
	}
	return installs;
}
//#endregion
export { listRecommendedToolInstalls as t };
