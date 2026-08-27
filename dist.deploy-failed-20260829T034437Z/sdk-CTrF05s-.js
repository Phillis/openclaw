import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import "./error-runtime-CmA1H4Zg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./reaction-common-CTyQTnvd.js";
import { t as SqliteBackedMatrixSyncStore } from "./file-sync-store-BFmVT3ip.js";
import { n as LogService, r as noop, t as ConsoleLogger } from "./logger-CW5fjS5i.js";
import { t as MATRIX_IDB_PERSIST_INTERVAL_MS } from "./idb-persistence-lock-DAJ49nZX.js";
import { n as isMatrixNotFoundError, t as formatMatrixErrorReason } from "./errors-5zzRRC12.js";
import { i as throwIfMatrixStartupAborted, n as createMatrixStartupAbortError } from "./startup-abort-yDtnMgq-.js";
import { n as matrixEventToRaw, r as parseMxc } from "./event-helpers-CbDIwgN7.js";
import { n as createMatrixGuardedFetch, t as MatrixAuthedHttpClient } from "./http-client-CQPxBjgA.js";
import { n as resolveMatrixRoomKeyBackupReadinessError } from "./backup-health-Dm_YMVFT.js";
import { t as createMatrixJsSdkClientLogger } from "./logging-BBYAvYgq.js";
import { a as isMatrixAccessTokenInvalidatedError, c as resolveMatrixLocalTimeoutMs, f as isMatrixReadySyncState, i as createMatrixExplicitBootstrapOptions, l as unresolvedMatrixDeviceVerificationStatus, n as MATRIX_INITIAL_CRYPTO_BOOTSTRAP_OPTIONS, o as resolveMatrixDiagnostic, p as isMatrixTerminalSyncState, r as MATRIX_STATUS_DIAGNOSTIC_TIMEOUT_MS, s as resolveMatrixDiagnosticResult, t as MATRIX_AUTOMATIC_REPAIR_BOOTSTRAP_OPTIONS, u as unresolvedMatrixRoomKeyBackupStatus } from "./client-support-iDrp3pNM.js";
import { n as isRepairableSecretStorageAccessError, t as MatrixRecoveryKeyStore } from "./recovery-key-store-Bh0ZrdRE.js";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { EventEmitter } from "node:events";
import { ClientEvent, EventType, Filter, MatrixError, MatrixEventEvent, MsgType, Preset, createClient } from "matrix-js-sdk/lib/matrix.js";
import { VerificationMethod } from "matrix-js-sdk/lib/types.js";
import { SyncApi, SyncState } from "matrix-js-sdk/lib/sync.js";
import { EventStatus } from "matrix-js-sdk/lib/models/event-status.js";
//#region extensions/matrix/src/matrix/sdk/client-device-info.ts
async function resolveMatrixCrossSigningPublicationStatus(params) {
	if (!params.userId) return {
		userId: null,
		masterKeyPublished: false,
		selfSigningKeyPublished: false,
		userSigningKeyPublished: false,
		published: false
	};
	try {
		const response = await params.query();
		const masterKeyPublished = Boolean(response.master_keys?.[params.userId]);
		const selfSigningKeyPublished = Boolean(response.self_signing_keys?.[params.userId]);
		const userSigningKeyPublished = Boolean(response.user_signing_keys?.[params.userId]);
		return {
			userId: params.userId,
			masterKeyPublished,
			selfSigningKeyPublished,
			userSigningKeyPublished,
			published: masterKeyPublished && selfSigningKeyPublished && userSigningKeyPublished
		};
	} catch {
		return {
			userId: params.userId,
			masterKeyPublished: false,
			selfSigningKeyPublished: false,
			userSigningKeyPublished: false,
			published: false
		};
	}
}
async function listMatrixOwnDevices(client) {
	const currentDeviceId = client.getDeviceId()?.trim() || null;
	const devices = await client.getDevices();
	return (Array.isArray(devices?.devices) ? devices.devices : []).map((device) => ({
		deviceId: device.device_id,
		displayName: device.display_name?.trim() || null,
		lastSeenIp: device.last_seen_ip?.trim() || null,
		lastSeenTs: typeof device.last_seen_ts === "number" && Number.isFinite(device.last_seen_ts) ? device.last_seen_ts : null,
		current: currentDeviceId !== null && device.device_id === currentDeviceId
	}));
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-event-bridge.ts
function registerMatrixClientBridge(params) {
	params.client.on(ClientEvent.Event, (event) => {
		const roomId = event.getRoomId();
		if (!roomId) return;
		const raw = matrixEventToRaw(event, { contentMode: "original" });
		const isEncryptedEvent = raw.type === "m.room.encrypted";
		params.emitter.emit("room.event", roomId, raw);
		if (isEncryptedEvent) params.emitter.emit("room.encrypted_event", roomId, raw);
		else if (params.decryptBridge.shouldEmitUnencryptedMessage(roomId, raw.event_id)) params.emitter.emit("room.message", roomId, raw);
		const stateKey = raw.state_key ?? "";
		const selfUserId = params.getSelfUserId();
		const membership = raw.type === "m.room.member" ? raw.content.membership : void 0;
		if (stateKey && selfUserId && stateKey === selfUserId) {
			if (membership === "invite") params.emitter.emit("room.invite", roomId, raw);
			else if (membership === "join") params.emitter.emit("room.join", roomId, raw);
		}
		if (isEncryptedEvent) params.decryptBridge.attachEncryptedEvent(event, roomId);
	});
	params.client.on(ClientEvent.Room, params.emitMembershipForRoom);
	params.client.on(ClientEvent.Sync, (state, prevState, data) => {
		const error = data && typeof data === "object" && "error" in data ? data.error : void 0;
		params.setCurrentSyncState(state, error);
		params.emitter.emit("sync.state", state, prevState, error);
	});
	params.client.on(ClientEvent.SyncUnexpectedError, (error) => {
		params.emitter.emit("sync.unexpected_error", error);
	});
}
function emitMatrixMembershipForRoom(params) {
	const roomId = params.room.roomId.trim();
	if (!roomId || !params.selfUserId) return;
	const membership = params.room.getMyMembership();
	const raw = {
		event_id: `$membership-${roomId}-${Date.now()}`,
		type: "m.room.member",
		sender: params.selfUserId,
		state_key: params.selfUserId,
		content: { membership },
		origin_server_ts: Date.now(),
		unsigned: { age: 0 }
	};
	if (membership === "invite") {
		params.emitter.emit("room.invite", roomId, raw);
		return;
	}
	if (membership === "join") params.emitter.emit("room.join", roomId, raw);
}
function refreshMatrixDmRoomIds(direct, dmRoomIds) {
	dmRoomIds.clear();
	if (!direct || typeof direct !== "object") return false;
	for (const value of Object.values(direct)) {
		if (!Array.isArray(value)) continue;
		for (const roomId of value) if (typeof roomId === "string" && roomId.trim()) dmRoomIds.add(roomId);
	}
	return true;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-sync-quiesce.ts
const MATRIX_SYNC_QUIESCE_TIMEOUT_MS = 5e3;
const MATRIX_JS_SDK_SYNC_VERSION = "42.2.0";
const matrixJsSdkPackage = createRequire(import.meta.url)("matrix-js-sdk/package.json");
function requireMatrixClassicSyncInternals(syncApi) {
	return syncApi;
}
function assertMatrixJsSdkSyncVersion() {
	const version = matrixJsSdkPackage.version;
	if (version !== MATRIX_JS_SDK_SYNC_VERSION) throw new Error(`Matrix sync quiesce requires matrix-js-sdk ${MATRIX_JS_SDK_SYNC_VERSION}; found ${String(version)}`);
}
async function quiesceMatrixClientSync(params) {
	await params.syncStore?.freezeSyncCursorPersistence();
	try {
		assertMatrixJsSdkSyncVersion();
	} catch (error) {
		params.syncStore?.discardPendingSyncCursorPersistence();
		throw error;
	}
	const syncApi = params.client.syncApi;
	if (syncApi === void 0 && !params.started) return;
	if (!(syncApi instanceof SyncApi)) {
		params.syncStore?.discardPendingSyncCursorPersistence();
		throw new Error(syncApi === void 0 ? "Matrix sync quiesce requires the classic matrix-js-sdk SyncApi, but none is active" : "Matrix sync quiesce rejected a sliding or unknown matrix-js-sdk sync implementation");
	}
	const syncState = syncApi.getSyncState();
	if (syncState === SyncState.Stopped) {
		params.markStopped();
		return;
	}
	const disconnectedBeforeStop = syncState === SyncState.Error || syncState === SyncState.Reconnecting;
	const syncInternals = requireMatrixClassicSyncInternals(syncApi);
	const keepaliveResolvers = disconnectedBeforeStop ? syncInternals.connectionReturnedResolvers : void 0;
	await new Promise((resolve, reject) => {
		let settled = false;
		const settle = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.emitter.off("sync.state", onSyncState);
			if (error) reject(error);
			else {
				params.markStopped();
				resolve();
			}
		};
		const onSyncState = (state) => {
			if (state === "STOPPED") settle();
		};
		const timeout = setTimeout(() => {
			params.syncStore?.discardPendingSyncCursorPersistence();
			settle(/* @__PURE__ */ new Error(`Matrix classic sync did not reach STOPPED within 5000ms`));
		}, MATRIX_SYNC_QUIESCE_TIMEOUT_MS);
		timeout.unref?.();
		params.emitter.on("sync.state", onSyncState);
		try {
			syncApi.stop();
			if (keepaliveResolvers && syncInternals.connectionReturnedResolvers === keepaliveResolvers) {
				syncInternals.connectionReturnedResolvers = void 0;
				keepaliveResolvers.reject("SyncApi.stop() was called");
				settle();
			}
		} catch (error) {
			params.syncStore?.discardPendingSyncCursorPersistence();
			settle(error instanceof Error ? error : new Error(String(error)));
		}
	});
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-base.ts
function resolveMessageWireDispatch(resource, init) {
	if ((init?.method ?? (resource instanceof Request ? resource.method : "GET")).toUpperCase() !== "PUT") return null;
	const rawUrl = typeof resource === "string" ? resource : resource instanceof URL ? resource.href : resource.url;
	const segments = new URL(rawUrl).pathname.split("/").filter(Boolean);
	const roomsIndex = segments.lastIndexOf("rooms");
	if (roomsIndex < 0 || segments[roomsIndex + 2] !== "send" || segments.length !== roomsIndex + 5) return null;
	const eventType = decodeURIComponent(segments[roomsIndex + 3] ?? "");
	if (eventType !== "m.room.message" && eventType !== "m.room.encrypted") return null;
	return {
		roomId: decodeURIComponent(segments[roomsIndex + 1] ?? ""),
		eventType,
		transactionId: decodeURIComponent(segments[roomsIndex + 4] ?? ""),
		requestPath: new URL(rawUrl).pathname
	};
}
let loadedMatrixCryptoRuntime = null;
const loadMatrixCryptoRuntime = createLazyRuntimeModule(() => import("./crypto-runtime-tzUzVSlJ.js").then((runtime) => {
	loadedMatrixCryptoRuntime = runtime;
	return runtime;
}));
var MatrixClientBase = class {
	constructor(homeserver, accessToken, opts = {}) {
		this.emitter = new EventEmitter();
		this.bridgeRegistered = false;
		this.started = false;
		this.cryptoBootstrapped = false;
		this.dmRoomIds = /* @__PURE__ */ new Set();
		this.cryptoInitialized = false;
		this.sendQueue = new KeyedAsyncQueue();
		this.syncQuiescePromise = null;
		this.stopPersistPromise = null;
		this.verificationSummaryListenerBound = false;
		this.currentSyncState = null;
		this.currentSyncError = void 0;
		this.transactionScopeId = null;
		this.transactionScopePromise = null;
		this.messageWireDispatchGuards = /* @__PURE__ */ new Map();
		this.sdkStopped = false;
		this.stopDiscardPromise = null;
		this.idbPersistPromise = null;
		this.idbPersistAbortController = null;
		this.dms = {
			update: async () => {
				return await this.refreshDmCache();
			},
			isDm: (roomId) => this.dmRoomIds.has(roomId)
		};
		this.idbPersistTimer = null;
		this.transactionScopeHomeserver = homeserver;
		this.transactionScopeAccessTokenHash = createHash("sha256").update(accessToken).digest("hex");
		this.transactionScopeDeviceId = opts.deviceId?.trim() || null;
		this.httpClient = new MatrixAuthedHttpClient({
			homeserver,
			accessToken,
			ssrfPolicy: opts.ssrfPolicy,
			dispatcherPolicy: opts.dispatcherPolicy
		});
		this.localTimeoutMs = resolveMatrixLocalTimeoutMs(opts.localTimeoutMs);
		this.initialSyncLimit = opts.initialSyncLimit;
		this.syncFilter = opts.syncFilter;
		this.encryptionEnabled = opts.encryption === true;
		const { password: loginPassword } = opts;
		this.password = loginPassword;
		this.syncStore = opts.storageRootDir ? new SqliteBackedMatrixSyncStore(opts.storageRootDir) : void 0;
		this.idbSnapshotPath = opts.idbSnapshotPath;
		this.cryptoDatabasePrefix = opts.cryptoDatabasePrefix;
		this.selfUserId = opts.userId?.trim() || null;
		this.autoBootstrapCrypto = opts.autoBootstrapCrypto !== false;
		this.recoveryKeyStore = new MatrixRecoveryKeyStore(opts.recoveryKeyPath);
		const cryptoCallbacks = this.encryptionEnabled ? this.recoveryKeyStore.buildCryptoCallbacks() : void 0;
		const guardedFetch = createMatrixGuardedFetch({
			ssrfPolicy: opts.ssrfPolicy,
			dispatcherPolicy: opts.dispatcherPolicy
		});
		this.client = createClient({
			baseUrl: homeserver,
			accessToken,
			userId: opts.userId,
			deviceId: opts.deviceId,
			logger: createMatrixJsSdkClientLogger("MatrixClient"),
			localTimeoutMs: this.localTimeoutMs,
			fetchFn: (async (resource, init) => {
				const dispatch = resolveMessageWireDispatch(resource, init);
				if (dispatch) await this.messageWireDispatchGuards.get(dispatch.transactionId)?.(dispatch);
				return await guardedFetch(resource, init);
			}),
			store: this.syncStore,
			cryptoCallbacks,
			verificationMethods: [
				VerificationMethod.Sas,
				VerificationMethod.ShowQrCode,
				VerificationMethod.ScanQrCode,
				VerificationMethod.Reciprocate
			]
		});
	}
	async withMessageWireDispatchGuard(params) {
		if (!params.transactionId || !params.guard) return await params.run();
		if (this.messageWireDispatchGuards.has(params.transactionId)) throw new Error(`Matrix transaction ${params.transactionId} already has a dispatch guard`);
		this.messageWireDispatchGuards.set(params.transactionId, params.guard);
		try {
			return await params.run();
		} finally {
			this.messageWireDispatchGuards.delete(params.transactionId);
		}
	}
	on(eventName, listener) {
		this.emitter.on(eventName, listener);
		return this;
	}
	off(eventName, listener) {
		this.emitter.off(eventName, listener);
		return this;
	}
	async ensureCryptoSupportInitialized() {
		if (this.decryptBridge && (!this.encryptionEnabled || this.verificationManager && this.cryptoBootstrapper && this.crypto)) return;
		const runtime = await loadMatrixCryptoRuntime();
		this.decryptBridge ??= new runtime.MatrixDecryptBridge({
			client: this.client,
			toRaw: (event) => matrixEventToRaw(event, { contentMode: "original" }),
			emitDecryptedEvent: (roomId, event) => {
				this.emitter.emit("room.decrypted_event", roomId, event);
			},
			emitMessage: (roomId, event) => {
				this.emitter.emit("room.message", roomId, event);
			},
			emitFailedDecryption: (roomId, event, error) => {
				this.emitter.emit("room.failed_decryption", roomId, event, error);
			}
		});
		if (!this.encryptionEnabled) return;
		this.verificationManager ??= new runtime.MatrixVerificationManager({ trustOwnDeviceAfterSas: async (deviceId) => {
			const crypto = this.client.getCrypto();
			if (typeof crypto?.crossSignDevice !== "function") return;
			await crypto.crossSignDevice(deviceId);
		} });
		this.cryptoBootstrapper ??= new runtime.MatrixCryptoBootstrapper({
			getUserId: () => this.getUserId(),
			getPassword: () => this.password,
			canUnlockSecretStorage: async () => {
				const secretStorage = this.client.secretStorage;
				if (!secretStorage || typeof secretStorage.getDefaultKeyId !== "function" || typeof secretStorage.getKey !== "function" || typeof secretStorage.checkKey !== "function") return false;
				const defaultKeyId = await secretStorage.getDefaultKeyId();
				if (!defaultKeyId) return false;
				const keyTuple = await secretStorage.getKey(defaultKeyId);
				const key = this.recoveryKeyStore.getSecretStorageKeyCandidate(defaultKeyId);
				if (!keyTuple || !key) return false;
				const keyInfo = keyTuple[1];
				if (!keyInfo.iv?.trim() || !keyInfo.mac?.trim()) return false;
				return await secretStorage.checkKey(key, keyInfo);
			},
			getDeviceId: () => this.client.getDeviceId(),
			verificationManager: this.verificationManager,
			recoveryKeyStore: this.recoveryKeyStore,
			decryptBridge: this.decryptBridge
		});
		if (!this.crypto) this.crypto = runtime.createMatrixCryptoFacade({
			client: this.client,
			verificationManager: this.verificationManager,
			recoveryKeyStore: this.recoveryKeyStore,
			isRoomEncrypted: async (roomId) => await this.getMessageWireEventType(roomId) === "m.room.encrypted",
			downloadContent: (mxcUrl, opts) => this.downloadContent(mxcUrl, opts)
		});
		if (!this.verificationSummaryListenerBound) {
			this.verificationSummaryListenerBound = true;
			this.verificationManager.onSummaryChanged((summary) => {
				this.emitter.emit("verification.summary", summary);
			});
		}
	}
	async start(opts = {}) {
		await this.startSyncSession({
			bootstrapCrypto: true,
			abortSignal: opts.abortSignal,
			readyTimeoutMs: opts.readyTimeoutMs
		});
	}
	async waitForInitialSyncReady(params = {}) {
		const timeoutMs = params.timeoutMs ?? 3e4;
		if (isMatrixReadySyncState(this.currentSyncState)) return;
		if (isMatrixAccessTokenInvalidatedError(this.currentSyncError)) throw this.currentSyncError instanceof Error ? this.currentSyncError : new Error("Matrix access token invalidated", { cause: this.currentSyncError });
		if (isMatrixTerminalSyncState(this.currentSyncState)) throw new Error(`Matrix sync entered ${this.currentSyncState} during startup`);
		await new Promise((resolve, reject) => {
			let settled = false;
			let timeoutId;
			const abortSignal = params.abortSignal;
			const cleanup = () => {
				this.off("sync.state", onSyncState);
				this.off("sync.unexpected_error", onUnexpectedError);
				abortSignal?.removeEventListener("abort", onAbort);
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
				}
			};
			const settleResolve = () => {
				if (settled) return;
				settled = true;
				cleanup();
				resolve();
			};
			const settleReject = (error) => {
				if (settled) return;
				settled = true;
				cleanup();
				reject(error);
			};
			const onSyncState = (state, _prevState, error) => {
				if (isMatrixReadySyncState(state)) {
					settleResolve();
					return;
				}
				if (isMatrixAccessTokenInvalidatedError(error)) {
					settleReject(error instanceof Error ? error : /* @__PURE__ */ new Error("Matrix access token invalidated"));
					return;
				}
				if (isMatrixTerminalSyncState(state)) settleReject(new Error(error instanceof Error && error.message ? error.message : `Matrix sync entered ${state} during startup`));
			};
			const onUnexpectedError = (error) => {
				settleReject(error);
			};
			const onAbort = () => {
				settleReject(createMatrixStartupAbortError());
			};
			this.on("sync.state", onSyncState);
			this.on("sync.unexpected_error", onUnexpectedError);
			if (abortSignal?.aborted) {
				onAbort();
				return;
			}
			abortSignal?.addEventListener("abort", onAbort, { once: true });
			timeoutId = setTimeout(() => {
				settleReject(/* @__PURE__ */ new Error(`Matrix client did not reach a ready sync state within ${timeoutMs}ms`));
			}, timeoutMs);
			timeoutId.unref?.();
		});
	}
	async startSyncSession(opts) {
		if (this.started) return;
		if (this.sdkStopped) throw new Error("Matrix client has been fully stopped and cannot be restarted; acquire a new shared client generation");
		throwIfMatrixStartupAborted(opts.abortSignal);
		await this.ensureCryptoSupportInitialized();
		throwIfMatrixStartupAborted(opts.abortSignal);
		this.registerBridge();
		await this.initializeCryptoIfNeeded(opts.abortSignal);
		throwIfMatrixStartupAborted(opts.abortSignal);
		await this.client.startClient({
			initialSyncLimit: this.initialSyncLimit,
			...this.syncFilter ? { filter: Filter.fromJson(this.selfUserId, "", this.syncFilter) } : {}
		});
		await this.waitForInitialSyncReady({
			abortSignal: opts.abortSignal,
			timeoutMs: opts.readyTimeoutMs
		});
		throwIfMatrixStartupAborted(opts.abortSignal);
		if (opts.bootstrapCrypto && this.autoBootstrapCrypto) await this.bootstrapCryptoIfNeeded(opts.abortSignal);
		throwIfMatrixStartupAborted(opts.abortSignal);
		this.started = true;
		this.emitOutstandingInviteEvents();
		await this.refreshDmCache().catch(noop);
	}
	async prepareForOneOff() {
		if (!this.encryptionEnabled) return;
		await this.ensureCryptoSupportInitialized();
		await this.initializeCryptoIfNeeded();
		if (!this.crypto) return;
		try {
			const joinedRooms = await this.getJoinedRooms();
			await this.crypto.prepare(joinedRooms);
		} catch {}
	}
	hasPersistedSyncState() {
		return this.syncStore?.hasSavedSyncFromCleanShutdown() === true;
	}
	async ensureStartedForCryptoControlPlane() {
		if (this.started) return;
		await this.startSyncSession({ bootstrapCrypto: false });
	}
	stopSdkClient() {
		if (this.sdkStopped) return;
		this.currentSyncState = null;
		this.currentSyncError = void 0;
		this.client.stopClient();
		this.sdkStopped = true;
		this.started = false;
	}
	async quiesceSync() {
		this.syncQuiescePromise ??= quiesceMatrixClientSync({
			client: this.client,
			emitter: this.emitter,
			markStopped: () => {
				this.started = false;
			},
			started: this.started,
			syncStore: this.syncStore
		});
		await this.syncQuiescePromise;
	}
	async drainPendingDecryptions(reason = "matrix client shutdown") {
		await this.decryptBridge?.drainPendingDecryptions(reason);
	}
	stop() {
		this.stopAndPersist().catch(() => this.stopWithoutPersist()).catch(noop);
	}
	async stopClientGeneration(persist) {
		if (persist) await this.quiesceSync();
		else {
			await this.quiesceSync().catch(noop);
			this.syncStore?.discardPendingSyncCursorPersistence();
		}
		if (this.idbPersistTimer) {
			clearInterval(this.idbPersistTimer);
			this.idbPersistTimer = null;
		}
		this.idbPersistAbortController?.abort();
		const activePeriodicPersist = this.idbPersistPromise;
		this.stopSdkClient();
		this.decryptBridge?.stop();
		await activePeriodicPersist;
		if (persist) {
			await (loadedMatrixCryptoRuntime ?? await loadMatrixCryptoRuntime()).persistIdbToDisk({
				snapshotPath: this.idbSnapshotPath,
				databasePrefix: this.cryptoDatabasePrefix,
				strict: true
			});
			this.syncStore?.markCleanShutdown();
			await this.syncStore?.flush();
		}
	}
	async stopAndPersist() {
		this.stopPersistPromise ??= this.stopClientGeneration(true);
		await this.stopPersistPromise;
	}
	stopWithoutPersist() {
		if (!this.stopPersistPromise) this.stopPersistPromise = this.stopDiscardPromise = this.stopClientGeneration(false);
		return this.stopDiscardPromise ??= this.stopPersistPromise.catch(() => this.stopClientGeneration(false));
	}
	async bootstrapCryptoIfNeeded(abortSignal) {
		if (!this.encryptionEnabled || !this.cryptoInitialized || this.cryptoBootstrapped) return;
		throwIfMatrixStartupAborted(abortSignal);
		await this.ensureCryptoSupportInitialized();
		const crypto = this.client.getCrypto();
		if (!crypto) return;
		const cryptoBootstrapper = this.cryptoBootstrapper;
		if (!cryptoBootstrapper) return;
		const initial = await cryptoBootstrapper.bootstrap(crypto, MATRIX_INITIAL_CRYPTO_BOOTSTRAP_OPTIONS);
		throwIfMatrixStartupAborted(abortSignal);
		if (!initial.crossSigningPublished || initial.ownDeviceVerified === false) if ((await this.getOwnDeviceVerificationStatus()).signedByOwner) LogService.warn("MatrixClientLite", "Cross-signing/bootstrap is incomplete for an already owner-signed device; skipping automatic reset and preserving the current identity. Restore the recovery key or run an explicit verification bootstrap if repair is needed.");
		else try {
			const repaired = await cryptoBootstrapper.bootstrap(crypto, MATRIX_AUTOMATIC_REPAIR_BOOTSTRAP_OPTIONS);
			throwIfMatrixStartupAborted(abortSignal);
			if (repaired.crossSigningPublished && repaired.ownDeviceVerified !== false) LogService.info("MatrixClientLite", "Cross-signing/bootstrap recovered after forced reset");
		} catch (err) {
			LogService.warn("MatrixClientLite", "Failed to recover cross-signing/bootstrap with forced reset:", err);
		}
		this.cryptoBootstrapped = true;
	}
	async initializeCryptoIfNeeded(abortSignal) {
		if (!this.encryptionEnabled || this.cryptoInitialized) return;
		throwIfMatrixStartupAborted(abortSignal);
		const { persistIdbToDisk, restoreIdbFromDisk } = await loadMatrixCryptoRuntime();
		await restoreIdbFromDisk(this.idbSnapshotPath);
		throwIfMatrixStartupAborted(abortSignal);
		try {
			await this.client.initRustCrypto({ cryptoDatabasePrefix: this.cryptoDatabasePrefix });
			this.cryptoInitialized = true;
			throwIfMatrixStartupAborted(abortSignal);
			await persistIdbToDisk({
				snapshotPath: this.idbSnapshotPath,
				databasePrefix: this.cryptoDatabasePrefix,
				abortSignal
			});
			throwIfMatrixStartupAborted(abortSignal);
			this.idbPersistTimer = setInterval(() => {
				if (this.idbPersistPromise) return;
				const abortController = new AbortController();
				this.idbPersistAbortController = abortController;
				this.idbPersistPromise = persistIdbToDisk({
					snapshotPath: this.idbSnapshotPath,
					databasePrefix: this.cryptoDatabasePrefix,
					abortSignal: abortController.signal
				}).catch(noop).finally(() => {
					this.idbPersistPromise = null;
					this.idbPersistAbortController = null;
				});
			}, MATRIX_IDB_PERSIST_INTERVAL_MS);
			this.idbPersistTimer.unref?.();
		} catch (err) {
			throwIfMatrixStartupAborted(abortSignal);
			LogService.warn("MatrixClientLite", "Failed to initialize rust crypto:", err);
		}
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-core.ts
function isUnsupportedAuthenticatedMediaEndpointError(err) {
	const statusCode = err?.statusCode;
	if (statusCode === 404 || statusCode === 405 || statusCode === 501) return true;
	const message = formatMatrixErrorReason(err);
	return message.includes("m_unrecognized") || message.includes("unrecognized request") || message.includes("method not allowed") || message.includes("not implemented");
}
var MatrixClientCore = class extends MatrixClientBase {
	async getUserId() {
		const fromClient = this.client.getUserId();
		if (fromClient) {
			this.selfUserId = fromClient;
			return fromClient;
		}
		if (this.selfUserId) return this.selfUserId;
		const resolved = (await this.doRequest("GET", "/_matrix/client/v3/account/whoami")).user_id?.trim();
		if (!resolved) throw new Error("Matrix whoami did not return user_id");
		this.selfUserId = resolved;
		return resolved;
	}
	async getJoinedRooms() {
		const joined = await this.doRequest("GET", "/_matrix/client/v3/joined_rooms");
		return Array.isArray(joined.joined_rooms) ? joined.joined_rooms : [];
	}
	async getTransactionScopeId() {
		if (this.transactionScopeId) return this.transactionScopeId;
		const active = this.transactionScopePromise ?? (async () => {
			const configuredUserId = this.client.getUserId()?.trim() || this.selfUserId;
			const configuredDeviceId = this.transactionScopeDeviceId || this.client.getDeviceId()?.trim() || null;
			const whoami = await this.doRequest("GET", "/_matrix/client/v3/account/whoami");
			const userId = whoami.user_id?.trim() || null;
			const deviceId = whoami.device_id?.trim() || null;
			if (!userId) throw new Error("Matrix whoami did not return user_id");
			if (configuredUserId && configuredUserId !== userId) throw new Error("Matrix access token user does not match the configured userId");
			if (configuredDeviceId && deviceId && configuredDeviceId !== deviceId) throw new Error("Matrix access token device does not match the configured deviceId");
			this.selfUserId = userId;
			this.transactionScopeDeviceId = deviceId;
			return createHash("sha256").update(this.transactionScopeHomeserver).update("\0").update(userId).update("\0").update(deviceId ?? "").update("\0").update(this.transactionScopeAccessTokenHash).digest("hex");
		})();
		this.transactionScopePromise = active;
		try {
			const resolved = await active;
			this.transactionScopeId = resolved;
			return resolved;
		} finally {
			if (this.transactionScopePromise === active) this.transactionScopePromise = null;
		}
	}
	async getJoinedRoomMembers(roomId) {
		const joined = (await this.client.getJoinedRoomMembers(roomId))?.joined;
		if (!joined || typeof joined !== "object") return [];
		return Object.keys(joined);
	}
	hasSyncedJoinedRoomMember(roomId, userId) {
		return this.client.getRoom(roomId)?.getMember(userId)?.membership === "join";
	}
	async getRoomStateEvent(roomId, eventType, stateKey = "") {
		return await this.client.getStateEvent(roomId, eventType, stateKey) ?? {};
	}
	async getAccountData(eventType) {
		return await this.client.getAccountDataFromServer(eventType) ?? void 0;
	}
	async setAccountData(eventType, content) {
		await this.client.setAccountData(eventType, content);
		await this.refreshDmCache().catch(noop);
	}
	async resolveRoom(aliasOrRoomId) {
		if (aliasOrRoomId.startsWith("!")) return aliasOrRoomId;
		if (!aliasOrRoomId.startsWith("#")) return aliasOrRoomId;
		try {
			return (await this.client.getRoomIdForAlias(aliasOrRoomId)).room_id ?? null;
		} catch {
			return null;
		}
	}
	async createDirectRoom(remoteUserId, opts = {}) {
		const initialState = opts.encrypted ? [{
			type: "m.room.encryption",
			state_key: "",
			content: { algorithm: "m.megolm.v1.aes-sha2" }
		}] : void 0;
		return (await this.client.createRoom({
			invite: [remoteUserId],
			is_direct: true,
			preset: Preset.TrustedPrivateChat,
			initial_state: initialState
		})).room_id;
	}
	async sendMessage(roomId, content, transactionId, beforeWireDispatch) {
		return await this.runSerializedRoomSend(roomId, async () => {
			return await this.withMessageWireDispatchGuard({
				transactionId,
				guard: beforeWireDispatch,
				run: async () => {
					if (transactionId) {
						const room = this.client.getRoom(roomId);
						const existing = room?.getEventForTxnId?.(transactionId);
						if (existing) {
							const existingId = existing.getId();
							if (existing.status === EventStatus.SENT && existingId && !existingId.startsWith("~")) return existingId;
							if (existing.status === EventStatus.NOT_SENT && room) {
								await this.prepareRoomForMessageSend(roomId, existing.getContent());
								return (await this.client.resendEvent(existing, room)).event_id;
							}
							throw new Error(`Matrix transaction ${transactionId} is already active with status ${existing.status ?? "unknown"}`);
						}
					}
					await this.prepareRoomForMessageSend(roomId, content);
					return (await this.client.sendMessage(roomId, content, transactionId)).event_id;
				}
			});
		});
	}
	async getMessageWireEventType(roomId) {
		if (this.client.getRoom(roomId)?.hasEncryptionStateEvent() === true) return "m.room.encrypted";
		const crypto = this.client.getCrypto();
		if (crypto && await crypto.isEncryptionEnabledInRoom(roomId)) return "m.room.encrypted";
		try {
			await this.getRoomStateEvent(roomId, "m.room.encryption", "");
			return "m.room.encrypted";
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 404 && error.errcode === "M_NOT_FOUND") return "m.room.message";
			throw error;
		}
	}
	async prepareRoomForMessageSend(roomId, content) {
		if (await this.getMessageWireEventType(roomId) === "m.room.message") return "m.room.message";
		const crypto = this.client.getCrypto();
		if (!crypto) throw new Error("Encrypted Matrix room: enable encryption before sending messages");
		const room = this.client.getRoom(roomId);
		if (!room || !room.hasEncryptionStateEvent() && !await crypto.isEncryptionEnabledInRoom(roomId)) throw new Error("Encrypted Matrix room is not ready: wait for room sync before sending");
		if (content && ((content.msgtype === MsgType.Image || content.msgtype === MsgType.Audio || content.msgtype === MsgType.Video || content.msgtype === MsgType.File) && typeof content.url === "string" || content.info && "thumbnail_url" in content.info && typeof content.info.thumbnail_url === "string")) throw new Error("Encrypted Matrix room contains unencrypted media; retry the send");
		return "m.room.encrypted";
	}
	async sendEvent(roomId, eventType, content) {
		return await this.runSerializedRoomSend(roomId, async () => {
			if (eventType === EventType.RoomMessageEncrypted.toString() || eventType === EventType.RoomRedaction.toString()) throw new Error(eventType === EventType.RoomRedaction.toString() ? "Matrix redaction wire events must use redactEvent" : "Matrix encrypted wire events must be generated by the SDK");
			if (eventType !== "m.reaction") await this.prepareRoomForMessageSend(roomId, content);
			return (await this.client.sendEvent(roomId, eventType, content)).event_id;
		});
	}
	async runSerializedRoomSend(roomId, task) {
		return await this.sendQueue.enqueue(roomId, task);
	}
	async sendStateEvent(roomId, eventType, stateKey, content) {
		return (await this.client.sendStateEvent(roomId, eventType, content, stateKey)).event_id;
	}
	async redactEvent(roomId, eventId, reason) {
		return (await this.client.redactEvent(roomId, eventId, void 0, reason?.trim() ? { reason } : void 0)).event_id;
	}
	async doRequest(method, endpoint, qs, body, opts) {
		return await this.httpClient.requestJson({
			method,
			endpoint,
			qs,
			body,
			timeoutMs: this.localTimeoutMs,
			allowAbsoluteEndpoint: opts?.allowAbsoluteEndpoint
		});
	}
	async getUserProfile(userId) {
		return await this.client.getProfileInfo(userId);
	}
	async setDisplayName(displayName) {
		await this.client.setDisplayName(displayName);
	}
	async setAvatarUrl(avatarUrl) {
		await this.client.setAvatarUrl(avatarUrl);
	}
	async joinRoom(roomId) {
		await this.client.joinRoom(roomId);
	}
	mxcToHttp(mxcUrl) {
		return this.client.mxcUrlToHttp(mxcUrl, void 0, void 0, void 0, true, false, true);
	}
	async downloadContent(mxcUrl, opts = {}) {
		const parsed = parseMxc(mxcUrl);
		if (!parsed) throw new Error(`Invalid Matrix content URI: ${mxcUrl}`);
		const encodedServer = encodeURIComponent(parsed.server);
		const encodedMediaId = encodeURIComponent(parsed.mediaId);
		const request = async (endpoint) => await this.httpClient.requestRaw({
			method: "GET",
			endpoint,
			qs: { allow_remote: opts.allowRemote ?? true },
			timeoutMs: this.localTimeoutMs,
			maxBytes: opts.maxBytes,
			readIdleTimeoutMs: opts.readIdleTimeoutMs
		});
		const authenticatedEndpoint = `/_matrix/client/v1/media/download/${encodedServer}/${encodedMediaId}`;
		try {
			return await request(authenticatedEndpoint);
		} catch (err) {
			if (!isUnsupportedAuthenticatedMediaEndpointError(err)) throw err;
		}
		return await request(`/_matrix/media/v3/download/${encodedServer}/${encodedMediaId}`);
	}
	async uploadContent(file, contentType, filename) {
		return (await this.client.uploadContent(new Uint8Array(file), {
			type: contentType || "application/octet-stream",
			name: filename,
			includeFilename: Boolean(filename)
		})).content_uri;
	}
	async getEvent(roomId, eventId) {
		const rawEvent = await this.client.fetchRoomEvent(roomId, eventId);
		if (rawEvent.type !== "m.room.encrypted") return rawEvent;
		const event = this.client.getEventMapper()(rawEvent);
		let decryptedEvent;
		const onDecrypted = (candidate) => {
			decryptedEvent = candidate;
		};
		event.once(MatrixEventEvent.Decrypted, onDecrypted);
		try {
			await this.client.decryptEventIfNeeded(event);
		} finally {
			event.off(MatrixEventEvent.Decrypted, onDecrypted);
		}
		return matrixEventToRaw(decryptedEvent ?? event);
	}
	async getRelations(roomId, eventId, relationType, eventType, opts = {}) {
		const result = await this.client.relations(roomId, eventId, relationType, eventType, opts);
		return {
			originalEvent: result.originalEvent ? matrixEventToRaw(result.originalEvent) : null,
			events: result.events.map((event) => matrixEventToRaw(event)),
			nextBatch: result.nextBatch ?? null,
			prevBatch: result.prevBatch ?? null
		};
	}
	async hydrateEvents(roomId, events) {
		if (events.length === 0) return [];
		const mapper = this.client.getEventMapper();
		const mappedEvents = events.map((event) => mapper({
			room_id: roomId,
			...event
		}));
		await Promise.all(mappedEvents.map((event) => this.client.decryptEventIfNeeded(event)));
		return mappedEvents.map((event) => matrixEventToRaw(event));
	}
	async setTyping(roomId, typing, timeoutMs) {
		await this.client.sendTyping(roomId, typing, timeoutMs);
	}
	async sendReadReceipt(roomId, eventId) {
		await this.httpClient.requestJson({
			method: "POST",
			endpoint: `/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/receipt/m.read/${encodeURIComponent(eventId)}`,
			body: {},
			timeoutMs: this.localTimeoutMs
		});
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-verification.ts
const normalizeNullableVerificationString = normalizeNullableString;
var MatrixClientVerification = class extends MatrixClientCore {
	async getRoomKeyBackupStatus() {
		if (!this.encryptionEnabled) return {
			serverVersion: null,
			activeVersion: null,
			trusted: null,
			matchesDecryptionKey: null,
			decryptionKeyCached: null,
			keyLoadAttempted: false,
			keyLoadError: null
		};
		const crypto = this.client.getCrypto();
		const serverVersionFallback = await this.resolveRoomKeyBackupVersion();
		if (!crypto) return {
			serverVersion: serverVersionFallback,
			activeVersion: null,
			trusted: null,
			matchesDecryptionKey: null,
			decryptionKeyCached: null,
			keyLoadAttempted: false,
			keyLoadError: null
		};
		let { activeVersion, decryptionKeyCached } = await this.resolveRoomKeyBackupLocalState(crypto);
		let { serverVersion, trusted, matchesDecryptionKey } = await this.resolveRoomKeyBackupTrustState(crypto, serverVersionFallback);
		const shouldLoadBackupKey = Boolean(serverVersion) && (decryptionKeyCached === false || matchesDecryptionKey === false);
		const shouldActivateBackup = Boolean(serverVersion) && !activeVersion;
		let keyLoadAttempted = false;
		let keyLoadError = null;
		if (serverVersion && (shouldLoadBackupKey || shouldActivateBackup)) {
			if (shouldLoadBackupKey) if (typeof crypto.loadSessionBackupPrivateKeyFromSecretStorage === "function") {
				keyLoadAttempted = true;
				try {
					await crypto.loadSessionBackupPrivateKeyFromSecretStorage();
				} catch (err) {
					keyLoadError = formatErrorMessage(err);
				}
			} else keyLoadError = "Matrix crypto backend does not support loading backup keys from secret storage";
			if (!keyLoadError) await this.enableTrustedRoomKeyBackupIfPossible(crypto);
			({activeVersion, decryptionKeyCached} = await this.resolveRoomKeyBackupLocalState(crypto));
			({serverVersion, trusted, matchesDecryptionKey} = await this.resolveRoomKeyBackupTrustState(crypto, serverVersion));
		}
		return {
			serverVersion,
			activeVersion,
			trusted,
			matchesDecryptionKey,
			decryptionKeyCached,
			keyLoadAttempted,
			keyLoadError
		};
	}
	async getDeviceVerificationStatus(userId, deviceId) {
		const normalizedUserId = userId?.trim() || null;
		const normalizedDeviceId = deviceId?.trim() || null;
		if (!this.encryptionEnabled) return {
			encryptionEnabled: false,
			userId: normalizedUserId,
			deviceId: normalizedDeviceId,
			verified: false,
			localVerified: false,
			crossSigningVerified: false,
			signedByOwner: false
		};
		const crypto = this.client.getCrypto();
		let deviceStatus = null;
		if (crypto && normalizedUserId && normalizedDeviceId && typeof crypto.getDeviceVerificationStatus === "function") deviceStatus = await crypto.getDeviceVerificationStatus(normalizedUserId, normalizedDeviceId).catch(() => null);
		const { isMatrixDeviceVerifiedInCurrentClient } = await loadMatrixCryptoRuntime();
		return {
			encryptionEnabled: true,
			userId: normalizedUserId,
			deviceId: normalizedDeviceId,
			verified: isMatrixDeviceVerifiedInCurrentClient(deviceStatus),
			localVerified: deviceStatus?.localVerified === true,
			crossSigningVerified: deviceStatus?.crossSigningVerified === true,
			signedByOwner: deviceStatus?.signedByOwner === true
		};
	}
	async getOwnDeviceVerificationStatus() {
		const recoveryKey = this.recoveryKeyStore.getRecoveryKeySummary();
		const userId = this.client.getUserId() ?? this.selfUserId ?? null;
		const deviceId = this.client.getDeviceId()?.trim() || null;
		const diagnosticTimeoutMs = Math.min(this.localTimeoutMs, MATRIX_STATUS_DIAGNOSTIC_TIMEOUT_MS);
		const [backup, deviceVerification, ownDevices] = await Promise.all([
			resolveMatrixDiagnostic(this.getRoomKeyBackupStatus(), diagnosticTimeoutMs),
			resolveMatrixDiagnostic(this.getDeviceVerificationStatus(userId, deviceId), diagnosticTimeoutMs),
			resolveMatrixDiagnosticResult(this.listOwnDevices(), diagnosticTimeoutMs)
		]);
		const resolvedBackup = backup ?? unresolvedMatrixRoomKeyBackupStatus();
		const resolvedDeviceVerification = deviceVerification ?? unresolvedMatrixDeviceVerificationStatus({
			userId,
			deviceId
		});
		const serverDeviceKnown = deviceId ? ownDevices.value ? ownDevices.value.some((device) => device.deviceId === deviceId) : isMatrixAccessTokenInvalidatedError(ownDevices.error) ? false : null : null;
		return {
			...resolvedDeviceVerification,
			verified: resolvedDeviceVerification.crossSigningVerified,
			recoveryKeyStored: Boolean(recoveryKey),
			recoveryKeyCreatedAt: recoveryKey?.createdAt ?? null,
			recoveryKeyId: recoveryKey?.keyId ?? null,
			backupVersion: resolvedBackup.serverVersion,
			backup: resolvedBackup,
			serverDeviceKnown
		};
	}
	async getOwnDeviceIdentityVerificationStatus() {
		const userId = this.client.getUserId() ?? this.selfUserId ?? null;
		const deviceId = this.client.getDeviceId()?.trim() || null;
		const deviceVerification = await this.getDeviceVerificationStatus(userId, deviceId);
		return {
			...deviceVerification,
			verified: deviceVerification.crossSigningVerified
		};
	}
	async trustOwnIdentityAfterSelfVerification() {
		if (!this.encryptionEnabled) return;
		await this.ensureStartedForCryptoControlPlane();
		await this.ensureCryptoSupportInitialized();
		const crypto = this.client.getCrypto();
		const ownIdentity = crypto && typeof crypto.getOwnIdentity === "function" ? await crypto.getOwnIdentity().catch(() => void 0) : void 0;
		if (!ownIdentity) return;
		try {
			if (typeof ownIdentity.isVerified === "function" && ownIdentity.isVerified()) return;
			if (typeof ownIdentity.verify !== "function") return;
			await ownIdentity.verify();
		} finally {
			ownIdentity.free?.();
		}
	}
	async resolveActiveRoomKeyBackupVersion(crypto) {
		if (typeof crypto.getActiveSessionBackupVersion !== "function") return null;
		const version = await crypto.getActiveSessionBackupVersion().catch(() => null);
		return normalizeNullableVerificationString(version);
	}
	async resolveCachedRoomKeyBackupDecryptionKey(crypto) {
		const read = Reflect.get(crypto, "getSessionBackupPrivateKey");
		if (typeof read !== "function") return null;
		const key = await read.call(crypto).catch(() => null);
		return key ? key.length > 0 : false;
	}
	async resolveRoomKeyBackupLocalState(crypto) {
		const [activeVersion, decryptionKeyCached] = await Promise.all([this.resolveActiveRoomKeyBackupVersion(crypto), this.resolveCachedRoomKeyBackupDecryptionKey(crypto)]);
		return {
			activeVersion,
			decryptionKeyCached
		};
	}
	async shouldForceSecretStorageRecreationForBackupReset(crypto) {
		if (await this.resolveCachedRoomKeyBackupDecryptionKey(crypto) !== false) return false;
		const loadSessionBackupPrivateKeyFromSecretStorage = crypto.loadSessionBackupPrivateKeyFromSecretStorage;
		if (typeof loadSessionBackupPrivateKeyFromSecretStorage !== "function") return false;
		try {
			await loadSessionBackupPrivateKeyFromSecretStorage.call(crypto);
			return false;
		} catch (err) {
			return isRepairableSecretStorageAccessError(err);
		}
	}
	async resolveRoomKeyBackupTrustState(crypto, fallbackVersion) {
		let serverVersion = fallbackVersion;
		let trusted = null;
		let matchesDecryptionKey = null;
		if (typeof crypto.getKeyBackupInfo === "function") {
			const info = await crypto.getKeyBackupInfo().catch(() => null);
			serverVersion = normalizeNullableVerificationString(info?.version) ?? serverVersion;
			if (info && typeof crypto.isKeyBackupTrusted === "function") {
				const trustInfo = await crypto.isKeyBackupTrusted(info).catch(() => null);
				trusted = typeof trustInfo?.trusted === "boolean" ? trustInfo.trusted : null;
				matchesDecryptionKey = typeof trustInfo?.matchesDecryptionKey === "boolean" ? trustInfo.matchesDecryptionKey : null;
			}
		}
		return {
			serverVersion,
			trusted,
			matchesDecryptionKey
		};
	}
	async resolveDefaultSecretStorageKeyId(crypto) {
		const getSecretStorageStatus = crypto?.getSecretStorageStatus;
		if (typeof getSecretStorageStatus !== "function") return;
		return (await getSecretStorageStatus.call(crypto).catch(() => null))?.defaultKeyId;
	}
	async resolveRoomKeyBackupVersion() {
		try {
			const response = await this.doRequest("GET", "/_matrix/client/v3/room_keys/version");
			return normalizeNullableVerificationString(response.version);
		} catch {
			return null;
		}
	}
	async enableTrustedRoomKeyBackupIfPossible(crypto) {
		if (typeof crypto.checkKeyBackupAndEnable !== "function") return;
		await crypto.checkKeyBackupAndEnable();
	}
	async ensureRoomKeyBackupEnabled(crypto) {
		if (await this.resolveRoomKeyBackupVersion()) return;
		LogService.info("MatrixClientLite", "No room key backup version found on server, creating one via secret storage bootstrap");
		await this.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, { setupNewKeyBackup: true });
		const createdVersion = await this.resolveRoomKeyBackupVersion();
		if (!createdVersion) throw new Error("Matrix room key backup is still missing after bootstrap");
		LogService.info("MatrixClientLite", `Room key backup enabled (version ${createdVersion})`);
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk.ts
var MatrixClient = class extends MatrixClientVerification {
	async verifyWithRecoveryKey(rawRecoveryKey) {
		const fail = async (error, fields = {}) => {
			const status = await this.getOwnDeviceVerificationStatus();
			return {
				success: false,
				recoveryKeyAccepted: fields.recoveryKeyAccepted ?? false,
				backupUsable: fields.backupUsable ?? false,
				deviceOwnerVerified: fields.deviceOwnerVerified ?? status.verified,
				error,
				...status
			};
		};
		if (!this.encryptionEnabled) return await fail("Matrix encryption is disabled for this client");
		await this.ensureStartedForCryptoControlPlane();
		await this.ensureCryptoSupportInitialized();
		const crypto = this.client.getCrypto();
		if (!crypto) return await fail("Matrix crypto is not available (start client with encryption enabled)");
		const backupUsableBeforeStagedRecovery = resolveMatrixRoomKeyBackupReadinessError(await this.getRoomKeyBackupStatus(), { requireServerBackup: true }) === null;
		const trimmedRecoveryKey = rawRecoveryKey.trim();
		if (!trimmedRecoveryKey) return await fail("Matrix recovery key is required");
		let stagedKeyId;
		try {
			stagedKeyId = await this.resolveDefaultSecretStorageKeyId(crypto) ?? null;
			this.recoveryKeyStore.stageEncodedRecoveryKey({
				encodedPrivateKey: trimmedRecoveryKey,
				keyId: stagedKeyId
			});
		} catch (err) {
			return await fail(formatErrorMessage(err));
		}
		const storedRecoveryKeyMatches = this.recoveryKeyStore.getRecoveryKeySummary()?.encodedPrivateKey?.trim() === trimmedRecoveryKey;
		if (backupUsableBeforeStagedRecovery && storedRecoveryKeyMatches) {
			const status = await this.getOwnDeviceVerificationStatus();
			const backupUsable = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: true }) === null;
			const backupError = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: false });
			const recoveryKeyAccepted = backupUsable;
			if (!status.verified) {
				if (recoveryKeyAccepted) this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
				else this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: false,
					error: "Matrix recovery key was applied, but this device still lacks full Matrix identity trust. The recovery key can unlock usable backup material only when 'Backup usable' is yes; full identity trust still requires Matrix cross-signing verification.",
					...status
				};
			}
			if (backupError) {
				this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: true,
					error: backupError,
					...status
				};
			}
			this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
			return {
				success: true,
				recoveryKeyAccepted: true,
				backupUsable,
				deviceOwnerVerified: true,
				verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
				...status
			};
		}
		try {
			const cryptoBootstrapper = this.cryptoBootstrapper;
			if (!cryptoBootstrapper) return await fail("Matrix crypto bootstrapper is not available");
			await cryptoBootstrapper.bootstrap(crypto, { allowAutomaticCrossSigningReset: false });
			await this.enableTrustedRoomKeyBackupIfPossible(crypto);
			const status = await this.getOwnDeviceVerificationStatus();
			const backupError = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: false });
			const backupUsable = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: true }) === null;
			const stagedRecoveryKeyUsed = this.recoveryKeyStore.hasStagedRecoveryKeyBeenUsed();
			const secretStorageStatus = typeof crypto.getSecretStorageStatus === "function" ? await crypto.getSecretStorageStatus().catch(() => null) : null;
			const stagedRecoveryKeyConfirmedBySecretStorage = Boolean(stagedKeyId) && secretStorageStatus?.secretStorageKeyValidityMap?.[stagedKeyId ?? ""] === true;
			const stagedRecoveryKeyRejectedBySecretStorage = Boolean(stagedKeyId) && secretStorageStatus?.secretStorageKeyValidityMap?.[stagedKeyId ?? ""] === false;
			const stagedRecoveryKeyValidated = stagedRecoveryKeyUsed && (stagedRecoveryKeyConfirmedBySecretStorage || stagedRecoveryKeyUsed && !stagedRecoveryKeyRejectedBySecretStorage && !stagedRecoveryKeyConfirmedBySecretStorage && !backupUsableBeforeStagedRecovery && backupUsable) || storedRecoveryKeyMatches && backupUsable;
			const recoveryKeyAccepted = stagedRecoveryKeyValidated && (status.verified || backupUsable);
			if (!status.verified) {
				if (backupUsable && stagedRecoveryKeyValidated) this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
				else this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: false,
					error: "Matrix recovery key was applied, but this device still lacks full Matrix identity trust. The recovery key can unlock usable backup material only when 'Backup usable' is yes; full identity trust still requires Matrix cross-signing verification.",
					...recoveryKeyAccepted ? await this.getOwnDeviceVerificationStatus() : status
				};
			}
			if (backupError) {
				this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: true,
					error: backupError,
					...status
				};
			}
			if (!stagedRecoveryKeyValidated) {
				this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted: false,
					backupUsable,
					deviceOwnerVerified: true,
					error: "Matrix recovery key could not be verified against active Matrix backup material; existing backup may be usable from previously loaded recovery material.",
					...status
				};
			}
			this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
			const committedStatus = await this.getOwnDeviceVerificationStatus();
			return {
				success: true,
				recoveryKeyAccepted: true,
				backupUsable,
				deviceOwnerVerified: true,
				verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
				...committedStatus
			};
		} catch (err) {
			this.recoveryKeyStore.discardStagedRecoveryKey();
			return await fail(formatErrorMessage(err));
		}
	}
	async restoreRoomKeyBackup(params = {}) {
		let loadedFromSecretStorage = false;
		const fail = async (error) => {
			const backup = await this.getRoomKeyBackupStatus();
			return {
				success: false,
				error,
				backupVersion: backup.serverVersion,
				imported: 0,
				total: 0,
				loadedFromSecretStorage,
				backup
			};
		};
		if (!this.encryptionEnabled) return await fail("Matrix encryption is disabled for this client");
		await this.ensureStartedForCryptoControlPlane();
		const crypto = this.client.getCrypto();
		if (!crypto) return await fail("Matrix crypto is not available (start client with encryption enabled)");
		try {
			const rawRecoveryKey = params.recoveryKey?.trim();
			if (rawRecoveryKey) this.recoveryKeyStore.stageEncodedRecoveryKey({
				encodedPrivateKey: rawRecoveryKey,
				keyId: await this.resolveDefaultSecretStorageKeyId(crypto)
			});
			const backup = await this.getRoomKeyBackupStatus();
			loadedFromSecretStorage = backup.keyLoadAttempted && !backup.keyLoadError;
			const backupError = resolveMatrixRoomKeyBackupReadinessError(backup, {
				allowUntrustedMatchingKey: true,
				requireServerBackup: true
			});
			if (backupError) {
				this.recoveryKeyStore.discardStagedRecoveryKey();
				return await fail(backupError);
			}
			if (typeof crypto.restoreKeyBackup !== "function") {
				this.recoveryKeyStore.discardStagedRecoveryKey();
				return await fail("Matrix crypto backend does not support full key backup restore");
			}
			const restore = await crypto.restoreKeyBackup();
			if (rawRecoveryKey) this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: await this.resolveDefaultSecretStorageKeyId(crypto) });
			const finalBackup = await this.getRoomKeyBackupStatus();
			return {
				success: true,
				backupVersion: backup.serverVersion,
				imported: typeof restore.imported === "number" ? restore.imported : 0,
				total: typeof restore.total === "number" ? restore.total : 0,
				loadedFromSecretStorage,
				restoredAt: (/* @__PURE__ */ new Date()).toISOString(),
				backup: finalBackup
			};
		} catch (err) {
			this.recoveryKeyStore.discardStagedRecoveryKey();
			return await fail(formatErrorMessage(err));
		}
	}
	async resetRoomKeyBackup(options = {}) {
		let previousVersion = null;
		let deletedVersion = null;
		const fail = async (error) => {
			const backup = await this.getRoomKeyBackupStatus();
			return {
				success: false,
				error,
				previousVersion,
				deletedVersion,
				createdVersion: backup.serverVersion,
				backup
			};
		};
		if (!this.encryptionEnabled) return await fail("Matrix encryption is disabled for this client");
		await this.ensureStartedForCryptoControlPlane();
		const crypto = this.client.getCrypto();
		if (!crypto) return await fail("Matrix crypto is not available (start client with encryption enabled)");
		previousVersion = await this.resolveRoomKeyBackupVersion();
		const forceNewSecretStorage = options.rotateRecoveryKey === true || await this.shouldForceSecretStorageRecreationForBackupReset(crypto);
		try {
			if (previousVersion) {
				try {
					await this.doRequest("DELETE", `/_matrix/client/v3/room_keys/version/${encodeURIComponent(previousVersion)}`);
				} catch (err) {
					if (!isMatrixNotFoundError(err)) throw err;
				}
				deletedVersion = previousVersion;
			}
			await this.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, {
				setupNewKeyBackup: true,
				forceNewSecretStorage,
				forceNewRecoveryKey: options.rotateRecoveryKey === true,
				allowSecretStorageRecreateWithoutRecoveryKey: true
			});
			await this.enableTrustedRoomKeyBackupIfPossible(crypto);
			const backup = await this.getRoomKeyBackupStatus();
			const createdVersion = backup.serverVersion;
			if (!createdVersion) return await fail("Matrix room key backup is still missing after reset.");
			if (backup.activeVersion !== createdVersion) return await fail("Matrix room key backup was recreated on the server but is not active on this device.");
			if (backup.decryptionKeyCached === false) return await fail("Matrix room key backup was recreated but its decryption key is not cached on this device.");
			if (backup.matchesDecryptionKey === false) return await fail("Matrix room key backup was recreated but this device does not have the matching backup decryption key.");
			if (backup.trusted === false) return await fail("Matrix room key backup was recreated but is not trusted on this device.");
			return {
				success: true,
				previousVersion,
				deletedVersion,
				createdVersion,
				resetAt: (/* @__PURE__ */ new Date()).toISOString(),
				backup
			};
		} catch (err) {
			return await fail(formatErrorMessage(err));
		}
	}
	async getOwnCrossSigningPublicationStatus() {
		const userId = this.client.getUserId() ?? this.selfUserId ?? null;
		return await resolveMatrixCrossSigningPublicationStatus({
			userId,
			query: async () => await this.doRequest("POST", "/_matrix/client/v3/keys/query", void 0, { device_keys: userId ? { [userId]: [] } : {} })
		});
	}
	async bootstrapOwnDeviceVerification(params) {
		const pendingVerifications = async () => this.crypto ? (await this.crypto.listVerifications()).length : 0;
		if (!this.encryptionEnabled) return {
			success: false,
			error: "Matrix encryption is disabled for this client",
			verification: await this.getOwnDeviceVerificationStatus(),
			crossSigning: await this.getOwnCrossSigningPublicationStatus(),
			pendingVerifications: await pendingVerifications(),
			cryptoBootstrap: null
		};
		let bootstrapError;
		let bootstrapSummary = null;
		let rawRecoveryKey;
		try {
			await this.ensureStartedForCryptoControlPlane();
			await this.ensureCryptoSupportInitialized();
			const crypto = this.client.getCrypto();
			if (!crypto) throw new Error("Matrix crypto is not available (start client with encryption enabled)");
			rawRecoveryKey = params?.recoveryKey?.trim();
			if (rawRecoveryKey) this.recoveryKeyStore.stageEncodedRecoveryKey({
				encodedPrivateKey: rawRecoveryKey,
				keyId: await this.resolveDefaultSecretStorageKeyId(crypto)
			});
			const cryptoBootstrapper = this.cryptoBootstrapper;
			if (!cryptoBootstrapper) throw new Error("Matrix crypto bootstrapper is not available");
			bootstrapSummary = await cryptoBootstrapper.bootstrap(crypto, createMatrixExplicitBootstrapOptions({
				...params,
				allowAutomaticCrossSigningReset: rawRecoveryKey ? false : params?.allowAutomaticCrossSigningReset
			}));
			await this.ensureRoomKeyBackupEnabled(crypto);
		} catch (err) {
			this.recoveryKeyStore.discardStagedRecoveryKey();
			bootstrapError = formatErrorMessage(err);
		}
		const verification = await this.getOwnDeviceVerificationStatus();
		const crossSigning = await this.getOwnCrossSigningPublicationStatus();
		const verificationError = verification.verified && crossSigning.published ? null : bootstrapError ?? "Matrix verification bootstrap did not produce a device verified by its owner with published cross-signing keys";
		const backupError = verificationError === null ? resolveMatrixRoomKeyBackupReadinessError(verification.backup, {
			allowUntrustedMatchingKey: Boolean(rawRecoveryKey),
			requireServerBackup: true
		}) : null;
		const success = verificationError === null && backupError === null;
		if (success) this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: await this.resolveDefaultSecretStorageKeyId(this.client.getCrypto()) });
		else this.recoveryKeyStore.discardStagedRecoveryKey();
		return {
			success,
			error: success ? void 0 : backupError ?? verificationError ?? void 0,
			verification: success ? await this.getOwnDeviceVerificationStatus() : verification,
			crossSigning,
			pendingVerifications: await pendingVerifications(),
			cryptoBootstrap: bootstrapSummary
		};
	}
	async listOwnDevices() {
		return await listMatrixOwnDevices(this.client);
	}
	async deleteOwnDevices(deviceIds) {
		const uniqueDeviceIds = uniqueStrings(normalizeStringEntries(deviceIds));
		const currentDeviceId = this.client.getDeviceId()?.trim() || null;
		const protectedDeviceIds = uniqueDeviceIds.filter((deviceId) => deviceId === currentDeviceId);
		if (protectedDeviceIds.length > 0) throw new Error(`Refusing to delete the current Matrix device: ${protectedDeviceIds[0]}`);
		const deleteWithAuth = async (authData) => {
			await this.client.deleteMultipleDevices(uniqueDeviceIds, authData);
		};
		if (uniqueDeviceIds.length > 0) try {
			await deleteWithAuth();
		} catch (err) {
			const session = err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "session" in err.data && typeof err.data.session === "string" ? err.data.session : null;
			const userId = await this.getUserId().catch(() => this.selfUserId);
			if (!session || !userId || !this.password?.trim()) throw err;
			await deleteWithAuth({
				type: "m.login.password",
				session,
				identifier: {
					type: "m.id.user",
					user: userId
				},
				password: this.password
			});
		}
		return {
			currentDeviceId,
			deletedDeviceIds: uniqueDeviceIds,
			remainingDevices: await this.listOwnDevices()
		};
	}
	registerBridge() {
		const decryptBridge = this.decryptBridge;
		if (this.bridgeRegistered || !decryptBridge) return;
		this.bridgeRegistered = true;
		registerMatrixClientBridge({
			client: this.client,
			decryptBridge,
			emitter: this.emitter,
			emitMembershipForRoom: (room) => this.emitMembershipForRoom(room),
			getSelfUserId: () => this.client.getUserId() ?? this.selfUserId ?? "",
			setCurrentSyncState: (state, error) => {
				this.currentSyncState = state;
				this.currentSyncError = error;
			}
		});
	}
	emitMembershipForRoom(room) {
		emitMatrixMembershipForRoom({
			client: this.client,
			emitter: this.emitter,
			room,
			selfUserId: this.client.getUserId() ?? this.selfUserId ?? ""
		});
	}
	emitOutstandingInviteEvents() {
		for (const room of this.client.getRooms()) this.emitMembershipForRoom(room);
	}
	async refreshDmCache() {
		return refreshMatrixDmRoomIds(await this.getAccountData("m.direct"), this.dmRoomIds);
	}
};
//#endregion
export { ConsoleLogger, LogService, MatrixClient };
