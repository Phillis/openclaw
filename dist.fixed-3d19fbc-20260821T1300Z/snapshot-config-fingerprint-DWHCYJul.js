import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { n as redactConfigObject } from "./redact-snapshot-C6BdvGLp.js";
import crypto from "node:crypto";
//#region src/skills/runtime/snapshot-config-fingerprint.ts
let configFingerprints = /* @__PURE__ */ new WeakMap();
function fingerprintSkillSnapshotConfig(config) {
	const cached = configFingerprints.get(config);
	if (cached) return cached;
	const fingerprint = crypto.createHash("sha256").update(stableStringify(redactConfigObject(config))).digest("hex");
	configFingerprints.set(config, fingerprint);
	return fingerprint;
}
function resetSkillSnapshotConfigFingerprintCache() {
	configFingerprints = /* @__PURE__ */ new WeakMap();
}
//#endregion
export { resetSkillSnapshotConfigFingerprintCache as n, fingerprintSkillSnapshotConfig as t };
