import { Typography } from '@mui/material'
import ViewUserInterestCard from './card'

interface Props {
  userProfileId: string
  userInterests: any[]
}

export default function ListUserInterests({
                          userProfileId,
                          userInterests
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {userInterests != null ?
        <>
          <div style={{ marginBottom: '2em' }}>

            <Typography variant='h5'>
              Interests
            </Typography>
          </div>

          {userInterests.length > 0 ?
            <>
              {userInterests.map(userInterest => (
                <ViewUserInterestCard
                  key={userInterest.id}
                  userProfileId={userProfileId}
                  userInterest={userInterest} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No interests yet.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
