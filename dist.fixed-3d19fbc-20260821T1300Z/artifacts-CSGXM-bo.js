import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { b as toAgentStoreSessionKey, f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CLtsGq3M.js";
import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId } from "./session-store-key-Cc0gbvo8.js";
import { _ as validateArtifactsDownloadParams, v as validateArtifactsGetParams, y as validateArtifactsListParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { a as getTaskSessionLookupByIdForStatus } from "./task-status-access-DsWf7lJY.js";
import { h as visitSessionMessagesAsync } from "./session-transcript-readers-BIeuEaZ3.js";
import { E as loadGatewaySessionEntryReadOnly } from "./session-utils-row-xwseApeF.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId, t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import "./session-utils-DvNvk7rk.js";
import { d as resolveManagedOutgoingMediaArtifactDownload, f as resolveManagedOutgoingMediaUrlDownload, l as parseManagedOutgoingArtifactId } from "./managed-image-attachments-DD5GTN3S.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as resolveSessionKeyForRun } from "./server-session-key-CHq7Q-qx.js";
import { createHash } from "node:crypto";
//#region src/gateway/server-methods/artifacts-base64.ts
function mimeFromDataUrl(value) {
	return /^data:([^;,]+)(?:;[^,]*)?,/i.exec(value.trim())?.[1]?.toLowerCase();
}
function base64FromDataUrl(value) {
	const trimmed = value.trim();
	const commaIndex = trimmed.indexOf(",");
	if (commaIndex < 0 || trimmed.slice(0, 5).toLowerCase() !== "data:") return;
	if (!trimmed.slice(0, commaIndex).toLowerCase().includes(";base64")) return;
	return trimmed.slice(commaIndex + 1);
}
function isBase64Whitespace(value) {
	return value === " " || value === "\n" || value === "\r" || value === "	";
}
function isArtifactBase64DataChar(value) {
	const code = value.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || value === "+" || value === "/" || value === "-" || value === "_";
}
function normalizeArtifactBase64Char(value) {
	if (value === "-") return "+";
	if (value === "_") return "/";
	return value;
}
function readArtifactBase64Payload(value, opts) {
	if (value === void 0) return;
	let encodedLength = 0;
	let padding = 0;
	let sawPadding = false;
	let data = opts.includeData ? "" : void 0;
	for (const char of value) {
		if (isBase64Whitespace(char)) continue;
		if (char === "=") {
			padding += 1;
			if (padding > 2) return;
			sawPadding = true;
			encodedLength += 1;
			if (data !== void 0) data += char;
			continue;
		}
		if (sawPadding || !isArtifactBase64DataChar(char)) return;
		encodedLength += 1;
		if (data !== void 0) data += normalizeArtifactBase64Char(char);
	}
	const remainder = encodedLength % 4;
	if (padding > 0 && remainder !== 0 || remainder === 1) return;
	if (data !== void 0 && padding === 0 && remainder > 0) data += "=".repeat(4 - remainder);
	return {
		...data !== void 0 ? { data } : {},
		sizeBytes: Math.max(0, Math.floor(encodedLength * 3 / 4) - padding)
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts.ts
function admitArtifactQuery(query, cfg, respond) {
	const sessionKey = normalizeOptionalString(query.sessionKey);
	if (!sessionKey || !cfg) return query;
	const owner = resolveRequestedSessionAgentId(cfg, sessionKey, query.agentId);
	if (!owner.ok) {
		respond(false, void 0, owner.error);
		return;
	}
	return {
		...query,
		agentId: owner.agentId
	};
}
function artifactError(type, message, details) {
	return errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
		type,
		...details
	} });
}
function resolveArtifactSessionAgentId(sessionKey, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	const parsed = parseAgentSessionKey(key);
	if (!parsed && key.toLowerCase().startsWith("agent:")) return;
	if (cfg) {
		const owner = resolveRequestedSessionAgentId(cfg, key);
		if (!owner.ok) throw new ArtifactSessionResolutionError(owner.error);
		return owner.agentId;
	}
	if (parsed) return parsed.agentId;
	return resolveAgentIdFromSessionKey(key);
}
/** Applies an optional agent scope to a transcript session key without crossing stores. */
function resolveScopedArtifactSessionKey(sessionKey, agentId, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	const scopedAgentId = normalizeOptionalString(agentId);
	if (!scopedAgentId) return key;
	const parsed = parseAgentSessionKey(key);
	if (!parsed && key.toLowerCase().startsWith("agent:")) return;
	if (cfg) {
		const scopedKey = resolveStoredSessionKeyForAgentStore({
			cfg,
			agentId: scopedAgentId,
			sessionKey: key
		});
		if (scopedKey !== "global" && scopedKey !== "unknown" && resolveSessionStoreAgentId(cfg, scopedKey) !== normalizeAgentId(scopedAgentId)) return;
		return scopedKey;
	}
	if (parsed && parsed.agentId !== normalizeAgentId(scopedAgentId)) return;
	return toAgentStoreSessionKey({
		agentId: scopedAgentId,
		requestKey: key
	});
}
function normalizeArtifactType(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "image" || normalized === "input_image" || normalized === "image_url") return "image";
	if (normalized === "audio" || normalized === "input_audio") return "audio";
	if (normalized === "video" || normalized === "input_video") return "video";
	if (normalized === "file" || normalized === "input_file") return "file";
	return "file";
}
function mediaUrlValue(value) {
	if (typeof value === "string") return normalizeOptionalString(value);
	return normalizeOptionalString(asOptionalRecord(value)?.url);
}
function isSafeDownloadUrl(value) {
	const trimmed = value.trim();
	if (!trimmed || /^data:/i.test(trimmed)) return false;
	if (trimmed.startsWith("/")) return !trimmed.startsWith("//") && trimmed.startsWith("/api/");
	return isHttpUrl(trimmed);
}
/** Generates a stable id from transcript position plus display metadata. */
function artifactId(parts) {
	return `artifact_${createHash("sha256").update(`${parts.sessionKey}\0${parts.messageSeq}\0${parts.contentIndex}\0${parts.type}\0${parts.title}`).digest("base64url").slice(0, 18)}`;
}
function resolveMessageSeq(message, fallback) {
	const seq = asOptionalRecord(message["__openclaw"])?.seq;
	return typeof seq === "number" && Number.isInteger(seq) && seq > 0 ? seq : fallback;
}
function resolveMessageRunId(message) {
	return normalizeOptionalString(asOptionalRecord(message["__openclaw"])?.runId) ?? normalizeOptionalString(message.runId);
}
function resolveMessageTaskId(message) {
	const meta = asOptionalRecord(message["__openclaw"]);
	return normalizeOptionalString(meta?.messageTaskId) ?? normalizeOptionalString(meta?.taskId) ?? normalizeOptionalString(message.messageTaskId) ?? normalizeOptionalString(message.taskId);
}
function resolveBlockDownload(block, opts) {
	const data = readStringValue(block.data)?.trim();
	const content = readStringValue(block.content)?.trim();
	const url = normalizeOptionalString(block.url) ?? normalizeOptionalString(block.openUrl);
	const imageUrl = mediaUrlValue(block.image_url);
	const audioUrl = normalizeOptionalString(block.audio_url);
	const source = asOptionalRecord(block.source);
	const sourceData = readStringValue(source?.data)?.trim();
	const sourceUrl = normalizeOptionalString(source?.url);
	const dataUrl = [
		url,
		sourceUrl,
		imageUrl,
		audioUrl,
		data,
		content,
		sourceData
	].find((value) => typeof value === "string" && /^data:/i.test(value));
	const base64FromDetectedDataUrl = readArtifactBase64Payload(dataUrl ? base64FromDataUrl(dataUrl) : void 0, opts);
	const directBase64 = [
		data,
		sourceData,
		content
	].filter((value) => typeof value === "string" && !/^data:/i.test(value)).map((value) => readArtifactBase64Payload(value, opts)).find((value) => value !== void 0);
	const base64 = base64FromDetectedDataUrl ?? directBase64;
	const remoteUrl = [
		url,
		sourceUrl,
		imageUrl,
		audioUrl
	].find((value) => typeof value === "string" && isSafeDownloadUrl(value));
	const mimeType = normalizeOptionalString(block.mimeType) ?? normalizeOptionalString(block.media_type) ?? normalizeOptionalString(source?.media_type) ?? normalizeOptionalString(source?.mimeType) ?? (dataUrl ? mimeFromDataUrl(dataUrl) : void 0);
	const explicitSize = block.sizeBytes ?? source?.sizeBytes;
	const sizeBytes = typeof explicitSize === "number" && Number.isFinite(explicitSize) && explicitSize >= 0 ? Math.floor(explicitSize) : base64?.sizeBytes;
	if (base64) return {
		mode: "bytes",
		data: base64.data,
		mimeType,
		sizeBytes
	};
	if (remoteUrl) return {
		mode: "url",
		url: remoteUrl,
		mimeType,
		sizeBytes
	};
	return {
		mode: "unsupported",
		mimeType,
		sizeBytes
	};
}
function isArtifactBlock(block) {
	const type = normalizeOptionalString(block.type)?.toLowerCase();
	if (type === "image" || type === "audio" || type === "video" || type === "file" || type === "input_image" || type === "input_audio" || type === "input_video" || type === "input_file" || type === "image_url") return true;
	return typeof block.data === "string" || Boolean(block.url || block.openUrl || block.source || block.image_url || block.audio_url);
}
function collectArtifactsFromMessage(params) {
	const msg = asOptionalRecord(params.message);
	if (!msg) return;
	const messageSeq = resolveMessageSeq(msg, params.messageFallbackSeq);
	const messageRunId = resolveMessageRunId(msg);
	const messageTaskId = resolveMessageTaskId(msg);
	if (params.runId && messageRunId !== params.runId) return;
	if (params.taskId && messageTaskId !== params.taskId) return;
	const content = Array.isArray(msg.content) ? msg.content : [];
	for (let contentIndex = 0; contentIndex < content.length; contentIndex += 1) {
		const block = asOptionalRecord(content[contentIndex]);
		if (!block || !isArtifactBlock(block)) continue;
		const type = normalizeArtifactType(normalizeOptionalString(block.type) ?? "file");
		const title = normalizeOptionalString(block.title) ?? normalizeOptionalString(block.fileName) ?? normalizeOptionalString(block.filename) ?? normalizeOptionalString(block.alt) ?? `${type} ${params.artifacts.length + 1}`;
		const declaredArtifactId = normalizeOptionalString(block.artifactId);
		const id = declaredArtifactId && parseManagedOutgoingArtifactId(declaredArtifactId) ? declaredArtifactId : artifactId({
			sessionKey: params.sessionKey,
			messageSeq,
			contentIndex,
			title,
			type
		});
		const download = resolveBlockDownload(block, { includeData: params.downloadArtifactId ? params.downloadArtifactId === id : params.includeDownloadData !== false });
		const summary = {
			id,
			type,
			title,
			...download.mimeType ? { mimeType: download.mimeType } : {},
			...download.sizeBytes !== void 0 ? { sizeBytes: download.sizeBytes } : {},
			sessionKey: params.sessionKey,
			...messageRunId ? { runId: messageRunId } : {},
			...messageTaskId ? { taskId: messageTaskId } : {},
			messageSeq,
			source: "session-transcript",
			download: { mode: download.mode },
			...download.data !== void 0 ? { data: download.data } : {},
			...download.url ? { url: download.url } : {}
		};
		params.artifacts.push(summary);
	}
}
function resolveQuerySession(query, cfg) {
	if (query.sessionKey) {
		const sessionKey = resolveScopedArtifactSessionKey(query.sessionKey, query.agentId, cfg);
		if (!sessionKey) return;
		return {
			sessionKey,
			...query.agentId ? { agentId: query.agentId } : {}
		};
	}
	if (query.runId) {
		const sessionKey = resolveSessionKeyForRun(query.runId, query.agentId ? { agentId: query.agentId } : {});
		const agentId = query.agentId ?? resolveArtifactSessionAgentId(sessionKey, cfg) ?? resolveSessionAgentId({ config: cfg });
		const scopedSessionKey = resolveScopedArtifactSessionKey(sessionKey, agentId, cfg);
		return scopedSessionKey ? {
			sessionKey: scopedSessionKey,
			agentId
		} : void 0;
	}
	if (query.taskId) {
		const task = getTaskSessionLookupByIdForStatus(query.taskId);
		const requesterSessionKey = normalizeOptionalString(task?.requesterSessionKey);
		const ownerAgentId = parseAgentSessionKey(task?.ownerKey)?.agentId;
		const persistedRequesterOwner = requesterSessionKey ? resolvePersistedSessionStoreOwnerForKey(cfg ?? {}, requesterSessionKey) : { kind: "none" };
		const requesterAgentId = normalizeOptionalString(task?.requesterAgentId) ?? ownerAgentId ?? (persistedRequesterOwner.kind === "configured" ? persistedRequesterOwner.agentId : resolveArtifactSessionAgentId(requesterSessionKey, cfg));
		const taskAgentId = normalizeOptionalString(task?.agentId) ?? requesterAgentId;
		if (query.agentId && taskAgentId && normalizeAgentId(query.agentId) !== normalizeAgentId(taskAgentId)) return;
		if (requesterSessionKey) {
			const sessionAgentId = requesterAgentId ?? resolveArtifactSessionAgentId(requesterSessionKey, cfg);
			if (!sessionAgentId) return;
			const scopedSessionKey = resolveScopedArtifactSessionKey(requesterSessionKey, sessionAgentId, cfg);
			return scopedSessionKey ? {
				sessionKey: scopedSessionKey,
				agentId: sessionAgentId
			} : void 0;
		}
		const agentId = query.agentId ?? taskAgentId ?? resolveSessionAgentId({ config: cfg });
		const runId = normalizeOptionalString(task?.runId);
		const scopedSessionKey = resolveScopedArtifactSessionKey(runId ? resolveSessionKeyForRun(runId, { agentId }) : void 0, agentId, cfg);
		return scopedSessionKey ? {
			sessionKey: scopedSessionKey,
			agentId
		} : void 0;
	}
}
var ArtifactSessionResolutionError = class extends Error {
	constructor(shape) {
		super(shape.message);
		this.shape = shape;
	}
};
/** Loads artifacts from the transcript selected by sessionKey, runId, or taskId. */
async function loadArtifacts(query, cfg, opts = {}) {
	const resolved = resolveQuerySession(query, cfg);
	if (!resolved) return { artifacts: [] };
	const { sessionKey } = resolved;
	const unscopedAgentId = parseAgentSessionKey(sessionKey) ? void 0 : resolved.agentId;
	const { storePath, entry } = unscopedAgentId ? loadGatewaySessionEntryReadOnly(sessionKey, { agentId: unscopedAgentId }) : loadGatewaySessionEntryReadOnly(sessionKey);
	const sessionId = entry?.sessionId;
	if (!sessionId || !storePath) return {
		sessionKey,
		artifacts: []
	};
	const artifacts = [];
	await visitSessionMessagesAsync({
		agentId: resolved.agentId ?? resolveAgentIdFromSessionKey(sessionKey),
		sessionEntry: entry,
		sessionId,
		sessionKey,
		storePath
	}, (message, seq) => {
		collectArtifactsFromMessage({
			message,
			messageFallbackSeq: seq,
			artifacts,
			sessionKey,
			runId: query.runId,
			taskId: query.taskId,
			includeDownloadData: opts.includeDownloadData,
			downloadArtifactId: opts.downloadArtifactId
		});
	}, {
		mode: "full",
		reason: "artifact query transcript scan",
		cache: "skip"
	});
	return {
		sessionKey,
		artifacts
	};
}
function requireQueryable(params, respond) {
	if (params.sessionKey || params.runId || params.taskId) return true;
	respond(false, void 0, artifactError("artifact_query_unsupported", "artifacts require one of sessionKey, runId, or taskId"));
	return false;
}
async function runArtifactSessionOperation(respond, operation) {
	try {
		return {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		if (error instanceof ArtifactSessionResolutionError) {
			respond(false, void 0, error.shape);
			return { ok: false };
		}
		if (error instanceof AgentSelectionRequiredError) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
			return { ok: false };
		}
		throw error;
	}
}
async function findArtifact(params, cfg, opts = {}) {
	const loaded = await loadArtifacts(params, cfg, opts);
	return {
		sessionKey: loaded.sessionKey,
		artifact: loaded.artifacts.find((artifact) => artifact.id === params.artifactId)
	};
}
function toSummary(artifact) {
	const { data: _dataValue, url: _url, ...summary } = artifact;
	return summary;
}
/** Gateway handlers for listing, summarizing, and downloading transcript artifacts. */
const artifactsHandlers = {
	"artifacts.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateArtifactsListParams, "artifacts.list", respond)) return;
		if (!requireQueryable(params, respond)) return;
		const cfg = context.getRuntimeConfig?.();
		const admittedQuery = admitArtifactQuery(params, cfg, respond);
		if (!admittedQuery) return;
		const loaded = await runArtifactSessionOperation(respond, () => loadArtifacts(admittedQuery, cfg, { includeDownloadData: false }));
		if (!loaded.ok) return;
		const { artifacts, sessionKey } = loaded.value;
		if (!sessionKey && (params.runId || params.taskId)) {
			respond(false, void 0, artifactError("artifact_scope_not_found", "no session found for artifact query"));
			return;
		}
		respond(true, { artifacts: artifacts.map(toSummary) });
	},
	"artifacts.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateArtifactsGetParams, "artifacts.get", respond)) return;
		if (!requireQueryable(params, respond)) return;
		const cfg = context.getRuntimeConfig?.();
		const admittedQuery = admitArtifactQuery(params, cfg, respond);
		if (!admittedQuery) return;
		const found = await runArtifactSessionOperation(respond, () => findArtifact(admittedQuery, cfg, { includeDownloadData: false }));
		if (!found.ok) return;
		const { artifact } = found.value;
		if (!artifact) {
			respond(false, void 0, artifactError("artifact_not_found", "artifact not found", { artifactId: params.artifactId }));
			return;
		}
		respond(true, { artifact: toSummary(artifact) });
	},
	"artifacts.download": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateArtifactsDownloadParams, "artifacts.download", respond)) return;
		if (!requireQueryable(params, respond)) return;
		const cfg = context.getRuntimeConfig?.();
		const admittedQuery = admitArtifactQuery(params, cfg, respond);
		if (!admittedQuery) return;
		if (admittedQuery.sessionKey && !admittedQuery.runId && !admittedQuery.taskId && parseManagedOutgoingArtifactId(params.artifactId)) {
			const resolvedResult = await runArtifactSessionOperation(respond, () => resolveQuerySession(admittedQuery, cfg));
			if (!resolvedResult.ok) return;
			const resolved = resolvedResult.value;
			const defaultAgentId = resolved ? tryResolveSessionCompatibilityOwnerAgentId(cfg ?? {}, resolved.sessionKey) : void 0;
			const managed = resolved ? await resolveManagedOutgoingMediaArtifactDownload({
				sessionKey: resolved.sessionKey,
				...resolved.agentId ? { agentId: resolved.agentId } : {},
				...defaultAgentId ? { defaultAgentId } : {},
				artifactId: params.artifactId
			}) : null;
			if (managed) {
				respond(true, {
					artifact: {
						id: managed.artifactId,
						type: managed.type,
						title: managed.title,
						...managed.mimeType ? { mimeType: managed.mimeType } : {},
						...managed.sizeBytes !== void 0 ? { sizeBytes: managed.sizeBytes } : {},
						sessionKey: managed.sessionKey,
						source: "session-transcript",
						download: { mode: "url" }
					},
					url: managed.url,
					expiresAt: managed.expiresAt
				});
				return;
			}
		}
		const found = await runArtifactSessionOperation(respond, () => findArtifact(admittedQuery, cfg, { downloadArtifactId: params.artifactId }));
		if (!found.ok) return;
		const { artifact } = found.value;
		if (!artifact) {
			respond(false, void 0, artifactError("artifact_not_found", "artifact not found", { artifactId: params.artifactId }));
			return;
		}
		if (artifact.download.mode === "unsupported") {
			respond(false, void 0, artifactError("artifact_download_unsupported", "artifact download is unsupported", { artifactId: artifact.id }));
			return;
		}
		const managedUrl = artifact.download.mode === "url" && artifact.url && artifact.sessionKey ? await resolveManagedOutgoingMediaUrlDownload({
			sessionKey: artifact.sessionKey,
			url: artifact.url
		}) : null;
		respond(true, {
			artifact: toSummary(artifact),
			...artifact.download.mode === "bytes" ? {
				encoding: "base64",
				data: artifact.data
			} : {},
			...artifact.download.mode === "url" ? {
				url: managedUrl?.url ?? artifact.url,
				...managedUrl ? { expiresAt: managedUrl.expiresAt } : {}
			} : {}
		});
	}
};
//#endregion
export { artifactsHandlers };
