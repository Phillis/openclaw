import { t as buildMutableAllowEntryDetector } from "./channel-policy-CPq0cbRz.js";
//#region extensions/discord/src/security-doctor.ts
const isDiscordMutableAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:\d+|<@!?\d+>|(?:discord|user|pk):.+)$/ });
//#endregion
export { isDiscordMutableAllowEntry as t };
