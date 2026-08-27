import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
//#region src/shared/entry-metadata.ts
/** Resolves entry emoji/homepage with metadata taking precedence over frontmatter aliases. */
function resolveEmojiAndHomepage(params) {
	const emoji = params.metadata?.emoji ?? params.frontmatter?.emoji;
	const homepage = normalizeOptionalString(params.metadata?.homepage ?? params.frontmatter?.homepage ?? params.frontmatter?.website ?? params.frontmatter?.url);
	return {
		...emoji ? { emoji } : {},
		...homepage ? { homepage } : {}
	};
}
//#endregion
//#region src/shared/requirements.ts
function normalizeOsRequirementPlatform(platform) {
	const normalized = platform.trim().toLowerCase();
	return normalized === "macos" ? "darwin" : normalized;
}
/** Evaluates entry requirements against the current host and optional remote capabilities. */
function evaluateRequirementsFromMetadataWithRemote(params) {
	const required = {
		bins: params.metadata?.requires?.bins ?? [],
		anyBins: params.metadata?.requires?.anyBins ?? [],
		env: params.metadata?.requires?.env ?? [],
		config: params.metadata?.requires?.config ?? [],
		os: params.metadata?.os ?? []
	};
	const hasRemoteBin = params.remote?.hasBin;
	const hasRemoteAnyBin = params.remote?.hasAnyBin;
	const missingBins = required.bins.filter((bin) => !params.hasLocalBin(bin) && !hasRemoteBin?.(bin));
	const missingAnyBins = required.anyBins.length === 0 || required.anyBins.some((bin) => params.hasLocalBin(bin)) || hasRemoteAnyBin?.(required.anyBins) ? [] : required.anyBins;
	let missingOs = [];
	if (required.os.length > 0) {
		const localPlatform = normalizeOsRequirementPlatform(params.localPlatform);
		const requiredPlatforms = new Set(required.os.map(normalizeOsRequirementPlatform));
		if (!requiredPlatforms.has(localPlatform) && !params.remote?.platforms?.some((platform) => requiredPlatforms.has(normalizeOsRequirementPlatform(platform)))) missingOs = required.os;
	}
	const missingEnv = required.env.filter((envName) => !params.isEnvSatisfied(envName));
	const configChecks = required.config.map((path) => ({
		path,
		satisfied: params.isConfigSatisfied(path)
	}));
	const missingConfig = configChecks.filter((check) => !check.satisfied).map((check) => check.path);
	const missing = {
		bins: params.always ? [] : missingBins,
		anyBins: params.always ? [] : missingAnyBins,
		env: params.always ? [] : missingEnv,
		config: params.always ? [] : missingConfig,
		os: missingOs
	};
	return {
		required,
		missing,
		eligible: missing.os.length === 0 && (params.always || missing.bins.length === 0 && missing.anyBins.length === 0 && missing.env.length === 0 && missing.config.length === 0),
		configChecks
	};
}
//#endregion
//#region src/shared/entry-status.ts
/** Resolves entry presentation metadata and requirement eligibility in one shared shape. */
function evaluateEntryMetadataRequirements(params) {
	const { emoji, homepage } = resolveEmojiAndHomepage({
		metadata: params.metadata,
		frontmatter: params.frontmatter
	});
	const { required, missing, eligible, configChecks } = evaluateRequirementsFromMetadataWithRemote({
		always: params.always,
		metadata: params.metadata ?? void 0,
		hasLocalBin: params.hasLocalBin,
		localPlatform: params.localPlatform,
		remote: params.remote,
		isEnvSatisfied: params.isEnvSatisfied,
		isConfigSatisfied: params.isConfigSatisfied
	});
	return {
		...emoji ? { emoji } : {},
		...homepage ? { homepage } : {},
		required,
		missing,
		requirementsSatisfied: eligible,
		configChecks
	};
}
/** Evaluates an entry object's metadata/frontmatter requirements on the current platform. */
function evaluateEntryRequirementsForCurrentPlatform(params) {
	return evaluateEntryMetadataRequirements({
		always: params.always,
		metadata: params.entry.metadata,
		frontmatter: params.entry.frontmatter,
		hasLocalBin: params.hasLocalBin,
		localPlatform: process.platform,
		remote: params.remote,
		isEnvSatisfied: params.isEnvSatisfied,
		isConfigSatisfied: params.isConfigSatisfied
	});
}
//#endregion
export { evaluateEntryRequirementsForCurrentPlatform as t };
