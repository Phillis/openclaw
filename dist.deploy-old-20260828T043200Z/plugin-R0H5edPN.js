import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { g as MarkdownConfigSchema } from "./zod-schema.core-CTdpjCBO.js";
import { a as buildChannelConfigSchema } from "./config-schema-ikPYPY3Q.js";
import { f as createChannelMessageAdapterFromOutbound } from "./channel-outbound-0oFCMpw9.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-BMBDlrGB.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BzekpwQi.js";
import { n as describeAccountSnapshot } from "./account-helpers-Cnv50TjD.js";
import "./error-runtime-CmA1H4Zg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { i as createChatChannelPlugin, t as buildChannelOutboundSessionRoute, u as stripChannelTargetPrefix } from "./core-wiAGUTYa.js";
import { i as runPassiveAccountLifecycle, t as createAccountStatusSink } from "./channel-lifecycle.core-CnejcREy.js";
import "./text-chunking-CJz4kAsi.js";
import { d as createDefaultChannelRuntimeState, u as createComputedAccountStatusAdapter } from "./status-helpers-CopMHs_f.js";
import { n as buildPassiveProbedChannelStatusSummary } from "./extension-shared-BO-DUGkx.js";
import "./channel-config-schema-DeVmAx-r.js";
import "./channel-core-D0k0Lcs9.js";
import { i as createPairingPrefixStripper, r as createLoggedPairingApprovalNotifier } from "./channel-pairing-CPNZh_3Y.js";
import { t as runChannelProbe } from "./text-utility-runtime-BNhX-3os.js";
import { a as normalizeTwitchChannel, i as normalizeToken, n as isAccountConfigured, o as resolveTwitchToken, r as missingTargetError, t as generateMessageId } from "./twitch-BKxAoH-v.js";
import { a as resolveDefaultTwitchAccountId, c as twitchConfigAdapter, i as getAccountConfig, o as resolveTwitchAccountContext, r as twitchSetupWizard, s as resolveTwitchSnapshotAccountId, t as twitchSetupContract } from "./setup-surface-DhdIRT89.js";
import { a as removeClientManager, c as callTwitchApi, l as HttpStatusCodeError, n as stripMarkdownForTwitch, o as ChatClient, r as getClientManager, s as StaticAuthProvider, t as chunkTextForTwitch } from "./markdown-DJYjSH7V.js";
//#region extensions/twitch/src/send.ts
/**
* Twitch message sending functions with dependency injection support.
*
* These functions are the primary interface for sending messages to Twitch.
* They support dependency injection via the `deps` parameter for testability.
*/
function createTwitchSendReceipt(params) {
	const messageId = params.messageId.trim();
	const conversationId = params.channel?.trim();
	return createMessageReceiptFromOutboundResults({
		results: params.visible === true && messageId && messageId !== "skipped" ? [{
			channel: "twitch",
			messageId,
			...conversationId ? { conversationId } : {}
		}] : [],
		kind: "text"
	});
}
/**
* Internal send function used by the outbound adapter.
*
* This function has access to the full OpenClaw config and handles
* account resolution, markdown stripping, and actual message sending.
*
* @param channel - The channel name
* @param text - The message text
* @param cfg - Full OpenClaw configuration
* @param accountId - Account ID to use
* @param stripMarkdown - Whether to strip markdown (default: true)
* @param logger - Logger instance
* @returns Result with message ID and status
*
* @example
* const result = await sendMessageTwitchInternal(
*   "#mychannel",
*   "Hello Twitch!",
*   openclawConfig,
*   "default",
*   true,
*   console,
* );
*/
async function sendMessageTwitchInternal(channel, text, cfg, accountId, stripMarkdown = true, logger = console) {
	const { account, configured, availableAccountIds, accountId: resolvedAccountId } = resolveTwitchAccountContext(cfg, accountId);
	if (!account) return {
		ok: false,
		messageId: generateMessageId(),
		receipt: createTwitchSendReceipt({
			messageId: "",
			channel,
			visible: false
		}),
		error: `Account not found: ${accountId ?? "(default)"}. Available accounts: ${availableAccountIds.join(", ") || "none"}`
	};
	if (!configured) return {
		ok: false,
		messageId: generateMessageId(),
		receipt: createTwitchSendReceipt({
			messageId: "",
			channel,
			visible: false
		}),
		error: `Account ${resolvedAccountId} is not properly configured. Required: username, clientId, and token (config or env for default account).`
	};
	const normalizedChannel = channel || account.channel;
	if (!normalizedChannel) return {
		ok: false,
		messageId: generateMessageId(),
		receipt: createTwitchSendReceipt({
			messageId: "",
			channel: normalizedChannel,
			visible: false
		}),
		error: "No channel specified and no default channel in account config"
	};
	const deliveryChannel = normalizeTwitchChannel(normalizedChannel);
	const cleanedText = stripMarkdown ? stripMarkdownForTwitch(text) : text;
	if (!cleanedText) return {
		ok: true,
		messageId: "skipped",
		receipt: createTwitchSendReceipt({
			messageId: "skipped",
			channel: deliveryChannel,
			visible: false
		})
	};
	const clientManager = getClientManager(resolvedAccountId);
	if (!clientManager) return {
		ok: false,
		messageId: generateMessageId(),
		receipt: createTwitchSendReceipt({
			messageId: "",
			channel: deliveryChannel,
			visible: false
		}),
		error: `Client manager not found for account: ${resolvedAccountId}. Please start the Twitch gateway first.`
	};
	try {
		const result = await clientManager.sendMessage(account, deliveryChannel, cleanedText, cfg, resolvedAccountId);
		if (!result.ok) {
			const messageId = result.messageId ?? generateMessageId();
			return {
				ok: false,
				messageId,
				receipt: createTwitchSendReceipt({
					messageId,
					channel: deliveryChannel,
					visible: false
				}),
				error: result.error ?? "Send failed"
			};
		}
		const messageId = result.messageId ?? generateMessageId();
		return {
			ok: true,
			messageId,
			receipt: createTwitchSendReceipt({
				messageId,
				channel: deliveryChannel,
				visible: true
			})
		};
	} catch (error) {
		const errorMsg = formatErrorMessage(error);
		const messageId = generateMessageId();
		logger.error(`Failed to send message: ${errorMsg}`);
		return {
			ok: false,
			messageId,
			receipt: createTwitchSendReceipt({
				messageId,
				channel: deliveryChannel,
				visible: false
			}),
			error: errorMsg
		};
	}
}
//#endregion
//#region extensions/twitch/src/outbound.ts
/**
* Twitch outbound adapter for sending messages.
*
* Implements the ChannelOutboundAdapter interface for Twitch chat.
* Supports text and media (URL) sending with markdown stripping and chunking.
*/
/**
* Twitch outbound adapter.
*
* Handles sending text and media to Twitch channels with automatic
* markdown stripping and message chunking.
*/
const twitchOutbound = {
	/** Direct delivery mode - messages are sent immediately */
	deliveryMode: "direct",
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		messageSendingHooks: true
	} },
	/** Twitch chat message limit is 500 characters */
	textChunkLimit: 500,
	/** Strip internal assistant tool-trace scaffolding before delivery */
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	/** Word-boundary chunker with markdown stripping */
	chunker: chunkTextForTwitch,
	/**
	* Resolve target from context.
	*
	* Handles target resolution with allowlist support for implicit/heartbeat modes.
	* For explicit mode, accepts any valid channel name.
	*
	* @param params - Resolution parameters
	* @returns Resolved target or error
	*/
	resolveTarget: ({ to, allowFrom, mode }) => {
		const trimmed = to?.trim() ?? "";
		const allowListRaw = normalizeStringEntries(allowFrom ?? []);
		const hasWildcard = allowListRaw.includes("*");
		const allowList = allowListRaw.filter((entry) => entry !== "*").map((entry) => normalizeTwitchChannel(entry)).filter((entry) => entry.length > 0);
		if (trimmed) {
			const normalizedTo = normalizeTwitchChannel(trimmed);
			if (!normalizedTo) return {
				ok: false,
				error: missingTargetError("Twitch", "<channel-name>")
			};
			if (mode === "implicit" || mode === "heartbeat") {
				if (hasWildcard || allowList.length === 0) return {
					ok: true,
					to: normalizedTo
				};
				if (allowList.includes(normalizedTo)) return {
					ok: true,
					to: normalizedTo
				};
				return {
					ok: false,
					error: missingTargetError("Twitch", "<channel-name>")
				};
			}
			return {
				ok: true,
				to: normalizedTo
			};
		}
		return {
			ok: false,
			error: missingTargetError("Twitch", "<channel-name>")
		};
	},
	/**
	* Send a text message to a Twitch channel.
	*
	* Strips markdown if enabled, validates account configuration,
	* and sends the message via the Twitch client.
	*
	* @param params - Send parameters including target, text, and config
	* @returns Delivery result with message ID and status
	*
	* @example
	* const result = await twitchOutbound.sendText({
	*   cfg: openclawConfig,
	*   to: "#mychannel",
	*   text: "Hello Twitch!",
	*   accountId: "default",
	* });
	*/
	sendText: async (params) => {
		const { cfg, to, text, accountId } = params;
		if (params.signal?.aborted) throw new Error("Outbound delivery aborted");
		const resolvedAccountId = accountId ?? resolveTwitchAccountContext(cfg).accountId;
		const { account, availableAccountIds } = resolveTwitchAccountContext(cfg, resolvedAccountId);
		if (!account) throw new Error(`Twitch account not found: ${resolvedAccountId}. Available accounts: ${availableAccountIds.join(", ") || "none"}`);
		const channel = to || account.channel;
		if (!channel) throw new Error("No channel specified and no default channel in account config");
		const result = await sendMessageTwitchInternal(normalizeTwitchChannel(channel), text, cfg, resolvedAccountId, true, console);
		if (!result.ok) throw new Error(result.error ?? "Send failed");
		return {
			channel: "twitch",
			messageId: result.messageId,
			receipt: result.receipt,
			timestamp: Date.now()
		};
	},
	/**
	* Send media to a Twitch channel.
	*
	* Note: Twitch chat doesn't support direct media uploads.
	* This sends the media URL as text instead.
	*
	* @param params - Send parameters including media URL
	* @returns Delivery result with message ID and status
	*
	* @example
	* const result = await twitchOutbound.sendMedia({
	*   cfg: openclawConfig,
	*   to: "#mychannel",
	*   text: "Check this out!",
	*   mediaUrl: "https://example.com/image.png",
	*   accountId: "default",
	* });
	*/
	sendMedia: async (params) => {
		const { text, mediaUrl } = params;
		if (params.signal?.aborted) throw new Error("Outbound delivery aborted");
		const message = mediaUrl ? `${text || ""} ${mediaUrl}`.trim() : text;
		if (!twitchOutbound.sendText) throw new Error("sendText not implemented");
		return twitchOutbound.sendText({
			...params,
			text: message
		});
	}
};
const twitchMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "twitch",
	outbound: twitchOutbound
});
//#endregion
//#region extensions/twitch/src/actions.ts
/**
* Twitch message actions adapter.
*
* Handles tool-based actions for Twitch, such as sending messages.
*/
/**
* Create a tool result with error content.
*/
function errorResponse(error) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify({
				ok: false,
				error
			})
		}],
		details: { ok: false }
	};
}
/**
* Read a string parameter from action arguments.
*
* @param args - Action arguments
* @param key - Parameter key
* @param options - Options for reading the parameter
* @returns The parameter value or undefined if not found
*/
function readStringParam(args, key, options = {}) {
	const value = args[key];
	if (value === void 0 || value === null) {
		if (options.required) throw new Error(`Missing required parameter: ${key}`);
		return;
	}
	if (typeof value === "string") return options.trim !== false ? value.trim() : value;
	if (typeof value === "number" || typeof value === "boolean") {
		const str = String(value);
		return options.trim !== false ? str.trim() : str;
	}
	throw new Error(`Parameter ${key} must be a string, number, or boolean`);
}
/** Supported Twitch actions */
const TWITCH_ACTIONS = /* @__PURE__ */ new Set(["send"]);
/**
* Twitch message actions adapter.
*/
const twitchMessageActions = {
	/**
	* List available actions for this channel.
	*/
	describeMessageTool: () => ({ actions: [...TWITCH_ACTIONS] }),
	/**
	* Check if an action is supported.
	*/
	supportsAction: ({ action }) => TWITCH_ACTIONS.has(action),
	/**
	* Extract tool send parameters from action arguments.
	*
	* Parses and validates the "to" and "message" parameters for sending.
	*
	* @param params - Arguments from the tool call
	* @returns Parsed send parameters or null if invalid
	*
	* @example
	* const result = twitchMessageActions.extractToolSend!({
	*   args: { to: "#mychannel", message: "Hello!" }
	* });
	* // Returns: { to: "#mychannel", message: "Hello!" }
	*/
	extractToolSend: ({ args }) => {
		try {
			const to = readStringParam(args, "to", { required: true });
			const message = readStringParam(args, "message", { required: true });
			if (!to || !message) return null;
			return {
				to,
				message
			};
		} catch {
			return null;
		}
	},
	/**
	* Handle an action execution.
	*
	* Processes the "send" action to send messages to Twitch.
	*
	* @param ctx - Action context including action type, parameters, and config
	* @returns Tool result with content or null if action not supported
	*
	* @example
	* const result = await twitchMessageActions.handleAction!({
	*   action: "send",
	*   params: { message: "Hello Twitch!", to: "#mychannel" },
	*   cfg: openclawConfig,
	*   accountId: "default",
	* });
	*/
	handleAction: async (ctx) => {
		if (ctx.action !== "send") return {
			content: [{
				type: "text",
				text: "Unsupported action"
			}],
			details: {
				ok: false,
				error: "Unsupported action"
			}
		};
		const message = readStringParam(ctx.params, "message", { required: true });
		const to = readStringParam(ctx.params, "to", { required: false });
		const accountId = ctx.accountId ?? resolveTwitchAccountContext(ctx.cfg).accountId;
		const { account, availableAccountIds } = resolveTwitchAccountContext(ctx.cfg, accountId);
		if (!account) return errorResponse(`Account not found: ${accountId}. Available accounts: ${availableAccountIds.join(", ") || "none"}`);
		const targetChannel = to || account.channel;
		if (!targetChannel) return errorResponse("No channel specified and no default channel in account config");
		if (!twitchOutbound.sendText) return errorResponse("sendText not implemented");
		try {
			const result = await twitchOutbound.sendText({
				cfg: ctx.cfg,
				to: targetChannel,
				text: message ?? "",
				accountId
			});
			return {
				content: [{
					type: "text",
					text: JSON.stringify(result)
				}],
				details: { ok: true }
			};
		} catch (error) {
			return errorResponse(formatErrorMessage(error));
		}
	}
};
//#endregion
//#region extensions/twitch/src/config-schema.ts
/**
* Twitch user roles that can be allowed to interact with the bot
*/
const TwitchRoleSchema = _enum([
	"moderator",
	"owner",
	"vip",
	"subscriber",
	"all"
]);
const TwitchAccountShape = {
	/** Twitch username */
	username: string(),
	/** Twitch OAuth access token (requires chat:read and chat:write scopes) */
	accessToken: string(),
	/** Twitch client ID (from Twitch Developer Portal or twitchtokengenerator.com) */
	clientId: string().optional(),
	/** Channel name to join */
	channel: string().min(1),
	/** Enable this account */
	enabled: boolean().optional(),
	/** Allow channel-initiated configuration writes */
	configWrites: boolean().optional(),
	/** Allowlist of Twitch user IDs who can interact with the bot (use IDs for safety, not usernames) */
	allowFrom: array(string()).optional(),
	/** Roles allowed to interact with the bot (e.g., ["moderator", "vip", "subscriber"]) */
	allowedRoles: array(TwitchRoleSchema).optional(),
	/** Require @mention to trigger bot responses */
	requireMention: boolean().optional(),
	/** Outbound response prefix override for this channel/account. */
	responsePrefix: string().optional(),
	/** Twitch client secret (required for token refresh via RefreshingAuthProvider) */
	clientSecret: string().optional(),
	/** Refresh token (required for automatic token refresh) */
	refreshToken: string().optional(),
	/** Token expiry time in seconds (optional, for token refresh tracking) */
	expiresIn: number().nullable().optional(),
	/** Timestamp when token was obtained (optional, for token refresh tracking) */
	obtainmentTimestamp: number().optional()
};
/**
* Twitch account configuration schema
*/
const TwitchAccountSchema = object(TwitchAccountShape);
/**
* Base configuration properties shared by both single and multi-account modes
*/
const TwitchConfigBaseShape = {
	name: string().optional(),
	enabled: boolean().optional(),
	configWrites: boolean().optional(),
	markdown: MarkdownConfigSchema.optional(),
	defaultAccount: string().optional(),
	historyLimit: number().int().min(0).optional(),
	responsePrefix: string().optional()
};
/**
* Twitch plugin configuration schema
*
* Supports two mutually exclusive patterns:
* 1. Simplified single-account: username, accessToken, clientId, channel at top level
* 2. Multi-account: accounts object with named account configs
*
* The union ensures clear discrimination between the two modes.
*/
const TwitchConfigSchema = union([object({
	...TwitchConfigBaseShape,
	...TwitchAccountShape
}), object({
	...TwitchConfigBaseShape,
	/** Per-account configuration (for multi-account setups) */
	accounts: record(string(), TwitchAccountSchema)
}).refine((val) => Object.keys(val.accounts || {}).length > 0, { message: "accounts must contain at least one entry" })]);
//#endregion
//#region extensions/twitch/src/probe.ts
/**
* Probe a Twitch account to verify the connection is working
*
* This tests the Twitch OAuth token by attempting to connect
* to the chat server and verify the bot's username.
*/
async function probeTwitch(account, timeoutMs) {
	let client;
	try {
		return await runChannelProbe(void 0, async () => {
			if (!account.accessToken || !account.username) return {
				ok: false,
				error: "missing credentials (accessToken, username)",
				username: account.username
			};
			const rawToken = normalizeToken(account.accessToken.trim());
			client = new ChatClient({ authProvider: new StaticAuthProvider(account.clientId ?? "", rawToken) });
			const connectionPromise = new Promise((resolve, reject) => {
				let settled = false;
				const cleanup = () => {
					if (settled) return;
					settled = true;
					connectListener?.unbind();
					disconnectListener?.unbind();
					authFailListener?.unbind();
				};
				const connectListener = client?.onConnect(() => {
					cleanup();
					resolve();
				});
				const disconnectListener = client?.onDisconnect((_manually, reason) => {
					cleanup();
					reject(reason || /* @__PURE__ */ new Error("Disconnected"));
				});
				const authFailListener = client?.onAuthenticationFailure(() => {
					cleanup();
					reject(/* @__PURE__ */ new Error("Authentication failed"));
				});
			});
			let timeoutHandle;
			const timeout = new Promise((_, reject) => {
				timeoutHandle = setTimeout(() => reject(/* @__PURE__ */ new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
			});
			client.connect();
			try {
				await Promise.race([connectionPromise, timeout]);
			} finally {
				if (timeoutHandle) clearTimeout(timeoutHandle);
			}
			client.quit();
			client = void 0;
			return {
				ok: true,
				connected: true,
				username: account.username,
				channel: account.channel
			};
		}, (error) => ({
			ok: false,
			error: formatErrorMessage(error),
			username: account.username,
			channel: account.channel
		}));
	} finally {
		if (client) try {
			client.quit();
		} catch {}
	}
}
//#endregion
//#region extensions/twitch/src/resolver.ts
/**
* Twitch resolver adapter for channel/user name resolution.
*
* This module implements the ChannelResolverAdapter interface to resolve
* Twitch usernames to user IDs via the Twitch Helix API.
*/
const TWITCH_HELIX_USER_LOOKUP_TIMEOUT_MS = 1e4;
/**
* Normalize a Twitch username - strip @ prefix and convert to lowercase
*/
function normalizeUsername(input) {
	const trimmed = input.trim();
	if (trimmed.startsWith("@")) return normalizeLowercaseStringOrEmpty(trimmed.slice(1));
	return normalizeLowercaseStringOrEmpty(trimmed);
}
/**
* Create a logger that includes the Twitch prefix
*/
function createLogger(logger) {
	return {
		info: (msg) => logger?.info(msg),
		warn: (msg) => logger?.warn(msg),
		error: (msg) => logger?.error(msg),
		debug: (msg) => logger?.debug?.(msg) ?? (() => {})
	};
}
function createHelixUserResolver(clientId, accessToken) {
	let tokenValidated = false;
	return async (query) => {
		const controller = new AbortController();
		const fetchOptions = { signal: controller.signal };
		const request = (async () => {
			if (!tokenValidated) {
				let tokenInfo;
				try {
					tokenInfo = await callTwitchApi({
						type: "auth",
						url: "validate"
					}, clientId, accessToken, void 0, fetchOptions);
				} catch (error) {
					if (error instanceof HttpStatusCodeError && error.statusCode === 401) throw new Error("Invalid token supplied", { cause: error });
					throw error;
				}
				if (!tokenInfo.user_id) throw new Error("Trying to use an app access token as a user access token");
				tokenValidated = true;
			}
			return (await callTwitchApi({
				type: "helix",
				url: "users",
				query
			}, clientId, accessToken, void 0, fetchOptions)).data[0] ?? null;
		})();
		try {
			return await withTimeout(request, TWITCH_HELIX_USER_LOOKUP_TIMEOUT_MS, "Twitch Helix user lookup");
		} finally {
			controller.abort();
		}
	};
}
/**
* Resolve Twitch usernames to user IDs via the Helix API
*
* @param inputs - Array of usernames or user IDs to resolve
* @param account - Twitch account configuration with auth credentials
* @param kind - Type of target to resolve ("user" or "group")
* @param logger - Optional logger
* @returns Promise resolving to array of ChannelResolveResult
*/
async function resolveTwitchTargets(inputs, account, _kind, logger) {
	const log = createLogger(logger);
	if (!account.clientId || !account.accessToken) {
		log.error("Missing Twitch client ID or accessToken");
		return inputs.map((input) => ({
			input,
			resolved: false,
			note: "missing Twitch credentials"
		}));
	}
	const normalizedToken = normalizeToken(account.accessToken);
	const resolveHelixUser = createHelixUserResolver(account.clientId, normalizedToken);
	const results = [];
	for (const input of inputs) {
		const normalized = normalizeUsername(input);
		if (!normalized) {
			results.push({
				input,
				resolved: false,
				note: "empty input"
			});
			continue;
		}
		const looksLikeUserId = /^\d+$/.test(normalized);
		try {
			if (looksLikeUserId) {
				const user = await resolveHelixUser({ id: normalized });
				if (user) {
					results.push({
						input,
						resolved: true,
						id: user.id,
						name: user.login
					});
					log.debug?.(`Resolved user ID ${normalized} -> ${user.login}`);
				} else {
					results.push({
						input,
						resolved: false,
						note: "user ID not found"
					});
					log.warn(`User ID ${normalized} not found`);
				}
			} else {
				const user = await resolveHelixUser({ login: normalized });
				if (user) {
					results.push({
						input,
						resolved: true,
						id: user.id,
						name: user.login,
						note: user.display_name !== user.login ? `display: ${user.display_name}` : void 0
					});
					log.debug?.(`Resolved username ${normalized} -> ${user.id} (${user.login})`);
				} else {
					results.push({
						input,
						resolved: false,
						note: "username not found"
					});
					log.warn(`Username ${normalized} not found`);
				}
			}
		} catch (error) {
			const errorMessage = formatErrorMessage(error);
			results.push({
				input,
				resolved: false,
				note: `API error: ${errorMessage}`
			});
			log.error(`Failed to resolve ${input}: ${errorMessage}`);
		}
	}
	return results;
}
//#endregion
//#region extensions/twitch/src/status.ts
/**
* Collect status issues for Twitch accounts.
*
* Analyzes account snapshots and detects configuration problems,
* authentication issues, and other potential problems.
*
* @param accounts - Array of account snapshots to analyze
* @param getCfg - Optional function to get full config for additional checks
* @returns Array of detected status issues
*
* @example
* const issues = collectTwitchStatusIssues(accountSnapshots);
* if (issues.length > 0) {
*   console.warn("Twitch configuration issues detected:");
*   issues.forEach(issue => console.warn(`- ${issue.message}`));
* }
*/
function collectTwitchStatusIssues(accounts, getCfg) {
	const issues = [];
	for (const entry of accounts) {
		const accountId = entry.accountId;
		if (!accountId) continue;
		let account = null;
		let cfg;
		if (getCfg) try {
			cfg = getCfg();
			account = getAccountConfig(cfg, accountId);
		} catch {}
		if (!entry.configured) {
			issues.push({
				channel: "twitch",
				accountId,
				kind: "config",
				message: "Twitch account is not properly configured",
				fix: "Add required fields: username, accessToken, and clientId to your account configuration"
			});
			continue;
		}
		if (entry.enabled === false) {
			issues.push({
				channel: "twitch",
				accountId,
				kind: "config",
				message: "Twitch account is disabled",
				fix: "Set enabled: true in your account configuration to enable this account"
			});
			continue;
		}
		if (account && account.username && account.accessToken && !account.clientId) issues.push({
			channel: "twitch",
			accountId,
			kind: "config",
			message: "Twitch client ID is required",
			fix: "Add clientId to your Twitch account configuration (from Twitch Developer Portal)"
		});
		const tokenResolution = cfg ? resolveTwitchToken(cfg, { accountId }) : {
			token: "",
			source: "none"
		};
		if (account && isAccountConfigured(account, tokenResolution.token)) {
			if (account.accessToken?.startsWith("oauth:")) issues.push({
				channel: "twitch",
				accountId,
				kind: "config",
				message: "Token contains 'oauth:' prefix (will be stripped)",
				fix: "The 'oauth:' prefix is optional. You can use just the token value, or keep it as-is (it will be normalized automatically)."
			});
			if (account.clientSecret && !account.refreshToken) issues.push({
				channel: "twitch",
				accountId,
				kind: "config",
				message: "clientSecret provided without refreshToken",
				fix: "For automatic token refresh, provide both clientSecret and refreshToken. Otherwise, clientSecret is not needed."
			});
			if (account.allowFrom && account.allowFrom.length === 0) issues.push({
				channel: "twitch",
				accountId,
				kind: "config",
				message: "allowFrom is configured but empty",
				fix: "Either add user IDs to allowFrom, remove the allowFrom field, or use allowedRoles instead."
			});
			if (account.allowedRoles?.includes("all") && account.allowFrom && account.allowFrom.length > 0) issues.push({
				channel: "twitch",
				accountId,
				kind: "intent",
				message: "allowedRoles is set to 'all' but allowFrom is also configured",
				fix: "When allowedRoles is 'all', the allowFrom list is not needed. Remove allowFrom or set allowedRoles to specific roles."
			});
		}
		if (entry.lastError) issues.push({
			channel: "twitch",
			accountId,
			kind: "runtime",
			message: `Last error: ${entry.lastError}`,
			fix: "Check your token validity and network connection. Ensure the bot has the required OAuth scopes."
		});
		if (entry.configured && !entry.running && !entry.lastStartAt && !entry.lastInboundAt && !entry.lastOutboundAt) issues.push({
			channel: "twitch",
			accountId,
			kind: "runtime",
			message: "Account has never connected successfully",
			fix: "Start the Twitch gateway to begin receiving messages. Check logs for connection errors."
		});
		if (entry.running && entry.lastStartAt) {
			const daysSinceStart = (Date.now() - entry.lastStartAt) / (1e3 * 60 * 60 * 24);
			if (daysSinceStart > 7) issues.push({
				channel: "twitch",
				accountId,
				kind: "runtime",
				message: `Connection has been running for ${Math.floor(daysSinceStart)} days`,
				fix: "Consider restarting the connection periodically to refresh the connection. Twitch tokens may expire after long periods."
			});
		}
	}
	return issues;
}
//#endregion
//#region extensions/twitch/src/plugin.ts
/**
* Twitch channel plugin for OpenClaw.
*
* Main plugin export combining all adapters (outbound, actions, status, gateway).
* This is the primary entry point for the Twitch channel integration.
*/
function normalizeTwitchMessagingTarget(target) {
	const providerTarget = stripChannelTargetPrefix(target, "twitch", "twitch-chat");
	const kindMatch = /^(user|dm|channel|group|conversation|room):/i.exec(providerTarget);
	const kind = kindMatch?.[1]?.toLowerCase();
	if (kind === "user" || kind === "dm") return "";
	return normalizeTwitchChannel(kindMatch ? providerTarget.slice(kindMatch[0].length) : providerTarget);
}
/**
* Twitch channel plugin.
*
* Implements the ChannelPlugin interface to provide Twitch chat integration
* for OpenClaw. Supports message sending, receiving, access control, and
* status monitoring.
*/
const twitchPlugin = createChatChannelPlugin({
	pairing: {
		idLabel: "twitchUserId",
		normalizeAllowEntry: createPairingPrefixStripper(/^(twitch:)?user:?/i),
		notifyApproval: createLoggedPairingApprovalNotifier(({ id }) => `Pairing approved for user ${id} (notification sent via chat if possible)`, console.warn)
	},
	outbound: twitchOutbound,
	base: {
		id: "twitch",
		meta: {
			id: "twitch",
			label: "Twitch",
			selectionLabel: "Twitch (Chat)",
			docsPath: "/channels/twitch",
			blurb: "Twitch chat integration",
			aliases: ["twitch-chat"]
		},
		setupContract: twitchSetupContract,
		setupWizard: twitchSetupWizard,
		capabilities: { chatTypes: ["group"] },
		messaging: {
			inferTargetChatType: ({ to }) => normalizeTwitchMessagingTarget(to) ? "group" : void 0,
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target }) => {
				const channel = normalizeTwitchMessagingTarget(target);
				if (!channel) return null;
				return buildChannelOutboundSessionRoute({
					cfg,
					agentId,
					channel: "twitch",
					accountId,
					recipientSessionExact: true,
					peer: {
						kind: "group",
						id: channel
					},
					chatType: "group",
					from: `twitch:channel:${channel}`,
					to: channel
				});
			}
		},
		message: twitchMessageAdapter,
		configSchema: buildChannelConfigSchema(TwitchConfigSchema),
		config: {
			...twitchConfigAdapter,
			describeAccount: (account) => account ? describeAccountSnapshot({
				account,
				configured: isAccountConfigured(account, account.accessToken)
			}) : {
				accountId: DEFAULT_ACCOUNT_ID,
				enabled: false,
				configured: false
			}
		},
		actions: twitchMessageActions,
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind, runtime }) => {
			const account = getAccountConfig(cfg, accountId ?? resolveDefaultTwitchAccountId(cfg));
			if (!account) return inputs.map((input) => ({
				input,
				resolved: false,
				note: "account not configured"
			}));
			return await resolveTwitchTargets(inputs, account, kind, {
				info: (msg) => runtime.log(msg),
				warn: (msg) => runtime.log(msg),
				error: (msg) => runtime.error(msg),
				debug: (msg) => runtime.log(msg)
			});
		} },
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot),
			probeAccount: async ({ account, timeoutMs }) => await probeTwitch(account, timeoutMs),
			collectStatusIssues: collectTwitchStatusIssues,
			resolveAccountSnapshot: ({ account, cfg }) => {
				const resolvedAccountId = account.accountId || resolveTwitchSnapshotAccountId(cfg, account);
				const { configured } = resolveTwitchAccountContext(cfg, resolvedAccountId);
				return {
					accountId: resolvedAccountId,
					enabled: account.enabled !== false,
					configured
				};
			}
		}),
		gateway: {
			startAccount: async (ctx) => {
				const account = ctx.account;
				const accountId = ctx.accountId;
				const statusSink = createAccountStatusSink({
					accountId,
					setStatus: ctx.setStatus
				});
				statusSink({
					running: true,
					lastStartAt: Date.now(),
					lastError: null,
					lifecycle: "starting"
				});
				ctx.log?.info(`Starting Twitch connection for ${account.username}`);
				try {
					await runPassiveAccountLifecycle({
						abortSignal: ctx.abortSignal,
						start: async () => {
							const { monitorTwitchProvider } = await import("./monitor-lYwZdPhz.js");
							return monitorTwitchProvider({
								account,
								accountId,
								config: ctx.cfg,
								runtime: ctx.runtime,
								abortSignal: ctx.abortSignal,
								statusSink
							});
						},
						stop: async (monitor) => {
							await monitor.stop();
						}
					});
				} catch (error) {
					ctx.setStatus?.({
						accountId,
						running: false,
						lastStopAt: Date.now()
					});
					throw error;
				}
			},
			stopAccount: async (ctx) => {
				const account = ctx.account;
				const accountId = ctx.accountId;
				await removeClientManager(accountId);
				ctx.setStatus?.({
					accountId,
					running: false,
					lastStopAt: Date.now()
				});
				ctx.log?.info(`Stopped Twitch connection for ${account.username}`);
			}
		}
	}
});
//#endregion
export { twitchPlugin as t };
