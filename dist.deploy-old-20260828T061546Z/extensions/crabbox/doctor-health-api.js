import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.js";
import { r as runCommandWithTimeout } from "../../exec-D2kbpwdA.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import "../../process-runtime-B-C-YQA7.js";
import { r as findCrabboxBinary, t as CRABBOX_WORKER_PROVIDER_ID, u as resolveOpenClawRoot } from "../../crabbox-worker-profile-BwpaZfhQ.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region extensions/crabbox/src/crabbox-worker-doctor-runtime.ts
const CRABBOX_VERSION_TIMEOUT_MS = 2e3;
const CRABBOX_VERSION_MAX_OUTPUT_BYTES = 64 * 1024;
async function probeCrabboxVersion(binary) {
	let result;
	try {
		result = await runCommandWithTimeout([binary, "--version"], {
			killProcessTree: true,
			maxOutputBytes: CRABBOX_VERSION_MAX_OUTPUT_BYTES,
			timeoutMs: CRABBOX_VERSION_TIMEOUT_MS
		});
	} catch {
		return {
			status: "indeterminate",
			reason: "version command could not start"
		};
	}
	if (result.termination !== "exit" || result.code !== 0 || result.outputLimitExceeded) return {
		status: "indeterminate",
		reason: result.termination === "timeout" ? `version command timed out after ${CRABBOX_VERSION_TIMEOUT_MS} ms` : result.outputLimitExceeded ? "version output exceeded 64 KiB" : result.termination !== "exit" ? `version command did not exit normally (${result.termination})` : `version command exited with code ${result.code ?? "unknown"}`
	};
	const match = /(?:^|\s)v?(\d+)\.(\d+)\.(\d+)(?:\s|$)/u.exec(`${result.stdout}\n${result.stderr}`.trim());
	if (!match) return {
		status: "indeterminate",
		reason: "version output was not recognized"
	};
	const major = Number(match[1]);
	const minor = Number(match[2]);
	const patch = Number(match[3]);
	const version = `${major}.${minor}.${patch}`;
	return major > 0 || major === 0 && (minor > 41 || minor === 41 && patch >= 1) ? {
		status: "supported",
		version
	} : {
		status: "outdated",
		version
	};
}
//#endregion
//#region extensions/crabbox/src/doctor.ts
const CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID = "crabbox/cloud-worker-profiles";
function finding(params) {
	return {
		checkId: CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID,
		severity: params.severity ?? "warning",
		source: "crabbox",
		message: `Cloud worker profile "${params.profileId}" ${params.message}`,
		...params.binary ? { path: params.binary } : {},
		ocPath: `cloudWorkers.profiles.${params.profileId}.settings.binary`,
		target: params.profileId,
		requirement: "an executable Crabbox 0.41.1 or newer binary",
		fixHint: params.fixHint
	};
}
function repairHint(profileId, explicitBinary) {
	const configPath = `cloudWorkers.profiles.${profileId}.settings.binary`;
	return explicitBinary ? `Install Crabbox 0.41.1 or newer at ${explicitBinary}, or set ${configPath} to an executable absolute path, then rerun \`openclaw doctor --json\`.` : `Install Crabbox 0.41.1 or newer on the Gateway user's PATH, or set ${configPath} to an executable absolute path, then rerun \`openclaw doctor --json\`.`;
}
function createCrabboxCloudWorkerProfileCheck(openclawRoot) {
	return {
		id: CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID,
		kind: "plugin",
		description: "Verify configured Crabbox cloud worker profiles before dispatch.",
		source: "crabbox",
		async detect(ctx) {
			const profiles = Object.entries(ctx.cfg.cloudWorkers?.profiles ?? {}).filter(([, profile]) => profile.provider.trim().toLowerCase() === CRABBOX_WORKER_PROVIDER_ID);
			if (profiles.length === 0) return [];
			const probes = /* @__PURE__ */ new Map();
			const findings = [];
			for (const [profileId, profile] of profiles) {
				const explicitBinary = normalizeOptionalString(asOptionalRecord(profile.settings)?.binary);
				const binary = findCrabboxBinary({
					...explicitBinary ? { explicit: explicitBinary } : {},
					openclawRoot,
					pathEnv: ctx.env?.PATH ?? process.env.PATH
				});
				if (!binary) {
					findings.push(finding({
						profileId,
						...explicitBinary ? { binary: explicitBinary } : {},
						message: explicitBinary ? `cannot use Crabbox because ${explicitBinary} is not an executable file.` : "cannot resolve an executable Crabbox binary from the Gateway user's PATH.",
						fixHint: repairHint(profileId, explicitBinary)
					}));
					continue;
				}
				let probe = probes.get(binary);
				if (!probe) {
					probe = probeCrabboxVersion(binary);
					probes.set(binary, probe);
				}
				const result = await probe;
				if (result.status === "outdated") findings.push(finding({
					profileId,
					binary,
					message: `uses Crabbox ${result.version}, but cloud workers require 0.41.1 or newer.`,
					fixHint: repairHint(profileId, explicitBinary)
				}));
				else if (result.status === "indeterminate") findings.push(finding({
					profileId,
					binary,
					severity: "info",
					message: `has an executable Crabbox binary, but Doctor could not determine its version: ${result.reason}.`,
					fixHint: `Run \`${binary} --version\` and confirm it reports Crabbox 0.41.1 or newer, then rerun \`openclaw doctor --json --severity-min info\`.`
				}));
			}
			return findings;
		}
	};
}
function registerCrabboxWorkerProviderDoctorChecks(host) {
	if (host.getHealthCheck("crabbox/cloud-worker-profiles")) return;
	host.registerHealthCheck(createCrabboxCloudWorkerProfileCheck(host.openclawRoot));
}
//#endregion
//#region extensions/crabbox/doctor-health-api.ts
const CRABBOX_PLUGIN_ROOT = path.dirname(fileURLToPath(import.meta.url));
function registerWorkerProviderDoctorChecks(host) {
	registerCrabboxWorkerProviderDoctorChecks({
		...host,
		openclawRoot: resolveOpenClawRoot(CRABBOX_PLUGIN_ROOT)
	});
}
//#endregion
export { CRABBOX_CLOUD_WORKER_PROFILE_CHECK_ID, registerWorkerProviderDoctorChecks };
