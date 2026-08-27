import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { t as summarizeStringEntries } from "./string-sample-BYGbtG9S.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./text-utility-runtime-BNhX-3os.js";
import { a as listEnabledDiscordAccounts, c as resolveDiscordAccount } from "./accounts-Ce_-CVy_.js";
import { n as resolveDiscordVoiceEnabled, r as authorizeDiscordVoiceIngress, t as resolveDiscordVoiceAccess } from "./owner-access-GQGbG5bP.js";
//#region extensions/discord/src/voice/transcripts-source.ts
const managersByAccountId = /* @__PURE__ */ new Map();
const managerWaiters = /* @__PURE__ */ new Set();
const ACCOUNT_ID_ERROR_MAX_CHARS = 64;
const ACCOUNT_ID_ERROR_MAX_ENTRIES = 4;
function formatAccountIdForError(accountId) {
	return JSON.stringify(truncateUtf16Safe(accountId, ACCOUNT_ID_ERROR_MAX_CHARS));
}
function summarizeAccountIdsForError(accountIds) {
	return summarizeStringEntries({
		entries: accountIds.map(formatAccountIdForError),
		limit: ACCOUNT_ID_ERROR_MAX_ENTRIES
	});
}
function setDiscordTranscriptsVoiceManager(params) {
	if (params.manager) {
		managersByAccountId.set(params.accountId, params.manager);
		for (const waiter of managerWaiters) if (!waiter.accountId || waiter.accountId === params.accountId) waiter.resolve();
	} else managersByAccountId.delete(params.accountId);
}
const resolveDiscordTranscriptsAccountId = ({ cfg, source }) => {
	const requestedAccountId = source.accountId?.trim();
	const configuredVoiceAccounts = cfg ? listEnabledDiscordAccounts(cfg).filter((account) => resolveDiscordVoiceEnabled(account.config.voice)) : [];
	const capableAccountIds = (cfg ? configuredVoiceAccounts.filter((account) => account.tokenStatus === "available").map((account) => account.accountId) : [...managersByAccountId.keys()]).toSorted();
	if (requestedAccountId) {
		if (!cfg || capableAccountIds.includes(requestedAccountId)) return {
			ok: true,
			value: requestedAccountId
		};
		if (resolveDiscordAccount({
			cfg,
			accountId: requestedAccountId
		}).tokenStatus === "configured_unavailable") return {
			ok: false,
			error: `Discord account ${formatAccountIdForError(requestedAccountId)} has configured credentials that are unavailable in this runtime; resolve its SecretRef before using this account.`
		};
		return {
			ok: false,
			error: `Discord account ${formatAccountIdForError(requestedAccountId)} is not enabled for voice.`
		};
	}
	if (capableAccountIds.length === 1) return {
		ok: true,
		value: capableAccountIds[0]
	};
	if (capableAccountIds.length === 0) return {
		ok: false,
		error: "No Discord account has available credentials and voice enabled; configure credentials and enable voice for an account."
	};
	const configuredDefaultAccountId = cfg?.channels?.discord?.defaultAccount?.trim();
	if (configuredDefaultAccountId) {
		const normalizedDefaultAccountId = normalizeAccountId(configuredDefaultAccountId);
		if (capableAccountIds.includes(normalizedDefaultAccountId)) return {
			ok: true,
			value: normalizedDefaultAccountId
		};
	}
	if (capableAccountIds.includes("default")) return {
		ok: true,
		value: DEFAULT_ACCOUNT_ID
	};
	return {
		ok: false,
		error: `Multiple Discord accounts are enabled for voice (${summarizeAccountIdsForError(capableAccountIds)}); specify accountId.`
	};
};
async function waitForManager(request) {
	const accountResolution = resolveDiscordTranscriptsAccountId({
		cfg: request.cfg,
		source: request.session.source
	});
	if (!accountResolution.ok) return accountResolution;
	const accountId = accountResolution.value;
	const existing = accountId ? managersByAccountId.get(accountId) : void 0;
	if (existing) return {
		ok: true,
		value: existing
	};
	if (request.abortSignal?.aborted) return {
		ok: true,
		value: void 0
	};
	const startupWaitMs = request.startupWaitMs ?? 0;
	if (startupWaitMs <= 0) return {
		ok: true,
		value: void 0
	};
	await new Promise((resolve) => {
		const waiter = {
			accountId,
			resolve: () => {
				clearTimeout(timer);
				request.abortSignal?.removeEventListener("abort", waiter.resolve);
				managerWaiters.delete(waiter);
				resolve();
			}
		};
		const timer = setTimeout(waiter.resolve, startupWaitMs);
		timer.unref?.();
		request.abortSignal?.addEventListener("abort", waiter.resolve, { once: true });
		managerWaiters.add(waiter);
	});
	if (request.abortSignal?.aborted) return {
		ok: true,
		value: void 0
	};
	return {
		ok: true,
		value: accountId ? managersByAccountId.get(accountId) : void 0
	};
}
const discordVoiceTranscriptsSourceProvider = {
	id: "discord-voice",
	aliases: ["discord"],
	accessControl: {
		channelId: "discord",
		resolveAccountId: resolveDiscordTranscriptsAccountId,
		async authorize({ caller, cfg, source }) {
			if (caller.kind === "operator") return {
				ok: true,
				value: void 0
			};
			const guildId = source.guildId?.trim();
			const channelId = source.channelId?.trim();
			const callerAccountId = caller.accountId?.trim();
			const sourceAccountId = source.accountId?.trim();
			if (caller.channel !== "discord" || !cfg || !callerAccountId || sourceAccountId !== callerAccountId || !guildId || !channelId || caller.groupSpace !== guildId) return {
				ok: false,
				error: "You are not authorized to use this command."
			};
			const target = await managersByAccountId.get(callerAccountId)?.resolveAccessTarget({
				guildId,
				channelId
			});
			if (!target) return {
				ok: false,
				error: "Discord voice access target is unavailable."
			};
			const account = resolveDiscordAccount({
				cfg,
				accountId: callerAccountId
			});
			const access = await authorizeDiscordVoiceIngress({
				cfg,
				discordConfig: account.config,
				accountId: account.accountId,
				guild: target.guild,
				guildId,
				channelId,
				...target.channelName ? { channelName: target.channelName } : {},
				channelSlug: target.channelSlug,
				...target.parentId ? { parentId: target.parentId } : {},
				...target.parentName ? { parentName: target.parentName } : {},
				...target.parentSlug ? { parentSlug: target.parentSlug } : {},
				scope: target.scope,
				memberRoleIds: [...caller.roleIds],
				admissionAllowFrom: resolveDiscordVoiceAccess({
					cfg,
					discordConfig: account.config,
					accountId: account.accountId
				}).admissionAllowFrom,
				sender: { id: caller.senderId }
			});
			return access.ok ? {
				ok: true,
				value: void 0
			} : {
				ok: false,
				error: access.message
			};
		}
	},
	name: "Discord Voice",
	sourceKinds: ["live-audio"],
	async start(request) {
		const managerResolution = await waitForManager(request);
		if (!managerResolution.ok) return managerResolution;
		const manager = managerResolution.value;
		if (!manager) return {
			ok: false,
			error: "Discord voice manager is not available."
		};
		if (request.abortSignal?.aborted) return {
			ok: false,
			error: "Discord transcripts start aborted."
		};
		const guildId = request.session.source.guildId?.trim();
		const channelId = request.session.source.channelId?.trim();
		if (!guildId || !channelId) return {
			ok: false,
			error: "Discord transcripts require guildId and channelId."
		};
		const joined = await manager.join({
			guildId,
			channelId
		}, { transcripts: {
			sessionId: request.session.sessionId,
			onUtterance: request.onUtterance
		} });
		if (!joined.ok) return {
			ok: false,
			error: joined.message
		};
		return {
			ok: true,
			session: request.session
		};
	},
	async stop(request) {
		const accountId = request.source.accountId?.trim();
		if (!accountId) return {
			ok: false,
			error: "Discord transcripts require accountId to stop a voice session."
		};
		const manager = managersByAccountId.get(accountId);
		if (!manager) return {
			ok: false,
			error: "Discord voice manager is not available."
		};
		const guildId = request.source.guildId?.trim();
		if (!guildId) return {
			ok: false,
			error: "Discord transcripts require guildId."
		};
		const result = await manager.leave({
			guildId,
			channelId: request.source.channelId
		}, { transcriptsSessionId: request.sessionId });
		if (!result.ok) return {
			ok: false,
			error: result.message
		};
		return {
			ok: true,
			sessionId: request.sessionId,
			stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	},
	async status(source) {
		const accountId = source.accountId?.trim();
		if (!accountId) return [];
		return managersByAccountId.get(accountId)?.status().map((entry) => ({
			active: entry.ok,
			message: entry.message,
			source: {
				providerId: "discord-voice",
				accountId,
				guildId: entry.guildId,
				channelId: entry.channelId
			}
		})) ?? [];
	}
};
//#endregion
export { setDiscordTranscriptsVoiceManager as n, discordVoiceTranscriptsSourceProvider as t };
