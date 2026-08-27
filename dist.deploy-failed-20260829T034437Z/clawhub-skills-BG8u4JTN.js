import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { _ as requestClawHub, a as fetchClawHubJson, b as resolveClawHubImageUrl, c as parseClawHubJsonBody, i as decodeClawHubResponseBody, o as isClawHubTelemetryDisabled, r as createClawHubError, u as readClawHubBytes, v as resolveClawHubAuthToken, y as resolveClawHubBaseUrl } from "./clawhub-client-Cjweitq0.js";
//#region src/infra/clawhub-skills.ts
const SKILL_CARD_MAX_BYTES = 256 * 1024;
const CLAWHUB_SKILLS_SH_TRUST_STATE = "not-scanned-by-clawhub";
const CLAWHUB_SKILLS_SH_TRUST_LABEL = "Not scanned by ClawHub";
/** Marks a reference ClawHub resolves from an external source it never scanned. */
const CLAWHUB_SKILLS_SH_REF_PREFIX = "skills-sh:";
/** Source variants ClawHub resolves search results from. Anything else is unidentifiable. */
const CLAWHUB_NATIVE_SOURCE_KIND = "clawhub";
const CLAWHUB_SKILLS_SH_SOURCE_KIND = "skills-sh";
const CLAWHUB_SUPPORTED_INSTALL_KINDS = /* @__PURE__ */ new Set([
	"clawhub",
	"github",
	"skills-sh"
]);
function buildVersionOrTagSearch(params) {
	const version = normalizeOptionalString(params.version);
	const ownerHandle = normalizeOptionalString(params.ownerHandle);
	if (version) return {
		version,
		...ownerHandle ? { ownerHandle } : {}
	};
	const tag = normalizeOptionalString(params.tag);
	if (tag) return {
		tag,
		...ownerHandle ? { ownerHandle } : {}
	};
	return ownerHandle ? { ownerHandle } : void 0;
}
async function searchClawHubSkills(params) {
	return ((await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/search",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			q: params.query.trim(),
			limit: params.limit ? String(params.limit) : void 0
		}
	})).results ?? []).flatMap((entry) => {
		const mapped = toClawHubSkillSearchResult(entry, params.baseUrl);
		return mapped ? [mapped] : [];
	});
}
/**
* Records each result's own source once, here, so no consumer rebuilds it. A row whose source is
* unknown, or whose external reference is missing, is dropped rather than published under
* `@owner/slug`: that spelling would point install at a different publisher's skill.
*/
function toClawHubSkillSearchResult(entry, baseUrl) {
	const { install: _install, source: _source, ...rest } = entry;
	const base = {
		...rest,
		icon: resolveClawHubImageUrl(entry.icon, baseUrl)
	};
	const source = normalizeOptionalString(entry.source);
	const installKind = normalizeOptionalString(entry.install?.kind);
	const reference = normalizeOptionalString(entry.install?.reference);
	if (installKind && !CLAWHUB_SUPPORTED_INSTALL_KINDS.has(installKind)) return;
	switch (source) {
		case CLAWHUB_SKILLS_SH_SOURCE_KIND:
			if (!reference?.startsWith("skills-sh:")) return;
			return {
				...base,
				installRef: reference,
				installOnly: true,
				trustState: CLAWHUB_SKILLS_SH_TRUST_STATE
			};
		case CLAWHUB_NATIVE_SOURCE_KIND: {
			const ownerHandle = normalizeOptionalString(entry.ownerHandle);
			return ownerHandle ? {
				...base,
				installRef: `@${ownerHandle}/${entry.slug}`
			} : void 0;
		}
		default: return;
	}
}
async function fetchClawHubSkillDetail(params) {
	const detail = await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: params.ownerHandle ? { ownerHandle: params.ownerHandle } : void 0
	});
	return {
		...detail,
		skill: detail.skill ? {
			...detail.skill,
			icon: resolveClawHubImageUrl(detail.skill.icon, params.baseUrl)
		} : null
	};
}
async function fetchClawHubSkillInstallResolution(params) {
	const { response, url, hasToken } = await requestClawHub({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/install`,
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			ownerHandle: params.ownerHandle,
			reference: params.requestedReference,
			forceInstall: params.forceInstall ? "1" : void 0
		}
	});
	const isStructuredBlock = [
		403,
		409,
		410,
		423
	].includes(response.status);
	if (!response.ok && !isStructuredBlock) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	return parseClawHubJsonBody(response, url, params.timeoutMs);
}
async function fetchClawHubSkillVerification(params) {
	return await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/skills/${encodeURIComponent(params.slug)}/verify`,
		token: params.token,
		skipAuth: params.skipAuth,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			...buildVersionOrTagSearch(params),
			reference: params.requestedReference
		}
	});
}
async function fetchClawHubSkillSecurityVerdicts(params) {
	return await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/skills/-/security-verdicts",
		method: "POST",
		json: { items: params.items },
		token: params.token,
		skipAuth: params.skipAuth,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
}
async function fetchClawHubSkillCard(params) {
	const cardUrl = normalizeOptionalString(params.url);
	const slug = normalizeOptionalString(params.slug);
	if (!cardUrl && !slug) throw new Error("ClawHub skill card fetch requires a slug or card URL");
	const providedToken = normalizeOptionalString(params.token);
	const skipAuth = cardUrl != null && providedToken == null && new URL(cardUrl, `${resolveClawHubBaseUrl(params.baseUrl)}/`).origin !== new URL(`${resolveClawHubBaseUrl(params.baseUrl)}/`).origin;
	const { response, url, hasToken } = await requestClawHub({
		baseUrl: params.baseUrl,
		url: cardUrl,
		path: slug ? `/api/v1/skills/${encodeURIComponent(slug)}/card` : void 0,
		token: providedToken,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: cardUrl ? void 0 : buildVersionOrTagSearch(params),
		skipAuth
	});
	if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
	return decodeClawHubResponseBody(await readClawHubBytes({
		response,
		maxBytes: SKILL_CARD_MAX_BYTES,
		timeoutMs: params.timeoutMs,
		resourceLabel: slug ? `skill card for ${slug}` : `skill card at ${url.pathname}`
	}));
}
async function reportClawHubSkillInstallTelemetry(params) {
	const token = normalizeOptionalString(params.token) ?? await resolveClawHubAuthToken();
	if (!token || isClawHubTelemetryDisabled()) return;
	const slug = params.slug.trim();
	if (!slug) return;
	const { response, url, hasToken } = await requestClawHub({
		baseUrl: params.baseUrl,
		path: "/api/cli/telemetry/install",
		method: "POST",
		token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		json: {
			event: "install",
			slug,
			...params.ownerHandle ? { ownerHandle: params.ownerHandle } : {},
			...params.requestedReference ? { reference: params.requestedReference } : {},
			...params.trustState ? { trustState: params.trustState } : {},
			version: params.version ?? void 0
		}
	});
	if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
}
//#endregion
export { fetchClawHubSkillDetail as a, fetchClawHubSkillVerification as c, fetchClawHubSkillCard as i, reportClawHubSkillInstallTelemetry as l, CLAWHUB_SKILLS_SH_TRUST_LABEL as n, fetchClawHubSkillInstallResolution as o, CLAWHUB_SKILLS_SH_TRUST_STATE as r, fetchClawHubSkillSecurityVerdicts as s, CLAWHUB_SKILLS_SH_REF_PREFIX as t, searchClawHubSkills as u };
