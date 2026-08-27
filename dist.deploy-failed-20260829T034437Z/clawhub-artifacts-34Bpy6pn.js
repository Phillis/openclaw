import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { a as sha256Hex, t as sha256Base64 } from "./crypto-digest-IGAbV2KW.js";
import { _ as requestClawHub, r as createClawHubError, u as readClawHubBytes, y as resolveClawHubBaseUrl } from "./clawhub-client-Cjweitq0.js";
import { n as createTempDownloadTarget } from "./temp-download-D68D-o9b.js";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/infra/clawhub-artifacts.ts
const DEFAULT_GITHUB_CODELOAD_URL = "https://codeload.github.com";
function normalizeGitHubCodeloadBaseUrl() {
	return (normalizeOptionalString(process.env.CLAWHUB_GITHUB_CODELOAD_BASE_URL) || DEFAULT_GITHUB_CODELOAD_URL).replace(/\/+$/, "") || DEFAULT_GITHUB_CODELOAD_URL;
}
function buildGitHubZipUrl(repo, commit) {
	const url = new URL(`${normalizeGitHubCodeloadBaseUrl()}/`);
	url.pathname = `${url.pathname.replace(/\/+$/, "")}/${repo.split("/").map((segment) => encodeURIComponent(segment)).join("/")}/zip/${encodeURIComponent(commit)}`;
	return url.toString();
}
function formatSha512Integrity(bytes) {
	return `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
}
function formatSha1Hex(bytes) {
	return createHash("sha1").update(bytes).digest("hex");
}
function safePackageTarballName(name, version) {
	return `${name.replace(/^@/, "").replace(/[\\/]+/g, "-").replace(/[^A-Za-z0-9._-]/g, "-") || "package"}-${version}.tgz`;
}
async function stageClawHubArchive(params) {
	const sha256Digest = params.sha256Hex ?? Buffer.from(sha256Base64(params.bytes), "base64").toString("hex");
	const target = await createTempDownloadTarget(params);
	try {
		await fs.writeFile(target.path, params.bytes);
		return {
			archivePath: target.path,
			integrity: `sha256-${Buffer.from(sha256Digest, "hex").toString("base64")}`,
			sha256Hex: sha256Digest,
			artifact: "archive",
			...params.result,
			cleanup: target.cleanup
		};
	} catch (error) {
		await target.cleanup().catch(() => void 0);
		throw error;
	}
}
/** Normalizes ClawHub SHA-256 metadata into Subresource Integrity format. */
function normalizeClawHubSha256Integrity(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const prefixedBase64 = /^sha256-([A-Za-z0-9+/]+={0,1})$/.exec(trimmed);
	if (prefixedBase64?.[1]) {
		try {
			const decoded = Buffer.from(prefixedBase64[1], "base64");
			if (decoded.length === 32) return `sha256-${decoded.toString("base64")}`;
		} catch {
			return null;
		}
		return null;
	}
	const prefixedHex = /^sha256:([A-Fa-f0-9]{64})$/.exec(trimmed);
	if (prefixedHex?.[1]) return `sha256-${Buffer.from(prefixedHex[1], "hex").toString("base64")}`;
	if (/^[A-Fa-f0-9]{64}$/.test(trimmed)) return `sha256-${Buffer.from(trimmed, "hex").toString("base64")}`;
	return null;
}
/** Normalizes ClawHub SHA-256 metadata into lowercase hex form. */
function normalizeClawHubSha256Hex(value) {
	const trimmed = value.trim();
	if (!/^[A-Fa-f0-9]{64}$/.test(trimmed)) return null;
	return normalizeLowercaseStringOrEmpty(trimmed);
}
async function downloadClawHubPackageArchive(params) {
	if (params.artifact === "clawpack") {
		if (!params.version) throw new Error("ClawPack package downloads require an explicit version.");
		const { response, url, hasToken } = await requestClawHub({
			baseUrl: params.baseUrl,
			path: `/api/v1/packages/${encodeURIComponent(params.name)}/versions/${encodeURIComponent(params.version)}/artifact/download`,
			token: params.token,
			timeoutMs: params.timeoutMs,
			fetchImpl: params.fetchImpl
		});
		if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
		const bytes = await readClawHubBytes({
			response,
			timeoutMs: params.timeoutMs,
			resourceLabel: `ClawPack download for ${params.name}@${params.version}`
		});
		const sha256Digest = sha256Hex(bytes);
		const npmIntegrity = formatSha512Integrity(bytes);
		const npmShasum = formatSha1Hex(bytes);
		const headerSha256 = normalizeClawHubSha256Hex(response.headers.get("X-ClawHub-Artifact-Sha256") ?? response.headers.get("X-ClawHub-ClawPack-Sha256") ?? "");
		if (!headerSha256) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" is missing X-ClawHub-Artifact-Sha256.`);
		if (headerSha256 !== sha256Digest) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared sha256 ${headerSha256}, got ${sha256Digest}.`);
		const headerNpmIntegrity = normalizeOptionalString(response.headers.get("X-ClawHub-Npm-Integrity"));
		if (headerNpmIntegrity && headerNpmIntegrity !== npmIntegrity) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared npm integrity ${headerNpmIntegrity}, got ${npmIntegrity}.`);
		const headerNpmShasum = normalizeOptionalString(response.headers.get("X-ClawHub-Npm-Shasum"));
		if (headerNpmShasum && headerNpmShasum !== npmShasum) throw new Error(`ClawHub ClawPack download for "${params.name}@${params.version}" declared npm shasum ${headerNpmShasum}, got ${npmShasum}.`);
		const npmTarballName = normalizeOptionalString(response.headers.get("X-ClawHub-Npm-Tarball-Name")) ?? safePackageTarballName(params.name, params.version);
		const specVersion = parseStrictPositiveInteger(response.headers.get("X-ClawHub-ClawPack-Spec-Version"));
		return stageClawHubArchive({
			prefix: "openclaw-clawhub-clawpack",
			fileName: npmTarballName,
			bytes,
			sha256Hex: sha256Digest,
			result: {
				artifact: "clawpack",
				clawpackHeaderSha256: headerSha256,
				...typeof specVersion === "number" && Number.isSafeInteger(specVersion) && specVersion >= 0 ? { clawpackHeaderSpecVersion: specVersion } : {},
				npmIntegrity,
				npmShasum,
				npmTarballName
			}
		});
	}
	const search = params.version ? { version: params.version } : params.tag ? { tag: params.tag } : void 0;
	const { response, url, hasToken } = await requestClawHub({
		baseUrl: params.baseUrl,
		path: `/api/v1/packages/${encodeURIComponent(params.name)}/download`,
		search,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
	if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubBytes({
		response,
		timeoutMs: params.timeoutMs,
		resourceLabel: `package archive download for ${params.name}`
	});
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-package",
		fileName: `${params.name}.zip`,
		bytes
	});
}
async function downloadClawHubSkillArchive(params) {
	const { response, url, hasToken } = await requestClawHub({
		baseUrl: params.baseUrl,
		path: "/api/v1/download",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			slug: params.slug,
			ownerHandle: params.ownerHandle,
			version: params.version,
			tag: params.version ? void 0 : params.tag
		}
	});
	if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubBytes({
		response,
		timeoutMs: params.timeoutMs,
		resourceLabel: `skill archive download for ${params.slug}`
	});
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-skill",
		fileName: `${params.slug}.zip`,
		bytes
	});
}
async function downloadClawHubSkillArchiveUrl(params) {
	const providedToken = normalizeOptionalString(params.token);
	const requestUrl = new URL(params.url, `${resolveClawHubBaseUrl(params.baseUrl)}/`);
	const registryOrigin = new URL(`${resolveClawHubBaseUrl(params.baseUrl)}/`).origin;
	const skipAuth = providedToken == null && requestUrl.origin !== registryOrigin;
	const { response, url, hasToken } = await requestClawHub({
		baseUrl: params.baseUrl,
		url: params.url,
		token: providedToken,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		skipAuth
	});
	if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-skill",
		fileName: "skill.zip",
		bytes: await readClawHubBytes({
			response,
			timeoutMs: params.timeoutMs,
			resourceLabel: `skill archive download at ${url.pathname}`
		})
	});
}
async function downloadClawHubGitHubSkillArchive(params) {
	const { response, url, hasToken } = await requestClawHub({
		url: buildGitHubZipUrl(params.repo, params.commit),
		skipAuth: true,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
	if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	const bytes = await readClawHubBytes({
		response,
		timeoutMs: params.timeoutMs,
		resourceLabel: `GitHub source archive for ${params.repo}@${params.commit}`
	});
	return stageClawHubArchive({
		prefix: "openclaw-clawhub-github-skill",
		fileName: `${params.commit}.zip`,
		bytes
	});
}
//#endregion
export { normalizeClawHubSha256Hex as a, downloadClawHubSkillArchiveUrl as i, downloadClawHubPackageArchive as n, normalizeClawHubSha256Integrity as o, downloadClawHubSkillArchive as r, downloadClawHubGitHubSkillArchive as t };
