import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { _ as requestClawHub, a as fetchClawHubJson, d as readClawHubStringArrayField, f as readClawHubStringField, g as readRequiredClawHubStringField, i as decodeClawHubResponseBody, l as readClawHubBooleanField, m as readRequiredClawHubNumberField, p as readRequiredClawHubBooleanField, r as createClawHubError, t as CLAWHUB_JSON_MAX_BYTES, u as readClawHubBytes } from "./clawhub-client-4V78ChLt.js";
import { t as hasValidIsoCalendarComponents } from "./iso-time-Bkhu9DzU.js";
//#region src/infra/clawhub-promotions.ts
const CLAWHUB_PROMOTION_MODEL_REF_RE = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/;
function parseClawHubPromotionModel(value, context) {
	if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected each model to be an object.`);
	const modelRef = readRequiredClawHubStringField(value, "modelRef", context);
	if (!CLAWHUB_PROMOTION_MODEL_REF_RE.test(modelRef)) throw new Error(`Malformed ClawHub ${context}: modelRef contains unsupported characters.`);
	const model = { modelRef };
	const alias = readClawHubStringField(value, "alias", context);
	if (alias) model.alias = alias;
	const suggestedDefault = readClawHubBooleanField(value, "suggestedDefault", context);
	if (suggestedDefault !== void 0) model.suggestedDefault = suggestedDefault;
	return model;
}
const CLAWHUB_PROMOTION_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const CLAWHUB_PROMOTION_IDENTIFIER_RE = /^[A-Za-z0-9][A-Za-z0-9._@/-]*$/;
function parseClawHubPromotionCore(value, context) {
	const modelsRaw = value.models;
	if (!Array.isArray(modelsRaw) || modelsRaw.length === 0) throw new Error(`Malformed ClawHub ${context}: expected models to be a non-empty array.`);
	const slug = readRequiredClawHubStringField(value, "slug", context);
	if (!CLAWHUB_PROMOTION_SLUG_RE.test(slug)) throw new Error(`Malformed ClawHub ${context}: slug must be lowercase [a-z0-9-].`);
	const startsAt = readRequiredClawHubNumberField(value, "startsAt", context);
	const endsAt = readRequiredClawHubNumberField(value, "endsAt", context);
	if (endsAt <= startsAt) throw new Error(`Malformed ClawHub ${context}: promotion window must end after it starts.`);
	const promotion = {
		slug,
		title: readRequiredClawHubStringField(value, "title", context),
		blurb: readRequiredClawHubStringField(value, "blurb", context),
		startsAt,
		endsAt,
		models: modelsRaw.map((entry) => parseClawHubPromotionModel(entry, context))
	};
	for (const field of [
		"sponsor",
		"signupUrl",
		"docsUrl",
		"launchPageUrl"
	]) {
		const parsed = readClawHubStringField(value, field, context);
		if (parsed) promotion[field] = parsed;
	}
	for (const field of ["provider", "authChoiceId"]) {
		const parsed = readClawHubStringField(value, field, context);
		if (!parsed) continue;
		if (!CLAWHUB_PROMOTION_IDENTIFIER_RE.test(parsed)) throw new Error(`Malformed ClawHub ${context}: ${field} contains unsupported characters.`);
		promotion[field] = parsed;
	}
	const pluginNames = readClawHubStringArrayField(value, "pluginNames", context);
	if (pluginNames && pluginNames.length > 0) {
		for (const name of pluginNames) {
			const parsed = parseRegistryNpmSpec(name);
			if (!parsed || parsed.selectorKind !== "none" || parsed.name !== name) throw new Error(`Malformed ClawHub ${context}: pluginNames must contain npm package names.`);
		}
		promotion.pluginNames = pluginNames;
	}
	return promotion;
}
function parseClawHubPromotion(value) {
	const context = "promotion";
	if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected an object.`);
	return {
		...parseClawHubPromotionCore(value, context),
		status: readRequiredClawHubStringField(value, "status", context),
		active: readRequiredClawHubBooleanField(value, "active", context)
	};
}
async function fetchClawHubPromotions(params = {}) {
	const response = await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/promotions",
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
	if (!isRecord(response) || !Array.isArray(response.promotions)) throw new Error("Malformed ClawHub promotions response: expected a promotions array.");
	return response.promotions.map((entry) => parseClawHubPromotion(entry));
}
async function fetchClawHubPromotion(params) {
	return parseClawHubPromotion(await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/promotions/${encodeURIComponent(params.slug)}`,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	}));
}
const CLAWHUB_PROMOTIONS_FEED_ID = "clawhub-promotions";
const CLAWHUB_PROMOTIONS_FEED_SCHEMA_VERSION = 1;
function parseClawHubPromotionsFeed(value) {
	const context = "promotions feed";
	if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected an object.`);
	const id = readRequiredClawHubStringField(value, "id", context);
	if (id !== CLAWHUB_PROMOTIONS_FEED_ID) throw new Error(`Malformed ClawHub ${context}: unexpected feed id.`);
	const schemaVersion = readRequiredClawHubNumberField(value, "schemaVersion", context);
	if (schemaVersion !== CLAWHUB_PROMOTIONS_FEED_SCHEMA_VERSION) throw new Error(`Unsupported ClawHub ${context} schema version ${schemaVersion}.`);
	const sequence = readRequiredClawHubNumberField(value, "sequence", context);
	if (!Number.isSafeInteger(sequence) || sequence < 0) throw new Error(`Malformed ClawHub ${context}: sequence must be a non-negative integer.`);
	const generatedAt = readRequiredClawHubStringField(value, "generatedAt", context);
	const expiresAt = readRequiredClawHubStringField(value, "expiresAt", context);
	const generatedAtMs = Date.parse(generatedAt);
	const expiresAtMs = Date.parse(expiresAt);
	if (!Number.isFinite(generatedAtMs) || !Number.isFinite(expiresAtMs) || !hasValidIsoCalendarComponents(generatedAt) || !hasValidIsoCalendarComponents(expiresAt)) throw new Error(`Malformed ClawHub ${context}: timestamps must be ISO dates.`);
	if (expiresAtMs <= generatedAtMs) throw new Error(`Malformed ClawHub ${context}: expiresAt must be after generatedAt.`);
	const entriesRaw = value.entries;
	if (!Array.isArray(entriesRaw)) throw new Error(`Malformed ClawHub ${context}: expected an entries array.`);
	return {
		schemaVersion,
		id,
		generatedAt,
		sequence,
		expiresAt,
		entries: entriesRaw.map((entry) => {
			if (!isRecord(entry)) throw new Error(`Malformed ClawHub ${context}: expected each entry to be an object.`);
			if (readRequiredClawHubStringField(entry, "type", context) !== "promotion") throw new Error(`Malformed ClawHub ${context}: unexpected entry type.`);
			return parseClawHubPromotionCore(entry, context);
		})
	};
}
async function fetchClawHubPromotionsFeed(params = {}) {
	const { response, url } = await requestClawHub({
		baseUrl: params.baseUrl,
		path: "/api/v1/feeds/promotions",
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		retryTransientReads: false,
		skipAuth: true,
		...params.etag ? { headers: { "If-None-Match": params.etag } } : {}
	});
	if (response.status === 304) return { status: "not-modified" };
	if (!response.ok) throw await createClawHubError(response, url, false, params.timeoutMs);
	const payload = decodeClawHubResponseBody(await readClawHubBytes({
		response,
		maxBytes: CLAWHUB_JSON_MAX_BYTES,
		timeoutMs: params.timeoutMs,
		resourceLabel: "promotions feed"
	}));
	let parsedJson;
	try {
		parsedJson = JSON.parse(payload);
	} catch (cause) {
		throw new Error(`ClawHub ${url.pathname} returned malformed JSON`, { cause });
	}
	const feed = parseClawHubPromotionsFeed(parsedJson);
	const etag = response.headers.get("etag") ?? void 0;
	return {
		status: "ok",
		feed,
		payload,
		...etag ? { etag } : {}
	};
}
//#endregion
//#region src/infra/promotions-feed.ts
const PROMOTIONS_FEED_STATE_KEY = "default";
const PROMOTIONS_FEED_CHECK_INTERVAL_MS = 1440 * 60 * 1e3;
const PROMOTIONS_FEED_FETCH_TIMEOUT_MS = 2500;
const EMPTY_STATE = {
	entries: [],
	notifiedSlugs: /* @__PURE__ */ new Set()
};
function parseSlugListJson(raw) {
	if (!raw) return /* @__PURE__ */ new Set();
	const parsed = JSON.parse(raw);
	if (!Array.isArray(parsed)) return /* @__PURE__ */ new Set();
	return new Set(parsed.filter((entry) => typeof entry === "string"));
}
function readPromotionsFeedStateWithMetadata() {
	try {
		const database = openOpenClawStateDatabase();
		const db = getNodeSqliteKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("clawhub_promotions_feed_state").select([
			"etag",
			"payload_json",
			"feed_sequence",
			"last_checked_at_ms",
			"notified_slugs_json"
		]).where("state_key", "=", PROMOTIONS_FEED_STATE_KEY));
		if (!row) return {
			state: {
				...EMPTY_STATE,
				notifiedSlugs: /* @__PURE__ */ new Set()
			},
			payloadInvalid: false
		};
		let entries = [];
		let expiresAtMs;
		let payloadInvalid = false;
		if (row.payload_json) try {
			const feed = parseClawHubPromotionsFeed(JSON.parse(row.payload_json));
			entries = feed.entries;
			expiresAtMs = Date.parse(feed.expiresAt);
		} catch {
			payloadInvalid = true;
		}
		return {
			state: {
				...!payloadInvalid && row.etag ? { etag: row.etag } : {},
				...!payloadInvalid && typeof row.feed_sequence === "number" ? { sequence: row.feed_sequence } : {},
				...!payloadInvalid && expiresAtMs !== void 0 ? { expiresAtMs } : {},
				entries,
				...typeof row.last_checked_at_ms === "number" ? { lastCheckedAtMs: row.last_checked_at_ms } : {},
				notifiedSlugs: parseSlugListJson(row.notified_slugs_json)
			},
			payloadInvalid
		};
	} catch {
		return {
			state: {
				...EMPTY_STATE,
				notifiedSlugs: /* @__PURE__ */ new Set()
			},
			payloadInvalid: false
		};
	}
}
function readPromotionsFeedState() {
	return readPromotionsFeedStateWithMetadata().state;
}
function writePromotionsFeedState(params) {
	runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("clawhub_promotions_feed_state").select([
			"etag",
			"payload_json",
			"feed_sequence",
			"last_checked_at_ms",
			"notified_slugs_json"
		]).where("state_key", "=", PROMOTIONS_FEED_STATE_KEY));
		const next = {
			etag: params.etag === void 0 ? existing?.etag ?? null : params.etag,
			payload_json: params.payloadJson === void 0 ? existing?.payload_json ?? null : params.payloadJson,
			feed_sequence: params.sequence === void 0 ? existing?.feed_sequence ?? null : params.sequence,
			last_checked_at_ms: params.lastCheckedAtMs ?? existing?.last_checked_at_ms ?? null,
			notified_slugs_json: params.notifiedSlugs ? JSON.stringify([...params.notifiedSlugs].toSorted()) : existing?.notified_slugs_json ?? "[]",
			updated_at_ms: Date.now()
		};
		executeSqliteQuerySync(database.db, db.insertInto("clawhub_promotions_feed_state").values({
			state_key: PROMOTIONS_FEED_STATE_KEY,
			...next
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet(next)));
	});
}
function markPromotionSlugsNotified(slugs) {
	try {
		const state = readPromotionsFeedState();
		const merged = new Set(state.notifiedSlugs);
		let changed = false;
		for (const slug of slugs) if (!merged.has(slug)) {
			merged.add(slug);
			changed = true;
		}
		if (changed) writePromotionsFeedState({ notifiedSlugs: merged });
	} catch {}
}
function isPromotionWindowLive(entry, nowMs) {
	return entry.startsAt <= nowMs && nowMs <= entry.endsAt;
}
function listLivePromotionEntries(state, nowMs) {
	if (state.expiresAtMs !== void 0 && nowMs >= state.expiresAtMs) return [];
	return state.entries.filter((entry) => isPromotionWindowLive(entry, nowMs));
}
/**
* Cadence-gated, fail-silent feed refresh. At most one conditional GET per
* check interval; offline or malformed responses leave the cached state
* untouched (aside from the attempt timestamp, so failures do not retry on
* every command). Returns the freshest available state.
*/
async function maybeRefreshPromotionsFeed(params = {}) {
	const { state, payloadInvalid } = readPromotionsFeedStateWithMetadata();
	const nowMs = params.nowMs ?? Date.now();
	const skipForTests = !params.fetchImpl && (process.env.VITEST !== void 0 || false);
	const checkedBeforeSnapshotExpired = state.expiresAtMs !== void 0 && state.lastCheckedAtMs !== void 0 && state.lastCheckedAtMs < state.expiresAtMs;
	const fresh = !payloadInvalid && state.lastCheckedAtMs !== void 0 && nowMs - state.lastCheckedAtMs < PROMOTIONS_FEED_CHECK_INTERVAL_MS && (!checkedBeforeSnapshotExpired || state.expiresAtMs === void 0 || nowMs < state.expiresAtMs);
	if (skipForTests || fresh && !params.force) return state;
	try {
		const result = await fetchClawHubPromotionsFeed({
			...state.etag ? { etag: state.etag } : {},
			...params.fetchImpl ? { fetchImpl: params.fetchImpl } : {},
			timeoutMs: params.timeoutMs ?? PROMOTIONS_FEED_FETCH_TIMEOUT_MS
		});
		if (result.status === "not-modified") {
			writePromotionsFeedState({ lastCheckedAtMs: nowMs });
			return {
				...state,
				lastCheckedAtMs: nowMs
			};
		}
		if (state.sequence !== void 0 && result.feed.sequence < state.sequence) {
			writePromotionsFeedState({ lastCheckedAtMs: nowMs });
			return {
				...state,
				lastCheckedAtMs: nowMs
			};
		}
		writePromotionsFeedState({
			etag: result.etag ?? null,
			sequence: result.feed.sequence,
			payloadJson: result.payload,
			lastCheckedAtMs: nowMs
		});
		return {
			...result.etag ? { etag: result.etag } : {},
			sequence: result.feed.sequence,
			expiresAtMs: Date.parse(result.feed.expiresAt),
			entries: result.feed.entries,
			lastCheckedAtMs: nowMs,
			notifiedSlugs: state.notifiedSlugs
		};
	} catch {
		try {
			writePromotionsFeedState({
				...payloadInvalid ? {
					etag: null,
					sequence: null,
					payloadJson: null
				} : {},
				lastCheckedAtMs: nowMs
			});
		} catch {}
		return {
			...state,
			lastCheckedAtMs: nowMs
		};
	}
}
function recordPromotionClaim(record) {
	try {
		runOpenClawStateWriteTransaction((database) => {
			const db = getNodeSqliteKysely(database.db);
			const values = {
				slug: record.slug,
				provider: record.provider ?? null,
				model_keys_json: JSON.stringify(record.modelKeys),
				ends_at_ms: record.endsAtMs,
				claimed_at_ms: record.claimedAtMs
			};
			executeSqliteQuerySync(database.db, db.insertInto("clawhub_promotion_claims").values(values).onConflict((conflict) => conflict.column("slug").doUpdateSet(values)));
		});
	} catch {}
}
function readPromotionClaims() {
	try {
		const database = openOpenClawStateDatabase();
		const db = getNodeSqliteKysely(database.db);
		const { rows } = executeSqliteQuerySync(database.db, db.selectFrom("clawhub_promotion_claims").select([
			"slug",
			"provider",
			"model_keys_json",
			"ends_at_ms",
			"claimed_at_ms"
		]));
		return rows.map((row) => {
			let modelKeys = [];
			try {
				const parsed = JSON.parse(row.model_keys_json);
				if (Array.isArray(parsed)) modelKeys = parsed.filter((entry) => typeof entry === "string");
			} catch {}
			const record = {
				slug: row.slug,
				modelKeys,
				endsAtMs: row.ends_at_ms,
				claimedAtMs: row.claimed_at_ms
			};
			if (row.provider) record.provider = row.provider;
			return record;
		});
	} catch {
		return [];
	}
}
//#endregion
export { recordPromotionClaim as a, readPromotionClaims as i, markPromotionSlugsNotified as n, fetchClawHubPromotion as o, maybeRefreshPromotionsFeed as r, fetchClawHubPromotions as s, listLivePromotionEntries as t };
