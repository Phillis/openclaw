import { r as matrixSetupAdapter, t as matrixOnboardingAdapter } from "../../setup-surface-BlPZcBr-.js";

//#region extensions/matrix/src/setup-contract.d.ts
declare const singleAccountKeysToMove: ("homeserver" | "userId" | "accessToken" | "password" | "deviceName" | "avatarUrl" | "initialSyncLimit" | "deviceId" | "responsePrefix" | "dangerouslyAllowNameMatching" | "streaming" | "mediaMaxMb" | "replyToMode" | "textChunkLimit" | "groups" | "actions" | "dm" | "encryption" | "allowlistOnly" | "allowBots" | "threadReplies" | "ackReaction" | "ackReactionScope" | "reactionNotifications" | "threadBindings" | "startupVerification" | "startupVerificationCooldownHours" | "autoJoin" | "autoJoinAllowlist" | "rooms")[];
declare const namedAccountPromotionKeys: ("name" | "homeserver" | "userId" | "accessToken" | "password" | "deviceName" | "avatarUrl" | "initialSyncLimit" | "deviceId" | "encryption")[];
declare function resolveSingleAccountPromotionTarget(params: {
  channel: Record<string, unknown>;
}): string;
//#endregion
export { matrixSetupAdapter, matrixOnboardingAdapter as matrixSetupWizard, namedAccountPromotionKeys, resolveSingleAccountPromotionTarget, singleAccountKeysToMove };