# Flaky Test Detection

Argos flags unstable tests so you can decide with confidence. See a flaky badge next to every changed test and dive into detailed history and stability scores on a dedicated test page

![Flaky indicator next to a test change](<../../.gitbook/assets/flaky indicator 8b0a3212a9d038be252e87cea60354d8.png>)

_Example of the flaky indicator in a build review_

### View flaky indicators in your build review

1. Open any build in Argos
2. Spot the flaky badge beside each changed test
3. Hover over the badge to see details about the test's stability

### Explore the test page

By clicking on the flaky badge, you will be taken to the test page where you can see the full history of the test and its stability score.

![Test page showing history and flaky score](<../../.gitbook/assets/test page example 44fb44458d2d5a457bad6eb9d6ddb29c.png>)

_A sample test page with history timeline and score_

On the test page you will find:

* Timeline of every change that affected the test
* Stability graph showing pass rate over time
* Calculated flaky score from zero up to one hundred
* List of changes happened to the test

Use this information to approve stable tests or flag flaky ones for fixes.

### Ignore changes

When reviewing a visual test result in Argos, you may encounter changes that are not relevant or are caused by flakiness. You can **ignore a specific change** directly from the UI.

From the build page or the test page, click on the "Ignore" button next to the change you want to ignore.

Once ignored, Argos will no longer notify you if this **exact same change** happens again in future builds. This lets you filter out noise while keeping future regressions detectable.

### Automatically ignore recurring flaky changes

You can also configure Argos to automatically ignore recurring flaky changes across builds.

To configure auto-ignore:

1. Open your project in Argos
2. Go to **Project Settings**
3. Find **Automatically ignore flaky changes**
4. Enable the toggle
5. Set **Minimum occurrences to consider a change flaky (last 7 days)**
6. Click **Save**

![Auto-ignore flaky changes in project settings](<../../.gitbook/assets/auto ignore fce4000798bcef00801460c36c56dbad.png>)

The minimum occurrences value controls how many times the same change must appear in the last 7 days before Argos starts ignoring it automatically.

#### Best Use Cases

* Flaky UI elements that appear/disappear randomly or render inconsistently.
* Non-deterministic image rendering (e.g. base64 previews, antialiasing issues).
