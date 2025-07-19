import { Typography } from '@mui/material'
import ViewUserEntityInterestCard from './card'

interface Props {
  userProfileId: string
  userEntityInterests: any[]
}

export default function ListUserEntityInterests({
                          userProfileId,
                          userEntityInterests
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {userEntityInterests != null ?
        <>
          <div style={{ marginBottom: '2em' }}>

            <Typography variant='h5'>
              Interests
            </Typography>
          </div>

          {userEntityInterests.length > 0 ?
            <>
              {userEntityInterests.map(userEntityInterest => (
                <ViewUserEntityInterestCard
                  key={userEntityInterest.id}
                  userProfileId={userProfileId}
                  userInterest={userEntityInterest} />
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
