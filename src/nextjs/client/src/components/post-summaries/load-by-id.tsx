import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getPostSummaryQuery } from '@/apollo/post-summaries'

interface Props {
  id: string
  userProfileId: string
  setPostSummary: any
}

export default function LoadPostSummaryById({
                          id,
                          userProfileId,
                          setPostSummary
                        }: Props) {

  // GraphQL
  const [fetchGetPostSummaryQuery] =
    useLazyQuery(getPostSummaryQuery, {
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
  async function getPostSummary() {

    // Query
    const fetchGetPostSummaryQueryData =
      await fetchGetPostSummaryQuery(
        {
          variables: {
            userProfileId: userProfileId,
            id: id
          }
        })

    const results = fetchGetPostSummaryQueryData.data.getPostSummary

    setPostSummary(results.postSummary)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getPostSummary()
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
