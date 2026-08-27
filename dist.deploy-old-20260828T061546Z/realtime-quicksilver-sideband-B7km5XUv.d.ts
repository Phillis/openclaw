import { i as OpenAIQuicksilverRequestIds, t as OpenAIQuicksilverAuth } from "./realtime-quicksilver-wire-C6_qTF93.js";
import { ClientOptions, RawData } from "ws";
//#region extensions/openai/realtime-quicksilver-sideband.d.ts
type OpenAIQuicksilverSocket = {
  readonly readyState: number;
  send(payload: string): void;
  close(code?: number, reason?: string): void;
  on(event: "message", listener: (data: RawData, isBinary: boolean) => void): OpenAIQuicksilverSocket;
  on(event: "error", listener: (error: Error) => void): OpenAIQuicksilverSocket;
  on(event: "close", listener: (code: number, reason: Buffer) => void): OpenAIQuicksilverSocket;
  once(event: "open", listener: () => void): OpenAIQuicksilverSocket;
  once(event: "error", listener: (error: Error) => void): OpenAIQuicksilverSocket;
  once(event: "close", listener: (code: number, reason: Buffer) => void): OpenAIQuicksilverSocket;
  off(event: "open", listener: () => void): OpenAIQuicksilverSocket;
  off(event: "message", listener: (data: RawData, isBinary: boolean) => void): OpenAIQuicksilverSocket;
  off(event: "error", listener: (error: Error) => void): OpenAIQuicksilverSocket;
  off(event: "close", listener: (code: number, reason: Buffer) => void): OpenAIQuicksilverSocket;
};
type OpenAIQuicksilverSocketFactory = (url: string, options: ClientOptions) => OpenAIQuicksilverSocket;
type OpenAIQuicksilverBufferedFrame = {
  data: RawData;
  isBinary: boolean;
};
type OpenAIQuicksilverTerminalEvent = {
  kind: "error";
  error: Error;
} | {
  kind: "close";
  code: number;
  reason: string;
};
type OpenAIQuicksilverConnectedSideband = {
  socket: OpenAIQuicksilverSocket;
  bufferedFrames: OpenAIQuicksilverBufferedFrame[];
  detachBuffer: () => OpenAIQuicksilverTerminalEvent | undefined;
};
declare function connectOpenAIQuicksilverSideband(params: {
  auth: OpenAIQuicksilverAuth;
  createSocket: OpenAIQuicksilverSocketFactory;
  requestIds: OpenAIQuicksilverRequestIds;
  signal: AbortSignal;
  url: string;
}): Promise<OpenAIQuicksilverConnectedSideband>;
//#endregion
export { OpenAIQuicksilverSocketFactory as n, connectOpenAIQuicksilverSideband as r, OpenAIQuicksilverSocket as t };