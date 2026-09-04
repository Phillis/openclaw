#!/bin/bash
# Component verification — post 2026.9.1 upgrade (2026-09-04). Read-only, non-destructive.
# Adapted from verify-components-20260901.sh; npm/projects paths dropped (gutted since 2026.8),
# added usage.ledger custom RPC + rtk decisions + memory-lancedb live-path checks.
PASS=0; FAIL=0
ck() { # name, command... (command must print evidence; exit 0 = pass)
  local name="$1"; shift
  local out; out=$("$@" 2>&1 | head -c 300); local rc=$?
  if [ $rc -eq 0 ]; then PASS=$((PASS+1)); echo "PASS  $name — ${out:0:120}"
  else FAIL=$((FAIL+1)); echo "FAIL  $name (rc=$rc) — ${out:0:160}"; fi
}

echo "== 1. Gateway =="
ck "gateway version (expect 2026.9.1 custom f664e46+)" bash -c 'cd ~/openclaw && ./openclaw.mjs --version'
ck "gateway health rpc" bash -c 'cd ~/openclaw && ./openclaw.mjs gateway call health | grep -m1 "\"ok\"": '
ck "usage.ledger custom RPC (fork patch)" bash -c 'cd ~/openclaw && ./openclaw.mjs gateway call usage.ledger'

echo "== 2. Plugins (18 expected loaded, 0 failed) =="
ck "plugin load list" bash -c 'cd ~/openclaw && ./openclaw.mjs gateway call health | grep -c "ewt-handoff-contracts"'
ck "ewt control plane sqlite live" bash -c 'test $(find ~/.openclaw/plugins/ewt-handoff-contracts/control-plane-v2-final.sqlite-wal -mmin -30) '
ck "memory-lancedb live path" bash -c 'test -d ~/.openclaw/extensions/memory-lancedb/dist'
ck "memory search round-trip" bash -c 'cd ~/openclaw && ./openclaw.mjs memory search "handoff" --agent oscar >/dev/null'

echo "== 3. Local services =="
ck "reranker :8089" curl -sf -m 4 http://127.0.0.1:8089/health
ck "searxng-fallback :8890" curl -sf -m 4 http://127.0.0.1:8890/healthz
ck "lmstudio embeddings :1234" curl -sf -m 4 http://127.0.0.1:1234/v1/models
ck "lancedb store dir" bash -c 'test -d ~/.openclaw/memory/lancedb/memories.lance'

echo "== 4. rtk stack =="
ck "rtk binary" /opt/homebrew/bin/rtk --version
ck "rtk hook check" bash -c '/opt/homebrew/bin/rtk hook check "git status --short"'
ck "rtk-rewrite decisions fresh (<10min)" bash -c 'test $(find ~/.openclaw/logs/rtk-rewrite.decisions.jsonl -mmin -10)'

echo "== 5. lossless-claw =="
ck "lcm log fresh (<10min)" bash -c 'test $(find ~/.openclaw/logs/lossless-claw.log -mmin -10)'

echo "== 6. Channels =="
ck "slack socket mode connected" bash -c 'grep -a "socket mode connected" ~/Library/Logs/openclaw/gateway.log | tail -1'

echo
echo "RESULT: $PASS passed, $FAIL failed"
[ $FAIL -eq 0 ]
