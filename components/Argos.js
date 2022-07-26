import React, { forwardRef } from 'react'
import { Box } from '@xstyled/styled-components'
import { IoCheckmark } from '@react-icons/all-files/io5/IoCheckmark'

export const ArgosCard = forwardRef((props, ref) => (
  <Box
    ref={ref}
    borderLeft="solid 2px"
    color="white"
    borderRadius="4px"
    backgroundColor="rgba(51, 65, 85, 0.7)"
    transition="opacity 1200ms 700ms"
    position="relative"
    {...props}
  />
))

export const ArgosCardHeader = forwardRef((props, ref) => (
  <Box
    ref={ref}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={1}
    borderColor="secondary"
    p={2}
    {...props}
  />
))

export const ArgosCardTitle = (props) => (
  <Box fontSize="15px" color="secondary" fontWeight="semibold" {...props} />
)

export const ArgosCardBody = forwardRef((props, ref) => (
  <Box
    position="relative"
    display="flex"
    py={2}
    px={2}
    ref={ref}
    justifyContent="flex-between"
    {...props}
  />
))

export const ArgosApproveButton = forwardRef(
  ({ variant = 'success', ...props }, ref) => (
    <Box
      bg={variant === 'success' ? 'success' : 'warning'}
      ref={ref}
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
      {variant === 'success' ? (
        <>
          <Box as={IoCheckmark} />
          Approved
        </>
      ) : (
        'Mark as approved'
      )}
    </Box>
  ),
)
