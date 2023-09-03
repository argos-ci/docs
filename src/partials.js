import * as React from "react";
import BlocCode from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const InstallDevDep = ({ dependency }) => {
  return (
    <Tabs groupId="package-managers">
      <TabItem value="npm" label="npm" default>
        <BlocCode>npm i --save-dev {dependency}</BlocCode>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <BlocCode>yarn add --dev {dependency}</BlocCode>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <BlocCode>pnpm add --save-dev {dependency}</BlocCode>
      </TabItem>
      <TabItem value="bun" label="bun">
        <BlocCode>bun add --dev {dependency}</BlocCode>
      </TabItem>
    </Tabs>
  );
};

export const RunPkgCommand = ({ command }) => {
  const commands = Array.isArray(command) ? command : [command];
  return (
    <Tabs groupId="package-managers">
      <TabItem value="npm" label="npm" default>
        <BlocCode>
          {commands.map((command) => `npm exec ${command}`).join("\n")}
        </BlocCode>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <BlocCode>
          {commands.map((command) => `yarn run ${command}`).join("\n")}
        </BlocCode>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <BlocCode>
          {commands.map((command) => `pnpm exec ${command}`).join("\n")}
        </BlocCode>
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
      Congratulations on installing Argos! 🎉
      <br />
      The next step is to integrate visual review into your development
      workflow. Visit our <a href="review-changes">review changes</a> section to
      learn how to.
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
