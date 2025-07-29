import { Typography } from '@mui/material'

interface Props {
  chatTag: string
}

export default function AgentChatNavBar({
                          chatTag
                        }: Props) {

  // Render
  return (
    <div style={{ paddingTop: '2em', minWidth: 275 }}>

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'inline-block', width: '50%' }}>

          <Typography variant='h3'>
            Chat
          </Typography>
          <i>{chatTag}</i>
        </div>

        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', width: '50%' }}>

          <div style={{ marginBottom: '0.5em', textAlign: 'right' }}>
          </div>

        </div>
      </div>
    </div>
  )
}
