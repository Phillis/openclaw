import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger, f as asSafeIntegerInRange } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { i as writeExternalFileWithinRoot } from "./fs-safe-C9N8pCh1.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { t as resolveSystemBin } from "./resolve-system-bin-ClCg60C2.js";
import { n as tempWorkspaceSync, r as withTempWorkspace } from "./private-temp-workspace-B5dYiPlo.js";
import { n as runExec, r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import "./image-ops-CuoBGLvn.js";
import path from "node:path";
import fs from "node:fs/promises";
/** Default ffprobe timeout for lightweight metadata probes. */
const MEDIA_FFPROBE_TIMEOUT_MS = 1e4;
/** Default ffmpeg timeout for bounded media conversion work. */
const MEDIA_FFMPEG_TIMEOUT_MS = 45e3;
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS = 1200;
//#endregion
//#region src/media/ffmpeg-exec.ts
function resolveExecOptions(defaultTimeoutMs, options) {
	if (options?.input !== void 0 && options.stdinFileDescriptor !== void 0) throw new Error("media exec accepts either input or stdinFileDescriptor, not both");
	return {
		input: options?.input,
		...options?.stdinFileDescriptor !== void 0 ? { stdinFileDescriptor: options.stdinFileDescriptor } : {},
		logOutput: false,
		maxBuffer: options?.maxBufferBytes ?? 10485760,
		timeoutMs: options?.timeoutMs ?? defaultTimeoutMs
	};
}
function requireSystemBin(name) {
	const resolved = resolveSystemBin(name, { trust: "standard" });
	if (!resolved) {
		const hint = process.platform === "darwin" ? "e.g. brew install ffmpeg" : "e.g. apt install ffmpeg / dnf install ffmpeg";
		throw new Error(`${name} not found in trusted system directories. Install it via your system package manager (${hint}).`);
	}
	return resolved;
}
/** Resolves ffmpeg from trusted system paths before command execution. */
function resolveFfmpegBin() {
	return requireSystemBin("ffmpeg");
}
/** Runs ffprobe with optional stdin input. */
async function runFfprobe(args, options) {
	const { stdout } = await runExec(requireSystemBin("ffprobe"), args, resolveExecOptions(MEDIA_FFPROBE_TIMEOUT_MS, options));
	return stdout;
}
/** Runs ffmpeg with bounded timeout and buffer settings. */
async function runFfmpeg(args, options) {
	const { stdout } = await runExec(resolveFfmpegBin(), args, resolveExecOptions(MEDIA_FFMPEG_TIMEOUT_MS, options));
	return stdout;
}
/** Splits ffprobe CSV-ish output into normalized lowercase fields. */
function parseFfprobeCsvFields(stdout, maxFields) {
	return stdout.trim().split(/[,\r\n]+/, maxFields).map((field) => normalizeLowercaseStringOrEmpty(field));
}
function parseFfprobeSampleRateHz(value) {
	if (!value || !/^\d+$/.test(value)) return null;
	const sampleRate = Number(value);
	return Number.isSafeInteger(sampleRate) && sampleRate > 0 ? sampleRate : null;
}
/** Parses codec and positive sample rate from compact ffprobe stream output. */
function parseFfprobeCodecAndSampleRate(stdout) {
	const [codecRaw, sampleRateRaw] = parseFfprobeCsvFields(stdout, 2);
	return {
		codec: codecRaw ? codecRaw : null,
		sampleRateHz: parseFfprobeSampleRateHz(sampleRateRaw)
	};
}
//#endregion
//#region src/media/audio-transcode.ts
const DEFAULT_OPUS_SAMPLE_RATE_HZ = 48e3;
const DEFAULT_OPUS_BITRATE = "64k";
const DEFAULT_OPUS_CHANNELS = 1;
const DEFAULT_TEMP_PREFIX = "audio-opus-";
const DEFAULT_OUTPUT_FILE_NAME = "voice.opus";
function normalizeAudioExtension(params) {
	const fromExtension = params.inputExtension?.trim();
	const normalized = (fromExtension ? fromExtension.startsWith(".") ? fromExtension : `.${fromExtension}` : path.extname(params.inputFileName ?? "")).toLowerCase();
	return /^\.[a-z0-9]{1,12}$/.test(normalized) ? normalized : ".audio";
}
function normalizeTempPrefix(value) {
	const sanitized = value?.trim().replace(/[^a-zA-Z0-9._-]/g, "-");
	if (!sanitized || sanitized === "." || sanitized === "..") return DEFAULT_TEMP_PREFIX;
	return sanitized.endsWith("-") ? sanitized : `${sanitized}-`;
}
function normalizeOutputFileName(value) {
	const baseName = basenameFromAnyPath(value?.trim() || DEFAULT_OUTPUT_FILE_NAME);
	if (/^[a-zA-Z0-9._-]{1,80}$/.test(baseName) && baseName !== "." && baseName !== "..") return baseName;
	return DEFAULT_OUTPUT_FILE_NAME;
}
function resolveMaxDurationSeconds(value) {
	if (value === void 0) return;
	if (!Number.isFinite(value) || value <= 0) throw new Error("maxDurationSeconds must be a positive finite number");
	return value;
}
/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
async function transcodeAudioBufferToOpus(params) {
	const maxDurationSeconds = resolveMaxDurationSeconds(params.maxDurationSeconds);
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: normalizeTempPrefix(params.tempPrefix)
	}, async (workspace) => {
		const inputPath = await workspace.write(`input${normalizeAudioExtension(params)}`, params.audioBuffer);
		const outputFileName = normalizeOutputFileName(params.outputFileName);
		await writeExternalFileWithinRoot({
			rootDir: workspace.dir,
			path: outputFileName,
			write: async (outputPath) => {
				await runFfmpeg([
					"-hide_banner",
					"-loglevel",
					"error",
					"-y",
					"-i",
					inputPath,
					"-vn",
					"-sn",
					"-dn",
					...maxDurationSeconds === void 0 ? [] : ["-t", String(maxDurationSeconds)],
					"-c:a",
					"libopus",
					"-b:a",
					params.bitrate ?? DEFAULT_OPUS_BITRATE,
					"-ar",
					String(params.sampleRateHz ?? DEFAULT_OPUS_SAMPLE_RATE_HZ),
					"-ac",
					String(params.channels ?? DEFAULT_OPUS_CHANNELS),
					"-f",
					"opus",
					outputPath
				], { timeoutMs: params.timeoutMs });
			}
		});
		return await workspace.read(outputFileName);
	});
}
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
async function transcodeAudioBuffer(params) {
	const source = normalizeContainerExt(params.sourceExtension);
	const target = normalizeContainerExt(params.targetExtension);
	if (!source || !target) return {
		ok: false,
		reason: "invalid-extension"
	};
	if (source === target) return {
		ok: false,
		reason: "noop-same-container"
	};
	const recipe = pickAfconvertRecipe(source, target);
	if (!recipe) return {
		ok: false,
		reason: "no-recipe"
	};
	if (process.platform !== "darwin") return {
		ok: false,
		reason: "platform-unsupported"
	};
	const tmp = tempWorkspaceSync({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "tts-transcode-"
	});
	const inPath = tmp.write(`in.${source}`, params.audioBuffer);
	const outPath = tmp.path(`out.${target}`);
	try {
		const result = await runAfconvert({
			args: [
				...recipe,
				inPath,
				outPath
			],
			timeoutMs: params.timeoutMs ?? 5e3
		});
		if (!result.ok) return {
			ok: false,
			reason: "transcoder-failed",
			detail: result.detail
		};
		return {
			ok: true,
			buffer: tmp.read(`out.${target}`)
		};
	} catch (err) {
		return {
			ok: false,
			reason: "transcoder-failed",
			detail: err.message
		};
	} finally {
		tmp.cleanup();
	}
}
function normalizeContainerExt(ext) {
	const trimmed = ext.trim().toLowerCase().replace(/^\./, "");
	return /^[a-z0-9]{1,12}$/.test(trimmed) ? trimmed : void 0;
}
function pickAfconvertRecipe(_source, target) {
	if (target === "caf") return [
		"-f",
		"caff",
		"-d",
		"opus@24000",
		"-c",
		"1"
	];
}
async function runAfconvert(params) {
	try {
		const result = await runCommandWithTimeout(["/usr/bin/afconvert", ...params.args], {
			maxOutputBytes: 1024,
			timeoutMs: params.timeoutMs
		});
		if (result.termination === "timeout") return {
			ok: false,
			detail: `timeout-${params.timeoutMs}ms`
		};
		return result.code === 0 ? { ok: true } : {
			ok: false,
			detail: `exit-${result.code ?? "unknown"}`
		};
	} catch (err) {
		return {
			ok: false,
			detail: err instanceof Error ? err.message : String(err)
		};
	}
}
//#endregion
//#region src/media/media-probe.ts
function parseDurationMs(value) {
	if (typeof value !== "number" && typeof value !== "string") return;
	const seconds = typeof value === "number" ? value : Number(value.trim());
	if (!Number.isFinite(seconds) || seconds <= 0) return;
	return asPositiveSafeInteger(Math.round(seconds * 1e3));
}
function normalizeCodecName(value) {
	if (typeof value !== "string") return;
	return value.trim().toLowerCase() || void 0;
}
function parseStreamIndex(value) {
	return asSafeIntegerInRange(value, { min: 0 });
}
function selectPlaybackStream(streams, codecType) {
	const candidates = streams.filter((stream) => {
		if (stream.codec_type !== codecType) return false;
		const disposition = asOptionalRecord(stream.disposition);
		return codecType !== "video" || disposition?.attached_pic !== 1;
	});
	return candidates.find((stream) => asOptionalRecord(stream.disposition)?.default === 1) ?? candidates[0];
}
function parseFfprobeMediaMetadata(stdout, kind) {
	let parsed;
	try {
		parsed = JSON.parse(stdout);
	} catch {
		return null;
	}
	const root = asOptionalRecord(parsed);
	if (!root) return null;
	const format = asOptionalRecord(root.format);
	const streams = (Array.isArray(root.streams) ? root.streams : []).map(asOptionalRecord).filter((stream) => Boolean(stream));
	const audioStream = selectPlaybackStream(streams, "audio");
	const videoStream = selectPlaybackStream(streams, "video");
	const selectedDurations = (kind === "video" ? [videoStream, audioStream] : [audioStream]).map((stream) => parseDurationMs(stream?.duration)).filter((duration) => duration !== void 0);
	const durationMs = (selectedDurations.length > 0 ? Math.max(...selectedDurations) : void 0) ?? parseDurationMs(format?.duration);
	const width = asPositiveSafeInteger(videoStream?.width);
	const height = asPositiveSafeInteger(videoStream?.height);
	const audioCodec = normalizeCodecName(audioStream?.codec_name);
	const videoCodec = normalizeCodecName(videoStream?.codec_name);
	const videoPixelFormat = normalizeCodecName(videoStream?.pix_fmt);
	const videoProfile = normalizeCodecName(videoStream?.profile);
	const audioStreamIndex = parseStreamIndex(audioStream?.index);
	const videoStreamIndex = parseStreamIndex(videoStream?.index);
	return {
		...durationMs ? { durationMs } : {},
		...kind === "video" && width && height ? {
			width,
			height
		} : {},
		...audioCodec ? { audioCodec } : {},
		...audioStreamIndex !== void 0 ? { audioStreamIndex } : {},
		...videoCodec ? { videoCodec } : {},
		...videoPixelFormat ? { videoPixelFormat } : {},
		...videoProfile ? { videoProfile } : {},
		...videoStreamIndex !== void 0 ? { videoStreamIndex } : {}
	};
}
function buildFfprobeMetadataArgs(protocol) {
	const isFileDescriptor = protocol === "fd";
	return [
		"-v",
		"error",
		"-protocol_whitelist",
		protocol,
		"-show_entries",
		"format=duration:stream=index,codec_type,codec_name,profile,pix_fmt,duration,width,height:stream_disposition=default,attached_pic",
		"-of",
		"json",
		...isFileDescriptor ? ["-fd", "0"] : [],
		isFileDescriptor ? "fd:" : "pipe:0"
	];
}
function isMissingFdProtocolError(error) {
	if (!error || typeof error !== "object") return false;
	const stderr = error.stderr;
	const message = typeof stderr === "string" ? stderr : error instanceof Error ? error.message : "";
	return /(?:fd:.*protocol not found|protocol not found.*fd|unrecognized option ['"]?fd|option fd not found)/is.test(message);
}
async function probeMediaSource(source, kind, options = {}) {
	const runProbe = async (protocol) => await runFfprobe(buildFfprobeMetadataArgs(protocol), source.kind === "buffer" ? {
		input: source.buffer,
		...options
	} : {
		stdinFileDescriptor: source.fd,
		...options
	});
	try {
		return parseFfprobeMediaMetadata(await runProbe(source.kind === "fileDescriptor" ? "fd" : "pipe"), kind);
	} catch (error) {
		if (source.kind === "fileDescriptor" && isMissingFdProtocolError(error)) try {
			return parseFfprobeMediaMetadata(await runProbe("pipe"), kind);
		} catch {
			return null;
		}
		return null;
	}
}
function toMediaProbeResult(result, kind) {
	if (!result) return {};
	return {
		...result.durationMs ? { durationMs: result.durationMs } : {},
		...kind === "video" && result.width && result.height ? {
			width: result.width,
			height: result.height
		} : {}
	};
}
/** Probes a local audio or video file; every failure degrades to absent fields. */
async function probeMediaFile(filePath, kind, options = {}) {
	try {
		const handle = await fs.open(filePath, "r");
		try {
			return toMediaProbeResult(await probeMediaSource({
				kind: "fileDescriptor",
				fd: handle.fd
			}, kind, options), kind);
		} finally {
			await handle.close().catch(() => {});
		}
	} catch {
		return {};
	}
}
/** Probes a bounded local-file batch under one shared wall-clock budget. */
async function probeMediaFilesWithinBudget(inputs, options) {
	const results = inputs.map(() => ({}));
	const deadlineMs = Date.now() + options.budgetMs;
	const probeCount = Math.min(inputs.length, options.maxProbes);
	for (let offset = 0; offset < probeCount; offset += options.concurrency) {
		const timeoutMs = deadlineMs - Date.now();
		if (timeoutMs <= 0) break;
		const batchEnd = Math.min(offset + options.concurrency, probeCount);
		const batch = inputs.slice(offset, batchEnd);
		const batchResults = await Promise.all(batch.map((input) => probeMediaFile(input.filePath, input.kind, { timeoutMs })));
		for (const [batchIndex, metadata] of batchResults.entries()) results[offset + batchIndex] = metadata;
	}
	return results;
}
/** Probes duration and first-stream codecs from an already validated local descriptor. */
async function probePlaybackMediaFileDescriptor(fd, kind, options = {}) {
	return await probeMediaSource({
		kind: "fileDescriptor",
		fd
	}, kind, options);
}
/** Probes a video buffer while preserving the existing public media-runtime API. */
async function probeVideoDimensions(buffer) {
	const { width, height } = await probeMediaSource({
		kind: "buffer",
		buffer
	}, "video") ?? {};
	return width && height ? {
		width,
		height
	} : void 0;
}
//#endregion
export { transcodeAudioBufferToOpus as a, runFfmpeg as c, transcodeAudioBuffer as i, runFfprobe as l, probePlaybackMediaFileDescriptor as n, parseFfprobeCodecAndSampleRate as o, probeVideoDimensions as r, resolveFfmpegBin as s, probeMediaFilesWithinBudget as t, MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS as u };
