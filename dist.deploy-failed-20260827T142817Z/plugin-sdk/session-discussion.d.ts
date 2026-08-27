import { no as SessionDiscussionProvider, ro as SessionDiscussionState, to as SessionDiscussionInfo } from "../host-capability-types-3XBDy-df.js";

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
  mainKey?: string;
  shortIdLength?: number;
};
declare function buildControlUiSessionPath(params: BuildControlUiSessionPathParams): string | null;
//#endregion
export { type SessionDiscussionInfo, type SessionDiscussionProvider, type SessionDiscussionState, buildControlUiSessionPath, registerSessionDiscussionProvider };