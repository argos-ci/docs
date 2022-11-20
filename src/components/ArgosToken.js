import * as React from "react";
import Code from "@theme/MDXComponents/Code";
import gearButton from "@site/static/img/gear-button.png";

export const GetArgosToken = () => (
  <p>
    To get token value, <a href="https://app.argos-ci.com">sign in to Argos</a>{" "}
    and click on the{" "}
    <img
      src={gearButton}
      alt="Gear button"
      className="rounded"
      width={40}
      style={{ display: "inline-block", marginBottom: -8 }}
    />
    button in front of your repository.
  </p>
);

export const SetArgosTokenSecret = () => (
  <p>
    Set the <Code>ARGOS_TOKEN</Code> as an environment variable (sometimes
    called “secrets”) in your CI configuration.
  </p>
);

export const SetArgosToken = () => (
  <p>
    Set the <Code>ARGOS_TOKEN</Code> as an environment variable in your CI
    configuration.
  </p>
);

export const WhyArgosToken = () => (
  <p>
    Argos uses the <Code>ARGOS_TOKEN</Code> to identify to which repository the
    screenshots you send are related.
  </p>
);

export const TokenPrivacyWarningMessage = () => (
  <blockquote>
    <b>Warning:</b> Be careful to store your Argos token safely.{" "}
    <Code>ARGOS_TOKEN</Code> environment variable should be accessible by your
    CI but not visible publicly.
  </blockquote>
);
