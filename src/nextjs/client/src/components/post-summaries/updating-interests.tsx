import { useState } from 'react'
import { Alert } from '@mui/material'
import LoadUserInterestsStatus from './load-user-interests-status'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  userProfileId: string
  initialUserInterestsStatus: string
}

export default function UpdatingInterestsNotification({
                          userProfileId,
                          initialUserInterestsStatus
                        }: Props) {

  // State
  const [userInterestsStatus, setUserInterestsStatus] = useState<string>(initialUserInterestsStatus)

  // Functions
  const renderSwitch = () => {

    switch (userInterestsStatus) {

      case BaseDataTypes.newStatus:
        return <Alert
          severity='info'
          style={{ marginBottom: '1em', justifyContent: 'center', width: '30em' }}>
          Your updated interests are being processed..
        </Alert>

      case BaseDataTypes.activeStatus:
        return <Alert
          severity='success'
          style={{ marginBottom: '1em', justifyContent: 'center', width: '30em' }}>
          Your updated interests are ready!
        </Alert>

      default:
        return <Alert
          severity='error'
          style={{ marginBottom: '1em', justifyContent: 'center', width: '30em' }}>
          Unhandled status: {userInterestsStatus}
        </Alert>
    }
  }

  // Render
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderSwitch()}
      </div>

      <LoadUserInterestsStatus
        userProfileId={userProfileId}
        setUserInterestsStatus={setUserInterestsStatus} />
    </>
  )
}
