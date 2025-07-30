import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { upsertUserSiteTopicMutation } from '@/apollo/social-media'

interface Props {
  userProfileId: string
  siteTopicId: string
  rankBy: string
  setAlertSeverity: any
  setMessage: any
  saveAction: boolean
  setSaveAction: any
  setSaveCompleted: any
}

export default function SaveUserSiteTopic({
                          userProfileId,
                          siteTopicId,
                          rankBy,
                          setAlertSeverity,
                          setMessage,
                          saveAction,
                          setSaveAction,
                          setSaveCompleted
                        }: Props) {

  // GraphQL
  const [sendUpsertUserSiteTopicMutation] =
    useMutation(upsertUserSiteTopicMutation, {
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
  async function upsertUserSiteTopic() {

    // Query
    const sendUpsertUserSiteTopicData =
      await sendUpsertUserSiteTopicMutation(
        {
          variables: {
            userProfileId: userProfileId,
            siteTopicId: siteTopicId,
            rankBy: rankBy
          }
        })

    // Get results and set fields
    const results = sendUpsertUserSiteTopicData.data.upsertUserSiteTopic

    if (results.status === true) {
      setAlertSeverity('success')
      setMessage(`Saved successfully`)

      setSaveCompleted(true)
    } else {
      setAlertSeverity('error')
      setMessage(results.message)
    }

    // Done
    setSaveAction(false)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await upsertUserSiteTopic()
    }

    // Return early if no save action requested
    if (saveAction !== true) {

      return
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [saveAction])

  // Render
  return (
    <></>
  )
}
