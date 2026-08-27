import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Jt as validateLogsTailParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as readConfiguredLogTail } from "./log-tail-DQ4CGQW8.js";
//#region src/gateway/server-methods/logs.ts
/** Gateway handler for bounded reads from the configured gateway log. */
const logsHandlers = { "logs.tail": async ({ params, respond }) => {
	if (!assertValidParams(params, validateLogsTailParams, "logs.tail", respond)) return;
	const p = params;
	try {
		respond(true, await readConfiguredLogTail({
			cursor: p.cursor,
			limit: p.limit,
			maxBytes: p.maxBytes
		}), void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`));
	}
} };
//#endregion
export { logsHandlers };
