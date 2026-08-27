import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger, S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { E as isMissingPathError } from "./redact-Cl7lwBnl.js";
import { i as readRegularFileSync } from "./regular-file-CXw3t-8J.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { a as LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES, d as resolveGatewaySystemdServiceName, u as resolveGatewayServiceDescription } from "./constants-B4HhnyPv.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import "./regular-file-C2hsuc07.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-B_a4cpNH.js";
import { a as collectConfigServiceEnvVars } from "./config-env-vars-BITg3hPR.js";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.js";
import { t as resolveDaemonHomeDir } from "./paths-BX2ryH6I.js";
import { a as hasEnvironmentFileSource, c as normalizeServiceEnvKey, d as readManagedServiceEnvKeysFromEnvironment, l as normalizeServiceEnvKeys, o as hasInlineEnvironmentSource, s as isEnvironmentFileOnlySource, u as readEnvironmentValueSource } from "./service-managed-env-5CT4DNeI.js";
import { n as runExec, r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { t as execFileUtf8 } from "./exec-file-DvmgKHmY.js";
import { a as writeFormattedLines, i as normalizeWindowsPathSeparators, n as parseKeyValueOutput, r as formatLine, t as createGatewayLifecycleMutationReporter } from "./service-mutation-DyzHamq7.js";
import { i as renderSystemdEnvAssignment, n as parseSystemdEnvAssignments, r as parseSystemdExecStart, t as buildSystemdUnit } from "./systemd-unit-DRc8gCH8.js";
import { randomUUID } from "node:crypto";
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
async function execSystemctl(args, env, timeoutMs) {
	return await execFileUtf8("systemctl", args, {
		env: env ? resolveSystemctlProcessEnv(env) : process.env,
		...timeoutMs && timeoutMs > 0 ? {
			timeout: timeoutMs,
			killSignal: "SIGKILL"
		} : {}
	});
}
function readSystemctlDetail(result) {
	return `${result.stderr} ${result.stdout}`.trim();
}
const isSystemctlMissing = isSystemctlMissingDetail;
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
function resolveSystemctlDirectUserScopeArgs() {
	return ["--user"];
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
async function execSystemctlUser(env, args, timeoutMs) {
	const { machineUser, preferMachineScope } = resolveSystemctlUserScope(env);
	if (preferMachineScope && machineUser) {
		const machineScopeArgs = resolveSystemctlMachineUserScopeArgs(machineUser);
		if (machineScopeArgs.length > 0) return await execSystemctl([...machineScopeArgs, ...args], env, timeoutMs);
	}
	const directResult = await execSystemctl([...resolveSystemctlDirectUserScopeArgs(), ...args], env, timeoutMs);
	if (directResult.code === 0) return directResult;
	const detail = `${directResult.stderr} ${directResult.stdout}`.trim();
	if (!machineUser || !shouldFallbackToMachineUserScope(detail)) return directResult;
	const machineScopeArgs = resolveSystemctlMachineUserScopeArgs(machineUser);
	if (machineScopeArgs.length === 0) return directResult;
	return await execSystemctl([...machineScopeArgs, ...args], env, timeoutMs);
}
async function disableSystemdUserUnitForRemoval(env, unitName) {
	const result = await execSystemctlUser(env, [
		"disable",
		"--now",
		unitName
	]);
	if (result.code === 0) return;
	const detail = readSystemctlDetail(result);
	if (isSystemdUnitAlreadyMissingOrInactive(detail, unitName)) return;
	throw new Error(`systemctl disable failed: ${detail || "unknown error"}`);
}
async function reloadSystemdUserManager(env) {
	const result = await execSystemctlUser(env, ["daemon-reload"]);
	if (result.code !== 0) throw new Error(`systemctl daemon-reload failed: ${readSystemctlDetail(result) || "unknown error"}`);
}
async function isSystemdUserServiceAvailable(env = process.env) {
	const res = await execSystemctlUser(env, ["status"]);
	if (res.code === 0) return true;
	const detail = `${res.stderr} ${res.stdout}`.trim();
	if (!detail) return false;
	return !isSystemdUserScopeUnavailable(detail);
}
async function isSystemdUnitActive(env, unitName, scope = "user") {
	const normalizedUnit = unitName.trim();
	if (!normalizedUnit) return false;
	const args = [
		"is-active",
		"--quiet",
		normalizedUnit
	];
	return (scope === "system" ? await execSystemctl(args) : await execSystemctlUser(env, args)).code === 0;
}
async function assertSystemdAvailable(env = process.env, timeoutMs) {
	const res = await execSystemctlUser(env, ["status"], timeoutMs);
	if (res.code === 0) return;
	const detail = readSystemctlDetail(res);
	if (isSystemctlMissing(detail)) throw new Error("systemctl not available; systemd user services are required on Linux.");
	if (!detail) throw new Error("systemctl --user unavailable: unknown error");
	if (!isSystemdUserScopeUnavailable(detail)) return;
	throw new Error(`systemctl --user unavailable: ${detail || "unknown error"}`.trim());
}
async function isSystemctlAvailable(env) {
	const res = await execSystemctlUser(env, ["status"]);
	if (res.code === 0) return true;
	return !isSystemctlMissing(readSystemctlDetail(res));
}
//#endregion
//#region src/daemon/systemd-service-files.ts
/** Linux systemd unit paths and environment-file parsing. */
const SYSTEMD_GATEWAY_DOTENV_FILENAME = "gateway.systemd.env";
const SYSTEMD_NODE_DOTENV_FILENAME = "node.systemd.env";
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
async function readSystemdServiceExecStart(env) {
	const unitPath = resolveSystemdUnitPath(env);
	try {
		const content = await fs$1.readFile(unitPath, "utf8");
		let execStart = "";
		let workingDirectory = "";
		const inlineEnvironment = {};
		const environmentFileSpecs = [];
		for (const rawLine of content.split("\n")) {
			const line = rawLine.trim();
			if (!line || line.startsWith("#")) continue;
			if (line.startsWith("ExecStart=")) execStart = line.slice(10).trim();
			else if (line.startsWith("WorkingDirectory=")) workingDirectory = line.slice(17).trim();
			else if (line.startsWith("Environment=")) {
				const raw = line.slice(12).trim();
				for (const parsed of parseSystemdEnvAssignments(raw)) inlineEnvironment[parsed.key] = parsed.value;
			} else if (line.startsWith("EnvironmentFile=")) {
				const raw = line.slice(16).trim();
				if (raw) environmentFileSpecs.push(raw);
			}
		}
		if (!execStart) return null;
		const environmentFromFiles = await resolveSystemdEnvironmentFiles({
			environmentFileSpecs,
			env,
			unitPath
		});
		const mergedEnvironment = {
			...inlineEnvironment,
			...environmentFromFiles.environment
		};
		const mergedEnvironmentSources = mergeEnvironmentValueSources(inlineEnvironment, environmentFromFiles.environment);
		return {
			programArguments: parseSystemdExecStart(execStart),
			...workingDirectory ? { workingDirectory } : {},
			...Object.keys(mergedEnvironment).length > 0 ? { environment: mergedEnvironment } : {},
			...Object.keys(mergedEnvironmentSources).length > 0 ? { environmentValueSources: mergedEnvironmentSources } : {},
			sourcePath: unitPath
		};
	} catch {
		return null;
	}
}
function buildEnvironmentValueSources(environment, source) {
	return Object.fromEntries(Object.keys(environment).map((key) => [key, source]));
}
function mergeEnvironmentValueSources(inlineEnvironment, fileEnvironment) {
	const sources = buildEnvironmentValueSources(inlineEnvironment, "inline");
	for (const key of Object.keys(fileEnvironment)) sources[key] = Object.hasOwn(inlineEnvironment, key) ? "inline-and-file" : "file";
	return sources;
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
	return input.replaceAll("%h", normalizeWindowsPathSeparators(resolveDaemonHomeDir(env)));
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
	if (params.environmentFileSpecs.length === 0) return { environment: resolved };
	const unitDir = path.posix.dirname(params.unitPath);
	for (const specRaw of params.environmentFileSpecs) for (const token of parseEnvironmentFileSpecs(specRaw)) {
		const pathnameRaw = token.startsWith("-") ? token.slice(1).trim() : token;
		if (!pathnameRaw) continue;
		const expanded = expandSystemdSpecifier(pathnameRaw, params.env);
		const pathname = path.posix.isAbsolute(expanded) ? expanded : path.posix.resolve(unitDir, expanded);
		try {
			const fromFile = await readSystemdEnvironmentFile(pathname);
			Object.assign(resolved, fromFile.environment);
		} catch {
			continue;
		}
	}
	return { environment: resolved };
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
	if (normalizedDetail.includes(unitName.toLowerCase()) && /not[- ]found|could not be found/i.test(normalizedDetail)) return {
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
function isRunningAsRoot$1() {
	if (typeof process.geteuid !== "function") return false;
	try {
		return process.geteuid() === 0;
	} catch {
		return false;
	}
}
function formatSystemSystemdOwnershipError(ownership) {
	const privilegePrefix = isRunningAsRoot$1() ? "" : "sudo ";
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
	const { findSystemGatewayServices } = await import("./inspect-C_YdHmGD.js");
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
	if (!await isSystemdUnitActive(env, unitName, "system")) return false;
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
//#region src/daemon/systemd-install.ts
/** systemd unit publication, installation, staging, and uninstall. */
function collectSystemdInlineManagedKeys(params) {
	const keys = readManagedServiceEnvKeysFromEnvironment(params.environment);
	for (const key of collectSystemdFileManagedKeys({ environmentValueSources: params.environmentValueSources })) keys.delete(key);
	for (const [rawKey, value] of Object.entries(params.environment ?? {})) {
		if (typeof value !== "string" || !value.trim()) continue;
		const key = normalizeServiceEnvKey(rawKey);
		if (!key) continue;
		const source = readEnvironmentValueSource(params.environmentValueSources, rawKey);
		if (hasInlineEnvironmentSource(source) && !hasEnvironmentFileSource(source)) keys.add(key);
	}
	return keys;
}
function collectSystemdFileManagedKeys(params) {
	const keys = /* @__PURE__ */ new Set();
	for (const [rawKey, source] of Object.entries(params.environmentValueSources ?? {})) {
		const key = normalizeServiceEnvKey(rawKey);
		if (key && isEnvironmentFileOnlySource(source)) keys.add(key);
	}
	return keys;
}
function collectSystemdFileBackedEnvironment(params) {
	if (params.fileManagedKeys.size === 0) return {};
	const environment = {};
	for (const [rawKey, rawValue] of Object.entries(params.environment ?? {})) {
		if (typeof rawValue !== "string" || !rawValue.trim()) continue;
		const key = normalizeServiceEnvKey(rawKey);
		if (key && params.fileManagedKeys.has(key) && !isUnresolvedShellReference(rawValue)) environment[rawKey] = rawValue;
	}
	return environment;
}
function sanitizeSystemdUnitBackupContent(params) {
	if (params.fileManagedKeys.size === 0) return params.content;
	const sanitizedLines = [];
	for (const rawLine of params.content.split("\n")) {
		const line = rawLine.trim();
		if (!line.startsWith("Environment=")) {
			sanitizedLines.push(rawLine);
			continue;
		}
		const assignments = parseSystemdEnvAssignments(line.slice(12).trim());
		if (assignments.length === 0) {
			sanitizedLines.push(rawLine);
			continue;
		}
		const keptAssignments = assignments.filter(({ key }) => {
			const normalizedKey = normalizeServiceEnvKey(key);
			return !normalizedKey || !params.fileManagedKeys.has(normalizedKey);
		});
		if (keptAssignments.length === assignments.length) {
			sanitizedLines.push(rawLine);
			continue;
		}
		if (keptAssignments.length === 0) continue;
		const leadingWhitespace = rawLine.match(/^\s*/)?.[0] ?? "";
		sanitizedLines.push(`${leadingWhitespace}Environment=${keptAssignments.map(({ key, value }) => renderSystemdEnvAssignment(key, value)).join(" ")}`);
	}
	return sanitizedLines.join("\n");
}
async function writeSystemdUnit({ env, programArguments, workingDirectory, environment, environmentValueSources, description }) {
	await assertSystemdAvailable(env);
	await assertNoSystemGatewayOwnership(env);
	const unitPath = resolveSystemdUnitPath(env);
	const priorManagedKeys = readManagedServiceEnvKeysFromEnvironment((await readSystemdServiceExecStart(env))?.environment);
	await fs$1.mkdir(path.dirname(unitPath), { recursive: true });
	await assertSystemdManagedPathIsNotSymlink(unitPath);
	const fileManagedKeys = collectSystemdFileManagedKeys({ environmentValueSources });
	let backedUp = false;
	try {
		const backupPath = `${unitPath}.bak`;
		const existingUnit = await fs$1.readFile(unitPath, "utf8");
		const backupMode = (await fs$1.stat(unitPath)).mode & 511 || 384;
		const backupUnit = sanitizeSystemdUnitBackupContent({
			content: existingUnit,
			fileManagedKeys
		});
		await fs$1.writeFile(backupPath, backupUnit, {
			encoding: "utf8",
			mode: backupMode
		});
		await fs$1.chmod(backupPath, backupMode);
		backedUp = true;
	} catch {}
	const serviceDescription = resolveGatewayServiceDescription({
		env,
		description
	});
	const stateDir = resolveStateDir(env);
	const { entries: stateDirDotEnvEntries, skippedShellReferenceKeys } = readStateDirDotEnvFromStateDir(stateDir);
	const stateDirDotEnvVars = Object.fromEntries(Object.entries(stateDirDotEnvEntries).filter(([key, value]) => {
		const inlineValue = environment?.[key];
		if (typeof inlineValue !== "string") return true;
		return inlineValue.trim() === value.trim();
	}));
	const inlineManagedKeys = collectSystemdInlineManagedKeys({
		environment,
		environmentValueSources
	});
	const environmentFilePath = resolveSystemdEnvironmentFilePath({
		stateDir,
		environment
	});
	const environmentFileSnapshot = isNodeSystemdEnvironment(env) ? void 0 : await readSystemdFileSnapshot(environmentFilePath);
	try {
		const environmentFileResult = await writeSystemdGatewayEnvironmentFile({
			stateDir,
			stateDirDotEnvKeys: Object.keys(stateDirDotEnvVars),
			priorManagedKeys,
			inlineManagedKeys,
			fileManagedKeys,
			skippedManagedKeys: skippedShellReferenceKeys,
			fileBackedEnvironment: collectSystemdFileBackedEnvironment({
				environment,
				fileManagedKeys
			}),
			environment
		});
		await publishSystemdUnit({
			env,
			unitPath,
			contents: buildSystemdUnit({
				description: serviceDescription,
				programArguments,
				workingDirectory,
				environment: Object.fromEntries(Object.entries(environment ?? {}).filter(([key, value]) => {
					if (typeof value !== "string") return false;
					if (hasEnvironmentFileSource(readEnvironmentValueSource(environmentValueSources, key)) && isUnresolvedShellReference(value)) return false;
					const normalizedKey = normalizeServiceEnvKey(key);
					if (normalizedKey && environmentFileResult.environmentKeys.has(normalizedKey) && !inlineManagedKeys.has(normalizedKey)) return false;
					const stateDirValue = stateDirDotEnvVars[key];
					if (typeof stateDirValue !== "string") return true;
					return value.trim() !== stateDirValue.trim();
				})),
				environmentFiles: environmentFileResult.environmentFiles
			})
		});
	} catch (error) {
		if (environmentFileSnapshot !== void 0) try {
			await restoreSystemdFileSnapshot(environmentFilePath, environmentFileSnapshot);
		} catch (rollbackError) {
			const failureDetail = error instanceof Error ? error.message : String(error);
			throw new Error(`${failureDetail}\nThe previous systemd environment file at ${environmentFilePath} could not be restored.`, { cause: rollbackError });
		}
		throw error;
	}
	return {
		unitPath,
		backedUp
	};
}
async function assertSystemdManagedPathIsNotSymlink(filePath) {
	try {
		if ((await fs$1.lstat(filePath)).isSymbolicLink()) throw new Error(`Refusing to rewrite symlinked managed systemd file: ${filePath}`);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
async function readSystemdFileSnapshot(filePath) {
	try {
		const stat = await fs$1.lstat(filePath);
		if (stat.isSymbolicLink()) throw new Error(`Refusing to rewrite symlinked managed systemd file: ${filePath}`);
		return {
			contents: await fs$1.readFile(filePath),
			mode: stat.mode & 511
		};
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function restoreSystemdFileSnapshot(filePath, snapshot) {
	if (snapshot === null) {
		await fs$1.rm(filePath, { force: true });
		return;
	}
	await fs$1.mkdir(path.dirname(filePath), { recursive: true });
	const rollbackPath = `${filePath}.openclaw-${randomUUID()}.rollback`;
	try {
		await fs$1.writeFile(rollbackPath, snapshot.contents, {
			flag: "wx",
			mode: snapshot.mode
		});
		await fs$1.rename(rollbackPath, filePath);
	} finally {
		await fs$1.unlink(rollbackPath).catch(() => void 0);
	}
}
async function publishSystemdUnit(params) {
	const previous = await readSystemdFileSnapshot(params.unitPath);
	const temporaryPath = `${params.unitPath}.openclaw-${randomUUID()}.tmp`;
	await fs$1.writeFile(temporaryPath, params.contents, {
		encoding: "utf8",
		flag: "wx",
		mode: previous?.mode ?? 420
	});
	try {
		await assertNoSystemGatewayOwnership(params.env);
		await fs$1.rename(temporaryPath, params.unitPath);
		try {
			await assertNoSystemGatewayOwnership(params.env);
		} catch (ownershipError) {
			try {
				await restoreSystemdFileSnapshot(params.unitPath, previous);
			} catch (rollbackError) {
				const ownershipDetail = ownershipError instanceof Error ? ownershipError.message : String(ownershipError);
				throw new Error(`${ownershipDetail}\nThe previous user systemd unit at ${params.unitPath} could not be restored.`, { cause: rollbackError });
			}
			throw ownershipError;
		}
	} finally {
		await fs$1.unlink(temporaryPath).catch(() => void 0);
	}
}
async function writeSystemdGatewayEnvironmentFile(params) {
	const incoming = { ...params.fileBackedEnvironment };
	for (const [key, value] of Object.entries(incoming)) if (/[\r\n]/.test(value)) throw new Error(`state-dir .env contains a multiline value for ${key}; systemd EnvironmentFile values must be single-line`);
	const envFilePath = resolveSystemdEnvironmentFilePath({
		stateDir: params.stateDir,
		environment: params.environment
	});
	const existing = {};
	const literalShellReferenceKeys = /* @__PURE__ */ new Set();
	const legacyNodeEnvFilePath = resolveLegacyNodeSystemdEnvironmentFilePath({
		stateDir: params.stateDir,
		environment: params.environment
	});
	for (const sourceEnvFilePath of [legacyNodeEnvFilePath, envFilePath]) {
		if (!sourceEnvFilePath) continue;
		try {
			const fromFile = await readSystemdEnvironmentFile(sourceEnvFilePath);
			for (const [key, value] of Object.entries(fromFile.environment)) {
				existing[key] = value;
				if (fromFile.literalShellReferenceKeys.has(key)) literalShellReferenceKeys.add(key);
				else literalShellReferenceKeys.delete(key);
			}
		} catch {}
	}
	const managedKeysToDrop = normalizeServiceEnvKeys([
		...params.inlineManagedKeys ?? [],
		...params.fileManagedKeys ?? [],
		...params.priorManagedKeys ?? [],
		...params.stateDirDotEnvKeys ?? [],
		...params.skippedManagedKeys ?? []
	]);
	const merged = {
		...Object.fromEntries(Object.entries(existing).filter(([key, value]) => {
			const normalized = normalizeServiceEnvKey(key);
			if (normalized && managedKeysToDrop.has(normalized)) return false;
			return literalShellReferenceKeys.has(key) || !isUnresolvedShellReference(value);
		})),
		...incoming
	};
	const environmentKeys = normalizeServiceEnvKeys(Object.keys(merged));
	if (Object.keys(merged).length === 0) {
		await fs$1.rm(envFilePath, { force: true }).catch(() => void 0);
		return {
			environmentFiles: [],
			environmentKeys
		};
	}
	const content = serializeSystemdEnvironmentFile(merged);
	await fs$1.mkdir(path.dirname(envFilePath), { recursive: true });
	await fs$1.writeFile(envFilePath, `${content}\n`, {
		encoding: "utf8",
		mode: 384
	});
	await fs$1.chmod(envFilePath, 384);
	return {
		environmentFiles: [envFilePath],
		environmentKeys
	};
}
async function removeNodeSystemdManagedEnvironmentKeys(env) {
	if (!isNodeSystemdEnvironment(env)) return;
	const envFilePath = resolveSystemdEnvironmentFilePath({
		stateDir: resolveStateDir(env),
		environment: env
	});
	let existingFile;
	try {
		existingFile = await readSystemdEnvironmentFile(envFilePath);
	} catch {
		return;
	}
	const managedKeys = /* @__PURE__ */ new Set(["OPENCLAW_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_PASSWORD"]);
	const remaining = Object.fromEntries(Object.entries(existingFile.environment).filter(([key, value]) => {
		const normalized = normalizeServiceEnvKey(key);
		if (normalized && managedKeys.has(normalized)) return false;
		return existingFile.literalShellReferenceKeys.has(key) || !isUnresolvedShellReference(value);
	}));
	if (Object.keys(remaining).length === 0) {
		await fs$1.rm(envFilePath, { force: true });
		return;
	}
	const content = serializeSystemdEnvironmentFile(remaining);
	await fs$1.writeFile(envFilePath, `${content}\n`, {
		encoding: "utf8",
		mode: 384
	});
	await fs$1.chmod(envFilePath, 384);
}
async function stageSystemdService({ stdout, ...args }) {
	const { unitPath, backedUp } = await writeSystemdUnit(args);
	writeFormattedLines(stdout, [{
		label: "Staged systemd service",
		value: unitPath
	}, ...backedUp ? [{
		label: "Previous unit backed up to",
		value: `${unitPath}.bak`
	}] : []], { leadingBlankLine: true });
	return { unitPath };
}
async function activateSystemdService(params) {
	const unitName = `${resolveSystemdServiceName(params.env)}.service`;
	await assertNoSystemGatewayOwnership(params.env);
	const reloadSystemd = async () => await execSystemctlUser(params.env, ["daemon-reload"]);
	const throwActivationFailure = (action, result) => {
		const detail = readSystemctlDetail(result);
		if (isSystemdUserScopeUnavailable(detail)) throw new Error(`systemctl --user unavailable: ${detail || "unknown error"}`.trim());
		throw new Error(`systemctl ${action} failed: ${detail || "unknown error"}`.trim());
	};
	const reload = await reloadSystemd();
	if (reload.code !== 0) throwActivationFailure("daemon-reload", reload);
	const runAfterReloadRetry = async (action) => {
		const result = await execSystemctlUser(params.env, [action, unitName]);
		if (result.code === 0 || !isSystemdUnitMissingDetail(readSystemctlDetail(result))) return result;
		const retryReload = await reloadSystemd();
		if (retryReload.code !== 0) throwActivationFailure("daemon-reload", retryReload);
		return await execSystemctlUser(params.env, [action, unitName]);
	};
	const enable = await runAfterReloadRetry("enable");
	if (enable.code !== 0) throwActivationFailure("enable", enable);
	const restart = await runAfterReloadRetry("restart");
	if (restart.code !== 0) throwActivationFailure("restart", restart);
}
async function installSystemdService(args) {
	const { unitPath, backedUp } = await writeSystemdUnit(args);
	await activateSystemdService({ env: args.env });
	writeFormattedLines(args.stdout, [{
		label: "Installed systemd service",
		value: unitPath
	}, ...backedUp ? [{
		label: "Previous unit backed up to",
		value: `${unitPath}.bak`
	}] : []], { leadingBlankLine: true });
	return { unitPath };
}
async function uninstallSystemdService({ env, stdout }) {
	await assertSystemdAvailable(env);
	await disableSystemdUserUnitForRemoval(env, `${resolveSystemdServiceName(env)}.service`);
	const unitPath = resolveSystemdUnitPath(env);
	let removed = false;
	try {
		await fs$1.unlink(unitPath);
		removed = true;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	await removeNodeSystemdManagedEnvironmentKeys(env);
	if (removed) stdout.write(`${formatLine("Removed systemd service", unitPath)}\n`);
	else stdout.write(`Systemd service not found at ${unitPath}\n`);
}
//#endregion
//#region src/daemon/systemd-lifecycle.ts
/** systemd start, stop, restart, and obsolete-unit removal. */
function isRunningAsRoot() {
	if (typeof process.geteuid === "function") try {
		return process.geteuid() === 0;
	} catch {
		return false;
	}
	return false;
}
async function runSystemdServiceAction(params) {
	const env = params.env ?? process.env;
	const installed = await findInstalledSystemdGatewayScope(env);
	const unitName = installed?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	let runSystemctl;
	if (installed?.scope === "system") {
		if (!isRunningAsRoot()) throw new Error(`${unitName} is a system-scope unit (${installed.unitPath}); run \`sudo systemctl ${params.action} ${unitName}\` to ${params.action} it`);
		runSystemctl = (args) => execSystemctl(args, env);
	} else {
		await assertSystemdAvailable(env);
		if (params.action !== "stop") await assertNoSystemGatewayOwnership(env);
		runSystemctl = (args) => execSystemctlUser(env, args);
	}
	if (params.action !== "stop") await runSystemctl(["reset-failed", unitName]);
	const res = await runSystemctl([params.action, unitName]);
	if (res.code !== 0) throw new Error(`systemctl ${params.action} failed: ${res.stderr || res.stdout}`.trim());
	params.onMutation?.();
	params.stdout.write(`${formatLine(params.label, unitName)}\n`);
}
async function startSystemdService({ stdout, env, onMutation }) {
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await runSystemdServiceAction({
		stdout,
		env,
		action: "start",
		label: "Started systemd service",
		onMutation: () => reportMutation("systemctl-start")
	});
}
async function stopSystemdService({ stdout, env, onMutation }) {
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await runSystemdServiceAction({
		stdout,
		env,
		action: "stop",
		label: "Stopped systemd service",
		onMutation: () => reportMutation("systemctl-stop")
	});
}
async function restartSystemdService({ stdout, env, onMutation }) {
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	await runSystemdServiceAction({
		stdout,
		env,
		action: "restart",
		label: "Restarted systemd service",
		onMutation: () => reportMutation("systemctl-restart")
	});
	return { outcome: "completed" };
}
async function findLegacySystemdUnits(env) {
	const results = [];
	const systemctlAvailable = await isSystemctlAvailable(env);
	for (const name of LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES) {
		const unitPath = resolveSystemdUnitPathForName(env, name);
		let exists = false;
		try {
			await fs$1.access(unitPath);
			exists = true;
		} catch {}
		let enabled = false;
		if (systemctlAvailable) enabled = (await execSystemctlUser(env, ["is-enabled", `${name}.service`])).code === 0;
		if (exists || enabled) results.push({
			name,
			unitPath,
			enabled,
			exists
		});
	}
	return results;
}
async function uninstallLegacySystemdUnits({ env, stdout }) {
	const units = await findLegacySystemdUnits(env);
	if (units.length === 0) return units;
	const systemctlAvailable = await isSystemctlAvailable(env);
	let removedAny = false;
	for (const unit of units) {
		if (systemctlAvailable) await disableSystemdUserUnitForRemoval(env, `${unit.name}.service`);
		else stdout.write(`systemctl unavailable; removed legacy unit file only: ${unit.name}.service\n`);
		try {
			await fs$1.unlink(unit.unitPath);
			removedAny = true;
			stdout.write(`${formatLine("Removed legacy systemd service", unit.unitPath)}\n`);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			stdout.write(`Legacy systemd unit not found at ${unit.unitPath}\n`);
		}
	}
	if (systemctlAvailable && removedAny) await reloadSystemdUserManager(env);
	return units;
}
/**
* Removes the canonical *user-scope* gateway unit, leaving any system-scope
* unit untouched. Used by doctor to resolve a `dueling` installation by
* dropping the redundant user-scope leftover (issue #79375). Removing a unit
* under `$HOME` needs no root, unlike the system-scope unit.
*/
async function uninstallUserSystemdGatewayUnit({ env, stdout }) {
	const unitName = `${resolveSystemdServiceName(env)}.service`;
	const unitPath = resolveSystemdUnitPath(env);
	let disabled = false;
	if (await isSystemctlAvailable(env)) {
		await disableSystemdUserUnitForRemoval(env, unitName);
		disabled = true;
	} else stdout.write(`systemctl unavailable; removing unit file only: ${unitName}. A loaded unit keeps running until systemd reloads.\n`);
	let removed = false;
	try {
		await fs$1.unlink(unitPath);
		removed = true;
		stdout.write(`${formatLine("Removed user-scope systemd service", unitPath)}\n`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		stdout.write(`User-scope systemd unit not found at ${unitPath}\n`);
	}
	if (removed && disabled) await reloadSystemdUserManager(env);
	return {
		unitName,
		unitPath,
		removed,
		disabled
	};
}
//#endregion
//#region src/daemon/systemd-linger.ts
/** Reads and enables systemd user linger for headless daemon sessions. */
function resolveLoginctlUser(env) {
	const fromEnv = normalizeOptionalString(env.USER) || normalizeOptionalString(env.LOGNAME);
	if (fromEnv) return fromEnv;
	try {
		return os.userInfo().username;
	} catch {
		return null;
	}
}
/** Reads systemd user linger status through loginctl when available. */
async function readSystemdUserLingerStatus(params) {
	const user = params.user ?? resolveLoginctlUser(params.env);
	if (!user) return null;
	try {
		const { stdout } = await runExec("loginctl", [
			"show-user",
			user,
			"-p",
			"Linger"
		], { timeoutMs: 5e3 });
		const value = normalizeOptionalLowercaseString(stdout.split("\n").map((entry) => entry.trim()).find((entry) => entry.startsWith("Linger="))?.split("=")[1]);
		if (value === "yes" || value === "no") return {
			user,
			linger: value
		};
	} catch {}
	return null;
}
/** Enables systemd user linger through loginctl, with optional sudo mode. */
async function enableSystemdUserLinger(params) {
	const user = params.user ?? resolveLoginctlUser(params.env);
	if (!user) return {
		ok: false,
		stdout: "",
		stderr: "Missing user",
		code: 1
	};
	const argv = [
		...(typeof process.getuid === "function" ? process.getuid() !== 0 : true) && params.sudoMode !== void 0 ? ["sudo", ...params.sudoMode === "non-interactive" ? ["-n"] : []] : [],
		"loginctl",
		"enable-linger",
		user
	];
	try {
		const result = await runCommandWithTimeout(argv, { timeoutMs: 3e4 });
		return {
			ok: result.code === 0,
			stdout: result.stdout,
			stderr: result.stderr,
			code: result.code ?? 1
		};
	} catch (error) {
		return {
			ok: false,
			stdout: "",
			stderr: formatErrorMessage(error),
			code: 1
		};
	}
}
//#endregion
//#region src/daemon/systemd-runtime.ts
/** systemd service enabled-state and runtime inspection. */
function parseSystemdShow(output) {
	const entries = parseKeyValueOutput(output, "=");
	const info = {};
	const activeState = entries.activestate;
	if (activeState) info.activeState = activeState;
	const subState = entries.substate;
	if (subState) info.subState = subState;
	const mainPidValue = entries.mainpid;
	if (mainPidValue) {
		const pid = parseStrictPositiveInteger(mainPidValue);
		if (pid !== void 0) info.mainPid = pid;
	}
	const execMainStatusValue = entries.execmainstatus;
	if (execMainStatusValue) {
		const status = parseStrictInteger(execMainStatusValue);
		if (status !== void 0) info.execMainStatus = status;
	}
	const execMainCode = entries.execmaincode;
	if (execMainCode) info.execMainCode = execMainCode;
	const result = entries.result;
	if (result) info.result = result;
	const nRestartsValue = entries.nrestarts;
	if (nRestartsValue) {
		const nRestarts = parseStrictInteger(nRestartsValue);
		if (nRestarts !== void 0) info.nRestarts = nRestarts;
	}
	const startLimitBurstValue = entries.startlimitburst;
	if (startLimitBurstValue) {
		const startLimitBurst = parseStrictInteger(startLimitBurstValue);
		if (startLimitBurst !== void 0) info.startLimitBurst = startLimitBurst;
	}
	const unit = entries.id;
	if (unit) info.unit = unit;
	const killMode = entries.killmode;
	if (killMode) info.killMode = killMode;
	const tasksCurrentValue = entries.taskscurrent;
	if (tasksCurrentValue) {
		const tasksCurrent = parseStrictNonNegativeInteger(tasksCurrentValue);
		if (tasksCurrent !== void 0) info.tasksCurrent = tasksCurrent;
	}
	const memoryCurrentValue = entries.memorycurrent;
	if (memoryCurrentValue) {
		const memoryCurrent = parseStrictNonNegativeInteger(memoryCurrentValue);
		if (memoryCurrent !== void 0) info.memoryCurrent = memoryCurrent;
	}
	return info;
}
async function isSystemdServiceEnabled(args) {
	const env = args.env ?? process.env;
	const installed = await findInstalledSystemdGatewayScope(env);
	if (!installed) return false;
	const res = installed.scope === "system" ? await execSystemctl(["is-enabled", installed.unitName], env, args.timeoutMs) : await execSystemctlUser(env, ["is-enabled", installed.unitName], args.timeoutMs);
	if (res.code === 0) return true;
	const detail = readSystemctlDetail(res);
	if (isSystemctlMissing(detail) || isSystemdUnitNotEnabled(detail)) return false;
	throw new Error(`systemctl is-enabled unavailable: ${detail || "unknown error"}`.trim());
}
async function readSystemdServiceRuntime(env = process.env, opts) {
	const timeoutMs = opts?.timeoutMs;
	const installed = await findInstalledSystemdGatewayScope(env).catch(() => null);
	if (installed?.scope !== "system") try {
		await assertSystemdAvailable(env, timeoutMs);
	} catch (err) {
		return {
			status: "unknown",
			detail: formatErrorMessage(err)
		};
	}
	const unitName = installed?.unitName ?? `${resolveSystemdServiceName(env)}.service`;
	const showArgs = [
		"show",
		unitName,
		"--no-page",
		"--property",
		"Id,ActiveState,SubState,Result,NRestarts,StartLimitBurst,MainPID,ExecMainStatus,ExecMainCode,KillMode,TasksCurrent,MemoryCurrent"
	];
	const res = installed?.scope === "system" ? await execSystemctl(showArgs, env, timeoutMs) : await execSystemctlUser(env, showArgs, timeoutMs);
	if (res.code !== 0) {
		const detail = (res.stderr || res.stdout).trim();
		const missing = normalizeLowercaseStringOrEmpty(detail).includes("not found");
		return {
			status: missing ? "stopped" : "unknown",
			detail: detail || void 0,
			missingUnit: missing
		};
	}
	const parsed = parseSystemdShow(res.stdout || "");
	const activeState = normalizeLowercaseStringOrEmpty(parsed.activeState);
	return {
		status: activeState === "active" ? "running" : activeState ? "stopped" : "unknown",
		state: parsed.activeState,
		subState: parsed.subState,
		pid: parsed.mainPid,
		lastExitStatus: parsed.execMainStatus,
		lastExitReason: parsed.execMainCode,
		systemd: {
			unit: parsed.unit ?? unitName,
			killMode: parsed.killMode,
			tasksCurrent: parsed.tasksCurrent,
			memoryCurrent: parsed.memoryCurrent,
			result: parsed.result,
			nRestarts: parsed.nRestarts,
			startLimitBurst: parsed.startLimitBurst
		}
	};
}
//#endregion
export { classifySystemdUnavailableDetail as C, resolveSystemdUserServiceAccount as S, collectDurableServiceEnvVars as T, readSystemdServiceExecStart as _, restartSystemdService as a, isSystemdUnitActive as b, uninstallLegacySystemdUnits as c, stageSystemdService as d, uninstallSystemdService as f, isSystemUnitActiveAndEnabled as g, formatDuelingScopesWarning as h, readSystemdUserLingerStatus as i, uninstallUserSystemdGatewayUnit as l, findSystemdGatewayInstallation as m, readSystemdServiceRuntime as n, startSystemdService as o, findInstalledSystemdGatewayScope as p, enableSystemdUserLinger as r, stopSystemdService as s, isSystemdServiceEnabled as t, installSystemdService as u, resolveSystemdUserUnitPath as v, collectDurableServiceEnvVarSources as w, isSystemdUserServiceAvailable as x, isNonFatalSystemdInstallProbeError as y };
