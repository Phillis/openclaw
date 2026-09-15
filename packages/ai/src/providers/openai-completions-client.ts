/** OpenAI SDK client construction for the openai-completions direct provider path. */
import OpenAI from "openai";
import { getAiTransportHost } from "../host.js";
import {
  resolveOpenAICompletionsCompat,
  type ResolvedOpenAICompletionsCompat,
} from "../transports/openai-completions-compat.js";
import { resolveOpenAIClientBaseUrl } from "../transports/openai-transport-shared.js";
import type { Context, Model } from "../types.js";
import { isCloudflareProvider, resolveCloudflareBaseUrl } from "./cloudflare.js";
import { buildCopilotDynamicHeaders, hasCopilotVisionInput } from "./github-copilot-headers.js";

export function createClient(
  model: Model<"openai-completions">,
  context: Context,
  apiKey?: string,
  optionsHeaders?: Record<string, string>,
  sessionId?: string,
  compat: ResolvedOpenAICompletionsCompat = resolveOpenAICompletionsCompat(model),
) {
  if (!apiKey) {
    throw new Error(`No API key for provider: ${model.provider}`);
  }

  const headers = { ...model.headers };
  if (model.provider === "github-copilot") {
    const hasImages = hasCopilotVisionInput(context.messages);
    const copilotHeaders = buildCopilotDynamicHeaders({
      messages: context.messages,
      hasImages,
    });
    Object.assign(headers, copilotHeaders);
  }

  if (sessionId && compat.sessionAffinity !== "none") {
    if (compat.sessionAffinity === "openrouter") {
      headers["x-session-id"] = sessionId;
    } else {
      headers.session_id = sessionId;
      headers["x-client-request-id"] = sessionId;
      headers["x-session-affinity"] = sessionId;
    }
  }

  // Merge options headers last so they can override defaults
  if (optionsHeaders) {
    Object.assign(headers, optionsHeaders);
  }

  const defaultHeaders =
    model.provider === "cloudflare-ai-gateway"
      ? {
          ...headers,
          Authorization: headers.Authorization ?? null,
          "cf-aig-authorization": `Bearer ${apiKey}`,
        }
      : headers;

  const baseUrl = isCloudflareProvider(model.provider)
    ? resolveCloudflareBaseUrl(model)
    : model.baseUrl;
  return new OpenAI({
    apiKey,
    baseURL: resolveOpenAIClientBaseUrl(model, baseUrl),
    dangerouslyAllowBrowser: true,
    defaultHeaders,
    maxRetries: 0,
    // OpenAI supports custom fetch, so sentinels stay opaque until guarded egress.
    fetch: getAiTransportHost().buildModelFetch(model),
  });
}
