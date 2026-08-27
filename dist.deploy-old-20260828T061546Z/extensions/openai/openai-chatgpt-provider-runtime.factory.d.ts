import "../../runtime-env-DCgw_M5Q.js";
import { n as refreshOpenAICodexToken } from "../../openai-chatgpt-oauth-flow.runtime-CjOCJ-kr.js";
//#region src/infra/net/undici-global-dispatcher.d.ts
/** Installs the env-proxy global dispatcher once proxy env is available. */
declare function ensureGlobalUndiciEnvProxyDispatcher(): void;
//#endregion
//#region extensions/openai/openai-chatgpt-provider-runtime.factory.d.ts
type OpenAICodexProviderRuntimeDeps = {
  ensureGlobalUndiciEnvProxyDispatcher: typeof ensureGlobalUndiciEnvProxyDispatcher;
  refreshOpenAICodexToken: typeof refreshOpenAICodexToken;
};
declare function createOpenAICodexProviderRuntime(deps: OpenAICodexProviderRuntimeDeps): {
  refreshOpenAICodexToken: typeof refreshOpenAICodexToken;
};
//#endregion
export { createOpenAICodexProviderRuntime };