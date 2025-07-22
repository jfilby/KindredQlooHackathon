import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getPostSummaryInsightCommentsQuery } from '@/apollo/post-summary-insight-comments'

interface Props {
  postSummaryInsightId: string
  setPostSummaryInsightComments: any
}

export default function LoadPostSummaryInsightCommentsByFilter({
                          postSummaryInsightId,
                          setPostSummaryInsightComments
                        }: Props) {

  // GraphQL
  const [fetchGetPostSummaryInsightCommentsQuery] =
    useLazyQuery(getPostSummaryInsightCommentsQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getComments() {

    // Debug
    // console.log(`postSummaryInsightId: ${postSummaryInsightId}`)

    // Query
    const fetchGetPostSummaryInsightCommentsQueryData =
      await fetchGetPostSummaryInsightCommentsQuery(
        {
          variables: {
            postSummaryInsightId: postSummaryInsightId
          }
        })

    const results =
            fetchGetPostSummaryInsightCommentsQueryData.data.getPostSummaryInsightComments

    // console.log(`results: ` + JSON.stringify(results))

    setPostSummaryInsightComments(results.postSummaryInsightComments)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getComments()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [])

  // Render
  return (
    <></>
  )
}
