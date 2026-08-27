import { n as compareValidSemver } from "./semver-aYpwYdrQ.js";
import { coerce } from "semver";
//#region src/agents/cli-backend-version-support.ts
/** Shared version guidance for provider-owned CLI backend protocol requirements. */
/** Compare human CLI version output with the provider's first-known compatible release. */
function resolveCliBackendVersionGuidance(versionOutput, requirement) {
	const parsed = versionOutput ? coerce(versionOutput)?.version : void 0;
	if (!parsed) return { status: "unknown" };
	const comparison = compareValidSemver(parsed, requirement.minimumVersion);
	if (comparison === null) return { status: "unknown" };
	return {
		status: comparison < 0 ? "below-known-floor" : "at-or-above-known-floor",
		version: parsed
	};
}
/** Advisory guidance; runtime capability negotiation remains authoritative. */
function formatCliBackendVersionAdvisory(params) {
	return `${params.label} ${params.requirement.minimumVersion} is the first published build known to advertise ${params.requirement.capability}; found ${params.version}. OpenClaw verifies this capability at runtime. If this build is rejected, run \`${params.requirement.updateCommand}\`, restart OpenClaw, and retry.`;
}
//#endregion
export { resolveCliBackendVersionGuidance as n, formatCliBackendVersionAdvisory as t };
