import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { i as cancelUnreadResponseBody } from "./http-body-DthsuKdw.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-BXG5plR9.js";
import { i as fetchWithSsrFGuard } from "./fetch-guard-D2tMUB-B.js";
import { s as withFileLock } from "./file-lock-DRVK2jTz.js";
import "./file-lock-CS5vu_jB.js";
import { t as extractArchive } from "./archive-BGeFIA99.js";
import "./archive-C_u9XKKj.js";
import { a as getBinDir, t as APP_NAME } from "./config-CZgqjEsz.js";
import { chmodSync, createWriteStream, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { arch, platform } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import chalk from "chalk";
import { Readable, Transform } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/agents/utils/tools-manager.ts
/**
* Tool binary manager for agent-side helper commands.
*
* Locates or downloads pinned helper binaries such as fd and ripgrep.
*/
const TOOLS_DIR = getBinDir();
const NETWORK_TIMEOUT_MS = 1e4;
const DOWNLOAD_TIMEOUT_MS = 12e4;
const MAX_ARCHIVE_BYTES = 100 * 1024 * 1024;
const MAX_EXTRACTED_BYTES = 500 * 1024 * 1024;
const MAX_ARCHIVE_ENTRIES = 1e3;
const ARCHIVE_EXTRACT_TIMEOUT_MS = 6e4;
const CONTENT_LENGTH_RE = /^\d+$/;
const GITHUB_RELEASE_JSON_MAX_BYTES = 1024 * 1024;
const TOOL_INSTALL_STALE_MS = 22e4;
const toolInstallations = /* @__PURE__ */ new Map();
const TOOL_INSTALL_LOCK_OPTIONS = {
	retries: {
		retries: 480,
		factor: 1.2,
		minTimeout: 25,
		maxTimeout: 500,
		randomize: true
	},
	stale: TOOL_INSTALL_STALE_MS,
	staleRecovery: "remove-if-unchanged"
};
function isOfflineModeEnabled() {
	return isTruthyEnvValue(process.env.OPENCLAW_OFFLINE);
}
const TOOLS = {
	fd: {
		name: "fd",
		repo: "sharkdp/fd",
		binaryName: "fd",
		systemBinaryNames: ["fd", "fdfind"],
		tagPrefix: "v",
		getAssetName: (version, plat, architecture) => {
			if (plat === "darwin") return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-apple-darwin.tar.gz`;
			else if (plat === "linux") return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-unknown-linux-gnu.tar.gz`;
			else if (plat === "win32") return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-pc-windows-msvc.zip`;
			return null;
		}
	},
	rg: {
		name: "ripgrep",
		repo: "BurntSushi/ripgrep",
		binaryName: "rg",
		tagPrefix: "",
		getAssetName: (version, plat, architecture) => {
			if (plat === "darwin") return `ripgrep-${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-apple-darwin.tar.gz`;
			else if (plat === "linux") {
				if (architecture === "arm64") return `ripgrep-${version}-aarch64-unknown-linux-gnu.tar.gz`;
				return `ripgrep-${version}-x86_64-unknown-linux-musl.tar.gz`;
			} else if (plat === "win32") return `ripgrep-${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-pc-windows-msvc.zip`;
			return null;
		}
	}
};
function commandExists(cmd) {
	try {
		const result = spawnSync(cmd, ["--version"], {
			killSignal: "SIGKILL",
			stdio: "pipe",
			timeout: 5e3
		});
		return !result.error && result.status === 0;
	} catch {
		return false;
	}
}
function getToolPath(tool) {
	const config = TOOLS[tool];
	const localPath = join(TOOLS_DIR, config.binaryName + (platform() === "win32" ? ".exe" : ""));
	if (existsSync(localPath)) return localPath;
	const systemBinaryNames = config.systemBinaryNames ?? [config.binaryName];
	for (const systemBinaryName of systemBinaryNames) if (commandExists(systemBinaryName)) return systemBinaryName;
	return null;
}
async function getLatestVersion(repo) {
	const guarded = await fetchWithSsrFGuard({
		url: `https://api.github.com/repos/${repo}/releases/latest`,
		timeoutMs: NETWORK_TIMEOUT_MS,
		auditContext: "tools-manager-release-check",
		init: { headers: { "User-Agent": `${APP_NAME}-coding-agent` } }
	});
	const { response } = guarded;
	try {
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new Error(`GitHub API error: ${response.status}`);
		}
		return (await readProviderJsonResponse(response, "GitHub release", { maxBytes: GITHUB_RELEASE_JSON_MAX_BYTES })).tag_name.replace(/^v/, "");
	} finally {
		await guarded.release();
	}
}
async function downloadFile(url, dest, maxBytes) {
	const guarded = await fetchWithSsrFGuard({
		url,
		timeoutMs: DOWNLOAD_TIMEOUT_MS,
		auditContext: "tools-manager-download"
	});
	const { response } = guarded;
	try {
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new Error(`Failed to download: ${response.status}`);
		}
		if (!response.body) throw new Error("No response body");
		const rawContentLength = response.headers.get("content-length");
		if (rawContentLength !== null) {
			const contentLength = rawContentLength.trim();
			if (CONTENT_LENGTH_RE.test(contentLength)) {
				const declaredBytes = Number(contentLength);
				if (!Number.isSafeInteger(declaredBytes) || declaredBytes > maxBytes) {
					await cancelUnreadResponseBody(response);
					throw new Error(`Download exceeds the ${maxBytes}-byte archive limit`);
				}
			}
		}
		const fileStream = createWriteStream(dest);
		let downloadCompleted = false;
		try {
			let downloadedBytes = 0;
			const byteCap = new Transform({ transform(chunk, _encoding, callback) {
				downloadedBytes += chunk.byteLength;
				if (downloadedBytes > maxBytes) {
					callback(/* @__PURE__ */ new Error(`Download exceeded the ${maxBytes}-byte archive limit`));
					return;
				}
				callback(null, chunk);
			} });
			await pipeline$1(Readable.fromWeb(response.body), byteCap, fileStream);
			downloadCompleted = true;
		} finally {
			if (!downloadCompleted) rmSync(dest, { force: true });
		}
	} finally {
		await guarded.release();
	}
}
function findBinaryRecursively(rootDir, binaryFileName) {
	const stack = [rootDir];
	while (stack.length > 0) {
		const currentDir = stack.pop();
		if (!currentDir) continue;
		const entries = readdirSync(currentDir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = join(currentDir, entry.name);
			if (entry.isFile() && entry.name === binaryFileName) return fullPath;
			if (entry.isDirectory()) stack.push(fullPath);
		}
	}
	return null;
}
async function extractArchiveSafe(archivePath, extractDir, assetName) {
	try {
		await extractArchive({
			archivePath,
			destDir: extractDir,
			timeoutMs: ARCHIVE_EXTRACT_TIMEOUT_MS,
			limits: {
				maxArchiveBytes: MAX_ARCHIVE_BYTES,
				maxExtractedBytes: MAX_EXTRACTED_BYTES,
				maxEntries: MAX_ARCHIVE_ENTRIES
			}
		});
	} catch (err) {
		throw new Error(`Failed to extract ${assetName}: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
	}
}
async function downloadTool(tool) {
	const config = TOOLS[tool];
	const plat = platform();
	const architecture = arch();
	let version = await getLatestVersion(config.repo);
	if (tool === "fd" && plat === "darwin" && architecture === "x64") version = "10.3.0";
	const assetName = config.getAssetName(version, plat, architecture);
	if (!assetName) throw new Error(`Unsupported platform: ${plat}/${architecture}`);
	mkdirSync(TOOLS_DIR, { recursive: true });
	const downloadUrl = `https://github.com/${config.repo}/releases/download/${config.tagPrefix}${version}/${assetName}`;
	const binaryExt = plat === "win32" ? ".exe" : "";
	const binaryPath = join(TOOLS_DIR, config.binaryName + binaryExt);
	const stagingDir = join(TOOLS_DIR, `install_tmp_${config.binaryName}_${process.pid}_${randomUUID()}`);
	const archivePath = join(stagingDir, assetName);
	const extractDir = join(stagingDir, "extract");
	mkdirSync(extractDir, { recursive: true });
	try {
		await downloadFile(downloadUrl, archivePath, MAX_ARCHIVE_BYTES);
		if (assetName.endsWith(".tar.gz") || assetName.endsWith(".zip")) await extractArchiveSafe(archivePath, extractDir, assetName);
		else throw new Error(`Unsupported archive format: ${assetName}`);
		const binaryFileName = config.binaryName + binaryExt;
		let extractedBinary = [join(join(extractDir, assetName.replace(/\.(tar\.gz|zip)$/, "")), binaryFileName), join(extractDir, binaryFileName)].find((candidate) => existsSync(candidate));
		if (!extractedBinary) extractedBinary = findBinaryRecursively(extractDir, binaryFileName) ?? void 0;
		if (extractedBinary) renameSync(extractedBinary, binaryPath);
		else throw new Error(`Binary not found in archive: expected ${binaryFileName} under ${extractDir}`);
		if (plat !== "win32") chmodSync(binaryPath, 493);
	} finally {
		rmSync(stagingDir, {
			recursive: true,
			force: true
		});
	}
	return binaryPath;
}
function installTool(tool) {
	const currentInstallation = toolInstallations.get(tool);
	if (currentInstallation) return currentInstallation;
	const config = TOOLS[tool];
	const binaryPath = join(TOOLS_DIR, config.binaryName + (platform() === "win32" ? ".exe" : ""));
	mkdirSync(TOOLS_DIR, { recursive: true });
	const installation = withFileLock(binaryPath, TOOL_INSTALL_LOCK_OPTIONS, async () => {
		return getToolPath(tool) ?? downloadTool(tool);
	});
	toolInstallations.set(tool, installation);
	installation.then(() => {
		if (toolInstallations.get(tool) === installation) toolInstallations.delete(tool);
	}, () => {
		if (toolInstallations.get(tool) === installation) toolInstallations.delete(tool);
	});
	return installation;
}
const TERMUX_PACKAGES = {
	fd: "fd",
	rg: "ripgrep"
};
async function ensureTool(tool, silent = false) {
	const existingPath = getToolPath(tool);
	if (existingPath) return existingPath;
	const config = TOOLS[tool];
	if (isOfflineModeEnabled()) {
		if (!silent) console.log(chalk.yellow(`${config.name} not found. Offline mode enabled, skipping download.`));
		return;
	}
	if (platform() === "android") {
		const pkgName = TERMUX_PACKAGES[tool] ?? tool;
		if (!silent) console.log(chalk.yellow(`${config.name} not found. Install with: pkg install ${pkgName}`));
		return;
	}
	if (!silent) console.log(chalk.dim(`${config.name} not found. Downloading...`));
	try {
		const path = await installTool(tool);
		if (!silent) console.log(chalk.dim(`${config.name} installed to ${path}`));
		return path;
	} catch (e) {
		if (!silent) console.log(chalk.yellow(`Failed to download ${config.name}: ${e instanceof Error ? e.message : String(e)}`));
		return;
	}
}
const testing = { downloadFile };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.toolsManagerTestApi")] = { testing };
//#endregion
export { ensureTool as t };
