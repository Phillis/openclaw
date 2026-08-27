import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { D as parseJsonWithJson5Fallback } from "./redact-CWP17HFN.js";
import { r as isMissingPathError } from "./errno-CkbDOfLk.js";
import "./errors-Ccx0R-_Z.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as writeTextAtomic } from "./json-files-E5e5TtK3.js";
import { h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CeAO_dqo.js";
import { t as cronStoreKey } from "./key-BBZ40bDq.js";
import { o as materializeCronRowAgentOwners } from "./row-codec-LoN9q1nV.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/cron/legacy-default-agent-owner-migration.ts
async function materializeLegacyJsonOwners(storePath, agentId) {
	let raw;
	try {
		raw = await fs.readFile(storePath, "utf8");
	} catch (error) {
		if (isMissingPathError(error)) return 0;
		throw error;
	}
	const parsed = parseJsonWithJson5Fallback(raw);
	const jobs = Array.isArray(parsed) ? parsed : isRecord(parsed) && Array.isArray(parsed.jobs) ? parsed.jobs : [];
	let rewritten = 0;
	for (const job of jobs) {
		if (!isRecord(job) || normalizeOptionalString(job.agentId) || parseAgentSessionKey(normalizeOptionalString(job.sessionKey))?.agentId) continue;
		job.agentId = agentId;
		rewritten += 1;
	}
	if (rewritten === 0) return 0;
	await writeTextAtomic(storePath, JSON.stringify(parsed, null, 2), {
		mode: 384,
		tempPrefix: path.basename(storePath),
		trailingNewline: true,
		beforeRename: async () => {
			if (await fs.readFile(storePath, "utf8") !== raw) throw new Error("legacy cron source changed while assigning its retained owner");
		}
	});
	return rewritten;
}
async function materializeLegacyDefaultCronJobOwners(params) {
	const agentId = normalizeAgentId(params.legacyDefaultAgentId);
	const storePath = path.resolve(params.storePath);
	return runOpenClawStateWriteTransaction(({ db }) => materializeCronRowAgentOwners(db, cronStoreKey(storePath), agentId), { env: params.env }, { operationLabel: "cron.legacy-default-owner" }) + await materializeLegacyJsonOwners(storePath, agentId);
}
//#endregion
export { materializeLegacyDefaultCronJobOwners as t };
