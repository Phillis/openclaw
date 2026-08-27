import "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { An as validatePortalCloseParams, Mn as validatePortalOpenParams, jn as validatePortalListParams } from "./src-Bo4ezI_n.js";
import { l as formatValidationErrors, s as errorShape } from "./error-codes-CMSvT5-d.js";
//#region src/gateway/server-methods/portals.ts
function invalidParams(method, errors, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(errors)}`));
}
function requirePortalService(context, respond) {
	const service = context.portalService;
	if (!service) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "portals unavailable"));
	return service;
}
function redactPortalSummary(summary) {
	const { tokenQuery: _tokenQuery, url: _url, ...redacted } = summary;
	return redacted;
}
const portalHandlers = {
	"portal.list": ({ params, respond, context, client }) => {
		if (!validatePortalListParams(params)) {
			invalidParams("portal.list", validatePortalListParams.errors, respond);
			return;
		}
		const service = requirePortalService(context, respond);
		if (!service) return;
		const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		const portals = service.list();
		respond(true, { portals: scopes.includes("operator.write") || scopes.includes("operator.admin") ? portals : portals.map(redactPortalSummary) }, void 0);
	},
	"portal.open": async ({ params, respond, context }) => {
		if (!validatePortalOpenParams(params)) {
			invalidParams("portal.open", validatePortalOpenParams.errors, respond);
			return;
		}
		const service = requirePortalService(context, respond);
		if (!service) return;
		try {
			const request = params;
			const portal = await service.open({
				targetPort: request.port,
				...request.title !== void 0 ? { title: request.title } : {},
				...request.description !== void 0 ? { description: request.description } : {},
				...request.path !== void 0 ? { path: request.path } : {}
			});
			context.broadcast("portal.changed", { portals: service.list().map(redactPortalSummary) }, { dropIfSlow: true });
			respond(true, portal, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
		}
	},
	"portal.close": async ({ params, respond, context }) => {
		if (!validatePortalCloseParams(params)) {
			invalidParams("portal.close", validatePortalCloseParams.errors, respond);
			return;
		}
		const service = requirePortalService(context, respond);
		if (!service) return;
		try {
			await service.close(params.id);
			context.broadcast("portal.changed", { portals: service.list().map(redactPortalSummary) }, { dropIfSlow: true });
			respond(true, { closed: true }, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
		}
	}
};
//#endregion
export { portalHandlers };
