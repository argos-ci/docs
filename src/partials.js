import * as React from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const relativeUrl = (baseUrl = "", path = "") =>
  `${baseUrl}${path.replace(/^\//, "")}`;

export const InstallDevDep = ({ dependency, showCliLink = false }) => {
  const { siteConfig } = useDocusaurusContext();
  const { baseUrl } = siteConfig;

  return (
    <>
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
        <p className="text-sm !-mt-2">
          Read the{" "}
          <a href={relativeUrl(baseUrl, "argos-cli")}>CLI documentation</a> if
          you need information about advanced usages.
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
      <span style={{ fontWeight: 600 }}>Note</span>: you need a reference build
      to compare your changes with. If you don't have one, builds will remain
      orphan until you run Argos on your reference branch.
    </p>
    <p>
      You can now review changes of your app for each pull request, avoid visual
      bugs and merge with confidence. Welcome on board!
    </p>
  </>
);

export const AfterScreenshotSetup = () => {
  const { siteConfig } = useDocusaurusContext();
  const { baseUrl } = siteConfig;

  return (
    <>
      <h2>Next step</h2>
      <p>
        The next step is to{" "}
        <a href={relativeUrl(baseUrl, "upload-screenshots")}>
          integrate the Argos CLI command
        </a>{" "}
        within your Continuous Integration (CI) workflow. This command will
        automatically upload your captured screenshots to Argos for further
        review and analysis.
      </p>
    </>
  );
};

export const HelpSection = () => (
  <>
    <a href="https://argos-ci.com/discord">Join our Discord</a>,{" "}
    <a href="https://github.com/argos-ci/argos/issues">
      submit an issue on GitHub
    </a>{" "}
    or just <a href="mailto:contact@argos-ci.com">send an email</a> if you need
    help.
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

export const AddSecret = ({ folder }) => (
  <div>
    <p>
      Add this command to your CI pipeline to upload the screenshots to Argos.
    </p>
    <CodeBlock>{`npm exec -- argos upload --token <ARGOS_TOKEN> ${folder}`}</CodeBlock>
    <div>
      <span style={{ fontWeight: 600 }}>Tip</span>: On GitHub Actions, you don't
      need to set your Argos token, it is automatically detected. On other CI,
      we recommended to use a variable to store your Argos token.
    </div>
  </div>
);

export const AdditionalResources = ({ children }) => (
  <div style={{ marginTop: 50, marginBottom: 50 }}>
    <h3>Additional Resources</h3>
    <ul>{children}</ul>
  </div>
);

export const AddToGitIgnore = ({ path = "/screenshots" }) => (
  <p>
    Add <code>{path}</code> to your <code>.gitignore</code> file, to avoid
    uploading screenshots to your Git repository.
  </p>
);

export const PlaywrightConfig = () => (
  <>
    <p>
      The Argos reporter seamlessly uploads screenshots and traces to Argos in
      real-time.
    </p>
    <CodeBlock language="js" title="playwright.config.ts">
      {`
import { defineConfig } from "@playwright/test";

export default defineConfig({
  // ... other configuration

  // Reporter to use
  reporter: [
    ["html"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

        // Set your Argos token (needed if not using GitHub Actions).
        token: "<YOUR-ARGOS-TOKEN>",
      },
    ],
  ],

  // Setup recording option to enable test debugging features.
  use: {
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',

    // Capture screenshot after each test failure.
    screenshot: "only-on-failure",
  },
});
      `.trim()}
    </CodeBlock>
    Playwright's{" "}
    <a
      href="https://playwright.dev/docs/test-use-options#recording-options"
      target="_blank"
      rel="noopener noreferrer"
    >
      recording options
    </a>{" "}
    facilitate the automated capture of screenshots upon test failures. Notably,
    these captured screenshots and traces are then automatically uploaded to
    Argos.
  </>
);

export const PlaywrightCaptureScreenshot = () => (
  <div>
    <p>
      Use <code>argosScreenshot</code> helper to capture stable screenshots in
      your E2E tests.
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

export const ScreenshotGuidesLink = () => {
  const { siteConfig } = useDocusaurusContext();
  const { baseUrl } = siteConfig;

  return (
    <p className="small">
      <span style={{ fontWeight: 600 }}>Tip</span>: Check out our guides to{" "}
      <a href={relativeUrl(baseUrl, "screenshot-pages-script")}>
        screenshot multiple pages
      </a>{" "}
      or{" "}
      <a href={relativeUrl(baseUrl, "viewports")}>capture multiple viewports</a>
      .
    </p>
  );
};
