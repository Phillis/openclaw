import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.js";
//#region packages/model-catalog-core/src/configured-model-refs.ts
/** Agent config keys that can contain direct model references. */
const AGENT_MODEL_CONFIG_KEYS = [
	"model",
	"utilityModel",
	"imageModel",
	"voiceModel",
	"pdfModel"
];
/** List raw refs from one string or primary/fallback model selector. */
function listModelRefsFromConfigValue(value) {
	if (typeof value === "string") return [value];
	if (!isRecord(value)) return [];
	const refs = [];
	if (typeof value.primary === "string") refs.push(value.primary);
	if (Array.isArray(value.fallbacks)) {
		for (const fallback of value.fallbacks) if (typeof fallback === "string") refs.push(fallback);
	}
	return refs;
}
/** Collect configured model references from agents, tools, channels, hooks, and message config. */
function collectConfiguredModelRefs(config, options = {}) {
	const refs = [];
	const pushModelRef = (path, value) => {
		if (typeof value === "string" && value.trim()) refs.push({
			path,
			value: value.trim()
		});
	};
	const collectModelConfig = (path, value) => {
		if (typeof value === "string") {
			pushModelRef(path, value);
			return;
		}
		if (!isRecord(value)) return;
		pushModelRef(`${path}.primary`, value.primary);
		if (Array.isArray(value.fallbacks)) for (const [index, entry] of value.fallbacks.entries()) pushModelRef(`${path}.fallbacks.${index}`, entry);
	};
	const collectFromAgent = (path, agent, includeEntrySelectors = false) => {
		if (!isRecord(agent)) return;
		for (const key of AGENT_MODEL_CONFIG_KEYS) collectModelConfig(`${path}.${key}`, agent[key]);
		const mediaModels = asNonArrayRecord(agent.mediaModels);
		for (const capability of [
			"image",
			"video",
			"music"
		]) collectModelConfig(`${path}.mediaModels.${capability}`, mediaModels[capability]);
		pushModelRef(`${path}.heartbeat.model`, isRecord(agent.heartbeat) ? agent.heartbeat.model : void 0);
		collectModelConfig(`${path}.subagents.model`, isRecord(agent.subagents) ? agent.subagents.model : void 0);
		if (isRecord(agent.compaction)) {
			pushModelRef(`${path}.compaction.model`, agent.compaction.model);
			pushModelRef(`${path}.compaction.memoryFlush.model`, isRecord(agent.compaction.memoryFlush) ? agent.compaction.memoryFlush.model : void 0);
		}
		if (isRecord(agent.models)) for (const modelRef of Object.keys(agent.models)) pushModelRef(`${path}.models.${modelRef}`, modelRef);
		if (includeEntrySelectors) {
			const exec = asNonArrayRecord(asNonArrayRecord(agent.tools).exec);
			collectModelConfig(`${path}.tools.exec.reviewer.model`, isRecord(exec.reviewer) ? exec.reviewer.model : void 0);
			pushModelRef(`${path}.tts.summaryModel`, isRecord(agent.tts) ? agent.tts.summaryModel : void 0);
		}
	};
	const root = asNonArrayRecord(config);
	const tools = asNonArrayRecord(root.tools);
	const exec = asNonArrayRecord(tools.exec);
	collectModelConfig("tools.exec.reviewer.model", isRecord(exec.reviewer) ? exec.reviewer.model : void 0);
	const media = asNonArrayRecord(tools.media);
	for (const capability of [
		"image",
		"audio",
		"video"
	]) pushModelRef(`tools.media.${capability}.preferredModel`, isRecord(media[capability]) ? media[capability].preferredModel : void 0);
	const agents = asNonArrayRecord(root.agents);
	collectFromAgent("agents.defaults", agents.defaults);
	if (Object.hasOwn(agents, "entries")) {
		if (isRecord(agents.entries)) for (const [agentId, entry] of Object.entries(agents.entries)) collectFromAgent(`agents.entries.${agentId}`, entry, true);
	} else if (Array.isArray(agents.list)) for (const [index, entry] of agents.list.entries()) collectFromAgent(`agents.list.${index}`, entry, true);
	if (options.includeChannelModelOverrides !== false) {
		const modelByChannel = asNonArrayRecord(asNonArrayRecord(root.channels).modelByChannel);
		for (const [channelId, channelMap] of Object.entries(modelByChannel)) {
			if (!isRecord(channelMap)) continue;
			for (const [targetId, modelRef] of Object.entries(channelMap)) pushModelRef(`channels.modelByChannel.${channelId}.${targetId}`, modelRef);
		}
	}
	const hooks = asNonArrayRecord(root.hooks);
	if (Array.isArray(hooks.mappings)) for (const [index, mapping] of hooks.mappings.entries()) pushModelRef(`hooks.mappings.${index}.model`, isRecord(mapping) ? mapping.model : void 0);
	pushModelRef("hooks.gmail.model", isRecord(hooks.gmail) ? hooks.gmail.model : void 0);
	pushModelRef("tts.summaryModel", isRecord(root.tts) ? root.tts.summaryModel : void 0);
	const discord = asNonArrayRecord(asNonArrayRecord(root.channels).discord);
	const collectDiscordVoice = (path, value) => {
		const voice = asNonArrayRecord(value);
		pushModelRef(`${path}.model`, voice.model);
		pushModelRef(`${path}.tts.summaryModel`, isRecord(voice.tts) ? voice.tts.summaryModel : void 0);
	};
	collectDiscordVoice("channels.discord.voice", discord.voice);
	if (isRecord(discord.accounts)) for (const [accountId, account] of Object.entries(discord.accounts)) collectDiscordVoice(`channels.discord.accounts.${accountId}.voice`, isRecord(account) ? account.voice : void 0);
	return refs;
}
/** Collect only configured model reference values. */
function collectConfiguredModelRefValues(config, options) {
	return collectConfiguredModelRefs(config, options).map((ref) => ref.value);
}
//#endregion
export { listModelRefsFromConfigValue as i, collectConfiguredModelRefValues as n, collectConfiguredModelRefs as r, AGENT_MODEL_CONFIG_KEYS as t };
