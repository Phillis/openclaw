import type { WebClient } from "@slack/web-api";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import "./access-verify.js";

type AccessClient = Pick<WebClient, "auth" | "conversations">;
type AccessClientOptions = {
  signal: AbortSignal;
  slackApiUrl: "https://slack.com/api/";
  timeout: number;
};

type SlackAccessVerifyTestApi = {
  contractVersion: "openclaw-slack-access-proof/v1";
  slackApiUrl: "https://slack.com/api/";
  verify(params: {
    cfg: OpenClawConfig;
    request: unknown;
    createClient?: (token: string, options: AccessClientOptions) => AccessClient;
  }): Promise<unknown>;
};

function getTestApi(): SlackAccessVerifyTestApi {
  return (globalThis as Record<PropertyKey, unknown>)[
    Symbol.for("openclaw.slackAccessVerifyTestApi")
  ] as SlackAccessVerifyTestApi;
}

export const SLACK_ACCESS_PROOF_CONTRACT_VERSION = getTestApi().contractVersion;
export const SLACK_ACCESS_PROOF_API_URL = getTestApi().slackApiUrl;

export function verifySlackAccess(
  params: Parameters<SlackAccessVerifyTestApi["verify"]>[0],
): Promise<unknown> {
  return getTestApi().verify(params);
}
