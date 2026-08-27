import "./src-BntaCZM-.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { n as sha256Base64Url } from "./crypto-digest-IGAbV2KW.js";
import { s as projectCronJobThroughStorageCodec } from "./row-codec-gAlP-EPD.js";
//#region src/cron/config-revision.ts
/** Opaque revision token for cron configuration, excluding scheduler-maintained state. */
function configRevisionDefinition(projected) {
	const { updatedAtMs: _updatedAtMs, state: _state, ...definition } = projected;
	if (definition.payload.kind !== "command" || !definition.payload.env) return definition;
	const foldedKeys = /* @__PURE__ */ new Set();
	if (!Object.keys(definition.payload.env).some((key) => {
		const folded = key.toLowerCase();
		if (foldedKeys.has(folded)) return true;
		foldedKeys.add(folded);
		return false;
	})) return definition;
	const { env, ...payload } = definition.payload;
	return {
		...definition,
		payload: {
			...payload,
			envEntries: Object.entries(env)
		}
	};
}
/** Hashes the job definition while preserving meaningful own-undefined config fields. */
function resolveCronJobConfigRevision(job) {
	return `sha256:${sha256Base64Url(stableStringify(configRevisionDefinition(projectCronJobThroughStorageCodec({
		...job,
		updatedAtMs: 0,
		state: {}
	}))))}`;
}
//#endregion
export { resolveCronJobConfigRevision as t };
