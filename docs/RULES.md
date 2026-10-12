# Rules

Two audiences: students (room rules) and contributors to the shell (repo rules). CI enforces what it can.

## Room rules (students)
1. **Stay in your folder.** PRs may only change `static/rooms/<your-handle>/`. CI fails otherwise.
2. **Handle = folder name = `room.json` handle.** Lowercase, `a-z 0-9 -`, 2 to 24 chars. Never your NIM.
3. **Relative paths only.** `./img/a.png` yes, `/img/a.png` no. The site lives under a sub-path on GitHub Pages.
4. **Self-contained.** No build step on our side. If you use a framework, commit the built output.
5. **Size budget:** ≤ 10 MB per room, any single file ≤ 2 MB, `thumb` ≤ 300 KB. Use `.webp` and compress. 60 rooms × 10 MB fits well under the 1 GB Pages limit.
6. **Thumbnail required.** Ratio between 4:5 and 16:9, set `w`/`h` honestly.
7. **Include a way back.** Add one line before `</body>`: `<script src="../../nav.js"></script>`. It adds a floating pill with a Gallery link and a Rooms menu. CI warns if it is missing.
8. **No tracking, no ads, no crypto miners, no collecting visitor data, no forms that send data elsewhere.**
9. **No sensitive data.** No phone numbers, home address, NIM, other people's photos without their OK. The site is public.
10. **Third-party scripts/fonts/CDN: allowed, but own it.** If the CDN dies, your room breaks.
11. **No code that touches other rooms or the gallery.** No `localStorage` key without a `handle:` prefix. No redirects away on load. No `window.top` tricks.
12. **Accessibility floor:** your page must be readable and not flash rapidly (no more than 3 flashes per second). Provide `alt` on meaningful images.
13. **Content:** respectful, legal, campus-appropriate. Maintainer may remove a room that breaks this.

## Contribution rules
- One PR = one room (or one fix). Title: `room: <handle>` or `fix: ...`.
- Don't force-push after review starts.
- Edit your room as often as you like; same rules apply to every PR.

## Maintainer rules
- Merge only if CI is green and `index.html` has been skimmed for rules 8, 9, 11.
- `main` is protected: PR required, CI required.
- Keep CODEOWNERS accurate. A student only owns their own folder.
- Removal: delete the folder in a PR, note the reason. Git history keeps the record.

## Code rules (shell, `src/`)
- SvelteKit with `adapter-static`; no server routes, no `+page.server.ts`.
- Tailwind utilities first; no custom CSS unless a utility can't do it.
- No dependency unless it removes more code than it adds. Ask first.
- Shell never imports from `static/rooms/*` except `room.json`.
- Strict TypeScript. `Room` type lives in `src/lib/rooms.ts`.

## CI checks (`scripts/validate-rooms.mjs`)
1. Changed paths only inside the author's own room folder (maintainer exempt).
2. `room.json` valid per SCHEMA.md; handle matches folder.
3. `thumb.src` and `entry` exist.
4. Size limits (rule 5).
5. `index.html` has no `src="/…"` / `href="/…"` (rule 3). Warn only on a missing back link (rule 7).
