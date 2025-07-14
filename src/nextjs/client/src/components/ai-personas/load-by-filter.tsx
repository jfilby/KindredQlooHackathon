import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { filterAiPersonasQuery } from '@/apollo/ai-personas'

interface Props {
  instanceId: string
  userProfileId: string
  entityId: string
  filterByFieldsValues?: string | undefined
  cascade: boolean
  setDomainRecords: any
}

export default function LoadAiPersonasByFilter({
                          instanceId,
                          userProfileId,
                          entityId,
                          filterByFieldsValues,
                          cascade,
                          setDomainRecords
                        }: Props) {

  // GraphQL
  const [fetchFilterAiPersonasQuery] =
    useLazyQuery(filterAiPersonasQuery, {
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
  async function getAiPersonas() {

    // Query
    const fetchFilterAiPersonasData =
      await fetchFilterAiPersonasQuery(
        {
          variables: {
            instanceId: instanceId,
            userProfileId: userProfileId,
            entityId: entityId,
            filterByFieldsValues: filterByFieldsValues,
            cascade: cascade,
            status: BaseDataTypes.activeStatus
          }
        })

    const results = fetchFilterAiPersonasData.data.filterAiPersonas

    setDomainRecords(results.domainRecords)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getAiPersonas()
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
