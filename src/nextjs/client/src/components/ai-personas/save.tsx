import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { upsertDomainRecordMutation } from '@/apollo/ai-personas'

interface Props {
  aiPersona: any
  setAiPersona: any
  userProfileId: string
  setAlertSeverity: any
  setMessage: any
  saveAction: boolean
  setSaveAction: any
  setSaveCompleted: any
  setEditMode: any
}

export default function SaveAiPersona({
                          aiPersona,
                          setAiPersona,
                          userProfileId,
                          setAlertSeverity,
                          setMessage,
                          saveAction,
                          setSaveAction,
                          setSaveCompleted,
                          setEditMode
                        }: Props) {

  // GraphQL
  const [sendUpsertDomainRecordMutation] =
    useMutation(upsertDomainRecordMutation, {
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
  async function upsertDomainRecord() {

    // Query
    const sendUpsertDomainRecordData =
      await sendUpsertDomainRecordMutation(
        {
          variables: {
            id: aiPersona ? aiPersona.id : undefined,
            userProfileId: userProfileId,
            status: aiPersona.status,
            name: aiPersona.name,
            description: aiPersona.description
          }
        })

    // Get results and set fields
    const results = sendUpsertDomainRecordData.data.upsertDomainRecord

    if (results.status === true) {
      setAlertSeverity('success')
    } else {
      setAlertSeverity('error')
    }

    setMessage(results.message)

    // Done
    setSaveAction(false)

    if (results.status === true) {

      if (setEditMode != null) {
        setEditMode(false)
      }

      if (aiPersona.id == null &&
          results.domainRecord.id != null) {

        aiPersona.id = results.domainRecord.id
        setAiPersona(aiPersona)
      }

      if (setSaveCompleted != null) {
        setSaveCompleted(true)
      }
    }
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await upsertDomainRecord()
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
