import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { b as loadPrivateQaCliModule, v as getSubCliEntriesCore } from "./argv-CgA2urTO.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CtNEO_uG.js";
import { i as shouldRegisterPrimarySubcommandOnly, n as shouldEagerRegisterSubcommands } from "./command-registration-policy-vJ2VPNBY.js";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-DJ20rW4U.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-BzMV3EqD.js";
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
const pluginCliLoader = createLazyImportLoader(() => import("./cli-DEX6Te-r.js"));
function shouldRegisterGatewayRunOnly(name, argv) {
	if (name !== "gateway") return false;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || invocation.commandPath[0] !== "gateway") return false;
	return invocation.commandPath.length === 1 || invocation.commandPath[1] === "run";
}
async function registerGatewayRunOnly(program) {
	const { addGatewayRunCommand } = await import("./run-command-T8S0Pm0u.js");
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
const entrySpecs = [
	...defineImportedProgramCommandGroupSpecs([
		{
			commandNames: ["acp"],
			loadModule: () => import("./acp-cli-Brz-tPTg.js"),
			exportName: "registerAcpCli"
		},
		{
			commandNames: ["gateway"],
			loadModule: () => import("./gateway-cli-BrHWANRt.js"),
			exportName: "registerGatewayCli"
		},
		{
			commandNames: ["daemon"],
			loadModule: () => import("./cli/daemon-cli.js"),
			exportName: "registerDaemonCli"
		},
		{
			commandNames: ["logs"],
			loadModule: () => import("./logs-cli-DOk2XNck.js"),
			exportName: "registerLogsCli"
		},
		{
			commandNames: ["system"],
			loadModule: () => import("./system-cli-CIW3gInU.js"),
			exportName: "registerSystemCli"
		},
		{
			commandNames: ["models"],
			loadModule: () => import("./models-cli-CG88WtPg.js"),
			exportName: "registerModelsCli"
		},
		{
			commandNames: ["promos"],
			loadModule: () => import("./promos-cli-DkZaUN4T.js"),
			exportName: "registerPromosCli"
		},
		{
			commandNames: ["infer", "capability"],
			loadModule: () => import("./capability-cli-F5C9iorq.js"),
			exportName: "registerCapabilityCli"
		},
		{
			commandNames: ["approvals", "exec-approvals"],
			loadModule: () => import("./exec-approvals-cli-D53v53v-.js"),
			exportName: "registerExecApprovalsCli"
		},
		{
			commandNames: ["exec-policy"],
			loadModule: () => import("./exec-policy-cli-CKq9MRCF.js"),
			exportName: "registerExecPolicyCli"
		}
	]),
	{
		commandNames: ["nodes"],
		register: async (program, argv) => {
			await (await import("./nodes-cli-DOOoxs99.js")).registerNodesCli(program, argv);
		}
	},
	...defineImportedProgramCommandGroupSpecs([
		{
			commandNames: ["devices"],
			loadModule: () => import("./devices-cli-D6BXcHBC.js"),
			exportName: "registerDevicesCli"
		},
		{
			commandNames: ["users"],
			loadModule: () => import("./users-cli-C07GeXsQ.js"),
			exportName: "registerUsersCli"
		},
		{
			commandNames: ["node"],
			loadModule: () => import("./node-cli-Bfk1wSrY.js"),
			exportName: "registerNodeCli"
		},
		{
			commandNames: ["connect"],
			loadModule: () => import("./connect-cli-CSFIJE_C.js"),
			exportName: "registerConnectCli"
		},
		{
			commandNames: ["worker"],
			loadModule: () => import("./worker-cli-BqlE3eTn.js"),
			exportName: "registerWorkerCli"
		},
		{
			commandNames: ["sandbox"],
			loadModule: () => import("./sandbox-cli-BA1mEpdI.js"),
			exportName: "registerSandboxCli"
		},
		{
			commandNames: ["fleet"],
			loadModule: () => import("./fleet-cli-DN0MsWHL.js"),
			exportName: "registerFleetCli"
		},
		{
			commandNames: ["worktrees"],
			loadModule: () => import("./worktrees-cli-BTWtmbEs.js"),
			exportName: "registerWorktreesCli"
		},
		{
			commandNames: ["attach"],
			loadModule: () => import("./attach-cli-By-uiOZY.js"),
			exportName: "registerAttachCli"
		},
		{
			commandNames: [
				"tui",
				"terminal",
				"chat"
			],
			loadModule: () => import("./tui-cli-Cqrcn4Pc.js"),
			exportName: "registerTuiCli"
		},
		{
			commandNames: ["resume"],
			loadModule: () => import("./resume-cli-D5rIQTRx.js"),
			exportName: "registerResumeCli"
		},
		{
			commandNames: ["cron", "automations"],
			loadModule: () => import("./cron-cli-75p5xGfg.js"),
			exportName: "registerCronCli"
		},
		{
			commandNames: ["dns"],
			loadModule: () => import("./dns-cli-CYkpPOs3.js"),
			exportName: "registerDnsCli"
		},
		{
			commandNames: ["docs"],
			loadModule: () => import("./docs-cli-DU3Uiei2.js"),
			exportName: "registerDocsCli"
		},
		{
			commandNames: ["qa"],
			loadModule: loadPrivateQaCliModule,
			exportName: "registerQaLabCli"
		},
		{
			commandNames: ["proxy"],
			loadModule: () => import("./proxy-cli-DSc52-Dm.js"),
			exportName: "registerProxyCli"
		},
		{
			commandNames: ["hooks"],
			loadModule: () => import("./hooks-cli-CNlQCn_8.js"),
			exportName: "registerHooksCli"
		},
		{
			commandNames: ["webhooks"],
			loadModule: () => import("./webhooks-cli-fglz5xfM.js"),
			exportName: "registerWebhooksCli"
		},
		{
			commandNames: ["qr"],
			loadModule: () => import("./qr-cli-DbqFd80Q.js"),
			exportName: "registerQrCli"
		},
		{
			commandNames: ["clawbot"],
			loadModule: () => import("./clawbot-cli-CmYLGZlO.js"),
			exportName: "registerClawbotCli"
		}
	]),
	{
		commandNames: ["pairing"],
		register: async (program, argv) => {
			await registerSubCliWithPluginCommands(program, argv, async () => {
				(await import("./pairing-cli-BWI0w6sb.js")).registerPairingCli(program);
			}, "before");
		}
	},
	{
		commandNames: ["plugins"],
		register: async (program, argv) => {
			await registerSubCliWithPluginCommands(program, argv, async () => {
				(await import("./plugins-cli-gEU3wtiE.js")).registerPluginsCli(program);
			}, "after");
		}
	},
	{
		commandNames: ["channels"],
		register: async (program, argv, context) => {
			await (await import("./channels-cli-S08GhF_B.js")).registerChannelsCli(program, argv, { includeSetupOptions: context.purpose === "completion" });
		}
	},
	...defineImportedProgramCommandGroupSpecs([
		{
			commandNames: ["directory"],
			loadModule: () => import("./directory-cli-BcKVCQ7Z.js"),
			exportName: "registerDirectoryCli"
		},
		{
			commandNames: ["security"],
			loadModule: () => import("./security-cli-D2xlwW7j.js"),
			exportName: "registerSecurityCli"
		},
		{
			commandNames: ["secrets"],
			loadModule: () => import("./secrets-cli-CK-pHlOf.js"),
			exportName: "registerSecretsCli"
		},
		{
			commandNames: ["skills"],
			loadModule: () => import("./skills-cli-J4zJBGCD.js"),
			exportName: "registerSkillsCli"
		},
		{
			commandNames: ["update"],
			loadModule: () => import("./update-cli-DvPtCPEh.js"),
			exportName: "registerUpdateCli"
		}
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
