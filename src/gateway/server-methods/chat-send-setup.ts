import { ErrorCodes, errorShape } from "../../../packages/gateway-protocol/src/index.js";
import { resolveAgentWorkspaceDir } from "../../agents/agent-scope.js";
import {
  isBridgeSessionKey,
  performBridgeSessionRollover,
} from "../../agents/embedded-agent-runner/run/bridge-session-rollover.js";
import type { SessionGoalOperation } from "../../config/sessions/goals-operations.js";
import type { SessionRotationConfig } from "../../config/types.base.js";
import { createSubsystemLogger } from "../../logging/subsystem.js";
import {
  isRotationEligibleSessionKey,
  isRotationEnabled,
  parseRotatedSessionKey,
  resolveSessionCeilingEstimate,
  resolveSessionRotationAdmissionTarget,
  resolveSessionRotationRetryTarget,
  runSessionCeilingCycle,
  type RotationStoreScope,
} from "../../sessions/session-rotation.js";
import { admitChatSend } from "./chat-send-admission.js";
import { runChatSendPreAdmission } from "./chat-send-pre-admission.js";
import { normalizeChatSendRequest } from "./chat-send-request.js";
import { prepareChatSendSession, type PreparedChatSendSession } from "./chat-send-session.js";
import type { GatewayRequestHandlerOptions } from "./types.js";

const log = createSubsystemLogger("gateway/chat-send");

/** Single bounded re-resolve for a message captured across an epoch boundary. */
const ROTATION_RETRY_LIMIT = 1;

function resolveRotationStoreScope(session: PreparedChatSendSession): RotationStoreScope {
  return {
    agentId: session.agentId,
    env: process.env,
    storePath: session.storePath,
  };
}

/**
 * Admission-path rotation + ceiling for one inbound chat.send. Runs once per
 * request (before the normal prepare/admit) on the freshly-prepared session:
 * - Ceiling (fail-open) applies to non-rotatable long-lived (main) sessions.
 * - Rotation applies to rotation-eligible channel-peer sessions.
 * Returns the request session key the admission should target. If it differs
 * from `requestSessionKey`, the caller re-prepares on the new epoch key.
 */
async function resolveChatSendRotationTarget(params: {
  session: PreparedChatSendSession;
  rotation: SessionRotationConfig | undefined;
  mainKey?: string;
}): Promise<string> {
  const { session } = params;
  const rotation = params.rotation;
  const requestSessionKey = session.sessionKey;
  if (!rotation) {
    return requestSessionKey;
  }
  const eligible = isRotationEligibleSessionKey(requestSessionKey, { mainKey: params.mainKey });
  if (!eligible && rotation.ceilingTokens !== undefined) {
    const ceiling = await runSessionCeilingCycle({
      scope: resolveRotationStoreScope(session),
      sessionKey: requestSessionKey,
      rotation,
      estimatedTokens: resolveSessionCeilingEstimate(session.entry),
    });
    // Bridge sessions (agent:*:pi / agent:*:handoff-*) have no human to type
    // /reset: past the ceiling the turn dies mid-run in the embedded-run
    // overflow branch. Rotate to a fresh window BEFORE the caller's re-prepare
    // so this delivery is admitted exactly once against the fresh entry;
    // fail-open like compaction — never block admission on a failed rollover.
    if (ceiling.compactRequested && isBridgeSessionKey(requestSessionKey)) {
      try {
        await performBridgeSessionRollover({
          agentId: session.agentId,
          config: session.cfg,
          sessionKey: requestSessionKey,
          workspaceDir: resolveAgentWorkspaceDir(session.cfg, session.agentId),
        });
      } catch (error) {
        log.warn(
          `[session-ceiling] bridge rollover failed for ${requestSessionKey}; admitting anyway: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  }
  if (!isRotationEnabled(rotation) || !eligible) {
    return requestSessionKey;
  }
  const admission = await resolveSessionRotationAdmissionTarget({
    scope: resolveRotationStoreScope(session),
    sessionKey: requestSessionKey,
    rotation,
    mainKey: params.mainKey,
  });
  return admission.sessionKey;
}

/** Normalize, prepare, and exclusively admit one new chat.send request. */
export async function prepareAndAdmitChatSend(
  {
    params,
    respond,
    context,
    client,
    sessionMutationAuthorization,
  }: Pick<
    GatewayRequestHandlerOptions,
    "params" | "respond" | "context" | "client" | "sessionMutationAuthorization"
  >,
  onAdmissionOwned?: () => Promise<boolean>,
  options?: {
    trustedSystemInput?: boolean;
    goalResume?: SessionGoalOperation & { action: "resume" };
  },
) {
  const normalizedRequest = normalizeChatSendRequest({
    params,
    client,
    ...(options?.trustedSystemInput ? { trustedSystemInput: true } : {}),
    ...(options?.goalResume ? { goalResume: options.goalResume } : {}),
  });
  if (!normalizedRequest.ok) {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        normalizedRequest.error,
        normalizedRequest.reason ? { details: { reason: normalizedRequest.reason } } : undefined,
      ),
    );
    return undefined;
  }
  const { value: request } = normalizedRequest;
  const runtimeConfig = context.getRuntimeConfig?.();
  const rotationConfig = runtimeConfig?.session?.rotation;
  const mainKey = runtimeConfig?.session?.mainKey;

  // Rotation/ceiling resolve exactly once per inbound request. A target-key
  // change (epoch advance) re-prepares and re-admits the same request on the new
  // key; a mid-queue archived rejection re-resolves the newest epoch once.
  let rotationResolved = false;
  let rotationRetriesRemaining = ROTATION_RETRY_LIMIT;

  while (true) {
    if (!rotationResolved) {
      rotationResolved = true;
      const preparedRotation = prepareChatSendSession({ request, context, client });
      if (!preparedRotation.ok) {
        respond(
          false,
          undefined,
          typeof preparedRotation.error === "string"
            ? errorShape(ErrorCodes.INVALID_REQUEST, preparedRotation.error)
            : preparedRotation.error,
        );
        return undefined;
      }
      const targetSessionKey = await resolveChatSendRotationTarget({
        session: preparedRotation.value,
        rotation: rotationConfig,
        mainKey,
      });
      if (targetSessionKey !== request.p.sessionKey) {
        request.p.sessionKey = targetSessionKey;
        continue;
      }
    }

    const preparedSession = prepareChatSendSession({ request, context, client });
    if (!preparedSession.ok) {
      respond(
        false,
        undefined,
        typeof preparedSession.error === "string"
          ? errorShape(ErrorCodes.INVALID_REQUEST, preparedSession.error)
          : preparedSession.error,
      );
      return undefined;
    }
    if (request.mentions) {
      const mentions = context.mentionInbox?.validateRecipients(
        client,
        preparedSession.value.entry
          ? { sessionKey: preparedSession.value.sessionKey, agentId: preparedSession.value.agentId }
          : { agentId: preparedSession.value.agentId },
        request.mentions.map((mention) => mention.profileId),
      );
      if (!mentions?.ok) {
        respond(
          false,
          undefined,
          mentions?.error ??
            errorShape(
              ErrorCodes.UNAVAILABLE,
              "Human mentions are unavailable; reconnect and retry.",
            ),
        );
        return undefined;
      }
    }
    const shouldAdmit = await runChatSendPreAdmission({
      request,
      session: preparedSession.value,
      respond,
      context,
      client,
      assertCurrent: sessionMutationAuthorization?.assertCurrent,
    });
    if (!shouldAdmit) {
      return undefined;
    }
    const admitted = await admitChatSend({
      request,
      session: preparedSession.value,
      respond,
      context,
      client,
      onAdmissionOwned,
    });
    if (admitted?.ok) {
      return { normalizedRequest, preparedSession, admitted };
    }
    if (
      admitted &&
      "retryAfterRotation" in admitted &&
      admitted.retryAfterRotation &&
      rotationRetriesRemaining > 0
    ) {
      rotationRetriesRemaining -= 1;
      const baseKey = parseRotatedSessionKey(request.p.sessionKey)?.baseKey ?? request.p.sessionKey;
      const retryTarget = resolveSessionRotationRetryTarget(
        resolveRotationStoreScope(preparedSession.value),
        baseKey,
      );
      if (retryTarget.targetKey !== request.p.sessionKey) {
        request.p.sessionKey = retryTarget.targetKey;
        rotationResolved = true;
        continue;
      }
      // Already on the newest epoch: surface a typed refusal instead of looping.
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, "session rotated while starting work"),
      );
      return undefined;
    }
    return undefined;
  }
}
