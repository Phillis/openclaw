import { t as buildMutableAllowEntryDetector } from "./channel-policy-Dn6aXK3G.js";
//#region extensions/discord/src/security-doctor.ts
const isDiscordMutableAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:\d+|<@!?\d+>|(?:discord|user|pk):.+)$/ });
//#endregion
export { isDiscordMutableAllowEntry as t };
