import { l as swapSecretSentinelsInText, o as looksLikeSecretSentinel, s as mintSecretSentinel } from "./sentinel-DFKnr2-n.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-DzAepWRR.js";
import { o as getModelProviderRequestTransport, r as attachModelProviderRequestTransport } from "./provider-request-config-BR35Bqmj.js";
//#region src/agents/provider-secret-egress.ts
function protectRuntimeAuthValue(params) {
	if (!params.value) return params.value;
	return looksLikeSecretSentinel(params.value) ? params.value : mintSecretSentinel(params.value, { label: `model-auth:${params.provider}:${params.label}` });
}
/** Re-sentinels credentials returned by a provider auth exchange. */
function protectPreparedProviderRuntimeAuth(params) {
	const { preparedAuth } = params;
	if (!preparedAuth) return;
	const protect = (value, label) => !value || isNonSecretApiKeyMarker(value) ? value : protectRuntimeAuthValue({
		value,
		provider: params.provider,
		label
	});
	const request = preparedAuth.request;
	const headers = request?.headers ? Object.fromEntries(Object.entries(request.headers).map(([name, value]) => [name, protect(value, `runtime-header:${name.toLowerCase()}`)])) : void 0;
	const auth = request?.auth;
	const protectedAuth = auth?.mode === "authorization-bearer" ? {
		...auth,
		token: protect(auth.token, "runtime-bearer")
	} : auth?.mode === "header" ? {
		...auth,
		value: protect(auth.value, `runtime-auth-header:${auth.headerName.toLowerCase()}`)
	} : auth;
	return {
		...preparedAuth,
		apiKey: protect(preparedAuth.apiKey, "runtime-api-key"),
		...request ? { request: {
			...request,
			...headers ? { headers } : {},
			...protectedAuth ? { auth: protectedAuth } : {}
		} } : {}
	};
}
function unwrapSecretSentinelsForProviderEgress(value, boundary) {
	const swapped = swapSecretSentinelsInText(value);
	const unknown = swapped.unknown[0];
	if (unknown) throw new Error(`Secret sentinel ${unknown} is not registered in this process; refusing ${boundary}`);
	return swapped.text;
}
function unwrapHeaderSentinelsForProviderEgress(input, boundary) {
	let headers;
	for (const [name, value] of Object.entries(input)) {
		if (typeof value !== "string") continue;
		const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
		if (resolved !== value) {
			headers ??= { ...input };
			headers[name] = resolved;
		}
	}
	return headers ? headers : input;
}
function unwrapHeadersInitSentinelsForProviderEgress(input, boundary) {
	if (!input) return input;
	const headers = new Headers(input);
	let changed = false;
	for (const [name, value] of headers) {
		const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
		if (resolved !== value) {
			headers.set(name, resolved);
			changed = true;
		}
	}
	return changed ? headers : input;
}
function unwrapRequestTransportSentinelsForProviderEgress(request, boundary) {
	if (!request) return request;
	const headers = request.headers ? unwrapHeaderSentinelsForProviderEgress(request.headers, boundary) : request.headers;
	let auth = request.auth;
	if (auth?.mode === "authorization-bearer") {
		const token = unwrapSecretSentinelsForProviderEgress(auth.token, boundary);
		if (token !== auth.token) auth = {
			...auth,
			token
		};
	} else if (auth?.mode === "header") {
		const value = unwrapSecretSentinelsForProviderEgress(auth.value, boundary);
		if (value !== auth.value) auth = {
			...auth,
			value
		};
	}
	if (headers === request.headers && auth === request.auth) return request;
	return {
		...request,
		...headers ? { headers } : {},
		...auth ? { auth } : {}
	};
}
function unwrapModelHeaderSentinelsForProviderEgress(model, boundary) {
	const headers = model.headers ? unwrapHeaderSentinelsForProviderEgress(model.headers, boundary) : model.headers;
	const request = getModelProviderRequestTransport(model);
	const unwrappedRequest = unwrapRequestTransportSentinelsForProviderEgress(request, boundary);
	if (headers === model.headers && unwrappedRequest === request) return model;
	const next = headers === model.headers ? { ...model } : {
		...model,
		headers
	};
	return unwrappedRequest === request ? next : attachModelProviderRequestTransport(next, unwrappedRequest);
}
//#endregion
export { unwrapSecretSentinelsForProviderEgress as a, unwrapModelHeaderSentinelsForProviderEgress as i, unwrapHeaderSentinelsForProviderEgress as n, unwrapHeadersInitSentinelsForProviderEgress as r, protectPreparedProviderRuntimeAuth as t };
