import * as React from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const InstallDevDep = ({ dependency, showCliLink = true }) => {
  return (
    <>
      <h4>I. Install Packages</h4>
      <Tabs groupId="package-managers">
        <TabItem value="npm" label="npm" default>
          <CodeBlock>npm i --save-dev {dependency}</CodeBlock>
        </TabItem>
        <TabItem value="yarn" label="yarn">
          <CodeBlock>yarn add --dev {dependency}</CodeBlock>
        </TabItem>
        <TabItem value="pnpm" label="pnpm">
          <CodeBlock>pnpm add --save-dev {dependency}</CodeBlock>
        </TabItem>
        <TabItem value="bun" label="bun">
          <CodeBlock>bun add --dev {dependency}</CodeBlock>
        </TabItem>
      </Tabs>
      {showCliLink && (
        <p className="small" style={{ marginTop: -6, marginBottom: 30 }}>
          Read the <a href="/argos-cli">CLI documentation</a> if you need
          information about advanced usages.
        </p>
      )}
    </>
  );
};

export const RunPkgCommand = ({ command }) => {
  const commands = Array.isArray(command) ? command : [command];
  return (
    <Tabs groupId="package-managers">
      <TabItem value="npm" label="npm" default>
        <CodeBlock>
          {commands.map((command) => `npm exec ${command}`).join("\n")}
        </CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock>
          {commands.map((command) => `yarn run ${command}`).join("\n")}
        </CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock>
          {commands.map((command) => `pnpm exec ${command}`).join("\n")}
        </CodeBlock>
      </TabItem>
      <TabItem value="bun" label="bun">
        <CodeBlock>
          {commands.map((command) => `bun x ${command}`).join("\n")}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export const Congratulation = () => (
  <>
    <h2>Congratulations on installing Argos! 👏</h2>
    <p>
      After committing and pushing your changes, the Argos check status will
      appear on your pull request in GitHub (or GitLab).
    </p>
    <p className="small">
      <span style={{ fontWeight: 600 }}>Note</span>: The first build is an
      'orphan'. It will become the reference baseline for future comparisons
      once merged into the main branch.
    </p>
    <p>
      You can now review changes of your app for each pull request, avoid visual
      bugs and merge with confidence. Welcome on board!
    </p>
  </>
);

export const AfterScreenshotSetup = () => (
  <>
    <h2>Next step</h2>
    <p>
      The next step is to{" "}
      <a href="upload-screenshots">integrate the Argos CLI command</a> within
      your Continuous Integration (CI) workflow. This command will automatically
      upload your captured screenshots to Argos for further review and analysis.
    </p>
  </>
);

export const HelpSection = () => (
  <>
    Have questions or need further assistance? Feel free to{" "}
    <a href="https://argos-ci.com/discord">join our Discord</a> for support.
    We're here to help!
  </>
);

export const SetUpProjectInArgos = () => (
  <div>
    <ol type="I">
      <li>
        <a href="https://app.argos-ci.com/signup">Sign up</a> or{" "}
        <a href="https://app.argos-ci.com/login">Login</a> to Argos.
      </li>
      <li>Click on "Create a new project".</li>
      <li>Select your Git provider and import your repository.</li>
    </ol>
  </div>
);

export const AddSecret = () => (
  <div>
    <p>
      Add this command to your CI pipeline to upload the screenshots to Argos.
    </p>
    <CodeBlock>npx @argos-ci/cli upload cypress/screenshots</CodeBlock>
    <p>Then,</p>
    <div>
      <h4>GitHub Actions</h4>
      <p>
        <span style={{ fontWeight: 600 }}>No extra setup required!</span> —
        Argos works out-of-the-box with GitHub Actions, using a tokenless
        strategy for pull requests.
      </p>
      <h4>Other CI Platforms</h4>
      <p>
        Add <code>ARGOS_TOKEN</code> to your CI environment variables.
      </p>
    </div>
  </div>
);

export const AdditionalResources = ({ children }) => (
  <div style={{ marginTop: 50, marginBottom: 50 }}>
    <h3>Additional Resources</h3>
    <ul>
      <li>
        <a href="https://github.com/argos-ci/argos/tree/main/examples">
          Example repositories
        </a>
      </li>
      <li>
        <a href="/argos-cli">Argos CLI doc</a>
      </li>
      {children}
    </ul>
  </div>
);

export const AddToGitIgnore = ({ path = "/screenshots" }) => (
  <p>
    Add <code>{path}</code> to your <code>.gitignore</code> file, to avoid
    uploading screenshots to your Git repository.
  </p>
);

export const PlaywrightConfig = () => (
  <div>
    <p>
      Configure Playwright to capture screenshots on test failures and to use
      the Argos reporter.
    </p>
    <CodeBlock language="js" title="playwright.config.ts">
      {`export default defineConfig({
  // ...
  // Adds Argos reporter in CI environments
  reporter: process.env.CI
    ? [["list"], ["@argos-ci/playwright/reporter"]]
    : "list",

  use: {
    // Capture a screenshot when a test fails
    screenshot: "only-on-failure",

    // Keeps traces for failed tests
    trace: "retain-on-failure",
  },
});`}
    </CodeBlock>
    <AddToGitIgnore path="/screenshots" />
  </div>
);

export const PlaywrightCaptureScreenshot = () => (
  <div>
    <h4>II. Update your E2E tests</h4>
    <p>
      Use <code>argosScreenshot</code> helper to capture stable screenshots in
      your E2E tests. <br />
      For example:
    </p>
    <CodeBlock language="js" title="tests/example.spec.ts">
      {`import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

test("screenshot homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await argosScreenshot(page, "homepage");
});`}
    </CodeBlock>
  </div>
);

export const ScreenshotGuidesLink = () => (
  <p className="small">
    <span style={{ fontWeight: 600 }}>Tip</span>: Check out our guides to{" "}
    <a href="/screenshot-pages-script">streamline page screenshot captures</a>{" "}
    or <a href="/viewports">capture multiple viewports</a>.
  </p>
);

export const PlaywrightSetupCI = () => (
  <div>
    <p>Quickly integrate Argos with your CI setup:</p>
    <h4>GitHub Actions</h4>
    <p>
      <span style={{ fontWeight: 600 }}>No extra setup required!</span> — Argos
      works out-of-the-box with Playwright and GitHub Actions, using a tokenless
      strategy for pull requests.
    </p>
    <h4>Other CI Platforms</h4>
    <p>
      Add <code>ARGOS_TOKEN</code> to your CI environment variables.
    </p>
  </div>
);
