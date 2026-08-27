import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { g as resolveSessionGroupMutationTargetsByName } from "./core-descriptors-By5XY4Wa.js";
import { Kr as validateSessionsGroupsDeleteParams, Qr as validateSessionsGroupsUpdateParams, Wr as validateSessionsGroupsDefaultsParams, Xr as validateSessionsGroupsPutParams, Zr as validateSessionsGroupsRenameParams, qr as validateSessionsGroupsListParams } from "./src-4dv5TpeQ.js";
import "./method-scopes-BTnJZEGh.js";
import { d as errorShape, f as missingScopeErrorShape } from "./validation-errors-rELRlKfn.js";
import { n as resolveWorkspacePathContainment, t as isWorkspacePathContainmentCurrent } from "./workspace-path-containment-CPewJH89.js";
import { a as authorizeSessionSharing, d as isGatewayAdmin, t as SessionMutationAuthorizationChangedError } from "./session-sharing-C4OmHGYo.js";
import { n as emitSessionsChanged } from "./session-change-event-BVVK9xuQ.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { a as listSessionGroups, c as renameSessionGroup, i as listSessionGroupDefaults, l as updateSessionGroupDefaults, n as deleteSessionGroup, o as listSidebarSectionOrder, s as putSessionGroups, t as SessionGroupNotFoundError } from "./session-groups-CcCK_VZz.js";
import path from "node:path";
//#region src/gateway/session-group-defaults-access.ts
/** Keep shared group settings visible only where every member session is mutable. */
function filterMutableSessionGroupRecords(params) {
	const allowed = new Set(params.records.map((record) => record.name));
	if (isGatewayAdmin(params.client)) return [...params.records];
	const storeCache = /* @__PURE__ */ new Map();
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	for (const [name, targetRefs] of resolveSessionGroupMutationTargetsByName(params.cfg)) {
		if (!allowed.has(name)) continue;
		for (const targetRef of targetRefs) if (authorizeSessionSharing({
			cfg: params.cfg,
			client: params.client,
			...targetRef,
			storeCache,
			targetDiscoveryCache
		})) {
			allowed.delete(name);
			break;
		}
	}
	return params.records.filter((record) => allowed.has(record.name));
}
//#endregion
//#region src/gateway/server-methods/sessions-groups.ts
const sessionGroupHandlers = {
	"sessions.groups.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSessionsGroupsListParams, "sessions.groups.list", respond)) return;
		respond(true, {
			groups: listSessionGroups(),
			sectionOrder: listSidebarSectionOrder()
		}, void 0);
	},
	"sessions.groups.defaults": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionsGroupsDefaultsParams, "sessions.groups.defaults", respond)) return;
		respond(true, { defaults: filterMutableSessionGroupRecords({
			cfg: context.getRuntimeConfig(),
			client,
			records: listSessionGroupDefaults()
		}) }, void 0);
	},
	"sessions.groups.put": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsGroupsPutParams, "sessions.groups.put", respond)) return;
		respond(true, {
			ok: true,
			groups: putSessionGroups(params.names, params.sectionOrder),
			sectionOrder: listSidebarSectionOrder()
		}, void 0);
		emitSessionsChanged(context, { reason: "groups" });
	},
	"sessions.groups.rename": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsGroupsRenameParams, "sessions.groups.rename", respond)) return;
		try {
			respond(true, {
				ok: true,
				...await renameSessionGroup({
					cfg: context.getRuntimeConfig(),
					name: params.name,
					to: params.to,
					assertCurrent: sessionMutationAuthorization?.assertCurrent,
					assertTargetCurrent: sessionMutationAuthorization?.assertTargetCurrent
				})
			}, void 0);
			emitSessionsChanged(context, { reason: "groups" });
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			if (error instanceof SessionGroupNotFoundError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"sessions.groups.update": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsGroupsUpdateParams, "sessions.groups.update", respond)) return;
		if (params.cwd && !path.isAbsolute(params.cwd)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session group cwd must be absolute"));
			return;
		}
		const name = normalizeOptionalString(params.name);
		if (!name) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session group name must not be empty"));
			return;
		}
		let cwd = params.cwd;
		const clientScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		if (cwd && !clientScopes.includes("operator.admin")) {
			const containment = await resolveWorkspacePathContainment(cwd, context.getRuntimeConfig());
			if (!containment || !isWorkspacePathContainmentCurrent(containment, context.getRuntimeConfig())) {
				respond(false, void 0, missingScopeErrorShape({
					missingScope: ADMIN_SCOPE,
					requiredScopes: [ADMIN_SCOPE]
				}));
				return;
			}
			cwd = containment.path;
		}
		sessionMutationAuthorization?.assertCurrent();
		if (sessionMutationAuthorization) {
			const currentTargets = resolveSessionGroupMutationTargetsByName(context.getRuntimeConfig()).get(name) ?? [];
			for (const target of currentTargets) sessionMutationAuthorization.assertTargetCurrent(target);
		}
		const defaults = updateSessionGroupDefaults(name, {
			cwd,
			worktree: params.worktree
		});
		if (!defaults) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session group: ${name}`));
			return;
		}
		respond(true, {
			ok: true,
			defaults: filterMutableSessionGroupRecords({
				cfg: context.getRuntimeConfig(),
				client,
				records: defaults
			})
		}, void 0);
		emitSessionsChanged(context, { reason: "groups" });
	},
	"sessions.groups.delete": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsGroupsDeleteParams, "sessions.groups.delete", respond)) return;
		try {
			respond(true, {
				ok: true,
				...await deleteSessionGroup({
					cfg: context.getRuntimeConfig(),
					name: params.name,
					assertCurrent: sessionMutationAuthorization?.assertCurrent,
					assertTargetCurrent: sessionMutationAuthorization?.assertTargetCurrent
				})
			}, void 0);
			emitSessionsChanged(context, { reason: "groups" });
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	}
};
//#endregion
export { sessionGroupHandlers };
