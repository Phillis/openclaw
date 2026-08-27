import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./session-binding-service-B0hkzhLM.js";
import "./conversation-binding-BabhLvmP.js";
import "./thread-bindings-policy-B2yir4E2.js";
import "./session-BON_pp2B.js";
import "./pairing-store-CHm2POOL.js";
import "./channel-access-compat-D6yWLznV.js";
import "./binding-routing-CQdQB4p9.js";
import "./pairing-labels-CXPdFepB.js";
//#region src/channels/session-meta.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("./inbound.runtime.js"));
/**
* Best-effort inbound session metadata recorder for channel plugin command handlers.
*/
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	try {
		await runtime.recordInboundSessionMeta({
			storePath,
			sessionKey: params.sessionKey,
			ctx: params.ctx
		});
	} catch (err) {
		params.onError?.(err);
	}
}
//#endregion
export { recordInboundSessionMetaSafe as t };
