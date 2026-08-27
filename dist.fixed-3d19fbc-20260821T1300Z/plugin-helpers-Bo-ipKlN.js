import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { p as readProviderJsonResponse } from "./provider-http-errors-DwYSuIHs.js";
import { p as readPositiveIntegerParam } from "./common-ciEJghJz.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./provider-http-D7FntVgP.js";
import "./channel-actions-Ht8PCq9o.js";
import { f as resolveMeetingInput, s as loadGoogleMeetCliModule } from "./plugin-registration-BlhjS8WR.js";
import { t as googleApiError } from "./google-api-errors-Xu7AWsyv.js";
import { t as normalizeMeetUrl } from "./meet-url-BFzOgGVD.js";
import { n as fetchGoogleMeetArtifacts, o as fetchGoogleMeetSpace, r as fetchGoogleMeetAttendance } from "./meet-BnCCrJG_.js";
//#region extensions/google-meet/src/calendar.ts
const GOOGLE_CALENDAR_API_BASE_URL = "https://www.googleapis.com/calendar/v3";
const GOOGLE_CALENDAR_API_HOST = "www.googleapis.com";
const GOOGLE_CALENDAR_EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
const GOOGLE_CALENDAR_REQUEST_TIMEOUT_MS = 3e4;
function appendQuery(url, query) {
	const parsed = new URL(url);
	for (const [key, value] of Object.entries(query)) if (value !== void 0) parsed.searchParams.set(key, String(value));
	return parsed.toString();
}
function normalizeGoogleMeetCalendarUri(value) {
	if (!value?.trim()) return;
	try {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:") return;
		if (url.hostname.toLowerCase() !== "meet.google.com" || url.port || url.username || url.password) return;
		url.protocol = "https:";
		return normalizeMeetUrl(url.toString());
	} catch {
		return;
	}
}
function extractGoogleMeetUriFromText(value) {
	const matches = value?.matchAll(/https:\/\/meet\.google\.com\/[a-z0-9-]+/gi);
	for (const match of matches ?? []) {
		const uri = normalizeGoogleMeetCalendarUri(match[0]);
		if (uri) return uri;
	}
}
function findFirstGoogleMeetCalendarUri(entryPoints, predicate = () => true) {
	for (const entry of entryPoints) {
		if (!predicate(entry)) continue;
		const uri = normalizeGoogleMeetCalendarUri(entry.uri);
		if (uri) return uri;
	}
}
function extractGoogleMeetUriFromCalendarEvent(event) {
	const hangoutLink = normalizeGoogleMeetCalendarUri(event.hangoutLink);
	if (hangoutLink) return hangoutLink;
	const entryPoints = event.conferenceData?.entryPoints ?? [];
	const videoEntryUri = findFirstGoogleMeetCalendarUri(entryPoints, (entry) => entry.entryPointType === "video");
	if (videoEntryUri) return videoEntryUri;
	const meetEntryUri = findFirstGoogleMeetCalendarUri(entryPoints);
	if (meetEntryUri) return meetEntryUri;
	return extractGoogleMeetUriFromText(event.location) ?? extractGoogleMeetUriFromText(event.description);
}
function buildGoogleMeetCalendarDayWindow(now = /* @__PURE__ */ new Date()) {
	const start = new Date(now);
	start.setHours(0, 0, 0, 0);
	const end = new Date(start);
	end.setDate(start.getDate() + 1);
	return {
		timeMin: start.toISOString(),
		timeMax: end.toISOString()
	};
}
function parseCalendarEventTime(value) {
	const raw = value?.dateTime ?? value?.date;
	if (!raw) return;
	const parsed = Date.parse(raw);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function rankCalendarEvent(event, nowMs) {
	const startMs = parseCalendarEventTime(event.start) ?? Number.POSITIVE_INFINITY;
	const endMs = parseCalendarEventTime(event.end) ?? startMs;
	if (startMs <= nowMs && endMs >= nowMs) return 0;
	if (startMs > nowMs) return startMs - nowMs;
	return nowMs - startMs + 720 * 60 * 60 * 1e3;
}
function chooseBestMeetCalendarEvent(events, now) {
	const nowMs = now.getTime();
	let selected;
	let selectedRank = Number.POSITIVE_INFINITY;
	for (const event of events) {
		if (event.status === "cancelled" || !extractGoogleMeetUriFromCalendarEvent(event)) continue;
		const rank = rankCalendarEvent(event, nowMs);
		if (!selected || rank < selectedRank) {
			selected = event;
			selectedRank = rank;
		}
	}
	return selected;
}
async function fetchGoogleCalendarEvents(params) {
	const calendarId = params.calendarId?.trim() || "primary";
	const now = params.now ?? /* @__PURE__ */ new Date();
	const defaultTimeMax = new Date(now);
	defaultTimeMax.setDate(defaultTimeMax.getDate() + 7);
	const { response, release } = await fetchWithSsrFGuard({
		url: appendQuery(`${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events`, {
			maxResults: params.maxResults ?? 50,
			orderBy: "startTime",
			q: params.eventQuery?.trim() || void 0,
			showDeleted: false,
			singleEvents: true,
			timeMin: params.timeMin ?? now.toISOString(),
			timeMax: params.timeMax ?? defaultTimeMax.toISOString()
		}),
		init: { headers: {
			Authorization: `Bearer ${params.accessToken}`,
			Accept: "application/json"
		} },
		policy: { allowedHostnames: [GOOGLE_CALENDAR_API_HOST] },
		auditContext: "google-meet.calendar.events.list",
		timeoutMs: GOOGLE_CALENDAR_REQUEST_TIMEOUT_MS
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: "Google Calendar events.list",
			scopes: [GOOGLE_CALENDAR_EVENTS_SCOPE]
		});
		const payload = await readProviderJsonResponse(response, "Google Calendar events.list");
		if (payload.items !== void 0 && !Array.isArray(payload.items)) throw new Error("Google Calendar events.list response had non-array items");
		return {
			calendarId,
			events: payload.items ?? [],
			now
		};
	} finally {
		await release();
	}
}
async function listGoogleMeetCalendarEvents(params) {
	const { calendarId, events, now } = await fetchGoogleCalendarEvents(params);
	const best = chooseBestMeetCalendarEvent(events, now);
	return {
		calendarId,
		events: events.map((event) => {
			const meetingUri = extractGoogleMeetUriFromCalendarEvent(event);
			return meetingUri ? {
				event,
				meetingUri,
				selected: event === best
			} : void 0;
		}).filter((event) => Boolean(event))
	};
}
async function findGoogleMeetCalendarEvent(params) {
	const result = await listGoogleMeetCalendarEvents(params);
	const selected = result.events.find((event) => event.selected) ?? result.events[0];
	if (!selected) throw new Error("No Google Calendar event with a Google Meet link matched the query");
	return {
		calendarId: result.calendarId,
		event: selected.event,
		meetingUri: selected.meetingUri
	};
}
//#endregion
//#region extensions/google-meet/src/plugin-helpers.ts
const loadGoogleMeetCreateModule = createLazyRuntimeModule(() => import("./create-C2dG6tXk.js"));
async function createMeetFromParams(params) {
	return (await loadGoogleMeetCreateModule()).createMeetFromParams(params);
}
async function createAndJoinMeetFromParams(params) {
	return (await loadGoogleMeetCreateModule()).createAndJoinMeetFromParams(params);
}
async function resolveGoogleMeetTokenFromParams(config, raw) {
	const { resolveGoogleMeetAccessToken } = await import("./oauth-CIQfUqGP.js");
	return resolveGoogleMeetAccessToken({
		clientId: normalizeOptionalString(raw.clientId) ?? config.oauth.clientId,
		clientSecret: normalizeOptionalString(raw.clientSecret) ?? config.oauth.clientSecret,
		refreshToken: normalizeOptionalString(raw.refreshToken) ?? config.oauth.refreshToken,
		accessToken: normalizeOptionalString(raw.accessToken) ?? config.oauth.accessToken,
		expiresAt: typeof raw.expiresAt === "number" ? raw.expiresAt : config.oauth.expiresAt
	});
}
function wantsCalendarLookup(raw) {
	return raw.today === true || Boolean(normalizeOptionalString(raw.event));
}
async function resolveMeetingFromParams(params) {
	if (wantsCalendarLookup(params.raw)) {
		const window = params.raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
		const calendarEvent = await findGoogleMeetCalendarEvent({
			accessToken: params.accessToken,
			calendarId: normalizeOptionalString(params.raw.calendarId),
			eventQuery: normalizeOptionalString(params.raw.event),
			...window
		});
		return {
			meeting: calendarEvent.meetingUri,
			calendarEvent
		};
	}
	return { meeting: resolveMeetingInput(params.config, params.raw.meeting) };
}
async function resolveSpaceFromParams(config, raw) {
	const token = await resolveGoogleMeetTokenFromParams(config, raw);
	const { meeting, calendarEvent } = await resolveMeetingFromParams({
		config,
		raw,
		accessToken: token.accessToken
	});
	return {
		meeting,
		token,
		space: await fetchGoogleMeetSpace({
			accessToken: token.accessToken,
			meeting
		}),
		calendarEvent
	};
}
async function resolveArtifactQueryFromParams(config, raw) {
	const meeting = normalizeOptionalString(raw.meeting) ?? config.defaults.meeting;
	const conferenceRecord = normalizeOptionalString(raw.conferenceRecord);
	const token = await resolveGoogleMeetTokenFromParams(config, raw);
	const resolvedMeeting = conferenceRecord ? { meeting } : wantsCalendarLookup(raw) ? await resolveMeetingFromParams({
		config,
		raw,
		accessToken: token.accessToken
	}) : { meeting };
	if (!resolvedMeeting.meeting && !conferenceRecord) throw new Error("Meeting input, calendar lookup, or conferenceRecord required");
	return {
		token,
		meeting: resolvedMeeting.meeting,
		calendarEvent: resolvedMeeting.calendarEvent,
		conferenceRecord,
		pageSize: readPositiveIntegerParam(raw, "pageSize"),
		includeTranscriptEntries: raw.includeTranscriptEntries !== false,
		includeDocumentBodies: raw.includeDocumentBodies === true,
		allConferenceRecords: raw.includeAllConferenceRecords === true,
		mergeDuplicateParticipants: raw.mergeDuplicateParticipants !== false,
		lateAfterMinutes: readPositiveIntegerParam(raw, "lateAfterMinutes"),
		earlyBeforeMinutes: readPositiveIntegerParam(raw, "earlyBeforeMinutes")
	};
}
function fetchResolvedGoogleMeetArtifacts(query) {
	return fetchGoogleMeetArtifacts({
		accessToken: query.token.accessToken,
		meeting: query.meeting,
		conferenceRecord: query.conferenceRecord,
		pageSize: query.pageSize,
		includeTranscriptEntries: query.includeTranscriptEntries,
		includeDocumentBodies: query.includeDocumentBodies,
		allConferenceRecords: query.allConferenceRecords
	});
}
function fetchResolvedGoogleMeetAttendance(query) {
	return fetchGoogleMeetAttendance({
		accessToken: query.token.accessToken,
		meeting: query.meeting,
		conferenceRecord: query.conferenceRecord,
		pageSize: query.pageSize,
		allConferenceRecords: query.allConferenceRecords,
		mergeDuplicateParticipants: query.mergeDuplicateParticipants,
		lateAfterMinutes: query.lateAfterMinutes,
		earlyBeforeMinutes: query.earlyBeforeMinutes
	});
}
async function exportGoogleMeetBundleFromParams(config, raw) {
	const resolved = await resolveArtifactQueryFromParams(config, raw);
	const [artifacts, attendance] = await Promise.all([fetchResolvedGoogleMeetArtifacts(resolved), fetchResolvedGoogleMeetAttendance(resolved)]);
	const { buildGoogleMeetExportManifest, googleMeetExportFileNames, writeMeetExportBundle } = await loadGoogleMeetCliModule();
	const calendarId = normalizeOptionalString(raw.calendarId);
	const request = {
		...resolved.meeting ? { meeting: resolved.meeting } : {},
		...resolved.conferenceRecord ? { conferenceRecord: resolved.conferenceRecord } : {},
		...resolved.calendarEvent?.event.id ? { calendarEventId: resolved.calendarEvent.event.id } : {},
		...resolved.calendarEvent?.event.summary ? { calendarEventSummary: resolved.calendarEvent.event.summary } : {},
		...calendarId ? { calendarId } : {},
		...resolved.pageSize !== void 0 ? { pageSize: resolved.pageSize } : {},
		includeTranscriptEntries: resolved.includeTranscriptEntries,
		includeDocumentBodies: resolved.includeDocumentBodies,
		allConferenceRecords: resolved.allConferenceRecords,
		mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
		...resolved.lateAfterMinutes !== void 0 ? { lateAfterMinutes: resolved.lateAfterMinutes } : {},
		...resolved.earlyBeforeMinutes !== void 0 ? { earlyBeforeMinutes: resolved.earlyBeforeMinutes } : {}
	};
	const tokenSource = resolved.token.refreshed ? "refresh-token" : "cached-access-token";
	if (raw.dryRun === true) return {
		dryRun: true,
		manifest: buildGoogleMeetExportManifest({
			artifacts,
			attendance,
			files: googleMeetExportFileNames(),
			request,
			tokenSource,
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
		}),
		...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
		tokenSource
	};
	const outputDir = normalizeOptionalString(raw.outputDir) ?? normalizeOptionalString(raw.output);
	return {
		...await writeMeetExportBundle({
			...outputDir ? { outputDir } : {},
			artifacts,
			attendance,
			zip: raw.zip === true,
			request,
			tokenSource,
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
		}),
		...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
		tokenSource
	};
}
//#endregion
export { fetchResolvedGoogleMeetAttendance as a, resolveMeetingFromParams as c, listGoogleMeetCalendarEvents as d, fetchResolvedGoogleMeetArtifacts as i, resolveSpaceFromParams as l, createMeetFromParams as n, resolveArtifactQueryFromParams as o, exportGoogleMeetBundleFromParams as r, resolveGoogleMeetTokenFromParams as s, createAndJoinMeetFromParams as t, buildGoogleMeetCalendarDayWindow as u };
