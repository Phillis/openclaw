//#region extensions/anthropic/live-model-contract-gate.d.ts
/**
 * Return whether a live-discovered Claude model can be shaped by the current
 * contracts. Fails closed: a model without a readable capability tree is
 * rejected, because we cannot prove our shaping matches it.
 */
declare function acceptsAnthropicLiveModelContract(params: {
  id: string;
  record: Record<string, unknown>;
}): boolean;
//#endregion
export { acceptsAnthropicLiveModelContract };