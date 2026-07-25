# AGENTS.md

This repository contains GitBook documentation, edited as markdown files synced with GitBook.

## Always use the documentation skills

Before creating or editing any documentation in this repo, read both skills in `.claude/skills/` (symlinks to `.agents/skills/`):

- **`write-gitbook`** — the GitBook authoring conventions you must follow:
  - GitBook content structure (pages, spaces, collections, `SUMMARY.md`, `.gitbook.yaml`)
  - Frontmatter fields and page configuration
  - GitBook-flavored markdown and custom block syntax (hints, tabs, steppers, cards, includes, etc.)
  - Reusable content, variables, and best practices
- **`documentation-writer`** — how to decide what to write: the Diátaxis quadrants (tutorial, how-to, reference, explanation), audience, and tone.

Use them whenever you write, update, or restructure markdown in this repository — under `docs/` (which contains `learn/`, `quickstart/`, `sdks-reference/`, and `agents/`), under `api-reference/`, or anywhere else.

## Keep the table of contents in sync

Adding a page is not enough: register it in `docs/SUMMARY.md`, and link it from the relevant section `README.md` so it is reachable by navigation.
