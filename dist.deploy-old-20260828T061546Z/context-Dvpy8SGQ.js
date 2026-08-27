import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CgCh8H_K.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { r as openRootFile } from "./root-file-B4L4VJ7-.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import "./boundary-file-read-h_n3tTfV.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { f as isSameSsrFPolicy } from "./ssrf-arYIaOWE.js";
import { r as withContainerEnvFile } from "./container-env-file-DfZQ-p50.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { n as readWorkspaceBootstrapFile, t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BswQlo2M.js";
import { a as DEFAULT_SOUL_FILENAME, n as DEFAULT_BOOTSTRAP_FILENAME, p as ensureAgentWorkspace, r as DEFAULT_IDENTITY_FILENAME, s as DEFAULT_USER_FILENAME, t as DEFAULT_AGENTS_FILENAME } from "./workspace-DJ__UUS2.js";
import { C as SANDBOX_DOCKER_CREATE_ARGS_EPOCH, b as SANDBOX_BROWSER_SECURITY_HASH_EPOCH, v as SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH } from "./constants-CZykxrCI.js";
import { n as isToolAllowed } from "./tool-policy-DOd4V1E7.js";
import { i as resolveSandboxConfigForAgent, r as resolveSandboxBrowserDockerCreateConfig } from "./config-CfIhW1Vb.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-D-khMh6L.js";
import { a as computeSandboxBrowserConfigHash, t as resolveDockerEnvPolicyEpoch } from "./sanitize-env-vars-akd6bc5P.js";
import { a as DEFAULT_OPENCLAW_BROWSER_COLOR, d as ensureBrowserControlAuth, f as resolveBrowserControlAuth, l as resolveBrowserConfig, n as DEFAULT_BROWSER_ACTION_TIMEOUT_MS, s as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, u as resolveProfile } from "./browser-profiles-DJ4GgCx7.js";
import { C as updateRegistry, S as updateBrowserRegistry, _ as readBrowserRegistry, f as readDockerContainerEnvVar, l as formatDockerDaemonUnavailableError, m as readDockerPort, p as readDockerContainerLabel, r as dockerContainerState, s as execDocker, t as buildSandboxCreateArgs, u as isDockerDaemonUnavailable, v as readRegisteredSandboxRuntimeIds } from "./docker-BiEQ_-7J.js";
import { c as resolveReadOnlyWorkspaceSkillMounts, i as formatReadOnlyWorkspaceSkillMountHashState, n as appendWorkspaceMountArgs, r as filterBindsConflictingWithProtectedMounts, s as resolveProtectedSkillMountContainerPaths, t as appendReadOnlyWorkspaceSkillMountArgs } from "./workspace-mounts-DBv2Eyoj.js";
import { i as slugifySessionKey, n as resolveSandboxAgentId, r as resolveSandboxWorkspaceLayoutPaths, t as buildSandboxContainerName } from "./shared-B_Uac1bY.js";
import { n as validateNetworkMode } from "./validate-sandbox-security-mQNQ9PEh.js";
import { _ as assertSshSandboxSecretOwnerAvailable } from "./ssh-backend-B38eKhNZ.js";
import { i as startBrowserBridgeServer, l as requireSandboxBackendFactory, n as stopCachedBrowserBridge, r as stopCachedBrowserBridgesForContainer, s as getSandboxBackendWorkdirResolver, t as BROWSER_BRIDGES } from "./browser-bridges-DL4W3pOx.js";
import { t as createSandboxFsBridge } from "./fs-bridge-B2BH2Za1.js";
import { n as toSandboxProvisioningError } from "./provisioning-error-DsXsTN99.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto from "node:crypto";
//#region src/config/port-defaults.ts
function isValidPort(port) {
	return Number.isFinite(port) && port > 0 && port <= 65535;
}
function clampPort(port, fallback) {
	return isValidPort(port) ? port : fallback;
}
function derivePort(base, offset, fallback) {
	return clampPort(base + offset, fallback);
}
/** Default browser-CDP sidecar port range used when no browser-control-relative range is safe. */
const DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
/** Inclusive end of the default browser-CDP sidecar port range. */
const DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;
const DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN = DEFAULT_BROWSER_CDP_PORT_RANGE_END - DEFAULT_BROWSER_CDP_PORT_RANGE_START;
/** Derives the browser-CDP sidecar range from the browser-control port when it fits. */
function deriveDefaultBrowserCdpPortRange(browserControlPort) {
	const start = derivePort(browserControlPort, 9, DEFAULT_BROWSER_CDP_PORT_RANGE_START);
	const end = start + DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN;
	if (end <= 65535) return {
		start,
		end
	};
	return {
		start: DEFAULT_BROWSER_CDP_PORT_RANGE_START,
		end: DEFAULT_BROWSER_CDP_PORT_RANGE_END
	};
}
//#endregion
//#region src/agents/sandbox/novnc-auth.ts
/**
* noVNC observer authentication helpers.
*
* Issues short-lived observer tokens and builds local noVNC URLs without exposing long-lived browser bridge state.
*/
const NOVNC_PASSWORD_ENV_KEY = "OPENCLAW_BROWSER_NOVNC_PASSWORD";
const NOVNC_TOKEN_TTL_MS = 60 * 1e3;
const MAX_NOVNC_TOKEN_TTL_MS = NOVNC_TOKEN_TTL_MS;
const NOVNC_PASSWORD_LENGTH = 8;
const NOVNC_PASSWORD_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NO_VNC_OBSERVER_TOKENS = /* @__PURE__ */ new Map();
function pruneExpiredNoVncObserverTokens(now) {
	for (const [token, entry] of NO_VNC_OBSERVER_TOKENS) if (!isFutureDateTimestampMs(entry.expiresAt, { nowMs: now })) NO_VNC_OBSERVER_TOKENS.delete(token);
}
function resolveNoVncObserverTokenExpiresAt(params) {
	return resolveExpiresAtMsFromDurationMs(params.ttlMs, {
		nowMs: params.nowMs,
		minRemainingMs: 1
	}) ?? resolveExpiresAtMsFromDurationMs(NOVNC_TOKEN_TTL_MS, {
		nowMs: params.nowMs,
		minRemainingMs: 1
	});
}
function isNoVncEnabled(params) {
	return params.noVncEnabled && !params.headless;
}
function generateNoVncPassword() {
	let out = "";
	for (let i = 0; i < NOVNC_PASSWORD_LENGTH; i += 1) out += NOVNC_PASSWORD_ALPHABET[crypto.randomInt(0, 62)];
	return out;
}
function issueNoVncObserverToken(params) {
	const now = params.nowMs ?? Date.now();
	pruneExpiredNoVncObserverTokens(now);
	const token = crypto.randomBytes(24).toString("hex");
	const expiresAt = resolveNoVncObserverTokenExpiresAt({
		ttlMs: typeof params.ttlMs === "number" && params.ttlMs <= MAX_NOVNC_TOKEN_TTL_MS ? params.ttlMs : void 0,
		nowMs: now
	});
	if (expiresAt === void 0) return token;
	NO_VNC_OBSERVER_TOKENS.set(token, {
		noVncPort: params.noVncPort,
		password: normalizeOptionalString(params.password),
		expiresAt
	});
	return token;
}
function consumeNoVncObserverToken(token, nowMs) {
	const now = nowMs ?? Date.now();
	pruneExpiredNoVncObserverTokens(now);
	const normalized = token.trim();
	if (!normalized) return null;
	const entry = NO_VNC_OBSERVER_TOKENS.get(normalized);
	if (!entry) return null;
	NO_VNC_OBSERVER_TOKENS.delete(normalized);
	if (!isFutureDateTimestampMs(entry.expiresAt, { nowMs: now })) return null;
	return {
		noVncPort: entry.noVncPort,
		password: entry.password
	};
}
function buildNoVncObserverTokenUrl(baseUrl, token) {
	return `${baseUrl}/sandbox/novnc?${new URLSearchParams({ token }).toString()}`;
}
//#endregion
//#region src/agents/sandbox/browser.ts
/**
* Sandbox browser container lifecycle.
*
* Starts or reuses Chrome/noVNC containers, exposes authenticated CDP/observer URLs, and tracks browser registry state.
*/
const HOT_BROWSER_WINDOW_MS = 300 * 1e3;
const CDP_SOURCE_RANGE_ENV_KEY = "OPENCLAW_BROWSER_CDP_SOURCE_RANGE";
const CDP_AUTH_TOKEN_ENV_KEY = "OPENCLAW_BROWSER_CDP_AUTH_TOKEN";
const SANDBOX_BROWSER_IMAGE_CONTRACT_LABEL = "org.openclaw.sandbox-browser.contract";
const browserContainerLifecycleQueue = new KeyedAsyncQueue();
const browserNetworkLifecycleQueue = new KeyedAsyncQueue();
function buildSandboxCdpAuthHeader(token) {
	return `Basic ${Buffer.from(`openclaw:${token}`).toString("base64")}`;
}
function buildSandboxCdpUrl(params) {
	const url = new URL(`http://127.0.0.1:${params.cdpPort}`);
	url.username = "openclaw";
	url.password = params.authToken;
	return url.toString().replace(/\/$/, "");
}
async function waitForSandboxCdp(params) {
	const deadline = Date.now() + Math.max(0, params.timeoutMs);
	const url = `http://127.0.0.1:${params.cdpPort}/json/version`;
	while (Date.now() < deadline) {
		try {
			const requestTimeoutMs = Math.max(1, Math.min(1e3, deadline - Date.now()));
			const ctrl = new AbortController();
			const t = setTimeout(ctrl.abort.bind(ctrl), requestTimeoutMs);
			try {
				const res = await fetch(url, {
					headers: { Authorization: buildSandboxCdpAuthHeader(params.authToken) },
					signal: ctrl.signal
				});
				await res.body?.cancel().catch(() => void 0);
				if (res.ok) return true;
			} finally {
				clearTimeout(t);
			}
		} catch {}
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) break;
		await new Promise((r) => {
			setTimeout(r, Math.min(150, remainingMs));
		});
	}
	return false;
}
function buildSandboxBrowserResolvedConfig(params) {
	const cdpHost = "127.0.0.1";
	const cdpPortRange = deriveDefaultBrowserCdpPortRange(params.controlPort);
	return {
		enabled: true,
		evaluateEnabled: params.evaluateEnabled,
		controlPort: params.controlPort,
		cdpProtocol: "http",
		cdpHost,
		cdpIsLoopback: true,
		cdpPortRangeStart: cdpPortRange.start,
		cdpPortRangeEnd: cdpPortRange.end,
		remoteCdpTimeoutMs: 1500,
		remoteCdpHandshakeTimeoutMs: 3e3,
		localLaunchTimeoutMs: 15e3,
		localCdpReadyTimeoutMs: 8e3,
		actionTimeoutMs: DEFAULT_BROWSER_ACTION_TIMEOUT_MS,
		color: DEFAULT_OPENCLAW_BROWSER_COLOR,
		executablePath: void 0,
		headless: params.headless,
		noSandbox: false,
		attachOnly: true,
		defaultProfile: DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
		extraArgs: [],
		tabCleanup: {
			enabled: true,
			idleMinutes: 120,
			maxTabsPerSession: 8,
			sweepMinutes: 5
		},
		profiles: { [DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME]: {
			cdpPort: params.cdpPort,
			cdpUrl: buildSandboxCdpUrl({
				cdpPort: params.cdpPort,
				authToken: params.cdpAuthToken
			}),
			color: DEFAULT_OPENCLAW_BROWSER_COLOR
		} },
		ssrfPolicy: params.ssrfPolicy
	};
}
async function ensureSandboxBrowserImage(image) {
	const result = await execDocker([
		"image",
		"inspect",
		"-f",
		`{{ index .Config.Labels "${SANDBOX_BROWSER_IMAGE_CONTRACT_LABEL}" }}`,
		image
	], { allowFailure: true });
	if (result.code === 0) {
		const contract = result.stdout.trim();
		if (contract === "2026-05-12-cdp-relay-auth") return;
		throw new Error(`Sandbox browser image ${image} is stale or incompatible (contract=${contract && contract !== "<no value>" ? contract : "missing"}, expected=${SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH}). Rebuild it with scripts/sandbox-browser-setup.sh.`);
	}
	const stderr = result.stderr.trim();
	if (isDockerDaemonUnavailable(stderr)) throw new Error(formatDockerDaemonUnavailableError(stderr));
	throw new Error(`Sandbox browser image not found: ${image}. Build it with scripts/sandbox-browser-setup.sh.`);
}
async function ensureDockerNetwork(network, opts) {
	validateNetworkMode(network, { allowContainerNamespaceJoin: opts?.allowContainerNamespaceJoin === true });
	const normalized = normalizeOptionalLowercaseString(network) ?? "";
	if (!normalized || normalized === "bridge" || normalized === "none") return;
	await browserNetworkLifecycleQueue.enqueue(normalized, async () => {
		if ((await execDocker([
			"network",
			"inspect",
			network
		], { allowFailure: true })).code === 0) return;
		await execDocker([
			"network",
			"create",
			"--driver",
			"bridge",
			network
		]);
	});
}
async function ensureSandboxBrowser(params) {
	if (!params.cfg.browser.enabled) return null;
	if (!isToolAllowed(params.cfg.tools, "browser")) return null;
	if (normalizeOptionalLowercaseString(params.cfg.browser.network) === "none") throw new Error("Sandbox browser network mode \"none\" is unsupported because browser control requires a host-reachable published CDP port. Use \"bridge\", a custom bridge network, or disable the sandbox browser.");
	const slug = params.cfg.scope === "shared" ? "shared" : slugifySessionKey(params.scopeKey);
	const containerName = buildSandboxContainerName(params.cfg.browser.containerPrefix, slug);
	return await browserContainerLifecycleQueue.enqueue(containerName, async () => {
		return await ensureSandboxBrowserContainer(params, containerName);
	});
}
async function ensureSandboxBrowserContainer(params, containerName) {
	let existing = BROWSER_BRIDGES.get(params.scopeKey);
	const stopExistingForContainer = async () => {
		await stopCachedBrowserBridgesForContainer(containerName);
		existing = BROWSER_BRIDGES.get(params.scopeKey);
	};
	const state = await dockerContainerState(containerName);
	const browserImage = params.cfg.browser.image ?? "openclaw-sandbox-browser:bookworm-slim";
	const cdpSourceRange = normalizeOptionalString(params.cfg.browser.cdpSourceRange);
	const browserDockerCfg = resolveSandboxBrowserDockerCreateConfig({
		docker: params.cfg.docker,
		browser: {
			...params.cfg.browser,
			image: browserImage
		}
	});
	const readOnlyWorkspaceSkillMounts = resolveReadOnlyWorkspaceSkillMounts({
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		workdir: params.cfg.docker.workdir,
		workspaceAccess: params.cfg.workspaceAccess
	});
	const expectedHash = computeSandboxBrowserConfigHash({
		docker: browserDockerCfg,
		dockerEnvPolicyEpoch: resolveDockerEnvPolicyEpoch(browserDockerCfg.env),
		browser: {
			cdpPort: params.cfg.browser.cdpPort,
			vncPort: params.cfg.browser.vncPort,
			noVncPort: params.cfg.browser.noVncPort,
			headless: params.cfg.browser.headless,
			noVncEnabled: params.cfg.browser.noVncEnabled,
			autoStartTimeoutMs: params.cfg.browser.autoStartTimeoutMs,
			cdpSourceRange
		},
		securityEpoch: SANDBOX_BROWSER_SECURITY_HASH_EPOCH,
		workspaceAccess: params.cfg.workspaceAccess,
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		mountFormatVersion: 3,
		createArgsEpoch: SANDBOX_DOCKER_CREATE_ARGS_EPOCH,
		readOnlyWorkspaceSkillMounts: formatReadOnlyWorkspaceSkillMountHashState(readOnlyWorkspaceSkillMounts)
	});
	const now = Date.now();
	let hasContainer = state.exists;
	let running = state.running;
	let currentHash = null;
	let hashMismatch = false;
	const noVncEnabled = isNoVncEnabled(params.cfg.browser);
	let noVncPassword;
	let cdpAuthToken;
	if (hasContainer) {
		if (noVncEnabled) noVncPassword = await readDockerContainerEnvVar(containerName, "OPENCLAW_BROWSER_NOVNC_PASSWORD") ?? void 0;
		cdpAuthToken = await readDockerContainerEnvVar(containerName, CDP_AUTH_TOKEN_ENV_KEY) ?? void 0;
		if (!cdpAuthToken) {
			defaultRuntime.log(`Removing stale sandbox browser container ${containerName} because it lacks the current CDP relay auth contract; it will be recreated.`);
			await stopExistingForContainer();
			await execDocker([
				"rm",
				"-f",
				containerName
			], { allowFailure: true });
			hasContainer = false;
			running = false;
		}
	}
	if (hasContainer) {
		const registryEntry = (await readBrowserRegistry()).entries.find((entry) => entry.containerName === containerName);
		currentHash = await readDockerContainerLabel(containerName, "openclaw.configHash");
		hashMismatch = !currentHash || currentHash !== expectedHash;
		if (!currentHash) {
			currentHash = registryEntry?.configHash ?? null;
			hashMismatch = !currentHash || currentHash !== expectedHash;
		}
		if (hashMismatch) {
			const lastUsedAtMs = registryEntry?.lastUsedAtMs;
			if (running && (typeof lastUsedAtMs !== "number" || now - lastUsedAtMs < HOT_BROWSER_WINDOW_MS)) {
				const hint = (() => {
					if (params.cfg.scope === "session") return `openclaw sandbox recreate --browser --session ${params.scopeKey}`;
					if (params.cfg.scope === "agent") return `openclaw sandbox recreate --browser --agent ${resolveSandboxAgentId(params.scopeKey) ?? "main"}`;
					return "openclaw sandbox recreate --browser --all";
				})();
				defaultRuntime.log(`Sandbox browser config changed for ${containerName} (recently used). Recreate to apply: ${hint}`);
			} else {
				await stopExistingForContainer();
				await execDocker([
					"rm",
					"-f",
					containerName
				], { allowFailure: true });
				hasContainer = false;
				running = false;
			}
		}
	}
	if (!hasContainer) {
		if (noVncEnabled) noVncPassword = generateNoVncPassword();
		cdpAuthToken = crypto.randomBytes(24).toString("hex");
		await ensureDockerNetwork(browserDockerCfg.network, { allowContainerNamespaceJoin: browserDockerCfg.dangerouslyAllowContainerNamespaceJoin === true });
		await ensureSandboxBrowserImage(browserImage);
		const { argv: args, env } = buildSandboxCreateArgs({
			name: containerName,
			cfg: browserDockerCfg,
			scopeKey: params.scopeKey,
			labels: {
				"openclaw.sandboxBrowser": "1",
				"openclaw.browserConfigEpoch": SANDBOX_BROWSER_SECURITY_HASH_EPOCH
			},
			configHash: expectedHash,
			includeBinds: false,
			bindSourceRoots: [params.workspaceDir, params.agentWorkspaceDir]
		});
		appendWorkspaceMountArgs({
			args,
			workspaceDir: params.workspaceDir,
			agentWorkspaceDir: params.agentWorkspaceDir,
			skillsWorkspaceDir: params.skillsWorkspaceDir,
			workdir: params.cfg.docker.workdir,
			workspaceAccess: params.cfg.workspaceAccess,
			readOnlyWorkspaceSkillMounts,
			includeReadOnlyWorkspaceSkillMounts: false
		});
		if (browserDockerCfg.binds?.length) {
			const protectedPaths = resolveProtectedSkillMountContainerPaths(readOnlyWorkspaceSkillMounts);
			const safeBinds = protectedPaths.size > 0 ? filterBindsConflictingWithProtectedMounts(browserDockerCfg.binds, protectedPaths) : browserDockerCfg.binds;
			for (const bind of browserDockerCfg.binds) if (!safeBinds.includes(bind)) defaultRuntime.log(`sandbox browser: skipping user bind "${bind}" — container path conflicts with a protected read-only skill mount`);
			for (const bind of safeBinds) args.push("-v", bind);
		}
		appendReadOnlyWorkspaceSkillMountArgs({
			args,
			readOnlyWorkspaceSkillMounts
		});
		args.push("-p", `127.0.0.1::${params.cfg.browser.cdpPort}`);
		if (noVncEnabled) args.push("-p", `127.0.0.1::${params.cfg.browser.noVncPort}`);
		Object.assign(env, {
			OPENCLAW_BROWSER_HEADLESS: params.cfg.browser.headless ? "1" : "0",
			OPENCLAW_BROWSER_ENABLE_NOVNC: params.cfg.browser.noVncEnabled ? "1" : "0",
			OPENCLAW_BROWSER_CDP_PORT: String(params.cfg.browser.cdpPort),
			[CDP_AUTH_TOKEN_ENV_KEY]: cdpAuthToken,
			OPENCLAW_BROWSER_AUTO_START_TIMEOUT_MS: String(params.cfg.browser.autoStartTimeoutMs),
			OPENCLAW_BROWSER_VNC_PORT: String(params.cfg.browser.vncPort),
			OPENCLAW_BROWSER_NOVNC_PORT: String(params.cfg.browser.noVncPort),
			OPENCLAW_BROWSER_NO_SANDBOX: "1"
		});
		if (cdpSourceRange) env[CDP_SOURCE_RANGE_ENV_KEY] = cdpSourceRange;
		if (noVncEnabled && noVncPassword) env[NOVNC_PASSWORD_ENV_KEY] = noVncPassword;
		await withContainerEnvFile(env, async (envFile) => {
			args.push("--env-file", envFile, browserImage);
			await execDocker(args);
		});
		await execDocker(["start", containerName]);
	} else if (!running) await execDocker(["start", containerName]);
	const mappedCdp = await readDockerPort(containerName, params.cfg.browser.cdpPort);
	if (!mappedCdp) throw new Error(`Failed to resolve CDP port mapping for ${containerName}.`);
	if (!cdpAuthToken) throw new Error(`Failed to resolve CDP relay auth for ${containerName}.`);
	const cdpUrl = buildSandboxCdpUrl({
		cdpPort: mappedCdp,
		authToken: cdpAuthToken
	});
	const mappedNoVnc = noVncEnabled ? await readDockerPort(containerName, params.cfg.browser.noVncPort) : null;
	if (noVncEnabled && !noVncPassword) noVncPassword = await readDockerContainerEnvVar(containerName, "OPENCLAW_BROWSER_NOVNC_PASSWORD") ?? void 0;
	const existingProfile = existing ? resolveProfile(existing.bridge.state.resolved, DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME) : null;
	const desiredEvaluateEnabled = params.evaluateEnabled ?? true;
	let desiredAuthToken = normalizeOptionalString(params.bridgeAuth?.token);
	let desiredAuthPassword = normalizeOptionalString(params.bridgeAuth?.password);
	if (!desiredAuthToken && !desiredAuthPassword) {
		desiredAuthToken = existing?.authToken;
		desiredAuthPassword = existing?.authPassword;
		if (!desiredAuthToken && !desiredAuthPassword) desiredAuthToken = crypto.randomBytes(24).toString("hex");
	}
	const policyMatches = !existing || isSameSsrFPolicy(existing.bridge.state.resolved.ssrfPolicy, params.ssrfPolicy);
	const authMatches = !existing || existing.authToken === desiredAuthToken && existing.authPassword === desiredAuthPassword;
	const evaluateMatches = !existing || existing.bridge.state.resolved.evaluateEnabled === desiredEvaluateEnabled;
	const canReuse = Boolean(existing && existing.bridge.server.listening && existing.containerName === containerName && existingProfile?.cdpPort === mappedCdp && existingProfile?.cdpUrl === cdpUrl && policyMatches && authMatches && evaluateMatches);
	if (existing && !canReuse) await stopCachedBrowserBridge(params.scopeKey, existing);
	const bridge = canReuse ? existing?.bridge ?? null : null;
	const ensureBridge = async () => {
		if (bridge) return bridge;
		const onEnsureAttachTarget = params.cfg.browser.autoStart ? async () => {
			const currentState = await dockerContainerState(containerName);
			if (currentState.exists && !currentState.running) await execDocker(["start", containerName]);
			if (!await waitForSandboxCdp({
				cdpPort: mappedCdp,
				authToken: cdpAuthToken,
				timeoutMs: params.cfg.browser.autoStartTimeoutMs
			})) {
				await execDocker([
					"rm",
					"-f",
					containerName
				], { allowFailure: true });
				throw new Error(`Sandbox browser CDP did not become reachable on 127.0.0.1:${mappedCdp} within ${params.cfg.browser.autoStartTimeoutMs}ms. The hung container has been forcefully removed.`);
			}
		} : void 0;
		return await startBrowserBridgeServer({
			resolved: buildSandboxBrowserResolvedConfig({
				controlPort: 0,
				cdpPort: mappedCdp,
				cdpAuthToken,
				headless: params.cfg.browser.headless,
				evaluateEnabled: desiredEvaluateEnabled,
				ssrfPolicy: params.ssrfPolicy
			}),
			authToken: desiredAuthToken,
			authPassword: desiredAuthPassword,
			onEnsureAttachTarget,
			resolveSandboxNoVncToken: consumeNoVncObserverToken
		});
	};
	const resolvedBridge = await ensureBridge();
	if (!bridge) BROWSER_BRIDGES.set(params.scopeKey, {
		bridge: resolvedBridge,
		containerName,
		authToken: desiredAuthToken,
		authPassword: desiredAuthPassword
	});
	await updateBrowserRegistry({
		containerName,
		sessionKey: params.scopeKey,
		createdAtMs: now,
		lastUsedAtMs: now,
		image: browserImage,
		configHash: hashMismatch && running ? currentHash ?? void 0 : expectedHash,
		cdpPort: mappedCdp,
		noVncPort: mappedNoVnc ?? void 0
	});
	const noVncUrl = mappedNoVnc && noVncEnabled ? (() => {
		const token = issueNoVncObserverToken({
			noVncPort: mappedNoVnc,
			password: noVncPassword
		});
		return buildNoVncObserverTokenUrl(resolvedBridge.baseUrl, token);
	})() : void 0;
	return {
		bridgeUrl: resolvedBridge.baseUrl,
		noVncUrl,
		containerName
	};
}
//#endregion
//#region src/agents/sandbox/docker-user.ts
async function resolveSandboxDockerUser(params) {
	if (params.docker.user?.trim()) return params.docker;
	const backend = params.backend.trim().toLowerCase();
	if (backend !== "docker" && backend !== "podman") return params.docker;
	const stat = params.stat ?? ((workspaceDir) => fs$1.stat(workspaceDir));
	try {
		const workspaceStat = await stat(params.workspaceDir);
		const uid = Number.isInteger(workspaceStat.uid) ? workspaceStat.uid : null;
		const gid = Number.isInteger(workspaceStat.gid) ? workspaceStat.gid : null;
		if (uid === null || gid === null || uid < 0 || gid < 0) return params.docker;
		if (backend === "podman" && (uid === 0 || gid === 0)) return params.docker;
		return {
			...params.docker,
			user: `${uid}:${gid}`
		};
	} catch {
		return params.docker;
	}
}
//#endregion
//#region src/agents/sandbox/workspace.ts
/**
* Sandbox workspace bootstrapper.
*
* Creates sandbox workspaces and seeds agent bootstrap files through root-boundary reads.
*/
const log = createSubsystemLogger("sandbox-workspace");
async function ensureSandboxWorkspace(workspaceDir, seedFrom, skipBootstrap, skipOptionalBootstrapFiles) {
	await fs$1.mkdir(workspaceDir, { recursive: true });
	if (seedFrom) {
		const seed = resolveUserPath(seedFrom);
		const files = [
			DEFAULT_AGENTS_FILENAME,
			DEFAULT_SOUL_FILENAME,
			DEFAULT_IDENTITY_FILENAME,
			DEFAULT_USER_FILENAME,
			DEFAULT_BOOTSTRAP_FILENAME
		];
		for (const name of files) {
			const src = path.join(seed, name);
			const dest = path.join(workspaceDir, name);
			try {
				await fs$1.access(dest);
			} catch {
				try {
					const opened = await openRootFile({
						absolutePath: src,
						rootPath: seed,
						boundaryLabel: "sandbox seed workspace"
					});
					if (!opened.ok) continue;
					try {
						const content = await readWorkspaceBootstrapFile(opened.fd);
						await fs$1.writeFile(dest, content, {
							encoding: "utf-8",
							flag: "wx"
						});
					} catch (err) {
						if (err instanceof RangeError) log.warn(`Ignoring oversized sandbox seed file ${src}: file exceeds the ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES}-byte limit`);
					} finally {
						fs.closeSync(opened.fd);
					}
				} catch {}
			}
		}
	}
	await ensureAgentWorkspace({
		dir: workspaceDir,
		ensureBootstrapFiles: !skipBootstrap,
		skipOptionalBootstrapFiles
	});
}
//#endregion
//#region src/agents/sandbox/context.ts
/**
* Sandbox context resolver.
*
* Prepares workspace layout, backend handle, filesystem bridge, browser bridge, and registry state for one run.
*/
const sandboxLog = createSubsystemLogger("agent/sandbox");
const loadSyncWorkspaceSkills = createLazyRuntimeNamedExport(() => import("./workspace-skill-sync.runtime.js"), "syncWorkspaceSkills");
async function syncSandboxSkillsToWorkspace(params) {
	try {
		const [syncWorkspaceSkills, { getRemoteSkillEligibility }, { resolveNodeExecEligibility }] = await Promise.all([
			loadSyncWorkspaceSkills(),
			import("./remote-rUB1zX19.js"),
			import("./exec-defaults-DNri9e03.js")
		]);
		const nodeSkills = resolveNodeExecEligibility({
			cfg: params.config,
			sessionKey: params.rawSessionKey,
			agentId: params.agentId,
			execOverrides: params.execOverrides
		});
		const eligibility = {
			nodeSkills,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		};
		return {
			eligibility,
			skillUsagePaths: await syncWorkspaceSkills({
				sourceWorkspaceDir: params.sourceWorkspaceDir,
				targetWorkspaceDir: params.targetWorkspaceDir,
				config: params.config,
				agentId: params.agentId,
				eligibility,
				skillsSnapshot: params.skillsSnapshot
			})
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : JSON.stringify(error);
		defaultRuntime.error?.(`Sandbox skill sync failed: ${message}`);
		return {};
	}
}
async function ensureSandboxWorkspaceLayout(params) {
	const { cfg, rawSessionKey } = params;
	const { agentWorkspaceDir, sandboxWorkspaceDir, scopeKey, skillsWorkspaceDir, workspaceDir } = resolveSandboxWorkspaceLayoutPaths({
		cfg,
		rawSessionKey,
		agentId: params.agentId,
		sandboxPrincipalId: params.sandboxPrincipalId,
		workspaceDir: params.workspaceDir
	});
	let syncedSkills;
	if (cfg.workspaceAccess !== "rw") {
		await ensureSandboxWorkspace(sandboxWorkspaceDir, agentWorkspaceDir, params.config?.agents?.defaults?.skipBootstrap, params.config?.agents?.defaults?.skipOptionalBootstrapFiles);
		syncedSkills = await syncSandboxSkillsToWorkspace({
			sourceWorkspaceDir: agentWorkspaceDir,
			targetWorkspaceDir: sandboxWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			rawSessionKey,
			execOverrides: params.execOverrides,
			skillsSnapshot: params.skillsSnapshot
		});
	} else {
		await fs$1.mkdir(workspaceDir, { recursive: true });
		syncedSkills = await syncSandboxSkillsToWorkspace({
			sourceWorkspaceDir: agentWorkspaceDir,
			targetWorkspaceDir: skillsWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			rawSessionKey,
			execOverrides: params.execOverrides,
			skillsSnapshot: params.skillsSnapshot
		});
	}
	return {
		agentWorkspaceDir,
		scopeKey,
		sandboxWorkspaceDir,
		skillsWorkspaceDir,
		...syncedSkills.eligibility ? { skillsEligibility: syncedSkills.eligibility } : {},
		...syncedSkills.skillUsagePaths ? { skillUsagePaths: syncedSkills.skillUsagePaths } : {},
		workspaceDir
	};
}
function resolveSandboxSession(params) {
	const rawSessionKey = params.sessionKey?.trim();
	if (!rawSessionKey) return null;
	const runtime = resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: rawSessionKey
	});
	if (!runtime.sandboxed) return null;
	const configuredSandbox = resolveSandboxConfigForAgent(params.config, runtime.agentId);
	if (!runtime.sandboxRequired) return {
		rawSessionKey,
		runtime,
		cfg: configuredSandbox
	};
	if (!runtime.sandboxPrincipalId) throw new Error("A required sandbox cannot be provisioned without its session creator principal.");
	if (configuredSandbox.workspaceAccess === "rw") sandboxLog.warn("Configured sandbox workspaceAccess \"rw\" is capped to \"ro\" for a role-required session; guests cannot share the writable agent workspace.");
	return {
		rawSessionKey,
		runtime,
		cfg: {
			...configuredSandbox,
			scope: "agent",
			workspaceAccess: runtime.workspaceAccess
		}
	};
}
function resolveSandboxWorkspaceInfoWorkdir(params) {
	return getSandboxBackendWorkdirResolver(params.cfg.backend)?.({
		sessionKey: params.rawSessionKey,
		scopeKey: params.scopeKey,
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		cfg: params.cfg
	});
}
function assertSandboxSessionSecretOwnerAvailable(config, resolved) {
	if (resolved.cfg.backend !== "ssh") return;
	assertSshSandboxSecretOwnerAvailable({
		config,
		scope: resolved.cfg.scope,
		agentId: resolved.runtime.agentId
	});
}
async function resolveProvisionedSandboxContext(params, resolved) {
	const { rawSessionKey, cfg, runtime } = resolved;
	if (cfg.prune.idleHours !== 0 || cfg.prune.maxAgeDays !== 0) await (await import("./prune-BVhyFNK-.js")).maybePruneSandboxes(cfg);
	const { agentWorkspaceDir, scopeKey, skillsEligibility, skillUsagePaths, skillsWorkspaceDir, workspaceDir } = await ensureSandboxWorkspaceLayout({
		cfg,
		agentId: runtime.agentId,
		rawSessionKey,
		sandboxPrincipalId: runtime.sandboxPrincipalId,
		config: params.config,
		execOverrides: params.execOverrides,
		skillsSnapshot: params.skillsSnapshot,
		workspaceDir: params.workspaceDir
	});
	const docker = await resolveSandboxDockerUser({
		backend: cfg.backend,
		docker: cfg.docker,
		workspaceDir
	});
	const resolvedCfg = docker === cfg.docker ? cfg : {
		...cfg,
		docker
	};
	const backendFactory = requireSandboxBackendFactory(resolvedCfg.backend);
	const registeredRuntimeIds = await readRegisteredSandboxRuntimeIds({
		backendId: resolvedCfg.backend,
		scopeKey
	});
	const backend = await backendFactory({
		sessionKey: rawSessionKey,
		scopeKey,
		...registeredRuntimeIds.length > 0 ? { registeredRuntimeIds } : {},
		workspaceDir,
		agentWorkspaceDir,
		skillsWorkspaceDir,
		cfg: resolvedCfg,
		...params.requireCurrentConfig !== void 0 ? { requireCurrentConfig: params.requireCurrentConfig } : {}
	});
	await updateRegistry({
		containerName: backend.runtimeId,
		backendId: backend.id,
		runtimeLabel: backend.runtimeLabel,
		sessionKey: scopeKey,
		createdAtMs: Date.now(),
		lastUsedAtMs: Date.now(),
		image: backend.configLabel ?? resolvedCfg.docker.image,
		configLabelKind: backend.configLabelKind ?? "Image"
	});
	const resolvedBrowserConfig = resolvedCfg.browser.enabled ? resolveBrowserConfig(params.config?.browser, params.config) : void 0;
	const evaluateEnabled = resolvedBrowserConfig?.evaluateEnabled ?? true;
	const bridgeAuth = cfg.browser.enabled ? await (async () => {
		const cfgForAuth = params.config ?? (await import("./config/config.js")).getRuntimeConfig();
		let browserAuth = resolveBrowserControlAuth(cfgForAuth);
		try {
			browserAuth = (await ensureBrowserControlAuth({ cfg: cfgForAuth })).auth;
		} catch (error) {
			const message = error instanceof Error ? error.message : JSON.stringify(error);
			defaultRuntime.error?.(`Sandbox browser auth ensure failed: ${message}`);
		}
		return browserAuth;
	})() : void 0;
	if (resolvedCfg.browser.enabled && backend.capabilities?.browser !== true) throw new Error(`Sandbox backend "${backend.id}" does not support browser sandboxes yet.`);
	const browser = resolvedCfg.browser.enabled && backend.capabilities?.browser === true ? await ensureSandboxBrowser({
		scopeKey,
		workspaceDir,
		agentWorkspaceDir,
		skillsWorkspaceDir,
		cfg: resolvedCfg,
		evaluateEnabled,
		bridgeAuth,
		ssrfPolicy: resolvedBrowserConfig?.ssrfPolicy
	}) : null;
	const sandboxContext = {
		enabled: true,
		...runtime.sandboxRequired ? { required: true } : {},
		backendId: backend.id,
		sessionKey: rawSessionKey,
		workspaceDir,
		agentWorkspaceDir,
		skillsWorkspaceDir,
		...skillsEligibility ? { skillsEligibility } : {},
		...skillUsagePaths ? { skillUsagePaths } : {},
		workspaceAccess: resolvedCfg.workspaceAccess,
		runtimeId: backend.runtimeId,
		runtimeLabel: backend.runtimeLabel,
		containerName: backend.runtimeId,
		containerWorkdir: backend.workdir,
		docker: resolvedCfg.docker,
		tools: resolvedCfg.tools,
		browserAllowHostControl: resolvedCfg.browser.allowHostControl,
		browser: browser ?? void 0,
		backend
	};
	sandboxContext.fsBridge = backend.createFsBridge?.({ sandbox: sandboxContext }) ?? createSandboxFsBridge({ sandbox: sandboxContext });
	return sandboxContext;
}
async function resolveSandboxContext(params) {
	const resolved = resolveSandboxSession(params);
	if (!resolved) return null;
	try {
		assertSandboxSessionSecretOwnerAvailable(params.config, resolved);
		return await resolveProvisionedSandboxContext(params, resolved);
	} catch (error) {
		throw toSandboxProvisioningError(error, resolved.cfg.backend);
	}
}
async function ensureSandboxWorkspaceForSession(params) {
	const resolved = resolveSandboxSession(params);
	if (!resolved) return null;
	assertSandboxSessionSecretOwnerAvailable(params.config, resolved);
	const { rawSessionKey, cfg, runtime } = resolved;
	const { agentWorkspaceDir, scopeKey, skillsEligibility, skillUsagePaths, skillsWorkspaceDir, workspaceDir } = await ensureSandboxWorkspaceLayout({
		cfg,
		agentId: runtime.agentId,
		rawSessionKey,
		sandboxPrincipalId: runtime.sandboxPrincipalId,
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	const containerWorkdir = resolveSandboxWorkspaceInfoWorkdir({
		cfg,
		rawSessionKey,
		scopeKey,
		workspaceDir,
		agentWorkspaceDir,
		skillsWorkspaceDir
	});
	return {
		workspaceDir,
		...containerWorkdir ? { containerWorkdir } : {},
		skillsWorkspaceDir,
		...skillsEligibility ? { skillsEligibility } : {},
		...skillUsagePaths ? { skillUsagePaths } : {},
		workspaceAccess: cfg.workspaceAccess
	};
}
//#endregion
export { resolveSandboxContext as n, ensureSandboxWorkspaceForSession as t };
