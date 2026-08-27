import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { CONFIG_DIR, extractArchive, resolveBrewExecutable } from "openclaw/plugin-sdk/setup-tools";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { runPluginCommandWithTimeout } from "openclaw/plugin-sdk/run-command";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { withTempDownloadPath } from "openclaw/plugin-sdk/temp-path";
//#region extensions/signal/src/install-signal-cli.ts
const MAX_SIGNAL_CLI_ARCHIVE_BYTES = 256 * 1024 * 1024;
/** @internal Exported for testing. */
const MAX_SIGNAL_CLI_EXTRACTED_BYTES = 384 * 1024 * 1024;
const SIGNAL_CLI_DOWNLOAD_TIMEOUT_MS = 5 * 6e4;
const SIGNAL_CLI_RELEASE_INFO_TIMEOUT_MS = 3e4;
const CONTENT_LENGTH_RE = /^\d+$/;
/** @internal Exported for testing. */
async function extractSignalCliArchive(archivePath, installRoot, timeoutMs) {
	await extractArchive({
		archivePath,
		destDir: installRoot,
		timeoutMs,
		limits: {
			maxArchiveBytes: MAX_SIGNAL_CLI_ARCHIVE_BYTES,
			maxEntries: 32,
			maxEntryBytes: MAX_SIGNAL_CLI_EXTRACTED_BYTES,
			maxExtractedBytes: MAX_SIGNAL_CLI_EXTRACTED_BYTES
		}
	});
}
/** @internal Exported for testing. */
function looksLikeArchive(name) {
	return name.endsWith(".tar.gz") || name.endsWith(".tgz") || name.endsWith(".zip");
}
function isNodeReadableStream(value) {
	return Boolean(value && typeof value.pipe === "function");
}
function chunkByteLength(chunk) {
	if (typeof chunk === "string") return Buffer.byteLength(chunk);
	if (chunk instanceof Uint8Array) return chunk.byteLength;
	return Buffer.byteLength(String(chunk));
}
async function cancelUnusedResponseBody(response) {
	await response.body?.cancel().catch(() => void 0);
}
function normalizeReleaseAsset(value) {
	if (!isRecord(value)) return;
	const name = normalizeOptionalString(value.name);
	const browserDownloadUrl = normalizeOptionalString(value.browser_download_url);
	return name && browserDownloadUrl ? {
		name,
		browser_download_url: browserDownloadUrl
	} : void 0;
}
function normalizeSignalCliRelease(value) {
	const version = normalizeOptionalString(normalizeOptionalString(value.tag_name)?.replace(/^v/, ""));
	if (!version || !Array.isArray(value.assets)) return;
	return {
		version,
		assets: value.assets.flatMap((asset) => {
			const normalized = normalizeReleaseAsset(asset);
			return normalized ? [normalized] : [];
		})
	};
}
/**
* Pick a native release asset from the official GitHub releases.
*
* The official signal-cli releases only publish native (GraalVM) binaries for
* x86-64 Linux.  On architectures where no native asset is available this
* returns `undefined` so the caller can fall back to a different install
* strategy (e.g. Homebrew).
*/
/** @internal Exported for testing. */
function pickAsset(assets, platform, arch) {
	const archives = assets.filter((asset) => Boolean(asset.name && asset.browser_download_url)).filter((a) => looksLikeArchive(normalizeLowercaseStringOrEmpty(a.name)));
	const byName = (pattern) => archives.find((asset) => pattern.test(normalizeLowercaseStringOrEmpty(asset.name)));
	if (platform === "linux") {
		if (arch === "x64") return byName(/linux-native/) || byName(/linux/) || archives[0];
		return;
	}
	if (platform === "darwin") return byName(/macos|osx|darwin/);
	if (platform === "win32") return byName(/windows|win/) || archives[0];
	return archives[0];
}
/** @internal Exported for testing. */
async function downloadToFile(url, dest, maxRedirects = 5, maxBytes = MAX_SIGNAL_CLI_ARCHIVE_BYTES) {
	let completed = false;
	const { response, release } = await fetchWithSsrFGuard({
		url,
		maxRedirects,
		requireHttps: true,
		timeoutMs: SIGNAL_CLI_DOWNLOAD_TIMEOUT_MS,
		capture: false,
		auditContext: "signal-cli-install-archive"
	});
	try {
		if (!response.ok || !response.body) {
			await cancelUnusedResponseBody(response);
			throw new Error(`HTTP ${response.status || "?"} downloading file`);
		}
		const rawLength = response.headers.get("content-length");
		if (rawLength !== null) {
			const trimmedLength = rawLength.trim();
			const declaredLength = CONTENT_LENGTH_RE.test(trimmedLength) ? Number(trimmedLength) : NaN;
			if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
				await cancelUnusedResponseBody(response);
				throw new Error(`signal-cli archive exceeds the ${maxBytes}-byte download cap (declared ${declaredLength}).`);
			}
		}
		let totalBytes = 0;
		const body = response.body;
		await pipeline(isNodeReadableStream(body) ? body : Readable.fromWeb(body), new Transform({ transform(chunk, _encoding, callback) {
			totalBytes += chunkByteLength(chunk);
			if (totalBytes > maxBytes) {
				callback(/* @__PURE__ */ new Error(`signal-cli archive exceeded the ${maxBytes}-byte download cap.`));
				return;
			}
			callback(null, chunk);
		} }), createWriteStream(dest));
		completed = true;
	} finally {
		await release();
		if (!completed) await fs.rm(dest, { force: true }).catch(() => void 0);
	}
}
async function findSignalCliBinary(root) {
	const candidates = [];
	const enqueue = async (dir, depth) => {
		if (depth > 3) return;
		const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
		for (const entry of entries) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) await enqueue(full, depth + 1);
			else if (entry.isFile() && entry.name === "signal-cli") candidates.push(full);
		}
	};
	await enqueue(root, 0);
	return candidates[0] ?? null;
}
async function resolveBrewSignalCliPath(brewExe) {
	try {
		const result = await runPluginCommandWithTimeout({
			argv: [
				brewExe,
				"--prefix",
				"signal-cli"
			],
			timeoutMs: 1e4
		});
		if (result.code === 0 && result.stdout.trim()) {
			const prefix = result.stdout.trim();
			const candidate = path.join(prefix, "bin", "signal-cli");
			try {
				await fs.access(candidate);
				return candidate;
			} catch {
				return findSignalCliBinary(prefix);
			}
		}
	} catch {}
	return null;
}
async function installSignalCliViaBrew(runtime) {
	const brewExe = resolveBrewExecutable();
	if (!brewExe) return {
		ok: false,
		error: `No native signal-cli build is available for ${process.platform}/${process.arch}. Install Homebrew (https://brew.sh) and try again, or install signal-cli manually.`
	};
	runtime.log(`Installing signal-cli via Homebrew (${brewExe})…`);
	const result = await runPluginCommandWithTimeout({
		argv: [
			brewExe,
			"install",
			"signal-cli"
		],
		timeoutMs: 15 * 6e4
	});
	if (result.code !== 0) return {
		ok: false,
		error: `brew install signal-cli failed (exit ${result.code}): ${truncateUtf16Safe(result.stderr.trim(), 200)}`
	};
	const cliPath = await resolveBrewSignalCliPath(brewExe);
	if (!cliPath) return {
		ok: false,
		error: "brew install succeeded but signal-cli binary was not found."
	};
	let version;
	try {
		version = (await runPluginCommandWithTimeout({
			argv: [cliPath, "--version"],
			timeoutMs: 1e4
		})).stdout.trim().replace(/^signal-cli\s+/, "") || void 0;
	} catch {}
	return {
		ok: true,
		cliPath,
		version
	};
}
/** @internal Exported for testing. */
async function installSignalCliFromRelease(runtime) {
	const { response, release } = await fetchWithSsrFGuard({
		url: "https://api.github.com/repos/AsamK/signal-cli/releases/latest",
		maxRedirects: 5,
		requireHttps: true,
		timeoutMs: SIGNAL_CLI_RELEASE_INFO_TIMEOUT_MS,
		capture: false,
		auditContext: "signal-cli-release-info",
		init: { headers: {
			"User-Agent": "openclaw",
			Accept: "application/vnd.github+json"
		} }
	});
	let releaseInfo;
	try {
		if (!response.ok) {
			await cancelUnusedResponseBody(response);
			return {
				ok: false,
				error: `Failed to fetch release info (${response.status})`
			};
		}
		try {
			const normalized = normalizeSignalCliRelease(await readProviderJsonObjectResponse(response, "signal.release-info"));
			if (!normalized) throw new Error("Unexpected signal-cli release info");
			releaseInfo = normalized;
		} catch {
			return {
				ok: false,
				error: "Failed to parse signal-cli release info."
			};
		}
	} finally {
		await release();
	}
	const asset = pickAsset(releaseInfo.assets, process.platform, process.arch);
	if (!asset) return {
		ok: false,
		error: "No compatible release asset found for this platform."
	};
	return await withTempDownloadPath({
		prefix: "openclaw-signal",
		fileName: asset.name
	}, async (archivePath) => {
		runtime.log(`Downloading signal-cli ${releaseInfo.version} (${asset.name})…`);
		await downloadToFile(asset.browser_download_url, archivePath);
		const installRoot = path.join(CONFIG_DIR, "tools", "signal-cli", releaseInfo.version);
		await fs.mkdir(installRoot, { recursive: true });
		if (!looksLikeArchive(normalizeLowercaseStringOrEmpty(asset.name))) return {
			ok: false,
			error: `Unsupported archive type: ${asset.name}`
		};
		try {
			await extractSignalCliArchive(archivePath, installRoot, 6e4);
		} catch (err) {
			const message = formatErrorMessage(err);
			return {
				ok: false,
				error: `Failed to extract ${asset.name}: ${message}`
			};
		}
		const cliPath = await findSignalCliBinary(installRoot);
		if (!cliPath) return {
			ok: false,
			error: `signal-cli binary not found after extracting ${asset.name}`
		};
		await fs.chmod(cliPath, 493).catch(() => {});
		return {
			ok: true,
			cliPath,
			version: releaseInfo.version
		};
	});
}
async function installSignalCli(runtime) {
	if (process.platform === "win32") return {
		ok: false,
		error: "Signal CLI auto-install is not supported on Windows yet."
	};
	if (process.platform === "linux" && process.arch === "x64") return installSignalCliFromRelease(runtime);
	return installSignalCliViaBrew(runtime);
}
//#endregion
export { installSignalCliFromRelease as a, installSignalCli as i, downloadToFile as n, looksLikeArchive as o, extractSignalCliArchive as r, pickAsset as s, MAX_SIGNAL_CLI_EXTRACTED_BYTES as t };
