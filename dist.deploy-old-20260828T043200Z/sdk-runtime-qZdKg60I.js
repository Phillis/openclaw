import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { t as tempWorkspace } from "./private-temp-workspace-DLvP_dJe.js";
import { i as shouldLogVerbose, r as logVerbose } from "./globals-GZNLg1ns.js";
import { s as resolveFfmpegBin } from "./media-services-B8MVUzbz.js";
import "./temp-path-wP_7naJE.js";
import "./runtime-env-_YEv0JPQ.js";
import "./ssrf-runtime-CpSMUPcn.js";
import "./media-runtime-qcekT37I.js";
import "./realtime-voice-RqIaCTAX.js";
import { d as shouldAutoControlRealtimeVoiceAgentText, t as controlRealtimeVoiceAgentRun } from "./agent-run-control-BBjiiP59.js";
import { c as resamplePcm } from "./audio-energy-BP9DXUkU.js";
import "./text-utility-runtime-BNhX-3os.js";
import { i as ChannelType } from "./v10-BDbFcnZN.js";
import "./discord-Cr3IyWY2.js";
import { l as createDecoder, t as Application, u as createEncoder } from "./dist-BtXesAa1.js";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { Transform } from "node:stream";
//#region extensions/discord/src/voice/log-preview.ts
const DISCORD_VOICE_LOG_PREVIEW_CHARS = 500;
function formatVoiceLogPreview(text) {
	const oneLine = text.replace(/\s+/g, " ").trim();
	if (oneLine.length <= DISCORD_VOICE_LOG_PREVIEW_CHARS) return oneLine;
	return `${truncateUtf16Safe(oneLine, DISCORD_VOICE_LOG_PREVIEW_CHARS)}...`;
}
//#endregion
//#region extensions/discord/src/voice/agent-control.ts
async function maybeControlDiscordVoiceAgentRun(params) {
	if (!shouldAutoControlRealtimeVoiceAgentText(params.text)) return { handled: false };
	const result = await controlRealtimeVoiceAgentRun({
		sessionKey: params.entry.route.sessionKey,
		text: params.text
	});
	if (!result.active) return {
		handled: false,
		result
	};
	return {
		handled: true,
		result,
		...result.speak && !result.suppress ? { speakText: result.message } : {}
	};
}
//#endregion
//#region extensions/discord/src/voice/prompt.ts
const DISCORD_VOICE_SPOKEN_OUTPUT_CONTRACT = [
	"You are OpenClaw's Discord voice interface in a live voice channel.",
	"Discord voice reply requirements:",
	"- Return only the concise text that should be spoken aloud in the voice channel.",
	"- Treat the transcript as speech-to-text from a live conversation; repair obvious transcription artifacts and ignore repeated partial fragments caused by voice buffering.",
	"- If the transcript is garbled, incomplete, or missing the user's intent, ask one brief clarifying question instead of guessing.",
	"- If the request needs deeper reasoning, current information, or tools, use the available tools before answering.",
	"- Do not call the tts tool; Discord voice will synthesize and play the returned text.",
	"- Do not reply with NO_REPLY unless no spoken response is appropriate.",
	"- Keep the response brief, natural, and conversational. Prefer one to three short sentences.",
	"- Avoid markdown tables, code fences, citations, and visual formatting unless the user explicitly asks for something that cannot be spoken naturally."
].join("\n");
function formatVoiceIngressPrompt(transcript, speakerLabel) {
	const cleanedTranscript = transcript.trim();
	const cleanedLabel = speakerLabel?.trim();
	const voiceInput = cleanedLabel ? [`Voice transcript from speaker "${cleanedLabel}":`, cleanedTranscript].join("\n") : cleanedTranscript;
	return [DISCORD_VOICE_SPOKEN_OUTPUT_CONTRACT, voiceInput].join("\n\n");
}
//#endregion
//#region extensions/discord/src/voice/audio.ts
const SAMPLE_RATE = 48e3;
const CHANNELS = 2;
const BIT_DEPTH = 16;
const FFMPEG_ERROR_OUTPUT_BYTES = 8192;
const DISCORD_OPUS_FRAME_SIZE = 960;
const DISCORD_OPUS_FRAME_BYTES = DISCORD_OPUS_FRAME_SIZE * CHANNELS * (BIT_DEPTH / 8);
const FFMPEG_PCM_ARGUMENTS = [
	"-analyzeduration",
	"0",
	"-loglevel",
	"error",
	"-vn",
	"-sn",
	"-dn",
	"-f",
	"s16le",
	"-ar",
	String(SAMPLE_RATE),
	"-ac",
	String(CHANNELS)
];
let warnedOpusMissing = false;
function buildWavBuffer(pcm) {
	const blockAlign = CHANNELS * BIT_DEPTH / 8;
	const byteRate = SAMPLE_RATE * blockAlign;
	const header = Buffer.alloc(44);
	header.write("RIFF", 0);
	header.writeUInt32LE(36 + pcm.length, 4);
	header.write("WAVE", 8);
	header.write("fmt ", 12);
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(CHANNELS, 22);
	header.writeUInt32LE(SAMPLE_RATE, 24);
	header.writeUInt32LE(byteRate, 28);
	header.writeUInt16LE(blockAlign, 32);
	header.writeUInt16LE(BIT_DEPTH, 34);
	header.write("data", 36);
	header.writeUInt32LE(pcm.length, 40);
	return Buffer.concat([header, pcm]);
}
function createDiscordOpusEncodeStream() {
	return new DiscordOpusEncodeStream();
}
function createDiscordOpusPlaybackStream(input) {
	const inputSource = typeof input === "string" ? input : "pipe:0";
	const ffmpeg = spawn(resolveFfmpegBin(), [
		"-i",
		inputSource,
		...FFMPEG_PCM_ARGUMENTS,
		"pipe:1"
	], {
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		],
		windowsHide: true
	});
	const opusStream = createDiscordOpusEncodeStream();
	const stderr = Buffer.alloc(FFMPEG_ERROR_OUTPUT_BYTES);
	let stderrBytes = 0;
	let ffmpegClosed = false;
	const killFfmpeg = (signal = "SIGTERM") => {
		if (!ffmpegClosed && !ffmpeg.killed) ffmpeg.kill(signal);
	};
	ffmpeg.stderr.on("data", (chunk) => {
		if (stderrBytes < FFMPEG_ERROR_OUTPUT_BYTES) stderrBytes += chunk.copy(stderr, stderrBytes, 0, FFMPEG_ERROR_OUTPUT_BYTES - stderrBytes);
	});
	ffmpeg.once("error", (err) => {
		opusStream.destroy(err);
	});
	ffmpeg.once("close", (code, signal) => {
		ffmpegClosed = true;
		if (code && code !== 0) {
			const stderrText = new StringDecoder("utf8").write(stderr.subarray(0, stderrBytes)).trim();
			const suffix = stderrText ? `: ${stderrText}` : "";
			opusStream.destroy(/* @__PURE__ */ new Error(`ffmpeg exited with code ${code}${suffix}`));
			return;
		}
		if (signal) opusStream.destroy(/* @__PURE__ */ new Error(`ffmpeg exited with signal ${signal}`));
	});
	for (const readable of [ffmpeg.stdout, ffmpeg.stderr]) readable.on("error", (err) => {
		killFfmpeg("SIGKILL");
		opusStream.destroy(err);
	});
	ffmpeg.stdin.on("error", (err) => {
		if (err.code !== "EPIPE") opusStream.destroy(err);
	});
	ffmpeg.stdout.pipe(opusStream);
	opusStream.once("close", () => {
		if (!opusStream.readableEnded) killFfmpeg();
	});
	if (typeof input !== "string") {
		input.on("error", (err) => {
			ffmpeg.stdin.destroy(err);
			opusStream.destroy(err);
		});
		input.pipe(ffmpeg.stdin);
	} else ffmpeg.stdin.end();
	return opusStream;
}
var DiscordOpusEncodeStream = class extends Transform {
	#buffer = Buffer.alloc(0);
	#encoder;
	constructor() {
		super({ readableObjectMode: true });
	}
	_construct(done) {
		createEncoder({
			application: Application.Audio,
			channels: CHANNELS,
			sampleRate: SAMPLE_RATE
		}).then((encoder) => {
			this.#encoder = encoder;
			done();
		}, (err) => done(err instanceof Error ? err : new Error(formatErrorMessage(err))));
	}
	_transform(chunk, _encoding, done) {
		try {
			this.#buffer = this.#buffer.length > 0 ? Buffer.concat([this.#buffer, chunk]) : Buffer.from(chunk);
			while (this.#buffer.length >= DISCORD_OPUS_FRAME_BYTES) {
				const frame = this.#buffer.subarray(0, DISCORD_OPUS_FRAME_BYTES);
				this.#buffer = this.#buffer.subarray(DISCORD_OPUS_FRAME_BYTES);
				this.#encodeFrame(frame);
			}
			done();
		} catch (err) {
			done(err instanceof Error ? err : new Error(formatErrorMessage(err)));
		}
	}
	_flush(done) {
		try {
			if (this.#buffer.length > 0) {
				const frame = Buffer.alloc(DISCORD_OPUS_FRAME_BYTES);
				this.#buffer.copy(frame);
				this.#buffer = Buffer.alloc(0);
				this.#encodeFrame(frame);
			}
			done();
		} catch (err) {
			done(err instanceof Error ? err : new Error(formatErrorMessage(err)));
		}
	}
	_destroy(err, done) {
		this.#encoder?.free();
		this.#buffer = Buffer.alloc(0);
		done(err);
	}
	#encodeFrame(frame) {
		this.push(Buffer.from(this.#encoder.encode(frame, { frameSize: DISCORD_OPUS_FRAME_SIZE })));
	}
};
function pcmInt16ToBuffer(pcm) {
	return Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength);
}
async function decodeOpusStream(stream, params) {
	const chunks = [];
	await decodeOpusStreamChunks(stream, {
		...params,
		onChunk: (chunk) => chunks.push(chunk)
	});
	return Buffer.concat(chunks);
}
async function decodeOpusStreamChunks(stream, params) {
	let decoder;
	try {
		decoder = await createDecoder({
			channels: CHANNELS,
			sampleRate: SAMPLE_RATE
		});
	} catch (err) {
		if (!warnedOpusMissing) {
			warnedOpusMissing = true;
			params.onWarn(`discord voice: no usable opus decoder available (libopus-wasm: ${formatErrorMessage(err)}); cannot decode voice audio`);
		}
		return;
	}
	params.onVerbose("opus decoder: libopus-wasm");
	try {
		for await (const chunk of stream) {
			if (!chunk || !(chunk instanceof Buffer) || chunk.length === 0) continue;
			const decoded = decoder.decode(chunk, { maxFrameSize: DISCORD_OPUS_FRAME_SIZE });
			if (decoded.length > 0) params.onChunk(pcmInt16ToBuffer(decoded));
		}
	} catch (err) {
		params.onError?.(err);
		if (shouldLogVerbose()) logVerbose(`discord voice: opus decode failed: ${formatErrorMessage(err)}`);
	} finally {
		decoder.free();
	}
}
function convertDiscordPcm48kStereoToRealtimePcm24kMono(pcm) {
	const frameCount = Math.floor(pcm.length / 4);
	if (frameCount === 0) return Buffer.alloc(0);
	const mono48k = Buffer.alloc(frameCount * 2);
	for (let frame = 0; frame < frameCount; frame += 1) {
		const offset = frame * 4;
		const left = pcm.readInt16LE(offset);
		const right = pcm.readInt16LE(offset + 2);
		mono48k.writeInt16LE(Math.round((left + right) / 2), frame * 2);
	}
	return resamplePcm(mono48k, SAMPLE_RATE, 24e3);
}
function convertRealtimePcm24kMonoToDiscordPcm48kStereo(pcm) {
	const mono48k = resamplePcm(pcm, 24e3, SAMPLE_RATE);
	const sampleCount = Math.floor(mono48k.length / 2);
	if (sampleCount === 0) return Buffer.alloc(0);
	const stereo = Buffer.alloc(sampleCount * 4);
	for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
		const sample = mono48k.readInt16LE(sampleIndex * 2);
		const offset = sampleIndex * 4;
		stereo.writeInt16LE(sample, offset);
		stereo.writeInt16LE(sample, offset + 2);
	}
	return stereo;
}
function estimateDurationSeconds(pcm) {
	const bytesPerSample = BIT_DEPTH / 8 * CHANNELS;
	return pcm.length / (bytesPerSample * SAMPLE_RATE);
}
async function writeVoiceWavFile(pcm) {
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "discord-voice-"
	});
	scheduleTempCleanup(workspace.dir);
	const wav = buildWavBuffer(pcm);
	return {
		path: await workspace.write("segment.wav", wav),
		durationSeconds: estimateDurationSeconds(pcm)
	};
}
function scheduleTempCleanup(tempDir, delayMs = 1800 * 1e3) {
	setTimeout(() => {
		fs.rm(tempDir, {
			recursive: true,
			force: true
		}).catch((err) => {
			if (shouldLogVerbose()) logVerbose(`discord voice: temp cleanup failed for ${tempDir}: ${formatErrorMessage(err)}`);
		});
	}, delayMs).unref();
}
//#endregion
//#region extensions/discord/src/voice/session.ts
const MIN_SEGMENT_SECONDS = .35;
const CAPTURE_FINALIZE_GRACE_MS = 2e3;
const VOICE_CONNECT_READY_TIMEOUT_MS = 3e4;
const VOICE_RECONNECT_GRACE_MS = 15e3;
const PLAYBACK_READY_TIMEOUT_MS = 6e4;
function resolveVoiceTimeoutMs(value, fallbackMs) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallbackMs;
	return Math.floor(value);
}
function resolveDiscordVoiceMode(voice) {
	const mode = voice?.mode;
	if (mode === "stt-tts" || mode === "bidi") return mode;
	return "agent-proxy";
}
function isDiscordRealtimeVoiceMode(mode) {
	return mode === "agent-proxy" || mode === "bidi";
}
function logVoiceVerbose(message) {
	logVerbose(`discord voice: ${message}`);
}
function isVoiceChannel(type) {
	return type === ChannelType.GuildVoice || type === ChannelType.GuildStageVoice;
}
//#endregion
//#region extensions/discord/src/voice/sdk-runtime.ts
let cachedDiscordVoiceSdk = null;
function loadDiscordVoiceSdk() {
	if (cachedDiscordVoiceSdk) return cachedDiscordVoiceSdk;
	cachedDiscordVoiceSdk = createRequire(import.meta.url)("@discordjs/voice");
	return cachedDiscordVoiceSdk;
}
//#endregion
export { decodeOpusStreamChunks as _, VOICE_CONNECT_READY_TIMEOUT_MS as a, maybeControlDiscordVoiceAgentRun as b, isVoiceChannel as c, resolveVoiceTimeoutMs as d, convertDiscordPcm48kStereoToRealtimePcm24kMono as f, decodeOpusStream as g, createDiscordOpusPlaybackStream as h, PLAYBACK_READY_TIMEOUT_MS as i, logVoiceVerbose as l, createDiscordOpusEncodeStream as m, CAPTURE_FINALIZE_GRACE_MS as n, VOICE_RECONNECT_GRACE_MS as o, convertRealtimePcm24kMonoToDiscordPcm48kStereo as p, MIN_SEGMENT_SECONDS as r, isDiscordRealtimeVoiceMode as s, loadDiscordVoiceSdk as t, resolveDiscordVoiceMode as u, writeVoiceWavFile as v, formatVoiceLogPreview as x, formatVoiceIngressPrompt as y };
