import "./plugin-entry-bE5OaTNY.js";
import { n as OpenClawConfig } from "./types.openclaw-D3Ap19Na.js";
import "./config-contracts-yQGnmAhr.js";
import { n as PinnedDispatcherPolicy, r as SsrFPolicy } from "./ssrf-Ck7fh8Hg.js";
import "./fetch-guard-DGXnImO0.js";
import "./ssrf-dispatcher-BhUs6Wr8.js";
import "./plugin-state-runtime-B2sLDTQY.js";
import { t as MatrixThreadBindingManager } from "./thread-bindings-shared-BjDZcxPp.js";
import { z } from "zod";
import { IFilterDefinition, IStoredClientOpts, ISyncData, ISyncResponse, MatrixClient, MatrixEvent, MemoryStore } from "matrix-js-sdk/lib/matrix.js";
import * as MatrixSdkTypes from "matrix-js-sdk/lib/types.js";
import { Direction } from "matrix-js-sdk/lib/models/event-timeline.js";
import { EventEmitter } from "node:events";
//#region src/plugin-sdk/keyed-async-queue.d.ts
/** Optional lifecycle hooks fired around each queued task. */
type KeyedAsyncQueueHooks = {
  onEnqueue?: () => void;
  onSettle?: () => void;
};
/** Small per-key async queue wrapper for plugin runtimes that need serialized work. */
declare class KeyedAsyncQueue {
  private readonly tails;
  /**
   * @deprecated Retained for shipped Plugin SDK compatibility. New callers must
   * not depend on queue storage; remove in a declared Plugin SDK breaking window.
   */
  getTailMapForTesting(): Map<string, Promise<void>>;
  enqueue<T>(key: string, task: () => Promise<T>, hooks?: KeyedAsyncQueueHooks): Promise<T>;
}
//#endregion
//#region extensions/matrix/src/matrix/client/types.d.ts
/**
 * Authenticated Matrix configuration.
 * Note: deviceId is NOT included here because it's implicit in the accessToken.
 * Matrix storage reuses the most complete account-scoped root it can find for the
 * same homeserver/user/account tuple so token refreshes do not strand prior state.
 * If the device identity itself changes or crypto storage is lost, crypto state may
 * still need to be recreated together with the new access token.
 */
type MatrixAuth = {
  accountId: string;
  homeserver: string;
  userId: string;
  accessToken: string;
  password?: string;
  deviceId?: string;
  deviceName?: string;
  initialSyncLimit?: number;
  encryption?: boolean;
  allowPrivateNetwork?: boolean;
  ssrfPolicy?: SsrFPolicy;
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/decrypt-bridge.d.ts
type MatrixDecryptIfNeededClient = {
  decryptEventIfNeeded?: (event: MatrixEvent, opts?: {
    isRetry?: boolean;
  }) => Promise<void>;
  getCrypto?: () => unknown;
};
type DecryptBridgeRawEvent = {
  event_id: string;
};
type MatrixCryptoRetrySignalSource = {
  on: (eventName: string, listener: (...args: unknown[]) => void) => void;
};
declare class MatrixDecryptBridge<TRawEvent extends DecryptBridgeRawEvent> {
  private readonly deps;
  private readonly trackedEncryptedEvents;
  private readonly pendingSdkDecryptions;
  private readonly decryptedMessageDedupe;
  private readonly decryptRetries;
  private readonly failedDecryptionsNotified;
  private readonly exhaustedDecryptRetries;
  private activeRetryRuns;
  private readonly retryIdleResolvers;
  private cryptoRetrySignalsBound;
  private quiescing;
  private stopped;
  constructor(deps: {
    client: MatrixDecryptIfNeededClient;
    toRaw: (event: MatrixEvent) => TRawEvent;
    emitDecryptedEvent: (roomId: string, event: TRawEvent) => void;
    emitMessage: (roomId: string, event: TRawEvent) => void;
    emitFailedDecryption: (roomId: string, event: TRawEvent, error: Error) => void;
  });
  shouldEmitUnencryptedMessage(roomId: string, eventId: string): boolean;
  attachEncryptedEvent(event: MatrixEvent, roomId: string): void;
  retryPendingNow(reason: string, options?: {
    includeExhausted?: boolean;
  }): void;
  bindCryptoRetrySignals(crypto: MatrixCryptoRetrySignalSource | undefined): void;
  stop(): void;
  drainPendingDecryptions(_reason: string): Promise<void>;
  private handleEncryptedEventDecrypted;
  private emitFailedDecryptionOnce;
  private scheduleDecryptRetry;
  private runDecryptRetry;
  private clearDecryptRetry;
  private pruneExhaustedDecryptRetries;
  private rememberDecryptedMessage;
  private pruneDecryptedMessageDedupe;
  private waitForActiveRetryRunsToFinish;
  private resolveRetryIdleIfNeeded;
}
//#endregion
//#region extensions/matrix/src/matrix/sync-state.d.ts
type MatrixSyncState = "PREPARED" | "SYNCING" | "CATCHUP" | "RECONNECTING" | "ERROR" | "STOPPED" | (string & {});
//#endregion
//#region extensions/matrix/src/matrix/sdk/verification-manager.d.ts
type MatrixVerificationMethod = "sas" | "show-qr" | "scan-qr";
type MatrixVerificationSummary = {
  id: string;
  transactionId?: string;
  roomId?: string;
  otherUserId: string;
  otherDeviceId?: string;
  isSelfVerification: boolean;
  initiatedByMe: boolean;
  phase: number;
  phaseName: string;
  pending: boolean;
  methods: string[];
  chosenMethod?: string | null;
  canAccept: boolean;
  hasSas: boolean;
  sas?: {
    decimal?: [number, number, number];
    emoji?: Array<[string, string]>;
  };
  hasReciprocateQr: boolean;
  completed: boolean;
  error?: string;
  createdAt: string;
  updatedAt: string;
};
type MatrixVerificationSummaryListener = (summary: MatrixVerificationSummary) => void;
type MatrixVerificationOwnerTrustCallback = (deviceId: string) => Promise<void>;
type MatrixShowSasCallbacks = {
  sas: {
    decimal?: [number, number, number];
    emoji?: Array<[string, string]>;
  };
  confirm: () => Promise<void>;
  mismatch: () => void;
  cancel: () => void;
};
type MatrixShowQrCodeCallbacks = {
  confirm: () => void;
  cancel: () => void;
};
type MatrixVerifierLike = {
  verify: () => Promise<void>;
  cancel: (e: Error) => void;
  getShowSasCallbacks: () => MatrixShowSasCallbacks | null;
  getReciprocateQrCodeCallbacks: () => MatrixShowQrCodeCallbacks | null;
  on: (eventName: string, listener: (...args: unknown[]) => void) => void;
};
type MatrixVerificationRequestLike = {
  transactionId?: string;
  roomId?: string;
  initiatedByMe: boolean;
  otherUserId: string;
  otherDeviceId?: string;
  isSelfVerification: boolean;
  phase: number;
  pending: boolean;
  accepting: boolean;
  declining: boolean;
  methods: string[];
  chosenMethod?: string | null;
  cancellationCode?: string | null;
  accept: () => Promise<void>;
  cancel: (params?: {
    reason?: string;
    code?: string;
  }) => Promise<void>;
  startVerification: (method: string) => Promise<MatrixVerifierLike>;
  scanQRCode: (qrCodeData: Uint8ClampedArray) => Promise<MatrixVerifierLike>;
  generateQRCode: () => Promise<Uint8ClampedArray | undefined>;
  verifier?: MatrixVerifierLike;
  on: (eventName: string, listener: (...args: unknown[]) => void) => void;
};
type MatrixVerificationCryptoApi = {
  requestOwnUserVerification: () => Promise<MatrixVerificationRequestLike | null>;
  getVerificationRequestsToDeviceInProgress?: (userId: string) => MatrixVerificationRequestLike[];
  findVerificationRequestDMInProgress?: (roomId: string, userId: string) => MatrixVerificationRequestLike | undefined;
  requestDeviceVerification?: (userId: string, deviceId: string) => Promise<MatrixVerificationRequestLike>;
  requestVerificationDM?: (userId: string, roomId: string) => Promise<MatrixVerificationRequestLike>;
};
declare class MatrixVerificationManager {
  private readonly opts;
  private readonly verificationSessions;
  private verificationSessionCounter;
  private readonly trackedVerificationRequests;
  private readonly trackedVerificationVerifiers;
  private readonly summaryListeners;
  constructor(opts?: {
    trustOwnDeviceAfterSas?: MatrixVerificationOwnerTrustCallback;
  });
  private readRequestValue;
  private readVerificationPhase;
  private readVerificationRequestIdentity;
  private isSameLogicalVerificationRequest;
  private isSameOptionalIdentityValue;
  private pruneVerificationSessions;
  private getVerificationPhaseName;
  private emitVerificationSummary;
  private touchVerificationSession;
  private clearSasAutoConfirmTimer;
  private buildVerificationSummary;
  private findVerificationSession;
  private ensureVerificationRequestTracked;
  private maybeAutoAcceptInboundRequest;
  private maybeAutoStartInboundSas;
  private attachVerifierToVerificationSession;
  private maybeAutoConfirmSas;
  private confirmSasForSession;
  private ensureVerificationStarted;
  private trustOwnDeviceAfterConfirmedSas;
  onSummaryChanged(listener: MatrixVerificationSummaryListener): () => void;
  trackVerificationRequest(request: MatrixVerificationRequestLike): MatrixVerificationSummary;
  requestOwnUserVerification(crypto: MatrixVerificationCryptoApi | undefined): Promise<MatrixVerificationSummary | null>;
  listVerifications(): MatrixVerificationSummary[];
  requestVerification(crypto: MatrixVerificationCryptoApi | undefined, params: {
    ownUser?: boolean;
    userId?: string;
    deviceId?: string;
    roomId?: string;
  }): Promise<MatrixVerificationSummary>;
  acceptVerification(id: string): Promise<MatrixVerificationSummary>;
  cancelVerification(id: string, params?: {
    reason?: string;
    code?: string;
  }): Promise<MatrixVerificationSummary>;
  startVerification(id: string, method?: MatrixVerificationMethod): Promise<MatrixVerificationSummary>;
  generateVerificationQr(id: string): Promise<{
    qrDataBase64: string;
  }>;
  scanVerificationQr(id: string, qrDataBase64: string): Promise<MatrixVerificationSummary>;
  confirmVerificationSas(id: string): Promise<MatrixVerificationSummary>;
  mismatchVerificationSas(id: string): MatrixVerificationSummary;
  confirmVerificationReciprocateQr(id: string): MatrixVerificationSummary;
  getVerificationSas(id: string): {
    decimal?: [number, number, number];
    emoji?: Array<[string, string]>;
  };
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/types.d.ts
type MatrixRawEvent = {
  event_id: string;
  sender: string;
  type: string;
  origin_server_ts: number;
  content: Record<string, unknown>;
  unsigned?: {
    age?: number;
    "m.relations"?: Record<string, unknown>;
    redacted_because?: unknown;
  };
  state_key?: string;
};
type MatrixRelationsPage = {
  originalEvent?: MatrixRawEvent | null;
  events: MatrixRawEvent[];
  nextBatch?: string | null;
  prevBatch?: string | null;
};
type MatrixClientEventMap = {
  "room.event": [roomId: string, event: MatrixRawEvent];
  "room.message": [roomId: string, event: MatrixRawEvent];
  "room.encrypted_event": [roomId: string, event: MatrixRawEvent];
  "room.decrypted_event": [roomId: string, event: MatrixRawEvent];
  "room.failed_decryption": [roomId: string, event: MatrixRawEvent, error: Error];
  "room.invite": [roomId: string, event: MatrixRawEvent];
  "room.join": [roomId: string, event: MatrixRawEvent];
  "sync.state": [state: MatrixSyncState, prevState: string | null, error?: unknown];
  "sync.unexpected_error": [error: Error];
  "verification.summary": [summary: MatrixVerificationSummary];
};
type EncryptedFile = MatrixSdkTypes.EncryptedFile;
type MessageEventContent = {
  msgtype?: string;
  body?: string;
  format?: string;
  formatted_body?: string;
  filename?: string;
  url?: string;
  file?: EncryptedFile;
  info?: MatrixSdkTypes.MediaEventInfo | Record<string, unknown>;
  "m.relates_to"?: Record<string, unknown>;
  "m.new_content"?: unknown;
  "m.mentions"?: {
    user_ids?: string[];
    room?: boolean;
  };
  [key: string]: unknown;
};
type MatrixSecretStorageStatus = {
  ready: boolean;
  defaultKeyId: string | null;
  secretStorageKeyValidityMap?: Record<string, boolean>;
};
type MatrixGeneratedSecretStorageKey = {
  keyId?: string | null;
  keyInfo?: {
    passphrase?: unknown;
    name?: string;
  };
  privateKey: Uint8Array;
  encodedPrivateKey?: string;
};
type MatrixDeviceVerificationStatusLike = {
  isVerified?: () => boolean;
  localVerified?: boolean;
  crossSigningVerified?: boolean;
  signedByOwner?: boolean;
};
type MatrixKeyBackupInfo = {
  algorithm: string;
  auth_data: Record<string, unknown>;
  count?: number;
  etag?: string;
  version?: string;
};
type MatrixKeyBackupTrustInfo = {
  trusted: boolean;
  matchesDecryptionKey: boolean;
};
type MatrixRoomKeyBackupRestoreResult$1 = {
  total: number;
  imported: number;
};
type MatrixImportRoomKeyProgress = {
  stage: string;
  successes?: number;
  failures?: number;
  total?: number;
};
type MatrixSecretStorageKeyDescription = {
  passphrase?: unknown;
  name?: string;
  [key: string]: unknown;
};
type MatrixCryptoCallbacks = {
  getSecretStorageKey?: (params: {
    keys: Record<string, MatrixSecretStorageKeyDescription>;
  }, name: string) => Promise<[string, Uint8Array] | null>;
  cacheSecretStorageKey?: (keyId: string, keyInfo: MatrixSecretStorageKeyDescription, key: Uint8Array) => void;
};
type MatrixStoredRecoveryKey = {
  version: 1;
  createdAt: string;
  keyId?: string | null;
  encodedPrivateKey?: string;
  privateKeyBase64: string;
  keyInfo?: {
    passphrase?: unknown;
    name?: string;
  };
};
type MatrixAuthDict = Record<string, unknown>;
type MatrixUiAuthCallback = <T>(makeRequest: (authData: MatrixAuthDict | null) => Promise<T>) => Promise<T>;
type MatrixCryptoBootstrapApi = {
  on: (eventName: string, listener: (...args: unknown[]) => void) => void;
  bootstrapCrossSigning: (opts: {
    setupNewCrossSigning?: boolean;
    authUploadDeviceSigningKeys?: MatrixUiAuthCallback;
  }) => Promise<void>;
  bootstrapSecretStorage: (opts?: {
    createSecretStorageKey?: () => Promise<MatrixGeneratedSecretStorageKey>;
    setupNewSecretStorage?: boolean;
    setupNewKeyBackup?: boolean;
  }) => Promise<void>;
  createRecoveryKeyFromPassphrase?: (password?: string) => Promise<MatrixGeneratedSecretStorageKey>;
  getSecretStorageStatus?: () => Promise<MatrixSecretStorageStatus>;
  requestOwnUserVerification: () => Promise<MatrixVerificationRequestLike | null>;
  findVerificationRequestDMInProgress?: (roomId: string, userId: string) => MatrixVerificationRequestLike | undefined;
  requestDeviceVerification?: (userId: string, deviceId: string) => Promise<MatrixVerificationRequestLike>;
  requestVerificationDM?: (userId: string, roomId: string) => Promise<MatrixVerificationRequestLike>;
  getDeviceVerificationStatus?: (userId: string, deviceId: string) => Promise<MatrixDeviceVerificationStatusLike | null>;
  getSessionBackupPrivateKey?: () => Promise<Uint8Array | null>;
  loadSessionBackupPrivateKeyFromSecretStorage?: () => Promise<void>;
  getActiveSessionBackupVersion?: () => Promise<string | null>;
  getKeyBackupInfo?: () => Promise<MatrixKeyBackupInfo | null>;
  isKeyBackupTrusted?: (info: MatrixKeyBackupInfo) => Promise<MatrixKeyBackupTrustInfo>;
  checkKeyBackupAndEnable?: () => Promise<unknown>;
  restoreKeyBackup?: (opts?: {
    progressCallback?: (progress: MatrixImportRoomKeyProgress) => void;
  }) => Promise<MatrixRoomKeyBackupRestoreResult$1>;
  setDeviceVerified?: (userId: string, deviceId: string, verified?: boolean) => Promise<void>;
  crossSignDevice?: (deviceId: string) => Promise<void>;
  getOwnIdentity?: () => Promise<{
    free?: () => void;
    isVerified?: () => boolean;
    verify?: () => Promise<unknown>;
  } | undefined>;
  isCrossSigningReady?: () => Promise<boolean>;
  userHasCrossSigningKeys?: (userId?: string, downloadUncached?: boolean) => Promise<boolean>;
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/recovery-key-store.d.ts
declare class MatrixRecoveryKeyStore {
  private readonly secretStorageKeyCache;
  private stagedRecoveryKey;
  private stagedRecoveryKeyUsed;
  private readonly stagedCacheKeyIds;
  private readonly storageRootDir?;
  private readonly recoveryKeyPath?;
  private legacyRecoveryKeyPathOnMigrationFailure?;
  constructor(recoveryKeyPath?: string);
  buildCryptoCallbacks(): MatrixCryptoCallbacks;
  getRecoveryKeySummary(): {
    encodedPrivateKey?: string;
    keyId?: string | null;
    createdAt?: string;
  } | null;
  getSecretStorageKeyCandidate(keyId: string): Uint8Array | null;
  private resolveEncodedRecoveryKeyInput;
  storeEncodedRecoveryKey(params: {
    encodedPrivateKey: string;
    keyId?: string | null;
    keyInfo?: MatrixStoredRecoveryKey["keyInfo"];
  }): {
    encodedPrivateKey?: string;
    keyId?: string | null;
    createdAt?: string;
  };
  stageEncodedRecoveryKey(params: {
    encodedPrivateKey: string;
    keyId?: string | null;
    keyInfo?: MatrixStoredRecoveryKey["keyInfo"];
  }): void;
  hasStagedRecoveryKeyBeenUsed(): boolean;
  commitStagedRecoveryKey(params?: {
    keyId?: string | null;
    keyInfo?: MatrixStoredRecoveryKey["keyInfo"];
  }): {
    encodedPrivateKey?: string;
    keyId?: string | null;
    createdAt?: string;
  } | null;
  discardStagedRecoveryKey(): void;
  bootstrapSecretStorageWithRecoveryKey(crypto: MatrixCryptoBootstrapApi, options?: {
    setupNewKeyBackup?: boolean;
    allowSecretStorageRecreateWithoutRecoveryKey?: boolean;
    forceNewSecretStorage?: boolean;
    forceNewRecoveryKey?: boolean;
  }): Promise<void>;
  private clearStagedRecoveryKeyTracking;
  private resolveStagedSecretStorageKey;
  private rememberStagedSecretStorageKey;
  private rememberSecretStorageKey;
  private loadStoredRecoveryKey;
  private saveRecoveryKeyToDisk;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-bootstrap.d.ts
type MatrixCryptoBootstrapperDeps<TRawEvent extends MatrixRawEvent> = {
  getUserId: () => Promise<string>;
  getPassword?: () => string | undefined;
  canUnlockSecretStorage: () => Promise<boolean>;
  getDeviceId: () => string | null | undefined;
  verificationManager: MatrixVerificationManager;
  recoveryKeyStore: MatrixRecoveryKeyStore;
  decryptBridge: Pick<MatrixDecryptBridge<TRawEvent>, "bindCryptoRetrySignals">;
};
type MatrixCryptoBootstrapOptions = {
  forceResetCrossSigning?: boolean;
  allowAutomaticCrossSigningReset?: boolean;
  allowSecretStorageRecreateWithoutRecoveryKey?: boolean;
  strict?: boolean;
};
type MatrixCryptoBootstrapResult = {
  crossSigningReady: boolean;
  crossSigningPublished: boolean;
  ownDeviceVerified: boolean | null;
};
declare class MatrixCryptoBootstrapper<TRawEvent extends MatrixRawEvent> {
  private readonly deps;
  private verificationHandlerRegistered;
  constructor(deps: MatrixCryptoBootstrapperDeps<TRawEvent>);
  bootstrap(crypto: MatrixCryptoBootstrapApi, options?: MatrixCryptoBootstrapOptions): Promise<MatrixCryptoBootstrapResult>;
  private createSigningKeysUiAuthCallback;
  private bootstrapCrossSigning;
  private trustFreshOwnIdentity;
  private bootstrapSecretStorage;
  private registerVerificationRequestHandler;
  private ensureOwnDeviceTrust;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-support.d.ts
type MatrixOwnDeviceVerificationStatus = {
  encryptionEnabled: boolean;
  userId: string | null;
  deviceId: string | null;
  verified: boolean;
  localVerified: boolean;
  crossSigningVerified: boolean;
  signedByOwner: boolean;
  recoveryKeyStored: boolean;
  recoveryKeyCreatedAt: string | null;
  recoveryKeyId: string | null;
  backupVersion: string | null;
  backup: MatrixRoomKeyBackupStatus;
  serverDeviceKnown: boolean | null;
};
type MatrixDeviceVerificationStatus = {
  encryptionEnabled: boolean;
  userId: string | null;
  deviceId: string | null;
  verified: boolean;
  localVerified: boolean;
  crossSigningVerified: boolean;
  signedByOwner: boolean;
};
type MatrixRoomKeyBackupStatus = {
  serverVersion: string | null;
  activeVersion: string | null;
  trusted: boolean | null;
  matchesDecryptionKey: boolean | null;
  decryptionKeyCached: boolean | null;
  keyLoadAttempted: boolean;
  keyLoadError: string | null;
};
type MatrixRoomKeyBackupRestoreResult = {
  success: boolean;
  error?: string;
  backupVersion: string | null;
  imported: number;
  total: number;
  loadedFromSecretStorage: boolean;
  restoredAt?: string;
  backup: MatrixRoomKeyBackupStatus;
};
type MatrixRoomKeyBackupResetResult = {
  success: boolean;
  error?: string;
  previousVersion: string | null;
  deletedVersion: string | null;
  createdVersion: string | null;
  resetAt?: string;
  backup: MatrixRoomKeyBackupStatus;
};
type MatrixRecoveryKeyVerificationResult = MatrixOwnDeviceVerificationStatus & {
  success: boolean;
  recoveryKeyAccepted: boolean;
  backupUsable: boolean;
  deviceOwnerVerified: boolean;
  verifiedAt?: string;
  error?: string;
};
type MatrixOwnCrossSigningPublicationStatus = {
  userId: string | null;
  masterKeyPublished: boolean;
  selfSigningKeyPublished: boolean;
  userSigningKeyPublished: boolean;
  published: boolean;
};
type MatrixVerificationBootstrapResult = {
  success: boolean;
  error?: string;
  verification: MatrixOwnDeviceVerificationStatus;
  crossSigning: MatrixOwnCrossSigningPublicationStatus;
  pendingVerifications: number;
  cryptoBootstrap: MatrixCryptoBootstrapResult | null;
};
type MatrixOwnDeviceInfo = {
  deviceId: string;
  displayName: string | null;
  lastSeenIp: string | null;
  lastSeenTs: number | null;
  current: boolean;
};
type MatrixRoomKeyBackupResetOptions = {
  rotateRecoveryKey?: boolean;
};
type MatrixOwnDeviceDeleteResult = {
  currentDeviceId: string | null;
  deletedDeviceIds: string[];
  remainingDevices: MatrixOwnDeviceInfo[];
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-facade.d.ts
type MatrixCryptoFacade = {
  prepare: (joinedRooms: string[]) => Promise<void>;
  updateSyncData: (toDeviceMessages: unknown, otkCounts: unknown, unusedFallbackKeyAlgs: unknown, changedDeviceLists: unknown, leftDeviceLists: unknown) => Promise<void>;
  isRoomEncrypted: (roomId: string) => Promise<boolean>;
  requestOwnUserVerification: () => Promise<MatrixVerificationSummary | null>;
  encryptMedia: (buffer: Buffer) => Promise<{
    buffer: Buffer;
    file: Omit<EncryptedFile, "url">;
  }>;
  decryptMedia: (file: EncryptedFile, opts?: {
    maxBytes?: number;
    readIdleTimeoutMs?: number;
  }) => Promise<Buffer>;
  getRecoveryKey: () => Promise<{
    encodedPrivateKey?: string;
    keyId?: string | null;
    createdAt?: string;
  } | null>;
  listVerifications: () => Promise<MatrixVerificationSummary[]>;
  ensureVerificationDmTracked: (params: {
    roomId: string;
    userId: string;
  }) => Promise<MatrixVerificationSummary | null>;
  requestVerification: (params: {
    ownUser?: boolean;
    userId?: string;
    deviceId?: string;
    roomId?: string;
  }) => Promise<MatrixVerificationSummary>;
  acceptVerification: (id: string) => Promise<MatrixVerificationSummary>;
  cancelVerification: (id: string, params?: {
    reason?: string;
    code?: string;
  }) => Promise<MatrixVerificationSummary>;
  startVerification: (id: string, method?: MatrixVerificationMethod) => Promise<MatrixVerificationSummary>;
  generateVerificationQr: (id: string) => Promise<{
    qrDataBase64: string;
  }>;
  scanVerificationQr: (id: string, qrDataBase64: string) => Promise<MatrixVerificationSummary>;
  confirmVerificationSas: (id: string) => Promise<MatrixVerificationSummary>;
  mismatchVerificationSas: (id: string) => Promise<MatrixVerificationSummary>;
  confirmVerificationReciprocateQr: (id: string) => Promise<MatrixVerificationSummary>;
  getVerificationSas: (id: string) => Promise<{
    decimal?: [number, number, number];
    emoji?: Array<[string, string]>;
  }>;
};
//#endregion
//#region extensions/matrix/src/matrix/client/file-sync-store.d.ts
declare class SqliteBackedMatrixSyncStore extends MemoryStore {
  private readonly storageRootDir;
  private readonly persistLock;
  private readonly accumulator;
  private readonly stateKey;
  private readonly store;
  private readonly storeUnavailableError;
  private savedSync;
  private savedClientOptions;
  private readonly hadSavedSyncOnLoad;
  private readonly hadCleanShutdownOnLoad;
  private cleanShutdown;
  private dirty;
  private frozen;
  private persistTimer;
  private persistPromise;
  constructor(storageRootDir: string);
  hasSavedSync(): boolean;
  hasSavedSyncFromCleanShutdown(): boolean;
  getSavedSync(): Promise<ISyncData | null>;
  getSavedSyncToken(): Promise<string | null>;
  setSyncData(syncData: ISyncResponse): Promise<void>;
  getClientOptions(): Promise<IStoredClientOpts | undefined>;
  storeClientOptions(options: IStoredClientOpts): Promise<void>;
  save(force?: boolean): Promise<void>;
  wantsSave(): boolean;
  deleteAllData(): Promise<void>;
  markCleanShutdown(): void;
  freezeSyncCursorPersistence(): Promise<void>;
  discardPendingSyncCursorPersistence(): void;
  flush(): Promise<void>;
  private markDirtyAndSchedulePersist;
  private persist;
  private writePersistedStore;
  private assertStoreAvailable;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/transport.d.ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type QueryValue = string | number | boolean | null | undefined | Array<string | number | boolean | null | undefined>;
type QueryParams = Record<string, QueryValue> | null | undefined;
//#endregion
//#region extensions/matrix/src/matrix/sdk/http-client.d.ts
type MatrixAuthedHttpClientParams = {
  homeserver: string;
  accessToken: string;
  ssrfPolicy?: SsrFPolicy;
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
declare class MatrixAuthedHttpClient {
  private readonly homeserver;
  private readonly accessToken;
  private readonly ssrfPolicy?;
  private readonly dispatcherPolicy?;
  constructor(params: MatrixAuthedHttpClientParams);
  requestJson(params: {
    method: HttpMethod;
    endpoint: string;
    qs?: QueryParams;
    body?: unknown;
    timeoutMs: number;
    allowAbsoluteEndpoint?: boolean;
  }): Promise<unknown>;
  requestRaw(params: {
    method: HttpMethod;
    endpoint: string;
    qs?: QueryParams;
    timeoutMs: number;
    maxBytes?: number;
    readIdleTimeoutMs?: number;
    allowAbsoluteEndpoint?: boolean;
  }): Promise<Buffer>;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-base.d.ts
type MatrixMessageWireDispatch = {
  roomId: string;
  eventType: "m.room.message" | "m.room.encrypted";
  transactionId: string;
  requestPath: string;
};
type MatrixMessageWireDispatchGuard = (dispatch: MatrixMessageWireDispatch) => Promise<void>;
declare abstract class MatrixClientBase {
  abstract getUserId(): Promise<string>;
  abstract getJoinedRooms(): Promise<string[]>;
  abstract listOwnDevices(): Promise<MatrixOwnDeviceInfo[]>;
  abstract getOwnDeviceVerificationStatus(): Promise<MatrixOwnDeviceVerificationStatus>;
  abstract getRoomStateEvent(roomId: string, eventType: string, stateKey?: string): Promise<Record<string, unknown>>;
  abstract getMessageWireEventType(roomId: string): Promise<"m.room.message" | "m.room.encrypted">;
  abstract downloadContent(mxcUrl: string, opts?: {
    allowRemote?: boolean;
    maxBytes?: number;
    readIdleTimeoutMs?: number;
  }): Promise<Buffer>;
  protected abstract registerBridge(): void;
  protected abstract emitOutstandingInviteEvents(): void;
  protected abstract refreshDmCache(): Promise<boolean>;
  protected readonly client: MatrixClient;
  protected readonly emitter: EventEmitter<any>;
  protected readonly httpClient: MatrixAuthedHttpClient;
  protected readonly localTimeoutMs: number;
  protected readonly initialSyncLimit?: number;
  protected readonly syncFilter?: IFilterDefinition;
  protected readonly encryptionEnabled: boolean;
  protected readonly password?: string;
  protected readonly syncStore?: SqliteBackedMatrixSyncStore;
  protected readonly idbSnapshotPath?: string;
  protected readonly cryptoDatabasePrefix?: string;
  protected bridgeRegistered: boolean;
  protected started: boolean;
  protected cryptoBootstrapped: boolean;
  protected selfUserId: string | null;
  protected readonly dmRoomIds: Set<string>;
  protected cryptoInitialized: boolean;
  protected decryptBridge?: MatrixDecryptBridge<MatrixRawEvent>;
  protected verificationManager?: MatrixVerificationManager;
  protected readonly sendQueue: KeyedAsyncQueue;
  protected readonly recoveryKeyStore: MatrixRecoveryKeyStore;
  protected cryptoBootstrapper?: MatrixCryptoBootstrapper<MatrixRawEvent> | undefined;
  protected readonly autoBootstrapCrypto: boolean;
  protected syncQuiescePromise: Promise<void> | null;
  protected stopPersistPromise: Promise<void> | null;
  protected verificationSummaryListenerBound: boolean;
  protected currentSyncState: MatrixSyncState | null;
  protected currentSyncError: unknown;
  protected readonly transactionScopeHomeserver: string;
  protected readonly transactionScopeAccessTokenHash: string;
  protected transactionScopeDeviceId: string | null;
  protected transactionScopeId: string | null;
  protected transactionScopePromise: Promise<string> | null;
  private readonly messageWireDispatchGuards;
  private sdkStopped;
  private stopDiscardPromise;
  private idbPersistPromise;
  private idbPersistAbortController;
  readonly dms: {
    update: () => Promise<boolean>;
    isDm: (roomId: string) => boolean;
  };
  crypto?: MatrixCryptoFacade;
  constructor(homeserver: string, accessToken: string, opts?: {
    userId?: string;
    password?: string;
    deviceId?: string;
    localTimeoutMs?: number;
    encryption?: boolean;
    initialSyncLimit?: number;
    syncFilter?: IFilterDefinition;
    storageRootDir?: string;
    recoveryKeyPath?: string;
    idbSnapshotPath?: string;
    cryptoDatabasePrefix?: string;
    autoBootstrapCrypto?: boolean;
    ssrfPolicy?: SsrFPolicy;
    dispatcherPolicy?: PinnedDispatcherPolicy;
  });
  protected withMessageWireDispatchGuard<T>(params: {
    transactionId?: string;
    guard?: MatrixMessageWireDispatchGuard;
    run: () => Promise<T>;
  }): Promise<T>;
  on<TEvent extends keyof MatrixClientEventMap>(eventName: TEvent, listener: (...args: MatrixClientEventMap[TEvent]) => void): this;
  on(eventName: string, listener: (...args: unknown[]) => void): this;
  off<TEvent extends keyof MatrixClientEventMap>(eventName: TEvent, listener: (...args: MatrixClientEventMap[TEvent]) => void): this;
  off(eventName: string, listener: (...args: unknown[]) => void): this;
  protected idbPersistTimer: ReturnType<typeof setInterval> | null;
  protected ensureCryptoSupportInitialized(): Promise<void>;
  start(opts?: {
    abortSignal?: AbortSignal;
    readyTimeoutMs?: number;
  }): Promise<void>;
  protected waitForInitialSyncReady(params?: {
    timeoutMs?: number;
    abortSignal?: AbortSignal;
  }): Promise<void>;
  protected startSyncSession(opts: {
    bootstrapCrypto: boolean;
    abortSignal?: AbortSignal;
    readyTimeoutMs?: number;
  }): Promise<void>;
  prepareForOneOff(): Promise<void>;
  hasPersistedSyncState(): boolean;
  protected ensureStartedForCryptoControlPlane(): Promise<void>;
  private stopSdkClient;
  quiesceSync(): Promise<void>;
  drainPendingDecryptions(reason?: string): Promise<void>;
  stop(): void;
  private stopClientGeneration;
  stopAndPersist(): Promise<void>;
  stopWithoutPersist(): Promise<void>;
  protected bootstrapCryptoIfNeeded(abortSignal?: AbortSignal): Promise<void>;
  protected initializeCryptoIfNeeded(abortSignal?: AbortSignal): Promise<void>;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-core.d.ts
declare abstract class MatrixClientCore extends MatrixClientBase {
  getUserId(): Promise<string>;
  getJoinedRooms(): Promise<string[]>;
  getTransactionScopeId(): Promise<string>;
  getJoinedRoomMembers(roomId: string): Promise<string[]>;
  hasSyncedJoinedRoomMember(roomId: string, userId: string): boolean;
  getRoomStateEvent(roomId: string, eventType: string, stateKey?: string): Promise<Record<string, unknown>>;
  getAccountData(eventType: string): Promise<Record<string, unknown> | undefined>;
  setAccountData(eventType: string, content: Record<string, unknown>): Promise<void>;
  resolveRoom(aliasOrRoomId: string): Promise<string | null>;
  createDirectRoom(remoteUserId: string, opts?: {
    encrypted?: boolean;
  }): Promise<string>;
  sendMessage(roomId: string, content: MessageEventContent, transactionId?: string, beforeWireDispatch?: (dispatch: MatrixMessageWireDispatch) => Promise<void>): Promise<string>;
  getMessageWireEventType(roomId: string): Promise<"m.room.message" | "m.room.encrypted">;
  prepareRoomForMessageSend(roomId: string, content?: MessageEventContent): Promise<"m.room.message" | "m.room.encrypted">;
  sendEvent(roomId: string, eventType: string, content: Record<string, unknown>): Promise<string>;
  private runSerializedRoomSend;
  sendStateEvent(roomId: string, eventType: string, stateKey: string, content: Record<string, unknown>): Promise<string>;
  redactEvent(roomId: string, eventId: string, reason?: string): Promise<string>;
  doRequest(method: HttpMethod, endpoint: string, qs?: QueryParams, body?: unknown, opts?: {
    allowAbsoluteEndpoint?: boolean;
  }): Promise<unknown>;
  getUserProfile(userId: string): Promise<{
    displayname?: string;
    avatar_url?: string;
  }>;
  setDisplayName(displayName: string): Promise<void>;
  setAvatarUrl(avatarUrl: string): Promise<void>;
  joinRoom(roomId: string): Promise<void>;
  mxcToHttp(mxcUrl: string): string | null;
  downloadContent(mxcUrl: string, opts?: {
    allowRemote?: boolean;
    maxBytes?: number;
    readIdleTimeoutMs?: number;
  }): Promise<Buffer>;
  uploadContent(file: Buffer, contentType?: string, filename?: string): Promise<string>;
  getEvent(roomId: string, eventId: string): Promise<Record<string, unknown>>;
  getRelations(roomId: string, eventId: string, relationType: string | null, eventType?: string | null, opts?: {
    dir?: Direction;
    from?: string;
    limit?: number;
  }): Promise<MatrixRelationsPage>;
  hydrateEvents(roomId: string, events: Array<Record<string, unknown>>): Promise<MatrixRawEvent[]>;
  setTyping(roomId: string, typing: boolean, timeoutMs: number): Promise<void>;
  sendReadReceipt(roomId: string, eventId: string): Promise<void>;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-verification.d.ts
declare abstract class MatrixClientVerification extends MatrixClientCore {
  getRoomKeyBackupStatus(): Promise<MatrixRoomKeyBackupStatus>;
  getDeviceVerificationStatus(userId: string | null | undefined, deviceId: string | null | undefined): Promise<MatrixDeviceVerificationStatus>;
  getOwnDeviceVerificationStatus(): Promise<MatrixOwnDeviceVerificationStatus>;
  getOwnDeviceIdentityVerificationStatus(): Promise<MatrixDeviceVerificationStatus>;
  trustOwnIdentityAfterSelfVerification(): Promise<void>;
  protected resolveActiveRoomKeyBackupVersion(crypto: MatrixCryptoBootstrapApi): Promise<string | null>;
  protected resolveCachedRoomKeyBackupDecryptionKey(crypto: MatrixCryptoBootstrapApi): Promise<boolean | null>;
  protected resolveRoomKeyBackupLocalState(crypto: MatrixCryptoBootstrapApi): Promise<{
    activeVersion: string | null;
    decryptionKeyCached: boolean | null;
  }>;
  protected shouldForceSecretStorageRecreationForBackupReset(crypto: MatrixCryptoBootstrapApi): Promise<boolean>;
  protected resolveRoomKeyBackupTrustState(crypto: MatrixCryptoBootstrapApi, fallbackVersion: string | null): Promise<{
    serverVersion: string | null;
    trusted: boolean | null;
    matchesDecryptionKey: boolean | null;
  }>;
  protected resolveDefaultSecretStorageKeyId(crypto: MatrixCryptoBootstrapApi | undefined): Promise<string | null | undefined>;
  protected resolveRoomKeyBackupVersion(): Promise<string | null>;
  protected enableTrustedRoomKeyBackupIfPossible(crypto: MatrixCryptoBootstrapApi): Promise<void>;
  protected ensureRoomKeyBackupEnabled(crypto: MatrixCryptoBootstrapApi): Promise<void>;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk.d.ts
declare class MatrixClient$1 extends MatrixClientVerification {
  verifyWithRecoveryKey(rawRecoveryKey: string): Promise<MatrixRecoveryKeyVerificationResult>;
  restoreRoomKeyBackup(params?: {
    recoveryKey?: string;
  }): Promise<MatrixRoomKeyBackupRestoreResult>;
  resetRoomKeyBackup(options?: MatrixRoomKeyBackupResetOptions): Promise<MatrixRoomKeyBackupResetResult>;
  getOwnCrossSigningPublicationStatus(): Promise<MatrixOwnCrossSigningPublicationStatus>;
  bootstrapOwnDeviceVerification(params?: {
    allowAutomaticCrossSigningReset?: boolean;
    recoveryKey?: string;
    forceResetCrossSigning?: boolean;
    strict?: boolean;
  }): Promise<MatrixVerificationBootstrapResult>;
  listOwnDevices(): Promise<MatrixOwnDeviceInfo[]>;
  deleteOwnDevices(deviceIds: string[]): Promise<MatrixOwnDeviceDeleteResult>;
  protected registerBridge(): void;
  private emitMembershipForRoom;
  protected emitOutstandingInviteEvents(): void;
  protected refreshDmCache(): Promise<boolean>;
}
//#endregion
//#region extensions/matrix/src/matrix/thread-bindings.d.ts
declare function createMatrixThreadBindingManager(params: {
  cfg: OpenClawConfig;
  accountId: string;
  auth: MatrixAuth;
  client: MatrixClient$1;
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  idleTimeoutMs: number;
  maxAgeMs: number;
  enableSweeper?: boolean;
  logVerboseMessage?: (message: string) => void;
}): Promise<MatrixThreadBindingManager>;
//#endregion
export { createMatrixThreadBindingManager as t };