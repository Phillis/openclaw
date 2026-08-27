import { n as VERSION, r as resolveRuntimeServiceVersion } from "../version-CR3y7QSr.js";
import { t as formatCliCommand } from "../command-format-CUz7-yqH.js";
import { n as formatHelpExamples, r as runCommandWithRuntime, t as theme } from "../theme-DEeEiwE7.js";
import { Command } from "commander";

//#region src/cli/parse-duration.d.ts
/** Options for choosing the unit used by bare numeric duration values. */
type DurationMsParseOptions = {
  defaultUnit?: "ms" | "s" | "m" | "h" | "d";
};
/** Parse a non-negative duration into milliseconds, supporting single and composite units. */
declare function parseDurationMs(raw: string, opts?: DurationMsParseOptions): number;
//#endregion
//#region src/cli/command-options.d.ts
declare function inheritOptionFromParent<T = unknown>(command: Command | undefined, name: string): T | undefined;
//#endregion
//#region src/cli/program/register-command-groups.d.ts
/** Placeholder command shown before its lazy group is loaded. */
type CommandGroupPlaceholder = {
  name: string;
  description: string;
  options?: readonly CommandGroupPlaceholderOption[];
};
/** Commander option metadata attached to a lazy placeholder. */
type CommandGroupPlaceholderOption = {
  flags: string;
  description: string;
};
/** A lazily registered command group and the names it owns. */
type CommandGroupEntry = {
  placeholders: readonly CommandGroupPlaceholder[];
  names?: readonly string[];
  register: (program: Command) => Promise<void> | void;
};
/** Register command groups either eagerly or as lazy placeholders for startup speed. */
declare function registerCommandGroups(program: Command, entries: readonly CommandGroupEntry[], params: {
  eager: boolean;
  primary: string | null;
  registerPrimaryOnly: boolean;
}): void;
//#endregion
//#region src/cli/argv-invocation.d.ts
type CliArgvInvocation = {
  argv: string[];
  commandPath: string[];
  primary: string | null;
  hasHelpOrVersion: boolean;
  isRootHelpInvocation: boolean;
};
/** Resolves command path and help/version mode from a raw process argv array. */
declare function resolveCliArgvInvocation(argv: string[]): CliArgvInvocation;
//#endregion
//#region src/cli/command-registration-policy.d.ts
declare function shouldEagerRegisterSubcommands(env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region packages/terminal-core/src/note.d.ts
declare function note(message: unknown, title?: string): void;
//#endregion
//#region packages/terminal-core/src/prompt-style.d.ts
/** Style a prompt title when rich terminal output is active. */
declare const stylePromptTitle: (title?: string) => string | undefined;
//#endregion
export { type CommandGroupEntry, type CommandGroupPlaceholder, VERSION, formatCliCommand, formatHelpExamples, inheritOptionFromParent, note, parseDurationMs, registerCommandGroups, resolveCliArgvInvocation, resolveRuntimeServiceVersion, runCommandWithRuntime, shouldEagerRegisterSubcommands, stylePromptTitle, theme };