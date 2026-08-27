import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { i as normalizeLegacyDotBetaVersion, n as compareValidSemver } from "./semver-aYpwYdrQ.js";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-BdgyvSs0.js";
import { i as cancelUnreadResponseBody } from "./http-body-DthsuKdw.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-BXG5plR9.js";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BIltidPw.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import "./git-exec-DxrjoMs4.js";
import { a as channelToNpmTag, n as DEV_BRANCH, u as resolveDevUpstreamRefs } from "./update-channels-D2-WrHya.js";
import { t as readPackageManagerSpec } from "./package-json-BoWJND-q.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/detect-package-manager.ts
async function exists$1(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}
/** Resolves Bun's global project from its installed owner rather than unrelated caller settings. */
function resolveBunGlobalInstallOwner(pkgRoot, env = process.env) {
	const configuredInstall = env.BUN_INSTALL?.trim();
	const configuredGlobalProject = env.BUN_INSTALL_GLOBAL_DIR?.trim();
	if (pkgRoot == null) {
		const bunInstall = configuredInstall || path.join(os.homedir(), ".bun");
		const globalProjectRoot = path.resolve(configuredGlobalProject || path.join(bunInstall, "install", "global"));
		return {
			globalRoot: path.join(globalProjectRoot, "node_modules"),
			globalProjectRoot,
			...!configuredGlobalProject || configuredInstall ? { bunInstall: path.resolve(bunInstall) } : {}
		};
	}
	const trimmed = pkgRoot.trim();
	if (!trimmed) return null;
	let globalRoot = path.dirname(path.resolve(trimmed));
	if (path.basename(globalRoot).startsWith("@")) globalRoot = path.dirname(globalRoot);
	if (path.basename(globalRoot) !== "node_modules") return null;
	const globalProjectRoot = path.dirname(globalRoot);
	const installRoot = path.dirname(globalProjectRoot);
	const conventionalLayout = path.basename(globalProjectRoot) === "global" && path.basename(installRoot) === "install";
	const configuredProjectMatches = configuredGlobalProject !== void 0 && path.resolve(configuredGlobalProject) === globalProjectRoot;
	if (!conventionalLayout && !configuredProjectMatches) return null;
	const bunInstall = conventionalLayout ? path.dirname(installRoot) : configuredInstall;
	return {
		globalRoot,
		globalProjectRoot,
		...bunInstall ? { bunInstall: path.resolve(bunInstall) } : {}
	};
}
function resolvePnpmNodeModulesRoot(root) {
	const resolved = path.resolve(root);
	const parts = resolved.split(path.sep);
	const pnpmIndex = parts.lastIndexOf(".pnpm");
	if (pnpmIndex > 0) {
		const layoutRoot = parts.slice(0, pnpmIndex).join(path.sep) || path.sep;
		return path.basename(layoutRoot) === "node_modules" ? layoutRoot : path.join(layoutRoot, "node_modules");
	}
	const parent = path.dirname(resolved);
	return path.basename(parent) === "node_modules" ? parent : null;
}
async function isBunOwnedPackageRoot(root) {
	return resolveBunGlobalInstallOwner(root) !== null;
}
async function isPnpmOwnedPackageRoot(root) {
	const nodeModulesRoot = resolvePnpmNodeModulesRoot(root);
	if (!nodeModulesRoot || !await exists$1(path.join(nodeModulesRoot, ".modules.yaml"))) return false;
	return true;
}
/** Detects the package manager that owns a package root from manifests, locks, and install layout. */
async function detectPackageManager$1(root) {
	const pm = (await readPackageManagerSpec(root))?.split("@")[0]?.trim();
	const files = await fs.readdir(root).catch(() => []);
	const hasNpmShrinkwrap = files.includes("npm-shrinkwrap.json");
	const hasPnpmLock = files.includes("pnpm-lock.yaml");
	const hasBunLock = files.includes("bun.lock") || files.includes("bun.lockb");
	if (await isBunOwnedPackageRoot(root)) return "bun";
	if (hasNpmShrinkwrap) {
		if (pm === "pnpm" && (hasPnpmLock || await isPnpmOwnedPackageRoot(root))) return "pnpm";
		if (pm === "bun" && hasBunLock) return "bun";
		return "npm";
	}
	if (pm === "pnpm" || pm === "bun" || pm === "npm") return pm;
	if (hasPnpmLock) return "pnpm";
	if (hasBunLock) return "bun";
	if (files.includes("package-lock.json") || hasNpmShrinkwrap) return "npm";
	return null;
}
//#endregion
//#region src/state/openclaw-schema-versions.ts
function parseOpenClawSchemaVersions(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	if (!Number.isInteger(record.state) || record.state < 0 || !Number.isInteger(record.agent) || record.agent < 0) return;
	return {
		state: record.state,
		agent: record.agent
	};
}
function parsePackageOpenClawSchemaVersions(packageJson) {
	if (!packageJson || typeof packageJson !== "object" || Array.isArray(packageJson)) return;
	const openclaw = packageJson.openclaw;
	if (!openclaw || typeof openclaw !== "object" || Array.isArray(openclaw)) return;
	return parseOpenClawSchemaVersions(openclaw.schemaVersions);
}
//#endregion
//#region src/infra/update-check-package-target.ts
function parseNpmPackageTargetMetadata(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw.trim());
	} catch (err) {
		throw new Error(`npm view returned invalid JSON: ${String(err)}`, { cause: err });
	}
	const entry = Array.isArray(parsed) && parsed.length === 1 ? parsed[0] : parsed;
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return {
		version: null,
		nodeEngine: null
	};
	const rec = entry;
	const engines = rec.engines && typeof rec.engines === "object" ? rec.engines : null;
	const nodeEngine = normalizeNullableString(rec["engines.node"]) ?? (engines ? normalizeNullableString(engines.node) : null);
	const openclaw = rec.openclaw && typeof rec.openclaw === "object" ? rec.openclaw : null;
	const schemaVersions = parseOpenClawSchemaVersions(rec["openclaw.schemaVersions"]) ?? (openclaw ? parseOpenClawSchemaVersions(openclaw.schemaVersions) : void 0);
	return {
		version: normalizeNullableString(rec.version),
		nodeEngine,
		...schemaVersions ? { schemaVersions } : {}
	};
}
function formatNpmViewError(res) {
	const raw = (res.stderr.trim() || res.stdout.trim()).split("\n").slice(-3).join("\n");
	return raw ? `npm view failed: ${raw}` : "npm view failed";
}
function packageTargetSpec(params) {
	return params.spec?.trim() || `openclaw@${params.target.trim() || "latest"}`;
}
const PUBLIC_NPM_REGISTRY_URL$1 = "https://registry.npmjs.org/";
const PUBLIC_NPM_PACKAGE_NAME$1 = "openclaw";
function npmRegistryTargetUrl(params) {
	const baseUrl = params.registryUrl.endsWith("/") ? params.registryUrl : `${params.registryUrl}/`;
	return new URL(`${encodeURIComponent(params.packageName)}/${encodeURIComponent(params.target)}`, baseUrl).toString();
}
async function fetchNpmPackageTargetStatusFromRegistry(params) {
	const url = npmRegistryTargetUrl({
		registryUrl: params.registryUrl ?? PUBLIC_NPM_REGISTRY_URL$1,
		packageName: params.packageName ?? PUBLIC_NPM_PACKAGE_NAME$1,
		target: params.target
	});
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: Math.max(250, params.timeoutMs),
		operation: "npm-registry-update-check",
		url
	});
	let res;
	try {
		res = await fetch(url, { signal });
		if (!res.ok) return {
			target: params.target,
			version: null,
			nodeEngine: null,
			error: `HTTP ${res.status}`
		};
		const json = await readProviderJsonResponse(res, "npm package target status");
		const schemaVersions = parseOpenClawSchemaVersions(json.openclaw?.schemaVersions);
		return {
			target: params.target,
			version: normalizeNullableString(json.version),
			nodeEngine: normalizeNullableString(json.engines?.node),
			...schemaVersions ? { schemaVersions } : {}
		};
	} catch (err) {
		return {
			target: params.target,
			version: null,
			nodeEngine: null,
			error: String(err)
		};
	} finally {
		await cancelUnreadResponseBody(res);
		cleanup();
	}
}
async function fetchNpmPackageTargetStatus(params) {
	const timeoutMs = params.timeoutMs ?? 3500;
	const target = params.target;
	if (!params.command && !params.runCommand) return await fetchNpmPackageTargetStatusFromRegistry({
		target,
		timeoutMs,
		registryUrl: params.registryUrl,
		packageName: params.packageName
	});
	const runCommand = params.runCommand ?? runCommandWithTimeout;
	try {
		const res = await runCommand([
			params.command ?? "npm",
			"view",
			packageTargetSpec({
				target,
				spec: params.spec
			}),
			"version",
			"engines.node",
			"openclaw.schemaVersions",
			"--json",
			"--global"
		], {
			timeoutMs: Math.max(250, timeoutMs),
			cwd: params.cwd,
			env: params.env,
			maxOutputBytes: 1024 * 1024
		});
		if (res.code !== 0) return {
			target,
			version: null,
			nodeEngine: null,
			error: formatNpmViewError(res)
		};
		const { version, nodeEngine, schemaVersions } = parseNpmPackageTargetMetadata(res.stdout);
		return {
			target,
			version,
			nodeEngine,
			...schemaVersions ? { schemaVersions } : {}
		};
	} catch (err) {
		return {
			target,
			version: null,
			nodeEngine: null,
			error: String(err)
		};
	}
}
//#endregion
//#region src/infra/update-check.ts
const PUBLIC_NPM_REGISTRY_URL = "https://registry.npmjs.org/";
const PUBLIC_NPM_PACKAGE_NAME = "openclaw";
function isLoopbackNpmRegistry(raw) {
	try {
		const url = new URL(raw);
		return (url.protocol === "http:" || url.protocol === "https:") && (url.hostname === "127.0.0.1" || url.hostname === "localhost" || url.hostname === "[::1]");
	} catch {
		return false;
	}
}
function resolveExtendedStableRegistryTarget(params) {
	const env = params.env ?? process.env;
	const packageName = params.packageName?.trim() || PUBLIC_NPM_PACKAGE_NAME;
	const packageSpecOverride = env.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim();
	const registryOverride = env.NPM_CONFIG_REGISTRY?.trim() || env.npm_config_registry?.trim() || "";
	if (packageSpecOverride === packageName && isLoopbackNpmRegistry(registryOverride)) return {
		registryUrl: registryOverride,
		packageName
	};
	return {
		registryUrl: PUBLIC_NPM_REGISTRY_URL,
		packageName: PUBLIC_NPM_PACKAGE_NAME
	};
}
/** Resolves the extended-stable selector and verifies its exact package manifest. */
async function resolveExtendedStablePackage(params) {
	if (params.installKind === "git") return {
		status: "failed",
		reason: "unsupported_git_channel"
	};
	const timeoutMs = params.timeoutMs ?? 3500;
	const registryTarget = resolveExtendedStableRegistryTarget(params);
	const selector = await fetchNpmPackageTargetStatus({
		target: "extended-stable",
		timeoutMs,
		...registryTarget
	});
	if (!selector.version) return {
		status: "failed",
		reason: selector.error === "HTTP 404" ? "selector_missing" : "selector_query_failed"
	};
	if ((await fetchNpmPackageTargetStatus({
		target: selector.version,
		timeoutMs,
		...registryTarget
	})).version !== selector.version) return {
		status: "failed",
		reason: "exact_package_mismatch"
	};
	return {
		status: "resolved",
		selector: "extended-stable",
		version: selector.version,
		packageSpec: `${registryTarget.packageName}@${selector.version}`
	};
}
function formatGitInstallLabel(update) {
	if (update.installKind !== "git") return null;
	const shortSha = update.git?.sha ? update.git.sha.slice(0, 8) : null;
	const branch = update.git?.branch && update.git.branch !== "HEAD" ? update.git.branch : null;
	const tag = update.git?.tag ?? null;
	return [
		branch ?? (tag ? "detached" : "git"),
		tag ? `tag ${tag}` : null,
		shortSha ? `@ ${shortSha}` : null
	].filter(Boolean).join(" · ");
}
async function exists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}
async function detectPackageManager(root) {
	return await detectPackageManager$1(root) ?? "unknown";
}
async function isLocklessOpenClawNpmInstall(params) {
	if (params.manager !== "pnpm" || await exists(path.join(params.root, "pnpm-lock.yaml"))) return false;
	try {
		if (JSON.parse(await fs.readFile(path.join(params.root, "package.json"), "utf8"))?.name !== "openclaw") return false;
		if (!resolvePnpmNodeModulesRoot(params.root) || await isPnpmOwnedPackageRoot(params.root) || await isBunOwnedPackageRoot(params.root)) return false;
		return true;
	} catch {
		return false;
	}
}
async function detectGitRoot(root) {
	const res = await runCommandWithTimeout([
		"git",
		"-C",
		root,
		"rev-parse",
		"--show-toplevel"
	], { timeoutMs: 4e3 }).catch(() => null);
	if (!res || res.code !== 0) return null;
	const top = res.stdout.trim();
	return top ? path.resolve(top) : null;
}
async function checkGitUpdateStatus(params) {
	const timeoutMs = params.timeoutMs ?? (params.fetch ? 12e4 : 6e3);
	const root = path.resolve(params.root);
	const runGit = (...args) => runCommandWithTimeout([
		"git",
		"-C",
		root,
		...args
	], { timeoutMs }).catch(() => null);
	const readGit = async (...args) => {
		const result = await runGit(...args);
		return result?.code === 0 ? result.stdout.trim() || null : null;
	};
	const base = {
		root,
		sha: null,
		tag: null,
		branch: null,
		upstream: null,
		upstreamSha: null,
		commitAtMs: null,
		dirty: null,
		ahead: null,
		behind: null,
		fetchOk: null
	};
	const [branchRes, sha, commitAtRaw, tag, dirtyRes] = await Promise.all([
		runGit("rev-parse", "--abbrev-ref", "HEAD"),
		readGit("rev-parse", "HEAD"),
		readGit("show", "-s", "--format=%ct", "HEAD"),
		readGit("describe", "--tags", "--exact-match"),
		runGit("status", "--porcelain", "--", ":!dist/control-ui/")
	]);
	if (!branchRes || branchRes.code !== 0) return {
		...base,
		error: branchRes?.stderr?.trim() || "git unavailable"
	};
	const branch = branchRes.stdout.trim() || null;
	const trackingRevisions = branch === "HEAD" ? params.useDetachedDevUpstream ? resolveDevUpstreamRefs(true, [`refs/remotes/origin/${DEV_BRANCH}`]) : [] : resolveDevUpstreamRefs(false);
	let tracking = null;
	for (const revision of trackingRevisions) {
		const display = await readGit("rev-parse", "--abbrev-ref", "--symbolic-full-name", revision);
		if (!display) continue;
		let fetch = "prune";
		if (branch === "HEAD") if (revision === `main@{upstream}`) {
			const [remote, mergeRef] = await Promise.all([readGit("config", "--get", `branch.${DEV_BRANCH}.remote`), readGit("config", "--get", `branch.${DEV_BRANCH}.merge`)]);
			if (!remote || !mergeRef) continue;
			fetch = {
				remote,
				mergeRef
			};
		} else fetch = {
			remote: "origin",
			mergeRef: `refs/heads/${DEV_BRANCH}`
		};
		tracking = {
			revision,
			display,
			fetch
		};
		break;
	}
	const commitAtSeconds = Number.parseInt(commitAtRaw ?? "", 10);
	const commitAtMs = Number.isSafeInteger(commitAtSeconds) ? commitAtSeconds * 1e3 : null;
	const receiptUpstream = !tracking && branch === "HEAD" && sha && params.upstreamFallback?.currentSha.trim().toLowerCase() === sha.toLowerCase() ? params.upstreamFallback.upstreamRef.trim() || null : null;
	const upstream = tracking?.display ?? receiptUpstream;
	const upstreamSource = tracking ? "tracking" : receiptUpstream ? "receipt" : void 0;
	const dirty = dirtyRes && dirtyRes.code === 0 ? dirtyRes.stdout.trim().length > 0 : null;
	const fetchTarget = tracking?.fetch && tracking.fetch !== "prune" ? [
		"--",
		tracking.fetch.remote,
		`+${tracking.fetch.mergeRef}:refs/remotes/${tracking.display}`
	] : ["--prune"];
	const fetchOk = params.fetch ? (await runGit("fetch", "--quiet", ...fetchTarget))?.code === 0 : null;
	const upstreamRevision = `${upstreamSource === "tracking" ? tracking?.revision : upstream}^{commit}`;
	const upstreamCommit = (!params.fetch || fetchOk === true) && upstream && sha ? await readGit("rev-parse", "--verify", upstreamRevision) : null;
	const mergeBase = sha && upstreamCommit ? await readGit("merge-base", sha, upstreamCommit) : null;
	const parsed = (sha && upstreamCommit && mergeBase ? await readGit("rev-list", "--left-right", "--count", `${sha}...${upstreamCommit}`) : null)?.match(/^(\d+)\s+(\d+)$/u);
	return {
		root,
		sha,
		tag,
		branch,
		upstream,
		...upstreamSource ? { upstreamSource } : {},
		upstreamSha: upstreamCommit,
		commitAtMs,
		dirty,
		ahead: parsed ? Number(parsed[1]) : null,
		behind: parsed ? Number(parsed[2]) : null,
		fetchOk
	};
}
async function resolveDepsMarker(params) {
	const root = params.root;
	if (params.manager === "pnpm") return {
		lockfilePath: path.join(root, "pnpm-lock.yaml"),
		markerPath: path.join(root, "node_modules", ".modules.yaml")
	};
	if (params.manager === "bun") {
		const textLockfilePath = path.join(root, "bun.lock");
		return {
			lockfilePath: await exists(textLockfilePath) ? textLockfilePath : path.join(root, "bun.lockb"),
			markerPath: path.join(root, "node_modules")
		};
	}
	if (params.manager === "npm") return {
		lockfilePath: path.join(root, "package-lock.json"),
		markerPath: path.join(root, "node_modules")
	};
	return {
		lockfilePath: null,
		markerPath: null
	};
}
async function checkDepsStatus(params) {
	const { lockfilePath, markerPath } = await resolveDepsMarker({
		root: path.resolve(params.root),
		manager: params.manager
	});
	if (!lockfilePath || !markerPath) return {
		manager: params.manager,
		status: "unknown",
		lockfilePath,
		markerPath,
		reason: "unknown package manager"
	};
	const lockExists = await exists(lockfilePath);
	const markerExists = await exists(markerPath);
	if (!lockExists) return {
		manager: params.manager,
		status: "unknown",
		lockfilePath,
		markerPath,
		reason: "lockfile missing"
	};
	if (!markerExists) return {
		manager: params.manager,
		status: "missing",
		lockfilePath,
		markerPath,
		reason: "node_modules marker missing"
	};
	return {
		manager: params.manager,
		status: "ok",
		lockfilePath,
		markerPath
	};
}
async function fetchNpmLatestVersion(params) {
	const res = await fetchNpmTagVersion({
		tag: "latest",
		timeoutMs: params?.timeoutMs,
		cwd: params?.cwd,
		env: params?.env,
		runCommand: params?.runCommand
	});
	return {
		latestVersion: res.version,
		error: res.error
	};
}
async function fetchNpmRegistryVersionForChannel(params) {
	const res = await resolveNpmChannelTag({
		channel: params.channel,
		timeoutMs: params.timeoutMs,
		cwd: params.cwd,
		env: params.env,
		runCommand: params.runCommand
	});
	return {
		latestVersion: res.version,
		tag: res.tag,
		error: res.error,
		...res.reason ? {
			error: res.reason,
			reason: res.reason
		} : {}
	};
}
async function fetchNpmTagVersion(params) {
	const res = await fetchNpmPackageTargetStatus({
		target: params.tag,
		timeoutMs: params.timeoutMs,
		spec: params.spec,
		command: params.command,
		cwd: params.cwd,
		env: params.env,
		runCommand: params.runCommand
	});
	return {
		tag: params.tag,
		version: res.version,
		error: res.error
	};
}
async function resolveNpmChannelTag(params) {
	const channelTag = channelToNpmTag(params.channel);
	if (params.channel === "extended-stable") {
		const resolved = await resolveExtendedStablePackage({
			installKind: "package",
			timeoutMs: params.timeoutMs
		});
		return resolved.status === "resolved" ? {
			tag: resolved.selector,
			version: resolved.version
		} : {
			tag: channelTag,
			version: null,
			reason: resolved.reason
		};
	}
	const channelStatus = await fetchNpmTagVersion({
		tag: channelTag,
		timeoutMs: params.timeoutMs,
		command: params.command,
		cwd: params.cwd,
		env: params.env,
		runCommand: params.runCommand
	});
	if (params.channel !== "beta") return channelStatus;
	const latestStatus = await fetchNpmTagVersion({
		tag: "latest",
		timeoutMs: params.timeoutMs,
		command: params.command,
		cwd: params.cwd,
		env: params.env,
		runCommand: params.runCommand
	});
	if (!latestStatus.version) return channelStatus;
	if (!channelStatus.version) return latestStatus;
	const cmp = compareSemverStrings(channelStatus.version, latestStatus.version);
	if (cmp != null && cmp < 0) return latestStatus;
	return channelStatus;
}
function compareSemverStrings(a, b) {
	if (a && b) {
		const openClawReleaseCmp = compareOpenClawReleaseVersions(a, b);
		if (openClawReleaseCmp != null) return openClawReleaseCmp;
	}
	const normalizedA = a ? normalizeLegacyDotBetaVersion(a) : null;
	const normalizedB = b ? normalizeLegacyDotBetaVersion(b) : null;
	return normalizedA && normalizedB ? compareValidSemver(normalizedA, normalizedB) : null;
}
async function checkUpdateStatus(params) {
	const timeoutMs = params.timeoutMs ?? 6e3;
	const resolveRegistryChannel = (status) => params.registryChannel ?? params.resolveRegistryChannel?.(status);
	const fetchRegistry = (registryChannel) => registryChannel ? fetchNpmRegistryVersionForChannel({
		channel: registryChannel,
		timeoutMs
	}) : fetchNpmLatestVersion({ timeoutMs });
	const root = params.root ? path.resolve(params.root) : null;
	if (!root) {
		const registryChannel = resolveRegistryChannel({ installKind: "unknown" });
		return {
			root: null,
			installKind: "unknown",
			packageManager: "unknown",
			registry: params.includeRegistry ? await fetchRegistry(registryChannel) : void 0
		};
	}
	const rootRealpath = await fs.realpath(root).catch(() => root);
	const [detectedPackageManager, gitRoot] = await Promise.all([detectPackageManager(root), detectGitRoot(root)]);
	const isGit = gitRoot && path.resolve(gitRoot) === path.resolve(rootRealpath);
	const packageManager = !isGit && await isLocklessOpenClawNpmInstall({
		root,
		manager: detectedPackageManager
	}) ? "npm" : detectedPackageManager;
	const installKind = isGit ? "git" : "package";
	const [git, deps] = await Promise.all([isGit ? checkGitUpdateStatus({
		root,
		timeoutMs: params.timeoutMs,
		fetch: Boolean(params.fetchGit),
		useDetachedDevUpstream: params.useDetachedDevUpstream,
		upstreamFallback: params.gitUpstreamFallback
	}) : Promise.resolve(void 0), checkDepsStatus({
		root,
		manager: packageManager
	})]);
	const registryChannel = resolveRegistryChannel({
		installKind,
		git
	});
	return {
		root,
		installKind,
		packageManager,
		git,
		deps,
		registry: params.includeRegistry ? registryChannel === "extended-stable" && isGit ? {
			latestVersion: null,
			tag: "extended-stable",
			error: "unsupported_git_channel",
			reason: "unsupported_git_channel"
		} : await fetchRegistry(registryChannel) : void 0
	};
}
//#endregion
export { resolveExtendedStablePackage as a, parsePackageOpenClawSchemaVersions as c, formatGitInstallLabel as i, detectPackageManager$1 as l, compareSemverStrings as n, resolveNpmChannelTag as o, fetchNpmTagVersion as r, fetchNpmPackageTargetStatus as s, checkUpdateStatus as t, resolveBunGlobalInstallOwner as u };
