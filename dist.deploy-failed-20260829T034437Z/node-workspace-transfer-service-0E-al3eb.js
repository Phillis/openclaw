import { a as isPathInside } from "./path-D138yf8v.js";
import "./fs-safe-CmrQUApq.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { A as MAX_WORKSPACE_MANIFEST_BYTES, _ as parseWorkerWorkspaceManifest, h as MAX_RECONCILIATION_TOTAL_BYTES, k as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES, p as MAX_RECONCILIATION_ENTRIES, r as readWorkspaceFileSnapshotWithLimit, y as serializeWorkerWorkspaceManifest } from "./workspace-actual-manifest-DIThIqhg.js";
import { d as readActualWorkspaceManifest, o as assertWorkspaceMatchesManifest } from "./workspace-reconcile-Ca4yuu6w.js";
import { f as workerWorkspaceTransferPaths } from "./workspace-result-staging-C1c-gG8N.js";
import { o as probeWorkspaceGitMode } from "./workspace-sync-helpers-Ba8iUX3R.js";
import { i as runWorkspaceInventoryCommandToFile, r as readWorkspaceTransferPaths, t as createWorkspaceGitTransferList } from "./workspace-sync-inventory-DG8B5b1N.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/node-workspace-transfer-snapshot.ts
const TRANSFER_TIMEOUT_MS$1 = 10 * 6e4;
async function prepareNodeWorkspaceTransferSnapshot(params) {
	const root = await fs.realpath(params.localPath);
	const git = await probeWorkspaceGitMode({
		localPath: root,
		commandOptions: {
			timeoutMs: TRANSFER_TIMEOUT_MS$1,
			maxOutputBytes: 256 * 1024,
			maxCombinedOutputBytes: 512 * 1024,
			baseEnv: {
				...process.env,
				GIT_TERMINAL_PROMPT: "0",
				GIT_ASKPASS: ""
			},
			signal: params.signal
		},
		runTask: runCommandWithTimeout
	});
	let baseCommit = null;
	let includePaths;
	if (git.mode === "git") {
		if (await fs.realpath(git.gitRoot) !== root) throw new Error("Worker git workspace sync requires the managed worktree root");
		baseCommit = git.baseCommit;
		if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(baseCommit)) throw new Error("Worker workspace Git base is not a commit id");
		const transferable = await readWorkspaceTransferPaths(await createWorkspaceGitTransferList({
			gitRoot: root,
			temporaryDirectory: path.join(params.temporaryRoot, "inventory"),
			signal: params.signal ?? AbortSignal.timeout(TRANSFER_TIMEOUT_MS$1),
			timeoutMs: TRANSFER_TIMEOUT_MS$1
		}));
		const manifestPaths = new Set(transferable);
		for (const relative of transferable) {
			const segments = relative.split("/");
			for (let index = 1; index < segments.length; index += 1) manifestPaths.add(segments.slice(0, index).join("/"));
		}
		includePaths = manifestPaths;
	}
	const actual = await readActualWorkspaceManifest({
		root,
		baseCommit,
		includePaths
	});
	let packPath;
	if (baseCommit) {
		const signal = params.signal ?? AbortSignal.timeout(TRANSFER_TIMEOUT_MS$1);
		const objectListPath = path.join(params.temporaryRoot, "base-objects");
		packPath = path.join(params.temporaryRoot, "base.pack");
		await runWorkspaceInventoryCommandToFile({
			argv: [
				"git",
				"-C",
				root,
				"rev-list",
				"--objects",
				"--no-object-names",
				`${baseCommit}^{tree}`
			],
			outputPath: objectListPath,
			signal,
			timeoutMs: TRANSFER_TIMEOUT_MS$1
		});
		await fs.appendFile(objectListPath, `${baseCommit}\n`);
		await runWorkspaceInventoryCommandToFile({
			argv: [
				"git",
				"-C",
				root,
				"pack-objects",
				"--stdout"
			],
			inputPath: objectListPath,
			outputPath: packPath,
			signal,
			timeoutMs: TRANSFER_TIMEOUT_MS$1,
			maxOutputBytes: MAX_WORKSPACE_INVENTORY_TOTAL_BYTES
		});
	}
	return {
		...actual,
		rawManifest: serializeWorkerWorkspaceManifest(actual.manifest),
		root,
		...packPath ? { packPath } : {}
	};
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-transfer-token.ts
const NODE_WORKSPACE_TRANSFER_TOKEN_BYTES = 32;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
/** Mint one process-local bearer. Its owner stores every authority binding separately. */
function mintNodeWorkspaceTransferToken(generateToken = generateSecureToken) {
	const token = generateToken(NODE_WORKSPACE_TRANSFER_TOKEN_BYTES);
	if (!TOKEN_PATTERN.test(token)) throw new Error("Workspace transfer token generator returned an invalid bearer");
	registerSecretValueForRedaction(token);
	return token;
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-transfer-service.ts
const TRANSFER_TIMEOUT_MS = 10 * 6e4;
const MAX_UPLOAD_BYTES = MAX_WORKSPACE_MANIFEST_BYTES * 2 + MAX_RECONCILIATION_TOTAL_BYTES + MAX_RECONCILIATION_ENTRIES * 8 + 8;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
var NodeWorkspaceTransferLimitError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "workspace-transfer-limit";
	}
};
function isNodeWorkspaceTransferLimitError(error) {
	return error instanceof NodeWorkspaceTransferLimitError;
}
var RequestByteReader = class {
	#iterator;
	#signal;
	#assertCurrent;
	#pending;
	#done;
	constructor(request, signal, assertCurrent) {
		this.#pending = Buffer.alloc(0);
		this.#done = false;
		this.bytesRead = 0;
		this.#iterator = request[Symbol.asyncIterator]();
		this.#signal = signal;
		this.#assertCurrent = assertCurrent;
	}
	async take(maxBytes) {
		this.#signal.throwIfAborted();
		if (this.#pending.length === 0 && !this.#done) {
			const next = await this.#iterator.next();
			this.#assertCurrent();
			this.#signal.throwIfAborted();
			this.#done = Boolean(next.done);
			if (!next.done) this.#pending = Buffer.isBuffer(next.value) ? next.value : Buffer.from(next.value);
		}
		if (this.#pending.length === 0) return Buffer.alloc(0);
		const count = Math.min(maxBytes, this.#pending.length);
		const value = this.#pending.subarray(0, count);
		this.#pending = Buffer.from(this.#pending.subarray(count));
		this.bytesRead += value.byteLength;
		if (this.bytesRead > MAX_UPLOAD_BYTES) throw new NodeWorkspaceTransferLimitError("Workspace transfer upload exceeds its byte limit");
		return value;
	}
	async readExactly(bytes) {
		const chunks = [];
		let remaining = bytes;
		while (remaining > 0) {
			const chunk = await this.take(remaining);
			if (chunk.length === 0) throw new Error("Workspace transfer upload ended before its declared payload");
			chunks.push(chunk);
			remaining -= chunk.length;
		}
		return Buffer.concat(chunks, bytes);
	}
	async assertEnd() {
		if ((await this.take(1)).length !== 0) throw new Error("Workspace transfer upload contains trailing bytes");
	}
};
function contextOwnerValid(context, owner, nowMs) {
	const environment = owner?.environment;
	const credential = owner?.credential;
	return Boolean(!context.abortController.signal.aborted && context.isAuthorized() && environment && credential && environment.state === "attached" && environment.destroyRequestedAtMs === null && environment.ownerEpoch === context.ownerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === context.sessionId && credential.ownerEpoch === context.ownerEpoch && credential.sessionId === context.sessionId && credential.expiresAtMs > nowMs);
}
function capabilityMatchesContext(capability, context) {
	return capability.environmentId === context.environmentId && capability.ownerEpoch === context.ownerEpoch && capability.sessionId === context.sessionId && capability.generation === context.generation;
}
function entryPath(root, relative) {
	const candidate = path.join(root, ...relative.split("/"));
	if (candidate !== root && !isPathInside(root, candidate)) throw new Error("Workspace transfer entry escaped its staging root");
	return candidate;
}
async function streamUploadFile(params) {
	if ((await params.reader.readExactly(8)).readBigUInt64BE() !== BigInt(params.entry.size)) throw new Error("Workspace transfer file size differs from its manifest");
	const hash = createHash("sha256");
	let offset = 0;
	while (offset < params.entry.size) {
		const chunk = await params.reader.take(Math.min(64 * 1024, params.entry.size - offset));
		if (chunk.length === 0) throw new Error("Workspace transfer upload ended mid-file");
		hash.update(chunk);
		let chunkOffset = 0;
		while (chunkOffset < chunk.length) {
			const { bytesWritten } = await params.handle.write(chunk, chunkOffset, chunk.length - chunkOffset, offset + chunkOffset);
			params.assertCurrent();
			if (bytesWritten === 0) throw new Error("Workspace transfer upload write made no progress");
			chunkOffset += bytesWritten;
		}
		offset += chunk.length;
	}
	if (hash.digest("hex") !== params.entry.sha256) throw new Error("Workspace transfer file digest differs from its manifest");
}
function createNodeWorkspaceTransferService(options) {
	const contexts = /* @__PURE__ */ new Map();
	const contextOperations = new KeyedAsyncQueue();
	const now = options.now ?? Date.now;
	const temporaryBaseRoot = options.temporaryRoot ?? path.join(resolveStateDir(), "tmp", "node-workspace-transfer");
	let temporaryRootReady;
	const ensureTemporaryRoot = () => {
		temporaryRootReady ??= (async () => {
			await fs.rm(temporaryBaseRoot, {
				recursive: true,
				force: true
			});
			await fs.mkdir(temporaryBaseRoot, {
				recursive: true,
				mode: 448
			});
		})();
		return temporaryRootReady;
	};
	const currentOwner = (context) => {
		if (contexts.get(context.environmentId) !== context) return;
		const owner = options.getOwner(context.environmentId);
		return contextOwnerValid(context, owner, now()) ? owner : void 0;
	};
	const isCurrentContext = (context) => Boolean(currentOwner(context));
	const closeContext = async (context) => {
		if (!context.abortController.signal.aborted) context.abortController.abort(/* @__PURE__ */ new Error("Node workspace transfer context closed"));
		context.stopWatchingOwnerSignal?.();
		if (contexts.get(context.environmentId) === context) contexts.delete(context.environmentId);
		await fs.rm(context.temporaryRoot, {
			recursive: true,
			force: true
		});
	};
	const closeEnvironment = (environmentId) => contextOperations.enqueue(environmentId, async () => {
		const context = contexts.get(environmentId);
		if (context) await closeContext(context);
	});
	const mintDownload = (context, manifestRef) => {
		const credential = currentOwner(context)?.credential;
		const nowMs = now();
		if (!credential) throw new Error("Node workspace transfer owner is no longer current");
		const expiresAtMs = Math.min(credential.expiresAtMs, nowMs + TRANSFER_TIMEOUT_MS);
		if (expiresAtMs <= nowMs) throw new Error("Worker workspace transfer credential is expired");
		const token = mintNodeWorkspaceTransferToken();
		context.downloads.set(token, {
			direction: "download",
			token,
			environmentId: context.environmentId,
			ownerEpoch: context.ownerEpoch,
			sessionId: context.sessionId,
			generation: context.generation,
			manifestRef,
			expiresAtMs
		});
		return token;
	};
	const pruneSnapshots = (context) => {
		const retained = /* @__PURE__ */ new Set([context.currentManifestRef, ...[...context.downloads.values()].map((download) => download.manifestRef)]);
		for (const manifestRef of context.snapshots.keys()) if (!retained.has(manifestRef)) context.snapshots.delete(manifestRef);
	};
	const authorizationCurrent = (authorization) => {
		const { capability, context } = authorization;
		if (!isCurrentContext(context) || !capabilityMatchesContext(capability, context) || capability.expiresAtMs <= now()) return false;
		return capability.direction === "download" ? context.downloads.get(capability.token) === capability : context.upload === capability && (capability.state === "receiving" || capability.state === "completed");
	};
	const assertAuthorizationCurrent = (authorization) => {
		if (!authorizationCurrent(authorization)) throw new Error("Workspace transfer authority closed");
	};
	const routeMatchesDownload = (context, capability, route) => {
		if (route.direction !== "download" || route.environmentId !== context.environmentId) return false;
		if (route.kind === "manifest" || route.kind === "pack") return route.manifestRef === capability.manifestRef;
		if (route.kind !== "blob") return false;
		return Boolean(context.snapshots.get(capability.manifestRef)?.manifest.entries.some((entry) => entry.type === "file" && entry.sha256 === route.sha256));
	};
	return {
		initialize: ensureTemporaryRoot,
		async prepareSync(params) {
			return await contextOperations.enqueue(params.environmentId, async () => {
				const previous = contexts.get(params.environmentId);
				if (previous) await closeContext(previous);
				await ensureTemporaryRoot();
				const abortController = new AbortController();
				const context = {
					...params,
					localPath: await fs.realpath(params.localPath),
					temporaryRoot: await fs.mkdtemp(path.join(temporaryBaseRoot, "context-")),
					currentManifestRef: "",
					snapshots: /* @__PURE__ */ new Map(),
					downloads: /* @__PURE__ */ new Map(),
					abortController
				};
				if (params.signal) {
					const abortFromOwner = () => abortController.abort(params.signal.reason);
					params.signal.addEventListener("abort", abortFromOwner, { once: true });
					context.stopWatchingOwnerSignal = () => params.signal?.removeEventListener("abort", abortFromOwner);
					if (params.signal.aborted) abortFromOwner();
				}
				try {
					const snapshot = await prepareNodeWorkspaceTransferSnapshot({
						localPath: context.localPath,
						temporaryRoot: context.temporaryRoot,
						signal: AbortSignal.any([context.abortController.signal, AbortSignal.timeout(TRANSFER_TIMEOUT_MS)])
					});
					context.snapshots.set(snapshot.manifestRef, snapshot);
					context.currentManifestRef = snapshot.manifestRef;
					contexts.set(context.environmentId, context);
					return {
						snapshot,
						token: mintDownload(context, snapshot.manifestRef)
					};
				} catch (error) {
					await closeContext(context);
					throw error;
				}
			});
		},
		prepareUpload(environmentId, baseManifestRef) {
			const context = contexts.get(environmentId);
			const credential = context ? currentOwner(context)?.credential : void 0;
			const nowMs = now();
			if (!context || !MANIFEST_REF_PATTERN.test(baseManifestRef) || !credential) throw new Error("Node workspace transfer context is unavailable");
			if (context.upload) throw new Error("Node workspace transfer upload is already active");
			const expiresAtMs = Math.min(credential.expiresAtMs, nowMs + TRANSFER_TIMEOUT_MS);
			if (expiresAtMs <= nowMs) throw new Error("Worker workspace transfer credential is expired");
			const token = mintNodeWorkspaceTransferToken();
			context.upload = {
				direction: "upload",
				token,
				environmentId: context.environmentId,
				ownerEpoch: context.ownerEpoch,
				sessionId: context.sessionId,
				generation: context.generation,
				baseManifestRef,
				expiresAtMs,
				state: "ready"
			};
			return token;
		},
		takeUpload(environmentId, baseManifestRef) {
			const context = contexts.get(environmentId);
			const operation = context?.upload;
			if (!context || !operation || operation.state !== "completed" || operation.baseManifestRef !== baseManifestRef || !operation.uploaded || !isCurrentContext(context)) throw new Error("Node workspace transfer upload did not complete");
			context.upload = void 0;
			return operation.uploaded;
		},
		getSnapshot(environmentId, manifestRef) {
			return contexts.get(environmentId)?.snapshots.get(manifestRef);
		},
		publishSnapshot(environmentId, snapshot) {
			const context = contexts.get(environmentId);
			if (!context || !isCurrentContext(context)) throw new Error("Node workspace transfer context is unavailable");
			context.snapshots.set(snapshot.manifestRef, snapshot);
			context.currentManifestRef = snapshot.manifestRef;
			pruneSnapshots(context);
			return mintDownload(context, snapshot.manifestRef);
		},
		revoke(environmentId, token) {
			const context = contexts.get(environmentId);
			context?.downloads.delete(token);
			if (context) pruneSnapshots(context);
			if (context?.upload?.token === token && context.upload.state === "ready") context.upload = void 0;
		},
		authorize(params) {
			const context = contexts.get(params.route.environmentId);
			if (!context || !isCurrentContext(context)) return;
			const download = context.downloads.get(params.token);
			if (download) {
				if (download.expiresAtMs <= now() || !capabilityMatchesContext(download, context) || !routeMatchesDownload(context, download, params.route)) return;
				return {
					context,
					capability: download,
					route: params.route
				};
			}
			const upload = context.upload;
			if (!upload || upload.token !== params.token || upload.state !== "ready" || upload.expiresAtMs <= now() || !capabilityMatchesContext(upload, context) || params.route.kind !== "reconcile" || params.route.environmentId !== context.environmentId || params.route.baseManifestRef !== upload.baseManifestRef) return;
			upload.state = "receiving";
			return {
				context,
				capability: upload,
				route: params.route
			};
		},
		isAuthorizationCurrent: authorizationCurrent,
		authorizationSignal(authorization) {
			return authorization.context.abortController.signal;
		},
		snapshot(authorization) {
			if (authorization.capability.direction !== "download" || authorization.route.kind !== "manifest" && authorization.route.kind !== "pack" || !authorizationCurrent(authorization)) return;
			return authorization.context.snapshots.get(authorization.capability.manifestRef);
		},
		blob(authorization) {
			if (authorization.capability.direction !== "download" || authorization.route.kind !== "blob" || !authorizationCurrent(authorization)) return;
			const snapshot = authorization.context.snapshots.get(authorization.capability.manifestRef);
			const sha256 = authorization.route.sha256;
			const entry = snapshot?.manifest.entries.find((candidate) => candidate.type === "file" && candidate.sha256 === sha256);
			return snapshot && entry?.type === "file" ? {
				path: entryPath(snapshot.root, entry.path),
				size: entry.size,
				sha256: entry.sha256
			} : void 0;
		},
		async receiveUpload(params) {
			const { authorization } = params;
			const operation = authorization.capability;
			if (operation.direction !== "upload" || authorization.route.kind !== "reconcile" || operation.state !== "receiving") throw new Error("Workspace transfer upload owner is unavailable");
			const assertCurrent = () => {
				params.signal.throwIfAborted();
				assertAuthorizationCurrent(authorization);
			};
			let stagingRoot;
			try {
				assertCurrent();
				const contentLength = Number(params.request.headers["content-length"]);
				if (!Number.isSafeInteger(contentLength) || contentLength < 8 || contentLength > MAX_UPLOAD_BYTES) throw new NodeWorkspaceTransferLimitError("Workspace transfer upload exceeds its byte limit");
				const reader = new RequestByteReader(params.request, params.signal, assertCurrent);
				const readManifest = async (expectedRef) => {
					const bytes = (await reader.readExactly(4)).readUInt32BE();
					if (bytes < 2 || bytes > 67108864) throw new NodeWorkspaceTransferLimitError("Workspace transfer manifest exceeds its byte limit");
					const raw = (await reader.readExactly(bytes)).toString("utf8");
					const ref = expectedRef ?? `sha256:${createHash("sha256").update(raw).digest("hex")}`;
					return {
						raw,
						ref,
						manifest: parseWorkerWorkspaceManifest(raw, ref)
					};
				};
				const base = await readManifest(operation.baseManifestRef);
				assertCurrent();
				const current = await readManifest();
				assertCurrent();
				const transferPaths = workerWorkspaceTransferPaths(current.manifest, base.manifest);
				const transferPathSet = new Set(transferPaths);
				stagingRoot = await fs.mkdtemp(path.join(authorization.context.temporaryRoot, "upload-"));
				const currentByPath = new Map(current.manifest.entries.map((entry) => [entry.path, entry]));
				for (const relative of transferPaths) {
					const entry = currentByPath.get(relative);
					if (!entry) continue;
					const destination = entryPath(stagingRoot, relative);
					await fs.mkdir(path.dirname(destination), {
						recursive: true,
						mode: 448
					});
					assertCurrent();
					if (entry.type === "symlink") {
						await fs.symlink(entry.target, destination);
						assertCurrent();
					} else {
						const handle = await fs.open(destination, "wx", entry.mode);
						try {
							await streamUploadFile({
								reader,
								handle,
								entry,
								assertCurrent
							});
						} finally {
							await handle.close();
						}
						assertCurrent();
					}
				}
				await reader.assertEnd();
				assertCurrent();
				if (reader.bytesRead !== contentLength) throw new Error("Workspace transfer upload length is inconsistent");
				await assertWorkspaceMatchesManifest({
					root: stagingRoot,
					manifest: current.manifest,
					entries: current.manifest.entries.filter((entry) => transferPathSet.has(entry.path))
				});
				assertCurrent();
				operation.uploaded = {
					base: base.manifest,
					baseManifestRef: operation.baseManifestRef,
					baseRaw: base.raw,
					current: current.manifest,
					currentManifestRef: current.ref,
					currentRaw: current.raw,
					stagingRoot
				};
				operation.state = "completed";
				return { manifestRef: current.ref };
			} catch (error) {
				if (stagingRoot) await fs.rm(stagingRoot, {
					recursive: true,
					force: true
				});
				if (authorization.context.upload === operation) authorization.context.upload = void 0;
				throw error;
			}
		},
		async verifyBlob(params) {
			const snapshot = await readWorkspaceFileSnapshotWithLimit(params.path, Math.min(params.size, MAX_WORKSPACE_INVENTORY_TOTAL_BYTES));
			return snapshot.type === "file" && snapshot.size === params.size && snapshot.sha256 === params.sha256;
		},
		close: closeEnvironment,
		async closeAll() {
			await temporaryRootReady;
			const closed = await Promise.allSettled([...contexts.keys()].map(closeEnvironment));
			closed.push(...await Promise.allSettled([fs.rm(temporaryBaseRoot, {
				recursive: true,
				force: true
			})]));
			const failure = closed.find((result) => result.status === "rejected");
			if (failure) throw failure.reason;
		}
	};
}
//#endregion
export { isNodeWorkspaceTransferLimitError as n, createNodeWorkspaceTransferService as t };
