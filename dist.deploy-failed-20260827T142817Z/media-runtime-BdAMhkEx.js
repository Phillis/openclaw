import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import "./http-body-D5I0NwSl.js";
import "./mime-Hm4eS2i0.js";
import "./media-services-BMidrwE0.js";
import "./store-BNwuZ4Nd.js";
import "./fetch-CLYC5ZpH.js";
import { _ as sendTextMediaPayload } from "./reply-payload-DBNGwex4.js";
import "./local-roots-Beya70q2.js";
import "./outbound-attachment-rkasfRLe.js";
import { a as chunkText } from "./chunk-DbIKi2Y2.js";
import "./defaults-BM9x5Lhb.js";
import "./image-runtime-CYuu4eVp.js";
import "./runner-CF500_01.js";
import "./audio-Dm6sjmv5.js";
import "./qr-image-BU2pvgPz.js";
import "./qr-terminal-27AasTys.js";
import { t as sanitizeForPlainText } from "./sanitize-text-DMcfOVvX.js";
import "./agent-media-payload-Dw1RWSxy.js";
import "./audio-preflight-BpV9MN1w.js";
import fs from "node:fs/promises";
import { deflateSync } from "node:zlib";
//#region src/media/png-encode.ts
const CRC_TABLE = (() => {
	const table = /* @__PURE__ */ new Uint32Array(256);
	for (let i = 0; i < 256; i += 1) {
		let c = i;
		for (let k = 0; k < 8; k += 1) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
		table[i] = c >>> 0;
	}
	return table;
})();
/** Compute CRC32 checksum for a buffer (used in PNG chunk encoding). */
function crc32(buf) {
	let crc = 4294967295;
	for (const byte of buf) crc = expectDefined(CRC_TABLE[(crc ^ byte) & 255], "crc table entry at (crc ^ byte) & 0xff") ^ crc >>> 8;
	return (crc ^ 4294967295) >>> 0;
}
/** Create a PNG chunk with type, data, and CRC. */
function pngChunk(type, data) {
	const typeBuf = Buffer.from(type, "ascii");
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length, 0);
	const crc = crc32(Buffer.concat([typeBuf, data]));
	const crcBuf = Buffer.alloc(4);
	crcBuf.writeUInt32BE(crc, 0);
	return Buffer.concat([
		len,
		typeBuf,
		data,
		crcBuf
	]);
}
/**
* Writes one RGBA pixel into a width-strided buffer.
* Out-of-bounds coordinates are ignored so fixture drawing code can clip shapes cheaply.
*/
function fillPixel(buf, x, y, width, r, g, b, a = 255) {
	if (x < 0 || y < 0 || x >= width) return;
	const idx = (y * width + x) * 4;
	if (idx < 0 || idx + 3 >= buf.length) return;
	buf[idx] = r;
	buf[idx + 1] = g;
	buf[idx + 2] = b;
	buf[idx + 3] = a;
}
function encodePng(buffer, width, height, channels) {
	const stride = width * channels;
	const raw = Buffer.alloc((stride + 1) * height);
	for (let row = 0; row < height; row += 1) {
		const rawOffset = row * (stride + 1);
		raw[rawOffset] = 0;
		buffer.copy(raw, rawOffset + 1, row * stride, row * stride + stride);
	}
	const compressed = deflateSync(raw);
	const signature = Buffer.from([
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	]);
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8;
	ihdr[9] = channels === 4 ? 6 : 2;
	ihdr[10] = 0;
	ihdr[11] = 0;
	ihdr[12] = 0;
	return Buffer.concat([
		signature,
		pngChunk("IHDR", ihdr),
		pngChunk("IDAT", compressed),
		pngChunk("IEND", Buffer.alloc(0))
	]);
}
/** Encodes tightly packed RGBA bytes (`width * height * 4`) as a PNG image. */
function encodePngRgba(buffer, width, height) {
	return encodePng(buffer, width, height, 4);
}
//#endregion
//#region src/media/temp-files.ts
/** Best-effort temp-file cleanup helper for optional paths from media conversion flows. */
async function unlinkIfExists(filePath) {
	if (!filePath) return;
	try {
		await fs.unlink(filePath);
	} catch {}
}
//#endregion
//#region src/channels/plugins/media-limits.ts
const MB = 1024 * 1024;
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
function resolveChannelMediaMaxBytes(params) {
	const accountId = normalizeAccountId(params.accountId);
	const channelLimit = params.resolveChannelLimitMb({
		cfg: params.cfg,
		accountId
	});
	if (channelLimit) return channelLimit * MB;
	if (params.cfg.agents?.defaults?.mediaMaxMb) return params.cfg.agents.defaults.mediaMaxMb * MB;
}
//#endregion
//#region src/channels/plugins/outbound/direct-text-media.ts
/**
* Direct text/media outbound adapter helpers.
*
* Builds lightweight SDK-backed send adapters with chunking, sanitization, and media limits.
*/
function readNumberField(record, key) {
	const value = record?.[key];
	return typeof value === "number" ? value : void 0;
}
/**
* Resolves an account-scoped channel media byte limit.
*/
function resolveScopedChannelMediaMaxBytes(params) {
	return resolveChannelMediaMaxBytes({
		cfg: params.cfg,
		resolveChannelLimitMb: params.resolveChannelLimitMb,
		accountId: params.accountId
	});
}
/**
* Builds a media byte-limit resolver for channels with `mediaMaxMb` config.
*/
function createScopedChannelMediaMaxBytesResolver(channel) {
	return (params) => resolveScopedChannelMediaMaxBytes({
		cfg: params.cfg,
		accountId: params.accountId,
		resolveChannelLimitMb: ({ cfg, accountId }) => {
			const channelConfig = asOptionalRecord(cfg.channels?.[channel]);
			return readNumberField(asOptionalRecord(asOptionalRecord(channelConfig?.accounts)?.[accountId]), "mediaMaxMb") ?? readNumberField(channelConfig, "mediaMaxMb");
		}
	});
}
/**
* Creates a channel outbound adapter backed by direct text/media send functions.
*/
function createDirectTextMediaOutbound(params) {
	const sendDirect = async (sendParams) => {
		const send = params.resolveSender(sendParams.deps);
		const maxBytes = params.resolveMaxBytes({
			cfg: sendParams.cfg,
			accountId: sendParams.accountId
		});
		const result = await send(sendParams.to, sendParams.text, sendParams.buildOptions({
			cfg: sendParams.cfg,
			mediaUrl: sendParams.mediaUrl,
			mediaAccess: sendParams.mediaAccess,
			mediaLocalRoots: sendParams.mediaAccess?.localRoots,
			mediaReadFile: sendParams.mediaAccess?.readFile,
			accountId: sendParams.accountId,
			replyToId: sendParams.replyToId,
			maxBytes
		}));
		return {
			channel: params.channel,
			...result
		};
	};
	const outbound = {
		deliveryMode: "direct",
		chunker: chunkText,
		chunkerMode: "text",
		textChunkLimit: 4e3,
		sanitizeText: ({ text }) => sanitizeForPlainText(text),
		sendPayload: async (ctx) => await sendTextMediaPayload({
			channel: params.channel,
			ctx,
			adapter: outbound
		}),
		sendText: async ({ cfg, to, text, accountId, deps, replyToId }) => {
			return await sendDirect({
				cfg,
				to,
				text,
				accountId,
				deps,
				replyToId,
				buildOptions: params.buildTextOptions
			});
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, accountId, deps, replyToId }) => {
			return await sendDirect({
				cfg,
				to,
				text,
				mediaUrl,
				mediaAccess: mediaAccess ?? (mediaLocalRoots || mediaReadFile ? {
					...mediaLocalRoots?.length ? { localRoots: mediaLocalRoots } : {},
					...mediaReadFile ? { readFile: mediaReadFile } : {}
				} : void 0),
				accountId,
				deps,
				replyToId,
				buildOptions: params.buildMediaOptions
			});
		}
	};
	return outbound;
}
//#endregion
export { encodePngRgba as a, unlinkIfExists as i, createScopedChannelMediaMaxBytesResolver as n, fillPixel as o, resolveChannelMediaMaxBytes as r, createDirectTextMediaOutbound as t };
