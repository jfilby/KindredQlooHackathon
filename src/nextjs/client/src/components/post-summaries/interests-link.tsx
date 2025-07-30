import { Link, Typography } from '@mui/material'

interface Props {
}

export default function InterestsLink({}: Props) {

  // Render
  return (
    <Link
      href='/interests'
      style={{ color: 'grey' }}
      sx={{
        textDecorationColor: 'grey',
        textDecorationThickness: '1px',
        '&:hover': {
          textDecorationThickness: '2px',
        },
      }}
      underline='always'>
      <Typography variant='body1'>
        Personalize interests
      </Typography>
    </Link>
  )
}
