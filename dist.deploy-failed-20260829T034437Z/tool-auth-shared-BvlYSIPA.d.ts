import "./config-contracts-BoWM1_J1.js";
//#region extensions/xai/src/tool-auth-shared.d.ts
type XaiToolAuthContext = {
  hasAuthForProvider?: (providerId: string) => boolean;
  resolveApiKeyForProvider?: (providerId: string) => Promise<string | undefined>;
};
//#endregion
export { XaiToolAuthContext as t };