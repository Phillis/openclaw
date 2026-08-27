import "./runtime-api-IAhSVA75.js";
import "./types.openclaw-DRR8P0H2.js";
import "./channel-contract-Pji552cX.js";
import "./runtime-forwarders-DsCA1rRO.js";
//#region src/channels/message/ingress-monitor.d.ts
/** Claim ownership lifecycle handed to one channel delivery. */
type ChannelIngressMonitorLifecycle = {
  admission: "exclusive";
  abortSignal: AbortSignal;
  onAdopted: () => void | Promise<void>;
  onDeferred: () => void;
  onAdoptionFinalizing: () => void;
  onFailed?: (error: unknown) => void | Promise<void>;
  onCancelled?: () => void | Promise<void>;
  onAbandoned: () => void | Promise<void>;
};
/** Optional explicit outcome from a channel delivery. */
type ChannelIngressMonitorDeliveryResult = {
  kind: "completed";
} | {
  kind: "deferred";
} | {
  kind: "failed-retryable";
  error: unknown;
};
//#endregion
export { ChannelIngressMonitorLifecycle as n, ChannelIngressMonitorDeliveryResult as t };