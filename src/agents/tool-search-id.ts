// Leaf module for Tool Search selector reads: loop detection folds the
// dispatcher inner id into typed failure identities and must not import the
// full tool-search-runtime graph (cycle through before-tool-call state).
import { asToolParamsRecord, ToolInputError } from "./tools/common.js";

function readToolSearchSelector(params: Record<string, unknown>): string | undefined {
  const value = params.id ?? params.toolId ?? params.name;
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function readToolSearchId(args: unknown): string {
  const params = asToolParamsRecord(args);
  const value = readToolSearchSelector(params);
  if (value === undefined) {
    throw new ToolInputError("id must be a non-empty string.");
  }
  return value.trim();
}

/** Non-throwing selector read for diagnostic identity folding; no error surface. */
export function tryReadToolSearchId(args: unknown): string | undefined {
  const params = asToolParamsRecord(args);
  return readToolSearchSelector(params);
}

export { readToolSearchSelector };
