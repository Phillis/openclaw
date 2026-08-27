import { A as AgentDefaultsConfig, r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { n as RuntimeEnv } from "../runtime-DRcp7-j9.js";
import { i as ReplyPayload } from "../reply-payload-D83wzoq7.js";
import { a as resolveOsHomeRelativePath, c as resolveUserPath, i as resolveOsHomeDir, n as resolveEffectiveHomeDir, o as resolveRequiredHomeDir, r as resolveHomeRelativePath, s as resolveRequiredOsHomeDir, t as expandHomePrefix } from "../home-dir-4pOw9r_P.js";
import { $ as DiagnosticSessionLongRunningEvent, A as DiagnosticMessageProcessedEvent, At as emitDiagnosticEventWithTrustedTraceContext, B as DiagnosticPhaseSnapshot, Bt as isDiagnosticsEnabled, C as DiagnosticMemoryUsage, Ct as DiagnosticUsageEvent, D as DiagnosticMessageDeliveryStartedEvent, Dt as TrustedToolExecutionEvent, E as DiagnosticMessageDeliveryKind, Et as DiagnosticWebhookReceivedEvent, F as DiagnosticModelCallErrorEvent, Ft as emitTrustedSecurityEvent, G as DiagnosticSecurityEvent, Gt as onTrustedToolExecutionEvent, H as DiagnosticRunCompletedEvent, Ht as onDiagnosticEvent, I as DiagnosticModelCallStartedEvent, It as emitTrustedSkillUsedDiagnosticEvent, J as DiagnosticSecurityEventInput, Jt as waitForDiagnosticEventsDrained, K as DiagnosticSecurityEventActor, Kt as resetDiagnosticEventsForTest, L as DiagnosticPayloadLargeEvent, Lt as formatDiagnosticTraceparentForPropagation, M as DiagnosticMessageReceivedEvent, Mt as emitInternalDiagnosticEvent, N as DiagnosticModelCallCompletedEvent, Nt as emitTrustedDiagnosticEvent, O as DiagnosticMessageDispatchCompletedEvent, Ot as areDiagnosticsEnabledForProcess, P as DiagnosticModelCallContent, Pt as emitTrustedDiagnosticEventWithPrivateData, Q as DiagnosticSessionAttentionClassification, R as DiagnosticPhaseCompletedEvent, Rt as getInternalDiagnosticEventSequence, S as DiagnosticMemorySampleEvent, St as DiagnosticToolTerminalReason, T as DiagnosticMessageDeliveryErrorEvent, Tt as DiagnosticWebhookProcessedEvent, U as DiagnosticRunProgressEvent, Ut as onInternalDiagnosticEvent, V as DiagnosticRunAttemptEvent, Vt as isInternalDiagnosticEventMetadata, W as DiagnosticRunStartedEvent, Wt as onTrustedInternalDiagnosticEvent, X as DiagnosticSecurityEventTarget, Y as DiagnosticSecurityEventPolicy, Z as DiagnosticSessionActiveWorkKind, _ as DiagnosticLaneEnqueueEvent, _t as DiagnosticToolExecutionErrorEvent, a as DiagnosticEventPayload, at as DiagnosticSessionStateEvent, b as DiagnosticLogRecordEvent, bt as DiagnosticToolParamsSummary, c as DiagnosticExecProcessCompletedEvent, ct as DiagnosticSkillActivation, d as DiagnosticHarnessRunErrorEvent, dt as DiagnosticSkillUsedEvent, et as DiagnosticSessionRecoveryCompletedEvent, f as DiagnosticHarnessRunOutcome, ft as DiagnosticTalkEvent, g as DiagnosticLaneDequeueEvent, gt as DiagnosticToolExecutionCompletedEvent, h as DiagnosticHeartbeatEvent, ht as DiagnosticToolExecutionBlockedEvent, i as DiagnosticEventMetadata, it as DiagnosticSessionState, j as DiagnosticMessageQueuedEvent, jt as emitFailoverEvent, k as DiagnosticMessageDispatchStartedEvent, kt as emitDiagnosticEvent, l as DiagnosticFailoverEvent, lt as DiagnosticSkillTelemetrySource, m as DiagnosticHarnessRunStartedEvent, mt as DiagnosticToolCallContent, n as DiagnosticContextAssembledEvent, nt as DiagnosticSessionRecoveryStatus, o as DiagnosticEventPrivateData, ot as DiagnosticSessionStuckEvent, p as DiagnosticHarnessRunPhase, pt as DiagnosticTelemetryExporterEvent, q as DiagnosticSecurityEventControl, qt as setDiagnosticsEnabledForProcess, r as DiagnosticEventInput, rt as DiagnosticSessionStalledEvent, s as DiagnosticExecApprovalFollowupSuppressedEvent, st as DiagnosticSessionTurnCreatedEvent, t as DiagnosticAsyncQueueDroppedEvent, tt as DiagnosticSessionRecoveryRequestedEvent, u as DiagnosticHarnessRunCompletedEvent, ut as DiagnosticSkillUsagePrivateData, v as DiagnosticLivenessWarningEvent, vt as DiagnosticToolExecutionStartedEvent, w as DiagnosticMessageDeliveryCompletedEvent, wt as DiagnosticWebhookErrorEvent, x as DiagnosticMemoryPressureEvent, xt as DiagnosticToolSource, y as DiagnosticLivenessWarningReason, yt as DiagnosticToolLoopEvent, z as DiagnosticPhaseDetails, zt as hasPendingInternalDiagnosticEvent } from "../diagnostic-events-CeLg07fD.js";
import { A as resolveExecPolicyForMode, C as normalizeExecHost, D as requireValidExecTarget, E as normalizeExecTarget, N as ExecAllowlistEntry, O as resolveExecModeFromPolicy, S as normalizeExecAsk, T as normalizeExecSecurity, _ as ExecSecurity, a as ExecApprovalRequest, b as SystemRunApprovalFileOperand, c as ExecApprovalUnavailableDecision, d as ExecApprovalsFile, f as ExecApprovalsResolved, g as ExecMode, h as ExecHost, i as ExecApprovalDecision, j as ExecApprovalPolicySnapshot, k as resolveExecModePolicy, l as ExecApprovalsAgent, m as ExecAsk, n as EXEC_TARGET_VALUES, o as ExecApprovalRequestPayload, p as ExecApprovalsSnapshot, r as ExecApprovalCommandSpan, s as ExecApprovalResolved, t as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, u as ExecApprovalsDefaults, v as ExecTarget, w as normalizeExecMode, x as SystemRunApprovalPlan, y as SystemRunApprovalBinding } from "../exec-approvals-core-ByvfWxmW.js";
import { $ as resolvePolicyAllowlistCandidatePath, A as isSafeBinUsage, B as ExecArgvToken, C as ExecAllowlistEvaluation, D as evaluateExecAllowlistWithAuthorization, E as evaluateExecAllowlist, F as ExecAuthorizationPlan, G as resolveApprovalAuditCandidatePath, H as matchAllowlist, I as ExecCommandAnalysis, J as resolveCommandResolutionFromArgv, K as resolveApprovalAuditTrustPath, L as ExecCommandSegment, M as resolveAllowAlwaysPatternEntries, N as resolveAllowAlwaysPatterns, O as evaluateShellAllowlist, P as resolveSafeBins, Q as resolveExecutionTargetTrustPath, R as ShellChainOperator, S as ExecAllowlistAnalysis, T as SkillBinTrustEntry, U as parseExecArgvToken, V as ExecutableResolution, W as resolveAllowlistCandidatePath, X as resolveExecutionTargetCandidatePath, Y as resolveExecutableTrustPath, Z as resolveExecutionTargetResolution, _ as resolveExecApprovalUnavailableDecisions, a as sanitizeExecApprovalWarningText, b as ExecApprovalsDefaultOverrides, c as OPTIONAL_EXEC_APPROVAL_DECISIONS, d as maxAsk, et as resolvePolicyTargetCandidatePath, f as minSecurity, g as resolveExecApprovalRequestAllowedDecisions, h as resolveExecApprovalAllowedDecisions, i as sanitizeExecApprovalDisplayTextWithStatus, j as normalizeSafeBins, k as evaluateShellAllowlistWithAuthorization, l as commandRequiresSecurityAuditSuppressionApproval, m as requiresExecApproval, n as resolveExecApprovalCommandDisplay, nt as resolvePolicyTargetTrustPath, o as sanitizeExecApprovalWarningTextWithStatus, p as normalizeExecApprovalUnavailableDecisions, q as resolveCommandResolution, r as sanitizeExecApprovalDisplayText, s as DEFAULT_EXEC_APPROVAL_DECISIONS, t as SanitizedExecApprovalDisplayText, tt as resolvePolicyTargetResolution, u as isExecApprovalDecisionAllowed, v as AllowAlwaysPersistenceDecision, w as ExecSegmentSatisfiedBy, x as AllowAlwaysPattern, y as AllowAlwaysPersistenceReason, z as CommandResolution } from "../exec-approval-command-display-CEkIGUTP.js";
import { A as ResolveOutboundSendDepOptions, M as resolveOutboundSendDep, j as resolveLegacyOutboundSendDepKeys, k as OutboundSendDeps } from "../types-CSUG59-Z.js";
import { A as ChannelApprovalNativeDeliveryPlan, M as resolveChannelNativeApprovalDeliveryPlan, f as ExecApprovalChannelRuntime, j as ChannelApprovalNativePlannedTarget, k as PreparedChannelNativeApprovalTarget, m as ExecApprovalChannelRuntimeEventKind, p as ExecApprovalChannelRuntimeAdapter } from "../approval-handler-runtime-types-BZ-ScdGo.js";
import { _ as truncatePluginApprovalDetail, a as PLUGIN_APPROVAL_DETAIL_MAX_LENGTH, c as PluginApprovalRequest, d as approvalDecisionLabel, f as buildPluginApprovalExpiredMessage, g as resolvePluginApprovalTimeoutMs, h as resolvePluginApprovalRequestAllowedDecisions, i as PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH, l as PluginApprovalRequestPayload, m as buildPluginApprovalResolvedMessage, n as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, o as PLUGIN_APPROVAL_TITLE_MAX_LENGTH, p as buildPluginApprovalRequestMessage, r as MAX_PLUGIN_APPROVAL_TIMEOUT_MS, s as PluginApprovalActionView, t as DEFAULT_PLUGIN_APPROVAL_DECISIONS, u as PluginApprovalResolved } from "../plugin-approvals-Dx9uGZHC.js";
import { n as OutboundPayloadDeliveryOutcome, t as OutboundDeliveryResult } from "../deliver-types-9ETNkFfw.js";
import { o as OutboundIdentity } from "../outbound.types-D5wpXfvw.js";
import { C as resolveSsrFPolicyForUrl, E as ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist, S as resolvePinnedHostnameWithPolicy, T as ssrfPolicyFromHttpBaseUrlAllowedOrigin, _ as isSameSsrFPolicy, a as SsrFBlockedError, b as normalizeHostnameAllowlist, c as assertPublicHostname, d as createPinnedLookup, f as isBlockedHostname, g as isPrivateNetworkAllowedByPolicy, h as isPrivateIpAddress, i as PinnedHostnameOverride, l as closeDispatcher, m as isHostnameAllowedByPattern, n as PinnedDispatcherPolicy, o as SsrFPolicy, p as isBlockedHostnameOrIp, r as PinnedHostname, s as assertHostnameAllowedWithPolicy, t as LookupFn, u as createPinnedDispatcher, v as matchesHostnameAllowlist, w as ssrfPolicyFromHttpBaseUrlAllowedHostname, x as resolvePinnedHostname, y as mergeSsrFPolicies } from "../ssrf-UB_ute2q.js";
import { c as readLocalFileSafely, l as ReadResult, n as OpenResult, s as openLocalFileSafely } from "../root-impl-C4RbsRZF.js";
import { n as FsSafeErrorCode, t as FsSafeError } from "../errors-BCyoc29e.js";
import { A as canonicalPathFromExistingAncestor, C as sanitizeUntrustedFileName, D as ResolvedAbsolutePath, E as EnsureAbsoluteDirectoryResult, M as resolveAbsolutePathForRead, N as resolveAbsolutePathForWrite, O as ResolvedWritableAbsolutePath, S as pathExistsSync, T as EnsureAbsoluteDirectoryOptions, _ as statRegularFileSync, a as hasEnvHttpProxyConfigured, b as resolveLocalPathFromRootsSync, c as resolveEnvHttpProxyAgentOptions, d as appendRegularFile, f as appendRegularFileSync, g as statRegularFile, h as resolveRegularFileAppendFlags, i as hasEnvHttpProxyAgentConfigured, j as findExistingAncestor, k as assertAbsolutePathInput, l as resolveEnvHttpProxyUrl, m as readRegularFileSync, n as EnvHttpProxyAgentProxyOptions, o as hasProxyEnvConfigured, p as readRegularFile, r as PROXY_ENV_KEYS, s as matchesNoProxy, t as normalizeHostname, u as shouldUseEnvHttpProxyForUrl, v as withTimeout, w as AbsolutePathSymlinkPolicy, x as pathExists, y as readLocalFileFromRoots } from "../hostname-BBhJGnB6.js";
import { a as readRootJsonObjectSync, c as tryReadJson, d as writeJsonSync, i as readJsonSync, l as tryReadJsonSync, n as readJson, o as readRootJsonSync, r as readJsonIfExists, s as readRootStructuredFileSync, t as JsonFileReadError, u as writeJson } from "../json-CILvtJRe.js";
import { a as readFileWithinRoot, c as writeFileWithinRoot, i as ensureAbsoluteDirectory, l as isPathInside, n as ExternalFileWriteResult, o as root, r as Root, s as writeExternalFileWithinRoot, t as ExternalFileWriteOptions } from "../fs-safe-D38Q48m-.js";
import { a as PRIVATE_SECRET_DIR_MODE, i as DEFAULT_SECRET_FILE_MAX_BYTES, l as readSecretFileSync, n as loadSecretFileSync, o as PRIVATE_SECRET_FILE_MODE, r as tryReadSecretFileSync, s as SecretFileReadOptions, t as SecretFileReadResult, u as writeSecretFileAtomic } from "../secret-file-DTtIdHTB.js";
import { a as computeBackoff, i as RetryOptions, n as RetryConfig, o as resolveRetryConfig, r as RetryInfo, s as sleepWithAbort, t as BackoffPolicy } from "../index-CblPnrbF.js";
import { a as fetchWithSsrFGuard, c as withTrustedEnvProxyGuardedFetchMode, i as GuardedFetchResult, l as withTrustedExplicitProxyGuardedFetchMode, n as GuardedFetchMode, o as retainSafeHeadersForCrossOriginRedirectHeaders, r as GuardedFetchOptions, s as withStrictGuardedFetchMode, t as GUARDED_FETCH_MODE, u as fetchWithRuntimeDispatcher } from "../fetch-guard--rW0qMiP.js";
import { C as normalizeZaiEnv, S as normalizeEnv, T as retryAsync, _ as formatDurationPrecise, a as resetWSLStateForTests, b as isTruthyEnvValue, c as ensureGlobalUndiciEnvProxyDispatcher, d as globalUndiciStreamTimeoutMs, f as resetGlobalUndiciStreamTimeoutsForTests, g as formatDurationHuman, h as formatDurationCompact, i as isWSLSync, l as ensureGlobalUndiciStreamTimeouts, m as FormatDurationSecondsOptions, n as isWSL2Sync, o as DEFAULT_UNDICI_STREAM_TIMEOUT_MS, p as FormatDurationCompactOptions, r as isWSLEnv, s as ensureGlobalUndiciDispatcherStreamTimeouts, t as isWSL, u as forceResetGlobalDispatcher, v as formatDurationSeconds, w as resolveEnvNormalizationKeys, x as logAcceptedEnvOption, y as expandEnvNormalizationKeys } from "../wsl-sgdog62k.js";
import { _ as resetChannelActivityForTest, a as drainSystemEvents, c as hasSystemEvents, d as peekSystemEvents, f as resetSystemEventsForTest, g as recordChannelActivity, h as getChannelActivity, i as drainSystemEventEntries, l as isSystemEventContextChanged, m as ChannelDirection, n as consumeSelectedSystemEventEntries, o as enqueueSystemEvent, p as resolveSystemEventDeliveryContext, r as consumeSystemEventEntries, s as enqueueSystemEventEntry, t as SystemEvent, u as peekSystemEventEntries } from "../system-events-BZxqrZt1.js";
import { d as resolveAgentOutboundIdentity, n as QueuedDelivery, r as QueuedDeliveryPayload, t as MessageSentEvent, u as normalizeOutboundIdentity } from "../message-sent-hook-CWLhSIXp.js";
import { n as stringifyNonErrorCause, r as toErrorObject } from "../error-coercion--yphJjqt.js";
import { a as readErrorName, i as formatUncaughtError, n as extractErrorCode, r as formatErrorMessage, t as collectErrorGraphCandidates } from "../errors-Dxvo_HjC.js";
import { t as formatApprovalDisplayPath } from "../approval-display-paths-Hb4BQ_zR.js";
import { _ as resolveExpiresAtMsFromDurationSeconds, c as finiteSecondsToTimerSafeMilliseconds, d as parseStrictFiniteNumber, f as parseStrictInteger, g as resolveExpiresAtMsFromDurationOrEpoch, h as positiveSecondsToSafeMilliseconds, l as nonNegativeSecondsToSafeMilliseconds, m as parseStrictPositiveInteger, n as MAX_TIMER_TIMEOUT_SECONDS, p as parseStrictNonNegativeInteger, s as clampTimerTimeoutMs, t as MAX_TIMER_TIMEOUT_MS, u as parseFiniteNumber, v as resolveExpiresAtMsFromEpochSeconds, y as resolveNonNegativeIntegerOption } from "../number-coercion-DLWcU7C1.js";
import { i as resolveGlobalDedupeCache, n as DedupeCacheOptions, r as createDedupeCache, t as DedupeCache } from "../dedupe-BjvxIwzz.js";
import { a as generateSecureUuid, i as generateSecureToken, n as generateSecureHex, r as generateSecureInt, t as generateSecureFraction } from "../secure-random-BTcaoAnv.js";
import { S as parseExecApprovalCommandText, _ as buildTypedExecApprovalPendingReplyPayload, a as ExecApprovalUnavailableReason, b as getExecApprovalApproverDmNoticeText, c as buildApprovalButtonPresentation, d as buildExecApprovalCommandText, f as buildExecApprovalPendingReplyPayload, g as buildTypedApprovalPresentation, h as buildTypedApprovalActionDescriptors, i as ExecApprovalReplyMetadata, l as buildApprovalPresentationFromActionDescriptors, m as buildExecApprovalUnavailableReplyPayload, n as ExecApprovalPendingReplyParams, o as ExecApprovalUnavailableReplyParams, p as buildExecApprovalPresentation, r as ExecApprovalReplyDecision, s as TypedApprovalActionDescriptor, t as ExecApprovalActionDescriptor, u as buildExecApprovalActionDescriptors, v as buildTypedExecApprovalPresentation, x as getExecApprovalReplyMetadata, y as formatExecApprovalExpiresIn } from "../exec-approval-reply-CLPYol72.js";
import { a as resolveApprovalRequestSessionTarget, i as resolveApprovalRequestSessionConversation, n as ExecApprovalSessionTarget, o as resolveExecApprovalSessionTarget, r as resolveApprovalRequestOriginTarget, t as ApprovalRequestSessionConversation } from "../exec-approval-session-target-C-1nxETh.js";
import { n as createExecApprovalChannelRuntime, r as isExecApprovalChannelRuntimeTerminalStartError, t as ExecApprovalChannelRuntimeTerminalStartError } from "../exec-approval-channel-runtime-DQtDnq1V.js";
import { n as deliverApprovalRequestViaChannelNativePlan, t as createChannelNativeApprovalRuntime } from "../approval-native-runtime-CaujSRb_.js";
import { i as normalizeScpRemotePath, n as isSafeScpRemotePath, r as normalizeScpRemoteHost, t as isSafeScpRemoteHost } from "../scp-host-yP_sSiFf.js";
import { n as createRuntimeOutboundDelegates } from "../runtime-forwarders-D5dGMR_u.js";
import { t as sanitizeForPlainText } from "../sanitize-text-C1kCSQYC.js";
import { t as pruneMapToMaxSize } from "../map-size-Cxg6PuCO.js";
import { n as matchesDiagnosticFlag, r as resolveDiagnosticFlags, t as isDiagnosticFlagEnabled } from "../diagnostic-flags-ChoWNvwN.js";
import { n as buildTimeoutAbortSignal, r as fetchWithTimeout, t as bindAbortRelay } from "../fetch-timeout-D2yvPshT.js";
import { a as acquireFileLock, c as withFileLock, i as FileLockTimeoutError, n as FileLockHandle, o as drainFileLockStateForTest, r as FileLockOptions, s as resetFileLockStateForTest, t as FILE_LOCK_TIMEOUT_ERROR_CODE } from "../file-lock-C3UZJY3U.js";
import { _ as testApi, a as ReadRequestBodyOptions, c as RequestBodyLimitGuard, d as isRequestBodyLimitError, f as readJsonBodyWithLimit, g as requestBodyErrorToText, i as ReadJsonBodyResult, l as RequestBodyLimitGuardOptions, n as DEFAULT_WEBHOOK_MAX_BODY_BYTES, o as RequestBodyLimitError, p as readRequestBodyWithLimit, r as ReadJsonBodyOptions, s as RequestBodyLimitErrorCode, t as DEFAULT_WEBHOOK_BODY_TIMEOUT_MS, u as installRequestBodyLimitGuard } from "../http-body-CY5qIMYc.js";
import { n as hasSystemMark, r as prefixSystemMessage, t as SYSTEM_MARK } from "../system-message-BaqODHMh.js";
import { n as ResolvePreferredOpenClawTmpDirOptions, r as resolvePreferredOpenClawTmpDir, t as DEFAULT_POSIX_TMP_ROOT } from "../tmp-openclaw-dir-BdLSz-Cn.js";
import { a as isPrivateNetworkOptInEnabled, c as ssrfPolicyFromDangerouslyAllowPrivateNetwork, d as hasLegacyFlatAllowPrivateNetworkAlias, f as migrateLegacyFlatAllowPrivateNetworkAlias, i as isHttpsUrlAllowedByHostnameSuffixAllowlist, l as ssrfPolicyFromPrivateNetworkOptIn, n as assertHttpUrlTargetsPrivateNetwork, o as normalizeHostnameSuffixAllowlist, r as buildHostnameAllowlistPolicyFromSuffixAllowlist, s as ssrfPolicyFromAllowPrivateNetwork, t as PrivateNetworkOptInInput, u as createLegacyPrivateNetworkDoctorContract } from "../ssrf-policy-CkD3lHTi.js";
import fs, { Stats } from "node:fs";
import { FileHandle } from "node:fs/promises";

//#region src/infra/exec-argv-analysis.d.ts
declare function analyzeArgvCommand(params: {
  argv: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
}): ExecCommandAnalysis;
//#endregion
//#region src/infra/windows-shell-command.d.ts
declare function tokenizeWindowsSegment(segment: string): string[] | null;
declare function analyzeWindowsShellCommand(params: {
  command: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
}): ExecCommandAnalysis;
declare function isWindowsPlatform(platform?: string | null): boolean;
declare function windowsEscapeArg(value: string): {
  ok: true;
  escaped: string;
} | {
  ok: false;
};
//#endregion
//#region src/infra/exec-approvals-analysis.d.ts
declare function resolvePlannedSegmentArgv(segment: ExecCommandSegment): string[] | null;
declare function buildEnforcedShellCommand(params: {
  command: string;
  segments: ExecCommandSegment[];
  platform?: string | null;
}): {
  ok: boolean;
  command?: string;
  reason?: string;
};
//#endregion
//#region src/infra/exec-approvals-config.d.ts
declare const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK: ExecSecurity;
declare function resolveExecApprovalsPath(env?: NodeJS.ProcessEnv): string;
declare function resolveExecApprovalsSocketPath(): string;
declare function resolveExecApprovalsDisplayPath(): string;
declare function resolveExecApprovalsTranscriptPath(): string;
declare function mergeExecApprovalsSocketDefaults(params: {
  normalized: ExecApprovalsFile;
  current?: ExecApprovalsFile;
}): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals-store.d.ts
declare function readExecApprovalsSnapshot(): ExecApprovalsSnapshot;
declare function loadExecApprovals(): ExecApprovalsFile;
declare function saveExecApprovals(file: ExecApprovalsFile): void;
declare function restoreExecApprovalsSnapshot(snapshot: ExecApprovalsSnapshot): void;
declare function ensureExecApprovals(): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals-allow-always.d.ts
declare function hasDurableExecApproval(params: {
  analysisOk: boolean;
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasNodeCommandAllowAlwaysMarker(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasExactCommandDurableExecApproval(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function addAllowlistEntry(approvals: ExecApprovalsFile, agentId: string | undefined, pattern: string, options?: {
  argPattern?: string;
  source?: ExecAllowlistEntry["source"];
}): void;
declare function addDurableCommandApproval(approvals: ExecApprovalsFile, agentId: string | undefined, commandText: string): void;
declare function resolveAllowAlwaysPatternCoverage(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): {
  complete: boolean;
  patterns: ReturnType<typeof resolveAllowAlwaysPatternEntries>;
};
declare function persistAllowAlwaysPatterns(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  commandText?: string;
  strictInlineEval?: boolean;
}): ReturnType<typeof resolveAllowAlwaysPatternEntries>;
declare function resolveAllowAlwaysPersistenceDecision(params: {
  segments: ExecCommandSegment[];
  commandText?: string | null;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
  authorizationPlan?: ExecAuthorizationPlan;
  runtimePayload?: boolean;
  preparedCoverage?: ReturnType<typeof resolveAllowAlwaysPatternCoverage> | null;
}): AllowAlwaysPersistenceDecision;
declare function persistAllowAlwaysDecision(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  decision: AllowAlwaysPersistenceDecision;
}): void;
//#endregion
//#region src/infra/exec-approvals-authorization.d.ts
type ExecApprovalUsageAuthorization = {
  source: "current-policy" | "ask-fallback" | "explicit-approval" | "auto-review";
  security: ExecSecurity;
  ask: ExecAsk;
  allowlistSatisfied: boolean;
  policySnapshot?: ExecApprovalPolicySnapshot;
  requireAutoAllowSkills?: boolean;
  requireExactCommandApproval?: boolean;
  requireDurableAllowlistApproval?: boolean;
};
declare function recordAllowlistUse(approvals: ExecApprovalsFile, agentId: string | undefined, entry: ExecAllowlistEntry, command: string, resolvedPath?: string): void;
declare function recordAllowlistMatchesUse(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  matches: readonly ExecAllowlistEntry[];
  command: string;
  resolvedPath?: string;
  authorization?: ExecApprovalUsageAuthorization;
}): void;
//#endregion
//#region src/infra/exec-approvals-socket.d.ts
declare function requestExecApprovalViaSocket(params: {
  socketPath: string;
  token: string;
  request: Record<string, unknown>;
  timeoutMs?: number;
}): Promise<ExecApprovalDecision | null>;
//#endregion
//#region src/infra/exec-approvals.d.ts
declare function normalizeExecApprovals(file: ExecApprovalsFile): ExecApprovalsFile;
declare function resolveExecApprovals(agentId?: string, overrides?: ExecApprovalsDefaultOverrides): ExecApprovalsResolved;
declare function resolveExecApprovalsFromFile(params: {
  file: ExecApprovalsFile;
  agentId?: string;
  overrides?: ExecApprovalsDefaultOverrides;
  path?: string;
  socketPath?: string;
  token?: string;
}): ExecApprovalsResolved;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/opened-realpath.d.ts
declare function resolveOpenedFileRealPathForHandle(handle: FileHandle, ioPath: string): Promise<string>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/async-lock.d.ts
declare function createAsyncLock(): <T>(fn: () => Promise<T>) => Promise<T>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/local-file-access.d.ts
declare function hasEncodedFileUrlSeparator(pathname: string): boolean;
declare function isWindowsNetworkPath(filePath: string, platform?: NodeJS.Platform): boolean;
declare function assertNoWindowsNetworkPath(filePath: string, label?: string): void;
declare function safeFileURLToPath(fileUrl: string, platform?: NodeJS.Platform): string;
declare function trySafeFileURLToPath(fileUrl: string, platform?: NodeJS.Platform): string | undefined;
declare function basenameFromMediaSource(source?: string): string | undefined;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/trash.d.ts
type MovePathToTrashOptions = {
  allowedRoots?: Iterable<string>;
};
declare function movePathToTrash(targetPath: string, options?: MovePathToTrashOptions): Promise<string>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/permissions-windows.d.ts
type PermissionExec = (command: string, args: string[]) => Promise<{
  stdout: string;
  stderr: string;
}>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/permissions.d.ts
type PermissionCheck = {
  ok: boolean;
  isSymlink: boolean;
  isDir: boolean;
  mode: number | null;
  bits: number | null;
  source: "posix" | "windows-acl" | "unknown";
  worldWritable: boolean;
  groupWritable: boolean;
  worldReadable: boolean;
  groupReadable: boolean; /** Canonical Windows owner SID when the owner query succeeds. */
  ownerSid?: string; /** Whether the Windows owner is the current user, LocalSystem, or Administrators. */
  ownerTrusted?: boolean; /** Owner-query failure detail when Windows ownership could not be verified. */
  ownerError?: string;
  aclSummary?: string;
  error?: string;
};
type PermissionCheckOptions = {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  exec?: PermissionExec;
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/secure-file.d.ts
type SecureFileReadOptions = {
  filePath: string;
  label?: string;
  trust?: SecureFileTrustOptions;
  permissions?: SecureFilePermissionOptions;
  inject?: SecureFileInjectOptions;
  io?: SecureFileIoOptions;
};
type SecureFileTrustOptions = {
  trustedDirs?: string[];
  allowSymlink?: boolean;
  allowNetworkPath?: boolean;
};
type SecureFilePermissionOptions = {
  allowInsecure?: boolean;
  allowReadableByOthers?: boolean;
};
type SecureFileInjectOptions = PermissionCheckOptions;
type SecureFileIoOptions = {
  maxBytes?: number;
  timeoutMs?: number;
};
type SecureFileReadResult = {
  buffer: Buffer;
  realPath: string;
  stat: Stats;
  permissions?: PermissionCheck;
};
declare function readSecureFile(options: SecureFileReadOptions): Promise<SecureFileReadResult>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/walk.d.ts
type WalkEntryKind = "file" | "directory" | "symlink" | "other";
type WalkSymlinkPolicy = "skip" | "follow" | "include";
type WalkDirectoryEntry = {
  name: string;
  path: string;
  relativePath: string;
  depth: number;
  kind: WalkEntryKind;
  dirent: fs.Dirent;
};
type WalkDirectoryOptions = {
  maxDepth?: number;
  maxEntries?: number;
  symlinks?: WalkSymlinkPolicy;
  include?: (entry: WalkDirectoryEntry) => boolean;
  descend?: (entry: WalkDirectoryEntry) => boolean;
};
type WalkDirectoryFailure = {
  path: string;
  relativePath: string;
  depth: number;
  error: unknown;
};
type WalkDirectoryResult = {
  entries: WalkDirectoryEntry[];
  scannedEntryCount: number;
  truncated: boolean;
  failedDirs?: WalkDirectoryFailure[];
};
type WalkDirectoryResultWithFailures = WalkDirectoryResult & {
  failedDirs: WalkDirectoryFailure[];
};
declare function walkDirectorySync(rootDir: string, options?: WalkDirectoryOptions): WalkDirectoryResultWithFailures;
declare function walkDirectory(rootDir: string, options?: WalkDirectoryOptions): Promise<WalkDirectoryResultWithFailures>;
//#endregion
//#region src/utils/run-with-concurrency.d.ts
/** Controls whether the worker pool keeps scheduling after a task failure. */
type ConcurrencyErrorMode = "continue" | "stop";
/** Options for running a fixed list of promise factories through a bounded worker pool. */
type RunTasksWithConcurrencyOptions<T> = {
  /** Task factories are started lazily so the helper can enforce `limit`. */tasks: Array<() => Promise<T>>; /** Maximum number of tasks allowed to run at the same time; clamped to at least one. */
  limit: number; /** `stop` prevents new work after the first failure; in-flight workers still settle. */
  errorMode?: ConcurrencyErrorMode; /** Called once per failed task with the original task index. */
  onTaskError?: (error: unknown, index: number) => void;
};
/** Ordered task results plus aggregate error state for callers that keep partial success. */
type RunTasksWithConcurrencyResult<T> = {
  /** Results are written at their original task indexes; failed or unscheduled indexes stay empty. */results: T[]; /** First task error observed by the worker pool, if any. */
  firstError: unknown; /** True when at least one task rejected. */
  hasError: boolean;
};
/** Runs async tasks with bounded concurrency while preserving result indexes. */
declare function runTasksWithConcurrency<T>(params: RunTasksWithConcurrencyOptions<T>): Promise<RunTasksWithConcurrencyResult<T>>;
//#endregion
//#region src/infra/errno.d.ts
/** Type guard for NodeJS.ErrnoException (any object with a `code` property). */
declare function isErrno(err: unknown): err is NodeJS.ErrnoException;
/** Checks whether an errno-shaped value has the exact code. */
declare function hasErrnoCode(err: unknown, code: string): boolean;
//#endregion
//#region src/infra/outbound/protocol-scaffolding.d.ts
declare function stripInternalRuntimeScaffolding(text: string): string;
//#endregion
//#region src/infra/delivery-recovery.shared.d.ts
type DeliveryRecoveryDrainDecision = {
  match: boolean;
  bypassBackoff?: boolean;
};
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.d.ts
type DeliverFn = (params: {
  cfg: OpenClawConfig;
} & QueuedDeliveryPayload & {
  payloads: ReturnType<typeof queuedDeliveryPayloads>;
  deliveryQueueId?: string;
  deliveryQueueStateDir?: string;
  deliveryProducerClaimId?: string;
  deliveryProducerLeaseRequired?: boolean;
  skipQueue?: boolean;
  deferredDeliveryAdmissionPassed?: true;
  deferCommitHooks?: boolean;
  onMessageSentEvent?: (event: MessageSentEvent, sourceIndex: number) => void;
  onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void;
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
}) => Promise<unknown>;
interface RecoveryLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
declare const queuedDeliveryPayloads: (entry: QueuedDelivery) => ReplyPayload[];
declare function drainPendingDeliveriesCore(opts: {
  drainKey: string;
  logLabel: string;
  cfg: OpenClawConfig;
  log: RecoveryLogger;
  stateDir?: string;
  deliver: DeliverFn;
  selectEntry: (entry: QueuedDelivery, now: number) => DeliveryRecoveryDrainDecision;
}): Promise<void>;
//#endregion
//#region src/plugin-sdk/delivery-queue-runtime.d.ts
type DrainPendingDeliveriesOptions = Omit<Parameters<typeof drainPendingDeliveriesCore>[0], "deliver"> & {
  /** Optional delivery implementation for tests or plugin-owned send paths. */deliver?: DeliverFn;
};
/**
 * Drain queued outbound payloads after a channel reconnect or transport recovery.
 * When no deliver function is provided, the heavy outbound delivery runtime is
 * loaded lazily so importing this SDK subpath does not eagerly bind send internals.
 */
declare function drainPendingDeliveries(opts: DrainPendingDeliveriesOptions): Promise<void>;
//#endregion
//#region src/infra/test-runtime-env.d.ts
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
declare function isVitestRuntimeEnv(env?: NodeJS.ProcessEnv): boolean;
/** Enables the shared fast-test shortcuts only inside a detected test runtime. */
declare function isFastTestRuntimeEnv(env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region src/infra/fetch.d.ts
/**
 * Wraps fetch so Node-compatible duplex bodies, normalized headers, and foreign
 * AbortSignal implementations work against runtimes expecting native signals.
 */
declare function wrapFetchWithAbortSignal(fetchImpl: typeof fetch): typeof fetch;
/** Resolves an optional fetch implementation, wrapping it when fetch is available. */
declare function resolveFetch(fetchImpl?: typeof fetch): typeof fetch | undefined;
//#endregion
//#region src/infra/heartbeat-events.d.ts
type HeartbeatIndicatorType = "ok" | "alert" | "error";
type HeartbeatEventPayload = {
  ts: number;
  status: "sent" | "ok-empty" | "ok-token" | "skipped" | "failed";
  to?: string;
  accountId?: string;
  preview?: string;
  durationMs?: number;
  hasMedia?: boolean;
  reason?: string; /** Operator-facing companion to the machine-stable reason code. */
  message?: string; /** The channel this heartbeat was sent to. */
  channel?: string; /** Whether the message was silently suppressed (showOk: false). */
  silent?: boolean; /** Indicator type for UI status display. */
  indicatorType?: HeartbeatIndicatorType;
};
declare function resolveIndicatorType(status: HeartbeatEventPayload["status"]): HeartbeatIndicatorType | undefined;
declare function emitHeartbeatEvent(evt: Omit<HeartbeatEventPayload, "ts">): void;
declare function onHeartbeatEvent(listener: (evt: HeartbeatEventPayload) => void): () => void;
declare function getLastHeartbeatEvent(): HeartbeatEventPayload | null;
declare function resetHeartbeatEventsForTest(): void;
//#endregion
//#region src/infra/heartbeat-summary.d.ts
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
/** Normalized heartbeat configuration for one agent. */
type HeartbeatSummary = {
  enabled: boolean;
  every: string;
  everyMs: number | null;
  prompt: string;
  target: string;
  model?: string;
  session?: string;
  ackMaxChars: number;
};
/** Return whether heartbeat scheduling applies to an agent. */
declare function isHeartbeatEnabledForAgent(cfg: OpenClawConfig, agentId?: string): boolean;
/** Resolve a heartbeat interval string to milliseconds. */
declare function resolveHeartbeatIntervalMs(cfg: OpenClawConfig, overrideEvery?: string, heartbeat?: HeartbeatConfig): number | null;
/** Resolve display-ready heartbeat settings for an agent. */
declare function resolveHeartbeatSummaryForAgent(cfg: OpenClawConfig, agentId?: string): HeartbeatSummary;
//#endregion
//#region src/infra/heartbeat-visibility.d.ts
/** Resolved heartbeat presentation toggles after defaults/channel/account precedence. */
type ResolvedHeartbeatVisibility = {
  /** Whether successful heartbeat content should be sent as visible chat text. */showOk: boolean; /** Whether warning/error heartbeat content should be sent as visible chat text. */
  showAlerts: boolean; /** Whether heartbeat status should emit indicator events for UI surfaces. */
  useIndicator: boolean;
};
/** Resolves heartbeat visibility for a channel, applying account > channel > defaults precedence. */
declare function resolveHeartbeatVisibility(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): ResolvedHeartbeatVisibility;
//#endregion
//#region src/infra/json-files.d.ts
type WriteTextAtomicBeforeRename = (params: {
  filePath: string;
  tempPath: string;
}) => Promise<void>;
type WriteTextAtomicOptions = {
  mode?: number;
  dirMode?: number;
  trailingNewline?: boolean;
  durable?: boolean;
  beforeRename?: WriteTextAtomicBeforeRename;
  /**
   * Prefix for the staged `<prefix>.<pid>.<uuid>.tmp` file. Defaults to the
   * generic `.fs-safe-replace`; pass a target-specific prefix so an orphaned
   * temp (from a crash between write and rename) is identifiable and reclaimable.
   */
  tempPrefix?: string;
};
/** Writes text through the repo atomic replace helper with durable fsync by default. */
declare function writeTextAtomic(filePath: string, content: string, options?: WriteTextAtomicOptions): Promise<void>;
//#endregion
//#region src/infra/net/proxy-fetch.d.ts
/** Non-enumerable marker used to recover the explicit proxy URL from proxy fetch wrappers. */
declare const PROXY_FETCH_PROXY_URL: unique symbol;
/**
 * Create a fetch function that routes requests through the given HTTP proxy.
 * Uses undici's ProxyAgent under the hood.
 */
declare function makeProxyFetch(proxyUrl: string): typeof fetch;
/** Return the explicit proxy URL attached by {@link makeProxyFetch}, if present. */
declare function getProxyUrlFromFetch(fetchImpl?: typeof fetch): string | undefined;
/**
 * Resolve a proxy-aware fetch from standard environment variables.
 * Respects NO_PROXY / no_proxy exclusions via undici's EnvHttpProxyAgent.
 * Returns undefined when no proxy is configured.
 * Gracefully returns undefined if the proxy URL is malformed.
 */
declare function resolveProxyFetchFromEnv(env?: NodeJS.ProcessEnv): typeof fetch | undefined;
//#endregion
//#region src/infra/retry-policy.d.ts
/** Runs an async operation with a policy-specific retry wrapper and optional log label. */
type RetryRunner = <T>(fn: () => Promise<T>, label?: string) => Promise<T>;
/** Default retry envelope for channel API operations that hit transient network edges. */
declare const CHANNEL_API_RETRY_DEFAULTS: {
  attempts: number;
  minDelayMs: number;
  maxDelayMs: number;
  jitter: number;
};
/** Creates a generic rate-limit-aware retry runner from explicit retry policy pieces. */
declare function createRateLimitRetryRunner(params: {
  retry?: RetryConfig;
  configRetry?: RetryConfig;
  verbose?: boolean;
  defaults: Required<RetryConfig>;
  logLabel: string;
  shouldRetry: (err: unknown) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
}): RetryRunner;
/** Creates the channel API retry runner used by outbound messaging integrations. */
declare function createChannelApiRetryRunner(params: {
  retry?: RetryConfig;
  configRetry?: RetryConfig;
  verbose?: boolean;
  retryAfterMaxDelayMs?: number;
  shouldRetry?: RetryOptions["shouldRetry"];
  retryAfterMs?: RetryOptions["retryAfterMs"];
  /**
   * When true, the custom shouldRetry predicate is used exclusively —
   * the default channel API fallback regex is NOT OR'd in.
   * Use this for non-idempotent operations (e.g. sendMessage) where
   * the regex fallback would cause duplicate message delivery.
   */
  strictShouldRetry?: boolean;
}): RetryRunner;
//#endregion
//#region src/infra/transport-ready.d.ts
/** Result returned by one transport readiness probe attempt. */
type TransportReadyResult = {
  ok: boolean;
  error?: string | null;
};
/** Parameters for polling a channel transport until it can accept runtime work. */
type WaitForTransportReadyParams = {
  label: string;
  timeoutMs: number;
  logAfterMs?: number;
  logIntervalMs?: number;
  pollIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime: RuntimeEnv;
  check: () => Promise<TransportReadyResult>;
};
/**
 * Polls a channel transport readiness probe until it succeeds, times out, or aborts.
 *
 * Used by channel plugins that start external daemons or subscribe to local transports before
 * processing inbound events, with bounded retry logging through the caller's runtime sink.
 */
declare function waitForTransportReady(params: WaitForTransportReadyParams): Promise<void>;
//#endregion
//#region src/plugin-sdk/infra-runtime.d.ts
/** @deprecated Shipped compat only (removed from core in #104546); no core caller. Removal with the next plugin-SDK major. */
type ErrorKind = "refusal" | "timeout" | "rate_limit" | "context_length" | "unknown";
/**
 * @deprecated Shipped compat only; preserves the old substring semantics for
 * external plugins. Core chat classification now maps canonical failover
 * reasons (see gateway resolveChatErrorKindFromError). Removal with the next
 * plugin-SDK major.
 */
declare function detectErrorKind(err: unknown): ErrorKind | undefined;
//#endregion
export { type AbsolutePathSymlinkPolicy, type AllowAlwaysPattern, type AllowAlwaysPersistenceDecision, type AllowAlwaysPersistenceReason, ApprovalRequestSessionConversation, type BackoffPolicy, CHANNEL_API_RETRY_DEFAULTS, ChannelApprovalNativeDeliveryPlan, ChannelApprovalNativePlannedTarget, ChannelDirection, type CommandResolution, ConcurrencyErrorMode, DEFAULT_EXEC_APPROVAL_ASK_FALLBACK, DEFAULT_EXEC_APPROVAL_DECISIONS, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, DEFAULT_PLUGIN_APPROVAL_DECISIONS, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, DEFAULT_POSIX_TMP_ROOT, DEFAULT_SECRET_FILE_MAX_BYTES, DEFAULT_UNDICI_STREAM_TIMEOUT_MS, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS, DEFAULT_WEBHOOK_MAX_BODY_BYTES, DedupeCache, DedupeCacheOptions, type DiagnosticAsyncQueueDroppedEvent, type DiagnosticContextAssembledEvent, type DiagnosticEventInput, type DiagnosticEventMetadata, type DiagnosticEventPayload, type DiagnosticEventPrivateData, type DiagnosticExecApprovalFollowupSuppressedEvent, type DiagnosticExecProcessCompletedEvent, type DiagnosticFailoverEvent, type DiagnosticHarnessRunCompletedEvent, type DiagnosticHarnessRunErrorEvent, type DiagnosticHarnessRunOutcome, type DiagnosticHarnessRunPhase, type DiagnosticHarnessRunStartedEvent, type DiagnosticHeartbeatEvent, type DiagnosticLaneDequeueEvent, type DiagnosticLaneEnqueueEvent, type DiagnosticLivenessWarningEvent, type DiagnosticLivenessWarningReason, type DiagnosticLogRecordEvent, type DiagnosticMemoryPressureEvent, type DiagnosticMemorySampleEvent, type DiagnosticMemoryUsage, type DiagnosticMessageDeliveryCompletedEvent, type DiagnosticMessageDeliveryErrorEvent, type DiagnosticMessageDeliveryKind, type DiagnosticMessageDeliveryStartedEvent, type DiagnosticMessageDispatchCompletedEvent, type DiagnosticMessageDispatchStartedEvent, type DiagnosticMessageProcessedEvent, type DiagnosticMessageQueuedEvent, type DiagnosticMessageReceivedEvent, type DiagnosticModelCallCompletedEvent, type DiagnosticModelCallContent, type DiagnosticModelCallErrorEvent, type DiagnosticModelCallStartedEvent, type DiagnosticPayloadLargeEvent, type DiagnosticPhaseCompletedEvent, type DiagnosticPhaseDetails, type DiagnosticPhaseSnapshot, type DiagnosticRunAttemptEvent, type DiagnosticRunCompletedEvent, type DiagnosticRunProgressEvent, type DiagnosticRunStartedEvent, type DiagnosticSecurityEvent, type DiagnosticSecurityEventActor, type DiagnosticSecurityEventControl, type DiagnosticSecurityEventInput, type DiagnosticSecurityEventPolicy, type DiagnosticSecurityEventTarget, type DiagnosticSessionActiveWorkKind, type DiagnosticSessionAttentionClassification, type DiagnosticSessionLongRunningEvent, type DiagnosticSessionRecoveryCompletedEvent, type DiagnosticSessionRecoveryRequestedEvent, type DiagnosticSessionRecoveryStatus, type DiagnosticSessionStalledEvent, type DiagnosticSessionState, type DiagnosticSessionStateEvent, type DiagnosticSessionStuckEvent, type DiagnosticSessionTurnCreatedEvent, type DiagnosticSkillActivation, type DiagnosticSkillTelemetrySource, type DiagnosticSkillUsagePrivateData, type DiagnosticSkillUsedEvent, type DiagnosticTalkEvent, type DiagnosticTelemetryExporterEvent, type DiagnosticToolCallContent, type DiagnosticToolExecutionBlockedEvent, type DiagnosticToolExecutionCompletedEvent, type DiagnosticToolExecutionErrorEvent, type DiagnosticToolExecutionStartedEvent, type DiagnosticToolLoopEvent, type DiagnosticToolParamsSummary, type DiagnosticToolSource, type DiagnosticToolTerminalReason, type DiagnosticUsageEvent, type DiagnosticWebhookErrorEvent, type DiagnosticWebhookProcessedEvent, type DiagnosticWebhookReceivedEvent, EXEC_TARGET_VALUES, type EnsureAbsoluteDirectoryOptions, type EnsureAbsoluteDirectoryResult, EnvHttpProxyAgentProxyOptions, ErrorKind, type ExecAllowlistAnalysis, type ExecAllowlistEntry, type ExecAllowlistEvaluation, ExecApprovalActionDescriptor, type ExecApprovalChannelRuntime, type ExecApprovalChannelRuntimeAdapter, type ExecApprovalChannelRuntimeEventKind, ExecApprovalChannelRuntimeTerminalStartError, type ExecApprovalCommandSpan, type ExecApprovalDecision, ExecApprovalPendingReplyParams, ExecApprovalReplyDecision, ExecApprovalReplyMetadata, type ExecApprovalRequest, type ExecApprovalRequestPayload, type ExecApprovalResolved, ExecApprovalSessionTarget, type ExecApprovalUnavailableDecision, ExecApprovalUnavailableReason, ExecApprovalUnavailableReplyParams, type ExecApprovalsAgent, type ExecApprovalsDefaultOverrides, type ExecApprovalsDefaults, type ExecApprovalsFile, type ExecApprovalsResolved, type ExecApprovalsSnapshot, type ExecArgvToken, type ExecAsk, type ExecCommandAnalysis, type ExecCommandSegment, type ExecHost, type ExecMode, type ExecSecurity, type ExecSegmentSatisfiedBy, type ExecTarget, type ExecutableResolution, ExternalFileWriteOptions, ExternalFileWriteResult, FILE_LOCK_TIMEOUT_ERROR_CODE, type FileLockHandle, type FileLockOptions, type FileLockTimeoutError, FormatDurationCompactOptions, FormatDurationSecondsOptions, FsSafeError, type FsSafeErrorCode, GUARDED_FETCH_MODE, type GuardedFetchMode, type GuardedFetchOptions, type GuardedFetchResult, HeartbeatEventPayload, HeartbeatIndicatorType, HeartbeatSummary, JsonFileReadError, LookupFn, MAX_PLUGIN_APPROVAL_TIMEOUT_MS, MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_SECONDS, type MovePathToTrashOptions, OPTIONAL_EXEC_APPROVAL_DECISIONS, type OpenResult, type OutboundIdentity, OutboundSendDeps, PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH, PLUGIN_APPROVAL_DETAIL_MAX_LENGTH, PLUGIN_APPROVAL_TITLE_MAX_LENGTH, PRIVATE_SECRET_DIR_MODE, PRIVATE_SECRET_FILE_MODE, PROXY_ENV_KEYS, PROXY_FETCH_PROXY_URL, PinnedDispatcherPolicy, PinnedHostname, PinnedHostnameOverride, PluginApprovalActionView, PluginApprovalRequest, PluginApprovalRequestPayload, PluginApprovalResolved, type PreparedChannelNativeApprovalTarget, PrivateNetworkOptInInput, type ReadJsonBodyOptions, type ReadJsonBodyResult, type ReadRequestBodyOptions, type ReadResult, RequestBodyLimitError, type RequestBodyLimitErrorCode, type RequestBodyLimitGuard, type RequestBodyLimitGuardOptions, ResolveOutboundSendDepOptions, ResolvePreferredOpenClawTmpDirOptions, type ResolvedAbsolutePath, ResolvedHeartbeatVisibility, type ResolvedWritableAbsolutePath, type RetryConfig, type RetryInfo, type RetryOptions, RetryRunner, Root, RunTasksWithConcurrencyOptions, RunTasksWithConcurrencyResult, SYSTEM_MARK, SanitizedExecApprovalDisplayText, type SecretFileReadOptions, type SecretFileReadResult, type SecureFileReadOptions, type SecureFileReadResult, type ShellChainOperator, type SkillBinTrustEntry, SsrFBlockedError, SsrFPolicy, type SystemEvent, type SystemRunApprovalBinding, type SystemRunApprovalFileOperand, type SystemRunApprovalPlan, TransportReadyResult, type TrustedToolExecutionEvent, TypedApprovalActionDescriptor, WaitForTransportReadyParams, type WalkDirectoryEntry, type WalkDirectoryOptions, type WalkDirectoryResult, WriteTextAtomicOptions, testApi as __test__, testApi, acquireFileLock, addAllowlistEntry, addDurableCommandApproval, analyzeArgvCommand, analyzeWindowsShellCommand, appendRegularFile, appendRegularFileSync, approvalDecisionLabel, areDiagnosticsEnabledForProcess, assertAbsolutePathInput, assertHostnameAllowedWithPolicy, assertHttpUrlTargetsPrivateNetwork, assertNoWindowsNetworkPath, assertPublicHostname, basenameFromMediaSource, bindAbortRelay, buildApprovalButtonPresentation, buildApprovalPresentationFromActionDescriptors, buildEnforcedShellCommand, buildExecApprovalActionDescriptors, buildExecApprovalCommandText, buildExecApprovalPendingReplyPayload, buildExecApprovalPresentation, buildExecApprovalUnavailableReplyPayload, buildHostnameAllowlistPolicyFromSuffixAllowlist, buildPluginApprovalExpiredMessage, buildPluginApprovalRequestMessage, buildPluginApprovalResolvedMessage, buildTimeoutAbortSignal, buildTypedApprovalActionDescriptors, buildTypedApprovalPresentation, buildTypedExecApprovalPendingReplyPayload, buildTypedExecApprovalPresentation, canonicalPathFromExistingAncestor, clampTimerTimeoutMs, closeDispatcher, collectErrorGraphCandidates, commandRequiresSecurityAuditSuppressionApproval, computeBackoff, consumeSelectedSystemEventEntries, consumeSystemEventEntries, createAsyncLock, createChannelApiRetryRunner, createChannelNativeApprovalRuntime, createDedupeCache, createExecApprovalChannelRuntime, createLegacyPrivateNetworkDoctorContract, createPinnedDispatcher, createPinnedLookup, createRateLimitRetryRunner, createRuntimeOutboundDelegates, deliverApprovalRequestViaChannelNativePlan, detectErrorKind, drainFileLockStateForTest, drainPendingDeliveries, drainSystemEventEntries, drainSystemEvents, emitDiagnosticEvent, type emitDiagnosticEventWithTrustedTraceContext, type emitFailoverEvent, emitHeartbeatEvent, type emitInternalDiagnosticEvent, type emitTrustedDiagnosticEvent, type emitTrustedDiagnosticEventWithPrivateData, type emitTrustedSecurityEvent, type emitTrustedSkillUsedDiagnosticEvent, enqueueSystemEvent, enqueueSystemEventEntry, ensureAbsoluteDirectory, ensureExecApprovals, ensureGlobalUndiciDispatcherStreamTimeouts, ensureGlobalUndiciEnvProxyDispatcher, ensureGlobalUndiciStreamTimeouts, evaluateExecAllowlist, evaluateExecAllowlistWithAuthorization, evaluateShellAllowlist, evaluateShellAllowlistWithAuthorization, expandEnvNormalizationKeys, expandHomePrefix, extractErrorCode, fetchWithRuntimeDispatcher, fetchWithSsrFGuard, fetchWithTimeout, findExistingAncestor, finiteSecondsToTimerSafeMilliseconds, forceResetGlobalDispatcher, formatApprovalDisplayPath, type formatDiagnosticTraceparentForPropagation, formatDurationCompact, formatDurationHuman, formatDurationPrecise, formatDurationSeconds, formatErrorMessage, formatExecApprovalExpiresIn, formatUncaughtError, generateSecureFraction, generateSecureHex, generateSecureInt, generateSecureToken, generateSecureUuid, getChannelActivity, getExecApprovalApproverDmNoticeText, getExecApprovalReplyMetadata, type getInternalDiagnosticEventSequence, getLastHeartbeatEvent, getProxyUrlFromFetch, globalUndiciStreamTimeoutMs, hasDurableExecApproval, hasEncodedFileUrlSeparator, hasEnvHttpProxyAgentConfigured, hasEnvHttpProxyConfigured, hasErrnoCode, hasExactCommandDurableExecApproval, hasLegacyFlatAllowPrivateNetworkAlias, hasNodeCommandAllowAlwaysMarker, type hasPendingInternalDiagnosticEvent, hasProxyEnvConfigured, hasSystemEvents, hasSystemMark, installRequestBodyLimitGuard, isBlockedHostname, isBlockedHostnameOrIp, isDiagnosticFlagEnabled, isDiagnosticsEnabled, isErrno, isExecApprovalChannelRuntimeTerminalStartError, isExecApprovalDecisionAllowed, isFastTestRuntimeEnv, isHeartbeatEnabledForAgent, isHostnameAllowedByPattern, isHttpsUrlAllowedByHostnameSuffixAllowlist, type isInternalDiagnosticEventMetadata, isPathInside, isPrivateIpAddress, isPrivateNetworkAllowedByPolicy, isPrivateNetworkOptInEnabled, isRequestBodyLimitError, isSafeBinUsage, isSafeScpRemoteHost, isSafeScpRemotePath, isSameSsrFPolicy, isSystemEventContextChanged, isTruthyEnvValue, isVitestRuntimeEnv, isWSL, isWSL2Sync, isWSLEnv, isWSLSync, isWindowsNetworkPath, isWindowsPlatform, loadExecApprovals, loadSecretFileSync, logAcceptedEnvOption, makeProxyFetch, matchAllowlist, matchesDiagnosticFlag, matchesHostnameAllowlist, matchesNoProxy, maxAsk, mergeExecApprovalsSocketDefaults, mergeSsrFPolicies, migrateLegacyFlatAllowPrivateNetworkAlias, minSecurity, movePathToTrash, nonNegativeSecondsToSafeMilliseconds, normalizeEnv, normalizeExecApprovalUnavailableDecisions, normalizeExecApprovals, normalizeExecAsk, normalizeExecHost, normalizeExecMode, normalizeExecSecurity, normalizeExecTarget, normalizeHostname, normalizeHostnameAllowlist, normalizeHostnameSuffixAllowlist, normalizeOutboundIdentity, normalizeSafeBins, normalizeScpRemoteHost, normalizeScpRemotePath, normalizeZaiEnv, onDiagnosticEvent, onHeartbeatEvent, type onInternalDiagnosticEvent, type onTrustedInternalDiagnosticEvent, type onTrustedToolExecutionEvent, openLocalFileSafely, parseExecApprovalCommandText, parseExecArgvToken, parseFiniteNumber, parseStrictFiniteNumber, parseStrictInteger, parseStrictNonNegativeInteger, parseStrictPositiveInteger, pathExists, pathExistsSync, peekSystemEventEntries, peekSystemEvents, persistAllowAlwaysDecision, persistAllowAlwaysPatterns, positiveSecondsToSafeMilliseconds, prefixSystemMessage, pruneMapToMaxSize, readJsonIfExists as readDurableJsonFile, readJsonIfExists, readErrorName, readExecApprovalsSnapshot, readFileWithinRoot, readJson, readJson as readJsonFileStrict, readJsonBodyWithLimit, tryReadJson as readJsonFile, tryReadJson, tryReadJsonSync as readJsonFileSync, tryReadJsonSync, readJsonSync, readLocalFileFromRoots, readLocalFileSafely, readRegularFile, readRegularFileSync, readRequestBodyWithLimit, readRootJsonObjectSync, readRootJsonSync, readRootStructuredFileSync, readSecretFileSync, readSecureFile, recordAllowlistMatchesUse, recordAllowlistUse, recordChannelActivity, requestBodyErrorToText, requestExecApprovalViaSocket, requireValidExecTarget, requiresExecApproval, resetChannelActivityForTest, type resetDiagnosticEventsForTest, resetFileLockStateForTest, resetGlobalUndiciStreamTimeoutsForTests, resetHeartbeatEventsForTest, resetSystemEventsForTest, resetWSLStateForTests, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveAgentOutboundIdentity, resolveAllowAlwaysPatternCoverage, resolveAllowAlwaysPatternEntries, resolveAllowAlwaysPatterns, resolveAllowAlwaysPersistenceDecision, resolveAllowlistCandidatePath, resolveApprovalAuditCandidatePath, resolveApprovalAuditTrustPath, resolveApprovalRequestOriginTarget, resolveApprovalRequestSessionConversation, resolveApprovalRequestSessionTarget, resolveChannelNativeApprovalDeliveryPlan, resolveCommandResolution, resolveCommandResolutionFromArgv, resolveNonNegativeIntegerOption as resolveDedupeNonNegativeInteger, resolveDiagnosticFlags, resolveEffectiveHomeDir, resolveEnvHttpProxyAgentOptions, resolveEnvHttpProxyUrl, resolveEnvNormalizationKeys, resolveExecApprovalAllowedDecisions, resolveExecApprovalCommandDisplay, resolveExecApprovalRequestAllowedDecisions, resolveExecApprovalSessionTarget, resolveExecApprovalUnavailableDecisions, resolveExecApprovals, resolveExecApprovalsDisplayPath, resolveExecApprovalsFromFile, resolveExecApprovalsPath, resolveExecApprovalsSocketPath, resolveExecApprovalsTranscriptPath, resolveExecModeFromPolicy, resolveExecModePolicy, resolveExecPolicyForMode, resolveExecutableTrustPath, resolveExecutionTargetCandidatePath, resolveExecutionTargetResolution, resolveExecutionTargetTrustPath, resolveExpiresAtMsFromDurationOrEpoch, resolveExpiresAtMsFromDurationSeconds, resolveExpiresAtMsFromEpochSeconds, resolveFetch, resolveGlobalDedupeCache, resolveHeartbeatIntervalMs, resolveHeartbeatSummaryForAgent, resolveHeartbeatVisibility, resolveHomeRelativePath, resolveIndicatorType, resolveLegacyOutboundSendDepKeys, resolveLocalPathFromRootsSync, resolveOpenedFileRealPathForHandle, resolveOsHomeDir, resolveOsHomeRelativePath, resolveOutboundSendDep, resolvePinnedHostname, resolvePinnedHostnameWithPolicy, resolvePlannedSegmentArgv, resolvePluginApprovalRequestAllowedDecisions, resolvePluginApprovalTimeoutMs, resolvePolicyAllowlistCandidatePath, resolvePolicyTargetCandidatePath, resolvePolicyTargetResolution, resolvePolicyTargetTrustPath, resolvePreferredOpenClawTmpDir, resolveProxyFetchFromEnv, resolveRegularFileAppendFlags, resolveRequiredHomeDir, resolveRequiredOsHomeDir, resolveRetryConfig, resolveSafeBins, resolveSsrFPolicyForUrl, resolveSystemEventDeliveryContext, resolveUserPath, restoreExecApprovalsSnapshot, retainSafeHeadersForCrossOriginRedirectHeaders, retryAsync, root, runTasksWithConcurrency, safeFileURLToPath, sanitizeExecApprovalDisplayText, sanitizeExecApprovalDisplayTextWithStatus, sanitizeExecApprovalWarningText, sanitizeExecApprovalWarningTextWithStatus, sanitizeForPlainText, sanitizeUntrustedFileName, saveExecApprovals, type setDiagnosticsEnabledForProcess, shouldUseEnvHttpProxyForUrl, sleepWithAbort, ssrfPolicyFromAllowPrivateNetwork, ssrfPolicyFromDangerouslyAllowPrivateNetwork, ssrfPolicyFromHttpBaseUrlAllowedHostname, ssrfPolicyFromHttpBaseUrlAllowedOrigin, ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist, ssrfPolicyFromPrivateNetworkOptIn, statRegularFile, statRegularFileSync, stringifyNonErrorCause, stripInternalRuntimeScaffolding, toErrorObject, tokenizeWindowsSegment, truncatePluginApprovalDetail, tryReadSecretFileSync, trySafeFileURLToPath, type waitForDiagnosticEventsDrained, waitForTransportReady, walkDirectory, walkDirectorySync, windowsEscapeArg, withFileLock, withStrictGuardedFetchMode, withTimeout, withTrustedEnvProxyGuardedFetchMode, withTrustedExplicitProxyGuardedFetchMode, wrapFetchWithAbortSignal, writeExternalFileWithinRoot, writeFileWithinRoot, writeJson, writeJson as writeJsonAtomic, writeJsonSync, writeSecretFileAtomic as writePrivateSecretFileAtomic, writeTextAtomic };