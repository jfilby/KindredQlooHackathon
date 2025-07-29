import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getChatSessionsQuery } from '@/serene-ai-client/apollo/chats'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  userProfileId: string
  instanceId: string,
  setChatSessions: any
  refresh: boolean
  setRefresh: any
}

export default function LoadChatsByFilter({
                          userProfileId,
                          instanceId,
                          setChatSessions,
                          refresh,
                          setRefresh
                        }: Props) {

  // GraphQL
  const [fetchChatsQuery] =
    useLazyQuery(getChatSessionsQuery, {
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
  async function getChatSessions() {

    // Debug
    const fnName = `getChatSessions()`

    // Query
    const getChatSessionsData =
      await fetchChatsQuery(
        {
          variables: {
            instanceId: instanceId,
            status: BaseDataTypes.activeStatus,
            userProfileId: userProfileId
          }
        })

    // Set results
    const results = getChatSessionsData.data.getChatSessions

    setChatSessions(results)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getChatSessions()
    }

    // Only proceed if refresh is true
    if (refresh === false) {
      return
    } else {
      setRefresh(false)
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [refresh])

  // Render
  return (
    <></>
  )
}
