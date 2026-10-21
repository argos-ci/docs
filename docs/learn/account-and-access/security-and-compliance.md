---
description: "Where Argos hosts your data, its SOC 2 Type II and GDPR compliance, the DPA, and how long your data is kept, how to export it, and how to delete it."
---

# Security and compliance

This page answers the questions security and procurement teams ask most often. For the controls Argos applies, such as encrypted access tokens and least-privilege access, see the [Argos security page](https://argos-ci.com/security).

### Where your data is hosted

Argos runs on Amazon Web Services. Your data, screenshots included, is stored in the United States and replicated to the European Union. It is encrypted at rest and in transit.

There is no data residency option: you can't choose the region where your data is stored.

### SOC 2 Type II

Argos is SOC 2 Type II compliant, audited by Prescient Security and continuously monitored with Vanta. Request the report from the [Argos trust center](https://argos-ci.com/trust-center).

### GDPR and the DPA

Argos is GDPR compliant. It is operated by Smooth Code SAS, a company established in France.

- **Data Processing Agreement**: The [Argos DPA](https://argos-ci.com/dpa) applies automatically, without a signature, wherever Argos processes personal data on your behalf. If your procurement process needs a signed copy, request one at [contact@argos-ci.com](mailto:contact@argos-ci.com).
- **International transfers**: When personal data goes to a subprocessor outside the European Economic Area, in a country without an EU adequacy decision, the transfer relies on the European Commission's Standard Contractual Clauses, or on the EU-U.S. Data Privacy Framework for a certified US subprocessor.
- **Subprocessors**: The current list is published in the [trust center](https://app.eu.vanta.com/argos/trust/8z3w834xz9a4snga4obms/subprocessors) and summarized in the [privacy policy](https://argos-ci.com/privacy). Argos tells customers before a new subprocessor starts processing their data, as set out in the DPA.

### Data retention

Argos keeps builds, screenshots and diffs with no expiry, on every plan.

Media sharing files have their own retention, which depends on your plan: see [Share links, retention and limits](../media/share-links-retention-and-limits.md#retention). For deployments, see [Lifecycle and retention](../deployments/retention.md).

### Export your data

There is no one-click export, but the [Argos CLI](../../sdks-reference/argos-command-line-interface-cli.md#downloading-screenshots-and-baselines) downloads screenshots with a project token. `argos build list` lists a project's builds, `argos build download` saves the screenshots of one build, and `argos baseline download` saves the screenshots of the project's latest baseline:

```bash
export ARGOS_TOKEN=<project-token>
argos build download 72652   # into ./argos-build-72652
argos baseline download      # into ./argos-baseline
```

Files are saved under their snapshot names, so a directory uploaded with `argos upload` comes back with the same layout.

### Delete your data

You can delete a project, a team or your personal account, from the **General** section of its **Settings**. Deleting a team or your personal account deletes all of its projects. Deletion can't be undone.

You can't delete individual builds or screenshots.

### Self-hosting

Argos is open source. For what that means if you want to run it yourself, see [Open source and self-hosting](../../README.md#open-source-and-self-hosting).
