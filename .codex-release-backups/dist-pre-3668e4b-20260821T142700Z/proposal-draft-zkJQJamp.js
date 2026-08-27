import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { s as pathExists } from "./absolute-path-DBVN5h2m.js";
import { o as walkDirectory, r as root } from "./fs-safe-X_oyl7Rx.js";
import { r as readLocalFileSafely } from "./root-impl-DNOINk8h.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { s as normalizeWorkspaceSkillSupportPath, t as MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES } from "./workspace-skill-write-easKKFn3.js";
import { G as renderProposalMarkdown, K as stripProposalFrontmatterForSkill, L as hashSkillProposalContent, r as prepareSkillProposalSupportFiles } from "./store-B-ZL-1gP.js";
import { a as scanSource, i as scanSkillContent } from "./scanner-p4YTNBFA.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/workshop/proposal-bundle.ts
const MAX_EVALUATION_FILES = 256;
const MAX_EVALUATION_FILE_BYTES = 1024 * 1024;
const MAX_EVALUATION_BUNDLE_BYTES = 8 * 1024 * 1024;
const EXCLUDED_ROOT_DIRS = /* @__PURE__ */ new Set([
	".clawhub",
	".clawdhub",
	".openclaw"
]);
async function buildSkillProposalEvaluationBundles(params) {
	const targetFiles = await readSkillTreeFiles(params.proposal.record.target.skillDir);
	const targetTreeSha256 = hashSkillTree(targetFiles);
	const skillMdPath = params.proposal.record.kind === "create" ? "SKILL.md" : resolveTargetSkillRelativePath(params.proposal, targetFiles, { recordedTargetExists: await pathExists(params.proposal.record.target.skillFile) });
	const candidateSkillMd = fileFromBuffer(skillMdPath, Buffer.from(stripProposalFrontmatterForSkill(params.proposal.content), "utf8"));
	const proposedFiles = params.supportFiles.map((file) => fileFromBuffer(file.path, Buffer.from(file.content, "utf8")));
	const candidateFiles = new Map(targetFiles.map((file) => [file.path, file]));
	if (params.proposal.record.kind === "create") {
		if (await pathExists(params.proposal.record.target.skillFile)) throw new Error(`Target skill already exists: ${params.proposal.record.target.skillFile}`);
		candidateFiles.set(candidateSkillMd.path, candidateSkillMd);
		for (const file of proposedFiles) {
			const targetFile = path.join(params.proposal.record.target.skillDir, file.path);
			if (await pathExists(targetFile)) throw new Error(`Target support file already exists: ${targetFile}`);
			candidateFiles.set(file.path, file);
		}
		return {
			candidate: snapshotFromFiles([...candidateFiles.values()], skillMdPath),
			targetTreeSha256
		};
	}
	const baseline = snapshotFromFiles(targetFiles, skillMdPath);
	candidateFiles.set(candidateSkillMd.path, candidateSkillMd);
	for (const file of proposedFiles) candidateFiles.set(file.path, file);
	return {
		baseline,
		candidate: snapshotFromFiles([...candidateFiles.values()], skillMdPath),
		targetTreeSha256
	};
}
async function readSkillProposalTargetTreeSha256(skillDir) {
	return hashSkillTree(await readSkillTreeFiles(skillDir));
}
async function readSkillTreeFiles(skillDir) {
	if (!await pathExists(skillDir)) return [];
	const scanned = await walkDirectory(skillDir, {
		maxDepth: 16,
		maxEntries: MAX_EVALUATION_FILES * 2,
		symlinks: "include"
	});
	if (scanned.truncated) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_FILES} files.`);
	const skillRoot = await root(skillDir);
	const files = [];
	let totalBytes = 0;
	for (const entry of scanned.entries.toSorted((a, b) => a.relativePath.localeCompare(b.relativePath))) {
		const portablePath = entry.relativePath.split(path.sep).join("/");
		if (!portablePath || EXCLUDED_ROOT_DIRS.has(portablePath.split("/")[0] ?? "") || entry.kind === "directory") continue;
		if (entry.kind !== "file") throw new Error(`Skill evaluation bundle contains unsupported entry: ${portablePath}`);
		const read = await skillRoot.read(entry.relativePath, {
			hardlinks: "reject",
			maxBytes: MAX_EVALUATION_FILE_BYTES,
			symlinks: "reject"
		});
		totalBytes += read.buffer.byteLength;
		if (totalBytes > MAX_EVALUATION_BUNDLE_BYTES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_BUNDLE_BYTES} total bytes.`);
		files.push(fileFromBuffer(portablePath, read.buffer));
	}
	return files;
}
function fileFromBuffer(relativePath, content) {
	const utf8 = content.toString("utf8");
	const isUtf8 = !utf8.includes("\0") && Buffer.from(utf8, "utf8").equals(content);
	return {
		path: relativePath,
		content: isUtf8 ? utf8 : content.toString("base64"),
		encoding: isUtf8 ? "utf8" : "base64",
		sha256: sha256Hex(content),
		sizeBytes: content.byteLength
	};
}
function snapshotFromFiles(inputFiles, skillMdPath) {
	const files = inputFiles.toSorted((a, b) => a.path.localeCompare(b.path));
	assertEvaluationBundleWithinLimits(files);
	const skillMd = files.find((file) => file.path === skillMdPath);
	if (!skillMd) throw new Error(`Skill evaluation bundle is missing ${skillMdPath}.`);
	return {
		skillMd,
		files: files.filter((file) => file.path !== skillMdPath),
		treeSha256: hashSkillTree(files)
	};
}
function assertEvaluationBundleWithinLimits(files) {
	if (files.length > MAX_EVALUATION_FILES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_FILES} files.`);
	let totalBytes = 0;
	for (const file of files) {
		if (file.sizeBytes > MAX_EVALUATION_FILE_BYTES) throw new Error(`Skill evaluation bundle file exceeds ${MAX_EVALUATION_FILE_BYTES} bytes: ${file.path}.`);
		totalBytes += file.sizeBytes;
	}
	if (totalBytes > MAX_EVALUATION_BUNDLE_BYTES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_BUNDLE_BYTES} total bytes.`);
}
function hashSkillTree(files) {
	return sha256Hex(JSON.stringify(files.toSorted((a, b) => a.path.localeCompare(b.path)).map((file) => ({
		path: file.path,
		sha256: file.sha256,
		sizeBytes: file.sizeBytes
	}))));
}
function resolveTargetSkillRelativePath(proposal, targetFiles, options) {
	const relativePath = path.relative(path.resolve(proposal.record.target.skillDir), path.resolve(proposal.record.target.skillFile));
	if (!relativePath || path.isAbsolute(relativePath) || relativePath.startsWith(`..${path.sep}`)) throw new Error("Skill evaluation target file must be inside the skill directory.");
	const portablePath = relativePath.split(path.sep).join("/");
	if (targetFiles.some((file) => file.path === portablePath)) return portablePath;
	if (!options.recordedTargetExists) return portablePath;
	const caseMatches = targetFiles.filter((file) => file.path.toLowerCase() === portablePath.toLowerCase());
	if (caseMatches.length === 1) return caseMatches[0].path;
	if (caseMatches.length > 1) throw new Error(`Skill evaluation target filename is ambiguous: ${portablePath}.`);
	return portablePath;
}
//#endregion
//#region src/skills/workshop/proposal-scan.ts
function scanProposalBundle(content, supportFiles = [], metadata = []) {
	const scannedAt = (/* @__PURE__ */ new Date()).toISOString();
	const findings = [
		...scanSkillContent(content, "PROPOSAL.md"),
		...scanSource(content, "PROPOSAL.md"),
		...supportFiles.flatMap((file) => [
			...scanSkillContent(file.path, "support-file-path").filter((finding) => finding.ruleId === "literal-secret"),
			...scanSkillContent(file.content, file.path),
			...scanSource(file.content, file.path)
		]),
		...metadata.flatMap((entry) => entry.content ? scanSkillContent(entry.content, entry.file).filter((finding) => finding.ruleId === "literal-secret") : [])
	];
	const critical = findings.filter((finding) => finding.severity === "critical").length;
	const warn = findings.filter((finding) => finding.severity === "warn").length;
	const info = findings.filter((finding) => finding.severity === "info").length;
	return {
		state: critical > 0 ? "failed" : "clean",
		scannedAt,
		critical,
		warn,
		info,
		findings
	};
}
function assertProposalContainsNoLiteralSecrets(scan) {
	const finding = scan.findings.find((entry) => entry.ruleId === "literal-secret");
	if (!finding) return;
	throw new Error(`Skill proposal contains a recognized literal credential in ${finding.file}; replace it with a SecretRef or placeholder.`);
}
//#endregion
//#region src/skills/workshop/proposal-draft.ts
const MAX_PROPOSAL_DRAFT_BYTES = 1024 * 1024;
const MAX_PROPOSAL_DIRECTORY_ENTRIES = 256;
const MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES = 160;
function prepareSkillProposalDraft(input) {
	try {
		assertProposalDescriptionWithinLimit(input.description);
		assertProposalContentWithinLimit(input.content, input.maxSkillBytes);
		const supportFiles = prepareSkillProposalSupportFiles(input.supportFiles);
		const content = renderProposalMarkdown({
			name: input.name,
			description: input.description,
			content: input.content,
			fallbackFrontmatterContent: input.fallbackFrontmatterContent,
			version: input.version,
			date: input.date
		});
		const goal = normalizeOptionalString(input.goal);
		const evidence = normalizeOptionalString(input.evidence);
		const scan = scanProposalBundle(content, supportFiles, [
			...input.secretScanMetadata ?? [],
			{
				file: "description",
				content: input.description
			},
			{
				file: "goal",
				content: goal
			},
			{
				file: "evidence",
				content: evidence
			}
		]);
		assertProposalContainsNoLiteralSecrets(scan);
		return ok({
			content,
			description: input.description,
			draftHash: hashSkillProposalContent(content),
			scan,
			supportFiles,
			...goal ? { goal } : {},
			...evidence ? { evidence } : {}
		});
	} catch (cause) {
		const error = cause instanceof Error ? cause : new Error(String(cause));
		return err({
			cause: error,
			message: error.message
		});
	}
}
function resolveUpdateProposalDescription(inputDescription, currentDescription) {
	const supplied = normalizeOptionalString(inputDescription);
	if (supplied) return supplied;
	return truncateUtf8(currentDescription.trim(), MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES);
}
function nextProposalVersion(version) {
	const match = /^v(\d+)$/.exec(version.trim());
	if (!match) return "v2";
	const current = Number.parseInt(match[1] ?? "1", 10);
	return `v${Number.isSafeInteger(current) && current > 0 ? current + 1 : 2}`;
}
async function readSkillProposalDraftFile(filePath) {
	return decodeProposalTextFile((await readLocalFileSafely({
		filePath,
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES
	})).buffer, filePath);
}
async function readSkillProposalDraftDirectory(dirPath) {
	const absoluteDir = path.resolve(dirPath);
	const draftRoot = await root(absoluteDir);
	const proposal = await draftRoot.read("PROPOSAL.md", {
		hardlinks: "reject",
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES,
		symlinks: "reject"
	});
	const scanned = await walkDirectory(absoluteDir, {
		maxDepth: 8,
		maxEntries: MAX_PROPOSAL_DIRECTORY_ENTRIES,
		symlinks: "include"
	});
	if (scanned.truncated) throw new Error("Proposal directory has too many entries.");
	const supportFiles = [];
	for (const entry of scanned.entries.toSorted((a, b) => a.relativePath.localeCompare(b.relativePath))) {
		const relativePath = toPortableRelativePath(entry.relativePath);
		if (!relativePath || relativePath === "PROPOSAL.md") continue;
		if (entry.kind === "directory") continue;
		if (entry.kind !== "file") throw new Error(`Proposal support file must be a regular file: ${relativePath}`);
		const supportPath = normalizeWorkspaceSkillSupportPath(relativePath);
		if (((await fs.stat(entry.path)).mode & 73) !== 0) throw new Error(`Proposal support files must not be executable: ${relativePath}`);
		const read = await draftRoot.read(relativePath, {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
			symlinks: "reject"
		});
		supportFiles.push({
			path: supportPath,
			content: decodeProposalTextFile(read.buffer, relativePath)
		});
	}
	return {
		content: decodeProposalTextFile(proposal.buffer, "PROPOSAL.md"),
		supportFiles
	};
}
function decodeProposalTextFile(buffer, label) {
	const content = buffer.toString("utf8");
	if (!Buffer.from(content, "utf8").equals(buffer) || content.includes("\0")) throw new Error(`Proposal files must be UTF-8 text: ${label}`);
	return content;
}
function assertProposalDescriptionWithinLimit(description) {
	const sizeBytes = Buffer.byteLength(description, "utf8");
	if (sizeBytes > MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES) throw new Error(`Skill proposal description is too large (${sizeBytes} bytes, max ${MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES}).`);
}
function assertProposalContentWithinLimit(content, maxSkillBytes) {
	const sizeBytes = Buffer.byteLength(content, "utf8");
	if (sizeBytes > maxSkillBytes) throw new Error(`Skill proposal content is too large (${sizeBytes} bytes, max ${maxSkillBytes}).`);
}
function truncateUtf8(value, maxBytes) {
	let out = "";
	let sizeBytes = 0;
	for (const char of value) {
		const charBytes = Buffer.byteLength(char, "utf8");
		if (sizeBytes + charBytes > maxBytes) break;
		out += char;
		sizeBytes += charBytes;
	}
	return out.trimEnd();
}
function toPortableRelativePath(relativePath) {
	return relativePath.split(path.sep).join("/");
}
//#endregion
export { resolveUpdateProposalDescription as a, readSkillProposalTargetTreeSha256 as c, readSkillProposalDraftFile as i, prepareSkillProposalDraft as n, scanProposalBundle as o, readSkillProposalDraftDirectory as r, buildSkillProposalEvaluationBundles as s, nextProposalVersion as t };
