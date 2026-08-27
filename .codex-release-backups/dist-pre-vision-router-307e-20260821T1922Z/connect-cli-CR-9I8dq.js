import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { d as readResponseWithLimit, i as cancelUnreadResponseBody } from "./http-body-D5I0NwSl.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as normalizeHostname } from "./hostname-_16721Le.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Dj5fUySl.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { n as encodePairingSetupCode, t as decodePairingSetupCode } from "./setup-code-BXkvc32v.js";
import { l as resolveNodePairGatewayPayload, t as runNodeDaemonInstall, u as runNodeHost } from "./daemon-B1z46cHZ.js";
import { t as isDevicePairingJoinCode } from "./join-code-B_OfdZ-j.js";
//#region src/cli/connect-cli.ts
const MAX_JOIN_PAYLOAD_BYTES = 24 * 1024;
const JOIN_FETCH_TIMEOUT_MS = 15e3;
function parseJoinTarget(target) {
	let parsed;
	try {
		parsed = new URL(target);
	} catch {
		return null;
	}
	if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
	const shortcode = /(?:^|\/)j\/([^/]+)$/u.exec(parsed.pathname)?.[1] ?? "";
	if (parsed.username || parsed.password || parsed.search || parsed.hash || !isDevicePairingJoinCode(shortcode)) throw new Error("Join URL must end with the exact /j/<shortcode> form.");
	if (parsed.protocol === "http:" && !isLoopbackHost(parsed.hostname)) throw new Error("Plain HTTP join URLs are allowed only for loopback gateways.");
	return parsed;
}
async function fetchJoinPayload(target) {
	const expectedHost = normalizeHostname(target.hostname);
	let release = async () => {};
	try {
		const guarded = await fetchWithSsrFGuard({
			url: target.toString(),
			auditContext: "openclaw-connect-join",
			maxRedirects: 0,
			requireHttps: target.protocol === "https:",
			timeoutMs: JOIN_FETCH_TIMEOUT_MS,
			policy: {
				allowPrivateNetwork: true,
				allowedHostnames: [expectedHost],
				hostnameAllowlist: [expectedHost]
			}
		});
		release = guarded.release;
		const response = guarded.response;
		if (!response.ok || !response.headers.get("content-type")?.startsWith("application/json")) {
			await cancelUnreadResponseBody(response);
			throw new Error("Gateway join code was not found or has expired.");
		}
		const body = await readResponseWithLimit(response, MAX_JOIN_PAYLOAD_BYTES);
		let decoded;
		try {
			decoded = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
		} catch {
			throw new Error("Gateway returned an invalid pairing payload.");
		}
		return decodePairingSetupCode(encodePairingSetupCode(decoded));
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Gateway ")) throw error;
		throw new Error("Could not fetch the Gateway join payload securely.", { cause: error });
	} finally {
		await release();
	}
}
async function resolveConnectPayload(target) {
	const joinTarget = parseJoinTarget(target);
	return joinTarget ? await fetchJoinPayload(joinTarget) : decodePairingSetupCode(target);
}
async function runConnectCommand(target, opts) {
	const pair = resolveNodePairGatewayPayload(await resolveConnectPayload(target));
	const nodeRunOptions = {
		gatewayHost: pair.host,
		gatewayPort: pair.port,
		gatewayTls: pair.tls,
		gatewayTlsFingerprint: pair.tlsFingerprint,
		gatewayContextPath: pair.contextPath,
		gatewayCandidates: pair.candidates,
		gatewayBootstrapToken: pair.bootstrapToken,
		preferGatewayBootstrapToken: true,
		displayName: opts.displayName
	};
	if (!opts.service) {
		await runNodeHost(nodeRunOptions);
		return;
	}
	await runNodeHost({
		...nodeRunOptions,
		stopAfterFirstConnect: true
	});
	await runNodeDaemonInstall({
		displayName: opts.displayName,
		force: true
	});
}
function registerConnectCli(program) {
	program.command("connect").description("Connect this machine to an OpenClaw Gateway as a node").argument("<target>", "oc-pair URL, setup code, or HTTPS Gateway join URL").option("--service", "Install and run the node host as an OS service", false).option("--display-name <name>", "Override the node display name").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw connect oc-pair://<setup-code>", "Connect in the foreground."], ["openclaw connect https://gateway.example/j/<code> --service", "Install the node host service."]])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/connect", "docs.openclaw.ai/cli/connect")}\n`).action(async (target, opts) => {
		try {
			await runConnectCommand(target, opts);
		} catch (error) {
			defaultRuntime.error(error instanceof Error ? error.message : String(error));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerConnectCli };
