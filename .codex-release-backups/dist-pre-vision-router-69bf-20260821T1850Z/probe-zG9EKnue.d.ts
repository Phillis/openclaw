import { h as TelegramNetworkConfig } from "./types.openclaw-DhIzMzKO.js";
import { N as BaseProbeResult } from "./types.adapters-BxgsWXLj.js";
import { UserFromGetMe } from "grammy/types";

//#region extensions/telegram/src/bot-info.d.ts
type TelegramBotInfo = UserFromGetMe;
//#endregion
//#region extensions/telegram/src/probe.d.ts
type TelegramProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs: number;
  bot?: {
    id?: number | null;
    isBot?: boolean | null;
    firstName?: string | null;
    username?: string | null;
    canJoinGroups?: boolean | null;
    canReadAllGroupMessages?: boolean | null;
    canManageBots?: boolean | null;
    supportsInlineQueries?: boolean | null;
    canConnectToBusiness?: boolean | null;
    hasMainWebApp?: boolean | null;
    hasTopicsEnabled?: boolean | null;
    allowsUsersToCreateTopics?: boolean | null;
  };
  botInfo?: TelegramBotInfo;
  webhook?: {
    url?: string | null;
    hasCustomCert?: boolean | null;
  };
};
type TelegramProbeOptions = {
  proxyUrl?: string;
  network?: TelegramNetworkConfig;
  accountId?: string;
  apiRoot?: string;
  includeWebhookInfo?: boolean;
  abortSignal?: AbortSignal;
};
declare function resetTelegramProbeFetcherCacheForTests(): void;
declare function probeTelegram(token: string, timeoutMs: number, proxyOrOptions?: string | TelegramProbeOptions): Promise<TelegramProbe>;
//#endregion
export { TelegramBotInfo as a, resetTelegramProbeFetcherCacheForTests as i, TelegramProbeOptions as n, probeTelegram as r, TelegramProbe as t };