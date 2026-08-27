//#region extensions/xai/model-id.d.ts
declare const XAI_OAUTH_AUTO_MODEL_ID = "auto";
declare function isXaiGrok46ModelId(id: string): boolean;
declare function isXaiFrontierModelId(id: string): boolean;
declare function resolveXaiOAuthAutoModelId(id: string, params?: Record<string, unknown> | null): string;
declare function normalizeXaiModelId(id: string): string;
//#endregion
export { resolveXaiOAuthAutoModelId as a, normalizeXaiModelId as i, isXaiFrontierModelId as n, isXaiGrok46ModelId as r, XAI_OAUTH_AUTO_MODEL_ID as t };