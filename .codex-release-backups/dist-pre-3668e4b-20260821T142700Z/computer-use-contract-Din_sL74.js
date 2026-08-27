import { Compile } from "typebox/compile";
import { Type } from "typebox";
//#region src/plugins/computer-use-contract.ts
const COMPUTER_USE_V2_ACTION_NAMES = [
	"screenshot",
	"left_click",
	"right_click",
	"middle_click",
	"double_click",
	"triple_click",
	"mouse_move",
	"left_click_drag",
	"left_mouse_down",
	"left_mouse_up",
	"scroll",
	"type",
	"key",
	"hold_key",
	"wait",
	"list_apps",
	"list_windows",
	"get_accessibility_tree",
	"get_cursor_position",
	"get_window_state",
	"launch_app",
	"kill_app",
	"bring_to_front",
	"set_value",
	"zoom",
	"get_browser_state",
	"browser_prepare",
	"browser_navigate",
	"browser_click",
	"browser_type",
	"browser_dialog",
	"browser_set_input_files",
	"browser_download",
	"browser_pointer",
	"escalate_scope",
	"get_recording_state",
	"start_recording",
	"stop_recording",
	"replay_trajectory",
	"invoke_menu"
];
const COMPUTER_USE_V1_ACTION_NAMES = COMPUTER_USE_V2_ACTION_NAMES.slice(0, 15);
const COMPUTER_ACT_V1_ACTION_NAMES = COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14);
const COMPUTER_USE_CONTRACT_ONLY_ACTION_NAMES = [
	"get_browser_state",
	"browser_prepare",
	"browser_navigate",
	"browser_click",
	"browser_type",
	"browser_dialog",
	"browser_set_input_files",
	"browser_download",
	"browser_pointer",
	"get_recording_state",
	"start_recording",
	"stop_recording",
	"replay_trajectory"
];
const COMPUTER_CONTRACT_MISMATCH = "COMPUTER_CONTRACT_MISMATCH";
const COMPUTER_STALE_OBSERVATION = "COMPUTER_STALE_OBSERVATION";
const SCROLL_DIRECTIONS = [
	"up",
	"down",
	"left",
	"right"
];
const DELIVERY_MODES = ["background", "foreground"];
const ESCALATION_REASONS = [
	"ax_tree_pixel_mismatch",
	"background_delivery_failed",
	"foreground_ineffective",
	"no_window_target",
	"other"
];
const optionalScreenFields = {
	screenIndex: Type.Optional(Type.Integer({ minimum: 0 })),
	refWidth: Type.Optional(Type.Integer({ minimum: 1 }))
};
const optionalReferenceFields = {
	windowRef: Type.Optional(Type.String({ minLength: 1 })),
	elementRef: Type.Optional(Type.String({ minLength: 1 })),
	observationId: Type.Optional(Type.String({ minLength: 1 })),
	deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
};
function actionObject(actions, properties) {
	return Type.Object({
		action: Type.Enum(actions, { type: "string" }),
		...properties
	}, { additionalProperties: false });
}
const ComputerActV1ParamsSchema = Type.Union([
	actionObject([
		"left_click",
		"right_click",
		"middle_click",
		"double_click",
		"triple_click",
		"mouse_move"
	], {
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		modifiers: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["left_click_drag"], {
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		fromX: Type.Optional(Type.Number({ minimum: 0 })),
		fromY: Type.Optional(Type.Number({ minimum: 0 })),
		durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["left_mouse_down", "left_mouse_up"], {
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		modifiers: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["scroll"], {
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		modifiers: Type.Optional(Type.String()),
		scrollDirection: Type.Optional(Type.Enum(SCROLL_DIRECTIONS, { type: "string" })),
		scrollAmount: Type.Optional(Type.Integer({ minimum: 1 })),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["type"], {
		text: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["key"], {
		keys: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["hold_key"], {
		keys: Type.Optional(Type.String()),
		durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
		...optionalScreenFields,
		...optionalReferenceFields
	})
]);
/** Canonical inner payload accepted by the `computer.act` node command. */
const ComputerActParamsSchema = Type.Union([
	...ComputerActV1ParamsSchema.anyOf,
	actionObject([
		"list_apps",
		"list_windows",
		"get_cursor_position"
	], {}),
	actionObject(["get_accessibility_tree"], {
		windowRef: Type.Optional(Type.String({ minLength: 1 })),
		query: Type.Optional(Type.String()),
		depth: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: 64
		})),
		maxElements: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 2e3
		}))
	}),
	actionObject(["get_window_state"], {
		windowRef: Type.String({ minLength: 1 }),
		query: Type.Optional(Type.String()),
		depth: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: 64
		})),
		maxElements: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 2e3
		}))
	}),
	actionObject(["launch_app", "kill_app"], { app: Type.String({ minLength: 1 }) }),
	actionObject(["bring_to_front"], { windowRef: Type.String({ minLength: 1 }) }),
	actionObject(["set_value"], {
		windowRef: Type.String({ minLength: 1 }),
		elementRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		value: Type.String(),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["invoke_menu"], {
		windowRef: Type.String({ minLength: 1 }),
		path: Type.Array(Type.String({
			minLength: 1,
			maxLength: 200
		}), {
			minItems: 1,
			maxItems: 16
		}),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["zoom"], {
		windowRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		x1: Type.Number({ minimum: 0 }),
		y1: Type.Number({ minimum: 0 }),
		x2: Type.Number({ minimum: 0 }),
		y2: Type.Number({ minimum: 0 })
	}),
	actionObject(["escalate_scope"], { reason: Type.Enum(ESCALATION_REASONS, { type: "string" }) })
]);
const COMPUTER_ACT_RESULT_MAX_ELEMENTS = 2e3;
const COMPUTER_ACT_RESULT_MAX_DETAIL_KEYS = 64;
const ComputerBoundsSchema = Type.Object({
	x: Type.Number(),
	y: Type.Number(),
	width: Type.Number({ minimum: 0 }),
	height: Type.Number({ minimum: 0 })
}, { additionalProperties: false });
const ComputerObservationSchema = Type.Object({
	kind: Type.Enum(["window", "screen"], { type: "string" }),
	base64: Type.Optional(Type.String()),
	format: Type.Optional(Type.Enum(["jpeg", "png"], { type: "string" })),
	width: Type.Optional(Type.Integer({ minimum: 1 })),
	height: Type.Optional(Type.Integer({ minimum: 1 })),
	observationId: Type.Optional(Type.String({ minLength: 1 })),
	elements: Type.Optional(Type.Array(Type.Object({
		elementRef: Type.String({ minLength: 1 }),
		role: Type.String({ minLength: 1 }),
		label: Type.Optional(Type.String()),
		value: Type.Optional(Type.String()),
		bounds: ComputerBoundsSchema
	}, { additionalProperties: false }), { maxItems: COMPUTER_ACT_RESULT_MAX_ELEMENTS }))
}, { additionalProperties: false });
const ComputerActResultSchema = Type.Object({
	ok: Type.Boolean(),
	effect: Type.Optional(Type.Enum([
		"confirmed",
		"unverifiable",
		"suspected_noop"
	], { type: "string" })),
	observation: Type.Optional(ComputerObservationSchema),
	escalation: Type.Optional(Type.Object({
		recommended: Type.Enum([
			"window-pixel",
			"foreground",
			"desktop"
		], { type: "string" }),
		reasonCode: Type.String({ minLength: 1 })
	}, { additionalProperties: false })),
	details: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 128
	}), Type.Unknown(), { maxProperties: COMPUTER_ACT_RESULT_MAX_DETAIL_KEYS }))
}, { additionalProperties: false });
const ComputerUseCapabilityDescriptorSchema = Type.Object({
	contractVersion: Type.Literal(2),
	provider: Type.Object({
		id: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		label: Type.String({
			minLength: 1,
			maxLength: 256
		}),
		generation: Type.String({
			minLength: 1,
			maxLength: 256
		})
	}, { additionalProperties: false }),
	actions: Type.Array(Type.Enum(COMPUTER_USE_V2_ACTION_NAMES, { type: "string" }), {
		maxItems: COMPUTER_USE_V2_ACTION_NAMES.length,
		uniqueItems: true
	}),
	targets: Type.Array(Type.Enum([
		"screen",
		"window",
		"element",
		"browser"
	]), {
		maxItems: 4,
		uniqueItems: true
	}),
	deliveryModes: Type.Array(Type.Enum(DELIVERY_MODES, { type: "string" }), {
		maxItems: DELIVERY_MODES.length,
		uniqueItems: true
	}),
	observations: Type.Array(Type.Enum([
		"image",
		"accessibility",
		"browser"
	], { type: "string" }), {
		maxItems: 3,
		uniqueItems: true
	}),
	features: Type.Object({
		recording: Type.Boolean(),
		agentCursor: Type.Boolean(),
		multiDisplay: Type.Boolean()
	}, { additionalProperties: false })
}, { additionalProperties: false });
/** Canonical inner payload accepted by the `screen.snapshot` node command. */
const ScreenSnapshotParamsSchema = Type.Object({
	screenIndex: Type.Optional(Type.Integer({ minimum: 0 })),
	maxWidth: Type.Optional(Type.Integer({ minimum: 1 })),
	quality: Type.Optional(Type.Number()),
	format: Type.Optional(Type.Enum(["jpeg", "png"], { type: "string" }))
}, { additionalProperties: false });
/** Canonical inner payload returned by the `screen.snapshot` node command. */
const ScreenSnapshotResultSchema = Type.Object({
	format: Type.Enum(["jpeg", "png"], { type: "string" }),
	base64: Type.String({ minLength: 1 }),
	displayFrameId: Type.Optional(Type.String()),
	screenIndex: Type.Optional(Type.Number()),
	width: Type.Optional(Type.Number()),
	height: Type.Optional(Type.Number()),
	capturedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Compile one Computer Use wire schema into a reusable type-guard validator. */
function compileComputerUseValidator(schema) {
	const validator = Compile(schema);
	return (value) => validator.Check(value);
}
const validateComputerActParams = compileComputerUseValidator(ComputerActParamsSchema);
const validateComputerActResult = compileComputerUseValidator(ComputerActResultSchema);
const validateComputerUseCapabilityDescriptor = compileComputerUseValidator(ComputerUseCapabilityDescriptorSchema);
const validateScreenSnapshotParams = compileComputerUseValidator(ScreenSnapshotParamsSchema);
const validateScreenSnapshotResult = compileComputerUseValidator(ScreenSnapshotResultSchema);
function parseParamsJSON(paramsJSON, validate) {
	let value;
	try {
		value = JSON.parse(paramsJSON ?? "{}");
	} catch {
		throw new Error("COMPUTER_INVALID_REQUEST: params must be valid JSON");
	}
	if (!validate(value)) throw new Error("COMPUTER_INVALID_REQUEST: invalid params");
	return value;
}
function parseComputerActParamsJSON(paramsJSON) {
	return parseParamsJSON(paramsJSON, validateComputerActParams);
}
function parseScreenSnapshotParamsJSON(paramsJSON) {
	return parseParamsJSON(paramsJSON, validateScreenSnapshotParams);
}
/** Validate one provider result envelope. */
function parseComputerActResult(value) {
	if (!validateComputerActResult(value)) throw new Error(`${COMPUTER_CONTRACT_MISMATCH}: invalid computer.act result`);
	return value;
}
/** Validate one bounded Computer Use declaration carried by a node connect. */
function parseComputerUseCapabilityDescriptor(value) {
	if (!validateComputerUseCapabilityDescriptor(value)) throw new Error(`${COMPUTER_CONTRACT_MISMATCH}: invalid capability descriptor`);
	return value;
}
/** Validate and project a `screen.snapshot` result without retaining unknown fields. */
function parseScreenSnapshotResult(value) {
	if (!validateScreenSnapshotResult(value)) throw new Error("invalid screen.snapshot payload");
	return {
		format: value.format,
		base64: value.base64,
		...value.displayFrameId ? { displayFrameId: value.displayFrameId } : {},
		...value.screenIndex !== void 0 ? { screenIndex: value.screenIndex } : {},
		...value.width !== void 0 ? { width: value.width } : {},
		...value.height !== void 0 ? { height: value.height } : {},
		...value.capturedAtMs !== void 0 ? { capturedAtMs: value.capturedAtMs } : {}
	};
}
/** Register the canonical node-host command pair for one node-local provider. */
function registerComputerUseProvider(api, provider) {
	let executionPromise;
	const getExecution = (context) => {
		if (!executionPromise) {
			const opened = provider.openExecution(context?.sessionKey ? { sessionKey: context.sessionKey } : {});
			opened.catch(() => {
				if (executionPromise === opened) executionPromise = void 0;
			});
			executionPromise = opened;
		}
		return executionPromise;
	};
	const closeExecution = async (reason) => {
		const current = executionPromise;
		executionPromise = void 0;
		if (current) await (await current).close(reason);
	};
	api.registerNodeHostCommand({
		command: "screen.snapshot",
		cap: "screen",
		dangerous: false,
		isAvailable: () => provider.isAvailable(),
		watchAvailability: (context, onChange) => {
			const stopWatching = provider.watchAvailability?.(context, onChange);
			return () => {
				stopWatching?.();
				closeExecution("node-host-stop");
			};
		},
		handle: async (paramsJSON, _io, context) => await (await getExecution(context)).snapshot(paramsJSON, context?.signal)
	});
	api.registerNodeHostCommand({
		command: "computer.act",
		cap: "computer",
		dangerous: true,
		computerUse: () => provider.capabilities(),
		isAvailable: () => provider.isAvailable(),
		handle: async (paramsJSON, _io, context) => await (await getExecution(context)).act(paramsJSON, context?.signal)
	});
}
//#endregion
export { parseScreenSnapshotResult as _, COMPUTER_USE_V1_ACTION_NAMES as a, ComputerActResultSchema as c, ScreenSnapshotResultSchema as d, compileComputerUseValidator as f, parseScreenSnapshotParamsJSON as g, parseComputerUseCapabilityDescriptor as h, COMPUTER_USE_CONTRACT_ONLY_ACTION_NAMES as i, ComputerUseCapabilityDescriptorSchema as l, parseComputerActResult as m, COMPUTER_CONTRACT_MISMATCH as n, COMPUTER_USE_V2_ACTION_NAMES as o, parseComputerActParamsJSON as p, COMPUTER_STALE_OBSERVATION as r, ComputerActParamsSchema as s, COMPUTER_ACT_V1_ACTION_NAMES as t, ScreenSnapshotParamsSchema as u, registerComputerUseProvider as v };
