//#region extensions/minimax/oauth.d.ts
type MiniMaxRegion = "cn" | "global";
type MiniMaxOAuthToken = {
  access: string;
  refresh: string;
  expires: number;
  resourceUrl?: string;
  notification_message?: string;
};
declare function loginMiniMaxPortalOAuth(params: {
  openUrl: (url: string) => Promise<void>;
  note: (message: string, title?: string) => Promise<void>;
  progress: {
    update: (message: string) => void;
    stop: (message?: string) => void;
  };
  region?: MiniMaxRegion;
  signal?: AbortSignal;
}): Promise<MiniMaxOAuthToken>;
//#endregion
export { MiniMaxRegion, loginMiniMaxPortalOAuth };