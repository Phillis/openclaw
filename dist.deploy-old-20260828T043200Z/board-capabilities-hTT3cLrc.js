import "./src-4dv5TpeQ.js";
import { o as normalizeSandboxHostCsp } from "./sandbox-host-B8_dlG6f.js";
//#region src/boards/board-layout.ts
const BOARD_SIZE_PRESETS = {
	sm: {
		sizeW: 3,
		sizeH: 3
	},
	md: {
		sizeW: 6,
		sizeH: 4
	},
	lg: {
		sizeW: 8,
		sizeH: 6
	},
	xl: {
		sizeW: 12,
		sizeH: 8
	},
	full: {
		sizeW: 12,
		sizeH: 8
	}
};
var BoardValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "BoardValidationError";
		this.code = code;
	}
};
function cloneTab(tab) {
	return {
		tabId: tab.tabId,
		title: tab.title,
		position: tab.position,
		chatDock: tab.chatDock
	};
}
function cloneWidget(widget) {
	return {
		name: widget.name,
		tabId: widget.tabId,
		...widget.title !== void 0 ? { title: widget.title } : {},
		contentKind: widget.contentKind,
		...widget.contentOwner !== void 0 ? { contentOwner: widget.contentOwner } : {},
		...widget.registeredContentKind !== void 0 ? { registeredContentKind: widget.registeredContentKind } : {},
		...widget.presentation !== void 0 ? { presentation: widget.presentation } : {},
		...widget.heightMode !== void 0 ? { heightMode: widget.heightMode } : {},
		...widget.pluginKind !== void 0 ? { pluginKind: widget.pluginKind } : {},
		...widget.props !== void 0 ? { props: structuredClone(widget.props) } : {},
		sizeW: widget.sizeW,
		sizeH: widget.sizeH,
		position: widget.position,
		grantState: widget.grantState,
		revision: widget.revision,
		...widget.instanceId !== void 0 ? { instanceId: widget.instanceId } : {},
		...widget.declaredSummary !== void 0 ? { declaredSummary: [...widget.declaredSummary] } : {},
		...widget.declared !== void 0 ? { declared: {
			...widget.declared.netOrigins ? { netOrigins: [...widget.declared.netOrigins] } : {},
			...widget.declared.tools ? { tools: [...widget.declared.tools] } : {}
		} } : {}
	};
}
function cloneLayout(layout) {
	return {
		tabs: layout.tabs.map(cloneTab),
		widgets: layout.widgets.map(cloneWidget)
	};
}
function clampInteger(value, min, max) {
	return Math.min(max, Math.max(min, Math.trunc(value)));
}
function comparePosition(a, b) {
	return a.position - b.position;
}
function normalizeBoardLayout(layout) {
	const tabs = layout.tabs.toSorted(comparePosition).map((tab, position) => {
		const next = cloneTab(tab);
		next.position = position;
		return next;
	});
	const tabPosition = new Map(tabs.map((tab) => [tab.tabId, tab.position]));
	const widgets = layout.widgets.toSorted((a, b) => {
		return (tabPosition.get(a.tabId) ?? Number.MAX_SAFE_INTEGER) - (tabPosition.get(b.tabId) ?? Number.MAX_SAFE_INTEGER) || a.position - b.position;
	}).map(cloneWidget);
	const nextPosition = /* @__PURE__ */ new Map();
	for (const widget of widgets) {
		const position = nextPosition.get(widget.tabId) ?? 0;
		widget.position = position;
		nextPosition.set(widget.tabId, position + 1);
	}
	return {
		tabs,
		widgets
	};
}
function requireTab(layout, tabId) {
	const tab = layout.tabs.find((candidate) => candidate.tabId === tabId);
	if (!tab) throw new BoardValidationError("not_found", `board tab not found: ${tabId}`);
	return tab;
}
function requireWidget(layout, name) {
	const widget = layout.widgets.find((candidate) => candidate.name === name);
	if (!widget) throw new BoardValidationError("not_found", `board widget not found: ${name}`);
	return widget;
}
function moveTab(layout, tab, position) {
	const ordered = layout.tabs.toSorted(comparePosition).filter((candidate) => candidate !== tab);
	ordered.splice(clampInteger(position, 0, ordered.length), 0, tab);
	ordered.forEach((candidate, index) => {
		candidate.position = index;
	});
	layout.tabs = ordered;
}
function moveWidget(layout, widget, targetTabId, position, after) {
	requireTab(layout, targetTabId);
	if (position !== void 0 && after !== void 0) throw new BoardValidationError("invalid_operation", "widget_move accepts either position or after, not both");
	const targetWidgets = layout.widgets.filter((candidate) => candidate.tabId === targetTabId && candidate !== widget).toSorted(comparePosition);
	let targetPosition = targetWidgets.length;
	if (after !== void 0) {
		if (after === widget.name) throw new BoardValidationError("invalid_operation", "widget cannot be placed after itself");
		const anchorIndex = targetWidgets.findIndex((candidate) => candidate.name === after);
		if (anchorIndex < 0) throw new BoardValidationError("not_found", `board widget anchor not found on tab ${targetTabId}: ${after}`);
		targetPosition = anchorIndex + 1;
	} else if (position !== void 0) targetPosition = clampInteger(position, 0, targetWidgets.length);
	widget.tabId = targetTabId;
	targetWidgets.splice(targetPosition, 0, widget);
	targetWidgets.forEach((candidate, index) => {
		candidate.position = index;
	});
	layout.widgets = [...layout.widgets.filter((candidate) => candidate !== widget && candidate.tabId !== targetTabId), ...targetWidgets];
}
function applyBoardOp(layout, op) {
	switch (op.kind) {
		case "tab_create":
			if (layout.tabs.some((tab) => tab.tabId === op.tabId)) throw new BoardValidationError("conflict", `board tab already exists: ${op.tabId}`);
			layout.tabs.push({
				tabId: op.tabId,
				title: op.title,
				position: layout.tabs.length,
				chatDock: op.chatDock ?? "right"
			});
			return;
		case "tab_update": {
			const tab = requireTab(layout, op.tabId);
			if (op.title === void 0 && op.chatDock === void 0 && op.position === void 0) throw new BoardValidationError("invalid_operation", "tab_update has no changes");
			if (op.title !== void 0) tab.title = op.title;
			if (op.chatDock !== void 0) tab.chatDock = op.chatDock;
			if (op.position !== void 0) moveTab(layout, tab, op.position);
			return;
		}
		case "tab_delete": {
			const tab = requireTab(layout, op.tabId);
			const remainingTabs = layout.tabs.filter((candidate) => candidate !== tab).toSorted(comparePosition);
			const tabWidgets = layout.widgets.filter((widget) => widget.tabId === tab.tabId).toSorted(comparePosition);
			if (remainingTabs.length === 0 && tabWidgets.length > 0) throw new BoardValidationError("invalid_operation", "cannot delete the last board tab while it contains widgets");
			layout.tabs = remainingTabs;
			if (tabWidgets.length > 0) {
				const fallback = remainingTabs[0];
				for (const widget of tabWidgets) {
					widget.tabId = fallback.tabId;
					widget.position = Number.MAX_SAFE_INTEGER;
				}
			}
			return;
		}
		case "tabs_reorder": {
			if (op.tabIds.length !== layout.tabs.length || new Set(op.tabIds).size !== op.tabIds.length || op.tabIds.some((tabId) => !layout.tabs.some((tab) => tab.tabId === tabId))) throw new BoardValidationError("invalid_operation", "tabs_reorder must contain every tab exactly once");
			const byId = new Map(layout.tabs.map((tab) => [tab.tabId, tab]));
			layout.tabs = op.tabIds.map((tabId, position) => {
				const tab = byId.get(tabId);
				tab.position = position;
				return tab;
			});
			return;
		}
		case "widget_move": {
			const widget = requireWidget(layout, op.name);
			moveWidget(layout, widget, op.tabId ?? widget.tabId, op.position, op.after);
			return;
		}
		case "widget_resize": {
			const widget = requireWidget(layout, op.name);
			widget.sizeW = clampInteger(op.sizeW, 1, 12);
			widget.sizeH = clampInteger(op.sizeH, 1, 20);
			widget.heightMode = op.heightMode ?? "fixed";
			return;
		}
		case "widget_remove":
			requireWidget(layout, op.name);
			layout.widgets = layout.widgets.filter((widget) => widget.name !== op.name);
	}
}
function applyBoardOps(layout, ops) {
	const next = cloneLayout(layout);
	for (const op of ops) {
		applyBoardOp(next, op);
		const normalized = normalizeBoardLayout(next);
		next.tabs = normalized.tabs;
		next.widgets = normalized.widgets;
	}
	return normalizeBoardLayout(next);
}
function insertBoardWidget(layout, widget, placement) {
	const next = cloneLayout(layout);
	const existing = next.widgets.find((candidate) => candidate.name === widget.name);
	if (existing) {
		const position = existing.position;
		Object.assign(existing, widget, {
			tabId: placement.tabId,
			position
		});
		if (placement.move) moveWidget(next, existing, placement.tabId, void 0, placement.after);
	} else {
		next.widgets.push({
			...widget,
			tabId: placement.tabId
		});
		moveWidget(next, requireWidget(next, widget.name), placement.tabId, void 0, placement.after);
	}
	return normalizeBoardLayout(next);
}
//#endregion
//#region src/boards/board-capabilities.ts
const MAX_DECLARED_ORIGINS = 32;
const MAX_DECLARED_TOOLS = 64;
function invalidDeclaration(message) {
	throw new BoardValidationError("invalid_operation", message);
}
function hasControlCharacter(value) {
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 31 || code === 127) return true;
	}
	return false;
}
function normalizeBoardNetOrigin(value) {
	if (value !== value.trim() || value.length === 0 || value.length > 2048) return invalidDeclaration(`invalid board widget network origin: ${value}`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		return invalidDeclaration(`invalid board widget network origin: ${value}`);
	}
	const supportedHostname = /^\[[0-9A-Fa-f:.]+\]$/u.test(parsed.hostname) || /^[A-Za-z0-9.-]+$/u.test(parsed.hostname);
	if (parsed.protocol !== "https:" || parsed.username !== "" || parsed.password !== "" || parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "" || !supportedHostname || parsed.hostname.includes("*") || parsed.hostname.endsWith(".")) return invalidDeclaration(`board widget network origin must be an exact HTTPS origin: ${value}`);
	return parsed.origin;
}
function normalizeTool(value) {
	const tool = value.trim();
	if (tool.length === 0 || tool.length > 269 || tool !== value || hasControlCharacter(tool)) return invalidDeclaration(`invalid board widget tool capability: ${value}`);
	return tool;
}
function normalizeBoardWidgetDeclared(declared) {
	if (!declared) return;
	if ((declared.netOrigins?.length ?? 0) > MAX_DECLARED_ORIGINS) return invalidDeclaration(`board widget cannot declare more than ${MAX_DECLARED_ORIGINS} network origins`);
	if ((declared.tools?.length ?? 0) > MAX_DECLARED_TOOLS) return invalidDeclaration(`board widget cannot declare more than ${MAX_DECLARED_TOOLS} tools`);
	const netOrigins = [...new Set((declared.netOrigins ?? []).map(normalizeBoardNetOrigin))].toSorted();
	const tools = [...new Set((declared.tools ?? []).map(normalizeTool))].toSorted();
	let sandboxOrigins;
	try {
		sandboxOrigins = normalizeSandboxHostCsp({ connectDomains: netOrigins })?.connectDomains;
	} catch {
		return invalidDeclaration("board widget network origins exceed safe CSP limits");
	}
	if (netOrigins.length > 0 && (sandboxOrigins?.length !== netOrigins.length || netOrigins.some((origin, index) => sandboxOrigins[index] !== origin))) return invalidDeclaration("board widget network origin is not supported by the sandbox host");
	if (netOrigins.length === 0 && tools.length === 0) return;
	return {
		...netOrigins.length > 0 ? { netOrigins } : {},
		...tools.length > 0 ? { tools } : {}
	};
}
function boardDeclarationIsSubset(requested, granted) {
	const grantedOrigins = new Set(granted?.netOrigins ?? []);
	const grantedTools = new Set(granted?.tools ?? []);
	return (requested?.netOrigins ?? []).every((origin) => grantedOrigins.has(origin)) && (requested?.tools ?? []).every((tool) => grantedTools.has(tool));
}
function boardWidgetHasGrantedTool(declared, grantState, tool) {
	return grantState === "granted" && (declared?.tools ?? []).includes(tool);
}
//#endregion
export { BoardValidationError as a, normalizeBoardLayout as c, BOARD_SIZE_PRESETS as i, boardWidgetHasGrantedTool as n, applyBoardOps as o, normalizeBoardWidgetDeclared as r, insertBoardWidget as s, boardDeclarationIsSubset as t };
