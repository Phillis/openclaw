import { Yo as PortalCloseResultSchema, Zo as PortalListResultSchema, es as PortalSummarySchema } from "./src-4dv5TpeQ.js";
import { Type } from "typebox";
//#region src/agents/tools/portal-tool-contract.ts
const PORTAL_TOOL_DESCRIPTION = "Expose local HTTP server; operator sees it live in Control UI. Order matters: action=open with the port first, which returns the URL; then start the dev server as a background process, passing PORT and PUBLIC_URL from that result. Workspace may declare servers in .openclaw/portals.json. Proxies HTTP and WebSockets, so hot reload works; serves retry page until port listens. action=list and action=close manage portals. Portals end at gateway restart.";
const PortalToolSchema = Type.Object({
	action: Type.String({
		enum: [
			"open",
			"list",
			"close"
		],
		description: "Portal action"
	}),
	port: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65535
	})),
	title: Type.Optional(Type.String({ minLength: 1 })),
	description: Type.Optional(Type.String()),
	path: Type.Optional(Type.String({ pattern: "^/" })),
	id: Type.Optional(Type.String({ minLength: 1 }))
}, { additionalProperties: false });
const PortalOutputSchema = Type.Union([
	PortalSummarySchema,
	PortalListResultSchema,
	PortalCloseResultSchema
]);
//#endregion
export { PortalOutputSchema as n, PortalToolSchema as r, PORTAL_TOOL_DESCRIPTION as t };
