# data.md — Development Log

A running log of what was built, decisions made, and problems solved. One entry per session.

---

## Log Format

```
## [YYYY-MM-DD] — Session Title

**Status:** In Progress | Done | Blocked
**Time Spent:** X hours

### What was done
- Bullet list of completed work

### Decisions made
- Decision → reason

### Problems encountered
- Problem → solution (or status if unresolved)

### Next session
- What to do next
```

---

## Sample Entries

---

## [2026-03-23] — Project Initialization

**Status:** Done
**Time Spent:** 1 hour

### What was done
- Created project folder structure
- Created documentation files: `claude.md`, `data.md`, `tasks.md`, `architecture.md`
- Defined tech stack and development phases

### Decisions made
- Using Supabase for PostgreSQL → simpler setup, built-in auth support, free tier
- Using n8n for automation → visual workflow builder, easy webhook integration
- Splitting documents into chunks server-side → gives more control over chunk size vs. using a library

### Problems encountered
- None yet

### Next session
- Initialize frontend with Vite + React + Tailwind
- Initialize backend with Express + folder structure
- Create `.env.example` and install base dependencies

---

## How to Track Progress

1. **After every dev session**, add a new entry to this file.
2. Keep entries honest — include blockers and unsolved problems.
3. Decisions section is critical: record **why** a choice was made, not just what.
4. Reference task IDs from `tasks.md` where relevant (e.g., `[MVP-03]`).
5. Commit this file along with your code changes.

---

> This log is for your own reference and for explaining your process during the graduation defense.
