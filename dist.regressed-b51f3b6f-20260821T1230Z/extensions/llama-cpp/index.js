import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "../../ssrf-UFPP-fbI.js";
import { n as fetchConfiguredLocalOriginWithSsrFGuard, r as fetchWithSsrFGuard } from "../../fetch-guard-Dj5fUySl.js";
import { t as getEmbeddingProvider } from "../../embedding-provider-runtime-Bzkgig4S.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import "../../ssrf-runtime-Co-K4Dxq.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-mj-Qt8cY.js";
import "../../ssrf-runtime-internal-DUNdDdYn.js";
import "../../embedding-providers-D0-Gz4R1.js";
import { A as resolveLlamaCppModelSource, C as buildLlamaCppProviderConfig, D as resolveLegacyLlamaCppModelCacheDir, E as resolveHomePath, O as resolveLlamaCppDataDir, S as LLAMA_CPP_PROVIDER_LABEL, T as resolveCachedLlamaCppModelPath, _ as DEFAULT_LLAMA_CPP_MODEL_SHA256, a as selectLlamaServerAsset, b as LLAMA_CPP_DEFAULT_PORT, c as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, d as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256, f as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES, g as DEFAULT_LLAMA_CPP_MODEL_REVISION, h as DEFAULT_LLAMA_CPP_MODEL_REF, i as resolveManagedLlamaServerPaths, j as resolveLlamaCppSyntheticApiKey, k as resolveLlamaCppModelCacheDir, l as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID, m as DEFAULT_LLAMA_CPP_MODEL_ID, n as LLAMA_SERVER_COMMIT, p as DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE, r as LLAMA_SERVER_RELEASE, s as DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE, u as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION, v as DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES, w as meetsLlamaCppDefaultModelRamFloor, x as LLAMA_CPP_PROVIDER_ID } from "../../llama-server-assets-BCR-CXq6.js";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { execFile } from "node:child_process";
import net from "node:net";
import * as tar from "tar";
import JSZip from "jszip";
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
			const reader = response.body.getReader();
			let downloadedSize = 0;
			let previousSize = 0;
			let previousAt = Date.now();
			let rollingBytesPerSecond = 0;
			try {
				for (;;) {
					const { done, value } = await reader.read();
					if (done) break;
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
	if (!version.includes(`version: 10357`) || !version.includes("689e227db485c6b33d061555e74034c93a867649".slice(0, 9))) throw new Error(`Unexpected llama-server build at ${command}: expected ${LLAMA_SERVER_RELEASE} (${LLAMA_SERVER_COMMIT.slice(0, 9)}), got ${version || "no version output"}`);
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
		source,
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
		source,
		fileName: DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE,
		url: `https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/${DEFAULT_LLAMA_CPP_MODEL_REVISION}/gemma-4-E4B-it-Q4_K_M.gguf?download=true`,
		expectedSize: DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES,
		expectedSha256: DEFAULT_LLAMA_CPP_MODEL_SHA256
	};
	if (source === "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf") return {
		source,
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
			source,
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
function renderLlamaServerPreset(params) {
	const chatId = assertIniValue(params.chatModelId, "llama.cpp model id");
	const embeddingId = assertIniValue(params.embeddingModelId, "llama.cpp embedding model id");
	if (chatId.includes("]") || embeddingId.includes("]")) throw new Error("llama.cpp model ids cannot contain ]");
	return [
		"version = 1",
		"",
		`[${chatId}]`,
		`model = ${assertIniValue(params.chatModelPath, "llama.cpp model path")}`,
		`ctx-size = ${params.contextSize ?? 65536}`,
		`n-predict = ${params.maxTokens ?? 2048}`,
		"jinja = true",
		"",
		`[${embeddingId}]`,
		`model = ${assertIniValue(params.embeddingModelPath, "llama.cpp embedding model path")}`,
		"embedding = true",
		""
	].join("\n");
}
async function writePreset(presetPath, contents) {
	await fs$1.mkdir(path.dirname(presetPath), { recursive: true });
	const temporary = `${presetPath}.tmp-${randomUUID()}`;
	await fs$1.writeFile(temporary, contents, { mode: 384 });
	await fs$1.rename(temporary, presetPath);
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
	await writePreset(presetPath, renderLlamaServerPreset({
		chatModelId: params.chatModelId ?? "gemma-4-e4b-it-q4_k_m",
		chatModelPath: params.chatModelPath,
		contextSize: params.contextSize,
		maxTokens: params.maxTokens,
		embeddingModelId: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
		embeddingModelPath: params.embeddingModelPath
	}));
	const port = params.port ?? await findAvailableLlamaServerPort();
	const rootUrl = `http://127.0.0.1:${port}`;
	return {
		command,
		presetPath,
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
		],
		backend: asset.backend
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
			chatModelId: params.model.id,
			chatModelPath,
			contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : params.model.contextTokens,
			maxTokens: params.model.maxTokens,
			embeddingModelPath: path.join(cacheDir, "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf"),
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
function resolveConfiguredProvider(options) {
	const provider = options.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (!provider?.localService || !provider.baseUrl) throw new Error("Local embeddings need the managed llama.cpp server config. Run `openclaw configure`, choose llama.cpp once, then retry `openclaw memory status --deep`.");
	return provider;
}
function resolveProviderPort(provider) {
	const port = Number(new URL(provider.baseUrl ?? "").port);
	if (!Number.isInteger(port) || port <= 0) throw new Error("Managed llama.cpp provider baseUrl must include a loopback port.");
	return port;
}
async function prepareEmbeddingServer(options, embeddingSource) {
	const provider = resolveConfiguredProvider(options);
	const configuredPrimary = options.config.agents?.defaults?.model;
	const primaryRef = typeof configuredPrimary === "string" ? configuredPrimary : configuredPrimary?.primary;
	const primaryId = primaryRef?.startsWith(`llama-cpp/`) ? primaryRef.slice(LLAMA_CPP_PROVIDER_ID.length + 1) : void 0;
	const chatModel = provider.models.find((model) => model.id === primaryId) ?? provider.models.find((model) => model.id !== "gemma-4-e4b-it-q4_k_m") ?? provider.models[0];
	if (!chatModel) throw new Error("Managed llama.cpp provider has no chat model preset.");
	const cacheDir = resolveLlamaCppModelCacheDir(provider);
	const key = JSON.stringify([
		provider.baseUrl,
		chatModel.id,
		embeddingSource,
		cacheDir
	]);
	const pending = preparedEmbeddingServers.get(key) ?? (async () => {
		const [chatModelPath, embeddingModelPath] = await Promise.all([ensureLlamaCppModel({
			source: resolveLlamaCppModelSource(chatModel),
			cacheDir,
			download: false
		}), ensureLlamaCppModel({
			source: embeddingSource,
			cacheDir,
			download: true
		})]);
		const configuredContext = chatModel.params?.contextSize;
		await prepareManagedLlamaServer({
			chatModelId: chatModel.id,
			chatModelPath,
			contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : chatModel.contextTokens,
			maxTokens: chatModel.maxTokens,
			embeddingModelPath,
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
		const local = readLocalOptions(options);
		return resolveModelIdentity(local, normalizeOptionalString(local.modelPath) ?? "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf", options.dimensions);
	},
	create: async (options) => {
		const local = readLocalOptions(options);
		const modelPath = normalizeOptionalString(local.modelPath) ?? "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
		await prepareEmbeddingServer(options, modelPath);
		const genericAdapter = getEmbeddingProvider("openai-compatible", options.config);
		if (!genericAdapter) throw new Error("OpenAI-compatible embedding transport is unavailable.");
		const result = await genericAdapter.create({
			...options,
			provider: LLAMA_CPP_PROVIDER_ID,
			model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
			remote: void 0
		});
		if (!result.provider) return result;
		const identity = resolveModelIdentity(local, modelPath, options.dimensions);
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
function configuredCandidates(config) {
	const existing = config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const provider = buildLlamaCppProviderConfig(existing);
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
	return {
		profiles: [],
		defaultModel: params.defaultModel ?? DEFAULT_LLAMA_CPP_MODEL_REF,
		configPatch: { models: {
			mode: params.config.models?.mode ?? "merge",
			providers: { [LLAMA_CPP_PROVIDER_ID]: buildLlamaCppProviderConfig(params.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID], params.managed) }
		} }
	};
}
async function detectLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const command = existing?.localService?.command;
	const presetPath = existing?.localService?.args?.find((_, index, args) => args[index - 1] === "--models-preset");
	if (!command || !path.isAbsolute(command) || !await isFile(command) || !presetPath || !await isFile(presetPath)) return null;
	for (const candidate of configuredCandidates(ctx.config)) if (await resolveCachedCandidate(candidate)) return {
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
		defaultModel: ctx.modelRef,
		managed: {
			command: existing.localService.command,
			presetPath: existing.localService.args?.find((_, index, args) => args[index - 1] === "--models-preset") ?? resolveManagedLlamaServerPaths(selectLlamaServerAsset()).presetPath,
			baseUrl,
			healthUrl: existing.localService.healthUrl ?? `${rootUrl}/health`,
			args: existing.localService.args ?? [],
			backend: selectLlamaServerAsset().backend
		}
	});
}
async function runLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const candidates = configuredCandidates(ctx.config);
	let selected = candidates[0];
	let chatModelPath = selected ? await resolveCachedCandidate(selected) : void 0;
	if (!chatModelPath) {
		selected = candidates.find((candidate) => candidate.model.id === DEFAULT_LLAMA_CPP_MODEL_ID);
		const totalmemBytes = os.totalmem();
		if (!selected || !meetsLlamaCppDefaultModelRamFloor(totalmemBytes)) {
			await ctx.prompter.note(`This Gateway has ${formatRamGb(totalmemBytes)} GB RAM; the recommended model needs 16 GB+. Configure an existing smaller GGUF, use Ollama or LM Studio, or choose a cloud provider.`, "Setup skipped");
			return { profiles: [] };
		}
		if (!await ctx.prompter.confirm({
			message: "OpenClaw will install a verified llama.cpp server and download Gemma 4 E4B IT Q4_K_M (about 5.0 GB) plus the local embedding model (about 0.3 GB). Continue?",
			initialValue: false
		})) {
			await ctx.prompter.note("Local model setup skipped.", "Setup skipped");
			return { profiles: [] };
		}
	}
	if (!selected) throw new Error("llama.cpp setup could not resolve a chat model");
	const progress = ctx.prompter.progress("Preparing managed llama.cpp server…");
	try {
		const cacheDir = resolveLlamaCppModelCacheDir(existing);
		chatModelPath ??= await ensureLlamaCppModel({
			source: resolveLlamaCppModelSource(selected.model),
			cacheDir,
			download: true,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress("Gemma 4 E4B", status))
		});
		const embeddingModelPath = await ensureLlamaCppModel({
			source: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
			cacheDir,
			download: true,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress("EmbeddingGemma", status))
		});
		const configuredContext = selected.model.params?.contextSize;
		const contextSize = typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : selected.model.contextTokens;
		const managed = await prepareManagedLlamaServer({
			chatModelId: selected.model.id,
			chatModelPath,
			contextSize,
			maxTokens: selected.model.maxTokens,
			embeddingModelPath,
			port: readConfiguredPort(existing)
		});
		progress.stop("Managed llama.cpp server prepared");
		return buildSetupResult({
			config: ctx.config,
			managed,
			defaultModel: `${LLAMA_CPP_PROVIDER_ID}/${selected.model.id}`
		});
	} catch (error) {
		progress.stop("llama.cpp setup failed");
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Managed llama.cpp setup failed. Run openclaw doctor, fix the reported runtime or model issue, then retry. ${detail}`, { cause: error });
	}
}
//#endregion
//#region extensions/llama-cpp/index.ts
var llama_cpp_default = definePluginEntry({
	id: "llama-cpp",
	name: "llama.cpp Provider",
	description: "Managed local llama.cpp server for GGUF chat and embeddings",
	register(api) {
		api.registerEmbeddingProvider(llamaCppEmbeddingProviderAdapter);
		api.registerProvider({
			id: LLAMA_CPP_PROVIDER_ID,
			label: LLAMA_CPP_PROVIDER_LABEL,
			docsPath: "/plugins/llama-cpp",
			auth: [{
				id: "local",
				label: LLAMA_CPP_PROVIDER_LABEL,
				hint: "Install a verified llama.cpp server and run a private GGUF model managed by OpenClaw",
				kind: "custom",
				appGuidedSetup: {
					detect: detectLlamaCppSetup,
					prepare: prepareLlamaCppSetup
				},
				run: runLlamaCppSetup
			}],
			catalog: {
				order: "late",
				run: async (ctx) => ({ provider: buildLlamaCppProviderConfig(ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID]) })
			},
			staticCatalog: {
				order: "late",
				run: async () => ({ provider: buildLlamaCppProviderConfig() })
			},
			resolveSyntheticAuth: () => ({
				apiKey: resolveLlamaCppSyntheticApiKey(),
				source: "managed local llama.cpp server",
				mode: "api-key"
			}),
			wrapStreamFn: (ctx) => {
				const inner = ctx.streamFn;
				const providerConfig = ctx.config?.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
				const selectedModel = ctx.model;
				if (!inner || !providerConfig?.localService || !selectedModel) return;
				return async (model, context, options) => {
					await ensureManagedLlamaServerForChat({
						provider: providerConfig,
						model: selectedModel
					});
					return inner(model, context, options);
				};
			},
			...buildProviderToolCompatFamilyHooks("llamacpp-gbnf"),
			wizard: {
				setup: {
					choiceId: LLAMA_CPP_PROVIDER_ID,
					choiceLabel: LLAMA_CPP_PROVIDER_LABEL,
					choiceHint: "Install a verified llama.cpp server and run a private GGUF model managed by OpenClaw",
					groupId: LLAMA_CPP_PROVIDER_ID,
					groupLabel: "Local llama.cpp",
					groupHint: "No API key required",
					methodId: "local"
				},
				modelPicker: {
					label: "llama.cpp",
					hint: "Run a GGUF model with OpenClaw's managed local llama.cpp server",
					methodId: "local"
				}
			}
		});
	}
});
//#endregion
export { llama_cpp_default as default };
