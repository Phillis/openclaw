import { U as isMachineOutputStdoutTTY, s as hasFlag } from "./argv-CgA2urTO.js";
import { r as hasCommanderOptionValue } from "./commander-parse-facts-BpRwmsnA.js";
//#region src/cli/program/json-mode.ts
const jsonModeSymbol = Symbol("openclaw.cli.jsonMode");
const JSON_FLAG = /* @__PURE__ */ new Set(["--json"]);
function commandDefinesJsonOption(command) {
	return command.options.some((option) => option.long === "--json");
}
function getCommandJsonMode(command, argv = process.argv) {
	const rawJsonFlag = hasFlag(argv, "--json") && !hasCommanderOptionValue(command, argv, JSON_FLAG);
	const literalJsonMode = command.optsWithGlobals().json === true || rawJsonFlag;
	for (let current = command; current; current = current.parent ?? null) {
		const metadata = current[jsonModeSymbol];
		if (metadata?.resolve?.({
			command,
			argv,
			stdoutIsTTY: isMachineOutputStdoutTTY()
		})) return metadata.mode;
		if (metadata && !metadata.resolve && literalJsonMode) return metadata.mode;
		if (literalJsonMode && commandDefinesJsonOption(current)) return "output";
	}
	return null;
}
/** Mark a command as having a special JSON mode beyond ordinary `--json` output. */
function setCommandJsonMode(command, mode, resolve) {
	command[jsonModeSymbol] = {
		mode,
		...resolve ? { resolve } : {}
	};
	return command;
}
/** Return true when the command's active mode owns machine-readable JSON stdout. */
function isCommandJsonOutputMode(command, argv = process.argv) {
	return getCommandJsonMode(command, argv) === "output";
}
//#endregion
export { setCommandJsonMode as n, isCommandJsonOutputMode as t };
