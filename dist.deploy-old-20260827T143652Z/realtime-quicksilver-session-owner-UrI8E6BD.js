import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import "./global-singleton-lspSlNkM.js";
import { r as createOpenAIQuicksilverBrowserSessionBroker } from "./realtime-quicksilver-session-Z5K9VN0z.js";
//#region extensions/openai/realtime-quicksilver-session-owner.ts
const OPENAI_QUICKSILVER_SESSION_OWNER_KEY = Symbol.for("openclaw.openai.quicksilverBrowserSessionOwner.v1");
function resolveBrokerOwner() {
	return resolveGlobalSingleton(OPENAI_QUICKSILVER_SESSION_OWNER_KEY, () => ({}));
}
function acquireOpenAIQuicksilverBrowserSessionBroker(params) {
	const owner = resolveBrokerOwner();
	if (owner.current) {
		owner.current.params.getConfig = params.getConfig;
		owner.current.params.logger = params.logger;
		return owner.current.session;
	}
	const mutableParams = { ...params };
	const session = createOpenAIQuicksilverBrowserSessionBroker(mutableParams);
	owner.current = {
		params: mutableParams,
		session
	};
	return session;
}
async function releaseOpenAIQuicksilverBrowserSessionBroker(session) {
	const owner = resolveBrokerOwner();
	if (owner.current?.session !== session) return;
	owner.current = void 0;
	await session.cleanup();
}
//#endregion
export { releaseOpenAIQuicksilverBrowserSessionBroker as n, acquireOpenAIQuicksilverBrowserSessionBroker as t };
