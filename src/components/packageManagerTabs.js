import React from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const PackageManagerTabs = ({ children, ...props }) => (
  <Tabs groupId="package-managers" {...props}>
    {children}
  </Tabs>
);

export const CliInstall = () => (
  <PackageManagerTabs>
    <TabItem value="npm">
      <CodeBlock language="shell">npm install --save-dev argos-cli</CodeBlock>
    </TabItem>
    <TabItem value="yarn">
      <CodeBlock language="shell">yarn add -D argos-cli</CodeBlock>
    </TabItem>
  </PackageManagerTabs>
);
