import { r as asNullableRecord } from "../../record-coerce-DItp3I4t.js";
import "../../runtime-doctor-migrations-BXpzR2WJ.js";
import { t as archiveLegacyStateSource } from "../../doctor-state-migration-fs-CfVap4xL.js";
import { c as normalizeAcpxProcessLeaseFile, f as ACPX_GATEWAY_INSTANCE_KEY, g as normalizeAcpxGatewayInstanceRecord, h as ACPX_LEGACY_PROCESS_LEASE_FILE, l as openAcpxProcessLeaseStateStore, m as ACPX_LEGACY_GATEWAY_INSTANCE_FILE, p as ACPX_GATEWAY_INSTANCE_NAMESPACE, s as normalizeAcpxProcessLease } from "../../process-lease-Cwvj7WGe.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/acpx/doctor-contract-api.ts
const ACPX_CONFIG_PATH = [
	"plugins",
	"entries",
	"acpx",
	"config"
];
const RETIRED_ACPX_CONFIG_KEYS = ["strictWindowsCmdWrapper", "queueOwnerTtlSeconds"];
/** Retired ACPX config that `openclaw doctor --fix` removes before strict validation. */
const legacyConfigRules = RETIRED_ACPX_CONFIG_KEYS.map((key) => ({
	path: [...ACPX_CONFIG_PATH, key],
	message: `${[...ACPX_CONFIG_PATH, key].join(".")} is retired and ignored by the embedded ACPX runtime. Run "openclaw doctor --fix".`
}));
/** Removes retired plugin-owned config without keeping runtime compatibility keys. */
function normalizeCompatibilityConfig({ cfg }) {
	const pluginConfig = asNullableRecord(asNullableRecord(cfg.plugins?.entries?.acpx)?.config);
	const retiredKeys = RETIRED_ACPX_CONFIG_KEYS.filter((key) => Object.hasOwn(pluginConfig ?? {}, key));
	if (!pluginConfig || retiredKeys.length === 0) return {
		config: cfg,
		changes: []
	};
	const nextConfig = structuredClone(cfg);
	const nextPluginConfig = asNullableRecord(asNullableRecord(nextConfig.plugins?.entries?.acpx)?.config);
	if (!nextPluginConfig) return {
		config: cfg,
		changes: []
	};
	for (const key of retiredKeys) delete nextPluginConfig[key];
	return {
		config: nextConfig,
		changes: [`Removed retired ACPX plugin config: ${retiredKeys.map((key) => [...ACPX_CONFIG_PATH, key].join(".")).join(", ")}.`]
	};
}
function resolveLegacyGatewayInstancePath(stateDir) {
	return path.join(stateDir, ACPX_LEGACY_GATEWAY_INSTANCE_FILE);
}
function resolveLegacyProcessLeasePath(stateDir) {
	return path.join(stateDir, "acpx", ACPX_LEGACY_PROCESS_LEASE_FILE);
}
async function readLegacyGatewayInstanceId(filePath) {
	try {
		return (await fs.readFile(filePath, "utf8")).trim() || null;
	} catch {
		return null;
	}
}
async function readLegacyOpenProcessLeases(filePath) {
	try {
		return normalizeAcpxProcessLeaseFile(JSON.parse(await fs.readFile(filePath, "utf8"))).leases.filter((lease) => lease.state === "open" || lease.state === "closing");
	} catch {
		return [];
	}
}
const stateMigrations = [{
	id: "acpx-runtime-state-to-plugin-state",
	label: "ACPX runtime state",
	async detectLegacyState(params) {
		const gatewayInstanceId = await readLegacyGatewayInstanceId(resolveLegacyGatewayInstancePath(params.stateDir));
		const openLeases = await readLegacyOpenProcessLeases(resolveLegacyProcessLeasePath(params.stateDir));
		if (!gatewayInstanceId && openLeases.length === 0) return null;
		const preview = [];
		if (gatewayInstanceId) preview.push(`- ACPX gateway instance id: ${resolveLegacyGatewayInstancePath(params.stateDir)} -> plugin state (${ACPX_GATEWAY_INSTANCE_NAMESPACE})`);
		if (openLeases.length > 0) preview.push(`- ACPX process leases: ${resolveLegacyProcessLeasePath(params.stateDir)} -> plugin state (${openLeases.length} open lease(s))`);
		return { preview };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const gatewayInstancePath = resolveLegacyGatewayInstancePath(params.stateDir);
		const gatewayInstanceId = await readLegacyGatewayInstanceId(gatewayInstancePath);
		const processLeasePath = resolveLegacyProcessLeasePath(params.stateDir);
		const openLeases = await readLegacyOpenProcessLeases(processLeasePath);
		const processLeaseStore = openAcpxProcessLeaseStateStore(params.context.openPluginStateKeyedStore);
		const gatewayStore = params.context.openPluginStateKeyedStore({
			namespace: ACPX_GATEWAY_INSTANCE_NAMESPACE,
			maxEntries: 1
		});
		const existingGateway = normalizeAcpxGatewayInstanceRecord(await gatewayStore.lookup(ACPX_GATEWAY_INSTANCE_KEY));
		const existingLiveLeases = (await processLeaseStore.entries()).map((entry) => normalizeAcpxProcessLease(entry.value)).filter((lease) => lease != null && (lease.state === "open" || lease.state === "closing"));
		const leaseGatewayIds = new Set(openLeases.map((lease) => lease.gatewayInstanceId));
		const onlyLeaseGatewayId = leaseGatewayIds.size === 1 ? [...leaseGatewayIds][0] : null;
		const canAdoptLegacyGateway = existingGateway && gatewayInstanceId && existingGateway.instanceId !== gatewayInstanceId && onlyLeaseGatewayId === gatewayInstanceId && existingLiveLeases.length === 0;
		const canonicalGatewayInstanceId = canAdoptLegacyGateway || !existingGateway ? gatewayInstanceId ?? onlyLeaseGatewayId : existingGateway.instanceId;
		if (openLeases.length > 0 && (!canonicalGatewayInstanceId || [...leaseGatewayIds].some((leaseGatewayId) => leaseGatewayId !== canonicalGatewayInstanceId))) {
			warnings.push("Skipped ACPX process lease migration because legacy leases do not match the canonical gateway instance id; left legacy sources in place for manual cleanup");
			return {
				changes,
				warnings
			};
		}
		if (canAdoptLegacyGateway && canonicalGatewayInstanceId) {
			await gatewayStore.register(ACPX_GATEWAY_INSTANCE_KEY, {
				instanceId: canonicalGatewayInstanceId,
				createdAt: Date.now()
			});
			changes.push("Migrated ACPX gateway instance id -> plugin state");
		} else if (canonicalGatewayInstanceId && !existingGateway) {
			await gatewayStore.register(ACPX_GATEWAY_INSTANCE_KEY, {
				instanceId: canonicalGatewayInstanceId,
				createdAt: Date.now()
			});
			changes.push("Migrated ACPX gateway instance id -> plugin state");
		} else if (gatewayInstanceId && existingGateway?.instanceId !== gatewayInstanceId) warnings.push("Skipped ACPX gateway instance id import because plugin state already differs");
		if (gatewayInstanceId) await archiveLegacyStateSource({
			filePath: gatewayInstancePath,
			label: "ACPX gateway-instance-id",
			changes,
			warnings
		});
		if (openLeases.length > 0) {
			let imported = 0;
			let alreadyPresent = 0;
			for (const lease of openLeases) if (await processLeaseStore.registerIfAbsent(lease.leaseId, lease)) imported++;
			else alreadyPresent++;
			changes.push(`Migrated ACPX process leases -> plugin state (${imported} imported, ${alreadyPresent} already present)`);
			await archiveLegacyStateSource({
				filePath: processLeasePath,
				label: "ACPX process-leases",
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
