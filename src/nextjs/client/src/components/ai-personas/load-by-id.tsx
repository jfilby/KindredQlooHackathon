import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getAiPersonaQuery } from '@/apollo/ai-personas'

interface Props {
  id: string
  cascade: boolean
  userProfileId: string
  setAiPersona: any
  loadAction: boolean
  setLoadAction: any
  setEditMode: any
}

export default function LoadAiPersonaById({
                          id,
                          cascade,
                          userProfileId,
                          setAiPersona,
                          loadAction,
                          setLoadAction,
                          setEditMode
                        }: Props) {

  // GraphQL
  const [fetchGetAiPersonaQuery] =
    useLazyQuery(getAiPersonaQuery, {
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
  async function getAiPersona() {

    // Query
    const fetchGetAiPersonaData =
      await fetchGetAiPersonaQuery(
        {
          variables: {
            id: id,
            cascade: cascade,
            userProfileId: userProfileId
          }
        })

    const results = fetchGetAiPersonaData.data.getAiPersona

    setAiPersona(results.aiPersona)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getAiPersona()
    }

    // Return early if no load action requested
    if (loadAction !== true) {

      return
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

    // Done
    setLoadAction(false)

    if (setEditMode != null) {
      setEditMode(false)
    }

  }, [loadAction])

  // Render
  return (
    <></>
  )
}
