import React, { forwardRef } from "react";
import { x } from "@xstyled/styled-components";

export const ControlButton = forwardRef(
  ({ variant = "success", ...props }, ref) => (
    <x.div
      ref={ref}
      w="12px"
      h="12px"
      borderRadius="50%"
      mr="8px"
      bg={variant}
      {...props}
    />
  )
);

export const ControlButtons = ({ ...props }) => (
  <x.div
    display="flex"
    alignItems="center"
    pl="12px"
    pr="8px"
    position="absolute"
    {...props}
  >
    <ControlButton variant="danger" />
    <ControlButton variant="warning" />
    <ControlButton variant="success" />
  </x.div>
);
