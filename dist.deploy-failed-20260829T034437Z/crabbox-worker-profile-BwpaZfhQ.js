import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as WorkerProviderError } from "./capability-provider.types-cizOzEy5.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./plugin-entry-BIDZMa3K.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region extensions/crabbox/src/crabbox-worker-timeouts.ts
const CRABBOX_WARMUP_ATTEMPTS = 2;
const CRABBOX_WARMUP_TIMEOUT_MS = CRABBOX_WARMUP_ATTEMPTS * 15e5;
const CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS = CRABBOX_WARMUP_ATTEMPTS * 3e6;
const CRABBOX_LIFECYCLE_TIMEOUT_MS = 6e4;
const CRABBOX_HEARTBEAT_TIMEOUT_MS = 15e4;
const CRABBOX_MACHINE_CATALOG_TIMEOUT_MS = 5e3;
const CRABBOX_MACHINE0_LIFECYCLE_TIMEOUT_MS = 5 * 6e4;
const CRABBOX_SETUP_TIMEOUT_MS = 15 * 6e4;
const CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS = 15 * 6e4;
function resolveCrabboxReadyPollIntervalMs(provider) {
	return provider === "machine0" ? 6e4 : 2e3;
}
function resolveCrabboxLifecycleTimeoutMs(provider) {
	return provider === "machine0" ? CRABBOX_MACHINE0_LIFECYCLE_TIMEOUT_MS : CRABBOX_LIFECYCLE_TIMEOUT_MS;
}
function resolveCrabboxProvisionBaseTimeoutMs(profile) {
	return (profile.desktop ? CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS : CRABBOX_WARMUP_TIMEOUT_MS) + resolveCrabboxLifecycleTimeoutMs(profile.provider) * (profile.provider === "machine0" ? 2 : 1);
}
function countCrabboxProvisionSetupPhases(profile) {
	return Number(Boolean(profile.desktop)) + Number(Boolean(profile.setup));
}
function resolveCrabboxProvisionCallTimeoutMs(profile) {
	return resolveCrabboxProvisionBaseTimeoutMs(profile) + countCrabboxProvisionSetupPhases(profile) * CRABBOX_SETUP_TIMEOUT_MS + CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS + resolveCrabboxLifecycleTimeoutMs(profile.provider);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-profile.ts
const PROFILE_KEYS = /* @__PURE__ */ new Set([
	"binary",
	"class",
	"desktop",
	"idleTimeout",
	"provider",
	"setup",
	"setupEnv",
	"ttl",
	"warmImage"
]);
const GO_DURATION_PATTERN = /^\+?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:ns|us|µs|μs|ms|s|m|h))+$/u;
const GO_DURATION_TOKEN_PATTERN = /(\d+(?:\.\d*)?|\.\d+)(ns|us|µs|μs|ms|s|m|h)/gu;
const MAX_GO_DURATION_NANOSECONDS = 9223372036854775807n;
const CRABBOX_LEASE_ID_DOMAIN = "openclaw:crabbox-worker-lease-id:v1\0";
const DURATION_UNIT_NANOSECONDS = {
	h: 3600000000000n,
	m: 60000000000n,
	s: 1000000000n,
	ms: 1000000n,
	us: 1000n,
	µs: 1000n,
	μs: 1000n,
	ns: 1n
};
const MAX_CRABBOX_MACHINE_CLASS_LENGTH = 128;
const MAX_CRABBOX_MACHINE_OPTIONS = 32;
const CRABBOX_DESKTOP_PROVIDERS = /* @__PURE__ */ new Set(["aws", "hetzner"]);
const CRABBOX_WORKER_PROVIDER_ID = "crabbox";
function requirePositiveDuration(value, key) {
	const duration = normalizeOptionalString(value);
	const nanoseconds = duration ? parsePositiveGoDurationNanoseconds(duration) : void 0;
	if (!duration || nanoseconds === void 0) throw new WorkerProviderError(`Crabbox profile ${key} must be a positive Go duration such as 60m`);
	return {
		duration,
		milliseconds: Number(nanoseconds) / 1e6
	};
}
function parsePositiveGoDurationNanoseconds(duration) {
	if (!GO_DURATION_PATTERN.test(duration)) return;
	let total = 0n;
	for (const match of duration.matchAll(GO_DURATION_TOKEN_PATTERN)) {
		const numberText = match[1];
		const unit = match[2] ? DURATION_UNIT_NANOSECONDS[match[2]] : void 0;
		if (!numberText || unit === void 0) return;
		const [wholeText = "", fractionText = ""] = numberText.split(".", 2);
		const whole = wholeText.replace(/^0+/u, "") || "0";
		if (whole.length > 19) return;
		total += BigInt(whole) * unit;
		const fraction = fractionText.slice(0, 18);
		if (fraction) total += BigInt(fraction) * unit / 10n ** BigInt(fraction.length);
		if (total > MAX_GO_DURATION_NANOSECONDS) return;
	}
	return total > 0n ? total : void 0;
}
function heartbeatIntervalMs(idleTimeoutMs) {
	const referenceIntervalMs = Math.max(5e3, Math.min(6e4, idleTimeoutMs / 3));
	return Math.min(referenceIntervalMs, Math.max(1, Math.floor(idleTimeoutMs / 2)));
}
function parseCrabboxProfile(profile) {
	for (const key of Object.keys(profile)) if (!PROFILE_KEYS.has(key)) throw new WorkerProviderError(`unknown Crabbox profile setting: ${key}`);
	const provider = normalizeOptionalString(profile.provider)?.toLowerCase();
	const machineClass = normalizeOptionalString(profile.class);
	if (!provider) throw new WorkerProviderError("Crabbox profile provider must be a non-empty string");
	if (!machineClass) throw new WorkerProviderError("Crabbox profile class must be a non-empty string");
	const { duration: ttl } = requirePositiveDuration(profile.ttl, "ttl");
	const { duration: idleTimeout, milliseconds: idleTimeoutMs } = requirePositiveDuration(profile.idleTimeout, "idleTimeout");
	const binaryValue = profile.binary;
	const binary = binaryValue === void 0 ? void 0 : normalizeOptionalString(binaryValue);
	if (binaryValue !== void 0 && !binary) throw new WorkerProviderError("Crabbox profile binary must be a non-empty string");
	if (binary && !path.isAbsolute(binary)) throw new WorkerProviderError("Crabbox profile binary must be an absolute path");
	const setupValue = profile.setup;
	const setup = setupValue === void 0 ? void 0 : normalizeOptionalString(setupValue);
	if (setupValue !== void 0 && !setup) throw new WorkerProviderError("Crabbox profile setup must be a non-empty command string");
	let setupEnv;
	if (profile.setupEnv !== void 0) {
		if (!Array.isArray(profile.setupEnv)) throw new WorkerProviderError("Crabbox profile setupEnv must be an array");
		if (profile.setupEnv.length > 16) throw new WorkerProviderError("Crabbox profile setupEnv must contain at most 16 names");
		setupEnv = profile.setupEnv.map((name) => {
			if (typeof name !== "string" || !/^[A-Za-z_][A-Za-z0-9_]*$/u.test(name)) throw new WorkerProviderError("Crabbox profile setupEnv must contain only valid POSIX environment variable names");
			if (name === "CRABBOX_ENV_ALLOW") throw new WorkerProviderError(`Crabbox profile setupEnv name ${name} is reserved`);
			return name;
		});
		if (new Set(setupEnv).size !== setupEnv.length) throw new WorkerProviderError("Crabbox profile setupEnv must not contain duplicate names");
		if (setupEnv.length > 0 && !setup) throw new WorkerProviderError("Crabbox profile setupEnv requires setup");
	}
	const desktop = profile.desktop;
	if (desktop !== void 0 && typeof desktop !== "boolean") throw new WorkerProviderError("Crabbox profile desktop must be a boolean");
	if (desktop && !CRABBOX_DESKTOP_PROVIDERS.has(provider)) throw new WorkerProviderError("Crabbox desktop profiles support only AWS and coordinator-backed Hetzner");
	const warmImage = profile.warmImage;
	if (warmImage !== void 0 && typeof warmImage !== "boolean") throw new WorkerProviderError("Crabbox profile warmImage must be a boolean");
	return {
		binary,
		class: machineClass,
		desktop,
		heartbeatIntervalMs: heartbeatIntervalMs(idleTimeoutMs),
		heartbeatTimeoutMs: Math.min(CRABBOX_HEARTBEAT_TIMEOUT_MS, Math.max(1, Math.floor(idleTimeoutMs / 2))),
		idleTimeout,
		provider,
		setup,
		setupEnv,
		ttl,
		warmImage: warmImage ?? false
	};
}
function resolveCrabboxProfileSetupEnv(setupEnv) {
	if (!setupEnv?.length) return;
	return Object.fromEntries(setupEnv.map((name) => {
		const value = process.env[name];
		if (!Object.hasOwn(process.env, name) || value === void 0) throw new WorkerProviderError(`Crabbox profile setupEnv variable is missing: ${name}`);
		return [name, value];
	}));
}
function resolveCrabboxProvisionProfile(profile, requestedClassValue) {
	const configured = parseCrabboxProfile(profile);
	const requestedClass = normalizeOptionalString(requestedClassValue);
	if (requestedClassValue !== void 0 && (!requestedClass || requestedClass.length > MAX_CRABBOX_MACHINE_CLASS_LENGTH)) throw new WorkerProviderError("Crabbox machine class must be a non-empty string of at most 128 characters");
	const resolved = requestedClass ? {
		...configured,
		class: requestedClass
	} : configured;
	return {
		profile: resolved,
		forwardedEnv: resolveCrabboxProfileSetupEnv(resolved.setupEnv)
	};
}
function listCrabboxMachineOptions(configuredClass, shapes = []) {
	const seen = /* @__PURE__ */ new Set();
	const candidates = shapes.filter((shape) => {
		if (shape.class.length > MAX_CRABBOX_MACHINE_CLASS_LENGTH || seen.has(shape.class)) return false;
		seen.add(shape.class);
		return true;
	});
	if (candidates.length === 0) return [];
	const catalogLimit = candidates.slice(0, MAX_CRABBOX_MACHINE_OPTIONS).some((shape) => shape.class === configuredClass) ? MAX_CRABBOX_MACHINE_OPTIONS : MAX_CRABBOX_MACHINE_OPTIONS - 1;
	const options = candidates.slice(0, catalogLimit).map((shape) => {
		const id = shape.class;
		const result = {
			id,
			label: id.replace(/^./u, (initial) => initial.toUpperCase())
		};
		if (shape.cpu !== void 0) result.cpu = shape.cpu;
		if (shape.memoryGb !== void 0) result.memoryGb = shape.memoryGb;
		if (id === configuredClass) result.default = true;
		return result;
	});
	if (!options.some((option) => option.id === configuredClass)) options.push({
		id: configuredClass,
		label: configuredClass,
		default: true
	});
	return options;
}
function buildCrabboxWarmupArgs(profile, leaseId, slug) {
	const args = [
		"warmup",
		"--provider",
		profile.provider,
		"--network",
		"public",
		"--tailscale=false",
		"--class",
		profile.class,
		"--ttl",
		profile.ttl,
		"--idle-timeout",
		profile.idleTimeout,
		"--lease-id",
		leaseId,
		"--slug",
		slug,
		"--keep=true"
	];
	if (profile.desktop) args.push("--desktop", "--browser", "--desktop-env", "xfce");
	return args;
}
function defaultIsExecutable(candidate, platform) {
	try {
		if (!fs.statSync(candidate).isFile()) return false;
		fs.accessSync(candidate, platform === "win32" ? fs.constants.F_OK : fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function binaryCandidates(base, platform) {
	return platform === "win32" ? [
		".exe",
		".cmd",
		".bat",
		".com",
		""
	].map((suffix) => `${base}${suffix}`) : [base];
}
function resolveCrabboxBinary(params) {
	if (params.explicit) return params.explicit;
	return findCrabboxBinary(params) ?? "crabbox";
}
function findCrabboxBinary(params) {
	const platform = params.platform ?? process.platform;
	const isExecutable = params.isExecutable ?? ((candidate) => defaultIsExecutable(candidate, platform));
	if (params.explicit) return isExecutable(params.explicit) ? params.explicit : void 0;
	const siblingBase = path.resolve(params.openclawRoot, "../crabbox/bin/crabbox");
	for (const candidate of binaryCandidates(siblingBase, platform)) if (isExecutable(candidate)) return candidate;
	const delimiter = platform === "win32" ? ";" : ":";
	const executableNames = binaryCandidates("crabbox", platform);
	for (const directory of (params.pathEnv ?? "").split(delimiter)) {
		if (!directory) continue;
		for (const name of executableNames) {
			const candidate = path.resolve(directory, name);
			if (isExecutable(candidate)) return candidate;
		}
	}
}
function resolveOpenClawRoot(pluginRoot) {
	if (!pluginRoot) return process.cwd();
	const extensionsDir = path.dirname(pluginRoot);
	if (path.basename(extensionsDir) !== "extensions") return process.cwd();
	const extensionParent = path.dirname(extensionsDir);
	return path.basename(extensionParent) === "dist" || path.basename(extensionParent) === "dist-runtime" ? path.dirname(extensionParent) : extensionParent;
}
function operationSlug(operationId) {
	return `openclaw-${createHash("sha256").update(operationId).digest("hex").slice(0, 32)}`;
}
function operationLeaseId(operationId) {
	return `cbx_${createHash("sha256").update(CRABBOX_LEASE_ID_DOMAIN).update(operationId).digest("hex").slice(0, 12)}`;
}
//#endregion
export { countCrabboxProvisionSetupPhases as _, operationLeaseId as a, resolveCrabboxProvisionCallTimeoutMs as b, resolveCrabboxBinary as c, CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS as d, CRABBOX_LIFECYCLE_TIMEOUT_MS as f, CRABBOX_WARMUP_TIMEOUT_MS as g, CRABBOX_SETUP_TIMEOUT_MS as h, listCrabboxMachineOptions as i, resolveCrabboxProvisionProfile as l, CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS as m, buildCrabboxWarmupArgs as n, operationSlug as o, CRABBOX_MACHINE_CATALOG_TIMEOUT_MS as p, findCrabboxBinary as r, parseCrabboxProfile as s, CRABBOX_WORKER_PROVIDER_ID as t, resolveOpenClawRoot as u, resolveCrabboxLifecycleTimeoutMs as v, resolveCrabboxReadyPollIntervalMs as x, resolveCrabboxProvisionBaseTimeoutMs as y };
