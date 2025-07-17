import { useEffect, useState } from 'react'
import { Alert, Box, Button, TextField } from '@mui/material'
import { InterestsService } from '@/services/interests/service'
import SaveUserInterestsText from './save-text'

interface Props {
  userProfileId: string
  userInterests: any[]
}

export default function TextEditUserInterests({
                          userProfileId,
                          userInterests
                        }: Props) {

  // Services
  const interestsService = new InterestsService()

  // Consts
  const initialText = interestsService.mapUserInterestsToText(userInterests)

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [text, setText] = useState<string>(initialText)
  const [saveAction, setSaveAction] = useState<boolean>(false)
  const [saveCompleted, setSaveCompleted] = useState<boolean>(false)

  // Effects
  useEffect(() => {

    // On save completed successfully
    if (saveCompleted === true) {
      window.location.href = '/interests'
    }

  }, [saveCompleted])

  // Render
  return (
    <>
      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <Box
        component='form'
        style={{ marginBottom: '2m' }}
        sx={{ '& .MuiTextField-root': { m: 1 } }}
        noValidate
        autoComplete='off'>

        <TextField
          id='outlined-multiline-flexible'
          label='Your interests'
          multiline
          minRows={10}
          onChange={(e) => { setText(e.target.value) }}
          style={{ marginBottom: '2em', width: '100%' }}
          value={text} />

        <Button
          onClick={(e) => setSaveAction(true)}
          variant='contained'>
          Save
        </Button>
      </Box>

      <SaveUserInterestsText
        userProfileId={userProfileId}
        text={text}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setSaveCompleted={setSaveCompleted} />
    </>
  )
}
