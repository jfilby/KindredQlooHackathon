import { Typography } from '@mui/material'
import ViewRecommendedInterestCard from './recommended-card'

interface Props {
  text: any
  setText: any
  recommendedInterests: any[]
}

export default function RecommendedInterests({
                          text,
                          setText,
                          recommendedInterests
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      <div style={{ marginBottom: '2em' }}>

        <Typography variant='h5'>
          Recommendations from Qloo
        </Typography>
      </div>

      <div style={{ marginBottom: '2em' }}>
        {recommendedInterests.length > 0 ?
          <>
            {recommendedInterests.map(recommendedInterest => (
              <ViewRecommendedInterestCard
                key={recommendedInterest.id}
                text={text}
                setText={setText}
                recommendedInterest={recommendedInterest} />
            ))}
          </>
        :
          <Typography
            style={{ marginTop: '2em' }}
            variant='body1'>
            None yet.
          </Typography>
        }
      </div>
    </div>
  )
}
