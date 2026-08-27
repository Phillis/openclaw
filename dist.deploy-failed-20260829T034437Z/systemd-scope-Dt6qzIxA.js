import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { i as readRegularFileSync } from "./regular-file-Dwz6p59y.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { r as isMissingPathError } from "./errno-CkbDOfLk.js";
import { p as resolveGatewaySystemdServiceName } from "./constants-ChqKLfPp.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./errors-Ccx0R-_Z.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import "./regular-file-C2hsuc07.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-B_a4cpNH.js";
import { a as collectConfigServiceEnvVars } from "./config-env-vars-C_yEEhJa.js";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.js";
import { t as resolveDaemonHomeDir } from "./paths-CzCbqt0l.js";
import { t as execFileUtf8 } from "./exec-file-DdYGzzrr.js";
import { i as normalizeWindowsPathSeparators } from "./service-mutation-DyzHamq7.js";
import { n as parseSystemdEnvAssignments, r as parseSystemdExecStart } from "./systemd-unit-CHPTm-mW.js";
import * as fsSync from "node:fs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { parse as parse$1 } from "dotenv";
//#region src/config/state-dir-dotenv.ts
/** Maximum bytes to read from the state-directory .env file. */
const MAX_STATE_DIR_DOTENV_BYTES = 1024 * 1024;
const log = createSubsystemLogger("config/dotenv");
function isBlockedServiceEnvVar(key) {
	return key.toUpperCase() === "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" || isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key);
}
function unwrapMatchingLiteralQuotes(value) {
	if (value.length < 2) return value;
	const first = value[0];
	const last = value.at(-1);
	if ((first === `"` || first === `'`) && first === last) return value.slice(1, -1);
	return value;
}
/** Returns true when a dotenv value is only a shell reference, not an expanded secret. */
function isUnresolvedShellReference(value) {
	const candidate = unwrapMatchingLiteralQuotes(value.trim());
	return /^\$[A-Z_][A-Z0-9_]*$/.test(candidate) || /^\$\{[A-Z_][A-Z0-9_]*[^}]*\}$/.test(candidate) || /^\$\([^)]*\)$/.test(candidate);
}
function parseStateDirDotEnvContent(content) {
	const entries = {};
	const skippedShellReferenceKeys = [];
	for (const [rawKey, value] of Object.entries(parse$1(content))) {
		if (!value?.trim()) continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		if (isBlockedServiceEnvVar(key)) continue;
		if (isUnresolvedShellReference(value)) {
			skippedShellReferenceKeys.push(key);
			continue;
		}
		entries[key] = value;
	}
	return {
		entries,
		skippedShellReferenceKeys
	};
}
/**
* Read and parse the state-dir `.env`, returning both the persisted entries and
* the keys that were skipped because they held unresolved shell references. The
* skipped keys are surfaced so generated service env files can remove stale
* literal references for keys OpenClaw previously managed.
*/
function readStateDirDotEnvFromStateDir(stateDir) {
	const dotEnvPath = path.join(stateDir, ".env");
	try {
		const { buffer } = readRegularFileSync({
			filePath: fs.realpathSync(dotEnvPath),
			maxBytes: MAX_STATE_DIR_DOTENV_BYTES
		});
		return parseStateDirDotEnvContent(buffer);
	} catch (err) {
		if (err instanceof Error && err.message.startsWith("File exceeds")) log.warn(`skipping oversized state-directory .env file (max ${MAX_STATE_DIR_DOTENV_BYTES} bytes): ${dotEnvPath}`);
		return {
			entries: {},
			skippedShellReferenceKeys: []
		};
	}
}
/**
* Read and parse `~/.openclaw/.env` (or `$OPENCLAW_STATE_DIR/.env`), returning
* a filtered record of key-value pairs suitable for a managed service
* environment source.
*/
function readStateDirDotEnvVars(env) {
	return readStateDirDotEnvFromStateDir(resolveStateDir(env)).entries;
}
/** Collects durable service env vars from state-dir `.env` and config, preserving each source. */
function collectDurableServiceEnvVarSources(params) {
	const stateDirDotEnvEnvironment = readStateDirDotEnvVars(params.env);
	const configEnvironment = collectConfigServiceEnvVars(params.config);
	return {
		stateDirDotEnvEnvironment,
		configEnvironment,
		durableEnvironment: {
			...stateDirDotEnvEnvironment,
			...configEnvironment
		}
	};
}
/**
* Durable service env sources survive beyond the invoking shell and are safe to
* persist into owner-only gateway service environment sources.
*
* Precedence:
* 1. state-dir `.env` file vars
* 2. config service env vars
*/
function collectDurableServiceEnvVars(params) {
	return collectDurableServiceEnvVarSources(params).durableEnvironment;
}
//#endregion
//#region src/daemon/systemd-unavailable.ts
/** Classifies systemd/systemctl unavailable errors into user-facing categories. */
function normalizeDetail(detail) {
	return normalizeLowercaseStringOrEmpty(detail);
}
function isSystemctlMissingDetail(detail) {
	const normalized = normalizeDetail(detail);
	return normalized.includes("not found") || normalized.includes("no such file or directory") || normalized.includes("spawn systemctl enoent") || normalized.includes("spawn systemctl eacces") || normalized.includes("systemctl not available");
}
function isSystemdUserBusUnavailableDetail(detail) {
	const normalized = normalizeDetail(detail);
	return normalized.includes("failed to connect to bus") || normalized.includes("failed to connect to user scope bus") || normalized.includes("dbus_session_bus_address") || normalized.includes("xdg_runtime_dir") || normalized.includes("enomedium") || normalized.includes("no medium found");
}
function classifySystemdUnavailableDetail(detail) {
	const normalized = normalizeDetail(detail);
	if (!normalized) return null;
	if (isSystemctlMissingDetail(normalized)) return "missing_systemctl";
	if (isSystemdUserBusUnavailableDetail(normalized)) return "user_bus_unavailable";
	if (normalized.includes("systemctl --user unavailable") || normalized.includes("systemd user services are required") || normalized.includes("not been booted with systemd") || normalized.includes("not supported")) return "generic_unavailable";
	return null;
}
//#endregion
//#region src/daemon/systemd-exec.ts
/** systemctl execution, user-manager routing, and availability probes. */
async function execSystemdCommand(command, args, env, timeoutMs) {
	return await execFileUtf8(command, args, {
		env: env ? resolveSystemctlProcessEnv(env) : process.env,
		...timeoutMs && timeoutMs > 0 ? {
			timeout: timeoutMs,
			killSignal: "SIGKILL"
		} : {}
	});
}
async function execSystemctl(args, env, timeoutMs) {
	return await execSystemdCommand("systemctl", args, env, timeoutMs);
}
function readSystemctlDetail(result) {
	return `${result.stderr} ${result.stdout}`.trim();
}
function isSystemctlMissing(result) {
	return result.errorCode === "ENOENT" || result.errorCode === "EACCES" || result.termination === "exit" && isSystemctlMissingDetail(readSystemctlDetail(result));
}
function isSystemdUnitNotEnabled(detail) {
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("disabled") || normalized.includes("static") || normalized.includes("indirect") || normalized.includes("masked") || normalized.includes("not-found") || normalized.includes("could not be found") || normalized.includes("failed to get unit file state");
}
function isSystemdUnitMissingDetail(detail) {
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.includes("unit file") && normalized.includes("does not exist") || normalized.includes("not-found") || normalized.includes("could not be found");
}
function isSystemdUnitAlreadyMissingOrInactive(detail, unitName) {
	const escapedUnitName = escapeRegExp(normalizeLowercaseStringOrEmpty(unitName));
	return new RegExp(`^(?:failed to (?:disable unit|stop\\s+${escapedUnitName}):\\s*)?(?:unit file\\s+${escapedUnitName}\\s+does not exist|unit\\s+${escapedUnitName}(?:\\s+is)?\\s+(?:inactive|not\\s+active|not\\s+loaded|not-found|could not be found))[.!]?$`, "u").test(normalizeLowercaseStringOrEmpty(detail));
}
const isSystemctlBusUnavailable = isSystemdUserBusUnavailableDetail;
function isSystemdUserScopeUnavailable(detail) {
	return classifySystemdUnavailableDetail(detail) !== null;
}
function isGenericSystemctlIsEnabledFailure(detail) {
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return normalized.startsWith("command failed: systemctl") && normalized.includes(" is-enabled ") && !normalized.includes("permission denied") && !normalized.includes("access denied") && !normalized.includes("no space left") && !normalized.includes("read-only file system") && !normalized.includes("out of memory") && !normalized.includes("cannot allocate memory");
}
function isNonFatalSystemdInstallProbeError(error) {
	const detail = error instanceof Error ? error.message : typeof error === "string" ? error : "";
	if (!detail) return false;
	const normalized = normalizeLowercaseStringOrEmpty(detail);
	return isSystemctlBusUnavailable(normalized) || isGenericSystemctlIsEnabledFailure(normalized);
}
function readSystemctlEnvUser(env) {
	return env.USER?.trim() || env.LOGNAME?.trim() || null;
}
function readSystemctlEffectiveUser() {
	try {
		return os.userInfo().username;
	} catch {
		return null;
	}
}
function readSystemctlEffectiveUid() {
	if (typeof process.geteuid !== "function") return null;
	try {
		return process.geteuid();
	} catch {
		return null;
	}
}
function resolveSystemctlProcessEnv(env) {
	const processEnv = {
		...process.env,
		...env
	};
	if (processEnv.XDG_RUNTIME_DIR?.trim() && processEnv.DBUS_SESSION_BUS_ADDRESS?.trim()) return processEnv;
	const uid = readSystemctlEffectiveUid();
	if (uid === null || uid === 0) return processEnv;
	const runtimeDir = processEnv.XDG_RUNTIME_DIR?.trim() || `/run/user/${uid}`;
	const busPath = path.posix.join(runtimeDir, "bus");
	if (!fsSync.existsSync(busPath)) return processEnv;
	return {
		...processEnv,
		XDG_RUNTIME_DIR: runtimeDir,
		DBUS_SESSION_BUS_ADDRESS: processEnv.DBUS_SESSION_BUS_ADDRESS?.trim() || `unix:path=${busPath}`
	};
}
function isNonRootUser(user) {
	return Boolean(user && user !== "root");
}
function hasRootUserManagerEnvironment(env) {
	const home = env.HOME?.trim();
	const runtimeDir = env.XDG_RUNTIME_DIR?.trim();
	const dbusAddress = env.DBUS_SESSION_BUS_ADDRESS?.trim();
	return home === "/root" && runtimeDir === "/run/user/0" && Boolean(dbusAddress?.includes("/run/user/0/bus"));
}
function resolveSystemctlUserScope(env) {
	const sudoUser = env.SUDO_USER?.trim() || null;
	const envUser = readSystemctlEnvUser(env);
	const effectiveUid = readSystemctlEffectiveUid();
	const effectiveUser = readSystemctlEffectiveUser();
	const isEffectiveRoot = effectiveUid === null ? effectiveUser === "root" : effectiveUid === 0;
	const hasRootUserManager = isEffectiveRoot && hasRootUserManagerEnvironment(env);
	const isSudoToRoot = isEffectiveRoot && !hasRootUserManager && isNonRootUser(sudoUser);
	return {
		machineUser: hasRootUserManager ? null : isSudoToRoot ? sudoUser : isNonRootUser(envUser) ? envUser : isNonRootUser(sudoUser) ? sudoUser : effectiveUser || envUser || sudoUser || null,
		preferMachineScope: isSudoToRoot
	};
}
/**
* Resolves the account whose user manager owns the service operation.
* Keep linger diagnostics on this identity so sudo never checks root while
* systemctl targets the invoking user's manager.
*/
function resolveSystemdUserServiceAccount(env) {
	const { machineUser } = resolveSystemctlUserScope(env);
	return machineUser ?? readSystemctlEffectiveUser() ?? readSystemctlEnvUser(env);
}
function resolveSystemctlMachineUserScopeArgs(user) {
	const trimmedUser = user.trim();
	if (!trimmedUser) return [];
	return [
		"--machine",
		`${trimmedUser}@`,
		"--user"
	];
}
function shouldFallbackToMachineUserScope(detail) {
	if (!isSystemdUserBusUnavailableDetail(detail)) return false;
	return !detail.toLowerCase().includes("permission denied");
}
async function execSystemdUserCommand(command, env, args, timeoutMs) {
	const { machineUser, preferMachineScope } = resolveSystemctlUserScope(env);
	const run = (scopeArgs) => execSystemdCommand(command, [...scopeArgs, ...args], env, timeoutMs);
	if (preferMachineScope && machineUser) {
		const machineScopeArgs = resolveSystemctlMachineUserScopeArgs(machineUser);
		if (machineScopeArgs.length > 0) return await run(machineScopeArgs);
	}
	const directResult = await run(["--user"]);
	if (directResult.code === 0) return directResult;
	const detail = readSystemctlDetail(directResult);
	if (directResult.termination !== "exit" || !machineUser || !shouldFallbackToMachineUserScope(detail)) return directResult;
	const machineScopeArgs = resolveSystemctlMachineUserScopeArgs(machineUser);
	if (machineScopeArgs.length === 0) return directResult;
	return await run(machineScopeArgs);
}
async function execSystemctlUser(env, args, timeoutMs) {
	return await execSystemdUserCommand("systemctl", env, args, timeoutMs);
}
async function execBusctlUser(env, args, timeoutMs) {
	return await execSystemdUserCommand("busctl", env, args, timeoutMs);
}
async function disableSystemdUserUnitForRemoval(env, unitName) {
	const result = await execSystemctlUser(env, [
		"disable",
		"--now",
		unitName
	]);
	if (result.code === 0) return;
	const detail = readSystemctlDetail(result);
	if (result.termination === "exit" && isSystemdUnitAlreadyMissingOrInactive(detail, unitName)) return;
	throw new Error(`systemctl disable failed: ${detail || "unknown error"}`);
}
async function reloadSystemdUserManager(env) {
	const result = await execSystemctlUser(env, ["daemon-reload"]);
	if (result.code !== 0) throw new Error(`systemctl daemon-reload failed: ${readSystemctlDetail(result) || "unknown error"}`);
}
async function isSystemdUserServiceAvailable(env = process.env) {
	const res = await execSystemctlUser(env, ["status"]);
	const detail = readSystemctlDetail(res);
	return res.termination === "exit" && (res.code === 0 || Boolean(detail) && !isSystemdUserScopeUnavailable(detail));
}
async function isSystemdUnitActive(env, unitName, scope = "user") {
	const normalizedUnit = unitName.trim();
	if (!normalizedUnit) return ok(false);
	const args = [
		"is-active",
		"--quiet",
		normalizedUnit
	];
	const res = scope === "system" ? await execSystemctl(args) : await execSystemctlUser(env, args);
	if (res.termination === "exit" && [
		0,
		3,
		4
	].includes(res.code)) return ok(res.code === 0);
	return err(readSystemctlDetail(res) || `systemctl is-active exited with code ${res.code}`);
}
async function assertSystemdAvailable(env = process.env, timeoutMs) {
	const res = await execSystemctlUser(env, ["status"], timeoutMs);
	if (res.code === 0) return;
	const detail = readSystemctlDetail(res);
	if (isSystemctlMissing(res)) throw new Error("systemctl not available; systemd user services are required on Linux.");
	if (res.termination === "exit" && detail && !isSystemdUserScopeUnavailable(detail)) return;
	throw new Error(`systemctl --user unavailable: ${detail || "unknown error"}`.trim());
}
async function isSystemctlAvailable(env) {
	const res = await execSystemctlUser(env, ["status"]);
	return res.code === 0 || !isSystemctlMissing(res);
}
//#endregion
//#region src/daemon/systemd-service-files.ts
/** Linux systemd unit paths and environment-file parsing. */
const SYSTEMD_GATEWAY_DOTENV_FILENAME = "gateway.systemd.env";
const SYSTEMD_NODE_DOTENV_FILENAME = "node.systemd.env";
const SYSTEMD_MANAGER_QUERY_TIMEOUT_MS = 5e3;
function resolveSystemdUnitPathForName(env, name) {
	const home = normalizeWindowsPathSeparators(resolveDaemonHomeDir(env));
	return path.posix.join(home, ".config", "systemd", "user", `${name}.service`);
}
function resolveSystemdServiceName(env) {
	const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
	if (override) return override.endsWith(".service") ? override.slice(0, -8) : override;
	return resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE);
}
function resolveSystemdUnitPath(env) {
	return resolveSystemdUnitPathForName(env, resolveSystemdServiceName(env));
}
function resolveSystemdUserUnitPath(env) {
	return resolveSystemdUnitPath(env);
}
const UNKNOWN_SYSTEMD_OVERRIDES = {
	launcher: "command",
	environment: true
};
async function buildSystemdCommandSnapshot(params) {
	const fileEnvironment = await resolveSystemdEnvironmentFiles(params);
	const environment = {
		...params.inlineEnvironment,
		...fileEnvironment
	};
	const environmentValueSources = Object.fromEntries(Object.keys(params.inlineEnvironment).map((key) => [key, "inline"]));
	for (const key of Object.keys(fileEnvironment)) environmentValueSources[key] = Object.hasOwn(params.inlineEnvironment, key) ? "inline-and-file" : "file";
	for (const assignment of params.unsetEnvironment) {
		const separator = assignment.indexOf("=");
		const key = separator < 0 ? assignment : assignment.slice(0, separator);
		if (separator < 0 || environment[key] === assignment.slice(separator + 1)) {
			delete environment[key];
			delete environmentValueSources[key];
		}
	}
	return {
		programArguments: params.programArguments,
		...params.workingDirectory ? { workingDirectory: params.workingDirectory } : {},
		...Object.keys(environment).length > 0 ? {
			environment,
			environmentValueSources
		} : {}
	};
}
async function readSystemdManagerCommand(env, sourcePath, managedDefinition, managedUnsetEnvironment, opts) {
	const manager = "org.freedesktop.systemd1";
	const timeoutMs = opts?.timeoutMs && opts.timeoutMs > 0 ? opts.timeoutMs : SYSTEMD_MANAGER_QUERY_TIMEOUT_MS;
	const deadlineAt = Date.now() + timeoutMs;
	let remainingCalls = 3;
	const query = async (args, signatures) => {
		const result = await execBusctlUser(env, ["--json=short", ...args], Math.max(1, Math.floor((deadlineAt - Date.now()) / remainingCalls--)));
		if (result.code !== 0) return null;
		const properties = result.stdout.trim().split(/\r?\n/).map((line) => asOptionalRecord(JSON.parse(line)));
		return properties.length === signatures.length && properties.every((property, index) => property?.type === signatures[index]) ? properties.map((property) => property?.data) : null;
	};
	const loadedUnit = (await query([
		"call",
		manager,
		"/org/freedesktop/systemd1",
		`${manager}.Manager`,
		"LoadUnit",
		"s",
		`${resolveSystemdServiceName(env)}.service`
	], ["o"]))?.[0];
	const unitPath = Array.isArray(loadedUnit) && loadedUnit.length === 1 ? loadedUnit[0] : null;
	if (typeof unitPath !== "string" || !unitPath) return null;
	const properties = await query([
		"get-property",
		manager,
		unitPath,
		`${manager}.Service`,
		"ExecStart",
		"WorkingDirectory",
		"Environment",
		"EnvironmentFiles",
		"UnsetEnvironment"
	], [
		"a(sasbttttuii)",
		"s",
		"as",
		"a(sb)",
		"as"
	]);
	if (!properties) return null;
	const [executions, workingDirectory, assignments, environmentFileSpecs, unsetEnvironment] = properties;
	const execution = Array.isArray(executions) && executions.length === 1 ? executions[0] : null;
	const programArguments = Array.isArray(execution) ? execution[1] : null;
	const isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
	if (!Array.isArray(execution) || execution.length !== 10 || typeof execution[0] !== "string" || execution[0].length === 0 || typeof execution[2] !== "boolean" || !execution.slice(3).every(Number.isInteger) || !isStringArray(programArguments) || programArguments.length === 0 || typeof workingDirectory !== "string" || !isStringArray(assignments) || !Array.isArray(environmentFileSpecs) || !environmentFileSpecs.every((spec) => Array.isArray(spec) && spec.length === 2 && typeof spec[0] === "string" && spec[0].length > 0 && typeof spec[1] === "boolean") || !isStringArray(unsetEnvironment) || unsetEnvironment.some((assignment) => !assignment || assignment.startsWith("="))) return null;
	const inlineEnvironment = {};
	for (const assignment of assignments) {
		const separator = assignment.indexOf("=");
		if (separator <= 0) return null;
		inlineEnvironment[assignment.slice(0, separator)] = assignment.slice(separator + 1);
	}
	const unitProperties = await query([
		"get-property",
		manager,
		unitPath,
		`${manager}.Unit`,
		"FragmentPath",
		"DropInPaths",
		"NeedDaemonReload"
	], [
		"s",
		"as",
		"b"
	]);
	const [fragmentPath, dropInPaths, reloadPending] = unitProperties ?? [];
	if (!unitProperties || typeof fragmentPath !== "string" || !isStringArray(dropInPaths) || dropInPaths.some((pathname) => !pathname) || typeof reloadPending !== "boolean") return null;
	const managedOverrides = !reloadPending && path.posix.normalize(normalizeWindowsPathSeparators(fragmentPath)) === path.posix.normalize(normalizeWindowsPathSeparators(sourcePath)) ? await readSystemdDropInOverrides(dropInPaths, managedUnsetEnvironment, env, sourcePath).catch(() => UNKNOWN_SYSTEMD_OVERRIDES) : UNKNOWN_SYSTEMD_OVERRIDES;
	return {
		...await buildSystemdCommandSnapshot({
			programArguments,
			workingDirectory: workingDirectory.replace(/^!/, ""),
			inlineEnvironment,
			environmentFileSpecs,
			unsetEnvironment,
			env,
			unitPath: sourcePath
		}),
		...managedOverrides ? {
			managedDefinition,
			managedOverrides
		} : {},
		...reloadPending ? { reloadPending: true } : {}
	};
}
async function readSystemdDropInOverrides(dropInPaths, managedUnsetEnvironment, env, unitPath) {
	const inlineEnvironmentKeys = /* @__PURE__ */ new Set();
	const fileEnvironmentKeys = /* @__PURE__ */ new Set();
	const unsetEnvironmentKeys = /* @__PURE__ */ new Set();
	const overrides = {};
	let resetInline = false;
	let resetFiles = false;
	for (const pathname of dropInPaths) {
		const content = await fs$1.readFile(pathname, "utf8");
		let inService = false;
		for (const rawLine of content.replace(/\\\r?\n\s*/g, " ").split(/\r?\n/)) {
			const line = rawLine.trim();
			if (!line || line.startsWith("#") || line.startsWith(";")) continue;
			if (line.startsWith("[")) {
				if (!line.endsWith("]")) throw new Error("Invalid systemd drop-in section");
				inService = line === "[Service]";
				continue;
			}
			if (!inService) continue;
			const separator = line.indexOf("=");
			if (separator < 0) throw new Error("Invalid systemd drop-in directive");
			const directive = line.slice(0, separator).trim();
			if (directive === "ExecStart" || directive === "WorkingDirectory") overrides.launcher = directive === "ExecStart" ? "command" : overrides.launcher ?? "working-directory";
			else if ([
				"Environment",
				"EnvironmentFile",
				"UnsetEnvironment"
			].includes(directive)) {
				const value = line.slice(separator + 1).trim();
				if (!value) if (directive === "Environment") {
					inlineEnvironmentKeys.clear();
					resetInline = true;
				} else if (directive === "EnvironmentFile") {
					fileEnvironmentKeys.clear();
					resetFiles = true;
				} else {
					unsetEnvironmentKeys.clear();
					for (const assignment of managedUnsetEnvironment) unsetEnvironmentKeys.add(assignment.split("=", 1)[0] ?? assignment);
				}
				else if (directive === "Environment") {
					const assignments = parseSystemdEnvAssignments(value);
					if (assignments.length !== splitSystemdEnvironmentWords(value).length) throw new Error("Invalid systemd drop-in environment");
					for (const { key } of assignments) inlineEnvironmentKeys.add(key);
				} else if (directive === "UnsetEnvironment") for (const assignment of splitSystemdEnvironmentWords(value)) {
					const key = assignment.split("=", 1)[0];
					if (!key) throw new Error("Invalid systemd drop-in environment removal");
					unsetEnvironmentKeys.add(key);
				}
				else if (parseEnvironmentFileSpecs(value).some((filename) => filename.replace(/%%|%h/gu, "").includes("%"))) overrides.environment = true;
				else try {
					const fileEnvironment = await resolveSystemdEnvironmentFiles({
						environmentFileSpecs: [value],
						env,
						unitPath,
						failOnUnavailable: true
					});
					for (const key of Object.keys(fileEnvironment)) fileEnvironmentKeys.add(key);
				} catch {
					overrides.environment = true;
				}
			}
		}
	}
	if (overrides.environment !== true) {
		const ownedKeys = [.../* @__PURE__ */ new Set([
			...inlineEnvironmentKeys,
			...fileEnvironmentKeys,
			...unsetEnvironmentKeys
		])];
		if (ownedKeys.length > 0 || resetInline || resetFiles) overrides.environment = {
			...ownedKeys.length > 0 ? { keys: ownedKeys } : {},
			...resetInline ? { resetInline: true } : {},
			...resetFiles ? { resetFiles: true } : {}
		};
	}
	return Object.keys(overrides).length ? overrides : void 0;
}
function splitSystemdEnvironmentWords(value) {
	return splitArgsPreservingQuotes(value, {
		escapeMode: "backslash",
		quoteChars: ["\"", "'"],
		quoteStart: "item-start"
	});
}
async function readSystemdServiceExecStart(env, opts) {
	const unitPath = resolveSystemdUnitPath(env);
	try {
		const content = await fs$1.readFile(unitPath, "utf8");
		let execStart = "";
		let workingDirectory = "";
		let inlineEnvironment = {};
		const environmentFileSpecs = [];
		const unsetEnvironment = [];
		for (const rawLine of content.split("\n")) {
			const line = rawLine.trim();
			if (!line || line.startsWith("#")) continue;
			if (line.startsWith("ExecStart=")) execStart = line.slice(10).trim();
			else if (line.startsWith("WorkingDirectory=")) workingDirectory = expandSystemdSpecifier((parseSystemdExecStart(line.slice(17))[0] ?? "").replace(/^-/, ""), env);
			else if (line.startsWith("Environment=")) {
				const raw = line.slice(12).trim();
				if (!raw) inlineEnvironment = {};
				for (const parsed of parseSystemdEnvAssignments(raw)) inlineEnvironment[parsed.key] = expandSystemdSpecifier(parsed.value, env);
			} else if (line.startsWith("EnvironmentFile=")) {
				const raw = line.slice(16).trim();
				if (raw) environmentFileSpecs.push(raw);
				else environmentFileSpecs.length = 0;
			} else if (line.startsWith("UnsetEnvironment=")) {
				const raw = line.slice(17).trim();
				if (!raw) unsetEnvironment.length = 0;
				else unsetEnvironment.push(...splitSystemdEnvironmentWords(raw));
			}
		}
		const managedDefinition = await buildSystemdCommandSnapshot({
			programArguments: execStart ? parseSystemdExecStart(execStart).map((argument) => expandSystemdSpecifier(argument, env)) : [],
			workingDirectory,
			inlineEnvironment,
			environmentFileSpecs,
			unsetEnvironment,
			env,
			unitPath
		});
		const manager = await readSystemdManagerCommand(env, unitPath, managedDefinition, unsetEnvironment, opts).catch(() => null);
		if (!manager && managedDefinition.programArguments.length === 0) return null;
		return {
			...manager ?? {
				...managedDefinition,
				managedDefinition,
				managedOverrides: UNKNOWN_SYSTEMD_OVERRIDES
			},
			sourcePath: unitPath
		};
	} catch {
		return null;
	}
}
function resolveSystemdEnvironmentFilePath(params) {
	const filename = params.environment?.OPENCLAW_SERVICE_KIND?.trim() === "node" ? SYSTEMD_NODE_DOTENV_FILENAME : SYSTEMD_GATEWAY_DOTENV_FILENAME;
	return path.join(params.stateDir, filename);
}
function resolveLegacyNodeSystemdEnvironmentFilePath(params) {
	if (params.environment?.OPENCLAW_SERVICE_KIND?.trim() !== "node") return null;
	const legacyPath = path.join(params.stateDir, SYSTEMD_GATEWAY_DOTENV_FILENAME);
	return legacyPath === resolveSystemdEnvironmentFilePath(params) ? null : legacyPath;
}
function isNodeSystemdEnvironment(env) {
	return env.OPENCLAW_SERVICE_KIND?.trim() === "node";
}
function expandSystemdSpecifier(input, env) {
	return input.replace(/%%|%h/gu, (specifier) => specifier === "%%" ? "%" : normalizeWindowsPathSeparators(resolveDaemonHomeDir(env)));
}
function parseEnvironmentFileSpecs(raw) {
	return normalizeStringEntries(splitArgsPreservingQuotes(raw, { escapeMode: "backslash" }));
}
function decodeSystemdEnvironmentFileValue(rawValue) {
	let state = "pre";
	let decoded = "";
	let literalDollar = false;
	let trailingWhitespaceStart;
	for (const char of rawValue) {
		const whitespace = char === " " || char === "	" || char === "\r";
		if (state === "pre") {
			if (whitespace) continue;
			if (char === "'") {
				state = "single-quoted";
				continue;
			}
			if (char === "\"") {
				state = "double-quoted";
				continue;
			}
			if (char === "\\") {
				state = "unquoted-escape";
				continue;
			}
			state = "unquoted";
			decoded += char;
			continue;
		}
		if (state === "unquoted") {
			if (char === "\\") {
				state = "unquoted-escape";
				trailingWhitespaceStart = void 0;
				continue;
			}
			if (whitespace) trailingWhitespaceStart ??= decoded.length;
			else trailingWhitespaceStart = void 0;
			decoded += char;
			continue;
		}
		if (state === "unquoted-escape") {
			state = "unquoted";
			literalDollar ||= char === "$";
			decoded += char;
			continue;
		}
		if (state === "single-quoted") {
			if (char === "'") state = "pre";
			else {
				literalDollar ||= char === "$";
				decoded += char;
			}
			continue;
		}
		if (state === "double-quoted") {
			if (char === "\"") state = "pre";
			else if (char === "\\") state = "double-quoted-escape";
			else {
				literalDollar ||= char === "$";
				decoded += char;
			}
			continue;
		}
		state = "double-quoted";
		if ([
			"\"",
			"\\",
			"`",
			"$"
		].includes(char)) {
			literalDollar ||= char === "$";
			decoded += char;
		} else decoded += `\\${char}`;
	}
	if (state === "unquoted" && trailingWhitespaceStart !== void 0) decoded = decoded.slice(0, trailingWhitespaceStart);
	return {
		value: decoded,
		literalDollar
	};
}
function parseEnvironmentFileLine(rawLine) {
	const trimmedStart = rawLine.trimStart();
	if (!trimmedStart || trimmedStart.startsWith("#") || trimmedStart.startsWith(";")) return null;
	const eq = trimmedStart.indexOf("=");
	if (eq <= 0) return null;
	const key = trimmedStart.slice(0, eq).trim();
	if (!key) return null;
	const decoded = decodeSystemdEnvironmentFileValue(trimmedStart.slice(eq + 1));
	return {
		key,
		value: decoded.value,
		literalShellReference: decoded.literalDollar && isUnresolvedShellReference(decoded.value)
	};
}
function serializeSystemdEnvironmentFileValue(value) {
	if (!/[\s\\'"`$]/u.test(value)) return value;
	return `"${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"").replaceAll("`", "\\`").replaceAll("$", "\\$")}"`;
}
function serializeSystemdEnvironmentFile(environment) {
	return Object.entries(environment).map(([key, value]) => `${key}=${serializeSystemdEnvironmentFileValue(value)}`).join("\n");
}
async function readSystemdEnvironmentFile(pathname) {
	const environment = {};
	const literalShellReferenceKeys = /* @__PURE__ */ new Set();
	const content = await fs$1.readFile(pathname, "utf8");
	for (const rawLine of content.split(/\r?\n/)) {
		const parsed = parseEnvironmentFileLine(rawLine);
		if (!parsed) continue;
		environment[parsed.key] = parsed.value;
		if (parsed.literalShellReference) literalShellReferenceKeys.add(parsed.key);
		else literalShellReferenceKeys.delete(parsed.key);
	}
	return {
		environment,
		literalShellReferenceKeys
	};
}
async function resolveSystemdEnvironmentFiles(params) {
	const resolved = {};
	const unitDir = path.posix.dirname(params.unitPath);
	const failIfUnavailable = (error, optional) => {
		if (params.failOnUnavailable && !optional) throw error;
	};
	for (const specRaw of params.environmentFileSpecs) {
		const managerExpandedPath = typeof specRaw !== "string";
		const tokens = managerExpandedPath ? [specRaw[0]] : parseEnvironmentFileSpecs(specRaw);
		for (const token of tokens) {
			const optional = token.startsWith("-");
			const pathnameRaw = optional ? token.slice(1).trim() : token;
			if (!pathnameRaw) continue;
			const expanded = managerExpandedPath ? pathnameRaw : expandSystemdSpecifier(pathnameRaw, params.env);
			const pathname = path.posix.isAbsolute(expanded) ? expanded : path.posix.resolve(unitDir, expanded);
			const pathnames = [pathname];
			if (/[*?[]/u.test(pathname)) {
				pathnames.length = 0;
				try {
					for await (const match of fs$1.glob(pathname)) pathnames.push(match);
				} catch (error) {
					failIfUnavailable(error, optional);
					continue;
				}
				pathnames.sort();
				if (params.failOnUnavailable && !optional && pathnames.length === 0) throw new Error("Missing systemd environment file");
			}
			for (const filePath of pathnames) try {
				Object.assign(resolved, (await readSystemdEnvironmentFile(filePath)).environment);
			} catch (error) {
				failIfUnavailable(error, optional);
				continue;
			}
		}
	}
	return resolved;
}
//#endregion
//#region src/daemon/systemd-system.ts
/** Detects system-scope systemd ownership before mutating a user gateway unit. */
function formatUnknownError(error) {
	return truncateUtf16Safe(sanitizeForLog(error instanceof Error ? error.message : String(error)), 500);
}
function quotePosixArgument(value) {
	return /^[A-Za-z0-9_@%+=:,./-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`;
}
async function querySystemManager(unitName) {
	const result = await execFileUtf8("systemctl", [
		"show",
		"--property=LoadState",
		"--value",
		unitName
	]);
	const loadState = result.stdout.trim().toLowerCase();
	if (result.code === 0) {
		if (loadState === "not-found") return {
			status: "absent",
			unitName
		};
		if (loadState) return {
			status: "loaded",
			unitName
		};
		return {
			status: "unverifiable",
			unitName,
			operation: "systemctl",
			detail: "systemctl returned no LoadState"
		};
	}
	const detail = `${result.stderr} ${result.stdout}`.trim();
	const normalizedDetail = detail.toLowerCase();
	if (result.termination === "exit" && normalizedDetail.includes(unitName.toLowerCase()) && /not[- ]found|could not be found/i.test(normalizedDetail)) return {
		status: "absent",
		unitName
	};
	return {
		status: "unverifiable",
		unitName,
		operation: "systemctl",
		detail: detail || `systemctl exited with code ${result.code}`
	};
}
async function readSystemUnitLoadPaths(unitName) {
	const result = await execFileUtf8("systemctl", [
		"show",
		"--property=UnitPath",
		"--value"
	]);
	if (result.code !== 0) return {
		status: "unverifiable",
		unitName,
		operation: "systemctl",
		detail: `${result.stderr} ${result.stdout}`.trim() || `systemctl exited with code ${result.code}`
	};
	const paths = [...new Set(result.stdout.split(/\s+/).map((entry) => entry.trim()).filter((entry) => path.posix.isAbsolute(entry)))];
	if (paths.length === 0) return {
		status: "unverifiable",
		unitName,
		operation: "systemctl",
		detail: "systemctl returned no system manager unit load paths"
	};
	return paths;
}
async function findInstalledSystemUnit(unitName) {
	const loadPaths = await readSystemUnitLoadPaths(unitName);
	if (!Array.isArray(loadPaths)) return loadPaths;
	for (const dir of loadPaths) {
		const unitPath = path.posix.join(dir, unitName);
		try {
			await fs$1.lstat(unitPath);
			return {
				status: "installed",
				unitName,
				unitPath
			};
		} catch (error) {
			if (isMissingPathError(error)) continue;
			return {
				status: "unverifiable",
				unitName,
				operation: "filesystem",
				detail: `${unitPath}: ${formatUnknownError(error)}`
			};
		}
	}
	return {
		status: "absent",
		unitName
	};
}
async function inspectSystemSystemdOwnership(unitName) {
	if (process.platform !== "linux") return {
		status: "absent",
		unitName
	};
	const initialQuery = await querySystemManager(unitName);
	if (initialQuery.status !== "absent") return initialQuery;
	const installed = await findInstalledSystemUnit(unitName);
	if (installed.status !== "absent") return installed;
	return await querySystemManager(unitName);
}
function isRunningAsRoot() {
	if (typeof process.geteuid !== "function") return false;
	try {
		return process.geteuid() === 0;
	} catch {
		return false;
	}
}
function formatSystemSystemdOwnershipError(ownership) {
	const privilegePrefix = isRunningAsRoot() ? "" : "sudo ";
	const unitName = quotePosixArgument(ownership.unitName);
	const summary = ownership.status === "loaded" ? `System systemd unit ${ownership.unitName} already owns this gateway unit name.` : ownership.status === "installed" ? `System systemd unit ${ownership.unitPath} already owns this gateway unit name.` : `System systemd ownership for ${ownership.unitName} could not be verified: ${ownership.detail}`;
	const installedInAdministratorPath = ownership.status === "installed" && (ownership.unitPath.startsWith("/etc/systemd/system/") || ownership.unitPath.startsWith("/etc/systemd/system.control/"));
	return [
		summary,
		"Refusing to create or activate a user systemd unit with the same name because duplicate managers can restart-loop the gateway.",
		"OpenClaw does not manage system-scope units, and --force does not override system ownership.",
		ownership.status === "loaded" ? `Keep it as the sole gateway manager, or inspect it with \`${privilegePrefix}systemctl cat ${unitName}\`, then disable it and uninstall or reconfigure the package, generator, or administrator unit that owns it before retrying.` : installedInAdministratorPath ? `Keep it as the sole gateway manager, or run \`${privilegePrefix}systemctl disable --now ${unitName}\`, \`${privilegePrefix}rm ${quotePosixArgument(ownership.unitPath)}\`, and \`${privilegePrefix}systemctl daemon-reload\` before retrying.` : ownership.status === "installed" ? `Keep it as the sole gateway manager, or inspect it with \`${privilegePrefix}systemctl cat ${unitName}\`, then uninstall or reconfigure the package, generator, or runtime owner of ${quotePosixArgument(ownership.unitPath)} before retrying.` : "Fix the reported systemctl or filesystem access error, then retry."
	].join("\n");
}
var SystemSystemdOwnershipError = class extends Error {
	constructor(ownership) {
		super(formatSystemSystemdOwnershipError(ownership));
		this.ownership = ownership;
		this.code = "SYSTEM_SYSTEMD_OWNERSHIP";
		this.name = "SystemSystemdOwnershipError";
	}
};
async function assertNoSystemSystemdOwnership(unitName) {
	const ownership = await inspectSystemSystemdOwnership(unitName);
	if (ownership.status !== "absent") throw new SystemSystemdOwnershipError(ownership);
}
//#endregion
//#region src/daemon/systemd-scope.ts
/** Installed systemd scope discovery and dueling-manager diagnostics. */
const SYSTEM_SYSTEMD_UNIT_DIRS = [
	"/etc/systemd/system",
	"/usr/lib/systemd/system",
	"/lib/systemd/system"
];
async function findSystemSystemdUnitPath(env) {
	const serviceFile = `${resolveSystemdServiceName(env)}.service`;
	for (const dir of SYSTEM_SYSTEMD_UNIT_DIRS) {
		const candidate = path.posix.join(dir, serviceFile);
		try {
			await fs$1.access(candidate);
			return candidate;
		} catch {
			continue;
		}
	}
	return null;
}
async function assertNoSystemGatewayOwnership(env) {
	if (env.OPENCLAW_SERVICE_KIND?.trim() === "node") return;
	await assertNoSystemSystemdOwnership(`${resolveSystemdServiceName(env)}.service`);
}
async function findMarkerOwnedSystemSystemdUnit() {
	const { findSystemGatewayServices } = await import("./inspect-V8ssOQjn.js");
	let services;
	try {
		services = await findSystemGatewayServices();
	} catch {
		return null;
	}
	for (const svc of services) {
		if (svc.platform !== "linux" || svc.scope !== "system" || svc.marker !== "openclaw" || !svc.label?.endsWith(".service")) continue;
		const unitPath = /^unit:\s*(.+)$/.exec(svc.detail.trim())?.[1]?.trim();
		if (unitPath) return {
			unitName: svc.label,
			unitPath
		};
	}
	return null;
}
async function findUserSystemdGatewayScope(env) {
	const canonicalUnitName = `${resolveSystemdServiceName(env)}.service`;
	let userPath;
	try {
		userPath = resolveSystemdUnitPath(env);
	} catch {
		userPath = null;
	}
	if (!userPath) return null;
	try {
		await fs$1.access(userPath);
		return {
			scope: "user",
			unitName: canonicalUnitName,
			unitPath: userPath
		};
	} catch {
		return null;
	}
}
async function findSystemSystemdGatewayScope(env) {
	const canonicalUnitName = `${resolveSystemdServiceName(env)}.service`;
	const systemPath = await findSystemSystemdUnitPath(env);
	if (systemPath) return {
		scope: "system",
		unitName: canonicalUnitName,
		unitPath: systemPath
	};
	const owned = await findMarkerOwnedSystemSystemdUnit();
	return owned ? {
		scope: "system",
		unitName: owned.unitName,
		unitPath: owned.unitPath
	} : null;
}
/**
* Canonical detector: reports every installed scope without early-returning,
* so a coexisting user + system unit surfaces as `dueling`.
*/
async function findSystemdGatewayInstallation(env) {
	const [user, system] = await Promise.all([findUserSystemdGatewayScope(env), findSystemSystemdGatewayScope(env)]);
	if (user && system) {
		if (user.unitName === system.unitName) return {
			kind: "dueling",
			user,
			system
		};
		return {
			kind: "user",
			user
		};
	}
	if (user) return {
		kind: "user",
		user
	};
	if (system) return {
		kind: "system",
		system
	};
	return { kind: "none" };
}
/**
* The single scope to act on, preserving the long-standing user-first
* preference its four lifecycle callers (stop/restart/is-enabled/runtime)
* rely on. Dueling resolution (removing the redundant user unit) is handled
* separately by doctor via {@link findSystemdGatewayInstallation}; this
* function intentionally does not change lifecycle semantics.
*/
async function findInstalledSystemdGatewayScope(env) {
	const installation = await findSystemdGatewayInstallation(env);
	if (installation.kind === "dueling" || installation.kind === "user") return installation.user;
	if (installation.kind === "system") return installation.system;
	return null;
}
/**
* True only when the system-scope unit is running now AND persistently enabled
* at boot. Doctor's dueling repair deletes the user unit behind this probe, so
* both halves are required: an enabled-but-failed unit would leave no gateway
* until the next boot, and an active-but-unenabled unit would leave none after
* it. Uncheckable (systemctl missing/erroring) reads as false so the repair
* fails closed to hints rather than removing a working user-scope gateway.
*/
async function isSystemUnitActiveAndEnabled(env, unitName) {
	const active = await isSystemdUnitActive(env, unitName, "system");
	if (!active.ok || !active.value) return false;
	const res = await execSystemctl(["is-enabled", unitName], env);
	if (res.code !== 0) return false;
	return normalizeLowercaseStringOrEmpty(res.stdout) === "enabled";
}
/**
* Builds the operator-facing warning for a `dueling` installation, or null for
* any other state. Pure (no I/O) so the startup guard's messaging is unit
* testable without faking the whole service-mode boot path.
*/
function formatDuelingScopesWarning(installation, port) {
	if (installation.kind !== "dueling") return null;
	const { user, system } = installation;
	return `detected BOTH a user-scope (${user.unitPath}) and a system-scope (${system.unitPath}) gateway unit bound to port ${port}; they will SIGTERM each other in a restart loop. Run \`openclaw doctor --fix\` to resolve which unit should own this gateway.`;
}
//#endregion
export { resolveSystemdUserServiceAccount as A, isSystemdUnitActive as C, isSystemdUserServiceAvailable as D, isSystemdUserScopeUnavailable as E, readStateDirDotEnvFromStateDir as F, collectDurableServiceEnvVarSources as M, collectDurableServiceEnvVars as N, readSystemctlDetail as O, isUnresolvedShellReference as P, isSystemctlMissing as S, isSystemdUnitNotEnabled as T, disableSystemdUserUnitForRemoval as _, isSystemUnitActiveAndEnabled as a, isNonFatalSystemdInstallProbeError as b, readSystemdServiceExecStart as c, resolveSystemdServiceName as d, resolveSystemdUnitPath as f, assertSystemdAvailable as g, serializeSystemdEnvironmentFile as h, formatDuelingScopesWarning as i, classifySystemdUnavailableDetail as j, reloadSystemdUserManager as k, resolveLegacyNodeSystemdEnvironmentFilePath as l, resolveSystemdUserUnitPath as m, findInstalledSystemdGatewayScope as n, isNodeSystemdEnvironment as o, resolveSystemdUnitPathForName as p, findSystemdGatewayInstallation as r, readSystemdEnvironmentFile as s, assertNoSystemGatewayOwnership as t, resolveSystemdEnvironmentFilePath as u, execSystemctl as v, isSystemdUnitMissingDetail as w, isSystemctlAvailable as x, execSystemctlUser as y };
