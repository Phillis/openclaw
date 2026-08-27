import { i as readRegularFileSync } from "./regular-file-Dwz6p59y.js";
import { o as resolveRequiredHomeDir } from "./home-dir-BFvskzn8.js";
import { d as resolveConfigDir } from "./utils-Bw16L5tB.js";
import "./regular-file-C2hsuc07.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { a as normalizeEnvVarKey } from "./host-env-security-B_a4cpNH.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse as parse$1 } from "dotenv";
//#region src/infra/dotenv-global.ts
const logger = createSubsystemLogger("infra:dotenv");
/** Maximum bytes to read from any dotenv file. */
const MAX_DOTENV_FILE_BYTES = 1024 * 1024;
function readDotEnvFile(params) {
	let content;
	try {
		const { buffer } = readRegularFileSync({
			filePath: fs.realpathSync(params.filePath),
			maxBytes: MAX_DOTENV_FILE_BYTES
		});
		content = buffer;
	} catch (error) {
		if (!params.quiet) {
			if ((error && typeof error === "object" && "code" in error ? String(error.code) : void 0) !== "ENOENT") logger.warn(`Failed to read ${params.filePath}: ${String(error)}`, { error });
			if (error instanceof Error && error.message?.startsWith("File exceeds")) logger.warn(`skipping oversized .env file (max ${MAX_DOTENV_FILE_BYTES} bytes): ${params.filePath}`);
		}
		return null;
	}
	const entries = [];
	for (const [rawKey, value] of Object.entries(parse$1(content))) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (key && (params.entryFilter?.(key, value) ?? true)) entries.push({
			key,
			value
		});
	}
	return {
		filePath: params.filePath,
		entries
	};
}
function loadParsedDotEnvFiles(files, overrideKeys) {
	const preExistingKeys = new Set(Object.keys(process.env));
	const canonicalizeKey = (key) => normalizeEnvVarKey(key, { portable: true })?.toUpperCase() ?? null;
	const normalizedOverrideKeys = new Set([...overrideKeys ?? []].flatMap((key) => {
		const normalized = canonicalizeKey(key);
		return normalized ? [normalized] : [];
	}));
	const conflicts = /* @__PURE__ */ new Map();
	const firstSeen = /* @__PURE__ */ new Map();
	const appliedKeysByFile = /* @__PURE__ */ new Map();
	for (const file of files) for (const { key, value } of file.entries) {
		const canonicalKey = canonicalizeKey(key);
		const mayOverride = canonicalKey !== null && normalizedOverrideKeys.has(canonicalKey);
		const precedenceKey = mayOverride && canonicalKey ? canonicalKey : key;
		if (preExistingKeys.has(key) && !mayOverride) continue;
		const previous = firstSeen.get(precedenceKey);
		if (previous) {
			if (previous.value !== value) {
				const conflictKey = `${previous.filePath}\u0000${file.filePath}`;
				const existing = conflicts.get(conflictKey);
				if (existing) existing.keys.add(key);
				else conflicts.set(conflictKey, {
					keptPath: previous.filePath,
					ignoredPath: file.filePath,
					keys: /* @__PURE__ */ new Set([key])
				});
			}
			continue;
		}
		firstSeen.set(precedenceKey, {
			value,
			filePath: file.filePath
		});
		if (process.env[key] === void 0 || mayOverride) {
			if (mayOverride) {
				for (const inheritedKey of preExistingKeys) if (canonicalizeKey(inheritedKey) === canonicalKey) process.env[inheritedKey] = value;
			}
			process.env[key] = value;
			const appliedKeys = appliedKeysByFile.get(file.filePath);
			if (appliedKeys) appliedKeys.push(key);
			else appliedKeysByFile.set(file.filePath, [key]);
		}
	}
	for (const conflict of conflicts.values()) {
		const keys = [...conflict.keys].toSorted();
		if (keys.length === 0) continue;
		logger.warn(`Conflicting values in ${conflict.keptPath} and ${conflict.ignoredPath} for ${keys.join(", ")}; keeping ${conflict.keptPath}.`, {
			keptPath: conflict.keptPath,
			ignoredPath: conflict.ignoredPath,
			keys
		});
	}
	return appliedKeysByFile;
}
/** Load global runtime dotenv files into `process.env` with first-wins precedence. */
function loadGlobalRuntimeDotEnvFiles(opts) {
	const quiet = opts?.quiet ?? true;
	const stateEnvPath = opts?.stateEnvPath ?? path.join(resolveConfigDir(process.env), ".env");
	const globalEnvPaths = [.../* @__PURE__ */ new Set([stateEnvPath, ...opts?.additionalEnvPaths ?? []])];
	const defaultStateEnvPath = path.join(resolveRequiredHomeDir(process.env, os.homedir), ".openclaw", ".env");
	const hasExplicitNonDefaultStateDir = process.env.OPENCLAW_STATE_DIR?.trim() !== void 0 && path.resolve(stateEnvPath) !== path.resolve(defaultStateEnvPath);
	const globalEnvs = globalEnvPaths.map((filePath) => readDotEnvFile({
		entryFilter: opts?.entryFilter,
		filePath,
		quiet
	}));
	const parsedFiles = [...globalEnvs];
	let gatewayEnv = null;
	if (!hasExplicitNonDefaultStateDir) {
		gatewayEnv = readDotEnvFile({
			entryFilter: opts?.entryFilter,
			filePath: path.join(resolveRequiredHomeDir(process.env, os.homedir), ".config", "openclaw", "gateway.env"),
			quiet
		});
		parsedFiles.push(gatewayEnv);
	}
	const parsed = parsedFiles.filter((file) => file !== null);
	const appliedKeysByFile = loadParsedDotEnvFiles(parsed, opts?.overrideKeys);
	return {
		dotenvPresentKeys: [...new Set(parsed.flatMap((file) => file.entries.map(({ key }) => key)))],
		stateEnvAppliedKeys: globalEnvs.flatMap((file) => file ? appliedKeysByFile.get(file.filePath) ?? [] : []),
		gatewayEnvAppliedKeys: gatewayEnv ? appliedKeysByFile.get(gatewayEnv.filePath) ?? [] : []
	};
}
//#endregion
export { readDotEnvFile as n, loadGlobalRuntimeDotEnvFiles as t };
