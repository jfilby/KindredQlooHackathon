import Head from 'next/head'
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { pageBodyWidthPlus } from '@/components/layouts/full-height-layout'
import LoadUserEntityInterestsByFilter from '@/components/user-interests/load-by-filter'
import ListUserEntityInterests from '@/components/user-interests/list'

interface Props {
  userProfile: any
}

export default function InterestsPage({
                          userProfile
                        }: Props) {

  // State
  const [userEntityInterests, setUserEntityInterests] = useState<any[] | undefined>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Your interests</title>
      </Head>

      <Layout userProfileId={userProfile.id}>

        <Box
          style={{ margin: '0 auto', width: pageBodyWidthPlus, textAlign: 'center', verticalAlign: 'textTop' }}
          sx={{ bgcolor: 'background.default' }}>

          {userEntityInterests != null ?
            <ListUserEntityInterests
              userProfileId={userProfile.id}
              userEntityInterests={userEntityInterests} />
          :
            <Typography>
              Loading..
            </Typography>
          }
        </Box>
      </Layout>

      <LoadUserEntityInterestsByFilter
        userProfileId={userProfile.id}
        setUserEntityInterests={setUserEntityInterests} />
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           {
             verifyAdminUsersOnly: false,
             verifyLoggedInUsersOnly: false
           })
}
