import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { t as asBoolean } from "../../boolean-DmBL0YJK.js";
import { a as asOptionalRecord, c as isRecord } from "../../record-coerce-DItp3I4t.js";
import { d as asPositiveSafeInteger } from "../../number-coercion-CLj0HTDM.js";
import { l as hasConfiguredSecretInput } from "../../types.secrets-Bre8L6Ts.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "../../ssrf-arYIaOWE.js";
import { i as fetchWithSsrFGuard, r as fetchConfiguredLocalOriginWithSsrFGuard } from "../../fetch-guard-D2tMUB-B.js";
import { t as resolveConfiguredSecretInputString } from "../../resolve-configured-secret-input-string-DCrdl1eX.js";
import { c as isNonSecretApiKeyMarker } from "../../model-auth-markers-CYmICvL9.js";
import "../../llm-BkUeN9nv.js";
import { t as normalizeOptionalSecretInput } from "../../normalize-secret-input-Df_qhWv_.js";
import { i as streamSimple } from "../../stream-CXbsApnu.js";
import { o as removeProviderAuthProfilesWithLock } from "../../profiles-B9i8Wh87.js";
import { b as setQwenChatTemplateThinking } from "../../provider-stream-shared-DEARVxDz.js";
import { t as getEmbeddingProvider } from "../../embedding-provider-runtime-DUE6c9o9.js";
import "../../provider-auth-DI4TAoBi.js";
import { r as upsertAuthProfileWithLockCompat } from "../../provider-auth-write-compat-BVWrJFNm.js";
import { t as ensureApiKeyFromEnvOrPrompt } from "../../provider-auth-input-C-ILRTSQ.js";
import { i as removeAuthProfileConfig, n as buildApiKeyCredential, t as applyAuthProfileConfig } from "../../provider-auth-helpers-DW8KYD7F.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { n as applyProviderDefaultModel, s as SELF_HOSTED_DEFAULT_COST, t as discoverOpenAICompatibleLocalModels } from "../../provider-setup-C98Jreue.js";
import { f as selectPreferredLocalModelId } from "../../provider-model-shared-QR1VEK28.js";
import "../../ssrf-runtime-CpSMUPcn.js";
import "../../ssrf-runtime-internal-DgksOixt.js";
import "../../embedding-providers-DY01lvtW.js";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-C9IBkITf.js";
import { a as getCachedLiveCatalogValue } from "../../provider-catalog-shared-DkuIv-OV.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-mj-Qt8cY.js";
import "../../secret-input-runtime-CMP_ZlQP.js";
import { C as resolveLegacyLlamaCppModelCacheDir, D as resolveLlamaCppSyntheticApiKey, E as resolveLlamaCppModelSource, S as resolveHomePath, T as resolveLlamaCppModelCacheDir, _ as LLAMA_CPP_PROVIDER_ID, a as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, b as meetsLlamaCppDefaultModelRamFloor, c as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256, d as DEFAULT_LLAMA_CPP_MODEL_ID, f as DEFAULT_LLAMA_CPP_MODEL_REVISION, g as LLAMA_CPP_DEFAULT_PORT, i as DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE, l as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES, m as DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES, n as resolveManagedLlamaCppProviderConfig, o as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID, p as DEFAULT_LLAMA_CPP_MODEL_SHA256, s as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION, u as DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE, v as LLAMA_CPP_PROVIDER_LABEL, w as resolveLlamaCppDataDir, x as resolveCachedLlamaCppModelPath, y as buildLlamaCppProviderConfig } from "../../managed-provider-config-ByJLsILr.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import net from "node:net";
import * as tar from "tar";
import JSZip from "jszip";
//#region extensions/llama-cpp/src/llama-server-assets.ts
const LLAMA_SERVER_RELEASE = "b10488";
const LLAMA_SERVER_COMMIT = "9d77fa17254e1dee4b9e92504c91611a60b1359f";
const LLAMA_SERVER_ASSETS = [
	{
		platform: "darwin",
		arch: "arm64",
		backend: "metal",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-arm64.tar.gz`,
		sha256: "ada90bbc4787caac49fbb95ed2487a03fb4bbb456057a31e316878e1a895827a",
		executable: "llama-server"
	},
	{
		platform: "darwin",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-x64.tar.gz`,
		sha256: "80567f47511d5e11872835614b99cd678fa276b05553563e8aab3f2cb6b90abd",
		executable: "llama-server"
	},
	{
		platform: "linux",
		arch: "arm64",
		backend: "cpu",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-arm64.tar.gz`,
		sha256: "e977e13e9d72b8ee0068336bb9196f4f8158e8b53b8d502dc8bdb55eaea1222f",
		executable: "llama-server"
	},
	{
		platform: "linux",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-x64.tar.gz`,
		sha256: "5a7073371d5a9b8e39978b35f49b2ff244f7a064edb92f0326d94e12b52261dd",
		executable: "llama-server"
	},
	{
		platform: "win32",
		arch: "arm64",
		backend: "cpu",
		archive: "zip",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-arm64.zip`,
		sha256: "97a883831728862568a0e7e38380e7a179b6bcb292167f648a5598586dd65635",
		executable: "llama-server.exe"
	},
	{
		platform: "win32",
		arch: "x64",
		backend: "cpu",
		archive: "zip",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-x64.zip`,
		sha256: "6c938f6d79aac96cb90fda673aade20cff9b1b6c1e97de04f4d5d60bca107082",
		executable: "llama-server.exe"
	}
];
function selectLlamaServerAsset(platform = process.platform, arch = process.arch) {
	const asset = LLAMA_SERVER_ASSETS.find((candidate) => candidate.platform === platform && candidate.arch === arch);
	if (!asset) throw new Error(`No verified llama-server ${LLAMA_SERVER_RELEASE} build is available for ${platform}/${arch}. Install a compatible llama-server manually, then rerun llama.cpp setup with its absolute path.`);
	return asset;
}
function resolveManagedLlamaServerPaths(asset = selectLlamaServerAsset()) {
	const installDir = path.join(resolveLlamaCppDataDir(), LLAMA_SERVER_RELEASE, `${asset.platform}-${asset.arch}`);
	return {
		installDir,
		command: path.join(installDir, asset.executable),
		presetPath: path.join(resolveLlamaCppDataDir(), "models.ini")
	};
}
//#endregion
//#region extensions/llama-cpp/src/llama-server-install.ts
const DOWNLOAD_TIMEOUT_MS = 30 * 6e4;
const VERSION_TIMEOUT_MS = 15e3;
const installationPromises = /* @__PURE__ */ new Map();
function compareVersion(left, right) {
	const leftParts = left.split(".").map(Number);
	const rightParts = right.split(".").map(Number);
	for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
		const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
		if (delta !== 0) return delta;
	}
	return 0;
}
function assertSupportedLinuxRuntime(asset) {
	if (asset.platform !== "linux") return;
	const header = asOptionalRecord(asOptionalRecord(process.report?.getReport())?.header);
	const glibc = typeof header?.glibcVersionRuntime === "string" ? header.glibcVersionRuntime : "";
	if (!glibc) throw new Error("The verified Ubuntu llama-server build requires glibc and cannot run on musl/Alpine. Install llama-server manually for this host and configure its absolute path.");
	const minimum = asset.arch === "arm64" ? "2.38" : "2.34";
	if (compareVersion(glibc, minimum) < 0) throw new Error(`The verified llama-server build requires glibc ${minimum}+ on Linux ${asset.arch}; this host has ${glibc}. Install a compatible llama-server manually and configure its absolute path.`);
}
function assetUrl(asset) {
	return `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_SERVER_RELEASE}/${asset.name}`;
}
async function sha256File(filePath) {
	const hash = createHash("sha256");
	await new Promise((resolve, reject) => {
		const input = fs.createReadStream(filePath);
		input.on("data", (chunk) => hash.update(chunk));
		input.once("error", reject);
		input.once("end", resolve);
	});
	return hash.digest("hex");
}
function readResponseSha256(response) {
	for (const name of ["x-checksum-sha256", "x-linked-etag"]) {
		const value = response.headers.get(name)?.replace(/^W\//u, "").replaceAll("\"", "").trim();
		if (value && /^[a-f\d]{64}$/iu.test(value)) return value.toLowerCase();
	}
	const encoded = response.headers.get("digest")?.match(/(?:^|,)\s*sha-256=([^,\s]+)/iu)?.[1];
	return encoded ? Buffer.from(encoded, "base64").toString("hex") : void 0;
}
async function downloadVerifiedFile(params) {
	const partialPath = `${params.destination}.partial-${randomUUID()}`;
	await fs$1.mkdir(path.dirname(params.destination), { recursive: true });
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedOrigin } = await import("../../plugin-sdk/ssrf-runtime.js");
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url: params.url,
			signal: params.signal,
			timeoutMs: DOWNLOAD_TIMEOUT_MS,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.url),
			requireHttps: true,
			auditContext: "llama-cpp-download"
		});
		try {
			if (!response.ok || !response.body) throw new Error(`download failed: HTTP ${response.status} ${response.statusText}`);
			const expectedSha256 = params.expectedSha256 ?? readResponseSha256(response);
			if (!expectedSha256 && params.requireServerDigest) throw new Error("the download server did not provide a SHA-256 digest; download the GGUF manually and configure its local path");
			const contentLength = Number(response.headers.get("content-length"));
			const totalSize = params.expectedSize ?? (Number.isFinite(contentLength) && contentLength > 0 ? contentLength : 0);
			const handle = await fs$1.open(partialPath, "wx", 384);
			const hash = createHash("sha256");
			let downloadedSize = 0;
			let previousSize = 0;
			let previousAt = Date.now();
			let rollingBytesPerSecond = 0;
			try {
				for await (const value of response.body.values({ preventCancel: true })) {
					const chunk = Buffer.from(value);
					await handle.writeFile(chunk);
					hash.update(chunk);
					downloadedSize += chunk.byteLength;
					const now = Date.now();
					if (now > previousAt) {
						const currentRate = (downloadedSize - previousSize) * 1e3 / (now - previousAt);
						rollingBytesPerSecond = rollingBytesPerSecond === 0 ? currentRate : rollingBytesPerSecond * .75 + currentRate * .25;
					}
					previousSize = downloadedSize;
					previousAt = now;
					params.onProgress?.({
						downloadedSize,
						totalSize,
						bytesPerSecond: rollingBytesPerSecond
					});
				}
			} finally {
				await handle.close();
			}
			if (params.expectedSize && downloadedSize !== params.expectedSize) throw new Error(`download size mismatch: expected ${params.expectedSize}, got ${downloadedSize}`);
			const actualSha256 = hash.digest("hex");
			if (expectedSha256 && actualSha256 !== expectedSha256.toLowerCase()) throw new Error(`download SHA-256 mismatch: expected ${expectedSha256}, got ${actualSha256}`);
			await fs$1.rename(partialPath, params.destination);
		} finally {
			await release();
		}
	} finally {
		await fs$1.rm(partialPath, { force: true }).catch(() => void 0);
	}
}
async function extractZip(archivePath, destination) {
	const zip = await JSZip.loadAsync(await fs$1.readFile(archivePath));
	for (const entry of Object.values(zip.files)) {
		const normalized = path.posix.normalize(entry.name);
		if (normalized.startsWith("/") || normalized === ".." || normalized.startsWith("../")) throw new Error(`unsafe path in llama-server archive: ${entry.name}`);
		const outputPath = path.join(destination, ...normalized.split("/"));
		if (entry.dir) await fs$1.mkdir(outputPath, { recursive: true });
		else {
			await fs$1.mkdir(path.dirname(outputPath), { recursive: true });
			await fs$1.writeFile(outputPath, await entry.async("nodebuffer"), { mode: 384 });
		}
	}
}
async function findExecutable(root, executable) {
	for (const entry of await fs$1.readdir(root, { withFileTypes: true })) {
		const candidate = path.join(root, entry.name);
		if (entry.isFile() && entry.name === executable) return candidate;
		if (entry.isDirectory()) {
			const nested = await findExecutable(candidate, executable).catch(() => void 0);
			if (nested) return nested;
		}
	}
	throw new Error(`llama-server archive does not contain ${executable}`);
}
async function runVersion(command) {
	return await new Promise((resolve, reject) => {
		execFile(command, ["--version"], { timeout: VERSION_TIMEOUT_MS }, (error, stdout, stderr) => {
			if (error) reject(new Error(error.message, { cause: error }));
			else resolve(`${stdout}${stderr}`.trim());
		});
	});
}
function formatRuntimeDependencyError(error) {
	const detail = error instanceof Error ? error.message : String(error);
	if (process.platform === "linux") return new Error(`The verified llama-server build could not start. Install the OpenMP runtime (for example libgomp1 on Debian/Ubuntu or libgomp on Fedora), then rerun llama.cpp setup. Detail: ${detail}`, { cause: error });
	if (process.platform === "win32") return new Error(`The verified llama-server build could not start. Install the Microsoft Visual C++ 2015-2022 Redistributable, then rerun llama.cpp setup. Detail: ${detail}`, { cause: error });
	return new Error(`The verified llama-server build could not start: ${detail}`, { cause: error });
}
async function validateInstalledServer(command) {
	let version;
	try {
		version = await runVersion(command);
	} catch (error) {
		throw formatRuntimeDependencyError(error);
	}
	const match = (version.split(/\r?\n/u, 1)[0]?.trim() ?? "").match(/^version: .+ \(build (\d+), commit ([a-f\d]{9})\)$/u);
	const build = match?.[1] ? Number(match[1]) : void 0;
	const commit = match?.[2];
	if (build !== 10488 || commit !== "9d77fa17254e1dee4b9e92504c91611a60b1359f".slice(0, 9)) throw new Error(`Unexpected llama-server build at ${command}: expected ${LLAMA_SERVER_RELEASE} (${LLAMA_SERVER_COMMIT.slice(0, 9)}), got ${version || "no version output"}`);
}
async function installLlamaServer(asset) {
	assertSupportedLinuxRuntime(asset);
	const { installDir, command } = resolveManagedLlamaServerPaths(asset);
	if (await fs$1.stat(command).then((stat) => stat.isFile()).catch(() => false)) {
		await validateInstalledServer(command);
		return command;
	}
	const dataDir = resolveLlamaCppDataDir();
	const archivePath = path.join(dataDir, `.download-${randomUUID()}-${asset.name}`);
	const extractDir = path.join(dataDir, `.extract-${randomUUID()}`);
	await fs$1.mkdir(dataDir, { recursive: true });
	try {
		await downloadVerifiedFile({
			url: assetUrl(asset),
			destination: archivePath,
			expectedSha256: asset.sha256
		});
		await fs$1.mkdir(extractDir, { recursive: true });
		if (asset.archive === "zip") await extractZip(archivePath, extractDir);
		else await tar.x({
			file: archivePath,
			cwd: extractDir,
			preservePaths: false
		});
		const extractedCommand = await findExecutable(extractDir, asset.executable);
		const extractedRoot = path.dirname(extractedCommand);
		await fs$1.chmod(extractedCommand, 493);
		await validateInstalledServer(extractedCommand);
		await fs$1.mkdir(path.dirname(installDir), { recursive: true });
		await fs$1.rm(installDir, {
			recursive: true,
			force: true
		});
		await fs$1.rename(extractedRoot, installDir);
		await validateInstalledServer(command);
		return command;
	} finally {
		await Promise.all([fs$1.rm(archivePath, { force: true }), fs$1.rm(extractDir, {
			recursive: true,
			force: true
		})]);
	}
}
async function ensureLlamaServerInstalled() {
	const asset = selectLlamaServerAsset();
	const key = `${asset.platform}/${asset.arch}/${LLAMA_SERVER_RELEASE}`;
	const pending = installationPromises.get(key) ?? installLlamaServer(asset);
	installationPromises.set(key, pending);
	try {
		return {
			command: await pending,
			asset
		};
	} finally {
		if (installationPromises.get(key) === pending) installationPromises.delete(key);
	}
}
//#endregion
//#region extensions/llama-cpp/src/managed-server.ts
const modelPromises = /* @__PURE__ */ new Map();
const chatPreparationPromises = /* @__PURE__ */ new Map();
const presetWritePromises = /* @__PURE__ */ new Map();
const LLAMA_CPP_EMBEDDING_UBATCH_SIZE = 2048;
function parseHuggingFaceSource(source) {
	const [pathPart, revisionPart] = source.replace(/^(?:hf|huggingface):(?:\/\/)?/iu, "").split("#", 2);
	const [user, repositoryWithTag, ...fileParts] = (pathPart ?? "").split("/");
	const [repository, ...tagParts] = (repositoryWithTag ?? "").split(":");
	if (!user || !repository) throw new Error(`Invalid Hugging Face model URI: ${source}`);
	return {
		user,
		repository,
		file: fileParts.length > 0 ? fileParts.join("/") : void 0,
		revision: revisionPart || "main",
		tag: tagParts.length > 0 ? tagParts.join(":") : void 0
	};
}
async function resolveHuggingFaceArtifact(source, signal) {
	const parsed = parseHuggingFaceSource(source);
	let file = parsed.file;
	let expectedSize;
	if (!file) {
		const tag = parsed.tag || "latest";
		const manifestUrl = `https://huggingface.co/v2/${encodeURIComponent(parsed.user)}/${encodeURIComponent(parsed.repository)}/manifests/${encodeURIComponent(tag)}`;
		const { response, release } = await fetchWithSsrFGuard({
			url: manifestUrl,
			init: { headers: { "user-agent": "llama-cpp" } },
			signal,
			requireHttps: true,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(manifestUrl),
			auditContext: "llama-cpp-model-resolve"
		});
		try {
			if (!response.ok) throw new Error(`Cannot resolve ${source}: HTTP ${response.status}`);
			const ggufFile = asOptionalRecord(asOptionalRecord(await response.json())?.ggufFile);
			file = typeof ggufFile?.rfilename === "string" ? ggufFile.rfilename : void 0;
			expectedSize = typeof ggufFile?.size === "number" ? ggufFile.size : void 0;
			if (!file) throw new Error(`Hugging Face did not return a GGUF file for ${source}`);
		} finally {
			await release();
		}
	}
	const encodedFile = file.split("/").map(encodeURIComponent).join("/");
	const url = `https://huggingface.co/${encodeURIComponent(parsed.user)}/${encodeURIComponent(parsed.repository)}/resolve/${encodeURIComponent(parsed.revision)}/${encodedFile}?download=true`;
	const treeUrl = `https://huggingface.co/api/models/${encodeURIComponent(parsed.user)}/${encodeURIComponent(parsed.repository)}/tree/${encodeURIComponent(parsed.revision)}?recursive=true&expand=true`;
	const { response: treeResponse, release: releaseTree } = await fetchWithSsrFGuard({
		url: treeUrl,
		signal,
		requireHttps: true,
		policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(treeUrl),
		auditContext: "llama-cpp-model-resolve"
	});
	let tree;
	try {
		if (!treeResponse.ok) throw new Error(`Cannot read Hugging Face integrity metadata for ${source}: HTTP ${treeResponse.status}`);
		tree = await treeResponse.json();
	} finally {
		await releaseTree();
	}
	const fileRow = Array.isArray(tree) ? tree.map((entry) => asOptionalRecord(entry)).find((entry) => entry?.path === file) : void 0;
	const lfs = asOptionalRecord(fileRow?.lfs);
	const expectedSha256 = typeof lfs?.oid === "string" && /^[a-f\d]{64}$/iu.test(lfs.oid) ? lfs.oid.toLowerCase() : void 0;
	expectedSize = expectedSize ?? (typeof fileRow?.size === "number" ? fileRow.size : void 0);
	if (!expectedSha256) throw new Error(`Hugging Face did not publish a SHA-256 LFS identity for ${source}`);
	return {
		fileName: `hf_${[
			parsed.user,
			parsed.repository,
			parsed.revision === "main" ? "" : parsed.revision,
			...file.split("/")
		].filter(Boolean).join("_").replace(/[^a-z\d._-]+/giu, "_")}`,
		url,
		expectedSize,
		expectedSha256
	};
}
function defaultArtifact(source) {
	if (source === "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf") return {
		fileName: DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE,
		url: `https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/${DEFAULT_LLAMA_CPP_MODEL_REVISION}/gemma-4-E4B-it-Q4_K_M.gguf?download=true`,
		expectedSize: DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES,
		expectedSha256: DEFAULT_LLAMA_CPP_MODEL_SHA256
	};
	if (source === "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf") return {
		fileName: DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE,
		url: `https://huggingface.co/ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/resolve/${DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION}/embeddinggemma-300m-qat-Q8_0.gguf?download=true`,
		expectedSize: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES,
		expectedSha256: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256
	};
}
async function assertGguf(filePath) {
	const handle = await fs$1.open(filePath, "r").catch((error) => {
		if ((error instanceof Error && "code" in error ? error.code : void 0) === "ENOENT") throw new Error(`Model file is missing: ${filePath}. Run interactive llama.cpp setup or correct params.modelPath.`, { cause: error });
		throw error;
	});
	try {
		const header = Buffer.alloc(4);
		const { bytesRead } = await handle.read(header, 0, header.length, 0);
		if (bytesRead !== 4 || header.toString("ascii") !== "GGUF") throw new Error(`Model is not a GGUF file: ${filePath}`);
	} finally {
		await handle.close();
	}
}
async function resolveModelArtifact(source, signal) {
	const known = defaultArtifact(source);
	if (known) return known;
	if (/^(?:hf|huggingface):/iu.test(source)) return await resolveHuggingFaceArtifact(source, signal);
	if (/^https:\/\//iu.test(source)) {
		const url = new URL(source);
		const fileName = path.basename(decodeURIComponent(url.pathname));
		if (!fileName.toLowerCase().includes(".gguf")) throw new Error(`Remote model URL must name a GGUF file: ${source}`);
		return {
			fileName,
			url: source
		};
	}
	throw new Error(`Unsupported remote model URI: ${source}`);
}
async function ensureLlamaCppModel(params) {
	const localSource = resolveHomePath(params.source);
	if (!/^(?:hf|huggingface|https):/iu.test(localSource)) {
		const localPath = path.isAbsolute(localSource) ? localSource : path.resolve(params.cacheDir, localSource);
		await assertGguf(localPath);
		return localPath;
	}
	const artifact = await resolveModelArtifact(localSource, params.signal);
	const destination = path.join(params.cacheDir, artifact.fileName);
	const pending = modelPromises.get(destination);
	if (pending) return await pending;
	const load = (async () => {
		if (await fs$1.stat(destination).then((stat) => stat.isFile()).catch(() => false)) if (artifact.expectedSha256) {
			if (await sha256File(destination) === artifact.expectedSha256) return destination;
		} else {
			await assertGguf(destination);
			return destination;
		}
		if (!params.download) throw new Error(`Model is not cached at ${destination}`);
		await downloadVerifiedFile({
			url: artifact.url,
			destination,
			expectedSha256: artifact.expectedSha256,
			expectedSize: artifact.expectedSize,
			requireServerDigest: !artifact.expectedSha256,
			signal: params.signal,
			onProgress: params.onProgress
		});
		await assertGguf(destination);
		return destination;
	})();
	modelPromises.set(destination, load);
	try {
		return await load;
	} finally {
		if (modelPromises.get(destination) === load) modelPromises.delete(destination);
	}
}
function assertIniValue(value, label) {
	if (/\r|\n/u.test(value)) throw new Error(`${label} cannot contain a newline`);
	return value;
}
function renderChatModelSection(params) {
	const id = assertIniValue(params.id, "llama.cpp model id");
	if (id.includes("]")) throw new Error("llama.cpp model ids cannot contain ]");
	return [
		`[${id}]`,
		`model = ${assertIniValue(params.modelPath, "llama.cpp model path")}`,
		`ctx-size = ${params.contextSize ?? 65536}`,
		`n-predict = ${params.maxTokens ?? 2048}`,
		"jinja = true"
	].join("\n");
}
function renderEmbeddingModelSection(params) {
	return [
		`[${DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID}]`,
		`model = ${assertIniValue(params.modelPath, "llama.cpp embedding model path")}`,
		...params.isDefault ? [`ubatch-size = ${LLAMA_CPP_EMBEDDING_UBATCH_SIZE}`] : [],
		"embedding = true"
	].join("\n");
}
function readModelSection(contents, id) {
	if (!contents) return;
	const lines = contents.split(/\r?\n/u);
	const start = lines.indexOf(`[${id}]`);
	if (start < 0) return;
	let end = start + 1;
	while (end < lines.length && !/^\[[^\]]+\]$/u.test(lines[end] ?? "")) end += 1;
	return lines.slice(start, end).join("\n").trimEnd();
}
function readChatModelSection(contents) {
	const id = contents?.split(/\r?\n/u).map((line) => /^\[([^\]]+)\]$/u.exec(line)?.[1]).find((candidate) => candidate && candidate !== "embeddinggemma-300m-qat-q8_0");
	return id ? readModelSection(contents, id) : void 0;
}
function renderLlamaServerPreset(params) {
	return [
		"version = 1",
		"",
		...params.chatSection ? [params.chatSection, ""] : [],
		params.embeddingSection,
		""
	].join("\n");
}
async function writePreset(presetPath, contents) {
	await fs$1.mkdir(path.dirname(presetPath), { recursive: true });
	const temporary = `${presetPath}.tmp-${randomUUID()}`;
	await fs$1.writeFile(temporary, contents, { mode: 384 });
	await fs$1.rename(temporary, presetPath);
}
async function updatePreset(presetPath, params) {
	const pending = (presetWritePromises.get(presetPath) ?? Promise.resolve()).catch(() => void 0).then(async () => {
		const existing = await fs$1.readFile(presetPath, "utf8").catch((error) => {
			if (asOptionalRecord(error)?.code === "ENOENT") return;
			throw error;
		});
		const chatSection = params.chatModel.mode === "preserve" ? readChatModelSection(existing) : params.chatModel.mode === "configure" ? renderChatModelSection({
			id: params.chatModel.id,
			modelPath: params.chatModel.path,
			contextSize: params.chatModel.contextSize,
			maxTokens: params.chatModel.maxTokens
		}) : void 0;
		const embeddingSection = params.embeddingModelPath ? renderEmbeddingModelSection({
			isDefault: params.embeddingModelIsDefault,
			modelPath: params.embeddingModelPath
		}) : readModelSection(existing, "embeddinggemma-300m-qat-q8_0") ?? (params.defaultEmbeddingModelPath ? renderEmbeddingModelSection({
			isDefault: true,
			modelPath: params.defaultEmbeddingModelPath
		}) : void 0);
		if (!embeddingSection) throw new Error("llama.cpp embedding model path is required for a new managed preset");
		await writePreset(presetPath, renderLlamaServerPreset({
			chatSection,
			embeddingSection
		}));
	});
	presetWritePromises.set(presetPath, pending);
	try {
		await pending;
	} finally {
		if (presetWritePromises.get(presetPath) === pending) presetWritePromises.delete(presetPath);
	}
}
async function findAvailableLlamaServerPort(preferred = LLAMA_CPP_DEFAULT_PORT) {
	const tryPort = async (port) => await new Promise((resolve) => {
		const server = net.createServer();
		server.unref();
		server.once("error", () => resolve(void 0));
		server.listen(port, "127.0.0.1", () => {
			const address = server.address();
			const selected = typeof address === "object" && address ? address.port : void 0;
			server.close(() => resolve(selected));
		});
	});
	return await tryPort(preferred) ?? await tryPort(0) ?? Promise.reject(/* @__PURE__ */ new Error("No loopback port is available for llama-server"));
}
async function prepareManagedLlamaServer(params) {
	const { command, asset } = await ensureLlamaServerInstalled();
	const { presetPath } = resolveManagedLlamaServerPaths(asset);
	await updatePreset(presetPath, {
		chatModel: params.chatModel,
		embeddingModelIsDefault: params.embeddingModelIsDefault,
		embeddingModelPath: params.embeddingModelPath,
		defaultEmbeddingModelPath: params.defaultEmbeddingModelPath
	});
	const port = params.port ?? await findAvailableLlamaServerPort();
	const rootUrl = `http://127.0.0.1:${port}`;
	return {
		command,
		baseUrl: `${rootUrl}/v1`,
		healthUrl: `${rootUrl}/health`,
		args: [
			"--host",
			"127.0.0.1",
			"--port",
			String(port),
			"--models-preset",
			presetPath,
			"--models-max",
			"2",
			"--metrics",
			"--no-ui"
		]
	};
}
async function ensureManagedLlamaServerForChat(params) {
	if (!params.provider.localService || !params.provider.baseUrl) return;
	const cacheDir = resolveLlamaCppModelCacheDir(params.provider);
	const key = JSON.stringify([
		params.provider.baseUrl,
		params.model.id,
		params.model.params,
		cacheDir
	]);
	const pending = chatPreparationPromises.get(key) ?? (async () => {
		let chatModelPath = resolveCachedLlamaCppModelPath({
			model: params.model,
			provider: params.provider
		});
		if (!chatModelPath && resolveLlamaCppModelSource(params.model) === "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf") {
			const legacy = path.join(resolveLegacyLlamaCppModelCacheDir(), "hf_unsloth_gemma-4-E4B-it-GGUF_gemma-4-E4B-it-Q4_K_M.gguf");
			if (await fs$1.stat(legacy).then((stat) => stat.isFile()).catch(() => false)) chatModelPath = legacy;
		}
		chatModelPath = await ensureLlamaCppModel({
			source: chatModelPath ?? resolveLlamaCppModelSource(params.model),
			cacheDir,
			download: false
		});
		const configuredContext = params.model.params?.contextSize;
		const port = Number(new URL(params.provider.baseUrl).port);
		await prepareManagedLlamaServer({
			chatModel: {
				mode: "configure",
				id: params.model.id,
				path: chatModelPath,
				contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : params.model.contextTokens,
				maxTokens: params.model.maxTokens
			},
			defaultEmbeddingModelPath: path.join(cacheDir, "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf"),
			port: Number.isInteger(port) && port > 0 ? port : void 0
		});
	})();
	chatPreparationPromises.set(key, pending);
	try {
		await pending;
	} catch (error) {
		if (chatPreparationPromises.get(key) === pending) chatPreparationPromises.delete(key);
		throw error;
	}
}
async function fetchEndpoint(url, accept) {
	try {
		const configuredLocalOriginBaseUrl = new URL(url).origin;
		const { response, release } = await fetchConfiguredLocalOriginWithSsrFGuard({
			url,
			configuredLocalOriginBaseUrl,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(configuredLocalOriginBaseUrl),
			timeoutMs: 2500,
			auditContext: "llama-server-inspect"
		});
		try {
			if (!response.ok) return { ok: false };
			return {
				ok: true,
				value: accept === "json" ? await response.json() : await response.text()
			};
		} finally {
			await release();
		}
	} catch {
		return { ok: false };
	}
}
async function inspectLlamaServerRuntime(params) {
	const root = params.baseUrl.replace(/\/v1\/?$/u, "").replace(/\/+$/u, "");
	const query = `model=${encodeURIComponent(params.modelId)}&autoload=false`;
	const [health, models, props, metrics] = await Promise.all([
		fetchEndpoint(`${root}/health`, "json"),
		fetchEndpoint(`${root}/models`, "json"),
		fetchEndpoint(`${root}/props?${query}`, "json"),
		fetchEndpoint(`${root}/metrics?${query}`, "text")
	]);
	const propsRecord = asOptionalRecord(props.value);
	const modalities = asOptionalRecord(propsRecord?.modalities);
	const modelsRecord = asOptionalRecord(models.value);
	const selected = (Array.isArray(modelsRecord?.data) ? modelsRecord.data : []).map((row) => asOptionalRecord(row)).find((row) => row?.id === params.modelId);
	const pathValue = typeof propsRecord?.model_path === "string" ? propsRecord.model_path : typeof selected?.path === "string" ? selected.path : void 0;
	return {
		engine: "llama.cpp",
		state: health.ok && models.ok && props.ok && metrics.ok && !params.loadError ? "ready" : "failed",
		backend: params.backend,
		buildInfo: typeof propsRecord?.build_info === "string" ? propsRecord.build_info : void 0,
		model: {
			id: params.modelId,
			...pathValue ? { path: pathValue } : {}
		},
		capabilities: {
			vision: modalities?.vision === true,
			draft: false
		},
		endpoints: {
			health: health.ok ? "ready" : "unavailable",
			models: models.ok ? "ready" : "unavailable",
			props: props.ok ? "ready" : "unavailable",
			metrics: metrics.ok ? "ready" : "unavailable"
		},
		...params.loadError ? { loadError: params.loadError } : {}
	};
}
//#endregion
//#region extensions/llama-cpp/src/embedding-provider.ts
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
const preparedEmbeddingServers = /* @__PURE__ */ new Map();
function readLocalOptions(options) {
	return options.local ?? {};
}
function readIdentityLocalOptions(options) {
	const local = readLocalOptions(options);
	const provider = options.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	return provider?.localService ? {
		...local,
		modelCacheDir: resolveLlamaCppModelCacheDir(provider)
	} : local;
}
function createCacheKeyData(model, dimensions) {
	return {
		provider: "local",
		model,
		...typeof dimensions === "number" ? { outputDimensionality: dimensions } : {}
	};
}
function resolveModelIdentity(local, modelPath, dimensions) {
	const configuredCacheDir = normalizeOptionalString(local.modelCacheDir) ?? resolveLlamaCppModelCacheDir();
	const currentDefaultPath = path.resolve(configuredCacheDir, DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE);
	const legacyDefaultPath = path.resolve(resolveLegacyLlamaCppModelCacheDir(), DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE);
	const resolvedPath = /^(?:hf:|https?:\/\/)/iu.test(modelPath) ? void 0 : path.resolve(configuredCacheDir, modelPath);
	if (!(modelPath === "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf" || resolvedPath === currentDefaultPath || resolvedPath === legacyDefaultPath)) return {
		model: modelPath,
		cacheKeyData: createCacheKeyData(modelPath, dimensions),
		aliases: []
	};
	const aliases = /* @__PURE__ */ new Set([
		currentDefaultPath,
		legacyDefaultPath,
		DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE
	]);
	if (modelPath !== "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf") aliases.add(modelPath);
	return {
		model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
		cacheKeyData: createCacheKeyData(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, dimensions),
		aliases: [...aliases].map((model) => ({
			model,
			cacheKeyData: createCacheKeyData(model, dimensions)
		}))
	};
}
function resolveLlamaCppEmbeddingModel(localValue) {
	const local = readLocalOptions({ local: localValue });
	const source = normalizeOptionalString(local.modelPath) ?? "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
	return {
		source,
		isDefault: resolveModelIdentity(local, source).model === DEFAULT_LLAMA_CPP_EMBEDDING_MODEL
	};
}
function resolveConfiguredProvider(options) {
	return resolveManagedLlamaCppProviderConfig(options.config);
}
function resolveProviderPort(provider) {
	const port = Number(new URL(provider.baseUrl ?? "").port);
	if (!Number.isInteger(port) || port <= 0) throw new Error("Managed llama.cpp provider baseUrl must include a loopback port.");
	return port;
}
async function prepareEmbeddingServer(options, embeddingSource, embeddingModelIsDefault) {
	const provider = resolveConfiguredProvider(options);
	const cacheDir = resolveLlamaCppModelCacheDir(provider);
	const key = JSON.stringify([
		provider.baseUrl,
		embeddingSource,
		cacheDir
	]);
	const pending = preparedEmbeddingServers.get(key) ?? (async () => {
		await prepareManagedLlamaServer({
			chatModel: { mode: "preserve" },
			embeddingModelIsDefault,
			embeddingModelPath: await ensureLlamaCppModel({
				source: embeddingSource,
				cacheDir,
				download: true
			}),
			port: resolveProviderPort(provider)
		});
	})();
	preparedEmbeddingServers.set(key, pending);
	try {
		await pending;
	} catch (error) {
		if (preparedEmbeddingServers.get(key) === pending) preparedEmbeddingServers.delete(key);
		throw error;
	}
}
function wrapProvider(params) {
	let runtimeFacts;
	const refreshFacts = async (loadError) => {
		runtimeFacts = await inspectLlamaServerRuntime({
			baseUrl: params.baseUrl,
			modelId: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
			backend: selectLlamaServerAsset().backend,
			loadError
		});
	};
	const withFacts = async (operation) => {
		try {
			const value = await operation();
			await refreshFacts();
			return value;
		} catch (error) {
			await refreshFacts(error instanceof Error ? error.message : String(error));
			throw error;
		}
	};
	const wrapped = {
		id: "local",
		model: params.canonicalModel,
		dimensions: params.provider.dimensions,
		maxInputTokens: params.provider.maxInputTokens,
		embed: async (input, callOptions) => await withFacts(async () => await params.provider.embed(input, callOptions)),
		embedBatch: async (inputs, callOptions) => await withFacts(async () => await params.provider.embedBatch(inputs, callOptions)),
		close: params.provider.close
	};
	Object.defineProperty(wrapped, LOCAL_EMBEDDING_RUNTIME_FACTS, {
		enumerable: false,
		value: () => runtimeFacts
	});
	return wrapped;
}
const llamaCppEmbeddingProviderAdapter = {
	id: "local",
	defaultModel: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
	transport: "local",
	formatSetupError: (error) => `Managed local embeddings are unavailable. Run \`openclaw configure\`, choose llama.cpp, and retry. ${error instanceof Error ? error.message : String(error)}`,
	resolveIndexIdentity: (options) => {
		const local = readIdentityLocalOptions(options);
		return resolveModelIdentity(local, normalizeOptionalString(local.modelPath) ?? "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf", options.dimensions);
	},
	create: async (options) => {
		const local = readIdentityLocalOptions(options);
		const embeddingModel = resolveLlamaCppEmbeddingModel(local);
		const identity = resolveModelIdentity(local, embeddingModel.source, options.dimensions);
		await prepareEmbeddingServer(options, embeddingModel.source, embeddingModel.isDefault);
		const genericAdapter = getEmbeddingProvider("openai-compatible", options.config);
		if (!genericAdapter) throw new Error("OpenAI-compatible embedding transport is unavailable.");
		const result = await genericAdapter.create({
			...options,
			provider: LLAMA_CPP_PROVIDER_ID,
			model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
			remote: void 0
		});
		if (!result.provider) return result;
		return {
			provider: wrapProvider({
				provider: result.provider,
				canonicalModel: identity.model,
				baseUrl: resolveConfiguredProvider(options).baseUrl ?? ""
			}),
			runtime: {
				id: "local",
				inlineQueryTimeoutMs: 5 * 6e4,
				inlineBatchTimeoutMs: 10 * 6e4,
				cacheKeyData: identity.cacheKeyData,
				...identity.aliases.length > 0 ? { indexIdentityAliases: identity.aliases } : {}
			}
		};
	}
};
//#endregion
//#region extensions/llama-cpp/src/external-server/auth.ts
function hasLlamaServerAuthorizationHeader(headers) {
	const record = asOptionalRecord(headers);
	if (!record) return false;
	return Object.entries(record).some(([name, value]) => name.trim().toLowerCase() === "authorization" && hasConfiguredSecretInput(value));
}
function shouldUseLlamaServerSyntheticAuth(providerConfig) {
	const apiKey = normalizeOptionalSecretInput(providerConfig?.apiKey)?.trim();
	return !(hasConfiguredSecretInput(providerConfig?.apiKey) && apiKey !== resolveLlamaCppSyntheticApiKey() && apiKey !== "custom-local");
}
async function resolveLlamaServerProviderHeaders(params) {
	const headers = asOptionalRecord(params.headers);
	if (!headers) return;
	const resolved = {};
	for (const [name, value] of Object.entries(headers)) {
		if (!params.config) {
			if (typeof value === "string" && value.trim()) resolved[name] = value.trim();
			continue;
		}
		const path = `models.providers.${LLAMA_CPP_PROVIDER_ID}.headers.${name}`;
		const header = await resolveConfiguredSecretInputString({
			config: params.config,
			env: params.env ?? process.env,
			value,
			path,
			unresolvedReasonStyle: "detailed"
		});
		if (header.unresolvedRefReason) throw new Error(`${path}: ${header.unresolvedRefReason}`);
		if (header.value) resolved[name] = header.value;
	}
	return Object.keys(resolved).length > 0 ? resolved : void 0;
}
async function resolveLlamaServerRuntimeApiKey(params) {
	const apiKey = (await resolveApiKeyForProvider({
		provider: LLAMA_CPP_PROVIDER_ID,
		cfg: params.config,
		agentDir: params.agentDir,
		profileId: params.profileId,
		lockedProfile: params.profileId !== void 0
	})).apiKey?.trim();
	return apiKey && !isNonSecretApiKeyMarker(apiKey) ? apiKey : void 0;
}
//#endregion
//#region extensions/llama-cpp/src/external-server/defaults.ts
const LLAMA_SERVER_DEFAULT_ORIGIN = "http://127.0.0.1:8080";
const LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR = "LLAMA_SERVER_API_KEY";
//#endregion
//#region extensions/llama-cpp/src/external-server/endpoint.ts
function toFetchableBaseUrl(value) {
	if (/^[a-z][a-z\d+.-]*:\/\//iu.test(value)) return value;
	return `http://${value}`;
}
/** Resolves the server origin and its OpenAI-compatible `/v1` inference base. */
function resolveLlamaServerEndpoint(configuredBaseUrl) {
	const configured = configuredBaseUrl?.trim() || "http://127.0.0.1:8080";
	const parsed = new URL(toFetchableBaseUrl(configured));
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new TypeError(`Unsupported llama-server protocol: ${parsed.protocol}`);
	if (parsed.username || parsed.password) throw new TypeError("llama-server base URL must not contain credentials");
	parsed.pathname = parsed.pathname.replace(/\/+$/u, "").replace(/\/v1$/iu, "") || "/";
	parsed.search = "";
	parsed.hash = "";
	const origin = parsed.toString().replace(/\/$/u, "");
	return {
		origin,
		inferenceBaseUrl: `${origin}/v1`
	};
}
/** Canonicalizes persisted provider config for the shared OpenAI transport. */
function normalizeLlamaServerProviderConfig(provider) {
	const endpoint = resolveLlamaServerEndpoint(provider.baseUrl);
	const request = provider.request ?? {};
	const normalizedRequest = typeof request.allowPrivateNetwork === "boolean" ? request : {
		...request,
		allowPrivateNetwork: true
	};
	return {
		...provider,
		baseUrl: endpoint.inferenceBaseUrl,
		api: "openai-completions",
		request: normalizedRequest
	};
}
//#endregion
//#region extensions/llama-cpp/src/external-server/models.ts
function normalizeStatus(value) {
	switch (value) {
		case "unloaded":
		case "loading":
		case "loaded":
		case "sleeping":
		case "downloading": return value;
		default: return "unknown";
	}
}
function resolveContextWindow(props) {
	return asPositiveSafeInteger(props?.default_generation_settings?.n_ctx) ?? asPositiveSafeInteger(props?.n_ctx) ?? 128e3;
}
function resolveMaxTokens(props, contextWindow) {
	const params = props?.default_generation_settings?.params;
	const advertised = asPositiveSafeInteger(params?.max_tokens) ?? asPositiveSafeInteger(params?.n_predict);
	return Math.min(advertised ?? 8192, contextWindow);
}
function resolveInput(row, props) {
	const advertised = row.architecture?.input_modalities;
	return Array.isArray(advertised) && advertised.includes("image") || props?.modalities?.vision === true ? ["text", "image"] : ["text"];
}
function buildCompat(props) {
	const caps = props?.chat_template_caps;
	return {
		supportsStore: false,
		supportsDeveloperRole: false,
		supportsReasoningEffort: false,
		supportsTemperature: true,
		supportsUsageInStreaming: true,
		supportsTools: asBoolean(caps?.supports_tool_calls) === true,
		supportsStrictMode: false,
		supportsJsonSchemaResponseFormat: true,
		requiresStringContent: !(asBoolean(caps?.supports_typed_content) === true),
		maxTokensField: "max_tokens"
	};
}
/** Maps one llama-server model row plus optional runtime properties into OpenClaw config. */
function mapLlamaServerModel(row, props) {
	const id = typeof row.id === "string" ? row.id.trim() : "";
	if (!id || row.object !== void 0 && row.object !== "model") return null;
	const contextWindow = resolveContextWindow(props);
	return {
		config: {
			id,
			name: id,
			reasoning: false,
			input: resolveInput(row, props),
			cost: { ...SELF_HOSTED_DEFAULT_COST },
			contextWindow,
			contextTokens: contextWindow,
			maxTokens: resolveMaxTokens(props, contextWindow),
			compat: buildCompat(props)
		},
		status: normalizeStatus(row.status?.value),
		failed: row.status?.failed === true
	};
}
/** Keeps explicit rows first and appends models discovered from the server. */
function mergeLlamaServerModels(params) {
	const explicit = Array.isArray(params.explicitModels) ? params.explicitModels : [];
	const merged = [...explicit];
	const seen = new Set(explicit.map((model) => model.id));
	for (const discovered of params.discoveredModels) {
		if (seen.has(discovered.config.id)) continue;
		seen.add(discovered.config.id);
		merged.push(discovered.config);
	}
	return merged;
}
function buildLlamaServerProviderConfig(params) {
	return normalizeLlamaServerProviderConfig({
		...params.configured,
		baseUrl: params.configured?.baseUrl ?? "http://127.0.0.1:8080",
		models: mergeLlamaServerModels({
			explicitModels: params.configured?.models,
			discoveredModels: params.discoveredModels
		})
	});
}
//#endregion
//#region extensions/llama-cpp/src/external-server/discovery.ts
/** Discovers llama-server models without loading, waking, or unloading them. */
async function discoverLlamaServer(params) {
	const endpoint = resolveLlamaServerEndpoint(params.baseUrl);
	const apiKey = params.apiKey?.trim();
	const cacheTtlMs = Boolean(apiKey && !isNonSecretApiKeyMarker(apiKey)) || Boolean(params.headers && Object.keys(params.headers).length > 0) ? 0 : Math.max(0, params.cacheTtlMs ?? 3e4);
	return await getCachedLiveCatalogValue({
		keyParts: [
			"llama-cpp",
			"external",
			endpoint.origin
		],
		ttlMs: cacheTtlMs,
		shouldCache: (result) => result.kind === "success",
		load: async () => {
			const result = await discoverOpenAICompatibleLocalModels({
				baseUrl: endpoint.inferenceBaseUrl,
				serverBaseUrl: endpoint.origin,
				apiKey: params.apiKey,
				headers: params.headers,
				label: "llama-server",
				healthPath: "/health",
				modelsPathOrder: "server-first",
				routerModelProps: true,
				timeoutMs: params.timeoutMs ?? 5e3,
				signal: params.signal,
				rawResult: true
			});
			if (result.kind !== "success") return {
				...result,
				endpoint
			};
			return {
				kind: "success",
				endpoint,
				models: result.rows.flatMap(({ model, props }) => {
					const mapped = mapLlamaServerModel(model, props);
					return mapped ? [mapped] : [];
				})
			};
		}
	});
}
//#endregion
//#region extensions/llama-cpp/src/external-server/provider.ts
/** Discovers external llama-server models for provider runtime resolution. */
async function discoverLlamaServerProvider(ctx) {
	const configured = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const auth = ctx.resolveProviderApiKey(LLAMA_CPP_PROVIDER_ID);
	const headers = await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: ctx.env,
		headers: configured?.headers
	});
	const discovery = await discoverLlamaServer({
		baseUrl: configured?.baseUrl,
		apiKey: hasLlamaServerAuthorizationHeader(headers) ? void 0 : auth.discoveryApiKey ?? auth.apiKey,
		headers
	});
	if (discovery.kind !== "success") return configured ? { provider: buildLlamaServerProviderConfig({
		configured,
		discoveredModels: []
	}) } : null;
	return { provider: buildLlamaServerProviderConfig({
		configured: {
			...configured,
			baseUrl: discovery.endpoint.inferenceBaseUrl,
			models: configured?.models ?? []
		},
		discoveredModels: discovery.models
	}) };
}
async function prepareLlamaServerDynamicModel(ctx) {
	const apiKey = await resolveLlamaServerRuntimeApiKey({
		config: ctx.config,
		agentDir: ctx.agentDir,
		profileId: ctx.authProfileId
	});
	const headers = await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: process.env,
		headers: ctx.providerConfig?.headers
	});
	const discovery = await discoverLlamaServer({
		baseUrl: ctx.providerConfig?.baseUrl,
		apiKey: hasLlamaServerAuthorizationHeader(headers) ? void 0 : apiKey,
		headers,
		cacheTtlMs: 0
	});
	const model = discovery.kind === "success" ? discovery.models.find((entry) => entry.config.id === ctx.modelId) : void 0;
	if (!model) return;
	return {
		...model.config,
		provider: LLAMA_CPP_PROVIDER_ID,
		api: ctx.providerConfig?.api ?? "openai-completions",
		baseUrl: resolveLlamaServerEndpoint(ctx.providerConfig?.baseUrl).inferenceBaseUrl,
		input: model.config.input.filter((entry) => entry === "text" || entry === "image")
	};
}
//#endregion
//#region extensions/llama-cpp/src/auth-config.ts
const LLAMA_CPP_DEFAULT_PROFILE_ID = `${LLAMA_CPP_PROVIDER_ID}:default`;
function buildLlamaCppAuthProfileRemovalPatch(config) {
	const profileExists = Boolean(config.auth?.profiles?.[LLAMA_CPP_DEFAULT_PROFILE_ID]);
	const referencedOrders = Object.entries(config.auth?.order ?? {}).filter(([, ids]) => ids.includes(LLAMA_CPP_DEFAULT_PROFILE_ID));
	if (!profileExists && referencedOrders.length === 0) return {};
	const authPatch = {};
	if (profileExists) Reflect.set(authPatch, "profiles", { [LLAMA_CPP_DEFAULT_PROFILE_ID]: void 0 });
	if (referencedOrders.length > 0) Reflect.set(authPatch, "order", Object.fromEntries(referencedOrders.map(([providerId, ids]) => {
		const next = ids.filter((id) => id !== LLAMA_CPP_DEFAULT_PROFILE_ID);
		return [providerId, next.length > 0 ? next : void 0];
	})));
	return { auth: authPatch };
}
//#endregion
//#region extensions/llama-cpp/src/external-server/setup.ts
function selectSetupModelId(discovery) {
	const candidates = discovery.models.filter((model) => !model.failed);
	const ready = candidates.filter((model) => model.status === "loaded" || model.status === "sleeping");
	const ids = (ready.length > 0 ? ready : candidates).map((model) => model.config.id);
	return selectPreferredLocalModelId(ids) ?? ids[0];
}
function describeDiscoveryFailure(result) {
	switch (result.kind) {
		case "unreachable": return `llama-server could not be reached at ${result.endpoint.origin}.`;
		case "http-error": return `llama-server returned HTTP ${result.status} for ${result.path} at ${result.endpoint.origin}.`;
		case "invalid-response": return `llama-server returned an invalid response from ${result.path} at ${result.endpoint.origin}.`;
		default: throw new Error("Unexpected llama-server discovery result");
	}
}
function stripAuthOverrides(provider, removeAuthorization) {
	if (!provider) return provider;
	const headers = removeAuthorization ? stripAuthorizationHeader(provider.headers) : provider.headers;
	return {
		...provider,
		auth: void 0,
		apiKey: void 0,
		...removeAuthorization ? { headers } : {}
	};
}
function stripEndpointCredentials(provider) {
	if (!provider) return;
	const { localService: _localService, ...external } = provider;
	if (!provider.localService) return {
		...external,
		auth: void 0,
		apiKey: void 0,
		headers: void 0
	};
	const { auth: _auth, apiKey: _apiKey, headers: _headers, localService: _managedService, models: _managedModels, params: managedParams, timeoutSeconds: _managedTimeout, ...externalProvider } = provider;
	const { modelCacheDir: _modelCacheDir, ...params } = managedParams ?? {};
	return {
		...externalProvider,
		models: [],
		params: Object.keys(params).length > 0 ? params : void 0
	};
}
function hasEndpointChanged(provider, baseUrl) {
	if (!provider) return false;
	return resolveLlamaServerEndpoint(provider.baseUrl ?? "http://127.0.0.1:8080").inferenceBaseUrl !== resolveLlamaServerEndpoint(baseUrl).inferenceBaseUrl;
}
function stripLlamaServerEndpointAuth(config) {
	const withoutProfile = removeAuthProfileConfig(config, LLAMA_CPP_DEFAULT_PROFILE_ID);
	const provider = withoutProfile.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const endpointSafeProvider = stripEndpointCredentials(provider);
	if (!endpointSafeProvider) return withoutProfile;
	return {
		...withoutProfile,
		models: {
			...withoutProfile.models,
			providers: {
				...withoutProfile.models?.providers,
				[LLAMA_CPP_PROVIDER_ID]: endpointSafeProvider
			}
		}
	};
}
function stripAuthorizationHeader(headers) {
	const filtered = Object.fromEntries(Object.entries(headers ?? {}).filter(([name]) => name.toLowerCase() !== "authorization"));
	return Object.keys(filtered).length > 0 ? filtered : void 0;
}
function buildExistingProviderConfig(params) {
	const configured = params.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const endpointSafe = params.resetEndpoint ? stripEndpointCredentials(configured) : configured;
	const existing = params.persistence.kind === "preserve" ? endpointSafe : stripAuthOverrides(endpointSafe, params.persistence.kind === "upsert");
	return buildLlamaServerProviderConfig({
		configured: {
			...existing,
			baseUrl: params.discovery.endpoint.inferenceBaseUrl,
			models: existing?.models ?? []
		},
		discoveredModels: params.discovery.models
	});
}
function buildSetupResult$1(params) {
	return {
		profiles: params.persistence.kind === "upsert" ? [{
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			credential: buildApiKeyCredential(LLAMA_CPP_PROVIDER_ID, params.persistence.credential, void 0, { config: params.config })
		}] : [],
		defaultModel: `${LLAMA_CPP_PROVIDER_ID}/${params.modelId}`,
		configPatch: {
			...params.persistence.kind === "remove" ? buildLlamaCppAuthProfileRemovalPatch(params.config) : {},
			models: {
				mode: params.config.models?.mode ?? "merge",
				providers: { [LLAMA_CPP_PROVIDER_ID]: buildExistingProviderConfig(params) }
			}
		}
	};
}
async function removeDefaultAuthProfile(agentDir) {
	if (!await removeProviderAuthProfilesWithLock({
		agentDir,
		provider: "llama-cpp",
		profileIds: [LLAMA_CPP_DEFAULT_PROFILE_ID]
	})) throw new Error("Failed to remove the previous llama-server auth profile; wait a moment and retry.");
}
async function discoverForSetup(ctx) {
	const provider = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (provider?.localService) return null;
	try {
		const headers = await resolveLlamaServerProviderHeaders({
			config: ctx.config,
			env: ctx.env,
			headers: provider?.headers
		});
		const apiKey = !hasLlamaServerAuthorizationHeader(headers) ? await resolveLlamaServerRuntimeApiKey({ config: ctx.config }) : void 0;
		const discovery = await discoverLlamaServer({
			baseUrl: provider?.baseUrl ?? "http://127.0.0.1:8080",
			apiKey,
			headers,
			signal: ctx.signal,
			cacheTtlMs: 0
		});
		return discovery.kind === "success" ? discovery : null;
	} catch {
		return null;
	}
}
async function discoverWithAccess(params) {
	return await discoverLlamaServer({
		baseUrl: params.baseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		signal: params.signal,
		cacheTtlMs: 0
	});
}
/** Read-only discovery for the guided local-provider setup ladder. */
async function detectLlamaServerSetup(ctx) {
	const discovery = await discoverForSetup(ctx);
	if (!discovery) return null;
	const modelId = selectSetupModelId(discovery);
	if (!modelId) return null;
	return {
		modelRef: `${LLAMA_CPP_PROVIDER_ID}/${modelId}`,
		detail: `${modelId} at ${discovery.endpoint.origin}`
	};
}
/** Rechecks one guided candidate and returns the config needed for a live probe. */
async function prepareLlamaServerSetup(ctx) {
	const discovery = await discoverForSetup(ctx);
	if (!discovery) return null;
	const prefix = `${LLAMA_CPP_PROVIDER_ID}/`;
	const modelId = ctx.modelRef.startsWith(prefix) ? ctx.modelRef.slice(prefix.length) : "";
	if (!modelId || !discovery.models.some((model) => model.config.id === modelId)) return null;
	return buildSetupResult$1({
		config: ctx.config,
		discovery,
		modelId,
		resetEndpoint: false,
		persistence: { kind: "preserve" }
	});
}
/** Interactive setup for an existing llama-server endpoint. */
async function runLlamaServerSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const defaultOrigin = resolveLlamaServerEndpoint(existing?.baseUrl).origin;
	const endpoint = resolveLlamaServerEndpoint(await ctx.prompter.text({
		message: `${LLAMA_CPP_PROVIDER_LABEL} URL`,
		initialValue: defaultOrigin,
		placeholder: LLAMA_SERVER_DEFAULT_ORIGIN,
		validate: (value) => value?.trim() ? void 0 : "Required"
	}));
	const endpointChanged = Boolean(existing?.localService) || hasEndpointChanged(existing, endpoint.inferenceBaseUrl);
	const resolvedHeaders = endpointChanged ? void 0 : await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: ctx.env,
		headers: existing?.headers
	});
	const usesApiKey = await ctx.prompter.confirm({
		message: "Does this llama-server require an API key?",
		initialValue: false
	});
	let apiKey;
	let headers = resolvedHeaders;
	let persistence;
	if (!usesApiKey) persistence = { kind: "remove" };
	else {
		const hasConfiguredProfile = Boolean(ctx.config.auth?.profiles?.[LLAMA_CPP_DEFAULT_PROFILE_ID]);
		const profileApiKey = !endpointChanged && !hasLlamaServerAuthorizationHeader(resolvedHeaders) && hasConfiguredProfile ? await resolveLlamaServerRuntimeApiKey({
			config: ctx.config,
			agentDir: ctx.agentDir,
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID
		}) : void 0;
		if (profileApiKey) {
			apiKey = profileApiKey;
			persistence = { kind: "preserve" };
		} else {
			let credentialInput;
			apiKey = await ensureApiKeyFromEnvOrPrompt({
				config: endpointChanged ? stripLlamaServerEndpointAuth(ctx.config) : ctx.config,
				env: endpointChanged ? {} : ctx.env,
				provider: LLAMA_CPP_PROVIDER_ID,
				envLabel: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
				promptMessage: "Enter the llama-server API key",
				normalize: (value) => value.trim(),
				validate: (value) => value.trim() ? void 0 : "Required",
				prompter: ctx.prompter,
				secretInputMode: ctx.secretInputMode,
				setCredential: async (input) => {
					credentialInput = input;
				}
			});
			if (credentialInput === void 0) throw new Error("llama-server API-key setup did not produce a credential");
			headers = stripAuthorizationHeader(resolvedHeaders);
			persistence = {
				kind: "upsert",
				credential: credentialInput
			};
		}
	}
	const discovery = await discoverWithAccess({
		baseUrl: endpoint.inferenceBaseUrl,
		apiKey,
		headers,
		signal: ctx.signal
	});
	if (discovery.kind !== "success") throw new Error(describeDiscoveryFailure(discovery));
	const modelId = selectSetupModelId(discovery);
	if (!modelId) throw new Error(`No llama-server text models were found at ${discovery.endpoint.origin}.`);
	if (persistence.kind === "remove") await removeDefaultAuthProfile(ctx.agentDir);
	return buildSetupResult$1({
		config: ctx.config,
		discovery,
		modelId,
		resetEndpoint: endpointChanged,
		persistence
	});
}
async function validateNonInteractiveDiscovery(ctx) {
	const configuredProvider = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const baseUrl = normalizeOptionalSecretInput(ctx.opts.customBaseUrl) ?? configuredProvider?.baseUrl ?? "http://127.0.0.1:8080";
	const endpointChanged = Boolean(configuredProvider?.localService) || hasEndpointChanged(configuredProvider, baseUrl);
	const providerApiKey = normalizeOptionalSecretInput(ctx.opts.llamaServerApiKey);
	const customApiKey = normalizeOptionalSecretInput(ctx.opts.customApiKey);
	const authoredApiKey = providerApiKey ?? customApiKey;
	const hasAuthoredApiKey = authoredApiKey !== void 0;
	const resolvedApiKey = await ctx.resolveApiKey({
		provider: LLAMA_CPP_PROVIDER_ID,
		flagValue: authoredApiKey,
		flagName: providerApiKey === void 0 ? "--custom-api-key" : "--llama-server-api-key",
		envVar: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
		envVarName: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
		required: false
	});
	const resolvedHeaders = endpointChanged ? void 0 : await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: process.env,
		headers: configuredProvider?.headers
	});
	let apiKey;
	let headers = resolvedHeaders;
	let persistence;
	if (hasAuthoredApiKey && resolvedApiKey) {
		apiKey = resolvedApiKey.key;
		headers = stripAuthorizationHeader(resolvedHeaders);
		persistence = {
			kind: "upsert",
			credential: resolvedApiKey
		};
	} else if (endpointChanged || hasLlamaServerAuthorizationHeader(resolvedHeaders)) persistence = { kind: "remove" };
	else if (resolvedApiKey?.source === "profile") {
		apiKey = resolvedApiKey.key;
		persistence = { kind: "preserve" };
	} else if (resolvedApiKey) {
		apiKey = resolvedApiKey.key;
		persistence = {
			kind: "upsert",
			credential: resolvedApiKey
		};
	} else persistence = { kind: "remove" };
	const discovery = await discoverWithAccess({
		baseUrl,
		apiKey,
		headers
	});
	if (discovery.kind !== "success") {
		ctx.runtime.error(describeDiscoveryFailure(discovery));
		ctx.runtime.exit(1);
		return null;
	}
	const requestedModelId = normalizeOptionalSecretInput(ctx.opts.customModelId);
	const modelId = requestedModelId ?? selectSetupModelId(discovery);
	if (!modelId || !discovery.models.some((model) => model.config.id === modelId)) {
		const available = discovery.models.map((model) => model.config.id).join(", ");
		ctx.runtime.error(requestedModelId ? `llama-server model ${requestedModelId} was not found. Available models: ${available}` : `No llama-server text models were found at ${discovery.endpoint.origin}.`);
		ctx.runtime.exit(1);
		return null;
	}
	return {
		discovery,
		modelId,
		resetEndpoint: endpointChanged,
		persistence
	};
}
async function validateLlamaServerNonInteractive(ctx) {
	return Boolean(await validateNonInteractiveDiscovery(ctx));
}
/** Non-interactive setup with optional API-key persistence. */
async function configureLlamaServerNonInteractive(ctx) {
	const validated = await validateNonInteractiveDiscovery(ctx);
	if (!validated) return null;
	const providerConfig = buildExistingProviderConfig({
		config: ctx.config,
		discovery: validated.discovery,
		resetEndpoint: validated.resetEndpoint,
		persistence: validated.persistence
	});
	let config = {
		...ctx.config,
		models: {
			...ctx.config.models,
			mode: ctx.config.models?.mode ?? "merge",
			providers: {
				...ctx.config.models?.providers,
				[LLAMA_CPP_PROVIDER_ID]: providerConfig
			}
		}
	};
	if (validated.persistence.kind === "upsert") {
		const credential = ctx.toApiKeyCredential({
			provider: LLAMA_CPP_PROVIDER_ID,
			resolved: validated.persistence.credential
		});
		if (!credential) return null;
		await upsertAuthProfileWithLockCompat({
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			credential,
			agentDir: ctx.agentDir
		});
		config = applyAuthProfileConfig(config, {
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			provider: LLAMA_CPP_PROVIDER_ID,
			mode: "api_key"
		});
	} else if (validated.persistence.kind === "remove") {
		await removeDefaultAuthProfile(ctx.agentDir);
		config = removeAuthProfileConfig(config, LLAMA_CPP_DEFAULT_PROFILE_ID);
	}
	ctx.runtime.log(`Default ${LLAMA_CPP_PROVIDER_LABEL} model: ${validated.modelId}`);
	return applyProviderDefaultModel(config, `${LLAMA_CPP_PROVIDER_ID}/${validated.modelId}`);
}
//#endregion
//#region extensions/llama-cpp/src/external-server/stream.ts
/** Maps shared structured-output requests to the shape accepted by older llama-server builds. */
function normalizeLlamaServerResponseFormat(payload, requestedResponseFormat) {
	const responseFormat = isRecord(payload.response_format) ? payload.response_format : requestedResponseFormat;
	if (!responseFormat || responseFormat.type === "text") return;
	const schema = responseFormat.type === "json_schema" ? isRecord(responseFormat.json_schema) ? responseFormat.json_schema.schema : responseFormat.schema : responseFormat.type === "json_object" ? responseFormat.schema : responseFormat;
	if (isRecord(schema)) payload.response_format = {
		type: "json_object",
		schema
	};
}
/** Keeps the shared OpenAI transport and adjusts llama-server request compatibility. */
function wrapLlamaServerStream(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.provider !== "llama-cpp") return underlying(model, context, options);
		const onPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload: async (payload, requestModel) => {
				const customized = await onPayload?.(payload, requestModel) ?? payload;
				if (isRecord(customized)) {
					if (ctx.thinkingLevel === "off") setQwenChatTemplateThinking(customized, false);
					normalizeLlamaServerResponseFormat(customized, options?.responseFormat);
				}
				return customized;
			}
		});
	};
}
//#endregion
//#region extensions/llama-cpp/src/setup.ts
const BYTES_PER_GB = 1e9;
const BYTES_PER_MB = 1e6;
function formatDownloadProgress(label, params) {
	const downloadedSize = Math.max(0, params.downloadedSize);
	const totalSize = Math.max(1, params.totalSize);
	return `Downloading ${label}… ${Math.min(100, Math.floor(downloadedSize / totalSize * 100))}% (${(downloadedSize / BYTES_PER_GB).toFixed(1)}/${(totalSize / BYTES_PER_GB).toFixed(1)} GB, ${Math.max(0, Math.round(params.bytesPerSecond / BYTES_PER_MB))} MB/s)`;
}
function formatRamGb(totalmemBytes) {
	return (totalmemBytes / 1024 ** 3).toFixed(1).replace(/\.0$/u, "");
}
function readPrimaryModel(config) {
	const model = config.agents?.defaults?.model;
	return typeof model === "string" ? model : model?.primary;
}
function configuredCandidates(config, scope) {
	const existing = config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const managedExisting = existing?.localService ? existing : void 0;
	const provider = buildLlamaCppProviderConfig({
		existing: managedExisting,
		...managedExisting && scope === "detection" ? { modelInventory: managedExisting.models } : {}
	});
	const primary = readPrimaryModel(config);
	const primaryId = primary?.startsWith(`llama-cpp/`) ? primary.slice(LLAMA_CPP_PROVIDER_ID.length + 1) : void 0;
	return provider.models.map((model) => ({
		model,
		provider
	})).toSorted((a, b) => Number(b.model.id === primaryId) - Number(a.model.id === primaryId));
}
async function isFile(filePath) {
	return await fs$1.stat(filePath).then((stat) => stat.isFile()).catch(() => false);
}
async function resolveCachedCandidate(candidate) {
	const source = resolveLlamaCppModelSource(candidate.model);
	const resolved = resolveCachedLlamaCppModelPath(candidate);
	if (resolved && await isFile(resolved)) return resolved;
	if (candidate.model.id === "gemma-4-e4b-it-q4_k_m") {
		const legacy = path.join(resolveLegacyLlamaCppModelCacheDir(), DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE);
		if (await isFile(legacy)) return legacy;
	}
	if (/^(?:hf|huggingface|https):/iu.test(source)) return await ensureLlamaCppModel({
		source,
		cacheDir: resolveLlamaCppModelCacheDir(candidate.provider),
		download: false
	}).catch(() => void 0);
}
function readConfiguredPort(provider) {
	try {
		const url = new URL(provider?.baseUrl ?? "");
		if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost" && url.hostname !== "[::1]") return;
		const port = Number(url.port);
		return Number.isInteger(port) && port > 0 ? port : void 0;
	} catch {
		return;
	}
}
function buildSetupResult(params) {
	const existing = params.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const switchingFromExternal = Boolean(existing && !existing.localService);
	return {
		profiles: [],
		...params.defaultModel ? { defaultModel: params.defaultModel } : {},
		configPatch: {
			...buildLlamaCppAuthProfileRemovalPatch(params.config),
			models: {
				mode: params.config.models?.mode ?? "merge",
				providers: { [LLAMA_CPP_PROVIDER_ID]: buildLlamaCppProviderConfig({
					existing: switchingFromExternal ? void 0 : existing,
					managed: params.managed,
					...params.plan === "embedding-only" ? { modelInventory: [] } : {}
				}) }
			}
		}
	};
}
async function detectLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const command = existing?.localService?.command;
	const presetPath = existing?.localService?.args?.find((_, index, args) => args[index - 1] === "--models-preset");
	if (!command || !path.isAbsolute(command) || !await isFile(command) || !presetPath || !await isFile(presetPath)) return null;
	for (const candidate of configuredCandidates(ctx.config, "detection")) if (await resolveCachedCandidate(candidate)) return {
		modelRef: `${LLAMA_CPP_PROVIDER_ID}/${candidate.model.id}`,
		detail: "Managed llama.cpp server ready"
	};
	return null;
}
async function prepareLlamaCppSetup(ctx) {
	const detected = await detectLlamaCppSetup(ctx);
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (detected?.modelRef !== ctx.modelRef || !existing?.localService?.command) return null;
	const baseUrl = existing.baseUrl?.replace(/\/+$/u, "") ?? "";
	const rootUrl = baseUrl.replace(/\/v1$/u, "");
	return buildSetupResult({
		config: ctx.config,
		plan: "chat",
		defaultModel: ctx.modelRef,
		managed: {
			command: existing.localService.command,
			baseUrl,
			healthUrl: existing.localService.healthUrl ?? `${rootUrl}/health`,
			args: existing.localService.args ?? []
		}
	});
}
function hasLocalMemoryIntent(config) {
	return config.memory?.search?.provider === "local" || Object.values(config.agents?.entries ?? {}).some((agent) => agent.memory?.search?.provider === "local") || config.agents?.list?.some((agent) => agent.memory?.search?.provider === "local") === true;
}
async function resolveSetupPlan(ctx, candidates) {
	let candidate = candidates[0];
	const cachedPath = candidate ? await resolveCachedCandidate(candidate) : void 0;
	if (candidate && cachedPath) return {
		kind: "chat",
		candidate,
		cachedPath
	};
	candidate = candidates.find((entry) => entry.model.id === DEFAULT_LLAMA_CPP_MODEL_ID);
	const totalmemBytes = os.totalmem();
	const localMemoryIntent = hasLocalMemoryIntent(ctx.config);
	if (candidate && meetsLlamaCppDefaultModelRamFloor(totalmemBytes)) {
		if (await ctx.prompter.confirm({
			message: "OpenClaw will install a verified llama.cpp server and download Gemma 4 E4B IT Q4_K_M (about 5.0 GB) plus the local embedding model (about 0.3 GB). Continue?",
			initialValue: false
		})) return {
			kind: "chat",
			candidate
		};
	} else if (!localMemoryIntent) {
		await ctx.prompter.note(`This Gateway has ${formatRamGb(totalmemBytes)} GB RAM; the recommended model needs 16 GB+. Configure an existing smaller GGUF, use Ollama or LM Studio, or choose a cloud provider.`, "Setup skipped");
		return;
	}
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (localMemoryIntent && existing && (!existing.localService || existing.models.length > 0)) {
		await ctx.prompter.note("Embedding-only setup cannot replace an existing llama.cpp server or configured llama.cpp chat routes. Move those routes to another provider, remove any existing server config, then retry llama.cpp setup.", "Setup skipped");
		return;
	}
	if (localMemoryIntent) {
		if (await ctx.prompter.confirm({
			message: "OpenClaw can install a verified llama.cpp server and download only the local embedding model (about 0.3 GB). This will not install or change your chat model. Continue?",
			initialValue: false
		})) return { kind: "embedding-only" };
	}
	await ctx.prompter.note("Local model setup skipped.", "Setup skipped");
}
async function runLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const managedExisting = existing?.localService ? existing : void 0;
	const plan = await resolveSetupPlan(ctx, configuredCandidates(ctx.config, "setup"));
	if (!plan) return { profiles: [] };
	const progress = ctx.prompter.progress("Preparing managed llama.cpp server…");
	try {
		const cacheDir = resolveLlamaCppModelCacheDir(managedExisting);
		let chatModel;
		if (plan.kind === "chat") {
			const chatModelPath = plan.cachedPath ?? await ensureLlamaCppModel({
				source: resolveLlamaCppModelSource(plan.candidate.model),
				cacheDir,
				download: true,
				signal: ctx.signal,
				onProgress: (status) => progress.update(formatDownloadProgress("Gemma 4 E4B", status))
			});
			const configuredContext = plan.candidate.model.params?.contextSize;
			chatModel = {
				mode: "configure",
				id: plan.candidate.model.id,
				path: chatModelPath,
				contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : plan.candidate.model.contextTokens,
				maxTokens: plan.candidate.model.maxTokens
			};
		} else chatModel = { mode: "remove" };
		const embeddingModelPath = await ensureLlamaCppModel({
			source: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
			cacheDir,
			download: true,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress("EmbeddingGemma", status))
		});
		const managed = await prepareManagedLlamaServer({
			chatModel,
			embeddingModelIsDefault: true,
			embeddingModelPath,
			port: readConfiguredPort(managedExisting)
		});
		if (!await removeProviderAuthProfilesWithLock({
			provider: "llama-cpp",
			profileIds: [LLAMA_CPP_DEFAULT_PROFILE_ID],
			agentDir: ctx.agentDir
		})) throw new Error("Failed to remove the previous llama.cpp endpoint auth profile");
		progress.stop("Managed llama.cpp server prepared");
		return buildSetupResult({
			config: ctx.config,
			managed,
			plan: plan.kind,
			...plan.kind === "chat" ? { defaultModel: `${LLAMA_CPP_PROVIDER_ID}/${plan.candidate.model.id}` } : {}
		});
	} catch (error) {
		progress.stop("llama.cpp setup failed");
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Managed llama.cpp setup failed. Run openclaw doctor, fix the reported runtime or model issue, then retry. ${detail}`, { cause: error });
	}
}
//#endregion
//#region extensions/llama-cpp/src/managed-provider.ts
function registerLlamaCppProvider(api) {
	api.registerProvider({
		id: LLAMA_CPP_PROVIDER_ID,
		label: LLAMA_CPP_PROVIDER_LABEL,
		docsPath: "/plugins/llama-cpp",
		envVars: [LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR],
		auth: [{
			id: "local",
			label: LLAMA_CPP_PROVIDER_LABEL,
			hint: "Install a verified llama.cpp server and run a private GGUF model managed by OpenClaw",
			kind: "custom",
			wizard: {
				choiceId: LLAMA_CPP_PROVIDER_ID,
				choiceLabel: "Managed local server",
				choiceHint: "Install a verified llama.cpp server and run a private GGUF model managed by OpenClaw",
				groupId: LLAMA_CPP_PROVIDER_ID,
				groupLabel: "Local llama.cpp",
				groupHint: "Managed or external llama.cpp server",
				methodId: "local"
			},
			appGuidedSetup: {
				detect: detectLlamaCppSetup,
				prepare: prepareLlamaCppSetup
			},
			run: runLlamaCppSetup
		}, {
			id: "existing-server",
			label: "Existing llama-server",
			hint: "Connect to an existing local, private, or remote llama.cpp server",
			kind: "custom",
			wizard: {
				choiceId: "llama-cpp-existing-server",
				choiceLabel: "Existing llama-server",
				choiceHint: "Connect to a llama.cpp server managed outside OpenClaw",
				groupId: LLAMA_CPP_PROVIDER_ID,
				groupLabel: "Local llama.cpp",
				groupHint: "Managed or external llama.cpp server",
				methodId: "existing-server"
			},
			appGuidedSetup: {
				detect: detectLlamaServerSetup,
				prepare: prepareLlamaServerSetup
			},
			run: runLlamaServerSetup,
			validateNonInteractive: validateLlamaServerNonInteractive,
			runNonInteractive: async (ctx) => await configureLlamaServerNonInteractive(ctx)
		}],
		catalog: {
			order: "late",
			run: async (ctx) => {
				const configured = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
				return configured?.localService ? { provider: buildLlamaCppProviderConfig({
					existing: configured,
					modelInventory: configured.models
				}) } : await discoverLlamaServerProvider(ctx);
			}
		},
		staticCatalog: {
			order: "late",
			run: async () => ({ provider: buildLlamaCppProviderConfig() })
		},
		resolveSyntheticAuth: ({ providerConfig }) => providerConfig?.localService || shouldUseLlamaServerSyntheticAuth(providerConfig) ? {
			apiKey: resolveLlamaCppSyntheticApiKey(),
			source: providerConfig?.localService ? "managed local llama.cpp server" : hasLlamaServerAuthorizationHeader(providerConfig?.headers) ? "models.providers.llama-cpp.headers.Authorization" : "models.providers.llama-cpp (synthetic local key)",
			mode: "api-key"
		} : void 0,
		shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === resolveLlamaCppSyntheticApiKey() || resolvedApiKey?.trim() === "custom-local",
		normalizeConfig: ({ providerConfig }) => providerConfig.localService ? providerConfig : normalizeLlamaServerProviderConfig(providerConfig),
		prepareDynamicModel: async (ctx) => ctx.config?.models?.providers?.["llama-cpp"]?.localService ? void 0 : await prepareLlamaServerDynamicModel(ctx),
		wrapStreamFn: (ctx) => {
			const providerConfig = ctx.config?.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
			if (!providerConfig?.localService) return wrapLlamaServerStream(ctx);
			const inner = ctx.streamFn;
			const selectedModel = ctx.model;
			if (!inner || !selectedModel) return;
			return async (model, context, options) => {
				await ensureManagedLlamaServerForChat({
					provider: providerConfig,
					model: selectedModel
				});
				return inner(model, context, options);
			};
		},
		...buildProviderToolCompatFamilyHooks("llamacpp-gbnf"),
		wizard: { modelPicker: {
			label: "llama.cpp",
			hint: `Use a managed server or connect to ${LLAMA_SERVER_DEFAULT_ORIGIN}`,
			methodId: "local"
		} }
	});
}
//#endregion
//#region extensions/llama-cpp/index.ts
var llama_cpp_default = definePluginEntry({
	id: "llama-cpp",
	name: "llama.cpp Provider",
	description: "Managed and external llama.cpp servers for GGUF chat and embeddings",
	register(api) {
		api.registerEmbeddingProvider(llamaCppEmbeddingProviderAdapter);
		registerLlamaCppProvider(api);
	}
});
//#endregion
export { llama_cpp_default as default };
