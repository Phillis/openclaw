import { B as VideoContent, L as ProviderContext, R as ProviderModel, z as ProviderStreamOptions } from "./types-Ci1t4mxf.js";
import { m as Context, v as SimpleStreamOptions } from "./types.openclaw-CpYrAZv3.js";
import { ln as StreamFn } from "./setup-wizard-types-DUwZ9UvR.js";
import { i as GoogleThinkingLevel } from "./thinking-B5Lg0Jvi.js";
//#region extensions/google/transport-stream.d.ts
type CanonicalGoogleTransportApi = "google-generative-ai" | "google-vertex";
type GoogleTransportApi = CanonicalGoogleTransportApi | "openclaw-google-generative-ai-transport";
type GoogleTransportModel = ProviderModel<GoogleTransportApi> & {
  headers?: Record<string, string>;
  provider: string;
};
type GoogleTransportOptions = SimpleStreamOptions & ProviderStreamOptions & {
  cachedContent?: string;
  toolChoice?: "auto" | "none" | "any" | "required" | {
    type: "function";
    function: {
      name: string;
    };
  };
  thinking?: {
    enabled: boolean;
    budgetTokens?: number;
    level?: GoogleThinkingLevel;
  };
};
type GoogleGenerateContentRequest = {
  cachedContent?: string;
  contents: Array<Record<string, unknown>>;
  generationConfig?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
  tools?: Array<Record<string, unknown>>;
  toolConfig?: Record<string, unknown>;
};
type GoogleVideoSlots = Map<Record<string, unknown>, VideoContent>;
declare function buildGoogleGenerativeAiParams(model: GoogleTransportModel, context: Context | ProviderContext, options?: GoogleTransportOptions, videoSlots?: GoogleVideoSlots): GoogleGenerateContentRequest;
declare function createGoogleGenerativeAiTransportStreamFn(): StreamFn;
declare function createGoogleVertexTransportStreamFn(): StreamFn;
//#endregion
export { createGoogleGenerativeAiTransportStreamFn as n, createGoogleVertexTransportStreamFn as r, buildGoogleGenerativeAiParams as t };