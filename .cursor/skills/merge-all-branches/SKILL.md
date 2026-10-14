---
name: merge-all-branches
description: Merge every remote branch except master (krishna, teguh, kensayangjeta/raditya, and any new ones) into master for komu-if, resolve known conflicts, verify, then ask before pushing. Use when the user says gabungkan/merge semua branch, sync branch teman ke master, or teammates have pushed new work.
---

# Merge all branches into master (komu-if)

Teammates push to their own branches (`krishna`, `teguh`, `kensayangjeta`, ...). Master is the integration branch. Branch list is dynamic: never hardcode it.

## Rules

- Never push without the user's confirmation. Never force-push.
- Merge one branch at a time (not octopus), so conflicts are attributable.
- Never discard a teammate's work silently; report every conflict resolution.
- Uncommitted local changes: stop and ask (commit or stash first).

## Steps

1. Prepare
   ```bash
   git status --short            # must be clean (ignore nothing silently)
   git checkout master
   git pull origin master
   git fetch origin --prune
   git branch -r | grep -v -e 'origin/HEAD' -e 'origin/master'   # branches to merge
   ```
2. For each branch `B` in that list that has new commits (`git log master..origin/B --oneline` is non-empty):
   ```bash
   git merge origin/B
   ```
   On success continue. On conflict, see "Known conflicts", resolve, `git add`, `git commit`.
3. Verify (see below). Fix or report failures.
4. Summarize: branches merged, conflicts and how resolved, verify results. Ask: "push origin master?" Only then `git push origin master`.
5. Tell teammates (in summary) to `git merge origin/master` into their branch if they want to stay in sync.

## Known conflicts

- **`node_modules/` or `.svelte-kit/` conflicts**: these dirs are in `.gitignore` but ~3900 files are still tracked in git, so branches that run `npm install` conflict with master. Resolve by taking master's version:
  ```bash
  git checkout --ours -- node_modules .svelte-kit 2>/dev/null
  git add node_modules .svelte-kit
  ```
  Long-term fix (ask user first): `git rm -r --cached node_modules .svelte-kit && git commit -m "untrack node_modules"`. Do this on master before merging so teammates stop conflicting.
- **rename/delete on `krishna-sugosa/`** (old path deleted by krishna's "delete the games" commit; master moved it to `static/rooms/krishna-sugosa/`): keep master's `static/rooms/krishna-sugosa/` (`git add static/rooms/krishna-sugosa`). Rooms live under `static/rooms/<handle>/`; if a branch deletes or recreates a room at the old root path, keep the `static/rooms/` version.
- **`package-lock.json`**: take master's, then `npm install` to regenerate; commit if it changed.
- Anything else: show the conflict to the user and ask. Do not guess.

## Verify

`npm run dev` / `npm run build` can fail with `vite: Permission denied` (tracked node_modules lost exec bit). Use node directly:

```bash
npm run validate-rooms                          # every room.json must be valid
node node_modules/vite/bin/vite.js build        # must end with "done"
```

Prerender 404 warnings for `/rooms/<handle>/` are known and OK if the build finishes.

Known validation failure to watch for: a room missing `door_code` (must be 2 digits), e.g. `raditya-room`. Report which room and which teammate owns it; do not invent a code unless the user gives one.

Dev server for manual check: `node node_modules/vite/bin/vite.js dev` (http://localhost:5173).
