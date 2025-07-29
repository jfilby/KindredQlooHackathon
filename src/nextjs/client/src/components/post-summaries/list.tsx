import { Link, Typography } from '@mui/material'
import { useState } from 'react'
import LoadWaitTime from '@/components/post-summaries/load-wait-time'
import ViewPostSummaryCard from './card'

interface Props {
  userProfileId: string
  postSummaries: any[]
}

export default function ListPostSummaries({
                          userProfileId,
                          postSummaries
                        }: Props) {

  // State
  const [loaded, setLoaded] = useState<boolean>(false)
  const [waitTime, setWaitTime] = useState<any>(undefined)

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {postSummaries != null ?
        <>
          <div style={{ marginBottom: '1em' }}>

            <Typography variant='h5'>
              {postSummaries != null &&
               postSummaries.length > 0 ?
                <>{postSummaries[0].post.site.name}</>
              :
                <>Latest summaries</>
              }
            </Typography>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
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

            {waitTime != null &&
             (waitTime.waitTime != null || waitTime.overdueOrReady != null) ?
              <Typography
                style={{ color: 'grey', marginLeft: '10em' }}
                variant='body1'>
                {waitTime.overdueOrReady != null ?
                  <Link
                    href='/'
                    style={{ color: 'grey' }}
                    sx={{
                      textDecorationColor: 'grey',
                      textDecorationThickness: '1px',
                      '&:hover': {
                        textDecorationThickness: '2px',
                      },
                    }}
                    underline='always'>
                    Next listing is {waitTime.overdueOrReady}
                  </Link>
                :
                  <>Next listing in {waitTime.waitTime}</>
                }
              </Typography>
            :
              <></>
            }
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

      <LoadWaitTime
        siteTopicId={undefined}
        setLoaded={setLoaded}
        setWaitTime={setWaitTime} />
    </div>
  )
}
