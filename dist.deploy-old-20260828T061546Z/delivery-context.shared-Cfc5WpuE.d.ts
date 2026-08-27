import { _ as DeliveryContext, c as SessionEntry, l as SessionOrigin, s as SessionDeliveryState, v as ChannelRouteRef } from "./types-CheMd8wT.js";
//#region src/utils/delivery-context.shared.d.ts
type SessionDeliveryProjection = {
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  origin?: SessionOrigin;
  channel?: string;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
};
/** Builds one canonical delivery state from current turn routing facts. */
declare function normalizeSessionDeliveryState(params?: {
  route?: ChannelRouteRef;
  context?: DeliveryContext;
  origin?: SessionOrigin;
}): SessionDeliveryState;
/** Projects compatibility fields without persisting duplicate delivery state. */
declare function projectSessionDeliveryFields(delivery?: SessionDeliveryState): SessionDeliveryProjection;
/** Reads only the canonical persisted delivery record. */
declare function deliveryContextFromSession(entry?: Pick<SessionEntry, "delivery">): DeliveryContext | undefined;
declare function sessionDeliveryRoute(entry?: Pick<SessionEntry, "delivery">): ChannelRouteRef | undefined;
declare function sessionDeliveryOrigin(entry?: Pick<SessionEntry, "delivery">): SessionOrigin | undefined;
declare function sessionDeliveryChannel(entry?: Pick<SessionEntry, "delivery">): string | undefined;
//#endregion
export { sessionDeliveryOrigin as a, sessionDeliveryChannel as i, normalizeSessionDeliveryState as n, sessionDeliveryRoute as o, projectSessionDeliveryFields as r, deliveryContextFromSession as t };