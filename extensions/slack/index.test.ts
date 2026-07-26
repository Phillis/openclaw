// Slack tests cover index plugin behavior.
import { assertBundledChannelEntries } from "openclaw/plugin-sdk/channel-test-helpers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import entry from "./index.js";
import setupEntry from "./setup-entry.js";

const httpRegistryMocks = vi.hoisted(() => ({
  handleSlackHttpRequest: vi.fn(async () => true),
}));
const slackClientMocks = vi.hoisted(() => ({
  authTest: vi.fn(),
  conversationsInfo: vi.fn(),
  conversationsHistory: vi.fn(),
  createSlackLookupClient: vi.fn(),
}));

vi.mock("./src/http/registry.js", () => ({
  handleSlackHttpRequest: httpRegistryMocks.handleSlackHttpRequest,
}));

vi.mock("./src/client.js", () => ({
  createSlackLookupClient: slackClientMocks.createSlackLookupClient,
}));

beforeEach(() => {
  slackClientMocks.authTest.mockReset().mockResolvedValue({
    ok: true,
    user_id: "U12345678",
    bot_id: "B12345678",
    team_id: "T12345678",
  });
  slackClientMocks.conversationsInfo.mockReset().mockResolvedValue({
    ok: true,
    channel: { id: "C12345678", name: "must-not-escape" },
  });
  slackClientMocks.conversationsHistory.mockReset().mockResolvedValue({
    ok: true,
    messages: [{ text: "must-not-escape", ts: "1.000001" }],
  });
  slackClientMocks.createSlackLookupClient.mockReset().mockReturnValue({
    auth: { test: slackClientMocks.authTest },
    conversations: {
      info: slackClientMocks.conversationsInfo,
      history: slackClientMocks.conversationsHistory,
    },
  });
});

describe("slack bundled entries", () => {
  assertBundledChannelEntries({
    entry,
    expectedId: "slack",
    expectedName: "Slack",
    setupEntry,
  });

  it("registers webhook routes through the full channel entry", async () => {
    const registerHttpRoute = vi.fn();
    const registerGatewayMethod = vi.fn();
    entry.register({
      registrationMode: "tool-discovery",
      config: {
        channels: {
          slack: {
            webhookPath: "/slack/root",
            accounts: {
              default: { webhookPath: "/slack/default" },
              ops: { webhookPath: "hooks/ops" },
            },
          },
        },
      },
      registerHttpRoute,
      registerGatewayMethod,
    } as never);

    expect(registerHttpRoute.mock.calls.map((call) => call[0].path)).toEqual([
      "/hooks/ops",
      "/slack/default",
    ]);
    expect(httpRegistryMocks.handleSlackHttpRequest).not.toHaveBeenCalled();
    expect(registerGatewayMethod).toHaveBeenCalledOnce();
    expect(registerGatewayMethod.mock.calls[0]?.[0]).toBe("slack.access.verify");
    expect(registerGatewayMethod.mock.calls[0]?.[2]).toEqual({ scope: "operator.read" });

    const handler = registerHttpRoute.mock.calls[0]?.[0].handler;
    await handler?.({ url: "/hooks/ops" }, {});
    expect(httpRegistryMocks.handleSlackHttpRequest).toHaveBeenCalledOnce();
  });

  it("uses the root Slack webhook path when the default account does not override it", () => {
    const registerHttpRoute = vi.fn();
    const registerGatewayMethod = vi.fn();
    entry.register({
      registrationMode: "tool-discovery",
      config: {
        channels: {
          slack: {
            webhookPath: "/slack/root",
            accounts: {
              ops: { webhookPath: "hooks/ops" },
            },
          },
        },
      },
      registerHttpRoute,
      registerGatewayMethod,
    } as never);

    expect(registerHttpRoute.mock.calls.map((call) => call[0].path)).toEqual([
      "/hooks/ops",
      "/slack/root",
    ]);
    expect(registerGatewayMethod).toHaveBeenCalledWith(
      "slack.access.verify",
      expect.any(Function),
      { scope: "operator.read" },
    );
  });

  it("lazily invokes the proof with the current runtime-materialized named credential", async () => {
    const registerGatewayMethod = vi.fn();
    entry.register({
      registrationMode: "tool-discovery",
      config: {
        channels: {
          slack: {
            accounts: {
              oscar: {
                botToken: {
                  source: "env",
                  provider: "default",
                  id: "OSCAR_SLACK_BOT_TOKEN",
                },
              },
            },
          },
        },
      },
      registerHttpRoute: vi.fn(),
      registerGatewayMethod,
    } as never);

    const handler = registerGatewayMethod.mock.calls[0]?.[1];
    const respond = vi.fn();
    const getRuntimeConfig = vi.fn(() => ({
      channels: {
        slack: {
          accounts: {
            default: { botToken: "xoxb-default-must-not-be-used" },
            oscar: { botToken: "xoxb-runtime-materialized-secret" },
          },
        },
      },
    }));
    await handler?.({
      params: {
        contractVersion: "openclaw-slack-access-proof/v1",
        accountId: "oscar",
        credentialKind: "bot",
        expectedUserId: "U12345678",
        expectedBotId: "B12345678",
        expectedTeamId: "T12345678",
        channelId: "C12345678",
        expectedApiUrl: "https://slack.com/api/",
      },
      context: { getRuntimeConfig },
      respond,
    });

    expect(getRuntimeConfig).toHaveBeenCalledOnce();
    expect(slackClientMocks.createSlackLookupClient).toHaveBeenCalledOnce();
    expect(slackClientMocks.createSlackLookupClient).toHaveBeenCalledWith(
      "xoxb-runtime-materialized-secret",
      {
        requestInterceptor: expect.any(Function),
        slackApiUrl: "https://slack.com/api/",
        timeout: 30_000,
      },
    );
    const requestInterceptor =
      slackClientMocks.createSlackLookupClient.mock.calls[0]?.[1]?.requestInterceptor;
    const intercepted = await requestInterceptor?.({});
    expect(intercepted?.signal).toEqual(expect.any(AbortSignal));
    expect(intercepted?.signal.aborted).toBe(false);
    expect(slackClientMocks.authTest).toHaveBeenCalledOnce();
    expect(slackClientMocks.conversationsInfo).toHaveBeenCalledWith({
      channel: "C12345678",
    });
    expect(slackClientMocks.conversationsHistory).toHaveBeenCalledWith({
      channel: "C12345678",
      limit: 1,
    });
    expect(respond).toHaveBeenCalledWith(
      true,
      expect.objectContaining({
        ok: true,
        requested: expect.objectContaining({ accountId: "oscar" }),
        resolved: expect.objectContaining({
          accountId: "oscar",
          credentialSource: "account",
          apiUrl: "https://slack.com/api/",
        }),
        auth: {
          userId: "U12345678",
          botId: "B12345678",
          teamId: "T12345678",
        },
      }),
    );
    const serialized = JSON.stringify(respond.mock.calls);
    expect(serialized).not.toContain("xoxb-runtime-materialized-secret");
    expect(serialized).not.toContain("OSCAR_SLACK_BOT_TOKEN");
    expect(serialized).not.toContain("must-not-escape");
    expect(serialized).not.toContain("1.000001");
  });

  it("registers webhook routes through the setup-runtime entry", () => {
    const registerHttpRoute = vi.fn();
    const registerGatewayMethod = vi.fn();
    setupEntry.registerSetupRuntime?.({
      registrationMode: "setup-runtime",
      config: {
        channels: {
          slack: {
            webhookPath: "/slack/root",
            accounts: {
              default: { webhookPath: "/slack/default" },
              ops: { webhookPath: "hooks/ops" },
            },
          },
        },
      },
      registerHttpRoute,
      registerGatewayMethod,
    } as never);

    expect(registerHttpRoute.mock.calls.map((call) => call[0].path)).toEqual([
      "/hooks/ops",
      "/slack/default",
    ]);
    expect(registerGatewayMethod).not.toHaveBeenCalled();
  });
});
