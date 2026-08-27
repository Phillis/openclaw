import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { E as validateAgentRunDelegatedAuthority, s as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-cxavoLf6.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-qTUfCaTZ.js";
import { G as ensureExecApprovalsSnapshot, q as loadExecApprovalsAsync } from "./exec-approvals-DkNiV-ux.js";
import { createHmac } from "node:crypto";
//#region src/gateway/agent-runtime-identity-token.ts
const AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT = "openclaw:gateway-agent-runtime-identity-token:v1";
const AGENT_RUNTIME_IDENTITY_TOKEN_KIND = "agent-runtime";
const MESSAGE_ACTION_TOKEN_TTL_MS = 6e4;
const CRON_SELF_MANAGEMENT_TOKEN_TTL_MS = 6e4;
function decodeWorkerTurnClaim(value) {
	if (!isRecord(value) || !isRecord(value.owner) || value.owner.kind !== "worker") return;
	const sessionId = normalizeOptionalString(value.sessionId);
	const claimId = normalizeOptionalString(value.claimId);
	const runId = normalizeOptionalString(value.runId);
	const environmentId = normalizeOptionalString(value.owner.environmentId);
	const placementGeneration = value.placementGeneration;
	const ownerEpoch = value.owner.ownerEpoch;
	if (!sessionId || !claimId || !runId || !environmentId || !Number.isSafeInteger(placementGeneration) || placementGeneration < 0 || !Number.isSafeInteger(ownerEpoch) || ownerEpoch < 0) return;
	return {
		sessionId,
		claimId,
		runId,
		placementGeneration,
		owner: {
			kind: "worker",
			environmentId,
			ownerEpoch
		}
	};
}
function decodeDelegatedAuthority(value, operationalRunInstance) {
	if (!isRecord(value) || value.kind !== "local" && value.kind !== "worker") return;
	const lifecycleGeneration = normalizeOptionalString(value.lifecycleGeneration);
	const claimId = normalizeOptionalString(value.claimId);
	const rawOperational = value.operationalRunInstance;
	const instanceId = isRecord(rawOperational) ? normalizeOptionalString(rawOperational.instanceId) : void 0;
	const runId = isRecord(rawOperational) ? normalizeOptionalString(rawOperational.runId) : void 0;
	if (!lifecycleGeneration || !claimId || instanceId !== operationalRunInstance.instanceId || runId !== operationalRunInstance.runId) return;
	const owner = {
		operationalRunInstance,
		lifecycleGeneration,
		claimId
	};
	if (value.kind === "local") return {
		kind: "local",
		...owner
	};
	const turnClaim = decodeWorkerTurnClaim(value.turnClaim);
	return turnClaim?.runId === operationalRunInstance.runId ? {
		kind: "worker",
		...owner,
		turnClaim
	} : void 0;
}
function decodeStringList(value) {
	if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) return;
	return value.map((entry) => entry.trim()).filter(Boolean);
}
function decodeSessionSpawnContext(value) {
	if (!isRecord(value) || !isRecord(value.inheritedToolPolicy)) return;
	const policy = value.inheritedToolPolicy;
	const allow = decodeStringList(policy.allow);
	const deny = decodeStringList(policy.deny);
	if (policy.version !== 1 || !allow || !deny) return;
	const completionOwnerSessionKey = normalizeOptionalString(value.completionOwnerSessionKey);
	if (value.completionOwnerSessionKey !== void 0 && !completionOwnerSessionKey) return;
	return {
		...completionOwnerSessionKey ? { completionOwnerSessionKey } : {},
		inheritedToolPolicy: {
			version: 1,
			allow,
			deny
		}
	};
}
function decodeCronCreatorAuthorityGrant(value) {
	if (!isRecord(value)) return;
	const runId = normalizeOptionalString(value.runId);
	const token = normalizeOptionalString(value.token);
	return runId && token ? {
		runId,
		token
	} : void 0;
}
async function readSharedAgentRuntimeIdentitySecret() {
	return (await loadExecApprovalsAsync()).socket?.token?.trim() || null;
}
async function requireSharedAgentRuntimeIdentitySecret() {
	const token = (await ensureExecApprovalsSnapshot()).file.socket?.token?.trim();
	if (!token) throw new Error("Unable to mint agent runtime identity token without local socket credentials.");
	return token;
}
function signPayload(secret, payload) {
	return createHmac("sha256", secret).update(AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT).update("\0").update(payload).digest("base64url");
}
function encodePayload(payload) {
	return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function decodeMessageActionContext(value, nowMs) {
	if (!isRecord(value) || typeof value.expiresAtMs !== "number" || !Number.isFinite(value.expiresAtMs) || nowMs >= value.expiresAtMs) return;
	const rawToolContext = value.toolContext;
	const sourceReplyFinal = value.sourceReplyFinal;
	const sourceReplyToolCallId = normalizeOptionalString(value.sourceReplyToolCallId);
	if (sourceReplyFinal !== void 0 && typeof sourceReplyFinal !== "boolean") return;
	if (value.sourceReplyToolCallId !== void 0 && !sourceReplyToolCallId) return;
	if (rawToolContext !== void 0 && !isRecord(rawToolContext)) return;
	const rawCurrentChatType = rawToolContext?.currentChatType;
	const currentChatType = normalizeChatType(typeof rawCurrentChatType === "string" ? rawCurrentChatType : void 0);
	const currentMessageId = rawToolContext?.currentMessageId;
	const replyToMode = rawToolContext?.replyToMode;
	const hasRepliedRef = rawToolContext?.hasRepliedRef;
	if (currentMessageId !== void 0 && typeof currentMessageId !== "string" && typeof currentMessageId !== "number" || replyToMode !== void 0 && replyToMode !== "off" && replyToMode !== "first" && replyToMode !== "all" && replyToMode !== "batched" || hasRepliedRef !== void 0 && (!isRecord(hasRepliedRef) || typeof hasRepliedRef.value !== "boolean")) return;
	const readOptionalBoolean = (key) => {
		const candidate = rawToolContext?.[key];
		return typeof candidate === "boolean" ? candidate : void 0;
	};
	const toolContext = rawToolContext ? {
		currentChannelId: normalizeOptionalString(rawToolContext.currentChannelId),
		currentChatType,
		currentMessagingTarget: normalizeOptionalString(rawToolContext.currentMessagingTarget),
		currentGraphChannelId: normalizeOptionalString(rawToolContext.currentGraphChannelId),
		currentChannelProvider: normalizeOptionalString(rawToolContext.currentChannelProvider),
		currentThreadTs: normalizeOptionalString(rawToolContext.currentThreadTs),
		currentMessageId,
		currentSourceTurnId: normalizeOptionalString(rawToolContext.currentSourceTurnId),
		replyToMode: replyToMode === "off" || replyToMode === "first" || replyToMode === "all" || replyToMode === "batched" ? replyToMode : void 0,
		hasRepliedRef: isRecord(hasRepliedRef) && typeof hasRepliedRef.value === "boolean" ? { value: hasRepliedRef.value } : void 0,
		sameChannelThreadRequired: readOptionalBoolean("sameChannelThreadRequired"),
		skipCrossContextDecoration: readOptionalBoolean("skipCrossContextDecoration")
	} : void 0;
	const context = {
		expiresAtMs: value.expiresAtMs,
		sessionId: normalizeOptionalString(value.sessionId),
		sourceReplySessionKey: normalizeOptionalString(value.sourceReplySessionKey),
		requesterAccountId: normalizeOptionalString(value.requesterAccountId),
		requesterSenderId: normalizeOptionalString(value.requesterSenderId),
		toolContext
	};
	if (sourceReplyFinal === true) {
		if (!sourceReplyToolCallId) return;
		return {
			...context,
			sourceReplyFinal: true,
			sourceReplyToolCallId
		};
	}
	return {
		...context,
		...sourceReplyFinal === false ? { sourceReplyFinal: false } : {},
		...sourceReplyToolCallId ? { sourceReplyToolCallId } : {}
	};
}
function decodePayload(value, nowMs) {
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (!parsed || typeof parsed !== "object") return;
		const raw = parsed;
		if (raw.kind !== AGENT_RUNTIME_IDENTITY_TOKEN_KIND || typeof raw.agentId !== "string" || typeof raw.sessionKey !== "string") return;
		const agentId = normalizeAgentId(raw.agentId);
		const sessionKey = raw.sessionKey.trim();
		const approvalOwnerPluginId = normalizeOptionalString(typeof raw.approvalOwnerPluginId === "string" ? raw.approvalOwnerPluginId : void 0);
		const rawOperationalRunInstance = raw.operationalRunInstance;
		const operationalInstanceId = isRecord(rawOperationalRunInstance) ? normalizeOptionalString(rawOperationalRunInstance.instanceId) : void 0;
		const operationalRunId = isRecord(rawOperationalRunInstance) ? normalizeOptionalString(rawOperationalRunInstance.runId) : void 0;
		const turnSourceAccountId = normalizeOptionalAccountId(typeof raw.turnSourceAccountId === "string" ? raw.turnSourceAccountId : void 0);
		const turnSourceChannel = normalizeOptionalString(typeof raw.turnSourceChannel === "string" ? raw.turnSourceChannel : void 0);
		const turnSourceTo = normalizeOptionalString(typeof raw.turnSourceTo === "string" ? raw.turnSourceTo : void 0);
		const turnSourceThreadId = typeof raw.turnSourceThreadId === "string" || typeof raw.turnSourceThreadId === "number" ? raw.turnSourceThreadId : void 0;
		if (!agentId || !sessionKey || !operationalInstanceId || !operationalRunId) return;
		const operationalRunInstance = Object.freeze({
			instanceId: operationalInstanceId,
			runId: operationalRunId
		});
		const delegatedAuthority = decodeDelegatedAuthority(raw.delegatedAuthority, operationalRunInstance);
		if (!delegatedAuthority) return;
		const messageActionContext = raw.messageActionContext === void 0 ? void 0 : decodeMessageActionContext(raw.messageActionContext, nowMs);
		if (raw.messageActionContext !== void 0 && !messageActionContext) return;
		const rawCronSelfManagement = raw.cronSelfManagementContext;
		const cronSelfManagementJobId = isRecord(rawCronSelfManagement) && typeof rawCronSelfManagement.jobId === "string" ? rawCronSelfManagement.jobId.trim() : "";
		const cronSelfManagementExpiresAtMs = isRecord(rawCronSelfManagement) ? rawCronSelfManagement.expiresAtMs : void 0;
		const cronSelfManagementContext = cronSelfManagementJobId && typeof cronSelfManagementExpiresAtMs === "number" && Number.isFinite(cronSelfManagementExpiresAtMs) && nowMs < cronSelfManagementExpiresAtMs ? {
			jobId: cronSelfManagementJobId,
			expiresAtMs: cronSelfManagementExpiresAtMs
		} : void 0;
		if (rawCronSelfManagement !== void 0 && !cronSelfManagementContext) return;
		const sessionSpawnContext = raw.sessionSpawnContext === void 0 ? void 0 : decodeSessionSpawnContext(raw.sessionSpawnContext);
		if (raw.sessionSpawnContext !== void 0 && !sessionSpawnContext) return;
		const cronToolsAllowCapture = raw.cronToolsAllowCapture === "final-executable-surface" ? raw.cronToolsAllowCapture : void 0;
		if (raw.cronToolsAllowCapture !== void 0 && !cronToolsAllowCapture) return;
		const cronCreatorAuthorityGrant = raw.cronCreatorAuthorityGrant === void 0 ? void 0 : decodeCronCreatorAuthorityGrant(raw.cronCreatorAuthorityGrant);
		if (raw.cronCreatorAuthorityGrant !== void 0 && !cronCreatorAuthorityGrant) return;
		if (cronCreatorAuthorityGrant && !cronToolsAllowCapture) return;
		let executionIdentity;
		if (raw.executionIdentity !== void 0) try {
			executionIdentity = parseExecutionIdentityAdmissionToken(raw.executionIdentity);
		} catch {
			return;
		}
		if (executionIdentity?.runId !== operationalRunId) executionIdentity = void 0;
		return {
			kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
			agentId,
			sessionKey,
			operationalRunInstance,
			delegatedAuthority,
			...approvalOwnerPluginId ? { approvalOwnerPluginId } : {},
			...turnSourceChannel ? { turnSourceChannel } : {},
			...turnSourceTo ? { turnSourceTo } : {},
			...turnSourceAccountId ? { turnSourceAccountId } : {},
			...turnSourceThreadId !== void 0 ? { turnSourceThreadId } : {},
			...messageActionContext ? { messageActionContext } : {},
			...cronSelfManagementContext ? { cronSelfManagementContext } : {},
			...sessionSpawnContext ? { sessionSpawnContext } : {},
			...cronToolsAllowCapture ? { cronToolsAllowCapture } : {},
			...cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant } : {},
			...executionIdentity ? { executionIdentity } : {}
		};
	} catch {
		return;
	}
}
function prepareAgentRuntimeIdentityTokenPayload(params) {
	const operationalInstanceId = normalizeOptionalString(params.operationalRunInstance.instanceId);
	const operationalRunId = normalizeOptionalString(params.operationalRunInstance.runId);
	if (!operationalInstanceId || !operationalRunId) throw new Error("agent runtime identity requires an operational run instance");
	const activeAuthority = getActiveAgentRunDelegatedAuthority({
		instanceId: operationalInstanceId,
		runId: operationalRunId
	});
	if (!activeAuthority) throw new Error("agent runtime identity requires active delegated run authority");
	if (params.workerTurnClaim && (params.workerTurnClaim.owner.kind !== "worker" || params.workerTurnClaim.runId !== operationalRunId)) throw new Error("worker delegated authority disagrees with the operational run");
	const delegatedAuthority = params.workerTurnClaim ? {
		kind: "worker",
		...activeAuthority,
		turnClaim: params.workerTurnClaim
	} : {
		kind: "local",
		...activeAuthority
	};
	if (params.cronCreatorAuthorityGrant && params.cronToolsAllowCapture !== "final-executable-surface") throw new Error("cron creator authority grants require final tool-surface provenance");
	if (params.messageActionContext?.sourceReplyFinal === true && !normalizeOptionalString(params.messageActionContext.sourceReplyToolCallId)) throw new Error("terminal source reply requires tool-call correlation");
	const messageActionContext = params.messageActionContext ? {
		...params.messageActionContext,
		expiresAtMs: Math.min(params.messageActionContext.expiresAtMs, Date.now() + MESSAGE_ACTION_TOKEN_TTL_MS)
	} : void 0;
	const turnSourceAccountId = normalizeOptionalAccountId(params.turnSourceAccountId);
	const turnSourceChannel = normalizeOptionalString(params.turnSourceChannel);
	const turnSourceTo = normalizeOptionalString(params.turnSourceTo);
	const turnSourceThreadId = typeof params.turnSourceThreadId === "string" ? normalizeOptionalString(params.turnSourceThreadId) : params.turnSourceThreadId;
	const cronSelfManagementJobId = normalizeOptionalString(params.cronSelfManagementJobId);
	const cronSelfManagementContext = cronSelfManagementJobId ? {
		jobId: cronSelfManagementJobId,
		expiresAtMs: Date.now() + CRON_SELF_MANAGEMENT_TOKEN_TTL_MS
	} : void 0;
	return encodePayload({
		kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
		agentId: normalizeAgentId(params.agentId),
		sessionKey: params.sessionKey.trim(),
		operationalRunInstance: {
			instanceId: operationalInstanceId,
			runId: operationalRunId
		},
		delegatedAuthority,
		...normalizeOptionalString(params.approvalOwnerPluginId) ? { approvalOwnerPluginId: normalizeOptionalString(params.approvalOwnerPluginId) } : {},
		...turnSourceChannel ? { turnSourceChannel } : {},
		...turnSourceTo ? { turnSourceTo } : {},
		...turnSourceAccountId ? { turnSourceAccountId } : {},
		...turnSourceThreadId !== void 0 ? { turnSourceThreadId } : {},
		...messageActionContext ? { messageActionContext } : {},
		...cronSelfManagementContext ? { cronSelfManagementContext } : {},
		...params.cronToolsAllowCapture === "final-executable-surface" ? { cronToolsAllowCapture: params.cronToolsAllowCapture } : {},
		...params.cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant: params.cronCreatorAuthorityGrant } : {},
		...params.sessionSpawnContext ? { sessionSpawnContext: params.sessionSpawnContext } : {},
		...params.executionIdentityToken?.runId === operationalRunId ? { executionIdentity: params.executionIdentityToken } : {}
	});
}
/** Measure the exact ASCII token size without reading signing credentials or minting a bearer. */
function measureAgentRuntimeIdentityTokenBytes(params) {
	const payload = prepareAgentRuntimeIdentityTokenPayload(params);
	return Buffer.byteLength(`${payload}.${signPayload("", payload)}`, "utf8");
}
/** Mint an opaque token that lets trusted local agent-tool clients identify their agent. */
async function mintAgentRuntimeIdentityToken(params) {
	const payload = prepareAgentRuntimeIdentityTokenPayload(params);
	return `${payload}.${signPayload(await requireSharedAgentRuntimeIdentitySecret(), payload)}`;
}
/** Validate a presented agent runtime token and return the internal caller identity. */
async function verifyAgentRuntimeIdentityToken(value, nowMs) {
	const token = value?.trim();
	if (!token) return;
	const [payloadPart, signature, ...extra] = token.split(".");
	if (!payloadPart || !signature || extra.length > 0) return;
	const sharedSecret = await readSharedAgentRuntimeIdentitySecret();
	if (!sharedSecret || !safeEqualSecret(signature, signPayload(sharedSecret, payloadPart))) return;
	const payload = decodePayload(payloadPart, nowMs ?? Date.now());
	if (!payload) return;
	return {
		kind: "agentRuntime",
		agentId: payload.agentId,
		sessionKey: payload.sessionKey,
		operationalRunInstance: payload.operationalRunInstance,
		delegatedAuthority: payload.delegatedAuthority,
		...payload.approvalOwnerPluginId ? { approvalOwnerPluginId: payload.approvalOwnerPluginId } : {},
		...payload.executionIdentity ? { executionIdentity: payload.executionIdentity } : {},
		...payload.turnSourceChannel ? { turnSourceChannel: payload.turnSourceChannel } : {},
		...payload.turnSourceTo ? { turnSourceTo: payload.turnSourceTo } : {},
		...payload.turnSourceAccountId ? { turnSourceAccountId: payload.turnSourceAccountId } : {},
		...payload.turnSourceThreadId !== void 0 ? { turnSourceThreadId: payload.turnSourceThreadId } : {},
		...payload.messageActionContext ? { messageActionContext: payload.messageActionContext } : {},
		...payload.cronSelfManagementContext ? { cronSelfManagementContext: payload.cronSelfManagementContext } : {},
		...payload.cronToolsAllowCapture ? { cronToolsAllowCapture: payload.cronToolsAllowCapture } : {},
		...payload.cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant: payload.cronCreatorAuthorityGrant } : {},
		...payload.sessionSpawnContext ? { sessionSpawnContext: payload.sessionSpawnContext } : {}
	};
}
function validateAgentRuntimeDelegatedAuthority(authority, placements) {
	if (!validateAgentRunDelegatedAuthority(authority)) return false;
	return authority.kind === "local" ? true : placements?.validateTurnClaim?.(authority.turnClaim) === true;
}
/** Builds the use-time approval gate from the run owner and canonical worker store. */
function createAgentRuntimeApprovalAuthorityValidator(placements) {
	return (identity) => validateAgentRuntimeDelegatedAuthority(identity.delegatedAuthority, placements);
}
//#endregion
export { verifyAgentRuntimeIdentityToken as i, measureAgentRuntimeIdentityTokenBytes as n, mintAgentRuntimeIdentityToken as r, createAgentRuntimeApprovalAuthorityValidator as t };
