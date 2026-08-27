import { n as isTruthyEnvValue } from "./env-y-_yRnBE.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { d as isSecretRef } from "./types.secrets-BrIfhxSG.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { l as clearLoadInstalledPluginIndexInstallRecordsCache, n as loadInstalledPluginIndexInstallRecords, r as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-PWJi_KhT.js";
import { b as requireActivePluginChannelRegistry } from "./runtime-g0R28Sy0.js";
import { a as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BULcX9xX.js";
import { _ as readConfigSnapshotAuditRecord, a as appendConfigAuditRecordSync, b as upsertConfigSnapshotAuditRecord, g as fingerprintConfigSnapshotAuthoredConfig, h as configSnapshotAuditRecordMatchesPath, o as capConfigAuditIssues, s as capConfigAuditPaths, v as readLatestConfigSnapshotAuditRecord } from "./io.audit-BpOif9wN.js";
import { b as resolveConfigWriteFollowUp, c as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshotMetadata, u as hashRuntimeConfigValue, w as setRuntimeConfigAppliedHash } from "./runtime-snapshot-Dp7mvsA3.js";
import { n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { t as getConfigValueAtPath } from "./config-paths-BxrCExaV.js";
import "./config-Dl8DJbzM.js";
import { n as isRestartEnabled } from "./commands.flags-CZN5Wwe1.js";
import { i as getActiveGatewayRootWorkCount, m as runWithGatewayIndependentRootWorkAdmission, p as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import { f as setGatewaySigusr1RestartPolicy, l as resolveGatewayRestartDeferralTimeoutMs, r as deferGatewayRestartUntilIdle } from "./restart-CgqaA_Te.js";
import "./installed-plugin-index-records-C5AmaeOQ.js";
import { t as getChannelPlugin } from "./registry-B3yYjPW1.js";
import "./plugins-cwOWOggC.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { d as rejectPendingPreparedModelRuntimeReplacement, s as markPreparedModelRuntimeSnapshotsStale, u as refreshPreparedModelRuntimeSnapshots } from "./prepared-model-runtime-CzaIYeTz.js";
import { r as clearCurrentProviderAuthState } from "./model-provider-auth-state-DW_JYm-o.js";
import { i as warmCurrentProviderAuthStateOffMainThread } from "./model-provider-auth-BGI6Db36.js";
import { d as getActiveEmbeddedRunCount } from "./run-state-BxqT1sw2.js";
import { i as refreshContextWindowCache } from "./context-DCjX8f9I.js";
import { c as getActiveBackgroundExecSessionCount } from "./bash-process-registry-rM437CTr.js";
import { t as getTotalPendingReplies } from "./dispatcher-registry-B2AzyUtN.js";
import { c as getTotalQueueSize } from "./command-queue-CqN2qr5o.js";
import { n as getInspectableActiveTaskRestartBlockers } from "./task-registry.maintenance-Cki3gxTY.js";
import { t as formatActiveTaskRestartBlocker } from "./task-restart-blocker-DNMfEXg3.js";
import { a as GatewayReloadRequiresRecoveryOwnerError, c as isGatewayReloadGenerationAborted, i as GatewayHotReloadStaleSecretsError, l as nextGatewayReloadGeneration, n as GatewayHotReloadCancelledError, o as abortPendingChannelReloads, r as GatewayHotReloadRecoveryError, s as isCurrentGatewayReloadGeneration, t as GatewayConfigReloadSupersededError$1 } from "./server-reload-contracts-DurasdFB.js";
import { r as resetDirectoryCache } from "./target-resolver--eBeHIN9.js";
import { n as disposeAllSessionMcpRuntimes } from "./agent-bundle-mcp-manager-api---RxFpSz.js";
import "./agent-bundle-mcp-tools-D35fQUzy.js";
import { c as getActiveSecretsRuntimeSnapshotRevisionState, g as hasSameSecretReloadContract, l as getActiveSecretsRuntimeSnapshotState, p as hasActiveSecretsRuntimeSnapshotLineage, r as clearSecretsRuntimeSnapshotState, x as setSecretsRuntimeSourceSnapshotIfCurrent, y as restoreSecretsRuntimeSourceSnapshotIfLineageCurrent } from "./runtime-state-BVazrsUD.js";
import { b as resolveHooksConfig, t as commitHooksConfigReload } from "./hooks-9rLx-NQq.js";
import { n as resetSkillSnapshotConfigFingerprintCache } from "./snapshot-config-fingerprint-B7hft00R.js";
import { n as diffGatewayReloadPaths, t as diffConfigPaths } from "./config-diff-i67fSCq8.js";
import { i as listPluginInstallWholeRecordPaths, n as isNoopGatewayReloadPlan, r as listPluginInstallTimestampMetadataPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-C2Rvv4LM.js";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-q1wYjpRM.js";
import { c as isSharedGatewaySessionGenerationOwnershipCurrent, d as setRequiredSharedGatewaySessionGenerationIfOwned, i as disconnectStaleSharedGatewayAuthClients, n as claimSharedGatewaySessionGenerationIfOwned, o as finalizeOwnedSharedGatewaySessionGeneration, t as captureSharedGatewaySessionGenerationOwnership, u as restoreOwnedCurrentSharedGatewaySessionGeneration } from "./server-shared-auth-generation-BKVola-Y.js";
import { t as buildGatewayCronService } from "./server-cron-sQsER5D-.js";
import { t as invalidateConfigGetResponseCache } from "./config-get-response-C8Z8Bwac.js";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-DwZwIsL5.js";
import { i as startGatewayCronWithLogging } from "./server-runtime-services-CKjivCuK.js";
import { t as startGatewayChannelHealthMonitor } from "./server-runtime-startup-services-3kvPgEyy.js";
import { r as publishRuntimeSecretsStateTransition } from "./server-startup-config-OmkTeNKk.js";
import { homedir } from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import chokidar from "chokidar";
//#region src/gateway/config-reload-recovery.ts
function shouldRefreshContextWindowCache(plan) {
	return plan.reloadPlugins || plan.changedPaths.some((path) => path === "models" || path.startsWith("models.") || path === "agents" || path === "agents.defaults" || path === "agents.entries" || path.startsWith("agents.entries.") || path === "agents.defaults.workspace" || path.startsWith("agents.defaults.workspace."));
}
/** Skip broad auth scans unless a reload can change provider availability. */
function shouldRewarmProviderAuthState(plan) {
	return plan.reloadPlugins || plan.changedPaths.some(isProviderAuthRelevantReloadPath);
}
const PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS = /* @__PURE__ */ new Set([
	"auth",
	"env",
	"models",
	"plugins",
	"secrets"
]);
const PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS = /* @__PURE__ */ new Set([
	"agentDir",
	"agentRuntime",
	"default",
	"id",
	"imageModel",
	"mediaModels",
	"model",
	"models",
	"modelPolicy",
	"pdfModel",
	"runtime",
	"utilityModel",
	"voiceModel",
	"workspace"
]);
function isAuthRelevantAgentSubfield(field, next, nested) {
	if (field === void 0) return true;
	if (PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS.has(field)) return true;
	if (field === "heartbeat" || field === "subagents") return next === void 0 || next === "model";
	return field === "compaction" && (next === void 0 || next === "model" || next === "provider" || next === "memoryFlush" && (nested === void 0 || nested === "model"));
}
function isProviderAuthRelevantReloadPath(path) {
	const segments = path.split(".");
	const [head = "", second, third, fourth] = segments;
	if (PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS.has(head)) return true;
	if (head === "agent" && second === "model") return true;
	if (head !== "agents") return false;
	if (second === void 0 || second === "list") return true;
	if (second === "defaults") return isAuthRelevantAgentSubfield(third, segments[3], segments[4]);
	if (second === "entries") return isAuthRelevantAgentSubfield(fourth, segments[4], segments[5]);
	return false;
}
function reloadPlanNeedsRecovery(plan) {
	return plan.restartCron || plan.restartHealthMonitor || plan.restartGmailWatcher || plan.reloadPlugins || plan.restartChannels.size > 0 || (plan.restartChannelAccounts?.size ?? 0) > 0 || shouldRefreshContextWindowCache(plan);
}
//#endregion
//#region src/gateway/server-reload-active-work.ts
const CHANNEL_RELOAD_DEFERRAL_POLL_MS = 500;
const CHANNEL_RELOAD_STILL_PENDING_WARN_MS = 3e4;
function createGatewayActiveWorkTracker(options) {
	const { params, myGeneration } = options;
	const getActiveCounts = () => {
		const queueSize = getTotalQueueSize();
		const pendingReplies = getTotalPendingReplies();
		const embeddedRuns = getActiveEmbeddedRunCount();
		const backgroundExecSessions = getActiveBackgroundExecSessionCount();
		const rootRequests = getActiveGatewayRootWorkCount({ excludeCurrent: true });
		const activeTasks = getInspectableActiveTaskRestartBlockers().length;
		return {
			queueSize,
			pendingReplies,
			embeddedRuns,
			backgroundExecSessions,
			rootRequests,
			activeTasks,
			totalActive: queueSize + pendingReplies + embeddedRuns + backgroundExecSessions + rootRequests + activeTasks
		};
	};
	const formatActiveDetails = (counts) => {
		const details = [];
		if (counts.queueSize > 0) details.push(`${counts.queueSize} operation(s)`);
		if (counts.pendingReplies > 0) details.push(`${counts.pendingReplies} reply(ies)`);
		if (counts.embeddedRuns > 0) details.push(`${counts.embeddedRuns} embedded run(s)`);
		if (counts.backgroundExecSessions > 0) details.push(`${counts.backgroundExecSessions} background exec session(s)`);
		if (counts.rootRequests > 0) details.push(`${counts.rootRequests} gateway request(s)`);
		if (counts.activeTasks > 0) details.push(`${counts.activeTasks} background task run(s)`);
		return details;
	};
	const formatTaskBlockers = () => {
		const blockers = getInspectableActiveTaskRestartBlockers();
		if (blockers.length === 0) return null;
		const shown = blockers.slice(0, 8).map(formatActiveTaskRestartBlocker);
		const omitted = blockers.length - shown.length;
		return omitted > 0 ? `${shown.join("; ")}; +${omitted} more` : shown.join("; ");
	};
	const formatDeferredWorkStatus = (status) => {
		const details = formatActiveDetails(getActiveCounts()).join(", ");
		const taskBlockers = formatTaskBlockers();
		return `${details} ${status}${taskBlockers ? ` (${taskBlockers})` : ""}`;
	};
	const waitForActiveWorkBeforeChannelReload = async (channels, isTransactionCurrent) => {
		if (!isTransactionCurrent()) return true;
		const initial = getActiveCounts();
		if (initial.totalActive <= 0) return false;
		const channelNames = [...channels].join(", ");
		const initialDetails = formatActiveDetails(initial);
		params.logReload.warn(`config change requires channel reload (${channelNames}) — deferring until ${initialDetails.join(", ")} complete`);
		const timeoutMs = resolveGatewayRestartDeferralTimeoutMs();
		const startedAt = Date.now();
		let nextStillPendingAt = startedAt + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
		while (true) {
			if (!isTransactionCurrent() || isGatewayReloadGenerationAborted(myGeneration)) return true;
			await new Promise((resolve) => {
				setTimeout(resolve, CHANNEL_RELOAD_DEFERRAL_POLL_MS).unref?.();
			});
			if (!isTransactionCurrent() || isGatewayReloadGenerationAborted(myGeneration)) return true;
			const current = getActiveCounts();
			if (current.totalActive <= 0) return false;
			const elapsedMs = Date.now() - startedAt;
			if (timeoutMs !== void 0 && elapsedMs >= timeoutMs) {
				const remaining = formatActiveDetails(current);
				params.logReload.warn(`channel reload timeout after ${elapsedMs}ms with ${remaining.join(", ")} still active; reloading channels anyway`);
				return false;
			}
			if (Date.now() >= nextStillPendingAt) {
				const remaining = formatActiveDetails(current);
				params.logReload.warn(`channel reload still deferred after ${elapsedMs}ms with ${remaining.join(", ")} active`);
				nextStillPendingAt = Date.now() + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
			}
		}
	};
	return {
		formatActiveDetails,
		formatDeferredWorkStatus,
		formatTaskBlockers,
		getActiveCounts,
		waitForActiveWorkBeforeChannelReload
	};
}
//#endregion
//#region src/gateway/server-reload-utils.ts
function projectCanonicalSecretRefsOntoRuntime(sourceValue, runtimeValue) {
	if (isSecretRef(sourceValue)) return sourceValue;
	if (Array.isArray(sourceValue)) {
		const runtimeArray = Array.isArray(runtimeValue) ? runtimeValue : [];
		return sourceValue.map((entry, index) => projectCanonicalSecretRefsOntoRuntime(entry, runtimeArray[index]));
	}
	if (isRecord(sourceValue)) {
		const runtimeRecord = isRecord(runtimeValue) ? runtimeValue : {};
		const projected = { ...runtimeRecord };
		for (const [key, entry] of Object.entries(sourceValue)) projected[key] = projectCanonicalSecretRefsOntoRuntime(entry, runtimeRecord[key]);
		return projected;
	}
	return runtimeValue === void 0 ? sourceValue : runtimeValue;
}
function restoreCanonicalSecretRefs(runtimeConfig, sourceConfig) {
	return projectCanonicalSecretRefsOntoRuntime(sourceConfig, runtimeConfig);
}
function resetPreparedModelRuntimeStateForHotReload() {
	clearCurrentProviderAuthState();
}
function assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable) {
	if (restartRecoveryAvailable !== false) return;
	if (plan.restartGateway) throw new GatewayReloadRequiresRecoveryOwnerError("gateway restart");
	if (reloadPlanNeedsRecovery(plan)) throw new GatewayReloadRequiresRecoveryOwnerError("irreversible hot reload");
}
async function disposeMcpRuntimesWithTimeout(params) {
	let timer;
	const disposePromise = Promise.resolve().then(params.dispose).catch((error) => {
		params.onWarn(`${params.label} failed: ${String(error)}`);
	});
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => resolve("timeout"), params.timeoutMs);
		timer.unref?.();
	});
	const result = await Promise.race([disposePromise.then(() => "done"), timeoutPromise]);
	if (timer) clearTimeout(timer);
	if (result === "timeout") params.onWarn(`${params.label} exceeded ${params.timeoutMs}ms; continuing`);
}
async function collectChannelOperationFailures(params) {
	const failures = [];
	for (const channel of params.channels) try {
		await params.run(channel);
	} catch (err) {
		failures.push(channel);
		params.onFailure(channel, err);
	}
	return failures;
}
//#endregion
//#region src/gateway/server-reload-channel-restart.ts
function startGatewayChannelFromActiveRegistry(params, channel, accountId) {
	return withPluginRuntimeRegistryScope(requireActivePluginChannelRegistry(), () => runOutsideGatewayRootWorkAdmission(() => accountId === void 0 ? params.startChannel(channel) : params.startChannel(channel, accountId)));
}
async function restartGatewayChannels(options) {
	const { params, plan, nextConfig, channelsToRestart, restartChannelAccounts, activePluginChannelsAfterReload, channelsStoppedBeforePluginReload, accountsStoppedBeforePluginReload, shouldSkipChannelRestart, skipChannelRestartLogMessage, pluginReloadAborted, isLifecycleReloadAborted, getChannelAutostartSuppression, channelReloadTargets, logSuppressedChannelRestart, scheduleRecoveryRestart } = options;
	const wasStoppedBeforePluginReload = (channel, accountId) => accountsStoppedBeforePluginReload.get(channel)?.has(accountId) === true;
	const collectChannelAccountTargets = () => {
		const targets = [];
		for (const [channel, accountIds] of restartChannelAccounts) {
			if (channelsToRestart.has(channel) || plan.reloadPlugins && activePluginChannelsAfterReload?.has(channel) === false) continue;
			const plugin = getChannelPlugin(channel);
			let listedAccountIds;
			try {
				listedAccountIds = new Set(plugin?.config.listAccountIds(nextConfig) ?? []);
			} catch (err) {
				scheduleRecoveryRestart(`channel account enumeration (${channel})`, err);
				continue;
			}
			if ([...accountIds].some((accountId) => !listedAccountIds.has(accountId))) {
				channelsToRestart.add(channel);
				continue;
			}
			try {
				for (const accountId of accountIds) plugin?.config.resolveAccount(nextConfig, accountId);
			} catch (err) {
				params.logChannels.info(`promoting ${channel} account reload to whole-channel restart after account resolution failed: ${formatErrorMessage(err)}`);
				channelsToRestart.add(channel);
				continue;
			}
			for (const accountId of accountIds) targets.push([channel, accountId]);
		}
		return targets;
	};
	if (channelsToRestart.size > 0 || restartChannelAccounts.size > 0) if (shouldSkipChannelRestart) params.logChannels.info(skipChannelRestartLogMessage);
	else if (getChannelAutostartSuppression()) if (pluginReloadAborted) params.logChannels.info("channel restart cancelled by in-process restart");
	else {
		const accountStops = collectChannelAccountTargets();
		const accountStopFailures = [];
		for (const [channel, accountId] of accountStops) try {
			params.logChannels.info(`stopping ${channel} account ${accountId} before suppressed hot reload`);
			if (!wasStoppedBeforePluginReload(channel, accountId)) await params.stopChannel(channel, accountId, { manual: false });
		} catch (err) {
			accountStopFailures.push(`${channel}[${accountId}]`);
			params.logChannels.error(`failed to stop ${channel} account ${accountId} during suppressed hot reload: ${formatErrorMessage(err)}`);
		}
		const stopFailures = await collectChannelOperationFailures({
			channels: channelsToRestart,
			run: async (channel) => {
				if (plan.reloadPlugins && activePluginChannelsAfterReload?.has(channel) === false) return;
				if (channelsStoppedBeforePluginReload.has(channel)) return;
				params.logChannels.info(`stopping ${channel} channel before suppressed hot reload`);
				await params.stopChannel(channel, void 0, { manual: false });
			},
			onFailure: (channel, err) => {
				params.logChannels.error(`failed to stop ${channel} channel during suppressed hot reload: ${formatErrorMessage(err)}`);
			}
		});
		const allStopFailures = [...accountStopFailures, ...stopFailures];
		if (allStopFailures.length > 0) scheduleRecoveryRestart(`channel stop (${allStopFailures.join(", ")})`);
		logSuppressedChannelRestart(channelReloadTargets(), "channel restart during hot reload");
	}
	else if (pluginReloadAborted) params.logChannels.info("channel restart cancelled by in-process restart");
	else {
		const accountRestarts = collectChannelAccountTargets();
		const accountRestartFailures = [];
		for (const [channel, accountId] of accountRestarts) try {
			params.logChannels.info(`restarting ${channel} account ${accountId}`);
			if (!wasStoppedBeforePluginReload(channel, accountId)) await params.stopChannel(channel, accountId, { manual: false });
			if (isLifecycleReloadAborted()) continue;
			await startGatewayChannelFromActiveRegistry(params, channel, accountId);
		} catch (err) {
			accountRestartFailures.push(`${channel}[${accountId}]`);
			params.logChannels.error(`failed to restart ${channel} account ${accountId} during hot reload: ${formatErrorMessage(err)}`);
		}
		const restartChannel = async (name) => {
			if (plan.reloadPlugins && activePluginChannelsAfterReload?.has(name) === false) return;
			params.logChannels.info(`restarting ${name} channel`);
			if (!channelsStoppedBeforePluginReload.has(name)) await params.stopChannel(name, void 0, { manual: false });
			if (isLifecycleReloadAborted()) return;
			await startGatewayChannelFromActiveRegistry(params, name);
		};
		const restartFailures = await collectChannelOperationFailures({
			channels: channelsToRestart,
			run: restartChannel,
			onFailure: (channel, err) => {
				params.logChannels.error(`failed to restart ${channel} channel during hot reload: ${formatErrorMessage(err)}`);
			}
		});
		const allRestartFailures = [...accountRestartFailures, ...restartFailures];
		if (allRestartFailures.length > 0) scheduleRecoveryRestart(`channel restart (${allRestartFailures.join(", ")})`);
	}
}
//#endregion
//#region src/gateway/applied-config-hash-publisher.ts
function createAppliedConfigHashPublisher(options) {
	let deferredHash = null;
	return {
		hasOutstandingGatewayRestart: options.hasPendingRestart,
		publishAppliedConfigHash: (hash) => {
			if (options.hasPendingRestart()) {
				deferredHash = hash;
				return;
			}
			deferredHash = null;
			options.publish(hash);
		},
		publishDeferredAppliedConfigHash: () => {
			if (deferredHash === null || options.hasPendingRestart()) return;
			const hash = deferredHash;
			deferredHash = null;
			options.publish(hash);
		}
	};
}
//#endregion
//#region src/gateway/server-reload-restart.ts
const RESTART_EMISSION_RETRY_MS = 1e3;
var GatewayRestartTransaction = class {
	constructor(options) {
		this.options = options;
		this.restartPending = false;
		this.retryStopped = false;
		this.retryTimer = null;
		this.restartDeferral = null;
		this.requestGeneration = 0;
		this.operation = { kind: "idle" };
		this.pausedDebt = null;
		this.conservativeDebt = null;
		this.acceptedTargetState = {
			kind: "empty",
			generation: 0
		};
		this.appliedConfigHashPublisher = createAppliedConfigHashPublisher({
			hasPendingRestart: () => this.operation.kind === "request" || this.pausedDebt !== null || this.conservativeDebt !== null,
			publish: setRuntimeConfigAppliedHash
		});
		this.isStopped = () => this.retryStopped;
		this.hasPendingConfigCandidate = () => this.acceptedTargetState.kind === "candidate-pending";
		this.hasOperation = () => this.operation.kind !== "idle";
		this.getAcceptedTarget = () => this.acceptedTargetState.kind === "accepted" ? this.acceptedTargetState.target : null;
	}
	recordAcceptedTarget(target) {
		const generation = this.acceptedTargetState.generation + 1;
		const acceptedTarget = {
			...target,
			prepareRuntimeConfig: async () => {
				if (this.acceptedTargetState !== acceptedState) throw new GatewayConfigReloadSupersededError$1();
				const prepared = await target.prepareRuntimeConfig();
				if (this.acceptedTargetState !== acceptedState) throw new GatewayConfigReloadSupersededError$1();
				return prepared;
			}
		};
		const acceptedState = {
			kind: "accepted",
			generation,
			target: acceptedTarget
		};
		this.acceptedTargetState = acceptedState;
		return { reject: () => {
			const state = this.acceptedTargetState;
			if (!(state.kind === "accepted" && state.target === acceptedTarget || state.kind === "candidate-pending" && state.previousTarget === acceptedTarget)) return;
			this.acceptedTargetState = {
				kind: "candidate-pending",
				generation: generation + 1,
				previousTarget: void 0
			};
		} };
	}
	publishAcceptedTarget(target) {
		return {
			ownership: this.recordAcceptedTarget(target),
			conservativeDebt: this.takeConservativeDebt()
		};
	}
	restoreConservativeDebt(debt) {
		this.conservativeDebt ??= debt;
	}
	deferDebt(plan, nextConfig, options) {
		this.preserveDebt(this.createRequestDetails(plan, nextConfig, options));
	}
	acceptConfig(acceptedConfig) {
		if (this.operation.kind === "idle" || this.operation.transaction.state !== "rejected") return { retireRejectedRestart: false };
		if (this.operation.kind === "request" && !this.operation.emissionSettled) this.preserveDebt(this.operation.details);
		this.supersedeRequest();
		const configDebt = this.pausedDebt;
		const retainsConfigDebt = configDebt && acceptedConfig && configDebt.restartOwnedPaths.every((path) => isDeepStrictEqual(getConfigValueAtPath(configDebt.nextConfig, path.split(".")), getConfigValueAtPath(acceptedConfig, path.split("."))));
		if (!retainsConfigDebt) this.pausedDebt = null;
		const debt = (retainsConfigDebt ? configDebt : null) ?? this.conservativeDebt;
		return debt ? {
			retireRejectedRestart: false,
			debt
		} : { retireRejectedRestart: true };
	}
	retireRejectedRequest() {
		return this.acceptConfig().retireRejectedRestart;
	}
	beginLifecycle() {
		if (this.operation.kind === "request" && !this.operation.emissionSettled && this.operation.transaction.state !== "pending") this.preserveDebt(this.operation.details);
		this.supersedeRequest();
		const transaction = { state: "pending" };
		this.operation = {
			kind: "lifecycle",
			transaction
		};
		return { settle: (state) => {
			if (transaction.state === "pending") {
				transaction.state = state;
				if (state === "committed") this.pausedDebt = null;
			}
		} };
	}
	pauseForConfigCandidate() {
		const state = this.acceptedTargetState;
		const previousTarget = state.kind === "accepted" ? state.target : state.kind === "candidate-pending" ? state.previousTarget : void 0;
		this.acceptedTargetState = {
			kind: "candidate-pending",
			generation: state.generation,
			previousTarget
		};
		this.beginLifecycle().settle("rejected");
	}
	request(plan, nextConfig, options) {
		if (this.retryStopped) return {
			status: "recovery-pending",
			settle: () => {}
		};
		this.supersedeRequest();
		const transaction = { state: "pending" };
		this.operation = {
			kind: "request",
			transaction,
			details: this.createRequestDetails(plan, nextConfig, options),
			emissionSettled: false
		};
		const requestGeneration = this.requestGeneration;
		return {
			status: this.requestForGeneration(plan, nextConfig, requestGeneration, options) ? "accepted" : "recovery-pending",
			settle: (state) => {
				if (transaction.state === "pending") transaction.state = state;
			}
		};
	}
	stop() {
		this.retryStopped = true;
		this.pausedDebt = null;
		this.conservativeDebt = null;
		this.supersedeRequest();
	}
	createRequestDetails(plan, nextConfig, options) {
		const explicitRestartPaths = plan.restartReasons.filter((path) => plan.changedPaths.includes(path));
		return {
			plan,
			nextConfig: options?.debtConfig ?? nextConfig,
			restartOwnedPaths: explicitRestartPaths.length > 0 ? explicitRestartPaths : [...plan.changedPaths],
			retainDebtAcrossConfigChanges: options?.retainDebtAcrossConfigChanges === true
		};
	}
	preserveDebt(details) {
		if (details.retainDebtAcrossConfigChanges) this.conservativeDebt = details;
		else this.pausedDebt = details;
	}
	takeConservativeDebt() {
		const debt = this.conservativeDebt;
		this.conservativeDebt = null;
		return debt;
	}
	markEmissionSettled() {
		if (this.operation.kind === "request") this.operation.emissionSettled = true;
		this.conservativeDebt = null;
	}
	isCurrentRequest(requestGeneration) {
		return !this.retryStopped && requestGeneration === this.requestGeneration && isCurrentGatewayReloadGeneration(this.options.myGeneration);
	}
	supersedeRequest() {
		this.requestGeneration += 1;
		this.restartPending = false;
		this.restartDeferral?.cancel();
		this.restartDeferral = null;
		if (this.retryTimer) {
			clearTimeout(this.retryTimer);
			this.retryTimer = null;
		}
		this.operation = { kind: "idle" };
	}
	scheduleEmissionRetry(retry) {
		if (this.retryTimer || !this.isCurrentRequest(retry.requestGeneration)) return;
		this.restartPending = true;
		this.retryTimer = setTimeout(() => {
			this.retryTimer = null;
			if (!this.isCurrentRequest(retry.requestGeneration)) return;
			runWithGatewayIndependentRootWorkAdmission(async () => {
				if (!this.isCurrentRequest(retry.requestGeneration)) return;
				this.restartPending = false;
				if (retry.prepareForEmit && !await retry.prepareForEmit()) {
					this.scheduleEmissionRetry(retry);
					return;
				}
				const emitResult = this.options.params.requestRecoveryRestart?.(retry.reason, retry.intent);
				if (emitResult && emitResult.status !== "failed") this.markEmissionSettled();
				if (!emitResult || emitResult.status === "failed") this.scheduleEmissionRetry(retry);
			}).catch((err) => {
				if (this.isCurrentRequest(retry.requestGeneration)) this.options.params.logReload.warn(`gateway restart recovery retry stopped: ${String(err)}`);
			});
		}, RESTART_EMISSION_RETRY_MS);
		this.retryTimer.unref?.();
	}
	requestForGeneration(plan, nextConfig, requestGeneration, options) {
		const { params } = this.options;
		const reasons = plan.restartReasons.length ? plan.restartReasons.join(", ") : plan.changedPaths.join(", ");
		const restartReason = `config reload: ${reasons}`;
		if (!this.options.restartRecoveryAvailable) {
			params.logReload.warn("gateway restart recovery unavailable; restart-required reload rejected");
			return false;
		}
		if (!params.requestRecoveryRestart) {
			params.logReload.warn("gateway restart recovery handler unavailable; restart skipped");
			return false;
		}
		const requestRecoveryRestart = params.requestRecoveryRestart;
		let emissionPrepared = true;
		const prepareForEmit = async () => {
			try {
				await params.assertRestartReady?.();
				if (!this.isCurrentRequest(requestGeneration)) return false;
				const preparedConfig = options?.prepareRuntimeConfig ? await options.prepareRuntimeConfig() : nextConfig;
				if (!this.isCurrentRequest(requestGeneration)) return false;
				emissionPrepared = true;
				setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(preparedConfig) });
				return this.isCurrentRequest(requestGeneration);
			} catch (err) {
				emissionPrepared = false;
				params.logReload.warn(`gateway restart preflight failed: ${String(err)}`);
				return false;
			}
		};
		const active = this.options.getActiveCounts();
		if (active.totalActive > 0 || options?.prepareRuntimeConfig || params.assertRestartReady) {
			if (this.restartPending) {
				params.logReload.info(`config change requires gateway restart (${reasons}) — already waiting for operations to complete`);
				return true;
			}
			this.restartPending = true;
			if (active.totalActive > 0) {
				const initialDetails = this.options.formatActiveDetails(active);
				params.logReload.warn(`config change requires gateway restart (${reasons}) — deferring until ${initialDetails.join(", ")} complete`);
				const taskBlockers = this.options.formatTaskBlockers();
				if (taskBlockers) params.logReload.warn(`restart blocked by active background task run(s): ${taskBlockers}`);
			} else params.logReload.warn(`config change requires gateway restart (${reasons}) — preparing`);
			let failedEmission;
			this.restartDeferral = deferGatewayRestartUntilIdle({
				getPendingCount: () => this.options.getActiveCounts().totalActive,
				maxWaitMs: resolveGatewayRestartDeferralTimeoutMs(void 0),
				timeoutIntent: {
					force: true,
					reason: "config reload forced restart"
				},
				reason: restartReason,
				emitHooks: {
					beforeEmit: async () => {
						emissionPrepared = await prepareForEmit();
					},
					emitRestart: (reason, intent) => {
						if (!this.isCurrentRequest(requestGeneration)) return { status: "coalesced" };
						const resolvedReason = reason ?? restartReason;
						if (!emissionPrepared) {
							failedEmission = {
								reason: resolvedReason,
								intent
							};
							return { status: "failed" };
						}
						const emitResult = requestRecoveryRestart(resolvedReason, intent);
						if (emitResult.status !== "failed") this.markEmissionSettled();
						failedEmission = emitResult.status === "failed" ? {
							reason: resolvedReason,
							intent
						} : void 0;
						return emitResult;
					},
					afterEmitFailed: async () => {
						if (!this.isCurrentRequest(requestGeneration) || !failedEmission) return;
						if (!this.options.restartRecoveryAvailable) {
							params.logReload.warn("gateway restart recovery unavailable; retry skipped");
							return;
						}
						params.logReload.warn("gateway restart recovery emission failed; retrying");
						this.scheduleEmissionRetry({
							...failedEmission,
							requestGeneration,
							prepareForEmit
						});
					}
				},
				hooks: {
					onReady: () => {
						this.restartPending = false;
						this.restartDeferral = null;
						params.logReload.info("all operations and replies completed; restarting gateway now");
					},
					onStillPending: (_pending, elapsedMs) => {
						params.logReload.warn(`restart still deferred after ${elapsedMs}ms with ${this.options.formatDeferredWorkStatus("active")}`);
					},
					onTimeout: (_pending, elapsedMs) => {
						this.restartPending = false;
						this.restartDeferral = null;
						params.logReload.warn(`restart timeout after ${elapsedMs}ms with ${this.options.formatDeferredWorkStatus("still active")}; forcing restart`);
					},
					onCheckError: (err) => {
						this.restartPending = false;
						this.restartDeferral = null;
						params.logReload.warn(`restart deferral check failed (${String(err)}); restarting gateway now`);
					}
				}
			});
			setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
			return true;
		}
		params.logReload.warn(`config change requires gateway restart (${reasons})`);
		const emitResult = requestRecoveryRestart(restartReason);
		if (emitResult.status !== "failed") this.markEmissionSettled();
		if (emitResult.status === "failed") {
			params.logReload.warn("gateway restart recovery emission failed");
			if (this.options.restartRecoveryAvailable) this.scheduleEmissionRetry({
				reason: restartReason,
				requestGeneration,
				prepareForEmit
			});
			return false;
		}
		if (emitResult.status === "coalesced") params.logReload.info("gateway restart already scheduled; skipping duplicate signal");
		setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
		return true;
	}
};
function createGatewayRestartCoordinator(options) {
	const transaction = new GatewayRestartTransaction(options);
	return {
		acceptRestartConfig: (config) => transaction.acceptConfig(config),
		...transaction.appliedConfigHashPublisher,
		beginGatewayRestartLifecycle: () => transaction.beginLifecycle(),
		pauseGatewayRestartForConfigCandidate: () => transaction.pauseForConfigCandidate(),
		publishAcceptedRestartTarget: (target) => transaction.publishAcceptedTarget(target),
		recordAcceptedRestartTarget: (target) => transaction.recordAcceptedTarget(target),
		requestGatewayRestart: (plan, nextConfig, requestOptions) => transaction.request(plan, nextConfig, requestOptions),
		restoreConservativeRestartDebt: (debt) => transaction.restoreConservativeDebt(debt),
		retireRejectedRestartRequest: () => transaction.retireRejectedRequest(),
		stopRestartRetries: () => transaction.stop(),
		deferGatewayRestartDebt: (plan, nextConfig, requestOptions) => transaction.deferDebt(plan, nextConfig, requestOptions),
		getLatestAcceptedRestartTarget: transaction.getAcceptedTarget,
		hasConfigCandidatePending: transaction.hasPendingConfigCandidate,
		hasRestartRequestTransaction: transaction.hasOperation,
		isRestartRetryStopped: transaction.isStopped
	};
}
//#endregion
//#region src/gateway/server-reload-hot.ts
const MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS = 5e3;
function createGatewayReloadHandlers(params) {
	const myGeneration = nextGatewayReloadGeneration();
	const restartRecoveryAvailable = params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
	const { formatActiveDetails, formatDeferredWorkStatus, formatTaskBlockers, getActiveCounts, waitForActiveWorkBeforeChannelReload } = createGatewayActiveWorkTracker({
		params,
		myGeneration
	});
	const { acceptRestartConfig, beginGatewayRestartLifecycle, deferGatewayRestartDebt, getLatestAcceptedRestartTarget, hasOutstandingGatewayRestart, hasConfigCandidatePending, hasRestartRequestTransaction, isRestartRetryStopped, pauseGatewayRestartForConfigCandidate, publishAcceptedRestartTarget, publishAppliedConfigHash, publishDeferredAppliedConfigHash, recordAcceptedRestartTarget, requestGatewayRestart, restoreConservativeRestartDebt, retireRejectedRestartRequest, stopRestartRetries } = createGatewayRestartCoordinator({
		params,
		myGeneration,
		restartRecoveryAvailable,
		getActiveCounts,
		formatActiveDetails,
		formatDeferredWorkStatus,
		formatTaskBlockers
	});
	const applyHotReload = async (plan, nextConfig, publication) => {
		assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
		const isTransactionCurrent = () => !isRestartRetryStopped() && (publication?.isCurrent?.() ?? true);
		const state = params.getState();
		const nextState = { ...state };
		resetPreparedModelRuntimeStateForHotReload();
		let hooksReloadResolved = false;
		if (plan.reloadHooks) try {
			nextState.hooksConfig = resolveHooksConfig(nextConfig);
			hooksReloadResolved = true;
		} catch (err) {
			params.logHooks.warn(`hooks config reload failed: ${String(err)}`);
			throw err;
		}
		nextState.hookClientIpConfig = resolveHookClientIpConfig(nextConfig);
		if (plan.restartCron) nextState.cronState = buildGatewayCronService({
			cfg: nextConfig,
			deps: params.deps,
			broadcast: params.broadcast,
			env: publication?.runtimeEnv ?? process.env
		});
		resetDirectoryCache();
		const channelsToRestart = new Set(plan.restartChannels);
		const restartChannelAccounts = new Map([...plan.restartChannelAccounts ?? []].map(([channel, accountIds]) => [channel, new Set(accountIds)]));
		const channelsStoppedBeforePluginReload = /* @__PURE__ */ new Set();
		const accountsStoppedBeforePluginReload = /* @__PURE__ */ new Map();
		let activePluginChannelsAfterReload = null;
		let pluginReloadAborted = false;
		const isLifecycleReloadAborted = () => isGatewayReloadGenerationAborted(myGeneration);
		const isPluginReloadAborted = () => pluginReloadAborted || !isTransactionCurrent() || isLifecycleReloadAborted();
		let runtimeCommitted = false;
		let preparedModelRuntimeReplacementGateId;
		let recoveryRestartScheduled = false;
		const laneConcurrency = resolveGatewayLaneConcurrency(nextConfig);
		const candidateEnv = publication?.runtimeEnv ?? process.env;
		const shouldSkipChannelRestart = isTruthyEnvValue(candidateEnv.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(candidateEnv.OPENCLAW_SKIP_PROVIDERS);
		const channelReloadTargets = () => /* @__PURE__ */ new Set([...channelsToRestart, ...restartChannelAccounts.keys()]);
		const getChannelAutostartSuppression = () => params.getChannelAutostartSuppression?.() ?? null;
		const logSuppressedChannelRestart = (channels, action) => {
			if (!getChannelAutostartSuppression()) return;
			params.logChannels.info(`${action} suppressed by crash-loop breaker for channels: ${[...channels].join(", ")}`);
		};
		const commitRuntime = async () => {
			if (runtimeCommitted) return;
			const commit = async () => {
				if (plan.restartHeartbeat) {
					nextState.heartbeatRunner.updateConfig(nextConfig);
					nextState.cronState.reconcileHeartbeatJobs?.(nextConfig).catch((error) => {
						params.logReload.warn(`heartbeat monitor reconvergence failed: ${String(error)}`);
					});
				}
				preparedModelRuntimeReplacementGateId = markPreparedModelRuntimeSnapshotsStale("prepared model runtime owner is stale before config publication", { waitForReplacement: true });
				params.setState(nextState);
				if (hooksReloadResolved) commitHooksConfigReload();
				applyGatewayLaneConcurrency(laneConcurrency);
				runtimeCommitted = true;
				setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
				if (plan.restartCron) {
					params.cronReconciliation.invalidate();
					params.onCronRestart?.();
					if (state.cronState.cron.stopAndDrain) await state.cronState.cron.stopAndDrain();
					else {
						state.cronState.cron.stop();
						state.cronState.stopExitWatchers?.();
						await state.cronState.stopStreamWatchers?.();
					}
					startGatewayCronWithLogging({
						cronState: nextState.cronState,
						cronReconciliation: params.cronReconciliation,
						reason: "reload",
						config: nextConfig,
						afterStart: async () => {
							await Promise.all([nextState.cronState.reconcileExitWatchers?.(), nextState.cronState.reconcileStreamWatchers?.()]);
						},
						logCron: params.logCron,
						onStartError: (err) => {
							if (!isCurrentGatewayReloadGeneration(myGeneration) || params.getState().cronState !== nextState.cronState) return;
							try {
								scheduleRecoveryRestart("cron reload", err);
							} catch (recoveryError) {
								params.logCron.error(formatErrorMessage(recoveryError));
							}
						}
					});
				}
			};
			if (publication) await publication.publish(commit, () => runtimeCommitted);
			else await commit();
		};
		const settleRecoveryRestart = (restartTransaction, surface) => {
			if (restartTransaction.status === "recovery-pending" && !restartRecoveryAvailable) {
				restartTransaction.settle("rejected");
				throw new GatewayHotReloadRecoveryError(surface);
			}
			restartTransaction.settle("committed");
			recoveryRestartScheduled = true;
		};
		const scheduleRecoveryRestart = (surface, err) => {
			const detail = err === void 0 ? "" : `: ${formatErrorMessage(err)}`;
			if (runtimeCommitted) rejectPendingPreparedModelRuntimeReplacement(preparedModelRuntimeReplacementGateId, err ?? /* @__PURE__ */ new Error(`prepared model runtime replacement stopped during ${surface}`));
			if (isRestartRetryStopped()) {
				params.logReload.warn(`${surface} failed during gateway shutdown${detail}`);
				return;
			}
			if (!restartRecoveryAvailable || !params.requestRecoveryRestart) {
				const message = runtimeCommitted ? `config hot reload committed with unrecovered ${surface} failure${detail}; gateway restart recovery is unavailable; runtime may be inconsistent` : `config hot reload failed before commit during ${surface}${detail}; gateway restart recovery is unavailable`;
				if (params.logReload.error) params.logReload.error(message);
				else params.logReload.warn(message);
				if (runtimeCommitted) throw new GatewayHotReloadRecoveryError(surface);
				if (err instanceof Error) throw err;
				throw new Error(`config hot reload failed before commit during ${surface}${detail}`);
			}
			const recoveryPlan = {
				...plan,
				restartGateway: true,
				restartReasons: [`hot reload recovery: ${surface}`]
			};
			if (!isTransactionCurrent()) {
				params.logReload.warn(`${surface} failed after config supersession${detail}; recovery deferred to the newer config`);
				const target = getLatestAcceptedRestartTarget();
				if (!hasConfigCandidatePending() && !hasRestartRequestTransaction() && target) {
					const restartTransaction = requestGatewayRestart(recoveryPlan, target.runtimeConfig, {
						retainDebtAcrossConfigChanges: true,
						debtConfig: target.sourceConfig,
						prepareRuntimeConfig: target.prepareRuntimeConfig
					});
					settleRecoveryRestart(restartTransaction, surface);
					return;
				}
				deferGatewayRestartDebt(recoveryPlan, nextConfig, {
					retainDebtAcrossConfigChanges: true,
					debtConfig: publication?.sourceConfig ?? nextConfig
				});
				return;
			}
			params.logReload.warn(`${surface} failed after config commit${detail}; restarting gateway`);
			if (recoveryRestartScheduled) return;
			try {
				const restartTransaction = requestGatewayRestart(recoveryPlan, nextConfig, {
					retainDebtAcrossConfigChanges: true,
					debtConfig: publication?.sourceConfig ?? nextConfig,
					...publication?.prepareRestartRuntimeConfig ? { prepareRuntimeConfig: publication.prepareRestartRuntimeConfig } : {}
				});
				settleRecoveryRestart(restartTransaction, surface);
			} catch (restartError) {
				params.logReload.warn(`failed to schedule post-commit gateway restart: ${formatErrorMessage(restartError)}`);
				if (restartError instanceof GatewayHotReloadRecoveryError) throw restartError;
				throw new GatewayHotReloadRecoveryError(surface);
			}
		};
		if (plan.reloadPlugins) {
			const restartStoppedPluginAccounts = async (reason) => {
				const failures = [];
				for (const [channel, accountIds] of accountsStoppedBeforePluginReload) {
					for (const accountId of accountIds) try {
						params.logChannels.info(`restarting ${channel} account ${accountId} after ${reason}`);
						await startGatewayChannelFromActiveRegistry(params, channel, accountId);
						accountIds.delete(accountId);
					} catch (err) {
						failures.push(`${channel}[${accountId}]`);
						params.logChannels.error(`failed to restart ${channel} account ${accountId} after ${reason}: ${formatErrorMessage(err)}`);
					}
					if (accountIds.size === 0) accountsStoppedBeforePluginReload.delete(channel);
				}
				return failures;
			};
			const restartStoppedPluginChannels = async (reason) => await collectChannelOperationFailures({
				channels: [...channelsStoppedBeforePluginReload],
				run: async (channel) => {
					params.logChannels.info(`restarting ${channel} channel after ${reason}`);
					await startGatewayChannelFromActiveRegistry(params, channel);
					channelsStoppedBeforePluginReload.delete(channel);
				},
				onFailure: (channel, err) => {
					params.logChannels.error(`failed to restart ${channel} channel after ${reason}: ${formatErrorMessage(err)}`);
				}
			});
			const rollbackStoppedPluginTargets = async (reason) => [...await restartStoppedPluginAccounts(reason), ...await restartStoppedPluginChannels(reason)];
			const failPluginChannelRollback = (reason, failures) => {
				const error = /* @__PURE__ */ new Error(`plugin reload cancellation rollback failed for: ${failures.join(", ")}`);
				scheduleRecoveryRestart(`plugin channel rollback after ${reason}`, error);
				throw error;
			};
			const stopChannelsBeforePluginReplace = async (channels, accounts = /* @__PURE__ */ new Map()) => {
				for (const channel of channels) channelsToRestart.add(channel);
				for (const [channel, accountIds] of accounts) {
					if (channelsToRestart.has(channel)) continue;
					let restartAccountIds = restartChannelAccounts.get(channel);
					if (!restartAccountIds) {
						restartAccountIds = /* @__PURE__ */ new Set();
						restartChannelAccounts.set(channel, restartAccountIds);
					}
					for (const accountId of accountIds) restartAccountIds.add(accountId);
				}
				const targets = channelReloadTargets();
				if (targets.size === 0 || shouldSkipChannelRestart) return;
				if (await waitForActiveWorkBeforeChannelReload(targets, isTransactionCurrent)) {
					params.logChannels.info("channel reload before plugin replace cancelled by config supersession or restart");
					pluginReloadAborted = true;
					return;
				}
				const accountStopFailures = [];
				for (const [channel, accountIds] of accounts) {
					if (channelsToRestart.has(channel)) continue;
					for (const accountId of accountIds) {
						if (isPluginReloadAborted()) {
							pluginReloadAborted = true;
							break;
						}
						let stoppedAccountIds = accountsStoppedBeforePluginReload.get(channel);
						if (!stoppedAccountIds) {
							stoppedAccountIds = /* @__PURE__ */ new Set();
							accountsStoppedBeforePluginReload.set(channel, stoppedAccountIds);
						}
						if (stoppedAccountIds.has(accountId)) continue;
						stoppedAccountIds.add(accountId);
						try {
							params.logChannels.info(`stopping ${channel} account ${accountId} before plugin reload`);
							await params.stopChannel(channel, accountId, { manual: false });
							if (isPluginReloadAborted()) pluginReloadAborted = true;
						} catch (err) {
							accountStopFailures.push(`${channel}[${accountId}]`);
							params.logChannels.error(`failed to stop ${channel} account ${accountId} before plugin reload: ${formatErrorMessage(err)}`);
						}
					}
				}
				const channelStopFailures = await collectChannelOperationFailures({
					channels: channelsToRestart,
					run: async (channel) => {
						if (isPluginReloadAborted()) {
							pluginReloadAborted = true;
							return;
						}
						if (channelsStoppedBeforePluginReload.has(channel)) return;
						params.logChannels.info(`stopping ${channel} channel before plugin reload`);
						channelsStoppedBeforePluginReload.add(channel);
						await params.stopChannel(channel, void 0, { manual: false });
						if (isPluginReloadAborted()) pluginReloadAborted = true;
					},
					onFailure: (channel, err) => {
						params.logChannels.error(`failed to stop ${channel} channel before plugin reload: ${formatErrorMessage(err)}`);
					}
				});
				if (isPluginReloadAborted()) pluginReloadAborted = true;
				if (pluginReloadAborted) {
					if (isLifecycleReloadAborted()) return;
					const rollbackFailures = await rollbackStoppedPluginTargets("cancelled plugin reload pre-stop");
					if (rollbackFailures.length > 0) failPluginChannelRollback("cancelled plugin reload pre-stop", rollbackFailures);
					return;
				}
				const stopFailures = [...accountStopFailures, ...channelStopFailures];
				if (stopFailures.length > 0) {
					const rollbackFailures = await rollbackStoppedPluginTargets("failed plugin reload pre-stop");
					if (rollbackFailures.length > 0) failPluginChannelRollback("failed plugin reload pre-stop", rollbackFailures);
					throw new Error(`failed to stop channels before plugin reload: ${stopFailures.join(", ")}`);
				}
			};
			if (!pluginReloadAborted) {
				let pluginReloadResult;
				try {
					pluginReloadResult = await params.reloadPlugins({
						nextConfig,
						changedPaths: plan.changedPaths,
						beforeReplace: stopChannelsBeforePluginReplace,
						commitRuntime,
						env: publication?.runtimeEnv ?? process.env,
						isAborted: isPluginReloadAborted
					});
				} catch (err) {
					if (!runtimeCommitted) {
						const rollbackFailures = await rollbackStoppedPluginTargets("failed plugin runtime publication");
						if (rollbackFailures.length > 0) failPluginChannelRollback("failed plugin runtime publication", rollbackFailures);
						throw err;
					}
					scheduleRecoveryRestart("plugin runtime reload", err);
					return;
				}
				if (pluginReloadResult.cancelled) {
					pluginReloadAborted = true;
					if (!isLifecycleReloadAborted()) {
						const rollbackFailures = await rollbackStoppedPluginTargets("cancelled plugin runtime publication");
						if (rollbackFailures.length > 0) failPluginChannelRollback("cancelled plugin runtime publication", rollbackFailures);
					}
				}
				if (!pluginReloadAborted) {
					for (const channel of pluginReloadResult.restartChannels) channelsToRestart.add(channel);
					activePluginChannelsAfterReload = pluginReloadResult.activeChannels;
					resetPreparedModelRuntimeStateForHotReload();
				}
			}
		}
		const channelTargets = channelReloadTargets();
		const hasLiveChannelTargets = [...channelTargets].some((channel) => !channelsStoppedBeforePluginReload.has(channel));
		if (!pluginReloadAborted && hasLiveChannelTargets && !shouldSkipChannelRestart) pluginReloadAborted = await waitForActiveWorkBeforeChannelReload(channelTargets, isTransactionCurrent);
		if (pluginReloadAborted) {
			params.logChannels.info("channel restart cancelled by config supersession or restart");
			const error = new GatewayHotReloadCancelledError();
			if (runtimeCommitted) rejectPendingPreparedModelRuntimeReplacement(preparedModelRuntimeReplacementGateId, error);
			throw error;
		}
		try {
			await commitRuntime();
		} catch (err) {
			if (!runtimeCommitted) throw err;
			scheduleRecoveryRestart("runtime commit", err);
			return;
		}
		try {
			await refreshPreparedModelRuntimeSnapshots(nextConfig, {
				catalogMode: "static",
				allowGatewaySubagentBinding: true
			});
		} catch (err) {
			scheduleRecoveryRestart("prepared model runtime reload", err);
			return;
		}
		if (plan.restartHealthMonitor) try {
			state.channelHealthMonitor?.stop();
			await state.channelHealthMonitor?.waitForIdle();
			nextState.channelHealthMonitor = params.createHealthMonitor(nextConfig);
			params.setState(nextState);
		} catch (err) {
			scheduleRecoveryRestart("health monitor reload", err);
		}
		if (plan.disposeMcpRuntimes) await disposeMcpRuntimesWithTimeout({
			dispose: disposeAllSessionMcpRuntimes,
			timeoutMs: MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS,
			onWarn: params.logReload.warn,
			label: "bundle-mcp runtime disposal during config reload"
		});
		if (plan.restartGmailWatcher) {
			const restartAbortController = params.createGmailRestartAbortController?.() ?? new AbortController();
			try {
				await params.stopPostReadySidecars?.();
				if (!restartAbortController.signal.aborted) {
					const [{ stopGmailWatcher }, { startGmailWatcherWithLogs }] = await Promise.all([import("./gmail-watcher-BmZKkMQz.js"), import("./gmail-watcher-lifecycle-Bw0C-oXO.js")]);
					if (!restartAbortController.signal.aborted) await stopGmailWatcher().catch((err) => {
						params.logHooks.warn(`gmail watcher stop failed during reload: ${String(err)}`);
					});
					if (!restartAbortController.signal.aborted) await startGmailWatcherWithLogs({
						cfg: nextConfig,
						log: params.logHooks,
						isCancelled: () => restartAbortController.signal.aborted,
						signal: restartAbortController.signal,
						onSkipped: () => params.logHooks.info("skipping gmail watcher restart (OPENCLAW_SKIP_GMAIL_WATCHER=1)")
					});
				}
			} catch (err) {
				scheduleRecoveryRestart("gmail watcher reload", err);
			} finally {
				params.clearGmailRestartAbortController?.(restartAbortController);
			}
		}
		await restartGatewayChannels({
			params,
			plan,
			nextConfig,
			channelsToRestart,
			restartChannelAccounts,
			activePluginChannelsAfterReload,
			channelsStoppedBeforePluginReload,
			accountsStoppedBeforePluginReload,
			shouldSkipChannelRestart,
			skipChannelRestartLogMessage: "skipping channel reload (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)",
			pluginReloadAborted,
			isLifecycleReloadAborted,
			getChannelAutostartSuppression,
			channelReloadTargets,
			logSuppressedChannelRestart,
			scheduleRecoveryRestart
		});
		if (shouldRefreshContextWindowCache(plan)) try {
			await refreshContextWindowCache(nextConfig);
		} catch (err) {
			scheduleRecoveryRestart("context window cache reload", err);
		}
		if (shouldRewarmProviderAuthState(plan)) warmCurrentProviderAuthStateOffMainThread(nextConfig, { isCancelled: () => !isTransactionCurrent() }).catch((err) => {
			if (isTransactionCurrent()) params.logReload.warn(`provider auth state rewarm failed: ${String(err)}`);
		});
		if (plan.hotReasons.length > 0) params.logReload.info(`config hot reload applied (${plan.hotReasons.join(", ")})`);
		else if (plan.noopPaths.length > 0) params.logReload.info(`config change applied (dynamic reads: ${plan.noopPaths.join(", ")})`);
	};
	return {
		applyHotReload,
		acceptRestartConfig,
		publishAppliedConfigHash,
		publishDeferredAppliedConfigHash,
		hasOutstandingGatewayRestart,
		beginGatewayRestartLifecycle,
		pauseGatewayRestartForConfigCandidate,
		publishAcceptedRestartTarget,
		recordAcceptedRestartTarget,
		requestGatewayRestart,
		restoreConservativeRestartDebt,
		retireRejectedRestartRequest,
		stopRestartRetries
	};
}
//#endregion
//#region src/gateway/config-applied-revision.ts
function createConfigAppliedRevisionTracker(options) {
	let pending = null;
	const flush = async (currentConfig) => {
		const owner = pending;
		if (!owner) return;
		await options.onConfigApplied?.(owner.plan, currentConfig);
		options.onRevisionApplied?.(owner.hash);
		if (pending === owner) pending = null;
	};
	return {
		defer: (plan, hash) => {
			pending = {
				plan,
				hash
			};
		},
		flush,
		apply: async (plan, config, hash) => {
			if (pending?.plan === plan) {
				await flush(config);
				return;
			}
			await options.onConfigApplied?.(plan, config);
			options.onRevisionApplied?.(hash);
		}
	};
}
//#endregion
//#region src/gateway/config-reload.ts
const MISSING_CONFIG_RETRY_DELAY_MS = 150;
const MISSING_CONFIG_MAX_RETRIES = 2;
const WATCHER_RECREATE_MAX_RETRIES = 3;
const WATCHER_RECREATE_BACKOFF_MS = [
	500,
	2e3,
	5e3
];
function resolveChokidarUsePolling(degradedToPolling) {
	const envPoll = process.env.CHOKIDAR_USEPOLLING;
	if (envPoll !== void 0) {
		const envLower = envPoll.toLowerCase();
		if (envLower === "false" || envLower === "0") return false;
		if (envLower === "true" || envLower === "1") return true;
		return Boolean(envLower);
	}
	return Boolean(process.env.VITEST) || degradedToPolling;
}
/**
* Paths under `skills.*` always change the snapshot that sessions cache in
* sessions.json. Any prefix match here (for example `skills.allowBundled`,
* `skills.entries.X.enabled`, `skills.profile`) forces sessions to rebuild
* their snapshot on the next turn rather than silently advertising stale
* tools to the model.
*/
const SKILLS_INVALIDATION_PREFIXES = ["skills"];
function matchesSkillsInvalidationPrefix(path) {
	return SKILLS_INVALIDATION_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}.`));
}
function firstSkillsChangedPath(changedPaths) {
	return changedPaths.find(matchesSkillsInvalidationPrefix);
}
var GatewayConfigReloadSupersededError = class extends Error {
	constructor() {
		super("config reload superseded by a newer config write");
		this.name = "GatewayConfigReloadSupersededError";
	}
};
function isGatewayConfigReloadSupersededError(error) {
	return error instanceof Error && error.name === "GatewayConfigReloadSupersededError";
}
function asPluginInstallConfig(records) {
	return { plugins: { installs: records } };
}
function startGatewayConfigReloader(opts) {
	const initialSourceConfig = opts.initialCompareConfig ?? opts.initialConfig;
	const initialCandidate = opts.prepareConfigCandidate?.({
		runtimeConfig: opts.initialConfig,
		sourceConfig: initialSourceConfig,
		previousSourceConfig: initialSourceConfig
	});
	let currentConfig = initialCandidate?.runtimeConfig ?? opts.initialConfig;
	let currentCompareConfig = initialCandidate?.compareConfig ?? initialSourceConfig;
	let currentSourceConfig = initialSourceConfig;
	let currentRawHash = opts.initialSnapshotRawHash;
	let lastObservedRawHash = opts.initialSnapshotRawHash;
	let currentFingerprintedAuthoredConfig = fingerprintConfigSnapshotAuthoredConfig(opts.initialAuthoredConfig, {
		env: process.env,
		homedir
	});
	let currentRuntimeEnvSourceConfig = initialSourceConfig;
	let currentReapplyRuntimeOverlays = initialCandidate?.reapplyRuntimeOverlays ?? ((config) => config);
	let currentRuntimeRefresh;
	const resolveSettings = (config) => {
		const resolved = resolveGatewayReloadSettings(config);
		return opts.testDebounceMs === void 0 ? resolved : {
			...resolved,
			debounceMs: opts.testDebounceMs
		};
	};
	let settings = resolveSettings(currentConfig);
	let debounceTimer = null;
	let pending = false;
	let running = false;
	let stopped = false;
	const activeReloads = /* @__PURE__ */ new Set();
	let missingConfigRetries = 0;
	let configWriteEpoch = 0;
	let pendingInProcessConfig = null;
	let activeInProcessConfig = null;
	let watcherIntentCandidate = null;
	let watcherIntentCameFromPendingWrite = false;
	let startupInternalWriteHash = opts.initialInternalWriteHash ?? null;
	let lastAppliedWriteHash = null;
	let lastSourceOnlyWriteHash = null;
	let lastSourceOnlyReapplyRuntimeOverlays = null;
	let lastSourceOnlyRuntimeRefresh;
	let lastSourceOnlyRuntimeConfig = null;
	let lastSourceOnlySourceConfig = null;
	const appendExternalAudit = (record) => {
		appendConfigAuditRecordSync({
			env: process.env,
			homedir,
			record: {
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				source: "config-io",
				event: "config.external",
				configPath: opts.watchPath,
				...record
			}
		});
	};
	let currentSnapshotSlot = readLatestConfigSnapshotAuditRecord();
	const updateAcceptedSnapshot = (rawHash, authoredConfig) => {
		currentRawHash = rawHash;
		currentFingerprintedAuthoredConfig = fingerprintConfigSnapshotAuthoredConfig(authoredConfig, {
			env: process.env,
			homedir
		});
		const updatedSlot = upsertConfigSnapshotAuditRecord({
			configPath: opts.watchPath,
			rawHash,
			authoredConfig,
			expectedSnapshot: currentSnapshotSlot
		});
		if (updatedSlot) {
			currentSnapshotSlot = updatedSlot;
			return;
		}
		currentSnapshotSlot = readLatestConfigSnapshotAuditRecord();
		if (configSnapshotAuditRecordMatchesPath(currentSnapshotSlot, opts.watchPath)) {
			currentRawHash = currentSnapshotSlot.rawHash;
			currentFingerprintedAuthoredConfig = currentSnapshotSlot.fingerprintedAuthoredConfig;
		}
	};
	const priorSnapshot = configSnapshotAuditRecordMatchesPath(currentSnapshotSlot, opts.watchPath) ? currentSnapshotSlot : null;
	if (priorSnapshot && opts.initialSnapshotRawHash === null) {
		currentRawHash = priorSnapshot.rawHash;
		currentFingerprintedAuthoredConfig = priorSnapshot.fingerprintedAuthoredConfig;
		appendExternalAudit({
			detectedBy: "startup",
			previousHash: priorSnapshot.rawHash,
			nextHash: null,
			valid: false,
			issues: capConfigAuditIssues(["config file missing"])
		});
	} else if (priorSnapshot && priorSnapshot.rawHash !== opts.initialSnapshotRawHash) {
		if (!opts.initialSnapshotValid) {
			currentRawHash = priorSnapshot.rawHash;
			currentFingerprintedAuthoredConfig = priorSnapshot.fingerprintedAuthoredConfig;
		}
		const startupChangedPaths = opts.initialSnapshotValid ? diffConfigPaths(priorSnapshot.fingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(opts.initialAuthoredConfig, {
			env: process.env,
			homedir
		})) : [];
		appendExternalAudit({
			detectedBy: "startup",
			previousHash: priorSnapshot.rawHash,
			nextHash: opts.initialSnapshotRawHash,
			valid: opts.initialSnapshotValid,
			...!opts.initialSnapshotValid ? { issues: capConfigAuditIssues(formatConfigIssueLines(opts.initialSnapshotIssues, "", { normalizeRoot: true })) } : startupChangedPaths.length > 0 ? { changedPaths: capConfigAuditPaths(startupChangedPaths) } : { opaqueChange: true }
		});
	}
	if (opts.initialSnapshotRawHash !== null && opts.initialSnapshotValid) updateAcceptedSnapshot(opts.initialSnapshotRawHash, opts.initialAuthoredConfig);
	let currentPluginInstallRecords = opts.initialPluginInstallRecords ?? loadInstalledPluginIndexInstallRecordsSync();
	const readPluginInstallRecords = opts.readPluginInstallRecords ?? loadInstalledPluginIndexInstallRecords;
	const appliedRevision = createConfigAppliedRevisionTracker({
		onConfigApplied: opts.onConfigApplied,
		onRevisionApplied: opts.onConfigRevisionApplied
	});
	const scheduleAfter = (wait) => {
		if (stopped) return;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			startTrackedReload();
		}, wait);
	};
	const schedule = () => {
		scheduleAfter(settings.debounceMs);
	};
	const prepareRestart = async (plan, nextConfig, ownership, sourceConfig) => {
		try {
			await opts.onRestart(plan, nextConfig, ownership, sourceConfig);
		} catch (err) {
			if (isGatewayConfigReloadSupersededError(err)) opts.log.info(`config restart superseded: ${String(err)}`);
			else opts.log.error(`config restart failed: ${String(err)}`);
			throw err;
		}
	};
	const handleMissingSnapshot = (snapshot) => {
		if (snapshot.exists) {
			missingConfigRetries = 0;
			return false;
		}
		if (missingConfigRetries < MISSING_CONFIG_MAX_RETRIES) {
			missingConfigRetries += 1;
			opts.log.info(`config reload retry (${missingConfigRetries}/${MISSING_CONFIG_MAX_RETRIES}): config file not found`);
			scheduleAfter(MISSING_CONFIG_RETRY_DELAY_MS);
			return true;
		}
		opts.log.warn("config reload skipped (config file not found)");
		return true;
	};
	const handleInvalidSnapshot = (snapshot) => {
		if (snapshot.valid) return false;
		const issues = formatConfigIssueLines(snapshot.issues, "").join(", ");
		opts.log.warn(`config reload skipped (invalid config): ${issues}`);
		return true;
	};
	const applySnapshot = async (candidateRuntimeConfig, nextSourceConfig, afterWrite, transactionEpoch = configWriteEpoch, persistedHash, preflightCandidate, runtimeRefresh, authoredConfig) => {
		const preparedCandidate = opts.prepareConfigCandidate?.({
			runtimeConfig: candidateRuntimeConfig,
			sourceConfig: nextSourceConfig,
			previousSourceConfig: currentRuntimeEnvSourceConfig
		}) ?? preflightCandidate;
		const nextConfig = preparedCandidate?.runtimeConfig ?? candidateRuntimeConfig;
		const nextCompareConfig = preparedCandidate?.compareConfig ?? nextSourceConfig;
		const nextConfigRevisionHash = hashRuntimeConfigValue(nextSourceConfig);
		let nextPluginInstallRecords = currentPluginInstallRecords;
		let committedRuntimeConfig = null;
		let publishedRuntimeEnv;
		let runtimeEnvCommitted = false;
		const nextSettings = resolveSettings(nextConfig);
		const isCurrent = () => configWriteEpoch === transactionEpoch;
		const assertCurrent = () => {
			if (!isCurrent()) throw new GatewayConfigReloadSupersededError();
		};
		const commitPublishedRuntimeEnv = () => {
			runtimeEnvCommitted = true;
			publishedRuntimeEnv?.commit();
			publishedRuntimeEnv = void 0;
		};
		const ownership = {
			isCurrent,
			reapplyRuntimeOverlays: preparedCandidate?.reapplyRuntimeOverlays ?? ((config) => config),
			...preparedCandidate?.runtimeEnv ? { runtimeEnv: preparedCandidate.runtimeEnv } : {},
			...runtimeRefresh ? { runtimeRefresh } : {},
			publishRuntimeEnv: () => {
				assertCurrent();
				if (runtimeEnvCommitted) return;
				publishedRuntimeEnv ??= preparedCandidate?.runtimeEnv?.publish();
				assertCurrent();
			},
			rollbackRuntimeEnv: () => {
				if (runtimeEnvCommitted) return;
				publishedRuntimeEnv?.();
				publishedRuntimeEnv = void 0;
			},
			commitRuntimeEnv: commitPublishedRuntimeEnv,
			markRuntimeCommitted: (runtimeConfig, plan) => {
				commitPublishedRuntimeEnv();
				committedRuntimeConfig = runtimeConfig;
				currentConfig = runtimeConfig;
				currentCompareConfig = nextCompareConfig;
				currentSourceConfig = nextSourceConfig;
				currentRuntimeEnvSourceConfig = nextSourceConfig;
				currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
				currentRuntimeRefresh = ownership.runtimeRefresh;
				currentPluginInstallRecords = nextPluginInstallRecords;
				settings = resolveSettings(runtimeConfig);
				appliedRevision.defer(plan, nextConfigRevisionHash);
			}
		};
		const configChangedPaths = diffGatewayReloadPaths(currentCompareConfig, nextCompareConfig);
		const configPluginInstallTimestampNoopPaths = listPluginInstallTimestampMetadataPaths(currentCompareConfig, nextCompareConfig);
		const configPluginInstallWholeRecordPaths = listPluginInstallWholeRecordPaths(currentCompareConfig, nextCompareConfig);
		try {
			nextPluginInstallRecords = await readPluginInstallRecords();
		} catch (err) {
			opts.log.warn(`config reload plugin install record check failed: ${String(err)}`);
		}
		assertCurrent();
		const previousPluginInstallConfig = asPluginInstallConfig(currentPluginInstallRecords);
		const nextPluginInstallConfig = asPluginInstallConfig(nextPluginInstallRecords);
		const pluginInstallRecordChangedPaths = diffConfigPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const pluginInstallRecordTimestampNoopPaths = listPluginInstallTimestampMetadataPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const pluginInstallRecordWholeRecordPaths = listPluginInstallWholeRecordPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const changedPaths = [...configChangedPaths, ...pluginInstallRecordChangedPaths];
		const pluginInstallTimestampNoopPaths = [...configPluginInstallTimestampNoopPaths, ...pluginInstallRecordTimestampNoopPaths];
		const pluginInstallWholeRecordPaths = [...configPluginInstallWholeRecordPaths, ...pluginInstallRecordWholeRecordPaths];
		await appliedRevision.flush(currentConfig);
		assertCurrent();
		const commitReloadBaseline = async (options = {}) => {
			assertCurrent();
			await appliedRevision.flush(currentConfig);
			assertCurrent();
			const notifyCommitted = () => {
				if (changedPaths.length > 0) opts.onConfigCandidateCommitted?.({
					path: opts.watchPath,
					persistedHash: persistedHash ?? null,
					changedPaths
				});
			};
			let rollbackAcceptedSource;
			try {
				const acceptedSourceRollback = await opts.onConfigAccepted?.(committedRuntimeConfig ?? nextConfig, ownership, nextSourceConfig, {
					runtimeApplied: options.runtimeApplied !== false,
					...options.publishSource ? { publishSource: options.publishSource } : {}
				});
				if (typeof acceptedSourceRollback === "function") rollbackAcceptedSource = acceptedSourceRollback;
				assertCurrent();
				rollbackAcceptedSource ??= await options.publishSource?.();
				assertCurrent();
				currentSourceConfig = nextSourceConfig;
				if (typeof persistedHash === "string") if (authoredConfig !== void 0) updateAcceptedSnapshot(persistedHash, authoredConfig);
				else currentRawHash = persistedHash;
				if (options.runtimeApplied === false) {
					lastSourceOnlyWriteHash = persistedHash ?? null;
					lastSourceOnlyReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
					lastSourceOnlyRuntimeRefresh = ownership.runtimeRefresh;
					lastSourceOnlyRuntimeConfig = nextConfig;
					lastSourceOnlySourceConfig = nextSourceConfig;
					notifyCommitted();
					return;
				}
				ownership.publishRuntimeEnv();
				currentRuntimeEnvSourceConfig = nextSourceConfig;
				if (persistedHash === lastSourceOnlyWriteHash) {
					lastSourceOnlyWriteHash = null;
					lastSourceOnlyReapplyRuntimeOverlays = null;
					lastSourceOnlyRuntimeRefresh = void 0;
					lastSourceOnlyRuntimeConfig = null;
					lastSourceOnlySourceConfig = null;
				}
				currentConfig = committedRuntimeConfig ?? nextConfig;
				currentCompareConfig = nextCompareConfig;
				currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
				currentRuntimeRefresh = ownership.runtimeRefresh;
				currentPluginInstallRecords = nextPluginInstallRecords;
				settings = committedRuntimeConfig ? resolveSettings(committedRuntimeConfig) : nextSettings;
				commitPublishedRuntimeEnv();
			} catch (error) {
				ownership.rollbackRuntimeEnv();
				await rollbackAcceptedSource?.();
				throw error;
			}
			notifyCommitted();
		};
		if (changedPaths.length === 0) {
			let publishedSource;
			let publishedSourceRollback;
			let publishedSourceRolledBack = false;
			const publishSource = opts.onEffectiveConfigUnchanged ? async () => {
				publishedSource ??= await opts.onEffectiveConfigUnchanged(nextConfig, ownership, nextSourceConfig);
				publishedSourceRollback ??= async () => {
					publishedSourceRolledBack = true;
					await publishedSource?.rollback();
				};
				return publishedSourceRollback;
			} : void 0;
			await commitReloadBaseline(publishSource ? { publishSource } : {});
			if (!publishedSourceRolledBack) publishedSource?.commit?.();
			opts.onConfigRevisionApplied?.(nextConfigRevisionHash);
			return;
		}
		const skillsChangedPath = firstSkillsChangedPath(changedPaths);
		if (skillsChangedPath !== void 0) {
			bumpSkillsSnapshotVersion({
				reason: "config-change",
				changedPath: skillsChangedPath
			});
			opts.log.info(`skills snapshot invalidated by config change (${skillsChangedPath})`);
		}
		const followUp = resolveConfigWriteFollowUp(afterWrite);
		opts.log.info(`config change detected; evaluating reload (${changedPaths.join(", ")})`);
		if (followUp.mode === "none") {
			opts.log.info(`config reload skipped by writer intent (${followUp.reason})`);
			await commitReloadBaseline({ runtimeApplied: false });
			return;
		}
		const plan = buildGatewayReloadPlan(changedPaths, {
			noopPaths: pluginInstallTimestampNoopPaths,
			forceChangedPaths: pluginInstallWholeRecordPaths,
			candidateConfig: nextConfig
		});
		if (nextSettings.mode === "off") {
			opts.log.info("config reload disabled (gateway.reload.mode=off)");
			await commitReloadBaseline({ runtimeApplied: false });
			return;
		}
		if (isNoopGatewayReloadPlan(plan) && !followUp.requiresRestart) {
			await opts.onConfigChange?.(plan, nextConfig);
			await opts.onNoopConfigCommit(plan, nextConfig, ownership, nextSourceConfig);
			assertCurrent();
			await appliedRevision.apply(plan, nextConfig, nextConfigRevisionHash);
			await commitReloadBaseline();
			return;
		}
		if (followUp.requiresRestart) {
			const restartPlan = {
				...plan,
				restartGateway: true,
				restartReasons: [...plan.restartReasons, followUp.reason]
			};
			await opts.onConfigChange?.(restartPlan, nextConfig);
			await prepareRestart(restartPlan, nextConfig, ownership, nextSourceConfig);
			await commitReloadBaseline();
			return;
		}
		if (plan.restartGateway) {
			await opts.onConfigChange?.(plan, nextConfig);
			await prepareRestart(plan, nextConfig, ownership, nextSourceConfig);
			await commitReloadBaseline();
			return;
		}
		await opts.onConfigChange?.(plan, nextConfig);
		try {
			await opts.onHotReload(plan, nextConfig, ownership, nextSourceConfig);
		} catch (error) {
			ownership.rollbackRuntimeEnv();
			throw error;
		}
		assertCurrent();
		await appliedRevision.apply(plan, nextConfig, nextConfigRevisionHash);
		await commitReloadBaseline();
	};
	const promoteAcceptedSnapshot = async (snapshot, reason) => {
		if (!opts.promoteSnapshot || !snapshot.exists || !snapshot.valid) return;
		try {
			await opts.promoteSnapshot(snapshot, reason);
		} catch (err) {
			opts.log.warn(`config reload last-known-good promotion failed: ${String(err)}`);
		}
	};
	const runAcceptedTransaction = async (run) => {
		if (opts.runTransaction) {
			await opts.runTransaction(run);
			return;
		}
		await run();
	};
	const acceptCurrentRuntimeEcho = async (transactionEpoch, snapshot) => {
		const ownership = {
			isCurrent: () => configWriteEpoch === transactionEpoch,
			reapplyRuntimeOverlays: currentReapplyRuntimeOverlays,
			publishRuntimeEnv: () => {},
			rollbackRuntimeEnv: () => {},
			commitRuntimeEnv: () => {},
			...currentRuntimeRefresh ? { runtimeRefresh: currentRuntimeRefresh } : {},
			markRuntimeCommitted: () => {}
		};
		await runAcceptedTransaction(async () => {
			await appliedRevision.flush(currentConfig);
			if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			await opts.onConfigAccepted?.(currentConfig, ownership, currentSourceConfig, { runtimeApplied: true });
			if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			if (snapshot?.valid && typeof snapshot.hash === "string") updateAcceptedSnapshot(snapshot.hash, snapshot.parsed);
		});
		if (snapshot?.valid) await acceptWatchedPaths(snapshot.includedPaths ?? []);
	};
	const promoteAcceptedInProcessWrite = async (persistedHash) => {
		try {
			const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
			if (snapshot.hash !== persistedHash || !snapshot.valid) return;
			updateAcceptedSnapshot(snapshot.hash, snapshot.parsed);
			await acceptWatchedPaths(snapshot.includedPaths ?? []);
			await promoteAcceptedSnapshot(snapshot, "in-process-write");
		} catch (err) {
			opts.log.warn(`config reload in-process last-known-good promotion failed: ${String(err)}`);
		}
	};
	const runReload = async () => {
		if (stopped) return;
		if (running) {
			pending = true;
			return;
		}
		running = true;
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		try {
			if (pendingInProcessConfig) {
				const pendingWrite = pendingInProcessConfig;
				pendingInProcessConfig = null;
				activeInProcessConfig = pendingWrite;
				missingConfigRetries = 0;
				try {
					await runAcceptedTransaction(async () => {
						await applySnapshot(pendingWrite.config, pendingWrite.compareConfig, pendingWrite.afterWrite, pendingWrite.epoch, pendingWrite.persistedHash, pendingWrite.preparedCandidate, pendingWrite.runtimeRefresh);
						if (activeInProcessConfig === pendingWrite) activeInProcessConfig = null;
						await promoteAcceptedInProcessWrite(pendingWrite.persistedHash);
					});
				} catch (err) {
					if (lastAppliedWriteHash === pendingWrite.persistedHash) lastAppliedWriteHash = null;
					if (configWriteEpoch === pendingWrite.epoch && !pendingInProcessConfig && !watcherIntentCandidate) {
						watcherIntentCandidate = pendingWrite;
						watcherIntentCameFromPendingWrite = false;
					}
					throw err;
				} finally {
					if (activeInProcessConfig === pendingWrite) activeInProcessConfig = null;
				}
				return;
			}
			const transactionEpoch = configWriteEpoch;
			const intentCandidate = watcherIntentCandidate;
			const intentCandidateCameFromPendingWrite = watcherIntentCameFromPendingWrite;
			const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
			if (configWriteEpoch !== transactionEpoch) throw new GatewayConfigReloadSupersededError();
			if (handleMissingSnapshot(snapshot)) {
				await appliedRevision.flush(currentConfig);
				return;
			}
			await observeCandidateWatchedPaths(snapshot.includedPaths ?? []);
			const observedRawHash = snapshot.hash ?? null;
			const previousObservedRawHash = lastObservedRawHash;
			const newObservedRawHash = observedRawHash !== previousObservedRawHash;
			lastObservedRawHash = observedRawHash;
			if (startupInternalWriteHash && typeof snapshot.hash === "string") {
				const matchesStartupWrite = snapshot.valid && snapshot.hash === startupInternalWriteHash && diffConfigPaths(currentSourceConfig, snapshot.sourceConfig).length === 0;
				startupInternalWriteHash = null;
				if (matchesStartupWrite) {
					await acceptCurrentRuntimeEcho(transactionEpoch, snapshot);
					return;
				}
			}
			if (intentCandidate && snapshot.valid && snapshot.hash === intentCandidate.persistedHash && diffConfigPaths(intentCandidate.compareConfig, snapshot.sourceConfig).length === 0) {
				lastAppliedWriteHash = intentCandidate.persistedHash;
				try {
					await runAcceptedTransaction(async () => {
						await applySnapshot(intentCandidate.config, intentCandidate.compareConfig, intentCandidate.afterWrite, transactionEpoch, intentCandidate.persistedHash, intentCandidate.preparedCandidate, intentCandidate.runtimeRefresh, snapshot.parsed);
						if (watcherIntentCandidate === intentCandidate) {
							watcherIntentCandidate = null;
							watcherIntentCameFromPendingWrite = false;
						}
						await promoteAcceptedSnapshot(snapshot, "in-process-write");
					});
				} catch (err) {
					if (lastAppliedWriteHash === intentCandidate.persistedHash) lastAppliedWriteHash = null;
					if (configWriteEpoch === transactionEpoch && !watcherIntentCandidate) {
						watcherIntentCandidate = intentCandidate;
						watcherIntentCameFromPendingWrite = intentCandidateCameFromPendingWrite;
					}
					throw err;
				}
				await acceptWatchedPaths(snapshot.includedPaths ?? []);
				return;
			}
			if (watcherIntentCandidate === intentCandidate) {
				watcherIntentCandidate = null;
				watcherIntentCameFromPendingWrite = false;
			}
			if (intentCandidate && lastAppliedWriteHash === intentCandidate.persistedHash) lastAppliedWriteHash = null;
			if (lastAppliedWriteHash && typeof snapshot.hash === "string") {
				if (snapshot.valid && snapshot.hash === lastAppliedWriteHash && diffConfigPaths(currentSourceConfig, snapshot.sourceConfig).length === 0) {
					if (snapshot.hash === lastSourceOnlyWriteHash) {
						const ownership = {
							isCurrent: () => configWriteEpoch === transactionEpoch,
							reapplyRuntimeOverlays: lastSourceOnlyReapplyRuntimeOverlays ?? currentReapplyRuntimeOverlays,
							publishRuntimeEnv: () => {},
							rollbackRuntimeEnv: () => {},
							commitRuntimeEnv: () => {},
							...lastSourceOnlyRuntimeRefresh ? { runtimeRefresh: lastSourceOnlyRuntimeRefresh } : {},
							markRuntimeCommitted: () => {}
						};
						await runAcceptedTransaction(async () => {
							await appliedRevision.flush(currentConfig);
							if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
							await opts.onConfigAccepted?.(lastSourceOnlyRuntimeConfig ?? currentConfig, ownership, lastSourceOnlySourceConfig ?? currentSourceConfig, { runtimeApplied: false });
							if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
							if (typeof snapshot.hash === "string") updateAcceptedSnapshot(snapshot.hash, snapshot.parsed);
						});
						await acceptWatchedPaths(snapshot.includedPaths ?? []);
						return;
					}
					await acceptCurrentRuntimeEcho(transactionEpoch, snapshot);
					return;
				}
				lastAppliedWriteHash = null;
			}
			if (!snapshot.valid) {
				if (newObservedRawHash) appendExternalAudit({
					detectedBy: "watch",
					previousHash: previousObservedRawHash,
					nextHash: observedRawHash,
					valid: false,
					issues: capConfigAuditIssues(formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true }))
				});
				handleInvalidSnapshot(snapshot);
				await appliedRevision.flush(currentConfig);
				return;
			}
			const nextRawHash = snapshot.hash ?? null;
			const externalChangedPaths = diffConfigPaths(currentSourceConfig, snapshot.sourceConfig);
			const fingerprintedAuthoredChangedPaths = diffConfigPaths(currentFingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(snapshot.parsed, {
				env: process.env,
				homedir
			}));
			const journalChangedPaths = [.../* @__PURE__ */ new Set([...externalChangedPaths, ...fingerprintedAuthoredChangedPaths])];
			const matchingWriterSlot = readConfigSnapshotAuditRecord({ configPath: opts.watchPath });
			if (newObservedRawHash && (nextRawHash === currentRawHash || matchingWriterSlot?.rawHash !== nextRawHash)) appendExternalAudit({
				detectedBy: "watch",
				previousHash: previousObservedRawHash,
				nextHash: nextRawHash,
				valid: true,
				...journalChangedPaths.length > 0 ? { changedPaths: capConfigAuditPaths(journalChangedPaths) } : {},
				...journalChangedPaths.length === 0 ? { opaqueChange: true } : {}
			});
			await runAcceptedTransaction(async () => {
				await applySnapshot(snapshot.config, snapshot.sourceConfig, void 0, transactionEpoch, snapshot.hash, void 0, void 0, snapshot.parsed);
				await promoteAcceptedSnapshot(snapshot, "valid-config");
			});
			await acceptWatchedPaths(snapshot.includedPaths ?? []);
		} catch (err) {
			if (isGatewayConfigReloadSupersededError(err)) opts.log.info(`config reload superseded: ${String(err)}`);
			else opts.log.error(`config reload failed: ${String(err)}`);
		} finally {
			running = false;
			if (pending) {
				pending = false;
				schedule();
			}
		}
	};
	function startTrackedReload() {
		const reload = runReload();
		activeReloads.add(reload);
		reload.then(() => activeReloads.delete(reload), () => activeReloads.delete(reload));
	}
	const scheduleExternalRefresh = () => {
		opts.onConfigCandidateObserved?.();
		configWriteEpoch += 1;
		const pendingCandidate = pendingInProcessConfig;
		const activeCandidate = activeInProcessConfig;
		const newestLiveCandidate = pendingCandidate && (!activeCandidate || pendingCandidate.epoch > activeCandidate.epoch) ? pendingCandidate : activeCandidate;
		if (newestLiveCandidate && (!watcherIntentCandidate || newestLiveCandidate.epoch > watcherIntentCandidate.epoch)) {
			watcherIntentCandidate = newestLiveCandidate;
			watcherIntentCameFromPendingWrite = newestLiveCandidate === pendingCandidate;
		}
		if (pendingInProcessConfig) pendingInProcessConfig = null;
		schedule();
	};
	const unsubscribeFromWrites = opts.subscribeToWrites?.((event) => {
		if (event.configPath !== opts.watchPath) return;
		startupInternalWriteHash = null;
		opts.onConfigCandidateObserved?.();
		configWriteEpoch += 1;
		const pendingRestartIntent = pendingInProcessConfig?.afterWrite?.mode === "restart" ? pendingInProcessConfig.afterWrite : watcherIntentCameFromPendingWrite && watcherIntentCandidate?.afterWrite?.mode === "restart" ? watcherIntentCandidate.afterWrite : void 0;
		watcherIntentCandidate = null;
		watcherIntentCameFromPendingWrite = false;
		const afterWrite = pendingRestartIntent && event.afterWrite?.mode !== "restart" ? pendingRestartIntent : event.afterWrite;
		pendingInProcessConfig = {
			config: event.runtimeConfig,
			compareConfig: event.sourceConfig,
			persistedHash: event.persistedHash,
			afterWrite,
			...event.preparedCandidate ? { preparedCandidate: event.preparedCandidate } : {},
			...event.runtimeRefresh ? { runtimeRefresh: event.runtimeRefresh } : {},
			epoch: configWriteEpoch
		};
		lastAppliedWriteHash = event.persistedHash;
		scheduleAfter(0);
	}) ?? (() => {});
	let watcher = null;
	const acceptedIncludedPaths = new Set(opts.initialIncludedPaths ?? []);
	let candidateIncludedPaths = /* @__PURE__ */ new Set();
	const watchedPaths = /* @__PURE__ */ new Set([opts.watchPath, ...acceptedIncludedPaths]);
	let watcherRecreateRetries = 0;
	let watcherRecreateTimer = null;
	let hotReloadStatus = "active";
	let degradedToPolling = false;
	let watcherUsesPolling = false;
	const createWatcher = (reconcileAfterReady = false) => {
		if (stopped) return;
		const usePolling = resolveChokidarUsePolling(degradedToPolling);
		const next = chokidar.watch([...watchedPaths], {
			depth: 0,
			ignoreInitial: true,
			awaitWriteFinish: {
				stabilityThreshold: 200,
				pollInterval: 50
			},
			usePolling
		});
		const scheduleFromWatcherEvent = (eventPath) => {
			if (!watchedPaths.has(path.normalize(eventPath))) return;
			watcherRecreateRetries = 0;
			scheduleExternalRefresh();
		};
		next.on("add", scheduleFromWatcherEvent);
		next.on("change", scheduleFromWatcherEvent);
		next.on("unlink", scheduleFromWatcherEvent);
		next.on("error", (err) => {
			handleWatcherError(next, err);
		});
		next.on("ready", () => {
			opts.onWatcherReady?.();
			if (reconcileAfterReady) {
				if (!stopped && watcher === next) scheduleExternalRefresh();
			}
		});
		watcher = next;
		watcherUsesPolling = next.options.usePolling;
		hotReloadStatus = "active";
	};
	const handleWatcherError = (source, err) => {
		if (stopped || source !== watcher) return;
		const failedWatcherUsedPolling = watcherUsesPolling;
		watcher = null;
		watcherUsesPolling = false;
		source?.close().catch(() => {});
		if (watcherRecreateRetries >= WATCHER_RECREATE_MAX_RETRIES) {
			if (!failedWatcherUsedPolling && resolveChokidarUsePolling(true)) {
				degradedToPolling = true;
				watcherRecreateRetries = 0;
				opts.log.warn(`config watcher native retries exhausted; degrading to polling mode: ${String(err)}`);
				watcherRecreateTimer = setTimeout(() => {
					watcherRecreateTimer = null;
					createWatcher(true);
				}, WATCHER_RECREATE_BACKOFF_MS[0] ?? 500);
				return;
			}
			const mode = failedWatcherUsedPolling ? "polling mode" : "native mode";
			hotReloadStatus = "disabled";
			opts.log.error(`config hot-reload disabled: watcher failed after ${WATCHER_RECREATE_MAX_RETRIES} re-create attempts in ${mode}: ${String(err)}`);
			return;
		}
		const backoff = WATCHER_RECREATE_BACKOFF_MS[watcherRecreateRetries] ?? WATCHER_RECREATE_BACKOFF_MS[WATCHER_RECREATE_BACKOFF_MS.length - 1] ?? 0;
		watcherRecreateRetries += 1;
		opts.log.warn(`config watcher error; re-creating watcher (attempt ${watcherRecreateRetries}/${WATCHER_RECREATE_MAX_RETRIES} in ${backoff}ms): ${String(err)}`);
		watcherRecreateTimer = setTimeout(() => {
			watcherRecreateTimer = null;
			createWatcher(true);
		}, backoff);
	};
	const reconcileWatchedPaths = async (includedPaths) => {
		const nextPaths = /* @__PURE__ */ new Set([opts.watchPath, ...includedPaths]);
		const additions = [...nextPaths].filter((candidate) => !watchedPaths.has(candidate));
		const removals = [...watchedPaths].filter((candidate) => !nextPaths.has(candidate));
		if (additions.length === 0 && removals.length === 0) return;
		watchedPaths.clear();
		for (const candidate of nextPaths) watchedPaths.add(candidate);
		const activeWatcher = watcher;
		if (!activeWatcher) return;
		try {
			await activeWatcher.close();
		} catch (err) {
			handleWatcherError(activeWatcher, err);
			return;
		}
		if (stopped || watcher !== activeWatcher) return;
		watcher = null;
		watcherUsesPolling = false;
		createWatcher(true);
	};
	const observeCandidateWatchedPaths = async (includedPaths) => {
		candidateIncludedPaths = new Set(includedPaths);
		await reconcileWatchedPaths([...acceptedIncludedPaths, ...candidateIncludedPaths]);
	};
	const acceptWatchedPaths = async (includedPaths) => {
		acceptedIncludedPaths.clear();
		for (const candidate of includedPaths) acceptedIncludedPaths.add(candidate);
		candidateIncludedPaths.clear();
		await reconcileWatchedPaths([...acceptedIncludedPaths]);
	};
	createWatcher();
	return {
		notifyPluginMetadataChanged: () => {
			clearLoadInstalledPluginIndexInstallRecordsCache();
			clearPluginMetadataLifecycleCaches();
			startupInternalWriteHash = null;
			lastAppliedWriteHash = null;
			scheduleExternalRefresh();
		},
		stop: async () => {
			stopped = true;
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = null;
			if (watcherRecreateTimer) {
				clearTimeout(watcherRecreateTimer);
				watcherRecreateTimer = null;
			}
			unsubscribeFromWrites();
			const active = watcher;
			watcher = null;
			await active?.close().catch(() => {});
			await Promise.all(activeReloads);
		},
		hotReloadStatus: () => hotReloadStatus
	};
}
//#endregion
//#region src/gateway/server-reload-managed-secrets.ts
function isRuntimeSecretsPreparationCurrent(preparation) {
	return getActiveSecretsRuntimeSnapshotRevisionState() === preparation.expectedRevision;
}
async function activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, options) {
	const runtime = await import("./runtime-Cf16aD5W.js");
	if (options?.canActivate && !options.canActivate()) return false;
	if (!runtime.activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, { runtimeSourceConfig: options?.runtimeSourceConfig })) return false;
	options?.onActivated?.();
	return true;
}
async function restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot, options) {
	if (!(await import("./runtime-Cf16aD5W.js")).restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot, { runtimeSourceConfig: options?.runtimeSourceConfig })) return false;
	options?.onActivated?.();
	return true;
}
function createManagedReloadSecretHandlers(options) {
	const { params, prepareRuntimeCandidate, tryPrepareRuntimeSecrets, applyHotReload } = options;
	const onEffectiveConfigUnchanged = async (nextConfig, transactionOwnership, sourceConfig) => {
		for (;;) {
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			const previousRuntimeSourceConfig = getRuntimeConfigSourceSnapshot();
			const previousSecretsSnapshot = getActiveSecretsRuntimeSnapshotState();
			const previousSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const previousRuntimeMetadata = getRuntimeConfigSnapshotMetadata();
			const nextSecretsSourceConfig = prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership);
			if (previousRuntimeMetadata && previousRuntimeSourceConfig && previousSecretsSnapshot && hasSameSecretReloadContract(previousSecretsSnapshot.sourceConfig, nextSecretsSourceConfig)) {
				const sourceOnlySnapshot = {
					...previousSecretsSnapshot,
					sourceConfig: nextSecretsSourceConfig
				};
				if (!isDeepStrictEqual(sourceOnlySnapshot.config, nextConfig)) throw new GatewayConfigReloadSupersededError$1();
				if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
				if (!setSecretsRuntimeSourceSnapshotIfCurrent({
					expectedSecretsRevision: previousSecretsRevision,
					expectedRuntimeConfigRevision: previousRuntimeMetadata.revision,
					runtimeSourceConfig: sourceConfig,
					secretsSourceConfig: nextSecretsSourceConfig
				})) continue;
				const committedSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
				const rollbackPublishedSource = async () => {
					if (!restoreSecretsRuntimeSourceSnapshotIfLineageCurrent({
						expectedLineageRevision: committedSecretsRevision,
						runtimeSourceConfig: previousRuntimeSourceConfig,
						secretsSourceConfig: previousSecretsSnapshot.sourceConfig
					})) throw new GatewayConfigReloadSupersededError$1();
				};
				if (!transactionOwnership.isCurrent()) {
					await rollbackPublishedSource();
					throw new GatewayConfigReloadSupersededError$1();
				}
				return {
					rollback: rollbackPublishedSource,
					commit: () => publishRuntimeSecretsStateTransition(params.activateRuntimeSecrets, sourceOnlySnapshot, {
						sourceOnly: true,
						expectedRevision: committedSecretsRevision
					})
				};
			}
			const preparation = await tryPrepareRuntimeSecrets(nextSecretsSourceConfig, transactionOwnership, {
				reason: "reload",
				publishFailureAsDegraded: true,
				...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {},
				includeAuthStoreRefs: true
			});
			if (!previousRuntimeMetadata || !transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			if (getRuntimeConfigSnapshotMetadata()?.revision !== previousRuntimeMetadata.revision) {
				if (hasActiveSecretsRuntimeSnapshotLineage(previousSecretsRevision)) continue;
				throw new GatewayConfigReloadSupersededError$1();
			}
			if (!preparation || preparation.expectedRevision !== previousSecretsRevision || !isRuntimeSecretsPreparationCurrent(preparation)) continue;
			const preparedSecrets = preparation.snapshot;
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			if (!isDeepStrictEqual(preparedSecrets.config, nextConfig)) throw new GatewayConfigReloadSupersededError$1();
			if (!previousRuntimeSourceConfig || !previousSecretsSnapshot) throw new GatewayConfigReloadSupersededError$1();
			const activateIfCurrent = params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent;
			const activated = activateIfCurrent ? await activateIfCurrent(preparedSecrets, previousSecretsRevision, {
				reason: "reload",
				activate: true,
				deferStatePublication: true,
				runtimeSourceConfig: sourceConfig
			}, void 0, transactionOwnership.isCurrent) : await activateSecretsRuntimeSnapshotIfCurrent(preparedSecrets, previousSecretsRevision, {
				canActivate: transactionOwnership.isCurrent,
				runtimeSourceConfig: sourceConfig
			}) ? preparedSecrets : null;
			if (!activated) continue;
			const committedSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const rollbackPublishedSource = async () => {
				if (!await restoreSecretsRuntimeSnapshotIfCurrent(previousSecretsSnapshot, committedSecretsRevision, activated, { runtimeSourceConfig: previousRuntimeSourceConfig })) throw new GatewayConfigReloadSupersededError$1();
			};
			if (!transactionOwnership.isCurrent()) {
				await rollbackPublishedSource();
				throw new GatewayConfigReloadSupersededError$1();
			}
			return {
				rollback: rollbackPublishedSource,
				commit: () => publishRuntimeSecretsStateTransition(params.activateRuntimeSecrets, activated)
			};
		}
	};
	const onNoopConfigCommit = async (plan, nextConfig, transactionOwnership, sourceConfig) => {
		for (;;) {
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			const preparation = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
				reason: "reload",
				publishFailureAsDegraded: true,
				...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {},
				includeAuthStoreRefs: transactionOwnership.runtimeRefresh?.includeAuthStoreRefs
			});
			if (!preparation || !isRuntimeSecretsPreparationCurrent(preparation)) continue;
			const { expectedRevision: previousSnapshotRevision, snapshot: prepared } = preparation;
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			const activateIfCurrent = params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent;
			const publishTerminalConfig = () => {
				transactionOwnership.publishRuntimeEnv();
				transactionOwnership.markRuntimeCommitted(prepared.config, plan);
				params.reconcileTerminalSessions(plan, prepared.config);
			};
			if (activateIfCurrent ? await activateIfCurrent(prepared, previousSnapshotRevision, {
				reason: "reload",
				activate: true
			}, publishTerminalConfig, transactionOwnership.isCurrent) : await activateSecretsRuntimeSnapshotIfCurrent(prepared, previousSnapshotRevision, {
				canActivate: transactionOwnership.isCurrent,
				onActivated: publishTerminalConfig
			}) ? prepared : null) return;
		}
	};
	const onHotReload = async (plan, nextConfig, transactionOwnership, sourceConfig) => {
		for (;;) {
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			const previousSnapshot = getActiveSecretsRuntimeSnapshotState();
			const previousSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const previousGenerationOwnership = captureSharedGatewaySessionGenerationOwnership(params.sharedGatewaySessionGenerationState);
			const previousSharedGatewaySessionGeneration = previousGenerationOwnership.generation;
			const preparation = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
				reason: "reload",
				publishFailureAsDegraded: true,
				...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {},
				includeAuthStoreRefs: transactionOwnership.runtimeRefresh?.includeAuthStoreRefs
			});
			if (!preparation || preparation.expectedRevision !== previousSnapshotRevision || !isRuntimeSecretsPreparationCurrent(preparation)) continue;
			const prepared = preparation.snapshot;
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== previousSnapshotRevision) continue;
			const nextSharedGatewaySessionGeneration = params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
			const sharedGatewaySessionGenerationChanged = previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration;
			let runtimeSecretsPublished = false;
			let runtimeCommitted = false;
			let publishedSnapshotRevision = null;
			let publishedSharedGatewaySessionGeneration = null;
			let terminalConfigReconciled = false;
			try {
				await applyHotReload(plan, prepared.config, {
					isCurrent: transactionOwnership.isCurrent,
					...transactionOwnership.runtimeEnv ? { runtimeEnv: transactionOwnership.runtimeEnv.env } : {},
					sourceConfig,
					prepareRestartRuntimeConfig: async () => {
						for (;;) {
							const restartPrepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(prepared.config, sourceConfig, transactionOwnership), transactionOwnership, {
								reason: "restart-check",
								publishFailureAsDegraded: true,
								...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {}
							});
							if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
							if (restartPrepared && isRuntimeSecretsPreparationCurrent(restartPrepared)) return restartPrepared.snapshot.config;
						}
					},
					publish: async (commit, isCommitted) => {
						const claimGenerationOwnership = () => {
							publishedSharedGatewaySessionGeneration ??= claimSharedGatewaySessionGenerationIfOwned(params.sharedGatewaySessionGenerationState, previousGenerationOwnership, nextSharedGatewaySessionGeneration);
							if (!publishedSharedGatewaySessionGeneration) throw new GatewayHotReloadStaleSecretsError();
						};
						const publishRuntime = async () => {
							runtimeSecretsPublished = true;
							publishedSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
							claimGenerationOwnership();
							try {
								transactionOwnership.publishRuntimeEnv();
								await commit();
								if (!terminalConfigReconciled) {
									params.reconcileTerminalSessions(plan, prepared.config);
									terminalConfigReconciled = true;
								}
								if (sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
									clients: params.clients,
									expectedGeneration: nextSharedGatewaySessionGeneration
								});
							} catch (err) {
								if (!isCommitted()) {
									let generationRestored = false;
									let snapshotRestored = false;
									const generationOwnership = publishedSharedGatewaySessionGeneration;
									if (previousSnapshot && generationOwnership) snapshotRestored = await restoreSecretsRuntimeSnapshotIfCurrent(previousSnapshot, publishedSnapshotRevision ?? -1, prepared, { onActivated: () => {
										generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, generationOwnership, previousSharedGatewaySessionGeneration);
									} });
									else if (publishedSnapshotRevision !== null && getActiveSecretsRuntimeSnapshotRevisionState() === publishedSnapshotRevision) {
										clearSecretsRuntimeSnapshotState();
										snapshotRestored = true;
										if (generationOwnership) generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, generationOwnership, previousSharedGatewaySessionGeneration);
									}
									if (snapshotRestored) {
										if (previousSnapshot && shouldRefreshContextWindowCache(plan)) await refreshContextWindowCache(previousSnapshot.config);
										runtimeSecretsPublished = false;
									}
									if (generationRestored && sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
										clients: params.clients,
										expectedGeneration: previousSharedGatewaySessionGeneration
									});
								}
								throw err;
							} finally {
								if (isCommitted()) {
									runtimeCommitted = true;
									transactionOwnership.markRuntimeCommitted(prepared.config, plan);
								}
							}
						};
						const activateIfCurrent = params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent;
						if (activateIfCurrent) {
							if (!await activateIfCurrent(prepared, previousSnapshotRevision, {
								reason: "reload",
								activate: true
							}, publishRuntime, () => transactionOwnership.isCurrent() && isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, previousGenerationOwnership))) throw new GatewayHotReloadStaleSecretsError();
						} else {
							if (!await activateSecretsRuntimeSnapshotIfCurrent(prepared, previousSnapshotRevision, {
								canActivate: () => transactionOwnership.isCurrent() && isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, previousGenerationOwnership),
								onActivated: claimGenerationOwnership
							})) throw new GatewayHotReloadStaleSecretsError();
							await publishRuntime();
						}
					}
				});
			} catch (err) {
				if (err instanceof GatewayHotReloadStaleSecretsError) {
					if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
					continue;
				}
				if (err instanceof GatewayHotReloadRecoveryError) throw err;
				if (runtimeCommitted) throw err;
				if (runtimeSecretsPublished) {
					let generationRestored = false;
					let snapshotRestored = false;
					const generationOwnership = publishedSharedGatewaySessionGeneration;
					if (previousSnapshot && publishedSnapshotRevision !== null && generationOwnership) snapshotRestored = await restoreSecretsRuntimeSnapshotIfCurrent(previousSnapshot, publishedSnapshotRevision, prepared, { onActivated: () => {
						generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, generationOwnership, previousSharedGatewaySessionGeneration);
					} });
					else if (publishedSnapshotRevision !== null && generationOwnership && getActiveSecretsRuntimeSnapshotRevisionState() === publishedSnapshotRevision) {
						clearSecretsRuntimeSnapshotState();
						snapshotRestored = true;
						generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, generationOwnership, previousSharedGatewaySessionGeneration);
					}
					if (snapshotRestored) {
						if (previousSnapshot && shouldRefreshContextWindowCache(plan)) await refreshContextWindowCache(previousSnapshot.config);
					}
					if (generationRestored && sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
						clients: params.clients,
						expectedGeneration: previousSharedGatewaySessionGeneration
					});
				}
				throw err;
			}
			if (publishedSharedGatewaySessionGeneration) finalizeOwnedSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, publishedSharedGatewaySessionGeneration);
			return;
		}
	};
	return {
		onEffectiveConfigUnchanged,
		onHotReload,
		onNoopConfigCommit
	};
}
//#endregion
//#region src/gateway/server-reload-managed.ts
function startManagedGatewayConfigReloader(params) {
	if (params.minimalTestGateway) return {
		stop: async () => {},
		notifyPluginMetadataChanged: () => {}
	};
	const prepareRuntimeCandidate = (runtimeConfig, sourceConfig, ownership) => {
		const canonicalConfig = restoreCanonicalSecretRefs(runtimeConfig, sourceConfig);
		const candidateConfig = ownership?.reapplyRuntimeOverlays(canonicalConfig) ?? canonicalConfig;
		return params.applyRuntimeConfigOverrides?.(candidateConfig) ?? candidateConfig;
	};
	const applyRuntimeConfigOverrides = (config) => params.applyRuntimeConfigOverrides?.(config) ?? config;
	const restartRecoveryAvailable = params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
	let stopped = false;
	const tryPrepareRuntimeSecrets = async (config, transactionOwnership, activationParams) => {
		if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
		const expectedRevision = getActiveSecretsRuntimeSnapshotRevisionState();
		try {
			const snapshot = await params.activateRuntimeSecrets(config, {
				...activationParams,
				activate: false,
				canPublishFailureAsDegraded: () => transactionOwnership.isCurrent() && getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision
			});
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			return getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision ? {
				snapshot,
				expectedRevision
			} : null;
		} catch (error) {
			if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== expectedRevision) return null;
			throw error;
		}
	};
	let activeGmailRestartAbortController = null;
	const abortActiveGmailRestart = () => {
		activeGmailRestartAbortController?.abort();
		activeGmailRestartAbortController = null;
	};
	const createGmailRestartAbortController = () => {
		abortActiveGmailRestart();
		const abortController = new AbortController();
		if (stopped) {
			abortController.abort();
			return abortController;
		}
		activeGmailRestartAbortController = abortController;
		return abortController;
	};
	const { applyHotReload, acceptRestartConfig, beginGatewayRestartLifecycle, pauseGatewayRestartForConfigCandidate, publishAppliedConfigHash, publishAcceptedRestartTarget, publishDeferredAppliedConfigHash, recordAcceptedRestartTarget, requestGatewayRestart, restoreConservativeRestartDebt, stopRestartRetries } = createGatewayReloadHandlers({
		deps: params.deps,
		broadcast: params.broadcast,
		getState: params.getState,
		setState: params.setState,
		startChannel: params.startChannel,
		stopChannel: params.stopChannel,
		getChannelAutostartSuppression: params.getChannelAutostartSuppression,
		stopPostReadySidecars: params.stopPostReadySidecars,
		reloadPlugins: params.reloadPlugins,
		logHooks: params.logHooks,
		logChannels: params.logChannels,
		logCron: params.logCron,
		logReload: params.logReload,
		cronReconciliation: params.cronReconciliation,
		createGmailRestartAbortController,
		clearGmailRestartAbortController: (abortController) => {
			if (activeGmailRestartAbortController === abortController) activeGmailRestartAbortController = null;
		},
		...params.onCronRestart ? { onCronRestart: params.onCronRestart } : {},
		...params.requestRecoveryRestart ? { requestRecoveryRestart: params.requestRecoveryRestart } : {},
		assertRestartReady: () => import("./openclaw-database-preflight-BqzkECDS.js").then(({ assertOpenClawDatabasesReadyForRestart }) => assertOpenClawDatabasesReadyForRestart({ env: process.env })),
		restartRecoveryAvailable,
		createHealthMonitor: (config) => startGatewayChannelHealthMonitor({
			cfg: config,
			channelManager: params.channelManager
		})
	});
	const runManagedRestart = async (plan, nextConfig, transactionOwnership, sourceConfig, restartOptions, beforeRestartRequest) => {
		const isCurrent = () => !stopped && transactionOwnership.isCurrent();
		const assertCurrent = () => {
			if (!isCurrent()) throw new GatewayConfigReloadSupersededError$1();
		};
		assertCurrent();
		const restartLifecycle = beginGatewayRestartLifecycle();
		let preparation;
		try {
			for (;;) {
				assertCurrent();
				const ownership = captureSharedGatewaySessionGenerationOwnership(params.sharedGatewaySessionGenerationState);
				const previousRequired = params.sharedGatewaySessionGenerationState.required;
				const prepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
					reason: "restart-check",
					publishFailureAsDegraded: true,
					...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {}
				});
				assertCurrent();
				const generationChanged = !isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, ownership);
				if (!prepared || !isRuntimeSecretsPreparationCurrent(prepared) || generationChanged) continue;
				preparation = {
					ownership,
					previousRequired,
					previousCurrent: ownership.generation,
					nextGeneration: params.resolveSharedGatewaySessionGenerationForConfig(prepared.snapshot.config),
					runtimeConfig: prepared.snapshot.config
				};
				break;
			}
		} catch (error) {
			restartLifecycle.settle("rejected");
			throw error;
		}
		const { ownership: preparationOwnership, previousRequired: previousRequiredSharedGatewaySessionGeneration, previousCurrent: previousSharedGatewaySessionGeneration, nextGeneration: nextSharedGatewaySessionGeneration, runtimeConfig: preparedRuntimeConfig } = preparation;
		let restartTransaction;
		let requiredOwnership = null;
		try {
			assertCurrent();
			params.reconcileTerminalSessions(plan, preparedRuntimeConfig);
			assertCurrent();
			await beforeRestartRequest?.();
			assertCurrent();
			requiredOwnership = setRequiredSharedGatewaySessionGenerationIfOwned(params.sharedGatewaySessionGenerationState, preparationOwnership, previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration ? nextSharedGatewaySessionGeneration : null);
			if (!requiredOwnership) throw new GatewayHotReloadStaleSecretsError();
			transactionOwnership.publishRuntimeEnv();
			restartTransaction = requestGatewayRestart(plan, preparedRuntimeConfig, {
				...restartOptions,
				debtConfig: sourceConfig,
				prepareRuntimeConfig: async () => {
					for (;;) {
						const prepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(preparedRuntimeConfig, sourceConfig, transactionOwnership), transactionOwnership, {
							reason: "restart-check",
							publishFailureAsDegraded: true,
							...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {}
						});
						assertCurrent();
						if (prepared && isRuntimeSecretsPreparationCurrent(prepared)) return prepared.snapshot.config;
					}
				}
			});
			if (restartTransaction.status === "recovery-pending") throw new GatewayHotReloadRecoveryError("config restart");
			if (previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration) disconnectStaleSharedGatewayAuthClients({
				clients: params.clients,
				expectedGeneration: nextSharedGatewaySessionGeneration
			});
			restartTransaction.settle("committed");
			transactionOwnership.commitRuntimeEnv();
			restartLifecycle.settle("committed");
		} catch (error) {
			restartTransaction?.settle("rejected");
			restartLifecycle.settle("rejected");
			transactionOwnership.rollbackRuntimeEnv();
			if (requiredOwnership) setRequiredSharedGatewaySessionGenerationIfOwned(params.sharedGatewaySessionGenerationState, requiredOwnership, previousRequiredSharedGatewaySessionGeneration);
			throw error;
		}
	};
	const { onEffectiveConfigUnchanged, onHotReload, onNoopConfigCommit } = createManagedReloadSecretHandlers({
		params,
		prepareRuntimeCandidate,
		tryPrepareRuntimeSecrets,
		applyHotReload
	});
	const configReloader = startGatewayConfigReloader({
		initialConfig: params.initialConfig,
		initialCompareConfig: params.initialCompareConfig,
		initialSnapshotRawHash: params.initialSnapshotRawHash,
		initialAuthoredConfig: params.initialAuthoredConfig,
		initialIncludedPaths: params.initialIncludedPaths ?? [],
		initialSnapshotValid: params.initialSnapshotValid,
		initialSnapshotIssues: params.initialSnapshotIssues,
		onConfigCandidateCommitted: (info) => {
			invalidateConfigGetResponseCache();
			params.broadcast("config.changed", {
				path: info.path,
				hash: info.persistedHash,
				ts: Date.now()
			}, { dropIfSlow: true });
		},
		...params.prepareConfigCandidate ? { prepareConfigCandidate: params.prepareConfigCandidate } : {},
		initialInternalWriteHash: params.initialInternalWriteHash,
		runTransaction: runWithGatewayIndependentRootWorkAdmission,
		readSnapshot: params.readSnapshot,
		promoteSnapshot: async (snapshot, _reason) => await params.promoteSnapshot(snapshot),
		subscribeToWrites: params.subscribeToWrites,
		onConfigCandidateObserved: pauseGatewayRestartForConfigCandidate,
		onConfigChange: (plan, nextConfig) => {
			assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
			params.prepareTerminalConfig(plan, applyRuntimeConfigOverrides(nextConfig));
		},
		onConfigAccepted: async (nextConfig, transactionOwnership, sourceConfig, acceptance) => {
			const assertCurrent = () => {
				if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
			};
			const createRestartTarget = () => ({
				runtimeConfig: prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
				sourceConfig,
				prepareRuntimeConfig: async () => {
					for (;;) {
						const prepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
							reason: "restart-check",
							publishFailureAsDegraded: true,
							...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {}
						});
						assertCurrent();
						if (prepared && isRuntimeSecretsPreparationCurrent(prepared)) return prepared.snapshot.config;
					}
				}
			});
			let rollbackSource;
			let acceptedTargetOwnership;
			let lateConservativeDebt = null;
			try {
				assertCurrent();
				const acceptedRestart = acceptRestartConfig(sourceConfig);
				if (!acceptance.runtimeApplied) {
					assertCurrent();
					recordAcceptedRestartTarget(createRestartTarget());
					params.acceptTerminalConfig({ retireRejectedRestart: acceptedRestart.retireRejectedRestart });
					publishDeferredAppliedConfigHash();
					return;
				}
				if (acceptedRestart.debt) await runManagedRestart(acceptedRestart.debt.plan, nextConfig, transactionOwnership, sourceConfig, { retainDebtAcrossConfigChanges: acceptedRestart.debt.retainDebtAcrossConfigChanges }, async () => {
					rollbackSource = await acceptance.publishSource?.();
				});
				else rollbackSource = await acceptance.publishSource?.();
				assertCurrent();
				const acceptedTarget = publishAcceptedRestartTarget(createRestartTarget());
				acceptedTargetOwnership = acceptedTarget.ownership;
				lateConservativeDebt = acceptedTarget.conservativeDebt;
				if (lateConservativeDebt && lateConservativeDebt !== acceptedRestart.debt) await runManagedRestart(lateConservativeDebt.plan, nextConfig, transactionOwnership, sourceConfig, { retainDebtAcrossConfigChanges: lateConservativeDebt.retainDebtAcrossConfigChanges });
				assertCurrent();
				params.acceptTerminalConfig({ retireRejectedRestart: acceptedRestart.retireRejectedRestart && !lateConservativeDebt });
				publishDeferredAppliedConfigHash();
				return rollbackSource;
			} catch (error) {
				if (lateConservativeDebt) restoreConservativeRestartDebt(lateConservativeDebt);
				acceptedTargetOwnership?.reject();
				await rollbackSource?.();
				throw error;
			}
		},
		onConfigApplied: (_plan, nextConfig) => {
			resetSkillSnapshotConfigFingerprintCache();
			params.commitTerminalConfig(nextConfig);
		},
		onConfigRevisionApplied: publishAppliedConfigHash,
		onEffectiveConfigUnchanged,
		onNoopConfigCommit,
		onHotReload,
		onRestart: runManagedRestart,
		log: {
			info: (msg) => params.logReload.info(msg),
			warn: (msg) => params.logReload.warn(msg),
			error: (msg) => params.logReload.error(msg)
		},
		watchPath: params.watchPath
	});
	return {
		stop: async () => {
			stopped = true;
			stopRestartRetries();
			abortPendingChannelReloads();
			abortActiveGmailRestart();
			await configReloader.stop();
		},
		hotReloadStatus: configReloader.hotReloadStatus,
		notifyPluginMetadataChanged: configReloader.notifyPluginMetadataChanged
	};
}
//#endregion
export { abortPendingChannelReloads, startManagedGatewayConfigReloader };
