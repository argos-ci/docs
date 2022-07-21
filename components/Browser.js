import React from 'react'
import { Box } from '@xstyled/styled-components'
import { IoReload } from 'react-icons/io5'
import { ControlButtons } from './ControlButtons'

const Header = (props) => (
  <Box
    height="40px"
    display="flex"
    alignItems="center"
    borderBottom={1}
    borderColor="border"
    position="relative"
    {...props}
  />
)

const SearchBar = ({ children, ...props }) => (
  <Box
    textAlign="center"
    backgroundColor="body-background"
    height="28px"
    pt="7px"
    borderRadius="3px"
    width={1 / 3}
    fontSize="12px"
    position="relative"
    mx="auto"
    minWidth="130px"
    display="flex"
    justifyContent="space-between"
    {...props}
  >
    <Box width="14px" ml="12px" />
    {children}
    <Box as={IoReload} width="14px" height="14px" mr="12px" />
  </Box>
)

const Body = (props) => <Box p={2} {...props} />

export const Browser = ({ children, ...props }) => {
  return (
    <Box
      borderRadius="3px"
      border={1}
      borderColor="border"
      backgroundColor="background-secondary"
      overflow="hidden"
      zIndex={400}
      {...props}
    >
      <Header>
        <ControlButtons />
        <SearchBar>argos.com</SearchBar>
      </Header>
      <Body>{children}</Body>
    </Box>
  )
}
