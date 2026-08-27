import "./types-336a6ztO.js";
import "./config-C5ZMVTaL.js";
import "./types.core-CECrTHHY.js";
import "./types.adapters-DkCKs5U0.js";
import "./setup-wizard-types-DpF0qLWe.js";
import "./setup-helpers-5LHH8Cll.js";
import "./setup-credential-k-1HfRWv.js";
//#region src/plugin-sdk/resolution-notes.d.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
declare function formatResolvedUnresolvedNote(params: {
  resolved: string[];
  unresolved: string[];
}): string | undefined;
//#endregion
export { formatResolvedUnresolvedNote as t };