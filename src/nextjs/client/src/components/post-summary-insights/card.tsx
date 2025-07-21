import { Typography } from '@mui/material'
import { StringUtilsService } from '@/serene-core-client/services/utils/string'

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

  // Render
  return (
    <div style={{ display: 'flex', paddingTop: '1em' }}>
      <Typography
        variant='body1'>

        <span style={{ fontWeight: 'bold', marginRight: '0.5em' }}>
          {insight.name}
        </span>

        {insight.description}

        <span style={{ cursor: 'pointer', marginLeft: '0.5em' }}>
          [{insight.commentsCount}]
        </span>
      </Typography>
    </div>
  )
}
