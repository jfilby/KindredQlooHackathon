import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'

interface Props {
  instanceId: string
}

export default function IndexAiPersonaNavBar({
                          instanceId
                        }: Props) {

  // Consts
  const addUrl = `/ai-personas/add`

  // Render
  return (
    <div style={{ paddingTop: '2em', minWidth: 275 }}>

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'inline-block', width: '50%' }}>

          <Typography variant='h3'>
            AI Personas
          </Typography>
        </div>

        <div style={{ display: 'inline-block', height: '2em', width: '50%' }}>

          <div style={{ marginBottom: '0.5em', textAlign: 'right' }}>
          </div>

          <div style={{ textAlign: 'right' }}>
            <LabeledIconButton
              icon={AddIcon}
              label='Add'
              onClick={(e: any) => window.location.href = addUrl}
              style={{ marginRight: '1em' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
