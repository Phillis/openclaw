import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import "../../config-contracts-OcWhZue9.js";
//#region extensions/github-copilot/runtime-identity.d.ts
/** Keep catalog and inference identity aligned without forwarding unrelated configured secrets. */
declare function buildCopilotRuntimeHeaders(params?: {
  config?: OpenClawConfig;
  headers?: Record<string, string>;
}): Record<string, string>;
//#endregion
export { buildCopilotRuntimeHeaders };