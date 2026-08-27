import { Ar as validateSessionsCompactionListParams } from "./src-4dv5TpeQ.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { r as listSessionCompactionCheckpoints } from "./session-compaction-checkpoints-CCH5--4D.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { c as requireSessionKey, i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-DVKJTkd0.js";
//#region src/gateway/server-methods/sessions-compaction-queries.ts
const sessionCheckpointQueryHandlers = { "sessions.compaction.list": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateSessionsCompactionListParams, "sessions.compaction.list", respond)) return;
	const p = params;
	const key = requireSessionKey(p.key, respond);
	if (!key) return;
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const { entry, canonicalKey } = loadAccessorSessionEntryForGatewayTarget({
		key,
		cfg,
		agentId: requestedAgent.agentId
	});
	respond(true, {
		ok: true,
		key: canonicalKey,
		checkpoints: listSessionCompactionCheckpoints(entry)
	}, void 0);
} };
//#endregion
export { sessionCheckpointQueryHandlers };
