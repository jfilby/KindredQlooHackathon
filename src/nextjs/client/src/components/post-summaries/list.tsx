import { Typography } from '@mui/material'
import ViewPostSummaryCard from './card'
import InterestsLink from './interests-link'
import WaitTime from './wait-time'

interface Props {
  userProfileId: string
  siteTopicListId: string
  postSummaries: any[]
}

export default function ListPostSummaries({
                          userProfileId,
                          siteTopicListId,
                          postSummaries
                        }: Props) {

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
            <InterestsLink />
            <WaitTime siteTopicListId={siteTopicListId} />
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
