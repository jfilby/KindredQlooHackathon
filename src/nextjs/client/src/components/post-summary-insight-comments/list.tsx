import ViewPostSummaryInsightCommentCard from './card'

interface Props {
  insightComments: any[]
}

export default function ListPostSummaryInsightComments({
                          insightComments
                        }: Props) {

  // Render
  return (
    <>
      {insightComments != null ?
        <div style={{ marginBottom: '1em' }}>
          {insightComments.length > 0 ?
            <>
              {insightComments.map(insightComment => (
                <ViewPostSummaryInsightCommentCard
                  key={insightComment.id}
                  insightComment={insightComment} />
              ))}
            </>
          :
            <></>
          }
        </div>
      :
        <></>
      }
    </>
  )
}
