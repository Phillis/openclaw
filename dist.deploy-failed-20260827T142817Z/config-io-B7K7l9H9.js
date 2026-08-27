import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { b as createConfigIO } from "./io-D1h6pxaD.js";
import "./config-CW-q_d35.js";
import { t as isNonEmptyString } from "./shared-QozwPUGk.js";
import { o as listAuthProfileSecretTargetEntries } from "./target-registry-query-DdLmxb5J.js";
import "./target-registry-fN14Szwn.js";
import { s as resolveSharedAuthStorePath } from "./path-resolve-DH_naXF5.js";
import { m as resolveAuthProfileDatabasePath } from "./sqlite-R6lp3fio.js";
import fs from "node:fs";
import path from "node:path";
//#region src/secrets/auth-profiles-scan.ts
/** Scans auth-profile stores for plaintext credentials, SecretRefs, and OAuth tokens. */
function getAuthProfileFieldName(pathPattern) {
	const segments = pathPattern.split(".").filter(Boolean);
	return segments[segments.length - 1] ?? "";
}
const AUTH_PROFILE_FIELD_SPEC_BY_TYPE = (() => {
	const defaults = {
		api_key: {
			valueField: "key",
			refField: "keyRef"
		},
		token: {
			valueField: "token",
			refField: "tokenRef"
		}
	};
	for (const target of listAuthProfileSecretTargetEntries()) {
		if (!target.authProfileType) continue;
		defaults[target.authProfileType] = {
			valueField: getAuthProfileFieldName(target.pathPattern),
			refField: target.refPathPattern !== void 0 ? getAuthProfileFieldName(target.refPathPattern) : defaults[target.authProfileType].refField
		};
	}
	return defaults;
})();
/** Returns the value/ref field names for one auth-profile credential type. */
function getAuthProfileFieldSpec(type) {
	return AUTH_PROFILE_FIELD_SPEC_BY_TYPE[type];
}
function toSecretCredentialVisit(params) {
	const spec = getAuthProfileFieldSpec(params.kind);
	return {
		kind: params.kind,
		profileId: params.profileId,
		provider: params.provider,
		profile: params.profile,
		valueField: spec.valueField,
		refField: spec.refField,
		value: params.profile[spec.valueField],
		refValue: params.profile[spec.refField]
	};
}
/** Iterates credential-bearing auth profiles with normalized field metadata for audit/apply. */
function* iterateAuthProfileCredentials(profiles) {
	for (const [profileId, value] of Object.entries(profiles)) {
		if (!isRecord(value) || !isNonEmptyString(value.provider)) continue;
		const provider = value.provider;
		if (value.type === "api_key" || value.type === "token") {
			yield toSecretCredentialVisit({
				kind: value.type,
				profileId,
				provider,
				profile: value
			});
			continue;
		}
		if (value.type === "oauth") yield {
			kind: "oauth",
			profileId,
			provider,
			profile: value,
			hasAccess: isNonEmptyString(value.access),
			hasRefresh: isNonEmptyString(value.refresh)
		};
	}
}
//#endregion
//#region src/secrets/auth-store-paths.ts
/** Discovers auth-profile store paths that may contain secret refs. */
/** Lists canonical auth-profile databases that may contain SecretRefs. */
function listAuthProfileStoreTargets(config, stateDir, env = process.env) {
	const targets = /* @__PURE__ */ new Map();
	const scopedEnv = {
		...env,
		OPENCLAW_STATE_DIR: stateDir,
		OPENCLAW_AGENT_DIR: void 0
	};
	const addTarget = (target) => {
		const key = path.resolve(target.path);
		if (targets.get(key)?.kind === "shared") return;
		targets.set(key, target);
	};
	addTarget({
		kind: "shared",
		path: resolveSharedAuthStorePath(scopedEnv),
		env: scopedEnv,
		stateDir
	});
	const agentsRoot = path.join(resolveUserPath(stateDir, scopedEnv), "agents");
	if (fs.existsSync(agentsRoot)) for (const entry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const agentDir = path.join(agentsRoot, entry.name, "agent");
		addTarget({
			kind: "agent",
			agentDir,
			path: resolveAuthProfileDatabasePath(agentDir)
		});
	}
	for (const agentId of listAgentIds(config)) {
		const agentDir = resolveUserPath(resolveAgentDir(config, agentId, scopedEnv), scopedEnv);
		addTarget({
			kind: "agent",
			agentDir,
			path: resolveAuthProfileDatabasePath(agentDir)
		});
	}
	return [...targets.values()];
}
//#endregion
//#region src/secrets/config-io.ts
/** Config IO adapter used by secrets apply/configure flows. */
const silentConfigIoLogger = {
	error: () => {},
	warn: () => {}
};
/**
* Creates config I/O for secrets commands with config-loader logging suppressed.
*/
function createSecretsConfigIO(params) {
	return createConfigIO({
		env: params.env,
		logger: silentConfigIoLogger
	});
}
//#endregion
export { listAuthProfileStoreTargets as n, iterateAuthProfileCredentials as r, createSecretsConfigIO as t };
