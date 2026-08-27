import { s as __toESM } from "./rolldown-runtime-DE1ahGrs.js";
import { f as INT32_LE, m as INT64_LE, o as makeUnexpectedFileContentError, w as UINT64_LE } from "./BasicParser-Ce0bn6Mo.js";
import { i as FourCcToken } from "./APEv2Parser-ChXlOA9U.js";
import { t as require_src } from "./src-D0deKpII.js";
import { r as ID3v2Header } from "./ID3v2Token-GRdoXaR9.js";
import { t as ID3v2Parser } from "./ID3v2Parser-C4uoAvGw.js";
import { t as AbstractID3Parser } from "./AbstractID3Parser-Dbh5KMrW.js";
//#region node_modules/music-metadata/lib/dsf/DsfChunk.js
var import_src = /* @__PURE__ */ __toESM(require_src(), 1);
/**
* Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
*/
const ChunkHeader = {
	len: 12,
	get: (buf, off) => {
		return {
			id: FourCcToken.get(buf, off),
			size: UINT64_LE.get(buf, off + 4)
		};
	}
};
/**
* Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
*/
const DsdChunk = {
	len: 16,
	get: (buf, off) => {
		return {
			fileSize: UINT64_LE.get(buf, off),
			metadataPointer: UINT64_LE.get(buf, off + 8)
		};
	}
};
/**
* Common chunk DSD header: the 'chunk name (Four-CC)' & chunk size
*/
const FormatChunk = {
	len: 40,
	get: (buf, off) => {
		return {
			formatVersion: INT32_LE.get(buf, off),
			formatID: INT32_LE.get(buf, off + 4),
			channelType: INT32_LE.get(buf, off + 8),
			channelNum: INT32_LE.get(buf, off + 12),
			samplingFrequency: INT32_LE.get(buf, off + 16),
			bitsPerSample: INT32_LE.get(buf, off + 20),
			sampleCount: INT64_LE.get(buf, off + 24),
			blockSizePerChannel: INT32_LE.get(buf, off + 32)
		};
	}
};
//#endregion
//#region node_modules/music-metadata/lib/dsf/DsfParser.js
const debug = (0, import_src.default)("music-metadata:parser:DSF");
var DsdContentParseError = class extends makeUnexpectedFileContentError("DSD") {};
/**
* DSF (dsd stream file) File Parser
* Ref: https://dsd-guide.com/sites/default/files/white-papers/DSFFileFormatSpec_E.pdf
*/
var DsfParser = class extends AbstractID3Parser {
	async postId3v2Parse() {
		const p0 = this.tokenizer.position;
		const chunkHeader = await this.tokenizer.readToken(ChunkHeader);
		if (chunkHeader.id !== "DSD ") throw new DsdContentParseError("Invalid chunk signature");
		if (chunkHeader.size !== BigInt(ChunkHeader.len + DsdChunk.len)) throw new DsdContentParseError(`Invalid DSD chunk size: ${chunkHeader.size}`);
		this.metadata.setFormat("container", "DSF");
		this.metadata.setFormat("lossless", true);
		this.metadata.setAudioOnly();
		const dsdChunk = await this.tokenizer.readToken(DsdChunk);
		if (dsdChunk.fileSize < chunkHeader.size) throw new DsdContentParseError(`Invalid DSF file size: ${dsdChunk.fileSize}`);
		await this.parseChunks(dsdChunk.fileSize - chunkHeader.size);
		if (dsdChunk.metadataPointer === 0n) {
			debug("No ID3v2 tag present");
			return;
		}
		debug(`expect ID3v2 at offset=${dsdChunk.metadataPointer}`);
		const metadataOffset = dsdChunk.metadataPointer - BigInt(this.tokenizer.position - p0);
		if (metadataOffset < 0n || metadataOffset > BigInt(Number.MAX_SAFE_INTEGER) || dsdChunk.metadataPointer + BigInt(ID3v2Header.len) > dsdChunk.fileSize) throw new DsdContentParseError(`Invalid metadata pointer: ${dsdChunk.metadataPointer}`);
		await this.tokenizer.ignore(Number(metadataOffset));
		return new ID3v2Parser().parse(this.metadata, this.tokenizer, this.options);
	}
	async parseChunks(bytesRemaining) {
		const chunkHeaderSize = BigInt(ChunkHeader.len);
		while (bytesRemaining >= chunkHeaderSize) {
			const chunkHeader = await this.tokenizer.readToken(ChunkHeader);
			debug(`Parsing chunk name=${chunkHeader.id} size=${chunkHeader.size}`);
			if (chunkHeader.size < chunkHeaderSize) throw new DsdContentParseError(`Invalid ${chunkHeader.id} chunk size: ${chunkHeader.size}`);
			if (chunkHeader.size > bytesRemaining) throw new DsdContentParseError(`${chunkHeader.id} chunk exceeds remaining file size`);
			const payloadSize = chunkHeader.size - chunkHeaderSize;
			switch (chunkHeader.id) {
				case "fmt ": {
					if (payloadSize < BigInt(FormatChunk.len)) throw new DsdContentParseError(`Invalid fmt chunk size: ${chunkHeader.size}`);
					const formatChunk = await this.tokenizer.readToken(FormatChunk);
					this.metadata.setFormat("numberOfChannels", formatChunk.channelNum);
					this.metadata.setFormat("sampleRate", formatChunk.samplingFrequency);
					this.metadata.setFormat("bitsPerSample", formatChunk.bitsPerSample);
					this.metadata.setFormat("numberOfSamples", formatChunk.sampleCount);
					this.metadata.setFormat("duration", Number(formatChunk.sampleCount) / formatChunk.samplingFrequency);
					const bitrate = formatChunk.bitsPerSample * formatChunk.samplingFrequency * formatChunk.channelNum;
					this.metadata.setFormat("bitrate", bitrate);
					return;
				}
				default:
					await this.tokenizer.ignore(Number(payloadSize));
					break;
			}
			bytesRemaining -= chunkHeader.size;
		}
	}
};
//#endregion
export { DsfParser };
