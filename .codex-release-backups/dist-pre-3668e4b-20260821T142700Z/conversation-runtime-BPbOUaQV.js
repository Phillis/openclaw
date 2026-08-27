import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./session-binding-service-Dk6st5wa.js";
import "./conversation-binding-BvCkFpTC.js";
import "./thread-bindings-policy-dXDFaPvs.js";
import "./session-CgCdqcVt.js";
import "./pairing-store-CwP5wxfq.js";
import "./channel-access-compat-DRpaH6ey.js";
import "./binding-routing-Dz0csent.js";
import "./pairing-labels-BEtV4mO4.js";
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
