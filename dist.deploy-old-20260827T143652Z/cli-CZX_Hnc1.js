import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { R as timestampMsToIsoString, w as parseStrictPositiveInteger, y as parseDateStringTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord, r as asNullableRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.js";
import { s as normalizeSingleOrTrimmedStringList, u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import { r as root } from "./fs-safe-C9N8pCh1.js";
import { t as appendRegularFile } from "./regular-file-CXw3t-8J.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { t as replaceFileAtomic } from "./replace-file-sXUFaaUi.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { n as runExec } from "./exec-BL80Wdzl.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { u as readFiniteNumberParam } from "./common-BGOZLJ2_.js";
import { i as getMemoryCapabilityRegistration, s as listActiveMemoryPublicArtifacts } from "./memory-state-DhEOmKyi.js";
import { r as retryTransientMemoryRead } from "./hash-DEc9Q4-Q.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./retry-runtime-ELyDVNAC.js";
import "./routing-DG_rmd7A.js";
import "./process-runtime-BTtGkRx5.js";
import "./text-utility-runtime-LRU688AB.js";
import "./security-runtime-Bm9RUgAZ.js";
import "./concurrency-runtime-BCAEiezh.js";
import { n as callGatewayFromCli } from "./gateway-rpc-CWthRV-m.js";
import "./gateway-runtime-Vk_KkezP.js";
import "./memory-core-host-engine-storage-BgooD0hf.js";
import "./memory-host-core-BtXcl9nj.js";
import { n as withTrailingNewline, t as replaceManagedMarkdownBlock } from "./memory-host-markdown-mHNl3RAL.js";
import { r as getActiveMemorySearchManager } from "./memory-host-search-Cusa86Hu.js";
import "./param-readers-BF3rNe0k.js";
import { t as filterMemorySearchHitsBySessionVisibility } from "./session-search-visibility-OTWJUhJ3.js";
import "./api-D6snnOyl.js";
import { A as normalizeWikiClaims, B as activateMemoryWikiCompiledCacheOwner, C as WIKI_RAW_SOURCE_MARKER, D as formatWikiLink, E as createWikiPageFilename, F as scanWikiPageSummary, G as invalidateMemoryWikiCompiledCache, H as createMemoryWikiCompiledCachePublicationId, I as slugifyWikiPageStem, J as resolveMemoryWikiCompiledCacheGeneration, K as loadMemoryWikiCompiledCache, L as slugifyWikiSegment, M as preserveHumanNotesBlock, N as renderMarkdownFence, O as isUnmanagedRawSourceSummary, P as renderWikiMarkdown, R as toWikiPageSummary, S as writeMemoryWikiSourceSyncState, T as WIKI_RELATED_START_MARKER, X as writeMemoryWikiCompiledCache, Z as walkMemoryWikiDirectory, b as setImportedSourceEntry, c as readMemoryWikiImportRunRecord, g as pruneImportedSourceEntries, i as countMemoryWikiImportRunStateRows, j as parseWikiMarkdown, k as normalizeSourceIds, l as resolveMemoryWikiImportRunsDir, p as assertMemoryWikiSourceSyncStateCapacity, q as reconcileMemoryWikiCompiledCacheOwner, t as MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES, u as writeMemoryWikiImportRunRecord, v as readMemoryWikiSourceSyncState, w as WIKI_RELATED_END_MARKER, x as shouldSkipImportedSourceWrite } from "./import-runs-state-BskUjckn.js";
import { i as resolveMemoryWikiAgentConfig, n as WIKI_SEARCH_CORPORA, t as WIKI_SEARCH_BACKENDS } from "./config-DHF0hC42.js";
import { createHash, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { AsyncLocalStorage } from "node:async_hooks";
import pMap, { pMapSkip } from "p-map";
//#region extensions/memory-wiki/src/claim-health.ts
const DAY_MS = 1440 * 60 * 1e3;
const WIKI_STALE_DAYS = 90;
const CONTESTED_CLAIM_STATUSES = /* @__PURE__ */ new Set([
	"contested",
	"contradicted",
	"refuted",
	"superseded"
]);
function parseTimestamp(value) {
	return parseDateStringTimestampMs(value) ?? null;
}
function clampDaysSinceTouch(daysSinceTouch) {
	return Math.max(0, daysSinceTouch);
}
function normalizeClaimTextKey(text) {
	return normalizeLowercaseStringOrEmpty(text.replace(/\s+/g, " "));
}
function normalizeTextKey(text) {
	return normalizeLowercaseStringOrEmpty(text).replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").replace(/\s+/g, " ");
}
function buildFreshnessFromTimestamp(params) {
	const now = params.now ?? /* @__PURE__ */ new Date();
	const timestampMs = parseTimestamp(params.timestamp);
	if (timestampMs === null || !params.timestamp) return {
		level: "unknown",
		reason: "missing updatedAt"
	};
	const daysSinceTouch = clampDaysSinceTouch(Math.floor((now.getTime() - timestampMs) / DAY_MS));
	if (daysSinceTouch >= WIKI_STALE_DAYS) return {
		level: "stale",
		reason: `last touched ${params.timestamp}`,
		daysSinceTouch,
		lastTouchedAt: params.timestamp
	};
	if (daysSinceTouch >= 30) return {
		level: "aging",
		reason: `last touched ${params.timestamp}`,
		daysSinceTouch,
		lastTouchedAt: params.timestamp
	};
	return {
		level: "fresh",
		reason: `last touched ${params.timestamp}`,
		daysSinceTouch,
		lastTouchedAt: params.timestamp
	};
}
function resolveLatestTimestamp(candidates) {
	let bestValue;
	let bestMs = -1;
	for (const candidate of candidates) {
		const parsed = parseTimestamp(candidate);
		if (parsed === null || !candidate || parsed <= bestMs) continue;
		bestMs = parsed;
		bestValue = candidate;
	}
	return bestValue;
}
function normalizeClaimStatus(status) {
	return normalizeLowercaseStringOrEmpty(status) || "supported";
}
function isClaimContestedStatus(status) {
	return CONTESTED_CLAIM_STATUSES.has(normalizeClaimStatus(status));
}
function assessPageFreshness(page, now) {
	return buildFreshnessFromTimestamp({
		timestamp: page.updatedAt,
		now
	});
}
function assessClaimFreshness(params) {
	let hasClaimTimestamp = typeof params.claim.updatedAt === "string" && params.claim.updatedAt.trim().length > 0;
	let latestTimestamp = resolveLatestTimestamp([params.claim.updatedAt]);
	let latestMs = parseTimestamp(latestTimestamp) ?? -1;
	for (const evidence of params.claim.evidence) {
		if (typeof evidence.updatedAt === "string" && evidence.updatedAt.trim().length > 0) hasClaimTimestamp = true;
		const evidenceMs = parseTimestamp(evidence.updatedAt);
		if (evidenceMs === null || !evidence.updatedAt || evidenceMs <= latestMs) continue;
		latestMs = evidenceMs;
		latestTimestamp = evidence.updatedAt;
	}
	return buildFreshnessFromTimestamp({
		timestamp: latestTimestamp ?? (hasClaimTimestamp ? void 0 : params.page.updatedAt),
		now: params.now
	});
}
function buildWikiClaimHealth(params) {
	const claimId = params.claim.id?.trim();
	return {
		key: `${params.page.relativePath}#${claimId ?? `claim-${params.index + 1}`}`,
		pagePath: params.page.relativePath,
		pageTitle: params.page.title,
		...params.page.id ? { pageId: params.page.id } : {},
		...claimId ? { claimId } : {},
		text: params.claim.text,
		status: normalizeClaimStatus(params.claim.status),
		...typeof params.claim.confidence === "number" ? { confidence: params.claim.confidence } : {},
		evidenceCount: params.claim.evidence.length,
		missingEvidence: params.claim.evidence.length === 0,
		freshness: assessClaimFreshness({
			page: params.page,
			claim: params.claim,
			now: params.now
		})
	};
}
function collectWikiClaimHealth(pages, now) {
	return pages.flatMap((page) => page.claims.map((claim, index) => buildWikiClaimHealth({
		page,
		claim,
		index,
		now
	})));
}
function buildClaimContradictionClusters(params) {
	const claimHealth = collectWikiClaimHealth(params.pages, params.now);
	const byId = /* @__PURE__ */ new Map();
	for (const claim of claimHealth) {
		if (!claim.claimId) continue;
		const current = byId.get(claim.claimId) ?? [];
		current.push(claim);
		byId.set(claim.claimId, current);
	}
	return [...byId.entries()].flatMap(([claimId, entries]) => {
		if (entries.length < 2) return [];
		const distinctTexts = new Set(entries.map((entry) => normalizeClaimTextKey(entry.text)));
		const distinctStatuses = new Set(entries.map((entry) => entry.status));
		if (distinctTexts.size < 2 && distinctStatuses.size < 2) return [];
		return [{
			key: claimId,
			label: claimId,
			entries: [...entries].toSorted((left, right) => left.pagePath.localeCompare(right.pagePath))
		}];
	}).toSorted((left, right) => left.label.localeCompare(right.label));
}
function buildPageContradictionClusters(pages) {
	const byNote = /* @__PURE__ */ new Map();
	for (const page of pages) for (const note of page.contradictions) {
		const key = normalizeTextKey(note);
		if (!key) continue;
		const current = byNote.get(key) ?? [];
		current.push({
			pagePath: page.relativePath,
			pageTitle: page.title,
			...page.id ? { pageId: page.id } : {},
			note
		});
		byNote.set(key, current);
	}
	return [...byNote.entries()].map(([key, entries]) => ({
		key,
		label: entries[0]?.note ?? key,
		entries: [...entries].toSorted((left, right) => left.pagePath.localeCompare(right.pagePath))
	})).toSorted((left, right) => left.label.localeCompare(right.label));
}
//#endregion
//#region extensions/memory-wiki/src/log.ts
const VAULT_GENERATION_FIELD = "vaultGeneration";
const COMPILED_CACHE_RESERVATION_ID_FIELD = "compiledCacheReservationId";
const COMPILED_CACHE_PUBLICATION_ID_FIELD = "compiledCachePublicationId";
const COMPILED_CACHE_PARENT_PUBLICATION_ID_FIELD = "compiledCacheParentPublicationId";
const COMPILED_CACHE_SOURCE_GENERATION_FIELD = "compiledCacheSourceGeneration";
const COMPILED_SOURCE_DIRECTORIES = [
	"sources",
	"entities",
	"concepts",
	"syntheses",
	"reports"
];
async function appendMemoryWikiLog(vaultRoot, entry) {
	const logPath = path.join(vaultRoot, ".openclaw-wiki", "log.jsonl");
	await fs$1.mkdir(path.dirname(logPath), { recursive: true });
	await appendRegularFile({
		filePath: logPath,
		content: `${JSON.stringify(entry)}\n`,
		rejectSymlinkParents: true
	});
}
async function loadMemoryWikiVaultIdentity(vaultRoot) {
	let raw;
	try {
		raw = await fs$1.readFile(path.join(vaultRoot, ".openclaw-wiki", "log.jsonl"), "utf8");
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") return {
			vaultGeneration: null,
			compiledCacheReservationId: null,
			compiledCachePublicationId: null,
			compiledCacheSourceGeneration: null
		};
		throw error;
	}
	let vaultGeneration = null;
	let compiledCacheReservationId = null;
	let compiledCachePublicationId = null;
	let compiledCacheSourceGeneration = null;
	for (const line of raw.split(/\r?\n/)) try {
		const parsed = JSON.parse(line);
		const candidateVaultGeneration = parsed.details?.[VAULT_GENERATION_FIELD];
		if (!vaultGeneration && typeof candidateVaultGeneration === "string" && candidateVaultGeneration.trim()) vaultGeneration = candidateVaultGeneration.trim();
		const candidateReservationId = parsed.details?.[COMPILED_CACHE_RESERVATION_ID_FIELD];
		const normalizedReservationId = typeof candidateReservationId === "string" && candidateReservationId.trim() ? candidateReservationId.trim() : void 0;
		const candidateCompiledCachePublicationId = parsed.details?.[COMPILED_CACHE_PUBLICATION_ID_FIELD];
		if (typeof candidateCompiledCachePublicationId === "string" && candidateCompiledCachePublicationId.trim()) {
			const candidateParent = parsed.details?.[COMPILED_CACHE_PARENT_PUBLICATION_ID_FIELD];
			const normalizedParent = candidateParent === null ? null : typeof candidateParent === "string" && candidateParent.trim() ? candidateParent.trim() : void 0;
			const candidateSourceGeneration = parsed.details?.[COMPILED_CACHE_SOURCE_GENERATION_FIELD];
			const normalizedSourceGeneration = typeof candidateSourceGeneration === "string" && candidateSourceGeneration.trim() ? candidateSourceGeneration.trim() : void 0;
			if (normalizedParent === compiledCachePublicationId && normalizedReservationId === compiledCacheReservationId && normalizedSourceGeneration) {
				compiledCachePublicationId = candidateCompiledCachePublicationId.trim();
				compiledCacheSourceGeneration = normalizedSourceGeneration;
			}
		} else if (normalizedReservationId) compiledCacheReservationId = normalizedReservationId;
	} catch {}
	return {
		vaultGeneration,
		compiledCacheReservationId,
		compiledCachePublicationId,
		compiledCacheSourceGeneration
	};
}
async function resolveMemoryWikiVaultSourceGeneration(vaultRoot) {
	const files = (await Promise.all(COMPILED_SOURCE_DIRECTORIES.map(async (relativeDir) => {
		return (await walkMemoryWikiDirectory(vaultRoot, relativeDir)).filter((entry) => entry.kind === "file" && entry.relativePath.endsWith(".md")).map((entry) => {
			return {
				absolutePath: path.join(vaultRoot, entry.relativePath),
				relativePath: entry.relativePath.split(path.sep).join("/")
			};
		}).filter((entry) => path.basename(entry.relativePath) !== "index.md");
	}))).flat().toSorted((left, right) => left.relativePath.localeCompare(right.relativePath));
	const hash = createHash("sha256");
	for (const file of files) {
		const relativePath = Buffer.from(file.relativePath);
		const pathLength = Buffer.allocUnsafe(4);
		pathLength.writeUInt32BE(relativePath.byteLength);
		const contentDigest = createHash("sha256").update(await fs$1.readFile(file.absolutePath)).digest();
		hash.update(pathLength).update(relativePath).update(contentDigest);
	}
	return hash.digest("hex");
}
async function loadMemoryWikiValidatedVaultIdentity(vaultRoot) {
	const identity = await loadMemoryWikiVaultIdentity(vaultRoot);
	if (!identity.compiledCachePublicationId || !identity.compiledCacheSourceGeneration) return identity;
	if (await resolveMemoryWikiVaultSourceGeneration(vaultRoot) === identity.compiledCacheSourceGeneration) return identity;
	return {
		...identity,
		compiledCachePublicationId: null,
		compiledCacheSourceGeneration: null
	};
}
async function loadMemoryWikiVaultGeneration(vaultRoot) {
	return (await loadMemoryWikiVaultIdentity(vaultRoot)).vaultGeneration;
}
async function ensureMemoryWikiVaultGeneration(vaultRoot) {
	const existing = await loadMemoryWikiVaultGeneration(vaultRoot);
	if (existing) return existing;
	const candidate = randomUUID();
	await appendMemoryWikiLog(vaultRoot, {
		type: "vault-generation",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: { [VAULT_GENERATION_FIELD]: candidate }
	});
	return await loadMemoryWikiVaultGeneration(vaultRoot) ?? candidate;
}
//#endregion
//#region extensions/memory-wiki/src/mutation-coordinator.ts
const activeVaultMutations = new AsyncLocalStorage();
const vaultMutationQueue = new KeyedAsyncQueue();
const MAX_CACHED_VAULT_KEYS = 256;
const canonicalVaultKeys = /* @__PURE__ */ new Map();
function normalizeCanonicalVaultKey(vaultPath) {
	return process.platform === "win32" ? vaultPath.toLowerCase() : vaultPath;
}
async function resolveCanonicalVaultKey(resolvedPath) {
	const suffix = [];
	let candidate = resolvedPath;
	while (true) try {
		const existingPath = await fs$1.realpath(candidate);
		return normalizeCanonicalVaultKey(path.join(existingPath, ...suffix));
	} catch (error) {
		const code = error.code;
		const parent = path.dirname(candidate);
		if (code !== "ENOENT" && code !== "ENOTDIR" || parent === candidate) return normalizeCanonicalVaultKey(resolvedPath);
		suffix.unshift(path.basename(candidate));
		candidate = parent;
	}
}
async function resolveMemoryWikiVaultMutationKey(vaultPath) {
	const resolvedPath = path.resolve(vaultPath);
	const cached = canonicalVaultKeys.get(resolvedPath);
	if (cached) return await cached;
	const canonical = resolveCanonicalVaultKey(resolvedPath);
	if (canonicalVaultKeys.size >= MAX_CACHED_VAULT_KEYS) {
		const oldest = canonicalVaultKeys.keys().next().value;
		if (oldest) canonicalVaultKeys.delete(oldest);
	}
	canonicalVaultKeys.set(resolvedPath, canonical);
	return await canonical;
}
/**
* Keep coordinated vault read-modify-write transactions isolated from concurrent work in this process.
* Nested compile calls re-enter; different agent vaults remain parallel.
*/
async function withMemoryWikiVaultMutation(vaultPath, mutation) {
	const key = await resolveMemoryWikiVaultMutationKey(vaultPath);
	const active = activeVaultMutations.getStore();
	if (active?.get(key)?.active) return await mutation();
	const lease = { active: true };
	const nextActive = new Map(active ?? []);
	nextActive.set(key, lease);
	return await vaultMutationQueue.enqueue(key, async () => {
		try {
			return await activeVaultMutations.run(nextActive, mutation);
		} finally {
			lease.active = false;
		}
	});
}
//#endregion
//#region extensions/memory-wiki/src/time.ts
function resolveMemoryWikiTimestamp(nowMs) {
	return timestampMsToIsoString(nowMs) ?? timestampMsToIsoString(Date.now()) ?? (/* @__PURE__ */ new Date()).toISOString();
}
//#endregion
//#region extensions/memory-wiki/src/vault.ts
const WIKI_VAULT_DIRECTORIES = [
	"entities",
	"concepts",
	"syntheses",
	"sources",
	"reports",
	"_attachments",
	"_views",
	".openclaw-wiki"
];
const WIKI_VAULT_SCAFFOLD = [
	"AGENTS.md",
	"WIKI.md",
	"index.md",
	".openclaw-wiki/log.jsonl"
];
function buildIndexMarkdown() {
	return withTrailingNewline(replaceManagedMarkdownBlock({
		original: "# Wiki Index\n",
		heading: "## Generated",
		startMarker: "<!-- openclaw:wiki:index:start -->",
		endMarker: "<!-- openclaw:wiki:index:end -->",
		body: "- No compiled pages yet."
	}));
}
function buildAgentsMarkdown() {
	return withTrailingNewline(`\
# Memory Wiki Agent Guide

- Treat generated blocks as plugin-owned.
- Preserve human notes outside managed markers.
- Prefer source-backed claims over wiki-to-wiki citation loops.
- Prefer structured \`claims\` with evidence over burying key beliefs only in prose.
- Use the wiki tools for machine reads; Markdown pages are the human view.
`);
}
function buildWikiOverviewMarkdown(config) {
	return withTrailingNewline(`\
# Memory Wiki

This vault is maintained by the OpenClaw memory-wiki plugin.

- Vault mode: \`${config.vaultMode}\`
- Render mode: \`${config.vault.renderMode}\`
- Search corpus default: \`${config.search.corpus}\`

## Architecture
- Raw sources remain the evidence layer.
- To keep unmanaged raw Markdown in \`sources/\`, add \`${WIKI_RAW_SOURCE_MARKER}\` near the top of the page.
- Wiki pages are the human-readable synthesis layer.
- Compiled query and prompt snapshots live in OpenClaw plugin state, not vault files.

## Notes
<!-- openclaw:human:start -->
<!-- openclaw:human:end -->
`);
}
async function writeFileIfMissing(rootDir, relativePath, content, createdFiles) {
	const root$6 = await root(rootDir);
	try {
		await root$6.create(relativePath, content);
	} catch (err) {
		if (err instanceof FsSafeError && err.code === "already-exists") return;
		throw err;
	}
	createdFiles.push(path.join(rootDir, relativePath));
}
async function initializeMemoryWikiVault(config, options) {
	const rootDir = config.vault.path;
	const createdDirectories = [];
	const createdFiles = [];
	if (!await pathExists(rootDir)) createdDirectories.push(rootDir);
	await fs$1.mkdir(rootDir, { recursive: true });
	if (!(await Promise.all(WIKI_VAULT_SCAFFOLD.map((relativePath) => pathExists(path.join(rootDir, relativePath))))).every(Boolean)) await invalidateMemoryWikiCompiledCache(config);
	for (const relativeDir of WIKI_VAULT_DIRECTORIES) {
		const fullPath = path.join(rootDir, relativeDir);
		if (!await pathExists(fullPath)) createdDirectories.push(fullPath);
		await fs$1.mkdir(fullPath, { recursive: true });
	}
	await writeFileIfMissing(rootDir, "AGENTS.md", buildAgentsMarkdown(), createdFiles);
	await writeFileIfMissing(rootDir, "WIKI.md", buildWikiOverviewMarkdown(config), createdFiles);
	await writeFileIfMissing(rootDir, "index.md", buildIndexMarkdown(), createdFiles);
	await writeFileIfMissing(rootDir, "inbox.md", withTrailingNewline("# Inbox\n\nDrop raw ideas, questions, and source links here.\n"), createdFiles);
	await writeFileIfMissing(rootDir, ".openclaw-wiki/log.jsonl", "", createdFiles);
	if (createdDirectories.length > 0 || createdFiles.length > 0) await appendMemoryWikiLog(rootDir, {
		type: "init",
		timestamp: resolveMemoryWikiTimestamp(options?.nowMs),
		details: {
			createdDirectories: createdDirectories.map((dir) => path.relative(rootDir, dir) || "."),
			createdFiles: createdFiles.map((file) => path.relative(rootDir, file))
		}
	});
	await ensureMemoryWikiVaultGeneration(rootDir);
	await activateExistingMemoryWikiVault(config);
	return {
		rootDir,
		created: createdDirectories.length > 0 || createdFiles.length > 0,
		createdDirectories,
		createdFiles
	};
}
async function activateExistingMemoryWikiVault(config) {
	const rootDir = config.vault.path;
	const identity = await loadMemoryWikiValidatedVaultIdentity(rootDir);
	if (!identity.vaultGeneration) throw new Error(`Memory Wiki vault generation is missing: ${rootDir}`);
	activateMemoryWikiCompiledCacheOwner(config, identity.vaultGeneration, identity.compiledCachePublicationId);
	await reconcileMemoryWikiCompiledCacheOwner(config, () => loadMemoryWikiValidatedVaultIdentity(rootDir));
}
//#endregion
//#region extensions/memory-wiki/src/compile.ts
const COMPILE_PAGE_GROUPS = [
	{
		kind: "source",
		dir: "sources",
		heading: "Sources"
	},
	{
		kind: "entity",
		dir: "entities",
		heading: "Entities"
	},
	{
		kind: "concept",
		dir: "concepts",
		heading: "Concepts"
	},
	{
		kind: "synthesis",
		dir: "syntheses",
		heading: "Syntheses"
	},
	{
		kind: "report",
		dir: "reports",
		heading: "Reports"
	}
];
const READ_PAGE_SUMMARIES_CONCURRENCY = 16;
const MAX_RELATED_PAGES_PER_SECTION = 12;
const MAX_SHARED_SOURCE_FANOUT = 24;
const DASHBOARD_PAGES = [
	{
		id: "report.open-questions",
		title: "Open Questions",
		relativePath: "reports/open-questions.md",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			const matches = pages.filter((page) => page.questions.length > 0);
			if (matches.length === 0) return "- No open questions right now.";
			return [
				`- Pages with open questions: ${matches.length}`,
				"",
				...matches.map((page) => `- ${formatWikiLink({
					renderMode: config.vault.renderMode,
					relativePath: page.relativePath,
					sourceRelativeTo,
					title: page.title
				})}: ${page.questions.join(" | ")}`)
			].join("\n");
		}
	},
	{
		id: "report.contradictions",
		title: "Contradictions",
		relativePath: "reports/contradictions.md",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			const pageClusters = buildPageContradictionClusters(pages);
			const claimClusters = buildClaimContradictionClusters({
				pages,
				now
			});
			if (pageClusters.length === 0 && claimClusters.length === 0) return "- No contradictions flagged right now.";
			const lines = [`- Contradiction note clusters: ${pageClusters.length}`, `- Competing claim clusters: ${claimClusters.length}`];
			if (pageClusters.length > 0) {
				lines.push("", "### Page Notes");
				for (const cluster of pageClusters) lines.push(formatPageContradictionClusterLine(config, cluster, sourceRelativeTo));
			}
			if (claimClusters.length > 0) {
				lines.push("", "### Claim Clusters");
				for (const cluster of claimClusters) lines.push(formatClaimContradictionClusterLine(config, cluster, sourceRelativeTo));
			}
			return lines.join("\n");
		}
	},
	{
		id: "report.low-confidence",
		title: "Low Confidence",
		relativePath: "reports/low-confidence.md",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			const pageMatches = pages.filter((page) => typeof page.confidence === "number" && page.confidence < .5).toSorted((left, right) => (left.confidence ?? 1) - (right.confidence ?? 1));
			const claimMatches = collectWikiClaimHealth(pages, now).filter((claim) => typeof claim.confidence === "number" && claim.confidence < .5).toSorted((left, right) => (left.confidence ?? 1) - (right.confidence ?? 1));
			if (pageMatches.length === 0 && claimMatches.length === 0) return "- No low-confidence pages or claims right now.";
			const lines = [`- Low-confidence pages: ${pageMatches.length}`, `- Low-confidence claims: ${claimMatches.length}`];
			if (pageMatches.length > 0) {
				lines.push("", "### Pages");
				for (const page of pageMatches) lines.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: confidence ${(page.confidence ?? 0).toFixed(2)}`);
			}
			if (claimMatches.length > 0) {
				lines.push("", "### Claims");
				for (const claim of claimMatches) lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
			}
			return lines.join("\n");
		}
	},
	{
		id: "report.claim-health",
		title: "Claim Health",
		relativePath: "reports/claim-health.md",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			const claimHealth = collectWikiClaimHealth(pages, now);
			const missingEvidence = claimHealth.filter((claim) => claim.missingEvidence);
			const contestedClaims = claimHealth.filter((claim) => isClaimHealthContested(claim));
			const staleClaims = claimHealth.filter((claim) => claim.freshness.level === "stale" || claim.freshness.level === "unknown");
			if (missingEvidence.length === 0 && contestedClaims.length === 0 && staleClaims.length === 0) return "- No claim health issues right now.";
			const lines = [
				`- Claims missing evidence: ${missingEvidence.length}`,
				`- Contested claims: ${contestedClaims.length}`,
				`- Stale or unknown claims: ${staleClaims.length}`
			];
			if (missingEvidence.length > 0) {
				lines.push("", "### Missing Evidence");
				for (const claim of missingEvidence) lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
			}
			if (contestedClaims.length > 0) {
				lines.push("", "### Contested Claims");
				for (const claim of contestedClaims) lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
			}
			if (staleClaims.length > 0) {
				lines.push("", "### Stale Claims");
				for (const claim of staleClaims) lines.push(`- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
			}
			return lines.join("\n");
		}
	},
	{
		id: "report.stale-pages",
		title: "Stale Pages",
		relativePath: "reports/stale-pages.md",
		buildBody: ({ config, managedImportedSourcePagePaths, pages, now, sourceRelativeTo }) => {
			const matches = pages.filter((page) => page.kind !== "report" && page.kind !== "concept" && page.kind !== "synthesis" && !(isUnmanagedRawSourceSummary(page) && !managedImportedSourcePagePaths.has(page.relativePath))).flatMap((page) => {
				const freshness = assessPageFreshness(page, now);
				if (freshness.level === "fresh") return [];
				return [{
					page,
					freshness
				}];
			}).toSorted((left, right) => left.page.title.localeCompare(right.page.title));
			if (matches.length === 0) return `- No aging or stale pages older than 30 days.`;
			return [
				`- Stale pages: ${matches.length}`,
				"",
				...matches.map(({ page, freshness }) => `- ${formatPageLink(config, page, sourceRelativeTo)}: ${formatFreshnessLabel(freshness)}`)
			].join("\n");
		}
	},
	{
		id: "report.person-agent-directory",
		title: "Person Agent Directory",
		relativePath: "reports/person-agent-directory.md",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			const matches = pages.filter((page) => page.kind !== "report" && isPersonLikePage(page)).toSorted((left, right) => left.title.localeCompare(right.title));
			if (matches.length === 0) return "- No person-like entity pages with agent cards yet.";
			const lines = [`- People with routing metadata: ${matches.length}`];
			for (const page of matches) {
				const freshness = assessPageFreshness(page, now);
				lines.push(`- ${formatPersonDirectoryLine(config, page, freshness, sourceRelativeTo)}`);
			}
			return lines.join("\n");
		}
	},
	{
		id: "report.relationship-graph",
		title: "Relationship Graph",
		relativePath: "reports/relationship-graph.md",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			const relationships = pages.flatMap((page) => page.relationships.map((relationship) => ({
				page,
				relationship
			}))).toSorted((left, right) => {
				const leftTitle = left.relationship.targetTitle ?? left.relationship.targetId ?? "";
				const rightTitle = right.relationship.targetTitle ?? right.relationship.targetId ?? "";
				return `${left.page.title} ${leftTitle}`.localeCompare(`${right.page.title} ${rightTitle}`);
			});
			if (relationships.length === 0) return "- No structured relationships yet.";
			return [
				`- Structured relationships: ${relationships.length}`,
				"",
				...relationships.map(({ page, relationship }) => `- ${formatRelationshipLine(config, page, relationship, sourceRelativeTo)}`)
			].join("\n");
		}
	},
	{
		id: "report.provenance-coverage",
		title: "Provenance Coverage",
		relativePath: "reports/provenance-coverage.md",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			const evidenceEntries = pages.flatMap((page) => page.claims.flatMap((claim) => claim.evidence.map((evidence) => ({
				page,
				claim,
				evidence
			}))));
			const missingEvidence = pages.flatMap((page) => page.claims.filter((claim) => claim.evidence.length === 0).map((claim) => ({
				page,
				claim
			})));
			if (evidenceEntries.length === 0 && missingEvidence.length === 0) return "- No structured claims with provenance coverage yet.";
			const kindCounts = countBy(evidenceEntries.map(({ evidence }) => evidence.kind ?? "unspecified"));
			const sourceCounts = countBy(evidenceEntries.map(({ evidence }) => evidence.sourceId ?? evidence.path ?? "inline"));
			const lines = [
				`- Evidence entries: ${evidenceEntries.length}`,
				`- Claims missing evidence: ${missingEvidence.length}`,
				"",
				"### Evidence Classes",
				...formatCountLines(kindCounts),
				"",
				"### Top Evidence Sources",
				...formatCountLines(sourceCounts).slice(0, 20)
			];
			if (missingEvidence.length > 0) {
				lines.push("", "### Missing Evidence");
				for (const { page, claim } of missingEvidence) lines.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: ${formatClaimIdentityForPage(claim)}`);
			}
			return lines.join("\n");
		}
	},
	{
		id: "report.privacy-review",
		title: "Privacy Review",
		relativePath: "reports/privacy-review.md",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			const entries = collectPrivacyReviewEntries(config, pages, sourceRelativeTo);
			if (entries.length === 0) return "- No non-public privacy tiers flagged right now.";
			return [
				`- Privacy review entries: ${entries.length}`,
				"",
				...entries
			].join("\n");
		}
	}
];
async function collectMarkdownFiles(rootDir, relativeDir) {
	return (await walkMemoryWikiDirectory(rootDir, relativeDir)).filter((entry) => entry.kind === "file" && entry.relativePath.endsWith(".md")).map((entry) => entry.relativePath.split(path.sep).join("/")).filter((relativePath) => path.basename(relativePath) !== "index.md").toSorted((left, right) => left.localeCompare(right));
}
async function readPageSummaries(rootDir) {
	const readResult = await runTasksWithConcurrency({
		tasks: (await Promise.all(COMPILE_PAGE_GROUPS.map((group) => collectMarkdownFiles(rootDir, group.dir)))).flat().map((relativePath) => async () => {
			const absolutePath = path.join(rootDir, relativePath);
			return scanWikiPageSummary({
				absolutePath,
				relativePath,
				raw: await retryTransientMemoryRead(() => fs$1.readFile(absolutePath, "utf8"), `read wiki page ${absolutePath}`)
			});
		}),
		limit: READ_PAGE_SUMMARIES_CONCURRENCY,
		errorMode: "stop"
	});
	if (readResult.hasError) throw readResult.firstError;
	return {
		pages: readResult.results.flatMap((result) => result.status === "valid" ? [result.page] : []).toSorted((left, right) => left.title.localeCompare(right.title)),
		frontmatterErrors: readResult.results.flatMap((result) => result.status === "invalid-frontmatter" ? [result.error] : [])
	};
}
function buildPageCounts(pages) {
	return {
		entity: pages.filter((page) => page.kind === "entity").length,
		concept: pages.filter((page) => page.kind === "concept").length,
		source: pages.filter((page) => page.kind === "source").length,
		synthesis: pages.filter((page) => page.kind === "synthesis").length,
		report: pages.filter((page) => page.kind === "report").length
	};
}
function formatPageLink(config, page, sourceRelativeTo) {
	return formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: page.relativePath,
		sourceRelativeTo,
		title: page.title
	});
}
function formatFreshnessLabel(freshness) {
	switch (freshness.level) {
		case "fresh": return `fresh (${freshness.lastTouchedAt ?? "recent"})`;
		case "aging": return `aging (${freshness.lastTouchedAt ?? "unknown"})`;
		case "stale": return `stale (${freshness.lastTouchedAt ?? "unknown"})`;
		case "unknown": return freshness.reason;
	}
	throw new Error("Unsupported wiki freshness level");
}
function formatListPreview(values, maxItems = 3) {
	if (values.length === 0) return null;
	const shown = values.slice(0, maxItems).join(", ");
	return values.length > maxItems ? `${shown}, +${values.length - maxItems}` : shown;
}
function formatMaybeDetail(label, value) {
	return value ? `${label} ${value}` : null;
}
function isPersonLikePage(page) {
	const entityType = normalizeLowercaseStringOrEmpty(page.entityType);
	const pageType = normalizeLowercaseStringOrEmpty(page.pageType);
	return Boolean(page.personCard) || entityType === "person" || entityType === "maintainer" || pageType === "person" || pageType === "maintainer";
}
function formatPersonDirectoryLine(config, page, freshness, sourceRelativeTo) {
	const card = page.personCard;
	const details = [
		formatMaybeDetail("id", page.canonicalId ?? card?.canonicalId ?? page.id),
		formatMaybeDetail("aliases", formatListPreview(page.aliases)),
		formatMaybeDetail("handles", formatListPreview(card?.handles ?? [])),
		formatMaybeDetail("lane", card?.lane),
		formatMaybeDetail("ask", formatListPreview(card?.askFor ?? [])),
		formatMaybeDetail("best", formatListPreview([...page.bestUsedFor, ...card?.bestUsedFor ?? []])),
		formatMaybeDetail("privacy", page.privacyTier ?? card?.privacyTier),
		formatMaybeDetail("refreshed", page.lastRefreshedAt ?? card?.lastRefreshedAt),
		formatMaybeDetail("freshness", formatFreshnessLabel(freshness))
	].filter(Boolean);
	return `${formatPageLink(config, page, sourceRelativeTo)}${details.length > 0 ? `: ${details.join("; ")}` : ""}`;
}
function formatRelationshipTarget(config, relationship, sourceRelativeTo) {
	if (relationship.targetPath && relationship.targetTitle) return formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: relationship.targetPath,
		sourceRelativeTo,
		title: relationship.targetTitle
	});
	return relationship.targetTitle ?? relationship.targetId ?? relationship.targetPath ?? "unknown";
}
function formatRelationshipLine(config, page, relationship, sourceRelativeTo) {
	const details = [
		relationship.kind ?? "related",
		typeof relationship.weight === "number" ? `weight ${relationship.weight.toFixed(2)}` : null,
		typeof relationship.confidence === "number" ? `confidence ${relationship.confidence.toFixed(2)}` : null,
		relationship.evidenceKind ? `evidence ${relationship.evidenceKind}` : null,
		relationship.privacyTier ? `privacy ${relationship.privacyTier}` : null,
		relationship.note
	].filter(Boolean);
	return `${formatPageLink(config, page, sourceRelativeTo)} -> ${formatRelationshipTarget(config, relationship, sourceRelativeTo)}${details.length > 0 ? ` (${details.join(", ")})` : ""}`;
}
function countBy(values) {
	const counts = /* @__PURE__ */ new Map();
	for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
	return counts;
}
function formatCountLines(counts) {
	const lines = [...counts].toSorted((left, right) => {
		if (left[1] !== right[1]) return right[1] - left[1];
		return left[0].localeCompare(right[0]);
	}).map(([label, count]) => `- ${label}: ${count}`);
	return lines.length > 0 ? lines : ["- None"];
}
function formatClaimIdentityForPage(claim) {
	return claim.id ? `\`${claim.id}\`: ${claim.text}` : claim.text;
}
function isReviewablePrivacyTier(value) {
	const tier = normalizeLowercaseStringOrEmpty(value);
	return tier !== "" && tier !== "public";
}
function formatEvidencePrivacyDetails(evidence) {
	return [
		evidence.kind ? `kind ${evidence.kind}` : null,
		evidence.sourceId ? `source ${evidence.sourceId}` : null,
		evidence.path ? `path ${evidence.path}` : null,
		evidence.lines ? `lines ${evidence.lines}` : null
	].filter(Boolean).join(", ");
}
function collectPrivacyReviewEntries(config, pages, sourceRelativeTo) {
	const entries = [];
	for (const page of pages) {
		if (isReviewablePrivacyTier(page.privacyTier)) entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: page privacy ${page.privacyTier}`);
		if (isReviewablePrivacyTier(page.personCard?.privacyTier)) entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: person card privacy ${page.personCard?.privacyTier}`);
		for (const relationship of page.relationships) if (isReviewablePrivacyTier(relationship.privacyTier)) entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: relationship privacy ${relationship.privacyTier} -> ${formatRelationshipTarget(config, relationship, sourceRelativeTo)}`);
		for (const claim of page.claims) for (const evidence of claim.evidence) {
			if (!isReviewablePrivacyTier(evidence.privacyTier)) continue;
			const detail = formatEvidencePrivacyDetails(evidence);
			entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: evidence privacy ${evidence.privacyTier} on ${formatClaimIdentityForPage(claim)}${detail ? ` (${detail})` : ""}`);
		}
	}
	return entries;
}
function formatClaimIdentity(claim) {
	return claim.claimId ? `\`${claim.claimId}\`: ${claim.text}` : claim.text;
}
function isClaimHealthContested(claim) {
	return isClaimContestedStatus(claim.status);
}
function formatClaimHealthLine(config, claim, sourceRelativeTo) {
	const details = [
		`status ${claim.status}`,
		typeof claim.confidence === "number" ? `confidence ${claim.confidence.toFixed(2)}` : null,
		claim.missingEvidence ? "missing evidence" : `${claim.evidenceCount} evidence`,
		formatFreshnessLabel(claim.freshness)
	].filter(Boolean);
	return `${formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: claim.pagePath,
		sourceRelativeTo,
		title: claim.pageTitle
	})}: ${formatClaimIdentity(claim)} (${details.join(", ")})`;
}
function formatPageContradictionClusterLine(config, cluster, sourceRelativeTo) {
	const pageRefs = cluster.entries.map((entry) => formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: entry.pagePath,
		sourceRelativeTo,
		title: entry.pageTitle
	}));
	return `- ${cluster.label}: ${pageRefs.join(" | ")}`;
}
function formatClaimContradictionClusterLine(config, cluster, sourceRelativeTo) {
	const entries = cluster.entries.map((entry) => `${formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: entry.pagePath,
		sourceRelativeTo,
		title: entry.pageTitle
	})} -> ${formatClaimIdentity(entry)} (${entry.status}, ${formatFreshnessLabel(entry.freshness)})`);
	return `- \`${cluster.label}\`: ${entries.join(" | ")}`;
}
function normalizeComparableTarget(value) {
	return normalizeLowercaseStringOrEmpty(value.trim().replace(/\\/g, "/").replace(/\.md$/i, "").replace(/^\.\/+/, "").replace(/\/+$/, ""));
}
function uniquePages(pages) {
	const seen = /* @__PURE__ */ new Set();
	const unique = [];
	for (const page of pages) {
		const key = page.id ?? page.relativePath;
		if (seen.has(key)) continue;
		seen.add(key);
		unique.push(page);
	}
	return unique;
}
function buildPageLookupKeys(page) {
	const keys = /* @__PURE__ */ new Set();
	keys.add(normalizeComparableTarget(page.relativePath));
	keys.add(normalizeComparableTarget(page.relativePath.replace(/\.md$/i, "")));
	keys.add(normalizeComparableTarget(page.title));
	if (page.id) keys.add(normalizeComparableTarget(page.id));
	return keys;
}
function renderWikiPageLinks(params) {
	return params.pages.map((page) => `- ${formatWikiLink({
		renderMode: params.config.vault.renderMode,
		relativePath: page.relativePath,
		sourceRelativeTo: params.sourceRelativeTo,
		title: page.title
	})}`).join("\n");
}
function sharedSourceFanout(page, allPages) {
	const sourceIds = new Set(page.sourceIds);
	const counts = /* @__PURE__ */ new Map();
	for (const candidate of allPages) {
		if (candidate.relativePath === page.relativePath) continue;
		for (const sourceId of candidate.sourceIds) {
			if (!sourceIds.has(sourceId)) continue;
			counts.set(sourceId, (counts.get(sourceId) ?? 0) + 1);
		}
	}
	return counts;
}
function buildRelatedBlockBody(params) {
	const candidatePages = params.allPages.filter((candidate) => candidate.kind !== "report");
	const sourceFanout = sharedSourceFanout(params.page, candidatePages);
	const pagesById = new Map(candidatePages.flatMap((candidate) => candidate.id ? [[candidate.id, candidate]] : []));
	const sourcePages = uniquePages(params.page.sourceIds.flatMap((sourceId) => {
		const page = pagesById.get(sourceId);
		return page ? [page] : [];
	}));
	const backlinkKeys = buildPageLookupKeys(params.page);
	const backlinks = uniquePages(candidatePages.filter((candidate) => {
		if (candidate.relativePath === params.page.relativePath) return false;
		if (candidate.sourceIds.includes(params.page.id ?? "")) return true;
		return candidate.linkTargets.some((target) => backlinkKeys.has(normalizeComparableTarget(target)));
	}));
	const backlinkPages = backlinks.length <= MAX_SHARED_SOURCE_FANOUT ? backlinks.slice(0, MAX_RELATED_PAGES_PER_SECTION) : [];
	const relatedPages = uniquePages(candidatePages.filter((candidate) => {
		if (candidate.relativePath === params.page.relativePath) return false;
		if (sourcePages.some((sourcePage) => sourcePage.relativePath === candidate.relativePath)) return false;
		if (backlinkPages.some((backlink) => backlink.relativePath === candidate.relativePath)) return false;
		if (params.page.sourceIds.length === 0 || candidate.sourceIds.length === 0) return false;
		return params.page.sourceIds.some((sourceId) => candidate.sourceIds.includes(sourceId) && (sourceFanout.get(sourceId) ?? 0) <= MAX_SHARED_SOURCE_FANOUT);
	})).slice(0, MAX_RELATED_PAGES_PER_SECTION);
	const sections = [];
	if (sourcePages.length > 0) sections.push("### Sources", renderWikiPageLinks({
		config: params.config,
		pages: sourcePages,
		sourceRelativeTo: params.page.relativePath
	}));
	if (backlinkPages.length > 0) sections.push("### Referenced By", renderWikiPageLinks({
		config: params.config,
		pages: backlinkPages,
		sourceRelativeTo: params.page.relativePath
	}));
	if (relatedPages.length > 0) sections.push("### Related Pages", renderWikiPageLinks({
		config: params.config,
		pages: relatedPages,
		sourceRelativeTo: params.page.relativePath
	}));
	if (sections.length === 0) return "- No related pages yet.";
	return sections.join("\n\n");
}
async function refreshPageRelatedBlocks(params) {
	if (!params.config.render.createBacklinks) return [];
	const root$3 = await root(params.config.vault.path);
	const updatedFiles = [];
	for (const page of params.pages) {
		if (page.kind === "report") continue;
		const original = await root$3.readText(page.relativePath);
		if (original.trim().length === 0) continue;
		const updated = withTrailingNewline(replaceManagedMarkdownBlock({
			original,
			heading: "## Related",
			startMarker: WIKI_RELATED_START_MARKER,
			endMarker: WIKI_RELATED_END_MARKER,
			body: buildRelatedBlockBody({
				config: params.config,
				page,
				allPages: params.pages
			})
		}));
		if (updated === original) continue;
		await root$3.write(page.relativePath, updated);
		updatedFiles.push(page.absolutePath);
	}
	return updatedFiles;
}
function renderSectionList(params) {
	if (params.pages.length === 0) return `- ${params.emptyText}`;
	return params.pages.map((page) => `- ${formatWikiLink({
		renderMode: params.config.vault.renderMode,
		relativePath: page.relativePath,
		sourceRelativeTo: params.sourceRelativeTo,
		title: page.title
	})}`).join("\n");
}
async function writeManagedMarkdownFile(params) {
	const root$4 = await root(params.rootDir);
	const original = await root$4.readText(params.relativePath).catch(() => `# ${params.title}\n`);
	parseWikiMarkdown(original);
	const rendered = withTrailingNewline(replaceManagedMarkdownBlock({
		original,
		heading: "## Generated",
		startMarker: params.startMarker,
		endMarker: params.endMarker,
		body: params.body
	}));
	if (rendered === original) return false;
	await root$4.write(params.relativePath, rendered);
	return true;
}
async function writeDashboardPage(params) {
	const root$5 = await root(params.rootDir);
	const original = await root$5.readText(params.definition.relativePath).catch(() => renderWikiMarkdown({
		frontmatter: {
			pageType: "report",
			id: params.definition.id,
			title: params.definition.title,
			status: "active"
		},
		body: `# ${params.definition.title}\n`
	}));
	const parsed = parseWikiMarkdown(original);
	const updatedBody = replaceManagedMarkdownBlock({
		original: parsed.body.trim().length > 0 ? parsed.body : `# ${params.definition.title}\n`,
		heading: "## Generated",
		startMarker: `<!-- openclaw:wiki:${path.basename(params.definition.relativePath, ".md")}:start -->`,
		endMarker: `<!-- openclaw:wiki:${path.basename(params.definition.relativePath, ".md")}:end -->`,
		body: params.definition.buildBody({
			config: params.config,
			managedImportedSourcePagePaths: params.managedImportedSourcePagePaths,
			pages: params.pages,
			now: params.now,
			sourceRelativeTo: params.definition.relativePath
		})
	});
	const preservedUpdatedAt = typeof parsed.frontmatter.updatedAt === "string" && parsed.frontmatter.updatedAt.trim() ? parsed.frontmatter.updatedAt : params.now.toISOString();
	if (withTrailingNewline(renderWikiMarkdown({
		frontmatter: {
			...parsed.frontmatter,
			pageType: "report",
			id: params.definition.id,
			title: params.definition.title,
			status: typeof parsed.frontmatter.status === "string" && parsed.frontmatter.status.trim() ? parsed.frontmatter.status : "active",
			updatedAt: preservedUpdatedAt
		},
		body: updatedBody
	})) === original) return false;
	const rendered = withTrailingNewline(renderWikiMarkdown({
		frontmatter: {
			...parsed.frontmatter,
			pageType: "report",
			id: params.definition.id,
			title: params.definition.title,
			status: typeof parsed.frontmatter.status === "string" && parsed.frontmatter.status.trim() ? parsed.frontmatter.status : "active",
			updatedAt: params.now.toISOString()
		},
		body: updatedBody
	}));
	await root$5.write(params.definition.relativePath, rendered);
	return true;
}
async function refreshDashboardPages(params) {
	if (!params.config.render.createDashboards) return [];
	const now = /* @__PURE__ */ new Date();
	const updatedFiles = [];
	for (const definition of DASHBOARD_PAGES) if (await writeDashboardPage({
		config: params.config,
		rootDir: params.rootDir,
		definition,
		managedImportedSourcePagePaths: params.managedImportedSourcePagePaths,
		pages: params.pages,
		now
	})) updatedFiles.push(path.join(params.rootDir, definition.relativePath));
	return updatedFiles;
}
function buildRootIndexBody(params) {
	const claimCount = params.pages.reduce((total, page) => total + page.claims.length, 0);
	const lines = [
		`- Render mode: \`${params.config.vault.renderMode}\``,
		`- Total pages: ${params.pages.length}`,
		`- Claims: ${claimCount}`,
		`- Sources: ${params.counts.source}`,
		`- Entities: ${params.counts.entity}`,
		`- Concepts: ${params.counts.concept}`,
		`- Syntheses: ${params.counts.synthesis}`,
		`- Reports: ${params.counts.report}`
	];
	for (const group of COMPILE_PAGE_GROUPS) {
		lines.push("", `### ${group.heading}`);
		lines.push(renderSectionList({
			config: params.config,
			pages: params.pages.filter((page) => page.kind === group.kind),
			emptyText: `No ${normalizeLowercaseStringOrEmpty(group.heading)} yet.`
		}));
	}
	return lines.join("\n");
}
function buildDirectoryIndexBody(params) {
	return renderSectionList({
		config: params.config,
		pages: params.pages.filter((page) => page.kind === params.group.kind),
		emptyText: `No ${normalizeLowercaseStringOrEmpty(params.group.heading)} yet.`,
		sourceRelativeTo: `${params.group.dir}/index.md`
	});
}
function rankFreshnessLevel(level) {
	switch (level) {
		case "fresh": return 3;
		case "aging": return 2;
		case "stale": return 1;
		case "unknown": return 0;
	}
	throw new Error("Unsupported wiki freshness level");
}
function sortClaims(page) {
	return [...page.claims].toSorted((left, right) => {
		const leftConfidence = left.confidence ?? -1;
		const rightConfidence = right.confidence ?? -1;
		if (leftConfidence !== rightConfidence) return rightConfidence - leftConfidence;
		const leftFreshness = rankFreshnessLevel(assessClaimFreshness({
			page,
			claim: left
		}).level);
		const rightFreshness = rankFreshnessLevel(assessClaimFreshness({
			page,
			claim: right
		}).level);
		if (leftFreshness !== rightFreshness) return rightFreshness - leftFreshness;
		return left.text.localeCompare(right.text);
	});
}
function buildCompiledCacheSnapshot(pagesInput) {
	const pages = [...pagesInput].toSorted((left, right) => left.relativePath.localeCompare(right.relativePath)).map((page) => {
		return Object.assign({}, page.id ? { id: page.id } : {}, {
			title: page.title,
			kind: page.kind,
			path: page.relativePath,
			aliases: [...page.aliases],
			sourceIds: [...page.sourceIds],
			questions: [...page.questions],
			contradictions: [...page.contradictions],
			bestUsedFor: [...page.bestUsedFor],
			notEnoughFor: [...page.notEnoughFor],
			relationshipCount: page.relationships.length,
			topRelationships: page.relationships.slice(0, 5)
		}, page.pageType ? { pageType: page.pageType } : {}, page.entityType ? { entityType: page.entityType } : {}, page.canonicalId ? { canonicalId: page.canonicalId } : {}, page.privacyTier ? { privacyTier: page.privacyTier } : {}, page.personCard ? { personCard: page.personCard } : {}, {
			claimCount: page.claims.length,
			topClaims: sortClaims(page).slice(0, 5).map((claim) => {
				const freshness = assessClaimFreshness({
					page,
					claim
				});
				return Object.assign({}, claim.id ? { id: claim.id } : {}, {
					text: claim.text,
					status: normalizeClaimStatus(claim.status)
				}, typeof claim.confidence === "number" ? { confidence: claim.confidence } : {}, { freshnessLevel: freshness.level });
			})
		});
	});
	const claims = pagesInput.flatMap((page) => sortClaims(page).map((claim) => {
		const freshness = assessClaimFreshness({
			page,
			claim
		});
		return Object.assign({}, claim.id ? { id: claim.id } : {}, {
			pageId: page.id,
			pageTitle: page.title,
			pageKind: page.kind,
			pagePath: page.relativePath,
			pageType: page.pageType,
			entityType: page.entityType,
			canonicalId: page.canonicalId,
			aliases: page.aliases,
			text: claim.text,
			status: normalizeClaimStatus(claim.status),
			confidence: claim.confidence,
			sourceIds: page.sourceIds,
			evidenceKinds: uniqueStrings(claim.evidence.flatMap((entry) => entry.kind ?? [])),
			privacyTiers: [...new Set([
				page.privacyTier,
				page.personCard?.privacyTier,
				...claim.evidence.map((entry) => entry.privacyTier)
			].flatMap((entry) => entry ?? []))],
			freshnessLevel: freshness.level,
			lastTouchedAt: freshness.lastTouchedAt
		});
	})).toSorted((left, right) => left.pagePath.localeCompare(right.pagePath) || left.text.localeCompare(right.text));
	return {
		digest: {
			claimCount: claims.length,
			contradictionCount: buildPageContradictionClusters(pagesInput).length + buildClaimContradictionClusters({ pages: pagesInput }).length,
			pages
		},
		claims
	};
}
async function compileMemoryWikiVaultUnlocked(config, options) {
	if (options?.sourcePageWrites === "preserve") await activateExistingMemoryWikiVault(config);
	else await initializeMemoryWikiVault(config);
	const rootDir = config.vault.path;
	const compiledInputIdentity = await loadMemoryWikiVaultIdentity(rootDir);
	if (!compiledInputIdentity.vaultGeneration) throw new Error(`Memory Wiki vault generation is missing: ${rootDir}`);
	const compiledCacheReservationId = createMemoryWikiCompiledCachePublicationId();
	await appendMemoryWikiLog(rootDir, {
		type: "compile",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			compiledCacheReservationId,
			compiledCacheParentPublicationId: compiledInputIdentity.compiledCachePublicationId
		}
	});
	const reservedIdentity = await loadMemoryWikiVaultIdentity(rootDir);
	if (reservedIdentity.vaultGeneration !== compiledInputIdentity.vaultGeneration || reservedIdentity.compiledCacheReservationId !== compiledCacheReservationId || reservedIdentity.compiledCachePublicationId !== compiledInputIdentity.compiledCachePublicationId) throw new Error("Memory Wiki vault changed before its compiled cache scan began.");
	const sourceSyncState = await readMemoryWikiSourceSyncState(rootDir);
	const managedImportedSourcePagePaths = new Set(Object.values(sourceSyncState.entries).map((entry) => entry.pagePath.split(path.sep).join("/")));
	let scan = await readPageSummaries(rootDir);
	let pages = scan.pages;
	const updatedFiles = options?.sourcePageWrites === "preserve" ? [] : await refreshPageRelatedBlocks({
		config,
		pages
	});
	if (updatedFiles.length > 0) {
		scan = await readPageSummaries(rootDir);
		pages = scan.pages;
	}
	const dashboardUpdatedFiles = await refreshDashboardPages({
		config,
		managedImportedSourcePagePaths,
		rootDir,
		pages
	});
	updatedFiles.push(...dashboardUpdatedFiles);
	if (dashboardUpdatedFiles.length > 0) {
		scan = await readPageSummaries(rootDir);
		pages = scan.pages;
	}
	const counts = buildPageCounts(pages);
	const compiledSnapshot = buildCompiledCacheSnapshot(pages);
	const compiledCacheGeneration = resolveMemoryWikiCompiledCacheGeneration(compiledSnapshot);
	const compiledCachePublicationId = createMemoryWikiCompiledCachePublicationId();
	let compiledCacheSourceGeneration;
	const rootIndexPath = path.join(rootDir, "index.md");
	if (await writeManagedMarkdownFile({
		rootDir,
		relativePath: "index.md",
		title: "Wiki Index",
		startMarker: "<!-- openclaw:wiki:index:start -->",
		endMarker: "<!-- openclaw:wiki:index:end -->",
		body: buildRootIndexBody({
			config,
			pages,
			counts
		})
	})) updatedFiles.push(rootIndexPath);
	for (const group of COMPILE_PAGE_GROUPS) {
		const relativePath = path.join(group.dir, "index.md").replace(/\\/g, "/");
		const filePath = path.join(rootDir, relativePath);
		if (await writeManagedMarkdownFile({
			rootDir,
			relativePath,
			title: group.heading,
			startMarker: `<!-- openclaw:wiki:${group.dir}:index:start -->`,
			endMarker: `<!-- openclaw:wiki:${group.dir}:index:end -->`,
			body: buildDirectoryIndexBody({
				config,
				pages,
				group
			})
		})) updatedFiles.push(filePath);
	}
	await writeMemoryWikiCompiledCache(config, compiledSnapshot, compiledCacheGeneration, compiledCachePublicationId, compiledInputIdentity.compiledCachePublicationId, async () => {
		const currentIdentity = await loadMemoryWikiVaultIdentity(rootDir);
		if (currentIdentity.vaultGeneration !== compiledInputIdentity.vaultGeneration || currentIdentity.compiledCacheReservationId !== compiledCacheReservationId || currentIdentity.compiledCachePublicationId !== compiledInputIdentity.compiledCachePublicationId) throw new Error("Memory Wiki vault changed while its compiled cache was being built.");
		const sourceGenerationBeforeScan = await resolveMemoryWikiVaultSourceGeneration(rootDir);
		const verifiedGeneration = resolveMemoryWikiCompiledCacheGeneration(buildCompiledCacheSnapshot((await readPageSummaries(rootDir)).pages));
		const sourceGenerationAfterScan = await resolveMemoryWikiVaultSourceGeneration(rootDir);
		if (verifiedGeneration !== compiledCacheGeneration || sourceGenerationAfterScan !== sourceGenerationBeforeScan) throw new Error("Memory Wiki vault changed while its compiled cache was being published.");
		compiledCacheSourceGeneration = sourceGenerationAfterScan;
		const verifiedIdentity = await loadMemoryWikiVaultIdentity(rootDir);
		if (verifiedIdentity.vaultGeneration !== compiledInputIdentity.vaultGeneration || verifiedIdentity.compiledCacheReservationId !== compiledCacheReservationId || verifiedIdentity.compiledCachePublicationId !== compiledInputIdentity.compiledCachePublicationId) throw new Error("Memory Wiki vault changed while its compiled cache was being verified.");
	}, async () => {
		if (!compiledCacheSourceGeneration) throw new Error("Memory Wiki compiled cache source generation is missing.");
		await appendMemoryWikiLog(rootDir, {
			type: "compile",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			details: {
				compiledCachePublicationId,
				compiledCacheParentPublicationId: compiledInputIdentity.compiledCachePublicationId,
				compiledCacheReservationId,
				compiledCacheSourceGeneration
			}
		});
	}, () => loadMemoryWikiValidatedVaultIdentity(rootDir));
	await appendMemoryWikiLog(rootDir, {
		type: "compile",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			pageCounts: counts,
			updatedFiles: updatedFiles.map((filePath) => path.relative(rootDir, filePath))
		}
	});
	return {
		vaultRoot: rootDir,
		pageCounts: counts,
		pages,
		frontmatterErrors: scan.frontmatterErrors,
		claimCount: pages.reduce((total, page) => total + page.claims.length, 0),
		updatedFiles
	};
}
async function compileMemoryWikiVault(config, options) {
	return await withMemoryWikiVaultMutation(config.vault.path, () => compileMemoryWikiVaultUnlocked(config, options));
}
async function hasMissingWikiIndexes(rootDir) {
	const required = [path.join(rootDir, "index.md"), ...COMPILE_PAGE_GROUPS.map((group) => path.join(rootDir, group.dir, "index.md"))];
	for (const filePath of required) if (!await fs$1.access(filePath).then(() => true).catch(() => false)) return true;
	return false;
}
async function refreshMemoryWikiIndexesAfterImport(params) {
	await initializeMemoryWikiVault(params.config);
	if (!params.config.ingest.autoCompile) return {
		refreshed: false,
		reason: "auto-compile-disabled"
	};
	const importChanged = params.syncResult.importedCount > 0 || params.syncResult.updatedCount > 0 || params.syncResult.removedCount > 0;
	const missingIndexes = await hasMissingWikiIndexes(params.config.vault.path);
	if (!importChanged && !missingIndexes) return {
		refreshed: false,
		reason: "no-import-changes"
	};
	const compile = await compileMemoryWikiVault(params.config);
	return {
		refreshed: true,
		reason: missingIndexes && !importChanged ? "missing-indexes" : "import-changed",
		compile
	};
}
//#endregion
//#region extensions/memory-wiki/src/query.ts
const QUERY_DIRS = [
	"entities",
	"concepts",
	"sources",
	"syntheses",
	"reports"
];
const QUERY_PAGE_READ_CONCURRENCY = 16;
const RELATED_BLOCK_PATTERN = /<!-- openclaw:wiki:related:start -->[\s\S]*?<!-- openclaw:wiki:related:end -->/g;
const MARKDOWN_FRONTMATTER_PATTERN = /^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const ROUTE_QUESTION_STOP_WORDS = /* @__PURE__ */ new Set([
	"a",
	"about",
	"am",
	"an",
	"are",
	"ask",
	"asking",
	"be",
	"been",
	"being",
	"can",
	"could",
	"did",
	"do",
	"does",
	"for",
	"help",
	"how",
	"i",
	"in",
	"is",
	"know",
	"knows",
	"me",
	"my",
	"need",
	"needs",
	"of",
	"on",
	"or",
	"our",
	"question",
	"questions",
	"should",
	"the",
	"to",
	"us",
	"we",
	"what",
	"when",
	"where",
	"who",
	"whom",
	"whose",
	"why",
	"with",
	"would"
]);
function normalizePositiveInteger(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback;
}
const WIKI_SEARCH_MODES = [
	"auto",
	"find-person",
	"route-question",
	"source-evidence",
	"raw-claim"
];
function sortWikiSearchResults(results) {
	return results.toSorted((left, right) => {
		if (left.score !== right.score) return right.score - left.score;
		return left.title.localeCompare(right.title);
	});
}
function mergeWikiSearchCorpusResults(params) {
	const wikiResults = sortWikiSearchResults(params.wikiResults);
	const memoryResults = sortWikiSearchResults(params.memoryResults);
	if (!params.balanceCorpora || wikiResults.length === 0 || memoryResults.length === 0) return sortWikiSearchResults([...wikiResults, ...memoryResults]).slice(0, params.maxResults);
	const perCorpusCap = Math.ceil(params.maxResults / 2);
	const selectedWiki = wikiResults.slice(0, perCorpusCap);
	const selectedMemory = memoryResults.slice(0, perCorpusCap);
	const selected = [...selectedWiki, ...selectedMemory];
	if (selected.length < params.maxResults) selected.push(...sortWikiSearchResults([...wikiResults.slice(selectedWiki.length), ...memoryResults.slice(selectedMemory.length)]).slice(0, params.maxResults - selected.length));
	return sortWikiSearchResults(selected).slice(0, params.maxResults);
}
async function listWikiMarkdownFiles(rootDir) {
	return (await Promise.all(QUERY_DIRS.map(async (relativeDir) => {
		return (await walkMemoryWikiDirectory(rootDir, relativeDir)).filter((entry) => entry.kind === "file" && entry.relativePath.endsWith(".md") && path.basename(entry.relativePath) !== "index.md").map((entry) => entry.relativePath.split(path.sep).join("/"));
	}))).flat().toSorted((left, right) => left.localeCompare(right));
}
async function readQueryableWikiPages(rootDir) {
	return readQueryableWikiPagesByPaths(rootDir, await listWikiMarkdownFiles(rootDir));
}
async function readQueryableWikiPagesByPaths(rootDir, files) {
	return await pMap(files, async (relativePath) => {
		const absolutePath = path.join(rootDir, relativePath);
		const raw = await fs$1.readFile(absolutePath, "utf8");
		const summary = toWikiPageSummary({
			absolutePath,
			relativePath,
			raw
		});
		return summary ? {
			...summary,
			raw
		} : pMapSkip;
	}, {
		concurrency: QUERY_PAGE_READ_CONCURRENCY,
		stopOnError: true
	});
}
async function readQueryDigestBundle(config) {
	const snapshot = await loadMemoryWikiCompiledCache(config);
	return snapshot ? {
		pages: snapshot.digest.pages,
		claims: snapshot.claims
	} : null;
}
function buildSnippet(raw, query) {
	const queryLower = normalizeLowercaseStringOrEmpty(query);
	const queryTokens = buildQueryTokens(queryLower);
	const lines = buildSnippetSearchText(raw).split(/\r?\n/).filter((line) => line.trim().length > 0);
	return (lines.find((line) => lineMatchesQuery(normalizeLowercaseStringOrEmpty(line), queryLower, queryTokens)) ?? lines.map((line) => ({
		line,
		hits: queryTokens.filter((token) => normalizeLowercaseStringOrEmpty(line).includes(token)).length
	})).toSorted((left, right) => right.hits - left.hits).find((candidate) => candidate.hits > 0)?.line)?.trim() || lines.find((line) => line.trim() !== "---")?.trim() || "";
}
function buildPageSearchText(page) {
	return [
		page.title,
		page.relativePath,
		page.id ?? "",
		page.pageType ?? "",
		page.entityType ?? "",
		page.canonicalId ?? "",
		page.aliases.join(" "),
		page.sourceIds.join(" "),
		page.questions.join(" "),
		page.contradictions.join(" "),
		page.privacyTier ?? "",
		page.bestUsedFor.join(" "),
		page.notEnoughFor.join(" "),
		page.personCard?.canonicalId ?? "",
		page.personCard?.handles.join(" ") ?? "",
		page.personCard?.socials.join(" ") ?? "",
		page.personCard?.emails.join(" ") ?? "",
		page.personCard?.timezone ?? "",
		page.personCard?.lane ?? "",
		page.personCard?.askFor.join(" ") ?? "",
		page.personCard?.avoidAskingFor.join(" ") ?? "",
		page.personCard?.bestUsedFor.join(" ") ?? "",
		page.personCard?.notEnoughFor.join(" ") ?? "",
		page.relationships.flatMap((relationship) => [
			relationship.targetId ?? "",
			relationship.targetPath ?? "",
			relationship.targetTitle ?? "",
			relationship.kind ?? "",
			relationship.evidenceKind ?? "",
			relationship.note ?? ""
		]).join(" "),
		page.claims.map((claim) => claim.text).join(" "),
		page.claims.map((claim) => claim.id ?? "").join(" "),
		page.claims.flatMap((claim) => claim.evidence.flatMap((evidence) => [
			evidence.kind ?? "",
			evidence.sourceId ?? "",
			evidence.path ?? "",
			evidence.lines ?? "",
			evidence.note ?? "",
			evidence.privacyTier ?? ""
		])).join(" ")
	].filter(Boolean).join("\n");
}
function stripGeneratedRelatedBlock(raw) {
	return raw.replace(RELATED_BLOCK_PATTERN, "");
}
function buildSnippetSearchText(raw) {
	return stripGeneratedRelatedBlock(raw).replace(MARKDOWN_FRONTMATTER_PATTERN, "");
}
function buildQueryTokens(queryLower) {
	return [...new Set(queryLower.split(/[^a-z0-9@._-]+/i).map((token) => token.trim()).filter((token) => token.length >= 2))];
}
function buildRouteQuestionTokens(queryLower) {
	const tokens = buildQueryTokens(queryLower);
	const routedTokens = tokens.filter((token) => !ROUTE_QUESTION_STOP_WORDS.has(token));
	return routedTokens.length > 0 ? routedTokens : tokens;
}
function lineMatchesQuery(lineLower, queryLower, queryTokens) {
	if (queryLower.length > 0 && lineLower.includes(queryLower)) return true;
	return queryTokens.length > 0 && queryTokens.every((token) => lineLower.includes(token));
}
function buildDigestPageSearchText(page, claims) {
	return [
		page.title,
		page.path,
		page.id ?? "",
		page.pageType ?? "",
		page.entityType ?? "",
		page.canonicalId ?? "",
		page.aliases?.join(" ") ?? "",
		page.sourceIds.join(" "),
		page.questions.join(" "),
		page.contradictions.join(" "),
		page.privacyTier ?? "",
		page.bestUsedFor?.join(" ") ?? "",
		page.notEnoughFor?.join(" ") ?? "",
		page.personCard?.canonicalId ?? "",
		page.personCard?.handles.join(" ") ?? "",
		page.personCard?.socials.join(" ") ?? "",
		page.personCard?.emails.join(" ") ?? "",
		page.personCard?.timezone ?? "",
		page.personCard?.lane ?? "",
		page.personCard?.askFor.join(" ") ?? "",
		page.personCard?.avoidAskingFor.join(" ") ?? "",
		page.personCard?.bestUsedFor.join(" ") ?? "",
		page.personCard?.notEnoughFor.join(" ") ?? "",
		page.topRelationships?.flatMap((relationship) => [
			relationship.targetId ?? "",
			relationship.targetPath ?? "",
			relationship.targetTitle ?? "",
			relationship.kind ?? "",
			relationship.evidenceKind ?? "",
			relationship.note ?? ""
		]).join(" ") ?? "",
		claims.map((claim) => claim.text).join(" "),
		claims.map((claim) => claim.id ?? "").join(" "),
		claims.map((claim) => claim.evidenceKinds?.join(" ") ?? "").join(" "),
		claims.map((claim) => claim.privacyTiers?.join(" ") ?? "").join(" ")
	].filter(Boolean).join("\n");
}
function isClaimTextOrIdMatch(claim, queryLower, queryTokens = buildQueryTokens(queryLower)) {
	if (lineMatchesQuery(normalizeLowercaseStringOrEmpty(claim.text), queryLower, [...queryTokens])) return true;
	return lineMatchesQuery(normalizeLowercaseStringOrEmpty(claim.id), queryLower, [...queryTokens]);
}
function scoreClaimMatch(params) {
	let score = 0;
	if (normalizeLowercaseStringOrEmpty(params.text).includes(params.queryLower)) score += 25;
	else if (params.queryTokens?.length && params.queryTokens.every((token) => normalizeLowercaseStringOrEmpty(params.text).includes(token))) score += 18;
	if (normalizeLowercaseStringOrEmpty(params.id).includes(params.queryLower)) score += 10;
	if (typeof params.confidence === "number") score += Math.round(params.confidence * 10);
	switch (params.freshnessLevel) {
		case "fresh":
			score += 8;
			break;
		case "aging":
			score += 4;
			break;
		case "stale":
			score -= 2;
			break;
		case "unknown":
			score -= 4;
			break;
		case void 0: break;
	}
	score += isClaimContestedStatus(params.status) ? -6 : 4;
	return score;
}
function scoreDigestClaimMatch(claim, queryLower) {
	return scoreClaimMatch({
		text: claim.text,
		id: claim.id,
		confidence: claim.confidence,
		status: claim.status,
		freshnessLevel: claim.freshnessLevel,
		queryLower,
		queryTokens: buildQueryTokens(queryLower)
	});
}
function scoreWikiMetadataMatch(params) {
	let score = 0;
	const titleLower = normalizeLowercaseStringOrEmpty(params.title);
	const pathLower = normalizeLowercaseStringOrEmpty(params.path);
	const idLower = normalizeLowercaseStringOrEmpty(params.id);
	if (titleLower === params.queryLower) score += 50;
	else if (titleLower.includes(params.queryLower)) score += 20;
	if (pathLower.includes(params.queryLower)) score += 10;
	if (idLower.includes(params.queryLower)) score += 20;
	if (params.sourceIds.some((sourceId) => normalizeLowercaseStringOrEmpty(sourceId).includes(params.queryLower))) score += 12;
	return score;
}
function hasQueryMatch(value, queryLower, queryTokens) {
	return lineMatchesQuery(normalizeLowercaseStringOrEmpty(value), queryLower, [...queryTokens]);
}
function hasAnyQueryMatch(values, queryLower, queryTokens) {
	return values.some((value) => hasQueryMatch(value, queryLower, queryTokens));
}
function buildPageRouteQuestionFields(page) {
	return [
		page.personCard?.lane,
		...page.personCard?.askFor ?? [],
		...page.personCard?.avoidAskingFor ?? [],
		...page.bestUsedFor,
		...page.notEnoughFor,
		...page.personCard?.bestUsedFor ?? [],
		...page.personCard?.notEnoughFor ?? [],
		...page.relationships.flatMap((relationship) => [
			relationship.kind,
			relationship.targetTitle,
			relationship.note
		])
	].filter((value) => Boolean(value));
}
function buildDigestRouteQuestionFields(page) {
	return [
		page.personCard?.lane,
		...page.personCard?.askFor ?? [],
		...page.personCard?.avoidAskingFor ?? [],
		...page.bestUsedFor ?? [],
		...page.notEnoughFor ?? [],
		...page.personCard?.bestUsedFor ?? [],
		...page.personCard?.notEnoughFor ?? [],
		...page.topRelationships?.flatMap((relationship) => [
			relationship.kind,
			relationship.targetTitle,
			relationship.note
		]) ?? []
	].filter((value) => Boolean(value));
}
function hasRouteQuestionMatch(values, queryLower) {
	return hasAnyQueryMatch(values, queryLower, buildRouteQuestionTokens(queryLower));
}
function isPersonLikeSummary(page) {
	const entityType = normalizeLowercaseStringOrEmpty(page.entityType);
	const pageType = normalizeLowercaseStringOrEmpty(page.pageType);
	return Boolean(page.personCard) || entityType === "person" || entityType === "maintainer" || pageType === "person" || pageType === "maintainer";
}
function scorePageSearchModeBoost(params) {
	const { page, queryLower, queryTokens } = params;
	switch (params.mode) {
		case "auto": return 0;
		case "find-person": {
			let score = isPersonLikeSummary(page) ? 24 : -4;
			if (hasAnyQueryMatch([
				page.canonicalId,
				...page.aliases,
				page.personCard?.canonicalId,
				...page.personCard?.handles ?? [],
				...page.personCard?.emails ?? [],
				...page.personCard?.socials ?? []
			], queryLower, queryTokens)) score += 24;
			return score;
		}
		case "route-question": {
			let score = isPersonLikeSummary(page) ? 14 : 0;
			if (hasRouteQuestionMatch(buildPageRouteQuestionFields(page), queryLower)) score += 32;
			score += Math.min(8, page.relationships.length * 2);
			return score;
		}
		case "source-evidence": {
			let score = page.kind === "source" ? 22 : 0;
			if (hasAnyQueryMatch([
				page.sourcePath,
				...page.sourceIds,
				...page.claims.flatMap((claim) => claim.evidence.flatMap((evidence) => [
					evidence.kind,
					evidence.sourceId,
					evidence.path,
					evidence.lines,
					evidence.note
				]))
			], queryLower, queryTokens)) score += 30;
			return score;
		}
		case "raw-claim": return params.matchingClaims.length > 0 ? 42 : 0;
	}
	return 0;
}
function scoreDigestSearchModeBoost(params) {
	const { page, queryLower, queryTokens } = params;
	switch (params.mode) {
		case "auto": return 0;
		case "find-person": {
			let score = isPersonLikeSummary(page) ? 24 : -4;
			if (hasAnyQueryMatch([
				page.canonicalId,
				...page.aliases ?? [],
				page.personCard?.canonicalId,
				...page.personCard?.handles ?? [],
				...page.personCard?.emails ?? [],
				...page.personCard?.socials ?? []
			], queryLower, queryTokens)) score += 24;
			return score;
		}
		case "route-question": {
			let score = isPersonLikeSummary(page) ? 14 : 0;
			if (hasRouteQuestionMatch(buildDigestRouteQuestionFields(page), queryLower)) score += 32;
			score += Math.min(8, (page.relationshipCount ?? 0) * 2);
			return score;
		}
		case "source-evidence": {
			let score = page.kind === "source" ? 22 : 0;
			if (hasAnyQueryMatch([...page.sourceIds, ...params.claims.flatMap((claim) => [
				...claim.sourceIds ?? [],
				...claim.evidenceKinds ?? [],
				...claim.privacyTiers ?? []
			])], queryLower, queryTokens)) score += 30;
			return score;
		}
		case "raw-claim": return params.matchingClaims.length > 0 ? 42 : 0;
	}
	return 0;
}
function buildDigestCandidatePaths(params) {
	const queryLower = normalizeLowercaseStringOrEmpty(params.query);
	const queryTokens = buildQueryTokens(queryLower);
	const claimsByPage = /* @__PURE__ */ new Map();
	for (const claim of params.digest.claims) {
		const current = claimsByPage.get(claim.pagePath) ?? [];
		current.push(claim);
		claimsByPage.set(claim.pagePath, current);
	}
	return params.digest.pages.map((page) => {
		const claims = claimsByPage.get(page.path) ?? [];
		if (!normalizeLowercaseStringOrEmpty(buildDigestPageSearchText(page, claims)).includes(queryLower) && !(params.mode === "route-question" && hasRouteQuestionMatch(buildDigestRouteQuestionFields(page), queryLower))) return {
			path: page.path,
			score: 0
		};
		let score = 1 + scoreWikiMetadataMatch({
			title: page.title,
			path: page.path,
			id: page.id,
			sourceIds: page.sourceIds,
			queryLower
		});
		const matchingClaims = claims.filter((claim) => isClaimTextOrIdMatch(claim, queryLower, queryTokens)).toSorted((left, right) => scoreDigestClaimMatch(right, queryLower) - scoreDigestClaimMatch(left, queryLower));
		const [bestMatchingClaim] = matchingClaims;
		if (bestMatchingClaim) {
			score += scoreDigestClaimMatch(bestMatchingClaim, queryLower);
			score += Math.min(10, (matchingClaims.length - 1) * 2);
		}
		score += scoreDigestSearchModeBoost({
			page,
			claims,
			matchingClaims,
			queryLower,
			queryTokens,
			mode: params.mode
		});
		return {
			path: page.path,
			score
		};
	}).filter((candidate) => candidate.score > 0).toSorted((left, right) => {
		if (left.score !== right.score) return right.score - left.score;
		return left.path.localeCompare(right.path);
	}).slice(0, Math.max(params.maxResults * 4, 20)).map((candidate) => candidate.path);
}
function isClaimMatch(claim, queryLower, queryTokens) {
	return isClaimTextOrIdMatch(claim, queryLower, queryTokens);
}
function rankClaimMatch(page, claim, queryLower, queryTokens) {
	const freshness = assessClaimFreshness({
		page,
		claim
	});
	return scoreClaimMatch({
		text: claim.text,
		id: claim.id,
		confidence: claim.confidence,
		status: claim.status,
		freshnessLevel: freshness.level,
		queryLower,
		queryTokens
	});
}
function getMatchingClaims(page, queryLower) {
	const queryTokens = buildQueryTokens(queryLower);
	return page.claims.filter((claim) => isClaimMatch(claim, queryLower, queryTokens)).toSorted((left, right) => rankClaimMatch(page, right, queryLower, queryTokens) - rankClaimMatch(page, left, queryLower, queryTokens));
}
function buildPageSnippet(page, query) {
	const matchingClaim = getMatchingClaims(page, normalizeLowercaseStringOrEmpty(query))[0];
	if (matchingClaim) return matchingClaim.text;
	return buildSnippet(page.raw, query);
}
function scorePage(page, query, mode) {
	const queryLower = normalizeLowercaseStringOrEmpty(query);
	const queryTokens = buildQueryTokens(queryLower);
	const titleLower = normalizeLowercaseStringOrEmpty(page.title);
	const pathLower = normalizeLowercaseStringOrEmpty(page.relativePath);
	const idLower = normalizeLowercaseStringOrEmpty(page.id);
	const metadataLower = normalizeLowercaseStringOrEmpty(buildPageSearchText(page));
	const rawLower = normalizeLowercaseStringOrEmpty(stripGeneratedRelatedBlock(page.raw));
	const combinedLower = [
		titleLower,
		pathLower,
		idLower,
		metadataLower,
		rawLower
	].join("\n");
	const hasExactMatch = titleLower.includes(queryLower) || pathLower.includes(queryLower) || idLower.includes(queryLower) || metadataLower.includes(queryLower) || rawLower.includes(queryLower);
	const hasAllTokens = queryTokens.length > 0 && queryTokens.every((token) => combinedLower.includes(token));
	const hasModeMatch = mode === "route-question" && hasRouteQuestionMatch(buildPageRouteQuestionFields(page), queryLower);
	if (!hasExactMatch && !hasAllTokens && !hasModeMatch) return 0;
	let score = 1 + scoreWikiMetadataMatch({
		title: page.title,
		path: page.relativePath,
		id: page.id,
		sourceIds: page.sourceIds,
		queryLower
	});
	const matchingClaims = getMatchingClaims(page, queryLower);
	const [bestMatchingClaim] = matchingClaims;
	if (bestMatchingClaim) {
		score += rankClaimMatch(page, bestMatchingClaim, queryLower, queryTokens);
		score += Math.min(10, (matchingClaims.length - 1) * 2);
	}
	score += scorePageSearchModeBoost({
		page,
		matchingClaims,
		queryLower,
		queryTokens,
		mode
	});
	const bodyOccurrences = rawLower.split(queryLower).length - 1;
	score += Math.min(10, bodyOccurrences);
	for (const token of queryTokens) {
		if (titleLower.includes(token)) score += 8;
		if (pathLower.includes(token) || idLower.includes(token)) score += 6;
		if (metadataLower.includes(token)) score += 4;
		if (rawLower.includes(token)) score += 1;
	}
	return score;
}
function normalizeLookupKey(value) {
	const normalized = value.trim().replace(/\\/g, "/");
	return normalized.endsWith(".md") ? normalized : normalized.replace(/\/+$/, "");
}
function buildLookupCandidates(lookup) {
	const normalized = normalizeLookupKey(lookup);
	return uniqueStrings([normalized, normalized.endsWith(".md") ? normalized : `${normalized}.md`]);
}
function shouldEnforceSessionVisibility(params) {
	return params.sandboxed === true || Boolean(params.agentSessionKey?.trim()) || Boolean(params.agentId?.trim());
}
function isBridgeCompiledPage(page) {
	return page.sourceType === "memory-bridge" || page.sourceType === "memory-bridge-events" || page.bridgeAgentIds.length > 0;
}
function createWikiPageVisibilityFilter(params) {
	if (params.sandboxed !== true) return () => true;
	const sessionKey = params.agentSessionKey?.trim();
	const scopedAgentId = normalizeLowercaseStringOrEmpty(params.agentId?.trim() || (params.appConfig && sessionKey ? resolveSessionAgentId({
		sessionKey,
		config: params.appConfig
	}) : void 0));
	return (page) => !isBridgeCompiledPage(page) || scopedAgentId.length > 0 && page.bridgeAgentIds.some((agentId) => normalizeLowercaseStringOrEmpty(agentId) === scopedAgentId);
}
function shouldSearchSharedMemoryCorpus(config) {
	return config.search.corpus === "memory" || config.search.corpus === "all";
}
function shouldUseSharedMemory(config) {
	return config.search.backend === "shared" && shouldSearchSharedMemoryCorpus(config);
}
function assertSessionVisibilityAppConfig(params) {
	if (shouldUseSharedMemory(params.config) && shouldEnforceSessionVisibility(params) && !params.appConfig) throw new Error(`${params.operation} requires appConfig to enforce session visibility for session-bound shared memory calls.`);
}
function isSessionMemoryPath(relPath) {
	return relPath.replace(/\\/g, "/").startsWith("sessions/");
}
function shouldSearchWiki(config) {
	return config.search.corpus === "wiki" || config.search.corpus === "all";
}
function shouldSearchSharedMemory(config, appConfig) {
	return shouldUseSharedMemory(config) && appConfig !== void 0;
}
function resolveActiveMemoryAgentId(params) {
	if (!params.appConfig) return null;
	if (params.agentId?.trim()) return params.agentId.trim();
	if (params.agentSessionKey?.trim()) return resolveSessionAgentId({
		sessionKey: params.agentSessionKey,
		config: params.appConfig
	});
	return resolveDefaultAgentId(params.appConfig);
}
async function resolveActiveMemoryManager(params) {
	const agentId = resolveActiveMemoryAgentId(params);
	if (!params.appConfig || !agentId) return null;
	try {
		const { manager } = await getActiveMemorySearchManager({
			cfg: params.appConfig,
			agentId
		});
		return manager;
	} catch {
		return null;
	}
}
function buildMemoryManagerContractError(method) {
	return /* @__PURE__ */ new Error(`The active memory plugin's search manager does not implement ${method}() from the MemorySearchManager contract. Set search.backend to "local" for wiki-only access, or use a memory plugin that implements the contract.`);
}
function buildMemorySearchTitle(resultPath) {
	const basename = path.basename(resultPath, path.extname(resultPath));
	return basename.length > 0 ? basename : resultPath;
}
function applySearchOverrides(config, overrides) {
	if (!overrides?.searchBackend && !overrides?.searchCorpus) return config;
	return {
		...config,
		search: {
			backend: overrides.searchBackend ?? config.search.backend,
			corpus: overrides.searchCorpus ?? config.search.corpus
		}
	};
}
function buildWikiProvenanceLabel(page) {
	if (page.sourceType === "memory-bridge-events") return `bridge events: ${page.bridgeRelativePath ?? page.relativePath}`;
	if (page.sourceType === "memory-bridge") return `bridge: ${page.bridgeRelativePath ?? page.relativePath}`;
	if (page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local") return `unsafe-local: ${page.unsafeLocalRelativePath ?? page.relativePath}`;
}
function buildWikiResultMetadata(page) {
	const provenanceLabel = buildWikiProvenanceLabel(page);
	return {
		...page.id ? { id: page.id } : {},
		...page.sourceType ? { sourceType: page.sourceType } : {},
		...page.provenanceMode ? { provenanceMode: page.provenanceMode } : {},
		...page.sourcePath ? { sourcePath: page.sourcePath } : {},
		...provenanceLabel ? { provenanceLabel } : {},
		...page.updatedAt ? { updatedAt: page.updatedAt } : {},
		..."entityType" in page && page.entityType ? { entityType: page.entityType } : {},
		..."canonicalId" in page && page.canonicalId ? { canonicalId: page.canonicalId } : {},
		..."aliases" in page && page.aliases.length > 0 ? { aliases: [...page.aliases] } : {},
		..."privacyTier" in page && page.privacyTier ? { privacyTier: page.privacyTier } : {}
	};
}
function buildClaimResultMetadata(claim) {
	if (!claim) return {};
	return {
		...claim.id ? { matchedClaimId: claim.id } : {},
		...claim.status ? { matchedClaimStatus: claim.status } : {},
		...typeof claim.confidence === "number" ? { matchedClaimConfidence: claim.confidence } : {},
		evidenceKinds: uniqueStrings(claim.evidence.flatMap((evidence) => evidence.kind ?? [])),
		evidenceSourceIds: uniqueStrings(claim.evidence.flatMap((evidence) => evidence.sourceId ?? []))
	};
}
function toWikiSearchResult(page, query, mode) {
	const matchingClaim = getMatchingClaims(page, normalizeLowercaseStringOrEmpty(query))[0];
	return {
		corpus: "wiki",
		path: page.relativePath,
		title: page.title,
		kind: page.kind,
		score: scorePage(page, query, mode),
		snippet: buildPageSnippet(page, query),
		searchMode: mode,
		...buildWikiResultMetadata(page),
		...buildClaimResultMetadata(matchingClaim)
	};
}
function toMemoryWikiSearchResult(result, mode) {
	return {
		corpus: "memory",
		path: result.path,
		title: buildMemorySearchTitle(result.path),
		kind: "memory",
		score: result.score,
		snippet: result.snippet,
		startLine: result.startLine,
		endLine: result.endLine,
		memorySource: result.source,
		searchMode: mode,
		...result.citation ? { citation: result.citation } : {}
	};
}
async function searchWikiCorpus(params) {
	const digest = await readQueryDigestBundle(params.config);
	const rootDir = params.config.vault.path;
	const candidatePaths = digest ? buildDigestCandidatePaths({
		digest,
		query: params.query,
		maxResults: params.maxResults,
		mode: params.mode
	}) : [];
	const seenPaths = /* @__PURE__ */ new Set();
	const candidatePages = candidatePaths.length > 0 ? await readQueryableWikiPagesByPaths(rootDir, candidatePaths) : await readQueryableWikiPages(rootDir);
	for (const page of candidatePages) seenPaths.add(page.relativePath);
	const results = candidatePages.filter(params.canReadPage).map((page) => toWikiSearchResult(page, params.query, params.mode)).filter((page) => page.score > 0);
	if (candidatePaths.length === 0 || results.length >= params.maxResults) return results;
	const remainingPages = (await readQueryableWikiPagesByPaths(rootDir, (await listWikiMarkdownFiles(rootDir)).filter((relativePath) => !seenPaths.has(relativePath)))).filter(params.canReadPage);
	return [...results, ...remainingPages.map((page) => toWikiSearchResult(page, params.query, params.mode)).filter((page) => page.score > 0)];
}
function resolveDigestClaimLookup(digest, lookup) {
	const claimId = lookup.trim().replace(/^claim:/i, "");
	return digest.claims.find((claim) => claim.id === claimId)?.pagePath ?? null;
}
function resolveQueryableWikiPageByLookup(pages, lookup) {
	const key = normalizeLookupKey(lookup);
	const withExtension = key.endsWith(".md") ? key : `${key}.md`;
	return pages.find((page) => page.relativePath === key) ?? pages.find((page) => page.relativePath === withExtension) ?? pages.find((page) => page.relativePath.replace(/\.md$/i, "") === key) ?? pages.find((page) => path.basename(page.relativePath, ".md") === key) ?? pages.find((page) => page.id === key) ?? null;
}
async function searchMemoryWiki(input) {
	const agentId = resolveActiveMemoryAgentId(input);
	const params = agentId ? {
		...input,
		agentId
	} : input;
	const protectedSessionRecall = params.conversationRecall?.corpus === "sessions";
	const effectiveConfig = applySearchOverrides(params.config, protectedSessionRecall ? {
		searchBackend: params.config.search.backend,
		searchCorpus: "memory"
	} : params);
	assertSessionVisibilityAppConfig({
		config: effectiveConfig,
		appConfig: params.appConfig,
		...params.agentId ? { agentId: params.agentId } : {},
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed,
		operation: "wiki_search"
	});
	await initializeMemoryWikiVault(effectiveConfig);
	const maxResults = normalizePositiveInteger(params.maxResults, 10);
	const mode = params.mode ?? "auto";
	const wikiResults = shouldSearchWiki(effectiveConfig) ? await searchWikiCorpus({
		config: effectiveConfig,
		query: params.query,
		maxResults,
		mode,
		canReadPage: createWikiPageVisibilityFilter(params)
	}) : [];
	const sharedMemoryManager = shouldSearchSharedMemory(effectiveConfig, params.appConfig) ? await resolveActiveMemoryManager({
		appConfig: params.appConfig,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey
	}) : null;
	if (sharedMemoryManager && typeof sharedMemoryManager.search !== "function") throw buildMemoryManagerContractError("search");
	let rawMemoryResults = sharedMemoryManager ? await sharedMemoryManager.search(params.query, {
		maxResults,
		...protectedSessionRecall ? {
			sources: ["sessions"],
			sessionKey: params.agentSessionKey
		} : {}
	}) : [];
	if (params.appConfig && shouldEnforceSessionVisibility(params) && (params.conversationRecall || rawMemoryResults.some((hit) => hit.source === "sessions"))) rawMemoryResults = await filterMemorySearchHitsBySessionVisibility({
		cfg: params.appConfig,
		agentId: params.agentId,
		requesterSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed === true,
		hits: rawMemoryResults,
		conversationRecall: params.conversationRecall,
		trustedAgentScope: !params.agentSessionKey && Boolean(params.agentId?.trim())
	});
	return mergeWikiSearchCorpusResults({
		wikiResults,
		memoryResults: rawMemoryResults.map((result) => toMemoryWikiSearchResult(result, mode)),
		maxResults,
		balanceCorpora: effectiveConfig.search.corpus === "all"
	});
}
async function getMemoryWikiPage(input) {
	const agentId = resolveActiveMemoryAgentId(input);
	const params = agentId ? {
		...input,
		agentId
	} : input;
	const effectiveConfig = applySearchOverrides(params.config, params);
	assertSessionVisibilityAppConfig({
		config: effectiveConfig,
		appConfig: params.appConfig,
		...params.agentId ? { agentId: params.agentId } : {},
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed,
		operation: "wiki_get"
	});
	await initializeMemoryWikiVault(effectiveConfig);
	const fromLine = normalizePositiveInteger(params.fromLine, 1);
	const lineCount = normalizePositiveInteger(params.lineCount, 200);
	if (shouldSearchWiki(effectiveConfig)) {
		const canReadPage = createWikiPageVisibilityFilter(params);
		const digest = await readQueryDigestBundle(effectiveConfig);
		const digestClaimPagePath = digest ? resolveDigestClaimLookup(digest, params.lookup) : null;
		const digestLookupPage = digestClaimPagePath ? (await readQueryableWikiPagesByPaths(effectiveConfig.vault.path, [digestClaimPagePath])).find(canReadPage) ?? null : null;
		const pages = digestLookupPage ? [digestLookupPage] : (await readQueryableWikiPages(effectiveConfig.vault.path)).filter(canReadPage);
		const page = digestLookupPage ?? resolveQueryableWikiPageByLookup(pages, params.lookup);
		if (page) {
			const lines = parseWikiMarkdown(page.raw).body.split(/\r?\n/);
			const totalLines = lines.length;
			const slice = lines.slice(fromLine - 1, fromLine - 1 + lineCount).join("\n");
			const truncated = fromLine - 1 + lineCount < totalLines;
			return {
				corpus: "wiki",
				path: page.relativePath,
				title: page.title,
				kind: page.kind,
				content: slice,
				fromLine,
				lineCount,
				totalLines,
				truncated,
				...buildWikiResultMetadata(page)
			};
		}
	}
	if (!shouldSearchSharedMemory(effectiveConfig, params.appConfig)) return null;
	const manager = await resolveActiveMemoryManager({
		appConfig: params.appConfig,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey
	});
	if (!manager) return null;
	if (typeof manager.readFile !== "function") throw buildMemoryManagerContractError("readFile");
	const lookupCandidates = buildLookupCandidates(params.lookup);
	const visibleSessionPaths = params.appConfig && shouldEnforceSessionVisibility(params) && lookupCandidates.some((relPath) => isSessionMemoryPath(relPath)) ? new Set((await filterMemorySearchHitsBySessionVisibility({
		cfg: params.appConfig,
		agentId: params.agentId,
		requesterSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed === true,
		conversationRecall: params.conversationRecall,
		trustedAgentScope: !params.agentSessionKey && Boolean(params.agentId?.trim()),
		hits: lookupCandidates.filter((relPath) => isSessionMemoryPath(relPath)).map((relPath) => ({
			path: relPath,
			startLine: 1,
			endLine: 1,
			score: 0,
			snippet: "",
			source: "sessions"
		}))
	})).map((hit) => hit.path)) : null;
	for (const relPath of lookupCandidates) {
		if (!relPath.endsWith(".md") || visibleSessionPaths && isSessionMemoryPath(relPath) && !visibleSessionPaths.has(relPath)) continue;
		const result = await manager.readFile({
			relPath,
			from: fromLine,
			lines: lineCount
		});
		if (result.path === relPath && result.text === "" && result.from === void 0) continue;
		return {
			corpus: "memory",
			path: result.path,
			title: buildMemorySearchTitle(result.path),
			kind: "memory",
			content: result.text,
			fromLine,
			lineCount
		};
	}
	return null;
}
//#endregion
//#region extensions/memory-wiki/src/apply.ts
const GENERATED_START = "<!-- openclaw:wiki:generated:start -->";
const GENERATED_END = "<!-- openclaw:wiki:generated:end -->";
const HUMAN_START = "<!-- openclaw:human:start -->";
const HUMAN_END = "<!-- openclaw:human:end -->";
function normalizeMutationConfidence(params, options) {
	if (options.allowNull && params.confidence === null) return null;
	return readFiniteNumberParam(params, "confidence", {
		min: 0,
		max: 1
	});
}
function normalizeMemoryWikiMutationOp(op) {
	if (op === "synthesis") return "create_synthesis";
	if (op === "metadata") return "update_metadata";
	return op;
}
function normalizeMemoryWikiMutationInput(rawParams) {
	const params = asNonArrayRecord(rawParams);
	if (normalizeMemoryWikiMutationOp(params.op) === "create_synthesis") {
		if (!params.title?.trim()) throw new Error("wiki mutation requires title for create_synthesis.");
		if (!params.body?.trim()) throw new Error("wiki mutation requires body for create_synthesis.");
		if (!params.sourceIds || params.sourceIds.length === 0) throw new Error("wiki mutation requires at least one sourceId for create_synthesis.");
		const confidence = normalizeMutationConfidence(params, { allowNull: false });
		return {
			op: "create_synthesis",
			title: params.title,
			body: params.body,
			sourceIds: params.sourceIds,
			...Array.isArray(params.claims) ? { claims: normalizeWikiClaims(params.claims) } : {},
			...params.contradictions ? { contradictions: params.contradictions } : {},
			...params.questions ? { questions: params.questions } : {},
			...typeof confidence === "number" ? { confidence } : {},
			...params.status ? { status: params.status } : {}
		};
	}
	if (!params.lookup?.trim()) throw new Error("wiki mutation requires lookup for update_metadata.");
	const confidence = normalizeMutationConfidence(params, { allowNull: true });
	return {
		op: "update_metadata",
		lookup: params.lookup,
		...params.sourceIds ? { sourceIds: params.sourceIds } : {},
		...Array.isArray(params.claims) ? { claims: normalizeWikiClaims(params.claims) } : {},
		...params.contradictions ? { contradictions: params.contradictions } : {},
		...params.questions ? { questions: params.questions } : {},
		...confidence !== void 0 ? { confidence } : {},
		...params.status ? { status: params.status } : {}
	};
}
function normalizeUniqueStrings(values) {
	if (!values) return;
	return uniqueStrings(normalizeStringEntries(values));
}
function ensureHumanNotesBlock(body) {
	if (body.includes(HUMAN_START) && body.includes(HUMAN_END)) return body;
	const trimmed = body.trimEnd();
	return `${trimmed.length > 0 ? `${trimmed}\n\n` : ""}## Notes\n${HUMAN_START}\n${HUMAN_END}\n`;
}
function buildSynthesisBody(params) {
	return ensureHumanNotesBlock(replaceManagedMarkdownBlock({
		original: params.originalBody?.trim().length ? params.originalBody : `# ${params.title}\n\n## Notes\n${HUMAN_START}\n${HUMAN_END}\n`,
		heading: "## Summary",
		startMarker: GENERATED_START,
		endMarker: GENERATED_END,
		body: params.generatedBody
	}));
}
function isMissingWikiPageError(error) {
	return error instanceof FsSafeError && error.code === "not-found";
}
async function readExistingWikiPage(root, pagePath) {
	try {
		return await root.readText(pagePath);
	} catch {
		try {
			return await root.readText(pagePath);
		} catch (retryError) {
			if (isMissingWikiPageError(retryError)) return "";
			throw retryError;
		}
	}
}
async function writeWikiPage(params) {
	const root$2 = await root(params.rootDir);
	const rendered = withTrailingNewline(renderWikiMarkdown({
		frontmatter: params.frontmatter,
		body: params.body
	}));
	if (await readExistingWikiPage(root$2, params.relativePath) === rendered) return false;
	await root$2.write(params.relativePath, rendered);
	return true;
}
async function resolveWritablePage(params) {
	return resolveQueryableWikiPageByLookup(await readQueryableWikiPages(params.config.vault.path), params.lookup);
}
async function applyCreateSynthesisMutation(params) {
	const slug = slugifyWikiSegment(params.mutation.title);
	const pageStem = slugifyWikiPageStem(params.mutation.title);
	const pagePath = path.join("syntheses", `${pageStem}.md`).replace(/\\/g, "/");
	const parsed = parseWikiMarkdown(await readExistingWikiPage(await root(params.config.vault.path), pagePath));
	const pageId = typeof parsed.frontmatter.id === "string" && parsed.frontmatter.id.trim() || `synthesis.${slug}`;
	return {
		changed: await writeWikiPage({
			rootDir: params.config.vault.path,
			relativePath: pagePath,
			frontmatter: {
				...parsed.frontmatter,
				pageType: "synthesis",
				id: pageId,
				title: params.mutation.title,
				sourceIds: normalizeSourceIds(params.mutation.sourceIds),
				...params.mutation.claims ? { claims: normalizeWikiClaims(params.mutation.claims) } : {},
				...normalizeUniqueStrings(params.mutation.contradictions) ? { contradictions: normalizeUniqueStrings(params.mutation.contradictions) } : {},
				...normalizeUniqueStrings(params.mutation.questions) ? { questions: normalizeUniqueStrings(params.mutation.questions) } : {},
				...typeof params.mutation.confidence === "number" ? { confidence: params.mutation.confidence } : {},
				status: params.mutation.status?.trim() || "active",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			},
			body: buildSynthesisBody({
				title: params.mutation.title,
				originalBody: parsed.body,
				generatedBody: params.mutation.body.trim()
			})
		}),
		pagePath,
		pageId
	};
}
function buildUpdatedFrontmatter(params) {
	const frontmatter = {
		...params.original,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (params.mutation.sourceIds) frontmatter.sourceIds = normalizeSourceIds(params.mutation.sourceIds);
	if (params.mutation.claims) {
		const claims = normalizeWikiClaims(params.mutation.claims);
		if (claims.length > 0) frontmatter.claims = claims;
		else delete frontmatter.claims;
	}
	if (params.mutation.contradictions) {
		const contradictions = normalizeUniqueStrings(params.mutation.contradictions) ?? [];
		if (contradictions.length > 0) frontmatter.contradictions = contradictions;
		else delete frontmatter.contradictions;
	}
	if (params.mutation.questions) {
		const questions = normalizeUniqueStrings(params.mutation.questions) ?? [];
		if (questions.length > 0) frontmatter.questions = questions;
		else delete frontmatter.questions;
	}
	if (params.mutation.confidence === null) delete frontmatter.confidence;
	else if (typeof params.mutation.confidence === "number") frontmatter.confidence = params.mutation.confidence;
	if (params.mutation.status?.trim()) frontmatter.status = params.mutation.status.trim();
	return frontmatter;
}
async function applyUpdateMetadataMutation(params) {
	const page = await resolveWritablePage({
		config: params.config,
		lookup: params.mutation.lookup
	});
	if (!page) throw new Error(`Wiki page not found: ${params.mutation.lookup}`);
	const parsed = parseWikiMarkdown(page.raw);
	return {
		changed: await writeWikiPage({
			rootDir: params.config.vault.path,
			relativePath: page.relativePath,
			frontmatter: buildUpdatedFrontmatter({
				original: parsed.frontmatter,
				mutation: params.mutation
			}),
			body: parsed.body
		}),
		pagePath: page.relativePath,
		...page.id ? { pageId: page.id } : {}
	};
}
async function applyMemoryWikiMutationUnlocked(params) {
	await initializeMemoryWikiVault(params.config);
	const result = params.mutation.op === "create_synthesis" ? await applyCreateSynthesisMutation({
		config: params.config,
		mutation: params.mutation
	}) : await applyUpdateMetadataMutation({
		config: params.config,
		mutation: params.mutation
	});
	const compile = await compileMemoryWikiVault(params.config);
	return {
		changed: result.changed,
		operation: params.mutation.op,
		pagePath: result.pagePath,
		...result.pageId ? { pageId: result.pageId } : {},
		compile
	};
}
async function applyMemoryWikiMutation(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, () => applyMemoryWikiMutationUnlocked(params));
}
//#endregion
//#region extensions/memory-wiki/src/chatgpt-import.ts
const CHATGPT_PREFERENCE_SIGNAL_RE = /\b(prefer|prefers|preference|want|wants|need|needs|avoid|avoids|hate|hates|love|loves|default to|should default to|always use|don't want|does not want|likes|dislikes)\b/i;
const HUMAN_START_MARKER = "<!-- openclaw:human:start -->";
const HUMAN_END_MARKER = "<!-- openclaw:human:end -->";
const MAX_ROLLBACK_RECREATE_ATTEMPTS = 32;
const CHATGPT_RISK_RULES = [
	{
		label: "relationships",
		pattern: /\b(relationship|dating|breakup|jealous|sex|intimacy|partner|apology|trust|boyfriend|girlfriend|husband|wife)\b/i
	},
	{
		label: "health",
		pattern: /\b(supplement|medication|diagnosis|symptom|therapy|depression|anxiety|mri|migraine|injury|pain|cortisol|sleep)\b/i
	},
	{
		label: "legal_tax",
		pattern: /\b(contract|tax|legal|law|lawsuit|visa|immigration|license|insurance|claim|non-residence|residency)\b/i
	},
	{
		label: "finance",
		pattern: /\b(investment|invest|portfolio|dividend|yield|coupon|valuation|mortgage|loan|crypto|covered call|call option|put option)\b/i
	},
	{
		label: "drugs",
		pattern: /\b(vape|weed|cannabis|nicotine|opioid|ketamine)\b/i
	}
];
function normalizeWhitespace(value) {
	return value.trim().replace(/\s+/g, " ");
}
function isMissingConversationPageError(error) {
	return asNullableRecord(error)?.code === "ENOENT";
}
async function readExistingConversationPage(absolutePath) {
	try {
		return await fs$1.readFile(absolutePath, "utf8");
	} catch {
		try {
			return await fs$1.readFile(absolutePath, "utf8");
		} catch (retryError) {
			if (isMissingConversationPageError(retryError)) return "";
			throw retryError;
		}
	}
}
function resolveConversationSourcePath(exportInputPath) {
	const resolved = path.resolve(exportInputPath);
	return {
		exportPath: resolved,
		conversationsPath: resolved.endsWith(".json") ? resolved : path.join(resolved, "conversations.json")
	};
}
async function loadConversations(exportInputPath) {
	const { exportPath, conversationsPath } = resolveConversationSourcePath(exportInputPath);
	const raw = await fs$1.readFile(conversationsPath, "utf8");
	const parsed = JSON.parse(raw);
	const conversations = Array.isArray(parsed) ? parsed : Object.values(asNullableRecord(parsed) ?? {}).find(Array.isArray);
	if (!conversations) throw new Error(`Unrecognized ChatGPT conversations export format: ${conversationsPath}`);
	return {
		exportPath,
		conversationsPath,
		conversations: conversations.filter(isRecord)
	};
}
function isoFromUnix(raw) {
	if (typeof raw !== "number" && typeof raw !== "string") return;
	const numeric = Number(raw);
	if (!Number.isFinite(numeric)) return;
	return timestampMsToIsoString(numeric * 1e3);
}
function cleanMessageText(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if ((trimmed.includes("asset_pointer") || trimmed.includes("image_asset_pointer") || trimmed.includes("dalle") || trimmed.includes("file_service")) && trimmed.length > 40) return "";
	if (trimmed.startsWith("{") && trimmed.length > 80 && (trimmed.includes(":") || trimmed.includes("content_type"))) {
		const textMatch = trimmed.match(/["']text["']\s*:\s*(["'])(.+?)\1/s);
		return textMatch?.[2] ? normalizeWhitespace(textMatch[2]) : "";
	}
	return trimmed;
}
function extractMessageText(message) {
	const content = asNullableRecord(message.content);
	if (content) {
		const parts = content.parts;
		if (Array.isArray(parts)) {
			const collected = [];
			for (const part of parts) {
				if (typeof part === "string") {
					const cleaned = cleanMessageText(part);
					if (cleaned) collected.push(cleaned);
					continue;
				}
				const partRecord = asNullableRecord(part);
				if (partRecord && typeof partRecord.text === "string" && partRecord.text.trim()) collected.push(partRecord.text.trim());
			}
			return collected.join("\n").trim();
		}
		if (typeof content.text === "string") return cleanMessageText(content.text);
	}
	return typeof message.text === "string" ? cleanMessageText(message.text) : "";
}
function activeBranchMessages(conversation) {
	const mapping = asNullableRecord(conversation.mapping);
	if (!mapping) return [];
	let currentNode = typeof conversation.current_node === "string" ? conversation.current_node : void 0;
	const seen = /* @__PURE__ */ new Set();
	const chain = [];
	while (currentNode && !seen.has(currentNode)) {
		seen.add(currentNode);
		const node = asNullableRecord(mapping[currentNode]);
		if (!node) break;
		const message = asNullableRecord(node.message);
		if (message) {
			const author = asNullableRecord(message.author);
			const role = typeof author?.role === "string" ? author.role : "unknown";
			const text = extractMessageText(message);
			if (text) chain.push({
				role,
				text
			});
		}
		currentNode = typeof node.parent === "string" ? node.parent : void 0;
	}
	return chain.toReversed();
}
function inferRisk(title, sampleText) {
	const blob = `${title}\n${sampleText}`.toLowerCase();
	const reasons = CHATGPT_RISK_RULES.filter((rule) => rule.pattern.test(blob)).map((rule) => rule.label);
	if (reasons.length > 0) return {
		level: "high",
		reasons: uniqueStrings(reasons)
	};
	if (/\b(career|job|salary|interview|offer|resume|cover letter)\b/i.test(blob)) return {
		level: "medium",
		reasons: ["work_career"]
	};
	return {
		level: "low",
		reasons: []
	};
}
function inferLabels(title, sampleText) {
	const blob = `${title}\n${sampleText}`.toLowerCase();
	const labels = /* @__PURE__ */ new Set(["domain/personal"]);
	const addAreaTopic = (area, topics) => {
		labels.add(area);
		for (const topic of topics) labels.add(topic);
	};
	const hasTranslation = /\b(translate|translation|traduc\w*|traducc\w*|traduç\w*|traducci[oó]n|traduccio|traducció|traduzione)\b/i.test(blob);
	const hasLearning = /\b(anki|flashcards?|grammar|conjugat\w*|declension|pronunciation|vocab(?:ular(?:y|io))?|lesson|tutor|teacher|jlpt|kanji|hiragana|katakana|study|learn|practice)\b/i.test(blob);
	const hasLanguageName = /\b(japanese|portuguese|catalan|castellano|espa[nñ]ol|franc[eé]s|french|italian|german|spanish)\b/i.test(blob);
	if (hasTranslation) labels.add("topic/translation");
	if (hasLearning || hasLanguageName && /\b(learn|study|practice|lesson|tutor|grammar)\b/i.test(blob)) addAreaTopic("area/language-learning", ["topic/language-learning"]);
	if (/\b(hike|trail|hotel|flight|trip|travel|airport|itinerary|booking|airbnb|train|stay)\b/i.test(blob)) {
		labels.add("area/travel");
		labels.add("topic/travel");
	}
	if (/\b(recipe|cook|cooking|bread|sourdough|pizza|espresso|coffee|mousse|cast iron|meatballs?)\b/i.test(blob)) addAreaTopic("area/cooking", ["topic/cooking"]);
	if (/\b(garden|orchard|plant|soil|compost|agroforestry|permaculture|mulch|beds?|irrigation|seeds?)\b/i.test(blob)) addAreaTopic("area/gardening", ["topic/gardening"]);
	if (/\b(dating|relationship|partner|jealous|breakup|trust)\b/i.test(blob)) addAreaTopic("area/relationships", ["topic/relationships"]);
	if (/\b(investment|invest|portfolio|dividend|yield|coupon|valuation|return|mortgage|loan|kraken|crypto|covered call|call option|put option|option chain|bond|stocks?)\b/i.test(blob)) addAreaTopic("area/finance", ["topic/finance"]);
	if (/\b(contract|mou|tax|impuesto|legal|law|lawsuit|visa|immigration|license|licencia|dispute|claim|insurance|non-residence|residency)\b/i.test(blob)) addAreaTopic("area/legal-tax", ["topic/legal-tax"]);
	if (/\b(supplement|medication|diagnos(?:is|e)|symptom|therapy|depress(?:ion|ed)|anxiet(?:y|ies)|mri|migraine|injur(?:y|ies)|pain|cortisol|sleep|dentist|dermatolog(?:ist|y))\b/i.test(blob)) addAreaTopic("area/health", ["topic/health"]);
	if (/\b(book (an )?appointment|rebook|open (a )?new account|driving test|exam|gestor(?:a)?|itv)\b/i.test(blob)) addAreaTopic("area/life-admin", ["topic/life-admin"]);
	if (/\b(frc|robot|robotics|wpilib|limelight|chiefdelphi)\b/i.test(blob)) addAreaTopic("area/work", ["topic/robotics"]);
	else if (/\b(docker|git|python|node|npm|pip|sql|postgres|api|bug|stack trace|permission denied)\b/i.test(blob)) addAreaTopic("area/work", ["topic/software"]);
	else if (/\b(job|interview|cover letter|resume|cv)\b/i.test(blob)) addAreaTopic("area/work", ["topic/career"]);
	if (/\b(wifi|wi-fi|starlink|router|mesh|network|orbi|milesight|coverage)\b/i.test(blob)) addAreaTopic("area/home", ["topic/home-infrastructure"]);
	if (/\b(p38|range rover|porsche|bmw|bobcat|excavator|auger|trailer|chainsaw|stihl)\b/i.test(blob)) addAreaTopic("area/vehicles", ["topic/vehicles"]);
	if (![...labels].some((label) => label.startsWith("area/"))) labels.add("area/other");
	return [...labels];
}
function collectPreferenceSignals(userTexts) {
	const signals = [];
	const seen = /* @__PURE__ */ new Set();
	for (const text of userTexts.slice(0, 25)) for (const rawLine of text.split(/\r?\n/)) {
		const line = normalizeWhitespace(rawLine);
		if (!line || !CHATGPT_PREFERENCE_SIGNAL_RE.test(line)) continue;
		const key = line.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		signals.push(line);
		if (signals.length >= 10) return signals;
	}
	return signals;
}
function buildTranscript(messages) {
	if (messages.length === 0) return "_No active-branch transcript could be reconstructed._";
	return messages.flatMap((message) => [
		`### ${message.role[0]?.toUpperCase() ?? "U"}${message.role.slice(1)}`,
		"",
		message.text,
		""
	]).join("\n").trim();
}
function resolveConversationPagePath(record) {
	const conversationSlug = record.conversationId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
	const pageId = `source.chatgpt.${conversationSlug || createHash("sha1").update(record.conversationId).digest("hex").slice(0, 12)}`;
	const datePrefix = record.createdAt?.slice(0, 10) ?? "undated";
	const shortId = conversationSlug.slice(0, 8) || "export";
	return {
		pageId,
		pagePath: path.join("sources", `chatgpt-${datePrefix}-${conversationSlug || shortId}.md`).replace(/\\/g, "/")
	};
}
function toConversationRecord(conversation, sourcePath) {
	const conversationId = typeof conversation.conversation_id === "string" ? conversation.conversation_id.trim() : "";
	if (!conversationId) return null;
	const title = typeof conversation.title === "string" && conversation.title.trim() ? conversation.title.trim() : "Untitled conversation";
	const transcript = activeBranchMessages(conversation);
	const userTexts = transcript.filter((entry) => entry.role === "user").map((entry) => entry.text);
	const assistantTexts = transcript.filter((entry) => entry.role === "assistant");
	const sampleText = userTexts.slice(0, 6).join("\n");
	const risk = inferRisk(title, sampleText);
	const labels = inferLabels(title, sampleText);
	const { pageId, pagePath } = resolveConversationPagePath({
		conversationId,
		createdAt: isoFromUnix(conversation.create_time)
	});
	return {
		conversationId,
		title,
		createdAt: isoFromUnix(conversation.create_time),
		updatedAt: isoFromUnix(conversation.update_time) ?? isoFromUnix(conversation.create_time),
		sourcePath,
		pageId,
		pagePath,
		labels,
		risk,
		userMessageCount: userTexts.length,
		assistantMessageCount: assistantTexts.length,
		preferenceSignals: risk.level === "low" ? collectPreferenceSignals(userTexts) : [],
		firstUserLine: userTexts[0]?.split(/\r?\n/)[0]?.trim(),
		lastUserLine: userTexts.at(-1)?.split(/\r?\n/)[0]?.trim(),
		transcript
	};
}
function renderConversationPage(record) {
	const autoDigestLines = record.risk.level === "low" ? [
		`- User messages: ${record.userMessageCount}`,
		`- Assistant messages: ${record.assistantMessageCount}`,
		...record.firstUserLine ? [`- First user line: ${record.firstUserLine}`] : [],
		...record.lastUserLine ? [`- Last user line: ${record.lastUserLine}`] : [],
		...record.preferenceSignals.length > 0 ? ["- Preference signals:", ...record.preferenceSignals.map((line) => `  - ${line}`)] : ["- Preference signals: none detected"]
	] : ["- Auto digest withheld from durable-candidate generation until reviewed.", `- Risk reasons: ${record.risk.reasons.length > 0 ? record.risk.reasons.join(", ") : "none recorded"}`];
	return renderWikiMarkdown({
		frontmatter: {
			pageType: "source",
			id: record.pageId,
			title: `ChatGPT Export: ${record.title}`,
			sourceType: "chatgpt-export",
			sourceSystem: "chatgpt",
			sourcePath: record.sourcePath,
			conversationId: record.conversationId,
			riskLevel: record.risk.level,
			riskReasons: record.risk.reasons,
			labels: record.labels,
			status: "draft",
			...record.createdAt ? { createdAt: record.createdAt } : {},
			...record.updatedAt ? { updatedAt: record.updatedAt } : {}
		},
		body: [
			`# ChatGPT Export: ${record.title}`,
			"",
			"## Source",
			`- Conversation id: \`${record.conversationId}\``,
			`- Export file: \`${record.sourcePath}\``,
			...record.createdAt ? [`- Created: ${record.createdAt}`] : [],
			...record.updatedAt ? [`- Updated: ${record.updatedAt}`] : [],
			"",
			"## Auto Triage",
			`- Risk level: \`${record.risk.level}\``,
			`- Labels: ${record.labels.join(", ")}`,
			`- Active-branch messages: ${record.transcript.length}`,
			"",
			"## Auto Digest",
			...autoDigestLines,
			"",
			"## Active Branch Transcript",
			buildTranscript(record.transcript),
			"",
			"## Notes",
			HUMAN_START_MARKER,
			HUMAN_END_MARKER,
			""
		].join("\n")
	});
}
function replaceSimpleManagedBlock(params) {
	const escapedStart = params.startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const escapedEnd = params.endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const blockPattern = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`);
	return params.original.replace(blockPattern, () => params.replacement);
}
function extractSimpleManagedBlock(params) {
	const escapedStart = params.startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const escapedEnd = params.endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const blockPattern = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`);
	return params.body.match(blockPattern)?.[0] ?? null;
}
function extractManagedBlockBody(params) {
	const escapedStart = params.startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const escapedEnd = params.endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const blockPattern = new RegExp(`${escapedStart}\\n?([\\s\\S]*?)\\n?${escapedEnd}`);
	const captured = params.body.match(blockPattern)?.[1];
	return typeof captured === "string" ? captured.trim() : null;
}
function preserveExistingPageBlocks(rendered, existing) {
	if (!existing.trim()) return withTrailingNewline(rendered);
	const parsedExisting = parseWikiMarkdown(existing);
	const parsedRendered = parseWikiMarkdown(rendered);
	let nextBody = parsedRendered.body;
	const humanBlock = extractSimpleManagedBlock({
		body: parsedExisting.body,
		startMarker: HUMAN_START_MARKER,
		endMarker: HUMAN_END_MARKER
	});
	if (humanBlock) nextBody = replaceSimpleManagedBlock({
		original: nextBody,
		startMarker: HUMAN_START_MARKER,
		endMarker: HUMAN_END_MARKER,
		replacement: humanBlock
	});
	const relatedBody = extractManagedBlockBody({
		body: parsedExisting.body,
		startMarker: WIKI_RELATED_START_MARKER,
		endMarker: WIKI_RELATED_END_MARKER
	});
	if (relatedBody) nextBody = replaceManagedMarkdownBlock({
		original: nextBody,
		heading: "## Related",
		startMarker: WIKI_RELATED_START_MARKER,
		endMarker: WIKI_RELATED_END_MARKER,
		body: relatedBody
	});
	return withTrailingNewline(renderWikiMarkdown({
		frontmatter: parsedRendered.frontmatter,
		body: nextBody
	}));
}
function buildRunId(exportPath, nowIso) {
	const seed = `${exportPath}:${nowIso}:${Math.random()}`;
	return `chatgpt-${createHash("sha1").update(seed).digest("hex").slice(0, 12)}`;
}
function normalizeConversationActions(records, operations) {
	return records.map((record) => ({
		conversationId: record.conversationId,
		title: record.title,
		pagePath: record.pagePath,
		operation: operations.get(record.pagePath) ?? "skip",
		riskLevel: record.risk.level,
		labels: record.labels,
		userMessageCount: record.userMessageCount,
		assistantMessageCount: record.assistantMessageCount,
		preferenceSignals: record.preferenceSignals
	}));
}
async function writeImportRunRecord(vaultRoot, record) {
	await writeMemoryWikiImportRunRecord(vaultRoot, record);
}
async function readImportRunRecord(vaultRoot, runId) {
	const record = await readMemoryWikiImportRunRecord(vaultRoot, runId);
	if (!record) throw new Error(`Memory Wiki import run not found: ${runId}`);
	return record;
}
const MACHINE_RELATED_BLOCK_PATTERN = new RegExp(`(?:^|\\n\\n)## Related\\n${WIKI_RELATED_START_MARKER}\\n[\\s\\S]*?\\n${WIKI_RELATED_END_MARKER}`, "g");
function hashChatGptImportContent(content) {
	const importOwnedContent = content.replace(MACHINE_RELATED_BLOCK_PATTERN, "");
	return createHash("sha256").update(importOwnedContent, "utf8").digest("hex");
}
async function writeTrackedImportPage(params) {
	const absolutePath = path.join(params.vaultRoot, params.relativePath);
	if (params.existing === params.rendered) return "skip";
	const contentHash = hashChatGptImportContent(params.rendered);
	await fs$1.mkdir(path.dirname(absolutePath), { recursive: true });
	if (!params.existing) {
		await fs$1.writeFile(absolutePath, params.rendered, "utf8");
		params.record.createdPaths.push({
			path: params.relativePath,
			contentHash
		});
		return "create";
	}
	const snapshotHash = createHash("sha1").update(params.relativePath).digest("hex").slice(0, 12);
	const snapshotRelativePath = path.join("snapshots", `${snapshotHash}.md`).replace(/\\/g, "/");
	const snapshotAbsolutePath = path.join(params.runDir, snapshotRelativePath);
	await fs$1.mkdir(path.dirname(snapshotAbsolutePath), { recursive: true });
	await fs$1.writeFile(snapshotAbsolutePath, params.existing, "utf8");
	await fs$1.writeFile(absolutePath, params.rendered, "utf8");
	params.record.updatedPaths.push({
		path: params.relativePath,
		snapshotPath: snapshotRelativePath,
		contentHash
	});
	return "update";
}
async function importChatGptConversationsUnlocked(params) {
	await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
	const { exportPath, conversationsPath, conversations } = await loadConversations(params.exportPath);
	const records = conversations.map((conversation) => toConversationRecord(conversation, conversationsPath)).filter((entry) => entry !== null).toSorted((left, right) => left.pagePath.localeCompare(right.pagePath));
	const operations = /* @__PURE__ */ new Map();
	let createdCount = 0;
	let updatedCount = 0;
	let skippedCount = 0;
	let runId;
	const nowIso = resolveMemoryWikiTimestamp(params.nowMs);
	const importPlans = [];
	for (const record of records) {
		const rendered = renderConversationPage(record);
		const existing = await readExistingConversationPage(path.join(params.config.vault.path, record.pagePath));
		const stabilized = preserveExistingPageBlocks(rendered, existing);
		const operation = existing === stabilized ? "skip" : existing ? "update" : "create";
		operations.set(record.pagePath, operation);
		if (operation === "create") createdCount += 1;
		else if (operation === "update") updatedCount += 1;
		else skippedCount += 1;
		importPlans.push({
			relativePath: record.pagePath,
			existing,
			rendered: stabilized,
			operation
		});
	}
	let importRunRecord;
	const changedCount = createdCount + updatedCount;
	if (!params.dryRun && changedCount > 0) {
		const requiredStateRows = 1 + changedCount;
		const projectedStateRows = await countMemoryWikiImportRunStateRows() + requiredStateRows;
		if (projectedStateRows > 2e4) throw new Error(`Memory Wiki ChatGPT import exceeds SQLite import-run entry limit (${projectedStateRows}/${MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES})`);
		runId = buildRunId(exportPath, nowIso);
		const importRunDir = path.join(resolveMemoryWikiImportRunsDir(params.config.vault.path), runId);
		importRunRecord = {
			version: 1,
			runId,
			importType: "chatgpt",
			exportPath,
			sourcePath: conversationsPath,
			appliedAt: nowIso,
			conversationCount: records.length,
			createdCount,
			updatedCount,
			skippedCount,
			createdPaths: [],
			updatedPaths: []
		};
		for (const plan of importPlans) {
			if (plan.operation === "skip") continue;
			await writeTrackedImportPage({
				vaultRoot: params.config.vault.path,
				runDir: importRunDir,
				relativePath: plan.relativePath,
				existing: plan.existing,
				rendered: plan.rendered,
				record: importRunRecord
			});
		}
	}
	let indexUpdatedFiles = [];
	if (!params.dryRun && importRunRecord) if (importRunRecord.createdPaths.length > 0 || importRunRecord.updatedPaths.length > 0) {
		indexUpdatedFiles = (await compileMemoryWikiVault(params.config)).updatedFiles;
		await writeImportRunRecord(params.config.vault.path, importRunRecord);
		await appendMemoryWikiLog(params.config.vault.path, {
			type: "ingest",
			timestamp: nowIso,
			details: {
				sourceType: "chatgpt-export",
				runId: importRunRecord.runId,
				exportPath,
				sourcePath: conversationsPath,
				conversationCount: records.length,
				createdCount: importRunRecord.createdPaths.length,
				updatedCount: importRunRecord.updatedPaths.length,
				skippedCount
			}
		});
	} else runId = void 0;
	return {
		dryRun: Boolean(params.dryRun),
		exportPath,
		sourcePath: conversationsPath,
		conversationCount: records.length,
		createdCount,
		updatedCount,
		skippedCount,
		actions: normalizeConversationActions(records, operations),
		pagePaths: records.map((record) => record.pagePath),
		...runId ? { runId } : {},
		indexUpdatedFiles
	};
}
async function importChatGptConversations(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, () => importChatGptConversationsUnlocked(params));
}
function toVaultRelativePath(vaultRoot, absolutePath) {
	return path.relative(vaultRoot, absolutePath).replace(/\\/g, "/");
}
function recoverySlotPrefix(ref) {
	return `${ref.kind}-${ref.index}-${createHash("sha256").update(ref.entry.path).digest("hex")}-`;
}
function resolveContainedImportPath(root, relativePath, label) {
	if (!relativePath || path.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath)) throw new Error(`${label} must be a relative path: ${relativePath}`);
	const resolvedRoot = path.resolve(root);
	const resolvedPath = path.resolve(resolvedRoot, relativePath);
	const relative = path.relative(resolvedRoot, resolvedPath);
	if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error(`${label} must stay inside ${resolvedRoot}: ${relativePath}`);
	return resolvedPath;
}
function buildRollbackEntryRefs(record) {
	return [...record.createdPaths.map((entry, index) => ({
		entry,
		kind: "created",
		index
	})), ...record.updatedPaths.map((entry, index) => ({
		entry,
		kind: "updated",
		index
	}))];
}
function listPreservedPaths(record) {
	return [...record.createdPaths, ...record.updatedPaths].flatMap((entry) => (entry.recoveryPaths ?? []).map((recoveryPath) => ({
		path: entry.path,
		recoveryPath
	})));
}
function isFsSafeErrorCode(error, code) {
	return error instanceof FsSafeError && error.code === code;
}
async function reserveRecoverySlot(runRoot, ref) {
	await runRoot.mkdir("recovered");
	const slotRelativePath = path.posix.join("recovered", `${recoverySlotPrefix(ref)}${randomUUID()}`);
	await runRoot.mkdir(slotRelativePath);
	return {
		slotRelativePath,
		contentRelativePath: path.posix.join(slotRelativePath, "content")
	};
}
async function removeEmptyRecoverySlot(runRoot, slotRelativePath) {
	try {
		if ((await runRoot.list(slotRelativePath)).length > 0) return;
		await runRoot.remove(slotRelativePath);
	} catch (error) {
		if (isFsSafeErrorCode(error, "not-found")) return;
		throw error;
	}
}
function recordRecoveryPath(entry, recoveryPath) {
	const recoveryPaths = entry.recoveryPaths ?? [];
	if (recoveryPaths.includes(recoveryPath)) return false;
	entry.recoveryPaths = [...recoveryPaths, recoveryPath];
	return true;
}
async function moveTargetToRecovery(params) {
	resolveContainedImportPath(params.vaultRoot.rootDir, params.ref.entry.path, "Memory Wiki import page path");
	for (;;) {
		const slot = await reserveRecoverySlot(params.runRoot, params.ref);
		const recoveryVaultRelativePath = path.posix.join(params.runRelativePath, slot.contentRelativePath);
		try {
			await params.vaultRoot.move(params.ref.entry.path, recoveryVaultRelativePath);
			return {
				ref: params.ref,
				...slot
			};
		} catch (error) {
			await removeEmptyRecoverySlot(params.runRoot, slot.slotRelativePath);
			if (isFsSafeErrorCode(error, "not-found")) return null;
			if (isFsSafeErrorCode(error, "already-exists")) continue;
			throw error;
		}
	}
}
async function scanRecoverySlots(params) {
	const refs = buildRollbackEntryRefs(params.record);
	const refsByPrefix = new Map(refs.map((ref) => [recoverySlotPrefix(ref), ref]));
	let slots;
	try {
		slots = await params.runRoot.list("recovered", { withFileTypes: true });
	} catch (error) {
		if (isFsSafeErrorCode(error, "not-found")) return [];
		throw error;
	}
	const recovered = [];
	for (const slot of slots) {
		if (!slot.isDirectory || slot.isSymbolicLink) continue;
		const prefix = /^(?:created|updated)-\d+-[a-f0-9]{64}-/.exec(slot.name)?.[0];
		const ref = prefix ? refsByPrefix.get(prefix) : void 0;
		if (!ref) continue;
		const slotRelativePath = path.posix.join("recovered", slot.name);
		recovered.push({
			ref,
			slotRelativePath,
			contentRelativePath: path.posix.join(slotRelativePath, "content")
		});
	}
	return recovered;
}
async function classifyRecoverySlots(params) {
	const seen = /* @__PURE__ */ new Set();
	let recordChanged = false;
	for (const slot of params.slots) {
		if (seen.has(slot.contentRelativePath)) continue;
		seen.add(slot.contentRelativePath);
		const { entry } = slot.ref;
		const recoveryPath = toVaultRelativePath(params.vaultRoot, path.join(params.runRoot.rootDir, slot.contentRelativePath));
		if (entry.recoveryPaths?.includes(recoveryPath)) continue;
		let recoveryHash = null;
		try {
			const stat = await params.runRoot.stat(slot.contentRelativePath);
			if (stat.isFile && !stat.isSymbolicLink) recoveryHash = hashChatGptImportContent(await params.runRoot.readText(slot.contentRelativePath));
		} catch (error) {
			if (isFsSafeErrorCode(error, "not-found")) {
				await removeEmptyRecoverySlot(params.runRoot, slot.slotRelativePath);
				continue;
			}
			throw error;
		}
		if (entry.contentHash && recoveryHash === entry.contentHash) {
			await params.runRoot.remove(slot.contentRelativePath);
			await removeEmptyRecoverySlot(params.runRoot, slot.slotRelativePath);
			continue;
		}
		recordChanged = recordRecoveryPath(entry, recoveryPath) || recordChanged;
	}
	return recordChanged;
}
async function targetMatchesSnapshot(vaultRoot, targetRelativePath, snapshot) {
	try {
		return hashChatGptImportContent(await vaultRoot.readText(targetRelativePath)) === hashChatGptImportContent(snapshot);
	} catch (error) {
		if (isFsSafeErrorCode(error, "not-found")) return false;
		throw error;
	}
}
async function rollbackChatGptImportRunUnlocked(params) {
	const vaultRoot = params.config.vault.path;
	const record = await readImportRunRecord(vaultRoot, params.runId);
	if (record.rolledBackAt) return {
		runId: record.runId,
		removedCount: 0,
		restoredCount: 0,
		preservedPaths: listPreservedPaths(record),
		pagePaths: [...record.createdPaths.map((entry) => entry.path), ...record.updatedPaths.map((entry) => entry.path)].toSorted((left, right) => left.localeCompare(right)),
		indexUpdatedFiles: [],
		alreadyRolledBack: true
	};
	const runDir = resolveContainedImportPath(resolveMemoryWikiImportRunsDir(vaultRoot), record.runId, "Memory Wiki import run id");
	const refs = buildRollbackEntryRefs(record);
	for (const ref of refs) {
		resolveContainedImportPath(vaultRoot, ref.entry.path, "Memory Wiki import page path");
		if (ref.entry.snapshotPath) resolveContainedImportPath(runDir, ref.entry.snapshotPath, "Memory Wiki import snapshot path");
	}
	if (!record.rollbackStartedAt) {
		record.rollbackStartedAt = (/* @__PURE__ */ new Date()).toISOString();
		await writeImportRunRecord(vaultRoot, record);
	}
	if (!record.rollbackTargetsFinalizedAt) {
		await initializeMemoryWikiVault(params.config);
		const vaultFs = await root(vaultRoot);
		const runRelativePath = toVaultRelativePath(vaultRoot, runDir);
		await vaultFs.mkdir(runRelativePath);
		const runFs = await root(runDir);
		if (await classifyRecoverySlots({
			vaultRoot,
			runRoot: runFs,
			slots: await scanRecoverySlots({
				runRoot: runFs,
				record
			})
		})) await writeImportRunRecord(vaultRoot, record);
		for (const ref of refs.filter((candidate) => candidate.kind === "created")) {
			let removed = false;
			for (let attempt = 0; attempt < MAX_ROLLBACK_RECREATE_ATTEMPTS; attempt += 1) {
				const slot = await moveTargetToRecovery({
					vaultRoot: vaultFs,
					runRoot: runFs,
					runRelativePath,
					ref
				});
				if (!slot) {
					removed = true;
					break;
				}
				if (await classifyRecoverySlots({
					vaultRoot,
					runRoot: runFs,
					slots: [slot]
				})) await writeImportRunRecord(vaultRoot, record);
			}
			if (!removed) throw new Error(`Memory Wiki rollback could not remove ${ref.entry.path} after ${MAX_ROLLBACK_RECREATE_ATTEMPTS} concurrent recreations`);
		}
		for (const ref of refs.filter((candidate) => candidate.kind === "updated")) {
			const { entry } = ref;
			if (!entry.snapshotPath) continue;
			resolveContainedImportPath(runDir, entry.snapshotPath, "Memory Wiki import snapshot path");
			const snapshot = await runFs.readText(entry.snapshotPath);
			resolveContainedImportPath(vaultRoot, entry.path, "Memory Wiki import page path");
			let restored = false;
			for (let attempt = 0; attempt < MAX_ROLLBACK_RECREATE_ATTEMPTS; attempt += 1) {
				if (await targetMatchesSnapshot(vaultFs, entry.path, snapshot)) {
					restored = true;
					break;
				}
				const slot = await moveTargetToRecovery({
					vaultRoot: vaultFs,
					runRoot: runFs,
					runRelativePath,
					ref
				});
				if (slot) {
					if (await classifyRecoverySlots({
						vaultRoot,
						runRoot: runFs,
						slots: [slot]
					})) await writeImportRunRecord(vaultRoot, record);
				}
				try {
					await vaultFs.create(entry.path, snapshot, {
						encoding: "utf8",
						mkdir: true
					});
					restored = true;
					break;
				} catch (error) {
					if (!isFsSafeErrorCode(error, "already-exists")) throw error;
				}
			}
			if (!restored) throw new Error(`Memory Wiki rollback could not restore ${entry.path} after ${MAX_ROLLBACK_RECREATE_ATTEMPTS} concurrent recreations`);
		}
		record.rollbackTargetsFinalizedAt = (/* @__PURE__ */ new Date()).toISOString();
		await writeImportRunRecord(vaultRoot, record);
	}
	const compile = await compileMemoryWikiVault(params.config, { sourcePageWrites: "preserve" });
	record.rolledBackAt = (/* @__PURE__ */ new Date()).toISOString();
	await writeImportRunRecord(vaultRoot, record);
	const preservedPaths = listPreservedPaths(record);
	const removedCount = record.createdPaths.length;
	const restoredCount = record.updatedPaths.filter((entry) => entry.snapshotPath).length;
	await appendMemoryWikiLog(vaultRoot, {
		type: "ingest",
		timestamp: record.rolledBackAt,
		details: {
			sourceType: "chatgpt-export",
			runId: record.runId,
			rollback: true,
			removedCount,
			restoredCount,
			preservedCount: preservedPaths.length
		}
	}).catch(() => void 0);
	return {
		runId: record.runId,
		removedCount,
		restoredCount,
		preservedPaths,
		pagePaths: [...record.createdPaths.map((entry) => entry.path), ...record.updatedPaths.map((entry) => entry.path)].toSorted((left, right) => left.localeCompare(right)),
		indexUpdatedFiles: compile.updatedFiles,
		alreadyRolledBack: false
	};
}
async function rollbackChatGptImportRun(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, () => rollbackChatGptImportRunUnlocked(params));
}
//#endregion
//#region extensions/memory-wiki/src/ingest.ts
function resolveSourceTitle(sourcePath, explicitTitle) {
	if (explicitTitle?.trim()) return explicitTitle.trim();
	return path.basename(sourcePath, path.extname(sourcePath)).replace(/[-_]+/g, " ").trim();
}
function assertUtf8Text(buffer, sourcePath) {
	if (buffer.subarray(0, Math.min(buffer.length, 4096)).includes(0)) throw new Error(`Cannot ingest binary file as markdown source: ${sourcePath}`);
	return buffer.toString("utf8");
}
function isEmptyExistingSourcePage(error) {
	return typeof error === "object" && error !== null && (error.code === "ENOENT" || error.code === "EISDIR");
}
async function readExistingSourcePage(pagePath) {
	let readError;
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		return await fs$1.readFile(pagePath, "utf8");
	} catch (error) {
		readError = error;
	}
	if (isEmptyExistingSourcePage(readError)) return "";
	throw readError;
}
async function ingestMemoryWikiSourceUnlocked(params) {
	await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
	const sourcePath = path.resolve(params.inputPath);
	const buffer = await fs$1.readFile(sourcePath);
	const content = assertUtf8Text(buffer, sourcePath);
	const title = resolveSourceTitle(sourcePath, params.title);
	const slug = slugifyWikiSegment(title);
	const pageStem = slugifyWikiPageStem(title);
	const pageId = `source.${slug}`;
	const pageRelativePath = path.join("sources", `${pageStem}.md`);
	const pagePath = path.join(params.config.vault.path, pageRelativePath);
	const created = !await pathExists(pagePath);
	const timestamp = resolveMemoryWikiTimestamp(params.nowMs);
	const markdown = renderWikiMarkdown({
		frontmatter: {
			pageType: "source",
			id: pageId,
			title,
			sourceType: "local-file",
			sourcePath,
			ingestedAt: timestamp,
			updatedAt: timestamp,
			status: "active"
		},
		body: [
			`# ${title}`,
			"",
			"## Source",
			`- Type: \`local-file\``,
			`- Path: \`${sourcePath}\``,
			`- Bytes: ${buffer.byteLength}`,
			`- Updated: ${timestamp}`,
			"",
			"## Content",
			renderMarkdownFence(content, "text"),
			"",
			"## Notes",
			"<!-- openclaw:human:start -->",
			"<!-- openclaw:human:end -->",
			""
		].join("\n")
	});
	const existing = created ? "" : await readExistingSourcePage(pagePath);
	await fs$1.writeFile(pagePath, existing ? preserveHumanNotesBlock(markdown, existing) : markdown, "utf8");
	await appendMemoryWikiLog(params.config.vault.path, {
		type: "ingest",
		timestamp,
		details: {
			inputPath: sourcePath,
			pageId,
			pagePath: pageRelativePath.split(path.sep).join("/"),
			bytes: buffer.byteLength,
			created
		}
	});
	const compile = await compileMemoryWikiVault(params.config);
	return {
		sourcePath,
		pageId,
		pagePath: pageRelativePath.split(path.sep).join("/"),
		title,
		bytes: buffer.byteLength,
		created,
		indexUpdatedFiles: compile.updatedFiles
	};
}
async function ingestMemoryWikiSource(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, () => ingestMemoryWikiSourceUnlocked(params));
}
//#endregion
//#region extensions/memory-wiki/src/lint.ts
function toExpectedPageType(page) {
	return page.kind;
}
function isUnmanagedRawSourcePage(page, managedImportedSourcePagePaths) {
	return isUnmanagedRawSourceSummary(page) && !managedImportedSourcePagePaths.has(page.relativePath);
}
function normalizeLintPathTarget(value) {
	return normalizeLintTarget(value, { stripQuery: true });
}
function normalizeLintAliasTextTarget(value) {
	return normalizeLintTarget(value, { stripQuery: false });
}
function normalizeLintTarget(value, options) {
	const withoutFragment = value.trim().replace(/\\/g, "/").split("#")[0] ?? "";
	return (options.stripQuery ? withoutFragment.split("?")[0] ?? "" : withoutFragment).replace(/\.md$/i, "").replace(/^\.\/+/, "").replace(/^\/+/, "").replace(/\/+$/, "").trim();
}
function normalizeLintAliasTarget(value) {
	return normalizeLowercaseStringOrEmpty(normalizeLintAliasTextTarget(value));
}
function hasLintTargetQuery(value) {
	return (value.trim().replace(/\\/g, "/").split("#")[0] ?? "").includes("?");
}
function isLintPathStyleTarget(value) {
	const withoutQuery = (value.trim().replace(/\\/g, "/").split("#")[0] ?? "").split("?")[0] ?? "";
	return withoutQuery.startsWith("/") || withoutQuery.startsWith("./") || withoutQuery.includes("/") || /\.md$/i.test(withoutQuery);
}
function addPathTarget(index, raw) {
	const normalized = raw ? normalizeLintPathTarget(raw) : "";
	if (!normalized) return;
	index.pathTargets.add(normalized);
	index.pathTargets.add(path.posix.basename(normalized));
}
function addAliasTarget(index, raw) {
	const normalized = raw ? normalizeLintAliasTarget(raw) : "";
	if (normalized) index.aliasTargets.add(normalized);
}
function addSlugAliasTarget(index, raw) {
	const normalized = raw ? normalizeLintAliasTextTarget(raw) : "";
	if (normalized) index.aliasTargets.add(slugifyWikiSegment(normalized));
}
function addTitleTarget(index, raw) {
	addAliasTarget(index, raw);
	addSlugAliasTarget(index, raw);
}
function addPathSuffixTargets(index, raw) {
	const normalized = raw ? normalizeLintPathTarget(raw) : "";
	if (!normalized) return;
	const parts = normalized.split("/").filter(Boolean);
	for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
		const suffix = parts.slice(partIndex).join("/");
		addPathTarget(index, suffix);
		addSlugAliasTarget(index, suffix);
	}
}
function buildWikiLinkTargetIndex(pages) {
	const index = {
		pathTargets: /* @__PURE__ */ new Set(),
		aliasTargets: /* @__PURE__ */ new Set()
	};
	for (const page of pages) {
		addPathTarget(index, page.relativePath);
		addTitleTarget(index, page.title);
		addPathSuffixTargets(index, page.sourcePath);
		addPathSuffixTargets(index, page.bridgeRelativePath);
		addPathSuffixTargets(index, page.unsafeLocalRelativePath);
	}
	return index;
}
function hasValidWikiLinkTarget(index, rawTarget) {
	const pathTarget = normalizeLintPathTarget(rawTarget);
	if (!pathTarget) return true;
	if (index.pathTargets.has(pathTarget) && (!hasLintTargetQuery(rawTarget) || isLintPathStyleTarget(rawTarget))) return true;
	if (pathTarget.includes("/")) return false;
	return index.aliasTargets.has(normalizeLintAliasTarget(rawTarget)) || index.aliasTargets.has(slugifyWikiSegment(normalizeLintAliasTextTarget(rawTarget)));
}
function collectBrokenLinkIssues(pages) {
	const validTargets = buildWikiLinkTargetIndex(pages);
	const issues = [];
	for (const page of pages) for (const linkTarget of page.linkTargets) if (!hasValidWikiLinkTarget(validTargets, linkTarget)) issues.push({
		severity: "warning",
		category: "links",
		code: "broken-wikilink",
		path: page.relativePath,
		message: `Broken wikilink target \`${linkTarget}\`.`
	});
	return issues;
}
function collectPageIssues(pages, managedImportedSourcePagePaths) {
	const issues = [];
	const pagesById = /* @__PURE__ */ new Map();
	const claimHealth = collectWikiClaimHealth(pages);
	for (const page of pages) {
		const requiresStructuredPageMetadata = !isUnmanagedRawSourcePage(page, managedImportedSourcePagePaths);
		if (!page.id) {
			if (requiresStructuredPageMetadata) issues.push({
				severity: "error",
				category: "structure",
				code: "missing-id",
				path: page.relativePath,
				message: "Missing `id` frontmatter."
			});
		} else {
			const current = pagesById.get(page.id) ?? [];
			current.push(page);
			pagesById.set(page.id, current);
		}
		if (!page.pageType) {
			if (requiresStructuredPageMetadata) issues.push({
				severity: "error",
				category: "structure",
				code: "missing-page-type",
				path: page.relativePath,
				message: "Missing `pageType` frontmatter."
			});
		} else if (page.pageType !== toExpectedPageType(page)) issues.push({
			severity: "error",
			category: "structure",
			code: "page-type-mismatch",
			path: page.relativePath,
			message: `Expected pageType \`${toExpectedPageType(page)}\`, found \`${page.pageType}\`.`
		});
		if (!page.title.trim()) issues.push({
			severity: "error",
			category: "structure",
			code: "missing-title",
			path: page.relativePath,
			message: "Missing page title."
		});
		if (page.kind !== "source" && page.kind !== "report" && page.sourceIds.length === 0) issues.push({
			severity: "warning",
			category: "provenance",
			code: "missing-source-ids",
			path: page.relativePath,
			message: "Non-source page is missing `sourceIds` provenance."
		});
		if ((page.sourceType === "memory-bridge" || page.sourceType === "memory-bridge-events") && (!page.sourcePath || !page.bridgeRelativePath || !page.bridgeWorkspaceDir)) issues.push({
			severity: "warning",
			category: "provenance",
			code: "missing-import-provenance",
			path: page.relativePath,
			message: "Bridge-imported source page is missing `sourcePath`, `bridgeRelativePath`, or `bridgeWorkspaceDir` provenance."
		});
		if ((page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local") && (!page.sourcePath || !page.unsafeLocalConfiguredPath || !page.unsafeLocalRelativePath)) issues.push({
			severity: "warning",
			category: "provenance",
			code: "missing-import-provenance",
			path: page.relativePath,
			message: "Unsafe-local source page is missing `sourcePath`, `unsafeLocalConfiguredPath`, or `unsafeLocalRelativePath` provenance."
		});
		if (page.contradictions.length > 0) issues.push({
			severity: "warning",
			category: "contradictions",
			code: "contradiction-present",
			path: page.relativePath,
			message: `Page lists ${page.contradictions.length} contradiction${page.contradictions.length === 1 ? "" : "s"} to resolve.`
		});
		if (page.questions.length > 0) issues.push({
			severity: "warning",
			category: "open-questions",
			code: "open-question",
			path: page.relativePath,
			message: `Page lists ${page.questions.length} open question${page.questions.length === 1 ? "" : "s"}.`
		});
		if (typeof page.confidence === "number" && page.confidence < .5) issues.push({
			severity: "warning",
			category: "quality",
			code: "low-confidence",
			path: page.relativePath,
			message: `Page confidence is low (${page.confidence.toFixed(2)}).`
		});
		const freshness = assessPageFreshness(page);
		if (requiresStructuredPageMetadata && page.kind !== "report" && (freshness.level === "stale" || freshness.level === "unknown")) issues.push({
			severity: "warning",
			category: "quality",
			code: "stale-page",
			path: page.relativePath,
			message: `Page freshness needs review (${freshness.reason}).`
		});
	}
	for (const claim of claimHealth) {
		if (claim.missingEvidence) issues.push({
			severity: "warning",
			category: "provenance",
			code: "claim-missing-evidence",
			path: claim.pagePath,
			message: `Claim ${claim.claimId ? `\`${claim.claimId}\`` : `\`${claim.text}\``} is missing structured evidence.`
		});
		if (typeof claim.confidence === "number" && claim.confidence < .5) issues.push({
			severity: "warning",
			category: "quality",
			code: "claim-low-confidence",
			path: claim.pagePath,
			message: `Claim ${claim.claimId ? `\`${claim.claimId}\`` : `\`${claim.text}\``} has low confidence (${claim.confidence.toFixed(2)}).`
		});
		if (claim.freshness.level === "stale" || claim.freshness.level === "unknown") issues.push({
			severity: "warning",
			category: "quality",
			code: "stale-claim",
			path: claim.pagePath,
			message: `Claim ${claim.claimId ? `\`${claim.claimId}\`` : `\`${claim.text}\``} freshness needs review (${claim.freshness.reason}).`
		});
	}
	for (const cluster of buildClaimContradictionClusters({ pages })) for (const entry of cluster.entries) issues.push({
		severity: "warning",
		category: "contradictions",
		code: "claim-conflict",
		path: entry.pagePath,
		message: `Claim cluster \`${cluster.label}\` has competing variants across ${cluster.entries.length} pages.`
	});
	for (const [id, matches] of pagesById.entries()) if (matches.length > 1) for (const match of matches) issues.push({
		severity: "error",
		category: "structure",
		code: "duplicate-id",
		path: match.relativePath,
		message: `Duplicate page id \`${id}\`.`
	});
	issues.push(...collectBrokenLinkIssues(pages));
	return issues.toSorted((left, right) => left.path.localeCompare(right.path));
}
function buildIssuesByCategory(issues) {
	return {
		structure: issues.filter((issue) => issue.category === "structure"),
		provenance: issues.filter((issue) => issue.category === "provenance"),
		links: issues.filter((issue) => issue.category === "links"),
		contradictions: issues.filter((issue) => issue.category === "contradictions"),
		"open-questions": issues.filter((issue) => issue.category === "open-questions"),
		quality: issues.filter((issue) => issue.category === "quality")
	};
}
function buildLintReportBody(issues) {
	if (issues.length === 0) return "No issues found.";
	const errors = issues.filter((issue) => issue.severity === "error");
	const warnings = issues.filter((issue) => issue.severity === "warning");
	const byCategory = buildIssuesByCategory(issues);
	const lines = [`- Errors: ${errors.length}`, `- Warnings: ${warnings.length}`];
	if (errors.length > 0) {
		lines.push("", "### Errors");
		for (const issue of errors) lines.push(`- \`${issue.path}\`: ${issue.message}`);
	}
	if (warnings.length > 0) {
		lines.push("", "### Warnings");
		for (const issue of warnings) lines.push(`- \`${issue.path}\`: ${issue.message}`);
	}
	if (byCategory.contradictions.length > 0) {
		lines.push("", "### Contradictions");
		for (const issue of byCategory.contradictions) lines.push(`- \`${issue.path}\`: ${issue.message}`);
	}
	if (byCategory["open-questions"].length > 0) {
		lines.push("", "### Open Questions");
		for (const issue of byCategory["open-questions"]) lines.push(`- \`${issue.path}\`: ${issue.message}`);
	}
	if (byCategory.provenance.length > 0 || byCategory.quality.length > 0) {
		lines.push("", "### Quality Follow-Up");
		for (const issue of [...byCategory.provenance, ...byCategory.quality]) lines.push(`- \`${issue.path}\`: ${issue.message}`);
	}
	return lines.join("\n");
}
async function writeLintReport(rootDir, issues) {
	const reportPath = path.join(rootDir, "reports", "lint.md");
	const directoryPath = path.dirname(reportPath);
	await fs$1.mkdir(directoryPath, { recursive: true });
	const dirMode = (await fs$1.stat(directoryPath)).mode & 4095;
	const original = await fs$1.readFile(reportPath, "utf8").catch(() => renderWikiMarkdown({
		frontmatter: {
			pageType: "report",
			id: "report.lint",
			title: "Lint Report",
			status: "active"
		},
		body: "# Lint Report\n"
	}));
	parseWikiMarkdown(original);
	await replaceFileAtomic({
		filePath: reportPath,
		content: withTrailingNewline(replaceManagedMarkdownBlock({
			original,
			heading: "## Generated",
			startMarker: "<!-- openclaw:wiki:lint:start -->",
			endMarker: "<!-- openclaw:wiki:lint:end -->",
			body: buildLintReportBody(issues)
		})),
		dirMode,
		mode: 384,
		preserveExistingMode: true,
		tempPrefix: `${path.basename(reportPath)}.lint-report`,
		syncTempFile: true,
		syncParentDir: true,
		throwOnCleanupError: true
	});
	return reportPath;
}
async function lintMemoryWikiVault(config) {
	const compileResult = await compileMemoryWikiVault(config);
	const sourceSyncState = await readMemoryWikiSourceSyncState(config.vault.path);
	const managedImportedSourcePagePaths = new Set(Object.values(sourceSyncState.entries).map((entry) => entry.pagePath.split(path.sep).join("/")));
	const issues = [...compileResult.frontmatterErrors.map((error) => ({
		severity: "error",
		category: "structure",
		code: "invalid-frontmatter",
		path: error.relativePath,
		message: `Frontmatter failed to parse: ${error.message}`
	})), ...collectPageIssues(compileResult.pages, managedImportedSourcePagePaths)].toSorted((left, right) => left.path.localeCompare(right.path));
	const issuesByCategory = buildIssuesByCategory(issues);
	const reportPath = await writeLintReport(config.vault.path, issues);
	await appendMemoryWikiLog(config.vault.path, {
		type: "lint",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			issueCount: issues.length,
			reportPath: path.relative(config.vault.path, reportPath)
		}
	});
	return {
		vaultRoot: config.vault.path,
		issueCount: issues.length,
		issues,
		issuesByCategory,
		reportPath
	};
}
//#endregion
//#region extensions/memory-wiki/src/obsidian.ts
const OBSIDIAN_CLI_TIMEOUT_MS = 1e4;
async function isExecutableFile(inputPath) {
	try {
		await fs$1.access(inputPath, process.platform === "win32" ? constants.F_OK : constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
async function resolveCommandOnPath(command) {
	const pathEntries = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
	const windowsExts = process.platform === "win32" ? process.env.PATHEXT?.split(";").filter(Boolean) ?? [
		".EXE",
		".CMD",
		".BAT"
	] : [""];
	if (command.includes(path.sep)) return await isExecutableFile(command) ? command : null;
	for (const dir of pathEntries) for (const extension of windowsExts) {
		const candidate = path.join(dir, extension ? `${command}${extension}` : command);
		if (await isExecutableFile(candidate)) return candidate;
	}
	return null;
}
function buildVaultPrefix(config) {
	return config.obsidian.vaultName ? [`vault=${config.obsidian.vaultName}`] : [];
}
async function probeObsidianCli(deps) {
	const command = await (deps?.resolveCommand ?? resolveCommandOnPath)("obsidian");
	return {
		available: command !== null,
		command
	};
}
async function runObsidianCli(params) {
	const probe = await probeObsidianCli({ resolveCommand: params.deps?.resolveCommand ?? resolveCommandOnPath });
	if (!probe.command) throw new Error("Obsidian CLI is not available on PATH.");
	const argv = [
		...buildVaultPrefix(params.config),
		params.subcommand,
		...params.args ?? []
	];
	const { stdout, stderr } = await (params.deps?.exec ?? runExec)(probe.command, argv, {
		logOutput: false,
		timeoutMs: OBSIDIAN_CLI_TIMEOUT_MS
	});
	return {
		command: probe.command,
		argv,
		stdout,
		stderr
	};
}
async function runObsidianSearch(params) {
	return await runObsidianCli({
		config: params.config,
		subcommand: "search",
		args: [`query=${params.query}`],
		deps: params.deps
	});
}
async function runObsidianOpen(params) {
	return await runObsidianCli({
		config: params.config,
		subcommand: "open",
		args: [`path=${params.vaultPath}`],
		deps: params.deps
	});
}
async function runObsidianCommand(params) {
	return await runObsidianCli({
		config: params.config,
		subcommand: "command",
		args: [`id=${params.id}`],
		deps: params.deps
	});
}
async function runObsidianDaily(params) {
	return await runObsidianCli({
		config: params.config,
		subcommand: "daily",
		deps: params.deps
	});
}
//#endregion
//#region extensions/memory-wiki/src/vault-page-write.ts
function isRegularFileStat(value) {
	if (!value || typeof value !== "object") return false;
	const stat = value;
	return (typeof stat.isFile === "function" ? stat.isFile.call(stat) : stat.isFile === true) && typeof stat.nlink === "number";
}
const isConcurrentRewriteRace = (error) => error instanceof FsSafeError && error.code === "path-mismatch";
/**
* Write `content` to a vault page, breaking an accidental hardlink first, and map
* fs-safe guard failures to a labeled error. A transient concurrent-rewrite race
* is retried briefly; on exhaustion (or any other guard failure) the error
* propagates so the caller's safety contract is unchanged.
*/
async function writeGuardedVaultPage(params) {
	try {
		await retryAsync(async () => {
			if (isRegularFileStat(params.pageStat) && params.pageStat.nlink > 1) await params.vault.remove(params.pagePath);
			await params.vault.write(params.pagePath, params.content);
		}, {
			attempts: 3,
			minDelayMs: 25,
			maxDelayMs: 50,
			label: `memory-wiki write ${params.pageLabel} ${params.pagePath}`,
			shouldRetry: isConcurrentRewriteRace
		});
	} catch (error) {
		if (error instanceof FsSafeError) {
			if (error.code !== "symlink" && error.code !== "path-alias") throw new Error(`Refusing to write ${params.pageLabel} (${error.code}): ${params.pagePath}: ${error.message}`, { cause: error });
			throw new Error(`Refusing to write ${params.pageLabel} through symlink: ${params.pagePath}`, { cause: error });
		}
		throw error;
	}
}
//#endregion
//#region extensions/memory-wiki/src/okf.ts
const OKF_RESERVED_FILENAMES = /* @__PURE__ */ new Set(["index.md", "log.md"]);
const OKF_MARKDOWN_LINK_PATTERN = /(!?)\[([^\]]*)\]\(([^)]+)\)/g;
const OKF_FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})/;
const OKF_RELATED_SECTION_PATTERN = new RegExp(`\\n+## Related\\n${WIKI_RELATED_START_MARKER}[\\s\\S]*?${WIKI_RELATED_END_MARKER}\\n?`, "g");
const OKF_VOLATILE_TIMESTAMP_LINE_PATTERN = /^(?:importedAt|updatedAt): .*\n/gm;
const OKF_HASH_CHARS = 8;
function toPosixPath(value) {
	return value.split(path.sep).join("/");
}
function trimMarkdownExtension(value) {
	return value.replace(/\.md$/i, "");
}
function createOkfBundleKey(params) {
	const producerId = normalizeOptionalString(params.rootFrontmatter.id) ?? normalizeOptionalString(params.rootFrontmatter.okf_id);
	if (producerId) return slugifyWikiSegment(producerId);
	const label = normalizeOptionalString(params.rootFrontmatter.name) ?? normalizeOptionalString(params.rootFrontmatter.title) ?? params.bundleName;
	const hash = createHash("sha1").update(params.bundlePath).digest("hex").slice(0, OKF_HASH_CHARS);
	return `${slugifyWikiSegment(label)}-${hash}`;
}
function createOkfPageStem(bundleKey, conceptId) {
	return `okf-${bundleKey}-${slugifyWikiSegment(conceptId.replace(/\//g, "-"))}-${createHash("sha1").update(conceptId).digest("hex").slice(0, OKF_HASH_CHARS)}`;
}
function createOkfPageIdentity(bundleKey, conceptId) {
	const fileName = createWikiPageFilename(createOkfPageStem(bundleKey, conceptId));
	return {
		pageId: `concept.${trimMarkdownExtension(fileName)}`,
		pagePath: `concepts/${fileName}`
	};
}
async function collectOkfMarkdownFiles(rootDir, warnings) {
	const entries = await walkMemoryWikiDirectory(rootDir, "", {
		entryFilter: (entry) => entry.kind === "directory" && [".git", "node_modules"].includes(path.basename(entry.relativePath)) ? "skip-subtree" : "include",
		onDirectoryError: "skip-and-report"
	});
	const files = [];
	for (const entry of entries) {
		if (entry.kind === "directory-error") {
			warnings.push({
				code: "unreadable-entry",
				path: toPosixPath(entry.relativePath) || ".",
				message: entry.error instanceof Error ? entry.error.message : "Unable to read OKF directory."
			});
			continue;
		}
		if (entry.kind === "file" && entry.relativePath.endsWith(".md")) files.push(toPosixPath(entry.relativePath));
	}
	return files.toSorted((left, right) => left.localeCompare(right));
}
function parseOkfMarkdown(content, relativePath) {
	const normalizedContent = content.replace(/\r\n/g, "\n");
	try {
		return parseWikiMarkdown(normalizedContent);
	} catch (err) {
		return {
			frontmatter: {},
			body: normalizedContent,
			warning: {
				code: "invalid-concept",
				path: relativePath,
				message: err instanceof Error ? err.message : "Unable to parse OKF frontmatter."
			}
		};
	}
}
async function readOkfTextFile(params) {
	const root$1 = await root(params.bundlePath);
	const stat = await root$1.stat(params.relativePath).catch((err) => {
		params.warnings.push({
			code: "unreadable-entry",
			path: params.relativePath,
			message: err instanceof Error ? err.message : "Unable to read OKF concept."
		});
		return null;
	});
	if (!stat) return null;
	if (!isRegularFileStat(stat)) {
		params.warnings.push({
			code: "unreadable-entry",
			path: params.relativePath,
			message: "Refusing to import OKF concept through non-regular or hardlinked file."
		});
		return null;
	}
	return await root$1.readText(params.relativePath).catch((err) => {
		params.warnings.push({
			code: "unreadable-entry",
			path: params.relativePath,
			message: err instanceof Error ? err.message : "Unable to read OKF concept."
		});
		return null;
	});
}
function deriveOkfTitle(relativePath, frontmatter) {
	return normalizeOptionalString(frontmatter.title) ?? path.posix.basename(relativePath, ".md").replace(/[-_]+/g, " ").trim() ?? trimMarkdownExtension(relativePath);
}
function normalizeOkfConcept(params) {
	const parsed = parseOkfMarkdown(params.content, params.relativePath);
	if (parsed.warning) return { warning: parsed.warning };
	const type = normalizeOptionalString(parsed.frontmatter.type);
	if (!type) return { warning: {
		code: "missing-type",
		path: params.relativePath,
		message: "OKF concept is missing required non-empty type frontmatter."
	} };
	const conceptId = trimMarkdownExtension(params.relativePath);
	const timestamp = normalizeOptionalString(parsed.frontmatter.timestamp);
	return { concept: {
		conceptId,
		relativePath: params.relativePath,
		absolutePath: path.join(params.bundlePath, params.relativePath),
		frontmatter: parsed.frontmatter,
		body: parsed.body,
		type,
		title: deriveOkfTitle(params.relativePath, parsed.frontmatter),
		...normalizeOptionalString(parsed.frontmatter.description) ? { description: normalizeOptionalString(parsed.frontmatter.description) } : {},
		...normalizeOptionalString(parsed.frontmatter.resource) ? { resource: normalizeOptionalString(parsed.frontmatter.resource) } : {},
		tags: normalizeSingleOrTrimmedStringList(parsed.frontmatter.tags),
		...timestamp ? { timestamp } : {}
	} };
}
function splitMarkdownLinkDestination(target) {
	const trimmed = target.trim();
	if (trimmed.startsWith("<")) {
		const end = trimmed.indexOf(">");
		if (end > 0) return {
			destination: trimmed.slice(1, end),
			titleSuffix: trimmed.slice(end + 1)
		};
	}
	const match = trimmed.match(/^(\S+)(\s+[\s\S]+)?$/);
	return {
		destination: match?.[1] ?? trimmed,
		titleSuffix: match?.[2] ?? ""
	};
}
function resolveOkfMarkdownTarget(sourceRelativePath, target) {
	const { destination } = splitMarkdownLinkDestination(target);
	const trimmed = destination.trim();
	if (!trimmed || trimmed.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
	const rawTargetWithoutSuffix = trimmed.split("#")[0]?.split("?")[0]?.replace(/\\/g, "/").trim();
	const targetWithoutSuffix = safeDecodeOkfLinkPath(rawTargetWithoutSuffix);
	if (!targetWithoutSuffix || !targetWithoutSuffix.endsWith(".md")) return null;
	const conceptId = trimMarkdownExtension(targetWithoutSuffix.startsWith("/") ? path.posix.normalize(targetWithoutSuffix.slice(1)) : path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelativePath), targetWithoutSuffix)));
	return conceptId.startsWith("../") ? null : conceptId;
}
function safeDecodeOkfLinkPath(value) {
	if (!value) return "";
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
function getMarkdownDestinationSuffix(destination) {
	const queryIndex = destination.indexOf("?");
	const fragmentIndex = destination.indexOf("#");
	const suffixIndex = queryIndex === -1 ? fragmentIndex : fragmentIndex === -1 ? queryIndex : Math.min(queryIndex, fragmentIndex);
	return suffixIndex === -1 ? "" : destination.slice(suffixIndex);
}
function rewriteOkfMarkdownLinks(params) {
	const linkedConceptIds = [];
	const rewriteLinks = (markdown) => markdown.replace(OKF_MARKDOWN_LINK_PATTERN, (match, imagePrefix, label, rawTarget) => {
		const conceptId = resolveOkfMarkdownTarget(params.sourceRelativePath, rawTarget);
		if (!conceptId) return match;
		const target = params.pageByConceptId.get(conceptId);
		if (!target) return match;
		linkedConceptIds.push(conceptId);
		const { destination, titleSuffix } = splitMarkdownLinkDestination(rawTarget);
		return `${imagePrefix}[${label}](${path.posix.relative(path.posix.dirname(params.sourcePagePath), target.pagePath)}${getMarkdownDestinationSuffix(destination)}${titleSuffix})`;
	});
	return {
		body: rewriteMarkdownOutsideCode(params.body, rewriteLinks),
		linkedConceptIds: uniqueStrings(linkedConceptIds)
	};
}
function rewriteMarkdownLineOutsideInlineCode(line, rewriteLinks) {
	let result = "";
	let cursor = 0;
	while (cursor < line.length) {
		const codeStart = line.indexOf("`", cursor);
		if (codeStart === -1) {
			result += rewriteLinks(line.slice(cursor));
			break;
		}
		result += rewriteLinks(line.slice(cursor, codeStart));
		const delimiter = line.slice(codeStart).match(/^`+/)?.[0] ?? "`";
		const codeEnd = line.indexOf(delimiter, codeStart + delimiter.length);
		if (codeEnd === -1) {
			result += line.slice(codeStart);
			break;
		}
		result += line.slice(codeStart, codeEnd + delimiter.length);
		cursor = codeEnd + delimiter.length;
	}
	return result;
}
function rewriteMarkdownOutsideCode(markdown, rewriteLinks) {
	const lines = markdown.split(/(\n)/);
	let inFence = false;
	let fenceDelimiter = "";
	return lines.map((line) => {
		if (line === "\n") return line;
		const fenceMatch = line.match(OKF_FENCE_PATTERN);
		if (fenceMatch) {
			const delimiter = fenceMatch[1] ?? "";
			const closesFence = inFence && delimiter.startsWith(fenceDelimiter[0] ?? "") && delimiter.length >= fenceDelimiter.length;
			if (!inFence) {
				inFence = true;
				fenceDelimiter = delimiter;
			} else if (closesFence) {
				inFence = false;
				fenceDelimiter = "";
			}
			return line;
		}
		return inFence ? line : rewriteMarkdownLineOutsideInlineCode(line, rewriteLinks);
	}).join("");
}
function normalizeOkfRenderedPageForComparison(content) {
	const withoutRelated = content.replace(OKF_RELATED_SECTION_PATTERN, "\n");
	const frontmatterMatch = withoutRelated.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!frontmatterMatch) return withoutRelated.trimEnd();
	const normalizedFrontmatter = frontmatterMatch[1]?.replace(OKF_VOLATILE_TIMESTAMP_LINE_PATTERN, "") ?? "";
	return `---\n${normalizedFrontmatter.endsWith("\n") ? normalizedFrontmatter : `${normalizedFrontmatter}\n`}---\n${withoutRelated.slice(frontmatterMatch[0].length)}`.trimEnd();
}
async function writeOkfConceptPage(params) {
	const vault = await root(params.vaultRoot);
	const pageStat = await vault.stat(params.pagePath).catch((error) => {
		if (error instanceof FsSafeError && (error.code === "not-found" || error.code === "path-alias")) return null;
		throw error;
	});
	const existing = pageStat ? await vault.readText(params.pagePath).catch(() => "") : "";
	if (existing === params.content || normalizeOkfRenderedPageForComparison(existing) === normalizeOkfRenderedPageForComparison(params.content)) return {
		changed: false,
		created: !pageStat
	};
	await writeGuardedVaultPage({
		vault,
		pagePath: params.pagePath,
		content: params.content,
		pageStat,
		pageLabel: "OKF concept page"
	});
	return {
		changed: true,
		created: !pageStat
	};
}
async function removeStaleOkfConceptPages(params) {
	const vault = await root(params.vaultRoot);
	const entries = await walkMemoryWikiDirectory(params.vaultRoot, "concepts", {
		maxDepth: 0,
		entryFilter: (entry) => entry.kind === "directory" ? "skip-subtree" : "include",
		onDirectoryError: "skip-and-report"
	});
	const removedPagePaths = [];
	for (const entry of entries) {
		const entryName = path.basename(entry.relativePath);
		if (entry.kind !== "file" || !entryName.endsWith(".md") || entryName === "index.md") continue;
		const pagePath = `concepts/${entryName}`;
		if (params.currentPagePaths.has(pagePath)) continue;
		const okf = parseWikiMarkdown(await vault.readText(pagePath).catch(() => "")).frontmatter.okf;
		if (okf && typeof okf === "object" && !Array.isArray(okf) && okf.bundleKey === params.bundleKey) {
			await vault.remove(pagePath);
			removedPagePaths.push(pagePath);
		}
	}
	return removedPagePaths;
}
function readRootOkfMetadata(params) {
	if (!params.rootIndex) return { key: createOkfBundleKey({
		rootFrontmatter: {},
		bundleName: params.bundleName,
		bundlePath: params.bundlePath
	}) };
	const parsed = parseOkfMarkdown(params.rootIndex, "index.md");
	return {
		key: createOkfBundleKey({
			rootFrontmatter: parsed.frontmatter,
			bundleName: params.bundleName,
			bundlePath: params.bundlePath
		}),
		...normalizeOptionalString(parsed.frontmatter.okf_version) ? { version: normalizeOptionalString(parsed.frontmatter.okf_version) } : {}
	};
}
function formatOkfImportSummary(result) {
	return `Imported ${result.importedCount} OKF concept${result.importedCount === 1 ? "" : "s"} from ${result.bundlePath} into memory wiki. Updated ${result.updatedCount}; removed ${result.removedCount}; skipped ${result.skippedCount}; refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.`;
}
async function importMemoryWikiOkfBundle(params) {
	await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
	const bundlePath = path.resolve(params.bundlePath);
	if (!(await fs$1.stat(bundlePath)).isDirectory()) throw new Error("wiki okf import expects an unpacked OKF bundle directory.");
	const warnings = [];
	const markdownFiles = await collectOkfMarkdownFiles(bundlePath, warnings);
	const concepts = [];
	let rootIndexContent;
	for (const relativePath of markdownFiles) {
		if (relativePath === "index.md") rootIndexContent = await readOkfTextFile({
			bundlePath,
			relativePath,
			warnings
		}) ?? void 0;
		if (OKF_RESERVED_FILENAMES.has(path.posix.basename(relativePath))) continue;
		const content = await readOkfTextFile({
			bundlePath,
			relativePath,
			warnings
		});
		if (content === null) continue;
		const normalized = normalizeOkfConcept({
			bundlePath,
			relativePath,
			content
		});
		if (normalized.warning) {
			warnings.push(normalized.warning);
			continue;
		}
		if (normalized.concept) concepts.push(normalized.concept);
	}
	const timestamp = resolveMemoryWikiTimestamp(params.nowMs);
	const bundleName = path.basename(bundlePath);
	const bundleMetadata = readRootOkfMetadata({
		rootIndex: rootIndexContent,
		bundleName,
		bundlePath
	});
	const bundleKey = bundleMetadata.key;
	const pageByConceptId = /* @__PURE__ */ new Map();
	for (const concept of concepts) pageByConceptId.set(concept.conceptId, {
		...createOkfPageIdentity(bundleKey, concept.conceptId),
		title: concept.title
	});
	const importedPages = [];
	let updatedCount = 0;
	await fs$1.mkdir(path.join(params.config.vault.path, "concepts"), { recursive: true });
	for (const concept of concepts.toSorted((left, right) => left.conceptId.localeCompare(right.conceptId))) {
		const page = pageByConceptId.get(concept.conceptId);
		if (!page) continue;
		const rewritten = rewriteOkfMarkdownLinks({
			body: concept.body,
			sourcePagePath: page.pagePath,
			sourceRelativePath: concept.relativePath,
			pageByConceptId
		});
		const relationships = rewritten.linkedConceptIds.flatMap((conceptId) => {
			const target = pageByConceptId.get(conceptId);
			return target ? [{
				targetId: target.pageId,
				targetPath: target.pagePath,
				targetTitle: target.title,
				kind: "okf-link",
				evidenceKind: "okf-markdown-link"
			}] : [];
		});
		const frontmatter = {
			pageType: "concept",
			id: page.pageId,
			title: concept.title,
			sourceType: "okf",
			provenanceMode: "okf-import",
			sourcePath: concept.absolutePath,
			okfConceptId: concept.conceptId,
			okfType: concept.type,
			sourceIds: [`source.okf.${bundleKey}`],
			importedAt: timestamp,
			updatedAt: concept.timestamp ?? timestamp,
			status: "active",
			...concept.description ? { description: concept.description } : {},
			...concept.resource ? { resource: concept.resource } : {},
			...concept.tags.length > 0 ? { tags: concept.tags } : {},
			...concept.timestamp ? { okfTimestamp: concept.timestamp } : {},
			...relationships.length > 0 ? { relationships } : {},
			okf: {
				...bundleMetadata.version ? { version: bundleMetadata.version } : {},
				bundleName,
				bundleKey,
				conceptId: concept.conceptId,
				sourceRelativePath: concept.relativePath,
				frontmatter: concept.frontmatter
			}
		};
		const writeResult = await writeOkfConceptPage({
			vaultRoot: params.config.vault.path,
			pagePath: page.pagePath,
			content: renderWikiMarkdown({
				frontmatter,
				body: rewritten.body
			})
		});
		if (!writeResult.created && writeResult.changed) updatedCount++;
		importedPages.push({
			conceptId: concept.conceptId,
			sourcePath: concept.absolutePath,
			pageId: page.pageId,
			pagePath: page.pagePath,
			title: concept.title,
			created: writeResult.created
		});
	}
	const currentPagePaths = new Set(importedPages.map((page) => page.pagePath));
	const removedPagePaths = warnings.length === 0 ? await removeStaleOkfConceptPages({
		vaultRoot: params.config.vault.path,
		bundleKey,
		currentPagePaths
	}) : [];
	await appendMemoryWikiLog(params.config.vault.path, {
		type: "okf-import",
		timestamp,
		details: {
			bundlePath,
			bundleName,
			importedCount: importedPages.length,
			updatedCount,
			removedCount: removedPagePaths.length,
			skippedCount: warnings.length,
			pagePaths: importedPages.map((page) => page.pagePath),
			removedPagePaths
		}
	});
	const compile = await compileMemoryWikiVault(params.config);
	return {
		bundlePath,
		bundleName,
		...bundleMetadata.version ? { okfVersion: bundleMetadata.version } : {},
		importedCount: importedPages.length,
		updatedCount,
		removedCount: removedPagePaths.length,
		skippedCount: warnings.length,
		pagePaths: importedPages.map((page) => page.pagePath),
		removedPagePaths,
		warnings,
		indexUpdatedFiles: compile.updatedFiles
	};
}
//#endregion
//#region extensions/memory-wiki/src/source-page-shared.ts
function isUnreadableImportedSourcePage(error) {
	return error instanceof FsSafeError && (error.code === "not-file" || error.code === "hardlink");
}
async function readExistingImportedSourcePage(vault, pagePath) {
	let readError;
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		return await vault.readText(pagePath);
	} catch (error) {
		readError = error;
	}
	if (isUnreadableImportedSourcePage(readError)) return "";
	throw readError;
}
async function writeImportedSourcePage(params) {
	if (await shouldSkipImportedSourceWrite({
		vaultRoot: params.vaultRoot,
		syncKey: params.syncKey,
		expectedPagePath: params.pagePath,
		expectedSourcePath: params.sourcePath,
		sourceUpdatedAtMs: params.sourceUpdatedAtMs,
		sourceSize: params.sourceSize,
		renderFingerprint: params.renderFingerprint,
		state: params.state
	})) return {
		pagePath: params.pagePath,
		changed: false,
		created: false
	};
	const vault = await root(params.vaultRoot);
	const pageStat = await vault.stat(params.pagePath).catch((error) => {
		if (error instanceof FsSafeError && (error.code === "not-found" || error.code === "path-alias")) return null;
		throw error;
	});
	const created = !pageStat;
	const updatedAt = timestampMsToIsoString(params.sourceUpdatedAtMs) ?? (/* @__PURE__ */ new Date()).toISOString();
	const raw = params.sourceContent ?? await fs$1.readFile(params.sourcePath, "utf8");
	const rendered = params.buildRendered(raw, updatedAt);
	const existing = pageStat ? await readExistingImportedSourcePage(vault, params.pagePath) : "";
	const nextRendered = existing ? preserveHumanNotesBlock(rendered, existing) : rendered;
	if (existing !== nextRendered) await writeGuardedVaultPage({
		vault,
		pagePath: params.pagePath,
		content: nextRendered,
		pageStat,
		pageLabel: "imported source page"
	});
	setImportedSourceEntry({
		syncKey: params.syncKey,
		state: params.state,
		entry: {
			group: params.group,
			pagePath: params.pagePath,
			sourcePath: params.sourcePath,
			sourceUpdatedAtMs: params.sourceUpdatedAtMs,
			sourceSize: params.sourceSize,
			renderFingerprint: params.renderFingerprint
		}
	});
	return {
		pagePath: params.pagePath,
		changed: existing !== nextRendered,
		created
	};
}
//#endregion
//#region extensions/memory-wiki/src/source-path-shared.ts
async function resolveArtifactKey(absolutePath) {
	const canonicalPath = await fs$1.realpath(absolutePath).catch(() => path.resolve(absolutePath));
	return process.platform === "win32" ? lowercasePreservingWhitespace(canonicalPath) : canonicalPath;
}
//#endregion
//#region extensions/memory-wiki/src/bridge.ts
function resolveMemoryWikiVaultAgentId(config) {
	if (config.vault.scope === "global") return null;
	const agentId = config.agentId?.trim();
	if (!agentId) throw new Error("Memory Wiki agent-scoped vault requires a resolved agent id");
	return normalizeAgentId(agentId);
}
function filterMemoryWikiBridgeArtifacts(params) {
	const vaultAgentId = resolveMemoryWikiVaultAgentId(params.config);
	const callerAgentId = params.callerAgentId?.trim();
	const agentId = vaultAgentId ?? (callerAgentId ? normalizeAgentId(callerAgentId) : null);
	if (!agentId) return params.artifacts;
	return params.artifacts.filter((artifact) => {
		return (Array.isArray(artifact.agentIds) ? artifact.agentIds : []).some((artifactAgentId) => typeof artifactAgentId === "string" && artifactAgentId.trim().length > 0 && normalizeAgentId(artifactAgentId) === agentId);
	});
}
function shouldImportArtifact(artifact, bridgeConfig) {
	switch (artifact.kind) {
		case "memory-root": return bridgeConfig.indexMemoryRoot;
		case "daily-note": return bridgeConfig.indexDailyNotes;
		case "dream-report": return bridgeConfig.indexDreamReports;
		case "event-log": return bridgeConfig.followMemoryEvents;
		default: return false;
	}
}
async function collectBridgeArtifacts(bridgeConfig, vaultRoot, artifacts) {
	const collected = [];
	const vaultRootKey = await resolveArtifactKey(vaultRoot);
	for (const artifact of artifacts) {
		if (!shouldImportArtifact(artifact, bridgeConfig)) continue;
		const syncKey = await resolveArtifactKey(artifact.absolutePath);
		if (isPathInsideOrEqual(vaultRootKey, syncKey)) continue;
		collected.push({
			syncKey,
			artifactType: artifact.kind === "event-log" ? "memory-events" : "markdown",
			workspaceDir: artifact.workspaceDir,
			relativePath: artifact.relativePath,
			absolutePath: artifact.absolutePath
		});
	}
	const deduped = /* @__PURE__ */ new Map();
	for (const artifact of collected) deduped.set(artifact.syncKey, artifact);
	return [...deduped.values()];
}
function isPathInsideOrEqual(parentPath, candidatePath) {
	const relative = path.relative(parentPath, candidatePath);
	return relative === "" || relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
function resolveBridgeTitle(artifact, agentIds) {
	if (artifact.artifactType === "memory-events") {
		if (agentIds.length === 0) return "Memory Bridge: event journal";
		return `Memory Bridge (${agentIds.join(", ")}): event journal`;
	}
	const base = artifact.relativePath.replace(/\.md$/i, "").replace(/^memory\//, "").replace(/\//g, " / ");
	if (agentIds.length === 0) return `Memory Bridge: ${base}`;
	return `Memory Bridge (${agentIds.join(", ")}): ${base}`;
}
function resolveBridgePagePath(params) {
	const workspaceBaseSlug = slugifyWikiSegment(path.basename(params.workspaceDir));
	const workspaceHash = createHash("sha1").update(path.resolve(params.workspaceDir)).digest("hex");
	const artifactBaseSlug = slugifyWikiSegment(params.relativePath.replace(/\.md$/i, "").replace(/\//g, "-"));
	const artifactHash = createHash("sha1").update(params.relativePath).digest("hex");
	const workspaceSlug = `${workspaceBaseSlug}-${workspaceHash.slice(0, 8)}`;
	const artifactSlug = `${artifactBaseSlug}-${artifactHash.slice(0, 8)}`;
	const fileName = createWikiPageFilename(`bridge-${workspaceSlug}-${artifactSlug}`);
	return {
		pageId: `source.bridge.${workspaceSlug}.${artifactSlug}`,
		pagePath: path.join("sources", fileName).replace(/\\/g, "/"),
		workspaceSlug,
		artifactSlug
	};
}
async function writeBridgeSourcePage(params) {
	const { pageId, pagePath } = resolveBridgePagePath({
		workspaceDir: params.artifact.workspaceDir,
		relativePath: params.artifact.relativePath
	});
	const title = resolveBridgeTitle(params.artifact, params.agentIds);
	const renderFingerprint = createHash("sha1").update(JSON.stringify({
		artifactType: params.artifact.artifactType,
		workspaceDir: params.artifact.workspaceDir,
		relativePath: params.artifact.relativePath,
		agentIds: params.agentIds
	})).digest("hex");
	return writeImportedSourcePage({
		vaultRoot: params.config.vault.path,
		syncKey: params.artifact.syncKey,
		sourcePath: params.artifact.absolutePath,
		sourceUpdatedAtMs: params.sourceUpdatedAtMs,
		sourceSize: params.sourceSize,
		renderFingerprint,
		pagePath,
		group: "bridge",
		state: params.state,
		buildRendered: (raw, updatedAt) => {
			const contentLanguage = params.artifact.artifactType === "memory-events" ? "json" : "markdown";
			return renderWikiMarkdown({
				frontmatter: {
					pageType: "source",
					id: pageId,
					title,
					sourceType: params.artifact.artifactType === "memory-events" ? "memory-bridge-events" : "memory-bridge",
					sourcePath: params.artifact.absolutePath,
					bridgeRelativePath: params.artifact.relativePath,
					bridgeWorkspaceDir: params.artifact.workspaceDir,
					bridgeAgentIds: params.agentIds,
					status: "active",
					updatedAt
				},
				body: [
					`# ${title}`,
					"",
					"## Bridge Source",
					`- Workspace: \`${params.artifact.workspaceDir}\``,
					`- Relative path: \`${params.artifact.relativePath}\``,
					`- Kind: \`${params.artifact.artifactType}\``,
					`- Agents: ${params.agentIds.length > 0 ? params.agentIds.join(", ") : "unknown"}`,
					`- Updated: ${updatedAt}`,
					"",
					"## Content",
					renderMarkdownFence(raw, contentLanguage),
					"",
					"## Notes",
					"<!-- openclaw:human:start -->",
					"<!-- openclaw:human:end -->",
					""
				].join("\n")
			});
		}
	});
}
async function syncMemoryWikiBridgeSources(params) {
	resolveMemoryWikiVaultAgentId(params.config);
	await initializeMemoryWikiVault(params.config);
	if (params.config.vaultMode !== "bridge" || !params.config.bridge.enabled || !params.config.bridge.readMemoryArtifacts || !params.appConfig) return {
		importedCount: 0,
		updatedCount: 0,
		skippedCount: 0,
		removedCount: 0,
		artifactCount: 0,
		workspaces: 0,
		pagePaths: []
	};
	const publicArtifacts = filterMemoryWikiBridgeArtifacts({
		config: params.config,
		artifacts: await listActiveMemoryPublicArtifacts({ cfg: params.appConfig })
	});
	const results = [];
	const activeKeys = /* @__PURE__ */ new Set();
	const artifacts = await collectBridgeArtifacts(params.config.bridge, params.config.vault.path, publicArtifacts);
	const state = await readMemoryWikiSourceSyncState(params.config.vault.path);
	assertMemoryWikiSourceSyncStateCapacity({
		state,
		group: "bridge",
		incomingCount: artifacts.length
	});
	const agentIdsByWorkspace = /* @__PURE__ */ new Map();
	for (const artifact of publicArtifacts) agentIdsByWorkspace.set(artifact.workspaceDir, artifact.agentIds);
	const artifactCount = artifacts.length;
	for (const artifact of artifacts) {
		const stats = await fs$1.stat(artifact.absolutePath);
		activeKeys.add(artifact.syncKey);
		results.push(await writeBridgeSourcePage({
			config: params.config,
			artifact,
			agentIds: agentIdsByWorkspace.get(artifact.workspaceDir) ?? [],
			sourceUpdatedAtMs: stats.mtimeMs,
			sourceSize: stats.size,
			state
		}));
	}
	const workspaceCount = new Set(publicArtifacts.map((artifact) => artifact.workspaceDir)).size;
	const removedCount = getMemoryCapabilityRegistration() ? await pruneImportedSourceEntries({
		vaultRoot: params.config.vault.path,
		group: "bridge",
		activeKeys,
		state
	}) : 0;
	await writeMemoryWikiSourceSyncState(params.config.vault.path, state);
	const importedCount = results.filter((result) => result.changed && result.created).length;
	const updatedCount = results.filter((result) => result.changed && !result.created).length;
	const skippedCount = results.filter((result) => !result.changed).length;
	const pagePaths = results.map((result) => result.pagePath).toSorted((left, right) => left.localeCompare(right));
	if (importedCount > 0 || updatedCount > 0 || removedCount > 0) await appendMemoryWikiLog(params.config.vault.path, {
		type: "ingest",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			sourceType: "memory-bridge",
			workspaces: workspaceCount,
			artifactCount,
			importedCount,
			updatedCount,
			skippedCount,
			removedCount
		}
	});
	return {
		importedCount,
		updatedCount,
		skippedCount,
		removedCount,
		artifactCount,
		workspaces: workspaceCount,
		pagePaths
	};
}
//#endregion
//#region extensions/memory-wiki/src/unsafe-local.ts
const DIRECTORY_TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
	".json",
	".jsonl",
	".md",
	".txt",
	".yaml",
	".yml"
]);
const UNSAFE_LOCAL_SYNC_CONCURRENCY = 16;
function detectFenceLanguage(filePath) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
	if (ext === ".json" || ext === ".jsonl") return "json";
	if (ext === ".yaml" || ext === ".yml") return "yaml";
	if (ext === ".txt") return "text";
	return "markdown";
}
async function listAllowedFilesRecursive(rootDir) {
	return (await walkMemoryWikiDirectory(rootDir, "", { entryFilter: (entry) => entry.kind === "directory" || entry.kind === "file" && DIRECTORY_TEXT_EXTENSIONS.has(normalizeLowercaseStringOrEmpty(path.extname(entry.relativePath))) ? "include" : "skip" })).filter((entry) => entry.kind === "file").map((entry) => path.join(rootDir, entry.relativePath)).toSorted((left, right) => left.localeCompare(right));
}
async function collectUnsafeLocalArtifacts(configuredPaths) {
	const artifacts = [];
	const unavailableConfiguredPaths = [];
	for (const configuredPath of configuredPaths) {
		const absoluteConfiguredPath = path.resolve(configuredPath);
		const scopedArtifacts = [];
		try {
			const stat = await fs$1.stat(absoluteConfiguredPath);
			if (stat.isDirectory()) {
				const files = await listAllowedFilesRecursive(absoluteConfiguredPath);
				for (const absolutePath of files) scopedArtifacts.push({
					syncKey: await resolveArtifactKey(absolutePath),
					configuredPath: absoluteConfiguredPath,
					absolutePath,
					relativePath: path.relative(absoluteConfiguredPath, absolutePath).replace(/\\/g, "/")
				});
			} else if (stat.isFile()) scopedArtifacts.push({
				syncKey: await resolveArtifactKey(absoluteConfiguredPath),
				configuredPath: absoluteConfiguredPath,
				absolutePath: absoluteConfiguredPath,
				relativePath: path.basename(absoluteConfiguredPath)
			});
		} catch {
			unavailableConfiguredPaths.push(absoluteConfiguredPath);
			continue;
		}
		artifacts.push(...scopedArtifacts);
	}
	const deduped = /* @__PURE__ */ new Map();
	for (const artifact of artifacts) deduped.set(artifact.syncKey, artifact);
	return {
		artifacts: [...deduped.values()],
		unavailableConfiguredPaths
	};
}
function isSourceWithinConfiguredPath(sourcePath, configuredPath) {
	const relative = path.relative(configuredPath, sourcePath);
	return relative === "" || relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
function resolveUnsafeLocalPagePath(params) {
	const pageSlug = `${slugifyWikiSegment(path.basename(params.configuredPath))}-${createHash("sha1").update(path.resolve(params.configuredPath)).digest("hex").slice(0, 8)}-${slugifyWikiSegment(path.basename(params.absolutePath))}-${createHash("sha1").update(path.resolve(params.absolutePath)).digest("hex").slice(0, 8)}`;
	return {
		pageId: `source.unsafe-local.${pageSlug}`,
		pagePath: path.join("sources", createWikiPageFilename(`unsafe-local-${pageSlug}`)).replace(/\\/g, "/")
	};
}
function resolveUnsafeLocalTitle(artifact) {
	return `Unsafe Local Import: ${artifact.relativePath}`;
}
async function writeUnsafeLocalSourcePage(params) {
	const { pageId, pagePath } = resolveUnsafeLocalPagePath({
		configuredPath: params.artifact.configuredPath,
		absolutePath: params.artifact.absolutePath
	});
	const title = resolveUnsafeLocalTitle(params.artifact);
	const renderFingerprint = createHash("sha1").update(JSON.stringify({
		configuredPath: params.artifact.configuredPath,
		relativePath: params.artifact.relativePath
	})).digest("hex");
	return writeImportedSourcePage({
		vaultRoot: params.config.vault.path,
		syncKey: params.artifact.syncKey,
		sourcePath: params.artifact.absolutePath,
		sourceUpdatedAtMs: params.sourceUpdatedAtMs,
		sourceSize: params.sourceSize,
		renderFingerprint,
		pagePath,
		group: "unsafe-local",
		state: params.state,
		buildRendered: (raw, updatedAt) => renderWikiMarkdown({
			frontmatter: {
				pageType: "source",
				id: pageId,
				title,
				sourceType: "memory-unsafe-local",
				provenanceMode: "unsafe-local",
				sourcePath: params.artifact.absolutePath,
				unsafeLocalConfiguredPath: params.artifact.configuredPath,
				unsafeLocalRelativePath: params.artifact.relativePath,
				status: "active",
				updatedAt
			},
			body: [
				`# ${title}`,
				"",
				"## Unsafe Local Source",
				`- Configured path: \`${params.artifact.configuredPath}\``,
				`- Relative path: \`${params.artifact.relativePath}\``,
				`- Updated: ${updatedAt}`,
				"",
				"## Content",
				renderMarkdownFence(raw, detectFenceLanguage(params.artifact.absolutePath)),
				"",
				"## Notes",
				"<!-- openclaw:human:start -->",
				"<!-- openclaw:human:end -->",
				""
			].join("\n")
		})
	});
}
async function syncMemoryWikiUnsafeLocalSources(config) {
	await initializeMemoryWikiVault(config);
	if (config.vaultMode !== "unsafe-local" || !config.unsafeLocal.allowPrivateMemoryCoreAccess || config.unsafeLocal.paths.length === 0) return {
		importedCount: 0,
		updatedCount: 0,
		skippedCount: 0,
		removedCount: 0,
		artifactCount: 0,
		workspaces: 0,
		pagePaths: []
	};
	const { artifacts, unavailableConfiguredPaths } = await collectUnsafeLocalArtifacts(config.unsafeLocal.paths);
	const state = await readMemoryWikiSourceSyncState(config.vault.path);
	const activeKeys = /* @__PURE__ */ new Set();
	for (const [syncKey, entry] of Object.entries(state.entries)) if (entry.group === "unsafe-local" && unavailableConfiguredPaths.some((configuredPath) => isSourceWithinConfiguredPath(entry.sourcePath, configuredPath))) activeKeys.add(syncKey);
	assertMemoryWikiSourceSyncStateCapacity({
		state,
		group: "unsafe-local",
		incomingCount: (/* @__PURE__ */ new Set([...artifacts.map((artifact) => artifact.syncKey), ...activeKeys])).size
	});
	const results = await pMap(artifacts, async (artifact) => {
		const stats = await fs$1.stat(artifact.absolutePath);
		activeKeys.add(artifact.syncKey);
		return await writeUnsafeLocalSourcePage({
			config,
			artifact,
			sourceUpdatedAtMs: stats.mtimeMs,
			sourceSize: stats.size,
			state
		});
	}, {
		concurrency: UNSAFE_LOCAL_SYNC_CONCURRENCY,
		stopOnError: true
	});
	const removedCount = await pruneImportedSourceEntries({
		vaultRoot: config.vault.path,
		group: "unsafe-local",
		activeKeys,
		state
	});
	await writeMemoryWikiSourceSyncState(config.vault.path, state);
	const importedCount = results.filter((result) => result.changed && result.created).length;
	const updatedCount = results.filter((result) => result.changed && !result.created).length;
	const skippedCount = results.filter((result) => !result.changed).length;
	const pagePaths = results.map((result) => result.pagePath).toSorted((left, right) => left.localeCompare(right));
	if (importedCount > 0 || updatedCount > 0 || removedCount > 0) await appendMemoryWikiLog(config.vault.path, {
		type: "ingest",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			sourceType: "memory-unsafe-local",
			configuredPathCount: config.unsafeLocal.paths.length,
			artifactCount: artifacts.length,
			importedCount,
			updatedCount,
			skippedCount,
			removedCount
		}
	});
	return {
		importedCount,
		updatedCount,
		skippedCount,
		removedCount,
		artifactCount: artifacts.length,
		workspaces: 0,
		pagePaths
	};
}
//#endregion
//#region extensions/memory-wiki/src/source-sync.ts
const activeImportedSourceSyncs = /* @__PURE__ */ new Map();
function resolveImportedSourceSyncRequestKey(params, vaultKey) {
	return JSON.stringify({
		...params.config,
		vault: {
			...params.config.vault,
			path: vaultKey
		}
	});
}
async function syncMemoryWikiImportedSourcesOnce(params) {
	let syncResult;
	if (params.config.vaultMode === "bridge") syncResult = await syncMemoryWikiBridgeSources(params);
	else if (params.config.vaultMode === "unsafe-local") syncResult = await syncMemoryWikiUnsafeLocalSources(params.config);
	else syncResult = {
		importedCount: 0,
		updatedCount: 0,
		skippedCount: 0,
		removedCount: 0,
		artifactCount: 0,
		workspaces: 0,
		pagePaths: []
	};
	const refreshResult = await refreshMemoryWikiIndexesAfterImport({
		config: params.config,
		syncResult
	});
	return {
		...syncResult,
		indexesRefreshed: refreshResult.refreshed,
		indexUpdatedFiles: refreshResult.compile?.updatedFiles ?? [],
		indexRefreshReason: refreshResult.reason
	};
}
async function syncMemoryWikiImportedSources(params) {
	const vaultKey = await resolveMemoryWikiVaultMutationKey(params.config.vault.path);
	const requestKey = resolveImportedSourceSyncRequestKey(params, vaultKey);
	const active = activeImportedSourceSyncs.get(vaultKey) ?? [];
	const matching = active.find((entry) => entry.requestKey === requestKey && entry.appConfig === params.appConfig);
	if (matching) return await matching.promise;
	const promise = withMemoryWikiVaultMutation(params.config.vault.path, () => syncMemoryWikiImportedSourcesOnce(params));
	const entry = {
		requestKey,
		...params.appConfig ? { appConfig: params.appConfig } : {},
		promise
	};
	active.push(entry);
	activeImportedSourceSyncs.set(vaultKey, active);
	try {
		return await promise;
	} finally {
		const index = active.indexOf(entry);
		if (index >= 0) active.splice(index, 1);
		if (active.length === 0 && activeImportedSourceSyncs.get(vaultKey) === active) activeImportedSourceSyncs.delete(vaultKey);
	}
}
//#endregion
//#region extensions/memory-wiki/src/status.ts
async function collectVaultCounts(vaultPath) {
	const pageCounts = {
		entity: 0,
		concept: 0,
		source: 0,
		synthesis: 0,
		report: 0
	};
	const sourceCounts = {
		native: 0,
		bridge: 0,
		bridgeEvents: 0,
		unsafeLocal: 0,
		other: 0
	};
	for (const dir of [
		"entities",
		"concepts",
		"sources",
		"syntheses",
		"reports"
	]) {
		const entries = await walkMemoryWikiDirectory(vaultPath, dir);
		for (const entry of entries) {
			if (entry.kind !== "file" || !entry.relativePath.endsWith(".md") || path.basename(entry.relativePath) === "index.md") continue;
			const absolutePath = path.join(vaultPath, entry.relativePath);
			const relativeToVault = entry.relativePath.split(path.sep).join("/");
			const raw = await fs$1.readFile(absolutePath, "utf8").catch(() => null);
			if (raw === null) continue;
			const page = toWikiPageSummary({
				absolutePath,
				relativePath: relativeToVault,
				raw
			});
			if (!page) continue;
			pageCounts[page.kind] += 1;
			if (page.kind !== "source") continue;
			if (page.sourceType === "memory-bridge-events") sourceCounts.bridgeEvents += 1;
			else if (page.sourceType === "memory-bridge") sourceCounts.bridge += 1;
			else if (page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local") sourceCounts.unsafeLocal += 1;
			else if (!page.sourceType) sourceCounts.native += 1;
			else sourceCounts.other += 1;
		}
	}
	return {
		pageCounts,
		sourceCounts
	};
}
function buildWarnings(params) {
	const warnings = [];
	if (!params.vaultExists) warnings.push({
		code: "vault-missing",
		message: "Wiki vault has not been initialized yet."
	});
	if (params.config.obsidian.enabled && params.config.obsidian.useOfficialCli && !params.obsidianCommand) warnings.push({
		code: "obsidian-cli-missing",
		message: "Obsidian CLI is enabled in config but `obsidian` is not available on PATH."
	});
	if (params.config.vaultMode === "bridge" && !params.config.bridge.enabled) warnings.push({
		code: "bridge-disabled",
		message: "vaultMode is `bridge` but bridge.enabled is false."
	});
	if (params.config.vaultMode === "bridge" && params.config.bridge.enabled && params.config.bridge.readMemoryArtifacts && params.bridgePublicArtifactCount === 0) warnings.push({
		code: "bridge-artifacts-missing",
		message: "Bridge mode is enabled but the active memory plugin is not exporting any public memory artifacts yet."
	});
	if (params.config.vaultMode === "unsafe-local" && !params.config.unsafeLocal.allowPrivateMemoryCoreAccess) warnings.push({
		code: "unsafe-local-disabled",
		message: "vaultMode is `unsafe-local` but private memory-core access is disabled."
	});
	if (params.config.vaultMode === "unsafe-local" && params.config.unsafeLocal.allowPrivateMemoryCoreAccess && params.config.unsafeLocal.paths.length === 0) warnings.push({
		code: "unsafe-local-paths-missing",
		message: "unsafe-local access is enabled but no private paths are configured."
	});
	if (params.config.vaultMode !== "unsafe-local" && params.config.unsafeLocal.allowPrivateMemoryCoreAccess) warnings.push({
		code: "unsafe-local-without-mode",
		message: "Private memory-core access is enabled outside unsafe-local mode."
	});
	return warnings;
}
async function resolveMemoryWikiStatus(config, deps) {
	const agentId = resolveMemoryWikiVaultAgentId(config);
	const vaultExists = await (deps?.pathExists ?? pathExists)(config.vault.path);
	const bridgePublicArtifactCount = deps?.appConfig && config.vaultMode === "bridge" && config.bridge.enabled && config.bridge.readMemoryArtifacts ? filterMemoryWikiBridgeArtifacts({
		config,
		callerAgentId: deps.callerAgentId,
		artifacts: await (deps.listPublicArtifacts ?? listActiveMemoryPublicArtifacts)({ cfg: deps.appConfig })
	}).length : null;
	const obsidianProbe = await probeObsidianCli({ resolveCommand: deps?.resolveCommand });
	const counts = vaultExists ? await collectVaultCounts(config.vault.path) : {
		pageCounts: {
			entity: 0,
			concept: 0,
			source: 0,
			synthesis: 0,
			report: 0
		},
		sourceCounts: {
			native: 0,
			bridge: 0,
			bridgeEvents: 0,
			unsafeLocal: 0,
			other: 0
		}
	};
	return {
		vaultScope: config.vault.scope,
		agentId,
		vaultMode: config.vaultMode,
		renderMode: config.vault.renderMode,
		vaultPath: config.vault.path,
		vaultExists,
		bridge: config.bridge,
		bridgePublicArtifactCount,
		obsidianCli: {
			enabled: config.obsidian.enabled,
			requested: config.obsidian.enabled && config.obsidian.useOfficialCli,
			available: obsidianProbe.available,
			command: obsidianProbe.command
		},
		unsafeLocal: {
			allowPrivateMemoryCoreAccess: config.unsafeLocal.allowPrivateMemoryCoreAccess,
			pathCount: config.unsafeLocal.paths.length
		},
		pageCounts: counts.pageCounts,
		sourceCounts: counts.sourceCounts,
		warnings: buildWarnings({
			config,
			bridgePublicArtifactCount,
			vaultExists,
			obsidianCommand: obsidianProbe.command
		})
	};
}
function buildMemoryWikiDoctorReport(status) {
	const fixes = status.warnings.map((warning) => ({
		code: warning.code,
		message: warning.code === "vault-missing" ? "Run `openclaw wiki init` to create the vault layout." : warning.code === "obsidian-cli-missing" ? "Install the official Obsidian CLI or disable `obsidian.useOfficialCli`." : warning.code === "bridge-disabled" ? "Enable `plugins.entries.memory-wiki.config.bridge.enabled` or switch vaultMode away from `bridge`." : warning.code === "bridge-artifacts-missing" ? "Use a memory plugin that exports public artifacts, create/import memory artifacts first, or switch the wiki back to isolated mode." : warning.code === "unsafe-local-disabled" ? "Enable `unsafeLocal.allowPrivateMemoryCoreAccess` or switch vaultMode away from `unsafe-local`." : warning.code === "unsafe-local-paths-missing" ? "Add explicit `unsafeLocal.paths` entries before running unsafe-local imports." : "Disable private memory-core access unless you explicitly want unsafe-local mode."
	}));
	return {
		healthy: status.warnings.length === 0,
		warningCount: status.warnings.length,
		status,
		fixes
	};
}
function renderMemoryWikiStatus(status) {
	const lines = [
		`Wiki vault mode: ${status.vaultMode}`,
		`Vault scope: ${status.vaultScope}${status.agentId ? ` (${status.agentId})` : ""}`,
		`Vault: ${status.vaultExists ? "ready" : "missing"} (${status.vaultPath})`,
		`Render mode: ${status.renderMode}`,
		`Obsidian CLI: ${status.obsidianCli.available ? "available" : "missing"}${status.obsidianCli.requested ? " (requested)" : ""}`,
		`Bridge: ${status.bridge.enabled ? "enabled" : "disabled"}${typeof status.bridgePublicArtifactCount === "number" ? ` (${status.bridgePublicArtifactCount} exported artifact${status.bridgePublicArtifactCount === 1 ? "" : "s"})` : ""}`,
		`Unsafe local: ${status.unsafeLocal.allowPrivateMemoryCoreAccess ? `enabled (${status.unsafeLocal.pathCount} paths)` : "disabled"}`,
		`Pages: ${status.pageCounts.source} sources, ${status.pageCounts.entity} entities, ${status.pageCounts.concept} concepts, ${status.pageCounts.synthesis} syntheses, ${status.pageCounts.report} reports`,
		`Source provenance: ${status.sourceCounts.native} native, ${status.sourceCounts.bridge} bridge, ${status.sourceCounts.bridgeEvents} bridge-events, ${status.sourceCounts.unsafeLocal} unsafe-local, ${status.sourceCounts.other} other`
	];
	if (status.warnings.length > 0) {
		lines.push("", "Warnings:");
		for (const warning of status.warnings) lines.push(`- ${warning.message}`);
	}
	return lines.join("\n");
}
function renderMemoryWikiDoctor(report) {
	const lines = [
		report.healthy ? "Wiki doctor: healthy" : `Wiki doctor: ${report.warningCount} issue(s) found`,
		"",
		renderMemoryWikiStatus(report.status)
	];
	if (report.fixes.length > 0) {
		lines.push("", "Suggested fixes:");
		for (const fix of report.fixes) lines.push(`- ${fix.message}`);
	}
	return lines.join("\n");
}
//#endregion
//#region extensions/memory-wiki/src/cli.ts
const WIKI_GATEWAY_TIMEOUT_MS = "30000";
const GATEWAY_TERMINAL_STRING_MAX_CHARS = 2e3;
const GATEWAY_RESPONSE_MAX_ARRAY_ITEMS = 1e4;
const GATEWAY_RESPONSE_MAX_STRING_CHARS = 1e4;
const GATEWAY_RESPONSE_MAX_CODE_CHARS = 256;
const ANSI_ESCAPE_SEQUENCE_PATTERN = new RegExp(String.raw`(?:\x1B\[[0-?]*[ -/]*[@-~]|\x1B[@-Z\\-_]|\x9B[0-?]*[ -/]*[@-~])`, "g");
const TERMINAL_CONTROL_CHARACTER_PATTERN = new RegExp(String.raw`[\x00-\x1F\x7F-\x9F]+`, "g");
const UNICODE_FORMAT_CONTROL_PATTERN = /[\u061C\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;
function sanitizeGatewayStringForTerminal(value) {
	const sanitized = (value.length > GATEWAY_TERMINAL_STRING_MAX_CHARS ? truncateUtf16Safe(value, GATEWAY_TERMINAL_STRING_MAX_CHARS) : value).replace(ANSI_ESCAPE_SEQUENCE_PATTERN, "").replace(TERMINAL_CONTROL_CHARACTER_PATTERN, " ").replace(UNICODE_FORMAT_CONTROL_PATTERN, "");
	return value.length > GATEWAY_TERMINAL_STRING_MAX_CHARS ? `${sanitized}... [truncated]` : sanitized;
}
function escapeGatewayJsonForTerminal(json) {
	return json.replace(UNICODE_FORMAT_CONTROL_PATTERN, (char) => {
		const codePoint = char.codePointAt(0);
		return typeof codePoint === "number" ? `\\u${codePoint.toString(16).padStart(4, "0")}` : "";
	});
}
function writeOutput(output, writer = process.stdout) {
	writer.write(output.endsWith("\n") ? output : `${output}\n`);
}
function shouldRouteBridgeRuntimeThroughGateway(config) {
	return config.vaultMode === "bridge" && config.bridge.enabled && config.bridge.readMemoryArtifacts;
}
function isBoundedGatewayString(value, maxChars = GATEWAY_RESPONSE_MAX_STRING_CHARS) {
	return typeof value === "string" && value.length <= maxChars;
}
function isStringArray(value, maxChars = GATEWAY_RESPONSE_MAX_STRING_CHARS) {
	return Array.isArray(value) && value.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS && value.every((item) => isBoundedGatewayString(item, maxChars));
}
function hasNumberFields(value, keys) {
	return keys.every((key) => typeof value[key] === "number");
}
function isWarningList(value) {
	return Array.isArray(value) && value.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS && value.every((item) => isRecord(item) && isBoundedGatewayString(item.code, GATEWAY_RESPONSE_MAX_CODE_CHARS) && isBoundedGatewayString(item.message));
}
function isMemoryWikiStatus(value) {
	if (!isRecord(value)) return false;
	const bridge = value.bridge;
	const obsidianCli = value.obsidianCli;
	const unsafeLocal = value.unsafeLocal;
	const pageCounts = value.pageCounts;
	const sourceCounts = value.sourceCounts;
	return isBoundedGatewayString(value.vaultScope, GATEWAY_RESPONSE_MAX_CODE_CHARS) && (isBoundedGatewayString(value.agentId, GATEWAY_RESPONSE_MAX_CODE_CHARS) || value.agentId === null) && isBoundedGatewayString(value.vaultMode, GATEWAY_RESPONSE_MAX_CODE_CHARS) && isBoundedGatewayString(value.renderMode, GATEWAY_RESPONSE_MAX_CODE_CHARS) && isBoundedGatewayString(value.vaultPath) && typeof value.vaultExists === "boolean" && (typeof value.bridgePublicArtifactCount === "number" || value.bridgePublicArtifactCount === null) && isRecord(bridge) && typeof bridge.enabled === "boolean" && isRecord(obsidianCli) && typeof obsidianCli.enabled === "boolean" && typeof obsidianCli.requested === "boolean" && typeof obsidianCli.available === "boolean" && (isBoundedGatewayString(obsidianCli.command) || obsidianCli.command === null) && isRecord(unsafeLocal) && typeof unsafeLocal.allowPrivateMemoryCoreAccess === "boolean" && typeof unsafeLocal.pathCount === "number" && isRecord(pageCounts) && hasNumberFields(pageCounts, [
		"source",
		"entity",
		"concept",
		"synthesis",
		"report"
	]) && isRecord(sourceCounts) && hasNumberFields(sourceCounts, [
		"native",
		"bridge",
		"bridgeEvents",
		"unsafeLocal",
		"other"
	]) && isWarningList(value.warnings);
}
function isMemoryWikiDoctorReport(value) {
	return isRecord(value) && typeof value.healthy === "boolean" && typeof value.warningCount === "number" && isMemoryWikiStatus(value.status) && Array.isArray(value.fixes) && value.fixes.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS && value.fixes.every((item) => isRecord(item) && isBoundedGatewayString(item.code, GATEWAY_RESPONSE_MAX_CODE_CHARS) && isBoundedGatewayString(item.message));
}
function isMemoryWikiImportResult(value) {
	return isRecord(value) && hasNumberFields(value, [
		"importedCount",
		"updatedCount",
		"skippedCount",
		"removedCount",
		"artifactCount",
		"workspaces"
	]) && isStringArray(value.pagePaths) && typeof value.indexesRefreshed === "boolean" && isStringArray(value.indexUpdatedFiles) && isBoundedGatewayString(value.indexRefreshReason, GATEWAY_RESPONSE_MAX_CODE_CHARS);
}
function validateWikiGatewayResult(method, value) {
	if (method === "wiki.status" && isMemoryWikiStatus(value)) return value;
	if (method === "wiki.doctor" && isMemoryWikiDoctorReport(value)) return value;
	if (method === "wiki.bridge.import" && isMemoryWikiImportResult(value)) return value;
	throw new Error(`Invalid Gateway response for ${method}.`);
}
async function callWikiGateway(method, agentId) {
	return validateWikiGatewayResult(method, await callGatewayFromCli(method, { timeout: WIKI_GATEWAY_TIMEOUT_MS }, agentId ? { agentId } : void 0, { progress: false }));
}
function normalizeCliStringList(values) {
	if (!values) return;
	const uniqueValues = uniqueStrings(normalizeStringEntries(values));
	return uniqueValues.length > 0 ? uniqueValues : void 0;
}
function collectCliValues(value, acc = []) {
	acc.push(value);
	return acc;
}
function parseWikiSearchEnumOption(value, allowed, label) {
	if (allowed.includes(value)) return value;
	throw new Error(`Invalid ${label}: ${value}. Expected one of: ${allowed.join(", ")}`);
}
async function resolveWikiApplyBody(params) {
	if (params.body?.trim()) return params.body;
	if (params.bodyFile?.trim()) return await fs$1.readFile(params.bodyFile, "utf8");
	throw new Error("wiki apply synthesis requires --body or --body-file.");
}
function formatMemoryWikiMutationSummary(result, json) {
	if (json) return JSON.stringify(result, null, 2);
	return `${result.changed ? "Updated" : "No changes for"} ${result.pagePath} via ${result.operation}. ${result.compile.updatedFiles.length > 0 ? `Refreshed ${result.compile.updatedFiles.length} index file${result.compile.updatedFiles.length === 1 ? "" : "s"}.` : "Indexes unchanged."}`;
}
function formatJsonOrText(result, json, render) {
	return json ? JSON.stringify(result, null, 2) : render(result);
}
function formatGatewayJsonOrText(result, json, render) {
	return json ? escapeGatewayJsonForTerminal(JSON.stringify(result, null, 2)) : sanitizeGatewayStringForTerminal(render(result));
}
async function runWikiCommandWithSummary(params) {
	const result = await params.run();
	writeOutput(formatJsonOrText(result, params.json, params.render), params.stdout);
	return result;
}
async function runSyncedWikiCommandWithSummary(params) {
	await syncMemoryWikiImportedSources({
		config: params.config,
		appConfig: params.appConfig
	});
	return runWikiCommandWithSummary(params);
}
function addWikiSearchConfigOptions(command) {
	return command.option("--backend <backend>", `Search backend (${WIKI_SEARCH_BACKENDS.join(", ")})`, (value) => parseWikiSearchEnumOption(value, WIKI_SEARCH_BACKENDS, "backend")).option("--corpus <corpus>", `Search corpus (${WIKI_SEARCH_CORPORA.join(", ")})`, (value) => parseWikiSearchEnumOption(value, WIKI_SEARCH_CORPORA, "corpus"));
}
function invalidCliArgument(message) {
	const error = new Error(message);
	error.name = "InvalidArgumentError";
	error.code = "commander.invalidArgument";
	error.exitCode = 1;
	return error;
}
function parseWikiConfidenceOption(value) {
	const trimmed = value.trim();
	const confidence = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed) ? Number(trimmed) : NaN;
	if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw invalidCliArgument("--confidence must be a number between 0 and 1.");
	return confidence;
}
function parseWikiPositiveIntegerOption(value, flag) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw invalidCliArgument(`${flag} must be a positive integer.`);
	return parsed;
}
function addWikiApplyMutationOptions(command) {
	return command.option("--source-id <id>", "Source id", collectCliValues).option("--contradiction <text>", "Contradiction note", collectCliValues).option("--question <text>", "Open question", collectCliValues).option("--confidence <n>", "Confidence score between 0 and 1", parseWikiConfidenceOption).option("--status <status>", "Page status");
}
async function runWikiStatus(params) {
	const routeThroughGateway = shouldRouteBridgeRuntimeThroughGateway(params.config);
	const status = routeThroughGateway ? await callWikiGateway("wiki.status", params.agentId) : await (async () => {
		await syncMemoryWikiImportedSources({
			config: params.config,
			appConfig: params.appConfig
		});
		return await resolveMemoryWikiStatus(params.config, { appConfig: params.appConfig });
	})();
	writeOutput(routeThroughGateway ? formatGatewayJsonOrText(status, params.json, renderMemoryWikiStatus) : formatJsonOrText(status, params.json, renderMemoryWikiStatus), params.stdout);
	return status;
}
async function runWikiDoctor(params) {
	const routeThroughGateway = shouldRouteBridgeRuntimeThroughGateway(params.config);
	const report = routeThroughGateway ? await callWikiGateway("wiki.doctor", params.agentId) : await (async () => {
		await syncMemoryWikiImportedSources({
			config: params.config,
			appConfig: params.appConfig
		});
		return buildMemoryWikiDoctorReport(await resolveMemoryWikiStatus(params.config, { appConfig: params.appConfig }));
	})();
	if (!report.healthy) process.exitCode = 1;
	writeOutput(routeThroughGateway ? formatGatewayJsonOrText(report, params.json, renderMemoryWikiDoctor) : formatJsonOrText(report, params.json, renderMemoryWikiDoctor), params.stdout);
	return report;
}
async function runWikiInit(params) {
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => initializeMemoryWikiVault(params.config),
		render: (value) => `Initialized wiki vault at ${value.rootDir} (${value.createdDirectories.length} dirs, ${value.createdFiles.length} files).`
	});
}
async function runWikiCompile(params) {
	return runSyncedWikiCommandWithSummary({
		config: params.config,
		appConfig: params.appConfig,
		json: params.json,
		stdout: params.stdout,
		run: () => compileMemoryWikiVault(params.config),
		render: (value) => `Compiled wiki vault at ${value.vaultRoot} (${value.pages.length} pages, ${value.updatedFiles.length} indexes updated).`
	});
}
async function runWikiLint(params) {
	return runSyncedWikiCommandWithSummary({
		config: params.config,
		appConfig: params.appConfig,
		json: params.json,
		stdout: params.stdout,
		run: () => lintMemoryWikiVault(params.config),
		render: (value) => `Linted wiki vault at ${value.vaultRoot} (${value.issueCount} issues, report: ${value.reportPath}).`
	});
}
async function runWikiIngest(params) {
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => ingestMemoryWikiSource({
			config: params.config,
			inputPath: params.inputPath,
			title: params.title
		}),
		render: (value) => `Ingested ${value.sourcePath} into ${value.pagePath}. Refreshed ${value.indexUpdatedFiles.length} index file${value.indexUpdatedFiles.length === 1 ? "" : "s"}.`
	});
}
async function runWikiOkfImport(params) {
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => importMemoryWikiOkfBundle({
			config: params.config,
			bundlePath: params.bundlePath
		}),
		render: formatOkfImportSummary
	});
}
async function runWikiSearch(params) {
	if (params.mode && !WIKI_SEARCH_MODES.includes(params.mode)) throw new Error(`wiki search --mode must be one of: ${WIKI_SEARCH_MODES.join(", ")}.`);
	await syncMemoryWikiImportedSources({
		config: params.config,
		appConfig: params.appConfig
	});
	const results = await searchMemoryWiki({
		config: params.config,
		appConfig: params.appConfig,
		...params.agentId ? { agentId: params.agentId } : {},
		query: params.query,
		maxResults: params.maxResults,
		searchBackend: params.searchBackend,
		searchCorpus: params.searchCorpus,
		mode: params.mode
	});
	writeOutput(params.json ? JSON.stringify(results, null, 2) : results.length === 0 ? "No wiki or memory results." : results.map((result, index) => `${index + 1}. ${result.title} (${result.corpus}/${result.kind})\nPath: ${result.path}${typeof result.startLine === "number" && typeof result.endLine === "number" ? `\nLines: ${result.startLine}-${result.endLine}` : ""}${result.provenanceLabel ? `\nProvenance: ${result.provenanceLabel}` : ""}${result.matchedClaimId ? `\nClaim: ${result.matchedClaimId}` : ""}${result.evidenceKinds && result.evidenceKinds.length > 0 ? `\nEvidence: ${result.evidenceKinds.join(", ")}` : ""}\nSnippet: ${result.snippet}`).join("\n\n"), params.stdout);
	return results;
}
async function runWikiGet(params) {
	await syncMemoryWikiImportedSources({
		config: params.config,
		appConfig: params.appConfig
	});
	const result = await getMemoryWikiPage({
		config: params.config,
		appConfig: params.appConfig,
		...params.agentId ? { agentId: params.agentId } : {},
		lookup: params.lookup,
		fromLine: params.fromLine,
		lineCount: params.lineCount,
		searchBackend: params.searchBackend,
		searchCorpus: params.searchCorpus
	});
	writeOutput(params.json ? JSON.stringify(result, null, 2) : result?.content ?? `Wiki page not found: ${params.lookup}`, params.stdout);
	return result;
}
async function runWikiApplySynthesis(params) {
	const sourceIds = normalizeCliStringList(params.sourceIds);
	if (!sourceIds) throw new Error("wiki apply synthesis requires at least one --source-id.");
	const body = await resolveWikiApplyBody({
		body: params.body,
		bodyFile: params.bodyFile
	});
	await syncMemoryWikiImportedSources({
		config: params.config,
		appConfig: params.appConfig
	});
	const result = await applyMemoryWikiMutation({
		config: params.config,
		mutation: {
			op: "create_synthesis",
			title: params.title,
			body,
			sourceIds,
			...normalizeCliStringList(params.contradictions) ? { contradictions: normalizeCliStringList(params.contradictions) } : {},
			...normalizeCliStringList(params.questions) ? { questions: normalizeCliStringList(params.questions) } : {},
			...typeof params.confidence === "number" ? { confidence: params.confidence } : {},
			...params.status?.trim() ? { status: params.status.trim() } : {}
		}
	});
	writeOutput(formatMemoryWikiMutationSummary(result, params.json), params.stdout);
	return result;
}
async function runWikiApplyMetadata(params) {
	await syncMemoryWikiImportedSources({
		config: params.config,
		appConfig: params.appConfig
	});
	const result = await applyMemoryWikiMutation({
		config: params.config,
		mutation: {
			op: "update_metadata",
			lookup: params.lookup,
			...normalizeCliStringList(params.sourceIds) ? { sourceIds: normalizeCliStringList(params.sourceIds) } : {},
			...normalizeCliStringList(params.contradictions) ? { contradictions: normalizeCliStringList(params.contradictions) } : {},
			...normalizeCliStringList(params.questions) ? { questions: normalizeCliStringList(params.questions) } : {},
			...params.clearConfidence ? { confidence: null } : typeof params.confidence === "number" ? { confidence: params.confidence } : {},
			...params.status?.trim() ? { status: params.status.trim() } : {}
		}
	});
	writeOutput(formatMemoryWikiMutationSummary(result, params.json), params.stdout);
	return result;
}
async function runWikiBridgeImport(params) {
	const render = (value) => `Bridge import synced ${value.artifactCount} artifacts across ${value.workspaces} workspaces (${value.importedCount} new, ${value.updatedCount} updated, ${value.skippedCount} unchanged, ${value.removedCount} removed). Indexes ${value.indexesRefreshed ? `refreshed (${value.indexUpdatedFiles.length} files)` : `not refreshed (${value.indexRefreshReason})`}.`;
	if (shouldRouteBridgeRuntimeThroughGateway(params.config)) {
		const result = await callWikiGateway("wiki.bridge.import", params.agentId);
		writeOutput(formatGatewayJsonOrText(result, params.json, render), params.stdout);
		return result;
	}
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => syncMemoryWikiImportedSources({
			config: params.config,
			appConfig: params.appConfig
		}),
		render
	});
}
async function runWikiUnsafeLocalImport(params) {
	if (params.config.vault.scope === "agent") throw new Error("Unsafe-local import does not support memory-wiki vault.scope=agent.");
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => syncMemoryWikiImportedSources({
			config: params.config,
			appConfig: params.appConfig
		}),
		render: (value) => `Unsafe-local import synced ${value.artifactCount} artifacts (${value.importedCount} new, ${value.updatedCount} updated, ${value.skippedCount} unchanged, ${value.removedCount} removed). Indexes ${value.indexesRefreshed ? `refreshed (${value.indexUpdatedFiles.length} files)` : `not refreshed (${value.indexRefreshReason})`}.`
	});
}
async function runWikiObsidianStatus(params) {
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => probeObsidianCli(),
		render: (value) => value.available ? `Obsidian CLI available at ${value.command}` : "Obsidian CLI is not available on PATH."
	});
}
function assertOfficialObsidianCliSupported(config) {
	if (config.vault.scope === "agent") throw new Error("Official Obsidian CLI actions do not support memory-wiki vault.scope=agent.");
}
async function runWikiObsidianSearch(params) {
	assertOfficialObsidianCliSupported(params.config);
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => runObsidianSearch({
			config: params.config,
			query: params.query
		}),
		render: (value) => value.stdout.trim()
	});
}
async function runWikiObsidianOpenCli(params) {
	assertOfficialObsidianCliSupported(params.config);
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => runObsidianOpen({
			config: params.config,
			vaultPath: params.vaultPath
		}),
		render: (value) => value.stdout.trim() || "Opened in Obsidian."
	});
}
async function runWikiObsidianCommandCli(params) {
	assertOfficialObsidianCliSupported(params.config);
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => runObsidianCommand({
			config: params.config,
			id: params.id
		}),
		render: (value) => value.stdout.trim() || "Command sent to Obsidian."
	});
}
async function runWikiObsidianDailyCli(params) {
	assertOfficialObsidianCliSupported(params.config);
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => runObsidianDaily({ config: params.config }),
		render: (value) => value.stdout.trim() || "Opened today's daily note."
	});
}
function formatChatGptImportSummary(result) {
	if (result.dryRun) return `ChatGPT import dry run scanned ${result.conversationCount} conversations (${result.createdCount} new, ${result.updatedCount} updated, ${result.skippedCount} unchanged).`;
	const runSuffix = result.runId ? ` Run id: ${result.runId}.` : "";
	return `ChatGPT import applied ${result.conversationCount} conversations (${result.createdCount} new, ${result.updatedCount} updated, ${result.skippedCount} unchanged). Refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.${runSuffix}`;
}
function formatChatGptRollbackSummary(result) {
	const preservedNote = result.preservedPaths.length > 0 ? ` Preserved ${result.preservedPaths.length} page${result.preservedPaths.length === 1 ? "" : "s"} edited after import: ${result.preservedPaths.map((entry) => entry.recoveryPath).join(", ")}.` : "";
	if (result.alreadyRolledBack) return `ChatGPT import run ${result.runId} was already rolled back.${preservedNote}`;
	return `Rolled back ChatGPT import run ${result.runId} (${result.removedCount} removed, ${result.restoredCount} restored).${preservedNote} Refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.`;
}
async function runWikiChatGptImport(params) {
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => importChatGptConversations({
			config: params.config,
			exportPath: params.exportPath,
			dryRun: params.dryRun
		}),
		render: formatChatGptImportSummary
	});
}
async function runWikiChatGptRollback(params) {
	return runWikiCommandWithSummary({
		json: params.json,
		stdout: params.stdout,
		run: () => rollbackChatGptImportRun({
			config: params.config,
			runId: params.runId
		}),
		render: formatChatGptRollbackSummary
	});
}
function registerWikiCli(program, registration) {
	const resolveConfig = registration.resolveConfig ?? ((agentId, currentAppConfig) => resolveMemoryWikiAgentConfig({
		config: registration.config,
		appConfig: currentAppConfig,
		...agentId ? { agentId } : {}
	}));
	let commandContext;
	const requireCommandContext = () => {
		if (!commandContext) throw new Error("Memory Wiki CLI agent context was not resolved.");
		return commandContext;
	};
	const wiki = program.command("wiki").description("Inspect and initialize the memory wiki vault").option("--agent <id>", "Agent id for agent-scoped wiki vaults");
	wiki.hook("preAction", (_thisCommand, actionCommand) => {
		const needsAgent = actionCommand.options.some((option) => option.long === "--agent");
		const requestedAgentId = actionCommand.opts().agent?.trim() || wiki.opts().agent?.trim() || void 0;
		const currentAppConfig = registration.getAppConfig?.();
		let agentId = requestedAgentId;
		if (needsAgent && !agentId && (registration.config.vault.scope === "agent" || currentAppConfig)) try {
			agentId = resolveDefaultAgentId(currentAppConfig ?? {});
		} catch {
			throw new Error("No default memory-wiki agent is configured. Pass --agent <id>, or add an agent with `openclaw agents add`.");
		}
		const config = needsAgent ? resolveConfig(agentId, currentAppConfig) : registration.config;
		agentId = config.agentId ?? agentId;
		commandContext = {
			config,
			...currentAppConfig ? { appConfig: currentAppConfig } : {},
			...agentId ? { agentId } : {}
		};
	});
	wiki.command("status").description("Show wiki vault status").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		await runWikiStatus({
			config,
			appConfig,
			agentId,
			json: opts.json
		});
	});
	wiki.command("doctor").description("Audit wiki vault setup and report actionable fixes").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		await runWikiDoctor({
			config,
			appConfig,
			agentId,
			json: opts.json
		});
	});
	wiki.command("init").description("Initialize the wiki vault layout").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (opts) => {
		const { config } = requireCommandContext();
		await runWikiInit({
			config,
			json: opts.json
		});
	});
	wiki.command("compile").description("Refresh generated wiki indexes").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (opts) => {
		const { appConfig, config } = requireCommandContext();
		await runWikiCompile({
			config,
			appConfig,
			json: opts.json
		});
	});
	wiki.command("lint").description("Lint the wiki vault and write a report").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (opts) => {
		const { appConfig, config } = requireCommandContext();
		await runWikiLint({
			config,
			appConfig,
			json: opts.json
		});
	});
	wiki.command("ingest").description("Ingest a local file into the wiki sources folder").argument("<path>", "Local file path to ingest").option("--agent <id>", "Agent id (default: configured default agent)").option("--title <title>", "Override the source title").option("--json", "Print JSON").action(async (inputPath, opts) => {
		const { config } = requireCommandContext();
		await runWikiIngest({
			config,
			inputPath,
			title: opts.title,
			json: opts.json
		});
	});
	wiki.command("okf").description("Import Open Knowledge Format bundles").command("import").description("Import an unpacked OKF bundle into wiki concept pages").argument("<path>", "OKF bundle directory").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (bundlePath, opts) => {
		const { config } = requireCommandContext();
		await runWikiOkfImport({
			config,
			bundlePath,
			json: opts.json
		});
	});
	addWikiSearchConfigOptions(wiki.command("search").description("Search wiki pages and, when configured, the active memory corpus").argument("<query>", "Search query").option("--agent <id>", "Agent id (default: configured default agent)").option("--max-results <n>", "Maximum results", (value) => parseWikiPositiveIntegerOption(value, "--max-results")).option("--mode <mode>", `Search mode (${WIKI_SEARCH_MODES.join(", ")})`)).option("--json", "Print JSON").action(async (query, opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		await runWikiSearch({
			config,
			appConfig,
			agentId,
			query,
			maxResults: opts.maxResults,
			searchBackend: opts.backend,
			searchCorpus: opts.corpus,
			mode: opts.mode,
			json: opts.json
		});
	});
	addWikiSearchConfigOptions(wiki.command("get").description("Read a wiki page by id or relative path, with optional active-memory fallback").argument("<lookup>", "Relative path or page id").option("--agent <id>", "Agent id (default: configured default agent)").option("--from <n>", "Start line", (value) => parseWikiPositiveIntegerOption(value, "--from")).option("--lines <n>", "Number of lines", (value) => parseWikiPositiveIntegerOption(value, "--lines"))).option("--json", "Print JSON").action(async (lookup, opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		await runWikiGet({
			config,
			appConfig,
			agentId,
			lookup,
			fromLine: opts.from,
			lineCount: opts.lines,
			searchBackend: opts.backend,
			searchCorpus: opts.corpus,
			json: opts.json
		});
	});
	const apply = wiki.command("apply").description("Apply narrow wiki mutations");
	addWikiApplyMutationOptions(apply.command("synthesis").description("Create or refresh a synthesis page with managed summary content").argument("<title>", "Synthesis title").option("--agent <id>", "Agent id (default: configured default agent)").option("--body <text>", "Summary body text").option("--body-file <path>", "Read summary body text from a file")).option("--json", "Print JSON").action(async (title, opts) => {
		const { appConfig, config } = requireCommandContext();
		await runWikiApplySynthesis({
			config,
			appConfig,
			title,
			body: opts.body,
			bodyFile: opts.bodyFile,
			sourceIds: opts.sourceId,
			contradictions: opts.contradiction,
			questions: opts.question,
			confidence: opts.confidence,
			status: opts.status,
			json: opts.json
		});
	});
	addWikiApplyMutationOptions(apply.command("metadata").description("Update metadata on an existing page").argument("<lookup>", "Relative path or page id").option("--agent <id>", "Agent id (default: configured default agent)")).option("--clear-confidence", "Remove any stored confidence value").option("--json", "Print JSON").action(async (lookup, opts) => {
		const { appConfig, config } = requireCommandContext();
		await runWikiApplyMetadata({
			config,
			appConfig,
			lookup,
			sourceIds: opts.sourceId,
			contradictions: opts.contradiction,
			questions: opts.question,
			confidence: opts.confidence,
			clearConfidence: opts.clearConfidence,
			status: opts.status,
			json: opts.json
		});
	});
	wiki.command("bridge").description("Import public memory artifacts into the wiki vault").command("import").description("Sync bridge-backed memory artifacts into wiki source pages").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		await runWikiBridgeImport({
			config,
			appConfig,
			agentId,
			json: opts.json
		});
	});
	wiki.command("unsafe-local").description("Import explicitly configured private local paths into wiki source pages").command("import").description("Sync unsafe-local configured paths into wiki source pages").option("--json", "Print JSON").action(async (opts) => {
		const { appConfig, config } = requireCommandContext();
		await runWikiUnsafeLocalImport({
			config,
			appConfig,
			json: opts.json
		});
	});
	const chatgpt = wiki.command("chatgpt").description("Import ChatGPT export history into wiki source pages");
	chatgpt.command("import").description("Import a ChatGPT export into draft wiki source pages").requiredOption("--export <path>", "ChatGPT export directory or conversations.json path").option("--agent <id>", "Agent id (default: configured default agent)").option("--dry-run", "Preview changes without writing", false).option("--json", "Print JSON").action(async (opts) => {
		const { config } = requireCommandContext();
		await runWikiChatGptImport({
			config,
			exportPath: opts.export,
			dryRun: opts.dryRun,
			json: opts.json
		});
	});
	chatgpt.command("rollback").description("Roll back a previously applied ChatGPT import run").argument("<run-id>", "Import run id").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Print JSON").action(async (runId, opts) => {
		const { config } = requireCommandContext();
		await runWikiChatGptRollback({
			config,
			runId,
			json: opts.json
		});
	});
	const obsidian = wiki.command("obsidian").description("Run official Obsidian CLI helpers");
	obsidian.command("status").description("Probe the Obsidian CLI").option("--json", "Print JSON").action(async (opts) => {
		const { config } = requireCommandContext();
		await runWikiObsidianStatus({
			config,
			json: opts.json
		});
	});
	obsidian.command("search").description("Search the current Obsidian vault").argument("<query>", "Search query").option("--json", "Print JSON").action(async (query, opts) => {
		const { config } = requireCommandContext();
		await runWikiObsidianSearch({
			config,
			query,
			json: opts.json
		});
	});
	obsidian.command("open").description("Open a file in Obsidian by vault-relative path").argument("<path>", "Vault-relative path").option("--json", "Print JSON").action(async (vaultPath, opts) => {
		const { config } = requireCommandContext();
		await runWikiObsidianOpenCli({
			config,
			vaultPath,
			json: opts.json
		});
	});
	obsidian.command("command").description("Execute an Obsidian command palette command by id").argument("<id>", "Obsidian command id").option("--json", "Print JSON").action(async (id, opts) => {
		const { config } = requireCommandContext();
		await runWikiObsidianCommandCli({
			config,
			id,
			json: opts.json
		});
	});
	obsidian.command("daily").description("Open today's daily note in Obsidian").option("--json", "Print JSON").action(async (opts) => {
		const { config } = requireCommandContext();
		await runWikiObsidianDailyCli({
			config,
			json: opts.json
		});
	});
}
//#endregion
export { loadMemoryWikiValidatedVaultIdentity as S, readQueryableWikiPages as _, syncMemoryWikiImportedSources as a, initializeMemoryWikiVault as b, runObsidianDaily as c, lintMemoryWikiVault as d, ingestMemoryWikiSource as f, getMemoryWikiPage as g, WIKI_SEARCH_MODES as h, resolveMemoryWikiStatus as i, runObsidianOpen as l, normalizeMemoryWikiMutationInput as m, buildMemoryWikiDoctorReport as n, probeObsidianCli as o, applyMemoryWikiMutation as p, renderMemoryWikiStatus as r, runObsidianCommand as s, registerWikiCli as t, runObsidianSearch as u, searchMemoryWiki as v, ensureMemoryWikiVaultGeneration as x, compileMemoryWikiVault as y };
