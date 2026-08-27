import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { r as markOpenClawExecEnv } from "./openclaw-exec-env-BmbZ1aqS.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { c as splitSandboxBindSpec, s as resolveSandboxHostPathViaExistingAncestor } from "./network-mode-CIoz0eps.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { Mt as tableExists, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DzZaraqY.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { c as isPlainCommandExitFailure, s as spawnCommand } from "./exec-BL80Wdzl.js";
import { C as SANDBOX_DOCKER_CREATE_ARGS_EPOCH, x as SANDBOX_COMMAND_MAX_BUFFER_BYTES } from "./constants-B8EtrfM_.js";
import { t as hashTextSha256 } from "./hash-DZK-8tRm.js";
import { o as computeSandboxConfigHash, r as sanitizeExplicitSandboxEnvVars, t as resolveDockerEnvPolicyEpoch } from "./sanitize-env-vars-Cs0Tdu9P.js";
import { c as resolveReadOnlyWorkspaceSkillMounts, i as formatReadOnlyWorkspaceSkillMountHashState, n as appendWorkspaceMountArgs, r as filterBindsConflictingWithProtectedMounts, s as resolveProtectedSkillMountContainerPaths, t as appendReadOnlyWorkspaceSkillMountArgs } from "./workspace-mounts-BsoH3efL.js";
import { i as slugifySessionKey, n as resolveSandboxAgentId, t as buildSandboxContainerName } from "./shared-CiBmkGZf.js";
import { r as validateSandboxSecurity } from "./validate-sandbox-security-K0PUWhhE.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isIP } from "node:net";
//#region src/agents/sandbox/container-engine.ts
/**
* Shared local container-engine process execution and backend selection.
*/
const DOCKER_SANDBOX_ENGINE = {
	id: "docker",
	command: "docker",
	displayName: "Docker"
};
const PODMAN_SANDBOX_ENGINE = {
	id: "podman",
	command: "podman",
	displayName: "Podman"
};
function missingContainerEngineMessage(engine) {
	if (engine.id === "docker") return "Sandbox mode requires Docker, but the \"docker\" command was not found in PATH. Install Docker (and ensure \"docker\" is available), or set `agents.defaults.sandbox.mode=off` to disable sandboxing.";
	return "Sandbox mode requires Podman, but the \"podman\" command was not found in PATH. Install Podman (and ensure \"podman\" is available), choose another sandbox backend, or set `agents.defaults.sandbox.mode=off` to disable sandboxing.";
}
async function execContainerRaw(engine, args, opts) {
	let result;
	try {
		result = await spawnCommand([
			engine.command,
			...engine.globalArgs ?? [],
			...args
		], {
			cancelSignal: opts?.signal,
			encoding: "buffer",
			input: opts?.input ?? Buffer.alloc(0),
			maxBuffer: SANDBOX_COMMAND_MAX_BUFFER_BYTES,
			reject: false,
			stripFinalNewline: false
		});
	} catch (error) {
		if (opts?.signal?.aborted) throw createAbortError("Aborted");
		if (error.code === "ENOENT") throw Object.assign(new Error(missingContainerEngineMessage(engine)), {
			code: "INVALID_CONFIG",
			cause: error
		});
		throw error;
	}
	if (opts?.signal?.aborted || result.isCanceled) throw createAbortError("Aborted");
	if (result.failed && !isPlainCommandExitFailure(result)) {
		if (result.code === "ENOENT") throw Object.assign(new Error(missingContainerEngineMessage(engine)), {
			code: "INVALID_CONFIG",
			cause: result
		});
		throw toErrorObject(result, `${engine.displayName} command execution failed`);
	}
	const stdout = Buffer.from(result.stdout);
	const stderr = Buffer.from(result.stderr);
	const exitCode = result.exitCode ?? (result.failed ? 1 : 0);
	if (exitCode !== 0 && !opts?.allowFailure) {
		const message = stderr.length > 0 ? stderr.toString("utf8").trim() : "";
		throw Object.assign(new Error(message || `${engine.displayName} command failed (exit ${exitCode})`), {
			code: exitCode,
			stdout,
			stderr
		});
	}
	return {
		stdout,
		stderr,
		code: exitCode
	};
}
async function execContainer(engine, args, opts) {
	const result = await execContainerRaw(engine, args, opts);
	return {
		stdout: result.stdout.toString("utf8"),
		stderr: result.stderr.toString("utf8"),
		code: result.code
	};
}
//#endregion
//#region src/agents/sandbox/podman-runtime.ts
const SANDBOX_ENGINE_PROBE_TIMEOUT_MS = 5e3;
const PODMAN_INIT_PATH = "/run/podman-init";
const PODMAN_KEEP_ID_MAPPING_MIN_VERSION = [4, 3];
const PODMAN_GPUS_MIN_VERSION = [5, 0];
function hashPodmanTarget(kind, ...parts) {
	return `${kind}:${hashTextSha256(parts.join("\0")).slice(0, 32)}`;
}
function invalidPodmanConfig(message) {
	return Object.assign(new Error(message), { code: "INVALID_CONFIG" });
}
function resolvePodmanKeepIdMode(user) {
	const normalized = user?.trim();
	if (!normalized) return "keep-id";
	const match = /^(\d+)(?::(\d+))?$/u.exec(normalized);
	if (!match) throw invalidPodmanConfig(`Rootless Podman sandbox user "${normalized}" must be a numeric UID or UID:GID so keep-id can preserve bind-mount ownership.`);
	const uid = match[1] ?? "";
	const gid = match[2];
	const normalizedUid = BigInt(uid).toString();
	const normalizedGid = gid === void 0 ? void 0 : BigInt(gid).toString();
	if (normalizedUid === "0" || normalizedGid === "0") throw invalidPodmanConfig(`Rootless Podman sandbox user "${normalized}" cannot use UID or GID 0 while preserving workspace bind ownership. Bake root-required setup into the image or use rootful Podman.`);
	return normalizedGid ? `keep-id:uid=${normalizedUid},gid=${normalizedGid}` : `keep-id:uid=${normalizedUid}`;
}
function assertPodmanVersionAtLeast(version, minimum, feature) {
	const match = /^(\d+)\.(\d+)/u.exec(version.trim());
	const actualMajor = match ? Number(match[1]) : NaN;
	const actualMinor = match ? Number(match[2]) : NaN;
	if (actualMajor > minimum[0] || actualMajor === minimum[0] && actualMinor >= minimum[1]) return;
	throw invalidPodmanConfig(`${feature} requires Podman ${minimum.join(".")} or newer, but the active engine reports "${version || "unknown"}". Upgrade Podman or choose another sandbox backend.`);
}
async function isPodmanMachineConnection(params) {
	let uri;
	try {
		uri = new URL(params.uri);
	} catch {
		return false;
	}
	const hostname = uri.hostname.replace(/^\[|\]$/gu, "");
	const loopback = isIP(hostname) === 4 && hostname.startsWith("127.") || isIP(hostname) === 6 && hostname === "::1";
	if (uri.protocol !== "ssh:" || !loopback || !uri.port || !uri.username) return false;
	const result = await execContainer(PODMAN_SANDBOX_ENGINE, [
		"machine",
		"list",
		"--format",
		"json"
	], {
		allowFailure: true,
		signal: AbortSignal.timeout(SANDBOX_ENGINE_PROBE_TIMEOUT_MS)
	});
	if (result.code !== 0) return false;
	let parsed;
	try {
		parsed = JSON.parse(result.stdout);
	} catch {
		return false;
	}
	if (!Array.isArray(parsed)) return false;
	const selectedIdentity = params.identity ? path.resolve(params.identity) : "";
	return parsed.some((entry) => {
		if (typeof entry !== "object" || entry === null) return false;
		const machine = entry;
		const machineName = typeof machine.Name === "string" ? machine.Name : "";
		const nameMatches = !params.selectedName || params.selectedName === machineName || params.selectedName === `${machineName}-root`;
		const portMatches = (typeof machine.Port === "string" || typeof machine.Port === "number" ? String(machine.Port) : "") === uri.port;
		const connectionUser = decodeURIComponent(uri.username);
		const rootConnection = params.selectedName === `${machineName}-root`;
		const userMatches = typeof machine.RemoteUsername === "string" && (connectionUser === machine.RemoteUsername || rootConnection && connectionUser === "root");
		const machineIdentity = typeof machine.IdentityPath === "string" && machine.IdentityPath ? path.resolve(machine.IdentityPath) : "";
		const identityMatches = !selectedIdentity || !machineIdentity || selectedIdentity === machineIdentity;
		return machine.Running === true && nameMatches && portMatches && userMatches && identityMatches;
	});
}
async function assertSupportedPodmanConnection(remoteSocketPath) {
	const result = await execContainer(PODMAN_SANDBOX_ENGINE, [
		"system",
		"connection",
		"list",
		"--format",
		"json"
	], {
		allowFailure: true,
		signal: AbortSignal.timeout(SANDBOX_ENGINE_PROBE_TIMEOUT_MS)
	});
	if (result.code !== 0) {
		const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
		throw new Error(`Failed to inspect the active Podman connection: ${detail}`);
	}
	let parsed;
	try {
		parsed = JSON.parse(result.stdout);
	} catch (error) {
		throw new Error("Podman returned invalid connection metadata", { cause: error });
	}
	const connections = Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "object" && entry !== null) : [];
	const configuredUri = process.env.CONTAINER_HOST?.trim();
	const configuredName = process.env.CONTAINER_CONNECTION?.trim();
	let selected;
	if (configuredUri) selected = connections.find((entry) => entry.URI === configuredUri);
	else if (configuredName) selected = connections.find((entry) => entry.Name === configuredName);
	else selected = connections.find((entry) => entry.Default === true);
	const selectedUri = configuredUri || (typeof selected?.URI === "string" ? selected.URI : "") || (remoteSocketPath ? `unix://${remoteSocketPath}` : "");
	const unsupportedRemoteError = () => invalidPodmanConfig("Podman sandboxing supports a local Podman engine or Podman Machine, but the active Podman connection is remote or could not be identified. Use the SSH sandbox backend for a remote host.");
	if (!configuredUri && configuredName && !selected) throw unsupportedRemoteError();
	if (!selectedUri) throw unsupportedRemoteError();
	if (selectedUri && !selectedUri.startsWith("unix://")) {
		const identity = process.env.CONTAINER_SSHKEY?.trim() || (typeof selected?.Identity === "string" ? selected.Identity : "");
		if (await isPodmanMachineConnection({
			selectedName: typeof selected?.Name === "string" ? selected.Name : "",
			uri: selectedUri,
			identity
		})) return {
			machine: true,
			target: {
				key: hashPodmanTarget("machine", selectedUri, identity),
				globalArgs: [
					"--url",
					selectedUri,
					...identity ? ["--identity", identity] : []
				]
			}
		};
		throw unsupportedRemoteError();
	}
	return {
		machine: false,
		target: {
			key: hashPodmanTarget("socket", selectedUri),
			globalArgs: ["--url", selectedUri]
		}
	};
}
async function resolvePodmanSandboxRuntimeInfo() {
	const result = await execContainer(PODMAN_SANDBOX_ENGINE, [
		"info",
		"--format",
		"{{.Host.Security.Rootless}}	{{.Host.ServiceIsRemote}}	{{.Host.RemoteSocket.Path}}	{{.Version.Version}}"
	], {
		allowFailure: true,
		signal: AbortSignal.timeout(SANDBOX_ENGINE_PROBE_TIMEOUT_MS)
	});
	if (result.code !== 0) {
		const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
		throw new Error(`Failed to inspect Podman user namespace mode: ${detail}`);
	}
	const [rootless = "", serviceIsRemote = "", remoteSocketPath = "", version = ""] = result.stdout.trim().split("	", 4);
	let machine = false;
	let target = {
		key: "local",
		globalArgs: []
	};
	if (serviceIsRemote === "true") ({machine, target} = await assertSupportedPodmanConnection(remoteSocketPath));
	return {
		machine,
		rootless: rootless === "true",
		target,
		version
	};
}
async function validateSandboxContainerEngineTarget(engine, expectedTarget) {
	if (engine.id === "podman") assertPodmanSandboxTarget(expectedTarget, (await resolvePodmanSandboxRuntimeInfo()).target);
}
function assertPodmanSandboxTarget(expectedTarget, actualTarget) {
	if (expectedTarget && (actualTarget.key !== expectedTarget.key || actualTarget.globalArgs.length !== expectedTarget.globalArgs.length || actualTarget.globalArgs.some((arg, index) => arg !== expectedTarget.globalArgs[index]))) throw invalidPodmanConfig("The active Podman connection changed after this sandbox runtime was created. Restore the original Podman target before inspecting, executing, or removing the runtime.");
}
function bindPodmanSandboxEngine(target) {
	return {
		...PODMAN_SANDBOX_ENGINE,
		globalArgs: target.globalArgs
	};
}
function mountTargetCoversPodmanInit(target) {
	const normalizedTarget = path.posix.normalize(target.trim());
	return normalizedTarget === "/" || normalizedTarget === PODMAN_INIT_PATH || PODMAN_INIT_PATH.startsWith(`${normalizedTarget}/`) || normalizedTarget.startsWith(`${PODMAN_INIT_PATH}/`);
}
function assertPodmanMachineBindSourcesSupported(params) {
	const hostHome = resolveSandboxHostPathViaExistingAncestor(path.resolve(os.homedir()));
	const sources = /* @__PURE__ */ new Set([params.workspaceDir]);
	if (params.workspaceAccess !== "none" && params.workspaceDir !== params.agentWorkspaceDir) sources.add(params.agentWorkspaceDir);
	for (const mount of params.readOnlyWorkspaceSkillMounts) sources.add(mount.hostPath);
	for (const bind of params.cfg.binds ?? []) {
		const source = splitSandboxBindSpec(bind)?.host.trim();
		if (source) sources.add(source);
	}
	for (const source of sources) {
		if (isPathInside(hostHome, resolveSandboxHostPathViaExistingAncestor(path.resolve(source)))) continue;
		throw invalidPodmanConfig(`Podman Machine sandbox bind source "${source}" is outside the default host home share "${os.homedir()}". Move the workspace or bind under the host home directory, or use Docker or the SSH sandbox backend.`);
	}
}
function resolvePodmanSandboxCreatePolicy(params) {
	const cfg = params.dockerTmpfsSource === "default" ? {
		...params.cfg,
		tmpfs: params.cfg.tmpfs.filter((entry) => entry.trim() !== "/run")
	} : params.cfg;
	if (mountTargetCoversPodmanInit(params.cfg.workdir) || cfg.tmpfs.some((entry) => mountTargetCoversPodmanInit(entry.split(":", 1)[0]?.trim() || "")) || params.cfg.binds?.some((bind) => {
		const target = splitSandboxBindSpec(bind)?.container.trim();
		return target ? mountTargetCoversPodmanInit(target) : false;
	}) === true) throw invalidPodmanConfig("Podman sandbox configuration would cover Podman's init path at /run/podman-init. Remove the conflicting tmpfs or bind mount so orphaned sandbox processes can be reaped.");
	if (params.runtimeInfo.machine) assertPodmanMachineBindSourcesSupported(params);
	if (params.cfg.gpus?.trim()) assertPodmanVersionAtLeast(params.runtimeInfo.version, PODMAN_GPUS_MIN_VERSION, "Podman sandbox GPU passthrough");
	const extraCreateArgs = ["--http-proxy=false"];
	if (params.cfg.readOnlyRoot) extraCreateArgs.push("--read-only-tmpfs=true");
	if (params.runtimeInfo.rootless) {
		if (params.cfg.user?.trim()) assertPodmanVersionAtLeast(params.runtimeInfo.version, PODMAN_KEEP_ID_MAPPING_MIN_VERSION, "Rootless Podman sandbox user mapping");
		extraCreateArgs.push("--userns", resolvePodmanKeepIdMode(params.cfg.user));
	}
	return {
		cfg,
		extraCreateArgs
	};
}
function resolvePodmanSandboxConfigHash(params) {
	const userMode = params.configuredUser ? "configured-user" : "keep-id";
	return `${params.genericConfigHash}:podman-runtime-v9:${userMode}:${params.dockerTmpfsSource}`;
}
function resolvePodmanSandboxContainerPrefix(containerPrefix) {
	return `${containerPrefix}podman-`;
}
//#endregion
//#region src/agents/sandbox/current-config.ts
function formatSandboxRecreateHint(params) {
	if (params.scope === "session") return formatCliCommand(`openclaw sandbox recreate --session ${params.sessionKey}`);
	if (params.scope === "agent") return formatCliCommand(`openclaw sandbox recreate --agent ${resolveSandboxAgentId(params.sessionKey) ?? "main"}`);
	return formatCliCommand("openclaw sandbox recreate --all");
}
function handleHotSandboxConfigMismatch(params) {
	const hint = formatSandboxRecreateHint(params);
	if (params.requireCurrentConfig) throw new Error(`Sandbox config changed for ${params.containerName}; restricted dispatch requires the current container config. Recreate first: ${hint}`);
	defaultRuntime.log(`Sandbox config changed for ${params.containerName} (recently used). Recreate to apply: ${hint}`);
}
//#endregion
//#region src/agents/sandbox/registry.ts
/**
* Persistent sandbox registry storage.
*
* Tracks runtime and browser containers in the shared state DB.
*/
function getSandboxRegistryKysely(db) {
	return getNodeSqliteKysely(db);
}
function parseRegistryEntryJson(row) {
	try {
		const parsed = JSON.parse(row.entry_json);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function optionalPayloadString(value) {
	return typeof value === "string" ? value : "";
}
function rowToContainerEntry(row) {
	if (row.registry_kind !== "container") return null;
	const payload = parseRegistryEntryJson(row);
	if (!payload) return null;
	return normalizeSandboxRegistryEntry({
		...payload,
		containerName: row.container_name,
		sessionKey: row.session_key ?? optionalPayloadString(payload.sessionKey),
		createdAtMs: row.created_at_ms ?? Number(payload.createdAtMs ?? 0),
		lastUsedAtMs: row.last_used_at_ms ?? Number(payload.lastUsedAtMs ?? 0),
		image: row.image ?? optionalPayloadString(payload.image),
		...row.backend_id != null ? { backendId: row.backend_id } : {},
		...row.runtime_label != null ? { runtimeLabel: row.runtime_label } : {},
		...row.config_label_kind != null ? { configLabelKind: row.config_label_kind } : {},
		...row.config_hash != null ? { configHash: row.config_hash } : {}
	});
}
function rowToBrowserEntry(row) {
	if (row.registry_kind !== "browser") return null;
	const payload = parseRegistryEntryJson(row);
	if (!payload) return null;
	return {
		...payload,
		containerName: row.container_name,
		sessionKey: row.session_key ?? optionalPayloadString(payload.sessionKey),
		createdAtMs: row.created_at_ms ?? Number(payload.createdAtMs ?? 0),
		lastUsedAtMs: row.last_used_at_ms ?? Number(payload.lastUsedAtMs ?? 0),
		image: row.image ?? optionalPayloadString(payload.image),
		cdpPort: row.cdp_port ?? Number(payload.cdpPort ?? 0),
		...row.no_vnc_port != null ? { noVncPort: row.no_vnc_port } : {},
		...row.config_hash != null ? { configHash: row.config_hash } : {}
	};
}
function containerEntryToRow(entry, existing) {
	const next = {
		...entry,
		backendId: entry.backendId ?? existing?.backendId,
		backendTarget: entry.backendTarget ?? existing?.backendTarget,
		runtimeLabel: entry.runtimeLabel ?? existing?.runtimeLabel,
		createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
		image: existing?.image ?? entry.image,
		configLabelKind: entry.configLabelKind ?? existing?.configLabelKind,
		configHash: entry.configHash ?? existing?.configHash
	};
	return {
		registry_kind: "container",
		container_name: next.containerName,
		session_key: next.sessionKey,
		backend_id: next.backendId ?? null,
		runtime_label: next.runtimeLabel ?? null,
		image: next.image,
		created_at_ms: next.createdAtMs,
		last_used_at_ms: next.lastUsedAtMs,
		config_label_kind: next.configLabelKind ?? null,
		config_hash: next.configHash ?? null,
		cdp_port: null,
		no_vnc_port: null,
		entry_json: JSON.stringify(next),
		updated_at: Date.now()
	};
}
function browserEntryToRow(entry, existing) {
	const next = {
		...entry,
		createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
		image: existing?.image ?? entry.image,
		configHash: entry.configHash ?? existing?.configHash
	};
	return {
		registry_kind: "browser",
		container_name: next.containerName,
		session_key: next.sessionKey,
		backend_id: null,
		runtime_label: null,
		image: next.image,
		created_at_ms: next.createdAtMs,
		last_used_at_ms: next.lastUsedAtMs,
		config_label_kind: null,
		config_hash: next.configHash ?? null,
		cdp_port: next.cdpPort,
		no_vnc_port: next.noVncPort ?? null,
		entry_json: JSON.stringify(next),
		updated_at: Date.now()
	};
}
function rowToUpdate(row) {
	const { registry_kind: _registryKind, container_name: _containerName, ...update } = row;
	return update;
}
function readRegistryRows(kind, filter) {
	if (!fs.existsSync(resolveOpenClawStateSqlitePath(process.env))) return [];
	return withOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "sandbox_registry_entries")) return [];
		let query = getSandboxRegistryKysely(db).selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", kind);
		if (filter) query = query.where("session_key", "=", filter.scopeKey).where("backend_id", "=", filter.backendId);
		return executeSqliteQuerySync(db, filter ? query.orderBy("last_used_at_ms", "desc").orderBy("container_name", "asc") : query.orderBy("container_name", "asc")).rows;
	});
}
function readRegistryRow(kind, containerName) {
	if (!fs.existsSync(resolveOpenClawStateSqlitePath(process.env))) return null;
	return withOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "sandbox_registry_entries")) return null;
		return executeSqliteQuerySync(db, getSandboxRegistryKysely(db).selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", kind).where("container_name", "=", containerName).limit(1)).rows[0] ?? null;
	});
}
function insertRegistryRowIfMissing(row) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getSandboxRegistryKysely(db).insertInto("sandbox_registry_entries").values(row).onConflict((conflict) => conflict.columns(["registry_kind", "container_name"]).doNothing()));
	});
}
function insertRegistryRow(db, row) {
	executeSqliteQuerySync(db, getSandboxRegistryKysely(db).insertInto("sandbox_registry_entries").values(row).onConflict((conflict) => conflict.columns(["registry_kind", "container_name"]).doUpdateSet(rowToUpdate(row))));
}
function readRegistryRowFromDb(db, kind, containerName) {
	return executeSqliteQuerySync(db, getSandboxRegistryKysely(db).selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", kind).where("container_name", "=", containerName).limit(1)).rows[0] ?? null;
}
function removeRegistryRow(kind, containerName) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getSandboxRegistryKysely(db).deleteFrom("sandbox_registry_entries").where("registry_kind", "=", kind).where("container_name", "=", containerName));
	});
}
function normalizeSandboxRegistryEntry(entry) {
	return {
		...entry,
		backendId: entry.backendId?.trim() || "docker",
		runtimeLabel: entry.runtimeLabel?.trim() || entry.containerName,
		configLabelKind: entry.configLabelKind?.trim() || "Image"
	};
}
/** Reads all registered sandbox runtime containers from SQLite. */
async function readRegistry() {
	return { entries: readRegistryRows("container").map((row) => rowToContainerEntry(row)).filter((entry) => entry != null).map((entry) => normalizeSandboxRegistryEntry(entry)) };
}
/** Reads one registered sandbox runtime container by container name. */
async function readRegistryEntry(containerName) {
	const row = readRegistryRow("container", containerName);
	const entry = row ? rowToContainerEntry(row) : null;
	return entry ? normalizeSandboxRegistryEntry(entry) : null;
}
/** Reads registered runtime IDs for one backend-owned sandbox scope, newest first. */
async function readRegisteredSandboxRuntimeIds(params) {
	return readRegistryRows("container", params).map((row) => rowToContainerEntry(row)).filter((entry) => entry != null).map((entry) => entry.containerName);
}
/** Inserts one sandbox runtime registry entry without replacing an existing entry. */
function insertSandboxRegistryEntryIfMissing(entry) {
	insertRegistryRowIfMissing(containerEntryToRow(entry));
}
/** Creates or updates one sandbox runtime registry entry, preserving immutable creation fields. */
async function updateRegistry(entry) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const existingRow = readRegistryRowFromDb(db, "container", entry.containerName);
		insertRegistryRow(db, containerEntryToRow(entry, existingRow ? rowToContainerEntry(existingRow) : null));
	});
}
/** Removes one sandbox runtime registry entry by container name. */
async function removeRegistryEntry(containerName) {
	removeRegistryRow("container", containerName);
}
/** Reads all registered browser sandbox containers from SQLite. */
async function readBrowserRegistry() {
	return { entries: readRegistryRows("browser").map((row) => rowToBrowserEntry(row)).filter((entry) => entry != null) };
}
/** Inserts one browser sandbox registry entry without replacing an existing entry. */
function insertSandboxBrowserRegistryEntryIfMissing(entry) {
	insertRegistryRowIfMissing(browserEntryToRow(entry));
}
/** Creates or updates one browser sandbox registry entry, preserving immutable creation fields. */
async function updateBrowserRegistry(entry) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const existingRow = readRegistryRowFromDb(db, "browser", entry.containerName);
		insertRegistryRow(db, browserEntryToRow(entry, existingRow ? rowToBrowserEntry(existingRow) : null));
	});
}
/** Removes one browser sandbox registry entry by container name. */
async function removeBrowserRegistryEntry(containerName) {
	removeRegistryRow("browser", containerName);
}
//#endregion
//#region src/agents/sandbox/docker.ts
/**
* Low-level Docker command helpers for sandbox runtimes.
*
* Wraps Docker spawn, environment sanitization, container inspection, creation, and exec behavior.
*/
async function execDockerRaw(args, opts) {
	return await execContainerRaw(DOCKER_SANDBOX_ENGINE, args, opts);
}
const log = createSubsystemLogger("docker");
const HOT_CONTAINER_WINDOW_MS = 300 * 1e3;
const sandboxContainerLifecycleQueue = new KeyedAsyncQueue();
async function execDocker(args, opts) {
	const result = await execDockerRaw(args, opts);
	return {
		stdout: result.stdout.toString("utf8"),
		stderr: result.stderr.toString("utf8"),
		code: result.code
	};
}
async function readDockerContainerLabel(containerName, label) {
	return await readContainerLabel(DOCKER_SANDBOX_ENGINE, containerName, label);
}
async function readContainerLabel(engine, containerName, label) {
	const result = await execContainer(engine, [
		"inspect",
		"-f",
		`{{ index .Config.Labels "${label}" }}`,
		containerName
	], { allowFailure: true });
	if (result.code !== 0) return null;
	const raw = result.stdout.trim();
	if (!raw || raw === "<no value>") return null;
	return raw;
}
async function readDockerContainerEnvVar(containerName, envVar) {
	const result = await execDocker([
		"inspect",
		"-f",
		"{{range .Config.Env}}{{println .}}{{end}}",
		containerName
	], { allowFailure: true });
	if (result.code !== 0) return null;
	for (const line of result.stdout.split(/\r?\n/)) if (line.startsWith(`${envVar}=`)) return line.slice(envVar.length + 1);
	return null;
}
async function readDockerPort(containerName, port) {
	const result = await execDocker([
		"port",
		containerName,
		`${port}/tcp`
	], { allowFailure: true });
	if (result.code !== 0) return null;
	const match = (result.stdout.trim().split(/\r?\n/)[0] ?? "").match(/:(\d+)\s*$/);
	if (!match) return null;
	const mapped = Number.parseInt(match[1] ?? "", 10);
	return Number.isFinite(mapped) ? mapped : null;
}
const DOCKER_DAEMON_UNAVAILABLE_MARKERS = [
	"cannot connect to the docker daemon",
	"dial unix",
	"docker daemon is not running",
	"connection refused"
];
function isDockerDaemonUnavailable(stderr) {
	return DOCKER_DAEMON_UNAVAILABLE_MARKERS.some((marker) => stderr.toLowerCase().includes(marker));
}
function formatDockerDaemonUnavailableError(stderr) {
	const detail = stderr.trim();
	return [
		"Sandbox mode requires Docker, but the Docker daemon is not available.",
		"Start Docker, or set `agents.defaults.sandbox.mode=off` to disable sandboxing.",
		detail ? `Docker said: ${detail}` : void 0
	].filter((line) => Boolean(line)).join(" ");
}
async function inspectContainerImage(engine, image) {
	const result = await execContainer(engine, [
		"image",
		"inspect",
		image
	], { allowFailure: true });
	if (result.code === 0) return "exists";
	const stderr = result.stderr.trim();
	if (engine.id === "docker" ? stderr.toLowerCase().includes("no such image") : /no such image|image not known|image .* not found/iu.test(stderr)) return "missing";
	if (engine.id === "docker" && isDockerDaemonUnavailable(stderr)) throw new Error(formatDockerDaemonUnavailableError(stderr));
	if (engine.id === "docker") throw new Error(`Failed to inspect sandbox image: ${stderr}`);
	throw new Error(`Failed to inspect sandbox image with ${engine.displayName}: ${stderr}`);
}
async function ensureDockerImage(image) {
	await ensureContainerImage(DOCKER_SANDBOX_ENGINE, image);
}
async function ensureContainerImage(engine, image) {
	if (await inspectContainerImage(engine, image) === "exists") return;
	if (image === "openclaw-sandbox:bookworm-slim") {
		if (engine.id === "docker") throw new Error(`Sandbox image not found: ${image}. Build it with scripts/sandbox-setup.sh before enabling Docker sandboxing. The default image includes python3 for sandbox write/edit helpers; OpenClaw will not substitute plain debian:bookworm-slim.`);
		throw new Error(`Sandbox image not found in ${engine.displayName}: ${image}. Build it with podman build -t ${image} -f scripts/docker/sandbox/Dockerfile . before enabling container sandboxing. The default image includes python3 for sandbox write/edit helpers; OpenClaw will not substitute plain debian:bookworm-slim.`);
	}
	if (engine.id === "docker") throw new Error(`Sandbox image not found: ${image}. Build or pull it first.`);
	throw new Error(`Sandbox image not found in ${engine.displayName}: ${image}. Build or pull it first.`);
}
async function dockerContainerState(name) {
	return await containerState(DOCKER_SANDBOX_ENGINE, name);
}
async function containerState(engine, name) {
	const result = await execContainer(engine, [
		"inspect",
		"-f",
		"{{.State.Running}}",
		name
	], { allowFailure: true });
	if (result.code !== 0) return {
		exists: false,
		running: false
	};
	return {
		exists: true,
		running: result.stdout.trim() === "true"
	};
}
function isPodmanContainerNotFound(stderr) {
	return /no such container/iu.test(stderr) || /no container with name or id .* found/iu.test(stderr) || /container .* does not exist/iu.test(stderr);
}
async function recordedPodmanContainerState(engine, name) {
	const result = await execContainer(engine, [
		"inspect",
		"-f",
		"{{.State.Running}}",
		name
	], { allowFailure: true });
	if (result.code === 0) return {
		exists: true,
		running: result.stdout.trim() === "true"
	};
	if (isPodmanContainerNotFound(result.stderr)) return {
		exists: false,
		running: false
	};
	const detail = result.stderr.trim();
	throw Object.assign(/* @__PURE__ */ new Error(detail ? `Unable to inspect recorded Podman sandbox runtime ${name}: ${detail}` : `Unable to inspect recorded Podman sandbox runtime ${name} (exit ${result.code})`), { code: result.code });
}
function normalizeDockerLimit(value) {
	if (value === void 0 || value === null) return;
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : void 0;
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
function normalizeFiniteDockerNumber(value, min) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(min, value) : void 0;
}
function formatUlimitValue(name, value) {
	if (!name.trim()) return null;
	if (typeof value === "number") {
		const normalized = normalizeFiniteDockerNumber(value, 0);
		return normalized === void 0 ? null : `${name}=${normalized}`;
	}
	if (typeof value === "string") {
		const raw = value.trim();
		return raw ? `${name}=${raw}` : null;
	}
	const soft = normalizeFiniteDockerNumber(value.soft, 0);
	const hard = normalizeFiniteDockerNumber(value.hard, 0);
	if (soft === void 0 && hard === void 0) return null;
	if (soft === void 0) return `${name}=${hard}`;
	if (hard === void 0) return `${name}=${soft}`;
	return `${name}=${soft}:${hard}`;
}
function buildSandboxCreateArgs(params) {
	validateSandboxSecurity({
		...params.cfg,
		allowedSourceRoots: params.bindSourceRoots,
		allowSourcesOutsideAllowedRoots: params.allowSourcesOutsideAllowedRoots ?? params.cfg.dangerouslyAllowExternalBindSources === true,
		allowReservedContainerTargets: params.allowReservedContainerTargets ?? params.cfg.dangerouslyAllowReservedContainerTargets === true,
		dangerouslyAllowContainerNamespaceJoin: params.allowContainerNamespaceJoin ?? params.cfg.dangerouslyAllowContainerNamespaceJoin === true
	});
	const createdAtMs = params.createdAtMs ?? Date.now();
	const args = [
		"create",
		"--name",
		params.name
	];
	args.push("--init");
	args.push("--label", "openclaw.sandbox=1");
	args.push("--label", `openclaw.sessionKey=${params.scopeKey}`);
	args.push("--label", `openclaw.createdAtMs=${createdAtMs}`);
	args.push("--label", `openclaw.mountFormatVersion=3`);
	args.push("--label", `openclaw.createArgsEpoch=${SANDBOX_DOCKER_CREATE_ARGS_EPOCH}`);
	if (params.configHash) args.push("--label", `openclaw.configHash=${params.configHash}`);
	for (const [key, value] of Object.entries(params.labels ?? {})) if (key && value) args.push("--label", `${key}=${value}`);
	if (params.cfg.readOnlyRoot) args.push("--read-only");
	for (const entry of params.cfg.tmpfs) args.push("--tmpfs", entry);
	if (params.cfg.network) args.push("--network", params.cfg.network);
	if (params.cfg.user) args.push("--user", params.cfg.user);
	const envSanitization = sanitizeExplicitSandboxEnvVars(params.cfg.env ?? {});
	if (envSanitization.blocked.length > 0) log.warn(`Blocked invalid configured sandbox environment variables: ${envSanitization.blocked.join(", ")}`);
	if (envSanitization.warnings.length > 0) log.warn(`Suspicious configured sandbox environment variables: ${envSanitization.warnings.join(", ")}`);
	for (const [key, value] of Object.entries(markOpenClawExecEnv(envSanitization.allowed))) args.push("--env", `${key}=${value}`);
	for (const cap of params.cfg.capDrop) args.push("--cap-drop", cap);
	args.push("--security-opt", "no-new-privileges");
	if (params.cfg.seccompProfile) args.push("--security-opt", `seccomp=${params.cfg.seccompProfile}`);
	if (params.cfg.apparmorProfile) args.push("--security-opt", `apparmor=${params.cfg.apparmorProfile}`);
	for (const entry of params.cfg.dns ?? []) if (entry.trim()) args.push("--dns", entry);
	for (const entry of params.cfg.extraHosts ?? []) if (entry.trim()) args.push("--add-host", entry);
	const pidsLimit = normalizeFiniteDockerNumber(params.cfg.pidsLimit, 0);
	if (pidsLimit !== void 0 && pidsLimit > 0) args.push("--pids-limit", String(pidsLimit));
	const memory = normalizeDockerLimit(params.cfg.memory);
	if (memory) args.push("--memory", memory);
	const memorySwap = normalizeDockerLimit(params.cfg.memorySwap);
	if (memorySwap) args.push("--memory-swap", memorySwap);
	const cpus = normalizeFiniteDockerNumber(params.cfg.cpus, 0);
	if (cpus !== void 0 && cpus > 0) args.push("--cpus", String(cpus));
	const gpus = params.cfg.gpus?.trim();
	if (gpus) args.push("--gpus", gpus);
	for (const [name, value] of Object.entries(params.cfg.ulimits ?? {})) {
		const formatted = formatUlimitValue(name, value);
		if (formatted) args.push("--ulimit", formatted);
	}
	if (params.includeBinds !== false && params.cfg.binds?.length) for (const bind of params.cfg.binds) args.push("-v", bind);
	return args;
}
function appendCustomBinds(args, cfg) {
	if (!cfg.binds?.length) return;
	for (const bind of cfg.binds) args.push("-v", bind);
}
async function createSandboxContainer(params) {
	const { engine, name, cfg, workspaceDir, scopeKey } = params;
	const podmanPolicy = engine.id === "podman" && params.podmanRuntimeInfo ? resolvePodmanSandboxCreatePolicy({
		cfg,
		dockerTmpfsSource: params.dockerTmpfsSource,
		workspaceDir,
		workspaceAccess: params.workspaceAccess,
		agentWorkspaceDir: params.agentWorkspaceDir,
		readOnlyWorkspaceSkillMounts: params.readOnlyWorkspaceSkillMounts,
		runtimeInfo: params.podmanRuntimeInfo
	}) : void 0;
	const createCfg = podmanPolicy?.cfg ?? cfg;
	await ensureContainerImage(engine, cfg.image);
	const args = buildSandboxCreateArgs({
		name,
		cfg: createCfg,
		scopeKey,
		configHash: params.configHash,
		includeBinds: false,
		bindSourceRoots: [workspaceDir, params.agentWorkspaceDir]
	});
	if (podmanPolicy) args.push(...podmanPolicy.extraCreateArgs);
	args.push("--workdir", cfg.workdir);
	appendWorkspaceMountArgs({
		args,
		workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		workdir: cfg.workdir,
		workspaceAccess: params.workspaceAccess,
		readOnlyWorkspaceSkillMounts: params.readOnlyWorkspaceSkillMounts,
		includeReadOnlyWorkspaceSkillMounts: false
	});
	const protectedPaths = resolveProtectedSkillMountContainerPaths(params.readOnlyWorkspaceSkillMounts);
	let safeBinds = cfg.binds;
	if (protectedPaths.size > 0 && cfg.binds?.length) {
		safeBinds = filterBindsConflictingWithProtectedMounts(cfg.binds, protectedPaths);
		const skipped = cfg.binds.filter((b) => !safeBinds.includes(b));
		for (const bind of skipped) log.warn(`sandbox: skipping user bind "${bind}" — container path conflicts with a protected read-only skill mount`);
	}
	appendCustomBinds(args, safeBinds ? {
		...cfg,
		binds: safeBinds
	} : cfg);
	appendReadOnlyWorkspaceSkillMountArgs({
		args,
		readOnlyWorkspaceSkillMounts: params.readOnlyWorkspaceSkillMounts
	});
	args.push(cfg.image, "sleep", "infinity");
	await execContainer(engine, args);
	await execContainer(engine, ["start", name]);
	if (cfg.setupCommand?.trim()) await execContainer(engine, [
		"exec",
		"-i",
		name,
		"/bin/sh",
		"-lc",
		cfg.setupCommand
	]);
}
async function readContainerConfigHash(engine, containerName) {
	return await readContainerLabel(engine, containerName, "openclaw.configHash");
}
async function ensureSandboxContainer(params) {
	const engine = params.engine ?? DOCKER_SANDBOX_ENGINE;
	const slug = params.cfg.scope === "shared" ? "shared" : slugifySessionKey(params.scopeKey);
	const containerName = buildSandboxContainerName(engine.id === "podman" ? resolvePodmanSandboxContainerPrefix(params.cfg.docker.containerPrefix) : params.cfg.docker.containerPrefix, slug);
	return await sandboxContainerLifecycleQueue.enqueue(containerName, async () => {
		return await ensureSandboxContainerLifecycle(params, containerName);
	});
}
async function ensureSandboxContainerLifecycle(params, containerName) {
	const configuredEngine = params.engine ?? DOCKER_SANDBOX_ENGINE;
	const podmanRuntimeInfo = configuredEngine.id === "podman" ? await resolvePodmanSandboxRuntimeInfo() : void 0;
	if (podmanRuntimeInfo) assertPodmanSandboxTarget(params.podmanTarget, podmanRuntimeInfo.target);
	const engine = podmanRuntimeInfo ? bindPodmanSandboxEngine(podmanRuntimeInfo.target) : configuredEngine;
	let existingRegistryEntry = await readRegistryEntry(containerName);
	if (engine.id === "podman" && existingRegistryEntry) {
		if (!existingRegistryEntry.backendTarget) throw Object.assign(/* @__PURE__ */ new Error(`Podman sandbox runtime ${containerName} has no recorded engine target. Remove that unshipped runtime manually before recreating it.`), { code: "INVALID_CONFIG" });
		try {
			assertPodmanSandboxTarget(existingRegistryEntry.backendTarget, podmanRuntimeInfo.target);
		} catch (error) {
			if (existingRegistryEntry.backendTarget.globalArgs.length === 0) throw error;
			if ((await recordedPodmanContainerState(bindPodmanSandboxEngine(existingRegistryEntry.backendTarget), containerName)).exists) throw error;
			await removeRegistryEntry(containerName);
			existingRegistryEntry = null;
		}
	}
	const readOnlyWorkspaceSkillMounts = resolveReadOnlyWorkspaceSkillMounts({
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		workdir: params.cfg.docker.workdir,
		workspaceAccess: params.cfg.workspaceAccess
	});
	const genericConfigHash = computeSandboxConfigHash({
		docker: params.cfg.docker,
		dockerEnvPolicyEpoch: resolveDockerEnvPolicyEpoch(params.cfg.docker.env),
		workspaceAccess: params.cfg.workspaceAccess,
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		mountFormatVersion: 3,
		createArgsEpoch: SANDBOX_DOCKER_CREATE_ARGS_EPOCH,
		readOnlyWorkspaceSkillMounts: formatReadOnlyWorkspaceSkillMountHashState(readOnlyWorkspaceSkillMounts)
	});
	const expectedHash = engine.id === "podman" ? resolvePodmanSandboxConfigHash({
		genericConfigHash,
		configuredUser: Boolean(params.cfg.docker.user),
		dockerTmpfsSource: params.cfg.dockerTmpfsSource
	}) : genericConfigHash;
	const now = Date.now();
	const state = await containerState(engine, containerName);
	let hasContainer = state.exists;
	let running = state.running;
	let currentHash = null;
	let hashMismatch = false;
	const registryEntry = existingRegistryEntry ?? void 0;
	if (hasContainer) {
		currentHash = await readContainerConfigHash(engine, containerName);
		if (!currentHash) currentHash = registryEntry?.configHash ?? null;
		hashMismatch = !currentHash || currentHash !== expectedHash;
		if (hashMismatch) {
			const lastUsedAtMs = registryEntry?.lastUsedAtMs;
			if (running && (typeof lastUsedAtMs !== "number" || now - lastUsedAtMs < HOT_CONTAINER_WINDOW_MS)) handleHotSandboxConfigMismatch({
				containerName,
				scope: params.cfg.scope,
				sessionKey: params.scopeKey,
				...params.requireCurrentConfig !== void 0 ? { requireCurrentConfig: params.requireCurrentConfig } : {}
			});
			else {
				await execContainer(engine, [
					"rm",
					"-f",
					containerName
				], { allowFailure: true });
				hasContainer = false;
				running = false;
			}
		}
	}
	if (!hasContainer) await createSandboxContainer({
		engine,
		name: containerName,
		cfg: params.cfg.docker,
		dockerTmpfsSource: params.cfg.dockerTmpfsSource,
		workspaceDir: params.workspaceDir,
		workspaceAccess: params.cfg.workspaceAccess,
		agentWorkspaceDir: params.agentWorkspaceDir,
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		scopeKey: params.scopeKey,
		configHash: expectedHash,
		readOnlyWorkspaceSkillMounts,
		podmanRuntimeInfo
	});
	else if (!running) await execContainer(engine, ["start", containerName]);
	await updateRegistry({
		containerName,
		backendId: engine.id,
		...podmanRuntimeInfo ? { backendTarget: podmanRuntimeInfo.target } : {},
		runtimeLabel: containerName,
		sessionKey: params.scopeKey,
		createdAtMs: now,
		lastUsedAtMs: now,
		image: params.cfg.docker.image,
		configLabelKind: "Image",
		configHash: hashMismatch && running ? currentHash ?? void 0 : expectedHash
	});
	return containerName;
}
//#endregion
export { execContainerRaw as A, updateRegistry as C, DOCKER_SANDBOX_ENGINE as D, validateSandboxContainerEngineTarget as E, PODMAN_SANDBOX_ENGINE as O, updateBrowserRegistry as S, resolvePodmanSandboxRuntimeInfo as T, readBrowserRegistry as _, ensureDockerImage as a, removeBrowserRegistryEntry as b, execDockerRaw as c, readContainerLabel as d, readDockerContainerEnvVar as f, insertSandboxRegistryEntryIfMissing as g, insertSandboxBrowserRegistryEntryIfMissing as h, ensureContainerImage as i, execContainer as k, formatDockerDaemonUnavailableError as l, readDockerPort as m, containerState as n, ensureSandboxContainer as o, readDockerContainerLabel as p, dockerContainerState as r, execDocker as s, buildSandboxCreateArgs as t, isDockerDaemonUnavailable as u, readRegisteredSandboxRuntimeIds as v, bindPodmanSandboxEngine as w, removeRegistryEntry as x, readRegistry as y };
