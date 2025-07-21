import ViewPostSummaryInsightCard from './card'

interface Props {
  userProfileId: string
  insights: any[]
}

export default function ListPostSummaryInsights({
                          userProfileId,
                          insights
                        }: Props) {

  // Render
  return (
    <>
      {insights != null ?
        <div style={{ marginBottom: '2em' }}>
          {insights.length > 0 ?
            <>
              {insights.map(insight => (
                <ViewPostSummaryInsightCard
                  key={insight.id}
                  userProfileId={userProfileId}
                  insight={insight} />
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
