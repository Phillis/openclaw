//#region extensions/amazon-bedrock/bedrock-options.ts
function getModelMatchCandidates(modelId, modelName) {
	return (modelName ? [modelId, modelName] : [modelId]).flatMap((value) => {
		const lower = value.toLowerCase();
		return [lower, lower.replace(/[\s_.:]+/g, "-")];
	});
}
/** Return whether a Bedrock model is known to support Anthropic prompt caching. */
function supportsBedrockPromptCaching(modelId, modelName) {
	const candidates = getModelMatchCandidates(modelId, modelName);
	if (!candidates.some((s) => s.includes("claude"))) {
		if (typeof process !== "undefined" && process.env.AWS_BEDROCK_FORCE_CACHE === "1") return true;
		return false;
	}
	if (candidates.some((s) => s.includes("-4-"))) return true;
	if (candidates.some((candidate) => candidate.includes("claude-fable-5") || candidate.includes("claude-mythos-5") || candidate.includes("claude-opus-5") || candidate.includes("claude-sonnet-5"))) return true;
	if (candidates.some((s) => s.includes("claude-3-7-sonnet"))) return true;
	if (candidates.some((s) => s.includes("claude-3-5-haiku"))) return true;
	return false;
}
//#endregion
export { supportsBedrockPromptCaching };
