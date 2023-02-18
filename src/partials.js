import * as React from "react";
import BlocCode from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const InstallCliCommand = () => (
  <Tabs>
    <TabItem value="npm" label="npm" default>
      <BlocCode>npm i --save-dev @argos-ci/cli</BlocCode>
    </TabItem>
    <TabItem value="yarn" label="yarn">
      <BlocCode>yarn add --dev @argos-ci/cli</BlocCode>
    </TabItem>
    <TabItem value="pnpm" label="pnpm">
      <BlocCode>pnpm add --save-dev @argos-ci/cli</BlocCode>
    </TabItem>
  </Tabs>
);

export const WhyArgosToken = () => (
  <p>
    Argos uses a token called <code>ARGOS_TOKEN</code> to identify to which
    repository the screenshots you send are related to.
  </p>
);

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
    Congratulations, now that Argos is installed, your app screenshots will be
    uploaded to Argos by your CI. You are ready to{" "}
    <a href="/review-changes">review changes</a>!
  </p>
);
