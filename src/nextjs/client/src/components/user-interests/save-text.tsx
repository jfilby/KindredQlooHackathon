import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { upsertUserInterestsTextMutation } from '@/apollo/user-interests'

interface Props {
  userProfileId: string
  text: string
  setAlertSeverity: any
  setMessage: any
  saveAction: boolean
  setSaveAction: any
  setSaveCompleted: any
}

export default function SaveUserInterestsText({
                          userProfileId,
                          text,
                          setAlertSeverity,
                          setMessage,
                          saveAction,
                          setSaveAction,
                          setSaveCompleted
                        }: Props) {

  // GraphQL
  const [sendUpsertUserInterestsTextMutation] =
    useMutation(upsertUserInterestsTextMutation, {
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
  async function upsertUserInterestsText() {

    // Query
    const sendUpsertUserInterestsTextData =
      await sendUpsertUserInterestsTextMutation(
        {
          variables: {
            userProfileId: userProfileId,
            text: text
          }
        })

    // Get results and set fields
    const results = sendUpsertUserInterestsTextData.data.upsertUserInterestsText

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
      await upsertUserInterestsText()
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
