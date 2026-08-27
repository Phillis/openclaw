import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-BGzDm6gu.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { Bt as tableExists, F as ensureGitHubPublicationSchema, Nn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-Chr0R2hQ.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-BJZ-8dtR.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-BdMmGHtb.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import "./config-B_0xOnKq.js";
import { t as runCommandBuffered } from "./exec-D2kbpwdA.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-B6LtW2cN.js";
import { w as parseWorkerLaunchPlan } from "./worker-connection-contract-CLo4JQpE.js";
import { D as NODE_WORKER_WORKSPACE_RETAIN_COMMAND } from "./node-commands-DRxP7loh.js";
import { n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import "./openclaw-agent-db-BEQsKM0c.js";
import { z as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { _ as runExclusiveSessionStoreWrite, c as interruptSessionWorkAdmissions, d as isSessionWorkAdmissionActive, m as startSessionWorkAdmissionInterruption, p as runExclusiveSessionLifecycleMutation, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-BtKN0pjk.js";
import { l as emitSessionLifecycleEvent, u as onSessionIdentityMutation } from "./session-history-eviction-DX5U9ZnW.js";
import { m as registerSessionMaintenancePreserveKeysProvider } from "./types-gVK8DqPC.js";
import { dt as withTranscriptWriteTransaction } from "./session-accessor-fcDZuc2H.js";
import { i as hasNonzeroUsage, o as normalizeUsage } from "./usage-DNKCVmJi.js";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-BzU_LUo9.js";
import { H as convertToLlm } from "./agent-core-DirSpnc5.js";
import "./messages-Tsbm3uN2.js";
import { t as SessionManager } from "./session-manager-CBD-q5pC.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuqTHyA8.js";
import { o as withSessionPlacementForcedTerminalSettlement, t as installSessionPlacementAdmissionProvider } from "./session-placement-admission-CIMNOxmd.js";
import { i as resolveSandboxConfigForAgent } from "./config-CfIhW1Vb.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-D-khMh6L.js";
import { c as resolvePreparedRunAdmission } from "./admitted-run-context-KQIZywud.js";
import { n as measureAgentRuntimeIdentityTokenBytes, r as mintAgentRuntimeIdentityToken } from "./agent-runtime-identity-token-Cal_zwyQ.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-D367C0tS.js";
import { t as createPreprovisionedSshSandboxBackend } from "./ssh-backend-B38eKhNZ.js";
import { t as createSandboxFsBridge } from "./fs-bridge-B2BH2Za1.js";
import { n as mapThinkingLevelForProvider } from "./utils-CefVZRZM.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-XnskQsTT.js";
import { a as projectWorkspaceResultConflict, i as formatWorkspaceConflictSummary, n as WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, r as WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE, t as WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE } from "./workspace-conflicts-BySrOYlf.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-Dmx2MxPy.js";
import { s as hasPendingFollowupQueueWork } from "./settings-CxUlx8Vr.js";
import "./session-utils-uVsFjoXC.js";
import { n as projectConversationToolNames } from "./conversation-tool-policy-pipeline-CA52nGy8.js";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DvUzWxBA.js";
import { r as resolveControlUiSessionUrl } from "./control-ui-link-base-Do6aarSP.js";
import { C as mergeUsageIntoAccumulator, a as buildUsageAgentMetaFields, x as createUsageAccumulator, y as resolveReportedModelRef } from "./helpers-DxFP_0vX.js";
import { l as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-B__a3yB4.js";
import { t as clearSessionQueues } from "./cleanup-CiIpHyQA.js";
import { t as isFailedWorkerPlacementEnvironmentGone } from "./session-placement-lifecycle-SteNC2br.js";
import { n as resolveWorkerSshSandboxSettings } from "./ssh-CVu3Gyx7.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-sharing-DSLYm21V.js";
import { r as resolveGitCoauthorAttribution } from "./git-coauthor-attribution-DPzSfDW9.js";
import { l as managedWorktrees } from "./service-Be0GN-Co.js";
import { n as emitSessionsChanged } from "./session-change-event-Cjm468kd.js";
import "./device-provider-identity-v6nXqNq_.js";
import { t as createWorkerPlacementRunnerAvailabilityReader } from "./placement-projector-1PRmQMM5.js";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-CwSk9J7-.js";
import { a as resolveGitHubPublicationWorktreeOwner, i as prepareGitHubPublicationAvailability, n as matchesCurrentGitHubPublicationIdentity, r as prepareCurrentGitHubPublicationIdentity, t as currentGitHubPublicationConfig } from "./github-publication-availability-CuCM4gdY.js";
import { i as parseNodeWorkerWorkspaceRetainResult } from "./node-workspace-retain-protocol-CVk94Dul.js";
import { n as WORKER_REQUIRED_LOCAL_TOOL_NAMES, r as WORKER_SESSION_TOOL_NAMES } from "./tool-authority-BfRQ7maz.js";
import { o as toWorkerTranscriptMessage, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-WHdKssX2.js";
import { r as parseWorkerRuntimeResult } from "./worker-process-protocol-DxScVuGj.js";
import { a as recoverWorkerWorkspaceReconciliation } from "./workspace-reconcile-Ca4yuu6w.js";
import { t as boundedWorkerError } from "./worker-error-C2z1Ud9q.js";
import { a as hasWorkerWorkspaceResultRef, c as preparedWorkerWorkspaceResultRef, i as deleteWorkerWorkspaceResultCleanupRefs, l as restoreStagedWorkerWorkspaceResultFromCleanup, n as cleanupWorkerWorkspaceResultRef, o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, s as moveStagedWorkerWorkspaceResultToCleanup, t as applyStagedWorkerWorkspaceResult, u as workerWorkspaceResultRef } from "./workspace-result-staging-C1c-gG8N.js";
import { n as resolveGitHubRepositoryTarget, r as parseGitHubRemoteUrl } from "./github-repository-target-Bww88SjZ.js";
import { _ as sameWorkerSessionTurnClaim, i as isCurrentPlacementTurnClaim, m as projectWorkerSessionTurnClaim, p as placementTurnOwner } from "./placement-record-nLiaHmTd.js";
import { n as WorkerRunnerUnavailableError, r as WorkerTunnelOwnerDisconnectedError, t as WorkerRunnerCapacityError } from "./tunnel-contract-D4tydcWT.js";
import { n as resolveDevicePlacementEligibility, t as resolveWorkerPlacementDestination } from "./placement-destination-D4AGm8V6.js";
import { o as isCurrentWorkerWorkspacePendingResultOwner, t as ActiveTurnClaimError } from "./placement-turn-claims-BGSx4Wk6.js";
import { n as bindWorkerTurnAdmissionContinuation, r as bindWorkerTurnExecutionIdentity } from "./placement-turn-claim-events-DXxC6aUk.js";
import { t as listRetainedWorkerBundleHashes } from "./worker-bundle-retention-BkGqvbuZ.js";
import { i as supportsWorkerExecutionContextLaunch, n as StaleWorkerBuildError } from "./admission-CzKwSq5g.js";
import { r as verifyReconciledWorkspaceFinal, t as WorkerWorkspaceFinalFenceError } from "./workspace-finalize-i1F3pPpk.js";
import { t as deriveEnvironmentIntent } from "./service-contract-DRAD5TG3.js";
import { t as windowWorkerReplayMessages } from "./replay-message-window-Bq8t8hQh.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/github-publication-transcript.ts
const GITHUB_PUBLICATION_RESPONSE_PREFIX = "github-publication:";
function formatGitHubPublicationResult(result) {
	switch (result.status) {
		case "published": return `Published ${result.repository} branch ${result.branch}: ${result.url}`;
		case "failed": return `GitHub publication failed: ${result.message} ${result.nextAction}`;
		case "publishing":
		case "requested": return result.message;
	}
	return result;
}
function createGitHubPublicationTranscriptReporter(loadSessionRuntime, coordinator) {
	return async (params) => {
		const runtime = await loadSessionRuntime();
		const target = runtime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: params.sessionKey,
			agentId: params.agentId,
			clone: false
		});
		if (runtime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== params.sessionId || target.canonicalKey !== params.sessionKey) throw new Error("GitHub publication transcript owner changed");
		await withTranscriptWriteTransaction({
			agentId: target.agentId,
			sessionId: params.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, (transcriptTarget) => {
			const manager = SessionManager.open(transcriptTarget);
			if (!manager.getBranch().some((transcriptEntry) => {
				return transcriptEntry.type === "message" && transcriptEntry.message.role === "assistant" && transcriptEntry.message.responseId === `${GITHUB_PUBLICATION_RESPONSE_PREFIX}${params.result.requestId}`;
			})) manager.appendMessage({
				role: "assistant",
				content: [{
					type: "text",
					text: formatGitHubPublicationResult(params.result)
				}],
				api: "openai-responses",
				provider: "openclaw",
				model: "gateway-publication",
				responseId: `${GITHUB_PUBLICATION_RESPONSE_PREFIX}${params.result.requestId}`,
				usage: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					totalTokens: 0,
					cost: {
						input: 0,
						output: 0,
						cacheRead: 0,
						cacheWrite: 0,
						total: 0
					}
				},
				stopReason: "stop",
				timestamp: Date.now()
			});
		});
		coordinator.markReported(params.result.requestId);
	};
}
//#endregion
//#region src/gateway/github-publication-base.ts
function githubPublicationBaseLookupArgs(repository, baseBranch) {
	return [
		"gh",
		"api",
		"--hostname",
		"github.com",
		`repos/${repository}/git/ref/heads/${baseBranch}`,
		"--jq",
		"{ref: .ref, sha: .object.sha}"
	];
}
function githubPublicationBaseFetchArgs(repository, sha) {
	return [
		"git",
		"-c",
		"credential.helper=",
		"-c",
		"credential.helper=!gh auth git-credential",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		"-c",
		"maintenance.auto=false",
		"-c",
		"gc.auto=0",
		"fetch",
		"--no-auto-maintenance",
		"--no-tags",
		"--no-write-fetch-head",
		"--recurse-submodules=no",
		"--",
		`https://github.com/${repository}.git`,
		sha
	];
}
function githubPublicationBranchCreationArgs(branch) {
	return [
		"git",
		"reflog",
		"show",
		"--format=%H",
		"--end-of-options",
		`refs/heads/${branch}`
	];
}
function githubPublicationBaseLineageArgs(ancestor, descendant) {
	return [
		"git",
		"merge-base",
		"--is-ancestor",
		ancestor,
		descendant
	];
}
function githubPublicationUnsafeConfigArgs(scope) {
	return [
		"git",
		"config",
		scope,
		"--includes",
		"--get-regexp",
		"^(core\\.(alternaterefscommand|askpass|fsmonitor|gitproxy|sshcommand|worktree)|credential\\..*helper|filter\\..*|http\\..*|include(if)?\\..*|push\\..*|remote\\..*\\.(proxy|receivepack|uploadpack|vcs)|uploadpack\\.packobjectshook|url\\..*\\.(insteadof|pushinsteadof))$"
	];
}
function parseGitHubPublicationBaseBranch(baseRef, defaultBranch) {
	const trimmed = baseRef.trim();
	if (!trimmed || trimmed === "HEAD" || /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(trimmed)) return defaultBranch;
	for (const prefix of [
		"refs/remotes/origin/",
		"origin/",
		"refs/heads/"
	]) if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
	return trimmed;
}
/** Returns the authenticated target-base SHA or fails the publication boundary closed. */
function parseGitHubPublicationBaseRef(raw, baseBranch) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error("GitHub publication workspace base branch could not be verified.");
	}
	const ref = isRecord(parsed) ? readNonBlankString(parsed.ref) : void 0;
	const sha = isRecord(parsed) ? readNonBlankString(parsed.sha) : void 0;
	if (ref !== `refs/heads/${baseBranch}` || !sha || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(sha)) throw new Error("GitHub publication workspace base branch could not be verified.");
	return sha;
}
//#endregion
//#region src/gateway/github-publication-failure.ts
function resolveGitHubPublicationFailure(error) {
	const message = error instanceof Error ? error.message : "";
	if (message.includes("identity")) return {
		code: message.includes("changed") ? "identity_changed" : "identity_unavailable",
		nextAction: "Reconnect the GitHub identity in Agents → Tools, then request publication again."
	};
	if (message.includes("session") || message.includes("worktree owner")) return {
		code: "session_changed",
		nextAction: "Open the current session worktree and request publication again."
	};
	if (message.includes("transport configuration") || message.includes("replacement metadata")) return {
		code: "workspace_changed",
		nextAction: "Remove the unsupported Git transport or replacement configuration from the session worktree, then retry."
	};
	if (message.includes("workspace") || message.includes("branch changed")) return {
		code: "workspace_changed",
		nextAction: "Wait for the current turn to finish, inspect the reconciled workspace, and retry."
	};
	if (message.includes("not a git")) return {
		code: "not_git",
		nextAction: "Use a session-owned Git worktree to publish."
	};
	if (message.includes("GitHub remote")) return {
		code: "not_github",
		nextAction: "Use a GitHub repository remote to publish."
	};
	if (message.includes("no changes")) return {
		code: "no_changes",
		nextAction: "Make or restore a repository change, then retry."
	};
	if (message.includes("push")) return {
		code: "push_rejected",
		nextAction: "Check repository write access and branch drift, then retry without force-pushing."
	};
	if (message.includes("pull request was closed")) return {
		code: "github_rejected",
		nextAction: "Reopen the closed pull request or retry to create a new publication request."
	};
	if (message.includes("pull request") || message.includes("GitHub")) return {
		code: "github_rejected",
		nextAction: "Check pull-request permission for the effective account, then retry."
	};
	return {
		code: "unavailable",
		nextAction: "Retry after the Gateway and GitHub are available."
	};
}
//#endregion
//#region src/gateway/github-publication-git-index.ts
const HARDENED_GIT = [
	"git",
	"-c",
	`core.hooksPath=${os.devNull}`,
	"-c",
	"core.fsmonitor=false"
];
var GitHubPublicationRefCasRejectedError = class extends Error {};
var GitHubPublicationRecoveryPendingError = class extends Error {};
function assertGitHubPublicationRefCasCompleted(result) {
	if (result.code === 0) return;
	if (result.signal === null && !result.killed) throw new GitHubPublicationRefCasRejectedError("GitHub publication workspace branch changed before commit.");
	throw new Error("GitHub publication workspace branch update outcome is unknown.");
}
async function syncDirectory(directory) {
	let handle;
	try {
		handle = await fs.open(directory, "r");
		await handle.sync();
	} catch (error) {
		const code = typeof error === "object" && error !== null && "code" in error ? error.code : void 0;
		if (process.platform !== "win32" || code !== "EINVAL" && code !== "EPERM") throw error;
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
function errorCode(error) {
	return typeof error === "object" && error !== null && "code" in error ? error.code : void 0;
}
async function sameFile(left, right) {
	try {
		const [leftStat, rightStat] = await Promise.all([fs.stat(left), fs.stat(right)]);
		return leftStat.nlink >= 2 && rightStat.nlink >= 2 && leftStat.dev === rightStat.dev && leftStat.ino === rightStat.ino;
	} catch (error) {
		if (errorCode(error) === "ENOENT") return false;
		throw error;
	}
}
async function pathExists(file) {
	try {
		await fs.stat(file);
		return true;
	} catch (error) {
		if (errorCode(error) === "ENOENT") return false;
		throw error;
	}
}
async function writeDurableFile(file, contents) {
	await fs.writeFile(file, contents, {
		flag: "w",
		mode: 384
	});
	const handle = await fs.open(file, "r+");
	try {
		await handle.sync();
	} finally {
		await handle.close();
	}
}
function publicationRecoveryPath(indexPath, requestId) {
	return `${indexPath}.openclaw-${createHash("sha256").update(requestId).digest("hex")}`;
}
async function recoverGitHubPublicationBranchAndIndex(params) {
	const mutate = async (operation) => {
		params.assertCurrent();
		return await operation();
	};
	const rawIndexPath = await params.run([
		"git",
		"rev-parse",
		"--git-path",
		"index"
	], { cwd: params.cwd });
	const indexPath = path.resolve(params.cwd, rawIndexPath);
	const lockPath = `${indexPath}.lock`;
	const recoveryPath = publicationRecoveryPath(indexPath, params.requestId);
	if (!await pathExists(recoveryPath)) return;
	if (!await sameFile(recoveryPath, lockPath)) {
		if (await pathExists(lockPath)) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery is waiting for another Git operation.");
		const branchHead = await params.run([
			"git",
			"rev-parse",
			"--verify",
			`refs/heads/${params.branch}`
		], { cwd: params.cwd });
		const indexTree = await params.run([...HARDENED_GIT, "write-tree"], { cwd: params.cwd });
		if (branchHead === params.sourceHeadCommit || indexTree === params.workspaceTree && await publicationCommitMatches(params, branchHead)) {
			await mutate(async () => await fs.rm(recoveryPath, { force: true }));
			return;
		}
		throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery is pending.");
	}
	const branchHead = await params.run([
		"git",
		"rev-parse",
		"--verify",
		`refs/heads/${params.branch}`
	], { cwd: params.cwd });
	if (branchHead === params.sourceHeadCommit) {
		await mutate(async () => await fs.rm(lockPath, { force: true }));
		await mutate(async () => await fs.rm(recoveryPath, { force: true }));
		await syncDirectory(path.dirname(indexPath));
		return;
	}
	if (!await publicationCommitMatches(params, branchHead)) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace branch recovery is pending.");
	await mutate(async () => await fs.rename(lockPath, indexPath));
	await syncDirectory(path.dirname(indexPath));
	await mutate(async () => await fs.rm(recoveryPath, { force: true }));
}
async function publicationCommitMatches(params, headCommit) {
	const [message, parent, tree] = await Promise.all([
		params.run([
			"git",
			"show",
			"-s",
			"--format=%B",
			headCommit
		], { cwd: params.cwd }),
		params.run([
			"git",
			"rev-parse",
			`${headCommit}^`
		], { cwd: params.cwd }),
		params.run([
			"git",
			"rev-parse",
			`${headCommit}^{tree}`
		], { cwd: params.cwd })
	]);
	return message.split(/\r?\n/u).includes(`OpenClaw-Publication: ${params.requestId}`) && parent === params.sourceHeadCommit && tree === params.workspaceTree;
}
/** Moves the branch and accepted index together while honoring Git's standard index lock. */
async function updateGitHubPublicationBranchAndIndex(params) {
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-github-index-"));
	const replacementIndex = path.join(tempDir, "replacement-index");
	const observedIndex = path.join(tempDir, "observed-index");
	let lockPath;
	let recoveryPath;
	let ownsLock = false;
	let refMayHaveMoved = false;
	let installed = false;
	try {
		const rawIndexPath = await params.run([
			"git",
			"rev-parse",
			"--git-path",
			"index"
		], { cwd: params.cwd });
		const indexPath = path.resolve(params.cwd, rawIndexPath);
		lockPath = `${indexPath}.lock`;
		recoveryPath = publicationRecoveryPath(indexPath, params.requestId);
		const gitEnv = {
			...params.env,
			GIT_CONFIG_GLOBAL: os.devNull,
			GIT_CONFIG_SYSTEM: os.devNull
		};
		await params.run([
			...HARDENED_GIT,
			"read-tree",
			params.headCommit
		], {
			cwd: params.cwd,
			env: {
				...gitEnv,
				GIT_INDEX_FILE: replacementIndex
			}
		});
		const replacement = await fs.readFile(replacementIndex);
		let recoveryIndex;
		try {
			recoveryIndex = await fs.readFile(recoveryPath);
		} catch (error) {
			if (errorCode(error) !== "ENOENT") throw error;
		}
		if (recoveryIndex && !recoveryIndex.equals(replacement)) {
			const branchHead = await params.run([
				"git",
				"rev-parse",
				"--verify",
				`refs/heads/${params.branch}`
			], { cwd: params.cwd });
			if (await sameFile(recoveryPath, lockPath) || branchHead !== params.previousHead) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery data changed.");
			recoveryIndex = void 0;
		}
		if (!recoveryIndex) {
			await writeDurableFile(recoveryPath, replacement);
			await syncDirectory(path.dirname(indexPath));
		}
		if (await sameFile(recoveryPath, lockPath)) {
			const branchHead = await params.run([
				"git",
				"rev-parse",
				"--verify",
				`refs/heads/${params.branch}`
			], { cwd: params.cwd });
			if (branchHead === params.headCommit) try {
				await fs.rename(lockPath, indexPath);
				installed = true;
				await syncDirectory(path.dirname(indexPath));
				await fs.rm(recoveryPath, { force: true });
				return;
			} catch (error) {
				throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace index recovery is pending.", { cause: error });
			}
			if (branchHead !== params.previousHead) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace branch recovery is pending.");
			await fs.rm(lockPath);
			await syncDirectory(path.dirname(indexPath));
		} else if (await pathExists(lockPath)) throw new Error("GitHub publication workspace index is locked by another operation.");
		params.assertCurrent();
		try {
			await fs.link(recoveryPath, lockPath);
			ownsLock = true;
		} catch (error) {
			throw new Error("GitHub publication workspace index changed before commit.", { cause: error });
		}
		await fs.copyFile(indexPath, observedIndex);
		const currentIndexTree = await params.run([...HARDENED_GIT, "write-tree"], {
			cwd: params.cwd,
			env: {
				...gitEnv,
				GIT_INDEX_FILE: observedIndex
			}
		});
		if (currentIndexTree !== params.sourceIndexTree && currentIndexTree !== params.workspaceTree) throw new Error("GitHub publication workspace index changed after its accepted snapshot.");
		params.assertCurrent();
		await syncDirectory(path.dirname(indexPath));
		params.assertCurrent();
		if (params.updateRef) {
			refMayHaveMoved = true;
			try {
				await params.updateRef();
			} catch (error) {
				if (error instanceof GitHubPublicationRefCasRejectedError) refMayHaveMoved = false;
				throw error;
			}
		}
		params.assertCurrent();
		await fs.rename(lockPath, indexPath);
		ownsLock = false;
		installed = true;
		await syncDirectory(path.dirname(indexPath));
		await fs.rm(recoveryPath, { force: true });
	} catch (error) {
		if (!installed && refMayHaveMoved && ownsLock) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery is pending.", { cause: error });
		throw error;
	} finally {
		if (!installed && !refMayHaveMoved && ownsLock && lockPath) await fs.rm(lockPath, { force: true });
		if ((installed || !refMayHaveMoved) && recoveryPath) await fs.rm(recoveryPath, { force: true });
		await fs.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
//#region src/gateway/github-publication-git-transport.ts
async function runPublicationCommand(argv, options = {}) {
	return await runCommandBuffered(argv, {
		...options.cwd ? { cwd: options.cwd } : {},
		env: {
			...options.env ?? process.env,
			GIT_NO_REPLACE_OBJECTS: "1",
			GIT_CONFIG_COUNT: "1",
			GIT_CONFIG_KEY_0: "core.hooksPath",
			GIT_CONFIG_VALUE_0: os.devNull
		},
		...options.input !== void 0 ? { input: options.input } : {},
		timeoutMs: 6e4,
		maxOutputBytes: options.maxOutputBytes ?? 256 * 1024
	});
}
async function requirePublicationCommand(argv, options = {}) {
	const result = await runPublicationCommand(argv, options);
	if (result.code !== 0) throw new Error(`${argv[0]} command failed`);
	return result.stdout.toString("utf8").trim();
}
const TREE_LISTING_MAX_OUTPUT_BYTES = 64 * 1024 * 1024;
async function assertSafeGitPublicationWorkspace(cwd, run) {
	const isolatedConfig = {
		GIT_CONFIG_GLOBAL: os.devNull,
		GIT_CONFIG_SYSTEM: os.devNull
	};
	const [localUnsafe, worktreeConfig] = await Promise.all([run(githubPublicationUnsafeConfigArgs("--local"), {
		cwd,
		env: isolatedConfig
	}), run([
		"git",
		"config",
		"--local",
		"--includes",
		"--bool",
		"--get",
		"extensions.worktreeConfig"
	], {
		cwd,
		env: isolatedConfig
	})]);
	const worktreeConfigValue = worktreeConfig.stdout.toString("utf8").trim();
	const worktreeConfigKnown = worktreeConfig.code === 0 && (worktreeConfigValue === "true" || worktreeConfigValue === "false") || worktreeConfig.code === 1 && worktreeConfig.stdout.length === 0;
	if (localUnsafe.code !== 1 || localUnsafe.stdout.length > 0 || !worktreeConfigKnown) throw new Error("GitHub publication workspace has unsupported Git transport configuration.");
	const worktreeUnsafe = worktreeConfigValue === "true" ? await run(githubPublicationUnsafeConfigArgs("--worktree"), {
		cwd,
		env: isolatedConfig
	}) : void 0;
	if (worktreeUnsafe && (worktreeUnsafe.code !== 1 || worktreeUnsafe.stdout.length > 0)) throw new Error("GitHub publication workspace has unsupported Git transport configuration.");
	const [replacements, graftPath] = await Promise.all([run([
		"git",
		"for-each-ref",
		"--count=1",
		"--format=%(refname)",
		"refs/replace"
	], { cwd }), run([
		"git",
		"rev-parse",
		"--git-path",
		"info/grafts"
	], { cwd })]);
	if (replacements.code !== 0 || replacements.stdout.length > 0 || graftPath.code !== 0) throw new Error("GitHub publication workspace has unsupported Git replacement metadata.");
	const grafts = await readOptionalAttributeFile(path.resolve(cwd, graftPath.stdout.toString("utf8").trim()));
	if (grafts && grafts.length > 0) throw new Error("GitHub publication workspace has unsupported Git replacement metadata.");
}
function assertNoGitFilterAttributes(contents) {
	for (const line of contents.toString("latin1").split(/\r?\n/u)) {
		const fields = line.trimStart().split(/[\t ]+/u);
		if (!fields[0] || fields[0].startsWith("#")) continue;
		if (fields.slice(1).some((field) => /^(?:-|!)?filter(?:=|$)/u.test(field))) throw new Error("GitHub publication workspace uses an unsupported Git clean filter.");
	}
}
async function readOptionalAttributeFile(file) {
	try {
		return await fs.readFile(file);
	} catch (error) {
		if ((typeof error === "object" && error !== null && "code" in error ? error.code : void 0) === "ENOENT") return;
		throw error;
	}
}
async function assertGitHubPublicationTreeHasNoFilters(cwd, workspaceTree, run) {
	const listing = await run([
		"git",
		"ls-tree",
		"-r",
		"-z",
		"--full-tree",
		workspaceTree
	], {
		cwd,
		maxOutputBytes: TREE_LISTING_MAX_OUTPUT_BYTES
	});
	if (listing.code !== 0) throw new Error("GitHub publication workspace attributes could not be verified.");
	const attributeObjects = /* @__PURE__ */ new Set();
	for (const record of listing.stdout.toString("latin1").split("\0")) {
		const tab = record.indexOf("	");
		if (tab < 0) continue;
		const file = record.slice(tab + 1).toLowerCase();
		if (file !== ".gitattributes" && !file.endsWith("/.gitattributes")) continue;
		const objectId = record.slice(0, tab).split(" ")[2];
		if (objectId) attributeObjects.add(objectId);
	}
	if (attributeObjects.size > 1024) throw new Error("GitHub publication workspace has too many Git attribute files.");
	for (const objectId of attributeObjects) {
		const blob = await run([
			"git",
			"cat-file",
			"blob",
			objectId
		], { cwd });
		if (blob.code !== 0) throw new Error("GitHub publication workspace attributes could not be verified.");
		assertNoGitFilterAttributes(blob.stdout);
	}
	const infoPath = await run([
		"git",
		"rev-parse",
		"--git-path",
		"info/attributes"
	], { cwd });
	if (infoPath.code !== 0) throw new Error("GitHub publication workspace attributes could not be verified.");
	const attributeFiles = await Promise.all(["GIT_ATTR_GLOBAL", "GIT_ATTR_SYSTEM"].map(async (name) => await run([
		"git",
		"var",
		name
	], { cwd })));
	if (attributeFiles.some((result) => result.code !== 0)) throw new Error("GitHub publication workspace attributes could not be verified.");
	const paths = [path.resolve(cwd, infoPath.stdout.toString("utf8").trim()), ...attributeFiles.flatMap((result) => result.stdout.length > 0 ? [result.stdout.toString("utf8").trim()] : [])];
	for (const file of paths) {
		const contents = await readOptionalAttributeFile(file);
		if (contents) assertNoGitFilterAttributes(contents);
	}
}
async function captureGitHubPublicationWorkspaceSnapshot(params) {
	const step = async (operation) => {
		params.assertCurrent?.();
		const result = await operation();
		params.assertCurrent?.();
		return result;
	};
	await step(() => assertSafeGitPublicationWorkspace(params.cwd, runPublicationCommand));
	const sourceHeadCommit = await step(async () => await requirePublicationCommand([
		"git",
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], { cwd: params.cwd }));
	const sourceIndexTree = await step(async () => await requirePublicationCommand([
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		"write-tree"
	], { cwd: params.cwd }));
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-github-snapshot-"));
	try {
		const env = {
			GIT_ATTR_NOSYSTEM: "1",
			GIT_CONFIG_GLOBAL: os.devNull,
			GIT_CONFIG_SYSTEM: os.devNull,
			GIT_INDEX_FILE: path.join(tempDir, "index")
		};
		await step(async () => {
			await requirePublicationCommand([
				"git",
				"-c",
				`core.hooksPath=${os.devNull}`,
				"-c",
				"core.fsmonitor=false",
				"read-tree",
				sourceHeadCommit
			], {
				cwd: params.cwd,
				env
			});
		});
		await step(async () => {
			await requirePublicationCommand([
				"git",
				"-c",
				`core.attributesFile=${os.devNull}`,
				"-c",
				`core.hooksPath=${os.devNull}`,
				"-c",
				"core.fsmonitor=false",
				"add",
				"-A"
			], {
				cwd: params.cwd,
				env
			});
		});
		const workspaceTree = await step(async () => await requirePublicationCommand([
			"git",
			"-c",
			`core.hooksPath=${os.devNull}`,
			"-c",
			"core.fsmonitor=false",
			"write-tree"
		], {
			cwd: params.cwd,
			env
		}));
		await step(() => assertGitHubPublicationTreeHasNoFilters(params.cwd, workspaceTree, runPublicationCommand));
		return {
			sourceHeadCommit,
			sourceIndexTree,
			workspaceTree
		};
	} finally {
		await fs.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
}
const GITHUB_CREDENTIAL_ARGS = [
	"git",
	"-c",
	"credential.helper=",
	"-c",
	"credential.helper=!gh auth git-credential"
];
function appendGitHubPublicationMessage(base, lines) {
	const present = new Set(base.split(/\r?\n/u).map((line) => line.trim()));
	const missing = lines.filter((line) => !present.has(line));
	return missing.length > 0 ? `${base.trimEnd()}\n\n${missing.join("\n")}` : base.trimEnd();
}
async function assertGitHubPublicationBranchRef(branch, run) {
	const code = await run([
		"git",
		"symbolic-ref",
		"--quiet",
		`refs/heads/${branch}`
	]);
	if (code === 0) throw new Error("GitHub publication workspace branch ref became symbolic.");
	if (code !== 1) throw new Error("GitHub publication workspace branch ref could not be verified.");
}
function githubPublicationPushArgs(remote, headCommit, branch) {
	return [
		...GITHUB_CREDENTIAL_ARGS,
		"-c",
		`core.hooksPath=${os.devNull}`,
		"push",
		"--porcelain",
		"--no-follow-tags",
		"--recurse-submodules=no",
		"--",
		remote,
		`${headCommit}:refs/heads/${branch}`
	];
}
function githubPublicationRemoteHeadArgs(remote, branch) {
	return [
		...GITHUB_CREDENTIAL_ARGS,
		"ls-remote",
		"--refs",
		remote,
		`refs/heads/${branch}`
	];
}
function githubPublicationUpdateRefArgs(branch, commit, previousHead) {
	return [
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		"update-ref",
		`refs/heads/${branch}`,
		commit,
		previousHead
	];
}
//#endregion
//#region src/gateway/github-publication-pull-requests.ts
function githubPublicationPullRequestLookupArgs(params) {
	return [
		"gh",
		"api",
		"--hostname",
		"github.com",
		"--method",
		"GET",
		`repos/${params.repository}/pulls`,
		"-f",
		`head=${params.owner}:${params.branch}`,
		"-f",
		`base=${params.baseBranch}`,
		"-f",
		"state=all",
		"--jq",
		"map({url: .html_url, userId: .user.id, state: .state, body: (.body // \"\"), headSha: .head.sha, headRef: .head.ref, baseRef: .base.ref})"
	];
}
function githubPublicationCreatePullRequestArgs(repository) {
	return [
		"gh",
		"api",
		"--hostname",
		"github.com",
		"--method",
		"POST",
		`repos/${repository}/pulls`,
		"--input",
		"-"
	];
}
/** Parses the complete authenticated PR lookup; one malformed candidate invalidates the response. */
function parseGitHubPublicationPullRequests(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		throw new Error("GitHub pull request lookup returned invalid JSON.", { cause: error });
	}
	if (!Array.isArray(parsed)) throw new Error("GitHub pull request lookup returned an invalid response.");
	return parsed.map((candidate) => {
		if (!isRecord(candidate)) throw new Error("GitHub pull request lookup returned an invalid candidate.");
		const userId = candidate.userId;
		const url = readNonBlankString(candidate.url);
		const state = candidate.state;
		const body = candidate.body;
		const headSha = readNonBlankString(candidate.headSha);
		const headRef = readNonBlankString(candidate.headRef);
		const baseRef = readNonBlankString(candidate.baseRef);
		if (!Number.isSafeInteger(userId) || Number(userId) < 1 || !url || state !== "open" && state !== "closed" || typeof body !== "string" || !headSha || !headRef || !baseRef) throw new Error("GitHub pull request lookup returned an invalid candidate.");
		return {
			userId: Number(userId),
			url,
			state,
			body,
			headSha,
			headRef,
			baseRef
		};
	});
}
function resolveGitHubPublicationPullRequestUrl(candidates, params) {
	const exact = candidates.filter((candidate) => candidate.userId === params.accountId && candidate.headSha === params.headCommit && candidate.headRef === params.branch && candidate.baseRef === params.baseBranch);
	const open = exact.find((candidate) => candidate.state === "open");
	if (open) return open.url;
	if (exact.some((candidate) => candidate.state === "closed" && candidate.body.includes(params.marker))) throw new Error("GitHub pull request was closed before publication completed.");
}
//#endregion
//#region src/gateway/github-publication-recovery.ts
async function recoverGitHubPublicationWorkspace(row, run, assertCurrent) {
	const worktree = managedWorktrees.findLiveById(row.worktree_id);
	if (worktree?.repoFingerprint !== row.repository_fingerprint || worktree.branch !== row.branch || !row.source_head_commit || !row.workspace_tree) return;
	await recoverGitHubPublicationBranchAndIndex({
		cwd: worktree.path,
		requestId: row.request_id,
		branch: row.branch,
		sourceHeadCommit: row.source_head_commit,
		workspaceTree: row.workspace_tree,
		assertCurrent,
		run
	});
}
//#endregion
//#region src/gateway/github-publication-executor.ts
const PUBLICATION_MARKER = "OpenClaw-Publication";
var GitHubPublicationAuthorityLostError = class extends Error {};
function matchesGitHubPublicationIdentityRow(row, identity) {
	return row.identity_source === identity.source && row.identity_profile_id === (identity.profileId ?? null) && row.identity_account_id === identity.account.accountId && row.identity_login.toLowerCase() === identity.account.login.toLowerCase();
}
function parseJsonObject(value, label) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error(`${label} returned invalid JSON`, { cause: error });
	}
	if (!isRecord(parsed)) throw new Error(`${label} returned an invalid response`);
	return parsed;
}
async function executeGitHubPublication(params) {
	const { initial } = params;
	if (initial.status === "published" || initial.status === "failed") return params.projectResult(initial);
	let activeIdentity;
	const currentWorktree = () => resolveGitHubPublicationWorktreeOwner({
		sessionId: initial.session_id,
		sessionKey: initial.session_key,
		agentId: initial.agent_id,
		expected: {
			worktreeId: initial.worktree_id,
			repositoryFingerprint: initial.repository_fingerprint,
			branch: initial.branch
		}
	});
	const assertAuthority = () => {
		if (!params.validateAuthority()) throw new GitHubPublicationAuthorityLostError("GitHub publication session authority changed.");
		currentWorktree();
		if (activeIdentity && !matchesCurrentGitHubPublicationIdentity({
			agentId: initial.agent_id,
			identity: activeIdentity
		})) throw new Error("GitHub publication identity changed.");
	};
	const step = async (operation) => {
		assertAuthority();
		const value = await operation();
		assertAuthority();
		return value;
	};
	try {
		const { loaded, worktree } = currentWorktree();
		await step(async () => await assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
		await step(async () => await recoverGitHubPublicationWorkspace(initial, requirePublicationCommand, assertAuthority));
		const repositoryIdentity = await step(async () => await managedWorktrees.resolveRepositoryIdentity(worktree.path));
		if (repositoryIdentity.checkoutRoot !== worktree.path || repositoryIdentity.repoRoot !== worktree.repoRoot || repositoryIdentity.fingerprint !== worktree.repoFingerprint) throw new Error("GitHub publication workspace repository changed.");
		const remote = parseGitHubRemoteUrl(repositoryIdentity.originUrl);
		if (!remote || !/^[A-Za-z0-9_.-]+$/u.test(remote.owner) || !/^[A-Za-z0-9_.-]+$/u.test(remote.repo)) throw new Error("GitHub publication requires a GitHub remote.");
		const pushRepository = `${remote.owner}/${remote.repo}`;
		const branch = await step(async () => await requirePublicationCommand([
			"git",
			"symbolic-ref",
			"--quiet",
			"--short",
			"HEAD"
		], { cwd: worktree.path }));
		if (branch !== worktree.branch) throw new Error("GitHub publication branch changed.");
		let row = initial;
		let sourceHeadCommit = row.source_head_commit;
		let sourceIndexTree = row.source_index_tree;
		let workspaceTree = row.workspace_tree;
		if (!sourceHeadCommit || !sourceIndexTree || !workspaceTree) {
			const snapshot = await captureGitHubPublicationWorkspaceSnapshot({
				cwd: worktree.path,
				assertCurrent: assertAuthority
			});
			row = params.bindWorkspaceSnapshot({
				row,
				...snapshot
			});
			sourceHeadCommit = snapshot.sourceHeadCommit;
			sourceIndexTree = snapshot.sourceIndexTree;
			workspaceTree = snapshot.workspaceTree;
		}
		let headCommit = await step(async () => await requirePublicationCommand([
			"git",
			"rev-parse",
			"--verify",
			"HEAD^{commit}"
		], { cwd: worktree.path }));
		const refreshIdentity = async () => {
			const identity = await step(async () => await prepareCurrentGitHubPublicationIdentity(initial.agent_id));
			if (!matchesGitHubPublicationIdentityRow(initial, identity)) throw new Error("GitHub publication identity changed.");
			activeIdentity = identity;
			assertAuthority();
			return identity;
		};
		let identity = await refreshIdentity();
		const repositoryTarget = resolveGitHubRepositoryTarget(parseJsonObject(await step(async () => await requirePublicationCommand([
			"gh",
			"api",
			"--hostname",
			"github.com",
			`repos/${pushRepository}`,
			"--jq",
			"{fork, default_branch, parent: {name: .parent.name, default_branch: .parent.default_branch, owner: {login: .parent.owner.login}}}"
		], { env: identity.env })), "GitHub repository lookup"), {
			owner: remote.owner,
			repo: remote.repo
		});
		if (!repositoryTarget) throw new Error("GitHub repository response omitted its publication target.");
		const repository = `${repositoryTarget.pullRequest.owner}/${repositoryTarget.pullRequest.repo}`;
		const baseBranch = repositoryTarget.fork ? repositoryTarget.pullRequest.defaultBranch : parseGitHubPublicationBaseBranch(worktree.baseRef, repositoryTarget.pullRequest.defaultBranch);
		if (!repositoryTarget.fork && branch === baseBranch) throw new Error("GitHub publication branch changed to its pull request base.");
		const remoteBaseResult = await step(async () => await runPublicationCommand(githubPublicationBaseLookupArgs(repository, baseBranch), { env: identity.env }));
		if (remoteBaseResult.code !== 0) throw new Error("GitHub publication workspace base branch could not be verified.");
		const remoteBaseSha = parseGitHubPublicationBaseRef(remoteBaseResult.stdout.toString("utf8"), baseBranch);
		await step(async () => await assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
		identity = await refreshIdentity();
		const baseTransportEnv = {
			...identity.env,
			GIT_CONFIG_GLOBAL: os.devNull,
			GIT_CONFIG_SYSTEM: os.devNull
		};
		if ((await step(async () => await runPublicationCommand(githubPublicationBaseFetchArgs(repository, remoteBaseSha), {
			cwd: worktree.path,
			env: baseTransportEnv
		}))).code !== 0) throw new Error("GitHub publication workspace base could not be materialized.");
		const creation = await step(async () => await runPublicationCommand(githubPublicationBranchCreationArgs(branch), { cwd: worktree.path }));
		const creationBase = creation.stdout.toString("utf8").trim().split(/\r?\n/u).at(-1) ?? "";
		if (creation.code !== 0 || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(creationBase)) throw new Error("GitHub publication workspace creation base could not be verified.");
		const creationOwnsRemote = await step(async () => await runPublicationCommand(githubPublicationBaseLineageArgs(creationBase, remoteBaseSha), { cwd: worktree.path }));
		const creationOwnsSource = await step(async () => await runPublicationCommand(githubPublicationBaseLineageArgs(creationBase, sourceHeadCommit), { cwd: worktree.path }));
		if (creationOwnsRemote.code !== 0 || creationOwnsSource.code !== 0) throw new Error("GitHub publication workspace base lineage could not be verified.");
		if (await step(async () => await requirePublicationCommand([
			"git",
			"rev-parse",
			`${remoteBaseSha}^{tree}`
		], { cwd: worktree.path })) === workspaceTree) throw new Error("GitHub publication has no changes to publish.");
		const marker = `${PUBLICATION_MARKER}: ${row.request_id}`;
		const pullRequestMarker = `<!-- openclaw-publication:${row.request_id} -->`;
		const loadOpenPullRequests = async () => {
			const lookupIdentity = await refreshIdentity();
			const candidates = parseGitHubPublicationPullRequests(await requirePublicationCommand(githubPublicationPullRequestLookupArgs({
				repository,
				owner: repositoryTarget.push.owner,
				branch,
				baseBranch
			}), { env: lookupIdentity.env }));
			return {
				accountId: lookupIdentity.account.accountId,
				candidates
			};
		};
		const initialPullRequests = await step(loadOpenPullRequests);
		const occupiedPullRequest = initialPullRequests.candidates.find((candidate) => candidate.state === "open" && candidate.headRef === branch && candidate.baseRef === baseBranch);
		if (occupiedPullRequest && occupiedPullRequest.userId !== initialPullRequests.accountId) throw new Error("GitHub pull request is owned by another account.");
		row = params.updatePublishingFacts({
			row,
			repository,
			branch,
			baseBranch,
			sourceHeadCommit,
			workspaceTree,
			headCommit
		});
		const markerPresent = (await step(async () => await requirePublicationCommand([
			"git",
			"show",
			"-s",
			"--format=%B",
			"HEAD"
		], { cwd: worktree.path }))).split(/\r?\n/u).includes(marker);
		const currentTree = await step(async () => await requirePublicationCommand([
			"git",
			"rev-parse",
			"HEAD^{tree}"
		], { cwd: worktree.path }));
		const config = currentGitHubPublicationConfig();
		const attribution = resolveGitCoauthorAttribution({
			agentId: row.agent_id,
			config,
			excludeAccountId: identity.account.accountId,
			sessionKey: row.session_key,
			storePath: loaded.storePath
		});
		const contributorCredit = attribution?.logins.map((login) => `- @${login}`).join("\n");
		const previousBranchHead = headCommit;
		let updateBranchRef;
		if (markerPresent) {
			if (await step(async () => await requirePublicationCommand([
				"git",
				"rev-parse",
				"HEAD^"
			], { cwd: worktree.path })) !== sourceHeadCommit || currentTree !== workspaceTree) throw new Error("GitHub publication workspace changed after its accepted snapshot.");
		} else {
			if (headCommit !== sourceHeadCommit) throw new Error("GitHub publication workspace changed after its accepted snapshot.");
			await step(async () => {
				await requirePublicationCommand([
					"git",
					"cat-file",
					"-e",
					`${workspaceTree}^{tree}`
				], { cwd: worktree.path });
			});
			const title = row.title?.trim() || `Publish ${branch}`;
			const message = appendGitHubPublicationMessage(contributorCredit ? `${title}\n\nWorked on by:\n${contributorCredit}` : title, [...attribution?.trailers ?? [], marker]);
			const timestamp = new Date(row.created_at_ms).toISOString();
			identity = await refreshIdentity();
			const authorEnv = {
				...identity.env,
				GIT_AUTHOR_NAME: identity.account.login,
				GIT_COMMITTER_NAME: identity.account.login,
				GIT_AUTHOR_EMAIL: `${identity.account.accountId}+${identity.account.login}@users.noreply.github.com`,
				GIT_COMMITTER_EMAIL: `${identity.account.accountId}+${identity.account.login}@users.noreply.github.com`,
				GIT_AUTHOR_DATE: timestamp,
				GIT_COMMITTER_DATE: timestamp
			};
			const commit = await step(async () => await requirePublicationCommand([
				"git",
				"commit-tree",
				"--no-gpg-sign",
				workspaceTree,
				"-p",
				headCommit
			], {
				cwd: worktree.path,
				env: authorEnv,
				input: `${message}\n`
			}));
			await assertGitHubPublicationBranchRef(branch, async (argv) => {
				return (await step(async () => await runPublicationCommand(argv, { cwd: worktree.path }))).code ?? -1;
			});
			const previousHead = headCommit;
			updateBranchRef = async () => {
				assertGitHubPublicationRefCasCompleted(await runPublicationCommand(githubPublicationUpdateRefArgs(branch, commit, previousHead), { cwd: worktree.path }));
			};
			headCommit = commit;
		}
		await updateGitHubPublicationBranchAndIndex({
			cwd: worktree.path,
			requestId: row.request_id,
			branch,
			previousHead: previousBranchHead,
			sourceIndexTree,
			workspaceTree,
			headCommit,
			env: identity.env,
			assertCurrent: assertAuthority,
			run: async (argv, options) => await step(async () => await requirePublicationCommand(argv, options)),
			...updateBranchRef ? { updateRef: updateBranchRef } : {}
		});
		row = params.updatePublishingFacts({
			row,
			repository,
			branch,
			baseBranch,
			sourceHeadCommit,
			workspaceTree,
			headCommit
		});
		await step(async () => await assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
		const httpsRemote = `https://github.com/${pushRepository}.git`;
		identity = await refreshIdentity();
		let transportEnv = {
			...identity.env,
			GIT_CONFIG_GLOBAL: os.devNull,
			GIT_CONFIG_SYSTEM: os.devNull
		};
		const pushArgs = githubPublicationPushArgs(httpsRemote, headCommit, branch);
		const observeRemoteHead = async () => {
			return (await requirePublicationCommand(githubPublicationRemoteHeadArgs(httpsRemote, branch), {
				cwd: worktree.path,
				env: transportEnv
			})).split(/\s+/u)[0] ?? "";
		};
		let remoteHead = await step(observeRemoteHead);
		if (remoteHead !== headCommit) {
			const pushed = await step(async () => await runPublicationCommand(pushArgs, {
				cwd: worktree.path,
				env: transportEnv
			}));
			identity = await refreshIdentity();
			transportEnv = {
				...identity.env,
				GIT_CONFIG_GLOBAL: os.devNull,
				GIT_CONFIG_SYSTEM: os.devNull
			};
			remoteHead = await step(observeRemoteHead);
			if (remoteHead !== headCommit) throw new Error(pushed.code === 0 ? "GitHub push verification failed." : "GitHub push was rejected.");
		}
		const findPullRequest = async () => {
			const pullRequests = await loadOpenPullRequests();
			return resolveGitHubPublicationPullRequestUrl(pullRequests.candidates, {
				accountId: pullRequests.accountId,
				headCommit,
				branch,
				baseBranch,
				marker: pullRequestMarker
			});
		};
		let pullRequestUrl = await step(findPullRequest);
		if (!pullRequestUrl) {
			const sessionUrl = resolveControlUiSessionUrl(config, {
				sessionKey: row.session_key,
				fallbackAgentId: row.agent_id,
				exactKey: true
			});
			const body = `${(row.body?.trim() || "Published by the Gateway after authoritative workspace reconciliation.").replace(/(?:\s*---\s*\n\[View the OpenClaw team session\]\([^\r\n)]*\)\s*)+$/u, "").replace(/(?:^|\n\n)## Worked on by\n\n(?:- @[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\n)*- @[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})(?=\n\n|$)/gu, "").trimEnd()}${contributorCredit ? `\n\n## Worked on by\n\n${contributorCredit}` : ""}\n\n${pullRequestMarker}${sessionUrl?.startsWith("https://") ? `\n\n---\n[View the OpenClaw team session](${sessionUrl})` : ""}`;
			identity = await refreshIdentity();
			const created = await step(async () => await runPublicationCommand(githubPublicationCreatePullRequestArgs(repository), {
				env: identity.env,
				input: JSON.stringify({
					title: row.title?.trim() || `Publish ${branch}`,
					body,
					head: `${repositoryTarget.push.owner}:${branch}`,
					base: baseBranch,
					draft: true
				})
			}));
			if (created.code === 0) pullRequestUrl = readNonBlankString(parseJsonObject(created.stdout.toString("utf8"), "GitHub pull request creation").html_url);
			pullRequestUrl ??= await step(findPullRequest);
		}
		if (!pullRequestUrl) throw new Error("GitHub pull request creation was rejected.");
		return params.projectResult(params.complete(row, {
			requestId: row.request_id,
			status: "published",
			url: pullRequestUrl,
			repository,
			branch,
			headCommit
		}));
	} catch (error) {
		if (error instanceof GitHubPublicationRecoveryPendingError) throw error;
		if (error instanceof GitHubPublicationAuthorityLostError && params.defer) return params.projectResult(params.defer(initial));
		const failure = resolveGitHubPublicationFailure(error);
		const result = params.projectResult(params.complete(initial, {
			requestId: initial.request_id,
			status: "failed",
			code: failure.code,
			message: "GitHub publication failed.",
			nextAction: failure.nextAction
		}));
		if (error instanceof SessionMutationAuthorizationChangedError) throw error;
		return result;
	}
}
//#endregion
//#region src/gateway/github-publication-store.ts
const PUBLICATION_FAILURE_CODES = /* @__PURE__ */ new Set([
	"identity_changed",
	"identity_unavailable",
	"session_changed",
	"workspace_changed",
	"not_git",
	"not_github",
	"no_changes",
	"push_rejected",
	"github_rejected",
	"unavailable"
]);
function publicationFailureCode(value) {
	return PUBLICATION_FAILURE_CODES.has(value) ? value : "unavailable";
}
const githubPublicationDatabase = (db) => getNodeSqliteKysely(db);
function ensureGitHubPublicationStore() {
	ensureGitHubPublicationSchema(openOpenClawStateDatabase().db);
}
function hasGitHubPublicationStore() {
	return tableExists(openOpenClawStateDatabase().db, "github_publication_requests");
}
function claimGitHubPublicationExecution(requestId, gatewayInstanceId) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const query = githubPublicationDatabase(db);
		const current = executeSqliteQuerySync(db, query.selectFrom("github_publication_requests").selectAll().where("request_id", "=", requestId)).rows[0];
		if (!current) throw new Error("GitHub publication request disappeared.");
		if (current.status === "published" || current.status === "failed") return current;
		let update = query.updateTable("github_publication_requests").set({
			status: "publishing",
			gateway_instance_id: gatewayInstanceId,
			updated_at_ms: Date.now()
		}).where("request_id", "=", current.request_id).where("status", "=", current.status);
		update = current.gateway_instance_id ? update.where("gateway_instance_id", "=", current.gateway_instance_id) : update.where("gateway_instance_id", "is", null);
		if (executeSqliteQuerySync(db, update).numAffectedRows !== 1n) throw new Error("GitHub publication execution ownership changed.");
		return executeSqliteQuerySync(db, query.selectFrom("github_publication_requests").selectAll().where("request_id", "=", requestId)).rows[0];
	}, void 0, { operationLabel: "github-publication.claim" });
}
function deferGitHubPublicationRequests(requestIds) {
	if (requestIds.length === 0) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		const query = githubPublicationDatabase(db);
		const updatedAtMs = Date.now();
		for (const requestId of requestIds) executeSqliteQuerySync(db, query.updateTable("github_publication_requests").set({
			claim_id: null,
			run_id: null,
			environment_id: null,
			owner_epoch: null,
			placement_generation: null,
			status: "requested",
			gateway_instance_id: null,
			updated_at_ms: updatedAtMs
		}).where("request_id", "=", requestId).where("status", "in", ["requested", "publishing"]));
	}, void 0, { operationLabel: "github-publication.defer" });
}
function isGitHubPublicationExecutionOwner(requestId, gatewayInstanceId) {
	ensureGitHubPublicationStore();
	const db = openOpenClawStateDatabase().db;
	const row = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").select(["status", "gateway_instance_id"]).where("request_id", "=", requestId)).rows[0];
	return row?.status === "publishing" && row.gateway_instance_id === gatewayInstanceId;
}
function digestGitHubPublicationRequest(params) {
	return createHash("sha256").update(JSON.stringify({
		sessionId: params.sessionId,
		idempotencyKey: params.idempotencyKey,
		title: params.title ?? null,
		body: params.body ?? null
	})).digest("hex");
}
function projectGitHubPublicationResult(row) {
	if (row.status === "published" && row.pull_request_url && row.repository && row.branch) return {
		requestId: row.request_id,
		status: "published",
		url: row.pull_request_url,
		repository: row.repository,
		branch: row.branch,
		headCommit: row.head_commit ?? "unknown"
	};
	if (row.status === "failed" && row.error_code && row.next_action) return {
		requestId: row.request_id,
		status: "failed",
		code: publicationFailureCode(row.error_code),
		message: "GitHub publication failed.",
		nextAction: row.next_action
	};
	return {
		requestId: row.request_id,
		status: row.status === "publishing" ? "publishing" : "requested",
		message: row.status === "publishing" ? "The Gateway is publishing the reconciled workspace." : "Publication was accepted. Finish the turn so the Gateway can reconcile and publish the workspace."
	};
}
//#endregion
//#region src/gateway/github-publication-coordinator-methods.ts
function exactClaimForPlacement(placement) {
	const claim = placement.turnClaim;
	if (!claim) return;
	if (claim.owner === "worker") {
		if (placement.state !== "active" && placement.state !== "draining" || !placement.environmentId || placement.activeOwnerEpoch !== claim.ownerEpoch) return;
		return {
			sessionId: placement.sessionId,
			claimId: claim.claimId,
			runId: claim.runId,
			placementGeneration: claim.generation,
			owner: {
				kind: "worker",
				environmentId: placement.environmentId,
				ownerEpoch: claim.ownerEpoch
			}
		};
	}
	return {
		sessionId: placement.sessionId,
		claimId: claim.claimId,
		runId: claim.runId,
		placementGeneration: claim.generation,
		owner: {
			kind: "local",
			...placement.environmentId ? { environmentId: placement.environmentId } : {},
			...placement.activeOwnerEpoch !== null ? { ownerEpoch: placement.activeOwnerEpoch } : {}
		}
	};
}
function createGitHubPublicationCoordinatorMethods(params) {
	const { readById, requestForClaim, sameWorktree, processRow } = params;
	return {
		async requestForSession(input) {
			ensureGitHubPublicationStore();
			if (!input.sessionKey) throw new Error("GitHub publication requires an authoritative session.");
			input.assertCurrent?.();
			const sessionId = loadGatewaySessionEntryReadOnly(input.sessionKey, { agentId: input.agentId }).entry?.sessionId;
			if (!sessionId) throw new Error("GitHub publication session changed.");
			const loaded = resolveGitHubPublicationWorktreeOwner({
				sessionId,
				sessionKey: input.sessionKey,
				agentId: input.agentId
			}).loaded;
			const placement = params.placements.get(sessionId);
			const capturePlacement = placement ? {
				state: placement.state,
				generation: placement.generation,
				updatedAtMs: placement.updatedAtMs
			} : null;
			const assertCaptureAuthority = () => {
				input.assertCurrent?.();
				const current = params.placements.get(sessionId);
				if (!(capturePlacement ? current?.state === capturePlacement.state && current.generation === capturePlacement.generation && current.updatedAtMs === capturePlacement.updatedAtMs && !current.turnClaim : current === void 0)) throw new Error("GitHub publication session authority changed during snapshot.");
			};
			const claim = placement ? exactClaimForPlacement(placement) : void 0;
			if (claim && input.expectedRunId && claim.runId === input.expectedRunId) {
				const accepted = await requestForClaim({
					claim,
					sessionKey: loaded.canonicalKey,
					agentId: input.agentId,
					idempotencyKey: input.idempotencyKey,
					...input.title ? { title: input.title } : {},
					...input.body ? { body: input.body } : {},
					...input.assertCurrent ? { assertCurrent: input.assertCurrent } : {}
				});
				input.assertCurrent?.();
				if (placement?.state !== "local") return accepted;
				const row = readById(accepted.requestId);
				if (!row) throw new Error("GitHub publication request disappeared.");
				return await processRow(row, () => {
					input.assertCurrent?.();
					return params.placements.validateTurnClaim(claim);
				});
			}
			if (claim && placement?.state === "local") throw new Error(input.expectedRunId ? "GitHub publication run identity changed." : "GitHub publication cannot join another active session turn.");
			const deferred = placement !== void 0 && placement.state !== "local";
			const { worktree } = resolveGitHubPublicationWorktreeOwner({
				sessionId,
				sessionKey: loaded.canonicalKey,
				agentId: input.agentId
			});
			const requestDigest = digestGitHubPublicationRequest({
				sessionId,
				idempotencyKey: input.idempotencyKey,
				title: input.title,
				body: input.body
			});
			const database = openOpenClawStateDatabase().db;
			const existing = executeSqliteQuerySync(database, githubPublicationDatabase(database).selectFrom("github_publication_requests").selectAll().where("session_id", "=", sessionId).where("idempotency_key", "=", input.idempotencyKey)).rows[0];
			if (existing) {
				if (existing.request_digest !== requestDigest || !sameWorktree(existing, worktree)) throw new Error("GitHub publication idempotency key was reused.");
				if (existing.status === "published" || existing.status === "failed") return projectGitHubPublicationResult(existing);
			}
			input.assertCurrent?.();
			const identity = await prepareCurrentGitHubPublicationIdentity(input.agentId);
			input.assertCurrent?.();
			const insertSessionRequest = (snapshot) => {
				const now = Date.now();
				const requestId = randomUUID();
				input.assertCurrent?.();
				return runOpenClawStateWriteTransaction(({ db }) => {
					const query = githubPublicationDatabase(db);
					executeSqliteQuerySync(db, query.insertInto("github_publication_requests").values({
						request_id: requestId,
						idempotency_key: input.idempotencyKey,
						request_digest: requestDigest,
						session_id: sessionId,
						session_key: loaded.canonicalKey,
						agent_id: input.agentId,
						worktree_id: worktree.id,
						repository_fingerprint: worktree.repoFingerprint,
						claim_id: null,
						run_id: null,
						environment_id: null,
						owner_epoch: null,
						placement_generation: null,
						identity_source: identity.source,
						identity_profile_id: identity.profileId ?? null,
						identity_account_id: identity.account.accountId,
						identity_login: identity.account.login,
						title: input.title ?? null,
						body: input.body ?? null,
						status: "requested",
						gateway_instance_id: null,
						repository: null,
						branch: worktree.branch,
						base_branch: null,
						source_head_commit: snapshot?.sourceHeadCommit ?? null,
						source_index_tree: snapshot?.sourceIndexTree ?? null,
						workspace_tree: snapshot?.workspaceTree ?? null,
						head_commit: null,
						pull_request_url: null,
						error_code: null,
						next_action: null,
						created_at_ms: now,
						updated_at_ms: now,
						reported_at_ms: null
					}).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doNothing()));
					const stored = executeSqliteQuerySync(db, query.selectFrom("github_publication_requests").selectAll().where("session_id", "=", sessionId).where("idempotency_key", "=", input.idempotencyKey)).rows[0];
					if (!stored || stored.request_digest !== requestDigest || !matchesGitHubPublicationIdentityRow(stored, identity) || !sameWorktree(stored, worktree)) throw new Error("GitHub publication idempotency key was reused.");
					return stored;
				}, void 0, { operationLabel: "github-publication.request-session" });
			};
			if (deferred) {
				resolveGitHubPublicationWorktreeOwner({
					sessionId,
					sessionKey: loaded.canonicalKey,
					agentId: input.agentId,
					expected: {
						worktreeId: worktree.id,
						repositoryFingerprint: worktree.repoFingerprint,
						branch: worktree.branch
					}
				});
				return projectGitHubPublicationResult(insertSessionRequest());
			}
			const current = params.placements.get(sessionId);
			if (current && current.state !== "local" || current?.turnClaim) throw new Error("GitHub publication session authority changed after verification.");
			const snapshot = existing?.source_head_commit && existing.source_index_tree && existing.workspace_tree ? {
				sourceHeadCommit: existing.source_head_commit,
				sourceIndexTree: existing.source_index_tree,
				workspaceTree: existing.workspace_tree
			} : await captureGitHubPublicationWorkspaceSnapshot({
				cwd: worktree.path,
				assertCurrent: assertCaptureAuthority
			});
			assertCaptureAuthority();
			resolveGitHubPublicationWorktreeOwner({
				sessionId,
				sessionKey: loaded.canonicalKey,
				agentId: input.agentId,
				expected: {
					worktreeId: worktree.id,
					repositoryFingerprint: worktree.repoFingerprint,
					branch: worktree.branch
				}
			});
			const row = insertSessionRequest(snapshot);
			return await processRow(row, () => {
				input.assertCurrent?.();
				const latest = params.placements.get(sessionId);
				return (!latest || latest.state === "local") && !latest?.turnClaim;
			});
		},
		async resumeSessionRequests() {
			if (!hasGitHubPublicationStore()) return;
			const db = openOpenClawStateDatabase().db;
			const rows = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("claim_id", "is", null).where("status", "in", ["requested", "publishing"]).orderBy("created_at_ms")).rows;
			const pending = new Set(params.placements.listPendingWorkspaceResults().map((result) => result.sessionId));
			for (const row of rows) {
				if (pending.has(row.session_id) || params.placements.get(row.session_id)?.turnClaim) continue;
				await processRow(row, () => {
					return !params.placements.get(row.session_id)?.turnClaim && !pending.has(row.session_id);
				});
			}
		},
		async processClaim(claim) {
			ensureGitHubPublicationStore();
			const db = openOpenClawStateDatabase().db;
			const rows = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId).orderBy("created_at_ms")).rows;
			deferGitHubPublicationRequests(rows.filter((row) => !row.source_head_commit || !row.source_index_tree || !row.workspace_tree).map((row) => row.request_id));
			const results = [];
			for (const row of rows) {
				if (!row.source_head_commit || !row.source_index_tree || !row.workspace_tree) continue;
				results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			}
			const deferred = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "is", null).where("status", "=", "requested").orderBy("created_at_ms")).rows;
			for (const row of deferred) results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			return results;
		},
		deferOrphanedRequests() {
			if (!hasGitHubPublicationStore()) return;
			const pending = new Set(params.placements.listPendingWorkspaceResults().map((row) => `${row.sessionId}\0${row.claimId}\0${row.runId}`));
			const db = openOpenClawStateDatabase().db;
			deferGitHubPublicationRequests(executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("status", "in", ["requested", "publishing"]).orderBy("created_at_ms")).rows.filter((row) => {
				if (row.claim_id === null) return false;
				const ownerKey = `${row.session_id}\0${row.claim_id}\0${row.run_id}`;
				const liveClaim = params.placements.get(row.session_id)?.turnClaim;
				const stillLive = liveClaim?.claimId === row.claim_id && liveClaim.runId === row.run_id && liveClaim.generation === row.placement_generation;
				return !pending.has(ownerKey) && !stillLive;
			}).map((row) => row.request_id));
		},
		listUnreportedResults() {
			if (!hasGitHubPublicationStore()) return [];
			const db = openOpenClawStateDatabase().db;
			return executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("status", "in", ["published", "failed"]).where("reported_at_ms", "is", null).orderBy("updated_at_ms")).rows.map((row) => ({
				sessionId: row.session_id,
				sessionKey: row.session_key,
				agentId: row.agent_id,
				result: projectGitHubPublicationResult(row)
			}));
		},
		read(requestId) {
			const row = readById(requestId);
			return row ? projectGitHubPublicationResult(row) : void 0;
		},
		markReported(requestId) {
			ensureGitHubPublicationStore();
			runOpenClawStateWriteTransaction(({ db }) => {
				executeSqliteQuerySync(db, githubPublicationDatabase(db).updateTable("github_publication_requests").set({
					reported_at_ms: Date.now(),
					updated_at_ms: Date.now()
				}).where("request_id", "=", requestId).where("reported_at_ms", "is", null));
			}, void 0, { operationLabel: "github-publication.report" });
		}
	};
}
//#endregion
//#region src/gateway/github-publication.ts
const activePublicationExecutions = /* @__PURE__ */ new Map();
function sameWorktree(row, worktree) {
	return row.worktree_id === worktree.id && row.repository_fingerprint === worktree.repoFingerprint && row.branch === worktree.branch;
}
function sameClaim(row, claim) {
	return row.claim_id === claim.claimId && row.run_id === claim.runId && row.placement_generation === claim.placementGeneration && row.environment_id === (claim.owner.environmentId ?? null) && row.owner_epoch === (claim.owner.ownerEpoch ?? null);
}
function assertStoredClaim(db, request) {
	const row = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("worker_session_placements").select([
		"agent_id",
		"session_key",
		"state",
		"environment_id",
		"active_owner_epoch",
		"turn_claim_owner",
		"turn_claim_id",
		"turn_claim_run_id",
		"turn_claim_generation",
		"turn_claim_owner_epoch"
	]).where("session_id", "=", request.claim.sessionId)).rows[0];
	const ownerMatches = request.claim.owner.kind === "worker" ? row?.turn_claim_owner === "worker" && row.environment_id === request.claim.owner.environmentId && row.active_owner_epoch === request.claim.owner.ownerEpoch && row.turn_claim_owner_epoch === request.claim.owner.ownerEpoch : row?.turn_claim_owner === "local";
	if (!row || row.state !== "active" && row.state !== "draining" && row.state !== "local" || row.agent_id !== request.agentId || row.session_key !== request.sessionKey || row.turn_claim_id !== request.claim.claimId || row.turn_claim_run_id !== request.claim.runId || row.turn_claim_generation !== request.claim.placementGeneration || !ownerMatches) throw new Error("GitHub publication turn authority changed before recording.");
}
function createGitHubPublicationCoordinator(params) {
	const instanceId = params.placements.workspaceResultInstanceId();
	const readById = (requestId) => {
		ensureGitHubPublicationStore();
		const db = openOpenClawStateDatabase().db;
		return executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("request_id", "=", requestId)).rows[0];
	};
	const requestForClaim = async (request) => {
		ensureGitHubPublicationStore();
		request.assertCurrent?.();
		if (!params.placements.validateTurnClaim(request.claim)) throw new Error("GitHub publication lost the live session turn claim.");
		const placement = params.placements.get(request.claim.sessionId);
		if (!placement || placement.sessionKey !== request.sessionKey || placement.agentId !== request.agentId) throw new Error("GitHub publication session identity changed.");
		resolveGitHubPublicationWorktreeOwner({
			sessionId: request.claim.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId
		});
		request.assertCurrent?.();
		const identity = await prepareCurrentGitHubPublicationIdentity(request.agentId);
		request.assertCurrent?.();
		if (!params.placements.validateTurnClaim(request.claim)) throw new Error("GitHub publication lost the live session turn claim after verification.");
		const { worktree } = resolveGitHubPublicationWorktreeOwner({
			sessionId: request.claim.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId
		});
		const requestDigest = digestGitHubPublicationRequest({
			sessionId: request.claim.sessionId,
			idempotencyKey: request.idempotencyKey,
			title: request.title,
			body: request.body
		});
		const now = Date.now();
		const requestId = randomUUID();
		return projectGitHubPublicationResult(runOpenClawStateWriteTransaction(({ db }) => {
			assertStoredClaim(db, request);
			const query = githubPublicationDatabase(db);
			executeSqliteQuerySync(db, query.insertInto("github_publication_requests").values({
				request_id: requestId,
				idempotency_key: request.idempotencyKey,
				request_digest: requestDigest,
				session_id: request.claim.sessionId,
				session_key: request.sessionKey,
				agent_id: request.agentId,
				worktree_id: worktree.id,
				repository_fingerprint: worktree.repoFingerprint,
				claim_id: request.claim.claimId,
				run_id: request.claim.runId,
				environment_id: request.claim.owner.environmentId ?? null,
				owner_epoch: request.claim.owner.ownerEpoch ?? null,
				placement_generation: request.claim.placementGeneration,
				identity_source: identity.source,
				identity_profile_id: identity.profileId ?? null,
				identity_account_id: identity.account.accountId,
				identity_login: identity.account.login,
				title: request.title ?? null,
				body: request.body ?? null,
				status: "requested",
				gateway_instance_id: null,
				repository: null,
				branch: worktree.branch,
				base_branch: null,
				source_head_commit: null,
				source_index_tree: null,
				workspace_tree: null,
				head_commit: null,
				pull_request_url: null,
				error_code: null,
				next_action: null,
				created_at_ms: now,
				updated_at_ms: now,
				reported_at_ms: null
			}).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doNothing()));
			const stored = executeSqliteQuerySync(db, query.selectFrom("github_publication_requests").selectAll().where("session_id", "=", request.claim.sessionId).where("idempotency_key", "=", request.idempotencyKey)).rows[0];
			if (!stored || stored.request_digest !== requestDigest || !sameClaim(stored, request.claim) || !matchesGitHubPublicationIdentityRow(stored, identity) || !sameWorktree(stored, worktree)) throw new Error("GitHub publication idempotency key was reused.");
			return stored;
		}, void 0, { operationLabel: "github-publication.request" }));
	};
	const bindWorkspaceSnapshot = (input) => runOpenClawStateWriteTransaction(({ db }) => {
		const query = githubPublicationDatabase(db);
		if (executeSqliteQuerySync(db, query.updateTable("github_publication_requests").set({
			source_head_commit: input.sourceHeadCommit,
			source_index_tree: input.sourceIndexTree,
			workspace_tree: input.workspaceTree,
			updated_at_ms: Date.now()
		}).where("request_id", "=", input.row.request_id).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId).where("source_head_commit", "is", null).where("source_index_tree", "is", null).where("workspace_tree", "is", null)).numAffectedRows !== 1n) throw new Error("GitHub publication workspace snapshot changed before execution.");
		return executeSqliteQuerySync(db, query.selectFrom("github_publication_requests").selectAll().where("request_id", "=", input.row.request_id)).rows[0];
	}, void 0, { operationLabel: "github-publication.bind-workspace" });
	const bindAcceptedClaimSnapshot = (input) => runOpenClawStateWriteTransaction(({ db }) => {
		assertStoredClaim(db, {
			claim: input.claim,
			sessionKey: input.row.session_key,
			agentId: input.row.agent_id
		});
		const query = githubPublicationDatabase(db);
		const current = executeSqliteQuerySync(db, query.selectFrom("github_publication_requests").selectAll().where("request_id", "=", input.row.request_id)).rows[0];
		if (!current || current.claim_id !== input.claim.claimId || current.run_id !== input.claim.runId || current.status !== "requested" && current.status !== "publishing") throw new Error("GitHub publication workspace snapshot owner changed.");
		if (current.source_head_commit || current.source_index_tree || current.workspace_tree) {
			if (current.source_head_commit !== input.sourceHeadCommit || current.source_index_tree !== input.sourceIndexTree || current.workspace_tree !== input.workspaceTree) throw new Error("GitHub publication accepted workspace snapshot changed.");
			return current;
		}
		if (executeSqliteQuerySync(db, query.updateTable("github_publication_requests").set({
			source_head_commit: input.sourceHeadCommit,
			source_index_tree: input.sourceIndexTree,
			workspace_tree: input.workspaceTree,
			updated_at_ms: Date.now()
		}).where("request_id", "=", input.row.request_id).where("source_head_commit", "is", null).where("source_index_tree", "is", null).where("workspace_tree", "is", null)).numAffectedRows !== 1n) throw new Error("GitHub publication accepted workspace snapshot changed.");
		return executeSqliteQuerySync(db, query.selectFrom("github_publication_requests").selectAll().where("request_id", "=", input.row.request_id)).rows[0];
	}, void 0, { operationLabel: "github-publication.bind-accepted-workspace" });
	const updatePublishingFacts = (input) => runOpenClawStateWriteTransaction(({ db }) => {
		if (executeSqliteQuerySync(db, githubPublicationDatabase(db).updateTable("github_publication_requests").set({
			repository: input.repository,
			branch: input.branch,
			base_branch: input.baseBranch,
			source_head_commit: input.sourceHeadCommit,
			workspace_tree: input.workspaceTree,
			head_commit: input.headCommit,
			updated_at_ms: Date.now()
		}).where("request_id", "=", input.row.request_id).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId)).numAffectedRows !== 1n) throw new Error("GitHub publication state changed before execution.");
		return executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("request_id", "=", input.row.request_id)).rows[0];
	}, void 0, { operationLabel: "github-publication.begin" });
	const complete = (row, result) => runOpenClawStateWriteTransaction(({ db }) => {
		const values = result.status === "published" ? {
			status: "published",
			pull_request_url: result.url,
			repository: result.repository,
			branch: result.branch,
			head_commit: result.headCommit,
			error_code: null,
			next_action: null
		} : result.status === "failed" ? {
			status: "failed",
			pull_request_url: null,
			error_code: result.code,
			next_action: result.nextAction
		} : void 0;
		if (!values) throw new Error("GitHub publication terminal result is invalid.");
		if (executeSqliteQuerySync(db, githubPublicationDatabase(db).updateTable("github_publication_requests").set({
			...values,
			updated_at_ms: Date.now()
		}).where("request_id", "=", row.request_id).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId)).numAffectedRows !== 1n) throw new Error("GitHub publication state changed before completion.");
		return executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("request_id", "=", row.request_id)).rows[0];
	}, void 0, { operationLabel: "github-publication.complete" });
	const processRow = (initial, validateAuthority) => {
		if (initial.status === "published" || initial.status === "failed") return Promise.resolve(projectGitHubPublicationResult(initial));
		const executionKey = `${instanceId}\0${initial.request_id}`;
		const current = activePublicationExecutions.get(executionKey);
		if (current) return current;
		const claimed = claimGitHubPublicationExecution(initial.request_id, instanceId);
		if (claimed.status === "published" || claimed.status === "failed") return Promise.resolve(projectGitHubPublicationResult(claimed));
		const operation = executeGitHubPublication({
			initial: claimed,
			validateAuthority: () => validateAuthority() && isGitHubPublicationExecutionOwner(claimed.request_id, instanceId),
			projectResult: projectGitHubPublicationResult,
			bindWorkspaceSnapshot,
			updatePublishingFacts,
			complete,
			defer: (row) => {
				deferGitHubPublicationRequests([row.request_id]);
				const deferred = readById(row.request_id);
				if (!deferred) throw new Error("GitHub publication request disappeared.");
				return deferred;
			}
		});
		activePublicationExecutions.set(executionKey, operation);
		const release = () => {
			if (activePublicationExecutions.get(executionKey) === operation) activePublicationExecutions.delete(executionKey);
		};
		operation.then(release, release);
		return operation;
	};
	const prepareClaimWorkspace = async (claim) => {
		ensureGitHubPublicationStore();
		params.placements.closeWorkerTurnToolAdmission(claim);
		const db = openOpenClawStateDatabase().db;
		const rows = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId).where("status", "in", ["requested", "publishing"]).orderBy("created_at_ms")).rows;
		if (rows.length === 0) return;
		if (!params.placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim before snapshot.");
		const first = rows[0];
		const { worktree } = resolveGitHubPublicationWorktreeOwner({
			sessionId: first.session_id,
			sessionKey: first.session_key,
			agentId: first.agent_id,
			expected: {
				worktreeId: first.worktree_id,
				repositoryFingerprint: first.repository_fingerprint,
				branch: first.branch
			}
		});
		for (const row of rows) if (!sameWorktree(row, worktree)) throw new Error("GitHub publication worktree changed before accepted snapshot.");
		const bound = rows.find((row) => row.source_head_commit && row.source_index_tree && row.workspace_tree);
		if (bound) {
			for (const row of rows) if ((row.source_head_commit || row.source_index_tree || row.workspace_tree) && (row.source_head_commit !== bound.source_head_commit || row.source_index_tree !== bound.source_index_tree || row.workspace_tree !== bound.workspace_tree)) throw new Error("GitHub publication accepted workspace snapshot changed.");
			if (rows.every((row) => row.source_head_commit && row.source_index_tree && row.workspace_tree)) return;
		}
		const snapshot = await captureGitHubPublicationWorkspaceSnapshot({
			cwd: worktree.path,
			assertCurrent: () => {
				if (!params.placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim during snapshot.");
			}
		});
		for (const row of rows) bindAcceptedClaimSnapshot({
			row,
			claim,
			...snapshot
		});
	};
	const deferClaimPreparation = (claim) => {
		ensureGitHubPublicationStore();
		const db = openOpenClawStateDatabase().db;
		const rows = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId).where("status", "in", ["requested", "publishing"]).orderBy("created_at_ms")).rows;
		deferGitHubPublicationRequests(rows.map((row) => row.request_id));
	};
	return {
		requestForClaim,
		prepareClaimWorkspace,
		deferClaimPreparation,
		...createGitHubPublicationCoordinatorMethods({
			placements: params.placements,
			readById,
			requestForClaim,
			sameWorktree,
			processRow
		})
	};
}
//#endregion
//#region src/gateway/github-publication-runtime.ts
function createGitHubPublicationRuntime(params) {
	const coordinator = createGitHubPublicationCoordinator({ placements: params.placements });
	const report = createGitHubPublicationTranscriptReporter(params.loadSessionRuntime, coordinator);
	const reportDeferred = async (publication) => {
		try {
			await report(publication);
		} catch (error) {
			params.warn(`GitHub publication result reporting deferred for ${publication.sessionId}: ${formatErrorMessage(error)}`);
		}
	};
	const prepareAcceptedWorkspacePublication = async (claim) => {
		try {
			await coordinator.prepareClaimWorkspace(claim);
		} catch {
			coordinator.deferClaimPreparation(claim);
		}
	};
	const publishAcceptedWorkspace = async (claim) => {
		const placement = params.placements.get(claim.sessionId);
		if (!placement) {
			params.warn(`GitHub publication deferred because placement ${claim.sessionId} disappeared.`);
			return;
		}
		let results;
		try {
			results = await coordinator.processClaim(claim);
		} catch (error) {
			params.warn(`GitHub publication deferred for ${claim.sessionId}: ${formatErrorMessage(error)}`);
			throw error;
		}
		for (const result of results) {
			if (result.status !== "published" && result.status !== "failed") continue;
			await reportDeferred({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId,
				result
			});
		}
	};
	const reconcilePublications = async () => {
		try {
			coordinator.deferOrphanedRequests();
			await coordinator.resumeSessionRequests();
		} catch (error) {
			params.warn(`GitHub publication recovery deferred: ${formatErrorMessage(error)}`);
		}
		for (const publication of coordinator.listUnreportedResults()) await reportDeferred(publication);
	};
	return {
		coordinator,
		prepareAcceptedWorkspacePublication,
		publishAcceptedWorkspace,
		reconcilePublications
	};
}
//#endregion
//#region src/gateway/server-worker-placement-change-events.ts
function createGatewayWorkerPlacementChangePublisher(params) {
	const warnPlacementChangeFailure = (error) => {
		try {
			params.warn(`Worker placement session change reporting failed: ${formatErrorMessage(error)}`);
		} catch {}
	};
	const snapshotPlacements = () => new Map(params.placements.list().map((placement) => [placement.sessionId, {
		state: placement.state,
		generation: placement.generation,
		updatedAtMs: placement.updatedAtMs,
		sessionKey: placement.sessionKey,
		agentId: placement.agentId
	}]));
	return async (operation) => {
		let context;
		let before;
		try {
			context = params.getSessionChangeContext?.();
			if (context) before = snapshotPlacements();
		} catch (error) {
			warnPlacementChangeFailure(error);
		}
		if (!context || !before) return await operation();
		try {
			return await operation();
		} finally {
			try {
				const after = snapshotPlacements();
				for (const [sessionId, previous] of before) {
					const current = after.get(sessionId);
					if (current && current.state === previous.state && current.generation === previous.generation && current.updatedAtMs === previous.updatedAtMs && current.sessionKey === previous.sessionKey && current.agentId === previous.agentId) {
						after.delete(sessionId);
						continue;
					}
					if (!current) after.set(sessionId, previous);
				}
				for (const placement of after.values()) try {
					emitSessionsChanged(context, {
						reason: "placement",
						sessionKey: placement.sessionKey,
						agentId: placement.agentId
					});
				} catch (error) {
					warnPlacementChangeFailure(error);
				}
			} catch (error) {
				warnPlacementChangeFailure(error);
			}
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-session-target.ts
var WorkerDispatchTargetChangedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
async function runWorkerPlacementSessionBarrier(params) {
	const target = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
		cfg: params.getConfig(),
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false
	});
	return await runExclusiveSessionLifecycleMutation({
		scope: target.storePath,
		identities: [
			params.sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			params.sessionId
		],
		run: async () => {
			const { config, target: currentTarget, entry, worktree } = resolveWorkerPlacementSessionTarget({
				sessionRuntime: params.sessionRuntime,
				config: params.getConfig(),
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				expectedTarget: target,
				errorMessage: `Session ${params.sessionKey} changed before cloud worker ${params.action}. Retry.`
			});
			if (entry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} was archived before cloud worker ${params.action}. Retry.`);
			const currentRuntime = params.sessionRuntime.resolveWorkerPlacementSessionRuntime({
				cfg: config,
				entry,
				agentId: currentTarget.agentId,
				sessionKey: currentTarget.canonicalKey
			});
			if (params.sessionRuntime.resolveWorkerPlacementExecutionMode(currentRuntime) !== params.executionMode) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} runtime changed to ${currentRuntime} before cloud worker ${params.action}. Retry.`);
			return await params.run(worktree);
		}
	});
}
/** Keep canonical session identity and its live managed worktree in one lifecycle fence. */
function resolveWorkerPlacementSessionTarget(params) {
	const target = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
		cfg: params.config,
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false
	});
	const entry = params.sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	const worktree = params.sessionRuntime.managedWorktrees.findLiveByOwner("session", target.canonicalKey);
	const expected = params.expectedTarget;
	const targetChangedError = () => expected ? new WorkerDispatchTargetChangedError(params.errorMessage) : new Error(params.errorMessage);
	if (expected && (target.storePath !== expected.storePath || target.canonicalKey !== expected.canonicalKey || target.agentId !== expected.agentId)) throw targetChangedError();
	if (!entry || entry.sessionId !== params.sessionId || !entry.worktree?.id) throw targetChangedError();
	if (!worktree || worktree.id !== entry.worktree.id || worktree.ownerId !== target.canonicalKey) throw targetChangedError();
	return {
		config: params.config,
		target,
		entry,
		worktree
	};
}
//#endregion
//#region src/gateway/server-worker-placement-move-barrier.ts
function createGatewayWorkerPlacementMoveBarrier(params) {
	return async ({ sessionId, sessionKey, agentId, sourceDisposition, authorize, begin }) => {
		const sessionRuntime = await params.loadSessionRuntime();
		const target = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: sessionKey,
			agentId,
			clone: false
		});
		const lifecycleIdentities = [
			sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			sessionId
		];
		let begun;
		await runExclusiveSessionLifecycleMutation({
			scope: target.storePath,
			identities: lifecycleIdentities,
			prepare: async () => {
				resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: getRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before placement move. Retry.`
				});
				authorize?.();
				begun = await begin(async (runId) => {
					if (params.persistAbandonedPartial) {
						await params.persistAbandonedPartial({
							sessionId,
							sessionKey,
							agentId,
							runId
						});
						authorize?.();
					}
				});
				clearSessionQueues(lifecycleIdentities);
				params.revokeSessionAuthority({
					sessionId,
					sessionKeys: lifecycleIdentities
				});
				if (sourceDisposition === "abandon") {
					startSessionWorkAdmissionInterruption({
						scope: target.storePath,
						identities: lifecycleIdentities
					});
					return;
				}
				if (!await interruptSessionWorkAdmissions({
					scope: target.storePath,
					identities: lifecycleIdentities,
					timeoutMs: 15e3
				})) throw new Error(`Session ${sessionKey} is still active; placement move interrupted`);
				await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
				await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
			},
			run: async () => {
				if (!begun) throw new Error(`Session ${sessionKey} placement move barrier did not start`);
			}
		});
		if (!begun) throw new Error(`Session ${sessionKey} placement move barrier did not complete`);
		return begun;
	};
}
//#endregion
//#region src/gateway/server-worker-placement-move-destination.ts
function createGatewayWorkerPlacementMoveDestinationResolver(params) {
	return async (identity, moveTarget) => {
		if (moveTarget.kind === "gateway") return;
		const sessionRuntime = await params.loadSessionRuntime();
		const { config, target, entry } = resolveWorkerPlacementSessionTarget({
			sessionRuntime,
			config: params.getConfig(),
			...identity,
			errorMessage: `Session ${identity.sessionKey} changed before placement move recovery.`
		});
		const destination = resolveWorkerPlacementDestination({
			cfg: config,
			...moveTarget.kind === "profile" ? {
				profileId: moveTarget.profileId,
				machineClass: moveTarget.machineClass
			} : { deviceId: moveTarget.deviceId }
		});
		if (!destination.ok || !destination.value) throw new Error(destination.ok ? "worker move target is missing" : destination.error);
		const runtime = sessionRuntime.resolveWorkerPlacementSessionRuntime({
			cfg: config,
			entry,
			agentId: target.agentId,
			sessionKey: target.canonicalKey
		});
		const { executionMode, devicePlacement } = sessionRuntime.resolveWorkerPlacementCapabilities(runtime);
		if (!executionMode) throw new Error(`Runtime ${runtime} lacks cloud placement support`);
		if (moveTarget.kind === "profile") {
			if (!params.environments.supportsExecutionMode(moveTarget.profileId, executionMode)) throw new Error(`worker profile ${moveTarget.profileId} does not support ${executionMode} placement; select a compatible worker provider`);
		} else {
			const eligibility = await resolveDevicePlacementEligibility({
				environmentService: params.environments,
				deviceId: moveTarget.deviceId,
				runtimeId: runtime,
				requirement: devicePlacement,
				config
			});
			if (!eligibility.ok) throw new Error(eligibility.error);
		}
		return {
			executionMode,
			...destination.value,
			...devicePlacement ? { devicePlacement } : {}
		};
	};
}
//#endregion
//#region src/gateway/server-worker-placement-reclaim.ts
function createGatewayWorkerPlacementReclaimBarriers(params) {
	const resolveLifecycleContext = async ({ sessionId, sessionKey, agentId }) => {
		const sessionRuntime = await params.loadSessionRuntime();
		const target = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: sessionKey,
			agentId,
			clone: false
		});
		return {
			sessionRuntime,
			target,
			lifecycleIdentities: [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			]
		};
	};
	const runReclaimBarrier = async ({ sessionId, sessionKey, agentId, authorize, beforeDrain, begin, reclaim }) => {
		const { sessionRuntime, target, lifecycleIdentities } = await resolveLifecycleContext({
			sessionId,
			sessionKey,
			agentId
		});
		let worktreePath;
		let reclaimedPlacement;
		await runExclusiveSessionLifecycleMutation({
			scope: target.storePath,
			identities: lifecycleIdentities,
			prepare: async () => {
				beforeDrain?.();
				const { worktree } = resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: getRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before cloud worker stop. Retry.`
				});
				const placement = params.placements.get(sessionId);
				if (placement?.state !== "active" && placement?.state !== "draining") throw new Error(`Session ${sessionKey} has active work; wait before stopping its cloud worker`);
				worktreePath = worktree.path;
				authorize?.();
				if (!await interruptSessionWorkAdmissions({
					scope: target.storePath,
					identities: lifecycleIdentities,
					timeoutMs: 15e3
				})) throw new Error(`Session ${sessionKey} is still active; cloud worker stop cancelled`);
				await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
				await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
			},
			run: async () => {
				if (!worktreePath) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not prepare`);
				authorize?.();
				beforeDrain?.();
				const drainingPlacement = begin();
				reclaimedPlacement = await reclaim(worktreePath, drainingPlacement, authorize);
				params.revokeSessionAuthority({
					sessionId,
					sessionKeys: lifecycleIdentities
				});
			}
		});
		if (!reclaimedPlacement) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not complete`);
		return reclaimedPlacement;
	};
	const runFailedReclaimBarrier = async ({ sessionId, sessionKey, agentId, authorize, reclaim }) => {
		const { sessionRuntime, target, lifecycleIdentities } = await resolveLifecycleContext({
			sessionId,
			sessionKey,
			agentId
		});
		let reclaimedPlacement;
		await runExclusiveSessionLifecycleMutation({
			scope: target.storePath,
			identities: lifecycleIdentities,
			run: async () => {
				const currentTarget = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
					cfg: getRuntimeConfig(),
					key: sessionKey,
					agentId,
					clone: false
				});
				const currentEntry = sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(currentTarget.store, currentTarget.storeKeys);
				if (currentTarget.storePath !== target.storePath || currentTarget.canonicalKey !== target.canonicalKey || currentTarget.agentId !== target.agentId || currentEntry?.sessionId !== sessionId) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before failed cloud worker cleanup. Retry.`);
				authorize?.();
				reclaimedPlacement = await reclaim(authorize);
			}
		});
		if (!reclaimedPlacement) throw new Error(`Session ${sessionKey} failed cloud worker cleanup did not complete`);
		return reclaimedPlacement;
	};
	return {
		runReclaimBarrier,
		runFailedReclaimBarrier
	};
}
//#endregion
//#region src/gateway/server-worker-placement-reconcile-guard.ts
function installWorkerPlacementReconcileGuard(params) {
	return params.environments.installReconcileEnvironmentGuard(async (environmentId, reconcileEnvironmentCore) => {
		if (params.isStopping()) return;
		const references = params.placements.list().filter((placement) => placement.environmentId === environmentId);
		if (references.length > 1) throw new Error(`Worker environment ${environmentId} has multiple placement owners`);
		const owner = references[0];
		if (owner?.state === "provisioning") {
			await params.dispatch.resumeProvisioning(owner, reconcileEnvironmentCore);
			return;
		}
		const environment = params.environments.get(environmentId);
		if (owner && (environment?.state === "requested" || environment?.state === "provisioning" || environment?.state === "bootstrapping") && (owner.state !== "failed" || owner.turnClaim !== null || owner.activeOwnerEpoch !== null || environment.destroyRequestedAtMs === null)) throw new Error(`Worker environment ${environmentId} provisioning owner is ${owner.state}`);
		await reconcileEnvironmentCore();
	});
}
//#endregion
//#region src/gateway/server-worker-placement-session-evidence.ts
const log = createSubsystemLogger("gateway/placement-session-evidence");
const loadPlacementSessionEvidenceRuntime = createLazyRuntimeModule(async () => {
	const [sessionTargetsReadAvailability, sessionAccessor] = await Promise.all([import("./targets-read-availability-MhsGVjoy.js"), import("./session-accessor-Bk0UAFho.js")]);
	return {
		readSessionIdentityEvidenceBatch: sessionAccessor.readSessionIdentityEvidenceBatch,
		resolveExistingAgentSessionStoreTargetsReadOnlyResult: sessionTargetsReadAvailability.resolveExistingAgentSessionStoreTargetsReadOnlyResult
	};
});
function resolvePlacementSessionIdentities(cfg, placement) {
	const requestedAgentId = normalizeAgentId(placement.agentId);
	const parsedKey = parseAgentSessionKey(placement.sessionKey);
	const canonicalKey = resolveSessionStoreKey({
		cfg,
		sessionKey: placement.sessionKey,
		storeAgentId: requestedAgentId
	});
	const canonicalAgentId = canonicalKey === "global" || canonicalKey === "unknown" || !parsedKey ? requestedAgentId : resolveSessionStoreAgentId(cfg, canonicalKey);
	const canonical = {
		placement,
		agentId: canonicalAgentId,
		sessionKey: canonicalKey
	};
	if (!parsedKey) return [canonical];
	const persistedAgentId = normalizeAgentId(parsedKey.agentId);
	if (persistedAgentId === canonicalAgentId) return [canonical];
	return [canonical, {
		placement,
		agentId: persistedAgentId,
		sessionKey: placement.sessionKey
	}];
}
async function createWorkerPlacementSessionEvidenceResolver(placements) {
	try {
		const cfg = getRuntimeConfig();
		const runtime = await loadPlacementSessionEvidenceRuntime();
		const identities = placements.flatMap((placement) => resolvePlacementSessionIdentities(cfg, placement));
		const targetsReadCache = /* @__PURE__ */ new Map();
		const targetResultsByAgentId = new Map([...new Set(identities.filter((identity) => !isIncognitoSessionKey(identity.sessionKey)).map((identity) => identity.agentId))].map((agentId) => [agentId, runtime.resolveExistingAgentSessionStoreTargetsReadOnlyResult(cfg, agentId, { cache: targetsReadCache })]));
		const prepared = identities.flatMap((identity) => {
			if (isIncognitoSessionKey(identity.sessionKey)) return [{
				identity,
				target: {
					agentId: identity.agentId,
					storePath: resolveIncognitoOpenClawAgentSqlitePath({ agentId: identity.agentId })
				}
			}];
			const targetResult = targetResultsByAgentId.get(identity.agentId);
			return targetResult?.available ? targetResult.targets.map((target) => ({
				identity,
				target
			})) : [];
		});
		const evidence = prepared.length ? runtime.readSessionIdentityEvidenceBatch(prepared.map(({ identity, target }) => ({
			agentId: target.agentId,
			sessionId: identity.placement.sessionId,
			sessionKey: identity.sessionKey,
			storePath: target.storePath
		}))) : [];
		const evidenceByPlacement = new Map(placements.map((placement) => [placement, "absent"]));
		for (const identity of identities) {
			if (isIncognitoSessionKey(identity.sessionKey)) continue;
			const targetResult = targetResultsByAgentId.get(identity.agentId);
			if (!targetResult?.available && targetResult?.reason !== "database-missing") evidenceByPlacement.set(identity.placement, "unknown");
		}
		for (const [index, result] of evidence.entries()) {
			const placement = prepared[index]?.identity.placement;
			if (!placement) continue;
			if ((evidenceByPlacement.get(placement) ?? "unknown") !== "current" && result.status !== "absent") evidenceByPlacement.set(placement, result.status);
		}
		return async (placement) => evidenceByPlacement.get(placement) ?? "unknown";
	} catch (error) {
		log.warn("worker placement session evidence resolution failed; treating all as unknown", { error });
		return async () => "unknown";
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-force-abandon.ts
const FORCED_WORKER_ABANDONMENT_ERROR = "Worker result abandoned by forced operator teardown";
async function tryResolveWorkspacePath(resolveWorkspacePath, placement, onCleanupError) {
	try {
		return await resolveWorkspacePath(placement);
	} catch (error) {
		reportCleanupError(onCleanupError, error);
		return;
	}
}
function reportCleanupError(onCleanupError, error) {
	try {
		onCleanupError?.(error);
	} catch {}
}
async function forceAbandonWorkerEnvironment(params) {
	const { environmentId, placements } = params;
	const recoveryError = FORCED_WORKER_ABANDONMENT_ERROR;
	const journalOwners = params.placements.listWorkspaceReconciliationOwners().filter((owner) => owner.environmentId === environmentId);
	const journalCleanups = [];
	const retainedJournalSessions = /* @__PURE__ */ new Set();
	for (const owner of journalOwners) {
		const placement = placements.get(owner.sessionId);
		const isCurrentOwner = (placement?.state === "active" || placement?.state === "draining") && placement.generation === owner.placementGeneration;
		const isForceFailedOwner = placement?.state === "failed" && placement.recoveryError.startsWith(recoveryError) && placement.generation > owner.placementGeneration;
		if (placement && (isCurrentOwner || isForceFailedOwner) && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch) try {
			const journal = placements.loadWorkspaceReconciliation(owner, isForceFailedOwner ? { allowFailedOwner: true } : void 0);
			if (journal) journalCleanups.push({
				owner,
				placement,
				journal
			});
		} catch (error) {
			reportCleanupError(params.onCleanupError, error);
			retainedJournalSessions.add(owner.sessionId);
		}
	}
	const stagedResultCleanups = [];
	for (const pending of placements.listPendingWorkspaceResults()) if (pending.environmentId === environmentId) {
		const placement = placements.get(pending.sessionId);
		if (isCurrentWorkerWorkspacePendingResultOwner(placement, pending)) {
			const finalRef = pending.stagedResultRef ?? workerWorkspaceResultRef(pending.claimId);
			stagedResultCleanups.push({
				placement,
				refs: [finalRef, preparedWorkerWorkspaceResultRef(finalRef)]
			});
			const claim = placement.turnClaim;
			if (claim && claim.claimId === pending.claimId && claim.runId === pending.runId) await placements.closeWorkerTurnToolState({
				sessionId: placement.sessionId,
				claimId: claim.claimId,
				runId: claim.runId,
				placementGeneration: claim.generation,
				owner: placementTurnOwner(placement)
			});
			placements.failWorkspaceResultAndReleaseTurn(pending, recoveryError);
		} else placements.abandonWorkspaceResult(pending);
	}
	for (const placement of placements.listForReconcile()) {
		if (placement.environmentId !== environmentId) continue;
		let current = placements.get(placement.sessionId);
		if (current?.state === "active") current = placements.startDrain({
			sessionId: current.sessionId,
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch,
			expectedGeneration: current.generation
		});
		if (current?.state === "draining") {
			if (current.turnClaim) await placements.closeWorkerTurnToolState({
				sessionId: current.sessionId,
				claimId: current.turnClaim.claimId,
				runId: current.turnClaim.runId,
				placementGeneration: current.turnClaim.generation,
				owner: placementTurnOwner(current)
			});
			current = placements.startReconcile({
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				expectedGeneration: current.generation,
				forceLocalClaim: true
			});
		}
		if (current && current.state !== "failed") placements.fail({
			sessionId: current.sessionId,
			expectedGeneration: current.generation,
			recoveryError
		});
	}
	for (const cleanup of journalCleanups) {
		if (cleanup.journal.appliedManifestRef) continue;
		try {
			await recoverWorkerWorkspaceReconciliation({
				root: await params.resolveWorkspacePath(cleanup.placement),
				journal: cleanup.journal
			});
		} catch (error) {
			reportCleanupError(params.onCleanupError, error);
			retainedJournalSessions.add(cleanup.owner.sessionId);
		}
	}
	for (const owner of journalOwners) {
		if (retainedJournalSessions.has(owner.sessionId)) continue;
		placements.abortWorkspaceReconciliation(owner, { force: true });
	}
	for (const cleanup of stagedResultCleanups) try {
		const root = await tryResolveWorkspacePath(params.resolveWorkspacePath, cleanup.placement, params.onCleanupError);
		if (!root) continue;
		for (const stagedResultRef of cleanup.refs) if (await hasWorkerWorkspaceResultRef({
			root,
			stagedResultRef
		})) await deleteStagedWorkerWorkspaceResult({
			root,
			stagedResultRef
		});
	} catch (error) {
		reportCleanupError(params.onCleanupError, error);
	}
}
//#endregion
//#region src/gateway/server-worker-placement-workspace-recovery.ts
const workerPlacementLog = createSubsystemLogger("gateway/worker-placement");
async function recoverGatewayWorkerPlacementWorkspaces(params) {
	const orphanedJournals = params.placements.pruneOrphanedWorkspaceReconciliations({ retainFailedOwner: (recoveryError) => recoveryError.startsWith(FORCED_WORKER_ABANDONMENT_ERROR) });
	for (const owner of orphanedJournals) workerPlacementLog.warn(`discarded orphaned cloud workspace journal for ${owner.sessionId}`);
	const pendingBySession = new Map(params.placements.listPendingWorkspaceResults().map((pending) => [pending.sessionId, pending]));
	for (const owner of params.placements.listWorkspaceReconciliationOwners()) try {
		const placement = params.placements.get(owner.sessionId);
		const pending = pendingBySession.get(owner.sessionId);
		const ownsCurrentGeneration = placement?.generation === owner.placementGeneration;
		const ownsDrainedPendingGeneration = placement?.state === "draining" && placement.generation === owner.placementGeneration + 1 && pending?.environmentId === owner.environmentId && pending.ownerEpoch === owner.ownerEpoch && pending.placementGeneration === owner.placementGeneration;
		if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== owner.environmentId || placement.activeOwnerEpoch !== owner.ownerEpoch || !ownsCurrentGeneration && !ownsDrainedPendingGeneration) throw new Error(`Cloud workspace journal has no matching owner: ${owner.sessionId}`);
		const localPath = await params.resolveWorkspacePath({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId
		});
		const journal = params.placements.loadWorkspaceReconciliation(owner);
		if (!journal) continue;
		await recoverWorkerWorkspaceReconciliation({
			root: localPath,
			journal
		});
		params.placements.abortWorkspaceReconciliation(owner);
	} catch (error) {
		workerPlacementLog.error(`cloud workspace recovery deferred for ${owner.sessionId}: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-retain-coordinator.ts
const RETAIN_COMMAND_TIMEOUT_MS = 10 * 6e4;
const TERMINAL_ENVIRONMENT_STATES = /* @__PURE__ */ new Set([
	"destroyed",
	"failed",
	"orphaned"
]);
function nodeEnvironments(options, nodeId) {
	return options.environments.list().filter((environment) => environment.nodeDeviceId === nodeId);
}
function bundleStatusTargetForNode(options, nodeId) {
	return nodeEnvironments(options, nodeId).filter((environment) => environment.bootstrapReceipt !== null && !TERMINAL_ENVIRONMENT_STATES.has(environment.state)).toSorted((left, right) => right.createdAtMs - left.createdAtMs || left.environmentId.localeCompare(right.environmentId))[0]?.bootstrapReceipt;
}
function snapshotBundleHashesForNode(options, nodeId) {
	const environments = nodeEnvironments(options, nodeId);
	const environmentIds = new Set(environments.map((environment) => environment.environmentId));
	return listRetainedWorkerBundleHashes({
		environments,
		placements: options.placements.list().filter((placement) => placement.environmentId !== null && environmentIds.has(placement.environmentId))
	});
}
function snapshotEntriesForNode(options, nodeId) {
	const placements = new Map(options.placements.list().map((placement) => [placement.sessionId, placement]));
	const pendingResults = new Map(options.placements.listPendingWorkspaceResults().map((result) => [result.sessionId, result]));
	return nodeEnvironments(options, nodeId).flatMap((environment) => {
		if (TERMINAL_ENVIRONMENT_STATES.has(environment.state) || environment.nodeDeviceId !== nodeId || environment.attachedSessionIds.length !== 1) return [];
		const sessionId = environment.attachedSessionIds[0];
		const placement = placements.get(sessionId);
		const pending = pendingResults.get(sessionId);
		const unsettled = placement?.turnClaim || pending?.environmentId === environment.environmentId && pending.ownerEpoch === environment.ownerEpoch;
		const exactManifest = (placement?.state === "starting" || placement?.state === "active" || placement?.state === "draining" || placement?.state === "reconciling") && !unsettled && placement.environmentId === environment.environmentId && placement.workspaceBaseManifestRef && (placement.activeOwnerEpoch === environment.ownerEpoch || placement.state === "starting") ? [placement.workspaceBaseManifestRef] : null;
		return [{
			environmentId: environment.environmentId,
			sessionId,
			generation: environment.ownerEpoch,
			manifestRefs: exactManifest
		}];
	}).toSorted((left, right) => left.environmentId.localeCompare(right.environmentId) || left.sessionId.localeCompare(right.sessionId) || left.generation - right.generation);
}
function createNodeWorkspaceRetainCoordinator(options) {
	const controllerId = randomUUID();
	const abortController = new AbortController();
	const pendingNodes = /* @__PURE__ */ new Set();
	const acknowledgedBundleGenerationByNode = /* @__PURE__ */ new Map();
	let transport;
	let sequence = 0;
	let pendingAll = false;
	let operation;
	let started = false;
	let stopped = false;
	const publishSnapshot = async (currentTransport, node) => {
		const retainedBundleHashes = snapshotBundleHashesForNode(options, node.nodeId);
		const bundleRetentionSupported = node.workerHost.bundleRetention === 1;
		const bundleStatusSupported = node.workerHost.bundleStatus === 1;
		const baseInput = {
			version: 1,
			gatewayNamespace: options.gatewayNamespace,
			controllerId,
			sequence: sequence += 1,
			retain: snapshotEntriesForNode(options, node.nodeId)
		};
		const priorGeneration = acknowledgedBundleGenerationByNode.get(node.nodeId);
		const acknowledgedBundleGeneration = priorGeneration?.connId === node.connId ? priorGeneration.generation : void 0;
		const retentionInput = {
			...baseInput,
			bundleHashes: retainedBundleHashes,
			...acknowledgedBundleGeneration !== void 0 ? { acknowledgedBundleGeneration } : {}
		};
		const bundleHashesFit = retainedBundleHashes.length <= 4096 && Buffer.byteLength(JSON.stringify(retentionInput), "utf8") <= 1048576;
		const bundleStatusTarget = bundleStatusSupported ? bundleStatusTargetForNode(options, node.nodeId) : void 0;
		const statusInput = bundleStatusTarget && retainedBundleHashes.includes(bundleStatusTarget.bundleHash) ? {
			...retentionInput,
			bundleStatusHash: bundleStatusTarget.bundleHash
		} : void 0;
		const statusInputFits = statusInput !== void 0 && Buffer.byteLength(JSON.stringify(statusInput), "utf8") <= 1048576;
		const input = bundleRetentionSupported && bundleHashesFit ? statusInput && statusInputFits ? statusInput : retentionInput : baseInput;
		const previousBundleStatus = currentTransport.getBundleStatus?.(node.nodeId);
		if (!input.bundleStatusHash || previousBundleStatus && previousBundleStatus.bundleHash !== input.bundleStatusHash) currentTransport.acceptBundleStatus?.(node, void 0);
		if (bundleRetentionSupported && !bundleHashesFit) options.warn(`Node bundle retention skipped (${node.nodeId}): ${retainedBundleHashes.length} retained hashes exceed the bounded maintenance request`);
		for (;;) {
			const result = await currentTransport.invoke({
				node,
				command: NODE_WORKER_WORKSPACE_RETAIN_COMMAND,
				params: input,
				timeoutMs: RETAIN_COMMAND_TIMEOUT_MS,
				signal: abortController.signal,
				isDispatchAuthorized: () => !stopped && transport === currentTransport
			});
			if (!result.ok) throw new Error(result.error?.message ?? `workspace retain command failed (${result.error?.code ?? "unknown"})`);
			let payload;
			try {
				payload = result.payloadJSON ? JSON.parse(result.payloadJSON) : void 0;
			} catch {
				throw new Error("workspace retain command returned malformed JSON");
			}
			const retained = parseNodeWorkerWorkspaceRetainResult(payload);
			if (!retained) throw new Error("workspace retain command violated its private result contract");
			if (retained.applied && retained.bundleGeneration !== void 0) acknowledgedBundleGenerationByNode.set(node.nodeId, {
				connId: node.connId,
				generation: retained.bundleGeneration
			});
			if (!retained.applied || !retained.hasMore) {
				const bundleStatus = retained.bundleStatus;
				const requestedBundleHash = input.bundleStatusHash;
				const currentStatusTarget = requestedBundleHash ? bundleStatusTargetForNode(options, node.nodeId) : void 0;
				const statusTargetMatches = currentStatusTarget != null && requestedBundleHash !== void 0 && currentStatusTarget.bundleHash === requestedBundleHash;
				if (retained.applied && statusTargetMatches && bundleStatus?.bundleHash === requestedBundleHash && currentStatusTarget && bundleStatus) currentTransport.acceptBundleStatus?.(node, {
					bundleHash: currentStatusTarget.bundleHash,
					status: bundleStatus.status === "installed" ? {
						status: "installed",
						version: currentStatusTarget.openclawVersion
					} : { status: "missing" }
				});
				else if (input.bundleStatusHash) currentTransport.acceptBundleStatus?.(node, void 0);
				return;
			}
		}
	};
	const drain = async () => {
		while (pendingAll || pendingNodes.size > 0) {
			if (stopped) return;
			const reconcileAll = pendingAll;
			const requestedNodes = new Set(pendingNodes);
			pendingAll = false;
			pendingNodes.clear();
			const currentTransport = transport;
			if (!currentTransport) continue;
			let currentNodes;
			try {
				currentNodes = await currentTransport.listCurrentNodes();
			} catch (error) {
				options.warn(`Node workspace retain inventory failed: ${error instanceof Error ? error.message : String(error)}`);
				continue;
			}
			const targets = reconcileAll ? currentNodes : currentNodes.filter((node) => requestedNodes.has(node.nodeId));
			await Promise.all(targets.map(async (node) => {
				try {
					await publishSnapshot(currentTransport, node);
				} catch (error) {
					options.warn(`Node workspace retain publication failed (${node.nodeId}): ${error instanceof Error ? error.message : String(error)}`);
				}
			}));
		}
	};
	const schedule = (nodeId) => {
		if (stopped) return Promise.resolve();
		if (nodeId) pendingNodes.add(nodeId);
		else pendingAll = true;
		if (!started) return Promise.resolve();
		if (operation) return operation;
		const tracked = drain().catch((error) => {
			options.warn(`Node workspace retain reconciliation failed: ${error instanceof Error ? error.message : String(error)}`);
		}).finally(() => {
			if (operation !== tracked) return;
			operation = void 0;
			if (!stopped && (pendingAll || pendingNodes.size > 0)) schedule();
		});
		operation = tracked;
		return tracked;
	};
	return {
		bindTransport(next) {
			transport = next;
			if (started) schedule();
		},
		start() {
			started = true;
			return schedule();
		},
		schedule,
		async stop() {
			stopped = true;
			started = false;
			abortController.abort(/* @__PURE__ */ new Error("node workspace retention stopped"));
			pendingAll = false;
			pendingNodes.clear();
			await operation;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-disk-space.ts
const MIB = 1024 * 1024;
const GIB = 1024 * MIB;
const DISK_SPACE_PROBE_CONCURRENCY = 8;
const DISK_SPACE_PROBE_TIMEOUT_MS = 3e4;
const REMOTE_DISK_SPACE_PROBE_JS = String.raw`
const fs = require("node:fs");
fs.statfs(process.argv[1], { bigint: true }, (error, stats) => {
  if (error) throw error;
  process.stdout.write(JSON.stringify({
    availableBytes: String(stats.bavail * stats.bsize),
    totalBytes: String(stats.blocks * stats.bsize),
  }));
});
`.trim();
function hasExactBinding(observation, placement) {
	return placement?.state === "active" && placement.sessionId === observation.sessionId && placement.generation === observation.generation && placement.environmentId === observation.environmentId && placement.activeOwnerEpoch === observation.activeOwnerEpoch;
}
function parseSafeByteCount(value, field) {
	if (typeof value !== "string" || !/^(?:0|[1-9]\d*)$/u.test(value)) throw new Error(`Worker disk-space probe returned an invalid ${field}`);
	const parsed = BigInt(value);
	if (parsed > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`Worker disk-space probe ${field} exceeds the protocol limit`);
	return Number(parsed);
}
function classifyDiskSpace(availableBytes, totalBytes) {
	const available = BigInt(availableBytes);
	const total = BigInt(totalBytes);
	const used = total - available;
	if (availableBytes < 100 * MIB || total > 0n && used * 100n >= total * 98n && availableBytes < GIB) return "critical";
	if (availableBytes < 500 * MIB || total > 0n && used * 100n >= total * 95n && availableBytes < 5 * GIB) return "warning";
	return "ok";
}
function parseDiskSpaceProbe(stdout, observedAtMs) {
	let value;
	try {
		value = JSON.parse(stdout);
	} catch {
		throw new Error("Worker disk-space probe returned invalid JSON");
	}
	if (!isRecord(value)) throw new Error("Worker disk-space probe returned an invalid result");
	const availableBytes = parseSafeByteCount(value.availableBytes, "available byte count");
	const totalBytes = parseSafeByteCount(value.totalBytes, "total byte count");
	if (availableBytes > totalBytes) throw new Error("Worker disk-space probe returned more available bytes than total bytes");
	return {
		status: classifyDiskSpace(availableBytes, totalBytes),
		availableBytes,
		totalBytes,
		observedAtMs
	};
}
function createWorkerPlacementDiskSpaceMonitor(params) {
	const observations = /* @__PURE__ */ new Map();
	const now = params.now ?? Date.now;
	let observationVersion = 0;
	const read = (placement) => {
		const observation = observations.get(placement.sessionId);
		return observation && hasExactBinding(observation, placement) ? observation.snapshot : void 0;
	};
	const probe = async (placement) => {
		const result = await (await params.environments.startTunnel({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		})).runWorkspaceCommand({
			transportRetry: "idempotent",
			argv: [
				"node",
				"-e",
				REMOTE_DISK_SPACE_PROBE_JS,
				placement.remoteWorkspaceDir
			],
			timeoutMs: DISK_SPACE_PROBE_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw new Error("Worker disk-space probe command failed");
		const snapshot = parseDiskSpaceProbe(result.stdout, Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(now()))));
		const current = params.placements.get(placement.sessionId);
		const candidate = {
			...placement,
			snapshot
		};
		if (!hasExactBinding(candidate, current)) return;
		const previous = observations.get(placement.sessionId);
		const previousStatus = previous && hasExactBinding(previous, current) ? previous.snapshot.status : void 0;
		const snapshotChanged = !previous || !hasExactBinding(previous, current) || previous.snapshot.status !== snapshot.status || previous.snapshot.availableBytes !== snapshot.availableBytes || previous.snapshot.totalBytes !== snapshot.totalBytes || previous.snapshot.observedAtMs !== snapshot.observedAtMs;
		observations.set(placement.sessionId, candidate);
		if (snapshotChanged) observationVersion += 1;
		if (previousStatus !== snapshot.status && (previousStatus !== void 0 || snapshot.status !== "ok")) emitSessionLifecycleEvent({
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			reason: "worker-disk-space"
		});
	};
	const sweep = async () => {
		const active = params.placements.list().filter((placement) => placement.state === "active");
		for (const [sessionId, observation] of observations) if (!hasExactBinding(observation, params.placements.get(sessionId))) {
			observations.delete(sessionId);
			observationVersion += 1;
		}
		await runTasksWithConcurrency({
			tasks: active.map((placement) => () => probe(placement)),
			limit: DISK_SPACE_PROBE_CONCURRENCY,
			onTaskError: (error, index) => {
				const placement = active[index];
				params.warn(`Worker disk-space probe failed${placement ? ` (${placement.sessionId})` : ""}: ${formatErrorMessage(error)}`);
			}
		});
	};
	return {
		read,
		sweep,
		version: () => observationVersion
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-coordinator.ts
/** Serializes reconciliation sweeps against dispatches and deduplicates exact requests. */
function coordinateWorkerPlacementDispatch(service) {
	let activeDispatchCount = 0;
	let placementFence;
	let reconciliationSweep;
	const dispatchIdleWaiters = /* @__PURE__ */ new Set();
	const waitForDispatchIdle = () => {
		if (activeDispatchCount === 0) return Promise.resolve();
		return new Promise((resolve) => {
			dispatchIdleWaiters.add(resolve);
		});
	};
	const runReconciliation = (operation) => {
		if (reconciliationSweep) return reconciliationSweep.promise;
		const predecessor = placementFence;
		const sweep = {
			predecessor,
			promise: Promise.resolve(),
			acceptingJoins: true,
			joinedRecoveries: /* @__PURE__ */ new Set()
		};
		const current = (async () => {
			try {
				if (predecessor) await predecessor.promise.catch(() => void 0);
				await waitForDispatchIdle();
				await operation();
			} finally {
				sweep.acceptingJoins = false;
				await Promise.allSettled(sweep.joinedRecoveries);
				if (reconciliationSweep === sweep) reconciliationSweep = void 0;
				if (placementFence === sweep) placementFence = void 0;
			}
		})();
		sweep.promise = current;
		reconciliationSweep = sweep;
		placementFence = sweep;
		return current;
	};
	const runExclusivePlacementOperation = (operation) => {
		const current = (async () => {
			const pendingFence = placementFence;
			if (pendingFence) await pendingFence.promise.catch(() => void 0);
			await waitForDispatchIdle();
			return await operation();
		})();
		const exclusive = { promise: current.then(() => void 0, () => void 0) };
		placementFence = exclusive;
		return current.finally(() => {
			if (placementFence === exclusive) placementFence = void 0;
		});
	};
	const runPlacementOperation = async (operation) => {
		for (;;) {
			const pendingFence = placementFence;
			if (!pendingFence) break;
			await pendingFence.promise.catch(() => void 0);
		}
		activeDispatchCount += 1;
		try {
			return await operation();
		} finally {
			activeDispatchCount -= 1;
			if (activeDispatchCount === 0) {
				const waiters = [...dispatchIdleWaiters];
				dispatchIdleWaiters.clear();
				for (const resolve of waiters) resolve();
			}
		}
	};
	const dispatchInFlight = /* @__PURE__ */ new Map();
	const moveInFlight = /* @__PURE__ */ new Map();
	const joinOperation = async (operation, authorize) => {
		authorize?.();
		const result = await operation;
		authorize?.();
		return result;
	};
	return {
		isPlacementOperationInFlight: (sessionId) => dispatchInFlight.has(sessionId) || moveInFlight.has(sessionId),
		dispatch: async (request, onTransition, authorize) => {
			const inFlight = dispatchInFlight.get(request.sessionId);
			if (inFlight) {
				if (!isDeepStrictEqual(inFlight.request, request)) throw new Error(`Session ${request.sessionKey} is already dispatching another request`);
				return await joinOperation(inFlight.operation, authorize);
			}
			const operation = runPlacementOperation(() => service.dispatch(request, onTransition, authorize));
			dispatchInFlight.set(request.sessionId, {
				request,
				operation
			});
			try {
				return await operation;
			} finally {
				if (dispatchInFlight.get(request.sessionId)?.operation === operation) dispatchInFlight.delete(request.sessionId);
			}
		},
		forceDestroyEnvironment: (environmentId, onCleanupError) => runExclusivePlacementOperation(() => service.forceDestroyEnvironment(environmentId, onCleanupError)),
		move: async (request, onTransition, authorize) => {
			const inFlight = moveInFlight.get(request.sessionId);
			if (inFlight) {
				if (!isDeepStrictEqual(inFlight.request, request)) throw new Error(`Session ${request.sessionKey} is already moving to another target`);
				return await joinOperation(inFlight.operation, authorize);
			}
			const operation = runExclusivePlacementOperation(() => service.move(request, onTransition, authorize));
			moveInFlight.set(request.sessionId, {
				request,
				operation
			});
			try {
				return await operation;
			} finally {
				if (moveInFlight.get(request.sessionId)?.operation === operation) moveInFlight.delete(request.sessionId);
			}
		},
		reclaim: async (request, authorize, beforeDrain) => await runExclusivePlacementOperation(() => service.reclaim(request, authorize, beforeDrain)),
		reconcile: (mode) => runReconciliation(() => service.reconcile(mode)),
		reconcileActive: (environmentId) => environmentId === void 0 ? runReconciliation(() => service.reconcileActive()) : runExclusivePlacementOperation(() => service.reconcileActive(environmentId)),
		resumeProvisioning: (placement, reconcileEnvironmentCore) => {
			const sweep = reconciliationSweep;
			if (sweep?.acceptingJoins) {
				const recovery = (async () => {
					if (sweep.predecessor) await sweep.predecessor.promise.catch(() => void 0);
					await waitForDispatchIdle();
					return await service.resumeProvisioning(placement, reconcileEnvironmentCore);
				})();
				sweep.joinedRecoveries.add(recovery);
				return recovery;
			}
			return runExclusivePlacementOperation(() => service.resumeProvisioning(placement, reconcileEnvironmentCore));
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-failure.ts
const RECOVERY_ERROR_LIMIT = 1024;
const boundedError = boundedWorkerError;
function isUnavailableEnvironment(environment) {
	return environment.state === "draining" || environment.state === "destroying" || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned";
}
function isCurrentActiveWorkerEnvironment(placement, environment) {
	return Boolean(environment && environment.state === "attached" && environment.destroyRequestedAtMs === null && placement.environmentId && environment.environmentId === placement.environmentId && placement.activeOwnerEpoch !== null && environment.ownerEpoch === placement.activeOwnerEpoch && placement.workerBundleHash && environment.bootstrapReceipt?.bundleHash === placement.workerBundleHash && supportsWorkerExecutionContextLaunch(environment.bootstrapReceipt) && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId);
}
function createPlacementFailureActions(deps) {
	const { environments, placements } = deps;
	const updateFailure = (placement, error) => placements.fail({
		sessionId: placement.sessionId,
		expectedGeneration: placement.generation,
		recoveryError: boundedError(error)
	});
	const cleanupEnvironment = async (params) => {
		const teardownErrors = [];
		params.authorize?.();
		try {
			await environments.stopTunnel(params.environmentId, params.ownerEpoch ?? void 0);
		} catch (error) {
			teardownErrors.push(`tunnel stop: ${boundedError(error)}`);
		}
		params.authorize?.();
		try {
			await environments.destroy(params.environmentId);
		} catch (error) {
			teardownErrors.push(`environment destroy: ${boundedError(error)}`);
		}
		return teardownErrors;
	};
	const teardownEnvironment = async (params) => {
		const environmentId = params.environmentId;
		const teardownErrors = environmentId ? await cleanupEnvironment({
			environmentId,
			ownerEpoch: params.ownerEpoch
		}) : [];
		const recoveryError = [boundedError(params.primaryError), ...teardownErrors].join("; ");
		updateFailure(params.placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const retryFailedTeardown = async (placement, authorize) => {
		if (!placement.environmentId) return;
		const environment = environments.get(placement.environmentId);
		if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") return;
		const teardownErrors = await cleanupEnvironment({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			...authorize ? { authorize } : {}
		});
		if (teardownErrors.length > 0) {
			const recoveryError = [placement.recoveryError, ...teardownErrors].filter(Boolean).join("; ");
			placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError: truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)
			});
		}
	};
	const startDrain = (placement) => {
		const draining = placements.startDrain({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (draining.state !== "draining") throw new Error("Worker placement drain did not produce a draining placement");
		return draining;
	};
	const startReconcile = (placement) => {
		const reconciling = placements.startReconcile({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (reconciling.state !== "reconciling") throw new Error("Worker placement reconcile did not produce a reconciling placement");
		return reconciling;
	};
	const finishReconcilingFailure = (placement, error, teardownErrors) => {
		const recoveryError = [boundedError(error), ...teardownErrors].join("; ");
		updateFailure(placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const failDraining = async (placement, error, options = {}) => {
		if (placement.turnClaim && !options.forceClaimFence) return;
		const current = placements.get(placement.sessionId);
		if (current?.state !== "draining") return;
		if (current.turnClaim) await placements.closeWorkerTurnToolState({
			sessionId: current.sessionId,
			claimId: current.turnClaim.claimId,
			runId: current.turnClaim.runId,
			placementGeneration: current.turnClaim.generation,
			owner: placementTurnOwner(current)
		});
		const reconciling = startReconcile(current);
		const teardownErrors = await cleanupEnvironment({
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch
		});
		finishReconcilingFailure(reconciling, error, teardownErrors);
	};
	const reclaimActive = async (placement, environment, claimedTurnError) => {
		const draining = startDrain(placement);
		if (draining.turnClaim) {
			await failDraining(draining, claimedTurnError, { forceClaimFence: true });
			return;
		}
		const reconciling = startReconcile(draining);
		if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") {
			finishReconcilingFailure(reconciling, claimedTurnError, []);
			return;
		}
		if (environment && !isUnavailableEnvironment(environment)) {
			const teardownErrors = await cleanupEnvironment({
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch
			});
			if (teardownErrors.length > 0) {
				finishReconcilingFailure(reconciling, /* @__PURE__ */ new Error(`Worker reclaim teardown failed: ${teardownErrors.join("; ")}`), []);
				return;
			}
		}
		placements.transition({
			sessionId: reconciling.sessionId,
			from: "reconciling",
			to: "reclaimed",
			expectedGeneration: reconciling.generation
		});
	};
	const failActive = async (placement, error, options = {}) => {
		const draining = startDrain(placement);
		await failDraining(draining, error, options);
	};
	return {
		failActive,
		failDraining,
		reclaimActive,
		retryFailedTeardown,
		teardownEnvironment
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-teardown.ts
/** Close the workspace-result fence, then advance the exact drained owner into reconciliation. */
function completeDrainedWorkspaceTeardown(params) {
	const drained = params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim);
	if (drained.state !== "draining" || drained.environmentId !== params.environmentId || drained.activeOwnerEpoch !== params.ownerEpoch) throw new Error(`Session ${params.turnClaim.sessionId} lost its drained placement owner`);
	const reconciling = params.placements.startReconcile({
		sessionId: drained.sessionId,
		environmentId: params.environmentId,
		ownerEpoch: params.ownerEpoch,
		expectedGeneration: drained.generation
	});
	if (reconciling.state !== "reconciling") throw new Error(`Session ${params.turnClaim.sessionId} did not enter reconciliation`);
	return params.complete(reconciling);
}
function completeMovedWorkspaceTeardown(params) {
	const completed = completeDrainedWorkspaceTeardown({
		...params,
		complete: (reconciling) => params.placements.completePlacementMoveSourceToLocal({
			operationId: params.operationId,
			sessionId: reconciling.sessionId,
			expectedGeneration: reconciling.generation
		})
	});
	if (completed.state !== "local") throw new Error(`Session ${params.turnClaim.sessionId} move did not finish local`);
	return completed;
}
function completeReclaimedWorkspaceTeardown(params) {
	const completed = completeDrainedWorkspaceTeardown({
		...params,
		complete: (reconciling) => params.placements.transition({
			sessionId: reconciling.sessionId,
			from: "reconciling",
			to: "reclaimed",
			expectedGeneration: reconciling.generation
		})
	});
	if (completed.state !== "reclaimed") throw new Error(`Session ${params.turnClaim.sessionId} teardown did not finish reclaimed`);
	return completed;
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-admission.ts
const PREVIOUS_RESULT_RECONCILING_MESSAGE = "The previous cloud turn's workspace result is still reconciling; it retries automatically — try again shortly.";
async function rejectPendingWorkerResult(params) {
	try {
		await params.placements.waitForTurnClaimRelease(params.sessionId, {
			timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		if (params.signal?.aborted) throw error;
		throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE, { cause: error });
	}
	throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE);
}
const CURRENT_WORKER_BUILD_REMEDIATION = "redispatch the session so its worker can bootstrap the current build before retrying.";
function withCurrentWorkerBuildRemediation(reason) {
	return reason.endsWith(CURRENT_WORKER_BUILD_REMEDIATION) ? reason : `${reason}; ${CURRENT_WORKER_BUILD_REMEDIATION}`;
}
function required(value, field) {
	const normalized = value?.trim();
	if (!normalized) throw new Error(`Worker turn ${field} is required`);
	return normalized;
}
function latestDurableWorkspaceConflict(entries) {
	for (const entry of entries.toReversed()) {
		if (entry.type !== "custom_message") continue;
		if (entry.customType === "cloud-workspace-conflict-cleared") return;
		if (entry.customType !== "cloud-workspace-conflict") continue;
		const details = entry.details;
		if (!Array.isArray(details?.paths) || details.paths.length === 0 || !details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) || typeof details.stagedResultRef !== "string" || details.totalCount !== void 0 && (!Number.isSafeInteger(details.totalCount) || details.totalCount < details.paths.length) || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return;
		return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
	}
}
async function waitForTurnOperation(params) {
	const timeout = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, timeout]) : timeout;
	const abortError = () => signal.reason instanceof Error ? signal.reason : new Error("Cloud worker operation aborted", { cause: signal.reason });
	if (signal.aborted) throw abortError();
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
		params.operation.then(resolve, reject).finally(() => {
			signal.removeEventListener("abort", onAbort);
		});
	});
}
function resolvePlacementIdentityField(supplied, persisted, field) {
	const resolved = supplied === void 0 && persisted ? persisted : required(supplied, field);
	if (persisted && resolved !== persisted) throw new Error(`Worker turn ${field} does not match its placement`);
	return resolved;
}
function resolvePlacementIdentity(claim, placement) {
	return {
		sessionId: claim.sessionId,
		agentId: resolvePlacementIdentityField(claim.agentId, placement?.agentId, "agent id"),
		sessionKey: resolvePlacementIdentityField(claim.sessionKey, placement?.sessionKey, "session key")
	};
}
function requireActivePlacement(placement) {
	const failureDetail = placement.state === "failed" ? `: ${withCurrentWorkerBuildRemediation(placement.recoveryError)}` : "";
	if (placement.state !== "active" || !placement.remoteWorkspaceDir || !placement.workerBundleHash) throw new Error(`Worker turn rejected in placement ${placement.state}${failureDetail}`);
	return placement;
}
async function releaseClaimIfOwned(placements, turnClaim) {
	if (placements.validateTurnClaim(turnClaim)) {
		if (turnClaim.owner.kind === "worker") await placements.closeWorkerTurnToolState(turnClaim);
		placements.releaseTurn(turnClaim);
	}
}
async function executeLocalTurn(params) {
	const current = params.placements.get(params.claim.sessionId);
	const turnClaim = params.placements.claimTurn({
		...resolvePlacementIdentity(params.claim, current),
		claimId: randomUUID(),
		runId: params.claim.runId,
		owner: { kind: "local" }
	});
	const settle = () => releaseClaimIfOwned(params.placements, turnClaim);
	try {
		return await withSessionPlacementForcedTerminalSettlement(settle, params.runLocal);
	} finally {
		await settle();
	}
}
async function claimWorkerTurn(params) {
	const claim = () => params.placements.claimTurn({
		...params.identity,
		claimId: randomUUID(),
		runId: params.runId,
		owner: {
			kind: "worker",
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch
		}
	});
	try {
		return {
			placement: params.placement,
			turnClaim: claim()
		};
	} catch (error) {
		if (!(error instanceof ActiveTurnClaimError)) throw error;
		const activePlacement = params.placements.get(params.identity.sessionId);
		const activeClaim = activePlacement?.turnClaim;
		if (activeClaim?.runId === params.runId) throw error;
		const resultIsReconciling = params.placements.listPendingWorkspaceResults().some((pending) => activeClaim?.owner === "worker" && pending.sessionId === params.identity.sessionId && pending.claimId === activeClaim.claimId && pending.runId === activeClaim.runId);
		const cancelledClaim = activePlacement && projectWorkerSessionTurnClaim(activePlacement);
		if (!resultIsReconciling && !(cancelledClaim && params.isCancellationRequested(cancelledClaim))) {
			const refreshed = params.placements.get(params.identity.sessionId);
			if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch || refreshed.generation !== params.placement.generation || refreshed.turnClaim) throw error;
			return {
				placement: refreshed,
				turnClaim: claim()
			};
		}
	}
	try {
		await params.placements.waitForTurnClaimRelease(params.identity.sessionId, {
			timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		if (params.signal?.aborted) throw error;
		throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE, { cause: error });
	}
	const refreshed = params.placements.get(params.identity.sessionId);
	if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch || refreshed.generation !== params.placement.generation) throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE);
	try {
		return {
			placement: refreshed,
			turnClaim: claim()
		};
	} catch (error) {
		if (error instanceof ActiveTurnClaimError) throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE, { cause: error });
		throw error;
	}
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-transcript-target.ts
function resolveWorkerTurnTranscriptTarget(turn) {
	if (!turn.sessionTarget?.agentId || !turn.sessionTarget.sessionId || !turn.sessionTarget.sessionKey || !turn.sessionTarget.storePath) throw new Error("Cloud worker turn is missing its transcript identity");
	if (turn.sessionTarget.sessionId !== turn.sessionId) throw new Error("Cloud worker transcript identity does not match the active turn");
	const targetKeyAgentId = parseAgentSessionKey(turn.sessionTarget.sessionKey)?.agentId;
	if (turn.agentId && turn.sessionTarget.agentId !== turn.agentId || turn.sessionKey && turn.sessionTarget.sessionKey !== turn.sessionKey || targetKeyAgentId && targetKeyAgentId !== turn.sessionTarget.agentId) throw new Error("Cloud worker transcript identity does not match the active turn");
	if (loadSessionEntry({
		agentId: turn.sessionTarget.agentId,
		sessionKey: turn.sessionTarget.sessionKey,
		storePath: turn.sessionTarget.storePath
	})?.sessionId !== turn.sessionId) throw new Error("Cloud worker transcript identity is no longer current");
	return {
		agentId: turn.sessionTarget.agentId,
		sessionId: turn.sessionId,
		sessionKey: turn.sessionTarget.sessionKey,
		storePath: turn.sessionTarget.storePath
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-finalize.ts
var WorkerWorkspaceReconciliationError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "WorkerWorkspaceReconciliationError";
	}
};
function workspaceError(error) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/gu, " ").trim() || "cloud worker turn failed", 1024);
}
function workspaceJournal(params) {
	const owner = {
		sessionId: params.placement.sessionId,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch,
		placementGeneration: params.placement.generation
	};
	let manifestAccepted = false;
	return {
		adapter: {
			load: () => params.placements.loadWorkspaceReconciliation(owner),
			begin: (next) => params.placements.beginWorkspaceReconciliation(owner, next),
			commit: (manifestRef) => {
				params.placements.updateWorkspaceBaseManifest({
					claim: params.turnClaim,
					manifestRef
				});
				manifestAccepted = true;
			},
			abort: () => params.placements.abortWorkspaceReconciliation(owner)
		},
		wasAccepted: () => manifestAccepted
	};
}
async function recoverWorkspaceBeforeTurn(params) {
	const journal = workspaceJournal(params).adapter;
	try {
		await params.workspaceOperations.run(params.placement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace recovery lost its turn claim");
			const pending = journal.load();
			if (pending) {
				await recoverWorkerWorkspaceReconciliation({
					root: params.localWorkspaceDir,
					journal: pending
				});
				journal.abort();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker workspace recovery could not complete: ${workspaceError(error)}`, { cause: error });
	}
}
async function reconcileWorkspaceAfterTurn(params) {
	const currentPlacement = params.placements.get(params.placement.sessionId);
	const generationMatches = currentPlacement?.state === "active" ? currentPlacement.generation === params.turnClaim.placementGeneration : currentPlacement?.state === "draining" ? currentPlacement.generation === params.turnClaim.placementGeneration + 1 : false;
	if (currentPlacement?.state !== "active" && currentPlacement?.state !== "draining" || currentPlacement.environmentId !== params.placement.environmentId || currentPlacement.activeOwnerEpoch !== params.placement.activeOwnerEpoch || !generationMatches) throw new Error("Cloud worker placement changed before workspace reconciliation");
	const completed = SessionManager.open(params.transcriptTarget);
	const priorWorkspaceConflict = currentPlacement.workspaceResultConflict ?? latestDurableWorkspaceConflict(completed.getBranch());
	if (!params.placements.listPendingWorkspaceResults().some((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)) throw new Error("Cloud worker completed without a durable workspace-result fence");
	const journal = workspaceJournal({
		placement: currentPlacement,
		placements: params.placements,
		turnClaim: params.turnClaim
	});
	let workspaceConflict;
	try {
		await params.workspaceOperations.run(currentPlacement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace result lost its turn claim");
			const quiescence = await params.tunnel.quiesceWorkspace(currentPlacement.remoteWorkspaceDir);
			let resumed = false;
			try {
				const stagedResultRef = workerWorkspaceResultRef(params.turnClaim.claimId);
				const applied = await verifyReconciledWorkspaceFinal(await params.tunnel.reconcileWorkspace({
					localPath: params.localWorkspaceDir,
					remoteWorkspaceDir: currentPlacement.remoteWorkspaceDir,
					baseManifestRef: currentPlacement.workspaceBaseManifestRef,
					journal: journal.adapter,
					stagedResult: {
						ref: stagedResultRef,
						record: (ref) => params.placements.recordStagedWorkspaceResult(params.turnClaim, ref)
					}
				}), quiescence);
				if (!journal.wasAccepted()) throw new Error("Cloud worker workspace reconciliation was not durably accepted");
				if (params.prepareAcceptedWorkspacePublication) await params.prepareAcceptedWorkspacePublication(params.turnClaim).catch(() => void 0);
				params.placements.acceptWorkspaceResult(params.turnClaim);
				const recordedStagedResultRef = params.placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)?.stagedResultRef;
				if (applied?.conflictPaths.length && !recordedStagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
				const finalized = await finalizeWorkspaceResultConflicts({
					placements: params.placements,
					turnClaim: params.turnClaim,
					conflictPaths: applied?.conflictPaths ?? [],
					priorConflict: priorWorkspaceConflict,
					stagedResultRef: recordedStagedResultRef,
					root: params.localWorkspaceDir,
					report: async (report) => {
						if ("cleared" in report) {
							SessionManager.open(params.transcriptTarget).appendCustomMessageEntry(WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE, "A later cloud workspace result superseded the previous conflict.", false);
							return;
						}
						workspaceConflict = {
							...report,
							summary: formatWorkspaceConflictSummary(report.paths, report.stagedResultRef, report.totalCount)
						};
						SessionManager.open(params.transcriptTarget).appendCustomMessageEntry(WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, workspaceConflict.summary, true, {
							paths: workspaceConflict.paths,
							stagedResultRef: workspaceConflict.stagedResultRef,
							totalCount: workspaceConflict.totalCount
						});
					}
				});
				await params.publishAcceptedWorkspace?.(params.turnClaim);
				await settleStagedWorkspaceResult({
					placements: params.placements,
					turnClaim: params.turnClaim,
					root: params.localWorkspaceDir,
					stagedResultRef: recordedStagedResultRef,
					conflictRetained: finalized.conflictRetained,
					beforeComplete: async () => {
						await quiescence.resume();
						resumed = true;
					}
				});
			} finally {
				if (!resumed) await quiescence.resume();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker finished, but its workspace result could not be reconciled: ${workspaceError(error)}`, { cause: error });
	}
	return workspaceConflict;
}
function appendWorkspaceConflict(result, workspaceConflict) {
	const payloads = result.payloads ? [...result.payloads] : [];
	const textIndex = payloads.findLastIndex((payload) => typeof payload.text === "string");
	if (textIndex === -1) payloads.push({ text: workspaceConflict.summary });
	else {
		const payload = payloads[textIndex];
		payloads[textIndex] = {
			...payload,
			text: payload.text ? `${payload.text}\n\n${workspaceConflict.summary}` : workspaceConflict.summary
		};
	}
	return {
		...result,
		payloads
	};
}
async function executeRemoteExecTurn(params) {
	const environment = params.environments.get(params.placement.environmentId);
	if (!environment || environment.state !== "attached" || environment.ownerEpoch !== params.placement.activeOwnerEpoch || environment.bootstrapReceipt?.bundleHash !== params.placement.workerBundleHash || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== params.placement.sessionId) throw new Error("Active remote-exec placement does not match its attached environment");
	await recoverWorkspaceBeforeTurn(params);
	const tunnel = await waitForTurnOperation({
		operation: params.environments.startTunnel({
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch
		}),
		...params.turn.abortSignal ? { signal: params.turn.abortSignal } : {},
		timeoutMs: params.turn.timeoutMs
	});
	const transcriptTarget = resolveWorkerTurnTranscriptTarget(params.turn);
	params.placements.markWorkspaceResultPending(params.turnClaim);
	params.onHandoff();
	let result;
	let executionError;
	try {
		result = await params.runLocal();
	} catch (error) {
		executionError = error;
	}
	const workspaceConflict = await reconcileWorkspaceAfterTurn({
		placement: params.placement,
		placements: params.placements,
		turnClaim: params.turnClaim,
		workspaceOperations: params.workspaceOperations,
		localWorkspaceDir: params.localWorkspaceDir,
		transcriptTarget,
		tunnel,
		...params.prepareAcceptedWorkspacePublication ? { prepareAcceptedWorkspacePublication: params.prepareAcceptedWorkspacePublication } : {},
		...params.publishAcceptedWorkspace ? { publishAcceptedWorkspace: params.publishAcceptedWorkspace } : {}
	}).catch((reconciliationError) => {
		const currentEnvironment = params.environments.get(params.placement.environmentId);
		if (environment.nodeDeviceId && currentEnvironment?.state === "attached" && currentEnvironment.providerId === environment.providerId && currentEnvironment.environmentId === environment.environmentId && currentEnvironment.ownerEpoch === environment.ownerEpoch && currentEnvironment.nodeDeviceId === environment.nodeDeviceId && currentEnvironment.attachedSessionIds.length === 1 && currentEnvironment.attachedSessionIds[0] === params.placement.sessionId && reconciliationError instanceof WorkerWorkspaceReconciliationError && reconciliationError.cause instanceof WorkerTunnelOwnerDisconnectedError) params.placements.cancelWorkspaceResultAndReleaseTurn(params.turnClaim, { reason: "node-disconnect" });
		if (executionError) throw new Error(formatErrorMessage(executionError), { cause: reconciliationError });
		throw reconciliationError;
	});
	if (executionError) throw executionError instanceof Error ? executionError : new Error(formatErrorMessage(executionError));
	if (!result) throw new Error("Remote-exec local harness completed without a result");
	if (!workspaceConflict) return result;
	const resultText = result.payloads?.flatMap((payload) => payload.text ? [payload.text] : []).join("\n\n");
	await Promise.resolve(params.turn.onAgentEvent?.({
		stream: "assistant",
		data: {
			text: resultText ? `${resultText}\n\n${workspaceConflict.summary}` : workspaceConflict.summary,
			delta: `${resultText ? "\n\n" : ""}${workspaceConflict.summary}`
		}
	})).catch(() => void 0);
	return appendWorkspaceConflict(result, workspaceConflict);
}
async function finalizeWorkspaceResultConflicts(params) {
	const retainedPriorConflict = params.retainPriorConflict && params.conflictPaths.length === 0 ? params.priorConflict : void 0;
	const supersededConflict = params.priorConflict && !retainedPriorConflict && (params.conflictPaths.length === 0 || params.priorConflict.stagedResultRef !== params.stagedResultRef) ? params.priorConflict : void 0;
	if (supersededConflict && supersededConflict.stagedResultRef !== params.stagedResultRef) await deleteStagedWorkerWorkspaceResult({
		root: params.root,
		stagedResultRef: supersededConflict.stagedResultRef
	});
	let conflict;
	if (params.conflictPaths.length > 0) {
		if (!params.stagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
		conflict = projectWorkspaceResultConflict(params.conflictPaths, params.stagedResultRef);
		params.placements.recordWorkspaceResultConflict(params.turnClaim, conflict);
		await params.report(conflict);
	} else if (retainedPriorConflict) params.placements.recordWorkspaceResultConflict(params.turnClaim, retainedPriorConflict);
	else if (supersededConflict) {
		params.placements.recordWorkspaceResultConflict(params.turnClaim, void 0);
		await params.report({ cleared: true });
	}
	return {
		conflict,
		conflictRetained: conflict !== void 0
	};
}
async function settleStagedWorkspaceResult(params) {
	if (params.turnClaim.owner.kind === "worker") await params.placements.closeWorkerTurnToolState(params.turnClaim);
	const cleanupRef = params.stagedResultRef && !params.conflictRetained ? isWorkerWorkspaceResultCleanupRef(params.stagedResultRef) ? params.stagedResultRef : await moveStagedWorkerWorkspaceResultToCleanup({
		root: params.root,
		stagedResultRef: params.stagedResultRef
	}) : void 0;
	await params.beforeComplete();
	const completed = params.complete ? params.complete() : params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim);
	params.validateCompleted?.(completed);
	await params.afterComplete?.(completed);
	if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
		root: params.root,
		stagedResultRef: cleanupRef
	}).catch(() => void 0);
	return completed;
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-pending-results.ts
function pendingWorkerLossError(environment, sessionId) {
	if (!environment) return /* @__PURE__ */ new Error("cloud worker disappeared: environment record missing");
	if (environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") return /* @__PURE__ */ new Error(`cloud worker disappeared: ${environment.error ?? `environment state ${environment.state}`}`);
	return /* @__PURE__ */ new Error(`Pending cloud workspace result lost its worker: ${sessionId}`);
}
async function prepareAcceptedPublication(deps, claim) {
	if (deps.prepareAcceptedWorkspacePublication) await deps.prepareAcceptedWorkspacePublication(claim).catch(() => void 0);
}
function completeRecoveredWorkspaceTeardown(params) {
	const move = params.placements.getPlacementMove(params.placement.sessionId);
	return move ? completeMovedWorkspaceTeardown({
		placements: params.placements,
		turnClaim: params.turnClaim,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch,
		operationId: move.operationId
	}) : completeReclaimedWorkspaceTeardown({
		placements: params.placements,
		turnClaim: params.turnClaim,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch
	});
}
async function recoverPendingWorkspaceResults(deps, cleanupOrphans, environmentId) {
	const { environments, failure, placements } = deps;
	const stagedResultOwners = /* @__PURE__ */ new Set();
	for (const pending of placements.listPendingWorkspaceResults()) {
		if (pending.stagedResultRef) stagedResultOwners.add(pending.sessionId);
		const sameGatewayInstance = pending.gatewayInstanceId === placements.workspaceResultInstanceId();
		if (sameGatewayInstance && pending.recoveryRequestedAtMs === null) continue;
		const placement = placements.get(pending.sessionId);
		if (environmentId !== void 0 && placement?.environmentId !== environmentId) continue;
		try {
			let active = placement?.state === "active" || placement?.state === "draining" ? placement : void 0;
			const turnClaim = active && active.environmentId === pending.environmentId && active.activeOwnerEpoch === pending.ownerEpoch ? {
				sessionId: active.sessionId,
				claimId: pending.claimId,
				runId: pending.runId,
				placementGeneration: pending.placementGeneration,
				owner: placementTurnOwner(active)
			} : void 0;
			if (!active || !turnClaim || !placements.validateWorkspaceResultClaim(turnClaim)) {
				if (pending.stagedResultRef && pending.workspaceAcceptedAtMs === null) continue;
				if (pending.stagedResultRef) {
					if (!placement) throw new Error(`Staged cloud workspace result lost its placement: ${pending.sessionId}`);
					await deleteStagedWorkerWorkspaceResult({
						root: await deps.resolveWorkspacePath(placement),
						stagedResultRef: pending.stagedResultRef
					});
				}
				if (placement?.state === "active" || placement?.state === "draining") {
					const failed = placements.failWorkspaceResultAndReleaseTurn(pending, /* @__PURE__ */ new Error(`Pending cloud workspace result has no active claim: ${pending.sessionId}`));
					if (failed.state === "failed") await failure.retryFailedTeardown(failed);
				} else placements.abandonWorkspaceResult(pending);
				continue;
			}
			const localPath = await deps.resolveWorkspacePath(active);
			const priorWorkspaceResultConflict = active.workspaceResultConflict ?? await deps.resolveWorkspaceResultConflict(active);
			const canonicalStagedResultRef = workerWorkspaceResultRef(turnClaim.claimId);
			let stagedResultRef = pending.stagedResultRef;
			if (!stagedResultRef && await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef: canonicalStagedResultRef
			})) {
				placements.recordStagedWorkspaceResult(turnClaim, canonicalStagedResultRef);
				stagedResultRef = canonicalStagedResultRef;
				stagedResultOwners.add(pending.sessionId);
			}
			if (stagedResultRef && pending.workspaceAcceptedAtMs !== null) {
				if (!await hasWorkerWorkspaceResultRef({
					root: localPath,
					stagedResultRef
				})) {
					const cleanupRef = cleanupWorkerWorkspaceResultRef(stagedResultRef);
					if (await hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: cleanupRef
					})) stagedResultRef = cleanupRef;
				}
			}
			const hasPreparedResult = !stagedResultRef && await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef: preparedWorkerWorkspaceResultRef(canonicalStagedResultRef)
			});
			const environment = environments.get(active.environmentId);
			if (environment?.state === "attached" && (environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== active.sessionId)) continue;
			const teardownRequired = !sameGatewayInstance || Boolean(stagedResultRef) || pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed";
			if (active.state === "active" && teardownRequired) {
				const draining = placements.startWorkspaceResultDrain(turnClaim);
				if (draining.state !== "draining") throw new Error(`Pending workspace result did not drain session ${active.sessionId}`);
				active = draining;
			}
			const stagedResultExists = stagedResultRef ? await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef
			}) : false;
			if (stagedResultRef && !stagedResultExists) {
				if (pending.workspaceAcceptedAtMs === null) continue;
				if (turnClaim.owner.kind === "worker") await placements.closeWorkerTurnToolState(turnClaim);
				if (environment && environment.state !== "destroyed" && environment.ownerEpoch === active.activeOwnerEpoch) await environments.destroy(active.environmentId);
				await prepareAcceptedPublication(deps, turnClaim);
				await deps.publishAcceptedWorkspace?.(turnClaim);
				completeRecoveredWorkspaceTeardown({
					placements,
					placement: active,
					turnClaim
				});
				await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
				continue;
			}
			if (stagedResultRef) {
				let ownedStagedResultRef = stagedResultRef;
				const owner = {
					sessionId: active.sessionId,
					environmentId: active.environmentId,
					ownerEpoch: active.activeOwnerEpoch,
					placementGeneration: pending.placementGeneration
				};
				const journal = {
					load: () => placements.loadWorkspaceReconciliation(owner),
					begin: (next) => placements.beginWorkspaceReconciliation(owner, next),
					commit: (manifestRef) => placements.updateWorkspaceBaseManifest({
						claim: turnClaim,
						manifestRef
					}),
					abort: () => placements.abortWorkspaceReconciliation(owner)
				};
				await deps.workspaceOperations.run(active.environmentId, async () => {
					if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered workspace result lost its placement owner");
					const interrupted = journal.load();
					const alreadyApplied = interrupted?.appliedManifestRef !== void 0;
					if (interrupted && !alreadyApplied) {
						await recoverWorkerWorkspaceReconciliation({
							root: localPath,
							journal: interrupted
						});
						journal.abort();
					}
					const reconciliation = await applyStagedWorkerWorkspaceResult({
						root: localPath,
						stagedResultRef: ownedStagedResultRef,
						expectedBaseManifestRef: active.workspaceBaseManifestRef,
						alreadyAccepted: pending.workspaceAcceptedAtMs !== null || alreadyApplied,
						journal
					});
					await reconciliation.verifyLocalStable();
					const conflictPaths = reconciliation.conflictPaths;
					if (pending.workspaceAcceptedAtMs === null) {
						await prepareAcceptedPublication(deps, turnClaim);
						placements.acceptWorkspaceResult(turnClaim);
					}
					if (conflictPaths.length > 0 && isWorkerWorkspaceResultCleanupRef(ownedStagedResultRef)) {
						await restoreStagedWorkerWorkspaceResultFromCleanup({
							root: localPath,
							cleanupRef: ownedStagedResultRef,
							stagedResultRef: canonicalStagedResultRef
						});
						ownedStagedResultRef = canonicalStagedResultRef;
					}
					const finalized = await finalizeWorkspaceResultConflicts({
						placements,
						turnClaim,
						conflictPaths,
						priorConflict: priorWorkspaceResultConflict,
						stagedResultRef: ownedStagedResultRef,
						root: localPath,
						report: async (report) => await deps.reportWorkspaceResultConflict({
							sessionId: active.sessionId,
							sessionKey: active.sessionKey,
							agentId: active.agentId,
							...report
						})
					});
					await deps.publishAcceptedWorkspace?.(turnClaim);
					await settleStagedWorkspaceResult({
						placements,
						turnClaim,
						root: localPath,
						stagedResultRef: ownedStagedResultRef,
						conflictRetained: finalized.conflictRetained,
						beforeComplete: async () => {
							const currentEnvironment = environments.get(active.environmentId);
							if (currentEnvironment && currentEnvironment.state !== "destroyed" && currentEnvironment.ownerEpoch === active.activeOwnerEpoch) await environments.destroy(active.environmentId);
						},
						complete: () => completeRecoveredWorkspaceTeardown({
							placements,
							placement: active,
							turnClaim
						})
					});
					await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
				});
				continue;
			}
			if (!isCurrentActiveWorkerEnvironment(active, environment)) {
				if (hasPreparedResult) continue;
				if (pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed") {
					await prepareAcceptedPublication(deps, turnClaim);
					await deps.publishAcceptedWorkspace?.(turnClaim);
					completeRecoveredWorkspaceTeardown({
						placements,
						placement: active,
						turnClaim
					});
					continue;
				}
				const failed = placements.failWorkspaceResultAndReleaseTurn(pending, pendingWorkerLossError(environment, pending.sessionId));
				if (failed.state === "failed") await failure.retryFailedTeardown(failed);
				continue;
			}
			const owner = {
				sessionId: active.sessionId,
				environmentId: active.environmentId,
				ownerEpoch: active.activeOwnerEpoch,
				placementGeneration: pending.placementGeneration
			};
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(owner),
				begin: (next) => placements.beginWorkspaceReconciliation(owner, next),
				commit: (manifestRef) => placements.updateWorkspaceBaseManifest({
					claim: turnClaim,
					manifestRef
				}),
				abort: () => placements.abortWorkspaceReconciliation(owner)
			};
			const tunnel = await environments.startTunnel({
				environmentId: active.environmentId,
				ownerEpoch: active.activeOwnerEpoch
			});
			await deps.workspaceOperations.run(active.environmentId, async () => {
				if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered workspace result lost its placement owner");
				const quiescence = await tunnel.quiesceWorkspace(active.remoteWorkspaceDir);
				let quiescenceHandled = false;
				try {
					const applied = await verifyReconciledWorkspaceFinal(await tunnel.reconcileWorkspace({
						localPath,
						remoteWorkspaceDir: active.remoteWorkspaceDir,
						baseManifestRef: active.workspaceBaseManifestRef,
						journal: { ...journal },
						stagedResult: {
							ref: canonicalStagedResultRef,
							record: (ref) => placements.recordStagedWorkspaceResult(turnClaim, ref)
						}
					}), quiescence);
					await prepareAcceptedPublication(deps, turnClaim);
					placements.acceptWorkspaceResult(turnClaim);
					const recordedStagedResultRef = placements.listPendingWorkspaceResults().find((result) => result.sessionId === turnClaim.sessionId && result.claimId === turnClaim.claimId && result.runId === turnClaim.runId)?.stagedResultRef;
					const conflictPaths = applied?.conflictPaths ?? [];
					if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Recovered cloud workspace conflict has no staged result reference");
					const finalized = await finalizeWorkspaceResultConflicts({
						placements,
						turnClaim,
						conflictPaths,
						priorConflict: priorWorkspaceResultConflict,
						stagedResultRef: recordedStagedResultRef,
						root: localPath,
						report: async (report) => await deps.reportWorkspaceResultConflict({
							sessionId: active.sessionId,
							sessionKey: active.sessionKey,
							agentId: active.agentId,
							...report
						})
					});
					await deps.publishAcceptedWorkspace?.(turnClaim);
					await settleStagedWorkspaceResult({
						placements,
						turnClaim,
						root: localPath,
						stagedResultRef: recordedStagedResultRef,
						conflictRetained: finalized.conflictRetained,
						beforeComplete: async () => {
							if (sameGatewayInstance) await quiescence.resume();
							else await environments.destroy(active.environmentId);
							quiescenceHandled = true;
						},
						...sameGatewayInstance ? {} : { complete: () => completeRecoveredWorkspaceTeardown({
							placements,
							placement: active,
							turnClaim
						}) },
						afterComplete: async () => {
							if (!sameGatewayInstance) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
						}
					});
				} finally {
					if (!quiescenceHandled) await quiescence.resume();
				}
			});
		} catch (error) {
			try {
				const current = placements.get(pending.sessionId);
				const currentPending = placements.listPendingWorkspaceResults().find((candidate) => candidate.sessionId === pending.sessionId && candidate.environmentId === pending.environmentId && candidate.ownerEpoch === pending.ownerEpoch && candidate.placementGeneration === pending.placementGeneration && candidate.claimId === pending.claimId && candidate.runId === pending.runId && candidate.gatewayInstanceId === pending.gatewayInstanceId);
				if (currentPending && isCurrentWorkerWorkspacePendingResultOwner(current, currentPending)) await deps.reportWorkspaceResultRecoveryFailure?.({
					sessionId: current.sessionId,
					sessionKey: current.sessionKey,
					agentId: current.agentId,
					error: boundedWorkerError(error)
				});
			} catch {}
		}
	}
	if (cleanupOrphans) {
		const retainedRefs = () => new Set(placements.listPendingWorkspaceResults().flatMap((pending) => pending.stagedResultRef ? [cleanupWorkerWorkspaceResultRef(pending.stagedResultRef)] : []));
		const cleanedWorkspaceRoots = /* @__PURE__ */ new Set();
		for (const placement of placements.list()) try {
			const root = await deps.resolveWorkspacePath(placement);
			if (!cleanedWorkspaceRoots.has(root)) {
				cleanedWorkspaceRoots.add(root);
				await deleteWorkerWorkspaceResultCleanupRefs({
					root,
					retainedRefs
				});
			}
		} catch {}
	}
	return /* @__PURE__ */ new Set([...stagedResultOwners, ...placements.listPendingWorkspaceResults().map((pending) => pending.sessionId)]);
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-recovery.ts
function isFailedPlacement(placement) {
	return placement.state === "failed";
}
function workerDisappearanceError(environment) {
	if (!environment) return /* @__PURE__ */ new Error("cloud worker disappeared: environment record missing");
	if (environment.state !== "destroyed" && environment.state !== "failed" && environment.state !== "orphaned") return;
	return /* @__PURE__ */ new Error(`cloud worker disappeared: ${environment.error ?? `environment state ${environment.state}`}`);
}
function activePlacementExecutionError(placement, environment, environments) {
	const provisionedMode = environment.profileSnapshot.executionMode;
	if (provisionedMode !== void 0 && provisionedMode !== placement.executionMode) return /* @__PURE__ */ new Error("Active worker placement execution mode does not match its environment");
	if (placement.executionMode === "worker-turn" && !environment.nodeDeviceId) return /* @__PURE__ */ new Error("Active worker-turn placement requires a node lease");
	if (!environments.supportsProviderExecutionMode(environment.providerId, placement.executionMode)) return /* @__PURE__ */ new Error(`Worker provider ${environment.providerId} does not support ${placement.executionMode} placement`);
}
function blockingWorkspaceJournalSessions(placements) {
	const sessions = /* @__PURE__ */ new Set();
	const pendingBySession = new Map(placements.listPendingWorkspaceResults().map((pending) => [pending.sessionId, pending]));
	for (const owner of placements.listWorkspaceReconciliationOwners()) {
		const placement = placements.get(owner.sessionId);
		const pending = pendingBySession.get(owner.sessionId);
		const ownsCurrentGeneration = placement?.generation === owner.placementGeneration;
		const ownsDrainedPendingGeneration = placement?.state === "draining" && placement.generation === owner.placementGeneration + 1 && pending?.environmentId === owner.environmentId && pending.ownerEpoch === owner.ownerEpoch && pending.placementGeneration === owner.placementGeneration;
		if ((placement?.state === "active" || placement?.state === "draining") && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch && (ownsCurrentGeneration || ownsDrainedPendingGeneration)) sessions.add(owner.sessionId);
	}
	return sessions;
}
function createPlacementRecoveryActions(deps) {
	const { environments, failure, placements } = deps;
	let orphanCleanupPending = false;
	const adoptActive = async (placement) => {
		if (placement.turnClaim) {
			const error = /* @__PURE__ */ new Error("Active worker turn claim cannot be proven live after gateway restart");
			await failure.failActive(placement, error, { forceClaimFence: true });
			return;
		}
		const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
		const disappearance = workerDisappearanceError(environment);
		if (disappearance || environment && isUnavailableEnvironment(environment)) {
			await failure.reclaimActive(placement, environment, disappearance ?? /* @__PURE__ */ new Error(`Active worker environment is ${environment?.state}`));
			return;
		}
		if (!environment || !isCurrentActiveWorkerEnvironment(placement, environment)) {
			await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"));
			return;
		}
		try {
			const executionError = activePlacementExecutionError(placement, environment, environments);
			if (executionError) throw executionError;
			if (!environment.nodeDeviceId) await environments.startTunnel({
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
			placements.adoptActive({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
		} catch (error) {
			await failure.failActive(placement, error);
		}
	};
	const reconcile = async (mode) => {
		if (mode === "startup") {
			for (const { environmentId, state } of placements.listForReconcile()) if (environmentId && state !== "failed" && state !== "reclaimed") await environments.reconcileEnvironment(environmentId);
		} else await environments.reconcileOnce();
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, mode !== "startup");
		orphanCleanupPending = mode === "startup";
		const journalOwners = blockingWorkspaceJournalSessions(placements);
		const moveOwners = await deps.recoverPlacementMoves?.() ?? /* @__PURE__ */ new Set();
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId) || moveOwners.has(placement.sessionId)) continue;
			if (placement.state === "local" || placement.state === "reclaimed") continue;
			if (placement.state === "provisioning") {
				const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
				const exactEnvironment = environment?.environmentId === placement.environmentId ? environment : void 0;
				if (exactEnvironment && exactEnvironment.destroyRequestedAtMs === null && (exactEnvironment.state === "requested" || exactEnvironment.state === "provisioning" || exactEnvironment.state === "bootstrapping" || (exactEnvironment.state === "ready" || exactEnvironment.state === "idle") && supportsWorkerExecutionContextLaunch(exactEnvironment.bootstrapReceipt))) continue;
				await failure.teardownEnvironment({
					placement,
					environmentId: exactEnvironment?.environmentId ?? null,
					ownerEpoch: exactEnvironment?.ownerEpoch ?? null,
					primaryError: /* @__PURE__ */ new Error(exactEnvironment ? `Provisioning worker environment cannot be recovered from ${exactEnvironment.state}` : "Provisioning worker environment record is missing")
				});
				continue;
			}
			if (placement.state === "active") {
				await adoptActive(placement);
				continue;
			}
			if (isFailedPlacement(placement)) {
				if (mode !== "startup") await failure.retryFailedTeardown(placement);
				continue;
			}
			const error = /* @__PURE__ */ new Error(`Worker dispatch interrupted in ${placement.state}`);
			if (placement.state === "draining") {
				await failure.failDraining(placement, error, { forceClaimFence: true });
				continue;
			}
			await failure.teardownEnvironment({
				placement,
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch,
				primaryError: error
			});
		}
	};
	const reconcileActive = async (environmentId) => {
		await environments.reconcileOnce();
		const cleanupOrphans = orphanCleanupPending && environmentId === void 0;
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, cleanupOrphans, environmentId);
		if (cleanupOrphans) orphanCleanupPending = false;
		const journalOwners = blockingWorkspaceJournalSessions(placements);
		const moveOwners = await deps.recoverPlacementMoves?.() ?? /* @__PURE__ */ new Set();
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId) || moveOwners.has(placement.sessionId)) continue;
			if (environmentId !== void 0 && placement.environmentId !== environmentId) continue;
			if (isFailedPlacement(placement)) {
				await failure.retryFailedTeardown(placement);
				continue;
			}
			if (placement.state !== "active") continue;
			const environment = environments.get(placement.environmentId);
			const disappearance = workerDisappearanceError(environment);
			if (disappearance || environment && isUnavailableEnvironment(environment)) {
				await failure.reclaimActive(placement, environment, disappearance ?? /* @__PURE__ */ new Error(`Active worker environment is ${environment?.state}`));
				continue;
			}
			if (!environment || !isCurrentActiveWorkerEnvironment(placement, environment)) {
				await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"));
				continue;
			}
			const executionError = activePlacementExecutionError(placement, environment, environments);
			if (executionError) await failure.failActive(placement, executionError, { forceClaimFence: true });
		}
	};
	return {
		reconcile,
		reconcileActive
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-startup.ts
function isPendingProvisioningEnvironment(environment, environmentId) {
	return environment?.environmentId === environmentId && environment.destroyRequestedAtMs === null && (environment.state === "requested" || environment.state === "provisioning" || environment.state === "bootstrapping");
}
function requireProvisionedEnvironment(environment, expectedEnvironmentId, executionMode, environments) {
	if (environment.state !== "ready" && environment.state !== "idle" || environment.environmentId !== expectedEnvironmentId || environment.destroyRequestedAtMs !== null || !environment.bootstrapReceipt || !supportsWorkerExecutionContextLaunch(environment.bootstrapReceipt)) throw new Error(`Worker environment is not dispatchable with the current execution-context contract: ${environment.state}`);
	if (environment.profileSnapshot.executionMode !== void 0 && environment.profileSnapshot.executionMode !== executionMode || executionMode === "worker-turn" && environment.profileSnapshot.executionMode !== void 0 && !environment.nodeDeviceId || !environments.supportsProviderExecutionMode(environment.providerId, executionMode)) throw new Error("Worker environment does not support the placement's exact execution mode");
	return {
		environmentId: environment.environmentId,
		ownerEpoch: environment.ownerEpoch,
		bundleHash: environment.bootstrapReceipt.bundleHash
	};
}
function createWorkerPlacementDispatchStartup(options) {
	const { environments, failure, placements } = options;
	const requireNodePlacementEligibility = async (request, environment, admittedNode) => {
		const deviceId = environment.nodeDeviceId;
		if (!deviceId) return;
		const requirement = request.devicePlacement ?? (options.resolveDevicePlacementRequirement ? await options.resolveDevicePlacementRequirement({
			sessionId: request.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId,
			executionMode: request.executionMode
		}) : void 0);
		if (!requirement) throw new Error("Node-backed cloud placement has no authoritative runtime requirement");
		const eligibility = await resolveDevicePlacementEligibility({
			environmentService: environments,
			deviceId,
			requirement,
			config: getRuntimeConfig(),
			...admittedNode ? { currentNode: admittedNode } : {}
		});
		if (!eligibility.ok) throw new Error(eligibility.error);
		return {
			node: eligibility.node,
			requirement
		};
	};
	const continueProvisionedDispatch = async (params) => {
		if (params.placement.state !== "provisioning") throw new Error("Worker dispatch continuation requires a provisioning placement");
		const { request } = params;
		const provisioned = requireProvisionedEnvironment(params.environment, params.expectedEnvironmentId, request.executionMode, environments);
		const admittedNode = await requireNodePlacementEligibility(request, params.environment);
		let placement = placements.transition({
			sessionId: request.sessionId,
			from: "provisioning",
			to: "syncing",
			expectedGeneration: params.placement.generation,
			patch: {
				environmentId: provisioned.environmentId,
				workerBundleHash: provisioned.bundleHash
			}
		});
		options.reportTransition(params.onTransition, placement);
		const ownerEpoch = (await environments.attachSession({
			environmentId: provisioned.environmentId,
			ownerEpoch: provisioned.ownerEpoch,
			sessionId: request.sessionId
		})).ownerEpoch;
		const tunnel = await environments.startTunnel({
			environmentId: provisioned.environmentId,
			ownerEpoch
		});
		const gitAuthor = options.resolveGitAuthor?.(request.agentId);
		const synced = await tunnel.syncWorkspace({
			localPath: params.localPath,
			sessionId: request.sessionId,
			generation: placement.generation,
			...gitAuthor ? { gitAuthor } : {}
		});
		placement = placements.transition({
			sessionId: request.sessionId,
			from: "syncing",
			to: "starting",
			expectedGeneration: placement.generation,
			patch: {
				workspaceBaseManifestRef: synced.manifestRef,
				remoteWorkspaceDir: synced.remoteWorkspaceDir
			}
		});
		options.reportTransition(params.onTransition, placement);
		const startingPlacement = placement;
		const requireAttachedEnvironment = () => {
			const attachedEnvironment = environments.get(provisioned.environmentId);
			if (!attachedEnvironment || attachedEnvironment.state !== "attached" || attachedEnvironment.ownerEpoch !== ownerEpoch || attachedEnvironment.attachedSessionIds.length !== 1 || attachedEnvironment.attachedSessionIds[0] !== request.sessionId || attachedEnvironment.nodeDeviceId !== params.environment.nodeDeviceId || attachedEnvironment.leaseId !== params.environment.leaseId || attachedEnvironment.bootstrapReceipt?.bundleHash !== provisioned.bundleHash) throw new Error("Worker dispatch lost its exact environment owner before activation");
			return attachedEnvironment;
		};
		await requireNodePlacementEligibility(request, requireAttachedEnvironment(), admittedNode?.node);
		requireAttachedEnvironment();
		const activate = () => {
			requireAttachedEnvironment();
			if (admittedNode && !options.isCurrentNodePlacement?.(admittedNode.node, admittedNode.requirement)) throw new Error("Worker dispatch lost its current node connection, pairing generation, command authorization, or capacity before activation");
			const activated = placements.transition({
				sessionId: request.sessionId,
				from: "starting",
				to: "active",
				expectedGeneration: startingPlacement.generation,
				patch: { activeOwnerEpoch: ownerEpoch }
			});
			if (activated.state !== "active") throw new Error("Worker dispatch activation did not produce an active placement");
			options.reportTransition(params.onTransition, activated);
			return activated;
		};
		const activePlacement = params.recovery ? activate() : await options.runActivationBarrier({
			sessionId: request.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId,
			executionMode: request.executionMode,
			authorize: params.authorize,
			activate
		});
		try {
			options.onActivated?.(request);
		} catch {}
		return activePlacement;
	};
	const resumeProvisioning = async (placement, reconcileEnvironmentCore) => {
		const environmentId = placement.environmentId;
		let recoveryRunStarted = false;
		let recoveryOwnedPlacement = placement;
		const handleRecoveryFailure = async (error) => {
			const current = placements.get(placement.sessionId);
			if (!current || current.state !== "provisioning" && current.state !== "syncing" && current.state !== "starting" || current.state !== recoveryOwnedPlacement.state || current.generation !== recoveryOwnedPlacement.generation || current.environmentId !== environmentId || current.sessionKey !== placement.sessionKey || current.agentId !== placement.agentId || current.executionMode !== placement.executionMode) return;
			const environment = environmentId ? environments.get(environmentId) : void 0;
			if (recoveryRunStarted && current.state === "provisioning" && isPendingProvisioningEnvironment(environment, environmentId)) return;
			const exactEnvironment = environment?.environmentId === environmentId ? environment : null;
			await failure.teardownEnvironment({
				placement: current,
				environmentId: exactEnvironment?.environmentId ?? null,
				ownerEpoch: exactEnvironment?.ownerEpoch ?? null,
				primaryError: error
			});
		};
		try {
			if (!environmentId) throw new Error("Provisioning worker placement has no environment owner");
			await options.runRecoveryBarrier({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId,
				executionMode: placement.executionMode,
				environmentId,
				expectedGeneration: placement.generation,
				run: async (localPath) => {
					recoveryRunStarted = true;
					try {
						const initialEnvironment = environments.get(environmentId);
						if (initialEnvironment?.environmentId !== environmentId) throw new Error("Provisioning worker environment record is missing");
						if (initialEnvironment.destroyRequestedAtMs !== null) throw new Error("Provisioning worker environment destruction was requested");
						await reconcileEnvironmentCore();
						const current = placements.get(placement.sessionId);
						if (current?.state !== "provisioning" || current.generation !== placement.generation || current.environmentId !== environmentId) throw new Error("Provisioning worker placement changed during restart recovery");
						const environment = environments.get(environmentId);
						if (environment?.environmentId !== environmentId) throw new Error("Provisioning worker environment record is missing");
						if (isPendingProvisioningEnvironment(environment, environmentId)) return;
						let devicePlacement;
						if (environment.nodeDeviceId) {
							if (!options.resolveDevicePlacementRequirement) throw new Error("Node-backed recovery has no authoritative runtime requirement");
							devicePlacement = await options.resolveDevicePlacementRequirement({
								sessionId: placement.sessionId,
								sessionKey: placement.sessionKey,
								agentId: placement.agentId,
								executionMode: placement.executionMode
							});
						}
						await continueProvisionedDispatch({
							request: {
								sessionId: placement.sessionId,
								sessionKey: placement.sessionKey,
								agentId: placement.agentId,
								profileId: environment.profileId,
								executionMode: placement.executionMode,
								...devicePlacement ? { devicePlacement } : {},
								...environment.providerId === "device" && environment.nodeDeviceId ? { deviceId: environment.nodeDeviceId } : {}
							},
							placement: current,
							environment,
							expectedEnvironmentId: environmentId,
							localPath,
							onTransition: (next) => {
								recoveryOwnedPlacement = next;
							},
							recovery: true
						});
					} catch (error) {
						await handleRecoveryFailure(error);
					}
				}
			});
		} catch (error) {
			await handleRecoveryFailure(error);
		}
	};
	return {
		continueProvisionedDispatch,
		resumeProvisioning
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-move-abandon.ts
function createWorkerPlacementMoveAbandonment(options) {
	const { environments, placements } = options;
	const forceDestroyEnvironment = async (environmentId, onCleanupError) => await options.workspaceOperations.run(environmentId, async () => {
		await forceAbandonWorkerEnvironment({
			placements,
			environmentId,
			resolveWorkspacePath: options.resolveWorkspacePath,
			onCleanupError
		});
		try {
			return await environments.destroy(environmentId);
		} catch (error) {
			const current = environments.get(environmentId);
			if (!current || !isUnavailableEnvironment(current)) throw error;
			try {
				onCleanupError?.(error);
			} catch {}
			return current;
		}
	});
	const validateAbandonSource = (request) => {
		const current = placements.get(request.sessionId);
		if (current?.state !== "active" || current.generation !== request.source.generation || current.environmentId !== request.source.environmentId || current.activeOwnerEpoch !== request.source.ownerEpoch) throw new Error(`Cannot abandon stale worker placement for session ${request.sessionKey}`);
		const runner = options.runnerAvailability.read(current);
		if (!runner) throw new Error("Continue on Gateway can abandon only an active paired-device placement with a known runner binding");
		if (runner.status === "available") throw new Error("Device runner is available; use Move session so OpenClaw can reconcile its workspace safely");
	};
	const abandonSource = async (request, intent, authorize) => {
		const current = placements.get(request.sessionId);
		if (!current || current.state !== "active" && current.state !== "draining" && current.state !== "reconciling" && current.state !== "failed" || current.environmentId !== intent.source.environmentId || current.activeOwnerEpoch !== intent.source.ownerEpoch) throw new Error(`Session ${request.sessionKey} abandonment source changed before teardown`);
		await forceDestroyEnvironment(intent.source.environmentId);
		authorize?.();
		const failed = placements.get(request.sessionId);
		if (failed?.state !== "failed") throw new Error(`Session ${request.sessionKey} abandonment did not fence its remote owner`);
		if (!isFailedWorkerPlacementEnvironmentGone({
			environmentService: environments,
			placement: failed
		})) throw new Error(`Session ${request.sessionKey} device teardown is still pending; retry Continue on Gateway`);
		const local = placements.completeAbandonedPlacementMoveSourceToLocal({
			operationId: intent.operationId,
			sessionId: intent.sessionId,
			expectedGeneration: failed.generation,
			expectedRecoveryError: FORCED_WORKER_ABANDONMENT_ERROR
		});
		if (local.state !== "local") throw new Error(`Session ${request.sessionKey} abandonment did not finish on the Gateway`);
		return local;
	};
	return {
		abandonSource,
		forceDestroyEnvironment,
		validateAbandonSource
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-move-service.ts
const RESTART_AUTHORITY_EXPIRED = "Cloud worker move request authority expired after Gateway restart; retry move";
function createWorkerPlacementMoveService(options) {
	const reportTransition = (observer, placement) => {
		try {
			observer?.(placement);
		} catch {}
	};
	const recordError = (intent, error) => {
		options.placements.recordPlacementMoveError({
			operationId: intent.operationId,
			sessionId: intent.sessionId,
			error: error instanceof Error ? error.message : String(error)
		});
	};
	const finishWorkerDestination = async (params) => {
		const active = await options.dispatch({
			...params.identity,
			...params.destination,
			idempotencyKey: `session-move:${params.intent.operationId}:dispatch`
		}, params.onTransition, params.authorize);
		const completed = options.placements.completePlacementMoveToWorker({
			operationId: params.intent.operationId,
			sessionId: params.identity.sessionId,
			expectedGeneration: active.generation,
			environmentId: active.environmentId,
			ownerEpoch: active.activeOwnerEpoch
		});
		if (completed.state !== "active") throw new Error(`Session ${params.identity.sessionKey} move did not finish active`);
		return completed;
	};
	const move = async (request, onTransition, authorize) => {
		let intent;
		try {
			if (request.abandonSource && request.target.kind !== "gateway") throw new Error("Source abandonment is available only when continuing on the Gateway");
			const destination = request.target.kind === "gateway" ? void 0 : await options.resolveDestination(request, request.target);
			if (request.target.kind !== "gateway" && !destination) throw new Error(`Session ${request.sessionKey} worker move target is unavailable`);
			const begun = await options.runMoveBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				sourceDisposition: request.abandonSource ? "abandon" : "reconcile",
				authorize,
				begin: async (prepareNew) => {
					const moveRequest = {
						sessionId: request.sessionId,
						source: request.source,
						target: request.target,
						...request.abandonSource ? { abandonSource: true } : {}
					};
					const started = request.abandonSource ? await options.placements.preparePlacementMove(moveRequest, async () => {
						options.validateAbandonSource(request);
						const placement = options.placements.get(request.sessionId);
						const claim = placement ? projectWorkerSessionTurnClaim(placement) : void 0;
						if (claim && prepareNew) {
							await prepareNew(claim.runId);
							const current = options.placements.get(request.sessionId);
							if (!current || !isCurrentPlacementTurnClaim(current, claim)) throw new Error(`Session ${request.sessionKey} abandonment worker turn changed; retry`);
							options.validateAbandonSource(request);
						}
					}) : options.placements.beginPlacementMove(moveRequest);
					if (started.placement.state !== "draining") throw new Error(`Session ${request.sessionKey} placement move is already in ${started.placement.state}`);
					return {
						...started,
						placement: started.placement
					};
				}
			});
			intent = begun.intent;
			reportTransition(onTransition, begun.placement);
			const local = request.abandonSource ? await options.abandonSource(request, intent, authorize) : await options.reclaimSource(request, intent, authorize);
			reportTransition(onTransition, local);
			if (local.state !== "local") throw new Error(`Session ${request.sessionKey} move did not return to local placement`);
			if (request.target.kind === "gateway") return local;
			if (!destination) throw new Error(`Session ${request.sessionKey} worker move target is unavailable`);
			return await finishWorkerDestination({
				identity: request,
				intent,
				destination,
				...onTransition ? { onTransition } : {},
				...authorize ? { authorize } : {}
			});
		} catch (error) {
			const durableIntent = intent ?? options.placements.getPlacementMove(request.sessionId);
			if (durableIntent) recordError(durableIntent, error);
			throw error;
		}
	};
	const recover = async (intent) => {
		try {
			let placement = options.placements.get(intent.sessionId);
			if (!placement) throw new Error(`Session ${intent.sessionId} placement move lost its session placement`);
			const identity = {
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			};
			if (intent.abandonSource) {
				if (intent.target.kind !== "gateway") throw new Error(`Session ${identity.sessionKey} abandonment intent has a non-Gateway target`);
				if (placement.state === "local") {
					options.placements.cancelPlacementMove({
						operationId: intent.operationId,
						sessionId: intent.sessionId
					});
					return;
				}
				if (placement.state !== "active" && placement.state !== "draining" && placement.state !== "reconciling" && placement.state !== "failed") throw new Error(`Session ${identity.sessionKey} abandonment recovery is waiting in ${placement.state}`);
				await options.abandonSource(identity, intent);
				return;
			}
			if (placement.state === "failed") {
				if (!isFailedWorkerPlacementEnvironmentGone({
					environmentService: options.environments,
					placement
				})) throw new Error(`Session ${identity.sessionKey} failed move environment must finish teardown before retry`);
				options.placements.cancelPlacementMove({
					operationId: intent.operationId,
					sessionId: intent.sessionId
				});
				return;
			} else if (placement.state === "draining") {
				const local = await options.reclaimSource(identity, intent);
				if (local.state !== "local") throw new Error(`Session ${identity.sessionKey} move recovery did not return local`);
				placement = local;
			} else if (placement.state === "reconciling") {
				const environment = options.environments.get(placement.environmentId);
				if (environment && environment.state !== "destroyed" && environment.state !== "failed" && environment.state !== "orphaned") return;
				placement = options.placements.completePlacementMoveSourceToLocal({
					operationId: intent.operationId,
					sessionId: intent.sessionId,
					expectedGeneration: placement.generation
				});
			} else if (placement.state === "active") {
				if (placement.environmentId === intent.source.environmentId && placement.activeOwnerEpoch === intent.source.ownerEpoch) throw new Error(`Session ${identity.sessionKey} move recovery found an active source`);
				options.placements.completePlacementMoveToWorker({
					operationId: intent.operationId,
					sessionId: intent.sessionId,
					expectedGeneration: placement.generation,
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch
				});
				return;
			} else if (placement.state !== "local") return;
			if (intent.target.kind === "gateway") {
				if (options.placements.getPlacementMove(intent.sessionId)) options.placements.cancelPlacementMove({
					operationId: intent.operationId,
					sessionId: intent.sessionId
				});
				return;
			}
			options.placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError: RESTART_AUTHORITY_EXPIRED
			});
			options.placements.cancelPlacementMove({
				operationId: intent.operationId,
				sessionId: intent.sessionId
			});
		} catch (error) {
			recordError(intent, error);
			throw error;
		}
	};
	const recoverAll = async () => {
		const protectedSessions = /* @__PURE__ */ new Set();
		for (const intent of options.placements.listPlacementMoves()) {
			const state = options.placements.get(intent.sessionId)?.state;
			if (intent.abandonSource && state !== "local" || state === "draining" || state === "reconciling") protectedSessions.add(intent.sessionId);
			await recover(intent).catch(() => void 0);
		}
		return protectedSessions;
	};
	return {
		move,
		recoverAll
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch.ts
function isExactAttachedEnvironment(environment, placement) {
	return Boolean(environment && environment.environmentId === placement.environmentId && environment.state === "attached" && environment.ownerEpoch === placement.activeOwnerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId);
}
function createWorkerPlacementDispatchService(options) {
	const { environments, placements } = options;
	const failure = createPlacementFailureActions({
		environments,
		placements
	});
	let recoverPlacementMoves = async () => /* @__PURE__ */ new Set();
	const reportTransition = (observer, placement) => {
		try {
			observer?.(placement);
		} catch {}
	};
	const startup = createWorkerPlacementDispatchStartup({
		placements,
		environments,
		failure,
		runRecoveryBarrier: options.runRecoveryBarrier,
		runActivationBarrier: options.runActivationBarrier,
		onActivated: options.onActivated,
		resolveGitAuthor: options.resolveGitAuthor,
		resolveDevicePlacementRequirement: options.resolveDevicePlacementRequirement,
		isCurrentNodePlacement: options.isCurrentNodePlacement,
		reportTransition
	});
	const recovery = createPlacementRecoveryActions({
		environments,
		failure,
		placements,
		resolveWorkspacePath: options.resolveWorkspacePath,
		reportWorkspaceResultConflict: options.reportWorkspaceResultConflict,
		...options.reportWorkspaceResultRecoveryFailure ? { reportWorkspaceResultRecoveryFailure: options.reportWorkspaceResultRecoveryFailure } : {},
		resolveWorkspaceResultConflict: options.resolveWorkspaceResultConflict,
		recoverPlacementMoves: () => recoverPlacementMoves(),
		workspaceOperations: options.workspaceOperations,
		...options.prepareAcceptedWorkspacePublication ? { prepareAcceptedWorkspacePublication: options.prepareAcceptedWorkspacePublication } : {},
		...options.publishAcceptedWorkspace ? { publishAcceptedWorkspace: options.publishAcceptedWorkspace } : {}
	});
	const dispatch = async (request, onTransition, authorize) => {
		let placement;
		const validateDevicePlacement = async () => {
			if (!request.deviceId) return;
			const eligibility = await resolveDevicePlacementEligibility({
				environmentService: environments,
				deviceId: request.deviceId,
				requirement: request.devicePlacement,
				config: getRuntimeConfig()
			});
			if (!eligibility.ok) throw new Error(eligibility.error);
		};
		try {
			placement = await options.runLocalBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				executionMode: request.executionMode,
				authorize,
				startDispatch: () => {
					placement = placements.startDispatch({
						sessionId: request.sessionId,
						sessionKey: request.sessionKey,
						agentId: request.agentId,
						executionMode: request.executionMode
					});
					reportTransition(onTransition, placement);
					return placement;
				}
			});
			if (!request.deviceId && request.devicePlacement?.requiredNodeCommands.length && environments.requiresNodeEnrollment?.(request.profileId, request.inheritedProfile?.providerId)) {
				const allowlist = resolveNodeCommandAllowlist(getRuntimeConfig());
				const deniedCommand = request.devicePlacement.requiredNodeCommands.find((command) => !allowlist.has(command));
				if (deniedCommand) throw new Error(`cloud worker node command ${deniedCommand} is not enabled; add it to gateway.nodes.commands.allow and approve the command on the node`);
			}
			await validateDevicePlacement();
			const localPath = await options.resolveWorkspacePath(request);
			await validateDevicePlacement();
			const idempotencyKey = request.idempotencyKey ?? `session-dispatch:${request.sessionId}:${placement.generation}`;
			const expectedEnvironmentId = deriveEnvironmentIntent(idempotencyKey).environmentId;
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "requested",
				to: "provisioning",
				expectedGeneration: placement.generation,
				patch: { environmentId: expectedEnvironmentId }
			});
			reportTransition(onTransition, placement);
			const environment = request.inheritedProfile ? await environments.createFromProfileSnapshot({
				profileId: request.profileId,
				providerId: request.inheritedProfile.providerId,
				profileSnapshot: request.inheritedProfile.profileSnapshot
			}, idempotencyKey, request.machineClass, request.executionMode) : await environments.create(request.profileId, idempotencyKey, request.machineClass, request.executionMode);
			return await startup.continueProvisionedDispatch({
				request,
				placement,
				environment,
				expectedEnvironmentId,
				localPath,
				onTransition,
				authorize
			});
		} catch (error) {
			try {
				const current = placement ? placements.get(request.sessionId) : void 0;
				if (current && current.state !== "local" && current.state !== "reclaimed") if (current.state === "active") await failure.failActive(current, error);
				else {
					const currentEnvironment = current.environmentId ? environments.get(current.environmentId) : void 0;
					const ownedEnvironment = currentEnvironment?.environmentId === current.environmentId ? currentEnvironment : void 0;
					await failure.teardownEnvironment({
						placement: current,
						environmentId: ownedEnvironment?.environmentId ?? null,
						ownerEpoch: ownedEnvironment?.ownerEpoch ?? null,
						primaryError: error
					});
				}
			} finally {
				const finalPlacement = placements.get(request.sessionId);
				if (finalPlacement) reportTransition(onTransition, finalPlacement);
			}
			throw error;
		}
	};
	const reclaimOnce = async (request, moveIntent, authorize, beforeDrain) => await options.runReclaimBarrier({
		...request,
		authorize,
		beforeDrain,
		begin: () => {
			const current = placements.get(request.sessionId);
			if (current?.state !== "active" && current?.state !== "draining" || current.turnClaim) throw new Error(`Session ${request.sessionKey} cannot stop cloud worker from placement ${current?.state ?? "missing"}`);
			if (!isExactAttachedEnvironment(environments.get(current.environmentId), current)) throw new Error("Active cloud worker does not match its session placement");
			if (current.state === "draining") return current;
			const draining = placements.startDrain({
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				expectedGeneration: current.generation
			});
			if (draining.state !== "draining") throw new Error(`Session ${request.sessionKey} did not enter draining placement`);
			return draining;
		},
		reclaim: async (localPath, current, reauthorize) => {
			const journalOwner = {
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				placementGeneration: current.generation
			};
			const reclaimClaimId = `reclaim-${randomUUID()}`;
			const reclaimClaim = placements.claimReclaimWorkspaceResult({
				sessionId: current.sessionId,
				sessionKey: current.sessionKey,
				agentId: current.agentId,
				claimId: reclaimClaimId,
				runId: reclaimClaimId,
				owner: placementTurnOwner(current)
			});
			const reclaimResultRef = workerWorkspaceResultRef(reclaimClaim.claimId);
			let manifestAccepted = false;
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(journalOwner),
				begin: (next) => placements.beginWorkspaceReconciliation(journalOwner, next),
				commit: (manifestRef) => {
					placements.updateWorkspaceBaseManifest({
						claim: reclaimClaim,
						manifestRef
					});
					manifestAccepted = true;
				},
				abort: () => placements.abortWorkspaceReconciliation(journalOwner)
			};
			const cancelUnstagedFailedReclaim = async (allowCommitted) => {
				await options.workspaceOperations.run(current.environmentId, async () => {
					const stillOwnsEmptyResult = () => {
						const owned = placements.get(current.sessionId);
						const currentEnvironment = environments.get(current.environmentId);
						const pendingResult = placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === reclaimClaim.sessionId && pending.claimId === reclaimClaim.claimId && pending.runId === reclaimClaim.runId);
						return (allowCommitted || !manifestAccepted) && owned?.state === "draining" && owned.turnClaim?.claimId === reclaimClaim.claimId && reclaimClaim.owner.environmentId === current.environmentId && reclaimClaim.owner.ownerEpoch === current.activeOwnerEpoch && currentEnvironment?.state === "attached" && currentEnvironment.ownerEpoch === reclaimClaim.owner.ownerEpoch && currentEnvironment.attachedSessionIds.length === 1 && currentEnvironment.attachedSessionIds[0] === owned.sessionId && pendingResult?.workspaceAcceptedAtMs === null && pendingResult.stagedResultRef === null;
					};
					if (!stillOwnsEmptyResult()) return;
					const [canonicalExists, preparedExists] = await Promise.all([hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: reclaimResultRef
					}), hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: preparedWorkerWorkspaceResultRef(reclaimResultRef)
					})]);
					if (!canonicalExists && !preparedExists && stillOwnsEmptyResult()) {
						await placements.closeWorkerTurnToolState(reclaimClaim);
						placements.cancelWorkspaceResultAndReleaseTurn(reclaimClaim);
					}
				});
			};
			const finishReclaim = async () => {
				const pending = journal.load();
				if (pending) {
					reauthorize?.();
					await recoverWorkerWorkspaceReconciliation({
						root: localPath,
						journal: pending
					});
					reauthorize?.();
					journal.abort();
				}
				reauthorize?.();
				const tunnel = await environments.startTunnel({
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				});
				const reclaimed = await options.workspaceOperations.run(current.environmentId, async () => {
					reauthorize?.();
					const owned = placements.get(current.sessionId);
					if (owned?.state !== "draining" || owned.generation !== current.generation || owned.environmentId !== current.environmentId || owned.activeOwnerEpoch !== current.activeOwnerEpoch || owned.turnClaim?.claimId !== reclaimClaim.claimId) throw new Error("Cloud worker stop lost its placement owner before reconciliation");
					reauthorize?.();
					const quiescence = await tunnel.quiesceWorkspace(current.remoteWorkspaceDir);
					let destroyed = false;
					try {
						reauthorize?.();
						const reconciliation = await tunnel.reconcileWorkspace({
							localPath,
							remoteWorkspaceDir: current.remoteWorkspaceDir,
							baseManifestRef: current.workspaceBaseManifestRef,
							journal,
							stagedResult: {
								ref: reclaimResultRef,
								record: (ref) => placements.recordStagedWorkspaceResult(reclaimClaim, ref)
							}
						});
						const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
						if (reconciliation.changed && !manifestAccepted) throw new Error("Cloud worker stop did not commit its reconciled workspace");
						reauthorize?.();
						placements.acceptWorkspaceResult(reclaimClaim);
						const recordedStagedResultRef = placements.listPendingWorkspaceResults().find((result) => result.sessionId === reclaimClaim.sessionId && result.claimId === reclaimClaim.claimId && result.runId === reclaimClaim.runId)?.stagedResultRef;
						const conflictPaths = applied?.conflictPaths ?? [];
						if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Cloud worker stop conflict has no staged result reference");
						const priorWorkspaceResultConflict = current.workspaceResultConflict ?? await options.resolveWorkspaceResultConflict({
							sessionId: current.sessionId,
							sessionKey: current.sessionKey,
							agentId: current.agentId
						});
						reauthorize?.();
						const finalized = await finalizeWorkspaceResultConflicts({
							placements,
							turnClaim: reclaimClaim,
							conflictPaths,
							priorConflict: priorWorkspaceResultConflict,
							stagedResultRef: recordedStagedResultRef,
							retainPriorConflict: !reconciliation.changed,
							root: localPath,
							report: async (report) => await options.reportWorkspaceResultConflict({
								sessionId: current.sessionId,
								sessionKey: current.sessionKey,
								agentId: current.agentId,
								...report
							})
						});
						reauthorize?.();
						return await settleStagedWorkspaceResult({
							placements,
							turnClaim: reclaimClaim,
							root: localPath,
							stagedResultRef: recordedStagedResultRef,
							conflictRetained: finalized.conflictRetained,
							beforeComplete: async () => {
								reauthorize?.();
								await environments.destroy(current.environmentId);
								destroyed = true;
							},
							complete: () => {
								return moveIntent ? completeMovedWorkspaceTeardown({
									placements,
									turnClaim: reclaimClaim,
									environmentId: current.environmentId,
									ownerEpoch: current.activeOwnerEpoch,
									operationId: moveIntent.operationId
								}) : completeReclaimedWorkspaceTeardown({
									placements,
									turnClaim: reclaimClaim,
									environmentId: current.environmentId,
									ownerEpoch: current.activeOwnerEpoch
								});
							},
							validateCompleted: (completed) => {
								const expectedState = moveIntent ? "local" : "reclaimed";
								if (completed.state !== expectedState) throw new Error(`Cloud worker teardown did not produce ${expectedState} placement`);
							}
						});
					} finally {
						if (!destroyed && isExactAttachedEnvironment(environments.get(current.environmentId), current)) await quiescence.resume();
					}
				});
				if (reclaimed.state !== "local" && reclaimed.state !== "reclaimed") throw new Error("Cloud worker teardown produced a nonterminal placement");
				try {
					await environments.stopTunnel(current.environmentId, current.activeOwnerEpoch);
				} catch {}
				return reclaimed;
			};
			try {
				return await finishReclaim();
			} catch (error) {
				await cancelUnstagedFailedReclaim(error instanceof WorkerWorkspaceFinalFenceError && error.reclaimDisposition === "retry").catch(() => void 0);
				const pendingReclaimResult = placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === reclaimClaim.sessionId && pending.claimId === reclaimClaim.claimId && pending.runId === reclaimClaim.runId);
				if (pendingReclaimResult && pendingReclaimResult.workspaceAcceptedAtMs !== null) {
					placements.handoffWorkspaceResultRecovery(reclaimClaim);
					await recovery.reconcileActive(current.environmentId).catch(() => void 0);
				}
				throw error;
			}
		}
	});
	const reclaimInFlight = /* @__PURE__ */ new Map();
	const reclaim = async (request, authorize, beforeDrain) => {
		beforeDrain?.();
		const current = placements.get(request.sessionId);
		if (current?.state === "reclaimed") return current;
		const inFlight = reclaimInFlight.get(request.sessionId);
		if (inFlight) return await inFlight;
		const operation = (async () => {
			if (placements.get(request.sessionId)?.state === "failed") return await options.runFailedReclaimBarrier({
				...request,
				authorize,
				reclaim: async (reauthorize) => {
					const failedPlacement = placements.get(request.sessionId);
					if (failedPlacement?.state !== "failed") throw new Error("Failed cloud worker placement changed during reclaim");
					await failure.retryFailedTeardown(failedPlacement, reauthorize);
					const failed = placements.get(request.sessionId);
					if (failed?.state !== "failed") throw new Error("Failed cloud worker placement changed during reclaim");
					if (!isFailedWorkerPlacementEnvironmentGone({
						environmentService: environments,
						placement: failed
					})) throw new Error("Failed cloud worker environment cleanup is still pending");
					const local = placements.transition({
						sessionId: request.sessionId,
						from: "failed",
						to: "local",
						expectedGeneration: failed.generation
					});
					if (local.state !== "local") throw new Error("Failed cloud worker reclaim did not produce a local placement");
					return local;
				}
			});
			return await reclaimOnce(request, void 0, authorize, beforeDrain);
		})().catch((error) => {
			const completed = placements.get(request.sessionId);
			if (error instanceof WorkerTunnelOwnerDisconnectedError && completed?.state === "reclaimed") return completed;
			throw error;
		});
		reclaimInFlight.set(request.sessionId, operation);
		try {
			return await operation;
		} finally {
			if (reclaimInFlight.get(request.sessionId) === operation) reclaimInFlight.delete(request.sessionId);
		}
	};
	const abandonment = createWorkerPlacementMoveAbandonment(options);
	const moveService = createWorkerPlacementMoveService({
		placements,
		environments,
		runMoveBarrier: options.runMoveBarrier,
		dispatch,
		reclaimSource: reclaimOnce,
		validateAbandonSource: abandonment.validateAbandonSource,
		abandonSource: abandonment.abandonSource,
		resolveDestination: options.resolveMoveDestination
	});
	recoverPlacementMoves = moveService.recoverAll;
	return {
		dispatch,
		forceDestroyEnvironment: abandonment.forceDestroyEnvironment,
		move: moveService.move,
		reclaim,
		reconcile: recovery.reconcile,
		reconcileActive: recovery.reconcileActive,
		resumeProvisioning: startup.resumeProvisioning
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-idle-sweep.ts
var WorkerPlacementAutoSuspendBusyError = class extends Error {};
function createWorkerPlacementIdleSweep(options) {
	const now = options.now ?? Date.now;
	const loadSessionRuntime = options.loadSessionRuntime;
	const getSessionWorkAdmissionCheck = options.getSessionWorkAdmissionCheck ?? (loadSessionRuntime && (async ({ sessionId, sessionKey, agentId }) => {
		const target = (await loadSessionRuntime()).resolveGatewaySessionStoreTargetWithStore({
			cfg: options.getConfig(),
			key: sessionKey,
			agentId,
			clone: false
		});
		const identities = [
			sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			sessionId
		];
		return () => isSessionWorkAdmissionActive(target.storePath, identities) || hasPendingFollowupQueueWork(identities);
	}));
	return { async sweep() {
		const profiles = options.getConfig().cloudWorkers?.profiles;
		if (!profiles || !Object.values(profiles).some((profile) => profile.suspendAfter)) return;
		const pendingSessions = /* @__PURE__ */ new Set([...options.placements.listPendingWorkspaceResults().map((result) => result.sessionId), ...options.placements.listWorkspaceReconciliationOwners().map((owner) => owner.sessionId)]);
		for (const placement of options.placements.listForReconcile()) {
			if (placement.state !== "active" || placement.turnClaim) continue;
			const environment = options.environments.get(placement.environmentId);
			const suspendAfter = environment && profiles[environment.profileId]?.suspendAfter;
			if (!suspendAfter) continue;
			if (now() - placement.updatedAtMs < parseDurationMs(suspendAfter)) continue;
			if (pendingSessions.has(placement.sessionId) || options.placements.getPlacementMove(placement.sessionId) || options.isPlacementOperationInFlight?.(placement.sessionId)) continue;
			try {
				const request = {
					sessionId: placement.sessionId,
					sessionKey: placement.sessionKey,
					agentId: placement.agentId
				};
				const hasSessionWork = await getSessionWorkAdmissionCheck?.(request);
				const beforeDrain = () => {
					const current = options.placements.get(placement.sessionId);
					if (hasSessionWork?.() || current?.state !== "active" || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.updatedAtMs !== placement.updatedAtMs || current.turnClaim) throw new WorkerPlacementAutoSuspendBusyError();
				};
				await options.dispatch.reclaim(request, void 0, beforeDrain);
				options.info(`auto-suspended ${placement.sessionKey} after ${suspendAfter} idle; wakes on next message`);
			} catch (error) {
				if (error instanceof WorkerPlacementAutoSuspendBusyError) continue;
				options.warn(`Worker auto-suspend failed (${placement.sessionKey}): ${formatErrorMessage(error)}`);
			}
		}
	} };
}
//#endregion
//#region src/gateway/worker-environments/placement-session-retirement.ts
function createPlacementSessionRetirement(deps) {
	const retireCurrent = (placement) => {
		if (placement.turnClaim) return false;
		if (placement.environmentId !== null && placement.state !== "reclaimed" && (placement.state !== "failed" || !isFailedWorkerPlacementEnvironmentGone({
			environmentService: deps.environments,
			placement
		}))) return false;
		if (placement.state === "provisioning") return false;
		deps.placements.retireSessionPlacement({
			sessionId: placement.sessionId,
			expectedState: placement.state,
			expectedGeneration: placement.generation
		});
		if (placement.state === "requested") deps.warn(`Retired ownerless worker placement ${placement.sessionId} because its authoritative session is absent (${placement.state}@${placement.generation})`);
		return true;
	};
	const reconcilePlacement = async (placement, resolveSessionEvidence) => {
		if (await resolveSessionEvidence(placement) !== "absent") return;
		let current = deps.placements.get(placement.sessionId);
		if (!current) return;
		try {
			if (retireCurrent(current)) return;
		} catch {
			return;
		}
		const environmentId = current.environmentId;
		if (!environmentId) return;
		try {
			await deps.forceDestroyEnvironment(environmentId, (error) => {
				deps.warn(`Worker placement orphan cleanup deferred for ${current?.sessionId ?? placement.sessionId}: ${String(error)}`);
			});
		} catch (error) {
			deps.warn(`Worker placement orphan teardown failed for ${current.sessionId}: ${String(error)}`);
			return;
		}
		current = deps.placements.get(placement.sessionId);
		if (!current) return;
		try {
			retireCurrent(current);
		} catch {}
	};
	const reconcile = async () => {
		const placements = deps.placements.list();
		const resolveSessionEvidence = await deps.createSessionEvidenceResolver(placements);
		for (const placement of placements) try {
			await reconcilePlacement(placement, resolveSessionEvidence);
		} catch (error) {
			deps.warn(`Worker placement session evidence check failed for ${placement.sessionId}: ${String(error)}`);
		}
	};
	return { reconcile };
}
//#endregion
//#region src/gateway/worker-environments/reclaimed-placement-redispatch.ts
function createReclaimedPlacementRedispatch(params) {
	return async (placement) => {
		const previousEnvironment = params.environments.get(placement.environmentId);
		if (!previousEnvironment) throw new Error(`Reclaimed worker placement has no environment record: ${placement.environmentId}`);
		let devicePlacement;
		if (previousEnvironment.nodeDeviceId) {
			if (!params.resolveDevicePlacementRequirement) throw new Error("Node-backed redispatch has no authoritative runtime requirement");
			devicePlacement = await params.resolveDevicePlacementRequirement({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId,
				executionMode: placement.executionMode
			});
		}
		return await params.dispatch({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			profileId: previousEnvironment.profileId,
			executionMode: placement.executionMode,
			...devicePlacement ? { devicePlacement } : {},
			...previousEnvironment.providerId === "device" && previousEnvironment.nodeDeviceId ? { deviceId: previousEnvironment.nodeDeviceId } : {},
			inheritedProfile: {
				providerId: previousEnvironment.providerId,
				profileSnapshot: previousEnvironment.profileSnapshot
			}
		});
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-sandbox.ts
function requireRemoteWorkspaceDir(value, nodeCarrier) {
	const windowsPath = nodeCarrier && /^[A-Za-z]:/u.test(value) && value[2] === "\\";
	const remotePath = windowsPath ? path.win32 : path.posix;
	if (!remotePath.isAbsolute(value) || remotePath.parse(value).root === value || remotePath.normalize(value) !== value || value.endsWith(remotePath.sep) || nodeCarrier && (windowsPath ? value.includes("/") : value.includes("\\"))) throw new Error("Remote-exec placement has an invalid managed workspace path");
	return value;
}
/** Builds the node or SSH sandbox owned by one exact active placement generation. */
async function createRemoteExecPlacementSandbox(params) {
	const { placement } = params;
	if (placement.executionMode !== "remote-exec") throw new Error(`Cloud placement ${placement.sessionId} is not a remote-exec placement`);
	const environment = params.environments.get(placement.environmentId);
	if (!environment || environment.state !== "attached" || environment.environmentId !== placement.environmentId || environment.ownerEpoch !== placement.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== placement.sessionId || !environment.leaseId || Boolean(environment.nodeDeviceId) === Boolean(environment.sshEndpoint)) throw new Error(`Remote-exec placement ${placement.sessionId} has no matching active node or SSH environment`);
	const assertCurrentEnvironment = () => {
		const current = params.environments.get(environment.environmentId);
		if (current?.state !== "attached" || current.environmentId !== environment.environmentId || current.ownerEpoch !== environment.ownerEpoch || current.leaseId !== environment.leaseId || current.nodeDeviceId !== environment.nodeDeviceId || !isDeepStrictEqual(current.sshEndpoint, environment.sshEndpoint) || current.attachedSessionIds.length !== 1 || current.attachedSessionIds[0] !== placement.sessionId) throw new Error(`Remote-exec placement ${placement.sessionId} lost its exact environment`);
	};
	const remoteWorkspaceDir = requireRemoteWorkspaceDir(placement.remoteWorkspaceDir, Boolean(environment.nodeDeviceId));
	const runtimeId = [
		"remote-exec",
		environment.environmentId,
		environment.ownerEpoch,
		placement.generation
	].join(":");
	const base = resolveSandboxConfigForAgent(params.config, placement.agentId);
	const { binds: _ignoredBinds, ...docker } = base.docker;
	const common = {
		enabled: true,
		placementExecutionMode: "remote-exec",
		sessionKey: placement.sessionKey,
		workspaceDir: params.localWorkspaceDir,
		agentWorkspaceDir: params.localWorkspaceDir,
		workspaceAccess: "rw",
		runtimeId,
		runtimeLabel: runtimeId,
		containerName: runtimeId,
		containerWorkdir: remoteWorkspaceDir,
		docker,
		tools: base.tools,
		browserAllowHostControl: false
	};
	if (environment.nodeDeviceId) {
		assertCurrentEnvironment();
		return {
			...common,
			backendId: "node",
			placementNodeId: environment.nodeDeviceId,
			placementEnvironmentId: environment.environmentId,
			placementSessionId: placement.sessionId,
			placementOwnerEpoch: environment.ownerEpoch
		};
	}
	const sshEndpoint = environment.sshEndpoint;
	const resolveSshIdentity = params.environments.resolveSshIdentity;
	if (!sshEndpoint || !resolveSshIdentity) throw new Error("Remote-exec SSH sandbox identity resolver is unavailable");
	const identity = await resolveSshIdentity(environment.environmentId);
	assertCurrentEnvironment();
	const ssh = resolveWorkerSshSandboxSettings({
		ssh: sshEndpoint,
		identity
	});
	const cfg = {
		...base,
		mode: "all",
		backend: "ssh",
		scope: "session",
		workspaceAccess: "rw",
		docker,
		ssh: {
			...base.ssh,
			...ssh,
			workspaceRoot: path.posix.dirname(remoteWorkspaceDir)
		},
		browser: {
			...base.browser,
			enabled: false,
			allowHostControl: false
		},
		prune: {
			idleHours: 0,
			maxAgeDays: 0
		}
	};
	const backend = await createPreprovisionedSshSandboxBackend({
		sessionKey: placement.sessionKey,
		scopeKey: placement.sessionKey,
		workspaceDir: params.localWorkspaceDir,
		agentWorkspaceDir: params.localWorkspaceDir,
		cfg
	}, {
		runtimeId,
		remoteWorkspaceDir
	});
	assertCurrentEnvironment();
	const sandbox = {
		...common,
		backendId: "ssh",
		backend
	};
	sandbox.fsBridge = backend.createFsBridge?.({ sandbox }) ?? createSandboxFsBridge({ sandbox });
	return sandbox;
}
//#endregion
//#region src/gateway/worker-environments/worker-tool-authority.ts
function resolveWorkerCapabilityProfile(params) {
	const turn = params.turn;
	const sandboxSessionKey = turn.sandboxSessionKey?.trim() || turn.sessionKey?.trim() || turn.sessionId;
	const sandbox = resolveSandboxRuntimeStatus({
		cfg: turn.config,
		sessionKey: sandboxSessionKey,
		agentId: turn.agentId
	});
	return resolveConversationCapabilityProfile({
		config: turn.config,
		sessionKey: sandboxSessionKey,
		runSessionKey: turn.sessionKey && turn.sessionKey !== sandboxSessionKey ? turn.sessionKey : void 0,
		sessionId: turn.sessionId,
		runId: turn.runId,
		agentId: turn.agentId,
		agentDir: turn.agentDir,
		agentAccountId: turn.agentAccountId,
		messageProvider: turn.messageProvider,
		messageChannel: turn.messageChannel,
		chatType: turn.chatType,
		messageTo: turn.messageTo,
		messageThreadId: turn.messageThreadId,
		currentChannelId: turn.currentChannelId,
		currentMessagingTarget: turn.currentMessagingTarget,
		currentThreadTs: turn.currentThreadTs,
		currentMessageId: turn.currentMessageId,
		groupId: turn.groupId,
		groupChannel: turn.groupChannel,
		groupSpace: turn.groupSpace,
		memberRoleIds: turn.memberRoleIds,
		spawnedBy: turn.spawnedBy,
		senderId: turn.senderId,
		senderName: turn.senderName,
		senderUsername: turn.senderUsername,
		senderE164: turn.senderE164,
		senderIsOwner: turn.senderIsOwner,
		modelProvider: params.modelRef.provider,
		modelId: params.modelRef.model,
		workspaceDir: turn.workspaceDir,
		cwd: turn.cwd,
		isCanonicalWorkspace: turn.isCanonicalWorkspace,
		promptMode: turn.promptMode,
		skillsSnapshot: turn.skillsSnapshot,
		sandboxToolPolicy: sandbox.sandboxed ? sandbox.toolPolicy : void 0,
		runtimeToolAllowlist: turn.toolsAllow,
		inheritRuntimeToolAllowlist: true,
		runtimePluginToolGrant: turn.runtimePluginToolGrant,
		inputProvenance: turn.inputProvenance,
		trustedInternalHandoff: turn.trustedInternalHandoff,
		scheduledToolPolicy: turn.scheduledToolPolicy
	});
}
/** Resolves the final fixed worker surface at the trusted Gateway handoff boundary. */
function resolveWorkerToolAuthority(params) {
	const turn = params.turn;
	if (turn.disableTools === true || turn.modelRun === true || turn.promptMode === "none") return { allowedToolNames: [] };
	const runtimeCappedTools = applyEmbeddedAttemptToolsAllow([
		...WORKER_REQUIRED_LOCAL_TOOL_NAMES,
		...params.availableOptionalToolNames ?? [],
		...WORKER_SESSION_TOOL_NAMES.filter((name) => name === "github_publish" ? params.githubPublicationAvailable === true : name !== "portal" || params.portalAvailable === true)
	].map((name) => ({ name })), turn.toolsAllow);
	return { allowedToolNames: projectConversationToolNames({
		capabilityProfile: resolveWorkerCapabilityProfile(params),
		toolNames: runtimeCappedTools.map((tool) => tool.name),
		warn: logWarn
	}) };
}
//#endregion
//#region src/gateway/worker-environments/worker-browser-launch-plan.ts
/** Plans the optional Browser surface from persisted provider metadata and normal tool policy. */
function resolveWorkerBrowserLaunchPlan(params) {
	const browserApp = params.desktop?.apps?.find((app) => app.id === "browser");
	const browserAvailable = browserApp !== void 0 && params.turn.config?.browser?.enabled !== false && resolveManifestActivationPluginIds({
		trigger: {
			kind: "capability",
			capability: "tool"
		},
		config: params.turn.config,
		onlyPluginIds: ["browser"]
	}).includes("browser");
	const toolAuthority = resolveWorkerToolAuthority({
		modelRef: params.modelRef,
		turn: params.turn,
		githubPublicationAvailable: params.githubPublicationAvailable,
		portalAvailable: params.portalAvailable,
		...browserAvailable ? { availableOptionalToolNames: ["browser"] } : {}
	});
	return {
		toolAuthority,
		...browserApp && toolAuthority.allowedToolNames.includes("browser") ? { browser: {
			cdpUrl: `http://127.0.0.1:${browserApp.cdpPort}`,
			launcherPath: browserApp.executablePath
		} } : {}
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-failure.ts
var WorkerTurnExecutionError = class extends Error {};
const TERMINAL_WORKER_CLEANUP_GRACE_MS = 3e4;
function workerTurnRecoveryError(error) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/gu, " ").trim() || "cloud worker turn failed", 1024);
}
async function failHandedOffTurn(params) {
	const failures = [workerTurnRecoveryError(params.error)];
	let drained;
	try {
		drained = params.placements.startDrain({
			sessionId: params.placement.sessionId,
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch,
			expectedGeneration: params.placement.generation
		});
	} catch {
		const current = params.placements.get(params.placement.sessionId);
		if (current?.state === "draining" && current.generation === params.placement.generation + 1 && current.environmentId === params.placement.environmentId && current.activeOwnerEpoch === params.placement.activeOwnerEpoch && params.placements.validateTurnClaim(params.turnClaim)) await releaseClaimIfOwned(params.placements, params.turnClaim);
		return;
	}
	if (drained.state !== "draining") return;
	const draining = drained;
	await releaseClaimIfOwned(params.placements, params.turnClaim);
	const isCurrentDrain = () => {
		const current = params.placements.get(draining.sessionId);
		return current?.state === "draining" && current.generation === draining.generation && current.environmentId === draining.environmentId && current.activeOwnerEpoch === draining.activeOwnerEpoch && current.turnClaim === null;
	};
	const recordFailure = () => {
		if (!isCurrentDrain()) return;
		try {
			const reconciling = params.placements.startReconcile({
				sessionId: draining.sessionId,
				environmentId: draining.environmentId,
				ownerEpoch: draining.activeOwnerEpoch,
				expectedGeneration: draining.generation
			});
			const recoveryError = failures.join("; ");
			params.placements.fail({
				sessionId: reconciling.sessionId,
				expectedGeneration: reconciling.generation,
				recoveryError
			});
			return recoveryError;
		} catch {
			return;
		}
	};
	const terminalRecovery = params.terminal ? createDeferredCore() : void 0;
	if (params.terminal && terminalRecovery) {
		const observedAtMs = params.terminal.observedAtMs;
		params.terminal.registerRecovery(() => {
			if (Date.now() - observedAtMs < TERMINAL_WORKER_CLEANUP_GRACE_MS) return;
			const recorded = recordFailure();
			if (recorded !== void 0) terminalRecovery.resolve();
			return recorded;
		});
	}
	const waitForCleanup = (operation) => terminalRecovery ? Promise.race([operation, terminalRecovery.promise]) : operation;
	if (!isCurrentDrain()) return;
	try {
		await waitForCleanup(params.environments.stopTunnel(params.placement.environmentId, params.placement.activeOwnerEpoch));
	} catch (error) {
		failures.push(`tunnel stop: ${workerTurnRecoveryError(error)}`);
	}
	if (!isCurrentDrain()) return;
	try {
		await waitForCleanup(params.environments.destroy(params.placement.environmentId));
	} catch (error) {
		failures.push(`environment destroy: ${workerTurnRecoveryError(error)}`);
	}
	recordFailure();
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-payload.ts
function buildWorkerAgentRuntimeIdentity(params) {
	const { turn } = params;
	return {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		operationalRunInstance: params.admittedRunContext.operationalRunInstance,
		executionIdentityToken: params.admittedRunContext.executionIdentityToken,
		turnSourceChannel: turn.messageChannel ?? turn.messageProvider,
		turnSourceTo: turn.currentMessagingTarget ?? turn.currentChannelId,
		turnSourceAccountId: turn.agentAccountId,
		turnSourceThreadId: turn.currentThreadTs,
		workerTurnClaim: params.turnClaim
	};
}
async function prepareWorkerAgentRuntimeIdentity(params) {
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: params.turn.runId,
		runtimeKind: "worker",
		runtimeInstanceId: params.runtimeInstanceId,
		admittedRunContext: params.turn.admittedRunContext,
		preparedRunAdmission: params.turn.preparedRunAdmission
	});
	const runtimeIdentity = buildWorkerAgentRuntimeIdentity({
		...params,
		admittedRunContext
	});
	if (runtimeIdentity.executionIdentityToken) bindWorkerTurnExecutionIdentity(params.placements, params.turnClaim, runtimeIdentity.executionIdentityToken, admittedRunContext.operationalRunInstance, {
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	bindWorkerTurnAdmissionContinuation(params.placements, params.turnClaim, admittedRunContext.operationalRunInstance);
	return {
		operationalRunInstance: admittedRunContext.operationalRunInstance,
		runtimeIdentity
	};
}
function emitProviderReplayRejected(config, details) {
	if (isDiagnosticsEnabled(config)) emitTrustedDiagnosticEvent({
		type: "payload.large",
		surface: "worker.provider-replay",
		action: "rejected",
		...details
	});
}
function windowInitialMessages(messages) {
	const windowed = windowWorkerReplayMessages(messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES - 1);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const projected = [];
	for (const message of windowed.messages) {
		const result = toWorkerTranscriptMessage(message, "inference");
		if (!result) continue;
		if (result.kind === "provider-replay-unavailable") return result;
		projected.push(result.message);
	}
	return {
		kind: "complete",
		messages: projected
	};
}
const WORKER_LAUNCH_ENDPOINT_OVERHEAD_BYTES = 4608;
/** Fits replay context before minting the exact worker-bound identity bearer. */
async function fitLaunchDescriptorWithRuntimeIdentity(params) {
	const tokenBytes = measureAgentRuntimeIdentityTokenBytes(params.runtimeIdentity);
	const plan = fitLaunchDescriptor((messages) => params.build("x".repeat(tokenBytes), messages), params.messages);
	if (plan.kind !== "launch") return plan;
	const token = await mintAgentRuntimeIdentityToken(params.runtimeIdentity);
	if (Buffer.byteLength(token, "utf8") !== tokenBytes) throw new Error("Agent runtime identity changed while preparing worker launch");
	return {
		kind: "launch",
		plan: {
			...plan.plan,
			assignment: {
				...plan.plan.assignment,
				agentRuntimeIdentityToken: token
			}
		}
	};
}
function fitLaunchDescriptor(build, messages) {
	let initialMessages = messages;
	while (true) {
		const plan = build(initialMessages);
		const bytes = Buffer.byteLength(JSON.stringify(plan), "utf8") + WORKER_LAUNCH_ENDPOINT_OVERHEAD_BYTES;
		if (bytes <= 26214400) return {
			kind: "launch",
			plan
		};
		const replayIndex = initialMessages.findLastIndex((message) => message.role === "assistant" && message.providerReplay !== void 0);
		if (replayIndex === 0) return {
			kind: "local-fallback",
			reason: "provider-replay-launch-payload-limit",
			bytes,
			limitBytes: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
		};
		const nextTurn = initialMessages.findIndex((message, index) => index > 0 && message.role === "user");
		const nextStart = replayIndex > 0 && (nextTurn < 0 || nextTurn > replayIndex) ? replayIndex : nextTurn;
		if (nextStart < 0) throw new Error("Worker turn context exceeds the launch descriptor payload limit");
		initialMessages = initialMessages.slice(nextStart);
	}
}
function parseRuntimeResult(stdout) {
	let value;
	try {
		value = JSON.parse(stdout.trim());
	} catch (error) {
		throw new Error("Worker process returned invalid output", { cause: error });
	}
	const result = parseWorkerRuntimeResult(value);
	if (!result) throw new Error("Worker process returned invalid output");
	if (result.status === "not-started") throw new Error(result.errorText);
	return result;
}
function assistantText(message) {
	if (message.role !== "assistant") return "";
	return message.content.flatMap((part) => part.type === "text" ? [part.text] : []).join("");
}
function buildWorkerAgentMeta(params) {
	const usageAccumulator = createUsageAccumulator();
	const assistants = params.messages.filter((message) => message.role === "assistant");
	let lastRunPromptUsage;
	for (const assistant of assistants) {
		const usage = normalizeUsage(assistant.usage);
		mergeUsageIntoAccumulator(usageAccumulator, usage);
		if (hasNonzeroUsage(usage)) lastRunPromptUsage = usage;
	}
	const lastAssistant = assistants.at(-1);
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator,
		latestUsage: lastAssistant?.usage,
		lastRunPromptUsage
	});
	const reportedModelRef = resolveReportedModelRef({
		...params.modelRef,
		assistant: lastAssistant
	});
	return {
		provider: reportedModelRef.provider,
		model: reportedModelRef.model,
		usage: usageMeta.usage,
		lastCallUsage: usageMeta.lastCallUsage,
		promptTokens: usageMeta.promptTokens
	};
}
function resolveTurnModelRef(params) {
	const explicitProvider = params.provider?.trim();
	const explicitModel = params.model?.trim();
	const defaults = explicitProvider && explicitModel ? void 0 : resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	return {
		provider: explicitProvider ?? defaults?.provider ?? "",
		model: explicitModel ?? defaults?.model ?? ""
	};
}
function assertSupportedTurn(params) {
	if (params.images?.length || params.imageOrder?.length) throw new Error("Cloud worker turns do not yet support current-turn image input");
	if (params.clientTools?.length) throw new Error("Cloud worker turns do not support client-provided tools");
	const modelRef = resolveTurnModelRef(params);
	const explicitRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId) ?? normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const runtime = explicitRuntime && !isDefaultAgentRuntimeId(explicitRuntime) ? explicitRuntime : resolveEffectiveAgentRuntime({
		cfg: params.config ?? {},
		provider: modelRef.provider,
		modelId: modelRef.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	if (runtime !== "openclaw") throw new Error(`Cloud worker turns require the OpenClaw runtime, not ${runtime}`);
	return modelRef;
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-launcher.ts
async function executeWorkerTurn(params) {
	const { placement, turn } = params;
	const modelRef = assertSupportedTurn(turn);
	const environment = params.environments.get(placement.environmentId);
	const bootstrapReceipt = environment?.bootstrapReceipt;
	if (environment?.error === "Worker build does not match the current Gateway build; redispatch the session so its worker can bootstrap the current build before retrying.") throw new StaleWorkerBuildError();
	if (!environment || environment.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || !bootstrapReceipt || bootstrapReceipt.bundleHash !== placement.workerBundleHash || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== placement.sessionId) throw new Error("Active worker placement does not match its attached environment");
	if (!supportsWorkerExecutionContextLaunch(bootstrapReceipt)) throw new Error("Active worker bundle lacks the current execution-context capability; reprovision the worker before launch");
	await recoverWorkspaceBeforeTurn(params);
	const githubPublicationAvailable = await prepareGitHubPublicationAvailability({
		sessionId: placement.sessionId,
		sessionKey: placement.sessionKey,
		agentId: placement.agentId,
		assertCurrent: () => params.placements.validateTurnClaim(params.turnClaim)
	});
	const startedAt = Date.now();
	turn.onExecutionStarted?.({ lifecycleGeneration: turn.lifecycleGeneration });
	turn.onExecutionPhase?.({
		phase: "runner_entered",
		backend: "cloud-worker"
	});
	const transcriptTarget = resolveWorkerTurnTranscriptTarget(turn);
	const manager = SessionManager.open(transcriptTarget);
	const userMessageAlreadyPersisted = turn.suppressNextUserMessagePersistence === true || turn.userTurnTranscriptRecorder?.hasPersisted() === true;
	const contextMessages = convertToLlm(manager.buildSessionContext().messages);
	const leaf = manager.getLeafEntry();
	const initialMessagePlan = windowInitialMessages(userMessageAlreadyPersisted && leaf?.type === "message" && leaf.message.role === "user" ? contextMessages.slice(0, -1) : contextMessages);
	if (initialMessagePlan.kind === "provider-replay-unavailable") {
		const details = initialMessagePlan.details;
		emitProviderReplayRejected(turn.config, "bytes" in details ? details : {
			count: details.messageCount,
			reason: details.reason
		});
		throw new WorkerTurnExecutionError(WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
	}
	const initialMessages = initialMessagePlan.messages;
	let baseLeafId = manager.getLeafId();
	if (!userMessageAlreadyPersisted) {
		const persisted = turn.userTurnTranscriptRecorder ? await turn.userTurnTranscriptRecorder.persistApproved({ cwd: params.localWorkspaceDir }) : void 0;
		if (persisted) {
			baseLeafId = persisted.messageId;
			turn.userTurnTranscriptRecorder?.markRuntimePersisted(persisted.message, persisted.admission);
			turn.onUserMessagePersisted?.(persisted.message);
		} else if (turn.userTurnTranscriptRecorder?.hasPersisted()) baseLeafId = SessionManager.open(transcriptTarget).getLeafId();
		else if (!turn.userTurnTranscriptRecorder) {
			const message = {
				role: "user",
				content: [{
					type: "text",
					text: turn.transcriptPrompt ?? turn.prompt
				}],
				timestamp: Date.now()
			};
			baseLeafId = manager.appendMessage(message);
			turn.onUserMessagePersisted?.(message);
		} else throw new Error("Cloud worker turn could not persist its canonical user message");
	}
	turn.onExecutionPhase?.({
		phase: "model_resolution",
		backend: "cloud-worker",
		provider: modelRef.provider,
		model: modelRef.model
	});
	const credential = await params.environments.acquireTurnCredential(params.turnClaim);
	const tunnel = await waitForTurnOperation({
		operation: params.environments.startTunnel({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		}),
		...turn.abortSignal ? { signal: turn.abortSignal } : {},
		timeoutMs: turn.timeoutMs
	});
	const portalAvailable = Boolean(environment.nodeDeviceId) && environment.sshEndpoint === null && await params.environments.supportsNodePortal?.(placement.environmentId, placement.activeOwnerEpoch) === true;
	const reasoning = mapThinkingLevelForProvider(turn.thinkLevel);
	const { browser, toolAuthority } = resolveWorkerBrowserLaunchPlan({
		desktop: environment.desktop,
		modelRef,
		turn,
		githubPublicationAvailable,
		portalAvailable
	});
	params.placements.authorizeWorkerTurnTools(params.turnClaim, toolAuthority.allowedToolNames);
	const { operationalRunInstance, runtimeIdentity } = await prepareWorkerAgentRuntimeIdentity({
		agentId: placement.agentId,
		runtimeInstanceId: placement.environmentId,
		placements: params.placements,
		sessionKey: placement.sessionKey,
		turn,
		turnClaim: params.turnClaim
	});
	const { bundleHash, openclawVersion, protocolFeatures } = bootstrapReceipt;
	const launchPlan = await fitLaunchDescriptorWithRuntimeIdentity({
		runtimeIdentity,
		messages: initialMessages,
		build: (agentRuntimeIdentityToken, windowedMessages) => parseWorkerLaunchPlan({
			version: 4,
			admission: {
				environmentId: placement.environmentId,
				credential: credential.credential,
				sessionId: placement.sessionId,
				ownerEpoch: placement.activeOwnerEpoch,
				rpcSetVersion: credential.rpcSetVersion,
				handshake: {
					bundleHash,
					openclawVersion,
					protocolFeatures
				}
			},
			assignment: {
				agentId: placement.agentId,
				operationalRunInstance,
				agentRuntimeIdentityToken,
				runId: turn.runId,
				turnId: randomUUID(),
				prompt: turn.prompt,
				suppressPromptTranscript: true,
				workspaceDir: placement.remoteWorkspaceDir,
				...turn.permissionMode ? {
					permissionMode: turn.permissionMode,
					workerContainmentRoot: placement.remoteWorkspaceDir
				} : {},
				modelRef,
				inferenceOptions: reasoning ? { reasoning } : {},
				...turn.extraSystemPrompt === void 0 ? {} : { systemPrompt: turn.extraSystemPrompt },
				initialMessages: windowedMessages,
				transcript: {
					baseLeafId,
					nextSeq: (placement.lastTranscriptAckCursor ?? 0) + 1
				},
				liveEvents: {
					ackedSeq: placement.lastLiveEventAckCursor ?? 0,
					nextSeq: (placement.lastLiveEventAckCursor ?? 0) + 1
				},
				toolAuthority,
				...browser ? { browser } : {}
			}
		})
	});
	if (launchPlan.kind === "local-fallback") {
		emitProviderReplayRejected(turn.config, {
			bytes: launchPlan.bytes,
			limitBytes: launchPlan.limitBytes,
			reason: launchPlan.reason
		});
		throw new WorkerTurnExecutionError(WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
	}
	const plan = launchPlan.plan;
	turn.userTurnTranscriptRecorder?.markSentToProvider?.();
	turn.onExecutionPhase?.({
		phase: "attempt_dispatch",
		backend: "cloud-worker"
	});
	const handoffAbort = new AbortController();
	let handoffError;
	let dispatchReady = false;
	const onDispatchReady = () => {
		if (dispatchReady) return;
		dispatchReady = true;
		params.onHandoff();
		turn.onExecutionPhase?.({
			phase: "process_spawned",
			backend: "cloud-worker"
		});
		try {
			if (!params.environments.acknowledgeCredentialDelivery(credential)) handoffError = /* @__PURE__ */ new Error("Cloud worker credential owner changed during process handoff");
		} catch (error) {
			handoffError = new Error("Cloud worker credential handoff failed", { cause: error });
		}
		if (handoffError) handoffAbort.abort(handoffError);
	};
	if (!tunnel.launchTurn) throw new Error("Worker tunnel does not support worker turns");
	const processResult = await tunnel.launchTurn({
		plan,
		turnClaim: params.turnClaim,
		timeoutMs: turn.timeoutMs,
		credentialExpiresAtMs: credential.expiresAtMs,
		signal: turn.abortSignal ? AbortSignal.any([turn.abortSignal, handoffAbort.signal]) : handoffAbort.signal,
		onDispatchReady
	});
	if (environment.nodeDeviceId && environment.sshEndpoint === null) params.onTerminal();
	if (handoffError) throw handoffError;
	if (!dispatchReady) throw new Error("Cloud worker launch completed before transport dispatch");
	if (processResult.code !== 0 || processResult.signal !== null || processResult.killed) {
		const detail = truncateUtf16Safe(redactSensitiveText(processResult.stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 400);
		throw new Error(detail ? `Cloud worker process failed before completing the turn: ${detail}` : "Cloud worker process failed before completing the turn");
	}
	const runtimeResult = parseRuntimeResult(processResult.stdout);
	if (runtimeResult.status === "fenced") throw new Error(`Cloud worker turn was fenced: ${runtimeResult.reason}`);
	const workerTurnFailed = runtimeResult.status === "failed";
	const completed = SessionManager.open(transcriptTarget);
	const currentPlacement = params.placements.get(placement.sessionId);
	if (runtimeResult.transcriptLeafId !== completed.getLeafId() || runtimeResult.transcriptNextSeq !== (currentPlacement?.lastTranscriptAckCursor ?? 0) + 1) throw new Error(`Cloud worker result does not match its committed transcript acknowledgement (leaf=${runtimeResult.transcriptLeafId ?? "none"}/${completed.getLeafId() ?? "none"}, nextSeq=${runtimeResult.transcriptNextSeq}/${(currentPlacement?.lastTranscriptAckCursor ?? 0) + 1})`);
	const terminal = runtimeResult.transcriptLeafId ? completed.getEntry(runtimeResult.transcriptLeafId) : void 0;
	if (!terminal || terminal.type !== "message" || terminal.message.role !== "assistant") throw new Error("Cloud worker completed without a terminal assistant transcript message");
	const text = assistantText(terminal.message);
	const baseIndex = completed.getBranch().findIndex((entry) => entry.id === baseLeafId);
	const workerMessages = completed.getBranch().slice(baseIndex + 1).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
	const workspaceConflict = await reconcileWorkspaceAfterTurn({
		placement,
		placements: params.placements,
		turnClaim: params.turnClaim,
		workspaceOperations: params.workspaceOperations,
		localWorkspaceDir: params.localWorkspaceDir,
		transcriptTarget,
		tunnel,
		...params.prepareAcceptedWorkspacePublication ? { prepareAcceptedWorkspacePublication: params.prepareAcceptedWorkspacePublication } : {},
		...params.publishAcceptedWorkspace ? { publishAcceptedWorkspace: params.publishAcceptedWorkspace } : {}
	});
	if (workspaceConflict) {
		const reportedWorkspaceConflict = workspaceConflict;
		await Promise.resolve().then(() => turn.onAgentEvent?.({
			stream: "assistant",
			data: {
				text: text ? `${text}\n\n${reportedWorkspaceConflict.summary}` : reportedWorkspaceConflict.summary,
				delta: `${text ? "\n\n" : ""}${reportedWorkspaceConflict.summary}`
			}
		})).catch(() => void 0);
	}
	if (workerTurnFailed) throw new WorkerTurnExecutionError(terminal.message.errorMessage ?? "Cloud worker turn failed");
	const replyText = workspaceConflict ? text ? `${text}\n\n${workspaceConflict.summary}` : workspaceConflict.summary : text;
	return {
		...replyText ? { payloads: [{ text: replyText }] } : {},
		meta: {
			durationMs: Date.now() - startedAt,
			agentMeta: {
				sessionId: placement.sessionId,
				sessionFile: turn.sessionFile,
				...buildWorkerAgentMeta({
					messages: workerMessages,
					modelRef
				})
			},
			stopReason: terminal.message.stopReason
		}
	};
}
function createWorkerSessionTurnPlacementProvider(options) {
	const activeWorkerTurns = /* @__PURE__ */ new Map();
	return {
		recoverTerminalTurn(session) {
			const active = activeWorkerTurns.get(session.sessionId);
			return active && (!session.sessionKey || active.sessionKey === session.sessionKey) ? active.recoverTerminal?.() : void 0;
		},
		async resolveSandbox(params) {
			const placement = options.placements.get(params.sessionId);
			if (placement?.state !== "active" || placement.executionMode !== "remote-exec" || placement.agentId !== params.agentId || placement.sessionKey !== params.sessionKey) return null;
			const localWorkspaceDir = await options.resolveWorkspacePath({
				sessionId: placement.sessionId,
				agentId: placement.agentId,
				sessionKey: placement.sessionKey
			});
			const preparedPlacement = options.placements.get(params.sessionId);
			if (preparedPlacement?.state !== "active" || preparedPlacement.executionMode !== "remote-exec" || preparedPlacement.agentId !== placement.agentId || preparedPlacement.sessionKey !== placement.sessionKey || preparedPlacement.environmentId !== placement.environmentId || preparedPlacement.activeOwnerEpoch !== placement.activeOwnerEpoch || preparedPlacement.generation !== placement.generation) throw new Error("Remote-exec placement changed while preparing its managed workspace");
			const sandbox = await createRemoteExecPlacementSandbox({
				config: params.config,
				environments: {
					get: options.environments.get,
					...options.environments.resolveSshIdentity ? { resolveSshIdentity: options.environments.resolveSshIdentity } : {}
				},
				localWorkspaceDir,
				placement
			});
			const current = options.placements.get(params.sessionId);
			if (current?.state !== "active" || current.executionMode !== "remote-exec" || current.agentId !== placement.agentId || current.sessionKey !== placement.sessionKey || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.generation !== placement.generation) throw new Error("Remote-exec placement changed while preparing its sandbox");
			const currentEnvironment = options.environments.get(placement.environmentId);
			if (currentEnvironment?.state !== "attached" || currentEnvironment.environmentId !== placement.environmentId || currentEnvironment.ownerEpoch !== placement.activeOwnerEpoch || currentEnvironment.attachedSessionIds.length !== 1 || currentEnvironment.attachedSessionIds[0] !== placement.sessionId || sandbox.backendId === "node" && "placementNodeId" in sandbox && currentEnvironment.nodeDeviceId !== sandbox.placementNodeId) throw new Error("Remote-exec environment changed while preparing its sandbox");
			return sandbox;
		},
		async executeLocalTurn(claim, runLocal) {
			return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
		},
		async executeTurn(claim, turn, runLocal, onAdmitted) {
			const current = options.placements.get(claim.sessionId);
			if (!current && turn.modelRun === true && !claim.sessionKey?.trim()) return await runLocal();
			if (!current || current.state === "local") return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
			let identity = resolvePlacementIdentity(claim, current);
			let routablePlacement = current;
			if (routablePlacement.state === "reclaimed") {
				emitAgentRunStatusEvent({
					runId: claim.runId,
					phase: "provisioning_environment",
					sessionKey: identity.sessionKey,
					agentId: identity.agentId
				});
				routablePlacement = await options.redispatchReclaimed(routablePlacement);
				identity = resolvePlacementIdentity({
					...claim,
					agentId: identity.agentId,
					sessionKey: identity.sessionKey
				}, routablePlacement);
			}
			if (routablePlacement.state === "draining" && options.placements.listPendingWorkspaceResults().some((pending) => pending.sessionId === identity.sessionId)) await rejectPendingWorkerResult({
				placements: options.placements,
				sessionId: identity.sessionId,
				...turn.abortSignal ? { signal: turn.abortSignal } : {}
			});
			let placement = requireActivePlacement(routablePlacement);
			const localWorkspaceDir = await options.resolveWorkspacePath(identity);
			const remoteExec = placement.executionMode === "remote-exec";
			let turnClaim;
			if (remoteExec) {
				turnClaim = options.placements.claimTurn({
					...identity,
					claimId: randomUUID(),
					runId: claim.runId,
					owner: placementTurnOwner(placement)
				});
				const refreshed = options.placements.get(claim.sessionId);
				if (refreshed?.state !== "active" || refreshed.executionMode !== "remote-exec" || refreshed.environmentId !== placement.environmentId || refreshed.activeOwnerEpoch !== placement.activeOwnerEpoch || refreshed.generation !== turnClaim.placementGeneration) {
					await releaseClaimIfOwned(options.placements, turnClaim);
					throw new Error("Remote-exec placement changed during turn admission");
				}
				placement = refreshed;
			} else {
				const admitted = await claimWorkerTurn({
					placements: options.placements,
					identity,
					placement,
					runId: claim.runId,
					isCancellationRequested: (activeClaim) => {
						const active = activeWorkerTurns.get(activeClaim.sessionId);
						return Boolean(active?.signal?.aborted && sameWorkerSessionTurnClaim(active.claim, activeClaim));
					},
					...turn.abortSignal ? { signal: turn.abortSignal } : {}
				});
				placement = admitted.placement;
				turnClaim = admitted.turnClaim;
			}
			const activeWorkerTurn = !remoteExec ? {
				claim: turnClaim,
				sessionKey: placement.sessionKey,
				signal: turn.abortSignal
			} : void 0;
			if (activeWorkerTurn) activeWorkerTurns.set(turnClaim.sessionId, activeWorkerTurn);
			let handedOff = false;
			let terminalAtMs;
			try {
				onAdmitted?.();
				const executionParams = {
					environments: options.environments,
					onHandoff: () => {
						handedOff = true;
					},
					onTerminal: () => {
						terminalAtMs = Date.now();
					},
					placement,
					placements: options.placements,
					reconcileActivePlacement: options.reconcileActivePlacement,
					localWorkspaceDir,
					...options.prepareAcceptedWorkspacePublication ? { prepareAcceptedWorkspacePublication: options.prepareAcceptedWorkspacePublication } : {},
					...options.publishAcceptedWorkspace ? { publishAcceptedWorkspace: options.publishAcceptedWorkspace } : {},
					workspaceOperations: options.workspaceOperations,
					turn,
					turnClaim
				};
				return remoteExec ? await executeRemoteExecTurn({
					...executionParams,
					runLocal
				}) : await executeWorkerTurn(executionParams);
			} catch (error) {
				if (error instanceof StaleWorkerBuildError) {
					await options.reconcileActivePlacement(placement.environmentId);
					const reconciled = options.placements.get(placement.sessionId);
					if (reconciled) requireActivePlacement(reconciled);
				}
				const pendingWorkspaceResult = options.placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === turnClaim.sessionId && pending.claimId === turnClaim.claimId && pending.runId === turnClaim.runId);
				if (pendingWorkspaceResult) {
					if (turnClaim.owner.kind === "local") options.placements.failWorkspaceResultAndReleaseTurn(pendingWorkspaceResult, error);
					else options.placements.handoffWorkspaceResultRecovery(turnClaim);
					await options.reconcileActivePlacement(placement.environmentId);
					throw error;
				}
				if (error instanceof WorkerRunnerCapacityError || error instanceof WorkerRunnerUnavailableError && !handedOff || !remoteExec && handedOff && turn.abortSignal?.aborted) {
					await releaseClaimIfOwned(options.placements, turnClaim);
					throw error;
				}
				const settledPlacement = options.placements.get(turnClaim.sessionId);
				if (remoteExec && settledPlacement?.state === "active" && settledPlacement.environmentId === placement.environmentId && settledPlacement.activeOwnerEpoch === placement.activeOwnerEpoch && settledPlacement.turnClaim === null) throw error;
				if (error instanceof WorkerWorkspaceReconciliationError && !handedOff) {
					await releaseClaimIfOwned(options.placements, turnClaim);
					throw error;
				}
				if (error instanceof WorkerTurnExecutionError) {
					if (options.placements.validateTurnClaim(turnClaim)) {
						await releaseClaimIfOwned(options.placements, turnClaim);
						throw error;
					}
					const workerSettledPlacement = options.placements.get(turnClaim.sessionId);
					if (workerSettledPlacement?.state === "active" && workerSettledPlacement.environmentId === placement.environmentId && workerSettledPlacement.activeOwnerEpoch === placement.activeOwnerEpoch && workerSettledPlacement.turnClaim === null) throw error;
				}
				if (handedOff) await failHandedOffTurn({
					environments: options.environments,
					placements: options.placements,
					placement,
					turnClaim,
					error,
					...activeWorkerTurn && terminalAtMs !== void 0 ? { terminal: {
						observedAtMs: terminalAtMs,
						registerRecovery: (recover) => {
							activeWorkerTurn.recoverTerminal = recover;
						}
					} } : {}
				});
				else await releaseClaimIfOwned(options.placements, turnClaim);
				throw error;
			} finally {
				if (activeWorkerTurn && activeWorkerTurns.get(turnClaim.sessionId) === activeWorkerTurn) activeWorkerTurns.delete(turnClaim.sessionId);
			}
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-operation-coordinator.ts
/** Serializes local workspace mutation and forced teardown per environment. */
function createWorkerWorkspaceOperationCoordinator() {
	const tails = /* @__PURE__ */ new Map();
	return { async run(environmentId, operation) {
		const result = (tails.get(environmentId) ?? Promise.resolve()).catch(() => void 0).then(operation);
		const tail = result.then(() => void 0, () => void 0);
		tails.set(environmentId, tail);
		tail.finally(() => {
			if (tails.get(environmentId) === tail) tails.delete(environmentId);
		});
		return await result;
	} };
}
//#endregion
//#region src/gateway/worker-workspace-conflict-transcript.ts
function createWorkerWorkspaceConflictTranscriptHandlers(loadSessionRuntime) {
	async function withWorkerTranscript(identity, run, missingMessage, strictIdentity = false) {
		const runtime = await loadSessionRuntime();
		const target = runtime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: identity.sessionKey,
			agentId: identity.agentId,
			clone: false
		});
		return await withTranscriptWriteTransaction({
			agentId: target.agentId,
			sessionId: identity.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, (transcriptTarget) => {
			if (runtime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== identity.sessionId || strictIdentity && (target.canonicalKey !== identity.sessionKey || target.agentId !== identity.agentId)) {
				if (missingMessage) throw new Error(`${missingMessage} lost session ${identity.sessionId}`);
				return;
			}
			return run(SessionManager.open(transcriptTarget));
		});
	}
	function latestWorkspaceReport(manager, ...customTypes) {
		for (const entry of manager.getBranch().toReversed()) if (entry.type === "custom_message" && customTypes.includes(entry.customType)) return entry;
	}
	return {
		resolveWorkspaceResultConflict: async (identity) => await withWorkerTranscript(identity, (manager) => {
			const transcriptEntry = latestWorkspaceReport(manager, WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE);
			if (transcriptEntry?.customType !== "cloud-workspace-conflict") return;
			const details = transcriptEntry.details;
			if (Array.isArray(details?.paths) && details.paths.length > 0 && details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) && typeof details.stagedResultRef === "string" && (details.totalCount === void 0 || Number.isSafeInteger(details.totalCount) && details.totalCount >= details.paths.length) && /^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
		}),
		reportWorkspaceResultConflict: async (conflict) => {
			await withWorkerTranscript(conflict, (manager) => {
				const latestConflictEntry = latestWorkspaceReport(manager, WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE);
				if ("cleared" in conflict) {
					if (latestConflictEntry?.customType !== "cloud-workspace-conflict-cleared") manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE, "A later cloud workspace result superseded the previous conflict.", false);
					return;
				}
				const projectedConflict = projectWorkspaceResultConflict(conflict.paths, conflict.stagedResultRef, conflict.totalCount);
				const details = latestConflictEntry?.details;
				if (!(latestConflictEntry?.customType === "cloud-workspace-conflict" && details?.stagedResultRef === projectedConflict.stagedResultRef && details.totalCount === projectedConflict.totalCount && Array.isArray(details.paths) && JSON.stringify(details.paths) === JSON.stringify(projectedConflict.paths))) manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, formatWorkspaceConflictSummary(projectedConflict.paths, projectedConflict.stagedResultRef, projectedConflict.totalCount), true, projectedConflict);
			}, "Recovered cloud workspace conflict");
		},
		reportWorkspaceResultRecoveryFailure: async (recovery) => {
			await withWorkerTranscript(recovery, (manager) => {
				const latestRecovery = latestWorkspaceReport(manager, WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE);
				const error = boundedWorkerError(recovery.error, 768);
				const content = `Cloud workspace recovery attempt failed: ${error}. OpenClaw preserved the result and will retry.`;
				if (latestRecovery?.content !== content) manager.appendCustomMessageEntry(WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE, content, true, { error });
			}, "Cloud workspace recovery", true);
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-startup.ts
const WORKER_PLACEMENT_RECONCILE_INTERVAL_MS = 6e4;
const loadWorkerPlacementSessionRuntimeModule = createLazyRuntimeModule(async () => {
	const [placementSessionRuntime, { managedWorktrees }, sessionUtils] = await Promise.all([
		import("./placement-session-runtime-BZAOkiZo.js"),
		import("./service-uNnnbqTd.js"),
		import("./session-utils-CpUx387S.js")
	]);
	return {
		resolveWorkerPlacementExecutionMode: placementSessionRuntime.resolveWorkerPlacementExecutionMode,
		resolveWorkerPlacementCapabilities: placementSessionRuntime.resolveWorkerPlacementCapabilities,
		managedWorktrees,
		resolveWorkerPlacementSessionRuntime: placementSessionRuntime.resolveWorkerPlacementSessionRuntime,
		resolveCanonicalSessionEntryFromStoreKeys: sessionUtils.resolveCanonicalSessionEntryFromStoreKeys,
		resolveGatewaySessionStoreTargetWithStore: sessionUtils.resolveGatewaySessionStoreTargetWithStore
	};
});
const loadWorkerWorkspacePreflight = createLazyRuntimeModule(async () => {
	const { preflightWorkerWorkspace } = await import("./workspace-sync-preflight-BrQsA5a_.js");
	return preflightWorkerWorkspace;
});
function createGatewayGitHubPublicationRuntime(params) {
	return createGitHubPublicationRuntime({
		placements: params.placements,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		warn: params.warn
	});
}
function createGatewayWorkerPlacementRuntime(params) {
	let nodeWorkerSupervisorTransport;
	const workspaceOperations = createWorkerWorkspaceOperationCoordinator();
	const { coordinator: githubPublication, prepareAcceptedWorkspacePublication, publishAcceptedWorkspace, reconcilePublications } = params.githubPublicationRuntime ?? createGatewayGitHubPublicationRuntime({
		placements: params.placements,
		warn: params.warn
	});
	const diskSpace = createWorkerPlacementDiskSpaceMonitor({
		placements: params.placements,
		environments: params.environments,
		warn: params.warn
	});
	const workspaceConflictHandlers = createWorkerWorkspaceConflictTranscriptHandlers(loadWorkerPlacementSessionRuntimeModule);
	const nodeWorkspaceRetention = createNodeWorkspaceRetainCoordinator({
		gatewayNamespace: params.gatewayNamespace,
		placements: params.placements,
		environments: params.environments,
		warn: params.warn
	});
	const runnerAvailability = createWorkerPlacementRunnerAvailabilityReader({
		environments: params.environments,
		hasCurrentDeviceRunner: (deviceId) => nodeWorkerSupervisorTransport?.hasCurrentRunner(deviceId) === true
	});
	const reclaimBarriers = createGatewayWorkerPlacementReclaimBarriers({
		placements: params.placements,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		revokeSessionAuthority: params.revokeSessionAuthority
	});
	const runMoveBarrier = createGatewayWorkerPlacementMoveBarrier({
		placements: params.placements,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		persistAbandonedPartial: params.persistAbandonedPartial,
		revokeSessionAuthority: params.revokeSessionAuthority
	});
	const resolveWorkspacePath = async ({ sessionId, sessionKey, agentId }) => {
		const { worktree } = resolveWorkerPlacementSessionTarget({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			config: getRuntimeConfig(),
			sessionId,
			sessionKey,
			agentId,
			errorMessage: `Session ${sessionKey} dispatch requires a session-owned managed worktree`
		});
		return worktree.path;
	};
	const resolveDevicePlacementRequirement = async (identity) => {
		const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
		const { config, target, entry } = resolveWorkerPlacementSessionTarget({
			sessionRuntime,
			config: getRuntimeConfig(),
			...identity,
			errorMessage: `Session ${identity.sessionKey} changed before node-backed placement recovery`
		});
		const runtime = sessionRuntime.resolveWorkerPlacementSessionRuntime({
			cfg: config,
			entry,
			agentId: target.agentId,
			sessionKey: target.canonicalKey
		});
		const { executionMode, devicePlacement } = sessionRuntime.resolveWorkerPlacementCapabilities(runtime);
		if (executionMode !== identity.executionMode || !devicePlacement) throw new Error(`runtime ${runtime} no longer supports this node-backed placement; select a compatible runtime or continue on the Gateway`);
		return devicePlacement;
	};
	const resolveNodeWorkspaceBinding = async (binding) => {
		const placement = params.placements.get(binding.sessionId);
		if (!placement || placement.state !== "active" && placement.state !== "draining" && placement.state !== "reconciling" || placement.environmentId !== binding.environmentId || placement.activeOwnerEpoch !== binding.ownerEpoch) return;
		return {
			localPath: await resolveWorkspacePath({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			}),
			manifestRef: placement.workspaceBaseManifestRef,
			remoteWorkspaceDir: placement.remoteWorkspaceDir
		};
	};
	const publishPlacementChanges = createGatewayWorkerPlacementChangePublisher(params);
	const rawDispatchService = coordinateWorkerPlacementDispatch(createWorkerPlacementDispatchService({
		placements: params.placements,
		environments: params.environments,
		runnerAvailability,
		resolveDevicePlacementRequirement,
		isCurrentNodePlacement: (node, requirement) => {
			if (nodeWorkerSupervisorTransport?.isCurrent(node, requirement.consumesWorkerSlot, requirement.requiredNodeCommands) !== true) return false;
			const declaredCommands = [...node.commands];
			const allowlist = resolveNodeCommandAllowlist(getRuntimeConfig(), {
				commands: declaredCommands,
				approvedCommands: declaredCommands
			});
			return requirement.requiredNodeCommands.every((command) => isNodeCommandAllowed({
				command,
				declaredCommands,
				allowlist
			}).ok);
		},
		...workspaceConflictHandlers,
		...reclaimBarriers,
		runLocalBarrier: async ({ sessionId, sessionKey, agentId, executionMode, authorize, startDispatch }) => {
			const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
			const { resolveWorkerPlacementExecutionMode, resolveGatewaySessionStoreTargetWithStore, resolveWorkerPlacementSessionRuntime } = sessionRuntime;
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				clone: false
			});
			const lifecycleIdentities = [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			];
			let placement;
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				prepare: async () => {
					const { config: currentConfig, target: currentTarget, entry: currentEntry, worktree } = resolveWorkerPlacementSessionTarget({
						sessionRuntime,
						config: getRuntimeConfig(),
						sessionId,
						sessionKey,
						agentId,
						expectedTarget: target,
						errorMessage: `Session ${sessionKey} changed before cloud worker dispatch. Retry.`
					});
					if (currentEntry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} was archived before cloud worker dispatch. Retry.`);
					const currentRuntime = resolveWorkerPlacementSessionRuntime({
						cfg: currentConfig,
						entry: currentEntry,
						agentId: currentTarget.agentId,
						sessionKey: currentTarget.canonicalKey
					});
					if (resolveWorkerPlacementExecutionMode(currentRuntime) !== executionMode) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker dispatch. Retry.`);
					await (await loadWorkerWorkspacePreflight())({ localPath: worktree.path });
					authorize?.();
					placement = startDispatch();
					clearSessionQueues(lifecycleIdentities);
					params.revokeSessionAuthority({
						sessionId,
						sessionKeys: lifecycleIdentities
					});
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; dispatch stopped`);
					await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
					await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
				},
				run: async () => {
					if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not start`);
				}
			});
			if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not complete`);
			return placement;
		},
		runActivationBarrier: async ({ sessionId, sessionKey, agentId, executionMode, authorize, activate }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: getRuntimeConfig,
			sessionId,
			sessionKey,
			agentId,
			executionMode,
			action: "activation",
			run: () => {
				authorize?.();
				return activate();
			}
		}),
		runRecoveryBarrier: async ({ sessionId, sessionKey, agentId, executionMode, environmentId, expectedGeneration, run }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: getRuntimeConfig,
			sessionId,
			sessionKey,
			agentId,
			executionMode,
			action: "recovery",
			run: async (worktree) => {
				const placement = params.placements.get(sessionId);
				if (placement?.state !== "provisioning" || placement.generation !== expectedGeneration || placement.environmentId !== environmentId) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} placement changed before cloud worker recovery. Retry.`);
				await run(worktree.path);
			}
		}),
		onActivated: ({ sessionId }) => {
			const placement = params.placements.get(sessionId);
			if (placement?.state !== "active") return;
			const environment = params.environments.get(placement.environmentId);
			if (environment?.state === "attached" && environment.ownerEpoch === placement.activeOwnerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === sessionId && environment.nodeDeviceId) nodeWorkspaceRetention.schedule(environment.nodeDeviceId);
		},
		runMoveBarrier,
		resolveMoveDestination: createGatewayWorkerPlacementMoveDestinationResolver({
			environments: params.environments,
			getConfig: getRuntimeConfig,
			loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule
		}),
		resolveWorkspacePath,
		workspaceOperations,
		prepareAcceptedWorkspacePublication,
		publishAcceptedWorkspace,
		resolveGitAuthor: (agentId) => (resolveConfiguredGitHubToolIdentity({
			config: getRuntimeConfig(),
			agentId,
			scope: "agent"
		}) ?? resolveConfiguredGitHubToolIdentity({
			config: getRuntimeConfig(),
			agentId,
			scope: "system"
		}))?.gitAuthor
	}));
	const dispatchService = {
		...rawDispatchService,
		reconcile: (mode) => publishPlacementChanges(() => rawDispatchService.reconcile(mode)),
		reconcileActive: (environmentId) => publishPlacementChanges(() => rawDispatchService.reconcileActive(environmentId))
	};
	const placementIdleSweep = createWorkerPlacementIdleSweep({
		placements: params.placements,
		environments: params.environments,
		dispatch: rawDispatchService,
		getConfig: getRuntimeConfig,
		info: params.info ?? params.warn,
		warn: params.warn,
		isPlacementOperationInFlight: (sessionId) => rawDispatchService.isPlacementOperationInFlight(sessionId),
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule
	});
	const sessionRetirement = createPlacementSessionRetirement({
		placements: params.placements,
		environments: params.environments,
		forceDestroyEnvironment: dispatchService.forceDestroyEnvironment,
		createSessionEvidenceResolver: createWorkerPlacementSessionEvidenceResolver,
		warn: params.warn
	});
	const admissionProvider = createWorkerSessionTurnPlacementProvider({
		environments: params.environments,
		placements: params.placements,
		resolveWorkspacePath,
		reconcileActivePlacement: async (environmentId) => await dispatchService.reconcileActive(environmentId),
		redispatchReclaimed: createReclaimedPlacementRedispatch({
			environments: params.environments,
			dispatch: dispatchService.dispatch,
			resolveDevicePlacementRequirement
		}),
		workspaceOperations,
		prepareAcceptedWorkspacePublication,
		publishAcceptedWorkspace
	});
	const startRuntime = async (hooks) => {
		if (hooks.isClosePreludeStarted()) return null;
		const uninstallPlacementAdmission = installSessionPlacementAdmissionProvider(admissionProvider);
		let placementReconcileInterval;
		const placementReconcile = { current: void 0 };
		const diskSpaceSweep = { current: void 0 };
		const placementIdleSuspend = { current: void 0 };
		let stopped = false;
		const uninstallEnvironmentReconcileGuard = installWorkerPlacementReconcileGuard({
			placements: params.placements,
			environments: params.environments,
			dispatch: dispatchService,
			isStopping: () => stopped
		});
		const uninstallSessionMaintenancePreservation = registerSessionMaintenancePreserveKeysProvider(() => params.placements.listForReconcile().flatMap((placement) => placement.state === "failed" && isFailedWorkerPlacementEnvironmentGone({
			environmentService: params.environments,
			placement
		}) ? [] : [placement.sessionKey]));
		const trackOperation = (slot, current, failureMessage) => {
			slot.current = current;
			const clearCurrent = () => {
				if (slot.current === current) slot.current = void 0;
			};
			current.then(clearCurrent, (error) => {
				params.warn(`${failureMessage}: ${formatErrorMessage(error)}`);
				clearCurrent();
			});
			return current;
		};
		const reconcileActivePlacements = () => {
			if (stopped) return Promise.resolve();
			if (placementReconcile.current) return placementReconcile.current;
			return trackOperation(placementReconcile, publishPlacementChanges(async () => {
				await sessionRetirement.reconcile();
				await rawDispatchService.reconcileActive();
				await reconcilePublications();
				nodeWorkspaceRetention.schedule();
			}), "Worker placement reconcile sweep failed");
		};
		const sweepDiskSpace = () => {
			if (stopped) return Promise.resolve();
			if (diskSpaceSweep.current) return diskSpaceSweep.current;
			return trackOperation(diskSpaceSweep, diskSpace.sweep(), "Worker disk-space sweep failed");
		};
		const sweepActivePlacements = () => {
			reconcileActivePlacements().then(() => {
				if (stopped || placementIdleSuspend.current) return;
				trackOperation(placementIdleSuspend, publishPlacementChanges(() => placementIdleSweep.sweep()), "Worker placement auto-suspend sweep failed");
			}, () => void 0);
			sweepDiskSpace();
		};
		const uninstallSessionIdentityMutation = onSessionIdentityMutation((mutation) => {
			const previousSessionId = mutation.previous.sessionId;
			const currentSessionId = "current" in mutation ? mutation.current.sessionId : void 0;
			if (previousSessionId && previousSessionId !== currentSessionId) {
				const pending = placementReconcile.current;
				if (!pending) {
					reconcileActivePlacements();
					return;
				}
				pending.then(reconcileActivePlacements, reconcileActivePlacements);
			}
		});
		let stopPromise;
		const sidecar = { stop: () => {
			if (stopPromise) return stopPromise;
			if (!stopped) {
				stopped = true;
				params.environments.stopNodeEnrollmentWaits?.();
				clearInterval(placementReconcileInterval);
				placementReconcileInterval = void 0;
				uninstallSessionIdentityMutation();
				uninstallSessionMaintenancePreservation();
				uninstallPlacementAdmission();
			}
			const currentStop = (async () => {
				await Promise.allSettled([
					placementReconcile.current,
					diskSpaceSweep.current,
					placementIdleSuspend.current
				].filter((operation) => operation !== void 0));
				await nodeWorkspaceRetention.stop();
				await params.environments.stop();
				await uninstallEnvironmentReconcileGuard();
			})();
			stopPromise = currentStop;
			currentStop.catch(() => {
				if (stopPromise === currentStop) stopPromise = void 0;
			});
			return currentStop;
		} };
		hooks.registerSidecar(sidecar);
		const stopBeforeReady = async () => {
			await sidecar.stop();
			hooks.unregisterSidecar(sidecar);
			return null;
		};
		try {
			const startupRecovery = recoverGatewayWorkerPlacementWorkspaces({
				placements: params.placements,
				resolveWorkspacePath
			});
			placementReconcile.current = startupRecovery;
			try {
				await startupRecovery;
			} finally {
				if (placementReconcile.current === startupRecovery) placementReconcile.current = void 0;
			}
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			const startupReconcile = publishPlacementChanges(async () => {
				await rawDispatchService.reconcile("startup");
				await reconcilePublications();
			});
			placementReconcile.current = startupReconcile;
			try {
				await startupReconcile;
			} finally {
				if (placementReconcile.current === startupReconcile) placementReconcile.current = void 0;
			}
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			nodeWorkspaceRetention.start();
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			params.environments.start();
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			trackOperation(placementReconcile, publishPlacementChanges(() => sessionRetirement.reconcile()), "Worker placement reconcile sweep failed");
			sweepDiskSpace();
			placementReconcileInterval = setInterval(sweepActivePlacements, WORKER_PLACEMENT_RECONCILE_INTERVAL_MS);
			placementReconcileInterval.unref?.();
			return sidecar;
		} catch (error) {
			try {
				await stopBeforeReady();
			} catch (cleanupError) {
				params.warn(`Worker placement cleanup after startup failure failed: ${formatErrorMessage(cleanupError)}`);
			}
			throw error;
		}
	};
	return {
		dispatchService,
		admissionProvider,
		diskSpace,
		runnerAvailability,
		placements: params.placements,
		githubPublication,
		resolveNodeWorkspaceBinding,
		bindNodeWorkerSupervisorTransport: (transport) => {
			nodeWorkerSupervisorTransport = transport;
			nodeWorkspaceRetention.bindTransport(transport);
		},
		scheduleNodeWorkspaceRetention: (nodeId) => nodeWorkspaceRetention.schedule(nodeId),
		startRuntime
	};
}
//#endregion
export { createGatewayGitHubPublicationRuntime, createGatewayWorkerPlacementRuntime };
