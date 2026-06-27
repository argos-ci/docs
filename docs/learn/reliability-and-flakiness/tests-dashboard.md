---
description: Get a project-wide view of test stability, with every test ranked by flakiness score in the Argos dashboard.
---

# Tests dashboard

The Tests dashboard gives you a view of test stability ranked by flakiness score, so the most flaky tests show up first. It comes in two scopes: a **project** dashboard for a single project, and an **account** dashboard that aggregates tests across every project you can access.

![Tests dashboard showing a list of tests with flakiness metrics](<../../.gitbook/assets/tests dashboard 0e272203e4b55b8d11f669564169009f.png>)

_**A project Tests dashboard with flakiness metrics**_

### Open the project dashboard

1. Open your project in Argos.
2. Click the **Tests** tab.

### How tests are ranked

Tests are sorted by **flakiness score** (descending). The tests at the top are the most flaky.

### Columns explained

* **Test**: The latest screenshot uploaded for the test, the test name, and the build name.
* **Last change**: The most recent change detected on an auto-approved build during the selected period.
* **Flakiness**: A score that summarizes how flaky a test is based on its stability and consistency.
* **Changes**: The number of changes detected for the test during the selected period.
* **Stability**: The ratio of changes to total reference builds. A lower stability rate means the test is more likely to be flaky.
* **Consistency**: The ratio of one-off changes to total changes. A lower consistency rate means the test is more likely to be flaky.

### Filter and time range

* Filter tests by **build name** to focus on a subset of runs.
* Choose a **time period** to control which changes and scores are included.

### Open a test page

Click any row to open the detailed test page and review history and stability details. See [Flaky test detection](flaky-test-detection.md) for more information.

### See tests across all your projects

Flaky tests are no longer buried per project. The account-level **Tests** dashboard aggregates the active tests across every project you can see and ranks them by flakiness, so the noisiest tests surface first — wherever they live.

1. Select your account or team in Argos.
2. Click the **Tests** tab.

<!-- 📸 IMAGE NEEDED: The account-level Tests dashboard listing tests from multiple projects, with the Project column visible. -->

It shows the same flakiness, stability, and consistency metrics as the project dashboard, plus a **Project** column so you can tell where each test comes from. A test counts as **active** when it appears in the latest reference build for its build name. You only see tests from projects you have access to.

