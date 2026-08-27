import { $ as resolveChannelImplicitMentions, A as CreateChannelIngressResolverParams, B as ChannelIngressState, C as ChannelIngressIdentityField, D as ChannelIngressRouteAccess, E as ChannelIngressResolverMessageParams, F as AccessGroupMembershipFact, H as IngressReasonCode, I as ChannelIngressDecision, L as ChannelIngressEventInput, M as ResolveStableChannelMessageIngressParams, N as ResolvedChannelMessageIngress, O as ChannelIngressRouteDescriptor, P as StableChannelIngressIdentityParams, Q as ResolvedChannelImplicitMentions, R as ChannelIngressIdentifierKind, S as ChannelIngressIdentityDescriptor, T as ChannelIngressResolver, V as ChannelIngressStateInput, _ as ChannelIngressCommandPresetInput, b as ChannelIngressEventPresetInput, h as ChannelIngressAccessGroupMembershipResolver, j as ResolveChannelMessageIngressParams, k as ChannelMessageIngressCommandInput, v as ChannelIngressConfigInput, w as ChannelIngressIdentitySubjectInput, x as ChannelIngressIdentityAlias, y as ChannelIngressContextBinding, z as ChannelIngressPolicyInput } from "../ingress-drain-U2vhefkW.js";
import { t as PairingChannel } from "../pairing-store.types-B0TyHydX.js";
import { a as ChannelIngressMonitorLifecycle, i as ChannelIngressMonitorFacts, o as ChannelIngressMonitorPayloadCodec, r as ChannelIngressMonitorDrainOptions, s as CreateChannelIngressMonitorOptions } from "../ingress-monitor-kQ8ADO_t.js";

//#region src/channels/message-access/runtime-identity.d.ts
/** Build an identity descriptor for channels with one stable id and optional aliases. */
declare function defineStableChannelIngressIdentity(params?: StableChannelIngressIdentityParams): ChannelIngressIdentityDescriptor;
//#endregion
//#region src/channels/message-access/runtime.d.ts
/**
 * Create a reusable ingress resolver for one channel account and identity
 * descriptor.
 */
declare function createChannelIngressResolver(base: CreateChannelIngressResolverParams): ChannelIngressResolver;
/**
 * Resolve one inbound event using a simple stable subject identity descriptor.
 */
declare function resolveStableChannelMessageIngress(params: ResolveStableChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
/**
 * Collect optional route descriptors while dropping false, null, and undefined
 * entries.
 */
declare function channelIngressRoutes(...routes: Array<ChannelIngressRouteDescriptor | false | null | undefined>): ChannelIngressRouteDescriptor[];
/**
 * Resolve sender, route, command, event, and activation gates for one inbound
 * channel event.
 */
declare function resolveChannelMessageIngress(params: ResolveChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
//#endregion
//#region src/channels/message-access/store-allow-from.d.ts
/**
 * Read pairing-store allowlist entries when a direct-message policy permits
 * store fallback.
 */
declare function readChannelIngressStoreAllowFromForDmPolicy(params: {
  provider: PairingChannel;
  accountId: string;
  dmPolicy?: string | null;
  shouldRead?: boolean | null;
  readStore?: (provider: PairingChannel, accountId: string) => Promise<string[]>;
}): Promise<string[]>;
//#endregion
//#region src/plugin-sdk/channel-ingress-runtime.d.ts
type ChannelIngressLifecycle = Omit<ChannelIngressMonitorLifecycle, "admission">;
type StandardRawEventPayload = {
  version: 1;
  rawEvent: string;
};
type StandardRawEventAdmission<TInspection> = {
  kind: "invalid";
  message: string;
} | {
  kind: "durable" | (null extends TInspection ? "ignored" : never);
};
type StandardRawEventIngressOptions<TRaw, TMetadata, TInspection> = Omit<CreateChannelIngressMonitorOptions<TRaw, string, StandardRawEventPayload, TMetadata>, "admissionMode" | "drain" | "inspect" | "payload" | "pollIntervalMs" | "retention"> & {
  inspect: (raw: TRaw) => TInspection;
  payload: Omit<ChannelIngressMonitorPayloadCodec<TRaw, string, StandardRawEventPayload, TMetadata>, "storage" | "version">;
  pollIntervalMs?: number;
  drain?: Omit<ChannelIngressMonitorDrainOptions<StandardRawEventPayload, TMetadata>, "startLimit">;
  classifyAdmissionError: (error: unknown) => string | undefined;
};
/** Version-1 raw events, 500 ms polling, eight deliveries, and standard retention. */
declare function createStandardRawEventIngressMonitor<TRaw, TMetadata, TInspection extends ChannelIngressMonitorFacts | null>(options: StandardRawEventIngressOptions<TRaw, TMetadata, TInspection>): {
  receive: (raw: TRaw) => Promise<StandardRawEventAdmission<TInspection>>;
  start: () => void;
  stop: () => Promise<void>;
  waitForIdle: () => Promise<void>;
};
/** Fan one logical inbound turn's ownership lifecycle across its durable claims. */
declare function fanInChannelIngressLifecycles(inputs: readonly (ChannelIngressLifecycle | undefined)[]): {
  lifecycle: ChannelIngressLifecycle | undefined;
  settle: () => Promise<void>;
  abandon: (error?: unknown) => Promise<void>;
  cancel: () => Promise<void>;
};
//#endregion
export { type AccessGroupMembershipFact, type ChannelIngressAccessGroupMembershipResolver, type ChannelIngressCommandPresetInput, type ChannelIngressConfigInput, type ChannelIngressContextBinding, type ChannelIngressDecision, type ChannelIngressEventInput, type ChannelIngressEventPresetInput, type ChannelIngressIdentifierKind, type ChannelIngressIdentityAlias, type ChannelIngressIdentityDescriptor, type ChannelIngressIdentityField, type ChannelIngressIdentitySubjectInput, type ChannelIngressPolicyInput, type ChannelIngressResolver, type ChannelIngressResolverMessageParams, type ChannelIngressRouteAccess, type ChannelIngressRouteDescriptor, type ChannelIngressState, type ChannelIngressStateInput, type ChannelMessageIngressCommandInput, type CreateChannelIngressResolverParams, type IngressReasonCode, type ResolveChannelMessageIngressParams, type ResolveStableChannelMessageIngressParams, type ResolvedChannelImplicitMentions, type ResolvedChannelMessageIngress, type StableChannelIngressIdentityParams, channelIngressRoutes, createChannelIngressResolver, createStandardRawEventIngressMonitor, defineStableChannelIngressIdentity, fanInChannelIngressLifecycles, readChannelIngressStoreAllowFromForDmPolicy, resolveChannelImplicitMentions, resolveChannelMessageIngress, resolveStableChannelMessageIngress };