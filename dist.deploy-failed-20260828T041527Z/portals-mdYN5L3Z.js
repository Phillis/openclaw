import "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Mn as validatePortalCloseParams, Nn as validatePortalListParams, Pn as validatePortalOpenParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { n as defineValidatedGatewayMethod } from "./validation-kYFXohur.js";
//#region src/gateway/server-methods/portals.ts
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
	"portal.list": defineValidatedGatewayMethod("portal.list", validatePortalListParams, ({ respond, context, client }) => {
		const service = requirePortalService(context, respond);
		if (!service) return;
		const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		const portals = service.list();
		respond(true, { portals: scopes.includes("operator.write") || scopes.includes("operator.admin") ? portals : portals.map(redactPortalSummary) }, void 0);
	}),
	"portal.open": defineValidatedGatewayMethod("portal.open", validatePortalOpenParams, async ({ params: request, respond, context }) => {
		const service = requirePortalService(context, respond);
		if (!service) return;
		try {
			const opened = await service.open({
				targetPort: request.port,
				...request.title !== void 0 ? { title: request.title } : {},
				...request.description !== void 0 ? { description: request.description } : {},
				...request.path !== void 0 ? { path: request.path } : {}
			});
			context.broadcast("portal.changed", { portals: service.list().map(redactPortalSummary) }, { dropIfSlow: true });
			respond(true, opened, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
		}
	}),
	"portal.close": defineValidatedGatewayMethod("portal.close", validatePortalCloseParams, async ({ params, respond, context }) => {
		const service = requirePortalService(context, respond);
		if (!service) return;
		try {
			await service.close(params.id);
			context.broadcast("portal.changed", { portals: service.list().map(redactPortalSummary) }, { dropIfSlow: true });
			respond(true, { closed: true }, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
		}
	})
};
//#endregion
export { portalHandlers };
