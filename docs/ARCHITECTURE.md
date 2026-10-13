# Architecture

Static site. No server. Two separate worlds:

- **Shell**: SvelteKit + Tailwind. Owns only the gallery (`/`).
- **Rooms**: plain static folders. Each student owns one. Shell never imports their code.

```
repo
├─ src/                      shell (SvelteKit)
│  ├─ routes/+layout.svelte  imports app.css
│  ├─ routes/+page.svelte    gallery
│  └─ lib/rooms.ts           loads every room.json
├─ static/
│  └─ rooms/<handle>/        one student, one folder
│     ├─ room.json           metadata (see SCHEMA.md)
│     ├─ thumb.webp          gallery card image
│     └─ index.html + assets free-form, relative paths only
├─ scripts/validate-rooms.mjs  CI checks, zero deps
├─ .github/
│  ├─ CODEOWNERS             /static/rooms/<handle>/ → @github-user
│  └─ workflows/{check,deploy}.yml
└─ docs/
```

## Why this split
- A room as a SvelteKit route would let one student's syntax error break everyone's build. A static folder cannot.
- Rooms get true freedom (any framework, as long as built output is committed), and no Tailwind or CSS leakage from the shell.
- The shell stays tiny.

## Data flow
1. Build: `import.meta.glob('/static/rooms/*/room.json', { eager: true })` in `src/lib/rooms.ts` yields the room list. Verify path resolution on first build (see NEXTSTEP).
2. Gallery renders cards: thumb, name, tagline, tags. Card links to `{base}/rooms/<handle>/`.
3. SvelteKit `adapter-static` copies `static/` into `build/`. Room folders are served untouched.
4. Visitor opens a room: the browser loads the student's `index.html` directly.

## Build and deploy
- `adapter-static`, `paths.base` from `BASE_PATH` env (repo name on GH Pages). Official recipe: https://svelte.dev/docs/kit/adapter-static
- Tailwind v4 via `@tailwindcss/vite` plugin and `@import "tailwindcss"` in `src/app.css`. Official: https://tailwindcss.com/docs/installation/framework-guides/sveltekit
- Workflow `deploy.yml`: on push to `main` → build → `upload-pages-artifact` → `deploy-pages`.
- Workflow `check.yml`: on PR → `node scripts/validate-rooms.mjs` + `npm run build`.

## PR contribution flow
1. Student forks, copies `static/rooms/_template` to `static/rooms/<handle>`.
2. Edits only that folder, opens PR.
3. CI: validates folder scope, schema, sizes, relative paths. Build must pass.
4. CODEOWNERS adds the student for their own folder, maintainer for everything else.
5. Maintainer skims `index.html`, merges. Deploy runs.

## Security model (honest version)
Rooms are same-origin with the shell and with each other. A malicious room script could read other rooms' `localStorage` or redirect. Accepted for a trusted class, controlled by review. If this ever becomes open to strangers: serve rooms in `<iframe sandbox>` or a separate origin.

## Decisions log
| Decision | Rejected | Why |
|---|---|---|
| Static + GH Pages | Supabase/Firebase | Class gallery needs no state |
| Folder per room | Svelte route per room | Build isolation, true freedom |
| `room.json` per room | Central `rooms.json` | Central file causes merge conflicts on every PR |
| Handle in URL | NIM in URL | Do not publish student numbers |
| Hand-rolled validator | ajv/zod | ~40 lines; add a dependency only if it grows |
