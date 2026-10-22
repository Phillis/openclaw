import {
  assertOperatorModelAllowed,
  bindOperatorModelExecution,
  type AdmittedRunOperatorAuthority,
} from "../../agents/admitted-run-context.js";
import type { ModelRef } from "../../agents/model-ref-shared.js";
import {
  captureGatewayToolCallerAssertion,
  withoutGatewayToolCallerIdentity,
} from "../../agents/tools/gateway-caller-context.js";
import { captureAmbientGatewayOperatorAuthority } from "../../gateway/operator-invocation-authority.js";
import { runWithAsyncWorkResources } from "../../shared/async-work-resources.js";
import {
  getPluginRuntimeGatewayRequestScope,
  withPluginRuntimeGatewayRequestScope,
} from "./gateway-request-scope.js";
import type { PluginRuntimeGatewayRequestScope } from "./gateway-request-scope.types.js";
import { createLlmOperatorAuthorizationError } from "./runtime-llm-error.js";
import type { LlmCompleteCaller, LlmCompleteParams, LlmCompleteResult } from "./types-core.js";

type CompletionOperatorSource = {
  operatorAuthority?: AdmittedRunOperatorAuthority;
  signal?: AbortSignal;
  assertCurrent: () => void;
  assertModelAllowed: (model: ModelRef | undefined) => void;
  bindModelExecution: (
    model: ModelRef | undefined,
  ) => ReturnType<typeof bindOperatorModelExecution>;
};

function withOperatorAuthorization<T>(check: () => T): T {
  try {
    return check();
  } catch (cause) {
    throw createLlmOperatorAuthorizationError(cause);
  }
}

/** True when the ambient authority a completion would inherit is already gone. */
function isAmbientCompletionAuthorityDead(): boolean {
  const callerAssertion = captureGatewayToolCallerAssertion();
  if (callerAssertion) {
    try {
      callerAssertion();
    } catch {
      return true;
    }
  }
  const scope = getPluginRuntimeGatewayRequestScope();
  return scope?.hasCurrentClientAuthority?.() === false || scope?.signal?.aborted === true;
}

/**
 * Detach one completion from its finished launching turn. Keeps plugin
 * attribution for caller and policy lookup, drops the request-local client
 * and context facts of the finished turn.
 */
function runDetachedFromFinishedTurn<T>(run: () => T): T {
  const scope = getPluginRuntimeGatewayRequestScope();
  const detached: PluginRuntimeGatewayRequestScope = { isWebchatConnect: () => false };
  if (scope?.pluginId) {
    detached.pluginId = scope.pluginId;
  }
  if (scope?.pluginSource !== undefined) {
    detached.pluginSource = scope.pluginSource;
  }
  if (scope?.pluginOrigin !== undefined) {
    detached.pluginOrigin = scope.pluginOrigin;
  }
  if (scope?.pluginTrustedOfficialInstall !== undefined) {
    detached.pluginTrustedOfficialInstall = scope.pluginTrustedOfficialInstall;
  }
  return withoutGatewayToolCallerIdentity(() =>
    withPluginRuntimeGatewayRequestScope(detached, run),
  );
}

/** Keep the original requester through preparation, provider work, and asynchronous cleanup. */
export function bindLlmOperatorAuthority(
  hostCaller: LlmCompleteCaller | undefined,
  complete: (
    params: LlmCompleteParams,
    source: CompletionOperatorSource,
  ) => Promise<LlmCompleteResult>,
): (params: LlmCompleteParams) => Promise<LlmCompleteResult> {
  return (input) => {
    const params = { ...input };
    const dispatchCompletion = (): Promise<LlmCompleteResult> =>
      runWithAsyncWorkResources(async (onAcquired) => {
        // Only the host-issued context-engine capability identifies bounded system maintenance.
        // A request's caller/purpose fields cannot change its execution authority.
        if (hostCaller?.kind === "context-engine") {
          return await complete(params, {
            signal: params.signal,
            assertCurrent: () => {},
            assertModelAllowed: () => {},
            bindModelExecution: () => undefined,
          });
        }
        const capturedOperator = await captureAmbientGatewayOperatorAuthority({
          missingBindingError: () =>
            new Error("Plugin model completion requires its current Gateway binding."),
          retainInherited: true,
        }).catch((cause: unknown) => {
          throw createLlmOperatorAuthorizationError(cause);
        });
        const resources = new AsyncDisposableStack();
        if (capturedOperator?.release) {
          resources.defer(capturedOperator.release);
        }
        onAcquired({ release: () => resources.disposeAsync() });
        const operatorAuthority = capturedOperator?.authority;
        const signal = operatorAuthority?.signal
          ? params.signal
            ? AbortSignal.any([params.signal, operatorAuthority.signal])
            : operatorAuthority.signal
          : params.signal;
        // Operator currency only: the caller's own abort settles through the provider result.
        const assertCurrent = () => {
          withOperatorAuthorization(() => {
            capturedOperator.assertInvocationCurrent?.();
            operatorAuthority?.assertCurrent();
          });
        };
        assertCurrent();
        return await complete(params, {
          operatorAuthority,
          signal,
          assertCurrent,
          assertModelAllowed: (model) =>
            withOperatorAuthorization(() => assertOperatorModelAllowed(operatorAuthority, model)),
          bindModelExecution: (model) => {
            const execution = bindOperatorModelExecution(
              operatorAuthority,
              model,
              createLlmOperatorAuthorizationError,
            );
            if (execution) {
              resources.defer(execution.release);
            }
            return execution;
          },
        });
      });
    // Completions dispatched while the ambient turn's caller authority is
    // already dead are process-owned background work (context-engine
    // compaction, scheduler drains); they must not assert the finished turn.
    if (isAmbientCompletionAuthorityDead()) {
      return runDetachedFromFinishedTurn(dispatchCompletion);
    }
    return dispatchCompletion();
  };
}
