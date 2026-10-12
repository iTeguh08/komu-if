# PRD: komu-if

A collaborative class gallery for IF B Pagi, angkatan 14. Each student owns one room: a fully custom page. A gallery shell collects every room in one place.

## Problem
Class work and personality are scattered across chats and drives. We want one aesthetic place to show everyone, where each person's page looks nothing like the next.

## Goals
1. One gallery page that makes the whole class look good together.
2. Each student fully owns the look and content of their room (free HTML/CSS/JS).
3. Zero backend, zero cost, zero accounts beyond GitHub.
4. Adding a room = one pull request.

## Non-goals (cut on purpose)
- Login, database, comments, reactions, guestbook. (Collaboration = everyone contributes a room.)
- In-browser editor or CMS.
- Cross-room interaction. Revisit only if the class asks.
- Mobile app, i18n, analytics.

## Users
| Who | Needs |
|---|---|
| Student | Own a room, edit it freely, ship via PR |
| Maintainer (Teguh) | Keep the site up, merge safely, not babysit |
| Visitor | Browse the class, open any room, get back easily |

## Scope
Assumed ~30 to 60 rooms. Confirm in NEXTSTEP.

### MVP
- Gallery: grid of room cards, built from each `room.json`.
- Tag filter. Random order on each load.
- Room page: the student's own `index.html`, served as-is.
- PR checks: folder ownership, schema, size limit.
- Auto-deploy to GitHub Pages on merge to `main`.
- `CONTRIBUTING.md` / template room that a student can copy.

### Later (only if asked)
- "Back to gallery" widget injected for all rooms.
- Room-of-the-day, search, OG images.

## Success
- 80% of the class has a merged room within the first month.
- A new student can ship a room in under 30 minutes from the template.
- Gallery loads under 2 s on a mid phone (thumbnails only, lazy loaded).

## Constraints
- Hosting: GitHub Pages. Published site ≤ 1 GB, soft bandwidth 100 GB/month, repo must be public on a free plan. Source: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Stack: SvelteKit + Tailwind CSS (shell only), English UI and docs.
- Rooms are public. Students must opt in to what they publish.

## Risks
| Risk | Mitigation |
|---|---|
| Free HTML/JS means any room can break or abuse the site | Same-origin isolation is weak. PR review + CODEOWNERS + CI. See RULES.md |
| Maintainer review becomes a bottleneck | CI auto-checks everything mechanical. Review only looks at `index.html` for abuse |
| Students unfamiliar with git | Template room + 1-page guide. Maintainer can merge on behalf as fallback |
| Rooms ignore base path and 404 on GH Pages | Rule: relative paths only. CI greps for leading `/` in `src`/`href` |
| Class stops contributing | Keep scope small; the gallery is useful with 5 rooms |
