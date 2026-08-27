import { t as HookHandler } from "../../hooks-Dqbg5xKV.js";
//#region src/hooks/bundled/session-memory/handler.d.ts
declare function flushSessionMemoryWritesForTest(): Promise<void>;
declare const saveSessionToMemory: HookHandler;
//#endregion
export { saveSessionToMemory as default, flushSessionMemoryWritesForTest };