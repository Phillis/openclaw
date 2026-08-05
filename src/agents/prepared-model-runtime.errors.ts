export const PREPARED_MODEL_RUNTIME_OWNER_NOT_PUBLISHED_CODE =
  "prepared_model_runtime_owner_not_published";

export class PreparedModelRuntimeOwnerNotPublishedError extends Error {
  readonly code = PREPARED_MODEL_RUNTIME_OWNER_NOT_PUBLISHED_CODE;

  constructor(message?: string) {
    super(message);
    this.name = "PreparedModelRuntimeOwnerNotPublishedError";
  }
}

export class PreparedModelRuntimePublicationSupersededError extends PreparedModelRuntimeOwnerNotPublishedError {}

export function toPreparedModelRuntimeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
