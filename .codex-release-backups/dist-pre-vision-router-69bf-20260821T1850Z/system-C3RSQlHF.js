import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { _ as resolveGatewayPort, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CsnnOL14.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as loadOrCreateProcessDeviceIdentity, o as publicKeyRawBase64UrlFromPem } from "./device-identity-C2_6nSqN.js";
import { t as resolveAdvertisedLanHostCore } from "./advertised-lan-host-BOODYDoW.js";
import { c as resolveSystemMainSessionTarget } from "./main-session-Dth0X5B9.js";
import { Bv as lazyCompile, zi as validateSystemInfoParams } from "./src-BlUKtAtD.js";
import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { c as requestHeartbeat, u as setHeartbeatsEnabled } from "./heartbeat-wake-CAQb-fCA.js";
import { o as withSystemEventOwner } from "./system-event-ownership-BACexIXt.js";
import { a as enqueueSystemEvent, l as isSystemEventContextChanged } from "./system-events-DecgSLEt.js";
import "./sessions-Bh837xaa.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import { o as loadGatewaySessionRow } from "./session-utils-list-Df1cOTkb.js";
import "./session-utils-DvNvk7rk.js";
import { i as resolveRuntimeOsLabel } from "./os-summary-q1rQKLEc.js";
import { t as getMachineDisplayName } from "./machine-name-B80Od2P0.js";
import { n as resolveUtilityModelRefForAgent, t as readUtilityModelSetting } from "./utility-model-CPi3mZzQ.js";
import { r as updateSystemPresence, t as listSystemPresence } from "./system-presence-5NV70380.js";
import { n as getLastHeartbeatEvent } from "./heartbeat-events-bg9alNGv.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { r as tryReadDiskSpace } from "./disk-space-CzASwJhY.js";
import "./heartbeat-runner-Cqeq0suM.js";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.js";
import { t as broadcastPresenceSnapshot } from "./presence-events-DJLMOloJ.js";
import os from "node:os";
import { Type } from "typebox";
const validateSystemEventParams = /* @__PURE__ */ lazyCompile(closedObject({
	text: Type.String(),
	idempotencyKey: Type.Optional(Type.String({ minLength: 1 })),
	sessionKey: Type.Optional(Type.String()),
	wake: Type.Optional(Type.Boolean()),
	deviceId: Type.Optional(Type.String()),
	instanceId: Type.Optional(Type.String()),
	host: Type.Optional(Type.String()),
	ip: Type.Optional(Type.String()),
	mode: Type.Optional(Type.String()),
	version: Type.Optional(Type.String()),
	platform: Type.Optional(Type.String()),
	deviceFamily: Type.Optional(Type.String()),
	modelIdentifier: Type.Optional(Type.String()),
	lastInputSeconds: Type.Optional(Type.Number()),
	reason: Type.Optional(Type.String()),
	roles: Type.Optional(Type.Array(Type.String())),
	scopes: Type.Optional(Type.Array(Type.String())),
	tags: Type.Optional(Type.Array(Type.String()))
}));
//#endregion
//#region src/gateway/server-methods/system.ts
let advertisedLanHostPromise = null;
function resolveCachedAdvertisedLanHost() {
	advertisedLanHostPromise ??= resolveAdvertisedLanHostCore().catch(() => null);
	return advertisedLanHostPromise;
}
async function collectSystemInfo(context) {
	const cpus = os.cpus();
	const cpuModel = cpus[0]?.model.trim() || void 0;
	const [oneMinute = 0, fiveMinutes = 0, fifteenMinutes = 0] = os.loadavg();
	const loadAverage = [
		oneMinute,
		fiveMinutes,
		fifteenMinutes
	];
	const stateDir = resolveStateDir();
	const disk = tryReadDiskSpace(stateDir);
	const config = context.getRuntimeConfig();
	const port = resolveGatewayPort(config);
	const lanAddress = await resolveCachedAdvertisedLanHost() ?? void 0;
	const soleAgentId = tryResolveLegacyCompatibilityAgentId(config);
	const defaultAgentUtilityModel = soleAgentId ? (() => {
		const utilitySetting = readUtilityModelSetting(config, soleAgentId);
		const utilityModel = resolveUtilityModelRefForAgent({
			cfg: config,
			agentId: soleAgentId
		});
		return utilitySetting.kind === "disabled" ? { status: "disabled" } : utilitySetting.kind === "explicit" ? {
			status: "configured",
			model: utilitySetting.modelRef
		} : utilityModel ? {
			status: "auto",
			model: utilityModel
		} : { status: "unavailable" };
	})() : { status: "unavailable" };
	return {
		machineName: await getMachineDisplayName(),
		hostname: os.hostname(),
		platform: os.platform(),
		release: os.release(),
		arch: os.arch(),
		osLabel: resolveRuntimeOsLabel(),
		...lanAddress ? { lanAddress } : {},
		port,
		nodeVersion: process.version,
		pid: process.pid,
		processInstanceId: getGatewayProcessInstanceId(),
		uptimeMs: Math.round(process.uptime() * 1e3),
		cpuCount: cpus.length,
		...cpuModel ? { cpuModel } : {},
		...loadAverage.some((value) => value !== 0) ? { loadAverage } : {},
		memoryTotalBytes: os.totalmem(),
		memoryFreeBytes: os.freemem(),
		...disk?.totalBytes != null ? {
			diskTotalBytes: disk.totalBytes,
			diskAvailableBytes: disk.availableBytes,
			diskPath: stateDir
		} : {},
		defaultAgentUtilityModel
	};
}
/** Gateway handlers for identity, host information, heartbeat toggles, and presence events. */
const systemHandlers = {
	"gateway.identity.get": ({ respond }) => {
		const identity = loadOrCreateProcessDeviceIdentity();
		respond(true, {
			deviceId: identity.deviceId,
			publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem)
		}, void 0);
	},
	"last-heartbeat": ({ respond }) => {
		respond(true, getLastHeartbeatEvent(), void 0);
	},
	"set-heartbeats": ({ params, respond }) => {
		const enabled = params.enabled;
		if (typeof enabled !== "boolean") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid set-heartbeats params: enabled (boolean) required"));
			return;
		}
		setHeartbeatsEnabled(enabled);
		respond(true, {
			ok: true,
			enabled
		}, void 0);
	},
	"system-presence": ({ respond }) => {
		respond(true, listSystemPresence(), void 0);
	},
	"system.info": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemInfoParams, "system.info", respond)) return;
		respond(true, await collectSystemInfo(context), void 0);
	},
	"system-event": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemEventParams, "system-event", respond)) return;
		const text = normalizeOptionalString(params.text) ?? "";
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "text required"));
			return;
		}
		const requestedSessionKey = normalizeOptionalString(params.sessionKey);
		const cfg = context.getRuntimeConfig();
		const requestedOwner = requestedSessionKey ? resolveRequestedSessionAgentId(cfg, requestedSessionKey) : void 0;
		if (requestedOwner && !requestedOwner.ok) {
			respond(false, void 0, requestedOwner.error);
			return;
		}
		const { agentId: eventOwnerAgentId, sessionKey } = requestedSessionKey ? {
			agentId: requestedOwner?.agentId,
			sessionKey: requestedSessionKey
		} : resolveSystemMainSessionTarget(cfg);
		const wake = params.wake === true;
		const isNodePresenceLine = text.startsWith("Node:");
		if (wake && isNodePresenceLine) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake is not supported for node presence events"));
			return;
		}
		if (wake && requestedSessionKey) {
			const requestedAgentId = normalizeAgentId(requestedOwner?.agentId ?? resolveAgentIdFromSessionKey(requestedSessionKey));
			if (!listAgentIds(cfg).map(normalizeAgentId).includes(requestedAgentId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${requestedAgentId}"`));
				return;
			}
			const targetSession = loadGatewaySessionRow(requestedSessionKey, { agentId: requestedAgentId });
			if (!targetSession || targetSession.archived) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Unknown or archived session "${requestedSessionKey}"`));
				return;
			}
		}
		const deviceId = readStringValue(params.deviceId);
		const instanceId = readStringValue(params.instanceId);
		const host = readStringValue(params.host);
		const ip = readStringValue(params.ip);
		const mode = readStringValue(params.mode);
		const version = readStringValue(params.version);
		const platform = readStringValue(params.platform);
		const deviceFamily = readStringValue(params.deviceFamily);
		const modelIdentifier = readStringValue(params.modelIdentifier);
		const reason = readStringValue(params.reason);
		const roles = Array.isArray(params.roles) && params.roles.every((t) => typeof t === "string") ? params.roles : void 0;
		const scopes = Array.isArray(params.scopes) && params.scopes.every((t) => typeof t === "string") ? params.scopes : void 0;
		const tags = Array.isArray(params.tags) && params.tags.every((t) => typeof t === "string") ? params.tags : void 0;
		const presenceUpdate = updateSystemPresence({
			text,
			deviceId,
			instanceId,
			host,
			ip,
			mode,
			version,
			platform,
			deviceFamily,
			modelIdentifier,
			lastInputSeconds: tags?.includes("system-presence-clear-last-input") ? null : typeof params.lastInputSeconds === "number" && Number.isFinite(params.lastInputSeconds) ? params.lastInputSeconds : void 0,
			reason,
			roles,
			scopes,
			tags
		});
		if (isNodePresenceLine) {
			const next = presenceUpdate.next;
			const changed = new Set(presenceUpdate.changedKeys);
			const reasonValue = next.reason ?? reason;
			const normalizedReason = normalizeLowercaseStringOrEmpty(reasonValue);
			const ignoreReason = normalizedReason.startsWith("periodic") || normalizedReason === "heartbeat" || normalizedReason === "connect" || normalizedReason === "launch" || normalizedReason === "instances-refresh";
			const hostChanged = changed.has("host");
			const ipChanged = changed.has("ip");
			const versionChanged = changed.has("version");
			const modeChanged = changed.has("mode");
			const reasonChanged = changed.has("reason") && !ignoreReason;
			if (hostChanged || ipChanged || versionChanged || modeChanged || reasonChanged) {
				const contextChanged = isSystemEventContextChanged(sessionKey, presenceUpdate.key);
				const parts = [];
				if (contextChanged || hostChanged || ipChanged) {
					const hostLabel = normalizeOptionalString(next.host) ?? "Unknown";
					const ipLabel = normalizeOptionalString(next.ip);
					parts.push(`Node: ${hostLabel}${ipLabel ? ` (${ipLabel})` : ""}`);
				}
				if (versionChanged) parts.push(`app ${normalizeOptionalString(next.version) ?? "unknown"}`);
				if (modeChanged) parts.push(`mode ${normalizeOptionalString(next.mode) ?? "unknown"}`);
				if (reasonChanged) parts.push(`reason ${normalizeOptionalString(reasonValue) ?? "event"}`);
				const deltaText = parts.join(" · ");
				if (deltaText) {
					const eventOptions = {
						sessionKey,
						contextKey: presenceUpdate.key
					};
					enqueueSystemEvent(deltaText, eventOwnerAgentId ? withSystemEventOwner(eventOptions, eventOwnerAgentId) : eventOptions);
				}
			}
		} else {
			const eventOptions = { sessionKey };
			enqueueSystemEvent(text, eventOwnerAgentId ? withSystemEventOwner(eventOptions, eventOwnerAgentId) : eventOptions);
			if (wake) requestHeartbeat({
				source: "notifications-event",
				intent: "immediate",
				reason: "wake",
				...!requestedSessionKey && eventOwnerAgentId ? { agentId: eventOwnerAgentId } : {},
				sessionKey,
				heartbeat: { target: "last" }
			});
		}
		broadcastPresenceSnapshot({
			broadcast: context.broadcast,
			incrementPresenceVersion: context.incrementPresenceVersion,
			getHealthVersion: context.getHealthVersion
		});
		respond(true, { ok: true }, void 0);
	}
};
//#endregion
export { systemHandlers };
