import { useEffect, useState } from 'react'
import { Alert, Box, Button, TextField } from '@mui/material'
import SaveUserInterestsText from './save-text'

interface Props {
  userProfileId: string
  text: string
  setText: any
}

export default function TextEditUserInterests({
                          userProfileId,
                          text,
                          setText
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [saveAction, setSaveAction] = useState<boolean>(false)
  const [saveCompleted, setSaveCompleted] = useState<boolean>(false)

  // Effects
  useEffect(() => {

    // On save completed successfully
    if (saveCompleted === true) {
      setAlertSeverity('success')
      setMessage('Saved! Changes could take up to a minute to take effect.')
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
        style={{ marginBottom: '2em' }}
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
