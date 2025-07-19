import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { Alert, Divider, Link, Typography } from '@mui/material'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { StringUtilsService } from '@/serene-core-client/services/utils/string'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import DeleteDialog from '../dialogs/delete-dialog'
import UndeleteDialog from '../dialogs/undelete-dialog'
import Markdown from 'react-markdown'

interface Props {
  userProfileId: string
  userInterest: any
}

export default function ViewUserEntityInterestCard({
                          userProfileId,
                          userInterest
                        }: Props) {

  // Services
  const stringUtilsService = new StringUtilsService()

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>('')
  const [message, setMessage] = useState<string | undefined>(undefined)

  const [actionsDisplay, setActionsDisplay] = useState('none')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [undeleteDialogOpen, setUndeleteDialogOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [undeleteAction, setUndeleteAction] = useState(false)
  const [saveAction, setSaveAction] = useState(false)

  const [userInterestToSave, setPostSummaryToSave] = useState(userInterest)

  // Effects
  useEffect(() => {

    if (deleteAction === true) {

      userInterestToSave.status = BaseDataTypes.deletePendingStatus
      setPostSummaryToSave(userInterestToSave)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      userInterestToSave.status = BaseDataTypes.activeStatus
      setPostSummaryToSave(userInterestToSave)
      setSaveAction(true)
      setUndeleteAction(false)
    }

  }, [undeleteAction])

  // Render
  return (
    <div
      onMouseOver={(e) => setActionsDisplay('inline-block')}
      onMouseOut={(e) => setActionsDisplay('none')}
      style={{ paddingTop: '2em' }}>

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <div style={{ marginBottom: '2em', textAlign: 'left' }}>
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>

          <>

            <Typography
              style={{
                color: userInterest.status === BaseDataTypes.deletePendingStatus ? 'grey' : undefined,
                display: 'inline-block',
                textAlign: 'left'
              }}
              variant='h6'>

              <Link
                href={userInterest.post.postUrl.url}
                style={{ color: 'black' }}
                sx={{
                  textDecorationColor: 'black',
                  textDecorationThickness: '1px',
                  '&:hover': {
                    textDecorationThickness: '2px',
                  },
                }}
                underline='always'>

                {stringUtilsService.getSnippet(
                   userInterest.post.title,
                   120)}
              </Link>
            </Typography>

            <Markdown>
              {stringUtilsService.getSnippet(
                 userInterest.text,
                 // 255
                 1000
                 )}
            </Markdown>

            {userInterest.status === BaseDataTypes.deletePendingStatus ?
              <Typography
                style={{ color: 'gray' }}
                variant='body2'>
                <i>Deleted</i>
              </Typography>
            :
              <></>
            }
          </>

          {userInterest.createdByName != null ?
            <>{userInterest.createdByName}</>
          :
            <></>
          }
        </div>
      </div>

      {/* <div style={{ display: actionsDisplay, height: '2em', textAlign: 'right', width: '30%' }}>

        <div>
          <>
            {userInterestToSave.status !== BaseDataTypes.deletePendingStatus ?

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
      </div> */}

      <Divider variant='fullWidth' />

      {/* <SavePostSummary
        userInterest={userInterestToSave}
        userProfileId={userProfileId}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setSaveCompleted={undefined}
        setEditMode={undefined} /> */}

      <DeleteDialog
        open={deleteDialogOpen}
        type='post summary'
        name={userInterest.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteDialog
        open={undeleteDialogOpen}
        name={userInterest.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} />

    </div>
  )
}
