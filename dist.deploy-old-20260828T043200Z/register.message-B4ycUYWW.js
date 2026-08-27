import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as formatCliJsonFailure } from "./failure-output-CdUzE2dC.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as loadPluginRegistryHandle } from "./loader-D0AfkRZe.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { d as resolveDiscoverableScopedChannelPluginIds, l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-Cy9fjmLX.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import "./config-B2bSneS2.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as danger } from "./globals-GZNLg1ns.js";
import { t as getChannelPlugin } from "./registry-CL5HFEAI.js";
import "./plugins-CmLI4MOi.js";
import { r as withActivatedPluginIds } from "./activation-context-uSIB1oKw.js";
import { o as runGlobalGatewayStopSafely } from "./hook-runner-global-CWpWIBkz.js";
import { t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-CwcoVsCP.js";
import { n as CHANNEL_TARGET_DESCRIPTION, t as CHANNEL_TARGETS_DESCRIPTION } from "./channel-target-7t_7pXOl.js";
import "./channel-plugin-ids-BdzaxZ-5.js";
import { n as resolveMessageBroadcastAccountPlan, r as validateExplicitMessageAccountSelection } from "./message-account-selection-BTn_GTYc.js";
import { f as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-DLC-aqND.js";
import { t as resolveMessageSecretScope } from "./message-secret-scope-Duxe5usd.js";
import { n as runMessageAction } from "./message-action-runner-CxKIh4RX.js";
import { t as resolveMessageActionOutcome } from "./message-action-contracts-KstK3BGE.js";
import { r as withProgress } from "./progress-3-oJv0bD.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CzQHPhLv.js";
import { t as createDefaultDeps } from "./deps-BpqcLmo3.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-DHP7AXSk.js";
import { t as collectOption } from "./helpers-B-LqXQ3Z.js";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
//#region src/commands/message.ts
/** CLI entrypoint for channel message actions. */
function extractMessageId(payload) {
	if (!payload || typeof payload !== "object") return;
	const record = payload;
	const direct = normalizeOptionalString(record.messageId);
	if (direct) return direct;
	const result = record.result;
	if (result && typeof result === "object") {
		const nested = normalizeOptionalString(result.messageId);
		if (nested) return nested;
	}
}
function buildMessageCliJson(result) {
	const messageId = extractMessageId(result.payload);
	const sendResult = result.kind === "send" ? result.sendResult : void 0;
	const outcome = resolveMessageActionOutcome(result);
	return {
		...result.kind === "broadcast" ? { ok: outcome.ok } : !outcome.ok ? {
			...formatCliJsonFailure(outcome.error),
			...sendResult ? { deliveryStatus: sendResult.deliveryStatus } : {},
			...outcome.sentBeforeError ? { sentBeforeError: true } : {}
		} : {},
		action: result.action,
		channel: result.channel,
		dryRun: result.dryRun,
		handledBy: result.handledBy,
		...messageId ? { messageId } : {},
		payload: result.payload
	};
}
/** Resolves config/secrets, runs a channel message action, then renders JSON or text. */
async function messageCommand(opts, deps, runtime) {
	const loadedRaw = getRuntimeConfig();
	const actionInput = (normalizeOptionalString(opts.action) ?? "") || "send";
	const normalizedActionInput = normalizeLowercaseStringOrEmpty(actionInput);
	const scope = resolveMessageSecretScope({
		channel: opts.channel,
		target: opts.target,
		targets: opts.targets,
		accountId: opts.accountId
	});
	const explicitAccountId = validateExplicitMessageAccountSelection({
		cfg: loadedRaw,
		channel: scope.channel,
		accountId: opts.accountId,
		checkResolvedAccount: false
	});
	if (explicitAccountId) {
		scope.accountId = explicitAccountId;
		opts.accountId = explicitAccountId;
	}
	const broadcastAccountPlan = normalizedActionInput === "broadcast" && !scope.channel && explicitAccountId ? resolveMessageBroadcastAccountPlan({
		cfg: loadedRaw,
		accountId: explicitAccountId
	}) : void 0;
	const scopedTargets = getScopedChannelsCommandSecretTargets({
		config: loadedRaw,
		channel: scope.channel,
		...broadcastAccountPlan ? { channels: broadcastAccountPlan.secretChannels } : {},
		accountId: scope.accountId
	});
	const { effectiveConfig: cfg } = await resolveCommandConfigWithSecrets({
		config: loadedRaw,
		commandName: "message",
		targetIds: scopedTargets.targetIds,
		...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {},
		runtime,
		autoEnable: true
	});
	const agentId = resolveAmbientOwnerAgentId(cfg);
	const actionMatch = CHANNEL_MESSAGE_ACTION_NAMES.find((name) => normalizeLowercaseStringOrEmpty(name) === normalizedActionInput);
	if (!actionMatch) throw new Error(`Unknown message action "${actionInput}". Use one of ${CHANNEL_MESSAGE_ACTION_NAMES.join(", ")}. Example: ${formatCliCommand("openclaw message send --channel <channel> --target <id> --text <message>")}.`);
	const action = actionMatch;
	const outboundDeps = createOutboundSendDeps(deps);
	const run = async () => await runMessageAction({
		cfg,
		action,
		params: opts,
		deps: outboundDeps,
		agentId,
		senderIsOwner: opts.senderIsOwner !== false,
		conversationReadOrigin: "direct-operator",
		broadcastAccountPlan,
		gateway: {
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			mode: GATEWAY_CLIENT_MODES.CLI
		}
	});
	const json = opts.json === true;
	const dryRun = opts.dryRun === true;
	const result = !json && !dryRun && (action === "send" || action === "poll") ? await withProgress({
		label: action === "poll" ? "Sending poll..." : "Sending...",
		indeterminate: true,
		enabled: true
	}, run) : await run();
	if (json) {
		writeRuntimeJson(runtime, buildMessageCliJson(result));
		return result;
	}
	const { formatMessageCliText } = await import("./message-format-BFU2cHv1.js");
	const displayLimit = parseStrictPositiveInteger(opts.limit);
	for (const line of formatMessageCliText(result, { displayLimit })) runtime.log(line);
	return result;
}
//#endregion
//#region src/cli/program/message/helpers.ts
const GATEWAY_STOP_TIMEOUT_MS = 2500;
const ACTIONS_WITHOUT_STOP_HOOKS = /* @__PURE__ */ new Set(["read"]);
const ACTIONS_REQUIRING_CONFIGURED_CHANNEL_PRELOAD = /* @__PURE__ */ new Set(["broadcast"]);
const CHANNEL_MESSAGE_ACTION_NAME_SET = new Set(CHANNEL_MESSAGE_ACTION_NAMES);
const STRICT_POSITIVE_INTEGER_OPTIONS = /* @__PURE__ */ new Map([
	["pollDurationHours", "--poll-duration-hours"],
	["pollDurationSeconds", "--poll-duration-seconds"],
	["limit", "--limit"],
	["autoArchiveMin", "--auto-archive-min"]
]);
const STRICT_NON_NEGATIVE_INTEGER_OPTIONS = /* @__PURE__ */ new Map([["durationMin", "--duration-min"], ["deleteDays", "--delete-days"]]);
function normalizeMessageOptions(opts) {
	const { account, ...rest } = opts;
	return {
		...rest,
		accountId: typeof account === "string" ? account : rest.accountId
	};
}
function validateMessageNumericOptions(opts) {
	for (const [key, flag] of STRICT_POSITIVE_INTEGER_OPTIONS) {
		if (opts[key] === void 0) continue;
		if (parseStrictPositiveInteger(opts[key]) === void 0) throw new Error(`${flag} must be a positive integer.`);
	}
	for (const [key, flag] of STRICT_NON_NEGATIVE_INTEGER_OPTIONS) {
		if (opts[key] === void 0) continue;
		if (parseStrictNonNegativeInteger(opts[key]) === void 0) throw new Error(`${flag} must be a non-negative integer.`);
	}
}
async function runPluginStopHooks() {
	let timeout = null;
	const hookRun = runGlobalGatewayStopSafely({
		event: { reason: "cli message action complete" },
		ctx: {},
		onError: (err) => defaultRuntime.error(danger(`gateway_stop hook failed: ${formatErrorMessage(err)}`))
	});
	const bounded = new Promise((resolve) => {
		timeout = setTimeout(() => resolve("timeout"), GATEWAY_STOP_TIMEOUT_MS);
		timeout.unref?.();
	});
	const result = await Promise.race([hookRun.then(() => "done"), bounded]);
	if (timeout) clearTimeout(timeout);
	if (result === "timeout") defaultRuntime.error(danger(`gateway_stop hook exceeded ${GATEWAY_STOP_TIMEOUT_MS}ms; continuing`));
}
function resolveScopedMessageChannel(opts) {
	return resolveMessageSecretScope({
		channel: opts.channel,
		target: opts.target,
		targets: opts.targets
	}).channel;
}
function asChannelMessageActionName(action) {
	return CHANNEL_MESSAGE_ACTION_NAME_SET.has(action) ? action : void 0;
}
function isGatewayOwnedMessageAction(action, scopedChannel) {
	const messageAction = asChannelMessageActionName(action);
	if (!messageAction || !scopedChannel) return false;
	return getChannelPlugin(scopedChannel)?.actions?.resolveExecutionMode?.({ action: messageAction }) === "gateway";
}
function resolveMessagePluginPreloadPlan(action, opts) {
	const scopedChannel = resolveScopedMessageChannel(opts);
	if (opts.dryRun === true || ACTIONS_REQUIRING_CONFIGURED_CHANNEL_PRELOAD.has(action) || !isGatewayOwnedMessageAction(action, scopedChannel)) return {
		preload: true,
		...scopedChannel ? { channelId: scopedChannel } : {}
	};
	return { preload: false };
}
/** Create shared option decorators and the common message action runner. */
function createMessageCliHelpers(message, messageChannelOptions) {
	const withMessageBase = (command) => command.option("--channel <channel>", `Channel: ${messageChannelOptions}`).option("--account <id>", "Channel account id (accountId)").option("--json", "Output result as JSON", false).option("--dry-run", "Print payload and skip sending", false).option("--verbose", "Verbose logging", false);
	const withMessageTarget = (command) => command.option("-t, --target <dest>", CHANNEL_TARGET_DESCRIPTION);
	const withRequiredMessageTarget = (command) => command.requiredOption("-t, --target <dest>", CHANNEL_TARGET_DESCRIPTION);
	const runMessageAction = async (action, opts) => {
		setVerbose(Boolean(opts.verbose));
		let failed = false;
		let result;
		let pluginRegistry;
		await runCommandWithRuntime(defaultRuntime, async () => {
			validateMessageNumericOptions(opts);
			if (action === "poll" && opts.pollAnonymous === true && opts.pollPublic === true) throw new Error("--poll-anonymous and --poll-public are mutually exclusive.");
			const preloadPlan = resolveMessagePluginPreloadPlan(action, opts);
			if (preloadPlan.preload) {
				const config = getRuntimeConfig();
				const pluginIds = preloadPlan.channelId ? resolveDiscoverableScopedChannelPluginIds({
					config,
					activationSourceConfig: config,
					channelIds: [preloadPlan.channelId],
					env: process.env
				}) : resolveConfiguredChannelPluginIds({
					config,
					activationSourceConfig: config,
					env: process.env
				});
				const activatedConfig = withActivatedPluginIds({
					config,
					pluginIds
				}) ?? config;
				pluginRegistry = loadPluginRegistryHandle({
					config: activatedConfig,
					activationSourceConfig: activatedConfig,
					onlyPluginIds: pluginIds,
					throwOnLoadError: true
				});
			}
			const deps = createDefaultDeps();
			const run = () => messageCommand({
				...normalizeMessageOptions(opts),
				action
			}, deps, defaultRuntime);
			result = await withPluginRuntimeRegistryScope(pluginRegistry, run);
		}, (err) => {
			failed = true;
			defaultRuntime.error(danger(formatErrorMessage(err)));
		});
		if (!ACTIONS_WITHOUT_STOP_HOOKS.has(action)) await withPluginRuntimeRegistryScope(pluginRegistry, runPluginStopHooks);
		failed ||= result !== void 0 && !resolveMessageActionOutcome(result).ok;
		defaultRuntime.exit(failed ? 1 : 0);
	};
	return {
		withMessageBase,
		withMessageTarget,
		withRequiredMessageTarget,
		runMessageAction
	};
}
//#endregion
//#region src/cli/program/message/register.broadcast.ts
/** Register `message broadcast` for sending one payload to multiple channel targets. */
function registerMessageBroadcastCommand(message, helpers) {
	helpers.withMessageBase(message.command("broadcast").description("Broadcast a message to multiple targets")).requiredOption("--targets <target...>", CHANNEL_TARGETS_DESCRIPTION).option("--message <text>", "Message to send").option("--media <url>", "Media URL").action((options) => helpers.runMessageAction("broadcast", options));
}
//#endregion
//#region src/cli/program/message/register.discord-admin.ts
/** Register Discord admin and moderation message subcommands. */
function registerMessageDiscordAdminCommands(message, helpers) {
	const role = message.command("role").description("Role actions");
	helpers.withMessageBase(role.command("info").description("List roles").requiredOption("--guild-id <id>", "Guild id")).action((opts) => helpers.runMessageAction("role-info", opts));
	helpers.withMessageBase(role.command("add").description("Add role to a member").requiredOption("--guild-id <id>", "Guild id").requiredOption("--user-id <id>", "User id").requiredOption("--role-id <id>", "Role id")).action((opts) => helpers.runMessageAction("role-add", opts));
	helpers.withMessageBase(role.command("remove").description("Remove role from a member").requiredOption("--guild-id <id>", "Guild id").requiredOption("--user-id <id>", "User id").requiredOption("--role-id <id>", "Role id")).action((opts) => helpers.runMessageAction("role-remove", opts));
	const channel = message.command("channel").description("Channel actions");
	helpers.withMessageBase(helpers.withRequiredMessageTarget(channel.command("info").description("Fetch channel info"))).action((opts) => helpers.runMessageAction("channel-info", opts));
	helpers.withMessageBase(channel.command("list").description("List channels").requiredOption("--guild-id <id>", "Guild id")).action((opts) => helpers.runMessageAction("channel-list", opts));
	const member = message.command("member").description("Member actions");
	helpers.withMessageBase(member.command("info").description("Fetch member info").requiredOption("--user-id <id>", "User id")).option("--guild-id <id>", "Guild id (Discord)").action((opts) => helpers.runMessageAction("member-info", opts));
	const voice = message.command("voice").description("Voice actions");
	helpers.withMessageBase(voice.command("status").description("Fetch voice status").requiredOption("--guild-id <id>", "Guild id").requiredOption("--user-id <id>", "User id")).action((opts) => helpers.runMessageAction("voice-status", opts));
	const event = message.command("event").description("Event actions");
	helpers.withMessageBase(event.command("list").description("List scheduled events").requiredOption("--guild-id <id>", "Guild id")).action((opts) => helpers.runMessageAction("event-list", opts));
	helpers.withMessageBase(event.command("create").description("Create a scheduled event").requiredOption("--guild-id <id>", "Guild id").requiredOption("--event-name <name>", "Event name").requiredOption("--start-time <iso>", "Event start time")).option("--end-time <iso>", "Event end time").option("--desc <text>", "Event description").option("--channel-id <id>", "Channel id").option("--location <text>", "Event location").option("--event-type <stage|external|voice>", "Event type").option("--image <url>", "Cover image URL or local file path").action((opts) => helpers.runMessageAction("event-create", opts));
	helpers.withMessageBase(message.command("timeout").description("Timeout a member").requiredOption("--guild-id <id>", "Guild id").requiredOption("--user-id <id>", "User id")).option("--duration-min <n>", "Timeout duration minutes").option("--until <iso>", "Timeout until").option("--reason <text>", "Moderation reason").action((opts) => helpers.runMessageAction("timeout", opts));
	helpers.withMessageBase(message.command("kick").description("Kick a member").requiredOption("--guild-id <id>", "Guild id").requiredOption("--user-id <id>", "User id")).option("--reason <text>", "Moderation reason").action((opts) => helpers.runMessageAction("kick", opts));
	helpers.withMessageBase(message.command("ban").description("Ban a member").requiredOption("--guild-id <id>", "Guild id").requiredOption("--user-id <id>", "User id")).option("--reason <text>", "Moderation reason").option("--delete-days <n>", "Ban delete message days").action((opts) => helpers.runMessageAction("ban", opts));
}
//#endregion
//#region src/cli/program/message/register.emoji-sticker.ts
/** Register emoji list/upload commands. */
function registerMessageEmojiCommands(message, helpers) {
	const emoji = message.command("emoji").description("Emoji actions");
	helpers.withMessageBase(emoji.command("list").description("List emojis")).option("--guild-id <id>", "Guild id (Discord)").action((opts) => helpers.runMessageAction("emoji-list", opts));
	helpers.withMessageBase(emoji.command("upload").description("Upload an emoji").requiredOption("--guild-id <id>", "Guild id")).requiredOption("--emoji-name <name>", "Emoji name").requiredOption("--media <path-or-url>", "Emoji media (path or URL)").option("--role-ids <id>", "Role id (repeat)", collectOption, []).action((opts) => helpers.runMessageAction("emoji-upload", opts));
}
/** Register sticker send/upload commands. */
function registerMessageStickerCommands(message, helpers) {
	const sticker = message.command("sticker").description("Sticker actions");
	helpers.withMessageBase(helpers.withRequiredMessageTarget(sticker.command("send").description("Send stickers"))).requiredOption("--sticker-id <id>", "Sticker id (repeat)", collectOption).option("-m, --message <text>", "Optional message body").action((opts) => helpers.runMessageAction("sticker", opts));
	helpers.withMessageBase(sticker.command("upload").description("Upload a sticker").requiredOption("--guild-id <id>", "Guild id")).requiredOption("--sticker-name <name>", "Sticker name").requiredOption("--sticker-desc <text>", "Sticker description").requiredOption("--sticker-tags <tags>", "Sticker tags").requiredOption("--media <path-or-url>", "Sticker media (path or URL)").action((opts) => helpers.runMessageAction("sticker-upload", opts));
}
//#endregion
//#region src/cli/program/message/register.permissions-search.ts
/** Register the channel permissions inspection command. */
function registerMessagePermissionsCommand(message, helpers) {
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("permissions").description("Fetch channel permissions"))).action((opts) => helpers.runMessageAction("permissions", opts));
}
/** Register Discord message search command and repeatable filters. */
function registerMessageSearchCommand(message, helpers) {
	helpers.withMessageBase(message.command("search").description("Search Discord messages")).requiredOption("--guild-id <id>", "Guild id").requiredOption("--query <text>", "Search query").option("--channel-id <id>", "Channel id").option("--channel-ids <id>", "Channel id (repeat)", collectOption, []).option("--author-id <id>", "Author id").option("--author-ids <id>", "Author id (repeat)", collectOption, []).option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("search", opts));
}
//#endregion
//#region src/cli/program/message/register.pins.ts
/** Register message pin management commands. */
function registerMessagePinCommands(message, helpers) {
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("pin").description("Pin a message"))).requiredOption("--message-id <id>", "Message id").action((opts) => helpers.runMessageAction("pin", opts));
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("unpin").description("Unpin a message"))).requiredOption("--message-id <id>", "Message id (or pinned message resource id for MSTeams)").option("--pinned-message-id <id>", "Pinned message resource id (MSTeams: from pin or list-pins, not the chat message id)").action((opts) => helpers.runMessageAction("unpin", opts));
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("pins").description("List pinned messages"))).option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("list-pins", opts));
}
//#endregion
//#region src/cli/program/message/register.poll.ts
/** Register `message poll` and validate poll-specific flags through the shared action path. */
function registerMessagePollCommand(message, helpers) {
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("poll").description("Send a poll"))).requiredOption("--poll-question <text>", "Poll question").option("--poll-option <choice>", "Poll option (repeat 2-12 times)", collectOption, []).option("--poll-multi", "Allow multiple selections", false).option("--poll-duration-hours <n>", "Poll duration in hours (Discord)").option("--poll-duration-seconds <n>", "Poll duration in seconds (Telegram; 5-604800)").option("--poll-anonymous", "Send an anonymous poll (Telegram)", false).option("--poll-public", "Send a non-anonymous poll (Telegram)", false).option("-m, --message <text>", "Optional message body").option("--silent", "Send poll silently without notification (Telegram + Discord where supported)", false).option("--thread-id <id>", "Thread id (Telegram forum topic / Slack thread ts)").action((opts) => helpers.runMessageAction("poll", opts));
}
//#endregion
//#region src/cli/program/message/register.reactions.ts
/** Register reaction mutation/list commands. */
function registerMessageReactionsCommands(message, helpers) {
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("react").description("Add or remove a reaction"))).requiredOption("--message-id <id>", "Message id").option("--emoji <emoji>", "Emoji for reactions").option("--remove", "Remove reaction", false).option("--participant <id>", "WhatsApp reaction participant").option("--from-me", "WhatsApp reaction fromMe", false).option("--target-author <id>", "Signal reaction target author (uuid or phone)").option("--target-author-uuid <uuid>", "Signal reaction target author uuid").action((opts) => helpers.runMessageAction("react", opts));
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("reactions").description("List reactions on a message"))).requiredOption("--message-id <id>", "Message id").option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("reactions", opts));
}
//#endregion
//#region src/cli/program/message/register.read-edit-delete.ts
/** Register message read, edit, and delete commands. */
function registerMessageReadEditDeleteCommands(message, helpers) {
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("read").description("Read recent messages"))).option("--limit <n>", "Result limit").option("--message-id <id>", "Read a specific message id").option("--before <id>", "Read/search before id").option("--after <id>", "Read/search after id").option("--around <id>", "Read around id").option("--thread-id <id>", "Thread id (Slack thread timestamp)").option("--include-thread", "Include thread replies (Discord)", false).action((opts) => helpers.runMessageAction("read", opts));
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("edit").description("Edit a message").requiredOption("--message-id <id>", "Message id").requiredOption("-m, --message <text>", "Message body"))).option("--thread-id <id>", "Thread id (Telegram forum thread)").action((opts) => helpers.runMessageAction("edit", opts));
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("delete").description("Delete a message").requiredOption("--message-id <id>", "Message id"))).action((opts) => helpers.runMessageAction("delete", opts));
}
//#endregion
//#region src/cli/program/message/register.send.ts
/** Register `message send` and route execution through shared message helpers. */
function registerMessageSendCommand(message, helpers) {
	helpers.withMessageBase(helpers.withRequiredMessageTarget(message.command("send").description("Send a message").option("-m, --message <text>", "Message body (required unless --media or --presentation is set)")).option("--media <path-or-url>", "Attach media (image/audio/video/document). Accepts local paths or URLs.").option("--presentation <json>", "Shared presentation payload as JSON (text, context, dividers, charts, tables, buttons, selects)").option("--delivery <json>", "Shared delivery preferences as JSON").option("--pin", "Request that the delivered message be pinned when supported", false).option("--reply-to <id>", "Reply-to message id").option("--thread-id <id>", "Thread id (Telegram forum thread)").option("--gif-playback", "Treat video media as GIF playback (WhatsApp only).", false).option("--force-document", "Preserve original image bytes on Slack, or send images, GIFs, and videos as documents on Telegram and WhatsApp, to avoid channel compression.", false).option("--silent", "Send message silently without notification (Telegram + Discord)", false)).action((opts) => helpers.runMessageAction("send", opts));
}
//#endregion
//#region src/cli/program/message/register.thread.ts
function resolveThreadCreateRequest(opts) {
	const { channel } = resolveMessageSecretScope(opts);
	if (channel) {
		const request = getChannelPlugin(channel)?.actions?.resolveCliActionRequest?.({
			action: "thread-create",
			args: opts
		});
		if (request) return {
			action: request.action,
			params: request.args
		};
	}
	return {
		action: "thread-create",
		params: opts
	};
}
/** Register thread create/list/reply commands. */
function registerMessageThreadCommands(message, helpers) {
	const thread = message.command("thread").description("Thread actions");
	helpers.withMessageBase(helpers.withRequiredMessageTarget(thread.command("create").description("Create a thread").requiredOption("--thread-name <name>", "Thread name"))).option("--message-id <id>", "Message id (optional)").option("-m, --message <text>", "Initial thread message text").option("--auto-archive-min <n>", "Thread auto-archive minutes").action(async (opts) => {
		const request = resolveThreadCreateRequest(opts);
		await helpers.runMessageAction(request.action, request.params);
	});
	helpers.withMessageBase(thread.command("list").description("List threads").requiredOption("--guild-id <id>", "Guild id")).option("--channel-id <id>", "Channel id").option("--include-archived", "Include archived threads", false).option("--before <id>", "Read/search before id").option("--limit <n>", "Result limit").action((opts) => helpers.runMessageAction("thread-list", opts));
	helpers.withMessageBase(helpers.withRequiredMessageTarget(thread.command("reply").description("Reply in a thread").requiredOption("-m, --message <text>", "Message body"))).option("--media <path-or-url>", "Attach media (image/audio/video/document). Accepts local paths or URLs.").option("--reply-to <id>", "Reply-to message id").action((opts) => helpers.runMessageAction("thread-reply", opts));
}
//#endregion
//#region src/cli/program/register.message.ts
/** Register the `message` command group with shared channel option helpers. */
function registerMessageCommands(program, ctx) {
	const message = program.command("message").description("Send, read, and manage messages and channel actions").addHelpText("after", () => `
${theme.heading("Examples:")}
${formatHelpExamples([
		["openclaw message send --target +15555550123 --message \"Hi\"", "Send a text message."],
		["openclaw message send --target +15555550123 --message \"Hi\" --media photo.jpg", "Send a message with media."],
		["openclaw message poll --channel discord --target channel:123 --poll-question \"Snack?\" --poll-option Pizza --poll-option Sushi", "Create a Discord poll."],
		["openclaw message react --channel discord --target 123 --message-id 456 --emoji \"✅\"", "React to a message."]
	])}

${theme.muted("Docs:")} ${formatDocsLink("/cli/message", "docs.openclaw.ai/cli/message")}`);
	const helpers = createMessageCliHelpers(message, ctx.messageChannelOptions);
	registerMessageSendCommand(message, helpers);
	registerMessageBroadcastCommand(message, helpers);
	registerMessagePollCommand(message, helpers);
	registerMessageReactionsCommands(message, helpers);
	registerMessageReadEditDeleteCommands(message, helpers);
	registerMessagePinCommands(message, helpers);
	registerMessagePermissionsCommand(message, helpers);
	registerMessageSearchCommand(message, helpers);
	registerMessageThreadCommands(message, helpers);
	registerMessageEmojiCommands(message, helpers);
	registerMessageStickerCommands(message, helpers);
	registerMessageDiscordAdminCommands(message, helpers);
	for (const command of message.commands) if (command.commands.length > 0) applyParentDefaultHelpAction(command);
	applyParentDefaultHelpAction(message);
}
//#endregion
export { registerMessageCommands };
