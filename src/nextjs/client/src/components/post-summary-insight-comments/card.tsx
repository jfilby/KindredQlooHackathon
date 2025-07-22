import { Link, Typography } from '@mui/material'

interface Props {
  insightComment: any
}

export default function ViewPostSummaryInsightCommentCard({
                          insightComment
                        }: Props) {

  // Render
  return (
    <Link
      href={insightComment.comment.url}
      style={{ color: 'black' }}
      target='_blank'
      underline='none'>

      <div style={{ backgroundColor: '#eee', display: 'flex', marginBottom: '0.1em', paddingLeft: '0.5em', paddingRight: '0.5em' }}>

        <Typography variant='body2'>
          <p>{insightComment.comment.text}</p>
        </Typography>
      </div>
    </Link>
  )
}
