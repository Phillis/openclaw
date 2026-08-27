import { n as asNullableObjectRecord } from "./record-coerce-DItp3I4t.js";
//#region src/infra/tailscale-route-ownership-error.ts
const TAILSCALE_ROUTE_OWNERSHIP_CONFLICT_CODE = "TAILSCALE_ROUTE_OWNERSHIP_CONFLICT";
var TailscaleRouteOwnershipConflictError = class extends Error {
	constructor() {
		super("Tailscale HTTPS port 443 is already owned by a route whose ownership OpenClaw cannot prove; it was not modified. Inspect `tailscale serve status`. If it is a stale route from an older OpenClaw release, remove its root handler with `tailscale serve --yes --https=443 --set-path=/ off` or `tailscale funnel --yes --https=443 --set-path=/ off`, then restart the Gateway. Otherwise disable managed Tailscale ingress or reconfigure the route before restarting.");
		this.code = TAILSCALE_ROUTE_OWNERSHIP_CONFLICT_CODE;
		this.name = "TailscaleRouteOwnershipConflictError";
	}
};
function isTailscaleRouteOwnershipConflictError(error) {
	return error instanceof TailscaleRouteOwnershipConflictError || asNullableObjectRecord(error)?.code === TAILSCALE_ROUTE_OWNERSHIP_CONFLICT_CODE;
}
//#endregion
export { isTailscaleRouteOwnershipConflictError as n, TailscaleRouteOwnershipConflictError as t };
