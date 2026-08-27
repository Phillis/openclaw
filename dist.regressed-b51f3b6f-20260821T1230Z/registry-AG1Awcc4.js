import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
//#region src/secrets/egress-proxy/registry.ts
const SECRET_EGRESS_PROXY_REGISTRY_KEY = Symbol.for("openclaw.secretEgressProxy.registry");
function getSecretEgressProxyRegistry() {
	return resolveGlobalSingleton(SECRET_EGRESS_PROXY_REGISTRY_KEY, () => ({}));
}
function publishSecretEgressProxy(proxy) {
	const registry = getSecretEgressProxyRegistry();
	if (registry.activeProxy) throw new Error("Secret egress proxy is already active in this process");
	registry.activeProxy = proxy;
}
function clearSecretEgressProxy(proxy) {
	const registry = getSecretEgressProxyRegistry();
	if (registry.activeProxy === proxy) registry.activeProxy = void 0;
}
function isSecretEgressProxyActive() {
	return getSecretEgressProxyRegistry().activeProxy !== void 0;
}
/** Returns the trusted subprocess environment for one exact admitted agent run. */
function registerSecretEgressProxyRun(run, bindings) {
	const proxy = getSecretEgressProxyRegistry().activeProxy;
	if (!proxy) throw new Error("Secret egress proxy is not active in this Gateway process");
	return proxy.registerRun(run, bindings);
}
//#endregion
export { registerSecretEgressProxyRun as i, isSecretEgressProxyActive as n, publishSecretEgressProxy as r, clearSecretEgressProxy as t };
