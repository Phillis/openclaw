#!/bin/bash
# Component verification — post 2026.8.2 upgrade (2026-09-01). Read-only, non-destructive.
PASS=0; FAIL=0
ck() { # name, command... (command must print evidence; exit 0 = pass)
  local name="$1"; shift
  local out; out=$("$@" 2>&1 | head -c 300); local rc=$?
  if [ $rc -eq 0 ]; then PASS=$((PASS+1)); echo "PASS  $name — ${out:0:120}"
  else FAIL=$((FAIL+1)); echo "FAIL  $name (rc=$rc) — ${out:0:160}"; fi
}

echo "== 1. Gateway =="
ck "gateway version" openclaw --version
ck "gateway health rpc" timeout 10 openclaw gateway call health

echo "== 2. LanceDB memory =="
ck "memory-lancedb plugin dir" ls -d /Users/phil/.openclaw/npm/projects/openclaw-memory-lancedb-*/node_modules
ck "reranker launchd" bash -c 'launchctl list | grep -q "ai.openclaw.reranker"'
ck "lancedb backup job" bash -c 'ls ~/Library/LaunchAgents/ai.openclaw.lancedb-backup.plist >/dev/null'
ck "memory search round-trip" timeout 20 openclaw memory search "test" --limit 1

echo "== 3. SearXNG =="
SEARX_PORT=$(grep -A2 -i "port" ~/Library/LaunchAgents/ai.openclaw.searxng-core.plist 2>/dev/null | grep -o "<integer>[0-9]*</integer>" | head -1 | grep -o "[0-9]*")
SEARX_PORT=${SEARX_PORT:-8888}
ck "searxng core launchd" bash -c 'launchctl list | grep -q "ai.openclaw.searxng-core"'
ck "searxng fallback launchd" bash -c 'launchctl list | grep -q "ai.openclaw.searxng-fallback"'
ck "searxng query ($SEARX_PORT)" bash -c "curl -s --max-time 5 \"http://127.0.0.1:$SEARX_PORT/search?q=test&format=json\" | head -c 60 | grep -q ."

echo "== 4. RTK + rtk rewrite =="
ck "rtk binary" bash -c 'rtk gain 2>/dev/null | head -3 | grep -q "Token Savings"'
ck "rtk-bounder decisions fresh (24h)" bash -c 'find ~/.pi/agent/logs/rtk-bounder.decisions.jsonl -mtime -1 >/dev/null'
ck "rtk-rewrite decisions exist" bash -c 'test -s ~/.pi/agent/logs/rtk-rewrite.decisions.jsonl'
ck "rtk hooks dir" bash -c 'ls ~/.openclaw/rtk-hooks/ >/dev/null'

echo "== 5. Vision model router =="
ck "vision-router plugin state" bash -c 'grep -A3 "vision-router" /Users/phil/.openclaw/openclaw.json | head -4 | grep -q . && echo configured'
ck "pi vision-router ext (expected disabled 2026-08-30)" bash -c 'test -d ~/.pi/agent/extensions/vision-router.disabled-20260830 && echo "disabled as documented"'

echo "== 6. Model switcher (model-limit-optimizer) =="
MOPT=/Users/phil/.openclaw/state/model-limit-optimizer-state.json
ck "optimizer state file" bash -c "test -s $MOPT"
for p in ollama-cloud opencode-go zai synthetic; do
  ck "optimizer snapshot $p fresh" python3 -c "
import json,sys,datetime
d=json.load(open('$MOPT'))['snapshots']['$p']
age=(datetime.datetime.utcnow()-datetime.datetime.fromisoformat(d['lastUpdated'].replace('Z','+00:00')).replace(tzinfo=None)).total_seconds()
sys.exit(0 if age<900 and d.get('ok') else 1)"
done
ck "optimizer decisions fresh (30m)" bash -c 'tail -1 /Users/phil/.openclaw/state/model-limit-optimizer-decisions.jsonl | python3 -c "import sys,json,datetime; d=json.loads(sys.stdin.read()); ts=datetime.datetime.fromisoformat(d[\"at\"].replace(\"Z\",\"+00:00\")).replace(tzinfo=None); sys.exit(0 if (datetime.datetime.utcnow()-ts).total_seconds()<1800 else 1)"'

echo "== 7. Handoff v2 (ewt-handoff-contracts) =="
DB=/Users/phil/.openclaw/plugins/ewt-handoff-contracts/control-plane-v2-final.sqlite
ck "live manifests >5" bash -c "test \$(sqlite3 -readonly $DB \"SELECT count(*) FROM agent_capabilities WHERE expires_at > datetime('now') AND agent_id || manifest_version IN (SELECT agent_id || max(manifest_version) FROM agent_capabilities GROUP BY agent_id)\") -gt 5"
ck "story-family lease fresh" bash -c "sqlite3 -readonly $DB \"SELECT count(*) FROM leases WHERE scope_key LIKE 'story-family%' AND expires_at > datetime('now','+25 minutes')\" | grep -v '^0$' | grep -q ."

echo "== 8. Command center =="
ck "command center health" bash -c 'curl -s --max-time 5 http://localhost:4321/api/health | grep -qi "ok\|healthy\|up"'

echo "== 9. Sessions RPC =="
ck "sessions.list rpc" timeout 15 openclaw gateway call sessions.list

echo
echo "SUMMARY: PASS $PASS / $((PASS+FAIL))$([ $FAIL -gt 0 ] && echo " — FAILURES: $FAIL")"
exit $([ $FAIL -eq 0 ] && echo 0 || echo 1)
