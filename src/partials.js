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
    </Tabs>
  );
};

export const RunPkgCommand = ({ command }) => {
  const commands = Array.isArray(command) ? command : [command];
  return (
    <Tabs groupId="package-managers">
      <TabItem value="npm" label="npm" default>
        <BlocCode>
          {commands.map((command) => `npx ${command}`).join("\n")}
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
  <p>
    Congratulations, Argos is now installed! 🎉
    <br />
    Learn how to <a href="/review-changes">review changes</a> in your
    pull-requests.
  </p>
);
