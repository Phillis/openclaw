//#region extensions/google/vertex-adc.d.ts
declare const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
declare function isGoogleVertexCredentialsMarker(apiKey: string | undefined): apiKey is undefined | typeof GCP_VERTEX_CREDENTIALS_MARKER;
declare function resolveGoogleVertexConfigApiKey(env?: NodeJS.ProcessEnv): string | undefined;
/**
 * Resolve `Authorization: Bearer ...` headers for Google Vertex calls.
 *
 * We try the hand-rolled `authorized_user` refresh path first (preserves the
 * existing fetchImpl test seam and the OpenClaw upstream behaviour); when the
 * configured ADC source is anything other than `authorized_user` (the common
 * production cases on GKE: Workload Identity, Workload Identity Federation,
 * service-account JSON keys), we hand off to `google-auth-library` which
 * understands all of those natively.
 *
 * Note: the function is still named `...AuthorizedUserHeaders` to avoid a
 * symbol rename across the existing patch surface; the docstring above is
 * the truth, the name is legacy.
 */
declare function resolveGoogleVertexAuthorizedUserHeaders(fetchImpl?: typeof fetch): Promise<Record<string, string>>;
//#endregion
export { isGoogleVertexCredentialsMarker, resolveGoogleVertexAuthorizedUserHeaders, resolveGoogleVertexConfigApiKey };