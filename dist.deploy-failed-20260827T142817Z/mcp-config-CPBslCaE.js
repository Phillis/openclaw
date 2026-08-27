import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import "./utils-DEqefz4f.js";
import { N as validateConfigObjectWithPlugins, m as readSourceConfigSnapshot } from "./io-D1h6pxaD.js";
import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { r as normalizeConfiguredMcpServers, t as canonicalizeConfiguredMcpServer } from "./mcp-config-normalize-Cg4Pldzy.js";
import { t as redactSensitiveArgv } from "./redact-argv-BOiEx69g.js";
import { r as replaceConfigFile } from "./mutate-xf8UM8H3.js";
import { i as restoreRedactedValues, t as REDACTED_SENTINEL } from "./redact-snapshot-DuN7qyYL.js";
import { t as buildConfigSchemaCore } from "./schema-BT17pjzs.js";
import { existsSync } from "node:fs";
//#region src/state/claw-mcp-adoption.ts
/** Records an explicit non-Claw claim through the canonical MCP owner. */
function markClawMcpServerIndependentlyOwned(name, options = {}) {
	if (!existsSync(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env))) return 0;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const result = db.prepare(`UPDATE claw_mcp_server_refs
                SET independent_owner = 1, updated_at_ms = @updated_at_ms
              WHERE name = @name AND independent_owner <> 1`).run({
				name,
				updated_at_ms: options.nowMs ?? Date.now()
			});
			return Number(result.changes);
		}, options);
	} catch {
		return 0;
	}
}
//#endregion
//#region src/config/mcp-config.ts
function normalizeToolSelectionList(value) {
	if (!value) return;
	const normalized = Array.from(new Set(value.map((entry) => entry.trim()).filter((entry) => entry.length > 0))).toSorted((a, b) => a.localeCompare(b));
	return normalized.length > 0 ? normalized : void 0;
}
function restoreMcpServerArgvSentinels(params) {
	const incomingArgs = params.incoming.args;
	if (!Array.isArray(incomingArgs)) return {
		ok: true,
		server: params.incoming
	};
	if (!incomingArgs.some((arg) => typeof arg === "string" && arg.includes("__OPENCLAW_REDACTED__"))) return {
		ok: true,
		server: params.incoming
	};
	const originalArgs = params.original?.args;
	if (!Array.isArray(originalArgs) || !originalArgs.every((arg) => typeof arg === "string") || incomingArgs.length !== originalArgs.length) return {
		ok: false,
		error: `Cannot restore MCP args containing "${REDACTED_SENTINEL}" without the same original argv shape.`
	};
	const displayedArgs = redactSensitiveArgv(originalArgs, REDACTED_SENTINEL);
	if (incomingArgs.some((arg, index) => arg !== displayedArgs[index])) return {
		ok: false,
		error: `Cannot restore MCP args containing "${REDACTED_SENTINEL}" after argv changed. Replace every redacted value explicitly before editing args.`
	};
	return {
		ok: true,
		server: {
			...params.incoming,
			args: originalArgs
		}
	};
}
async function listConfiguredMcpServers() {
	const snapshot = await readSourceConfigSnapshot();
	if (!snapshot.valid) return {
		ok: false,
		path: snapshot.path,
		error: "Config file is invalid; fix it before using MCP config commands."
	};
	const sourceConfig = snapshot.sourceConfig ?? snapshot.resolved;
	return {
		ok: true,
		path: snapshot.path,
		config: structuredClone(sourceConfig),
		mcpServers: normalizeConfiguredMcpServers(sourceConfig.mcp?.servers),
		baseHash: snapshot.hash
	};
}
async function commitConfiguredMcpServers(params) {
	const next = structuredClone(params.loaded.config);
	if (Object.keys(params.servers).length > 0) next.mcp = {
		...next.mcp,
		servers: params.servers
	};
	else if (next.mcp) {
		delete next.mcp.servers;
		if (Object.keys(next.mcp).length === 0) delete next.mcp;
	}
	const validated = validateConfigObjectWithPlugins(next);
	if (!validated.ok) {
		const issue = expectDefined(validated.issues[0], "issues entry at 0");
		return {
			ok: false,
			path: params.loaded.path,
			error: `Config invalid after MCP ${params.errorLabel} (${issue.path}: ${issue.message}).`
		};
	}
	await replaceConfigFile({
		nextConfig: validated.config,
		baseHash: params.loaded.baseHash
	});
	if (params.mutation?.onCommitted) {
		const previous = params.loaded.mcpServers[params.mutation.name];
		const nextServer = params.servers[params.mutation.name];
		await params.mutation.onCommitted({
			name: params.mutation.name,
			...previous ? { previous } : {},
			...nextServer ? { next: nextServer } : {}
		});
	}
	if (params.independentlyOwnedName) markClawMcpServerIndependentlyOwned(params.independentlyOwnedName);
	return {
		ok: true,
		path: params.loaded.path,
		config: validated.config,
		mcpServers: params.servers,
		...params.success
	};
}
async function updateConfiguredMcpServerConfig(params) {
	const name = params.name.trim();
	if (!name) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	const loaded = await listConfiguredMcpServers();
	if (!loaded.ok) return loaded;
	if (!Object.hasOwn(loaded.mcpServers, name)) {
		const { baseHash: _baseHash, ...unchanged } = loaded;
		return {
			...unchanged,
			updated: false
		};
	}
	const servers = normalizeConfiguredMcpServers(loaded.config.mcp?.servers);
	servers[name] = params.update({ ...servers[name] });
	return commitConfiguredMcpServers({
		loaded,
		servers,
		errorLabel: params.errorLabel,
		success: { updated: true },
		independentlyOwnedName: params.recordIndependentOwner === false ? void 0 : name,
		mutation: {
			name,
			onCommitted: params.onCommitted
		}
	});
}
async function updateConfiguredMcpServerTools(params, onCommitted) {
	return updateConfiguredMcpServerConfig({
		name: params.name,
		recordIndependentOwner: params.recordIndependentOwner,
		errorLabel: "tool selection update",
		onCommitted,
		update: (server) => {
			if (params.tools === null) delete server.toolFilter;
			else {
				const include = normalizeToolSelectionList(params.tools.include);
				const exclude = normalizeToolSelectionList(params.tools.exclude);
				if (include || exclude) server.toolFilter = {
					...include ? { include } : {},
					...exclude ? { exclude } : {}
				};
				else delete server.toolFilter;
			}
			return server;
		}
	});
}
async function updateConfiguredMcpServer(params, onCommitted) {
	return updateConfiguredMcpServerConfig({
		name: params.name,
		recordIndependentOwner: params.recordIndependentOwner,
		errorLabel: "configure",
		onCommitted,
		update: (server) => canonicalizeConfiguredMcpServer(params.update(server))
	});
}
async function setConfiguredMcpServer(params, onCommitted) {
	const name = params.name.trim();
	if (!name) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	if (!isRecord(params.server)) return {
		ok: false,
		path: "",
		error: "MCP server config must be a JSON object."
	};
	const loaded = await listConfiguredMcpServers();
	if (!loaded.ok) return loaded;
	if (params.createOnly && Object.hasOwn(loaded.mcpServers, name)) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} already exists.`
	};
	const existingServer = loaded.mcpServers[name];
	if (params.expectedServer && (!Object.hasOwn(loaded.mcpServers, name) || !existingServer || stableStringify(canonicalizeConfiguredMcpServer(existingServer)) !== stableStringify(canonicalizeConfiguredMcpServer(params.expectedServer)))) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} changed and was not updated.`
	};
	const argvRestored = restoreMcpServerArgvSentinels({
		incoming: params.server,
		original: loaded.mcpServers[name]
	});
	if (!argvRestored.ok) return {
		ok: false,
		path: loaded.path,
		error: argvRestored.error
	};
	const restored = restoreRedactedValues({ mcp: { servers: { [name]: argvRestored.server } } }, { mcp: { servers: loaded.mcpServers } }, buildConfigSchemaCore().uiHints);
	if (!restored.ok) return {
		ok: false,
		path: loaded.path,
		error: restored.humanReadableMessage ?? "MCP server config contains an unrestorable redacted value."
	};
	const restoredServer = restored.result.mcp?.servers?.[name];
	if (!isRecord(restoredServer)) return {
		ok: false,
		path: loaded.path,
		error: "MCP server config must be a JSON object."
	};
	const servers = normalizeConfiguredMcpServers(loaded.config.mcp?.servers);
	servers[name] = canonicalizeConfiguredMcpServer(restoredServer);
	return commitConfiguredMcpServers({
		loaded,
		servers,
		errorLabel: "set",
		independentlyOwnedName: params.recordIndependentOwner === false ? void 0 : name,
		mutation: {
			name,
			onCommitted
		}
	});
}
async function unsetConfiguredMcpServer(params, onCommitted) {
	const name = params.name.trim();
	if (!name) return {
		ok: false,
		path: "",
		error: "MCP server name is required."
	};
	const loaded = await listConfiguredMcpServers();
	if (!loaded.ok) return loaded;
	if (!Object.hasOwn(loaded.mcpServers, name)) {
		const { baseHash: _baseHash, ...unchanged } = loaded;
		return {
			...unchanged,
			removed: false
		};
	}
	const loadedServer = loaded.mcpServers[name];
	if (params.expectedServer && loadedServer && stableStringify(canonicalizeConfiguredMcpServer(loadedServer)) !== stableStringify(canonicalizeConfiguredMcpServer(params.expectedServer))) return {
		ok: false,
		path: loaded.path,
		error: `MCP server ${JSON.stringify(name)} changed and was not removed.`
	};
	const servers = normalizeConfiguredMcpServers(loaded.config.mcp?.servers);
	delete servers[name];
	return commitConfiguredMcpServers({
		loaded,
		servers,
		errorLabel: "unset",
		success: { removed: true },
		mutation: {
			name,
			onCommitted
		}
	});
}
/** Low-level config writers; production mutations must use the agents-owned lifecycle facade. */
const mcpConfigInternal = {
	set: setConfiguredMcpServer,
	unset: unsetConfiguredMcpServer,
	update: updateConfiguredMcpServer,
	updateTools: updateConfiguredMcpServerTools
};
//#endregion
export { mcpConfigInternal as n, listConfiguredMcpServers as t };
