# Argos Documentation

This repository contains the official [Argos](https://argos-ci.com) documentation, hosted on [GitBook](https://www.gitbook.com).

The content is authored as Markdown files and synced with GitBook, so the published docs at [argos-ci.com/docs](https://argos-ci.com/docs) and the files in this repository stay in sync.

## Structure

This repository holds two GitBook spaces:

- [docs/](docs/) — the main documentation space
  - [docs/SUMMARY.md](docs/SUMMARY.md) — the table of contents that defines the page hierarchy
  - [docs/quickstart/](docs/quickstart/) — getting-started guides for each test framework
  - [docs/learn/](docs/learn/) — conceptual guides and how-tos
  - [docs/sdks-reference/](docs/sdks-reference/) — SDK and CLI reference
- [api-reference/](api-reference/) — the REST API reference space (introduction, pagination, rate limits, errors, and the OpenAPI spec)

## Contributing

When writing or editing documentation, follow the GitBook authoring conventions documented in the `writing-docs` skill (see [AGENTS.md](AGENTS.md) for details). This covers GitBook-flavored Markdown, custom blocks, frontmatter, and reusable content.
