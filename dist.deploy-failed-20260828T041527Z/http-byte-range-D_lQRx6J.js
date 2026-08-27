import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import "./fs-safe-CmrQUApq.js";
import { n as openLocalFileSafely } from "./root-impl-BbMR4leC.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as fileStore } from "./file-store-CTahCFAi.js";
import { r as withTempWorkspace } from "./private-temp-workspace-DLvP_dJe.js";
import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { d as normalizeMimeType, l as kindFromMime, r as extensionForMime } from "./mime-Hm4eS2i0.js";
import { c as runFfmpeg, n as probePlaybackMediaFileDescriptor } from "./media-services-B8MVUzbz.js";
import { h as writePlaybackTranscodeCache, n as PLAYBACK_TRANSCODE_SUBDIR, s as getMediaDir } from "./store-fXRck5jl.js";
import { t as matchesHttpIfNoneMatch } from "./http-conditional-BWrY1Un1.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/media/playback-codec-policy.ts
/** Combines selected audio/video codec facts without letting unknown facts hide incompatibility. */
function resolveNativePlaybackCodecCompatibility(kind, mimeType, probe) {
	if (kind === "audio") {
		const codec = probe.audioCodec;
		if (probe.audioStreamIndex === void 0 || !codec) return;
		if (/^audio\/(?:x-wav|wav|wave)$/.test(normalizeMimeType(mimeType) ?? "")) return codec === "pcm_s16le" || codec === "pcm_u8";
		return codec === "mp3" || normalizeMimeType(mimeType) !== "audio/mpeg" && codec === "aac";
	}
	const audioCompatible = probe.audioStreamIndex === void 0 ? probe.audioCodec ? void 0 : true : probe.audioCodec ? probe.audioCodec === "aac" || probe.audioCodec === "mp3" : void 0;
	let videoCompatible;
	if (probe.videoCodec && probe.videoStreamIndex !== void 0) {
		const portableProfile = probe.videoProfile === "baseline" || probe.videoProfile === "constrained baseline" || probe.videoProfile === "main" || probe.videoProfile === "high";
		const portablePixelFormat = probe.videoPixelFormat === "yuv420p" || probe.videoPixelFormat === "yuvj420p";
		videoCompatible = probe.videoCodec === "h264" && probe.videoProfile && probe.videoPixelFormat ? portableProfile && portablePixelFormat : probe.videoCodec === "h264" ? void 0 : false;
	}
	return audioCompatible === false || videoCompatible === false ? false : audioCompatible === true && videoCompatible === true ? true : void 0;
}
//#endregion
//#region src/media/playback-transcode.ts
/**
* Native means safe across the supported browser, AVPlayer, and ExoPlayer clients.
* Client-specific formats stay in the transcode path because metadata cannot know its consumer.
*/
const PLAYBACK_TRANSCODE_POLICY = {
	audio: {
		nativeMimeTypes: [
			"audio/m4a",
			"audio/mp3",
			"audio/mp4",
			"audio/mpeg",
			"audio/wav",
			"audio/wave",
			"audio/x-m4a",
			"audio/x-wav"
		],
		codecProbeInputFormats: {
			"audio/m4a": "mov",
			"audio/mpeg": "mp3",
			"audio/mp4": "mov",
			"audio/wav": "wav",
			"audio/wave": "wav",
			"audio/x-m4a": "mov",
			"audio/x-wav": "wav"
		},
		transcodeInputFormats: {
			"audio/aac": "aac",
			"audio/aiff": "aiff",
			"audio/amr": "amr",
			"audio/amr-wb": "amr",
			"audio/flac": "flac",
			"audio/ogg": "ogg",
			"audio/opus": "ogg",
			"audio/vorbis": "ogg",
			"audio/webm": "matroska,webm",
			"audio/x-aiff": "aiff",
			"audio/x-caf": "caf",
			"audio/x-ms-wma": "asf"
		},
		target: {
			contentType: "audio/mp4",
			extension: ".m4a"
		}
	},
	video: {
		nativeMimeTypes: ["video/mp4"],
		codecProbeInputFormats: { "video/mp4": "mov" },
		transcodeInputFormats: {
			"video/avi": "avi",
			"video/flv": "flv",
			"video/matroska": "matroska,webm",
			"video/quicktime": "mov",
			"video/webm": "matroska,webm",
			"video/x-flv": "flv",
			"video/x-matroska": "matroska,webm",
			"video/x-ms-asf": "asf",
			"video/x-ms-wmv": "asf",
			"video/x-msvideo": "avi"
		},
		target: {
			contentType: "video/mp4",
			extension: ".mp4"
		}
	}
};
const PLAYBACK_TRANSCODE_CACHE_VERSION = "v2";
const MAX_PLAYBACK_TRANSCODE_JOBS = 2;
const PLAYBACK_TRANSCODE_MAX_ALLOC_BYTES = 256 * 1024 * 1024;
const PLAYBACK_TRANSCODE_MAX_DURATION_SECS = 1200;
const PLAYBACK_TRANSCODE_MAX_INPUT_PIXELS = 4096 * 4096;
const PLAYBACK_TRANSCODE_THREADS = 2;
const PLAYBACK_TRANSCODE_FAILURE_COOLDOWN_MS = 6e4;
const MAX_PLAYBACK_ENTRIES = {
	failures: 32,
	inspections: 32,
	inspectionJobs: 2
};
const playbackJobs = /* @__PURE__ */ new Map();
const playbackFailures = /* @__PURE__ */ new Map();
const playbackInspections = /* @__PURE__ */ new Map();
const playbackInspectionJobs = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("media/playback");
/** Hashes the immutable source identity used by playback cache file names. */
function createPlaybackTranscodeCacheKey(source) {
	return createHash("sha256").update(JSON.stringify([
		source.path,
		source.size,
		source.mtimeMs,
		source.ctimeMs,
		source.dev,
		source.ino
	])).digest("hex");
}
async function readPlaybackSourceBounded(handle, expectedSize, maxBytes) {
	const maxReadBytes = Math.min(maxBytes + 1, expectedSize + 1);
	const buffer = Buffer.allocUnsafe(maxReadBytes);
	let totalBytes = 0;
	while (totalBytes < maxReadBytes) {
		const { bytesRead } = await handle.read(buffer, totalBytes, maxReadBytes - totalBytes, totalBytes);
		if (bytesRead === 0) break;
		totalBytes += bytesRead;
	}
	if (totalBytes > maxBytes || totalBytes !== expectedSize) throw new Error("Playback source changed during bounded read");
	return buffer.subarray(0, totalBytes);
}
/** Returns whether a sniffed audio/video type needs the cross-client playback target. */
function resolvePlaybackMode(mimeType, policy) {
	const mime = normalizeMimeType(mimeType);
	if (!mime) return;
	if (policy.nativeMimeTypes.includes(mime)) return "native";
	return policy.transcodeInputFormats[mime] ? "transcode" : void 0;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.playbackTranscodeTestApi")] = {
	createPlaybackTranscodeCacheKey,
	PLAYBACK_TRANSCODE_POLICY,
	readPlaybackSourceBounded,
	resolvePlaybackMode,
	getPlaybackTranscodeJobs: () => [...playbackJobs.values()]
};
function playbackSourceIdentity(params) {
	return {
		path: params.sourcePath,
		...params.sourceStat
	};
}
function playbackSourceIdentityMatches(source, opened) {
	return opened.realPath === source.path && opened.stat.size === source.size && opened.stat.mtimeMs === source.mtimeMs && opened.stat.ctimeMs === source.ctimeMs && opened.stat.dev === source.dev && opened.stat.ino === source.ino;
}
function readPlaybackInspection(cacheKey) {
	const inspection = playbackInspections.get(cacheKey);
	if (inspection) cachePlaybackInspection(cacheKey, inspection);
	return inspection;
}
function cachePlaybackInspection(cacheKey, inspection) {
	playbackInspections.delete(cacheKey);
	playbackInspections.set(cacheKey, inspection);
	pruneMapToMaxSize(playbackInspections, MAX_PLAYBACK_ENTRIES.inspections);
}
function playbackInspectionCacheKey(params) {
	return `${params.sourceCacheKey}:${params.kind}:${normalizeMimeType(params.mimeType) ?? "unknown"}`;
}
async function probePlaybackSource(source, kind) {
	const opened = await openLocalFileSafely({ filePath: source.path }).catch(() => null);
	if (!opened) return null;
	try {
		if (!playbackSourceIdentityMatches(source, opened)) return null;
		return await probePlaybackMediaFileDescriptor(opened.handle.fd, kind);
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function inspectPlaybackSource(params) {
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	const containerMode = resolvePlaybackMode(params.mimeType, policy);
	if (!containerMode) return { mode: "fallback" };
	const source = playbackSourceIdentity(params);
	const cacheKey = playbackInspectionCacheKey({
		sourceCacheKey: createPlaybackTranscodeCacheKey(source),
		kind: params.kind,
		mimeType: params.mimeType
	});
	const cached = readPlaybackInspection(cacheKey);
	if (cached) return cached;
	const computeInspection = async () => {
		const mimeType = normalizeMimeType(params.mimeType);
		const needsCodecProbe = Boolean(mimeType && policy.codecProbeInputFormats[mimeType]);
		if (containerMode === "native" && !needsCodecProbe) {
			const inspection = { mode: "native" };
			cachePlaybackInspection(cacheKey, inspection);
			return inspection;
		}
		const probe = params.probe !== void 0 ? params.probe : await probePlaybackSource(source, params.kind);
		if (containerMode === "native") {
			const nativeCodecs = probe ? resolveNativePlaybackCodecCompatibility(params.kind, params.mimeType, probe) : void 0;
			if (nativeCodecs === true) {
				const inspection = { mode: "native" };
				cachePlaybackInspection(cacheKey, inspection);
				return inspection;
			}
			if (nativeCodecs === void 0) return { mode: "native" };
		}
		if (source.size > maxBytesForKind(params.kind)) return { mode: "fallback" };
		const maxDurationMs = PLAYBACK_TRANSCODE_MAX_DURATION_SECS * 1e3;
		const primaryStreamIndex = params.kind === "audio" ? probe?.audioStreamIndex : probe?.videoStreamIndex;
		if (!probe?.durationMs || primaryStreamIndex === void 0) return { mode: "fallback" };
		const inspection = probe.durationMs <= maxDurationMs ? {
			mode: "transcode",
			durationMs: probe.durationMs,
			...probe.audioStreamIndex !== void 0 ? { audioStreamIndex: probe.audioStreamIndex } : {},
			...probe.videoStreamIndex !== void 0 ? { videoStreamIndex: probe.videoStreamIndex } : {}
		} : { mode: "fallback" };
		cachePlaybackInspection(cacheKey, inspection);
		return inspection;
	};
	if (params.probe !== void 0) return await computeInspection();
	const existingJob = playbackInspectionJobs.get(cacheKey);
	if (existingJob) return await existingJob;
	if (playbackInspectionJobs.size >= MAX_PLAYBACK_ENTRIES.inspectionJobs) return { mode: "fallback" };
	return await getOrCreatePromise(playbackInspectionJobs, cacheKey, computeInspection, { evictOnSettled: true });
}
/** Resolves source-aware playback metadata and caches codec classification by file identity. */
async function resolvePlaybackModeForSource(params) {
	if (!resolvePlaybackMode(params.mimeType, PLAYBACK_TRANSCODE_POLICY[params.kind])) return;
	const inspection = await inspectPlaybackSource(params);
	return inspection.mode === "transcode" ? "transcode" : inspection.mode === "native" ? "native" : void 0;
}
/** Replaces the original container suffix for a transcoded response filename. */
function replacePlaybackFileExtension(fileName, extension) {
	const currentExtension = path.extname(fileName);
	return `${(currentExtension ? fileName.slice(0, -currentExtension.length) : fileName) || "media"}${extension}`;
}
function playbackCacheRelativePath(cacheKey, extension) {
	return `${PLAYBACK_TRANSCODE_SUBDIR}/${PLAYBACK_TRANSCODE_CACHE_VERSION}-${cacheKey}${extension}`;
}
async function resolveCachedPlaybackPath(params) {
	const opened = await fileStore({
		rootDir: getMediaDir(),
		dirMode: 448,
		mode: 384,
		maxBytes: params.maxBytes
	}).open(playbackCacheRelativePath(params.cacheKey, params.extension)).catch(() => null);
	if (!opened?.stat.isFile()) {
		await opened?.handle.close().catch(() => {});
		return null;
	}
	try {
		return opened.realPath;
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
function makePlaybackInputFileName(sourcePath, mimeType) {
	const sourceExtension = path.extname(sourcePath).toLowerCase();
	return `input${/^\.[a-z0-9]{1,12}$/u.test(sourceExtension) ? sourceExtension : extensionForMime(mimeType) ?? ".media"}`;
}
function resolvePlaybackInputFormat(policy, mimeType) {
	const normalized = normalizeMimeType(mimeType);
	return normalized ? policy.transcodeInputFormats[normalized] ?? policy.codecProbeInputFormats[normalized] : void 0;
}
function playbackDurationsMatch(sourceDurationMs, outputDurationMs) {
	const toleranceMs = Math.min(2e3, Math.max(1e3, Math.ceil(sourceDurationMs * .02)));
	return outputDurationMs <= PLAYBACK_TRANSCODE_MAX_DURATION_SECS * 1e3 && Math.abs(outputDurationMs - sourceDurationMs) <= toleranceMs;
}
function buildPlaybackFfmpegArgs(params) {
	const common = [
		"-hide_banner",
		"-loglevel",
		"error",
		"-max_alloc",
		String(PLAYBACK_TRANSCODE_MAX_ALLOC_BYTES),
		"-filter_threads",
		String(PLAYBACK_TRANSCODE_THREADS),
		"-y",
		"-protocol_whitelist",
		"file",
		"-f",
		params.inputFormat,
		"-max_pixels",
		String(PLAYBACK_TRANSCODE_MAX_INPUT_PIXELS),
		"-threads",
		String(PLAYBACK_TRANSCODE_THREADS),
		"-i",
		params.inputPath,
		"-map_metadata",
		"-1",
		"-map_chapters",
		"-1"
	];
	if (params.kind === "audio") {
		if (params.audioStreamIndex === void 0) throw new Error("Playback audio stream is missing");
		return [
			...common,
			"-map",
			`0:${params.audioStreamIndex}`,
			"-vn",
			"-sn",
			"-dn",
			"-t",
			String(PLAYBACK_TRANSCODE_MAX_DURATION_SECS),
			"-c:a",
			"aac",
			"-b:a",
			"128k",
			"-movflags",
			"+faststart",
			"-f",
			"ipod",
			"-fs",
			String(params.maxOutputBytes + 1),
			params.outputPath
		];
	}
	if (params.videoStreamIndex === void 0) throw new Error("Playback video stream is missing");
	return [
		...common,
		"-map",
		`0:${params.videoStreamIndex}`,
		...params.audioStreamIndex === void 0 ? [] : ["-map", `0:${params.audioStreamIndex}`],
		"-sn",
		"-dn",
		"-t",
		String(PLAYBACK_TRANSCODE_MAX_DURATION_SECS),
		"-vf",
		"scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
		"-c:v",
		"libx264",
		"-threads",
		String(PLAYBACK_TRANSCODE_THREADS),
		"-pix_fmt",
		"yuv420p",
		"-c:a",
		"aac",
		"-b:a",
		"128k",
		"-movflags",
		"+faststart",
		"-f",
		"mp4",
		"-fs",
		String(params.maxOutputBytes + 1),
		params.outputPath
	];
}
async function transcodePlaybackSource(params) {
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	const opened = await openLocalFileSafely({ filePath: params.source.path });
	try {
		if (!playbackSourceIdentityMatches(params.source, opened)) throw new Error("Playback source changed before transcode");
		const sourceBuffer = await readPlaybackSourceBounded(opened.handle, params.source.size, params.maxBytes);
		const postReadStat = await opened.handle.stat();
		if (!playbackSourceIdentityMatches(params.source, {
			realPath: opened.realPath,
			stat: postReadStat
		})) throw new Error("Playback source changed during transcode read");
		await writePlaybackTranscodeCache({
			buffer: await withTempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: "playback-transcode-"
			}, async (workspace) => {
				const inputPath = await workspace.write(makePlaybackInputFileName(params.source.path, params.mimeType), sourceBuffer);
				const outputPath = workspace.path(`output${policy.target.extension}`);
				const inputFormat = resolvePlaybackInputFormat(policy, params.mimeType);
				if (!inputFormat) throw new Error("Playback transcode input format is not allowed");
				await runFfmpeg(buildPlaybackFfmpegArgs({
					...params.audioStreamIndex !== void 0 ? { audioStreamIndex: params.audioStreamIndex } : {},
					inputPath,
					inputFormat,
					kind: params.kind,
					maxOutputBytes: params.maxBytes,
					outputPath,
					...params.videoStreamIndex !== void 0 ? { videoStreamIndex: params.videoStreamIndex } : {}
				}));
				const outputStat = await fs.stat(outputPath);
				if (!outputStat.isFile() || outputStat.size === 0 || outputStat.size > params.maxBytes) throw new Error("Playback transcode output exceeds its media limit");
				const outputHandle = await fs.open(outputPath, "r");
				let outputProbe;
				try {
					outputProbe = await probePlaybackMediaFileDescriptor(outputHandle.fd, params.kind);
				} finally {
					await outputHandle.close().catch(() => {});
				}
				if (!outputProbe?.durationMs || !playbackDurationsMatch(params.sourceDurationMs, outputProbe.durationMs)) throw new Error("Playback transcode output duration does not match its source");
				return await fs.readFile(outputPath);
			}),
			fileName: path.basename(playbackCacheRelativePath(params.cacheKey, policy.target.extension)),
			maxBytes: params.maxBytes,
			tempPrefix: `.${params.cacheKey}`
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
/** Resolves a native, pending, cached, or failed playback rendition without blocking on ffmpeg. */
async function resolvePlaybackTranscode(params) {
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	if (!resolvePlaybackMode(params.mimeType, policy)) return { kind: "fallback" };
	const maxBytes = maxBytesForKind(params.kind);
	const source = playbackSourceIdentity(params);
	const cacheKey = createPlaybackTranscodeCacheKey(source);
	const target = policy.target;
	const operationKey = playbackCacheRelativePath(cacheKey, target.extension);
	const cachedPath = await resolveCachedPlaybackPath({
		cacheKey,
		extension: target.extension,
		maxBytes
	});
	if (cachedPath) return {
		kind: "transcoded",
		path: cachedPath,
		contentType: target.contentType,
		extension: target.extension
	};
	const inspection = await inspectPlaybackSource(params);
	if (inspection.mode === "native") return { kind: "passthrough" };
	if (inspection.mode === "fallback") return { kind: "fallback" };
	if (playbackJobs.has(operationKey)) return { kind: "preparing" };
	const failedAtMs = playbackFailures.get(operationKey);
	if (failedAtMs !== void 0) {
		const nowMs = Date.now();
		if (failedAtMs <= nowMs && nowMs - failedAtMs < PLAYBACK_TRANSCODE_FAILURE_COOLDOWN_MS) return { kind: "fallback" };
	}
	if (playbackJobs.size >= MAX_PLAYBACK_TRANSCODE_JOBS) return { kind: "preparing" };
	const job = transcodePlaybackSource({
		...inspection.audioStreamIndex !== void 0 ? { audioStreamIndex: inspection.audioStreamIndex } : {},
		source,
		mimeType: params.mimeType,
		kind: params.kind,
		cacheKey,
		maxBytes,
		sourceDurationMs: inspection.durationMs,
		...inspection.videoStreamIndex !== void 0 ? { videoStreamIndex: inspection.videoStreamIndex } : {}
	});
	playbackJobs.set(operationKey, job);
	job.then(() => {
		playbackJobs.delete(operationKey);
		playbackFailures.delete(operationKey);
	}, (reason) => {
		playbackJobs.delete(operationKey);
		if (!playbackFailures.has(operationKey)) log.warn(`Playback transcode failed for ${params.sourcePath}: ${formatErrorMessage(reason)}`);
		playbackFailures.delete(operationKey);
		playbackFailures.set(operationKey, Date.now());
		pruneMapToMaxSize(playbackFailures, MAX_PLAYBACK_ENTRIES.failures);
	});
	return { kind: "preparing" };
}
//#endregion
//#region src/gateway/assistant-media-content-disposition.ts
function buildAssistantMediaContentDisposition(filename, mime) {
	const sanitizedInput = truncateFilenamePreservingExtension(toWellFormedFilename(filename.replace(/[\r\n]/g, "_")), 200);
	const fallback = sanitizedInput.replace(/[^\x20-\x7e]|[%"\\]/g, "_").trim() || "download";
	const extended = encodeURIComponent(sanitizedInput).replace(/[\x27()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
	const kind = kindFromMime(mime);
	return `${kind === "image" || kind === "audio" || kind === "video" ? "inline" : "attachment"}; filename="${fallback}"; filename*=UTF-8''${extended}`;
}
function toWellFormedFilename(value) {
	let result = "";
	for (const char of value) {
		const code = char.charCodeAt(0);
		result += char.length === 1 && code >= 55296 && code <= 57343 ? "�" : char;
	}
	return result;
}
function truncateFilenamePreservingExtension(value, maxCodePoints) {
	const chars = Array.from(value);
	if (chars.length <= maxCodePoints) return value;
	const extension = shortFilenameExtension(chars);
	if (extension.length === 0 || extension.length >= maxCodePoints - 1) return chars.slice(0, maxCodePoints).join("");
	return `${chars.slice(0, maxCodePoints - extension.length).join("")}${extension.join("")}`;
}
function shortFilenameExtension(chars) {
	const lastDot = chars.lastIndexOf(".");
	if (lastDot <= 0 || lastDot === chars.length - 1) return [];
	const extension = chars.slice(lastDot);
	return extension.length <= 32 ? extension : [];
}
//#endregion
//#region src/gateway/http-byte-range.ts
const HTTP_DATE_MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const HTTP_DATE_WEEKDAYS = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
const HTTP_DATE_FULL_WEEKDAYS = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
const HTTP_DATE_PATTERNS = [
	/^(?<weekday>Sun|Mon|Tue|Wed|Thu|Fri|Sat), (?<day>\d{2}) (?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (?<year>\d{4}) (?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}) GMT$/,
	/^(?<weekday>Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), (?<day>\d{2})-(?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(?<year>\d{2}) (?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}) GMT$/,
	/^(?<weekday>Sun|Mon|Tue|Wed|Thu|Fri|Sat) (?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (?<day> \d|\d{2}) (?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}) (?<year>\d{4})$/
];
function parseConditionalHttpDate(value, nowMs) {
	const groups = HTTP_DATE_PATTERNS[0].exec(value)?.groups ?? HTTP_DATE_PATTERNS[1].exec(value)?.groups ?? HTTP_DATE_PATTERNS[2].exec(value)?.groups;
	if (!groups) return;
	const month = HTTP_DATE_MONTHS.indexOf(groups.month ?? "");
	const weekdayName = groups.weekday ?? "";
	const weekday = weekdayName.length === 3 ? HTTP_DATE_WEEKDAYS.indexOf(weekdayName) : HTTP_DATE_FULL_WEEKDAYS.indexOf(weekdayName);
	let year = Number(groups.year);
	const day = Number((groups.day ?? "").trim());
	const hours = Number(groups.hours);
	const minutes = Number(groups.minutes);
	const seconds = Number(groups.seconds);
	if (groups.year?.length === 2) {
		const now = new Date(nowMs);
		if (Number.isNaN(now.getTime())) return;
		year += Math.floor(now.getUTCFullYear() / 100) * 100;
		const fiftyYearsFromNow = Date.UTC(now.getUTCFullYear() + 50, now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
		if (Date.UTC(year, month, day, hours, minutes, Math.min(seconds, 59)) + (seconds === 60 ? 1e3 : 0) > fiftyYearsFromNow) year -= 100;
	}
	if (year < 1900 || hours > 23 || minutes > 59 || seconds > 60) return;
	const calendarSecond = Math.min(seconds, 59);
	const timestamp = Date.UTC(year, month, day, hours, minutes, calendarSecond);
	const parsed = new Date(timestamp);
	if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month || parsed.getUTCDate() !== day || parsed.getUTCHours() !== hours || parsed.getUTCMinutes() !== minutes || parsed.getUTCSeconds() !== calendarSecond || parsed.getUTCDay() !== weekday) return;
	return seconds === 60 ? timestamp + 1e3 : timestamp;
}
function createByteEtag(file) {
	return `"${createHash("sha256").update(`${file.size}:${file.mtimeMs}`).digest("base64url")}"`;
}
function parseByteRange(value, size) {
	const normalized = value.trim();
	if (normalized.includes(",")) return "invalid";
	const match = /^bytes=(\d*)-(\d*)$/i.exec(normalized);
	if (!match || !match[1] && !match[2]) return "invalid";
	const [, rangeStart = "", rangeEnd = ""] = match;
	const fileSize = BigInt(size);
	if (!rangeStart) {
		const suffixLength = BigInt(rangeEnd);
		if (suffixLength === 0n || fileSize === 0n) return "unsatisfiable";
		const start = suffixLength >= fileSize ? 0n : fileSize - suffixLength;
		return {
			start: Number(start),
			end: size - 1
		};
	}
	const start = BigInt(rangeStart);
	if (start >= fileSize) return "unsatisfiable";
	const requestedEnd = rangeEnd ? BigInt(rangeEnd) : fileSize - 1n;
	if (requestedEnd < start) return "unsatisfiable";
	const end = requestedEnd >= fileSize ? fileSize - 1n : requestedEnd;
	return {
		start: Number(start),
		end: Number(end)
	};
}
function resolveByteResponse(params) {
	const etag = createByteEtag(params.file);
	const originatedAtMs = params.nowMs ?? Date.now();
	const lastModifiedMs = Math.floor(Math.min(params.file.mtimeMs, originatedAtMs) / 1e3) * 1e3;
	const lastModified = new Date(lastModifiedMs).toUTCString();
	const headers = params.request?.headers;
	const ifNoneMatch = headers?.["if-none-match"];
	const ifModifiedSinceValues = params.request?.headersDistinct["if-modified-since"];
	const ifModifiedSince = ifModifiedSinceValues?.length === 1 ? ifModifiedSinceValues[0] : void 0;
	if ((params.method === "GET" || params.method === "HEAD") && (matchesHttpIfNoneMatch(ifNoneMatch, etag) || ifNoneMatch === void 0 && typeof ifModifiedSince === "string" && (parseConditionalHttpDate(ifModifiedSince, originatedAtMs) ?? Number.NEGATIVE_INFINITY) >= lastModifiedMs)) return {
		kind: "not-modified",
		statusCode: 304,
		etag,
		lastModified
	};
	const full = {
		kind: "full",
		statusCode: 200,
		contentLength: params.file.size,
		etag,
		lastModified
	};
	const rangeHeader = headers?.range;
	if (params.method !== "GET" || typeof rangeHeader !== "string") return full;
	const ifRangeHeader = headers?.["if-range"];
	if (ifRangeHeader !== void 0 && ifRangeHeader !== etag && ifRangeHeader !== lastModified) return full;
	const range = parseByteRange(rangeHeader, params.file.size);
	if (range === "invalid") return full;
	if (range === "unsatisfiable") return {
		kind: "unsatisfiable",
		statusCode: 416,
		contentLength: 0,
		etag,
		lastModified,
		size: params.file.size
	};
	return {
		kind: "partial",
		statusCode: 206,
		contentLength: range.end - range.start + 1,
		etag,
		lastModified,
		range,
		size: params.file.size
	};
}
function writeByteHeaders(res, plan) {
	res.statusCode = plan.statusCode;
	res.setHeader("Accept-Ranges", "bytes");
	res.setHeader("ETag", plan.etag);
	res.setHeader("Last-Modified", plan.lastModified);
	if (plan.kind === "not-modified") return;
	res.setHeader("Content-Length", String(plan.contentLength));
	if (plan.kind === "partial") res.setHeader("Content-Range", `bytes ${plan.range.start}-${plan.range.end}/${plan.size}`);
	else if (plan.kind === "unsatisfiable") res.setHeader("Content-Range", `bytes */${plan.size}`);
}
function createGatewayByteStream(res, handle, onReadError) {
	let stream;
	let closed = false;
	const close = async () => {
		if (closed) return;
		closed = true;
		if (stream) {
			stream.destroy();
			return;
		}
		await handle.close().catch(() => {});
	};
	const release = () => {
		close();
	};
	res.once("close", release);
	return {
		close,
		async pipe(plan, method) {
			if (method === "HEAD" || !("contentLength" in plan) || plan.contentLength === 0) {
				await close();
				res.end();
				return;
			}
			if (closed || res.destroyed || res.writableEnded) {
				await close();
				return;
			}
			stream = handle.createReadStream({
				start: plan.kind === "partial" ? plan.range.start : 0,
				end: plan.kind === "partial" ? plan.range.end : plan.contentLength - 1,
				autoClose: true
			});
			stream.once("end", release).once("close", release);
			stream.once("error", () => {
				release();
				if (!res.destroyed && !res.writableEnded) if (res.headersSent) res.destroy();
				else onReadError();
			});
			stream.pipe(res);
		}
	};
}
//#endregion
export { replacePlaybackFileExtension as a, buildAssistantMediaContentDisposition as i, resolveByteResponse as n, resolvePlaybackModeForSource as o, writeByteHeaders as r, resolvePlaybackTranscode as s, createGatewayByteStream as t };
