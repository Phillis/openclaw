import { I as getCoreCliCommandDescriptors, L as getCoreCliCommandNamesCore } from "./argv-ubyZhwcH.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DZhkFMuY.js";
import { r as shouldRegisterPrimaryCommandOnly } from "./command-registration-policy-advooG02.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-u5DQ60lz.js";
import { a as defineImportedCommandGroupSpec, i as buildCommandGroupEntries, o as defineImportedProgramCommandGroupSpecs } from "./register.subclis-core-CVEAlt9x.js";
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
			loadModule: () => import("./register.setup-BH8AfcJY.js"),
			exportName: "registerSetupCommand"
		},
		{
			commandNames: ["onboard"],
			loadModule: () => import("./register.onboard-BhgAMd1D.js"),
			exportName: "registerOnboardCommand"
		},
		{
			commandNames: ["configure"],
			loadModule: () => import("./register.configure-CZc_fBE9.js"),
			exportName: "registerConfigureCommand"
		},
		{
			commandNames: ["config"],
			loadModule: () => import("./config-cli-D2PiLkuL.js"),
			exportName: "registerConfigCli"
		},
		{
			commandNames: ["claws"],
			loadModule: () => import("./claws-cli-DKWermkJ.js"),
			exportName: "registerClawsCli"
		},
		{
			commandNames: ["backup"],
			loadModule: () => import("./register.backup-BdE0Pfuf.js"),
			exportName: "registerBackupCommand"
		},
		{
			commandNames: ["database"],
			loadModule: () => import("./register.database-CZiVCiYJ.js"),
			exportName: "registerDatabaseCommand"
		},
		{
			commandNames: ["migrate"],
			loadModule: () => import("./register.migrate-DLKxC3zU.js"),
			exportName: "registerMigrateCommand"
		},
		{
			commandNames: ["audit"],
			loadModule: () => import("./register.audit-DJXJjlcc.js"),
			exportName: "registerAuditCommand"
		},
		{
			commandNames: [
				"doctor",
				"dashboard",
				"reset",
				"uninstall"
			],
			loadModule: () => import("./register.maintenance-B4jFSz0h.js"),
			exportName: "registerMaintenanceCommands"
		}
	])),
	defineImportedCommandGroupSpec(["message"], () => import("./register.message-CFEBME0H.js"), (mod, { program, ctx }) => {
		mod.registerMessageCommands(program, ctx);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: ["mcp"],
		loadModule: () => import("./mcp-cli-Cmtrqo3o.js"),
		exportName: "registerMcpCli"
	}, {
		commandNames: ["transcripts"],
		loadModule: () => import("./register.transcripts-DO96OdrY.js"),
		exportName: "registerTranscriptsCli"
	}])),
	defineImportedCommandGroupSpec(["agent"], () => import("./register.agent-turn-C3UhkUkA.js"), (mod, { program, ctx }) => {
		mod.registerAgentTurnCommand(program, { agentChannelOptions: ctx.agentChannelOptions });
	}),
	defineImportedCommandGroupSpec(["agents"], () => import("./register.agent-5Dr5H_pb.js"), (mod, { program }) => {
		mod.registerAgentsCommands(program);
	}),
	...withProgramOnlySpecs(defineImportedProgramCommandGroupSpecs([{
		commandNames: [
			"status",
			"health",
			"sessions",
			"tasks"
		],
		loadModule: () => import("./register.status-health-sessions-Cf_KVI9Z.js"),
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
