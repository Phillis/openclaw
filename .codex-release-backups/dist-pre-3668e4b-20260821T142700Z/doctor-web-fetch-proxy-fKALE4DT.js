import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as hasEnvHttpProxyConfigured } from "./proxy-env-CVpLKmqL.js";
import { a as resolveGatewayService } from "./service-B_zykhGn.js";
import { t as note } from "./note-C_xoKlB9.js";
import tls from "node:tls";
//#region src/commands/doctor-web-fetch-proxy.ts
/** Doctor diagnostics for explicit web_fetch trusted proxy routing. */
const DIRECT_PROBE_HOST = "docs.openclaw.ai";
const DIRECT_PROBE_PORT = 443;
const DIRECT_PROBE_TIMEOUT_MS = 3e3;
const HTTP_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"http_proxy",
	"https_proxy"
];
function listConfiguredProxyKeys(env) {
	return HTTP_PROXY_ENV_KEYS.filter((key) => Boolean(env[key]?.trim()));
}
async function probeDirectTlsConnectivity() {
	return await new Promise((resolve) => {
		let settled = false;
		const socket = tls.connect({
			host: DIRECT_PROBE_HOST,
			port: DIRECT_PROBE_PORT,
			servername: DIRECT_PROBE_HOST,
			timeout: DIRECT_PROBE_TIMEOUT_MS
		});
		const finish = (result) => {
			if (settled) return;
			settled = true;
			socket.destroy();
			resolve(result);
		};
		socket.once("secureConnect", () => finish("reachable"));
		socket.once("timeout", () => finish("unreachable"));
		socket.once("error", () => finish("unreachable"));
	});
}
async function resolveProxyEnvSources(params) {
	const sources = [];
	if (hasEnvHttpProxyConfigured("https", params.env)) sources.push({
		env: params.env,
		label: "doctor process"
	});
	const serviceEnv = (await params.service.readCommand(params.env).catch(() => null))?.environment;
	if (serviceEnv && hasEnvHttpProxyConfigured("https", serviceEnv)) sources.push({
		env: serviceEnv,
		label: "installed Gateway service"
	});
	return sources;
}
/** Builds a read-only diagnostic when proxy env exists but web_fetch remains direct. */
async function collectWebFetchProxyDiagnostic(params) {
	if (params.cfg.gateway?.mode === "remote" || params.cfg.tools?.web?.fetch?.enabled === false || params.cfg.tools?.web?.fetch?.useTrustedEnvProxy === true) return null;
	const sources = await resolveProxyEnvSources({
		env: params.env ?? process.env,
		service: params.service ?? resolveGatewayService()
	});
	if (sources.length === 0) return null;
	const directConnectivity = await (params.probeDirectConnectivity ?? probeDirectTlsConnectivity)();
	const sourceLines = sources.map((source) => {
		const keys = listConfiguredProxyKeys(source.env);
		return `- HTTP(S) proxy environment detected in the ${source.label}: ${keys.join(", ")}.`;
	});
	const directProbe = directConnectivity === "reachable" ? `- Direct TLS connectivity to ${DIRECT_PROBE_HOST}:${DIRECT_PROBE_PORT} succeeded.` : `- Direct TLS connectivity to ${DIRECT_PROBE_HOST}:${DIRECT_PROBE_PORT} failed.`;
	return [
		...sourceLines,
		"- web_fetch still uses direct connections because tools.web.fetch.useTrustedEnvProxy is not enabled.",
		directProbe,
		"- If direct web_fetch requests time out and the proxy is operator-controlled, enable the explicit opt-in:",
		`  ${formatCliCommand("openclaw config set tools.web.fetch.useTrustedEnvProxy true")}`,
		"- Keep the opt-in disabled for untrusted proxies; enabling it lets the proxy resolve DNS after OpenClaw's hostname checks."
	].join("\n");
}
/** Emits the web_fetch proxy diagnostic when relevant. */
async function noteWebFetchProxyDiagnostic(params) {
	const diagnostic = await collectWebFetchProxyDiagnostic(params);
	if (diagnostic) (params.noteFn ?? note)(diagnostic, "Web fetch proxy");
}
//#endregion
export { noteWebFetchProxyDiagnostic };
