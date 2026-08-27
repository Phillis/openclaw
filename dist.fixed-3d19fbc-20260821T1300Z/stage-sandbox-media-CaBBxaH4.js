import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { d as safeFileURLToPath } from "./read-open-flags-YbtjZqyj.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { t as CONFIG_DIR } from "./utils-D9gvQMP6.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { r as logVerbose } from "./globals-DD_xHyf6.js";
import { r as runCommandWithTimeout } from "./exec-Cmwsxh9J.js";
import "./local-file-access-D5Is7hSS.js";
import { n as assertSandboxPath } from "./sandbox-paths-Bgdy3T5g.js";
import { u as normalizeMediaFacts } from "./media-facts-CdKKNGmE.js";
import { s as getMediaDir, t as MEDIA_MAX_BYTES } from "./store-CvNsGg9Z.js";
import { o as resolveInboundMediaReference } from "./media-reference-8XBYb3Pm.js";
import { t as isInboundPathAllowed } from "./inbound-path-policy-DQ5Rksw7.js";
import { i as slugifySessionKey } from "./shared-CwEzk1BZ.js";
import { t as ensureSandboxWorkspaceForSession } from "./context-BwBSG27A.js";
import "./sandbox-BdXgHoEY.js";
import { r as resolveChannelRemoteInboundAttachmentRoots } from "./channel-inbound-roots-BR8N9Q9B.js";
import { i as normalizeScpRemotePath, r as normalizeScpRemoteHost } from "./scp-host-3FoHUz1i.js";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/auto-reply/reply/stage-sandbox-media.ts
const STAGED_MEDIA_MAX_BYTES = MEDIA_MAX_BYTES;
const SCP_STDERR_TAIL_CHARS = 16384;
const EMPTY_STAGE_RESULT = { staged: /* @__PURE__ */ new Map() };
async function stageSandboxMedia(params) {
	const { ctx, sessionCtx, cfg, sessionKey, workspaceDir } = params;
	const media = normalizeMediaFacts(ctx.media);
	const pathEntries = media.flatMap((fact, index) => {
		const mediaPath = normalizeOptionalString(fact.path);
		return mediaPath ? [{
			index,
			path: mediaPath
		}] : [];
	});
	if (pathEntries.length === 0 || !sessionKey) return EMPTY_STAGE_RESULT;
	const sandbox = ctx.MediaRemoteHost && params.remoteMediaMode === "cache" ? null : await ensureSandboxWorkspaceForSession({
		config: cfg,
		sessionKey,
		workspaceDir
	});
	const remoteMediaCacheDir = ctx.MediaRemoteHost ? path.join(CONFIG_DIR, "media", "remote-cache", slugifySessionKey(sessionKey)) : null;
	const effectiveWorkspaceDir = sandbox?.workspaceDir ?? remoteMediaCacheDir ?? workspaceDir;
	if (!effectiveWorkspaceDir) return EMPTY_STAGE_RESULT;
	await fs.mkdir(effectiveWorkspaceDir, { recursive: true });
	const remoteAttachmentRoots = ctx.MediaRemoteHost ? resolveChannelRemoteInboundAttachmentRoots({
		cfg,
		ctx
	}) ?? [] : [];
	const usedNames = /* @__PURE__ */ new Set();
	const staged = /* @__PURE__ */ new Map();
	const stagedUrlAliases = /* @__PURE__ */ new Set();
	const hostWorkspaceStagingDir = !sandbox && !ctx.MediaRemoteHost ? path.join("media", "inbound", `openclaw-staged-${crypto.randomUUID()}`) : void 0;
	for (const entry of pathEntries) {
		const source = await resolveStageableMediaSource(entry.path);
		if (!source) continue;
		if (!await isAllowedSourcePath({
			source: source.physicalPath,
			mediaRemoteHost: ctx.MediaRemoteHost,
			remoteAttachmentRoots
		})) continue;
		const fileName = allocateStagedFileName(source.pathForFileName, usedNames);
		if (!fileName) continue;
		const stageIntoSandboxMediaDir = Boolean(sandbox);
		const relativeDest = stageIntoSandboxMediaDir || hostWorkspaceStagingDir ? path.join(hostWorkspaceStagingDir ?? path.join("media", "inbound"), fileName) : fileName;
		const dest = path.join(effectiveWorkspaceDir, relativeDest);
		try {
			if (ctx.MediaRemoteHost) await stageRemoteFileIntoRoot({
				remoteHost: ctx.MediaRemoteHost,
				remotePath: source.physicalPath,
				rootDir: effectiveWorkspaceDir,
				relativeDestPath: relativeDest,
				maxBytes: STAGED_MEDIA_MAX_BYTES
			});
			else await stageLocalFileIntoRoot({
				sourcePath: await fs.realpath(source.physicalPath).catch(() => source.physicalPath),
				rootDir: effectiveWorkspaceDir,
				relativeDestPath: relativeDest,
				maxBytes: STAGED_MEDIA_MAX_BYTES
			});
		} catch (err) {
			if (err instanceof FsSafeError && err.code === "too-large") logVerbose(`Blocking inbound media staging above ${STAGED_MEDIA_MAX_BYTES} bytes: ${source.physicalPath}`);
			else logVerbose(`Failed to stage inbound media path ${source.physicalPath}: ${String(err)}`);
			continue;
		}
		const stagedPath = stageIntoSandboxMediaDir ? toPosixRelativePath(relativeDest) : dest;
		staged.set(entry.index, stagedPath);
		if (await isUrlAliasForStagedSource({
			url: media[entry.index]?.url,
			sourcePath: entry.path,
			source,
			mediaRemoteHost: ctx.MediaRemoteHost
		})) stagedUrlAliases.add(entry.index);
	}
	if (staged.size === 0) return { staged };
	const nextMedia = [...media];
	for (const [index, stagedPath] of staged) {
		const fact = nextMedia[index];
		if (fact) nextMedia[index] = {
			...fact,
			path: stagedPath,
			...stagedUrlAliases.has(index) ? { url: stagedPath } : {},
			workspaceDir: effectiveWorkspaceDir
		};
	}
	applyStagedMediaContext(ctx, nextMedia);
	if (sessionCtx !== ctx) applyStagedMediaContext(sessionCtx, nextMedia);
	return { staged };
}
async function isUrlAliasForStagedSource(params) {
	const url = normalizeOptionalString(params.url);
	if (!url) return false;
	if (url === params.sourcePath) return true;
	const sourceAbsolutePath = resolveAbsolutePath(params.sourcePath);
	const urlAbsolutePath = resolveAbsolutePath(url);
	if (sourceAbsolutePath && urlAbsolutePath && path.normalize(sourceAbsolutePath) === path.normalize(urlAbsolutePath)) return true;
	if (params.mediaRemoteHost) return false;
	const urlSource = await resolveStageableMediaSource(url);
	if (!urlSource) return false;
	const [sourceIdentity, urlIdentity] = await Promise.all([resolveLocalSourceIdentity(params.source.physicalPath), resolveLocalSourceIdentity(urlSource.physicalPath)]);
	return sourceIdentity === urlIdentity;
}
async function resolveLocalSourceIdentity(sourcePath) {
	return await fs.realpath(sourcePath).catch(() => path.resolve(sourcePath));
}
function applyStagedMediaContext(ctx, media) {
	ctx.media = media;
}
function toPosixRelativePath(filePath) {
	return filePath.split(path.sep).join(path.posix.sep);
}
async function resolveStageableMediaSource(value) {
	const raw = value.trim();
	if (!raw) return null;
	const inboundReference = await resolveInboundMediaReference(raw).catch(() => null);
	if (inboundReference) return {
		pathForFileName: inboundReference.physicalPath,
		physicalPath: inboundReference.physicalPath
	};
	const source = resolveAbsolutePath(raw);
	return source ? {
		pathForFileName: source,
		physicalPath: source
	} : null;
}
async function stageLocalFileIntoRoot(params) {
	await (await root(params.rootDir)).copyIn(params.relativeDestPath, params.sourcePath, { maxBytes: params.maxBytes });
}
async function stageRemoteFileIntoRoot(params) {
	const tmpRoot = resolvePreferredOpenClawTmpDir();
	await fs.mkdir(tmpRoot, { recursive: true });
	const tmpDir = await fs.mkdtemp(path.join(tmpRoot, "stage-sandbox-media-"));
	const tmpPath = path.join(tmpDir, "download");
	try {
		await scpFile(params.remoteHost, params.remotePath, tmpPath);
		await stageLocalFileIntoRoot({
			sourcePath: tmpPath,
			rootDir: params.rootDir,
			relativeDestPath: params.relativeDestPath,
			maxBytes: params.maxBytes
		});
	} finally {
		await fs.rm(tmpDir, {
			recursive: true,
			force: true
		}).catch(() => {});
	}
}
function resolveAbsolutePath(value) {
	let resolved = value.trim();
	if (!resolved) return null;
	if (/^file:/iu.test(resolved)) try {
		resolved = safeFileURLToPath(resolved);
	} catch {
		return null;
	}
	if (!path.isAbsolute(resolved)) return null;
	return resolved;
}
async function isAllowedSourcePath(params) {
	if (params.mediaRemoteHost) {
		if (!isInboundPathAllowed({
			filePath: params.source,
			roots: params.remoteAttachmentRoots
		})) {
			logVerbose(`Blocking remote media staging from disallowed attachment path: ${params.source}`);
			return false;
		}
		return true;
	}
	if (await resolveInboundMediaReference(params.source).catch(() => null)) return true;
	const mediaDir = getMediaDir();
	const canonicalMediaDir = await fs.realpath(mediaDir).catch(() => mediaDir);
	if (!isInboundPathAllowed({
		filePath: params.source,
		roots: [mediaDir, canonicalMediaDir]
	})) {
		logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
		return false;
	}
	try {
		await assertSandboxPath({
			filePath: await fs.realpath(params.source).catch(() => params.source),
			cwd: canonicalMediaDir,
			root: canonicalMediaDir
		});
		return true;
	} catch {
		logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
		return false;
	}
}
function allocateStagedFileName(source, usedNames) {
	const baseName = path.basename(source);
	if (!baseName) return null;
	const parsed = path.parse(baseName);
	let fileName = baseName;
	let suffix = 1;
	while (usedNames.has(fileName)) {
		fileName = `${parsed.name}-${suffix}${parsed.ext}`;
		suffix += 1;
	}
	usedNames.add(fileName);
	return fileName;
}
async function scpFile(remoteHost, remotePath, localPath) {
	const safeRemoteHost = normalizeScpRemoteHost(remoteHost);
	if (!safeRemoteHost) throw new Error("invalid remote host for SCP");
	const safeRemotePath = normalizeScpRemotePath(remotePath);
	if (!safeRemotePath) throw new Error("invalid remote path for SCP");
	const result = await runCommandWithTimeout([
		"scp",
		"-o",
		"BatchMode=yes",
		"-o",
		"StrictHostKeyChecking=yes",
		"--",
		`${safeRemoteHost}:${safeRemotePath}`,
		localPath
	], { maxOutputBytes: {
		stdout: 1,
		stderr: SCP_STDERR_TAIL_CHARS * 4
	} });
	if (result.code !== 0) {
		const stderr = appendScpStderrTail("", result.stderr).trim();
		throw new Error(`scp failed (${result.code}): ${stderr}`);
	}
}
function appendScpStderrTail(current, chunk, maxChars = SCP_STDERR_TAIL_CHARS) {
	const combined = `${current}${chunk}`;
	if (combined.length <= maxChars) return combined;
	return sliceUtf16Safe(combined, Math.max(0, combined.length - maxChars));
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.stageSandboxMediaTestApi")] = { scpFile };
//#endregion
export { stageSandboxMedia as t };
