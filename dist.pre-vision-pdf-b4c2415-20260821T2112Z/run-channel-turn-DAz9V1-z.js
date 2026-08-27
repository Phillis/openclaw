import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { u as createHostChannelInboundEventContextBuilder } from "./loader-B4G6K_LK.js";
import { l as kindFromMime, u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import { d as projectMediaFacts, u as normalizeMediaFacts } from "./media-facts-CdKKNGmE.js";
import { t as probeMediaFilesWithinBudget } from "./media-services-BMidrwE0.js";
import { n as createCommandTurnContext, t as commandTurnKindToSource } from "./command-turn-context-CRxhzdEY.js";
import { i as normalizeInboundTextNewlines, t as finalizeInboundContext } from "./inbound-context-LXL8l8JC.js";
import { a as resolveLocalMediaPath } from "./local-roots-Beya70q2.js";
import { _ as recordChannelHistoryEntryWithMedia } from "./history-DLKGD0Dj.js";
import { r as shouldIncludeSupplementalContext } from "./context-visibility-C5CaKMWO.js";
import { i as runPreparedChannelTurn, n as dispatchAssembledChannelTurn, r as dispatchRoutedChannelTurn, t as assembleResolvedChannelTurn } from "./lifecycle-zWExRgtQ.js";
//#region src/channels/inbound-event/media.ts
const MAX_INBOUND_MEDIA_PROBES = 8;
const INBOUND_MEDIA_PROBE_CONCURRENCY = 2;
const INBOUND_MEDIA_PROBE_BUDGET_MS = 3e3;
function resolveMediaPlaceholderKind(media) {
	if (media.kind && media.kind !== "unknown") return media.kind;
	const inferredKind = kindFromMime(media.contentType) ?? kindFromMime(mimeTypeFromFilePath(media.url)) ?? kindFromMime(mimeTypeFromFilePath(media.path));
	return inferredKind && inferredKind !== "unknown" ? inferredKind : "attachment";
}
const PLURAL_MEDIA_PLACEHOLDER_LABELS = {
	image: "images",
	video: "videos",
	audio: "audio attachments",
	document: "files",
	sticker: "stickers",
	attachment: "attachments"
};
/** Renders structured media facts for channel surfaces that can carry text only. */
function formatMediaPlaceholderText(media) {
	if (media.length === 0) return "";
	const kinds = media.map(resolveMediaPlaceholderKind);
	const firstKind = kinds[0] ?? "attachment";
	const kind = kinds.every((candidate) => candidate === firstKind) ? firstKind : kinds.includes("attachment") ? "attachment" : "document";
	const tag = `<media:${kind}>`;
	return media.length === 1 ? tag : `${tag} (${media.length} ${PLURAL_MEDIA_PLACEHOLDER_LABELS[kind]})`;
}
/** Appends an unavailable-media notice to real caption text, or returns the notice alone. */
function formatInboundMediaUnavailableText(params) {
	const body = params.body?.trim() ?? "";
	const notice = params.notice.trim();
	if (!body) return notice;
	return `${body}\n\n${notice}`;
}
/** Normalizes plugin-provided attachments into ordered runtime facts. */
function toInboundMediaFacts(media, defaults = {}) {
	return normalizeMediaFacts(media, defaults);
}
function resolveProbeKind(media) {
	const kind = media.kind ?? kindFromMime(media.contentType) ?? kindFromMime(mimeTypeFromFilePath(media.path));
	return kind === "audio" || kind === "video" ? kind : void 0;
}
/** Adds best-effort audio/video metadata without probing URL-only media. */
async function toInboundMediaFactsWithMetadata(media, defaults = {}) {
	const facts = toInboundMediaFacts(media, defaults);
	const enriched = [...facts];
	const candidates = [];
	for (const [index, fact] of facts.entries()) {
		const kind = resolveProbeKind(fact);
		const localPath = fact.path ? resolveLocalMediaPath(fact.path) : void 0;
		if (kind && localPath) candidates.push({
			fact,
			index,
			kind,
			localPath
		});
	}
	const metadata = await probeMediaFilesWithinBudget(candidates.map((candidate) => ({
		filePath: candidate.localPath,
		kind: candidate.kind
	})), {
		budgetMs: INBOUND_MEDIA_PROBE_BUDGET_MS,
		concurrency: INBOUND_MEDIA_PROBE_CONCURRENCY,
		maxProbes: MAX_INBOUND_MEDIA_PROBES
	});
	for (const [candidateIndex, candidate] of candidates.entries()) enriched[candidate.index] = {
		...candidate.fact,
		...metadata[candidateIndex]
	};
	return enriched;
}
/** Projects facts into history without transient turn-only fields. */
function toHistoryMediaEntries(media, defaults = {}) {
	return toInboundMediaFacts(media, defaults).map((entry) => {
		const historyEntry = {
			path: entry.path,
			url: entry.url,
			contentType: entry.contentType,
			kind: entry.kind,
			messageId: entry.messageId
		};
		if (entry.durationMs) historyEntry.durationMs = entry.durationMs;
		if (entry.width) historyEntry.width = entry.width;
		if (entry.height) historyEntry.height = entry.height;
		return historyEntry;
	});
}
/**
* Builds the legacy singular/plural environment projection.
* @deprecated Pass ordered facts as `media`; use `toInboundMediaFacts` to normalize inputs.
*/
function buildChannelInboundMediaPayload(media) {
	return projectMediaFacts(media);
}
//#endregion
//#region src/channels/inbound-event/context.ts
/**
* Channel inbound event context builder.
*
* Converts route, sender, command, media, and supplemental facts into finalized message context.
*/
function keepSupplementalContext(params) {
	if (!params.mode || params.mode === "all") return true;
	if (params.senderAllowed === void 0) return false;
	return shouldIncludeSupplementalContext({
		mode: params.mode,
		kind: params.kind,
		senderAllowed: params.senderAllowed
	});
}
function filterChannelInboundSupplementalContext(params) {
	const supplemental = params.supplemental;
	if (!supplemental) return;
	const quote = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "quote",
		senderAllowed: supplemental.quote?.senderAllowed
	}) ? supplemental.quote : void 0;
	const forwarded = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "forwarded",
		senderAllowed: supplemental.forwarded?.senderAllowed
	}) ? supplemental.forwarded : void 0;
	const thread = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "thread",
		senderAllowed: supplemental.thread?.senderAllowed
	}) ? supplemental.thread : void 0;
	return {
		...supplemental,
		quote,
		forwarded,
		thread
	};
}
/** Resolves whether a supplemental-context sender passes the active group policy. */
function resolveInboundSupplementalSenderAllowed(params) {
	if (!params.isGroup || params.groupPolicy !== "allowlist") return true;
	return params.isSenderAllowed(params.allowFrom);
}
function filterChannelInboundQuoteContext(contextVisibility, quote) {
	return filterChannelInboundSupplementalContext({
		contextVisibility,
		supplemental: quote ? { quote } : void 0
	})?.quote;
}
function definedFields(fields) {
	return Object.fromEntries(Object.entries(fields).filter((entry) => entry[1] !== void 0));
}
function stripQuoteRuntimeFields(quote) {
	const { media: _media, isSelf: _isSelf, ...stripped } = quote;
	return stripped;
}
function resolveChannelInboundSupplementalForFinalizer(params) {
	const rawSupplemental = params.supplemental;
	const filtered = filterChannelInboundSupplementalContext({
		supplemental: rawSupplemental,
		contextVisibility: params.contextVisibility
	});
	const media = [...params.media ?? []];
	if (!rawSupplemental?.quote || !filtered?.quote) return {
		rawSupplemental,
		supplemental: filtered,
		media
	};
	const quote = filtered.quote;
	const selfQuote = quote.isSelf === true;
	const suppressSelfQuoteBody = params.suppressSelfQuoteBody ?? true;
	const suppressSelfQuoteMedia = params.suppressSelfQuoteMedia ?? true;
	const finalizeQuote = (quoteMedia) => {
		if (!(selfQuote && suppressSelfQuoteMedia)) media.push(...quoteMedia ?? []);
		const stripped = stripQuoteRuntimeFields(quote);
		const visibleQuote = selfQuote && suppressSelfQuoteBody ? (({ body: _body, ...withoutBody }) => withoutBody)(stripped) : stripped;
		return {
			rawSupplemental,
			supplemental: {
				...filtered,
				quote: visibleQuote
			},
			media
		};
	};
	if (selfQuote && suppressSelfQuoteMedia) return finalizeQuote(void 0);
	if (!params.resolveSupplementalMedia) return finalizeQuote(Array.isArray(quote.media) ? quote.media : void 0);
	if (typeof quote.media !== "function") return finalizeQuote(quote.media);
	const resolved = quote.media();
	return isPromiseLike(resolved) ? resolved.then(finalizeQuote) : finalizeQuote(resolved);
}
function finalizePreparedChannelInboundContext(params) {
	const mediaPayload = params.media ? definedFields(buildChannelInboundMediaPayload([...params.media])) : {};
	const baseContext = {
		...params.originalContext,
		SupplementalContext: params.supplemental,
		...params.media ? { media: [...params.media] } : {},
		...mediaPayload
	};
	const channelStructuredContext = resolveChannelStructuredContext({
		supplemental: params.supplemental,
		extra: baseContext
	});
	const structuredContextField = channelStructuredContext.kind === "present" ? { ChannelStructuredContext: channelStructuredContext.entries } : {};
	return {
		context: (params.finalize ?? finalizeInboundContext)({
			...baseContext,
			...structuredContextField
		}, params.finalizeOptions),
		supplemental: params.supplemental,
		quoteHidden: Boolean(params.rawSupplemental?.quote && !params.supplemental?.quote),
		forwardedHidden: Boolean(params.rawSupplemental?.forwarded && !params.supplemental?.forwarded),
		threadHidden: Boolean(params.rawSupplemental?.thread && !params.supplemental?.thread)
	};
}
function finalizeChannelInboundContextValue(params) {
	const contextSupplemental = params.context.SupplementalContext;
	const prepared = resolveChannelInboundSupplementalForFinalizer({
		supplemental: params.supplemental ?? contextSupplemental,
		contextVisibility: params.contextVisibility,
		media: params.media,
		resolveSupplementalMedia: params.resolveSupplementalMedia,
		suppressSelfQuoteBody: params.suppressSelfQuoteBody,
		suppressSelfQuoteMedia: params.suppressSelfQuoteMedia
	});
	const finish = (result) => finalizePreparedChannelInboundContext({
		originalContext: params.context,
		finalize: params.finalize,
		finalizeOptions: params.finalizeOptions,
		...result
	});
	if (params.resolveSupplementalMedia) return Promise.resolve(prepared).then(finish);
	return isPromiseLike(prepared) ? prepared.then(finish) : finish(prepared);
}
function finalizeChannelInboundContext(params) {
	return finalizeChannelInboundContextValue(params);
}
function resolveIngressCommandAuthorized(access) {
	return access?.commands?.authorized;
}
function normalizeUntrustedGroupPrompt(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeInboundTextNewlines(value);
	return normalized.trim().length > 0 ? normalized : void 0;
}
function resolveChannelStructuredContext(params) {
	const entries = [];
	const extraEntries = params.extra?.ChannelStructuredContext ?? params.extra?.UntrustedStructuredContext;
	if (Array.isArray(extraEntries)) entries.push(...extraEntries);
	const supplementalEntries = params.supplemental?.channelStructuredContext ?? params.supplemental?.untrustedContext;
	if (supplementalEntries !== void 0) entries.push(...supplementalEntries);
	const groupPrompt = normalizeUntrustedGroupPrompt(params.supplemental?.untrustedGroupSystemPrompt);
	if (groupPrompt) entries.push({
		label: "Group prompt context",
		type: "group_prompt_context",
		payload: { text: groupPrompt }
	});
	return extraEntries !== void 0 || supplementalEntries !== void 0 || groupPrompt !== void 0 ? {
		kind: "present",
		entries
	} : { kind: "absent" };
}
function resolveChannelCommandContext(params) {
	if (params.commandTurn) return params.commandTurn;
	const command = params.command;
	if (!command) return;
	const body = command.body ?? params.message.commandBody ?? params.message.rawBody;
	return createCommandTurnContext(commandTurnKindToSource(command.kind), {
		authorized: command.kind === "normal" ? false : command.authorized ?? resolveIngressCommandAuthorized(params.access) === true,
		commandName: command.name,
		body
	});
}
function buildChannelInboundEventContext(params) {
	return buildChannelInboundEventContextValue(params);
}
const buildHostChannelInboundEventContextValue = createHostChannelInboundEventContextBuilder(buildChannelInboundEventContextValue);
function buildHostChannelInboundEventContext(params) {
	return buildHostChannelInboundEventContextValue(params);
}
function buildChannelInboundEventContextValue(params) {
	const body = params.message.body ?? params.message.rawBody;
	const commandTurn = resolveChannelCommandContext({
		command: params.command,
		commandTurn: params.commandTurn,
		message: params.message,
		access: params.access
	});
	const context = {
		Body: body,
		InboundEventKind: params.message.inboundEventKind ?? "user_request",
		BodyForAgent: params.message.bodyForAgent ?? params.message.rawBody,
		InboundHistory: params.message.inboundHistory,
		SessionTranscriptContext: params.sessionTranscript && params.sessionTranscript.historyLimit > 0 ? params.sessionTranscript : void 0,
		SourceModality: params.message.sourceModality,
		RawBody: params.message.rawBody,
		CommandBody: params.message.commandBody ?? params.message.rawBody,
		BodyForCommands: params.message.commandBody ?? params.message.rawBody,
		From: params.from,
		To: params.reply.to,
		SessionKey: params.route.dispatchSessionKey ?? params.route.routeSessionKey,
		AgentId: params.route.agentId,
		DmScope: params.route.dmScope,
		AccountId: params.route.accountId ?? params.accountId,
		ParentSessionKey: params.route.parentSessionKey,
		ModelParentSessionKey: params.route.modelParentSessionKey,
		MessageSid: params.messageId,
		MessageSidFull: params.messageIdFull,
		ReplyToId: params.reply.replyToId,
		ReplyToIdFull: params.reply.replyToIdFull,
		ChatType: params.conversation.kind,
		ChatId: params.conversation.id,
		ConversationLabel: params.conversation.label,
		GroupSubject: params.conversation.kind !== "direct" ? params.conversation.label : void 0,
		GroupSpace: params.conversation.spaceId,
		SenderName: params.sender.name ?? params.sender.displayLabel,
		SenderId: params.sender.id,
		SenderUsername: params.sender.username,
		SenderTag: params.sender.tag,
		SenderIsBot: params.sender.isBot,
		MemberRoleIds: params.sender.roles,
		Timestamp: params.timestamp,
		Provider: params.provider ?? params.channel,
		Surface: params.surface ?? params.provider ?? params.channel,
		WasMentioned: params.access?.mentions?.wasMentioned,
		GroupRequireMention: params.access?.mentions?.requireMention,
		ExplicitlyMentionedBot: params.access?.mentions?.explicitlyMentionedBot,
		MentionedUserIds: params.access?.mentions?.mentionedUserIds,
		MentionedSubteamIds: params.access?.mentions?.mentionedSubteamIds,
		ImplicitMentionKinds: params.access?.mentions?.implicitMentionKinds,
		MentionSource: params.access?.mentions?.mentionSource,
		CommandAuthorized: resolveIngressCommandAuthorized(params.access) === true,
		ConversationToolPolicy: params.access?.toolPolicy,
		CommandTurn: commandTurn,
		MessageThreadId: params.reply.messageThreadId ?? params.conversation.threadId,
		NativeChannelId: params.reply.nativeChannelId ?? params.conversation.nativeChannelId,
		ChannelContext: params.channelContext,
		OriginatingChannel: params.channel,
		OriginatingTo: params.reply.originatingTo ?? params.reply.to,
		ThreadParentId: params.reply.threadParentId ?? params.conversation.parentId,
		InboundAccessAuthorized: true,
		...params.extra
	};
	const finalizeParams = {
		finalize: params.finalize,
		finalizeOptions: params.finalizeOptions,
		supplemental: params.supplemental,
		contextVisibility: params.contextVisibility,
		media: params.media,
		context
	};
	const result = params.resolveSupplementalMedia ? finalizeChannelInboundContextValue({
		...finalizeParams,
		resolveSupplementalMedia: true,
		suppressSelfQuoteBody: params.suppressSelfQuoteBody,
		suppressSelfQuoteMedia: params.suppressSelfQuoteMedia
	}) : finalizeChannelInboundContextValue(finalizeParams);
	const unwrap = (finalized) => finalized.context;
	return isPromiseLike(result) ? result.then(unwrap) : unwrap(result);
}
//#endregion
//#region src/channels/turn/run-channel-turn.ts
const DEFAULT_EVENT_CLASS = {
	kind: "message",
	canStartAgentTurn: true
};
function isAdmission(value) {
	if (!value || typeof value !== "object") return false;
	const kind = value.kind;
	return kind === "dispatch" || kind === "observeOnly" || kind === "handled" || kind === "drop";
}
function normalizePreflight(value) {
	if (!value) return {};
	if (isAdmission(value)) return { admission: value };
	return value;
}
function assertPreparedDispatchLifecycle(turn, turnAdoptionLifecycle) {
	const lifecycle = turn.runDispatchLifecycle;
	if (!lifecycle) throw new Error("runChannelInboundEvent prepared turns must declare runDispatchLifecycle when creating runDispatch");
	if (turnAdoptionLifecycle && lifecycle.turnAdoptionLifecycle !== turnAdoptionLifecycle) throw new Error("runChannelInboundEvent prepared turn runDispatchLifecycle must own the top-level turnAdoptionLifecycle");
}
function emit(params) {
	params.log?.({
		channel: params.channel,
		accountId: params.accountId,
		...params.event
	});
}
function resolveDroppedHistorySender(input, preflight) {
	return preflight.message?.senderLabel ?? preflight.message?.envelopeFrom ?? (typeof input.raw === "object" && input.raw && "sender" in input.raw && typeof input.raw.sender === "string" ? input.raw.sender : void 0) ?? "unknown";
}
function resolveDroppedHistoryBody(input, preflight) {
	return preflight.message?.bodyForAgent ?? preflight.message?.body ?? preflight.message?.rawBody ?? input.textForAgent ?? input.rawText;
}
async function recordDroppedChannelTurnHistory(params) {
	const admission = params.admission ?? params.preflight.admission;
	if (admission?.kind !== "drop") return;
	const history = params.preflight.history;
	if (!history || history.limit <= 0 || !(history.recordOnDrop || admission.recordHistory)) return;
	const body = resolveDroppedHistoryBody(params.input, params.preflight);
	const entry = body.trim().length > 0 ? {
		sender: resolveDroppedHistorySender(params.input, params.preflight),
		body,
		timestamp: params.input.timestamp,
		messageId: params.input.id
	} : null;
	const media = params.preflight.media;
	await recordChannelHistoryEntryWithMedia({
		historyMap: history.historyMap,
		historyKey: history.key,
		limit: history.limit,
		entry,
		mediaLimit: history.mediaLimit,
		messageId: params.input.id,
		shouldRecord: history.shouldRecord,
		media: typeof media === "function" ? async () => toHistoryMediaEntries(await media(), { messageId: params.input.id }) : toHistoryMediaEntries(media, { messageId: params.input.id })
	});
}
async function runChannelTurn(params) {
	emit({
		...params,
		event: {
			stage: "ingest",
			event: "start"
		}
	});
	const input = await params.adapter.ingest(params.raw);
	if (!input) {
		const admission = {
			kind: "drop",
			reason: "ingest-null"
		};
		emit({
			...params,
			event: {
				stage: "ingest",
				event: "drop",
				admission: admission.kind,
				reason: admission.reason
			}
		});
		return {
			admission,
			dispatched: false
		};
	}
	emit({
		...params,
		event: {
			stage: "ingest",
			event: "done",
			messageId: input.id
		}
	});
	const eventClass = await params.adapter.classify?.(input) ?? DEFAULT_EVENT_CLASS;
	if (!eventClass.canStartAgentTurn) {
		const admission = {
			kind: "handled",
			reason: `event:${eventClass.kind}`
		};
		emit({
			...params,
			event: {
				stage: "classify",
				event: "handled",
				messageId: input.id,
				admission: admission.kind,
				reason: admission.reason
			}
		});
		return {
			admission,
			dispatched: false
		};
	}
	const preflight = normalizePreflight(await params.adapter.preflight?.(input, eventClass));
	const preflightAdmission = preflight.admission;
	if (preflightAdmission && preflightAdmission.kind !== "dispatch" && preflightAdmission.kind !== "observeOnly") {
		await recordDroppedChannelTurnHistory({
			input,
			preflight,
			admission: preflightAdmission
		});
		emit({
			...params,
			event: {
				stage: "preflight",
				event: preflightAdmission.kind === "handled" ? "handled" : "drop",
				messageId: input.id,
				admission: preflightAdmission.kind,
				reason: preflightAdmission.reason
			}
		});
		return {
			admission: preflightAdmission,
			dispatched: false
		};
	}
	const unresolved = await params.adapter.resolveTurn(input, eventClass, preflight);
	const isRoutedTurn = "route" in unresolved && !("runDispatch" in unresolved);
	const resolved = assembleResolvedChannelTurn(unresolved);
	emit({
		...params,
		accountId: resolved.accountId ?? params.accountId,
		event: {
			stage: "assemble",
			event: "done",
			messageId: input.id,
			sessionKey: resolved.routeSessionKey,
			admission: resolved.admission?.kind ?? "dispatch"
		}
	});
	const admission = resolved.admission ?? preflightAdmission ?? { kind: "dispatch" };
	let result;
	try {
		if ("runDispatch" in resolved) assertPreparedDispatchLifecycle(resolved, params.turnAdoptionLifecycle);
		const dispatchResult = "runDispatch" in resolved ? await runPreparedChannelTurn({
			...resolved,
			admission,
			log: params.log,
			messageId: input.id
		}) : isRoutedTurn ? await dispatchRoutedChannelTurn({
			...unresolved,
			admission,
			log: params.log,
			messageId: input.id,
			...params.turnAdoptionLifecycle ? { turnAdoptionLifecycle: params.turnAdoptionLifecycle } : {}
		}) : await dispatchAssembledChannelTurn({
			...resolved,
			admission,
			log: params.log,
			messageId: input.id,
			...params.turnAdoptionLifecycle ? { turnAdoptionLifecycle: params.turnAdoptionLifecycle } : {}
		});
		result = dispatchResult.dispatched ? {
			...dispatchResult,
			admission
		} : dispatchResult;
	} catch (err) {
		const failedResult = {
			admission,
			dispatched: false,
			ctxPayload: resolved.ctxPayload,
			routeSessionKey: resolved.routeSessionKey
		};
		try {
			await params.adapter.onFinalize?.(failedResult);
		} catch {}
		emit({
			...params,
			accountId: resolved.accountId ?? params.accountId,
			event: {
				stage: "finalize",
				event: "done",
				messageId: input.id,
				sessionKey: resolved.routeSessionKey,
				admission: admission.kind
			}
		});
		throw err;
	}
	try {
		await params.adapter.onFinalize?.(result);
		emit({
			...params,
			accountId: resolved.accountId ?? params.accountId,
			event: {
				stage: "finalize",
				event: "done",
				messageId: input.id,
				sessionKey: resolved.routeSessionKey,
				admission: admission.kind
			}
		});
	} catch (err) {
		emit({
			...params,
			accountId: resolved.accountId ?? params.accountId,
			event: {
				stage: "finalize",
				event: "error",
				messageId: input.id,
				sessionKey: resolved.routeSessionKey,
				admission: admission.kind,
				error: err
			}
		});
		throw err;
	}
	return result;
}
//#endregion
export { filterChannelInboundQuoteContext as a, resolveInboundSupplementalSenderAllowed as c, formatMediaPlaceholderText as d, toHistoryMediaEntries as f, buildHostChannelInboundEventContext as i, buildChannelInboundMediaPayload as l, toInboundMediaFactsWithMetadata as m, runChannelTurn as n, filterChannelInboundSupplementalContext as o, toInboundMediaFacts as p, buildChannelInboundEventContext as r, finalizeChannelInboundContext as s, recordDroppedChannelTurnHistory as t, formatInboundMediaUnavailableText as u };
