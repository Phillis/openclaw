//#region extensions/openai/realtime-quicksilver-audio-buffer.ts
const RELAY_FRAME_SAMPLES = 480;
const MAX_PENDING_RELAY_FRAMES = 250;
const OPENAI_QUICKSILVER_RELAY_FRAME_BYTES = RELAY_FRAME_SAMPLES * 2;
const OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES = 960 * MAX_PENDING_RELAY_FRAMES;
var OpenAIQuicksilverPendingAudio = class {
	constructor() {
		this.readOffset = 0;
		this.pendingBytes = 0;
	}
	get length() {
		return this.pendingBytes;
	}
	append(incoming) {
		const evenLength = incoming.length - incoming.length % 2;
		if (evenLength === 0) return;
		const retainedBytes = Math.min(evenLength, OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES);
		const sourceOffset = evenLength - retainedBytes;
		const storage = this.storage ??= Buffer.alloc(OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES);
		const droppedBytes = Math.max(0, this.pendingBytes + retainedBytes - OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES);
		this.readOffset = (this.readOffset + droppedBytes) % OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES;
		this.pendingBytes -= droppedBytes;
		const writeOffset = (this.readOffset + this.pendingBytes) % OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES;
		const firstBytes = Math.min(retainedBytes, OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES - writeOffset);
		incoming.copy(storage, writeOffset, sourceOffset, sourceOffset + firstBytes);
		if (firstBytes < retainedBytes) incoming.copy(storage, 0, sourceOffset + firstBytes, sourceOffset + retainedBytes);
		this.pendingBytes += retainedBytes;
	}
	readInto(target) {
		const evenLength = target.length - target.length % 2;
		const readBytes = Math.min(evenLength, this.pendingBytes);
		const storage = this.storage;
		if (readBytes === 0 || !storage) return 0;
		const firstBytes = Math.min(readBytes, OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES - this.readOffset);
		storage.copy(target, 0, this.readOffset, this.readOffset + firstBytes);
		if (firstBytes < readBytes) storage.copy(target, firstBytes, 0, readBytes - firstBytes);
		this.readOffset = (this.readOffset + readBytes) % OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES;
		this.pendingBytes -= readBytes;
		if (this.pendingBytes === 0) this.readOffset = 0;
		return readBytes;
	}
	clear() {
		this.storage = void 0;
		this.readOffset = 0;
		this.pendingBytes = 0;
	}
};
//#endregion
export { OpenAIQuicksilverPendingAudio as n, OPENAI_QUICKSILVER_RELAY_FRAME_BYTES as t };
