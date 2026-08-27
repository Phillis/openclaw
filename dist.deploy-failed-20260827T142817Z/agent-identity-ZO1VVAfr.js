import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as classifySessionKeyShape } from "./session-key-D8GLfPr_.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { t as validateAgentIdentityParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-BuQ1R1pA.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as resolveAssistantIdentity } from "./assistant-identity-cUcd_IHs.js";
import { n as resolveGatewayAssistantAvatar } from "./assistant-avatar-DGWEAz9E.js";
//#region src/gateway/server-methods/agent-identity.ts
const agentIdentityGetHandler = ({ params, respond, context }) => {
	if (!assertValidParams(params, validateAgentIdentityParams, "agent.identity.get", respond)) return;
	const agentIdRaw = normalizeOptionalString(params.agentId) ?? "";
	const sessionKeyRaw = normalizeOptionalString(params.sessionKey) ?? "";
	const cfg = context.getRuntimeConfig();
	let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
	if (sessionKeyRaw) {
		if (classifySessionKeyShape(sessionKeyRaw) === "malformed_agent") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent.identity.get params: malformed session key "${sessionKeyRaw}"`));
			return;
		}
		const resolved = resolveRequestedSessionAgentId(cfg, sessionKeyRaw, agentId);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		agentId = resolved.agentId;
	} else if (!agentId) {
		const resolved = resolveRequestedSessionAgentId(cfg, "main");
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		agentId = resolved.agentId;
	}
	const identity = resolveAssistantIdentity({
		cfg,
		agentId
	});
	const avatarProjection = resolveGatewayAssistantAvatar({
		cfg,
		identity
	});
	const avatarResolution = avatarProjection.resolution;
	respond(true, {
		...identity,
		avatar: avatarProjection.avatar,
		avatarSource: avatarResolution ? resolvePublicAgentAvatarSource(avatarResolution) : void 0,
		avatarStatus: avatarResolution?.kind,
		avatarReason: avatarResolution?.kind === "none" ? avatarResolution.reason : void 0
	}, void 0);
};
const agentIdentityHandlers = { "agent.identity.get": agentIdentityGetHandler };
//#endregion
export { agentIdentityHandlers };
