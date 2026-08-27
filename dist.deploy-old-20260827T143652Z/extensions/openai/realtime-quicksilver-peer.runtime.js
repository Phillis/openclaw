import { i as toErrorObject } from "../../error-coercion-DisD0JTb.js";
import "../../error-runtime-CmlvK1A3.js";
import "../../realtime-voice-oUx-QwLx.js";
import { s as resamplePcm } from "../../audio-energy-DF0tOiok.js";
import { n as OpenAIQuicksilverPendingAudio } from "../../realtime-quicksilver-audio-buffer-ZY82NjqB.js";
import { randomInt } from "node:crypto";
//#region extensions/openai/realtime-quicksilver-peer.runtime.ts
const QUICKSILVER_SAMPLE_RATE = 48e3;
const RELAY_SAMPLE_RATE = 24e3;
const QUICKSILVER_CHANNELS = 2;
const OPUS_FRAME_SAMPLES = 960;
const OPUS_FRAME_DURATION_MS = 20;
const INBOUND_REORDER_DEPTH = 4;
const INBOUND_MAX_LATE_PACKETS = 100;
const RTP_SEQUENCE_MODULUS = 65536;
const RTP_SEQUENCE_HALF_RANGE = RTP_SEQUENCE_MODULUS / 2;
function pcmBufferToInt16(pcm) {
	const samples = new Int16Array(Math.floor(pcm.length / 2));
	for (let index = 0; index < samples.length; index += 1) samples[index] = pcm.readInt16LE(index * 2);
	return samples;
}
function convertRelayPcmToQuicksilverPcm(pcm24kMono) {
	const mono48k = pcmBufferToInt16(resamplePcm(pcm24kMono, RELAY_SAMPLE_RATE, QUICKSILVER_SAMPLE_RATE));
	const stereo48k = new Int16Array(mono48k.length * QUICKSILVER_CHANNELS);
	for (let index = 0; index < mono48k.length; index += 1) {
		const sample = mono48k[index] ?? 0;
		stereo48k[index * 2] = sample;
		stereo48k[index * 2 + 1] = sample;
	}
	return stereo48k;
}
function convertQuicksilverPcmToRelayPcm(pcm48kStereo) {
	const frameCount = Math.floor(pcm48kStereo.length / QUICKSILVER_CHANNELS);
	const mono48k = Buffer.alloc(frameCount * 2);
	for (let frame = 0; frame < frameCount; frame += 1) {
		const left = pcm48kStereo[frame * 2] ?? 0;
		const right = pcm48kStereo[frame * 2 + 1] ?? 0;
		mono48k.writeInt16LE(Math.round((left + right) / 2), frame * 2);
	}
	return resamplePcm(mono48k, QUICKSILVER_SAMPLE_RATE, RELAY_SAMPLE_RATE);
}
function forwardSequenceDistance(expected, sequenceNumber) {
	return sequenceNumber - expected + RTP_SEQUENCE_MODULUS & 65535;
}
/** Pure-TypeScript WebRTC media peer with a WASM-only Opus codec. */
var OpenAIQuicksilverAudioPeer = class OpenAIQuicksilverAudioPeer {
	static async create(params) {
		const [werift, libopus] = await Promise.all([import("../../lib-C713Bsui.js"), import("../../dist-qCCjdpVI.js")]);
		params.signal?.throwIfAborted();
		const peer = new werift.RTCPeerConnection({
			codecs: {
				audio: [werift.useOPUS({ payloadType: 111 })],
				video: []
			},
			...params.iceServers ? { iceServers: params.iceServers } : {}
		});
		const transceiver = peer.addTransceiver("audio", { direction: "sendrecv" });
		let encoder;
		let decoder;
		let encoderFreed = false;
		let decoderFreed = false;
		let peerClosed = false;
		const cleanup = async () => {
			if (encoder && !encoderFreed) {
				encoderFreed = true;
				encoder.free();
			}
			if (decoder && !decoderFreed) {
				decoderFreed = true;
				decoder.free();
			}
			if (!peerClosed) {
				peerClosed = true;
				await peer.close().catch(() => void 0);
			}
		};
		const onAbort = () => void cleanup();
		params.signal?.addEventListener("abort", onAbort, { once: true });
		try {
			encoder = await libopus.createEncoder({
				application: libopus.Application.Voip,
				channels: QUICKSILVER_CHANNELS,
				sampleRate: QUICKSILVER_SAMPLE_RATE,
				frameSize: OPUS_FRAME_SAMPLES
			});
			params.signal?.throwIfAborted();
			decoder = await libopus.createDecoder({
				channels: QUICKSILVER_CHANNELS,
				sampleRate: QUICKSILVER_SAMPLE_RATE
			});
			params.signal?.throwIfAborted();
			params.signal?.removeEventListener("abort", onAbort);
			return new OpenAIQuicksilverAudioPeer({
				callbacks: params.callbacks,
				decoder,
				encoder,
				peer,
				transceiver,
				werift
			});
		} catch (error) {
			params.signal?.removeEventListener("abort", onAbort);
			await cleanup();
			throw error;
		}
	}
	static convertRelayPcm(pcm24kMono) {
		return convertRelayPcmToQuicksilverPcm(pcm24kMono);
	}
	static convertQuicksilverPcm(pcm48kStereo) {
		return convertQuicksilverPcmToRelayPcm(pcm48kStereo);
	}
	constructor(state) {
		this.state = state;
		this.connected = false;
		this.closed = false;
		this.inboundRtpState = { pendingPackets: /* @__PURE__ */ new Map() };
		this.pendingAudio = new OpenAIQuicksilverPendingAudio();
		this.sequenceNumber = randomInt(65536);
		this.subscribedTracks = /* @__PURE__ */ new Set();
		this.timestamp = randomInt(4294967296);
		state.peer.onTrack.subscribe((track) => this.attachInboundTrack(track));
		state.peer.connectionStateChange.subscribe((connectionState) => {
			if (this.closed) return;
			if (connectionState === "connected") {
				this.connected = true;
				this.startMediaPump();
			} else if ([
				"failed",
				"disconnected",
				"closed"
			].includes(connectionState)) {
				this.connected = false;
				this.state.callbacks.onError(/* @__PURE__ */ new Error(`GPT-Live WebRTC media connection ${connectionState}`));
			}
		});
	}
	async createOffer() {
		const offer = await this.state.peer.createOffer();
		await this.state.peer.setLocalDescription(offer);
		const sdp = this.state.peer.localDescription?.sdp;
		if (!sdp?.trim()) throw new Error("werift did not produce a GPT-Live SDP offer");
		return sdp;
	}
	async applyAnswer(answerSdp) {
		await this.state.peer.setRemoteDescription({
			type: "answer",
			sdp: answerSdp
		});
		this.attachInboundTrack(this.state.transceiver.receiver.track);
	}
	adoptPendingAudio(pendingAudio) {
		if (this.closed) {
			pendingAudio.clear();
			return;
		}
		if (this.pendingAudio.length > 0) {
			pendingAudio.clear();
			throw new Error("GPT-Live WebRTC peer already owns pending audio");
		}
		this.pendingAudio = pendingAudio;
	}
	sendAudio(audio) {
		if (this.closed || audio.length < 2) return;
		this.pendingAudio.append(audio);
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		if (this.mediaTimer) {
			clearInterval(this.mediaTimer);
			this.mediaTimer = void 0;
		}
		this.pendingAudio.clear();
		this.resetInboundRtpState();
		this.state.encoder.free();
		this.state.decoder.free();
		this.state.peer.close().catch(() => void 0);
	}
	attachInboundTrack(track) {
		if (track.kind !== "audio" || this.subscribedTracks.has(track.uuid)) return;
		this.subscribedTracks.add(track.uuid);
		track.onReceiveRtp.subscribe((packet) => this.handleInboundRtp(packet));
	}
	handleInboundRtp(packet) {
		if (this.closed) return;
		try {
			this.state.callbacks.onRtpPacket?.();
			const sequenceNumber = packet.header.sequenceNumber;
			if (this.activeInboundSsrc === void 0) this.activeInboundSsrc = packet.header.ssrc;
			else if (packet.header.ssrc !== this.activeInboundSsrc) throw new Error("GPT-Live WebRTC audio source changed unexpectedly");
			const state = this.inboundRtpState;
			if (state.nextSequence === void 0) {
				state.nextSequence = sequenceNumber + 1 & 65535;
				this.decodeInboundPacket(packet);
				return;
			}
			const distance = forwardSequenceDistance(state.nextSequence, sequenceNumber);
			if (distance >= RTP_SEQUENCE_HALF_RANGE) {
				if (forwardSequenceDistance(sequenceNumber, state.nextSequence) <= INBOUND_MAX_LATE_PACKETS) return;
				throw new Error("GPT-Live WebRTC RTP sequence changed unexpectedly");
			}
			if (state.pendingPackets.has(sequenceNumber)) return;
			if (distance === 0) {
				state.nextSequence = state.nextSequence + 1 & 65535;
				this.decodeInboundPacket(packet);
				this.clearInboundFlushTimer(state);
				this.drainInboundPackets(state);
				return;
			}
			state.pendingPackets.set(sequenceNumber, packet);
			this.flushInboundReorderWindow(state);
			this.scheduleInboundFlush(state);
		} catch (error) {
			this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
		}
	}
	resetInboundRtpState() {
		this.clearInboundFlushTimer(this.inboundRtpState);
		this.inboundRtpState.nextSequence = void 0;
		this.inboundRtpState.pendingPackets.clear();
	}
	flushInboundReorderWindow(state, force = false) {
		const expected = state.nextSequence;
		if (expected === void 0 || state.pendingPackets.size === 0) return;
		const pending = [...state.pendingPackets.keys()].map((sequenceNumber) => ({
			sequenceNumber,
			distance: forwardSequenceDistance(expected, sequenceNumber)
		})).filter(({ distance }) => distance < RTP_SEQUENCE_HALF_RANGE).toSorted((left, right) => left.distance - right.distance);
		const nearest = pending[0];
		const farthest = pending.at(-1);
		if (!nearest || !farthest || !force && farthest.distance < INBOUND_REORDER_DEPTH) return;
		this.clearInboundFlushTimer(state);
		const concealCount = Math.min(nearest.distance, INBOUND_REORDER_DEPTH);
		for (let index = 0; index < concealCount; index += 1) {
			state.nextSequence = (state.nextSequence ?? 0) + 1 & 65535;
			this.decodeInboundPacketLoss();
		}
		if (nearest.distance > INBOUND_REORDER_DEPTH) state.nextSequence = nearest.sequenceNumber;
		this.drainInboundPackets(state);
	}
	drainInboundPackets(state) {
		while (state.nextSequence !== void 0) {
			const packet = state.pendingPackets.get(state.nextSequence);
			if (!packet) break;
			state.pendingPackets.delete(state.nextSequence);
			state.nextSequence = state.nextSequence + 1 & 65535;
			this.decodeInboundPacket(packet);
		}
		if (state.pendingPackets.size === 0) this.clearInboundFlushTimer(state);
		else this.scheduleInboundFlush(state);
	}
	scheduleInboundFlush(state) {
		if (this.closed || state.flushTimer || state.pendingPackets.size === 0) return;
		state.flushTimer = setTimeout(() => {
			state.flushTimer = void 0;
			if (this.closed) return;
			try {
				this.flushInboundReorderWindow(state, true);
			} catch (error) {
				this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
			}
		}, INBOUND_REORDER_DEPTH * OPUS_FRAME_DURATION_MS);
		state.flushTimer.unref?.();
	}
	clearInboundFlushTimer(state) {
		if (state.flushTimer) {
			clearTimeout(state.flushTimer);
			state.flushTimer = void 0;
		}
	}
	decodeInboundPacket(packet) {
		const opusPacket = this.state.werift.dePacketizeRtpPackets("opus", [packet]).data;
		this.emitInboundPcm(this.state.decoder.decode(opusPacket, { maxFrameSize: 5760 }));
	}
	decodeInboundPacketLoss() {
		this.emitInboundPcm(this.state.decoder.decodePacketLoss(OPUS_FRAME_SAMPLES));
	}
	emitInboundPcm(decoded) {
		const relayPcm = convertQuicksilverPcmToRelayPcm(decoded);
		if (relayPcm.length > 0) this.state.callbacks.onAudio(relayPcm);
	}
	startMediaPump() {
		if (this.mediaTimer || this.closed) return;
		this.mediaTimer = setInterval(() => this.sendNextAudioFrame(), OPUS_FRAME_DURATION_MS);
		this.mediaTimer.unref?.();
		this.sendNextAudioFrame();
	}
	sendNextAudioFrame() {
		if (!this.connected || this.closed) return;
		const frame = this.takeNextRelayFrame();
		try {
			const opusPacket = this.state.encoder.encode(convertRelayPcmToQuicksilverPcm(frame), { frameSize: OPUS_FRAME_SAMPLES });
			const rtp = new this.state.werift.RtpPacket(new this.state.werift.RtpHeader({
				marker: false,
				payloadType: 111,
				sequenceNumber: this.sequenceNumber,
				timestamp: this.timestamp
			}), Buffer.from(opusPacket));
			this.sequenceNumber = this.sequenceNumber + 1 & 65535;
			this.timestamp = this.timestamp + OPUS_FRAME_SAMPLES >>> 0;
			this.state.transceiver.sender.sendRtp(rtp).catch((error) => {
				this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
			});
		} catch (error) {
			this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
		}
	}
	takeNextRelayFrame() {
		const frame = Buffer.alloc(960);
		this.pendingAudio.readInto(frame);
		return frame;
	}
};
//#endregion
export { OpenAIQuicksilverAudioPeer };
