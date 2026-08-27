import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import "./message-channel-constants-2zSoJXQC.js";
import { a as validateTargetProviderPrefix } from "./channel-target-prefix-DCp3_j8g.js";
import { s as resolveReservedTargetLiteral } from "./target-normalization-C0pzawLy.js";
import { i as reservedTargetLiteralError, r as missingTargetError } from "./target-errors-CZ0A80hz.js";
import { d as mapAllowFromEntries } from "./channel-config-helpers-C6dKYMZI.js";
//#region src/infra/outbound/targets-resolve-shared.ts
function buildWebChatDeliveryError() {
	return /* @__PURE__ */ new Error(`Delivering to WebChat is not supported via \`${formatCliCommand("openclaw agent")}\`; use WhatsApp/Telegram or run with --deliver=false.`);
}
/**
* Resolves a target through a channel plugin or the generic fallback path.
*/
function resolveOutboundTargetWithPlugin(params) {
	if (params.target.channel === "webchat") return {
		ok: false,
		error: buildWebChatDeliveryError()
	};
	const plugin = params.plugin;
	if (!plugin) return params.onMissingPlugin?.();
	const allowFromRaw = params.target.allowFrom ?? (params.target.cfg && plugin.config.resolveAllowFrom ? plugin.config.resolveAllowFrom({
		cfg: params.target.cfg,
		accountId: params.target.accountId ?? void 0
	}) : void 0);
	const allowFrom = allowFromRaw ? mapAllowFromEntries(allowFromRaw) : void 0;
	const effectiveTo = params.target.to?.trim() || (params.target.cfg && plugin.config.resolveDefaultTo ? plugin.config.resolveDefaultTo({
		cfg: params.target.cfg,
		accountId: params.target.accountId ?? void 0
	}) : void 0);
	const targetPrefixError = validateTargetProviderPrefix({
		channel: params.target.channel,
		to: effectiveTo
	});
	if (targetPrefixError) return {
		ok: false,
		error: targetPrefixError
	};
	const hint = plugin.messaging?.targetResolver?.hint;
	if (params.target.mode !== "heartbeat") {
		const reservedLiteral = resolveReservedTargetLiteral({
			raw: effectiveTo,
			plugin
		});
		if (reservedLiteral) return {
			ok: false,
			error: reservedTargetLiteralError(plugin.meta.label ?? params.target.channel, reservedLiteral, hint)
		};
	}
	const resolveTarget = plugin.outbound?.resolveTarget;
	if (resolveTarget) return resolveTarget({
		cfg: params.target.cfg,
		to: effectiveTo,
		allowFrom,
		accountId: params.target.accountId ?? void 0,
		mode: params.target.mode ?? "explicit"
	});
	if (effectiveTo) return {
		ok: true,
		to: effectiveTo
	};
	return {
		ok: false,
		error: missingTargetError(plugin.meta.label ?? params.target.channel, hint)
	};
}
//#endregion
export { resolveOutboundTargetWithPlugin as t };
