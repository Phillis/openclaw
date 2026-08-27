import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { c as OLLAMA_DEFAULT_COST, l as OLLAMA_DEFAULT_MAX_TOKENS, m as resolveOllamaSetupDefaultBaseUrl, o as OLLAMA_DEFAULT_BASE_URL, s as OLLAMA_DEFAULT_CONTEXT_WINDOW, u as OLLAMA_DEFAULT_MODEL } from "../../defaults-BiE2_Zq0.js";
import { _ as queryOllamaModelShowInfo, c as enrichOllamaModelsWithContext, g as queryOllamaContextWindow, i as buildOllamaProvider, m as isReasoningModelHeuristic, r as buildOllamaModelDefinition, u as fetchOllamaModels, y as resolveOllamaApiBase } from "../../provider-models-DnO-MBUW.js";
import { c as shouldInjectOllamaCompatNumCtx, i as resolveOllamaCompatNumCtxEnabled, n as isOllamaCompatProvider, t as createConfiguredOllamaCompatStreamWrapper, u as wrapOllamaCompatNumCtx } from "../../stream-compat-GxaWgL_K.js";
import { r as buildOllamaChatRequest } from "../../stream-api-3xagePNz.js";
//#region extensions/ollama/src/setup.ts
const loadOllamaSetupRuntime = createLazyRuntimeModule(() => import("../../setup.runtime-BFPR1qGD.js"));
const promptAndConfigureOllama = async (...args) => await (await loadOllamaSetupRuntime()).promptAndConfigureOllama(...args);
const configureOllamaNonInteractive = async (...args) => await (await loadOllamaSetupRuntime()).configureOllamaNonInteractive(...args);
const ensureOllamaModelPulled = async (...args) => await (await loadOllamaSetupRuntime()).ensureOllamaModelPulled(...args);
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MAX_TOKENS, OLLAMA_DEFAULT_MODEL, buildOllamaChatRequest, buildOllamaModelDefinition, buildOllamaProvider, configureOllamaNonInteractive, createConfiguredOllamaCompatStreamWrapper, enrichOllamaModelsWithContext, ensureOllamaModelPulled, fetchOllamaModels, isOllamaCompatProvider, isReasoningModelHeuristic, promptAndConfigureOllama, queryOllamaContextWindow, queryOllamaModelShowInfo, resolveOllamaApiBase, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };
