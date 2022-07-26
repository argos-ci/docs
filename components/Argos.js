import React, { forwardRef } from "react";
import { x } from "@xstyled/styled-components";
import { IoCheckmark } from "@react-icons/all-files/io5/IoCheckmark";

export const ArgosCard = forwardRef((props, ref) => (
  <x.div
    ref={ref}
    borderLeft="solid 2px"
    color="white"
    borderRadius="4px"
    bg="rgba(51, 65, 85, 0.7)"
    transition="opacity 1200ms 700ms"
    position="relative"
    {...props}
  />
));

export const ArgosCardHeader = forwardRef((props, ref) => (
  <x.div
    ref={ref}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={1}
    borderColor="secondary"
    p={2}
    {...props}
  />
));

export const ArgosCardTitle = (props) => (
  <x.div fontSize="15px" color="secondary" fontWeight="semibold" {...props} />
);

export const ArgosCardBody = forwardRef((props, ref) => (
  <x.div
    position="relative"
    display="flex"
    py={2}
    px={2}
    ref={ref}
    justifyContent="flex-between"
    {...props}
  />
));

export const ArgosApproveButton = forwardRef(
  ({ variant = "success", ...props }, ref) => (
    <x.div
      ref={ref}
      bg={variant === "success" ? "success" : "warning"}
      fontSize="14px"
      px="12px"
      py="4px"
      display="flex"
      gap="4px"
      alignItems="center"
      borderRadius="4px"
      color="white"
      {...props}
    >
      {variant === "success" ? (
        <>
          <x.div as={IoCheckmark} />
          Approved
        </>
      ) : (
        "Mark as approved"
      )}
    </x.div>
  )
);
