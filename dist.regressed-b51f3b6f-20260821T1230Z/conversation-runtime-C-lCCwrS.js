import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./session-binding-service-tMO6MxaM.js";
import "./conversation-binding-BC9B3heN.js";
import "./thread-bindings-policy-BQCu1bho.js";
import "./session-CApmOK5h.js";
import "./pairing-store-L1ejw2gC.js";
import "./channel-access-compat-GpB8WsvX.js";
import "./binding-routing-DP9ye0OO.js";
import "./pairing-labels-BYSD09UH.js";
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
