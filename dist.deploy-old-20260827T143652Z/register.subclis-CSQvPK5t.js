import { v as getSubCliEntriesCore } from "./argv-CgA2urTO.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CtNEO_uG.js";
import { i as shouldRegisterPrimarySubcommandOnly, n as shouldEagerRegisterSubcommands } from "./command-registration-policy-vJ2VPNBY.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-BzMV3EqD.js";
import { i as buildCommandGroupEntries, n as registerSubCliByNameCore, o as defineImportedProgramCommandGroupSpecs, r as registerSubCliCommandsCore } from "./register.subclis-core-77a6RamR.js";
//#region src/cli/program/register.subclis.ts
const entrySpecs = [...defineImportedProgramCommandGroupSpecs([{
	commandNames: ["completion"],
	loadModule: () => import("./completion-cli-y9P2DH-2.js"),
	exportName: "registerCompletionCli"
}])];
function resolveSubCliCommandGroups(argv, context = {}) {
	return buildCommandGroupEntries(getSubCliEntriesCore(), entrySpecs, (register) => async (program) => {
		await register(program, argv, context);
	});
}
/** Register one sub-CLI by name, including lazy command groups. */
async function registerSubCliByName(program, name, argv = process.argv, context = {}) {
	if (await registerSubCliByNameCore(program, name, argv, context)) return true;
	return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}
/** Register sub-CLI commands according to eager/lazy startup policy. */
function registerSubCliCommands(program, argv = process.argv) {
	registerSubCliCommandsCore(program, argv);
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
		eager: shouldEagerRegisterSubcommands(),
		primary,
		registerPrimaryOnly: Boolean(primary && shouldRegisterPrimarySubcommandOnly(argv))
	});
}
//#endregion
export { registerSubCliCommands as n, registerSubCliByName as t };
