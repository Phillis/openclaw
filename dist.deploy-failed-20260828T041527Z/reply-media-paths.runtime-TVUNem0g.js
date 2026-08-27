import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { i as copyReplyPayloadMetadata, n as appendReplyMediaFailureWarning } from "./reply-payload-BeeUJOmJ.js";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.js";
import { r as resolveAllowedManagedMediaPath, s as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./sandbox-paths-C7Hkb46-.js";
import { i as toRelativeWorkspacePath, n as resolvePathFromInput } from "./path-policy-DK2wTBdY.js";
import "./reply-payload-i0RzN2iF.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CJuHXrph.js";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-b87SKClG.js";
import { t as ensureSandboxWorkspaceForSession } from "./context-Dvpy8SGQ.js";
import "./sandbox-7oZNAhIJ.js";
import { r as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-B5djOrK5.js";
import { n as resolveOutboundAttachmentFromUrl } from "./outbound-attachment-CEvVFoTj.js";
import path from "node:path";
//#region src/auto-reply/reply/reply-media-paths.ts
const FILE_URL_RE = /^file:/i;
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const HAS_FILE_EXT_RE = /\.\w{1,10}$/;
function isLikelyLocalMediaSource(media) {
	return FILE_URL_RE.test(media) || media.startsWith("/") || media.startsWith("./") || media.startsWith("../") || media.startsWith("~") || WINDOWS_DRIVE_RE.test(media) || media.startsWith("\\\\") || !SCHEME_RE.test(media) && (media.includes("/") || media.includes("\\") || HAS_FILE_EXT_RE.test(media));
}
function getPayloadMediaList(payload) {
	return resolveSendableOutboundReplyParts(payload).mediaUrls;
}
function createReplyMediaPathNormalizer(params) {
	const agentId = params.agentId ?? (params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	}) : void 0);
	const maxBytes = resolveOutboundMediaMaxBytes({
		cfg: params.cfg,
		channel: params.messageProvider,
		accountId: params.accountId
	});
	const explicitSandboxRoot = params.sandboxRoot?.trim();
	let sandboxWorkspacePromise = explicitSandboxRoot ? Promise.resolve({
		root: explicitSandboxRoot,
		containerWorkdir: params.sandboxContainerWorkdir
	}) : void 0;
	const persistedMediaBySource = /* @__PURE__ */ new Map();
	const resolveSandboxWorkspace = async () => {
		if (!sandboxWorkspacePromise) sandboxWorkspacePromise = ensureSandboxWorkspaceForSession({
			config: params.cfg,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir
		}).then((sandbox) => sandbox ? {
			root: sandbox.workspaceDir,
			containerWorkdir: sandbox.containerWorkdir
		} : void 0);
		return await sandboxWorkspacePromise;
	};
	const resolveMediaAccessForSource = (media) => resolveAgentScopedOutboundMediaAccess({
		cfg: params.cfg,
		agentId,
		workspaceDir: params.workspaceDir,
		mediaSources: [media],
		sessionKey: params.sessionKey,
		messageProvider: params.sessionKey ? void 0 : params.messageProvider,
		accountId: params.accountId,
		requesterSenderId: params.requesterSenderId,
		requesterSenderName: params.requesterSenderName,
		requesterSenderUsername: params.requesterSenderUsername,
		requesterSenderE164: params.requesterSenderE164,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace
	});
	const persistLocalReplyMedia = async (media) => {
		if (!isLikelyLocalMediaSource(media)) return media;
		const managedMediaPath = await resolveAllowedManagedMediaPath(media);
		if (managedMediaPath) return managedMediaPath;
		const cached = persistedMediaBySource.get(media);
		if (cached) return await cached;
		const persistPromise = resolveOutboundAttachmentFromUrl(media, maxBytes, { mediaAccess: resolveMediaAccessForSource(media) }).then((saved) => saved.path).catch((err) => {
			persistedMediaBySource.delete(media);
			throw err;
		});
		persistedMediaBySource.set(media, persistPromise);
		return await persistPromise;
	};
	const resolveWorkspaceRelativeMedia = (media) => {
		return resolvePathFromInput(toRelativeWorkspacePath(params.workspaceDir, media, { cwd: params.workspaceDir }), params.workspaceDir);
	};
	const resolveAbsoluteWorkspaceMedia = (media) => {
		if (FILE_URL_RE.test(media) || !path.isAbsolute(media) && !WINDOWS_DRIVE_RE.test(media)) return;
		try {
			return resolveWorkspaceRelativeMedia(media);
		} catch {
			return;
		}
	};
	const normalizeMediaSource = async (raw) => {
		const media = raw.trim();
		if (!media) return media;
		assertMediaNotDataUrl(media);
		if (isPassThroughRemoteMediaSource(media)) return media;
		const absoluteWorkspaceMedia = resolveAbsoluteWorkspaceMedia(media);
		if (absoluteWorkspaceMedia) return await persistLocalReplyMedia(absoluteWorkspaceMedia);
		const isRelativeLocalMedia = isLikelyLocalMediaSource(media) && !FILE_URL_RE.test(media) && !media.startsWith("~") && !path.isAbsolute(media) && !WINDOWS_DRIVE_RE.test(media);
		const sandboxWorkspace = await resolveSandboxWorkspace();
		if (sandboxWorkspace) {
			let sandboxResolvedMedia;
			try {
				sandboxResolvedMedia = await resolveSandboxedMediaSource({
					media,
					sandboxRoot: sandboxWorkspace.root,
					containerWorkdir: sandboxWorkspace.containerWorkdir
				});
			} catch (err) {
				if (FILE_URL_RE.test(media)) throw new Error("Host-local MEDIA file URLs are blocked in normal replies. Use a safe path or the message tool.", { cause: err });
				throw err;
			}
			return await persistLocalReplyMedia(sandboxResolvedMedia);
		}
		if (isRelativeLocalMedia) return await persistLocalReplyMedia(resolveWorkspaceRelativeMedia(media));
		if (!isLikelyLocalMediaSource(media)) return media;
		if (FILE_URL_RE.test(media)) throw new Error("Host-local MEDIA file URLs are blocked in normal replies. Use a safe path or the message tool.");
		return await persistLocalReplyMedia(media);
	};
	return async (payload) => {
		const mediaList = getPayloadMediaList(payload);
		if (mediaList.length === 0) return payload;
		const normalizedMedia = [];
		const seen = /* @__PURE__ */ new Set();
		let firstMediaDropError;
		for (const media of mediaList) {
			let normalized;
			try {
				normalized = await normalizeMediaSource(media);
			} catch (err) {
				firstMediaDropError ??= err;
				logVerbose(`dropping blocked reply media ${media}: ${String(err)}`);
				continue;
			}
			if (!normalized || seen.has(normalized)) continue;
			seen.add(normalized);
			normalizedMedia.push(normalized);
		}
		const text = firstMediaDropError === void 0 ? payload.text : appendReplyMediaFailureWarning(payload.text);
		if (normalizedMedia.length === 0) return copyReplyPayloadMetadata(payload, {
			...payload,
			text,
			mediaUrl: void 0,
			mediaUrls: void 0
		});
		return copyReplyPayloadMetadata(payload, {
			...payload,
			text,
			mediaUrl: normalizedMedia[0],
			mediaUrls: normalizedMedia
		});
	};
}
function createReplyMediaContext(params) {
	return { normalizePayload: createReplyMediaPathNormalizer(params) };
}
//#endregion
export { createReplyMediaPathNormalizer as n, createReplyMediaContext as t };
