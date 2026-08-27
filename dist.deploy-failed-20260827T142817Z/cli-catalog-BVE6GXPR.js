import { i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, n as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-BoJ2vZl0.js";
//#region extensions/anthropic/cli-catalog.ts
const CLAUDE_CLI_DEFAULT_CONTEXT_WINDOW = 2e5;
const CLAUDE_CLI_CONTEXT_WINDOWS = {
	"claude-opus-5": 1e6,
	"claude-sonnet-5": 1e6,
	"claude-fable-5": 1e6
};
const CLAUDE_CLI_DEFAULT_MAX_OUTPUT_TOKENS = 64e3;
const CLAUDE_CLI_MAX_OUTPUT_TOKENS = {
	"claude-opus-5": 128e3,
	"claude-opus-4-8": 128e3,
	"claude-opus-4-7": 128e3,
	"claude-opus-4-6": 128e3,
	"claude-sonnet-5": 128e3,
	"claude-fable-5": 128e3,
	"claude-sonnet-4-6": 128e3
};
const CLAUDE_CLI_MODEL_LABELS = {
	"claude-opus-5": "Claude Opus 5 (Claude CLI)",
	"claude-opus-4-8": "Claude Opus 4.8 (Claude CLI)",
	"claude-opus-4-7": "Claude Opus 4.7 (Claude CLI)",
	"claude-opus-4-6": "Claude Opus 4.6 (Claude CLI)",
	"claude-sonnet-5": "Claude Sonnet 5 (Claude CLI)",
	"claude-fable-5": "Claude Fable 5 (Claude CLI)",
	"claude-sonnet-4-6": "Claude Sonnet 4.6 (Claude CLI)"
};
function resolveClaudeCliImageMediaInput(id) {
	const maxSidePx = id === "claude-opus-5" || id === "claude-opus-4-8" || id === "claude-opus-4-7" || id === "claude-sonnet-5" || id === "claude-fable-5" ? 2576 : 1568;
	return { image: {
		maxSidePx,
		preferredSidePx: maxSidePx,
		tokenMode: "provider"
	} };
}
function extractClaudeCliModelIds() {
	const ids = [];
	const seen = /* @__PURE__ */ new Set();
	for (const ref of CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS) {
		if (!ref.startsWith(`claude-cli/`)) continue;
		const id = ref.slice(CLAUDE_CLI_BACKEND_ID.length + 1);
		if (id.length === 0 || seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}
/** Build catalog entries for the default Claude CLI allowlist. */
function buildClaudeCliCatalogEntries() {
	return extractClaudeCliModelIds().map((id) => {
		return {
			id,
			name: CLAUDE_CLI_MODEL_LABELS[id] ?? `${id} (Claude CLI)`,
			provider: CLAUDE_CLI_BACKEND_ID,
			reasoning: true,
			input: ["text", "image"],
			mediaInput: resolveClaudeCliImageMediaInput(id),
			contextWindow: CLAUDE_CLI_CONTEXT_WINDOWS[id] ?? CLAUDE_CLI_DEFAULT_CONTEXT_WINDOW,
			maxTokens: CLAUDE_CLI_MAX_OUTPUT_TOKENS[id] ?? CLAUDE_CLI_DEFAULT_MAX_OUTPUT_TOKENS
		};
	});
}
//#endregion
export { buildClaudeCliCatalogEntries as t };
