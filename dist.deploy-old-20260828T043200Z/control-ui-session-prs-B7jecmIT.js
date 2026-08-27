import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { d as runGit } from "./git-CsWoUZAt.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { h as resolveGitHubApiCredentialScope, n as ControlUiGitHubError, p as readOptionalGitHubString, r as GITHUB_API_ORIGIN, s as fetchGitHubJson, u as optionalNumber } from "./control-ui-github-api-DURS8eJ_.js";
import { r as parseGitHubRemoteUrl, t as resolveGitHubForkParent } from "./github-repository-target-Bww88SjZ.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/control-ui-session-prs-landing.ts
async function gitOutput(cwd, args) {
	try {
		const result = await runGit(cwd, args);
		return result.code === 0 ? result.stdout.trim() || null : null;
	} catch {
		return null;
	}
}
async function isAncestor(root, ancestor, descendant) {
	try {
		return (await runGit(root, [
			"merge-base",
			"--is-ancestor",
			ancestor,
			descendant
		])).code === 0;
	} catch {
		return false;
	}
}
/**
* Picks the newest of the known-published baseline candidates. Two candidates
* (the dominant case) stay a single ancestry call; larger sets batch through
* one `merge-base --independent`. Among incomparable maxima, a candidate
* containing the first entry (the merge base) is preferred — any such pick is
* sound because it covers everything the merge base covers — and otherwise
* the earliest candidate wins, keeping the merge base as the safe default.
*/
async function maximalCommit(root, candidates) {
	const unique = [...new Set(candidates)];
	const first = unique[0];
	if (first === void 0) return null;
	if (unique.length === 1) return first;
	const second = unique[1];
	if (unique.length === 2 && second !== void 0) return await isAncestor(root, first, second) ? second : first;
	const out = await gitOutput(root, [
		"merge-base",
		"--independent",
		...unique
	]);
	if (!out) return first;
	const independent = new Set(out.split("\n").map((line) => line.trim()).filter(Boolean));
	if (independent.has(first)) return first;
	for (const candidate of unique.slice(1)) if (independent.has(candidate) && await isAncestor(root, first, candidate)) return candidate;
	return unique.find((candidate) => independent.has(candidate)) ?? first;
}
async function resolveBranchLanding(root, params) {
	const pushedSha = await gitOutput(root, [
		"rev-parse",
		"--verify",
		"--quiet",
		`refs/remotes/origin/${params.branch}`
	]);
	const headSha = await gitOutput(root, ["rev-parse", "HEAD"]);
	const defaultRef = params.defaultBranch ? `refs/remotes/origin/${params.defaultBranch}` : null;
	const landedHeads = [];
	for (const head of params.mergedHeads) if (head.baseRef === params.defaultBranch) landedHeads.push(head);
	else if (defaultRef && head.mergeCommitSha && await isAncestor(root, head.mergeCommitSha, defaultRef)) landedHeads.push(head);
	const landedShas = landedHeads.map((head) => head.sha);
	const mergeBase = defaultRef ? await gitOutput(root, [
		"merge-base",
		defaultRef,
		"HEAD"
	]) : null;
	const baselines = mergeBase ? [mergeBase] : [];
	if (headSha) {
		for (const merged of landedShas) if (await isAncestor(root, merged, headSha)) baselines.push(merged);
		else if (await isAncestor(root, headSha, merged)) baselines.push(headSha);
	}
	const statsBase = await maximalCommit(root, baselines);
	let provenNewPushedWork = false;
	if (pushedSha && mergeBase && !landedShas.includes(pushedSha.toLowerCase())) {
		provenNewPushedWork = landedHeads.length > 0;
		for (const head of landedHeads) if (!((head.mergeCommitSha ? await isAncestor(root, head.mergeCommitSha, mergeBase) : false) || await isAncestor(root, head.sha, mergeBase))) {
			provenNewPushedWork = false;
			break;
		}
	}
	return {
		pushedSha,
		statsBase,
		hasLandedPullRequest: landedHeads.length > 0,
		provenNewPushedWork
	};
}
//#endregion
//#region src/gateway/control-ui-session-prs-local-git.ts
const LOCAL_GIT_CACHE_MS = 75e3;
const LOCAL_GIT_CACHE_LIMIT = 100;
function createLocalGitCache() {
	const entries = /* @__PURE__ */ new Map();
	return (key, refresh, load) => {
		const cached = entries.get(key);
		if (!refresh && cached && cached.expiresAt > Date.now()) {
			entries.delete(key);
			entries.set(key, cached);
			return cached.promise;
		}
		const entry = {
			expiresAt: Date.now() + LOCAL_GIT_CACHE_MS,
			promise: load()
		};
		entries.delete(key);
		entries.set(key, entry);
		pruneMapToMaxSize(entries, LOCAL_GIT_CACHE_LIMIT);
		return entry.promise;
	};
}
const cachedGitContext = createLocalGitCache();
const cachedBranchFacts = createLocalGitCache();
function resolveCachedGitContext(root, deps, refresh = false) {
	return cachedGitContext(root, refresh, async () => {
		const output = deps.gitOutput ?? gitOutput;
		const branch = await output(root, [
			"rev-parse",
			"--abbrev-ref",
			"HEAD"
		]);
		if (!branch || branch === "HEAD") return null;
		const remoteUrl = await output(root, [
			"remote",
			"get-url",
			"origin"
		]);
		const remote = remoteUrl ? parseGitHubRemoteUrl(remoteUrl) : null;
		if (!remote) return null;
		const defaultBranch = (await output(root, [
			"symbolic-ref",
			"--short",
			"refs/remotes/origin/HEAD"
		]))?.replace(/^origin\//, "");
		if (defaultBranch === branch) return null;
		return {
			...remote,
			branch,
			root,
			...defaultBranch ? { defaultBranch } : {}
		};
	});
}
function resolveCachedSessionBranchFacts(context, mergedHeads, load, refresh = false) {
	const landingKey = JSON.stringify([context.defaultBranch ?? null, mergedHeads]);
	return cachedBranchFacts(`${context.root}\0${context.branch}\0${landingKey}`, refresh, load);
}
//#endregion
//#region src/gateway/control-ui-session-prs.ts
const SUCCESS_CACHE_MS = 9e4;
const RATE_LIMIT_CACHE_MS = 5 * 6e4;
const FAILURE_CACHE_MS = 3e4;
const CACHE_LIMIT = 100;
const MAX_PULL_REQUESTS = 3;
const branchCache = /* @__PURE__ */ new Map();
/** Resolves the checkout root without spawning Git. */
function resolveSessionPullRequestGitRoot(params) {
	const { cfg, entry, storePath, canonicalKey } = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	if (!entry?.sessionId || !storePath) return null;
	const agentId = normalizeAgentId(parseAgentSessionKey(canonicalKey)?.agentId ?? params.agentId ?? parseAgentSessionKey(params.sessionKey)?.agentId ?? resolveDefaultAgentId(cfg));
	const root = normalizeOptionalString(entry.spawnedCwd) ?? normalizeOptionalString(entry.spawnedWorkspaceDir) ?? normalizeOptionalString(resolveAgentWorkspaceDir(cfg, agentId));
	if (!root) return null;
	return root;
}
/**
* Resolves the GitHub repo + branch, caching detached/default/non-GitHub
* outcomes too so repeated sidebar requests do not respawn the same probes.
*/
async function resolveSessionPullRequestGitContext(params, deps) {
	const root = deps.resolveGitRoot ? await deps.resolveGitRoot(params) : resolveSessionPullRequestGitRoot(params);
	if (!root) return null;
	return resolveCachedGitContext(root, deps, params.refresh === true);
}
function branchCreateUrl(context) {
	return `https://github.com/${encodeURIComponent(context.owner)}/${encodeURIComponent(context.repo)}/pull/new/${context.branch.split("/").map(encodeURIComponent).join("/")}`;
}
const SHORTSTAT_FILES = /(\d+) files? changed/;
const SHORTSTAT_INSERTIONS = /(\d+) insertion/;
const SHORTSTAT_DELETIONS = /(\d+) deletion/;
const MAX_UNTRACKED_STAT_FILES = 100;
const MAX_UNTRACKED_STAT_BYTES = 512 * 1024;
/**
* Line count for one untracked file, computed in-process: this runs on the
* chat view's poll, so it must not spawn one git subprocess per path. lstat
* gates on regular files so FIFOs/sockets can never block the RPC and symlinks
* never resolve outside the checkout; only a line count is exposed, so
* sessions-diff's hardlink content guard is unnecessary here.
*/
async function untrackedFileAdditions(root, filePath) {
	try {
		const abs = path.resolve(root, filePath);
		const info = await fs.lstat(abs);
		if (!info.isFile() || info.size === 0 || info.size > MAX_UNTRACKED_STAT_BYTES) return 0;
		const body = await fs.readFile(abs);
		if (body.subarray(0, 8192).includes(0)) return 0;
		let lines = 0;
		for (const byte of body) if (byte === 10) lines += 1;
		return body[body.length - 1] === 10 ? lines : lines + 1;
	} catch {
		return 0;
	}
}
async function untrackedStats(root, output) {
	const paths = (await output(root, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"-z"
	]) ?? "").split("\0").filter(Boolean);
	let additions = 0;
	for (const filePath of paths.slice(0, MAX_UNTRACKED_STAT_FILES)) additions += await untrackedFileAdditions(root, filePath);
	return {
		additions,
		files: paths.length
	};
}
/**
* Working-tree diff counts vs an explicit base, untracked files included:
* the size the PR would have if the current work were committed and pushed;
* changedFiles decides row visibility for unpushed branches. Unlike bare
* `git diff`, this also counts unmerged (conflict) paths.
*/
async function diffStatsAgainst(root, base, deps) {
	try {
		const result = await (deps.runGit ?? runGit)(root, [
			"diff",
			"--shortstat",
			"--no-ext-diff",
			"--no-textconv",
			base
		]);
		if (result.code !== 0) return null;
		const summary = result.stdout.trim();
		const untracked = await untrackedStats(root, deps.gitOutput ?? gitOutput);
		return {
			additions: Number(SHORTSTAT_INSERTIONS.exec(summary)?.[1] ?? 0) + untracked.additions,
			deletions: Number(SHORTSTAT_DELETIONS.exec(summary)?.[1] ?? 0),
			changedFiles: Number(SHORTSTAT_FILES.exec(summary)?.[1] ?? 0) + untracked.files
		};
	} catch {
		return null;
	}
}
/**
* GitHub's pull/new page only has something to offer once the pushed branch
* carries commits the default branch lacks. Rename-only commits still count:
* this gate keys on commits, not line counts.
*/
async function branchHasCreatablePullRequest(root, context, pushedSha, output) {
	if (!context.defaultBranch || !pushedSha) return false;
	const ahead = await output(root, [
		"rev-list",
		"--count",
		`refs/remotes/origin/${context.defaultBranch}..refs/remotes/origin/${context.branch}`
	]);
	return ahead === null || Number(ahead) > 0;
}
async function resolveSessionBranch(context, mergedHeads, deps, refresh) {
	const root = context.root;
	if (!root) return {
		owner: context.owner,
		repo: context.repo,
		branch: context.branch,
		createUrl: branchCreateUrl(context)
	};
	const facts = await resolveCachedSessionBranchFacts({
		...context,
		root
	}, mergedHeads, async () => {
		const landing = await (deps.resolveBranchLanding ?? resolveBranchLanding)(root, {
			branch: context.branch,
			defaultBranch: context.defaultBranch,
			mergedHeads
		});
		const creatable = (!landing.hasLandedPullRequest || landing.provenNewPushedWork) && await branchHasCreatablePullRequest(root, context, landing.pushedSha, deps.gitOutput ?? gitOutput);
		const stats = landing.statsBase ? await diffStatsAgainst(root, landing.statsBase, deps) : null;
		return !creatable && !(stats && stats.changedFiles > 0) ? void 0 : {
			creatable,
			stats
		};
	}, refresh);
	if (!facts) return;
	return {
		owner: context.owner,
		repo: context.repo,
		branch: context.branch,
		...facts.creatable ? { createUrl: branchCreateUrl(context) } : {},
		...facts.stats ? {
			additions: facts.stats.additions,
			deletions: facts.stats.deletions,
			changedFiles: facts.stats.changedFiles
		} : {}
	};
}
function derivePullState(value) {
	if (readOptionalGitHubString(value, "merged_at")) return "merged";
	if (value.state !== "open") return "closed";
	return value.draft === true ? "draft" : "open";
}
function parsePullListItem(value) {
	if (!isRecord(value)) return null;
	const number = optionalNumber(value, "number");
	const title = readOptionalGitHubString(value, "title");
	const url = readOptionalGitHubString(value, "html_url");
	const base = isRecord(value.base) ? value.base : {};
	const baseRepo = isRecord(base.repo) ? base.repo : {};
	const owner = readOptionalGitHubString(isRecord(baseRepo.owner) ? baseRepo.owner : {}, "login");
	const repo = readOptionalGitHubString(baseRepo, "name");
	const head = isRecord(value.head) ? value.head : {};
	if (!number || !Number.isSafeInteger(number) || number < 1 || !title || !url || !owner || !repo) return null;
	return {
		number,
		title,
		url,
		owner,
		repo,
		state: derivePullState(value),
		headSha: readOptionalGitHubString(head, "sha"),
		baseRef: readOptionalGitHubString(base, "ref"),
		mergeCommitSha: readOptionalGitHubString(value, "merge_commit_sha")
	};
}
function parsePullList(value) {
	if (!Array.isArray(value)) return [];
	return value.map(parsePullListItem).filter((item) => item !== null);
}
function pullsByHeadUrl(owner, repo, head) {
	return `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls?head=${encodeURIComponent(head)}&state=all&sort=updated&direction=desc&per_page=5`;
}
async function fetchParentRepo(owner, repo, fetchImpl, token) {
	return resolveGitHubForkParent(await fetchGitHubJson(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, fetchImpl, token)) ?? null;
}
function rethrowRateLimit(error) {
	if (error instanceof ControlUiGitHubError && error.statusCode === 429) throw error;
}
async function fetchDiffCounts(item, fetchImpl, token) {
	const url = `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(item.owner)}/${encodeURIComponent(item.repo)}/pulls/${item.number}`;
	try {
		const value = await fetchGitHubJson(url, fetchImpl, token);
		if (!isRecord(value)) return {};
		return {
			additions: optionalNumber(value, "additions"),
			deletions: optionalNumber(value, "deletions"),
			changedFiles: optionalNumber(value, "changed_files")
		};
	} catch (error) {
		rethrowRateLimit(error);
		return {};
	}
}
const FAILING_CHECK_CONCLUSIONS = /* @__PURE__ */ new Set([
	"failure",
	"timed_out",
	"cancelled",
	"action_required",
	"startup_failure"
]);
function rollupCheckRuns(value) {
	if (!isRecord(value) || !Array.isArray(value.check_runs) || value.check_runs.length === 0) return;
	let passed = 0;
	let failed = 0;
	let skipped = 0;
	let running = 0;
	for (const runValue of value.check_runs) {
		const run = isRecord(runValue) ? runValue : {};
		const conclusion = readOptionalGitHubString(run, "conclusion");
		if (conclusion && FAILING_CHECK_CONCLUSIONS.has(conclusion)) {
			failed += 1;
			continue;
		}
		if (run.status !== "completed" || conclusion === "stale") {
			running += 1;
			continue;
		}
		if (conclusion === "skipped") {
			skipped += 1;
			continue;
		}
		passed += 1;
	}
	return {
		state: failed > 0 ? "failing" : running > 0 ? "pending" : "passing",
		passed,
		failed,
		skipped,
		running
	};
}
async function fetchChecks(item, fetchImpl, token) {
	if (!item.headSha || !/^[0-9a-f]{40}$/i.test(item.headSha)) return;
	const url = `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(item.owner)}/${encodeURIComponent(item.repo)}/commits/${item.headSha}/check-runs?per_page=100`;
	try {
		return rollupCheckRuns(await fetchGitHubJson(url, fetchImpl, token));
	} catch (error) {
		rethrowRateLimit(error);
		return;
	}
}
async function finishPullRequest(item, branch, fetchImpl, token) {
	const chip = {
		number: item.number,
		owner: item.owner,
		repo: item.repo,
		branch,
		title: item.title,
		url: item.url,
		state: item.state
	};
	if (item.state !== "open" && item.state !== "draft") return chip;
	const [counts, checks] = await Promise.all([fetchDiffCounts(item, fetchImpl, token), fetchChecks(item, fetchImpl, token)]);
	return {
		...chip,
		...counts,
		...checks ? {
			checks,
			checksUrl: `${item.url}/checks`
		} : {}
	};
}
function mergedHeadsOf(items) {
	const heads = [];
	for (const item of items) if (item.state === "merged" && item.headSha) heads.push({
		sha: item.headSha.toLowerCase(),
		...item.baseRef ? { baseRef: item.baseRef } : {},
		...item.mergeCommitSha ? { mergeCommitSha: item.mergeCommitSha.toLowerCase() } : {}
	});
	return heads;
}
async function fetchBranchPullRequests(context, fetchImpl, token) {
	const head = `${context.owner}:${context.branch}`;
	let items = parsePullList(await fetchGitHubJson(pullsByHeadUrl(context.owner, context.repo, head), fetchImpl, token));
	if (items.length === 0) {
		const parent = await fetchParentRepo(context.owner, context.repo, fetchImpl, token);
		if (parent) items = parsePullList(await fetchGitHubJson(pullsByHeadUrl(parent.owner, parent.repo, head), fetchImpl, token));
	}
	const capped = items.slice(0, MAX_PULL_REQUESTS);
	const mergedHeads = mergedHeadsOf(items);
	try {
		return {
			pullRequests: await Promise.all(capped.map((item) => finishPullRequest(item, context.branch, fetchImpl, token))),
			rateLimited: false,
			mergedHeads
		};
	} catch (error) {
		if (!(error instanceof ControlUiGitHubError && error.statusCode === 429)) throw error;
		return {
			pullRequests: capped.map((item) => ({
				number: item.number,
				owner: item.owner,
				repo: item.repo,
				branch: context.branch,
				title: item.title,
				url: item.url,
				state: item.state
			})),
			rateLimited: true,
			mergedHeads
		};
	}
}
async function refreshBranchPullRequests(context, fetchImpl, entry, token) {
	try {
		const result = await fetchBranchPullRequests(context, fetchImpl, token);
		entry.lastGood = {
			pullRequests: result.pullRequests,
			mergedHeads: result.mergedHeads
		};
		if (result.rateLimited) entry.expiresAt = Date.now() + RATE_LIMIT_CACHE_MS;
		return result;
	} catch (error) {
		const rateLimited = error instanceof ControlUiGitHubError && error.statusCode === 429;
		entry.expiresAt = Date.now() + (rateLimited ? RATE_LIMIT_CACHE_MS : FAILURE_CACHE_MS);
		if (rateLimited) return {
			pullRequests: [],
			mergedHeads: [],
			...entry.lastGood,
			rateLimited: true
		};
		if (entry.lastGood) return {
			...entry.lastGood,
			rateLimited: false
		};
		throw error;
	}
}
async function loadControlUiSessionPullRequests(params, deps = {}) {
	const context = deps.resolveGitContext ? await deps.resolveGitContext(params) : await resolveSessionPullRequestGitContext(params, deps);
	if (!context) return {
		pullRequests: [],
		rateLimited: false
	};
	const { mergedHeads, ...snapshot } = await cachedBranchPullRequests(context, deps, params.refresh === true);
	const branch = await resolveSessionBranch(context, mergedHeads, deps, params.refresh === true);
	return branch ? {
		...snapshot,
		branch
	} : snapshot;
}
function trackBranchRefresh(entry, mode, load) {
	entry.expiresAt = Date.now() + SUCCESS_CACHE_MS;
	entry.refreshMode = mode;
	const trackedPromise = load().finally(() => {
		if (entry.promise === trackedPromise) entry.refreshMode = null;
	});
	entry.promise = trackedPromise;
	return trackedPromise;
}
async function cachedBranchPullRequests(context, deps, refresh) {
	const { token, cacheScope } = resolveGitHubApiCredentialScope();
	const key = `${context.owner.toLowerCase()}/${context.repo.toLowerCase()}#${context.branch}\0${cacheScope}`;
	const cached = branchCache.get(key);
	if (cached && cached.expiresAt > Date.now()) {
		branchCache.delete(key);
		branchCache.set(key, cached);
		if (!refresh || cached.refreshMode === "forced") return cached.promise;
		const pendingSnapshot = cached.promise;
		const pendingRefreshMode = cached.refreshMode;
		const pendingExpiresAt = cached.expiresAt;
		return trackBranchRefresh(cached, "forced", async () => {
			const snapshot = await pendingSnapshot;
			if (snapshot.rateLimited) {
				if (pendingRefreshMode === null) cached.expiresAt = pendingExpiresAt;
				return snapshot;
			}
			return refreshBranchPullRequests(context, deps.fetchImpl ?? fetch, cached, token);
		});
	}
	const entry = cached ?? {
		expiresAt: 0,
		promise: Promise.resolve({
			pullRequests: [],
			rateLimited: false,
			mergedHeads: []
		}),
		refreshMode: null
	};
	const promise = trackBranchRefresh(entry, refresh ? "forced" : "normal", () => refreshBranchPullRequests(context, deps.fetchImpl ?? fetch, entry, token));
	branchCache.delete(key);
	branchCache.set(key, entry);
	pruneMapToMaxSize(branchCache, CACHE_LIMIT);
	return promise;
}
//#endregion
export { loadControlUiSessionPullRequests };
