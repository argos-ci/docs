import * as React from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const InstallDevDep = ({ dependency, showCliLink = true }) => {
  return (
    <div>
      <p style={{ marginBottom: 8, fontWeight: 600 }}>
        I. Install Argos dependency using your favorite package manager.
      </p>
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
        <p style={{ marginTop: -6, marginBottom: 30 }}>
          Read the <a href="/argos-cli">CLI documentation</a> if you need
          information about advanced usages.
        </p>
      )}
    </div>
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

export const TestingInstallation = () => (
  <div>
    <p>
      After committing and pushing your changes to your repository, the Argos
      check status will appear on your pull request in GitHub (or GitLab). To
      view the initial build on Argos, click the "Details" link.
    </p>
    <p>
      <span style={{ fontWeight: 600 }}>Note</span>: The initial build is
      considered an 'orphan' build. It serves as a baseline for future
      comparisons and will become the reference point once merged into the main
      branch.
    </p>
  </div>
);

export const Congratulation = () => (
  <>
    <h2>Congratulations on installing Argos! 👏</h2>
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
    <ul>
      <li>
        <div style={{ fontWeight: 600 }}>
          GitHub Actions — No extra setup required!
        </div>
        Argos works out-of-the-box with GitHub Actions, using a tokenless
        strategy for pull requests.
      </li>
      <li style={{ marginTop: 10 }}>
        <span style={{ fontWeight: 600 }}>Other CI Platforms</span> — Add{" "}
        <code>ARGOS_TOKEN</code> to your CI environment variables.
      </li>
    </ul>
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
    <p>
      Consider adding <code>/screenshots</code> to <code>.gitignore</code> file,
      to avoid uploading screenshots to your Git repository.
    </p>
  </div>
);

export const PlaywrightCaptureScreenshot = () => (
  <div>
    <p style={{ fontWeight: 600 }}>
      II. In your E2E tests, use <code>argosScreenshot</code> to capture stable
      screenshots:
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
  <p>
    <span style={{ fontWeight: 600 }}>Tip</span>: Check out our guides to
    captures <a href="/screenshot-pages-script">streamline pages screenshot</a>{" "}
    or <a href="/viewports">capture multiple viewports</a>.
  </p>
);

export const PlaywrightSetupCI = () => (
  <div>
    <p>Quickly integrate Argos with your CI setup:</p>
    <ul>
      <li>
        <div style={{ fontWeight: 600 }}>
          GitHub Actions — No extra setup required!
        </div>
        Argos works out-of-the-box with Playwright and GitHub Actions, using a
        tokenless strategy for pull requests.
      </li>
      <li style={{ marginTop: 10 }}>
        <span style={{ fontWeight: 600 }}>Other CI Platforms</span> — Simply add{" "}
        <code>ARGOS_TOKEN</code> to your CI environment variables.
      </li>
    </ul>
  </div>
);
