import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { c as OLLAMA_DEFAULT_COST, l as OLLAMA_DEFAULT_MAX_TOKENS, o as OLLAMA_DEFAULT_BASE_URL, p as resolveOllamaSetupDefaultBaseUrl, s as OLLAMA_DEFAULT_CONTEXT_WINDOW, u as OLLAMA_DEFAULT_MODEL } from "../../defaults-BNbpVpwQ.js";
import { c as enrichOllamaModelsWithContext, f as isReasoningModelHeuristic, g as resolveOllamaApiBase, i as buildOllamaProvider, m as queryOllamaModelShowInfo, p as queryOllamaContextWindow, r as buildOllamaModelDefinition, u as fetchOllamaModels } from "../../provider-models-CWO5T2xP.js";
import { c as shouldInjectOllamaCompatNumCtx, i as resolveOllamaCompatNumCtxEnabled, n as isOllamaCompatProvider, t as createConfiguredOllamaCompatStreamWrapper, u as wrapOllamaCompatNumCtx } from "../../stream-compat-D7W_cGHP.js";
import { r as buildOllamaChatRequest } from "../../stream-api-DgQvq5D1.js";
//#region extensions/ollama/src/setup.ts
const loadOllamaSetupRuntime = createLazyRuntimeModule(() => import("../../setup.runtime-BBnSkvfj.js"));
const promptAndConfigureOllama = async (...args) => await (await loadOllamaSetupRuntime()).promptAndConfigureOllama(...args);
const configureOllamaNonInteractive = async (...args) => await (await loadOllamaSetupRuntime()).configureOllamaNonInteractive(...args);
const ensureOllamaModelPulled = async (...args) => await (await loadOllamaSetupRuntime()).ensureOllamaModelPulled(...args);
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MAX_TOKENS, OLLAMA_DEFAULT_MODEL, buildOllamaChatRequest, buildOllamaModelDefinition, buildOllamaProvider, configureOllamaNonInteractive, createConfiguredOllamaCompatStreamWrapper, enrichOllamaModelsWithContext, ensureOllamaModelPulled, fetchOllamaModels, isOllamaCompatProvider, isReasoningModelHeuristic, promptAndConfigureOllama, queryOllamaContextWindow, queryOllamaModelShowInfo, resolveOllamaApiBase, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };
