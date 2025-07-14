import { useEffect, useState } from 'react'
import ChatIcon from '@mui/icons-material/Chat'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Divider, Link, Typography } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import DeleteDialog from '@/components/dialogs/delete-dialog'
import UndeleteDialog from '@/components/dialogs/undelete-dialog'
import SaveAiPersona from '@/components/ai-personas/save'

interface Props {
  userProfileId: string
  aiPersona: any
}

export default function ViewAiPersonaCard({
                          userProfileId,
                          aiPersona
                        }: Props) {

  // Consts
  const chatUrl = `/ai-persona/${aiPersona.id}/chat`
  const url = `/ai-persona/${aiPersona.id}`

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [actionsDisplay, setActionsDisplay] = useState('none')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  const [aiPersonaToSave, setAiPersonaToSave] = useState(aiPersona)

  // Effects
  useEffect(() => {

    if (deleteAction === true) {

      aiPersonaToSave.status = BaseDataTypes.deletePendingStatus
      setAiPersonaToSave(aiPersonaToSave)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      aiPersonaToSave.status = BaseDataTypes.activeStatus
      setAiPersonaToSave(aiPersonaToSave)
      setSaveAction(true)
      setUndeleteAction(false)
    }

  }, [undeleteAction])

  // Render
  return (
    <div
      onMouseOver={(e) => setActionsDisplay('inline-block')}
      onMouseOut={(e) => setActionsDisplay('none')}
      style={{ paddingTop: '2em', minWidth: 275 }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      {/* <p>userProfileId: {userProfileId}</p>
      <p>entity: {JSON.stringify(entity)}</p>
      <p>agent: {JSON.stringify(agent)}</p>
      <p>namedFieldsObject: {JSON.stringify(namedFieldsObject)}</p> */}

      <div style={{ marginBottom: '2em', height: '3em' }}>
        <div style={{ display: 'inline-block', verticalAlign: 'top', width: '50%' }}>

          {aiPersona.status === BaseDataTypes.activeStatus ?
            <Link href={url}>
              <Typography variant='h6'>
                {aiPersona.name}
              </Typography>
            </Link>
          :
            <>
              <Typography
                style={{ color: 'gray' }}
                variant='h6'>
                {aiPersona.name}
              </Typography>
              <Typography
                style={{ color: 'gray' }}
                variant='body2'>
                <i>Deleted</i>
              </Typography>
            </>
          }

          <Typography variant='body1'>
            {aiPersona.description}
          </Typography>

          {aiPersona.createdByName != null ?
            <>{aiPersona.createdByName}</>
          :
            <></>
          }
        </div>

        <div style={{ display: actionsDisplay, textAlign: 'right', width: '50%' }}>

          <div>
            <>
              <LabeledIconButton
                icon={ChatIcon}
                label='Chat'
                onClick={(e: any) => window.location.href = chatUrl}
                style={{ marginRight: '1em' }} />

              {aiPersona.status === BaseDataTypes.activeStatus ?

                <LabeledIconButton
                  icon={DeleteIcon}
                  label='Delete'
                  onClick={(e: any) => setDeleteDialogOpen(true)}
                  style={{ marginRight: '1em' }} />
              :
                <LabeledIconButton
                  icon={RestoreFromTrashIcon}
                  label='Restore'
                  onClick={(e: any) => setUndeleteDialogOpen(true)}
                  style={{ cursor: 'pointer' }} />
              }
            </>
          </div>
        </div>
      </div>

      <Divider variant='fullWidth' />

      <SaveAiPersona
        aiPersona={aiPersonaToSave}
        setAiPersona={setAiPersonaToSave}
        userProfileId={userProfileId}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setSaveCompleted={undefined}
        setEditMode={undefined} />

      <DeleteDialog
        open={deleteDialogOpen}
        type='entity'
        name={aiPersona.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteDialog
        open={undeleteDialogOpen}
        name={aiPersona.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} />

    </div>
  )
}
