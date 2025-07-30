import { Link, Typography } from '@mui/material'
import { useState } from 'react'
import LoadWaitTime from '@/components/post-summaries/load-wait-time'

interface Props {
  siteTopicListId: string
}

export default function WaitTime({
                          siteTopicListId
                        }: Props) {

  // State
  const [waitTime, setWaitTime] = useState<any>(undefined)

  // Render
  return (
    <>
      {waitTime != null &&
       (waitTime.waitTime != null || waitTime.overdueOrReady != null) ?
        <Typography
          style={{ color: 'grey', marginLeft: '2em' }}
          variant='body1'>

          {waitTime.overdueOrReady != null ?
            <>
              {waitTime.overdueOrReady === 'ready' ?
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
                  Next listing is ready
                </Link>
              :
                <>Next listing is overdue</>
              }
            </>
          :
            <>Next listing in {waitTime.waitTime}</>
          }
        </Typography>
      :
        <></>
      }

      <LoadWaitTime
        siteTopicListId={siteTopicListId}
        setWaitTime={setWaitTime} />
    </>
  )
}
