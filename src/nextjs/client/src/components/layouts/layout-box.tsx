import { pageBodyWidthPlus } from './full-height-layout'
import { Box } from '@mui/material'

interface Props {
  children: React.ReactNode
  isMobile: boolean
}

export default function LayoutBox({
                          children,
                          isMobile
                        }: Props) {

  // Render
  return (
    <Box
      style={{
        // Mobile: slight left/right margin, desktop: no margin
        margin: isMobile ? '0 0.25em 0 0.25em' : '0 auto',
        textAlign: 'center',
        verticalAlign: 'textTop',
        width: isMobile ? undefined : pageBodyWidthPlus
      }}
      sx={{ bgcolor: 'background.default' }}>

      {children}
    </Box>
  )
}
