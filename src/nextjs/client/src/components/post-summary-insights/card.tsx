import { Typography } from '@mui/material'
import { StringUtilsService } from '@/serene-core-client/services/utils/string'
import { useState } from 'react'
import ListPostSummaryInsightComments from '../post-summary-insight-comments/list'
import LoadPostSummaryInsightCommentsByFilter from '../post-summary-insight-comments/load-by-filter'

interface Props {
  userProfileId: string
  insight: any
}

export default function ViewPostSummaryInsightCard({
                          userProfileId,
                          insight
                        }: Props) {

  // Services
  const stringUtilsService = new StringUtilsService()

  // State
  const [insightComments, setInsightComments] = useState<any[] | undefined>(undefined)
  const [showComments, setShowComments] = useState(false)

  // Render
  return (
    <>
      <div style={{ display: 'flex', paddingTop: '1em' }}>

        <Typography
          onClick={(e) => setShowComments(!showComments)}
          style={{ cursor: 'pointer' }}
          variant='body1'>

          <span style={{ fontWeight: 'bold', marginRight: '0.5em' }}>
            {insight.name}
          </span>

          {insight.description}

          <span
            style={{ color: 'grey', float: 'right' }}>
            [{insight.commentsCount}]
          </span>
        </Typography>
      </div>

      {/* Load and show comments */}
      {showComments === true ?

        <>
          {insightComments != undefined ?
            <ListPostSummaryInsightComments
              insightComments={insightComments} />
            :
              <></>
          }

          <LoadPostSummaryInsightCommentsByFilter
            postSummaryInsightId={insight.id}
            setPostSummaryInsightComments={setInsightComments} />
        </>
      :
        <></>
      }
    </>
  )
}
