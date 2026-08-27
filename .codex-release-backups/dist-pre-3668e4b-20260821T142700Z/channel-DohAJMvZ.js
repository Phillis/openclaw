import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, h as readNonEmptyStringPreservingWhitespace, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-uyT2Z2BT.js";
import { C as parseStrictNonNegativeInteger, w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, dn as literal, wn as number, yt as _enum } from "./schemas-C7gqXY2T.js";
import { l as hasConfiguredSecretInput, m as normalizeResolvedSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { S as ReplyRuntimeConfigSchemaShape, V as requireOpenAllowFrom, g as MarkdownConfigSchema, s as DmPolicySchema, u as GroupPolicySchema } from "./zod-schema.core-D1Ak_xoR.js";
import { a as buildChannelConfigSchema, c as buildMultiAccountChannelSchema, o as buildGroupEntrySchema } from "./config-schema-C8KVhsqS.js";
import { c as readRequestBodyWithLimit, f as requestBodyErrorToText, o as isRequestBodyLimitError } from "./http-body-B0Ouh_va.js";
import { t as defineChannelSetupContract } from "./setup-contract-DNfi_CdO.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { h as readResponseTextLimited, p as readProviderJsonResponse } from "./provider-http-errors-DwYSuIHs.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { p as createAuthRateLimiter } from "./auth-rate-limit-Bw_B6Pm2.js";
import { a as resolveChannelEntryMatchWithFallback, n as buildChannelKeyCandidates, r as normalizeChannelSlug } from "./channel-config-D5i_K0JA.js";
import { i as resolveAllowlistMatchByCandidates } from "./allowlist-match-B8i_bWcB.js";
import { m as bindIngressLifecycleToReplyOptions, p as defineChannelMessageAdapter } from "./channel-outbound-BbXJ4rch.js";
import { _ as readToolStringParam } from "./common-ciEJghJz.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as createSetupTranslator } from "./i18n-BzsUVhtU.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-DkdYrwAv.js";
import { n as deliverFormattedTextWithAttachments } from "./reply-payload-DBNGwex4.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-_WMqEo47.js";
import { v as resolveChannelStreamingBlockEnabled } from "./streaming-DDNrTPpy.js";
import { t as clearAccountEntryFields } from "./config-helpers-CzQqpZhA.js";
import { a as createScopedChannelConfigAdapter, s as createScopedDmSecurityResolver, t as adaptScopedAccountAccessor } from "./channel-config-helpers-C6dKYMZI.js";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-BZPjT046.js";
import { i as hasConfiguredAccountValue, r as describeWebhookAccountSnapshot, t as createAccountListHelpers } from "./account-helpers-CEliAVvN.js";
import "./error-runtime-oXQewkZq.js";
import "./runtime-env-dZQRmQRq.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as resolveAccountWithDefaultFallback } from "./account-core-C0xCbFEJ.js";
import "./routing-CERGQFBr.js";
import { n as tryReadSecretFileSync } from "./secret-file--SF4Rv39.js";
import "./secret-file-runtime-ChG2slmJ.js";
import { r as buildSecretInputSchema } from "./secret-input-CkeFVjF0.js";
import { c as ssrfPolicyFromPrivateNetworkOptIn } from "./ssrf-policy-u8sGC1hi.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./text-utility-runtime-BSdEoze8.js";
import { i as runPassiveAccountLifecycle, t as createAccountStatusSink } from "./channel-lifecycle.core-C98dobNq.js";
import { f as requireChannelOpenAllowFrom, m as resolveLoggerBackedRuntime } from "./extension-shared-D4oakjAV.js";
import { t as fileExists } from "./security-runtime-fAO34zGh.js";
import { i as FormatCapabilityProfile } from "./text-chunking-BrrQ2GHk.js";
import { n as renderMarkdownWithMarkers, t as convertMarkdownTables } from "./tables-B5czjBEh.js";
import "./provider-http-D7FntVgP.js";
import { a as createSetupInputPresenceValidator, c as patchScopedAccountConfig, t as applyAccountNameToChannelSection } from "./setup-helpers-D-LqhtmB.js";
import { i as createChatChannelPlugin } from "./core-DzxZdw8u.js";
import "./state-paths-BIUvtBLx.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-CUY1CGUC.js";
import { C as promptParsedAllowFromForAccount, O as resolveSetupAccountId, j as setSetupChannelEnabled, p as mergeAllowFromEntries, s as createStandardChannelSetupStatus } from "./setup-wizard-helpers-Dm-d9du3.js";
import { n as defineTokenCredential, t as baseUrlTextInput } from "./setup-credential-DGTRzzky.js";
import "./setup-BVnDItNa.js";
import "./setup-runtime-BqpxDhdJ.js";
import "./channel-setup-BeEHkyUZ.js";
import "./setup-tools-D2q9lLGQ.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-Bs9uwexj.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-CeK7PFoj.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy, t as GROUP_POLICY_BLOCKED_LABEL } from "./runtime-group-policy-6UJsFi-Z.js";
import { r as resolveChannelInboundRouteEnvelope } from "./envelope-BcRdGSOY.js";
import "./channel-inbound-BBUw8SLQ.js";
import { n as logInboundDrop } from "./logging-gUWPKC5g.js";
import { r as createChannelIngressMonitor } from "./ingress-monitor-D70rNE7-.js";
import "./channel-secret-basic-runtime-BUtqhYr9.js";
import { r as channelReadyPatch } from "./gateway-runtime-Bdl1Q2-8.js";
import "./markdown-table-runtime-Bq4UlJHf.js";
import { t as formatAllowFromLowercase } from "./allow-from-D8N51uwu.js";
import { t as createChannelDmPolicy } from "./channel-dm-policy-BciMMWsn.js";
import "./channel-plugin-common-o8GmRUQb.js";
import { d as createDefaultChannelRuntimeState, s as buildWebhookChannelStatusSummary, u as createComputedAccountStatusAdapter } from "./status-helpers-CRFbyFxI.js";
import "./channel-config-schema-Heqt9qxQ.js";
import { t as resolveReactionMessageId } from "./channel-actions-Ht8PCq9o.js";
import "./channel-core-eALo86Vk.js";
import { i as channelIngressRoutes, s as resolveStableChannelMessageIngress } from "./channel-ingress-runtime-CH0-nCCh.js";
import { i as createPairingPrefixStripper, n as createChannelPairingController, r as createLoggedPairingApprovalNotifier } from "./channel-pairing-BagrMBLr.js";
import { h as resolveScopeToolsPolicy, j as createAllowlistProviderRouteAllowlistWarningCollector, m as resolveScopeRequireMention } from "./channel-policy-Dn6aXK3G.js";
import "./channel-targets-CA9Rbqbg.js";
import { o as migratePersistentDedupeLegacyJsonFile, s as resolvePersistentDedupePluginStateNamespace } from "./persistent-dedupe-DHEVh0HN.js";
import { r as WEBHOOK_RATE_LIMIT_DEFAULTS } from "./webhook-ingress-Bfu_BdL5.js";
import { t as getNextcloudTalkRuntime } from "./runtime-api-Cq-xZnF0.js";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-DyKR1oLN.js";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-CPEkbjOu.js";
import { createHmac, randomBytes } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { createServer } from "node:http";
//#region extensions/nextcloud-talk/src/api-credentials.ts
function resolveNextcloudTalkApiCredentialsResult(params) {
	const apiUser = params.apiUser?.trim();
	if (!apiUser) return { status: "missing" };
	const inlinePassword = normalizeResolvedSecretInputString({
		value: params.apiPassword,
		path: "channels.nextcloud-talk.apiPassword"
	});
	if (inlinePassword) return {
		status: "available",
		value: {
			apiUser,
			apiPassword: inlinePassword
		}
	};
	if (!params.apiPasswordFile?.trim()) return { status: "missing" };
	const result = tryReadSecretFileSync(params.apiPasswordFile, "Nextcloud Talk API password", { rejectHardlinks: false }, { configPath: params.configPath ?? "channels.nextcloud-talk.apiPasswordFile" });
	if (result.status === "available") return result.value ? {
		status: "available",
		value: {
			apiUser,
			apiPassword: result.value
		}
	} : { status: "missing" };
	return result;
}
function resolveNextcloudTalkApiCredentials(params) {
	const result = resolveNextcloudTalkApiCredentialsResult(params);
	return result.status === "available" ? result.value : void 0;
}
//#endregion
//#region extensions/nextcloud-talk/src/accounts.ts
const debugAccounts = (...args) => {
	if (isTruthyEnvValue(process.env.OPENCLAW_DEBUG_NEXTCLOUD_TALK_ACCOUNTS)) console.warn("[nextcloud-talk:accounts]", ...args);
};
const { listAccountIds: listNextcloudTalkAccountIdsInternal, resolveDefaultAccountId: resolveDefaultNextcloudTalkAccountId, resolveAccountConfig: mergeNextcloudTalkAccountConfig } = createAccountListHelpers("nextcloud-talk", {
	normalizeAccountId,
	omitKeys: ["defaultAccount"],
	hasImplicitDefaultAccount: (cfg) => {
		const channel = cfg.channels?.["nextcloud-talk"];
		return Boolean(channel?.baseUrl?.trim() && (hasConfiguredAccountValue(channel.botSecret) || channel.botSecretFile?.trim() || process.env.NEXTCLOUD_TALK_BOT_SECRET?.trim()));
	}
});
function listNextcloudTalkAccountIds(cfg) {
	const ids = listNextcloudTalkAccountIdsInternal(cfg);
	debugAccounts("listNextcloudTalkAccountIds", ids);
	return ids;
}
function resolveNextcloudTalkSecret(cfg, opts) {
	const resolvedAccountId = opts.accountId ?? resolveDefaultNextcloudTalkAccountId(cfg);
	const merged = mergeNextcloudTalkAccountConfig(cfg, resolvedAccountId);
	const envSecret = normalizeOptionalString(process.env.NEXTCLOUD_TALK_BOT_SECRET);
	if (envSecret && resolvedAccountId === "default") return {
		secret: envSecret,
		source: "env",
		status: "available"
	};
	const botSecretFile = normalizeOptionalString(merged.botSecretFile);
	if (botSecretFile) {
		const result = tryReadSecretFileSync(botSecretFile, "Nextcloud Talk bot secret file", { rejectSymlink: true }, { configPath: `channels.nextcloud-talk.accounts.${resolvedAccountId}.botSecretFile` });
		return result.status === "available" ? {
			secret: result.value,
			source: "secretFile",
			status: "available"
		} : {
			secret: "",
			source: "secretFile",
			status: "configured_unavailable",
			diagnostic: result.diagnostic
		};
	}
	const inlineSecret = normalizeResolvedSecretInputString({
		value: merged.botSecret,
		path: `channels.nextcloud-talk.accounts.${resolvedAccountId}.botSecret`
	});
	if (inlineSecret) return {
		secret: inlineSecret,
		source: "config",
		status: "available"
	};
	return {
		secret: "",
		source: "none",
		status: "missing"
	};
}
function resolveNextcloudTalkAccount(params) {
	const baseEnabled = params.cfg.channels?.["nextcloud-talk"]?.enabled !== false;
	const resolvedAccountId = params.accountId ?? resolveDefaultNextcloudTalkAccountId(params.cfg);
	const resolve = (accountId) => {
		const merged = mergeNextcloudTalkAccountConfig(params.cfg, accountId);
		const accountEnabled = merged.enabled !== false;
		const enabled = baseEnabled && accountEnabled;
		const secretResolution = resolveNextcloudTalkSecret(params.cfg, { accountId });
		const apiCredentialResolution = resolveNextcloudTalkApiCredentialsResult({
			apiUser: merged.apiUser,
			apiPassword: merged.apiPassword,
			apiPasswordFile: merged.apiPasswordFile,
			configPath: `channels.nextcloud-talk.accounts.${accountId}.apiPasswordFile`
		});
		const diagnostics = [secretResolution.diagnostic, apiCredentialResolution.status === "configured_unavailable" ? apiCredentialResolution.diagnostic : void 0].filter((diagnostic) => Boolean(diagnostic));
		const baseUrl = merged.baseUrl?.trim()?.replace(/\/$/, "") ?? "";
		debugAccounts("resolve", {
			accountId,
			enabled,
			secretSource: secretResolution.source,
			baseUrl: baseUrl ? "[set]" : "[missing]"
		});
		return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			baseUrl,
			secret: secretResolution.secret,
			secretSource: secretResolution.source,
			tokenStatus: secretResolution.status,
			apiCredentialStatus: apiCredentialResolution.status,
			...diagnostics.length > 0 ? { credentialDiagnostics: diagnostics } : {},
			config: merged
		};
	};
	return resolveAccountWithDefaultFallback({
		accountId: resolvedAccountId,
		normalizeAccountId,
		resolvePrimary: resolve,
		hasCredential: (account) => account.tokenStatus !== "missing",
		resolveDefaultAccountId: () => resolveDefaultNextcloudTalkAccountId(params.cfg)
	});
}
//#endregion
//#region extensions/nextcloud-talk/src/approval-auth.ts
function normalizeNextcloudTalkApproverId(value) {
	return normalizeOptionalLowercaseString(String(value).trim().replace(/^(nextcloud-talk|nc-talk|nc):/i, ""));
}
const nextcloudTalkApprovalAuth = createChannelApprovalAuth({
	channelLabel: "Nextcloud Talk",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveNextcloudTalkAccount({
			cfg,
			accountId
		}).config.allowFrom };
	},
	normalizeApprover: normalizeNextcloudTalkApproverId
}).approvalAuth;
//#endregion
//#region extensions/nextcloud-talk/src/guarded-response.ts
async function releaseNextcloudTalkGuardedResponse(params) {
	if (!params.response.bodyUsed) await params.response.body?.cancel().catch(() => void 0);
	await params.release();
}
//#endregion
//#region extensions/nextcloud-talk/src/signature.ts
const SIGNATURE_HEADER = "x-nextcloud-talk-signature";
const RANDOM_HEADER = "x-nextcloud-talk-random";
const BACKEND_HEADER = "x-nextcloud-talk-backend";
/**
* Verify the HMAC-SHA256 signature of an incoming webhook request.
* Signature is calculated as: HMAC-SHA256(random + body, secret)
*/
function verifyNextcloudTalkSignature(params) {
	const { signature, random, body, secret } = params;
	if (!signature || !random || !secret) return false;
	return safeEqualSecret(signature, createHmac("sha256", secret).update(random + body).digest("hex"));
}
/**
* Extract webhook headers from an incoming request.
*/
function extractNextcloudTalkHeaders(headers) {
	const getHeader = (name) => {
		const value = headers[name] ?? headers[normalizeLowercaseStringOrEmpty(name)];
		return Array.isArray(value) ? value[0] : value;
	};
	const signature = getHeader(SIGNATURE_HEADER);
	const random = getHeader(RANDOM_HEADER);
	const backend = getHeader(BACKEND_HEADER);
	if (!signature || !random || !backend) return null;
	return {
		signature,
		random,
		backend
	};
}
/**
* Generate signature headers for an outbound request to Nextcloud Talk.
*/
function generateNextcloudTalkSignature(params) {
	const { body, secret } = params;
	const random = randomBytes(32).toString("hex");
	return {
		random,
		signature: createHmac("sha256", secret).update(random + body).digest("hex")
	};
}
//#endregion
//#region extensions/nextcloud-talk/src/bot-preflight.ts
const BOT_FEATURE_RESPONSE = 2;
const BOT_PREFLIGHT_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
function normalizeUrlForMatch(value) {
	if (!value?.trim()) return "";
	try {
		const url = new URL(value.trim());
		url.hash = "";
		return url.toString().replace(/\/$/, "");
	} catch {
		return value.trim().replace(/\/$/, "");
	}
}
function coerceFeatureMask(value) {
	if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return value;
	return parseStrictNonNegativeInteger(value);
}
function formatMissingResponseFeatureMessage(bot, features) {
	const id = bot.id == null ? "unknown" : String(bot.id);
	return `Nextcloud Talk bot "${bot.name?.trim() || "matching bot"}" (${id}) is missing the response feature${typeof features === "number" ? ` (features=${features})` : ""}; outbound replies will fail. Run ./occ talk:bot:state --feature webhook --feature response --feature reaction ${id} 1 or reinstall the bot with --feature response.`;
}
async function probeNextcloudTalkBotResponseFeature(params) {
	const { account, timeoutMs } = params;
	const baseUrl = account.baseUrl?.trim();
	if (!baseUrl) return {
		ok: true,
		skipped: true,
		code: "missing_base_url",
		message: "Nextcloud Talk bot response feature probe skipped: baseUrl is not configured."
	};
	const webhookUrl = normalizeUrlForMatch(account.config.webhookPublicUrl);
	if (!webhookUrl) return {
		ok: true,
		skipped: true,
		code: "missing_webhook_url",
		message: "Nextcloud Talk bot response feature probe skipped: webhookPublicUrl is not configured."
	};
	const credentials = resolveNextcloudTalkApiCredentials({
		apiUser: account.config.apiUser,
		apiPassword: account.config.apiPassword,
		apiPasswordFile: account.config.apiPasswordFile
	});
	if (!credentials) return {
		ok: true,
		skipped: true,
		code: "missing_api_credentials",
		message: "Nextcloud Talk bot response feature probe skipped: apiUser/apiPassword are not configured."
	};
	const url = `${baseUrl}/ocs/v2.php/apps/spreed/api/v1/bot/admin`;
	const auth = Buffer.from(`${credentials.apiUser}:${credentials.apiPassword}`, "utf-8").toString("base64");
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url,
			init: {
				method: "GET",
				headers: {
					Authorization: `Basic ${auth}`,
					"OCS-APIRequest": "true",
					Accept: "application/json"
				}
			},
			auditContext: "nextcloud-talk.bot-response-preflight",
			policy: ssrfPolicyFromPrivateNetworkOptIn(account.config),
			timeoutMs
		});
		try {
			if (!response.ok) {
				const body = await readResponseTextLimited(response, BOT_PREFLIGHT_ERROR_BODY_LIMIT_BYTES).catch(() => "");
				return {
					ok: false,
					code: "api_error",
					status: response.status,
					message: `Nextcloud Talk bot response feature probe failed (${response.status})${body ? `: ${body}` : ""}`
				};
			}
			const payload = await readProviderJsonResponse(response, "Nextcloud Talk bot response feature probe failed");
			const bot = (Array.isArray(payload.ocs?.data) ? payload.ocs.data : []).find((entry) => normalizeUrlForMatch(entry.url) === webhookUrl);
			if (!bot) return {
				ok: false,
				code: "bot_not_found",
				message: `Nextcloud Talk bot response feature probe could not find a bot with webhook URL ${webhookUrl}.`
			};
			const features = coerceFeatureMask(bot.features);
			if (features == null || (features & BOT_FEATURE_RESPONSE) !== BOT_FEATURE_RESPONSE) return {
				ok: false,
				code: "missing_response_feature",
				botId: bot.id == null ? void 0 : String(bot.id),
				botName: bot.name,
				features,
				message: formatMissingResponseFeatureMessage(bot, features)
			};
			return {
				ok: true,
				code: "ok",
				botId: bot.id == null ? void 0 : String(bot.id),
				botName: bot.name,
				features,
				message: `Nextcloud Talk bot "${bot.name ?? bot.id ?? "matching bot"}" has the response feature.`
			};
		} finally {
			await releaseNextcloudTalkGuardedResponse({
				response,
				release
			});
		}
	} catch (error) {
		return {
			ok: false,
			code: "request_failed",
			message: `Nextcloud Talk bot response feature probe failed: ${error instanceof Error ? error.message : formatErrorMessage(error)}`
		};
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/channel.adapters.ts
const nextcloudTalkConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "nextcloud-talk",
	listAccountIds: listNextcloudTalkAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveNextcloudTalkAccount),
	defaultAccountId: resolveDefaultNextcloudTalkAccountId,
	clearBaseFields: [
		"botSecret",
		"botSecretFile",
		"baseUrl",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(nextcloud-talk|nc-talk|nc):/i
	})
});
const nextcloudTalkSecurityAdapter = { resolveDmPolicy: createScopedDmSecurityResolver({
	channelKey: "nextcloud-talk",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => normalizeLowercaseStringOrEmpty(raw.trim().replace(/^(nextcloud-talk|nc-talk|nc):/i, ""))
}) };
const nextcloudTalkPairingTextAdapter = {
	idLabel: "nextcloudUserId",
	message: "OpenClaw: your access has been approved.",
	normalizeAllowEntry: createPairingPrefixStripper(/^(nextcloud-talk|nc-talk|nc):/i, (entry) => normalizeLowercaseStringOrEmpty(entry))
};
//#endregion
//#region extensions/nextcloud-talk/src/config-schema.ts
const NextcloudTalkRoomSchema = buildGroupEntrySchema({ allowFrom: array(string()).optional() }).omit({ toolsBySender: true });
const NextcloudTalkNetworkSchema = object({ 
/** Dangerous opt-in for self-hosted Nextcloud Talk on trusted private/internal hosts. */
dangerouslyAllowPrivateNetwork: boolean().optional() }).strict().optional();
const NextcloudTalkConfigSchema = buildMultiAccountChannelSchema(object({
	name: string().optional(),
	enabled: boolean().optional(),
	configWrites: boolean().optional(),
	markdown: MarkdownConfigSchema,
	baseUrl: string().optional(),
	botSecret: buildSecretInputSchema().optional(),
	botSecretFile: string().optional(),
	apiUser: string().optional(),
	apiPassword: buildSecretInputSchema().optional(),
	apiPasswordFile: string().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	webhookPort: number().int().positive().optional(),
	webhookHost: string().optional(),
	webhookPath: string().optional(),
	webhookPublicUrl: string().optional(),
	allowFrom: array(string()).optional(),
	groupAllowFrom: array(string()).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	rooms: record(string(), NextcloudTalkRoomSchema.optional()).optional(),
	/** Network policy overrides for self-hosted Nextcloud Talk on trusted private/internal hosts. */
	network: NextcloudTalkNetworkSchema,
	...ReplyRuntimeConfigSchemaShape
}).strict(), {
	optionalAccount: true,
	refine: (value, ctx) => {
		requireChannelOpenAllowFrom({
			channel: "nextcloud-talk",
			policy: value.dmPolicy,
			allowFrom: value.allowFrom,
			ctx,
			requireOpenAllowFrom
		});
	}
});
//#endregion
//#region extensions/nextcloud-talk/src/replay-migration-contract.ts
const NEXTCLOUD_TALK_PLUGIN_ID = "nextcloud-talk";
const NEXTCLOUD_TALK_REPLAY_DEDUPE_NAMESPACE_PREFIX = "replay-dedupe";
const NEXTCLOUD_TALK_REPLAY_DEDUPE_TTL_MS = 1440 * 60 * 1e3;
const NEXTCLOUD_TALK_REPLAY_DEDUPE_MAX_ENTRIES = 1e4;
//#endregion
//#region extensions/nextcloud-talk/src/doctor.ts
function sanitizeLegacyReplaySegment(value) {
	const trimmed = value.trim();
	if (!trimmed) return "default";
	return trimmed.replace(/[^a-zA-Z0-9_-]/g, "_");
}
async function collectNextcloudTalkBotResponseWarnings(params) {
	const warnings = [];
	for (const accountId of listNextcloudTalkAccountIds(params.cfg)) {
		const account = resolveNextcloudTalkAccount({
			cfg: params.cfg,
			accountId
		});
		if (!account.enabled || !account.secret || !account.baseUrl) continue;
		const result = await probeNextcloudTalkBotResponseFeature({
			account,
			timeoutMs: 5e3
		});
		if (result.code === "missing_response_feature" || result.code === "bot_not_found" || result.code === "api_error" || result.code === "request_failed") warnings.push(`- channels.nextcloud-talk.${account.accountId}: ${result.message}`);
	}
	return warnings;
}
async function repairNextcloudTalkReplayDedupeState(params) {
	const changes = [];
	const warnings = [];
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env, os.homedir);
	const replayDir = path.join(stateDir, "nextcloud-talk", "replay-dedupe");
	for (const accountId of listNextcloudTalkAccountIds(params.cfg)) {
		const legacyPath = path.join(replayDir, `${sanitizeLegacyReplaySegment(accountId)}.json`);
		if (!fileExists(legacyPath)) continue;
		try {
			const result = await migratePersistentDedupeLegacyJsonFile({
				filePath: legacyPath,
				namespace: accountId,
				ttlMs: NEXTCLOUD_TALK_REPLAY_DEDUPE_TTL_MS,
				memoryMaxSize: 0,
				pluginId: NEXTCLOUD_TALK_PLUGIN_ID,
				namespacePrefix: NEXTCLOUD_TALK_REPLAY_DEDUPE_NAMESPACE_PREFIX,
				stateMaxEntries: NEXTCLOUD_TALK_REPLAY_DEDUPE_MAX_ENTRIES,
				env
			});
			changes.push(`Migrated Nextcloud Talk replay dedupe cache for account "${accountId}" to SQLite (${result.imported} imported, ${result.skippedExpired} expired, ${result.skippedExisting} already current).`);
		} catch (error) {
			warnings.push(`Skipped Nextcloud Talk replay dedupe cache for account "${accountId}": ${String(error)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
const nextcloudTalkDoctor = {
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectPreviewWarnings: async ({ cfg }) => await collectNextcloudTalkBotResponseWarnings({ cfg }),
	repairConfig: async ({ cfg, env }) => {
		const repair = await repairNextcloudTalkReplayDedupeState({
			cfg,
			...env ? { env } : {}
		});
		return {
			config: cfg,
			changes: repair.changes,
			warnings: repair.warnings
		};
	}
};
//#endregion
//#region extensions/nextcloud-talk/src/policy.ts
function normalizeNextcloudTalkAllowEntry(raw) {
	return raw.trim().replace(/^(nextcloud-talk|nc-talk|nc):/i, "").toLowerCase();
}
function normalizeNextcloudTalkAllowlist(values) {
	return (values ?? []).map((value) => normalizeNextcloudTalkAllowEntry(String(value))).filter(Boolean);
}
function resolveNextcloudTalkAllowlistMatch(params) {
	return resolveAllowlistMatchByCandidates({
		allowList: normalizeNextcloudTalkAllowlist(params.allowFrom),
		candidates: [{
			value: normalizeNextcloudTalkAllowEntry(params.senderId),
			source: "id"
		}]
	});
}
function resolveNextcloudTalkRoomMatch(params) {
	const rooms = params.rooms ?? {};
	const allowlistConfigured = Object.keys(rooms).length > 0;
	const match = resolveChannelEntryMatchWithFallback({
		entries: rooms,
		keys: buildChannelKeyCandidates(params.roomToken),
		wildcardKey: "*",
		normalizeKey: normalizeChannelSlug
	});
	const roomConfig = match.entry;
	const allowed = !allowlistConfigured || Boolean(roomConfig);
	return {
		roomConfig,
		wildcardConfig: match.wildcardEntry,
		roomKey: match.matchKey ?? match.key,
		matchSource: match.matchSource,
		allowed,
		allowlistConfigured
	};
}
function resolveNextcloudTalkGroupToolPolicy(params) {
	const roomToken = params.groupId?.trim();
	if (!roomToken) return;
	const { tree, toolsPath } = buildNextcloudTalkRoomScope(resolveNextcloudTalkAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.rooms, roomToken);
	return resolveScopeToolsPolicy({
		tree,
		path: toolsPath
	});
}
function buildNextcloudTalkRoomScope(rooms, roomToken) {
	const { "*": defaults, ...scopes } = rooms ?? {};
	const tree = {
		defaults,
		scopes
	};
	const exactPath = Object.hasOwn(scopes, roomToken) ? [roomToken] : [];
	const toolsMatch = resolveChannelEntryMatchWithFallback({
		entries: scopes,
		keys: buildChannelKeyCandidates(roomToken),
		normalizeKey: normalizeChannelSlug
	});
	return {
		tree,
		exactPath,
		toolsPath: toolsMatch.matchKey ? [toolsMatch.matchKey] : []
	};
}
function resolveNextcloudTalkGroupRequireMention(params) {
	if (!params.groupId) return true;
	const { tree, exactPath } = buildNextcloudTalkRoomScope(resolveNextcloudTalkAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.rooms, params.groupId);
	return resolveScopeRequireMention({
		tree,
		path: exactPath
	});
}
//#endregion
//#region extensions/nextcloud-talk/src/room-info.ts
const ROOM_CACHE_TTL_MS = 300 * 1e3;
const ROOM_CACHE_ERROR_TTL_MS = 30 * 1e3;
const ROOM_CACHE_MAX_ENTRIES = 1e3;
const NEXTCLOUD_TALK_ROOM_INFO_TIMEOUT_MS = 3e4;
const roomCache = /* @__PURE__ */ new Map();
function resolveRoomCacheKey(params) {
	return `${params.accountId}:${params.roomToken}`;
}
function cacheRoomInfo(key, value) {
	roomCache.set(key, value);
	pruneMapToMaxSize(roomCache, ROOM_CACHE_MAX_ENTRIES);
}
function resolveRoomKindFromType(type) {
	if (!type) return;
	if (type === 1 || type === 5 || type === 6) return "direct";
	return "group";
}
async function resolveNextcloudTalkRoomKind(params) {
	const { account, roomToken, runtime } = params;
	const key = resolveRoomCacheKey({
		accountId: account.accountId,
		roomToken
	});
	const cached = roomCache.get(key);
	if (cached) {
		const age = Date.now() - cached.fetchedAt;
		if (cached.kind && age < ROOM_CACHE_TTL_MS) return cached.kind;
		if (cached.error && age < ROOM_CACHE_ERROR_TTL_MS) return;
	}
	const apiCredentials = resolveNextcloudTalkApiCredentials({
		apiUser: account.config.apiUser,
		apiPassword: account.config.apiPassword,
		apiPasswordFile: account.config.apiPasswordFile
	});
	if (!apiCredentials) return;
	const baseUrl = account.baseUrl?.trim();
	if (!baseUrl) return;
	const url = `${baseUrl}/ocs/v2.php/apps/spreed/api/v4/room/${roomToken}`;
	const auth = Buffer.from(`${apiCredentials.apiUser}:${apiCredentials.apiPassword}`, "utf-8").toString("base64");
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url,
			init: {
				method: "GET",
				headers: {
					Authorization: `Basic ${auth}`,
					"OCS-APIRequest": "true",
					Accept: "application/json"
				}
			},
			auditContext: "nextcloud-talk.room-info",
			policy: ssrfPolicyFromPrivateNetworkOptIn(account.config),
			timeoutMs: params.timeoutMs ?? NEXTCLOUD_TALK_ROOM_INFO_TIMEOUT_MS
		});
		try {
			if (!response.ok) {
				cacheRoomInfo(key, {
					fetchedAt: Date.now(),
					error: `status:${response.status}`
				});
				runtime?.log?.(`nextcloud-talk: room lookup failed (${response.status}) token=${roomToken}`);
				return;
			}
			const kind = resolveRoomKindFromType(parseStrictPositiveInteger((await readProviderJsonResponse(response, "Nextcloud Talk room info failed")).ocs?.data?.type));
			cacheRoomInfo(key, {
				fetchedAt: Date.now(),
				kind
			});
			return kind;
		} finally {
			await releaseNextcloudTalkGuardedResponse({
				response,
				release
			});
		}
	} catch (err) {
		cacheRoomInfo(key, {
			fetchedAt: Date.now(),
			error: formatErrorMessage(err)
		});
		runtime?.error?.(`nextcloud-talk: room lookup error: ${String(err)}`);
		return;
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/normalize.ts
function stripNextcloudTalkTargetPrefix(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	let normalized = trimmed;
	if (/^nextcloud-talk:/i.test(normalized)) normalized = normalized.slice(15).trim();
	else if (/^nc-talk:/i.test(normalized)) normalized = normalized.slice(8).trim();
	else if (/^nc:/i.test(normalized)) normalized = normalized.slice(3).trim();
	if (/^room:/i.test(normalized)) normalized = normalized.slice(5).trim();
	if (!normalized) return;
	return normalized;
}
function normalizeNextcloudTalkMessagingTarget(raw) {
	const normalized = stripNextcloudTalkTargetPrefix(raw);
	return normalized ? `nextcloud-talk:${normalized}`.toLowerCase() : void 0;
}
function looksLikeNextcloudTalkTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^(nextcloud-talk|nc-talk|nc|room):/i.test(trimmed)) return true;
	return /^[a-z0-9]{8,}$/i.test(trimmed);
}
//#endregion
//#region extensions/nextcloud-talk/src/send.ts
const NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_BYTES = 8 * 1024;
const NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_CHARS = 200;
const NEXTCLOUD_TALK_SEND_TIMEOUT_MS = 3e4;
const NEXTCLOUD_TALK_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	chunk: {
		limit: 4e3,
		unit: "chars",
		hardCap: 32e3
	}
});
function renderNextcloudTalkMarkdown(markdown) {
	return renderMarkdownWithMarkers({
		text: markdown,
		styles: [],
		links: []
	}, {
		styleMarkers: {},
		escapeText: (text) => text
	}, NEXTCLOUD_TALK_FORMAT_PROFILE);
}
/** Collapses whitespace and caps an error-body prefix to a short, log-safe snippet. */
function collapseErrorSnippet(text) {
	const collapsed = text.replace(/\s+/g, " ").trim();
	if (collapsed.length > NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_CHARS) return `${truncateUtf16Safe(collapsed, NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_CHARS)}…`;
	return collapsed;
}
/** Reads a bounded, collapsed error-body snippet without buffering hostile responses. */
async function readNextcloudTalkErrorSnippet(response) {
	try {
		return collapseErrorSnippet(await readResponseTextLimited(response, NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_BYTES));
	} catch {
		return "";
	}
}
function resolveCredentials(explicit, account) {
	const baseUrl = explicit.baseUrl?.trim() ?? account.baseUrl;
	const secret = explicit.secret?.trim() ?? account.secret;
	if (!baseUrl) throw new Error(`Nextcloud Talk baseUrl missing for account "${account.accountId}" (set channels.nextcloud-talk.baseUrl).`);
	if (!secret) throw new Error(`Nextcloud Talk bot secret missing for account "${account.accountId}" (set channels.nextcloud-talk.botSecret/botSecretFile or NEXTCLOUD_TALK_BOT_SECRET for default).`);
	return {
		baseUrl,
		secret
	};
}
function normalizeRoomToken(to) {
	const normalized = stripNextcloudTalkTargetPrefix(to);
	if (!normalized) throw new Error("Room token is required for Nextcloud Talk sends");
	return normalized;
}
function resolveNextcloudTalkSendContext(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Nextcloud Talk send");
	const account = resolveNextcloudTalkAccount({
		cfg,
		accountId: opts.accountId
	});
	const { baseUrl, secret } = resolveCredentials({
		baseUrl: opts.baseUrl,
		secret: opts.secret
	}, account);
	return {
		cfg,
		account,
		baseUrl,
		secret
	};
}
function recordNextcloudTalkOutboundActivity(accountId) {
	try {
		getNextcloudTalkRuntime().channel.activity.record({
			channel: "nextcloud-talk",
			accountId,
			direction: "outbound"
		});
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "Nextcloud Talk runtime not initialized") throw error;
	}
}
function createNextcloudTalkSendReceipt(params) {
	const messageId = params.messageId.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId && messageId !== "unknown" ? [{
			channel: "nextcloud-talk",
			messageId,
			conversationId: params.roomToken
		}] : [],
		kind: "text",
		...params.replyTo ? { replyToId: params.replyTo } : {}
	});
}
async function sendMessageNextcloudTalk(to, text, opts) {
	const { cfg, account, baseUrl, secret } = resolveNextcloudTalkSendContext(opts);
	const roomToken = normalizeRoomToken(to);
	if (!text?.trim()) throw new Error("Message must be non-empty for Nextcloud Talk sends");
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "nextcloud-talk",
		accountId: account.accountId
	});
	const message = convertMarkdownTables(renderNextcloudTalkMarkdown(text.trim()), tableMode);
	const body = { message };
	if (opts.replyTo) body.replyTo = opts.replyTo;
	const bodyStr = JSON.stringify(body);
	const { random, signature } = generateNextcloudTalkSignature({
		body: message,
		secret
	});
	const { response, release } = await fetchWithSsrFGuard({
		url: `${baseUrl}/ocs/v2.php/apps/spreed/api/v1/bot/${roomToken}/message`,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"OCS-APIRequest": "true",
				"X-Nextcloud-Talk-Bot-Random": random,
				"X-Nextcloud-Talk-Bot-Signature": signature
			},
			body: bodyStr
		},
		auditContext: "nextcloud-talk-send",
		policy: ssrfPolicyFromPrivateNetworkOptIn(account.config),
		timeoutMs: opts.timeoutMs ?? NEXTCLOUD_TALK_SEND_TIMEOUT_MS
	});
	try {
		if (!response.ok) {
			const errorBody = await readNextcloudTalkErrorSnippet(response);
			const status = response.status;
			let errorMsg = `Nextcloud Talk send failed (${status})`;
			if (status === 400) errorMsg = `Nextcloud Talk: bad request - ${errorBody || "invalid message format"}`;
			else if (status === 401) errorMsg = "Nextcloud Talk: bot send was rejected - check the bot secret and ensure the bot was installed with --feature response";
			else if (status === 403) errorMsg = "Nextcloud Talk: forbidden - bot may not have permission in this room";
			else if (status === 404) errorMsg = `Nextcloud Talk: room not found (token=${roomToken})`;
			else if (errorBody) errorMsg = `Nextcloud Talk send failed: ${errorBody}`;
			throw new Error(errorMsg);
		}
		let messageId = "unknown";
		let timestamp;
		try {
			const data = await readProviderJsonResponse(response, "Nextcloud Talk send");
			if (data.ocs?.data?.id != null) messageId = String(data.ocs.data.id);
			if (typeof data.ocs?.data?.timestamp === "number") timestamp = data.ocs.data.timestamp;
		} catch {}
		if (opts.verbose) console.log(`[nextcloud-talk] Sent message ${messageId} to room ${roomToken}`);
		recordNextcloudTalkOutboundActivity(account.accountId);
		return {
			messageId,
			roomToken,
			receipt: createNextcloudTalkSendReceipt({
				messageId,
				roomToken,
				...opts.replyTo ? { replyTo: opts.replyTo } : {}
			}),
			timestamp
		};
	} finally {
		await releaseNextcloudTalkGuardedResponse({
			response,
			release
		});
	}
}
async function sendReactionNextcloudTalk(roomToken, messageId, reaction, opts) {
	const { account, baseUrl, secret } = resolveNextcloudTalkSendContext(opts);
	const normalizedToken = normalizeRoomToken(roomToken);
	const body = JSON.stringify({ reaction });
	const { random, signature } = generateNextcloudTalkSignature({
		body: reaction,
		secret
	});
	const { response, release } = await fetchWithSsrFGuard({
		url: `${baseUrl}/ocs/v2.php/apps/spreed/api/v1/bot/${normalizedToken}/reaction/${messageId}`,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"OCS-APIRequest": "true",
				"X-Nextcloud-Talk-Bot-Random": random,
				"X-Nextcloud-Talk-Bot-Signature": signature
			},
			body
		},
		auditContext: "nextcloud-talk-reaction",
		policy: ssrfPolicyFromPrivateNetworkOptIn(account.config),
		timeoutMs: opts.timeoutMs ?? NEXTCLOUD_TALK_SEND_TIMEOUT_MS
	});
	try {
		if (!response.ok) {
			const errorBody = await readNextcloudTalkErrorSnippet(response);
			throw new Error(`Nextcloud Talk reaction failed: ${response.status} ${errorBody}`.trim());
		}
		return { ok: true };
	} finally {
		await releaseNextcloudTalkGuardedResponse({
			response,
			release
		});
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/inbound.ts
const CHANNEL_ID = "nextcloud-talk";
function hasAllowEntries(entries) {
	return normalizeNextcloudTalkAllowlist(entries).length > 0;
}
function roomRoutes(params) {
	if (!params.isGroup) return [];
	const roomSenderConfigured = params.groupPolicy === "allowlist" && hasAllowEntries(params.roomAllowFrom);
	return channelIngressRoutes(params.roomMatch.allowlistConfigured && {
		id: "nextcloud-talk:room",
		allowed: params.roomMatch.allowed,
		precedence: 0,
		matchId: "nextcloud-talk-room",
		blockReason: "room_not_allowlisted"
	}, params.roomConfig?.enabled === false && {
		id: "nextcloud-talk:room-enabled",
		enabled: false,
		precedence: 10,
		blockReason: "room_disabled"
	}, roomSenderConfigured && {
		id: "nextcloud-talk:room-sender",
		kind: "nestedAllowlist",
		precedence: 20,
		blockReason: "room_sender_not_allowlisted",
		...!hasAllowEntries(params.outerGroupAllowFrom) ? {
			senderPolicy: "replace",
			senderAllowFrom: params.roomAllowFrom
		} : {
			allowed: resolveNextcloudTalkAllowlistMatch({
				allowFrom: params.roomAllowFrom,
				senderId: params.senderId
			}).allowed,
			matchId: "nextcloud-talk-room-sender"
		}
	});
}
async function deliverNextcloudTalkReply(params) {
	const { cfg, payload, roomToken, accountId, statusSink } = params;
	return { visibleReplySent: await deliverFormattedTextWithAttachments({
		payload,
		send: async ({ text, replyToId }) => {
			await sendMessageNextcloudTalk(roomToken, text, {
				cfg,
				accountId,
				replyTo: replyToId
			});
			statusSink?.({ lastOutboundAt: Date.now() });
		}
	}) };
}
async function handleNextcloudTalkInbound(params) {
	const { message, account, config, runtime, statusSink } = params;
	const core = getNextcloudTalkRuntime();
	const pairing = createChannelPairingController({
		core,
		channel: CHANNEL_ID,
		accountId: account.accountId
	});
	const rawBody = message.text?.trim() ?? "";
	if (!rawBody) return;
	const roomKind = await resolveNextcloudTalkRoomKind({
		account,
		roomToken: message.roomToken,
		runtime
	});
	const isGroup = roomKind === "direct" ? false : roomKind === "group" ? true : message.isGroupChat;
	const senderId = message.senderId;
	const senderName = message.senderName;
	const roomToken = message.roomToken;
	const roomName = message.roomName;
	statusSink?.({ lastInboundAt: message.timestamp });
	const roomMatch = resolveNextcloudTalkRoomMatch({
		rooms: account.config.rooms,
		roomToken
	});
	const roomConfig = roomMatch.roomConfig;
	const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
		cfg: config,
		surface: CHANNEL_ID
	});
	const hasControlCommand = core.channel.text.hasControlCommand(rawBody, config);
	const shouldRequireMention = isGroup ? resolveNextcloudTalkGroupRequireMention({
		cfg: config,
		accountId: account.accountId,
		groupId: roomToken
	}) : false;
	const { groupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: (config.channels?.[CHANNEL_ID] ?? void 0) !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(config)
	});
	const allowFrom = normalizeStringEntries(account.config.allowFrom);
	const outerGroupAllowFrom = account.config.groupAllowFrom?.length ? normalizeStringEntries(account.config.groupAllowFrom) : allowFrom;
	const roomAllowFrom = normalizeStringEntries(roomConfig?.allowFrom);
	const resolveAccess = async (wasMentioned, contextBinding) => await resolveStableChannelMessageIngress({
		channelId: CHANNEL_ID,
		accountId: account.accountId,
		identity: {
			key: "nextcloud-talk-user-id",
			normalize: (value) => normalizeNextcloudTalkAllowEntry(value) || null,
			sensitivity: "pii",
			entryIdPrefix: "nextcloud-talk-entry"
		},
		cfg: config,
		readStoreAllowFrom: async () => await pairing.readStoreForDmPolicy(CHANNEL_ID, account.accountId),
		subject: { stableId: senderId },
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: isGroup ? roomToken : senderId
		},
		contextBinding,
		route: roomRoutes({
			isGroup,
			groupPolicy,
			roomMatch,
			roomConfig,
			senderId,
			outerGroupAllowFrom,
			roomAllowFrom
		}),
		dmPolicy: account.config.dmPolicy ?? "pairing",
		groupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: true,
			activation: {
				requireMention: isGroup && shouldRequireMention,
				allowTextCommands
			}
		},
		mentionFacts: isGroup && wasMentioned !== void 0 ? {
			canDetectMention: true,
			wasMentioned,
			hasAnyMention: wasMentioned
		} : void 0,
		allowFrom,
		groupAllowFrom: account.config.groupAllowFrom,
		command: {
			allowTextCommands,
			hasControlCommand
		}
	});
	let access = await resolveAccess();
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "nextcloud-talk",
		accountId: account.accountId,
		blockedLabel: GROUP_POLICY_BLOCKED_LABEL.room,
		log: (messageValue) => runtime.log?.(messageValue)
	});
	const commandAuthorized = access.commandAccess.authorized;
	const accessReason = access.ingress.reasonCode === "route_blocked" ? "route blocked" : access.senderAccess.reasonCode;
	if (isGroup) {
		if (access.routeAccess.reason === "room_not_allowlisted") {
			runtime.log?.(`nextcloud-talk: drop room ${roomToken} (not allowlisted)`);
			return;
		}
		if (access.routeAccess.reason === "room_disabled") {
			runtime.log?.(`nextcloud-talk: drop room ${roomToken} (disabled)`);
			return;
		}
		if (access.routeAccess.reason === "room_sender_not_allowlisted") {
			runtime.log?.(`nextcloud-talk: drop group sender ${senderId} (policy=${groupPolicy})`);
			return;
		}
		if (access.senderAccess.decision !== "allow") {
			runtime.log?.(`nextcloud-talk: drop group sender ${senderId} (reason=${accessReason})`);
			return;
		}
	} else if (access.senderAccess.decision !== "allow") {
		if (access.senderAccess.decision === "pairing") await pairing.issueChallenge({
			senderId,
			senderIdLine: `Your Nextcloud user id: ${senderId}`,
			meta: { name: senderName || void 0 },
			sendPairingReply: async (text) => {
				await sendMessageNextcloudTalk(roomToken, text, {
					cfg: config,
					accountId: account.accountId
				});
				statusSink?.({ lastOutboundAt: Date.now() });
			},
			onReplyError: (err) => {
				runtime.error?.(`nextcloud-talk: pairing reply failed for ${senderId}: ${String(err)}`);
			}
		});
		runtime.log?.(`nextcloud-talk: drop DM sender ${senderId} (reason=${accessReason})`);
		return;
	}
	if (access.commandAccess.shouldBlockControlCommand) {
		logInboundDrop({
			log: (messageLocal) => runtime.log?.(messageLocal),
			channel: CHANNEL_ID,
			reason: "control command (unauthorized)",
			target: senderId
		});
		return;
	}
	const mentionRegexes = core.channel.mentions.buildMentionRegexes(config);
	const wasMentioned = mentionRegexes.length ? core.channel.mentions.matchesMentionPatterns(rawBody, mentionRegexes) : false;
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg: config,
		channel: CHANNEL_ID,
		accountId: account.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: isGroup ? roomToken : senderId
		}
	});
	access = await resolveAccess(isGroup ? wasMentioned : void 0, {
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		messageId: message.messageId,
		inboundEventKind: "user_request"
	});
	if (access.ingress.admission !== "dispatch") {
		runtime.log?.(isGroup && access.activationAccess.shouldSkip ? `nextcloud-talk: drop room ${roomToken} (no mention)` : `nextcloud-talk: drop ${isGroup ? "room" : "DM"} ${roomToken} (authorization changed)`);
		return;
	}
	const fromLabel = isGroup ? `room:${roomName || roomToken}` : senderName || `user:${senderId}`;
	const body = buildEnvelope({
		channel: "Nextcloud Talk",
		from: fromLabel,
		timestamp: message.timestamp,
		body: rawBody
	});
	const groupSystemPrompt = normalizeOptionalString(roomConfig?.systemPrompt);
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(account.config);
	const ctxPayload = core.channel.inbound.buildContext({
		channelIngress: access,
		channel: CHANNEL_ID,
		accountId: route.accountId,
		messageId: message.messageId,
		timestamp: message.timestamp,
		from: isGroup ? `nextcloud-talk:room:${roomToken}` : `nextcloud-talk:${senderId}`,
		sender: {
			id: senderId,
			name: senderName || void 0
		},
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: isGroup ? roomToken : senderId,
			label: fromLabel
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: {
			to: `nextcloud-talk:${roomToken}`,
			originatingTo: `nextcloud-talk:${roomToken}`
		},
		message: {
			body,
			bodyForAgent: rawBody,
			rawBody,
			commandBody: rawBody
		},
		access: {
			commands: { authorized: commandAuthorized },
			mentions: {
				canDetectMention: isGroup,
				wasMentioned: isGroup && wasMentioned
			}
		},
		extra: {
			GroupSubject: isGroup ? roomName || roomToken : void 0,
			GroupSystemPrompt: isGroup ? groupSystemPrompt : void 0
		}
	});
	await core.channel.inbound.dispatch({
		cfg: config,
		channel: CHANNEL_ID,
		accountId: account.accountId,
		route: {
			agentId: route.agentId,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		delivery: {
			preparePayload: (payload) => payload.text === void 0 ? payload : {
				...payload,
				text: sanitizeAssistantVisibleText(payload.text)
			},
			deliver: async (payload) => {
				return await deliverNextcloudTalkReply({
					cfg: config,
					payload,
					roomToken,
					accountId: account.accountId,
					statusSink
				});
			},
			onError: (err, info) => {
				runtime.error?.(`nextcloud-talk ${info.kind} reply failed: ${String(err)}`);
			}
		},
		replyPipeline: {},
		replyOptions: {
			...params.turnAdoptionLifecycle ? bindIngressLifecycleToReplyOptions(params.turnAdoptionLifecycle) : {},
			skillFilter: roomConfig?.skills,
			disableBlockStreaming: typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : void 0
		},
		record: { onRecordError: (err) => {
			runtime.error?.(`nextcloud-talk: failed updating session meta: ${String(err)}`);
		} }
	});
}
var NextcloudTalkWebhookPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "NextcloudTalkWebhookPayloadError";
	}
};
function parseRawObject(rawEvent) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new NextcloudTalkWebhookPayloadError("Nextcloud Talk webhook contains invalid JSON.", { cause: error });
	}
	if (!isRecord(parsed)) throw new NextcloudTalkWebhookPayloadError("Nextcloud Talk webhook must be a JSON object.");
	return parsed;
}
function requiredString(value, field) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk webhook is missing ${field}.`);
}
function inspectNextcloudTalkWebhookEnvelope(rawEvent) {
	const envelope = parseRawObject(rawEvent);
	if (envelope.type !== "Create") return null;
	const object = isRecord(envelope.object) ? envelope.object : null;
	if (object?.type !== void 0 && object.type !== "Note") return null;
	if (!object) throw new NextcloudTalkWebhookPayloadError("Nextcloud Talk webhook is missing object.");
	const target = isRecord(envelope.target) ? envelope.target : null;
	return {
		eventId: requiredString(object.id, "object.id"),
		laneKey: `room:${requiredString(target?.id, "target.id")}`
	};
}
function parseLegacyReplayKey(key) {
	const separator = key.lastIndexOf(":");
	const roomId = key.slice(0, separator).trim();
	const messageId = key.slice(separator + 1).trim();
	return separator > 0 && roomId && messageId ? {
		messageId,
		roomId
	} : null;
}
/** Convert the shipped replay guard's live window into durable completion tombstones. */
async function migrateNextcloudTalkLegacyReplayState(params) {
	const entries = await params.store.entries();
	let migrated = 0;
	for (const entry of entries) {
		const identity = parseLegacyReplayKey(entry.value.key);
		if (!identity || !Number.isFinite(entry.value.seenAt)) continue;
		const marker = {
			version: 1,
			receivedAt: entry.value.seenAt,
			rawEvent: ""
		};
		const result = await params.queue.enqueue(identity.messageId, marker, {
			receivedAt: entry.value.seenAt,
			laneKey: `room:${identity.roomId}`
		});
		if (result.kind === "accepted" || result.kind === "pending" && result.record.payload.rawEvent === "") {
			if (!await params.queue.complete(identity.messageId, { completedAt: entry.value.seenAt })) throw new Error(`Failed to migrate Nextcloud Talk replay key ${entry.value.key}.`);
		}
		migrated += 1;
	}
	await params.store.clear();
	return migrated;
}
//#endregion
//#region extensions/nextcloud-talk/src/monitor.ts
const DEFAULT_WEBHOOK_MAX_BODY_BYTES = 1024 * 1024;
const PREAUTH_WEBHOOK_MAX_BODY_BYTES = 64 * 1024;
const NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_VALUE = "durable";
const PREAUTH_WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const HEALTH_PATH = "/healthz";
const WEBHOOK_AUTH_RATE_LIMIT_SCOPE = "nextcloud-talk-webhook-auth";
const WEBHOOK_ERRORS = {
	missingSignatureHeaders: "Missing signature headers",
	invalidBackend: "Invalid backend",
	invalidSignature: "Invalid signature",
	invalidPayloadFormat: "Invalid payload format",
	payloadTooLarge: "Payload too large",
	internalServerError: "Internal server error"
};
function writeJsonResponse(res, status, body) {
	if (body) {
		res.writeHead(status, { "Content-Type": "application/json" });
		res.end(JSON.stringify(body));
		return;
	}
	res.writeHead(status);
	res.end();
}
function writeWebhookError(res, status, error) {
	if (res.headersSent) return;
	writeJsonResponse(res, status, { error });
}
function validateWebhookHeaders(params) {
	const headers = extractNextcloudTalkHeaders(params.req.headers);
	if (!headers) {
		writeWebhookError(params.res, 400, WEBHOOK_ERRORS.missingSignatureHeaders);
		return null;
	}
	if (params.isBackendAllowed && !params.isBackendAllowed(headers.backend)) {
		writeWebhookError(params.res, 401, WEBHOOK_ERRORS.invalidBackend);
		return null;
	}
	return headers;
}
function verifyWebhookSignature(params) {
	if (!verifyNextcloudTalkSignature({
		signature: params.headers.signature,
		random: params.headers.random,
		body: params.body,
		secret: params.secret
	})) {
		params.authRateLimiter.recordFailure(params.clientIp, WEBHOOK_AUTH_RATE_LIMIT_SCOPE);
		writeWebhookError(params.res, 401, WEBHOOK_ERRORS.invalidSignature);
		return false;
	}
	params.authRateLimiter.reset(params.clientIp, WEBHOOK_AUTH_RATE_LIMIT_SCOPE);
	return true;
}
function readNextcloudTalkWebhookBody(req, maxBodyBytes) {
	return readRequestBodyWithLimit(req, {
		maxBytes: Math.min(maxBodyBytes, PREAUTH_WEBHOOK_MAX_BODY_BYTES),
		timeoutMs: PREAUTH_WEBHOOK_BODY_TIMEOUT_MS
	});
}
function createNextcloudTalkWebhookServer(opts) {
	const { port, host, path, secret, onWebhook, onError, abortSignal } = opts;
	const maxBodyBytes = typeof opts.maxBodyBytes === "number" && Number.isFinite(opts.maxBodyBytes) && opts.maxBodyBytes > 0 ? Math.floor(opts.maxBodyBytes) : DEFAULT_WEBHOOK_MAX_BODY_BYTES;
	const readBody = opts.readBody ?? readNextcloudTalkWebhookBody;
	const isBackendAllowed = opts.isBackendAllowed;
	const authRateLimitMaxRequests = typeof opts.authRateLimit?.maxRequests === "number" ? opts.authRateLimit.maxRequests : WEBHOOK_RATE_LIMIT_DEFAULTS.maxRequests;
	const authRateLimitWindowMs = typeof opts.authRateLimit?.windowMs === "number" ? opts.authRateLimit.windowMs : WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs;
	const webhookAuthRateLimiter = createAuthRateLimiter({
		maxAttempts: authRateLimitMaxRequests,
		windowMs: authRateLimitWindowMs,
		lockoutMs: authRateLimitWindowMs,
		exemptLoopback: false,
		pruneIntervalMs: authRateLimitWindowMs
	});
	const server = createServer((req, res) => {
		(async () => {
			if (req.url === HEALTH_PATH) {
				res.writeHead(200, { "Content-Type": "text/plain" });
				res.end("ok");
				return;
			}
			if (req.url !== path || req.method !== "POST") {
				res.writeHead(404);
				res.end();
				return;
			}
			const clientIp = req.socket.remoteAddress ?? "unknown";
			if (!webhookAuthRateLimiter.check(clientIp, WEBHOOK_AUTH_RATE_LIMIT_SCOPE).allowed) {
				res.writeHead(429);
				res.end("Too Many Requests");
				return;
			}
			try {
				const headers = validateWebhookHeaders({
					req,
					res,
					isBackendAllowed
				});
				if (!headers) return;
				const body = await readBody(req, maxBodyBytes);
				if (!verifyWebhookSignature({
					headers,
					body,
					secret,
					res,
					clientIp,
					authRateLimiter: webhookAuthRateLimiter
				})) return;
				if (await onWebhook(body) === "accepted") res.setHeader(NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_HEADER, NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_VALUE);
				writeJsonResponse(res, 200);
			} catch (err) {
				if (isRequestBodyLimitError(err, "PAYLOAD_TOO_LARGE")) {
					writeWebhookError(res, 413, WEBHOOK_ERRORS.payloadTooLarge);
					return;
				}
				if (isRequestBodyLimitError(err, "REQUEST_BODY_TIMEOUT")) {
					writeWebhookError(res, 408, requestBodyErrorToText("REQUEST_BODY_TIMEOUT"));
					return;
				}
				if (err instanceof NextcloudTalkWebhookPayloadError) {
					writeWebhookError(res, 400, WEBHOOK_ERRORS.invalidPayloadFormat);
					return;
				}
				const error = err instanceof Error ? err : new Error(formatErrorMessage(err));
				onError?.(error);
				writeWebhookError(res, 500, WEBHOOK_ERRORS.internalServerError);
			}
		})();
	});
	let stopRequested = false;
	let closePromise;
	const closeIfListening = () => {
		if (closePromise) return closePromise;
		if (!server.listening) return Promise.resolve();
		closePromise = new Promise((resolve) => {
			server.close(() => resolve());
		}).finally(() => {
			closePromise = void 0;
		});
		return closePromise;
	};
	const stop = async () => {
		stopRequested = true;
		await closeIfListening();
	};
	const start = () => {
		if (stopRequested) return Promise.resolve();
		return new Promise((resolve, reject) => {
			const onListenError = (error) => reject(error);
			server.once("error", onListenError);
			server.listen(port, host, () => {
				server.off("error", onListenError);
				(async () => {
					if (stopRequested) await closeIfListening();
					resolve();
				})().catch(reject);
			});
		});
	};
	if (abortSignal) if (abortSignal.aborted) stop();
	else abortSignal.addEventListener("abort", () => void stop(), { once: true });
	return {
		server,
		start,
		stop
	};
}
//#endregion
//#region extensions/nextcloud-talk/src/webhook-spool.ts
const NEXTCLOUD_TALK_INGRESS_POLL_INTERVAL_MS = 500;
const NextcloudTalkWebhookPayloadSchema = object({
	type: _enum([
		"Create",
		"Update",
		"Delete"
	]),
	actor: object({
		type: literal("Person"),
		id: string().min(1),
		name: string()
	}),
	object: object({
		type: literal("Note"),
		id: string().min(1),
		name: string(),
		content: string(),
		mediaType: string()
	}),
	target: object({
		type: literal("Collection"),
		id: string().min(1),
		name: string()
	})
});
function parseClaimedMessage(payload, claimedId, claimedLaneKey) {
	if (payload.version !== 1) throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk ingress row ${claimedId} has an unsupported version.`);
	const result = NextcloudTalkWebhookPayloadSchema.safeParse(parseRawObject(payload.rawEvent));
	if (!result.success || result.data.type !== "Create" || result.data.object.id !== claimedId) throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk ingress row ${claimedId} has invalid message identity.`);
	const webhook = result.data;
	const roomId = requiredString(webhook.target.id, "target.id");
	if (claimedLaneKey !== `room:${roomId}`) throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk ingress row ${claimedId} changed room identity.`);
	return {
		messageId: webhook.object.id,
		roomToken: roomId,
		roomName: webhook.target.name,
		senderId: webhook.actor.id,
		senderName: webhook.actor.name,
		text: webhook.object.content || webhook.object.name,
		mediaType: webhook.object.mediaType || "text/plain",
		timestamp: payload.receivedAt,
		isGroupChat: true
	};
}
function resolveNonRetryableFailure(error) {
	if (error instanceof NextcloudTalkWebhookPayloadError) return {
		reason: "invalid-event",
		message: error.message
	};
	const message = formatErrorMessage(error);
	if (message.includes("Nextcloud Talk: bot send was rejected") || message.includes("Nextcloud Talk: forbidden")) return {
		reason: "nextcloud-talk-auth",
		message
	};
	return null;
}
function createNextcloudTalkWebhookSpool(options) {
	let queue = options.queue;
	const getQueue = () => {
		queue ??= getNextcloudTalkRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
		return queue;
	};
	const legacyReplayStore = options.legacyReplayStore === null ? null : options.legacyReplayStore ?? getNextcloudTalkRuntime().state.openKeyedStore({
		namespace: resolvePersistentDedupePluginStateNamespace({
			namespace: options.accountId,
			namespacePrefix: "replay-dedupe"
		}),
		maxEntries: 1e4,
		defaultTtlMs: 864e5
	});
	const legacyMigration = legacyReplayStore ? migrateNextcloudTalkLegacyReplayState({
		queue: getQueue(),
		store: legacyReplayStore
	}) : Promise.resolve();
	const monitor = createChannelIngressMonitor({
		queue: getQueue,
		inspect: (rawEvent) => inspectNextcloudTalkWebhookEnvelope(rawEvent),
		payload: {
			version: 1,
			serialize: (rawEvent, { receivedAt }) => ({
				receivedAt,
				rawEvent
			}),
			deserialize: (body) => body.rawEvent,
			encode: ({ body }) => ({
				version: 1,
				...body
			}),
			decode: (payload) => ({
				version: payload.version,
				body: {
					receivedAt: payload.receivedAt,
					rawEvent: payload.rawEvent
				}
			}),
			createClaimError: (kind, claim) => new NextcloudTalkWebhookPayloadError(kind === "invalid-version" ? `Nextcloud Talk ingress row ${claim.id} has an unsupported version.` : `Nextcloud Talk ingress row ${claim.id} has invalid message identity.`)
		},
		deliver: async (_rawEvent, lifecycle, claim) => {
			const message = parseClaimedMessage(claim.payload, claim.id, claim.laneKey);
			await options.deliver(message, lifecycle);
		},
		pollIntervalMs: options.pollIntervalMs ?? NEXTCLOUD_TALK_INGRESS_POLL_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e4,
			failedMaxEntries: 1e4
		},
		drain: {
			startLimit: 32,
			resolveNonRetryableFailure,
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			onLog: (message) => options.runtime.log?.(`nextcloud-talk ${message}`)
		},
		...options.abortSignal ? { abortSignal: options.abortSignal } : {},
		createStoppedError: () => /* @__PURE__ */ new Error("Nextcloud Talk ingress stopped"),
		onError: (error) => options.runtime.error?.(`nextcloud-talk ingress drain failed: ${formatErrorMessage(error)}`)
	});
	let stopping = false;
	const inFlightReceives = /* @__PURE__ */ new Set();
	const startAfterMigration = legacyMigration.then(() => {
		if (!stopping) monitor.start();
	});
	return {
		ready: async () => await startAfterMigration,
		receive: (rawEvent) => {
			if (stopping) return Promise.reject(/* @__PURE__ */ new Error("Nextcloud Talk ingress stopped"));
			const receiveTask = (async () => {
				await startAfterMigration;
				return (await monitor.admit(rawEvent)).kind === "ignored" ? "ignored" : "accepted";
			})();
			inFlightReceives.add(receiveTask);
			receiveTask.then(() => inFlightReceives.delete(receiveTask), () => inFlightReceives.delete(receiveTask));
			return receiveTask;
		},
		stop: async () => {
			stopping = true;
			const pendingReceives = [...inFlightReceives];
			const pauseTask = monitor.pause();
			await startAfterMigration.catch(() => void 0);
			await Promise.allSettled(pendingReceives);
			await monitor.stop();
			await pauseTask;
		},
		waitForIdle: async () => {
			await startAfterMigration.catch(() => void 0);
			await monitor.waitForIdle();
		}
	};
}
//#endregion
//#region extensions/nextcloud-talk/src/monitor-runtime.ts
const DEFAULT_WEBHOOK_PORT = 8788;
const DEFAULT_WEBHOOK_HOST = "0.0.0.0";
const DEFAULT_WEBHOOK_PATH = "/nextcloud-talk-webhook";
function normalizeOrigin(value) {
	try {
		return normalizeLowercaseStringOrEmpty(new URL(value).origin);
	} catch {
		return null;
	}
}
async function monitorNextcloudTalkProvider(opts) {
	const core = getNextcloudTalkRuntime();
	const cfg = opts.config ?? core.config.current();
	const account = resolveNextcloudTalkAccount({
		cfg,
		accountId: opts.accountId
	});
	const runtime = resolveLoggerBackedRuntime(opts.runtime, core.logging.getChildLogger());
	if (!account.secret) throw new Error(`Nextcloud Talk bot secret not configured for account "${account.accountId}"`);
	const port = account.config.webhookPort ?? DEFAULT_WEBHOOK_PORT;
	const host = account.config.webhookHost ?? DEFAULT_WEBHOOK_HOST;
	const path = account.config.webhookPath ?? DEFAULT_WEBHOOK_PATH;
	const logger = core.logging.getChildLogger({
		channel: "nextcloud-talk",
		accountId: account.accountId
	});
	const expectedBackendOrigin = normalizeOrigin(account.baseUrl);
	const spool = (opts.createSpool ?? createNextcloudTalkWebhookSpool)({
		accountId: account.accountId,
		runtime,
		abortSignal: opts.abortSignal,
		deliver: async (message, lifecycle) => {
			core.channel.activity.record({
				channel: "nextcloud-talk",
				accountId: account.accountId,
				direction: "inbound",
				at: message.timestamp
			});
			if (opts.onMessage) await opts.onMessage(message, lifecycle);
			else await handleNextcloudTalkInbound({
				message,
				account,
				config: cfg,
				runtime,
				statusSink: opts.statusSink,
				turnAdoptionLifecycle: lifecycle
			});
		}
	});
	const server = (opts.createServer ?? createNextcloudTalkWebhookServer)({
		port,
		host,
		path,
		secret: account.secret,
		isBackendAllowed: (backend) => {
			if (!expectedBackendOrigin) return true;
			return normalizeOrigin(backend) === expectedBackendOrigin;
		},
		onWebhook: spool.receive,
		onError: (error) => {
			logger.error(`[nextcloud-talk:${account.accountId}] webhook error: ${error.message}`);
		},
		abortSignal: opts.abortSignal
	});
	let stopPromise;
	const stop = () => {
		stopPromise ??= (async () => {
			await server.stop();
			await spool.stop();
		})();
		return stopPromise;
	};
	if (opts.abortSignal && !opts.abortSignal.aborted) opts.abortSignal.addEventListener("abort", () => void stop(), { once: true });
	if (opts.abortSignal?.aborted) {
		await stop();
		return { stop };
	}
	try {
		await spool.ready();
		await server.start();
	} catch (error) {
		await stop();
		throw error;
	}
	if (opts.abortSignal?.aborted) {
		await stop();
		return { stop };
	}
	opts.statusSink?.(channelReadyPatch());
	const publicUrl = account.config.webhookPublicUrl ?? `http://${host === "0.0.0.0" ? "localhost" : host}:${port}${path}`;
	logger.info(`[nextcloud-talk:${account.accountId}] webhook listening on ${publicUrl}`);
	return { stop };
}
//#endregion
//#region extensions/nextcloud-talk/src/gateway.ts
const nextcloudTalkGatewayAdapter = {
	startAccount: async (ctx) => {
		const account = ctx.account;
		if (!account.secret || !account.baseUrl) throw new Error(`Nextcloud Talk not configured for account "${account.accountId}" (missing secret or baseUrl)`);
		ctx.log?.info(`[${account.accountId}] starting Nextcloud Talk webhook server`);
		const statusSink = createAccountStatusSink({
			accountId: ctx.accountId,
			setStatus: ctx.setStatus
		});
		await runPassiveAccountLifecycle({
			abortSignal: ctx.abortSignal,
			start: async () => await monitorNextcloudTalkProvider({
				accountId: account.accountId,
				config: ctx.cfg,
				runtime: ctx.runtime,
				abortSignal: ctx.abortSignal,
				statusSink
			}),
			stop: async (monitor) => {
				await monitor.stop();
			}
		});
	},
	logoutAccount: async ({ accountId, cfg }) => {
		const nextCfg = { ...cfg };
		const nextSection = cfg.channels?.["nextcloud-talk"] ? { ...cfg.channels["nextcloud-talk"] } : void 0;
		let cleared = false;
		let changed = false;
		if (nextSection) {
			if (accountId === "default" && nextSection.botSecret) {
				delete nextSection.botSecret;
				cleared = true;
				changed = true;
			}
			const accountCleanup = clearAccountEntryFields({
				accounts: nextSection.accounts,
				accountId,
				fields: ["botSecret"]
			});
			if (accountCleanup.changed) {
				changed = true;
				if (accountCleanup.cleared) cleared = true;
				if (accountCleanup.nextAccounts) nextSection.accounts = accountCleanup.nextAccounts;
				else delete nextSection.accounts;
			}
		}
		if (changed) if (nextSection && Object.keys(nextSection).length > 0) nextCfg.channels = {
			...nextCfg.channels,
			"nextcloud-talk": nextSection
		};
		else {
			const nextChannels = { ...nextCfg.channels };
			delete nextChannels["nextcloud-talk"];
			if (Object.keys(nextChannels).length > 0) nextCfg.channels = nextChannels;
			else delete nextCfg.channels;
		}
		const loggedOut = resolveNextcloudTalkAccount({
			cfg: changed ? nextCfg : cfg,
			accountId
		}).secretSource === "none";
		if (changed) await getNextcloudTalkRuntime().config.replaceConfigFile({
			nextConfig: nextCfg,
			afterWrite: { mode: "auto" }
		});
		return {
			cleared,
			envSecret: Boolean(process.env.NEXTCLOUD_TALK_BOT_SECRET?.trim()),
			loggedOut
		};
	}
};
//#endregion
//#region extensions/nextcloud-talk/src/message-actions.ts
const providerId = "nextcloud-talk";
function isAccountConfigured(account) {
	return Boolean(account.enabled && account.secret?.trim() && account.baseUrl?.trim());
}
function hasConfiguredAccount(cfg, accountId) {
	if (accountId) return isAccountConfigured(resolveNextcloudTalkAccount({
		cfg,
		accountId
	}));
	return listNextcloudTalkAccountIds(cfg).map((id) => resolveNextcloudTalkAccount({
		cfg,
		accountId: id
	})).some(isAccountConfigured);
}
const nextcloudTalkMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		if (!hasConfiguredAccount(cfg, accountId)) return null;
		return { actions: ["send", "react"] };
	},
	supportsAction: ({ action }) => action === "react",
	handleAction: async ({ action, params, cfg, accountId, toolContext }) => {
		if (action === "send") throw new Error("Send should be handled by outbound, not actions handler.");
		if (action === "react") {
			const account = resolveNextcloudTalkAccount({
				cfg,
				accountId
			});
			if (!isAccountConfigured(account)) throw new Error(`Nextcloud Talk account "${account.accountId}" is disabled or not configured.`);
			const target = readToolStringParam(params, "to", {
				required: true,
				label: "to (room token)"
			});
			const messageIdRaw = resolveReactionMessageId({
				args: params,
				toolContext
			});
			if (messageIdRaw == null) throw new Error("messageId required");
			const messageId = String(messageIdRaw);
			const emoji = readToolStringParam(params, "emoji", { required: true });
			if (params.remove === true) throw new Error("Nextcloud Talk reaction removal is not supported yet; only adding reactions is implemented.");
			await sendReactionNextcloudTalk(target, messageId, emoji, {
				accountId: accountId ?? void 0,
				cfg
			});
			return jsonResult({
				ok: true,
				added: emoji
			});
		}
		throw new Error(`Action ${action} not supported for ${providerId}.`);
	}
};
//#endregion
//#region extensions/nextcloud-talk/src/message-adapter.ts
const nextcloudTalkMessageAdapter = defineChannelMessageAdapter({
	id: "nextcloud-talk",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		replyTo: true
	} },
	send: {
		text: async ({ cfg, to, text, accountId, replyToId }) => await sendMessageNextcloudTalk(to, text, {
			accountId: accountId ?? void 0,
			replyTo: replyToId ?? void 0,
			cfg
		}),
		media: async ({ cfg, to, text, mediaUrl, accountId, replyToId }) => await sendMessageNextcloudTalk(to, mediaUrl ? `${text}\n\nAttachment: ${mediaUrl}` : text, {
			accountId: accountId ?? void 0,
			replyTo: replyToId ?? void 0,
			cfg
		})
	}
});
//#endregion
//#region extensions/nextcloud-talk/src/session-route.ts
function resolveNextcloudTalkOutboundSessionRoute(params) {
	const roomId = stripNextcloudTalkTargetPrefix(params.target);
	if (!roomId) return null;
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "nextcloud-talk",
		accountId: params.accountId,
		peer: {
			kind: "group",
			id: roomId
		}
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		recipientSessionExact: false,
		peer: {
			kind: "group",
			id: roomId
		},
		chatType: "group",
		from: `nextcloud-talk:room:${roomId}`,
		to: `nextcloud-talk:${roomId}`
	};
}
//#endregion
//#region extensions/nextcloud-talk/src/setup-core.ts
const t$1 = createSetupTranslator();
const channel$1 = "nextcloud-talk";
function normalizeNextcloudTalkBaseUrl(value) {
	return value?.trim().replace(/\/+$/, "") ?? "";
}
function validateNextcloudTalkBaseUrl(value) {
	if (!value) return "Required";
	if (!value.startsWith("http://") && !value.startsWith("https://")) return "URL must start with http:// or https://";
}
function setNextcloudTalkAccountConfig(cfg, accountId, updates, clearFields) {
	return patchScopedAccountConfig({
		cfg,
		channelKey: channel$1,
		accountId,
		patch: updates,
		...clearFields ? { clearFields } : {}
	});
}
async function promptNextcloudTalkAllowFrom(params) {
	return await promptParsedAllowFromForAccount({
		cfg: params.cfg,
		accountId: params.accountId,
		defaultAccountId: params.accountId,
		prompter: params.prompter,
		noteTitle: t$1("wizard.nextcloudTalk.userIdTitle"),
		noteLines: [
			t$1("wizard.nextcloudTalk.userIdHelpAdmin"),
			t$1("wizard.nextcloudTalk.userIdHelpLogs"),
			t$1("wizard.nextcloudTalk.userIdHelpLowercase"),
			t$1("wizard.channels.docs", { link: formatDocsLink("/channels/nextcloud-talk", "nextcloud-talk") })
		],
		message: t$1("wizard.nextcloudTalk.allowFromPrompt"),
		placeholder: "username",
		parseEntries: (raw) => ({ entries: raw.split(/[\n,;]+/g).map(normalizeLowercaseStringOrEmpty).filter(Boolean) }),
		getExistingAllowFrom: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}).config.allowFrom ?? [],
		mergeEntries: ({ existing, parsed }) => mergeAllowFromEntries(existing.map((value) => normalizeLowercaseStringOrEmpty(String(value))), parsed),
		applyAllowFrom: ({ cfg, accountId, allowFrom }) => setNextcloudTalkAccountConfig(cfg, accountId, {
			dmPolicy: "allowlist",
			allowFrom
		})
	});
}
async function promptNextcloudTalkAllowFromForAccount(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: resolveDefaultNextcloudTalkAccountId(params.cfg)
	});
	return await promptNextcloudTalkAllowFrom({
		cfg: params.cfg,
		prompter: params.prompter,
		accountId
	});
}
const nextcloudTalkDmPolicy = createChannelDmPolicy({
	label: "Nextcloud Talk",
	channel: channel$1,
	resolveAccount: (cfg, accountId) => resolveNextcloudTalkAccount({
		cfg,
		accountId: accountId ?? resolveDefaultNextcloudTalkAccountId(cfg)
	}),
	applyPatch: ({ cfg, account, patch }) => setNextcloudTalkAccountConfig(cfg, account.accountId, patch),
	promptAllowFrom: promptNextcloudTalkAllowFromForAccount
});
const nextcloudTalkSetupContract = defineChannelSetupContract({
	fields: {
		baseUrl: {
			kind: "string",
			cli: {
				flags: "--base-url <url>",
				description: "Nextcloud base URL"
			}
		},
		url: {
			kind: "string",
			cli: {
				flags: "--url <url>",
				description: "Legacy Nextcloud base URL alias"
			}
		},
		secret: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--secret <secret>",
				description: "Nextcloud Talk bot secret"
			}
		},
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <secret>",
				description: "Legacy Nextcloud bot secret alias"
			}
		},
		password: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--password <secret>",
				description: "Legacy Nextcloud bot secret alias"
			}
		},
		secretFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--secret-file <path>",
				description: "Nextcloud Talk bot secret file"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Legacy Nextcloud bot secret file alias"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Nextcloud Talk environment credentials"
			},
			envVars: ["NEXTCLOUD_TALK_BOT_SECRET"]
		}
	},
	legacyAdapter: {
		singleAccountKeysToMove: ["rooms"],
		resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
		prepareAccountConfigInput: ({ input }) => {
			const setupInput = input;
			return {
				...setupInput,
				baseUrl: setupInput.baseUrl ?? readNonEmptyStringPreservingWhitespace(setupInput.url),
				secret: setupInput.secret ?? readNonEmptyStringPreservingWhitespace(setupInput.token) ?? readNonEmptyStringPreservingWhitespace(setupInput.password),
				secretFile: setupInput.secretFile ?? readNonEmptyStringPreservingWhitespace(setupInput.tokenFile)
			};
		},
		applyAccountName: ({ cfg, accountId, name }) => applyAccountNameToChannelSection({
			cfg,
			channelKey: channel$1,
			accountId,
			name
		}),
		validateInput: createSetupInputPresenceValidator({
			defaultAccountOnlyEnvError: "NEXTCLOUD_TALK_BOT_SECRET can only be used for the default account.",
			validate: ({ input }) => {
				const setupInput = input;
				if (!setupInput.useEnv && !setupInput.secret && !setupInput.secretFile) return "Nextcloud Talk requires bot secret or --secret-file (or --use-env).";
				const normalizedBaseUrl = normalizeNextcloudTalkBaseUrl(setupInput.baseUrl);
				if (!normalizedBaseUrl) return "Nextcloud Talk requires --base-url.";
				const baseUrlError = validateNextcloudTalkBaseUrl(normalizedBaseUrl);
				if (baseUrlError) return baseUrlError;
				return null;
			}
		}),
		applyAccountConfig: ({ cfg, accountId, input }) => {
			const setupInput = input;
			return setNextcloudTalkAccountConfig(applyAccountNameToChannelSection({
				cfg,
				channelKey: channel$1,
				accountId,
				name: setupInput.name
			}), accountId, {
				baseUrl: normalizeNextcloudTalkBaseUrl(setupInput.baseUrl),
				...setupInput.useEnv ? {} : setupInput.secretFile ? { botSecretFile: setupInput.secretFile } : setupInput.secret ? { botSecret: setupInput.secret } : {}
			}, setupInput.useEnv ? ["botSecret", "botSecretFile"] : void 0);
		}
	}
});
//#endregion
//#region extensions/nextcloud-talk/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "nextcloud-talk";
const CONFIGURE_API_FLAG = "__nextcloudTalkConfigureApiCredentials";
const nextcloudTalkSetupWizard = {
	channel,
	stepOrder: "text-first",
	status: createStandardChannelSetupStatus({
		channelLabel: "Nextcloud Talk",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusSelfHostedChat"),
		configuredScore: 1,
		unconfiguredScore: 5,
		resolveConfigured: ({ cfg, accountId }) => {
			const account = resolveNextcloudTalkAccount({
				cfg,
				accountId
			});
			return Boolean(account.secret && account.baseUrl);
		}
	}),
	introNote: {
		title: t("wizard.nextcloudTalk.setupTitle"),
		lines: [
			t("wizard.nextcloudTalk.helpSsh"),
			t("wizard.nextcloudTalk.helpInstallCommand"),
			t("wizard.nextcloudTalk.helpCopySecret"),
			t("wizard.nextcloudTalk.helpEnableRoom"),
			t("wizard.nextcloudTalk.helpEnvTip"),
			t("wizard.channels.docs", { link: formatDocsLink("/channels/nextcloud-talk", "channels/nextcloud-talk") })
		],
		shouldShow: ({ cfg, accountId }) => {
			const account = resolveNextcloudTalkAccount({
				cfg,
				accountId
			});
			return !account.secret || !account.baseUrl;
		}
	},
	prepare: async ({ cfg, accountId, credentialValues, prompter }) => {
		const resolvedAccount = resolveNextcloudTalkAccount({
			cfg,
			accountId
		});
		const hasApiCredentials = Boolean(resolvedAccount.config.apiUser?.trim() && (hasConfiguredSecretInput(resolvedAccount.config.apiPassword) || resolvedAccount.config.apiPasswordFile));
		if (!await prompter.confirm({
			message: t("wizard.nextcloudTalk.configureApiCredentials"),
			initialValue: hasApiCredentials
		})) return;
		return { credentialValues: {
			...credentialValues,
			[CONFIGURE_API_FLAG]: "1"
		} };
	},
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "botSecret",
		configuredFields: ["botSecret", "botSecretFile"],
		providerHint: channel,
		credentialLabel: t("wizard.nextcloudTalk.botSecret"),
		preferredEnvVar: "NEXTCLOUD_TALK_BOT_SECRET",
		envPrompt: t("wizard.nextcloudTalk.botSecretEnvPrompt"),
		keepPrompt: t("wizard.nextcloudTalk.botSecretKeep"),
		inputPrompt: t("wizard.nextcloudTalk.botSecretInput"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
		resolveAccount: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}),
		accountConfigured: (account) => Boolean(account.secret && account.baseUrl),
		hasConfiguredValue: (account) => Boolean(hasConfiguredSecretInput(account.config.botSecret) || account.config.botSecretFile),
		resolvedValue: (account) => account.secret || void 0,
		envValue: ({ accountId }) => accountId === "default" ? normalizeOptionalString(process.env.NEXTCLOUD_TALK_BOT_SECRET) : void 0,
		patchAccount: ({ cfg, accountId, patch, clearFields }) => setNextcloudTalkAccountConfig(cfg, accountId, patch, clearFields),
		useEnv: {
			clearFields: ["botSecret", "botSecretFile"],
			patch: (account) => ({ baseUrl: account.baseUrl })
		},
		set: { clearFields: ["botSecret", "botSecretFile"] }
	}), defineTokenCredential({
		inputKey: "password",
		configKey: "apiPassword",
		configuredFields: ["apiPassword", "apiPasswordFile"],
		providerHint: "nextcloud-talk-api",
		credentialLabel: t("wizard.nextcloudTalk.apiPassword"),
		preferredEnvVar: "NEXTCLOUD_TALK_API_PASSWORD",
		envPrompt: "",
		keepPrompt: t("wizard.nextcloudTalk.apiPasswordKeep"),
		inputPrompt: t("wizard.nextcloudTalk.apiPasswordInput"),
		resolveAccount: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}),
		accountConfigured: (account) => Boolean(account.config.apiUser?.trim() && (hasConfiguredSecretInput(account.config.apiPassword) || account.config.apiPasswordFile)),
		hasConfiguredValue: (account) => Boolean(hasConfiguredSecretInput(account.config.apiPassword) || account.config.apiPasswordFile),
		shouldPrompt: ({ credentialValues }) => credentialValues[CONFIGURE_API_FLAG] === "1",
		patchAccount: ({ cfg, accountId, patch, clearFields }) => setNextcloudTalkAccountConfig(cfg, accountId, patch, clearFields),
		set: { clearFields: ["apiPassword", "apiPasswordFile"] }
	})],
	textInputs: [baseUrlTextInput({
		inputKey: "httpUrl",
		configKey: "baseUrl",
		message: t("wizard.nextcloudTalk.instanceUrlPrompt"),
		resolveAccount: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}),
		currentValue: (account) => account.baseUrl || void 0,
		shouldPrompt: ({ currentValue }) => !currentValue,
		validate: validateNextcloudTalkBaseUrl,
		normalize: normalizeNextcloudTalkBaseUrl,
		patchAccount: ({ cfg, accountId, patch }) => setNextcloudTalkAccountConfig(cfg, accountId, patch)
	}), {
		inputKey: "userId",
		message: t("wizard.nextcloudTalk.apiUserPrompt"),
		currentValue: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}).config.apiUser?.trim() || void 0,
		shouldPrompt: ({ credentialValues }) => credentialValues[CONFIGURE_API_FLAG] === "1",
		validate: ({ value }) => value ? void 0 : t("common.required"),
		applySet: async (params) => setNextcloudTalkAccountConfig(params.cfg, params.accountId, { apiUser: params.value })
	}],
	dmPolicy: nextcloudTalkDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
//#region extensions/nextcloud-talk/src/channel.ts
const meta = {
	id: "nextcloud-talk",
	label: "Nextcloud Talk",
	selectionLabel: "Nextcloud Talk (self-hosted)",
	docsPath: "/channels/nextcloud-talk",
	docsLabel: "nextcloud-talk",
	blurb: "Self-hosted chat via Nextcloud Talk webhook bots.",
	aliases: ["nc-talk", "nc"],
	order: 65,
	quickstartAllowFrom: true
};
const collectNextcloudTalkSecurityWarnings = createAllowlistProviderRouteAllowlistWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.["nextcloud-talk"] !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Boolean(account.config.rooms) && Object.keys(account.config.rooms ?? {}).length > 0,
	restrictSenders: {
		surface: "Nextcloud Talk rooms",
		openScope: "any member in allowed rooms",
		groupPolicyPath: "channels.nextcloud-talk.groupPolicy",
		groupAllowFromPath: "channels.nextcloud-talk.groupAllowFrom"
	},
	noRouteAllowlist: {
		surface: "Nextcloud Talk rooms",
		routeAllowlistPath: "channels.nextcloud-talk.rooms",
		routeScope: "room",
		groupPolicyPath: "channels.nextcloud-talk.groupPolicy",
		groupAllowFromPath: "channels.nextcloud-talk.groupAllowFrom"
	}
});
const nextcloudTalkPlugin = createChatChannelPlugin({
	base: {
		id: "nextcloud-talk",
		meta,
		setupWizard: nextcloudTalkSetupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			reactions: true,
			threads: false,
			media: true,
			nativeCommands: false,
			blockStreaming: true
		},
		reload: { configPrefixes: ["channels.nextcloud-talk"] },
		configSchema: buildChannelConfigSchema(NextcloudTalkConfigSchema),
		config: {
			...nextcloudTalkConfigAdapter,
			isConfigured: (account) => Boolean(account.tokenStatus !== "missing" && account.baseUrl?.trim()),
			describeAccount: (account) => describeWebhookAccountSnapshot({
				account,
				configured: Boolean(account.tokenStatus !== "missing" && account.baseUrl?.trim()),
				extra: {
					secretSource: account.secretSource,
					tokenStatus: account.tokenStatus,
					apiCredentialStatus: account.apiCredentialStatus,
					baseUrl: account.baseUrl ? "[set]" : "[missing]"
				}
			})
		},
		approvalCapability: nextcloudTalkApprovalAuth,
		doctor: nextcloudTalkDoctor,
		groups: {
			resolveRequireMention: resolveNextcloudTalkGroupRequireMention,
			resolveToolPolicy: resolveNextcloudTalkGroupToolPolicy
		},
		messaging: {
			targetPrefixes: [
				"nextcloud-talk",
				"nc-talk",
				"nc"
			],
			normalizeTarget: normalizeNextcloudTalkMessagingTarget,
			inferTargetChatType: ({ to }) => normalizeNextcloudTalkMessagingTarget(to) ? "group" : void 0,
			resolveOutboundSessionRoute: (params) => resolveNextcloudTalkOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeNextcloudTalkTargetId,
				hint: "<roomToken>"
			}
		},
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		setupContract: nextcloudTalkSetupContract,
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			buildChannelSummary: ({ snapshot }) => buildWebhookChannelStatusSummary(snapshot, { secretSource: snapshot.secretSource ?? "none" }),
			collectStatusIssues: (accounts) => accounts.flatMap((account) => {
				const probe = account.probe;
				if (!probe || probe.ok !== false || probe.code !== "missing_response_feature" || !probe.message) return [];
				return [{
					channel: "nextcloud-talk",
					accountId: account.accountId ?? "default",
					kind: "config",
					message: probe.message,
					fix: "Add --feature response to the Talk bot."
				}];
			}),
			probeAccount: async ({ account, timeoutMs }) => await probeNextcloudTalkBotResponseFeature({
				account,
				timeoutMs
			}),
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: Boolean(account.tokenStatus !== "missing" && account.baseUrl?.trim()),
				extra: {
					secretSource: account.secretSource,
					tokenStatus: account.tokenStatus,
					apiCredentialStatus: account.apiCredentialStatus,
					baseUrl: account.baseUrl ? "[set]" : "[missing]",
					mode: "webhook"
				}
			})
		}),
		gateway: nextcloudTalkGatewayAdapter,
		message: nextcloudTalkMessageAdapter,
		actions: nextcloudTalkMessageActions
	},
	pairing: { text: {
		...nextcloudTalkPairingTextAdapter,
		notify: createLoggedPairingApprovalNotifier(({ id }) => `[nextcloud-talk] User ${id} approved for pairing`)
	} },
	security: {
		...nextcloudTalkSecurityAdapter,
		collectWarnings: collectNextcloudTalkSecurityWarnings
	},
	outbound: {
		base: {
			deliveryMode: "direct",
			chunker: (text, limit) => getNextcloudTalkRuntime().channel.text.chunkMarkdownText(text, limit),
			chunkerMode: "markdown",
			textChunkLimit: 4e3,
			sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text)
		},
		attachedResults: {
			channel: "nextcloud-talk",
			sendText: async ({ cfg, to, text, accountId, replyToId }) => await nextcloudTalkMessageAdapter.send.text({
				cfg,
				to,
				text,
				accountId,
				replyToId
			}),
			sendMedia: async ({ cfg, to, text, mediaUrl, accountId, replyToId }) => await nextcloudTalkMessageAdapter.send.media({
				cfg,
				to,
				text,
				mediaUrl: mediaUrl ?? "",
				accountId,
				replyToId
			})
		}
	}
});
//#endregion
export { nextcloudTalkPlugin as t };
