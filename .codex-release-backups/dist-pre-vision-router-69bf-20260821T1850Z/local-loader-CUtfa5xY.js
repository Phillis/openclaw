import { i as openRootFileSync } from "./root-file-CdmcBz8_.js";
import "./boundary-file-read-Dy4MeTWa.js";
import { r as createSyntheticSourceInfo, t as computeSkillPromptVersion } from "./skill-version-BztMvclw.js";
import { n as resolveSkillInvocationPolicy, t as parseSkillFrontmatter } from "./frontmatter-BE0jYufM.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/loading/local-loader.ts
function readSkillFileSync(params) {
	const opened = openRootFileSync({
		absolutePath: params.filePath,
		rootPath: params.rootRealPath,
		rootRealPath: params.rootRealPath,
		boundaryLabel: "skill root",
		rejectSymlinks: false,
		maxBytes: params.maxBytes
	});
	if (!opened.ok) return null;
	try {
		return fs.readFileSync(opened.fd, "utf8");
	} finally {
		fs.closeSync(opened.fd);
	}
}
function loadSingleSkillDirectory(params) {
	const skillFilePath = path.join(params.skillDir, "SKILL.md");
	const raw = readSkillFileSync({
		rootRealPath: params.rootRealPath,
		filePath: skillFilePath,
		maxBytes: params.maxBytes
	});
	if (!raw) return null;
	let frontmatter;
	try {
		frontmatter = parseSkillFrontmatter(raw);
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to parse skill frontmatter";
		params.onDiagnostic?.({
			path: skillFilePath,
			message
		});
		return null;
	}
	const fallbackName = path.basename(params.skillDir).trim();
	const name = frontmatter.name?.trim() || fallbackName;
	const description = frontmatter.description?.trim();
	if (!name || !description) return null;
	const invocation = resolveSkillInvocationPolicy(frontmatter);
	const filePath = path.resolve(skillFilePath);
	const baseDir = path.resolve(params.skillDir);
	return {
		skill: {
			name,
			description,
			filePath,
			baseDir,
			promptVersion: computeSkillPromptVersion(raw),
			source: params.source,
			sourceInfo: createSyntheticSourceInfo(filePath, {
				source: params.source,
				baseDir,
				scope: "project",
				origin: "top-level"
			}),
			disableModelInvocation: invocation.disableModelInvocation
		},
		frontmatter
	};
}
function listCandidateSkillDirs(dir) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules").map((entry) => path.join(dir, entry.name)).toSorted((left, right) => left.localeCompare(right));
	} catch {
		return [];
	}
}
/** Loads skills from a local directory while turning read/parse failures into diagnostics. */
function loadSkillsFromDirSafe(params) {
	const rootDir = path.resolve(params.dir);
	let rootRealPath;
	try {
		rootRealPath = fs.realpathSync(rootDir);
	} catch {
		return {
			skills: [],
			frontmatterByFilePath: /* @__PURE__ */ new Map()
		};
	}
	const rootSkill = loadSingleSkillDirectory({
		skillDir: rootDir,
		source: params.source,
		rootRealPath,
		maxBytes: params.maxBytes,
		onDiagnostic: params.onDiagnostic
	});
	if (rootSkill) return {
		skills: [rootSkill.skill],
		frontmatterByFilePath: /* @__PURE__ */ new Map([[rootSkill.skill.filePath, rootSkill.frontmatter]])
	};
	const loadedSkills = listCandidateSkillDirs(rootDir).map((skillDir) => loadSingleSkillDirectory({
		skillDir,
		source: params.source,
		rootRealPath,
		maxBytes: params.maxBytes,
		onDiagnostic: params.onDiagnostic
	})).filter((skill) => skill !== null);
	const frontmatterByFilePath = /* @__PURE__ */ new Map();
	for (const loaded of loadedSkills) frontmatterByFilePath.set(loaded.skill.filePath, loaded.frontmatter);
	return {
		skills: loadedSkills.map((loaded) => loaded.skill),
		frontmatterByFilePath
	};
}
function readSkillFrontmatterSafe(params) {
	let rootRealPath;
	try {
		rootRealPath = fs.realpathSync(path.resolve(params.rootDir));
	} catch {
		return null;
	}
	const raw = readSkillFileSync({
		rootRealPath,
		filePath: path.resolve(params.filePath),
		maxBytes: params.maxBytes
	});
	if (!raw) return null;
	try {
		return parseSkillFrontmatter(raw);
	} catch {
		return null;
	}
}
//#endregion
export { readSkillFrontmatterSafe as n, loadSkillsFromDirSafe as t };
