import { l as resolveOpenClawReleaseCohortVersion, r as isExactSemverVersion, s as parseRegistryNpmSpec } from "./npm-registry-spec-BdgyvSs0.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
//#region src/plugins/clawhub-install-records.ts
/** Builds plugin install record fields from resolved ClawHub package metadata. */
function buildClawHubPluginInstallRecordFields(fields) {
	return {
		source: "clawhub",
		clawhubUrl: fields.clawhubUrl,
		clawhubPackage: fields.clawhubPackage,
		clawhubFamily: fields.clawhubFamily,
		...fields.clawhubChannel ? { clawhubChannel: fields.clawhubChannel } : {},
		...fields.clawhubTrustDisposition ? { clawhubTrustDisposition: fields.clawhubTrustDisposition } : {},
		...fields.clawhubTrustScanStatus ? { clawhubTrustScanStatus: fields.clawhubTrustScanStatus } : {},
		...fields.clawhubTrustModerationState ? { clawhubTrustModerationState: fields.clawhubTrustModerationState } : {},
		...fields.clawhubTrustReasons ? { clawhubTrustReasons: fields.clawhubTrustReasons } : {},
		...fields.clawhubTrustPending !== void 0 ? { clawhubTrustPending: fields.clawhubTrustPending } : {},
		...fields.clawhubTrustStale !== void 0 ? { clawhubTrustStale: fields.clawhubTrustStale } : {},
		...fields.clawhubTrustCheckedAt ? { clawhubTrustCheckedAt: fields.clawhubTrustCheckedAt } : {},
		...fields.clawhubTrustAcknowledgedAt ? { clawhubTrustAcknowledgedAt: fields.clawhubTrustAcknowledgedAt } : {},
		...fields.version ? { version: fields.version } : {},
		...fields.integrity ? { integrity: fields.integrity } : {},
		...fields.resolvedAt ? { resolvedAt: fields.resolvedAt } : {},
		...fields.installedAt ? { installedAt: fields.installedAt } : {},
		...fields.artifactKind ? { artifactKind: fields.artifactKind } : {},
		...fields.artifactFormat ? { artifactFormat: fields.artifactFormat } : {},
		...fields.npmIntegrity ? { npmIntegrity: fields.npmIntegrity } : {},
		...fields.npmShasum ? { npmShasum: fields.npmShasum } : {},
		...fields.npmTarballName ? { npmTarballName: fields.npmTarballName } : {},
		...fields.clawpackSha256 ? { clawpackSha256: fields.clawpackSha256 } : {},
		...fields.clawpackSpecVersion !== void 0 ? { clawpackSpecVersion: fields.clawpackSpecVersion } : {},
		...fields.clawpackManifestSha256 ? { clawpackManifestSha256: fields.clawpackManifestSha256 } : {},
		...fields.clawpackSize !== void 0 ? { clawpackSize: fields.clawpackSize } : {}
	};
}
//#endregion
//#region src/plugins/install-channel-specs.ts
function resolveDefaultNpmSpec(spec) {
	const parsed = parseRegistryNpmSpec(spec);
	if (!parsed) return null;
	if (parsed.selectorKind === "none") return { name: parsed.name };
	if (parsed.selectorKind === "tag" && parsed.selector?.toLowerCase() === "latest") return { name: parsed.name };
	return null;
}
function isDefaultClawHubSpecForBetaChannel(spec) {
	const parsed = parseClawHubPluginSpec(spec);
	if (!parsed) return null;
	if (!parsed.version || parsed.version.toLowerCase() === "latest") return { name: parsed.name };
	return null;
}
function resolveNpmInstallSpecsForUpdateChannel(params) {
	if (params.updateChannel === "extended-stable" || params.updateChannel === "stable" && params.versionBoundToCore) {
		const target = resolveDefaultNpmSpec(params.spec);
		if (target && params.officialPackageName === target.name) {
			const coreVersion = params.coreVersion?.trim();
			if (!coreVersion || !isExactSemverVersion(coreVersion)) {
				const policy = params.updateChannel === "extended-stable" ? "Extended-stable" : "Version-bound";
				throw new Error(`${policy} plugin resolution for ${target.name} requires an exact core version.`);
			}
			const installVersion = params.versionBoundToCore ? resolveOpenClawReleaseCohortVersion(coreVersion) : coreVersion;
			return {
				installSpec: `${target.name}@${installVersion}`,
				recordSpec: params.spec
			};
		}
		return {
			installSpec: params.spec,
			recordSpec: params.spec
		};
	}
	if (params.updateChannel !== "beta") return {
		installSpec: params.spec,
		recordSpec: params.spec
	};
	const betaTarget = resolveDefaultNpmSpec(params.spec);
	if (!betaTarget) return {
		installSpec: params.spec,
		recordSpec: params.spec
	};
	const betaSpec = `${betaTarget.name}@beta`;
	return {
		installSpec: betaSpec,
		recordSpec: params.spec,
		fallbackSpec: params.spec,
		fallbackLabel: betaSpec
	};
}
function resolveClawHubInstallSpecsForUpdateChannel(params) {
	if (params.updateChannel !== "beta") return {
		installSpec: params.spec,
		recordSpec: params.spec
	};
	const betaTarget = isDefaultClawHubSpecForBetaChannel(params.spec);
	if (!betaTarget) return {
		installSpec: params.spec,
		recordSpec: params.spec
	};
	const betaSpec = `clawhub:${betaTarget.name}@beta`;
	return {
		installSpec: betaSpec,
		recordSpec: params.spec,
		fallbackSpec: params.spec,
		fallbackLabel: betaSpec
	};
}
/**
* Installs the channel-resolved spec, widening to the operator's own selector
* when that release has no published artifact. The degrade is announced rather
* than silent, because it changes which build the operator ends up running.
*/
async function installWithChannelFallback(params) {
	const result = await params.install(params.installSpec);
	const { fallbackSpec } = params;
	if (!fallbackSpec || fallbackSpec === params.installSpec || !params.isRetryable(result)) return result;
	await params.onFallback(`No ${params.installSpec} release is published; installing ${fallbackSpec} instead.`);
	return await params.install(fallbackSpec);
}
//#endregion
export { buildClawHubPluginInstallRecordFields as i, resolveClawHubInstallSpecsForUpdateChannel as n, resolveNpmInstallSpecsForUpdateChannel as r, installWithChannelFallback as t };
