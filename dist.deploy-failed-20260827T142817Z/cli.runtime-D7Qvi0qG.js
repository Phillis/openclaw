import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { m as shortenHomePath, p as shortenHomeInString } from "./utils-DEqefz4f.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { a as listAgentIds, p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { u as isUsageCountedSessionTranscriptFileName } from "./artifacts-Cg2BoGvO.js";
import { l as resolveSessionTranscriptsDirForAgent } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { D as resolveMemoryRemDreamingConfig, E as resolveMemoryLightDreamingConfig, S as resolveMemoryDreamingConfig } from "./dreaming-BMAUTQQQ.js";
import { c as listMemoryFiles, d as normalizeExtraMemoryPaths, u as normalizeExtraMemoryPathEntries } from "./internal-Cl2Vig4G.js";
import { t as resolveMemorySearchStaleness } from "./types-Dpy5yVLQ.js";
import { t as buildAgentSessionKey } from "./resolve-route-CUq-ePT_.js";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DSogQgBi.js";
import "./temp-path-ChKDkme1.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import "./agent-runtime-C-ueAbwA.js";
import { i as withProgressTotals, r as withProgress } from "./progress-F0nzmXYd.js";
import { r as withManager } from "./cli-utils-NPN0egNa.js";
import "./memory-core-host-engine-sessions-Cj19V1r5.js";
import "./memory-core-host-engine-storage-DkHq3pRi.js";
import "./memory-core-host-status-DrMh3wbR.js";
import "./memory-core-host-runtime-cli-YO_0N81F.js";
import "./memory-core-host-runtime-core-rWQQzcsn.js";
import "./memory-core-host-runtime-files-BleNSuEk.js";
import { n as resolveShortTermPromotionDreamingConfig } from "./dreaming-CmdFTgDo.js";
import { i as removeBackfillDiaryEntries, o as writeBackfillDiaryEntries } from "./dreaming-narrative-TFOZj8oK.js";
import { t as previewGroundedRemMarkdown } from "./rem-evidence-BtG4JfAO.js";
import { a as resolveShortTermRecallLockPath, d as recordShortTermRecalls, i as repairShortTermPromotionArtifacts, n as auditShortTermPromotionArtifacts, o as resolveShortTermRecallStorePath, r as removeGroundedShortTermCandidates, s as applyShortTermPromotions, t as rankShortTermPromotionCandidates, u as recordGroundedShortTermCandidates } from "./short-term-promotion-zxkUaPuQ.js";
import { i as seedHistoricalDailyMemorySignals } from "./dreaming-phases-q0lNwM2Y.js";
import { t as previewRemHarness } from "./rem-harness-Ce-2XwOX.js";
import { t as formatMemoryVectorDegradedWriteReason } from "./manager-vector-warning-sigvojo6.js";
import { r as getMemorySearchManager } from "./memory-DV0ztLK3.js";
import { n as repairDreamingArtifacts, t as auditDreamingArtifacts } from "./dreaming-repair-fVB89FuK.js";
import { r as runSessionBackfill } from "./session-backfill-DDxLDA5G.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region extensions/memory-core/src/cli-runtime-common.ts
const { warn: warn$3 } = theme;
function getMemoryCommandSecretTargetIds() {
	return /* @__PURE__ */ new Set(["memory.search.remote.apiKey", "agents.entries.*.memory.search.remote.apiKey"]);
}
function isMemorySecretOwnerFailure(error, message) {
	const candidate = error && typeof error === "object" ? error : {};
	if (candidate.ownerKind === "capability" && typeof candidate.ownerId === "string" && candidate.ownerId.startsWith("memory-provider:")) return true;
	if (Array.isArray(candidate.paths) && candidate.paths.some((entry) => typeof entry === "string" && entry.includes("memory.search.remote.apiKey"))) return true;
	return message.includes("capability:memory-provider:");
}
async function loadMemoryCommandConfig(commandName, mode) {
	const config = getRuntimeConfig({ skipPluginValidation: true });
	try {
		const { resolvedConfig, diagnostics } = await resolveCommandSecretRefsViaGateway({
			config,
			commandName,
			targetIds: getMemoryCommandSecretTargetIds(),
			...mode ? { mode } : {}
		});
		return {
			config: resolvedConfig,
			diagnostics
		};
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
		const message = formatErrorMessage(error);
		if (mode !== "read_only_status" || isMemorySecretOwnerFailure(error, message) || code !== "SECRET_SURFACE_UNAVAILABLE" && !message.includes("SECRET_SURFACE_UNAVAILABLE")) throw error;
		return {
			config,
			diagnostics: [`${commandName}: ${message}; continuing with degraded read-only config so healthy memory surfaces remain visible.`]
		};
	}
}
function emitMemorySecretResolveDiagnostics(diagnostics, params) {
	if (diagnostics.length === 0) return;
	const toStderr = params?.json === true;
	for (const entry of diagnostics) {
		const message = warn$3(`[secrets] ${entry}`);
		if (toStderr) defaultRuntime.error(message);
		else defaultRuntime.log(message);
	}
}
function resolveMemoryPluginConfig(cfg) {
	return asNullableRecord(asNullableRecord(cfg.plugins?.entries?.["memory-core"])?.config) ?? {};
}
function formatAuditCounts(audit) {
	const scriptCoverage = audit.conceptTagScripts ? [
		audit.conceptTagScripts.latinEntryCount > 0 ? `${audit.conceptTagScripts.latinEntryCount} latin` : null,
		audit.conceptTagScripts.cjkEntryCount > 0 ? `${audit.conceptTagScripts.cjkEntryCount} cjk` : null,
		audit.conceptTagScripts.mixedEntryCount > 0 ? `${audit.conceptTagScripts.mixedEntryCount} mixed` : null,
		audit.conceptTagScripts.otherEntryCount > 0 ? `${audit.conceptTagScripts.otherEntryCount} other` : null
	].filter(Boolean).join(", ") : "";
	const suffix = scriptCoverage ? ` · scripts=${scriptCoverage}` : "";
	return `${audit.entryCount} entries · ${audit.promotedCount} promoted · ${audit.conceptTaggedEntryCount} concept-tagged · ${audit.spacedEntryCount} spaced${suffix}`;
}
function resolveAgent(cfg, agent) {
	const trimmed = agent?.trim();
	if (trimmed) return trimmed;
	return resolveDefaultAgentId(cfg);
}
function buildCliMemorySearchSessionKey(agentId) {
	return buildAgentSessionKey({
		agentId,
		channel: "cli",
		peer: {
			kind: "direct",
			id: "memory-search"
		},
		dmScope: "per-channel-peer"
	});
}
function resolveAgentIds(cfg, agent) {
	const trimmed = agent?.trim();
	if (trimmed) return [trimmed];
	return listAgentIds(cfg);
}
function formatExtraPaths(workspaceDir, extraPaths) {
	return normalizeExtraMemoryPathEntries(workspaceDir, extraPaths).map((entry) => {
		const root = shortenHomePath(entry.path);
		return entry.pattern ? `${root} (pattern: ${entry.pattern})` : root;
	});
}
async function withMemoryManagerForAgent(params) {
	const managerParams = {
		cfg: params.cfg,
		agentId: params.agentId
	};
	if (params.purpose) managerParams.purpose = params.purpose;
	if (params.acquireLocalService) managerParams.acquireLocalService = params.acquireLocalService;
	await withManager({
		getManager: () => getMemorySearchManager(managerParams),
		onMissing: (error) => defaultRuntime.log(error ?? "Memory search disabled."),
		onCloseError: (err) => defaultRuntime.error(`Memory manager close failed: ${formatErrorMessage(err)}`),
		close: async (manager) => {
			await manager.close?.();
		},
		run: params.run
	});
}
async function withMemoryCommand(params) {
	const { config: cfg, diagnostics } = await loadMemoryCommandConfig(params.commandName, params.purpose === "status" ? "read_only_status" : void 0);
	emitMemorySecretResolveDiagnostics(diagnostics, { json: params.diagnosticsToStderr });
	const agentIds = params.allAgents ? resolveAgentIds(cfg, params.agent) : [resolveAgent(cfg, params.agent)];
	for (const agentId of agentIds) await withMemoryManagerForAgent({
		cfg,
		agentId,
		purpose: params.purpose,
		acquireLocalService: params.acquireLocalService,
		run: async (manager) => params.run({
			manager,
			cfg,
			agentId
		})
	});
	return cfg;
}
async function checkReadableFile(pathname) {
	try {
		await fs$1.access(pathname, fs.constants.R_OK);
		return { exists: true };
	} catch (err) {
		const code = err.code;
		if (code === "ENOENT") return { exists: false };
		return {
			exists: true,
			issue: `${shortenHomePath(pathname)} not readable (${code ?? "error"})`
		};
	}
}
async function scanSessionFiles(agentId) {
	const issues = [];
	const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);
	try {
		return {
			source: "sessions",
			totalFiles: (await fs$1.readdir(sessionsDir, { withFileTypes: true })).filter((entry) => entry.isFile() && isUsageCountedSessionTranscriptFileName(entry.name)).length,
			issues
		};
	} catch (err) {
		const code = err.code;
		if (code === "ENOENT") {
			issues.push(`sessions directory missing (${shortenHomePath(sessionsDir)})`);
			return {
				source: "sessions",
				totalFiles: 0,
				issues
			};
		}
		issues.push(`sessions directory not accessible (${shortenHomePath(sessionsDir)}): ${code ?? "error"}`);
		return {
			source: "sessions",
			totalFiles: null,
			issues
		};
	}
}
async function scanMemoryFiles(workspaceDir, extraPaths = []) {
	const issues = [];
	const memoryFile = path.join(workspaceDir, "MEMORY.md");
	const memoryDir = path.join(workspaceDir, "memory");
	const primary = await checkReadableFile(memoryFile);
	if (primary.issue) issues.push(primary.issue);
	const resolvedExtraPaths = normalizeExtraMemoryPaths(workspaceDir, extraPaths);
	for (const extraPath of resolvedExtraPaths) try {
		if ((await fs$1.lstat(extraPath)).isSymbolicLink()) continue;
		const extraCheck = await checkReadableFile(extraPath);
		if (extraCheck.issue) issues.push(extraCheck.issue);
	} catch (err) {
		const code = err.code;
		if (code === "ENOENT") issues.push(`additional memory path missing (${shortenHomePath(extraPath)})`);
		else issues.push(`additional memory path not accessible (${shortenHomePath(extraPath)}): ${code ?? "error"}`);
	}
	let dirReadable;
	try {
		await fs$1.access(memoryDir, fs.constants.R_OK);
		dirReadable = true;
	} catch (err) {
		const code = err.code;
		if (code === "ENOENT") {
			issues.push(`memory directory missing (${shortenHomePath(memoryDir)})`);
			dirReadable = false;
		} else {
			issues.push(`memory directory not accessible (${shortenHomePath(memoryDir)}): ${code ?? "error"}`);
			dirReadable = null;
		}
	}
	let listed = [];
	let listedOk = false;
	try {
		listed = await listMemoryFiles(workspaceDir, extraPaths);
		listedOk = true;
	} catch (err) {
		const code = err.code;
		if (dirReadable !== null) {
			issues.push(`memory directory scan failed (${shortenHomePath(memoryDir)}): ${code ?? "error"}`);
			dirReadable = null;
		}
	}
	let totalFiles;
	if (dirReadable === null) totalFiles = null;
	else {
		const files = new Set(listedOk ? listed : []);
		if (!listedOk) {
			if (primary.exists) files.add(memoryFile);
		}
		totalFiles = files.size;
	}
	if ((totalFiles ?? 0) === 0 && issues.length === 0) issues.push(`no memory files found in ${shortenHomePath(workspaceDir)}`);
	return {
		source: "memory",
		totalFiles,
		issues
	};
}
async function scanMemorySources(params) {
	const scans = [];
	const extraPaths = params.extraPaths ?? [];
	for (const source of params.sources) {
		if (source === "memory") scans.push(await scanMemoryFiles(params.workspaceDir, extraPaths));
		if (source === "sessions") scans.push(await scanSessionFiles(params.agentId));
	}
	const issues = scans.flatMap((scan) => scan.issues);
	const totals = scans.map((scan) => scan.totalFiles);
	const numericTotals = totals.filter((total) => total !== null);
	return {
		sources: scans,
		totalFiles: totals.some((total) => total === null) ? null : numericTotals.reduce((sum, total) => sum + total, 0),
		issues
	};
}
async function scanMemoryManagerSources(status, agentId) {
	const workspaceDir = status.workspaceDir;
	if (!workspaceDir) return;
	return await scanMemorySources({
		workspaceDir,
		agentId,
		sources: status.sources?.length ? status.sources : ["memory"],
		extraPaths: status.extraPaths
	});
}
function formatMemoryIndexOutcome(status, scan, agentId) {
	if (status.workspaceDir && scan?.totalFiles === 0) return `No memory files found in ${shortenHomePath(status.workspaceDir)}; nothing indexed (${agentId}).`;
	const indexedFiles = status.files ?? 0;
	return `Memory index updated (${agentId}): ${indexedFiles} ${indexedFiles === 1 ? "file" : "files"} indexed.`;
}
//#endregion
//#region extensions/memory-core/src/cli-index-search.runtime.ts
const { accent: accent$1, heading: heading$2, info: info$1, muted: muted$2, success: success$1, warn: warn$2 } = theme;
function formatSourceLabel(source, workspaceDir, agentId) {
	if (source === "memory") return shortenHomeInString(`memory (MEMORY.md + ${path.join(workspaceDir, "memory")}${path.sep}*.md)`);
	if (source === "sessions") {
		const stateDir = resolveStateDir(process.env, os.homedir);
		return shortenHomeInString(`sessions (${path.join(stateDir, "agents", agentId, "sessions")}${path.sep}*.jsonl)`);
	}
	return source;
}
async function runMemoryIndex(opts, hostOptions) {
	setVerbose(Boolean(opts.verbose));
	await withMemoryCommand({
		commandName: "memory index",
		agent: opts.agent,
		allAgents: true,
		purpose: "cli",
		...hostOptions,
		run: async ({ manager, agentId }) => {
			try {
				const syncFn = manager.sync ? manager.sync.bind(manager) : void 0;
				if (opts.verbose) {
					const status = manager.status();
					const label = (text) => muted$2(`${text}:`);
					const sourceLabels = (status.sources ?? []).map((source) => formatSourceLabel(source, status.workspaceDir ?? "", agentId));
					const extraPaths = status.workspaceDir ? formatExtraPaths(status.workspaceDir, status.extraPaths ?? []) : [];
					const requestedProvider = status.requestedProvider ?? status.provider;
					const modelLabel = status.model ?? status.provider;
					const lines = [
						`${heading$2("Memory Index")} ${muted$2(`(${agentId})`)}`,
						`${label("Provider")} ${info$1(status.provider)} ${muted$2(`(requested: ${requestedProvider})`)}`,
						`${label("Model")} ${info$1(modelLabel)}`,
						sourceLabels.length ? `${label("Sources")} ${info$1(sourceLabels.join(", "))}` : null,
						extraPaths.length ? `${label("Extra paths")} ${info$1(extraPaths.join(", "))}` : null
					].filter(Boolean);
					if (status.fallback) lines.push(`${label("Fallback")} ${warn$2(status.fallback.from)}`);
					defaultRuntime.log(lines.join("\n"));
					defaultRuntime.log("");
				}
				const startedAt = Date.now();
				let lastLabel = "Indexing memory…";
				let lastCompleted = 0;
				let lastTotal = 0;
				const formatDuration = (elapsedMs) => {
					const seconds = Math.floor(elapsedMs / 1e3);
					return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
				};
				const buildLabel = () => {
					const elapsedMs = Math.max(1, Date.now() - startedAt);
					const elapsed = formatDuration(elapsedMs);
					if (lastTotal <= 0 || lastCompleted <= 0) return `${lastLabel} · elapsed ${elapsed}`;
					const remainingMs = Math.max(0, (lastTotal - lastCompleted) * elapsedMs / lastCompleted);
					return `${lastLabel} · elapsed ${elapsed} · eta ${formatDuration(remainingMs)}`;
				};
				if (!syncFn) {
					defaultRuntime.log("Memory backend does not support manual reindex.");
					return;
				}
				await withProgressTotals({
					label: "Indexing memory…",
					total: 0,
					fallback: opts.verbose ? "line" : void 0
				}, async (update, progress) => {
					const interval = setInterval(() => {
						progress.setLabel(buildLabel());
					}, 1e3);
					try {
						await syncFn({
							reason: "cli",
							force: Boolean(opts.force),
							progress: (syncUpdate) => {
								if (syncUpdate.label) lastLabel = syncUpdate.label;
								lastCompleted = syncUpdate.completed;
								lastTotal = syncUpdate.total;
								update({
									completed: syncUpdate.completed,
									total: syncUpdate.total,
									label: buildLabel()
								});
								progress.setLabel(buildLabel());
							}
						});
					} finally {
						clearInterval(interval);
					}
				});
				let postIndexStatus = manager.status();
				const scan = await scanMemoryManagerSources(postIndexStatus, agentId);
				const outcome = formatMemoryIndexOutcome(postIndexStatus, scan, agentId);
				let semanticVectorAvailable = postIndexStatus.vector?.semanticAvailable;
				const vectorStoreAvailable = postIndexStatus.vector?.storeAvailable ?? postIndexStatus.vector?.available;
				if (postIndexStatus.backend === "builtin" && (postIndexStatus.vector?.enabled ?? false) && semanticVectorAvailable === void 0 && vectorStoreAvailable !== false && typeof manager.probeVectorAvailability === "function") {
					semanticVectorAvailable = await manager.probeVectorAvailability();
					postIndexStatus = manager.status();
					semanticVectorAvailable = postIndexStatus.vector?.semanticAvailable ?? semanticVectorAvailable;
				}
				const vectorEnabled = postIndexStatus.vector?.enabled ?? false;
				const vectorAvailable = semanticVectorAvailable ?? postIndexStatus.vector?.semanticAvailable ?? postIndexStatus.vector?.available ?? postIndexStatus.vector?.storeAvailable;
				const vectorLoadErr = postIndexStatus.vector?.loadError;
				defaultRuntime.log(outcome);
				if (vectorEnabled && vectorAvailable === false) defaultRuntime.error(`Memory index WARNING (${agentId}): chunks_vec not updated — ${formatMemoryVectorDegradedWriteReason(vectorLoadErr)}. Vector recall degraded.`);
			} catch (err) {
				const message = formatErrorMessage(err);
				defaultRuntime.error(`Memory index failed (${agentId}): ${message}`);
				process.exitCode = 1;
			}
		}
	});
}
async function runMemorySearch(queryArg, opts, hostOptions) {
	const query = opts.query ?? queryArg;
	if (!query) {
		defaultRuntime.error("Missing search query. Provide a positional query or use --query <text>.");
		process.exitCode = 1;
		return;
	}
	await withMemoryCommand({
		commandName: "memory search",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: "cli",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const memoryPluginConfig = resolveMemoryPluginConfig(cfg);
			const dreamingEnabled = resolveMemoryDreamingConfig({
				pluginConfig: memoryPluginConfig,
				cfg
			}).enabled;
			const dreaming = resolveShortTermPromotionDreamingConfig({
				pluginConfig: memoryPluginConfig,
				cfg
			});
			const sessionKey = buildCliMemorySearchSessionKey(agentId);
			let results;
			try {
				results = await manager.search(query, {
					maxResults: opts.maxResults,
					minScore: opts.minScore,
					sessionKey
				});
			} catch (err) {
				const message = formatErrorMessage(err);
				defaultRuntime.error(`Memory search failed: ${message}`);
				process.exitCode = 1;
				return;
			}
			const status = manager.status();
			const staleness = resolveMemorySearchStaleness(status, agentId);
			const workspaceDir = status.workspaceDir;
			if (dreamingEnabled) await recordShortTermRecalls({
				workspaceDir,
				query,
				results,
				timezone: dreaming.timezone
			}).catch(() => {});
			if (opts.json) {
				defaultRuntime.writeJson({
					results,
					...staleness
				});
				return;
			}
			if (staleness) defaultRuntime.error(`${staleness.warning} ${staleness.action}`);
			if (results.length === 0) {
				defaultRuntime.log("No matches.");
				return;
			}
			const lines = [];
			for (const result of results) {
				lines.push(`${success$1(result.score.toFixed(3))} ${accent$1(`${shortenHomePath(result.path)}:${result.startLine}-${result.endLine}`)}`);
				lines.push(muted$2(result.snippet));
				lines.push("");
			}
			defaultRuntime.log(lines.join("\n").trim());
		}
	});
}
function matchesPromotionSelector(candidate, selector) {
	const trimmed = selector.trim().toLowerCase();
	if (!trimmed) return false;
	return candidate.key.toLowerCase() === trimmed || candidate.key.toLowerCase().includes(trimmed) || candidate.path.toLowerCase().includes(trimmed) || candidate.snippet.toLowerCase().includes(trimmed);
}
async function runMemoryPromote(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory promote",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			const dreaming = resolveShortTermPromotionDreamingConfig({
				pluginConfig: resolveMemoryPluginConfig(cfg),
				cfg
			});
			if (!workspaceDir) {
				defaultRuntime.error("Memory promote requires a resolvable workspace directory.");
				process.exitCode = 1;
				return;
			}
			let candidates;
			try {
				candidates = await rankShortTermPromotionCandidates({
					workspaceDir,
					limit: opts.limit,
					minScore: opts.minScore ?? dreaming.minScore,
					minRecallCount: opts.minRecallCount ?? dreaming.minRecallCount,
					minUniqueQueries: opts.minUniqueQueries ?? dreaming.minUniqueQueries,
					recencyHalfLifeDays: dreaming.recencyHalfLifeDays,
					maxAgeDays: dreaming.maxAgeDays,
					includePromoted: Boolean(opts.includePromoted)
				});
			} catch (err) {
				defaultRuntime.error(`Memory promote ranking failed: ${formatErrorMessage(err)}`);
				process.exitCode = 1;
				return;
			}
			let applyResult;
			if (opts.apply) try {
				applyResult = await applyShortTermPromotions({
					workspaceDir,
					candidates,
					limit: opts.limit,
					minScore: opts.minScore ?? dreaming.minScore,
					minRecallCount: opts.minRecallCount ?? dreaming.minRecallCount,
					minUniqueQueries: opts.minUniqueQueries ?? dreaming.minUniqueQueries,
					maxAgeDays: dreaming.maxAgeDays,
					maxPromotedSnippetTokens: dreaming.maxPromotedSnippetTokens,
					timezone: dreaming.timezone
				});
			} catch (err) {
				defaultRuntime.error(`Memory promote apply failed: ${formatErrorMessage(err)}`);
				process.exitCode = 1;
				return;
			}
			const storePath = resolveShortTermRecallStorePath(workspaceDir);
			const lockPath = resolveShortTermRecallLockPath(workspaceDir);
			const audit = await auditShortTermPromotionArtifacts({ workspaceDir });
			if (opts.json) {
				defaultRuntime.writeJson({
					workspaceDir,
					storePath,
					lockPath,
					audit,
					candidates,
					apply: applyResult ? {
						applied: applyResult.applied,
						appended: applyResult.appended,
						reconciledExisting: applyResult.reconciledExisting,
						memoryPath: applyResult.memoryPath,
						appliedCandidates: applyResult.appliedCandidates
					} : void 0
				});
				return;
			}
			if (candidates.length === 0) {
				defaultRuntime.log("No short-term recall candidates.");
				defaultRuntime.log(`Recall store: ${shortenHomePath(storePath)}`);
				if (audit.issues.length > 0) for (const issue of audit.issues) defaultRuntime.log(issue.message);
				return;
			}
			const lines = [];
			lines.push(`${heading$2("Short-Term Promotion Candidates")} ${muted$2(`(${agentId})`)}`);
			lines.push(`${muted$2("Recall store:")} ${shortenHomePath(storePath)}`);
			lines.push(muted$2(`Store health: ${formatAuditCounts(audit)}`));
			for (const candidate of candidates) {
				lines.push(`${success$1(candidate.score.toFixed(3))} ${accent$1(`${shortenHomePath(candidate.path)}:${candidate.startLine}-${candidate.endLine}`)}`);
				lines.push(muted$2(`signals=${candidate.signalCount} recalls=${candidate.recallCount} avg=${candidate.avgScore.toFixed(3)} queries=${candidate.uniqueQueries} age=${candidate.ageDays.toFixed(1)}d consolidate=${candidate.components.consolidation.toFixed(2)} conceptual=${candidate.components.conceptual.toFixed(2)}`));
				if (candidate.conceptTags.length > 0) lines.push(muted$2(`concepts=${candidate.conceptTags.join(", ")}`));
				if (candidate.snippet) lines.push(muted$2(candidate.snippet));
				lines.push("");
			}
			if (audit.issues.length > 0) {
				lines.push(warn$2("Audit issues:"));
				for (const issue of audit.issues) lines.push((issue.severity === "error" ? warn$2 : muted$2)(issue.message));
				lines.push("");
			}
			if (applyResult) if (applyResult.applied > 0) {
				lines.push(success$1(`Processed ${applyResult.applied} candidate(s) for ${shortenHomePath(applyResult.memoryPath)}.`));
				lines.push(muted$2(`appended=${applyResult.appended} reconciledExisting=${applyResult.reconciledExisting}`));
			} else lines.push(warn$2("No candidates met apply criteria."));
			defaultRuntime.log(lines.join("\n").trim());
		}
	});
}
async function runMemoryPromoteExplain(selectorArg, opts, hostOptions) {
	const selector = selectorArg?.trim();
	if (!selector) {
		defaultRuntime.error("Memory promote-explain requires a non-empty selector.");
		process.exitCode = 1;
		return;
	}
	await withMemoryCommand({
		commandName: "memory promote-explain",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			const dreaming = resolveShortTermPromotionDreamingConfig({
				pluginConfig: resolveMemoryPluginConfig(cfg),
				cfg
			});
			if (!workspaceDir) {
				defaultRuntime.error("Memory promote-explain requires a resolvable workspace directory.");
				process.exitCode = 1;
				return;
			}
			let candidates;
			try {
				candidates = await rankShortTermPromotionCandidates({
					workspaceDir,
					minScore: 0,
					minRecallCount: 0,
					minUniqueQueries: 0,
					includePromoted: Boolean(opts.includePromoted),
					recencyHalfLifeDays: dreaming.recencyHalfLifeDays,
					maxAgeDays: dreaming.maxAgeDays
				});
			} catch (err) {
				defaultRuntime.error(`Memory promote-explain failed: ${formatErrorMessage(err)}`);
				process.exitCode = 1;
				return;
			}
			const candidate = candidates.find((entry) => matchesPromotionSelector(entry, selector));
			if (!candidate) {
				defaultRuntime.error(`No promotion candidate matched "${selector}".`);
				process.exitCode = 1;
				return;
			}
			const thresholds = {
				minScore: dreaming.minScore,
				minRecallCount: dreaming.minRecallCount,
				minUniqueQueries: dreaming.minUniqueQueries,
				maxAgeDays: dreaming.maxAgeDays ?? null
			};
			if (opts.json) {
				defaultRuntime.writeJson({
					workspaceDir,
					thresholds,
					candidate,
					passes: {
						score: candidate.score >= thresholds.minScore,
						recallCount: candidate.signalCount >= thresholds.minRecallCount,
						uniqueQueries: candidate.uniqueQueries >= thresholds.minUniqueQueries,
						maxAge: thresholds.maxAgeDays === null ? true : candidate.ageDays <= thresholds.maxAgeDays
					}
				});
				return;
			}
			const lines = [
				`${heading$2("Promotion Explain")} ${muted$2("(" + agentId + ")")}`,
				accent$1(candidate.key),
				muted$2(`${shortenHomePath(candidate.path)}:${String(candidate.startLine)}-${String(candidate.endLine)}`),
				candidate.snippet,
				muted$2(`score=${candidate.score.toFixed(3)} signals=${candidate.signalCount} recalls=${candidate.recallCount} uniqueQueries=${candidate.uniqueQueries} ageDays=${candidate.ageDays.toFixed(1)}`),
				muted$2(`components: frequency=${candidate.components.frequency.toFixed(2)} relevance=${candidate.components.relevance.toFixed(2)} diversity=${candidate.components.diversity.toFixed(2)} recency=${candidate.components.recency.toFixed(2)} consolidation=${candidate.components.consolidation.toFixed(2)} conceptual=${candidate.components.conceptual.toFixed(2)}`),
				muted$2(`thresholds: minScore=${thresholds.minScore} minRecallCount=${thresholds.minRecallCount} minUniqueQueries=${thresholds.minUniqueQueries} maxAgeDays=${thresholds.maxAgeDays ?? "none"}`)
			];
			if (candidate.conceptTags.length > 0) lines.push(muted$2(`concepts=${candidate.conceptTags.join(", ")}`));
			defaultRuntime.log(lines.join("\n"));
		}
	});
}
//#endregion
//#region extensions/memory-core/src/cli-rem.runtime.ts
const { heading: heading$1, muted: muted$1, warn: warn$1 } = theme;
async function runMemorySessionBackfill(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory session-backfill",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			if (!workspaceDir) {
				defaultRuntime.error("Memory session-backfill requires a resolvable workspace directory.");
				process.exitCode = 1;
				return;
			}
			if (opts.rollback && (opts.apply || opts.rem || opts.from || opts.to || opts.archiveFiles?.length)) {
				defaultRuntime.error("Memory session-backfill --rollback cannot be combined with input, range, --rem, or --apply options.");
				process.exitCode = 1;
				return;
			}
			const remConfig = resolveMemoryRemDreamingConfig({
				pluginConfig: resolveMemoryPluginConfig(cfg),
				cfg
			});
			let result;
			try {
				result = await runSessionBackfill({
					agentId,
					workspaceDir,
					...opts.from !== void 0 ? { from: opts.from } : {},
					...opts.to !== void 0 ? { to: opts.to } : {},
					...opts.limitDays !== void 0 ? { limitDays: opts.limitDays } : {},
					...opts.rem !== void 0 ? { rem: opts.rem } : {},
					...opts.apply !== void 0 ? { apply: opts.apply } : {},
					...opts.rollback !== void 0 ? { rollback: opts.rollback } : {},
					...opts.archiveFiles !== void 0 ? { archiveFiles: opts.archiveFiles } : {},
					...remConfig.timezone !== void 0 ? { timezone: remConfig.timezone } : {}
				});
			} catch (error) {
				defaultRuntime.error(error instanceof Error ? error.message : String(error));
				process.exitCode = 1;
				return;
			}
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			if (result.rollback) {
				defaultRuntime.log([
					`${heading$1("Session Backfill")} ${muted$1("(rollback)")}`,
					muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
					muted$1(`removedDiaryEntries=${result.rollback.removedDiaryEntries}`),
					muted$1(`removedStagedEntries=${result.rollback.removedStagedEntries}`)
				].join("\n"));
				return;
			}
			const lines = [
				`${heading$1("Session Backfill")} ${muted$1(`(${agentId})`)}`,
				muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
				muted$1(`batches=${result.batchCount ?? 1} days=${result.days.length} candidates=${result.candidateCount} staged=${result.stagedEntries}`)
			];
			for (const batch of result.batches ?? []) lines.push(muted$1(`batch=${batch.batch} days=${batch.days} candidates=${batch.candidates} staged=${batch.stagedEntries}`));
			for (const day of result.days) {
				lines.push("", heading$1(day.day), muted$1(`candidates=${day.candidateCount}`));
				lines.push(...day.topCandidates.map((candidate) => `- ${candidate}`));
			}
			if (result.days.length === 0) lines.push("", "No new hash-untracked trusted session candidates.");
			if (!result.applied && !result.rem) lines.push("", muted$1("Dry run; use --apply to stage candidates."));
			defaultRuntime.log(lines.join("\n"));
		}
	});
}
async function runMemoryRemHarness(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory rem-harness",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const managerWorkspaceDir = manager.status().workspaceDir?.trim();
			const pluginConfig = resolveMemoryPluginConfig(cfg);
			if (!managerWorkspaceDir && !opts.path) {
				defaultRuntime.error("Memory rem-harness requires a resolvable workspace directory.");
				process.exitCode = 1;
				return;
			}
			const remConfig = resolveMemoryRemDreamingConfig({
				pluginConfig,
				cfg
			});
			const nowMs = Date.now();
			let workspaceDir = managerWorkspaceDir ?? "";
			let sourceFiles = [];
			let groundedInputPaths = [];
			let importedFileCount = 0;
			let importedSignalCount = 0;
			let skippedPaths = [];
			let cleanupWorkspaceDir = null;
			if (opts.path) {
				const historical = await createHistoricalRemHarnessWorkspace({
					inputPath: opts.path,
					remLimit: remConfig.limit,
					nowMs,
					timezone: remConfig.timezone
				});
				workspaceDir = historical.workspaceDir;
				cleanupWorkspaceDir = historical.workspaceDir;
				sourceFiles = historical.sourceFiles;
				groundedInputPaths = historical.workspaceSourceFiles;
				importedFileCount = historical.importedFileCount;
				importedSignalCount = historical.importedSignalCount;
				skippedPaths = historical.skippedPaths;
				if (sourceFiles.length === 0) {
					await fs$1.rm(historical.workspaceDir, {
						recursive: true,
						force: true
					});
					defaultRuntime.error(`Memory rem-harness found no YYYY-MM-DD.md files at ${shortenHomePath(path.resolve(opts.path))}.`);
					process.exitCode = 1;
					return;
				}
			}
			if (!workspaceDir) {
				defaultRuntime.error("Memory rem-harness requires a resolvable workspace directory.");
				process.exitCode = 1;
				return;
			}
			try {
				const preview = await previewRemHarness({
					workspaceDir,
					cfg,
					pluginConfig,
					grounded: Boolean(opts.grounded),
					groundedInputPaths,
					includePromoted: Boolean(opts.includePromoted),
					nowMs
				});
				groundedInputPaths = preview.groundedInputPaths;
				const remPreview = preview.rem;
				const groundedPreview = preview.grounded;
				const deepCandidates = preview.deep.candidates;
				if (opts.json) {
					defaultRuntime.writeJson({
						workspaceDir,
						sourcePath: opts.path ? path.resolve(opts.path) : null,
						sourceFiles,
						historicalImport: opts.path ? {
							importedFileCount,
							importedSignalCount,
							skippedPaths
						} : null,
						remConfig: preview.remConfig,
						deepConfig: {
							minScore: preview.deepConfig.minScore,
							minRecallCount: preview.deepConfig.minRecallCount,
							minUniqueQueries: preview.deepConfig.minUniqueQueries,
							recencyHalfLifeDays: preview.deepConfig.recencyHalfLifeDays,
							maxAgeDays: preview.deepConfig.maxAgeDays ?? null,
							maxPromotedSnippetTokens: preview.deepConfig.maxPromotedSnippetTokens
						},
						rem: {
							skipped: preview.remSkipped,
							...remPreview
						},
						grounded: groundedPreview,
						deep: {
							candidateCount: preview.deep.candidateCount,
							candidates: deepCandidates
						}
					});
					return;
				}
				const lines = [
					`${heading$1("REM Harness")} ${muted$1(`(${agentId})`)}`,
					muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
					...opts.path ? [
						muted$1(`sourcePath=${shortenHomePath(path.resolve(opts.path))}`),
						muted$1(`historicalFiles=${sourceFiles.length} importedFiles=${importedFileCount} importedSignals=${importedSignalCount}`),
						...skippedPaths.length > 0 ? [warn$1(`skipped=${skippedPaths.map((entry) => shortenHomePath(entry)).join(", ")}`)] : []
					] : [],
					...opts.grounded ? [muted$1(`groundedInputs=${groundedInputPaths.length > 0 ? groundedInputPaths.map((entry) => shortenHomePath(entry)).join(", ") : "none"}`)] : [],
					muted$1(`recentRecallEntries=${preview.recallEntryCount} deepCandidates=${deepCandidates.length}`),
					"",
					heading$1("REM Preview"),
					...remPreview.bodyLines,
					...groundedPreview ? [
						"",
						heading$1("Grounded REM"),
						...groundedPreview.files.flatMap((file) => [
							muted$1(file.path),
							file.renderedMarkdown,
							""
						])
					] : [],
					"",
					heading$1("Deep Candidates"),
					...deepCandidates.length > 0 ? deepCandidates.slice(0, 10).map((candidate) => `${candidate.score.toFixed(3)} ${candidate.snippet} [${shortenHomePath(candidate.path)}:${candidate.startLine}-${candidate.endLine}]`) : ["- No deep candidates."]
				];
				defaultRuntime.log(lines.join("\n"));
			} finally {
				if (cleanupWorkspaceDir) await fs$1.rm(cleanupWorkspaceDir, {
					recursive: true,
					force: true
				});
			}
		}
	});
}
async function runMemoryRemBackfill(opts, hostOptions) {
	await withMemoryCommand({
		commandName: "memory rem-backfill",
		agent: opts.agent,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: "status",
		...hostOptions,
		run: async ({ manager, cfg, agentId }) => {
			const workspaceDir = manager.status().workspaceDir?.trim();
			const remConfig = resolveMemoryRemDreamingConfig({
				pluginConfig: resolveMemoryPluginConfig(cfg),
				cfg
			});
			if (!workspaceDir) {
				defaultRuntime.error("Memory rem-backfill requires a resolvable workspace directory.");
				process.exitCode = 1;
				return;
			}
			if (opts.rollback || opts.rollbackShortTerm) {
				const diaryRollback = opts.rollback ? await removeBackfillDiaryEntries({ workspaceDir }) : null;
				const shortTermRollback = opts.rollbackShortTerm ? await removeGroundedShortTermCandidates({ workspaceDir }) : null;
				if (opts.json) {
					defaultRuntime.writeJson({
						workspaceDir,
						rollback: Boolean(opts.rollback),
						rollbackShortTerm: Boolean(opts.rollbackShortTerm),
						...diaryRollback ? {
							dreamsPath: diaryRollback.dreamsPath,
							removedEntries: diaryRollback.removed
						} : {},
						...shortTermRollback ? {
							shortTermStorePath: shortTermRollback.storePath,
							removedShortTermEntries: shortTermRollback.removed
						} : {}
					});
					return;
				}
				defaultRuntime.log([
					`${heading$1("REM Backfill")} ${muted$1("(rollback)")}`,
					muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
					...diaryRollback ? [muted$1(`dreamsPath=${shortenHomePath(diaryRollback.dreamsPath)}`), muted$1(`removedEntries=${diaryRollback.removed}`)] : [],
					...shortTermRollback ? [muted$1(`shortTermStorePath=${shortenHomePath(shortTermRollback.storePath)}`), muted$1(`removedShortTermEntries=${shortTermRollback.removed}`)] : []
				].join("\n"));
				return;
			}
			if (!opts.path) {
				defaultRuntime.error("Memory rem-backfill requires --path <file-or-dir> unless using --rollback.");
				process.exitCode = 1;
				return;
			}
			const scratchDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-rem-backfill-"));
			try {
				const sourceFiles = await listHistoricalDailyFiles(opts.path);
				if (sourceFiles.length === 0) {
					defaultRuntime.error(`Memory rem-backfill found no YYYY-MM-DD.md files at ${shortenHomePath(path.resolve(opts.path))}.`);
					process.exitCode = 1;
					return;
				}
				const scratchMemoryDir = path.join(scratchDir, "memory");
				await fs$1.mkdir(scratchMemoryDir, { recursive: true });
				const workspaceSourceFiles = [];
				for (const filePath of sourceFiles) {
					const dst = path.join(scratchMemoryDir, path.basename(filePath));
					await fs$1.copyFile(filePath, dst);
					workspaceSourceFiles.push(dst);
				}
				const grounded = await previewGroundedRemMarkdown({
					workspaceDir: scratchDir,
					inputPaths: workspaceSourceFiles
				});
				const sourcePathByScratchRelativePath = new Map(workspaceSourceFiles.map((scratchPath, index) => [normalizeRelativePath(scratchDir, scratchPath), sourceFiles[index] ?? scratchPath]));
				const written = await writeBackfillDiaryEntries({
					workspaceDir,
					entries: grounded.files.map((file) => {
						const isoDay = extractIsoDayFromPath(file.path);
						if (!isoDay) return null;
						return {
							isoDay,
							sourcePath: sourcePathByScratchRelativePath.get(file.path) ?? file.path,
							bodyLines: groundedMarkdownToDiaryLines(file.renderedMarkdown)
						};
					}).filter((entry) => entry !== null),
					timezone: remConfig.timezone
				});
				let stagedShortTermEntries = 0;
				let replacedShortTermEntries = 0;
				if (opts.stageShortTerm) {
					replacedShortTermEntries = (await removeGroundedShortTermCandidates({ workspaceDir })).removed;
					const shortTermSeedItems = collectGroundedShortTermSeedItems(grounded.files);
					if (shortTermSeedItems.length > 0) await recordGroundedShortTermCandidates({
						workspaceDir,
						query: "__dreaming_grounded_backfill__",
						items: shortTermSeedItems,
						dedupeByQueryPerDay: true,
						nowMs: Date.now(),
						timezone: remConfig.timezone
					});
					stagedShortTermEntries = shortTermSeedItems.length;
				}
				if (opts.json) {
					defaultRuntime.writeJson({
						workspaceDir,
						sourcePath: path.resolve(opts.path),
						sourceFiles,
						groundedFiles: grounded.scannedFiles,
						writtenEntries: written.written,
						replacedEntries: written.replaced,
						dreamsPath: written.dreamsPath,
						...opts.stageShortTerm ? {
							stagedShortTermEntries,
							replacedShortTermEntries
						} : {}
					});
					return;
				}
				defaultRuntime.log([
					`${heading$1("REM Backfill")} ${muted$1(`(${agentId})`)}`,
					muted$1(`workspace=${shortenHomePath(workspaceDir)}`),
					muted$1(`sourcePath=${shortenHomePath(path.resolve(opts.path))}`),
					muted$1(`historicalFiles=${sourceFiles.length} writtenEntries=${written.written} replacedEntries=${written.replaced}`),
					...opts.stageShortTerm ? [muted$1(`stagedShortTermEntries=${stagedShortTermEntries} replacedShortTermEntries=${replacedShortTermEntries}`)] : [],
					muted$1(`dreamsPath=${shortenHomePath(written.dreamsPath)}`)
				].join("\n"));
			} finally {
				await fs$1.rm(scratchDir, {
					recursive: true,
					force: true
				});
			}
		}
	});
}
const DAILY_MEMORY_FILE_NAME_RE = /^(\d{4}-\d{2}-\d{2})(?:-[^/]+)?\.md$/i;
async function listHistoricalDailyFiles(inputPath) {
	const resolvedPath = path.resolve(inputPath);
	let stat;
	try {
		stat = await fs$1.stat(resolvedPath);
	} catch (err) {
		if (err?.code === "ENOENT") return [];
		throw err;
	}
	if (stat.isFile()) return DAILY_MEMORY_FILE_NAME_RE.test(path.basename(resolvedPath)) ? [resolvedPath] : [];
	if (!stat.isDirectory()) return [];
	return (await fs$1.readdir(resolvedPath, { withFileTypes: true })).filter((entry) => entry.isFile() && DAILY_MEMORY_FILE_NAME_RE.test(entry.name)).map((entry) => path.join(resolvedPath, entry.name)).toSorted((a, b) => path.basename(a).localeCompare(path.basename(b)));
}
async function createHistoricalRemHarnessWorkspace(params) {
	const sourceFiles = await listHistoricalDailyFiles(params.inputPath);
	const workspaceDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-rem-harness-"));
	const memoryDir = path.join(workspaceDir, "memory");
	await fs$1.mkdir(memoryDir, { recursive: true });
	for (const filePath of sourceFiles) await fs$1.copyFile(filePath, path.join(memoryDir, path.basename(filePath)));
	const workspaceSourceFiles = sourceFiles.map((entry) => path.join(memoryDir, path.basename(entry)));
	const seeded = await seedHistoricalDailyMemorySignals({
		workspaceDir,
		filePaths: workspaceSourceFiles,
		limit: params.remLimit,
		nowMs: params.nowMs,
		timezone: params.timezone
	});
	return {
		workspaceDir,
		sourceFiles,
		workspaceSourceFiles,
		importedFileCount: seeded.importedFileCount,
		importedSignalCount: seeded.importedSignalCount,
		skippedPaths: seeded.skippedPaths
	};
}
function extractIsoDayFromPath(filePath) {
	return path.basename(filePath).match(DAILY_MEMORY_FILE_NAME_RE)?.[1] ?? null;
}
function normalizeRelativePath(baseDir, filePath) {
	return path.relative(baseDir, filePath).replace(/\\/g, "/");
}
function groundedMarkdownToDiaryLines(markdown) {
	return markdown.split(/\r?\n/).map((line) => line.replace(/^##\s+/, "").trimEnd()).filter((line, index, lines) => !(line.length === 0 && lines[index - 1]?.length === 0));
}
function parseGroundedRef(fallbackPath, ref) {
	const trimmed = ref.trim();
	if (!trimmed) return null;
	const match = trimmed.match(/^(.*?):(\d+)(?:-(\d+))?$/);
	if (!match) return null;
	return {
		path: (match[1] ?? fallbackPath).replaceAll("\\", "/").replace(/^\.\//, ""),
		startLine: Math.max(1, Number(match[2])),
		endLine: Math.max(1, Number(match[3] ?? match[2]))
	};
}
function collectGroundedShortTermSeedItems(previews) {
	const items = [];
	const seen = /* @__PURE__ */ new Set();
	for (const file of previews) {
		const dayBucket = extractIsoDayFromPath(file.path) ?? void 0;
		const signals = [...file.memoryImplications.map((item) => ({
			text: item.text,
			refs: item.refs,
			score: .92,
			query: "__dreaming_grounded_backfill__:lasting-update",
			signalCount: 2
		})), ...file.candidates.filter((candidate) => candidate.lean === "likely_durable").map((candidate) => ({
			text: candidate.text,
			refs: candidate.refs,
			score: .82,
			query: "__dreaming_grounded_backfill__:candidate",
			signalCount: 1
		}))];
		for (const signal of signals) {
			if (!signal.text.trim()) continue;
			const firstRef = signal.refs.find((ref) => ref.trim().length > 0);
			const parsedRef = firstRef ? parseGroundedRef(file.path, firstRef) : null;
			if (!parsedRef) continue;
			const key = `${parsedRef.path}:${parsedRef.startLine}:${parsedRef.endLine}:${signal.query}:${signal.text.toLowerCase()}`;
			if (seen.has(key)) continue;
			seen.add(key);
			items.push({
				path: parsedRef.path,
				startLine: parsedRef.startLine,
				endLine: parsedRef.endLine,
				snippet: signal.text,
				score: signal.score,
				query: signal.query,
				signalCount: signal.signalCount,
				...dayBucket ? { dayBucket } : {}
			});
		}
	}
	return items;
}
//#endregion
//#region extensions/memory-core/src/cli-status.runtime.ts
const { accent, heading, info, muted, success, warn } = theme;
function readLlamaCppRuntimeStatus(status) {
	const runtime = asNullableRecord(asNullableRecord(status.custom)?.llamaCppRuntime);
	return runtime?.engine === "llama.cpp" ? runtime : null;
}
function formatMemoryIndexIdentityWarning(status, agentId) {
	const indexIdentity = asNullableRecord(asNullableRecord(status.custom)?.indexIdentity);
	const reason = (indexIdentity?.status === "mismatched" || indexIdentity?.status === "missing") && typeof indexIdentity.reason === "string" ? indexIdentity.reason : void 0;
	if (!reason) return null;
	return {
		reason,
		fix: `Run: openclaw memory status --index --agent ${agentId}`
	};
}
function formatDreamingSummary(cfg) {
	const pluginConfig = resolveMemoryPluginConfig(cfg);
	const light = resolveMemoryLightDreamingConfig({
		pluginConfig,
		cfg
	});
	const deep = resolveShortTermPromotionDreamingConfig({
		pluginConfig,
		cfg
	});
	const rem = resolveMemoryRemDreamingConfig({
		pluginConfig,
		cfg
	});
	const timezone = deep.timezone ?? light.timezone ?? rem.timezone;
	const formatCron = (cron) => timezone ? `${cron} (${timezone})` : cron;
	const lightSummary = light.enabled ? `light=${formatCron(light.cron)} · limit=${light.limit} · lookbackDays=${light.lookbackDays}` : null;
	const remSummary = rem.enabled ? `rem=${formatCron(rem.cron)} · limit=${rem.limit} · lookbackDays=${rem.lookbackDays} · minPatternStrength=${rem.minPatternStrength}` : null;
	const deepLabel = light.enabled || rem.enabled ? "deep=" : "";
	const deepDetails = `${formatCron(deep.cron)} · limit=${deep.limit} · minScore=${deep.minScore} · minRecallCount=${deep.minRecallCount} · minUniqueQueries=${deep.minUniqueQueries} · recencyHalfLifeDays=${deep.recencyHalfLifeDays} · maxAgeDays=${deep.maxAgeDays ?? "none"} · maxPromotedSnippetTokens=${deep.maxPromotedSnippetTokens}`;
	const phases = [
		lightSummary,
		remSummary,
		deep.enabled ? `${deepLabel}${deepDetails}` : null
	].filter(Boolean);
	return phases.length > 0 ? phases.join(" · ") : "off";
}
function formatRepairSummary(repair) {
	const actions = [];
	if (repair.rewroteStore) {
		const removedOverflowEntries = repair.removedOverflowEntries ?? 0;
		const details = [
			repair.removedInvalidEntries > 0 ? `-${repair.removedInvalidEntries} invalid` : null,
			(repair.removedDanglingEntries ?? 0) > 0 ? `-${repair.removedDanglingEntries} dangling` : null,
			removedOverflowEntries > 0 ? `-${removedOverflowEntries} overflow` : null
		].filter(Boolean).join(", ");
		actions.push(`rewrote store${details ? ` (${details})` : ""}`);
	}
	if (repair.removedStaleLock) actions.push("removed stale lock");
	return actions.length > 0 ? actions.join(" · ") : "no changes";
}
function formatDreamingAuditSummary(audit) {
	return [
		audit.dreamsPath ? "diary present" : "diary absent",
		`${audit.sessionCorpusFileCount} corpus files`,
		audit.sessionIngestionExists ? "ingestion state present" : "ingestion state absent",
		audit.suspiciousSessionCorpusLineCount > 0 ? `${audit.suspiciousSessionCorpusLineCount} suspicious lines` : null
	].filter(Boolean).join(" · ");
}
function formatDreamingRepairSummary(repair) {
	const actions = [];
	if (repair.archivedSessionCorpus) actions.push("archived session corpus");
	if (repair.archivedSessionIngestion) actions.push("archived ingestion state");
	if (repair.archivedDreamsDiary) actions.push("archived diary");
	if (repair.warnings.length > 0) actions.push(`${repair.warnings.length} warning${repair.warnings.length === 1 ? "" : "s"}`);
	return actions.length > 0 ? actions.join(" · ") : "no changes";
}
async function runMemoryStatus(opts, hostOptions) {
	setVerbose(Boolean(opts.verbose));
	const allResults = [];
	const cfg = await withMemoryCommand({
		commandName: "memory status",
		agent: opts.agent,
		allAgents: true,
		diagnosticsToStderr: Boolean(opts.json),
		purpose: opts.index ? "cli" : "status",
		...hostOptions,
		run: async ({ manager, agentId }) => {
			const deep = Boolean(opts.deep || opts.index);
			let embeddingProbe;
			let indexError;
			const syncFn = manager.sync ? manager.sync.bind(manager) : void 0;
			if (deep) {
				const hasVectorStoreProbe = manager.status().backend === "builtin" && typeof manager.probeVectorStoreAvailability === "function";
				await withProgress({
					label: "Checking memory…",
					total: hasVectorStoreProbe ? 3 : 2
				}, async (progress) => {
					progress.setLabel(hasVectorStoreProbe ? "Probing vector store…" : "Probing vectors…");
					if (hasVectorStoreProbe) await manager.probeVectorStoreAvailability?.();
					else await manager.probeVectorAvailability();
					progress.tick();
					progress.setLabel("Probing embeddings…");
					embeddingProbe = await manager.probeEmbeddingAvailability();
					progress.tick();
					if (hasVectorStoreProbe) {
						progress.setLabel("Checking semantic vectors…");
						await manager.probeVectorAvailability();
						progress.tick();
					}
				});
				if (opts.index && syncFn) await withProgressTotals({
					label: "Indexing memory…",
					total: 0,
					fallback: opts.verbose ? "line" : void 0
				}, async (update, progress) => {
					try {
						await syncFn({
							reason: "cli",
							force: Boolean(opts.force),
							progress: (syncUpdate) => {
								update({
									completed: syncUpdate.completed,
									total: syncUpdate.total,
									label: syncUpdate.label
								});
								if (syncUpdate.label) progress.setLabel(syncUpdate.label);
							}
						});
					} catch (err) {
						indexError = formatErrorMessage(err);
						defaultRuntime.error(`Memory index failed: ${indexError}`);
						process.exitCode = 1;
					}
				});
				else if (opts.index && !syncFn) defaultRuntime.log("Memory backend does not support manual reindex.");
			}
			const status = manager.status();
			const scan = await scanMemoryManagerSources(status, agentId);
			const workspaceDir = status.workspaceDir;
			let audit;
			let repair;
			let dreamingAudit;
			let dreamingRepair;
			if (workspaceDir) {
				dreamingAudit = await auditDreamingArtifacts({ workspaceDir });
				if (opts.fix && dreamingAudit.issues.some((issue) => issue.fixable)) {
					dreamingRepair = await repairDreamingArtifacts({ workspaceDir });
					dreamingAudit = await auditDreamingArtifacts({ workspaceDir });
				}
				if (opts.fix) repair = await repairShortTermPromotionArtifacts({ workspaceDir });
				audit = await auditShortTermPromotionArtifacts({ workspaceDir });
			}
			allResults.push({
				agentId,
				status,
				embeddingProbe,
				indexError,
				scan,
				audit,
				repair,
				dreamingAudit,
				dreamingRepair
			});
		}
	});
	if (opts.json) {
		defaultRuntime.writeJson(allResults);
		return;
	}
	const label = (text) => muted(`${text}:`);
	for (const result of allResults) {
		const { agentId, status, embeddingProbe, indexError, scan, audit, repair, dreamingAudit, dreamingRepair } = result;
		const filesIndexed = status.files ?? 0;
		const chunksIndexed = status.chunks ?? 0;
		const totalFiles = scan?.totalFiles ?? null;
		const indexedLabel = totalFiles === null ? `${filesIndexed}/? files · ${chunksIndexed} chunks` : `${filesIndexed}/${totalFiles} files · ${chunksIndexed} chunks`;
		if (opts.index) {
			const line = indexError ? `Memory index failed: ${indexError}` : formatMemoryIndexOutcome(status, scan, agentId);
			defaultRuntime.log(line);
		}
		const requestedProvider = status.requestedProvider ?? status.provider;
		const modelLabel = status.model ?? status.provider;
		const storePath = status.dbPath ? shortenHomePath(status.dbPath) : "<unknown>";
		const workspacePath = status.workspaceDir ? shortenHomePath(status.workspaceDir) : "<unknown>";
		const sourceList = status.sources?.length ? status.sources.join(", ") : null;
		const extraPaths = status.workspaceDir ? formatExtraPaths(status.workspaceDir, status.extraPaths ?? []) : [];
		const lines = [
			`${heading("Memory Search")} ${muted(`(${agentId})`)}`,
			`${label("Provider")} ${info(status.provider)} ${muted(`(requested: ${requestedProvider})`)}`,
			`${label("Model")} ${info(modelLabel)}`,
			sourceList ? `${label("Sources")} ${info(sourceList)}` : null,
			extraPaths.length ? `${label("Extra paths")} ${info(extraPaths.join(", "))}` : null,
			`${label("Indexed")} ${success(indexedLabel)}`,
			`${label("Dirty")} ${status.dirty ? warn("yes") : muted("no")}`,
			`${label("Store")} ${info(storePath)}`,
			`${label("Workspace")} ${info(workspacePath)}`,
			`${label("Dreaming")} ${info(formatDreamingSummary(cfg))}`
		].filter(Boolean);
		if (embeddingProbe) {
			const state = embeddingProbe.ok && embeddingProbe.checked === false ? "skipped" : embeddingProbe.ok ? "ready" : "unavailable";
			const stateColor = state === "skipped" ? muted : embeddingProbe.ok ? success : warn;
			lines.push(`${label("Embeddings")} ${stateColor(state)}`);
			if (embeddingProbe.error) lines.push(`${label("Embeddings error")} ${warn(embeddingProbe.error)}`);
		}
		const llamaCppRuntime = opts.deep ? readLlamaCppRuntimeStatus(status) : null;
		if (llamaCppRuntime) {
			const runtime = llamaCppRuntime;
			const backend = runtime.backend ?? "unknown";
			const build = runtime.buildInfo ? ` (${runtime.buildInfo})` : "";
			lines.push(`${label("llama.cpp server")} ${info(backend)}${muted(build)}`);
			if (runtime.model?.id) lines.push(`${label("Server model")} ${info(runtime.model.id)}`);
			if (runtime.model?.path) lines.push(`${label("Model path")} ${info(shortenHomePath(runtime.model.path))}`);
			if (runtime.capabilities) {
				const capabilities = [runtime.capabilities.vision ? "vision" : null, runtime.capabilities.draft ? "draft" : null].filter(Boolean);
				lines.push(`${label("Capabilities")} ${info(capabilities.length ? capabilities.join(", ") : "text only")}`);
			}
			if (runtime.endpoints) lines.push(`${label("Endpoints")} ${info(Object.entries(runtime.endpoints).map(([name, state]) => `${name}=${state}`).join(" "))}`);
			if (runtime.loadError) lines.push(`${label("llama.cpp error")} ${warn(runtime.loadError)}`);
		}
		const identityWarning = formatMemoryIndexIdentityWarning(status, agentId);
		if (identityWarning) {
			lines.push(`${label("Index identity")} ${warn(identityWarning.reason)}`);
			lines.push(`${label("Vector search")} ${warn("paused until memory is rebuilt")}`);
			lines.push(`${label("Fix")} ${muted(identityWarning.fix)}`);
		}
		if (status.sourceCounts?.length) {
			lines.push(label("By source"));
			for (const entry of status.sourceCounts) {
				const total = scan?.sources?.find((scanEntry) => scanEntry.source === entry.source)?.totalFiles;
				const counts = total === null ? `${entry.files}/? files · ${entry.chunks} chunks` : `${entry.files}/${total} files · ${entry.chunks} chunks`;
				lines.push(`  ${accent(entry.source)} ${muted("·")} ${muted(counts)}`);
			}
		}
		if (status.fallback) lines.push(`${label("Fallback")} ${warn(status.fallback.from)}`);
		if (status.vector) {
			const formatVectorState = (available) => status.vector?.enabled ? available === void 0 ? "unknown" : available ? "ready" : "unavailable" : "disabled";
			const formatVectorLine = (lineLabel, state) => {
				const vectorColor = state === "ready" ? success : state === "unavailable" ? warn : muted;
				lines.push(`${label(lineLabel)} ${vectorColor(state)}`);
			};
			if (status.backend === "builtin") {
				formatVectorLine("Vector store", status.vector.storeAvailable === void 0 && status.vector.enabled ? status.vector.index?.state === "complete" ? "indexed (unprobed)" : status.vector.index?.state === "incomplete" ? "index incomplete (unprobed)" : status.vector.index?.state === "unverified" ? "index unverified (unprobed)" : formatVectorState(void 0) : formatVectorState(status.vector.storeAvailable));
				if (status.vector.semanticAvailable !== void 0) formatVectorLine("Semantic vectors", formatVectorState(status.vector.semanticAvailable));
			} else formatVectorLine("Vector", formatVectorState(status.vector.semanticAvailable ?? status.vector.available));
			if (status.vector.dims) lines.push(`${label("Vector dims")} ${info(String(status.vector.dims))}`);
			if (status.vector.extensionPath) lines.push(`${label("Vector path")} ${info(shortenHomePath(status.vector.extensionPath))}`);
			if (status.vector.loadError) lines.push(`${label("Vector error")} ${warn(status.vector.loadError)}`);
		}
		if (status.fts) {
			const ftsState = status.fts.enabled ? status.fts.available ? "ready" : "unavailable" : "disabled";
			const ftsColor = ftsState === "ready" ? success : ftsState === "unavailable" ? warn : muted;
			lines.push(`${label("FTS")} ${ftsColor(ftsState)}`);
			if (status.fts.error) lines.push(`${label("FTS error")} ${warn(status.fts.error)}`);
		}
		if (status.cache) {
			const cacheState = status.cache.enabled ? "enabled" : "disabled";
			const cacheColor = status.cache.enabled ? success : muted;
			const suffix = status.cache.enabled && typeof status.cache.entries === "number" ? ` (${status.cache.entries} entries)` : "";
			lines.push(`${label("Embedding cache")} ${cacheColor(cacheState)}${suffix}`);
			if (status.cache.enabled && typeof status.cache.maxEntries === "number") lines.push(`${label("Cache cap")} ${info(String(status.cache.maxEntries))}`);
		}
		if (status.batch) {
			const batchState = status.batch.enabled ? "enabled" : "disabled";
			const batchColor = status.batch.enabled ? success : warn;
			const batchSuffix = ` (failures ${status.batch.failures}/${status.batch.limit})`;
			lines.push(`${label("Batch")} ${batchColor(batchState)}${muted(batchSuffix)}`);
			if (status.batch.lastError) lines.push(`${label("Batch error")} ${warn(status.batch.lastError)}`);
		}
		if (audit) {
			lines.push(`${label("Recall store")} ${info(formatAuditCounts(audit))}`);
			lines.push(`${label("Recall path")} ${info(shortenHomePath(audit.storePath))}`);
			if (audit.updatedAt) lines.push(`${label("Recall updated")} ${info(audit.updatedAt)}`);
		}
		if (dreamingAudit) {
			lines.push(`${label("Dreaming artifacts")} ${info(formatDreamingAuditSummary(dreamingAudit))}`);
			lines.push(`${label("Dream corpus")} ${info(shortenHomePath(dreamingAudit.sessionCorpusDir))}`);
			lines.push(`${label("Dream ingestion")} ${info(shortenHomePath(dreamingAudit.sessionIngestionPath))}`);
			if (dreamingAudit.dreamsPath) lines.push(`${label("Dream diary")} ${info(shortenHomePath(dreamingAudit.dreamsPath))}`);
		}
		if (repair) lines.push(`${label("Repair")} ${info(formatRepairSummary(repair))}`);
		if (dreamingRepair) {
			lines.push(`${label("Dream repair")} ${info(formatDreamingRepairSummary(dreamingRepair))}`);
			if (dreamingRepair.archiveDir) lines.push(`${label("Dream archive")} ${info(shortenHomePath(dreamingRepair.archiveDir))}`);
		}
		if (status.fallback?.reason) lines.push(muted(status.fallback.reason));
		if (indexError) lines.push(`${label("Index error")} ${warn(indexError)}`);
		if (scan?.issues.length) {
			lines.push(label("Issues"));
			for (const issue of scan.issues) lines.push(`  ${warn(issue)}`);
		}
		if (audit?.issues.length) {
			if (!scan?.issues.length) lines.push(label("Issues"));
			for (const issue of audit.issues) lines.push(`  ${issue.severity === "error" ? warn(issue.message) : muted(issue.message)}`);
			if (!opts.fix) {
				if (audit.issues.some((issue) => issue.fixable)) lines.push(`  ${muted(`Fix: openclaw memory status --fix --agent ${agentId}`)}`);
			}
		}
		if (dreamingAudit?.issues.length) {
			if (!scan?.issues.length && !audit?.issues.length) lines.push(label("Issues"));
			for (const issue of dreamingAudit.issues) lines.push(`  ${issue.severity === "error" ? warn(issue.message) : muted(issue.message)}`);
			if (!opts.fix && dreamingAudit.issues.some((issue) => issue.fixable)) lines.push(`  ${muted(`Fix: openclaw memory status --fix --agent ${agentId}`)}`);
		}
		defaultRuntime.log(lines.join("\n"));
		defaultRuntime.log("");
	}
}
//#endregion
export { runMemoryIndex, runMemoryPromote, runMemoryPromoteExplain, runMemoryRemBackfill, runMemoryRemHarness, runMemorySearch, runMemorySessionBackfill, runMemoryStatus };
