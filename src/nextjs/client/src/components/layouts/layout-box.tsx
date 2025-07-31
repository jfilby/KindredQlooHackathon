import { pageBodyWidthPlus } from './full-height-layout'
import { Box } from '@mui/material'

interface Props {
  children: React.ReactNode
  _isMobile: boolean
}

export default function LayoutBox({
                          children,
                          _isMobile
                        }: Props) {

  // Render
  return (
    <Box
      style={{ margin: '0 auto', textAlign: 'center', verticalAlign: 'textTop', width: _isMobile ? undefined : pageBodyWidthPlus }}
      sx={{ bgcolor: 'background.default' }}>

      {children}
    </Box>
  )
}
