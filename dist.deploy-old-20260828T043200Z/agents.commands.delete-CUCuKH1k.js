import { r as isGatewayTransportError } from "./transport-error-D_LRKgla.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as formatCliJsonFailure } from "./failure-output-CdUzE2dC.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir, l as resolveAgentDir, r as listAgentEntries, w as tryResolveSoleAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as normalizeAgentDirRegistryPath, t as isPathOwnedByAnotherRegisteredAgent } from "./agent-dir-registry-CEecLw_T.js";
import { l as resolveSessionTranscriptsDirForAgent } from "./paths-DVAvlIOc.js";
import { bt as resolveSqliteDatabaseFilePaths } from "./openclaw-state-db-CeAO_dqo.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { a as resolveSharedAuthStorePath, i as resolveSharedAuthStoreOwnership } from "./path-resolve-CCojuy8M.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { o as callGateway, p as isGatewayCredentialsRequiredError } from "./call-Bwn2P4nz.js";
import { s as readAgentDeletionJournal } from "./agent-deletion-journal-BpQsagX8.js";
import { F as listOpenClawRegisteredAgentDatabases, P as unregisterOpenClawAgentDatabases } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import "./message-channel-BZwx7FCw.js";
import "./sessions-CdrF1uzY.js";
import { t as purgeAgentSessionStoreEntries } from "./cleanup-service-A4G1gsQQ.js";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.js";
import { m as resolveAuthProfileDatabasePath } from "./sqlite-fgcxOC8G.js";
import { i as deleteWorkspaceState, s as prepareWorkspaceStateDeletion, v as prepareLegacyWorkspaceStateReset, y as removeLegacyWorkspaceStateForReset } from "./workspace-state-store-CKubv1mM.js";
import "./exec-approvals-B5vSSaiI.js";
import { a as claimCompletedAgentDeletion, r as beginAgentDeletion } from "./agent-lifecycle-registry-D1dm9wFG.js";
import { h as withAgentExecApprovalsRemoved } from "./exec-approvals-generated-migration-DfpexxOF.js";
import { a as moveToTrashResult } from "./cleanup-utils-BFaP5a7r.js";
import { t as createClackPrompter } from "./clack-prompter-DghMKpQq.js";
import { r as logConfigUpdated } from "./logging-CzP_6-o-.js";
import { t as withLocalAgentCronJobsRemoved } from "./local-service-C9AmnYWv.js";
import { a as pruneAgentConfig, r as findAgentEntryIndex } from "./agents.config-b213TBEZ.js";
import { i as isSharedAuthStoreOwner, n as formatSharedAuthStoreOwnerDeleteError, r as isInheritedAuthStoreOwner, t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-Bu_MnzQL.js";
import { n as requireValidConfigFileSnapshot } from "./config-validation-BZK80QZW.js";
//#region src/commands/agents.command-shared.ts
/** Wrap a runtime so helper setup work stays silent in JSON output paths. */
function createQuietRuntime(runtime) {
	return {
		...runtime,
		log: () => {}
	};
}
//#endregion
//#region src/commands/agents.commands.delete.ts
function failAgentsDelete(opts, runtime, message) {
	if (opts.json) {
		writeRuntimeJson(runtime, formatCliJsonFailure(message));
		runtime.exit(1, { resetStream: process.stderr });
	} else {
		runtime.error(message);
		runtime.exit(1);
	}
}
function logClearedOwnerRefs(runtime, clearedOwnerRefs) {
	if (clearedOwnerRefs.length > 0) runtime.log(`Cleared owner references: ${clearedOwnerRefs.join(", ")}`);
}
function logSessionPurgeWarning(runtime, agentId, purgeFailed) {
	if (purgeFailed) runtime.error(`Warning: session-store purge failed for deleted agent "${agentId}"; stale shared-store rows may remain.`);
}
async function maybeDeleteAgentThroughGateway(params) {
	try {
		return {
			kind: "deleted",
			result: await callGateway({
				method: "agents.delete",
				params: {
					agentId: params.agentId,
					deleteFiles: params.deleteFiles
				},
				mode: GATEWAY_CLIENT_MODES.CLI,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				requiredMethods: ["agents.delete"]
			})
		};
	} catch (error) {
		if (isGatewayTransportError(error) && error.kind === "closed" && error.code === void 0) return { kind: "fallback-unreachable" };
		if (isGatewayCredentialsRequiredError(error)) return { kind: "fallback-credentials-required" };
		throw error;
	}
}
/** Delete an agent, pruning config plus workspace/session state when it is safe to do so. */
async function agentsDeleteCommand(opts, runtime = defaultRuntime) {
	const configSnapshot = await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
	const baseHash = configSnapshot.hash;
	const input = opts.id?.trim();
	if (!input) {
		failAgentsDelete(opts, runtime, `Agent id is required. Run ${formatCliCommand("openclaw agents list")} to choose one.`);
		return;
	}
	const normalized = normalizeAgentIdStrict(input);
	if (!normalized.ok) {
		failAgentsDelete(opts, runtime, `Agent "${input}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		return;
	}
	const agentId = normalized.value;
	if (!opts.json && agentId !== input) runtime.log(`Normalized agent id to "${agentId}".`);
	const configured = findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
	let existingJournal = configured ? void 0 : readAgentDeletionJournal(agentId);
	if (!configured && (!existingJournal || existingJournal.cleanupCompleted)) {
		failAgentsDelete(opts, runtime, `Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		return;
	}
	const configuredAgentDir = configured ? resolveAgentDir(cfg, agentId) : void 0;
	const safetyAgentDir = existingJournal?.agentDir ?? configuredAgentDir;
	if (!safetyAgentDir) throw new Error(`Agent "${agentId}" deletion has no state directory.`);
	if (isSharedAuthStoreOwner({
		ownership: resolveSharedAuthStoreOwnership(),
		agentAuthDbPath: resolveAuthProfileDatabasePath(safetyAgentDir),
		sharedAuthDbPath: resolveSharedAuthStorePath()
	})) {
		failAgentsDelete(opts, runtime, formatSharedAuthStoreOwnerDeleteError(agentId));
		return;
	}
	if (configured && agentId === tryResolveSoleAgentId(cfg)) {
		failAgentsDelete(opts, runtime, `Agent "${agentId}" is the only configured agent and cannot be deleted.`);
		return;
	}
	if (isInheritedAuthStoreOwner(cfg, agentId)) {
		failAgentsDelete(opts, runtime, `Agent "${agentId}" owns inherited credentials through agents.defaults.authInheritance.agentId and cannot be deleted. Relocate those credentials, then re-point or remove that binding before retrying.`);
		return;
	}
	if (configured) {
		existingJournal = readAgentDeletionJournal(agentId);
		if (existingJournal?.cleanupCompleted) {
			if (!claimCompletedAgentDeletion(agentId, existingJournal.operationId)) throw new Error(`Agent "${agentId}" deletion tombstone changed before fresh deletion.`);
			existingJournal = void 0;
		}
	}
	const agentDir = existingJournal?.agentDir ?? configuredAgentDir;
	if (!agentDir) throw new Error(`Agent "${agentId}" deletion has no state directory.`);
	if (!opts.force) {
		if (!isTerminalInteractive()) {
			failAgentsDelete(opts, runtime, "Non-interactive session. Re-run with --force.");
			return;
		}
		if (!await createClackPrompter().confirm({
			message: `Delete agent "${agentId}" and prune workspace/state?`,
			initialValue: false
		})) {
			runtime.log("Cancelled.");
			return;
		}
	}
	const workspaceDir = existingJournal?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId);
	const sessionsDir = existingJournal?.sessionsDir ?? resolveSessionTranscriptsDirForAgent(agentId);
	const result = configured ? pruneAgentConfig(cfg, agentId) : {
		config: cfg,
		removedBindings: 0,
		removedAllow: 0,
		clearedOwnerRefs: []
	};
	const gatewayAttempt = await maybeDeleteAgentThroughGateway({
		agentId,
		deleteFiles: true
	});
	if (gatewayAttempt.kind === "deleted") {
		const gatewayResult = gatewayAttempt.result;
		if (opts.json) {
			const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
			const workspaceRetained = workspaceSharedWith.length > 0;
			writeRuntimeJson(runtime, {
				agentId,
				workspace: workspaceDir,
				workspaceRetained: workspaceRetained || void 0,
				workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
				workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
				agentDir,
				sessionsDir,
				removedBindings: gatewayResult.removedBindings,
				removedAllow: result.removedAllow,
				clearedOwnerRefs: result.clearedOwnerRefs.length > 0 ? result.clearedOwnerRefs : void 0,
				removed: gatewayResult.removed,
				failed: gatewayResult.failed,
				...gatewayResult.purgeFailed ? { purgeFailed: true } : {},
				transport: "gateway"
			});
		} else {
			runtime.log(`Deleted agent: ${agentId}`);
			logClearedOwnerRefs(runtime, result.clearedOwnerRefs);
			logSessionPurgeWarning(runtime, agentId, gatewayResult.purgeFailed === true);
			for (const failure of gatewayResult.failed ?? []) runtime.error(`Warning: path could not be moved to Trash: ${failure.reason}; remove it manually at ${failure.path}`);
		}
		return;
	}
	const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
	const workspaceRetained = workspaceSharedWith.length > 0;
	const deleteFiles = existingJournal?.deleteFiles ?? true;
	const deletion = beginAgentDeletion(existingJournal ?? {
		agentId,
		agentDir,
		workspaceDir,
		sessionsDir,
		deleteFiles
	});
	try {
		const commitRoster = async () => await withAgentExecApprovalsRemoved(agentId, async () => {
			if (configured) {
				await replaceConfigFile({
					nextConfig: result.config,
					...baseHash !== void 0 ? { baseHash } : {},
					writeOptions: {
						allowedAgentRosterRemovals: [agentId],
						...opts.json ? { skipOutputLogs: true } : {}
					}
				});
				if (!opts.json) logConfigUpdated(runtime);
			}
		});
		if (gatewayAttempt.kind === "fallback-unreachable") await withLocalAgentCronJobsRemoved(agentId, () => cfg, commitRoster);
		else await commitRoster();
		deletion.commit();
	} catch (error) {
		if (!existingJournal) deletion.rollback();
		throw error;
	}
	const purgeFailed = await purgeAgentSessionStoreEntries(cfg, agentId);
	const quietRuntime = opts.json ? createQuietRuntime(runtime) : runtime;
	let workspaceCleanupError;
	const removed = [];
	const failed = [];
	const removePath = async (pathname) => {
		const outcome = await moveToTrashResult(pathname, quietRuntime);
		if ("removed" in outcome) removed.push(outcome.removed);
		else failed.push(outcome.failed);
		return outcome;
	};
	if (deleteFiles && workspaceRetained) quietRuntime.log(`Skipped workspace removal (shared with other agents: ${workspaceSharedWith.join(", ")}): ${workspaceDir}`);
	else if (deleteFiles) {
		const legacyPlan = prepareLegacyWorkspaceStateReset(workspaceDir);
		const statePlan = prepareWorkspaceStateDeletion(workspaceDir);
		if ("removed" in await removePath(workspaceDir)) try {
			const legacyCleanup = await removeLegacyWorkspaceStateForReset(legacyPlan);
			for (const warning of legacyCleanup.warnings) quietRuntime.log(warning);
			deleteWorkspaceState(statePlan);
		} catch (error) {
			workspaceCleanupError = error instanceof Error ? error : new Error(String(error));
		}
	}
	if (deleteFiles) {
		for (const survivingAgentId of listAgentIds(result.config)) resolveAgentDir(result.config, survivingAgentId);
		const canonicalAgentDir = normalizeAgentDirRegistryPath(agentDir);
		const survivingDatabasePaths = new Set(listOpenClawRegisteredAgentDatabases().filter((entry) => normalizeAgentId(entry.agentId) !== agentId).flatMap((entry) => resolveSqliteDatabaseFilePaths(entry.path)).map((pathname) => normalizeAgentDirRegistryPath(pathname)));
		const databasePaths = deletion.entry.databasePaths.filter((pathname) => {
			const canonicalPath = normalizeAgentDirRegistryPath(pathname);
			return !isPathInside(canonicalAgentDir, canonicalPath) && !survivingDatabasePaths.has(canonicalPath) && !isPathOwnedByAnotherRegisteredAgent({
				agentId,
				pathname
			}) && findOverlappingWorkspaceAgentIds(result.config, agentId, canonicalPath).length === 0;
		});
		await removePath(agentDir);
		await removePath(sessionsDir);
		for (const databasePath of databasePaths) await removePath(databasePath);
	}
	if (workspaceCleanupError) throw workspaceCleanupError;
	if (failed.length === 0) {
		if (deleteFiles) unregisterOpenClawAgentDatabases({ agentId });
		deletion.finish();
	}
	if (opts.json) writeRuntimeJson(runtime, {
		agentId,
		workspace: workspaceDir,
		workspaceRetained: workspaceRetained || void 0,
		workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
		workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
		agentDir,
		sessionsDir,
		removedBindings: result.removedBindings,
		removedAllow: result.removedAllow,
		clearedOwnerRefs: result.clearedOwnerRefs.length > 0 ? result.clearedOwnerRefs : void 0,
		removed,
		failed,
		...purgeFailed ? { purgeFailed: true } : {},
		...gatewayAttempt.kind === "fallback-credentials-required" ? { cronCleanupSkipped: true } : {}
	});
	else {
		runtime.log(`Deleted agent: ${agentId}`);
		logClearedOwnerRefs(runtime, result.clearedOwnerRefs);
		logSessionPurgeWarning(runtime, agentId, purgeFailed);
	}
	if (gatewayAttempt.kind === "fallback-credentials-required") runtime.error(`Warning: cron cleanup was skipped for deleted agent "${agentId}" because the Gateway could not be authenticated; scheduled jobs may remain.`);
}
//#endregion
export { agentsDeleteCommand };
