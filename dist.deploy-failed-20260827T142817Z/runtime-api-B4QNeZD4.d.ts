import { A as OutputRuntimeEnv } from "./manifest-registry-BJDg-GrV.js";
//#region src/plugin-sdk/runtime-logger.internal.d.ts
type LoggerLike = {
  info: (message: string) => void;
  error: (message: string) => void;
};
declare function createLoggerBackedRuntime(params: {
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): OutputRuntimeEnv;
//#endregion
export { createLoggerBackedRuntime as t };