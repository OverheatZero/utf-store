#!/bin/sh
set -e

# Caddy fronts Nest inside this container: it owns $PORT (the port Railway
# exposes) and proxies to Nest on 127.0.0.1:$NEST_PORT.
caddy run --config /app/Caddyfile --adapter caddyfile &

# Nest runs as PID 1 so it receives Railway's SIGTERM and shuts down cleanly.
# Caddy is torn down with the container.
exec node dist/src/main.js
