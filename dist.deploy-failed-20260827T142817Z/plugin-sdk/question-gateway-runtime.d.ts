import { r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { f as readAskUserQuestionId, i as ReplyPayload } from "../reply-payload-D83wzoq7.js";
import { f as MessagePresentation } from "../payload-D0D49c9Y.js";
//#region src/infra/question-channel-runtime.d.ts
declare const registerQuestionChannelDelivery: (params: {
  questionId: string;
  deliveryId: string;
  finalize: (statusLine: string) => void | Promise<void>;
}) => void;
//#endregion
//#region src/infra/question-gateway-resolver.d.ts
type ResolveQuestionOverGatewayResult = {
  status: "answered";
  questionId: string;
  optionValue: string;
} | {
  status: "already-terminal";
  reason: "already-terminal" | "not-found";
};
type ResolveQuestionOverGatewayParams = {
  cfg: OpenClawConfig;
  questionId: string;
  senderId?: string | null;
  gatewayUrl?: string;
  clientDisplayName?: string;
} & ({
  /** Rendered option value carried by the pressed control (reactions). */optionValue: string;
  optionIndex?: never;
} | {
  /** Compact callback index; mapped to the canonical label via question.get. */optionIndex: number;
  optionValue?: never;
});
/** Resolves one rendered option value against the gateway-owned question. */
declare function resolveQuestionOverGateway(params: ResolveQuestionOverGatewayParams): Promise<ResolveQuestionOverGatewayResult>;
//#endregion
//#region src/infra/question-reaction-runtime.d.ts
type QuestionReactionBinding = {
  questionId: string;
  optionValues: string[];
};
declare function readQuestionReactionBinding(payload: Pick<ReplyPayload, "channelData">): QuestionReactionBinding | undefined;
declare function resolveQuestionReactionIndex(reaction: string): number | undefined;
declare function prepareQuestionReactionPayloadForDelivery(params: {
  payload: ReplyPayload;
  presentation?: MessagePresentation;
}): ReplyPayload | null;
declare function resolveQuestionReactionOverGateway(params: ResolveQuestionOverGatewayParams): Promise<ResolveQuestionOverGatewayResult | null>;
//#endregion
//#region src/plugin-sdk/question-gateway-runtime.d.ts
/** Creates one channel-owned target store for numbered ask_user reactions. */
declare function createQuestionReactionTargetStore<TIdentity, TMetadata = undefined>(params: {
  channel: string;
  channelDisplayName: string;
  ttlMs?: number;
  buildKey: (identity: TIdentity) => string | null | undefined;
  identityMatches?: (stored: TMetadata | undefined, incoming: TMetadata | undefined) => boolean;
  registerChannelDelivery?: typeof registerQuestionChannelDelivery;
  resolveReaction?: typeof resolveQuestionReactionOverGateway;
}): {
  register(binding: {
    questionId: string;
    optionValues: string[];
  }, identity: TIdentity, metadata?: TMetadata): boolean;
  has(identities: readonly TIdentity[]): boolean;
  resolve(resolveParams: {
    identities: readonly TIdentity[];
    optionIndex: number;
    cfg: Parameters<typeof resolveQuestionReactionOverGateway>[0]["cfg"];
    senderId: string;
    gatewayUrl?: string;
    metadata?: TMetadata;
    logDebug?: (message: string) => void;
  }): Promise<boolean>;
};
declare const questionGatewayRuntime: {
  resolveOption: typeof resolveQuestionOverGateway;
  reactionEmojis: readonly ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
  prepareReactionPayloadForDelivery: typeof prepareQuestionReactionPayloadForDelivery;
  readAskUserQuestionId: typeof readAskUserQuestionId;
  readReactionBinding: typeof readQuestionReactionBinding;
  resolveReactionIndex: typeof resolveQuestionReactionIndex;
  resolveReaction: typeof resolveQuestionReactionOverGateway;
  registerChannelDelivery: (params: {
    questionId: string;
    deliveryId: string;
    finalize: (statusLine: string) => void | Promise<void>;
  }) => void;
};
//#endregion
export { createQuestionReactionTargetStore, questionGatewayRuntime };