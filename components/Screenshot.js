import React from "react";
import { x } from "@xstyled/styled-components";
import { IoCar } from "@react-icons/all-files/io5/IoCar";

const IconContainer = ({ size = "60px", ...props }) => (
  <x.div
    h={size}
    w={size}
    maxW={size}
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
);

const Icon = ({ size = 24, ...props }) => (
  <x.div mx="auto" w={size} minW={size} h={size} minH={size} {...props} />
);

const Placeholder = ({ active, ...props }) => (
  <x.div
    w={1}
    h="8px"
    bg={active ? "white" : "secondary"}
    borderRadius="20px"
    {...props}
  />
);

const ParagraphPlaceholder = (props) => (
  <Placeholder borderRadius="4px" height="24px" bg="secondary" {...props} />
);

const InnerScreenshot = ({ children, ...props }) => {
  return (
    <x.div
      flex={1}
      bg="#0f172aff"
      pt={2}
      px={{ xs: 1, sm: 3 }}
      pb={4}
      transition="800ms"
      {...props}
    >
      <x.div maxW="200px" mx="auto">
        {children}
      </x.div>
    </x.div>
  );
};

const Header = (props) => (
  <x.div display="flex" mx="auto" alignItems="center" h="50px" {...props} />
);
const ScreenshotLayoutHeader = (props) => (
  <Header {...props}>
    <IconContainer size="40px" flex={1}>
      <Icon as={IoCar} />
    </IconContainer>
    <x.div flex={1} ml="10px">
      <Placeholder active width={1 / 2} />
      <Placeholder mt={1} />
    </x.div>
  </Header>
);

const Body = (props) => <x.div mx="auto" h="62px" {...props} />;
const ScreenshotLayoutBody = (props) => (
  <Body border={1} borderColor="transparent" {...props}>
    <ParagraphPlaceholder mt={2} h="20px" />
    <ParagraphPlaceholder mt={1} h="30px" />
  </Body>
);

const Price = (props) => (
  <x.div
    display="flex"
    justifyContent="flex-end"
    h="40px"
    pt="8px"
    {...props}
  />
);
const PriceTag = ({ backgroundColor = "blue-500", ...props }) => (
  <x.div
    fontSize="21px"
    fontWeight="200"
    px="10px"
    pt="-10px"
    borderRadius="22px"
    h="13px"
    w="58px"
    backgroundColor={backgroundColor}
    lineHeight="normal"
    {...props}
  />
);

export const ScreenshotLegend = (props) => (
  <x.div
    borderLeft={1}
    borderColor="secondary"
    color="secondary"
    py={1}
    pl={2}
    ml={2}
    flex={1}
    maxH={26}
    {...props}
  />
);

export const ScreenshotContainer = (props) => (
  <x.div
    flex={1}
    display="flex"
    flexDirection="column"
    overflow="hidden"
    position="relative"
    {...props}
  />
);

export const Screenshot = ({
  tagColor = "blue-500",
  tagSize = "md",
  ...props
}) => (
  <InnerScreenshot {...props}>
    <ScreenshotLayoutHeader />
    <Price>
      <PriceTag
        backgroundColor={tagColor}
        height={tagSize === "md" ? "24px" : "13px"}
      >
        $$$
      </PriceTag>
    </Price>
    <ScreenshotLayoutBody />
  </InnerScreenshot>
);

export const ScreenshotDiff = ({ variant, ...props }) => {
  return (
    <InnerScreenshot {...props}>
      <Header />
      <Price>
        {variant === "bugged" ? (
          <PriceTag position="absolute" height="13px" bg="danger" />
        ) : null}
        <PriceTag height="24px" backgroundColor="danger" />
      </Price>
      <Body />
    </InnerScreenshot>
  );
};
