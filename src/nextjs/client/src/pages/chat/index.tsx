import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { Box, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { pageBodyWidthPlus } from '@/components/layouts/full-height-layout'
import ViewChatSession from '@/components/chats/view-session'

interface Props {
  userProfile: any
  chatSession: any
  postSummaryId: string | undefined
  siteTopicListId: string | undefined
}

export default function ChatPage({
                          userProfile,
                          chatSession,
                          postSummaryId,
                          siteTopicListId
                        }: Props) {

  // Session
  const { data: session } = useSession()

  // State
  ;

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Chat</title>
      </Head>

      <Layout userProfile={userProfile}>

        <Box
          style={{ margin: '0 auto', width: pageBodyWidthPlus, textAlign: 'center', verticalAlign: 'textTop' }}
          sx={{ bgcolor: 'background.default' }}>

          <Typography variant='h4'>
            My interests
          </Typography>

          <ViewChatSession
            postSummaryId={postSummaryId}
            siteTopicListId={siteTopicListId}
            chatSession={chatSession}
            userProfileId={userProfile.id}
            instanceId={undefined}
            showInputTip={undefined}
            setShowInputTip={undefined}
            showNextTip={undefined}
            setShowNextTip={undefined} />
        </Box>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           {
             loadChatByChatSettingsName: 'kindred',
             verifyAdminUsersOnly: false,
             verifyLoggedInUsersOnly: false
           })
}
