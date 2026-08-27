import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
//#region src/config/legacy-private-network-migration.ts
/** Detects the retired flat `allowPrivateNetwork` key before doctor migration. */
function hasLegacyFlatAllowPrivateNetworkAlias(value) {
	const entry = asNullableRecord(value);
	return Boolean(entry && Object.hasOwn(entry, "allowPrivateNetwork"));
}
/** Moves flat private-network config into `network.dangerouslyAllowPrivateNetwork`. */
function migrateLegacyFlatAllowPrivateNetworkAlias(params) {
	if (!hasLegacyFlatAllowPrivateNetworkAlias(params.entry)) return {
		entry: params.entry,
		changed: false
	};
	const legacyAllowPrivateNetwork = params.entry.allowPrivateNetwork;
	const currentNetworkRecord = asNullableRecord(params.entry.network);
	const currentNetwork = currentNetworkRecord ? { ...currentNetworkRecord } : {};
	const currentDangerousAllowPrivateNetwork = currentNetwork.dangerouslyAllowPrivateNetwork;
	let resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
	if (typeof currentDangerousAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
	else if (typeof legacyAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
	else if (currentDangerousAllowPrivateNetwork === void 0) resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
	delete currentNetwork.dangerouslyAllowPrivateNetwork;
	if (resolvedDangerousAllowPrivateNetwork !== void 0) currentNetwork.dangerouslyAllowPrivateNetwork = resolvedDangerousAllowPrivateNetwork;
	const nextEntry = { ...params.entry };
	delete nextEntry.allowPrivateNetwork;
	if (Object.keys(currentNetwork).length > 0) nextEntry.network = currentNetwork;
	else delete nextEntry.network;
	params.changes.push(`Moved ${params.pathPrefix}.allowPrivateNetwork → ${params.pathPrefix}.network.dangerouslyAllowPrivateNetwork (${String(resolvedDangerousAllowPrivateNetwork)}).`);
	return {
		entry: nextEntry,
		changed: true
	};
}
function hasLegacyAllowPrivateNetworkInAccounts(value) {
	const accounts = asNullableRecord(value);
	return Boolean(accounts && Object.values(accounts).some((account) => hasLegacyFlatAllowPrivateNetworkAlias(asNullableRecord(account) ?? {})));
}
/** Build doctor rules that migrate legacy private-network aliases for one channel config. */
function createLegacyPrivateNetworkDoctorContract(params) {
	const pathPrefix = `channels.${params.channelKey}`;
	return {
		legacyConfigRules: [{
			path: ["channels", params.channelKey],
			message: `${pathPrefix}.allowPrivateNetwork is legacy; use ${pathPrefix}.network.dangerouslyAllowPrivateNetwork instead. Run "openclaw doctor --fix".`,
			match: (value) => hasLegacyFlatAllowPrivateNetworkAlias(asNullableRecord(value) ?? {})
		}, {
			path: [
				"channels",
				params.channelKey,
				"accounts"
			],
			message: `${pathPrefix}.accounts.<id>.allowPrivateNetwork is legacy; use ${pathPrefix}.accounts.<id>.network.dangerouslyAllowPrivateNetwork instead. Run "openclaw doctor --fix".`,
			match: hasLegacyAllowPrivateNetworkInAccounts
		}],
		normalizeCompatibilityConfig: ({ cfg }) => {
			const channelEntry = asNullableRecord(asNullableRecord(cfg.channels)?.[params.channelKey]);
			if (!channelEntry) return {
				config: cfg,
				changes: []
			};
			const changes = [];
			let updatedChannel = channelEntry;
			let changed = false;
			const topLevel = migrateLegacyFlatAllowPrivateNetworkAlias({
				entry: updatedChannel,
				pathPrefix,
				changes
			});
			updatedChannel = topLevel.entry;
			changed = changed || topLevel.changed;
			const accounts = asNullableRecord(updatedChannel.accounts);
			if (accounts) {
				let accountsChanged = false;
				const nextAccounts = { ...accounts };
				for (const [accountId, accountValue] of Object.entries(accounts)) {
					const account = asNullableRecord(accountValue);
					if (!account) continue;
					const migrated = migrateLegacyFlatAllowPrivateNetworkAlias({
						entry: account,
						pathPrefix: `${pathPrefix}.accounts.${accountId}`,
						changes
					});
					if (!migrated.changed) continue;
					nextAccounts[accountId] = migrated.entry;
					accountsChanged = true;
				}
				if (accountsChanged) {
					updatedChannel = {
						...updatedChannel,
						accounts: nextAccounts
					};
					changed = true;
				}
			}
			if (!changed) return {
				config: cfg,
				changes: []
			};
			return {
				config: {
					...cfg,
					channels: {
						...cfg.channels,
						[params.channelKey]: updatedChannel
					}
				},
				changes
			};
		}
	};
}
//#endregion
export { hasLegacyFlatAllowPrivateNetworkAlias as n, migrateLegacyFlatAllowPrivateNetworkAlias as r, createLegacyPrivateNetworkDoctorContract as t };
