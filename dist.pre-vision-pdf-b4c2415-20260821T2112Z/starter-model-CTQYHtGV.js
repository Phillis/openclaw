import { t as DEFAULT_COPILOT_MODEL } from "./model-metadata-7Okp1BxB.js";
import { a as selectCopilotStarterModel, n as fetchCopilotModelCatalog, t as PROVIDER_ID } from "./models-C9ukNKrQ.js";
import { n as resolveCopilotRuntimeAuth } from "./runtime-auth-BcfKhsc7.js";
//#region extensions/github-copilot/starter-model.ts
function preferredCopilotStarterModelId() {
	const prefix = `${PROVIDER_ID}/`;
	return "github-copilot/claude-sonnet-5".startsWith(prefix) ? DEFAULT_COPILOT_MODEL.slice(prefix.length) : DEFAULT_COPILOT_MODEL;
}
async function resolveCopilotStarterModel(params) {
	const auth = await resolveCopilotRuntimeAuth({
		githubToken: params.githubToken,
		...params.env ? { env: params.env } : {},
		...params.githubDomain ? { githubDomain: params.githubDomain } : {},
		...params.config ? { config: params.config } : {}
	});
	const selected = selectCopilotStarterModel(await fetchCopilotModelCatalog({
		copilotApiToken: auth.apiKey,
		baseUrl: auth.baseUrl
	}), preferredCopilotStarterModelId());
	if (!selected) throw new Error("GitHub Copilot did not return an enabled, picker-visible chat model with streaming and tool-call support.");
	return `${PROVIDER_ID}/${selected.id}`;
}
//#endregion
export { resolveCopilotStarterModel as t };
