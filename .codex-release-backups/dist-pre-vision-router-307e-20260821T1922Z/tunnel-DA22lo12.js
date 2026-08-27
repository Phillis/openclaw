import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as redactSensitiveText } from "./redact-Cl7lwBnl.js";
import "./fs-safe-C9N8pCh1.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import { s as sleepWithAbort, t as RetrySupervisor } from "./src-BQ327IOM.js";
import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import "./backoff-BkMI1WEL.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { a as workerSshCommandOptions, i as runWorkerSshCandidates, n as prepareWorkerSsh, o as workerSshOptions, s as workerSshRemoteCommand, t as advanceWorkerSshAfterTransportExit } from "./ssh-DfcMAYGe.js";
import { n as REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS, r as REMOTE_GIT_WORKSPACE_RETRY_RESET_JS } from "./workspace-accepted-remote-script-Jty3rgu_.js";
import { i as DERIVED_WORKSPACE_RSYNC_EXCLUDES } from "./workspace-path-exclusions-DDdHI_3m.js";
import { n as completeWorkerLaunchDescriptor } from "./launch-descriptor-CCSAs-Jn.js";
import { T as MAX_WORKSPACE_MANIFEST_BYTES, _ as parseWorkerWorkspaceManifest, d as withWorkspaceHashMemo, h as MAX_RECONCILIATION_TOTAL_BYTES, i as MAX_WORKSPACE_HASH_MEMO_BYTES, m as MAX_RECONCILIATION_FILE_BYTES, o as createWorkspaceReconcileMetrics, p as MAX_RECONCILIATION_ENTRIES, s as measureLocalWorkspaceReconciliation, y as serializeWorkerWorkspaceManifest } from "./workspace-actual-manifest-B7ccel6H.js";
import { a as recoverWorkerWorkspaceReconciliation, c as changedPaths, i as parseAcceptedWorkspaceSettlement, n as AcceptedWorkspacePublicationIndeterminateError, o as assertWorkspaceMatchesManifest, r as isAcceptedWorkspacePublicationIndeterminateError, s as assertWorkspaceResultStable, t as applyStagedWorkerWorkspace, u as manifestNodes } from "./workspace-reconcile-pxprMj1H.js";
import { d as workerWorkspaceResultStaging, f as workerWorkspaceTransferPaths } from "./workspace-result-staging-Gr33yVbq.js";
import { n as REMOTE_WORKSPACE_MANIFEST_JS, r as REMOTE_WORKSPACE_SETUP_SCRIPT, t as REMOTE_GIT_WORKSPACE_SETUP_SCRIPT } from "./workspace-sync-scripts-DLvOPcsX.js";
import { n as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-DuVR-4hZ.js";
import { n as DesktopSessionStoppedError, r as createDesktopSessionRegistry, t as DesktopSessionStaleOwnerError } from "./session-registry-CXjtG6_S.js";
import { i as runLocalCommandToFile, n as filterExistingGitTransferList, t as createGitTransferList } from "./workspace-sync-local-_1moU4wK.js";
import { t as boundedWorkerError } from "./worker-error-BY3ISuTB.js";
import { n as registerWorkspaceReconcileReporter } from "./workspace-finalize-i1F3pPpk.js";
import { _ as workerWorkspaceSshArgv, a as parseManifestRef, c as readTransferredManifest, d as stableWorkerPathComponent, f as validateWorkspaceSyncRequest, g as workerWorkspaceRsyncRemoteCommand, h as workerWorkspaceRsyncReceiverEntryPath, i as createWorkerWorkspaceRsyncReceiverPathFactory, l as resolveRemoteWorkspaceManifest, m as workerWorkspaceCommandSucceeded, n as WORKER_WORKSPACE_RSYNC_DESTINATION, o as parseRemoteWorkspaceSetup, p as workerAcceptedWorkspaceRsyncReceiverPath, r as captureRemoteWorkspaceManifest, s as probeWorkspaceGitMode, t as createWorkerWorkspaceQuiescence, u as runBoundedInboundRsync, v as workspaceSyncError } from "./workspace-quiescence-EL0lTEYA.js";
import { createHash, randomBytes } from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
//#region src/gateway/worker-environments/tunnel-ssh-runner.ts
const WORKER_TUNNEL_READY_MARKER = "OPENCLAW_WORKER_TUNNEL_READY";
const STOP_GRACE_MS = 1500;
const STOP_KILL_WAIT_MS = 2e3;
function workerSshProcessError(stderr) {
	const detail = redactSensitiveText(stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return /* @__PURE__ */ new Error(detail ? `Worker SSH tunnel failed: ${detail}` : "Worker SSH tunnel failed");
}
/** Production runner that treats the remote post-forward marker as connection readiness. */
function createWorkerSshRunner() {
	return {
		run: runCommandWithTimeout,
		start(argv, options) {
			const [command, ...args] = argv;
			if (!command) throw new Error("Worker SSH runner requires a command");
			const child = spawn(command, args, {
				env: options.baseEnv,
				signal: options.signal,
				stdio: [
					"pipe",
					"pipe",
					"pipe"
				],
				windowsHide: true
			});
			let closed = false;
			let exitedSettled = false;
			let readySettled = false;
			let resolveReady;
			let rejectReady;
			let resolveExited;
			const ready = new Promise((resolve, reject) => {
				resolveReady = resolve;
				rejectReady = reject;
			});
			ready.catch(() => {});
			const exited = new Promise((resolve) => {
				resolveExited = resolve;
			});
			let stdout = "";
			let stderr = "";
			const settleReadyError = () => {
				if (readySettled) return;
				readySettled = true;
				rejectReady(workerSshProcessError(stderr));
			};
			const settleExited = (exit) => {
				if (exitedSettled) return;
				exitedSettled = true;
				resolveExited(exit);
			};
			child.stdout.setEncoding("utf8");
			child.stdout.on("error", () => {});
			child.stdout.on("data", (chunk) => {
				if (readySettled) return;
				stdout = sliceUtf16Safe(`${stdout}${chunk}`, -4096);
				if (stdout.split(/\r?\n/u).includes("OPENCLAW_WORKER_TUNNEL_READY")) {
					readySettled = true;
					resolveReady();
				}
			});
			child.stderr.setEncoding("utf8");
			child.stderr.on("error", () => {});
			child.stderr.on("data", (chunk) => {
				stderr = sliceUtf16Safe(`${stderr}${chunk}`, -4096);
			});
			child.once("error", () => {
				settleReadyError();
				if (child.pid === void 0) {
					closed = true;
					settleExited({
						code: null,
						signal: null
					});
				}
			});
			let exitEventResult;
			child.once("exit", (code, signal) => {
				exitEventResult = {
					code,
					signal
				};
				settleExited(exitEventResult);
				child.stdin.destroy();
				setImmediate(() => {
					settleReadyError();
					child.stdout.destroy();
					child.stderr.destroy();
				});
			});
			child.once("close", (code, signal) => {
				closed = true;
				settleReadyError();
				settleExited({
					code,
					signal
				});
			});
			child.stdin.on("error", () => {});
			if (options.input !== void 0) child.stdin.end(options.input);
			else child.stdin.end();
			let stopPromise;
			return {
				ready,
				exited,
				stop() {
					return stopPromise ??= (async () => {
						if (closed) return;
						child.kill("SIGTERM");
						let timer;
						await Promise.race([exited, new Promise((resolve) => {
							timer = setTimeout(resolve, STOP_GRACE_MS);
							timer.unref?.();
						})]);
						clearTimeout(timer);
						if (!closed && !exitedSettled) {
							const killDelivered = child.kill("SIGKILL");
							let killTimer;
							let killWaitExpired = false;
							await Promise.race([exited, new Promise((resolve) => {
								killTimer = setTimeout(() => {
									killWaitExpired = true;
									resolve();
								}, STOP_KILL_WAIT_MS);
								killTimer.unref?.();
							})]);
							clearTimeout(killTimer);
							if (killWaitExpired) throw workerSshProcessError(killDelivered ? "SSH child did not exit after SIGKILL; it may still be running" : "SIGKILL delivery failed; SSH child may still be running");
						}
					})();
				}
			};
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/desktop-tunnel.ts
const PASSWORD_READ_TIMEOUT_MS = 2e4;
const APP_LAUNCH_TIMEOUT_MS = 3e4;
const REMOTE_DESKTOP_READY_SCRIPT = String.raw`set -eu
printf '%s\n' '${WORKER_TUNNEL_READY_MARKER}'
trap 'exit 0' HUP INT TERM
while :; do sleep 3600; done
`;
var WorkerDesktopUnsupportedError = class extends Error {
	constructor(operation = "desktop observe") {
		super(`${operation} is not supported on Windows gateway hosts`);
		this.code = "unsupported_platform";
		this.name = "WorkerDesktopUnsupportedError";
	}
};
function successful(result) {
	return result.termination === "exit" && result.code === 0;
}
/** Owns worker-specific desktop SSH acquisition and app launch processes. */
function createWorkerDesktopTunnels(deps) {
	const platform = deps.platform ?? process.platform;
	const sessions = deps.registry ?? createDesktopSessionRegistry({ lingerMs: deps.lingerMs });
	const appLaunches = /* @__PURE__ */ new Map();
	const appLaunchKey = (environmentId, appId) => `${environmentId}\0${appId}`;
	const stopAppLaunches = async (environmentId, ownerEpoch) => {
		const matching = [...appLaunches.values()].filter((entry) => entry.environmentId === environmentId && (ownerEpoch === void 0 || entry.ownerEpoch === ownerEpoch));
		for (const entry of matching) entry.abortController.abort(/* @__PURE__ */ new Error("Worker desktop app launch owner stopped"));
		await Promise.allSettled(matching.map((entry) => entry.operation));
	};
	const claimOwnerEpoch = (environmentId, ownerEpoch) => {
		try {
			return sessions.claimOwnerEpoch(environmentId, ownerEpoch);
		} catch (error) {
			if (error instanceof DesktopSessionStaleOwnerError) throw new Error("Worker desktop owner epoch is stale", { cause: error });
			throw error;
		}
	};
	const fenceReplacedOwners = async (environmentId, ownerEpoch) => {
		await sessions.stopSuperseded(environmentId, ownerEpoch);
		const staleLaunches = [...appLaunches.values()].filter((entry) => entry.environmentId === environmentId && entry.ownerEpoch < ownerEpoch);
		for (const entry of staleLaunches) entry.abortController.abort(/* @__PURE__ */ new Error("Worker desktop app launch owner replaced"));
		await Promise.allSettled(staleLaunches.map((entry) => entry.operation));
	};
	const createSessionHooks = (request) => {
		let prepared;
		let child;
		let stoppedChild;
		let startSettled = false;
		const start = async (isCurrent) => {
			try {
				prepared = await prepareWorkerSsh({
					ssh: request.ssh,
					pinnedHostKey: request.ssh.hostKey,
					resolveIdentity: request.resolveIdentity,
					temporaryDirectoryPrefix: "openclaw-worker-desktop-"
				});
				if (!isCurrent()) {
					await prepared.dispose();
					prepared = void 0;
					throw new Error("Worker desktop tunnel stopped before connecting");
				}
				const localSocketPath = path.join(path.dirname(prepared.knownHostsPath), "desktop.sock");
				child = deps.runner.start([
					"ssh",
					...workerSshOptions(prepared, { forwarding: "explicit" }),
					"-a",
					"-x",
					"-T",
					"-o",
					"ServerAliveInterval=15",
					"-o",
					"ServerAliveCountMax=3",
					"-o",
					"StreamLocalBindMask=0177",
					"-L",
					`${localSocketPath}:127.0.0.1:${request.desktop.port}`,
					"-p",
					String(prepared.port),
					"--",
					prepared.sshTarget,
					workerSshRemoteCommand(["sh", "-s"])
				], workerSshCommandOptions({
					input: REMOTE_DESKTOP_READY_SCRIPT,
					timeoutMs: Number.MAX_SAFE_INTEGER
				}));
				const startedChild = child;
				startedChild.exited.then(() => {
					if (isCurrent()) sessions.stop(request.environmentId, request.ownerEpoch);
				});
				await startedChild.ready;
				if (!isCurrent()) {
					await startedChild.stop();
					throw new Error("Worker desktop tunnel stopped before connecting");
				}
				let vncPassword;
				if (request.desktop.passwordFilePath) {
					const result = await deps.runner.run([
						"ssh",
						...workerSshOptions(prepared, { forwarding: "disabled" }),
						"-a",
						"-x",
						"-T",
						"-p",
						String(prepared.port),
						"--",
						prepared.sshTarget,
						workerSshRemoteCommand(["cat", request.desktop.passwordFilePath])
					], workerSshCommandOptions({ timeoutMs: PASSWORD_READ_TIMEOUT_MS }));
					if (!successful(result)) throw workerSshProcessError(result.stderr || result.stdout);
					vncPassword = result.stdout.replace(/(?:\r?\n)+$/u, "");
					if (!vncPassword) throw new Error("Worker desktop password file is empty");
					registerSecretValueForRedaction(vncPassword);
				}
				return {
					attachment: {
						kind: "unix-socket",
						socketPath: localSocketPath
					},
					...vncPassword ? { vncPassword } : {}
				};
			} finally {
				startSettled = true;
			}
		};
		const teardown = async () => {
			if (child && child !== stoppedChild) {
				stoppedChild = child;
				await child.stop().catch(() => void 0);
			}
			if (!startSettled) return;
			if (child && child !== stoppedChild) {
				stoppedChild = child;
				await child?.stop().catch(() => void 0);
			}
			await prepared?.dispose().catch(() => void 0);
			prepared = void 0;
		};
		return {
			start,
			teardown
		};
	};
	async function acquire(request) {
		if (platform === "win32") throw new WorkerDesktopUnsupportedError();
		if (claimOwnerEpoch(request.environmentId, request.ownerEpoch)) await fenceReplacedOwners(request.environmentId, request.ownerEpoch);
		if (!sessions.isOwnerEpochCurrent(request.environmentId, request.ownerEpoch)) throw new Error("Worker desktop owner epoch is stale");
		const hooks = createSessionHooks(request);
		try {
			return await sessions.acquire({
				sourceKey: request.environmentId,
				ownerEpoch: request.ownerEpoch,
				...hooks
			});
		} catch (error) {
			if (error instanceof DesktopSessionStaleOwnerError) throw new Error("Worker desktop owner epoch is stale", { cause: error });
			if (error instanceof DesktopSessionStoppedError) throw new Error("Worker desktop tunnel stopped before connecting", { cause: error });
			throw error;
		}
	}
	function launchApp(request) {
		if (platform === "win32") return Promise.reject(new WorkerDesktopUnsupportedError("desktop app launch"));
		let ownerAdvanced;
		try {
			ownerAdvanced = claimOwnerEpoch(request.environmentId, request.ownerEpoch);
		} catch (error) {
			return Promise.reject(error instanceof Error ? error : new Error("Worker desktop owner epoch is invalid", { cause: error }));
		}
		const key = appLaunchKey(request.environmentId, request.app.id);
		const current = appLaunches.get(key);
		if (current?.ownerEpoch === request.ownerEpoch) return current.operation;
		const abortController = new AbortController();
		const startedAtMs = Date.now();
		let startExecution;
		const startGate = new Promise((resolve) => {
			startExecution = resolve;
		});
		const execution = (async () => {
			await startGate;
			abortController.signal.throwIfAborted();
			if (!sessions.isOwnerEpochCurrent(request.environmentId, request.ownerEpoch)) throw new Error("Worker desktop app launch owner was replaced");
			if (current) {
				current.abortController.abort(/* @__PURE__ */ new Error("Worker desktop app launch owner replaced"));
				await current.operation.catch(() => void 0);
			}
			if (ownerAdvanced) await fenceReplacedOwners(request.environmentId, request.ownerEpoch);
			abortController.signal.throwIfAborted();
			const prepared = await prepareWorkerSsh({
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "openclaw-worker-desktop-app-"
			});
			try {
				abortController.signal.throwIfAborted();
				const remainingLaunchMs = Math.max(0, APP_LAUNCH_TIMEOUT_MS - (Date.now() - startedAtMs));
				const result = await deps.runner.run([
					"ssh",
					...workerSshOptions(prepared, { forwarding: "disabled" }),
					"-a",
					"-x",
					"-T",
					"-p",
					String(prepared.port),
					"--",
					prepared.sshTarget,
					workerSshRemoteCommand([request.app.executablePath])
				], workerSshCommandOptions({
					timeoutMs: remainingLaunchMs,
					signal: abortController.signal
				}));
				if (!successful(result)) throw workerSshProcessError(result.stderr || result.stdout);
			} finally {
				await prepared.dispose();
			}
		})();
		const timeoutError = /* @__PURE__ */ new Error("Worker desktop app launcher timed out after 30 seconds");
		const operation = withTimeout(execution, APP_LAUNCH_TIMEOUT_MS, { createError: () => timeoutError }).catch((error) => {
			if (error === timeoutError) abortController.abort(timeoutError);
			throw error;
		});
		const completeEntry = {
			environmentId: request.environmentId,
			appId: request.app.id,
			ownerEpoch: request.ownerEpoch,
			abortController,
			operation
		};
		appLaunches.set(key, completeEntry);
		startExecution();
		operation.finally(() => {
			if (appLaunches.get(key) === completeEntry) appLaunches.delete(key);
		}).catch(() => void 0);
		return operation;
	}
	async function stop(environmentId, ownerEpoch) {
		await Promise.all([sessions.stop(environmentId, ownerEpoch), stopAppLaunches(environmentId, ownerEpoch)]);
	}
	async function stopAll() {
		for (const entry of appLaunches.values()) entry.abortController.abort(/* @__PURE__ */ new Error("Worker desktop app launcher stopped"));
		await Promise.all([sessions.stopAll(), ...[...appLaunches.values()].map((entry) => entry.operation.catch(() => void 0))]);
	}
	return {
		acquire,
		attachObserver: sessions.attachObserver,
		launchApp,
		stop,
		stopAll
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-accepted-sync.ts
function isIndeterminateWorkspaceCommandResult(result) {
	return result.termination !== "exit" || result.code === 255;
}
function acceptedWorkspaceRollbackError(error, rollbackFailure) {
	const rollbackError = new Error("Accepted workspace publication rollback failed", { cause: error });
	Object.defineProperty(rollbackError, "rollbackFailure", { value: rollbackFailure });
	return rollbackError;
}
async function recoverAcceptedWorkspacePublication(params) {
	const recovered = await params.runWorkspaceCommand({
		transportRetry: "never",
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS,
			"recover",
			params.remoteWorkspaceDir,
			randomBytes(16).toString("hex")
		]
	});
	if (!workerWorkspaceCommandSucceeded(recovered)) throw workspaceSyncError(recovered);
}
function createAcceptedWorkspacePublisher(params) {
	return async (accepted) => {
		const acceptedRaw = serializeWorkerWorkspaceManifest(accepted.manifest);
		const acceptedDigest = createHash("sha256").update(acceptedRaw).digest("hex");
		if (`sha256:${acceptedDigest}` !== accepted.manifestRef) throw new Error("Accepted workspace manifest does not match its reference");
		const published = await params.runWorkspaceCommand({
			transportRetry: "idempotent",
			argv: [
				"node",
				"-e",
				REMOTE_WORKSPACE_MANIFEST_JS,
				params.remoteWorkspaceDir,
				"",
				"publish",
				acceptedDigest
			],
			input: acceptedRaw
		});
		if (!workerWorkspaceCommandSucceeded(published)) throw workspaceSyncError(published);
		const verifyAcceptedWorkspace = async () => {
			const verifiedRef = await captureRemoteWorkspaceManifest({
				runWorkspaceCommand: params.runWorkspaceCommand,
				remoteWorkspaceDir: params.remoteWorkspaceDir,
				baseCommit: accepted.manifest.baseCommit,
				priorManifestDigests: accepted.manifest.baseCommit ? [acceptedDigest] : [],
				hashMemo: params.hashMemo,
				metrics: params.metrics
			});
			if (verifiedRef !== accepted.manifestRef) throw new Error(`Worker workspace does not match its accepted manifest: expected ${accepted.manifestRef}, got ${verifiedRef}`);
		};
		const changed = changedPaths(params.remoteManifest, accepted.manifest);
		if (changed.size === 0) {
			await verifyAcceptedWorkspace();
			return;
		}
		const transactionNonce = randomBytes(16).toString("hex");
		const transactionCommand = async (action) => await params.runWorkspaceCommand({
			transportRetry: "never",
			argv: [
				"node",
				"-e",
				REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS,
				action,
				params.remoteWorkspaceDir,
				transactionNonce
			]
		});
		const settleIndeterminatePublication = async (operation, publicationFailure) => {
			let settled;
			try {
				settled = await transactionCommand("settle");
			} catch (observationFailure) {
				throw new AcceptedWorkspacePublicationIndeterminateError(operation, publicationFailure, observationFailure);
			}
			if (!workerWorkspaceCommandSucceeded(settled)) throw new AcceptedWorkspacePublicationIndeterminateError(operation, publicationFailure, workspaceSyncError(settled));
			try {
				return parseAcceptedWorkspaceSettlement(settled.stdout);
			} catch (observationFailure) {
				throw new AcceptedWorkspacePublicationIndeterminateError(operation, publicationFailure, observationFailure);
			}
		};
		const finishIndeterminateCommit = async (commitFailure) => {
			const outcome = await settleIndeterminatePublication("commit", commitFailure);
			if (outcome === "committed") return;
			if (outcome !== "applied") throw commitFailure;
			let retried;
			try {
				retried = await transactionCommand("commit");
			} catch (observationFailure) {
				throw new AcceptedWorkspacePublicationIndeterminateError("commit", commitFailure, observationFailure);
			}
			if (!workerWorkspaceCommandSucceeded(retried)) {
				const retryFailure = workspaceSyncError(retried);
				if (!isIndeterminateWorkspaceCommandResult(retried)) throw retryFailure;
				throw new AcceptedWorkspacePublicationIndeterminateError("commit", commitFailure, retryFailure);
			}
		};
		let transactionBegun = false;
		try {
			const begun = await params.runWorkspaceCommand({
				transportRetry: "never",
				argv: [
					"node",
					"-e",
					REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS,
					"begin",
					params.remoteWorkspaceDir,
					transactionNonce
				],
				input: JSON.stringify([...changed])
			});
			if (!workerWorkspaceCommandSucceeded(begun)) throw workspaceSyncError(begun);
			transactionBegun = true;
			const remoteStagingRoot = begun.stdout.trim();
			if (!path.posix.isAbsolute(remoteStagingRoot) || remoteStagingRoot.includes("\n")) throw new Error("Worker returned an invalid accepted workspace staging path");
			const acceptedNodes = manifestNodes(accepted.manifest);
			const transferPaths = [...changed].filter((entryPath) => acceptedNodes.has(entryPath));
			if (transferPaths.length > 0) {
				const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-worker-workspace-accepted-"));
				const transferListPath = path.join(temporaryDirectory, "transfer-list");
				try {
					await fs.writeFile(transferListPath, Buffer.from(`${transferPaths.toSorted().join("\0")}\0`), { mode: 384 });
					const localSource = params.localPath.endsWith(path.sep) ? params.localPath : `${params.localPath}${path.sep}`;
					const transferred = await params.runRsync((rsyncSsh) => [
						"rsync",
						"--archive",
						"--checksum",
						"--no-recursive",
						"--from0",
						`--files-from=${transferListPath}`,
						`--rsync-path=${workerAcceptedWorkspaceRsyncReceiverPath({
							receiverEntryPath: params.receiverEntryPath,
							remoteWorkspaceDir: params.remoteWorkspaceDir,
							nonce: transactionNonce
						})}`,
						"-e",
						rsyncSsh,
						"--",
						localSource,
						`${params.scpTarget}:${WORKER_WORKSPACE_RSYNC_DESTINATION}`
					]);
					if (!workerWorkspaceCommandSucceeded(transferred)) throw workspaceSyncError(transferred);
				} finally {
					await fs.rm(temporaryDirectory, {
						recursive: true,
						force: true
					});
				}
			}
			let applied;
			try {
				applied = await transactionCommand("apply");
			} catch (applyFailure) {
				const outcome = await settleIndeterminatePublication("apply", applyFailure);
				if (outcome !== "applied" && outcome !== "committed") throw applyFailure;
			}
			if (applied && !workerWorkspaceCommandSucceeded(applied)) {
				const applyFailure = workspaceSyncError(applied);
				if (!isIndeterminateWorkspaceCommandResult(applied)) throw applyFailure;
				const outcome = await settleIndeterminatePublication("apply", applyFailure);
				if (outcome !== "applied" && outcome !== "committed") throw applyFailure;
			}
			await verifyAcceptedWorkspace();
			let committed;
			try {
				committed = await transactionCommand("commit");
			} catch (commitFailure) {
				await finishIndeterminateCommit(commitFailure);
				return;
			}
			if (!workerWorkspaceCommandSucceeded(committed)) {
				const commitFailure = workspaceSyncError(committed);
				if (isIndeterminateWorkspaceCommandResult(committed)) {
					await finishIndeterminateCommit(commitFailure);
					return;
				}
				throw commitFailure;
			}
		} catch (error) {
			if (isAcceptedWorkspacePublicationIndeterminateError(error)) throw error;
			if (transactionBegun) try {
				const rolledBack = await transactionCommand("rollback");
				if (!workerWorkspaceCommandSucceeded(rolledBack)) throw workspaceSyncError(rolledBack);
			} catch (rollbackFailure) {
				throw acceptedWorkspaceRollbackError(error, rollbackFailure);
			}
			throw error;
		}
	};
}
function createAcceptedWorkspacePublisherFactory(params) {
	return (remoteManifest, initialRemoteRef) => {
		let expectedRemoteRef = initialRemoteRef;
		const publish = createAcceptedWorkspacePublisher({
			...params,
			remoteManifest
		});
		return {
			expectedRemoteRef: () => expectedRemoteRef,
			publishAcceptedManifest: async (accepted) => {
				await publish(accepted);
				expectedRemoteRef = accepted.manifestRef;
			}
		};
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-sync-transport.ts
/** Runs fresh workspace transfers through the lifecycle's advertised SSH candidates. */
function createWorkerWorkspaceRsyncTransport(options) {
	const runRsync = async (prepared, argv) => await runWorkerSshCandidates(prepared, options.timeoutMs, async (port, remainingTimeoutMs) => await options.runTask(argv(workerWorkspaceRsyncRemoteCommand(prepared, port)), workerSshCommandOptions({
		timeoutMs: remainingTimeoutMs,
		signal: options.ownerSignal
	})));
	const runBoundedInboundRsync$1 = async (params) => await runWorkerSshCandidates(params.prepared, options.timeoutMs, async (port, remainingTimeoutMs) => await runBoundedInboundRsync({
		argv: params.argv(workerWorkspaceRsyncRemoteCommand(params.prepared, port)),
		destinationRoot: params.destinationRoot,
		entryLimit: params.entryLimit,
		totalByteLimit: params.totalByteLimit,
		ownerSignal: options.ownerSignal,
		runTask: options.runTask,
		timeoutMs: remainingTimeoutMs
	}));
	return {
		runBoundedInboundRsync: runBoundedInboundRsync$1,
		runRsync
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-sync.ts
const REMOTE_SETUP_TIMEOUT_MS$1 = 2e4;
const WORKSPACE_TIMEOUT_MS = 10 * 6e4;
const REMOTE_WORKSPACE_ROOT = ".openclaw-worker/workspaces";
const REMOTE_GIT_PACK_NAME = ".openclaw-base.pack";
const GIT_COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
const INBOUND_RSYNC_BW_LIMIT_KIB = 65536;
const workspaceSyncLog = createSubsystemLogger("gateway/worker-workspace");
/** Binds workspace commands and synchronization to one connected tunnel owner. */
function createWorkerWorkspaceActions(options) {
	const track = (task) => {
		options.tasks.add(task);
		task.then(() => options.tasks.delete(task), () => options.tasks.delete(task));
		return task;
	};
	const requirePrepared = () => {
		const prepared = options.getPrepared();
		if (!options.isConnected() || !prepared) throw new WorkerTunnelOwnerDisconnectedError();
		return prepared;
	};
	const runTask = (argv, opts) => track(options.runner.run(argv, opts));
	const { runBoundedInboundRsync, runRsync } = createWorkerWorkspaceRsyncTransport({
		ownerSignal: options.ownerSignal,
		runTask,
		timeoutMs: WORKSPACE_TIMEOUT_MS
	});
	const receiverEntryPath = workerWorkspaceRsyncReceiverEntryPath(options.bundleHash);
	const runWorkspaceCommand = async (command) => {
		const prepared = requirePrepared();
		const timeoutMs = command.timeoutMs ?? WORKSPACE_TIMEOUT_MS;
		const signal = command.signal ? AbortSignal.any([options.ownerSignal, command.signal]) : options.ownerSignal;
		const commandOptions = (remainingTimeoutMs) => {
			const base = workerSshCommandOptions({
				input: command.input,
				timeoutMs: remainingTimeoutMs,
				signal
			});
			return command.argv.at(-1) === "memo-v1" ? {
				...base,
				maxOutputBytes: MAX_WORKSPACE_HASH_MEMO_BYTES
			} : base;
		};
		if (command.transportRetry === "never") {
			const operation = runTask(workerWorkspaceSshArgv(prepared, command.argv), commandOptions(timeoutMs));
			command.onDispatchReady?.();
			return await operation;
		}
		return await runWorkerSshCandidates(prepared, timeoutMs, async (port, remainingTimeoutMs) => await runTask(workerWorkspaceSshArgv(prepared, command.argv, port), commandOptions(remainingTimeoutMs)));
	};
	const quiesceWorkspace = createWorkerWorkspaceQuiescence({
		ownerSignal: options.ownerSignal,
		sharedHost: options.sharedHost === true,
		runWorkspaceCommand
	});
	const syncWorkspaceImpl = async (request) => {
		validateWorkspaceSyncRequest(request);
		const prepared = requirePrepared();
		const remoteRelative = [
			REMOTE_WORKSPACE_ROOT,
			stableWorkerPathComponent(options.environmentId, 16),
			stableWorkerPathComponent(request.sessionId, 32),
			String(request.generation)
		].join("/");
		const setup = await runWorkspaceCommand({
			transportRetry: "never",
			argv: [
				"sh",
				"-s",
				"--",
				remoteRelative
			],
			input: REMOTE_WORKSPACE_SETUP_SCRIPT
		});
		if (!workerWorkspaceCommandSucceeded(setup)) throw workspaceSyncError(setup);
		const { canonicalHome, remoteWorkspaceDir } = parseRemoteWorkspaceSetup(setup.stdout.trim(), remoteRelative);
		const { mode, gitRoot, baseCommit } = await probeWorkspaceGitMode({
			localPath: request.localPath,
			commandOptions: workerSshCommandOptions({
				timeoutMs: REMOTE_SETUP_TIMEOUT_MS$1,
				signal: options.ownerSignal
			}),
			runTask
		});
		const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-worker-workspace-sync-"));
		try {
			const mutationReceiverPath = createWorkerWorkspaceRsyncReceiverPathFactory({
				receiverEntryPath,
				remoteWorkspaceDir,
				canonicalHome,
				remoteRelative
			});
			let gitTransferListPath;
			if (mode === "git") {
				const [canonicalRequestPath, canonicalGitRoot] = await Promise.all([fs.realpath(request.localPath), fs.realpath(gitRoot)]);
				if (canonicalRequestPath !== canonicalGitRoot) throw new Error("Worker git workspace sync requires the managed worktree root");
				if (!GIT_COMMIT_PATTERN.test(baseCommit)) throw new Error("Worker workspace git base is not a commit id");
				gitTransferListPath = await createGitTransferList({
					gitRoot,
					temporaryDirectory: path.join(temporaryDirectory, "transfer"),
					signal: options.ownerSignal,
					timeoutMs: WORKSPACE_TIMEOUT_MS
				});
				const objectListPath = path.join(temporaryDirectory, "base-objects");
				const packPath = path.join(temporaryDirectory, "base.pack");
				await runLocalCommandToFile({
					argv: [
						"git",
						"-C",
						gitRoot,
						"rev-list",
						"--objects",
						"--no-object-names",
						`${baseCommit}^{tree}`
					],
					outputPath: objectListPath,
					signal: options.ownerSignal,
					timeoutMs: WORKSPACE_TIMEOUT_MS
				});
				await fs.appendFile(objectListPath, `${baseCommit}\n`);
				await runLocalCommandToFile({
					argv: [
						"git",
						"-C",
						gitRoot,
						"pack-objects",
						"--stdout"
					],
					inputPath: objectListPath,
					outputPath: packPath,
					signal: options.ownerSignal,
					timeoutMs: WORKSPACE_TIMEOUT_MS
				});
				const packTransfer = await runRsync(prepared, (rsyncSsh) => [
					"rsync",
					"--archive",
					"--checksum",
					`--rsync-path=${mutationReceiverPath("git-pack")}`,
					"-e",
					rsyncSsh,
					"--",
					packPath,
					`${prepared.scpTarget}:${WORKER_WORKSPACE_RSYNC_DESTINATION}`
				]);
				if (!workerWorkspaceCommandSucceeded(packTransfer)) throw workspaceSyncError(packTransfer);
				const [authorName, authorEmail] = await Promise.all(["user.name", "user.email"].map(async (key) => {
					const result = await runTask([
						"git",
						"-C",
						gitRoot,
						"config",
						"--get",
						key
					], workerSshCommandOptions({
						timeoutMs: REMOTE_SETUP_TIMEOUT_MS$1,
						signal: options.ownerSignal
					}));
					return workerWorkspaceCommandSucceeded(result) ? result.stdout.trim() : "";
				}));
				const seeded = await runWorkspaceCommand({
					transportRetry: "never",
					argv: [
						"sh",
						"-s",
						"--",
						remoteWorkspaceDir,
						path.posix.join(remoteWorkspaceDir, REMOTE_GIT_PACK_NAME),
						baseCommit,
						authorName ?? "",
						authorEmail ?? ""
					],
					input: REMOTE_GIT_WORKSPACE_SETUP_SCRIPT
				});
				if (!workerWorkspaceCommandSucceeded(seeded)) throw workspaceSyncError(seeded);
			}
			const localSource = gitRoot.endsWith(path.sep) ? gitRoot : `${gitRoot}${path.sep}`;
			const transferArgv = (rsyncSsh, fileListPath) => [
				"rsync",
				"--archive",
				"--checksum",
				"--delete-delay",
				"--exclude=.git",
				...DERIVED_WORKSPACE_RSYNC_EXCLUDES.map((pattern) => `--exclude=${pattern}`),
				...fileListPath ? [
					"--recursive",
					"--from0",
					`--files-from=${fileListPath}`
				] : [],
				`--rsync-path=${mutationReceiverPath("workspace-root")}`,
				"-e",
				rsyncSsh,
				"--",
				localSource,
				`${prepared.scpTarget}:${WORKER_WORKSPACE_RSYNC_DESTINATION}`
			];
			let retryingGitTransfer = false;
			let transferAttempt = 0;
			const preparedGitTransferListPath = gitTransferListPath;
			const transfer = preparedGitTransferListPath ? await runWorkerSshCandidates(prepared, WORKSPACE_TIMEOUT_MS, async (port, remainingTimeoutMs) => {
				const deadlineMs = Date.now() + remainingTimeoutMs;
				const commandOptions = () => workerSshCommandOptions({
					timeoutMs: Math.max(0, deadlineMs - Date.now()),
					signal: options.ownerSignal
				});
				if (retryingGitTransfer) {
					const resetNonce = randomBytes(16).toString("hex");
					const reset = await runTask(workerWorkspaceSshArgv(prepared, [
						"node",
						"-e",
						REMOTE_GIT_WORKSPACE_RETRY_RESET_JS,
						remoteWorkspaceDir,
						canonicalHome,
						remoteRelative,
						resetNonce
					], port), commandOptions());
					if (!workerWorkspaceCommandSucceeded(reset)) throw workspaceSyncError(reset);
					if (reset.stdout !== `reset ${resetNonce}\n`) throw new Error("Worker workspace retry reset returned an invalid acknowledgement");
				}
				const fileListPath = await filterExistingGitTransferList({
					gitRoot,
					preparedListPath: preparedGitTransferListPath,
					outputPath: path.join(path.dirname(preparedGitTransferListPath), `attempt-${transferAttempt++}`)
				});
				const result = await runTask(transferArgv(workerWorkspaceRsyncRemoteCommand(prepared, port), fileListPath), commandOptions());
				retryingGitTransfer = result.termination === "exit" && result.code === 255;
				return result;
			}) : await runRsync(prepared, (rsyncSsh) => transferArgv(rsyncSsh));
			if (!workerWorkspaceCommandSucceeded(transfer)) throw workspaceSyncError(transfer);
			const manifest = await runWorkspaceCommand({
				transportRetry: "idempotent",
				argv: [
					"node",
					"-e",
					REMOTE_WORKSPACE_MANIFEST_JS,
					remoteWorkspaceDir,
					baseCommit,
					...mode === "git" ? ["eligible"] : []
				]
			});
			if (!workerWorkspaceCommandSucceeded(manifest)) throw workspaceSyncError(manifest);
			return {
				mode,
				remoteWorkspaceDir,
				manifestRef: parseManifestRef(manifest.stdout.trim())
			};
		} finally {
			await fs.rm(temporaryDirectory, {
				recursive: true,
				force: true
			});
		}
	};
	const reconcileWorkspaceRun = async (request, metrics) => {
		if (!path.isAbsolute(request.localPath) || !path.posix.isAbsolute(request.remoteWorkspaceDir)) throw new Error("Worker workspace reconcile paths must be absolute");
		const pending = request.journal.load();
		if (pending) {
			await recoverWorkerWorkspaceReconciliation({
				root: request.localPath,
				journal: pending
			});
			request.journal.abort();
		}
		const hashMemo = /* @__PURE__ */ new Map();
		const runLocalReconciliation = (operation) => measureLocalWorkspaceReconciliation(metrics, () => withWorkspaceHashMemo(hashMemo, operation, metrics.gateway));
		const baseDigest = await resolveRemoteWorkspaceManifest(runWorkspaceCommand, request.remoteWorkspaceDir, request.baseManifestRef);
		const prepared = requirePrepared();
		const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-worker-workspace-reconcile-"));
		const stagingRoot = path.join(temporaryDirectory, "staging");
		const manifestRoot = path.join(temporaryDirectory, "manifests");
		const baseManifestPath = path.join(manifestRoot, `${baseDigest}.json`);
		const transferListPath = path.join(temporaryDirectory, "transfer-list");
		const acceptedWorkspacePublisher = createAcceptedWorkspacePublisherFactory({
			runWorkspaceCommand,
			runRsync: async (argv) => await runRsync(prepared, argv),
			scpTarget: prepared.scpTarget,
			receiverEntryPath,
			localPath: request.localPath,
			remoteWorkspaceDir: request.remoteWorkspaceDir,
			hashMemo,
			metrics
		});
		try {
			await fs.mkdir(stagingRoot, { mode: 448 });
			await fs.mkdir(manifestRoot, { mode: 448 });
			const baseManifestTransfer = await runBoundedInboundRsync({
				prepared,
				argv: (rsyncSsh) => [
					"rsync",
					"--archive",
					"--no-recursive",
					"--checksum",
					`--max-size=${MAX_WORKSPACE_MANIFEST_BYTES}`,
					`--bwlimit=${INBOUND_RSYNC_BW_LIMIT_KIB}`,
					"-e",
					rsyncSsh,
					"--",
					`${prepared.scpTarget}:.openclaw-worker/manifests/${baseDigest}.json`,
					baseManifestPath
				],
				destinationRoot: manifestRoot,
				entryLimit: 1,
				totalByteLimit: MAX_WORKSPACE_MANIFEST_BYTES
			});
			if (!workerWorkspaceCommandSucceeded(baseManifestTransfer)) throw workspaceSyncError(baseManifestTransfer);
			const baseRaw = await readTransferredManifest(baseManifestPath);
			const base = parseWorkerWorkspaceManifest(baseRaw, request.baseManifestRef);
			await fs.rm(baseManifestPath);
			await recoverAcceptedWorkspacePublication({
				runWorkspaceCommand,
				remoteWorkspaceDir: request.remoteWorkspaceDir
			});
			const verifyStable = async (expectedRef) => {
				const expectedDigest = expectedRef.slice(7);
				if (await captureRemoteWorkspaceManifest({
					runWorkspaceCommand,
					remoteWorkspaceDir: request.remoteWorkspaceDir,
					baseCommit: base.baseCommit,
					priorManifestDigests: base.baseCommit ? [expectedDigest, baseDigest] : [],
					hashMemo,
					metrics
				}) !== expectedRef) throw new Error("Cloud workspace changed during final reconciliation");
			};
			const currentRef = await captureRemoteWorkspaceManifest({
				runWorkspaceCommand,
				remoteWorkspaceDir: request.remoteWorkspaceDir,
				baseCommit: base.baseCommit,
				priorManifestDigests: base.baseCommit ? [baseDigest] : [],
				hashMemo,
				metrics
			});
			const changed = currentRef !== request.baseManifestRef;
			let current = base;
			let currentRaw = baseRaw;
			if (changed) {
				const currentDigest = currentRef.slice(7);
				const currentManifestPath = path.join(manifestRoot, `${currentDigest}.json`);
				const currentManifestTransfer = await runBoundedInboundRsync({
					prepared,
					argv: (rsyncSsh) => [
						"rsync",
						"--archive",
						"--no-recursive",
						"--checksum",
						`--max-size=${MAX_WORKSPACE_MANIFEST_BYTES}`,
						`--bwlimit=${INBOUND_RSYNC_BW_LIMIT_KIB}`,
						"-e",
						rsyncSsh,
						"--",
						`${prepared.scpTarget}:.openclaw-worker/manifests/${currentDigest}.json`,
						currentManifestPath
					],
					destinationRoot: manifestRoot,
					entryLimit: 1,
					totalByteLimit: MAX_WORKSPACE_MANIFEST_BYTES
				});
				if (!workerWorkspaceCommandSucceeded(currentManifestTransfer)) throw workspaceSyncError(currentManifestTransfer);
				currentRaw = await readTransferredManifest(currentManifestPath);
				current = parseWorkerWorkspaceManifest(currentRaw, currentRef);
			}
			const { expectedRemoteRef, publishAcceptedManifest } = acceptedWorkspacePublisher(current, currentRef);
			if (changed) {
				const transferPaths = workerWorkspaceTransferPaths(current, base);
				const transferPathSet = new Set(transferPaths);
				if (transferPaths.length > 0) {
					await fs.writeFile(transferListPath, Buffer.from(`${transferPaths.join("\0")}\0`), { mode: 384 });
					const resultTransfer = await runBoundedInboundRsync({
						prepared,
						argv: (rsyncSsh) => [
							"rsync",
							"--archive",
							"--checksum",
							`--max-size=${MAX_RECONCILIATION_FILE_BYTES}`,
							`--bwlimit=${INBOUND_RSYNC_BW_LIMIT_KIB}`,
							"--from0",
							`--files-from=${transferListPath}`,
							"-e",
							rsyncSsh,
							"--",
							`${prepared.scpTarget}:${request.remoteWorkspaceDir}/`,
							`${stagingRoot}/`
						],
						destinationRoot: stagingRoot,
						entryLimit: MAX_RECONCILIATION_ENTRIES * 2,
						totalByteLimit: MAX_RECONCILIATION_TOTAL_BYTES
					});
					if (!workerWorkspaceCommandSucceeded(resultTransfer)) throw workspaceSyncError(resultTransfer);
				}
				await assertWorkspaceMatchesManifest({
					root: stagingRoot,
					manifest: current,
					entries: current.entries.filter((entry) => transferPathSet.has(entry.path))
				});
			}
			await verifyStable(currentRef);
			const preparedStagedResult = request.stagedResult ? await runLocalReconciliation(async () => await workerWorkspaceResultStaging.prepareRequestedWorkerWorkspaceResult({
				request,
				stagingRoot,
				currentManifestRef: currentRef,
				baseManifestRaw: baseRaw,
				currentManifestRaw: currentRaw,
				publishAcceptedManifest
			})) : void 0;
			const stagedResult = preparedStagedResult ? {
				...preparedStagedResult,
				applyPreparedStagedResult: async () => await runLocalReconciliation(async () => await preparedStagedResult.applyPreparedStagedResult()),
				verifyLocalStable: async () => await runLocalReconciliation(async () => await preparedStagedResult.verifyLocalStable())
			} : void 0;
			let appliedWorkspaceResult;
			if (!stagedResult) appliedWorkspaceResult = await runLocalReconciliation(async () => await applyStagedWorkerWorkspace({
				root: request.localPath,
				stagingRoot,
				baseManifestRef: request.baseManifestRef,
				currentManifestRef: currentRef,
				base,
				current,
				journal: request.journal,
				publishAcceptedManifest
			}));
			return {
				get manifestRef() {
					return expectedRemoteRef();
				},
				changed,
				verifyStable: async () => await verifyStable(expectedRemoteRef()),
				verifyLocalStable: async () => await runLocalReconciliation(async () => await (appliedWorkspaceResult?.verifyLocalStable() ?? assertWorkspaceResultStable({
					root: request.localPath,
					base,
					current
				}))),
				getAppliedWorkspaceResult: () => appliedWorkspaceResult,
				...stagedResult
			};
		} finally {
			await fs.rm(temporaryDirectory, {
				recursive: true,
				force: true
			}).catch(() => void 0);
		}
	};
	const reconcileWorkspaceImpl = async (request) => {
		const metrics = createWorkspaceReconcileMetrics();
		const startedAt = performance.now();
		const report = (outcome) => {
			workspaceSyncLog.debug("worker workspace reconcile completed", {
				outcome,
				durationMs: performance.now() - startedAt,
				...metrics
			});
		};
		try {
			const reconciliation = await reconcileWorkspaceRun(request, metrics);
			registerWorkspaceReconcileReporter(reconciliation, report);
			return reconciliation;
		} catch (error) {
			report("failed");
			throw error;
		}
	};
	return {
		quiesceWorkspace,
		reconcileWorkspace: (request) => track(reconcileWorkspaceImpl(request)),
		runWorkspaceCommand,
		syncWorkspace: (request) => track(syncWorkspaceImpl(request))
	};
}
//#endregion
//#region src/gateway/worker-environments/tunnel.ts
const REMOTE_SOCKET_NAME = "gateway.sock";
const REMOTE_SETUP_TIMEOUT_MS = 2e4;
const TUNNEL_READY_TIMEOUT_MS = 6e4;
const DEFAULT_STABLE_CONNECTION_MS = 3e4;
const DEFAULT_BACKOFF = {
	initialMs: 250,
	maxMs: 3e4,
	factor: 2,
	jitter: 0
};
const tunnelLog = createSubsystemLogger("gateway/worker-tunnel");
const REMOTE_SOCKET_SETUP_SCRIPT = String.raw`set -eu
directory=$1
socket=$2
umask 077
if [ -e "$directory" ] || [ -L "$directory" ]; then
  if [ ! -d "$directory" ] || [ -L "$directory" ]; then
    printf '%s\n' 'unsafe worker tunnel directory' >&2
    exit 2
  fi
else
  mkdir -- "$directory"
fi
chmod 700 "$directory"  # no "--": BSD/macOS chmod treats it as a filename; path is script-owned and absolute
rm -f -- "$socket"
`;
const REMOTE_TUNNEL_READY_SCRIPT = String.raw`set -eu
socket=$1
test -S "$socket"
printf '%s\n' '${WORKER_TUNNEL_READY_MARKER}'
trap 'exit 0' HUP INT TERM
while :; do sleep 3600; done
`;
const REMOTE_SOCKET_CLEANUP_SCRIPT = String.raw`set -eu
socket=$1
directory=$2
rm -f -- "$socket"
rmdir -- "$directory" 2>/dev/null || true
`;
const WORKER_LAUNCH_SCRIPT = "exec node \"$HOME/.openclaw-worker/$1/openclaw.mjs\" worker";
function success(result) {
	return result.termination === "exit" && result.code === 0;
}
function validateStartRequest(request) {
	if (!request.environmentId.trim()) throw new Error("Worker tunnel environment id must be non-empty");
	if (!Number.isSafeInteger(request.ownerEpoch) || request.ownerEpoch < 0) throw new Error("Worker tunnel owner epoch must be a non-negative safe integer");
	if (!Number.isInteger(request.gateway.port) || request.gateway.port < 1 || request.gateway.port > 65535) throw new Error("Worker tunnel gateway port must be an integer between 1 and 65535");
}
function remoteTargetHost(host) {
	return host === "::1" ? `[${host}]` : host;
}
/** Owns process-local reverse tunnels and fences all delayed work on stop or owner replacement. */
function createWorkerTunnelManager(options = {}) {
	const runner = options.runner ?? createWorkerSshRunner();
	const sleep = options.sleep ?? sleepWithAbort;
	const backoff = options.backoff ?? DEFAULT_BACKOFF;
	const now = options.now ?? Date.now;
	const stableConnectionMs = options.stableConnectionMs ?? DEFAULT_STABLE_CONNECTION_MS;
	const desktop = createWorkerDesktopTunnels({
		runner,
		...options.desktopSessionRegistry ? { registry: options.desktopSessionRegistry } : {}
	});
	const entries = /* @__PURE__ */ new Map();
	const claimedOwnerEpochs = /* @__PURE__ */ new Map();
	const isCurrent = (entry) => entries.get(entry.environmentId) === entry && !entry.abortController.signal.aborted;
	const sshCommand = (prepared, params) => ({
		argv: [
			"ssh",
			...workerSshOptions(prepared, { forwarding: "disabled" }),
			"-a",
			"-x",
			"-T",
			"-p",
			String(params.port),
			"--",
			prepared.sshTarget,
			workerSshRemoteCommand([
				"sh",
				"-s",
				"--",
				...params.remoteArgs
			])
		],
		options: workerSshCommandOptions({
			input: params.input,
			timeoutMs: params.timeoutMs,
			signal: params.signal
		})
	});
	const prepareRemoteSocket = async (entry) => {
		const prepared = entry.prepared;
		if (!prepared) throw new Error("Worker tunnel SSH context is unavailable");
		const result = await runWorkerSshCandidates(prepared, REMOTE_SETUP_TIMEOUT_MS, async (port, remainingTimeoutMs) => {
			const command = sshCommand(prepared, {
				input: REMOTE_SOCKET_SETUP_SCRIPT,
				port,
				remoteArgs: [entry.remoteDirectory, entry.remoteSocketPath],
				timeoutMs: remainingTimeoutMs,
				signal: entry.abortController.signal
			});
			return await runner.run(command.argv, command.options);
		});
		if (!success(result)) throw workerSshProcessError(result.stderr || result.stdout);
	};
	const cleanupRemoteSocket = async (entry) => {
		const prepared = entry.prepared;
		if (!prepared) return;
		await runWorkerSshCandidates(prepared, REMOTE_SETUP_TIMEOUT_MS, async (port, remainingTimeoutMs) => {
			const command = sshCommand(prepared, {
				input: REMOTE_SOCKET_CLEANUP_SCRIPT,
				port,
				remoteArgs: [entry.remoteSocketPath, entry.remoteDirectory],
				timeoutMs: remainingTimeoutMs
			});
			return await runner.run(command.argv, command.options);
		}).catch(() => void 0);
	};
	const createHandle = (entry) => {
		const workspace = createWorkerWorkspaceActions({
			environmentId: entry.environmentId,
			sharedHost: entry.sharedHost,
			ownerSignal: entry.abortController.signal,
			isConnected: () => isCurrent(entry) && entry.status === "connected",
			getPrepared: () => entry.prepared,
			runner,
			tasks: entry.workspaceTasks,
			bundleHash: entry.bundleHash
		});
		return {
			environmentId: entry.environmentId,
			ownerEpoch: entry.ownerEpoch,
			launchTurn: (request) => workspace.runWorkspaceCommand({
				transportRetry: "never",
				argv: [
					"sh",
					"-c",
					WORKER_LAUNCH_SCRIPT,
					"openclaw-worker",
					entry.bundleHash
				],
				input: JSON.stringify(completeWorkerLaunchDescriptor(request.plan, {
					kind: "unix",
					socketPath: entry.remoteSocketPath
				})),
				timeoutMs: request.timeoutMs,
				signal: request.signal,
				onDispatchReady: request.onDispatchReady
			}),
			...workspace,
			stop: () => stop(entry.environmentId, entry.ownerEpoch)
		};
	};
	const connect = async (entry) => {
		const prepared = entry.prepared;
		if (!prepared) throw new Error("Worker tunnel SSH context is unavailable");
		await prepareRemoteSocket(entry);
		if (!isCurrent(entry)) throw new Error("Worker tunnel owner changed during connection");
		const target = `${remoteTargetHost(entry.gateway.host)}:${entry.gateway.port}`;
		const port = prepared.port;
		return {
			port,
			process: runner.start([
				"ssh",
				...workerSshOptions(prepared, { forwarding: "explicit" }),
				"-a",
				"-x",
				"-T",
				"-o",
				"ServerAliveInterval=15",
				"-o",
				"ServerAliveCountMax=3",
				"-o",
				"StreamLocalBindMask=0177",
				"-o",
				"StreamLocalBindUnlink=yes",
				"-R",
				`${entry.remoteSocketPath}:${target}`,
				"-p",
				String(port),
				"--",
				prepared.sshTarget,
				workerSshRemoteCommand([
					"sh",
					"-s",
					"--",
					entry.remoteSocketPath
				])
			], workerSshCommandOptions({
				input: REMOTE_TUNNEL_READY_SCRIPT,
				timeoutMs: Number.MAX_SAFE_INTEGER,
				signal: entry.abortController.signal
			}))
		};
	};
	const reconnectLoop = async (entry) => {
		const reconnectSupervisor = new RetrySupervisor(backoff);
		while (isCurrent(entry)) {
			entry.status = reconnectSupervisor.attempts === 0 ? "connecting" : "reconnecting";
			let child;
			let childPort;
			try {
				const connection = await connect(entry);
				child = connection.process;
				childPort = connection.port;
				entry.process = child;
				await withTimeout(child.ready, TUNNEL_READY_TIMEOUT_MS, { message: "Worker tunnel did not become ready within 60 seconds" });
				if (!isCurrent(entry)) {
					await child.stop();
					return;
				}
				entry.status = "connected";
				const connectionReadiness = entry.readiness;
				connectionReadiness.resolve(createHandle(entry));
				const connectedAtMs = now();
				const exit = await child.exited.finally(() => {
					if (isCurrent(entry) && entry.readiness === connectionReadiness) {
						entry.status = "reconnecting";
						const readiness = createDeferredCore();
						readiness.promise.catch(() => void 0);
						entry.readiness = readiness;
					}
				});
				if (entry.prepared) advanceWorkerSshAfterTransportExit(entry.prepared, childPort, exit);
				if (now() - connectedAtMs >= stableConnectionMs) reconnectSupervisor.reset();
			} catch (error) {
				if (child && childPort !== void 0) {
					let stopError;
					let stopFailed = false;
					const stopping = child.stop().catch((failure) => {
						stopFailed = true;
						stopError = failure;
					});
					let exit = await Promise.race([child.exited.catch(() => void 0), stopping.then(() => void 0)]);
					await stopping;
					if (stopFailed) {
						tunnelLog.warn("worker tunnel stop failed; waiting for SSH child exit", {
							environmentId: entry.environmentId,
							error: boundedWorkerError(stopError),
							connectError: boundedWorkerError(error)
						});
						exit = await child.exited.catch(() => void 0) ?? exit;
					}
					if (exit && entry.prepared) advanceWorkerSshAfterTransportExit(entry.prepared, childPort, exit);
				}
				if (isCurrent(entry)) tunnelLog.warn("worker tunnel connect attempt failed", {
					environmentId: entry.environmentId,
					attempt: reconnectSupervisor.attempts + 1,
					error: boundedWorkerError(error)
				});
			} finally {
				if (entry.process === child) entry.process = void 0;
			}
			if (!isCurrent(entry)) return;
			entry.status = "reconnecting";
			try {
				const retry = reconnectSupervisor.next(entry.abortController.signal);
				await sleep(retry.delayMs, retry.signal);
			} catch {
				return;
			}
		}
	};
	const stopEntry = (entry) => {
		if (entry.stopPromise) return entry.stopPromise;
		entry.stopPromise = (async () => {
			if (entries.get(entry.environmentId) === entry) entries.delete(entry.environmentId);
			entry.abortController.abort(/* @__PURE__ */ new Error("Worker tunnel owner stopped"));
			entry.readiness.reject(/* @__PURE__ */ new Error("Worker tunnel stopped before connecting"));
			await entry.process?.stop().catch(() => void 0);
			await entry.initialization?.catch(() => void 0);
			await entry.process?.stop().catch(() => void 0);
			await Promise.allSettled(entry.workspaceTasks);
			await entry.loop?.catch(() => void 0);
			await cleanupRemoteSocket(entry);
			await entry.prepared?.dispose().catch(() => void 0);
		})();
		return entry.stopPromise;
	};
	async function start(request) {
		validateStartRequest(request);
		const claimedEpoch = claimedOwnerEpochs.get(request.environmentId);
		if (claimedEpoch !== void 0 && request.ownerEpoch < claimedEpoch) throw new Error("Worker tunnel owner epoch is stale");
		claimedOwnerEpochs.set(request.environmentId, request.ownerEpoch);
		const current = entries.get(request.environmentId);
		if (current) {
			if (request.ownerEpoch < current.ownerEpoch) throw new Error("Worker tunnel owner epoch is stale");
			if (request.ownerEpoch === current.ownerEpoch) return await current.readiness.promise;
		}
		const remoteDirectory = `/tmp/ocw-${stableWorkerPathComponent(request.environmentId, 16)}-${request.ownerEpoch}`;
		const readiness = createDeferredCore();
		readiness.promise.catch(() => void 0);
		const entry = {
			environmentId: request.environmentId,
			bundleHash: request.bundleHash,
			ownerEpoch: request.ownerEpoch,
			gateway: request.gateway,
			sharedHost: request.sharedHost === true,
			remoteDirectory,
			remoteSocketPath: `${remoteDirectory}/${REMOTE_SOCKET_NAME}`,
			abortController: new AbortController(),
			status: "connecting",
			loopSettled: false,
			readiness,
			workspaceTasks: /* @__PURE__ */ new Set()
		};
		entries.set(request.environmentId, entry);
		entry.initialization = (async () => {
			if (current) await stopEntry(current);
			if (!isCurrent(entry)) return;
			entry.prepared = await prepareWorkerSsh({
				ssh: request.ssh,
				pinnedHostKey: request.ssh.hostKey,
				resolveIdentity: request.resolveIdentity,
				temporaryDirectoryPrefix: "openclaw-worker-tunnel-"
			});
			if (!isCurrent(entry)) {
				await entry.prepared.dispose();
				entry.prepared = void 0;
				return;
			}
			entry.loop = reconnectLoop(entry).finally(() => {
				entry.loopSettled = true;
			});
			entry.loop.catch((error) => {
				entry.readiness.reject(error instanceof Error ? error : /* @__PURE__ */ new Error("Worker tunnel failed"));
			});
		})();
		entry.initialization.catch((error) => {
			entry.readiness.reject(error instanceof Error ? error : /* @__PURE__ */ new Error("Worker tunnel failed"));
			stopEntry(entry);
		});
		return await entry.readiness.promise;
	}
	async function stop(environmentId, ownerEpoch) {
		const entry = entries.get(environmentId);
		if (entry && (ownerEpoch === void 0 || ownerEpoch === entry.ownerEpoch)) await stopEntry(entry);
		await desktop.stop(environmentId, ownerEpoch);
	}
	async function stopAll() {
		const current = [...entries.values()];
		for (const entry of current) {
			entries.delete(entry.environmentId);
			entry.abortController.abort(/* @__PURE__ */ new Error("Worker tunnel manager stopped"));
		}
		await Promise.all([...current.map(stopEntry), desktop.stopAll()]);
	}
	return {
		desktop,
		start,
		stop,
		stopAll,
		status(environmentId) {
			const entry = entries.get(environmentId);
			return !entry || entry.loopSettled ? "stopped" : entry.status;
		}
	};
}
//#endregion
export { createWorkerTunnelManager };
