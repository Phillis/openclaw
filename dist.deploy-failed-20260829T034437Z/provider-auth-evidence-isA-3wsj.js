import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import fs from "node:fs";
import os from "node:os";
//#region src/secrets/provider-auth-evidence.ts
/** Resolves cheap, secret-free local credential evidence declared by provider manifests. */
function expandAuthEvidencePath(rawPath, env) {
	const trimmed = rawPath.trim();
	if (!trimmed) return;
	let unresolvedPlaceholder = false;
	let explicitOverride = false;
	const placeholderPattern = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/gu;
	const invalidPlaceholder = trimmed.replace(placeholderPattern, "").includes("${");
	const expanded = trimmed.replace(placeholderPattern, (_match, name) => {
		const value = name === "HOME" ? normalizeOptionalString(env.HOME) ?? os.homedir() : normalizeOptionalString(env[name]);
		if (!value) {
			unresolvedPlaceholder = true;
			return "";
		}
		if (name !== "HOME" && name !== "APPDATA") explicitOverride = true;
		return value;
	});
	return unresolvedPlaceholder || invalidPlaceholder ? void 0 : {
		path: expanded,
		explicitOverride
	};
}
function hasRequiredAuthEvidenceEnv(evidence, env) {
	const hasEnv = (key) => Boolean(normalizeOptionalSecretInput(env[key]));
	if (evidence.requiresAnyEnv?.length && !evidence.requiresAnyEnv.some(hasEnv)) return false;
	if (evidence.requiresAllEnv?.length && !evidence.requiresAllEnv.every(hasEnv)) return false;
	return true;
}
function hasLocalFileAuthEvidence(evidence, env) {
	if (evidence.fileEnvVar) {
		const explicitPath = normalizeOptionalString(env[evidence.fileEnvVar]);
		if (explicitPath) return fs.existsSync(explicitPath);
	}
	for (const rawPath of evidence.fallbackPaths ?? []) {
		const expandedPath = expandAuthEvidencePath(rawPath, env);
		if (!expandedPath) continue;
		if (fs.existsSync(expandedPath.path)) return true;
		if (expandedPath.explicitOverride) return false;
	}
	return false;
}
function resolveLocalProviderAuthEvidence(evidenceEntries, env) {
	for (const evidence of evidenceEntries ?? []) {
		if (evidence.type !== "local-file-with-env" || !hasRequiredAuthEvidenceEnv(evidence, env) || !hasLocalFileAuthEvidence(evidence, env)) continue;
		return {
			credentialMarker: evidence.credentialMarker,
			source: evidence.source ?? "local auth evidence"
		};
	}
	return null;
}
//#endregion
export { resolveLocalProviderAuthEvidence as t };
