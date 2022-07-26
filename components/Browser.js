import React from "react";
import { x } from "@xstyled/styled-components";
import { IoReload } from "@react-icons/all-files/io5/IoReload";
import { ControlButtons } from "./ControlButtons";

const Header = (props) => (
  <x.div
    h="40px"
    display="flex"
    alignItems="center"
    borderBottom={1}
    borderColor="border"
    position="relative"
    {...props}
  />
);

const SearchBar = ({ children, ...props }) => (
  <x.div
    textAlign="center"
    backgroundColor="body-background"
    h="28px"
    pt="7px"
    borderRadius="3px"
    w={1 / 3}
    fontSize="12px"
    position="relative"
    mx="auto"
    minW="130px"
    display="flex"
    justifyContent="space-between"
    {...props}
  >
    <x.div w="14px" ml="12px" />
    {children}
    <x.div as={IoReload} w="14px" h="14px" mr="12px" />
  </x.div>
);

const Body = (props) => <x.div p={2} {...props} />;

export const Browser = ({ children, ...props }) => {
  return (
    <x.div
      borderRadius="3px"
      border={1}
      borderColor="border"
      bg="background-secondary"
      overflow="hidden"
      zIndex={400}
      {...props}
    >
      <Header>
        <ControlButtons />
        <SearchBar>argos.com</SearchBar>
      </Header>
      <Body>{children}</Body>
    </x.div>
  );
};
