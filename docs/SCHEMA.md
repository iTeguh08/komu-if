# Schema

Only one data file: `static/rooms/<handle>/room.json`. No database.

## Fields
| Field | Type | Required | Rule |
|---|---|---|---|
| `v` | integer | yes | Always `1`. Bump when the shape changes |
| `handle` | string | yes | `^[a-z0-9-]{2,24}$`. Must equal the folder name. Not your NIM |
| `name` | string | yes | Display name, 1 to 40 chars |
| `tagline` | string | yes | 1 to 80 chars |
| `tags` | string[] | no | Max 5, each `^[a-z0-9-]{2,16}$` |
| `thumb` | object | yes | `{ "src": "thumb.webp", "w": 800, "h": 1000 }`. `w`/`h` set the card aspect ratio |
| `accent` | string | no | Hex color `#rrggbb` used for the card hover glow |
| `entry` | string | no | Default `index.html`. Relative path inside the folder |
| `links` | object | no | Keys: `github`, `instagram`, `site`. Values: `https://` URLs only |

Unknown fields are a CI error. This prevents silent typos.

## JSON Schema (extract to `room.schema.json` later)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": ["v", "handle", "name", "tagline", "thumb"],
  "properties": {
    "v": { "const": 1 },
    "handle": { "type": "string", "pattern": "^[a-z0-9-]{2,24}$" },
    "name": { "type": "string", "minLength": 1, "maxLength": 40 },
    "tagline": { "type": "string", "minLength": 1, "maxLength": 80 },
    "tags": {
      "type": "array",
      "maxItems": 5,
      "items": { "type": "string", "pattern": "^[a-z0-9-]{2,16}$" }
    },
    "thumb": {
      "type": "object",
      "additionalProperties": false,
      "required": ["src", "w", "h"],
      "properties": {
        "src": { "type": "string" },
        "w": { "type": "integer", "minimum": 100, "maximum": 4000 },
        "h": { "type": "integer", "minimum": 100, "maximum": 4000 }
      }
    },
    "accent": { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
    "entry": { "type": "string", "default": "index.html" },
    "links": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "github": { "type": "string", "pattern": "^https://" },
        "instagram": { "type": "string", "pattern": "^https://" },
        "site": { "type": "string", "pattern": "^https://" }
      }
    }
  }
}
```

## Example
```json
{
  "v": 1,
  "handle": "teguh",
  "name": "Teguh",
  "tagline": "Builds things at 2 AM.",
  "tags": ["web", "music"],
  "thumb": { "src": "thumb.webp", "w": 800, "h": 1000 },
  "accent": "#ff5a36",
  "links": { "github": "https://github.com/teguh" }
}
```

## TypeScript (shell)
```ts
export type Room = {
  v: 1;
  handle: string;
  name: string;
  tagline: string;
  tags?: string[];
  thumb: { src: string; w: number; h: number };
  accent?: string;
  entry?: string;
  links?: { github?: string; instagram?: string; site?: string };
};
```

## Derived values (not stored)
- Room URL: `{base}/rooms/{handle}/` (or `{entry}` if set).
- Thumb URL: `{base}/rooms/{handle}/{thumb.src}`.
- "Last updated": from `git log`, never typed by hand.
