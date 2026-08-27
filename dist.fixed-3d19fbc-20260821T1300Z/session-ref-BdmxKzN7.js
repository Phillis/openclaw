import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { i as isSensitiveUrlQueryParamName } from "./redact-sensitive-url-BN1NZvXG.js";
import { n as consumeRootOptionToken } from "./cli-root-options-CpQG4BXe.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { n as sanitizeTerminalText } from "./safe-text-CpAuEO38.js";
import { x as normalizeWebSocketProtocol } from "./net-BRYQcUG8.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BsRSnf71.js";
import { i as parseShortSessionRef, n as isReservedSessionRest, r as normalizeControlUiBasePath } from "./grammar-HdFA7BPj.js";
//#region packages/session-url-contract/src/parse.ts
function normalizePath(path) {
	const trimmed = path.trim();
	if (!trimmed) return "/";
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}
function decodePathSegment(segment) {
	if (segment === "~dot") return ".";
	if (segment === "~dotdot") return "..";
	try {
		return decodeURIComponent(segment.startsWith("~~") ? segment.slice(1) : segment) || null;
	} catch {
		return null;
	}
}
function literalSessionKey(agentId, restSegments) {
	const normalizedAgentId = normalizeNullableString(agentId);
	if (!normalizedAgentId || restSegments.length === 0 || restSegments.some((segment) => !segment)) return null;
	return `agent:${normalizeAgentId(normalizedAgentId)}:${restSegments.join(":")}`;
}
function parseControlUiSessionPath(pathname, basePath = "", mainKey) {
	const normalizedPath = normalizePath(pathname);
	for (const namespace of ["chat", "dashboard"]) {
		const prefix = `${normalizeControlUiBasePath(basePath)}/${namespace}/`;
		if (!normalizedPath.startsWith(prefix)) continue;
		const rawSegments = normalizedPath.slice(prefix.length).split("/");
		const rawAgentId = decodePathSegment(rawSegments[0] ?? "");
		if (!rawAgentId) return null;
		const agentId = normalizeAgentId(rawAgentId);
		if (rawSegments.length === 1) return {
			namespace,
			kind: "main",
			agentId
		};
		const forceLiteral = rawSegments[1] === "~key";
		const restSegments = rawSegments.slice(forceLiteral ? 2 : 1).map(decodePathSegment);
		if (restSegments.some((segment) => segment === null)) return null;
		const literalRestSegments = restSegments;
		const sessionKey = literalSessionKey(agentId, literalRestSegments);
		if (!sessionKey) return null;
		if (forceLiteral) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey
		};
		if (literalRestSegments.length !== 1) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey
		};
		const segment = literalRestSegments[0] ?? "";
		if (isReservedSessionRest(segment, mainKey)) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey
		};
		const shortRef = parseShortSessionRef(segment);
		if (!shortRef) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey,
			slugCandidate: segment
		};
		return {
			namespace,
			kind: "short",
			agentId,
			...shortRef
		};
	}
	return null;
}
//#endregion
//#region src/cli/session-ref.ts
const SESSION_TARGET_HELP = "Accepted session targets: https://host[/base]/{chat|dashboard}/<agent>[/<ref>], <host>/<agent>/<ref>, or a bare <slug>-<shortid>, <shortid>, or agent:... key.";
var SessionTargetParseError = class extends Error {
	constructor() {
		super(SESSION_TARGET_HELP);
		this.name = "SessionTargetParseError";
	}
};
const BARE_SESSION_TUI_VALUE_OPTIONS = {
	"--token": "token",
	"--password": "password",
	"--tls-fingerprint": "tlsFingerprint",
	"--thinking": "thinking",
	"--message": "message",
	"--timeout-ms": "timeoutMs",
	"--history-limit": "historyLimit"
};
function refFromPathTarget(target) {
	if (target.kind === "main") return { kind: "main" };
	if (target.kind === "short") return {
		kind: "short",
		shortId: target.shortId,
		...target.slugHint ? { slugHint: target.slugHint } : {}
	};
	return {
		kind: "literal",
		sessionKey: target.sessionKey
	};
}
function parseControlPath(pathname) {
	const direct = parseControlUiSessionPath(pathname);
	if (direct) return {
		basePath: "",
		target: direct
	};
	const segments = pathname.split("/");
	for (let index = segments.length - 1; index > 0; index -= 1) {
		if (segments[index] !== "chat" && segments[index] !== "dashboard") continue;
		const basePath = segments.slice(0, index).join("/");
		const target = parseControlUiSessionPath(pathname, basePath);
		if (target) return {
			basePath,
			target
		};
	}
	throw new SessionTargetParseError();
}
function rejectUrlCredentials(url) {
	const fragmentParams = new URLSearchParams(url.hash.replace(/^#/u, ""));
	const sensitiveParam = [...url.searchParams.keys(), ...fragmentParams.keys()].some(isSensitiveUrlQueryParamName);
	if (url.username || url.password || sensitiveParam) throw new Error("Session URLs must not contain credentials. Pass --token or --password instead.");
}
function parseSessionUrl(raw) {
	let url;
	try {
		url = new URL(raw);
	} catch {
		throw new SessionTargetParseError();
	}
	rejectUrlCredentials(url);
	if (![
		"http:",
		"https:",
		"ws:",
		"wss:"
	].includes(url.protocol)) throw new SessionTargetParseError();
	url.protocol = normalizeWebSocketProtocol(url.protocol);
	const parsed = parseControlPath(url.pathname);
	buildGatewayConnectionDetailsWithResolvers({
		config: {},
		url: `${url.origin}${parsed.basePath}`
	});
	return {
		kind: "url",
		origin: url.origin,
		basePath: parsed.basePath,
		agentId: parsed.target.agentId,
		ref: refFromPathTarget(parsed.target)
	};
}
function parseHostShorthand(raw) {
	const parts = (raw.endsWith("/") ? raw.slice(0, -1) : raw).split("/");
	if (parts.length !== 3 || parts.some((part) => !part)) return null;
	let host;
	try {
		host = new URL(`wss://${parts[0]}`);
	} catch {
		throw new SessionTargetParseError();
	}
	rejectUrlCredentials(host);
	if (host.pathname !== "/" || host.search || host.hash) throw new SessionTargetParseError();
	const target = parseControlUiSessionPath(`/dashboard/${parts[1]}/${parts[2]}`);
	if (!target) throw new SessionTargetParseError();
	return {
		kind: "url",
		origin: host.origin,
		basePath: "",
		agentId: target.agentId,
		ref: refFromPathTarget(target)
	};
}
function parseSessionTargetInput(raw) {
	const value = raw.trim();
	if (!value) throw new SessionTargetParseError();
	if (/^[a-z][a-z0-9+.-]*:\/\//iu.test(value)) return parseSessionUrl(value);
	const agentKey = parseAgentSessionKey(value);
	if (agentKey) return {
		kind: "ref",
		ref: {
			kind: "literal",
			sessionKey: `agent:${agentKey.agentId}:${agentKey.rest}`
		}
	};
	const shorthand = parseHostShorthand(value);
	if (shorthand) return shorthand;
	const short = parseControlUiSessionPath(`/dashboard/main/${value}`);
	if (short?.kind === "short") return {
		kind: "ref",
		ref: {
			kind: "short",
			shortId: short.shortId,
			...short.slugHint ? { slugHint: short.slugHint } : {}
		}
	};
	throw new SessionTargetParseError();
}
function isSessionUrlInputCandidate(raw) {
	return /^(?:https?|wss?):\/\//iu.test(raw.trim());
}
function findBareSessionUrlIndex(argv) {
	for (let index = 2; index < argv.length; index += 1) {
		const rootConsumed = consumeRootOptionToken(argv, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		const arg = argv[index];
		if (arg && isSessionUrlInputCandidate(arg)) return index;
	}
	return -1;
}
function bareSessionOptionError(flag) {
	return /* @__PURE__ */ new Error(`Unsupported bare session URL option: ${sanitizeTerminalText(flag)}. Use \`openclaw tui <url> --help\` for the full option list.`);
}
/** Parse the complete bare-root URL invocation before generic command discovery can see secrets. */
function parseBareSessionInvocation(argv) {
	const targetIndex = findBareSessionUrlIndex(argv);
	if (targetIndex === -1) return null;
	const options = {};
	for (let index = 2; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg) continue;
		if (index === targetIndex) continue;
		if (arg === "--") throw bareSessionOptionError("--");
		const rootConsumed = consumeRootOptionToken(argv, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		if (arg === "--deliver") {
			options.deliver = true;
			continue;
		}
		const equalsIndex = arg.indexOf("=");
		const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
		const optionKey = BARE_SESSION_TUI_VALUE_OPTIONS[flag];
		if (!optionKey) {
			if (!arg.startsWith("-")) {
				if (index < targetIndex) return null;
				throw new Error("Unexpected extra argument for bare session URL. Use `openclaw tui <url> --help` for the full option list.");
			}
			throw bareSessionOptionError(flag);
		}
		const value = equalsIndex === -1 ? argv[index + 1] : arg.slice(equalsIndex + 1);
		if (!value || value === "--" || equalsIndex === -1 && (index + 1 === targetIndex || value.startsWith("-"))) throw new Error(`${flag} requires a value.`);
		options[optionKey] = value;
		if (equalsIndex === -1) index += 1;
	}
	return {
		target: argv[targetIndex] ?? "",
		options
	};
}
//#endregion
export { parseBareSessionInvocation as n, parseSessionTargetInput as r, SessionTargetParseError as t };
