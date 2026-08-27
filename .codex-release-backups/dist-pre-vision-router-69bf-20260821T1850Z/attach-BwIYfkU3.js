import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { u as asPositiveFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { o as asRecord } from "./record-coerce-DItp3I4t.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { r as resolveSessionStoreKey } from "./session-store-key-Cc0gbvo8.js";
import { Lt as resolveSessionEntryAccessTarget } from "./session-accessor-CIiPoGwM.js";
import { a as isAgentHarnessSessionKey, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-BpWapmwX.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import "./session-utils-DvNvk7rk.js";
import { i as createMcpAttachGrantServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-CrkkrSyL.js";
import { i as mintAttachGrant, l as revokeAttachGrant } from "./mcp-grant-store-CTsCCtYU.js";
import { n as ensureMcpLoopbackServer } from "./mcp-http-BMHQptPs.js";
//#region src/gateway/server-methods/attach.ts
const attachHandlers = {
	"attach.grant": async ({ params, respond, context }) => {
		const grantParams = asRecord(params);
		const cfg = context.getRuntimeConfig();
		const requestedSessionKey = normalizeOptionalString(grantParams.sessionKey) ?? "main";
		const requestedAgent = resolveRequestedSessionAgentId(cfg, requestedSessionKey, normalizeOptionalString(grantParams.agentId));
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const storageSessionKey = resolveSessionStoreKey({
			cfg,
			sessionKey: requestedSessionKey,
			storeAgentId: requestedAgent.agentId
		});
		const sessionKey = parseAgentSessionKey(storageSessionKey) ? storageSessionKey : `agent:${requestedAgent.agentId}:${storageSessionKey}`;
		const harnessEntry = isAgentHarnessSessionKey(storageSessionKey) ? resolveSessionEntryAccessTarget({
			cfg,
			sessionKey: storageSessionKey
		}).entry : void 0;
		if (isAgentHarnessSessionKey(storageSessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(storageSessionKey, harnessEntry))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE));
			return;
		}
		await ensureMcpLoopbackServer();
		const runtime = getActiveMcpLoopbackRuntime();
		if (!runtime) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "mcp loopback server unavailable"));
			return;
		}
		const grant = mintAttachGrant({
			sessionKey,
			ttlMs: asPositiveFiniteNumber(grantParams.ttlMs)
		});
		respond(true, {
			sessionKey: grant.sessionKey,
			token: grant.token,
			expiresAtMs: grant.expiresAtMs,
			mcpConfig: createMcpAttachGrantServerConfig(runtime.port),
			env: { OPENCLAW_MCP_TOKEN: grant.token }
		});
	},
	"attach.revoke": async ({ params, respond }) => {
		const token = normalizeOptionalString(asRecord(params).token);
		if (!token) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "token is required"));
			return;
		}
		respond(true, { revoked: revokeAttachGrant(token) });
	}
};
//#endregion
export { attachHandlers };
