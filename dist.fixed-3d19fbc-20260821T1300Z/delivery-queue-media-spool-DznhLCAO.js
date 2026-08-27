import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import { h as resolveDeliveryQueueMediaDir } from "./paths-CqeDjSA4.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { t as fileStore } from "./file-store-COJcnc0p.js";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.js";
import "./store-CvNsGg9Z.js";
import { n as loadWebMedia } from "./web-media-DRJtrLMa.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { c as createDeliveryQueueMediaRetention, l as loadDeliveryQueueMediaRetentionSnapshot, s as cancelDeliveryQueueMediaRetention } from "./delivery-queue-media-staging-B4prZs9R.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/outbound/delivery-queue-media-spool.ts
const ARTIFACT_EXT_RE = /^\.[A-Za-z0-9]{1,10}$/;
const ARTIFACT_NAME_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\.[A-Za-z0-9]{1,10})?(?:\.part)?$/;
const PART_SUFFIX = ".part";
const ORPHAN_GRACE_MS = 1440 * 6e4;
function openSpoolStore(stateDir, maxBytes) {
	return fileStore({
		rootDir: resolveDeliveryQueueMediaDir(stateDir),
		dirMode: 448,
		mode: 384,
		maxBytes
	});
}
function resolveArtifactExtension(source) {
	const extension = path.extname(source.split("?")[0] ?? "");
	return ARTIFACT_EXT_RE.test(extension) ? extension.toLowerCase() : "";
}
function payloadMediaSources(payload) {
	const sources = [];
	if (hasNonEmptyString(payload.mediaUrl)) sources.push(payload.mediaUrl);
	for (const mediaUrl of payload.mediaUrls ?? []) if (hasNonEmptyString(mediaUrl)) sources.push(mediaUrl);
	return sources;
}
/** Remote and data sources carry their own bytes; only local paths need queue custody. */
function isSpoolableSource(source) {
	return !isPassThroughRemoteMediaSource(source) && !/^data:/i.test(source);
}
function isSensitivePayload(payload) {
	return payload.sensitiveMedia === true && payloadMediaSources(payload).length > 0;
}
/**
* Copies local media into queue custody and rewrites only the queue payloads.
* The same loader and capability as the live send authorize every source.
*/
async function stageQueuePayloadMedia(params) {
	if (params.payloads.some(isSensitivePayload)) return {
		status: "not-durable",
		reason: "sensitive-media"
	};
	const spoolRoot = path.resolve(resolveDeliveryQueueMediaDir(params.stateDir));
	const artifactsBySource = /* @__PURE__ */ new Map();
	for (const source of params.payloads.flatMap(payloadMediaSources)) if (isSpoolableSource(source) && !artifactsBySource.has(source)) artifactsBySource.set(source, path.join(spoolRoot, `${generateSecureUuid()}${resolveArtifactExtension(source)}`));
	const artifacts = [...artifactsBySource.values()];
	const mediaStageId = artifacts.length > 0 ? createDeliveryQueueMediaRetention(artifacts, "outbound-media-stage", params.stateDir) : void 0;
	const store = openSpoolStore(params.stateDir, params.maxBytes);
	const publishedSources = /* @__PURE__ */ new Set();
	const stageSource = async (source) => {
		const stagedPath = artifactsBySource.get(source);
		if (!stagedPath) throw new Error(`Delivery queue media source was not planned: ${source}`);
		if (publishedSources.has(source)) return stagedPath;
		const media = await loadWebMedia(source, buildOutboundMediaLoadOptions({
			maxBytes: params.maxBytes,
			mediaAccess: params.mediaAccess,
			mediaLocalRoots: params.mediaAccess?.localRoots,
			mediaReadFile: params.mediaAccess?.readFile
		}));
		const finalRelative = path.basename(stagedPath);
		const partRelative = `${finalRelative}${PART_SUFFIX}`;
		try {
			await store.write(partRelative, media.buffer, { maxBytes: params.maxBytes });
			await (await store.root()).move(partRelative, finalRelative, { overwrite: false });
			publishedSources.add(source);
		} catch (err) {
			await store.remove(partRelative).catch(() => void 0);
			throw err;
		}
		return stagedPath;
	};
	const stagedPayloads = [];
	try {
		for (const payload of params.payloads) {
			if (payloadMediaSources(payload).filter(isSpoolableSource).length === 0) {
				stagedPayloads.push(payload);
				continue;
			}
			const staged = { ...payload };
			if (hasNonEmptyString(payload.mediaUrl) && isSpoolableSource(payload.mediaUrl)) staged.mediaUrl = await stageSource(payload.mediaUrl);
			if (payload.mediaUrls) {
				const stagedMediaUrls = [];
				for (const mediaUrl of payload.mediaUrls) stagedMediaUrls.push(hasNonEmptyString(mediaUrl) && isSpoolableSource(mediaUrl) ? await stageSource(mediaUrl) : mediaUrl);
				staged.mediaUrls = stagedMediaUrls;
			}
			stagedPayloads.push(staged);
		}
	} catch (err) {
		cancelDeliveryQueueMediaRetention(mediaStageId, params.stateDir);
		await releaseSpoolArtifacts(artifacts, params.stateDir);
		throw err;
	}
	return {
		status: "staged",
		payloads: stagedPayloads,
		artifacts,
		...mediaStageId ? { mediaStageId } : {}
	};
}
function spoolRelativePath(absolutePath, stateDir) {
	const spoolRoot = path.resolve(resolveDeliveryQueueMediaDir(stateDir));
	const candidate = path.resolve(absolutePath);
	const relative = path.relative(spoolRoot, candidate);
	return relative && !relative.includes(path.sep) && ARTIFACT_NAME_RE.test(relative) ? relative : null;
}
async function removeArtifact(absolutePath, stateDir) {
	const relative = spoolRelativePath(absolutePath, stateDir);
	if (!relative) return;
	try {
		await openSpoolStore(stateDir).remove(relative);
	} catch {}
}
/** Discards spool artifacts whose durable row is already gone. Never throws. */
async function releaseSpoolArtifacts(artifacts, stateDir) {
	for (const artifact of artifacts) await removeArtifact(artifact, stateDir);
}
/** Absolute spool paths a queue entry still needs in order to replay. */
function collectEntrySpoolPaths(payloads, stateDir) {
	const paths = [];
	for (const payload of payloads) for (const source of payloadMediaSources(payload)) if (path.isAbsolute(source) && spoolRelativePath(source, stateDir)) paths.push(path.resolve(source));
	return paths;
}
/**
* Removes old unreferenced spool files. Pending-row references always win over
* age; the grace covers the stage-before-row-commit crash window and bounds all
* final and partial artifacts that never acquire a row.
*/
async function pruneDeliveryQueueMedia(params) {
	const spoolRoot = path.resolve(resolveDeliveryQueueMediaDir(params.stateDir));
	const retainPaths = new Set([...params.retainPaths].map((entry) => path.resolve(entry)));
	const cutoffMs = (params.nowMs ?? Date.now()) - (params.orphanGraceMs ?? ORPHAN_GRACE_MS);
	const entries = await fs.readdir(spoolRoot, { withFileTypes: true }).catch((err) => {
		if (err.code === "ENOENT") return null;
		throw err;
	});
	if (!entries) return;
	for (const entry of entries) {
		if (!entry.isFile() || !ARTIFACT_NAME_RE.test(entry.name)) continue;
		const artifactPath = path.join(spoolRoot, entry.name);
		if (retainPaths.has(artifactPath)) continue;
		const stats = await fs.stat(artifactPath).catch((err) => {
			if (err.code === "ENOENT") return null;
			throw err;
		});
		if (!stats || stats.mtimeMs > cutoffMs) continue;
		await removeArtifact(artifactPath, params.stateDir);
	}
}
/** Reclaims queue media using the complete pending inventory as the retain set. */
async function pruneOrphanedDeliveryQueueMedia(params) {
	const nowMs = params?.nowMs ?? Date.now();
	const snapshot = loadDeliveryQueueMediaRetentionSnapshot({
		expireBeforeMs: nowMs - ORPHAN_GRACE_MS,
		stateDir: params?.stateDir
	});
	await pruneDeliveryQueueMedia({
		retainPaths: new Set(snapshot.stagedArtifacts.concat(snapshot.payloads.flatMap((payloads) => collectEntrySpoolPaths(payloads, params?.stateDir)))),
		stateDir: params?.stateDir,
		nowMs
	});
}
//#endregion
export { stageQueuePayloadMedia as i, pruneOrphanedDeliveryQueueMedia as n, releaseSpoolArtifacts as r, collectEntrySpoolPaths as t };
