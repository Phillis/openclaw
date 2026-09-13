# OpenClaw host log right-sizing (WP-5, 2026-09-13)

Ship-as-files package: nothing here is live until WC copies it at the ceremony.
The host sink rotation (`logging.maxFileBytes`, default 100MB) covers only the
host's own log; the plugin decision logs and monitor outputs below are written
by external emitters that hold their files open, so they get a copy+truncate
rotator with 7-day retention.

## Files

| file                                           | purpose                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `rotate-openclaw-logs.sh`                      | rotator: size+count per entry, gzip archives, 7-day retention (env-tunable)                       |
| `logrotate.conf`                               | rotation list (10MB×7 for the three big logs; 1MB×3 for the watchdog log)                         |
| `ai.openclaw.logrotate.plist`                  | daily 03:15 calendar job                                                                          |
| `ai.openclaw.ewt-idle-dispatch-watchdog.plist` | interim watchdog plist: StartInterval 180 → 600 (retire the watchdog after productivity P1 ships) |

## Install (WC, ceremony)

```bash
mkdir -p ~/.openclaw/operations/logrotate
cp operations/logrotate/rotate-openclaw-logs.sh ~/.openclaw/operations/logrotate/
cp operations/logrotate/logrotate.conf          ~/.openclaw/operations/logrotate/
chmod +x ~/.openclaw/operations/logrotate/rotate-openclaw-logs.sh
cp operations/logrotate/ai.openclaw.logrotate.plist ~/Library/LaunchAgents/
launchctl unload ~/Library/LaunchAgents/ai.openclaw.logrotate.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/ai.openclaw.logrotate.plist

# watchdog cadence 180 -> 600 (unload first; the process is stateless)
cp operations/logrotate/ai.openclaw.ewt-idle-dispatch-watchdog.plist ~/Library/LaunchAgents/
launchctl unload ~/Library/LaunchAgents/ai.openclaw.ewt-idle-dispatch-watchdog.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.ewt-idle-dispatch-watchdog.plist

# smoke test (safe: runs the rotator once)
~/.openclaw/operations/logrotate/rotate-openclaw-logs.sh
```

No gateway restart is required; rotation is copy+truncate and restart-free.

## Stale-file cleanup (WC, manual — the implementation worker does not touch live state)

These are superseded migrated copies (800KB total); delete after a glance:

```bash
ls -la ~/.openclaw/logs/config-audit.jsonl.migrated ~/.openclaw/logs/config-audit.jsonl.migrated.raw
rm ~/.openclaw/logs/config-audit.jsonl.migrated ~/.openclaw/logs/config-audit.jsonl.migrated.raw
```

Also reclaim the already-rotated oversize logs once their replacements prove healthy:

```bash
rm ~/.openclaw/logs/lossless-claw.1.log          # 100MB, superseded by rotation policy
rm ~/.openclaw/logs/model-router.decisions.jsonl.1  # 33MB
# rtk-rewrite.decisions.jsonl: 32MB live file is the ACTIVE decision log; after the
# first rotation cycle produces an archive, re-check whether the emitter is still
# needed (rtk-rewrite project completed 2026-08-25) before keeping rotation for it.
```
