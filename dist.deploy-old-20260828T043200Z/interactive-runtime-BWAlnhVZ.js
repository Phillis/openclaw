import { h as reduceLegacyInteractiveReply } from "./payload-C7E4iMOo.js";
//#region src/channels/plugins/outbound/interactive.ts
/**
* Interactive outbound compatibility helpers.
*
* Re-exports presentation adapters and keeps the deprecated interactive reducer available.
*/
/** @deprecated Use MessagePresentation helpers for new rendering paths. */
const reduceInteractiveReply = reduceLegacyInteractiveReply;
//#endregion
export { reduceInteractiveReply as t };
