import React from 'react'
import { Box } from '@xstyled/styled-components'

export const TextIcon = ({
  icon: Icon,
  iconStyle = {},
  children,
  ...props
}) => (
  <Box display="flex" whiteSpace="nowrap" {...props}>
    <Box
      as={Icon}
      width="16px"
      height="16px"
      minWidth="16px"
      mr="4px"
      mt="4px"
      {...iconStyle}
    />
    {children}
  </Box>
)
