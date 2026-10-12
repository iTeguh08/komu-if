# Next steps

## Decisions already made
- Contribution via GitHub PR, no backend.
- Each room is fully custom (free HTML/CSS/JS).
- Shell: SvelteKit + Tailwind. English UI/docs.
- Collaboration = each student contributes their own room.
- Scope: casual class project that may grow into a long-term portfolio.

## Open questions (answer before or during step 1)
1. **Class size?** Assumed 30 to 60. Affects the size budget.
2. **Is a public repo OK?** Free GitHub Pages requires it. All room content becomes public.
3. **Do students know git/PRs?** If many don't, plan a 20-minute walkthrough or maintainer-merges-for-them fallback.
4. **Who maintains after you?** CODEOWNERS and `main` protection need a second admin.
5. **Repo/URL?** GitHub org or personal account? Custom domain later? This sets `BASE_PATH`.
6. **Visual direction:** accept the DESIGN.md default (dark museum wall) or provide references.
7. **Consent:** how do you collect "yes, publish my room" from each student?

## Build order (smallest useful first)
1. **Scaffold:** `npx sv create .` (SvelteKit, TypeScript), add `adapter-static`, install Tailwind v4 with `@tailwindcss/vite`. Replace the placeholder `index.html` and `HALO.md`.
2. **Deploy skeleton first:** empty gallery page, `deploy.yml`, confirm GitHub Pages serves under the correct base path. Do this before any feature.
3. **Rooms loader:** `src/lib/rooms.ts` with `import.meta.glob('/static/rooms/*/room.json')`. Verify it resolves from `static/`; if not, move metadata to `src/rooms/<handle>.json` or generate an index in a prebuild script.
4. **Gallery UI:** masonry wall, cards, tag filter, shuffle. Per DESIGN.md.
5. **Template room:** `static/rooms/_template/` (`index.html`, `room.json`, `thumb.webp`).
6. **Validator:** `scripts/validate-rooms.mjs` per RULES.md. Plus `check.yml`.
7. **Governance:** `CODEOWNERS`, branch protection, `CONTRIBUTING.md` (copy template, edit, PR).
8. **Seed:** create two real rooms yourself (yours + one friend's) to test the full flow.
9. **Launch:** share the repo link and contributing guide with the class.

## Definition of done for MVP
- Merge a PR that adds a room → live on the site within a few minutes.
- A PR that touches another student's folder or exceeds the size limit is blocked by CI.
- Gallery works on a phone and with 0, 1, and 60 rooms.

## Do not build yet
Comments, search, OG images, admin UI, analytics, room-of-the-day, iframe sandboxing. Add only after real demand, or after rooms go beyond a trusted class.
