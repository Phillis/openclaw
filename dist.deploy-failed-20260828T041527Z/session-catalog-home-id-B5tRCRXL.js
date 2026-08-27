import { r as root } from "./fs-safe-CmrQUApq.js";
import "./file-access-runtime-DRZWsOJC.js";
import { Dt as isJsonObject } from "./shared-client-DsH0bBjk.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createZstdDecompress } from "node:zlib";
//#region extensions/codex/src/session-catalog-provenance.ts
const MAX_SESSION_META_BYTES = 1024 * 1024;
const SESSION_META_READ_CHUNK_BYTES = 64 * 1024;
const MAX_PROVENANCE_CACHE_ENTRIES = 2e4;
const provenanceByPath = /* @__PURE__ */ new Map();
function cacheProvenance(key, value) {
	provenanceByPath.delete(key);
	provenanceByPath.set(key, value);
	while (provenanceByPath.size > MAX_PROVENANCE_CACHE_ENTRIES) {
		const oldest = provenanceByPath.keys().next().value;
		if (oldest === void 0) break;
		provenanceByPath.delete(oldest);
	}
}
/** Undefined means the metadata line is not durable enough to cache yet. */
async function readCodexSessionMeta(sessionsRoot, rolloutPath, threadId) {
	let safeRoot;
	try {
		safeRoot = await root(sessionsRoot, {
			hardlinks: "reject",
			maxBytes: Number.MAX_SAFE_INTEGER,
			symlinks: "reject"
		});
	} catch {
		return;
	}
	const candidates = rolloutPath.endsWith(".zst") ? [rolloutPath, rolloutPath.slice(0, -4)] : [rolloutPath, `${rolloutPath}.zst`];
	for (const candidate of candidates) {
		let opened;
		try {
			opened = await safeRoot.open(path.relative(sessionsRoot, candidate));
		} catch {
			continue;
		}
		const input = opened.handle.createReadStream({
			autoClose: false,
			highWaterMark: SESSION_META_READ_CHUNK_BYTES
		});
		const reader = candidate.endsWith(".zst") ? input.pipe(createZstdDecompress()) : input;
		try {
			const chunks = [];
			let bytesReadTotal = 0;
			let line;
			for await (const value of reader) {
				const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
				const remaining = MAX_SESSION_META_BYTES - bytesReadTotal;
				if (remaining <= 0) break;
				const bounded = chunk.subarray(0, remaining);
				bytesReadTotal += bounded.length;
				const newline = bounded.indexOf(10);
				chunks.push(newline >= 0 ? bounded.subarray(0, newline) : bounded);
				if (newline >= 0) {
					line = Buffer.concat(chunks).toString("utf8");
					break;
				}
			}
			if (!line) continue;
			let parsed;
			try {
				parsed = JSON.parse(line);
			} catch {
				continue;
			}
			if (!isJsonObject(parsed) || parsed.type !== "session_meta" || !isJsonObject(parsed.payload)) return null;
			const payload = parsed.payload;
			return payload.id === threadId ? payload : null;
		} catch {
			continue;
		} finally {
			reader.destroy();
			input.destroy();
			await opened.handle.close().catch(() => void 0);
		}
	}
}
/**
* Codex 0.147 reports OpenClaw app-server rollouts as `vscode`, so the rollout's
* immutable session metadata is the authoritative historical provenance.
*/
async function isOpenClawManagedCodexThread(thread, localSessionsRoot) {
	const rolloutPath = typeof thread.path === "string" ? thread.path.trim() : "";
	if (!localSessionsRoot || !rolloutPath) return false;
	const cacheKey = `${localSessionsRoot}\0${rolloutPath}`;
	const cached = provenanceByPath.get(cacheKey);
	if (cached !== void 0) return cached;
	const metadata = await readCodexSessionMeta(localSessionsRoot, rolloutPath, thread.id);
	const managed = metadata === void 0 ? void 0 : metadata?.originator === "openclaw";
	if (managed !== void 0) cacheProvenance(cacheKey, managed);
	return managed ?? false;
}
//#endregion
//#region extensions/codex/src/session-catalog-home-id.ts
function canonicalCodexCatalogHome(value) {
	const resolved = path.resolve(value);
	try {
		return fs.realpathSync.native(resolved);
	} catch {
		return resolved;
	}
}
/** One canonical identity for catalog discovery and durable ownership rows. */
function codexCatalogHomeId(codexHome) {
	return createHash("sha256").update("openclaw:codex-session-catalog-home:v1\0").update(canonicalCodexCatalogHome(codexHome)).digest("hex");
}
//#endregion
export { readCodexSessionMeta as i, codexCatalogHomeId as n, isOpenClawManagedCodexThread as r, canonicalCodexCatalogHome as t };
