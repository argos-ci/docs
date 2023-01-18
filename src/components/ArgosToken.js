import * as React from "react";
import Code from "@theme/MDXComponents/Code";
import BlocCode from "@theme/CodeBlock";

export const InstallCliCommand = () => (
  <>
    <p>
      Install the{" "}
      <a href="https://www.npmjs.com/package/@argos-ci/cli">@argos-cli</a>{" "}
      package from npm:
    </p>{" "}
    <BlocCode>npm i --save-dev @argos-cli</BlocCode>
  </>
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
    uploaded to Argos by your CI. You are ready to start the{" "}
    <a href="/visual-testing">visual testing</a> routine!
  </p>
);
