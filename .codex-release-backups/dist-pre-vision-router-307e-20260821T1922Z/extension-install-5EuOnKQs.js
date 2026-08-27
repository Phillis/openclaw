import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./state-paths-BIUvtBLx.js";
import { t as BROWSER_NATIVE_HOST_NAME } from "./extension-native-host-CFjloRah.js";
import crypto from "node:crypto";
import { constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region extensions/browser/src/browser/extension-install-layout.ts
const EXTENSION_ID_PATTERN = /^[a-p]{32}$/;
const UNPACKED_MANIFEST_LOCATION = 4;
const OWNED_COPY_MARKER = ".openclaw-owned.json";
const SECURE_PREFERENCES_MAX_BYTES = 32 * 1024 * 1024;
/** Chromium crx_file::id_util::GenerateIdForPath for a canonical absolute path. */
function generateChromeExtensionIdForPath(canonicalPath, platform = process.platform) {
	if (!(platform === "win32" ? path.win32.isAbsolute(canonicalPath) : path.isAbsolute(canonicalPath))) throw new Error("Chrome extension ID paths must be canonical absolute paths");
	let nativePath = canonicalPath;
	if (platform === "win32" && /^[a-z]:/u.test(nativePath)) nativePath = `${nativePath[0]?.toUpperCase()}${nativePath.slice(1)}`;
	const bytes = Buffer.from(nativePath, platform === "win32" ? "utf16le" : "utf8");
	return crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 32).replace(/[0-9a-f]/gu, (nibble) => String.fromCharCode("a".charCodeAt(0) + Number.parseInt(nibble, 16)));
}
function homeDirectory(deps) {
	const value = deps.homeDir ?? deps.env?.HOME ?? deps.env?.USERPROFILE ?? os.homedir();
	if (!value.trim()) throw new Error("Could not resolve the user home directory.");
	return path.resolve(value);
}
/** Chromium-derived default user-data and user native-host roots. */
function chromeProductRoots(deps = {}) {
	const platform = deps.platform ?? process.platform;
	const env = deps.env ?? process.env;
	const home = homeDirectory({
		...deps,
		env
	});
	if (platform === "darwin") {
		const appSupport = path.join(home, "Library", "Application Support");
		const testingData = path.join(appSupport, "Google", "Chrome for Testing");
		return [
			{
				product: "chrome",
				label: "Google Chrome",
				userDataDir: path.join(appSupport, "Google", "Chrome"),
				nativeManifestDir: path.join(appSupport, "Google", "Chrome", "NativeMessagingHosts")
			},
			{
				product: "chrome-for-testing",
				label: "Google Chrome for Testing",
				userDataDir: testingData,
				nativeManifestDir: path.join(testingData, "NativeMessagingHosts")
			},
			{
				product: "chrome-for-testing",
				label: "Google Chrome for Testing (documented host root)",
				userDataDir: testingData,
				nativeManifestDir: path.join(appSupport, "Google", "ChromeForTesting", "NativeMessagingHosts")
			},
			{
				product: "chromium",
				label: "Chromium",
				userDataDir: path.join(appSupport, "Chromium"),
				nativeManifestDir: path.join(appSupport, "Chromium", "NativeMessagingHosts")
			}
		];
	}
	if (platform === "linux") {
		const configHome = path.resolve(env.CHROME_CONFIG_HOME?.trim() || env.XDG_CONFIG_HOME?.trim() || path.join(home, ".config"));
		return [
			[
				"chrome",
				"Google Chrome",
				"google-chrome"
			],
			[
				"chrome-for-testing",
				"Google Chrome for Testing",
				"google-chrome-for-testing"
			],
			[
				"chromium",
				"Chromium",
				"chromium"
			]
		].map(([product, label, basename]) => ({
			product,
			label,
			userDataDir: path.join(configHome, basename),
			nativeManifestDir: path.join(configHome, basename, "NativeMessagingHosts")
		}));
	}
	if (platform === "win32") {
		const localAppData = env.LOCALAPPDATA?.trim();
		if (!localAppData) return [];
		return [
			[
				"chrome",
				"Google Chrome",
				path.join("Google", "Chrome", "User Data")
			],
			[
				"chrome-for-testing",
				"Google Chrome for Testing",
				path.join("Google", "Chrome for Testing", "User Data")
			],
			[
				"chromium",
				"Chromium",
				path.join("Chromium", "User Data")
			]
		].map(([product, label, suffix]) => ({
			product,
			label,
			userDataDir: path.join(localAppData, suffix),
			nativeManifestDir: ""
		}));
	}
	return [];
}
function stableChromeExtensionDir(deps = {}) {
	return path.join(path.resolve(deps.stateDir ?? resolveStateDir(deps.env)), "browser", "chrome-extension");
}
async function pathInfo(target) {
	try {
		return await fs$1.lstat(target);
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function assertOwnedPath(target, kind, policy = {}) {
	const info = await fs$1.lstat(target);
	if (info.isSymbolicLink() || (kind === "file" ? !info.isFile() : !info.isDirectory())) throw new Error(`Unsafe ${kind} at ${target}`);
	if (process.platform !== "win32") {
		const uid = process.getuid?.();
		if (!(uid === void 0 || info.uid === uid || policy.allowRootOwner === true && info.uid === 0)) throw new Error(`Refusing foreign owner at ${target}`);
		if ((info.mode & 18) !== 0) throw new Error(`Refusing group/world-writable path at ${target}`);
	}
	if (await fs$1.realpath(target) !== path.resolve(target)) throw new Error(`Refusing non-canonical path at ${target}`);
}
async function ensurePrivateDirectory(target) {
	await fs$1.mkdir(target, {
		recursive: true,
		mode: 448
	});
	await assertOwnedPath(target, "directory");
	if (process.platform !== "win32") await fs$1.chmod(target, 448);
}
async function inspectInstalledCopy(target) {
	if (!await pathInfo(target)) return {
		present: false,
		owned: false
	};
	await assertOwnedPath(target, "directory");
	const markerPath = path.join(target, OWNED_COPY_MARKER);
	try {
		await assertOwnedPath(markerPath, "file");
		const marker = JSON.parse(await fs$1.readFile(markerPath, "utf8"));
		return {
			present: true,
			owned: Boolean(marker) && typeof marker === "object" && !Array.isArray(marker) && marker.v === 1
		};
	} catch {
		return {
			present: true,
			owned: false
		};
	}
}
async function copyRuntimeTree(source, target) {
	await ensurePrivateDirectory(target);
	for (const entry of await fs$1.readdir(source, { withFileTypes: true })) {
		if (/(?:sidepanel|copilot|page-share)/iu.test(entry.name) || entry.name.endsWith(".test.ts") || entry.name.endsWith(".test-support.ts") || entry.name.endsWith(".test-harness.ts") || entry.name.endsWith(".d.ts")) continue;
		const sourcePath = path.join(source, entry.name);
		const targetPath = path.join(target, entry.name);
		if (entry.isSymbolicLink()) throw new Error(`Refusing symlink in bundled Chrome extension: ${sourcePath}`);
		if (entry.isDirectory()) await copyRuntimeTree(sourcePath, targetPath);
		else if (entry.isFile()) {
			await fs$1.copyFile(sourcePath, targetPath, constants.COPYFILE_EXCL);
			if (process.platform !== "win32") await fs$1.chmod(targetPath, 384);
		}
	}
}
/** Copy/update the bundled extension with rollback-safe same-directory renames. */
async function installStableChromeExtension(bundledDir, deps = {}) {
	const source = await fs$1.realpath(path.resolve(bundledDir));
	await assertOwnedPath(source, "directory", { allowRootOwner: true });
	const target = stableChromeExtensionDir(deps);
	await ensurePrivateDirectory(path.resolve(deps.stateDir ?? resolveStateDir(deps.env)));
	await ensurePrivateDirectory(path.dirname(target));
	const existing = await inspectInstalledCopy(target);
	if (existing.present && !existing.owned) throw new Error(`Refusing to overwrite foreign Chrome extension directory: ${target}`);
	const suffix = `${process.pid}-${crypto.randomBytes(6).toString("hex")}`;
	const temporary = `${target}.tmp-${suffix}`;
	const previous = `${target}.previous-${suffix}`;
	try {
		await copyRuntimeTree(source, temporary);
		await fs$1.writeFile(path.join(temporary, OWNED_COPY_MARKER), `${JSON.stringify({
			v: 1,
			owner: "openclaw"
		})}\n`, {
			mode: 384,
			flag: "wx"
		});
		if (existing.present) await fs$1.rename(target, previous);
		try {
			await fs$1.rename(temporary, target);
		} catch (error) {
			if (existing.present) await fs$1.rename(previous, target).catch(() => void 0);
			throw error;
		}
		if (existing.present) await fs$1.rm(previous, {
			recursive: true,
			force: true
		});
		return await fs$1.realpath(target);
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
function comparablePath(value, platform) {
	const resolved = path.resolve(value);
	return platform === "win32" ? resolved.toLowerCase() : resolved;
}
async function approvedRealpaths(paths) {
	const resolved = await Promise.all(paths.map(async (candidate) => await fs$1.realpath(candidate).catch(() => null)));
	return [...new Set(resolved.filter((value) => value !== null))];
}
/** Discover unpacked OpenClaw IDs from exact Secure Preferences path records. */
async function discoverChromeExtensionIds(params) {
	const deps = params.deps ?? {};
	const platform = deps.platform ?? process.platform;
	const approved = new Set((await approvedRealpaths(params.approvedDirs)).map((value) => comparablePath(value, platform)));
	const discovered = [];
	const issues = [];
	const identityMismatches = [];
	for (const root of chromeProductRoots(deps)) {
		if (!await pathInfo(root.userDataDir)) continue;
		try {
			await assertOwnedPath(root.userDataDir, "directory");
		} catch (error) {
			issues.push(`${root.label}: ${error instanceof Error ? error.message : String(error)}`);
			continue;
		}
		let profiles;
		try {
			profiles = await fs$1.readdir(root.userDataDir, { withFileTypes: true });
		} catch (error) {
			issues.push(`${root.label}: could not list profiles (${String(error)})`);
			continue;
		}
		for (const profileEntry of profiles) {
			if (!profileEntry.isDirectory() || profileEntry.isSymbolicLink()) continue;
			const profileDir = path.join(root.userDataDir, profileEntry.name);
			const securePreferencesPath = path.join(profileDir, "Secure Preferences");
			const secureInfo = await pathInfo(securePreferencesPath);
			if (!secureInfo) continue;
			try {
				await assertOwnedPath(profileDir, "directory");
				await assertOwnedPath(securePreferencesPath, "file");
				if (secureInfo.size > SECURE_PREFERENCES_MAX_BYTES) throw new Error("Secure Preferences exceeds the 32 MiB inspection limit");
				const settings = JSON.parse(await fs$1.readFile(securePreferencesPath, "utf8"))?.extensions?.settings;
				if (!settings || typeof settings !== "object" || Array.isArray(settings)) continue;
				for (const [extensionId, rawEntry] of Object.entries(settings)) {
					if (!EXTENSION_ID_PATTERN.test(extensionId) || !rawEntry || typeof rawEntry !== "object") continue;
					const entry = rawEntry;
					if (entry.location !== UNPACKED_MANIFEST_LOCATION || typeof entry.path !== "string") continue;
					const recordedPath = path.isAbsolute(entry.path) ? entry.path : path.join(profileDir, "Extensions", entry.path);
					const canonicalPath = await fs$1.realpath(recordedPath).catch(() => null);
					if (!canonicalPath || !approved.has(comparablePath(canonicalPath, platform))) continue;
					const predictedId = generateChromeExtensionIdForPath(canonicalPath, platform);
					if (extensionId !== predictedId) {
						const issue = `${root.label} profile ${profileEntry.name}: unpacked extension ID ${extensionId} does not match predicted ID ${predictedId} for ${canonicalPath}`;
						issues.push(issue);
						identityMismatches.push(issue);
						continue;
					}
					discovered.push({
						product: root.product,
						browser: root.label,
						userDataDir: root.userDataDir,
						profile: profileEntry.name,
						securePreferencesPath,
						extensionId,
						extensionPath: canonicalPath
					});
				}
			} catch (error) {
				issues.push(`${root.label} profile ${profileEntry.name}: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	}
	return {
		discovered: [...new Map(discovered.map((entry) => [`${entry.product}\0${entry.profile}\0${entry.extensionId}\0${entry.extensionPath}`, entry])).values()].toSorted((a, b) => `${a.product}/${a.profile}/${a.extensionId}`.localeCompare(`${b.product}/${b.profile}/${b.extensionId}`)),
		issues,
		identityMismatches
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-install.ts
const OWNED_LAUNCHER_MARKER = "# OpenClaw native messaging bootstrap v1";
const BROWSER_EXTENSION_INSTALL_WAIT_DEFAULT_MS = 3e4;
const BROWSER_EXTENSION_INSTALL_WAIT_MIN_MS = 1e3;
const BROWSER_EXTENSION_INSTALL_WAIT_MAX_MS = 12e4;
const NATIVE_HOST_DESCRIPTION = "OpenClaw browser extension bootstrap";
function nativeMessagingRoot(deps = {}) {
	return path.join(resolveInstallStateDir(deps), "browser", "native-messaging");
}
function resolveInstallStateDir(deps) {
	return path.resolve(deps.stateDir ?? resolveStateDir(deps.env));
}
function resolveInstallConfigPath(deps) {
	const env = deps.env ?? process.env;
	const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
	return explicit ? resolveStateDir({
		...env,
		OPENCLAW_STATE_DIR: explicit
	}) : void 0;
}
function shellQuote(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
async function resolveNativeHostPath(pluginRoot, explicit) {
	if (explicit) return await fs$1.realpath(explicit);
	const resolvedPluginRoot = path.resolve(pluginRoot);
	const candidates = [path.join(resolvedPluginRoot, "native-host-entry.js")];
	let cursor = resolvedPluginRoot;
	for (;;) {
		candidates.push(path.join(cursor, "dist", "extensions", "browser", "native-host-entry.js"));
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	for (const candidate of candidates) if (await pathInfo(candidate)) return await fs$1.realpath(candidate);
	throw new Error("Could not resolve the built browser native-host entrypoint; run pnpm build.");
}
function launcherPathForManifest(manifestPath, deps) {
	const suffix = crypto.createHash("sha256").update(manifestPath).digest("hex").slice(0, 16);
	return path.join(nativeMessagingRoot(deps), `${BROWSER_NATIVE_HOST_NAME}.${suffix}.sh`);
}
function expectedOriginsForExtensionIds(extensionIds) {
	return [...new Set(extensionIds)].toSorted().map((extensionId) => `chrome-extension://${extensionId}/`);
}
async function resolveLauncherInstall(params) {
	const launcherPath = launcherPathForManifest(params.manifestPath, params.deps);
	const nodePath = await fs$1.realpath(params.deps.nodePath ?? process.execPath);
	const nativeHostPath = await resolveNativeHostPath(params.pluginRoot, params.deps.nativeHostPath);
	await assertOwnedPath(nodePath, "file", { allowRootOwner: true });
	await assertOwnedPath(nativeHostPath, "file", { allowRootOwner: true });
	const command = [
		nodePath,
		nativeHostPath,
		"--manifest",
		params.manifestPath,
		"--launcher",
		launcherPath,
		...expectedOriginsForExtensionIds(params.extensionIds).flatMap((origin) => ["--expected-origin", origin])
	];
	const configPath = resolveInstallConfigPath(params.deps);
	return {
		path: launcherPath,
		content: [
			"#!/bin/sh",
			OWNED_LAUNCHER_MARKER,
			`export OPENCLAW_STATE_DIR=${shellQuote(resolveInstallStateDir(params.deps))}`,
			...configPath ? [`export OPENCLAW_CONFIG_PATH=${shellQuote(configPath)}`] : [],
			`exec ${command.map(shellQuote).join(" ")} "$@"`,
			""
		].join("\n")
	};
}
async function inspectRegistration(root, deps, expectedExtensionIds) {
	const manifestPath = path.join(root.nativeManifestDir, `${BROWSER_NATIVE_HOST_NAME}.json`);
	if (!await pathInfo(manifestPath)) return {
		product: root.product,
		browser: root.label,
		manifestPath,
		extensionIds: [],
		state: "missing"
	};
	try {
		await assertOwnedPath(manifestPath, "file");
		const parsed = JSON.parse(await fs$1.readFile(manifestPath, "utf8"));
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("manifest is not an object");
		const manifest = parsed;
		const expectedLauncher = launcherPathForManifest(manifestPath, deps);
		const origins = Array.isArray(manifest.allowed_origins) ? manifest.allowed_origins : [];
		const ids = origins.flatMap((origin) => {
			const match = /^chrome-extension:\/\/([a-p]{32})\/$/.exec(String(origin));
			return match?.[1] ? [match[1]] : [];
		});
		if (manifest.name !== "ai.openclaw.browser_bootstrap" || manifest.path !== expectedLauncher) return {
			product: root.product,
			browser: root.label,
			manifestPath,
			extensionIds: ids,
			state: "foreign",
			issue: "same host name is registered to a foreign manifest or launcher"
		};
		const exactKeys = [
			"name",
			"description",
			"path",
			"type",
			"allowed_origins"
		];
		const validOrigins = origins.length > 0 && origins.every((origin) => typeof origin === "string" && /^chrome-extension:\/\/[a-p]{32}\/$/u.test(origin)) && new Set(origins).size === origins.length;
		const expectedOrigins = expectedExtensionIds ? expectedOriginsForExtensionIds(expectedExtensionIds) : null;
		if (Object.keys(manifest).length !== exactKeys.length || !exactKeys.every((key) => Object.hasOwn(manifest, key)) || manifest.description !== NATIVE_HOST_DESCRIPTION || manifest.type !== "stdio" || !validOrigins || expectedOrigins !== null && JSON.stringify(origins) !== JSON.stringify(expectedOrigins)) throw new Error("native host manifest does not contain exact allowed origins");
		await assertOwnedPath(expectedLauncher, "file");
		if (!(await fs$1.readFile(expectedLauncher, "utf8")).includes(OWNED_LAUNCHER_MARKER)) throw new Error("launcher ownership marker is missing");
		return {
			product: root.product,
			browser: root.label,
			manifestPath,
			extensionIds: ids.toSorted(),
			state: "owned"
		};
	} catch (error) {
		return {
			product: root.product,
			browser: root.label,
			manifestPath,
			extensionIds: [],
			state: "invalid",
			issue: error instanceof Error ? error.message : String(error)
		};
	}
}
async function installRegistration(params) {
	const { root, extensionIds, deps } = params;
	const manifestPath = path.join(root.nativeManifestDir, `${BROWSER_NATIVE_HOST_NAME}.json`);
	const existing = await inspectRegistration(root, deps, extensionIds);
	if (existing.state === "foreign" || existing.state === "invalid") throw new Error(`Refusing to overwrite ${existing.state} native host: ${manifestPath}`);
	await ensurePrivateDirectory(nativeMessagingRoot(deps));
	await ensurePrivateDirectory(root.nativeManifestDir);
	const launcher = await resolveLauncherInstall({
		manifestPath,
		pluginRoot: params.pluginRoot,
		extensionIds,
		deps
	});
	const launcherPath = launcher.path;
	if (await pathInfo(launcherPath)) {
		await assertOwnedPath(launcherPath, "file");
		const existingLauncher = await fs$1.readFile(launcherPath, "utf8");
		if (!existingLauncher.includes(OWNED_LAUNCHER_MARKER)) throw new Error(`Refusing to overwrite foreign native host launcher: ${launcherPath}`);
		if (existingLauncher !== launcher.content) {
			const replacement = `${launcherPath}.tmp-${process.pid}`;
			await fs$1.writeFile(replacement, launcher.content, {
				mode: 448,
				flag: "wx"
			});
			await fs$1.rename(replacement, launcherPath);
		}
	} else await fs$1.writeFile(launcherPath, launcher.content, {
		mode: 448,
		flag: "wx"
	});
	if (process.platform !== "win32") await fs$1.chmod(launcherPath, 448);
	const manifest = {
		name: BROWSER_NATIVE_HOST_NAME,
		description: NATIVE_HOST_DESCRIPTION,
		path: launcherPath,
		type: "stdio",
		allowed_origins: expectedOriginsForExtensionIds(extensionIds)
	};
	const temporary = `${manifestPath}.tmp-${process.pid}-${crypto.randomBytes(4).toString("hex")}`;
	await fs$1.writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, {
		mode: 384,
		flag: "wx"
	});
	await fs$1.rename(temporary, manifestPath);
	if (process.platform !== "win32") await fs$1.chmod(manifestPath, 384);
	return await inspectRegistration(root, deps, extensionIds);
}
async function approvedInstallRealpaths(installed, bundled) {
	const installedPath = await fs$1.realpath(installed);
	const bundledPath = await fs$1.realpath(bundled);
	await assertOwnedPath(installedPath, "directory");
	await assertOwnedPath(bundledPath, "directory", { allowRootOwner: true });
	return [.../* @__PURE__ */ new Set([installedPath, bundledPath])];
}
function normalizeExtensionInstallWaitMs(value) {
	if (value === void 0) return BROWSER_EXTENSION_INSTALL_WAIT_DEFAULT_MS;
	const parsed = typeof value === "number" ? value : Number(value);
	if (!Number.isInteger(parsed) || parsed < BROWSER_EXTENSION_INSTALL_WAIT_MIN_MS || parsed > BROWSER_EXTENSION_INSTALL_WAIT_MAX_MS) throw new Error(`--wait-ms must be an integer from ${BROWSER_EXTENSION_INSTALL_WAIT_MIN_MS} to ${BROWSER_EXTENSION_INSTALL_WAIT_MAX_MS}`);
	return parsed;
}
/** Copy, pre-register deterministic IDs, then verify Chrome's recorded identity. */
async function installChromeExtensionBootstrap(params) {
	const deps = params.deps ?? {};
	const platform = deps.platform ?? process.platform;
	const installed = await installStableChromeExtension(params.bundledDir, deps);
	if (platform === "win32") return await browserExtensionStatus({
		bundledDir: params.bundledDir,
		deps
	});
	const approvedPaths = await approvedInstallRealpaths(installed, params.bundledDir);
	const predictedIds = [...new Set(approvedPaths.map((candidate) => generateChromeExtensionIdForPath(candidate, platform)))].toSorted();
	const preRegistrationIssues = [];
	let preRegisteredRoots = 0;
	for (const root of chromeProductRoots(deps)) {
		if (!await pathInfo(root.userDataDir)) continue;
		try {
			await assertOwnedPath(root.userDataDir, "directory");
			await installRegistration({
				root,
				extensionIds: predictedIds,
				pluginRoot: params.pluginRoot,
				deps
			});
			preRegisteredRoots += 1;
			params.onProgress?.(`Pre-registered the native host for ${root.label}.`);
		} catch (error) {
			preRegistrationIssues.push(`${root.label}: native host pre-registration refused (${error instanceof Error ? error.message : String(error)})`);
		}
	}
	if (preRegisteredRoots > 0) params.onProgress?.(`Native bootstrap is ready. In Chrome, use chrome://extensions → Developer mode → Load unpacked → ${installed}`);
	else preRegistrationIssues.push("No existing Chrome-family user-data directory was available for native host pre-registration. Launch Chrome, then run install again before loading the extension.");
	const waitMs = normalizeExtensionInstallWaitMs(params.waitMs);
	const now = deps.now ?? Date.now;
	const sleep = deps.sleep ?? ((ms) => new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const deadline = now() + waitMs;
	let discovery = await discoverChromeExtensionIds({
		approvedDirs: approvedPaths,
		deps
	});
	let announcedWait = false;
	while (discovery.discovered.length === 0 && now() < deadline) {
		if (!announcedWait) {
			params.onProgress?.("Waiting for Chrome to verify the unpacked OpenClaw extension…");
			announcedWait = true;
		}
		await sleep(Math.min(500, Math.max(1, deadline - now())));
		discovery = await discoverChromeExtensionIds({
			approvedDirs: approvedPaths,
			deps
		});
	}
	const status = await browserExtensionStatus({
		bundledDir: params.bundledDir,
		deps
	});
	return {
		...status,
		issues: [.../* @__PURE__ */ new Set([...preRegistrationIssues, ...status.issues])]
	};
}
/** Read-only extension copy, profile discovery, and native registration report. */
async function browserExtensionStatus(params) {
	const deps = params.deps ?? {};
	const platform = deps.platform ?? process.platform;
	const installedPath = stableChromeExtensionDir(deps);
	const installedCopy = await inspectInstalledCopy(installedPath);
	const bundledPath = await fs$1.realpath(params.bundledDir);
	await assertOwnedPath(bundledPath, "directory", { allowRootOwner: true });
	const approvedPaths = installedCopy.owned ? await approvedInstallRealpaths(installedPath, bundledPath) : [bundledPath];
	const discovery = await discoverChromeExtensionIds({
		approvedDirs: approvedPaths,
		deps
	});
	const predictedIds = [...new Set(approvedPaths.map((candidate) => generateChromeExtensionIdForPath(candidate, platform)))].toSorted();
	const registrations = platform === "win32" ? [] : await Promise.all(chromeProductRoots(deps).map((root) => inspectRegistration(root, deps, predictedIds)));
	const missingRegistration = chromeProductRoots(deps).some((root) => {
		if (!discovery.discovered.some((entry) => entry.product === root.product)) return false;
		const manifestPath = path.join(root.nativeManifestDir, `${BROWSER_NATIVE_HOST_NAME}.json`);
		const registration = registrations.find((entry) => entry.manifestPath === manifestPath);
		return registration?.state !== "owned" || JSON.stringify(registration.extensionIds) !== JSON.stringify(predictedIds);
	});
	return {
		platform,
		platformSupport: platform === "win32" ? "manual_required" : "automatic",
		installedCopy: {
			path: installedPath,
			...installedCopy
		},
		bundledPath: path.resolve(params.bundledDir),
		approvedPaths,
		discovered: discovery.discovered,
		registrations,
		manualSetupRequired: platform === "win32" || installedCopy.present && !installedCopy.owned || discovery.discovered.length === 0 || discovery.identityMismatches.length > 0 || missingRegistration,
		issues: [
			...installedCopy.present && !installedCopy.owned ? [`Chrome extension copy is not OpenClaw-owned: ${installedPath}`] : [],
			...discovery.issues,
			...registrations.flatMap((entry) => entry.issue ? [`${entry.browser}: ${entry.issue}`] : [])
		]
	};
}
/** Remove only registrations and launchers that carry OpenClaw ownership. */
async function uninstallChromeExtensionNativeHosts(params = {}) {
	const deps = params.deps ?? {};
	if ((deps.platform ?? process.platform) === "win32") return {
		removed: [],
		refused: [],
		manualRequired: true
	};
	const removed = [];
	const refused = [];
	for (const root of chromeProductRoots(deps)) {
		const status = await inspectRegistration(root, deps);
		if (status.state === "missing") continue;
		if (status.state !== "owned") {
			refused.push(status.manifestPath);
			continue;
		}
		const launcherPath = launcherPathForManifest(status.manifestPath, deps);
		const launcher = await pathInfo(launcherPath);
		if (launcher) {
			await assertOwnedPath(launcherPath, "file");
			if (!(await fs$1.readFile(launcherPath, "utf8")).includes(OWNED_LAUNCHER_MARKER)) {
				refused.push(launcherPath);
				continue;
			}
		}
		await fs$1.unlink(status.manifestPath);
		removed.push(status.manifestPath);
		if (launcher) {
			await fs$1.unlink(launcherPath);
			removed.push(launcherPath);
		}
	}
	return {
		removed,
		refused,
		manualRequired: false
	};
}
/** Resolve the installed stable copy when present, bundled source otherwise. */
async function resolveChromeExtensionLoadPath(bundledDir, deps = {}) {
	const installedPath = stableChromeExtensionDir(deps);
	const installed = await inspectInstalledCopy(installedPath);
	if (installed.present) {
		if (!installed.owned) throw new Error(`Refusing foreign Chrome extension directory: ${installedPath}`);
		return await fs$1.realpath(installedPath);
	}
	const bundledPath = await fs$1.realpath(path.resolve(bundledDir));
	await assertOwnedPath(bundledPath, "directory", { allowRootOwner: true });
	return bundledPath;
}
/** Repair drift only when both the copy and existing registration are already owned. */
async function repairOwnedChromeExtensionNativeHosts(params) {
	const deps = params.deps ?? {};
	if ((deps.platform ?? process.platform) === "win32") return {
		changes: [],
		warnings: []
	};
	const before = await browserExtensionStatus({
		bundledDir: params.bundledDir,
		deps
	});
	if (!before.installedCopy.owned || before.discovered.length === 0) return {
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	const predictedIds = before.approvedPaths.map((candidate) => generateChromeExtensionIdForPath(candidate, deps.platform ?? process.platform)).toSorted();
	for (const root of chromeProductRoots(deps)) {
		const manifestPath = path.join(root.nativeManifestDir, `${BROWSER_NATIVE_HOST_NAME}.json`);
		const registration = before.registrations.find((entry) => entry.manifestPath === manifestPath);
		if (!before.discovered.some((entry) => entry.product === root.product)) continue;
		if (registration?.state === "foreign" || registration?.state === "invalid") {
			warnings.push(`${root.label} native host repair refused: ${registration.issue ?? registration.state}`);
			continue;
		}
		if (registration?.state !== "owned") continue;
		try {
			const launcher = await resolveLauncherInstall({
				manifestPath,
				pluginRoot: params.pluginRoot,
				extensionIds: predictedIds,
				deps
			});
			await assertOwnedPath(launcher.path, "file");
			const idsAreCurrent = JSON.stringify(registration.extensionIds) === JSON.stringify(predictedIds);
			const launcherIsCurrent = await fs$1.readFile(launcher.path, "utf8") === launcher.content;
			if (idsAreCurrent && launcherIsCurrent) continue;
			await installRegistration({
				root,
				extensionIds: predictedIds,
				pluginRoot: params.pluginRoot,
				deps
			});
			changes.push(`Repaired ${root.label} OpenClaw native messaging registration.`);
		} catch (error) {
			warnings.push(`${root.label} native host repair failed: ${String(error)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
//#endregion
export { resolveChromeExtensionLoadPath as a, repairOwnedChromeExtensionNativeHosts as i, installChromeExtensionBootstrap as n, uninstallChromeExtensionNativeHosts as o, normalizeExtensionInstallWaitMs as r, browserExtensionStatus as t };
