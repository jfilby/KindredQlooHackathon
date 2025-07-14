import { Typography } from '@mui/material'

interface Props {
}

export default function AddAiPersonaNavBar({}: Props) {

  // Render
  return (
    <div style={{ paddingTop: '2em', minWidth: 275 }}>

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'inline-block', width: '50%' }}>

          <Typography variant='h3'>
            Add an AI persona
          </Typography>
        </div>

        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', width: '50%' }}>
        </div>
      </div>
    </div>
  )
}
