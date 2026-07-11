---
description: >-
  Bitbucket and Azure DevOps support in Argos, and how to use Argos with an
  unsupported Git provider.
---

# Other Git providers

Argos integrates natively with [GitHub](github-integration.md) and [GitLab](gitlab-integration.md). Other providers are not supported yet.

### Bitbucket

Argos does not support Bitbucket Cloud or Bitbucket Data Center. If a Bitbucket integration would be valuable to your team and you are open to partnering with us on its development, [contact us](https://argos-ci.com/contact).

### Azure DevOps

Argos does not support Azure DevOps. If an Azure DevOps integration would be valuable to your team and you are open to partnering with us on its development, [contact us](https://argos-ci.com/contact).

### Use Argos without a native integration

You can still run visual tests from any CI system: upload screenshots with `ARGOS_TOKEN` and review builds in the Argos dashboard. Without a native integration, Argos cannot post commit statuses or pull request comments on your provider, so you review changes in Argos directly.

Follow the [Quickstart](../../quickstart/README.md) to set up your project, and see the [CLI reference](../../sdks-reference/argos-command-line-interface-cli.md) for upload options.
