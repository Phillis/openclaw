import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import "./defaults-CdX9UGcX.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
import "./config-Dl8DJbzM.js";
import { n as info } from "./globals-CAwGc4B6.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { d as sessionDeliveryOrigin, n as deliveryContextFromSession } from "./delivery-context.shared-D-qPZITK.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-CoZdm5gl.js";
import { qt as listSessionEntriesReadOnly } from "./session-accessor-Bi6bzKQE.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DH7-Rfwr.js";
import { g as resolveFreshSessionTotalTokens, y as resolveSessionTotalTokens } from "./restart-recovery-state-BoowPFT5.js";
import { n as prepareCliProviderClassifier } from "./model-selection-cli-BKHYNvuu.js";
import "./model-selection-CMo6Emvk.js";
import { t as classifySessionKind } from "./classify-session-kind-C57o_c98.js";
import { i as readAcpSessionMetaBatch } from "./session-meta-CkBRKe6w.js";
import "./sessions-D-jhKYGW.js";
import { t as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-DZ816S3H.js";
import { t as resolveAgentRuntimeLabel } from "./agent-runtime-label-a-DYAMT0.js";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-Bwb6VI0I.js";
import { t as resolveSessionStoreTargetsOrExit } from "./session-store-targets-CytBdW8t.js";
import { a as toSessionDisplayRow, i as formatSessionModelCell, l as resolveSessionDisplayModelRef, n as formatSessionFlagsCell, r as formatSessionKeyCell, s as resolveSessionDisplayDefaults, t as formatSessionAgeCell } from "./sessions-table-Ca5tJXLI.js";
//#region src/commands/sessions.ts
/**
* Session listing command.
*
* It loads one or more agent session stores, enriches rows with model/runtime
* metadata, and emits JSON or fixed-width terminal tables.
*/
const AGENT_PAD = 10;
const KIND_PAD = 11;
const RUNTIME_PAD = 18;
const TOKENS_PAD = 20;
const DEFAULT_SESSIONS_LIMIT = 100;
const TOP_N_SELECTION_LIMIT = 200;
const contextLookupRuntimeLoader = createLazyImportLoader(() => import("./context-ovgM8-r4.js"));
const formatKTokens = (value) => `${(value / 1e3).toFixed(value >= 1e4 ? 0 : 1)}k`;
/** True ACP sessions use the child runtime's model, not the configured fallback. */
function applyAcpModelOverlayIfNeeded(modelRef, sessionKey, acpRuntime) {
	if (!acpRuntime || !isAcpSessionKey(sessionKey)) return modelRef;
	return {
		provider: "acpx",
		model: `${parseAgentSessionKey(sessionKey)?.agentId ?? "acp"}-acp`
	};
}
function compareSessionRowsByUpdatedAt(a, b) {
	return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
}
function selectNewestSessionRows(rows, limit) {
	if (limit === void 0) return rows.toSorted(compareSessionRowsByUpdatedAt);
	if (limit > TOP_N_SELECTION_LIMIT) return rows.toSorted(compareSessionRowsByUpdatedAt).slice(0, limit);
	const selected = [];
	for (const row of rows) {
		const insertAt = selected.findIndex((candidate) => compareSessionRowsByUpdatedAt(row, candidate) < 0);
		if (insertAt >= 0) {
			selected.splice(insertAt, 0, row);
			if (selected.length > limit) selected.pop();
		} else if (selected.length < limit) selected.push(row);
	}
	return selected;
}
function parseSessionsLimit(value) {
	if (value === void 0) return DEFAULT_SESSIONS_LIMIT;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.toLowerCase() === "all") return;
		if (!/^\d+$/.test(trimmed)) return null;
		return parseStrictPositiveInteger(trimmed) ?? null;
	}
	return Number.isInteger(value) && value > 0 ? value : null;
}
const colorByPct = (label, pct, rich) => {
	if (!rich || pct === null) return label;
	if (pct >= 95) return theme.error(label);
	if (pct >= 80) return theme.warn(label);
	if (pct >= 60) return theme.success(label);
	return theme.muted(label);
};
const formatTokensCell = (total, contextTokens, rich) => {
	if (total === void 0) {
		const label = `unknown/${contextTokens ? formatKTokens(contextTokens) : "?"} (?%)`;
		return rich ? theme.muted(label.padEnd(TOKENS_PAD)) : label.padEnd(TOKENS_PAD);
	}
	const totalLabel = formatKTokens(total);
	const ctxLabel = contextTokens ? formatKTokens(contextTokens) : "?";
	const pct = contextTokens ? Math.min(999, Math.round(total / contextTokens * 100)) : null;
	const padded = `${totalLabel}/${ctxLabel} (${pct ?? "?"}%)`.padEnd(TOKENS_PAD);
	return colorByPct(padded, pct, rich);
};
async function lookupContextTokensForDisplay(model) {
	const { lookupContextTokens } = await contextLookupRuntimeLoader.load();
	return lookupContextTokens(model, { allowAsyncLoad: false });
}
const formatKindCell = (kind, rich) => {
	const label = kind.padEnd(KIND_PAD);
	if (!rich) return label;
	if (kind === "group") return theme.accentBright(label);
	if (kind === "global") return theme.warn(label);
	if (kind === "direct") return theme.accent(label);
	return theme.muted(label);
};
function resolveSessionRuntimeLabel(params) {
	const id = normalizeOptionalLowercaseString(params.agentRuntime.id);
	const resolvedHarness = id && id !== "openclaw" && id !== "auto" ? id : void 0;
	return resolveAgentRuntimeLabel({
		config: params.cfg,
		sessionEntry: params.entry,
		resolvedHarness,
		fallbackProvider: params.modelProvider,
		classifyCliProvider: params.classifyCliProvider
	});
}
function formatRuntimeCell(runtimeLabel, rich) {
	const label = runtimeLabel.padEnd(RUNTIME_PAD);
	return rich ? theme.info(label) : label;
}
function resolveSessionStoreDisplayPath(target) {
	return resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path;
}
function toJsonSessionRow(row) {
	const { displayModelRef, runtimeLabel, ...jsonRow } = row;
	return jsonRow;
}
function stripChannelRecipientPrefix(value, channel) {
	const raw = normalizeOptionalString(value);
	const normalizedChannel = normalizeOptionalLowercaseString(channel);
	if (!raw || !normalizedChannel) return raw;
	const prefix = `${normalizedChannel}:`;
	if (!raw.toLowerCase().startsWith(prefix)) return raw;
	const stripped = raw.slice(prefix.length);
	const topicMarkerIndex = stripped.toLowerCase().indexOf(":topic:");
	return topicMarkerIndex >= 0 ? stripped.slice(0, topicMarkerIndex) : stripped;
}
function resolveDisplayRuntimePolicySessionKey(params) {
	const { cfg, entry, key } = params;
	const origin = sessionDeliveryOrigin(entry);
	const deliveryContext = deliveryContextFromSession(entry);
	const chatType = normalizeChatType(origin?.chatType ?? entry.chatType);
	if (chatType !== "direct") return;
	const channel = normalizeOptionalString(origin?.provider ?? deliveryContext?.channel ?? origin?.surface);
	const to = normalizeOptionalString(origin?.to ?? deliveryContext?.to);
	const from = normalizeOptionalString(origin?.from);
	const nativeDirectUserId = normalizeOptionalString(origin?.nativeDirectUserId);
	const peerId = nativeDirectUserId ?? stripChannelRecipientPrefix(to, channel) ?? stripChannelRecipientPrefix(from, channel);
	const runtimePolicySessionKey = resolveRuntimePolicySessionKey({
		agentId: params.agentId,
		cfg,
		sessionKey: key,
		ctx: {
			SessionKey: key,
			AgentId: params.agentId,
			Provider: channel,
			Surface: normalizeOptionalString(origin?.surface),
			AccountId: normalizeOptionalString(origin?.accountId ?? deliveryContext?.accountId),
			ChatType: chatType,
			NativeDirectUserId: nativeDirectUserId,
			SenderId: peerId,
			OriginatingTo: to,
			From: from,
			To: to
		}
	});
	return runtimePolicySessionKey && runtimePolicySessionKey !== key ? runtimePolicySessionKey : void 0;
}
/** Lists sessions across selected stores with optional JSON output. */
async function sessionsCommand(opts, runtime) {
	const aggregateAgents = opts.allAgents === true;
	const cfg = getRuntimeConfig();
	const displayDefaults = resolveSessionDisplayDefaults(cfg);
	const configuredContextTokens = cfg.agents?.defaults?.contextTokens;
	const configContextTokens = configuredContextTokens ?? await lookupContextTokensForDisplay(displayDefaults.model) ?? 2e5;
	const targets = resolveSessionStoreTargetsOrExit({
		cfg,
		opts: {
			store: opts.store,
			agent: opts.agent,
			allAgents: opts.allAgents
		},
		runtime
	});
	if (!targets) return;
	let activeMinutes;
	if (opts.active !== void 0) {
		const parsed = parseStrictPositiveInteger(opts.active);
		if (parsed === void 0) {
			runtime.error("--active must be a positive number of minutes, for example --active 30.");
			runtime.exit(1);
			return;
		}
		activeMinutes = parsed;
	}
	const limit = parseSessionsLimit(opts.limit);
	if (limit === null) {
		runtime.error("--limit must be a positive integer or \"all\", for example --limit 25.");
		runtime.exit(1);
		return;
	}
	const classifyCliProvider = prepareCliProviderClassifier(cfg);
	const activeSince = activeMinutes === void 0 ? void 0 : Date.now() - activeMinutes * 6e4;
	const sessionEntries = targets.flatMap((target) => {
		return listSessionEntriesReadOnly({
			agentId: target.agentId,
			storePath: target.storePath
		}).filter(({ entry }) => activeSince === void 0 || typeof entry.updatedAt === "number" && entry.updatedAt >= activeSince).map(({ sessionKey, entry }) => {
			const row = toSessionDisplayRow(sessionKey, entry);
			const agentId = parseAgentSessionKey(row.key)?.agentId ?? target.agentId;
			return {
				acpSessionKey: resolveStoredSessionKeyForAgentStore({
					cfg,
					agentId,
					sessionKey: row.key
				}),
				agentId,
				entry,
				row
			};
		});
	});
	const acpSessionMetaByEntry = readAcpSessionMetaBatch({ entries: sessionEntries.map(({ acpSessionKey, entry }) => ({
		sessionKey: acpSessionKey,
		entry
	})) });
	const allRows = sessionEntries.map(({ acpSessionKey, agentId, entry, row }) => {
		const acpMeta = acpSessionMetaByEntry.get(entry);
		const acpRuntime = acpMeta != null;
		const modelRef = applyAcpModelOverlayIfNeeded(resolveSessionDisplayModelRef(cfg, row, classifyCliProvider), acpSessionKey, acpRuntime);
		const agentRuntime = resolveModelAgentRuntimeMetadata({
			cfg,
			agentId,
			sessionEntry: entry,
			provider: modelRef.provider,
			model: modelRef.model,
			sessionKey: acpSessionKey,
			acpRuntime,
			acpBackend: acpMeta?.backend
		});
		return Object.assign({}, row, {
			agentId,
			acpRuntime,
			agentRuntime,
			displayModelRef: modelRef,
			kind: classifySessionKind(row.key, entry),
			runtimePolicySessionKey: resolveDisplayRuntimePolicySessionKey({
				agentId,
				cfg,
				key: row.key,
				entry
			}),
			runtimeLabel: resolveSessionRuntimeLabel({
				cfg,
				entry,
				agentRuntime,
				modelProvider: modelRef.provider,
				classifyCliProvider
			})
		});
	});
	const totalCount = allRows.length;
	const rows = selectNewestSessionRows(allRows, limit);
	const hasMore = rows.length < totalCount;
	if (opts.json) {
		const multi = targets.length > 1;
		const aggregate = aggregateAgents || multi;
		writeRuntimeJson(runtime, {
			path: aggregate || !targets[0] ? null : resolveSessionStoreDisplayPath(targets[0]),
			stores: aggregate ? targets.map((target) => ({
				agentId: target.agentId,
				path: resolveSessionStoreDisplayPath(target)
			})) : void 0,
			allAgents: aggregateAgents ? true : void 0,
			count: rows.length,
			totalCount,
			limitApplied: limit ?? null,
			hasMore,
			activeMinutes: activeMinutes ?? null,
			sessions: await Promise.all(rows.map(async (row) => {
				const r = toJsonSessionRow(row);
				const modelRef = row.displayModelRef;
				return {
					...r,
					totalTokens: resolveSessionTotalTokens(r) ?? null,
					totalTokensFresh: resolveFreshSessionTotalTokens(r) !== void 0,
					contextTokens: r.contextTokens ?? configuredContextTokens ?? await lookupContextTokensForDisplay(modelRef.model) ?? configContextTokens ?? null,
					modelProvider: modelRef.provider,
					model: modelRef.model
				};
			}))
		});
		return;
	}
	const primaryTarget = targets[0];
	if (primaryTarget && targets.length === 1 && !aggregateAgents) runtime.log(info(`Session store: ${resolveSessionStoreDisplayPath(primaryTarget)}`));
	else runtime.log(info(`Session stores: ${targets.length} (${targets.map((t) => t.agentId).join(", ")})`));
	runtime.log(info(hasMore && limit !== void 0 ? `Sessions listed: ${rows.length} of ${totalCount} (limit ${limit})` : `Sessions listed: ${rows.length}`));
	if (activeMinutes) runtime.log(info(`Filtered to last ${activeMinutes} minute(s)`));
	if (rows.length === 0) {
		runtime.log("No sessions found.");
		return;
	}
	const rich = isRich();
	const showAgentColumn = aggregateAgents || targets.length > 1;
	const header = [
		...showAgentColumn ? ["Agent".padEnd(AGENT_PAD)] : [],
		"Kind".padEnd(KIND_PAD),
		"Key".padEnd(26),
		"Age".padEnd(9),
		"Model".padEnd(14),
		"Runtime".padEnd(RUNTIME_PAD),
		"Tokens (ctx %)".padEnd(TOKENS_PAD),
		"Flags"
	].join(" ");
	runtime.log(rich ? theme.heading(header) : header);
	for (const row of rows) {
		const model = row.displayModelRef.model;
		const contextTokens = row.contextTokens ?? configuredContextTokens ?? await lookupContextTokensForDisplay(model) ?? configContextTokens;
		const total = resolveFreshSessionTotalTokens(row);
		const line = [
			...showAgentColumn ? [rich ? theme.accentBright(row.agentId.padEnd(AGENT_PAD)) : row.agentId.padEnd(AGENT_PAD)] : [],
			formatKindCell(row.kind, rich),
			formatSessionKeyCell(row.key, rich),
			formatSessionAgeCell(row.updatedAt, rich),
			formatSessionModelCell(model, rich),
			formatRuntimeCell(row.runtimeLabel, rich),
			formatTokensCell(total, contextTokens ?? null, rich),
			formatSessionFlagsCell(row, rich)
		].join(" ");
		runtime.log(line.trimEnd());
	}
}
//#endregion
export { sessionsCommand };
