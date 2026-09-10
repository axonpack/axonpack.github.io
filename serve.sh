#!/usr/bin/env sh
# Local preview. The page loads content.json as a JSON module, so it needs a real origin with
# correct MIME types — opening index.html over file:// will not work.
# Usage: ./serve.sh [port]
set -e
PORT="${1:-4000}"
cd "$(dirname "$0")"
echo "http://localhost:$PORT"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
