import Head from 'next/head'
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { pageBodyWidthPlus } from '@/components/layouts/full-height-layout'
import LoadUserInterestsByFilter from '@/components/user-interests/load-by-filter'
import ListUserInterests from '@/components/user-interests/list'

interface Props {
  userProfile: any
}

export default function InterestsPage({
                          userProfile
                        }: Props) {

  // State
  const [userInterests, setUserInterests] = useState<any[] | undefined>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Interests</title>
      </Head>

      <Layout userProfileId={userProfile.id}>

        <Box
          style={{ margin: '0 auto', width: pageBodyWidthPlus, textAlign: 'center', verticalAlign: 'textTop' }}
          sx={{ bgcolor: 'background.default' }}>

          {userInterests != null ?
            <ListUserInterests
              userProfileId={userProfile.id}
              userInterests={userInterests} />
          :
            <Typography>
              Loading..
            </Typography>
          }
        </Box>
      </Layout>

      <LoadUserInterestsByFilter
        userProfileId={userProfile.id}
        setUserInterests={setUserInterests} />
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
