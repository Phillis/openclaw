import { a as addTimerTimeoutGraceMs } from "./number-coercion-CLj0HTDM.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { a as formatNodeRunnerUpdateRequired, n as NODE_RUNNER_UPDATE_REQUIRED_ISSUE } from "./node-runner-inventory-C6KxqRM_.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { E as NODE_WORKER_WORKSPACE_EXEC_COMMAND, b as NODE_WORKER_ENVIRONMENT_STOP_COMMAND } from "./node-commands-DRxP7loh.js";
import "./backoff-BkMI1WEL.js";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.js";
import { i as parseNodeWorkerWorkspaceExecResult } from "./node-workspace-protocol-DlQjlWdM.js";
import { r as NodeWorkerWorkspaceTransferError } from "./node-workspace-transfer-protocol-BlZMCwT7.js";
import { y as serializeWorkerWorkspaceManifest } from "./workspace-actual-manifest-DIThIqhg.js";
import { a as recoverWorkerWorkspaceReconciliation, s as assertWorkspaceResultStable, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-Ca4yuu6w.js";
import { t as boundedWorkerError } from "./worker-error-C2z1Ud9q.js";
import { d as workerWorkspaceResultStaging } from "./workspace-result-staging-C1c-gG8N.js";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-5YsdfQ0E.js";
import { r as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-D4tydcWT.js";
import { f as validateWorkspaceSyncRequest, l as resolveWorkerWorkspaceGitAuthor, y as workspaceSyncError } from "./workspace-sync-helpers-Ba8iUX3R.js";
import { t as nodeWorkerGatewayNamespace } from "./node-worker-gateway-namespace-kRiA3LFq.js";
import { t as createWorkerWorkspaceQuiescence } from "./workspace-quiescence-BIAAEwzR.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/node-worker-workspace-fallback.ts
const GIT_TIMEOUT_MS = 6e4;
const COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const GIT_NONINTERACTIVE_ARGS = [
	"-c",
	"credential.helper=",
	"-c",
	"core.askPass="
];
const workspaceSyncLog = createSubsystemLogger("gateway/worker-workspace");
function recordNodeSyncPath(environmentId, sessionId, outcome, originStartedAt) {
	workspaceSyncLog.info("worker workspace sync path selected", {
		environmentId,
		sessionId,
		path: outcome.kind === "synced" ? "origin" : "gateway-push",
		reason: outcome.kind === "synced" ? "published-origin" : outcome.reason,
		originAttemptMs: performance.now() - originStartedAt
	});
}
async function localGit(root, args) {
	const result = await runCommandWithTimeout([
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		...GIT_NONINTERACTIVE_ARGS,
		"-C",
		root,
		...args
	], {
		timeoutMs: GIT_TIMEOUT_MS,
		maxOutputBytes: 256 * 1024,
		maxCombinedOutputBytes: 512 * 1024,
		outputCapture: "head",
		baseEnv: {
			...process.env,
			GIT_TERMINAL_PROMPT: "0",
			GIT_ASKPASS: "",
			SSH_ASKPASS: ""
		}
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error("local Git inspection failed");
	return result.stdout.trim();
}
function credentialFreeHttpOrigin(raw) {
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		return;
	}
	return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.username === "" && parsed.password === "" && parsed.search === "" && parsed.hash === "" ? parsed.href : void 0;
}
async function requiresWorkspaceTransfer(root) {
	for (const marker of [".worktreeinclude", ".gitmodules"]) try {
		await fs.lstat(path.join(root, marker));
		return true;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	try {
		return /\bfilter\s*=\s*lfs\b/u.test(await fs.readFile(path.join(root, ".gitattributes"), "utf8"));
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		return false;
	}
}
async function inspectEligibleOrigin(localPath) {
	try {
		const canonicalPath = await fs.realpath(localPath);
		let root;
		try {
			root = await fs.realpath(await localGit(canonicalPath, ["rev-parse", "--show-toplevel"]));
		} catch {
			return {
				kind: "fallback",
				reason: "not-git-workspace"
			};
		}
		if (root !== canonicalPath) return {
			kind: "fallback",
			reason: "not-repository-root"
		};
		if (await requiresWorkspaceTransfer(root)) return {
			kind: "fallback",
			reason: "workspace-transfer-required"
		};
		const [status, commit, rawOrigin] = await Promise.all([
			localGit(root, [
				"status",
				"--porcelain=v1",
				"--untracked-files=all"
			]),
			localGit(root, ["rev-parse", "HEAD"]),
			localGit(root, [
				"remote",
				"get-url",
				"origin"
			]).catch(() => "")
		]);
		if (status) return {
			kind: "fallback",
			reason: "workspace-dirty"
		};
		const origin = credentialFreeHttpOrigin(rawOrigin);
		if (!COMMIT_PATTERN.test(commit) || !origin) return {
			kind: "fallback",
			reason: "origin-unavailable"
		};
		return {
			kind: "eligible",
			identity: {
				commit,
				origin,
				root
			}
		};
	} catch {
		return {
			kind: "fallback",
			reason: "inspection-failed"
		};
	}
}
function succeeded(result) {
	return result.termination === "exit" && result.code === 0;
}
/** Optional published-origin fast path; HTTPS transfer remains the canonical fallback. */
function createNodeWorkerWorkspaceFallback(exec) {
	const capture = async (dir, base, reference) => await exec({
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_MANIFEST_JS,
			dir,
			...base ? [base, "eligible"] : ["", "all"],
			...reference ? [reference.slice(7)] : []
		],
		timeoutMs: GIT_TIMEOUT_MS,
		transportRetry: "idempotent"
	});
	return {
		async captureManifest(dir, base, reference) {
			const captured = await capture(dir, base, reference);
			const manifestRef = captured.stdout.trim();
			if (!succeeded(captured) || !MANIFEST_REF_PATTERN.test(manifestRef)) {
				const detail = boundedWorkerError(captured.stderr.trim() || (!succeeded(captured) ? `${captured.termination} (exit code ${captured.code}, signal ${captured.signal})` : "invalid manifest reference"));
				throw new Error(`Node workspace manifest capture failed: ${detail}`);
			}
			return manifestRef;
		},
		async trySyncWorkspace(request, expectedManifestRef) {
			validateWorkspaceSyncRequest(request);
			const inspection = await inspectEligibleOrigin(request.localPath);
			if (inspection.kind === "fallback") return inspection;
			const { identity } = inspection;
			const cloned = await exec({
				argv: [
					"git",
					...GIT_NONINTERACTIVE_ARGS,
					"-c",
					"init.templateDir=",
					"clone",
					"--filter=blob:none",
					"--no-checkout",
					"--",
					identity.origin,
					"."
				],
				resetWorkspace: true,
				timeoutMs: GIT_TIMEOUT_MS,
				transportRetry: "never"
			});
			if (!succeeded(cloned)) return {
				kind: "fallback",
				reason: "clone-failed"
			};
			const checkedOut = await exec({
				argv: [
					"git",
					...GIT_NONINTERACTIVE_ARGS,
					"checkout",
					"--detach",
					"--force",
					identity.commit
				],
				timeoutMs: GIT_TIMEOUT_MS,
				transportRetry: "never"
			});
			if (!succeeded(checkedOut) || checkedOut.workspaceDir !== cloned.workspaceDir) return {
				kind: "fallback",
				reason: "checkout-failed"
			};
			const captured = await capture(checkedOut.workspaceDir, identity.commit);
			const manifestRef = captured.stdout.trim();
			if (!succeeded(captured) || !MANIFEST_REF_PATTERN.test(manifestRef)) return {
				kind: "fallback",
				reason: "manifest-capture-failed"
			};
			if (manifestRef !== expectedManifestRef) return {
				kind: "fallback",
				reason: "manifest-mismatch"
			};
			return {
				kind: "synced",
				result: {
					mode: "git",
					remoteWorkspaceDir: checkedOut.workspaceDir,
					manifestRef
				}
			};
		},
		async finalizeSync(request, result) {
			if (result.mode === "plain") return result;
			const author = await resolveWorkerWorkspaceGitAuthor(request, async (argv) => runCommandWithTimeout(argv, {
				timeoutMs: GIT_TIMEOUT_MS,
				maxOutputBytes: 1024
			}));
			const git = [
				"git",
				"-C",
				result.remoteWorkspaceDir,
				"config",
				"--local"
			];
			for (const [key, value] of Object.entries(author)) {
				if (!value) continue;
				const configured = await exec({
					argv: [
						...git,
						`user.${key}`,
						value
					],
					transportRetry: "never"
				});
				if (!succeeded(configured)) throw workspaceSyncError(configured);
			}
			return result;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/node-worker-workspace-actions.ts
function createNodeWorkerWorkspaceActions(params) {
	const { restoredWorkspace } = params;
	let workspaceReady = restoredWorkspace !== void 0;
	const exec = async (command) => {
		if (!workspaceReady) throw new Error("node worker workspace is unavailable before sync");
		return await params.runWorkspaceCommand(command);
	};
	const workspace = createNodeWorkerWorkspaceFallback(exec);
	const quiesceWorkspace = createWorkerWorkspaceQuiescence({
		ownerSignal: params.ownerSignal,
		sharedHost: true,
		runWorkspaceCommand: exec
	});
	const validateRestoredWorkspace = async () => {
		if (!restoredWorkspace) return;
		const prepared = await params.workspaceTransfer.prepareSync({
			environmentId: params.environmentId,
			ownerEpoch: params.ownerEpoch,
			sessionId: params.sessionId,
			generation: params.ownerEpoch,
			localPath: restoredWorkspace.localPath,
			isAuthorized: params.isOwnerCurrent,
			signal: params.ownerSignal
		});
		params.workspaceTransfer.revoke(params.environmentId, prepared.token);
		if (prepared.snapshot.manifestRef !== restoredWorkspace.manifestRef) throw new Error("Gateway workspace changed before node tunnel recovery");
		const quiescence = await quiesceWorkspace(restoredWorkspace.remoteWorkspaceDir);
		try {
			if (await workspace.captureManifest(restoredWorkspace.remoteWorkspaceDir, prepared.snapshot.manifest.baseCommit, restoredWorkspace.manifestRef) !== restoredWorkspace.manifestRef) throw new Error("Node workspace changed before tunnel recovery");
		} finally {
			await quiescence.resume();
		}
	};
	const reconcileWorkspace = async (request) => {
		const pending = request.journal.load();
		if (pending) {
			await recoverWorkerWorkspaceReconciliation({
				root: request.localPath,
				journal: pending
			});
			request.journal.abort();
		}
		const uploadToken = params.workspaceTransfer.prepareUpload(params.environmentId, request.baseManifestRef);
		let uploadedResult;
		try {
			uploadedResult = await exec({
				argv: ["openclaw-internal-workspace-transfer"],
				transfer: {
					direction: "upload",
					token: uploadToken,
					baseManifestRef: request.baseManifestRef
				},
				timeoutMs: 10 * 6e4,
				transportRetry: "never"
			});
		} finally {
			params.workspaceTransfer.revoke(params.environmentId, uploadToken);
		}
		if (uploadedResult.termination !== "exit" || uploadedResult.code !== 0) throw new Error("Node workspace reconcile upload failed");
		const uploaded = params.workspaceTransfer.takeUpload(params.environmentId, request.baseManifestRef);
		try {
			const changed = uploaded.currentManifestRef !== request.baseManifestRef;
			let expectedRemoteRef = uploaded.currentManifestRef;
			const verifyStable = async () => {
				if (await workspace.captureManifest(request.remoteWorkspaceDir, uploaded.base.baseCommit, expectedRemoteRef) !== expectedRemoteRef) throw new Error("Cloud workspace changed during final reconciliation");
			};
			await verifyStable();
			const publishAcceptedManifest = async (accepted) => {
				if (accepted.manifestRef === expectedRemoteRef) return;
				const baseSnapshot = params.workspaceTransfer.getSnapshot(params.environmentId, request.baseManifestRef);
				const token = params.workspaceTransfer.publishSnapshot(params.environmentId, {
					manifest: accepted.manifest,
					manifestRef: accepted.manifestRef,
					rawManifest: serializeWorkerWorkspaceManifest(accepted.manifest),
					root: await fs.realpath(request.localPath),
					...baseSnapshot?.packPath ? { packPath: baseSnapshot.packPath } : {}
				});
				try {
					const published = await exec({
						argv: ["openclaw-internal-workspace-transfer"],
						transfer: {
							direction: "download",
							token,
							manifestRef: accepted.manifestRef
						},
						timeoutMs: 10 * 6e4,
						transportRetry: "never"
					});
					if (published.termination !== "exit" || published.code !== 0 || published.stdout.trim() !== accepted.manifestRef) throw new Error("Node workspace accepted manifest publication failed");
					expectedRemoteRef = accepted.manifestRef;
				} finally {
					params.workspaceTransfer.revoke(params.environmentId, token);
				}
			};
			const preparedStagedResult = request.stagedResult ? await workerWorkspaceResultStaging.prepareRequestedWorkerWorkspaceResult({
				request,
				stagingRoot: uploaded.stagingRoot,
				currentManifestRef: uploaded.currentManifestRef,
				baseManifestRaw: uploaded.baseRaw,
				currentManifestRaw: uploaded.currentRaw,
				publishAcceptedManifest
			}) : void 0;
			let appliedWorkspaceResult;
			if (!preparedStagedResult) appliedWorkspaceResult = await applyStagedWorkerWorkspace({
				root: request.localPath,
				stagingRoot: uploaded.stagingRoot,
				baseManifestRef: request.baseManifestRef,
				currentManifestRef: uploaded.currentManifestRef,
				base: uploaded.base,
				current: uploaded.current,
				journal: request.journal,
				publishAcceptedManifest
			});
			return {
				get manifestRef() {
					return expectedRemoteRef;
				},
				changed,
				verifyStable,
				verifyLocalStable: async () => await (appliedWorkspaceResult?.verifyLocalStable() ?? assertWorkspaceResultStable({
					root: request.localPath,
					base: uploaded.base,
					current: uploaded.current
				})),
				getAppliedWorkspaceResult: () => appliedWorkspaceResult,
				...preparedStagedResult ? {
					...preparedStagedResult,
					applyPreparedStagedResult: async () => {
						await preparedStagedResult.applyPreparedStagedResult();
						appliedWorkspaceResult = preparedStagedResult.getAppliedWorkspaceResult();
					}
				} : {}
			};
		} finally {
			await fs.rm(uploaded.stagingRoot, {
				recursive: true,
				force: true
			});
		}
	};
	return {
		validateRestoredWorkspace,
		runWorkspaceCommand: exec,
		syncWorkspace: async (request) => {
			workspaceReady = true;
			try {
				const prepared = await params.workspaceTransfer.prepareSync({
					environmentId: params.environmentId,
					ownerEpoch: params.ownerEpoch,
					sessionId: params.sessionId,
					generation: params.ownerEpoch,
					localPath: request.localPath,
					isAuthorized: params.isOwnerCurrent,
					signal: params.ownerSignal
				});
				try {
					const originStartedAt = performance.now();
					const origin = await workspace.trySyncWorkspace(request, prepared.snapshot.manifestRef);
					recordNodeSyncPath(params.environmentId, params.sessionId, origin, originStartedAt);
					if (origin.kind === "synced") return await workspace.finalizeSync(request, origin.result);
					const transferred = await exec({
						argv: ["openclaw-internal-workspace-transfer"],
						transfer: {
							direction: "download",
							token: prepared.token,
							manifestRef: prepared.snapshot.manifestRef
						},
						timeoutMs: 10 * 6e4,
						transportRetry: "never"
					});
					if (transferred.termination !== "exit" || transferred.code !== 0 || transferred.stdout.trim() !== prepared.snapshot.manifestRef) throw new Error("Node workspace transfer failed");
					return await workspace.finalizeSync(request, {
						mode: prepared.snapshot.manifest.baseCommit ? "git" : "plain",
						remoteWorkspaceDir: transferred.workspaceDir,
						manifestRef: prepared.snapshot.manifestRef
					});
				} finally {
					params.workspaceTransfer.revoke(params.environmentId, prepared.token);
				}
			} catch (error) {
				workspaceReady = restoredWorkspace !== void 0;
				throw error;
			}
		},
		quiesceWorkspace,
		reconcileWorkspace
	};
}
//#endregion
//#region src/gateway/worker-environments/node-worker-tunnel.ts
const DEFAULT_COMMAND_TIMEOUT_MS = 6e4;
const COMMAND_RESULT_GRACE_MS = 5e3;
const RETRY_DELAY_MS = 100;
const tunnelLog = createSubsystemLogger("gateway/worker-tunnel");
const RETRYABLE_TRANSPORT_CODES = /* @__PURE__ */ new Set([
	"DISCONNECTED",
	"NOT_CONNECTED",
	"PAIRING_CHANGED",
	"PRIVATE_DIALECT_UNAVAILABLE",
	"ROUTE_CHANGED",
	"TIMEOUT",
	"UNAVAILABLE"
]);
function spawnResultFromReceipt(receipt) {
	if (receipt.state === "completed") return {
		stdout: receipt.resultJson,
		stderr: "",
		code: 0,
		signal: null,
		killed: false,
		termination: "exit"
	};
	if (receipt.state === "failed" || receipt.state === "interrupted" || receipt.state === "cancelled") return {
		stdout: "",
		stderr: receipt.errorText,
		code: 1,
		signal: null,
		killed: receipt.state === "cancelled" || receipt.state === "interrupted",
		termination: "exit"
	};
	throw new Error("node worker launch returned without a terminal receipt");
}
function payloadJson(value) {
	if (!value) throw new Error("node workspace command omitted its result");
	try {
		return JSON.parse(value);
	} catch {
		throw new Error("node workspace command returned malformed JSON");
	}
}
function raceWithSignal(operation, signal) {
	const abortError = () => signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("node worker operation aborted");
	if (signal.aborted) return Promise.reject(abortError());
	return new Promise((resolve, reject) => {
		const onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
		operation.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : /* @__PURE__ */ new Error("node worker operation failed"));
		});
	});
}
/** Owns node-channel handles without treating the persistent machine as a disposable lease. */
function createNodeWorkerTunnelManager(options) {
	const entries = /* @__PURE__ */ new Map();
	const retiredEntries = /* @__PURE__ */ new Set();
	let resolveWorkspaceBinding;
	const gatewayNamespace = nodeWorkerGatewayNamespace(options.gatewayDeviceId);
	const hasDurableBinding = (entry) => {
		const current = options.getEnvironment(entry.environmentId);
		return Boolean(current && current.ownerEpoch === entry.ownerEpoch && current.bootstrapReceipt?.installKind === "bundle" && sameWorkerBuild(current.bootstrapReceipt, entry.expectedBuild) && current.attachedSessionIds.length <= 1 && (current.attachedSessionIds.length === 0 || current.attachedSessionIds[0] === entry.sessionId));
	};
	const isLiveEntry = (entry) => entries.get(entry.environmentId) === entry && !entry.abortController.signal.aborted;
	const isEnvironmentOwner = (entry) => hasDurableBinding(entry) && isLiveEntry(entry);
	const findNode = async (entry, signal) => {
		const transport = options.getTransport();
		if (!transport) throw new Error("device worker node transport is unavailable");
		const node = (await raceWithSignal(transport.listCurrentNodes(), signal)).find((candidate) => candidate.nodeId === entry.deviceId);
		if (!node) throw new WorkerTunnelOwnerDisconnectedError("device worker node is not connected with the supervisor dialect");
		return {
			transport,
			node
		};
	};
	const runWorkspaceCommand = async (entry, generation, command) => {
		const commandTimeoutMs = command.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS;
		const transportTimeoutMs = addTimerTimeoutGraceMs(commandTimeoutMs, COMMAND_RESULT_GRACE_MS) ?? commandTimeoutMs;
		const deadline = Date.now() + transportTimeoutMs;
		const signals = [entry.abortController.signal, AbortSignal.timeout(transportTimeoutMs)];
		if (command.signal) signals.push(command.signal);
		const signal = AbortSignal.any(signals);
		const input = {
			gatewayNamespace,
			environmentId: entry.environmentId,
			sessionId: entry.sessionId,
			generation,
			argv: [...command.argv],
			...command.input === void 0 ? {} : { input: command.input },
			timeoutMs: commandTimeoutMs,
			...command.resetWorkspace === void 0 ? {} : { resetWorkspace: command.resetWorkspace },
			...command.transfer === void 0 ? {} : { transfer: command.transfer }
		};
		while (true) {
			if (!isEnvironmentOwner(entry)) throw new Error("node worker workspace authority closed");
			const remainingMs = deadline - Date.now();
			if (remainingMs <= 0 || signal.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("node worker workspace command timed out");
			let result;
			try {
				const { node, transport } = await findNode(entry, signal);
				result = await transport.invoke({
					node,
					command: NODE_WORKER_WORKSPACE_EXEC_COMMAND,
					params: input,
					timeoutMs: remainingMs,
					signal,
					isDispatchAuthorized: () => isEnvironmentOwner(entry)
				});
			} catch (error) {
				if (command.transportRetry !== "idempotent" || signal.aborted || !isEnvironmentOwner(entry)) throw error;
				await sleepWithAbort(Math.min(RETRY_DELAY_MS, Math.max(1, deadline - Date.now())), signal);
				continue;
			}
			if (!result.ok) {
				const code = result.error?.code ?? "UNAVAILABLE";
				if (code === "WORKSPACE_TRANSFER_FAILED") throw new NodeWorkerWorkspaceTransferError(result.error?.message ?? "workspace-transfer-failed: transfer did not complete");
				if (command.transportRetry === "idempotent" && RETRYABLE_TRANSPORT_CODES.has(code)) {
					await sleepWithAbort(Math.min(RETRY_DELAY_MS, remainingMs), signal);
					continue;
				}
				throw new Error(result.error?.message && code === "INVALID_REQUEST" ? `node workspace command failed (${code}): ${result.error.message}` : `node workspace command failed (${code})`);
			}
			const parsed = parseNodeWorkerWorkspaceExecResult(payloadJson(result.payloadJSON));
			if (!parsed) throw new Error("node workspace command violated its private result contract");
			return parsed;
		}
	};
	const createHandle = (entry, restoredWorkspace) => {
		const { validateRestoredWorkspace, ...workspaceActions } = createNodeWorkerWorkspaceActions({
			environmentId: entry.environmentId,
			ownerEpoch: entry.ownerEpoch,
			sessionId: entry.sessionId,
			ownerSignal: entry.abortController.signal,
			isOwnerCurrent: () => isLiveEntry(entry),
			restoredWorkspace,
			workspaceTransfer: options.workspaceTransfer,
			runWorkspaceCommand: (command) => runWorkspaceCommand(entry, entry.ownerEpoch, command)
		});
		return {
			handle: {
				...workspaceActions,
				environmentId: entry.environmentId,
				ownerEpoch: entry.ownerEpoch,
				launchTurn: async (request) => {
					if (entry.executionMode !== "worker-turn") throw new Error("remote-exec environments do not launch embedded worker turns");
					const plan = request.plan;
					const claim = request.turnClaim;
					const isDispatchAuthorized = () => isEnvironmentOwner(entry) && claim.owner.kind === "worker" && claim.owner.environmentId === entry.environmentId && claim.owner.ownerEpoch === entry.ownerEpoch && claim.sessionId === plan.admission.sessionId && claim.runId === plan.assignment.runId && options.validateWorkerTurn(claim);
					const operation = options.launchNodeWorker({
						deviceId: entry.deviceId,
						input: {
							environmentSession: 1,
							launchId: plan.assignment.turnId,
							gatewayNamespace,
							expectedBundleHash: entry.expectedBuild.bundleHash,
							placementGeneration: claim.placementGeneration,
							descriptor: plan
						},
						isDispatchAuthorized,
						isCancellationAuthorized: () => hasDurableBinding(entry),
						timeoutMs: request.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS,
						...request.credentialExpiresAtMs === void 0 ? {} : { credentialExpiresAtMs: request.credentialExpiresAtMs },
						onDispatchReady: request.onDispatchReady,
						signal: request.signal ? AbortSignal.any([entry.abortController.signal, request.signal]) : entry.abortController.signal
					});
					entry.launchTasks.add(operation);
					try {
						return spawnResultFromReceipt(await operation);
					} finally {
						entry.launchTasks.delete(operation);
					}
				},
				stop: async () => {
					await stopEntry(entry);
				}
			},
			validateRestoredWorkspace
		};
	};
	function stopEntry(entry, reason) {
		if (entries.get(entry.environmentId) === entry) entries.delete(entry.environmentId);
		entry.abortController.abort(/* @__PURE__ */ new Error("node worker tunnel owner stopped"));
		entry.readiness.reject(/* @__PURE__ */ new Error("node worker tunnel stopped before connecting"));
		return stopEnvironmentOwner(entry, reason, async () => {
			await entry.initialization?.catch(() => void 0);
			await Promise.allSettled(entry.launchTasks);
		});
	}
	function stopEnvironmentOwner(entry, reason, drain) {
		if (entry.stopPromise) {
			if (entry.stopReason === reason || !retiredEntries.has(entry)) return entry.stopPromise;
			return entry.stopPromise.catch((error) => {
				if (!reason) throw error;
			}).then(() => retiredEntries.has(entry) ? stopEnvironmentOwner(entry, reason) : void 0);
		}
		retiredEntries.add(entry);
		entry.stopReason = reason;
		entry.stopPromise = (async () => {
			await drain?.();
			let stopping = true;
			try {
				if (entry.executionMode === "worker-turn" && reason === void 0) {
					const signal = AbortSignal.timeout(DEFAULT_COMMAND_TIMEOUT_MS);
					const { transport, node } = await findNode(entry, signal);
					if (node.workerHost.environmentSession !== 1) throw new Error(formatNodeRunnerUpdateRequired(node.nodeId, NODE_RUNNER_UPDATE_REQUIRED_ISSUE));
					const result = await raceWithSignal(transport.invoke({
						node,
						command: NODE_WORKER_ENVIRONMENT_STOP_COMMAND,
						params: {
							gatewayNamespace,
							environmentId: entry.environmentId,
							sessionId: entry.sessionId,
							ownerEpoch: entry.ownerEpoch
						},
						timeoutMs: DEFAULT_COMMAND_TIMEOUT_MS,
						signal,
						isDispatchAuthorized: () => stopping && retiredEntries.has(entry)
					}), signal);
					if (!result.ok) throw new Error(`node worker environment stop failed (${result.error?.code ?? "UNAVAILABLE"})`);
				}
			} finally {
				stopping = false;
				await options.workspaceTransfer.close(entry.environmentId);
			}
			if (reason !== "provider-destroying") retiredEntries.delete(entry);
		})().finally(() => {
			if (retiredEntries.has(entry)) entry.stopPromise = void 0;
		});
		return entry.stopPromise;
	}
	async function stop(environmentId, ownerEpoch, reason) {
		const matches = (entry) => entry.environmentId === environmentId && (ownerEpoch === void 0 || ownerEpoch === entry.ownerEpoch);
		const live = [...entries.values()].filter(matches);
		const retired = [...retiredEntries].filter(matches);
		const operations = [...live.map((entry) => stopEntry(entry, reason)), ...retired.map((entry) => stopEnvironmentOwner(entry, reason))];
		if (operations.length === 0) {
			const record = options.getEnvironment(environmentId);
			if (record?.nodeDeviceId && (ownerEpoch === void 0 || record.ownerEpoch === ownerEpoch)) if (reason) operations.push(options.workspaceTransfer.close(environmentId));
			else {
				if (record.attachedSessionIds.length > 1) throw new Error("node worker environment teardown has an ambiguous session owner");
				const sessionId = record.attachedSessionIds[0];
				if (sessionId) operations.push(stopEnvironmentOwner({
					deviceId: record.nodeDeviceId,
					environmentId,
					ownerEpoch: record.ownerEpoch,
					sessionId,
					executionMode: record.profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn"
				}));
			}
		}
		const failure = (await Promise.allSettled(operations)).find((outcome) => outcome.status === "rejected");
		if (failure) throw failure.reason;
	}
	return {
		bindWorkspaceBindingResolver(resolver) {
			resolveWorkspaceBinding = resolver;
		},
		async start(request) {
			const current = entries.get(request.environmentId);
			const retiring = [...retiredEntries].filter((entry) => entry.environmentId === request.environmentId);
			if (retiring.some((entry) => entry.ownerEpoch > request.ownerEpoch)) throw new Error("node worker tunnel owner epoch is stale");
			if (current) {
				if (request.ownerEpoch < current.ownerEpoch) throw new Error("node worker tunnel owner epoch is stale");
				if (request.ownerEpoch === current.ownerEpoch) {
					if (current.abortController.signal.aborted || current.executionMode !== request.executionMode || current.deviceId !== request.deviceId || current.sessionId !== request.sessionId || !sameWorkerBuild(current.expectedBuild, request.expectedBuild)) throw new Error("node worker tunnel owner binding changed within one epoch");
					return current.readiness.promise;
				}
			}
			const readiness = createDeferredCore();
			readiness.promise.catch(() => void 0);
			const entry = {
				...request,
				gatewayNamespace,
				abortController: new AbortController(),
				launchTasks: /* @__PURE__ */ new Set(),
				readiness
			};
			entries.set(entry.environmentId, entry);
			entry.initialization = (async () => {
				if (current) await stopEntry(current);
				await Promise.all(retiring.map((owner) => stopEnvironmentOwner(owner)));
				if (!isLiveEntry(entry)) return;
				const restoredWorkspace = resolveWorkspaceBinding ? await raceWithSignal(resolveWorkspaceBinding({
					environmentId: request.environmentId,
					ownerEpoch: request.ownerEpoch,
					sessionId: request.sessionId
				}), entry.abortController.signal) : void 0;
				if (!isLiveEntry(entry)) return;
				const created = createHandle(entry, restoredWorkspace);
				await created.validateRestoredWorkspace();
				if (!isLiveEntry(entry)) return;
				entry.handle = created.handle;
				readiness.resolve(created.handle);
			})();
			entry.initialization.catch((error) => {
				readiness.reject(error);
				stopEntry(entry).catch((cleanupError) => {
					tunnelLog.warn("node worker tunnel cleanup failed after initialization error", {
						environmentId: entry.environmentId,
						ownerEpoch: entry.ownerEpoch,
						error: boundedWorkerError(cleanupError)
					});
				});
			});
			return await readiness.promise;
		},
		stop,
		async stopAll() {
			const environmentIds = /* @__PURE__ */ new Set([
				...entries.keys(),
				...[...retiredEntries].map((entry) => entry.environmentId),
				...options.listEnvironments().filter((record) => record.nodeDeviceId).map((record) => record.environmentId)
			]);
			const stopped = await Promise.allSettled([...environmentIds].map((environmentId) => stop(environmentId)));
			stopped.push(...await Promise.allSettled([options.workspaceTransfer.closeAll()]));
			const failure = stopped.find((result) => result.status === "rejected");
			if (failure) throw failure.reason;
		},
		status(environmentId) {
			const entry = entries.get(environmentId);
			return entry && !entry.abortController.signal.aborted ? entry.handle ? "connected" : "connecting" : "stopped";
		}
	};
}
//#endregion
export { createNodeWorkerTunnelManager };
