// Slack access-verification tests cover exact account, credential, identity, and channel binding.
import { performance } from "node:perf_hooks";
import type { WebClient } from "@slack/web-api";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { ErrorCodes } from "openclaw/plugin-sdk/gateway-runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  handleSlackAccessVerify,
  SLACK_ACCESS_PROOF_API_URL,
  SLACK_ACCESS_PROOF_CONTRACT_VERSION,
  verifySlackAccess,
} from "./access-verify.js";

const BOT_TOKEN = "xoxb-oscar-secret";
const USER_TOKEN = "xoxp-human-secret";
const CHANNEL_ID = "C12345678";
const USER_ID = "U12345678";
const BOT_ID = "B12345678";
const TEAM_ID = "T12345678";

type AccessClient = Pick<WebClient, "auth" | "conversations">;
type AccessClientOptions = {
  signal: AbortSignal;
  slackApiUrl: typeof SLACK_ACCESS_PROOF_API_URL;
  timeout: number;
};

function expectedClientOptions(timeout = 30_000) {
  return {
    signal: expect.any(AbortSignal),
    slackApiUrl: SLACK_ACCESS_PROOF_API_URL,
    timeout,
  };
}

function botRequest(overrides: Record<string, unknown> = {}) {
  return {
    contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
    accountId: "oscar",
    credentialKind: "bot",
    expectedUserId: USER_ID,
    expectedBotId: BOT_ID,
    expectedTeamId: TEAM_ID,
    channelId: CHANNEL_ID,
    expectedApiUrl: SLACK_ACCESS_PROOF_API_URL,
    ...overrides,
  };
}

function namedBotConfig(overrides: Record<string, unknown> = {}): OpenClawConfig {
  return {
    channels: {
      slack: {
        botToken: "xoxb-root-must-not-be-used",
        accounts: {
          oscar: {
            postAs: "bot",
            botToken: BOT_TOKEN,
            ...overrides,
          },
        },
      },
    },
  } as OpenClawConfig;
}

function createClient(params?: {
  auth?: Record<string, unknown> | Error;
  info?: Record<string, unknown> | Error;
  history?: Record<string, unknown> | Error;
  order?: string[];
}) {
  const call = async (name: string, value: Record<string, unknown> | Error) => {
    params?.order?.push(name);
    if (value instanceof Error) {
      throw value;
    }
    return value;
  };
  const client = {
    auth: {
      test: vi.fn(
        async () =>
          await call(
            "auth.test",
            params?.auth ?? {
              ok: true,
              user_id: USER_ID,
              bot_id: BOT_ID,
              team_id: TEAM_ID,
            },
          ),
      ),
    },
    conversations: {
      info: vi.fn(
        async () =>
          await call(
            "conversations.info",
            params?.info ?? {
              ok: true,
              channel: { id: CHANNEL_ID, name: "must-not-escape" },
            },
          ),
      ),
      history: vi.fn(
        async () =>
          await call(
            "conversations.history",
            params?.history ?? {
              ok: true,
              messages: [{ text: "must-not-escape", ts: "1.000001" }],
              has_more: true,
            },
          ),
      ),
    },
  } as unknown as AccessClient;
  return client;
}

async function verify(params?: {
  cfg?: OpenClawConfig;
  request?: unknown;
  client?: AccessClient;
  createClient?: (token: string, options: AccessClientOptions) => AccessClient;
}) {
  const client = params?.client ?? createClient();
  const createClientMock =
    params?.createClient ?? vi.fn((_token: string, _options: AccessClientOptions) => client);
  const verification = await verifySlackAccess({
    cfg: params?.cfg ?? namedBotConfig(),
    request: params?.request ?? botRequest(),
    createClient: createClientMock,
  });
  return { verification, client, createClientMock };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("verifySlackAccess", () => {
  it("binds one named bot credential to auth, exact channel info, and read access", async () => {
    const order: string[] = [];
    const client = createClient({ order });
    const { verification, createClientMock } = await verify({ client });

    expect(verification).toEqual({
      ok: true,
      result: {
        contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
        ok: true,
        requested: {
          accountId: "oscar",
          credentialKind: "bot",
          channelId: CHANNEL_ID,
          identity: {
            userId: USER_ID,
            botId: BOT_ID,
            teamId: TEAM_ID,
          },
          apiUrl: SLACK_ACCESS_PROOF_API_URL,
        },
        resolved: {
          accountId: "oscar",
          credentialKind: "bot",
          credentialSource: "account",
          channelId: CHANNEL_ID,
          apiUrl: SLACK_ACCESS_PROOF_API_URL,
        },
        auth: {
          userId: USER_ID,
          botId: BOT_ID,
          teamId: TEAM_ID,
        },
        access: {
          operation: "read",
          performedWrites: false,
          method: "conversations.history",
          limit: 1,
          channelInfoVerified: true,
          historyVerified: true,
          sameCredentialForIdentityAndAccess: true,
        },
      },
    });
    expect(createClientMock).toHaveBeenCalledOnce();
    expect(createClientMock).toHaveBeenCalledWith(BOT_TOKEN, expectedClientOptions());
    expect(order).toEqual(["auth.test", "conversations.info", "conversations.history"]);
    expect(client.conversations.info).toHaveBeenCalledWith({ channel: CHANNEL_ID });
    expect(client.conversations.history).toHaveBeenCalledWith({
      channel: CHANNEL_ID,
      limit: 1,
    });
    const serialized = JSON.stringify(verification);
    expect(serialized).not.toContain(BOT_TOKEN);
    expect(serialized).not.toContain("must-not-escape");
    expect(serialized).not.toContain("1.000001");
  });

  it("accepts empty history as proven read access", async () => {
    const { verification } = await verify({
      client: createClient({ history: { ok: true, messages: [] } }),
    });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: true,
        access: {
          historyVerified: true,
          limit: 1,
        },
      },
    });
  });

  it("binds an explicitly selected named user credential without a bot identity", async () => {
    const cfg = {
      channels: {
        slack: {
          accounts: {
            human: {
              postAs: "bot",
              userToken: USER_TOKEN,
            },
          },
        },
      },
    } as OpenClawConfig;
    const request = botRequest({
      accountId: "human",
      credentialKind: "user",
      expectedBotId: null,
    });
    const client = createClient({
      auth: {
        ok: true,
        user_id: USER_ID,
        team_id: TEAM_ID,
      },
    });
    const { verification, createClientMock } = await verify({ cfg, request, client });

    expect(createClientMock).toHaveBeenCalledWith(USER_TOKEN, expectedClientOptions());
    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: true,
        resolved: {
          accountId: "human",
          credentialKind: "user",
          credentialSource: "account",
        },
        auth: {
          userId: USER_ID,
          botId: null,
          teamId: TEAM_ID,
        },
      },
    });
  });

  it("does not let root posting identity block a named account-owned bot credential", async () => {
    const cfg = {
      channels: {
        slack: {
          postAs: "user",
          accounts: {
            oscar: {
              botToken: BOT_TOKEN,
            },
          },
        },
      },
    } as OpenClawConfig;
    const { verification, createClientMock } = await verify({ cfg });

    expect(createClientMock).toHaveBeenCalledWith(BOT_TOKEN, expectedClientOptions());
    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: true,
        resolved: {
          accountId: "oscar",
          credentialKind: "bot",
        },
      },
    });
  });

  it("selects exactly one requested own credential when a named account owns both", async () => {
    const cfg = {
      channels: {
        slack: {
          accounts: {
            oscar: {
              botToken: BOT_TOKEN,
              userToken: USER_TOKEN,
            },
          },
        },
      },
    } as OpenClawConfig;
    const bot = await verify({ cfg });
    expect(bot.createClientMock).toHaveBeenCalledWith(BOT_TOKEN, expectedClientOptions());

    const user = await verify({
      cfg,
      request: botRequest({
        credentialKind: "user",
        expectedBotId: null,
      }),
      client: createClient({
        auth: { ok: true, user_id: USER_ID, team_id: TEAM_ID },
      }),
    });
    expect(user.createClientMock).toHaveBeenCalledWith(USER_TOKEN, expectedClientOptions());
  });

  it.each([
    ["user", { expectedUserId: "U87654321" }],
    ["bot", { expectedBotId: "B87654321" }],
    ["team", { expectedTeamId: "T87654321" }],
  ])(
    "rejects an observed %s identity that differs from the expected binding",
    async (_name, id) => {
      const client = createClient();
      const { verification } = await verify({
        request: botRequest(id),
        client,
      });

      expect(verification).toMatchObject({
        ok: true,
        result: {
          ok: false,
          failure: { stage: "auth", code: "identity_mismatch" },
        },
      });
      expect(client.conversations.info).not.toHaveBeenCalled();
      expect(client.conversations.history).not.toHaveBeenCalled();
    },
  );

  it("rejects channel substitution before reading history", async () => {
    const client = createClient({
      info: {
        ok: true,
        channel: { id: "C87654321" },
      },
    });
    const { verification } = await verify({ client });

    expect(verification).toEqual({
      ok: true,
      result: {
        contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
        ok: false,
        failure: { stage: "info", code: "channel_mismatch" },
      },
    });
    expect(client.conversations.history).not.toHaveBeenCalled();
  });

  it("fails closed when history access is rejected", async () => {
    const rawProviderError = new Error(
      `not_in_channel token=${BOT_TOKEN} text=must-not-escape scopes=channels:history`,
    );
    const { verification } = await verify({
      client: createClient({ history: rawProviderError }),
    });

    expect(verification).toEqual({
      ok: true,
      result: {
        contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
        ok: false,
        failure: { stage: "history", code: "provider_rejected" },
      },
    });
    const serialized = JSON.stringify(verification);
    expect(serialized).not.toContain(BOT_TOKEN);
    expect(serialized).not.toContain("must-not-escape");
    expect(serialized).not.toContain("channels:history");
  });

  it("never falls back from a named account to root, environment, or another credential kind", async () => {
    vi.stubEnv("SLACK_BOT_TOKEN", "xoxb-env-must-not-be-used");
    const cfg = {
      channels: {
        slack: {
          botToken: "xoxb-root-must-not-be-used",
          accounts: {
            oscar: {
              postAs: "bot",
              userToken: "xoxp-other-kind-must-not-be-used",
            },
          },
        },
      },
    } as OpenClawConfig;
    const { verification, createClientMock } = await verify({ cfg });

    expect(verification).toEqual({
      ok: true,
      result: {
        contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
        ok: false,
        failure: { stage: "credential", code: "credential_unavailable" },
      },
    });
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it.each([
    {
      name: "account",
      cfg: {
        channels: {
          slack: {
            botToken: "xoxb-root-must-not-be-used",
            accounts: {
              default: { postAs: "bot", botToken: "xoxb-default-account" },
            },
          },
        },
      } as OpenClawConfig,
      env: "xoxb-env-must-not-be-used",
      expectedToken: "xoxb-default-account",
    },
    {
      name: "root",
      cfg: {
        channels: {
          slack: {
            postAs: "bot",
            botToken: "xoxb-default-root",
          },
        },
      } as OpenClawConfig,
      env: "xoxb-env-must-not-be-used",
      expectedToken: "xoxb-default-root",
    },
    {
      name: "env",
      cfg: {
        channels: {
          slack: {
            postAs: "bot",
          },
        },
      } as OpenClawConfig,
      env: "xoxb-default-env",
      expectedToken: "xoxb-default-env",
    },
  ])("reports the exact explicit default credential source: $name", async (testCase) => {
    vi.stubEnv("SLACK_BOT_TOKEN", testCase.env);
    const { verification, createClientMock } = await verify({
      cfg: testCase.cfg,
      request: botRequest({ accountId: "default" }),
    });

    expect(createClientMock).toHaveBeenCalledWith(testCase.expectedToken, expectedClientOptions());
    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: true,
        resolved: {
          accountId: "default",
          credentialSource: testCase.name,
        },
      },
    });
  });

  it("supports the standard environment-only implicit default account", async () => {
    vi.stubEnv("SLACK_BOT_TOKEN", "xoxb-implicit-default-env");
    const { verification, createClientMock } = await verify({
      cfg: {},
      request: botRequest({ accountId: "default" }),
    });

    expect(createClientMock).toHaveBeenCalledWith(
      "xoxb-implicit-default-env",
      expectedClientOptions(),
    );
    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: true,
        resolved: {
          accountId: "default",
          credentialSource: "env",
        },
      },
    });
  });

  it("rejects normalized account collisions without selecting either credential", async () => {
    const cfg = {
      channels: {
        slack: {
          accounts: {
            oscar: { postAs: "bot", botToken: BOT_TOKEN },
            OSCAR: { postAs: "bot", botToken: "xoxb-collision" },
          },
        },
      },
    } as OpenClawConfig;
    const { verification, createClientMock } = await verify({ cfg });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: false,
        failure: { stage: "account", code: "ambiguous_account" },
      },
    });
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("rejects disabled and missing named accounts", async () => {
    const disabled = await verify({
      cfg: namedBotConfig({ enabled: false }),
    });
    expect(disabled.verification).toMatchObject({
      ok: true,
      result: { ok: false, failure: { stage: "account", code: "disabled" } },
    });

    const missing = await verify({
      cfg: { channels: { slack: { accounts: {} } } } as OpenClawConfig,
    });
    expect(missing.verification).toMatchObject({
      ok: true,
      result: { ok: false, failure: { stage: "account", code: "not_configured" } },
    });
  });

  it.each([
    {
      name: "named account",
      cfg: namedBotConfig({ enterpriseOrgInstall: true }),
    },
    {
      name: "inherited root setting",
      cfg: {
        channels: {
          slack: {
            enterpriseOrgInstall: true,
            accounts: {
              oscar: { botToken: BOT_TOKEN },
            },
          },
        },
      } as OpenClawConfig,
    },
    {
      name: "default root setting",
      cfg: {
        channels: {
          slack: {
            enterpriseOrgInstall: true,
            botToken: BOT_TOKEN,
          },
        },
      } as OpenClawConfig,
      request: botRequest({ accountId: "default" }),
    },
  ])("rejects a configured Enterprise Grid org installation: $name", async ({ cfg, request }) => {
    const { verification, createClientMock } = await verify({ cfg, request });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: false,
        failure: { stage: "account", code: "unsupported_installation" },
      },
    });
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("rejects an Enterprise Grid org installation reported by auth.test", async () => {
    const client = createClient({
      auth: {
        ok: true,
        user_id: USER_ID,
        bot_id: BOT_ID,
        team_id: TEAM_ID,
        enterprise_id: "E12345678",
        is_enterprise_install: true,
      },
    });
    const { verification } = await verify({ client });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: false,
        failure: { stage: "auth", code: "unsupported_installation" },
      },
    });
    expect(client.conversations.info).not.toHaveBeenCalled();
    expect(client.conversations.history).not.toHaveBeenCalled();
  });

  it.each([
    ["string", "true"],
    ["number", 1],
    ["null", null],
  ])(
    "rejects a malformed Enterprise-install flag before channel access: %s",
    async (_name, isEnterpriseInstall) => {
      const client = createClient({
        auth: {
          ok: true,
          user_id: USER_ID,
          bot_id: BOT_ID,
          team_id: TEAM_ID,
          is_enterprise_install: isEnterpriseInstall,
        },
      });
      const { verification } = await verify({ client });

      expect(verification).toMatchObject({
        ok: true,
        result: {
          ok: false,
          failure: {
            stage: "auth",
            code: "malformed_response",
          },
        },
      });
      expect(client.conversations.info).not.toHaveBeenCalled();
      expect(client.conversations.history).not.toHaveBeenCalled();
    },
  );

  it("rejects unresolved SecretRefs without disclosing their identifiers", async () => {
    const cfg = namedBotConfig({
      botToken: {
        source: "env",
        provider: "default",
        id: "OSCAR_SLACK_SECRET",
      },
    });
    const { verification, createClientMock } = await verify({ cfg });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: false,
        failure: { stage: "credential", code: "credential_unavailable" },
      },
    });
    expect(JSON.stringify(verification)).not.toContain("OSCAR_SLACK_SECRET");
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it.each([
    {
      name: "missing user",
      auth: { ok: true, bot_id: BOT_ID, team_id: TEAM_ID },
      code: "identity_incomplete",
    },
    {
      name: "missing team",
      auth: { ok: true, user_id: USER_ID, bot_id: BOT_ID },
      code: "identity_incomplete",
    },
    {
      name: "bot credential answered by a user token",
      auth: { ok: true, user_id: USER_ID, team_id: TEAM_ID },
      code: "identity_kind_mismatch",
    },
  ])("rejects incomplete or substituted auth identity: $name", async ({ auth, code }) => {
    const client = createClient({ auth });
    const { verification } = await verify({ client });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: false,
        failure: { stage: "auth", code },
      },
    });
    expect(client.conversations.info).not.toHaveBeenCalled();
    expect(client.conversations.history).not.toHaveBeenCalled();
  });

  it("rejects a bot token returned for an explicitly selected user credential", async () => {
    const cfg = {
      channels: {
        slack: {
          accounts: {
            human: { postAs: "user", userToken: USER_TOKEN },
          },
        },
      },
    } as OpenClawConfig;
    const { verification, client } = await verify({
      cfg,
      request: botRequest({
        accountId: "human",
        credentialKind: "user",
        expectedBotId: null,
      }),
      client: createClient({
        auth: {
          ok: true,
          user_id: USER_ID,
          bot_id: BOT_ID,
          team_id: TEAM_ID,
        },
      }),
    });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: false,
        failure: { stage: "auth", code: "identity_kind_mismatch" },
      },
    });
    expect(client.conversations.info).not.toHaveBeenCalled();
  });

  it.each([
    ["missing messages", { ok: true }],
    [
      "more than the requested limit",
      {
        ok: true,
        messages: [{ ts: "1.1" }, { ts: "1.2" }],
      },
    ],
  ])("rejects malformed history responses: %s", async (_name, history) => {
    const { verification } = await verify({
      client: createClient({ history }),
    });

    expect(verification).toMatchObject({
      ok: true,
      result: {
        ok: false,
        failure: { stage: "history", code: "malformed_response" },
      },
    });
  });

  it.each([
    ["missing account", { ...botRequest(), accountId: undefined }],
    ["noncanonical account", botRequest({ accountId: "Oscar" })],
    ["missing contract", { ...botRequest(), contractVersion: undefined }],
    ["wrong contract", botRequest({ contractVersion: "openclaw-slack-access-proof/v2" })],
    ["missing expected user", { ...botRequest(), expectedUserId: undefined }],
    ["missing expected team", { ...botRequest(), expectedTeamId: undefined }],
    ["missing provider URL", { ...botRequest(), expectedApiUrl: undefined }],
    ["alternate provider URL", botRequest({ expectedApiUrl: "https://slack.invalid/api/" })],
    ["bot without expected bot", botRequest({ expectedBotId: null })],
    ["user with expected bot", botRequest({ credentialKind: "user", expectedBotId: BOT_ID })],
    ["lowercase channel", botRequest({ channelId: "c12345678" })],
    ["unknown key", botRequest({ unexpected: true })],
    ["undersized timeout", botRequest({ totalTimeoutMs: 0 })],
    ["oversized timeout", botRequest({ totalTimeoutMs: 30_001 })],
  ])("rejects malformed input before credential or provider access: %s", async (_name, request) => {
    const { verification, createClientMock } = await verify({ request });

    expect(verification).toEqual({ ok: false, error: "invalid_request" });
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("binds the official Slack API target and gives the client the total deadline", async () => {
    vi.stubEnv("SLACK_API_URL", "https://attacker.invalid/api/");
    const { createClientMock } = await verify({
      request: botRequest({ totalTimeoutMs: 7500 }),
    });

    expect(createClientMock).toHaveBeenCalledWith(BOT_TOKEN, expectedClientOptions(7500));
    expect(createClientMock).toHaveBeenCalledOnce();
  });

  it("fails closed when the complete proof exceeds its total wall-clock deadline", async () => {
    vi.useFakeTimers();
    let observedSignal: AbortSignal | undefined;
    const client = {
      auth: {
        test: vi.fn(
          async () =>
            await new Promise<never>(() => {
              // Intentionally unresolved until the verifier's deadline aborts the request.
            }),
        ),
      },
      conversations: {
        info: vi.fn(),
        history: vi.fn(),
      },
    } as unknown as AccessClient;

    const pending = verify({
      client,
      request: botRequest({ totalTimeoutMs: 25 }),
      createClient: (_token, options) => {
        observedSignal = options.signal;
        return client;
      },
    });
    await vi.advanceTimersByTimeAsync(25);

    const completed = await pending;
    expect(completed.verification).toEqual({
      ok: true,
      result: {
        contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
        ok: false,
        failure: { stage: "deadline", code: "deadline_exceeded" },
      },
    });
    expect(observedSignal?.aborted).toBe(true);
    expect(client.conversations.info).not.toHaveBeenCalled();
    expect(client.conversations.history).not.toHaveBeenCalled();
  });

  it("does not enlarge the total deadline when the wall clock moves backward", async () => {
    vi.useFakeTimers();
    vi.spyOn(Date, "now").mockReturnValueOnce(1_000).mockReturnValue(900);
    const client = {
      auth: {
        test: vi.fn(
          async () =>
            await new Promise<never>(() => {
              // The monotonic verifier deadline must settle this operation.
            }),
        ),
      },
      conversations: {
        info: vi.fn(),
        history: vi.fn(),
      },
    } as unknown as AccessClient;

    const pending = verify({
      client,
      request: botRequest({ totalTimeoutMs: 5 }),
    });
    await vi.advanceTimersByTimeAsync(5);

    await expect(pending).resolves.toMatchObject({
      verification: {
        ok: true,
        result: {
          ok: false,
          failure: {
            stage: "deadline",
            code: "deadline_exceeded",
          },
        },
      },
    });
  });

  it("applies one deadline across cumulative sequential Slack operations", async () => {
    vi.useFakeTimers();
    const delayed = async <T>(value: T): Promise<T> =>
      await new Promise<T>((resolve) => {
        setTimeout(() => resolve(value), 10);
      });
    const client = {
      auth: {
        test: vi.fn(
          async () =>
            await delayed({
              ok: true,
              user_id: USER_ID,
              bot_id: BOT_ID,
              team_id: TEAM_ID,
            }),
        ),
      },
      conversations: {
        info: vi.fn(
          async () =>
            await delayed({
              ok: true,
              channel: { id: CHANNEL_ID },
            }),
        ),
        history: vi.fn(
          async () =>
            await delayed({
              ok: true,
              messages: [],
            }),
        ),
      },
    } as unknown as AccessClient;

    const pending = verify({
      client,
      request: botRequest({ totalTimeoutMs: 25 }),
    });
    await vi.advanceTimersByTimeAsync(25);

    await expect(pending).resolves.toMatchObject({
      verification: {
        ok: true,
        result: {
          ok: false,
          failure: {
            stage: "deadline",
            code: "deadline_exceeded",
          },
        },
      },
    });
    expect(client.auth.test).toHaveBeenCalledOnce();
    expect(client.conversations.info).toHaveBeenCalledOnce();
    expect(client.conversations.history).toHaveBeenCalledOnce();
  });

  it("rejects a successful proof completed after the deadline before the timer callback runs", async () => {
    vi.useFakeTimers();
    let monotonicRead = 0;
    const performanceNow = vi.spyOn(performance, "now").mockImplementation(() => {
      monotonicRead += 1;
      // Start, timer setup, auth, and channel-info complete in budget.
      // The history provider await is the first overdue point.
      return monotonicRead <= 7 ? 1_000 : 1_006;
    });

    try {
      const { verification, client } = await verify({
        request: botRequest({ totalTimeoutMs: 5 }),
      });

      expect(verification).toEqual({
        ok: true,
        result: {
          contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
          ok: false,
          failure: { stage: "deadline", code: "deadline_exceeded" },
        },
      });
      expect(client.auth.test).toHaveBeenCalledOnce();
      expect(client.conversations.info).toHaveBeenCalledOnce();
      expect(client.conversations.history).toHaveBeenCalledOnce();
    } finally {
      performanceNow.mockRestore();
    }
  });

  it("rejects a successful provider result that waits past the deadline before final admission", async () => {
    vi.useFakeTimers();
    let monotonicRead = 0;
    const performanceNow = vi.spyOn(performance, "now").mockImplementation(() => {
      monotonicRead += 1;
      // All provider awaits and the operation's completion check finish in
      // budget. The final Promise.race continuation observes the delay.
      return monotonicRead <= 9 ? 1_000 : 1_022;
    });

    try {
      const { verification, client } = await verify({
        request: botRequest({ totalTimeoutMs: 5 }),
      });

      expect(verification).toEqual({
        ok: true,
        result: {
          contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
          ok: false,
          failure: { stage: "deadline", code: "deadline_exceeded" },
        },
      });
      expect(client.auth.test).toHaveBeenCalledOnce();
      expect(client.conversations.info).toHaveBeenCalledOnce();
      expect(client.conversations.history).toHaveBeenCalledOnce();
    } finally {
      performanceNow.mockRestore();
    }
  });

  it("does not start channel probes after auth consumes the whole deadline", async () => {
    vi.useFakeTimers();
    let monotonicRead = 0;
    const performanceNow = vi.spyOn(performance, "now").mockImplementation(() => {
      monotonicRead += 1;
      return monotonicRead <= 3 ? 1_000 : 1_006;
    });

    try {
      const { verification, client } = await verify({
        request: botRequest({ totalTimeoutMs: 5 }),
      });

      expect(verification).toMatchObject({
        ok: true,
        result: {
          ok: false,
          failure: { stage: "deadline", code: "deadline_exceeded" },
        },
      });
      expect(client.auth.test).toHaveBeenCalledOnce();
      expect(client.conversations.info).not.toHaveBeenCalled();
      expect(client.conversations.history).not.toHaveBeenCalled();
    } finally {
      performanceNow.mockRestore();
    }
  });

  it("does not start history after channel info consumes the whole deadline", async () => {
    vi.useFakeTimers();
    let monotonicRead = 0;
    const performanceNow = vi.spyOn(performance, "now").mockImplementation(() => {
      monotonicRead += 1;
      return monotonicRead <= 5 ? 1_000 : 1_006;
    });

    try {
      const { verification, client } = await verify({
        request: botRequest({ totalTimeoutMs: 5 }),
      });

      expect(verification).toMatchObject({
        ok: true,
        result: {
          ok: false,
          failure: { stage: "deadline", code: "deadline_exceeded" },
        },
      });
      expect(client.auth.test).toHaveBeenCalledOnce();
      expect(client.conversations.info).toHaveBeenCalledOnce();
      expect(client.conversations.history).not.toHaveBeenCalled();
    } finally {
      performanceNow.mockRestore();
    }
  });
});

describe("handleSlackAccessVerify", () => {
  it("returns a closed INVALID_REQUEST error for malformed RPC params", async () => {
    const respond = vi.fn();
    const getRuntimeConfig = vi.fn(() => namedBotConfig());

    await handleSlackAccessVerify({
      params: {
        accountId: "oscar",
        credentialKind: "bot",
        channelId: CHANNEL_ID,
        unexpected: true,
      },
      context: { getRuntimeConfig },
      respond,
    } as never);

    expect(getRuntimeConfig).not.toHaveBeenCalled();
    expect(respond).toHaveBeenCalledWith(
      false,
      undefined,
      expect.objectContaining({
        code: ErrorCodes.INVALID_REQUEST,
        message: "invalid slack.access.verify params",
      }),
    );
  });
});
