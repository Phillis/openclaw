import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { o as normalizeOptionalTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { o as basenameFromMediaSource } from "./read-open-flags-YbtjZqyj.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { n as readTrimmedStringAlias } from "./string-readers-e58-jh1A.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import { r as extensionForMime } from "./mime-Hm4eS2i0.js";
import "./local-file-access-D5Is7hSS.js";
import { o as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./sandbox-paths-Bgdy3T5g.js";
import { K as updateSessionEntry, Qt as loadSessionEntry, fn as getOwnedSessionTranscriptWriterFence } from "./session-accessor-CIiPoGwM.js";
import { o as resolveChannelPluginRegistration, t as getChannelPlugin } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
import { a as hasRestartRecoveryTerminalRun, r as hasActiveRestartRecoverySourceClaim } from "./restart-recovery-state-YPGO30LK.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import { _ as readToolStringParam, b as resolveSnakeCaseParamKey, h as readStringArrayParam } from "./common-ciEJghJz.js";
import "./store-CvNsGg9Z.js";
import { r as resolveChannelThreadAddressing } from "./thread-addressing-rcsJdxP_.js";
import "./sessions-Bh837xaa.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DOeEf3qR.js";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-46PhlDay.js";
import { l as createBoundedOutboundMediaReadFile, n as loadWebMedia } from "./web-media-DRJtrLMa.js";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.js";
import { o as resolveChannelMessageToolMediaSourceParamKeys } from "./message-action-discovery-B7Ggqfek.js";
import { t as hasPotentialPluginActionParam } from "./message-action-param-keys-B9A0lF2Z.js";
import { t as resolveChannelAccountMediaMaxMb } from "./configured-max-bytes-kmWDwnsJ.js";
import { n as resolveOutboundMediaAccess, r as resolveOutboundMediaLocalRoots, t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { t as resolveOutboundAttachmentFromBuffer } from "./outbound-attachment-jndnMZ4P.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
//#region src/infra/outbound/message-action-params.ts
const BASE_ACTION_MEDIA_SOURCE_PARAM_KEYS = [
	"media",
	"path",
	"filePath",
	"mediaUrl",
	"fileUrl",
	"image"
];
const STRUCTURED_ATTACHMENT_MEDIA_SOURCE_PARAM_KEYS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl",
	"url"
];
const STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS = /* @__PURE__ */ new Set([
	"path",
	"filePath",
	"fileUrl"
]);
const SEND_BUFFER_DRY_RUN_MEDIA_URL = "buffer://message-send/attachment";
function readMediaParam(args, key) {
	return readToolStringParam(args, key, { trim: false });
}
function resolveMediaParamEntry(args, key) {
	const resolvedKey = resolveSnakeCaseParamKey(args, key);
	if (!resolvedKey) return;
	const value = readMediaParam(args, key);
	if (!value) return;
	return {
		key: resolvedKey,
		value
	};
}
function hasExplicitAttachmentPayload(args, extraParamKeys) {
	if (readToolStringParam(args, "buffer", { trim: false })) return true;
	return buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
		const entry = resolveMediaParamEntry(args, key);
		return Boolean(entry && normalizeOptionalString(entry.value));
	});
}
function hasExplicitSendMediaSource(args, extraParamKeys) {
	if (buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
		const entry = resolveMediaParamEntry(args, key);
		const value = entry ? normalizeOptionalString(entry.value) : void 0;
		return Boolean(value && value !== SEND_BUFFER_DRY_RUN_MEDIA_URL);
	})) return true;
	if (readStringArrayParam(args, "mediaUrls")?.some((value) => {
		const normalized = normalizeOptionalString(value);
		return Boolean(normalized && normalized !== SEND_BUFFER_DRY_RUN_MEDIA_URL);
	})) return true;
	return collectAttachmentSources(args).some((source) => Boolean(normalizeOptionalString(source.value)));
}
function collectAttachmentSources(args) {
	const attachments = args.attachments;
	if (!Array.isArray(attachments)) return [];
	const sources = [];
	for (const item of attachments) {
		if (!isRecord(item)) continue;
		for (const key of STRUCTURED_ATTACHMENT_MEDIA_SOURCE_PARAM_KEYS) {
			const entry = resolveMediaParamEntry(item, key);
			if (!entry || !normalizeOptionalString(entry.value)) continue;
			sources.push({
				attachment: item,
				key: entry.key,
				value: entry.value,
				kind: STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS.has(key) ? "file" : "media",
				contentType: readToolStringParam(item, "contentType") ?? readToolStringParam(item, "mimeType"),
				filename: readToolStringParam(item, "filename") ?? readToolStringParam(item, "name")
			});
			break;
		}
	}
	return sources;
}
function resolveStructuredAttachmentSource(args, extraParamKeys) {
	if (hasExplicitAttachmentPayload(args, extraParamKeys)) return;
	return collectAttachmentSources(args)[0];
}
function buildActionMediaSourceParamKeys(extraParamKeys) {
	const keys = new Set(BASE_ACTION_MEDIA_SOURCE_PARAM_KEYS);
	extraParamKeys?.forEach((key) => keys.add(key));
	return Array.from(keys);
}
/** Resolves plugin-declared media source param aliases for a message action. */
function resolveExtraActionMediaSourceParamKeys(params) {
	if (!hasPotentialPluginActionParam(params.args)) return [];
	return resolveChannelMessageToolMediaSourceParamKeys({
		cfg: params.cfg,
		action: params.action,
		channel: params.channel,
		accountId: params.accountId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId,
		requesterSenderId: params.requesterSenderId,
		senderIsOwner: params.senderIsOwner
	});
}
/** Collects candidate media source strings from message-action args. */
function collectActionMediaSourceHints(args, extraParamKeys, options) {
	const sources = [];
	for (const key of buildActionMediaSourceParamKeys(extraParamKeys)) {
		const entry = resolveMediaParamEntry(args, key);
		if (entry && normalizeOptionalString(entry.value)) sources.push(entry.value);
	}
	for (const value of readStringArrayParam(args, "mediaUrls") ?? []) if (normalizeOptionalString(value)) sources.push(value);
	if (options?.structuredAttachments === "all") sources.push(...collectAttachmentSources(args).map((source) => source.value));
	else {
		const attachmentSource = resolveStructuredAttachmentSource(args, extraParamKeys);
		if (attachmentSource) sources.push(attachmentSource.value);
	}
	return sources;
}
function readAttachmentMediaHint(args) {
	return readMediaParam(args, "media") ?? readMediaParam(args, "mediaUrl");
}
function readAttachmentFileHint(args) {
	return readMediaParam(args, "path") ?? readMediaParam(args, "filePath") ?? readMediaParam(args, "fileUrl");
}
function resolveAttachmentMaxBytes(params) {
	const limitMb = resolveChannelAccountMediaMaxMb(params) ?? params.cfg.agents?.defaults?.mediaMaxMb;
	return typeof limitMb === "number" ? limitMb * 1024 * 1024 : void 0;
}
function inferAttachmentFilename(params) {
	const mediaHint = params.mediaHint?.trim();
	if (mediaHint) {
		const base = basenameFromMediaSource(mediaHint);
		const safeBase = base ? basenameFromAnyPath(base) : void 0;
		if (safeBase) return safeBase;
	}
	const ext = params.contentType ? extensionForMime(params.contentType) : void 0;
	return ext ? `attachment${ext}` : "attachment";
}
function normalizeBase64Payload(params) {
	if (!params.base64) return {
		base64: params.base64,
		contentType: params.contentType
	};
	const match = /^data:([^;]+);base64,(.*)$/i.exec(params.base64.trim());
	if (!match) return {
		base64: params.base64,
		contentType: params.contentType
	};
	const [, mime, payload] = match;
	return {
		base64: payload,
		contentType: params.contentType ?? mime
	};
}
function resolveSendBufferMaxBytes(params) {
	return resolveAttachmentMaxBytes({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId
	}) ?? 5242880;
}
function decodeBoundedBase64Attachment(params) {
	const estimatedBytes = estimateBase64DecodedBytes(params.base64);
	if (estimatedBytes > params.maxBytes) throw new Error(`Media too large: ${estimatedBytes} bytes (limit: ${params.maxBytes} bytes)`);
	const canonicalBase64 = canonicalizeBase64(params.base64);
	if (!canonicalBase64) throw new Error("message.send buffer has invalid base64 data");
	const buffer = Buffer.from(canonicalBase64, "base64");
	if (buffer.byteLength > params.maxBytes) throw new Error(`Media too large: ${buffer.byteLength} bytes (limit: ${params.maxBytes} bytes)`);
	return buffer;
}
async function hydrateSendBufferMediaParams(params) {
	if (hasExplicitSendMediaSource(params.args, params.extraParamKeys)) {
		delete params.args.buffer;
		return;
	}
	const rawBuffer = readToolStringParam(params.args, "buffer", { trim: false });
	if (!rawBuffer) return;
	const normalized = normalizeBase64Payload({
		base64: rawBuffer,
		contentType: readToolStringParam(params.args, "contentType") ?? void 0
	});
	if (!normalized.base64) return;
	const contentType = readToolStringParam(params.args, "contentType") ?? readToolStringParam(params.args, "mimeType") ?? normalized.contentType;
	const filename = readToolStringParam(params.args, "filename") ?? inferAttachmentFilename({ contentType: contentType ?? void 0 });
	const maxBytes = resolveSendBufferMaxBytes(params);
	if (params.dryRun || params.preserveBuffer) {
		decodeBoundedBase64Attachment({
			base64: normalized.base64,
			maxBytes
		});
		params.args.media = SEND_BUFFER_DRY_RUN_MEDIA_URL;
		params.args.mediaUrl = SEND_BUFFER_DRY_RUN_MEDIA_URL;
		params.args.mediaUrls = [SEND_BUFFER_DRY_RUN_MEDIA_URL];
		if (!params.preserveBuffer) delete params.args.buffer;
		if (normalized.contentType && !readToolStringParam(params.args, "contentType")) params.args.contentType = normalized.contentType;
		if (filename && !readToolStringParam(params.args, "filename")) params.args.filename = filename;
		return;
	}
	const staged = await resolveOutboundAttachmentFromBuffer(decodeBoundedBase64Attachment({
		base64: normalized.base64,
		maxBytes
	}), maxBytes, {
		contentType: contentType ?? void 0,
		filename
	});
	params.args.media = staged.path;
	params.args.mediaUrl = staged.path;
	params.args.mediaUrls = [staged.path];
	delete params.args.buffer;
	if (staged.contentType && !readToolStringParam(params.args, "contentType")) params.args.contentType = staged.contentType;
	if (filename && !readToolStringParam(params.args, "filename")) params.args.filename = filename;
}
/** Chooses sandbox or host media loading policy for attachment hydration. */
function resolveAttachmentMediaPolicy(params) {
	const sandboxRoot = params.sandboxRoot?.trim();
	if (sandboxRoot) return {
		mode: "sandbox",
		sandboxRoot
	};
	const explicitLocalRoots = resolveOutboundMediaLocalRoots(params.mediaLocalRoots);
	return {
		mode: "host",
		mediaAccess: resolveOutboundMediaAccess({
			mediaAccess: params.mediaAccess,
			mediaLocalRoots: explicitLocalRoots === "any" ? void 0 : explicitLocalRoots,
			mediaReadFile: params.mediaAccess?.readFile ? void 0 : params.mediaReadFile
		}),
		...explicitLocalRoots !== void 0 ? { mediaLocalRoots: explicitLocalRoots } : {},
		...params.mediaAccess?.readFile ? {} : params.mediaReadFile ? { mediaReadFile: params.mediaReadFile } : {}
	};
}
function buildAttachmentMediaLoadOptions(params) {
	if (params.policy.mode === "sandbox") {
		const sandboxRoot = params.policy.sandboxRoot.trim();
		let sandboxFsPromise;
		const readSandboxFile = createBoundedOutboundMediaReadFile(async (filePath, options) => {
			sandboxFsPromise ??= root(sandboxRoot);
			return await (await sandboxFsPromise).readBytes(filePath, { maxBytes: options?.maxBytes });
		});
		return {
			maxBytes: params.maxBytes,
			...params.optimizeImages !== void 0 ? { optimizeImages: params.optimizeImages } : {},
			sandboxValidated: true,
			readFile: readSandboxFile
		};
	}
	return buildOutboundMediaLoadOptions({
		maxBytes: params.maxBytes,
		mediaAccess: params.policy.mediaAccess,
		mediaLocalRoots: params.policy.mediaLocalRoots,
		mediaReadFile: params.policy.mediaReadFile,
		optimizeImages: params.optimizeImages
	});
}
async function hydrateAttachmentPayload(params) {
	const contentTypeParam = params.contentTypeParam ?? void 0;
	const rawBuffer = readToolStringParam(params.args, "buffer", { trim: false });
	const normalized = normalizeBase64Payload({
		base64: rawBuffer,
		contentType: contentTypeParam ?? void 0
	});
	if (normalized.base64 !== rawBuffer && normalized.base64) {
		params.args.buffer = normalized.base64;
		if (normalized.contentType && !contentTypeParam) params.args.contentType = normalized.contentType;
	}
	const filename = readToolStringParam(params.args, "filename");
	const mediaSource = (params.mediaHint ?? void 0) || (params.fileHint ?? void 0);
	if (!params.dryRun && !rawBuffer && mediaSource) {
		const maxBytes = resolveAttachmentMaxBytes({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId
		});
		const media = await loadWebMedia(mediaSource, buildAttachmentMediaLoadOptions({
			policy: params.mediaPolicy,
			maxBytes,
			optimizeImages: params.optimizeImages
		}));
		params.args.buffer = media.buffer.toString("base64");
		if (!contentTypeParam && media.contentType) params.args.contentType = media.contentType;
		if (!filename) params.args.filename = inferAttachmentFilename({
			mediaHint: media.fileName ?? mediaSource,
			contentType: media.contentType ?? contentTypeParam ?? void 0
		});
	} else if (!filename) params.args.filename = inferAttachmentFilename({
		mediaHint: mediaSource,
		contentType: contentTypeParam ?? void 0
	});
}
/** Rewrites action media params to sandbox-safe paths and rejects data URLs. */
async function normalizeSandboxMediaParams(params) {
	const sandboxRoot = params.mediaPolicy.mode === "sandbox" ? params.mediaPolicy.sandboxRoot.trim() : void 0;
	for (const key of buildActionMediaSourceParamKeys(params.extraParamKeys)) {
		const entry = resolveMediaParamEntry(params.args, key);
		if (!entry) continue;
		assertMediaNotDataUrl(entry.value);
		if (!sandboxRoot) continue;
		const normalized = await resolveSandboxedMediaSource({
			media: entry.value,
			sandboxRoot
		});
		if (normalized !== entry.value) params.args[entry.key] = normalized;
	}
	const attachmentSources = params.structuredAttachments === "all" ? collectAttachmentSources(params.args) : [resolveStructuredAttachmentSource(params.args, params.extraParamKeys)].filter((source) => Boolean(source));
	if (attachmentSources.length === 0) return;
	for (const attachmentSource of attachmentSources) {
		assertMediaNotDataUrl(attachmentSource.value);
		if (!sandboxRoot) continue;
		const normalized = await resolveSandboxedMediaSource({
			media: attachmentSource.value,
			sandboxRoot
		});
		if (normalized !== attachmentSource.value) attachmentSource.attachment[attachmentSource.key] = normalized;
	}
}
/** Normalizes a list of media hints against an optional sandbox root. */
async function normalizeSandboxMediaList(params) {
	const sandboxRoot = params.sandboxRoot?.trim();
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const value of params.values) {
		const raw = value?.trim();
		if (!raw) continue;
		assertMediaNotDataUrl(raw);
		const resolved = sandboxRoot ? await resolveSandboxedMediaSource({
			media: raw,
			sandboxRoot
		}) : raw;
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		normalized.push(resolved);
	}
	return normalized;
}
async function hydrateAttachmentActionPayload(params) {
	const attachmentSource = resolveStructuredAttachmentSource(params.args, params.extraParamKeys);
	const mediaHint = readAttachmentMediaHint(params.args);
	const fileHint = readAttachmentFileHint(params.args);
	const contentTypeParam = readToolStringParam(params.args, "contentType") ?? readToolStringParam(params.args, "mimeType") ?? attachmentSource?.contentType;
	if (attachmentSource?.filename && !readToolStringParam(params.args, "filename")) params.args.filename = attachmentSource.filename;
	if (attachmentSource?.contentType && !readToolStringParam(params.args, "contentType")) params.args.contentType = attachmentSource.contentType;
	if (params.allowMessageCaptionFallback) {
		const caption = readToolStringParam(params.args, "caption", { allowEmpty: true })?.trim();
		const message = readToolStringParam(params.args, "message", { allowEmpty: true })?.trim();
		if (!caption && message) params.args.caption = message;
	}
	await hydrateAttachmentPayload({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		args: params.args,
		dryRun: params.dryRun,
		contentTypeParam,
		mediaHint: mediaHint ?? (attachmentSource?.kind === "media" ? attachmentSource.value : void 0),
		fileHint: fileHint ?? (attachmentSource?.kind === "file" ? attachmentSource.value : void 0),
		mediaPolicy: params.mediaPolicy,
		optimizeImages: params.optimizeImages
	});
}
/** Hydrates attachment-bearing message actions with base64 buffers and metadata. */
async function hydrateAttachmentParamsForAction(params) {
	const shouldHydrateUploadFile = params.action === "upload-file";
	if (params.action === "send") {
		await hydrateSendBufferMediaParams({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId,
			args: params.args,
			dryRun: params.dryRun,
			preserveBuffer: params.preserveSendBuffer,
			extraParamKeys: params.extraParamKeys
		});
		return;
	}
	if (params.action !== "sendAttachment" && params.action !== "setGroupIcon" && params.action !== "reply" && !shouldHydrateUploadFile) return;
	const forceDocument = readBooleanParam(params.args, "forceDocument") ?? readBooleanParam(params.args, "asDocument") ?? false;
	await hydrateAttachmentActionPayload({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		args: params.args,
		dryRun: params.dryRun,
		mediaPolicy: params.mediaPolicy,
		extraParamKeys: params.extraParamKeys,
		optimizeImages: shouldHydrateUploadFile && forceDocument ? false : void 0,
		allowMessageCaptionFallback: params.action === "sendAttachment" || shouldHydrateUploadFile
	});
}
/** Parses a named string param as JSON for structured message action fields. */
function parseJsonMessageParam(params, key) {
	const raw = params[key];
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	if (!trimmed) {
		delete params[key];
		return;
	}
	try {
		params[key] = JSON.parse(trimmed);
	} catch {
		throw new Error(`--${key} must be valid JSON`);
	}
}
/** Parses the interactive message action param as JSON when provided as a string. */
function parseInteractiveParam(params) {
	const raw = params.interactive;
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	if (!trimmed) {
		delete params.interactive;
		return;
	}
	try {
		params.interactive = JSON.parse(trimmed);
	} catch {
		throw new Error("--interactive must be valid JSON");
	}
}
//#endregion
//#region src/channels/plugins/message-action-dispatch.ts
const BUNDLED_CHANNELS_WITH_PROVIDER_READ_GATES = /* @__PURE__ */ new Set([
	"discord",
	"feishu",
	"matrix",
	"msteams",
	"slack"
]);
const BUNDLED_PROVIDER_READ_GATE_ACTIONS = /* @__PURE__ */ new Map([["mattermost", /* @__PURE__ */ new Set(["read"])], ["telegram", /* @__PURE__ */ new Set([
	"react",
	"edit",
	"delete"
])]]);
const NO_CONVERSATION_READ = { kind: "none" };
const CONVERSATION_READ = {
	kind: "conversation-read",
	targetlessCache: "deny"
};
const CHANNEL_MESSAGE_ACTION_READ_POLICIES = {
	send: NO_CONVERSATION_READ,
	broadcast: NO_CONVERSATION_READ,
	poll: NO_CONVERSATION_READ,
	"poll-vote": CONVERSATION_READ,
	react: CONVERSATION_READ,
	reactions: CONVERSATION_READ,
	read: CONVERSATION_READ,
	edit: CONVERSATION_READ,
	unsend: CONVERSATION_READ,
	reply: NO_CONVERSATION_READ,
	sendWithEffect: NO_CONVERSATION_READ,
	renameGroup: NO_CONVERSATION_READ,
	setGroupIcon: NO_CONVERSATION_READ,
	addParticipant: NO_CONVERSATION_READ,
	removeParticipant: NO_CONVERSATION_READ,
	leaveGroup: NO_CONVERSATION_READ,
	sendAttachment: NO_CONVERSATION_READ,
	delete: CONVERSATION_READ,
	pin: CONVERSATION_READ,
	unpin: CONVERSATION_READ,
	"list-pins": CONVERSATION_READ,
	permissions: CONVERSATION_READ,
	"thread-create": NO_CONVERSATION_READ,
	"thread-list": CONVERSATION_READ,
	"thread-reply": NO_CONVERSATION_READ,
	search: CONVERSATION_READ,
	sticker: NO_CONVERSATION_READ,
	"sticker-search": {
		kind: "conversation-read",
		targetlessCache: "bundled-current-context"
	},
	"member-info": CONVERSATION_READ,
	"role-info": CONVERSATION_READ,
	"emoji-list": CONVERSATION_READ,
	"emoji-upload": NO_CONVERSATION_READ,
	"sticker-upload": NO_CONVERSATION_READ,
	"role-add": NO_CONVERSATION_READ,
	"role-remove": NO_CONVERSATION_READ,
	"channel-info": CONVERSATION_READ,
	"channel-list": CONVERSATION_READ,
	"channel-create": NO_CONVERSATION_READ,
	"channel-edit": NO_CONVERSATION_READ,
	"channel-delete": NO_CONVERSATION_READ,
	"channel-move": NO_CONVERSATION_READ,
	"category-create": NO_CONVERSATION_READ,
	"category-edit": NO_CONVERSATION_READ,
	"category-delete": NO_CONVERSATION_READ,
	"topic-create": NO_CONVERSATION_READ,
	"topic-edit": NO_CONVERSATION_READ,
	"voice-status": CONVERSATION_READ,
	"event-list": CONVERSATION_READ,
	"event-create": NO_CONVERSATION_READ,
	timeout: NO_CONVERSATION_READ,
	kick: NO_CONVERSATION_READ,
	ban: NO_CONVERSATION_READ,
	"set-profile": NO_CONVERSATION_READ,
	"set-presence": NO_CONVERSATION_READ,
	"download-file": CONVERSATION_READ,
	"upload-file": NO_CONVERSATION_READ
};
function resolveChannelMessageActionReadPolicy(action) {
	if (typeof action !== "string" || !Object.hasOwn(CHANNEL_MESSAGE_ACTION_READ_POLICIES, action)) return;
	return CHANNEL_MESSAGE_ACTION_READ_POLICIES[action];
}
function resolveServerOwnedConversationReadOrigin(value) {
	return normalizeConversationReadInvocationOrigin(value);
}
function resolveMessageActionReadEnforcement(params) {
	if (params.pluginOrigin === "bundled" && (BUNDLED_CHANNELS_WITH_PROVIDER_READ_GATES.has(params.channel) || BUNDLED_PROVIDER_READ_GATE_ACTIONS.get(params.channel)?.has(params.action) === true)) return { kind: "provider-owned" };
	return {
		kind: "host-exact-current",
		pluginTrust: params.pluginOrigin === "bundled" ? "bundled" : "external"
	};
}
const HOST_TARGET_KIND_PREFIXES = /* @__PURE__ */ new Set([
	"user",
	"channel",
	"room",
	"chat",
	"group",
	"dm",
	"conversation"
]);
function stripHostProviderPrefix(params) {
	const prefixes = [params.channel, ...params.providerPrefixes ?? []].map((prefix) => prefix.trim().toLowerCase()).filter((prefix) => Boolean(prefix) && !HOST_TARGET_KIND_PREFIXES.has(prefix));
	const lowered = params.value.toLowerCase();
	const prefix = prefixes.find((candidate) => lowered.startsWith(`${candidate}:`));
	return prefix ? params.value.slice(prefix.length + 1).trim() : params.value;
}
function normalizeHostConversationTarget(params) {
	if (typeof params.value !== "string") return;
	const rawValue = params.value.trim();
	const value = params.normalizeTarget ? params.normalizeTarget(rawValue)?.trim() : rawValue;
	if (!value) return;
	const withoutProvider = stripHostProviderPrefix({
		value,
		channel: params.channel,
		providerPrefixes: params.providerPrefixes
	});
	if (!withoutProvider) return;
	const typedTarget = withoutProvider.match(/^(user|channel|room|chat|group|dm|conversation):(.*)$/i);
	if (typedTarget) {
		const id = typedTarget[2]?.trim();
		if (!id) return;
		return {
			id,
			kind: typedTarget[1]?.toLowerCase()
		};
	}
	return {
		id: withoutProvider,
		...params.impliedKind ? { kind: params.impliedKind } : {}
	};
}
function targetKey(target) {
	return `${target.kind ?? ""}\0${target.id}`;
}
function addHostConversationTarget(targets, target) {
	if (target) targets.set(targetKey(target), target);
}
function hasConflictingTargetKinds(targets) {
	const kindsById = /* @__PURE__ */ new Map();
	for (const target of targets) {
		if (!target.kind) continue;
		const kinds = kindsById.get(target.id) ?? /* @__PURE__ */ new Set();
		kinds.add(target.kind);
		kindsById.set(target.id, kinds);
	}
	return Array.from(kindsById.values()).some((kinds) => kinds.size > 1);
}
function currentTargetsMatchRequested(params) {
	const sameId = params.currentTargets.filter((currentTarget) => currentTarget.id === params.requestedTarget.id);
	if (sameId.length === 0 || !params.requestedTarget.kind) return sameId.length > 0;
	const typedCurrentTargets = sameId.filter((currentTarget) => currentTarget.kind);
	if (typedCurrentTargets.length === 0) {
		if (!params.requestedTargets.some((requestedTarget) => requestedTarget.id === params.requestedTarget.id && !requestedTarget.kind)) return false;
		if (params.currentChatType === "direct") return params.requestedTarget.kind === "user" || params.requestedTarget.kind === "dm";
		if (params.currentChatType === "group") return params.requestedTarget.kind === "group" || params.requestedTarget.kind === "room";
		if (params.currentChatType === "channel") return params.requestedTarget.kind === "channel";
		return false;
	}
	return typedCurrentTargets.some((currentTarget) => currentTarget.kind === params.requestedTarget.kind);
}
function hasMatchingCurrentAccountContext(ctx) {
	const rawAccountId = ctx.accountId?.trim() ?? "";
	const rawRequesterAccountId = ctx.requesterAccountId?.trim() ?? "";
	if (!rawRequesterAccountId) return false;
	if (rawAccountId && !normalizeOptionalAccountId(rawAccountId) || !normalizeOptionalAccountId(rawRequesterAccountId)) return false;
	return normalizeAccountId(rawAccountId) === normalizeAccountId(rawRequesterAccountId);
}
function hasMatchingCurrentProviderContext(ctx) {
	const currentProvider = ctx.toolContext?.currentChannelProvider?.trim().toLowerCase();
	return Boolean(currentProvider && currentProvider === ctx.channel.trim().toLowerCase());
}
function hasCurrentConversationTarget(ctx) {
	return [ctx.toolContext?.currentChannelId, ctx.toolContext?.currentMessagingTarget].some((value) => typeof value === "string" && Boolean(value.trim()));
}
function hasTargetInput(value) {
	if (typeof value === "string") return Boolean(value.trim());
	return typeof value === "number" && Number.isFinite(value);
}
function attachExternalCurrentTargetSibling(params) {
	if (params.origin === "direct-operator" || params.actionPolicy.kind !== "conversation-read" || params.enforcement.kind !== "host-exact-current" || params.enforcement.pluginTrust !== "external") return params.ctx;
	const target = typeof params.ctx.params.target === "string" ? params.ctx.params.target.trim() : "";
	if (!target) return params.ctx;
	const mirroredTo = params.ctx.params.to;
	if (typeof mirroredTo !== "string" || mirroredTo.trim() !== target) return params.ctx;
	const providerPrefixes = params.plugin.messaging?.targetPrefixes;
	const requestedTarget = normalizeHostConversationTarget({
		value: target,
		channel: params.ctx.channel,
		providerPrefixes
	});
	if (!requestedTarget) return params.ctx;
	const trustedCurrentTarget = [params.ctx.toolContext?.currentMessagingTarget, params.ctx.toolContext?.currentChannelId].find((value) => {
		const normalized = normalizeHostConversationTarget({
			value,
			channel: params.ctx.channel,
			providerPrefixes
		});
		return normalized?.id === requestedTarget.id && (!requestedTarget.kind || !normalized.kind || normalized.kind === requestedTarget.kind);
	});
	if (typeof trustedCurrentTarget !== "string" || !trustedCurrentTarget.trim()) return params.ctx;
	return {
		...params.ctx,
		params: {
			...params.ctx.params,
			to: trustedCurrentTarget.trim()
		}
	};
}
function isExactCurrentConversation(params) {
	if (!hasMatchingCurrentProviderContext(params.ctx) || !hasMatchingCurrentAccountContext(params.ctx)) return false;
	const normalizeTarget = params.pluginTrust === "bundled" ? params.plugin.messaging?.normalizeTarget : void 0;
	const providerPrefixes = params.plugin.messaging?.targetPrefixes;
	const aliasSpec = params.pluginTrust === "bundled" ? params.plugin.actions?.messageActionTargetAliases?.[params.ctx.action] : void 0;
	const deliveryTargetAliases = new Set(aliasSpec?.deliveryTargetAliases ?? []);
	const requestedTargets = /* @__PURE__ */ new Map();
	for (const [key, impliedKind] of [
		["target", void 0],
		["to", void 0],
		["channelId", "channel"],
		["roomId", "room"],
		["chatId", "chat"]
	]) {
		const rawTarget = params.ctx.params[key];
		if (deliveryTargetAliases.has(key)) continue;
		const normalizedTarget = normalizeHostConversationTarget({
			value: rawTarget,
			channel: params.ctx.channel,
			impliedKind,
			normalizeTarget,
			providerPrefixes
		});
		if (hasTargetInput(rawTarget) && !normalizedTarget) return false;
		addHostConversationTarget(requestedTargets, normalizedTarget);
	}
	let hasDeliveryAliasInput = false;
	let normalizedAliasTarget;
	if (params.pluginTrust === "bundled") {
		hasDeliveryAliasInput = (aliasSpec?.deliveryTargetAliases ?? []).some((alias) => hasTargetInput(params.ctx.params[alias]));
		const resolvedAliasTarget = aliasSpec?.resolveDeliveryTarget?.({ args: params.ctx.params });
		normalizedAliasTarget = normalizeHostConversationTarget({
			value: resolvedAliasTarget,
			channel: params.ctx.channel,
			normalizeTarget,
			providerPrefixes
		});
		if (hasDeliveryAliasInput && !resolvedAliasTarget || resolvedAliasTarget !== void 0 && !normalizedAliasTarget) return false;
		addHostConversationTarget(requestedTargets, normalizedAliasTarget);
	}
	const normalizedAliasTargetKey = normalizedAliasTarget ? targetKey(normalizedAliasTarget) : void 0;
	const nonAliasRequestedTargets = Array.from(requestedTargets.values()).filter((target) => targetKey(target) !== normalizedAliasTargetKey);
	const requestedTargetList = Array.from(requestedTargets.values());
	if (hasConflictingTargetKinds(requestedTargetList)) return false;
	const currentTargets = /* @__PURE__ */ new Map();
	for (const value of [params.ctx.toolContext?.currentChannelId, params.ctx.toolContext?.currentMessagingTarget]) addHostConversationTarget(currentTargets, normalizeHostConversationTarget({
		value,
		channel: params.ctx.channel,
		normalizeTarget,
		providerPrefixes
	}));
	const currentTargetList = Array.from(currentTargets.values());
	if (currentTargetList.length === 0 || hasConflictingTargetKinds(currentTargetList)) return false;
	if (requestedTargetList.length === 0) return false;
	const currentChatType = normalizeChatType(params.ctx.toolContext?.currentChatType);
	const matchesCurrentTarget = (requestedTarget) => currentTargetsMatchRequested({
		currentTargets: currentTargetList,
		requestedTargets: requestedTargetList,
		requestedTarget,
		currentChatType
	});
	if (requestedTargetList.every(matchesCurrentTarget)) return true;
	if (params.pluginTrust !== "bundled" || !hasDeliveryAliasInput || !params.ctx.toolContext || !aliasSpec?.matchesCurrentConversation || !nonAliasRequestedTargets.every(matchesCurrentTarget)) return false;
	return aliasSpec.matchesCurrentConversation({
		args: params.ctx.params,
		accountId: normalizeAccountId(params.ctx.accountId),
		toolContext: params.ctx.toolContext
	});
}
function canonicalizeExternalExactCurrentTarget(ctx) {
	const target = ctx.params.target;
	const resolvedTarget = [ctx.params.to, ctx.params.channelId].find((value) => typeof value === "string" && Boolean(value.trim()));
	if (typeof target === "string" && target.trim() && resolvedTarget) ctx.params.target = resolvedTarget;
}
function prepareMessageActionReadContext(ctx) {
	const actionPolicy = resolveChannelMessageActionReadPolicy(ctx.action);
	if (!actionPolicy) return;
	const registration = resolveChannelPluginRegistration(ctx.channel);
	if (!registration) return;
	const action = ctx.action;
	const origin = resolveServerOwnedConversationReadOrigin(ctx.conversationReadOrigin);
	const actionContext = {
		...ctx,
		action,
		conversationReadOrigin: origin
	};
	return {
		actionContext,
		plugin: registration.plugin,
		origin,
		actionPolicy,
		enforcement: resolveMessageActionReadEnforcement({
			action,
			channel: actionContext.channel,
			pluginOrigin: registration.origin
		})
	};
}
function isExternalDelegatedMessageActionRead(prepared) {
	return Boolean(prepared && prepared.origin !== "direct-operator" && prepared.actionPolicy.kind === "conversation-read" && prepared.enforcement.kind === "host-exact-current" && prepared.enforcement.pluginTrust === "external");
}
/** The sole host chokepoint before any read-capable plugin callback runs. */
function enforceMessageActionConversationReadGate(params) {
	if (params.actionPolicy.kind === "none" || params.origin === "direct-operator") return;
	if (params.enforcement.kind === "provider-owned") return;
	if (!(params.enforcement.pluginTrust === "bundled" && params.actionPolicy.targetlessCache === "bundled-current-context" && hasMatchingCurrentProviderContext(params.ctx) && hasMatchingCurrentAccountContext(params.ctx) && hasCurrentConversationTarget(params.ctx) || isExactCurrentConversation({
		ctx: params.ctx,
		plugin: params.plugin,
		pluginTrust: params.enforcement.pluginTrust
	}))) throw new Error(`Delegated ${params.ctx.channel}:${params.ctx.action} requires the exact current conversation and account for this plugin.`);
	if (params.enforcement.pluginTrust === "external") canonicalizeExternalExactCurrentTarget(params.ctx);
}
/** Authorizes and canonicalizes external exact-current targets before target resolution. */
function prepareExternalMessageActionTargetForResolution(ctx) {
	const prepared = prepareMessageActionReadContext(ctx);
	if (!isExternalDelegatedMessageActionRead(prepared)) return ctx.params;
	const authorizedActionContext = attachExternalCurrentTargetSibling({
		ctx: prepared.actionContext,
		plugin: prepared.plugin,
		origin: prepared.origin,
		actionPolicy: prepared.actionPolicy,
		enforcement: prepared.enforcement
	});
	enforceMessageActionConversationReadGate({
		ctx: authorizedActionContext,
		plugin: prepared.plugin,
		origin: prepared.origin,
		actionPolicy: prepared.actionPolicy,
		enforcement: prepared.enforcement
	});
	return authorizedActionContext.params;
}
/** Defers delegated external target interpretation to the attested Gateway boundary. */
function shouldDeferExternalMessageActionTargetResolution(ctx) {
	return isExternalDelegatedMessageActionRead(prepareMessageActionReadContext(ctx));
}
function requiresTrustedRequesterSender(ctx, plugin) {
	return Boolean(plugin?.actions?.requiresTrustedRequesterSender?.({
		action: ctx.action,
		toolContext: ctx.toolContext
	}));
}
/**
* Runs a channel message action if the target plugin supports it.
*/
async function dispatchChannelMessageAction(ctx) {
	const prepared = prepareMessageActionReadContext(ctx);
	if (!prepared) return null;
	const { actionContext, plugin, origin, actionPolicy, enforcement } = prepared;
	const actions = plugin.actions;
	if (!actions?.handleAction) return null;
	const authorizedActionContext = attachExternalCurrentTargetSibling({
		ctx: actionContext,
		plugin,
		origin,
		actionPolicy,
		enforcement
	});
	enforceMessageActionConversationReadGate({
		ctx: authorizedActionContext,
		plugin,
		origin,
		actionPolicy,
		enforcement
	});
	if (requiresTrustedRequesterSender(authorizedActionContext, plugin) && !authorizedActionContext.requesterSenderId?.trim()) throw new Error(`Trusted sender identity is required for ${authorizedActionContext.channel}:${authorizedActionContext.action} in tool-driven contexts.`);
	if (actions.supportsAction && !actions.supportsAction({ action: authorizedActionContext.action })) return null;
	return await actions.handleAction(authorizedActionContext);
}
//#endregion
//#region src/config/sessions/restart-recovery-receipt.ts
function hasActiveClaim(entry, scope) {
	return entry.sessionId === scope.sessionId && hasActiveRestartRecoverySourceClaim(entry, scope.sourceTurnId);
}
function hasExactDeliveryClaim(entry, scope) {
	return hasActiveClaim(entry, scope) && entry.restartRecoveryDeliveryToolCallId === scope.toolCallId;
}
function hasClaimlessLiveDeliveryState(entry, scope) {
	return entry.sessionId === scope.sessionId && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === void 0 && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === void 0 && entry.restartRecoveryDeliveryReceiptState === void 0 && normalizeOptionalString(entry.restartRecoveryDeliveryToolCallId) === void 0;
}
function loadCurrent(scope) {
	return loadSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath,
		readConsistency: "latest"
	});
}
/** Persists ambiguity before a terminal external send is allowed to start. */
async function beginRestartRecoveryTerminalDelivery(scope) {
	let started = false;
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasActiveClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState || entry.restartRecoveryDeliveryToolCallId) return null;
		started = true;
		return {
			restartRecoveryDeliveryReceiptState: "terminal-pending",
			restartRecoveryDeliveryToolCallId: scope.toolCallId,
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (started && updated !== null && hasExactDeliveryClaim(updated, scope) && updated.restartRecoveryDeliveryReceiptState === "terminal-pending") return "started";
	const current = loadCurrent(scope);
	if (current?.sessionId === scope.sessionId && hasRestartRecoveryTerminalRun(current, scope.sourceTurnId)) return "already-delivered";
	if (current && hasClaimlessLiveDeliveryState(current, scope)) return "not-applicable";
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (current.restartRecoveryDeliveryReceiptState || current.restartRecoveryDeliveryToolCallId) return current.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? "already-delivered" : "delivery-ambiguous";
	throw new Error("failed to persist terminal delivery intent");
}
/** Resolves a pre-send ambiguity only after the provider confirms delivery. */
async function completeRestartRecoveryTerminalDelivery(scope) {
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasExactDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
		return {
			restartRecoveryDeliveryReceiptState: "delivered-terminal",
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (updated !== null && hasExactDeliveryClaim(updated, scope) && updated.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	throw new Error("failed to persist terminal delivery completion");
}
/** Clears the pre-send intent only when the provider proves no delivery occurred. */
async function cancelRestartRecoveryTerminalDelivery(scope) {
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasExactDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
		return {
			restartRecoveryDeliveryReceiptState: void 0,
			restartRecoveryDeliveryToolCallId: void 0,
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (updated !== null && hasActiveClaim(updated, scope) && !updated.restartRecoveryDeliveryReceiptState && !updated.restartRecoveryDeliveryToolCallId) return "cleared";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (!current.restartRecoveryDeliveryReceiptState && !current.restartRecoveryDeliveryToolCallId) return "cleared";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "stale";
	throw new Error("failed to clear terminal delivery intent");
}
//#endregion
//#region src/infra/outbound/source-reply-mirror.ts
function buildTerminalSourceReplyNoSendResult(outcome) {
	return {
		outcome,
		result: {
			status: outcome,
			delivered: false,
			message: outcome === "already_delivered" ? "The completed reply was already delivered. Do not retry it." : "The completed reply may already have been delivered. Do not retry it."
		}
	};
}
function readStringArray(value) {
	return normalizeOptionalTrimmedStringList(value);
}
function readFirstString(params, keys) {
	return readTrimmedStringAlias(params, keys);
}
function resolveSourceReplyTarget(params) {
	return readFirstString(params, [
		"target",
		"to",
		"channelId",
		"chatId"
	]);
}
function resolveSourceReplyThreadId(params) {
	return readFirstString(params.actionParams, ["threadId", "messageThreadId"]);
}
function resolveDeliveredThreadPlacement(params, currentThreadId) {
	const payload = asOptionalRecord(params.deliveredPayload);
	const receipt = asOptionalRecord(asOptionalRecord(payload?.result)?.receipt) ?? asOptionalRecord(payload?.receipt);
	if (!receipt) return;
	const deliveredThreadId = normalizeOptionalString(receipt.threadId);
	return deliveredThreadId ? deliveredThreadId === currentThreadId ? "match" : "mismatch" : currentThreadId ? "mismatch" : "match";
}
function resolveSourceReplyThreadPlacement(params, threadAddressing) {
	const currentThreadId = normalizeOptionalString(params.toolContext?.currentThreadTs);
	const deliveredPlacement = resolveDeliveredThreadPlacement(params, currentThreadId);
	if (deliveredPlacement) return deliveredPlacement;
	if (params.actionParams.topLevel === true) return currentThreadId ? "mismatch" : "match";
	if (threadAddressing === "message" && params.replyToIsExplicit === true && !currentThreadId && normalizeOptionalString(params.actionParams.replyTo)) return "mismatch";
	for (const key of ["threadId", "messageThreadId"]) {
		if (!Object.hasOwn(params.actionParams, key)) continue;
		const explicitThreadId = normalizeOptionalString(params.actionParams[key]);
		if (!explicitThreadId) return currentThreadId ? "mismatch" : "match";
		return explicitThreadId === currentThreadId ? "match" : "mismatch";
	}
	return currentThreadId ? "unknown" : "match";
}
function resolveThreadedSourceTarget(params, requestedTarget) {
	const threadId = resolveSourceReplyThreadId(params);
	if (!threadId) return requestedTarget;
	return normalizeOptionalString(getChannelPlugin(params.channel)?.threading?.resolveCurrentChannelId?.({
		to: requestedTarget,
		threadId
	})) ?? requestedTarget;
}
function hasExplicitDeliveryFailure(payload, depth = 0) {
	if (!payload || typeof payload !== "object" || depth > 4) return false;
	if (Array.isArray(payload)) return payload.some((value) => hasExplicitDeliveryFailure(value, depth + 1));
	const record = payload;
	if (record.ok === false || record.delivered === false || record.dryRun === true) return true;
	const messageId = normalizeOptionalLowercaseString(record.messageId);
	if (messageId === "skipped" || messageId === "suppressed") return true;
	const status = normalizeOptionalLowercaseString(record.status);
	if (status === "failed" || status === "error" || status === "skipped" || status === "suppressed" || status === "dry_run") return true;
	const deliveryStatus = normalizeOptionalLowercaseString(record.deliveryStatus);
	if (deliveryStatus === "failed" || deliveryStatus === "error" || deliveryStatus === "skipped" || deliveryStatus === "suppressed" || deliveryStatus === "dry_run") return true;
	return [
		"details",
		"payload",
		"result",
		"results",
		"sendResult",
		"toolResult"
	].some((key) => hasExplicitDeliveryFailure(record[key], depth + 1));
}
function resolveCurrentSourceTurnId(toolContext) {
	return normalizeOptionalString(toolContext?.currentSourceTurnId);
}
function resolveTerminalSourceReplyDeliveryReceipt(params) {
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (params.sourceReplyFinal !== true) return;
	if (!toolCallId) throw new Error("terminal source reply requires tool-call correlation");
	if (!params.sessionId || !isCurrentSourceConversation(params)) return;
	const sourceTurnId = resolveCurrentSourceTurnId(params.toolContext);
	if (!sourceTurnId) return;
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sourceTurnId,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
		toolCallId
	};
}
/** Arms the fail-closed state before a terminal source reply can reach a provider. */
async function beginTerminalSourceReplyDelivery(params) {
	const receipt = resolveTerminalSourceReplyDeliveryReceipt(params);
	if (!receipt) return;
	const result = await beginRestartRecoveryTerminalDelivery(receipt);
	if (result === "not-applicable") return;
	if (result === "already-delivered") return buildTerminalSourceReplyNoSendResult("already_delivered");
	if (result === "delivery-ambiguous" || result === "stale") return buildTerminalSourceReplyNoSendResult("delivery_ambiguous");
	return receipt;
}
/** Cancels a pre-send intent only when dispatch proved that no send occurred. */
async function cancelTerminalSourceReplyDelivery(receipt) {
	if (receipt) await cancelRestartRecoveryTerminalDelivery(receipt);
}
/** Reconciles the provider result while an unresolved intent remains fail closed. */
async function reconcileTerminalSourceReplyDelivery(params) {
	if (!params.receipt) return "not-applicable";
	if (hasExplicitDeliveryFailure(params.deliveredPayload)) {
		if (params.preservePendingOnExplicitFailure) return "pending";
		await cancelRestartRecoveryTerminalDelivery(params.receipt);
		return "not-delivered";
	}
	if (!isExactCurrentSourceConversation({
		...params.mirror,
		deliveredPayload: params.deliveredPayload
	})) return "not-source";
	await completeRestartRecoveryTerminalDelivery(params.receipt);
	return "delivered";
}
function resolveTranscriptMirrorIdempotencyKey(params) {
	if (params.sourceReplyFinal !== true || !params.idempotencyKey || !params.sourceTurnId) return params.idempotencyKey;
	return `${params.idempotencyKey}:terminal-receipt:${params.sourceTurnId}`;
}
function isCurrentSourceConversation(params, threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel))) {
	if (params.action !== "send" && params.action !== "poll") return false;
	if (!params.sessionKey?.trim()) return false;
	const toolContext = params.toolContext;
	if (!toolContext) return false;
	const accountId = normalizeOptionalString(params.accountId);
	if (accountId) {
		const currentAccountId = normalizeOptionalString(params.currentAccountId);
		if (!currentAccountId || normalizeAccountId(accountId) !== normalizeAccountId(currentAccountId)) return false;
	}
	const currentChannel = normalizeOptionalLowercaseString(toolContext.currentChannelProvider);
	if (!currentChannel || currentChannel !== normalizeOptionalLowercaseString(params.channel)) return false;
	const currentTargets = [normalizeOptionalString(toolContext.currentMessagingTarget), normalizeOptionalString(toolContext.currentChannelId)].filter((target) => Boolean(target));
	if (currentTargets.length === 0) return false;
	const requestedTarget = resolveSourceReplyTarget(params.actionParams);
	if (!requestedTarget) return false;
	if (threadPlacement === "mismatch") return false;
	const threadedTarget = resolveThreadedSourceTarget(params, requestedTarget);
	const matchesToolContextTarget = getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget;
	if (threadPlacement === "match" && (matchesToolContextTarget?.({
		target: requestedTarget,
		toolContext
	}) || threadedTarget !== requestedTarget && matchesToolContextTarget?.({
		target: threadedTarget,
		toolContext
	}))) return true;
	return currentTargets.some((currentTarget) => requestedTarget === currentTarget || threadedTarget === currentTarget);
}
function isExactCurrentSourceConversation(params) {
	const threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel));
	return threadPlacement === "match" && isCurrentSourceConversation(params, threadPlacement);
}
/** Confirms that a successful send reached the exact trusted source conversation. */
function isDeliveredCurrentSourceReply(params) {
	return !hasExplicitDeliveryFailure(params.deliveredPayload) && isExactCurrentSourceConversation(params);
}
const CURRENT_SOURCE_REPLY_ACTION_NAMES = /* @__PURE__ */ new Set(["reply"]);
/** Reply-type message actions address a message id rather than a conversation target. */
function isCurrentSourceReplyActionName(action) {
	return CURRENT_SOURCE_REPLY_ACTION_NAMES.has(action.trim().toLowerCase());
}
function normalizeMessageIdValue(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return normalizeOptionalString(value);
}
/**
* Confirms a successful reply-type action addressed the message that triggered the
* current run. Reply actions resolve their conversation from the replied-to message,
* so target matching cannot apply; replying to the run's own inbound message is the
* one implicit route that provably lands in the current source conversation.
*/
function isDeliveredCurrentSourceReplyAction(params) {
	if (!isCurrentSourceReplyActionName(params.action)) return false;
	if (hasExplicitDeliveryFailure(params.deliveredPayload)) return false;
	if (!params.sessionKey?.trim()) return false;
	const toolContext = params.toolContext;
	if (!toolContext) return false;
	const accountId = normalizeOptionalString(params.accountId);
	if (accountId) {
		const currentAccountId = normalizeOptionalString(params.currentAccountId);
		if (!currentAccountId || normalizeAccountId(accountId) !== normalizeAccountId(currentAccountId)) return false;
	}
	const currentChannel = normalizeOptionalLowercaseString(toolContext.currentChannelProvider);
	if (!currentChannel || currentChannel !== normalizeOptionalLowercaseString(params.channel)) return false;
	const requestedTarget = resolveSourceReplyTarget(params.actionParams);
	if (requestedTarget) {
		const matchesToolContextTarget = getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget;
		if (!matchesToolContextTarget?.({
			target: requestedTarget,
			toolContext
		})) {
			if (![normalizeOptionalString(toolContext.currentMessagingTarget), normalizeOptionalString(toolContext.currentChannelId)].filter((target) => Boolean(target)).some((target) => target === requestedTarget)) return false;
		}
	}
	const repliedToMessageId = normalizeMessageIdValue(params.actionParams.messageId ?? params.actionParams.replyTo);
	const currentMessageId = normalizeMessageIdValue(toolContext.currentMessageId);
	return Boolean(repliedToMessageId && currentMessageId && repliedToMessageId === currentMessageId);
}
/** Mirrors successful outbound source replies into the owning session transcript. */
async function mirrorDeliveredSourceReplyToTranscript(params) {
	if (hasExplicitDeliveryFailure(params.deliveredPayload)) return false;
	const threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel));
	if (!isCurrentSourceConversation(params, threadPlacement)) return false;
	if (params.sourceReplyFinal === true && threadPlacement !== "match") return false;
	const mirror = projectOutboundPayloadPlanForMirror(createOutboundPayloadPlan([{
		text: readFirstString(params.actionParams, [
			"message",
			"content",
			"text",
			"caption"
		]) ?? "",
		mediaUrl: readFirstString(params.actionParams, [
			"mediaUrl",
			"media",
			"path",
			"filePath",
			"fileUrl"
		]),
		mediaUrls: readStringArray(params.actionParams.mediaUrls),
		presentation: params.actionParams.presentation,
		interactive: params.actionParams.interactive,
		channelData: params.actionParams.channelData
	}]));
	if (!mirror.text && mirror.mediaUrls.length === 0) return false;
	const sourceTurnId = resolveCurrentSourceTurnId(params.toolContext);
	const writerFence = getOwnedSessionTranscriptWriterFence();
	if ((await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		...params.sessionId ? { expectedSessionId: params.sessionId } : {},
		...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
		...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
		text: mirror.text,
		mediaUrls: mirror.mediaUrls.length ? mirror.mediaUrls : void 0,
		idempotencyKey: resolveTranscriptMirrorIdempotencyKey({
			idempotencyKey: params.idempotencyKey,
			sourceReplyFinal: params.sourceReplyFinal,
			sourceTurnId
		}),
		...params.sourceReplyFinal !== void 0 ? { deliveryMirror: {
			kind: "message-tool-source-reply",
			final: params.sourceReplyFinal,
			...params.toolCallId ? { toolCallId: params.toolCallId } : {},
			...sourceTurnId ? { sourceTurnId } : {}
		} } : {},
		config: params.cfg
	})).ok) return true;
	return false;
}
//#endregion
export { parseJsonMessageParam as _, isDeliveredCurrentSourceReplyAction as a, dispatchChannelMessageAction as c, collectActionMediaSourceHints as d, collectAttachmentSources as f, parseInteractiveParam as g, normalizeSandboxMediaParams as h, isDeliveredCurrentSourceReply as i, prepareExternalMessageActionTargetForResolution as l, normalizeSandboxMediaList as m, cancelTerminalSourceReplyDelivery as n, mirrorDeliveredSourceReplyToTranscript as o, hydrateAttachmentParamsForAction as p, isCurrentSourceReplyActionName as r, reconcileTerminalSourceReplyDelivery as s, beginTerminalSourceReplyDelivery as t, shouldDeferExternalMessageActionTargetResolution as u, resolveAttachmentMediaPolicy as v, resolveExtraActionMediaSourceParamKeys as y };
