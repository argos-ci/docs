import React, { forwardRef } from "react";
import styled, { x } from "@xstyled/styled-components";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { FaTimes } from "@react-icons/all-files/fa/FaTimes";

import logo from "../images/logo.png";

export const GITHUB_COLORS = {
  link: "#58a6ff",
  text: "#c9d1d9",
  neutralTitle: "#f0f6fc",
  paragraph: "#8b949e",
  backgroundLight: "#161b22",
};

export const GitHubLinkButton = forwardRef((props, ref) => (
  <x.div
    ref={ref}
    color={GITHUB_COLORS.link}
    fontSize="13px"
    lineHeight="18.2px"
    whiteSpace="nowrap"
    {...props}
  />
));

export const GitHubCheckRow = (props) => (
  <x.div
    color={GITHUB_COLORS.text}
    wordWrap="break-word"
    justifyContent="space-between"
    fontSize="13px"
    lineHeight="1.4"
    alignItems="center"
    display="flex"
    padding="8px 16px"
    border="solid"
    borderWidth="1px 0 0"
    borderColor="border"
    bg={GITHUB_COLORS.backgroundLight}
    {...props}
  />
);
export const GitHubCheckPart = (props) => (
  <x.div display="flex" overflow="hidden" alignItems="center" {...props} />
);
export const GitHubCheckStatus = (props) => (
  <x.div mt="2px" w="30px" minW="30px" {...props} />
);

export const GitHubCheckText = styled.box`
  color: secondary;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const GitHubCheckPicture = (props) => (
  <x.div bg="white" borderRadius="6px" h="20px" w="20px" {...props} />
);

export const GitHubBlackContainer = (props) => (
  <x.div
    p="16px"
    display="flex"
    color={GITHUB_COLORS.text}
    bg="black"
    {...props}
  />
);
export const GitHubCircle = ({ color = "error", ...props }) => (
  <x.div
    w="30px"
    h="30px"
    minW="30px"
    minH="30px"
    border="solid 6px"
    borderRadius="50%"
    borderColor={color}
    transition="1000ms"
    mb="1px"
    {...props}
  />
);
export const GitHubTitle = (props) => (
  <x.div
    fontWeight="600"
    fontSize="16px"
    lineHeight="1.4"
    mb="1px"
    transition="1000ms"
    {...props}
  />
);

export const GitHubParagraph = (props) => (
  <x.div
    fontWeight="400"
    fontSize="13px"
    lineHeight="18.2px"
    transition="1000ms"
    color={GITHUB_COLORS.paragraph}
    {...props}
  />
);

export const GitHubGreenCheckIcon = (props) => (
  <x.div
    w="30px"
    h="30px"
    bg="success"
    borderRadius="50%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    <x.div as={FaCheck} color="white" width="14px" />
  </x.div>
);

export const GitHubBaseButton = ({ status, ...props }) => (
  <x.div
    padding="13.5px"
    fontSize="14px"
    fontWeight="500"
    lineHeight="20px"
    border="solid"
    borderWidth="1px 1px 1px 1px"
    color={status === "success" ? "white" : "rgba(248, 81, 73, 0.5)"}
    bg={status === "success" ? "success" : "#0d1117"}
    borderColor="rgba(240, 246, 252, 0.1)"
    display="flex"
    alignItems="center"
    h="32px"
    {...props}
  />
);

export const GitHubLeftButton = (props) => (
  <x.div
    as={GitHubBaseButton}
    borderWidth="1px"
    borderRadius="6px"
    maxW="154px"
    {...props}
  />
);

export function getGitHubStatusProps(status) {
  switch (status) {
    case "success":
      return {
        color: "success",
        titleColor: GITHUB_COLORS.neutralTitle,
        title: "All check have passed",
        paragraph: "1 successful check",
        iconProps: {
          as: FaCheck,
          color: "success",
          width: "10px",
        },
        checkParagraph: "Everything’s good!",
      };
    case "pending":
      return {
        color: "warning",
        titleColor: "warning",
        title: "Some checks haven't completed yet",
        paragraph: "1 pending check",
        iconProps: {
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          mt: "2px",
          backgroundColor: "warning",
          ping: "true",
        },
        checkParagraph: "In Progress...",
      };

    default:
      return {
        color: "danger",
        titleColor: "danger",
        title: "Some checks were not successful",
        paragraph: "1 failing check",
        iconProps: {
          as: FaTimes,
          color: "danger",
          width: "10px",
        },
        checkParagraph: "1 difference detected, waiting for your decision",
      };
  }
}

export const GitHubPingIcon = (props) => (
  <x.div display="flex" justifyContent="center">
    <x.span
      animation="ping"
      position="absolute"
      borderRadius="50%"
      opacity={0.75}
      {...props}
    />
    <x.div transition="1000ms" mx="auto" {...props} />
  </x.div>
);

export const GitHubMergeStatus = ({
  status = "pending",
  detailsButtonRef,
  ...props
}) => {
  const { color, title, paragraph, iconProps, checkParagraph, titleColor } =
    getGitHubStatusProps(status);

  const { ping, ...icon } = iconProps;

  return (
    <x.div
      borderRadius="6px"
      border="1px solid"
      borderColor="border"
      {...props}
    >
      <GitHubBlackContainer borderRadius="6px 6px 0 0">
        <x.div display="flex" justifyContent="space-between" width={1}>
          <x.div display="flex">
            {status !== "success" ? (
              <GitHubCircle color={color} />
            ) : (
              <GitHubGreenCheckIcon />
            )}
            <x.div ml="10px">
              <GitHubTitle color={titleColor}>{title}</GitHubTitle>
              <GitHubParagraph>{paragraph}</GitHubParagraph>
            </x.div>
          </x.div>
        </x.div>
      </GitHubBlackContainer>

      <GitHubCheckRow>
        <GitHubCheckPart>
          <GitHubCheckStatus>
            {ping ? (
              <GitHubPingIcon {...icon} />
            ) : (
              <x.div mx="auto" transition="1000ms" {...icon} />
            )}
          </GitHubCheckStatus>

          <GitHubCheckPicture mr="8px">
            <x.img
              src={logo}
              w="20px"
              minW="20px"
              h="20px"
              minH="20px"
              alt="argos-ci"
            />
          </GitHubCheckPicture>

          <GitHubCheckText>
            <x.div as="span" color={GITHUB_COLORS.text}>
              argos
            </x.div>{" "}
            — {checkParagraph}
          </GitHubCheckText>
        </GitHubCheckPart>

        <GitHubLinkButton ml="10px" ref={detailsButtonRef}>
          Details
        </GitHubLinkButton>
      </GitHubCheckRow>

      <x.div
        p="16px"
        bg={GITHUB_COLORS.backgroundLight}
        borderRadius="0 0 6px 6px"
        borderTop={1}
        borderColor="border"
      >
        <GitHubLeftButton status={status}>Merge pull request</GitHubLeftButton>
      </x.div>
    </x.div>
  );
};
