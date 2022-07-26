import React from 'react'
import { Box } from '@xstyled/styled-components'
import {
  ArgosCard,
  ArgosCardHeader,
  ArgosCardTitle,
  ArgosApproveButton,
  ArgosCardBody,
} from './Argos'
import { Browser } from './Browser'
import {
  Screenshot,
  ScreenshotContainer,
  ScreenshotDiff,
  ScreenshotLegend,
} from './Screenshot'
import { TextIcon } from './TextIcon'
import { IoGitBranch } from '@react-icons/all-files/io5/IoGitBranch'

export const ArgosInBrowser = ({ approved = true, ...props }) => (
  <Browser {...props}>
    <ArgosCard borderColor={approved ? 'success' : 'warning'}>
      <ArgosCardHeader>
        <ArgosCardTitle>Car details</ArgosCardTitle>
        <ArgosApproveButton variant={approved ? 'success' : 'warning'} />
      </ArgosCardHeader>
      <ArgosCardBody>
        <ScreenshotContainer mr={{ xs: 2, sm: 4 }}>
          <Box display="flex" flexDirection="column" position="relative">
            <Screenshot tagColor="blue-500" />
          </Box>
          <ScreenshotLegend>
            <TextIcon icon={IoGitBranch}>main</TextIcon>
          </ScreenshotLegend>
        </ScreenshotContainer>

        <ScreenshotContainer mr={{ xs: 2, sm: 4 }}>
          <Box display="flex" flexDirection="column" position="relative">
            <Screenshot tagColor="primary" />
          </Box>
          <ScreenshotLegend>
            <TextIcon icon={IoGitBranch}>rework</TextIcon>
          </ScreenshotLegend>
        </ScreenshotContainer>

        <ScreenshotContainer>
          <ScreenshotDiff />
          <ScreenshotLegend>argos diff</ScreenshotLegend>
        </ScreenshotContainer>
      </ArgosCardBody>
    </ArgosCard>
  </Browser>
)
