//#region src/agents/model-catalog-entry.ts
/** Shared metadata projection; keep transport headers and authoring fields out of catalog entries. */
function modelCatalogRowToEntry(row) {
	const contextWindow = row.contextWindow ?? row.contextTokens;
	return {
		id: row.id,
		name: row.name,
		provider: row.provider,
		api: row.api,
		...row.baseUrl ? { baseUrl: row.baseUrl } : {},
		...contextWindow !== void 0 ? { contextWindow } : {},
		...row.contextWindows ? { contextWindows: row.contextWindows.map((option) => ({ ...option })) } : {},
		...row.contextWindowDefault ? { contextWindowDefault: row.contextWindowDefault } : {},
		...row.contextTokens !== void 0 ? { contextTokens: row.contextTokens } : {},
		reasoning: row.reasoning,
		...row.thinkingLevelMap ? { thinkingLevelMap: { ...row.thinkingLevelMap } } : {},
		input: [...row.input],
		...row.compat ? { compat: row.compat } : {},
		...row.mediaInput ? { mediaInput: row.mediaInput } : {},
		status: row.status,
		...row.statusReason ? { statusReason: row.statusReason } : {},
		...row.replaces ? { replaces: [...row.replaces] } : {},
		...row.replacedBy ? { replacedBy: row.replacedBy } : {}
	};
}
//#endregion
export { modelCatalogRowToEntry as t };
