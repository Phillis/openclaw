import { _r as OpenClawPluginNodeHostCommandIo, gr as spawnTerminalPty } from "../types-BJ8oTDFw.js";

//#region src/node-host/pty-command.d.ts
type NodePtyCommandResult = {
  exitCode: number;
  signal?: number;
};
type NodePtyResumeParams = {
  threadId: string;
  cwd?: string;
  cols: number;
  rows: number;
};
declare function decodeNodePtyResumeParams(paramsJSON: string | null | undefined, validateThreadId: (value: unknown) => string): NodePtyResumeParams;
/** Runs one allowlisted plugin-owned command in an interactive node PTY. */
declare function runNodePtyCommand(params: {
  file: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string>;
  pathEnv?: string;
  cols: number;
  rows: number;
}, io: OpenClawPluginNodeHostCommandIo, spawn?: typeof spawnTerminalPty): Promise<NodePtyCommandResult>;
//#endregion
//#region src/node-host/invoke-agent-cli-claude-params.d.ts
/** Claude CLI session ids are bounded, non-option argv values. */
declare function validateClaudeSessionId(value: unknown): string;
//#endregion
//#region src/plugin-sdk/node-host.d.ts
/** Resolve a node-host executable using the selected PATH source policy. */
declare function resolveNodeHostExecutable(executable: string, options: {
  env?: NodeJS.ProcessEnv;
  pathEnv?: string;
  includeExtensionless?: boolean;
  strategy: "direct" | "fallback" | "prefer";
}): {
  executable: string;
  pathEnv?: string;
} | undefined;
//#endregion
export { type NodePtyCommandResult, type NodePtyResumeParams, type OpenClawPluginNodeHostCommandIo, decodeNodePtyResumeParams, resolveNodeHostExecutable, runNodePtyCommand, validateClaudeSessionId };