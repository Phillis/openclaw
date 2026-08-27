import "./index-BSAlQ8TI.js";
import { r as AgentToolResult } from "./types-CPd3N9Q-.js";
//#region src/agents/tools/tool-results.d.ts
declare function textResult<TDetails>(text: string, details: TDetails): AgentToolResult<TDetails>;
declare function jsonResult<TDetails>(payload: TDetails): AgentToolResult<TDetails>;
//#endregion
export { textResult as n, jsonResult as t };