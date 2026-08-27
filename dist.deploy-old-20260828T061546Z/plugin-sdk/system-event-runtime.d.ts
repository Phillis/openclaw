import { n as peekSystemEventEntries, r as resetSystemEventsForTest, t as enqueueSystemEvent } from "../system-events-DOMq8LSr.js";
//#region src/config/sessions/main-session.runtime.d.ts
/** Resolves the main session key from the active runtime config. */
declare function resolveMainSessionKeyFromConfig(): string;
//#endregion
//#region src/plugin-sdk/system-event-runtime.d.ts
type RoutedSystemEventOptions = Omit<Parameters<typeof enqueueSystemEvent>[1], "sessionKey">;
type RoutedSystemEventRoute = {
  agentId: string;
  sessionKey: string;
};
declare function enqueueRoutedSystemEvent(text: string, route: RoutedSystemEventRoute, options?: RoutedSystemEventOptions): boolean;
//#endregion
export { enqueueRoutedSystemEvent, enqueueSystemEvent, peekSystemEventEntries, resetSystemEventsForTest, resolveMainSessionKeyFromConfig };