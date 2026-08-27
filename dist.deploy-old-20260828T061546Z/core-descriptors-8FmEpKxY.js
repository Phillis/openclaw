import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import "./session-key-Dbce_H9p.js";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-DRF7yKG5.js";
import { o as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import "./session-accessor-fcDZuc2H.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-CSCF74bk.js";
import "./sessions-BI8dPUCI.js";
import { s as resolveAuthorizedBoardViewTicketClaims } from "./board-view-ticket-CzaUvvHs.js";
//#region src/shared/gateway-method-policy.ts
const RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES = [
	"exec.approvals.",
	"config.",
	"wizard.",
	"update."
];
const RESERVED_ADMIN_GATEWAY_METHOD_SCOPE = "operator.admin";
/** Return whether a gateway method is reserved for operator admin calls. */
function isReservedAdminGatewayMethod(method) {
	return RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES.some((prefix) => method.startsWith(prefix));
}
/** Resolve the mandatory scope for reserved gateway methods. */
function resolveReservedGatewayMethodScope(method) {
	if (!isReservedAdminGatewayMethod(method)) return;
	return RESERVED_ADMIN_GATEWAY_METHOD_SCOPE;
}
/** Coerce plugin-declared scopes away from unsafe reserved gateway method scopes. */
function normalizePluginGatewayMethodScope(method, scope) {
	const reservedScope = resolveReservedGatewayMethodScope(method);
	if (!reservedScope || !scope || scope === reservedScope) return {
		scope,
		coercedToReservedAdmin: false
	};
	return {
		scope: reservedScope,
		coercedToReservedAdmin: true
	};
}
//#endregion
//#region src/gateway/session-sharing-target-input.ts
function resolveSessionGroupMutationTargetsByName(cfg) {
	const targetsByName = /* @__PURE__ */ new Map();
	for (const storeTarget of resolveAllAgentSessionStoreTargetsSync(cfg)) for (const { sessionKey, entry } of listSessionEntriesReadOnly({
		agentId: storeTarget.agentId,
		storePath: storeTarget.storePath
	})) {
		const groupName = normalizeOptionalString(entry.category);
		if (!groupName) continue;
		const targets = targetsByName.get(groupName) ?? [];
		targets.push({
			sessionKey,
			agentId: storeTarget.agentId
		});
		targetsByName.set(groupName, targets);
	}
	return targetsByName;
}
const SESSION_TARGET_FIELDS_BY_METHOD = new Map([
	["agent", ["sessionKey"]],
	["board.event", ["sessionKey"]],
	["board.update", ["sessionKey"]],
	["board.widget.grant", ["sessionKey"]],
	["board.widget.put", ["sessionKey"]],
	["chat.abort", ["sessionKey"]],
	["chat.inject", ["sessionKey"]],
	["chat.send", ["sessionKey"]],
	["mcp.app.callTool", ["sessionKey"]],
	["mcp.app.updateModelContext", ["sessionKey"]],
	["message.action", ["sessionKey"]],
	["plugins.sessionAction", ["sessionKey"]],
	["progressCard.get", ["sessionKey"]],
	["progressCard.put", ["sessionKey"]],
	["send", ["sessionKey"]],
	["session.discussion.open", ["sessionKey"]],
	["sessions.abort", ["key"]],
	["sessions.assignOwner", ["key"]],
	["sessions.companion.ask", ["sessionKey"]],
	["sessions.companion.reset", ["sessionKey"]],
	["sessions.companion.state", ["sessionKey"]],
	["sessions.compaction.branch", ["key"]],
	["sessions.compaction.restore", ["key"]],
	["sessions.compact", ["key"]],
	["sessions.create", ["key", "parentSessionKey"]],
	["sessions.delete", ["key"]],
	["sessions.dispatch", ["key"]],
	["sessions.files.set", ["sessionKey"]],
	["sessions.github.publish", ["sessionKey"]],
	["sessions.fork", ["sessionKey"]],
	["sessions.patch", ["key"]],
	["sessions.pluginPatch", ["key"]],
	...["sessions.move", "sessions.reclaim"].map((method) => [method, ["key"]]),
	["sessions.recover", ["key"]],
	["sessions.reset", ["key"]],
	["sessions.rewind", ["sessionKey"]],
	["sessions.send", ["key"]],
	["sessions.steer", ["key"]],
	["sessions.branches.switch", ["sessionKey"]],
	...[
		"taskSuggestions.create",
		"talk.client.close",
		"talk.client.create",
		"talk.client.steer",
		"talk.client.toolCall",
		"talk.client.transcript",
		"talk.session.create",
		"talk.session.steer",
		"wake"
	].map((method) => [method, ["sessionKey"]]),
	["tools.invoke", ["sessionKey"]]
]);
const REQUIRED_SESSION_TARGET_METHODS = /* @__PURE__ */ new Set([
	"board.action",
	"board.event",
	"board.update",
	"board.widget.grant",
	"board.widget.put",
	"chat.abort",
	"chat.inject",
	"chat.send",
	"mcp.app.callTool",
	"mcp.app.updateModelContext",
	"progressCard.get",
	"progressCard.put",
	"session.discussion.open",
	"sessions.abort",
	"sessions.assignOwner",
	"sessions.branches.switch",
	"sessions.compact",
	"sessions.companion.reset",
	"sessions.compaction.branch",
	"sessions.compaction.restore",
	"sessions.delete",
	"sessions.dispatch",
	"sessions.files.set",
	"sessions.fork",
	"sessions.groups.delete",
	"sessions.groups.rename",
	"sessions.groups.update",
	"sessions.github.publish",
	"sessions.patch",
	"sessions.pluginPatch",
	"sessions.reclaim",
	"sessions.recover",
	"sessions.move",
	"sessions.reset",
	"sessions.rewind",
	"sessions.send",
	"sessions.steer",
	"talk.client.close",
	"talk.client.steer",
	"talk.client.toolCall",
	"talk.client.transcript",
	"taskSuggestions.create"
]);
const APPROVAL_SESSION_TARGET_METHODS = /* @__PURE__ */ new Set([
	"approval.resolve",
	"exec.approval.resolve",
	"plugin.approval.resolve"
]);
const READ_ONLY_SESSION_TARGET_METHODS = /* @__PURE__ */ new Set(["sessions.companion.ask", "sessions.companion.state"]);
const LEGACY_PROFILE_INDEPENDENT_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"talk.client.close",
	"talk.client.create",
	"talk.client.steer",
	"talk.client.toolCall",
	"talk.client.transcript",
	"talk.session.create",
	"talk.session.steer",
	"wake"
]);
function sessionMutationTargetFields(method) {
	return READ_ONLY_SESSION_TARGET_METHODS.has(method) ? [] : SESSION_TARGET_FIELDS_BY_METHOD.get(method) ?? [];
}
function isRequiredSessionTargetMethod(method) {
	return REQUIRED_SESSION_TARGET_METHODS.has(method);
}
function isApprovalSessionTargetMethod(method) {
	return APPROVAL_SESSION_TARGET_METHODS.has(method);
}
function isSessionProfileDependentMethod(method) {
	if (LEGACY_PROFILE_INDEPENDENT_MUTATION_METHODS.has(method)) return false;
	return SESSION_TARGET_FIELDS_BY_METHOD.has(method) || REQUIRED_SESSION_TARGET_METHODS.has(method) || APPROVAL_SESSION_TARGET_METHODS.has(method) || method === "sessions.patchMany";
}
function resolveDirectSessionTargets(method, params) {
	if (method === "sessions.create" || method === "sessions.list") return [];
	if (!params || typeof params !== "object" || Array.isArray(params)) return [];
	const record = params;
	const candidates = [record.key, record.sessionKey];
	if (Array.isArray(record.keys)) candidates.push(...record.keys);
	if (Array.isArray(record.sessionKeys)) candidates.push(...record.sessionKeys);
	const agentId = normalizeOptionalString(record.agentId);
	return candidates.flatMap((candidate) => typeof candidate === "string" ? [{
		sessionKey: candidate,
		...agentId ? { agentId } : {}
	}] : []);
}
function resolveDirectIncognitoTargets(method, params) {
	return resolveDirectSessionTargets(method, params).filter((target) => isIncognitoSessionKey(canonicalizeSessionKeyForAgent(target.agentId ?? "main", target.sessionKey)));
}
function readSessionSharingStringParam(params, key) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return;
	return normalizeOptionalString(params[key]);
}
function resolveSessionGroupMutationTargets(params) {
	const groupName = readSessionSharingStringParam(params.requestParams, "name");
	return groupName ? resolveSessionGroupMutationTargetsByName(params.getCfg()).get(groupName) ?? [] : void 0;
}
function resolveApprovalSessionTarget(method, params, context) {
	const id = readSessionSharingStringParam(params, "id");
	if (!id) return;
	const kind = readSessionSharingStringParam(params, "kind");
	const manager = method === "plugin.approval.resolve" || kind === "plugin" ? context.pluginApprovalManager : method === "approval.resolve" && kind === "system-agent" ? context.systemAgentApprovalManager : context.execApprovalManager;
	const resolvedId = manager?.lookupApprovalId(id, { includeResolved: true });
	const recordId = resolvedId?.kind === "exact" || resolvedId?.kind === "prefix" ? resolvedId.id : id;
	const request = manager?.getSnapshot(recordId)?.request;
	const sessionKey = readSessionSharingStringParam(request, "sessionKey");
	const agentId = readSessionSharingStringParam(request, "agentId");
	return sessionKey ? {
		sessionKey,
		...agentId ? { agentId } : {}
	} : void 0;
}
function resolveSessionMutationTargets(params) {
	if (params.method === "sessions.patchMany") {
		const targets = params.requestParams && typeof params.requestParams === "object" && "targets" in params.requestParams ? params.requestParams.targets : void 0;
		return Array.isArray(targets) ? targets.slice(0, 101).flatMap((target) => {
			const sessionKey = readSessionSharingStringParam(target, "key");
			const agentId = readSessionSharingStringParam(target, "agentId");
			return sessionKey ? [{
				sessionKey,
				...agentId ? { agentId } : {}
			}] : [];
		}) : void 0;
	}
	if (params.method === "sessions.groups.rename" || params.method === "sessions.groups.delete" || params.method === "sessions.groups.update") return resolveSessionGroupMutationTargets({
		getCfg: params.getCfg,
		requestParams: params.requestParams
	});
	if (isApprovalSessionTargetMethod(params.method)) {
		const target = resolveApprovalSessionTarget(params.method, params.requestParams, params.context);
		return target ? [target] : void 0;
	}
	const requestedAgentId = readSessionSharingStringParam(params.requestParams, "agentId");
	const directTargets = [];
	for (const field of sessionMutationTargetFields(params.method)) {
		const sessionKey = readSessionSharingStringParam(params.requestParams, field);
		if (!sessionKey) continue;
		const parentUsesRequestedAgent = field !== "parentSessionKey" || ["global", "unknown"].includes(sessionKey.toLowerCase());
		directTargets.push({
			sessionKey,
			...requestedAgentId && parentUsesRequestedAgent ? { agentId: requestedAgentId } : {}
		});
	}
	if (directTargets.length) return directTargets;
	if (params.method === "board.event" || params.method === "board.action") {
		const ticket = readSessionSharingStringParam(params.requestParams, "ticket");
		const claims = ticket ? resolveAuthorizedBoardViewTicketClaims(ticket, { gatewayContext: params.context }) : void 0;
		if (!claims || requestedAgentId && requestedAgentId !== claims.agentId) return;
		return [{
			sessionKey: claims.sessionKey,
			...claims.agentId ? { agentId: claims.agentId } : {}
		}];
	}
	if (params.method !== "sessions.abort") return;
	const runId = readSessionSharingStringParam(params.requestParams, "runId");
	const run = runId ? params.context.chatAbortControllers.get(runId) : void 0;
	return run ? [{
		sessionKey: run.sessionKey,
		...run.agentId ? { agentId: run.agentId } : {}
	}] : void 0;
}
//#endregion
//#region src/gateway/methods/descriptor.ts
/** Scope marker for methods that only authenticated node clients may call. */
const NODE_GATEWAY_METHOD_SCOPE = "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
const DYNAMIC_GATEWAY_METHOD_SCOPE = "dynamic";
//#endregion
//#region src/gateway/methods/core-descriptors.ts
const PROFILE_DEPENDENT_CORE_METHODS = /* @__PURE__ */ new Set([
	"agent.wait",
	"talk.config",
	"ui.command",
	"users.linkEmail",
	"users.setAvatar",
	"users.setDisplayName",
	"users.setRole"
]);
const PROFILE_DEPENDENT_CORE_PREFIXES = [
	"artifacts.",
	"chat.",
	"conversations.",
	"controlUi.session",
	"mcp.app.",
	"openclaw.approval.",
	"openclaw.chat",
	"progressCard.",
	"projects.",
	"secrets.",
	"session.",
	"sessions.",
	"taskSuggestions.",
	"tasks.",
	"terminal.",
	"users.prefs."
];
/** Classifies core methods whose behavior reads or mutates durable user/session ownership. */
function isCoreGatewayMethodProfileDependent(method) {
	return isSessionProfileDependentMethod(method) || PROFILE_DEPENDENT_CORE_METHODS.has(method) || PROFILE_DEPENDENT_CORE_PREFIXES.some((prefix) => method.startsWith(prefix));
}
const CORE_GATEWAY_METHOD_SPEC_LIST = [
	[
		"health",
		"health",
		"operator.read",
		"<=2026.7"
	],
	[
		"diagnostics.stability",
		"diagnostics",
		"operator.read",
		"<=2026.7"
	],
	[
		"doctor.memory.status",
		"doctor",
		"operator.read",
		"<=2026.7"
	],
	[
		"doctor.memory.dreamDiary",
		"doctor",
		"operator.read",
		"<=2026.7"
	],
	[
		"doctor.memory.backfillDreamDiary",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.resetDreamDiary",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.resetGroundedShortTerm",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.repairDreamingArtifacts",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"doctor.memory.dedupeDreamDiary",
		"doctor",
		"operator.write",
		"<=2026.7"
	],
	[
		"logs.tail",
		"logs",
		"operator.read",
		"<=2026.7"
	],
	[
		"channels.status",
		"channels",
		"operator.read",
		"<=2026.7"
	],
	[
		"channels.start",
		"channels",
		"operator.admin",
		"<=2026.7"
	],
	[
		"channels.stop",
		"channels",
		"operator.admin",
		"<=2026.7"
	],
	[
		"channels.logout",
		"channels",
		"operator.admin",
		"<=2026.7"
	],
	[
		"status",
		"health",
		"operator.read",
		"<=2026.7"
	],
	[
		"usage.status",
		"usage",
		"operator.read",
		"<=2026.7"
	],
	[
		"usage.cost",
		"usage",
		"operator.read",
		"<=2026.7"
	],
	[
		"usage.ledger",
		"usage",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"tts.status",
		"tts",
		"operator.read",
		"<=2026.7"
	],
	[
		"tts.providers",
		"tts",
		"operator.read",
		"<=2026.7"
	],
	[
		"tts.personas",
		"tts",
		"operator.read",
		"<=2026.7"
	],
	[
		"tts.enable",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.disable",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.convert",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.setProvider",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"tts.setPersona",
		"tts",
		"operator.write",
		"<=2026.7"
	],
	[
		"config.get",
		"config",
		"operator.read",
		"<=2026.7"
	],
	[
		"config.set",
		"config",
		"operator.admin",
		"<=2026.7"
	],
	[
		"config.apply",
		"config",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"config.patch",
		"config",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"config.schema",
		"config",
		"operator.read",
		"<=2026.7"
	],
	[
		"config.schema.lookup",
		"config",
		"operator.read",
		"<=2026.7"
	],
	[
		"exec.approvals.get",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approvals.set",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approvals.node.get",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approvals.node.set",
		"exec-approvals",
		"operator.admin",
		"<=2026.7"
	],
	[
		"exec.approval.get",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.list",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.request",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.waitDecision",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"exec.approval.resolve",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"question.request",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"question.waitAnswer",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"question.resolve",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"question.get",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"question.list",
		null,
		"operator.questions",
		"2026.7"
	],
	[
		"plugin.approval.list",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"plugin.approval.request",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"plugin.approval.waitDecision",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"plugin.approval.resolve",
		null,
		"operator.approvals",
		"<=2026.7"
	],
	[
		"plugins.uiDescriptors",
		"plugin-host-hooks",
		"operator.read",
		"<=2026.7"
	],
	[
		"plugins.sessionAction",
		"plugin-host-hooks",
		"dynamic",
		"<=2026.7"
	],
	[
		"openclaw.chat",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.chat.history",
		"system-agent",
		"operator.admin",
		"2026.7"
	],
	[
		"openclaw.changes.list",
		"system-changes",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.approval.list",
		"system-agent",
		"operator.approvals",
		"<=2026.7"
	],
	[
		"openclaw.setup.detect",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.setup.activate",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.setup.auth.start",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"openclaw.setup.prepare.start",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.start",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.next",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.cancel",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wizard.status",
		"wizard",
		"operator.admin",
		"<=2026.7"
	],
	[
		"talk.catalog",
		"talk",
		"operator.read",
		"<=2026.7"
	],
	[
		"talk.config",
		"talk",
		"dynamic",
		"<=2026.7"
	],
	[
		"talk.client.create",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.transcript",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.close",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.toolCall",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.client.steer",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.create",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.appendAudio",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.cancelOutput",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.acknowledgeMark",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.submitToolResult",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.steer",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.session.close",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.speak",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"talk.mode",
		"talk",
		"operator.talk",
		"<=2026.7"
	],
	[
		"commands.list",
		"commands",
		"operator.read",
		"<=2026.7"
	],
	[
		"models.list",
		"models",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"models.authStatus",
		"models-auth-status",
		"operator.read",
		"<=2026.7"
	],
	[
		"models.authLogout",
		"models-auth-status",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"tools.catalog",
		"tools-catalog",
		"operator.read",
		"<=2026.7"
	],
	[
		"tools.effective",
		"tools-effective",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"tools.invoke",
		"tools-invoke",
		"operator.write",
		"<=2026.7"
	],
	[
		"mcp.app.view",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.listTools",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.listResources",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.listResourceTemplates",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.readResource",
		"mcp-app",
		"operator.read",
		"<=2026.7"
	],
	[
		"mcp.app.callTool",
		"mcp-app",
		"operator.write",
		"<=2026.7"
	],
	[
		"mcp.app.updateModelContext",
		"mcp-app",
		"operator.write",
		"<=2026.7"
	],
	[
		"board.get",
		"board",
		"operator.read",
		"<=2026.7"
	],
	[
		"board.update",
		"board",
		"operator.write",
		"<=2026.7"
	],
	[
		"board.widget.put",
		"board",
		"operator.write",
		"<=2026.7"
	],
	[
		"board.widget.grant",
		"board",
		"operator.approvals",
		"<=2026.7"
	],
	[
		"board.widget.appView",
		"board",
		"operator.read",
		"2026.7"
	],
	[
		"board.event",
		"board",
		"operator.write",
		"<=2026.7"
	],
	[
		"audit.list",
		"audit",
		"operator.read",
		"2026.7"
	],
	[
		"audit.activity.list",
		"audit",
		"operator.read",
		"2026.7"
	],
	[
		"users.list",
		"users",
		"operator.read",
		"<=2026.7"
	],
	[
		"users.self",
		"users",
		"operator.write",
		"<=2026.7"
	],
	[
		"users.linkEmail",
		"users",
		"operator.admin",
		"<=2026.7"
	],
	[
		"users.setDisplayName",
		"users",
		"operator.write",
		"<=2026.7"
	],
	[
		"users.setAvatar",
		"users",
		"operator.write",
		"<=2026.7"
	],
	[
		"users.setRole",
		"users",
		"operator.admin",
		"2026.8"
	],
	[
		"tasks.list",
		"tasks",
		"operator.read",
		"<=2026.7"
	],
	[
		"tasks.get",
		"tasks",
		"operator.read",
		"<=2026.7"
	],
	[
		"tasks.cancel",
		"tasks",
		"operator.write",
		"<=2026.7"
	],
	[
		"taskSuggestions.list",
		"task-suggestions",
		"operator.read",
		"<=2026.7"
	],
	[
		"taskSuggestions.create",
		"task-suggestions",
		"operator.write",
		"<=2026.7"
	],
	[
		"taskSuggestions.accept",
		"task-suggestions",
		"operator.admin",
		"<=2026.7"
	],
	[
		"taskSuggestions.dismiss",
		"task-suggestions",
		"operator.write",
		"<=2026.7"
	],
	[
		"environments.list",
		"environments",
		"operator.read",
		"2026.7"
	],
	[
		"environments.status",
		"environments",
		"operator.read",
		"2026.7"
	],
	[
		"worktrees.list",
		"worktrees",
		"operator.read",
		"2026.7"
	],
	[
		"worktrees.branches",
		"worktrees",
		"operator.write",
		"2026.7"
	],
	[
		"fs.listDir",
		"fs",
		"dynamic",
		"<=2026.7"
	],
	[
		"worktrees.create",
		"worktrees",
		"operator.write",
		"2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"worktrees.remove",
		"worktrees",
		"operator.admin",
		"2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"worktrees.restore",
		"worktrees",
		"operator.admin",
		"2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"worktrees.gc",
		"worktrees",
		"operator.admin",
		"2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"agents.list",
		"agents",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.create",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"agents.update",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"agents.delete",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"agents.files.list",
		"agents",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.files.get",
		"agents",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.files.set",
		"agents",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.files.list",
		"sessions-files",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.files.get",
		"sessions-files",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.files.set",
		"sessions-files",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.files.reveal",
		"sessions-files",
		"operator.admin",
		"<=2026.7"
	],
	[
		"artifacts.list",
		"artifacts",
		"operator.read",
		"<=2026.7"
	],
	[
		"artifacts.get",
		"artifacts",
		"operator.read",
		"<=2026.7"
	],
	[
		"artifacts.download",
		"artifacts",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.status",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.search",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.detail",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.securityVerdicts",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.skillCard",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.bins",
		"skills",
		"node",
		"<=2026.7"
	],
	[
		"skills.upload.begin",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.upload.chunk",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.upload.commit",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.install",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.update",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.curator.status",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.curator.pin",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.curator.unpin",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.curator.restore",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.list",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.proposals.inspect",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.proposals.historyStatus",
		"skills",
		"operator.read",
		"<=2026.7"
	],
	[
		"skills.proposals.historyScan",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.create",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.update",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.revise",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.requestRevision",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.apply",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.reject",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"skills.proposals.quarantine",
		"skills",
		"operator.admin",
		"<=2026.7"
	],
	[
		"update.status",
		"update",
		"operator.admin",
		"<=2026.7"
	],
	[
		"update.run",
		"update",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"voicewake.get",
		"voicewake",
		"operator.read",
		"<=2026.7"
	],
	[
		"voicewake.set",
		"voicewake",
		"operator.write",
		"<=2026.7"
	],
	[
		"secrets.reload",
		null,
		"operator.admin",
		"<=2026.7"
	],
	[
		"secrets.resolve",
		null,
		"operator.admin",
		"<=2026.7"
	],
	[
		"voicewake.routing.get",
		"voicewake-routing",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.list",
		"sessions-read",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.subscribe",
		"sessions-subscriptions",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.messages.subscribe",
		"sessions-subscriptions",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.messages.unsubscribe",
		"sessions-subscriptions",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.viewers.set",
		"sessions-subscriptions",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.preview",
		"sessions-read",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.describe",
		"sessions-read",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.compaction.list",
		"sessions-compaction-queries",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.compaction.branch",
		"sessions-compaction-checkpoints",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.compaction.restore",
		"sessions-compaction-checkpoints",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.branches.list",
		"sessions-rewind",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.branches.switch",
		"sessions-rewind",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.rewind",
		"sessions-rewind",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.fork",
		"sessions-rewind",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.create",
		"sessions-create",
		"dynamic",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.recover",
		"sessions-recover",
		"operator.write",
		"2026.8",
		{ startup: true }
	],
	[
		"sessions.send",
		"sessions-messaging",
		"operator.write",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.abort",
		"sessions-abort",
		"operator.write",
		"<=2026.7",
		{ startup: true }
	],
	[
		"sessions.patch",
		"sessions-mutations",
		"dynamic",
		"<=2026.7"
	],
	[
		"sessions.pluginPatch",
		"sessions-mutations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.cleanup",
		"sessions-read",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.reset",
		"sessions-mutations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.delete",
		"sessions-delete",
		"dynamic",
		"<=2026.7"
	],
	[
		"sessions.compact",
		"sessions-compact",
		"operator.admin",
		"<=2026.7"
	],
	[
		"sessions.groups.list",
		"sessions-groups",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.groups.defaults",
		"sessions-groups",
		"operator.write",
		"2026.8"
	],
	[
		"sessions.groups.put",
		"sessions-groups",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.groups.rename",
		"sessions-groups",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.groups.update",
		"sessions-groups",
		"operator.write",
		"2026.8"
	],
	[
		"sessions.groups.delete",
		"sessions-groups",
		"operator.write",
		"<=2026.7"
	],
	[
		"last-heartbeat",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"set-heartbeats",
		"system",
		"operator.admin",
		"<=2026.7"
	],
	[
		"wake",
		"cron",
		"operator.write",
		"<=2026.7"
	],
	[
		"node.pair.list",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.pair.approve",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.pair.reject",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.pair.remove",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.list",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.approve",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.reject",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.remove",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.rename",
		"devices",
		"operator.pairing",
		"2026.7"
	],
	[
		"device.token.rotate",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.token.revoke",
		"devices",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"device.pair.setupCode",
		"device-pair-setup",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"device.pair.setupStatus",
		"device-pair-setup",
		"operator.admin",
		"2026.8",
		{ advertise: false }
	],
	[
		"node.rename",
		"nodes",
		"operator.pairing",
		"<=2026.7"
	],
	[
		"node.list",
		"nodes",
		"operator.read",
		"<=2026.7"
	],
	[
		"node.describe",
		"nodes",
		"operator.read",
		"<=2026.7"
	],
	[
		"node.pluginSurface.refresh",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.pluginTools.update",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.skills.update",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.runnerInventory.update",
		"nodes",
		"node",
		"2026.8",
		{ advertise: false }
	],
	[
		"node.pending.drain",
		"nodes-pending",
		"node",
		"<=2026.7"
	],
	[
		"node.pending.enqueue",
		"nodes-pending",
		"operator.write",
		"<=2026.7"
	],
	[
		"node.invoke",
		"nodes",
		"dynamic",
		"<=2026.7"
	],
	[
		"node.pending.pull",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.pending.ack",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.invoke.progress",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.invoke.result",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"node.event",
		"nodes",
		"node",
		"<=2026.7"
	],
	[
		"cron.get",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"cron.list",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"cron.status",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"cron.scratch.get",
		"cron",
		"operator.admin",
		"2026.7"
	],
	[
		"cron.scratch.set",
		"cron",
		"operator.admin",
		"2026.7"
	],
	[
		"cron.add",
		"cron",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"cron.update",
		"cron",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"cron.remove",
		"cron",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"cron.run",
		"cron",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"cron.runs",
		"cron",
		"operator.read",
		"<=2026.7"
	],
	[
		"gateway.identity.get",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"gateway.restart.preflight",
		"restart",
		"operator.read",
		"<=2026.7",
		{ compatibilityRestored: true }
	],
	[
		"gateway.restart.request",
		"restart",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"system-presence",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"system-event",
		"system",
		"operator.admin",
		"<=2026.7"
	],
	[
		"message.action",
		"send",
		"operator.write",
		"<=2026.7"
	],
	[
		"conversations.send",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"conversations.turn",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"conversations.turn.cancel",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"send",
		"send",
		"operator.write",
		"<=2026.7"
	],
	[
		"agent",
		"agent",
		"dynamic",
		"<=2026.7",
		{ startup: true }
	],
	[
		"agent.identity.get",
		"agent-identity",
		"operator.read",
		"<=2026.7"
	],
	[
		"agent.wait",
		"agent",
		"operator.write",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.history",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.startup",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.metadata",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.message.get",
		"chat",
		"operator.read",
		"<=2026.7",
		{ startup: true }
	],
	[
		"chat.abort",
		"chat",
		"operator.write",
		"<=2026.7"
	],
	[
		"chat.send",
		"chat",
		"operator.write",
		"<=2026.7",
		{ startup: true }
	],
	[
		"terminal.open",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.input",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.resize",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.close",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"channels.pairing.list",
		"channel-pairing",
		"operator.pairing",
		"2026.7"
	],
	[
		"channels.pairing.approve",
		"channel-pairing",
		"dynamic",
		"2026.7"
	],
	[
		"channels.pairing.dismiss",
		"channel-pairing",
		"operator.pairing",
		"2026.7"
	],
	[
		"assistant.media.get",
		null,
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.get",
		"sessions-read",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.resolve",
		"sessions-read",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.usage",
		"usage",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.usage.timeseries",
		"usage",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.usage.logs",
		"usage",
		"operator.read",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"poll",
		"send",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"sessions.steer",
		"sessions-messaging",
		"operator.write",
		"<=2026.7",
		{
			advertise: false,
			description: "Deprecated alias for chat.send queueMode interrupt; removal per protocol deprecation policy."
		}
	],
	[
		"push.test",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"attach.grant",
		"attach",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"attach.revoke",
		"attach",
		"operator.admin",
		"<=2026.7"
	],
	[
		"push.web.vapidPublicKey",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"push.web.subscribe",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"push.web.unsubscribe",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"push.web.test",
		"push",
		"operator.write",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"config.openFile",
		"config",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"connect",
		"connect",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"chat.inject",
		"chat",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"nativeHook.invoke",
		"native-hook-relay",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"web.login.start",
		"web",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"web.login.wait",
		"web",
		"operator.admin",
		"<=2026.7",
		{ advertise: false }
	],
	[
		"terminal.attach",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"terminal.list",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"controlUi.githubPreview",
		"control-ui",
		"operator.read",
		"<=2026.7"
	],
	[
		"system.info",
		"system",
		"operator.read",
		"<=2026.7"
	],
	[
		"agents.workspace.list",
		"agents-workspace",
		"operator.read",
		"2026.7"
	],
	[
		"agents.workspace.get",
		"agents-workspace",
		"operator.read",
		"2026.7"
	],
	[
		"tts.speak",
		"tts",
		"operator.write",
		"2026.7"
	],
	[
		"plugins.list",
		"plugins",
		"operator.read",
		"<=2026.7"
	],
	[
		"plugins.search",
		"plugins",
		"operator.read",
		"<=2026.7"
	],
	[
		"plugins.install",
		"plugins",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"plugins.setEnabled",
		"plugins",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"plugins.uninstall",
		"plugins",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"plugins.refresh",
		"plugins",
		"operator.admin",
		"<=2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"controlUi.sessionPullRequests.subscribe",
		"control-ui",
		"operator.read",
		"2026.7"
	],
	[
		"controlUi.sessionPreview",
		"control-ui",
		"operator.read",
		"2026.8"
	],
	[
		"gateway.suspend.prepare",
		"suspend",
		"operator.admin",
		"2026.7",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"gateway.suspend.status",
		"suspend",
		"operator.read",
		"2026.7"
	],
	[
		"gateway.suspend.resume",
		"suspend",
		"operator.admin",
		"2026.7"
	],
	[
		"chat.toolTitles",
		"chat",
		"operator.write",
		"<=2026.7"
	],
	[
		"sessions.diff",
		"sessions-diff",
		"operator.read",
		"<=2026.7"
	],
	[
		"openclaw.setup.verify",
		"system-agent",
		"operator.admin",
		"<=2026.7"
	],
	[
		"environments.create",
		"environments",
		"operator.admin",
		"2026.7",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"environments.destroy",
		"environments",
		"operator.admin",
		"2026.7",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"sessions.catalog.list",
		"session-catalog",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.catalog.read",
		"session-catalog",
		"operator.read",
		"2026.7"
	],
	[
		"terminal.upload",
		"terminal",
		"operator.admin",
		"2026.7"
	],
	[
		"sessions.catalog.continue",
		"session-catalog",
		"operator.write",
		"2026.7"
	],
	[
		"sessions.catalog.archive",
		"session-catalog",
		"operator.write",
		"2026.7"
	],
	[
		"approval.get",
		null,
		"operator.approvals",
		"2026.7"
	],
	[
		"approval.resolve",
		null,
		"operator.approvals",
		"2026.7"
	],
	[
		"sessions.search",
		"sessions-read",
		"operator.read",
		"<=2026.7"
	],
	[
		"sessions.dispatch",
		"sessions-dispatch",
		"dynamic",
		"2026.7",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"sessions.reclaim",
		"sessions-dispatch",
		"operator.write",
		"2026.7",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"models.probe",
		"models-probe",
		"operator.admin",
		"<=2026.7"
	],
	[
		"migrations.memory.plan",
		"migrations",
		"operator.admin",
		"2026.7"
	],
	[
		"migrations.memory.apply",
		"migrations",
		"operator.admin",
		"2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"ui.command",
		"ui-command",
		"operator.write",
		"2026.7"
	],
	[
		"approval.history",
		null,
		"operator.approvals",
		"2026.7"
	],
	[
		"plugin.surface.refresh",
		"nodes",
		"operator.read",
		"<=2026.7"
	],
	[
		"conversations.list",
		"conversations",
		"operator.admin",
		"<=2026.7"
	],
	[
		"session.discussion.info",
		"session-discussion",
		"operator.read",
		"2026.7"
	],
	[
		"session.discussion.open",
		"session-discussion",
		"operator.write",
		"2026.7"
	],
	[
		"board.prompt.authorize",
		"board",
		"operator.read",
		"2026.7"
	],
	[
		"board.data.read",
		"board",
		"operator.read",
		"2026.7"
	],
	[
		"board.action",
		"board",
		"operator.write",
		"2026.7"
	],
	[
		"sessions.observer.visibility",
		"session-observer-rpc",
		"operator.read",
		"2026.7"
	],
	[
		"session.visibility.set",
		"sessions-sharing",
		"operator.write",
		"2026.7"
	],
	[
		"session.members.list",
		"sessions-sharing",
		"operator.read",
		"2026.7"
	],
	[
		"session.members.add",
		"sessions-sharing",
		"operator.write",
		"2026.7"
	],
	[
		"session.members.remove",
		"sessions-sharing",
		"operator.write",
		"2026.7"
	],
	[
		"session.suggestions.add",
		"sessions-suggestions",
		"operator.write",
		"2026.7"
	],
	[
		"session.suggestions.list",
		"sessions-suggestions",
		"operator.read",
		"2026.7"
	],
	[
		"session.suggestions.resolve",
		"sessions-suggestions",
		"operator.write",
		"2026.7"
	],
	[
		"session.typing",
		"sessions-suggestions",
		"operator.write",
		"2026.7"
	],
	[
		"sessions.companion.ask",
		"session-companion-rpc",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.companion.state",
		"session-companion-rpc",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.companion.reset",
		"session-companion-rpc",
		"operator.write",
		"2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"memory.search",
		"memory-search",
		"operator.read",
		"2026.7"
	],
	[
		"skills.proposals.events.list",
		"skills",
		"operator.read",
		"2026.7"
	],
	[
		"skills.proposals.evaluate",
		"skills",
		"operator.admin",
		"2026.7",
		{ controlPlaneWrite: true }
	],
	[
		"hooks.status",
		"hooks-status",
		"operator.read",
		"2026.7"
	],
	[
		"tasks.retry",
		"tasks",
		"operator.write",
		"2026.7"
	],
	[
		"tasks.dismiss",
		"tasks",
		"operator.write",
		"2026.7"
	],
	[
		"audit.run.inspect",
		"audit",
		"operator.read",
		"2026.7"
	],
	[
		"sessions.patchMany",
		"sessions-mutations",
		"dynamic",
		"2026.8"
	],
	[
		"update.hold",
		"update",
		"operator.admin",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"sessions.catalog.startTerminal",
		"session-catalog",
		"operator.admin",
		"2026.8"
	],
	[
		"worker.desktop.observe",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"projects.list",
		"projects",
		"operator.read",
		"2026.8"
	],
	[
		"projects.register",
		"projects",
		"operator.admin",
		"2026.8"
	],
	[
		"projects.remove",
		"projects",
		"operator.admin",
		"2026.8"
	],
	[
		"worker.desktop.launch",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"secrets.store.list",
		null,
		"operator.admin",
		"2026.8"
	],
	[
		"secrets.store.set",
		null,
		"operator.admin",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"secrets.store.delete",
		null,
		"operator.admin",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"users.prefs.get",
		"users",
		"operator.read",
		"2026.8"
	],
	[
		"users.prefs.set",
		"users",
		"operator.write",
		"2026.8"
	],
	[
		"projects.add",
		"projects",
		"operator.write",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"projects.searchRemote",
		"projects",
		"operator.read",
		"2026.8",
		{ description: "Search GitHub repositories that can be cloned as managed projects." }
	],
	[
		"desktop.observe",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"desktop.launch",
		"environments",
		"operator.admin",
		"2026.8",
		{ startup: true }
	],
	[
		"device.scopes.requestUpgrade",
		"devices",
		"operator.read",
		"2026.8"
	],
	[
		"device.scopes.waitUpgrade",
		"devices",
		"operator.read",
		"2026.8"
	],
	[
		"portal.list",
		"portals",
		"operator.read",
		"2026.8"
	],
	[
		"portal.open",
		"portals",
		"operator.write",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"portal.close",
		"portals",
		"operator.write",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"sessions.move",
		"sessions-dispatch",
		"dynamic",
		"2026.8",
		{
			startup: true,
			controlPlaneWrite: true
		}
	],
	[
		"sessions.assignOwner",
		"sessions-mutations",
		"operator.write",
		"2026.8"
	],
	[
		"progressCard.get",
		"progress-card",
		"operator.read",
		"2026.8"
	],
	[
		"progressCard.put",
		"progress-card",
		"operator.write",
		"2026.8"
	],
	[
		"tools.github.status",
		"tools-github",
		"operator.read",
		"2026.8"
	],
	[
		"tools.github.configure",
		"tools-github",
		"operator.admin",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"tools.github.authorize.start",
		"tools-github",
		"operator.admin",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"tools.github.authorize.poll",
		"tools-github",
		"operator.admin",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"tools.github.authorize.cancel",
		"tools-github",
		"operator.admin",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"sessions.github.publish",
		"sessions-github",
		"operator.write",
		"2026.8",
		{ controlPlaneWrite: true }
	],
	[
		"diagnostics.lanes",
		"diagnostics",
		"operator.read",
		"2026.8"
	],
	[
		"session.members.listEvidence",
		"sessions-sharing",
		"operator.read",
		"2026.8"
	],
	[
		"plugins.inspect",
		"plugins",
		"operator.read",
		"2026.8"
	]
].map(([name, family, scope, since, policy]) => {
	const spec = {
		name,
		scope,
		since
	};
	const normalizedPolicy = policy;
	if (family) spec.family = family;
	if (normalizedPolicy?.advertise === false) spec.advertise = false;
	if (normalizedPolicy?.startup === true) spec.startup = true;
	if (normalizedPolicy?.controlPlaneWrite === true) spec.controlPlaneWrite = true;
	if (normalizedPolicy?.compatibilityRestored === true) spec.compatibilityRestored = true;
	if (normalizedPolicy?.description) spec.description = normalizedPolicy.description;
	return spec;
});
const CORE_GATEWAY_METHOD_SPEC_BY_NAME = new Map(CORE_GATEWAY_METHOD_SPEC_LIST.map((spec) => [spec.name, spec]));
/** Core methods that are listed early but return retryable unavailable until sidecars are ready. */
const STARTUP_UNAVAILABLE_GATEWAY_METHODS = CORE_GATEWAY_METHOD_SPEC_LIST.filter((spec) => spec.startup === true).map((spec) => spec.name);
/** Returns the core methods that should be advertised to external gateway clients. */
function listCoreAdvertisedGatewayMethodNames() {
	return CORE_GATEWAY_METHOD_SPEC_LIST.filter((spec) => spec.advertise !== false).map((spec) => spec.name);
}
/** Returns all registered core method names, including hidden/internal compatibility methods. */
function listCoreGatewayMethodNames() {
	return listCoreGatewayMethodMetadata().map((spec) => spec.name);
}
/** Returns the public metadata emitted for every core gateway method. */
function listCoreGatewayMethodMetadata() {
	return CORE_GATEWAY_METHOD_SPEC_LIST.map(({ name, scope, since }) => ({
		name,
		scope,
		since
	}));
}
/** Groups lazy-owned core methods by the module family that dispatches them. */
function listCoreGatewayHandlerMethodNames() {
	const methodsByFamily = /* @__PURE__ */ new Map();
	for (const spec of CORE_GATEWAY_METHOD_SPEC_LIST) {
		if (!spec.family) continue;
		const family = spec.family;
		const methods = methodsByFamily.get(family) ?? [];
		methods.push(spec.name);
		methodsByFamily.set(family, methods);
	}
	return methodsByFamily;
}
/** Looks up the raw core method scope, including node and dynamic sentinel scopes. */
function resolveCoreGatewayMethodScope(method) {
	return CORE_GATEWAY_METHOD_SPEC_BY_NAME.get(method)?.scope;
}
/** Looks up an operator-only core method scope, excluding node and dynamic methods. */
function resolveCoreOperatorGatewayMethodScope(method) {
	const scope = resolveCoreGatewayMethodScope(method);
	return scope === "node" || scope === "dynamic" ? void 0 : scope;
}
/** Returns true for core methods reserved for authenticated node clients. */
function isCoreNodeGatewayMethod(method) {
	return resolveCoreGatewayMethodScope(method) === NODE_GATEWAY_METHOD_SCOPE;
}
/** Returns true for core methods whose required operator scope is resolved by the handler. */
function isDynamicOperatorGatewayMethod(method) {
	return resolveCoreGatewayMethodScope(method) === DYNAMIC_GATEWAY_METHOD_SCOPE;
}
/** Returns true when a method name has an explicit core policy entry. */
function isCoreGatewayMethodClassified(method) {
	return CORE_GATEWAY_METHOD_SPEC_BY_NAME.has(method);
}
/** Creates dispatch descriptors for core handlers and fails if any handler lacks policy. */
function createCoreGatewayMethodDescriptors(handlers) {
	const descriptors = [];
	const specNames = /* @__PURE__ */ new Set();
	for (const spec of CORE_GATEWAY_METHOD_SPEC_LIST) {
		specNames.add(spec.name);
		const handler = handlers[spec.name];
		if (!handler) continue;
		descriptors.push({
			name: spec.name,
			handler,
			owner: {
				kind: "core",
				area: "gateway"
			},
			scope: spec.scope,
			profileAccess: isCoreGatewayMethodProfileDependent(spec.name) ? "required" : "independent",
			...spec.since ? { since: spec.since } : {},
			...spec.advertise === false ? { advertise: false } : {},
			...spec.startup === true ? { startup: "unavailable-until-sidecars" } : {},
			...spec.controlPlaneWrite === true ? { controlPlaneWrite: true } : {},
			...spec.description ? { description: spec.description } : {}
		});
	}
	for (const name of Object.keys(handlers)) if (!specNames.has(name)) throw new Error(`gateway method handler is missing a descriptor: ${name}`);
	return descriptors;
}
//#endregion
export { resolveSessionMutationTargets as _, isDynamicOperatorGatewayMethod as a, resolveReservedGatewayMethodScope as b, listCoreGatewayMethodNames as c, NODE_GATEWAY_METHOD_SCOPE as d, isRequiredSessionTargetMethod as f, resolveSessionGroupMutationTargetsByName as g, resolveDirectSessionTargets as h, isCoreNodeGatewayMethod as i, resolveCoreOperatorGatewayMethodScope as l, resolveDirectIncognitoTargets as m, createCoreGatewayMethodDescriptors as n, listCoreAdvertisedGatewayMethodNames as o, isSessionProfileDependentMethod as p, isCoreGatewayMethodClassified as r, listCoreGatewayHandlerMethodNames as s, STARTUP_UNAVAILABLE_GATEWAY_METHODS as t, DYNAMIC_GATEWAY_METHOD_SCOPE as u, sessionMutationTargetFields as v, normalizePluginGatewayMethodScope as y };
