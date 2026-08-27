import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as openRootFileSync } from "./root-file-Chr9dJBe.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { i as readFileDescriptorBoundedSync } from "./boundary-file-read-BoOq_oud.js";
import { t as resolveRealpathOrAbsolute } from "./boundary-path-dOybNsjk.js";
import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { a as isSupportedLocalAvatarExtension, c as resolveAvatarMime, d as isRenderableAvatarImageDataUrl, i as isPathWithinRoot, l as AVATAR_MAX_BYTES, n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, t as hasAvatarUriScheme } from "./avatar-policy-h0-yTt3d.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/identity-avatar-file.ts
/** Resolve one local avatar source while retaining its canonical workspace root. */
function resolveLocalAgentAvatarPath(params) {
	const workspaceRoot = resolveRealpathOrAbsolute(params.workspaceDir);
	const filePath = resolveRealpathOrAbsolute(params.raw.startsWith("~") || path.isAbsolute(params.raw) ? resolveUserPath(params.raw) : path.resolve(workspaceRoot, params.raw));
	if (!isPathWithinRoot(workspaceRoot, filePath)) return {
		ok: false,
		reason: "outside_workspace"
	};
	if (!isSupportedLocalAvatarExtension(filePath)) return {
		ok: false,
		reason: "unsupported_extension"
	};
	try {
		const stat = fs.statSync(filePath);
		if (!stat.isFile()) return {
			ok: false,
			reason: "missing"
		};
		if (stat.size > 2097152) return {
			ok: false,
			reason: "too_large"
		};
	} catch {
		return {
			ok: false,
			reason: "missing"
		};
	}
	return {
		ok: true,
		value: {
			filePath,
			workspaceRoot
		}
	};
}
function openResolvedLocalAgentAvatarFile(resolved) {
	try {
		const opened = openRootFileSync({
			absolutePath: resolved.filePath,
			rootPath: resolved.workspaceRoot,
			rootRealPath: resolved.workspaceRoot,
			boundaryLabel: "agent workspace",
			maxBytes: AVATAR_MAX_BYTES,
			rejectHardlinks: true,
			skipLexicalRootCheck: true
		});
		if (!opened.ok) return null;
		if (!isSupportedLocalAvatarExtension(opened.path)) {
			fs.closeSync(opened.fd);
			return null;
		}
		return {
			path: opened.path,
			fd: opened.fd,
			stat: {
				ctimeMs: opened.stat.ctimeMs,
				dev: opened.stat.dev,
				ino: opened.stat.ino,
				mtimeMs: opened.stat.mtimeMs,
				size: opened.stat.size
			}
		};
	} catch {
		return null;
	}
}
/**
* Open one selected local avatar under its agent workspace.
* A successful caller owns `file.fd` and must close it exactly once.
*/
function openLocalAgentAvatarFile(params) {
	const resolved = resolveLocalAgentAvatarPath({
		raw: params.source,
		workspaceDir: resolveAgentWorkspaceDir(params.cfg, params.agentId)
	});
	if (!resolved.ok) return resolved;
	const file = openResolvedLocalAgentAvatarFile(resolved.value);
	return file ? {
		ok: true,
		file
	} : {
		ok: false,
		reason: "unreadable"
	};
}
/** Consume a pinned local avatar descriptor into a data URL. Always closes it. */
function readOpenedLocalAgentAvatarDataUrl(opened) {
	try {
		const buffer = readFileDescriptorBoundedSync(opened.fd, AVATAR_MAX_BYTES);
		return `data:${resolveAvatarMime(opened.path)};base64,${buffer.toString("base64")}`;
	} catch {
		return;
	} finally {
		fs.closeSync(opened.fd);
	}
}
/** Resolve one configured avatar source for agent-list projections. */
function resolveAgentAvatarUrlFromSource(cfg, agentId, source) {
	const normalized = normalizeOptionalString(source);
	if (!normalized) return;
	if (isAvatarHttpUrl(normalized) || isRenderableAvatarImageDataUrl(normalized)) return normalized;
	if (isAvatarDataUrl(normalized) || hasAvatarUriScheme(normalized) && !isWindowsAbsolutePath(normalized)) return;
	const opened = openLocalAgentAvatarFile({
		cfg,
		agentId,
		source: normalized
	});
	return opened.ok ? readOpenedLocalAgentAvatarDataUrl(opened.file) : void 0;
}
//#endregion
export { resolveLocalAgentAvatarPath as i, readOpenedLocalAgentAvatarDataUrl as n, resolveAgentAvatarUrlFromSource as r, openLocalAgentAvatarFile as t };
