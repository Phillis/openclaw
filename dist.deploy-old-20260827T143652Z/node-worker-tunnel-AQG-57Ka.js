import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { y as NODE_WORKER_WORKSPACE_EXEC_COMMAND } from "./node-commands-DemsbVYQ.js";
import "./backoff-BkMI1WEL.js";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.js";
import { i as parseNodeWorkerWorkspaceExecResult } from "./node-workspace-protocol-DlQjlWdM.js";
import { r as NodeWorkerWorkspaceTransferError } from "./node-workspace-transfer-protocol-BlZMCwT7.js";
import { y as serializeWorkerWorkspaceManifest } from "./workspace-actual-manifest-B7ccel6H.js";
import { a as recoverWorkerWorkspaceReconciliation, s as assertWorkspaceResultStable, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-pxprMj1H.js";
import { d as workerWorkspaceResultStaging } from "./workspace-result-staging-Gr33yVbq.js";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-DLvOPcsX.js";
import { t as nodeWorkerGatewayNamespace } from "./node-worker-gateway-namespace-kRiA3LFq.js";
import { t as createWorkerWorkspaceQuiescence } from "./workspace-quiescence-EL0lTEYA.js";
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
		let refs;
		try {
			refs = await localGit(root, [
				"ls-remote",
				"--heads",
				"--tags",
				"--",
				origin
			]);
		} catch {
			return {
				kind: "fallback",
				reason: "origin-unavailable"
			};
		}
		return refs.split("\n").some((line) => line.slice(0, commit.length) === commit && /\srefs\//u.test(line)) ? {
			kind: "eligible",
			identity: {
				commit,
				origin,
				root
			}
		} : {
			kind: "fallback",
			reason: "origin-unpublished"
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
	return { async trySyncWorkspace(request, expectedManifestRef) {
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
		const captured = await exec({
			argv: [
				"node",
				"-e",
				REMOTE_WORKSPACE_MANIFEST_JS,
				checkedOut.workspaceDir,
				identity.commit,
				"eligible"
			],
			timeoutMs: GIT_TIMEOUT_MS,
			transportRetry: "idempotent"
		});
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
	} };
}
//#endregion
//#region src/gateway/worker-environments/node-worker-tunnel.ts
const DEFAULT_COMMAND_TIMEOUT_MS = 6e4;
const RETRY_DELAY_MS = 100;
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
	const pendingStarts = /* @__PURE__ */ new Map();
	let resolveWorkspaceBinding;
	const gatewayNamespace = nodeWorkerGatewayNamespace(options.gatewayDeviceId);
	const hasDurableBinding = (entry) => {
		const current = options.getEnvironment(entry.environmentId);
		return Boolean(current && current.ownerEpoch === entry.ownerEpoch && current.bootstrapReceipt?.installKind === "local" && sameWorkerBuild(current.bootstrapReceipt, entry.expectedBuild) && current.attachedSessionIds.length <= 1 && (current.attachedSessionIds.length === 0 || current.attachedSessionIds[0] === entry.sessionId));
	};
	const isLiveEntry = (entry) => entries.get(entry.environmentId) === entry && !entry.abortController.signal.aborted;
	const isEnvironmentOwner = (entry) => hasDurableBinding(entry) && isLiveEntry(entry);
	const findNode = async (entry, signal) => {
		const transport = options.getTransport();
		if (!transport) throw new Error("device worker node transport is unavailable");
		const node = (await raceWithSignal(transport.listCurrentNodes(), signal)).find((candidate) => candidate.nodeId === entry.deviceId && candidate.workerBuild && sameWorkerBuild(candidate.workerBuild, entry.expectedBuild));
		if (!node) throw new Error("device worker node is not connected with the expected build");
		return {
			transport,
			node
		};
	};
	const runWorkspaceCommand = async (entry, generation, command) => {
		const timeoutMs = command.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS;
		const deadline = Date.now() + timeoutMs;
		const signals = [entry.abortController.signal, AbortSignal.timeout(timeoutMs)];
		if (command.signal) signals.push(command.signal);
		const signal = AbortSignal.any(signals);
		const input = {
			gatewayNamespace,
			environmentId: entry.environmentId,
			sessionId: entry.sessionId,
			generation,
			argv: [...command.argv],
			...command.input === void 0 ? {} : { input: command.input },
			...command.timeoutMs === void 0 ? {} : { timeoutMs: command.timeoutMs },
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
		let workspaceReady = restoredWorkspace !== void 0;
		const exec = async (command) => {
			if (!workspaceReady) throw new Error("node worker workspace is unavailable before sync");
			return await runWorkspaceCommand(entry, entry.ownerEpoch, command);
		};
		const workspace = createNodeWorkerWorkspaceFallback(exec);
		const quiesceWorkspace = createWorkerWorkspaceQuiescence({
			ownerSignal: entry.abortController.signal,
			sharedHost: true,
			runWorkspaceCommand: async (command) => await exec(command)
		});
		const captureManifest = async (remoteWorkspaceDir, baseCommit) => {
			const captured = await exec({
				argv: [
					"node",
					"-e",
					REMOTE_WORKSPACE_MANIFEST_JS,
					remoteWorkspaceDir,
					...baseCommit ? [baseCommit, "eligible"] : []
				],
				transportRetry: "idempotent"
			});
			const manifestRef = captured.stdout.trim();
			if (captured.termination !== "exit" || captured.code !== 0 || !/^sha256:[a-f0-9]{64}$/u.test(manifestRef)) throw new Error("Node workspace manifest capture failed");
			return manifestRef;
		};
		const validateRestoredWorkspace = async () => {
			if (!restoredWorkspace) return;
			const prepared = await options.workspaceTransfer.prepareSync({
				environmentId: entry.environmentId,
				ownerEpoch: entry.ownerEpoch,
				sessionId: entry.sessionId,
				generation: entry.ownerEpoch,
				localPath: restoredWorkspace.localPath,
				isAuthorized: () => isLiveEntry(entry),
				signal: entry.abortController.signal
			});
			options.workspaceTransfer.revoke(entry.environmentId, prepared.token);
			if (prepared.snapshot.manifestRef !== restoredWorkspace.manifestRef) throw new Error("Gateway workspace changed before node tunnel recovery");
			const quiescence = await quiesceWorkspace(restoredWorkspace.remoteWorkspaceDir);
			try {
				if (await captureManifest(restoredWorkspace.remoteWorkspaceDir, prepared.snapshot.manifest.baseCommit) !== restoredWorkspace.manifestRef) throw new Error("Node workspace changed before tunnel recovery");
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
			const uploadToken = options.workspaceTransfer.prepareUpload(entry.environmentId, request.baseManifestRef);
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
				options.workspaceTransfer.revoke(entry.environmentId, uploadToken);
			}
			if (uploadedResult.termination !== "exit" || uploadedResult.code !== 0) throw new Error("Node workspace reconcile upload failed");
			const uploaded = options.workspaceTransfer.takeUpload(entry.environmentId, request.baseManifestRef);
			try {
				const changed = uploaded.currentManifestRef !== request.baseManifestRef;
				let expectedRemoteRef = uploaded.currentManifestRef;
				const verifyStable = async () => {
					if (await captureManifest(request.remoteWorkspaceDir, uploaded.base.baseCommit) !== expectedRemoteRef) throw new Error("Cloud workspace changed during final reconciliation");
				};
				await verifyStable();
				const publishAcceptedManifest = async (accepted) => {
					if (accepted.manifestRef === expectedRemoteRef) return;
					const baseSnapshot = options.workspaceTransfer.getSnapshot(entry.environmentId, request.baseManifestRef);
					const token = options.workspaceTransfer.publishSnapshot(entry.environmentId, {
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
						options.workspaceTransfer.revoke(entry.environmentId, token);
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
			handle: {
				environmentId: entry.environmentId,
				ownerEpoch: entry.ownerEpoch,
				launchTurn: async (request) => {
					const plan = request.plan;
					const isDispatchAuthorized = () => isEnvironmentOwner(entry) && options.validateWorkerTurn({
						environmentId: entry.environmentId,
						ownerEpoch: entry.ownerEpoch,
						sessionId: plan.admission.sessionId,
						runId: plan.assignment.runId
					});
					const operation = options.launchNodeWorker({
						deviceId: entry.deviceId,
						input: {
							launchId: plan.assignment.turnId,
							gatewayNamespace,
							installKind: "local",
							expectedBundleHash: entry.expectedBuild.bundleHash,
							placementGeneration: request.placementGeneration,
							descriptor: plan
						},
						isDispatchAuthorized,
						isCancellationAuthorized: () => hasDurableBinding(entry),
						timeoutMs: request.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS,
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
				runWorkspaceCommand: async (command) => await exec(command),
				syncWorkspace: async (request) => {
					workspaceReady = true;
					try {
						const prepared = await options.workspaceTransfer.prepareSync({
							environmentId: entry.environmentId,
							ownerEpoch: entry.ownerEpoch,
							sessionId: entry.sessionId,
							generation: entry.ownerEpoch,
							localPath: request.localPath,
							isAuthorized: () => isLiveEntry(entry),
							signal: entry.abortController.signal
						});
						try {
							const originStartedAt = performance.now();
							const origin = await workspace.trySyncWorkspace(request, prepared.snapshot.manifestRef);
							recordNodeSyncPath(entry.environmentId, entry.sessionId, origin, originStartedAt);
							if (origin.kind === "synced") return origin.result;
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
							return {
								mode: prepared.snapshot.manifest.baseCommit ? "git" : "plain",
								remoteWorkspaceDir: transferred.workspaceDir,
								manifestRef: prepared.snapshot.manifestRef
							};
						} finally {
							options.workspaceTransfer.revoke(entry.environmentId, prepared.token);
						}
					} catch (error) {
						workspaceReady = restoredWorkspace !== void 0;
						throw error;
					}
				},
				quiesceWorkspace,
				reconcileWorkspace,
				stop: async () => {
					await stopEntry(entry);
				}
			},
			validateRestoredWorkspace
		};
	};
	function stopEntry(entry) {
		if (entry.stopPromise) return entry.stopPromise;
		entry.abortController.abort(/* @__PURE__ */ new Error("node worker tunnel owner stopped"));
		entry.stopPromise = Promise.allSettled(entry.launchTasks).then(() => {
			if (entries.get(entry.environmentId) === entry) entries.delete(entry.environmentId);
			return options.workspaceTransfer.close(entry.environmentId);
		});
		return entry.stopPromise;
	}
	return {
		bindWorkspaceBindingResolver(resolver) {
			resolveWorkspaceBinding = resolver;
		},
		async start(request) {
			const pending = {
				ownerEpoch: request.ownerEpoch,
				cancelled: false
			};
			pendingStarts.set(request.environmentId, pending);
			try {
				const current = entries.get(request.environmentId);
				if (current) {
					if (request.ownerEpoch < current.ownerEpoch) throw new Error("node worker tunnel owner epoch is stale");
					if (request.ownerEpoch === current.ownerEpoch) {
						if (current.abortController.signal.aborted || current.deviceId !== request.deviceId || current.sessionId !== request.sessionId || !sameWorkerBuild(current.expectedBuild, request.expectedBuild)) throw new Error("node worker tunnel owner binding changed within one epoch");
						return current.handle;
					}
					await stopEntry(current);
				}
				if (pending.cancelled || pendingStarts.get(request.environmentId) !== pending) throw new Error("node worker tunnel start was cancelled");
				const restoredWorkspace = await resolveWorkspaceBinding?.({
					environmentId: request.environmentId,
					ownerEpoch: request.ownerEpoch,
					sessionId: request.sessionId
				});
				if (pending.cancelled || pendingStarts.get(request.environmentId) !== pending) throw new Error("node worker tunnel start was cancelled");
				const entry = {
					...request,
					gatewayNamespace,
					abortController: new AbortController(),
					launchTasks: /* @__PURE__ */ new Set(),
					handle: void 0
				};
				const created = createHandle(entry, restoredWorkspace);
				entry.handle = created.handle;
				entries.set(entry.environmentId, entry);
				try {
					await created.validateRestoredWorkspace();
					if (pending.cancelled || pendingStarts.get(request.environmentId) !== pending) throw new Error("node worker tunnel start was cancelled");
					return entry.handle;
				} catch (error) {
					await stopEntry(entry);
					throw error;
				}
			} finally {
				if (pendingStarts.get(request.environmentId) === pending) pendingStarts.delete(request.environmentId);
			}
		},
		async stop(environmentId, ownerEpoch) {
			const pending = pendingStarts.get(environmentId);
			if (pending && (ownerEpoch === void 0 || ownerEpoch === pending.ownerEpoch)) pending.cancelled = true;
			const entry = entries.get(environmentId);
			if (entry && (ownerEpoch === void 0 || ownerEpoch === entry.ownerEpoch)) await stopEntry(entry);
		},
		async stopAll() {
			for (const pending of pendingStarts.values()) pending.cancelled = true;
			await Promise.all([...entries.values()].map(stopEntry));
			await options.workspaceTransfer.closeAll();
		},
		status(environmentId) {
			const entry = entries.get(environmentId);
			return entry && !entry.abortController.signal.aborted ? "connected" : "stopped";
		}
	};
}
//#endregion
export { createNodeWorkerTunnelManager };
