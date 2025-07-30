import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getPostSummariesQuery } from '@/apollo/post-summaries'

interface Props {
  userProfileId: string
  setSiteTopicListId: any
  setUserSiteTopic: any
  setPostSummaries: any
  loadListing: boolean
  setLoadListing: any
}

export default function LoadPostSummariesByFilter({
                          userProfileId,
                          setSiteTopicListId,
                          setUserSiteTopic,
                          setPostSummaries,
                          loadListing,
                          setLoadListing
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

    setSiteTopicListId(results.siteTopicListId)
    setUserSiteTopic(results.userSiteTopic)
    setPostSummaries(results.postSummaries)
  }

  // Effects
  useEffect(() => {

    if (loadListing === false) {
      return
    }

    const fetchData = async () => {
      await getPostSummaries()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

    // Done
    setLoadListing(false)

  }, [loadListing])

  // Render
  return (
    <></>
  )
}
