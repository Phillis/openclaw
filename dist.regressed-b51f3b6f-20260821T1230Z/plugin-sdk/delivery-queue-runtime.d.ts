import { _ as ReplyPayload } from "../types-CoqV37wL.js";
import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { d as OutboundPayloadDeliveryOutcome, u as OutboundDeliveryResult } from "../identity-types-Dv84fZkr.js";
import { n as QueuedDelivery, r as QueuedDeliveryPayload, t as MessageSentEvent } from "../message-sent-hook-DTlNIt42.js";

//#region src/infra/delivery-recovery.shared.d.ts
type DeliveryRecoveryDrainDecision = {
  match: boolean;
  bypassBackoff?: boolean;
};
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.d.ts
type DeliverFn = (params: {
  cfg: OpenClawConfig;
} & QueuedDeliveryPayload & {
  payloads: ReturnType<typeof queuedDeliveryPayloads>;
  deliveryQueueId?: string;
  deliveryQueueStateDir?: string;
  deliveryProducerClaimId?: string;
  deliveryProducerLeaseRequired?: boolean;
  skipQueue?: boolean;
  deferredDeliveryAdmissionPassed?: true;
  deferCommitHooks?: boolean;
  onMessageSentEvent?: (event: MessageSentEvent, sourceIndex: number) => void;
  onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void;
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
}) => Promise<unknown>;
interface RecoveryLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
declare const queuedDeliveryPayloads: (entry: QueuedDelivery) => ReplyPayload[];
declare function drainPendingDeliveriesCore(opts: {
  drainKey: string;
  logLabel: string;
  cfg: OpenClawConfig;
  log: RecoveryLogger;
  stateDir?: string;
  deliver: DeliverFn;
  selectEntry: (entry: QueuedDelivery, now: number) => DeliveryRecoveryDrainDecision;
}): Promise<void>;
//#endregion
//#region src/plugin-sdk/delivery-queue-runtime.d.ts
type DrainPendingDeliveriesOptions = Omit<Parameters<typeof drainPendingDeliveriesCore>[0], "deliver"> & {
  /** Optional delivery implementation for tests or plugin-owned send paths. */deliver?: DeliverFn;
};
/**
 * Drain queued outbound payloads after a channel reconnect or transport recovery.
 * When no deliver function is provided, the heavy outbound delivery runtime is
 * loaded lazily so importing this SDK subpath does not eagerly bind send internals.
 */
declare function drainPendingDeliveries(opts: DrainPendingDeliveriesOptions): Promise<void>;
//#endregion
export { drainPendingDeliveries };