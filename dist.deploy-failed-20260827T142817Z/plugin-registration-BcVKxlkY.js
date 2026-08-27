import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./error-runtime-CmlvK1A3.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { i as isGoogleMeetBrowserManualActionError, n as GOOGLE_MEET_NODE_COMMAND } from "./google-meet-platform-constants-Bs5iAg3E.js";
import { i as resolveGoogleMeetGatewayOperationTimeoutMs } from "./config-BOa_MEny.js";
//#region extensions/google-meet/src/plugin-registration.ts
const loadGoogleMeetPluginHelpers = createLazyRuntimeModule(() => import("./plugin-helpers-1vY61B1o.js"));
const loadGoogleMeetCliModule = createLazyRuntimeModule(() => import("./cli-D8wCo0K6.js"));
const loadGoogleMeetNodeHostModule = createLazyRuntimeModule(() => import("./node-host-ChTF5nbP.js"));
const loadGoogleMeetRuntimeModule = createLazyRuntimeModule(() => import("./runtime-CueYa_O7.js"));
const loadGoogleMeetNodeInvokePolicyModule = createLazyRuntimeModule(() => import("./node-invoke-policy-BtDmgm-V.js"));
const loadGoogleMeetGatewayRuntimeModule = createLazyRuntimeModule(() => import("./plugin-sdk/gateway-runtime.js"));
const loadGoogleMeetNodeInvokePolicy = async (config) => (await loadGoogleMeetNodeInvokePolicyModule()).createGoogleMeetChromeNodeInvokePolicy(config);
function normalizeTransport(value) {
	return value === "chrome" || value === "chrome-node" || value === "twilio" ? value : void 0;
}
function normalizeMode(value) {
	if (value === "realtime") return "agent";
	return value === "agent" || value === "bidi" || value === "transcribe" ? value : void 0;
}
function resolveMeetingInput(config, value) {
	const meeting = normalizeOptionalString(value) ?? config.defaults.meeting;
	if (!meeting) throw new Error("Meeting input is required");
	return meeting;
}
function shouldJoinCreatedMeet(raw) {
	return raw.join !== false && raw.join !== "false";
}
const googleMeetToolDeps = { platform: () => process.platform };
function googleMeetGatewayMethodForToolAction(action) {
	switch (action) {
		case "recover_current_tab": return "googlemeet.recoverCurrentTab";
		case "setup_status": return "googlemeet.setup";
		case "test_speech": return "googlemeet.testSpeech";
		case "test_listen": return "googlemeet.testListen";
		case "end_active_conference": return "googlemeet.endActiveConference";
		default: return `googlemeet.${action}`;
	}
}
function isGoogleMeetAgentToolActionUnsupportedOnHost(params) {
	const platform = params.platform ?? googleMeetToolDeps.platform();
	if (platform === "darwin" || platform === "linux") return false;
	const action = params.raw.action;
	if (action !== "join" && action !== "test_speech" && !(action === "create" && shouldJoinCreatedMeet(params.raw))) return false;
	const transport = normalizeTransport(params.raw.transport) ?? params.config.defaultTransport;
	const mode = action === "test_speech" ? "agent" : normalizeMode(params.raw.mode) ?? params.config.defaultMode;
	return transport === "chrome" && (mode === "agent" || mode === "bidi");
}
function assertGoogleMeetAgentToolActionSupported(params) {
	if (!isGoogleMeetAgentToolActionUnsupportedOnHost(params)) return;
	throw new Error("Google Meet local Chrome talk-back audio requires macOS with BlackHole 2ch or Linux with PipeWire-Pulse. On this host, use mode: transcribe, transport: twilio, or a supported chrome-node.");
}
function readGatewayErrorDetails(err) {
	if (!err || typeof err !== "object" || !("details" in err)) return;
	return err.details;
}
async function callGoogleMeetGatewayFromTool(params) {
	try {
		if (params.runtime) return await params.runtime.gateway.request(googleMeetGatewayMethodForToolAction(params.action), params.raw, {
			timeoutMs: resolveGoogleMeetGatewayOperationTimeoutMs(params.config),
			scopes: ["operator.admin"]
		});
		return await (googleMeetToolDeps.callGatewayFromCli ?? (await loadGoogleMeetGatewayRuntimeModule()).callGatewayFromCli)(googleMeetGatewayMethodForToolAction(params.action), {
			json: true,
			timeout: String(resolveGoogleMeetGatewayOperationTimeoutMs(params.config))
		}, params.raw, {
			progress: false,
			scopes: ["operator.admin"]
		});
	} catch (err) {
		const details = readGatewayErrorDetails(err);
		if (details && typeof details === "object") return details;
		throw err;
	}
}
function keepTrustedToolAgentId(raw, client) {
	const { agentId: rawAgentId, ...rest } = raw;
	if (client?.internal?.pluginRuntimeOwnerId !== "google-meet") return rest;
	const agentId = normalizeOptionalString(rawAgentId);
	return agentId ? {
		...rest,
		agentId
	} : rest;
}
function createGoogleMeetRuntimeAccessor(params) {
	let runtimePromise;
	return async () => {
		if (!params.config.enabled) throw new Error("Google Meet plugin disabled in plugin config");
		return await (runtimePromise ?? (runtimePromise = loadGoogleMeetRuntimeModule().then(({ GoogleMeetRuntime: Runtime }) => new Runtime({
			config: params.config,
			fullConfig: params.api.config,
			runtime: params.api.runtime,
			logger: params.api.logger
		}))));
	};
}
function createLazyGoogleMeetNodeInvokePolicy(config, loadPolicy = loadGoogleMeetNodeInvokePolicy) {
	let policyPromise;
	return {
		commands: [GOOGLE_MEET_NODE_COMMAND],
		dangerous: true,
		async handle(ctx) {
			let policy;
			try {
				policyPromise ??= loadPolicy(config);
				policy = await policyPromise;
			} catch (error) {
				return {
					ok: false,
					code: "PLUGIN_POLICY_UNAVAILABLE",
					message: `google-meet PLUGIN_POLICY_UNAVAILABLE: node.invoke policy unavailable: ${formatErrorMessage(error)}`,
					unavailable: true
				};
			}
			return await policy.handle(ctx);
		}
	};
}
function formatGoogleMeetGatewayError(err) {
	return isGoogleMeetBrowserManualActionError(err) ? err.payload : { error: formatErrorMessage(err) };
}
function sendGoogleMeetGatewayError(respond, err, code = "UNAVAILABLE") {
	const payload = formatGoogleMeetGatewayError(err);
	respond(false, payload, {
		code,
		message: typeof payload.error === "string" ? payload.error : "Google Meet request failed",
		details: payload
	});
}
const testing = {
	setCallGatewayFromCliForTests(next) {
		googleMeetToolDeps.callGatewayFromCli = next;
	},
	setPlatformForTests(next) {
		googleMeetToolDeps.platform = next ?? (() => process.platform);
	},
	isGoogleMeetAgentToolActionUnsupportedOnHost,
	resolveGoogleMeetGatewayOperationTimeoutMs
};
//#endregion
export { formatGoogleMeetGatewayError as a, loadGoogleMeetNodeHostModule as c, normalizeTransport as d, resolveMeetingInput as f, testing as h, createLazyGoogleMeetNodeInvokePolicy as i, loadGoogleMeetPluginHelpers as l, shouldJoinCreatedMeet as m, callGoogleMeetGatewayFromTool as n, keepTrustedToolAgentId as o, sendGoogleMeetGatewayError as p, createGoogleMeetRuntimeAccessor as r, loadGoogleMeetCliModule as s, assertGoogleMeetAgentToolActionSupported as t, normalizeMode as u };
