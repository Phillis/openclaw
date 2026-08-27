import { n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { Lt as resolveSessionEntryAccessTarget } from "./session-accessor-CIiPoGwM.js";
import { n as readAcpSessionEntry } from "./session-meta-8cwXEOoU.js";
import { a as resolveConfiguredAcpBindingSpecFromRecord } from "./persistent-bindings.types-Dc67mvsP.js";
import { c as performGatewaySessionReset } from "./session-reset-service-C0uh8kYi.js";
import { n as resolveConfiguredAcpBindingSpecBySessionKey } from "./persistent-bindings.resolve-TvSp73yo.js";
import { n as ensureConfiguredAcpBindingSession, t as ensureConfiguredAcpBindingReadyCore } from "./persistent-bindings.lifecycle-_jn6G8QW.js";
//#region src/channels/plugins/acp-stateful-target-driver.ts
/**
* ACP stateful target driver for configured bindings.
*
* Ensures ACP-backed bound sessions exist, are ready, and can be reset by Gateway.
*/
function toAcpStatefulBindingTargetDescriptor(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const metaAgentId = (readAcpSessionEntry({
		...params,
		sessionKey
	})?.acp)?.agent?.trim();
	if (metaAgentId) return {
		kind: "stateful",
		driverId: "acp",
		sessionKey,
		agentId: metaAgentId
	};
	const spec = resolveConfiguredAcpBindingSpecBySessionKey({
		...params,
		sessionKey
	});
	if (!spec) {
		if (!isAcpSessionKey(sessionKey)) return null;
		return {
			kind: "stateful",
			driverId: "acp",
			sessionKey,
			agentId: resolveAgentIdFromSessionKey(sessionKey)
		};
	}
	return {
		kind: "stateful",
		driverId: "acp",
		sessionKey,
		agentId: spec.agentId,
		...spec.label ? { label: spec.label } : {}
	};
}
async function ensureAcpTargetReady(params) {
	const configuredBinding = resolveConfiguredAcpBindingSpecFromRecord(params.bindingResolution.record);
	if (!configuredBinding) return {
		ok: false,
		error: "Configured ACP binding unavailable"
	};
	return await ensureConfiguredAcpBindingReadyCore({
		cfg: params.cfg,
		configuredBinding: {
			spec: configuredBinding,
			record: params.bindingResolution.record
		}
	});
}
async function ensureAcpTargetSession(params) {
	const spec = resolveConfiguredAcpBindingSpecFromRecord(params.bindingResolution.record);
	if (!spec) return {
		ok: false,
		sessionKey: params.bindingResolution.statefulTarget.sessionKey,
		error: "Configured ACP binding unavailable"
	};
	return await ensureConfiguredAcpBindingSession({
		cfg: params.cfg,
		spec
	});
}
async function resetAcpTargetInPlace(params) {
	if (resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	}).entry?.incognito === true) return {
		ok: false,
		error: "Incognito sessions cannot reset in place."
	};
	const result = await performGatewaySessionReset({
		key: params.sessionKey,
		reason: params.reason,
		commandSource: params.commandSource ?? "stateful-target:acp-reset-in-place"
	});
	if (result.ok) {
		if ("incognitoDeleted" in result) return {
			ok: true,
			sessionKey: result.key,
			storePath: result.storePath
		};
		return {
			ok: true,
			sessionKey: result.key,
			sessionId: result.entry.sessionId,
			storePath: result.storePath
		};
	}
	return {
		ok: false,
		error: result.error.message
	};
}
const acpStatefulBindingTargetDriver = {
	id: "acp",
	ensureReady: ensureAcpTargetReady,
	ensureSession: ensureAcpTargetSession,
	resolveTargetBySessionKey: toAcpStatefulBindingTargetDescriptor,
	resetInPlace: resetAcpTargetInPlace
};
//#endregion
export { acpStatefulBindingTargetDriver };
