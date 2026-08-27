import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Yt as validateLogsTailParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { n as defineValidatedGatewayMethod } from "./validation-kYFXohur.js";
import { t as readConfiguredLogTail } from "./log-tail-BfEjNefQ.js";
//#region src/gateway/server-methods/logs.ts
/** Gateway handler for bounded reads from the configured gateway log. */
const logsHandlers = { "logs.tail": defineValidatedGatewayMethod("logs.tail", validateLogsTailParams, async ({ params, respond }) => {
	try {
		respond(true, await readConfiguredLogTail({
			cursor: params.cursor,
			limit: params.limit,
			maxBytes: params.maxBytes
		}), void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`));
	}
}) };
//#endregion
export { logsHandlers };
