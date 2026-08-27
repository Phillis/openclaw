import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-CBejaoWm.js";
import { s as callGateway } from "./call-D4XcT41c.js";
import { r as withProgress } from "./progress-F0nzmXYd.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-CJ2ASpTh.js";
//#region src/commands/channels/status.ts
const loadChannelsStatusRuntime = createLazyRuntimeModule(() => import("./status.runtime-qP-jZs4r.js"));
function redactGatewayUrlSecretsInText(text) {
	return text.replace(/\b(?:wss?|https?):\/\/[^\s"'<>]+/gi, (rawUrl) => {
		return redactSensitiveUrlLikeString(rawUrl);
	});
}
function formatChannelsStatusError(err) {
	return redactGatewayUrlSecretsInText(formatErrorMessage(err));
}
/** Query gateway channel status, falling back to config-only output when unavailable. */
async function channelsStatusCommand(opts, runtime = defaultRuntime) {
	const args = normalizeOptionalLowercaseString(opts.channel) === "all" ? {
		...opts,
		channel: void 0
	} : opts;
	const timeoutMs = parseTimeoutMsWithFallback(opts.timeout, opts.probe ? 3e4 : 1e4, { invalidType: "error" });
	const statusLabel = opts.probe ? "Checking channel status (probe)…" : "Checking channel status…";
	if (opts.json !== true && !process.stderr.isTTY) runtime.log(statusLabel);
	try {
		const payload = await withProgress({
			label: statusLabel,
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => {
			const params = {
				probe: Boolean(opts.probe),
				timeoutMs
			};
			if (args.channel) params.channel = args.channel;
			return await callGateway({
				method: "channels.status",
				params,
				timeoutMs
			});
		});
		if (opts.json) {
			writeRuntimeJson(runtime, payload);
			return;
		}
		const { formatGatewayChannelsStatusLines } = await loadChannelsStatusRuntime();
		runtime.log(formatGatewayChannelsStatusLines(payload).join("\n"));
	} catch (err) {
		const safeError = formatChannelsStatusError(err);
		const gatewayAuthUnavailable = isGatewaySecretRefUnavailableError(err);
		const { renderChannelsStatusFallback } = await loadChannelsStatusRuntime();
		await renderChannelsStatusFallback({
			opts: args,
			runtime,
			safeError,
			gatewayAuthUnavailable
		});
	}
}
//#endregion
export { channelsStatusCommand as t };
