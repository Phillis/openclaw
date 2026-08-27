//#region src/skills/workshop/model-context-budget.ts
const DEFAULT_MODEL_CONTEXT_TOKENS = 8192;
const MODEL_CONTEXT_PROJECTION_SHARE = .35;
const MIN_PROJECTION_CHARS = 256;
const PROJECTION_CAPS = {
	collectionHistoryChars: 8e3,
	historyTranscriptChars: 8e4
};
function positiveInteger(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function resolveSkillWorkshopModelContextTokens(model) {
	const contextTokens = positiveInteger(model?.contextTokens);
	const contextWindow = positiveInteger(model?.contextWindow);
	if (contextTokens === void 0) return contextWindow;
	return contextWindow === void 0 ? contextTokens : Math.min(contextTokens, contextWindow);
}
function resolveSkillWorkshopProjectionBudgets(contextTokens) {
	const effectiveContextTokens = positiveInteger(contextTokens) ?? DEFAULT_MODEL_CONTEXT_TOKENS;
	const contextChars = Math.max(MIN_PROJECTION_CHARS, Math.floor(effectiveContextTokens * MODEL_CONTEXT_PROJECTION_SHARE));
	return {
		artifactChars: contextChars,
		collectionHistoryChars: Math.min(contextChars, PROJECTION_CAPS.collectionHistoryChars),
		historyTranscriptChars: Math.min(contextChars, PROJECTION_CAPS.historyTranscriptChars)
	};
}
//#endregion
//#region src/skills/workshop/skill-authoring-standards.ts
const SKILL_AUTHORING_STANDARDS_PROMPT = [
	"Skill authoring standards:",
	"- Size: SKILL.md stays under 10,000 characters. A skill is the shortest procedure that reproduces the result; long reference, examples, and per-branch detail go into a bundled file, pointed to from the step that needs it.",
	"- Procedures, not records: a skill holds the steps the agent performs. Logs, histories, data tables, personal facts, and task outputs belong in memory or files.",
	"- Description: leading words first — the situations and phrases that should trigger the skill, one trigger per distinct branch, within the first 60 characters; then what the skill produces.",
	"- Name: the class of work, 2–4 words.",
	"- Steps: ordered actions, each ending on a completion criterion the agent can check. Steps come before reference; reference appears only where a step consults it.",
	"- Language: positive imperatives (\"run X, then verify Y\"); one source per meaning; every sentence changes behavior versus the default. Sentences that restate defaults, duplicate another line, or describe a one-off are deleted.",
	"- Evidence: every step comes from the observed trajectory or the existing skill; never invent flags, commands, paths, APIs, tool behavior, or requirements. Capture the recovery that worked, never the failed attempts."
].join("\n");
//#endregion
export { resolveSkillWorkshopModelContextTokens as n, resolveSkillWorkshopProjectionBudgets as r, SKILL_AUTHORING_STANDARDS_PROMPT as t };
