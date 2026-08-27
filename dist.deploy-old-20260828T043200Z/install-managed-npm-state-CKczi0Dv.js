import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord, s as filterStringRecord } from "./record-coerce-DItp3I4t.js";
import { i as isNotFoundPathError } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import "./errors-Ccx0R-_Z.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { c as emitTrustedSecurityEvent } from "./diagnostic-events-BGzDm6gu.js";
import { n as readJson, r as readJsonIfExists, t as JsonFileReadError, u as writeJson } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { o as resolvePackageExtensionEntries } from "./manifest-DFeZvDdx.js";
import { s as parseRegistryNpmSpec, u as validateRegistryNpmSpec } from "./npm-registry-spec-BdgyvSs0.js";
import { a as resolveDefaultPluginExtensionsDir, f as resolvePluginNpmProjectDir, l as resolvePluginNpmGenerationProjectDir, u as resolvePluginNpmGenerationProjectDirPrefix } from "./install-paths-DllFtsSG.js";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-BQXdZhrB.js";
import { r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-BqtSDJEu.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { a as createSafeNpmInstallArgs, i as resolvePackageDirInstallTransaction, o as createSafeNpmInstallEnv, r as requestDeferredPackageDirInstall } from "./install-package-dir-B1M2mVjW.js";
import { o as relinkOpenClawPeerDependenciesInManagedNpmRoot } from "./plugin-peer-link-CNPdFqM4.js";
import { constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { parse as parse$1 } from "yaml";
//#region src/infra/npm-managed-root.ts
function readDependencyRecord(value) {
	return filterStringRecord(value) ?? {};
}
function isSafePackageName(name) {
	if (name.startsWith("@")) {
		const parts = name.split("/");
		return parts.length === 2 && parts.every((part) => part.length > 0 && part !== "." && part !== "..");
	}
	return name.length > 0 && !name.includes("/") && !name.includes("\\") && name !== "." && name !== "..";
}
function isManagedNpmRootHostPeerPackageName(name) {
	return name === "openclaw";
}
function readOverrideRecord(value) {
	if (!isRecord(value)) return {};
	const overrides = {};
	for (const [key, raw] of Object.entries(value)) if (key.trim()) overrides[key] = raw;
	return overrides;
}
function readManagedOverrideKeys(value) {
	if (!isRecord(value) || !Array.isArray(value.managedOverrides)) return [];
	return value.managedOverrides.filter((key) => typeof key === "string");
}
function readManagedPeerDependencyKeys(value) {
	if (!isRecord(value) || !Array.isArray(value.managedPeerDependencies)) return [];
	return value.managedPeerDependencies.filter((key) => typeof key === "string");
}
function buildManagedOpenClawMetadata(params) {
	const metadata = isRecord(params.current) ? { ...params.current } : {};
	if (params.managedOverrideKeys.length > 0) metadata.managedOverrides = params.managedOverrideKeys;
	else delete metadata.managedOverrides;
	const managedPeerDependencyKeys = params.managedPeerDependencyKeys;
	if (managedPeerDependencyKeys && managedPeerDependencyKeys.length > 0) metadata.managedPeerDependencies = managedPeerDependencyKeys;
	else if (managedPeerDependencyKeys) delete metadata.managedPeerDependencies;
	return Object.keys(metadata).length > 0 ? metadata : void 0;
}
async function readManagedNpmRootManifest(filePath) {
	const parsed = await readJsonIfExists(filePath);
	return isRecord(parsed) ? { ...parsed } : {};
}
async function readHostWorkspaceOverrides(packageRoot) {
	const workspace = parse$1(await fs$1.readFile(path.join(packageRoot, "pnpm-workspace.yaml"), "utf8"));
	return isRecord(workspace) ? readOverrideRecord(workspace.overrides) : {};
}
function readHostDependencySpec(manifest, packageName) {
	return manifest.dependencies?.[packageName] ?? manifest.optionalDependencies?.[packageName] ?? manifest.peerDependencies?.[packageName] ?? manifest.devDependencies?.[packageName];
}
function resolveHostOverrideReferences(value, manifest) {
	if (typeof value === "string" && value.startsWith("$")) return readHostDependencySpec(manifest, value.slice(1)) ?? value;
	if (!isRecord(value)) return value;
	const resolved = {};
	for (const [key, nested] of Object.entries(value)) resolved[key] = resolveHostOverrideReferences(nested, manifest);
	return resolved;
}
function isUnsupportedManagedNpmOverride(value) {
	return typeof value === "string" && value.trim().startsWith("npm:");
}
function isPnpmParentChildOverrideSelector(key) {
	return /[^ |@]>/u.test(key);
}
function filterUnsupportedManagedNpmRootOverrides(value, omitNpmAliases = false) {
	const overrides = readOverrideRecord(value);
	const filtered = {};
	for (const [key, raw] of Object.entries(overrides)) {
		if (isPnpmParentChildOverrideSelector(key) || omitNpmAliases && isUnsupportedManagedNpmOverride(raw)) continue;
		if (isRecord(raw)) {
			const nested = filterUnsupportedManagedNpmRootOverrides(raw, omitNpmAliases);
			if (Object.keys(nested).length > 0) filtered[key] = nested;
			continue;
		}
		filtered[key] = raw;
	}
	return filtered;
}
function readRootOverrideSpec(value) {
	if (typeof value === "string") return value;
	if (isRecord(value) && typeof value["."] === "string") return value["."];
}
/**
* npm rejects manifests where an override changes the effective spec of a root direct
* dependency (Arborist EOVERRIDE), which bricks every later install in the managed root.
* Managed peer pins follow the override; for owned root deps the managed override yields.
*/
function reconcileManagedNpmRootOverrideConflicts(params) {
	for (const [packageName, overrideValue] of Object.entries(params.overrides)) {
		const dependencySpec = params.dependencies[packageName];
		if (dependencySpec === void 0) continue;
		const overrideSpec = readRootOverrideSpec(overrideValue);
		if (overrideSpec === void 0 || overrideSpec === "*" || overrideSpec.startsWith("$") || overrideSpec === dependencySpec) continue;
		if (params.managedDependencyNames.has(packageName)) {
			params.dependencies[packageName] = overrideSpec;
			continue;
		}
		if (!params.managedOverrideNames.has(packageName)) continue;
		if (isRecord(overrideValue)) {
			const trimmed = { ...overrideValue };
			delete trimmed["."];
			if (Object.keys(trimmed).length > 0) {
				params.overrides[packageName] = trimmed;
				continue;
			}
		}
		delete params.overrides[packageName];
	}
}
/** Merge managed overrides into a managed root manifest's override record and keep the
* EOVERRIDE invariant plus metadata (keys actually written) consistent in one place. */
function applyManagedNpmRootOverrides(params) {
	const overrides = readOverrideRecord(params.manifest.overrides);
	for (const key of readManagedOverrideKeys(params.manifest.openclaw)) delete overrides[key];
	Object.assign(overrides, params.managedOverrides);
	reconcileManagedNpmRootOverrideConflicts({
		dependencies: params.dependencies,
		overrides,
		managedDependencyNames: params.managedDependencyNames,
		managedOverrideNames: new Set(Object.keys(params.managedOverrides))
	});
	return {
		overrides,
		managedOverrideKeys: Object.keys(params.managedOverrides).filter((key) => Object.hasOwn(overrides, key)).toSorted()
	};
}
/** Read host OpenClaw pnpm overrides for reuse inside a managed npm root. */
async function readOpenClawManagedNpmRootOverrides(params) {
	const packageRoot = params?.packageRoot ?? resolveOpenClawPackageRootSync({
		argv1: params?.argv1 ?? process.argv[1],
		moduleUrl: params?.moduleUrl ?? import.meta.url,
		cwd: params?.cwd ?? process.cwd()
	});
	if (!packageRoot) return {};
	try {
		const manifest = JSON.parse(await fs$1.readFile(path.join(packageRoot, "package.json"), "utf8"));
		if (!isRecord(manifest)) return {};
		const hostManifest = manifest;
		const overrides = filterUnsupportedManagedNpmRootOverrides(await readHostWorkspaceOverrides(packageRoot));
		return Object.fromEntries(Object.entries(overrides).map(([key, value]) => [key, resolveHostOverrideReferences(value, hostManifest)]));
	} catch {
		return {};
	}
}
/** Resolve the dependency spec to write for a parsed registry package. */
function resolveManagedNpmRootDependencySpec(params) {
	return params.resolution.version ?? params.parsedSpec.selector ?? "latest";
}
/** Insert or update a dependency and managed override metadata in package.json. */
async function upsertManagedNpmRootDependency(params) {
	await fs$1.mkdir(params.npmRoot, { recursive: true });
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	const managedOverrides = filterUnsupportedManagedNpmRootOverrides(params.managedOverrides, params.omitNpmAliasOverrides);
	const nextDependencies = {
		...dependencies,
		[params.packageName]: params.dependencySpec
	};
	const managedDependencyNames = new Set(readManagedPeerDependencyKeys(manifest.openclaw));
	managedDependencyNames.delete(params.packageName);
	const { overrides, managedOverrideKeys } = applyManagedNpmRootOverrides({
		manifest,
		managedOverrides,
		dependencies: nextDependencies,
		managedDependencyNames
	});
	const openclawMetadata = buildManagedOpenClawMetadata({
		current: manifest.openclaw,
		managedOverrideKeys,
		managedPeerDependencyKeys: [...managedDependencyNames].toSorted()
	});
	const next = {
		...manifest,
		private: true,
		dependencies: nextDependencies
	};
	if (Object.keys(overrides).length > 0) next.overrides = overrides;
	else delete next.overrides;
	if (openclawMetadata) next.openclaw = openclawMetadata;
	else delete next.openclaw;
	await writeJson(manifestPath, next, { trailingNewline: true });
}
function isOptionalPeerDependency(manifest, peerName) {
	if (!isRecord(manifest.peerDependenciesMeta)) return false;
	const peerMetadata = manifest.peerDependenciesMeta[peerName];
	return isRecord(peerMetadata) && peerMetadata.optional === true;
}
function isDevOnlyLockPackage(value) {
	return isRecord(value) && value.dev === true;
}
function readStringList(value) {
	if (typeof value === "string") return [value];
	if (!Array.isArray(value)) return;
	const values = value.filter((entry) => typeof entry === "string");
	return values.length > 0 ? values : void 0;
}
function matchesNpmPlatformList(value, list) {
	if (!list) return true;
	if (list.length === 1 && list[0] === "any") return true;
	if (!value) return false;
	let negated = 0;
	let matched = false;
	for (const entry of list) {
		const negate = entry.startsWith("!");
		const test = negate ? entry.slice(1) : entry;
		if (negate) {
			negated += 1;
			if (value === test) return false;
		} else matched = matched || value === test;
	}
	return matched || negated === list.length;
}
function resolveCurrentLibc() {
	if (process.platform !== "linux") return;
	const report = process.report?.getReport();
	const header = isRecord(report) ? report.header : void 0;
	if (isRecord(header) && header.glibcVersionRuntime) return "glibc";
	const sharedObjects = isRecord(report) ? report.sharedObjects : void 0;
	if (Array.isArray(sharedObjects) && sharedObjects.some((file) => typeof file === "string" && file.includes("musl"))) return "musl";
}
function isUnsupportedOptionalLockPackage(value) {
	if (!isRecord(value) || value.optional !== true) return false;
	return !matchesNpmPlatformList(process.platform, readStringList(value.os)) || !matchesNpmPlatformList(process.arch, readStringList(value.cpu)) || !matchesNpmPlatformList(resolveCurrentLibc(), readStringList(value.libc));
}
function hasNpmPlatformConstraint(value) {
	return value.os !== void 0 || value.cpu !== void 0 || value.libc !== void 0;
}
function readLockPackageLocationName(location) {
	const parts = location.split("/");
	for (let index = parts.length - 1; index >= 0; index -= 1) {
		if (parts[index] !== "node_modules") continue;
		const first = parts[index + 1];
		if (!first) return;
		if (!first.startsWith("@")) return first;
		const second = parts[index + 2];
		return second ? `${first}/${second}` : void 0;
	}
}
function readLockPackageName(location, value) {
	if (isRecord(value)) {
		const packageName = normalizeOptionalString(value.name);
		if (packageName) return packageName;
	}
	return readLockPackageLocationName(location);
}
function resolveManagedNpmLockPackagePath(params) {
	const npmRoot = path.resolve(params.npmRoot);
	const packagePath = path.resolve(npmRoot, ...params.location.split("/"));
	const relativePath = path.relative(npmRoot, packagePath);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return;
	return packagePath;
}
function isTopLevelLockPackageLocation(location) {
	return location.split("/").filter((part) => part === "node_modules").length === 1;
}
async function isRequiredPlatformPackageComplete(params) {
	let manifest;
	try {
		manifest = await readJsonIfExists(path.join(params.packagePath, "package.json"));
	} catch (error) {
		if (error instanceof JsonFileReadError && error.reason === "parse") return false;
		throw error;
	}
	if (!isRecord(manifest)) return false;
	const packageName = normalizeOptionalString(manifest.name);
	if (!packageName || !isSafePackageName(packageName)) return false;
	if (!Array.isArray(manifest.files) || !manifest.files.includes("vendor")) return true;
	const executableName = packageName.split("/").at(-1);
	const ownsNativeExecutable = Object.entries(params.lockPackages).some(([location, entry]) => readLockPackageLocationName(location) === packageName && isRecord(entry) && (typeof entry.bin === "string" || isRecord(entry.bin) && typeof entry.bin[executableName ?? ""] === "string"));
	if (!executableName || !ownsNativeExecutable) return true;
	let vendorEntries;
	try {
		vendorEntries = await fs$1.readdir(path.join(params.packagePath, "vendor"), { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
	const executableFilename = process.platform === "win32" ? `${executableName}.exe` : executableName;
	for (const target of vendorEntries) {
		if (!target.isDirectory()) continue;
		try {
			await fs$1.access(path.join(params.packagePath, "vendor", target.name, "bin", executableFilename), constants.X_OK);
			return true;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "EACCES")) throw error;
		}
	}
	return false;
}
/** Lists explicitly required current-platform packages that npm left missing or incomplete. */
async function listMissingRequiredPlatformPackages(params) {
	const requiredPackageNames = new Set(params.requiredPackageNames);
	if (requiredPackageNames.size === 0) return [];
	const parsed = await readJson(path.join(params.npmRoot, "package-lock.json"));
	if (!isRecord(parsed) || !isRecord(parsed.packages)) return [];
	const missing = [];
	for (const [location, value] of Object.entries(parsed.packages)) {
		if (!isRecord(value) || value.optional !== true || !hasNpmPlatformConstraint(value) || isUnsupportedOptionalLockPackage(value)) continue;
		const name = readLockPackageLocationName(location);
		const packagePath = resolveManagedNpmLockPackagePath({
			npmRoot: params.npmRoot,
			location
		});
		if (!name || !requiredPackageNames.has(name) || !isSafePackageName(name) || !packagePath) continue;
		if (!await isRequiredPlatformPackageComplete({
			packagePath,
			lockPackages: parsed.packages
		})) missing.push({
			name,
			packagePath
		});
	}
	return missing.toSorted((left, right) => left.packagePath.localeCompare(right.packagePath));
}
function findLockPackageVersion(params) {
	if (!isRecord(params.lockfile.packages)) return;
	const preferredLocation = `node_modules/${params.packageName}`;
	const preferredPackage = params.lockfile.packages[preferredLocation];
	if (isRecord(preferredPackage) && !isDevOnlyLockPackage(preferredPackage) && !isUnsupportedOptionalLockPackage(preferredPackage)) {
		const preferredVersion = normalizeOptionalString(preferredPackage.version);
		if (preferredVersion) return preferredVersion;
	}
}
function collectNpmLockPeerDependencyPins(params) {
	const pins = /* @__PURE__ */ new Map();
	const packages = isRecord(params.lockfile.packages) ? params.lockfile.packages : {};
	for (const [location, value] of Object.entries(packages).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (location === "" || !isRecord(value) || isDevOnlyLockPackage(value) || isUnsupportedOptionalLockPackage(value)) continue;
		const packageName = readLockPackageName(location, value);
		if (packageName && isManagedNpmRootHostPeerPackageName(packageName)) continue;
		const peerDependencies = readDependencyRecord(value.peerDependencies);
		for (const [peerName, peerRange] of Object.entries(peerDependencies)) {
			if (isManagedNpmRootHostPeerPackageName(peerName) || pins.has(peerName) || !isSafePackageName(peerName)) continue;
			const version = findLockPackageVersion({
				lockfile: params.lockfile,
				packageName: peerName
			});
			if (!version && isOptionalPeerDependency(value, peerName)) continue;
			if (!version && !isTopLevelLockPackageLocation(location)) continue;
			pins.set(peerName, version ?? peerRange);
		}
	}
	return Object.fromEntries([...pins.entries()].toSorted(([left], [right]) => left.localeCompare(right)));
}
async function copyPathIfExists(source, destination) {
	try {
		await fs$1.cp(source, destination, { recursive: true });
	} catch (err) {
		if (err.code === "ENOENT") return;
		throw err;
	}
}
function scrubHostPeerFromLockPackage(value) {
	if (!isRecord(value)) return false;
	let changed = false;
	if (isRecord(value.peerDependencies) && "openclaw" in value.peerDependencies) {
		const peerDependencies = { ...value.peerDependencies };
		delete peerDependencies.openclaw;
		if (Object.keys(peerDependencies).length > 0) value.peerDependencies = peerDependencies;
		else delete value.peerDependencies;
		changed = true;
	}
	if (isRecord(value.peerDependenciesMeta) && "openclaw" in value.peerDependenciesMeta) {
		const peerDependenciesMeta = { ...value.peerDependenciesMeta };
		delete peerDependenciesMeta.openclaw;
		if (Object.keys(peerDependenciesMeta).length > 0) value.peerDependenciesMeta = peerDependenciesMeta;
		else delete value.peerDependenciesMeta;
		changed = true;
	}
	return changed;
}
async function scrubHostPeerFromTempPackageLock(lockPath) {
	const parsed = await readJsonIfExists(lockPath);
	if (!isRecord(parsed)) return;
	let changed = false;
	if (isRecord(parsed.packages)) for (const value of Object.values(parsed.packages)) changed = scrubHostPeerFromLockPackage(value) || changed;
	if (isRecord(parsed.dependencies)) for (const value of Object.values(parsed.dependencies)) changed = scrubHostPeerFromLockPackage(value) || changed;
	if (changed) await writeJson(lockPath, parsed, { trailingNewline: true });
}
function collectExistingManagedPeerDependencyPins(dependencies, previousManagedPeerDependencies) {
	const pins = {};
	for (const packageName of previousManagedPeerDependencies) {
		const dependencySpec = dependencies[packageName];
		if (dependencySpec) pins[packageName] = dependencySpec;
	}
	return pins;
}
function isHostPeerResolutionFailure(result) {
	const output = `${result.stdout}\n${result.stderr}`;
	return /(^|[^@\w.-])openclaw(?=$|[@\s:,"'])/i.test(output);
}
function createManagedNpmPeerPlanArgs(params) {
	return [
		"npm",
		"install",
		"--package-lock-only",
		...params?.force ? ["--force"] : [],
		...createSafeNpmInstallArgs({
			omitDev: true,
			omitPeer: true,
			legacyPeerDeps: params?.legacyPeerDeps,
			loglevel: "error",
			ignoreWorkspaces: true,
			noAudit: true,
			noFund: true
		}).slice(1)
	];
}
async function collectNpmResolvedManagedNpmRootPeerDependencyPins(params) {
	const manifest = params.manifest;
	const dependencies = readDependencyRecord(manifest.dependencies);
	const previousManagedPeerDependencies = readManagedPeerDependencyKeys(manifest.openclaw);
	const fallbackPeerPins = collectExistingManagedPeerDependencyPins(dependencies, previousManagedPeerDependencies);
	for (const packageName of previousManagedPeerDependencies) delete dependencies[packageName];
	const tempRoot = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-managed-peer-plan-"));
	try {
		delete dependencies.openclaw;
		await writeJson(path.join(tempRoot, "package.json"), {
			...manifest,
			private: true,
			dependencies
		}, { trailingNewline: true });
		await copyPathIfExists(path.join(params.npmRoot, "package-lock.json"), path.join(tempRoot, "package-lock.json"));
		const tempLockPath = path.join(tempRoot, "package-lock.json");
		await scrubHostPeerFromTempPackageLock(tempLockPath);
		await copyPathIfExists(path.join(params.npmRoot, ".npmrc"), path.join(tempRoot, ".npmrc"));
		await copyPathIfExists(path.join(params.npmRoot, "_openclaw-pack-archives"), path.join(tempRoot, "_openclaw-pack-archives"));
		const command = params.runCommand ?? runCommandWithTimeout;
		const npmPeerPlanArgs = createManagedNpmPeerPlanArgs({ force: true });
		const npmPlanOptions = {
			cwd: tempRoot,
			timeoutMs: Math.max(params.timeoutMs ?? 3e5, 3e5),
			signal: params.signal,
			killProcessTree: true,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: false,
				npmConfigCwd: tempRoot,
				packageLock: true,
				quiet: true
			})
		};
		const result = await command(npmPeerPlanArgs, npmPlanOptions);
		if (result.code !== 0) {
			if (isHostPeerResolutionFailure(result)) {
				if ((await command(createManagedNpmPeerPlanArgs({
					force: true,
					legacyPeerDeps: true
				}), {
					...npmPlanOptions,
					env: createSafeNpmInstallEnv(process.env, {
						legacyPeerDeps: true,
						npmConfigCwd: tempRoot,
						packageLock: true,
						quiet: true
					})
				})).code === 0) return collectNpmLockPeerDependencyPins({ lockfile: await readManagedNpmRootManifest(tempLockPath) });
			}
			return fallbackPeerPins;
		}
		return collectNpmLockPeerDependencyPins({ lockfile: await readManagedNpmRootManifest(tempLockPath) });
	} finally {
		await fs$1.rm(tempRoot, {
			recursive: true,
			force: true
		});
	}
}
/** Snapshot managed peer dependencies before a risky install/update operation. */
async function readManagedNpmRootPeerDependencySnapshot(params) {
	const manifest = await readManagedNpmRootManifest(path.join(params.npmRoot, "package.json"));
	const dependencies = readDependencyRecord(manifest.dependencies);
	const managedPeerDependencies = readManagedPeerDependencyKeys(manifest.openclaw).toSorted();
	const dependencySnapshot = {};
	for (const packageName of managedPeerDependencies) {
		const dependencySpec = dependencies[packageName];
		if (dependencySpec) dependencySnapshot[packageName] = dependencySpec;
	}
	return {
		dependencies: dependencySnapshot,
		managedPeerDependencies
	};
}
/** Restore a previously captured managed peer dependency snapshot. */
async function restoreManagedNpmRootPeerDependencySnapshot(params) {
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	for (const packageName of readManagedPeerDependencyKeys(manifest.openclaw)) delete dependencies[packageName];
	Object.assign(dependencies, params.snapshot.dependencies);
	const overrides = readOverrideRecord(manifest.overrides);
	const currentManagedOverrideKeys = readManagedOverrideKeys(manifest.openclaw);
	reconcileManagedNpmRootOverrideConflicts({
		dependencies,
		overrides,
		managedDependencyNames: new Set(params.snapshot.managedPeerDependencies),
		managedOverrideNames: new Set(currentManagedOverrideKeys)
	});
	const managedOverrideKeys = currentManagedOverrideKeys.filter((key) => Object.hasOwn(overrides, key)).toSorted();
	const openclawMetadata = buildManagedOpenClawMetadata({
		current: manifest.openclaw,
		managedOverrideKeys,
		managedPeerDependencyKeys: params.snapshot.managedPeerDependencies.toSorted()
	});
	const next = {
		...manifest,
		private: true,
		dependencies
	};
	if (Object.keys(overrides).length > 0) next.overrides = overrides;
	else delete next.overrides;
	if (openclawMetadata) next.openclaw = openclawMetadata;
	else delete next.openclaw;
	await writeJson(manifestPath, next, { trailingNewline: true });
}
/** Sync package.json with peer dependency pins resolved from npm's lock plan. */
async function syncManagedNpmRootPeerDependencies(params) {
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	const previousManagedPeerDependencies = readManagedPeerDependencyKeys(manifest.openclaw);
	const previousManagedPeerDependencySet = new Set(previousManagedPeerDependencies);
	const managedOverrides = filterUnsupportedManagedNpmRootOverrides(params.managedOverrides, params.omitNpmAliasOverrides);
	const plannedOverrides = applyManagedNpmRootOverrides({
		manifest,
		managedOverrides,
		dependencies: { ...dependencies },
		managedDependencyNames: previousManagedPeerDependencySet
	}).overrides;
	const peerPins = await collectNpmResolvedManagedNpmRootPeerDependencyPins({
		npmRoot: params.npmRoot,
		manifest: {
			...manifest,
			overrides: plannedOverrides
		},
		runCommand: params.runCommand,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	const managedPeerDependencyNames = new Set(Object.keys(peerPins).filter((packageName) => previousManagedPeerDependencySet.has(packageName) || !Object.hasOwn(dependencies, packageName)));
	const nextDependencies = { ...dependencies };
	for (const packageName of previousManagedPeerDependencies) if (!Object.hasOwn(peerPins, packageName)) delete nextDependencies[packageName];
	for (const [packageName, dependencySpec] of Object.entries(peerPins)) if (managedPeerDependencyNames.has(packageName)) nextDependencies[packageName] = dependencySpec;
	const { overrides, managedOverrideKeys } = applyManagedNpmRootOverrides({
		manifest,
		managedOverrides,
		dependencies: nextDependencies,
		managedDependencyNames: managedPeerDependencyNames
	});
	const managedPeerDependencyKeys = [...managedPeerDependencyNames].toSorted();
	const openclawMetadata = buildManagedOpenClawMetadata({
		current: manifest.openclaw,
		managedOverrideKeys,
		managedPeerDependencyKeys
	});
	const next = {
		...manifest,
		private: true,
		dependencies: nextDependencies
	};
	if (Object.keys(overrides).length > 0) next.overrides = overrides;
	else delete next.overrides;
	if (openclawMetadata) next.openclaw = openclawMetadata;
	else delete next.openclaw;
	const changed = JSON.stringify(next) !== JSON.stringify(manifest);
	if (changed) await writeJson(manifestPath, next, { trailingNewline: true });
	return changed;
}
/** Remove stale managed-root openclaw peer installs while preserving active host links. */
async function repairManagedNpmRootOpenClawPeer(params) {
	await fs$1.mkdir(params.npmRoot, { recursive: true });
	const activeHostState = await readManagedNpmRootOpenClawHostState({
		npmRoot: params.npmRoot,
		packageRoot: params.packageRoot
	});
	if (activeHostState === "managed-active-host") return false;
	const hasManifestDependency = "openclaw" in readDependencyRecord((await readManagedNpmRootManifest(path.join(params.npmRoot, "package.json"))).dependencies);
	const hasLockDependency = await managedNpmRootLockfileHasOpenClawPeer(params.npmRoot);
	const hasPackageDir = await pathExists(path.join(params.npmRoot, "node_modules", "openclaw"));
	const preserveActiveHostLink = activeHostState === "linked-active-host";
	if (!hasManifestDependency && !hasLockDependency && (!hasPackageDir || preserveActiveHostLink)) return false;
	if (preserveActiveHostLink) {
		await scrubManagedNpmRootOpenClawPeer({
			npmRoot: params.npmRoot,
			preservePackageDir: true
		});
		return true;
	}
	const command = params.runCommand ?? runCommandWithTimeout;
	const npmArgs = hasManifestDependency ? [
		"npm",
		"uninstall",
		"--loglevel=error",
		"--legacy-peer-deps",
		"--ignore-scripts",
		"--no-audit",
		"--no-fund",
		"openclaw"
	] : [
		"npm",
		"prune",
		"--loglevel=error",
		"--legacy-peer-deps",
		"--ignore-scripts",
		"--no-audit",
		"--no-fund"
	];
	try {
		const result = await command(npmArgs, {
			cwd: params.npmRoot,
			timeoutMs: Math.max(params.timeoutMs ?? 3e5, 3e5),
			signal: params.signal,
			killProcessTree: true,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: params.npmRoot,
				packageLock: true,
				quiet: true
			})
		});
		if (result.code !== 0) params.logger?.warn?.(`npm ${hasManifestDependency ? "uninstall openclaw" : "prune"} failed while repairing managed npm root; falling back to direct cleanup: ${result.stderr.trim() || result.stdout.trim()}`);
	} catch (error) {
		params.logger?.warn?.(`npm ${hasManifestDependency ? "uninstall openclaw" : "prune"} failed while repairing managed npm root; falling back to direct cleanup: ${String(error)}`);
	}
	await scrubManagedNpmRootOpenClawPeer({ npmRoot: params.npmRoot });
	return true;
}
async function readManagedNpmRootOpenClawHostState(params) {
	const packageRoot = params.packageRoot === void 0 ? resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	}) : params.packageRoot;
	if (!packageRoot) return "none";
	const managedOpenClawPackageDir = path.join(params.npmRoot, "node_modules", "openclaw");
	const [hostPackageRoot, managedPackageRoot, managedPackageStat] = await Promise.all([
		realpathIfExists(packageRoot),
		realpathIfExists(managedOpenClawPackageDir),
		lstatIfExists(managedOpenClawPackageDir)
	]);
	if (hostPackageRoot === null || hostPackageRoot !== managedPackageRoot) return "none";
	return managedPackageStat?.isSymbolicLink() ? "linked-active-host" : "managed-active-host";
}
async function managedNpmRootLockfileHasOpenClawPeer(npmRoot) {
	const lockPath = path.join(npmRoot, "package-lock.json");
	try {
		const parsed = JSON.parse(await fs$1.readFile(lockPath, "utf8"));
		if (isRecord(parsed.packages)) {
			const rootPackage = parsed.packages[""];
			if (isRecord(rootPackage) && isRecord(rootPackage.dependencies) && "openclaw" in rootPackage.dependencies) return true;
			if ("node_modules/openclaw" in parsed.packages) return true;
		}
		return isRecord(parsed.dependencies) && "openclaw" in parsed.dependencies;
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function realpathIfExists(filePath) {
	try {
		return await fs$1.realpath(filePath);
	} catch (err) {
		if (err.code === "ENOENT") return null;
		throw err;
	}
}
async function lstatIfExists(filePath) {
	try {
		return await fs$1.lstat(filePath);
	} catch (err) {
		if (err.code === "ENOENT") return null;
		throw err;
	}
}
async function pathExists(filePath) {
	return await fs$1.lstat(filePath).then(() => true).catch((err) => {
		if (hasErrnoCode(err, "ENOENT")) return false;
		throw err;
	});
}
async function scrubManagedNpmRootOpenClawPeer(params) {
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	if ("openclaw" in dependencies) {
		const { openclaw: _removed, ...nextDependencies } = dependencies;
		await fs$1.writeFile(manifestPath, `${JSON.stringify({
			...manifest,
			private: true,
			dependencies: nextDependencies
		}, null, 2)}\n`, "utf8");
	}
	const lockPath = path.join(params.npmRoot, "package-lock.json");
	try {
		const parsed = JSON.parse(await fs$1.readFile(lockPath, "utf8"));
		let lockChanged = false;
		if (isRecord(parsed.packages)) {
			const rootPackage = parsed.packages[""];
			if (isRecord(rootPackage) && isRecord(rootPackage.dependencies)) {
				const dependenciesValue = { ...rootPackage.dependencies };
				if ("openclaw" in dependenciesValue) {
					delete dependenciesValue.openclaw;
					parsed.packages[""] = {
						...rootPackage,
						dependencies: dependenciesValue
					};
					lockChanged = true;
				}
			}
			if ("node_modules/openclaw" in parsed.packages) {
				delete parsed.packages["node_modules/openclaw"];
				lockChanged = true;
			}
		}
		if (isRecord(parsed.dependencies) && "openclaw" in parsed.dependencies) {
			const dependenciesLocal = { ...parsed.dependencies };
			delete dependenciesLocal.openclaw;
			parsed.dependencies = dependenciesLocal;
			lockChanged = true;
		}
		if (lockChanged) await fs$1.writeFile(lockPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	const openclawPackageDir = path.join(params.npmRoot, "node_modules", "openclaw");
	if (!params.preservePackageDir && await pathExists(openclawPackageDir)) await fs$1.rm(openclawPackageDir, {
		recursive: true,
		force: true
	});
	const binDir = path.join(params.npmRoot, "node_modules", ".bin");
	await Promise.all([
		"openclaw",
		"openclaw.cmd",
		"openclaw.ps1"
	].map((binName) => fs$1.rm(path.join(binDir, binName), { force: true })));
	await fs$1.rm(path.join(params.npmRoot, "node_modules", ".package-lock.json"), { force: true });
}
/** Read lockfile metadata for an installed dependency in the managed root. */
async function readManagedNpmRootInstalledDependency(params) {
	const parsed = await readJson(path.join(params.npmRoot, "package-lock.json"));
	if (!isRecord(parsed) || !isRecord(parsed.packages)) return null;
	const entry = parsed.packages[`node_modules/${params.packageName}`];
	if (!isRecord(entry)) return null;
	return {
		version: normalizeOptionalString(entry.version),
		integrity: normalizeOptionalString(entry.integrity),
		resolved: normalizeOptionalString(entry.resolved)
	};
}
/** Remove a dependency from the managed root manifest. */
async function removeManagedNpmRootDependency(params) {
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	if (!(params.packageName in dependencies)) return;
	const { [params.packageName]: _removed, ...nextDependencies } = dependencies;
	await writeJson(manifestPath, {
		...manifest,
		private: true,
		dependencies: nextDependencies
	}, { trailingNewline: true });
}
//#endregion
//#region src/plugins/install-transaction.ts
const PLUGIN_INSTALL_TRANSACTION = Symbol.for("openclaw.pluginInstallTransaction");
const PLUGIN_INSTALL_TRANSACTION_REQUEST = Symbol.for("openclaw.pluginInstallTransactionRequest");
const PLUGIN_INSTALL_OWNER_MIGRATIONS = Symbol.for("openclaw.pluginInstallOwnerMigrations");
function attachPluginInstallTransaction(result, transaction) {
	Object.defineProperty(result, PLUGIN_INSTALL_TRANSACTION, {
		configurable: false,
		enumerable: true,
		value: transaction
	});
	return result;
}
function resolvePluginInstallTransaction(result) {
	return result[PLUGIN_INSTALL_TRANSACTION];
}
function requestDeferredPluginInstall(params, transactionSink) {
	Object.defineProperty(params, PLUGIN_INSTALL_TRANSACTION_REQUEST, {
		configurable: false,
		enumerable: true,
		value: {
			deferCommit: true,
			...transactionSink ? { transactionSink } : {}
		}
	});
	return params;
}
function copyPluginInstallTransactionRequest(source, target) {
	const request = resolvePluginInstallTransactionRequest(source);
	return request ? requestDeferredPluginInstall(target, request.transactionSink) : target;
}
function resolvePluginInstallTransactionRequest(params) {
	return params[PLUGIN_INSTALL_TRANSACTION_REQUEST];
}
function isPluginInstallCommitDeferred(params) {
	return resolvePluginInstallTransactionRequest(params)?.deferCommit === true;
}
function resolvePluginInstallTransactionSink(params) {
	return resolvePluginInstallTransactionRequest(params)?.transactionSink;
}
function attachPluginInstallOwnerMigrations(result, migrations) {
	Object.defineProperty(result, PLUGIN_INSTALL_OWNER_MIGRATIONS, {
		configurable: false,
		enumerable: true,
		value: migrations
	});
	return result;
}
function resolvePluginInstallOwnerMigrations(result) {
	return result[PLUGIN_INSTALL_OWNER_MIGRATIONS];
}
async function settlePluginInstallTransactions(transactions, action) {
	const ordered = action === "rollback" ? transactions.toReversed() : transactions;
	const errors = [];
	for (const transaction of ordered) try {
		await transaction[action]();
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, `Plugin install transaction ${action} failed`);
}
//#endregion
//#region src/plugins/install-types.ts
const PLUGIN_INSTALL_ERROR_CODE = {
	INVALID_NPM_SPEC: "invalid_npm_spec",
	INVALID_MIN_HOST_VERSION: "invalid_min_host_version",
	UNKNOWN_HOST_VERSION: "unknown_host_version",
	INCOMPATIBLE_HOST_VERSION: "incompatible_host_version",
	INCOMPATIBLE_PLUGIN_API: "incompatible_plugin_api",
	INVALID_PLUGIN_API: "invalid_plugin_api",
	MISSING_OPENCLAW_EXTENSIONS: "missing_openclaw_extensions",
	MISSING_PLUGIN_MANIFEST: "missing_plugin_manifest",
	EMPTY_OPENCLAW_EXTENSIONS: "empty_openclaw_extensions",
	INVALID_OPENCLAW_EXTENSIONS: "invalid_openclaw_extensions",
	NPM_METADATA_FAILURE: "npm_metadata_failure",
	NPM_PACKAGE_NOT_FOUND: "npm_package_not_found",
	RELEASE_COHORT_UNAVAILABLE: "release_cohort_unavailable",
	PLUGIN_ID_MISMATCH: "plugin_id_mismatch",
	SECURITY_SCAN_BLOCKED: "security_scan_blocked",
	SECURITY_SCAN_FAILED: "security_scan_failed",
	UNSUPPORTED_PLAIN_FILE_PLUGIN: "unsupported_plain_file_plugin"
};
/**
* Detects npm failures caused by a target that is not published, as opposed to a
* broken install. Channel-aware installs use this to widen the selector instead
* of failing when the requested release has no artifact.
*/
function isUnavailableNpmTarget(result) {
	return result.code === PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND || /\b(ETARGET|notarget)\b|No matching version found|dist-tag|tag .*not found/i.test(result.error);
}
//#endregion
//#region src/plugins/security-events.ts
function pluginLifecycleAction(mode) {
	return mode === "update" ? "plugin.updated" : "plugin.installed";
}
function pluginAuditOutcomeForReason(reason) {
	return reason === "security_scan_failed" ? "error" : "denied";
}
function emitPluginInstallSecurityEvent(params) {
	emitTrustedSecurityEvent({
		category: "plugin",
		action: pluginLifecycleAction(params.mode),
		outcome: "success",
		severity: "medium",
		actor: { kind: "operator" },
		target: {
			kind: "plugin",
			name: params.pluginId
		},
		policy: {
			id: "plugin.install",
			decision: "allow"
		},
		control: {
			id: "plugin.install",
			family: "supply_chain"
		},
		attributes: {
			source_family: params.sourceFamily,
			mode: params.mode,
			extension_count: params.extensionCount ?? 0,
			has_version: params.hasVersion ?? false,
			trusted_official_source: params.trustedSourceLinkedOfficialInstall === true
		}
	});
}
function emitPluginAuditSecurityEvent(params) {
	emitTrustedSecurityEvent({
		category: "plugin",
		action: "plugin.audit.failed",
		outcome: params.outcome,
		severity: params.outcome === "error" ? "high" : "medium",
		actor: { kind: "operator" },
		target: {
			kind: "plugin",
			...params.pluginId ? { name: params.pluginId } : {}
		},
		policy: {
			id: "plugin.install",
			decision: "deny",
			reason: params.reason
		},
		control: {
			id: "plugin.install.audit",
			family: "supply_chain"
		},
		reason: params.reason,
		attributes: {
			...params.sourceFamily ? { source_family: params.sourceFamily } : {},
			...params.mode ? { mode: params.mode } : {}
		}
	});
}
//#endregion
//#region src/plugins/install-shared.ts
const pluginInstallRuntimeLoader = createLazyImportLoader(() => import("./install.runtime.js"));
async function loadPluginInstallRuntime() {
	return await pluginInstallRuntimeLoader.load();
}
const defaultLogger = {};
function formatUnresolvedOpenClawPeerLinkError(packageName) {
	return `Installed plugin ${packageName} declares an openclaw dependency, but OpenClaw could not create a plugin-local node_modules/openclaw link. Run from a packaged OpenClaw install or reinstall OpenClaw, then retry.`;
}
const MISSING_EXTENSIONS_ERROR = "package.json missing openclaw.extensions; update the plugin package to include openclaw.extensions (for example [\"./dist/index.js\"]). See https://docs.openclaw.ai/help/troubleshooting#plugin-install-fails-with-missing-openclaw-extensions";
function validateOpenClawPackageCompatibility(params) {
	const pluginApiRangeCheck = resolvePackagePluginApiRange(params.packageMetadata);
	if (!pluginApiRangeCheck.ok) return {
		ok: false,
		error: `invalid package.json openclaw.compat.pluginApi: ${pluginApiRangeCheck.error}`,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_PLUGIN_API
	};
	const pluginApiRange = pluginApiRangeCheck.range;
	if (pluginApiRange && !satisfiesPluginApiRange(params.currentHostVersion, pluginApiRange)) return {
		ok: false,
		error: `plugin "${params.pluginId}" requires plugin API ${pluginApiRange}, but this OpenClaw runtime exposes ${params.currentHostVersion}. Upgrade OpenClaw or install a compatible plugin version and retry.`,
		code: PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API
	};
	return null;
}
function validateOpenClawPackageInstallCompatibility(params) {
	const currentHostVersion = params.runtime.resolveCompatibilityHostVersion();
	const minHostVersionCheck = params.runtime.checkMinHostVersion({
		currentVersion: currentHostVersion,
		minHostVersion: params.packageMetadata?.install?.minHostVersion
	});
	if (!minHostVersionCheck.ok) {
		if (minHostVersionCheck.kind === "invalid") return {
			ok: false,
			error: `invalid package.json openclaw.install.minHostVersion: ${minHostVersionCheck.error}`,
			code: PLUGIN_INSTALL_ERROR_CODE.INVALID_MIN_HOST_VERSION
		};
		if (minHostVersionCheck.kind === "unknown_host_version") return {
			ok: false,
			error: `plugin "${params.pluginId}" requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined. Re-run from a released build or set OPENCLAW_VERSION and retry.`,
			code: PLUGIN_INSTALL_ERROR_CODE.UNKNOWN_HOST_VERSION
		};
		return {
			ok: false,
			error: `plugin "${params.pluginId}" requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}. Upgrade OpenClaw and retry.`,
			code: PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_HOST_VERSION
		};
	}
	return validateOpenClawPackageCompatibility({
		pluginId: params.pluginId,
		currentHostVersion,
		packageMetadata: params.packageMetadata
	});
}
async function readOptionalPackageManifest(params) {
	const manifestPath = path.join(params.packageDir, "package.json");
	if (!await params.runtime.fileExists(manifestPath)) return { ok: true };
	try {
		return {
			ok: true,
			manifest: await params.runtime.readJsonFile(manifestPath)
		};
	} catch (err) {
		return {
			ok: false,
			error: `invalid package.json: ${String(err)}`
		};
	}
}
function ensureOpenClawExtensions(params) {
	const resolved = resolvePackageExtensionEntries(params.manifest);
	if (resolved.status === "missing") return {
		ok: false,
		error: MISSING_EXTENSIONS_ERROR,
		code: PLUGIN_INSTALL_ERROR_CODE.MISSING_OPENCLAW_EXTENSIONS
	};
	if (resolved.status === "empty") return {
		ok: false,
		error: "package.json openclaw.extensions is empty",
		code: PLUGIN_INSTALL_ERROR_CODE.EMPTY_OPENCLAW_EXTENSIONS
	};
	if (resolved.status === "invalid") return {
		ok: false,
		error: resolved.error,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_OPENCLAW_EXTENSIONS
	};
	return {
		ok: true,
		entries: resolved.entries
	};
}
function buildDirectoryInstallResult(params) {
	return {
		ok: true,
		pluginId: params.pluginId,
		targetDir: params.targetDir,
		manifestName: params.manifestName,
		version: params.version,
		extensions: params.extensions,
		...params.setup ? { setup: params.setup } : {}
	};
}
function emitSuccessfulPluginInstallSecurityEvent(result, params) {
	if (params.dryRun || !result.ok) return;
	emitPluginInstallSecurityEvent({
		pluginId: result.pluginId,
		mode: params.mode,
		sourceFamily: params.sourceFamily,
		extensionCount: result.extensions.length,
		hasVersion: Boolean(result.version),
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
}
function hasPackageRuntimeDependencies(manifest) {
	return Object.keys(manifest.dependencies ?? {}).length > 0 || Object.keys(manifest.optionalDependencies ?? {}).length > 0;
}
function buildBlockedInstallResult(params) {
	return {
		ok: false,
		error: params.blocked.reason,
		...params.blocked.installPolicyWarning ? { installPolicyWarning: params.blocked.installPolicyWarning } : {},
		...params.blocked.code === "security_scan_failed" ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED } : params.blocked.code === "security_scan_blocked" ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_BLOCKED } : {}
	};
}
function sourceFamilyForInstallPolicyKind(kind, fallback) {
	switch (kind) {
		case "plugin-archive": return "archive";
		case "plugin-dir": return "directory";
		case "plugin-git": return "git";
		case "plugin-npm": return "npm";
		case void 0: return fallback;
	}
	return fallback;
}
function sourceFamilyForInstallPolicySource(source, fallback) {
	switch (source?.kind) {
		case "archive": return "archive";
		case "file": return "file";
		case "git": return "git";
		case "npm": return "npm";
		case "bundled":
		case "clawhub":
		case "local-path":
		case "managed":
		case "upload":
		case "workspace":
		case void 0: return fallback;
	}
	return fallback;
}
async function ensureInstallTargetAvailableForMode(params) {
	return await params.runtime.ensureInstallTargetAvailable({
		mode: params.mode,
		targetDir: params.targetPath,
		alreadyExistsError: `plugin already exists: ${params.targetPath} (delete it first)`
	});
}
async function resolvePreparedDirectoryInstallTarget(params) {
	const targetDirResult = await resolvePluginInstallTarget({
		runtime: params.runtime,
		pluginId: params.pluginId,
		extensionsDir: params.extensionsDir,
		nameEncoder: params.nameEncoder
	});
	if (!targetDirResult.ok) return targetDirResult;
	return {
		ok: true,
		target: {
			targetPath: targetDirResult.targetDir,
			effectiveMode: await resolveEffectiveInstallMode({
				runtime: params.runtime,
				requestedMode: params.requestedMode,
				targetPath: targetDirResult.targetDir
			})
		}
	};
}
async function runInstallSourceScan(params) {
	try {
		const scanResult = await params.scan();
		if (scanResult?.blocked) {
			const reason = scanResult.blocked.code === "security_scan_failed" ? "security_scan_failed" : "security_scan_blocked";
			emitPluginAuditSecurityEvent({
				outcome: pluginAuditOutcomeForReason(reason),
				reason,
				pluginId: params.pluginId,
				mode: params.mode,
				sourceFamily: params.sourceFamily
			});
			return buildBlockedInstallResult({ blocked: scanResult.blocked });
		}
		return null;
	} catch (err) {
		emitPluginAuditSecurityEvent({
			outcome: "error",
			reason: "security_scan_failed",
			pluginId: params.pluginId,
			mode: params.mode,
			sourceFamily: params.sourceFamily
		});
		return {
			ok: false,
			error: `${params.subject} installation blocked: code safety scan failed (${String(err)}). Run "openclaw security audit --deep" for details.`,
			code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED
		};
	}
}
async function installPluginDirectoryIntoExtensions(params) {
	const runtime = await loadPluginInstallRuntime();
	let targetDir = params.targetDir;
	if (!targetDir) {
		const targetDirResult = await resolvePluginInstallTarget({
			runtime,
			pluginId: params.pluginId,
			extensionsDir: params.extensionsDir,
			nameEncoder: params.nameEncoder
		});
		if (!targetDirResult.ok) return {
			ok: false,
			error: targetDirResult.error
		};
		targetDir = targetDirResult.targetDir;
	}
	const availability = await ensureInstallTargetAvailableForMode({
		runtime,
		targetPath: targetDir,
		mode: params.mode
	});
	if (!availability.ok) return availability;
	if (params.dryRun) return buildDirectoryInstallResult({
		pluginId: params.pluginId,
		targetDir,
		manifestName: params.manifestName,
		version: params.version,
		extensions: params.extensions,
		setup: params.setup
	});
	let artifactConsentFailure;
	const packageInstallParams = {
		sourceDir: params.sourceDir,
		targetDir,
		mode: params.mode,
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		copyErrorPrefix: params.copyErrorPrefix,
		hasDeps: params.hasDeps,
		sourceHardlinks: params.sourceHardlinks ?? "reject",
		depsLogMessage: params.depsLogMessage,
		afterCopy: params.afterCopy,
		afterInstall: async (installedDir) => {
			const postInstallResult = await params.afterInstall?.(installedDir);
			if (postInstallResult) return postInstallResult;
			try {
				await params.onBeforePluginArtifactCommit?.({
					pluginId: params.pluginId,
					...params.mode === "update" ? { currentArtifactDir: targetDir } : {},
					stagedArtifactDir: installedDir,
					mode: params.mode
				});
			} catch (error) {
				artifactConsentFailure = { error };
				throw error;
			}
			return { ok: true };
		}
	};
	const installRes = await runtime.installPackageDir(isPluginInstallCommitDeferred(params) ? requestDeferredPackageDirInstall(packageInstallParams) : packageInstallParams);
	if (!installRes.ok) {
		if (artifactConsentFailure) throw artifactConsentFailure.error;
		return installRes;
	}
	const result = { ...buildDirectoryInstallResult({
		pluginId: params.pluginId,
		targetDir,
		manifestName: params.manifestName,
		version: params.version,
		extensions: params.extensions,
		setup: params.setup
	}) };
	const transaction = resolvePackageDirInstallTransaction(installRes);
	return transaction ? attachPluginInstallTransaction(result, transaction) : result;
}
async function resolvePluginInstallTarget(params) {
	const extensionsDir = params.extensionsDir ? resolveUserPath(params.extensionsDir) : resolveDefaultPluginExtensionsDir();
	return await params.runtime.resolveCanonicalInstallTarget({
		baseDir: extensionsDir,
		id: params.pluginId,
		invalidNameMessage: "invalid plugin name: path traversal detected",
		boundaryLabel: "extensions directory",
		nameEncoder: params.nameEncoder
	});
}
async function resolveEffectiveInstallMode(params) {
	if (params.requestedMode !== "update") return "install";
	return await params.runtime.fileExists(params.targetPath) ? "update" : "install";
}
//#endregion
//#region src/plugins/install-managed-npm-state.ts
const rollbackSnapshotCopyMode = constants.COPYFILE_FICLONE;
const MANAGED_NPM_PROJECT_QUARANTINE_DIR = "_openclaw-quarantined-npm-projects";
const MANAGED_NPM_PROJECT_REBUILD_ARTIFACTS = [
	"node_modules",
	"package-lock.json",
	"npm-shrinkwrap.json"
];
function isNpmAliasOverrideCompatibilityError(result) {
	return `${result.stderr}\n${result.stdout}`.includes("Invalid comparator: npm:");
}
async function rollbackManagedNpmPluginInstall(params) {
	if (params.snapshot) {
		try {
			await restoreManagedNpmPluginInstallRollbackSnapshot({
				npmRoot: params.npmRoot,
				snapshot: params.snapshot
			});
			await relinkOpenClawPeerDependenciesInManagedNpmRoot({
				npmRoot: params.npmRoot,
				logger: params.logger
			});
		} catch (error) {
			params.logger.warn?.(`Failed to restore managed npm plugin root after installing ${params.packageName}: ${String(error)}`);
		}
		return;
	}
	try {
		await runCommandWithTimeout([
			"npm",
			"uninstall",
			"--loglevel=error",
			"--legacy-peer-deps",
			"--ignore-scripts",
			"--no-audit",
			"--no-fund",
			params.packageName
		], {
			cwd: params.npmRoot,
			timeoutMs: Math.max(params.timeoutMs, 3e5),
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: params.npmRoot,
				packageLock: true,
				quiet: true
			})
		});
	} catch (error) {
		params.logger.warn?.(`Failed to run npm uninstall rollback for ${params.packageName}: ${String(error)}`);
	}
	try {
		await fs$1.rm(params.targetDir, {
			recursive: true,
			force: true
		});
	} catch (error) {
		params.logger.warn?.(`Failed to remove failed plugin install directory ${params.targetDir}: ${String(error)}`);
	}
	try {
		await removeManagedNpmRootDependency({
			npmRoot: params.npmRoot,
			packageName: params.packageName
		});
	} catch (error) {
		params.logger.warn?.(`Failed to remove managed npm dependency ${params.packageName}: ${String(error)}`);
	}
	if (params.peerDependencySnapshot) try {
		const preRestorePeerDependencySnapshot = await readManagedNpmRootPeerDependencySnapshot({ npmRoot: params.npmRoot });
		const restoredPeerDependencyNames = new Set(params.peerDependencySnapshot.managedPeerDependencies);
		const addedPeerDependencyNames = preRestorePeerDependencySnapshot.managedPeerDependencies.filter((packageName) => !restoredPeerDependencyNames.has(packageName));
		await restoreManagedNpmRootPeerDependencySnapshot({
			npmRoot: params.npmRoot,
			snapshot: params.peerDependencySnapshot
		});
		const cleanupResult = await runCommandWithTimeout([
			"npm",
			"install",
			"--omit=dev",
			"--omit=peer",
			"--loglevel=error",
			"--legacy-peer-deps",
			"--ignore-scripts",
			"--no-audit",
			"--no-fund"
		], {
			cwd: params.npmRoot,
			timeoutMs: Math.max(params.timeoutMs, 3e5),
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: params.npmRoot,
				packageLock: true,
				quiet: true
			})
		});
		if (cleanupResult.code !== 0) {
			params.logger.warn?.(`npm install cleanup after rollback for ${params.packageName} exited ${cleanupResult.code}: ${cleanupResult.stderr.trim() || cleanupResult.stdout.trim()}`);
			await Promise.all(addedPeerDependencyNames.map(async (packageName) => {
				try {
					await fs$1.rm(resolveManagedNpmRootPackageDir(params.npmRoot, packageName), {
						recursive: true,
						force: true
					});
				} catch (error) {
					params.logger.warn?.(`Failed to remove rolled-back managed peer dependency ${packageName}: ${String(error)}`);
				}
			}));
		}
	} catch (error) {
		params.logger.warn?.(`Failed to restore managed npm peer dependencies after rollback for ${params.packageName}: ${String(error)}`);
	}
	if (params.packageName !== "openclaw") try {
		await repairManagedNpmRootOpenClawPeer({
			npmRoot: params.npmRoot,
			timeoutMs: params.timeoutMs,
			logger: params.logger
		});
	} catch (error) {
		params.logger.warn?.(`Failed to repair managed npm openclaw peer after rollback: ${String(error)}`);
	}
	try {
		await relinkOpenClawPeerDependenciesInManagedNpmRoot({
			npmRoot: params.npmRoot,
			logger: params.logger
		});
	} catch (error) {
		params.logger.warn?.(`Failed to repair managed npm peer links after rollback for ${params.packageName}: ${String(error)}`);
	}
}
async function resolveManagedNpmRootDependencySpecForInstall(params) {
	if (params.prepareDependencySpec) try {
		return await params.prepareDependencySpec({ npmRoot: params.npmRoot });
	} catch (error) {
		return {
			ok: false,
			error: `Failed to prepare managed npm dependency for ${params.packageName}: ${String(error)}`
		};
	}
	if (params.dependencySpec === void 0) return {
		ok: false,
		error: `missing managed npm dependency spec for ${params.packageName}`
	};
	return {
		ok: true,
		dependencySpec: params.dependencySpec
	};
}
async function rollbackManagedNpmRootPreparedDependency(params) {
	if (!params.preparedDependency.rollback) return;
	try {
		await params.preparedDependency.rollback();
	} catch (error) {
		params.logger.warn?.(`Failed to roll back prepared managed npm dependency artifacts for ${params.packageName}: ${String(error)}`);
	}
}
async function cleanupManagedNpmRootPreparedDependency(params) {
	if (!params.preparedDependency?.cleanup) return;
	try {
		await params.preparedDependency.cleanup();
	} catch (error) {
		params.logger.warn?.(`Failed to clean up prepared managed npm dependency artifacts for ${params.packageName}: ${String(error)}`);
	}
}
async function removeEmptyDirectoryIfPresent(dir) {
	try {
		await fs$1.rmdir(dir);
	} catch (error) {
		if (![
			"ENOENT",
			"ENOTEMPTY",
			"EEXIST"
		].includes(error.code ?? "")) throw error;
	}
}
async function readRollbackFileIfPresent(filePath) {
	try {
		return await fs$1.readFile(filePath, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
async function writeOrRemoveRollbackFile(filePath, contents) {
	if (contents === void 0) {
		await fs$1.rm(filePath, { force: true });
		return;
	}
	await fs$1.mkdir(path.dirname(filePath), { recursive: true });
	await fs$1.writeFile(filePath, contents, "utf8");
}
async function createManagedNpmPluginInstallRollbackSnapshot(params) {
	const tempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-plugin-rollback-"));
	let nodeModulesBackupDir;
	const nodeModulesDir = path.join(params.npmRoot, "node_modules");
	try {
		await fs$1.stat(nodeModulesDir);
		nodeModulesBackupDir = path.join(tempDir, "node_modules");
		await fs$1.cp(nodeModulesDir, nodeModulesBackupDir, {
			recursive: true,
			force: true,
			filter: (sourcePath) => shouldCopyManagedNpmRollbackSnapshotEntry({
				nodeModulesDir,
				sourcePath
			}),
			mode: rollbackSnapshotCopyMode,
			verbatimSymlinks: true
		});
	} catch (error) {
		if (error.code !== "ENOENT") {
			await fs$1.rm(tempDir, {
				recursive: true,
				force: true
			});
			throw error;
		}
	}
	try {
		return {
			packageJson: await readRollbackFileIfPresent(path.join(params.npmRoot, "package.json")),
			packageLockJson: await readRollbackFileIfPresent(path.join(params.npmRoot, "package-lock.json")),
			...nodeModulesBackupDir ? { nodeModulesBackupDir } : {},
			tempDir
		};
	} catch (error) {
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
async function shouldCopyManagedNpmRollbackSnapshotEntry(params) {
	if (typeof params.sourcePath !== "string") return true;
	const relativeParts = path.relative(params.nodeModulesDir, params.sourcePath).split(path.sep);
	if (!(relativeParts.length === 3 && relativeParts[1] === "node_modules" && relativeParts[2] === "openclaw" || relativeParts.length === 4 && relativeParts[0]?.startsWith("@") && relativeParts[2] === "node_modules" && relativeParts[3] === "openclaw")) return true;
	try {
		return !(await fs$1.lstat(params.sourcePath)).isSymbolicLink();
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
async function restoreManagedNpmPluginInstallRollbackSnapshot(params) {
	const nodeModulesDir = path.join(params.npmRoot, "node_modules");
	await fs$1.rm(nodeModulesDir, {
		recursive: true,
		force: true
	});
	if (params.snapshot.nodeModulesBackupDir) {
		await fs$1.mkdir(params.npmRoot, { recursive: true });
		await fs$1.cp(params.snapshot.nodeModulesBackupDir, nodeModulesDir, {
			recursive: true,
			force: true,
			mode: rollbackSnapshotCopyMode,
			verbatimSymlinks: true
		});
	}
	await writeOrRemoveRollbackFile(path.join(params.npmRoot, "package.json"), params.snapshot.packageJson);
	await writeOrRemoveRollbackFile(path.join(params.npmRoot, "package-lock.json"), params.snapshot.packageLockJson);
}
async function cleanupManagedNpmPluginInstallRollbackSnapshot(params) {
	if (!params.snapshot) return;
	try {
		await fs$1.rm(params.snapshot.tempDir, {
			recursive: true,
			force: true
		});
	} catch (error) {
		params.logger.warn?.(`Failed to remove temporary managed npm rollback snapshot ${params.snapshot.tempDir}: ${String(error)}`);
	}
}
function formatNpmCommandFailureOutput(result) {
	const detail = result.stderr.trim() || result.stdout.trim();
	if (detail) return detail;
	if (result.code !== null) return `exit code ${result.code} (no output from npm)`;
	if (result.signal) return `signal ${result.signal} (no output from npm)`;
	return `termination ${result.termination} (no output from npm)`;
}
function isManagedNpmProjectCorruptionInstallFailure(result) {
	const output = `${result.stderr}\n${result.stdout}`;
	return output.includes("ERR_INVALID_ARG_TYPE") && output.includes("\"from\" argument") && output.includes("Received undefined");
}
function formatManagedNpmProjectQuarantineArtifacts(artifactNames) {
	return artifactNames.length > 0 ? artifactNames.join(", ") : "no rebuild artifacts";
}
async function quarantineManagedNpmProjectRebuildArtifacts(params) {
	await fs$1.mkdir(params.npmRoot, { recursive: true });
	const quarantineParent = path.join(params.npmRoot, MANAGED_NPM_PROJECT_QUARANTINE_DIR);
	await fs$1.mkdir(quarantineParent, { recursive: true });
	const quarantineDir = await fs$1.mkdtemp(path.join(quarantineParent, "corrupt-"));
	const movedArtifactNames = [];
	for (const artifactName of MANAGED_NPM_PROJECT_REBUILD_ARTIFACTS) {
		const source = path.join(params.npmRoot, artifactName);
		try {
			await fs$1.rename(source, path.join(quarantineDir, artifactName));
			movedArtifactNames.push(artifactName);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
	}
	return {
		quarantineDir,
		movedArtifactNames
	};
}
async function listManagedNpmRootPackageNames(npmRoot) {
	const nodeModulesDir = path.join(npmRoot, "node_modules");
	let entries;
	try {
		entries = await fs$1.readdir(nodeModulesDir, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return /* @__PURE__ */ new Set();
		throw error;
	}
	const packageNames = /* @__PURE__ */ new Set();
	for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
		if (entry.name === ".bin" || entry.name === "openclaw") continue;
		if (entry.name.startsWith("@")) {
			const scopeDir = path.join(nodeModulesDir, entry.name);
			let scopedEntries;
			try {
				scopedEntries = await fs$1.readdir(scopeDir, { withFileTypes: true });
			} catch (error) {
				if (error.code === "ENOENT") continue;
				throw error;
			}
			for (const scopedEntry of scopedEntries.toSorted((left, right) => left.name.localeCompare(right.name))) if (scopedEntry.isDirectory() || scopedEntry.isSymbolicLink()) packageNames.add(`${entry.name}/${scopedEntry.name}`);
			continue;
		}
		if (entry.isDirectory() || entry.isSymbolicLink()) packageNames.add(entry.name);
	}
	return packageNames;
}
function resolveManagedNpmRootPackageDir(npmRoot, packageName) {
	return path.join(npmRoot, "node_modules", ...packageName.split("/"));
}
function resolveManagedNpmRootGenerationKey(params) {
	return [
		params.npmResolution.name ?? params.packageName,
		params.npmResolution.version ?? "",
		params.npmResolution.resolvedSpec ?? "",
		params.npmResolution.integrity ?? "",
		params.npmResolution.shasum ?? ""
	].join("\n");
}
function resolveManagedNpmRootForInstall(params) {
	if (!params.useGeneration) return resolvePluginNpmProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName
	});
	return resolvePluginNpmGenerationProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName,
		generationKey: resolveManagedNpmRootGenerationKey({
			packageName: params.packageName,
			npmResolution: params.npmResolution
		})
	});
}
function resolveManagedNpmInstallRoot(params) {
	const generationKey = resolveManagedNpmRootGenerationKey({
		packageName: params.packageName,
		npmResolution: params.npmResolution
	});
	const npmRoot = resolveManagedNpmRootForInstall(params);
	if (!hasRetainedManagedNpmInstallMarker(resolveManagedNpmRootPackageDir(npmRoot, params.packageName))) return npmRoot;
	return resolvePluginNpmGenerationProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName,
		generationKey: `${generationKey}\nactivation\n${randomUUID()}`
	});
}
async function listManagedNpmPackageDirsForPackage(params) {
	const packageDirs = [];
	const legacyProjectRoot = resolvePluginNpmProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName
	});
	const legacyPackageDir = resolveManagedNpmRootPackageDir(legacyProjectRoot, params.packageName);
	if (await params.runtime.fileExists(legacyPackageDir)) packageDirs.push(legacyPackageDir);
	const projectsDir = path.dirname(legacyProjectRoot);
	const generationPrefix = resolvePluginNpmGenerationProjectDirPrefix(params.packageName);
	let entries;
	try {
		entries = await fs$1.readdir(projectsDir, { withFileTypes: true });
	} catch (error) {
		if (isNotFoundPathError(error)) return packageDirs;
		throw error;
	}
	for (const entry of entries) {
		if (!entry.isDirectory() || !entry.name.startsWith(generationPrefix)) continue;
		const packageDir = resolveManagedNpmRootPackageDir(path.join(projectsDir, entry.name), params.packageName);
		if (await params.runtime.fileExists(packageDir)) packageDirs.push(packageDir);
	}
	return packageDirs;
}
async function resolveManagedNpmGenerationUseForInstall(params) {
	const packageDirs = await listManagedNpmPackageDirsForPackage({
		runtime: params.runtime,
		npmBaseDir: params.npmBaseDir,
		packageName: params.packageName
	});
	const hasNonRetainedPackageDir = packageDirs.some((packageDir) => !hasRetainedManagedNpmInstallMarker(packageDir));
	if (packageDirs.length > 0 && !hasNonRetainedPackageDir) return "retained-install";
	const generationUse = params.requestedMode === "update" && hasNonRetainedPackageDir ? "update" : "none";
	if (params.npmResolution) {
		if (hasRetainedManagedNpmInstallMarker(resolveManagedNpmRootPackageDir(resolveManagedNpmRootForInstall({
			npmBaseDir: params.npmBaseDir,
			packageName: params.packageName,
			npmResolution: params.npmResolution,
			useGeneration: generationUse !== "none"
		}), params.packageName))) return "retained-install";
	}
	if (params.requestedMode === "update") return hasNonRetainedPackageDir ? "update" : "none";
	return "none";
}
function resolveRequiredPlatformPackageNames(packageMetadata) {
	const raw = packageMetadata?.install?.requiredPlatformPackages;
	if (raw === void 0) return {
		ok: true,
		packageNames: []
	};
	if (!Array.isArray(raw)) return {
		ok: false,
		error: "package.json openclaw.install.requiredPlatformPackages must be an array"
	};
	const packageNames = /* @__PURE__ */ new Set();
	for (const value of raw) {
		if (typeof value !== "string") return {
			ok: false,
			error: "package.json openclaw.install.requiredPlatformPackages must contain only npm package names"
		};
		const specError = validateRegistryNpmSpec(value);
		const parsed = parseRegistryNpmSpec(value);
		if (specError || !parsed || parsed.selectorKind !== "none") return {
			ok: false,
			error: `package.json openclaw.install.requiredPlatformPackages contains invalid package name: ${value}`
		};
		packageNames.add(parsed.name);
	}
	return {
		ok: true,
		packageNames: [...packageNames]
	};
}
async function listNewManagedNpmRootPackageDirs(params) {
	return [...await listManagedNpmRootPackageNames(params.npmRoot)].filter((packageName) => !params.beforeInstallPackageNames.has(packageName)).map((packageName) => resolveManagedNpmRootPackageDir(params.npmRoot, packageName)).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { readOpenClawManagedNpmRootOverrides as $, resolveEffectiveInstallMode as A, isUnavailableNpmTarget as B, ensureInstallTargetAvailableForMode as C, installPluginDirectoryIntoExtensions as D, hasPackageRuntimeDependencies as E, validateOpenClawPackageInstallCompatibility as F, requestDeferredPluginInstall as G, attachPluginInstallTransaction as H, emitPluginAuditSecurityEvent as I, resolvePluginInstallTransactionSink as J, resolvePluginInstallOwnerMigrations as K, emitPluginInstallSecurityEvent as L, runInstallSourceScan as M, sourceFamilyForInstallPolicyKind as N, loadPluginInstallRuntime as O, sourceFamilyForInstallPolicySource as P, readManagedNpmRootPeerDependencySnapshot as Q, pluginAuditOutcomeForReason as R, emitSuccessfulPluginInstallSecurityEvent as S, formatUnresolvedOpenClawPeerLinkError as T, copyPluginInstallTransactionRequest as U, attachPluginInstallOwnerMigrations as V, isPluginInstallCommitDeferred as W, listMissingRequiredPlatformPackages as X, settlePluginInstallTransactions as Y, readManagedNpmRootInstalledDependency as Z, resolveRequiredPlatformPackageNames as _, formatNpmCommandFailureOutput as a, buildDirectoryInstallResult as b, listManagedNpmRootPackageNames as c, removeEmptyDirectoryIfPresent as d, repairManagedNpmRootOpenClawPeer as et, resolveManagedNpmGenerationUseForInstall as f, resolveManagedNpmRootPackageDir as g, resolveManagedNpmRootForInstall as h, formatManagedNpmProjectQuarantineArtifacts as i, resolvePreparedDirectoryInstallTarget as j, readOptionalPackageManifest as k, listNewManagedNpmRootPackageDirs as l, resolveManagedNpmRootDependencySpecForInstall as m, cleanupManagedNpmRootPreparedDependency as n, syncManagedNpmRootPeerDependencies as nt, isManagedNpmProjectCorruptionInstallFailure as o, resolveManagedNpmInstallRoot as p, resolvePluginInstallTransaction as q, createManagedNpmPluginInstallRollbackSnapshot as r, upsertManagedNpmRootDependency as rt, isNpmAliasOverrideCompatibilityError as s, cleanupManagedNpmPluginInstallRollbackSnapshot as t, resolveManagedNpmRootDependencySpec as tt, quarantineManagedNpmProjectRebuildArtifacts as u, rollbackManagedNpmPluginInstall as v, ensureOpenClawExtensions as w, defaultLogger as x, rollbackManagedNpmRootPreparedDependency as y, PLUGIN_INSTALL_ERROR_CODE as z };
