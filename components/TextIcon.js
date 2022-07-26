import React from "react";
import { x } from "@xstyled/styled-components";

export const TextIcon = ({
  icon: Icon,
  iconStyle = {},
  children,
  ...props
}) => (
  <x.div display="flex" whiteSpace="nowrap" {...props}>
    <x.div
      as={Icon}
      w="16px"
      h="16px"
      minW="16px"
      mr="4px"
      mt="4px"
      {...iconStyle}
    />
    {children}
  </x.div>
);
