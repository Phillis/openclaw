//#region src/state/openclaw-agent-db-contract.ts
const OPENCLAW_AGENT_SCHEMA_VERSION = 17;
//#endregion
//#region src/state/openclaw-agent-db-migration-required.ts
const GATEWAY_AGENT_MEDIA_MIGRATION_REQUIRED_REASON = "gateway.agent_media_migration_required";
var OpenClawAgentDatabaseMediaMigrationRequiredError = class extends Error {
	constructor(pathname, schemaVersion) {
		super(`OpenClaw agent database ${pathname} uses schema version ${schemaVersion}; run openclaw doctor --fix to migrate persisted media before using it.`);
		this.pathname = pathname;
		this.schemaVersion = schemaVersion;
		this.code = GATEWAY_AGENT_MEDIA_MIGRATION_REQUIRED_REASON;
		this.name = "OpenClawAgentDatabaseMediaMigrationRequiredError";
	}
};
const AGENT_MEDIA_MIGRATION_REQUIRED_MESSAGE = /^OpenClaw agent database (.+) uses schema version (\d+); run openclaw doctor --fix to migrate persisted media before using it\.$/u;
function parseAgentMediaMigrationRequiredMessage(message) {
	if (typeof message !== "string") return;
	const match = AGENT_MEDIA_MIGRATION_REQUIRED_MESSAGE.exec(message);
	const pathname = match?.[1];
	const rawSchemaVersion = match?.[2];
	if (!pathname || !rawSchemaVersion) return;
	const schemaVersion = Number(rawSchemaVersion);
	if (!Number.isSafeInteger(schemaVersion)) return;
	return new OpenClawAgentDatabaseMediaMigrationRequiredError(pathname, schemaVersion);
}
function findOpenClawAgentDatabaseMediaMigrationRequiredError(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current && typeof current === "object" && !seen.has(current)) {
		if (current instanceof OpenClawAgentDatabaseMediaMigrationRequiredError) return current;
		const errorLike = current;
		const parsed = parseAgentMediaMigrationRequiredMessage(errorLike.message);
		if (parsed) return parsed;
		seen.add(current);
		current = errorLike.cause;
	}
}
function formatLegacyAgentMediaMigrationRequiredMessage(pathname, schemaVersion) {
	return new OpenClawAgentDatabaseMediaMigrationRequiredError(pathname, schemaVersion).message;
}
//#endregion
export { OPENCLAW_AGENT_SCHEMA_VERSION as a, formatLegacyAgentMediaMigrationRequiredMessage as i, OpenClawAgentDatabaseMediaMigrationRequiredError as n, findOpenClawAgentDatabaseMediaMigrationRequiredError as r, GATEWAY_AGENT_MEDIA_MIGRATION_REQUIRED_REASON as t };
