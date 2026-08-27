import { g as DeliveryContext } from "./types-ByIHlRxL.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";

//#region src/infra/channel-activity.d.ts
/** Direction of the last observed activity for a channel/account pair. */
type ChannelDirection = "inbound" | "outbound";
type ActivityEntry = {
  inboundAt: number | null;
  outboundAt: number | null;
};
/** Records the latest inbound or outbound activity timestamp for a channel/account. */
declare function recordChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
  direction: ChannelDirection;
  at?: number;
}): void;
/** Returns the latest known inbound/outbound activity timestamps for a channel/account. */
declare function getChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
}): ActivityEntry;
/** Clears all tracked channel activity; test-only helper. */
declare function resetChannelActivityForTest(): void;
//#endregion
//#region src/infra/system-events.d.ts
type SystemEvent = {
  /**
   * OpenClaw-assigned opaque identity for one queued occurrence. Preserve it when returning a
   * snapshot to consume. It changes on replacement or re-enqueue; optional only for legacy
   * ID-less compatibility.
   */
  id?: string;
  text: string;
  ts: number;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext;
};
type SystemEventOptions = {
  sessionKey: string;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext; /** Replace the pending event for this context and delivery route. Requires contextKey. */
  replace?: boolean;
};
declare function isSystemEventContextChanged(sessionKey: string, contextKey?: string | null): boolean;
declare function enqueueSystemEventEntry(text: string, options: SystemEventOptions): SystemEvent | null;
declare function enqueueSystemEvent(text: string, options: SystemEventOptions): boolean;
declare function drainSystemEventEntries(sessionKey: string): SystemEvent[];
declare function consumeSystemEventEntries(sessionKey: string, consumedEntries: readonly SystemEvent[]): SystemEvent[];
declare function consumeSelectedSystemEventEntries(sessionKey: string, consumedEntries: readonly SystemEvent[]): SystemEvent[];
declare function drainSystemEvents(sessionKey: string): string[];
declare function peekSystemEventEntries(sessionKey: string): SystemEvent[];
declare function peekSystemEvents(sessionKey: string): string[];
declare function hasSystemEvents(sessionKey: string): boolean;
declare function resolveSystemEventDeliveryContext(events: readonly SystemEvent[]): DeliveryContext | undefined;
declare function resetSystemEventsForTest(): void;
//#endregion
export { resetChannelActivityForTest as _, drainSystemEvents as a, hasSystemEvents as c, peekSystemEvents as d, resetSystemEventsForTest as f, recordChannelActivity as g, getChannelActivity as h, drainSystemEventEntries as i, isSystemEventContextChanged as l, ChannelDirection as m, consumeSelectedSystemEventEntries as n, enqueueSystemEvent as o, resolveSystemEventDeliveryContext as p, consumeSystemEventEntries as r, enqueueSystemEventEntry as s, SystemEvent as t, peekSystemEventEntries as u };