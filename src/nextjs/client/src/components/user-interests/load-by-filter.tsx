import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getUserInterestsQuery } from '@/apollo/user-interests'

interface Props {
  userProfileId: string
  setUserInterestsText: any
  setRecommendedInterests: any
  setLoadedUserInterests: any
  starterText: string
}

export default function LoadUserInterestsByFilter({
                          userProfileId,
                          setUserInterestsText,
                          setRecommendedInterests,
                          setLoadedUserInterests,
                          starterText
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

    // Debug
    const fnName = `getUserInterests()`

    // Query
    const fetchGetUserInterestsQueryData =
      await fetchGetUserInterestsQuery(
        {
          variables: {
            userProfileId: userProfileId
          }
        })

    const results = fetchGetUserInterestsQueryData.data.getUserInterests

    // Debug
    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Set fields
    if (setUserInterestsText != null) {

      const text = results.userInterestsText?.text

      if (text == null ||
          typeof text !== 'string' ||
          text.trim() === '') {

        setUserInterestsText({
            text: starterText
          })
      } else {
        setUserInterestsText(results.userInterestsText)
      }
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
