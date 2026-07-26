import { describe, expect, it } from "vitest";
import {
  buildPreparedAuthBinding,
  fingerprintAuthProfileCredential,
  fingerprintAuthProfileOwnerShape,
  fingerprintAwsSdkRuntimeOwner,
  fingerprintOpaqueRuntimeOwner,
  fingerprintResolvedAuthProfileCredential,
  fingerprintResolvedProviderAuth,
  PreparedAuthBindingDriftError,
  resolvePreparedAuthBindingProfileId,
  verifyPreparedAuthBinding,
} from "./execution-auth-binding.js";

function jwt(claims: Record<string, unknown>): string {
  return `header.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.signature`;
}

describe("execution auth binding fingerprints", () => {
  it("rejects an opaque CLI owner without an executable identity", () => {
    expect(
      fingerprintOpaqueRuntimeOwner({
        kind: "cli-runtime",
        runner: "cli",
        provider: "claude-cli",
        backendId: "claude-cli",
      }),
    ).toBeUndefined();
  });

  it("requires and binds an opaque plugin harness implementation", () => {
    const fingerprint = (runtimeArtifactFingerprint?: string) =>
      fingerprintOpaqueRuntimeOwner({
        kind: "plugin-harness",
        runner: "embedded",
        provider: "openai",
        backendId: "codex",
        ...(runtimeArtifactFingerprint ? { runtimeArtifactFingerprint } : {}),
      });

    expect(fingerprint()).toBeUndefined();
    expect(fingerprint("codex-runtime-v1")).not.toBe(fingerprint("codex-runtime-v2"));
  });

  it.each(["env", "file", "exec"] as const)(
    "rejects an unresolved %s static-secret reference",
    (source) => {
      expect(
        fingerprintAuthProfileCredential({
          profileId: "openai:bound",
          credential: {
            type: "api_key",
            provider: "openai",
            keyRef: { source, provider: "default", id: source === "env" ? "OPENAI_KEY" : "key" },
          },
        }),
      ).toBeUndefined();
    },
  );

  it("changes when a materialized static secret rotates", () => {
    const fingerprint = (key: string) =>
      fingerprintAuthProfileCredential({
        profileId: "openai:bound",
        credential: {
          type: "api_key",
          provider: "openai",
          key,
          keyRef: { source: "file", provider: "vault", id: "/openai/key" },
        },
      });

    expect(fingerprint("first-key")).not.toBe(fingerprint("replacement-key"));
  });

  it("binds a SecretRef profile to the resolved selected value", () => {
    const credential = {
      type: "api_key" as const,
      provider: "openai",
      keyRef: { source: "env" as const, provider: "default", id: "OPENAI_KEY" },
    };
    const fingerprint = (apiKey: string, profileId = "openai:bound") =>
      fingerprintResolvedAuthProfileCredential({
        profileId: "openai:bound",
        credential,
        resolvedAuth: {
          apiKey,
          profileId,
          source: "profile:openai:bound",
          mode: "api-key",
        },
      });

    expect(fingerprint("first-key")).not.toBe(fingerprint("replacement-key"));
    expect(fingerprint("first-key", "openai:other")).toBeUndefined();
    expect(
      fingerprintResolvedAuthProfileCredential({
        profileId: "openai:bound",
        credential,
        resolvedAuth: null,
      }),
    ).toBeUndefined();
  });

  it("keeps identity-bearing OAuth stable across token refreshes", () => {
    const fingerprint = (access: string, refresh: string) =>
      fingerprintAuthProfileCredential({
        profileId: "openai:oauth",
        credential: {
          type: "oauth",
          provider: "openai",
          access,
          refresh,
          expires: 1,
          accountId: "account-1",
          email: "User@Example.test",
        },
      });

    expect(fingerprint("access-a", "refresh-a")).toBe(fingerprint("access-b", "refresh-b"));
  });

  it("invalidates identity-less OAuth when its opaque grant changes", () => {
    const fingerprint = (access: string, refresh: string) =>
      fingerprintAuthProfileCredential({
        profileId: "anthropic:oauth",
        credential: {
          type: "oauth",
          provider: "anthropic",
          access,
          refresh,
          expires: 1,
        },
      });

    expect(fingerprint("access-a", "refresh-a")).not.toBe(fingerprint("access-b", "refresh-b"));
  });

  it("uses stable id-token identity instead of rotating token material", () => {
    const fingerprint = (access: string, subject: string) =>
      fingerprintAuthProfileCredential({
        profileId: "google:oauth",
        credential: {
          type: "oauth",
          provider: "google",
          access,
          refresh: `refresh-${access}`,
          expires: 1,
          idToken: jwt({ sub: subject, email: "user@example.test" }),
        },
      });

    expect(fingerprint("access-a", "subject-1")).toBe(fingerprint("access-b", "subject-1"));
    expect(fingerprint("access-a", "subject-1")).not.toBe(fingerprint("access-a", "subject-2"));
  });

  it("keeps resolved credential fingerprints opaque and stable within one process", () => {
    const fingerprint = (apiKey: string) =>
      fingerprintResolvedProviderAuth({
        apiKey,
        profileId: "openai:bound",
        source: "profile:openai:bound",
        mode: "api-key",
      });

    const secret = "raw-secret-marker-with-non-hex";
    const first = fingerprint(secret);

    expect(first).toBe(fingerprint(secret));
    expect(first).not.toBe(fingerprint("replacement-secret"));
    expect(first).toMatch(/^[a-f0-9]{64}$/u);
    expect(first).not.toContain(secret);
  });

  it("rejects auth modes without a concrete credential identity", () => {
    expect(
      fingerprintResolvedProviderAuth({ source: "aws-sdk:default-chain", mode: "aws-sdk" }),
    ).toBeUndefined();
  });

  it("keeps an opaque OAuth profile owner stable across runtime token refreshes", () => {
    const fingerprint = (access: string) =>
      fingerprintAuthProfileOwnerShape({
        profileId: "anthropic:cli",
        credential: {
          type: "oauth",
          provider: "anthropic",
          access,
          refresh: `refresh-${access}`,
          expires: 1,
          accountId: "account-1",
        },
      });

    expect(fingerprint("access-a")).toBe(fingerprint("access-b"));
    expect(
      fingerprintAuthProfileOwnerShape({
        profileId: "anthropic:missing",
        credential: undefined,
      }),
    ).toBeUndefined();
  });

  it("binds AWS SDK owners only to concrete bearer and static credentials", () => {
    const auth = { source: "aws-sdk default chain", mode: "aws-sdk" as const };
    const fingerprint = (env: NodeJS.ProcessEnv) =>
      fingerprintAwsSdkRuntimeOwner({
        provider: "amazon-bedrock",
        backendId: "openclaw",
        auth,
        env,
      });

    expect(fingerprint({ AWS_BEARER_TOKEN_BEDROCK: "bearer-a" })).toBe(
      fingerprint({ AWS_BEARER_TOKEN_BEDROCK: "bearer-a" }),
    );
    expect(fingerprint({ AWS_BEARER_TOKEN_BEDROCK: "bearer-a" })).not.toBe(
      fingerprint({ AWS_BEARER_TOKEN_BEDROCK: "bearer-b" }),
    );
    expect(fingerprint({ AWS_ACCESS_KEY_ID: "AKIA1", AWS_SECRET_ACCESS_KEY: "secret-a" })).not.toBe(
      fingerprint({ AWS_ACCESS_KEY_ID: "AKIA1", AWS_SECRET_ACCESS_KEY: "secret-b" }),
    );
    expect(fingerprint({ AWS_ACCESS_KEY_ID: "AKIA1", AWS_SECRET_ACCESS_KEY: "secret-a" })).not.toBe(
      fingerprint({ AWS_ACCESS_KEY_ID: "AKIA2", AWS_SECRET_ACCESS_KEY: "secret-a" }),
    );
    expect(
      fingerprint({
        AWS_ACCESS_KEY_ID: "AKIA1",
        AWS_SECRET_ACCESS_KEY: "secret-a",
        AWS_SESSION_TOKEN: "session-a",
      }),
    ).not.toBe(
      fingerprint({
        AWS_ACCESS_KEY_ID: "AKIA1",
        AWS_SECRET_ACCESS_KEY: "secret-a",
        AWS_SESSION_TOKEN: "session-b",
      }),
    );
  });

  it("fails closed when the AWS SDK principal cannot be established", () => {
    const auth = { source: "aws-sdk default chain", mode: "aws-sdk" as const };
    const fingerprint = (env: NodeJS.ProcessEnv) =>
      fingerprintAwsSdkRuntimeOwner({
        provider: "amazon-bedrock",
        backendId: "openclaw",
        auth,
        env,
      });

    expect(fingerprint({ AWS_PROFILE: "work" })).toBeUndefined();
    expect(fingerprint({})).toBeUndefined();
    expect(
      fingerprint({
        AWS_PROFILE: "work",
        AWS_ACCESS_KEY_ID: "AKIA1",
        AWS_SECRET_ACCESS_KEY: "secret-a",
      }),
    ).toBeUndefined();
  });
});

describe("prepared cross-process auth bindings", () => {
  const key = Buffer.alloc(32, 0x42);
  const scopeSha256 = `sha256:${"1".repeat(64)}`;
  const credential = (
    overrides: Partial<{
      access: string;
      refresh: string;
      accountId: string;
    }> = {},
  ) => ({
    type: "oauth" as const,
    provider: "openai",
    access: overrides.access ?? "access-a",
    refresh: overrides.refresh ?? "refresh-a",
    expires: 1,
    accountId: overrides.accountId ?? "account-a",
  });
  const bindingKeyId = (bindingKey: Uint8Array) =>
    buildPreparedAuthBinding({
      key: bindingKey,
      scopeSha256,
      provider: "openai",
      profileId: "openai:chatgpt",
      credential: credential(),
    }).keyId;
  const verifyMismatchFields = (params: {
    expected: ReturnType<typeof buildPreparedAuthBinding>;
    profileId: string;
    accountId?: string;
  }) => {
    try {
      verifyPreparedAuthBinding({
        expected: params.expected,
        key,
        scopeSha256,
        provider: "openai",
        profileId: params.profileId,
        credential: credential(params.accountId ? { accountId: params.accountId } : {}),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PreparedAuthBindingDriftError);
      return (error as PreparedAuthBindingDriftError).mismatchFields;
    }
    throw new Error("expected prepared auth binding verification to reject");
  };

  it("stays stable across token refreshes while preserving the same owner", () => {
    const build = (access: string, refresh: string) =>
      buildPreparedAuthBinding({
        key,
        scopeSha256,
        provider: "openai",
        profileId: "openai:chatgpt",
        credential: credential({ access, refresh }),
      });

    expect(build("access-a", "refresh-a")).toEqual(build("access-b", "refresh-b"));
    expect(bindingKeyId(key)).toMatch(/^sha256:[a-f0-9]{64}$/u);
  });

  it("matches the router campaign-key identity vectors", () => {
    expect(bindingKeyId(Buffer.alloc(32))).toBe(
      "sha256:9f410be1d37e93db132a1765dd223489381112cf6fccc89351afebc318664dab",
    );
    expect(bindingKeyId(Buffer.from(Array.from({ length: 32 }, (_, index) => index)))).toBe(
      "sha256:aea7c0361f13404b3f92786b5e7b0c2cc0351edd6a1479c96063eaa4a8965f29",
    );
  });

  it("rejects profile and account substitution with redacted field labels", () => {
    const expected = buildPreparedAuthBinding({
      key,
      scopeSha256,
      provider: "openai",
      profileId: "openai:chatgpt",
      credential: credential(),
    });
    expect(
      verifyMismatchFields({
        expected,
        profileId: "openai:other",
      }),
    ).toEqual(["auth.profile"]);
    expect(
      verifyMismatchFields({
        expected,
        profileId: "openai:chatgpt",
        accountId: "account-b",
      }),
    ).toEqual(["auth.owner"]);
    expect(() =>
      verifyPreparedAuthBinding({
        expected,
        key,
        scopeSha256,
        provider: "openai",
        profileId: "openai:chatgpt",
        credential: credential({ accountId: "account-b" }),
      }),
    ).toThrow(PreparedAuthBindingDriftError);
  });

  it("recovers exactly one approved profile without ambient fallback", () => {
    const expected = buildPreparedAuthBinding({
      key,
      scopeSha256,
      provider: "openai",
      profileId: "openai:approved",
      credential: credential(),
    });
    const store = {
      version: 1,
      profiles: {
        "openai:ambient": credential({ accountId: "account-b" }),
        "openai:approved": credential({ access: "rotated", refresh: "rotated-refresh" }),
      },
    };

    expect(
      resolvePreparedAuthBindingProfileId({
        key,
        scopeSha256,
        expected,
        store,
        provider: "openai",
      }),
    ).toBe("openai:approved");
  });

  it.each([
    {
      label: "missing owner",
      stored: {
        type: "oauth" as const,
        provider: "openai",
        access: "access",
        refresh: "refresh",
        expires: 1,
      },
      fields: ["auth.owner"],
    },
    {
      label: "auth mode substitution",
      stored: {
        type: "api_key" as const,
        provider: "openai",
        key: "api-key",
      },
      fields: ["auth.mode"],
    },
    {
      label: "provider substitution",
      stored: {
        type: "oauth" as const,
        provider: "anthropic",
        access: "access",
        refresh: "refresh",
        expires: 1,
        accountId: "account-a",
      },
      fields: ["auth.provider"],
    },
  ])("reports $label without exposing profile or owner values", ({ stored, fields }) => {
    const expected = buildPreparedAuthBinding({
      key,
      scopeSha256,
      provider: "openai",
      profileId: "openai:approved",
      credential: credential(),
    });
    let error: unknown;
    try {
      resolvePreparedAuthBindingProfileId({
        key,
        scopeSha256,
        expected,
        store: {
          version: 1,
          profiles: { "openai:approved": stored },
        },
        provider: "openai",
      });
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(PreparedAuthBindingDriftError);
    expect((error as PreparedAuthBindingDriftError).mismatchFields).toEqual(fields);
    expect(JSON.stringify(error)).not.toContain("openai:approved");
    expect(JSON.stringify(error)).not.toContain("account-a");
  });

  it("fails closed on unavailable owner identity or a different campaign key", () => {
    expect(() =>
      buildPreparedAuthBinding({
        key,
        scopeSha256,
        provider: "openai",
        profileId: "openai:chatgpt",
        credential: {
          type: "oauth",
          provider: "openai",
          access: "secret-access",
          refresh: "secret-refresh",
          expires: 1,
        },
      }),
    ).toThrow(PreparedAuthBindingDriftError);

    const expected = buildPreparedAuthBinding({
      key,
      scopeSha256,
      provider: "openai",
      profileId: "openai:chatgpt",
      credential: credential(),
    });
    let error: unknown;
    try {
      resolvePreparedAuthBindingProfileId({
        key: Buffer.alloc(32, 0x24),
        scopeSha256,
        expected,
        store: {
          version: 1,
          profiles: { "openai:chatgpt": credential() },
        },
        provider: "openai",
      });
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(PreparedAuthBindingDriftError);
    expect((error as PreparedAuthBindingDriftError).mismatchFields).toEqual(["auth.key"]);
    const serialized = JSON.stringify(error);
    expect(serialized).not.toContain("openai:chatgpt");
    expect(serialized).not.toContain("account-a");
    expect(serialized).not.toContain("secret");
  });
});
