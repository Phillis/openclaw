// Slack access verification binds one explicit credential to one exact conversation.
import { performance } from "node:perf_hooks";
import type {
  AuthTestResponse,
  ConversationsHistoryResponse,
  ConversationsInfoResponse,
  WebClient,
} from "@slack/web-api";
import { normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import {
  ErrorCodes,
  errorShape,
  type GatewayRequestHandlerOptions,
} from "openclaw/plugin-sdk/gateway-runtime";
import { z } from "zod";
import { createSlackLookupClient } from "./client.js";
import { resolveSlackBotToken, resolveSlackUserToken } from "./token.js";

export const SLACK_ACCESS_PROOF_CONTRACT_VERSION = "openclaw-slack-access-proof/v1" as const;
export const SLACK_ACCESS_PROOF_API_URL = "https://slack.com/api/" as const;

const SLACK_ACCESS_PROOF_METHOD = "conversations.history" as const;
const SLACK_ACCESS_PROOF_LIMIT = 1 as const;
const SLACK_ACCESS_PROOF_DEFAULT_TOTAL_TIMEOUT_MS = 30_000;
const SLACK_ACCESS_PROOF_MAX_TOTAL_TIMEOUT_MS = 30_000;
const SLACK_ACCOUNT_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const SLACK_CHANNEL_ID_RE = /^[CDG][A-Z0-9]{8,}$/;
const SLACK_USER_ID_RE = /^[UW][A-Z0-9]{8,}$/;
const SLACK_BOT_ID_RE = /^B[A-Z0-9]{8,}$/;
const SLACK_TEAM_ID_RE = /^T[A-Z0-9]{8,}$/;

const SlackAccessVerifyParamsSchema = z
  .object({
    contractVersion: z.literal(SLACK_ACCESS_PROOF_CONTRACT_VERSION),
    accountId: z
      .string()
      .regex(SLACK_ACCOUNT_ID_RE)
      .refine((value) => normalizeOptionalAccountId(value) === value),
    credentialKind: z.enum(["bot", "user"]),
    expectedUserId: z.string().regex(SLACK_USER_ID_RE),
    expectedBotId: z.union([z.string().regex(SLACK_BOT_ID_RE), z.null()]),
    expectedTeamId: z.string().regex(SLACK_TEAM_ID_RE),
    channelId: z.string().regex(SLACK_CHANNEL_ID_RE),
    expectedApiUrl: z.literal(SLACK_ACCESS_PROOF_API_URL),
    totalTimeoutMs: z.number().int().min(1).max(SLACK_ACCESS_PROOF_MAX_TOTAL_TIMEOUT_MS).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.credentialKind === "bot" && value.expectedBotId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "bot credential requires expectedBotId",
        path: ["expectedBotId"],
      });
    }
    if (value.credentialKind === "user" && value.expectedBotId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "user credential requires expectedBotId null",
        path: ["expectedBotId"],
      });
    }
  });

const SlackAccessFailureSchema = z.discriminatedUnion("stage", [
  z
    .object({
      stage: z.literal("account"),
      code: z.enum(["not_configured", "disabled", "ambiguous_account", "unsupported_installation"]),
    })
    .strict(),
  z
    .object({
      stage: z.literal("credential"),
      code: z.literal("credential_unavailable"),
    })
    .strict(),
  z
    .object({
      stage: z.literal("auth"),
      code: z.enum([
        "provider_rejected",
        "identity_incomplete",
        "identity_kind_mismatch",
        "identity_mismatch",
        "malformed_response",
        "unsupported_installation",
      ]),
    })
    .strict(),
  z
    .object({
      stage: z.literal("info"),
      code: z.enum(["provider_rejected", "channel_mismatch", "malformed_response"]),
    })
    .strict(),
  z
    .object({
      stage: z.literal("history"),
      code: z.enum(["provider_rejected", "malformed_response"]),
    })
    .strict(),
  z
    .object({
      stage: z.literal("deadline"),
      code: z.literal("deadline_exceeded"),
    })
    .strict(),
]);

const SlackAccessVerifyFailureSchema = z
  .object({
    contractVersion: z.literal(SLACK_ACCESS_PROOF_CONTRACT_VERSION),
    ok: z.literal(false),
    failure: SlackAccessFailureSchema,
  })
  .strict();

const SlackAccessVerifySuccessSchema = z
  .object({
    contractVersion: z.literal(SLACK_ACCESS_PROOF_CONTRACT_VERSION),
    ok: z.literal(true),
    requested: z
      .object({
        accountId: z.string().regex(SLACK_ACCOUNT_ID_RE),
        credentialKind: z.enum(["bot", "user"]),
        channelId: z.string().regex(SLACK_CHANNEL_ID_RE),
        identity: z
          .object({
            userId: z.string().regex(SLACK_USER_ID_RE),
            botId: z.union([z.string().regex(SLACK_BOT_ID_RE), z.null()]),
            teamId: z.string().regex(SLACK_TEAM_ID_RE),
          })
          .strict(),
        apiUrl: z.literal(SLACK_ACCESS_PROOF_API_URL),
      })
      .strict(),
    resolved: z
      .object({
        accountId: z.string().regex(SLACK_ACCOUNT_ID_RE),
        credentialKind: z.enum(["bot", "user"]),
        credentialSource: z.enum(["account", "root", "env"]),
        channelId: z.string().regex(SLACK_CHANNEL_ID_RE),
        apiUrl: z.literal(SLACK_ACCESS_PROOF_API_URL),
      })
      .strict(),
    auth: z
      .object({
        userId: z.string().regex(SLACK_USER_ID_RE),
        botId: z.union([z.string().regex(SLACK_BOT_ID_RE), z.null()]),
        teamId: z.string().regex(SLACK_TEAM_ID_RE),
      })
      .strict(),
    access: z
      .object({
        operation: z.literal("read"),
        performedWrites: z.literal(false),
        method: z.literal(SLACK_ACCESS_PROOF_METHOD),
        limit: z.literal(SLACK_ACCESS_PROOF_LIMIT),
        channelInfoVerified: z.literal(true),
        historyVerified: z.literal(true),
        sameCredentialForIdentityAndAccess: z.literal(true),
      })
      .strict(),
  })
  .strict();

const SlackAccessVerifyResultSchema = z.discriminatedUnion("ok", [
  SlackAccessVerifySuccessSchema,
  SlackAccessVerifyFailureSchema,
]);

export type SlackAccessVerifyParams = z.infer<typeof SlackAccessVerifyParamsSchema>;
export type SlackAccessVerifyResult = z.infer<typeof SlackAccessVerifyResultSchema>;

type SlackCredentialKind = SlackAccessVerifyParams["credentialKind"];
type SlackCredentialSource = "account" | "root" | "env";
type SlackAccessFailure = z.infer<typeof SlackAccessVerifyFailureSchema>["failure"];
type SlackAccessClient = Pick<WebClient, "auth" | "conversations">;
type SlackAccessClientOptions = {
  signal: AbortSignal;
  slackApiUrl: typeof SLACK_ACCESS_PROOF_API_URL;
  timeout: number;
};

type ResolvedCredential =
  | {
      ok: true;
      token: string;
      source: SlackCredentialSource;
    }
  | {
      ok: false;
      failure: SlackAccessFailure;
    };

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.hasOwn(value, key);
}

function failure<TStage extends SlackAccessFailure["stage"]>(
  stage: TStage,
  code: Extract<SlackAccessFailure, { stage: TStage }>["code"],
) {
  return SlackAccessVerifyFailureSchema.parse({
    contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
    ok: false,
    failure: { stage, code },
  });
}

function resolveTokenValue(params: {
  value: unknown;
  kind: SlackCredentialKind;
  path: string;
}): string | undefined {
  const token =
    params.kind === "bot"
      ? resolveSlackBotToken(params.value, params.path)
      : resolveSlackUserToken(params.value, params.path);
  return token?.trim() || undefined;
}

function resolveExactSlackCredential(
  cfg: OpenClawConfig,
  params: SlackAccessVerifyParams,
): ResolvedCredential {
  const slack = cfg.channels?.slack;
  if (!slack && params.accountId !== "default") {
    return { ok: false, failure: { stage: "account", code: "not_configured" } };
  }
  if (slack?.enabled === false) {
    return { ok: false, failure: { stage: "account", code: "disabled" } };
  }

  const accounts = slack?.accounts ?? {};
  const normalizedMatches = Object.keys(accounts).filter(
    (key) => normalizeOptionalAccountId(key) === params.accountId,
  );
  if (
    normalizedMatches.length > 1 ||
    (normalizedMatches.length === 1 && normalizedMatches[0] !== params.accountId)
  ) {
    return { ok: false, failure: { stage: "account", code: "ambiguous_account" } };
  }

  const configuredAccount = hasOwn(accounts, params.accountId)
    ? accounts[params.accountId]
    : undefined;
  if (params.accountId !== "default" && !configuredAccount) {
    return { ok: false, failure: { stage: "account", code: "not_configured" } };
  }
  if (configuredAccount?.enabled === false) {
    return { ok: false, failure: { stage: "account", code: "disabled" } };
  }
  const enterpriseOrgInstall =
    configuredAccount?.enterpriseOrgInstall ?? slack?.enterpriseOrgInstall;
  if (enterpriseOrgInstall === true) {
    return {
      ok: false,
      failure: { stage: "account", code: "unsupported_installation" },
    };
  }
  const tokenKey = params.credentialKind === "bot" ? "botToken" : "userToken";
  let value: unknown;
  let source: SlackCredentialSource;
  let path: string;

  if (configuredAccount && hasOwn(configuredAccount, tokenKey)) {
    value = configuredAccount[tokenKey];
    source = "account";
    path = `channels.slack.accounts.${params.accountId}.${tokenKey}`;
  } else if (params.accountId === "default" && slack && hasOwn(slack, tokenKey)) {
    value = slack[tokenKey];
    source = "root";
    path = `channels.slack.${tokenKey}`;
  } else if (params.accountId === "default") {
    value =
      params.credentialKind === "bot" ? process.env.SLACK_BOT_TOKEN : process.env.SLACK_USER_TOKEN;
    source = "env";
    path =
      params.credentialKind === "bot"
        ? "environment SLACK_BOT_TOKEN"
        : "environment SLACK_USER_TOKEN";
  } else {
    return {
      ok: false,
      failure: { stage: "credential", code: "credential_unavailable" },
    };
  }

  try {
    const token = resolveTokenValue({
      value,
      kind: params.credentialKind,
      path,
    });
    if (!token) {
      return {
        ok: false,
        failure: { stage: "credential", code: "credential_unavailable" },
      };
    }
    return { ok: true, token, source };
  } catch {
    return {
      ok: false,
      failure: { stage: "credential", code: "credential_unavailable" },
    };
  }
}

function requiredSlackId(value: unknown, pattern: RegExp): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return pattern.test(trimmed) ? trimmed : undefined;
}

function validateAuthIdentity(
  auth: AuthTestResponse,
  credentialKind: SlackCredentialKind,
):
  | { ok: true; userId: string; botId: string | null; teamId: string }
  | { ok: false; failure: SlackAccessFailure } {
  if (auth.ok !== true) {
    return { ok: false, failure: { stage: "auth", code: "provider_rejected" } };
  }
  if (auth.is_enterprise_install !== undefined && typeof auth.is_enterprise_install !== "boolean") {
    return { ok: false, failure: { stage: "auth", code: "malformed_response" } };
  }
  if (auth.is_enterprise_install === true) {
    return { ok: false, failure: { stage: "auth", code: "unsupported_installation" } };
  }
  const userId = requiredSlackId(auth.user_id, SLACK_USER_ID_RE);
  const teamId = requiredSlackId(auth.team_id, SLACK_TEAM_ID_RE);
  if (!userId || !teamId) {
    return { ok: false, failure: { stage: "auth", code: "identity_incomplete" } };
  }
  const botId = requiredSlackId(auth.bot_id, SLACK_BOT_ID_RE);
  if (credentialKind === "bot" && !botId) {
    return { ok: false, failure: { stage: "auth", code: "identity_kind_mismatch" } };
  }
  if (credentialKind === "user" && auth.bot_id !== undefined && auth.bot_id !== null) {
    return { ok: false, failure: { stage: "auth", code: "identity_kind_mismatch" } };
  }
  return { ok: true, userId, botId: botId ?? null, teamId };
}

function validateChannelInfo(
  response: ConversationsInfoResponse,
  requestedChannelId: string,
): SlackAccessFailure | undefined {
  if (response.ok !== true) {
    return { stage: "info", code: "provider_rejected" };
  }
  const channelId = requiredSlackId(response.channel?.id, SLACK_CHANNEL_ID_RE);
  if (!channelId) {
    return { stage: "info", code: "malformed_response" };
  }
  if (channelId !== requestedChannelId) {
    return { stage: "info", code: "channel_mismatch" };
  }
  return undefined;
}

function validateChannelHistory(
  response: ConversationsHistoryResponse,
): SlackAccessFailure | undefined {
  if (response.ok !== true) {
    return { stage: "history", code: "provider_rejected" };
  }
  if (!Array.isArray(response.messages) || response.messages.length > SLACK_ACCESS_PROOF_LIMIT) {
    return { stage: "history", code: "malformed_response" };
  }
  return undefined;
}

async function runSlackAccessVerification(params: {
  client: SlackAccessClient;
  request: SlackAccessVerifyParams;
  credentialSource: SlackCredentialSource;
}): Promise<SlackAccessVerifyResult> {
  let auth: AuthTestResponse;
  try {
    auth = await params.client.auth.test();
  } catch {
    return failure("auth", "provider_rejected");
  }
  const identity = validateAuthIdentity(auth, params.request.credentialKind);
  if (!identity.ok) {
    return SlackAccessVerifyFailureSchema.parse({
      contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
      ok: false,
      failure: identity.failure,
    });
  }
  if (
    identity.userId !== params.request.expectedUserId ||
    identity.botId !== params.request.expectedBotId ||
    identity.teamId !== params.request.expectedTeamId
  ) {
    return failure("auth", "identity_mismatch");
  }

  let info: ConversationsInfoResponse;
  try {
    info = await params.client.conversations.info({
      channel: params.request.channelId,
    });
  } catch {
    return failure("info", "provider_rejected");
  }
  const infoFailure = validateChannelInfo(info, params.request.channelId);
  if (infoFailure) {
    return SlackAccessVerifyFailureSchema.parse({
      contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
      ok: false,
      failure: infoFailure,
    });
  }

  let history: ConversationsHistoryResponse;
  try {
    history = await params.client.conversations.history({
      channel: params.request.channelId,
      limit: SLACK_ACCESS_PROOF_LIMIT,
    });
  } catch {
    return failure("history", "provider_rejected");
  }
  const historyFailure = validateChannelHistory(history);
  if (historyFailure) {
    return SlackAccessVerifyFailureSchema.parse({
      contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
      ok: false,
      failure: historyFailure,
    });
  }

  return SlackAccessVerifySuccessSchema.parse({
    contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
    ok: true,
    requested: {
      accountId: params.request.accountId,
      credentialKind: params.request.credentialKind,
      channelId: params.request.channelId,
      identity: {
        userId: params.request.expectedUserId,
        botId: params.request.expectedBotId,
        teamId: params.request.expectedTeamId,
      },
      apiUrl: params.request.expectedApiUrl,
    },
    resolved: {
      accountId: params.request.accountId,
      credentialKind: params.request.credentialKind,
      credentialSource: params.credentialSource,
      channelId: params.request.channelId,
      apiUrl: SLACK_ACCESS_PROOF_API_URL,
    },
    auth: {
      userId: identity.userId,
      botId: identity.botId,
      teamId: identity.teamId,
    },
    access: {
      operation: "read",
      performedWrites: false,
      method: SLACK_ACCESS_PROOF_METHOD,
      limit: SLACK_ACCESS_PROOF_LIMIT,
      channelInfoVerified: true,
      historyVerified: true,
      sameCredentialForIdentityAndAccess: true,
    },
  });
}

export async function verifySlackAccess(params: {
  cfg: OpenClawConfig;
  request: unknown;
  createClient?: (token: string, options: SlackAccessClientOptions) => SlackAccessClient;
}): Promise<
  { ok: true; result: SlackAccessVerifyResult } | { ok: false; error: "invalid_request" }
> {
  const parsed = SlackAccessVerifyParamsSchema.safeParse(params.request);
  if (!parsed.success) {
    return { ok: false, error: "invalid_request" };
  }
  const totalTimeoutMs = parsed.data.totalTimeoutMs ?? SLACK_ACCESS_PROOF_DEFAULT_TOTAL_TIMEOUT_MS;
  // performance.now() is monotonic. A wall-clock correction must never enlarge
  // the signed whole-operation deadline.
  const deadlineStartedAtMs = performance.now();
  const credential = resolveExactSlackCredential(params.cfg, parsed.data);
  if (!credential.ok) {
    return {
      ok: true,
      result: SlackAccessVerifyFailureSchema.parse({
        contractVersion: SLACK_ACCESS_PROOF_CONTRACT_VERSION,
        ok: false,
        failure: credential.failure,
      }),
    };
  }
  const createClient =
    params.createClient ??
    ((token: string, options: SlackAccessClientOptions) =>
      createSlackLookupClient(token, {
        slackApiUrl: options.slackApiUrl,
        timeout: options.timeout,
        requestInterceptor: (config) => {
          config.signal = options.signal;
          return config;
        },
      }));
  const abortController = new AbortController();
  let client: SlackAccessClient;
  try {
    client = createClient(credential.token, {
      signal: abortController.signal,
      slackApiUrl: SLACK_ACCESS_PROOF_API_URL,
      timeout: totalTimeoutMs,
    });
  } catch {
    return { ok: true, result: failure("credential", "credential_unavailable") };
  }
  const elapsedMs = Math.max(0, performance.now() - deadlineStartedAtMs);
  const remainingTimeoutMs = totalTimeoutMs - elapsedMs;
  if (remainingTimeoutMs <= 0) {
    abortController.abort();
    return { ok: true, result: failure("deadline", "deadline_exceeded") };
  }
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const operation = runSlackAccessVerification({
    client,
    request: parsed.data,
    credentialSource: credential.source,
  });
  const deadline = new Promise<SlackAccessVerifyResult>((resolve) => {
    timeout = setTimeout(() => {
      abortController.abort();
      resolve(failure("deadline", "deadline_exceeded"));
    }, remainingTimeoutMs);
  });
  try {
    return {
      ok: true,
      result: await Promise.race([operation, deadline]),
    };
  } finally {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  }
}

export async function handleSlackAccessVerify({
  params,
  respond,
  context,
}: GatewayRequestHandlerOptions): Promise<void> {
  if (!SlackAccessVerifyParamsSchema.safeParse(params).success) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "invalid slack.access.verify params"),
    );
    return;
  }
  const verification = await verifySlackAccess({
    cfg: context.getRuntimeConfig(),
    request: params,
  });
  if (!verification.ok) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, "invalid slack.access.verify params"),
    );
    return;
  }
  respond(true, verification.result);
}
