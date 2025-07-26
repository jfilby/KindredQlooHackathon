import Head from 'next/head'
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { pageBodyWidthPlus } from '@/components/layouts/full-height-layout'
import LoadPostSummariesByFilter from '@/components/post-summaries/load-by-filter'
import ListPostSummaries from '@/components/post-summaries/list'

interface Props {
  userProfile: any
}

export default function PostSummariesPage({
                          userProfile
                        }: Props) {

  // State
  const [postSummaries, setPostSummaries] = useState<any[] | undefined>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Post summaries</title>
      </Head>

      <Layout userProfile={userProfile}>

        <Box
          style={{ margin: '0 auto', width: pageBodyWidthPlus, textAlign: 'center', verticalAlign: 'textTop' }}
          sx={{ bgcolor: 'background.default' }}>

          {postSummaries != null ?
            <ListPostSummaries
              userProfileId={userProfile.id}
              postSummaries={postSummaries} />
          :
            <Typography>
              Loading..
            </Typography>
          }
        </Box>
      </Layout>

      <LoadPostSummariesByFilter
        userProfileId={userProfile.id}
        setPostSummaries={setPostSummaries} />
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
