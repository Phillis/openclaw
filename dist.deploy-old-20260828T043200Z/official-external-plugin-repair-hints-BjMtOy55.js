import { _ as resolveOfficialExternalPluginId, i as getOfficialExternalPluginCatalogEntry, o as getOfficialExternalPluginCatalogManifest, v as resolveOfficialExternalPluginInstall, y as resolveOfficialExternalPluginLabel } from "./official-external-plugin-catalog-DwzC0Kl2.js";
import { u as resolveConfiguredChannelPresencePolicy } from "./channel-presence-policy-Cy9fjmLX.js";
import "./channel-plugin-ids-BdzaxZ-5.js";
//#region src/plugins/official-external-plugin-repair-hints.ts
/** Resolves install/doctor commands for an official external plugin or channel id. */
function resolveOfficialExternalPluginRepairHint(pluginIdOrChannelId) {
	const entry = getOfficialExternalPluginCatalogEntry(pluginIdOrChannelId);
	if (!entry) return null;
	const install = resolveOfficialExternalPluginInstall(entry);
	const npmSpec = install?.npmSpec?.trim();
	const clawhubSpec = install?.clawhubSpec?.trim();
	const installSpec = install?.defaultChoice === "clawhub" ? clawhubSpec ?? npmSpec : npmSpec ?? clawhubSpec;
	if (!installSpec) return null;
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const pluginId = resolveOfficialExternalPluginId(entry) ?? pluginIdOrChannelId.trim();
	const channelId = manifest?.channel?.id?.trim();
	const label = resolveOfficialExternalPluginLabel(entry);
	const installCommand = `openclaw plugins install ${installSpec}`;
	const doctorFixCommand = "openclaw doctor --fix";
	return {
		pluginId,
		...channelId ? { channelId } : {},
		label,
		installSpec,
		installCommand,
		doctorFixCommand,
		repairHint: `Install the official external plugin with: ${installCommand}, or run: ${doctorFixCommand}.`
	};
}
/** Resolves repair hints for missing configured channels with one presence-policy pass. */
function resolveMissingOfficialExternalChannelPluginRepairHints(params) {
	if (params.channelIds.length === 0) return [];
	const policiesByChannelId = new Map(resolveConfiguredChannelPresencePolicy({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includePersistedAuthState: false,
		manifestRecords: params.manifestRecords
	}).map((entry) => [entry.channelId, entry]));
	return params.channelIds.flatMap((channelId) => {
		const hint = resolveOfficialExternalPluginRepairHint(channelId);
		if (!hint?.channelId || hint.channelId !== channelId) return [];
		const policy = policiesByChannelId.get(hint.channelId);
		return policy && !policy.effective && policy.blockedReasons.length === 1 && policy.blockedReasons[0] === "no-channel-owner" ? [{
			...hint,
			channelId: hint.channelId
		}] : [];
	});
}
/** Resolves a repair hint only when a missing configured channel is blocked by no plugin owner. */
function resolveMissingOfficialExternalChannelPluginRepairHint(params) {
	return resolveMissingOfficialExternalChannelPluginRepairHints({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		channelIds: [params.channelId],
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: params.manifestRecords
	})[0] ?? null;
}
//#endregion
export { resolveMissingOfficialExternalChannelPluginRepairHints as n, resolveOfficialExternalPluginRepairHint as r, resolveMissingOfficialExternalChannelPluginRepairHint as t };
