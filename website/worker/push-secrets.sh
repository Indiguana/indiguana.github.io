#!/usr/bin/env bash
# Pushes the three Spotify credentials from .dev.vars up to the deployed Worker.
# Values are piped straight into wrangler and never echoed, so they stay out of
# terminal scrollback and logs.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .dev.vars ]; then
	echo "No .dev.vars here. See README.md step 2." >&2
	exit 1
fi

for name in SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_SECRET SPOTIFY_REFRESH_TOKEN; do
	value="$(grep -E "^${name}=" .dev.vars | head -1 | cut -d= -f2- || true)"
	if [ -z "$value" ]; then
		echo "Missing ${name} in .dev.vars — fill it in first." >&2
		exit 1
	fi
	printf '%s' "$value" | npx wrangler secret put "$name" >/dev/null
	echo "pushed ${name}"
done

echo
echo "Done. Now: npx wrangler deploy"
