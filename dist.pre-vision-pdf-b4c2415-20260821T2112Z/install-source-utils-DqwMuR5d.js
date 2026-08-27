import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import "./fs-safe-C9N8pCh1.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { c as resolveNpmJsonEntries } from "./npm-registry-spec-D3pNhy09.js";
import { r as withTempWorkspace } from "./private-temp-workspace-B5dYiPlo.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import { t as applyNpmFreshnessBypassEnv } from "./npm-install-env-DIasXTZP.js";
import path from "node:path";
import fs from "node:fs/promises";
import { gt, satisfies, validRange } from "semver";
//#region src/infra/install-source-utils.ts
/** Converts npm resolution metadata into stable result field names. */
function buildNpmResolutionFields(resolution) {
	return {
		resolvedName: resolution?.name,
		resolvedVersion: resolution?.version,
		resolvedSpec: resolution?.resolvedSpec,
		integrity: resolution?.integrity,
		shasum: resolution?.shasum,
		resolvedAt: resolution?.resolvedAt
	};
}
/** Creates a script-free npm environment for metadata and pack commands. */
function createNpmMetadataEnv(scope = {}) {
	const env = {
		COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
		NPM_CONFIG_IGNORE_SCRIPTS: "true"
	};
	applyNpmFreshnessBypassEnv(env, /* @__PURE__ */ new Date(), scope);
	return env;
}
function resolveNpmSpecVersionSelector(spec) {
	const separator = spec.lastIndexOf("@");
	return separator > 0 ? normalizeOptionalString(spec.slice(separator + 1)) : void 0;
}
function selectNpmViewMetadataEntry(value, spec) {
	if (!Array.isArray(value)) return value;
	const entries = value.filter((entry) => isRecord(entry) && !Array.isArray(entry));
	const selector = resolveNpmSpecVersionSelector(spec);
	const range = selector ? validRange(selector) : null;
	if (range) {
		let best;
		for (const entry of entries) {
			const version = normalizeOptionalString(entry.version);
			if (!version || !satisfies(version, range)) continue;
			if (!best || gt(version, best.version)) best = {
				entry,
				version
			};
		}
		return best?.entry;
	}
	return entries.at(-1);
}
function normalizeNpmViewMetadata(value, spec) {
	const entry = selectNpmViewMetadataEntry(value, spec);
	if (!isRecord(entry) || Array.isArray(entry)) return null;
	const rec = entry;
	const name = normalizeOptionalString(rec.name);
	const version = normalizeOptionalString(rec.version);
	const resolvedSpec = name && version ? `${name}@${version}` : void 0;
	const dist = rec.dist && typeof rec.dist === "object" ? rec.dist : {};
	return {
		name,
		version,
		resolvedSpec,
		integrity: normalizeOptionalString(rec["dist.integrity"]) ?? normalizeOptionalString(dist.integrity),
		shasum: normalizeOptionalString(rec["dist.shasum"]) ?? normalizeOptionalString(dist.shasum),
		...isRecord(rec.openclaw) ? { packageOpenClaw: rec.openclaw } : {}
	};
}
async function resolveNpmSpecMetadata(params) {
	const res = await runCommandWithTimeout([
		"npm",
		"view",
		params.spec,
		"name",
		"version",
		"dist.integrity",
		"dist.shasum",
		"openclaw",
		"--json"
	], {
		timeoutMs: Math.max(params.timeoutMs ?? 6e4, 6e4),
		signal: params.signal,
		killProcessTree: true,
		env: createNpmMetadataEnv()
	});
	if (res.code !== 0) {
		const raw = res.stderr.trim() || res.stdout.trim();
		if (/E404|is not in this registry/i.test(raw)) return {
			ok: false,
			error: `Package not found on npm: ${params.spec}. See https://docs.openclaw.ai/tools/plugin for installable plugins.`
		};
		return {
			ok: false,
			error: `npm view failed: ${raw}`,
			category: "metadata-env"
		};
	}
	try {
		const metadata = normalizeNpmViewMetadata(JSON.parse(res.stdout.trim()), params.spec);
		if (!metadata?.name || !metadata.version) return {
			ok: false,
			error: `npm view produced incomplete package metadata (missing: ${[!metadata?.name ? "name" : null, !metadata?.version ? "version" : null].filter((field) => field !== null).join(", ")})`,
			category: "metadata-env"
		};
		return {
			ok: true,
			metadata
		};
	} catch (err) {
		return {
			ok: false,
			error: `npm view produced invalid JSON: ${String(err)}`,
			category: "metadata-env"
		};
	}
}
/** Runs a callback in a private temp directory and removes it afterward. */
async function withInstallWorkspace(prefix, fn, options) {
	return await withTempWorkspace({
		rootDir: options?.rootDir ?? resolvePreferredOpenClawTmpDir(),
		prefix
	}, async (tmp) => fn(tmp.dir));
}
/** Resolves and validates a user-supplied archive path before extraction. */
async function resolveArchiveSourcePath(archivePath) {
	const resolved = resolveUserPath(archivePath);
	if (!await pathExists(resolved)) return {
		ok: false,
		error: `archive not found: ${resolved}`
	};
	if (!resolveArchiveKind(resolved)) return {
		ok: false,
		error: `unsupported archive: ${resolved}`
	};
	return {
		ok: true,
		path: resolved
	};
}
function parseResolvedSpecFromId(id) {
	const at = id.lastIndexOf("@");
	if (at <= 0 || at >= id.length - 1) return;
	const name = id.slice(0, at).trim();
	const version = id.slice(at + 1).trim();
	if (!name || !version) return;
	return `${name}@${version}`;
}
function normalizeNpmPackEntry(entry) {
	if (!entry || typeof entry !== "object") return null;
	const rec = entry;
	const name = normalizeOptionalString(rec.name);
	const version = normalizeOptionalString(rec.version);
	const id = normalizeOptionalString(rec.id);
	const resolvedSpec = (name && version ? `${name}@${version}` : void 0) ?? (id ? parseResolvedSpecFromId(id) : void 0);
	return {
		filename: normalizeOptionalString(rec.filename),
		metadata: {
			name,
			version,
			resolvedSpec,
			integrity: normalizeOptionalString(rec.integrity),
			shasum: normalizeOptionalString(rec.shasum)
		}
	};
}
function parseNpmPackJsonOutput(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const candidates = [trimmed];
	const arrayStart = trimmed.indexOf("[");
	if (arrayStart > 0) candidates.push(trimmed.slice(arrayStart));
	for (const candidate of candidates) {
		let parsed;
		try {
			parsed = JSON.parse(candidate);
		} catch {
			continue;
		}
		const entries = resolveNpmJsonEntries(parsed);
		let fallback = null;
		for (let i = entries.length - 1; i >= 0; i -= 1) {
			const normalized = normalizeNpmPackEntry(entries[i]);
			if (!normalized) continue;
			if (!fallback) fallback = normalized;
			if (normalized.filename) return normalized;
		}
		if (fallback) return fallback;
	}
	return null;
}
function parsePackedArchiveFromStdout(stdout) {
	const lines = normalizeStringEntries(stdout.split(/\r?\n/));
	for (let index = lines.length - 1; index >= 0; index -= 1) {
		const match = lines[index]?.match(/([^\s"']+\.tgz)/);
		if (match?.[1]) return match[1];
	}
}
async function findPackedArchiveInDir(cwd) {
	const archives = (await fs.readdir(cwd, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile() && entry.name.endsWith(".tgz"));
	if (archives.length === 0) return;
	if (archives.length === 1) return archives[0]?.name;
	const sortedByMtime = await Promise.all(archives.map(async (entry) => ({
		name: entry.name,
		mtimeMs: (await fs.stat(path.join(cwd, entry.name))).mtimeMs
	})));
	sortedByMtime.sort((a, b) => b.mtimeMs - a.mtimeMs);
	return sortedByMtime[0]?.name;
}
/** Packs an npm spec into a tarball in `cwd` and returns archive metadata. */
async function packNpmSpecToArchive(params) {
	const res = await runCommandWithTimeout([
		"npm",
		"pack",
		params.spec,
		"--ignore-scripts",
		"--json"
	], {
		timeoutMs: Math.max(params.timeoutMs, 3e5),
		signal: params.signal,
		killProcessTree: true,
		cwd: params.cwd,
		env: createNpmMetadataEnv({ npmConfigCwd: params.cwd })
	});
	if (res.code !== 0) {
		const raw = res.stderr.trim() || res.stdout.trim();
		if (/E404|is not in this registry/i.test(raw)) return {
			ok: false,
			error: `Package not found on npm: ${params.spec}. See https://docs.openclaw.ai/tools/plugin for installable plugins.`
		};
		return {
			ok: false,
			error: `npm pack failed: ${raw}`
		};
	}
	const parsedJson = parseNpmPackJsonOutput(res.stdout || "");
	let packed = parsedJson?.filename ?? parsePackedArchiveFromStdout(res.stdout || "");
	if (!packed) packed = await findPackedArchiveInDir(params.cwd);
	if (!packed) return {
		ok: false,
		error: "npm pack produced no archive"
	};
	let archivePath = path.isAbsolute(packed) ? packed : path.join(params.cwd, packed);
	if (!await pathExists(archivePath)) {
		const fallbackPacked = await findPackedArchiveInDir(params.cwd);
		if (!fallbackPacked) return {
			ok: false,
			error: "npm pack produced no archive"
		};
		archivePath = path.join(params.cwd, fallbackPacked);
	}
	return {
		ok: true,
		archivePath,
		metadata: parsedJson?.metadata ?? {}
	};
}
/**
* Reads package metadata from an existing npm archive using `npm pack --dry-run`.
* The archive path is validated first so callers get path errors before npm errors.
*/
async function resolveNpmPackArchiveMetadata(params) {
	const archivePathResult = await resolveArchiveSourcePath(params.archivePath);
	if (!archivePathResult.ok) return archivePathResult;
	const archivePath = archivePathResult.path;
	const archiveStat = await fs.stat(archivePath).catch(() => null);
	const archiveMetadataTimeoutMs = archiveStat && archiveStat.size > 100 * 1024 * 1024 ? 3e5 : 6e4;
	const res = await runCommandWithTimeout([
		"npm",
		"pack",
		archivePath,
		"--ignore-scripts",
		"--dry-run",
		"--json"
	], {
		timeoutMs: Math.max(params.timeoutMs ?? archiveMetadataTimeoutMs, archiveMetadataTimeoutMs),
		signal: params.signal,
		killProcessTree: true,
		env: createNpmMetadataEnv()
	});
	if (res.code !== 0) return {
		ok: false,
		error: `npm pack metadata read failed: ${res.stderr.trim() || res.stdout.trim()}`
	};
	const parsedJson = parseNpmPackJsonOutput(res.stdout || "");
	if (!parsedJson?.metadata.name || !parsedJson.metadata.version) return {
		ok: false,
		error: "npm pack metadata read produced incomplete package metadata"
	};
	return {
		ok: true,
		archivePath,
		tarballName: parsedJson.filename ?? path.basename(archivePath),
		metadata: parsedJson.metadata
	};
}
//#endregion
export { resolveNpmPackArchiveMetadata as a, resolveArchiveSourcePath as i, createNpmMetadataEnv as n, resolveNpmSpecMetadata as o, packNpmSpecToArchive as r, withInstallWorkspace as s, buildNpmResolutionFields as t };
