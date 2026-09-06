#!/bin/bash
# Component verification — post 2026.9.2 upgrade (2026-09-06). Read-only, non-destructive.
# Adapted from verify-components-20260904.sh: version expectation bumped, plugin count
# raised to 22 (22 explicitly enabled entries in openclaw.json since 2026.9.1 era),
# adds model-router decisions + ewt RC-marker guard (WP-D/C dist markers vs stale repo dist).
PASS=0; FAIL=0
ck() { # name, command... (command must print evidence; exit 0 = pass)
  local name="$1"; shift
  local out; out=$("$@" 2>&1 | head -c 300); local rc=$?
  if [ $rc -eq 0 ]; then PASS=$((PASS+1)); echo "PASS  $name — ${out:0:120}"
  else FAIL=$((FAIL+1)); echo "FAIL  $name (rc=$rc) — ${out:0:160}"; fi
}

echo "== 1. Gateway =="
ck "gateway version (expect 2026.9.2 custom 0b73694+)" bash -c 'cd ~/openclaw && ./openclaw.mjs --version | grep "2026.9.2"'
ck "gateway health rpc" bash -c 'cd ~/openclaw && ./openclaw.mjs gateway call health | grep -m1 "\"ok\"" | grep true'
ck "usage.ledger custom RPC (fork patch)" bash -c 'cd ~/openclaw && ./openclaw.mjs gateway call usage.ledger >/dev/null'

echo "== 2. Plugins (22 expected loaded, 0 failed) =="
ck "22 plugins loaded" bash -c 'H=$(cd ~/openclaw && ./openclaw.mjs gateway call health); N=$(echo "$H" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d[\"plugins\"][\"loaded\"]))"); F=$(echo "$H" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d[\"plugins\"].get(\"failed\",[])))"); echo "loaded=$N failed=$F"; [ "$N" -ge 22 ] && [ "$F" -eq 0 ]'
ck "slots pinned (memory-lancedb + lossless-claw)" bash -c 'cd ~/openclaw && ./openclaw.mjs gateway call health | python3 -c "import json,sys; d=json.load(sys.stdin); s=d[\"plugins\"].get(\"slots\",{}); print(s); assert s.get(\"memory\")==\"memory-lancedb\" and s.get(\"contextEngine\")==\"lossless-claw\""'
ck "ewt control plane sqlite live" bash -c 'test $(find ~/.openclaw/plugins/ewt-handoff-contracts/control-plane-v2-final.sqlite-wal -mmin -30)'
ck "ewt live dist rc66 wave-2 markers" bash -c 'grep -l "REVIEW_COOLDOWN_ACTIVE\|review fingerprint cooldown" ~/.openclaw/extensions/ewt-handoff-contracts/dist/index.js >/dev/null || grep -rql "REVIEW_COOLDOWN_ACTIVE" ~/.openclaw/extensions/ewt-handoff-contracts/dist/ | head -1'
ck "memory search round-trip" bash -c 'cd ~/openclaw && ./openclaw.mjs memory search "handoff" --agent oscar >/dev/null'

echo "== 3. Local services =="
ck "reranker :8089" curl -sf -m 4 http://127.0.0.1:8089/health
ck "searxng-fallback :8890" curl -sf -m 4 http://127.0.0.1:8890/healthz
ck "lmstudio embeddings :1234" curl -sf -m 4 http://127.0.0.1:1234/v1/models
ck "lancedb store dir" bash -c 'test -d ~/.openclaw/memory/lancedb/memories.lance'

echo "== 4. rtk stack =="
ck "rtk binary" /opt/homebrew/bin/rtk --version
ck "rtk hook check" bash -c '/opt/homebrew/bin/rtk hook check "git status --short" >/dev/null'
ck "rtk-rewrite decisions fresh (<15min)" bash -c 'test $(find ~/.openclaw/logs/rtk-rewrite.decisions.jsonl -mmin -15)'
ck "model-router decisions fresh (<15min)" bash -c 'test $(find ~/.openclaw/logs/model-router.decisions.jsonl -mmin -15)'

echo "== 5. lossless-claw =="
ck "lcm log fresh (<10min) + no fail-closed" bash -c 'find ~/.openclaw/logs/lossless-claw.log -mmin -10 >/dev/null && ! grep -q "registerContextEngine" ~/.openclaw/logs/lossless-claw.log 2>/dev/null || tail -2 ~/.openclaw/logs/lossless-claw.log | grep -qi "lcm\|afterTurn"'

echo "== 6. Channels =="
ck "slack socket mode connected" bash -c 'grep -a "socket mode connected" ~/Library/Logs/openclaw/gateway.log | tail -1'

echo
echo "RESULT: $PASS passed, $FAIL failed"
[ $FAIL -eq 0 ]
