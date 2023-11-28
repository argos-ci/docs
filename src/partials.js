import * as React from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const InstallDevDep = ({ dependency }) => {
  return (
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

export const RepositoryExampleLink = () => (
  <p>
    For a repository examples, check out our{" "}
    <a href="https://github.com/argos-ci/argos/tree/main/examples">
      GitHub repository
    </a>
    .
  </p>
);

export const Enjoy = () => (
  <>
    <h2>What's next?</h2>
    <p>
      Congratulations on installing Argos! 👏
      <br />
      You can now review the visual changes of your app for each pull request,
      avoid UI bugs and merge with confidence! Visit our{" "}
      <a href="review-changes">review changes</a> section to learn how to.
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
    <p>Follow these steps to set up your project in Argos:</p>
    <ol>
      <li>
        <a href="https://app.argos-ci.com/signup">Sign up</a> on Argos.
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
        <span style={{ fontWeight: 600 }}>Github Actions</span> — No extra setup
        required! Argos works out-of-the-box with GitHub Actions, using a
        tokenless strategy for pull requests.
      </li>
      <li>
        <span style={{ fontWeight: 600 }}>Other CI Platforms</span> — Add{" "}
        <code>ARGOS_TOKEN</code> to your CI environment variables.
      </li>
    </ul>
  </div>
);
