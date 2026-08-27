import { P as PluginRuntime } from "../../types-R6eI-mj_.js";
import { t as synologyChatPlugin } from "../../channel-waISn6NC.js";
import { t as collectSynologyChatSecurityAuditFindings } from "../../security-audit-BU87MwaA.js";

//#region extensions/synology-chat/src/runtime.d.ts
declare const setSynologyRuntime: (next: PluginRuntime) => void, getSynologyRuntime: () => PluginRuntime;
//#endregion
export { collectSynologyChatSecurityAuditFindings, setSynologyRuntime, synologyChatPlugin };