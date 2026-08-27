import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import { p as readPositiveIntegerParam } from "./common-BGOZLJ2_.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { a as optionalPositiveIntegerSchema } from "./typebox-BXRXV_Ve.js";
import "./error-runtime-CmlvK1A3.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./retry-runtime-ELyDVNAC.js";
import "./security-runtime-Bm9RUgAZ.js";
import "./account-resolution-Cb-rHsSW.js";
import "./channel-actions-CeWsyukw.js";
import "./param-readers-BF3rNe0k.js";
import { a as resolveDefaultFeishuAccountId, i as listFeishuAccountIds, l as resolveFeishuRuntimeAccount, r as listEnabledFeishuAccounts, s as resolveFeishuAccount } from "./accounts-DSvhJ6ZC.js";
import { A as resolveFeishuChatType, b as resolveFeishuChatReadPreliminaryAuthorization, h as authorizeFeishuChatMemberRead, m as assertFeishuChatReadAllowed } from "./send-result-Dn-8KnNh.js";
import { n as createFeishuClient } from "./client-WjHY85b1.js";
import { Type } from "typebox";
//#region extensions/feishu/src/tools-config.ts
/**
* Default tool configuration.
* - doc, chat, wiki, drive, scopes, bitable: enabled by default
* - perm: disabled by default (sensitive operation)
*/
const DEFAULT_TOOLS_CONFIG = {
	doc: true,
	chat: true,
	wiki: true,
	drive: true,
	perm: false,
	scopes: true,
	bitable: true
};
/** Resolve tools config with defaults. */
function resolveToolsConfig(cfg) {
	return {
		...DEFAULT_TOOLS_CONFIG,
		...cfg
	};
}
//#endregion
//#region extensions/feishu/src/tool-account.ts
function resolveImplicitToolAccountId(params) {
	const explicitAccountId = normalizeOptionalString(params.executeParams?.accountId);
	if (explicitAccountId) {
		const normalizedAccountId = normalizeOptionalAccountId(explicitAccountId);
		if (!normalizedAccountId) throw new Error(`Invalid Feishu account ID "${explicitAccountId}"`);
		const listedAccountId = listFeishuAccountIds(params.api.config).find((accountId) => normalizeOptionalAccountId(accountId) === normalizedAccountId) ?? (() => {
			const defaultAccountId = resolveDefaultFeishuAccountId(params.api.config);
			return normalizeOptionalAccountId(defaultAccountId) === normalizedAccountId ? defaultAccountId : void 0;
		})();
		if (!listedAccountId) throw new Error(`Unknown Feishu account "${explicitAccountId}"`);
		if (!resolveFeishuAccount({
			cfg: params.api.config,
			accountId: normalizedAccountId
		}).enabled) throw new Error(`Feishu account "${listedAccountId}" is disabled`);
		return normalizedAccountId;
	}
	const contextualAccountId = normalizeOptionalString(params.defaultAccountId);
	if (contextualAccountId && listFeishuAccountIds(params.api.config).includes(contextualAccountId)) {
		if (resolveFeishuAccount({
			cfg: params.api.config,
			accountId: contextualAccountId
		}).enabled) return contextualAccountId;
	}
	const configuredDefaultAccountId = normalizeOptionalString((params.api.config?.channels?.feishu)?.defaultAccount);
	if (configuredDefaultAccountId) return configuredDefaultAccountId;
	if (params.requiredTool && params.api.config) for (const accountId of listFeishuAccountIds(params.api.config)) {
		const account = resolveFeishuAccount({
			cfg: params.api.config,
			accountId
		});
		if (account.enabled && account.configured && resolveToolsConfig(account.config.tools)[params.requiredTool.family]) return accountId;
	}
}
function resolveFeishuToolAccount(params) {
	if (!params.api.config) throw new Error("Feishu config unavailable");
	const account = resolveFeishuRuntimeAccount({
		cfg: params.api.config,
		accountId: resolveImplicitToolAccountId(params)
	});
	if (params.requiredTool && !resolveToolsConfig(account.config.tools)[params.requiredTool.family]) throw new Error(`Feishu ${params.requiredTool.label} tools are disabled for account "${account.accountId}"`);
	return account;
}
function createFeishuToolClient(params) {
	return createFeishuClient(resolveFeishuToolAccount(params));
}
function resolveAnyEnabledFeishuToolsConfig(accounts) {
	const merged = {
		doc: false,
		chat: false,
		wiki: false,
		drive: false,
		perm: false,
		scopes: false,
		bitable: false
	};
	for (const account of accounts) {
		const cfg = resolveToolsConfig(account.config.tools);
		merged.doc = merged.doc || cfg.doc;
		merged.chat = merged.chat || cfg.chat;
		merged.wiki = merged.wiki || cfg.wiki;
		merged.drive = merged.drive || cfg.drive;
		merged.perm = merged.perm || cfg.perm;
		merged.scopes = merged.scopes || cfg.scopes;
		merged.bitable = merged.bitable || cfg.bitable;
	}
	return merged;
}
//#endregion
//#region extensions/feishu/src/tool-result.ts
function feishuExternalToolResult(details) {
	return {
		content: [{
			type: "text",
			text: wrapExternalContent(JSON.stringify(details, null, 2), {
				source: "api",
				includeWarning: false
			})
		}],
		details
	};
}
function unknownToolActionResult(action) {
	return jsonResult({ error: `Unknown action: ${String(action)}` });
}
function toolExecutionErrorResult(error) {
	return feishuExternalToolResult({ error: formatErrorMessage(error) });
}
const FeishuChatSchema = Type.Object({
	action: Type.Enum([
		"members",
		"info",
		"member_info"
	], {
		type: "string",
		description: "Action to run: members | info | member_info"
	}),
	chat_id: Type.Optional(Type.String({ description: "Chat ID (from URL or event payload)" })),
	member_id: Type.Optional(Type.String({ description: "Member ID for member_info lookups" })),
	page_size: optionalPositiveIntegerSchema({
		maximum: 100,
		description: "Page size (1-100, default 50)"
	}),
	page_token: Type.Optional(Type.String({ description: "Pagination token" })),
	member_id_type: Type.Optional(Type.Enum([
		"open_id",
		"user_id",
		"union_id"
	], {
		type: "string",
		description: "Member ID type (default: open_id)"
	}))
});
//#endregion
//#region extensions/feishu/src/comment-target.ts
const FEISHU_COMMENT_FILE_TYPES = [
	"doc",
	"docx",
	"file",
	"sheet",
	"slides"
];
function normalizeCommentFileType(value) {
	return typeof value === "string" && FEISHU_COMMENT_FILE_TYPES.includes(value) ? value : void 0;
}
function buildFeishuCommentTarget(params) {
	return `comment:${params.fileType}:${params.fileToken}:${params.commentId}`;
}
function parseFeishuCommentTarget(raw) {
	const trimmed = raw?.trim();
	if (!trimmed?.startsWith("comment:")) return null;
	const parts = trimmed.split(":");
	if (parts.length !== 4) return null;
	const fileType = normalizeCommentFileType(parts[1]);
	const fileToken = parts[2]?.trim();
	const commentId = parts[3]?.trim();
	if (!fileType || !fileToken || !commentId) return null;
	return {
		fileType,
		fileToken,
		commentId
	};
}
//#endregion
//#region extensions/feishu/src/send-rate-limit.ts
const FEISHU_SEND_RATE_LIMIT_CODES = /* @__PURE__ */ new Set([230020, 11232]);
function getFeishuSendRateLimitCode(error) {
	if (!isRecord(error)) return;
	const response = isRecord(error.response) ? error.response : void 0;
	if (response?.status === 429) return 429;
	const code = (isRecord(response?.data) ? response.data : void 0)?.code;
	return typeof code === "number" && FEISHU_SEND_RATE_LIMIT_CODES.has(code) ? code : void 0;
}
function getFeishuSendRateLimitCodeFromResponse(response) {
	if (!isRecord(response)) return;
	const code = response.code;
	return typeof code === "number" && FEISHU_SEND_RATE_LIMIT_CODES.has(code) ? code : void 0;
}
//#endregion
//#region extensions/feishu/src/comment-shared.ts
function encodeQuery(params) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		const trimmed = value?.trim();
		if (trimmed) query.set(key, trimmed);
	}
	const queryString = query.toString();
	return queryString ? `?${queryString}` : "";
}
function formatFeishuApiError(error, options = {}) {
	if (!isRecord(error)) return typeof error === "string" ? error : JSON.stringify(error);
	const config = isRecord(error.config) ? error.config : void 0;
	const response = isRecord(error.response) ? error.response : void 0;
	const responseData = isRecord(response?.data) ? response?.data : void 0;
	const feishuLogId = readStringValue(responseData?.log_id) || (options.includeNestedErrorLogId ? readStringValue(isRecord(responseData?.error) ? responseData.error.log_id : void 0) : void 0);
	const nestedError = isRecord(responseData?.error) ? responseData.error : void 0;
	return JSON.stringify({
		message: typeof error.message === "string" ? error.message : typeof error === "string" ? error : JSON.stringify(error),
		code: readStringValue(error.code),
		method: readStringValue(config?.method),
		url: readStringValue(config?.url),
		...options.includeConfigParams ? { params: config?.params } : {},
		http_status: typeof response?.status === "number" ? response.status : void 0,
		feishu_code: typeof responseData?.code === "number" ? responseData.code : readStringValue(responseData?.code),
		feishu_msg: readStringValue(responseData?.msg),
		feishu_log_id: feishuLogId,
		feishu_troubleshooter: readStringValue(responseData?.troubleshooter) || readStringValue(nestedError?.troubleshooter)
	});
}
function formatFeishuApiFailure(error, errorPrefix, options = {}) {
	return `${errorPrefix}: ${formatFeishuApiError(error, options) || "unknown error"}`;
}
function createFeishuApiError(error, errorPrefix, options = {}) {
	return new Error(formatFeishuApiFailure(error, errorPrefix, options), { cause: error });
}
const FEISHU_SEND_RETRY_BASE_MS = 500;
async function requestFeishuApi(request, errorPrefix, options = {}) {
	try {
		return await retryAsync(async () => {
			const result = await request();
			const fulfilledRateLimit = getFeishuSendRateLimitCodeFromResponse(result);
			if (fulfilledRateLimit !== void 0) throw Object.assign(/* @__PURE__ */ new Error(`Request fulfilled with rate-limit code ${fulfilledRateLimit}`), { response: {
				status: 200,
				data: result
			} });
			return result;
		}, {
			attempts: 3,
			minDelayMs: options.retryDelayMs ?? FEISHU_SEND_RETRY_BASE_MS,
			shouldRetry: (error) => getFeishuSendRateLimitCode(error) !== void 0
		});
	} catch (error) {
		throw createFeishuApiError(error, errorPrefix, options);
	}
}
function readDocsLinkUrl(element) {
	const docsLink = isRecord(element.docs_link) ? element.docs_link : void 0;
	return normalizeOptionalString(docsLink?.url) || normalizeOptionalString(docsLink?.link) || normalizeOptionalString(element.url) || normalizeOptionalString(element.link) || void 0;
}
function readMentionUserId(element) {
	const mention = isRecord(element.mention) ? element.mention : void 0;
	return normalizeOptionalString((isRecord(element.person) ? element.person : void 0)?.user_id) || normalizeOptionalString(mention?.user_id) || normalizeOptionalString(mention?.open_id) || normalizeOptionalString(element.mention_user) || normalizeOptionalString(element.user_id) || void 0;
}
function readMentionDisplayText(element, userId) {
	const mention = isRecord(element.mention) ? element.mention : void 0;
	const mentionName = normalizeOptionalString(mention?.name) || normalizeOptionalString(mention?.display_name) || normalizeOptionalString(element.name);
	return mentionName ? `@${mentionName}` : `@${userId}`;
}
function normalizeCommentText(parts) {
	return parts.join("").trim() || void 0;
}
function normalizeCommentSemanticText(parts) {
	return parts.join("").replace(/\s+/g, " ").trim() || void 0;
}
function readElementTextPreservingWhitespace(element) {
	return (isRecord(element.text_run) ? readStringValue(element.text_run.content) || readStringValue(element.text_run.text) : void 0) || readStringValue(element.text) || readStringValue(element.content) || readStringValue(element.name) || void 0;
}
const FEISHU_LINK_TOKEN_MIN_LENGTH = 22;
const FEISHU_LINK_TOKEN_MAX_LENGTH = 28;
const COMMENT_LINK_KIND_ALIASES = /* @__PURE__ */ new Map([
	["doc", "doc"],
	["docs", "doc"],
	["docx", "docx"],
	["sheet", "sheet"],
	["sheets", "sheet"],
	["slide", "slides"],
	["slides", "slides"],
	["file", "file"],
	["files", "file"],
	["wiki", "wiki"],
	["mindnote", "mindnote"],
	["mindnotes", "mindnote"],
	["bitable", "bitable"],
	["base", "base"]
]);
function isCommentFileType(value) {
	return typeof value === "string" && FEISHU_COMMENT_FILE_TYPES.includes(value);
}
function isReasonableFeishuLinkToken(token) {
	return typeof token === "string" && token.length >= FEISHU_LINK_TOKEN_MIN_LENGTH && token.length <= FEISHU_LINK_TOKEN_MAX_LENGTH;
}
function parseCommentLinkedDocumentPath(pathname) {
	const segments = normalizeStringEntries(pathname.split("/"));
	const offset = segments[0]?.toLowerCase() === "space" ? 1 : 0;
	const kind = COMMENT_LINK_KIND_ALIASES.get(segments[offset]?.toLowerCase() ?? "");
	const token = normalizeOptionalString(segments[offset + 1]);
	if (!kind || !isReasonableFeishuLinkToken(token)) return null;
	return {
		urlKind: kind,
		token
	};
}
function hasResolvedLinkedDocumentReference(link) {
	return link.urlKind !== "unknown" && (Boolean(link.resolvedObjToken) || Boolean(link.wikiNodeToken));
}
function resolveCommentLinkedDocumentFromUrl(params) {
	const link = {
		rawUrl: params.rawUrl,
		urlKind: "unknown"
	};
	try {
		const parsedPath = parseCommentLinkedDocumentPath(new URL(params.rawUrl).pathname);
		if (!parsedPath) return link;
		const { urlKind, token } = parsedPath;
		link.urlKind = urlKind;
		if (urlKind === "wiki") {
			link.urlKind = "wiki";
			link.wikiNodeToken = token;
		} else {
			link.resolvedObjType = urlKind;
			link.resolvedObjToken = token;
		}
		if (link.resolvedObjType && link.resolvedObjToken && isCommentFileType(link.resolvedObjType) && params.currentDocument?.fileType === link.resolvedObjType && params.currentDocument.fileToken === link.resolvedObjToken) link.isCurrentDocument = true;
		else if (link.resolvedObjType && link.resolvedObjToken && isCommentFileType(link.resolvedObjType)) link.isCurrentDocument = false;
	} catch {
		return link;
	}
	return link;
}
function parseCommentContentElements(params) {
	const elements = Array.isArray(params.elements) ? params.elements : [];
	const plainTextParts = [];
	const semanticTextParts = [];
	const mentions = [];
	const linkedDocuments = [];
	const botIds = new Set(Array.from(params.botOpenIds ?? []).map((value) => normalizeOptionalString(value)).filter((value) => Boolean(value)));
	const linkedDocumentKeys = /* @__PURE__ */ new Set();
	let botMentioned = false;
	for (const rawElement of elements) {
		if (!isRecord(rawElement)) continue;
		const element = rawElement;
		const type = normalizeOptionalString(element.type);
		const text = (type === "text_run" ? readElementTextPreservingWhitespace(element) : void 0) || (type === "text" ? readElementTextPreservingWhitespace(element) : void 0) || (type === "docs_link" || type === "link" ? readDocsLinkUrl(element) : void 0) || (type === "mention" || type === "mention_user" || type === "person" ? (() => {
			const userId = readMentionUserId(element);
			return userId ? readMentionDisplayText(element, userId) : void 0;
		})() : void 0) || readElementTextPreservingWhitespace(element) || void 0;
		if (type === "mention" || type === "mention_user" || type === "person") {
			const userId = readMentionUserId(element);
			if (userId) {
				const displayText = readMentionDisplayText(element, userId);
				const isBotMention = botIds.has(userId);
				mentions.push({
					userId,
					displayText,
					isBotMention
				});
				plainTextParts.push(displayText);
				if (!isBotMention) semanticTextParts.push(displayText);
				else botMentioned = true;
				continue;
			}
		}
		if (type === "docs_link" || type === "link") {
			const rawUrl = readDocsLinkUrl(element);
			if (rawUrl) {
				plainTextParts.push(rawUrl);
				semanticTextParts.push(rawUrl);
				const linkedDocument = resolveCommentLinkedDocumentFromUrl({
					rawUrl,
					currentDocument: params.currentDocument
				});
				if (hasResolvedLinkedDocumentReference(linkedDocument)) {
					const key = [
						linkedDocument.rawUrl,
						linkedDocument.urlKind,
						linkedDocument.resolvedObjType,
						linkedDocument.resolvedObjToken,
						linkedDocument.wikiNodeToken
					].join(":");
					if (!linkedDocumentKeys.has(key)) {
						linkedDocumentKeys.add(key);
						linkedDocuments.push(linkedDocument);
					}
				}
				continue;
			}
		}
		if (text) {
			plainTextParts.push(text);
			semanticTextParts.push(text);
		}
	}
	return {
		plainText: normalizeCommentText(plainTextParts),
		semanticText: normalizeCommentSemanticText(semanticTextParts),
		mentions,
		linkedDocuments,
		botMentioned
	};
}
function extractReplyText(reply) {
	if (!reply || !isRecord(reply.content)) return;
	return parseCommentContentElements({ elements: Array.isArray(reply.content.elements) ? reply.content.elements : [] }).plainText;
}
//#endregion
//#region extensions/feishu/src/chat.ts
function readChatPageSize(params) {
	return readPositiveIntegerParam(params, "page_size", {
		max: 100,
		message: "page_size must be a positive integer between 1 and 100"
	});
}
function buildFeishuDirectChatMembers(authorization) {
	return {
		chat_id: authorization.chatId,
		has_more: false,
		page_token: void 0,
		members: [{
			member_id: authorization.memberId,
			name: void 0,
			tenant_key: void 0,
			member_id_type: authorization.memberIdType
		}]
	};
}
async function getChatInfo(client, chatId) {
	const res = await client.im.chat.get({ path: { chat_id: chatId } });
	if (res.code !== 0) throw new Error(res.msg);
	const chat = res.data;
	return {
		chat_id: chatId,
		name: chat?.name,
		description: chat?.description,
		owner_id: chat?.owner_id,
		tenant_key: chat?.tenant_key,
		user_count: chat?.user_count,
		chat_mode: chat?.chat_mode,
		chat_type: chat?.chat_type,
		join_message_visibility: chat?.join_message_visibility,
		leave_message_visibility: chat?.leave_message_visibility,
		membership_approval: chat?.membership_approval,
		moderation_permission: chat?.moderation_permission,
		avatar: chat?.avatar
	};
}
function authorizeFeishuChatInfo(params) {
	assertFeishuChatReadAllowed({
		cfg: params.cfg,
		account: params.account,
		chatId: params.chatId,
		chatType: resolveFeishuChatType(params.chat),
		ctx: params.ctx
	});
}
async function getAuthorizedFeishuChatInfo(params) {
	const preliminary = resolveFeishuChatReadPreliminaryAuthorization({
		cfg: params.cfg,
		account: params.account,
		chatId: params.chatId,
		ctx: params.ctx
	});
	if (preliminary.decision === "deny") assertFeishuChatReadAllowed({
		cfg: params.cfg,
		account: params.account,
		chatId: preliminary.chatId,
		ctx: params.ctx
	});
	let chat;
	try {
		chat = await getChatInfo(params.client, preliminary.chatId);
	} catch (error) {
		if (preliminary.decision === "needs-metadata") assertFeishuChatReadAllowed({
			cfg: params.cfg,
			account: params.account,
			chatId: preliminary.chatId,
			ctx: params.ctx
		});
		throw error;
	}
	authorizeFeishuChatInfo({
		cfg: params.cfg,
		account: params.account,
		chatId: preliminary.chatId,
		chat,
		ctx: params.ctx
	});
	return chat;
}
async function getChatMembers(client, chatId, pageSize, pageToken, memberIdType) {
	const page_size = pageSize ? Math.max(1, Math.min(100, pageSize)) : 50;
	const res = await client.im.chatMembers.get({
		path: { chat_id: chatId },
		params: {
			page_size,
			page_token: pageToken,
			member_id_type: memberIdType ?? "open_id"
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		chat_id: chatId,
		has_more: res.data?.has_more,
		page_token: res.data?.page_token,
		members: res.data?.items?.map((item) => ({
			member_id: item.member_id,
			name: item.name,
			tenant_key: item.tenant_key,
			member_id_type: item.member_id_type
		})) ?? []
	};
}
async function assertFeishuChatMember(client, chatId, memberId, memberIdType = "open_id") {
	let pageToken;
	const seenPageTokens = /* @__PURE__ */ new Set();
	while (true) {
		const members = await getChatMembers(client, chatId, 100, pageToken, memberIdType);
		if (members.members.some((member) => member.member_id === memberId)) return;
		if (!members.has_more || !members.page_token) break;
		if (seenPageTokens.has(members.page_token)) throw new Error(`Feishu chat member pagination repeated token for chat ${chatId}`);
		seenPageTokens.add(members.page_token);
		pageToken = members.page_token;
	}
	throw new Error(`Member ${memberId} is not a member of chat ${chatId}`);
}
async function getFeishuMemberInfo(client, memberId, memberIdType = "open_id") {
	const res = await client.contact.user.get({
		path: { user_id: memberId },
		params: {
			user_id_type: memberIdType,
			department_id_type: "open_department_id"
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	const user = res.data?.user;
	return {
		member_id: memberId,
		member_id_type: memberIdType,
		open_id: user?.open_id,
		user_id: user?.user_id,
		union_id: user?.union_id,
		name: user?.name,
		en_name: user?.en_name,
		nickname: user?.nickname,
		email: user?.email,
		enterprise_email: user?.enterprise_email,
		mobile: user?.mobile,
		mobile_visible: user?.mobile_visible,
		status: user?.status,
		avatar: user?.avatar,
		department_ids: user?.department_ids,
		department_path: user?.department_path,
		leader_user_id: user?.leader_user_id,
		city: user?.city,
		country: user?.country,
		work_station: user?.work_station,
		join_time: user?.join_time,
		is_tenant_manager: user?.is_tenant_manager,
		employee_no: user?.employee_no,
		employee_type: user?.employee_type,
		description: user?.description,
		job_title: user?.job_title,
		geo: user?.geo
	};
}
function registerFeishuChatTools(api) {
	if (!api.config) return;
	const cfg = api.config;
	const accounts = listEnabledFeishuAccounts(cfg);
	if (accounts.length === 0) return;
	if (!resolveAnyEnabledFeishuToolsConfig(accounts).chat) return;
	api.registerTool((toolContext) => ({
		name: "feishu_chat",
		resultContentSource: "network",
		label: "Feishu Chat",
		description: "Feishu chat operations. Actions: members, info, member_info",
		parameters: FeishuChatSchema,
		async execute(_toolCallId, params) {
			const rawParams = params;
			const p = params;
			try {
				const account = resolveFeishuToolAccount({
					api,
					defaultAccountId: toolContext.agentAccountId,
					requiredTool: {
						family: "chat",
						label: "chat"
					}
				});
				const client = createFeishuClient(account);
				switch (p.action) {
					case "members":
						if (!p.chat_id) return feishuExternalToolResult({ error: "chat_id is required for action members" });
						{
							const chat = await getAuthorizedFeishuChatInfo({
								client,
								cfg,
								account,
								chatId: p.chat_id,
								ctx: toolContext
							});
							const authorization = authorizeFeishuChatMemberRead({
								cfg,
								account,
								chatId: p.chat_id,
								chatType: resolveFeishuChatType(chat),
								ctx: toolContext,
								memberIdType: p.member_id_type
							});
							if (authorization.kind === "direct") return feishuExternalToolResult(buildFeishuDirectChatMembers(authorization));
						}
						return feishuExternalToolResult(await getChatMembers(client, p.chat_id, readChatPageSize(rawParams), p.page_token, p.member_id_type));
					case "info":
						if (!p.chat_id) return feishuExternalToolResult({ error: "chat_id is required for action info" });
						return feishuExternalToolResult(await getAuthorizedFeishuChatInfo({
							client,
							cfg,
							account,
							chatId: p.chat_id,
							ctx: toolContext
						}));
					case "member_info":
						if (!p.member_id) return feishuExternalToolResult({ error: "member_id is required for action member_info" });
						if (!p.chat_id) return feishuExternalToolResult({ error: "chat_id is required for action member_info" });
						{
							const chat = await getAuthorizedFeishuChatInfo({
								client,
								cfg,
								account,
								chatId: p.chat_id,
								ctx: toolContext
							});
							const authorization = authorizeFeishuChatMemberRead({
								cfg,
								account,
								chatId: p.chat_id,
								chatType: resolveFeishuChatType(chat),
								ctx: toolContext,
								memberId: p.member_id,
								memberIdType: p.member_id_type
							});
							if (authorization.kind === "group") {
								const memberIdType = p.member_id_type ?? "open_id";
								await assertFeishuChatMember(client, p.chat_id, p.member_id, memberIdType);
								return feishuExternalToolResult(await getFeishuMemberInfo(client, p.member_id, memberIdType));
							}
							return feishuExternalToolResult(await getFeishuMemberInfo(client, authorization.memberId, authorization.memberIdType));
						}
					default: return feishuExternalToolResult({ error: `Unknown action: ${String(p.action)}` });
				}
			} catch (err) {
				return feishuExternalToolResult({ error: formatFeishuApiError(err, { includeNestedErrorLogId: true }) });
			}
		}
	}), { name: "feishu_chat" });
}
//#endregion
//#region extensions/feishu/src/comment-reaction.ts
const COMMENT_TYPING_REACTION_TYPE = "Typing";
const COMMENT_REACTION_TIMEOUT_MS = 3e4;
const commentTypingReactionState = /* @__PURE__ */ new Map();
function buildCommentTypingReactionKey(params) {
	return `${params.fileType}:${params.fileToken}:${params.replyId}`;
}
function ensureCommentTypingReactionState(key) {
	const existing = commentTypingReactionState.get(key);
	if (existing) return existing;
	const created = {
		active: false,
		cleaned: false,
		cleanupPromise: void 0
	};
	commentTypingReactionState.set(key, created);
	return created;
}
async function requestCommentTypingReactionWithClient(params) {
	try {
		const response = await params.client.request({
			method: "POST",
			url: `/open-apis/drive/v2/files/${encodeURIComponent(params.fileToken)}/comments/reaction` + encodeQuery({ file_type: params.fileType }),
			data: {
				action: params.action,
				reply_id: params.replyId,
				reaction_type: COMMENT_TYPING_REACTION_TYPE
			},
			timeout: COMMENT_REACTION_TIMEOUT_MS
		});
		if (response.code === 0) return true;
		params.runtime?.log?.(`${params.logPrefix ?? "[feishu]"}: comment typing reaction ${params.action} failed reply=${params.replyId} file=${params.fileType}:${params.fileToken} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"} log_id=${response.log_id ?? response.error?.log_id ?? "unknown"}`);
	} catch (error) {
		params.runtime?.log?.(`${params.logPrefix ?? "[feishu]"}: comment typing reaction ${params.action} threw reply=${params.replyId} file=${params.fileType}:${params.fileToken} error=${formatCommentReactionFailure(error)}`);
	}
	return false;
}
function formatCommentReactionFailure(error) {
	return formatFeishuApiError(error, { includeNestedErrorLogId: true });
}
async function requestCommentTypingReaction(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured || !(account.config.typingIndicator ?? true)) return false;
	return requestCommentTypingReactionWithClient({
		client: createFeishuClient(account),
		fileToken: params.fileToken,
		fileType: params.fileType,
		replyId: params.replyId,
		action: params.action,
		runtime: params.runtime,
		logPrefix: `feishu[${account.accountId}]`
	});
}
async function cleanupCommentTypingReactionByKey(params) {
	const state = ensureCommentTypingReactionState(params.key);
	if (state.cleaned) return false;
	if (state.cleanupPromise) return await state.cleanupPromise;
	const cleanupPromise = (async () => {
		if (!state.active) {
			state.cleaned = true;
			return false;
		}
		const deleted = await params.performDelete();
		if (deleted) {
			state.cleaned = true;
			state.active = false;
		}
		return deleted;
	})();
	state.cleanupPromise = cleanupPromise;
	try {
		return await cleanupPromise;
	} finally {
		state.cleanupPromise = void 0;
		if (state.cleaned) {
			state.active = false;
			commentTypingReactionState.delete(params.key);
		}
	}
}
async function cleanupAmbientCommentTypingReaction(params) {
	const deliveryContext = params.deliveryContext;
	if (deliveryContext?.channel && deliveryContext.channel !== "feishu" && deliveryContext.channel !== "feishu-comment") return false;
	const target = parseFeishuCommentTarget(deliveryContext?.to);
	const replyId = typeof deliveryContext?.threadId === "string" || typeof deliveryContext?.threadId === "number" ? String(deliveryContext.threadId).trim() : "";
	if (!target || !replyId) return false;
	return cleanupCommentTypingReactionByKey({
		key: buildCommentTypingReactionKey({
			fileToken: target.fileToken,
			fileType: target.fileType,
			replyId
		}),
		performDelete: () => requestCommentTypingReactionWithClient({
			client: params.client,
			fileToken: target.fileToken,
			fileType: target.fileType,
			replyId,
			action: "delete",
			runtime: params.runtime,
			logPrefix: "[feishu]"
		})
	});
}
function createCommentTypingReactionLifecycle(params) {
	const key = params.replyId?.trim() ? buildCommentTypingReactionKey({
		fileToken: params.fileToken,
		fileType: params.fileType,
		replyId: params.replyId.trim()
	}) : void 0;
	const state = key ? ensureCommentTypingReactionState(key) : void 0;
	return {
		start: async () => {
			const replyId = params.replyId?.trim();
			if (!state || state.cleaned || state.active || !replyId) return;
			state.active = await requestCommentTypingReaction({
				cfg: params.cfg,
				fileToken: params.fileToken,
				fileType: params.fileType,
				replyId,
				action: "add",
				accountId: params.accountId,
				runtime: params.runtime
			});
		},
		cleanup: async () => {
			const replyId = params.replyId?.trim();
			if (!key || !replyId) return;
			await cleanupCommentTypingReactionByKey({
				key,
				performDelete: () => requestCommentTypingReaction({
					cfg: params.cfg,
					fileToken: params.fileToken,
					fileType: params.fileType,
					replyId,
					action: "delete",
					accountId: params.accountId,
					runtime: params.runtime
				})
			});
		}
	};
}
//#endregion
//#region extensions/feishu/src/drive-schema.ts
const FileType = Type.Union([
	Type.Literal("doc"),
	Type.Literal("docx"),
	Type.Literal("sheet"),
	Type.Literal("bitable"),
	Type.Literal("folder"),
	Type.Literal("file"),
	Type.Literal("mindnote"),
	Type.Literal("shortcut")
]);
const CommentFileType = Type.Union([
	Type.Literal("doc"),
	Type.Literal("docx"),
	Type.Literal("sheet"),
	Type.Literal("file"),
	Type.Literal("slides")
]);
const FeishuDriveSchema = Type.Union([
	Type.Object({
		action: Type.Literal("list"),
		folder_token: Type.Optional(Type.String({ description: "Folder token (optional, omit for root directory)" })),
		page_size: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 200,
			description: "Items per folder page (1-200; requires folder_token)"
		})),
		page_token: Type.Optional(Type.String({ description: "Continuation token from a prior list result (requires the same folder_token)" }))
	}),
	Type.Object({
		action: Type.Literal("info"),
		file_token: Type.String({ description: "File or folder token" }),
		type: FileType
	}),
	Type.Object({
		action: Type.Literal("create_folder"),
		name: Type.String({ description: "Folder name" }),
		folder_token: Type.Optional(Type.String({ description: "Parent folder token (optional, omit for root)" }))
	}),
	Type.Object({
		action: Type.Literal("move"),
		file_token: Type.String({ description: "File token to move" }),
		type: FileType,
		folder_token: Type.String({ description: "Target folder token" })
	}),
	Type.Object({
		action: Type.Literal("delete"),
		file_token: Type.String({ description: "File token to delete" }),
		type: FileType
	}),
	Type.Object({
		action: Type.Literal("list_comments"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(CommentFileType),
		page_size: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 100,
			description: "Page size"
		})),
		page_token: Type.Optional(Type.String({ description: "Comment page token" }))
	}),
	Type.Object({
		action: Type.Literal("list_comment_replies"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(CommentFileType),
		comment_id: Type.String({ description: "Comment id" }),
		page_size: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 100,
			description: "Page size"
		})),
		page_token: Type.Optional(Type.String({ description: "Reply page token" }))
	}),
	Type.Object({
		action: Type.Literal("add_comment"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(Type.Union([Type.Literal("doc"), Type.Literal("docx")], { description: "Document type. Defaults to docx when omitted." })),
		content: Type.String({ description: "Comment text content" }),
		block_id: Type.Optional(Type.String({ description: "Optional docx block id for a local comment. Omit to create a full-document comment." }))
	}),
	Type.Object({
		action: Type.Literal("reply_comment"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(CommentFileType),
		comment_id: Type.String({ description: "Comment id" }),
		content: Type.String({ description: "Reply text content" })
	})
]);
//#endregion
//#region extensions/feishu/src/drive.ts
var FeishuReplyCommentError = class extends Error {
	constructor(params) {
		super(params.message);
		this.name = "FeishuReplyCommentError";
		this.httpStatus = params.httpStatus;
		this.feishuCode = params.feishuCode;
		this.feishuMsg = params.feishuMsg;
		this.feishuLogId = params.feishuLogId;
	}
};
const FEISHU_DRIVE_REQUEST_TIMEOUT_MS = 3e4;
function getDriveInternalClient(client) {
	return client;
}
function buildReplyElements(content) {
	return [{
		type: "text",
		text: content
	}];
}
async function requestDriveApi(params) {
	return await getDriveInternalClient(params.client).request({
		method: params.method,
		url: params.url,
		params: params.query ?? {},
		data: params.data ?? {},
		timeout: FEISHU_DRIVE_REQUEST_TIMEOUT_MS
	});
}
function assertDriveApiSuccess(response) {
	if (response.code !== 0) throw new Error(response.msg ?? "Feishu Drive API request failed");
	return response;
}
function normalizeCommentReply(reply) {
	return {
		reply_id: reply.reply_id,
		user_id: reply.user_id,
		create_time: reply.create_time,
		update_time: reply.update_time,
		text: extractReplyText(reply)
	};
}
function normalizeCommentCard(comment) {
	const replies = comment.reply_list?.replies ?? [];
	const rootReply = replies[0];
	return {
		comment_id: comment.comment_id,
		user_id: comment.user_id,
		create_time: comment.create_time,
		update_time: comment.update_time,
		is_solved: comment.is_solved,
		is_whole: comment.is_whole,
		quote: comment.quote,
		text: extractReplyText(rootReply),
		has_more_replies: comment.has_more,
		replies_page_token: comment.page_token,
		replies: replies.slice(1).map(normalizeCommentReply)
	};
}
function normalizeCommentPageSize(pageSize) {
	if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) return;
	return String(Math.min(Math.max(Math.floor(pageSize), 1), 100));
}
function resolveAmbientCommentTarget(context) {
	const deliveryContext = context?.deliveryContext;
	if (deliveryContext?.channel && deliveryContext.channel !== "feishu") return null;
	return parseFeishuCommentTarget(deliveryContext?.to);
}
function applyAmbientCommentDefaults(params, context) {
	const ambient = resolveAmbientCommentTarget(context);
	if (!ambient) return params;
	return {
		...params,
		file_token: params.file_token?.trim() || ambient.fileToken,
		file_type: params.file_type ?? ambient.fileType,
		comment_id: params.comment_id?.trim() || ambient.commentId
	};
}
function applyAddCommentAmbientDefaults(params, context) {
	const ambient = resolveAmbientCommentTarget(context);
	if (!ambient || ambient.fileType !== "doc" && ambient.fileType !== "docx") return params;
	return {
		...params,
		file_token: params.file_token?.trim() || ambient.fileToken,
		file_type: params.file_type ?? ambient.fileType
	};
}
function applyAddCommentDefaults(params) {
	const fileType = params.file_type ?? "docx";
	if (!params.file_type) console.info(`[feishu_drive] add_comment missing file_type; defaulting to docx file_token=${params.file_token ?? "unknown"}`);
	return {
		...params,
		file_type: fileType
	};
}
function applyCommentFileTypeDefault(params, action) {
	const fileType = params.file_type ?? "docx";
	if (!params.file_type) console.info(`[feishu_drive] ${action} missing file_type; defaulting to docx file_token=${params.file_token ?? "unknown"}`);
	return {
		...params,
		file_type: fileType
	};
}
function formatDriveApiError(error) {
	return formatFeishuApiError(error, { includeConfigParams: true });
}
function extractDriveApiErrorMeta(error) {
	if (!isRecord(error)) return { message: typeof error === "string" ? error : JSON.stringify(error) };
	const response = isRecord(error.response) ? error.response : void 0;
	const responseData = isRecord(response?.data) ? response?.data : void 0;
	return {
		message: typeof error.message === "string" ? error.message : typeof error === "string" ? error : JSON.stringify(error),
		httpStatus: typeof response?.status === "number" ? response.status : void 0,
		feishuCode: typeof responseData?.code === "number" ? responseData.code : readStringValue(responseData?.code),
		feishuMsg: readStringValue(responseData?.msg),
		feishuLogId: readStringValue(responseData?.log_id)
	};
}
function isReplyNotAllowedError(error) {
	if (!(error instanceof FeishuReplyCommentError)) return false;
	return error.feishuCode === 1069302;
}
async function getRootFolderToken(client) {
	const internalClient = getDriveInternalClient(client);
	const domain = internalClient.domain ?? "https://open.feishu.cn";
	const res = await internalClient.httpInstance.get(`${domain}/open-apis/drive/explorer/v2/root_folder/meta`);
	if (res.code !== 0) throw new Error(res.msg ?? "Failed to get root folder");
	const token = res.data?.token;
	if (!token) throw new Error("Root folder token not found");
	return token;
}
async function listFolder(client, params = {}) {
	const folderToken = typeof params.folder_token === "string" ? params.folder_token.trim() : void 0;
	const validFolderToken = folderToken && folderToken !== "0" ? folderToken : void 0;
	const pageSize = readPositiveIntegerParam(params, "page_size", {
		max: 200,
		message: "page_size must be a positive integer between 1 and 200"
	});
	const pageToken = typeof params.page_token === "string" ? params.page_token.trim() : void 0;
	const listParams = validFolderToken ? {
		folder_token: validFolderToken,
		...pageSize ? { page_size: pageSize } : {},
		...pageToken ? { page_token: pageToken } : {}
	} : {};
	const res = await client.drive.file.list({ params: listParams });
	if (res.code !== 0) throw new Error(res.msg);
	return {
		files: res.data?.files?.map((f) => ({
			token: f.token,
			name: f.name,
			type: f.type,
			url: f.url,
			created_time: f.created_time,
			modified_time: f.modified_time,
			owner_id: f.owner_id
		})) ?? [],
		next_page_token: res.data?.next_page_token
	};
}
async function getRootFileInfo(client, fileToken) {
	const res = await client.drive.file.list({ params: {} });
	if (res.code !== 0) throw new Error(res.msg);
	const file = res.data?.files?.find((candidate) => candidate.token === fileToken);
	if (!file) throw new Error(`File not found: ${fileToken}`);
	return {
		token: file.token,
		name: file.name,
		type: file.type,
		url: file.url,
		created_time: file.created_time,
		modified_time: file.modified_time,
		owner_id: file.owner_id
	};
}
async function getFileInfo(client, fileToken, type) {
	if (type === "shortcut") return getRootFileInfo(client, fileToken);
	let res;
	try {
		res = await client.drive.meta.batchQuery({ data: {
			request_docs: [{
				doc_token: fileToken,
				doc_type: type
			}],
			with_url: true
		} });
	} catch (error) {
		if (extractDriveApiErrorMeta(error).feishuCode === 99991672) return getRootFileInfo(client, fileToken);
		throw error;
	}
	if (res.code === 99991672) return getRootFileInfo(client, fileToken);
	if (res.code !== 0) throw new Error(res.msg);
	const file = res.data?.metas?.find((meta) => meta.doc_token === fileToken || meta.request_doc_info?.doc_token === fileToken);
	if (!file) throw new Error(`File not found: ${fileToken}`);
	return {
		token: file.doc_token,
		name: file.title,
		type: file.doc_type,
		url: file.url,
		created_time: file.create_time,
		modified_time: file.latest_modify_time,
		owner_id: file.owner_id
	};
}
async function createFolder(client, name, folderToken) {
	let effectiveToken = folderToken && folderToken !== "0" ? folderToken : "0";
	if (effectiveToken === "0") try {
		effectiveToken = await getRootFolderToken(client);
	} catch {}
	const res = await client.drive.file.createFolder({ data: {
		name,
		folder_token: effectiveToken
	} });
	if (res.code !== 0) throw new Error(res.msg);
	return {
		token: res.data?.token,
		url: res.data?.url
	};
}
async function moveFile(client, fileToken, type, folderToken) {
	const res = await client.drive.file.move({
		path: { file_token: fileToken },
		data: {
			type,
			folder_token: folderToken
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		success: true,
		task_id: res.data?.task_id
	};
}
async function deleteFile(client, fileToken, type) {
	const res = await client.drive.file.delete({
		path: { file_token: fileToken },
		params: { type }
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		success: true,
		task_id: res.data?.task_id
	};
}
async function listComments(client, params) {
	const response = assertDriveApiSuccess(await requestDriveApi({
		client,
		method: "GET",
		url: `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments` + encodeQuery({
			file_type: params.file_type,
			page_size: normalizeCommentPageSize(params.page_size),
			page_token: params.page_token,
			user_id_type: "open_id"
		})
	}));
	return {
		has_more: response.data?.has_more ?? false,
		page_token: response.data?.page_token,
		comments: (response.data?.items ?? []).map(normalizeCommentCard)
	};
}
async function listCommentReplies(client, params) {
	const response = assertDriveApiSuccess(await requestDriveApi({
		client,
		method: "GET",
		url: `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/${encodeURIComponent(params.comment_id)}/replies` + encodeQuery({
			file_type: params.file_type,
			page_size: normalizeCommentPageSize(params.page_size),
			page_token: params.page_token,
			user_id_type: "open_id"
		})
	}));
	return {
		has_more: response.data?.has_more ?? false,
		page_token: response.data?.page_token,
		replies: (response.data?.items ?? []).map(normalizeCommentReply)
	};
}
async function addComment(client, params) {
	if (params.block_id?.trim() && params.file_type !== "docx") throw new Error("block_id is only supported for docx comments");
	return {
		success: true,
		...assertDriveApiSuccess(await requestDriveApi({
			client,
			method: "POST",
			url: `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/new_comments`,
			data: {
				file_type: params.file_type,
				reply_elements: buildReplyElements(params.content),
				...params.block_id?.trim() ? { anchor: { block_id: params.block_id.trim() } } : {}
			}
		})).data
	};
}
async function queryCommentById(client, params) {
	return assertDriveApiSuccess(await requestDriveApi({
		client,
		method: "POST",
		url: `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/batch_query` + encodeQuery({
			file_type: params.file_type,
			user_id_type: "open_id"
		}),
		data: { comment_ids: [params.comment_id] }
	})).data?.items?.find((comment) => comment.comment_id?.trim() === params.comment_id);
}
async function replyComment(client, params) {
	const url = `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/${encodeURIComponent(params.comment_id)}/replies`;
	const query = { file_type: params.file_type };
	try {
		const response = await requestDriveApi({
			client,
			method: "POST",
			url,
			query,
			data: { content: { elements: [{
				type: "text_run",
				text_run: { text: params.content }
			}] } }
		});
		if (response.code === 0) return {
			success: true,
			...response.data
		};
		console.warn(`[feishu_drive] replyComment failed comment=${params.comment_id} file_type=${params.file_type} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"} log_id=${response.log_id ?? "unknown"}`);
		throw new FeishuReplyCommentError({
			message: response.msg ?? "Feishu Drive reply comment failed",
			feishuCode: response.code,
			feishuMsg: response.msg,
			feishuLogId: response.log_id
		});
	} catch (error) {
		if (error instanceof FeishuReplyCommentError) throw error;
		const meta = extractDriveApiErrorMeta(error);
		console.warn(`[feishu_drive] replyComment threw comment=${params.comment_id} file_type=${params.file_type} error=${formatDriveApiError(error)}`);
		throw new FeishuReplyCommentError({
			message: meta.message,
			httpStatus: meta.httpStatus,
			feishuCode: meta.feishuCode,
			feishuMsg: meta.feishuMsg,
			feishuLogId: meta.feishuLogId
		});
	}
}
async function deliverCommentThreadText(client, params) {
	let isWholeComment = params.is_whole_comment;
	if (isWholeComment === void 0) try {
		isWholeComment = (await queryCommentById(client, params))?.is_whole === true;
	} catch (error) {
		console.warn(`[feishu_drive] comment metadata preflight failed comment=${params.comment_id} file_type=${params.file_type} error=${formatErrorMessage(error)}`);
		isWholeComment = false;
	}
	if (isWholeComment) {
		if (params.file_type !== "doc" && params.file_type !== "docx") throw new Error(`Whole-document comment follow-ups are only supported for doc/docx (got ${params.file_type})`);
		const wholeCommentFileType = params.file_type;
		console.info(`[feishu_drive] whole-comment compatibility path comment=${params.comment_id} file_type=${params.file_type} mode=add_comment`);
		return {
			delivery_mode: "add_comment",
			...await addComment(client, {
				file_token: params.file_token,
				file_type: wholeCommentFileType,
				content: params.content
			})
		};
	}
	try {
		return {
			delivery_mode: "reply_comment",
			...await replyComment(client, params)
		};
	} catch (error) {
		if (error instanceof FeishuReplyCommentError && isReplyNotAllowedError(error)) {
			if (params.file_type !== "doc" && params.file_type !== "docx") throw error;
			const fallbackFileType = params.file_type;
			console.info(`[feishu_drive] reply-not-allowed compatibility path comment=${params.comment_id} file_type=${params.file_type} mode=add_comment log_id=${error.feishuLogId ?? "unknown"}`);
			return {
				delivery_mode: "add_comment",
				...await addComment(client, {
					file_token: params.file_token,
					file_type: fallbackFileType,
					content: params.content
				})
			};
		}
		throw error;
	}
}
function registerFeishuDriveTools(api) {
	if (!api.config) return;
	const accounts = listEnabledFeishuAccounts(api.config);
	if (accounts.length === 0) return;
	if (!resolveAnyEnabledFeishuToolsConfig(accounts).drive) return;
	api.registerTool((ctx) => {
		const defaultAccountId = ctx.agentAccountId;
		return {
			name: "feishu_drive",
			resultContentSource: "network",
			label: "Feishu Drive",
			description: "Feishu cloud storage operations. Actions: list, info, create_folder, move, delete, list_comments, list_comment_replies, add_comment, reply_comment",
			parameters: FeishuDriveSchema,
			async execute(_toolCallId, params) {
				const p = params;
				try {
					const client = createFeishuToolClient({
						api,
						executeParams: p,
						defaultAccountId,
						requiredTool: {
							family: "drive",
							label: "Drive"
						}
					});
					switch (p.action) {
						case "list": return feishuExternalToolResult(await listFolder(client, {
							folder_token: p.folder_token,
							page_size: p.page_size,
							page_token: p.page_token
						}));
						case "info": return feishuExternalToolResult(await getFileInfo(client, p.file_token, p.type));
						case "create_folder": return feishuExternalToolResult(await createFolder(client, p.name, p.folder_token));
						case "move": return feishuExternalToolResult(await moveFile(client, p.file_token, p.type, p.folder_token));
						case "delete": return feishuExternalToolResult(await deleteFile(client, p.file_token, p.type));
						case "list_comments": return feishuExternalToolResult(await listComments(client, applyCommentFileTypeDefault(applyAmbientCommentDefaults(p, ctx), "list_comments")));
						case "list_comment_replies": return feishuExternalToolResult(await listCommentReplies(client, applyCommentFileTypeDefault(applyAmbientCommentDefaults(p, ctx), "list_comment_replies")));
						case "add_comment": {
							const resolved = applyAddCommentDefaults(applyAddCommentAmbientDefaults(p, ctx));
							try {
								return feishuExternalToolResult(await addComment(client, resolved));
							} finally {
								cleanupAmbientCommentTypingReaction({
									client: getDriveInternalClient(client),
									deliveryContext: ctx.deliveryContext
								});
							}
						}
						case "reply_comment": {
							const resolved = applyCommentFileTypeDefault(applyAmbientCommentDefaults(p, ctx), "reply_comment");
							try {
								return feishuExternalToolResult(await deliverCommentThreadText(client, resolved));
							} finally {
								cleanupAmbientCommentTypingReaction({
									client: getDriveInternalClient(client),
									deliveryContext: ctx.deliveryContext
								});
							}
						}
						default: return unknownToolActionResult(p.action);
					}
				} catch (err) {
					return toolExecutionErrorResult(err);
				}
			}
		};
	}, { name: "feishu_drive" });
}
//#endregion
export { resolveFeishuToolAccount as C, resolveAnyEnabledFeishuToolsConfig as S, parseFeishuCommentTarget as _, assertFeishuChatMember as a, unknownToolActionResult as b, getChatMembers as c, encodeQuery as d, extractReplyText as f, normalizeCommentFileType as g, buildFeishuCommentTarget as h, createCommentTypingReactionLifecycle as i, getFeishuMemberInfo as l, requestFeishuApi as m, registerFeishuDriveTools as n, buildFeishuDirectChatMembers as o, parseCommentContentElements as p, cleanupAmbientCommentTypingReaction as r, getChatInfo as s, deliverCommentThreadText as t, registerFeishuChatTools as u, feishuExternalToolResult as v, resolveToolsConfig as w, createFeishuToolClient as x, toolExecutionErrorResult as y };
