import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./session-binding-service-DyztGgRo.js";
import "./conversation-binding-Yyqz26An.js";
import "./thread-bindings-policy-CY5sQygn.js";
import "./session-DrA6IlwV.js";
import "./pairing-store-BmIXp5gX.js";
import "./channel-access-compat-CWyCBwFF.js";
import "./binding-routing-DHpa0Vk5.js";
import "./pairing-labels-C3dDAwIK.js";
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
