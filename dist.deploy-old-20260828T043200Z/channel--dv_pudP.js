import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CgCh8H_K.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { a as buildChannelConfigSchema } from "./config-schema-ikPYPY3Q.js";
import "./channel-outbound-0oFCMpw9.js";
import { i as createChatChannelPlugin } from "./core-wiAGUTYa.js";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-Tv9LYgST.js";
import { r as registerChannelRuntimeContext } from "./channel-runtime-context-gztTEkoq.js";
import { i as runPassiveAccountLifecycle, t as createAccountStatusSink } from "./channel-lifecycle.core-CnejcREy.js";
import { n as channelBlockedPatch } from "./gateway-runtime-CwascfPd.js";
import { d as createDefaultChannelRuntimeState, u as createComputedAccountStatusAdapter } from "./status-helpers-CopMHs_f.js";
import { n as buildPassiveProbedChannelStatusSummary } from "./extension-shared-BO-DUGkx.js";
import { c as GoogleChatConfigSchema } from "./bundled-channel-config-schema-DvS3Cnbv.js";
import "./channel-core-D0k0Lcs9.js";
import { i as createDangerousNameMatchingMutableAllowlistWarningCollector, r as collectStandardAllowlistLists, t as buildMutableAllowEntryDetector } from "./channel-policy-BG3-cCKG.js";
import { t as extractToolSend } from "./tool-send-CpdY8Wzi.js";
import { a as resolveGoogleChatOutboundSessionRoute, i as normalizeGoogleChatTarget, n as isGoogleChatSpaceTarget, r as isGoogleChatUserTarget } from "./targets-BEMwBKeu.js";
import { i as shouldSuppressLocalGoogleChatExecApprovalPrompt, n as isGoogleChatNativeApprovalClientEnabled, t as googleChatApprovalCapability } from "./approval-native-BieKtqdp.js";
import { n as createGoogleChatPluginBase, t as GOOGLECHAT_CHANNEL_ID } from "./channel-base-DKVtIg3M.js";
import { a as googlechatPairingTextAdapter, i as googlechatOutboundAdapter, n as googlechatGroupsAdapter, o as googlechatSecurityAdapter, r as googlechatMessageAdapter, s as googlechatThreadingAdapter, t as googlechatDirectoryAdapter } from "./channel.adapters-bcq4eh6j.js";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-DIsdFYU5.js";
import { t as describeGoogleChatMessageTool } from "./message-tool-api-i9doHkzi.js";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-s_vf6VKN.js";
const collectGoogleChatMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "googlechat",
	detector: buildMutableAllowEntryDetector({
		prefixes: [
			"googlechat:",
			"google-chat:",
			"gchat:",
			"users/"
		],
		stableIdPattern: /^[^@]+$/
	}),
	collectLists: (scope) => collectStandardAllowlistLists(scope, {
		includeGroups: true,
		groupField: "users"
	})
});
//#endregion
//#region extensions/googlechat/src/gateway.ts
const loadGoogleChatChannelRuntime$1 = createLazyRuntimeNamedExport(() => import("./channel.runtime-Bnd52zeQ.js"), "googleChatChannelRuntime");
const UNRESOLVED_WEBHOOK_URL_ERROR = "Invalid webhookUrl: expected an absolute URL such as https://chat.example.com/googlechat. No inbound webhook route was registered.";
async function startGoogleChatGatewayAccount(ctx) {
	const account = ctx.account;
	const statusSink = createAccountStatusSink({
		accountId: account.accountId,
		setStatus: ctx.setStatus
	});
	ctx.log?.info?.(`[${account.accountId}] starting Google Chat webhook`);
	const { resolveGoogleChatWebhookPath, startGoogleChatMonitor } = await loadGoogleChatChannelRuntime$1();
	const webhookPath = resolveGoogleChatWebhookPath({ account });
	statusSink({
		running: true,
		lastStartAt: Date.now(),
		...webhookPath ? {
			webhookPath,
			lifecycle: "starting"
		} : channelBlockedPatch(UNRESOLVED_WEBHOOK_URL_ERROR, { webhookPath: void 0 }),
		audienceType: account.config.audienceType,
		audience: account.config.audience
	});
	let stopped = false;
	const markStopped = () => {
		if (stopped) return;
		stopped = true;
		statusSink({
			running: false,
			lastStopAt: Date.now()
		});
	};
	if (isGoogleChatNativeApprovalClientEnabled({
		cfg: ctx.cfg,
		accountId: account.accountId
	})) registerChannelRuntimeContext({
		channelRuntime: ctx.channelRuntime,
		channelId: "googlechat",
		accountId: account.accountId,
		capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
		context: { account },
		abortSignal: ctx.abortSignal
	});
	try {
		await runPassiveAccountLifecycle({
			abortSignal: ctx.abortSignal,
			start: async () => await startGoogleChatMonitor({
				account,
				config: ctx.cfg,
				runtime: ctx.runtime,
				abortSignal: ctx.abortSignal,
				webhookPath: account.config.webhookPath,
				webhookUrl: account.config.webhookUrl,
				statusSink
			}),
			stop: async (unregister) => {
				await unregister?.();
			},
			onStop: async () => {
				markStopped();
			}
		});
	} catch (error) {
		markStopped();
		throw error;
	}
}
//#endregion
//#region extensions/googlechat/src/channel.ts
const loadGoogleChatChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-Bnd52zeQ.js"), "googleChatChannelRuntime");
const googlechatActions = {
	describeMessageTool: describeGoogleChatMessageTool,
	supportsAction: ({ action }) => action === "send",
	extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
	handleAction: async (ctx) => {
		const { googlechatMessageActions } = await import("./actions-Y__I8s6c.js");
		if (!googlechatMessageActions.handleAction) throw new Error("Google Chat actions are not available.");
		return await googlechatMessageActions.handleAction(ctx);
	}
};
const googlechatPlugin = createChatChannelPlugin({
	base: {
		...createGoogleChatPluginBase({ configSchema: buildChannelConfigSchema(GoogleChatConfigSchema) }),
		approvalCapability: googleChatApprovalCapability,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		groups: googlechatGroupsAdapter,
		messaging: {
			targetPrefixes: [
				"googlechat",
				"google-chat",
				"gchat"
			],
			targetIdComparison: "case-sensitive",
			normalizeTarget: normalizeGoogleChatTarget,
			inferTargetChatType: ({ to }) => {
				const target = normalizeGoogleChatTarget(to);
				if (!target) return;
				if (isGoogleChatUserTarget(target)) return "direct";
				return isGoogleChatSpaceTarget(target) ? "group" : void 0;
			},
			resolveOutboundSessionRoute: (params) => resolveGoogleChatOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: (raw, normalized) => {
					const value = normalized ?? raw.trim();
					return isGoogleChatSpaceTarget(value) || isGoogleChatUserTarget(value);
				},
				hint: "<spaces/{space}|users/{user}>"
			}
		},
		directory: googlechatDirectoryAdapter,
		message: googlechatMessageAdapter,
		resolver: { resolveTargets: async ({ inputs, kind }) => {
			return inputs.map((input) => {
				const normalized = normalizeGoogleChatTarget(input);
				if (!normalized) return {
					input,
					resolved: false,
					note: "empty target"
				};
				if (kind === "user" && isGoogleChatUserTarget(normalized)) return {
					input,
					resolved: true,
					id: normalized
				};
				if (kind === "group" && isGoogleChatSpaceTarget(normalized)) return {
					input,
					resolved: true,
					id: normalized
				};
				return {
					input,
					resolved: false,
					note: "use spaces/{space} or users/{user}"
				};
			});
		} },
		actions: googlechatActions,
		doctor: {
			dmAllowFromMode: "topOnly",
			groupModel: "route",
			groupAllowFromFallbackToAllowFrom: false,
			warnOnEmptyGroupSenderAllowlist: false,
			legacyConfigRules,
			normalizeCompatibilityConfig,
			collectMutableAllowlistWarnings: collectGoogleChatMutableAllowlistWarnings
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: (accounts) => accounts.flatMap((entry) => {
				const accountId = entry.accountId ?? "default";
				const enabled = entry.enabled !== false;
				const configured = entry.configured === true;
				if (!enabled || !configured) return [];
				const issues = [];
				if (!entry.audience) issues.push({
					channel: GOOGLECHAT_CHANNEL_ID,
					accountId,
					kind: "config",
					message: "Google Chat audience is missing (set channels.googlechat.audience).",
					fix: "Set channels.googlechat.audienceType and channels.googlechat.audience."
				});
				if (!entry.audienceType) issues.push({
					channel: GOOGLECHAT_CHANNEL_ID,
					accountId,
					kind: "config",
					message: "Google Chat audienceType is missing (app-url or project-number).",
					fix: "Set channels.googlechat.audienceType and channels.googlechat.audience."
				});
				return issues;
			}),
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot, {
				credentialSource: snapshot.credentialSource ?? "none",
				audienceType: snapshot.audienceType ?? null,
				audience: snapshot.audience ?? null,
				webhookPath: snapshot.webhookPath ?? null,
				webhookUrl: snapshot.webhookUrl ?? null
			}),
			probeAccount: async ({ account }) => (await loadGoogleChatChannelRuntime()).probeGoogleChat(account),
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.credentialSource !== "none",
				extra: {
					credentialSource: account.credentialSource,
					tokenStatus: account.tokenStatus,
					audienceType: account.config.audienceType,
					audience: account.config.audience,
					webhookPath: account.config.webhookPath,
					webhookUrl: account.config.webhookUrl,
					dmPolicy: account.config.dmPolicy ?? "pairing"
				}
			})
		}),
		gateway: { startAccount: startGoogleChatGatewayAccount }
	},
	pairing: { text: googlechatPairingTextAdapter },
	security: googlechatSecurityAdapter,
	threading: googlechatThreadingAdapter,
	outbound: {
		...googlechatOutboundAdapter,
		base: {
			...googlechatOutboundAdapter.base,
			shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload, hint }) => shouldSuppressLocalGoogleChatExecApprovalPrompt({
				cfg,
				accountId,
				payload,
				hint
			})
		}
	}
});
//#endregion
export { googlechatPlugin as t };
