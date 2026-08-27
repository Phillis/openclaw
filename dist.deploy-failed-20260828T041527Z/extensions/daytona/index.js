import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { buildRemoteCommand, buildRemoteWorkdirValidationCommand, buildValidatedExecRemoteCommand, createRemoteShellSandboxFsBridge, registerSandboxBackend, resolvePreferredOpenClawTmpDir, sanitizeEnvVars, withTempWorkspace } from "openclaw/plugin-sdk/sandbox";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveConfiguredSecretInputWithFallback } from "openclaw/plugin-sdk/secret-input-runtime";
import { buildPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { formatPluginConfigIssue, mapPluginConfigIssues } from "openclaw/plugin-sdk/extension-shared";
import { MAX_TIMER_TIMEOUT_SECONDS } from "openclaw/plugin-sdk/number-runtime";
import { buildOptionalSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { z } from "zod";
import fs$1 from "node:fs";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { isPathInside } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/daytona/src/client.ts
const DAYTONA_API_KEY_PATH = "plugins.entries.daytona.config.apiKey";
/** Resolve the Daytona connection settings from plugin config with env fallbacks. */
async function resolveDaytonaConnection(params) {
	const env = params.env ?? process.env;
	const resolved = await resolveConfiguredSecretInputWithFallback({
		config: params.config,
		env,
		value: params.pluginConfig.apiKey,
		path: DAYTONA_API_KEY_PATH,
		readFallback: () => env.DAYTONA_API_KEY
	});
	if (!resolved.value) throw new Error(["Daytona sandbox backend needs an API key.", resolved.unresolvedRefReason ?? `Set ${DAYTONA_API_KEY_PATH} or export DAYTONA_API_KEY in the Gateway environment.`].join(" "));
	return {
		apiKey: resolved.value,
		apiUrl: params.pluginConfig.apiUrl ?? (env.DAYTONA_API_URL?.trim() || void 0),
		target: params.pluginConfig.target ?? (env.DAYTONA_TARGET?.trim() || void 0)
	};
}
let daytonaSdkModule;
async function loadDaytonaSdk() {
	daytonaSdkModule ??= import("@daytona/sdk");
	return await daytonaSdkModule;
}
async function createDaytonaClient(connection) {
	return new (await (loadDaytonaSdk())).Daytona({
		apiKey: connection.apiKey,
		apiUrl: connection.apiUrl,
		target: connection.target
	});
}
function readDaytonaStatusCode(error) {
	if (!isRecord(error)) return;
	const statusCode = error.statusCode;
	return typeof statusCode === "number" ? statusCode : void 0;
}
/** True when a Daytona API error means the sandbox or resource does not exist. */
function isDaytonaNotFoundError(error) {
	return readDaytonaStatusCode(error) === 404;
}
function isTransientDaytonaError(error) {
	const statusCode = readDaytonaStatusCode(error);
	if (statusCode === 502 || statusCode === 503 || statusCode === 504) return true;
	const code = isRecord(error) ? error.code : void 0;
	return code === "ECONNRESET" || code === "ETIMEDOUT" || code === "EAI_AGAIN";
}
const TRANSIENT_RETRY_DELAYS_MS = [300, 900];
/** Retry short idempotent Daytona control-plane calls across transient API failures. */
async function withDaytonaRetry(label, run) {
	let lastError;
	for (let attempt = 0; attempt <= TRANSIENT_RETRY_DELAYS_MS.length; attempt += 1) try {
		return await run();
	} catch (error) {
		lastError = error;
		if (!isTransientDaytonaError(error) || attempt === TRANSIENT_RETRY_DELAYS_MS.length) throw error;
		await new Promise((resolve) => {
			setTimeout(resolve, TRANSIENT_RETRY_DELAYS_MS[attempt]);
		});
	}
	throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error(`${label} failed`);
}
//#endregion
//#region extensions/daytona/src/config.ts
const DEFAULT_REMOTE_WORKSPACE_DIR = "/home/daytona/workspace";
const DEFAULT_REMOTE_AGENT_WORKSPACE_DIR = "/home/daytona/agent";
const DEFAULT_TIMEOUT_MS = 12e4;
const nonEmptyTrimmedString = (message) => z.string({ error: message }).trim().min(1, { error: message });
const optionalMinutesInterval = (field) => z.int({ error: `${field} must be an integer number of minutes >= 0` }).min(0, { error: `${field} must be an integer number of minutes >= 0` }).optional();
const optionalResourceUnits = (field) => z.int({ error: `${field} must be an integer >= 1` }).min(1, { error: `${field} must be an integer >= 1` }).optional();
const DaytonaPluginConfigSchema = z.strictObject({
	apiKey: buildOptionalSecretInputSchema(),
	apiUrl: nonEmptyTrimmedString("apiUrl must be a non-empty string").optional(),
	target: nonEmptyTrimmedString("target must be a non-empty string").optional(),
	snapshot: nonEmptyTrimmedString("snapshot must be a non-empty string").optional(),
	image: nonEmptyTrimmedString("image must be a non-empty string").optional(),
	resources: z.strictObject({
		cpu: optionalResourceUnits("resources.cpu"),
		gpu: optionalResourceUnits("resources.gpu"),
		memory: optionalResourceUnits("resources.memory"),
		disk: optionalResourceUnits("resources.disk")
	}).optional(),
	user: nonEmptyTrimmedString("user must be a non-empty string").optional(),
	volumes: z.array(z.strictObject({
		volumeId: nonEmptyTrimmedString("volumes[].volumeId must be a non-empty string"),
		mountPath: nonEmptyTrimmedString("volumes[].mountPath must be a non-empty string")
	}), { error: "volumes must be an array of { volumeId, mountPath } objects" }).optional(),
	autoStopInterval: optionalMinutesInterval("autoStopInterval"),
	autoPauseInterval: optionalMinutesInterval("autoPauseInterval"),
	autoArchiveInterval: optionalMinutesInterval("autoArchiveInterval"),
	autoDeleteInterval: optionalMinutesInterval("autoDeleteInterval"),
	networkBlockAll: z.boolean({ error: "networkBlockAll must be a boolean" }).optional(),
	networkAllowList: nonEmptyTrimmedString("networkAllowList must be a non-empty string").optional(),
	domainAllowList: nonEmptyTrimmedString("domainAllowList must be a non-empty string").optional(),
	remoteWorkspaceDir: nonEmptyTrimmedString("remoteWorkspaceDir must be a non-empty string").optional(),
	remoteAgentWorkspaceDir: nonEmptyTrimmedString("remoteAgentWorkspaceDir must be a non-empty string").optional(),
	timeoutSeconds: z.number({ error: `timeoutSeconds must be a number between 1 and ${MAX_TIMER_TIMEOUT_SECONDS}` }).min(1, { error: "timeoutSeconds must be a number >= 1" }).max(MAX_TIMER_TIMEOUT_SECONDS, { error: `timeoutSeconds must be a number <= ${MAX_TIMER_TIMEOUT_SECONDS}` }).optional()
});
function normalizeDaytonaRemotePath(value, fallback, fieldName) {
	const candidate = value ?? fallback;
	const normalized = path.posix.normalize(candidate.trim() || fallback);
	if (!normalized.startsWith("/")) throw new Error(`Daytona ${fieldName} must be an absolute POSIX path: ${candidate}`);
	const trimmed = normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized;
	if (trimmed === "/") throw new Error(`Daytona ${fieldName} must not be the filesystem root: ${candidate}`);
	return trimmed;
}
function pathsOverlap(left, right) {
	return left === right || left.startsWith(`${right}/`) || right.startsWith(`${left}/`);
}
function createDaytonaPluginConfigSchema() {
	return buildPluginConfigSchema(DaytonaPluginConfigSchema, { safeParse(value) {
		if (value === void 0) return {
			success: true,
			data: void 0
		};
		const parsed = DaytonaPluginConfigSchema.safeParse(value);
		if (parsed.success) return {
			success: true,
			data: parsed.data
		};
		return {
			success: false,
			error: { issues: mapPluginConfigIssues(parsed.error.issues) }
		};
	} });
}
function resolveDaytonaPluginConfig(value) {
	if (value === void 0) return {
		networkBlockAll: true,
		remoteWorkspaceDir: DEFAULT_REMOTE_WORKSPACE_DIR,
		remoteAgentWorkspaceDir: DEFAULT_REMOTE_AGENT_WORKSPACE_DIR,
		timeoutMs: DEFAULT_TIMEOUT_MS
	};
	const parsed = DaytonaPluginConfigSchema.safeParse(value);
	if (!parsed.success) {
		const message = formatPluginConfigIssue(parsed.error.issues[0]);
		throw new Error(`Invalid daytona plugin config: ${message}`);
	}
	const cfg = parsed.data;
	if (cfg.snapshot && cfg.image) throw new Error("Daytona snapshot and image are mutually exclusive; configure one base per sandbox.");
	if (cfg.resources && !cfg.image) throw new Error("Daytona resources require image; snapshot sandboxes size from the snapshot.");
	if (cfg.autoStopInterval && cfg.autoPauseInterval) throw new Error("Daytona autoStopInterval and autoPauseInterval cannot both be non-zero; pick one idle policy.");
	const remoteWorkspaceDir = normalizeDaytonaRemotePath(cfg.remoteWorkspaceDir, DEFAULT_REMOTE_WORKSPACE_DIR, "remoteWorkspaceDir");
	const remoteAgentWorkspaceDir = normalizeDaytonaRemotePath(cfg.remoteAgentWorkspaceDir, DEFAULT_REMOTE_AGENT_WORKSPACE_DIR, "remoteAgentWorkspaceDir");
	if (pathsOverlap(remoteWorkspaceDir, remoteAgentWorkspaceDir)) throw new Error(`Daytona remoteWorkspaceDir and remoteAgentWorkspaceDir must be distinct, non-nested paths: ${remoteWorkspaceDir}, ${remoteAgentWorkspaceDir}`);
	const volumes = cfg.volumes?.map((volume, index) => {
		const mountPath = normalizeDaytonaRemotePath(volume.mountPath, volume.mountPath, `volumes[${index}].mountPath`);
		if (pathsOverlap(mountPath, remoteWorkspaceDir) || pathsOverlap(mountPath, remoteAgentWorkspaceDir)) throw new Error(`Daytona volumes[${index}].mountPath must not overlap the managed workspace dirs: ${mountPath}`);
		return {
			volumeId: volume.volumeId,
			mountPath
		};
	});
	if (volumes) for (let index = 1; index < volumes.length; index += 1) {
		const mountPath = volumes[index]?.mountPath ?? "";
		const conflict = volumes.slice(0, index).find((earlier) => pathsOverlap(earlier.mountPath, mountPath));
		if (conflict) throw new Error(`Daytona volumes mount paths must not overlap each other: ${conflict.mountPath}, ${mountPath}`);
	}
	return {
		apiKey: cfg.apiKey,
		apiUrl: cfg.apiUrl,
		target: cfg.target,
		snapshot: cfg.snapshot,
		image: cfg.image,
		resources: cfg.resources,
		user: cfg.user,
		volumes,
		autoStopInterval: cfg.autoStopInterval,
		autoPauseInterval: cfg.autoPauseInterval,
		autoArchiveInterval: cfg.autoArchiveInterval,
		autoDeleteInterval: cfg.autoDeleteInterval,
		networkBlockAll: cfg.networkBlockAll ?? !(cfg.networkAllowList || cfg.domainAllowList),
		networkAllowList: cfg.networkAllowList,
		domainAllowList: cfg.domainAllowList,
		remoteWorkspaceDir,
		remoteAgentWorkspaceDir,
		timeoutMs: typeof cfg.timeoutSeconds === "number" ? Math.floor(cfg.timeoutSeconds * 1e3) : DEFAULT_TIMEOUT_MS
	};
}
//#endregion
//#region extensions/daytona/src/launcher-path.ts
const LAUNCHER_FILE_NAME = "daytona-exec-launcher.mjs";
function isDaytonaPluginRoot(dir) {
	return fs$1.existsSync(path.join(dir, "openclaw.plugin.json")) && fs$1.existsSync(path.join(dir, "package.json"));
}
function resolveDaytonaPluginRoot(moduleUrl) {
	let cursor = path.dirname(fileURLToPath(moduleUrl));
	for (let i = 0; i < 6; i += 1) {
		if (isDaytonaPluginRoot(cursor)) return cursor;
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	throw new Error(`[daytona] cannot locate plugin root from ${moduleUrl}`);
}
function resolveDaytonaLauncherPath(moduleUrl = import.meta.url) {
	const root = resolveDaytonaPluginRoot(moduleUrl);
	const candidates = [
		path.join(root, "src", LAUNCHER_FILE_NAME),
		path.join(root, LAUNCHER_FILE_NAME),
		path.join(root, "dist", LAUNCHER_FILE_NAME)
	];
	for (const candidate of candidates) if (fs$1.existsSync(candidate)) return candidate;
	throw new Error(`[daytona] launcher not found; searched ${candidates.join(", ")}`);
}
//#endregion
//#region extensions/daytona/src/upload.ts
/**
* Reject symlinks that escape the uploaded tree so extracting the tar inside
* the sandbox cannot recreate links pointing at host-private paths.
*/
async function assertSafeDaytonaUploadSymlinks(localDir) {
	const rootDir = path.resolve(localDir);
	const resolvedRoot = await fs.realpath(rootDir);
	await walkDirectory(rootDir);
	async function walkDirectory(currentDir) {
		const entries = await fs.readdir(currentDir, { withFileTypes: true });
		for (const entry of entries) {
			const entryPath = path.join(currentDir, entry.name);
			if (entry.isSymbolicLink()) {
				const relativePath = path.relative(rootDir, entryPath).split(path.sep).join("/");
				let resolvedTarget;
				try {
					resolvedTarget = await fs.realpath(entryPath);
				} catch {
					throw new Error(`Daytona sandbox upload refuses broken symlink in the workspace: ${relativePath}`);
				}
				if (resolvedTarget !== resolvedRoot && !isPathInside(resolvedRoot, resolvedTarget)) throw new Error(`Daytona sandbox upload refuses symlink escaping the workspace: ${relativePath}`);
				continue;
			}
			if (entry.isDirectory()) await walkDirectory(entryPath);
		}
	}
}
function createLocalTarFile(localDir, tarPath) {
	return new Promise((resolve, reject) => {
		const tar = spawn("tar", [
			"-C",
			localDir,
			"-cf",
			tarPath,
			"."
		], { stdio: [
			"ignore",
			"ignore",
			"pipe"
		] });
		const stderr = [];
		tar.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
		tar.on("error", reject);
		tar.on("close", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(Buffer.concat(stderr).toString("utf8").trim() || `tar exited with code ${code ?? 1}`));
		});
	});
}
/**
* Upload a local directory into the sandbox by shipping one tar file through
* the toolbox files API and extracting it remotely. Tar keeps permissions,
* executable bits, and empty directories that per-file uploads would lose.
*/
async function uploadDirectoryToDaytonaSandbox(params) {
	await assertSafeDaytonaUploadSymlinks(params.localDir);
	await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-daytona-upload-"
	}, async (workspace) => {
		const tarPath = workspace.path("openclaw-seed.tar");
		await createLocalTarFile(params.localDir, tarPath);
		const remoteTarPath = `/tmp/openclaw-seed-${randomBytes(12).toString("hex")}.tar`;
		await (params.runRemoteOperation ?? (async (run) => await run()))(() => params.sandbox.fs.uploadFile(tarPath, remoteTarPath, Math.ceil(params.timeoutMs / 1e3)));
		try {
			await params.runRemoteShellScript({
				script: "mkdir -p -- \"$1\" && tar -xf \"$2\" -C \"$1\"; ec=$?; rm -f -- \"$2\"; exit $ec",
				args: [params.remoteDir, remoteTarPath]
			});
		} catch (error) {
			await params.sandbox.fs.deleteFile(remoteTarPath).catch(() => {});
			throw error;
		}
	});
}
//#endregion
//#region extensions/daytona/src/backend.ts
const DEFAULT_SNAPSHOT_LABEL = "default";
const IMAGE_CREATE_TIMEOUT_FLOOR_SECONDS = 600;
function resolveConfiguredBaseLabel(pluginConfig) {
	return pluginConfig.snapshot ?? pluginConfig.image ?? DEFAULT_SNAPSHOT_LABEL;
}
const UNUSABLE_SANDBOX_STATES = /* @__PURE__ */ new Set([
	"destroyed",
	"destroying",
	"error",
	"build_failed"
]);
const seededDaytonaSandboxes = /* @__PURE__ */ new Set();
const daytonaProvisioningByScope = /* @__PURE__ */ new Map();
function hashScopeKey(scopeKey) {
	return createHash("sha256").update(scopeKey).digest("hex").slice(0, 32);
}
function isRemotePathInsideRoot(root, candidate) {
	const normalizedRoot = path.posix.normalize(root).replace(/\/+$/, "") || "/";
	const normalizedCandidate = path.posix.normalize(candidate);
	return normalizedCandidate === normalizedRoot || normalizedCandidate.startsWith(`${normalizedRoot}/`);
}
async function isExistingDirectory(candidate) {
	try {
		return (await fs.stat(candidate)).isDirectory();
	} catch {
		return false;
	}
}
function createDaytonaSandboxBackendFactory(params) {
	return async (createParams) => await createDaytonaSandboxBackend({
		pluginConfig: params.pluginConfig,
		hostConfig: params.hostConfig,
		createParams
	});
}
async function createDaytonaSandboxBackend(params) {
	if ((params.createParams.cfg.docker.binds?.length ?? 0) > 0) throw new Error("Daytona sandbox backend does not support sandbox.docker.binds.");
	const impl = new DaytonaSandboxBackendImpl(params);
	await impl.ensureSandbox();
	return impl.asHandle();
}
var DaytonaSandboxBackendImpl = class {
	constructor(params) {
		this.params = params;
		this.ensurePromise = null;
		this.ensuredSandbox = null;
		this.client = null;
		this.refreshedSkillsForNextExecWorkdir = null;
	}
	get pluginConfig() {
		return this.params.pluginConfig;
	}
	get remoteSkillsWorkspaceDir() {
		return path.posix.join(this.pluginConfig.remoteWorkspaceDir, ".openclaw", "sandbox-skills");
	}
	get timeoutSeconds() {
		return Math.max(1, Math.ceil(this.pluginConfig.timeoutMs / 1e3));
	}
	asHandle() {
		const sandbox = this.requireSandbox();
		return {
			id: "daytona",
			runtimeId: sandbox.id,
			runtimeLabel: sandbox.name || sandbox.id,
			workdir: this.pluginConfig.remoteWorkspaceDir,
			env: this.params.createParams.cfg.docker.env,
			configLabel: resolveConfiguredBaseLabel(this.pluginConfig),
			configLabelKind: this.pluginConfig.image ? "Image" : "Snapshot",
			workdirValidation: "backend",
			validateWorkdir: async (workdir) => await this.validateWorkdir(workdir),
			discardPreparedWorkdir: (workdir) => this.discardPreparedWorkdir(workdir),
			workdirRoots: [this.pluginConfig.remoteWorkspaceDir, this.pluginConfig.remoteAgentWorkspaceDir],
			remoteWorkspaceDir: this.pluginConfig.remoteWorkspaceDir,
			remoteAgentWorkspaceDir: this.pluginConfig.remoteAgentWorkspaceDir,
			buildExecSpec: async ({ command, workdir, env, usePty }) => {
				const remoteWorkdir = workdir ?? this.pluginConfig.remoteWorkspaceDir;
				const remoteCommand = buildValidatedExecRemoteCommand({
					command,
					workdir: remoteWorkdir,
					env: {}
				});
				const ensured = await this.ensureSandbox();
				if (!this.consumeRefreshedSkillsForNextExec(remoteWorkdir)) await this.refreshRemoteSkillsWorkspace();
				const connection = await resolveDaytonaConnection({
					config: this.params.hostConfig,
					pluginConfig: this.pluginConfig
				});
				const payload = {
					apiKey: connection.apiKey,
					apiUrl: connection.apiUrl,
					target: connection.target,
					sandboxId: ensured.id,
					command: remoteCommand,
					cwd: remoteWorkdir,
					env,
					usePty
				};
				const payloadDir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-daytona-"));
				const payloadFile = path.join(payloadDir, "payload.json");
				await fs.writeFile(payloadFile, JSON.stringify(payload), {
					flag: "wx",
					mode: 384
				});
				return {
					argv: [
						process.execPath,
						resolveDaytonaLauncherPath(),
						"--payload-file",
						payloadFile
					],
					env: sanitizeEnvVars(process.env).allowed,
					stdinMode: "pipe-open",
					finalizeToken: { payloadDir }
				};
			},
			finalizeExec: async ({ token }) => {
				const payloadDir = isRecord(token) ? token.payloadDir : void 0;
				if (typeof payloadDir === "string") await fs.rm(payloadDir, {
					recursive: true,
					force: true
				});
			},
			runShellCommand: async (command) => await this.runRemoteShellScript(command),
			createFsBridge: ({ sandbox: sandboxContext }) => createRemoteShellSandboxFsBridge({
				sandbox: sandboxContext,
				runtime: this.asHandle()
			}),
			runRemoteShellScript: async (command) => await this.runRemoteShellScript(command)
		};
	}
	requireSandbox() {
		if (!this.ensuredSandbox) throw new Error("Daytona sandbox runtime is not provisioned yet.");
		return this.ensuredSandbox;
	}
	async ensureSandbox() {
		if (this.ensurePromise) return await this.ensurePromise;
		const scopeKey = this.params.createParams.scopeKey;
		const pending = daytonaProvisioningByScope.get(scopeKey) ?? this.ensureSandboxInner();
		this.ensurePromise = pending;
		daytonaProvisioningByScope.set(scopeKey, pending);
		try {
			const sandbox = await pending;
			this.ensuredSandbox = sandbox;
			return sandbox;
		} catch (error) {
			this.ensurePromise = null;
			throw error;
		} finally {
			if (daytonaProvisioningByScope.get(scopeKey) === pending) daytonaProvisioningByScope.delete(scopeKey);
		}
	}
	async getClient() {
		if (this.client) return this.client;
		const connection = await resolveDaytonaConnection({
			config: this.params.hostConfig,
			pluginConfig: this.pluginConfig
		});
		this.client = await createDaytonaClient(connection);
		return this.client;
	}
	async ensureSandboxInner() {
		const client = await this.getClient();
		const adopted = await this.adoptRegisteredSandbox(client);
		if (adopted) {
			await this.startSandboxIfNeeded(adopted);
			if (!seededDaytonaSandboxes.has(adopted.id)) {
				await this.seedWorkspaceIfMissing(adopted);
				seededDaytonaSandboxes.add(adopted.id);
			}
			return adopted;
		}
		const baseParams = {
			labels: {
				"openclaw.sandbox": "1",
				"openclaw.scope": hashScopeKey(this.params.createParams.scopeKey)
			},
			user: this.pluginConfig.user,
			volumes: this.pluginConfig.volumes,
			autoStopInterval: this.pluginConfig.autoStopInterval,
			autoPauseInterval: this.pluginConfig.autoPauseInterval,
			autoArchiveInterval: this.pluginConfig.autoArchiveInterval,
			autoDeleteInterval: this.pluginConfig.autoDeleteInterval,
			networkBlockAll: this.pluginConfig.networkBlockAll,
			networkAllowList: this.pluginConfig.networkAllowList,
			domainAllowList: this.pluginConfig.domainAllowList
		};
		const sandbox = this.pluginConfig.image ? await client.create({
			...baseParams,
			image: this.pluginConfig.image,
			resources: this.pluginConfig.resources
		}, { timeout: Math.max(this.timeoutSeconds, IMAGE_CREATE_TIMEOUT_FLOOR_SECONDS) }) : await client.create({
			...baseParams,
			snapshot: this.pluginConfig.snapshot
		}, { timeout: this.timeoutSeconds });
		try {
			await this.seedWorkspace(sandbox);
		} catch (error) {
			await sandbox.delete(this.timeoutSeconds).catch(() => {});
			throw error;
		}
		seededDaytonaSandboxes.add(sandbox.id);
		return sandbox;
	}
	async adoptRegisteredSandbox(client) {
		for (const runtimeId of this.params.createParams.registeredRuntimeIds ?? []) {
			let sandbox;
			try {
				sandbox = await withDaytonaRetry("daytona get", () => client.get(runtimeId));
			} catch (error) {
				if (isDaytonaNotFoundError(error)) continue;
				throw error;
			}
			if (sandbox.state && UNUSABLE_SANDBOX_STATES.has(sandbox.state)) continue;
			return sandbox;
		}
		return null;
	}
	async startSandboxIfNeeded(sandbox) {
		if (sandbox.state === "started") return;
		try {
			await sandbox.start(this.timeoutSeconds);
		} catch (error) {
			await sandbox.refreshData().catch(() => {});
			if (sandbox.state !== "started") throw error;
		}
	}
	async seedWorkspaceIfMissing(sandbox) {
		if ((await this.runWrappedRemoteCommand(sandbox, buildRemoteCommand([
			"/bin/sh",
			"-c",
			"if [ -d \"$1\" ]; then printf \"1\\n\"; else printf \"0\\n\"; fi",
			"openclaw-sandbox-check",
			this.pluginConfig.remoteWorkspaceDir
		]), {})).stdout.toString("utf8").trim() === "1") return;
		await this.seedWorkspace(sandbox);
	}
	async seedWorkspace(sandbox) {
		await this.uploadDirectory(sandbox, this.params.createParams.workspaceDir, this.pluginConfig.remoteWorkspaceDir);
		if (this.params.createParams.cfg.workspaceAccess !== "none" && path.resolve(this.params.createParams.agentWorkspaceDir) !== path.resolve(this.params.createParams.workspaceDir)) await this.uploadDirectory(sandbox, this.params.createParams.agentWorkspaceDir, this.pluginConfig.remoteAgentWorkspaceDir);
	}
	async uploadDirectory(sandbox, localDir, remoteDir) {
		await uploadDirectoryToDaytonaSandbox({
			sandbox,
			localDir,
			remoteDir,
			timeoutMs: this.pluginConfig.timeoutMs,
			runRemoteShellScript: async ({ script, args }) => await this.runWrappedRemoteCommand(sandbox, buildRemoteCommand([
				"/bin/sh",
				"-c",
				script,
				"openclaw-sandbox-upload",
				...args ?? []
			]), {}),
			runRemoteOperation: async (run) => await this.withStartedSandbox(sandbox, run)
		});
	}
	async validateWorkdir(workdir) {
		const sandbox = await this.ensureSandbox();
		let refreshedSkillsForWorkdir = null;
		try {
			if (isRemotePathInsideRoot(this.remoteSkillsWorkspaceDir, workdir)) {
				await this.refreshRemoteSkillsWorkspace();
				refreshedSkillsForWorkdir = workdir;
				this.refreshedSkillsForNextExecWorkdir = workdir;
			}
			const result = await this.runWrappedRemoteCommand(sandbox, buildRemoteWorkdirValidationCommand({
				workdir,
				root: this.resolveWorkdirValidationRoot(workdir)
			}), { allowFailure: true });
			const resolvedWorkdir = result.code === 0 ? result.stdout.toString("utf8").trim() : "";
			if (refreshedSkillsForWorkdir) this.refreshedSkillsForNextExecWorkdir = resolvedWorkdir || null;
			return resolvedWorkdir || null;
		} catch (error) {
			if (refreshedSkillsForWorkdir && this.refreshedSkillsForNextExecWorkdir === refreshedSkillsForWorkdir) this.refreshedSkillsForNextExecWorkdir = null;
			throw error;
		}
	}
	discardPreparedWorkdir(workdir) {
		if (this.refreshedSkillsForNextExecWorkdir === workdir) this.refreshedSkillsForNextExecWorkdir = null;
	}
	consumeRefreshedSkillsForNextExec(workdir) {
		if (this.refreshedSkillsForNextExecWorkdir !== workdir) {
			this.refreshedSkillsForNextExecWorkdir = null;
			return false;
		}
		this.refreshedSkillsForNextExecWorkdir = null;
		return true;
	}
	resolveWorkdirValidationRoot(workdir) {
		return [this.pluginConfig.remoteAgentWorkspaceDir, this.pluginConfig.remoteWorkspaceDir].find((root) => isRemotePathInsideRoot(root, workdir)) ?? this.pluginConfig.remoteWorkspaceDir;
	}
	async refreshRemoteSkillsWorkspace() {
		if (this.params.createParams.cfg.workspaceAccess !== "rw" || !this.params.createParams.skillsWorkspaceDir) return;
		const sandbox = await this.ensureSandbox();
		await this.runWrappedRemoteCommand(sandbox, buildRemoteCommand([
			"/bin/sh",
			"-c",
			"mkdir -p -- \"$1\" && find \"$1\" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +",
			"openclaw-sandbox-clear",
			this.remoteSkillsWorkspaceDir
		]), {});
		if (!await isExistingDirectory(this.params.createParams.skillsWorkspaceDir)) return;
		await this.uploadDirectory(sandbox, this.params.createParams.skillsWorkspaceDir, this.remoteSkillsWorkspaceDir);
	}
	async runRemoteShellScript(command) {
		const sandbox = await this.ensureSandbox();
		await this.refreshRemoteSkillsWorkspace();
		return await this.runWrappedRemoteCommand(sandbox, buildRemoteCommand([
			"/bin/sh",
			"-c",
			command.script,
			"openclaw-sandbox-fs",
			...command.args ?? []
		]), {
			stdin: command.stdin,
			allowFailure: command.allowFailure,
			signal: command.signal
		});
	}
	/**
	* Run a shell command through a per-call Daytona session with separated,
	* binary-safe streams. The session transport exists for cancellation:
	* deleting the session kills the running remote command, so an abort stops
	* the mutation before the caller is told it stopped. Session output is not
	* binary-safe, so the command redirects both streams to files and emits
	* them base64-encoded on stdout.
	*/
	async runWrappedRemoteCommand(sandbox, rawCommand, options) {
		options.signal?.throwIfAborted();
		const token = randomBytes(8).toString("hex");
		const stdinPath = options.stdin === void 0 ? null : `/tmp/openclaw-in-${token}`;
		const outPath = `/tmp/openclaw-out-${token}`;
		const errPath = `/tmp/openclaw-err-${token}`;
		const stagedPaths = stdinPath ? [
			stdinPath,
			outPath,
			errPath
		] : [outPath, errPath];
		const separator = `__openclaw-daytona-${token}__`;
		const wrapped = [
			`{ ${rawCommand}${stdinPath ? ` < ${stdinPath}` : ""} ; } > ${outPath} 2> ${errPath}`,
			"oc_ec=$?",
			`base64 < ${outPath}`,
			`printf '%s' '${separator}'`,
			`base64 < ${errPath}`,
			`rm -f ${outPath} ${errPath}${stdinPath ? ` ${stdinPath}` : ""}`,
			"( exit $oc_ec )"
		].join("; ");
		const sessionId = `openclaw-fs-${token}`;
		let response;
		try {
			if (stdinPath) {
				const data = typeof options.stdin === "string" ? Buffer.from(options.stdin, "utf8") : options.stdin;
				await this.withStartedSandbox(sandbox, () => sandbox.fs.uploadFile(data ?? Buffer.alloc(0), stdinPath, this.timeoutSeconds));
				options.signal?.throwIfAborted();
			}
			await this.withStartedSandbox(sandbox, () => sandbox.process.createSession(sessionId));
			response = await this.runCancellableSessionCommand(sandbox, sessionId, wrapped, options.signal);
		} catch (error) {
			await sandbox.process.deleteSession(sessionId).catch(() => {});
			await this.removeRemoteStagingFiles(sandbox, stagedPaths);
			throw error;
		}
		await sandbox.process.deleteSession(sessionId).catch(() => {});
		const merged = response.stdout ?? "";
		const separatorIndex = merged.indexOf(separator);
		if (separatorIndex < 0) throw new Error(`Daytona sandbox command transport produced unexpected output: ${merged.slice(0, 200)}`);
		const stdout = Buffer.from(merged.slice(0, separatorIndex), "base64");
		const stderr = Buffer.from(merged.slice(separatorIndex + separator.length), "base64");
		const code = response.exitCode ?? 1;
		if (code !== 0 && !options.allowFailure) throw new Error(stderr.toString("utf8").trim() || `Daytona sandbox command failed with exit code ${code}`);
		return {
			stdout,
			stderr,
			code
		};
	}
	/**
	* Execute one session command synchronously; on abort, kill the remote
	* command by deleting its session and only then report the abort, so a
	* cancelled mutation cannot keep changing sandbox state after rejection.
	*/
	async runCancellableSessionCommand(sandbox, sessionId, command, signal) {
		signal?.throwIfAborted();
		const execution = sandbox.process.executeSessionCommand(sessionId, {
			command,
			runAsync: false,
			suppressInputEcho: true
		}, this.timeoutSeconds);
		if (!signal) return await execution;
		let removeAbortListener;
		const aborted = new Promise((_, reject) => {
			const onAbort = () => {
				sandbox.process.deleteSession(sessionId).catch(() => {}).then(() => {
					reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Daytona sandbox command aborted"));
				});
			};
			if (signal.aborted) {
				onAbort();
				return;
			}
			signal.addEventListener("abort", onAbort, { once: true });
			removeAbortListener = () => signal.removeEventListener("abort", onAbort);
		});
		try {
			return await Promise.race([execution, aborted]);
		} finally {
			removeAbortListener?.();
			execution.catch(() => {});
		}
	}
	/**
	* Daytona auto-stops idle sandboxes, and a cached handle can outlive that.
	* First-touch failures get one refresh-start-retry so a sandbox stopped
	* between tool calls restarts on next use, matching the documented model.
	*/
	async withStartedSandbox(sandbox, run) {
		try {
			return await run();
		} catch (error) {
			if (isDaytonaNotFoundError(error)) throw error;
			await sandbox.refreshData().catch(() => {});
			const state = sandbox.state;
			if (state === "started" || state && UNUSABLE_SANDBOX_STATES.has(state)) throw error;
			await sandbox.start(this.timeoutSeconds);
			return await run();
		}
	}
	async removeRemoteStagingFiles(sandbox, stagedPaths) {
		for (const stagedPath of stagedPaths) await sandbox.fs.deleteFile(stagedPath).catch(() => {});
	}
};
function resolveDaytonaPluginConfigFromConfig(config, fallback) {
	const raw = config.plugins?.entries?.daytona?.config;
	if (raw === void 0) return fallback;
	try {
		return resolveDaytonaPluginConfig(raw);
	} catch {
		return fallback;
	}
}
function createDaytonaSandboxBackendManager(params) {
	const getSandboxForEntry = async (config, containerName) => {
		const pluginConfig = resolveDaytonaPluginConfigFromConfig(config, params.pluginConfig);
		const client = await createDaytonaClient(await resolveDaytonaConnection({
			config,
			pluginConfig
		}));
		return {
			pluginConfig,
			sandbox: await withDaytonaRetry("daytona get", () => client.get(containerName))
		};
	};
	return {
		async describeRuntime({ entry, config }) {
			const configuredLabel = resolveConfiguredBaseLabel(resolveDaytonaPluginConfigFromConfig(config, params.pluginConfig));
			try {
				const { sandbox } = await getSandboxForEntry(config, entry.containerName);
				return {
					running: sandbox.state === "started",
					actualConfigLabel: sandbox.snapshot ?? DEFAULT_SNAPSHOT_LABEL,
					configLabelMatch: entry.image === configuredLabel
				};
			} catch (error) {
				if (isDaytonaNotFoundError(error)) return {
					running: false,
					configLabelMatch: entry.image === configuredLabel
				};
				throw error;
			}
		},
		async removeRuntime({ entry, config }) {
			let sandbox;
			try {
				({sandbox} = await getSandboxForEntry(config, entry.containerName));
			} catch (error) {
				if (isDaytonaNotFoundError(error)) return;
				throw error;
			}
			const timeoutSeconds = Math.max(1, Math.ceil(resolveDaytonaPluginConfigFromConfig(config, params.pluginConfig).timeoutMs / 1e3));
			await withDaytonaRetry("daytona delete", () => sandbox.delete(timeoutSeconds));
		}
	};
}
//#endregion
//#region extensions/daytona/index.ts
var daytona_default = definePluginEntry({
	id: "daytona",
	name: "Daytona Sandbox",
	description: "Daytona cloud sandbox runtime for agent exec and file tools.",
	configSchema: createDaytonaPluginConfigSchema(),
	register(api) {
		if (api.registrationMode !== "full") return;
		const pluginConfig = resolveDaytonaPluginConfig(api.pluginConfig);
		registerSandboxBackend("daytona", {
			factory: createDaytonaSandboxBackendFactory({
				pluginConfig,
				hostConfig: api.config
			}),
			manager: createDaytonaSandboxBackendManager({
				pluginConfig,
				hostConfig: api.config
			}),
			resolveWorkdir: () => pluginConfig.remoteWorkspaceDir
		});
	}
});
//#endregion
export { daytona_default as default };
