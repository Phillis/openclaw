import { M as UserMessage, S as TextContent, _ as SimpleStreamOptions, a as AssistantMessageEventStreamContract, c as Context, d as Model, g as ProviderStreamOptions$1, k as ToolResultMessage, l as ImageContent, n as Api, r as AssistantMessage, x as StreamOptions } from "./types-DTWCh4Mv.js";
import "./index-DspOpKBe.js";
import "./types-Cc0P-Eyx.js";
import { Agent } from "node:http";
import { ApiProvider } from "@openclaw/ai";
import { calculateCost, clampThinkingLevel, getApiProvider, getApiProviders, getEnvApiKey, parseStreamingJson, sanitizeSurrogates } from "@openclaw/ai/internal/runtime";
import { adjustMaxTokensForThinking, buildBaseOptions, clampReasoning, transformMessages } from "@openclaw/ai/internal/shared";
import { Agent as Agent$1 } from "node:https";
//#region src/llm/stream.d.ts
declare function stream<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions$1): AssistantMessageEventStreamContract;
declare function complete<TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions$1): Promise<AssistantMessage>;
declare function streamSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): AssistantMessageEventStreamContract;
declare function completeSimple<TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions): Promise<AssistantMessage>;
//#endregion
//#region packages/ai/src/provider-types.d.ts
declare const PROVIDER_CONTEXT_HANDOFF: unique symbol;
type VideoContent = Omit<ImageContent, "type"> & {
  type: "video";
};
type MediaContent = ImageContent | VideoContent;
type ModelInputContent = TextContent | MediaContent;
type ProviderUserMessage = Omit<UserMessage, "content"> & {
  content: string | ModelInputContent[];
};
type ProviderMessage = ProviderUserMessage | AssistantMessage | ToolResultMessage;
type ProviderContext = Omit<Context, "messages"> & {
  messages: ProviderMessage[];
};
type ProviderModel<TApi extends Api = Api> = Omit<Model<TApi>, "input"> & {
  input: ModelInputContent["type"][];
};
type ProviderContextHandoff = () => Promise<ProviderContext>;
type ProviderStreamOptions = StreamOptions & {
  [PROVIDER_CONTEXT_HANDOFF]?: ProviderContextHandoff;
};
type ProviderStreamFunction<TApi extends Api = Api, TOptions extends StreamOptions = ProviderStreamOptions> = (model: ProviderModel<TApi>, context: ProviderContext, options?: TOptions) => AssistantMessageEventStreamContract;
/** Resolves provider-only context without widening the canonical call contract. */
declare function resolveProviderContext(context: Context | ProviderContext, options?: ProviderStreamOptions): Promise<ProviderContext>;
//#endregion
//#region src/llm/utils/node-http-proxy.d.ts
/** HTTP(S) agent pair for Node fetch/client integrations that accept explicit agents. */
interface NodeHttpProxyAgents {
  httpAgent: Agent;
  httpsAgent: Agent$1;
}
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
declare function createHttpProxyAgentsForTarget(targetUrl: string | URL): NodeHttpProxyAgents | undefined;
//#endregion
export { streamSimple as C, stream as S, ProviderStreamOptions as _, clampReasoning as a, complete as b, getApiProviders as c, sanitizeSurrogates as d, transformMessages as f, ProviderStreamFunction as g, ProviderModel as h, calculateCost as i, getEnvApiKey as l, ProviderContext as m, adjustMaxTokensForThinking as n, clampThinkingLevel as o, createHttpProxyAgentsForTarget as p, buildBaseOptions as r, getApiProvider as s, ApiProvider as t, parseStreamingJson as u, VideoContent as v, completeSimple as x, resolveProviderContext as y };