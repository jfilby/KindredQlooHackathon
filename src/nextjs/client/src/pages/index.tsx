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
  const [siteTopicListId, setSiteTopicListId] = useState<string | undefined>(undefined)
  const [userSiteTopic, setUserSiteTopic] = useState<any | undefined>(undefined)
  const [postSummaries, setPostSummaries] = useState<any[] | undefined>(undefined)
  const [openRankBy, setOpenRankBy] = useState<boolean>(false)
  const [loadListing, setLoadListing] = useState<boolean>(true)

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
          
          {/* <p>loadListing: {JSON.stringify(loadListing)}</p> */}

          {siteTopicListId != null &&
           postSummaries != null ?

            <ListPostSummaries
              userProfileId={userProfile.id}
              userSiteTopic={userSiteTopic}
              siteTopicListId={siteTopicListId}
              postSummaries={postSummaries}
              openRankBy={openRankBy}
              setOpenRankBy={setOpenRankBy}
              setLoadListing={setLoadListing} />
          :
            <Typography>
              Loading..
            </Typography>
          }
        </Box>
      </Layout>

      <LoadPostSummariesByFilter
        userProfileId={userProfile.id}
        setSiteTopicListId={setSiteTopicListId}
        setUserSiteTopic={setUserSiteTopic}
        setPostSummaries={setPostSummaries}
        loadListing={loadListing}
        setLoadListing={setLoadListing} />
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
