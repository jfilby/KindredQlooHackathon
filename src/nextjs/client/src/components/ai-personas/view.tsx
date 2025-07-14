import { useState } from 'react'
import { Alert, Typography } from '@mui/material'
import ViewTextField from '@/serene-core-client/components/basics/view-text-field'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  instanceId: string
  userProfileId: string
  aiPersona: any
}

export default function ViewAiPersona({
                          instanceId,
                          userProfileId,
                          aiPersona
                        }: Props) {

  // Consts
  const status = aiPersona != null ? BaseDataTypes.statusMap[aiPersona.status] : ''

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  // Render
  return (
    <div style={{ paddingTop: '2em', minWidth: 275 }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <div style={{ marginBottom: '2em' }}>

        <Typography
          style={{ marginBottom: '1em' }}
          variant='h5'>
          Details
        </Typography>

        <ViewTextField
          label='Status'
          value={status}
          style={{ marginBottom: '1em' }} />
      </div>
    </div>
  )
}
