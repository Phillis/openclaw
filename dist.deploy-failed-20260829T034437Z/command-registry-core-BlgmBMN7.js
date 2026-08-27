import { K as getCoreCliCommandDescriptors, q as getCoreCliCommandNamesCore } from "./argv-CCdO9MSu.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DXuFeGZ6.js";
import { r as shouldRegisterPrimaryCommandOnly } from "./command-registration-policy-ybElENX5.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-BkLZKevi.js";
import { a as defineImportedCommandGroupSpec, i as buildCommandGroupEntries, o as defineImportedProgramCommandGroupSpecs } from "./register.subclis-core-BMVY-VXC.js";
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
			loadModule: () => import("./register.setup-DXBbhOY0.js"),
			exportName: "registerSetupCommand"
		},
		{
			commandNames: ["onboard"],
			loadModule: () => import("./register.onboard-Dy8CspFu.js"),
			exportName: "registerOnboardCommand"
		},
		{
			commandNames: ["configure"],
			loadModule: () => import("./register.configure-jEslM01b.js"),
			exportName: "registerConfigureCommand"
		},
		{
			commandNames: ["config"],
			loadModule: () => import("./config-cli-DoomYwAr.js"),
			exportName: "registerConfigCli"
		},
		{
			commandNames: ["claws"],
			loadModule: () => import("./claws-cli-1_xo1N21.js"),
			exportName: "registerClawsCli"
		},
		{
			commandNames: ["backup"],
			loadModule: () => import("./register.backup-C20a4Nks.js"),
			exportName: "registerBackupCommand"
		},
		{
			commandNames: ["database"],
			loadModule: () => import("./register.database-D0BxHzUw.js"),
			exportName: "registerDatabaseCommand"
		},
		{
			commandNames: ["migrate"],
			loadModule: () => import("./register.migrate-BvIOyD07.js"),
			exportName: "registerMigrateCommand"
		},
		{
			commandNames: ["audit"],
			loadModule: () => import("./register.audit-DJWjymuh.js"),
			exportName: "registerAuditCommand"
		},
		{
			commandNames: [
				"doctor",
				"triage",
				"dashboard",
				"reset",
				"uninstall"
			],
			loadModule: () => import("./register.maintenance-wbbQwH4p.js"),
			exportName: "registerMaintenanceCommands"
		}
	])),
	defineImportedCommandGroupSpec(["message"], () => import("./register.message-B4ycUYWW.js"), (mod, { program, ctx }) => {
		mod.registerMessageCommands(program, ctx);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: ["mcp"],
		loadModule: () => import("./mcp-cli-CYU8vrXK.js"),
		exportName: "registerMcpCli"
	}, {
		commandNames: ["transcripts"],
		loadModule: () => import("./register.transcripts-DAw-Tgvz.js"),
		exportName: "registerTranscriptsCli"
	}])),
	defineImportedCommandGroupSpec(["agent"], () => import("./register.agent-turn-Da54c8Ko.js"), (mod, { program, ctx }) => {
		mod.registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions });
	}),
	defineImportedCommandGroupSpec(["agents"], () => import("./register.agent-Bjs70NBa.js"), (mod, { program }) => {
		mod.registerAgentsCommands(program);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: [
			"status",
			"health",
			"sessions",
			"tasks"
		],
		loadModule: () => import("./register.status-health-sessions-EwDSsXOb.js"),
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
