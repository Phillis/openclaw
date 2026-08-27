import "./async-lock-runtime-C2Tlhpdz.js";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
//#region extensions/browser/src/browser/chrome-mcp-contracts.ts
var ChromeMcpDocumentUnavailableError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ChromeMcpDocumentUnavailableError";
	}
};
function rethrowChromeMcpDocumentError(error) {
	const message = error instanceof Error ? error.message : String(error);
	if (/Element (?:with )?uid .* (?:not found|no longer exists) on (?:the )?page|Execution context was destroyed|Cannot find context with specified id|Frame (?:was |is )?detached|detached Frame|Node is detached from document/i.test(message)) throw new ChromeMcpDocumentUnavailableError(message, { cause: error });
	throw error;
}
const MCP_REQUEST_TIMEOUT_CODE = ErrorCode.RequestTimeout;
const DEFAULT_CHROME_MCP_PACKAGE_ARGS = ["-y", "chrome-devtools-mcp@latest"];
const DEFAULT_CHROME_MCP_FEATURE_ARGS = [
	"--no-usage-statistics",
	"--experimentalStructuredContent",
	"--experimental-page-id-routing"
];
const CHROME_MCP_USAGE_STATISTICS_FLAG_RE = /^--(?:no-)?usage-?statistics(?:=.*)?$/i;
const CHROME_MCP_ENDPOINT_FLAGS = /* @__PURE__ */ new Set([
	"--browserUrl",
	"--browser-url",
	"-u",
	"--u",
	"--wsEndpoint",
	"--ws-endpoint",
	"-w",
	"--w"
]);
const CHROME_MCP_CONNECTION_FLAGS = /* @__PURE__ */ new Set([
	"--autoConnect",
	"--auto-connect",
	...CHROME_MCP_ENDPOINT_FLAGS
]);
const CHROME_MCP_USER_DATA_DIR_FLAGS = /* @__PURE__ */ new Set(["--userDataDir", "--user-data-dir"]);
const CHROME_MCP_NEW_PAGE_TIMEOUT_MS = 5e3;
const CHROME_MCP_NAVIGATE_TIMEOUT_MS = 2e4;
const CHROME_MCP_HANDSHAKE_TIMEOUT_MS = 3e4;
const CHROME_MCP_STDERR_MAX_BYTES = 8 * 1024;
const DEVTOOLS_ACTIVE_PORT_RE = /\bDevToolsActivePort\b/i;
const CHROME_CONNECTION_TOOL_ERROR_RE = /(?:Could not connect to Chrome|DevToolsActivePort|ECONNREFUSED|ECONNRESET|websocket|timed out)/i;
const STALE_SELECTED_PAGE_ERROR = "The selected page has been closed. Call list_pages to see open pages.";
const CHROME_MCP_SESSION_TARGET_PREFIX = "chrome-mcp:";
const CHROME_MCP_SNAPSHOT_REF_PREFIX = "mcp-ref:";
var ChromeMcpReconnectRequiredError = class extends Error {};
var ChromeMcpProcessSnapshotError = class extends Error {};
//#endregion
export { DEVTOOLS_ACTIVE_PORT_RE as _, CHROME_MCP_NAVIGATE_TIMEOUT_MS as a, rethrowChromeMcpDocumentError as b, CHROME_MCP_SNAPSHOT_REF_PREFIX as c, CHROME_MCP_USER_DATA_DIR_FLAGS as d, ChromeMcpDocumentUnavailableError as f, DEFAULT_CHROME_MCP_PACKAGE_ARGS as g, DEFAULT_CHROME_MCP_FEATURE_ARGS as h, CHROME_MCP_HANDSHAKE_TIMEOUT_MS as i, CHROME_MCP_STDERR_MAX_BYTES as l, ChromeMcpReconnectRequiredError as m, CHROME_MCP_CONNECTION_FLAGS as n, CHROME_MCP_NEW_PAGE_TIMEOUT_MS as o, ChromeMcpProcessSnapshotError as p, CHROME_MCP_ENDPOINT_FLAGS as r, CHROME_MCP_SESSION_TARGET_PREFIX as s, CHROME_CONNECTION_TOOL_ERROR_RE as t, CHROME_MCP_USAGE_STATISTICS_FLAG_RE as u, MCP_REQUEST_TIMEOUT_CODE as v, STALE_SELECTED_PAGE_ERROR as y };
