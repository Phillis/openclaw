import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-BlJhejU6.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { An as validatePluginsUninstallParams, Cn as validatePluginsRefreshParams, Dn as validatePluginsSetEnabledParams, Sb as buildCapabilityConsentErrorDetails, Sn as validatePluginsListParams, bn as validatePluginsInspectParams, gb as readInstallPolicyWarningErrorDetails, hb as INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED, vb as buildClawHubTrustErrorDetails, wn as validatePluginsSearchParams, xn as validatePluginsInstallParams, yb as isClawHubTrustErrorCode } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { a as listManagedPlugins, c as setManagedPluginEnabled, l as uninstallManagedPlugin, n as inspectManagedPlugin, r as installManagedPlugin } from "./management-service-B2JHS0QY.js";
import { t as buildGatewayReloadPlan } from "./config-reload-plan-DBp_hJKw.js";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-q1wYjpRM.js";
import { t as searchInstallablePluginPackages } from "./catalog-search-DzEy6CcP.js";
//#region src/gateway/server-methods/plugins.ts
function pluginPolicyRestartRequired(params) {
	const plan = buildGatewayReloadPlan([...params.changedPaths]);
	const mode = resolveGatewayReloadSettings(params.config).mode;
	return plan.restartGateway || mode === "off";
}
/** Gateway handlers for plugin inventory, ClawHub search, install, and policy state. */
const pluginsHandlers = {
	"plugins.refresh": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsRefreshParams, "plugins.refresh", respond)) return;
		context.notifyPluginMetadataChanged();
		respond(true, { ok: true }, void 0);
	},
	"plugins.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsListParams, "plugins.list", respond)) return;
		try {
			respond(true, await listManagedPlugins({ config: context.getRuntimeConfig() }), void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.inspect": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsInspectParams, "plugins.inspect", respond)) return;
		try {
			respond(true, await inspectManagedPlugin({
				config: context.getRuntimeConfig(),
				pluginId: params.pluginId
			}), void 0);
		} catch (error) {
			respond(false, void 0, errorShape((error instanceof ManagedPluginLifecycleError ? error : void 0)?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.search": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsSearchParams, "plugins.search", respond)) return;
		try {
			respond(true, { results: (await searchInstallablePluginPackages({
				query: params.query,
				limit: params.limit
			})).flatMap((entry) => {
				if (entry.package.family !== "code-plugin" && entry.package.family !== "bundle-plugin") return [];
				const downloads = entry.package.stats?.downloads;
				return [{
					score: entry.score,
					package: {
						name: entry.package.name,
						displayName: entry.package.displayName,
						family: entry.package.family,
						channel: entry.package.channel,
						isOfficial: entry.package.isOfficial,
						...entry.package.summary ? { summary: entry.package.summary } : {},
						...entry.package.latestVersion ? { latestVersion: entry.package.latestVersion } : {},
						...entry.package.runtimeId ? { runtimeId: entry.package.runtimeId } : {},
						...typeof downloads === "number" && Number.isFinite(downloads) && downloads >= 0 ? { downloads } : {},
						...entry.package.verificationTier ? { verificationTier: entry.package.verificationTier } : {}
					}
				}];
			}) }, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.install": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsInstallParams, "plugins.install", respond)) return;
		try {
			const result = await installManagedPlugin({ request: params });
			respond(true, {
				ok: true,
				plugin: result.plugin,
				restartRequired: true,
				...result.warnings ? { warnings: result.warnings } : {}
			}, void 0);
		} catch (error) {
			const lifecycleError = error instanceof ManagedPluginLifecycleError ? error : void 0;
			const trustCode = lifecycleError?.code && isClawHubTrustErrorCode(lifecycleError.code) ? lifecycleError.code : void 0;
			const trustDetails = lifecycleError ? buildClawHubTrustErrorDetails({
				...trustCode ? { code: trustCode } : {},
				...lifecycleError.version ? { version: lifecycleError.version } : {},
				...lifecycleError.warning ? { warning: lifecycleError.warning } : {}
			}) : void 0;
			const installPolicyDetails = lifecycleError?.installPolicyWarning ? readInstallPolicyWarningErrorDetails({
				installPolicyCode: INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED,
				...lifecycleError.installPolicyWarning
			}) : void 0;
			const details = (lifecycleError?.capabilityConsent ? buildCapabilityConsentErrorDetails(lifecycleError.capabilityConsent) : void 0) ?? installPolicyDetails ?? trustDetails;
			respond(false, void 0, errorShape(lifecycleError?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error), details ? { details } : void 0));
		}
	},
	"plugins.uninstall": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsUninstallParams, "plugins.uninstall", respond)) return;
		try {
			const result = await uninstallManagedPlugin({ pluginId: params.pluginId });
			respond(true, {
				ok: true,
				pluginId: result.pluginId,
				restartRequired: true,
				removed: result.removed,
				...result.warnings ? { warnings: result.warnings } : {}
			}, void 0);
		} catch (error) {
			respond(false, void 0, errorShape((error instanceof ManagedPluginLifecycleError ? error : void 0)?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.setEnabled": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsSetEnabledParams, "plugins.setEnabled", respond)) return;
		try {
			const result = await setManagedPluginEnabled({
				pluginId: params.pluginId,
				enabled: params.enabled,
				...params.acknowledgeCapabilities ? { acknowledgeCapabilities: params.acknowledgeCapabilities } : {}
			});
			respond(true, {
				ok: true,
				plugin: result.plugin,
				restartRequired: pluginPolicyRestartRequired({
					config: context.getRuntimeConfig(),
					changedPaths: result.changedPaths
				}),
				...result.warnings ? { warnings: result.warnings } : {}
			}, void 0);
		} catch (error) {
			const lifecycleError = error instanceof ManagedPluginLifecycleError ? error : void 0;
			respond(false, void 0, errorShape(lifecycleError?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error), lifecycleError?.capabilityConsent ? { details: buildCapabilityConsentErrorDetails(lifecycleError.capabilityConsent) } : void 0));
		}
	}
};
//#endregion
export { pluginsHandlers };
