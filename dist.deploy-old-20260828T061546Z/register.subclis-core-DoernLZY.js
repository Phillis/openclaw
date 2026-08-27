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
const pluginCliLoader = createLazyImportLoader(() => import("./cli-C4iNqe7v.js"));
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-DspxWUTv.js");
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
			() => import("./acp-cli-BOvkYyQX.js"),
			"registerAcpCli"
		],
		[
			["gateway"],
			() => import("./gateway-cli-BCvlBrfq.js"),
			"registerGatewayCli"
		],
		[
			["daemon"],
			() => import("./cli/daemon-cli.js"),
			"registerDaemonCli"
		],
		[
			["logs"],
			() => import("./logs-cli-CDo0BTY-.js"),
			"registerLogsCli"
		],
		[
			["system"],
			() => import("./system-cli-ndLfN_uM.js"),
			"registerSystemCli"
		],
		[
			["models"],
			() => import("./models-cli-Cfs4yRvJ.js"),
			"registerModelsCli"
		],
		[
			["promos"],
			() => import("./promos-cli-C0DiUPEH.js"),
			"registerPromosCli"
		],
		[
			["telemetry"],
			() => import("./telemetry-cli-FVKGtFN8.js"),
			"registerTelemetryCli"
		]
	]),
	{
		commandNames: ["infer", "capability"],
		register: async (program, argv) => {
			await (await import("./capability-cli-CU2naVY3.js")).registerCapabilityCli(program, argv);
		}
	},
	...defineImportedSubCliGroups([[
		["approvals", "exec-approvals"],
		() => import("./exec-approvals-cli-TrCY9gYK.js"),
		"registerExecApprovalsCli"
	], [
		["exec-policy"],
		() => import("./exec-policy-cli-B-_W6PxI.js"),
		"registerExecPolicyCli"
	]]),
	{
		commandNames: ["nodes"],
		register: async (program, argv) => {
			await (await import("./nodes-cli-CqdJJKy1.js")).registerNodesCli(program, argv);
		}
	},
	...defineImportedSubCliGroups([
		[
			["devices"],
			() => import("./devices-cli-D1GWif8k.js"),
			"registerDevicesCli"
		],
		[
			["users"],
			() => import("./users-cli-IbJrK48S.js"),
			"registerUsersCli"
		],
		[
			["node"],
			() => import("./node-cli-Jl8QlCWa.js"),
			"registerNodeCli"
		],
		[
			["connect"],
			() => import("./connect-cli-g10hXPBK.js"),
			"registerConnectCli"
		],
		[
			["worker"],
			() => import("./worker-cli-54cv-8vj.js"),
			"registerWorkerCli"
		],
		[
			["sandbox"],
			() => import("./sandbox-cli-DEa_VvHZ.js"),
			"registerSandboxCli"
		],
		[
			["fleet"],
			() => import("./fleet-cli-CNKam7R4.js"),
			"registerFleetCli"
		],
		[
			["worktrees"],
			() => import("./worktrees-cli-BB4cXBaf.js"),
			"registerWorktreesCli"
		],
		[
			["attach"],
			() => import("./attach-cli-BexmSI3j.js"),
			"registerAttachCli"
		],
		[
			[
				"tui",
				"terminal",
				"chat"
			],
			() => import("./tui-cli-C-0ksMXd.js"),
			"registerTuiCli"
		],
		[
			["resume"],
			() => import("./resume-cli-DTAtZof9.js"),
			"registerResumeCli"
		],
		[
			["cron", "automations"],
			() => import("./cron-cli-B2qnD9Nm.js"),
			"registerCronCli"
		],
		[
			["dns"],
			() => import("./dns-cli-SehAAC9G.js"),
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
			() => import("./proxy-cli-BoEP-GVQ.js"),
			"registerProxyCli"
		],
		[
			["hooks"],
			() => import("./hooks-cli-EVDggbIf.js"),
			"registerHooksCli"
		],
		[
			["webhooks"],
			() => import("./webhooks-cli-CJ88C_t0.js"),
			"registerWebhooksCli"
		],
		[
			["qr"],
			() => import("./qr-cli-pZR9Bm9s.js"),
			"registerQrCli"
		],
		[
			["clawbot"],
			() => import("./clawbot-cli-DNcfITYR.js"),
			"registerClawbotCli"
		]
	]),
	{
		commandNames: ["pairing"],
		register: async (program, argv) => {
			await registerSubCliWithPluginCommands(program, argv, async () => {
				(await import("./pairing-cli-CKSedqyF.js")).registerPairingCli(program);
			}, "before");
		}
	},
	{
		commandNames: ["plugins"],
		register: async (program, argv) => {
			await registerSubCliWithPluginCommands(program, argv, async () => {
				(await import("./plugins-cli-WhsRB1Qa.js")).registerPluginsCli(program);
			}, "after");
		}
	},
	{
		commandNames: ["channels"],
		register: async (program, argv, context) => {
			await (await import("./channels-cli-DLpfQv9x.js")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" });
		}
	},
	...defineImportedSubCliGroups([
		[
			["directory"],
			() => import("./directory-cli-DWIgZfGM.js"),
			"registerDirectoryCli"
		],
		[
			["security"],
			() => import("./security-cli-CHBOrNBh.js"),
			"registerSecurityCli"
		],
		[
			["secrets"],
			() => import("./secrets-cli-10_pv4Kf.js"),
			"registerSecretsCli"
		],
		[
			["skills"],
			() => import("./skills-cli-CVrrCaO1.js"),
			"registerSkillsCli"
		],
		[
			["update"],
			() => import("./update-cli-CM7_hfNx.js"),
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
