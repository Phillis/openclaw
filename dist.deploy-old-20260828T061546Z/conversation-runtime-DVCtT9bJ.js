import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./session-binding-service-47rBLtwF.js";
import "./conversation-binding-C5Df563Z.js";
import "./thread-bindings-policy-Bjjk-DS_.js";
import "./session-34EfLyjk.js";
import "./pairing-store-DNjQLson.js";
import "./channel-access-compat-ByEMWXFk.js";
import "./binding-routing-BKripjOQ.js";
import "./pairing-labels-CbXzZAh7.js";
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
