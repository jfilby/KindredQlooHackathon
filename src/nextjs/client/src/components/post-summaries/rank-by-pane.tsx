import { useState } from 'react'
import { Alert, Link, Typography } from '@mui/material'
import SaveUserSiteTopic from './save-user-site-topic'

interface Props {
  userProfileId: string
  siteTopicId: string
  rankBy: string
  setLoadListing: any
}

export default function RankByPane({
                          userProfileId,
                          siteTopicId,
                          rankBy,
                          setLoadListing
                        }: Props) {

  // State
  const [saveRankBy, setSaveRankBy] = useState<string>(rankBy)
  const [saveAction, setSaveAction] = useState<boolean>(false)

  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState(undefined)

  // Render
  return (
    <div style={{ display: 'flex', marginTop: '1em', justifyContent: 'center' }}>

      {alertSeverity &&
       alertSeverity !== 'success' &&
       message ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
        :
        <></>
      }

      Rank by..

      <Typography
        style={{ color: 'grey', marginLeft: '2em' }}
        variant='body1'>

        {rankBy === 'front-page' ?
          <>Front page</>
        :
          <Link
            onClick={(e) => {
              setSaveRankBy('front-page')
              setSaveAction(true)
            }}
            style={{ color: 'grey', cursor: 'pointer' }}
            sx={{
              textDecorationColor: 'grey',
              textDecorationThickness: '1px',
              '&:hover': {
                textDecorationThickness: '2px',
              },
            }}
            underline='always'>
            Front page
          </Link>
        }
      </Typography>

      <Typography
        style={{ color: 'grey', marginLeft: '2em' }}
        variant='body1'>

        {rankBy === 'interests' ?
          <>My interests</>
        :
          <Link
            onClick={(e) => {
              setSaveRankBy('interests')
              setSaveAction(true)}
            }
            style={{ color: 'grey', cursor: 'pointer' }}
            sx={{
              textDecorationColor: 'grey',
              textDecorationThickness: '1px',
              '&:hover': {
                textDecorationThickness: '2px',
              },
            }}
            underline='always'>
            My interests
          </Link>
        }
      </Typography>

      <SaveUserSiteTopic
        userProfileId={userProfileId}
        siteTopicId={siteTopicId}
        rankBy={saveRankBy}
        setAlertSeverity={setAlertSeverity}
        setMessage={setMessage}
        saveAction={saveAction}
        setSaveAction={setSaveAction}
        setSaveCompleted={setLoadListing} />
    </div>
  )
}
