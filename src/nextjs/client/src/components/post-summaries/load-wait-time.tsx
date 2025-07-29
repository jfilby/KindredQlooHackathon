import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getTimeToNextListingQuery } from '@/apollo/post-summaries'

interface Props {
  siteTopicId: string | undefined
  setWaitTime: any
}

export default function LoadWaitTime({
                          siteTopicId,
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
            siteTopicId: siteTopicId
          }
        })

    const results = fetchGetTimeToNextListingQueryData.data.getTimeToNextListing

    setWaitTime(results)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getTimeToNextListing()
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
