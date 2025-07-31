import { useEffect, useRef } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getUserInterestsStatusQuery } from '@/apollo/user-interests'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  userProfileId: string
  setUserInterestsStatus: (status: string) => void
}

export default function LoadUserInterestsStatus({
  userProfileId,
  setUserInterestsStatus
}: Props) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [fetchGetUserInterestsStatusQuery] = useLazyQuery(getUserInterestsStatusQuery, {
    fetchPolicy: 'no-cache'
  })

  const getUserInterestsStatus = async (): Promise<boolean> => {
    try {
      const { data } = await fetchGetUserInterestsStatusQuery({
        variables: { userProfileId }
      })

      const status = data?.getUserInterestsStatus?.userInterestsStatus

      if (status) {
        setUserInterestsStatus(status)
        return status === BaseDataTypes.newStatus
      }

      return false
    } catch (error) {
      console.error('Error fetching user interests status:', error)
      return false
    }
  }

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const shouldReload = await getUserInterestsStatus()

      if (shouldReload && isMounted) {

        intervalRef.current = setInterval(() => {
          getUserInterestsStatus().then(reload => {
            if (!reload && intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          })
        }, 15 * 1000)
      }
    }

    init()

    return () => {
      isMounted = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return null
}
