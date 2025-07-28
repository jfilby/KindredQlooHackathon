import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getUserInterestsQuery } from '@/apollo/user-interests'

interface Props {
  userProfileId: string
  setUserInterestsText: any
  setRecommendedInterests: any
  setLoadedUserInterests: any
}

export default function LoadUserInterestsByFilter({
                          userProfileId,
                          setUserInterestsText,
                          setRecommendedInterests,
                          setLoadedUserInterests
                        }: Props) {

  // GraphQL
  const [fetchGetUserInterestsQuery] =
    useLazyQuery(getUserInterestsQuery, {
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
  async function getUserInterests() {

    // Query
    const fetchGetUserInterestsQueryData =
      await fetchGetUserInterestsQuery(
        {
          variables: {
            userProfileId: userProfileId
          }
        })

    const results = fetchGetUserInterestsQueryData.data.getUserInterests

    if (setUserInterestsText != null) {
      setUserInterestsText(results.userInterestsText)
    }

    if (setRecommendedInterests != null &&
        results.recommendedInterests != null) {

      setRecommendedInterests(results.recommendedInterests)
    }

    if (setLoadedUserInterests != null) {
      setLoadedUserInterests(true)
    }
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getUserInterests()
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
