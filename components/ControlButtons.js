import React, { forwardRef } from 'react'
import { Box } from '@xstyled/styled-components'

export const ControlButton = forwardRef(
  ({ variant = 'success', ...props }, ref) => (
    <Box
      width="12px"
      height="12px"
      borderRadius="50%"
      mr="8px"
      backgroundColor={variant}
      ref={ref}
      {...props}
    />
  ),
)

export const ControlButtons = ({ ...props }) => (
  <Box
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
  </Box>
)
