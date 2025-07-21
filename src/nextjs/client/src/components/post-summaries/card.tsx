import { useEffect, useState } from 'react'
import { Alert, Divider, Link, Typography } from '@mui/material'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { StringUtilsService } from '@/serene-core-client/services/utils/string'
import DeleteDialog from '../dialogs/delete-dialog'
import UndeleteDialog from '../dialogs/undelete-dialog'
import Markdown from 'react-markdown'
import ListPostSummaryInsights from '../post-summary-insights/list'

interface Props {
  userProfileId: string
  postSummary: any
}

export default function ViewPostSummaryCard({
                          userProfileId,
                          postSummary
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

  const [postSummaryToSave, setPostSummaryToSave] = useState(postSummary)

  // Effects
  useEffect(() => {

    if (deleteAction === true) {

      postSummaryToSave.status = BaseDataTypes.deletePendingStatus
      setPostSummaryToSave(postSummaryToSave)
      setSaveAction(true)
      setDeleteAction(false)
    }

  }, [deleteAction])

  useEffect(() => {

    if (undeleteAction === true) {

      postSummaryToSave.status = BaseDataTypes.activeStatus
      setPostSummaryToSave(postSummaryToSave)
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
                color: postSummary.status === BaseDataTypes.deletePendingStatus ? 'grey' : undefined,
                display: 'inline-block',
                textAlign: 'left'
              }}
              variant='h6'>

              <Link
                href={postSummary.post.postUrl.url}
                style={{ color: 'black' }}
                sx={{
                  textDecorationColor: 'black',
                  textDecorationThickness: '1px',
                  '&:hover': {
                    textDecorationThickness: '2px',
                  },
                }}
                target='_new'
                underline='always'>

                {stringUtilsService.getSnippet(
                   postSummary.post.title,
                   120)}
              </Link>
            </Typography>

            {postSummary.socialMediaUrl != null ?
              <Typography>
                <Link
                  href={postSummary.socialMediaUrl}
                  style={{ color: 'grey' }}
                  sx={{
                     textDecorationColor: 'grey',
                     textDecorationThickness: '1px',
                     '&:hover': {
                       textDecorationThickness: '2px',
                     },
                  }}
                  target='_new'
                  underline='hover'>
                  Discuss on {postSummary.site.name}
                </Link>
              </Typography>
            :
              <></>
            }

            {postSummary.postSummary != null ?
              <Markdown>
                {postSummary.postSummary}
              </Markdown>
            :
              <></>
            }

            {postSummary.topCommentsString != null ?
              <Markdown>
                {postSummary.topCommentsString}
              </Markdown>
            :
              <></>
            }

            {postSummary.insights != null ?
              <ListPostSummaryInsights
                userProfileId={userProfileId}
                insights={postSummary.insights} />
            :
              <></>
            }

            {postSummary.status === BaseDataTypes.deletePendingStatus ?
              <Typography
                style={{ color: 'gray' }}
                variant='body2'>
                <i>Deleted</i>
              </Typography>
            :
              <></>
            }
          </>

          {postSummary.createdByName != null ?
            <>{postSummary.createdByName}</>
          :
            <></>
          }
        </div>
      </div>

      {/* <div style={{ display: actionsDisplay, height: '2em', textAlign: 'right', width: '30%' }}>

        <div>
          <>
            {postSummaryToSave.status !== BaseDataTypes.deletePendingStatus ?

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
        postSummary={postSummaryToSave}
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
        name={postSummary.name}
        setOpen={setDeleteDialogOpen}
        setDeleteConfirmed={setDeleteAction} />

      <UndeleteDialog
        open={undeleteDialogOpen}
        name={postSummary.name}
        setOpen={setUndeleteDialogOpen}
        setUndeleteConfirmed={setUndeleteAction} />

    </div>
  )
}
