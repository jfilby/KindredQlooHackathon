import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getTimeToNextListingQuery } from '@/apollo/post-summaries'

interface Props {
  siteTopicListId: string
  setLoaded: any
  setWaitTime: any
}

export default function LoadWaitTime({
                          siteTopicListId,
                          setLoaded,
                          setWaitTime
                        }: Props) {

  // GraphQL
  const [fetchGetTimeToNextListingQuery] =
    useLazyQuery(getTimeToNextListingQuery, {
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
  async function getTimeToNextListing() {

    // Query
    const fetchGetTimeToNextListingQueryData =
      await fetchGetTimeToNextListingQuery(
        {
          variables: {
            siteTopicListId: siteTopicListId
          }
        })

    const results = fetchGetTimeToNextListingQueryData.data.getTimeToNextListing

    setWaitTime(results)
    setLoaded(true)
  }

  // Effects
  useEffect(() => {

    getTimeToNextListing()

    // Reload
    const intervalId = setInterval(() => {
      getTimeToNextListing()
    }, 5 * 60 * 1000)  // 5 minutes

    return () => clearInterval(intervalId) // Cleanup on unmount

  }, [])

  // Render
  return (
    <></>
  )
}
