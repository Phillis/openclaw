import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./text-utility-runtime-LRU688AB.js";
import { r as matchRealtimeVoiceActivationName } from "./activation-name-BgBhI-hm.js";
import { $ as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, A as buildRealtimeVoiceSessionInstructions, F as resolveRealtimeVoiceAgentConsultTools, d as resolveConfiguredRealtimeVoiceProvider, t as createRealtimeVoiceSessionHarness, y as createRealtimeVoiceAgentTalkbackQueue, z as matchRealtimeVoiceConsultQuestions } from "./realtime-session-harness-D9vQ_tu8.js";
import { a as resolveRealtimeVoiceMinBargeInAudioEndMs, c as classifyRealtimeVoiceConsultToolCall, i as resolveRealtimeVoiceInterruptResponseOnInputAudio, l as createRealtimeVoiceTurnContextTracker, n as isRealtimeVoiceWakeNameRequired, o as resolveRealtimeVoiceSessionPolicy, r as resolveRealtimeVoiceBargeIn, s as buildRealtimeVoiceSpeakExactMessage, u as classifySkippableRealtimeVoiceConsultTranscript } from "./realtime-voice-DrHf38Dh.js";
import { l as parseRealtimeVoiceAgentControlToolArgs, r as REALTIME_VOICE_AGENT_CONTROL_TOOL, t as controlRealtimeVoiceAgentRun } from "./agent-run-control-B8WTjtAn.js";
import { S as formatVoiceLogPreview, b as formatVoiceIngressPrompt, h as createDiscordOpusEncodeStream, m as convertRealtimePcm24kMonoToDiscordPcm48kStereo, p as convertDiscordPcm48kStereoToRealtimePcm24kMono, t as loadDiscordVoiceSdk, u as logVoiceVerbose, x as maybeControlDiscordVoiceAgentRun } from "./sdk-runtime-Bf9WaNlW.js";
import { PassThrough, pipeline } from "node:stream";
//#region extensions/discord/src/voice/realtime-transcript.ts
function mergeRealtimePartialTranscript(previous, next) {
	const trimmed = next.trim();
	if (!trimmed) return previous;
	return sliceUtf16Safe(trimmed.startsWith(previous) ? trimmed : `${previous}${next}`, -240);
}
//#endregion
//#region extensions/discord/src/voice/realtime-turns.ts
const logger$3 = createSubsystemLogger("discord/voice");
const DISCORD_REALTIME_PENDING_SPEAKER_CONTEXT_LIMIT = 32;
const DISCORD_REALTIME_IGNORED_WAKE_NAME_CONTEXT_TTL_MS = 1e4;
const DISCORD_REALTIME_WAKE_NAME_FOLLOWUP_TTL_MS = 1e4;
const REALTIME_PCM16_BYTES_PER_SAMPLE$1 = 2;
const DISCORD_REALTIME_TRAILING_SILENCE_MIN_MS = 700;
const DISCORD_REALTIME_TRAILING_SILENCE_MAX_MS = 3e3;
var DiscordRealtimeTurns = class {
	constructor(params) {
		this.params = params;
		this.speakerTurns = createRealtimeVoiceTurnContextTracker({
			limit: DISCORD_REALTIME_PENDING_SPEAKER_CONTEXT_LIMIT,
			ignoredContextTtlMs: DISCORD_REALTIME_IGNORED_WAKE_NAME_CONTEXT_TTL_MS,
			deferUntilAudio: true
		});
		this.partialUserTranscript = "";
		this.wakeNameAckedForTurn = false;
	}
	beginSpeakerTurn(context, userId) {
		this.resetPartialWakeNameTracking();
		const turn = this.speakerTurns.open({
			...context,
			userId
		}, {
			inputDiscordBytes: 0,
			inputRealtimeBytes: 0,
			inputChunks: 0,
			interruptedPlayback: false
		});
		return {
			sendInputAudio: (discordPcm48kStereo) => this.sendInputAudioForTurn(turn, discordPcm48kStereo),
			close: () => {
				this.sendRealtimeTrailingSilenceForTurn(turn);
				this.logSpeakerTurnClosed(turn);
				this.speakerTurns.close(turn);
			}
		};
	}
	handlePartialUserTranscript(text) {
		if (!this.isWakeNameRequired() || this.wakeNameAckedForTurn) return;
		this.partialUserTranscript = mergeRealtimePartialTranscript(this.partialUserTranscript, text);
		const wakeNameResult = matchRealtimeVoiceActivationName(this.partialUserTranscript, this.params.wakeNames());
		if (!wakeNameResult || wakeNameResult.edge !== "leading") return;
		this.wakeNameAckedForTurn = true;
		this.params.playback.sendWakeNameAck(wakeNameResult);
	}
	async handleFinalUserTranscript(text) {
		const providerEpoch = this.params.providerEpoch();
		const trimmed = text.trim();
		if (!trimmed) return;
		this.partialUserTranscript = "";
		const transcriptsTurn = this.peekPendingSpeakerTurn();
		let transcriptAttribution = this.transcriptAttributionFromTurn(transcriptsTurn);
		const humanParticipantCount = this.params.getHumanParticipantCount();
		const requireWakeName = this.isWakeNameRequired(humanParticipantCount);
		const wakeNameResult = this.resolveWakeNameTranscript(trimmed, requireWakeName);
		let forcedSpeakerContext;
		if (!wakeNameResult.allowed) {
			const pendingWakeNameFollowup = this.consumePendingWakeNameFollowup();
			transcriptAttribution ??= pendingWakeNameFollowup;
			if (!pendingWakeNameFollowup) {
				this.recordTranscriptUtterance(trimmed, transcriptAttribution, providerEpoch);
				this.rememberIgnoredWakeNameSpeakerContext(this.consumePendingSpeakerContext());
				logger$3.info(`discord voice: realtime wake-name gate ignored transcript chars=${trimmed.length} humanParticipants=${humanParticipantCount} voiceSession=${this.params.entry.voiceSessionKey} agent=${this.params.entry.route.agentId} wakeNames=${this.params.wakeNames().join(",") || "none"}`);
				return;
			}
			forcedSpeakerContext = pendingWakeNameFollowup.context;
			logger$3.info(`discord voice: realtime wake-name follow-up accepted chars=${trimmed.length} speaker=${forcedSpeakerContext.speakerLabel} voiceSession=${this.params.entry.voiceSessionKey} agent=${this.params.entry.route.agentId}`);
		}
		this.recordTranscriptUtterance(trimmed, transcriptAttribution, providerEpoch);
		const acceptedText = wakeNameResult.allowed ? wakeNameResult.text || trimmed : trimmed;
		if (wakeNameResult.allowed && !wakeNameResult.text.trim()) {
			this.armWakeNameFollowup();
			return;
		}
		if (wakeNameResult.allowed) this.pendingWakeNameFollowup = void 0;
		await this.params.onAcceptedTranscript(acceptedText, forcedSpeakerContext, providerEpoch);
	}
	resetPartialWakeNameTracking() {
		this.partialUserTranscript = "";
		this.wakeNameAckedForTurn = false;
	}
	resetProviderContinuity() {
		this.partialUserTranscript = "";
		this.pendingWakeNameFollowup = void 0;
	}
	clear() {
		this.speakerTurns.clear();
		this.resetPartialWakeNameTracking();
		this.pendingWakeNameFollowup = void 0;
	}
	consumePendingSpeakerContext() {
		return this.speakerTurns.consumeAudioContext();
	}
	consumeRecentIgnoredWakeNameSpeakerContext() {
		return this.speakerTurns.consumeIgnoredContext();
	}
	peekPendingSpeakerTurn() {
		return this.speakerTurns.peekAudioTurn();
	}
	hasPendingSpeakerAudioContext() {
		return this.speakerTurns.hasAudioContext();
	}
	sendInputAudioForTurn(turn, discordPcm48kStereo) {
		const bridge = this.params.bridge();
		if (!bridge || this.params.stopped()) return;
		const realtimePcm = convertDiscordPcm48kStereoToRealtimePcm24kMono(discordPcm48kStereo);
		if (realtimePcm.length > 0) {
			this.registerSpeakerTurnAudioStarted(turn);
			turn.inputDiscordBytes += discordPcm48kStereo.length;
			turn.inputRealtimeBytes += realtimePcm.length;
			turn.inputChunks += 1;
			if (turn.inputChunks === 1) logger$3.info(`discord voice: realtime input audio started guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} user=${turn.context.userId} speaker=${turn.context.speakerLabel} discordBytes=${discordPcm48kStereo.length} realtimeBytes=${realtimePcm.length} outputAudioMs=${this.params.playback.outputAudioMs()} outputActive=${this.params.playback.isOutputAudioActive()}`);
			const outputActive = this.params.playback.hasInterruptibleOutputAudio();
			if (!turn.interruptedPlayback && this.params.playback.isBargeInEnabled() && outputActive) {
				turn.interruptedPlayback = true;
				logVoiceVerbose(`realtime barge-in from active speaker audio: guild ${this.params.entry.guildId} channel ${this.params.entry.channelId} user ${turn.context.userId}`);
				logger$3.info(`discord voice: realtime barge-in detected source=active-speaker-audio guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} user=${turn.context.userId} speaker=${turn.context.speakerLabel} outputAudioMs=${this.params.playback.outputAudioMs()} outputActive=${this.params.playback.isOutputAudioActive()} discordBytes=${discordPcm48kStereo.length} realtimeBytes=${realtimePcm.length}`);
				this.params.playback.handleBargeIn("active-speaker-audio");
			}
			if (this.params.recordInputAudio(realtimePcm)) bridge.sendAudio(realtimePcm);
		}
	}
	registerSpeakerTurnAudioStarted(turn) {
		if (turn.hasAudio) return;
		this.speakerTurns.markAudio(turn);
		logger$3.info(`discord voice: realtime speaker turn opened guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} user=${turn.context.userId} speaker=${turn.context.speakerLabel} owner=${turn.context.senderIsOwner} pendingTurns=${this.speakerTurns.size()}`);
	}
	logSpeakerTurnClosed(turn) {
		if (turn.closed || !turn.hasAudio) return;
		const elapsedMs = Date.now() - turn.startedAt;
		const sinceLastAudioMs = turn.lastAudioAt ? Date.now() - turn.lastAudioAt : void 0;
		logger$3.info(`discord voice: realtime speaker turn closed guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} user=${turn.context.userId} speaker=${turn.context.speakerLabel} owner=${turn.context.senderIsOwner} hasAudio=${turn.hasAudio} chunks=${turn.inputChunks} discordBytes=${turn.inputDiscordBytes} realtimeBytes=${turn.inputRealtimeBytes} elapsedMs=${elapsedMs}${sinceLastAudioMs === void 0 ? "" : ` sinceLastAudioMs=${sinceLastAudioMs}`} interruptedPlayback=${turn.interruptedPlayback}`);
	}
	sendRealtimeTrailingSilenceForTurn(turn) {
		const bridge = this.params.bridge();
		if (!bridge || this.params.stopped() || turn.closed || !turn.hasAudio) return;
		const providerId = this.params.providerId() ?? this.params.realtimeConfig()?.provider ?? "openai";
		const rawSilenceDurationMs = (this.params.realtimeConfig()?.providers?.[providerId])?.silenceDurationMs;
		const silenceMs = Math.min(DISCORD_REALTIME_TRAILING_SILENCE_MAX_MS, Math.max(DISCORD_REALTIME_TRAILING_SILENCE_MIN_MS, typeof rawSilenceDurationMs === "number" && Number.isFinite(rawSilenceDurationMs) ? rawSilenceDurationMs : 0));
		const silenceBytes = Math.ceil(24e3 * silenceMs / 1e3) * REALTIME_PCM16_BYTES_PER_SAMPLE$1;
		const silence = Buffer.alloc(silenceBytes);
		bridge.sendAudio(silence);
		logger$3.info(`discord voice: realtime trailing silence sent guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} user=${turn.context.userId} speaker=${turn.context.speakerLabel} silenceMs=${silenceMs} realtimeBytes=${silence.length}`);
	}
	resolveWakeNameTranscript(text, requireWakeName) {
		if (!requireWakeName) return {
			allowed: true,
			text,
			activationName: "",
			heardName: "",
			match: "exact",
			edge: "leading"
		};
		const wakeNameResult = matchRealtimeVoiceActivationName(text, this.params.wakeNames());
		if (wakeNameResult) {
			logger$3.info(`discord voice: realtime wake-name gate matched canonical=${wakeNameResult.activationName} heard=${wakeNameResult.heardName} match=${wakeNameResult.match} voiceSession=${this.params.entry.voiceSessionKey} agent=${this.params.entry.route.agentId}`);
			return wakeNameResult;
		}
		return {
			allowed: false,
			text
		};
	}
	isWakeNameRequired(humanParticipantCount = this.params.getHumanParticipantCount()) {
		return isRealtimeVoiceWakeNameRequired(this.params.wakeNamePolicy(), humanParticipantCount);
	}
	transcriptAttributionFromTurn(turn) {
		return turn ? {
			context: turn.context,
			startedAt: turn.startedAt
		} : void 0;
	}
	recordTranscriptUtterance(text, attribution, providerEpoch) {
		const transcripts = this.params.entry.transcripts;
		if (!transcripts || !attribution) return;
		const context = attribution.context;
		const utterance = {
			sessionId: transcripts.sessionId,
			startedAt: new Date(attribution.startedAt).toISOString(),
			final: true,
			speaker: {
				id: context.userId,
				label: context.speakerLabel
			},
			text,
			metadata: {
				channel: "discord",
				guildId: this.params.entry.guildId,
				channelId: this.params.entry.channelId,
				voiceSessionKey: this.params.entry.voiceSessionKey
			}
		};
		Promise.resolve().then(() => {
			if (providerEpoch !== this.params.providerEpoch()) return;
			return transcripts.onUtterance(utterance);
		}).catch((error) => {
			logger$3.warn(`discord voice: realtime transcripts utterance failed: ${formatErrorMessage(error)}`);
		});
	}
	armWakeNameFollowup() {
		const turn = this.peekPendingSpeakerTurn();
		const context = this.consumePendingSpeakerContext();
		if (!context) {
			logger$3.warn(`discord voice: realtime wake-name follow-up has no speaker context voiceSession=${this.params.entry.voiceSessionKey} agent=${this.params.entry.route.agentId}`);
			return;
		}
		const expiresAt = resolveExpiresAtMsFromDurationMs(DISCORD_REALTIME_WAKE_NAME_FOLLOWUP_TTL_MS);
		if (expiresAt === void 0) return;
		this.pendingWakeNameFollowup = {
			context,
			startedAt: turn?.startedAt ?? Date.now(),
			expiresAt
		};
		logger$3.info(`discord voice: realtime wake-name follow-up armed speaker=${context.speakerLabel} voiceSession=${this.params.entry.voiceSessionKey} agent=${this.params.entry.route.agentId}`);
	}
	consumePendingWakeNameFollowup() {
		const pending = this.pendingWakeNameFollowup;
		this.pendingWakeNameFollowup = void 0;
		const now = asDateTimestampMs(Date.now());
		const expiresAt = pending ? asDateTimestampMs(pending.expiresAt) : void 0;
		if (!pending || now === void 0 || expiresAt === void 0 || now > expiresAt) return;
		const currentTurn = this.peekPendingSpeakerTurn();
		if (currentTurn && currentTurn.context.userId !== pending.context.userId) return;
		if (currentTurn) this.consumePendingSpeakerContext();
		return {
			context: pending.context,
			startedAt: pending.startedAt
		};
	}
	rememberIgnoredWakeNameSpeakerContext(context) {
		this.speakerTurns.rememberIgnoredContext(context);
	}
};
function isDiscordRealtimeSpeakerContext(value) {
	return Boolean(value) && typeof value === "object" && typeof value.userId === "string" && typeof value.senderIsOwner === "boolean" && typeof value.speakerLabel === "string";
}
//#endregion
//#region extensions/discord/src/voice/realtime-consults.ts
const logger$2 = createSubsystemLogger("discord/voice");
const DISCORD_REALTIME_TALKBACK_DEBOUNCE_MS = 350;
const DISCORD_REALTIME_FALLBACK_TEXT = "I hit an error while checking that. Please try again.";
const DISCORD_REALTIME_FORCED_CONSULT_FALLBACK_DELAY_MS = 200;
const DISCORD_REALTIME_FORCED_CONSULT_REASON = "provider_final_transcript_without_openclaw_agent_consult";
var DiscordRealtimeConsults = class {
	constructor(params) {
		this.params = params;
		this.talkback = this.createTalkbackQueue();
	}
	close() {
		this.talkback.close();
		this.clearProviderConsultState();
	}
	resetProviderContinuity() {
		this.talkback.close();
		this.talkback = this.createTalkbackQueue();
		this.clearProviderConsultState();
	}
	async handleToolCall(event, session) {
		const providerEpoch = this.params.providerEpoch();
		const callId = event.callId || event.itemId || "unknown";
		if (event.name === "openclaw_agent_control") {
			await this.handleAgentControlToolCall(event, session, callId, providerEpoch);
			return;
		}
		if (event.name !== "openclaw_agent_consult") {
			await session.submitToolResult(callId, { error: `Tool "${event.name}" not available` });
			return;
		}
		if (this.params.consultToolPolicy() === "none") {
			await session.submitToolResult(callId, { error: `Tool "${event.name}" not available` });
			return;
		}
		const outcome = classifyRealtimeVoiceConsultToolCall(event.args, { retainedExactSpeechTexts: this.params.playback.retainedExactSpeechTexts() });
		switch (outcome.kind) {
			case "exact-speech-echo":
				logger$2.info(`discord voice: realtime exact speech consult bypassed call=${callId || "unknown"} answerChars=${outcome.text.length}`);
				await session.submitToolResult(callId, { text: outcome.text });
				return;
			case "malformed":
				logger$2.warn(`discord voice: realtime consult rejected malformed args call=${callId || "unknown"}: ${outcome.error}`);
				await session.submitToolResult(callId, { error: outcome.error });
				return;
			case "consult": break;
		}
		const consultMessage = outcome.message;
		logger$2.info(`discord voice: realtime consult requested call=${callId || "unknown"} voiceSession=${this.params.entry.voiceSessionKey} supervisorSession=${this.params.entry.route.sessionKey} agent=${this.params.entry.route.agentId} question=${formatVoiceLogPreview(consultMessage)}`);
		const nativeConsult = this.params.harness.forcedConsults.recordNativeConsult(event.args, callId);
		if (nativeConsult.kind === "already_delivered" && this.params.harness.forcedConsults.isCancelled(nativeConsult.handle)) {
			await this.submitTerminalRealtimeToolResult(callId, session, {
				status: "cancelled",
				message: "OpenClaw cancelled this consult before completion. Do not restart it."
			});
			return;
		}
		const pendingConsult = nativeConsult.kind === "pending" ? nativeConsult.handle : void 0;
		if (pendingConsult) this.params.harness.forcedConsults.rememberQuestion(pendingConsult, consultMessage);
		let context = pendingConsult?.context?.speaker;
		let recent = pendingConsult;
		if (!context) {
			const recentConsult = nativeConsult.kind === "in_flight" || nativeConsult.kind === "already_delivered" ? nativeConsult.handle : this.findRecentAgentProxyConsultContext(consultMessage);
			if (recentConsult) {
				const recentSpeaker = recentConsult.context?.speaker;
				if (this.params.turns.hasPendingSpeakerAudioContext()) {
					logger$2.info(`discord voice: realtime consult matched recent agent result but newer speaker audio is pending call=${callId} speaker=${recentSpeaker?.speakerLabel ?? "unknown"} owner=${recentSpeaker?.senderIsOwner ?? false}`);
					await session.submitToolResult(callId, { error: "Discord speaker context changed before this realtime consult completed" });
					return;
				}
				if (await this.submitRecentAgentProxyConsultResult(callId, recentConsult, session)) return;
			}
		}
		if (!context) {
			context = this.params.turns.consumePendingSpeakerContext();
			if (context) recent = this.rememberRecentAgentProxyConsultContext(consultMessage, context, {
				...callId === "unknown" ? {} : { id: `native-consult:${callId}` },
				started: true
			});
		}
		if (!context) {
			logger$2.warn(`discord voice: realtime consult has no speaker context call=${callId || "unknown"}`);
			await session.submitToolResult(callId, { error: "No Discord speaker context available" });
			return;
		}
		const promise = this.runAgentTurn({
			context,
			message: consultMessage
		});
		if (recent) this.setRecentAgentProxyConsultPromise(recent, promise);
		let text;
		try {
			text = await promise;
		} catch (error) {
			if (providerEpoch !== this.params.providerEpoch()) return;
			const message = formatErrorMessage(error);
			logger$2.warn(`discord voice: realtime consult failed call=${callId || "unknown"}: ${message}`);
			await session.submitToolResult(callId, { error: message });
			return;
		}
		if (providerEpoch !== this.params.providerEpoch()) return;
		logger$2.info(`discord voice: realtime consult answer (${text.length} chars) voiceSession=${this.params.entry.voiceSessionKey} supervisorSession=${this.params.entry.route.sessionKey} agent=${this.params.entry.route.agentId} speaker=${context.speakerLabel} owner=${context.senderIsOwner}: ${formatVoiceLogPreview(text)}`);
		await session.submitToolResult(callId, { text });
	}
	async handleAcceptedTranscript(acceptedText, forcedSpeakerContext, providerEpoch) {
		const pendingForcedConsult = this.params.isAgentProxy && this.params.usesRealtimeAgentHandoff() ? this.prepareForcedAgentProxyConsult(acceptedText, forcedSpeakerContext) : void 0;
		let control;
		try {
			control = await maybeControlDiscordVoiceAgentRun({
				entry: this.params.entry,
				text: acceptedText
			});
		} catch (error) {
			if (providerEpoch !== this.params.providerEpoch()) return;
			logger$2.warn(`discord voice: realtime active-run control failed; falling back to normal transcript handling: ${formatErrorMessage(error)}`);
			control = void 0;
		}
		if (providerEpoch !== this.params.providerEpoch()) return;
		if (control?.handled) {
			if (pendingForcedConsult) this.params.harness.forcedConsults.remove(pendingForcedConsult);
			this.logAgentControlResult(control.result);
			if (control.speakText) this.params.playback.speakControlResult(control.speakText);
			return;
		}
		if (!this.params.isAgentProxy) return;
		if (this.params.usesRealtimeAgentHandoff()) {
			if (pendingForcedConsult) this.schedulePreparedForcedAgentProxyConsult(pendingForcedConsult);
			return;
		}
		this.talkback.enqueue(acceptedText, forcedSpeakerContext ?? this.params.turns.consumePendingSpeakerContext());
	}
	createTalkbackQueue() {
		const providerEpoch = this.params.providerEpoch();
		return createRealtimeVoiceAgentTalkbackQueue({
			debounceMs: this.params.debounceMs() ?? DISCORD_REALTIME_TALKBACK_DEBOUNCE_MS,
			isStopped: () => this.params.stopped() || providerEpoch !== this.params.providerEpoch(),
			logger: logger$2,
			logPrefix: "[discord] realtime agent",
			responseStyle: "Brief, natural spoken answer for a Discord voice channel.",
			fallbackText: DISCORD_REALTIME_FALLBACK_TEXT,
			consult: async ({ question, responseStyle, metadata }) => {
				const context = isDiscordRealtimeSpeakerContext(metadata) ? metadata : void 0;
				return { text: await this.runAgentTurn({
					context,
					message: formatVoiceIngressPrompt([question, responseStyle ? `Spoken style: ${responseStyle}` : void 0].filter(Boolean).join("\n\n"), context?.speakerLabel ?? "Discord voice speaker")
				}) };
			},
			deliver: (text) => this.params.playback.enqueueExactSpeechMessage(text)
		});
	}
	async handleAgentControlToolCall(event, session, callId, providerEpoch) {
		let result;
		try {
			const parsed = parseRealtimeVoiceAgentControlToolArgs(event.args);
			result = await controlRealtimeVoiceAgentRun({
				sessionKey: this.params.entry.route.sessionKey,
				text: parsed.text,
				mode: parsed.mode
			});
		} catch (error) {
			if (providerEpoch !== this.params.providerEpoch()) return;
			await session.submitToolResult(callId, { error: formatErrorMessage(error) });
			return;
		}
		if (providerEpoch !== this.params.providerEpoch()) return;
		this.logAgentControlResult(result);
		await session.submitToolResult(callId, result);
	}
	async runAgentTurn(params) {
		const context = params.context;
		if (!context) return "";
		return this.params.runAgentTurn({
			context,
			message: params.message,
			toolsAllow: this.params.consultToolsAllow(),
			userId: context.userId
		});
	}
	logAgentControlResult(result) {
		logger$2.info(`discord voice: realtime active-run control handled mode=${result.mode} ok=${result.ok} active=${result.active} reason=${result.reason ?? "none"} voiceSession=${this.params.entry.voiceSessionKey} supervisorSession=${this.params.entry.route.sessionKey} agent=${this.params.entry.route.agentId}`);
	}
	prepareForcedAgentProxyConsult(transcript, speakerContext) {
		if (this.params.consultPolicy() !== "always" && this.params.wakeNamePolicy() === "never") return;
		const question = transcript.trim();
		if (!question) return;
		const skipReason = classifySkippableRealtimeVoiceConsultTranscript(question);
		if (skipReason) {
			const context = this.params.turns.consumePendingSpeakerContext();
			logger$2.info(`discord voice: realtime forced agent consult skipped reason=${skipReason} chars=${question.length} speaker=${context?.speakerLabel ?? "unknown"} transcript=${formatVoiceLogPreview(question)}`);
			return;
		}
		let context = speakerContext ?? this.params.turns.consumePendingSpeakerContext();
		if (!context) context = this.params.turns.consumeRecentIgnoredWakeNameSpeakerContext();
		if (!context) {
			const recent = this.findRecentAgentProxyConsultContext(question);
			if (recent) {
				logVoiceVerbose(`realtime forced agent consult skipped (already delegated): guild ${this.params.entry.guildId} channel ${this.params.entry.channelId} speaker ${recent.context?.speaker.userId ?? "unknown"}`);
				return;
			}
			logger$2.warn("discord voice: realtime forced agent consult has no speaker context");
			return;
		}
		return this.params.harness.forcedConsults.prepare(question, { context: {
			speaker: context,
			providerEpoch: this.params.providerEpoch()
		} });
	}
	schedulePreparedForcedAgentProxyConsult(pending) {
		this.params.harness.forcedConsults.schedule(pending, DISCORD_REALTIME_FORCED_CONSULT_FALLBACK_DELAY_MS, (handle) => void this.runForcedAgentProxyConsult(handle));
	}
	async runForcedAgentProxyConsult(pending) {
		this.params.harness.forcedConsults.markStarted(pending);
		const state = pending.context;
		if (!state) {
			this.params.harness.forcedConsults.markCancelled(pending);
			return;
		}
		const context = state.speaker;
		const { question } = pending;
		if (this.params.stopped() || state.providerEpoch !== this.params.providerEpoch()) {
			this.params.harness.forcedConsults.markCancelled(pending);
			return;
		}
		const startedAt = Date.now();
		logger$2.info(`discord voice: realtime forced agent consult starting chars=${question.length} voiceSession=${this.params.entry.voiceSessionKey} supervisorSession=${this.params.entry.route.sessionKey} agent=${this.params.entry.route.agentId} speaker=${context.speakerLabel} owner=${context.senderIsOwner}`);
		logger$2.debug(`discord voice: realtime forced agent consult reason=${DISCORD_REALTIME_FORCED_CONSULT_REASON} consultPolicy=${this.params.consultPolicy()} wakeNamePolicy=${this.params.wakeNamePolicy()} requireWakeName=${this.params.isWakeNameRequired()} voiceSession=${this.params.entry.voiceSessionKey} supervisorSession=${this.params.entry.route.sessionKey} agent=${this.params.entry.route.agentId} speaker=${context.speakerLabel}`);
		if (this.params.playback.hasInterruptibleOutputAudio()) logger$2.info(`discord voice: realtime forced agent consult preserving active playback guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} outputAudioMs=${this.params.playback.outputAudioMs()} outputActive=${this.params.playback.isOutputAudioActive()} playbackChunks=${this.params.harness.outputActivity.snapshot().chunks}`);
		state.handledByForcedPlayback = true;
		try {
			const promise = this.runAgentTurn({
				context,
				message: question
			});
			this.setRecentAgentProxyConsultPromise(pending, promise);
			const text = await promise;
			await state.providerDelivery;
			if (state.providerEpoch !== this.params.providerEpoch()) return;
			logger$2.info(`discord voice: realtime forced agent consult answer (${text.length} chars) elapsedMs=${Date.now() - startedAt} voiceSession=${this.params.entry.voiceSessionKey} supervisorSession=${this.params.entry.route.sessionKey} agent=${this.params.entry.route.agentId}: ${formatVoiceLogPreview(text)}`);
			if (text.trim() && state.handledByForcedPlayback) this.params.playback.enqueueExactSpeechMessage(text);
		} catch (error) {
			await state.providerDelivery;
			if (state.providerEpoch !== this.params.providerEpoch()) return;
			logger$2.warn(`discord voice: realtime forced agent consult failed elapsedMs=${Date.now() - startedAt}: ${formatErrorMessage(error)}`);
			if (state.handledByForcedPlayback) this.params.playback.enqueueExactSpeechMessage(DISCORD_REALTIME_FALLBACK_TEXT);
		}
	}
	rememberRecentAgentProxyConsultContext(question, context, options = {}) {
		const handle = this.params.harness.forcedConsults.prepare(question, {
			context: {
				speaker: context,
				providerEpoch: this.params.providerEpoch()
			},
			...options.id ? { id: options.id } : {}
		});
		if (!handle) throw new Error("Discord realtime consult context requires a non-empty question");
		if (options.started) this.params.harness.forcedConsults.markStarted(handle);
		return handle;
	}
	setRecentAgentProxyConsultPromise(recent, promise) {
		const state = recent.context;
		if (!state) return;
		this.params.harness.forcedConsults.markStarted(recent);
		state.promise = promise;
		promise.then((text) => {
			if (state.providerEpoch !== this.params.providerEpoch()) return;
			state.result = {
				status: "fulfilled",
				text
			};
			this.params.harness.forcedConsults.markDelivered(recent);
		}).catch((error) => {
			if (state.providerEpoch !== this.params.providerEpoch()) return;
			state.result = {
				status: "rejected",
				error: formatErrorMessage(error)
			};
			this.params.harness.forcedConsults.markDelivered(recent);
		});
	}
	findRecentAgentProxyConsultContext(consultMessage) {
		return this.params.harness.forcedConsults.findRecent(consultMessage);
	}
	async submitTerminalRealtimeToolResult(callId, session, result) {
		if (session.bridge.supportsToolResultSuppression === false) {
			await session.submitToolResult(callId, result);
			return;
		}
		await session.submitToolResult(callId, result, { suppressResponse: true });
	}
	async submitRecentAgentProxyConsultResult(callId, recent, session) {
		const state = recent.context;
		if (!state) return false;
		if (state.providerEpoch !== this.params.providerEpoch()) return true;
		const providerOwnsDelivery = Boolean(state.handledByForcedPlayback && state.promise && !state.result && session.bridge.supportsToolResultSuppression === false);
		let resolveProviderDelivery;
		if (providerOwnsDelivery) state.providerDelivery = new Promise((resolve) => {
			resolveProviderDelivery = resolve;
			state.settleProviderDelivery = resolve;
		});
		const submitAlreadyDelivered = async () => {
			if (state.providerEpoch !== this.params.providerEpoch()) return;
			await this.submitTerminalRealtimeToolResult(callId, session, {
				status: "already_delivered",
				message: "OpenClaw already delivered this answer to Discord voice. Do not repeat it."
			});
		};
		const submitResult = async (result) => {
			if (state.providerEpoch !== this.params.providerEpoch()) return;
			if (state.handledByForcedPlayback && !providerOwnsDelivery) {
				await submitAlreadyDelivered();
				return;
			}
			if (result.status === "fulfilled") {
				await session.submitToolResult(callId, { text: result.text });
				return;
			}
			await session.submitToolResult(callId, { error: result.error });
		};
		if (state.result) {
			logger$2.info(`discord voice: realtime consult reused recent agent result call=${callId || "unknown"} speaker=${state.speaker.speakerLabel} owner=${state.speaker.senderIsOwner}`);
			await submitResult(state.result);
			return true;
		}
		if (!state.promise) return false;
		logger$2.info(`discord voice: realtime consult joined in-flight agent result call=${callId || "unknown"} speaker=${state.speaker.speakerLabel} owner=${state.speaker.senderIsOwner}`);
		if (state.handledByForcedPlayback && !providerOwnsDelivery) {
			await state.promise.catch(() => void 0);
			if (state.providerEpoch !== this.params.providerEpoch()) return true;
			await submitAlreadyDelivered();
			return true;
		}
		let result;
		try {
			result = {
				status: "fulfilled",
				text: await state.promise
			};
		} catch (error) {
			result = {
				status: "rejected",
				error: formatErrorMessage(error)
			};
		}
		if (state.providerEpoch !== this.params.providerEpoch()) return true;
		try {
			await submitResult(result);
			if (providerOwnsDelivery) {
				state.handledByForcedPlayback = false;
				state.settleProviderDelivery = void 0;
				resolveProviderDelivery?.(true);
			}
		} catch (error) {
			state.settleProviderDelivery = void 0;
			resolveProviderDelivery?.(false);
			throw error;
		}
		return true;
	}
	clearProviderConsultState() {
		for (const handle of this.params.harness.forcedConsults.handles()) {
			const state = handle.context;
			if (!state) continue;
			state.handledByForcedPlayback = false;
			state.settleProviderDelivery?.(false);
			state.settleProviderDelivery = void 0;
			state.providerDelivery = void 0;
		}
		this.params.harness.forcedConsults.clear();
	}
};
//#endregion
//#region extensions/discord/src/voice/realtime-playback.ts
const logger$1 = createSubsystemLogger("discord/voice");
const DISCORD_REALTIME_CONTROL_SPEECH_DEDUPE_MS = 5e3;
const DISCORD_REALTIME_OUTPUT_PLAYBACK_WATCHDOG_MARGIN_MS = 1500;
const DISCORD_REALTIME_MAX_RETAINED_EXACT_SPEECH_MESSAGES = 32;
const DISCORD_REALTIME_MAX_RETAINED_EXACT_SPEECH_BYTES = 32 * 1024;
const DISCORD_REALTIME_CANCELLATION_RACE_DETAIL = "Cancellation failed: no active response found";
const DISCORD_REALTIME_WAKE_ACKS = [
	"Yeah.",
	"Mm-hmm.",
	"Got it.",
	"One sec."
];
const REALTIME_PCM16_BYTES_PER_SAMPLE = 2;
const DISCORD_RAW_PCM_FRAME_BYTES = 3840;
const DISCORD_REALTIME_OUTPUT_PREROLL_FRAMES = 25;
function isRealtimeResponseCancellationRace(event) {
	return event.direction === "server" && event.type === "error" && event.detail === DISCORD_REALTIME_CANCELLATION_RACE_DETAIL;
}
function normalizeControlSpeechText(text) {
	return text.toLowerCase().replace(/\s+/g, " ").trim();
}
function pcm16MonoDurationMs(audio, sampleRate) {
	if (audio.length === 0 || sampleRate <= 0) return 0;
	return audio.length / REALTIME_PCM16_BYTES_PER_SAMPLE * 1e3 / sampleRate;
}
var DiscordRealtimePlayback = class {
	constructor(params) {
		this.params = params;
		this.outputStream = null;
		this.outputPacedBuffer = Buffer.alloc(0);
		this.playbackState = { status: "idle" };
		this.queuedExactSpeechMessages = [];
		this.exactSpeechState = { status: "idle" };
		this.wakeNameAckIndex = 0;
		this.playerIdleHandler = () => {
			const hadOutputAudio = this.isOutputAudioActive();
			this.resetOutputStream("player-idle");
			if (hadOutputAudio) this.completeExactSpeechResponse("player-idle");
		};
	}
	attachPlayer() {
		const voiceSdk = loadDiscordVoiceSdk();
		this.params.entry.player.on(voiceSdk.AudioPlayerStatus.Idle, this.playerIdleHandler);
	}
	close() {
		this.playbackState = { status: "idle" };
		this.queuedExactSpeechMessages = [];
		this.exactSpeechState = { status: "idle" };
		this.clearOutputAudio("session-close");
		const voiceSdk = loadDiscordVoiceSdk();
		this.params.entry.player.off(voiceSdk.AudioPlayerStatus.Idle, this.playerIdleHandler);
	}
	handleBargeIn(reason = "barge-in") {
		if (!this.isBargeInEnabled()) {
			logger$1.info(`discord voice: realtime barge-in ignored reason=${reason} bargeIn=false guild=${this.params.entry.guildId} channel=${this.params.entry.channelId}`);
			return;
		}
		if (!this.hasInterruptibleOutputAudio()) {
			logger$1.info(`discord voice: realtime barge-in ignored reason=${reason} outputActive=false guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} playbackChunks=${this.params.harness.outputActivity.snapshot().chunks}`);
			return;
		}
		logger$1.info(`discord voice: realtime barge-in requested reason=${reason} guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} outputAudioMs=${this.outputAudioMs()} outputActive=${this.isOutputAudioActive()} playbackChunks=${this.params.harness.outputActivity.snapshot().chunks}`);
		this.params.harness.handleBargeIn({ audioPlaybackActive: true }, () => {});
	}
	isBargeInEnabled() {
		if (this.params.wakeNameRequired()) return false;
		const providerId = this.params.providerId() ?? this.params.realtimeConfig()?.provider ?? "openai";
		const realtimeConfig = this.params.realtimeConfig();
		return resolveRealtimeVoiceBargeIn({
			configuredBargeIn: realtimeConfig?.bargeIn,
			interruptResponseOnInputAudio: realtimeConfig?.providers?.[providerId]?.interruptResponseOnInputAudio
		});
	}
	hasInterruptibleOutputAudio() {
		this.params.bridge()?.setMediaTimestamp(this.outputAudioMs());
		const streamActive = Boolean(this.outputStream && !this.outputStream.destroyed);
		return this.params.harness.outputActivity.isInterruptible(streamActive);
	}
	sendOutputAudio(realtimePcm24kMono) {
		this.params.markProviderGenerationObserved();
		if (this.params.stopped() || this.playbackState.status === "backpressured") return;
		const discordPcm = convertRealtimePcm24kMonoToDiscordPcm48kStereo(realtimePcm24kMono);
		if (discordPcm.length === 0) return;
		this.params.bridge()?.setMediaTimestamp(this.outputAudioMs());
		if (this.params.harness.outputActivity.snapshot().streamEnding) {
			logVoiceVerbose(`realtime output audio ignored after stream ending: guild ${this.params.entry.guildId} channel ${this.params.entry.channelId}`);
			return;
		}
		const stream = this.ensureOutputStream();
		if (this.exactSpeechState.status === "active") this.exactSpeechState = {
			...this.exactSpeechState,
			audioStarted: true
		};
		this.params.harness.recordOutputAudio(realtimePcm24kMono, {
			audioMs: pcm16MonoDurationMs(realtimePcm24kMono, 24e3),
			sourceAudioBytes: realtimePcm24kMono.length,
			sinkAudioBytes: discordPcm.length
		});
		this.queueOutputAudio(stream, discordPcm);
	}
	clearOutputAudio(reason = "clear") {
		this.resetOutputStream(reason);
		this.params.entry.player.stop(true);
	}
	finishOutputAudioStream(reason, { playBuffered = true } = {}) {
		const stream = this.outputStream;
		if (!stream || stream.destroyed || this.params.harness.outputActivity.snapshot().streamEnding) return;
		this.params.harness.outputActivity.markStreamEnding();
		logger$1.info(`discord voice: realtime audio playback finishing reason=${reason} guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} audioMs=${this.outputAudioMs()} chunks=${this.params.harness.outputActivity.snapshot().chunks}`);
		if (playBuffered) {
			this.startOutputPlayback(stream);
			this.scheduleOutputPlaybackWatchdog(reason, stream);
		} else {
			this.resetOutputStream(reason);
			this.params.entry.player.stop(true);
			this.completeExactSpeechResponse(reason);
			return;
		}
		stream.end();
	}
	handleProviderEvent(event) {
		if (!(this.playbackState.status === "backpressured" && isRealtimeResponseCancellationRace(event))) return;
		const outputBackpressured = this.playbackState.status === "backpressured";
		if (outputBackpressured) this.playbackState = { status: "idle" };
		if (this.exactSpeechState.status === "active" && (outputBackpressured || !this.exactSpeechState.audioStarted)) this.completeExactSpeechResponse(event.type);
		this.finishOutputAudioStream(event.type, { playBuffered: false });
	}
	handleResponseDone(outcome) {
		const outputBackpressured = this.playbackState.status === "backpressured";
		if (outputBackpressured) this.playbackState = { status: "idle" };
		if (this.exactSpeechState.status === "active" && (outputBackpressured || !this.exactSpeechState.audioStarted)) this.completeExactSpeechResponse(outcome.status);
		this.finishOutputAudioStream(outcome.status, { playBuffered: outcome.status === "completed" });
	}
	enqueueExactSpeechMessage(text) {
		if (this.params.stopped() || !text.trim()) return;
		const retainedMessages = this.queuedExactSpeechMessages.length + (this.exactSpeechState.status === "active" ? 1 : 0);
		const retainedBytes = this.queuedExactSpeechMessages.reduce((total, message) => total + Buffer.byteLength(message, "utf8"), 0) + Buffer.byteLength(this.exactSpeechState.status === "active" ? this.exactSpeechState.message : "", "utf8");
		const incomingBytes = Buffer.byteLength(text, "utf8");
		if (retainedMessages >= DISCORD_REALTIME_MAX_RETAINED_EXACT_SPEECH_MESSAGES || retainedBytes + incomingBytes > DISCORD_REALTIME_MAX_RETAINED_EXACT_SPEECH_BYTES) {
			this.params.stopTerminally();
			this.queuedExactSpeechMessages = [];
			this.exactSpeechState = { status: "idle" };
			this.clearOutputAudio("exact-speech-overflow");
			this.params.onTerminalError(/* @__PURE__ */ new Error(`Discord realtime exact speech overflow: retained=${retainedMessages} retainedBytes=${retainedBytes} incomingBytes=${incomingBytes}`));
			return;
		}
		if (!this.params.bridgeReady() || this.exactSpeechState.status === "active" || this.hasInterruptibleOutputAudio()) {
			this.queuedExactSpeechMessages.push(text);
			logger$1.info(`discord voice: realtime exact speech queued guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} queued=${this.queuedExactSpeechMessages.length} outputAudioMs=${this.outputAudioMs()} outputActive=${this.isOutputAudioActive()}`);
			return;
		}
		this.sendExactSpeechMessage(text);
	}
	retainedExactSpeechTexts() {
		return [...this.exactSpeechState.status === "active" ? [this.exactSpeechState.message] : [], ...this.queuedExactSpeechMessages];
	}
	drainQueuedExactSpeechMessages(reason) {
		if (this.params.stopped() || !this.params.bridgeReady() || this.exactSpeechState.status === "active" || this.queuedExactSpeechMessages.length === 0 || this.hasInterruptibleOutputAudio()) return;
		const next = this.queuedExactSpeechMessages.shift();
		if (!next) return;
		logger$1.info(`discord voice: realtime exact speech dequeued reason=${reason} guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} queued=${this.queuedExactSpeechMessages.length}`);
		this.sendExactSpeechMessage(next);
	}
	sendWakeNameAck(result) {
		if (!result.allowed || this.params.stopped() || this.exactSpeechState.status === "active") return;
		if (this.hasInterruptibleOutputAudio()) {
			logger$1.info(`discord voice: realtime wake-name ack skipped outputActive=true voiceSession=${this.params.entry.voiceSessionKey} agent=${this.params.entry.route.agentId}`);
			return;
		}
		const ack = DISCORD_REALTIME_WAKE_ACKS[this.wakeNameAckIndex % DISCORD_REALTIME_WAKE_ACKS.length];
		this.wakeNameAckIndex += 1;
		logger$1.info(`discord voice: realtime wake-name ack canonical=${result.activationName} heard=${result.heardName} match=${result.match} voiceSession=${this.params.entry.voiceSessionKey} agent=${this.params.entry.route.agentId}`);
		this.enqueueExactSpeechMessage(ack ?? "Yeah.");
	}
	speakControlResult(text) {
		const trimmed = text.trim();
		if (this.params.stopped() || !trimmed) return;
		this.queuedExactSpeechMessages = [];
		this.completeExactSpeechResponse("active-run-control", { drain: false });
		this.params.harness.handleBargeIn({
			audioPlaybackActive: true,
			force: true
		}, () => this.clearOutputAudio("active-run-control"));
		this.lastControlSpeech = {
			normalizedText: normalizeControlSpeechText(trimmed),
			sentAt: Date.now(),
			assistantTranscriptCount: 0
		};
		this.enqueueExactSpeechMessage(trimmed);
	}
	suppressDuplicateControlSpeech(text) {
		const recent = this.lastControlSpeech;
		if (!recent) return;
		if (Date.now() - recent.sentAt > DISCORD_REALTIME_CONTROL_SPEECH_DEDUPE_MS) {
			this.lastControlSpeech = void 0;
			return;
		}
		if (normalizeControlSpeechText(text) !== recent.normalizedText) return;
		recent.assistantTranscriptCount += 1;
		if (recent.assistantTranscriptCount <= 1) return;
		logger$1.info(`discord voice: realtime duplicate active-run control speech suppressed guild=${this.params.entry.guildId} channel=${this.params.entry.channelId}`);
		this.params.harness.handleBargeIn({
			audioPlaybackActive: true,
			force: true
		}, () => this.clearOutputAudio("duplicate-active-run-control"));
	}
	resetProviderContinuity(reason) {
		this.lastControlSpeech = void 0;
		const replayExactSpeech = this.exactSpeechState.status === "active" && !this.params.harness.outputActivity.snapshot().playbackStarted ? this.exactSpeechState.message : void 0;
		this.exactSpeechState = { status: "idle" };
		if (replayExactSpeech) this.queuedExactSpeechMessages.unshift(replayExactSpeech);
		this.params.harness.flushOutput(() => this.clearOutputAudio(reason));
		this.params.harness.finishOutputAudio(reason);
	}
	outputAudioMs() {
		return Math.floor(this.params.harness.outputActivity.snapshot().audioMs);
	}
	isOutputAudioActive() {
		return this.params.harness.outputActivity.isActive(Boolean(this.outputStream && !this.outputStream.destroyed));
	}
	currentOutputStream() {
		return this.outputStream;
	}
	ensureOutputStream() {
		if (this.outputStream && !this.outputStream.destroyed && !this.outputStream.writableEnded) return this.outputStream;
		const stream = new PassThrough({ highWaterMark: DISCORD_RAW_PCM_FRAME_BYTES * 128 });
		this.outputStream = stream;
		this.playbackState = {
			status: "buffering",
			stream
		};
		this.outputPacedBuffer = Buffer.alloc(0);
		this.params.harness.outputActivity.markStreamOpened();
		stream.once("close", () => {
			if (this.params.harness.outputActivity.snapshot().playbackStarted) return;
			this.handleOutputStreamClosed(stream, "stream-close");
		});
		return stream;
	}
	handleOutputStreamClosed(stream, reason) {
		if (this.outputStream !== stream) return;
		this.logOutputAudioStopped(reason);
		this.clearOutputPlaybackWatchdog();
		this.outputStream = null;
		if (this.playbackState.status !== "backpressured") this.playbackState = { status: "idle" };
		this.outputPacedBuffer = Buffer.alloc(0);
		this.params.harness.outputActivity.reset();
		this.completeExactSpeechResponse(reason);
	}
	queueOutputAudio(stream, discordPcm) {
		if (this.playbackState.status === "playing") {
			if (!stream.write(discordPcm)) this.handleOutputBackpressure(stream);
			return;
		}
		this.outputPacedBuffer = this.outputPacedBuffer.length > 0 ? Buffer.concat([this.outputPacedBuffer, discordPcm]) : discordPcm;
		if (this.outputPacedBuffer.length >= DISCORD_RAW_PCM_FRAME_BYTES * DISCORD_REALTIME_OUTPUT_PREROLL_FRAMES) this.startOutputPlayback(stream);
	}
	handleOutputBackpressure(stream) {
		if (this.playbackState.status === "backpressured" || this.outputStream !== stream) return;
		const token = Symbol("output-backpressure");
		this.playbackState = {
			status: "backpressured",
			stream,
			token
		};
		const bufferedBytes = stream.writableLength + stream.readableLength;
		logger$1.warn(`discord voice: realtime audio playback backpressured guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} bufferedBytes=${bufferedBytes}`);
		this.clearOutputAudio("output-backpressure");
		queueMicrotask(() => {
			if (this.params.stopped() || this.playbackState.status !== "backpressured" || this.playbackState.token !== token) return;
			this.params.harness.handleBargeIn({
				audioPlaybackActive: true,
				force: true
			}, () => {});
		});
	}
	startOutputPlayback(stream) {
		if (this.params.harness.outputActivity.snapshot().playbackStarted || stream.destroyed) return;
		const voiceSdk = loadDiscordVoiceSdk();
		const opusStream = createDiscordOpusEncodeStream();
		opusStream.on("error", (err) => {
			logger$1.warn(`discord voice: realtime opus encode failed guild=${this.params.entry.guildId} channel=${this.params.entry.channelId}: ${formatErrorMessage(err)}`);
			this.resetOutputStream("opus-encode-error");
		});
		opusStream.once("close", () => this.handleOutputStreamClosed(stream, "stream-close"));
		pipeline(stream, opusStream, (err) => {
			if (!err) return;
			logger$1.warn(`discord voice: realtime output pipeline failed guild=${this.params.entry.guildId} channel=${this.params.entry.channelId}: ${formatErrorMessage(err)}`);
			this.resetOutputStream("output-pipeline-error");
		});
		if (this.outputPacedBuffer.length > 0) {
			stream.write(this.outputPacedBuffer);
			this.outputPacedBuffer = Buffer.alloc(0);
		}
		const resource = voiceSdk.createAudioResource(opusStream, { inputType: voiceSdk.StreamType.Opus });
		this.params.entry.player.play(resource);
		this.params.harness.outputActivity.markPlaybackStarted();
		this.playbackState = {
			status: "playing",
			stream
		};
		const realtimeConfig = this.params.realtimeConfig();
		logger$1.info(`discord voice: realtime audio playback started guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} mode=${this.params.mode} model=${realtimeConfig?.model ?? "provider-default"} voice=${realtimeConfig?.speakerVoice ?? realtimeConfig?.speakerVoiceId ?? "provider-default"}`);
	}
	resetOutputStream(reason = "reset") {
		const stream = this.outputStream;
		this.clearOutputPlaybackWatchdog();
		this.logOutputAudioStopped(reason);
		this.outputStream = null;
		if (this.playbackState.status !== "backpressured") this.playbackState = { status: "idle" };
		this.outputPacedBuffer = Buffer.alloc(0);
		this.params.harness.outputActivity.reset();
		stream?.end();
		stream?.destroy();
	}
	scheduleOutputPlaybackWatchdog(reason, stream) {
		this.clearOutputPlaybackWatchdog();
		const timeoutMs = this.params.harness.outputActivity.playbackWatchdogDelayMs({ marginMs: DISCORD_REALTIME_OUTPUT_PLAYBACK_WATCHDOG_MARGIN_MS });
		if (timeoutMs === void 0) return;
		this.outputPlaybackWatchdog = setTimeout(() => {
			this.outputPlaybackWatchdog = void 0;
			if (this.outputStream && this.outputStream !== stream) return;
			if (!this.outputStream && !this.isOutputAudioActive()) {
				this.completeExactSpeechResponse("playback-watchdog");
				return;
			}
			logger$1.warn(`discord voice: realtime audio playback watchdog fired reason=${reason} guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} audioMs=${this.outputAudioMs()} elapsedMs=${this.params.harness.outputActivity.elapsedPlaybackMs()}`);
			this.clearOutputAudio("playback-watchdog");
			this.completeExactSpeechResponse("playback-watchdog");
		}, timeoutMs);
	}
	clearOutputPlaybackWatchdog() {
		if (!this.outputPlaybackWatchdog) return;
		clearTimeout(this.outputPlaybackWatchdog);
		this.outputPlaybackWatchdog = void 0;
	}
	sendExactSpeechMessage(text) {
		if (this.params.stopped() || !text.trim()) return;
		this.exactSpeechState = {
			status: "active",
			message: text,
			audioStarted: false
		};
		this.params.bridge()?.sendUserMessage(this.params.buildSpeakExactMessage(text));
	}
	completeExactSpeechResponse(reason, options) {
		if (this.exactSpeechState.status === "idle" && this.queuedExactSpeechMessages.length === 0) return;
		this.exactSpeechState = { status: "idle" };
		if (options?.drain === false) return;
		this.drainQueuedExactSpeechMessages(reason);
	}
	logOutputAudioStopped(reason) {
		const activity = this.params.harness.outputActivity.snapshot();
		const audioMs = Math.floor(activity.audioMs);
		const chunks = activity.chunks;
		const discordBytes = activity.sinkAudioBytes;
		const realtimeBytes = activity.sourceAudioBytes;
		const elapsedMs = this.params.harness.outputActivity.elapsedPlaybackMs();
		if (this.outputStream || chunks > 0 || audioMs > 0) logger$1.info(`discord voice: realtime audio playback stopped reason=${reason} guild=${this.params.entry.guildId} channel=${this.params.entry.channelId} audioMs=${audioMs} elapsedMs=${elapsedMs} chunks=${chunks} discordBytes=${discordBytes} realtimeBytes=${realtimeBytes}`);
	}
};
//#endregion
//#region extensions/discord/src/voice/realtime-session.runtime.ts
const logger = createSubsystemLogger("discord/voice");
const DISCORD_REALTIME_DUPLICATE_ERROR_SUPPRESS_MS = 6e4;
const discordRealtimeTalkPayload = () => ({});
const DISCORD_REALTIME_VERBOSE_OMITTED_EVENTS = /* @__PURE__ */ new Set([
	"conversation.output_audio.delta",
	"input_audio_buffer.append",
	"response.audio.delta",
	"response.output_audio.delta"
]);
function formatRealtimeInterruptionLog(event) {
	const detail = event.detail ? ` ${event.detail}` : "";
	if (event.direction === "client") {
		if (event.type === "response.cancel") return `discord voice: realtime model interrupt requested ${event.direction}:${event.type}${detail}`;
		if (event.type === "conversation.item.truncate.skipped") return `discord voice: realtime model interrupt ignored ${event.direction}:${event.type}${detail}`;
		if (event.type === "conversation.item.truncate") return `discord voice: realtime model audio truncated ${event.direction}:${event.type}${detail}`;
	}
	if (event.direction === "server") {
		if (event.type === "response.cancelled") return `discord voice: realtime model interrupt confirmed ${event.direction}:${event.type}${detail}`;
		if (event.type === "error" && event.detail === "Cancellation failed: no active response found") return `discord voice: realtime model interrupt raced ${event.direction}:${event.type}${detail}`;
	}
}
function formatRealtimeLifecycleLog(event) {
	if (!event.type.startsWith("session.")) return;
	const detail = event.detail ? ` ${event.detail}` : "";
	return `discord voice: realtime lifecycle ${event.direction}:${event.type}${detail}`;
}
function shouldLogRealtimeVerboseEvent(event) {
	return !DISCORD_REALTIME_VERBOSE_OMITTED_EVENTS.has(event.type);
}
function readProviderConfigString(config, key) {
	const value = config[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function isDiscordAgentProxyVoiceMode(mode) {
	return mode === "agent-proxy";
}
var DiscordRealtimeVoiceSession = class {
	constructor(params) {
		this.params = params;
		this.bridge = null;
		this.lifecycle = {
			status: "inactive",
			generation: 0
		};
		this.nextLifecycleGeneration = 0;
		this.consultToolPolicy = "safe-read-only";
		this.consultPolicy = "auto";
		this.wakeNamePolicy = "never";
		this.wakeNames = [];
		this.providerGenerationObserved = false;
		this.providerContinuityEpoch = 0;
		this.harness = createRealtimeVoiceSessionHarness({
			talk: {
				sessionId: `discord:${this.params.entry.voiceSessionKey}:realtime`,
				mode: "realtime",
				transport: "gateway-relay",
				brain: "agent-consult"
			},
			talkPayloads: {
				turnStarted: discordRealtimeTalkPayload,
				turnEnded: discordRealtimeTalkPayload,
				inputAudioDelta: discordRealtimeTalkPayload,
				outputAudioStarted: discordRealtimeTalkPayload,
				outputAudioDelta: discordRealtimeTalkPayload,
				outputAudioDone: discordRealtimeTalkPayload
			},
			forcedConsults: {
				limit: 16,
				nativeDedupeMs: 15e3,
				questionsMatch: matchRealtimeVoiceConsultQuestions
			}
		});
		this.playback = new DiscordRealtimePlayback({
			bridge: () => this.bridge,
			bridgeReady: () => this.isReady(),
			buildSpeakExactMessage: (text) => buildRealtimeVoiceSpeakExactMessage({
				text,
				surfaceLabel: "the Discord voice channel"
			}),
			entry: this.params.entry,
			harness: this.harness,
			markProviderGenerationObserved: () => this.markProviderGenerationObserved(),
			mode: this.params.mode,
			onTerminalError: this.params.onTerminalError,
			providerId: () => this.realtimeProviderId,
			realtimeConfig: () => this.realtimeConfig,
			stopTerminally: () => {
				this.stopLifecycle("exact-speech overflow");
				this.consults.close();
			},
			stopped: () => this.isStopped(),
			wakeNameRequired: () => this.isWakeNameRequired()
		});
		this.turns = new DiscordRealtimeTurns({
			bridge: () => this.bridge,
			entry: this.params.entry,
			getHumanParticipantCount: () => this.humanParticipantCount(),
			onAcceptedTranscript: (text, context, providerEpoch) => this.consults.handleAcceptedTranscript(text, context, providerEpoch),
			playback: this.playback,
			providerEpoch: () => this.providerContinuityEpoch,
			providerId: () => this.realtimeProviderId,
			realtimeConfig: () => this.realtimeConfig,
			recordInputAudio: (audio) => this.harness.recordInputAudio(audio),
			stopped: () => this.isStopped(),
			wakeNamePolicy: () => this.wakeNamePolicy,
			wakeNames: () => this.wakeNames
		});
		this.consults = new DiscordRealtimeConsults({
			consultPolicy: () => this.consultPolicy,
			consultToolPolicy: () => this.consultToolPolicy,
			consultToolsAllow: () => this.consultToolsAllow,
			debounceMs: () => this.realtimeConfig?.debounceMs,
			entry: this.params.entry,
			harness: this.harness,
			isAgentProxy: isDiscordAgentProxyVoiceMode(this.params.mode),
			isWakeNameRequired: () => this.isWakeNameRequired(),
			playback: this.playback,
			providerEpoch: () => this.providerContinuityEpoch,
			runAgentTurn: this.params.runAgentTurn,
			stopped: () => this.isStopped(),
			turns: this.turns,
			usesRealtimeAgentHandoff: () => this.params.mode === "bidi" || this.consultToolPolicy !== "none",
			wakeNamePolicy: () => this.wakeNamePolicy
		});
	}
	async connect() {
		const lifecycleGeneration = ++this.nextLifecycleGeneration;
		this.lifecycle = {
			status: "starting",
			generation: lifecycleGeneration,
			instance: this
		};
		const resolved = resolveConfiguredRealtimeVoiceProvider({
			configuredProviderId: this.realtimeConfig?.provider,
			providerConfigs: buildProviderConfigs(this.realtimeConfig),
			providerConfigOverrides: buildProviderConfigOverrides(this.realtimeConfig),
			cfg: this.params.cfg,
			defaultModel: this.realtimeConfig?.model,
			noRegisteredProviderMessage: "No configured realtime voice provider registered"
		});
		this.realtimeProviderId = resolved.provider.id;
		const isAgentProxy = isDiscordAgentProxyVoiceMode(this.params.mode);
		const { toolPolicy, consultToolsAllow, consultPolicy, wakeNamePolicy, wakeNames, autoRespondToAudio } = resolveRealtimeVoiceSessionPolicy({
			isAgentProxy,
			supportsActivationNameGating: resolved.provider.capabilities?.supportsActivationNameGating === true,
			configuredToolPolicy: this.realtimeConfig?.toolPolicy,
			configuredConsultPolicy: this.realtimeConfig?.consultPolicy,
			requireWakeName: this.realtimeConfig?.requireWakeName,
			configuredWakeNames: this.realtimeConfig?.wakeNames,
			cfg: this.params.cfg,
			agentId: this.params.entry.route.agentId
		});
		this.consultToolPolicy = toolPolicy;
		this.consultToolsAllow = consultToolsAllow;
		this.consultPolicy = consultPolicy;
		this.wakeNamePolicy = wakeNamePolicy;
		this.wakeNames = wakeNames;
		const usesRealtimeAgentHandoff = this.params.mode === "bidi" || toolPolicy !== "none";
		const providerInterruptResponseOnInputAudio = this.realtimeConfig?.providers?.[resolved.provider.id]?.interruptResponseOnInputAudio;
		const interruptResponseOnInputAudio = this.wakeNamePolicy === "never" && resolveRealtimeVoiceInterruptResponseOnInputAudio(providerInterruptResponseOnInputAudio);
		const bargeIn = resolveRealtimeVoiceBargeIn({
			configuredBargeIn: this.realtimeConfig?.bargeIn,
			interruptResponseOnInputAudio: providerInterruptResponseOnInputAudio
		});
		const minBargeInAudioEndMs = resolveRealtimeVoiceMinBargeInAudioEndMs(this.realtimeConfig?.minBargeInAudioEndMs);
		const instructions = buildRealtimeVoiceSessionInstructions({
			base: this.realtimeConfig?.instructions ?? ["You are OpenClaw's Discord voice interface.", "Keep spoken replies concise, natural, and suitable for a live Discord voice channel."].join("\n"),
			isAgentProxy,
			bootstrapContextInstructions: this.params.bootstrapContextInstructions,
			toolPolicy,
			consultPolicy
		});
		this.bridge = this.harness.createBridge({
			provider: resolved.provider,
			cfg: this.params.cfg,
			providerConfig: resolved.providerConfig,
			audioFormat: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
			instructions,
			autoRespondToAudio,
			interruptResponseOnInputAudio,
			markStrategy: "ack-immediately",
			tools: usesRealtimeAgentHandoff ? resolveRealtimeVoiceAgentConsultTools(toolPolicy, toolPolicy !== "none" ? [REALTIME_VOICE_AGENT_CONTROL_TOOL] : []) : [],
			audioSink: {
				isOpen: () => !this.isStopped(),
				sendAudio: (audio) => this.playback.sendOutputAudio(audio),
				clearAudio: () => {
					this.markProviderGenerationObserved();
					this.harness.flushOutput(() => this.playback.clearOutputAudio("provider-clear-audio"));
				}
			},
			onTranscript: (role, text, isFinal) => {
				this.markProviderGenerationObserved();
				if (isFinal && text.trim()) logger.info(`discord voice: realtime ${role} transcript (${text.length} chars): ${formatVoiceLogPreview(text)}`);
				if (isFinal && role === "assistant") this.playback.suppressDuplicateControlSpeech(text);
				if (role !== "user") return;
				if (!isFinal) {
					this.turns.handlePartialUserTranscript(text);
					return;
				}
				this.turns.handleFinalUserTranscript(text);
			},
			onToolCall: (event, session) => {
				this.markProviderGenerationObserved();
				return this.consults.handleToolCall(event, session);
			},
			onReady: () => {
				this.markProviderGenerationObserved();
				if (this.markLifecycleReady(lifecycleGeneration)) this.playback.drainQueuedExactSpeechMessages("provider-ready");
			},
			onEvent: (event) => this.handleBridgeEvent(event),
			onResponseDone: (outcome) => {
				this.markProviderGenerationObserved();
				this.playback.handleResponseDone(outcome);
				if (outcome.status === "cancelled") logger.info(`discord voice: realtime model interrupt confirmed server:response.done status=cancelled${outcome.reason ? ` reason=${outcome.reason}` : ""}`);
				else if (outcome.status === "failed" || outcome.status === "incomplete") this.logRealtimeError(outcome.message);
			},
			onError: (error) => this.logRealtimeError(formatErrorMessage(error)),
			onClose: (reason) => {
				this.flushSuppressedRealtimeErrors();
				logVoiceVerbose(`realtime closed: ${reason}`);
			}
		});
		const resolvedModel = readProviderConfigString(resolved.providerConfig, "model") ?? resolved.provider.defaultModel;
		const resolvedVoice = readProviderConfigString(resolved.providerConfig, "voice");
		const humanParticipantCount = this.humanParticipantCount();
		logger.info(`discord voice: realtime bridge starting mode=${this.params.mode} provider=${resolved.provider.id} model=${resolvedModel ?? "default"} voice=${resolvedVoice ?? "default"} consultPolicy=${consultPolicy} toolPolicy=${toolPolicy} autoRespond=${autoRespondToAudio} wakeNamePolicy=${this.wakeNamePolicy} requireWakeName=${this.isWakeNameRequired(humanParticipantCount)} humanParticipants=${humanParticipantCount} wakeNames=${this.wakeNames.join(",") || "none"} interruptResponse=${interruptResponseOnInputAudio} bargeIn=${bargeIn} minBargeInAudioEndMs=${minBargeInAudioEndMs}`);
		this.playback.attachPlayer();
		await this.bridge.connect();
		if (!this.markLifecycleReady(lifecycleGeneration)) {
			this.bridge?.close();
			return;
		}
		this.markProviderGenerationObserved();
		this.playback.drainQueuedExactSpeechMessages("provider-connected");
		logger.info(`discord voice: realtime bridge ready mode=${this.params.mode} provider=${resolved.provider.id} model=${resolvedModel ?? "default"} voice=${resolvedVoice ?? "default"}`);
	}
	close() {
		this.stopLifecycle("session close");
		this.providerContinuityEpoch += 1;
		this.flushSuppressedRealtimeErrors();
		this.consults.close();
		this.harness.close();
		this.turns.clear();
		this.playback.close();
		this.bridge?.close();
		this.bridge = null;
		this.realtimeProviderId = void 0;
	}
	beginSpeakerTurn(context, userId) {
		return this.turns.beginSpeakerTurn(context, userId);
	}
	handleBargeIn(reason = "barge-in") {
		this.playback.handleBargeIn(reason);
	}
	isBargeInEnabled() {
		if (this.isWakeNameRequired()) return false;
		return this.playback.isBargeInEnabled();
	}
	get realtimeConfig() {
		return this.params.discordConfig.voice?.realtime;
	}
	isStopped() {
		return this.lifecycle.status === "stopped";
	}
	isReady() {
		return this.lifecycle.status === "active";
	}
	markLifecycleReady(generation) {
		if (this.lifecycle.status !== "starting" && this.lifecycle.status !== "active" || this.lifecycle.generation !== generation) return false;
		this.lifecycle = {
			status: "active",
			generation,
			instance: this
		};
		return true;
	}
	stopLifecycle(reason) {
		const generation = this.lifecycle.generation;
		this.lifecycle = {
			status: "stopped",
			generation,
			reason
		};
	}
	humanParticipantCount() {
		return this.params.getHumanParticipantCount?.() ?? 0;
	}
	isWakeNameRequired(humanParticipantCount = this.humanParticipantCount()) {
		return isRealtimeVoiceWakeNameRequired(this.wakeNamePolicy, humanParticipantCount);
	}
	handleBridgeEvent(event) {
		if (!(event.direction === "client" && event.type === "session.continuity.reset")) this.markProviderGenerationObserved();
		const detail = event.detail ? ` ${event.detail}` : "";
		if (event.direction === "client" && event.type === "session.continuity.reset") this.resetProviderContinuity(event.type);
		if (event.direction === "server" && event.type === "input_audio_buffer.speech_started") this.turns.resetPartialWakeNameTracking();
		if (shouldLogRealtimeVerboseEvent(event)) logVoiceVerbose(`realtime ${event.direction}:${event.type}${detail}`);
		this.playback.handleProviderEvent(event);
		const interruptionLog = formatRealtimeInterruptionLog(event);
		if (interruptionLog) logger.info(interruptionLog);
		const lifecycleLog = formatRealtimeLifecycleLog(event);
		if (lifecycleLog) logger.info(lifecycleLog);
	}
	markProviderGenerationObserved() {
		this.providerGenerationObserved = true;
	}
	resetProviderContinuity(reason) {
		if (!this.providerGenerationObserved) return;
		this.providerGenerationObserved = false;
		if (this.lifecycle.status === "active") this.lifecycle = {
			status: "starting",
			generation: this.lifecycle.generation,
			instance: this
		};
		this.providerContinuityEpoch += 1;
		this.consults.resetProviderContinuity();
		this.turns.resetProviderContinuity();
		this.playback.resetProviderContinuity(reason);
	}
	logRealtimeError(message) {
		const now = Date.now();
		if (this.lastRealtimeError?.message === message && now - this.lastRealtimeError.lastLoggedAt < DISCORD_REALTIME_DUPLICATE_ERROR_SUPPRESS_MS) {
			this.lastRealtimeError.suppressed += 1;
			return;
		}
		this.flushSuppressedRealtimeErrors();
		this.lastRealtimeError = {
			message,
			suppressed: 0,
			lastLoggedAt: now
		};
		logger.warn(`discord voice: realtime error: ${message}`);
	}
	flushSuppressedRealtimeErrors() {
		if (!this.lastRealtimeError || this.lastRealtimeError.suppressed === 0) return;
		logger.warn(`discord voice: suppressed ${this.lastRealtimeError.suppressed} duplicate realtime errors: ${this.lastRealtimeError.message}`);
		this.lastRealtimeError.suppressed = 0;
	}
};
function buildProviderConfigs(realtimeConfig) {
	const configs = realtimeConfig?.providers;
	return configs && Object.keys(configs).length > 0 ? { ...configs } : void 0;
}
function buildProviderConfigOverrides(realtimeConfig) {
	const overrides = {
		...realtimeConfig?.model ? { model: realtimeConfig.model } : {},
		...realtimeConfig?.speakerVoice ? { voice: realtimeConfig.speakerVoice } : realtimeConfig?.speakerVoiceId ? { voice: realtimeConfig.speakerVoiceId } : {},
		...typeof realtimeConfig?.minBargeInAudioEndMs === "number" ? { minBargeInAudioEndMs: realtimeConfig.minBargeInAudioEndMs } : {}
	};
	return Object.keys(overrides).length > 0 ? overrides : void 0;
}
//#endregion
export { DiscordRealtimeVoiceSession };
