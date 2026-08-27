import { a as resolveApprovalApprovers, t as createChannelApprovalAuth } from "./approval-auth-helpers-Bs9uwexj.js";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-DoqGC04V.js";
import { m as getExecApprovalReplyMetadata } from "./exec-approval-reply-CTrYYg-6.js";
import { n as isChannelExecApprovalClientEnabledFromConfig, r as isChannelExecApprovalTargetRecipient, t as createChannelExecApprovalProfile } from "./approval-client-helpers-CLJpuj7I.js";
import "./approval-client-runtime-LJSyC93N.js";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-BbV7ZcKh.js";
import "./approval-native-runtime-tP3eeJgJ.js";
import { i as resolveMatrixAccount, r as resolveDefaultMatrixAccountId } from "./accounts-CfCyqoAF.js";
import { t as normalizeMatrixApproverId } from "./approval-ids-D2wvDGkv.js";
//#region extensions/matrix/src/approval-auth.ts
const matrixApproval = createChannelApprovalAuth({
	channelLabel: "Matrix",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveMatrixAccount({
			cfg,
			accountId
		}).config.dm?.allowFrom };
	},
	normalizeApprover: normalizeMatrixApproverId
});
const getMatrixApprovalAuthApprovers = matrixApproval.resolveApprovers;
const matrixApprovalAuth = matrixApproval.approvalAuth;
//#endregion
//#region extensions/matrix/src/exec-approvals.ts
function normalizeMatrixExecApproverId(value) {
	const normalized = normalizeMatrixApproverId(value);
	return normalized === "*" ? void 0 : normalized;
}
function resolveMatrixExecApprovalConfig(params) {
	const account = resolveMatrixAccount(params);
	const config = account.config.execApprovals;
	if (!config) return;
	return {
		...config,
		enabled: account.enabled && account.configured ? config.enabled : false
	};
}
function isMatrixExecApprovalAccountEligible(params) {
	const account = resolveMatrixAccount(params);
	if (!account.enabled || !account.configured) return false;
	const config = resolveMatrixExecApprovalConfig(params);
	const filters = config?.enabled ? {
		agentFilter: config.agentFilter,
		sessionFilter: config.sessionFilter
	} : {
		agentFilter: void 0,
		sessionFilter: void 0
	};
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	}) && matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: filters.agentFilter,
		sessionFilter: filters.sessionFilter
	});
}
function matchesMatrixRequestAccount(params) {
	const accountId = params.accountId ?? resolveDefaultMatrixAccountId(params.cfg);
	return doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "matrix",
		defaultAccountId: resolveDefaultMatrixAccountId(params.cfg),
		eligibleAccountIds: isMatrixExecApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	});
}
function getMatrixExecApprovalApprovers(params) {
	const account = resolveMatrixAccount(params).config;
	return resolveApprovalApprovers({
		explicit: account.execApprovals?.approvers,
		allowFrom: account.dm?.allowFrom,
		normalizeApprover: normalizeMatrixExecApproverId
	});
}
function getMatrixApprovalApprovers(params) {
	if (params.approvalKind === "plugin") return getMatrixApprovalAuthApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return getMatrixExecApprovalApprovers(params);
}
function isMatrixExecApprovalTargetRecipient(params) {
	return isChannelExecApprovalTargetRecipient({
		...params,
		channel: "matrix",
		normalizeSenderId: normalizeMatrixApproverId,
		matchTarget: ({ target, normalizedSenderId }) => normalizeMatrixApproverId(target.to) === normalizedSenderId
	});
}
const matrixExecApprovalProfile = createChannelExecApprovalProfile({
	resolveConfig: resolveMatrixExecApprovalConfig,
	resolveApprovers: getMatrixExecApprovalApprovers,
	normalizeSenderId: normalizeMatrixApproverId,
	isTargetRecipient: isMatrixExecApprovalTargetRecipient,
	matchesRequestAccount: (params) => matchesMatrixRequestAccount({
		...params,
		approvalKind: "exec"
	})
});
const isMatrixExecApprovalClientEnabled = matrixExecApprovalProfile.isClientEnabled;
const isMatrixExecApprovalAuthorizedSender = matrixExecApprovalProfile.isAuthorizedSender;
const resolveMatrixExecApprovalTarget = matrixExecApprovalProfile.resolveTarget;
function isMatrixApprovalClientEnabled(params) {
	if (params.approvalKind === "exec") return isMatrixExecApprovalClientEnabled(params);
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: resolveMatrixExecApprovalConfig(params)?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	});
}
function isMatrixAnyApprovalClientEnabled(params) {
	return isMatrixApprovalClientEnabled({
		...params,
		approvalKind: "exec"
	}) || isMatrixApprovalClientEnabled({
		...params,
		approvalKind: "plugin"
	});
}
function shouldHandleMatrixApprovalRequest(params) {
	if (params.approvalKind !== "exec" && params.approvalKind !== "plugin") return false;
	if (!matchesMatrixRequestAccount({
		...params,
		approvalKind: params.approvalKind
	})) return false;
	const config = resolveMatrixExecApprovalConfig(params);
	if (!isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers({
			...params,
			approvalKind: params.approvalKind
		}).length
	})) return false;
	return matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function buildFilterCheckRequest(params) {
	if (params.metadata.approvalKind === "plugin") return {
		id: params.metadata.approvalId,
		request: {
			title: "Plugin Approval Required",
			description: "",
			agentId: params.metadata.agentId ?? null,
			sessionKey: params.metadata.sessionKey ?? null
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
	return {
		id: params.metadata.approvalId,
		request: {
			command: "",
			agentId: params.metadata.agentId ?? null,
			sessionKey: params.metadata.sessionKey ?? null
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
}
function shouldSuppressLocalMatrixExecApprovalPrompt(params) {
	if (!matrixExecApprovalProfile.shouldSuppressLocalPrompt(params)) return false;
	const metadata = getExecApprovalReplyMetadata(params.payload);
	if (!metadata) return false;
	const request = buildFilterCheckRequest({ metadata });
	return shouldHandleMatrixApprovalRequest({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: metadata.approvalKind,
		request
	});
}
//#endregion
export { isMatrixExecApprovalAuthorizedSender as a, shouldHandleMatrixApprovalRequest as c, matrixApprovalAuth as d, isMatrixApprovalClientEnabled as i, shouldSuppressLocalMatrixExecApprovalPrompt as l, getMatrixExecApprovalApprovers as n, isMatrixExecApprovalClientEnabled as o, isMatrixAnyApprovalClientEnabled as r, resolveMatrixExecApprovalTarget as s, getMatrixApprovalApprovers as t, getMatrixApprovalAuthApprovers as u };
