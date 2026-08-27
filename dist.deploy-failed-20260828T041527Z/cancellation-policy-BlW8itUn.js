//#region src/process/supervisor/service-child-protocol.ts
function encodeServiceChildMessage(message) {
	return `${JSON.stringify(message)}\n`;
}
//#endregion
//#region src/process/supervisor/cancellation-policy.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
//#endregion
export { encodeServiceChildMessage as n, GRACEFUL_CANCEL_TIMEOUT_MS as t };
