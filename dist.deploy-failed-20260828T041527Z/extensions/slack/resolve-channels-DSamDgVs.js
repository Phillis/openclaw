import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.js";
import { a as parseSlackTarget, n as formatSlackTarget } from "./target-parsing-BnMD2ZqZ.js";
import { i as createSlackLookupClient } from "./probe-4_aHtVT3.js";
import { t as collectSlackCursorPages } from "./cursor-pages-eX7p8Wwt.js";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveDirectoryAllowlistEntries } from "openclaw/plugin-sdk/directory-runtime";
//#region extensions/slack/src/resolve-channels.ts
var resolve_channels_exports = /* @__PURE__ */ __exportAll({ resolveSlackChannelAllowlist: () => resolveSlackChannelAllowlist });
function resolveWorkspaceQualifiedChannel(input) {
	if (!/^team:/i.test(input)) return;
	try {
		const target = parseSlackTarget(input);
		if (target?.kind !== "channel" || !target.teamId) return;
		return {
			input,
			resolved: true,
			id: formatSlackTarget({
				teamId: target.teamId,
				kind: "channel",
				id: target.id
			})
		};
	} catch {
		return;
	}
}
function parseSlackChannelMention(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {};
	const mention = trimmed.match(/^<#([A-Z0-9]+)(?:\|([^>]+))?>$/i);
	if (mention) return {
		id: mention[1]?.toUpperCase(),
		name: mention[2]?.trim()
	};
	const prefixed = trimmed.replace(/^(slack:|channel:)/i, "");
	if (/^[CG][A-Z0-9]+$/i.test(prefixed)) return { id: prefixed.toUpperCase() };
	const name = prefixed.replace(/^#/, "").trim();
	return name ? { name } : {};
}
async function listSlackChannels(client) {
	return collectSlackCursorPages({
		fetchPage: (cursor) => client.conversations.list({
			types: "public_channel,private_channel",
			exclude_archived: false,
			limit: 1e3,
			cursor
		}),
		collectPageItems: (res) => (res.channels ?? []).map((channel) => {
			const id = channel.id?.trim();
			const name = channel.name?.trim();
			if (!id || !name) return null;
			return {
				id,
				name,
				archived: Boolean(channel.is_archived),
				isPrivate: Boolean(channel.is_private)
			};
		}).filter(Boolean)
	});
}
function resolveByName(name, channels) {
	const target = normalizeLowercaseStringOrEmpty(name);
	if (!target) return;
	const matches = channels.filter((channel) => normalizeLowercaseStringOrEmpty(channel.name) === target);
	if (matches.length === 0) return;
	return matches.find((channel) => !channel.archived) ?? matches[0];
}
async function resolveSlackChannelAllowlist(params) {
	const workspaceResolved = params.entries.map(resolveWorkspaceQualifiedChannel);
	const lookupEntries = params.entries.filter((_, index) => !workspaceResolved[index]);
	if (lookupEntries.length === 0) return workspaceResolved.filter((entry) => entry !== void 0);
	const parsedEntries = lookupEntries.map((input) => ({
		input,
		parsed: parseSlackChannelMention(input)
	}));
	if (parsedEntries.every((entry) => Boolean(entry.parsed.id))) {
		const resolved = parsedEntries.map(({ input, parsed }) => ({
			input,
			resolved: true,
			id: parsed.id,
			name: parsed.name
		}));
		let resolvedIndex = 0;
		return workspaceResolved.map((entry) => entry ?? resolved[resolvedIndex++]);
	}
	const resolved = resolveDirectoryAllowlistEntries({
		entries: lookupEntries,
		lookup: await listSlackChannels(params.client ?? createSlackLookupClient(params.token)),
		parseInput: parseSlackChannelMention,
		findById: (lookup, id) => lookup.find((channel) => channel.id === id),
		buildIdResolved: ({ input, parsed, match }) => ({
			input,
			resolved: true,
			id: parsed.id,
			name: match?.name ?? parsed.name,
			archived: match?.archived
		}),
		resolveNonId: ({ input, parsed, lookup }) => {
			if (!parsed.name) return;
			const match = resolveByName(parsed.name, lookup);
			if (!match) return;
			return {
				input,
				resolved: true,
				id: match.id,
				name: match.name,
				archived: match.archived
			};
		},
		buildUnresolved: (input) => ({
			input,
			resolved: false
		})
	});
	let resolvedIndex = 0;
	return workspaceResolved.map((entry) => entry ?? resolved[resolvedIndex++]);
}
//#endregion
export { resolve_channels_exports as n, resolveSlackChannelAllowlist as t };
