import { Link, Typography } from '@mui/material'
import ViewPostSummaryCard from './card'

interface Props {
  userProfileId: string
  postSummaries: any[]
}

export default function ListPostSummaries({
                          userProfileId,
                          postSummaries
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {postSummaries != null ?
        <>
          <div style={{ marginBottom: '1em' }}>

            <Typography variant='h5'>
              Latest summaries
            </Typography>
          </div>

          <div>
            <Link
              href='/interests'
              style={{ color: 'grey' }}
              underline='hover'>
              <Typography variant='body1'>
                Personalize to rank summaries just for you
              </Typography>
            </Link>
          </div>

          {postSummaries.length > 0 ?
            <>
              {postSummaries.map(postSummary => (
                <ViewPostSummaryCard
                  key={postSummary.id}
                  userProfileId={userProfileId}
                  postSummary={postSummary} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No post summaries.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
