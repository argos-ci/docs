import React, { forwardRef } from 'react'
import styled, { Box } from '@xstyled/styled-components'
import { FaCheck, FaTimes } from 'react-icons/fa'
import logo from '../images/logo.png'

export const GITHUB_COLORS = {
  link: '#58a6ff',
  text: '#c9d1d9',
  neutralTitle: '#f0f6fc',
  paragraph: '#8b949e',
  backgroundLight: '#161b22',
}

export const GithubLinkButton = forwardRef((props, ref) => (
  <Box
    color={GITHUB_COLORS.link}
    fontSize="13px"
    lineHeight="18.2px"
    whiteSpace="nowrap"
    ref={ref}
    {...props}
  />
))

export const GithubCheckRow = (props) => (
  <Box
    color={GITHUB_COLORS.text}
    word-wrap="break-word"
    justifyContent="space-between"
    font-size="13px"
    line-height="1.4"
    alignItems="center"
    display="flex"
    padding="8px 16px"
    border="solid"
    borderWidth="1px 0 0"
    borderColor="border"
    bg={GITHUB_COLORS.backgroundLight}
    {...props}
  />
)
export const GithubCheckPart = (props) => (
  <Box display="flex" overflow="hidden" alignItems="center" {...props} />
)
export const GithubCheckStatus = (props) => (
  <Box mt="2px" width="30px" minWidth="30px" {...props} />
)

export const GithubCheckText = styled.box`
  color: secondary;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const GithubCheckPicture = (props) => (
  <Box
    backgroundColor="white"
    borderRadius="6px"
    height="20px"
    width="20px"
    {...props}
  />
)

export const GithubBlackContainer = (props) => (
  <Box
    p="16px"
    display="flex"
    color={GITHUB_COLORS.text}
    backgroundColor="black"
    {...props}
  />
)
export const GithubCircle = ({ color = 'error', ...props }) => (
  <Box
    width="30px"
    height="30px"
    minWidth="30px"
    minHeight="30px"
    border="solid 6px"
    borderRadius="50%"
    borderColor={color}
    transition="1000ms"
    mb="1px"
    {...props}
  />
)
export const GithubTitle = (props) => (
  <Box
    fontWeight="600"
    fontSize="16px"
    lineHeight="1.4"
    mb="1px"
    transition="1000ms"
    {...props}
  />
)

export const GithubParagraph = (props) => (
  <Box
    fontWeight="400"
    fontSize="13px"
    lineHeight="18.2px"
    transition="1000ms"
    color={GITHUB_COLORS.paragraph}
    {...props}
  />
)

export const GithubGreenCheckIcon = (props) => (
  <Box
    width="30px"
    height="30px"
    backgroundColor="success"
    borderRadius="50%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    <Box as={FaCheck} color="white" width="14px" />
  </Box>
)

export const GithubBaseButton = ({ status, ...props }) => (
  <Box
    padding="13.5px"
    fontSize="14px"
    fontWeight="500"
    lineHeight="20px"
    border="solid"
    borderWidth="1px 1px 1px 1px"
    color={status === 'success' ? 'white' : 'rgba(248, 81, 73, 0.5)'}
    backgroundColor={status === 'success' ? 'success' : '#0d1117'}
    borderColor="rgba(240, 246, 252, 0.1)"
    display="flex"
    alignItems="center"
    height="32px"
    {...props}
  />
)

export const GithubLeftButton = (props) => (
  <Box
    as={GithubBaseButton}
    borderWidth="1px"
    borderRadius="6px"
    maxWidth="154px"
    {...props}
  />
)

export function getGithubStatusProps(status) {
  switch (status) {
    case 'success':
      return {
        color: 'success',
        titleColor: GITHUB_COLORS.neutralTitle,
        title: 'All check have passed',
        paragraph: '1 successful check',
        iconProps: {
          as: FaCheck,
          color: 'success',
          width: '10px',
        },
        checkParagraph: 'Everything’s good!',
      }
    case 'pending':
      return {
        color: 'warning',
        titleColor: 'warning',
        title: "Some checks haven't completed yet",
        paragraph: '1 pending check',
        iconProps: {
          borderRadius: '50%',
          width: '10px',
          height: '10px',
          mt: '2px',
          backgroundColor: 'warning',
          ping: 'true',
        },
        checkParagraph: 'In Progress...',
      }

    default:
      return {
        color: 'danger',
        titleColor: 'danger',
        title: 'Some checks were not successful',
        paragraph: '1 failing check',
        iconProps: {
          as: FaTimes,
          color: 'danger',
          width: '10px',
        },
        checkParagraph: '1 difference detected, waiting for your decision',
      }
  }
}

export const GithubPingIcon = (props) => (
  <Box display="flex" justifyContent="center">
    <Box
      animation="ping"
      position="absolute"
      borderRadius="50%"
      opacity={0.75}
      {...props}
      as="span"
    />
    <Box transition="1000ms" mx="auto" {...props} />
  </Box>
)

export const GithubMergeStatus = ({
  status = 'pending',
  detailsButtonRef,
  ...props
}) => {
  const { color, title, paragraph, iconProps, checkParagraph, titleColor } =
    getGithubStatusProps(status)

  const { ping, ...icon } = iconProps

  return (
    <Box borderRadius="6px" border="1px solid" borderColor="border" {...props}>
      <GithubBlackContainer borderRadius="6px 6px 0 0">
        <Box display="flex" justifyContent="space-between" width={1}>
          <Box display="flex">
            {status !== 'success' ? (
              <GithubCircle color={color} />
            ) : (
              <GithubGreenCheckIcon />
            )}
            <Box ml="10px">
              <GithubTitle color={titleColor}>{title}</GithubTitle>
              <GithubParagraph>{paragraph}</GithubParagraph>
            </Box>
          </Box>
        </Box>
      </GithubBlackContainer>

      <GithubCheckRow>
        <GithubCheckPart>
          <GithubCheckStatus>
            {ping ? (
              <GithubPingIcon {...icon} />
            ) : (
              <Box mx="auto" transition="1000ms" {...icon} />
            )}
          </GithubCheckStatus>

          <GithubCheckPicture mr="8px">
            <Box
              as="img"
              src={logo}
              width="20px"
              minWidth="20px"
              height="20px"
              minHeight="20px"
              alt="argos-ci"
            />
          </GithubCheckPicture>

          <GithubCheckText>
            <Box as="span" color={GITHUB_COLORS.text}>
              argos
            </Box>{' '}
            — {checkParagraph}
          </GithubCheckText>
        </GithubCheckPart>

        <GithubLinkButton ml="10px" ref={detailsButtonRef}>
          Details
        </GithubLinkButton>
      </GithubCheckRow>

      <Box
        p="16px"
        bg={GITHUB_COLORS.backgroundLight}
        borderRadius="0 0 6px 6px"
        borderTop={1}
        borderColor="border"
      >
        <GithubLeftButton status={status}>Merge pull request</GithubLeftButton>
      </Box>
    </Box>
  )
}
