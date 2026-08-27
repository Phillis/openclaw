import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-BBjU-hqW.js";
import { At as boolean, Ln as strictObject, Rn as string, Tn as object, dn as literal, wn as number } from "../../schemas-CZ9Toj_c.js";
import { t as canonicalizeBase64 } from "../../base64-KcXAb-1x.js";
import { g as parseScreenSnapshotParamsJSON, o as COMPUTER_USE_V2_ACTION_NAMES, p as parseComputerActParamsJSON, v as registerComputerUseProvider } from "../../computer-use-contract-Din_sL74.js";
import { n as buildPluginConfigSchema } from "../../config-schema-CkCZDriU.js";
import "../../temp-path-ChKDkme1.js";
import "../../media-runtime-C6qiOSZe.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import "../../computer-use-BJ10Old4.js";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRastermill } from "rastermill";
//#region extensions/cua-computer/src/actions.ts
const MODIFIER_ALIASES = /* @__PURE__ */ new Map([
	["ctrl", "ctrl"],
	["control", "ctrl"],
	["shift", "shift"],
	["alt", "alt"],
	["menu", "alt"],
	["option", "alt"],
	["mod1", "alt"],
	["cmd", "meta"],
	["command", "meta"],
	["meta", "meta"],
	["super", "meta"],
	["win", "meta"],
	["windows", "meta"],
	["mod4", "meta"]
]);
const KEY_ALIASES = /* @__PURE__ */ new Map([
	["return", "enter"],
	["enter", "enter"],
	["tab", "tab"],
	["escape", "escape"],
	["esc", "escape"],
	["space", "space"],
	["backspace", "backspace"],
	["delete", "delete"],
	["del", "delete"],
	["insert", "insert"],
	["ins", "insert"],
	["home", "home"],
	["end", "end"],
	["pageup", "pageup"],
	["pgup", "pageup"],
	["pagedown", "pagedown"],
	["pgdn", "pagedown"],
	["up", "up"],
	["down", "down"],
	["left", "left"],
	["right", "right"],
	["capslock", "capslock"],
	["numlock", "numlock"]
]);
for (let index = 1; index <= 12; index += 1) KEY_ALIASES.set(`f${index}`, `f${index}`);
function unsupportedKey(message) {
	return /* @__PURE__ */ new Error(`COMPUTER_UNSUPPORTED_KEY: ${message}`);
}
function normalizeModifiers(value) {
	if (!value?.trim()) return [];
	return value.split("+").map((entry) => {
		const raw = entry.trim();
		const normalized = MODIFIER_ALIASES.get(raw.toLowerCase());
		if (!normalized) throw unsupportedKey(`unknown modifier ${JSON.stringify(raw)}`);
		return normalized;
	});
}
function normalizeKey(value) {
	const raw = value.trim();
	if (!raw) throw unsupportedKey("key chord contains an empty key");
	const lowered = raw.toLowerCase();
	const modifier = MODIFIER_ALIASES.get(lowered);
	if (modifier) return modifier;
	const named = KEY_ALIASES.get(lowered);
	if (named) return named;
	if (/^[a-z]$/i.test(raw)) return lowered;
	if (raw.length === 1) throw unsupportedKey(`single-character key ${JSON.stringify(raw)} loses layout shift state in cua-driver; use the type action instead`);
	throw unsupportedKey(`unknown key ${JSON.stringify(raw)}`);
}
function parseKeyChord(value) {
	const segments = value?.split("+").map((entry) => entry.trim()) ?? [];
	const rawKey = segments.pop();
	if (!rawKey) throw unsupportedKey("key chord is empty");
	const modifiers = segments.map((entry) => {
		const normalized = MODIFIER_ALIASES.get(entry.toLowerCase());
		if (!normalized) throw unsupportedKey(`unknown modifier ${JSON.stringify(entry)}`);
		return normalized;
	});
	return {
		key: normalizeKey(rawKey),
		modifiers
	};
}
function scalePoint(frame, x, y, label) {
	if (x === void 0 || y === void 0) throw new Error(`COMPUTER_INVALID_REQUEST: ${label} coordinates are required`);
	if (x >= frame.deliveredWidth || y >= frame.deliveredHeight) throw new Error(`COMPUTER_INVALID_REQUEST: ${label} coordinates are outside the captured primary-display frame`);
	return {
		x: Math.min(frame.nativeWidth - 1, Math.round(x * frame.nativeWidth / frame.deliveredWidth)),
		y: Math.min(frame.nativeHeight - 1, Math.round(y * frame.nativeHeight / frame.deliveredHeight))
	};
}
//#endregion
//#region extensions/cua-computer/src/driver-client.ts
const EscalationReason = {
	AxTreePixelMismatch: 0,
	BackgroundDeliveryFailed: 1,
	ForegroundIneffective: 2,
	NoWindowTarget: 3,
	Other: 4
};
const ClickButton = {
	Left: 0,
	Right: 1,
	Middle: 2
};
const ScrollDirection = {
	Up: 0,
	Down: 1,
	Left: 2,
	Right: 3
};
function asyncOptions(signal) {
	return signal ? { signal } : void 0;
}
var DirectCuaDriverSession = class {
	constructor(sdk) {
		this.sdk = sdk;
		this.generation = randomUUID();
		this.publicSession = `openclaw-${randomUUID()}`;
		this.started = false;
		this.disposed = false;
		const unrestricted = sdk.SessionPermissionMode.Unrestricted;
		const authorization = {
			allowedModes: [unrestricted],
			compatibilityMode: unrestricted,
			unrestrictedAcknowledged: true,
			maxSessionTtlSeconds: 3600n,
			maxIdleTtlSeconds: 300n
		};
		this.runtime = sdk.CuaDriver.createConfigured({
			claudeCodeCompatibility: false,
			authorization
		});
		this.session = sdk.createTrustedSession(this.runtime, {
			publicSession: this.publicSession,
			mode: unrestricted,
			ttlSeconds: authorization.maxSessionTtlSeconds,
			idleTtlSeconds: authorization.maxIdleTtlSeconds
		});
	}
	async ensureStarted(captureScope, signal) {
		if (this.disposed) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: cua-computer is stopping");
		if (!this.startPromise) {
			this.captureScope = captureScope;
			const start = this.session.startSession({
				session: this.publicSession,
				captureScope
			}, asyncOptions(signal)).then(() => {
				this.started = true;
			});
			this.startPromise = start;
			try {
				await start;
			} catch (error) {
				if (this.startPromise === start) this.startPromise = void 0;
				throw error;
			}
			return;
		}
		await this.startPromise;
		if (captureScope === this.sdk.CaptureScope.Desktop && this.captureScope !== this.sdk.CaptureScope.Desktop) await this.ensureDesktopScope(signal);
	}
	async ensureDesktopScope(signal) {
		if (!this.desktopEscalationPromise) this.desktopEscalationPromise = this.session.escalateSession({
			session: this.publicSession,
			reason: this.sdk.EscalationReason.Other,
			detail: "explicit desktop-scope OpenClaw action"
		}, asyncOptions(signal)).then(() => {
			this.captureScope = this.sdk.CaptureScope.Desktop;
		});
		await this.desktopEscalationPromise;
	}
	async invoke(captureScope, signal, operation) {
		await this.ensureStarted(captureScope, signal);
		return await operation();
	}
	isAvailable() {
		return !this.disposed && this.runtime.isAvailable();
	}
	resetAvailabilityCache() {}
	async callTool(name, args, signal) {
		return await this.invoke(this.sdk.CaptureScope.Window, signal, () => this.session.callTool(name, JSON.stringify({
			...args,
			session: this.publicSession
		}), asyncOptions(signal)));
	}
	async escalateScope(reason, signal) {
		await this.ensureStarted(this.sdk.CaptureScope.Window, signal);
		const state = await this.session.escalateSession({
			session: this.publicSession,
			reason
		}, asyncOptions(signal));
		this.captureScope = this.sdk.CaptureScope.Desktop;
		return state;
	}
	async getDesktopState(signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.getDesktopState({}, asyncOptions(signal)));
	}
	async getScreenSize(signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.getScreenSize({}, asyncOptions(signal)));
	}
	async click(input, signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.click({
			...input,
			scope: this.sdk.DesktopScope.Desktop
		}, asyncOptions(signal)));
	}
	async drag(input, signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.drag({
			...input,
			scope: this.sdk.DesktopScope.Desktop
		}, asyncOptions(signal)));
	}
	async moveCursor(input, signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.moveCursor({
			...input,
			scope: this.sdk.DesktopScope.Desktop
		}, asyncOptions(signal)));
	}
	async scroll(input, signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.scroll({
			...input,
			scope: this.sdk.DesktopScope.Desktop,
			by: this.sdk.ScrollBy.Line
		}, asyncOptions(signal)));
	}
	async typeText(text, signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.typeText({
			text,
			scope: this.sdk.DesktopScope.Desktop
		}, asyncOptions(signal)));
	}
	async pressKey(input, signal) {
		return await this.invoke(this.sdk.CaptureScope.Desktop, signal, () => this.session.pressKey({
			...input,
			scope: this.sdk.DesktopScope.Desktop
		}, asyncOptions(signal)));
	}
	async dispose() {
		if (this.disposed) return;
		this.disposed = true;
		let failure;
		try {
			await this.startPromise;
		} catch (error) {
			failure = error;
		}
		if (this.started) try {
			await this.session.endSession({ session: this.publicSession });
		} catch (error) {
			failure ??= error;
		}
		try {
			this.session.close();
		} catch (error) {
			failure = error;
		}
		try {
			await this.runtime.shutdown();
		} catch (error) {
			failure ??= error;
		}
		try {
			this.runtime.uniffiDestroy?.();
		} catch (error) {
			failure ??= error;
		}
		if (failure) throw failure instanceof Error ? failure : new Error("CUA Driver cleanup failed", { cause: failure });
	}
};
async function loadCuaDriverSdk() {
	return await import("@trycua/cua-driver");
}
function unavailableError(failure) {
	const detail = failure instanceof Error ? failure.message : String(failure);
	return new Error(`COMPUTER_DRIVER_UNAVAILABLE: failed to load CUA Driver SDK: ${detail}`, { cause: failure });
}
function isPromise(value) {
	return typeof value.then === "function";
}
var LazyCuaDriverSession = class {
	constructor(loadSdk) {
		this.loadSdk = loadSdk;
		this.unloadedGeneration = randomUUID();
		this.hasLoadFailure = false;
		this.disposed = false;
	}
	get generation() {
		return this.runtime?.generation ?? this.unloadedGeneration;
	}
	resolveRuntime() {
		if (this.disposed || this.hasLoadFailure || this.loadPromise) return;
		if (this.runtime) return this.runtime;
		try {
			const loadedSdk = this.loadSdk();
			if (!isPromise(loadedSdk)) {
				this.runtime = new DirectCuaDriverSession(loadedSdk);
				return this.runtime;
			}
			const loadPromise = loadedSdk.then((sdk) => new DirectCuaDriverSession(sdk)).then((runtime) => {
				this.runtime = runtime;
				return runtime;
			}).catch((error) => {
				this.loadFailure = error;
				this.hasLoadFailure = true;
				throw error;
			}).finally(() => {
				if (this.loadPromise === loadPromise) this.loadPromise = void 0;
			});
			this.loadPromise = loadPromise;
			loadPromise.catch(() => {});
			return this.runtime;
		} catch (error) {
			this.loadFailure = error;
			this.hasLoadFailure = true;
			return;
		}
	}
	async requireRuntime() {
		const runtime = this.resolveRuntime();
		if (runtime) return runtime;
		if (this.loadPromise) try {
			return await this.loadPromise;
		} catch (error) {
			throw unavailableError(this.loadFailure ?? error);
		}
		throw unavailableError(this.disposed ? /* @__PURE__ */ new Error("cua-computer is stopping") : this.loadFailure);
	}
	isAvailable() {
		return this.resolveRuntime()?.isAvailable() ?? false;
	}
	resetAvailabilityCache() {
		if (this.runtime) this.runtime.resetAvailabilityCache();
		else if (!this.disposed && !this.loadPromise) {
			this.loadFailure = void 0;
			this.hasLoadFailure = false;
		}
	}
	async getDesktopState(signal) {
		return await (await this.requireRuntime()).getDesktopState(signal);
	}
	async callTool(name, args, signal) {
		return await (await this.requireRuntime()).callTool(name, args, signal);
	}
	async escalateScope(reason, signal) {
		return await (await this.requireRuntime()).escalateScope(reason, signal);
	}
	async getScreenSize(signal) {
		return await (await this.requireRuntime()).getScreenSize(signal);
	}
	async click(input, signal) {
		return await (await this.requireRuntime()).click(input, signal);
	}
	async drag(input, signal) {
		return await (await this.requireRuntime()).drag(input, signal);
	}
	async moveCursor(input, signal) {
		return await (await this.requireRuntime()).moveCursor(input, signal);
	}
	async scroll(input, signal) {
		return await (await this.requireRuntime()).scroll(input, signal);
	}
	async typeText(text, signal) {
		return await (await this.requireRuntime()).typeText(text, signal);
	}
	async pressKey(input, signal) {
		return await (await this.requireRuntime()).pressKey(input, signal);
	}
	async dispose() {
		if (this.disposed) return;
		this.disposed = true;
		try {
			await this.loadPromise;
		} catch {}
		await this.runtime?.dispose();
	}
};
function createCuaDriver(options = {}) {
	return new LazyCuaDriverSession(options.loadSdk ?? loadCuaDriverSdk);
}
//#endregion
//#region extensions/cua-computer/src/frame.ts
function staleFrame(message) {
	return /* @__PURE__ */ new Error(`COMPUTER_STALE_FRAME: ${message}; take a new screenshot`);
}
function staleObservation() {
	return /* @__PURE__ */ new Error("COMPUTER_STALE_OBSERVATION: take a fresh observation and retry");
}
function opaqueRef(kind) {
	return `cua:v2:${kind}:${randomUUID()}`;
}
function adoptGeneration(state, generation) {
	if (state.generation !== generation) {
		state.lastFrame = void 0;
		state.apps = void 0;
		state.windows = void 0;
		state.observation = void 0;
	}
	state.generation = generation;
}
function verifyGeneration(state, generation) {
	if (state.generation !== generation) {
		adoptGeneration(state, generation);
		throw staleObservation();
	}
}
function issueAppRef(state, target) {
	state.apps ??= /* @__PURE__ */ new Map();
	const ref = opaqueRef("app");
	state.apps.set(ref, target);
	return ref;
}
function resolveAppRef(state, ref) {
	return state.apps?.get(ref);
}
function issueWindowRef(state, target) {
	state.windows ??= /* @__PURE__ */ new Map();
	for (const [ref, current] of state.windows) if (current.pid === target.pid && current.windowId === target.windowId) return ref;
	const ref = opaqueRef("window");
	state.windows.set(ref, target);
	return ref;
}
function resolveWindowRef(state, ref) {
	const target = state.windows?.get(ref);
	if (!target) throw staleObservation();
	return target;
}
function issueObservation(state, windowRef, options = {}) {
	const observation = {
		id: opaqueRef("observation"),
		windowRef,
		fromZoom: options.fromZoom === true,
		elements: /* @__PURE__ */ new Map()
	};
	state.observation = observation;
	return observation;
}
function issueElementRef(observation, target) {
	const ref = opaqueRef("element");
	observation.elements.set(ref, target);
	return ref;
}
function resolveObservation(state, observationId, windowRef) {
	const observation = state.observation;
	if (!observation || observation.id !== observationId || observation.windowRef !== windowRef) throw staleObservation();
	return observation;
}
function resolveElementRef(observation, elementRef) {
	const target = observation.elements.get(elementRef);
	if (!target) throw staleObservation();
	return target;
}
/**
* CUA Driver exposes only the primary-display label, not a stable display ID.
* Bind authorization to connection generation plus the complete live geometry.
*/
function issueFrame(state, geometry, delivered) {
	const id = `cua:v1:${createHash("sha256").update(JSON.stringify([
		state.generation,
		geometry.platform,
		geometry.display,
		geometry.screenWidth,
		geometry.screenHeight,
		geometry.scaleFactor,
		geometry.screenshotWidth,
		geometry.screenshotHeight
	])).digest("hex")}`;
	state.lastFrame = {
		id,
		nativeWidth: geometry.screenshotWidth,
		nativeHeight: geometry.screenshotHeight,
		deliveredWidth: delivered.width,
		deliveredHeight: delivered.height,
		geometry: {
			width: geometry.screenWidth,
			height: geometry.screenHeight,
			scaleFactor: geometry.scaleFactor
		}
	};
	return id;
}
function verifyFrame(state, echoedId, currentScreenSize) {
	const frame = state.lastFrame;
	if (!frame || !echoedId || echoedId !== frame.id) {
		state.lastFrame = void 0;
		throw staleFrame("the coordinate frame is missing or no longer current");
	}
	if (!(currentScreenSize.width === frame.geometry.width && currentScreenSize.height === frame.geometry.height && currentScreenSize.scaleFactor === frame.geometry.scaleFactor)) {
		state.lastFrame = void 0;
		throw staleFrame("the primary display geometry changed");
	}
	return frame;
}
function verifyReferenceWidth(state, frame, refWidth) {
	if (refWidth === frame.deliveredWidth) return;
	state.lastFrame = void 0;
	throw staleFrame("the coordinate reference width changed");
}
//#endregion
//#region extensions/cua-computer/src/driver-result.ts
const CUA_COMMON_ACTION_NAMES = [
	"screenshot",
	...COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14).filter((action) => action !== "hold_key"),
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
	"escalate_scope",
	"invoke_menu"
];
const NativeAppSchema = object({
	pid: number().int().nonnegative().nullable().optional(),
	bundle_id: string().nullable().optional(),
	name: string().min(1),
	running: boolean().nullable().optional(),
	active: boolean().optional(),
	kind: string().nullable().optional(),
	launch_path: string().nullable().optional(),
	last_used: string().nullable().optional()
});
const NativeBoundsSchema = object({
	x: number(),
	y: number(),
	width: number().nonnegative(),
	height: number().nonnegative()
});
const NativeWindowSchema = object({
	window_id: number().int().nonnegative(),
	pid: number().int().positive().nullable().optional(),
	app_name: string().optional(),
	title: string().optional(),
	bounds: NativeBoundsSchema,
	is_on_screen: boolean().optional(),
	minimized: boolean().optional(),
	z_index: number().int().nullable().optional()
});
const NativeElementSchema = object({
	element_index: number().int().nonnegative(),
	element_token: string().min(1).optional(),
	role: string().optional(),
	label: string().optional(),
	value: string().optional(),
	frame: object({
		x: number(),
		y: number(),
		w: number().nonnegative(),
		h: number().nonnegative()
	}).optional()
});
const MAX_DISCOVERY_ITEMS = 500;
const PARTIAL_EFFECT = 1;
const VALUE_READBACK_EVIDENCE = 0;
function platformActions(platform) {
	return CUA_COMMON_ACTION_NAMES.filter((action) => platform === "linux" || action !== "left_mouse_down" && action !== "left_mouse_up");
}
function boundedItems(items) {
	return {
		items: items.slice(0, MAX_DISCOVERY_ITEMS),
		truncated: Math.max(0, items.length - MAX_DISCOVERY_ITEMS)
	};
}
function driverEffect(result) {
	switch (Number(result.action?.effect)) {
		case 0: return "confirmed";
		case 1:
		case 2: return "unverifiable";
		case 3: return "suspected_noop";
		case 4: throw new Error("COMPUTER_REFUSED_action_refused: CUA Driver refused the action");
		default: return;
	}
}
function driverEscalation(result) {
	const escalation = result.action?.escalation;
	if (!escalation) return;
	const recommended = {
		0: "window-pixel",
		1: "foreground",
		2: "window-pixel",
		3: "desktop"
	}[escalation.target];
	const reasonCode = {
		0: "route_unavailable",
		1: "delivery_failed",
		2: "effect_unconfirmed",
		3: "suspected_noop",
		4: "permission_required"
	}[escalation.reason];
	if (!recommended || !reasonCode) throw new Error("COMPUTER_DRIVER_ERROR: invalid CUA Driver action escalation");
	return {
		recommended,
		reasonCode
	};
}
function driverActionDetails(result) {
	const action = result.action;
	if (!action) return;
	const details = { route: [
		"accessibility",
		"synthetic_events",
		"global_input",
		"system_api",
		"dom",
		"trusted_input"
	][action.route] };
	if (action.effect === PARTIAL_EFFECT) details.partial = true;
	if (action.delivery) {
		details.deliveryMode = [
			"background",
			"foreground",
			"not_applicable",
			"unknown"
		][action.delivery.mode];
		if (action.delivery.deliveredCount !== void 0) details.deliveredCount = action.delivery.deliveredCount;
	}
	if (action.evidence?.length) details.evidence = action.evidence.map(({ kind }) => kind === VALUE_READBACK_EVIDENCE ? "value_readback" : "window_change");
	return Object.values(details).some((value) => value !== void 0) ? details : void 0;
}
function actionEnvelope(result, details) {
	const effect = driverEffect(result);
	const escalation = driverEscalation(result);
	const driverDetails = driverActionDetails(result);
	return {
		ok: true,
		...effect ? { effect } : {},
		...escalation ? { escalation } : {},
		...driverDetails || details ? { details: {
			...driverDetails,
			...details
		} } : {}
	};
}
async function callWindowTool(driver, state, name, args, signal) {
	const result = await driver.callTool(name, args, signal);
	adoptGeneration(state, driver.generation);
	if (result.isError) {
		const code = result.errorCode ? `COMPUTER_REFUSED_${result.errorCode}` : "COMPUTER_DRIVER_ERROR";
		throw new Error(`${code}: ${result.text || `${name} failed`}`);
	}
	return result;
}
function projectedToolDetails(result, tool) {
	if (!result.structuredJson) throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned no structuredContent`);
	try {
		const value = JSON.parse(result.structuredJson);
		if (value && typeof value === "object" && !Array.isArray(value)) return value;
	} catch {}
	throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned invalid structuredContent`);
}
function nativeWindows(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const parsed = NativeWindowSchema.safeParse(entry);
		return parsed.success && parsed.data.pid ? [parsed.data] : [];
	});
}
function projectWindows(state, windows) {
	const bounded = boundedItems(windows);
	return {
		windows: bounded.items.map((window) => ({
			windowRef: issueWindowRef(state, {
				pid: window.pid,
				windowId: window.window_id
			}),
			...window.app_name ? { appName: window.app_name } : {},
			...window.title ? { title: window.title } : {},
			bounds: window.bounds,
			...window.is_on_screen !== void 0 ? { isOnScreen: window.is_on_screen } : {},
			...window.minimized !== void 0 ? { minimized: window.minimized } : {},
			...window.z_index !== void 0 ? { zIndex: window.z_index } : {}
		})),
		...bounded.truncated ? { truncatedWindows: bounded.truncated } : {}
	};
}
function projectApps(state, value) {
	const apps = (Array.isArray(value) ? value : []).flatMap((entry) => {
		const parsed = NativeAppSchema.safeParse(entry);
		if (!parsed.success) return [];
		return [{
			app: issueAppRef(state, {
				...parsed.data.pid ? { pid: parsed.data.pid } : {},
				name: parsed.data.name,
				...parsed.data.bundle_id ? { bundleId: parsed.data.bundle_id } : {},
				...parsed.data.launch_path ? { launchPath: parsed.data.launch_path } : {}
			}),
			name: parsed.data.name,
			...parsed.data.running !== void 0 ? { running: parsed.data.running } : {},
			...parsed.data.active !== void 0 ? { active: parsed.data.active } : {},
			...parsed.data.kind ? { kind: parsed.data.kind } : {},
			...parsed.data.last_used ? { lastUsed: parsed.data.last_used } : {}
		}];
	});
	const bounded = boundedItems(apps);
	return {
		apps: bounded.items,
		totalApps: apps.length,
		...bounded.truncated ? { truncatedApps: bounded.truncated } : {}
	};
}
function projectProcesses(value) {
	const processes = boundedItems(Array.isArray(value) ? value : []);
	return {
		processes: processes.items,
		...processes.truncated ? { truncatedProcesses: processes.truncated } : {}
	};
}
function windowObservation(result, state, windowRef, options = {}) {
	const structured = projectedToolDetails(result, options.fromZoom ? "zoom" : "get_window_state");
	const observation = issueObservation(state, windowRef, options);
	const snapshotId = typeof structured.snapshot_id === "string" ? structured.snapshot_id : void 0;
	const rawElements = Array.isArray(structured.elements) ? structured.elements : [];
	let omittedElementCount = 0;
	const elements = rawElements.slice(0, 2e3).flatMap((entry) => {
		const parsed = NativeElementSchema.safeParse(entry);
		if (!parsed.success || !parsed.data.frame) {
			omittedElementCount += 1;
			return [];
		}
		return [{
			elementRef: issueElementRef(observation, {
				elementIndex: parsed.data.element_index,
				...parsed.data.element_token ? { elementToken: parsed.data.element_token } : {},
				...snapshotId ? { snapshotId } : {}
			}),
			role: parsed.data.role?.trim() || "unknown",
			...parsed.data.label !== void 0 ? { label: parsed.data.label } : {},
			...parsed.data.value !== void 0 ? { value: parsed.data.value } : {},
			bounds: {
				x: parsed.data.frame.x,
				y: parsed.data.frame.y,
				width: parsed.data.frame.w,
				height: parsed.data.frame.h
			}
		}];
	});
	const image = result.images.find((entry) => entry.mimeType === "image/png");
	const base64 = image ? canonicalizeBase64(image.dataBase64) : void 0;
	if (image && !base64) throw new Error("COMPUTER_DRIVER_ERROR: CUA Driver returned malformed window PNG base64");
	const width = typeof structured.screenshot_width === "number" && structured.screenshot_width > 0 ? Math.trunc(structured.screenshot_width) : void 0;
	const height = typeof structured.screenshot_height === "number" && structured.screenshot_height > 0 ? Math.trunc(structured.screenshot_height) : void 0;
	const action = actionEnvelope(result, {
		...typeof structured.total_element_count === "number" ? { totalElementCount: structured.total_element_count } : {},
		...rawElements.length > 2e3 ? { truncatedElements: rawElements.length - 2e3 } : {},
		...omittedElementCount ? { omittedElementsWithoutBounds: omittedElementCount } : {},
		...structured.degraded === true ? { degraded: true } : {},
		...typeof structured.degraded_reason === "string" ? { degradedReason: structured.degraded_reason } : {},
		...typeof structured.screenshot_error === "string" ? { screenshotError: structured.screenshot_error } : {}
	});
	return {
		...action,
		observation: {
			kind: "window",
			...base64 ? {
				base64,
				format: "png"
			} : {},
			...width ? { width } : {},
			...height ? { height } : {},
			observationId: observation.id,
			...elements.length ? { elements } : {}
		},
		...!action.escalation && structured.escalation && typeof structured.escalation === "object" ? { escalation: {
			recommended: "window-pixel",
			reasonCode: "ax_tree_unavailable"
		} } : {}
	};
}
//#endregion
//#region extensions/cua-computer/src/mcp-driver-client.ts
const MCP_PROTOCOL_VERSION = "2025-06-18";
const MCP_STARTUP_TIMEOUT_MS = 1e4;
const MCP_REQUEST_TIMEOUT_MS = 12e4;
const MCP_SHUTDOWN_TIMEOUT_MS = 2e3;
const MAX_MCP_LINE_BYTES = 256 * 1024 * 1024;
const MAX_PENDING_REQUESTS = 64;
const ACTION_RESULT_TOOLS = /* @__PURE__ */ new Set([
	"click",
	"double_click",
	"right_click",
	"scroll",
	"drag",
	"mouse_drag",
	"parallel_mouse_drag",
	"move_cursor",
	"mouse_button_down",
	"mouse_button_up",
	"type_text",
	"type_text_chars",
	"press_key",
	"hotkey",
	"set_value",
	"set_window_frame",
	"invoke_menu",
	"browser_click",
	"browser_pointer",
	"browser_type"
]);
function driverUnavailable(message, cause) {
	return new Error(`COMPUTER_DRIVER_UNAVAILABLE: ${message}`, { cause });
}
function driverProtocolError(message, cause) {
	return new Error(`COMPUTER_DRIVER_ERROR: ${message}`, { cause });
}
function record(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function mappedEnum(value, values, label) {
	if (typeof value !== "string") throw driverProtocolError(`CUA MCP ${label} is missing`);
	const index = values.indexOf(value);
	if (index < 0) throw driverProtocolError(`CUA MCP ${label} is invalid`);
	return index;
}
function mcpActionResult(tool, structured) {
	if (!ACTION_RESULT_TOOLS.has(tool)) return;
	const value = record(structured);
	if (!value) throw driverProtocolError(`CUA MCP ${tool} returned no ActionResult`);
	const delivery = record(value.delivery);
	const escalation = record(value.escalation);
	const evidence = Array.isArray(value.evidence) ? value.evidence : void 0;
	return {
		effect: mappedEnum(value.effect, [
			"confirmed",
			"partial",
			"unverifiable",
			"suspected_noop",
			"refused"
		], "action effect"),
		route: mappedEnum(value.route, [
			"accessibility",
			"synthetic_events",
			"global_input",
			"system_api",
			"dom",
			"trusted_input"
		], "action route"),
		...delivery ? { delivery: {
			mode: mappedEnum(delivery.mode, [
				"background",
				"foreground",
				"not_applicable",
				"unknown"
			], "delivery mode"),
			...typeof delivery.delivered_count === "number" ? { deliveredCount: delivery.delivered_count } : {}
		} } : {},
		...evidence ? { evidence: evidence.map((entry) => ({ kind: mappedEnum(record(entry)?.kind, ["value_readback", "window_change"], "evidence kind") })) } : {},
		...escalation ? { escalation: {
			target: mappedEnum(escalation.target, [
				"pixel",
				"foreground",
				"page",
				"session"
			], "escalation target"),
			reason: mappedEnum(escalation.reason, [
				"route_unavailable",
				"delivery_failed",
				"effect_unconfirmed",
				"suspected_noop",
				"permission_required"
			], "escalation reason")
		} } : {}
	};
}
function normalizeMcpToolResult(tool, raw) {
	const value = record(raw);
	if (!value) throw driverProtocolError(`CUA MCP ${tool} returned a non-object result`);
	const content = Array.isArray(value.content) ? value.content : [];
	const text = content.flatMap((entry) => entry?.type === "text" && typeof entry.text === "string" ? [entry.text] : []);
	const images = content.flatMap((entry) => entry?.type === "image" && typeof entry.data === "string" && typeof entry.mimeType === "string" ? [{
		dataBase64: entry.data,
		mimeType: entry.mimeType
	}] : []);
	const structured = record(value.structuredContent);
	const errorCode = typeof structured?.code === "string" ? structured.code : typeof record(structured?.refusal)?.code === "string" ? record(structured?.refusal)?.code : void 0;
	const isError = value.isError === true;
	return {
		text: text.join("\n"),
		images,
		...structured ? { structuredJson: JSON.stringify(structured) } : {},
		isError,
		...errorCode ? { errorCode } : {},
		...!isError ? { action: mcpActionResult(tool, structured) } : {},
		degraded: structured?.degraded === true,
		rawJson: JSON.stringify(raw)
	};
}
var CuaMcpProxyClient = class {
	constructor(binaryPath, socketPath, env) {
		this.pending = /* @__PURE__ */ new Map();
		this.nextId = 0;
		this.stdout = Buffer.alloc(0);
		this.stderr = Buffer.alloc(0);
		this.available = false;
		this.stopped = false;
		const proxyEnvironment = { ...env };
		for (const key of Object.keys(proxyEnvironment)) if (key.startsWith("CUA_DRIVER_") || key === "CUA_TELEMETRY_ENABLED") delete proxyEnvironment[key];
		this.child = spawn(binaryPath, [
			"mcp",
			"--embedded",
			"--socket",
			socketPath
		], {
			env: {
				...proxyEnvironment,
				CUA_DRIVER_RS_TELEMETRY_ENABLED: "false",
				CUA_DRIVER_RS_UPDATE_CHECK: "false"
			},
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
		this.child.stdout.on("data", (chunk) => this.handleStdout(chunk));
		this.child.stderr.on("data", (chunk) => {
			this.stderr = Buffer.concat([this.stderr, chunk]).subarray(-32768);
		});
		this.child.once("error", (error) => this.fail(driverUnavailable("failed to start CUA MCP proxy", error)));
		this.child.once("exit", (code, signal) => {
			if (!this.stopped) {
				const detail = this.stderr.toString("utf8").trim();
				this.fail(driverUnavailable(`CUA MCP proxy exited (${signal ?? code ?? "unknown"})${detail ? `: ${detail}` : ""}`));
			}
		});
		this.ready = this.initialize();
		this.ready.catch(() => {});
	}
	isAvailable() {
		return this.available && !this.failure && !this.stopped;
	}
	async callTool(name, args, signal) {
		await this.ready;
		return normalizeMcpToolResult(name, await this.request("tools/call", {
			name,
			arguments: args
		}, MCP_REQUEST_TIMEOUT_MS, signal));
	}
	async stop() {
		if (this.stopped) return;
		this.stopped = true;
		this.available = false;
		this.rejectPending(driverUnavailable("CUA MCP proxy is stopping"));
		this.child.stdin.end();
		if (await this.waitForExit(MCP_SHUTDOWN_TIMEOUT_MS)) return;
		this.child.kill("SIGTERM");
		if (await this.waitForExit(MCP_SHUTDOWN_TIMEOUT_MS)) return;
		this.child.kill("SIGKILL");
	}
	async initialize() {
		if (record(await this.request("initialize", {
			protocolVersion: MCP_PROTOCOL_VERSION,
			capabilities: {},
			clientInfo: {
				name: "openclaw-cua-computer",
				version: "1"
			}
		}, MCP_STARTUP_TIMEOUT_MS))?.protocolVersion !== MCP_PROTOCOL_VERSION) throw driverProtocolError("CUA MCP proxy returned an incompatible protocol version");
		this.notify("notifications/initialized", {});
		this.available = true;
	}
	request(method, params, timeoutMs, signal) {
		if (this.failure) return Promise.reject(this.failure);
		if (this.stopped) return Promise.reject(driverUnavailable("CUA MCP proxy is stopping"));
		if (signal?.aborted) return Promise.reject(driverUnavailable("CUA MCP request was cancelled", signal.reason));
		if (this.pending.size >= MAX_PENDING_REQUESTS) return Promise.reject(driverUnavailable("CUA MCP proxy has too many pending requests"));
		const id = ++this.nextId;
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.fail(driverUnavailable(`CUA MCP ${method} timed out after ${timeoutMs}ms`));
			}, timeoutMs);
			timer.unref?.();
			const pending = {
				resolve,
				reject,
				timer,
				signal
			};
			if (signal) {
				pending.onAbort = () => this.fail(driverUnavailable("CUA MCP request was cancelled", signal.reason));
				signal.addEventListener("abort", pending.onAbort, { once: true });
			}
			this.pending.set(id, pending);
			this.write({
				jsonrpc: "2.0",
				id,
				method,
				params
			});
		});
	}
	notify(method, params) {
		this.write({
			jsonrpc: "2.0",
			method,
			params
		});
	}
	write(value) {
		this.child.stdin.write(`${JSON.stringify(value)}\n`, (error) => {
			if (error) this.fail(driverUnavailable("failed writing to CUA MCP proxy", error));
		});
	}
	handleStdout(chunk) {
		if (this.failure || this.stopped) return;
		this.stdout = Buffer.concat([this.stdout, chunk]);
		if (this.stdout.length > MAX_MCP_LINE_BYTES) {
			this.fail(driverProtocolError("CUA MCP response exceeded the line-size limit"));
			return;
		}
		while (true) {
			const newline = this.stdout.indexOf(10);
			if (newline < 0) return;
			const line = this.stdout.subarray(0, newline);
			this.stdout = this.stdout.subarray(newline + 1);
			if (line.length === 0) continue;
			let response;
			try {
				response = JSON.parse(line.toString("utf8"));
			} catch (error) {
				this.fail(driverProtocolError("CUA MCP proxy returned invalid JSON", error));
				return;
			}
			if (response.jsonrpc !== "2.0") {
				this.fail(driverProtocolError("CUA MCP proxy returned an invalid JSON-RPC version"));
				return;
			}
			if (typeof response.id !== "number" || !Number.isSafeInteger(response.id)) {
				this.fail(driverProtocolError("CUA MCP proxy returned an invalid response id"));
				return;
			}
			const pending = this.pending.get(response.id);
			if (!pending) continue;
			this.pending.delete(response.id);
			this.clearPending(pending);
			if (response.error) {
				const message = typeof response.error.message === "string" ? response.error.message : "unknown JSON-RPC error";
				pending.reject(driverProtocolError(`CUA MCP request failed: ${message}`));
			} else pending.resolve(response.result);
		}
	}
	fail(error) {
		if (this.failure || this.stopped) return;
		this.failure = error;
		this.available = false;
		this.rejectPending(error);
		this.child.kill("SIGTERM");
	}
	rejectPending(error) {
		for (const pending of this.pending.values()) {
			this.clearPending(pending);
			pending.reject(error);
		}
		this.pending.clear();
	}
	clearPending(pending) {
		clearTimeout(pending.timer);
		if (pending.signal && pending.onAbort) pending.signal.removeEventListener("abort", pending.onAbort);
	}
	async waitForExit(timeoutMs) {
		if (this.child.exitCode !== null || this.child.signalCode !== null) return true;
		return await new Promise((resolve) => {
			const onExit = () => {
				clearTimeout(timer);
				resolve(true);
			};
			const timer = setTimeout(() => {
				this.child.removeListener("exit", onExit);
				resolve(false);
			}, timeoutMs);
			timer.unref?.();
			this.child.once("exit", onExit);
		});
	}
};
function sessionState(value) {
	if (value.isError || !value.structuredJson) throw driverProtocolError(value.text || "CUA MCP session operation failed");
	let structured;
	try {
		structured = record(JSON.parse(value.structuredJson));
	} catch (error) {
		throw driverProtocolError("CUA MCP session operation returned invalid JSON", error);
	}
	if (!structured) throw driverProtocolError("CUA MCP session operation returned invalid state");
	return {
		session: typeof structured.session === "string" ? structured.session : "",
		captureScope: mappedEnum(structured.capture_scope, [
			"auto",
			"window",
			"desktop"
		], "capture scope"),
		effectiveScope: mappedEnum(structured.effective_scope, ["window", "desktop"], "effective scope"),
		desktopUnlocked: structured.desktop_unlocked === true,
		...typeof structured.escalation_reason === "string" ? { escalationReason: mappedEnum(structured.escalation_reason, [
			"ax_tree_pixel_mismatch",
			"background_delivery_failed",
			"foreground_ineffective",
			"no_window_target",
			"other"
		], "escalation reason") } : {},
		...typeof structured.escalation_detail === "string" ? { escalationDetail: structured.escalation_detail } : {}
	};
}
var McpCuaDriverSession = class {
	constructor(client) {
		this.client = client;
		this.generation = randomUUID();
		this.publicSession = `openclaw-${randomUUID()}`;
		this.started = false;
		this.disposed = false;
	}
	isAvailable() {
		return !this.disposed && this.client.isAvailable();
	}
	resetAvailabilityCache() {}
	async callTool(name, args, signal) {
		await this.ensureStarted("window", signal);
		return await this.client.callTool(name, {
			...args,
			session: this.publicSession
		}, signal);
	}
	async escalateScope(reason, signal) {
		await this.ensureStarted("window", signal);
		const result = await this.client.callTool("escalate_session", {
			session: this.publicSession,
			reason: [
				"ax_tree_pixel_mismatch",
				"background_delivery_failed",
				"foreground_ineffective",
				"no_window_target",
				"other"
			][reason]
		}, signal);
		this.captureScope = "desktop";
		return sessionState(result);
	}
	async getDesktopState(signal) {
		return await this.desktopTool("get_desktop_state", {}, signal);
	}
	async getScreenSize(signal) {
		return await this.desktopTool("get_screen_size", {}, signal);
	}
	async click(input, signal) {
		return await this.desktopTool("click", {
			x: input.x,
			y: input.y,
			button: [
				"left",
				"right",
				"middle"
			][input.button],
			count: input.count,
			scope: "desktop"
		}, signal);
	}
	async drag(input, signal) {
		return await this.desktopTool("drag", {
			from_x: input.fromX,
			from_y: input.fromY,
			to_x: input.toX,
			to_y: input.toY,
			...input.durationMs === void 0 ? {} : { duration_ms: Number(input.durationMs) },
			scope: "desktop"
		}, signal);
	}
	async moveCursor(input, signal) {
		return await this.desktopTool("move_cursor", {
			x: input.x,
			y: input.y,
			scope: "desktop"
		}, signal);
	}
	async scroll(input, signal) {
		return await this.desktopTool("scroll", {
			x: input.x,
			y: input.y,
			direction: [
				"up",
				"down",
				"left",
				"right"
			][input.direction],
			by: "line",
			amount: Number(input.amount),
			scope: "desktop"
		}, signal);
	}
	async typeText(text, signal) {
		return await this.desktopTool("type_text", {
			text,
			scope: "desktop"
		}, signal);
	}
	async pressKey(input, signal) {
		return await this.desktopTool("press_key", {
			key: input.key,
			modifiers: input.modifiers,
			scope: "desktop"
		}, signal);
	}
	async dispose() {
		if (this.disposed) return;
		this.disposed = true;
		let failure;
		try {
			await this.startPromise;
			if (this.started && this.client.isAvailable()) await this.client.callTool("end_session", { session: this.publicSession });
		} catch (error) {
			failure = error;
		}
		try {
			await this.client.stop();
		} catch (error) {
			failure ??= error;
		}
		if (failure) throw failure instanceof Error ? failure : driverUnavailable("CUA MCP cleanup failed", failure);
	}
	async desktopTool(name, args, signal) {
		await this.ensureStarted("desktop", signal);
		return await this.client.callTool(name, {
			...args,
			session: this.publicSession
		}, signal);
	}
	async ensureStarted(scope, signal) {
		if (this.disposed) throw driverUnavailable("cua-computer is stopping");
		if (!this.startPromise) {
			this.captureScope = scope;
			const start = this.client.callTool("start_session", {
				session: this.publicSession,
				capture_scope: scope
			}, signal).then((result) => {
				if (result.isError) throw driverProtocolError(result.text || "CUA MCP start_session failed");
				this.started = true;
			});
			this.startPromise = start;
			try {
				await start;
			} catch (error) {
				if (this.startPromise === start) this.startPromise = void 0;
				throw error;
			}
			return;
		}
		await this.startPromise;
		if (scope === "desktop" && this.captureScope !== "desktop") await this.escalateScope(EscalationReason.Other, signal);
	}
};
function createCuaMcpDriver(options) {
	return new McpCuaDriverSession(new CuaMcpProxyClient(options.binaryPath, options.socketPath, options.env ?? process.env));
}
//#endregion
//#region extensions/cua-computer/src/v2-actions.ts
const CUA_WIRE_ACTION_NAMES$1 = COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14);
const CUA_TARGETED_ACTION_NAMES = /* @__PURE__ */ new Set([
	"left_click",
	"right_click",
	"middle_click",
	"double_click",
	"triple_click",
	"left_click_drag",
	"left_mouse_down",
	"left_mouse_up",
	"scroll",
	"type",
	"key"
]);
function requireWindowTarget(driver, state, params) {
	verifyGeneration(state, driver.generation);
	if (!params.windowRef) throw new Error(`COMPUTER_INVALID_REQUEST: windowRef is required for ${params.action}`);
	return {
		ref: params.windowRef,
		target: resolveWindowRef(state, params.windowRef)
	};
}
function observationTarget(state, params, windowRef) {
	if (!params.observationId) throw new Error(`COMPUTER_STALE_OBSERVATION: observationId is required for ${params.action}`);
	return resolveObservation(state, params.observationId, windowRef);
}
function elementArgs(state, params, windowRef) {
	if (!params.elementRef) return;
	const element = resolveElementRef(observationTarget(state, params, windowRef), params.elementRef);
	return element.elementToken ? { element_token: element.elementToken } : {
		element_index: element.elementIndex,
		...element.snapshotId ? { snapshot_id: element.snapshotId } : {}
	};
}
function windowPointArgs(state, params, windowRef, point, label) {
	if (point.x === void 0 || point.y === void 0) throw new Error(`COMPUTER_INVALID_REQUEST: ${label} coordinates are required`);
	const observation = observationTarget(state, params, windowRef);
	return {
		x: point.x,
		y: point.y,
		...observation.fromZoom ? { from_zoom: true } : {}
	};
}
async function handleTargetedAct(platform, driver, state, params, signal) {
	const { ref: windowRef, target } = requireWindowTarget(driver, state, params);
	const base = {
		pid: target.pid,
		window_id: target.windowId
	};
	const delivery = params.deliveryMode ? { delivery_mode: params.deliveryMode } : {};
	const element = elementArgs(state, params, windowRef);
	let tool;
	let args;
	switch (params.action) {
		case "left_click":
		case "right_click":
		case "middle_click":
		case "double_click":
		case "triple_click": {
			tool = "click";
			const button = params.action === "right_click" ? "right" : params.action === "middle_click" ? "middle" : "left";
			const count = params.action === "double_click" ? 2 : params.action === "triple_click" ? 3 : 1;
			const modifiers = normalizeModifiers(params.modifiers);
			args = {
				...base,
				...element ?? windowPointArgs(state, params, windowRef, params, "click"),
				button,
				count,
				...modifiers.length ? { modifier: modifiers } : {},
				...delivery
			};
			break;
		}
		case "left_click_drag": {
			if (element) throw new Error("COMPUTER_UNSUPPORTED_ACTION: cua-driver drag has no element target");
			tool = "drag";
			const from = windowPointArgs(state, params, windowRef, {
				x: params.fromX,
				y: params.fromY
			}, "drag start");
			const to = windowPointArgs(state, params, windowRef, params, "drag end");
			const modifiers = normalizeModifiers(params.modifiers);
			args = {
				...base,
				from_x: from.x,
				from_y: from.y,
				to_x: to.x,
				to_y: to.y,
				...from.from_zoom || to.from_zoom ? { from_zoom: true } : {},
				...params.durationMs === void 0 ? {} : { duration_ms: Math.min(1e4, params.durationMs) },
				...modifiers.length ? { modifier: modifiers } : {},
				...delivery
			};
			break;
		}
		case "left_mouse_down":
			if (platform !== "linux") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_down is Linux-only");
			if (element || params.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_down supports only background window pixels");
			tool = "mouse_button_down";
			args = {
				...base,
				...windowPointArgs(state, params, windowRef, params, "mouse down"),
				button: "left"
			};
			break;
		case "left_mouse_up":
			if (platform !== "linux") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_up is Linux-only");
			if (element || params.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_up supports only background window pixels");
			tool = "mouse_button_up";
			args = {
				...base,
				...params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "mouse up") : {}
			};
			break;
		case "scroll":
			if (!params.scrollDirection) throw new Error("COMPUTER_INVALID_REQUEST: scrollDirection is required for scroll");
			if (normalizeModifiers(params.modifiers).length) throw new Error("COMPUTER_UNSUPPORTED_ACTION: modifier-held scroll is unsupported by cua-driver");
			tool = "scroll";
			args = {
				...base,
				...element ?? (params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "scroll") : {}),
				direction: params.scrollDirection,
				by: "line",
				amount: Math.min(50, params.scrollAmount ?? 3),
				...delivery
			};
			break;
		case "type":
			if (!params.text) throw new Error("COMPUTER_INVALID_REQUEST: text is required for type");
			tool = "type_text";
			args = {
				...base,
				...element ?? (params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "type") : {}),
				text: params.text,
				...delivery
			};
			break;
		case "key": {
			const chord = parseKeyChord(params.keys);
			tool = "press_key";
			args = {
				...base,
				...element ?? (params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "key") : {}),
				key: chord.key,
				modifiers: chord.modifiers,
				...delivery
			};
			break;
		}
		default: throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${params.action}`);
	}
	const result = await callWindowTool(driver, state, tool, args, signal);
	return JSON.stringify(actionEnvelope(result));
}
async function handleV2Act(platform, driver, state, params, handleDesktop, signal) {
	const input = params;
	if (CUA_TARGETED_ACTION_NAMES.has(input.action) && (input.windowRef || input.elementRef)) return await handleTargetedAct(platform, driver, state, input, signal);
	if (CUA_WIRE_ACTION_NAMES$1.includes(input.action)) return await handleDesktop(driver, state, params, signal);
	switch (input.action) {
		case "list_apps": {
			const result = await callWindowTool(driver, state, "list_apps", {}, signal);
			state.apps = /* @__PURE__ */ new Map();
			const structured = projectedToolDetails(result, "list_apps");
			return JSON.stringify({
				ok: true,
				details: projectApps(state, structured.apps)
			});
		}
		case "list_windows": {
			const structured = projectedToolDetails(await callWindowTool(driver, state, "list_windows", {}, signal), "list_windows");
			return JSON.stringify({
				ok: true,
				details: projectWindows(state, nativeWindows(structured.windows))
			});
		}
		case "get_accessibility_tree": {
			if (input.windowRef || input.query || input.depth !== void 0 || input.maxElements) throw new Error("COMPUTER_UNSUPPORTED_ACTION: CUA Driver 0.19.3 exposes get_accessibility_tree only as unfiltered desktop discovery; use get_window_state for a window tree");
			const structured = projectedToolDetails(await callWindowTool(driver, state, "get_accessibility_tree", {}, signal), "get_accessibility_tree");
			return JSON.stringify({
				ok: true,
				details: {
					...projectWindows(state, nativeWindows(structured.windows)),
					...projectProcesses(structured.processes)
				}
			});
		}
		case "get_cursor_position": {
			const result = await callWindowTool(driver, state, "get_cursor_position", {}, signal);
			return JSON.stringify({
				ok: true,
				details: projectedToolDetails(result, "get_cursor_position")
			});
		}
		case "get_window_state": {
			verifyGeneration(state, driver.generation);
			const window = resolveWindowRef(state, input.windowRef);
			const result = await callWindowTool(driver, state, "get_window_state", {
				pid: window.pid,
				window_id: window.windowId,
				include_screenshot: true,
				max_elements: input.maxElements ?? 2e3,
				...input.depth !== void 0 ? { max_depth: Math.max(1, input.depth) } : {},
				...input.query ? { query: input.query } : {}
			}, signal);
			return JSON.stringify(windowObservation(result, state, input.windowRef));
		}
		case "launch_app": {
			verifyGeneration(state, driver.generation);
			const appName = input.app;
			const app = resolveAppRef(state, appName);
			if (appName.startsWith("cua:v2:app:") && !app) throw new Error("COMPUTER_STALE_OBSERVATION: refresh list_apps and retry");
			const result = await callWindowTool(driver, state, "launch_app", app ? app.launchPath ? { launch_path: app.launchPath } : app.bundleId ? { bundle_id: app.bundleId } : { name: app.name } : { name: appName }, signal);
			const structured = projectedToolDetails(result, "launch_app");
			return JSON.stringify({
				...actionEnvelope(result),
				details: {
					app: projectApps(state, [structured]).apps,
					...projectWindows(state, nativeWindows(structured.windows))
				}
			});
		}
		case "kill_app": {
			verifyGeneration(state, driver.generation);
			const appName = input.app;
			const app = resolveAppRef(state, appName);
			if (!app?.pid) throw new Error("COMPUTER_INVALID_REQUEST: kill_app requires a running app reference from list_apps");
			const result = await callWindowTool(driver, state, "kill_app", { pid: app.pid }, signal);
			return JSON.stringify(actionEnvelope(result, { app: appName }));
		}
		case "bring_to_front": {
			const { target } = requireWindowTarget(driver, state, input);
			const result = await callWindowTool(driver, state, "bring_to_front", {
				pid: target.pid,
				window_id: target.windowId
			}, signal);
			return JSON.stringify(actionEnvelope(result));
		}
		case "set_value": {
			const { ref, target } = requireWindowTarget(driver, state, input);
			if (input.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: cua-driver set_value is background accessibility delivery");
			const element = elementArgs(state, input, ref);
			if (!element) throw new Error("COMPUTER_INVALID_REQUEST: elementRef is required for set_value");
			const result = await callWindowTool(driver, state, "set_value", {
				pid: target.pid,
				window_id: target.windowId,
				...element,
				value: input.value
			}, signal);
			return JSON.stringify(actionEnvelope(result));
		}
		case "invoke_menu": {
			const { target } = requireWindowTarget(driver, state, input);
			if (input.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: cua-driver invoke_menu is background accessibility delivery");
			const result = await callWindowTool(driver, state, "invoke_menu", {
				pid: target.pid,
				window_id: target.windowId,
				path: input.path
			}, signal);
			return JSON.stringify(actionEnvelope(result));
		}
		case "zoom": {
			const { ref, target } = requireWindowTarget(driver, state, input);
			resolveObservation(state, input.observationId, ref);
			const result = await callWindowTool(driver, state, "zoom", {
				pid: target.pid,
				window_id: target.windowId,
				x1: input.x1,
				y1: input.y1,
				x2: input.x2,
				y2: input.y2
			}, signal);
			return JSON.stringify(windowObservation(result, state, ref, { fromZoom: true }));
		}
		case "escalate_scope": {
			const reason = {
				ax_tree_pixel_mismatch: EscalationReason.AxTreePixelMismatch,
				background_delivery_failed: EscalationReason.BackgroundDeliveryFailed,
				foreground_ineffective: EscalationReason.ForegroundIneffective,
				no_window_target: EscalationReason.NoWindowTarget,
				other: EscalationReason.Other
			}[input.reason];
			const result = await driver.escalateScope(reason, signal);
			adoptGeneration(state, driver.generation);
			return JSON.stringify({
				ok: true,
				details: {
					captureScope: result.captureScope,
					effectiveScope: result.effectiveScope,
					desktopUnlocked: result.desktopUnlocked
				}
			});
		}
		default: throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${input.action}`);
	}
}
//#endregion
//#region extensions/cua-computer/src/commands.ts
const AVAILABILITY_POLL_MS = 5e3;
const CUA_WIRE_ACTION_NAMES = COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14);
const MAX_IMAGE_PIXELS = 4e7;
const CUA_DRIVER_ENDPOINT_ENV = "OPENCLAW_CUA_DRIVER_ENDPOINT";
const CuaDriverEndpointSchema = strictObject({
	v: literal(1),
	socketPath: string(),
	binaryPath: string()
});
const DesktopStateSchema = object({
	platform: string().min(1),
	display: string().min(1),
	screenshot_width: number().int().positive(),
	screenshot_height: number().int().positive(),
	screen_width: number().int().positive(),
	screen_height: number().int().positive(),
	scale_factor: number().positive()
});
const ScreenSizeSchema = object({
	width: number().int().positive(),
	height: number().int().positive(),
	scale_factor: number().positive()
});
function resolveMacOsMcpEndpoint(env) {
	const rawEndpoint = env[CUA_DRIVER_ENDPOINT_ENV];
	if (!rawEndpoint || Buffer.byteLength(rawEndpoint, "utf8") > 4 * 1024) return;
	try {
		const rawValue = JSON.parse(rawEndpoint);
		const parsed = CuaDriverEndpointSchema.safeParse(rawValue);
		if (!parsed.success) return;
		const { socketPath, binaryPath } = parsed.data;
		if (socketPath.includes("\0") || binaryPath.includes("\0") || !path.isAbsolute(socketPath) || !path.isAbsolute(binaryPath)) return;
		fs.accessSync(binaryPath, fs.constants.X_OK);
		return {
			socketPath,
			binaryPath
		};
	} catch {
		return;
	}
}
var PromiseQueue = class {
	constructor() {
		this.tail = Promise.resolve();
	}
	async run(operation) {
		const previous = this.tail;
		let release = () => {};
		this.tail = new Promise((resolve) => {
			release = resolve;
		});
		await previous;
		try {
			return await operation();
		} finally {
			release();
		}
	}
};
function assertPrimaryDisplay(screenIndex) {
	if (screenIndex !== void 0 && screenIndex !== 0) throw new Error("COMPUTER_UNSUPPORTED_DISPLAY: cua-driver controls only the primary display (screenIndex 0)");
}
function assertToolSuccess(result, tool) {
	if (result.isError) {
		const code = result.errorCode ? `COMPUTER_REFUSED_${result.errorCode}` : "COMPUTER_DRIVER_ERROR";
		throw new Error(`${code}: ${result.text || `${tool} failed`}`);
	}
	return result;
}
function structuredContent(result, tool) {
	assertToolSuccess(result, tool);
	if (!result.structuredJson) throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned no structuredContent`);
	try {
		const value = JSON.parse(result.structuredJson);
		if (value && typeof value === "object" && !Array.isArray(value)) return value;
	} catch {}
	throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned invalid structuredContent`);
}
function desktopGeometry(result) {
	const parsed = DesktopStateSchema.safeParse(structuredContent(result, "get_desktop_state"));
	if (!parsed.success) throw new Error("COMPUTER_DRIVER_ERROR: invalid get_desktop_state geometry");
	return {
		platform: parsed.data.platform,
		display: parsed.data.display,
		screenWidth: parsed.data.screen_width,
		screenHeight: parsed.data.screen_height,
		scaleFactor: parsed.data.scale_factor,
		screenshotWidth: parsed.data.screenshot_width,
		screenshotHeight: parsed.data.screenshot_height
	};
}
function desktopPng(result) {
	const image = result.images.find((entry) => entry.mimeType === "image/png");
	if (!image) throw new Error("COMPUTER_DRIVER_ERROR: get_desktop_state returned no PNG image");
	const canonicalPng = canonicalizeBase64(image.dataBase64);
	if (!canonicalPng) throw new Error("COMPUTER_DRIVER_ERROR: get_desktop_state returned malformed PNG base64");
	return Buffer.from(canonicalPng, "base64");
}
function screenSize(result) {
	const parsed = ScreenSizeSchema.safeParse(structuredContent(result, "get_screen_size"));
	if (!parsed.success) throw new Error("COMPUTER_DRIVER_ERROR: invalid get_screen_size geometry");
	return {
		width: parsed.data.width,
		height: parsed.data.height,
		scaleFactor: parsed.data.scale_factor
	};
}
function resolveImageCommand(command, env) {
	const names = process.platform === "win32" && !path.extname(command) ? [
		command,
		`${command}.exe`,
		`${command}.cmd`
	] : [command];
	for (const entry of (env.PATH ?? "").split(path.delimiter).filter(Boolean)) for (const name of names) {
		const candidate = path.resolve(entry, name);
		try {
			fs.accessSync(candidate, fs.constants.X_OK);
			return candidate;
		} catch {}
	}
	return null;
}
function createImageProcessor(env) {
	return createRastermill({
		execution: "auto",
		limits: {
			inputPixels: MAX_IMAGE_PIXELS,
			outputPixels: MAX_IMAGE_PIXELS
		},
		temp: {
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "openclaw-cua-computer-"
		},
		commandResolver: (command) => resolveImageCommand(command, env)
	});
}
function clickArgs(frame, params, button, count) {
	const point = scalePoint(frame, params.x, params.y, params.action);
	if (normalizeModifiers(params.modifiers).length > 0) throw new Error("COMPUTER_UNSUPPORTED_ACTION: modifier-held desktop clicks are unsupported by cua-driver");
	return {
		...point,
		button,
		count
	};
}
async function currentFrame(driver, frameState, params, signal) {
	const current = screenSize(await driver.getScreenSize(signal));
	if (driver.generation !== frameState.generation) {
		frameState.lastFrame = void 0;
		throw new Error("COMPUTER_STALE_FRAME: the computer driver reconnected; take a new screenshot");
	}
	const frame = verifyFrame(frameState, params.displayFrameId, current);
	verifyReferenceWidth(frameState, frame, params.refWidth);
	return frame;
}
async function handleDesktopAct(driver, frameState, params, signal) {
	if (!CUA_WIRE_ACTION_NAMES.includes(params.action)) throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${params.action}`);
	const v1Params = params;
	assertPrimaryDisplay(v1Params.screenIndex);
	if (v1Params.action === "hold_key" || v1Params.action === "left_mouse_down" || v1Params.action === "left_mouse_up") throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${v1Params.action}`);
	switch (v1Params.action) {
		case "type":
			if (!v1Params.text) throw new Error("COMPUTER_INVALID_REQUEST: text is required for type");
			assertToolSuccess(await driver.typeText(v1Params.text, signal), "type_text");
			break;
		case "key": {
			const chord = parseKeyChord(v1Params.keys);
			assertToolSuccess(await driver.pressKey({
				key: chord.key,
				modifiers: chord.modifiers
			}, signal), "press_key");
			break;
		}
		case "scroll": {
			if (!v1Params.scrollDirection) throw new Error("COMPUTER_INVALID_REQUEST: scrollDirection is required for scroll");
			if (normalizeModifiers(v1Params.modifiers).length > 0) throw new Error("COMPUTER_UNSUPPORTED_ACTION: modifier-held scroll is unsupported by cua-driver");
			const point = scalePoint(await currentFrame(driver, frameState, v1Params, signal), v1Params.x, v1Params.y, v1Params.action);
			const direction = {
				up: ScrollDirection.Up,
				down: ScrollDirection.Down,
				left: ScrollDirection.Left,
				right: ScrollDirection.Right
			}[v1Params.scrollDirection];
			assertToolSuccess(await driver.scroll({
				direction,
				amount: BigInt(Math.min(50, v1Params.scrollAmount ?? 3)),
				...point
			}, signal), "scroll");
			break;
		}
		default: {
			const frame = await currentFrame(driver, frameState, v1Params, signal);
			switch (v1Params.action) {
				case "left_click":
					assertToolSuccess(await driver.click(clickArgs(frame, v1Params, ClickButton.Left, 1), signal), "click");
					break;
				case "right_click":
					assertToolSuccess(await driver.click(clickArgs(frame, v1Params, ClickButton.Right, 1), signal), "click");
					break;
				case "middle_click":
					assertToolSuccess(await driver.click(clickArgs(frame, v1Params, ClickButton.Middle, 1), signal), "click");
					break;
				case "double_click":
					assertToolSuccess(await driver.click(clickArgs(frame, v1Params, ClickButton.Left, 2), signal), "click");
					break;
				case "triple_click":
					assertToolSuccess(await driver.click(clickArgs(frame, v1Params, ClickButton.Left, 3), signal), "click");
					break;
				case "mouse_move": {
					const point = scalePoint(frame, v1Params.x, v1Params.y, v1Params.action);
					assertToolSuccess(await driver.moveCursor(point, signal), "move_cursor");
					break;
				}
				case "left_click_drag": {
					const from = scalePoint(frame, v1Params.fromX, v1Params.fromY, "drag start");
					const to = scalePoint(frame, v1Params.x, v1Params.y, "drag end");
					if (normalizeModifiers(v1Params.modifiers).length > 0) throw new Error("COMPUTER_UNSUPPORTED_ACTION: modifier-held drag is unsupported by cua-driver");
					assertToolSuccess(await driver.drag({
						fromX: from.x,
						fromY: from.y,
						toX: to.x,
						toY: to.y,
						...v1Params.durationMs === void 0 ? {} : { durationMs: BigInt(Math.min(1e4, v1Params.durationMs)) }
					}, signal), "drag");
					break;
				}
				default: throw new Error("COMPUTER_UNSUPPORTED_ACTION: unknown action");
			}
		}
	}
	return JSON.stringify({ ok: true });
}
function createCuaComputerProvider(options = {}) {
	const platform = options.platform ?? process.platform;
	const env = options.env ?? process.env;
	const macOsEndpoint = platform === "darwin" ? resolveMacOsMcpEndpoint(env) : void 0;
	let ownedDriver;
	let stopped = false;
	const driver = () => {
		if (stopped) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: cua-computer is stopping");
		return options.driver ?? (ownedDriver ??= (options.createDriver ?? (macOsEndpoint ? () => createCuaMcpDriver({
			...macOsEndpoint,
			env
		}) : createCuaDriver))());
	};
	const disposeOwnedDriver = async () => {
		stopped = true;
		const current = ownedDriver;
		ownedDriver = void 0;
		await current?.dispose();
	};
	const imageProcessor = options.imageProcessor ?? createImageProcessor(env);
	const interval = options.setInterval ?? setInterval;
	const clear = options.clearInterval ?? clearInterval;
	const isSupportedPlatform = platform === "linux" || platform === "win32" || macOsEndpoint !== void 0;
	const isAvailable = () => macOsEndpoint !== void 0 || isSupportedPlatform && driver().isAvailable();
	return {
		id: "cua-computer",
		label: "CUA Computer",
		capabilities: () => ({
			contractVersion: 2,
			provider: {
				id: "cua-computer",
				label: "CUA Computer",
				generation: isSupportedPlatform ? `cua-computer-v2:${driver().generation}` : "cua-computer-v2:unsupported"
			},
			actions: platformActions(platform),
			targets: [
				"screen",
				"window",
				"element"
			],
			deliveryModes: ["background", "foreground"],
			observations: ["image", "accessibility"],
			features: {
				recording: false,
				agentCursor: false,
				multiDisplay: false
			}
		}),
		isAvailable,
		watchAvailability: (_context, onChange) => {
			let knownAvailable = isAvailable();
			const timer = interval(() => {
				driver().resetAvailabilityCache();
				const available = isAvailable();
				if (available !== knownAvailable) {
					knownAvailable = available;
					onChange();
				}
			}, AVAILABILITY_POLL_MS);
			timer.unref?.();
			return () => {
				clear(timer);
				disposeOwnedDriver();
			};
		},
		openExecution: async () => {
			const queue = new PromiseQueue();
			const frameState = { generation: driver().generation };
			return {
				snapshot: async (paramsJSON, signal) => await queue.run(async () => {
					if (!isSupportedPlatform) throw new Error(platform === "darwin" ? `COMPUTER_DRIVER_UNAVAILABLE: cua-computer requires app-provided ${CUA_DRIVER_ENDPOINT_ENV}` : "COMPUTER_DRIVER_UNAVAILABLE: cua-computer supports macOS, Windows, and Linux");
					const params = parseScreenSnapshotParamsJSON(paramsJSON);
					assertPrimaryDisplay(params.screenIndex);
					const format = params.format ?? "jpeg";
					const maxWidth = params.maxWidth ?? (format === "png" ? 900 : 1600);
					const quality = Math.min(1, Math.max(.05, params.quality ?? .72));
					const desktop = await driver().getDesktopState(signal);
					const geometry = desktopGeometry(desktop);
					if (platform !== "darwin" && (geometry.screenWidth !== geometry.screenshotWidth || geometry.screenHeight !== geometry.screenshotHeight)) throw new Error("COMPUTER_UNSUPPORTED_DISPLAY: cua-driver reported capture and screen geometry in different pixel spaces");
					const nativePng = desktopPng(desktop);
					let encoded = nativePng;
					let width = geometry.screenshotWidth;
					let height = geometry.screenshotHeight;
					if (format === "jpeg" || width > maxWidth) {
						const result = await imageProcessor.encode(nativePng, {
							format,
							...format === "jpeg" ? { quality: Math.round(quality * 100) } : {},
							...width > maxWidth ? { resize: {
								width: maxWidth,
								enlarge: false
							} } : {}
						});
						encoded = result.data;
						width = result.width;
						height = result.height;
					}
					adoptGeneration(frameState, driver().generation);
					const displayFrameId = issueFrame(frameState, geometry, {
						width,
						height
					});
					return JSON.stringify({
						format,
						base64: encoded.toString("base64"),
						displayFrameId,
						screenIndex: 0,
						width,
						height
					});
				}),
				act: async (paramsJSON, signal) => await queue.run(async () => {
					if (!isSupportedPlatform) throw new Error(platform === "darwin" ? `COMPUTER_DRIVER_UNAVAILABLE: cua-computer requires app-provided ${CUA_DRIVER_ENDPOINT_ENV}` : "COMPUTER_DRIVER_UNAVAILABLE: cua-computer supports macOS, Windows, and Linux");
					return await handleV2Act(platform, driver(), frameState, parseComputerActParamsJSON(paramsJSON), handleDesktopAct, signal);
				}),
				close: async () => await disposeOwnedDriver()
			};
		}
	};
}
//#endregion
//#region extensions/cua-computer/index.ts
const CuaComputerConfigSchema = strictObject({ driverPath: string().optional() });
var cua_computer_default = definePluginEntry({
	id: "cua-computer",
	name: "CUA Computer",
	description: "Experimental CUA Driver computer control for macOS, Windows, and Linux node hosts.",
	configSchema: buildPluginConfigSchema(CuaComputerConfigSchema),
	register(api) {
		const parsed = CuaComputerConfigSchema.safeParse(api.pluginConfig ?? {});
		if (!parsed.success) throw new Error(`Invalid cua-computer plugin config: ${parsed.error.issues[0]?.message ?? "invalid config"}`);
		registerComputerUseProvider(api, createCuaComputerProvider());
		api.registerNodeInvokePolicy({
			commands: ["computer.act"],
			dangerous: true,
			handle: async (context) => await context.invokeNode()
		});
	}
});
//#endregion
export { cua_computer_default as default };
