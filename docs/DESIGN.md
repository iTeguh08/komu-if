# Design

Status: **proposal**. Visual direction was not specified, so this is a default to react to. Veto freely.

## Concept
The shell is a **quiet museum wall**. Neutral, dark, almost no color of its own. The rooms bring all the color. The gallery should look best when 40 wildly different thumbnails sit side by side, so the frame must never compete with them.

## Principles
1. Frame, don't compete: shell is monochrome plus one accent.
2. Fair: no ranking, no featured rooms. (Order is alphabetical for now, see Decisions.)
3. Thumbnails are the content. Text is secondary.
4. Leaving a room and coming back must feel effortless.

## Tokens (Tailwind v4 `@theme`)
| Token | Value | Use |
|---|---|---|
| `--color-wall` | `#0b0b0c` | Page background |
| `--color-ink` | `#ecebe6` | Primary text (warm off-white, not pure white) |
| `--color-mute` | `#8a8984` | Secondary text |
| `--color-line` | `#222221` | Borders |
| `--color-accent` | `#ff5a36` | Single highlight (focus ring, active tag) |
| Radius | `2px` cards, `999px` tags | Frames feel like frames |
| Display font | Instrument Serif | Title, room names |
| Body font | Geist Sans | Everything else |
| Mono font | Geist Mono | Handles, tags |

Fonts: self-host via Fontsource to avoid a third-party request.

## Gallery layout
- Header: small wordmark `komu-if` left, `IF B Pagi · Angkatan 14` right, tiny. No hero banner.
- Tag filter: one row of pills under the header, horizontally scrollable on mobile.
- Wall: CSS columns masonry (`columns-2 md:columns-3 xl:columns-4`), gap 16px. Card height comes from `thumb.w/h`, so there is no layout shift.
- Card: thumbnail fills the frame. On hover/focus: slight darken, name (Instrument Serif), tagline, and a glow border using the room's `accent`. Touch devices show name permanently as a bottom gradient label.
- Footer: link to the repo and "Add your room" (CONTRIBUTING).

## Room entry
Click → full page navigation to `/rooms/<handle>/`. No transition hacks; the room is a different document. Keep it honest and fast.

## Motion
- Cards fade/translate in on first view (opacity + 8px, 300ms, stagger capped at 8 items).
- Hover glow transition 200ms.
- Respect `prefers-reduced-motion`: disable translate/stagger.

## States
| State | Behavior |
|---|---|
| Empty gallery | One sentence: "No rooms yet. Be the first." + CONTRIBUTING link |
| Broken thumb | Solid `--color-line` frame with the name; never a broken-image icon |
| Filter with no result | "Nothing tagged `x`." + clear button |

## Accessibility
- Whole card is one `<a>`; visible focus ring in `--color-accent`.
- Contrast: `ink` on `wall` ≈ 16:1; `mute` on `wall` ≥ 4.5:1. Re-check if tokens change.
- Thumb `alt` = `"{name}'s room"`.

## Room template (`static/rooms/_template`)
Minimal `index.html` with a visible back link, a comment block listing the rules, and a placeholder `thumb.webp`. Deliberately ugly-plain so nobody mistakes it for a style to copy.

## Decisions
- Dark wall (decided). Takes minimalist-ui principles (editorial type, flat, no gradients, no heavy shadows) but not its light palette.
- Straight to the wall, no hero (decided).
- Order is alphabetical, not shuffled: the page is prerendered and a client shuffle would flash. Revisit if asked.
- Skills for build/review: `impeccable` + `minimalist-ui`.

## Open design questions
- Any class identity (logo, colors, motto) to adopt?
