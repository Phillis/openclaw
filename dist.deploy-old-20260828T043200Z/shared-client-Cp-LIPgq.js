import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as toStringifiedError, t as coerceErrorMessage } from "./error-coercion-CKFmnpjH.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { F as resolveTimerTimeoutMs, a as addTimerTimeoutGraceMs } from "./number-coercion-CLj0HTDM.js";
import { c as assertNoSymlinkParents } from "./regular-file-Dwz6p59y.js";
import { r as withTimeout$1 } from "./timing-8WD1In27.js";
import { t as readSecretFile } from "./secret-read-async-BvGQeoUz.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { h as resolveDefaultAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-Csz_STEP.js";
import { n as runExec } from "./exec-D2kbpwdA.js";
import { r as hasUsableOAuthCredential } from "./credential-state-DJrnG0Ay.js";
import { i as resolveAuthProfileOrder } from "./order-C7dw_-HZ.js";
import { f as loadAuthProfileStoreForSecretsRuntime, h as resolvePersistedAuthProfileOwnerAgentDir, o as findPersistedAuthProfileCredential, r as ensureAuthProfileStore } from "./store-C0UG5FOx.js";
import { n as resolveApiKeyForProfile, t as refreshOAuthCredentialForRuntime } from "./oauth-CtYm__qO.js";
import { h as AgentHarnessPreflightError } from "./failover-error-DVBvcQuA.js";
import { t as log } from "./logger-ZAfp-Df-.js";
import { m as resolveOpenAICodexAuthIdentity } from "./provider-auth-DI4TAoBi.js";
import "./error-runtime-CmA1H4Zg.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./secret-file-D0-UDab9.js";
import "./agent-runtime-BKn3ysXa.js";
import "./security-runtime-CYUTzVOk.js";
import "./agent-harness-runtime-DIZXsF4g.js";
import "./process-runtime-B-C-YQA7.js";
import { a as createDeferred } from "./extension-shared-BO-DUGkx.js";
import "./text-utility-runtime-BNhX-3os.js";
import { S as resolveCodexAppServerUserHomeDir, a as resolveCodexAppServerStartOptionsForAgent, i as resolveCodexAppServerRuntimeOptions, o as resolveCodexComputerUseConfig, t as codexAppServerStartOptionsKey } from "./config-DPdRNnmw.js";
import { a as CODEX_APP_SERVER_VERSION, c as resolveMacOSDesktopCodexAppPathCandidates, l as resolveMacOSDesktopCodexBundledMarketplaceCandidates, n as resolveManagedCodexAppServerStartOptions, o as MIN_SUPPORTED_CODEX_APP_SERVER_VERSION, r as resolveManagedCodexNativeCommand, s as resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath, t as isManagedCodexDesktopCommand, u as resolveMacOSDesktopCodexComputerUseServiceAppCandidates } from "./managed-binary-CMUbtKyF.js";
import { l as isCodexAppServerNativeAuthProfile } from "./session-binding-Dpje0hJR.js";
import { n as resolveCodexAppServerSpawnEnv, t as createStdioTransport } from "./transport-stdio-DnrtWA2n.js";
import { n as closeCodexAppServerTransportAndWait, t as closeCodexAppServerTransport } from "./transport-CnoEiSyV.js";
import fs, { constants, existsSync, watch } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import net from "node:net";
import { StringDecoder } from "node:string_decoder";
import { parse as parse$1 } from "semver";
import { PassThrough, Writable } from "node:stream";
import { EventEmitter } from "node:events";
import WebSocket$1 from "ws";
import { createInterface } from "node:readline";
//#region extensions/codex/src/app-server/auth-start-options.ts
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
const CODEX_EPHEMERAL_AUTH_STORE_OVERRIDE = "cli_auth_credentials_store=\"ephemeral\"";
function resolveCodexAppServerHomeDir(agentDir) {
	return path.join(path.resolve(agentDir), CODEX_APP_SERVER_HOME_DIRNAME);
}
/** Resolves the local CODEX_HOME used when starting one app-server connection. */
function resolveCodexAppServerLocalHomeDir(startOptions, agentDir, env = process.env) {
	const configured = startOptions.env?.CODEX_HOME;
	if (configured?.trim()) return configured;
	return startOptions.homeScope === "user" ? resolveCodexAppServerUserHomeDir(env) : resolveCodexAppServerHomeDir(agentDir);
}
/** Forces OpenClaw-owned Codex auth to remain process-local. */
function withEphemeralCodexAuthStore(params) {
	const { startOptions } = params;
	if (!(startOptions.commandSource === "managed" || startOptions.commandSource === "resolved-managed") || !params.preparedAuth && params.authProfileId === null) return startOptions;
	if (startOptions.args.at(-2) === "-c" && startOptions.args.at(-1) === CODEX_EPHEMERAL_AUTH_STORE_OVERRIDE) return startOptions;
	return {
		...startOptions,
		args: [
			...startOptions.args,
			"-c",
			CODEX_EPHEMERAL_AUTH_STORE_OVERRIDE
		]
	};
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-service-path.ts
/** Filesystem ownership guards for isolated Computer Use service provisioning. */
async function assertOwnedServicePath(params) {
	await assertOwnedCodexHomePath({
		ownershipRoot: params.ownershipRoot,
		codexHome: params.codexHome,
		allowMissing: true
	});
	assertPathAtOrInside(params.ownershipRoot, params.targetParent, "Computer Use service parent");
	await assertNoSymlinkParents({
		rootDir: params.ownershipRoot,
		targetPath: params.targetParent,
		allowMissing: true,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
	await assertNotSymlink(params.targetPath, "Computer Use service target");
}
async function ensureOwnedCodexHome(codexHomeInput, ownershipRootInput = path.dirname(path.resolve(codexHomeInput))) {
	const codexHome = path.resolve(codexHomeInput);
	const ownershipRoot = path.resolve(ownershipRootInput);
	await fs$1.mkdir(ownershipRoot, {
		recursive: true,
		mode: 448
	});
	await assertOwnedCodexHomePath({
		ownershipRoot,
		codexHome,
		allowMissing: true
	});
	await ensureRealDirectoryTree(ownershipRoot, codexHome, "isolated Codex home");
	await assertOwnedCodexHomePath({
		ownershipRoot,
		codexHome,
		allowMissing: false
	});
}
async function prepareOwnedServiceParent(params) {
	await ensureOwnedCodexHome(params.codexHome, params.ownershipRoot);
	await ensureRealDirectoryTree(params.ownershipRoot, params.targetParent, "Computer Use service parent");
	await assertNoSymlinkParents({
		rootDir: params.ownershipRoot,
		targetPath: params.targetParent,
		allowMissing: false,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
	const [rootIdentity, parentIdentity] = await Promise.all([readRealDirectoryIdentity(params.ownershipRoot, "Computer Use ownership root"), readRealDirectoryIdentity(params.targetParent, "Computer Use service parent")]);
	assertPathAtOrInside(rootIdentity.realPath, parentIdentity.realPath, "canonical Computer Use service parent");
	return parentIdentity;
}
async function assertOwnedCodexHomePath(params) {
	await readRealDirectoryIdentity(params.ownershipRoot, "Computer Use ownership root");
	assertPathAtOrInside(params.ownershipRoot, params.codexHome, "isolated Codex home");
	await assertNoSymlinkParents({
		rootDir: params.ownershipRoot,
		targetPath: params.codexHome,
		allowMissing: params.allowMissing,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
}
async function readRealDirectoryIdentity(directoryPath, label) {
	const logicalPath = path.resolve(directoryPath);
	const before = await fs$1.lstat(logicalPath);
	if (before.isSymbolicLink() || !before.isDirectory()) throw new Error(`${label} must be a real directory: ${logicalPath}`);
	const realPath = await fs$1.realpath(logicalPath);
	const [after, resolved] = await Promise.all([fs$1.lstat(logicalPath), fs$1.lstat(realPath)]);
	if (after.isSymbolicLink() || !after.isDirectory() || !resolved.isDirectory() || before.dev !== after.dev || before.ino !== after.ino || after.dev !== resolved.dev || after.ino !== resolved.ino) throw new Error(`${label} changed while its ownership boundary was being established.`);
	return {
		logicalPath,
		realPath,
		dev: after.dev,
		ino: after.ino
	};
}
async function assertOwnedServiceParentStable(parent) {
	await assertDirectoryIdentityStable(parent, "Computer Use service parent");
}
async function assertDirectoryIdentityStable(expected, label) {
	if (!await directoryIdentityIsStable(expected)) throw new Error(`${label} changed during refresh; refusing to mutate the replacement path.`);
}
async function ownedServiceParentIsStable(parent) {
	return await directoryIdentityIsStable(parent);
}
async function directoryIdentityIsStable(expected) {
	try {
		const current = await fs$1.lstat(expected.logicalPath);
		if (current.isSymbolicLink() || !current.isDirectory() || current.dev !== expected.dev || current.ino !== expected.ino) return false;
		return await fs$1.realpath(expected.logicalPath) === expected.realPath;
	} catch {
		return false;
	}
}
async function assertNotSymlink(filePath, label) {
	try {
		if ((await fs$1.lstat(filePath)).isSymbolicLink()) throw new Error(`${label} must not be a symbolic link: ${filePath}`);
	} catch (error) {
		if (hasNodeErrorCode$1(error, "ENOENT")) return;
		throw error;
	}
}
async function ensureRealDirectoryTree(ownershipRoot, directoryPath, label) {
	const root = path.resolve(ownershipRoot);
	const target = path.resolve(directoryPath);
	assertPathAtOrInside(root, target, label);
	const relative = path.relative(root, target);
	let current = root;
	for (const segment of relative.split(path.sep).filter(Boolean)) {
		current = path.join(current, segment);
		const existing = await fs$1.lstat(current).catch((error) => {
			if (hasNodeErrorCode$1(error, "ENOENT")) return;
			throw error;
		});
		if (!existing) {
			try {
				await fs$1.mkdir(current, { mode: 448 });
			} catch (error) {
				if (!hasNodeErrorCode$1(error, "EEXIST")) throw error;
			}
			const created = await fs$1.lstat(current);
			if (created.isSymbolicLink() || !created.isDirectory()) throw new Error(`${label} changed while its directory tree was being created: ${current}`);
		} else if (existing.isSymbolicLink() || !existing.isDirectory()) throw new Error(`${label} must traverse real directories: ${current}`);
	}
	await assertNoSymlinkParents({
		rootDir: root,
		targetPath: target,
		allowMissing: false,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
	await readRealDirectoryIdentity(target, label);
}
function assertPathAtOrInside(rootPath, candidatePath, label) {
	const relative = path.relative(path.resolve(rootPath), path.resolve(candidatePath));
	if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error(`${label} must remain inside ${path.resolve(rootPath)}.`);
}
function hasNodeErrorCode$1(error, code) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-cache.ts
/** Shared Computer Use plugin cache reconciliation for isolated Codex homes. */
const DEFAULT_CODEX_COMPUTER_USE_BUNDLED_MARKETPLACE_PATH = resolveMacOSDesktopCodexBundledMarketplaceCandidates("darwin")[0] ?? "";
const DEFAULT_BUNDLED_MARKETPLACE_NAME = "openai-bundled";
async function ensureCodexComputerUseSharedPluginCache(params) {
	if (!params.config.enabled) return skippedCacheResult("disabled", "Computer Use cache sharing skipped because it is disabled.");
	if (params.config.pluginCacheMode === "independent") return skippedCacheResult("independent", "Computer Use cache sharing skipped because pluginCacheMode is independent.");
	if (params.config.marketplaceName || params.config.marketplacePath) return skippedCacheResult("explicit_marketplace", "Computer Use cache sharing skipped because an explicit marketplace is configured.");
	const bundledMarketplacePath = resolveComputerUseBundledMarketplacePath(params);
	const sourcePluginRoot = path.join(bundledMarketplacePath, "plugins", params.config.pluginName);
	const version = await readBundledPluginVersion(sourcePluginRoot);
	if (!version) return skippedCacheResult("source_missing", `Computer Use bundled plugin source was not found at ${sourcePluginRoot}.`);
	const marketplaceName = params.config.marketplaceName ?? DEFAULT_BUNDLED_MARKETPLACE_NAME;
	const cacheRoot = path.join(params.codexHome, "plugins", "cache", marketplaceName, params.config.pluginName);
	const cachePath = path.join(cacheRoot, version);
	return {
		status: "shared",
		changed: await ensureRealDirectoryCopy(cachePath, sourcePluginRoot, version, {
			codexHome: params.codexHome,
			ownershipRoot: params.ownershipRoot,
			assertCurrent: params.assertCurrent,
			forceRefresh: params.forceRefresh
		}),
		cachePath,
		targetPath: sourcePluginRoot,
		version,
		removedStaleVersions: [],
		warnings: [],
		message: `Computer Use plugin cache ${cachePath} contains bundled plugin ${sourcePluginRoot}.`
	};
}
function resolveComputerUseBundledMarketplacePath(params) {
	return params.bundledMarketplacePath ?? resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath({ candidates: params.bundledMarketplacePathCandidates }) ?? params.bundledMarketplacePathCandidates?.[0] ?? DEFAULT_CODEX_COMPUTER_USE_BUNDLED_MARKETPLACE_PATH;
}
async function readBundledPluginVersion(sourcePluginRoot) {
	const pluginJsonPath = path.join(sourcePluginRoot, ".codex-plugin", "plugin.json");
	let raw;
	try {
		raw = await fs$1.readFile(pluginJsonPath, "utf8");
	} catch {
		return;
	}
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed.version === "string" && parsed.version.trim() ? parsed.version.trim() : void 0;
	} catch {
		return;
	}
}
async function ensureRealDirectoryCopy(cachePath, sourcePluginRoot, version, boundary) {
	const cacheRoot = path.dirname(cachePath);
	const ownedParent = boundary.ownershipRoot ? await prepareOwnedServiceParent({
		ownershipRoot: boundary.ownershipRoot,
		codexHome: boundary.codexHome,
		targetParent: cacheRoot
	}) : void 0;
	if (!ownedParent) await fs$1.mkdir(cacheRoot, { recursive: true });
	const physicalCachePath = ownedParent ? path.join(ownedParent.realPath, path.basename(cachePath)) : cachePath;
	const stat = await fs$1.lstat(physicalCachePath).catch(() => void 0);
	if (stat?.isDirectory() && !stat.isSymbolicLink()) {
		if (await readBundledPluginVersion(physicalCachePath) === version && !boundary.forceRefresh) return false;
	}
	const cacheName = path.basename(cachePath);
	const physicalCacheRoot = path.dirname(physicalCachePath);
	const stagingRoot = await fs$1.mkdtemp(path.join(physicalCacheRoot, `.${cacheName}.staging-`));
	const stagedPath = path.join(stagingRoot, cacheName);
	const backupPath = path.join(physicalCacheRoot, `.${cacheName}.backup-${process.pid}-${Date.now()}`);
	let backupCreated = false;
	try {
		await fs$1.cp(sourcePluginRoot, stagedPath, { recursive: true });
		if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
		if (stat) {
			boundary.assertCurrent?.();
			await fs$1.rename(physicalCachePath, backupPath);
			backupCreated = true;
		}
		try {
			if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
			boundary.assertCurrent?.();
			await fs$1.rename(stagedPath, physicalCachePath);
		} catch (error) {
			if (backupCreated) try {
				if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
				await fs$1.rename(backupPath, physicalCachePath);
				backupCreated = false;
			} catch (restoreError) {
				throw new Error(`Failed to install Computer Use cache ${cachePath} and restore its prior copy: ${String(error)}`, { cause: restoreError });
			}
			throw error;
		}
		if (backupCreated) {
			if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
			await fs$1.rm(backupPath, {
				recursive: true,
				force: true
			});
		}
		return true;
	} finally {
		if (!ownedParent || await directoryIdentityIsStable(ownedParent)) await fs$1.rm(stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
function skippedCacheResult(status, message) {
	return {
		status,
		changed: false,
		message,
		removedStaleVersions: [],
		warnings: status === "source_missing" ? [message] : []
	};
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-marketplace.ts
/** Managed local wrapper for Codex's reserved bundled marketplace. */
const MARKETPLACE_NAME = "openai-bundled";
const activeInstalls$1 = /* @__PURE__ */ new Map();
function resolveCodexManagedBundledMarketplacePath(codexHome) {
	return path.join(codexHome, ".tmp", "bundled-marketplaces", MARKETPLACE_NAME);
}
async function ensureCodexManagedBundledMarketplace(params) {
	const candidates = params.candidates ?? resolveMacOSDesktopCodexAppPathCandidates();
	const source = await resolveCodexManagedBundledMarketplaceSource({
		...params,
		candidates
	});
	if (!source) return;
	const parentPath = path.dirname(resolveCodexManagedBundledMarketplacePath(params.codexHome));
	const targetPath = path.join(parentPath, MARKETPLACE_NAME);
	const parent = await prepareOwnedServiceParent({
		ownershipRoot: params.ownershipRoot,
		codexHome: params.codexHome,
		targetParent: parentPath
	});
	const physicalTargetPath = path.join(parent.realPath, MARKETPLACE_NAME);
	await assertNotSymlink(physicalTargetPath, "managed bundled marketplace");
	const active = activeInstalls$1.get(physicalTargetPath);
	if (active) {
		if (active.sourcePath === source.bundledMarketplacePath) return await active.promise;
		await active.promise.catch(() => void 0);
		return await ensureCodexManagedBundledMarketplace(params);
	}
	const install = reconcileManagedWrapper({
		parent,
		physicalTargetPath,
		targetPath,
		source,
		ownershipCandidates: params.ownershipCandidates ?? candidates,
		assertCurrent: params.assertCurrent
	});
	const activeEntry = {
		sourcePath: source.bundledMarketplacePath,
		promise: install
	};
	activeInstalls$1.set(physicalTargetPath, activeEntry);
	const clearActive = () => {
		if (activeInstalls$1.get(physicalTargetPath) === activeEntry) activeInstalls$1.delete(physicalTargetPath);
	};
	install.then(clearActive, clearActive);
	return await install;
}
async function reconcileManagedWrapper(params) {
	if (await wrapperMatches(params.physicalTargetPath, params.source.bundledMarketplacePath)) return params.targetPath;
	return await publishManagedWrapper(params);
}
async function publishManagedWrapper(params) {
	const { parent, physicalTargetPath, targetPath, source, ownershipCandidates, assertCurrent } = params;
	const stagingPath = await fs$1.mkdtemp(path.join(parent.realPath, `.${MARKETPLACE_NAME}.staging-`));
	const backupPath = path.join(parent.realPath, `.${MARKETPLACE_NAME}.backup-${process.pid}-${Date.now()}`);
	let backupCreated = false;
	try {
		const manifestParent = path.join(stagingPath, ".agents", "plugins");
		await fs$1.mkdir(manifestParent, {
			recursive: true,
			mode: 448
		});
		await Promise.all([fs$1.symlink(path.join(source.bundledMarketplacePath, ".agents", "plugins", "marketplace.json"), path.join(manifestParent, "marketplace.json")), fs$1.symlink(path.join(source.bundledMarketplacePath, "plugins"), path.join(stagingPath, "plugins"))]);
		await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
		const existing = await fs$1.lstat(physicalTargetPath).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (existing && !existing.isDirectory()) throw new Error(`Managed bundled marketplace must be a real directory: ${targetPath}`);
		if (existing && !await wrapperMatchesAnySource(physicalTargetPath, ownershipCandidates)) throw new Error(`Refusing to replace an unowned bundled marketplace directory: ${targetPath}`);
		if (existing) {
			assertCurrent?.();
			await fs$1.rename(physicalTargetPath, backupPath);
			backupCreated = true;
			await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
		}
		assertCurrent?.();
		await fs$1.rename(stagingPath, physicalTargetPath);
		await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
		if (backupCreated) {
			await fs$1.rm(backupPath, { recursive: true });
			backupCreated = false;
		}
		return targetPath;
	} catch (error) {
		if (backupCreated) try {
			await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
			if (await fs$1.lstat(physicalTargetPath).catch(() => void 0)) {
				if (!await wrapperMatches(physicalTargetPath, source.bundledMarketplacePath)) throw new Error("managed bundled marketplace replacement is no longer owned", { cause: error });
				await fs$1.rm(physicalTargetPath, { recursive: true });
			}
			await fs$1.rename(backupPath, physicalTargetPath);
			backupCreated = false;
		} catch (restoreError) {
			throw new Error(`Failed to restore the prior managed bundled marketplace: ${String(error)}`, { cause: restoreError });
		}
		throw error;
	} finally {
		if (await directoryIdentityIsStable(parent)) await fs$1.rm(stagingPath, {
			recursive: true,
			force: true
		});
	}
}
async function resolveCodexManagedBundledMarketplaceSource(params) {
	const candidates = params.candidates ?? resolveMacOSDesktopCodexAppPathCandidates();
	const command = params.appServerCommand && path.resolve(params.appServerCommand);
	const ordered = command ? candidates.filter((candidate) => path.resolve(candidate.appServerCommandPath) === command) : candidates;
	for (const candidate of ordered) if (await isExpectedMarketplace(candidate.bundledMarketplacePath)) return candidate;
}
async function isExpectedMarketplace(root) {
	try {
		const manifest = JSON.parse(await fs$1.readFile(path.join(root, ".agents", "plugins", "marketplace.json"), "utf8"));
		await fs$1.access(path.join(root, "plugins", "computer-use", ".codex-plugin", "plugin.json"));
		return isRecord(manifest) && manifest.name === MARKETPLACE_NAME && Array.isArray(manifest.plugins) && manifest.plugins.some((plugin) => isRecord(plugin) && plugin.name === "computer-use");
	} catch {
		return false;
	}
}
async function wrapperMatches(targetPath, sourcePath) {
	try {
		const target = await fs$1.lstat(targetPath);
		if (!target.isDirectory() || target.isSymbolicLink()) return false;
		const [manifest, plugins] = await Promise.all([fs$1.readlink(path.join(targetPath, ".agents", "plugins", "marketplace.json")), fs$1.readlink(path.join(targetPath, "plugins"))]);
		return manifest === path.join(sourcePath, ".agents", "plugins", "marketplace.json") && plugins === path.join(sourcePath, "plugins");
	} catch {
		return false;
	}
}
async function wrapperMatchesAnySource(targetPath, candidates) {
	for (const candidate of candidates) if (await wrapperMatches(targetPath, candidate.bundledMarketplacePath)) return true;
	return false;
}
function hasNodeErrorCode(error, code) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-service.ts
/** Native Computer Use service provisioning for isolated Codex homes. */
const SERVICE_APP_NAME = "Codex Computer Use.app";
const SERVICE_BUNDLE_ID = "com.openai.sky.CUAService";
const CLIENT_BUNDLE_ID = "com.openai.sky.CUAService.cli";
const OPENAI_TEAM_ID = "2DC432GLL2";
const CLIENT_APP_RELATIVE_PATH = path.join("Contents", "SharedSupport", "SkyComputerUseClient.app");
const CLIENT_RELATIVE_PATH = path.join(CLIENT_APP_RELATIVE_PATH, "Contents", "MacOS", "SkyComputerUseClient");
const COPY_TIMEOUT_MS = 12e4;
const INSPECT_TIMEOUT_MS = 3e4;
const activeInstalls = /* @__PURE__ */ new Map();
/** Finds the first signed native service from one ordered desktop owner set. */
async function resolveCodexComputerUseServiceAppSourcePath(params) {
	const platform = params.platform ?? process.platform;
	if (platform !== "darwin") return;
	return (await findUsableServiceApp(params.sourceAppCandidates ?? resolveMacOSDesktopCodexComputerUseServiceAppCandidates(platform, params.appServerCommand), params.inspectServiceApp ?? inspectTrustedServiceApp))?.path;
}
/** Synchronizes the CODEX_HOME native client with the selected signed desktop distribution. */
async function ensureCodexComputerUseServiceApp(params) {
	const platform = params.platform ?? process.platform;
	if (platform !== "darwin") return {
		status: "unsupported",
		changed: false
	};
	const codexHome = path.resolve(params.codexHome);
	const ownershipRoot = path.resolve(params.ownershipRoot ?? path.dirname(codexHome));
	const targetParent = path.join(codexHome, "computer-use");
	const targetPath = path.join(targetParent, SERVICE_APP_NAME);
	await ensureOwnedCodexHome(codexHome, ownershipRoot);
	await assertOwnedServicePath({
		ownershipRoot,
		codexHome,
		targetParent,
		targetPath
	});
	const candidates = params.sourceAppCandidates ?? resolveMacOSDesktopCodexComputerUseServiceAppCandidates(platform, params.appServerCommand);
	const syncKey = [targetPath, ...candidates].join("\0");
	const active = activeInstalls.get(targetPath);
	if (active) {
		if (active.syncKey === syncKey) return await active.promise;
		await active.promise.catch(() => void 0);
		return await ensureCodexComputerUseServiceApp(params);
	}
	const install = ensureCodexComputerUseServiceAppOnce({
		...params,
		codexHome,
		ownershipRoot,
		targetParent,
		targetPath,
		platform,
		sourceAppCandidates: candidates
	});
	const activeEntry = {
		syncKey,
		promise: install
	};
	activeInstalls.set(targetPath, activeEntry);
	const clearActive = () => {
		if (activeInstalls.get(targetPath) === activeEntry) activeInstalls.delete(targetPath);
	};
	install.then(clearActive, clearActive);
	return await install;
}
async function ensureCodexComputerUseServiceAppOnce(params) {
	const inspectServiceApp = params.inspectServiceApp ?? inspectTrustedServiceApp;
	const source = await findUsableServiceApp(params.sourceAppCandidates ?? [], inspectServiceApp);
	if (!source) return {
		status: "source_missing",
		changed: false,
		targetPath: params.targetPath
	};
	const { path: sourcePath, identity: sourceIdentity } = source;
	const ownedParent = await prepareOwnedServiceParent({
		ownershipRoot: params.ownershipRoot,
		codexHome: params.codexHome,
		targetParent: params.targetParent
	});
	const operationTargetPath = path.join(ownedParent.realPath, SERVICE_APP_NAME);
	await assertNotSymlink(operationTargetPath, "Computer Use service target");
	const initialTarget = await readServiceAppSnapshot(operationTargetPath, inspectServiceApp);
	if (initialTarget.identity && identitiesMatch(initialTarget.identity, sourceIdentity)) return {
		status: "already_current",
		changed: false,
		targetPath: params.targetPath,
		sourcePath,
		sourceBuild: sourceIdentity.build
	};
	await assertOwnedServiceParentStable(ownedParent);
	const stagingRoot = await fs$1.mkdtemp(path.join(ownedParent.realPath, ".service-app.staging-"));
	const stagingRootIdentity = await readRealDirectoryIdentity(stagingRoot, "Computer Use service staging directory");
	const stagedPath = path.join(stagingRoot, SERVICE_APP_NAME);
	const backupPath = path.join(ownedParent.realPath, `.service-app.backup-${process.pid}-${Date.now()}`);
	let backupCreated = false;
	try {
		await (params.copyServiceApp ?? copyServiceAppWithDitto)(sourcePath, stagedPath);
		await assertOwnedServiceParentStable(ownedParent);
		await assertDirectoryIdentityStable(stagingRootIdentity, "Computer Use service staging directory");
		await assertNotSymlink(stagedPath, "Copied Computer Use service app");
		const stagedIdentity = await inspectServiceApp(stagedPath);
		if (!stagedIdentity || !identitiesMatch(stagedIdentity, sourceIdentity)) throw new Error(`Copied Computer Use service app at ${stagedPath} does not match its selected signed source.`);
		const stagedSnapshot = await readServiceAppSnapshot(stagedPath, inspectServiceApp);
		const currentSourceIdentity = await inspectServiceApp(sourcePath);
		await assertOwnedServiceParentStable(ownedParent);
		if (!currentSourceIdentity || !identitiesMatch(currentSourceIdentity, sourceIdentity)) throw new Error("Selected Computer Use service source changed during refresh.");
		await assertNotSymlink(operationTargetPath, "Computer Use service target");
		if (await pathExists(operationTargetPath)) {
			await assertOwnedServiceParentStable(ownedParent);
			params.assertCurrent?.();
			await fs$1.rename(operationTargetPath, backupPath);
			await assertOwnedServiceParentStable(ownedParent);
			backupCreated = true;
			const movedTarget = await readServiceAppSnapshot(backupPath, inspectServiceApp);
			if (movedTarget.identity && identitiesMatch(movedTarget.identity, sourceIdentity)) {
				await assertOwnedServiceParentStable(ownedParent);
				await fs$1.rename(backupPath, operationTargetPath);
				await assertOwnedServiceParentStable(ownedParent);
				backupCreated = false;
				return {
					status: "already_current",
					changed: false,
					targetPath: params.targetPath,
					sourcePath,
					sourceBuild: sourceIdentity.build
				};
			}
			if (!snapshotsMatch(initialTarget, movedTarget)) {
				await assertOwnedServiceParentStable(ownedParent);
				await fs$1.rename(backupPath, operationTargetPath);
				await assertOwnedServiceParentStable(ownedParent);
				backupCreated = false;
				throw new Error("Computer Use service target changed to an unexpected generation during refresh.");
			}
		}
		try {
			await assertOwnedServiceParentStable(ownedParent);
			params.assertCurrent?.();
			await fs$1.rename(stagedPath, operationTargetPath);
			await assertOwnedServiceParentStable(ownedParent);
		} catch (error) {
			await assertOwnedServiceParentStable(ownedParent);
			await assertNotSymlink(operationTargetPath, "Computer Use service target");
			const winnerIdentity = await inspectServiceApp(operationTargetPath);
			if (!winnerIdentity || !identitiesMatch(winnerIdentity, sourceIdentity)) {
				if (backupCreated) {
					if (!await pathExists(operationTargetPath)) {
						await assertOwnedServiceParentStable(ownedParent);
						await fs$1.rename(backupPath, operationTargetPath);
						await assertOwnedServiceParentStable(ownedParent);
						backupCreated = false;
					}
				}
				throw error;
			}
			if (backupCreated) {
				await assertOwnedServiceParentStable(ownedParent);
				await assertNotSymlink(backupPath, "Computer Use service backup");
				await fs$1.rm(backupPath, {
					recursive: true,
					force: true
				});
				await assertOwnedServiceParentStable(ownedParent);
				backupCreated = false;
			}
			return {
				status: "already_current",
				changed: false,
				targetPath: params.targetPath,
				sourcePath,
				sourceBuild: sourceIdentity.build
			};
		}
		await assertNotSymlink(operationTargetPath, "Installed Computer Use service app");
		const installedSnapshot = await readServiceAppSnapshot(operationTargetPath, inspectServiceApp);
		if (!installedSnapshot.identity || !identitiesMatch(installedSnapshot.identity, sourceIdentity)) {
			if (filesystemSnapshotsMatch(installedSnapshot, stagedSnapshot)) {
				await assertOwnedServiceParentStable(ownedParent);
				await fs$1.rm(operationTargetPath, {
					recursive: true,
					force: true
				});
				await assertOwnedServiceParentStable(ownedParent);
				if (backupCreated) {
					await fs$1.rename(backupPath, operationTargetPath);
					await assertOwnedServiceParentStable(ownedParent);
					backupCreated = false;
				}
			}
			throw new Error("Installed Computer Use service app failed post-install identity verification.");
		}
		if (backupCreated) {
			await assertOwnedServiceParentStable(ownedParent);
			await assertNotSymlink(backupPath, "Computer Use service backup");
			await fs$1.rm(backupPath, {
				recursive: true,
				force: true
			});
			await assertOwnedServiceParentStable(ownedParent);
			backupCreated = false;
		}
		return {
			status: initialTarget.exists ? "refreshed" : "installed",
			changed: true,
			targetPath: params.targetPath,
			sourcePath,
			sourceBuild: sourceIdentity.build,
			...initialTarget.identity ? { previousBuild: initialTarget.identity.build } : {}
		};
	} catch (error) {
		if (backupCreated && await ownedServiceParentIsStable(ownedParent) && !await pathExists(operationTargetPath)) {
			await assertOwnedServiceParentStable(ownedParent);
			await fs$1.rename(backupPath, operationTargetPath);
			backupCreated = false;
		}
		throw error;
	} finally {
		if (await ownedServiceParentIsStable(ownedParent) && await directoryIdentityIsStable(stagingRootIdentity)) await fs$1.rm(stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
async function pathExists(filePath) {
	return await fs$1.lstat(filePath).then(() => true, () => false);
}
async function findUsableServiceApp(candidates, inspectServiceApp) {
	for (const candidate of candidates) {
		const identity = await inspectServiceApp(candidate);
		if (identity) return {
			path: candidate,
			identity
		};
	}
}
async function readServiceAppSnapshot(appPath, inspectServiceApp) {
	if (!await pathExists(appPath)) return { exists: false };
	return {
		exists: true,
		identity: await inspectServiceApp(appPath),
		filesystemKey: await readServiceAppFilesystemKey(appPath)
	};
}
async function readServiceAppFilesystemKey(appPath) {
	const paths = [
		appPath,
		path.join(appPath, "Contents", "Info.plist"),
		path.join(appPath, CLIENT_RELATIVE_PATH)
	];
	return (await Promise.all(paths.map(async (entryPath) => await fs$1.stat(entryPath).then((stat) => `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}`, () => "missing")))).join("|");
}
function snapshotsMatch(left, right) {
	if (left.exists !== right.exists) return false;
	if (!left.exists) return true;
	if (left.filesystemKey && right.filesystemKey && left.filesystemKey !== right.filesystemKey) return false;
	if (left.identity || right.identity) return Boolean(left.identity && right.identity && identitiesMatch(left.identity, right.identity));
	return left.filesystemKey !== void 0 && left.filesystemKey === right.filesystemKey;
}
function filesystemSnapshotsMatch(left, right) {
	return Boolean(left.exists && right.exists && left.filesystemKey && right.filesystemKey && left.filesystemKey === right.filesystemKey);
}
function identitiesMatch(left, right) {
	return left.bundleId === right.bundleId && left.version === right.version && left.build === right.build && left.cdHash === right.cdHash && left.teamId === right.teamId && left.clientBundleId === right.clientBundleId && left.clientCdHash === right.clientCdHash && left.clientTeamId === right.clientTeamId;
}
async function hasExecutableClient(appPath) {
	try {
		await fs$1.access(path.join(appPath, CLIENT_RELATIVE_PATH), constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
async function inspectTrustedServiceApp(appPath) {
	if (!await hasExecutableClient(appPath)) return;
	const clientAppPath = path.join(appPath, CLIENT_APP_RELATIVE_PATH);
	try {
		await verifyTrustedBundle(appPath, SERVICE_BUNDLE_ID, true);
		await verifyTrustedBundle(clientAppPath, CLIENT_BUNDLE_ID, false);
		const [info, serviceSignature, clientSignature] = await Promise.all([
			readBundleInfo(appPath),
			readCodeSignature(appPath),
			readCodeSignature(clientAppPath)
		]);
		if (!info || serviceSignature.identifier !== SERVICE_BUNDLE_ID || serviceSignature.teamId !== OPENAI_TEAM_ID || clientSignature.identifier !== CLIENT_BUNDLE_ID || clientSignature.teamId !== OPENAI_TEAM_ID) return;
		return {
			bundleId: serviceSignature.identifier,
			version: info.version,
			build: info.build,
			cdHash: serviceSignature.cdHash,
			teamId: serviceSignature.teamId,
			clientBundleId: clientSignature.identifier,
			clientCdHash: clientSignature.cdHash,
			clientTeamId: clientSignature.teamId
		};
	} catch {
		return;
	}
}
async function verifyTrustedBundle(appPath, bundleId, deep) {
	const requirement = `anchor apple generic and certificate leaf[subject.OU] = "${OPENAI_TEAM_ID}" and identifier "${bundleId}"`;
	await runExec("/usr/bin/codesign", [
		"--verify",
		"--strict",
		...deep ? ["--deep"] : [],
		`-R=${requirement}`,
		appPath
	], {
		logOutput: false,
		timeoutMs: INSPECT_TIMEOUT_MS
	});
}
async function readBundleInfo(appPath) {
	const result = await runExec("/usr/bin/plutil", [
		"-convert",
		"json",
		"-o",
		"-",
		"--",
		path.join(appPath, "Contents", "Info.plist")
	], {
		logOutput: false,
		timeoutMs: INSPECT_TIMEOUT_MS
	});
	const parsed = JSON.parse(result.stdout);
	if (!isRecord(parsed)) return;
	const version = parsed.CFBundleShortVersionString;
	const build = parsed.CFBundleVersion;
	return typeof version === "string" && version && typeof build === "string" && build ? {
		version,
		build
	} : void 0;
}
async function readCodeSignature(appPath) {
	const result = await runExec("/usr/bin/codesign", [
		"-d",
		"--verbose=4",
		appPath
	], {
		logOutput: false,
		timeoutMs: INSPECT_TIMEOUT_MS
	});
	const output = `${result.stdout}\n${result.stderr}`;
	const identifier = readCodeSignField(output, "Identifier");
	const teamId = readCodeSignField(output, "TeamIdentifier");
	const cdHash = readCodeSignField(output, "CDHash").toLowerCase();
	if (!identifier || !teamId || !/^[a-f0-9]+$/.test(cdHash)) throw new Error(`Could not inspect the signed identity at ${appPath}.`);
	return {
		identifier,
		teamId,
		cdHash
	};
}
function readCodeSignField(output, field) {
	const prefix = `${field}=`;
	return output.split(/\r?\n/u).find((candidate) => candidate.startsWith(prefix))?.slice(prefix.length).trim() ?? "";
}
async function copyServiceAppWithDitto(sourcePath, targetPath) {
	await runExec("/usr/bin/ditto", [
		"--noqtn",
		sourcePath,
		targetPath
	], {
		logOutput: false,
		timeoutMs: COPY_TIMEOUT_MS
	});
}
//#endregion
//#region extensions/codex/src/app-server/protocol.ts
/** Namespace Codex keeps directly model-visible without exposing it to Code Mode guests. */
const CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE = "openclaw_direct";
function flattenCodexDynamicToolFunctions(tools) {
	return (tools ?? []).flatMap((tool) => tool.type === "namespace" ? tool.tools : [tool]);
}
const CODEX_INTERACTIVE_THREAD_SOURCE_KINDS = ["cli", "vscode"];
const CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES = ["atlas", "chatgpt"];
function isJsonObject(value) {
	return isRecord(value);
}
function isRpcResponse(message) {
	return "id" in message && !("method" in message);
}
//#endregion
//#region extensions/codex/src/app-server/auth-bridge.ts
const CODEX_APP_SERVER_AUTH_PROVIDER = "openai";
const CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS = [CODEX_APP_SERVER_AUTH_PROVIDER];
const OPENAI_CODEX_DEFAULT_PROFILE_ID = "openai:default";
const CODEX_HOME_ENV_VAR = "CODEX_HOME";
const HOME_ENV_VAR = "HOME";
const CODEX_API_KEY_ENV_VAR = "CODEX_API_KEY";
const OPENAI_API_KEY_ENV_VAR = "OPENAI_API_KEY";
const CODEX_ACCESS_TOKEN_ENV_VAR = "CODEX_ACCESS_TOKEN";
const CODEX_APP_SERVER_API_KEY_ENV_VARS = [CODEX_API_KEY_ENV_VAR, OPENAI_API_KEY_ENV_VAR];
const CODEX_APP_SERVER_PREPARED_AUTH_ENV_VARS = [
	CODEX_API_KEY_ENV_VAR,
	OPENAI_API_KEY_ENV_VAR,
	CODEX_ACCESS_TOKEN_ENV_VAR
];
const CODEX_APP_SERVER_HOME_ENV_VARS = [CODEX_HOME_ENV_VAR, HOME_ENV_VAR];
const CODEX_AUTH_JSON_FILENAME = "auth.json";
const CODEX_HOME_DIRNAME = ".codex";
const MAX_COMPUTER_USE_ARTIFACT_OWNERS = 128;
const activeComputerUseArtifactReconciliations = /* @__PURE__ */ new Map();
const scopedOAuthRefreshQueues = /* @__PURE__ */ new WeakMap();
async function bridgeCodexAppServerStartOptions(params) {
	if (params.startOptions.transport !== "stdio") return params.startOptions;
	const scopeStartOptions = () => withCodexHomeEnvironment(withEphemeralCodexAuthStore(params), params.agentDir);
	if (params.preparedAuth) return withClearedEnvironmentVariables(await scopeStartOptions(), CODEX_APP_SERVER_PREPARED_AUTH_ENV_VARS);
	if (params.authProfileId === null) return scopeStartOptions();
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const authProfileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!authProfileId) assertNoUnimportedAgentCodexAuthFile(params);
	const scopedStartOptions = await scopeStartOptions();
	return shouldClearOpenAiApiKeyForCodexAuthProfile({
		store,
		authProfileId
	}) ? withClearedEnvironmentVariables(scopedStartOptions, CODEX_APP_SERVER_API_KEY_ENV_VARS) : scopedStartOptions;
}
function assertNoUnimportedAgentCodexAuthFile(params) {
	if (params.authRequirement === "api-key" && resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: params.startOptions })) return;
	const message = resolveUnimportedAgentCodexAuthMessage(params);
	if (message) throw new AgentHarnessPreflightError(message);
}
function resolveUnimportedAgentCodexAuthMessage(params) {
	const managedCodexCli = params.startOptions.commandSource === "managed" || params.startOptions.commandSource === "resolved-managed";
	if (params.startOptions.transport !== "stdio" || !managedCodexCli || params.startOptions.homeScope === "user") return;
	const codexHome = resolveCodexAppServerHomeDir(params.agentDir);
	const authPath = path.join(codexHome, CODEX_AUTH_JSON_FILENAME);
	if (!fs.existsSync(authPath)) return;
	const targetAgentId = params.agentId?.trim() || "<agent-id>";
	return `A Codex auth file exists at ${authPath}, but agent-scoped Codex runs use OpenClaw's auth store and do not read that file. Preview only that credential import with \`openclaw migrate plan codex --from <codex-home> --agent ${targetAgentId} --include-secrets --item auth:openai\`, then run \`openclaw migrate apply codex --from <codex-home> --agent ${targetAgentId} --include-secrets --item auth:openai --yes\`. If the plan finds no credentials, remove the stale auth file.`;
}
function resolveCodexAppServerAuthProfileId(params) {
	const requested = params.authProfileId?.trim();
	if (requested) return requested;
	return resolveAuthProfileOrder({
		cfg: params.config,
		store: params.store,
		provider: CODEX_APP_SERVER_AUTH_PROVIDER
	})[0]?.trim();
}
function resolveCodexAppServerAuthProfileIdForAgent(params) {
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {}),
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	return resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
}
function ensureCodexAppServerAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		config: params.config,
		externalCliProviderIds: CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS,
		...params.authProfileId ? { externalCliProfileIds: [params.authProfileId] } : {}
	});
}
function resolveCodexAppServerAuthProfileStore(params) {
	if (params.authProfileStore) return params.authProfileStore;
	return ensureCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		config: params.config
	});
}
/** Resolves prepared profile login material once so cache identity and RPC login cannot drift. */
async function resolveCodexAppServerPreparedAuthProfileSnapshot(params) {
	const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential || !isCodexAppServerAuthProfileCredential(credential)) return;
	const loginParams = await resolveCodexAppServerAuthProfileLoginParamsInternal({
		agentDir,
		authProfileId: profileId,
		authProfileStore: store,
		config: params.config
	});
	if (!loginParams) return;
	const accountId = loginParams.type === "chatgptAuthTokens" ? loginParams.chatgptAccountId : resolveChatgptAccountId(profileId, credential);
	const stableChatgptAccountId = resolveStableChatgptAccountId(credential);
	const secretFreeCacheKey = credential.type === "api_key" && loginParams.type === "apiKey" ? `${accountId}:${fingerprintApiKeyAuthProfileCacheKey(loginParams.apiKey)}` : loginParams.type === "chatgptAuthTokens" && (credential.type === "token" || !stableChatgptAccountId) ? `${accountId}:${fingerprintTokenAuthProfileCacheKey(loginParams.accessToken)}` : accountId;
	const chatgptAccountId = loginParams.type === "chatgptAuthTokens" ? loginParams.chatgptAccountId : void 0;
	return {
		loginParams,
		secretFreeCacheKey,
		...chatgptAccountId ? { chatgptAccountId } : {}
	};
}
/** Maps one prepared route to one mutually exclusive app-server auth handoff. */
async function resolveCodexAppServerPreparedAuthHandoff(params) {
	const usesNativeHome = params.homeScope === "user";
	if (params.requirePreparedAuth && usesNativeHome) throw createCodexAppServerAuthError("Codex remote-exec cloud placement requires prepared OpenAI auth. Configure an OpenAI API-key, OAuth, or token profile and use appServer.homeScope=\"agent\"; ambient credentials and native Codex auth are not allowed.");
	if (usesNativeHome) return { nativeAuthProfile: true };
	if (params.authRequirement === "api-key") {
		const apiKey = params.resolvedApiKey?.trim();
		if (!apiKey) throw new Error("Prepared Codex API-key route is missing its resolved API key.");
		return {
			nativeAuthProfile: false,
			preparedAuth: {
				kind: "api-key",
				apiKey
			}
		};
	}
	const authProfileId = params.authProfileId?.trim() || void 0;
	const nativeAuthProfile = isCodexAppServerNativeAuthProfile({
		authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	if (params.authRequirement !== "subscription" && !params.requirePreparedAuth) return {
		authProfileId,
		nativeAuthProfile
	};
	if (!authProfileId || params.authRequirement === "subscription" && !nativeAuthProfile) throw createCodexAppServerAuthError(params.requirePreparedAuth ? "Codex remote-exec cloud placement requires prepared OpenAI auth. Configure an OpenAI API-key, OAuth, or token profile; ambient CODEX_API_KEY, OPENAI_API_KEY, and native Codex auth are not allowed." : params.subscriptionProfileRequiredError);
	const snapshot = await resolveCodexAppServerPreparedAuthProfileSnapshot({
		authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	if (!snapshot) throw createCodexAppServerAuthError(params.requirePreparedAuth ? "Codex remote-exec cloud placement could not prepare the selected OpenAI auth profile. Repair or replace the profile, then retry." : params.subscriptionProfileUnusableError);
	return {
		authProfileId,
		nativeAuthProfile,
		preparedAuth: {
			kind: "profile",
			profileId: authProfileId,
			store: params.authProfileStore,
			snapshot
		}
	};
}
async function resolveCodexAppServerAuthAccountCacheKey(params) {
	const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential || !isCodexAppServerAuthProfileCredential(credential)) return;
	if (credential.type === "api_key") {
		const apiKey = (await resolveApiKeyForProfile({
			store,
			profileId,
			agentDir
		}))?.apiKey?.trim();
		return apiKey ? `${resolveChatgptAccountId(profileId, credential)}:${fingerprintApiKeyAuthProfileCacheKey(apiKey)}` : resolveChatgptAccountId(profileId, credential);
	}
	if (credential.type === "token") {
		const accessToken = (await resolveApiKeyForProfile({
			store,
			profileId,
			agentDir
		}))?.apiKey?.trim();
		return accessToken ? `${resolveChatgptAccountId(profileId, credential)}:${fingerprintTokenAuthProfileCacheKey(accessToken)}` : resolveChatgptAccountId(profileId, credential);
	}
	return resolveChatgptAccountId(profileId, credential);
}
function resolveCodexAppServerEnvApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	const apiKey = readFirstNonEmptyEnvEntry(resolveCodexAppServerSpawnEnv(params.startOptions, params.baseEnv ?? process.env, params.platform ?? process.platform), CODEX_APP_SERVER_API_KEY_ENV_VARS);
	if (!apiKey) return;
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-env-api-key:v1");
	hash.update("\0");
	hash.update(apiKey.key);
	hash.update("\0");
	hash.update(apiKey.value);
	return `${apiKey.key}:sha256:${hash.digest("hex")}`;
}
function resolveCodexAppServerFallbackApiKeyCacheKey(params) {
	if (params.startOptions.transport !== "stdio") return;
	return resolveCodexAppServerEnvApiKeyCacheKey(params) ?? resolveCodexCliAuthFileApiKeyCacheKey(params.baseEnv ?? process.env);
}
/** Secret-free cache identity for an API key already resolved by the runtime plan. */
function resolveCodexAppServerPreparedApiKeyCacheKey(apiKey) {
	const resolved = apiKey?.trim();
	return resolved ? fingerprintApiKeyAuthProfileCacheKey(resolved) : void 0;
}
function fingerprintApiKeyAuthProfileCacheKey(apiKey) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-auth-profile-api-key:v1");
	hash.update("\0");
	hash.update(apiKey);
	return `api_key:sha256:${hash.digest("hex")}`;
}
function fingerprintTokenAuthProfileCacheKey(accessToken) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-auth-profile-token:v1");
	hash.update("\0");
	hash.update(accessToken);
	return `token:sha256:${hash.digest("hex")}`;
}
function fingerprintCodexCliAuthFileApiKeyCacheKey(apiKey) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:app-server-cli-auth-json-api-key:v1");
	hash.update("\0");
	hash.update(apiKey);
	return `CODEX_AUTH_JSON:sha256:${hash.digest("hex")}`;
}
async function withCodexHomeEnvironment(startOptions, agentDir) {
	const codexHome = resolveCodexAppServerLocalHomeDir(startOptions, agentDir);
	const nativeHome = startOptions.env?.[HOME_ENV_VAR]?.trim() ? startOptions.env[HOME_ENV_VAR] : void 0;
	await fs$1.mkdir(codexHome, { recursive: true });
	if (nativeHome) await fs$1.mkdir(nativeHome, { recursive: true });
	const nextStartOptions = {
		...startOptions,
		env: {
			...startOptions.env,
			[CODEX_HOME_ENV_VAR]: codexHome,
			...nativeHome ? { [HOME_ENV_VAR]: nativeHome } : {}
		}
	};
	const clearEnv = withoutClearedCodexHomeEnv(startOptions.clearEnv);
	if (clearEnv) nextStartOptions.clearEnv = clearEnv;
	else delete nextStartOptions.clearEnv;
	return nextStartOptions;
}
/** Reconciles Computer Use artifacts for the exact managed command about to start. */
async function reconcileCodexComputerUseStartArtifacts(params) {
	if (params.startOptions.transport !== "stdio") return;
	const codexHome = resolveCodexAppServerLocalHomeDir(params.startOptions, params.agentDir);
	const key = path.resolve(codexHome);
	let owner = activeComputerUseArtifactReconciliations.get(key);
	if (!owner) {
		owner = {
			active: 0,
			tail: Promise.resolve()
		};
		activeComputerUseArtifactReconciliations.set(key, owner);
	} else {
		activeComputerUseArtifactReconciliations.delete(key);
		activeComputerUseArtifactReconciliations.set(key, owner);
	}
	owner.active += 1;
	const epoch = params.desktopGeneration?.epoch;
	if (epoch !== void 0 && (owner.latestEpoch === void 0 || epoch > owner.latestEpoch)) owner.latestEpoch = epoch;
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (epoch !== void 0 && owner.latestEpoch !== epoch) throw new Error("Codex Computer Use artifact reconciliation was superseded.");
	};
	const operation = owner.tail.catch(() => void 0).then(async () => {
		assertCurrent();
		const appliedCacheBinding = await reconcileCodexComputerUseStartArtifactsOnce({
			...params,
			codexHome,
			assertCurrent,
			previousCacheBinding: owner.appliedCacheBinding
		});
		assertCurrent();
		owner.appliedCacheBinding = appliedCacheBinding;
	});
	const settled = operation.then(() => void 0, () => void 0);
	owner.tail = settled;
	try {
		await operation;
	} finally {
		owner.active = Math.max(0, owner.active - 1);
		if (owner.active === 0 && owner.latestEpoch === void 0 && activeComputerUseArtifactReconciliations.get(key) === owner && owner.tail === settled) activeComputerUseArtifactReconciliations.delete(key);
		pruneComputerUseArtifactOwners();
	}
}
async function reconcileCodexComputerUseStartArtifactsOnce(params) {
	const codexHome = params.codexHome;
	const computerUseConfig = resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig });
	const ownsIsolatedCodexHome = params.ownsIsolatedCodexHome ?? (params.startOptions.homeScope !== "user" && !params.startOptions.env?.[CODEX_HOME_ENV_VAR]?.trim());
	const shouldProvisionComputerUse = computerUseConfig.enabled && computerUseConfig.autoInstall && ownsIsolatedCodexHome;
	if (shouldProvisionComputerUse) await ensureOwnedCodexHome(codexHome, params.agentDir);
	else await fs$1.mkdir(codexHome, { recursive: true });
	const desktopCandidates = resolveMacOSDesktopCodexAppPathCandidates();
	const exactDesktopCandidate = desktopCandidates.find((candidate) => path.resolve(candidate.appServerCommandPath) === path.resolve(params.startOptions.command));
	const usesManagedBundledMarketplace = !computerUseConfig.marketplaceSource && !computerUseConfig.marketplacePath && !computerUseConfig.marketplaceName;
	const needsBundledMarketplace = usesManagedBundledMarketplace || computerUseConfig.pluginCacheMode === "shared" && !computerUseConfig.marketplaceName && !computerUseConfig.marketplacePath;
	const artifactCandidate = shouldProvisionComputerUse ? await resolveCompleteComputerUseArtifactCandidate({
		candidates: exactDesktopCandidate ? [exactDesktopCandidate] : desktopCandidates,
		needsBundledMarketplace
	}) : exactDesktopCandidate;
	params.assertCurrent();
	if (shouldProvisionComputerUse) {
		if (desktopCandidates.length > 0 && !artifactCandidate) throw new CodexComputerUseCandidateArtifactsUnavailableError();
		try {
			const marketplacePath = usesManagedBundledMarketplace ? await ensureCodexManagedBundledMarketplace({
				codexHome,
				ownershipRoot: params.agentDir,
				...artifactCandidate ? {
					appServerCommand: artifactCandidate.appServerCommandPath,
					candidates: [artifactCandidate],
					ownershipCandidates: desktopCandidates
				} : {},
				assertCurrent: params.assertCurrent
			}) : void 0;
			params.assertCurrent();
			if (usesManagedBundledMarketplace && desktopCandidates.length > 0 && !marketplacePath) throw new CodexComputerUseCandidateArtifactsUnavailableError();
			const service = await ensureCodexComputerUseServiceApp({
				codexHome,
				ownershipRoot: params.agentDir,
				...artifactCandidate ? {
					appServerCommand: artifactCandidate.appServerCommandPath,
					sourceAppCandidates: artifactCandidate.computerUseServiceAppPaths
				} : {},
				assertCurrent: params.assertCurrent
			});
			params.assertCurrent();
			if (desktopCandidates.length > 0 && service.status === "source_missing") throw new CodexComputerUseCandidateArtifactsUnavailableError();
		} catch (error) {
			params.assertCurrent();
			if (error instanceof CodexComputerUseCandidateArtifactsUnavailableError) throw error;
			throw new AgentHarnessPreflightError("Codex Computer Use client provisioning failed.", {
				cause: error,
				scope: "harness"
			});
		}
	}
	params.assertCurrent();
	const cacheBinding = [
		params.desktopGeneration?.epoch ?? "manual",
		artifactCandidate?.bundledMarketplacePath ?? "default",
		computerUseConfig.pluginName
	].join("\0");
	const cache = await ensureCodexComputerUseSharedPluginCache({
		codexHome,
		config: computerUseConfig,
		...ownsIsolatedCodexHome ? { ownershipRoot: params.agentDir } : {},
		...artifactCandidate ? { bundledMarketplacePath: artifactCandidate.bundledMarketplacePath } : {},
		assertCurrent: params.assertCurrent,
		forceRefresh: params.forceCacheRefresh === true || params.previousCacheBinding !== cacheBinding
	});
	params.assertCurrent();
	return cache.status === "shared" ? cacheBinding : void 0;
}
async function resolveCompleteComputerUseArtifactCandidate(params) {
	for (const candidate of params.candidates) {
		if (params.needsBundledMarketplace && !await resolveCodexManagedBundledMarketplaceSource({ candidates: [candidate] })) continue;
		if (await resolveCodexComputerUseServiceAppSourcePath({ sourceAppCandidates: candidate.computerUseServiceAppPaths })) return candidate;
	}
}
function pruneComputerUseArtifactOwners() {
	while (activeComputerUseArtifactReconciliations.size > MAX_COMPUTER_USE_ARTIFACT_OWNERS) {
		const inactive = [...activeComputerUseArtifactReconciliations].find(([, owner]) => owner.active === 0);
		if (!inactive) return;
		activeComputerUseArtifactReconciliations.delete(inactive[0]);
	}
}
var CodexComputerUseCandidateArtifactsUnavailableError = class extends Error {
	constructor() {
		super("The selected Codex desktop app does not contain complete Computer Use artifacts.");
		this.code = "CODEX_COMPUTER_USE_CANDIDATE_ARTIFACTS_UNAVAILABLE";
		this.name = "CodexComputerUseCandidateArtifactsUnavailableError";
	}
};
function withoutClearedCodexHomeEnv(clearEnv) {
	if (!clearEnv) return;
	const reserved = new Set(CODEX_APP_SERVER_HOME_ENV_VARS);
	const filtered = clearEnv.filter((envVar) => !reserved.has(envVar.trim().toUpperCase()));
	return filtered.length === clearEnv.length ? clearEnv : filtered;
}
async function applyCodexAppServerAuthProfile(params) {
	if (params.preparedAuth?.kind === "profile") {
		await params.client.request("account/login/start", params.preparedAuth.snapshot.loginParams);
		return;
	}
	if (params.preparedAuth?.kind === "api-key") {
		await params.client.request("account/login/start", {
			type: "apiKey",
			apiKey: params.preparedAuth.apiKey
		});
		return;
	}
	if (params.authProfileId === null) {
		await assertNativeCodexAccountMatchesRoute(params.client, params.authRequirement);
		return;
	}
	let loginParams;
	try {
		loginParams = await resolveCodexAppServerAuthProfileLoginParams({
			agentDir: params.agentDir,
			authProfileId: params.authProfileId,
			authProfileStore: params.authProfileStore,
			config: params.config
		});
	} catch (error) {
		if (params.authRequirement === "subscription" && error instanceof CodexAppServerAuthProfileUnavailableError) throw createCodexAppServerAuthError("Codex subscription auth profile could not produce login credentials.", error);
		throw error;
	}
	if (params.authRequirement === "subscription" && loginParams?.type !== "chatgptAuthTokens") throw createCodexAppServerAuthError("Codex subscription auth profile could not produce login credentials.");
	if (!loginParams) {
		if (params.authRequirement === "subscription") throw createCodexAppServerAuthError("Codex subscription auth profile could not produce login credentials.");
		if (params.authRequirement !== "api-key" || params.startOptions?.transport !== "stdio") return;
		const env = resolveCodexAppServerSpawnEnv(params.startOptions, process.env);
		const fallbackLoginParams = await resolveCodexAppServerFallbackApiKeyLoginParams({
			client: params.client,
			env,
			codexCliAuthEnv: process.env
		});
		if (fallbackLoginParams) await params.client.request("account/login/start", fallbackLoginParams);
		return;
	}
	await params.client.request("account/login/start", loginParams);
}
/**
* Native-home connections are verified, never logged into. Both directions of the
* check protect the same billing boundary: a subscription route cannot run without
* ChatGPT tokens, and a Platform route must not silently spend the operator's
* ChatGPT plan. An absent account is left alone because the native home may serve a
* custom model provider that reports no OpenAI account at all.
*/
async function assertNativeCodexAccountMatchesRoute(client, authRequirement) {
	if (!authRequirement) return;
	const response = await client.request("account/read", { refreshToken: false });
	const accountType = isJsonObject(response.account) ? response.account.type : void 0;
	if (authRequirement === "subscription") {
		if (accountType !== "chatgpt") throw createCodexAppServerAuthError("Codex subscription auth profile could not produce login credentials.");
		return;
	}
	if (accountType === "chatgpt") throw createCodexAppServerAuthError("Codex Platform route requires an API-key account, but the native Codex home is signed in with a ChatGPT subscription. Sign that home in with `codex login --with-api-key`, or set appServer.homeScope=\"agent\" so OpenClaw can inject its own key.");
}
function createCodexAppServerAuthError(message, cause) {
	const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
	return Object.assign(error, { status: 401 });
}
var CodexAppServerAuthProfileUnavailableError = class extends Error {};
async function resolveCodexAppServerAuthProfileLoginParams(params) {
	const store = resolveCodexAppServerAuthProfileStore(params);
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	const profile = profileId ? store.profiles[profileId] : void 0;
	if (profileId && !profile) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" was not found.`);
	if (profileId && profile && !isCodexAppServerAuthProfileCredential(profile)) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" must use the canonical OpenAI auth provider; run "openclaw doctor --fix" to migrate legacy provider IDs.`);
	return await resolveCodexAppServerAuthProfileLoginParamsInternal({
		...params,
		authProfileStore: store
	});
}
async function refreshCodexAppServerAuthTokens(params) {
	const previousAccountId = params.previousAccountId?.trim();
	if (previousAccountId) {
		const store = resolveCodexAppServerAuthProfileStore(params);
		const profileId = resolveCodexAppServerAuthProfileId({
			authProfileId: params.authProfileId,
			store,
			config: params.config
		});
		const credential = profileId ? store.profiles[profileId] : void 0;
		const selectedAccountId = credential ? resolveExplicitChatgptAccountId(credential) ?? (credential.type === "oauth" ? resolveOpenAICodexAuthIdentity({ access: credential.access }).accountId : void 0) : void 0;
		if (selectedAccountId && selectedAccountId !== previousAccountId) throw new Error("ChatGPT workspace changed before Codex token refresh.");
	}
	const loginParams = await resolveCodexAppServerAuthProfileLoginParamsInternal({
		...params,
		forceOAuthRefresh: true
	});
	if (!loginParams || loginParams.type !== "chatgptAuthTokens") throw new Error("Codex app-server ChatGPT token refresh requires an OAuth auth profile.");
	if (previousAccountId && loginParams.chatgptAccountId !== previousAccountId) throw new Error("ChatGPT workspace changed during Codex token refresh.");
	return {
		accessToken: loginParams.accessToken,
		chatgptAccountId: loginParams.chatgptAccountId,
		chatgptPlanType: loginParams.chatgptPlanType ?? null
	};
}
async function resolveCodexAppServerAuthProfileLoginParamsInternal(params) {
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential) throw new Error(`Codex app-server auth profile "${profileId}" was not found.`);
	if (!isCodexAppServerAuthProfileCredential(credential)) throw new Error(`Codex app-server auth profile "${profileId}" must use the canonical OpenAI auth provider; run "openclaw doctor --fix" to migrate legacy provider IDs.`);
	const loginParams = await resolveLoginParamsForCredential(profileId, credential, {
		agentDir: params.agentDir,
		store,
		preferStoreCredential: Boolean(params.authProfileStore?.profiles[profileId]),
		forceOAuthRefresh: params.forceOAuthRefresh === true,
		config: params.config
	});
	if (!loginParams) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" does not contain usable credentials.`);
	return loginParams;
}
async function resolveCodexAppServerFallbackApiKeyLoginParams(params) {
	const apiKey = readFirstNonEmptyEnv(params.env, CODEX_APP_SERVER_API_KEY_ENV_VARS) ?? await readCodexCliAuthFileApiKey(params.codexCliAuthEnv);
	if (!apiKey) return;
	if ((await params.client.request("account/read", { refreshToken: false })).account) return;
	return {
		type: "apiKey",
		apiKey
	};
}
function resolveCodexCliAuthFilePath(env) {
	const configuredCodexHome = env[CODEX_HOME_ENV_VAR]?.trim();
	if (configuredCodexHome) return path.join(resolveHomeRelativePath(configuredCodexHome, env), CODEX_AUTH_JSON_FILENAME);
	const home = env[HOME_ENV_VAR]?.trim() || env.USERPROFILE?.trim() || os.homedir();
	return path.join(home, CODEX_HOME_DIRNAME, CODEX_AUTH_JSON_FILENAME);
}
function resolveHomeRelativePath(value, env) {
	if (value === "~" || value.startsWith("~/") || value.startsWith("~\\")) {
		const home = env[HOME_ENV_VAR]?.trim() || env.USERPROFILE?.trim() || os.homedir();
		return path.join(home, value.slice(value === "~" ? 1 : 2));
	}
	return value;
}
function parseCodexCliAuthFileApiKey(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object") return;
	const apiKey = parsed.OPENAI_API_KEY;
	return typeof apiKey === "string" && apiKey.trim() ? apiKey.trim() : void 0;
}
async function readCodexCliAuthFileApiKey(env) {
	try {
		return parseCodexCliAuthFileApiKey(await readSecretFile(resolveCodexCliAuthFilePath(env), "Codex CLI auth file"));
	} catch {
		return;
	}
}
function resolveCodexCliAuthFileApiKeyCacheKey(env) {
	try {
		const apiKey = parseCodexCliAuthFileApiKey(fs.readFileSync(resolveCodexCliAuthFilePath(env), "utf8"));
		return apiKey ? fingerprintCodexCliAuthFileApiKeyCacheKey(apiKey) : void 0;
	} catch {
		return;
	}
}
async function resolveLoginParamsForCredential(profileId, credential, params) {
	if (credential.type === "api_key") {
		const apiKey = (await resolveApiKeyForProfile({
			store: params.preferStoreCredential ? params.store : ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }),
			profileId,
			agentDir: params.agentDir
		}))?.apiKey?.trim();
		return apiKey ? {
			type: "apiKey",
			apiKey
		} : void 0;
	}
	if (credential.type === "token") {
		const accessToken = (await resolveApiKeyForProfile({
			store: params.preferStoreCredential ? params.store : ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }),
			profileId,
			agentDir: params.agentDir
		}))?.apiKey?.trim();
		return accessToken ? buildChatgptAuthTokensParams(profileId, credential, accessToken) : void 0;
	}
	if (credential.type !== "oauth") return;
	const resolvedCredential = await resolveOAuthCredentialForCodexAppServer(profileId, credential, {
		agentDir: params.agentDir,
		store: params.store,
		preferStoreCredential: params.preferStoreCredential,
		forceRefresh: params.forceOAuthRefresh,
		config: params.config
	});
	const accessToken = resolvedCredential.access?.trim();
	return accessToken ? buildChatgptAuthTokensParams(profileId, resolvedCredential, accessToken) : void 0;
}
async function resolveOAuthCredentialForCodexAppServer(profileId, credential, params) {
	const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
		agentDir: params.agentDir,
		profileId
	});
	const persistedCredential = findPersistedAuthProfileCredential({
		agentDir: ownerAgentDir,
		profileId
	});
	const useScopedCredential = params.preferStoreCredential && shouldUseScopedOAuthCredential({
		store: params.store,
		profileId,
		persistedCredential,
		suppliedCredential: credential,
		config: params.config
	});
	const store = useScopedCredential ? params.store : ensureCodexAppServerAuthProfileStore({
		agentDir: ownerAgentDir,
		authProfileId: profileId,
		config: params.config
	});
	const persistedOAuthCredential = !useScopedCredential && persistedCredential?.type === "oauth" && isCodexAppServerAuthProvider(persistedCredential.provider) ? persistedCredential : void 0;
	const ownerCredential = store.profiles[profileId];
	const overlaidOAuthCredential = ownerCredential?.type === "oauth" && isCodexAppServerAuthProvider(ownerCredential.provider) ? ownerCredential : void 0;
	if (useScopedCredential && overlaidOAuthCredential) return await resolveScopedOAuthCredential({
		store,
		profileId,
		credential: overlaidOAuthCredential,
		forceRefresh: params.forceRefresh
	});
	if (params.forceRefresh && !persistedOAuthCredential && overlaidOAuthCredential) {
		const refreshedRuntimeCredential = await refreshOAuthCredentialForRuntime({ credential: overlaidOAuthCredential });
		if (!refreshedRuntimeCredential?.access?.trim()) throw new Error(`Codex app-server auth profile "${profileId}" could not refresh.`);
		store.profiles[profileId] = refreshedRuntimeCredential;
		return refreshedRuntimeCredential;
	}
	const resolved = await resolveApiKeyForProfile({
		store,
		profileId,
		agentDir: ownerAgentDir,
		forceRefresh: params.forceRefresh && Boolean(persistedOAuthCredential)
	});
	const refreshed = useScopedCredential ? void 0 : loadAuthProfileStoreForSecretsRuntime(ownerAgentDir).profiles[profileId];
	const refreshedOAuthCredential = refreshed?.type === "oauth" && isCodexAppServerAuthProvider(refreshed.provider) ? refreshed : void 0;
	if (refreshedOAuthCredential && isDeepStrictEqual(params.store.profiles[profileId], credential)) params.store.profiles[profileId] = refreshedOAuthCredential;
	const storedCredential = store.profiles[profileId];
	const candidate = refreshedOAuthCredential ? refreshedOAuthCredential : storedCredential?.type === "oauth" && isCodexAppServerAuthProvider(storedCredential.provider) ? storedCredential : credential;
	return resolved?.apiKey ? {
		...candidate,
		access: resolved.apiKey
	} : candidate;
}
function shouldUseScopedOAuthCredential(params) {
	if (!params.store.runtimePersistedProfileIds?.includes(params.profileId)) return true;
	const persisted = params.persistedCredential;
	if (persisted?.type !== "oauth") return true;
	if (resolveProviderIdForAuth(persisted.provider, { config: params.config }) !== resolveProviderIdForAuth(params.suppliedCredential.provider, { config: params.config })) return true;
	return !isDeepStrictEqual(persisted, params.suppliedCredential) && !hasMatchingOAuthIdentity(persisted, params.suppliedCredential);
}
function hasMatchingOAuthIdentity(persisted, supplied) {
	const persistedAccountId = persisted.accountId?.trim();
	const suppliedAccountId = supplied.accountId?.trim();
	if (persistedAccountId && suppliedAccountId) return persistedAccountId === suppliedAccountId;
	const persistedEmail = persisted.email?.trim().toLowerCase();
	const suppliedEmail = supplied.email?.trim().toLowerCase();
	return Boolean(persistedEmail && suppliedEmail && persistedEmail === suppliedEmail);
}
async function resolveScopedOAuthCredential(params) {
	const existingRefresh = scopedOAuthRefreshQueues.get(params.store)?.get(params.profileId);
	if (existingRefresh) return await existingRefresh;
	if (!params.forceRefresh && hasUsableOAuthCredential(params.credential)) return params.credential;
	const storeRefreshes = scopedOAuthRefreshQueues.get(params.store) ?? /* @__PURE__ */ new Map();
	scopedOAuthRefreshQueues.set(params.store, storeRefreshes);
	const refresh = (async () => {
		const current = params.store.profiles[params.profileId];
		const credential = current?.type === "oauth" ? current : params.credential;
		if (!params.forceRefresh && hasUsableOAuthCredential(credential)) return credential;
		const refreshed = await refreshOAuthCredentialForRuntime({ credential });
		if (!refreshed?.access?.trim()) throw new Error(`Codex app-server auth profile "${params.profileId}" could not refresh.`);
		if (!isDeepStrictEqual(params.store.profiles[params.profileId], credential)) throw new Error(`Codex app-server auth profile "${params.profileId}" changed while refreshing.`);
		params.store.profiles[params.profileId] = refreshed;
		return refreshed;
	})();
	storeRefreshes.set(params.profileId, refresh);
	try {
		return await refresh;
	} finally {
		if (storeRefreshes.get(params.profileId) === refresh) storeRefreshes.delete(params.profileId);
	}
}
function isCodexAppServerAuthProvider(provider) {
	return provider.trim().toLowerCase() === CODEX_APP_SERVER_AUTH_PROVIDER;
}
function isCodexAppServerAuthProfileCredential(credential) {
	return isCodexAppServerAuthProvider(credential.provider);
}
function shouldClearOpenAiApiKeyForCodexAuthProfile(params) {
	const profileId = params.authProfileId?.trim();
	return isCodexSubscriptionCredential(profileId ? params.store.profiles[profileId] : params.store.profiles[OPENAI_CODEX_DEFAULT_PROFILE_ID]);
}
function isCodexSubscriptionCredential(credential) {
	if (!credential || !isCodexAppServerAuthProvider(credential.provider)) return false;
	return credential.type === "oauth" || credential.type === "token";
}
function withClearedEnvironmentVariables(startOptions, envVars) {
	const clearEnv = startOptions.clearEnv ?? [];
	const missingEnvVars = envVars.filter((envVar) => !clearEnv.includes(envVar));
	if (missingEnvVars.length === 0) return startOptions;
	return {
		...startOptions,
		clearEnv: [...clearEnv, ...missingEnvVars]
	};
}
function readFirstNonEmptyEnv(env, keys) {
	return readFirstNonEmptyEnvEntry(env, keys)?.value;
}
function readFirstNonEmptyEnvEntry(env, keys) {
	for (const key of keys) {
		const value = env[key]?.trim();
		if (value) return {
			key,
			value
		};
	}
}
function buildChatgptAuthTokensParams(profileId, credential, accessToken) {
	const storedAccountId = resolveExplicitChatgptAccountId(credential);
	const tokenAccountId = resolveOpenAICodexAuthIdentity({ access: accessToken }).accountId;
	if (storedAccountId && tokenAccountId && storedAccountId !== tokenAccountId) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" has a different ChatGPT account ID than its access token. Sign in again before retrying.`);
	const chatgptAccountId = storedAccountId ?? tokenAccountId;
	if (!chatgptAccountId) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" is missing its ChatGPT account ID. Sign in again before retrying.`);
	return {
		type: "chatgptAuthTokens",
		accessToken,
		chatgptAccountId,
		chatgptPlanType: resolveChatgptPlanType(credential)
	};
}
function resolveChatgptPlanType(credential) {
	const record = credential;
	const planType = record.chatgptPlanType ?? record.planType;
	return typeof planType === "string" && planType.trim() ? planType.trim() : null;
}
function resolveChatgptAccountId(profileId, credential) {
	return resolveStableChatgptAccountId(credential) ?? profileId;
}
function resolveStableChatgptAccountId(credential) {
	return resolveExplicitChatgptAccountId(credential) ?? (credential.email?.trim() || void 0);
}
function resolveExplicitChatgptAccountId(credential) {
	if ("accountId" in credential && typeof credential.accountId === "string") {
		const accountId = credential.accountId.trim();
		if (accountId) return accountId;
	}
}
//#endregion
//#region extensions/codex/src/app-server/rate-limit-cache.ts
const DEFAULT_CODEX_RATE_LIMIT_CACHE_MAX_AGE_MS = 10 * 6e4;
const SPARSE_ACCOUNT_METADATA_KEYS = [
	"credits",
	"individualLimit",
	"planType"
];
const rateLimitsByClient = /* @__PURE__ */ new WeakMap();
/** Replaces one physical client's cache with an authoritative rate-limit read response. */
function rememberCodexRateLimitsRead(client, value, nowMs = Date.now()) {
	if (value !== void 0) {
		const revisionsByLimitId = { ...rateLimitsByClient.get(client)?.revisionsByLimitId };
		for (const limitId of readRateLimitIds(value)) revisionsByLimitId[limitId] = (revisionsByLimitId[limitId] ?? 0) + 1;
		rateLimitsByClient.set(client, {
			value,
			updatedAtMs: nowMs,
			revisionsByLimitId
		});
	}
}
/** Merges a sparse rolling notification into one physical client's latest read response. */
function mergeCodexRateLimitsUpdate(client, value, nowMs = Date.now()) {
	const update = isJsonObject(value) && isJsonObject(value.rateLimits) ? value.rateLimits : void 0;
	if (!update) return;
	const currentState = rateLimitsByClient.get(client);
	const current = currentState?.value;
	const limitId = readLimitId(update);
	rateLimitsByClient.set(client, {
		value: mergeRateLimitUpdate(current, update),
		updatedAtMs: nowMs,
		revisionsByLimitId: {
			...currentState?.revisionsByLimitId,
			[limitId]: (currentState?.revisionsByLimitId[limitId] ?? 0) + 1
		}
	});
}
/** Per-limit marker used to trust only primary Codex updates from one turn startup. */
function readCodexRateLimitsRevision(client, limitId = "codex") {
	return rateLimitsByClient.get(client)?.revisionsByLimitId[limitId] ?? 0;
}
/** Reads one physical client's cached rate-limit payload within the max-age window. */
function readRecentCodexRateLimits(client, options) {
	const state = rateLimitsByClient.get(client);
	if (!state) return;
	const nowMs = options?.nowMs ?? Date.now();
	const maxAgeMs = options?.maxAgeMs ?? DEFAULT_CODEX_RATE_LIMIT_CACHE_MAX_AGE_MS;
	return maxAgeMs >= 0 && nowMs - state.updatedAtMs > maxAgeMs ? void 0 : state.value;
}
function mergeRateLimitUpdate(current, update) {
	const currentEnvelope = isJsonObject(current) ? current : void 0;
	const currentPrimary = currentEnvelope && isJsonObject(currentEnvelope.rateLimits) ? currentEnvelope.rateLimits : void 0;
	const currentByLimitId = currentEnvelope && isJsonObject(currentEnvelope.rateLimitsByLimitId) ? currentEnvelope.rateLimitsByLimitId : void 0;
	const limitId = readLimitId(update);
	const currentPrimaryLimitId = currentPrimary ? readLimitId(currentPrimary) : void 0;
	const currentForLimit = (currentByLimitId && isJsonObject(currentByLimitId[limitId]) ? currentByLimitId[limitId] : void 0) ?? (currentPrimaryLimitId === limitId ? currentPrimary : void 0);
	const merged = mergeSparseSnapshot(isJsonObject(currentForLimit) ? currentForLimit : void 0, currentPrimary, update, limitId);
	const nextPrimary = !currentPrimary || currentPrimaryLimitId === limitId ? merged : currentPrimary;
	let nextByLimitId;
	if (currentByLimitId) nextByLimitId = {
		...currentByLimitId,
		[limitId]: merged
	};
	else if (currentPrimary && currentPrimaryLimitId && currentPrimaryLimitId !== limitId) nextByLimitId = {
		[currentPrimaryLimitId]: currentPrimary,
		[limitId]: merged
	};
	return {
		...currentEnvelope,
		rateLimits: nextPrimary,
		...nextByLimitId ? { rateLimitsByLimitId: nextByLimitId } : {}
	};
}
function readRateLimitIds(value) {
	if (!isJsonObject(value)) return [];
	const ids = /* @__PURE__ */ new Set();
	if (isJsonObject(value.rateLimits)) ids.add(readLimitId(value.rateLimits));
	if (isJsonObject(value.rateLimitsByLimitId)) for (const [key, snapshot] of Object.entries(value.rateLimitsByLimitId)) {
		const snapshotLimitId = isJsonObject(snapshot) && typeof snapshot.limitId === "string" ? snapshot.limitId.trim() : "";
		ids.add(snapshotLimitId || key);
	}
	return [...ids];
}
function mergeSparseSnapshot(current, accountFallback, update, limitId) {
	const merged = {
		...update,
		limitId
	};
	for (const key of SPARSE_ACCOUNT_METADATA_KEYS) {
		const previous = current?.[key] ?? accountFallback?.[key];
		if (merged[key] == null && previous != null) merged[key] = previous;
	}
	return merged;
}
function readLimitId(snapshot) {
	const value = snapshot.limitId;
	return typeof value === "string" && value.trim() ? value.trim() : "codex";
}
//#endregion
//#region extensions/codex/src/app-server/timeout.ts
/**
* Thin Codex app-server timeout adapter around OpenClaw's shared security
* runtime timeout helper.
*/
function resolveAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : new Error("Codex app-server operation aborted", { cause: signal.reason });
}
/** Awaits a promise with a Codex-specific timeout error message. */
async function withTimeout(promise, timeoutMs, timeoutMessage, createError) {
	return await withTimeout$1(promise, timeoutMs, {
		message: timeoutMessage,
		...createError ? { createError } : {}
	});
}
/** Bounds an operation by both its owner lifecycle and one total wall-clock budget. */
async function withAbortableTimeout(params) {
	const signal = params.signal;
	if (signal?.aborted) throw resolveAbortError(signal);
	let removeAbortListener;
	const operation = signal ? Promise.race([params.promise, new Promise((_, reject) => {
		const onAbort = () => reject(resolveAbortError(signal));
		signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
	})]) : params.promise;
	try {
		return await withTimeout(operation, params.timeoutMs, params.timeoutMessage, params.createTimeoutError);
	} finally {
		removeAbortListener?.();
	}
}
//#endregion
//#region extensions/codex/src/app-server/client-runtime.ts
/** Client-scoped Codex auth and account observers. */
/** Match Codex's native grace window without retaining inactive conversations indefinitely. */
const CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS = 30 * 6e4;
/** Native-child parents are active ownership, so only otherwise-idle threads count against this cap. */
const CODEX_APP_SERVER_LIVE_THREAD_MAX_IDLE = 64;
/** Return a deterministic error before Codex cancels its ten-second external-auth request. */
const CODEX_EXTERNAL_AUTH_REFRESH_TIMEOUT_MS = 9e3;
const configuredClients = /* @__PURE__ */ new WeakMap();
const physicalThreadReleases = /* @__PURE__ */ new WeakMap();
const claimedThreadReleaseTokens = /* @__PURE__ */ new WeakMap();
/** Only an initialized, still-open physical client can own retained native subscriptions. */
function isCodexAppServerClientRuntimeLive(client) {
	const runtime = configuredClients.get(client);
	return runtime !== void 0 && !runtime.closed;
}
/** Installs one auth-refresh handler and one rate-limit observer per physical client. */
function ensureCodexAppServerClientRuntime(client, context) {
	const existing = configuredClients.get(client);
	if (existing) {
		if (existing.closed) return;
		existing.context = {
			...existing.context,
			config: context.config
		};
		return;
	}
	const runtime = {
		context,
		closed: false,
		retainedThreads: /* @__PURE__ */ new Map(),
		claimedThreads: /* @__PURE__ */ new Map(),
		releasingThreads: /* @__PURE__ */ new Map(),
		protectedThreads: /* @__PURE__ */ new Map()
	};
	configuredClients.set(client, runtime);
	client.addCloseHandler(() => {
		runtime.closed = true;
		if (runtime.evictionTimer) {
			clearTimeout(runtime.evictionTimer);
			runtime.evictionTimer = void 0;
		}
		runtime.retainedThreads.clear();
		runtime.claimedThreads.clear();
		runtime.protectedThreads.clear();
	});
	client.addRequestHandler(async (request) => {
		if (request.method !== "account/chatgptAuthTokens/refresh") return;
		if (runtime.context.authMode === "prepared-api-key") throw new Error("ChatGPT token refresh is unavailable for prepared Codex API-key auth.");
		const previousAccountId = isJsonObject(request.params) && typeof request.params.previousAccountId === "string" ? request.params.previousAccountId.trim() || void 0 : void 0;
		const tokens = await withTimeout(refreshCodexAppServerAuthTokens({
			agentDir: runtime.context.agentDir,
			authProfileId: runtime.context.authProfileId,
			...previousAccountId ? { previousAccountId } : {},
			...runtime.context.authProfileStore ? { authProfileStore: runtime.context.authProfileStore } : {},
			config: runtime.context.config
		}), CODEX_EXTERNAL_AUTH_REFRESH_TIMEOUT_MS, "Codex app-server ChatGPT token refresh timed out before its external-auth deadline");
		if (previousAccountId && tokens.chatgptAccountId !== previousAccountId) throw new Error("ChatGPT workspace changed during Codex token refresh.");
		return { ...tokens };
	});
	client.addNotificationHandler((notification) => {
		if (notification.method === "account/rateLimits/updated") {
			mergeCodexRateLimitsUpdate(client, notification.params);
			return;
		}
		if (notification.method === "thread/archived" || notification.method === "thread/deleted" || notification.method === "thread/closed") {
			const threadId = notification.params?.threadId;
			if (typeof threadId === "string") {
				const releasing = runtime.releasingThreads.get(threadId);
				if (releasing) releasing.invalidated = true;
				runtime.retainedThreads.delete(threadId);
				runtime.claimedThreads.delete(threadId);
				scheduleRetainedThreadEviction(client, runtime);
			}
		}
	});
}
function scheduleRetainedThreadEviction(client, runtime) {
	if (runtime.evictionTimer) {
		clearTimeout(runtime.evictionTimer);
		runtime.evictionTimer = void 0;
	}
	if (runtime.closed) return;
	let expiresAt = Number.POSITIVE_INFINITY;
	for (const [threadId, thread] of runtime.retainedThreads) if (!runtime.protectedThreads.has(threadId)) expiresAt = Math.min(expiresAt, thread.expiresAt);
	if (!Number.isFinite(expiresAt)) return;
	runtime.evictionTimer = setTimeout(() => {
		runtime.evictionTimer = void 0;
		evictExpiredRetainedThreads(client, runtime).catch((error) => {
			log.warn("codex retained thread expiry failed", { reason: formatErrorMessage(error) });
		});
	}, Math.max(0, expiresAt - Date.now()));
	runtime.evictionTimer.unref?.();
}
async function releaseRetainedThread(client, runtime, threadId, assertCurrent) {
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		assertCurrent?.();
		return false;
	}
	const retained = runtime.retainedThreads.get(threadId);
	if (!retained) return false;
	const olderThreadIds = /* @__PURE__ */ new Set();
	for (const candidateThreadId of runtime.retainedThreads.keys()) {
		if (candidateThreadId === threadId) break;
		olderThreadIds.add(candidateThreadId);
	}
	runtime.retainedThreads.delete(threadId);
	scheduleRetainedThreadEviction(client, runtime);
	const transition = { completion: Promise.resolve().then(() => {
		assertCurrent?.();
		return assertCurrent ? retained.release(threadId, assertCurrent) : retained.release(threadId);
	}) };
	runtime.releasingThreads.set(threadId, transition);
	try {
		await transition.completion;
		return true;
	} catch (error) {
		if (!runtime.closed && !transition.invalidated && runtime.releasingThreads.get(threadId) === transition && !runtime.retainedThreads.has(threadId) && !runtime.claimedThreads.has(threadId)) {
			retained.expiresAt = Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS;
			const newerThreads = [...runtime.retainedThreads.entries()].filter(([candidateThreadId]) => !olderThreadIds.has(candidateThreadId));
			for (const [candidateThreadId] of newerThreads) runtime.retainedThreads.delete(candidateThreadId);
			runtime.retainedThreads.set(threadId, retained);
			for (const [candidateThreadId, newerThread] of newerThreads) runtime.retainedThreads.set(candidateThreadId, newerThread);
		}
		throw error;
	} finally {
		if (runtime.releasingThreads.get(threadId) === transition) runtime.releasingThreads.delete(threadId);
		scheduleRetainedThreadEviction(client, runtime);
	}
}
async function evictExpiredRetainedThreads(client, runtime) {
	const now = Date.now();
	for (const [threadId, thread] of runtime.retainedThreads) if (thread.expiresAt <= now && !runtime.protectedThreads.has(threadId)) await releaseRetainedThread(client, runtime, threadId);
	scheduleRetainedThreadEviction(client, runtime);
}
async function evictExcessIdleThreads(client, runtime) {
	let idleThreadIds = [...runtime.retainedThreads.keys()].filter((threadId) => !runtime.protectedThreads.has(threadId));
	while (idleThreadIds.length > CODEX_APP_SERVER_LIVE_THREAD_MAX_IDLE) {
		await releaseRetainedThread(client, runtime, idleThreadIds[0]);
		idleThreadIds = [...runtime.retainedThreads.keys()].filter((threadId) => !runtime.protectedThreads.has(threadId));
	}
}
/** Retain separately owned Codex subscriptions; completing B must never cold-restart A. */
async function retainCodexAppServerLiveThread(client, threadId, releaseThread, configFingerprint, serviceTier) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed) return false;
	const claimed = runtime.claimedThreads.get(threadId);
	if (claimed !== void 0 && (releaseThread === void 0 || claimedThreadReleaseTokens.get(releaseThread) !== claimed)) return false;
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		return false;
	}
	runtime.retainedThreads.delete(threadId);
	const retained = {
		configFingerprint,
		serviceTier,
		expiresAt: Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS,
		release: (releaseThread ? physicalThreadReleases.get(releaseThread) ?? releaseThread : void 0) ?? (async (releasedThreadId, assertCurrent) => {
			await unsubscribeCodexAppServerLiveThread(client, releasedThreadId, 5e3, assertCurrent);
		})
	};
	runtime.retainedThreads.set(threadId, retained);
	try {
		await evictExcessIdleThreads(client, runtime);
	} catch (error) {
		if (runtime.retainedThreads.get(threadId) === retained) runtime.retainedThreads.delete(threadId);
		scheduleRetainedThreadEviction(client, runtime);
		log.warn("codex retained thread capacity eviction failed", {
			threadId,
			reason: formatErrorMessage(error)
		});
		return false;
	}
	if (runtime.closed) return false;
	if (claimed !== void 0 && runtime.claimedThreads.get(threadId) === claimed) runtime.claimedThreads.delete(threadId);
	scheduleRetainedThreadEviction(client, runtime);
	return true;
}
/** Transfer one idle subscription to its next turn or compaction without touching sibling threads. */
async function consumeCodexAppServerLiveThread(client, threadId, configFingerprint) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed) return;
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		return;
	}
	const retained = runtime.retainedThreads.get(threadId);
	if (!retained || configFingerprint !== void 0 && retained.configFingerprint !== configFingerprint) return;
	return claimCodexAppServerThreadOwnership(client, runtime, threadId, retained);
}
/** Claims an observed Codex auto-subscription without exposing a temporarily idle owner. */
async function claimCodexAppServerLiveThread(client, threadId) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed || runtime.claimedThreads.has(threadId)) return;
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		return;
	}
	return claimCodexAppServerThreadOwnership(client, runtime, threadId, runtime.retainedThreads.get(threadId) ?? {
		expiresAt: Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS,
		release: async (releasedThreadId, assertCurrent) => {
			await unsubscribeCodexAppServerLiveThread(client, releasedThreadId, 5e3, assertCurrent);
		}
	});
}
function claimCodexAppServerThreadOwnership(client, runtime, threadId, retained) {
	runtime.retainedThreads.delete(threadId);
	const claimed = Symbol(threadId);
	runtime.claimedThreads.set(threadId, claimed);
	scheduleRetainedThreadEviction(client, runtime);
	const release = async (releasedThreadId, assertCurrent) => {
		if (releasedThreadId !== threadId || runtime.claimedThreads.get(threadId) !== claimed) return;
		const pendingRelease = runtime.releasingThreads.get(threadId);
		if (pendingRelease) {
			await pendingRelease.completion;
			return;
		}
		const transition = { completion: Promise.resolve().then(async () => {
			if (runtime.closed || runtime.claimedThreads.get(threadId) !== claimed) return;
			assertCurrent?.();
			await (assertCurrent ? retained.release(releasedThreadId, assertCurrent) : retained.release(releasedThreadId));
		}) };
		runtime.releasingThreads.set(threadId, transition);
		try {
			await transition.completion;
			if (runtime.claimedThreads.get(threadId) === claimed) runtime.claimedThreads.delete(threadId);
		} finally {
			if (runtime.releasingThreads.get(threadId) === transition) runtime.releasingThreads.delete(threadId);
		}
	};
	physicalThreadReleases.set(release, retained.release);
	claimedThreadReleaseTokens.set(release, claimed);
	return {
		configFingerprint: retained.configFingerprint,
		serviceTier: retained.serviceTier,
		release
	};
}
/** Distinguish active claimed ownership from an already-evicted idle subscription. */
function hasCodexAppServerLiveThread(client, threadId) {
	const runtime = configuredClients.get(client);
	return runtime !== void 0 && !runtime.closed && (runtime.retainedThreads.has(threadId) || runtime.releasingThreads.has(threadId) || runtime.claimedThreads.has(threadId));
}
function isCodexAppServerLiveThreadClaimed(client, threadId) {
	const runtime = configuredClients.get(client);
	return runtime !== void 0 && !runtime.closed && runtime.claimedThreads.has(threadId);
}
/** Release the exact physical subscription and finish only its observed ownership generation. */
async function unsubscribeCodexAppServerLiveThread(client, threadId, timeoutMs, assertCurrent) {
	const runtime = configuredClients.get(client);
	const claimed = runtime?.claimedThreads.get(threadId);
	const retained = runtime?.retainedThreads.get(threadId);
	let transition = runtime?.releasingThreads.get(threadId);
	if (transition?.physicalRelease) {
		await transition.physicalRelease;
		assertCurrent?.();
		return;
	}
	const physicalRelease = Promise.resolve().then(async () => {
		if (claimed !== void 0 && runtime?.claimedThreads.get(threadId) !== claimed || retained !== void 0 && runtime?.retainedThreads.get(threadId) !== retained) return;
		assertCurrent?.();
		await client.request("thread/unsubscribe", { threadId }, {
			timeoutMs,
			assertCurrent
		});
	});
	const ownsTransition = runtime !== void 0 && transition === void 0;
	if (transition) transition.physicalRelease = physicalRelease;
	else if (runtime) {
		transition = {
			completion: physicalRelease,
			physicalRelease
		};
		runtime.releasingThreads.set(threadId, transition);
	}
	try {
		await physicalRelease;
		if (retained !== void 0 && runtime?.retainedThreads.get(threadId) === retained) {
			runtime.retainedThreads.delete(threadId);
			scheduleRetainedThreadEviction(client, runtime);
		}
		if (claimed !== void 0 && runtime?.claimedThreads.get(threadId) === claimed) runtime.claimedThreads.delete(threadId);
	} finally {
		if (ownsTransition && runtime.releasingThreads.get(threadId) === transition) runtime.releasingThreads.delete(threadId);
	}
}
/** Reset/end owns the exact thread; failed generation retirement must never release its successor. */
async function releaseCodexAppServerLiveThread(client, threadId, assertCurrent) {
	const runtime = configuredClients.get(client);
	return runtime ? await releaseRetainedThread(client, runtime, threadId, assertCurrent) : false;
}
/** Native child work pins its parent's subscription even after the foreground parent turn ends. */
function protectCodexAppServerLiveThread(client, threadId) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed) return () => void 0;
	runtime.protectedThreads.set(threadId, (runtime.protectedThreads.get(threadId) ?? 0) + 1);
	scheduleRetainedThreadEviction(client, runtime);
	let protectedThread = true;
	return () => {
		if (!protectedThread) return;
		protectedThread = false;
		if (runtime.closed) return;
		const count = runtime.protectedThreads.get(threadId) ?? 0;
		if (count <= 1) {
			runtime.protectedThreads.delete(threadId);
			const retained = runtime.retainedThreads.get(threadId);
			if (retained) {
				retained.expiresAt = Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS;
				runtime.retainedThreads.delete(threadId);
				runtime.retainedThreads.set(threadId, retained);
			}
		} else runtime.protectedThreads.set(threadId, count - 1);
		scheduleRetainedThreadEviction(client, runtime);
		evictExcessIdleThreads(client, runtime).catch((error) => {
			log.warn("codex retained thread unpin eviction failed", {
				threadId,
				reason: formatErrorMessage(error)
			});
		});
	};
}
//#endregion
//#region extensions/codex/src/app-server/elicitation-response.ts
function createCodexElicitationResponse(action, content = null, meta = null) {
	return {
		action,
		content,
		_meta: meta
	};
}
//#endregion
//#region extensions/codex/src/app-server/rpc-error.ts
/** RPC error wrapper that preserves app-server error code and data. */
var CodexAppServerRpcError = class extends Error {
	constructor(error, method) {
		super(formatCodexAppServerRpcErrorMessage(error, method));
		this.name = "CodexAppServerRpcError";
		this.code = error.code;
		this.data = error.data;
		this.method = method;
	}
};
function formatCodexAppServerRpcErrorMessage(error, method) {
	const message = error.message || `${method} failed`;
	const detail = readCodexAppServerRpcReloginDetail(error.data);
	return detail && !message.includes(detail) ? `${message}: ${detail}` : message;
}
function readCodexAppServerRpcReloginDetail(data) {
	const record = isJsonObject(data) ? data : void 0;
	const nested = isJsonObject(record?.error) ? record.error : record;
	if (!nested) return;
	const isRelogin = nested.action === "relogin" || nested.reason === "cloudRequirements" && nested.errorCode === "Auth";
	const detail = typeof nested.detail === "string" ? nested.detail.trim() : "";
	return isRelogin && detail ? detail : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/transport-websocket.ts
/**
* Adapts a remote Codex app-server WebSocket endpoint to the shared stdio-like
* transport interface.
*/
const WEBSOCKET_HANDSHAKE_TIMEOUT_MS = 1e4;
const WEBSOCKET_PING_INTERVAL_MS = 2e4;
const WEBSOCKET_PONG_TIMEOUT_MS = 2e4;
const MAX_CONSECUTIVE_MISSED_WEBSOCKET_PONGS = 5;
/** Opens a WebSocket app-server transport and maps newline-delimited frames to stdout/stdin. */
function createWebSocketTransport(options) {
	if (!options.url) throw new Error("codex app-server websocket transport requires plugins.entries.codex.config.appServer.url");
	const events = new EventEmitter();
	const stdout = new PassThrough();
	const stderr = new PassThrough();
	const websocketOptions = {
		headers: {
			...options.headers,
			...options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}
		},
		perMessageDeflate: false,
		...options.transport === "websocket" ? { handshakeTimeout: WEBSOCKET_HANDSHAKE_TIMEOUT_MS } : {}
	};
	const unixSocketPath = resolveCodexAppServerUnixSocketPath(options);
	const socket = unixSocketPath ? new WebSocket$1("ws://localhost/", {
		...websocketOptions,
		createConnection: () => connectCodexAppServerUnixSocket(unixSocketPath)
	}) : new WebSocket$1(options.url, websocketOptions);
	const pendingFrames = [];
	const stdinDecoder = new StringDecoder("utf8");
	let pendingLine = "";
	let killed = false;
	let pingTimeout;
	let pongTimeout;
	let expectedPong;
	let consecutiveMissedPongs = 0;
	let heartbeatSequence = 0;
	const clearConnectionHealthTimers = () => {
		if (pingTimeout) {
			clearTimeout(pingTimeout);
			pingTimeout = void 0;
		}
		if (pongTimeout) {
			clearTimeout(pongTimeout);
			pongTimeout = void 0;
		}
		expectedPong = void 0;
	};
	const sendHeartbeatPing = () => {
		if (socket.readyState !== WebSocket$1.OPEN || pongTimeout) return;
		const payload = Buffer.from(`openclaw-codex-${++heartbeatSequence}`);
		expectedPong = payload;
		pongTimeout = setTimeout(() => {
			pongTimeout = void 0;
			expectedPong = void 0;
			consecutiveMissedPongs += 1;
			if (consecutiveMissedPongs >= MAX_CONSECUTIVE_MISSED_WEBSOCKET_PONGS) {
				socket.terminate();
				return;
			}
			sendHeartbeatPing();
		}, WEBSOCKET_PONG_TIMEOUT_MS);
		pongTimeout.unref();
		socket.ping(payload, void 0, (error) => {
			if (error) socket.terminate();
		});
	};
	const scheduleHeartbeatPing = () => {
		if (options.transport !== "websocket" || socket.readyState !== WebSocket$1.OPEN || pingTimeout || pongTimeout) return;
		pingTimeout = setTimeout(() => {
			pingTimeout = void 0;
			sendHeartbeatPing();
		}, WEBSOCKET_PING_INTERVAL_MS);
		pingTimeout.unref();
	};
	const recordConnectionActivity = () => {
		consecutiveMissedPongs = 0;
		if (pongTimeout) {
			clearTimeout(pongTimeout);
			pongTimeout = void 0;
		}
		expectedPong = void 0;
		scheduleHeartbeatPing();
	};
	const sendFrame = (frame) => {
		const trimmed = frame.trim();
		if (!trimmed) return;
		if (socket.readyState === WebSocket$1.OPEN) {
			socket.send(trimmed);
			return;
		}
		pendingFrames.push(trimmed);
	};
	socket.once("open", () => {
		for (const frame of pendingFrames.splice(0)) socket.send(frame);
		scheduleHeartbeatPing();
	});
	socket.on("pong", (payload) => {
		if (expectedPong?.equals(payload)) recordConnectionActivity();
	});
	socket.once("error", (error) => {
		clearConnectionHealthTimers();
		events.emit("error", error);
	});
	socket.once("close", (code, reason) => {
		clearConnectionHealthTimers();
		killed = true;
		events.emit("exit", code, reason.toString("utf8"));
	});
	socket.on("message", (data) => {
		if (options.transport === "websocket") recordConnectionActivity();
		const text = websocketFrameToText(data);
		stdout.write(text.endsWith("\n") ? text : `${text}\n`);
	});
	const stdin = new Writable({
		write(chunk, _encoding, callback) {
			pendingLine += stdinDecoder.write(chunk);
			const lines = pendingLine.split("\n");
			pendingLine = lines.pop() ?? "";
			for (const frame of lines) sendFrame(frame);
			callback();
		},
		final(callback) {
			pendingLine += stdinDecoder.end();
			if (pendingLine) sendFrame(pendingLine);
			pendingLine = "";
			callback();
		}
	});
	const closeSocket = () => {
		if (socket.readyState === WebSocket$1.CLOSED || socket.readyState === WebSocket$1.CLOSING) return;
		socket.close();
	};
	stdin.once("finish", closeSocket);
	stdin.once("close", closeSocket);
	return {
		stdin,
		stdout,
		stderr,
		get killed() {
			return killed;
		},
		kill: () => {
			killed = true;
			clearConnectionHealthTimers();
			socket.close();
		},
		once: (event, listener) => events.once(event, listener)
	};
}
/** Opens the owner-scoped Codex control socket used by the WebSocket upgrade. */
function connectCodexAppServerUnixSocket(socketPath) {
	return net.createConnection(socketPath);
}
/** Resolves the canonical or explicitly configured Codex control socket. */
function resolveCodexAppServerUnixSocketPath(options) {
	if (options.transport !== "unix") {
		if (options.url?.startsWith("unix://")) throw new Error("codex app-server unix URL requires unix transport");
		return;
	}
	const url = options.url ?? "unix://";
	if (!url.startsWith("unix://")) throw new Error("codex app-server unix transport requires a unix:// URL");
	return url.slice(7) || path.join(resolveCodexAppServerUserHomeDir(options.env ?? process.env), "app-server-control", "app-server-control.sock");
}
function websocketFrameToText(data) {
	if (typeof data === "string") return data;
	if (Buffer.isBuffer(data)) return data.toString("utf8");
	if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
	return Buffer.from(data).toString("utf8");
}
//#endregion
//#region extensions/codex/src/app-server/client.ts
/**
* JSON-RPC client for Codex app-server transports, including request/response
* routing, notification fanout, server request handlers, and version checks.
*/
const CODEX_APP_SERVER_PARSE_LOG_MAX = 500;
const CODEX_APP_SERVER_PARSE_BUFFER_MAX = 8 * 1024 * 1024;
const CODEX_APP_SERVER_PARSE_BUFFER_MAX_LINES = 1e3;
const CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS = 66e4;
const CODEX_APP_SERVER_STDERR_TAIL_MAX = 2e3;
const CODEX_APP_SERVER_OVERLOADED_ERROR_CODE = -32001;
const CODEX_APP_SERVER_OVERLOAD_MAX_RETRIES = 3;
const CODEX_APP_SERVER_OVERLOAD_RETRY_BASE_MS = 50;
const CODEX_APP_SERVER_PENDING_STARTUP_WARNINGS_MAX = 32;
const CODEX_APP_SERVER_CLIENT_INSTANCE_IDS = /* @__PURE__ */ new WeakMap();
const UNPAIRED_SURROGATE_RE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
/** Process-local generation fence for bindings tied to one app-server client instance. */
function getCodexAppServerClientInstanceId(client) {
	const current = CODEX_APP_SERVER_CLIENT_INSTANCE_IDS.get(client);
	if (current) return current;
	const created = randomUUID();
	CODEX_APP_SERVER_CLIENT_INSTANCE_IDS.set(client, created);
	return created;
}
function resolveCodexAppServerClientInstanceId(client) {
	return client.getInstanceId?.call(client) ?? getCodexAppServerClientInstanceId(client);
}
/** Codex rejects this exact code before enqueueing, including mutating requests. */
function isCodexAppServerOverloadError(error) {
	return error instanceof CodexAppServerRpcError && error.code === CODEX_APP_SERVER_OVERLOADED_ERROR_CODE;
}
var CodexAppServerLocalRequestCancellationError = class extends Error {
	constructor(method, reason, mayHaveWritten) {
		super(`${method} ${reason}`);
		this.reason = reason;
		this.mayHaveWritten = mayHaveWritten;
		this.code = "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED";
		this.name = "CodexAppServerLocalRequestCancellationError";
	}
};
function isCodexAppServerRequestTimeoutError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && "reason" in error && error.reason === "timed out";
}
function isCodexAppServerBrokenPipeError(error) {
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		if ("code" in current && current.code === "EPIPE") return true;
		current = "cause" in current ? current.cause : void 0;
	}
	return false;
}
var CodexAppServerIndeterminateTransportError = class extends Error {
	constructor(method, cause) {
		super(`${method} transport failed after request write: ${cause.message}`, { cause });
		this.code = "CODEX_APP_SERVER_REQUEST_TRANSPORT_INDETERMINATE";
		this.mayHaveWritten = true;
		this.name = "CodexAppServerIndeterminateTransportError";
	}
};
/** True when a local cancellation can leave an app-server request in flight. */
function isCodexAppServerIndeterminateRequestCancellationError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && "mayHaveWritten" in error && error.mayHaveWritten === true;
}
/** True when local cancellation happened before a request write was attempted. */
function isCodexAppServerPrewriteRequestCancellationError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && "mayHaveWritten" in error && error.mayHaveWritten === false;
}
/** True when transport failure cannot prove a written request stopped running. */
function isCodexAppServerIndeterminateTransportError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_REQUEST_TRANSPORT_INDETERMINATE" && "mayHaveWritten" in error && error.mayHaveWritten === true;
}
/** Returns true for errors that mean the app-server transport is closed. */
function isCodexAppServerConnectionClosedError(error) {
	if (!(error instanceof Error)) return false;
	if (isCodexAppServerIndeterminateTransportError(error)) return true;
	return error.message === "codex app-server client is closed" || error.message.startsWith("codex app-server exited:");
}
/** Stateful app-server JSON-RPC client over stdio or websocket transport. */
var CodexAppServerClient = class CodexAppServerClient {
	constructor(child) {
		this.instanceId = randomUUID();
		this.pending = /* @__PURE__ */ new Map();
		this.requestHandlers = /* @__PURE__ */ new Set();
		this.notificationHandlers = /* @__PURE__ */ new Set();
		this.pendingStartupWarnings = [];
		this.closeHandlers = /* @__PURE__ */ new Set();
		this.nextId = 1;
		this.initialized = false;
		this.closed = false;
		this.transportExited = false;
		this.stderrTail = "";
		this.child = child;
		this.lines = createInterface({ input: child.stdout });
		this.lines.on("line", (line) => this.handleLine(line));
		this.lines.on("error", (error) => this.closeWithError(toStringifiedError(error)));
		child.stdout.on("error", (error) => this.closeWithError(toStringifiedError(error)));
		child.stderr.setEncoding("utf8");
		child.stderr.on("data", (text) => {
			this.stderrTail = appendBoundedTail(this.stderrTail, text, CODEX_APP_SERVER_STDERR_TAIL_MAX);
			const trimmed = text.trim();
			if (trimmed) log.debug(`codex app-server stderr: ${trimmed}`);
		});
		child.stderr.on("error", (error) => {
			log.warn("codex app-server stderr stream failed", { error });
		});
		child.once("error", (error) => this.closeWithError(toStringifiedError(error)));
		child.once("exit", (code, signal) => {
			this.transportExited = true;
			this.closeWithError(buildCodexAppServerExitError(code, signal, this.stderrTail));
		});
		child.stdin.on?.("error", (error) => this.closeWithError(toStringifiedError(error)));
	}
	/** Starts a new app-server client using resolved runtime start options. */
	static start(options) {
		const defaults = resolveCodexAppServerRuntimeOptions().start;
		const startOptions = {
			...defaults,
			...options,
			headers: options?.headers ?? defaults.headers
		};
		if (startOptions.transport === "stdio" && startOptions.commandSource === "managed") throw new Error("Managed Codex app-server start options must be resolved before spawn.");
		if (startOptions.transport === "websocket" || startOptions.transport === "unix") return new CodexAppServerClient(createWebSocketTransport(startOptions));
		return new CodexAppServerClient(createStdioTransport(startOptions));
	}
	/** Builds a client around a fake transport for tests. */
	static fromTransportForTests(child) {
		return new CodexAppServerClient(child);
	}
	/** Performs the app-server initialize handshake and validates protocol version. */
	async initialize() {
		if (this.initialized) return;
		const response = await this.request("initialize", {
			clientInfo: {
				name: "openclaw",
				title: "OpenClaw",
				version: VERSION
			},
			capabilities: {
				experimentalApi: true,
				extensions: {
					"openai/standard-form-input": {},
					"openai/form": {},
					"io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] }
				}
			}
		});
		this.serverVersion = assertSupportedCodexAppServerVersion(response);
		this.runtimeIdentity = buildCodexAppServerRuntimeIdentity(response, this.serverVersion);
		this.notify("initialized");
		this.initialized = true;
	}
	/** Returns the version detected during initialize. */
	getServerVersion() {
		return this.serverVersion;
	}
	/** Returns runtime metadata detected during initialize. */
	getRuntimeIdentity() {
		return this.runtimeIdentity ? { ...this.runtimeIdentity } : void 0;
	}
	/** Returns a bounded, redacted stderr diagnostic from the app-server process. */
	getStderrDiagnostic() {
		return redactCodexAppServerLinePreview(this.stderrTail) || void 0;
	}
	/** Returns the terminal transport error that closed this physical client. */
	getCloseError() {
		return this.closeError;
	}
	/** Stable generation id for this exact physical client instance. */
	getInstanceId() {
		return this.instanceId;
	}
	/** Installs the spawn-owner check run before config-loading thread requests. */
	setThreadSessionRequestGuard(guard) {
		this.threadSessionRequestGuard = guard;
	}
	/** Returns the local transport PID for scoped child-process cleanup, when available. */
	getTransportPid() {
		return this.child.pid;
	}
	request(method, params, optionsInput) {
		const options = optionsInput ?? {};
		if (this.closed) return Promise.reject(this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed"));
		if (options.signal?.aborted) return Promise.reject(new CodexAppServerLocalRequestCancellationError(method, "aborted", false));
		const guard = method === "thread/start" || method === "thread/resume" || method === "thread/fork" ? this.threadSessionRequestGuard : void 0;
		if (guard) {
			if (!options.signal && !(options.timeoutMs !== void 0 && Number.isFinite(options.timeoutMs) && options.timeoutMs > 0)) return Promise.reject(/* @__PURE__ */ new TypeError(`${method} requires a positive finite timeout or abort signal`));
			return (async () => {
				const guardStartedAt = Date.now();
				const timeoutMessage = `${method} timed out`;
				const abortMessage = `${method} aborted`;
				let releaseGuard;
				try {
					releaseGuard = await guard({
						signal: options.signal,
						timeoutMs: options.timeoutMs,
						timeoutMessage,
						abortMessage
					});
				} catch (error) {
					if (error instanceof Error && error.message === timeoutMessage) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
					if (error instanceof Error && error.message === abortMessage) throw new CodexAppServerLocalRequestCancellationError(method, "aborted", false);
					throw error;
				}
				let released = false;
				const release = () => {
					if (released) return;
					released = true;
					releaseGuard();
				};
				let releaseWhenRequestSettles = true;
				let requestMayHaveWritten = false;
				try {
					const elapsedMs = Date.now() - guardStartedAt;
					const remainingTimeoutMs = options.timeoutMs === void 0 ? void 0 : options.timeoutMs - elapsedMs;
					if (remainingTimeoutMs !== void 0 && remainingTimeoutMs <= 0) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
					return await this.requestWithOverloadRetry(method, params, {
						...options,
						...remainingTimeoutMs !== void 0 ? { timeoutMs: remainingTimeoutMs } : {}
					}, (mayHaveWritten) => {
						requestMayHaveWritten = mayHaveWritten;
					});
				} catch (error) {
					if (requestMayHaveWritten && !(error instanceof CodexAppServerRpcError)) {
						releaseWhenRequestSettles = false;
						await this.closeAndRunAfterExit(release, method);
					}
					throw error;
				} finally {
					if (releaseWhenRequestSettles) release();
				}
			})();
		}
		return this.requestWithOverloadRetry(method, params, options);
	}
	async requestWithOverloadRetry(method, params, options, onWriteStateChange) {
		const deadline = options.timeoutMs !== void 0 && Number.isFinite(options.timeoutMs) ? Date.now() + options.timeoutMs : void 0;
		for (let retry = 0;; retry += 1) {
			if (options.signal?.aborted) throw new CodexAppServerLocalRequestCancellationError(method, "aborted", false);
			const remainingTimeoutMs = deadline === void 0 ? void 0 : deadline - Date.now();
			if (remainingTimeoutMs !== void 0 && remainingTimeoutMs <= 0) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
			try {
				return await this.requestOnce(method, params, {
					...options,
					...remainingTimeoutMs !== void 0 ? { timeoutMs: remainingTimeoutMs } : {}
				}, onWriteStateChange);
			} catch (error) {
				if (!isCodexAppServerOverloadError(error) || retry >= CODEX_APP_SERVER_OVERLOAD_MAX_RETRIES) throw error;
				onWriteStateChange?.(false);
				const backoffMs = Math.round(CODEX_APP_SERVER_OVERLOAD_RETRY_BASE_MS * 2 ** retry * (.75 + Math.random() * .5));
				await this.waitForOverloadRetry(method, backoffMs, deadline, options.signal);
			}
		}
	}
	async waitForOverloadRetry(method, backoffMs, deadline, signal) {
		if (signal?.aborted) throw new CodexAppServerLocalRequestCancellationError(method, "aborted", false);
		const remainingMs = deadline === void 0 ? void 0 : deadline - Date.now();
		if (remainingMs !== void 0 && remainingMs <= 0) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
		const delayMs = remainingMs === void 0 ? backoffMs : Math.min(backoffMs, remainingMs);
		await new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				cleanup();
				resolve();
			}, delayMs);
			timer.unref?.();
			const abortListener = () => {
				cleanup();
				reject(new CodexAppServerLocalRequestCancellationError(method, "aborted", false));
			};
			const cleanup = () => {
				clearTimeout(timer);
				signal?.removeEventListener("abort", abortListener);
			};
			signal?.addEventListener("abort", abortListener, { once: true });
			if (signal?.aborted) abortListener();
		});
	}
	requestOnce(method, params, options, onWriteStateChange) {
		if (this.closed) return Promise.reject(this.closeError ?? /* @__PURE__ */ new Error("codex app-server client is closed"));
		if (options.signal?.aborted) return Promise.reject(new CodexAppServerLocalRequestCancellationError(method, "aborted", false));
		const id = this.nextId++;
		const message = {
			id,
			method,
			params
		};
		return new Promise((resolve, reject) => {
			let timeout;
			let cleanupAbort;
			let mayHaveWritten = false;
			const cleanup = () => {
				if (timeout) {
					clearTimeout(timeout);
					timeout = void 0;
				}
				cleanupAbort?.();
				cleanupAbort = void 0;
			};
			const rejectPending = (error) => {
				if (!this.pending.has(id)) return;
				this.pending.delete(id);
				cleanup();
				reject(mayHaveWritten && !(error instanceof CodexAppServerRpcError) && !isCodexAppServerIndeterminateRequestCancellationError(error) && !isCodexAppServerIndeterminateTransportError(error) ? new CodexAppServerIndeterminateTransportError(method, error) : error);
			};
			if (options.timeoutMs && Number.isFinite(options.timeoutMs) && options.timeoutMs > 0) {
				timeout = setTimeout(() => rejectPending(new CodexAppServerLocalRequestCancellationError(method, "timed out", mayHaveWritten)), Math.max(100, options.timeoutMs));
				timeout.unref?.();
			}
			if (options.signal) {
				const abortListener = () => rejectPending(new CodexAppServerLocalRequestCancellationError(method, "aborted", mayHaveWritten));
				options.signal.addEventListener("abort", abortListener, { once: true });
				cleanupAbort = () => options.signal?.removeEventListener("abort", abortListener);
			}
			this.pending.set(id, {
				method,
				resolve: (value) => {
					cleanup();
					resolve(value);
				},
				reject: (error) => {
					cleanup();
					reject(mayHaveWritten && !(error instanceof CodexAppServerRpcError) && !isCodexAppServerIndeterminateRequestCancellationError(error) && !isCodexAppServerIndeterminateTransportError(error) ? new CodexAppServerIndeterminateTransportError(method, error) : error);
				},
				cleanup
			});
			if (options.signal?.aborted) {
				rejectPending(new CodexAppServerLocalRequestCancellationError(method, "aborted", false));
				return;
			}
			try {
				options.assertCurrent?.();
				mayHaveWritten = true;
				onWriteStateChange?.(true);
				this.writeMessage(message, (error) => rejectPending(error));
			} catch (error) {
				rejectPending(toStringifiedError(error));
			}
		});
	}
	/** Sends a fire-and-forget JSON-RPC notification to the app-server. */
	notify(method, params) {
		this.writeMessage({
			method,
			params
		});
	}
	/** Registers a handler for app-server requests sent back to OpenClaw. */
	addRequestHandler(handler) {
		this.requestHandlers.add(handler);
		return () => this.requestHandlers.delete(handler);
	}
	/** Registers a notification handler and returns its disposer. */
	addNotificationHandler(handler) {
		this.notificationHandlers.add(handler);
		for (const notification of this.pendingStartupWarnings.splice(0)) this.handleNotification(notification);
		return () => this.notificationHandlers.delete(handler);
	}
	/** Registers a close handler and returns its disposer. */
	addCloseHandler(handler) {
		this.closeHandlers.add(handler);
		return () => this.closeHandlers.delete(handler);
	}
	/** Registers a handler for physical transport exit and returns its disposer. */
	addTransportExitHandler(handler) {
		if (this.transportExited) {
			handler(this);
			return () => void 0;
		}
		const onExit = () => handler(this);
		this.child.once("exit", onExit);
		return () => this.child.off?.("exit", onExit);
	}
	/** Closes the transport without waiting for process/socket shutdown. */
	close() {
		if (!this.markClosed(/* @__PURE__ */ new Error("codex app-server client is closed"))) return;
		closeCodexAppServerTransport(this.child);
	}
	/** Closes the transport and waits for shutdown according to transport policy. */
	async closeAndWait(options) {
		this.markClosed(/* @__PURE__ */ new Error("codex app-server client is closed"));
		return await closeCodexAppServerTransportAndWait(this.child, options);
	}
	/** Closes this transport and runs cleanup only after physical process exit. */
	async closeAndRunAfterExit(onExit, operation) {
		let settled = false;
		const runOnExit = () => {
			if (settled) return;
			settled = true;
			onExit();
		};
		if (this.transportExited) {
			runOnExit();
			return;
		}
		this.child.once("exit", runOnExit);
		try {
			if (await this.closeAndWait()) {
				this.child.off?.("exit", runOnExit);
				runOnExit();
			}
		} catch (closeError) {
			log.warn("codex app-server shutdown after indeterminate request failed", {
				closeError,
				operation
			});
		}
	}
	writeMessage(message, onError) {
		if (this.closed) return;
		const id = "id" in message ? message.id : void 0;
		const method = "method" in message ? message.method : void 0;
		this.child.stdin.write(`${stringifyCodexAppServerMessage(message)}\n`, (error) => {
			if (error) {
				log.warn("codex app-server write failed", {
					error,
					id,
					method
				});
				onError?.(error);
			}
		});
	}
	handleLine(line) {
		const rawLine = line.endsWith("\r") ? line.slice(0, -1) : line;
		if (this.pendingParse) {
			this.handlePendingParseLine(rawLine);
			return;
		}
		const trimmed = rawLine.trim();
		if (!trimmed) return;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch (error) {
			if (shouldBufferCodexAppServerParseFailure(trimmed, error)) {
				this.pendingParse = {
					text: trimmed,
					lineCount: 1,
					firstError: error
				};
				return;
			}
			logCodexAppServerParseFailure(trimmed, error, 1);
			return;
		}
		this.handleParsedMessage(parsed);
	}
	handlePendingParseLine(line) {
		const pending = this.pendingParse;
		if (!pending) return;
		const candidate = `${pending.text}\\n${line}`;
		let parsed;
		try {
			parsed = JSON.parse(candidate);
		} catch (error) {
			const lineCount = pending.lineCount + 1;
			if (shouldBufferCodexAppServerParseFailure(candidate.trim(), error) && candidate.length <= CODEX_APP_SERVER_PARSE_BUFFER_MAX && lineCount <= CODEX_APP_SERVER_PARSE_BUFFER_MAX_LINES) {
				this.pendingParse = {
					text: candidate,
					lineCount,
					firstError: pending.firstError
				};
				return;
			}
			this.pendingParse = void 0;
			logCodexAppServerParseFailure(candidate, error, lineCount);
			return;
		}
		this.pendingParse = void 0;
		this.handleParsedMessage(parsed);
	}
	handleParsedMessage(parsed) {
		if (!parsed || typeof parsed !== "object") return;
		const message = parsed;
		if (isRpcResponse(message)) {
			this.handleResponse(message);
			return;
		}
		if (!("method" in message)) return;
		if ("id" in message && message.id !== void 0) {
			this.handleServerRequest({
				id: message.id,
				method: message.method,
				params: message.params
			});
			return;
		}
		this.handleNotification({
			method: message.method,
			params: message.params
		});
	}
	handleResponse(response) {
		const pending = this.pending.get(response.id);
		if (!pending) return;
		this.pending.delete(response.id);
		if (response.error) {
			pending.reject(new CodexAppServerRpcError(response.error, pending.method));
			return;
		}
		pending.resolve(response.result);
	}
	async handleServerRequest(request) {
		try {
			const result = await this.runServerRequestHandlers(request);
			if (result !== void 0) {
				this.writeMessage({
					id: request.id,
					result
				});
				return;
			}
			this.writeMessage({
				id: request.id,
				result: defaultServerRequestResponse(request)
			});
		} catch (error) {
			const message = coerceErrorMessage(error);
			log.warn("codex app-server server request handler failed", {
				id: request.id,
				method: request.method,
				error
			});
			this.writeMessage({
				id: request.id,
				error: {
					code: -32603,
					message
				}
			});
		}
	}
	async runServerRequestHandlers(request) {
		const controller = new AbortController();
		const timeoutResponse = timeoutServerRequestResponse(request);
		if (!timeoutResponse) return await this.runServerRequestHandlersWithoutTimeout(request, controller.signal);
		let timeout;
		try {
			return await Promise.race([this.runServerRequestHandlersWithoutTimeout(request, controller.signal), new Promise((resolve) => {
				timeout = setTimeout(() => {
					log.warn("codex app-server server request timed out", {
						id: request.id,
						method: request.method,
						timeoutMs: CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS
					});
					controller.abort(/* @__PURE__ */ new Error("codex app-server server request timed out"));
					resolve(timeoutResponse);
				}, CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS);
				timeout.unref?.();
			})]);
		} finally {
			if (timeout) clearTimeout(timeout);
		}
	}
	async runServerRequestHandlersWithoutTimeout(request, signal) {
		for (const handler of this.requestHandlers) {
			if (signal.aborted) return;
			const result = await handler(request, signal);
			if (result !== void 0) return result;
		}
	}
	handleNotification(notification) {
		if (this.notificationHandlers.size === 0 && notification.method === "configWarning") {
			if (this.pendingStartupWarnings.length === CODEX_APP_SERVER_PENDING_STARTUP_WARNINGS_MAX) this.pendingStartupWarnings.shift();
			this.pendingStartupWarnings.push(notification);
			return;
		}
		for (const handler of this.notificationHandlers) try {
			Promise.resolve(handler(notification)).catch((error) => {
				log.warn("codex app-server notification handler failed", { error });
			});
		} catch (error) {
			log.warn("codex app-server notification handler failed", { error });
		}
	}
	closeWithError(error) {
		if (this.markClosed(error)) closeCodexAppServerTransport(this.child);
	}
	markClosed(error) {
		if (this.closed) return false;
		this.closed = true;
		this.closeError = error;
		this.lines.close();
		this.rejectPendingRequests(error);
		return true;
	}
	rejectPendingRequests(error) {
		for (const pending of this.pending.values()) {
			pending.cleanup();
			pending.reject(error);
		}
		this.pending.clear();
		for (const handler of this.closeHandlers) handler(this);
	}
};
function defaultServerRequestResponse(request) {
	if (request.method === "item/tool/call") return {
		contentItems: [{
			type: "inputText",
			text: "OpenClaw did not register a handler for this app-server tool call."
		}],
		success: false
	};
	if (request.method === "item/commandExecution/requestApproval" || request.method === "item/fileChange/requestApproval") return { decision: "decline" };
	if (request.method === "item/permissions/requestApproval") return {
		permissions: {},
		scope: "turn"
	};
	if (request.method === "item/tool/requestUserInput") return { answers: {} };
	if (request.method === "mcpServer/elicitation/request") return createCodexElicitationResponse("decline", null, { message: "OpenClaw has no interactive handler for this elicitation." });
	return {};
}
function stringifyCodexAppServerMessage(message) {
	return JSON.stringify(message, (_key, value) => typeof value === "string" ? value.replace(UNPAIRED_SURROGATE_RE, "") : value) ?? "null";
}
function timeoutServerRequestResponse(request) {
	if (request.method !== "item/tool/call") return;
	return {
		contentItems: [{
			type: "inputText",
			text: `OpenClaw dynamic tool call timed out after ${CODEX_DYNAMIC_TOOL_SERVER_REQUEST_TIMEOUT_MS}ms before sending a response to Codex.`
		}],
		success: false
	};
}
/** Raised when the initialize handshake detects an unsupported app-server version. */
var CodexAppServerVersionError = class extends Error {
	constructor(detectedVersion) {
		const detected = detectedVersion ? `detected ${detectedVersion}` : "OpenClaw could not determine the running Codex version";
		super(`Codex app-server ${MIN_SUPPORTED_CODEX_APP_SERVER_VERSION} or newer is required, but ${detected}. Update the configured Codex app-server binary, or remove custom command overrides to use the managed binary.`);
		this.name = "CodexAppServerVersionError";
		this.detectedVersion = detectedVersion;
	}
};
function assertSupportedCodexAppServerVersion(response) {
	const detectedVersion = readCodexVersionFromUserAgent(response.userAgent);
	if (!detectedVersion) throw new CodexAppServerVersionError(detectedVersion);
	const detected = parse$1(detectedVersion);
	if (!detected || detected.compare("0.149.0") < 0) throw new CodexAppServerVersionError(detectedVersion);
	if (detected.compare("0.150.1") > 0) log.warn("codex app-server is newer than OpenClaw's managed runtime; continuing with normal startup validation", {
		detectedVersion,
		validatedVersion: CODEX_APP_SERVER_VERSION
	});
	return detectedVersion;
}
function isUnsupportedCodexAppServerVersionError(error) {
	return error instanceof CodexAppServerVersionError;
}
function buildCodexAppServerRuntimeIdentity(response, serverVersion) {
	const userAgent = normalizeOptionalString(response.userAgent);
	const codexHome = normalizeOptionalString(response.codexHome);
	const platformFamily = normalizeOptionalString(response.platformFamily);
	const platformOs = normalizeOptionalString(response.platformOs);
	return {
		serverVersion,
		...userAgent ? { userAgent } : {},
		...codexHome ? { codexHome } : {},
		...platformFamily ? { platformFamily } : {},
		...platformOs ? { platformOs } : {}
	};
}
/** Extracts the Codex version from the app-server initialize user-agent field. */
function readCodexVersionFromUserAgent(userAgent) {
	return (userAgent?.match(/^[^/]+\/(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)(?:[\s(]|$)/))?.[1];
}
function redactCodexAppServerLinePreview(value) {
	const redacted = value.replace(/\s+/g, " ").trim().replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+/gi, "$1<redacted>").replace(/("(?:api_?key|authorization|token|access_token|refresh_token)"\s*:\s*")([^"]+)(")/gi, "$1<redacted>$3").replace(/\b([a-z0-9_]*(?:api_?key|authorization|access_token|refresh_token|token))(\s*=\s*)(["']?)[^\s"']+(\3)/gi, "$1$2$3<redacted>$4");
	return redacted.length > CODEX_APP_SERVER_PARSE_LOG_MAX ? `${truncateUtf16Safe(redacted, CODEX_APP_SERVER_PARSE_LOG_MAX)}...` : redacted;
}
function appendBoundedTail(current, next, maxLength) {
	const combined = `${current}${next}`;
	return combined.length > maxLength ? sliceUtf16Safe(combined, -maxLength) : combined;
}
function buildCodexAppServerExitError(code, signal, stderrTail) {
	const stderrPreview = redactCodexAppServerLinePreview(stderrTail);
	const suffix = stderrPreview ? ` stderr=${JSON.stringify(stderrPreview)}` : "";
	return /* @__PURE__ */ new Error(`codex app-server exited: code=${formatExitValue(code)} signal=${formatExitValue(signal)}${suffix}`);
}
function shouldBufferCodexAppServerParseFailure(value, error) {
	if (!value.startsWith("{") && !value.startsWith("[")) return false;
	const message = coerceErrorMessage(error);
	return message.includes("Unterminated string") || message.includes("Unexpected end of JSON input");
}
function logCodexAppServerParseFailure(value, error, fragmentCount) {
	const linePreview = redactCodexAppServerLinePreview(value);
	const suffix = fragmentCount > 1 ? ` fragments=${fragmentCount}` : "";
	log.warn("failed to parse codex app-server message", {
		error,
		errorMessage: coerceErrorMessage(error),
		fragmentCount,
		linePreview,
		consoleMessage: `failed to parse codex app-server message${suffix}: preview=${JSON.stringify(linePreview)}`
	});
}
const CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS = /* @__PURE__ */ new Set([
	"item/commandExecution/requestApproval",
	"item/fileChange/requestApproval",
	"item/permissions/requestApproval"
]);
/** Returns true for app-server approval request methods OpenClaw can answer. */
function isCodexAppServerApprovalRequest(method) {
	return CODEX_APP_SERVER_APPROVAL_REQUEST_METHODS.has(method);
}
function formatExitValue(value) {
	if (value === null || value === void 0) return "null";
	if (typeof value === "string" || typeof value === "number") return String(value);
	return "unknown";
}
//#endregion
//#region extensions/codex/src/app-server/attempt-timeouts.ts
/**
* Timeout defaults and normalizers for Codex app-server startup and turn
* liveness watches.
*/
/** Minimum startup timeout accepted by the Codex app-server harness. */
const CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS = 100;
/** Default idle timeout while waiting for app-server turn completion. */
const CODEX_TURN_COMPLETION_IDLE_TIMEOUT_MS = 6e4;
/** Short guard after apparent assistant completion. */
const CODEX_TURN_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS = 1e4;
const CODEX_POST_TOOL_RAW_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS = 5 * 6e4;
/** Guard after reasoning/commentary progress when no tool handoff occurred. */
const CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS = 5 * 6e4;
/** Long terminal idle watch for app-server turns that never send completion. */
const CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS = 30 * 6e4;
var CodexAppServerStartupError = class extends Error {
	constructor(reason, message = reason === "timed_out" ? "codex app-server startup timed out" : "codex app-server startup aborted") {
		super(message);
		this.reason = reason;
		this.code = "CODEX_APP_SERVER_STARTUP_CANCELLED";
		this.name = "CodexAppServerStartupError";
	}
};
function isCodexAppServerStartupError(error, reason) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_STARTUP_CANCELLED" && "reason" in error && (error.reason === "aborted" || error.reason === "timed_out") && (reason === void 0 || error.reason === reason);
}
function resolvePositiveIntegerTimeoutMs(value, fallbackMs) {
	return resolveTimerTimeoutMs(value, resolveTimerTimeoutMs(fallbackMs, 1));
}
/** Runs startup work with abort and timeout handling plus optional cleanup. */
async function withCodexStartupTimeout(params) {
	if (params.signal.aborted) throw new CodexAppServerStartupError("aborted");
	let timeout;
	let abortCleanup;
	let timeoutError;
	let timeoutCleanup;
	try {
		return await Promise.race([params.operation(), new Promise((_, reject) => {
			const rejectOnce = (error) => {
				if (timeout) {
					clearTimeout(timeout);
					timeout = void 0;
				}
				reject(error);
			};
			timeout = setTimeout(() => {
				timeoutError = new CodexAppServerStartupError("timed_out");
				timeoutCleanup = Promise.resolve(params.onTimeout?.()).then(() => void 0, () => void 0);
				timeoutCleanup.finally(() => {
					rejectOnce(timeoutError);
				});
			}, params.timeoutMs);
			const abortListener = () => rejectOnce(new CodexAppServerStartupError("aborted"));
			params.signal.addEventListener("abort", abortListener, { once: true });
			abortCleanup = () => params.signal.removeEventListener("abort", abortListener);
		})]);
	} catch (error) {
		if (timeoutError) {
			await timeoutCleanup;
			throw timeoutError;
		}
		throw error;
	} finally {
		if (timeout) clearTimeout(timeout);
		abortCleanup?.();
	}
}
/** Resolves startup timeout while honoring the configured floor. */
function resolveCodexStartupTimeoutMs(params) {
	const timeoutFloorMs = resolvePositiveIntegerTimeoutMs(params.timeoutFloorMs, CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS);
	const timeoutMs = resolvePositiveIntegerTimeoutMs(params.timeoutMs, timeoutFloorMs);
	return Math.max(timeoutFloorMs, timeoutMs);
}
/** Resolves the completion-idle timeout for an active turn. */
function resolveCodexTurnCompletionIdleTimeoutMs(value) {
	return resolvePositiveIntegerTimeoutMs(value, CODEX_TURN_COMPLETION_IDLE_TIMEOUT_MS);
}
/** Resolves the short assistant-completion release timeout. */
function resolveCodexTurnAssistantCompletionIdleTimeoutMs(value) {
	return resolvePositiveIntegerTimeoutMs(value, CODEX_TURN_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS);
}
/** Resolves the conservative post-tool raw assistant guard timeout. */
function resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs(value, fallbackMs) {
	return resolvePositiveIntegerTimeoutMs(value, Math.max(resolvePositiveIntegerTimeoutMs(void 0, fallbackMs), CODEX_POST_TOOL_RAW_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS));
}
/** Resolves the long terminal turn idle timeout. */
function resolveCodexTurnTerminalIdleTimeoutMs(value, runTimeoutOverrideMs) {
	const explicitRunBudgetMs = resolvePositiveIntegerTimeoutMs(runTimeoutOverrideMs, CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS);
	return resolvePositiveIntegerTimeoutMs(value, Math.max(CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS, explicitRunBudgetMs));
}
/** Adds gateway grace time to a caller timeout without overflowing invalid values. */
function resolveCodexGatewayTimeoutWithGraceMs(timeoutMs, graceMs = 1e4) {
	const timeout = resolvePositiveIntegerTimeoutMs(timeoutMs, 1);
	return addTimerTimeoutGraceMs(timeout, resolveTimerTimeoutMs(graceMs, 0, 0)) ?? timeout;
}
//#endregion
//#region extensions/codex/src/app-server/desktop-generation-fingerprint.ts
const MAX_COMPUTER_USE_PLUGIN_TREE_ENTRIES = 4096;
/** Fingerprints every desktop candidate that can own a managed fallback artifact. */
async function readMacOSDesktopGenerationFingerprint(candidates = resolveMacOSDesktopCodexAppPathCandidates("darwin")) {
	const entries = [];
	for (const candidate of candidates) {
		const command = await statFingerprint(candidate.appServerCommandPath);
		entries.push(`candidate:${candidate.appName}:${candidate.appServerCommandPath}:${command}`);
		for (const artifactPath of resolveMacOSDesktopGenerationPaths(candidate)) entries.push(`${artifactPath}\0${await statFingerprint(artifactPath)}`);
		const pluginRoot = resolveComputerUsePluginRoot(candidate);
		entries.push(`${pluginRoot}\0${await directoryTreeFingerprint(pluginRoot)}`);
	}
	return createHash("sha256").update(entries.join("\0")).digest("hex");
}
function resolveMacOSDesktopGenerationPaths(candidate) {
	return [
		candidate.appBundlePath,
		path.join(candidate.bundledMarketplacePath, ".agents", "plugins", "marketplace.json"),
		...candidate.computerUseServiceAppPaths.flatMap((servicePath) => [
			servicePath,
			path.join(servicePath, "Contents", "Info.plist"),
			path.join(servicePath, "Contents", "SharedSupport", "SkyComputerUseClient.app", "Contents", "MacOS", "SkyComputerUseClient")
		])
	];
}
function resolveComputerUsePluginRoot(candidate) {
	return path.join(candidate.bundledMarketplacePath, "plugins", "computer-use");
}
/** Stable roots that cover bundle replacement and recursive artifact updates. */
function resolveMacOSDesktopGenerationWatchPaths(candidates = resolveMacOSDesktopCodexAppPathCandidates("darwin")) {
	const watched = /* @__PURE__ */ new Set(["/Applications"]);
	for (const candidate of candidates) watched.add(candidate.appBundlePath);
	return [...watched];
}
async function directoryTreeFingerprint(root) {
	let rootStat;
	try {
		rootStat = await fs$1.lstat(root, { bigint: true });
	} catch (error) {
		if (isNodeError(error, "ENOENT") || isNodeError(error, "ENOTDIR")) return "missing";
		throw error;
	}
	if (!rootStat.isDirectory()) return statFingerprint(root);
	let entryCount = 0;
	const hash = createHash("sha256");
	hash.update("openclaw-codex-computer-use-plugin-tree-v1\0");
	const visit = async (directory, relativeDirectory, before) => {
		hash.update(`directory\0${relativeDirectory}\0${statTuple(before)}\0`);
		const entries = (await fs$1.readdir(directory, { withFileTypes: true })).toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
		for (const entry of entries) {
			entryCount += 1;
			if (entryCount > MAX_COMPUTER_USE_PLUGIN_TREE_ENTRIES) throw new Error("Codex Computer Use plugin exceeds the bounded tree size");
			const entryPath = path.join(directory, entry.name);
			const relativePath = path.join(relativeDirectory, entry.name);
			const entryStat = await fs$1.lstat(entryPath, { bigint: true });
			if (entryStat.isDirectory()) await visit(entryPath, relativePath, entryStat);
			else hash.update(`entry\0${relativePath}\0${await statFingerprint(entryPath)}\0`);
		}
		if (!sameStat(before, await fs$1.lstat(directory, { bigint: true }))) throw new Error(`Codex desktop artifact changed while fingerprinting: ${directory}`);
	};
	await visit(root, ".", rootStat);
	return hash.digest("hex");
}
async function statFingerprint(filePath) {
	try {
		const entry = await fs$1.lstat(filePath, { bigint: true });
		const type = entry.isSymbolicLink() ? "link" : entry.isDirectory() ? "directory" : entry.isFile() ? "file" : "other";
		const own = statTuple(entry);
		if (!entry.isSymbolicLink()) return `${type}:${own}:${entry.isFile() ? await readFileFingerprint(filePath, entry, false) : ""}`;
		const [link, realPath, target] = await Promise.all([
			fs$1.readlink(filePath),
			fs$1.realpath(filePath),
			fs$1.stat(filePath, { bigint: true })
		]);
		const content = target.isFile() ? await readFileFingerprint(filePath, target, true) : "";
		return `${type}:${own}:${link}:${realPath}:${statTuple(target)}:${content}`;
	} catch (error) {
		if (isNodeError(error, "ENOENT") || isNodeError(error, "ENOTDIR")) return "missing";
		throw error;
	}
}
async function readFileFingerprint(filePath, expected, followsSymlink) {
	const noFollow = followsSymlink ? 0 : constants.O_NOFOLLOW ?? 0;
	const handle = await fs$1.open(filePath, constants.O_RDONLY | noFollow);
	try {
		const before = await handle.stat({ bigint: true });
		if (!sameStat(before, expected)) throw new Error(`Codex desktop artifact changed while fingerprinting: ${filePath}`);
		const hash = createHash("sha256");
		for await (const chunk of handle.createReadStream({ autoClose: false })) hash.update(chunk);
		if (!sameStat(before, await handle.stat({ bigint: true }))) throw new Error(`Codex desktop artifact changed while fingerprinting: ${filePath}`);
		return hash.digest("hex");
	} finally {
		await handle.close();
	}
}
function sameStat(left, right) {
	return statTuple(left) === statTuple(right);
}
function statTuple(stat) {
	return [
		stat.dev,
		stat.ino,
		stat.mode,
		stat.size,
		stat.mtimeNs,
		stat.ctimeNs
	].join(":");
}
function isNodeError(error, code) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
}
//#endregion
//#region extensions/codex/src/app-server/desktop-generation-owner.ts
const SETTLE_DELAY_MS = 1e3;
/** Coalesces filesystem invalidations into one stable desktop generation. */
function createCodexDesktopGenerationOwner(params) {
	let generation = params.initialGeneration;
	let invalidation = 0;
	let dirty = false;
	let refresh;
	let stopped = false;
	const markDirty = () => {
		invalidation += 1;
		dirty = true;
	};
	const reconcile = () => {
		if (refresh) return refresh;
		refresh = (async () => {
			for (;;) {
				if (stopped) throw new Error("Codex desktop generation owner stopped");
				const observedInvalidation = invalidation;
				const first = await params.readFingerprint();
				await delay(SETTLE_DELAY_MS);
				if (stopped) throw new Error("Codex desktop generation owner stopped");
				const second = await params.readFingerprint();
				if (stopped) throw new Error("Codex desktop generation owner stopped");
				if (observedInvalidation !== invalidation || first !== second) continue;
				const previous = generation;
				generation = previous?.fingerprint === second ? previous : {
					epoch: (previous?.epoch ?? 0) + 1,
					fingerprint: second
				};
				dirty = false;
				if (previous && generation !== previous) params.onGenerationChange?.(generation);
				return generation;
			}
		})().finally(() => {
			refresh = void 0;
		});
		return refresh;
	};
	return {
		read: () => generation,
		markDirty,
		wait: () => dirty ? reconcile() : Promise.resolve(generation),
		refresh: () => {
			markDirty();
			return reconcile();
		},
		isCurrent: (candidate) => Boolean(candidate && !dirty && generation && candidate.epoch === generation.epoch && candidate.fingerprint === generation.fingerprint),
		stop: () => {
			stopped = true;
		}
	};
}
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
//#endregion
//#region extensions/codex/src/app-server/desktop-generation.ts
/** Lifecycle-owned generation for managed macOS Codex desktop artifacts. */
const APPLICATIONS_PATH = "/Applications";
const REARM_INITIAL_DELAY_MS = 100;
const REARM_MAX_DELAY_MS = 3e4;
const DESKTOP_GENERATION_STATE = Symbol.for("openclaw.codexDesktopGenerationState");
function state() {
	const globalState = globalThis;
	return globalState[DESKTOP_GENERATION_STATE] ??= {};
}
function waitForCodexDesktopGeneration() {
	return state().owner?.wait() ?? Promise.resolve(void 0);
}
function isCodexDesktopGenerationCurrent(generation) {
	return state().owner?.isCurrent(generation) ?? false;
}
function createCodexDesktopGenerationService(params, runtime = {
	platform: process.platform,
	readFingerprint: readMacOSDesktopGenerationFingerprint,
	resolveWatchPaths: resolveMacOSDesktopGenerationWatchPaths,
	pathExists: existsSync,
	watchPath: (watchedPath, options, listener) => watch(watchedPath, options, listener)
}) {
	return {
		id: "codex-desktop-generation",
		async start(ctx) {
			if (runtime.platform !== "darwin") return;
			const current = state();
			current.context = ctx;
			current.readFingerprint = runtime.readFingerprint;
			current.resolveWatchPaths = runtime.resolveWatchPaths;
			current.pathExists = runtime.pathExists;
			current.watchPath = runtime.watchPath;
			current.owner = createCodexDesktopGenerationOwner({
				readFingerprint: current.readFingerprint,
				onGenerationChange: params.onGenerationChange,
				initialGeneration: current.lastGeneration
			});
			armWatchers(current);
			refreshGeneration(current, current.owner, current.owner.refresh());
		},
		async stop() {
			const current = state();
			current.lastGeneration = current.owner?.read() ?? current.lastGeneration;
			current.owner?.stop();
			current.owner = void 0;
			current.armEpoch = (current.armEpoch ?? 0) + 1;
			current.context = void 0;
			current.readFingerprint = void 0;
			current.resolveWatchPaths = void 0;
			current.pathExists = void 0;
			current.watchPath = void 0;
			current.watchHealthy = void 0;
			current.rearmDelayMs = void 0;
			if (current.rearmTimer) {
				clearTimeout(current.rearmTimer);
				current.rearmTimer = void 0;
			}
			closeWatchers(current);
		}
	};
}
function armWatchers(current) {
	const owner = current.owner;
	if (!owner || current.watchers) return false;
	const armEpoch = (current.armEpoch ?? 0) + 1;
	current.armEpoch = armEpoch;
	const watchers = /* @__PURE__ */ new Set();
	current.watchers = watchers;
	const candidateNames = new Set(resolveMacOSDesktopCodexAppPathCandidates("darwin").map((candidate) => candidate.appName));
	let complete = true;
	for (const watchedPath of current.resolveWatchPaths?.() ?? []) {
		if (!current.pathExists?.(watchedPath)) continue;
		try {
			const watcher = current.watchPath?.(watchedPath, { recursive: watchedPath !== APPLICATIONS_PATH }, (_eventType, filename) => {
				if (!isCurrentArm(current, owner, watchers, armEpoch)) return;
				if (watchedPath === APPLICATIONS_PATH && filename && !candidateNames.has(filename.toString().split(path.sep)[0] ?? "")) return;
				owner.markDirty();
				scheduleRearm(current, owner);
			});
			if (!watcher) {
				complete = false;
				reportWatcherFailure(current, owner, /* @__PURE__ */ new Error(`Could not watch ${watchedPath}`));
				scheduleRearm(current, owner);
				continue;
			}
			watchers.add(watcher);
			watcher.on("error", (error) => {
				if (!isCurrentArm(current, owner, watchers, armEpoch)) return;
				reportWatcherFailure(current, owner, error);
				scheduleRearm(current, owner);
			});
		} catch (error) {
			complete = false;
			reportWatcherFailure(current, owner, error);
			scheduleRearm(current, owner);
		}
	}
	current.watchHealthy = complete;
	if (complete) current.rearmDelayMs = REARM_INITIAL_DELAY_MS;
	return complete;
}
function reportWatcherFailure(current, owner, error) {
	if (current.watchHealthy === false) return;
	current.watchHealthy = false;
	owner.markDirty();
	current.context?.serviceHealth?.reportFailure(error);
	current.context?.logger.warn(`codex desktop generation watcher failed: ${String(error)}`);
}
function isCurrentArm(current, owner, watchers, armEpoch) {
	return current.owner === owner && current.watchers === watchers && current.armEpoch === armEpoch;
}
function scheduleRearm(current, owner) {
	if (current.rearmTimer) {
		if (current.watchHealthy === false) return;
		clearTimeout(current.rearmTimer);
	}
	const delayMs = current.watchHealthy === false ? current.rearmDelayMs ?? REARM_INITIAL_DELAY_MS : REARM_INITIAL_DELAY_MS;
	if (current.watchHealthy === false) current.rearmDelayMs = Math.min(delayMs * 2, REARM_MAX_DELAY_MS);
	current.rearmTimer = setTimeout(() => {
		current.rearmTimer = void 0;
		if (current.owner !== owner) return;
		const wasUnhealthy = current.watchHealthy === false;
		closeWatchers(current);
		if (!armWatchers(current) || wasUnhealthy) owner.markDirty();
		refreshGeneration(current, owner, owner.wait());
	}, delayMs);
	current.rearmTimer.unref();
}
function logRefreshFailure(current, owner) {
	return (error) => {
		if (current.owner !== owner) return;
		current.context?.serviceHealth?.reportFailure(error);
		current.context?.logger.warn(`codex desktop generation refresh failed: ${String(error)}`);
	};
}
function refreshGeneration(current, owner, refresh) {
	refresh.then(() => {
		if (current.owner === owner && current.watchHealthy) current.context?.serviceHealth?.clearFailure();
	}).catch(logRefreshFailure(current, owner));
}
function closeWatchers(current) {
	const watchers = current.watchers;
	current.watchers = void 0;
	for (const watcher of watchers ?? []) watcher.close();
}
//#endregion
//#region extensions/codex/src/app-server/native-config-fence.ts
const CODEX_NATIVE_CONFIG_FENCE_STATE = Symbol.for("openclaw.codexNativeConfigFenceState");
function getFenceState() {
	const globalState = globalThis;
	globalState[CODEX_NATIVE_CONFIG_FENCE_STATE] ??= /* @__PURE__ */ new Map();
	return globalState[CODEX_NATIVE_CONFIG_FENCE_STATE];
}
/** Acquires the per-CODEX_HOME fence and returns an idempotent release. */
async function acquireCodexNativeConfigFence(key, options = {}) {
	const state = getFenceState();
	const previous = state.get(key) ?? Promise.resolve();
	let resolveCurrent = () => void 0;
	const current = new Promise((resolve) => {
		resolveCurrent = resolve;
	});
	state.set(key, current);
	try {
		await waitForPreviousFence(previous, options);
	} catch (error) {
		previous.then(() => {
			resolveCurrent();
			if (state.get(key) === current) state.delete(key);
		});
		throw error;
	}
	let released = false;
	return () => {
		if (released) return;
		released = true;
		resolveCurrent();
		if (state.get(key) === current) state.delete(key);
	};
}
async function waitForPreviousFence(previous, options) {
	if (options.signal?.aborted) throw new Error(options.abortMessage ?? "Codex native config fence aborted");
	if (options.timeoutMs === void 0 && !options.signal) {
		await previous;
		return;
	}
	await new Promise((resolve, reject) => {
		let timeout;
		const cleanup = () => {
			if (timeout) {
				clearTimeout(timeout);
				timeout = void 0;
			}
			options.signal?.removeEventListener("abort", onAbort);
		};
		const settle = (run) => {
			cleanup();
			run();
		};
		const onAbort = () => settle(() => reject(new Error(options.abortMessage ?? "Codex native config fence aborted")));
		previous.then(() => settle(resolve));
		if (options.signal) options.signal.addEventListener("abort", onAbort, { once: true });
		if (options.timeoutMs !== void 0) {
			timeout = setTimeout(() => settle(() => reject(new Error(options.timeoutMessage ?? "Codex native config fence timed out"))), Math.max(1, options.timeoutMs));
			timeout.unref?.();
		}
	});
}
//#endregion
//#region extensions/codex/src/app-server/thread-lifecycle-errors.ts
var CodexThreadStartRequestError = class extends Error {
	constructor(cause) {
		super(`thread/start: ${formatErrorMessage(cause)}`, { cause });
		this.name = "CodexThreadStartRequestError";
	}
};
var CodexThreadBindingConflictError = class extends Error {
	constructor(threadId, operation) {
		super(`Codex thread binding changed while ${operation}: ${threadId}`);
		this.name = "CodexThreadBindingConflictError";
	}
};
var CodexRestrictedToolSurfaceAttestationError = class extends Error {
	constructor(cause) {
		super("Codex restricted-tool-surface MCP attestation failed", { cause });
		this.name = "CodexRestrictedToolSurfaceAttestationError";
	}
};
var CodexThreadBindingConflictAfterCleanupError = class extends CodexThreadBindingConflictError {};
var CodexAdoptedThreadActiveError = class extends Error {
	constructor() {
		super("Codex session became active in another runner; wait for it to finish before continuing");
		this.name = "CodexAdoptedThreadActiveError";
	}
};
//#endregion
//#region extensions/codex/src/app-server/shared-client.ts
/**
* Owns shared and isolated Codex app-server client startup, auth application,
* lease tracking, and teardown.
*/
const CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE = "codex app-server initialize timed out";
const SHARED_CODEX_APP_SERVER_CLIENT_STATE = Symbol.for("openclaw.codexAppServerClientState");
const SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER = Symbol.for("openclaw.codexAppServerClientDisposer");
const CODEX_APP_SERVER_CLIENT_START_METADATA = Symbol.for("openclaw.codexAppServerClientStartMetadata");
function getSharedCodexAppServerClientState() {
	const globalState = globalThis;
	globalState[SHARED_CODEX_APP_SERVER_CLIENT_STATE] ??= {
		clients: /* @__PURE__ */ new Map(),
		liveClients: /* @__PURE__ */ new Set(),
		isolatedClients: /* @__PURE__ */ new Set(),
		entriesByClient: /* @__PURE__ */ new WeakMap(),
		leasedReleases: /* @__PURE__ */ new WeakMap(),
		desktopGenerationDrainChecks: /* @__PURE__ */ new Set()
	};
	return globalState[SHARED_CODEX_APP_SERVER_CLIENT_STATE];
}
function getCodexAppServerClientStartMetadata() {
	const globalState = globalThis;
	globalState[CODEX_APP_SERVER_CLIENT_START_METADATA] ??= /* @__PURE__ */ new WeakMap();
	return globalState[CODEX_APP_SERVER_CLIENT_START_METADATA];
}
/** Reads the exact successful spawn selection plus its initialized runtime identity. */
function readCodexAppServerClientProcessIdentity(client) {
	const metadata = getCodexAppServerClientStartMetadata().get(client);
	if (!metadata) return;
	const runtimeIdentity = client.getRuntimeIdentity();
	return {
		clientId: client.getInstanceId(),
		...resolveCodexAppServerSpawnIdentity(metadata.startOptions, metadata.nativeCommand),
		...runtimeIdentity?.serverVersion ? { serverVersion: runtimeIdentity.serverVersion } : {},
		...runtimeIdentity?.userAgent ? { userAgent: runtimeIdentity.userAgent } : {}
	};
}
/** Returns the lifecycle fingerprint that owns a managed desktop client. */
function readCodexAppServerClientDesktopGenerationFingerprint(client) {
	return readCodexAppServerClientDesktopGeneration(client)?.fingerprint;
}
/** Returns the lifecycle generation that owns a managed desktop client. */
function readCodexAppServerClientDesktopGeneration(client) {
	return getCodexAppServerClientStartMetadata().get(client)?.desktopGeneration;
}
/** Waits until older physical desktop clients for this client's Codex home exit. */
async function waitForCodexAppServerClientDesktopGenerationDrain(params) {
	const metadata = getCodexAppServerClientStartMetadata().get(params.client);
	if (!metadata?.desktopGeneration) return;
	const drain = createOlderDesktopGenerationDrainWait({
		generation: metadata.desktopGeneration,
		startOptions: metadata.startOptions,
		agentDir: metadata.agentDir
	});
	try {
		await withCodexAppServerAcquireDeadline(params.timeoutMs ?? 0, drain.promise, params.signal, "Codex Computer Use install timed out waiting for older desktop clients");
	} finally {
		drain.cancel();
	}
}
/** Resolves non-secret spawn identity before startup; argv is represented only by its hash. */
function resolveCodexAppServerSpawnIdentity(startOptions, resolvedNativeCommand) {
	const nativeCommand = resolvedNativeCommand ?? (startOptions.commandSource === "resolved-managed" ? resolveManagedCodexNativeCommand(startOptions.command) : void 0);
	return {
		command: startOptions.command,
		argsFingerprint: createHash("sha256").update(JSON.stringify(startOptions.args)).digest("hex"),
		...startOptions.commandSource ? { commandSource: startOptions.commandSource } : {},
		...startOptions.managedCommandOrder ? { managedCommandOrder: startOptions.managedCommandOrder } : {},
		...nativeCommand ? { nativeCommand } : {}
	};
}
var CodexAppServerStartSelectionChangedError = class extends Error {
	constructor() {
		super("Codex app-server managed executable selection changed during startup");
		this.code = "CODEX_APP_SERVER_START_SELECTION_CHANGED";
		this.name = "CodexAppServerStartSelectionChangedError";
	}
};
/** Cross-bundle-safe check for a managed executable selection retry. */
function isCodexAppServerStartSelectionChangedError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_START_SELECTION_CHANGED";
}
/**
* Rechecks mutable Codex-owned plugin state immediately before thread start/resume.
* The synchronous check prevents another gateway task from installing Computer
* Use between the check and the JSON-RPC write on the same event loop turn.
*/
function assertCodexAppServerClientStartSelectionCurrent(params) {
	const metadata = getCodexAppServerClientStartMetadata().get(params.client);
	if (!metadata) return;
	if (metadata.desktopGeneration && !isCodexDesktopGenerationCurrent(metadata.desktopGeneration)) throw new CodexAppServerStartSelectionChangedError();
	const requestedStartOptions = params.startOptions ?? metadata.requestedStartOptions;
	if (requestedStartOptions.commandSource !== "managed") return;
	const current = resolveCodexAppServerStartOptionsForAgent({
		startOptions: requestedStartOptions,
		agentDir: params.agentDir ?? metadata.agentDir
	});
	if ((metadata.startOptions.managedCommandOrder ?? "package-first") !== (current.managedCommandOrder ?? "package-first")) throw new CodexAppServerStartSelectionChangedError();
}
/** Resolves the per-CODEX_HOME key used to serialize native config loading. */
function resolveCodexNativeConfigFenceKey(params) {
	const metadata = params.client ? getCodexAppServerClientStartMetadata().get(params.client) : void 0;
	const startOptions = metadata?.startOptions ?? params.startOptions;
	if (!startOptions || startOptions.transport !== "stdio") return;
	const configuredHome = startOptions.env?.CODEX_HOME?.trim();
	const agentDir = params.agentDir ?? metadata?.agentDir ?? resolveDefaultAgentDir(params.config ?? {});
	const codexHome = configuredHome ? configuredHome : startOptions.homeScope === "user" ? resolveCodexAppServerUserHomeDir() : agentDir ? resolveCodexAppServerHomeDir(agentDir) : void 0;
	return codexHome ? `codex-home:${path.resolve(codexHome)}` : void 0;
}
function inferAuthRequirement(preparedAuth) {
	if (preparedAuth?.kind === "api-key") return "api-key";
	return preparedAuth?.kind === "profile" ? "subscription" : void 0;
}
async function resolveCodexAppServerClientStartContext(options) {
	const agentDir = options?.agentDir ?? resolveDefaultAgentDir(options?.config ?? {});
	const requestedStartOptions = options?.startOptions ?? resolveCodexAppServerRuntimeOptions().start;
	const desktopGeneration = shouldTrackDesktopGeneration(requestedStartOptions, options?.pluginConfig) ? await waitForCodexDesktopGeneration() : void 0;
	const preparedAuth = options?.preparedAuth;
	const preparedApiKey = preparedAuth?.kind === "api-key" ? preparedAuth.apiKey.trim() : void 0;
	if (preparedAuth && options?.authProfileId !== void 0) throw new Error("Prepared Codex auth cannot also select a legacy auth profile.");
	if (preparedAuth?.kind === "profile" && !preparedAuth.store.profiles[preparedAuth.profileId]) throw new Error(`Prepared Codex auth profile "${preparedAuth.profileId}" was not found.`);
	if (preparedAuth?.kind === "api-key" && !preparedApiKey) throw new Error("Prepared Codex API-key auth is missing its resolved key.");
	if (preparedAuth && requestedStartOptions.homeScope === "user") throw new Error("Prepared Codex auth requires an isolated app-server home.");
	const preparedAuthRequirement = inferAuthRequirement(preparedAuth);
	if (options?.authRequirement && preparedAuthRequirement && options.authRequirement !== preparedAuthRequirement) throw new Error("Prepared Codex auth does not satisfy the requested auth requirement.");
	const authRequirement = options?.authRequirement ?? preparedAuthRequirement;
	const usesNativeAuth = !preparedAuth && (options?.authProfileId === null || requestedStartOptions.homeScope === "user");
	const requestedAuthProfileId = preparedAuth?.kind === "profile" ? preparedAuth.profileId : options?.authProfileId ?? void 0;
	const authProfileStore = preparedAuth?.kind === "profile" ? preparedAuth.store : !usesNativeAuth && options?.authProfileStore ? resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: requestedAuthProfileId,
		authProfileStore: options.authProfileStore,
		config: options.config
	}) : options?.authProfileStore;
	const authProfileId = preparedAuth?.kind === "profile" ? preparedAuth.profileId : usesNativeAuth || preparedAuth?.kind === "api-key" ? void 0 : resolveCodexAppServerAuthProfileIdForAgent({
		authProfileId: requestedAuthProfileId,
		agentDir,
		config: options?.config,
		...authProfileStore ? { authProfileStore } : {}
	});
	const preparedAuthProfileSnapshot = preparedAuth?.kind === "profile" ? preparedAuth.snapshot ?? await resolveCodexAppServerPreparedAuthProfileSnapshot({
		authProfileId,
		authProfileStore,
		agentDir,
		config: options?.config
	}) : void 0;
	if (preparedAuth?.kind === "profile" && !preparedAuthProfileSnapshot) throw new Error(`Prepared Codex auth profile "${preparedAuth.profileId}" is unusable.`);
	const resolvedPreparedAuth = preparedAuth?.kind === "api-key" ? {
		kind: "api-key",
		apiKey: preparedApiKey
	} : preparedAuth?.kind === "profile" ? {
		...preparedAuth,
		snapshot: preparedAuthProfileSnapshot
	} : void 0;
	return {
		agentDir,
		usesNativeAuth,
		authProfileId,
		authProfileStore,
		requestedStartOptions,
		preparedAuth: resolvedPreparedAuth,
		authRequirement,
		startOptions: await bridgeCodexAppServerStartOptions({
			startOptions: await resolveManagedCodexAppServerStartOptions(resolveCodexAppServerStartOptionsForAgent({
				startOptions: requestedStartOptions,
				agentDir
			})),
			agentId: options?.agentId,
			agentDir,
			authProfileId: usesNativeAuth || preparedAuth?.kind === "api-key" ? null : authProfileId,
			...resolvedPreparedAuth ? { preparedAuth: resolvedPreparedAuth } : {},
			authRequirement,
			config: options?.config,
			pluginConfig: options?.pluginConfig,
			...authProfileStore ? { authProfileStore } : {}
		}),
		...options?.pluginConfig !== void 0 ? { pluginConfig: options.pluginConfig } : {},
		...desktopGeneration ? { desktopGeneration } : {}
	};
}
function shouldTrackDesktopGeneration(startOptions, pluginConfig) {
	if (startOptions.transport !== "stdio") return false;
	if (resolveCodexComputerUseConfig({ pluginConfig }).enabled && (startOptions.commandSource === "managed" || startOptions.commandSource === "resolved-managed")) return true;
	return startOptions.commandSource === "managed" && (startOptions.managedCommandOrder ?? "package-first") === "desktop-first";
}
function resolveWarmSharedCodexAppServerClientIdentity(options) {
	if (!options?.config || typeof options.config !== "object" || !options.startOptions || options.pluginConfig !== void 0 || options.authProfileStore !== void 0 || options.preparedAuth !== void 0 || options.runtimeArtifactMode !== void 0 || options.expectedRuntimeArtifact !== void 0) return;
	const authProfileSelector = options.authProfileId === null ? ["native"] : options.authProfileId === void 0 ? ["implicit"] : ["profile", options.authProfileId];
	return {
		config: options.config,
		startOptions: options.startOptions,
		selectorKey: JSON.stringify([
			options.agentDir ?? resolveDefaultAgentDir(options.config),
			authProfileSelector,
			options.authBindingFingerprint ?? null,
			options.authRequirement ?? null
		])
	};
}
function readWarmSharedCodexAppServerClient(state, identity) {
	const aliases = state.warmClientsByConfig?.get(identity.config)?.get(identity.startOptions);
	const warm = aliases?.get(identity.selectorKey);
	if (!warm) return;
	if (state.clients.get(warm.key) !== warm.entry || warm.entry.client !== warm.client || warm.entry.closeWhenIdle || warm.entry.closeError) {
		aliases?.delete(identity.selectorKey);
		return;
	}
	return warm;
}
function rememberWarmSharedCodexAppServerClient(state, identity, warm) {
	state.warmClientsByConfig ??= /* @__PURE__ */ new WeakMap();
	let byStartOptions = state.warmClientsByConfig.get(identity.config);
	if (!byStartOptions) {
		byStartOptions = /* @__PURE__ */ new WeakMap();
		state.warmClientsByConfig.set(identity.config, byStartOptions);
	}
	let aliases = byStartOptions.get(identity.startOptions);
	if (!aliases) {
		aliases = /* @__PURE__ */ new Map();
		byStartOptions.set(identity.startOptions, aliases);
	}
	aliases.set(identity.selectorKey, warm);
}
/** Gets or starts a shared Codex app-server client without retaining a lease. */
async function getSharedCodexAppServerClient(options) {
	return (await acquireSharedCodexAppServerClient(options)).client;
}
/** Gets or starts a shared Codex app-server client and records a release lease. */
async function getLeasedSharedCodexAppServerClient(options) {
	const acquired = await acquireSharedCodexAppServerClient(options, { leased: true });
	const state = getSharedCodexAppServerClientState();
	const releases = state.leasedReleases.get(acquired.client) ?? [];
	releases.push(acquired.release);
	state.leasedReleases.set(acquired.client, releases);
	return acquired.client;
}
/** Releases one outstanding lease for a shared Codex app-server client. */
function releaseLeasedSharedCodexAppServerClient(client) {
	const state = getSharedCodexAppServerClientState();
	const releases = state.leasedReleases.get(client);
	if (!releases) return false;
	const release = releases.pop();
	if (!release) return false;
	if (releases.length === 0) state.leasedReleases.delete(client);
	release();
	return true;
}
/** Releases the currently owned client exactly once. */
function releaseCodexAppServerClientLease(lease) {
	const client = lease.client;
	lease.client = void 0;
	return client ? releaseLeasedSharedCodexAppServerClient(client) : false;
}
/** Retries one config-loading operation with a shared deadline and current client lease. */
async function withLeasedCodexAppServerClientStartSelectionRetry(params) {
	let client = params.lease.client;
	if (!client) throw new Error("Codex app-server selection retry requires an active client lease");
	const timeoutMs = params.options?.timeoutMs ?? 6e4;
	const deadline = Date.now() + timeoutMs;
	const signal = params.signal ?? params.options?.abandonSignal;
	const requestOptions = () => {
		if (signal?.aborted) throw new CodexAppServerStartupError("aborted", "Codex app-server selection retry aborted");
		const remainingTimeoutMs = deadline - Date.now();
		if (remainingTimeoutMs <= 0) throw new CodexAppServerStartupError("timed_out", "Codex app-server selection retry timed out");
		return {
			timeoutMs: remainingTimeoutMs,
			...signal ? { signal } : {}
		};
	};
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const attemptClient = client;
		let scopeActive = true;
		const assertCurrent = () => {
			if (!scopeActive || params.lease.client !== attemptClient) throw new CodexAppServerStartupError("aborted", "Codex app-server request scope is closed");
		};
		try {
			requestOptions();
			return await params.run(client, () => {
				assertCurrent();
				return {
					...requestOptions(),
					assertCurrent
				};
			});
		} catch (error) {
			if (!isCodexAppServerStartSelectionChangedError(error) || attempt > 0) throw error;
			retireSharedCodexAppServerClientIfCurrent(client);
			params.lease.client = void 0;
			if (!releaseLeasedSharedCodexAppServerClient(client)) {
				client.close();
				throw new Error("Codex app-server selection retry requires a leased shared client", { cause: error });
			}
			const replacementOptions = requestOptions();
			client = await getLeasedSharedCodexAppServerClient({
				...params.options,
				timeoutMs: replacementOptions.timeoutMs,
				...signal ? { abandonSignal: signal } : {}
			});
			params.lease.client = client;
			params.onClientChange(client);
		} finally {
			scopeActive = false;
		}
	}
	throw new Error("Codex app-server selection retry loop exited unexpectedly");
}
async function acquireSharedCodexAppServerClient(options, leaseOptions) {
	if (options?.abandonSignal?.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
	const acquireStartedAt = Date.now();
	const timeoutMs = options?.timeoutMs ?? 0;
	const state = getSharedCodexAppServerClientState();
	const warmIdentity = resolveWarmSharedCodexAppServerClientIdentity(options);
	let warmClient = warmIdentity ? readWarmSharedCodexAppServerClient(state, warmIdentity) : void 0;
	const warmGeneration = warmClient ? getCodexAppServerClientStartMetadata().get(warmClient.client)?.desktopGeneration : void 0;
	if (warmClient && warmGeneration && !isCodexDesktopGenerationCurrent(warmGeneration)) {
		await withCodexAppServerAcquireDeadline(resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt), waitForCodexDesktopGeneration(), options?.abandonSignal);
		if (!isCodexDesktopGenerationCurrent(warmGeneration)) {
			retireSharedCodexAppServerClientIfCurrent(warmClient.client);
			warmClient = void 0;
		}
	}
	if (warmClient) {
		warmClient.entry.leaseGeneration += 1;
		options?.onStartedClient?.(warmClient.client);
		const release = leaseOptions?.leased ? retainSharedClientEntry(warmClient.entry) : void 0;
		return release ? {
			client: warmClient.client,
			release
		} : { client: warmClient.client };
	}
	const { agentDir, usesNativeAuth, authProfileId, authProfileStore, preparedAuth, authRequirement, requestedStartOptions, startOptions, desktopGeneration, pluginConfig } = await withCodexAppServerAcquireDeadline(timeoutMs, resolveCodexAppServerClientStartContext(options), options?.abandonSignal);
	const remainingTimeoutMs = resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt);
	const authIdentityCacheKey = preparedAuth?.kind === "api-key" ? resolveCodexAppServerPreparedApiKeyCacheKey(preparedAuth.apiKey) : preparedAuth?.snapshot.secretFreeCacheKey ?? (authRequirement === "api-key" && !authProfileId ? resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions }) : void 0);
	const baseKey = `${codexAppServerStartOptionsKey(startOptions, {
		authProfileId,
		authBindingFingerprint: options?.authBindingFingerprint,
		agentDir: usesNativeAuth ? void 0 : agentDir,
		fallbackApiKeyCacheKey: authIdentityCacheKey
	})}\0auth-requirement:${authRequirement ?? "native"}${desktopGeneration ? `\0desktop-generation:${desktopGeneration.epoch}` : ""}`;
	const runtimeArtifactMode = options?.runtimeArtifactMode ?? (options?.expectedRuntimeArtifact ? "capture" : void 0);
	const expectedRuntimeArtifactKey = options?.expectedRuntimeArtifact ? createHash("sha256").update(options.expectedRuntimeArtifact.id).update("\0").update(options.expectedRuntimeArtifact.fingerprint).digest("hex") : "mint";
	const key = runtimeArtifactMode ? `${baseKey}\0runtime-artifact:capture-v1:${expectedRuntimeArtifactKey}` : baseKey;
	let entry = getOrCreateSharedClientEntry(state, key);
	const existingClient = entry.client;
	const existingGeneration = existingClient ? getCodexAppServerClientStartMetadata().get(existingClient)?.desktopGeneration : void 0;
	if (existingClient && existingGeneration && !isCodexDesktopGenerationCurrent(existingGeneration)) {
		retireSharedCodexAppServerClientIfCurrent(existingClient);
		entry = getOrCreateSharedClientEntry(state, key);
	}
	entry.startupAbort ??= new AbortController();
	entry.closeWhenIdle = false;
	const releasePendingAcquire = retainPendingSharedClientAcquire(entry);
	const startedCallback = options?.onStartedClient;
	if (startedCallback) {
		entry.onStartedClientCallbacks.add(startedCallback);
		if (entry.client) startedCallback(entry.client);
	}
	const stopStartedClientNotifications = () => {
		if (startedCallback) entry.onStartedClientCallbacks.delete(startedCallback);
	};
	let cleanupAbandonSignal;
	if (options?.abandonSignal) {
		const abandon = () => {
			stopStartedClientNotifications();
			releasePendingAcquire();
			retirePendingSharedClientEntryIfUnclaimed(key, entry);
		};
		options.abandonSignal.addEventListener("abort", abandon, { once: true });
		cleanupAbandonSignal = () => options.abandonSignal?.removeEventListener("abort", abandon);
		if (options.abandonSignal.aborted) abandon();
	}
	const startup = entry.startup ?? (entry.startup = createSharedCodexAppServerClientStartup({
		entry,
		key,
		requestedStartOptions,
		startOptions,
		desktopGeneration,
		...pluginConfig !== void 0 ? { pluginConfig } : {},
		agentDir,
		authProfileId: usesNativeAuth || preparedAuth?.kind === "api-key" ? null : authProfileId,
		authProfileStore,
		preparedAuth,
		authRequirement,
		runtimeArtifactMode,
		...options?.expectedRuntimeArtifact ? { expectedRuntimeArtifact: options.expectedRuntimeArtifact } : {},
		runtimeArtifactSignal: entry.startupAbort.signal,
		abandonSignal: entry.startupAbort.signal,
		config: options?.config
	}));
	try {
		await withCodexAppServerAcquireDeadline(remainingTimeoutMs, startup.initialized, options?.abandonSignal, CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE, () => buildCodexAppServerInitializeTimeoutError(entry.client));
		const client = await withCodexAppServerAcquireDeadline(timeoutMs, startup.ready, options?.abandonSignal, "codex app-server authentication timed out");
		if (entry.closeError) throw entry.closeError;
		ensureCodexAppServerClientRuntime(client, {
			agentDir,
			authProfileId: usesNativeAuth ? void 0 : authProfileId,
			...authProfileStore ? { authProfileStore } : {},
			authMode: preparedAuth?.kind === "api-key" ? "prepared-api-key" : "profile",
			config: options?.config
		});
		const release = leaseOptions?.leased ? retainSharedClientEntry(entry) : void 0;
		if (warmIdentity) rememberWarmSharedCodexAppServerClient(state, warmIdentity, {
			key,
			entry,
			client
		});
		return release ? {
			client,
			release
		} : { client };
	} catch (error) {
		releasePendingAcquire();
		retirePendingSharedClientEntryIfUnclaimed(key, entry);
		throw error;
	} finally {
		cleanupAbandonSignal?.();
		stopStartedClientNotifications();
		releasePendingAcquire();
	}
}
async function withCodexAppServerAcquireDeadline(timeoutMs, promise, signal, timeoutMessage = CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE, timeoutErrorFactory) {
	if (signal?.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
	const timed = withTimeout(promise, timeoutMs, timeoutMessage, () => timeoutErrorFactory?.() ?? new CodexAppServerStartupError("timed_out", timeoutMessage));
	if (!signal) return await timed;
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(new CodexAppServerStartupError("aborted", "codex app-server initialize aborted"));
		signal.addEventListener("abort", onAbort, { once: true });
		timed.then(resolve, reject).finally(() => signal.removeEventListener("abort", onAbort));
	});
}
function buildCodexAppServerInitializeTimeoutError(client) {
	const stderr = client?.getStderrDiagnostic();
	return new CodexAppServerStartupError("timed_out", stderr ? `${CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE}; stderr=${JSON.stringify(stderr)}` : CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE);
}
function resolveRemainingAcquireTimeout(timeoutMs, startedAt) {
	if (!(timeoutMs > 0)) return timeoutMs;
	const remaining = timeoutMs - (Date.now() - startedAt);
	if (remaining <= 0) throw new CodexAppServerStartupError("timed_out", "codex app-server initialize timed out");
	return remaining;
}
function createSharedCodexAppServerClientStartup(params) {
	const initialized = createDeferred();
	const ready = startInitializedCodexAppServerClient({
		requestedStartOptions: params.requestedStartOptions,
		startOptions: params.startOptions,
		...params.desktopGeneration ? { desktopGeneration: params.desktopGeneration } : {},
		...params.pluginConfig !== void 0 ? { pluginConfig: params.pluginConfig } : {},
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		preparedAuth: params.preparedAuth,
		authRequirement: params.authRequirement,
		runtimeArtifactMode: params.runtimeArtifactMode,
		...params.expectedRuntimeArtifact ? { expectedRuntimeArtifact: params.expectedRuntimeArtifact } : {},
		runtimeArtifactSignal: params.runtimeArtifactSignal,
		abandonSignal: params.abandonSignal,
		config: params.config,
		onStartedClient: (startedClient) => {
			const state = getSharedCodexAppServerClientState();
			params.entry.client = startedClient;
			state.liveClients.add(startedClient);
			startedClient.addTransportExitHandler((exitedClient) => {
				state.liveClients.delete(exitedClient);
				notifyDesktopGenerationDrainChecks(state);
			});
			startedClient.addCloseHandler((closedClient) => {
				if (state.entriesByClient.get(closedClient) === params.entry) clearSharedClientEntryIfCurrent(params.key, closedClient);
			});
			for (const callback of params.entry.onStartedClientCallbacks) callback(startedClient);
			retirePendingSharedClientEntryIfUnclaimed(params.key, params.entry);
		},
		onInitializedClient: () => initialized.resolve()
	}).then((client) => {
		const state = getSharedCodexAppServerClientState();
		params.entry.client = client;
		state.entriesByClient.set(client, params.entry);
		return client;
	}, (error) => {
		initialized.reject(error);
		throw error;
	});
	initialized.promise.catch(() => void 0);
	ready.catch(() => void 0);
	return {
		initialized: initialized.promise,
		ready
	};
}
/** Starts a non-shared Codex app-server client owned entirely by the caller. */
async function createIsolatedCodexAppServerClient(options) {
	if (options?.abandonSignal?.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
	const acquireStartedAt = Date.now();
	const timeoutMs = options?.timeoutMs ?? 0;
	const { agentDir, usesNativeAuth, authProfileId, authProfileStore, preparedAuth, authRequirement, requestedStartOptions, startOptions, desktopGeneration, pluginConfig } = await withCodexAppServerAcquireDeadline(timeoutMs, resolveCodexAppServerClientStartContext(options), options?.abandonSignal);
	return await startInitializedCodexAppServerClient({
		requestedStartOptions,
		startOptions,
		...desktopGeneration ? { desktopGeneration } : {},
		...pluginConfig !== void 0 ? { pluginConfig } : {},
		agentDir,
		authProfileId: usesNativeAuth || preparedAuth?.kind === "api-key" ? null : authProfileId,
		authProfileStore,
		preparedAuth,
		authRequirement,
		runtimeArtifactMode: options?.runtimeArtifactMode ?? (options?.expectedRuntimeArtifact ? "capture" : void 0),
		...options?.expectedRuntimeArtifact ? { expectedRuntimeArtifact: options.expectedRuntimeArtifact } : {},
		runtimeArtifactSignal: options?.abandonSignal,
		config: options?.config,
		timeoutMs: resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt),
		abandonSignal: options?.abandonSignal,
		onStartedClient: (client) => {
			trackIsolatedCodexAppServerClient(client);
			options?.onStartedClient?.(client);
		}
	});
}
function trackIsolatedCodexAppServerClient(client) {
	const state = getSharedCodexAppServerClientState();
	state.isolatedClients.add(client);
	client.addTransportExitHandler((exitedClient) => {
		state.isolatedClients.delete(exitedClient);
		notifyDesktopGenerationDrainChecks(state);
	});
}
async function startInitializedCodexAppServerClient(params) {
	const acquireStartedAt = Date.now();
	const timeoutMs = params.timeoutMs ?? 0;
	const startOptionsCandidates = resolveManagedFallbackStartOptions(params.startOptions);
	for (const [index, startOptions] of startOptionsCandidates.entries()) {
		const desktopGeneration = params.desktopGeneration ?? (isManagedCodexDesktopCommand(startOptions.command) ? await withCodexAppServerAcquireDeadline(resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt), waitForCodexDesktopGeneration(), params.abandonSignal) : void 0);
		const assertDesktopGenerationCurrent = () => {
			if (params.abandonSignal?.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
			if (desktopGeneration && !isCodexDesktopGenerationCurrent(desktopGeneration)) throw new CodexAppServerStartSelectionChangedError();
		};
		const computerUseConfig = resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig });
		const ownsIsolatedCodexHome = params.requestedStartOptions.homeScope !== "user" && !params.requestedStartOptions.env?.CODEX_HOME?.trim();
		const artifactDrain = desktopGeneration && ownsIsolatedCodexHome && computerUseConfig.enabled && (computerUseConfig.autoInstall || computerUseConfig.pluginCacheMode === "shared") ? createOlderDesktopGenerationDrainWait({
			generation: desktopGeneration,
			startOptions,
			agentDir: params.agentDir
		}) : void 0;
		try {
			if (artifactDrain) await withCodexAppServerAcquireDeadline(resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt), artifactDrain.promise, params.abandonSignal);
			await reconcileCodexComputerUseStartArtifacts({
				startOptions,
				agentDir: params.agentDir,
				pluginConfig: params.pluginConfig,
				...desktopGeneration ? { desktopGeneration } : {},
				assertCurrent: assertDesktopGenerationCurrent,
				ownsIsolatedCodexHome
			});
		} catch (error) {
			if (isCodexComputerUseCandidateArtifactsUnavailableError(error)) {
				if (index + 1 < startOptionsCandidates.length) continue;
				throw new AgentHarnessPreflightError("Codex Computer Use artifacts are unavailable from the installed desktop apps.", {
					cause: error,
					scope: "harness"
				});
			}
			throw error;
		} finally {
			artifactDrain?.cancel();
		}
		const runtimeArtifactModule = params.runtimeArtifactMode ? await import("./runtime-artifact-COPEAUm2.js") : void 0;
		const nativeCommandBeforeStart = startOptions.commandSource === "resolved-managed" ? resolveManagedCodexNativeCommand(startOptions.command) : void 0;
		const runtimeArtifactBeforeStart = runtimeArtifactModule ? await runtimeArtifactModule.captureCodexAppServerRuntimeArtifactBeforeStart({
			startOptions,
			spawnIdentity: resolveCodexAppServerSpawnIdentity(startOptions, nativeCommandBeforeStart),
			signal: params.runtimeArtifactSignal
		}) : void 0;
		if (runtimeArtifactModule && runtimeArtifactBeforeStart && params.expectedRuntimeArtifact && !runtimeArtifactModule.validateCodexAppServerRuntimeArtifactCapture(params.expectedRuntimeArtifact, runtimeArtifactBeforeStart)) {
			if (index + 1 < startOptionsCandidates.length) continue;
			throw new Error("Codex app-server runtime artifact does not match verified inference");
		}
		assertDesktopGenerationCurrent();
		const client = CodexAppServerClient.start(startOptions);
		const nativeCommandAtStart = startOptions.commandSource === "resolved-managed" ? resolveManagedCodexNativeCommand(startOptions.command) : void 0;
		getCodexAppServerClientStartMetadata().set(client, {
			requestedStartOptions: params.requestedStartOptions,
			startOptions,
			agentDir: params.agentDir,
			...nativeCommandAtStart ? { nativeCommand: nativeCommandAtStart } : {},
			...desktopGeneration ? { desktopGeneration } : {}
		});
		params.onStartedClient?.(client);
		let initialize;
		try {
			await withCodexAppServerAcquireDeadline(resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt), initialize = client.initialize(), params.abandonSignal, CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE, () => buildCodexAppServerInitializeTimeoutError(client));
		} catch (error) {
			client.close();
			initialize?.catch(() => void 0);
			if (shouldTryManagedFallbackStartOption(error, startOptions, index, startOptionsCandidates)) continue;
			throw error;
		}
		try {
			assertDesktopGenerationCurrent();
		} catch (error) {
			client.close();
			throw error;
		}
		params.onInitializedClient?.();
		let runtimeArtifact;
		try {
			if (runtimeArtifactModule && runtimeArtifactBeforeStart) {
				const nativeCommand = startOptions.commandSource === "resolved-managed" ? resolveManagedCodexNativeCommand(startOptions.command) : void 0;
				runtimeArtifact = await runtimeArtifactModule.finalizeCodexAppServerRuntimeArtifact({
					before: runtimeArtifactBeforeStart,
					startOptions,
					spawnIdentity: resolveCodexAppServerSpawnIdentity(startOptions, nativeCommand),
					runtimeIdentity: client.getRuntimeIdentity(),
					signal: params.runtimeArtifactSignal
				});
				if (params.expectedRuntimeArtifact && (runtimeArtifact.id !== params.expectedRuntimeArtifact.id || runtimeArtifact.fingerprint !== params.expectedRuntimeArtifact.fingerprint)) throw new Error("Codex app-server runtime artifact does not match verified inference");
			}
		} catch (error) {
			client.close();
			throw error;
		}
		ensureCodexAppServerClientRuntime(client, {
			agentDir: params.agentDir,
			authProfileId: params.authProfileId ?? void 0,
			authMode: params.preparedAuth?.kind === "api-key" ? "prepared-api-key" : "profile",
			...params.authProfileStore ? { authProfileStore: params.authProfileStore } : {},
			config: params.config
		});
		try {
			assertDesktopGenerationCurrent();
			await withCodexAppServerAcquireDeadline(resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt), applyCodexAppServerAuthProfile({
				client,
				agentDir: params.agentDir,
				authProfileId: params.authProfileId,
				preparedAuth: params.preparedAuth,
				authRequirement: params.authRequirement,
				startOptions,
				config: params.config,
				...params.authProfileStore ? { authProfileStore: params.authProfileStore } : {}
			}), params.abandonSignal);
			if (runtimeArtifactModule && runtimeArtifact) runtimeArtifactModule.bindCodexAppServerRuntimeArtifact(client, runtimeArtifact);
			assertDesktopGenerationCurrent();
			const fenceKey = resolveCodexNativeConfigFenceKey({ client });
			if (fenceKey) client.setThreadSessionRequestGuard(async (options) => {
				const release = await acquireCodexNativeConfigFence(fenceKey, options);
				try {
					assertCodexAppServerClientStartSelectionCurrent({ client });
					return release;
				} catch (error) {
					release();
					throw error;
				}
			});
			return client;
		} catch (error) {
			client.close();
			throw error;
		}
	}
	throw new Error("Managed Codex app-server fallback candidates were exhausted.");
}
function isCodexComputerUseCandidateArtifactsUnavailableError(error) {
	return error !== null && typeof error === "object" && "code" in error && error.code === "CODEX_COMPUTER_USE_CANDIDATE_ARTIFACTS_UNAVAILABLE";
}
function resolveManagedFallbackStartOptions(startOptions) {
	const commands = [startOptions.command, ...startOptions.managedFallbackCommandPaths ?? []];
	const candidates = [];
	for (const [index, command] of commands.entries()) {
		const managedFallbackCommandPaths = commands.slice(index + 1);
		const candidate = {
			...startOptions,
			command
		};
		if (managedFallbackCommandPaths.length === 0) delete candidate.managedFallbackCommandPaths;
		else candidate.managedFallbackCommandPaths = managedFallbackCommandPaths;
		candidates.push(candidate);
	}
	return candidates;
}
function shouldTryManagedFallbackStartOption(error, startOptions, index, startOptionsCandidates) {
	return startOptions.commandSource === "resolved-managed" && index < startOptionsCandidates.length - 1 && isUnsupportedCodexAppServerVersionError(error);
}
/** Clears and closes the shared entry only if it still owns the supplied client. */
function clearSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return false;
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) {
		state.clients.delete(key);
		client.close();
		return true;
	}
	return false;
}
/** Retains the matching shared client and returns a release callback. */
function retainSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return;
	const state = getSharedCodexAppServerClientState();
	for (const entry of state.clients.values()) if (entry.client === client) return retainSharedClientEntry(entry);
}
/** Retains the live shared client whose initialized instance id matches a thread binding. */
function retainSharedCodexAppServerClientByInstanceId(clientId) {
	const normalizedClientId = clientId?.trim();
	if (!normalizedClientId) return;
	for (const entry of getSharedCodexAppServerClientState().clients.values()) {
		const client = entry.client;
		if (client?.getInstanceId() !== normalizedClientId || entry.closeWhenIdle || entry.closeError) continue;
		return {
			client,
			release: retainSharedClientEntry(entry)
		};
	}
}
/** Captures sole physical-client ownership across awaited configuration adoption. */
function captureExclusiveSharedCodexAppServerClient(client) {
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) {
		if (entry.client !== client) continue;
		const generation = entry.leaseGeneration;
		const assertExclusive = () => {
			if (state.clients.get(key) !== entry || entry.client !== client || entry.closeWhenIdle || entry.closeError || entry.activeLeases !== 1 || entry.pendingAcquires !== 0 || entry.leaseGeneration !== generation) throw new CodexAdoptedThreadActiveError();
		};
		assertExclusive();
		return assertExclusive;
	}
	throw new CodexAdoptedThreadActiveError();
}
/**
* Retires a matching shared client. Default is graceful: detach from the map
* (future acquisitions get a fresh client) and close once leases drain.
* `failActiveLeases` is for suspect clients only (timed-out turns): it closes
* the physical connection immediately so co-leased attempts hit the normal
* client-closed retry path, and pending acquires reject instead of leasing
* the poisoned process. Routine cleanup must NOT use it — it would abort
* healthy sibling turns on a working client.
*/
function retireSharedCodexAppServerClientIfCurrent(client, opts) {
	if (!client) return;
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) {
		state.clients.delete(key);
		entry.closeWhenIdle = true;
		if (opts?.failActiveLeases) {
			entry.closeError = /* @__PURE__ */ new Error("codex app-server client is closed");
			return {
				activeLeases: entry.activeLeases,
				closed: closeRetiredSharedClientEntry(entry)
			};
		}
		const closed = closeRetiredSharedClientEntryIfIdle(entry);
		return {
			activeLeases: entry.activeLeases,
			closed
		};
	}
	const detachedEntry = state.entriesByClient.get(client);
	if (detachedEntry && (detachedEntry.client === client || detachedEntry.closeError)) {
		if (opts?.failActiveLeases && !detachedEntry.closeError) {
			detachedEntry.closeError = /* @__PURE__ */ new Error("codex app-server client is closed");
			return {
				activeLeases: detachedEntry.activeLeases,
				closed: closeRetiredSharedClientEntry(detachedEntry)
			};
		}
		return {
			activeLeases: detachedEntry.activeLeases,
			closed: false
		};
	}
}
/** Gracefully retires exact clients attached to an older desktop generation. */
function retireSharedCodexAppServerClientsBeforeDesktopGeneration(generation) {
	const state = getSharedCodexAppServerClientState();
	for (const entry of state.clients.values()) {
		const client = entry.client;
		const attached = client ? getCodexAppServerClientStartMetadata().get(client) : void 0;
		if (client && attached?.desktopGeneration && attached.desktopGeneration.epoch < generation.epoch) retireSharedCodexAppServerClientIfCurrent(client);
	}
}
function createOlderDesktopGenerationDrainWait(params) {
	const targetHome = resolveCodexNativeConfigFenceKey({
		startOptions: params.startOptions,
		agentDir: params.agentDir
	});
	if (!targetHome) return {
		promise: Promise.resolve(),
		cancel: () => void 0
	};
	const state = getSharedCodexAppServerClientState();
	let settled = false;
	let resolveWait;
	const promise = new Promise((resolve) => {
		resolveWait = resolve;
	});
	const cancel = () => {
		if (settled) return;
		settled = true;
		state.desktopGenerationDrainChecks.delete(check);
		resolveWait();
	};
	const check = () => {
		if (!hasLiveOlderDesktopGenerationClient({
			state,
			generation: params.generation,
			targetHome
		})) cancel();
	};
	state.desktopGenerationDrainChecks.add(check);
	check();
	return {
		promise,
		cancel
	};
}
function hasLiveOlderDesktopGenerationClient(params) {
	for (const client of params.state.liveClients) if (isOlderDesktopGenerationClientForHome(client, params.generation, params.targetHome)) return true;
	for (const client of params.state.isolatedClients) if (isOlderDesktopGenerationClientForHome(client, params.generation, params.targetHome)) return true;
	return false;
}
function isOlderDesktopGenerationClientForHome(client, generation, targetHome) {
	const metadata = getCodexAppServerClientStartMetadata().get(client);
	return Boolean(metadata?.desktopGeneration && metadata.desktopGeneration.epoch < generation.epoch && resolveCodexNativeConfigFenceKey({ client }) === targetHome);
}
function notifyDesktopGenerationDrainChecks(state) {
	for (const check of state.desktopGenerationDrainChecks) check();
}
/** Clears a matching shared client and waits for its process to exit. */
async function clearSharedCodexAppServerClientIfCurrentAndWait(client, options) {
	if (!client) return false;
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) {
		state.clients.delete(key);
		await client.closeAndWait(options);
		return true;
	}
	return false;
}
/** Clears all shared clients and waits for their processes to exit. */
async function clearSharedCodexAppServerClientAndWait(options) {
	const state = getSharedCodexAppServerClientState();
	const clients = collectSharedClients(state);
	state.clients.clear();
	state.warmClientsByConfig = /* @__PURE__ */ new WeakMap();
	await Promise.all(clients.map((client) => client.closeAndWait(options)));
}
globalThis[SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER] = clearSharedCodexAppServerClientAndWait;
function getOrCreateSharedClientEntry(state, key) {
	let entry = state.clients.get(key);
	if (!entry) {
		entry = {
			activeLeases: 0,
			pendingAcquires: 0,
			leaseGeneration: 0,
			closeWhenIdle: false,
			onStartedClientCallbacks: /* @__PURE__ */ new Set()
		};
		state.clients.set(key, entry);
	}
	return entry;
}
function clearSharedClientEntryIfCurrent(key, client) {
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(key)?.client === client) state.clients.delete(key);
}
/** Clears a matching shared client only when no lease or acquire currently claims it. */
function clearSharedCodexAppServerClientIfCurrentAndUnclaimed(client) {
	if (!client) return {
		found: false,
		closed: false,
		activeLeases: 0,
		pendingAcquires: 0
	};
	const state = getSharedCodexAppServerClientState();
	for (const [key, entry] of state.clients) if (entry.client === client) return {
		found: true,
		closed: closeSharedClientEntryIfUnclaimed(key, entry),
		activeLeases: entry.activeLeases,
		pendingAcquires: entry.pendingAcquires
	};
	return {
		found: false,
		closed: false,
		activeLeases: 0,
		pendingAcquires: 0
	};
}
function retainPendingSharedClientAcquire(entry) {
	let released = false;
	entry.leaseGeneration += 1;
	entry.pendingAcquires += 1;
	return () => {
		if (released) return;
		released = true;
		entry.pendingAcquires = Math.max(0, entry.pendingAcquires - 1);
		closeRetiredSharedClientEntryIfIdle(entry);
		notifyDesktopGenerationDrainChecks(getSharedCodexAppServerClientState());
	};
}
function retainSharedClientEntry(entry) {
	let released = false;
	entry.leaseGeneration += 1;
	entry.activeLeases += 1;
	return () => {
		if (released) return;
		released = true;
		entry.activeLeases = Math.max(0, entry.activeLeases - 1);
		closeRetiredSharedClientEntryIfIdle(entry);
		notifyDesktopGenerationDrainChecks(getSharedCodexAppServerClientState());
	};
}
function closeRetiredSharedClientEntryIfIdle(entry) {
	if (!entry.closeWhenIdle || entry.activeLeases > 0 || entry.pendingAcquires > 0 || !entry.client) return false;
	const client = entry.client;
	entry.closeWhenIdle = false;
	entry.client = void 0;
	client.close();
	return true;
}
function closeRetiredSharedClientEntry(entry) {
	const client = entry.client;
	if (!client) return false;
	entry.client = void 0;
	client.close();
	return true;
}
function closeSharedClientEntryIfUnclaimed(key, entry) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return false;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(key) !== entry) return false;
	state.clients.delete(key);
	entry.client?.close();
	return Boolean(entry.client);
}
function retirePendingSharedClientEntryIfUnclaimed(key, entry) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return;
	entry.startupAbort?.abort(/* @__PURE__ */ new Error("Codex app-server startup was abandoned"));
	entry.closeWhenIdle = true;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(key) === entry) state.clients.delete(key);
	if (!entry.client) return;
	closeRetiredSharedClientEntry(entry);
}
function collectSharedClients(state) {
	return [...state.liveClients];
}
//#endregion
export { createCodexElicitationResponse as $, createCodexDesktopGenerationService as A, resolveCodexAppServerHomeDir as At, withCodexStartupTimeout as B, withLeasedCodexAppServerClientStartSelectionRetry as C, CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES as Ct, CodexThreadBindingConflictError as D, isJsonObject as Dt, CodexThreadBindingConflictAfterCleanupError as E, flattenCodexDynamicToolFunctions as Et, resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs as F, isCodexAppServerIndeterminateRequestCancellationError as G, isCodexAppServerApprovalRequest as H, resolveCodexStartupTimeoutMs as I, isCodexAppServerPrewriteRequestCancellationError as J, isCodexAppServerIndeterminateTransportError as K, resolveCodexTurnAssistantCompletionIdleTimeoutMs as L, CodexAppServerStartupError as M, isCodexAppServerStartupError as N, CodexThreadStartRequestError as O, resolveCodexManagedBundledMarketplacePath as Ot, resolveCodexGatewayTimeoutWithGraceMs as P, CodexAppServerRpcError as Q, resolveCodexTurnCompletionIdleTimeoutMs as R, waitForCodexAppServerClientDesktopGenerationDrain as S, resolveCodexAppServerPreparedAuthHandoff as St, CodexRestrictedToolSurfaceAttestationError as T, CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE as Tt, isCodexAppServerBrokenPipeError as U, getCodexAppServerClientInstanceId as V, isCodexAppServerConnectionClosedError as W, isUnsupportedCodexAppServerVersionError as X, isCodexAppServerRequestTimeoutError as Y, resolveCodexAppServerClientInstanceId as Z, resolveCodexNativeConfigFenceKey as _, resolveCodexAppServerAuthProfileId as _t, clearSharedCodexAppServerClientIfCurrentAndUnclaimed as a, isCodexAppServerLiveThreadClaimed as at, retireSharedCodexAppServerClientIfCurrent as b, resolveCodexAppServerFallbackApiKeyCacheKey as bt, getLeasedSharedCodexAppServerClient as c, retainCodexAppServerLiveThread as ct, readCodexAppServerClientDesktopGeneration as d, withTimeout as dt, claimCodexAppServerLiveThread as et, readCodexAppServerClientDesktopGenerationFingerprint as f, readCodexRateLimitsRevision as ft, resolveCodexAppServerSpawnIdentity as g, resolveCodexAppServerAuthAccountCacheKey as gt, releaseLeasedSharedCodexAppServerClient as h, reconcileCodexComputerUseStartArtifacts as ht, clearSharedCodexAppServerClientIfCurrent as i, isCodexAppServerClientRuntimeLive as it, CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS as j, resolveCodexAppServerLocalHomeDir as jt, acquireCodexNativeConfigFence as k, assertNotSymlink as kt, getSharedCodexAppServerClient as l, unsubscribeCodexAppServerLiveThread as lt, releaseCodexAppServerClientLease as m, rememberCodexRateLimitsRead as mt, captureExclusiveSharedCodexAppServerClient as n, ensureCodexAppServerClientRuntime as nt, clearSharedCodexAppServerClientIfCurrentAndWait as o, protectCodexAppServerLiveThread as ot, readCodexAppServerClientProcessIdentity as p, readRecentCodexRateLimits as pt, isCodexAppServerOverloadError as q, clearSharedCodexAppServerClientAndWait as r, hasCodexAppServerLiveThread as rt, createIsolatedCodexAppServerClient as s, releaseCodexAppServerLiveThread as st, assertCodexAppServerClientStartSelectionCurrent as t, consumeCodexAppServerLiveThread as tt, isCodexAppServerStartSelectionChangedError as u, withAbortableTimeout as ut, retainSharedCodexAppServerClientByInstanceId as v, resolveCodexAppServerAuthProfileIdForAgent as vt, CodexAdoptedThreadActiveError as w, CODEX_INTERACTIVE_THREAD_SOURCE_KINDS as wt, retireSharedCodexAppServerClientsBeforeDesktopGeneration as x, resolveCodexAppServerPreparedApiKeyCacheKey as xt, retainSharedCodexAppServerClientIfCurrent as y, resolveCodexAppServerAuthProfileStore as yt, resolveCodexTurnTerminalIdleTimeoutMs as z };
