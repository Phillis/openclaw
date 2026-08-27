import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-contracts-DBboNIpX.js";
//#region extensions/feishu/configured-state.d.ts
/** Feishu owns configured account credentials; ambient variables alone are not an account. */
declare function hasConfiguredFeishuChannelState(params: {
  cfg: OpenClawConfig;
}): boolean;
//#endregion
export { hasConfiguredFeishuChannelState };