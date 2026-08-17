import { PreparedModelRuntimeOwnerNotPublishedError } from "../agents/prepared-model-runtime.js";
import {
  buildSessionObserverPrompt,
  normalizeSessionObserverModelOutput,
  SESSION_OBSERVER_MODEL_MAX_TOKENS,
  SESSION_OBSERVER_SYSTEM_PROMPT,
} from "./session-observer-model.js";
import type { SessionObserverDeps, SessionObserverState } from "./session-observer-model.js";

const MODEL_TIMEOUT_MS = 10_000;

type PrepareModel = NonNullable<SessionObserverDeps["prepareModel"]>;
type CompleteModel = NonNullable<SessionObserverDeps["completeModel"]>;

/**
 * Marks a transient prepareModel failure (PreparedModelRuntimeOwnerNotPublishedError
 * — code `prepared_model_runtime_owner_not_published`, includes its
 * PublicationSuperseded subclass). The run-digest catch treats this as
 * non-fatal so a long-lived owner-not-published condition cannot disable
 * the observer after two cycles; the next observer attempt must re-prepare.
 */
export class SessionObserverPrepareTransientError extends Error {
  readonly cause: unknown;
  constructor(cause: unknown) {
    super("session observer prepare failed transiently", { cause });
    this.name = "SessionObserverPrepareTransientError";
  }
}

export function createSessionObserverCompletion(params: {
  getConfig: SessionObserverDeps["getConfig"];
  prepareModel: PrepareModel;
  completeModel: CompleteModel;
  now: () => number;
  setTimeoutFn: typeof setTimeout;
  clearTimeoutFn: typeof clearTimeout;
  isCurrent: (state: SessionObserverState) => boolean;
}) {
  const ensurePrepared = async (state: SessionObserverState) => {
    const modelRef = state.utilityModelRef;
    if (!modelRef) {
      throw new Error("session observer utility model is unavailable");
    }
    if (!state.preparedPromise) {
      state.preparedPromise = params.prepareModel({
        cfg: params.getConfig(),
        agentId: state.agentId,
        modelRef,
        useUtilityModel: true,
        allowMissingApiKeyModes: ["aws-sdk"],
      });
    }
    const promise = state.preparedPromise;
    try {
      return await promise;
    } catch (error) {
      // Always release the rejected slot when it is still the cached promise so
      // the next observer attempt re-prepares; transient prepareModel failures
      // throw a marker the run-digest catch recognizes and skips the disable
      // counter for, so owner-not-published conditions stay retryable.
      if (state.preparedPromise === promise) {
        state.preparedPromise = undefined;
      }
      if (error instanceof PreparedModelRuntimeOwnerNotPublishedError) {
        throw new SessionObserverPrepareTransientError(error);
      }
      throw error;
    }
  };

  return async (state: SessionObserverState, notes: readonly string[]) => {
    const controller = new AbortController();
    state.activeController = controller;
    const timeout = params.setTimeoutFn(() => controller.abort(), MODEL_TIMEOUT_MS);
    const aborted = new Promise<never>((_resolve, reject) => {
      controller.signal.addEventListener(
        "abort",
        () => reject(new Error("session observer model call timed out or was cancelled")),
        { once: true },
      );
    });
    try {
      const execute = async () => {
        const prepared = await ensurePrepared(state);
        if (!params.isCurrent(state) || controller.signal.aborted) {
          throw new Error("session observer state is no longer active");
        }
        if ("error" in prepared) {
          throw new Error(prepared.error);
        }
        for (let attempt = 0; attempt < 2; attempt += 1) {
          if (!params.isCurrent(state) || controller.signal.aborted) {
            throw new Error("session observer state is no longer active");
          }
          const result = await params.completeModel({
            model: prepared.model,
            auth: prepared.auth,
            cfg: params.getConfig(),
            context: {
              systemPrompt: SESSION_OBSERVER_SYSTEM_PROMPT,
              messages: [
                {
                  role: "user",
                  content: buildSessionObserverPrompt(state, notes),
                  timestamp: params.now(),
                },
              ],
            },
            options: {
              maxTokens: Math.min(
                SESSION_OBSERVER_MODEL_MAX_TOKENS,
                Math.floor(prepared.model.maxTokens),
              ),
              temperature: 0.2,
              signal: controller.signal,
            },
          });
          if (result.stopReason === "error") {
            throw new Error(result.errorMessage?.trim() || "session observer completion failed");
          }
          const text = result.content
            .filter((block): block is { type: "text"; text: string } => block.type === "text")
            .map((block) => block.text)
            .join("")
            .trim();
          const parsed = normalizeSessionObserverModelOutput(text);
          if (parsed) {
            return parsed;
          }
        }
        throw new Error("session observer returned invalid JSON twice");
      };
      return await Promise.race([execute(), aborted]);
    } finally {
      params.clearTimeoutFn(timeout);
      if (state.activeController === controller) {
        state.activeController = undefined;
      }
    }
  };
}
