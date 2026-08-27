import { Sl as SessionDiscussionState, bl as SessionDiscussionInfo, xl as SessionDiscussionProvider } from "../agent-harness-runtime-CESurA0d.js";
//#region src/plugins/session-discussion-registry.d.ts
declare function registerSessionDiscussionProvider(provider: SessionDiscussionProvider): void;
//#endregion
//#region packages/session-url-contract/src/index.d.ts
type ControlUiSessionNamespace = "chat" | "dashboard";
type BuildControlUiSessionPathParams = {
  namespace: ControlUiSessionNamespace;
  sessionKey: string;
  fallbackAgentId?: string;
  basePath?: string;
  displayName?: string;
  exactKey?: boolean;
  mainKey?: string;
  shortIdLength?: number;
};
declare function buildControlUiSessionPath(params: BuildControlUiSessionPathParams): string | null;
//#endregion
export { type SessionDiscussionInfo, type SessionDiscussionProvider, type SessionDiscussionState, buildControlUiSessionPath, registerSessionDiscussionProvider };