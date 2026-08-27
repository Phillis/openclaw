import { K as getCoreCliCommandDescriptors, q as getCoreCliCommandNamesCore } from "./argv-CCdO9MSu.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DXuFeGZ6.js";
import { r as shouldRegisterPrimaryCommandOnly } from "./command-registration-policy-ybElENX5.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-BkLZKevi.js";
import { a as defineImportedCommandGroupSpec, i as buildCommandGroupEntries, o as defineImportedProgramCommandGroupSpecs } from "./register.subclis-core-DoernLZY.js";
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
			loadModule: () => import("./register.setup-BzWg4LVy.js"),
			exportName: "registerSetupCommand"
		},
		{
			commandNames: ["onboard"],
			loadModule: () => import("./register.onboard-I1fn93aC.js"),
			exportName: "registerOnboardCommand"
		},
		{
			commandNames: ["configure"],
			loadModule: () => import("./register.configure-CSAicYBg.js"),
			exportName: "registerConfigureCommand"
		},
		{
			commandNames: ["config"],
			loadModule: () => import("./config-cli-ChElhCE_.js"),
			exportName: "registerConfigCli"
		},
		{
			commandNames: ["claws"],
			loadModule: () => import("./claws-cli-BX4OhVIe.js"),
			exportName: "registerClawsCli"
		},
		{
			commandNames: ["backup"],
			loadModule: () => import("./register.backup-D3EMLrWO.js"),
			exportName: "registerBackupCommand"
		},
		{
			commandNames: ["database"],
			loadModule: () => import("./register.database-BJNgiMlm.js"),
			exportName: "registerDatabaseCommand"
		},
		{
			commandNames: ["migrate"],
			loadModule: () => import("./register.migrate-BSSw7zO0.js"),
			exportName: "registerMigrateCommand"
		},
		{
			commandNames: ["audit"],
			loadModule: () => import("./register.audit-DEk1jjBe.js"),
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
			loadModule: () => import("./register.maintenance-8kEpbJbF.js"),
			exportName: "registerMaintenanceCommands"
		}
	])),
	defineImportedCommandGroupSpec(["message"], () => import("./register.message-BVXeI-5F.js"), (mod, { program, ctx }) => {
		mod.registerMessageCommands(program, ctx);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: ["mcp"],
		loadModule: () => import("./mcp-cli-CLZs3CwH.js"),
		exportName: "registerMcpCli"
	}, {
		commandNames: ["transcripts"],
		loadModule: () => import("./register.transcripts-BtXAmsGM.js"),
		exportName: "registerTranscriptsCli"
	}])),
	defineImportedCommandGroupSpec(["agent"], () => import("./register.agent-turn-CFZqsqmL.js"), (mod, { program, ctx }) => {
		mod.registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions });
	}),
	defineImportedCommandGroupSpec(["agents"], () => import("./register.agent-BquTLrcy.js"), (mod, { program }) => {
		mod.registerAgentsCommands(program);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: [
			"status",
			"health",
			"sessions",
			"tasks"
		],
		loadModule: () => import("./register.status-health-sessions-DQKMArVK.js"),
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
