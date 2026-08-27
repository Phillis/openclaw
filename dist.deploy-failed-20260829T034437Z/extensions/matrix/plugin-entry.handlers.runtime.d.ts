import { _t as GatewayRequestHandlerOptions } from "../../plugin-entry-DF9X1uwv.js";
import "../../gateway-runtime-DbQPL8bv.js";
//#region extensions/matrix/src/plugin-entry.runtime.d.ts
declare function handleVerifyRecoveryKey({ params, respond }: GatewayRequestHandlerOptions): Promise<void>;
declare function handleVerificationBootstrap({ params, respond }: GatewayRequestHandlerOptions): Promise<void>;
declare function handleVerificationStatus({ params, respond }: GatewayRequestHandlerOptions): Promise<void>;
//#endregion
export { handleVerificationBootstrap, handleVerificationStatus, handleVerifyRecoveryKey };