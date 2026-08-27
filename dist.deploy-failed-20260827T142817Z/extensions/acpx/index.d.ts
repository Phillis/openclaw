import { r as OpenClawPluginApi } from "../../types-7E39v2Gx.js";
//#region extensions/acpx/index.d.ts
declare const plugin: {
  id: string;
  name: string;
  description: string;
  register(api: OpenClawPluginApi): void;
};
//#endregion
export { plugin as default };