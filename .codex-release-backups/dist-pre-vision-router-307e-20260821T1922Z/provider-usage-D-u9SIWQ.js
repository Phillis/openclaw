import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs, b as parseFiniteNumber, o as asDateTimestampMs, s as asFiniteNumber, x as parseStrictFiniteNumber, y as parseDateStringTimestampMs } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-DEqefz4f.js";
import { n as readTrimmedStringAlias } from "./string-readers-e58-jh1A.js";
import { i as cancelUnreadResponseBody } from "./http-body-D5I0NwSl.js";
import { f as readProviderJsonObjectResponse, p as readProviderJsonResponse } from "./provider-http-errors-BH2HGv8j.js";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-DRrgUN7e.js";
import { o as providerUsageLabel, r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-DxRYR38m.js";
//#region src/infra/provider-usage.fetch.shared.ts
/** Fetches JSON-compatible provider usage endpoints with an abort timeout. */
async function fetchJson(url, init, timeoutMs, fetchFn) {
	const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	const timeoutSignal = AbortSignal.timeout(safeTimeoutMs);
	const signal = init.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal;
	return await fetchFn(url, {
		...init,
		signal
	});
}
/** Parses a provider reset-time string without leaking an invalid Date timestamp. */
function parseUsageResetAt(value) {
	return parseDateStringTimestampMs(value);
}
/** Builds a provider usage snapshot for non-HTTP fetch or parse failures. */
function buildUsageErrorSnapshot(provider, error) {
	return {
		provider,
		displayName: providerUsageLabel(provider) ?? provider,
		windows: [],
		error
	};
}
function buildUsageHttpErrorSnapshot(options) {
	if ((options.tokenExpiredStatuses ?? []).includes(options.status)) return buildUsageErrorSnapshot(options.provider, "Token expired");
	const suffix = options.message?.trim() ? `: ${options.message.trim()}` : "";
	return buildUsageErrorSnapshot(options.provider, `HTTP ${options.status}${suffix}`);
}
async function readUsageJson(provider, response, malformedResponseError = "Malformed usage response") {
	try {
		return {
			ok: true,
			data: await readProviderJsonResponse(response, `${provider} usage`)
		};
	} catch {
		return {
			ok: false,
			snapshot: buildUsageErrorSnapshot(provider, malformedResponseError)
		};
	}
}
async function fetchUsageJson(options) {
	const response = await fetchJson(options.url, options.init, options.timeoutMs, options.fetchFn);
	if (!response.ok) {
		await cancelUnreadResponseBody(response);
		return {
			ok: false,
			snapshot: buildUsageHttpErrorSnapshot({
				provider: options.provider,
				status: response.status,
				tokenExpiredStatuses: options.tokenExpiredStatuses
			})
		};
	}
	return await readUsageJson(options.provider, response, options.malformedResponseError);
}
//#endregion
//#region src/infra/provider-usage.fetch.claude.ts
function normalizeClaudeUsage(value) {
	const data = isRecord(value) ? value : {};
	const rawExtraUsage = isRecord(data.extra_usage) ? data.extra_usage : void 0;
	return {
		data,
		extraUsage: rawExtraUsage ? {
			enabled: rawExtraUsage.is_enabled === true,
			monthlyLimit: asFiniteNumber(rawExtraUsage.monthly_limit),
			usedCredits: asFiniteNumber(rawExtraUsage.used_credits),
			utilization: asFiniteNumber(rawExtraUsage.utilization),
			currency: normalizeOptionalString(rawExtraUsage.currency)
		} : void 0
	};
}
function readClaudeWindow(data, key, label) {
	const rawWindow = isRecord(data[key]) ? data[key] : void 0;
	const utilization = asFiniteNumber(rawWindow?.utilization);
	if (utilization === void 0) return;
	return {
		label,
		usedPercent: clampPercent(utilization),
		...key === "five_hour" || key === "seven_day" ? { resetAt: parseUsageResetAt(rawWindow?.resets_at) } : {}
	};
}
function buildClaudeUsageWindows(usage, options) {
	const { data, extraUsage } = usage;
	const windows = [];
	const fiveHour = readClaudeWindow(data, "five_hour", "5h");
	if (fiveHour) windows.push(fiveHour);
	const sevenDay = readClaudeWindow(data, "seven_day", "Week");
	if (sevenDay) windows.push(sevenDay);
	const modelWindow = readClaudeWindow(data, "seven_day_sonnet", "Sonnet") ?? readClaudeWindow(data, "seven_day_opus", "Opus");
	if (modelWindow) windows.push(modelWindow);
	const knownLabels = new Set(windows.map((window) => window.label.toLowerCase()));
	const limits = Array.isArray(data.limits) ? data.limits : [];
	for (const rawLimit of limits) {
		if (!isRecord(rawLimit)) continue;
		const percent = asFiniteNumber(rawLimit.percent);
		if (rawLimit.is_active === false || percent === void 0) continue;
		const scope = isRecord(rawLimit.scope) ? rawLimit.scope : void 0;
		const model = scope && isRecord(scope.model) ? scope.model : void 0;
		const label = normalizeOptionalString(model?.display_name) ?? normalizeOptionalString(model?.id);
		if (!label || knownLabels.has(label.toLowerCase())) continue;
		knownLabels.add(label.toLowerCase());
		windows.push({
			label,
			usedPercent: clampPercent(percent),
			resetAt: parseUsageResetAt(rawLimit.resets_at)
		});
	}
	if (!options?.skipExtraUsage && extraUsage?.enabled === true && extraUsage.utilization !== void 0) windows.push({
		label: "Extra usage",
		usedPercent: clampPercent(extraUsage.utilization)
	});
	return windows;
}
function resolveClaudeWebSessionKey() {
	const direct = process.env.CLAUDE_AI_SESSION_KEY?.trim() ?? process.env.CLAUDE_WEB_SESSION_KEY?.trim();
	if (direct?.startsWith("sk-ant-")) return direct;
	const cookieHeader = process.env.CLAUDE_WEB_COOKIE?.trim();
	if (!cookieHeader) return;
	const value = cookieHeader.replace(/^cookie:\s*/i, "").match(/(?:^|;\s*)sessionKey=([^;\s]+)/i)?.[1]?.trim();
	return value?.startsWith("sk-ant-") ? value : void 0;
}
async function fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn) {
	const headers = {
		Cookie: `sessionKey=${sessionKey}`,
		Accept: "application/json"
	};
	const orgRes = await fetchJson("https://claude.ai/api/organizations", { headers }, timeoutMs, fetchFn);
	if (!orgRes.ok) {
		await cancelUnreadResponseBody(orgRes);
		return null;
	}
	const parsedOrgs = await readUsageJson("anthropic", orgRes);
	if (!parsedOrgs.ok) return null;
	const firstOrg = Array.isArray(parsedOrgs.data) ? parsedOrgs.data[0] : void 0;
	const orgId = isRecord(firstOrg) ? normalizeOptionalString(firstOrg.uuid) : void 0;
	if (!orgId) return null;
	const usageRes = await fetchJson(`https://claude.ai/api/organizations/${orgId}/usage`, { headers }, timeoutMs, fetchFn);
	if (!usageRes.ok) {
		await cancelUnreadResponseBody(usageRes);
		return null;
	}
	const parsedUsage = await readUsageJson("anthropic", usageRes);
	if (!parsedUsage.ok) return null;
	const windows = buildClaudeUsageWindows(normalizeClaudeUsage(parsedUsage.data));
	if (windows.length === 0) return null;
	return {
		provider: "anthropic",
		displayName: PROVIDER_LABELS.anthropic,
		windows
	};
}
async function fetchClaudeUsage(token, timeoutMs, fetchFn) {
	const res = await fetchJson("https://api.anthropic.com/api/oauth/usage", { headers: {
		Authorization: `Bearer ${token}`,
		"User-Agent": "openclaw",
		Accept: "application/json",
		"anthropic-version": "2023-06-01",
		"anthropic-beta": "oauth-2025-04-20"
	} }, timeoutMs, fetchFn);
	if (!res.ok) {
		let message;
		try {
			const raw = (await readProviderJsonResponse(res, "Anthropic usage error"))?.error?.message;
			if (typeof raw === "string" && raw.trim()) message = raw.trim();
		} catch {}
		if (res.status === 403 && message?.includes("scope requirement user:profile")) {
			const sessionKey = resolveClaudeWebSessionKey();
			if (sessionKey) {
				const web = await fetchClaudeWebUsage(sessionKey, timeoutMs, fetchFn);
				if (web) return web;
			}
		}
		return buildUsageHttpErrorSnapshot({
			provider: "anthropic",
			status: res.status,
			message
		});
	}
	const parsed = await readUsageJson("anthropic", res);
	if (!parsed.ok) return parsed.snapshot;
	const usage = normalizeClaudeUsage(parsed.data);
	const extra = usage.extraUsage;
	const unit = extra?.currency?.toUpperCase() || "USD";
	const billing = extra?.enabled === true && extra.usedCredits !== void 0 && extra.usedCredits >= 0 && extra.monthlyLimit !== void 0 && extra.monthlyLimit >= 0 ? [{
		type: "budget",
		used: extra.usedCredits / 100,
		limit: extra.monthlyLimit / 100,
		unit,
		period: "month"
	}] : void 0;
	const windows = buildClaudeUsageWindows(usage, { skipExtraUsage: Boolean(billing) });
	return {
		provider: "anthropic",
		displayName: PROVIDER_LABELS.anthropic,
		windows,
		...billing ? { billing } : {}
	};
}
//#endregion
//#region src/infra/provider-usage.fetch.codex.ts
const WEEKLY_RESET_GAP_SECONDS = 4320 * 60;
function resolveSecondaryWindowLabel(params) {
	if (params.windowHours >= 168) return "Week";
	if (params.windowHours < 24) return `${params.windowHours}h`;
	if (typeof params.secondaryResetAt === "number" && typeof params.primaryResetAt === "number" && params.secondaryResetAt - params.primaryResetAt >= WEEKLY_RESET_GAP_SECONDS) return "Week";
	return "Day";
}
async function fetchCodexUsage(token, accountId, timeoutMs, fetchFn) {
	const version = process.env.OPENCLAW_VERSION?.trim();
	const defaultHeaders = {
		Authorization: `Bearer ${token}`,
		Accept: "application/json",
		originator: "openclaw",
		...version ? { version } : {},
		"User-Agent": `openclaw/${version || "dev"}`
	};
	if (accountId) defaultHeaders["ChatGPT-Account-Id"] = accountId;
	const parsed = await fetchUsageJson({
		provider: "openai",
		url: "https://chatgpt.com/backend-api/wham/usage",
		init: {
			method: "GET",
			headers: resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: "https://chatgpt.com/backend-api/wham/usage",
				capability: "other",
				transport: "http",
				defaultHeaders
			}) ?? defaultHeaders
		},
		timeoutMs,
		fetchFn,
		tokenExpiredStatuses: [401, 403]
	});
	if (!parsed.ok) return parsed.snapshot;
	const data = parsed.data;
	const windows = [];
	if (data.rate_limit?.primary_window) {
		const pw = data.rate_limit.primary_window;
		const windowHours = Math.round((pw.limit_window_seconds || 10800) / 3600);
		windows.push({
			label: `${windowHours}h`,
			usedPercent: clampPercent(pw.used_percent || 0),
			resetAt: pw.reset_at ? pw.reset_at * 1e3 : void 0
		});
	}
	if (data.rate_limit?.secondary_window) {
		const sw = data.rate_limit.secondary_window;
		const label = resolveSecondaryWindowLabel({
			windowHours: Math.round((sw.limit_window_seconds || 86400) / 3600),
			primaryResetAt: data.rate_limit?.primary_window?.reset_at,
			secondaryResetAt: sw.reset_at
		});
		windows.push({
			label,
			usedPercent: clampPercent(sw.used_percent || 0),
			resetAt: sw.reset_at ? sw.reset_at * 1e3 : void 0
		});
	}
	const plan = data.plan_type;
	let billing;
	if (data.credits?.balance !== void 0 && data.credits.balance !== null) {
		const balance = typeof data.credits.balance === "number" ? data.credits.balance : parseStrictFiniteNumber(data.credits.balance);
		if (balance !== void 0 && balance >= 0) billing = [{
			type: "balance",
			amount: balance,
			unit: "credits"
		}];
	}
	return {
		provider: "openai",
		displayName: PROVIDER_LABELS.openai,
		windows,
		plan,
		...billing ? { billing } : {}
	};
}
//#endregion
//#region src/infra/provider-usage.fetch.deepseek.ts
const DEEPSEEK_BALANCE_URL = "https://api.deepseek.com/user/balance";
function formatCurrencyAmount(amount, currency) {
	const normalized = currency?.trim().toUpperCase();
	if (normalized === "CNY" || normalized === "RMB") return `¥${amount.toFixed(2)}`;
	if (normalized === "USD") return `$${amount.toFixed(2)}`;
	return normalized ? `${amount.toFixed(2)} ${normalized}` : amount.toFixed(2);
}
function parseBalanceAmount(value) {
	return parseFiniteNumber(value);
}
function buildBalanceSummary(info) {
	const total = parseBalanceAmount(info.total_balance);
	if (total === void 0) return;
	const granted = parseBalanceAmount(info.granted_balance);
	const toppedUp = parseBalanceAmount(info.topped_up_balance);
	const parts = [`Balance ${formatCurrencyAmount(total, info.currency)}`];
	if (granted !== void 0 && granted > 0) parts.push(`Granted ${formatCurrencyAmount(granted, info.currency)}`);
	if (toppedUp !== void 0 && toppedUp > 0 && toppedUp !== total) parts.push(`Topped up ${formatCurrencyAmount(toppedUp, info.currency)}`);
	return parts.join(" · ");
}
async function fetchDeepSeekUsage(apiKey, timeoutMs, fetchFn) {
	const parsed = await fetchUsageJson({
		provider: "deepseek",
		url: DEEPSEEK_BALANCE_URL,
		init: {
			method: "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: "application/json"
			}
		},
		timeoutMs,
		fetchFn
	});
	if (!parsed.ok) return parsed.snapshot;
	const data = isRecord(parsed.data) ? parsed.data : void 0;
	const balances = data && Array.isArray(data.balance_infos) ? data.balance_infos : [];
	const summary = balances.map((info) => buildBalanceSummary(info)).filter((entry) => Boolean(entry)).join(" · ");
	const billing = balances.flatMap((info) => {
		const amount = parseBalanceAmount(info.total_balance);
		if (amount === void 0 || amount < 0) return [];
		return [{
			type: "balance",
			amount,
			unit: info.currency?.trim().toUpperCase() || "credits"
		}];
	});
	if (!summary) return {
		provider: "deepseek",
		displayName: PROVIDER_LABELS.deepseek,
		windows: [],
		error: "No balance data"
	};
	return {
		provider: "deepseek",
		displayName: PROVIDER_LABELS.deepseek,
		windows: [],
		billing,
		summary,
		...data?.is_available === false ? { plan: "Unavailable" } : {}
	};
}
//#endregion
//#region src/infra/provider-usage.fetch.gemini.ts
async function fetchGeminiUsage(token, timeoutMs, fetchFn, provider) {
	const parsed = await fetchUsageJson({
		provider,
		url: "https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuota",
		init: {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: "{}"
		},
		timeoutMs,
		fetchFn
	});
	if (!parsed.ok) return parsed.snapshot;
	const buckets = isRecord(parsed.data) && Array.isArray(parsed.data.buckets) ? parsed.data.buckets : [];
	const quotas = /* @__PURE__ */ new Map();
	for (const bucket of buckets) {
		if (!isRecord(bucket)) continue;
		const model = typeof bucket.modelId === "string" ? bucket.modelId : "unknown";
		const frac = typeof bucket.remainingFraction === "number" ? bucket.remainingFraction : 1;
		const current = quotas.get(model);
		if (current === void 0 || frac < current) quotas.set(model, frac);
	}
	const windows = [];
	let proMin = 1;
	let flashMin = 1;
	let hasPro = false;
	let hasFlash = false;
	for (const [model, frac] of quotas) {
		const lower = normalizeLowercaseStringOrEmpty(model);
		if (lower.includes("pro")) {
			hasPro = true;
			if (frac < proMin) proMin = frac;
		}
		if (lower.includes("flash")) {
			hasFlash = true;
			if (frac < flashMin) flashMin = frac;
		}
	}
	if (hasPro) windows.push({
		label: "Pro",
		usedPercent: clampPercent((1 - proMin) * 100)
	});
	if (hasFlash) windows.push({
		label: "Flash",
		usedPercent: clampPercent((1 - flashMin) * 100)
	});
	return {
		provider,
		displayName: expectDefined(providerUsageLabel(provider), "gemini provider usage label"),
		windows
	};
}
//#endregion
//#region src/infra/provider-usage.fetch.minimax.ts
const DEFAULT_MINIMAX_USAGE_ORIGIN = "https://api.minimaxi.com";
const MINIMAX_USAGE_PATH = "/v1/token_plan/remains";
const RESET_KEYS = [
	"reset_at",
	"resetAt",
	"reset_time",
	"resetTime",
	"next_reset_at",
	"nextResetAt",
	"next_reset_time",
	"nextResetTime",
	"expires_at",
	"expiresAt",
	"expire_at",
	"expireAt",
	"end_time",
	"endTime",
	"window_end",
	"windowEnd"
];
const PERCENT_KEYS = [
	"used_percent",
	"usedPercent",
	"used_rate",
	"usage_rate",
	"used_ratio",
	"usage_ratio",
	"usedRatio",
	"usageRatio"
];
const REMAINING_PERCENT_KEYS = ["usage_percent", "usagePercent"];
const CURRENT_INTERVAL_TOTAL_KEYS = ["current_interval_total_count", "currentIntervalTotalCount"];
const CURRENT_INTERVAL_REMAINING_KEYS = ["current_interval_usage_count", "currentIntervalUsageCount"];
const CURRENT_INTERVAL_REMAINING_PERCENT_KEYS = ["current_interval_remaining_percent", "currentIntervalRemainingPercent"];
const CURRENT_INTERVAL_STATUS_KEYS = ["current_interval_status", "currentIntervalStatus"];
const CURRENT_WEEKLY_TOTAL_KEYS = ["current_weekly_total_count", "currentWeeklyTotalCount"];
const CURRENT_WEEKLY_REMAINING_KEYS = ["current_weekly_usage_count", "currentWeeklyUsageCount"];
const CURRENT_WEEKLY_REMAINING_PERCENT_KEYS = ["current_weekly_remaining_percent", "currentWeeklyRemainingPercent"];
const CURRENT_WEEKLY_STATUS_KEYS = ["current_weekly_status", "currentWeeklyStatus"];
const MODEL_REMAINING_PERCENT_KEYS = [...CURRENT_INTERVAL_REMAINING_PERCENT_KEYS, ...CURRENT_WEEKLY_REMAINING_PERCENT_KEYS];
const NO_USAGE_KEYS = [];
const USED_KEYS = [
	"used",
	"usage",
	"used_amount",
	"usedAmount",
	"used_tokens",
	"usedTokens",
	"used_quota",
	"usedQuota",
	"used_times",
	"usedTimes",
	"prompt_used",
	"promptUsed",
	"used_prompt",
	"usedPrompt",
	"prompts_used",
	"promptsUsed",
	"consumed"
];
const TOTAL_KEYS = [
	"total",
	"total_amount",
	"totalAmount",
	"total_tokens",
	"totalTokens",
	"total_quota",
	"totalQuota",
	"total_times",
	"totalTimes",
	"prompt_total",
	"promptTotal",
	"total_prompt",
	"totalPrompt",
	"prompt_limit",
	"promptLimit",
	"limit_prompt",
	"limitPrompt",
	"prompts_total",
	"promptsTotal",
	"total_prompts",
	"totalPrompts",
	"current_interval_total_count",
	"currentIntervalTotalCount",
	"current_weekly_total_count",
	"currentWeeklyTotalCount",
	"limit",
	"quota",
	"quota_limit",
	"quotaLimit",
	"max"
];
const REMAINING_KEYS = [
	"remain",
	"remaining",
	"remain_amount",
	"remainingAmount",
	"remaining_amount",
	"remain_tokens",
	"remainingTokens",
	"remaining_tokens",
	"remain_quota",
	"remainingQuota",
	"remaining_quota",
	"remain_times",
	"remainingTimes",
	"remaining_times",
	"prompt_remain",
	"promptRemain",
	"remain_prompt",
	"remainPrompt",
	"prompt_remaining",
	"promptRemaining",
	"remaining_prompt",
	"remainingPrompt",
	"prompts_remaining",
	"promptsRemaining",
	"prompt_left",
	"promptLeft",
	"prompts_left",
	"promptsLeft",
	"left",
	"current_interval_usage_count",
	"currentIntervalUsageCount",
	"current_weekly_usage_count",
	"currentWeeklyUsageCount"
];
const PLAN_KEYS = [
	"plan",
	"plan_name",
	"planName",
	"product",
	"tier"
];
const WINDOW_HOUR_KEYS = [
	"window_hours",
	"windowHours",
	"duration_hours",
	"durationHours",
	"hours"
];
const WINDOW_MINUTE_KEYS = [
	"window_minutes",
	"windowMinutes",
	"duration_minutes",
	"durationMinutes",
	"minutes"
];
function pickNumber(record, keys) {
	for (const key of keys) {
		const parsed = parseFiniteNumber(record[key]);
		if (parsed !== void 0) return parsed;
	}
}
function pickString(record, keys) {
	return readTrimmedStringAlias(record, keys);
}
function parseEpoch(value) {
	if (typeof value === "number" && Number.isFinite(value)) return asDateTimestampMs(value < 0xe8d4a51000 ? Math.floor(value * 1e3) : Math.floor(value));
	if (typeof value === "string" && value.trim()) {
		const numeric = parseFiniteNumber(value);
		if (numeric !== void 0) return parseEpoch(numeric);
		return asDateTimestampMs(Date.parse(value));
	}
}
function hasAny(record, keys) {
	return keys.some((key) => key in record);
}
function scoreUsageRecord(record) {
	let score = 0;
	if (hasAny(record, PERCENT_KEYS) || hasAny(record, MODEL_REMAINING_PERCENT_KEYS)) score += 4;
	if (hasAny(record, TOTAL_KEYS)) score += 3;
	if (hasAny(record, USED_KEYS) || hasAny(record, REMAINING_KEYS)) score += 2;
	if (hasAny(record, RESET_KEYS)) score += 1;
	if (hasAny(record, PLAN_KEYS)) score += 1;
	return score;
}
function collectUsageCandidates(root) {
	const MAX_SCAN_DEPTH = 4;
	const MAX_SCAN_NODES = 60;
	const queue = [{
		value: root,
		depth: 0
	}];
	const seen = /* @__PURE__ */ new Set();
	const candidates = [];
	let scanned = 0;
	while (queue.length && scanned < MAX_SCAN_NODES) {
		const next = queue.shift();
		scanned += 1;
		const { value, depth } = next;
		if (isRecord(value)) {
			if (seen.has(value)) continue;
			seen.add(value);
			const score = scoreUsageRecord(value);
			if (score > 0) candidates.push({
				record: value,
				score,
				depth
			});
			if (depth < MAX_SCAN_DEPTH) {
				for (const nested of Object.values(value)) if (isRecord(nested) || Array.isArray(nested)) queue.push({
					value: nested,
					depth: depth + 1
				});
			}
			continue;
		}
		if (Array.isArray(value) && depth < MAX_SCAN_DEPTH) {
			for (const nested of value) if (isRecord(nested) || Array.isArray(nested)) queue.push({
				value: nested,
				depth: depth + 1
			});
		}
	}
	candidates.sort((a, b) => b.score - a.score || a.depth - b.depth);
	return candidates.map((candidate) => candidate.record);
}
function deriveWindowLabelFromTimestamps(record) {
	const startTime = parseEpoch(record.start_time ?? record.startTime);
	const endTime = parseEpoch(record.end_time ?? record.endTime);
	if (startTime !== void 0 && endTime !== void 0 && endTime > startTime) {
		const durationHours = (endTime - startTime) / 36e5;
		if (durationHours >= 1 && Number.isFinite(durationHours)) return `${Math.round(durationHours)}h`;
		const durationMinutes = Math.round((endTime - startTime) / 6e4);
		if (durationMinutes > 0) return `${durationMinutes}m`;
	}
}
function deriveWindowLabel(payload) {
	const hours = pickNumber(payload, WINDOW_HOUR_KEYS);
	if (hours && Number.isFinite(hours)) return `${hours}h`;
	const minutes = pickNumber(payload, WINDOW_MINUTE_KEYS);
	if (minutes && Number.isFinite(minutes)) return `${minutes}m`;
	const fromTimestamps = deriveWindowLabelFromTimestamps(payload);
	if (fromTimestamps) return fromTimestamps;
	return "5h";
}
function deriveUsedPercent(payload, keys = {}) {
	const remainingPercentRaw = pickNumber(payload, keys.remainingPercent ?? REMAINING_PERCENT_KEYS);
	const remainingPercentUnit = keys.remainingPercentUnit ?? "ratio-or-percent";
	const fromRemainingPercent = remainingPercentRaw === void 0 ? null : clampPercent(100 - clampPercent(remainingPercentUnit === "ratio-or-percent" && remainingPercentRaw <= 1 ? remainingPercentRaw * 100 : remainingPercentRaw));
	if (keys.preferRemainingPercent === true && fromRemainingPercent !== null) return fromRemainingPercent;
	const total = pickNumber(payload, keys.total ?? TOTAL_KEYS);
	let used = pickNumber(payload, keys.used ?? USED_KEYS);
	const remaining = pickNumber(payload, keys.remaining ?? REMAINING_KEYS);
	if (used === void 0 && remaining !== void 0 && total !== void 0) used = total - remaining;
	const fromCounts = total && total > 0 && used !== void 0 && Number.isFinite(used) ? clampPercent(used / total * 100) : null;
	if (fromCounts !== null) return fromCounts;
	const percentRaw = pickNumber(payload, keys.percent ?? PERCENT_KEYS);
	if (percentRaw !== void 0) return clampPercent(percentRaw <= 1 ? percentRaw * 100 : percentRaw);
	if (fromRemainingPercent !== null) return fromRemainingPercent;
	return null;
}
function hasModelUsageEvidence(record) {
	return hasAny(record, MODEL_REMAINING_PERCENT_KEYS) || (pickNumber(record, CURRENT_INTERVAL_TOTAL_KEYS) ?? 0) > 0 || (pickNumber(record, CURRENT_WEEKLY_TOTAL_KEYS) ?? 0) > 0;
}
function isChatModelUsageRecord(record) {
	const name = normalizeLowercaseStringOrEmpty(typeof record.model_name === "string" ? record.model_name : "");
	return name === "general" || name.startsWith("minimax-m");
}
function isBoundedMinimaxStatus(status) {
	return status === 1 || status === 2;
}
function isBoundedModelUsageRecord(record) {
	return isBoundedMinimaxStatus(pickNumber(record, CURRENT_INTERVAL_STATUS_KEYS)) || isBoundedMinimaxStatus(pickNumber(record, CURRENT_WEEKLY_STATUS_KEYS));
}
function pickChatModelRemains(modelRemains) {
	const records = modelRemains.filter(isRecord).filter(hasModelUsageEvidence);
	if (records.length === 0) return;
	return records.find(isChatModelUsageRecord) ?? records.find(isBoundedModelUsageRecord) ?? records[0];
}
function pickEpoch(record, keys) {
	for (const key of keys) {
		const parsed = parseEpoch(record[key]);
		if (parsed !== void 0) return parsed;
	}
}
function shouldExposeMinimaxWindow(record, statusKeys) {
	return pickNumber(record, statusKeys) !== 3;
}
function deriveMinimaxModelWindows(record) {
	const windows = [];
	const currentUsedPercent = deriveUsedPercent(record, {
		total: CURRENT_INTERVAL_TOTAL_KEYS,
		used: NO_USAGE_KEYS,
		remaining: CURRENT_INTERVAL_REMAINING_KEYS,
		percent: NO_USAGE_KEYS,
		remainingPercent: CURRENT_INTERVAL_REMAINING_PERCENT_KEYS,
		remainingPercentUnit: "percent",
		preferRemainingPercent: true
	});
	if (currentUsedPercent !== null && shouldExposeMinimaxWindow(record, CURRENT_INTERVAL_STATUS_KEYS)) windows.push({
		label: deriveWindowLabel(record),
		usedPercent: currentUsedPercent,
		resetAt: pickEpoch(record, ["end_time", "endTime"])
	});
	const weeklyUsedPercent = deriveUsedPercent(record, {
		total: CURRENT_WEEKLY_TOTAL_KEYS,
		used: NO_USAGE_KEYS,
		remaining: CURRENT_WEEKLY_REMAINING_KEYS,
		percent: NO_USAGE_KEYS,
		remainingPercent: CURRENT_WEEKLY_REMAINING_PERCENT_KEYS,
		remainingPercentUnit: "percent",
		preferRemainingPercent: true
	});
	if (weeklyUsedPercent !== null && shouldExposeMinimaxWindow(record, CURRENT_WEEKLY_STATUS_KEYS)) windows.push({
		label: "Week",
		usedPercent: weeklyUsedPercent,
		resetAt: pickEpoch(record, ["weekly_end_time", "weeklyEndTime"])
	});
	return {
		recognized: currentUsedPercent !== null || weeklyUsedPercent !== null,
		windows
	};
}
function resolveMinimaxUsageUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return `${DEFAULT_MINIMAX_USAGE_ORIGIN}${MINIMAX_USAGE_PATH}`;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol === "http:" || parsed.protocol === "https:") return `${parsed.origin}${MINIMAX_USAGE_PATH}`;
	} catch {}
	return `${DEFAULT_MINIMAX_USAGE_ORIGIN}${MINIMAX_USAGE_PATH}`;
}
async function fetchMinimaxUsage(apiKey, timeoutMs, fetchFn, options) {
	const parsed = await fetchUsageJson({
		provider: "minimax",
		url: resolveMinimaxUsageUrl(options?.baseUrl),
		init: {
			method: "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				"MM-API-Source": "OpenClaw"
			}
		},
		timeoutMs,
		fetchFn,
		malformedResponseError: "Invalid JSON"
	});
	if (!parsed.ok) return parsed.snapshot;
	const data = parsed.data;
	if (!isRecord(data)) return {
		provider: "minimax",
		displayName: PROVIDER_LABELS.minimax,
		windows: [],
		error: "Invalid JSON"
	};
	const baseResp = isRecord(data.base_resp) ? data.base_resp : void 0;
	if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) return {
		provider: "minimax",
		displayName: PROVIDER_LABELS.minimax,
		windows: [],
		error: baseResp.status_msg?.trim() || "API error"
	};
	const payload = isRecord(data.data) ? data.data : data;
	const modelRemains = Array.isArray(payload.model_remains) ? payload.model_remains : null;
	const chatRemains = modelRemains ? pickChatModelRemains(modelRemains) : void 0;
	const usageSource = chatRemains ?? payload;
	let usageRecord = usageSource;
	const modelUsage = chatRemains ? deriveMinimaxModelWindows(chatRemains) : void 0;
	let windows = modelUsage?.windows ?? [];
	if (modelUsage?.recognized !== true) {
		const candidates = collectUsageCandidates(usageSource);
		let usedPercent = null;
		for (const candidate of candidates) {
			const candidatePercent = deriveUsedPercent(candidate);
			if (candidatePercent !== null) {
				usageRecord = candidate;
				usedPercent = candidatePercent;
				break;
			}
		}
		if (usedPercent === null) usedPercent = deriveUsedPercent(usageSource);
		if (usedPercent === null) return {
			provider: "minimax",
			displayName: PROVIDER_LABELS.minimax,
			windows: [],
			error: "Unsupported response shape"
		};
		const resetAt = parseEpoch(pickString(usageRecord, RESET_KEYS)) ?? parseEpoch(pickNumber(usageRecord, RESET_KEYS)) ?? parseEpoch(pickString(payload, RESET_KEYS)) ?? parseEpoch(pickNumber(payload, RESET_KEYS));
		windows = [{
			label: deriveWindowLabel(usageRecord),
			usedPercent,
			resetAt
		}];
	}
	const modelName = chatRemains && typeof chatRemains.model_name === "string" ? chatRemains.model_name : void 0;
	const plan = pickString(usageRecord, PLAN_KEYS) ?? pickString(payload, PLAN_KEYS) ?? (modelName ? `Coding Plan · ${modelName}` : void 0);
	return {
		provider: "minimax",
		displayName: PROVIDER_LABELS.minimax,
		windows,
		plan
	};
}
//#endregion
//#region src/infra/provider-usage.fetch.zai.ts
function normalizeZaiUsage(value) {
	if (!isRecord(value)) return;
	const message = normalizeOptionalString(value.msg);
	if (value.success !== true || asFiniteNumber(value.code) !== 200) return {
		ok: false,
		message
	};
	const data = isRecord(value.data) ? value.data : {};
	const rawLimits = Array.isArray(data.limits) ? data.limits : [];
	const limits = [];
	for (const rawLimit of rawLimits) {
		if (!isRecord(rawLimit)) continue;
		limits.push({
			type: normalizeOptionalString(rawLimit.type),
			percentage: asFiniteNumber(rawLimit.percentage),
			unit: asFiniteNumber(rawLimit.unit),
			number: asFiniteNumber(rawLimit.number),
			nextResetTime: normalizeOptionalString(rawLimit.nextResetTime)
		});
	}
	return {
		ok: true,
		plan: normalizeOptionalString(data.planName) ?? normalizeOptionalString(data.plan),
		limits
	};
}
async function fetchZaiUsage(apiKey, timeoutMs, fetchFn) {
	const parsed = await fetchUsageJson({
		provider: "zai",
		url: "https://api.z.ai/api/monitor/usage/quota/limit",
		init: {
			method: "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: "application/json"
			}
		},
		timeoutMs,
		fetchFn
	});
	if (!parsed.ok) return parsed.snapshot;
	const usage = normalizeZaiUsage(parsed.data);
	if (!usage || !usage.ok) return {
		provider: "zai",
		displayName: PROVIDER_LABELS.zai,
		windows: [],
		error: usage?.message || "API error"
	};
	const windows = [];
	for (const limit of usage.limits) {
		const percent = clampPercent(limit.percentage ?? 0);
		const nextReset = parseUsageResetAt(limit.nextResetTime);
		let windowLabel = "Limit";
		if (limit.unit === 1 && limit.number !== void 0) windowLabel = `${limit.number}d`;
		else if (limit.unit === 3 && limit.number !== void 0) windowLabel = `${limit.number}h`;
		else if (limit.unit === 5 && limit.number !== void 0) windowLabel = `${limit.number}m`;
		if (limit.type === "TOKENS_LIMIT") windows.push({
			label: `Tokens (${windowLabel})`,
			usedPercent: percent,
			resetAt: nextReset
		});
		else if (limit.type === "TIME_LIMIT") windows.push({
			label: "Monthly",
			usedPercent: percent,
			resetAt: nextReset
		});
	}
	return {
		provider: "zai",
		displayName: PROVIDER_LABELS.zai,
		windows,
		plan: usage.plan
	};
}
//#endregion
//#region src/infra/provider-usage.admin.ts
const DAY_MS = 864e5;
const MAX_USAGE_PAGES = 100;
function cleanProviderUsageCredential(raw) {
	const trimmed = raw?.replaceAll(/[\r\n]/g, "").trim();
	if (!trimmed) return;
	return (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'") ? trimmed.slice(1, -1).trim() : trimmed) || void 0;
}
function encodeProviderUsageAdminToken(prefix, token) {
	return `${prefix}${JSON.stringify({ token })}`;
}
function decodeProviderUsageAdminToken(prefix, raw) {
	if (!raw.startsWith(prefix)) return;
	try {
		const token = asProviderUsageObject(JSON.parse(raw.slice(prefix.length)))?.token;
		return typeof token === "string" && token.trim() ? token.trim() : void 0;
	} catch {
		return;
	}
}
function asProviderUsageObject(value) {
	return asOptionalRecord(value);
}
function parseProviderUsageNumber(value) {
	const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
	return Number.isFinite(parsed) ? parsed : void 0;
}
function parseProviderUsageNonNegativeNumber(value) {
	const parsed = parseProviderUsageNumber(value);
	return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
}
function parseProviderUsageNonNegativeInteger(value) {
	const parsed = parseProviderUsageNumber(value);
	return parsed === void 0 ? 0 : Math.max(0, Math.trunc(parsed));
}
function resolveProviderUsageDisplayName(value, fallback) {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function resolveProviderUsageDailyPeriod(params) {
	const periodDays = Math.max(1, Math.min(31, Math.trunc(params.periodDays ?? params.defaultPeriodDays)));
	const current = new Date(params.now);
	const todayStart = Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());
	return {
		periodDays,
		startMs: todayStart - (periodDays - 1) * DAY_MS,
		endMs: todayStart + DAY_MS
	};
}
async function fetchProviderUsagePages(params) {
	const data = [];
	const seenPages = /* @__PURE__ */ new Set();
	let page;
	for (let pageCount = 1; pageCount <= MAX_USAGE_PAGES; pageCount += 1) {
		const request = params.buildRequest(page);
		let response;
		try {
			response = await params.fetchFn(request.url, {
				headers: request.headers,
				signal: AbortSignal.timeout(params.timeoutMs)
			});
		} catch {
			return { ok: false };
		}
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			return {
				ok: false,
				status: response.status
			};
		}
		let payload;
		try {
			payload = await readProviderJsonObjectResponse(response, params.responseLabel, {
				maxBytes: params.responseMaxBytes,
				chunkTimeoutMs: params.timeoutMs,
				onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`${params.responseLabel} response stalled for ${chunkTimeoutMs}ms`)
			});
		} catch {
			return { ok: false };
		}
		if (!Array.isArray(payload.data)) return { ok: false };
		data.push(...payload.data);
		if (payload.has_more !== true) return {
			ok: true,
			data
		};
		const nextPage = typeof payload.next_page === "string" && payload.next_page.trim() ? payload.next_page.trim() : void 0;
		if (!nextPage || seenPages.has(nextPage)) return { ok: false };
		seenPages.add(nextPage);
		page = nextPage;
	}
	return { ok: false };
}
function createProviderUsageDailyAccumulator(date, includeRequests = false) {
	return {
		date,
		amount: 0,
		...includeRequests ? { requests: 0 } : {},
		inputTokens: 0,
		cacheReadTokens: 0,
		cacheWriteTokens: 0,
		outputTokens: 0,
		totalTokens: 0,
		categories: /* @__PURE__ */ new Map(),
		models: /* @__PURE__ */ new Map()
	};
}
function mergeModelUsage(models, name, usage) {
	const current = models.get(name) ?? {
		name,
		...usage.requests === void 0 ? {} : { requests: 0 },
		inputTokens: 0,
		cacheReadTokens: 0,
		cacheWriteTokens: 0,
		outputTokens: 0,
		totalTokens: 0
	};
	if (usage.requests !== void 0) current.requests = (current.requests ?? 0) + usage.requests;
	current.inputTokens += usage.inputTokens;
	current.cacheReadTokens += usage.cacheReadTokens;
	current.cacheWriteTokens += usage.cacheWriteTokens;
	current.outputTokens += usage.outputTokens;
	current.totalTokens += usage.totalTokens;
	models.set(name, current);
}
function addProviderUsageModel(accumulator, name, usage) {
	mergeModelUsage(accumulator.models, name, usage);
}
function buildProviderUsageHistorySnapshot(params) {
	const categories = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const daily = [...params.daily].toSorted((a, b) => a.date.localeCompare(b.date)).map((entry) => {
		for (const [name, amount] of entry.categories) categories.set(name, (categories.get(name) ?? 0) + amount);
		for (const model of entry.models.values()) mergeModelUsage(models, model.name, model);
		const { categories: _categories, models: _models, ...day } = entry;
		return day;
	});
	const amount = daily.reduce((total, day) => total + day.amount, 0);
	const requests = daily.reduce((total, day) => total + (day.requests ?? 0), 0);
	const totalTokens = daily.reduce((total, day) => total + day.totalTokens, 0);
	return {
		provider: params.provider,
		displayName: params.displayName,
		windows: [],
		plan: params.plan,
		billing: [{
			type: "spend",
			label: `${params.periodDays}-day API spend`,
			amount,
			unit: params.unit,
			period: `${params.periodDays}d`
		}],
		costHistory: {
			unit: params.unit,
			periodDays: params.periodDays,
			...params.scope ? { scope: params.scope } : {},
			daily,
			models: [...models.values()].toSorted((a, b) => b.totalTokens - a.totalTokens || a.name.localeCompare(b.name)),
			categories: [...categories.entries()].map(([name, categoryAmount]) => ({
				name,
				amount: categoryAmount
			})).toSorted((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
		},
		summary: params.formatSummary({
			requests,
			totalTokens
		})
	};
}
//#endregion
export { fetchJson as S, fetchDeepSeekUsage as _, createProviderUsageDailyAccumulator as a, buildUsageErrorSnapshot as b, fetchProviderUsagePages as c, parseProviderUsageNumber as d, resolveProviderUsageDailyPeriod as f, fetchGeminiUsage as g, fetchMinimaxUsage as h, cleanProviderUsageCredential as i, parseProviderUsageNonNegativeInteger as l, fetchZaiUsage as m, asProviderUsageObject as n, decodeProviderUsageAdminToken as o, resolveProviderUsageDisplayName as p, buildProviderUsageHistorySnapshot as r, encodeProviderUsageAdminToken as s, addProviderUsageModel as t, parseProviderUsageNonNegativeNumber as u, fetchCodexUsage as v, buildUsageHttpErrorSnapshot as x, fetchClaudeUsage as y };
