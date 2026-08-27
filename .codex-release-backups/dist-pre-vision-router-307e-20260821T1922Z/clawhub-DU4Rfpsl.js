import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import "./fs-safe-C9N8pCh1.js";
import { i as resolveSafeInstallDir } from "./install-safe-path-Blov4TZi.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { c as tryReadJson, r as readJsonIfExists, u as writeJson } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { s as isDefaultClawHubBaseUrl, y as resolveClawHubBaseUrl } from "./clawhub-client-4V78ChLt.js";
import { i as downloadClawHubSkillArchiveUrl, o as normalizeClawHubSha256Integrity, r as downloadClawHubSkillArchive, t as downloadClawHubGitHubSkillArchive } from "./clawhub-artifacts-BRS02t8t.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-IYtayVps.js";
import { t as parseSkillFrontmatter } from "./frontmatter-BE0jYufM.js";
import { r as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-BNTJl23n.js";
import { n as withExtractedArchiveRoot } from "./install-flow-BA0ixVO8.js";
import { t as installPackageDir } from "./install-package-dir-CBvlaFS_.js";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-Ix-vNSaq.js";
import { a as CLAWHUB_SKILLS_SH_TRUST_STATE, c as fetchClawHubSkillInstallResolution, d as searchClawHubSkills, i as CLAWHUB_SKILLS_SH_TRUST_LABEL, l as fetchClawHubSkillVerification, n as ensureClawHubPackageTrustAcknowledged, s as fetchClawHubSkillDetail, u as reportClawHubSkillInstallTelemetry } from "./clawhub-install-trust-CfEKfDHW.js";
import { t as markClawPackageIndependentlyOwned } from "./claw-package-adoption-6JE031nU.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/skills/lifecycle/skill-change-hook.ts
const SKILL_FILE_CANDIDATES = [
	"SKILL.md",
	"skill.md",
	"skills.md",
	"SKILL.MD"
];
const EXCLUDED_ROOT_DIRS = /* @__PURE__ */ new Set([
	".clawhub",
	".clawdhub",
	".openclaw"
]);
async function collectSkillTreeFiles(skillDir, relativeDir = "") {
	const entries = await fs$1.readdir(path.join(skillDir, relativeDir), { withFileTypes: true });
	const files = [];
	for (const entry of entries.toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
		if (!relativeDir && EXCLUDED_ROOT_DIRS.has(entry.name)) continue;
		const relativePath = path.join(relativeDir, entry.name);
		const portablePath = relativePath.split(path.sep).join("/");
		const absolutePath = path.join(skillDir, relativePath);
		const stat = await fs$1.lstat(absolutePath);
		if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw new Error(`Skill tree contains unsupported entry ${JSON.stringify(portablePath)}.`);
		if (stat.isDirectory()) {
			files.push(...await collectSkillTreeFiles(skillDir, relativePath));
			continue;
		}
		if (stat.nlink > 1) throw new Error(`Skill tree contains hard-linked file ${JSON.stringify(portablePath)}.`);
		const content = await fs$1.readFile(absolutePath);
		files.push({
			path: portablePath,
			sha256: sha256Hex(content),
			sizeBytes: content.byteLength
		});
	}
	return files;
}
function parseSkillArtifactMetadata(content) {
	const text = content.toString("utf8");
	if (text.includes("\0") || !Buffer.from(text, "utf8").equals(content)) return {};
	try {
		const frontmatter = parseSkillFrontmatter(text);
		return {
			name: normalizeOptionalString(frontmatter.name),
			description: normalizeOptionalString(frontmatter.description),
			declaredVersion: normalizeOptionalString(frontmatter.version)
		};
	} catch {
		return {};
	}
}
function hasCommittedSkillChangeHooks() {
	return getGlobalHookRunner()?.hasHooks("skill_changed") ?? false;
}
function resolveCommittedSkillChangeSource(originType) {
	if (originType === "clawhub") return "clawhub";
	if (originType === "upload") return "upload";
	return "source-install";
}
async function snapshotCommittedSkillArtifact(params) {
	const skillDir = path.resolve(params.skillDir);
	const files = await collectSkillTreeFiles(skillDir);
	const skillFileEntry = SKILL_FILE_CANDIDATES.map((candidate) => files.find((file) => file.path === candidate)).find((entry) => entry !== void 0);
	if (!skillFileEntry) throw new Error(`Skill tree is missing SKILL.md: ${skillDir}`);
	const skillFile = path.join(skillDir, skillFileEntry.path);
	const frontmatter = parseSkillArtifactMetadata(await fs$1.readFile(skillFile));
	const treeSha256 = sha256Hex(JSON.stringify(files));
	return {
		name: frontmatter.name ?? params.skillKey,
		skillKey: params.skillKey,
		...frontmatter.description ? { description: frontmatter.description } : {},
		skillFile,
		skillDir,
		source: params.source,
		revision: {
			...frontmatter.declaredVersion ? { declaredVersion: frontmatter.declaredVersion } : {},
			contentSha256: `sha256:${skillFileEntry.sha256}`,
			treeSha256: `sha256:${treeSha256}`,
			...params.sourceVersion ? { sourceVersion: params.sourceVersion } : {}
		}
	};
}
async function snapshotCommittedSkillArtifactBestEffort(params) {
	try {
		return await snapshotCommittedSkillArtifact(params);
	} catch (error) {
		params.logger?.warn?.(`Could not snapshot committed skill change: ${String(error)}`);
		return;
	}
}
async function dispatchCommittedSkillChangeBestEffort(params) {
	const runner = getGlobalHookRunner();
	if (!runner?.hasHooks("skill_changed")) return;
	try {
		await runner.runSkillChanged({
			action: params.action,
			source: params.source,
			occurredAt: (/* @__PURE__ */ new Date()).toISOString(),
			...params.before ? { before: params.before } : {},
			...params.after ? { after: params.after } : {},
			...params.proposal ? { proposal: params.proposal } : {}
		}, { workspaceDir: params.workspaceDir });
	} catch (error) {
		params.logger?.warn?.(`Committed skill change hook failed: ${String(error)}`);
	}
}
//#endregion
//#region src/skills/lifecycle/archive-install.ts
const VALID_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS = ["SKILL.md"];
/** Accepted root marker names for ClawHub skill archive uploads. */
const CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS = [
	"SKILL.md",
	"skill.md",
	"skills.md",
	"SKILL.MD"
];
function hasNonAscii(value) {
	for (const char of value) if (char.charCodeAt(0) > 127) return true;
	return false;
}
/** Normalizes a tracked slug without accepting traversal or path separators. */
function normalizeTrackedSkillSlug(raw) {
	const slug = raw.trim();
	if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes("..")) throw new Error(`Invalid skill slug: ${raw}`);
	return slug;
}
function validateRequestedSkillSlug(raw) {
	const slug = normalizeTrackedSkillSlug(raw);
	if (hasNonAscii(slug) || !VALID_SLUG_PATTERN.test(slug)) throw new Error(`Invalid skill slug: ${raw}`);
	return slug;
}
function resolveWorkspaceSkillInstallDir(workspaceDir, slug) {
	const target = resolveSafeInstallDir({
		baseDir: path.join(path.resolve(workspaceDir), "skills"),
		id: slug,
		invalidNameMessage: "invalid skill target path"
	});
	if (!target.ok) throw new Error(target.error);
	return target.path;
}
function installFailure(error, failureKind) {
	return {
		ok: false,
		error,
		failureKind
	};
}
async function hasSkillArchiveRoot(rootDir, rootMarkers) {
	for (const candidate of rootMarkers) if (await pathExists(path.join(rootDir, candidate))) return true;
	return false;
}
function scanBlockedFailureKind(blocked) {
	return blocked.code === "security_scan_failed" ? "unavailable" : "invalid-request";
}
const TRANSIENT_ARCHIVE_ERROR_PATTERNS = [
	"enoent",
	"enospc",
	"eio",
	"eacces",
	"eperm",
	"ebusy",
	"emfile",
	"enfile",
	"timeout",
	"timed out"
];
function archiveFailureKind(error) {
	const lower = error.toLowerCase();
	if (lower.startsWith("failed to install skill:")) return "unavailable";
	for (const pattern of TRANSIENT_ARCHIVE_ERROR_PATTERNS) if (lower.includes(pattern)) return "unavailable";
	return "invalid-request";
}
async function installExtractedSkillRoot(params) {
	try {
		if (!await hasSkillArchiveRoot(params.extractedRoot, params.rootMarkers ?? DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS)) return installFailure("archive is missing SKILL.md", "invalid-request");
		let targetDir;
		try {
			targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
		} catch (err) {
			return installFailure(formatErrorMessage(err), "invalid-request");
		}
		const targetExists = await pathExists(targetDir);
		const effectiveMode = params.mode === "update" && targetExists ? "update" : "install";
		if (params.mode === "install" && targetExists) return installFailure(`Skill already exists at ${targetDir}. Re-run with force/update.`, "invalid-request");
		const changeSource = resolveCommittedSkillChangeSource(params.policy?.origin.type);
		const sourceVersionValue = params.policy?.origin.version ?? params.policy?.origin.commit ?? void 0;
		const sourceVersion = typeof sourceVersionValue === "string" || typeof sourceVersionValue === "number" ? String(sourceVersionValue) : void 0;
		const shouldDispatchChange = hasCommittedSkillChangeHooks();
		const before = shouldDispatchChange && effectiveMode === "update" ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: targetDir,
			skillKey: params.slug,
			source: changeSource,
			logger: params.logger
		}) : void 0;
		if (params.policy) {
			const scanResult = await evaluateSkillInstallPolicy({
				config: params.policy.config,
				onInstallPolicyWarning: params.policy.onInstallPolicyWarning,
				installId: params.policy.installId ?? "archive",
				logger: params.logger ?? {},
				origin: params.policy.origin,
				requestedSpecifier: params.policy.requestedSpecifier,
				source: params.policy.source,
				mode: effectiveMode,
				skillName: params.slug,
				sourceDir: params.extractedRoot
			});
			if (scanResult?.blocked) return installFailure(scanResult.blocked.reason, scanBlockedFailureKind(scanResult.blocked));
		}
		const install = await installPackageDir({
			sourceDir: params.extractedRoot,
			targetDir,
			mode: effectiveMode,
			timeoutMs: params.timeoutMs ?? 12e4,
			logger: params.logger,
			copyErrorPrefix: "failed to install skill",
			hasDeps: false,
			depsLogMessage: ""
		});
		if (!install.ok) return installFailure(install.error, "unavailable");
		if (shouldDispatchChange) {
			const after = await snapshotCommittedSkillArtifactBestEffort({
				skillDir: targetDir,
				skillKey: params.slug,
				source: changeSource,
				sourceVersion,
				logger: params.logger
			});
			await dispatchCommittedSkillChangeBestEffort({
				action: effectiveMode === "update" ? "updated" : "created",
				source: changeSource,
				workspaceDir: params.workspaceDir,
				before,
				after,
				logger: params.logger
			});
		}
		return {
			ok: true,
			targetDir
		};
	} catch (err) {
		return installFailure(formatErrorMessage(err), "unavailable");
	}
}
async function installSkillArchiveFromPath(params) {
	const result = await withExtractedArchiveRoot({
		archivePath: params.archivePath,
		tempDirPrefix: "openclaw-skill-archive-",
		timeoutMs: params.timeoutMs ?? 12e4,
		logger: params.logger,
		rootMarkers: ["SKILL.md"],
		onExtracted: async (rootDir) => await installExtractedSkillRoot({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			extractedRoot: rootDir,
			mode: params.force ? "update" : "install",
			timeoutMs: params.timeoutMs,
			logger: params.logger,
			policy: params.policy
		})
	});
	if (!result.ok) {
		const error = result.error.includes("unexpected archive layout") ? "archive is missing SKILL.md" : result.error;
		return installFailure(error, "failureKind" in result && (result.failureKind === "invalid-request" || result.failureKind === "unavailable") ? result.failureKind : archiveFailureKind(error));
	}
	return result;
}
//#endregion
//#region src/skills/lifecycle/clawhub-store.ts
const DOT_DIR = ".clawhub";
const LEGACY_DOT_DIR = ".clawdhub";
const CLAWHUB_OWNER_HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,38}[a-z0-9])?$/;
const GITHUB_OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const GITHUB_REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
function metadataPaths(rootDir, filename) {
	return [path.join(rootDir, DOT_DIR, filename), path.join(rootDir, LEGACY_DOT_DIR, filename)];
}
function normalizeClawHubOwnerHandle(raw) {
	const ownerHandle = raw.trim().toLowerCase();
	if (!CLAWHUB_OWNER_HANDLE_PATTERN.test(ownerHandle)) throw new Error(`Invalid ClawHub owner handle: ${raw}`);
	return ownerHandle;
}
function parseRequestedClawHubSkillRef(raw) {
	const value = raw.trim();
	if (value.startsWith("skills-sh/")) throw new Error(`Invalid skills.sh skill reference: ${raw}`);
	if (value.startsWith("skills-sh:")) {
		const parts = value.slice(10).split("/");
		if (parts.length !== 3) throw new Error(`Invalid skills.sh skill reference: ${raw}`);
		const [owner, repo, slug] = parts;
		if (!owner || !repo || !slug || !GITHUB_OWNER_PATTERN.test(owner) || !GITHUB_REPO_PATTERN.test(repo) || repo === "." || repo === "..") throw new Error(`Invalid skills.sh skill reference: ${raw}`);
		return {
			slug: validateRequestedSkillSlug(slug),
			requestedReference: value,
			trustState: CLAWHUB_SKILLS_SH_TRUST_STATE
		};
	}
	if (!value.startsWith("@")) return { slug: validateRequestedSkillSlug(value) };
	const parts = value.slice(1).split("/");
	if (parts.length !== 2) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
	const [owner, slug] = parts;
	if (!owner || !slug) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
	return {
		ownerHandle: normalizeClawHubOwnerHandle(owner),
		slug: validateRequestedSkillSlug(slug)
	};
}
function formatClawHubSkillRef(ref) {
	return ref.ownerHandle ? `@${ref.ownerHandle}/${ref.slug}` : ref.slug;
}
function normalizeStoredRegistry(registry) {
	const trimmed = registry.trim();
	return trimmed.replace(/\/+$/, "") || trimmed;
}
function normalizeGitHubCommitSegment(raw) {
	const commit = normalizeOptionalString(raw);
	return commit && /^[0-9a-f]{40}$/i.test(commit) ? commit : void 0;
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function normalizeDownloadedArtifactLock(raw) {
	if (!raw || typeof raw !== "object") return;
	const candidate = raw;
	if ((candidate.kind === "archive" || candidate.kind === "clawpack") && isNonEmptyString(candidate.sha256) && isNonEmptyString(candidate.integrity)) return {
		kind: candidate.kind,
		sha256: candidate.sha256,
		integrity: candidate.integrity
	};
}
function normalizeSkillFileLock(raw) {
	if (!raw || typeof raw !== "object") return;
	const candidate = raw;
	return isNonEmptyString(candidate.path) && isNonEmptyString(candidate.sha256) ? {
		path: candidate.path,
		sha256: candidate.sha256
	} : void 0;
}
function normalizeClawHubSkillOrigin(raw) {
	if (raw?.version !== 1 || !isNonEmptyString(raw.registry) || !isNonEmptyString(raw.slug) || !isNonEmptyString(raw.installedVersion) || typeof raw.installedAt !== "number") return null;
	const sourceUrl = normalizeOptionalString(raw.sourceUrl);
	const ownerHandleRaw = normalizeOptionalString(raw.ownerHandle);
	let ownerHandle;
	if (ownerHandleRaw) try {
		ownerHandle = normalizeClawHubOwnerHandle(ownerHandleRaw);
	} catch {
		return null;
	}
	const requestedReferenceRaw = normalizeOptionalString(raw.requestedReference);
	let requestedReference;
	let trustState;
	if (requestedReferenceRaw) try {
		const parsed = parseRequestedClawHubSkillRef(requestedReferenceRaw);
		if (!parsed.requestedReference || parsed.slug !== raw.slug) return null;
		requestedReference = parsed.requestedReference;
		if (normalizeOptionalString(raw.trustState) !== "not-scanned-by-clawhub") return null;
		trustState = CLAWHUB_SKILLS_SH_TRUST_STATE;
	} catch {
		return null;
	}
	else if (raw.trustState !== void 0) return null;
	const artifact = normalizeDownloadedArtifactLock(raw.artifact);
	const skillFile = normalizeSkillFileLock(raw.skillFile);
	const fileTreeSha256 = normalizeOptionalString(raw.fileTreeSha256);
	return {
		version: 1,
		registry: normalizeStoredRegistry(raw.registry),
		slug: raw.slug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		installedVersion: raw.installedVersion,
		installedAt: raw.installedAt,
		...sourceUrl ? { sourceUrl } : {},
		...artifact ? { artifact } : {},
		...skillFile ? { skillFile } : {},
		...fileTreeSha256 ? { fileTreeSha256 } : {}
	};
}
async function readClawHubSkillsLockfile(workspaceDir) {
	for (const candidate of metadataPaths(workspaceDir, "lock.json")) try {
		const raw = await tryReadJson(candidate);
		if (raw?.version === 1 && raw.skills && typeof raw.skills === "object") return {
			version: 1,
			skills: raw.skills
		};
	} catch {}
	return {
		version: 1,
		skills: {}
	};
}
async function writeClawHubSkillsLockfile(workspaceDir, lockfile) {
	await writeJson(path.join(workspaceDir, DOT_DIR, "lock.json"), lockfile, { trailingNewline: true });
}
function readJsonIfExistsSync(candidate) {
	try {
		return {
			exists: true,
			value: JSON.parse(fs.readFileSync(candidate, "utf8"))
		};
	} catch (err) {
		if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") return { exists: false };
		throw err;
	}
}
function readClawHubSkillsLockfileStatusSync(workspaceDir) {
	for (const candidate of metadataPaths(workspaceDir, "lock.json")) try {
		const read = readJsonIfExistsSync(candidate);
		if (!read.exists) continue;
		const raw = read.value;
		return raw?.version === 1 && raw.skills && typeof raw.skills === "object" ? {
			kind: "found",
			path: candidate,
			lock: {
				version: 1,
				skills: raw.skills
			}
		} : {
			kind: "malformed",
			path: candidate,
			error: "expected version 1 lockfile with skills"
		};
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
function originResult(raw, candidate) {
	const origin = normalizeClawHubSkillOrigin(raw);
	return origin ? {
		kind: "found",
		origin,
		path: candidate
	} : {
		kind: "malformed",
		path: candidate,
		error: "expected version 1 origin with registry, slug, installedVersion, and installedAt"
	};
}
async function readClawHubSkillOrigin(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const origin = normalizeClawHubSkillOrigin(await tryReadJson(candidate));
		if (origin) return origin;
	} catch {}
	return null;
}
function readClawHubSkillOriginStatusSync(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const read = readJsonIfExistsSync(candidate);
		if (read.exists) return originResult(read.value, candidate);
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
async function readClawHubSkillOriginStrict(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const raw = await readJsonIfExists(candidate);
		if (raw) return originResult(raw, candidate);
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
async function writeClawHubSkillOrigin(skillDir, origin) {
	await writeJson(path.join(skillDir, DOT_DIR, "origin.json"), origin, { trailingNewline: true });
}
async function readTrackedClawHubSkillSlugs(workspaceDir) {
	return Object.keys((await readClawHubSkillsLockfile(workspaceDir)).skills).toSorted();
}
async function untrackClawHubSkill(workspaceDir, slug) {
	const trackedSlug = normalizeTrackedSkillSlug(slug);
	const lock = await readClawHubSkillsLockfile(workspaceDir);
	const previous = lock.skills[trackedSlug];
	if (!previous) return async () => void 0;
	delete lock.skills[trackedSlug];
	await writeClawHubSkillsLockfile(workspaceDir, lock);
	return async () => {
		const current = await readClawHubSkillsLockfile(workspaceDir);
		if (current.skills[trackedSlug]) throw new Error(`Skill ${JSON.stringify(trackedSlug)} was retracked during rollback.`);
		current.skills[trackedSlug] = previous;
		await writeClawHubSkillsLockfile(workspaceDir, current);
	};
}
//#endregion
//#region src/skills/lifecycle/skill-tree-digest.ts
const EXCLUDED_METADATA_DIRS = /* @__PURE__ */ new Set([".clawhub", ".clawdhub"]);
async function collectEntries(root, relativeDir = "") {
	const absoluteDir = path.join(root, relativeDir);
	const entries = await fs$1.readdir(absoluteDir, { withFileTypes: true });
	const collected = [];
	for (const entry of entries.toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
		if (!relativeDir && EXCLUDED_METADATA_DIRS.has(entry.name)) continue;
		const relativePath = path.join(relativeDir, entry.name);
		const portablePath = relativePath.split(path.sep).join("/");
		const stat = await fs$1.lstat(path.join(root, relativePath));
		if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw new Error(`Skill tree contains unsupported entry ${JSON.stringify(portablePath)}.`);
		if (stat.isDirectory()) {
			collected.push({
				path: portablePath,
				type: "directory"
			});
			collected.push(...await collectEntries(root, relativePath));
			continue;
		}
		if (stat.nlink > 1) throw new Error(`Skill tree contains hard-linked file ${JSON.stringify(portablePath)}.`);
		const content = await fs$1.readFile(path.join(root, relativePath));
		collected.push({
			path: portablePath,
			type: "file",
			sha256: createHash("sha256").update(content).digest("hex")
		});
	}
	return collected;
}
/** Digests every installed skill file except OpenClaw's own provenance metadata. */
async function digestClawHubSkillTree(skillDir) {
	const entries = await collectEntries(skillDir);
	return `sha256:${createHash("sha256").update(JSON.stringify(entries)).digest("hex")}`;
}
//#endregion
//#region src/skills/lifecycle/clawhub-install-core.ts
function normalizeExpectedArtifactIntegrity(expectedIntegrity) {
	if (expectedIntegrity === void 0) return;
	const normalized = normalizeClawHubSha256Integrity(expectedIntegrity);
	if (!normalized) throw new Error(`Invalid expected ClawHub archive integrity: ${expectedIntegrity}`);
	return normalized;
}
function assertDownloadedArtifactIntegrity(archive, expectedIntegrity) {
	const normalizedExpected = normalizeExpectedArtifactIntegrity(expectedIntegrity);
	if (normalizedExpected && archive.integrity !== normalizedExpected) throw new Error(`ClawHub archive integrity mismatch: expected ${normalizedExpected}, got ${archive.integrity}.`);
}
function hasOfficialClawHubFlag(value) {
	return value?.channel === "official" || value?.official === true || value?.isOfficial === true;
}
function isDefaultOfficialClawHubSkillSource(params) {
	if (!isDefaultClawHubBaseUrl(params.baseUrl)) return false;
	return hasOfficialClawHubFlag(params.detail?.skill) || hasOfficialClawHubFlag(params.detail?.owner) || hasOfficialClawHubFlag(params.resolution) || params.resolution?.installKind === "archive" && hasOfficialClawHubFlag(params.resolution.archive);
}
async function fetchDefaultClawHubSkillDetailIfOfficial(params) {
	if (!isDefaultClawHubBaseUrl(params.baseUrl)) return;
	try {
		const detail = await fetchClawHubSkillDetail({
			slug: params.slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			baseUrl: params.baseUrl
		});
		return isDefaultOfficialClawHubSkillSource({
			baseUrl: params.baseUrl,
			detail
		}) ? detail : void 0;
	} catch {
		return;
	}
}
async function resolveInstallVersion(params) {
	const detail = await fetchClawHubSkillDetail({
		slug: params.slug,
		...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
		baseUrl: params.baseUrl
	});
	if (!detail.skill) throw new Error(`Skill "${params.slug}" not found on ClawHub.`);
	const version = params.version ?? detail.latestVersion?.version;
	if (!version) throw new Error(`Skill "${params.slug}" has no installable version.`);
	return {
		detail,
		version
	};
}
function normalizeGitHubSourcePath(raw) {
	const parts = raw.replaceAll("\\", "/").split("/").filter(Boolean);
	if (parts.length === 0 || parts.some((part) => part === "." || part === "..")) throw new Error(`Invalid GitHub skill source path: ${raw}`);
	return parts.join("/");
}
function buildGitHubTreeUrl(params) {
	const [owner, name] = params.repo.split("/");
	return `https://github.com/${[
		owner,
		name,
		"tree",
		params.commit,
		...params.sourcePath ? params.sourcePath.split("/") : []
	].map(encodeURIComponent).join("/")}`;
}
function readVerifiedClawHubSkillSourceUrl(raw) {
	const provenance = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : void 0;
	if (provenance?.source !== "server-resolved-github-import") return;
	const repo = normalizeOptionalString(provenance.repo);
	const repoParts = repo?.split("/");
	const commit = normalizeGitHubCommitSegment(provenance.commit);
	if (!repo || repoParts?.length !== 2 || repoParts.some((part) => !/^[A-Za-z0-9._-]+$/.test(part)) || !commit) return;
	const pathValue = normalizeOptionalString(provenance.path);
	try {
		const sourcePath = pathValue ? normalizeGitHubSourcePath(pathValue) : void 0;
		return buildGitHubTreeUrl({
			repo,
			commit,
			...sourcePath ? { sourcePath } : {}
		});
	} catch {
		return;
	}
}
function buildDownloadedArtifactLock(archive) {
	return {
		kind: archive.artifact,
		sha256: archive.sha256Hex,
		integrity: archive.integrity
	};
}
function snapshotClawHubSkillVerification(verification) {
	return {
		schema: verification.schema,
		ok: verification.ok,
		decision: verification.decision,
		reasons: [...verification.reasons],
		...verification.card !== void 0 ? { card: verification.card } : {},
		...verification.artifact !== void 0 ? { artifact: verification.artifact } : {},
		...verification.provenance !== void 0 ? { provenance: verification.provenance } : {},
		...verification.security !== void 0 ? { security: verification.security } : {},
		...verification.signature !== void 0 ? { signature: verification.signature } : {}
	};
}
async function fetchInstallVerificationLock(params) {
	try {
		return snapshotClawHubSkillVerification(await fetchClawHubSkillVerification({
			slug: params.slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			...params.requestedReference ? { requestedReference: params.requestedReference } : {},
			version: params.version,
			baseUrl: params.baseUrl
		}));
	} catch (err) {
		params.logger?.warn?.(`Skill verification for ${formatClawHubSkillRef(params)} failed: ${formatErrorMessage(err)}`);
		return;
	}
}
async function readInstalledSkillFileLock(skillDir) {
	for (const marker of CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS) try {
		return {
			path: marker,
			sha256: sha256Hex(await fs$1.readFile(path.join(skillDir, marker)))
		};
	} catch {
		continue;
	}
}
function resolveGitHubSkillSourceDir(repoRoot, sourcePath) {
	return path.join(repoRoot, ...normalizeGitHubSourcePath(sourcePath).split("/"));
}
async function installArchiveResolution(params) {
	return await withExtractedArchiveRoot({
		archivePath: params.archivePath,
		tempDirPrefix: "openclaw-skill-clawhub-",
		timeoutMs: 12e4,
		rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS,
		onExtracted: async (rootDir) => await installExtractedSkillRoot({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			extractedRoot: rootDir,
			mode: params.force ? "update" : "install",
			logger: params.logger,
			policy: {
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				installId: "clawhub",
				origin: {
					type: "clawhub",
					registry: params.registry,
					slug: params.slug,
					...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
					version: params.version
				},
				source: {
					kind: "clawhub",
					authority: params.authority,
					mutable: false,
					network: true
				},
				requestedSpecifier: `clawhub:${formatClawHubSkillRef(params)}@${params.version}`
			},
			rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS
		})
	});
}
async function installGitHubResolution(params) {
	return await withExtractedArchiveRoot({
		archivePath: params.archivePath,
		tempDirPrefix: "openclaw-skill-clawhub-github-",
		timeoutMs: 12e4,
		onExtracted: async (repoRoot) => await installExtractedSkillRoot({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			extractedRoot: resolveGitHubSkillSourceDir(repoRoot, params.sourcePath),
			mode: params.force ? "update" : "install",
			logger: params.logger,
			policy: {
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				installId: "clawhub",
				origin: {
					type: "clawhub",
					registry: params.registry,
					slug: params.slug,
					...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
					version: params.commit,
					repo: params.repo,
					path: params.sourcePath,
					commit: params.commit,
					...params.requestedReference ? { reference: params.requestedReference } : {},
					...params.trustState ? { trustState: params.trustState } : {}
				},
				source: {
					kind: "git",
					authority: params.authority,
					mutable: false,
					network: true
				},
				requestedSpecifier: params.requestedReference ?? `clawhub:${formatClawHubSkillRef(params)}@${params.commit}`
			},
			rootMarkers: CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS
		})
	});
}
function assertInstallResolutionAllowed(resolution) {
	if (!resolution.ok) {
		if (resolution.reason === "ambiguous_slug") {
			const message = resolution.message ? ` ${resolution.message}` : "";
			throw new Error(`Skill "${resolution.slug}" is ambiguous on ClawHub. Install an owner-qualified skill, for example: openclaw skills install @owner/${resolution.slug}.${message}`);
		}
		throw new Error(resolution.message || `Skill "${resolution.slug}" is not installable.`);
	}
	if (resolution.installKind !== "github") return resolution;
	const commit = normalizeGitHubCommitSegment(resolution.github.commit)?.toLowerCase();
	if (!commit) throw new Error(`Skill "${resolution.slug}" resolved to a mutable or invalid GitHub source ref; expected a full 40-character commit SHA.`);
	return {
		...resolution,
		github: {
			...resolution.github,
			commit
		}
	};
}
async function ensureClawHubSkillTrustAcknowledged(params) {
	if (params.skipClawHubTrustCheck) return { ok: true };
	const result = await ensureClawHubPackageTrustAcknowledged({
		subject: {
			kind: "skill",
			packageName: params.slug,
			workspaceDir: params.workspaceDir,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}
		},
		version: params.version,
		baseUrl: params.baseUrl,
		acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
		onClawHubRisk: params.onClawHubRisk,
		logger: params.logger,
		mode: params.force ? "update" : "install"
	});
	return result.ok ? {
		ok: true,
		...result.warning ? { warning: result.warning } : {}
	} : {
		ok: false,
		error: result.error,
		...result.code ? { code: result.code } : {},
		...result.warning ? { warning: result.warning } : {}
	};
}
async function performClawHubSkillInstall(params) {
	try {
		normalizeExpectedArtifactIntegrity(params.expectedIntegrity);
		const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
		const registry = resolveClawHubBaseUrl(params.baseUrl);
		if (!params.force && await pathExists(targetDir)) return {
			ok: false,
			error: `Skill already exists at ${targetDir}. Re-run with force/update.`
		};
		let version;
		let detail;
		let resolution;
		let trustWarning;
		let official = false;
		let archive;
		if (params.version) {
			const resolved = await resolveInstallVersion(params);
			detail = resolved.detail;
			version = resolved.version;
			official = isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				detail
			});
			const trust = await ensureClawHubSkillTrustAcknowledged({
				...params,
				version,
				skipClawHubTrustCheck: official
			});
			if (!trust.ok) return {
				...trust,
				version
			};
			trustWarning = trust.warning;
			params.logger?.info?.(`Downloading ${params.slug}@${version} from ClawHub…`);
			archive = await downloadClawHubSkillArchive({
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				version,
				baseUrl: params.baseUrl
			});
		} else {
			resolution = assertInstallResolutionAllowed(await fetchClawHubSkillInstallResolution({
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				baseUrl: params.baseUrl,
				...params.forceInstall ? { forceInstall: true } : {}
			}));
			if (params.requestedReference) {
				if (resolution.installKind !== "github" || resolution.trust?.state !== "not-scanned-by-clawhub") throw new Error(`Skill "${params.slug}" did not resolve to an unscanned, commit-pinned GitHub source.`);
				trustWarning = CLAWHUB_SKILLS_SH_TRUST_LABEL;
				params.logger?.warn?.(CLAWHUB_SKILLS_SH_TRUST_LABEL);
			}
			detail = isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				resolution
			}) ? void 0 : await fetchDefaultClawHubSkillDetailIfOfficial({
				baseUrl: params.baseUrl,
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {}
			});
			official = isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				detail,
				resolution
			});
			if (resolution.installKind === "github") {
				version = resolution.github.commit;
				params.logger?.info?.(`Downloading ${params.slug}@${version} from GitHub…`);
				archive = await downloadClawHubGitHubSkillArchive({
					repo: resolution.github.repo,
					commit: resolution.github.commit
				});
			} else {
				version = resolution.archive.version;
				const trust = await ensureClawHubSkillTrustAcknowledged({
					...params,
					version,
					skipClawHubTrustCheck: official
				});
				if (!trust.ok) return {
					...trust,
					version
				};
				trustWarning = trust.warning;
				params.logger?.info?.(`Downloading ${params.slug}@${version} from ClawHub…`);
				archive = await downloadClawHubSkillArchiveUrl({
					url: resolution.archive.downloadUrl,
					baseUrl: params.baseUrl
				});
			}
		}
		try {
			assertDownloadedArtifactIntegrity(archive, params.expectedIntegrity);
			if (!params.version && !resolution) throw new Error(`Skill "${params.slug}" has no install resolution.`);
			const install = resolution?.installKind === "github" && !params.version ? await installGitHubResolution({
				workspaceDir: params.workspaceDir,
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				sourcePath: resolution.github.path,
				archivePath: archive.archivePath,
				registry,
				authority: official ? "official" : "third-party",
				repo: resolution.github.repo,
				commit: resolution.github.commit,
				requestedReference: params.requestedReference,
				trustState: params.trustState,
				force: params.force,
				logger: params.logger,
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning
			}) : await installArchiveResolution({
				workspaceDir: params.workspaceDir,
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				version,
				archivePath: archive.archivePath,
				registry,
				authority: official ? "official" : isDefaultClawHubBaseUrl(params.baseUrl) ? "openclaw" : "third-party",
				force: params.force,
				logger: params.logger,
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning
			});
			if (!install.ok) return {
				ok: false,
				error: install.error
			};
			const installedAt = Date.now();
			const artifact = buildDownloadedArtifactLock(archive);
			const fileTreeSha256 = await digestClawHubSkillTree(install.targetDir);
			const verificationVersion = resolution?.installKind === "github" && !params.version ? void 0 : version;
			const [skillFile, verification] = await Promise.all([readInstalledSkillFileLock(install.targetDir), fetchInstallVerificationLock({
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				version: verificationVersion,
				baseUrl: params.baseUrl,
				logger: params.logger
			})]);
			const sourceUrl = (resolution?.installKind === "github" ? normalizeOptionalString(resolution.github.sourceUrl) : void 0) ?? readVerifiedClawHubSkillSourceUrl(verification?.provenance);
			const trackedMetadata = {
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				...params.trustState ? { trustState: params.trustState } : {},
				installedAt,
				...sourceUrl ? { sourceUrl } : {},
				artifact,
				...skillFile ? { skillFile } : {},
				fileTreeSha256
			};
			await writeClawHubSkillOrigin(install.targetDir, {
				version: 1,
				registry,
				slug: params.slug,
				...trackedMetadata,
				installedVersion: version
			});
			const lock = await readClawHubSkillsLockfile(params.workspaceDir);
			lock.skills[params.slug] = {
				version,
				registry,
				...trackedMetadata,
				...verification ? { verification } : {}
			};
			await writeClawHubSkillsLockfile(params.workspaceDir, lock);
			if (!params.clawManaged) markClawPackageIndependentlyOwned({
				kind: "skill",
				source: "clawhub",
				ref: formatClawHubSkillRef(params),
				version,
				workspace: params.workspaceDir
			});
			await reportClawHubSkillInstallTelemetry({
				baseUrl: params.baseUrl,
				slug: params.slug,
				...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
				version,
				...params.requestedReference ? { requestedReference: params.requestedReference } : {},
				...params.trustState ? { trustState: params.trustState } : {}
			}).catch(() => void 0);
			return {
				ok: true,
				slug: params.slug,
				version,
				targetDir: install.targetDir,
				...detail ? { detail } : {},
				...trustWarning ? { warning: trustWarning } : {}
			};
		} finally {
			await archive.cleanup().catch(() => void 0);
		}
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
//#region src/skills/lifecycle/clawhub-status.ts
const LOCAL_SKILL_CARD_FILENAME = "skill-card.md";
const LOCAL_SKILL_CARD_MAX_BYTES = 256 * 1024;
function readRealPathSync(candidate) {
	try {
		return fs.realpathSync.native(candidate);
	} catch {
		return;
	}
}
function invalidLink(reason, details) {
	return {
		status: "invalid",
		valid: false,
		reason,
		...details
	};
}
function resolveClawHubSkillStatusLinkSync(params) {
	const originRead = readClawHubSkillOriginStatusSync(params.skillDir);
	const lockRead = params.lockRead ?? readClawHubSkillsLockfileStatusSync(params.workspaceDir);
	const lockfileLabel = `${params.lockfileScope ?? "workspace"} ClawHub lockfile`;
	if (originRead.kind === "missing") {
		let trackedSlug;
		try {
			trackedSlug = normalizeTrackedSkillSlug(params.skillKey);
		} catch {
			return;
		}
		const locked = lockRead.kind === "found" ? lockRead.lock.skills[trackedSlug] : void 0;
		if (!locked) return;
		return invalidLink(`Skill "${trackedSlug}" is tracked by the ${lockfileLabel} but is missing local ClawHub origin metadata.`, {
			slug: trackedSlug,
			installedVersion: locked.version,
			installedAt: locked.installedAt,
			registry: normalizeStoredRegistry(locked.registry ?? resolveClawHubBaseUrl()),
			lockPath: lockRead.kind === "found" ? lockRead.path : void 0
		});
	}
	if (originRead.kind === "malformed") return invalidLink(`Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`, {
		originPath: originRead.path,
		lockPath: lockRead.kind === "found" ? lockRead.path : void 0
	});
	const originDetails = {
		registry: originRead.origin.registry,
		installedVersion: originRead.origin.installedVersion,
		installedAt: originRead.origin.installedAt,
		originPath: originRead.path
	};
	let trackedSlug;
	try {
		trackedSlug = normalizeTrackedSkillSlug(originRead.origin.slug);
	} catch (err) {
		return invalidLink(`Invalid ClawHub origin slug "${originRead.origin.slug}": ${formatErrorMessage(err)}`, {
			...originDetails,
			slug: originRead.origin.slug,
			lockPath: lockRead.kind === "found" ? lockRead.path : void 0
		});
	}
	if (lockRead.kind === "missing") return invalidLink(`Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`, {
		...originDetails,
		slug: trackedSlug
	});
	if (lockRead.kind === "malformed") return invalidLink(`Malformed ${lockfileLabel} at ${lockRead.path}: ${lockRead.error}`, {
		...originDetails,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	const locked = lockRead.lock.skills[trackedSlug];
	if (!locked) return invalidLink(`Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`, {
		...originDetails,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	const expectedSkillDir = readRealPathSync(resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug));
	if (!expectedSkillDir || readRealPathSync(params.skillDir) !== expectedSkillDir) return invalidLink(`Skill "${trackedSlug}" ClawHub origin metadata is not in the expected ClawHub install directory.`, {
		...originDetails,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	const originRegistry = normalizeStoredRegistry(originRead.origin.registry);
	const lockedRegistry = locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
	const sourceUrl = normalizeOptionalString(locked.sourceUrl);
	const ownerHandle = normalizeOptionalString(locked.ownerHandle);
	const requestedReference = normalizeOptionalString(locked.requestedReference);
	const trustState = locked.trustState === "not-scanned-by-clawhub" ? CLAWHUB_SKILLS_SH_TRUST_STATE : void 0;
	const artifact = normalizeDownloadedArtifactLock(locked.artifact);
	const skillFile = normalizeSkillFileLock(locked.skillFile);
	const fileTreeSha256 = normalizeOptionalString(locked.fileTreeSha256);
	const provenanceMatches = originRead.origin.ownerHandle === ownerHandle && originRead.origin.requestedReference === requestedReference && originRead.origin.trustState === trustState && originRead.origin.sourceUrl === sourceUrl && originRead.origin.artifact?.kind === artifact?.kind && originRead.origin.artifact?.sha256 === artifact?.sha256 && originRead.origin.artifact?.integrity === artifact?.integrity && originRead.origin.skillFile?.path === skillFile?.path && originRead.origin.skillFile?.sha256 === skillFile?.sha256 && originRead.origin.fileTreeSha256 === fileTreeSha256;
	if (locked.version !== originRead.origin.installedVersion || locked.installedAt !== originRead.origin.installedAt || lockedRegistry !== originRegistry || !provenanceMatches) return invalidLink(`Skill "${trackedSlug}" ClawHub origin metadata does not match the ${lockfileLabel}.`, {
		...originDetails,
		registry: lockedRegistry,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	return {
		status: "linked",
		valid: true,
		registry: lockedRegistry,
		slug: trackedSlug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		installedVersion: locked.version,
		installedAt: locked.installedAt,
		originPath: originRead.path,
		lockPath: lockRead.path,
		...sourceUrl ? { sourceUrl } : {},
		...artifact ? { artifact } : {},
		...skillFile ? { skillFile } : {},
		...fileTreeSha256 ? { fileTreeSha256 } : {}
	};
}
function isPathInsideDir(child, parent) {
	const relative = path.relative(parent, child);
	return relative === "" || relative.length > 0 && !relative.startsWith("..") && !path.isAbsolute(relative);
}
function readLocalSkillCardSync(skillDir, includeContent = false) {
	const cardPath = path.join(skillDir, LOCAL_SKILL_CARD_FILENAME);
	let lstat;
	try {
		lstat = fs.lstatSync(cardPath);
	} catch {
		return;
	}
	if (!lstat.isFile() || lstat.size > LOCAL_SKILL_CARD_MAX_BYTES) return;
	let fd;
	try {
		const rootRealPath = fs.realpathSync.native(skillDir);
		if (!isPathInsideDir(fs.realpathSync.native(cardPath), rootRealPath)) return;
		fd = fs.openSync(cardPath, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
		const fdStat = fs.fstatSync(fd);
		if (!fdStat.isFile() || fdStat.size > LOCAL_SKILL_CARD_MAX_BYTES) return;
		const result = {
			present: true,
			path: cardPath,
			sizeBytes: fdStat.size
		};
		if (includeContent) result.content = fs.readFileSync(fd, "utf8");
		return result;
	} catch {
		return;
	} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function resolveLocalSkillCardStatusSync(skillDir) {
	return readLocalSkillCardSync(skillDir);
}
function readLocalSkillCardContentSync(skillDir) {
	return readLocalSkillCardSync(skillDir, true)?.content;
}
function normalizeOptionalSelector(value) {
	return value?.trim() || void 0;
}
async function searchSkillsFromClawHub(params) {
	return await searchClawHubSkills({
		query: params.query?.trim() || "*",
		limit: params.limit,
		baseUrl: params.baseUrl
	});
}
async function resolveClawHubSkillVerificationTarget(params) {
	try {
		const version = normalizeOptionalSelector(params.version);
		const tag = normalizeOptionalSelector(params.tag);
		if (version && tag) return {
			ok: false,
			error: "Use either --version or --tag."
		};
		const requestedRef = parseRequestedClawHubSkillRef(params.slug);
		if (requestedRef.requestedReference && (version || tag)) return {
			ok: false,
			error: "--version and --tag are not supported for skills-sh references."
		};
		const trackedSlug = requestedRef.slug;
		const skillDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug);
		const originRead = await readClawHubSkillOriginStrict(skillDir);
		if (originRead.kind === "malformed") return {
			ok: false,
			error: `Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`
		};
		if (originRead.kind === "found") {
			const locked = (await readClawHubSkillsLockfile(params.workspaceDir)).skills[trackedSlug];
			if (!locked) return {
				ok: false,
				error: `Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			if (normalizeTrackedSkillSlug(originRead.origin.slug) !== trackedSlug) return {
				ok: false,
				error: `Skill "${trackedSlug}" has ClawHub origin metadata for "${originRead.origin.slug}". Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			const originRegistry = normalizeStoredRegistry(originRead.origin.registry);
			const lockedRegistry = locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
			const ownerHandle = normalizeOptionalString(locked.ownerHandle);
			const requestedReference = normalizeOptionalString(locked.requestedReference);
			const trustState = locked.trustState === "not-scanned-by-clawhub" ? CLAWHUB_SKILLS_SH_TRUST_STATE : void 0;
			if (locked.version !== originRead.origin.installedVersion || locked.installedAt !== originRead.origin.installedAt || lockedRegistry !== originRegistry || originRead.origin.ownerHandle !== ownerHandle || originRead.origin.requestedReference !== requestedReference || originRead.origin.trustState !== trustState) return {
				ok: false,
				error: `Skill "${trackedSlug}" ClawHub origin metadata does not match the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			if (requestedReference && (version || tag)) return {
				ok: false,
				error: "--version and --tag are not supported for skills-sh references."
			};
			if (requestedRef.ownerHandle && ownerHandle !== requestedRef.ownerHandle) return {
				ok: false,
				error: `Skill "${trackedSlug}" is tracked as ${ownerHandle ? `@${ownerHandle}/${trackedSlug}` : trackedSlug}, not @${requestedRef.ownerHandle}/${trackedSlug}.`
			};
			if (requestedRef.requestedReference && requestedReference !== requestedRef.requestedReference) return {
				ok: false,
				error: `Skill "${trackedSlug}" is not tracked from ${requestedRef.requestedReference}.`
			};
			const selector = version ? "version" : tag ? "tag" : "installed-version";
			const verificationVersion = requestedReference ? void 0 : version ?? (tag ? void 0 : locked.version);
			return {
				ok: true,
				slug: trackedSlug,
				...ownerHandle ? { ownerHandle } : {},
				...requestedReference ? { requestedReference } : {},
				...trustState ? { trustState } : {},
				baseUrl: lockedRegistry,
				version: verificationVersion,
				tag: requestedReference ? void 0 : tag,
				resolution: {
					source: "installed",
					selector,
					registry: lockedRegistry,
					skillDir,
					installedVersion: locked.version
				}
			};
		}
		const lockRead = readClawHubSkillsLockfileStatusSync(params.workspaceDir);
		if (lockRead.kind === "malformed") return {
			ok: false,
			error: `Malformed workspace ClawHub lockfile at ${lockRead.path}: ${lockRead.error}`
		};
		if (lockRead.kind === "found" && lockRead.lock.skills[trackedSlug]) return {
			ok: false,
			error: `Skill "${trackedSlug}" is tracked by the workspace ClawHub lockfile but is missing ClawHub origin metadata. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
		};
		const registry = resolveClawHubBaseUrl(params.baseUrl);
		const selector = version ? "version" : tag ? "tag" : "latest";
		return {
			ok: true,
			slug: requestedRef.slug,
			...requestedRef.ownerHandle ? { ownerHandle: requestedRef.ownerHandle } : {},
			...requestedRef.requestedReference ? { requestedReference: requestedRef.requestedReference } : {},
			...requestedRef.trustState ? { trustState: requestedRef.trustState } : {},
			baseUrl: registry,
			version,
			tag,
			resolution: {
				source: "registry",
				selector,
				registry,
				skillDir: void 0,
				installedVersion: void 0
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
//#region src/skills/lifecycle/clawhub.ts
async function resolveRequestedUpdateSlug(params) {
	const requested = params.requestedSlug.trim();
	const requestedRef = requested.startsWith("@") || requested.startsWith("skills-sh:") ? parseRequestedClawHubSkillRef(requested) : { slug: normalizeTrackedSkillSlug(requested) };
	const trackedSlug = requestedRef.slug;
	const trackedOrigin = await readClawHubSkillOrigin(resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug));
	const trackedLockEntry = params.lock.skills[trackedSlug];
	if (!trackedOrigin && !trackedLockEntry) return validateRequestedSkillSlug(requestedRef.slug);
	const trackedOwnerHandle = trackedOrigin?.ownerHandle ?? trackedLockEntry?.ownerHandle;
	if (requestedRef.ownerHandle && trackedOwnerHandle !== requestedRef.ownerHandle) {
		const trackedRef = trackedOwnerHandle ? `@${trackedOwnerHandle}/${trackedSlug}` : trackedSlug;
		throw new Error(`Skill "${trackedSlug}" is tracked as ${trackedRef}, not @${requestedRef.ownerHandle}/${trackedSlug}.`);
	}
	const trackedRequestedReference = trackedOrigin?.requestedReference ?? trackedLockEntry?.requestedReference;
	if (requestedRef.requestedReference && trackedRequestedReference !== requestedRef.requestedReference) throw new Error(`Skill "${trackedSlug}" is not tracked from ${requestedRef.requestedReference}.`);
	return trackedSlug;
}
async function installRequestedSkillFromClawHub(params) {
	try {
		const ref = parseRequestedClawHubSkillRef(params.slug);
		if (ref.requestedReference && params.version) throw new Error("--version is not supported for skills-sh references.");
		return await performClawHubSkillInstall({
			...params,
			slug: ref.slug,
			...ref.ownerHandle ? { ownerHandle: ref.ownerHandle } : {},
			...ref.requestedReference ? { requestedReference: ref.requestedReference } : {},
			...ref.trustState ? { trustState: ref.trustState } : {}
		});
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
async function installTrackedSkillFromClawHub(params) {
	try {
		return await performClawHubSkillInstall({
			...params,
			slug: normalizeTrackedSkillSlug(params.slug)
		});
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
async function preflightSkillOwnerState(params) {
	const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.requested.slug);
	if (!await pathExists(targetDir)) return {
		ok: true,
		action: "install",
		integrity: params.integrity
	};
	const status = resolveClawHubSkillStatusLinkSync({
		workspaceDir: params.workspaceDir,
		skillDir: targetDir,
		skillKey: params.requested.slug
	});
	if (status?.status === "linked" && status.installedVersion === params.version && status.ownerHandle === params.requested.ownerHandle && status.artifact?.integrity === params.integrity) return {
		ok: true,
		action: "reuse",
		integrity: params.integrity
	};
	return {
		ok: false,
		code: "skill_version_conflict",
		error: `Skill ${params.requestedLabel}@${params.version} conflicts with the existing workspace skill at ${targetDir}.`
	};
}
async function preflightSkillFromClawHub(params) {
	try {
		const requested = parseRequestedClawHubSkillRef(params.slug);
		const resolved = await resolveInstallVersion({
			slug: requested.slug,
			...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {},
			version: params.version,
			baseUrl: params.baseUrl
		});
		if (resolved.version !== params.version) return {
			ok: false,
			code: "skill_version_resolution_mismatch",
			error: `Skill ${params.slug}@${params.version} resolved to ${resolved.version}.`
		};
		const trust = await ensureClawHubSkillTrustAcknowledged({
			workspaceDir: params.workspaceDir,
			slug: requested.slug,
			...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {},
			version: resolved.version,
			baseUrl: params.baseUrl,
			acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
			onClawHubRisk: params.onClawHubRisk,
			logger: params.logger,
			skipClawHubTrustCheck: isDefaultOfficialClawHubSkillSource({
				baseUrl: params.baseUrl,
				detail: resolved.detail
			})
		});
		if (!trust.ok) return {
			ok: false,
			code: trust.code ?? "skill_trust_required",
			error: trust.error
		};
		if (params.expectedIntegrity) {
			const integrity = normalizeExpectedArtifactIntegrity(params.expectedIntegrity);
			const owner = await preflightSkillOwnerState({
				workspaceDir: params.workspaceDir,
				requested,
				requestedLabel: params.slug,
				version: resolved.version,
				integrity
			});
			return owner.ok && trust.warning ? {
				...owner,
				warning: trust.warning
			} : owner;
		}
		const archive = await downloadClawHubSkillArchive({
			slug: requested.slug,
			...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {},
			version: resolved.version,
			baseUrl: params.baseUrl
		});
		try {
			const integrity = normalizeClawHubSha256Integrity(archive.integrity);
			if (!integrity) return {
				ok: false,
				code: "skill_integrity_unavailable",
				error: `Skill ${params.slug}@${params.version} did not resolve a valid artifact integrity.`
			};
			const owner = await preflightSkillOwnerState({
				workspaceDir: params.workspaceDir,
				requested,
				requestedLabel: params.slug,
				version: resolved.version,
				integrity
			});
			return owner.ok && trust.warning ? {
				...owner,
				warning: trust.warning
			} : owner;
		} finally {
			await archive.cleanup().catch(() => void 0);
		}
	} catch (err) {
		return {
			ok: false,
			code: "skill_preflight_failed",
			error: formatErrorMessage(err)
		};
	}
}
async function resolveTrackedUpdateTarget(params) {
	const origin = await readClawHubSkillOrigin(resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug));
	const lockEntry = params.lock.skills[params.slug];
	if (!origin && !lockEntry) return {
		ok: false,
		slug: params.slug,
		error: `Skill "${params.slug}" is not tracked as a ClawHub install.`
	};
	const ownerHandle = origin?.ownerHandle ?? lockEntry?.ownerHandle;
	const requestedReference = origin?.requestedReference ?? lockEntry?.requestedReference;
	const trustState = origin?.trustState ?? lockEntry?.trustState;
	return {
		ok: true,
		slug: params.slug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		baseUrl: origin?.registry ?? params.baseUrl,
		previousVersion: origin?.installedVersion ?? lockEntry?.version ?? null
	};
}
async function installSkillFromClawHub(params) {
	if (params.clawManaged) return await installRequestedSkillFromClawHub(params);
	return await withClawPackageLifecycleLease({
		kind: "skill",
		source: "clawhub",
		ref: params.slug,
		workspace: params.workspaceDir
	}, () => installRequestedSkillFromClawHub(params));
}
async function updateSkillsFromClawHub(params) {
	const lock = await readClawHubSkillsLockfile(params.workspaceDir);
	const slugs = params.slug ? [await resolveRequestedUpdateSlug({
		workspaceDir: params.workspaceDir,
		requestedSlug: params.slug,
		lock
	})] : Object.keys(lock.skills).map((slug) => normalizeTrackedSkillSlug(slug));
	const results = [];
	for (const slug of slugs) {
		const tracked = await resolveTrackedUpdateTarget({
			workspaceDir: params.workspaceDir,
			slug,
			lock,
			baseUrl: params.baseUrl
		});
		if (!tracked.ok) {
			results.push({
				ok: false,
				error: tracked.error
			});
			continue;
		}
		const install = await withClawPackageLifecycleLease({
			kind: "skill",
			source: "clawhub",
			ref: tracked.slug,
			workspace: params.workspaceDir
		}, () => installTrackedSkillFromClawHub({
			workspaceDir: params.workspaceDir,
			slug: tracked.slug,
			...tracked.ownerHandle ? { ownerHandle: tracked.ownerHandle } : {},
			...tracked.requestedReference ? { requestedReference: tracked.requestedReference } : {},
			...tracked.trustState ? { trustState: tracked.trustState } : {},
			baseUrl: tracked.baseUrl,
			force: true,
			forceInstall: params.forceInstall,
			acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
			onClawHubRisk: params.onClawHubRisk,
			logger: params.logger,
			config: params.config,
			onInstallPolicyWarning: params.onInstallPolicyWarning
		}), { required: true });
		results.push(install.ok ? {
			ok: true,
			slug: tracked.slug,
			previousVersion: tracked.previousVersion,
			version: install.version,
			changed: tracked.previousVersion !== install.version,
			targetDir: install.targetDir,
			...install.warning ? { warning: install.warning } : {}
		} : install);
	}
	return results;
}
//#endregion
export { snapshotCommittedSkillArtifactBestEffort as S, installSkillArchiveFromPath as _, resolveClawHubSkillStatusLinkSync as a, dispatchCommittedSkillChangeBestEffort as b, searchSkillsFromClawHub as c, formatClawHubSkillRef as d, parseRequestedClawHubSkillRef as f, installExtractedSkillRoot as g, untrackClawHubSkill as h, readLocalSkillCardContentSync as i, readVerifiedClawHubSkillSourceUrl as l, readTrackedClawHubSkillSlugs as m, preflightSkillFromClawHub as n, resolveClawHubSkillVerificationTarget as o, readClawHubSkillsLockfileStatusSync as p, updateSkillsFromClawHub as r, resolveLocalSkillCardStatusSync as s, installSkillFromClawHub as t, digestClawHubSkillTree as u, resolveWorkspaceSkillInstallDir as v, hasCommittedSkillChangeHooks as x, validateRequestedSkillSlug as y };
