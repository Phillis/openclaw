import { wr as validateSessionsCompactionListParams } from "./src-BlUKtAtD.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import { r as listSessionCompactionCheckpoints } from "./session-compaction-checkpoints-DDWg3cX8.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { a as loadAccessorSessionEntryForGatewayTarget, l as requireSessionKey } from "./sessions-shared-D_8AKVeN.js";
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
