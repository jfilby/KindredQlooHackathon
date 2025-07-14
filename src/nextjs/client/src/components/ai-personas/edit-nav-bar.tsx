import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import GroupIcon from '@mui/icons-material/Group'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'

interface Props {
  aiPersona: any
  setEditMode: any
}

export default function EditAiPersonaNavBar({
                          aiPersona,
                          setEditMode
                        }: Props) {

  // Consts
  const addUrl = `/ai-personas/add`
  const aiPersonaUrl = `/ai-persona/${aiPersona.id}`

  // Render
  return (
    <div style={{ paddingTop: '2em', minWidth: 275 }}>

      <div style={{ marginBottom: '2em' }}>
        <div style={{ display: 'inline-block', width: '50%' }}>

          <Typography variant='h3'>
            {aiPersona.name}
          </Typography>
          <i>AI persona</i>
        </div>

        <div style={{ display: 'inline-block', height: '2em', width: '50%' }}>

          <div style={{ marginBottom: '0.5em', textAlign: 'right' }}>
          </div>

          <div style={{ textAlign: 'right' }}>
            <LabeledIconButton
              icon={EditIcon}
              label='Edit'
              onClick={(e: any) => setEditMode(true)}
              style={{ marginRight: '1em' }} />

            <LabeledIconButton
              icon={AddIcon}
              label='Add'
              onClick={(e: any) => window.location.href = addUrl}
              style={{ marginRight: '1em' }} />

            <LabeledIconButton
              icon={DeleteIcon}
              label='Delete'
              onClick={(e: any) => setEditMode(true)}
              style={{ marginRight: '1em' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

