import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger, S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { f as resolveGatewayServiceDescription, o as LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES } from "./constants-ChqKLfPp.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { E as isSystemdUserScopeUnavailable, F as readStateDirDotEnvFromStateDir, O as readSystemctlDetail, P as isUnresolvedShellReference, S as isSystemctlMissing, T as isSystemdUnitNotEnabled, _ as disableSystemdUserUnitForRemoval, c as readSystemdServiceExecStart, d as resolveSystemdServiceName, f as resolveSystemdUnitPath, g as assertSystemdAvailable, h as serializeSystemdEnvironmentFile, k as reloadSystemdUserManager, l as resolveLegacyNodeSystemdEnvironmentFilePath, n as findInstalledSystemdGatewayScope, o as isNodeSystemdEnvironment, p as resolveSystemdUnitPathForName, s as readSystemdEnvironmentFile, t as assertNoSystemGatewayOwnership, u as resolveSystemdEnvironmentFilePath, v as execSystemctl, w as isSystemdUnitMissingDetail, x as isSystemctlAvailable, y as execSystemctlUser } from "./systemd-scope-Dt6qzIxA.js";
import { a as hasEnvironmentFileSource, c as normalizeServiceEnvKey, d as readManagedServiceEnvKeysFromEnvironment, l as normalizeServiceEnvKeys, o as hasInlineEnvironmentSource, s as isEnvironmentFileOnlySource, u as readEnvironmentValueSource } from "./service-managed-env-D38lJbxp.js";
import { n as runExec, r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { a as writeFormattedLines, n as parseKeyValueOutput, r as formatLine, t as createGatewayLifecycleMutationReporter } from "./service-mutation-DyzHamq7.js";
import { i as renderSystemdEnvAssignment, n as parseSystemdEnvAssignments, t as buildSystemdUnit } from "./systemd-unit-CHPTm-mW.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/daemon/service-types.ts
function resolveManagedGatewayServiceCommand(command) {
	return command?.managedDefinition ?? command ?? null;
}
/** Operator-owned launcher overrides cannot be repaired by rewriting the managed base. */
function hasGatewayServiceLauncherOverride(command, options) {
	const managedOverrides = command?.managedOverrides;
	const includeWorkingDirectory = options?.includeWorkingDirectory !== false;
	if (managedOverrides) return Boolean(managedOverrides.launcher && (includeWorkingDirectory || managedOverrides.launcher !== "working-directory"));
	const managedDefinition = command?.managedDefinition;
	return Boolean(managedDefinition && (includeWorkingDirectory && managedDefinition.workingDirectory !== command.workingDirectory || managedDefinition.programArguments.join("\0") !== command.programArguments.join("\0")));
}
function hasGatewayServiceEnvironmentOverride(command, keys, options) {
	const managedOverrides = command?.managedOverrides;
	if (!managedOverrides) return hasGatewayServiceEnvironmentDifference(command, keys);
	const environment = managedOverrides.environment;
	if (environment === true || !environment) return environment === true && keys.length > 0;
	const normalize = options?.normalizeKey ?? ((key) => key);
	const ownedKeys = new Set(environment.keys?.map(normalize));
	const sources = options?.environmentValueSources ?? command.managedDefinition?.environmentValueSources;
	return keys.some((key) => {
		const normalized = normalize(key);
		if (normalized !== null && ownedKeys.has(normalized)) return true;
		if (options?.ignoreResets) return false;
		const source = sources?.[key] ?? (options?.normalizeKey && Object.entries(sources ?? {}).find(([rawKey]) => normalize(rawKey) === normalized)?.[1]) ?? "inline";
		return Boolean(environment.resetInline && source !== "file" || environment.resetFiles && source !== "inline");
	});
}
function hasGatewayServiceEnvironmentDifference(command, keys) {
	const managedDefinition = command?.managedDefinition;
	return Boolean(managedDefinition && keys.some((key) => command.environment?.[key] !== managedDefinition.environment?.[key] || (command.environmentValueSources?.[key] ?? "inline") !== (managedDefinition.environmentValueSources?.[key] ?? "inline")));
}
/** Remove inherited operator overrides before a managed definition is rewritten. */
function resolveManagedGatewayServiceProcessEnv(command, processEnv) {
	const overrides = command?.managedOverrides?.environment;
	if (overrides === true || overrides?.resetInline || overrides?.resetFiles) return null;
	const managedEnvironment = resolveManagedGatewayServiceCommand(command)?.environment;
	const environment = {
		...processEnv,
		...managedEnvironment
	};
	for (const key of [...Object.keys(command?.environment ?? {}), ...overrides?.keys ?? []]) if (!Object.hasOwn(managedEnvironment ?? {}, key)) delete environment[key];
	return environment;
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
	const priorManagedKeys = readManagedServiceEnvKeysFromEnvironment(resolveManagedGatewayServiceCommand(await readSystemdServiceExecStart(env))?.environment);
	await fs.mkdir(path.dirname(unitPath), { recursive: true });
	await assertSystemdManagedPathIsNotSymlink(unitPath);
	const fileManagedKeys = collectSystemdFileManagedKeys({ environmentValueSources });
	let backedUp = false;
	try {
		const backupPath = `${unitPath}.bak`;
		const existingUnit = await fs.readFile(unitPath, "utf8");
		const backupMode = (await fs.stat(unitPath)).mode & 511 || 384;
		const backupUnit = sanitizeSystemdUnitBackupContent({
			content: existingUnit,
			fileManagedKeys
		});
		await fs.writeFile(backupPath, backupUnit, {
			encoding: "utf8",
			mode: backupMode
		});
		await fs.chmod(backupPath, backupMode);
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
		if ((await fs.lstat(filePath)).isSymbolicLink()) throw new Error(`Refusing to rewrite symlinked managed systemd file: ${filePath}`);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
async function readSystemdFileSnapshot(filePath) {
	try {
		const stat = await fs.lstat(filePath);
		if (stat.isSymbolicLink()) throw new Error(`Refusing to rewrite symlinked managed systemd file: ${filePath}`);
		return {
			contents: await fs.readFile(filePath),
			mode: stat.mode & 511
		};
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function restoreSystemdFileSnapshot(filePath, snapshot) {
	if (snapshot === null) {
		await fs.rm(filePath, { force: true });
		return;
	}
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	const rollbackPath = `${filePath}.openclaw-${randomUUID()}.rollback`;
	try {
		await fs.writeFile(rollbackPath, snapshot.contents, {
			flag: "wx",
			mode: snapshot.mode
		});
		await fs.rename(rollbackPath, filePath);
	} finally {
		await fs.unlink(rollbackPath).catch(() => void 0);
	}
}
async function publishSystemdUnit(params) {
	const previous = await readSystemdFileSnapshot(params.unitPath);
	const temporaryPath = `${params.unitPath}.openclaw-${randomUUID()}.tmp`;
	await fs.writeFile(temporaryPath, params.contents, {
		encoding: "utf8",
		flag: "wx",
		mode: previous?.mode ?? 420
	});
	try {
		await assertNoSystemGatewayOwnership(params.env);
		await fs.rename(temporaryPath, params.unitPath);
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
		await fs.unlink(temporaryPath).catch(() => void 0);
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
		await fs.rm(envFilePath, { force: true }).catch(() => void 0);
		return {
			environmentFiles: [],
			environmentKeys
		};
	}
	const content = serializeSystemdEnvironmentFile(merged);
	await fs.mkdir(path.dirname(envFilePath), { recursive: true });
	await fs.writeFile(envFilePath, `${content}\n`, {
		encoding: "utf8",
		mode: 384
	});
	await fs.chmod(envFilePath, 384);
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
		await fs.rm(envFilePath, { force: true });
		return;
	}
	const content = serializeSystemdEnvironmentFile(remaining);
	await fs.writeFile(envFilePath, `${content}\n`, {
		encoding: "utf8",
		mode: 384
	});
	await fs.chmod(envFilePath, 384);
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
		if (result.code === 0 || result.termination !== "exit" || !isSystemdUnitMissingDetail(readSystemctlDetail(result))) return result;
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
	if (args.warn && hasGatewayServiceLauncherOverride(await readSystemdServiceExecStart(args.env).catch(() => null))) args.warn("Systemd drop-in overrides the managed service command or working directory; inspect, update, or remove the drop-in because reinstalling the base unit does not change the effective launcher.");
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
		await fs.unlink(unitPath);
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
			await fs.access(unitPath);
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
			await fs.unlink(unit.unitPath);
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
		await fs.unlink(unitPath);
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
	if (res.termination === "exit" && !isSystemctlMissing(res) && isSystemdUnitNotEnabled(detail)) return false;
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
		const missing = res.termination === "exit" && !installed && isSystemdUnitMissingDetail(detail);
		return {
			status: missing ? "stopped" : "unknown",
			...!missing && detail ? { detail } : {},
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
export { resolveManagedGatewayServiceProcessEnv as _, restartSystemdService as a, uninstallLegacySystemdUnits as c, stageSystemdService as d, uninstallSystemdService as f, resolveManagedGatewayServiceCommand as g, hasGatewayServiceLauncherOverride as h, readSystemdUserLingerStatus as i, uninstallUserSystemdGatewayUnit as l, hasGatewayServiceEnvironmentOverride as m, readSystemdServiceRuntime as n, startSystemdService as o, hasGatewayServiceEnvironmentDifference as p, enableSystemdUserLinger as r, stopSystemdService as s, isSystemdServiceEnabled as t, installSystemdService as u };
