import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as stripAnsi, s as visibleWidth } from "./ansi-DjDeieuH.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { _ as requestClawHub, a as fetchClawHubJson, b as resolveClawHubImageUrl, c as parseClawHubJsonBody, i as decodeClawHubResponseBody, o as isClawHubTelemetryDisabled, r as createClawHubError, u as readClawHubBytes, v as resolveClawHubAuthToken, y as resolveClawHubBaseUrl } from "./clawhub-client-4V78ChLt.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatTerminalLink } from "./terminal-link-GrnqEUaJ.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import { r as fetchClawHubPackageSecurity } from "./clawhub-packages-BeP446fo.js";
import pLimit from "p-limit";
//#region src/infra/clawhub-skills.ts
const SKILL_CARD_MAX_BYTES = 256 * 1024;
const CLAWHUB_SKILLS_SH_TRUST_STATE = "not-scanned-by-clawhub";
const CLAWHUB_SKILLS_SH_TRUST_LABEL = "Not scanned by ClawHub";
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
	const results = (await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/search",
		token: params.token,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl,
		search: {
			q: params.query.trim(),
			limit: params.limit ? String(params.limit) : void 0
		}
	})).results ?? [];
	for (const entry of results) {
		entry.icon = resolveClawHubImageUrl(entry.icon, params.baseUrl);
		const ownerHandle = normalizeOptionalString(entry.ownerHandle);
		if (!entry.installRef && ownerHandle) entry.installRef = `@${ownerHandle}/${entry.slug}`;
	}
	return results;
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
//#region src/infra/clawhub-skill-security.ts
const MAX_SECURITY_VERDICT_BATCH_SIZE = 100;
const OWNER_QUALIFIED_FALLBACK_CONCURRENCY = 6;
const NON_SECURITY_VERIFY_REASONS = /* @__PURE__ */ new Set(["card.missing", "card_missing"]);
function normalizeOwnerHandle(ownerHandle) {
	return normalizeOptionalString(ownerHandle)?.replace(/^@+/, "").toLowerCase() || void 0;
}
function normalizeTarget(target) {
	const slug = target.slug.trim();
	const ownerHandle = normalizeOwnerHandle(target.ownerHandle);
	const version = target.version.trim();
	return {
		slug,
		...ownerHandle ? { ownerHandle } : {},
		version
	};
}
function normalizeSlug(slug) {
	return slug.trim().toLowerCase();
}
function targetKey(target) {
	return `${target.ownerHandle ?? ""}\0${normalizeSlug(target.slug)}\0${target.version}`;
}
function legacyTargetKey(target) {
	return `${normalizeSlug(target.slug)}\0${target.version}`;
}
function partitionCompatibleBatches(targets) {
	const batches = [];
	for (const target of targets) {
		const legacyKey = legacyTargetKey(target);
		let batch = batches.find((candidate) => candidate.items.length < MAX_SECURITY_VERDICT_BATCH_SIZE && !candidate.legacyKeys.has(legacyKey));
		if (!batch) {
			batch = {
				items: [],
				legacyKeys: /* @__PURE__ */ new Set()
			};
			batches.push(batch);
		}
		batch.items.push(target);
		batch.legacyKeys.add(legacyKey);
	}
	return batches.map((batch) => batch.items);
}
function readOptionalStringField(value, field) {
	return normalizeOptionalString(asOptionalRecord(value)?.[field]);
}
function readOptionalNumberField(value, field) {
	return asFiniteNumber(asOptionalRecord(value)?.[field]);
}
function normalizeReason(reason) {
	return normalizeOptionalString(reason)?.toLowerCase() ?? "";
}
function hasOnlyNonSecurityVerifyReasons(reasons) {
	return reasons.length > 0 && reasons.every((reason) => NON_SECURITY_VERIFY_REASONS.has(normalizeReason(reason)));
}
function mapVerificationSecurity(verification, allowCleanCardOnlyPass) {
	const security = asOptionalRecord(verification.security);
	if (!security || Object.hasOwn(security, "passed")) return verification.security;
	const status = normalizeOptionalString(security.status) ?? normalizeOptionalString(security.rawStatus);
	const decisionPass = verification.ok && normalizeReason(verification.decision) === "pass";
	if (!status || !decisionPass && !allowCleanCardOnlyPass) return verification.security;
	return {
		...security,
		passed: true
	};
}
function mapVerificationToVerdict(params) {
	const skill = asOptionalRecord(params.verification.skill);
	const publisher = asOptionalRecord(params.verification.publisher);
	const versionRecord = asOptionalRecord(params.verification.version);
	const pageUrl = normalizeOptionalString(params.verification.pageUrl);
	const reasons = params.verification.reasons.map((reason) => normalizeOptionalString(reason)).filter((reason) => Boolean(reason));
	const securityStatus = normalizeReason(readOptionalStringField(params.verification.security, "status") ?? readOptionalStringField(params.verification.security, "rawStatus"));
	const cardOnlyCleanFailure = !params.verification.ok && securityStatus === "clean" && hasOnlyNonSecurityVerifyReasons(reasons);
	const verifiedVersion = normalizeOptionalString(params.verification.version) ?? readOptionalStringField(versionRecord, "version");
	return {
		ok: cardOnlyCleanFailure ? true : params.verification.ok,
		decision: cardOnlyCleanFailure ? "pass" : params.verification.decision,
		reasons: cardOnlyCleanFailure ? [] : reasons,
		requestedSlug: params.target.slug,
		requestedOwnerHandle: params.target.ownerHandle,
		requestedVersion: params.target.version,
		slug: normalizeOptionalString(params.verification.slug) ?? readOptionalStringField(skill, "slug"),
		version: verifiedVersion ?? (cardOnlyCleanFailure ? params.target.version : null),
		displayName: normalizeOptionalString(params.verification.displayName) ?? readOptionalStringField(skill, "displayName"),
		publisherHandle: normalizeOptionalString(params.verification.publisherHandle) ?? readOptionalStringField(publisher, "handle"),
		publisherDisplayName: normalizeOptionalString(params.verification.publisherDisplayName) ?? readOptionalStringField(publisher, "displayName"),
		createdAt: params.verification.createdAt ?? readOptionalNumberField(versionRecord, "createdAt") ?? null,
		checkedAt: readOptionalNumberField(params.verification.security, "checkedAt") ?? null,
		...pageUrl ? { skillUrl: pageUrl } : {},
		...pageUrl ? { securityAuditUrl: `${pageUrl}/security-audit?version=${encodeURIComponent(params.target.version)}` } : {},
		security: mapVerificationSecurity(params.verification, cardOnlyCleanFailure)
	};
}
function identityFailure(target, message) {
	return {
		ok: false,
		decision: "fail",
		reasons: ["security.identity_mismatch"],
		requestedSlug: target.slug,
		...target.ownerHandle ? { requestedOwnerHandle: target.ownerHandle } : {},
		requestedVersion: target.version,
		slug: null,
		version: null,
		publisherHandle: null,
		security: null,
		error: {
			code: "identity_mismatch",
			message
		}
	};
}
function validateVerdictIdentity(target, item) {
	const requestedSlug = normalizeOptionalString(item.requestedSlug)?.toLowerCase();
	if (requestedSlug !== normalizeSlug(target.slug)) return identityFailure(target, `ClawHub returned requested slug ${requestedSlug ?? "unknown"}.`);
	if (normalizeOptionalString(item.requestedVersion) !== target.version) return identityFailure(target, "ClawHub returned a different requested version.");
	const requestedOwnerHandle = normalizeOwnerHandle(item.requestedOwnerHandle);
	if (requestedOwnerHandle && requestedOwnerHandle !== target.ownerHandle) return identityFailure(target, `ClawHub returned requested owner ${requestedOwnerHandle}.`);
	const resolvedSlug = normalizeOptionalString(item.slug)?.toLowerCase();
	if (resolvedSlug && resolvedSlug !== normalizeSlug(target.slug)) return identityFailure(target, `ClawHub resolved skill ${resolvedSlug}.`);
	const resolvedVersion = normalizeOptionalString(item.version);
	if (resolvedVersion && resolvedVersion !== target.version) return identityFailure(target, `ClawHub resolved version ${resolvedVersion}.`);
	if (item.ok && resolvedVersion !== target.version) return identityFailure(target, "ClawHub did not return the exact requested version.");
	const publisherHandle = normalizeOwnerHandle(item.publisherHandle);
	if (target.ownerHandle && item.version !== null && publisherHandle !== target.ownerHandle) return identityFailure(target, `ClawHub resolved publisher ${publisherHandle ?? "unknown"}.`);
	return item;
}
function correlateBatchItems(targets, items) {
	if (items.length !== targets.length) throw new Error(`ClawHub skill security verdict request returned ${items.length} verdicts for ${targets.length} targets.`);
	const byKey = new Map(targets.map((target) => [targetKey(target), target]));
	const byLegacyKey = new Map(targets.map((target) => [legacyTargetKey(target), target]));
	const correlated = /* @__PURE__ */ new Map();
	for (const item of items) {
		const requestedSlug = normalizeOptionalString(item.requestedSlug)?.toLowerCase();
		const requestedVersion = normalizeOptionalString(item.requestedVersion);
		const requestedOwnerHandle = normalizeOwnerHandle(item.requestedOwnerHandle);
		if (!requestedSlug || !requestedVersion) throw new Error("ClawHub skill security verdict response omitted request identity.");
		const target = requestedOwnerHandle ? byKey.get(targetKey({
			slug: requestedSlug,
			ownerHandle: requestedOwnerHandle,
			version: requestedVersion
		})) : byLegacyKey.get(legacyTargetKey({
			slug: requestedSlug,
			version: requestedVersion
		}));
		if (!target || correlated.has(targetKey(target))) throw new Error("ClawHub skill security verdict response could not be correlated safely.");
		correlated.set(targetKey(target), item);
	}
	return correlated;
}
async function resolveOwnerQualifiedFallback(params) {
	return mapVerificationToVerdict({
		verification: await fetchClawHubSkillVerification({
			slug: params.target.slug,
			ownerHandle: params.target.ownerHandle,
			version: params.target.version,
			baseUrl: params.baseUrl,
			token: params.token,
			...params.skipAuth !== void 0 ? { skipAuth: params.skipAuth } : {},
			timeoutMs: params.timeoutMs
		}),
		target: params.target
	});
}
async function fetchExactClawHubSkillSecurityVerdicts(params) {
	const targets = params.items.map(normalizeTarget);
	const keys = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const key = targetKey(target);
		if (keys.has(key)) throw new Error("ClawHub skill security verdict request contains duplicate targets.");
		keys.add(key);
	}
	const resolved = /* @__PURE__ */ new Map();
	for (const batch of partitionCompatibleBatches(targets)) {
		const correlated = correlateBatchItems(batch, (await fetchClawHubSkillSecurityVerdicts({
			items: batch,
			baseUrl: params.baseUrl,
			token: params.token,
			...params.skipAuth !== void 0 ? { skipAuth: params.skipAuth } : {},
			timeoutMs: params.timeoutMs
		})).items);
		const fallbackLimit = pLimit(OWNER_QUALIFIED_FALLBACK_CONCURRENCY);
		const resolvedBatch = await Promise.all(batch.map(async (target) => {
			const key = targetKey(target);
			const item = correlated.get(key);
			if (!item) throw new Error("ClawHub skill security verdict response omitted a target.");
			const ownerHandle = target.ownerHandle;
			return [key, validateVerdictIdentity(target, ownerHandle && item.error?.code === "skill_not_found" ? await fallbackLimit(() => resolveOwnerQualifiedFallback({
				target: {
					...target,
					ownerHandle
				},
				baseUrl: params.baseUrl,
				token: params.token,
				...params.skipAuth !== void 0 ? { skipAuth: params.skipAuth } : {},
				timeoutMs: params.timeoutMs
			})) : item)];
		}));
		for (const [key, item] of resolvedBatch) resolved.set(key, item);
	}
	return targets.map((target) => {
		const item = resolved.get(targetKey(target));
		if (!item) throw new Error("ClawHub skill security verdict resolution omitted a target.");
		return item;
	});
}
//#endregion
//#region src/infra/clawhub-install-trust.ts
const CLAWHUB_TRUST_ERROR_CODE = {
	CLAWHUB_SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
	CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED: "clawhub_risk_acknowledgement_required",
	CLAWHUB_DOWNLOAD_BLOCKED: "clawhub_download_blocked"
};
const CLAWHUB_RISK_MODERATION_STATES = /* @__PURE__ */ new Set([
	"blocked",
	"quarantined",
	"revoked"
]);
const CLAWHUB_BLOCKING_MODERATION_STATES = /* @__PURE__ */ new Set([
	"blocked",
	"quarantined",
	"revoked"
]);
const CLAWHUB_SAFE_MODERATION_STATES = /* @__PURE__ */ new Set(["", "approved"]);
const CLAWHUB_NON_RISK_SCAN_STATUSES = /* @__PURE__ */ new Set([
	"pending",
	"scan_pending",
	"stale",
	"stale_scan"
]);
const CLAWHUB_NON_RISK_REASONS = /* @__PURE__ */ new Set([
	"pending",
	"pending_scan",
	"scan:pending",
	"scan_pending",
	"stale",
	"scan:stale",
	"stale_scan"
]);
const CLAWHUB_EVIDENCE_LABEL_WIDTH = 15;
const CLAWHUB_RAW_LINK_LABEL_WIDTH = 16;
function normalizeClawHubTrustToken(value) {
	return normalizeOptionalString(value)?.toLowerCase() ?? "";
}
function formatClawHubTrustStatus(label, token) {
	return token ? `${label} is ${token}` : `${label} is missing`;
}
function formatClawHubReasonCode(reason) {
	switch (normalizeClawHubTrustToken(reason)) {
		case "scan:malicious": return "malicious behavior detected";
		case "static:malicious": return "malicious behavior detected";
		case "payload_strings": return "suspicious payload strings";
		case "security.status_not_clean": return "security status is not clean";
		case "skill.not_found": return "skill was not found";
		case "version.not_found": return "skill version was not found";
		case "scan:pending":
		case "pending_scan":
		case "scan_pending": return "scan pending";
		case "scan:stale":
		case "stale_scan": return "scan data stale";
		default: return reason;
	}
}
function isPendingOrStaleTrustWarning(trust) {
	return trust.pending || trust.stale;
}
function isNonRiskScanStatus(trust, scanStatus) {
	return isPendingOrStaleTrustWarning(trust) && CLAWHUB_NON_RISK_SCAN_STATUSES.has(scanStatus);
}
function isNonRiskReason(trust, reason) {
	return isPendingOrStaleTrustWarning(trust) && CLAWHUB_NON_RISK_REASONS.has(reason);
}
function resolveClawHubRiskReasons(trust) {
	const reasons = [];
	if (trust.blockedFromDownload) reasons.push("Download disabled by ClawHub for this release");
	const scanStatus = normalizeClawHubTrustToken(trust.scanStatus);
	if (scanStatus !== "clean" && !isNonRiskScanStatus(trust, scanStatus)) reasons.push(formatClawHubTrustStatus("security scan status", scanStatus));
	const moderationState = normalizeClawHubTrustToken(trust.moderationState);
	if (CLAWHUB_RISK_MODERATION_STATES.has(moderationState) || !CLAWHUB_SAFE_MODERATION_STATES.has(moderationState)) reasons.push(formatClawHubTrustStatus("moderation state", moderationState));
	for (const reason of trust.reasons) {
		const normalized = normalizeClawHubTrustToken(reason);
		if (normalized && !isNonRiskReason(trust, normalized)) reasons.push(formatClawHubReasonCode(reason));
	}
	return reasons;
}
function resolveClawHubTrustStatusNotices(trust) {
	const notices = [];
	if (trust.pending) notices.push("security scan is pending");
	if (trust.stale) notices.push("scan data is stale");
	for (const reason of trust.reasons) {
		const normalized = normalizeClawHubTrustToken(reason);
		if (normalized && isNonRiskReason(trust, normalized)) notices.push(formatClawHubReasonCode(reason));
	}
	return notices;
}
function isBlockingClawHubTrust(trust) {
	if (trust.blockedFromDownload) return true;
	if (normalizeClawHubTrustToken(trust.scanStatus) === "malicious") return true;
	if (CLAWHUB_BLOCKING_MODERATION_STATES.has(normalizeClawHubTrustToken(trust.moderationState))) return true;
	return trust.reasons.some((reason) => {
		const normalized = normalizeClawHubTrustToken(reason);
		return normalized === "scan:malicious" || normalized === "static:malicious";
	});
}
function hasMaliciousClawHubTrustSignal(trust) {
	if (normalizeClawHubTrustToken(trust.scanStatus) === "malicious") return true;
	return trust.reasons.some((reason) => {
		const normalized = normalizeClawHubTrustToken(reason);
		return normalized === "scan:malicious" || normalized === "static:malicious";
	});
}
function assessClawHubTrust(trust) {
	const riskReasons = resolveClawHubRiskReasons(trust);
	const notices = resolveClawHubTrustStatusNotices(trust);
	if (riskReasons.length === 0 && notices.length === 0) return {
		disposition: "clean",
		riskReasons,
		notices
	};
	if (isBlockingClawHubTrust(trust)) return {
		disposition: "blocked",
		riskReasons,
		notices
	};
	if (riskReasons.length > 0) return {
		disposition: "review-required",
		riskReasons,
		notices
	};
	return {
		disposition: "review-recommended",
		riskReasons,
		notices
	};
}
function buildClawHubTrustInstallRecordFields(params) {
	const scanStatus = normalizeClawHubTrustToken(params.trust.scanStatus);
	const moderationState = normalizeClawHubTrustToken(params.trust.moderationState);
	const reasons = params.trust.reasons.map((reason) => normalizeOptionalString(reason)).filter((reason) => Boolean(reason));
	return {
		clawhubTrustDisposition: params.assessment.disposition,
		...scanStatus ? { clawhubTrustScanStatus: scanStatus } : {},
		...moderationState ? { clawhubTrustModerationState: moderationState } : {},
		...reasons.length > 0 ? { clawhubTrustReasons: reasons } : {},
		...params.trust.pending ? { clawhubTrustPending: true } : {},
		...params.trust.stale ? { clawhubTrustStale: true } : {},
		clawhubTrustCheckedAt: params.checkedAt,
		...params.acknowledgedAt ? { clawhubTrustAcknowledgedAt: params.acknowledgedAt } : {}
	};
}
function encodeClawHubPackagePath(packageName) {
	return packageName.split("/").map((part) => encodeURIComponent(part).replaceAll("%40", "@")).join("/");
}
function resolveClawHubSubjectUrl(params) {
	if (params.subject.kind === "skill" && params.subject.ownerHandle) return `${resolveClawHubBaseUrl(params.baseUrl)}/${encodeURIComponent(params.subject.ownerHandle)}/skills/${encodeURIComponent(params.subject.packageName)}`;
	const pathRoot = params.subject.kind === "skill" ? "skills" : "plugins";
	return `${resolveClawHubBaseUrl(params.baseUrl)}/${pathRoot}/${encodeClawHubPackagePath(params.subject.packageName)}`;
}
function resolveClawHubSecurityLinks(params) {
	const subjectUrl = resolveClawHubSubjectUrl(params);
	if (params.subject.kind === "skill") {
		const resolvedSubjectUrl = normalizeOptionalString(params.links?.subject) ?? subjectUrl;
		return {
			subject: resolvedSubjectUrl,
			security: normalizeOptionalString(params.links?.security) ?? `${resolvedSubjectUrl}/security-audit?version=${encodeURIComponent(params.version)}`
		};
	}
	return {
		subject: subjectUrl,
		clawscan: `${subjectUrl}/security/clawscan`
	};
}
function padRight(value, width) {
	return `${value}${" ".repeat(Math.max(0, width - visibleWidth(value)))}`;
}
function wrapWords(text, width) {
	if (visibleWidth(text) <= width) return [text];
	const words = text.split(/\s+/).filter(Boolean);
	const lines = [];
	let line = "";
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (visibleWidth(next) > width && line) {
			lines.push(line);
			line = word;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines;
}
function resolveClawHubTrustAccent(disposition) {
	switch (disposition) {
		case "blocked": return theme.error;
		case "review-required": return theme.warn;
		case "review-recommended": return theme.info;
		case "clean": return theme.success;
	}
	return theme.info;
}
function formatClawHubEvidenceLine(params) {
	const label = sanitizeTerminalText(params.label).replace(/:$/u, "");
	return `${theme.muted(`• ${padRight(label, CLAWHUB_EVIDENCE_LABEL_WIDTH)}`)} ${params.accent(params.value)}`;
}
function renderClawHubTrustBox(title, lines, disposition) {
	const accent = resolveClawHubTrustAccent(disposition);
	const columns = Math.max(72, Math.min(process.stdout.columns ?? 88, 104));
	const innerWidth = Math.max(54, Math.min(columns - 4, 78));
	const borderWidth = innerWidth + 4 - 2;
	const titleSegment = `─ ${title} `;
	const titleFillWidth = Math.max(0, borderWidth - visibleWidth(titleSegment));
	const top = accent(`╭${titleSegment}${"─".repeat(titleFillWidth)}╮`);
	const bottom = accent(`╰${"─".repeat(borderWidth)}╯`);
	return [
		top,
		...lines.flatMap((line) => {
			if (line === "") return [`${accent("│")} ${" ".repeat(innerWidth)} ${accent("│")}`];
			return wrapWords(line, innerWidth).map((wrapped) => `${accent("│")} ${padRight(wrapped, innerWidth)} ${accent("│")}`);
		}),
		bottom
	].join("\n");
}
function formatLinkedClawHubValue(params) {
	const label = sanitizeTerminalText(params.label);
	return formatTerminalLink(label, sanitizeTerminalText(params.url), {
		fallback: label,
		...params.terminalLinks !== void 0 ? { force: params.terminalLinks } : {}
	});
}
function formatClawHubTrustEvidenceLines(params) {
	const lines = [];
	const accent = resolveClawHubTrustAccent(params.assessment.disposition);
	const securityLink = "clawscan" in params.links ? params.links.clawscan : params.links.security;
	const addLine = (label, value) => {
		lines.push(formatClawHubEvidenceLine({
			label,
			value,
			accent
		}));
	};
	const linked = (label, url) => formatLinkedClawHubValue({
		label,
		url,
		terminalLinks: params.terminalLinks
	});
	const scanStatus = normalizeClawHubTrustToken(params.trust.scanStatus);
	if (scanStatus) addLine("Security scan:", linked(scanStatus, securityLink));
	const moderationState = normalizeClawHubTrustToken(params.trust.moderationState);
	if (moderationState && !CLAWHUB_SAFE_MODERATION_STATES.has(moderationState)) addLine("Moderation:", sanitizeTerminalText(moderationState));
	for (const reason of params.trust.reasons) {
		const normalized = normalizeClawHubTrustToken(reason);
		if (!normalized) continue;
		if (params.assessment.disposition === "review-recommended" && isNonRiskReason(params.trust, normalized)) continue;
		switch (normalized) {
			case "scan:malicious":
				addLine("Scanner:", linked("malicious behavior detected", securityLink));
				break;
			case "static:malicious":
				addLine("Scanner:", linked("malicious behavior detected", securityLink));
				break;
			case "payload_strings":
				addLine("Finding:", linked("suspicious payload strings", securityLink));
				break;
			default:
				addLine("Finding:", sanitizeTerminalText(formatClawHubReasonCode(reason)));
				break;
		}
	}
	if (params.assessment.disposition === "review-recommended") for (const notice of params.assessment.notices) addLine("Status:", sanitizeTerminalText(notice));
	if (params.trust.blockedFromDownload) addLine("Finding:", "Download disabled by ClawHub for this release");
	if (lines.length === 0) for (const reason of params.assessment.riskReasons) addLine("Finding:", sanitizeTerminalText(reason));
	return lines;
}
function formatClawHubRawLinkLine(label, url) {
	return `  ${theme.muted(padRight(label, CLAWHUB_RAW_LINK_LABEL_WIDTH))} ${theme.info(sanitizeTerminalText(url))}`;
}
function formatClawHubRawLinks(params) {
	const subjectUrl = sanitizeTerminalText(params.links.subject);
	if ("security" in params.links) return [
		"",
		"Links:",
		formatClawHubRawLinkLine("Skill", subjectUrl),
		formatClawHubRawLinkLine("Security details", params.links.security)
	].join("\n");
	return [
		"",
		"Links:",
		formatClawHubRawLinkLine("Plugin", subjectUrl),
		formatClawHubRawLinkLine("Security scan", params.links.clawscan)
	].join("\n");
}
function formatClawHubTrustWarning(params) {
	const links = resolveClawHubSecurityLinks({
		baseUrl: params.baseUrl,
		subject: params.subject,
		version: params.version,
		links: params.links
	});
	const evidenceLines = formatClawHubTrustEvidenceLines({
		trust: params.trust,
		assessment: params.assessment,
		links,
		terminalLinks: params.terminalLinks
	});
	const noun = params.subject.kind;
	if (params.assessment.disposition === "blocked") {
		const malicious = hasMaliciousClawHubTrustSignal(params.trust);
		const blockedActionLines = params.mode === "update" ? malicious ? [`Latest ${noun} version is marked malicious; OpenClaw will not download it.`, `Uninstall the installed ${noun} unless you have independently reviewed it.`] : [`Latest ${noun} version is blocked by ClawHub; OpenClaw will not download it.`] : [`OpenClaw will not install this ${noun} release from ClawHub.`];
		return [
			renderClawHubTrustBox(malicious ? "BLOCKED - ClawHub flagged this release as malicious" : "BLOCKED - ClawHub blocked this release", [
				...evidenceLines,
				"",
				...blockedActionLines,
				"Review the ClawHub security details or contact the package maintainer if you believe this is wrong."
			], params.assessment.disposition),
			formatClawHubRawLinks({
				subject: params.subject,
				links
			}),
			...params.subject.kind === "skill" && malicious && params.mode === "update" ? [`Remove installed skill: clawhub --workdir ${quoteCliArg(sanitizeTerminalText(params.subject.workspaceDir))} uninstall ${quoteCliArg(sanitizeTerminalText(formatClawHubSubjectPackageName(params.subject)))}`] : []
		].join("\n");
	}
	if (params.assessment.disposition === "review-required") {
		const riskContext = params.subject.kind === "plugin" ? "This plugin is not marked malicious, but ClawHub found security findings or a large local system blast radius." : "This skill is not marked malicious, but ClawHub found security findings or a large instruction/tool-use blast radius.";
		return [renderClawHubTrustBox("WARNING - ClawHub found security risks in this release", [
			...evidenceLines,
			"",
			riskContext,
			`Review the ClawHub security details before ${params.mode === "update" ? "updating" : "installing"}.`
		], params.assessment.disposition), formatClawHubRawLinks({
			subject: params.subject,
			links
		})].join("\n");
	}
	return [renderClawHubTrustBox("REVIEW RECOMMENDED - ClawHub has not completed a fresh clean check", [
		...evidenceLines,
		"",
		`This does not mean the ${noun} is malicious, but ClawHub has not completed a clean security check for this release yet.`,
		`Review the ClawHub security details before ${params.mode === "update" ? "updating" : "installing"}.`
	], params.assessment.disposition), formatClawHubRawLinks({
		subject: params.subject,
		links
	})].join("\n");
}
function formatClawHubReleaseLabel(packageName, version) {
	return `${sanitizeTerminalText(packageName)}@${sanitizeTerminalText(version)}`;
}
function formatClawHubSubjectPackageName(subject) {
	return subject.kind === "skill" && subject.ownerHandle ? `@${subject.ownerHandle}/${subject.packageName}` : subject.packageName;
}
function formatClawHubSubjectReleaseLabel(subject, version) {
	return formatClawHubReleaseLabel(formatClawHubSubjectPackageName(subject), version);
}
function validateClawHubSecurityIdentity(params) {
	const packageLabel = params.packageLabel ?? params.packageName;
	const responsePackageName = normalizeOptionalString(params.security.package?.name);
	if (responsePackageName !== params.packageName) return {
		ok: false,
		error: `ClawHub release trust check for "${formatClawHubReleaseLabel(packageLabel, params.version)}" returned package "${sanitizeTerminalText(responsePackageName ?? "unknown")}".`,
		code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
		version: params.version
	};
	const responseVersion = normalizeOptionalString(params.security.release?.version);
	if (responseVersion !== params.version) return {
		ok: false,
		error: `ClawHub release trust check for "${formatClawHubReleaseLabel(packageLabel, params.version)}" returned version "${sanitizeTerminalText(responseVersion ?? "unknown")}".`,
		code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
		version: params.version
	};
	return null;
}
function readSkillVerdictSecurityStatus(item) {
	if (!item.security || typeof item.security !== "object") return;
	const security = item.security;
	if (typeof security.status === "string") return security.status;
	return typeof security.rawStatus === "string" ? security.rawStatus : void 0;
}
function readSkillVerdictSecurityPassed(item) {
	if (!item.security || typeof item.security !== "object") return;
	const passed = item.security.passed;
	return typeof passed === "boolean" ? passed : void 0;
}
function hasUsablePassingSkillVerdictSecurity(item) {
	return Boolean(readSkillVerdictSecurityStatus(item)) && readSkillVerdictSecurityPassed(item) === true;
}
function hasSkillVerdictSecurityError(item) {
	return Boolean(item.error?.code || item.error?.message || item.version === null);
}
function isSkillVerdictPendingReason(reason) {
	const normalized = normalizeClawHubTrustToken(reason);
	return normalized === "pending" || normalized === "pending_scan" || normalized === "scan_pending";
}
function isSkillVerdictStaleReason(reason) {
	const normalized = normalizeClawHubTrustToken(reason);
	return normalized === "stale" || normalized === "scan:stale" || normalized === "stale_scan";
}
function isSkillVerdictBlockingReason(reason) {
	const normalized = normalizeClawHubTrustToken(reason);
	return normalized.includes("malicious") || normalized.includes("malware") || normalized.endsWith("_blocked") || normalized.endsWith(".blocked") || normalized === "blocked";
}
function mapSkillSecurityVerdictToPackageSecurity(params) {
	const responseSlug = normalizeOptionalString(params.item.slug ?? params.item.requestedSlug);
	if (responseSlug !== params.packageName) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned skill "${sanitizeTerminalText(responseSlug ?? "unknown")}".`);
	const responsePublisher = normalizeOptionalString(params.item.publisherHandle);
	if (params.ownerHandle && responsePublisher !== params.ownerHandle) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned publisher "${sanitizeTerminalText(responsePublisher ?? "unknown")}", expected "${sanitizeTerminalText(params.ownerHandle)}".`);
	const responseVersion = normalizeOptionalString(params.item.version);
	if (responseVersion !== params.version) {
		const reason = params.item.error?.message ? `: ${sanitizeTerminalText(params.item.error.message)}` : "";
		throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned version "${sanitizeTerminalText(responseVersion ?? "unknown")}"${reason}.`);
	}
	if (hasSkillVerdictSecurityError(params.item)) {
		const reason = params.item.error?.message ? `: ${sanitizeTerminalText(params.item.error.message)}` : "";
		throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return a usable security verdict${reason}.`);
	}
	const decision = normalizeClawHubTrustToken(params.item.decision);
	if (params.item.ok && decision === "pass" && !hasUsablePassingSkillVerdictSecurity(params.item)) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return a usable security verdict.`);
	const securityStatus = normalizeClawHubTrustToken(readSkillVerdictSecurityStatus(params.item));
	const securityPassed = readSkillVerdictSecurityPassed(params.item);
	const reasons = params.item.reasons.map((reason) => normalizeOptionalString(reason)).filter((reason) => Boolean(reason));
	const securityPassedAllowsInstall = securityPassed ?? true;
	const verdictPassed = params.item.ok && decision === "pass" && securityPassedAllowsInstall;
	const scanStatus = verdictPassed ? securityStatus || "clean" : securityStatus && securityStatus !== "clean" ? securityStatus : "suspicious";
	if (!verdictPassed && reasons.length === 0) reasons.push(decision ? `decision:${decision}` : "decision:fail");
	const hasBlockingReason = reasons.some(isSkillVerdictBlockingReason);
	const displayName = normalizeOptionalString(params.item.displayName);
	return {
		package: {
			name: params.packageName,
			family: "skill",
			...displayName ? { displayName } : {}
		},
		release: { version: params.version },
		trust: {
			scanStatus,
			moderationState: null,
			blockedFromDownload: decision === "blocked" || securityStatus === "malicious" || hasBlockingReason,
			reasons,
			pending: securityStatus === "pending" || reasons.some(isSkillVerdictPendingReason),
			stale: securityStatus === "stale" || reasons.some(isSkillVerdictStaleReason)
		}
	};
}
function resolveSkillSecurityLinks(item) {
	const subject = normalizeOptionalString(item.skillUrl);
	const security = normalizeOptionalString(item.securityAuditUrl);
	if (!subject && !security) return;
	return {
		...subject ? { subject } : {},
		...security ? { security } : {}
	};
}
async function fetchClawHubSubjectSecurity(params) {
	if (params.subject.kind === "plugin") return { security: await fetchClawHubPackageSecurity({
		name: params.subject.packageName,
		version: params.version,
		baseUrl: params.baseUrl,
		token: params.token,
		timeoutMs: params.timeoutMs
	}) };
	const [item] = await fetchExactClawHubSkillSecurityVerdicts({
		items: [{
			slug: params.subject.packageName,
			...params.subject.ownerHandle ? { ownerHandle: params.subject.ownerHandle } : {},
			version: params.version
		}],
		baseUrl: params.baseUrl,
		token: params.token,
		timeoutMs: params.timeoutMs
	});
	if (!item) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.subject.packageName, params.version)}" returned no verdict.`);
	return {
		security: mapSkillSecurityVerdictToPackageSecurity({
			item,
			packageName: params.subject.packageName,
			...params.subject.ownerHandle ? { ownerHandle: params.subject.ownerHandle } : {},
			version: params.version
		}),
		links: resolveSkillSecurityLinks(item)
	};
}
async function ensureClawHubPackageTrustAcknowledged(params) {
	let trust;
	let warningLinks;
	const packageLabel = formatClawHubSubjectPackageName(params.subject);
	const releaseLabel = formatClawHubSubjectReleaseLabel(params.subject, params.version);
	try {
		const fetchedSecurity = await fetchClawHubSubjectSecurity({
			subject: params.subject,
			version: params.version,
			baseUrl: params.baseUrl,
			token: params.token,
			timeoutMs: params.timeoutMs
		});
		const identityFailure = validateClawHubSecurityIdentity({
			security: fetchedSecurity.security,
			packageName: params.subject.packageName,
			packageLabel,
			version: params.version
		});
		if (identityFailure) return identityFailure;
		trust = fetchedSecurity.security.trust;
		warningLinks = fetchedSecurity.links;
	} catch (error) {
		return {
			ok: false,
			error: `ClawHub release trust check failed for "${releaseLabel}": ${sanitizeTerminalText(formatErrorMessage(error))}`,
			code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
			version: params.version
		};
	}
	const assessment = assessClawHubTrust(trust);
	const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
	const acceptTrust = (opts) => ({
		ok: true,
		trustInstallRecordFields: buildClawHubTrustInstallRecordFields({
			trust,
			assessment,
			checkedAt,
			...opts?.acknowledgedAt ? { acknowledgedAt: opts.acknowledgedAt } : {}
		}),
		...opts?.warning ? { warning: opts.warning } : {}
	});
	if (assessment.disposition === "clean") return acceptTrust();
	const terminalWarning = formatClawHubTrustWarning({
		baseUrl: params.baseUrl,
		subject: params.subject,
		version: params.version,
		trust,
		assessment,
		mode: params.mode,
		terminalLinks: params.logger?.terminalLinks,
		links: warningLinks
	});
	const warning = stripAnsi(formatClawHubTrustWarning({
		baseUrl: params.baseUrl,
		subject: params.subject,
		version: params.version,
		trust,
		assessment,
		mode: params.mode,
		terminalLinks: false,
		links: warningLinks
	}));
	params.logger?.warn?.(terminalWarning);
	if (assessment.disposition === "review-recommended") return acceptTrust({ warning });
	if (assessment.disposition === "blocked") return {
		ok: false,
		error: `ClawHub blocked this release; ${params.mode === "update" ? "update" : "install"} was not started.`,
		code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED,
		warning,
		version: params.version
	};
	if (params.acknowledgeClawHubRisk) return acceptTrust({
		acknowledgedAt: (/* @__PURE__ */ new Date()).toISOString(),
		warning
	});
	if (params.onClawHubRisk ? await params.onClawHubRisk({
		packageName: packageLabel,
		version: params.version,
		trust,
		acknowledgementKind: assessment.disposition === "review-required" ? "type-package" : "confirm",
		warning
	}) : false) return acceptTrust({
		acknowledgedAt: (/* @__PURE__ */ new Date()).toISOString(),
		warning
	});
	return {
		ok: false,
		error: `${params.mode === "update" ? "Update" : "Install"} cancelled; rerun with --acknowledge-clawhub-risk to continue after reviewing the warning.`,
		code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED,
		warning,
		version: params.version
	};
}
//#endregion
export { CLAWHUB_SKILLS_SH_TRUST_STATE as a, fetchClawHubSkillInstallResolution as c, searchClawHubSkills as d, CLAWHUB_SKILLS_SH_TRUST_LABEL as i, fetchClawHubSkillVerification as l, ensureClawHubPackageTrustAcknowledged as n, fetchClawHubSkillCard as o, fetchExactClawHubSkillSecurityVerdicts as r, fetchClawHubSkillDetail as s, CLAWHUB_TRUST_ERROR_CODE as t, reportClawHubSkillInstallTelemetry as u };
