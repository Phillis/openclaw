import { I as getCoreCliCommandDescriptors, L as getCoreCliCommandNamesCore } from "./argv-CgA2urTO.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CtNEO_uG.js";
import { r as shouldRegisterPrimaryCommandOnly } from "./command-registration-policy-vJ2VPNBY.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-BzMV3EqD.js";
import { a as defineImportedCommandGroupSpec, i as buildCommandGroupEntries, o as defineImportedProgramCommandGroupSpecs } from "./register.subclis-core-DHVAxg3V.js";
//#region src/cli/program/command-registry-core.ts
function withProgramOnlySpecs(specs) {
	return specs.map((spec) => ({
		commandNames: spec.commandNames,
		register: async ({ program }) => {
			await spec.register(program);
		}
	}));
}
const coreEntrySpecs = [
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([
		{
			commandNames: ["setup", "crestodian"],
			loadModule: () => import("./register.setup-BLVnWF_V.js"),
			exportName: "registerSetupCommand"
		},
		{
			commandNames: ["onboard"],
			loadModule: () => import("./register.onboard-eB3bUJXZ.js"),
			exportName: "registerOnboardCommand"
		},
		{
			commandNames: ["configure"],
			loadModule: () => import("./register.configure-DS_ybedw.js"),
			exportName: "registerConfigureCommand"
		},
		{
			commandNames: ["config"],
			loadModule: () => import("./config-cli-r-vLYUFp.js"),
			exportName: "registerConfigCli"
		},
		{
			commandNames: ["claws"],
			loadModule: () => import("./claws-cli-HpKqy8wZ.js"),
			exportName: "registerClawsCli"
		},
		{
			commandNames: ["backup"],
			loadModule: () => import("./register.backup-z9JY3Kw2.js"),
			exportName: "registerBackupCommand"
		},
		{
			commandNames: ["database"],
			loadModule: () => import("./register.database-ler90atb.js"),
			exportName: "registerDatabaseCommand"
		},
		{
			commandNames: ["migrate"],
			loadModule: () => import("./register.migrate-CEWKklxY.js"),
			exportName: "registerMigrateCommand"
		},
		{
			commandNames: ["audit"],
			loadModule: () => import("./register.audit-BEGtExsN.js"),
			exportName: "registerAuditCommand"
		},
		{
			commandNames: [
				"doctor",
				"dashboard",
				"reset",
				"uninstall"
			],
			loadModule: () => import("./register.maintenance-D1Taeq3k.js"),
			exportName: "registerMaintenanceCommands"
		}
	])),
	defineImportedCommandGroupSpec(["message"], () => import("./register.message-DON2mnqV.js"), (mod, { program, ctx }) => {
		mod.registerMessageCommands(program, ctx);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: ["mcp"],
		loadModule: () => import("./mcp-cli-B1TKUmkG.js"),
		exportName: "registerMcpCli"
	}, {
		commandNames: ["transcripts"],
		loadModule: () => import("./register.transcripts-DpzHrv0c.js"),
		exportName: "registerTranscriptsCli"
	}])),
	defineImportedCommandGroupSpec(["agent"], () => import("./register.agent-turn-ogSPp98U.js"), (mod, { program, ctx }) => {
		mod.registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions });
	}),
	defineImportedCommandGroupSpec(["agents"], () => import("./register.agent-nNKzbeqA.js"), (mod, { program }) => {
		mod.registerAgentsCommands(program);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: [
			"status",
			"health",
			"sessions",
			"tasks"
		],
		loadModule: () => import("./register.status-health-sessions-eE5jNU5i.js"),
		exportName: "registerStatusHealthSessionsCommands"
	}]))
];
function resolveCoreCommandGroups(ctx, argv) {
	const descriptors = getCoreCliCommandDescriptors();
	const visibleCommandNames = new Set(descriptors.map((descriptor) => descriptor.name));
	return buildCommandGroupEntries(descriptors, coreEntrySpecs.filter((spec) => spec.commandNames.every((name) => visibleCommandNames.has(name))), (register) => async (program) => {
		await register({
			program,
			ctx,
			argv
		});
	});
}
function getCoreCliCommandNames() {
	return getCoreCliCommandNamesCore();
}
async function registerCoreCliByName(program, ctx, name, argv = process.argv) {
	return registerCommandGroupByName(program, resolveCoreCommandGroups(ctx, argv), name);
}
function registerCoreCliCommands(program, ctx, argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, resolveCoreCommandGroups(ctx, argv), {
		eager: false,
		primary,
		registerPrimaryOnly: Boolean(primary && shouldRegisterPrimaryCommandOnly(argv))
	});
}
//#endregion
export { registerCoreCliByName as n, registerCoreCliCommands as r, getCoreCliCommandNames as t };
