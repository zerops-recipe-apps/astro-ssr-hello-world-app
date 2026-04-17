# astro-ssr-hello-world-app

Astro SSR app with `@astrojs/node` standalone adapter, PostgreSQL, and idempotent migrations on Zerops nodejs@22.

## Zerops service facts

- HTTP port: `4321`
- Siblings: `db` (PostgreSQL) — env: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- Runtime base: `nodejs@22`

## Zerops dev

`setup: dev` idles on `zsc noop --silent`; the agent starts the dev server.

- Dev command: `npm run dev`
- In-container rebuild without deploy: `npm run build`

**All platform operations (start/stop/status/logs of the dev server, deploy, env / scaling / storage / domains) go through the Zerops development workflow via `zcp` MCP tools. Don't shell out to `zcli`.**

## Notes

- Build uses `os: ubuntu` to avoid Rollup musl/glibc binary resolution failures on Alpine — runtime is unaffected.
- Astro with `@astrojs/node` is NOT self-contained — `node_modules` must be deployed alongside `dist/` for `pg` at runtime.
- `HOST: 0.0.0.0` is required so the Node adapter binds to all interfaces; without it the server only listens on localhost and is unreachable from the balancer.
