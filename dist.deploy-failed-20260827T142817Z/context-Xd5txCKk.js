import { L as timestampMsToIsoFileStamp } from "./number-coercion-oCkfUEEq.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds } from "./agent-scope-config-BdXMWufB.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import "./config-CW-q_d35.js";
import path from "node:path";
//#region src/commands/migrate/context.ts
/** Migration provider context and report-directory helpers. */
/** Builds a migration logger that keeps JSON stdout machine-readable. */
function createMigrationLogger(runtime, opts = {}) {
	const info = opts.json ? runtime.error : runtime.log;
	return {
		debug: (message) => {
			if (process.env.OPENCLAW_VERBOSE === "1") info(message);
		},
		info: (message) => info(message),
		warn: (message) => runtime.error(message),
		error: (message) => runtime.error(message)
	};
}
/** Builds the timestamped directory where a provider writes migration reports. */
function buildMigrationReportDir(providerId, stateDir, nowMs = Date.now()) {
	const stamp = timestampMsToIsoFileStamp(nowMs);
	return path.join(stateDir, "migration", providerId, stamp);
}
/** Resolves an explicit migration owner without allowing typo-created agent stores. */
function resolveMigrationTargetAgentId(config, rawAgentId) {
	const raw = rawAgentId?.trim();
	if (!raw) return;
	if (!isValidAgentId(raw)) throw new Error(`Invalid agent id "${raw}".`);
	const agentId = normalizeAgentId(raw);
	if (!new Set(listAgentIds(config).map(normalizeAgentId)).has(agentId)) throw new Error(`Unknown agent id "${raw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	return agentId;
}
/** Builds the provider-facing migration context from CLI options and runtime state. */
function buildMigrationContext(params) {
	const config = params.configOverride ?? getRuntimeConfig();
	return {
		config,
		stateDir: resolveStateDir(),
		targetAgentId: resolveMigrationTargetAgentId(config, params.targetAgentId),
		itemKinds: params.itemKinds,
		source: params.source,
		includeSecrets: Boolean(params.includeSecrets),
		overwrite: Boolean(params.overwrite),
		providerOptions: params.providerOptions,
		backupPath: params.backupPath,
		reportDir: params.reportDir,
		logger: createMigrationLogger(params.runtime, { json: params.json })
	};
}
//#endregion
export { resolveMigrationTargetAgentId as i, buildMigrationReportDir as n, createMigrationLogger as r, buildMigrationContext as t };
