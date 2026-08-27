import { h as normalizeSecretInputString } from "./types.secrets-Bre8L6Ts.js";
import "./channel-outbound-DO-F9-0m.js";
import { t as createAccountStatusSink } from "./channel-lifecycle.core-CnejcREy.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { t as runChannelProbe } from "./text-utility-runtime-BNhX-3os.js";
import "./accounts-GafVFMJs.js";
import "./runtime-api-BwZ-qidR.js";
import { r as getMe, t as ZaloApiError } from "./api-A1q4JRI9.js";
import { t as resolveZaloProxyFetch } from "./proxy-DKATBiE_.js";
import { t as sendMessageZalo } from "./send-Bp5A34rx.js";
//#region extensions/zalo/src/probe.ts
function formatZaloProbeError(error, timeoutMs) {
	if (error instanceof ZaloApiError) return error.description ?? error.message;
	if (error instanceof Error) return error.name === "AbortError" ? `Request timed out after ${timeoutMs}ms` : error.message;
	return String(error);
}
async function probeZalo(token, timeoutMs = 5e3, fetcher) {
	if (!token?.trim()) return {
		ok: false,
		error: "No token provided",
		elapsedMs: 0
	};
	return await runChannelProbe(void 0, async ({ elapsedMs }) => {
		const response = await getMe(token.trim(), timeoutMs, fetcher);
		if (response.ok && response.result) return {
			ok: true,
			bot: response.result,
			elapsedMs: elapsedMs()
		};
		return {
			ok: false,
			error: "Invalid response from Zalo API",
			elapsedMs: elapsedMs()
		};
	}, (error) => ({
		ok: false,
		error: formatZaloProbeError(error, timeoutMs)
	}));
}
//#endregion
//#region extensions/zalo/src/channel.runtime.ts
async function notifyZaloPairingApproval(params) {
	const { resolveZaloAccount } = await import("./accounts-BydesHDH.js");
	const account = resolveZaloAccount({ cfg: params.cfg });
	if (!account.token) throw new Error("Zalo token not configured");
	await sendMessageZalo(params.id, PAIRING_APPROVED_MESSAGE, { token: account.token });
}
async function sendZaloText(params) {
	return await sendMessageZalo(params.to, params.text, params);
}
async function probeZaloAccount(params) {
	return await probeZalo(params.account.token, params.timeoutMs, resolveZaloProxyFetch(params.account.config.proxy));
}
async function startZaloGatewayAccount(ctx) {
	const account = ctx.account;
	const token = account.token.trim();
	const mode = account.config.webhookUrl ? "webhook" : "polling";
	let zaloBotLabel = "";
	const fetcher = resolveZaloProxyFetch(account.config.proxy);
	try {
		const probe = await probeZalo(token, 2500, fetcher);
		const name = probe.ok ? probe.bot?.account_name?.trim() : null;
		if (name) zaloBotLabel = ` (${name})`;
		if (!probe.ok) ctx.log?.warn?.(`[${account.accountId}] Zalo probe failed before provider start (${String(probe.elapsedMs)}ms): ${probe.error}`);
		ctx.setStatus({
			accountId: account.accountId,
			bot: probe.bot
		});
	} catch (err) {
		ctx.log?.warn?.(`[${account.accountId}] Zalo probe threw before provider start: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
	}
	const statusSink = createAccountStatusSink({
		accountId: ctx.accountId,
		setStatus: ctx.setStatus
	});
	ctx.log?.info(`[${account.accountId}] starting provider${zaloBotLabel} mode=${mode}`);
	const { monitorZaloProvider } = await import("./monitor-Bwbq_swM.js");
	return monitorZaloProvider({
		token,
		account,
		config: ctx.cfg,
		runtime: ctx.runtime,
		abortSignal: ctx.abortSignal,
		useWebhook: Boolean(account.config.webhookUrl),
		webhookUrl: account.config.webhookUrl,
		webhookSecret: normalizeSecretInputString(account.config.webhookSecret),
		webhookPath: account.config.webhookPath,
		fetcher,
		statusSink
	});
}
//#endregion
export { notifyZaloPairingApproval, probeZaloAccount, sendZaloText, startZaloGatewayAccount };
