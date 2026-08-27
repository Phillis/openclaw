import { n as OpenAIQuicksilverPendingAudio } from "../../realtime-quicksilver-audio-buffer-DPasqISQ.js";
//#region extensions/openai/realtime-quicksilver-peer.runtime.d.ts
type OpenAIQuicksilverAudioPeerCallbacks = {
  onAudio: (audio: Buffer) => void;
  onError: (error: Error) => void;
  onRtpPacket?: () => void;
};
type OpenAIQuicksilverAudioPeerContract = {
  createOffer(): Promise<string>;
  applyAnswer(answerSdp: string): Promise<void>;
  adoptPendingAudio(pendingAudio: OpenAIQuicksilverPendingAudio): void;
  sendAudio(audio: Buffer): void;
  close(): void;
};
/** Pure-TypeScript WebRTC media peer with a WASM-only Opus codec. */
declare class OpenAIQuicksilverAudioPeer implements OpenAIQuicksilverAudioPeerContract {
  private readonly state;
  static create(params: {
    callbacks: OpenAIQuicksilverAudioPeerCallbacks;
    iceServers?: Array<{
      urls: string | string[];
      username?: string;
      credential?: string;
    }>;
    signal?: AbortSignal;
  }): Promise<OpenAIQuicksilverAudioPeer>;
  static convertRelayPcm(pcm24kMono: Buffer): Int16Array;
  static convertQuicksilverPcm(pcm48kStereo: Int16Array): Buffer;
  private connected;
  private closed;
  private activeInboundSsrc;
  private inboundRtpState;
  private mediaTimer;
  private pendingAudio;
  private pendingResampledAudio;
  private readonly inboundResampler;
  private readonly outboundResampler;
  private sequenceNumber;
  private subscribedTracks;
  private timestamp;
  private constructor();
  createOffer(): Promise<string>;
  applyAnswer(answerSdp: string): Promise<void>;
  adoptPendingAudio(pendingAudio: OpenAIQuicksilverPendingAudio): void;
  sendAudio(audio: Buffer): void;
  close(): void;
  private attachInboundTrack;
  private handleInboundRtp;
  private resetInboundRtpState;
  private flushInboundReorderWindow;
  private drainInboundPackets;
  private scheduleInboundFlush;
  private clearInboundFlushTimer;
  private decodeInboundPacket;
  private decodeInboundPacketLoss;
  private emitInboundPcm;
  private startMediaPump;
  private sendNextAudioFrame;
  private takeNextRelayFrame;
}
//#endregion
export { OpenAIQuicksilverAudioPeer, OpenAIQuicksilverAudioPeerCallbacks, OpenAIQuicksilverAudioPeerContract };