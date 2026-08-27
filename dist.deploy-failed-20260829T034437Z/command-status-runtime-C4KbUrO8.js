import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
/** Resolves the direct status reply text for a session without eagerly loading runtime code. */
const resolveDirectStatusReplyForSession = createLazyRuntimeMethodBinder(createLazyRuntimeModule(() => import("./command-status.runtime.js")))((runtime) => runtime.resolveDirectStatusReplyForSessionCore);
//#endregion
export { resolveDirectStatusReplyForSession as t };
