#!/bin/bash
# OpenClaw host log right-sizing: size-based rotation with 7-day retention for
# plugin decision logs and monitor outputs the host sink does not own.
#
# Design: copy+truncate (no rename) so third-party emitters that hold the file
# open (model-router, rtk-rewrite, lossless-claw) keep appending to the same
# inode without losing lines or requiring a restart signal.
#
# Ship mode: this script is loaded by WC at the ship ceremony (see README.md in
# this directory). Nothing in the running system reads this repo copy.
set -u

CONFIG="${OPENCLAW_LOGROTATE_CONFIG:-$HOME/.openclaw/operations/logrotate/logrotate.conf}"
ARCHIVE_DIR="${OPENCLAW_LOGROTATE_ARCHIVE_DIR:-$HOME/.openclaw/logs/archive}"
RETENTION_DAYS="${OPENCLAW_LOGROTATE_RETENTION_DAYS:-7}"

if [ ! -r "$CONFIG" ]; then
  echo "logrotate: config not readable: $CONFIG" >&2
  exit 1
fi
mkdir -p "$ARCHIVE_DIR"

rotated=0
skipped=0
# Config lines: <path> <maxBytes> <keepCount>  ("#" comments allowed)
while IFS='|' read -r path maxBytes keepCount; do
  [ -z "$path" ] && continue
  case "$path" in \#*) continue ;; esac
  if [ ! -f "$path" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  size=$(stat -f %z "$path" 2>/dev/null || echo 0)
  if [ "$size" -lt "$maxBytes" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  archive="$ARCHIVE_DIR/$(basename "$path").$stamp.gz"
  if gzip -c "$path" > "$archive.tmp" && mv "$archive.tmp" "$archive"; then
    : > "$path"
    rotated=$((rotated + 1))
  else
    echo "logrotate: failed to archive $path" >&2
    continue
  fi
  # Enforce per-file keep count (newest N archives survive; only exact-prefix
  # archives of THIS log are pruned).
  if [ -n "${keepCount:-}" ] && [ "$keepCount" -gt 0 ] 2>/dev/null; then
    ls -t "$ARCHIVE_DIR/$(basename "$path")."*.gz 2>/dev/null | tail -n +"$((keepCount + 1))" | while IFS= read -r old; do
      rm -f "$old"
    done
  fi
done < "$CONFIG"

# Global retention: delete archives older than RETENTION_DAYS.
if [ "$RETENTION_DAYS" -gt 0 ] 2>/dev/null; then
  find "$ARCHIVE_DIR" -type f -name "*.gz" -mtime +"$RETENTION_DAYS" -delete 2>/dev/null
fi

echo "logrotate: rotated=$rotated skipped=$skipped archive=$ARCHIVE_DIR retention=${RETENTION_DAYS}d"
