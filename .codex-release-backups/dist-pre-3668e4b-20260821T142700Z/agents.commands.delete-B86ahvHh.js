import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir, r as listAgentEntries, x as tryResolveSoleAgentId } from "./agent-scope-config-CsnnOL14.js";
import { l as resolveSessionTranscriptsDirForAgent } from "./paths-CfFmgJmW.js";
import { r as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-CGszFH8G.js";
import { r as replaceConfigFile } from "./mutate-B2SI65Vd.js";
import "./config-CfeGo4K4.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { h as isGatewayTransportError, p as isGatewayCredentialsRequiredError, s as callGateway } from "./call-CZ1eu88h.js";
import { o as resolveSharedAuthStoreOwnership, s as resolveSharedAuthStorePath } from "./path-resolve-DES5vxlU.js";
import { m as resolveAuthProfileDatabasePath } from "./sqlite-Bc2uR5B8.js";
import "./message-channel-C3nRvjrX.js";
import { i as deleteWorkspaceState, s as prepareWorkspaceStateDeletion } from "./workspace-state-store-CdlAG1ee.js";
import { c as prepareLegacyWorkspaceStateReset, l as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-Cj3sm-nM.js";
import { c as moveToTrash } from "./onboard-helpers-CPYqMvEB.js";
import "./sessions-Bh837xaa.js";
import { t as purgeAgentSessionStoreEntries } from "./cleanup-service-DQZHCuYD.js";
import { t as createClackPrompter } from "./clack-prompter-FYG9QoOA.js";
import { r as logConfigUpdated } from "./logging-CAU6n6Ks.js";
import { a as pruneAgentConfig, r as findAgentEntryIndex } from "./agents.config-BgVfIBCV.js";
import { n as formatSharedAuthStoreOwnerDeleteError, r as isSharedAuthStoreOwner, t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-CYN-n-yx.js";
import { n as requireValidConfigFileSnapshot } from "./config-validation-RWiVWlp1.js";
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
function logClearedOwnerRefs(runtime, clearedOwnerRefs) {
	if (clearedOwnerRefs.length > 0) runtime.log(`Cleared owner references: ${clearedOwnerRefs.join(", ")}`);
}
async function maybeDeleteAgentThroughGateway(params) {
	try {
		return await callGateway({
			method: "agents.delete",
			params: {
				agentId: params.agentId,
				deleteFiles: params.deleteFiles
			},
			mode: GATEWAY_CLIENT_MODES.CLI,
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			requiredMethods: ["agents.delete"]
		});
	} catch (error) {
		if (isGatewayTransportError(error) || isGatewayCredentialsRequiredError(error)) return null;
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
		runtime.error(`Agent id is required. Run ${formatCliCommand("openclaw agents list")} to choose one.`);
		runtime.exit(1);
		return;
	}
	const agentId = normalizeAgentId(input);
	if (agentId !== input) runtime.log(`Normalized agent id to "${agentId}".`);
	const agentDir = resolveAgentDir(cfg, agentId);
	const sharedAuthOwnership = resolveSharedAuthStoreOwnership();
	if (isSharedAuthStoreOwner({
		ownership: sharedAuthOwnership,
		agentAuthDbPath: resolveAuthProfileDatabasePath(agentDir),
		sharedAuthDbPath: resolveSharedAuthStorePath()
	})) {
		runtime.error(formatSharedAuthStoreOwnerDeleteError(agentId));
		runtime.exit(1);
		return;
	}
	if (findAgentEntryIndex(listAgentEntries(cfg), agentId) < 0) {
		runtime.error(`Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		runtime.exit(1);
		return;
	}
	if (agentId === tryResolveSoleAgentId(cfg)) {
		runtime.error(`Agent "${agentId}" is the only configured agent and cannot be deleted.`);
		runtime.exit(1);
		return;
	}
	const inheritedAuthAgentId = cfg.agents?.defaults?.authInheritance?.agentId?.trim() || (sharedAuthOwnership.location === "legacy-main" ? resolveLegacyInheritedAuthAgentId(cfg) : "");
	if (inheritedAuthAgentId && agentId === normalizeAgentId(inheritedAuthAgentId)) {
		runtime.error(`Agent "${agentId}" owns inherited credentials through agents.defaults.authInheritance.agentId and cannot be deleted. Relocate those credentials, then re-point or remove that binding before retrying.`);
		runtime.exit(1);
		return;
	}
	if (!opts.force) {
		if (!process.stdin.isTTY) {
			runtime.error("Non-interactive session. Re-run with --force.");
			runtime.exit(1);
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
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);
	const result = pruneAgentConfig(cfg, agentId);
	const gatewayResult = await maybeDeleteAgentThroughGateway({
		agentId,
		deleteFiles: true
	});
	if (gatewayResult) {
		const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
		const workspaceRetained = workspaceSharedWith.length > 0;
		if (opts.json) writeRuntimeJson(runtime, {
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
			transport: "gateway"
		});
		else {
			runtime.log(`Deleted agent: ${agentId}`);
			logClearedOwnerRefs(runtime, result.clearedOwnerRefs);
			for (const failure of gatewayResult.failed ?? []) runtime.error(`Warning: path could not be moved to Trash: ${failure.reason}; remove it manually at ${failure.path}`);
		}
		return;
	}
	await replaceConfigFile({
		nextConfig: result.config,
		...baseHash !== void 0 ? { baseHash } : {},
		writeOptions: {
			allowedAgentRosterRemovals: [agentId],
			...opts.json ? { skipOutputLogs: true } : {}
		}
	});
	if (!opts.json) logConfigUpdated(runtime);
	await purgeAgentSessionStoreEntries(cfg, agentId);
	const quietRuntime = opts.json ? createQuietRuntime(runtime) : runtime;
	const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
	const workspaceRetained = workspaceSharedWith.length > 0;
	let workspaceCleanupError;
	if (workspaceRetained) quietRuntime.log(`Skipped workspace removal (shared with other agents: ${workspaceSharedWith.join(", ")}): ${workspaceDir}`);
	else {
		const legacyPlan = prepareLegacyWorkspaceStateReset(workspaceDir);
		const statePlan = prepareWorkspaceStateDeletion(workspaceDir);
		if (await moveToTrash(workspaceDir, quietRuntime)) try {
			const legacyCleanup = await removeLegacyWorkspaceStateForReset(legacyPlan);
			for (const warning of legacyCleanup.warnings) quietRuntime.log(warning);
			deleteWorkspaceState(statePlan);
		} catch (error) {
			workspaceCleanupError = error instanceof Error ? error : new Error(String(error));
		}
	}
	await moveToTrash(agentDir, quietRuntime);
	await moveToTrash(sessionsDir, quietRuntime);
	if (workspaceCleanupError) throw workspaceCleanupError;
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
		clearedOwnerRefs: result.clearedOwnerRefs.length > 0 ? result.clearedOwnerRefs : void 0
	});
	else {
		runtime.log(`Deleted agent: ${agentId}`);
		logClearedOwnerRefs(runtime, result.clearedOwnerRefs);
	}
}
//#endregion
export { agentsDeleteCommand };
