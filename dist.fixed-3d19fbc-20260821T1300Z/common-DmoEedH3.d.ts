import { i as AgentToolUpdateCallback, n as AgentTool, r as AgentToolResult } from "./types-smxqDTIJ.js";
import { TSchema } from "typebox";

//#region src/agents/tools/common.d.ts
type AgentToolWithMeta<TParameters extends TSchema, TResult> = AgentTool<TParameters, TResult> & {
  displaySummary?: string; /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only"; /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  prepareBeforeToolCallParams?: (params: unknown, ctx: {
    toolCallId?: string;
    hookContext?: unknown;
    signal?: AbortSignal;
  }) => unknown;
  finalizeBeforeToolCallParams?: (params: unknown, preparedParams: unknown) => unknown;
};
type ErasedAgentToolExecute = {
  execute(this: void, toolCallId: string, params: unknown, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback): Promise<AgentToolResult<unknown>>;
};
type AnyAgentTool = Omit<AgentTool, "execute"> & ErasedAgentToolExecute & {
  displaySummary?: string; /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only"; /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  prepareBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["prepareBeforeToolCallParams"];
  finalizeBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["finalizeBeforeToolCallParams"];
};
//#endregion
export { AnyAgentTool as t };