import { Typography } from '@mui/material'
import ViewPostSummaryCard from './card'
import InterestsLink from './interests-link'
import RankByPane from './rank-by-pane'
import RankPostSummariesBy from './rank-by'
import WaitTime from './wait-time'

interface Props {
  userProfileId: string
  userSiteTopic: any
  siteTopicListId: string
  postSummaries: any[]
  openRankBy: boolean
  setOpenRankBy: any
  setLoadListing: any
}

export default function ListPostSummaries({
                          userProfileId,
                          userSiteTopic,
                          siteTopicListId,
                          postSummaries,
                          openRankBy,
                          setOpenRankBy,
                          setLoadListing
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

            <RankPostSummariesBy
              openRankBy={openRankBy}
              setOpenRankBy={setOpenRankBy} />
          </div>

          {openRankBy ?
            <RankByPane
              userProfileId={userProfileId}
              siteTopicId={userSiteTopic.siteTopicId}
              rankBy={userSiteTopic.rankBy}
              setLoadListing={setLoadListing} />
          :
            <></>
          }

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
