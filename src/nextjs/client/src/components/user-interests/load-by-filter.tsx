import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getUserInterestsQuery } from '@/apollo/user-interests'

interface Props {
  userProfileId: string
  setUserEntityInterests: any
  setUserInterestsText: any
}

export default function LoadUserInterestsByFilter({
                          userProfileId,
                          setUserEntityInterests,
                          setUserInterestsText
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

    const results = fetchGetUserInterestsQueryData.data.getUserEntityInterests

    if (setUserEntityInterests != null) {
      setUserEntityInterests(results.userEntityInterests)
    }

    if (setUserInterestsText != null) {
      setUserInterestsText(results.userInterestsText)
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
