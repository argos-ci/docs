import React from 'react'
import { Box } from '@xstyled/styled-components'
import { IoCar } from 'react-icons/io5'

const IconContainer = ({ size = '60px', ...props }) => (
  <Box
    height={size}
    width={size}
    maxWidth={size}
    backgroundColor="white"
    boxShadow="md"
    border={1}
    borderRadius="50%"
    borderColor="border"
    display="flex"
    justifyContent="center"
    alignItems="center"
    color="black"
    {...props}
  />
)

const Icon = ({ size = 24, ...props }) => (
  <Box
    mx="auto"
    width={size}
    minWidth={size}
    height={size}
    minHeight={size}
    {...props}
  />
)

const Placeholder = ({ active, ...props }) => (
  <Box
    height="8px"
    bg={active ? 'white' : 'secondary'}
    borderRadius="20px"
    width={1}
    {...props}
  />
)

const ParagraphPlaceholder = (props) => (
  <Placeholder borderRadius="4px" height="24px" bg="secondary" {...props} />
)

const InnerScreenshot = ({ children, ...props }) => {
  return (
    <Box
      flex={1}
      backgroundColor="#0f172aff"
      pt={2}
      px={{ xs: 1, sm: 3 }}
      pb={4}
      transition="800ms"
      {...props}
    >
      <Box maxWidth="200px" mx="auto">
        {children}
      </Box>
    </Box>
  )
}

const Header = (props) => (
  <Box display="flex" mx="auto" alignItems="center" height="50px" {...props} />
)
const ScreenshotLayoutHeader = (props) => (
  <Header {...props}>
    <IconContainer size="40px" flex={1}>
      <Icon as={IoCar} />
    </IconContainer>
    <Box flex={1} ml="10px">
      <Placeholder active width={1 / 2} />
      <Placeholder mt={1} />
    </Box>
  </Header>
)

const Body = (props) => <Box mx="auto" height="62px" {...props} />
const ScreenshotLayoutBody = (props) => (
  <Body border={1} borderColor="transparent" {...props}>
    <ParagraphPlaceholder mt={2} height="20px" />
    <ParagraphPlaceholder mt={1} height="30px" />
  </Body>
)

const Price = (props) => (
  <Box
    display="flex"
    justifyContent="flex-end"
    height="40px"
    pt="8px"
    {...props}
  />
)
const PriceTag = ({ backgroundColor = 'blue-500', ...props }) => (
  <Box
    fontSize="21px"
    fontWeight="200"
    px="10px"
    pt="-10px"
    borderRadius="22px"
    height="13px"
    backgroundColor={backgroundColor}
    width="58px"
    lineHeight="normal"
    {...props}
  />
)

export const ScreenshotLegend = (props) => (
  <Box
    borderLeft={1}
    borderColor="secondary"
    color="secondary"
    py={1}
    pl={2}
    ml={2}
    flex={1}
    maxHeight={26}
    {...props}
  />
)

export const ScreenshotContainer = (props) => (
  <Box
    flex={1}
    display="flex"
    flexDirection="column"
    overflow="hidden"
    position="relative"
    {...props}
  />
)

export const Screenshot = ({
  tagColor = 'blue-500',
  tagSize = 'md',
  ...props
}) => (
  <InnerScreenshot {...props}>
    <ScreenshotLayoutHeader />
    <Price>
      <PriceTag
        backgroundColor={tagColor}
        height={tagSize === 'md' ? '24px' : '13px'}
      >
        $$$
      </PriceTag>
    </Price>
    <ScreenshotLayoutBody />
  </InnerScreenshot>
)

export const ScreenshotDiff = ({ variant, ...props }) => {
  return (
    <InnerScreenshot {...props}>
      <Header />
      <Price>
        {variant === 'bugged' ? (
          <PriceTag position="absolute" height="13px" bg="danger" />
        ) : null}
        <PriceTag height="24px" backgroundColor="danger" />
      </Price>
      <Body />
    </InnerScreenshot>
  )
}
