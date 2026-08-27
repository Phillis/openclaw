import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./utils-Bw16L5tB.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as resolveTranscriptsConfig } from "./config-UoehNruw.js";
import { n as listTranscriptSourceProviders, t as getTranscriptSourceProvider } from "./provider-registry-DXZOKFm2.js";
import { t as sanitizeTranscriptSourceLocator } from "./source-locator-BSjIr0Fk.js";
import { r as summarizeTranscripts, t as TranscriptsStore } from "./store-UaUKgGKU.js";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Type } from "typebox";
//#region src/transcripts/manual-source.ts
/**
* Manual transcript import provider.
*
* This provider turns pasted text into final transcript utterances, optionally
* splitting "Speaker: text" prefixes into speaker labels.
*/
function parseSpeakerLine(line) {
	const match = /^([^:\n]{1,80}):\s+(.+)$/.exec(line.trim());
	if (!match) return { text: line.trim() };
	return {
		speakerLabel: match[1]?.trim(),
		text: match[2]?.trim() ?? ""
	};
}
/** Built-in provider for post-hoc transcript text imports. */
const manualTranscriptSourceProvider = {
	id: "manual-transcript",
	aliases: ["import", "transcript"],
	name: "Manual Transcript Import",
	sourceKinds: ["posthoc-transcript"],
	async importTranscript(request) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		return request.text.split(/\r?\n/).map((line) => parseSpeakerLine(line)).filter((entry) => entry.text).map((entry, index) => ({
			id: `${request.session.sessionId}-${index + 1}`,
			sessionId: request.session.sessionId,
			startedAt: now,
			final: true,
			speaker: { label: entry.speakerLabel ?? request.speakerLabel ?? "Speaker" },
			text: entry.text
		}));
	}
};
//#endregion
//#region src/agents/tools/transcripts-tool-runtime.ts
const ACCOUNT_ID_OUTPUT_MAX_CHARS = 64;
function formatAccountIdForToolText(accountId) {
	return JSON.stringify(truncateUtf16Safe(accountId, ACCOUNT_ID_OUTPUT_MAX_CHARS));
}
const activeSessions = /* @__PURE__ */ new Map();
const startingSessionIds = /* @__PURE__ */ new Set();
function createStartupAbortScope(parent) {
	if (!parent) return {
		signal: void 0,
		detach: () => {}
	};
	const controller = new AbortController();
	const abortFromParent = () => controller.abort(parent.reason);
	if (parent.aborted) abortFromParent();
	else parent.addEventListener("abort", abortFromParent, { once: true });
	return {
		signal: controller.signal,
		detach: () => parent.removeEventListener("abort", abortFromParent)
	};
}
function readTranscriptStringParam(params, key, options = {}) {
	const value = params[key];
	if (typeof value !== "string") {
		if (options.required) throw new Error(`${key} required`);
		return;
	}
	const normalized = options.trim === false ? value : value.trim();
	if (!normalized && options.required) throw new Error(`${key} required`);
	return normalized || void 0;
}
function createTranscriptSessionId() {
	return `transcript-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;
}
function sourceFromParams(params) {
	return {
		providerId: readTranscriptStringParam(params, "providerId", { trim: true }) ?? "manual-transcript",
		accountId: readTranscriptStringParam(params, "accountId", { trim: true }),
		guildId: readTranscriptStringParam(params, "guildId", { trim: true }),
		channelId: readTranscriptStringParam(params, "channelId", { trim: true }),
		meetingUrl: readTranscriptStringParam(params, "meetingUrl", { trim: true })
	};
}
function resolveSourceProvider(providerId, ctx) {
	return providerId === manualTranscriptSourceProvider.id ? manualTranscriptSourceProvider : getTranscriptSourceProvider(providerId, ctx.config);
}
function bindSourceToTurnAccount(params) {
	const ownership = params.provider.accessControl;
	if (!ownership) return { source: params.source };
	if (params.ctx.caller?.kind === "operator") return { source: params.source };
	const ownerChannel = ownership.channelId.trim().toLowerCase();
	if (!ownerChannel) throw new Error(`transcripts provider ${params.provider.id} has an invalid account owner channel`);
	const channel = params.ctx.caller?.channel?.trim().toLowerCase();
	const accountId = params.ctx.caller?.accountId?.trim();
	if (!channel) return { source: params.source };
	if (channel !== ownerChannel) throw new Error(`transcripts provider ${params.provider.id} can only ${params.operation} from ${ownerChannel} or a channel-less local tool`);
	if (!accountId) throw new Error(`transcripts provider ${params.provider.id} requires trusted account context from ${channel}`);
	return { source: {
		...params.source,
		accountId
	} };
}
async function authorizeTranscriptSource(params) {
	params.ctx.assertCallerActive?.();
	const ownership = params.provider.accessControl;
	if (!ownership) return;
	const caller = params.ctx.caller;
	if (!caller) throw new Error("transcripts caller authorization is unavailable");
	const authorization = await ownership.authorize({
		action: params.action,
		caller,
		cfg: params.ctx.config,
		source: params.source
	});
	params.ctx.assertCallerActive?.();
	if (!authorization.ok) throw new Error(authorization.error);
}
function resolveTranscriptSourceOwnership(params) {
	const boundSource = bindSourceToTurnAccount(params);
	const ownership = params.provider.accessControl;
	const trustedAccountId = ownership && params.ctx.caller?.kind === "channel" ? params.ctx.caller.accountId?.trim() : void 0;
	const sourceForResolution = trustedAccountId ? {
		...boundSource.source,
		accountId: trustedAccountId
	} : boundSource.source;
	const accountResolution = ownership?.resolveAccountId({
		cfg: params.ctx.config,
		source: sourceForResolution
	});
	if (accountResolution && !accountResolution.ok) throw new Error(accountResolution.error);
	const resolvedAccountId = accountResolution ? accountResolution.value?.trim() : sourceForResolution.accountId?.trim();
	if (trustedAccountId && resolvedAccountId !== trustedAccountId) throw new Error(`transcripts provider ${params.provider.id} could not use trusted account ${formatAccountIdForToolText(trustedAccountId)}`);
	const providerSource = ownership ? {
		...sourceForResolution,
		accountId: resolvedAccountId
	} : sourceForResolution;
	if (params.configuredLifecycle && ownership && !providerSource.accountId?.trim()) throw new Error(`transcripts provider ${params.provider.id} could not resolve an account for configured auto-start`);
	return { source: providerSource };
}
function toolText(text, details) {
	return {
		content: [{
			type: "text",
			text
		}],
		details: details ?? {}
	};
}
async function stopPendingTranscriptCapture(params) {
	if (!params.provider?.stop) return `transcripts provider ${params.session.source.providerId} cannot stop live capture`;
	try {
		const result = await params.provider.stop({
			cfg: params.ctx.config,
			sessionId: params.session.sessionId,
			source: params.session.source,
			reason: params.reason
		});
		return result.ok ? void 0 : result.error;
	} catch (error) {
		return error instanceof Error ? error.message : String(error);
	}
}
async function startTranscripts(params) {
	if (params.abortSignal?.aborted) throw new Error("transcripts start aborted");
	const requestedSource = {
		...sourceFromParams(params.rawParams),
		...params.ctx.agentId ? { agentId: params.ctx.agentId } : {}
	};
	const provider = resolveSourceProvider(requestedSource.providerId, params.ctx);
	if (!provider?.start) throw new Error(`transcripts provider ${requestedSource.providerId} cannot start live capture`);
	const providerSource = resolveTranscriptSourceOwnership({
		ctx: params.ctx,
		operation: "start",
		provider,
		source: requestedSource,
		configuredLifecycle: params.configuredLifecycle
	}).source;
	if (!params.configuredLifecycle) await authorizeTranscriptSource({
		action: "start",
		ctx: params.ctx,
		provider,
		source: providerSource
	});
	const session = {
		sessionId: readTranscriptStringParam(params.rawParams, "sessionId", { trim: true }) ?? createTranscriptSessionId(),
		title: readTranscriptStringParam(params.rawParams, "title", { trim: true }),
		source: sanitizeTranscriptSourceLocator(providerSource),
		startedAt: (/* @__PURE__ */ new Date()).toISOString(),
		metadata: params.ctx.agentId ? { agentId: params.ctx.agentId } : {}
	};
	if (activeSessions.has(session.sessionId) || startingSessionIds.has(session.sessionId)) throw new Error(`transcripts session already active: ${session.sessionId}`);
	startingSessionIds.add(session.sessionId);
	try {
		await params.store.writeSession(session);
		let startupPending = true;
		const startupAbort = createStartupAbortScope(params.abortSignal);
		let result;
		try {
			result = await provider.start({
				cfg: params.ctx.config,
				session: {
					...session,
					source: providerSource
				},
				abortSignal: startupAbort.signal,
				startupWaitMs: params.startupWaitMs,
				onUtterance: async (utterance) => {
					if (startupPending && startupAbort.signal?.aborted) return;
					await params.store.appendUtteranceForSession(session, utterance);
				}
			});
		} finally {
			startupAbort.detach();
		}
		if (!result.ok) throw new Error(result.error);
		if (startupAbort.signal?.aborted) {
			const cleanupError = await stopPendingTranscriptCapture({
				ctx: params.ctx,
				provider,
				session,
				reason: "service-stop"
			});
			if (cleanupError) {
				activeSessions.set(session.sessionId, {
					session,
					providerId: provider.id,
					cleanupPending: true,
					...params.lifecycleToken ? { lifecycleToken: params.lifecycleToken } : {}
				});
				throw new Error(`transcripts start aborted; provider cleanup failed: ${cleanupError}`);
			}
			throw new Error("transcripts start aborted");
		}
		startupPending = false;
		activeSessions.set(session.sessionId, {
			session,
			providerId: provider.id,
			...params.lifecycleToken ? { lifecycleToken: params.lifecycleToken } : {}
		});
		const effectiveAccount = session.source.accountId;
		return toolText(`Transcripts started: ${session.sessionId}${effectiveAccount ? `\nAccount: ${formatAccountIdForToolText(effectiveAccount)}` : ""}`, {
			sessionId: session.sessionId,
			startedAt: session.startedAt,
			providerId: provider.id,
			...effectiveAccount ? { accountId: effectiveAccount } : {}
		});
	} finally {
		startingSessionIds.delete(session.sessionId);
	}
}
//#endregion
//#region src/agents/tools/transcripts-tool.ts
/**
* transcripts built-in tool.
*
* Manages live capture, manual import, summarization, and process-local transcript sessions.
*/
const AUTO_START_RETRY_ATTEMPTS = 12;
const AUTO_START_RETRY_MS = 5e3;
const AUTO_START_STOP_TIMEOUT_MS = 5e3;
const AUTO_START_PROVIDER_READY_TIMEOUT_MS = 3e4;
function sameSessionIdentity(left, right) {
	return left.sessionId === right.sessionId && left.startedAt === right.startedAt;
}
function ownsTranscriptSession(ctx, session) {
	const ownerAgentId = session.metadata?.agentId;
	if (typeof ownerAgentId === "string") return ownerAgentId === ctx.agentId;
	return ctx.agentId ? ctx.agentId === "main" : ctx.caller?.kind === "operator";
}
async function canAccessTranscriptSession(ctx, session, action) {
	if (!ownsTranscriptSession(ctx, session)) return false;
	const provider = resolveSourceProvider(session.source.providerId, ctx);
	if (!provider) return ctx.caller?.kind === "operator";
	try {
		await authorizeTranscriptSource({
			action,
			ctx,
			provider,
			source: session.source
		});
		return true;
	} catch {
		return false;
	}
}
const TranscriptsSchema = Type.Object({
	action: Type.String({ description: "start, stop, status, import, or summarize." }),
	sessionId: Type.Optional(Type.String({ minLength: 1 })),
	title: Type.Optional(Type.String({ minLength: 1 })),
	providerId: Type.Optional(Type.String({ minLength: 1 })),
	accountId: Type.Optional(Type.String({ minLength: 1 })),
	guildId: Type.Optional(Type.String({ minLength: 1 })),
	channelId: Type.Optional(Type.String({ minLength: 1 })),
	meetingUrl: Type.Optional(Type.String({ minLength: 1 })),
	transcript: Type.Optional(Type.String({ minLength: 1 })),
	speakerLabel: Type.Optional(Type.String({ minLength: 1 }))
}, { additionalProperties: false });
function createStore(ctx) {
	return new TranscriptsStore(path.join(ctx.stateDir, "transcripts"), { env: {
		...process.env,
		OPENCLAW_STATE_DIR: ctx.stateDir
	} });
}
async function waitForPendingAutoStartsToSettle(pendingStarts) {
	if (pendingStarts.size === 0) return true;
	let timeout;
	try {
		return await Promise.race([Promise.allSettled(pendingStarts).then(() => true), new Promise((resolve) => {
			timeout = setTimeout(() => resolve(false), AUTO_START_STOP_TIMEOUT_MS);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
async function summarizeAndPersist(params) {
	const utterances = await params.store.readUtterancesForSession(params.session, { maxUtterances: params.config.maxUtterances });
	const summary = summarizeTranscripts({
		session: params.session,
		utterances
	});
	const intendedSummaryPath = await params.store.writeSummary(summary, params.session);
	try {
		return {
			summary,
			summaryPath: (await params.store.materializeSessionArtifacts(params.session, "all")).summaryPath
		};
	} catch (error) {
		return {
			summary,
			intendedSummaryPath,
			summaryExportError: String(error)
		};
	}
}
async function stopTranscripts(params) {
	const sessionSelector = readTranscriptStringParam(params.rawParams, "sessionId", {
		required: true,
		trim: true
	});
	const directActive = activeSessions.get(sessionSelector);
	if (params.lifecycleToken && (!directActive || directActive.lifecycleToken !== params.lifecycleToken)) return toolText(`Transcripts session no longer active: ${sessionSelector}`, {
		sessionId: sessionSelector,
		skipped: true
	});
	const resolvedEntry = directActive ? void 0 : await params.store.readSessionEntry(sessionSelector);
	const resolvedSession = directActive?.session ?? resolvedEntry?.session;
	const activeCandidate = resolvedSession !== void 0 ? activeSessions.get(resolvedSession.sessionId) : void 0;
	const activeMatchesResolved = activeCandidate !== void 0 && resolvedSession !== void 0 && sameSessionIdentity(activeCandidate.session, resolvedSession);
	const selectedActive = directActive ?? (activeMatchesResolved ? activeCandidate : void 0);
	const session = selectedActive?.session ?? resolvedSession;
	if (!session || !params.lifecycleToken && !await canAccessTranscriptSession(params.ctx, session, "stop")) throw new Error(`transcripts session not found: ${sessionSelector}`);
	const sessionId = session.sessionId;
	if (selectedActive?.stopToken) return toolText(`Transcripts session stop already in progress: ${sessionId}`, {
		sessionId,
		skipped: true
	});
	const stopToken = selectedActive ? Symbol("transcripts-stop") : void 0;
	if (selectedActive && stopToken) selectedActive.stopToken = stopToken;
	const provider = resolveSourceProvider(selectedActive?.providerId ?? session.source.providerId, params.ctx);
	try {
		let providerStopError;
		if (selectedActive?.cleanupPending) {
			providerStopError = await stopPendingTranscriptCapture({
				ctx: params.ctx,
				provider,
				session,
				reason: "tool-stop"
			});
			if (providerStopError) throw new Error(`transcripts provider cleanup failed: ${providerStopError}`);
		} else if (selectedActive && provider?.stop) {
			const result = await provider.stop({
				cfg: params.ctx.config,
				sessionId,
				source: session.source,
				reason: "tool-stop"
			});
			if (!result.ok) providerStopError = result.error;
		}
		if (selectedActive && (activeSessions.get(sessionId) !== selectedActive || selectedActive.stopToken !== stopToken)) return toolText(`Transcripts session no longer active: ${sessionId}`, {
			sessionId,
			skipped: true
		});
		const stoppedAt = (/* @__PURE__ */ new Date()).toISOString();
		const stoppedSession = {
			...session,
			stoppedAt,
			...providerStopError ? { metadata: {
				...session.metadata,
				providerStopError,
				providerStopFailedAt: stoppedAt
			} } : {}
		};
		if (selectedActive) {
			await params.store.writeSession(stoppedSession);
			if (activeSessions.get(sessionId) !== selectedActive || selectedActive.stopToken !== stopToken) return toolText(`Transcripts session no longer active: ${sessionId}`, {
				sessionId,
				skipped: true
			});
			activeSessions.delete(sessionId);
		} else await params.store.updateStopped(sessionSelector, stoppedAt);
		const { summaryPath, intendedSummaryPath, summary, summaryExportError } = await summarizeAndPersist({
			config: resolveTranscriptsConfig(params.ctx.config?.transcripts),
			store: params.store,
			session: stoppedSession
		});
		return toolText(`Transcripts stopped: ${sessionId}${summaryPath ? `\nSummary: ${summaryPath}` : `\nSummary export failed: ${summaryExportError}`}`, {
			sessionId,
			...providerStopError ? { providerStopError } : {},
			...summaryExportError ? { summaryExportError } : {},
			...intendedSummaryPath ? { intendedSummaryPath } : {},
			summary,
			...summaryPath ? { summaryPath } : {}
		});
	} finally {
		if (selectedActive && activeSessions.get(sessionId) === selectedActive && selectedActive.stopToken === stopToken) delete selectedActive.stopToken;
	}
}
async function importTranscripts(params) {
	const requestedSource = {
		...sourceFromParams(params.rawParams),
		...params.ctx.agentId ? { agentId: params.ctx.agentId } : {}
	};
	const provider = resolveSourceProvider(requestedSource.providerId, params.ctx);
	if (!provider?.importTranscript) throw new Error(`transcripts provider ${requestedSource.providerId} cannot import transcripts`);
	const providerSource = resolveTranscriptSourceOwnership({
		ctx: params.ctx,
		operation: "import",
		provider,
		source: requestedSource
	}).source;
	await authorizeTranscriptSource({
		action: "import",
		ctx: params.ctx,
		provider,
		source: providerSource
	});
	const session = {
		sessionId: readTranscriptStringParam(params.rawParams, "sessionId", { trim: true }) ?? createTranscriptSessionId(),
		title: readTranscriptStringParam(params.rawParams, "title", { trim: true }),
		source: sanitizeTranscriptSourceLocator(providerSource),
		startedAt: (/* @__PURE__ */ new Date()).toISOString(),
		stoppedAt: (/* @__PURE__ */ new Date()).toISOString(),
		metadata: params.ctx.agentId ? { agentId: params.ctx.agentId } : {}
	};
	const transcript = readTranscriptStringParam(params.rawParams, "transcript", {
		required: true,
		trim: false
	});
	await params.store.writeSession(session);
	const utterances = await provider.importTranscript({
		cfg: params.ctx.config,
		session: {
			...session,
			source: providerSource
		},
		text: transcript,
		speakerLabel: readTranscriptStringParam(params.rawParams, "speakerLabel", { trim: true })
	});
	for (const utterance of utterances) await params.store.appendUtteranceForSession(session, utterance);
	const { summaryPath, intendedSummaryPath, summary, summaryExportError } = await summarizeAndPersist({
		config: resolveTranscriptsConfig(params.ctx.config?.transcripts),
		store: params.store,
		session
	});
	return toolText(`Transcript imported: ${session.sessionId}${summaryPath ? `\nSummary: ${summaryPath}` : `\nSummary export failed: ${summaryExportError}`}`, {
		sessionId: session.sessionId,
		utteranceCount: utterances.length,
		...summaryExportError ? { summaryExportError } : {},
		...intendedSummaryPath ? { intendedSummaryPath } : {},
		summary,
		...summaryPath ? { summaryPath } : {}
	});
}
async function summarizeExisting(params) {
	const sessionId = readTranscriptStringParam(params.rawParams, "sessionId", {
		required: true,
		trim: true
	});
	const entry = await params.store.readSessionEntry(sessionId);
	if (!entry || !await canAccessTranscriptSession(params.ctx, entry.session, "summarize")) throw new Error(`transcripts session not found: ${sessionId}`);
	const { summaryPath, intendedSummaryPath, summary, summaryExportError } = await summarizeAndPersist({
		config: params.config,
		store: params.store,
		session: entry.session
	});
	return toolText(`Transcripts summarized: ${sessionId}${summaryPath ? `\nSummary: ${summaryPath}` : `\nSummary export failed: ${summaryExportError}`}`, {
		sessionId,
		...summaryExportError ? { summaryExportError } : {},
		...intendedSummaryPath ? { intendedSummaryPath } : {},
		summary,
		...summaryPath ? { summaryPath } : {}
	});
}
async function statusTranscripts(ctx) {
	const uniqueProviders = uniqueStrings([manualTranscriptSourceProvider.id, ...listTranscriptSourceProviders(ctx.config).map((provider) => provider.id)]);
	const active = (await Promise.all([...activeSessions.values()].map(async (entry) => await canAccessTranscriptSession(ctx, entry.session, "status") ? entry : void 0))).filter((entry) => entry !== void 0).map((entry) => ({
		sessionId: entry.session.sessionId,
		providerId: entry.providerId,
		title: entry.session.title,
		source: entry.session.source,
		cleanupPending: entry.cleanupPending === true
	}));
	return toolText([`Transcripts providers: ${uniqueProviders.length ? uniqueProviders.join(", ") : "none"}`, `Active sessions: ${active.length}`].join("\n"), {
		providers: uniqueProviders,
		active
	});
}
/** Create the agent-facing transcripts tool. */
function createTranscriptsTool(options) {
	const ctx = {
		config: options?.config,
		stateDir: options?.stateDir ?? resolveStateDir(),
		logger: options?.logger ?? console,
		...options?.agentId ? { agentId: options.agentId } : {},
		...options?.agentChannel ? { agentChannel: options.agentChannel } : {},
		...options?.agentAccountId ? { agentAccountId: options.agentAccountId } : {},
		...options?.caller ? { caller: options.caller } : {},
		...options?.assertCallerActive ? { assertCallerActive: options.assertCallerActive } : {}
	};
	return {
		name: "transcripts",
		label: "Transcripts",
		description: "Start/stop/import/summarize/status meeting transcripts: Discord, Google Meet, Slack huddles, others.",
		parameters: TranscriptsSchema,
		async execute(_toolCallId, rawParams, signal) {
			const config = resolveTranscriptsConfig(ctx.config?.transcripts);
			if (!config.enabled) throw new Error("transcripts are disabled");
			const params = asOptionalRecord(rawParams) ?? {};
			const action = readTranscriptStringParam(params, "action", {
				required: true,
				trim: true
			});
			const store = createStore(ctx);
			switch (action) {
				case "start": return await startTranscripts({
					ctx,
					store,
					rawParams: params,
					abortSignal: signal
				});
				case "stop": return await stopTranscripts({
					ctx,
					store,
					rawParams: params
				});
				case "import": return await importTranscripts({
					ctx,
					store,
					rawParams: params
				});
				case "summarize": return await summarizeExisting({
					config,
					ctx,
					store,
					rawParams: params
				});
				case "status": return await statusTranscripts(ctx);
				default: throw new Error(`unsupported transcripts action: ${action}`);
			}
		}
	};
}
/** Create the process lifecycle service that starts configured transcript captures. */
function createTranscriptsAutoStartService(ctx) {
	let stopped = false;
	const timers = /* @__PURE__ */ new Set();
	const startedSessions = /* @__PURE__ */ new Map();
	const pendingStartControllers = /* @__PURE__ */ new Set();
	const pendingStarts = /* @__PURE__ */ new Set();
	const schedule = (run, delayMs) => {
		const timer = setTimeout(() => {
			timers.delete(timer);
			run();
		}, delayMs);
		timers.add(timer);
	};
	const startEntry = (entry, attempt, store) => {
		if (stopped || startedSessions.has(entry.sessionId ?? "")) return;
		const abortController = new AbortController();
		const lifecycleToken = Symbol(entry.sessionId);
		pendingStartControllers.add(abortController);
		const startTask = startTranscripts({
			ctx,
			store,
			abortSignal: abortController.signal,
			startupWaitMs: AUTO_START_PROVIDER_READY_TIMEOUT_MS,
			configuredLifecycle: true,
			lifecycleToken,
			rawParams: {
				action: "start",
				...entry,
				sessionId: entry.sessionId ?? createTranscriptSessionId()
			}
		}).then((result) => {
			const sessionId = result.details?.sessionId;
			if (typeof sessionId === "string") startedSessions.set(sessionId, lifecycleToken);
		}).catch((err) => {
			if (stopped) return;
			if (attempt >= AUTO_START_RETRY_ATTEMPTS) {
				ctx.logger.warn(`transcripts autoStart failed provider=${entry.providerId}: ${err instanceof Error ? err.message : String(err)} (check the transcripts.autoStart entry in your config)`);
				return;
			}
			schedule(() => startEntry(entry, attempt + 1, store), AUTO_START_RETRY_MS);
		}).finally(() => {
			pendingStartControllers.delete(abortController);
			pendingStarts.delete(startTask);
		});
		pendingStarts.add(startTask);
	};
	return {
		start() {
			const config = resolveTranscriptsConfig(ctx.config?.transcripts);
			if (!config.enabled || config.autoStart.length === 0) return;
			const store = createStore(ctx);
			for (const entry of config.autoStart) startEntry({
				...entry,
				sessionId: entry.sessionId ?? createTranscriptSessionId()
			}, 1, store);
		},
		async stop() {
			stopped = true;
			for (const timer of timers) clearTimeout(timer);
			timers.clear();
			for (const controller of pendingStartControllers) controller.abort();
			if (!await waitForPendingAutoStartsToSettle(pendingStarts)) ctx.logger.warn(`transcripts autoStart stop timed out waiting for ${pendingStarts.size} pending start${pendingStarts.size === 1 ? "" : "s"}`);
			const store = createStore(ctx);
			for (const [sessionId, lifecycleToken] of startedSessions) await stopTranscripts({
				ctx,
				store,
				rawParams: {
					action: "stop",
					sessionId
				},
				lifecycleToken
			}).catch((err) => ctx.logger.warn(`transcripts autoStart stop failed session=${sessionId}: ${err instanceof Error ? err.message : String(err)}`));
			startedSessions.clear();
		}
	};
}
//#endregion
export { createTranscriptsTool as n, createTranscriptsAutoStartService as t };
