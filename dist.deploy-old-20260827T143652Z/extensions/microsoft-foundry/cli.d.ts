import { AzAccessToken, AzAccount } from "./shared.js";

//#region extensions/microsoft-foundry/cli.d.ts
declare function execAz(args: string[]): string;
declare function isAzCliInstalled(): boolean;
declare function getLoggedInAccount(): AzAccount | null;
declare function listSubscriptions(): AzAccount[];
type AccessTokenParams = {
  scope?: string;
  subscriptionId?: string;
  tenantId?: string;
};
declare function getAccessTokenResult(params?: AccessTokenParams): AzAccessToken;
declare function getAccessTokenResultAsync(params?: AccessTokenParams): Promise<AzAccessToken>;
declare function azLoginDeviceCode(): Promise<void>;
declare function azLoginDeviceCodeWithOptions(params: {
  tenantId?: string;
  allowNoSubscriptions?: boolean;
}): Promise<void>;
//#endregion
export { azLoginDeviceCode, azLoginDeviceCodeWithOptions, execAz, getAccessTokenResult, getAccessTokenResultAsync, getLoggedInAccount, isAzCliInstalled, listSubscriptions };