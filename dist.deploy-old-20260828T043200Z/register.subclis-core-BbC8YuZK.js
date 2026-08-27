import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { b as loadPrivateQaCliModule, v as getSubCliEntriesCore } from "./argv-CCdO9MSu.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DXuFeGZ6.js";
import { i as shouldRegisterPrimarySubcommandOnly, n as shouldEagerRegisterSubcommands } from "./command-registration-policy-ybElENX5.js";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-DKqm4ZZQ.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-BkLZKevi.js";
//#region src/cli/program/command-group-descriptors.ts
function buildDescriptorIndex(descriptors) {
	return new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
}
/** Resolve named command-group specs into descriptor-backed entries. */
function resolveCommandGroupEntries(descriptors, specs) {
	const descriptorsByName = buildDescriptorIndex(descriptors);
	return specs.map((spec) => ({
		placeholders: spec.commandNames.map((name) => {
			const descriptor = descriptorsByName.get(name);
			if (!descriptor) throw new Error(`Unknown command descriptor: ${name}`);
			return descriptor;
		}),
		register: spec.register
	}));
}
/** Build lazy command-group entries with a mapped program registrar. */
function buildCommandGroupEntries(descriptors, specs, mapRegister) {
	return resolveCommandGroupEntries(descriptors, specs).map((entry) => ({
		placeholders: entry.placeholders,
		register: mapRegister(entry.register)
	}));
}
/** Define a lazy group that imports its module at registration time. */
function defineImportedCommandGroupSpec(commandNames, loadModule, register) {
	return {
		commandNames,
		register: async (args) => {
			await register(await loadModule(), args);
		}
	};
}
/** Map program-level imported command definitions to lazy specs with export validation. */
function defineImportedProgramCommandGroupSpecs(definitions) {
	return definitions.map((definition) => ({
		commandNames: definition.commandNames,
		register: async (program) => {
			const register = (await definition.loadModule())[definition.exportName];
			if (typeof register !== "function") throw new Error(`Missing program command registrar: ${definition.exportName}`);
			await register(program);
		}
	}));
}
//#endregion
//#region src/cli/program/register.subclis-core.ts
const pluginCliLoader = createLazyImportLoader(() => import("./cli-A-W0aiU-.js"));
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-CwgHklPm.js");
	removeCommandByName(program, "gateway");
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway")).command("run").description("Run the WebSocket Gateway (foreground)"));
}
async function registerSubCliWithPluginCommands(program, argv, registerSubCli, pluginCliPosition) {
	const invocation = resolveCliArgvInvocation(argv);
	const shouldRegisterPluginCommands = !invocation.hasHelpOrVersion && resolveCliCommandPathPolicy(invocation.commandPath).loadPlugins !== "never";
	if (pluginCliPosition === "before" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
	await registerSubCli();
	if (pluginCliPosition === "after" && shouldRegisterPluginCommands) {
		const { registerPluginCliCommandsFromValidatedConfig } = await pluginCliLoader.load();
		await registerPluginCliCommandsFromValidatedConfig(program);
	}
}
function defineImportedSubCliGroups(definitions) {
	return defineImportedProgramCommandGroupSpecs(definitions.map(([commandNames, loadModule, exportName]) => ({
		commandNames,
		loadModule,
		exportName
	})));
}
const entrySpecs = [
	...defineImportedSubCliGroups([
		[
			["acp"],
			() => import("./acp-cli-Dg2Quh1-.js"),
			"registerAcpCli"
		],
		[
			["gateway"],
			() => import("./gateway-cli-i4JWXpxH.js"),
			"registerGatewayCli"
		],
		[
			["daemon"],
			() => import("./cli/daemon-cli.js"),
			"registerDaemonCli"
		],
		[
			["logs"],
			() => import("./logs-cli-5NgMYerm.js"),
			"registerLogsCli"
		],
		[
			["system"],
			() => import("./system-cli-By5OEeMO.js"),
			"registerSystemCli"
		],
		[
			["models"],
			() => import("./models-cli-sHsWGmmh.js"),
			"registerModelsCli"
		],
		[
			["promos"],
			() => import("./promos-cli-BPgzgRly.js"),
			"registerPromosCli"
		],
		[
			["telemetry"],
			() => import("./telemetry-cli-DhQg5Li-.js"),
			"registerTelemetryCli"
		]
	]),
	{
		commandNames: ["infer", "capability"],
		register: async (program, argv) => {
			await (await import("./capability-cli-BPLLHWW-.js")).registerCapabilityCli(program, argv);
		}
	},
	...defineImportedSubCliGroups([[
		["approvals", "exec-approvals"],
		() => import("./exec-approvals-cli-BSiknne1.js"),
		"registerExecApprovalsCli"
	], [
		["exec-policy"],
		() => import("./exec-policy-cli-DtKj5hbq.js"),
		"registerExecPolicyCli"
	]]),
	{
		commandNames: ["nodes"],
		register: async (program, argv) => {
			await (await import("./nodes-cli-CA4iAVNk.js")).registerNodesCli(program, argv);
		}
	},
	...defineImportedSubCliGroups([
		[
			["devices"],
			() => import("./devices-cli-DHWb9kWQ.js"),
			"registerDevicesCli"
		],
		[
			["users"],
			() => import("./users-cli-COKNZMF3.js"),
			"registerUsersCli"
		],
		[
			["node"],
			() => import("./node-cli-C8vi7T_8.js"),
			"registerNodeCli"
		],
		[
			["connect"],
			() => import("./connect-cli-CSgvP0_F.js"),
			"registerConnectCli"
		],
		[
			["worker"],
			() => import("./worker-cli-Coyj6Gym.js"),
			"registerWorkerCli"
		],
		[
			["sandbox"],
			() => import("./sandbox-cli-D4pDEZKY.js"),
			"registerSandboxCli"
		],
		[
			["fleet"],
			() => import("./fleet-cli-BmhIIIor.js"),
			"registerFleetCli"
		],
		[
			["worktrees"],
			() => import("./worktrees-cli-DHFvtwn4.js"),
			"registerWorktreesCli"
		],
		[
			["attach"],
			() => import("./attach-cli-DXpkp0jM.js"),
			"registerAttachCli"
		],
		[
			[
				"tui",
				"terminal",
				"chat"
			],
			() => import("./tui-cli-DpB3BJ8k.js"),
			"registerTuiCli"
		],
		[
			["resume"],
			() => import("./resume-cli-CUFhryZp.js"),
			"registerResumeCli"
		],
		[
			["cron", "automations"],
			() => import("./cron-cli-B6jPUMqw.js"),
			"registerCronCli"
		],
		[
			["dns"],
			() => import("./dns-cli-D6epQyCl.js"),
			"registerDnsCli"
		],
		[
			["docs"],
			() => import("./docs-cli-DIPic1TD.js"),
			"registerDocsCli"
		],
		[
			["qa"],
			loadPrivateQaCliModule,
			"registerQaLabCli"
		],
		[
			["proxy"],
			() => import("./proxy-cli-3j1mjGe5.js"),
			"registerProxyCli"
		],
		[
			["hooks"],
			() => import("./hooks-cli-C9QAN0pR.js"),
			"registerHooksCli"
		],
		[
			["webhooks"],
			() => import("./webhooks-cli-DrGQls_Q.js"),
			"registerWebhooksCli"
		],
		[
			["qr"],
			() => import("./qr-cli-DNUkyF5R.js"),
			"registerQrCli"
		],
		[
			["clawbot"],
			() => import("./clawbot-cli-D-7dUSYF.js"),
			"registerClawbotCli"
		]
	]),
	{
		commandNames: ["pairing"],
		register: async (program, argv) => {
			await registerSubCliWithPluginCommands(program, argv, async () => {
				(await import("./pairing-cli-DhN6kCHp.js")).registerPairingCli(program);
			}, "before");
		}
	},
	{
		commandNames: ["plugins"],
		register: async (program, argv) => {
			await registerSubCliWithPluginCommands(program, argv, async () => {
				(await import("./plugins-cli-VdS0b7oD.js")).registerPluginsCli(program);
			}, "after");
		}
	},
	{
		commandNames: ["channels"],
		register: async (program, argv, context) => {
			await (await import("./channels-cli-C2LDKznU.js")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" });
		}
	},
	...defineImportedSubCliGroups([
		[
			["directory"],
			() => import("./directory-cli-3rkl2Y_m.js"),
			"registerDirectoryCli"
		],
		[
			["security"],
			() => import("./security-cli-D3_nmNuS.js"),
			"registerSecurityCli"
		],
		[
			["secrets"],
			() => import("./secrets-cli-BPNetMgF.js"),
			"registerSecretsCli"
		],
		[
			["skills"],
			() => import("./skills-cli-jfE3H4oV.js"),
			"registerSkillsCli"
		],
		[
			["update"],
			() => import("./update-cli-Dp-vjMD9.js"),
			"registerUpdateCli"
		]
	])
];
function resolveSubCliCommandGroups(argv, context = {}) {
	const descriptors = getSubCliEntriesCore();
	const descriptorNames = new Set(descriptors.map((descriptor) => descriptor.name));
	return buildCommandGroupEntries(descriptors, entrySpecs.filter((spec) => spec.commandNames.every((name) => descriptorNames.has(name))), (register) => async (program) => {
		await register(program, argv, context);
	});
}
function getSubCliEntries() {
	return getSubCliEntriesCore();
}
async function registerSubCliByNameCore(program, name, argv = process.argv, context = {}) {
	if (shouldRegisterGatewayRunOnly(name, argv)) {
		await registerGatewayRunOnly(program);
		return true;
	}
	return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}
function registerSubCliCommandsCore(program, argv = process.argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
		eager: shouldEagerRegisterSubcommands(),
		primary,
		registerPrimaryOnly: Boolean(primary && shouldRegisterPrimarySubcommandOnly(argv))
	});
}
//#endregion
export { defineImportedCommandGroupSpec as a, buildCommandGroupEntries as i, registerSubCliByNameCore as n, defineImportedProgramCommandGroupSpecs as o, registerSubCliCommandsCore as r, getSubCliEntries as t };
