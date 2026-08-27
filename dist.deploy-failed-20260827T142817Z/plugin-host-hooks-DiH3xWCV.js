import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as validateJsonSchemaValue } from "./schema-validator-C_X6l1xv.js";
import { g as getActivePluginSessionExtensionRegistry } from "./runtime-CTbL314X.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { c as WRITE_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-CoZdm5gl.js";
import { Cn as validatePluginsSessionActionParams, Dn as validatePluginsUiDescriptorsResult, En as validatePluginsUiDescriptorsParams, wn as validatePluginsSessionActionResult } from "./src-Bo4ezI_n.js";
import { c as missingScopeErrorShape, l as formatValidationErrors, s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
//#region src/gateway/server-methods/plugin-host-hooks.ts
const log = createSubsystemLogger("gateway/plugin-host-hooks");
function formatSessionActionPayloadSchemaErrors(errors) {
	return errors.map((error) => error.text).join("; ");
}
/** Ensures plugin action result extension fields stay JSON-compatible on the wire. */
function validatePluginSessionActionJsonFields(result) {
	for (const field of [
		"result",
		"reply",
		"details"
	]) if (result[field] !== void 0 && !isPluginJsonValue(result[field])) return `plugin session action ${field} must be JSON-compatible`;
}
/** Gateway handlers for plugin-declared Control UI descriptors and session actions. */
const pluginHostHookHandlers = {
	"plugins.uiDescriptors": ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsUiDescriptorsParams, "plugins.uiDescriptors", respond)) return;
		const result = {
			ok: true,
			descriptors: (getActivePluginSessionExtensionRegistry()?.controlUiDescriptors ?? []).map((entry) => {
				const descriptor = {
					id: entry.descriptor.id,
					pluginId: entry.pluginId,
					pluginName: entry.pluginName,
					surface: entry.descriptor.surface,
					label: entry.descriptor.label
				};
				if (entry.descriptor.description !== void 0) descriptor.description = entry.descriptor.description;
				if (entry.descriptor.placement !== void 0) descriptor.placement = entry.descriptor.placement;
				if (entry.descriptor.schema !== void 0) descriptor.schema = entry.descriptor.schema;
				if (entry.descriptor.requiredScopes !== void 0) descriptor.requiredScopes = entry.descriptor.requiredScopes;
				return descriptor;
			})
		};
		if (!validatePluginsUiDescriptorsResult(result)) {
			log.warn("invalid plugins.uiDescriptors result", { errors: validatePluginsUiDescriptorsResult.errors });
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid plugins.uiDescriptors result: ${formatValidationErrors(validatePluginsUiDescriptorsResult.errors)}`));
			return;
		}
		respond(true, result, void 0);
	},
	"plugins.sessionAction": async ({ params, client, respond, context }) => {
		if (!assertValidParams(params, validatePluginsSessionActionParams, "plugins.sessionAction", respond)) return;
		const pluginId = normalizeOptionalString(params.pluginId);
		const actionId = normalizeOptionalString(params.actionId);
		const rawSessionKey = normalizeOptionalString(params.sessionKey);
		const sessionOwner = rawSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), rawSessionKey, normalizeOptionalString(params.agentId)) : void 0;
		if (sessionOwner && !sessionOwner.ok) {
			respond(false, void 0, sessionOwner.error);
			return;
		}
		const sessionKey = rawSessionKey && sessionOwner?.ok ? resolveStoredSessionKeyForAgentStore({
			cfg: context.getRuntimeConfig(),
			agentId: sessionOwner.agentId,
			sessionKey: rawSessionKey
		}) : void 0;
		if (!pluginId || !actionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugins.sessionAction pluginId and actionId must be non-empty"));
			return;
		}
		const registry = getActivePluginSessionExtensionRegistry();
		const pluginLoaded = Boolean(registry?.plugins.some((plugin) => plugin.id === pluginId && plugin.status === "loaded"));
		const registration = (registry?.sessionActions ?? []).find((entry) => entry.pluginId === pluginId && entry.action.id === actionId);
		if (!registration || !pluginLoaded) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `unknown plugin session action: ${pluginId}/${actionId}`));
			return;
		}
		const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		const hasAdmin = scopes.includes(ADMIN_SCOPE);
		const requiredScopes = registration.action.requiredScopes && registration.action.requiredScopes.length > 0 ? registration.action.requiredScopes : [WRITE_SCOPE];
		const missingScope = requiredScopes.find((scope) => !hasAdmin && !scopes.includes(scope) && !(scope === "operator.read" && scopes.includes("operator.write")));
		if (missingScope) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope,
				requiredScopes
			}));
			return;
		}
		try {
			if (params.payload !== void 0 && !isPluginJsonValue(params.payload)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugin session action payload must be JSON-compatible"));
				return;
			}
			if (registration.action.schema !== void 0) {
				if (typeof registration.action.schema !== "boolean" && !isRecord(registration.action.schema)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugin session action schema must be an object or boolean"));
					return;
				}
				const validation = validateJsonSchemaValue({
					schema: registration.action.schema,
					cacheKey: `plugin-session-action:${pluginId}:${actionId}`,
					value: params.payload
				});
				if (!validation.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `plugin session action payload does not match schema: ${formatSessionActionPayloadSchemaErrors(validation.errors)}`));
					return;
				}
			}
			const result = await registration.action.handler({
				pluginId,
				actionId,
				...sessionKey ? { sessionKey } : {},
				...sessionOwner?.ok ? { agentId: sessionOwner.agentId } : {},
				...params.payload !== void 0 ? { payload: params.payload } : {},
				client: {
					...client?.connId ? { connId: client.connId } : {},
					scopes: [...scopes]
				}
			});
			if (result !== void 0 && !isRecord(result)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugin session action result must be an object"));
				return;
			}
			const wireResult = result?.ok === false ? result : {
				ok: true,
				...result
			};
			if (!validatePluginsSessionActionResult(wireResult)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid plugin session action result: ${formatValidationErrors(validatePluginsSessionActionResult.errors)}`));
				return;
			}
			const jsonFieldError = result ? validatePluginSessionActionJsonFields(result) : void 0;
			if (jsonFieldError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, jsonFieldError));
				return;
			}
			if (!wireResult.ok) {
				respond(true, {
					ok: false,
					error: wireResult.error,
					...wireResult.code !== void 0 ? { code: wireResult.code } : {},
					...wireResult.details !== void 0 ? { details: wireResult.details } : {}
				}, void 0);
				return;
			}
			respond(true, {
				ok: true,
				...wireResult.result !== void 0 ? { result: wireResult.result } : {},
				...wireResult.continueAgent !== void 0 ? { continueAgent: wireResult.continueAgent } : {},
				...wireResult.reply !== void 0 ? { reply: wireResult.reply } : {}
			});
		} catch (error) {
			log.warn(`plugin session action failed plugin=${pluginId} action=${actionId}: ${formatErrorMessage(error)}`);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "plugin session action failed"));
		}
	}
};
//#endregion
export { pluginHostHookHandlers };
