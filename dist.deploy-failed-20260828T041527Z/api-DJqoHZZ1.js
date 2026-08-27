import { o as registerHealthCheck, r as getHealthCheck } from "./health-check-registry-CBs_fO63.js";
import "./health-Dk4e4qWS.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region extensions/cua-computer/package.json
var package_default = {
	name: "@openclaw/cua-computer",
	version: "2026.8.1",
	description: "Experimental CUA Driver computer control for macOS, Windows, and Linux node hosts",
	type: "module",
	dependencies: {
		"@trycua/cua-driver": "0.21.0",
		"rastermill": "0.3.2",
		"zod": "4.4.3"
	},
	devDependencies: { "@openclaw/plugin-sdk": "workspace:*" },
	cuaDriverArtifacts: {
		"darwin-universal-binary": { "archiveSha256": "5e327e58f6ce81d5c117fe5edec5f267e87e1b921e8c5a8aa4f7f21cbcf5f273" },
		"linux-arm64-gnu": { "files": {
			"cua_driver_node_runtime.node": "64b5f8534c2f8ea1853367c6b89c3e0c0c42c5293ed9f688d9a6102887b774e6",
			"libcua_driver_sdk.so": "9204d336e71be8ae1cb6bb97a49c568b3314a494fe84539aa74ddecec7db5565"
		} },
		"linux-x64-gnu": { "files": {
			"cua_driver_node_runtime.node": "69dacc1af8458895d4fe450ad72b74f8794dab191c8f487efe30761d91b1a493",
			"libcua_driver_sdk.so": "452bdc90c6182f823669686656f1c1dd4b6af36baa44ffcadd80fd59a9799c05"
		} },
		"win32-arm64-msvc": { "files": {
			"cua_driver_node_runtime.node": "1c1a3958a10f85202e6b8a2169be0db020c10540a43e4e3c93fa5bd518b17191",
			"cua_driver_sdk.dll": "f92b9cdc2f9475b84a384c10b444e2fbe15b01d4a2107202606d85296c18ead9"
		} },
		"win32-x64-msvc": { "files": {
			"cua_driver_node_runtime.node": "f98d2370b2a16065860e72624a59c6dab26ade7b5cc2ea688ce756de36be31ec",
			"cua_driver_sdk.dll": "5bb7432e44ebf5474a4e655e7b447e06f8b3faa4b69fda4fbb12b6d37e117eba"
		} }
	},
	openclaw: { "extensions": ["./index.ts"] }
};
//#endregion
//#region extensions/cua-computer/src/driver-artifact-verification.ts
const DRIVER_PACKAGE = "@trycua/cua-driver";
function failure(code, message, fixHint) {
	return {
		ok: false,
		code,
		diagnostic: `${code}: ${message} Fix: ${fixHint}`,
		fixHint
	};
}
function resolveArtifactPlatform(platform, arch, linuxLibc) {
	if (platform === "linux") {
		if (linuxLibc !== "gnu" || arch !== "arm64" && arch !== "x64") return {
			kind: "unsupported",
			host: `${platform}/${arch}/${linuxLibc ?? "unknown-libc"}`
		};
		return {
			kind: "applicable",
			key: `linux-${arch}-gnu`
		};
	}
	if (platform === "win32") {
		if (arch !== "arm64" && arch !== "x64") return {
			kind: "unsupported",
			host: `${platform}/${arch}`
		};
		return {
			kind: "applicable",
			key: `win32-${arch}-msvc`
		};
	}
	return { kind: "not-applicable" };
}
function readJson(pathname) {
	return JSON.parse(fs.readFileSync(pathname, "utf8"));
}
function readPackageIdentity(pathname) {
	const value = readJson(pathname);
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const record = value;
	return {
		name: typeof record.name === "string" ? record.name : void 0,
		version: typeof record.version === "string" ? record.version : void 0
	};
}
function isSha256(value) {
	return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}
function loadArtifactRecord(manifestValue, key) {
	const value = manifestValue;
	const version = value.dependencies?.[DRIVER_PACKAGE];
	const artifact = value.cuaDriverArtifacts?.[key];
	if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/u.test(version) || !artifact || !artifact.files || Object.keys(artifact.files).length === 0 || Object.entries(artifact.files).some(([filename, digest]) => path.basename(filename) !== filename || !isSha256(digest))) return;
	return {
		version,
		artifact
	};
}
function hashFile(pathname) {
	return createHash("sha256").update(fs.readFileSync(pathname)).digest("hex");
}
function inspectCuaDriverArtifacts(options) {
	const selected = resolveArtifactPlatform(options.platform, options.arch, options.linuxLibc);
	if (selected.kind === "not-applicable") return {
		ok: true,
		applicable: false
	};
	if (selected.kind === "unsupported") return failure("COMPUTER_DRIVER_PLATFORM_UNSUPPORTED", `the pinned CUA Driver SDK has no native package for ${selected.host}.`, "Run this node host on Windows x64/ARM64 or glibc-based Linux x64/ARM64.");
	let accepted;
	try {
		accepted = loadArtifactRecord(options.pluginManifest, selected.key);
	} catch {
		accepted = void 0;
	}
	if (!accepted) return failure("COMPUTER_DRIVER_MANIFEST_INVALID", `the cua-computer artifact record for ${selected.key} is missing or invalid.`, "Reinstall OpenClaw from a complete official package.");
	const platformPackage = `${DRIVER_PACKAGE}-${selected.key}`;
	const sdkManifestPath = options.resolvePackageJson(DRIVER_PACKAGE);
	const platformManifestPath = options.resolvePackageJson(platformPackage);
	if (!sdkManifestPath || !platformManifestPath) {
		const missing = sdkManifestPath ? platformPackage : DRIVER_PACKAGE;
		const fixHint = `Reinstall OpenClaw on this node host so ${DRIVER_PACKAGE} ${accepted.version} and its native platform package are installed together.`;
		return failure("COMPUTER_DRIVER_PACKAGE_MISSING", `${missing} ${accepted.version} is not installed.`, fixHint);
	}
	let sdkIdentity;
	let platformIdentity;
	try {
		sdkIdentity = readPackageIdentity(sdkManifestPath);
		platformIdentity = readPackageIdentity(platformManifestPath);
	} catch {
		return failure("COMPUTER_DRIVER_PACKAGE_MISSING", "the resolved CUA Driver package metadata cannot be read.", "Reinstall OpenClaw on this node host; do not repair native package files by hand.");
	}
	if (sdkIdentity.name !== DRIVER_PACKAGE || platformIdentity.name !== platformPackage || sdkIdentity.version !== accepted.version || platformIdentity.version !== accepted.version) {
		const observed = `${sdkIdentity.name ?? "unknown"}@${sdkIdentity.version ?? "unknown"} + ${platformIdentity.name ?? "unknown"}@${platformIdentity.version ?? "unknown"}`;
		const fixHint = `Reinstall or update OpenClaw on this node host so both CUA Driver packages resolve to ${accepted.version}.`;
		return failure("COMPUTER_DRIVER_VERSION_MISMATCH", `expected ${DRIVER_PACKAGE} and ${platformPackage} ${accepted.version}, resolved ${observed}.`, fixHint);
	}
	const packageDir = path.dirname(platformManifestPath);
	for (const [filename, expectedDigest] of Object.entries(accepted.artifact.files).toSorted(([left], [right]) => left.localeCompare(right))) {
		const pathname = path.join(packageDir, filename);
		let stat;
		try {
			stat = fs.lstatSync(pathname);
		} catch {
			const fixHint = `Reinstall OpenClaw on this node host to restore ${platformPackage} ${accepted.version}.`;
			return failure("COMPUTER_DRIVER_PACKAGE_MISSING", `${platformPackage} is missing ${filename}.`, fixHint);
		}
		if (!stat.isFile() || stat.isSymbolicLink()) return failure("COMPUTER_DRIVER_DIGEST_MISMATCH", `${platformPackage}/${filename} is not a regular file.`, "Reinstall OpenClaw; the native driver files must be regular package files.");
		let actualDigest;
		try {
			actualDigest = hashFile(pathname);
		} catch {
			const fixHint = `Reinstall OpenClaw on this node host to restore ${platformPackage} ${accepted.version}.`;
			return failure("COMPUTER_DRIVER_PACKAGE_MISSING", `${platformPackage}/${filename} cannot be read.`, fixHint);
		}
		if (actualDigest !== expectedDigest) return failure("COMPUTER_DRIVER_DIGEST_MISMATCH", `${platformPackage}/${filename} does not match the accepted ${accepted.version} digest.`, "Reinstall OpenClaw; do not run or replace the mismatched native package files.");
	}
	return {
		ok: true,
		applicable: true,
		version: accepted.version,
		platformPackage
	};
}
//#endregion
//#region extensions/cua-computer/src/driver-artifacts.ts
const requireFromPlugin = createRequire(import.meta.url);
function resolvePackageEntry(packageName) {
	try {
		return requireFromPlugin.resolve(packageName);
	} catch {}
	try {
		return fileURLToPath(import.meta.resolve(packageName));
	} catch {
		return;
	}
}
function resolvePackageJson(packageName) {
	try {
		return requireFromPlugin.resolve(`${packageName}/package.json`);
	} catch {}
	const entry = resolvePackageEntry(packageName);
	if (!entry) return;
	let current = path.dirname(entry);
	while (true) {
		const candidate = path.join(current, "package.json");
		try {
			if (readPackageIdentity(candidate).name === packageName) return candidate;
		} catch {}
		const parent = path.dirname(current);
		if (parent === current) return;
		current = parent;
	}
}
function detectLinuxLibc() {
	return typeof (process.report?.getReport())?.header?.glibcVersionRuntime === "string" ? "gnu" : "musl";
}
let installedVerification;
function verifyInstalledCuaDriverArtifacts() {
	installedVerification ??= inspectCuaDriverArtifacts({
		platform: process.platform,
		arch: process.arch,
		...process.platform === "linux" ? { linuxLibc: detectLinuxLibc() } : {},
		pluginManifest: package_default,
		resolvePackageJson
	});
	return installedVerification;
}
//#endregion
//#region extensions/cua-computer/src/doctor.ts
const CUA_DRIVER_ARTIFACT_CHECK_ID = "cua-computer/driver-artifacts";
const cuaDriverArtifactCheck = {
	id: CUA_DRIVER_ARTIFACT_CHECK_ID,
	kind: "plugin",
	description: "Verify the installed Windows/Linux CUA Driver SDK artifact.",
	source: "cua-computer",
	async detect() {
		const verification = verifyInstalledCuaDriverArtifacts();
		if (verification.ok) return [];
		return [{
			checkId: CUA_DRIVER_ARTIFACT_CHECK_ID,
			severity: "error",
			source: "cua-computer",
			message: verification.diagnostic,
			target: "@trycua/cua-driver",
			requirement: "the accepted CUA Driver SDK version and native package digests",
			fixHint: verification.fixHint
		}];
	}
};
const registeredHosts = /* @__PURE__ */ new WeakSet();
function registerCuaDriverDoctorChecks(host) {
	const registerHealthCheck$1 = host?.registerHealthCheck ?? registerHealthCheck;
	if (registeredHosts.has(registerHealthCheck$1)) return;
	if (host === void 0 && getHealthCheck("cua-computer/driver-artifacts") === cuaDriverArtifactCheck) return;
	registerHealthCheck$1(cuaDriverArtifactCheck);
	registeredHosts.add(registerHealthCheck$1);
}
//#endregion
export { registerCuaDriverDoctorChecks as n, verifyInstalledCuaDriverArtifacts as r, CUA_DRIVER_ARTIFACT_CHECK_ID as t };
