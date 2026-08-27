import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { a as getChildLogger } from "./logger-ij8OHrrv.js";
import { i as tryGetLegacyDefaultAgentId } from "./legacy.default-agent-owner-CL_-T11Y.js";
import { l as resolveCronJobsStorePath } from "./store-pLPqGtqL.js";
import { o as isAgentDeletionBlocked } from "./agent-lifecycle-registry-D1dm9wFG.js";
import { t as CronService } from "./service-n5b5I9_X.js";
//#region src/cron/local-service.ts
async function withLocalAgentCronJobsRemoved(agentId, getRuntimeConfig, commit) {
	const cfg = getRuntimeConfig();
	const storePath = resolveCronJobsStorePath();
	const service = new CronService({
		storePath,
		cronEnabled: cfg.cron?.enabled !== false,
		cronConfig: cfg.cron,
		log: getChildLogger({
			module: "cron",
			storeKey: storePath
		}),
		defaultAgentId: tryResolveAmbientOwnerAgentId(cfg),
		legacyDefaultAgentId: tryGetLegacyDefaultAgentId(cfg),
		resolveDefaultAgentId: () => tryResolveAmbientOwnerAgentId(getRuntimeConfig()),
		isAgentAvailable: (id) => !isAgentDeletionBlocked(id) && listAgentIds(getRuntimeConfig()).some((configuredId) => normalizeAgentId(configuredId) === id),
		enqueueSystemEvent: () => false,
		requestHeartbeat: () => {},
		runIsolatedAgentJob: async () => {
			throw new Error("Cron execution is unavailable in local service context.");
		}
	});
	try {
		return await service.removeAgentJobsTransactional(agentId, commit);
	} finally {
		service.stop();
	}
}
//#endregion
export { withLocalAgentCronJobsRemoved as t };
