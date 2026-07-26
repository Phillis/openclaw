import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Model } from "../llm/types.js";
import type { resolveModelAsync } from "./embedded-agent-runner/model.js";
import {
  buildPreparedAuthBinding,
  PreparedAuthBindingDriftError,
  verifyPreparedAuthBinding,
  type PreparedAuthBindingContext,
} from "./execution-auth-binding.js";

const hoisted = vi.hoisted(() => ({
  completeMock: vi.fn(),
  ensureAuthProfileStoreMock: vi.fn(),
  getApiKeyForModelMock: vi.fn(),
  prepareModelForSimpleCompletionMock: vi.fn((params: { model: unknown }) => params.model),
  setRuntimeApiKeyMock: vi.fn(),
}));

vi.mock("../llm/stream.js", () => ({
  completeSimple: hoisted.completeMock,
}));

vi.mock("./sessions/model-registry-runtime.js", () => ({
  getModelRegistryRuntime: () => ({
    apiRegistry: {},
    llmRuntime: {
      registry: {},
      completeSimple: hoisted.completeMock,
      streamSimple: vi.fn(),
    },
  }),
}));

vi.mock("./auth-profiles/store.js", () => ({
  ensureAuthProfileStore: hoisted.ensureAuthProfileStoreMock,
}));

vi.mock("./embedded-agent-runner/model.js", () => ({
  resolveModelAsync: vi.fn(),
}));

vi.mock("@openclaw/ai/transports", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@openclaw/ai/transports")>()),
  prepareModelForSimpleCompletion: hoisted.prepareModelForSimpleCompletionMock,
}));

vi.mock("./model-auth.js", () => ({
  applyLocalNoAuthHeaderOverride: (model: Model) => model,
  applySecretRefHeaderSentinels: (model: Model) => model,
  formatMissingAuthError: vi.fn(),
  getApiKeyForModel: hoisted.getApiKeyForModelMock,
  getApiKeyForModelWithPreparedAuthBinding: hoisted.getApiKeyForModelMock,
  resolveApiKeyForProvider: hoisted.getApiKeyForModelMock,
  resolveApiKeyForProviderWithPreparedAuthBinding: hoisted.getApiKeyForModelMock,
}));

vi.mock("../plugins/provider-runtime.runtime.js", () => ({
  prepareProviderRuntimeAuth: vi.fn(async () => undefined),
}));

import { prepareSimpleCompletionModel } from "./simple-completion-runtime.js";

type OAuthFixture = {
  type: "oauth";
  provider: "openai";
  access: string;
  refresh: string;
  expires: number;
  accountId: string;
};

function oauthCredential(overrides: Partial<OAuthFixture> = {}): OAuthFixture {
  return {
    type: "oauth",
    provider: "openai",
    access: "access-a",
    refresh: "refresh-a",
    expires: Date.now() + 60_000,
    accountId: "account-approved",
    ...overrides,
  };
}

function createOpenAIRouteModelResolver() {
  return vi.fn(async (...args: Parameters<typeof resolveModelAsync>) => {
    const [provider, modelId, , cfg] = args;
    const configured = cfg?.models?.providers?.openai;
    return {
      model: {
        provider,
        id: modelId,
        api: configured?.api ?? "openai-chatgpt-responses",
        baseUrl: configured?.baseUrl ?? "https://chatgpt.com/backend-api/codex",
      } as Model,
      authStorage: {
        setRuntimeApiKey: hoisted.setRuntimeApiKeyMock,
      },
      modelRegistry: {},
    };
  });
}

function installResolvedAuth(profileId: string, credential: OAuthFixture) {
  hoisted.getApiKeyForModelMock.mockImplementation(
    async (params: { preparedAuthBinding?: PreparedAuthBindingContext }) => {
      const context = params.preparedAuthBinding;
      const preparedAuthBinding = context
        ? context.mode === "verify"
          ? verifyPreparedAuthBinding({
              expected: context.expected,
              key: context.key,
              scopeSha256: context.scopeSha256,
              provider: "openai",
              profileId,
              credential,
            })
          : buildPreparedAuthBinding({
              key: context.key,
              scopeSha256: context.scopeSha256,
              provider: "openai",
              profileId,
              credential,
            })
        : undefined;
      return {
        apiKey: credential.access,
        profileId,
        source: `profile:${profileId}`,
        mode: "oauth",
        ...(preparedAuthBinding ? { preparedAuthBinding } : {}),
      };
    },
  );
}

function expectPrepared(
  result: Awaited<ReturnType<typeof prepareSimpleCompletionModel>>,
): asserts result is Exclude<typeof result, { error: string }> {
  expect(result).not.toHaveProperty("error");
  if ("error" in result) {
    throw new Error(result.error);
  }
}

beforeEach(() => {
  hoisted.completeMock.mockReset();
  hoisted.ensureAuthProfileStoreMock.mockReset();
  hoisted.getApiKeyForModelMock.mockReset();
  hoisted.prepareModelForSimpleCompletionMock.mockReset();
  hoisted.setRuntimeApiKeyMock.mockReset();
  hoisted.prepareModelForSimpleCompletionMock.mockImplementation(
    (params: { model: unknown }) => params.model,
  );
});

describe("prepared simple-completion auth binding", () => {
  it("captures the actual resolved OAuth profile and stable owner after refresh", async () => {
    const key = Buffer.alloc(32, 0x42);
    const scopeSha256 = `sha256:${"1".repeat(64)}`;
    const refreshedCredential = oauthCredential({
      access: "refreshed-access",
      refresh: "refreshed-refresh",
    });
    const ambientCredential = oauthCredential({ accountId: "account-ambient" });
    hoisted.ensureAuthProfileStoreMock.mockReturnValue({
      version: 1,
      profiles: {
        "openai:ambient": ambientCredential,
        "openai:approved": oauthCredential({ expires: 1 }),
      },
    });
    installResolvedAuth("openai:approved", refreshedCredential);

    const result = await prepareSimpleCompletionModel({
      cfg: {},
      provider: "openai",
      modelId: "gpt-5.6-terra",
      preparedAuthBinding: { mode: "capture", key, scopeSha256 },
      modelResolver: createOpenAIRouteModelResolver() as unknown as typeof resolveModelAsync,
    });

    expectPrepared(result);
    expect(result.auth).not.toHaveProperty("preparedAuthBinding");
    expect(result.preparedAuthBinding).toEqual(
      buildPreparedAuthBinding({
        key,
        scopeSha256,
        provider: "openai",
        profileId: "openai:approved",
        credential: oauthCredential({
          access: "a-different-refreshed-token",
          refresh: "a-different-refresh-token",
        }),
      }),
    );
    expect(result.preparedAuthBinding).not.toEqual(
      buildPreparedAuthBinding({
        key,
        scopeSha256,
        provider: "openai",
        profileId: "openai:ambient",
        credential: ambientCredential,
      }),
    );
  });

  it("resolves and locks the approved profile before verified preparation", async () => {
    const key = Buffer.alloc(32, 0x24);
    const scopeSha256 = `sha256:${"2".repeat(64)}`;
    const approvedCredential = oauthCredential();
    const expected = buildPreparedAuthBinding({
      key,
      scopeSha256,
      provider: "openai",
      profileId: "openai:approved",
      credential: approvedCredential,
    });
    const store = {
      version: 1,
      profiles: {
        "openai:ambient": oauthCredential({ accountId: "account-ambient" }),
        "openai:approved": approvedCredential,
      },
    };
    hoisted.ensureAuthProfileStoreMock.mockReturnValue(store);
    installResolvedAuth(
      "openai:approved",
      oauthCredential({ access: "rotated-access", refresh: "rotated-refresh" }),
    );
    const modelResolver = createOpenAIRouteModelResolver();

    const result = await prepareSimpleCompletionModel({
      cfg: {},
      provider: "openai",
      modelId: "gpt-5.6-terra",
      preparedAuthBinding: { mode: "verify", key, scopeSha256, expected },
      modelResolver: modelResolver as unknown as typeof resolveModelAsync,
    });

    expectPrepared(result);
    expect(result.auth).not.toHaveProperty("preparedAuthBinding");
    expect(result.preparedAuthBinding).toEqual(expected);
    expect(modelResolver).toHaveBeenCalledWith(
      "openai",
      "gpt-5.6-terra",
      undefined,
      {},
      expect.objectContaining({ authProfileId: "openai:approved" }),
    );
    expect(hoisted.getApiKeyForModelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        profileId: "openai:approved",
        lockedProfile: true,
        store,
      }),
    );
  });

  it("fails closed when refresh changes the bound OAuth owner", async () => {
    const key = Buffer.alloc(32, 0x18);
    const scopeSha256 = `sha256:${"3".repeat(64)}`;
    const capturedCredential = oauthCredential({ expires: 1 });
    const expected = buildPreparedAuthBinding({
      key,
      scopeSha256,
      provider: "openai",
      profileId: "openai:approved",
      credential: capturedCredential,
    });
    hoisted.ensureAuthProfileStoreMock.mockReturnValue({
      version: 1,
      profiles: { "openai:approved": capturedCredential },
    });
    installResolvedAuth(
      "openai:approved",
      oauthCredential({
        access: "substituted-access",
        refresh: "substituted-refresh",
        accountId: "account-substituted",
      }),
    );

    await expect(
      prepareSimpleCompletionModel({
        cfg: {},
        provider: "openai",
        modelId: "gpt-5.6-terra",
        preparedAuthBinding: { mode: "verify", key, scopeSha256, expected },
        modelResolver: createOpenAIRouteModelResolver() as unknown as typeof resolveModelAsync,
      }),
    ).rejects.toMatchObject({
      name: PreparedAuthBindingDriftError.name,
      code: "PREPARED_BINDING_DRIFT",
      mismatchFields: ["auth.owner"],
    });
  });
});
