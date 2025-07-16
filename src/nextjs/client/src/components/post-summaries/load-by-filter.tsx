import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getPostSummariesQuery } from '@/apollo/post-summaries'

interface Props {
  userProfileId: string
  setPostSummaries: any
}

export default function LoadPostSummariesByFilter({
                          userProfileId,
                          setPostSummaries
                        }: Props) {

  // GraphQL
  const [fetchGetPostSummariesQuery] =
    useLazyQuery(getPostSummariesQuery, {
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
  async function getPostSummaries() {

    // Query
    const fetchGetPostSummariesQueryData =
      await fetchGetPostSummariesQuery(
        {
          variables: {
            userProfileId: userProfileId
          }
        })

    const results = fetchGetPostSummariesQueryData.data.getPostSummaries

    setPostSummaries(results.postSummaries)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getPostSummaries()
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
