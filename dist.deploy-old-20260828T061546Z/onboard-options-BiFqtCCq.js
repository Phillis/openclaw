import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
//#region src/commands/onboard-options.ts
/**
* Shared rejection path for `openclaw onboard` option validation.
*
* Lives above the local/remote split because both the outer command and the
* non-interactive handlers reject options, and every one of them must honor --json.
*/
/** Reports an invalid option and exits; returns false so validators can `return` it directly. */
function rejectOnboardingOption(opts, runtime, message) {
	if (opts.json) writeRuntimeJson(runtime, {
		ok: false,
		phase: "options",
		message
	});
	runtime.error(message);
	runtime.exit(1);
	return false;
}
//#endregion
export { rejectOnboardingOption as t };
