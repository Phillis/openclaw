import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./text-utility-runtime-BNhX-3os.js";
import { b as writeMemoryCoreWorkspaceEntries, d as SHORT_TERM_RECALL_NAMESPACE, h as memoryCoreStateReference, l as SHORT_TERM_META_NAMESPACE, u as SHORT_TERM_PHASE_SIGNAL_NAMESPACE, x as writeMemoryCoreWorkspaceEntry, y as readMemoryCoreWorkspaceEntries } from "./dreaming-state-B0qd2W7q.js";
import path from "node:path";
import { createHash } from "node:crypto";
const CONCEPT_STOP_WORDS = new Set(Object.values({
	shared: [
		"about",
		"after",
		"agent",
		"again",
		"also",
		"assistant",
		"because",
		"before",
		"being",
		"between",
		"build",
		"called",
		"could",
		"daily",
		"default",
		"deploy",
		"during",
		"every",
		"file",
		"files",
		"from",
		"have",
		"into",
		"just",
		"line",
		"lines",
		"long",
		"main",
		"make",
		"memory",
		"month",
		"more",
		"most",
		"move",
		"much",
		"next",
		"note",
		"notes",
		"over",
		"part",
		"past",
		"port",
		"same",
		"score",
		"search",
		"session",
		"sessions",
		"short",
		"should",
		"since",
		"some",
		"subagent",
		"system",
		"than",
		"that",
		"their",
		"there",
		"these",
		"they",
		"this",
		"through",
		"today",
		"user",
		"using",
		"with",
		"work",
		"workspace",
		"year"
	],
	english: [
		"and",
		"are",
		"for",
		"into",
		"its",
		"our",
		"the",
		"then",
		"were",
		"you",
		"your"
	],
	spanish: [
		"al",
		"con",
		"como",
		"de",
		"del",
		"el",
		"en",
		"es",
		"la",
		"las",
		"los",
		"para",
		"por",
		"que",
		"se",
		"sin",
		"su",
		"sus",
		"una",
		"uno",
		"unos",
		"unas",
		"y"
	],
	french: [
		"au",
		"aux",
		"avec",
		"dans",
		"de",
		"des",
		"du",
		"en",
		"est",
		"et",
		"la",
		"le",
		"les",
		"ou",
		"pour",
		"que",
		"qui",
		"sans",
		"ses",
		"son",
		"sur",
		"une",
		"un"
	],
	german: [
		"auf",
		"aus",
		"bei",
		"das",
		"dem",
		"den",
		"der",
		"des",
		"die",
		"ein",
		"eine",
		"einem",
		"einen",
		"einer",
		"für",
		"im",
		"in",
		"mit",
		"nach",
		"oder",
		"ohne",
		"über",
		"und",
		"von",
		"zu",
		"zum",
		"zur"
	],
	cjk: [
		"が",
		"から",
		"する",
		"して",
		"した",
		"で",
		"と",
		"に",
		"の",
		"は",
		"へ",
		"まで",
		"も",
		"や",
		"を",
		"与",
		"为",
		"了",
		"及",
		"和",
		"在",
		"将",
		"或",
		"把",
		"是",
		"用",
		"的",
		"과",
		"는",
		"도",
		"로",
		"를",
		"에",
		"에서",
		"와",
		"은",
		"으로",
		"을",
		"이",
		"하다",
		"한",
		"할",
		"해",
		"했다"
	],
	pathNoise: [
		"cjs",
		"cpp",
		"cts",
		"jsx",
		"json",
		"md",
		"mjs",
		"mts",
		"text",
		"toml",
		"ts",
		"tsx",
		"txt",
		"yaml",
		"yml"
	]
}).flat().map((word) => normalizeLowercaseStringOrEmpty(word)));
const PROTECTED_GLOSSARY = [
	"backup",
	"backups",
	"embedding",
	"embeddings",
	"failover",
	"gateway",
	"glacier",
	"gpt",
	"kv",
	"network",
	"openai",
	"router",
	"s3",
	"vlan",
	"sauvegarde",
	"routeur",
	"passerelle",
	"konfiguration",
	"sicherung",
	"überwachung",
	"configuración",
	"respaldo",
	"enrutador",
	"puerta-de-enlace",
	"バックアップ",
	"フェイルオーバー",
	"ルーター",
	"ネットワーク",
	"ゲートウェイ",
	"障害対応",
	"路由器",
	"备份",
	"故障转移",
	"网络",
	"网关",
	"라우터",
	"백업",
	"페일오버",
	"네트워크",
	"게이트웨이",
	"장애대응"
].map((word) => normalizeLowercaseStringOrEmpty(word.normalize("NFKC")));
const COMPOUND_TOKEN_RE = /[\p{L}\p{N}]+(?:[._/-][\p{L}\p{N}]+)+/gu;
const LETTER_OR_NUMBER_RE = /[\p{L}\p{N}]/u;
const LATIN_RE = /\p{Script=Latin}/u;
const HAN_RE = /\p{Script=Han}/u;
const HIRAGANA_RE = /\p{Script=Hiragana}/u;
const KATAKANA_RE = /\p{Script=Katakana}/u;
const HANGUL_RE = /\p{Script=Hangul}/u;
const DEFAULT_WORD_SEGMENTER = typeof Intl.Segmenter === "function" ? new Intl.Segmenter("und", { granularity: "word" }) : null;
function classifyConceptTagScript(tag) {
	const normalized = tag.normalize("NFKC");
	const hasLatin = LATIN_RE.test(normalized);
	const hasCjk = HAN_RE.test(normalized) || HIRAGANA_RE.test(normalized) || KATAKANA_RE.test(normalized) || HANGUL_RE.test(normalized);
	if (hasLatin && hasCjk) return "mixed";
	if (hasCjk) return "cjk";
	if (hasLatin) return "latin";
	return "other";
}
function minimumTokenLengthForScript(script) {
	if (script === "cjk") return 2;
	return 3;
}
function isKanaOnlyToken(value) {
	return !HAN_RE.test(value) && !HANGUL_RE.test(value) && (HIRAGANA_RE.test(value) || KATAKANA_RE.test(value));
}
function normalizeConceptToken(rawToken) {
	const normalized = normalizeLowercaseStringOrEmpty(rawToken.normalize("NFKC").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").replaceAll("_", "-"));
	if (!normalized || !LETTER_OR_NUMBER_RE.test(normalized) || normalized.length > 32) return null;
	if (/^\p{N}+(?:[./-]\p{N}+)*$/u.test(normalized) || /^\d{4}-\d{2}-\d{2}\.[\p{L}\p{N}]+$/u.test(normalized)) return null;
	const script = classifyConceptTagScript(normalized);
	if (normalized.length < minimumTokenLengthForScript(script) && !PROTECTED_GLOSSARY.includes(normalized)) return null;
	if (isKanaOnlyToken(normalized) && normalized.length < 3) return null;
	if (CONCEPT_STOP_WORDS.has(normalized)) return null;
	return normalized;
}
const GLOSSARY_ENTRIES = PROTECTED_GLOSSARY.map((entry) => ({
	entry,
	wholeWord: entry.length < minimumTokenLengthForScript(classifyConceptTagScript(entry)) ? new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(entry)}(?![\\p{L}\\p{N}])`, "u") : void 0
}));
function collectGlossaryMatches(source) {
	const normalizedSource = normalizeLowercaseStringOrEmpty(source.normalize("NFKC"));
	const matches = [];
	for (const { entry, wholeWord } of GLOSSARY_ENTRIES) if (wholeWord ? wholeWord.test(normalizedSource) : normalizedSource.includes(entry)) matches.push(entry);
	return matches;
}
function collectCompoundTokens(source) {
	return source.match(COMPOUND_TOKEN_RE) ?? [];
}
function collectSegmentTokens(source) {
	if (DEFAULT_WORD_SEGMENTER) return Array.from(DEFAULT_WORD_SEGMENTER.segment(source), (part) => part.isWordLike ? part.segment : "").filter(Boolean);
	return source.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}
function deriveConceptTags(params) {
	const visibleSnippet = params.snippet.replace(/<!--[\s\S]*?-->/gu, " ");
	const source = `${path.basename(params.path)} ${visibleSnippet}`;
	const limit = Number.isFinite(params.limit) ? Math.max(0, Math.floor(params.limit)) : 8;
	if (limit === 0) return [];
	const tags = [];
	const tokenSources = [
		collectGlossaryMatches(source),
		collectCompoundTokens(source),
		collectSegmentTokens(source)
	];
	for (const tokens of tokenSources) for (const rawToken of tokens) {
		const normalized = normalizeConceptToken(rawToken);
		if (!normalized || tags.includes(normalized)) continue;
		tags.push(normalized);
		if (tags.length >= limit) return tags;
	}
	return tags;
}
function summarizeConceptTagScriptCoverage(conceptTagsByEntry) {
	const coverage = {
		latinEntryCount: 0,
		cjkEntryCount: 0,
		mixedEntryCount: 0,
		otherEntryCount: 0
	};
	for (const conceptTags of conceptTagsByEntry) {
		let hasLatin = false;
		let hasCjk = false;
		let hasOther = false;
		for (const tag of conceptTags) {
			const family = classifyConceptTagScript(tag);
			if (family === "mixed") {
				hasLatin = true;
				hasCjk = true;
				continue;
			}
			if (family === "latin") {
				hasLatin = true;
				continue;
			}
			if (family === "cjk") {
				hasCjk = true;
				continue;
			}
			hasOther = true;
		}
		if (hasLatin && hasCjk) coverage.mixedEntryCount += 1;
		else if (hasCjk) coverage.cjkEntryCount += 1;
		else if (hasLatin) coverage.latinEntryCount += 1;
		else if (hasOther) coverage.otherEntryCount += 1;
	}
	return coverage;
}
//#endregion
//#region extensions/memory-core/src/short-term-promotion-utils.ts
const SHORT_TERM_PATH_RE = /(?:^|\/)memory\/(?:[^/]+\/)*(\d{4})-(\d{2})-(\d{2})(?:-[^/]+)?\.md$/;
const DREAMING_MEMORY_PATH_RE = /(?:^|\/)memory\/dreaming\//;
const SHORT_TERM_SESSION_CORPUS_RE = /(?:^|\/)memory\/\.dreams\/session-corpus\/(\d{4})-(\d{2})-(\d{2})\.(?:md|txt)$/;
const SHORT_TERM_BASENAME_RE = /^(\d{4})-(\d{2})-(\d{2})(?:-[^/]+)?\.md$/;
const SHORT_TERM_RECALL_MAX_SNIPPET_CHARS = 800;
const DREAMING_TRANSCRIPT_PROMPT_LINE_RE = /\[[^\]]*dreaming-narrative[^\]]*]\s*(?:User|Assistant):\s*Write a dream diary entry from these memory fragments:?/i;
const RAW_SESSION_METADATA_RE = /\bSession Key\b.{0,260}\bSession ID\b|\bSession ID\b.{0,260}\bSession Key\b/i;
const RAW_CONVERSATION_SUMMARY_RE = /^(?:[-*+]\s*)?Conversation Summary:/i;
const RAW_TRANSCRIPT_TURN_RE = /^(?:[-*+]\s*)?(?:user|assistant):\s/i;
const MEMORY_FLUSH_PROMPT_RE = /Save important context from this session to the daily memory file\.\s*STRICT RULES:/i;
const PROMOTION_SCORE_METADATA_RE = /\[\s*score=\d+(?:\.\d+)?\s+(?:signals=\d+\s+)?recalls=\d+\s+avg=\d+(?:\.\d+)?\s+source=memory\//i;
const DREAMING_DIFF_PREFIX_RE = /@@\s*-\d+(?:,\d+)?\s+[-*+]\s+/iy;
const DEFAULT_PROMOTION_WEIGHTS = {
	frequency: .24,
	relevance: .3,
	diversity: .15,
	recency: .15,
	consolidation: .1,
	conceptual: .06
};
function clampScore(value) {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(1, value));
}
function toFiniteScore(value, fallback) {
	const num = Number(value);
	if (!Number.isFinite(num)) return fallback;
	if (num < 0 || num > 1) return fallback;
	return num;
}
function normalizeSnippet(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	return trimmed.replace(/\s+/g, " ");
}
function normalizeProjectKeyList(value) {
	if (typeof value !== "string") return;
	const keys = /* @__PURE__ */ new Set();
	for (const rawKey of value.split(";")) {
		const trimmed = rawKey.trim();
		if (!trimmed || /[\r\n<>]/u.test(trimmed)) continue;
		if (trimmed.startsWith("path:")) {
			keys.add(trimmed);
			continue;
		}
		const separator = trimmed.indexOf("/");
		if (separator < 1) {
			keys.add(trimmed);
			continue;
		}
		keys.add(`${trimmed.slice(0, separator).toLowerCase()}${trimmed.slice(separator)}`);
	}
	return keys.size > 0 ? [...keys].join("; ") : void 0;
}
function mergeProjectKeyLists(...values) {
	return normalizeProjectKeyList(values.flatMap((value) => normalizeProjectKeyList(value)?.split(";") ?? []).join(";"));
}
function truncateShortTermSnippet(snippet) {
	if (snippet.length <= SHORT_TERM_RECALL_MAX_SNIPPET_CHARS) return snippet;
	return truncateUtf16Safe(snippet, SHORT_TERM_RECALL_MAX_SNIPPET_CHARS).trimEnd();
}
function enforceShortTermRecallSnippetCap(store) {
	for (const entry of Object.values(store.entries)) entry.snippet = truncateShortTermSnippet(entry.snippet);
}
function consumeDreamingLeadPrefix(snippet) {
	let index = 0;
	while (index < snippet.length) {
		DREAMING_DIFF_PREFIX_RE.lastIndex = index;
		if (DREAMING_DIFF_PREFIX_RE.exec(snippet)) {
			index = DREAMING_DIFF_PREFIX_RE.lastIndex;
			continue;
		}
		const char = snippet[index];
		if (char === "[" || char === "(") {
			index += 1;
			while (snippet[index] === " ") index += 1;
			continue;
		}
		if ((char === "-" || char === "*" || char === "+" || char === ">") && snippet[index + 1] === " ") {
			index += 2;
			continue;
		}
		break;
	}
	return snippet.slice(index);
}
function hasDreamingNarrativeLead(snippet) {
	const withoutPrefix = consumeDreamingLeadPrefix(snippet);
	if (/^(?:Candidate|Reflections?):/i.test(withoutPrefix)) return true;
	const head = truncateUtf16Safe(withoutPrefix, 200);
	return /\b(?:Candidate|Reflections?):/i.test(head);
}
function isContaminatedDreamingSnippet(raw, opts = {}) {
	const snippet = normalizeSnippet(raw);
	if (!snippet) return false;
	if (/<!--\s*openclaw-memory-promotion:/i.test(snippet) || DREAMING_TRANSCRIPT_PROMPT_LINE_RE.test(snippet) || RAW_SESSION_METADATA_RE.test(snippet) || RAW_CONVERSATION_SUMMARY_RE.test(snippet) || !opts.allowTranscriptTurnSnippet && RAW_TRANSCRIPT_TURN_RE.test(snippet) || MEMORY_FLUSH_PROMPT_RE.test(snippet) || PROMOTION_SCORE_METADATA_RE.test(snippet)) return true;
	const hasNarrativeLead = hasDreamingNarrativeLead(snippet);
	const hasConfidence = /\bconfidence:\s*\d/i.test(snippet);
	const hasEvidence = /\bevidence:\s*(?:memory\/\.dreams\/session-corpus\/|memory\/)/i.test(snippet);
	const hasStatus = /\bstatus:\s*staged\b/i.test(snippet);
	const hasRecalls = /\brecalls:\s*\d+\b/i.test(snippet);
	return hasNarrativeLead && hasConfidence && hasEvidence && hasStatus && hasRecalls;
}
function normalizeMemoryPath(rawPath) {
	return rawPath.replaceAll("\\", "/").replace(/^\.\//, "");
}
function buildClaimHash(snippet) {
	return createHash("sha1").update(normalizeSnippet(snippet)).digest("hex").slice(0, 12);
}
function buildDailyClaimEntryKey(claimHash) {
	return `memory:claim:${claimHash}`;
}
function buildEntryKey(result) {
	const base = `${result.source}:${normalizeMemoryPath(result.path)}:${result.startLine}:${result.endLine}`;
	return result.claimHash ? `${base}:${result.claimHash}` : base;
}
function hashQuery(query) {
	return createHash("sha1").update(normalizeLowercaseStringOrEmpty(query)).digest("hex").slice(0, 12);
}
function mergeQueryHashes(existing, queryHash) {
	if (!queryHash) return existing;
	const seen = /* @__PURE__ */ new Set();
	const next = existing.filter((value) => {
		if (!value || seen.has(value)) return false;
		seen.add(value);
		return true;
	});
	if (!seen.has(queryHash)) next.push(queryHash);
	if (next.length <= 32) return next;
	return next.slice(next.length - 32);
}
function mergeRecentDistinct(existing, nextValue, limit) {
	const seen = /* @__PURE__ */ new Set();
	const next = existing.filter((value) => {
		if (typeof value !== "string" || value.length === 0 || seen.has(value)) return false;
		seen.add(value);
		return true;
	});
	if (nextValue && !next.includes(nextValue)) next.push(nextValue);
	if (next.length <= limit) return next;
	return next.slice(next.length - limit);
}
function normalizeIsoDay(isoLike) {
	if (typeof isoLike !== "string") return null;
	return isoLike.trim().match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
}
function normalizeDistinctStrings(values, limit) {
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const value of values) {
		if (typeof value !== "string") continue;
		const trimmed = value.trim();
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		normalized.push(trimmed);
		if (normalized.length >= limit) break;
	}
	return normalized;
}
function totalSignalCountForEntry(entry) {
	return Math.max(0, Math.floor(entry.recallCount ?? 0)) + Math.max(0, Math.floor(entry.dailyCount ?? 0)) + Math.max(0, Math.floor(entry.groundedCount ?? 0));
}
function emptyStore(nowIso) {
	return {
		version: 1,
		updatedAt: nowIso,
		entries: {}
	};
}
function normalizeShortTermRecallStore(raw, nowIso) {
	if (!raw || typeof raw !== "object") return emptyStore(nowIso);
	const record = raw;
	const entriesRaw = record.entries;
	const entries = {};
	if (entriesRaw && typeof entriesRaw === "object") for (const [key, value] of Object.entries(entriesRaw)) {
		if (!value || typeof value !== "object") continue;
		const entry = value;
		const entryPath = typeof entry.path === "string" ? normalizeMemoryPath(entry.path) : "";
		const startLine = Number(entry.startLine);
		const endLine = Number(entry.endLine);
		const source = entry.source === "memory" ? "memory" : null;
		if (!entryPath || !Number.isInteger(startLine) || !Number.isInteger(endLine) || !source) continue;
		const recallCount = Math.max(0, Math.floor(Number(entry.recallCount) || 0));
		const dailyCount = Math.max(0, Math.floor(Number(entry.dailyCount) || 0));
		const groundedCount = Math.max(0, Math.floor(Number(entry.groundedCount) || 0));
		const totalScore = Math.max(0, Number(entry.totalScore) || 0);
		const maxScore = clampScore(Number(entry.maxScore) || 0);
		const firstRecalledAt = typeof entry.firstRecalledAt === "string" ? entry.firstRecalledAt : nowIso;
		const lastRecalledAt = typeof entry.lastRecalledAt === "string" ? entry.lastRecalledAt : nowIso;
		const promotedAt = typeof entry.promotedAt === "string" ? entry.promotedAt : void 0;
		const claimHash = typeof entry.claimHash === "string" && entry.claimHash.trim().length > 0 ? entry.claimHash.trim() : void 0;
		const projectKey = normalizeProjectKeyList(entry.projectKey);
		const fullSnippet = typeof entry.snippet === "string" ? normalizeSnippet(entry.snippet) : "";
		if (fullSnippet && isContaminatedDreamingSnippet(fullSnippet, { allowTranscriptTurnSnippet: isShortTermSessionCorpusPath(entryPath) })) continue;
		const snippet = truncateShortTermSnippet(fullSnippet);
		const queryHashes = Array.isArray(entry.queryHashes) ? normalizeDistinctStrings(entry.queryHashes, 32) : [];
		const recallDays = Array.isArray(entry.recallDays) ? entry.recallDays.map((recallDay) => typeof recallDay === "string" ? normalizeIsoDay(recallDay) : null).filter((valueLocal) => valueLocal !== null) : [];
		const conceptTags = Array.isArray(entry.conceptTags) ? normalizeDistinctStrings(entry.conceptTags.map((tag) => typeof tag === "string" ? normalizeLowercaseStringOrEmpty(tag) : tag), 8) : deriveConceptTags({
			path: entryPath,
			snippet: fullSnippet
		});
		const provenanceRaw = entry.provenance && typeof entry.provenance === "object" ? entry.provenance : void 0;
		const lastObservedAt = Date.parse(lastRecalledAt);
		const fallbackObservedAt = Number.isFinite(lastObservedAt) ? lastObservedAt : Date.parse(nowIso);
		const provenance = provenanceRaw ? {
			originClass: provenanceRaw.originClass === "owner" || provenanceRaw.originClass === "agent" || provenanceRaw.originClass === "system" || provenanceRaw.originClass === "untrusted" ? provenanceRaw.originClass : "untrusted",
			sessionKind: provenanceRaw.sessionKind === "interactive" || provenanceRaw.sessionKind === "cron" || provenanceRaw.sessionKind === "heartbeat" || provenanceRaw.sessionKind === "subagent" || provenanceRaw.sessionKind === "unknown" ? provenanceRaw.sessionKind : "unknown",
			observedAt: typeof provenanceRaw.observedAt === "number" && Number.isFinite(provenanceRaw.observedAt) ? provenanceRaw.observedAt : fallbackObservedAt,
			...typeof provenanceRaw.supersedesKey === "string" && provenanceRaw.supersedesKey.trim() ? { supersedesKey: provenanceRaw.supersedesKey.trim() } : {}
		} : void 0;
		const normalizedKey = key || buildEntryKey({
			path: entryPath,
			startLine,
			endLine,
			source,
			claimHash
		});
		entries[normalizedKey] = {
			key: normalizedKey,
			path: entryPath,
			startLine,
			endLine,
			source,
			snippet,
			recallCount,
			dailyCount,
			groundedCount,
			totalScore,
			maxScore,
			firstRecalledAt,
			lastRecalledAt,
			queryHashes,
			recallDays: recallDays.slice(-16),
			conceptTags,
			...provenance ? { provenance } : {},
			...claimHash ? { claimHash } : {},
			...projectKey ? { projectKey } : {},
			...promotedAt ? { promotedAt } : {}
		};
	}
	return {
		version: 1,
		updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : nowIso,
		entries
	};
}
function parseStoreTimestampMs(value) {
	return parseDateStringTimestampMs(value) ?? Number.NEGATIVE_INFINITY;
}
function compareStoreTimestampDesc(left, right) {
	const leftMs = parseStoreTimestampMs(left);
	const rightMs = parseStoreTimestampMs(right);
	if (leftMs === rightMs) return 0;
	return rightMs > leftMs ? 1 : -1;
}
function compareShortTermRecallRetention(a, b) {
	const lastDiff = compareStoreTimestampDesc(a.lastRecalledAt, b.lastRecalledAt);
	if (lastDiff !== 0) return lastDiff;
	const signalDiff = totalSignalCountForEntry(b) - totalSignalCountForEntry(a);
	if (signalDiff !== 0) return signalDiff;
	const totalScoreDiff = b.totalScore - a.totalScore;
	if (totalScoreDiff !== 0) return totalScoreDiff;
	const maxScoreDiff = b.maxScore - a.maxScore;
	if (maxScoreDiff !== 0) return maxScoreDiff;
	const promotedDiff = compareStoreTimestampDesc(a.promotedAt, b.promotedAt);
	if (promotedDiff !== 0) return promotedDiff;
	return a.key.localeCompare(b.key);
}
function enforceShortTermRecallStoreRetention(store) {
	const entries = Object.entries(store.entries);
	if (entries.length <= 512) return 0;
	const retained = entries.toSorted(([, a], [, b]) => compareShortTermRecallRetention(a, b)).slice(0, 512);
	store.entries = Object.fromEntries(retained.toSorted(([a], [b]) => a.localeCompare(b)));
	return entries.length - retained.length;
}
function toFinitePositive(value, fallback) {
	const num = Number(value);
	if (!Number.isFinite(num) || num <= 0) return fallback;
	return num;
}
function toFiniteNonNegativeInt(value, fallback) {
	const num = Number(value);
	if (!Number.isFinite(num)) return fallback;
	const floored = Math.floor(num);
	if (floored < 0) return fallback;
	return floored;
}
function normalizeWeights(weights) {
	const merged = {
		...DEFAULT_PROMOTION_WEIGHTS,
		...weights
	};
	const frequency = Math.max(0, merged.frequency);
	const relevance = Math.max(0, merged.relevance);
	const diversity = Math.max(0, merged.diversity);
	const recency = Math.max(0, merged.recency);
	const consolidation = Math.max(0, merged.consolidation);
	const conceptual = Math.max(0, merged.conceptual);
	const sum = frequency + relevance + diversity + recency + consolidation + conceptual;
	if (sum <= 0) return { ...DEFAULT_PROMOTION_WEIGHTS };
	return {
		frequency: frequency / sum,
		relevance: relevance / sum,
		diversity: diversity / sum,
		recency: recency / sum,
		consolidation: consolidation / sum,
		conceptual: conceptual / sum
	};
}
function calculateRecencyComponent(ageDays, halfLifeDays) {
	if (!Number.isFinite(ageDays) || ageDays < 0) return 1;
	if (!Number.isFinite(halfLifeDays) || halfLifeDays <= 0) return 1;
	const lambda = Math.LN2 / halfLifeDays;
	return Math.exp(-lambda * ageDays);
}
function isShortTermMemoryPath(filePath) {
	const normalized = normalizeMemoryPath(filePath);
	if (DREAMING_MEMORY_PATH_RE.test(normalized)) return false;
	if (SHORT_TERM_PATH_RE.test(normalized)) return true;
	if (SHORT_TERM_SESSION_CORPUS_RE.test(normalized)) return true;
	return SHORT_TERM_BASENAME_RE.test(normalized);
}
function isShortTermSessionCorpusPath(filePath) {
	return SHORT_TERM_SESSION_CORPUS_RE.test(normalizeMemoryPath(filePath));
}
function normalizeMemoryPathForWorkspace(workspaceDir, rawPath) {
	const normalized = normalizeMemoryPath(rawPath);
	const workspaceNormalized = normalizeMemoryPath(workspaceDir);
	if (path.isAbsolute(rawPath) && normalized.startsWith(`${workspaceNormalized}/`)) return normalized.slice(workspaceNormalized.length + 1);
	return normalized;
}
function toNonNegativeInt(value) {
	const num = Number(value);
	if (!Number.isFinite(num)) return 0;
	return Math.max(0, Math.floor(num));
}
function parseEntryRangeFromKey(key, fallbackStartLine, fallbackEndLine) {
	const startLine = toNonNegativeInt(fallbackStartLine);
	const endLine = toNonNegativeInt(fallbackEndLine);
	if (startLine > 0 && endLine > 0) return {
		startLine,
		endLine
	};
	const match = key.match(/:(\d+):(\d+)$/);
	if (match) return {
		startLine: Math.max(1, toNonNegativeInt(match[1])),
		endLine: Math.max(1, toNonNegativeInt(match[2]))
	};
	return {
		startLine: 1,
		endLine: 1
	};
}
//#endregion
//#region extensions/memory-core/src/short-term-promotion-store.ts
function resolveStorePath(workspaceDir) {
	return memoryCoreStateReference(SHORT_TERM_RECALL_NAMESPACE, workspaceDir);
}
function resolvePhaseSignalPath(workspaceDir) {
	return memoryCoreStateReference(SHORT_TERM_PHASE_SIGNAL_NAMESPACE, workspaceDir);
}
async function readStore(workspaceDir, nowIso) {
	const [entryRows, metaRows] = await Promise.all([readMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_RECALL_NAMESPACE,
		workspaceDir
	}), readMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir
	})]);
	const meta = metaRows.find((entry) => entry.key === "recall")?.value;
	const store = normalizeShortTermRecallStore({
		version: 1,
		updatedAt: meta?.updatedAt ?? nowIso,
		entries: Object.fromEntries(entryRows.map((entry) => [entry.key, entry.value]))
	}, nowIso);
	enforceShortTermRecallStoreRetention(store);
	return store;
}
function emptyPhaseSignalStore(nowIso) {
	return {
		version: 1,
		updatedAt: nowIso,
		entries: {}
	};
}
function normalizeShortTermPhaseSignalStore(raw, nowIso) {
	const record = asNullableRecord(raw);
	if (!record) return emptyPhaseSignalStore(nowIso);
	const entriesRaw = asNullableRecord(record?.entries);
	if (!entriesRaw) return emptyPhaseSignalStore(nowIso);
	const entries = {};
	for (const [mapKey, value] of Object.entries(entriesRaw)) {
		const entry = asNullableRecord(value);
		if (!entry) continue;
		const key = typeof entry.key === "string" && entry.key.trim().length > 0 ? entry.key : mapKey;
		const lightHits = toFiniteNonNegativeInt(entry.lightHits, 0);
		const remHits = toFiniteNonNegativeInt(entry.remHits, 0);
		if (lightHits === 0 && remHits === 0) continue;
		const lastLightAt = typeof entry.lastLightAt === "string" && entry.lastLightAt.trim().length > 0 ? entry.lastLightAt : void 0;
		const lastRemAt = typeof entry.lastRemAt === "string" && entry.lastRemAt.trim().length > 0 ? entry.lastRemAt : void 0;
		const lastRemConsideredAt = typeof entry.lastRemConsideredAt === "string" && entry.lastRemConsideredAt.trim().length > 0 ? entry.lastRemConsideredAt : void 0;
		entries[key] = {
			key,
			lightHits,
			remHits,
			...lastLightAt ? { lastLightAt } : {},
			...lastRemAt ? { lastRemAt } : {},
			...lastRemConsideredAt ? { lastRemConsideredAt } : {}
		};
	}
	return {
		version: 1,
		updatedAt: typeof record.updatedAt === "string" && record.updatedAt.trim().length > 0 ? record.updatedAt : nowIso,
		entries
	};
}
async function readPhaseSignalStore(workspaceDir, nowIso) {
	const [entryRows, metaRows] = await Promise.all([readMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
		workspaceDir
	}), readMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir
	})]);
	const meta = metaRows.find((entry) => entry.key === "phase")?.value;
	return normalizeShortTermPhaseSignalStore({
		version: 1,
		updatedAt: meta?.updatedAt ?? nowIso,
		entries: Object.fromEntries(entryRows.map((entry) => [entry.key, entry.value]))
	}, nowIso);
}
async function writePhaseSignalStore(workspaceDir, store) {
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
		workspaceDir,
		entries: Object.entries(store.entries).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntry({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir,
		key: "phase",
		value: { updatedAt: store.updatedAt }
	})]);
}
async function writeStore(workspaceDir, store) {
	enforceShortTermRecallSnippetCap(store);
	enforceShortTermRecallStoreRetention(store);
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_RECALL_NAMESPACE,
		workspaceDir,
		entries: Object.entries(store.entries).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntry({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir,
		key: "recall",
		value: { updatedAt: store.updatedAt }
	})]);
}
//#endregion
export { parseEntryRangeFromKey as A, summarizeConceptTagScriptCoverage as B, mergeRecentDistinct as C, normalizeShortTermRecallStore as D, normalizeMemoryPathForWorkspace as E, toNonNegativeInt as F, totalSignalCountForEntry as I, truncateShortTermSnippet as L, toFiniteNonNegativeInt as M, toFinitePositive as N, normalizeSnippet as O, toFiniteScore as P, deriveConceptTags as R, mergeQueryHashes as S, normalizeMemoryPath as T, hashQuery as _, resolvePhaseSignalPath as a, isShortTermSessionCorpusPath as b, writeStore as c, buildDailyClaimEntryKey as d, buildEntryKey as f, enforceShortTermRecallStoreRetention as g, compareStoreTimestampDesc as h, readStore as i, parseStoreTimestampMs as j, normalizeWeights as k, SHORT_TERM_BASENAME_RE as l, clampScore as m, normalizeShortTermPhaseSignalStore as n, resolveStorePath as o, calculateRecencyComponent as p, readPhaseSignalStore as r, writePhaseSignalStore as s, emptyPhaseSignalStore as t, buildClaimHash as u, isContaminatedDreamingSnippet as v, normalizeIsoDay as w, mergeProjectKeyLists as x, isShortTermMemoryPath as y, normalizeConceptToken as z };
