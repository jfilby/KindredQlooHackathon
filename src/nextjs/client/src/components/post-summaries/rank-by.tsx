import { Link, Typography } from '@mui/material'

interface Props {
  openRankBy: boolean
  setOpenRankBy: any
}

export default function RankPostSummariesBy({
                          openRankBy,
                          setOpenRankBy
                        }: Props) {

  // Render
  return (
    <Link
      onClick={(e) => setOpenRankBy(!openRankBy)}
      style={{ color: 'grey', cursor: 'pointer', marginLeft: '2em' }}
      sx={{
        textDecorationColor: 'grey',
        textDecorationThickness: '1px',
        '&:hover': {
          textDecorationThickness: '2px',
        },
      }}
      underline='always'>
      <Typography variant='body1'>
        Rank by
      </Typography>
    </Link>
  )
}
