import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { m as shortenHomePath, t as CONFIG_DIR } from "./utils-Bw16L5tB.js";
import { _ as resolveGatewayPort } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as formatCliJsonFailure } from "./failure-output-CdUzE2dC.js";
import { S as isSkillsMachineOutput } from "./argv-CCdO9MSu.js";
import { r as stripAnsi, t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { l as resolveAgentIdByWorkspacePath } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { n as isImmutableGitCommitRef, r as parseGitPluginSpec } from "./git-install-BPOOTAxx.js";
import { u as writeJson } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { s as sanitizeHostExecEnv } from "./host-env-security-B_a4cpNH.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import "./config-B_0xOnKq.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.js";
import { i as canFallbackToImplicitLocalGateway } from "./gateway-rpc-DJvB3IVo.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { s as withInstallWorkspace } from "./install-source-utils-D2m0UUwS.js";
import { t as parseSkillFrontmatter } from "./frontmatter-BUnBwW_N.js";
import { E as validateRequestedSkillSlug, S as installExtractedSkillRoot, _ as readTrackedClawHubSkillSlugs, l as searchSkillsFromClawHub, s as resolveClawHubSkillVerificationTarget, v as untrackClawHubSkill } from "./clawhub-uninstall-DZyw9ymn.js";
import { b as readSkillProposalDraftFile, c as proposeCreateSkill, g as listSkillProposals, h as inspectSkillProposal, i as reviseSkillProposal, l as proposeUpdateSkill, n as quarantineSkillProposal, r as rejectSkillProposal, t as applySkillProposal, y as readSkillProposalDraftDirectory } from "./service-CWRf59ls.js";
import { i as fetchClawHubSkillCard, n as CLAWHUB_SKILLS_SH_TRUST_LABEL } from "./clawhub-skills-BG8u4JTN.js";
import { t as CLAWHUB_TRUST_ERROR_CODE } from "./clawhub-install-trust-Td8iLBze.js";
import { a as readVerifiedClawHubSkillSourceUrl, i as verifySkillWithClawHub, r as updateSkillsFromClawHub, t as installSkillFromClawHub } from "./clawhub-BPsHCdQE.js";
import { n as resolveSkillStatusEntry } from "./status-C77NfbH4.js";
import { r as getSkillCuratorStatus, t as SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE } from "./curator-hJcn049c.js";
import { n as formatTimeAgo } from "./format-relative-DerIyym2.js";
import { n as decorativePrefix, t as decorativeEmoji } from "./decorative-emoji-D9x7wue_.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-Bcnfo7BA.js";
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-DKdcuZ9M.js";
import { n as parseStrictPositiveIntOption } from "./helpers-B-LqXQ3Z.js";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { n as resolveClawHubRiskAcknowledgementCliOptions, t as resolveInstallPolicyWarningAcknowledgementCliOptions } from "./install-policy-warning-acknowledgement-D5AR1seD.js";
import { n as setCommandJsonMode } from "./json-mode-BvX-XNl0.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/lifecycle/source-install.ts
const SKILL_SOURCE_ORIGIN_RELATIVE_PATH = path.join(".openclaw", "source-origin.json");
const DEFAULT_GIT_TIMEOUT_MS = 12e4;
function createGitCommandEnv() {
	return sanitizeHostExecEnv({
		baseEnv: {
			...process.env,
			GIT_CONFIG_NOSYSTEM: "1",
			GIT_TERMINAL_PROMPT: "0"
		},
		blockPathOverrides: false
	});
}
function formatGitCommandFailure(params) {
	const detail = sanitizeForLog(redactSensitiveUrlLikeString(params.stderr.trim() || params.stdout.trim() || "git failed"));
	return `failed to ${params.action} ${sanitizeForLog(redactSensitiveUrlLikeString(params.label))}: ${detail}`;
}
async function runGitCommand(params) {
	const result = await runCommandWithTimeout(params.argv, {
		baseEnv: {},
		cwd: params.cwd,
		timeoutMs: params.timeoutMs ?? DEFAULT_GIT_TIMEOUT_MS,
		env: createGitCommandEnv()
	});
	if (result.code !== 0) return {
		ok: false,
		error: formatGitCommandFailure({
			action: params.action,
			label: params.label,
			stdout: result.stdout,
			stderr: result.stderr
		})
	};
	return {
		ok: true,
		stdout: result.stdout
	};
}
async function resolveGitCommitish(params) {
	const candidates = params.ref.startsWith("origin/") ? [params.ref] : [params.ref, `origin/${params.ref}`];
	for (const candidate of candidates) {
		const resolved = await runCommandWithTimeout([
			"git",
			"rev-parse",
			"--verify",
			"--quiet",
			`${candidate}^{commit}`
		], {
			baseEnv: {},
			cwd: params.repoDir,
			timeoutMs: params.timeoutMs ?? DEFAULT_GIT_TIMEOUT_MS,
			env: createGitCommandEnv()
		});
		const commit = normalizeOptionalString(resolved.stdout);
		if (resolved.code === 0 && commit) return {
			ok: true,
			commitish: commit
		};
	}
	return {
		ok: false,
		error: `failed to resolve ref ${sanitizeForLog(redactSensitiveUrlLikeString(params.ref))} in ${sanitizeForLog(redactSensitiveUrlLikeString(params.label))}`
	};
}
async function readSkillNameFromFrontmatter(skillDir) {
	try {
		return normalizeOptionalString(parseSkillFrontmatter(await fs.readFile(path.join(skillDir, "SKILL.md"), "utf8")).name) ?? null;
	} catch {
		return null;
	}
}
function resolveFallbackSlugFromPath(sourcePath) {
	return path.basename(path.resolve(sourcePath)).trim();
}
async function resolveSkillInstallSlug(params) {
	const explicit = normalizeOptionalString(params.slug);
	if (explicit) return validateRequestedSkillSlug(explicit);
	const frontmatterName = await readSkillNameFromFrontmatter(params.sourceDir);
	if (frontmatterName) try {
		return validateRequestedSkillSlug(frontmatterName);
	} catch {}
	return validateRequestedSkillSlug(params.fallbackLabel);
}
async function writeSkillSourceOrigin(targetDir, origin) {
	await writeJson(path.join(targetDir, SKILL_SOURCE_ORIGIN_RELATIVE_PATH), origin, { trailingNewline: true });
}
async function removeClawHubInstallMetadata(targetDir) {
	await Promise.all([fs.rm(path.join(targetDir, ".clawhub"), {
		recursive: true,
		force: true
	}), fs.rm(path.join(targetDir, ".clawdhub"), {
		recursive: true,
		force: true
	})]);
}
async function copyGitWorktreeExport(params) {
	try {
		await fs.cp(params.repoDir, params.exportDir, {
			recursive: true,
			filter: (source) => !path.relative(params.repoDir, source).split(path.sep).includes(".git")
		});
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			error: `failed to prepare git skill source: ${String(err)}`
		};
	}
}
async function installLocalSkillDir(params) {
	const slug = await resolveSkillInstallSlug({
		sourceDir: params.sourceDir,
		fallbackLabel: params.fallbackLabel,
		slug: params.slug
	});
	const install = await installExtractedSkillRoot({
		workspaceDir: params.workspaceDir,
		slug,
		extractedRoot: params.sourceDir,
		mode: params.force ? "update" : "install",
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		policy: {
			config: params.config,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			installId: params.source,
			origin: {
				type: params.source,
				spec: params.sourceSpec,
				...params.git?.commit ? { commit: params.git.commit } : {},
				...params.git?.ref ? { ref: params.git.ref } : {}
			},
			source: params.source === "git" ? {
				kind: "git",
				authority: "third-party",
				mutable: !isImmutableGitCommitRef(params.git?.ref),
				network: true
			} : {
				kind: "local-path",
				authority: "user",
				mutable: true,
				network: false
			},
			requestedSpecifier: params.sourceSpec
		}
	});
	if (!install.ok) return {
		ok: false,
		error: install.error
	};
	await removeClawHubInstallMetadata(install.targetDir);
	await writeSkillSourceOrigin(install.targetDir, {
		version: 1,
		source: params.source,
		spec: params.sourceSpec,
		slug,
		installedAt: Date.now(),
		...params.git ? { git: params.git } : {}
	});
	await untrackClawHubSkill(params.workspaceDir, slug);
	return {
		ok: true,
		slug,
		targetDir: install.targetDir,
		source: params.source,
		...params.git ? { git: params.git } : {}
	};
}
async function installGitSkill(params) {
	const parsed = parseGitPluginSpec(params.spec);
	if (!parsed) return {
		ok: false,
		error: `Unsupported git skill spec: ${params.spec}`
	};
	return await withInstallWorkspace("openclaw-git-skill-", async (tmpDir) => {
		const repoDir = path.join(tmpDir, "repo");
		const exportDir = path.join(tmpDir, "export");
		params.logger?.info?.(`Cloning ${sanitizeForLog(redactSensitiveUrlLikeString(parsed.label))}...`);
		const clone = await runGitCommand({
			argv: parsed.ref ? [
				"git",
				"clone",
				"--",
				parsed.url,
				repoDir
			] : [
				"git",
				"clone",
				"--depth",
				"1",
				"--",
				parsed.url,
				repoDir
			],
			action: "clone",
			label: parsed.label,
			timeoutMs: params.timeoutMs
		});
		if (!clone.ok) return clone;
		if (parsed.ref) {
			const commitish = await resolveGitCommitish({
				repoDir,
				ref: parsed.ref,
				label: parsed.label,
				timeoutMs: params.timeoutMs
			});
			if (!commitish.ok) return commitish;
			const checkout = await runGitCommand({
				argv: [
					"git",
					"switch",
					"--detach",
					"--",
					commitish.commitish
				],
				action: `checkout ${parsed.ref}`,
				label: parsed.label,
				cwd: repoDir,
				timeoutMs: params.timeoutMs
			});
			if (!checkout.ok) return checkout;
		}
		const rev = await runGitCommand({
			argv: [
				"git",
				"rev-parse",
				"HEAD"
			],
			action: "resolve commit for",
			label: parsed.label,
			cwd: repoDir,
			timeoutMs: params.timeoutMs
		});
		if (!rev.ok) return rev;
		const git = {
			url: redactSensitiveUrlLikeString(parsed.url),
			...parsed.ref ? { ref: parsed.ref } : {},
			commit: normalizeOptionalString(rev.stdout),
			resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const exported = await copyGitWorktreeExport({
			repoDir,
			exportDir
		});
		if (!exported.ok) return exported;
		return await installLocalSkillDir({
			workspaceDir: params.workspaceDir,
			sourceDir: exportDir,
			sourceSpec: redactSensitiveUrlLikeString(parsed.normalizedSpec),
			source: "git",
			fallbackLabel: path.basename(parsed.label),
			slug: params.slug,
			force: params.force,
			timeoutMs: params.timeoutMs,
			logger: params.logger,
			config: params.config,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			git
		});
	});
}
async function installPathSkill(params) {
	const sourceDir = resolveUserPath(params.spec);
	let stat;
	try {
		stat = await fs.stat(sourceDir);
	} catch {
		return {
			ok: false,
			error: `Skill path not found: ${sourceDir}`
		};
	}
	if (!stat.isDirectory()) return {
		ok: false,
		error: `Skill path is not a directory: ${sourceDir}`
	};
	return await installLocalSkillDir({
		workspaceDir: params.workspaceDir,
		sourceDir,
		sourceSpec: params.spec,
		source: "path",
		fallbackLabel: resolveFallbackSlugFromPath(sourceDir),
		slug: params.slug,
		force: params.force,
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		config: params.config,
		onInstallPolicyWarning: params.onInstallPolicyWarning
	});
}
function isSkillSourceInstallSpec(raw) {
	const trimmed = raw.trim();
	return trimmed.toLowerCase().startsWith("git:") || trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("~/") || path.isAbsolute(trimmed);
}
async function installSkillFromSource(params) {
	const spec = params.spec.trim();
	if (spec.toLowerCase().startsWith("git:")) return await installGitSkill({
		...params,
		spec
	});
	return await installPathSkill({
		...params,
		spec
	});
}
//#endregion
//#region src/cli/skills-cli.format.ts
function appendClawHubHint(output, json) {
	if (json) return output;
	const command = formatCliCommand("openclaw skills");
	return `${output}\n\nTip: use \`${command} search\`, \`${command} install\`, and \`${command} update\` for ClawHub-backed skills.`;
}
function formatSkillStatus(skill) {
	if (skill.disabled) return theme.warn(decorativePrefix("⏸", "disabled"));
	if (skill.blockedByAllowlist) return theme.warn(decorativePrefix("🚫", "blocked"));
	if (skill.blockedByAgentFilter) return theme.warn(decorativePrefix("🚫", "excluded"));
	if (skill.eligible) return theme.success("✓ ready");
	return theme.warn("△ needs setup");
}
function normalizeSkillEmoji(emoji) {
	if (emoji) return emoji.replaceAll("︎", "️");
	return decorativeEmoji("📦");
}
const REMAINING_ESC_SEQUENCE_REGEX = new RegExp(String.raw`\u001b(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])`, "g");
const JSON_CONTROL_CHAR_REGEX = new RegExp(String.raw`[\u0000-\u001f\u007f-\u009f]`, "g");
function sanitizeJsonString(value) {
	return stripAnsi(value).replace(REMAINING_ESC_SEQUENCE_REGEX, "").replace(JSON_CONTROL_CHAR_REGEX, "");
}
function sanitizeJsonValue(value) {
	if (typeof value === "string") return sanitizeJsonString(value);
	if (Array.isArray(value)) return value.map((item) => sanitizeJsonValue(item));
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [key, sanitizeJsonValue(entryValue)]));
	return value;
}
function formatSkillName(skill) {
	const emoji = normalizeSkillEmoji(skill.emoji);
	const name = theme.command(sanitizeForLog(skill.name));
	return emoji ? `${emoji} ${name}` : name;
}
const SKILL_REQUIREMENT_GROUPS = [
	["bins", "Binaries"],
	["anyBins", "Any binaries"],
	["env", "Environment"],
	["config", "Config"],
	["os", "OS"]
];
function formatSkillMissingSummary(skill) {
	return SKILL_REQUIREMENT_GROUPS.filter(([key]) => skill.missing[key].length > 0).map(([key]) => `${key}: ${skill.missing[key].join(", ")}`).join("; ");
}
/** Render skill discovery status as sanitized JSON or a terminal table. */
function formatSkillsList(report, opts) {
	const isReadyForAgent = (skill) => skill.eligible && !skill.blockedByAgentFilter;
	const skills = opts.eligible ? report.skills.filter(isReadyForAgent) : report.skills;
	if (opts.json) {
		const jsonReport = sanitizeJsonValue({
			workspaceDir: report.workspaceDir,
			managedSkillsDir: report.managedSkillsDir,
			skills: skills.map((s) => ({
				name: s.name,
				description: s.description,
				emoji: s.emoji,
				eligible: s.eligible,
				disabled: s.disabled,
				blockedByAllowlist: s.blockedByAllowlist,
				blockedByAgentFilter: s.blockedByAgentFilter,
				modelVisible: s.modelVisible,
				userInvocable: s.userInvocable,
				commandVisible: s.commandVisible,
				source: s.source,
				bundled: s.bundled,
				primaryEnv: s.primaryEnv,
				homepage: s.homepage,
				missing: s.missing
			}))
		});
		return JSON.stringify(jsonReport, null, 2);
	}
	if (skills.length === 0) return appendClawHubHint(opts.eligible ? `No eligible skills found. Run \`${formatCliCommand("openclaw skills list")}\` to see all skills.` : "No skills found.", opts.json);
	const ready = skills.filter(isReadyForAgent);
	const tableWidth = getTerminalTableWidth();
	const rows = skills.map((skill) => {
		const missing = formatSkillMissingSummary(skill);
		return {
			Status: formatSkillStatus(skill),
			Skill: formatSkillName(skill),
			Description: theme.muted(skill.description),
			Source: skill.source,
			Missing: missing ? theme.warn(missing) : ""
		};
	});
	const columns = [
		{
			key: "Status",
			header: "Status",
			minWidth: 10
		},
		{
			key: "Skill",
			header: "Skill",
			minWidth: 22
		},
		{
			key: "Description",
			header: "Description",
			minWidth: 24,
			flex: true
		},
		{
			key: "Source",
			header: "Source",
			minWidth: 10
		}
	];
	if (opts.verbose) columns.push({
		key: "Missing",
		header: "Missing",
		minWidth: 18,
		flex: true
	});
	const lines = [];
	lines.push(`${theme.heading("Skills")} ${theme.muted(`(${ready.length}/${skills.length} ready)`)}`);
	lines.push(renderTable({
		width: tableWidth,
		columns,
		rows
	}).trimEnd());
	return appendClawHubHint(lines.join("\n"), opts.json);
}
/** Render one skill's status, requirements, install hints, and API-key setup details. */
function formatSkillInfo(report, skillName, opts) {
	const requestedName = skillName.trim();
	const safeRequestedName = sanitizeJsonString(sanitizeForLog(requestedName));
	const skill = resolveSkillStatusEntry(report.skills, requestedName);
	if (!skill) {
		if (opts.json) return JSON.stringify(sanitizeJsonValue({
			...formatCliJsonFailure(`Skill "${requestedName}" not found.`),
			skill: requestedName
		}), null, 2);
		return appendClawHubHint(`Skill "${safeRequestedName}" not found. Run \`${formatCliCommand("openclaw skills list")}\` to see available skills.`, opts.json);
	}
	if (opts.json) return JSON.stringify(sanitizeJsonValue(skill), null, 2);
	const lines = [];
	const emoji = normalizeSkillEmoji(skill.emoji);
	const status = skill.disabled ? theme.warn(decorativePrefix("⏸", "Disabled")) : skill.blockedByAllowlist ? theme.warn(decorativePrefix("🚫", "Blocked by allowlist")) : skill.blockedByAgentFilter ? theme.warn(decorativePrefix("🚫", "Excluded by agent allowlist")) : skill.eligible ? theme.success("✓ Ready") : theme.warn("△ Needs setup");
	const safeName = sanitizeForLog(skill.name);
	const safeHomepage = skill.homepage ? sanitizeForLog(skill.homepage) : void 0;
	const safeSkillKey = sanitizeForLog(skill.skillKey);
	lines.push(`${emoji ? `${emoji} ` : ""}${theme.heading(safeName)} ${status}`);
	lines.push("");
	lines.push(sanitizeForLog(skill.description));
	lines.push("");
	lines.push(theme.heading("Details:"));
	lines.push(`${theme.muted("  Source:")} ${sanitizeForLog(skill.source)}`);
	lines.push(`${theme.muted("  Path:")} ${shortenHomePath(skill.filePath)}`);
	if (safeHomepage) lines.push(`${theme.muted("  Homepage:")} ${safeHomepage}`);
	lines.push(`${theme.muted("  Visible to model:")} ${skill.modelVisible ? theme.success("yes") : theme.warn("no")}`);
	lines.push(`${theme.muted("  Available as command:")} ${skill.commandVisible ? theme.success("yes") : theme.warn("no")}`);
	if (skill.blockedByAgentFilter) lines.push(`${theme.muted("  Agent allowlist:")} excludes this skill`);
	if (skill.primaryEnv) lines.push(`${theme.muted("  Primary env:")} ${skill.primaryEnv}`);
	const requirementGroups = SKILL_REQUIREMENT_GROUPS.filter(([key]) => skill.requirements[key].length > 0);
	if (requirementGroups.length > 0) {
		lines.push("");
		lines.push(theme.heading("Requirements:"));
		for (const [key, label] of requirementGroups) {
			const missingRequirements = skill.missing[key];
			const requirementStatus = skill.requirements[key].map((requirement) => {
				return (key === "anyBins" ? missingRequirements.length > 0 : missingRequirements.includes(requirement)) ? theme.error(`✗ ${requirement}`) : theme.success(`✓ ${requirement}`);
			});
			lines.push(`${theme.muted(`  ${label}:`)} ${requirementStatus.join(", ")}`);
		}
	}
	if (skill.install.length > 0 && !skill.eligible) {
		lines.push("");
		lines.push(theme.heading("Install options:"));
		for (const inst of skill.install) lines.push(`  ${theme.warn("→")} ${inst.label}`);
	}
	if (skill.primaryEnv && skill.missing.env.includes(skill.primaryEnv)) {
		lines.push("");
		lines.push(theme.heading("API key setup:"));
		if (safeHomepage) lines.push(`  Get your key: ${safeHomepage}`);
		lines.push(`  Save via UI: ${theme.muted("Control UI → Skills → ")}${safeName}${theme.muted(" → Save key")}`);
		lines.push(`  Save via CLI: ${formatCliCommand(`openclaw config set skills.entries.${safeSkillKey}.apiKey YOUR_KEY`)}`);
		lines.push(`  Stored in: ${theme.muted("$OPENCLAW_CONFIG_PATH")} ${theme.muted("(default: ~/.openclaw/openclaw.json)")}`);
	}
	return appendClawHubHint(lines.join("\n"), opts.json);
}
/** Render aggregate setup health for all discovered skills. */
function formatSkillsCheck(report, opts) {
	const eligible = report.skills.filter((s) => s.eligible);
	const modelVisible = report.skills.filter((s) => s.modelVisible);
	const commandVisible = report.skills.filter((s) => s.commandVisible);
	const disabled = report.skills.filter((s) => s.disabled);
	const blocked = report.skills.filter((s) => s.blockedByAllowlist && !s.disabled);
	const agentFiltered = report.skills.filter((s) => s.eligible && s.blockedByAgentFilter);
	const promptHidden = report.skills.filter((s) => s.eligible && !s.blockedByAgentFilter && !s.modelVisible);
	const missingReqs = report.skills.filter((s) => !s.eligible && !s.disabled && !s.blockedByAllowlist && !s.blockedByAgentFilter);
	const agentId = report.agentId ?? opts.agent;
	if (opts.json) return JSON.stringify(sanitizeJsonValue({
		agentId,
		agentSkillFilter: report.agentSkillFilter,
		workspaceDir: report.workspaceDir,
		managedSkillsDir: report.managedSkillsDir,
		summary: {
			total: report.skills.length,
			eligible: eligible.length,
			modelVisible: modelVisible.length,
			commandVisible: commandVisible.length,
			disabled: disabled.length,
			blocked: blocked.length,
			agentFiltered: agentFiltered.length,
			notInjected: promptHidden.length,
			missingRequirements: missingReqs.length
		},
		eligible: eligible.map((s) => s.name),
		modelVisible: modelVisible.map((s) => s.name),
		commandVisible: commandVisible.map((s) => s.name),
		disabled: disabled.map((s) => s.name),
		blocked: blocked.map((s) => s.name),
		agentFiltered: agentFiltered.map((s) => s.name),
		notInjected: promptHidden.map((s) => ({
			name: s.name,
			reason: "disable-model-invocation"
		})),
		missingRequirements: missingReqs.map((s) => ({
			name: s.name,
			missing: s.missing,
			install: s.install
		}))
	}), null, 2);
	const lines = [];
	lines.push(theme.heading("Skills Status Check"));
	if (agentId) lines.push(`${theme.muted("Agent:")} ${sanitizeForLog(agentId)}`);
	lines.push("");
	lines.push(`${theme.muted("Total:")} ${report.skills.length}`);
	lines.push(`${theme.success("✓")} ${theme.muted("Eligible:")} ${eligible.length}`);
	lines.push(`${theme.success("✓")} ${theme.muted("Visible to model:")} ${modelVisible.length}`);
	lines.push(`${theme.success("✓")} ${theme.muted("Available as command:")} ${commandVisible.length}`);
	lines.push(`${theme.warn(decorativePrefix("⏸", "Disabled:"))} ${theme.muted(String(disabled.length))}`);
	lines.push(`${theme.warn(decorativePrefix("🚫", "Blocked by allowlist:"))} ${theme.muted(String(blocked.length))}`);
	if (agentId || agentFiltered.length > 0) lines.push(`${theme.warn(decorativePrefix("🚫", "Excluded by agent allowlist:"))} ${theme.muted(String(agentFiltered.length))}`);
	if (promptHidden.length > 0) lines.push(`${theme.warn("△")} ${theme.muted("Ready but hidden from model prompt:")} ${promptHidden.length}`);
	lines.push(`${theme.error("✗")} ${theme.muted("Missing requirements:")} ${missingReqs.length}`);
	if (modelVisible.length > 0 || commandVisible.length > 0 || promptHidden.length > 0) {
		lines.push("");
		lines.push(theme.heading("What this means:"));
		lines.push(`  ${theme.muted("Eligible:")} installed and requirements pass; the agent may still exclude it.`);
		if (modelVisible.length > 0) lines.push(`  ${theme.muted("Visible to model:")} the agent can see the skill instructions during normal chat.`);
		if (commandVisible.length > 0) lines.push(`  ${theme.muted("Available as command:")} people, scripts, or automations can call the skill explicitly.`);
		if (promptHidden.length > 0) lines.push(`  ${theme.muted("Hidden from model prompt:")} installed and ready, but kept out of normal chat.`);
	}
	if (modelVisible.length > 0) {
		lines.push("");
		lines.push(theme.heading("Ready and visible to model:"));
		for (const skill of modelVisible) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)}`);
		}
	}
	if (promptHidden.length > 0) {
		lines.push("");
		lines.push(theme.heading("Ready but hidden from model prompt:"));
		for (const skill of promptHidden) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			const reason = skill.commandVisible ? "skill hides its instructions from the model; commands/cron may still use it" : "skill hides its instructions from the model and is not exposed as a command";
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)} ${theme.muted(`(${reason})`)}`);
		}
	}
	if (agentFiltered.length > 0) {
		lines.push("");
		lines.push(theme.heading("Excluded by agent allowlist:"));
		for (const skill of agentFiltered) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)} ${theme.muted("(loaded, but this agent is not allowed to see/use it)")}`);
		}
	}
	if (missingReqs.length > 0) {
		lines.push("");
		lines.push(theme.heading("Missing requirements:"));
		for (const skill of missingReqs) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			const missing = formatSkillMissingSummary(skill);
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)} ${theme.muted(`(${missing})`)}`);
		}
	}
	return appendClawHubHint(lines.join("\n"), opts.json);
}
//#endregion
//#region src/cli/skills-cli.ts
function resolveSkillClawHubRiskOptions(acknowledgeClawHubRisk, action) {
	const riskOptions = resolveClawHubRiskAcknowledgementCliOptions({
		acknowledgeClawHubRisk,
		action
	});
	return {
		...riskOptions.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {},
		...riskOptions.onClawHubRisk ? { onClawHubRisk: riskOptions.onClawHubRisk } : {}
	};
}
function formatSkillWarning(message) {
	return message.includes("╭─") ? message : theme.warn(message);
}
function formatClawHubSearchText(value) {
	return sanitizeForLog(value.replace(/\s+/gu, " ")).trim();
}
function isClawHubSkillBlockedCliFailure(result) {
	return result.code === CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED && typeof result.warning === "string" && result.warning.trim().length > 0;
}
const GATEWAY_SKILLS_STATUS_TIMEOUT_MS = 1500;
const GATEWAY_SKILLS_EVALUATION_TIMEOUT_MS = 65e4;
const GATEWAY_SKILLS_OFFLINE_LOCK_TIMEOUT_MS = 250;
const GATEWAY_SKILLS_APPLY_TIMEOUT_MS = 185e4;
async function callSkillsGateway(params) {
	const { callGateway } = await import("./call-DPYKD0iw.js");
	return await callGateway({
		timeoutMs: GATEWAY_SKILLS_STATUS_TIMEOUT_MS,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		mode: GATEWAY_CLIENT_MODES.CLI,
		...params
	});
}
function normalizeExplicitAgentId(agentId) {
	const normalizedAgentId = agentId?.trim();
	if (agentId !== void 0 && !normalizedAgentId) throw new Error("--agent must not be blank");
	return normalizedAgentId;
}
function resolveSkillsWorkspace(options) {
	const config = getRuntimeConfig(options?.skipPluginValidation ? { skipPluginValidation: true } : void 0);
	const explicitAgentId = normalizeExplicitAgentId(options?.agentId);
	const inferredAgentId = explicitAgentId ? void 0 : resolveAgentIdByWorkspacePath(config, options?.cwd ?? process.cwd());
	const agentId = explicitAgentId ? resolveConfiguredAgentId(config, explicitAgentId) : inferredAgentId ?? resolveDefaultAgentId(config, {
		surface: "the skills command",
		hint: "Pass --agent <id>."
	});
	return {
		config,
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(config, agentId)
	};
}
function resolveAgentOption(command, opts) {
	return resolveOptionFromCommand(command, "agent") ?? opts?.agent;
}
async function loadSkillsStatusReport(options) {
	const resolved = resolveSkillsWorkspace({
		...options,
		skipPluginValidation: true
	});
	try {
		return await callSkillsGateway({
			config: resolved.config,
			method: "skills.status",
			params: { agentId: resolved.agentId }
		});
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config: resolved.config,
			error,
			legacyMethod: "skills.status",
			legacyAgentId: true
		})) throw error;
		const { buildWorkspaceSkillStatus } = await import("./status-N6qqdGlF.js");
		return buildWorkspaceSkillStatus(resolved.workspaceDir, {
			config: resolved.config,
			agentId: resolved.agentId
		});
	}
}
async function runSkillsAction(render, options) {
	await runCommandWithRuntime(defaultRuntime, async () => {
		const report = await loadSkillsStatusReport(options);
		defaultRuntime.writeStdout(render(report));
	});
}
function resolveSkillsWorkspaceForCommand(command, opts) {
	return resolveSkillsWorkspace({ agentId: resolveAgentOption(command ?? void 0, opts) });
}
function resolveClawHubTargetWorkspace(command, opts, reportError = defaultRuntime.error) {
	const agentId = normalizeExplicitAgentId(resolveAgentOption(command, opts));
	if (opts.global && agentId) {
		reportError("Use either --global or --agent, not both.");
		defaultRuntime.exit(1);
		return;
	}
	if (opts.global) return {
		config: getRuntimeConfig(),
		workspaceDir: CONFIG_DIR
	};
	return resolveSkillsWorkspace({ agentId });
}
function shouldFailSkillVerification(result) {
	const envelope = result;
	return envelope.ok !== true || envelope.decision !== "pass";
}
function buildSkillVerificationOutput(result, target) {
	const verifiedSourceUrl = readVerifiedClawHubSkillSourceUrl(result.provenance);
	return {
		...result,
		openclaw: {
			resolution: {
				source: target.resolution.source,
				selector: target.resolution.selector,
				registry: target.resolution.registry,
				installedVersion: target.resolution.installedVersion,
				...target.requestedReference ? { reference: target.requestedReference } : {}
			},
			...target.trustState ? { trust: {
				state: target.trustState,
				label: CLAWHUB_SKILLS_SH_TRUST_LABEL
			} } : {},
			...verifiedSourceUrl ? { verifiedSourceUrl } : {}
		}
	};
}
function readVerifiedSkillCardUrl(result) {
	if (!result.card || typeof result.card !== "object" || Array.isArray(result.card)) return {
		ok: false,
		error: "ClawHub verification response did not include a Skill Card URL."
	};
	const card = result.card;
	if (card.available === false) return {
		ok: false,
		error: "Skill Card is not available."
	};
	const url = normalizeOptionalString(card.url);
	if (!url) return {
		ok: false,
		error: "ClawHub verification response did not include a Skill Card URL."
	};
	return {
		ok: true,
		url
	};
}
function formatSkillProposalList(manifest) {
	if (manifest.proposals.length === 0) return "No skill proposals.\n";
	return `${manifest.proposals.map((entry) => `${entry.id}  ${entry.status}  ${entry.kind}  ${entry.skillKey}  ${entry.title}${entry.workspaceMismatch ? "  [previous workspace]" : ""}`).join("\n")}\n`;
}
function formatSkillProposalInspect(read) {
	const { record } = read;
	const supportFiles = read.supportFiles && read.supportFiles.length > 0 ? [
		"",
		"Support files:",
		...read.supportFiles.flatMap((file) => [
			"",
			`--- ${file.path} ---`,
			file.content
		])
	] : [];
	return [
		`ID: ${record.id}`,
		`Status: ${record.status}`,
		`Kind: ${record.kind}`,
		`Skill: ${record.target.skillName}`,
		`Target: ${record.target.skillFile}`,
		`Scanner: ${record.scan.state}`,
		record.statusReason ? `Reason: ${record.statusReason}` : void 0,
		"",
		read.content,
		...supportFiles
	].filter((line) => line !== void 0).join("\n");
}
function formatSkillProposalEvaluation(result) {
	const lines = [
		`Proposal: ${result.record.id}`,
		`Proposed version: ${result.evaluation.proposedVersion}`,
		`Revision hash: ${result.evaluation.revisionHash}`,
		`Evaluators: ${result.evaluation.outcomes.length}`
	];
	for (const outcome of result.evaluation.outcomes) {
		const plugin = outcome.pluginVersion ? `${outcome.pluginId}@${outcome.pluginVersion}` : outcome.pluginId;
		const prefix = `${outcome.evaluatorId} (${plugin})`;
		if (outcome.status === "completed") {
			const decision = outcome.result.decision ? ` ${outcome.result.decision}` : "";
			const summary = outcome.result.summary ? `: ${outcome.result.summary}` : "";
			lines.push(`${prefix}  completed${decision}${summary}`);
			continue;
		}
		if (outcome.status === "error") {
			lines.push(`${prefix}  error: ${outcome.error}`);
			continue;
		}
		lines.push(`${prefix}  skipped`);
	}
	return `${lines.join("\n")}\n`;
}
function formatSkillCuratorStatus(status) {
	const timestamp = (value) => value === null ? "never" : new Date(value).toISOString();
	const lines = [
		`Last attempt: ${timestamp(status.lastAttemptAtMs)}`,
		`Last success: ${timestamp(status.lastSuccessAtMs)}`,
		`Counts: ${status.counts.active} active, ${status.counts.stale} stale, ${status.counts.archived} archived`
	];
	if (status.lastError) lines.push(`Last error: ${status.lastError}`);
	const relative = (value) => formatTimeAgo(Math.max(0, Date.now() - value));
	for (const [workspace, review] of Object.entries(status.collectionReview)) lines.push(`Collection review ${workspace.slice(0, 8)}: attempted ${relative(review.attemptedAtMs)}; ${review.error ? `failed: ${review.error}` : review.succeededAtMs ? `succeeded ${relative(review.succeededAtMs)}` : "running"}`);
	for (const [workspace, review] of Object.entries(status.experienceReview)) lines.push(`Experience review ${workspace.slice(0, 8)}: ${review.outcome}${review.error ? `: ${review.error}` : review.proposalId ? ` (${review.proposalId})` : ""}; attempted ${relative(review.attemptedAtMs)}`);
	const keyCounts = /* @__PURE__ */ new Map();
	for (const skill of status.skills) keyCounts.set(skill.skillKey, (keyCounts.get(skill.skillKey) ?? 0) + 1);
	for (const skill of status.skills) {
		const pinned = skill.pinned ? " pinned" : "";
		const lastUsed = skill.lastUsedAtMs === null ? "never" : new Date(skill.lastUsedAtMs).toISOString();
		const label = keyCounts.get(skill.skillKey) === 1 ? skill.skillKey : `${skill.skillKey} (${skill.skillFile})`;
		lines.push(`${label}  ${skill.state}${pinned}  last-used=${lastUsed}  uses=${skill.useCount}`);
	}
	for (const overlap of status.overlaps) lines.push(`Legacy overlap: ${overlap.left} ~ ${overlap.right}`);
	return `${lines.join("\n")}\n`;
}
async function withOfflineGatewayLock(config, gatewayError, action) {
	const { acquireGatewayLock } = await import("./gateway-lock-5zz6bLWk.js");
	const lock = await acquireGatewayLock({
		allowInTests: true,
		port: resolveGatewayPort(config, process.env),
		role: "skill-workshop-apply",
		timeoutMs: GATEWAY_SKILLS_OFFLINE_LOCK_TIMEOUT_MS
	}).catch(() => void 0);
	if (!lock) throw gatewayError;
	try {
		return await action();
	} finally {
		await lock.release();
	}
}
async function callSkillCurator(method, params, loadLocal) {
	const config = getRuntimeConfig();
	try {
		return await callSkillsGateway({
			config,
			method: `skills.curator.${method}`,
			params
		});
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config,
			error,
			...method === "status" ? { legacyMethod: "skills.curator.status" } : {}
		})) throw error;
		return method === "status" ? loadLocal() : await withOfflineGatewayLock(config, error, loadLocal);
	}
}
function throwRetiredSkillCuratorAction() {
	throw new Error(SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE);
}
async function runSkillCuratorMutation(method, skill) {
	await callSkillCurator(method, { skill }, throwRetiredSkillCuratorAction);
	return throwRetiredSkillCuratorAction();
}
async function runSkillProposalApply(resolved, proposalId) {
	let proposal;
	try {
		proposal = await callSkillsGateway({
			config: resolved.config,
			method: "skills.proposals.inspect",
			params: {
				agentId: resolved.agentId,
				proposalId
			},
			requiredMethods: ["skills.proposals.apply"]
		});
	} catch (err) {
		if (!await canFallbackToImplicitLocalGateway({
			config: resolved.config,
			error: err
		})) throw err;
		return await withOfflineGatewayLock(resolved.config, err, async () => {
			const reviewedProposal = await inspectSkillProposal(proposalId, {
				agentId: resolved.agentId,
				workspaceDir: resolved.workspaceDir
			});
			if (!reviewedProposal) throw new Error(`Skill proposal not found: ${proposalId}`, { cause: err });
			return await applySkillProposal({
				agentId: resolved.agentId,
				eventActor: {
					type: "system",
					id: "cli"
				},
				workspaceDir: resolved.workspaceDir,
				config: resolved.config,
				proposalId,
				expectedRevisionHash: reviewedProposal.revisionHash
			});
		});
	}
	return await callSkillsGateway({
		config: resolved.config,
		method: "skills.proposals.apply",
		params: {
			agentId: resolved.agentId,
			proposalId,
			expectedRevisionHash: proposal.revisionHash
		},
		timeoutMs: GATEWAY_SKILLS_APPLY_TIMEOUT_MS
	});
}
async function runSkillProposalEvaluate(resolved, proposalId, correlationId) {
	const proposal = await callSkillsGateway({
		config: resolved.config,
		method: "skills.proposals.inspect",
		params: {
			agentId: resolved.agentId,
			proposalId
		}
	});
	return await callSkillsGateway({
		config: resolved.config,
		method: "skills.proposals.evaluate",
		params: {
			agentId: resolved.agentId,
			proposalId,
			expectedRevisionHash: proposal.revisionHash,
			...correlationId ? { correlationId } : {}
		},
		timeoutMs: GATEWAY_SKILLS_EVALUATION_TIMEOUT_MS
	});
}
async function readSkillProposalInput(options) {
	const proposal = normalizeOptionalString(options.proposal);
	const proposalDir = normalizeOptionalString(options.proposalDir);
	if (proposal && proposalDir) throw new Error("Use either --proposal or --proposal-dir, not both.");
	if (!proposal && !proposalDir) throw new Error("Provide --proposal or --proposal-dir.");
	if (proposalDir) return await readSkillProposalDraftDirectory(proposalDir);
	return { content: await readSkillProposalDraftFile(proposal) };
}
/**
* Register the skills CLI commands
*/
function registerSkillsCli(program) {
	const skills = program.command("skills").description("List and inspect available skills").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--json", "Output as JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/skills", "docs.openclaw.ai/cli/skills")}\n`);
	const hasJsonOutput = (opts) => Boolean(opts?.json || skills.opts().json);
	setCommandJsonMode(skills, "output", ({ argv }) => isSkillsMachineOutput(argv));
	skills.command("search").description("Search ClawHub skills").argument("[query...]", "Optional search query").option("--limit <n>", "Max results", (value) => parseStrictPositiveIntOption(value, "--limit")).option("--json", "Output as JSON", false).action(async (queryParts, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const results = await searchSkillsFromClawHub({
				query: normalizeOptionalString(queryParts.join(" ")),
				limit: opts.limit
			});
			if (hasJsonOutput(opts)) {
				defaultRuntime.writeJson({ results });
				return;
			}
			if (results.length === 0) {
				defaultRuntime.log("No ClawHub skills found.");
				return;
			}
			for (const entry of results) {
				const installRef = normalizeOptionalString(entry.installRef);
				const skillRef = formatClawHubSearchText(installRef ?? entry.slug);
				const isExternalSource = installRef?.startsWith("skills-sh:") === true && entry.trustState === "not-scanned-by-clawhub";
				const version = entry.version ? ` v${formatClawHubSearchText(entry.version)}` : "";
				const summary = entry.summary ? `  ${formatClawHubSearchText(entry.summary)}` : "";
				const displayName = formatClawHubSearchText(entry.displayName);
				const trust = isExternalSource ? `  ${CLAWHUB_SKILLS_SH_TRUST_LABEL}` : "";
				defaultRuntime.log(`${skillRef}${version}  ${displayName}${summary}${trust}`);
			}
		});
	});
	skills.command("install").description("Install a skill from ClawHub, git, or a local directory").argument("<skill-ref>", "ClawHub skill ref (@owner/slug or skills-sh:owner/repo/slug), git:<repo>, or local skill directory").option("--version <version>", "Install a specific version").option("--force", "Overwrite an existing workspace skill", false).option("--force-install", "Install a pending GitHub-backed skill before ClawHub scan completes", false).option("--acknowledge-clawhub-risk", "Acknowledge ClawHub release trust warnings without prompting", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).option("--global", "Install into the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--as <slug>", "Install a git/local skill under this slug").addHelpText("after", "\nExamples:\n  openclaw skills install @owner/weather\n  openclaw skills install skills-sh:owner/repo/weather\n").action(async (slug, opts, command) => {
		try {
			const target = resolveClawHubTargetWorkspace(command, opts);
			if (!target) return;
			const { config, workspaceDir } = target;
			if (slug.trim().startsWith("skills-sh/")) {
				defaultRuntime.error(`Invalid skills.sh skill reference: ${slug}`);
				defaultRuntime.exit(1);
				return;
			}
			if (isSkillSourceInstallSpec(slug)) {
				const clawHubOnlyOption = [
					opts.version && "--version",
					opts.forceInstall && "--force-install",
					(opts.acknowledgeClawhubRisk === true || opts.acknowledgeClawHubRisk === true) && "--acknowledge-clawhub-risk"
				].find(Boolean);
				if (clawHubOnlyOption) {
					defaultRuntime.error(`${clawHubOnlyOption} is only supported for ClawHub skill installs.`);
					defaultRuntime.exit(1);
					return;
				}
				const result = await installSkillFromSource({
					workspaceDir,
					spec: slug,
					slug: opts.as,
					force: Boolean(opts.force),
					config,
					...resolveInstallPolicyWarningAcknowledgementCliOptions({ acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning }),
					logger: {
						info: (message) => defaultRuntime.log(message),
						warn: (message) => defaultRuntime.log(formatSkillWarning(message))
					}
				});
				if (!result.ok) {
					defaultRuntime.error(result.error);
					defaultRuntime.exit(1);
					return;
				}
				defaultRuntime.log(`Installed ${result.slug} from ${result.source} -> ${result.targetDir}`);
				return;
			}
			if (opts.as) {
				defaultRuntime.error("--as is only supported for git and local directory skill installs.");
				defaultRuntime.exit(1);
				return;
			}
			if (slug.trim().startsWith("skills-sh:") && opts.version) {
				defaultRuntime.error("--version is not supported for skills-sh references.");
				defaultRuntime.exit(1);
				return;
			}
			const result = await installSkillFromClawHub({
				workspaceDir,
				slug,
				version: opts.version,
				force: Boolean(opts.force),
				config,
				...resolveInstallPolicyWarningAcknowledgementCliOptions({ acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning }),
				...opts.forceInstall ? { forceInstall: true } : {},
				...resolveSkillClawHubRiskOptions(opts.acknowledgeClawhubRisk === true || opts.acknowledgeClawHubRisk === true, "installing"),
				logger: {
					info: (message) => defaultRuntime.log(message),
					warn: (message) => defaultRuntime.log(formatSkillWarning(message))
				}
			});
			if (!result.ok) {
				if (!isClawHubSkillBlockedCliFailure(result)) defaultRuntime.error(result.error);
				defaultRuntime.exit(1);
				return;
			}
			defaultRuntime.log(`Installed ${result.slug}@${result.version} -> ${result.targetDir}`);
		} catch (err) {
			defaultRuntime.error(formatErrorMessage(err));
			defaultRuntime.exit(1);
		}
	});
	skills.command("update").description("Update ClawHub-installed skills in the active or shared managed directory").argument("[skill-ref]", "Single ClawHub skill ref (@owner/slug)").option("--all", "Update all tracked ClawHub skills", false).option("--force", "Replace installed skills even when they have local changes", false).option("--force-install", "Install a pending GitHub-backed skill before ClawHub scan completes", false).option("--acknowledge-clawhub-risk", "Acknowledge ClawHub release trust warnings without prompting", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).option("--global", "Update skills in the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(async (slug, opts, command) => {
		try {
			if (!slug && !opts.all) {
				defaultRuntime.error("Provide a skill slug or use --all.");
				defaultRuntime.exit(1);
				return;
			}
			if (slug && opts.all) {
				defaultRuntime.error("Use either a skill slug or --all.");
				defaultRuntime.exit(1);
				return;
			}
			const target = resolveClawHubTargetWorkspace(command, opts);
			if (!target) return;
			const tracked = await readTrackedClawHubSkillSlugs(target.workspaceDir);
			if (opts.all && tracked.length === 0) {
				defaultRuntime.log("No tracked ClawHub skills to update.");
				return;
			}
			const results = await updateSkillsFromClawHub({
				workspaceDir: target.workspaceDir,
				slug,
				...opts.force ? { force: true } : {},
				...opts.forceInstall ? { forceInstall: true } : {},
				...resolveInstallPolicyWarningAcknowledgementCliOptions({ acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning }),
				...resolveSkillClawHubRiskOptions(opts.acknowledgeClawhubRisk === true || opts.acknowledgeClawHubRisk === true, "updating"),
				logger: {
					info: (message) => defaultRuntime.log(message),
					warn: (message) => defaultRuntime.log(formatSkillWarning(message))
				},
				config: target.config
			});
			let failed = false;
			for (const result of results) {
				if (!result.ok) {
					failed = true;
					if (result.code === "force_required") defaultRuntime.error(`${result.error} Re-run with --force to update it anyway.`);
					else if (!isClawHubSkillBlockedCliFailure(result)) defaultRuntime.error(result.error);
					continue;
				}
				if (result.changed) {
					defaultRuntime.log(`Updated ${result.slug}: ${result.previousVersion ?? "unknown"} -> ${result.version}`);
					continue;
				}
				defaultRuntime.log(`${result.slug} already at ${result.version}`);
			}
			if (failed) defaultRuntime.exit(1);
		} catch (err) {
			defaultRuntime.error(formatErrorMessage(err));
			defaultRuntime.exit(1);
		}
	});
	skills.command("verify").description("Verify a ClawHub skill with ClawHub").argument("<skill-ref>", "ClawHub skill ref (@owner/slug)").option("--version <version>", "Verify a specific version").option("--tag <tag>", "Verify a dist tag").option("--card", "Print the generated Skill Card Markdown", false).option("--json", "Output as JSON", false).option("--global", "Resolve installed skill metadata from the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").addHelpText("after", "\nExamples:\n  openclaw skills verify @owner/weather\n").action(async (slug, opts, command) => {
		let exitCode;
		const reportError = hasJsonOutput(opts) || opts.card !== true ? (message) => defaultRuntime.writeJson(formatCliJsonFailure(message)) : defaultRuntime.error;
		try {
			const workspace = resolveClawHubTargetWorkspace(command, opts, reportError);
			if (!workspace) return;
			const target = await resolveClawHubSkillVerificationTarget({
				workspaceDir: workspace.workspaceDir,
				slug,
				version: opts.version,
				tag: opts.tag
			});
			if (!target.ok) {
				reportError(target.error);
				exitCode = 1;
			} else {
				const result = await verifySkillWithClawHub({
					slug: target.slug,
					...target.ownerHandle ? { ownerHandle: target.ownerHandle } : {},
					...target.requestedReference ? { requestedReference: target.requestedReference } : {},
					version: target.version,
					tag: target.tag,
					baseUrl: target.baseUrl
				});
				if (!result.ok) {
					reportError(result.error);
					exitCode = 1;
				} else if (opts.card && !hasJsonOutput(opts)) {
					const verification = result.value;
					const cardUrl = readVerifiedSkillCardUrl(verification);
					if (!cardUrl.ok) {
						reportError(cardUrl.error);
						exitCode = 1;
					} else {
						const card = await fetchClawHubSkillCard({
							url: cardUrl.url,
							baseUrl: target.baseUrl
						});
						defaultRuntime.writeStdout(card.endsWith("\n") ? card : `${card}\n`);
						exitCode = shouldFailSkillVerification(verification) ? 1 : void 0;
					}
				} else {
					const verification = result.value;
					defaultRuntime.writeJson(buildSkillVerificationOutput(verification, target));
					exitCode = shouldFailSkillVerification(verification) ? 1 : void 0;
				}
			}
		} catch (err) {
			reportError(formatErrorMessage(err));
			defaultRuntime.exit(1);
			return;
		}
		if (exitCode) defaultRuntime.exit(exitCode);
	});
	const curator = skills.command("curator").description("Inspect skill usage and collection review outcomes").option("--json", "Output as JSON", false);
	const showCuratorStatus = async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const status = await callSkillCurator("status", {}, getSkillCuratorStatus);
			if (hasJsonOutput(opts) || inheritOptionFromParent(command, "json")) {
				defaultRuntime.writeJson(status);
				return;
			}
			defaultRuntime.writeStdout(formatSkillCuratorStatus(status));
		});
	};
	curator.command("status").description("Show skill usage and collection review status").action(showCuratorStatus);
	for (const action of [
		"pin",
		"unpin",
		"restore"
	]) curator.command(action).description(`${action} is retired; collection review manages skills`).argument("<skill>", "Skill name or key").action(async (skill) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await runSkillCuratorMutation(action, skill);
		});
	});
	for (const command of curator.commands) command.option("--json", "Output as JSON", false);
	curator.action(() => showCuratorStatus(curator.opts(), curator));
	const workshop = skills.command("workshop").description("Manage pending skill proposals").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)");
	const runWorkshopAction = async (opts, command, action, format) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await action(resolveSkillsWorkspaceForCommand(command, opts));
			if (hasJsonOutput(opts)) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.writeStdout(format(result));
		});
	};
	const runWorkshopDraftAction = (opts, command, action, format = (proposal) => `${proposal.record.id}\n`) => runWorkshopAction(opts, command, async ({ config, workspaceDir, agentId }) => {
		const draft = await readSkillProposalInput(opts);
		return await action({
			workspaceDir,
			agentId,
			eventActor: {
				type: "system",
				id: "cli"
			},
			config,
			content: draft.content,
			supportFiles: draft.supportFiles,
			description: opts.description,
			goal: opts.goal,
			evidence: opts.evidence
		});
	}, format);
	workshop.command("list").description("List pending and completed skill proposals").option("--json", "Output as JSON", false).action((opts, command) => runWorkshopAction(opts, command, ({ agentId, workspaceDir }) => listSkillProposals({
		agentId,
		workspaceDir
	}), formatSkillProposalList));
	workshop.command("inspect").description("Inspect a skill proposal").argument("<proposal-id>", "Skill proposal id").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, async ({ agentId, workspaceDir }) => {
		const proposal = await inspectSkillProposal(proposalId, {
			agentId,
			workspaceDir
		});
		if (!proposal) throw new Error(`Skill proposal not found: ${proposalId}`);
		return proposal;
	}, formatSkillProposalInspect));
	workshop.command("propose-create").description("Create a pending proposal for a new workspace skill").requiredOption("--name <name>", "Skill name").requiredOption("--description <description>", "Skill description").option("--proposal <path>", "Path to PROPOSAL.md draft content").option("--proposal-dir <path>", "Path to proposal directory with PROPOSAL.md and UTF-8 text support files").option("--goal <text>", "Proposal or improvement goal").option("--evidence <text>", "Evidence or notes for the proposal").option("--json", "Output as JSON", false).action((opts, command) => runWorkshopDraftAction(opts, command, (input) => proposeCreateSkill({
		...input,
		name: opts.name,
		description: opts.description,
		createdBy: "cli"
	})));
	workshop.command("propose-update").description("Create a pending proposal for an existing workspace skill").argument("<skill>", "Skill name or key").option("--proposal <path>", "Path to PROPOSAL.md draft content").option("--proposal-dir <path>", "Path to proposal directory with PROPOSAL.md and UTF-8 text support files").option("--description <text>", "Concise proposal description").option("--goal <text>", "Proposal or improvement goal").option("--evidence <text>", "Evidence or notes for the proposal").option("--json", "Output as JSON", false).action((skill, opts, command) => runWorkshopDraftAction(opts, command, (input) => proposeUpdateSkill({
		...input,
		skillName: skill,
		createdBy: "cli"
	})));
	workshop.command("revise").description("Revise a pending skill proposal").argument("<proposal-id>", "Skill proposal id").option("--proposal <path>", "Path to revised PROPOSAL.md draft content").option("--proposal-dir <path>", "Path to revised proposal directory with PROPOSAL.md and UTF-8 text support files").option("--description <description>", "Replacement proposal description").option("--goal <text>", "Replacement research or improvement goal").option("--evidence <text>", "Replacement evidence or notes for the proposal").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopDraftAction(opts, command, (input) => reviseSkillProposal({
		...input,
		proposalId
	}), (proposal) => `Revised ${proposal.record.id} ${proposal.record.proposedVersion}\n`));
	workshop.command("evaluate").description("Evaluate the exact current skill proposal through Gateway plugins").argument("<proposal-id>", "Skill proposal id").option("--correlation-id <id>", "External run or experiment correlation id").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, (resolved) => runSkillProposalEvaluate(resolved, proposalId, normalizeOptionalString(opts.correlationId)), formatSkillProposalEvaluation));
	workshop.command("apply").description("Apply a pending skill proposal").argument("<proposal-id>", "Skill proposal id").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, (resolved) => runSkillProposalApply(resolved, proposalId), (applied) => `Applied ${applied.record.id} -> ${applied.targetSkillFile}\n`));
	for (const [name, description, reasonDescription, verb, action] of [[
		"reject",
		"Reject a pending skill proposal",
		"Reason for rejection",
		"Rejected",
		rejectSkillProposal
	], [
		"quarantine",
		"Quarantine a skill proposal",
		"Reason for quarantine",
		"Quarantined",
		quarantineSkillProposal
	]]) workshop.command(name).description(description).argument("<proposal-id>", "Skill proposal id").option("--reason <text>", reasonDescription).option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, async ({ agentId, workspaceDir }) => {
		const reviewed = name === "reject" ? await inspectSkillProposal(proposalId, {
			agentId,
			workspaceDir
		}) : void 0;
		if (name === "reject" && !reviewed) throw new Error(`Skill proposal not found: ${proposalId}`);
		return action({
			agentId,
			eventActor: {
				type: "system",
				id: "cli"
			},
			workspaceDir,
			proposalId,
			...reviewed ? { expectedRevisionHash: reviewed.revisionHash } : {},
			reason: opts.reason
		});
	}, (record) => `${verb} ${record.id}\n`));
	for (const command of workshop.commands) command.option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)");
	applyParentDefaultHelpAction(workshop);
	skills.command("list").description("List all available skills").option("--json", "Output as JSON", false).option("--eligible", "Show only eligible (ready to use) skills", false).option("-v, --verbose", "Show more details including missing requirements", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(async (opts, command) => {
		await runSkillsAction((report) => formatSkillsList(report, {
			...opts,
			json: hasJsonOutput(opts)
		}), { agentId: resolveAgentOption(command, opts) });
	});
	skills.command("info").description("Show detailed information about a skill").argument("<name>", "Skill name").option("--json", "Output as JSON", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(async (name, opts, command) => {
		let skillFound = false;
		await runSkillsAction((report) => {
			skillFound = resolveSkillStatusEntry(report.skills, name) !== null;
			return formatSkillInfo(report, name, {
				...opts,
				json: hasJsonOutput(opts)
			});
		}, { agentId: resolveAgentOption(command, opts) });
		if (!skillFound) defaultRuntime.exit(1);
	});
	skills.command("check").description("Check which skills are ready, visible, or missing requirements").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--json", "Output as JSON", false).action(async (opts, command) => {
		await runSkillsAction((report) => formatSkillsCheck(report, {
			...opts,
			json: hasJsonOutput(opts)
		}), { agentId: resolveAgentOption(command, opts) });
	});
	skills.action(async (opts, command) => {
		await runSkillsAction((report) => formatSkillsList(report, { json: hasJsonOutput(opts) }), { agentId: resolveAgentOption(command, opts) });
	});
}
//#endregion
export { formatSkillInfo, formatSkillsCheck, formatSkillsList, registerSkillsCli };
