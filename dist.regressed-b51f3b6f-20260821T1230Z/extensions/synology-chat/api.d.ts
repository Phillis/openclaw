import { P as PluginRuntime } from "../../types-CbXjz50O.js";
import { t as synologyChatPlugin } from "../../channel-BUe3Hrm6.js";
import { t as collectSynologyChatSecurityAuditFindings } from "../../security-audit-BU87MwaA.js";

//#region extensions/synology-chat/src/runtime.d.ts
declare const setSynologyRuntime: (next: PluginRuntime) => void, getSynologyRuntime: () => PluginRuntime;
//#endregion
export { collectSynologyChatSecurityAuditFindings, setSynologyRuntime, synologyChatPlugin };