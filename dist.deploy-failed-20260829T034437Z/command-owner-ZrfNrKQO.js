import { l as readConfigFileSnapshotForWrite } from "./io-DlN5njvP.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { n as hasConfiguredCommandOwners, t as formatCommandOwnerFromChannelSender } from "./doctor-command-owner-DPkdMgE3.js";
//#region src/pairing/command-owner.ts
/** Adds the approved sender as command owner only when no owner exists yet. */
async function bootstrapCommandOwnerFromPairing(params) {
	const ownerEntry = formatCommandOwnerFromChannelSender(params);
	if (!ownerEntry) return {
		ownerEntry: null,
		status: "unavailable"
	};
	const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
	if (hasConfiguredCommandOwners(snapshot.sourceConfig)) return {
		ownerEntry,
		status: "already-configured"
	};
	const nextConfig = structuredClone(snapshot.sourceConfig);
	nextConfig.commands = {
		...nextConfig.commands,
		ownerAllowFrom: [ownerEntry]
	};
	await replaceConfigFile({
		nextConfig,
		snapshot,
		writeOptions,
		afterWrite: { mode: "auto" }
	});
	return {
		ownerEntry,
		status: "configured"
	};
}
//#endregion
export { bootstrapCommandOwnerFromPairing as t };
