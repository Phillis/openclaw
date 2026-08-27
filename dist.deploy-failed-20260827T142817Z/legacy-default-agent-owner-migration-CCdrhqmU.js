import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { J as cronStoreKey, o as materializeCronRowAgentOwners } from "./row-codec-DhVyr5Q_.js";
import path from "node:path";
//#region src/cron/legacy-default-agent-owner-migration.ts
function materializeLegacyDefaultCronJobOwners(params) {
	const agentId = normalizeAgentId(params.legacyDefaultAgentId);
	return runOpenClawStateWriteTransaction(({ db }) => materializeCronRowAgentOwners(db, cronStoreKey(path.resolve(params.storePath)), agentId), { env: params.env }, { operationLabel: "cron.legacy-default-owner" });
}
//#endregion
export { materializeLegacyDefaultCronJobOwners as t };
