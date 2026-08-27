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