import { S as ProviderAuthContext } from "../../plugin-entry-C1So83n6.js";
import { AzAccount, AzDeploymentSummary, FoundryProviderApi, FoundryResourceOption, FoundrySelection } from "./shared.js";
import { listSubscriptions } from "./cli.js";
//#region extensions/microsoft-foundry/onboard.d.ts
declare function listResourceDeployments(resource: FoundryResourceOption, subscriptionId?: string): AzDeploymentSummary[];
declare function selectFoundryResource(ctx: ProviderAuthContext, selectedSub: AzAccount): Promise<FoundryResourceOption>;
declare function selectFoundryDeployment(ctx: ProviderAuthContext, resource: FoundryResourceOption, deployments: AzDeploymentSummary[]): Promise<{
  selected: AzDeploymentSummary;
  supported: AzDeploymentSummary[];
}>;
declare function promptEndpointAndModelManually(ctx: ProviderAuthContext): Promise<FoundrySelection>;
declare function promptApiKeyEndpointAndModel(ctx: ProviderAuthContext): Promise<FoundrySelection>;
declare function promptTenantId(ctx: ProviderAuthContext, params?: {
  suggestions?: Array<{
    id: string;
    label?: string;
  }>;
  required?: boolean;
  reason?: string;
}): Promise<string | undefined>;
declare function loginWithTenantFallback(ctx: ProviderAuthContext): Promise<{
  account: AzAccount | null;
  tenantId?: string;
}>;
declare function testFoundryConnection(params: {
  ctx: ProviderAuthContext;
  endpoint: string;
  modelId: string;
  modelNameHint?: string;
  api: FoundryProviderApi;
  subscriptionId?: string;
  tenantId?: string;
}): Promise<void>;
//#endregion
export { listResourceDeployments, listSubscriptions, loginWithTenantFallback, promptApiKeyEndpointAndModel, promptEndpointAndModelManually, promptTenantId, selectFoundryDeployment, selectFoundryResource, testFoundryConnection };