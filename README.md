# Neon Fart Patrol

A mobile-friendly, top-down cyberpunk game for **2–4 players on separate devices**. Four houses, neon streets, green fart clouds, and synthesized retro sound effects.

## Game rules

1. Fart on all three opponent houses and keep your own house clean to win.
2. Cleanse your house when its farted on.
3. Fart on each other to score points.
4. The points don't count

Each player owns MATT'S, NICK'S, SEAN'S, or MIKE'S HOUSE. You win by having your toxic mark on all three other houses at the same time while your own house has no toxic marks. Cleansing your home can complete the win. The three other houses remain targets even in a two- or three-player match. Cleansing your own doorstep removes everyone's marks from that house. Player-hit points are just for fun and never decide the winner.

Create a room, share its invite/code, and pick a different house on each device. At least two players must join. **Every joined player must be online and click Ready**; the game then starts automatically. Joined players who disconnect pause the match until they reconnect. The host can restart the match or remove a player who has been offline for 10 seconds. Hosting transfers to an online player after the host has been offline for 20 seconds. Empty seats do not pause two- or three-player games. New players cannot join a match already in progress.

## Where the game runs

**GitHub stores the source. Cloudflare Workers + Durable Objects host the playable multiplayer game.** GitHub Pages alone cannot run this game's server or shared database.

The package is independent of ChatGPT. It contains no account credentials, production database contents, or ChatGPT hosting identifiers. Deploying it creates a separate public game with its own database. It does not change the original game link.

## 1. Upload to GitHub

1. Extract the ZIP.
2. Create a repository on GitHub (public if you want the source public).
3. Upload the **contents** of `neon-fart-patrol-github` to the repository root. `package.json`, `wrangler.json`, and this README should be at the top level.
4. Include the hidden `.github` directory and `.gitignore` if you want automated checks and deployment. Git can include these automatically:

   ```bash
   git init
   git add .
   git commit -m "Add Neon Fart Patrol"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

GitHub's **Add file → Upload files** also works for the source. GitHub does not extract ZIPs into repositories: upload the extracted files, not the ZIP itself.

## 2. Publish a public playable URL

You need a Cloudflare account and Node.js **24 or newer** installed. Open a terminal inside the extracted project folder or clone of your GitHub repository.

```bash
npm ci
npm run login
npm run db:create
```

The login command opens Cloudflare's sign-in flow. The database command creates a D1 database named `neon-fart-patrol` and prints its `database_id`.

Open `wrangler.json` and replace:

```json
"database_id": "00000000-0000-0000-0000-000000000000"
```

with the actual ID printed by the database command. Keep the binding named **DB** and `migrations_dir` named **drizzle**. A database ID is configuration, not a password; you can commit the updated file to your repository.

Then run:

```bash
npm run deploy
```

This runs the tests, builds the game, and publishes the Worker. Wrangler creates the Durable Object storage automatically. D1 is retained to recover rooms from the previous version; do not rerun the initial D1 migration on an existing manually initialized database. Wrangler prints your actual public URL, normally shaped like:

```text
https://neon-fart-patrol.YOUR-SUBDOMAIN.workers.dev
```

That is the **game link** to share. No ChatGPT login is needed on this independent deployment. Open the URL on each device, create/join the same room, choose different houses, and click Ready.

If the Worker name is already used in your Cloudflare account, change `name` in `wrangler.json` before deploying. Keep the database name unchanged unless you also change the database creation script.

## 3. Optional: deploy automatically from GitHub

The included workflow deploys `main` only after you enable it. Until then, GitHub runs checks without publishing.

1. Complete the one-time database setup above and commit the real `database_id` in `wrangler.json`.
2. Create a Cloudflare API token with access to your account's Worker scripts and D1 database. Start with the **Edit Cloudflare Workers** token template and add **Account → D1 → Edit**. Follow Cloudflare's current permissions guidance linked below.
3. In GitHub, open **Settings → Secrets and variables → Actions** and add these repository secrets:
   - `CLOUDFLARE_API_TOKEN`: your Cloudflare API token.
   - `CLOUDFLARE_ACCOUNT_ID`: your Cloudflare account ID.
4. Add a repository **variable** named `CLOUDFLARE_DEPLOY_ENABLED` with the value `true`.
5. Push to `main`, or run **Actions → Deploy public game → Run workflow**.

Keep the token in GitHub Secrets, never in source files. Use either this workflow or Cloudflare's own Git integration for automatic deployment; this workflow is already provided and does not require both.

## Local development

```bash
npm ci
npm run dev
```

This builds the game, applies the migrations to a local D1 database, and starts Wrangler's local server. Local data is separate from the deployed game's data. Wrangler prints the local URL. Use the public deployment to test separate phones easily.

Edit `public/game.js` for controls, rendering, audio, and lobby behavior. Edit `public/index.html` for layout and styles. Edit `worker/rules.js` for authoritative game rules and `worker/room.js` for WebSocket synchronization and recovery controls.

```bash
npm test
npm run build
```

The tests cover one-player start rejection, two/three/four-player readiness, offline pauses, empty seats, fart effects and points, home cleansing, victory, replay, concurrent updates, and client states. No physical multi-device browser or audio-listening test is included.

For database schema changes, edit `db/schema.ts` and run `npm run db:generate`. Commit the newly generated migration and metadata. Do not rewrite migrations already applied to a deployed database.

## Controls

- **Mobile:** drag the joystick or tap the map to walk. Tap **Fart** or **Cleanse home**.
- **Desktop:** WASD or arrow keys to walk; Space to fart; C to cleanse your own doorstep.
- **Audio:** unlocks after the first interaction; use the Sound button to mute.

Farts recharge for one second. Cleansing recharges for two seconds. Rooms expire after 24 hours without activity.

## Project contents

| Path | Purpose |
| --- | --- |
| `public/index.html` | Mobile layout, lobby instructions, visual player indicators |
| `public/game.js` | Canvas game, controls, client synchronization, synthesized sound |
| `worker/rules.js` | Server-authoritative multiplayer rules |
| `worker/api.js` | Room creation, joining, routing to the room server |
| `db/schema.ts`, `drizzle/` | D1 schema and versioned migrations |
| `scripts/build.mjs` | Builds a self-contained Cloudflare Worker |
| `wrangler.json` | Public hosting and D1 configuration |
| `tests/` | Automated rules, API, and client checks |
| `.github/workflows/` | GitHub checks and optional public deployment |

## Official setup references

- [Cloudflare Workers deployment with GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Cloudflare D1 setup](https://developers.cloudflare.com/d1/get-started/)
- [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [GitHub Pages capabilities](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## Updating the existing public game

Replace the source files in this repository and commit to your Cloudflare-connected branch. Keep your existing D1 database ID. Cloudflare must run `npm run build` followed by `npx wrangler deploy`; uploading only the HTML will not update the multiplayer server. The Durable Object binding and its `rooms-v1` migration in `wrangler.json` must be included.

Real-time gameplay now uses WebSockets. Ready clicks show **Saving…** until the server confirms them and are retried after reconnection. Open **Room controls** during a match to restart it, remove an offline player, or leave. Removing a player when fewer than two remain returns everyone to the lobby.

Run `npm run test:integration` after `npm ci` to exercise two actual Cloudflare WebSocket clients locally. Automated checks do not replace testing touch controls and sound on physical phones.
