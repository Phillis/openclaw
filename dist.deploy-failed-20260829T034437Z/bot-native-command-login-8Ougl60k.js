import { t as danger } from "./globals-GZNLg1ns.js";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.js";
import { _ as updateSessionStoreEntry, m as resolveStorePath } from "./session-store-runtime-BNwfvw44.js";
import "./runtime-env-_YEv0JPQ.js";
import { a as createDeferred } from "./extension-shared-BO-DUGkx.js";
import { t as codexChannelLoginRuntime } from "./provider-auth-login-flow-runtime-CyY-MidG.js";
import "./text-utility-runtime-BNhX-3os.js";
import { s as buildTelegramRoutingTarget } from "./helpers-BYdV1asc.js";
import { t as withTelegramApiErrorLogging } from "./api-logging-KkPWCBmJ.js";
import { t as defaultTelegramNativeCommandDeps } from "./bot-native-command-deps.runtime.js";
//#region extensions/telegram/src/bot-native-command-login.ts
const activeTelegramCodexLoginFlows = codexChannelLoginRuntime.createFlowRegistry();
function formatTelegramLoginDeviceCode(params) {
	return [
		`<b>${escapeHtml(params.title)}</b>`,
		"",
		...params.message ? [escapeHtml(params.message)] : [],
		`Code: <code>${escapeHtml(params.code)}</code>`,
		...params.expiresInMinutes ? [`Code expires in ${params.expiresInMinutes} minutes. Never share it.`] : []
	].join("\n");
}
function resolveTelegramCodexLoginProviderInput(commandArgs) {
	const providerValue = commandArgs?.values?.provider;
	return typeof providerValue === "string" && providerValue.trim() ? providerValue : commandArgs?.raw ?? "codex";
}
function buildTelegramCodexLoginFlowKey(params) {
	const { dispatch } = params;
	const threadKey = dispatch.threadSpec.id == null ? dispatch.threadSpec.scope : `${dispatch.threadSpec.scope}:${dispatch.threadSpec.id}`;
	return [
		"telegram",
		dispatch.route.accountId,
		String(dispatch.chatId),
		threadKey,
		dispatch.route.agentId,
		params.provider
	].join(":");
}
async function executeTelegramLoginCommand(params) {
	const { dispatch } = params;
	const sendLoginMessage = async (text) => {
		await withTelegramApiErrorLogging({
			operation: "sendMessage",
			runtime: dispatch.runtime,
			fn: () => dispatch.bot.api.sendMessage(dispatch.chatId, text, dispatch.threadParams ?? {})
		});
	};
	const sendLoginDeviceCode = async (deviceCode) => {
		await withTelegramApiErrorLogging({
			operation: "sendMessage",
			runtime: dispatch.runtime,
			fn: () => dispatch.bot.api.sendMessage(dispatch.chatId, formatTelegramLoginDeviceCode(deviceCode), {
				...dispatch.threadParams,
				parse_mode: "HTML"
			})
		});
	};
	const sendLoginResultMessage = async (text) => {
		await dispatch.telegramDeps.sendMessageTelegram(buildTelegramRoutingTarget(dispatch.chatId, dispatch.threadSpec), text, {
			cfg: dispatch.runtimeCfg,
			token: dispatch.opts.token,
			accountId: dispatch.route.accountId
		});
	};
	if (!dispatch.senderIsOwner || !codexChannelLoginRuntime.hasConfiguredCommandOwnerAllowlist(dispatch.runtimeCfg)) {
		await sendLoginMessage("Only a configured OpenClaw owner can start Codex login from Telegram.");
		return false;
	}
	if (dispatch.isGroup) {
		await sendLoginMessage("For safety, Codex login codes are only sent in a private chat with this bot. DM this bot `/login codex` to pair Codex.");
		return true;
	}
	const loginProvider = codexChannelLoginRuntime.resolveProvider(resolveTelegramCodexLoginProviderInput(params.commandArgs));
	if (!loginProvider) {
		await sendLoginMessage("Unsupported login provider. Use `/login codex`.");
		return false;
	}
	const flowKey = buildTelegramCodexLoginFlowKey({
		dispatch,
		provider: loginProvider
	});
	const reservation = codexChannelLoginRuntime.reserveFlow({
		flows: activeTelegramCodexLoginFlows,
		flowKey
	});
	if (reservation.status === "active") {
		await sendLoginMessage("A Codex login code is already active for this Telegram chat. Complete it, or wait for it to expire before requesting a new one.");
		return true;
	}
	const flowSignal = dispatch.opts.accountAbortSignal ? AbortSignal.any([reservation.record.signal, dispatch.opts.accountAbortSignal]) : reservation.record.signal;
	const deviceCodeDelivered = createDeferred();
	let deviceCodeWasDelivered = false;
	const completion = (async () => {
		const sessionSwitchFailedMessage = "Codex login completed, but this Telegram session could not switch to the newly authenticated profile. Retry `/login codex`, or select the profile manually.";
		let terminalMessage;
		const loginFlow = dispatch.telegramDeps.runModelsAuthLoginFlow ?? defaultTelegramNativeCommandDeps.runModelsAuthLoginFlow;
		try {
			if (!loginFlow) throw new Error("Codex login flow is unavailable.");
			const targetSessionEntryAtStart = dispatch.nativeCommandRuntime.getSessionEntry({
				agentId: dispatch.route.agentId,
				sessionKey: dispatch.targetSessionKey
			});
			const loginResult = await codexChannelLoginRuntime.runDeviceLoginFlow({
				runLoginFlow: loginFlow,
				provider: loginProvider,
				agentId: dispatch.route.agentId,
				config: dispatch.runtimeCfg,
				runtime: dispatch.runtime,
				signal: flowSignal,
				sendMessage: sendLoginMessage,
				sendDeviceCode: async (deviceCode) => {
					flowSignal.throwIfAborted();
					await sendLoginDeviceCode(deviceCode);
					flowSignal.throwIfAborted();
					deviceCodeWasDelivered = true;
					deviceCodeDelivered.resolve();
				},
				unsupportedPromptMessage: "Telegram /login supports only fixed Codex device-code auth."
			});
			flowSignal.throwIfAborted();
			const nextProfileId = loginResult.profiles.find((profile) => profile.provider === loginProvider)?.profileId;
			terminalMessage = "Codex login complete. Try your request again now.";
			if (!nextProfileId) terminalMessage = sessionSwitchFailedMessage;
			else {
				const storePath = resolveStorePath(dispatch.runtimeCfg.session?.store, { agentId: dispatch.route.agentId });
				let entryObserved = false;
				let adoptionAllowed = false;
				try {
					const persisted = await updateSessionStoreEntry({
						sessionKey: dispatch.targetSessionKey,
						storePath,
						requireWriteSuccess: true,
						skipMaintenance: true,
						update: (entry) => {
							entryObserved = true;
							const source = entry.authProfileOverrideSource ?? (typeof entry.authProfileOverrideCompactionCount === "number" ? "auto" : entry.authProfileOverride ? "user" : void 0);
							if (flowSignal.aborted || (targetSessionEntryAtStart ? entry.sessionId !== targetSessionEntryAtStart.sessionId || entry.authProfileOverride !== targetSessionEntryAtStart.authProfileOverride || entry.authProfileOverrideSource !== targetSessionEntryAtStart.authProfileOverrideSource || entry.authProfileOverrideCompactionCount !== targetSessionEntryAtStart.authProfileOverrideCompactionCount : source === "user" && entry.authProfileOverride !== nextProfileId)) return null;
							adoptionAllowed = true;
							return entry.authProfileOverride !== nextProfileId || entry.authProfileOverrideSource !== "user" || entry.authProfileOverrideCompactionCount !== void 0 ? {
								authProfileOverride: nextProfileId,
								authProfileOverrideSource: "user",
								authProfileOverrideCompactionCount: void 0
							} : null;
						}
					});
					flowSignal.throwIfAborted();
					if (entryObserved && (!adoptionAllowed || !persisted || persisted.authProfileOverride !== nextProfileId || persisted.authProfileOverrideSource !== "user" || persisted.authProfileOverrideCompactionCount !== void 0)) terminalMessage = sessionSwitchFailedMessage;
				} catch (error) {
					flowSignal.throwIfAborted();
					dispatch.runtime.error?.(danger(`telegram /login codex completed but failed to update session auth profile: ${String(error)}`));
					terminalMessage = sessionSwitchFailedMessage;
				}
			}
		} catch (error) {
			if (flowSignal.aborted) return;
			dispatch.runtime.error?.(danger(`telegram /login codex failed: ${String(error)}`));
			terminalMessage = "Codex login did not complete. Send `/login codex` to request a new code.";
		}
		if (flowSignal.aborted) return;
		try {
			await sendLoginResultMessage(terminalMessage);
		} catch (error) {
			dispatch.runtime.error?.(danger(`telegram /login codex result notification failed: ${String(error)}`));
		}
	})().finally(() => {
		codexChannelLoginRuntime.releaseFlow({
			flows: activeTelegramCodexLoginFlows,
			flowKey,
			record: reservation.record
		});
	});
	await Promise.race([deviceCodeDelivered.promise, completion]);
	return deviceCodeWasDelivered;
}
//#endregion
export { executeTelegramLoginCommand };
