import { Link, Typography } from '@mui/material'

interface Props {
  aiPersona: any
}

export default function AiPersonaChatNavBar({
                          aiPersona
                        }: Props) {

  // Render
  return (
    <div style={{ paddingTop: '2em', minWidth: 275 }}>

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'inline-block', width: '50%' }}>

          <Typography variant='h3'>
            {aiPersona.name}
          </Typography>
          <i>AI persona chat</i>
        </div>

        <div style={{ display: 'inline-block', height: '2em', textAlign: 'right', width: '50%' }}>

        <div style={{ marginBottom: '0.5em', textAlign: 'right' }}>
            <Typography
              style={{ display: 'inline-block' }}
              variant='body1'>
              AI persona:
            </Typography>
            &nbsp;
            <Link
              href={`/ai-persona/${aiPersona.ai}`}
              style={{ display: 'inline-block' }}>
              <Typography variant='body1'>
                {aiPersona.name}
              </Typography>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
