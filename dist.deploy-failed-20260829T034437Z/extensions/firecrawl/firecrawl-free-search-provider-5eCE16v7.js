import { buildFirecrawlFreeWebSearchProviderBase, buildFirecrawlWebSearchProviderBase } from "./web-search-shared.js";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
//#region extensions/firecrawl/src/firecrawl-search-provider.ts
const loadFirecrawlClientModule$1 = createLazyRuntimeModule(() => import("./firecrawl-client-DQx3FAys.js").then((n) => n.t));
const GenericFirecrawlSearchSchema = {
	type: "object",
	properties: {
		query: {
			type: "string",
			description: "Search query string."
		},
		count: {
			type: "integer",
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		}
	},
	additionalProperties: false
};
function createFirecrawlWebSearchProvider() {
	return {
		...buildFirecrawlWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: "Search the web using Firecrawl. Returns structured results with snippets from Firecrawl Search. Use firecrawl_search for Firecrawl-specific knobs like sources or categories.",
			parameters: GenericFirecrawlSearchSchema,
			execute: async (args, executionContext) => {
				executionContext?.signal?.throwIfAborted();
				const { runFirecrawlSearch } = await loadFirecrawlClientModule$1();
				return await runFirecrawlSearch({
					cfg: ctx.config,
					query: typeof args.query === "string" ? args.query : "",
					count: readPositiveIntegerParam(args, "count", {
						message: "count must be an integer from 1 to 10",
						max: 10
					}),
					...executionContext?.signal ? { signal: executionContext.signal } : {}
				});
			}
		})
	};
}
//#endregion
//#region extensions/firecrawl/src/firecrawl-free-search-provider.ts
const loadFirecrawlClientModule = createLazyRuntimeModule(() => import("./firecrawl-client-DQx3FAys.js").then((n) => n.t));
function createFirecrawlFreeWebSearchProvider() {
	return {
		...buildFirecrawlFreeWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: "Search the web using Firecrawl's free hosted starter tier (no API key required). Returns structured results with snippets. Use firecrawl_search for Firecrawl-specific knobs like sources or categories.",
			parameters: GenericFirecrawlSearchSchema,
			execute: async (args, executionContext) => {
				executionContext?.signal?.throwIfAborted();
				const { runFirecrawlSearch } = await loadFirecrawlClientModule();
				return await runFirecrawlSearch({
					cfg: ctx.config,
					query: typeof args.query === "string" ? args.query : "",
					count: readPositiveIntegerParam(args, "count", {
						message: "count must be an integer from 1 to 10",
						max: 10
					}),
					access: "keyless",
					...executionContext?.signal ? { signal: executionContext.signal } : {}
				});
			}
		})
	};
}
//#endregion
export { createFirecrawlWebSearchProvider as n, createFirecrawlFreeWebSearchProvider as t };
