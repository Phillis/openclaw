import crypto from "node:crypto";
import type { AuthProfileCredential, AuthProfileStore } from "./auth-profiles/types.js";
import type { ResolvedProviderAuth } from "./model-auth-runtime-shared.js";

/** Ephemeral proof of the credential or opaque runtime that completed one agent run. */
export type AgentExecutionAuthBinding = {
  authProfileId?: string;
  /** Exact embedded harness that completed the successful turn, including openclaw. */
  agentHarnessId?: string;
  /** Exact model selected by the successful embedded run. */
  modelId?: string;
  /** Exact transport used to select that run's credential. */
  modelApi?: string;
  /** Non-reversible identity hash; credential material never leaves the runner. */
  authFingerprint?: string;
  /** Runtime-owned principal/session shape used when credentials are intentionally opaque. */
  runtimeOwnerFingerprint?: string;
  /** Exact opaque owner, or plugin harness carrying a credential-backed turn. */
  runtimeOwnerKind?: OpaqueRuntimeOwnerKind;
  /** Exact backend/harness id that owned the successful turn. */
  runtimeOwnerId?: string;
  /** Exact CLI or plugin-harness implementation used by the successful turn. */
  runtimeArtifactFingerprint?: string;
  runtimeArtifactId?: string;
  /** The prepared CLI bridge used only the selected profile, not ambient CLI auth. */
  skipLocalCredential?: true;
};

export type OpaqueRuntimeOwnerKind = "cli-runtime" | "plugin-harness" | "aws-sdk";

// Fingerprints are process-local proofs. Restarting rotates this key and
// invalidates them instead of leaving a reusable offline digest of a secret.
const authBindingFingerprintKey = crypto.randomBytes(32);

function hashAuthBinding(value: unknown): string {
  return crypto
    .createHmac("sha256", authBindingFingerprintKey)
    .update(JSON.stringify(value))
    .digest("hex");
}

function normalizeIdentity(value: string | undefined, lowercase = false): string | undefined {
  const normalized = value?.trim();
  return normalized ? (lowercase ? normalized.toLowerCase() : normalized) : undefined;
}

export const PREPARED_AUTH_BINDING_SCHEMA_VERSION = "openclaw-prepared-auth-binding/v1";

export type PreparedAuthBinding = {
  schemaVersion: typeof PREPARED_AUTH_BINDING_SCHEMA_VERSION;
  keyId: string;
  provider: string;
  mode: "oauth";
  profileTag: string;
  ownerKind: "provider-account-id";
  ownerTag: string;
};

export type PreparedAuthBindingContext =
  | {
      mode: "capture";
      key: Uint8Array;
      scopeSha256: string;
    }
  | {
      mode: "verify";
      key: Uint8Array;
      scopeSha256: string;
      expected: PreparedAuthBinding;
    };

export type PreparedAuthBindingMismatchField =
  | "auth.binding"
  | "auth.key"
  | "auth.mode"
  | "auth.owner"
  | "auth.profile"
  | "auth.provider";

export class PreparedAuthBindingDriftError extends Error {
  readonly code = "PREPARED_BINDING_DRIFT";
  readonly mismatchFields: PreparedAuthBindingMismatchField[];

  constructor(fields: Iterable<PreparedAuthBindingMismatchField>) {
    const mismatchFields = [...new Set(fields)].toSorted();
    super("Prepared auth binding rejected before inference dispatch.");
    this.name = "PreparedAuthBindingDriftError";
    this.mismatchFields = mismatchFields.length > 0 ? mismatchFields : ["auth.binding"];
  }
}

const PREPARED_AUTH_KEY_ID_DOMAIN = Buffer.from("prepared-auth-key-id/v1\0", "utf8");
const PREPARED_PROFILE_KEY_INFO = Buffer.from("openclaw-model-router/resolved-profile/v1", "utf8");
const PREPARED_OWNER_KEY_INFO = Buffer.from("openclaw-model-router/resolved-owner/v1", "utf8");

function normalizePreparedAuthKey(key: Uint8Array): Buffer {
  const bytes = Buffer.from(key);
  if (bytes.length !== 32) {
    throw new PreparedAuthBindingDriftError(["auth.key"]);
  }
  return bytes;
}

function normalizePreparedAuthScope(scopeSha256: string): string {
  const scope = scopeSha256.trim();
  if (!/^sha256:[a-f0-9]{64}$/u.test(scope)) {
    throw new PreparedAuthBindingDriftError(["auth.binding"]);
  }
  return scope;
}

function derivePreparedAuthKey(params: {
  key: Uint8Array;
  scopeSha256: string;
  info: Buffer;
}): Buffer {
  return Buffer.from(
    crypto.hkdfSync(
      "sha256",
      normalizePreparedAuthKey(params.key),
      Buffer.from(normalizePreparedAuthScope(params.scopeSha256), "utf8"),
      params.info,
      32,
    ),
  );
}

function preparedAuthTag(key: Buffer, value: unknown): string {
  return `hmac-sha256:${crypto
    .createHmac("sha256", key)
    .update(JSON.stringify(value))
    .digest("hex")}`;
}

function timingSafeStringEqual(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left, "utf8");
  const rightBytes = Buffer.from(right, "utf8");
  return leftBytes.length === rightBytes.length && crypto.timingSafeEqual(leftBytes, rightBytes);
}

function validatePreparedAuthBindingShape(
  binding: PreparedAuthBinding,
): PreparedAuthBindingMismatchField[] {
  const fields: PreparedAuthBindingMismatchField[] = [];
  const exactKeys = [
    "keyId",
    "mode",
    "ownerKind",
    "ownerTag",
    "profileTag",
    "provider",
    "schemaVersion",
  ];
  if (
    !binding ||
    typeof binding !== "object" ||
    Array.isArray(binding) ||
    JSON.stringify(Object.keys(binding).toSorted()) !== JSON.stringify(exactKeys)
  ) {
    return ["auth.binding"];
  }
  if (binding.schemaVersion !== PREPARED_AUTH_BINDING_SCHEMA_VERSION) {
    fields.push("auth.binding");
  }
  if (!/^sha256:[a-f0-9]{64}$/u.test(binding.keyId)) {
    fields.push("auth.key");
  }
  if (!binding.provider || binding.provider !== binding.provider.trim()) {
    fields.push("auth.provider");
  }
  if (binding.mode !== "oauth") {
    fields.push("auth.mode");
  }
  if (!/^hmac-sha256:[a-f0-9]{64}$/u.test(binding.profileTag)) {
    fields.push("auth.profile");
  }
  if (
    binding.ownerKind !== "provider-account-id" ||
    !/^hmac-sha256:[a-f0-9]{64}$/u.test(binding.ownerTag)
  ) {
    fields.push("auth.owner");
  }
  return fields;
}

export function preparedAuthBindingKeyId(key: Uint8Array): string {
  return `sha256:${crypto
    .createHash("sha256")
    .update(PREPARED_AUTH_KEY_ID_DOMAIN)
    .update(normalizePreparedAuthKey(key))
    .digest("hex")}`;
}

function buildPreparedProfileTag(params: {
  key: Uint8Array;
  scopeSha256: string;
  provider: string;
  profileId: string;
}): string {
  const provider = params.provider.trim();
  const profileId = params.profileId.trim();
  const mismatchFields: PreparedAuthBindingMismatchField[] = [];
  if (!provider || provider !== params.provider) {
    mismatchFields.push("auth.provider");
  }
  if (!profileId || profileId !== params.profileId) {
    mismatchFields.push("auth.profile");
  }
  if (mismatchFields.length > 0) {
    throw new PreparedAuthBindingDriftError(mismatchFields);
  }
  return preparedAuthTag(
    derivePreparedAuthKey({
      key: params.key,
      scopeSha256: params.scopeSha256,
      info: PREPARED_PROFILE_KEY_INFO,
    }),
    [provider, profileId],
  );
}

export function buildPreparedAuthBinding(params: {
  key: Uint8Array;
  scopeSha256: string;
  provider: string;
  profileId: string;
  credential: AuthProfileCredential;
}): PreparedAuthBinding {
  const provider = params.provider.trim();
  const profileId = params.profileId.trim();
  const credential = params.credential;
  const mismatchFields: PreparedAuthBindingMismatchField[] = [];
  if (!provider || provider !== params.provider || credential.provider !== provider) {
    mismatchFields.push("auth.provider");
  }
  if (!profileId || profileId !== params.profileId) {
    mismatchFields.push("auth.profile");
  }
  if (credential.type !== "oauth") {
    mismatchFields.push("auth.mode");
  }
  const accountId =
    credential.type === "oauth" ? normalizeIdentity(credential.accountId) : undefined;
  if (!accountId) {
    mismatchFields.push("auth.owner");
  }
  if (mismatchFields.length > 0 || credential.type !== "oauth" || !accountId) {
    throw new PreparedAuthBindingDriftError(mismatchFields);
  }
  const ownerKey = derivePreparedAuthKey({
    key: params.key,
    scopeSha256: params.scopeSha256,
    info: PREPARED_OWNER_KEY_INFO,
  });
  return {
    schemaVersion: PREPARED_AUTH_BINDING_SCHEMA_VERSION,
    keyId: preparedAuthBindingKeyId(params.key),
    provider,
    mode: "oauth",
    profileTag: buildPreparedProfileTag(params),
    ownerKind: "provider-account-id",
    ownerTag: preparedAuthTag(ownerKey, [
      "provider-account/v1",
      provider,
      credential.type,
      accountId,
    ]),
  };
}

export function comparePreparedAuthBindings(
  expected: PreparedAuthBinding,
  actual: PreparedAuthBinding,
): PreparedAuthBindingMismatchField[] {
  const fields = [
    ...validatePreparedAuthBindingShape(expected),
    ...validatePreparedAuthBindingShape(actual),
  ];
  if (!timingSafeStringEqual(expected.keyId ?? "", actual.keyId ?? "")) {
    fields.push("auth.key");
  }
  if (expected.provider !== actual.provider) {
    fields.push("auth.provider");
  }
  if (expected.mode !== actual.mode) {
    fields.push("auth.mode");
  }
  if (!timingSafeStringEqual(expected.profileTag ?? "", actual.profileTag ?? "")) {
    fields.push("auth.profile");
  }
  if (
    expected.ownerKind !== actual.ownerKind ||
    !timingSafeStringEqual(expected.ownerTag ?? "", actual.ownerTag ?? "")
  ) {
    fields.push("auth.owner");
  }
  return [...new Set(fields)].toSorted();
}

export function resolvePreparedAuthBindingProfileId(params: {
  key: Uint8Array;
  scopeSha256: string;
  expected: PreparedAuthBinding;
  store: AuthProfileStore;
  provider: string;
}): string {
  const shapeFields = validatePreparedAuthBindingShape(params.expected);
  if (shapeFields.length > 0) {
    throw new PreparedAuthBindingDriftError(shapeFields);
  }
  if (!timingSafeStringEqual(preparedAuthBindingKeyId(params.key), params.expected.keyId)) {
    throw new PreparedAuthBindingDriftError(["auth.key"]);
  }
  if (params.provider !== params.expected.provider) {
    throw new PreparedAuthBindingDriftError(["auth.provider"]);
  }
  const profileMatches: Array<{
    profileId: string;
    mismatchFields: PreparedAuthBindingMismatchField[];
  }> = [];
  for (const [profileId, credential] of Object.entries(params.store.profiles).toSorted(
    ([left], [right]) => left.localeCompare(right),
  )) {
    let profileTag: string;
    try {
      profileTag = buildPreparedProfileTag({
        key: params.key,
        scopeSha256: params.scopeSha256,
        provider: params.provider,
        profileId,
      });
    } catch {
      continue;
    }
    if (!timingSafeStringEqual(profileTag, params.expected.profileTag)) {
      continue;
    }
    const mismatchFields: PreparedAuthBindingMismatchField[] = [];
    if (credential.provider !== params.provider) {
      mismatchFields.push("auth.provider");
    }
    if (credential.type !== "oauth") {
      mismatchFields.push("auth.mode");
    } else {
      const accountId = normalizeIdentity(credential.accountId);
      if (!accountId) {
        mismatchFields.push("auth.owner");
      } else if (credential.provider === params.provider) {
        const candidate = buildPreparedAuthBinding({
          key: params.key,
          scopeSha256: params.scopeSha256,
          provider: params.provider,
          profileId,
          credential,
        });
        if (
          candidate.ownerKind !== params.expected.ownerKind ||
          !timingSafeStringEqual(candidate.ownerTag, params.expected.ownerTag)
        ) {
          mismatchFields.push("auth.owner");
        }
      }
    }
    profileMatches.push({ profileId, mismatchFields });
  }
  if (profileMatches.length !== 1) {
    throw new PreparedAuthBindingDriftError(["auth.profile"]);
  }
  const match = profileMatches[0];
  if (!match || match.mismatchFields.length > 0) {
    throw new PreparedAuthBindingDriftError(match?.mismatchFields ?? ["auth.profile"]);
  }
  return match.profileId;
}

export function verifyPreparedAuthBinding(params: {
  expected: PreparedAuthBinding;
  key: Uint8Array;
  scopeSha256: string;
  provider: string;
  profileId: string;
  credential: AuthProfileCredential;
}): PreparedAuthBinding {
  const actual = buildPreparedAuthBinding(params);
  const mismatchFields = comparePreparedAuthBindings(params.expected, actual);
  if (mismatchFields.length > 0) {
    throw new PreparedAuthBindingDriftError(mismatchFields);
  }
  return actual;
}

/**
 * Project non-secret profile ownership for runtimes that keep rotating tokens
 * behind their own process boundary. An explicitly selected missing profile
 * has no owner shape and must never collapse to ambient runtime authority.
 */
export function fingerprintAuthProfileOwnerShape(params: {
  profileId: string;
  credential: AuthProfileCredential | undefined;
}): string | undefined {
  const credential = params.credential;
  if (!credential) {
    return undefined;
  }
  switch (credential.type) {
    case "api_key":
      return hashAuthBinding([
        "profile-owner-v1",
        params.profileId,
        credential.type,
        credential.provider,
        credential.keyRef ?? null,
        normalizeIdentity(credential.email, true) ?? null,
        normalizeIdentity(credential.displayName) ?? null,
        credential.metadata ?? null,
      ]);
    case "token":
      return hashAuthBinding([
        "profile-owner-v1",
        params.profileId,
        credential.type,
        credential.provider,
        credential.tokenRef ?? null,
        normalizeIdentity(credential.email, true) ?? null,
        normalizeIdentity(credential.displayName) ?? null,
      ]);
    case "oauth": {
      const jwtIdentity = decodeJwtIdentity(credential.idToken);
      return hashAuthBinding([
        "profile-owner-v1",
        params.profileId,
        credential.type,
        credential.provider,
        normalizeIdentity(credential.accountId) ?? jwtIdentity.subject ?? null,
        normalizeIdentity(credential.email, true) ?? jwtIdentity.email ?? null,
        credential.clientId ?? null,
        credential.enterpriseUrl ?? null,
        credential.projectId ?? null,
      ]);
    }
  }
  return undefined;
}

/** Fingerprint the stable owner boundary of a successful opaque runtime turn. */
export function fingerprintOpaqueRuntimeOwner(params: {
  kind: OpaqueRuntimeOwnerKind;
  runner: "cli" | "embedded";
  provider: string;
  backendId: string;
  backendConfig?: unknown;
  authProfileId?: string;
  authProfileOwnerFingerprint?: string;
  authSource?: string;
  skipLocalCredential?: boolean;
  runtimeArtifactFingerprint?: string;
}): string | undefined {
  const runtimeArtifactFingerprint = params.runtimeArtifactFingerprint;
  const authProfileId = normalizeIdentity(params.authProfileId);
  if (authProfileId && !params.authProfileOwnerFingerprint) {
    return undefined;
  }
  if (!authProfileId && params.skipLocalCredential) {
    return undefined;
  }
  if (
    (params.kind === "cli-runtime" || params.kind === "plugin-harness") &&
    !runtimeArtifactFingerprint
  ) {
    return undefined;
  }
  return hashAuthBinding([
    params.kind === "aws-sdk" ? "opaque-runtime-owner-v1" : "opaque-runtime-owner-v2",
    params.kind,
    params.runner,
    params.provider.trim(),
    params.backendId,
    params.backendConfig ?? null,
    authProfileId ?? null,
    params.authProfileOwnerFingerprint ?? null,
    params.authSource ?? null,
    params.skipLocalCredential === true,
    runtimeArtifactFingerprint ?? null,
  ]);
}

/** Fingerprint only AWS SDK owners whose exact credential is observable here. */
export function fingerprintAwsSdkRuntimeOwner(params: {
  provider: string;
  backendId: string;
  auth: ResolvedProviderAuth | null | undefined;
  env?: NodeJS.ProcessEnv;
}): string | undefined {
  if (params.auth?.mode !== "aws-sdk" || params.auth.apiKey) {
    return undefined;
  }
  const env = params.env ?? process.env;
  let owner: unknown;
  if (env.AWS_BEARER_TOKEN_BEDROCK?.trim()) {
    owner = ["bearer", hashAuthBinding(env.AWS_BEARER_TOKEN_BEDROCK.trim())];
  } else if (env.AWS_PROFILE?.trim()) {
    // A profile name is not a principal: its role/source/SSO account can change
    // without the name changing. Supporting profiles and instance/container
    // roles requires provider-owned proof of the resolved account/ARN.
    return undefined;
  } else if (env.AWS_ACCESS_KEY_ID?.trim() && env.AWS_SECRET_ACCESS_KEY?.trim()) {
    owner = [
      "access-key",
      env.AWS_ACCESS_KEY_ID.trim(),
      hashAuthBinding([env.AWS_SECRET_ACCESS_KEY.trim(), env.AWS_SESSION_TOKEN?.trim() ?? null]),
    ];
  } else {
    return undefined;
  }
  return fingerprintOpaqueRuntimeOwner({
    kind: "aws-sdk",
    runner: "embedded",
    provider: params.provider,
    backendId: params.backendId,
    authSource: hashAuthBinding([params.auth.source, owner]),
  });
}

function decodeJwtIdentity(token: string | undefined): { subject?: string; email?: string } {
  const payload = token?.split(".")[1];
  if (!payload) {
    return {};
  }
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: unknown;
      email?: unknown;
    };
    return {
      ...(typeof claims.sub === "string" && normalizeIdentity(claims.sub)
        ? { subject: normalizeIdentity(claims.sub) }
        : {}),
      ...(typeof claims.email === "string" && normalizeIdentity(claims.email, true)
        ? { email: normalizeIdentity(claims.email, true) }
        : {}),
    };
  } catch {
    return {};
  }
}

/** Fingerprint the exact active credential owner used by one execution. */
export function fingerprintAuthProfileCredential(params: {
  profileId: string;
  credential: AuthProfileCredential;
}): string | undefined {
  const credential = params.credential;
  switch (credential.type) {
    case "api_key": {
      if (!credential.key) {
        return undefined;
      }
      return hashAuthBinding([
        "api_key",
        params.profileId,
        credential.provider,
        credential.key,
        credential.keyRef ?? null,
        credential.email ?? null,
        credential.displayName ?? null,
        credential.metadata ?? null,
      ]);
    }
    case "token": {
      if (!credential.token) {
        return undefined;
      }
      return hashAuthBinding([
        "token",
        params.profileId,
        credential.provider,
        credential.token,
        credential.tokenRef ?? null,
        credential.email ?? null,
        credential.displayName ?? null,
      ]);
    }
    case "oauth": {
      const jwtIdentity = decodeJwtIdentity(credential.idToken);
      const accountId = normalizeIdentity(credential.accountId) ?? jwtIdentity.subject;
      const email = normalizeIdentity(credential.email, true) ?? jwtIdentity.email;
      const stableIdentity = accountId ?? email;
      const opaqueIdentity = stableIdentity
        ? null
        : [credential.access, credential.refresh, credential.idToken ?? null];
      if (!stableIdentity && !credential.access && !credential.refresh && !credential.idToken) {
        return undefined;
      }
      return hashAuthBinding([
        "oauth",
        params.profileId,
        credential.provider,
        credential.clientId ?? null,
        accountId ?? null,
        email ?? null,
        credential.enterpriseUrl ?? null,
        credential.projectId ?? null,
        opaqueIdentity,
      ]);
    }
  }
  return undefined;
}

/** Fingerprint a profile after materializing its selected SecretRef value. */
export function fingerprintResolvedAuthProfileCredential(params: {
  profileId: string;
  credential: AuthProfileCredential;
  resolvedAuth: ResolvedProviderAuth | null | undefined;
}): string | undefined {
  const credential = params.credential;
  if (credential.type === "oauth") {
    return fingerprintAuthProfileCredential({ profileId: params.profileId, credential });
  }
  if (params.resolvedAuth && params.resolvedAuth.profileId !== params.profileId) {
    return undefined;
  }
  const inlineValue = credential.type === "api_key" ? credential.key : credential.token;
  const resolvedValue = params.resolvedAuth?.apiKey ?? inlineValue;
  if (!resolvedValue) {
    return undefined;
  }
  return fingerprintAuthProfileCredential({
    profileId: params.profileId,
    credential:
      credential.type === "api_key"
        ? { ...credential, key: resolvedValue }
        : { ...credential, token: resolvedValue },
  });
}

/** Fingerprint an ambient/config/env credential that was actually selected. */
export function fingerprintResolvedProviderAuth(
  auth: ResolvedProviderAuth | null | undefined,
): string | undefined {
  if (!auth?.apiKey) {
    return undefined;
  }
  return hashAuthBinding(["resolved", auth.profileId ?? null, auth.source, auth.mode, auth.apiKey]);
}
