import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { s as pathExists } from "./absolute-path-CYFPfAjt.js";
import "./fs-safe-CmrQUApq.js";
import { i as resolveSafeInstallDir } from "./install-safe-path-DQTxRazZ.js";
import "./path-guards-CQoZeoCG.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { c as tryReadJson, r as readJsonIfExists, u as writeJson } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { a as sha256Hex } from "./crypto-digest-IGAbV2KW.js";
import { y as resolveClawHubBaseUrl } from "./clawhub-client-Cjweitq0.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CDBq1X4a.js";
import { t as parseSkillFrontmatter } from "./frontmatter-BUnBwW_N.js";
import { r as CLAWHUB_SKILLS_SH_TRUST_STATE, t as CLAWHUB_SKILLS_SH_REF_PREFIX, u as searchClawHubSkills } from "./clawhub-skills-BG8u4JTN.js";
import { n as withExtractedArchiveRoot } from "./install-flow-BwXj3nrc.js";
import { t as installPackageDir } from "./install-package-dir-B1M2mVjW.js";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-DYdPdGDr.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
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
		const onAfterBackup = params.onAfterBackup;
		let backupBlocked = false;
		const install = await installPackageDir({
			sourceDir: params.extractedRoot,
			targetDir,
			mode: effectiveMode,
			timeoutMs: params.timeoutMs ?? 12e4,
			logger: params.logger,
			copyErrorPrefix: "failed to install skill",
			hasDeps: false,
			depsLogMessage: "",
			...onAfterBackup ? { afterBackup: async (backupDir) => {
				const blocked = await onAfterBackup(backupDir);
				backupBlocked = Boolean(blocked);
				return blocked ? {
					ok: false,
					error: blocked
				} : { ok: true };
			} } : {}
		});
		if (!install.ok) return installFailure(install.error, backupBlocked ? "invalid-request" : "unavailable");
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
		const parts = value.slice(CLAWHUB_SKILLS_SH_REF_PREFIX.length).split("/");
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
		if (!isPathInside(fs.realpathSync.native(skillDir), fs.realpathSync.native(cardPath))) return;
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
//#region src/skills/lifecycle/clawhub-uninstall.ts
async function planClawHubSkillUninstall(params) {
	let requestedRef;
	try {
		requestedRef = parseRequestedClawHubSkillRef(params.slug);
	} catch (error) {
		return {
			ok: false,
			code: "ambiguous",
			error: String(error)
		};
	}
	return await planTrackedClawHubSkillState({
		workspaceDir: params.workspaceDir,
		requestedRef,
		expectedVersion: params.expectedVersion
	});
}
async function planTrackedClawHubSkillState(params) {
	const requestedRef = params.requestedRef;
	const slug = requestedRef.slug;
	const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, slug);
	const link = resolveClawHubSkillStatusLinkSync({
		workspaceDir: params.workspaceDir,
		skillDir: targetDir,
		skillKey: slug
	});
	if (!link) return {
		ok: false,
		code: "missing",
		error: `Skill ${JSON.stringify(slug)} is not a tracked ClawHub install.`
	};
	if (!link.valid || !link.skillFile || !link.fileTreeSha256) return {
		ok: false,
		code: "ambiguous",
		error: link.valid ? `Skill ${JSON.stringify(slug)} was installed before OpenClaw recorded file fingerprints, so local changes cannot be detected.` : link.reason
	};
	if (requestedRef.ownerHandle && link.ownerHandle !== requestedRef.ownerHandle) {
		const trackedRef = link.ownerHandle ? `@${link.ownerHandle}/${slug}` : slug;
		return {
			ok: false,
			code: "ambiguous",
			error: `Skill ${JSON.stringify(slug)} is tracked as ${trackedRef}, not @${requestedRef.ownerHandle}/${slug}.`
		};
	}
	if (requestedRef.requestedReference && link.requestedReference !== requestedRef.requestedReference) return {
		ok: false,
		code: "ambiguous",
		error: `Skill ${JSON.stringify(slug)} is not tracked from ${requestedRef.requestedReference}.`
	};
	if (link.installedVersion !== params.expectedVersion) return {
		ok: false,
		code: "modified",
		error: `Skill ${JSON.stringify(slug)} is at ${link.installedVersion}, expected ${params.expectedVersion}.`
	};
	const skillFilePath = path.join(targetDir, link.skillFile.path);
	let content;
	try {
		const stat = await fs$1.lstat(targetDir);
		if (!stat.isDirectory() || stat.isSymbolicLink()) return {
			ok: false,
			code: "ambiguous",
			error: `Skill ${JSON.stringify(slug)} is not a regular managed directory.`
		};
		content = await fs$1.readFile(skillFilePath);
	} catch (error) {
		return {
			ok: false,
			code: "missing",
			error: String(error)
		};
	}
	if (sha256Hex(content) !== link.skillFile.sha256) return {
		ok: false,
		code: "modified",
		error: `Skill ${JSON.stringify(slug)} has local SKILL.md changes.`
	};
	let fileTreeSha256;
	try {
		fileTreeSha256 = await digestClawHubSkillTree(targetDir);
	} catch (error) {
		return {
			ok: false,
			code: "ambiguous",
			error: String(error)
		};
	}
	if (fileTreeSha256 !== link.fileTreeSha256) return {
		ok: false,
		code: "modified",
		error: `Skill ${JSON.stringify(slug)} has local file changes.`
	};
	return {
		ok: true,
		plan: {
			workspaceDir: params.workspaceDir,
			requestedRef: requestedRef.requestedReference ?? formatClawHubSkillRef(requestedRef),
			slug,
			version: link.installedVersion,
			installedAt: link.installedAt,
			targetDir,
			skillFilePath: link.skillFile.path,
			skillFileSha256: link.skillFile.sha256,
			fileTreeSha256
		}
	};
}
async function checkClawHubSkillPlanAtPath(plan, skillDir, readFile = fs$1.readFile) {
	try {
		const stat = await fs$1.lstat(skillDir);
		if (!stat.isDirectory() || stat.isSymbolicLink()) return {
			ok: false,
			error: `Skill ${JSON.stringify(plan.slug)} changed during update.`
		};
		if (sha256Hex(await readFile(path.join(skillDir, plan.skillFilePath))) !== plan.skillFileSha256 || await digestClawHubSkillTree(skillDir) !== plan.fileTreeSha256) return {
			ok: false,
			error: `Skill ${JSON.stringify(plan.slug)} changed during update.`
		};
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: String(error)
		};
	}
}
async function applyClawHubSkillUninstall(plan, deps = {}) {
	const current = await planClawHubSkillUninstall({
		workspaceDir: plan.workspaceDir,
		slug: plan.requestedRef,
		expectedVersion: plan.version
	});
	if (!current.ok) return {
		ok: false,
		error: current.error
	};
	const shouldDispatchChange = hasCommittedSkillChangeHooks();
	const before = shouldDispatchChange ? await snapshotCommittedSkillArtifactBestEffort({
		skillDir: plan.targetDir,
		skillKey: plan.slug,
		source: "clawhub",
		sourceVersion: plan.version
	}) : void 0;
	const stagedDir = `${plan.targetDir}.openclaw-skill-remove-${randomUUID()}`;
	let staged = false;
	let restoreTracking;
	const rename = deps.rename ?? fs$1.rename;
	try {
		await rename(plan.targetDir, stagedDir);
		staged = true;
		if (!(await checkClawHubSkillPlanAtPath(plan, stagedDir, deps.readFile ?? fs$1.readFile)).ok) {
			await rename(stagedDir, plan.targetDir);
			return {
				ok: false,
				error: `Skill ${JSON.stringify(plan.slug)} changed during removal.`
			};
		}
		restoreTracking = await (deps.untrack ?? untrackClawHubSkill)(plan.workspaceDir, plan.slug);
		await (deps.removeDir ?? fs$1.rm)(stagedDir, {
			recursive: true,
			force: false
		});
		if (shouldDispatchChange) await dispatchCommittedSkillChangeBestEffort({
			action: "removed",
			source: "clawhub",
			workspaceDir: plan.workspaceDir,
			before
		});
		return { ok: true };
	} catch (error) {
		const rollbackErrors = [];
		try {
			await restoreTracking?.();
		} catch (rollbackError) {
			rollbackErrors.push(`could not restore lockfile: ${String(rollbackError)}`);
		}
		if (staged) try {
			await rename(stagedDir, plan.targetDir);
		} catch (rollbackError) {
			rollbackErrors.push(`could not restore skill directory: ${String(rollbackError)}`);
		}
		return {
			ok: false,
			error: `${String(error)}${rollbackErrors.length > 0 ? `; rollback incomplete: ${rollbackErrors.join("; ")}` : ""}`
		};
	}
}
//#endregion
export { installSkillArchiveFromPath as C, dispatchCommittedSkillChangeBestEffort as D, validateRequestedSkillSlug as E, hasCommittedSkillChangeHooks as O, installExtractedSkillRoot as S, resolveWorkspaceSkillInstallDir as T, readTrackedClawHubSkillSlugs as _, readLocalSkillCardContentSync as a, writeClawHubSkillsLockfile as b, resolveLocalSkillCardStatusSync as c, formatClawHubSkillRef as d, normalizeGitHubCommitSegment as f, readClawHubSkillsLockfileStatusSync as g, readClawHubSkillsLockfile as h, planTrackedClawHubSkillState as i, snapshotCommittedSkillArtifactBestEffort as k, searchSkillsFromClawHub as l, readClawHubSkillOrigin as m, checkClawHubSkillPlanAtPath as n, resolveClawHubSkillStatusLinkSync as o, parseRequestedClawHubSkillRef as p, planClawHubSkillUninstall as r, resolveClawHubSkillVerificationTarget as s, applyClawHubSkillUninstall as t, digestClawHubSkillTree as u, untrackClawHubSkill as v, normalizeTrackedSkillSlug as w, CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS as x, writeClawHubSkillOrigin as y };
