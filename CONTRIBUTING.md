# Contributing a room

Each student owns one folder: `static/rooms/<your-handle>/`. Read [docs/RULES.md](docs/RULES.md) first.

## Steps

1. Fork the repo on GitHub.
2. Copy the template: `cp -r static/rooms/_template static/rooms/<your-handle>`.
3. Edit `room.json`: `handle` must equal the folder name, `door_code` must be 2 unique digits, and `thumb` must point to a real file.
4. Build your room in that folder only. Use relative paths.
5. Check locally: `npm run validate-rooms`, then `npm run build`.
6. Open a pull request titled `room: <your-handle>`. Only change files inside your folder.

CI runs the validator and the build on every pull request. A PR that changes another student's folder is blocked.

## Local preview

```sh
npm install
npm run dev
```

Open http://localhost:5173 and go to `/rooms/<your-handle>/`.
