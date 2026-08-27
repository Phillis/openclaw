import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as createDiagnosticsOtelService } from "../../runtime-api-D7IInt1t.js";
//#region extensions/diagnostics-otel/index.ts
var diagnostics_otel_default = definePluginEntry({
	id: "diagnostics-otel",
	name: "Diagnostics OpenTelemetry",
	description: "Export diagnostics events to OpenTelemetry",
	register(api) {
		api.registerService(createDiagnosticsOtelService());
	}
});
//#endregion
export { diagnostics_otel_default as default };
