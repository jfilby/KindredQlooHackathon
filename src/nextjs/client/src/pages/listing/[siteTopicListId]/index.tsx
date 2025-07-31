import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import ViewChatSession from '@/components/chats/view-session'

interface Props {
  userProfile: any
  chatSession: any
  siteTopicListId: string
}

export default function ListingChatPage({
                          userProfile,
                          chatSession,
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
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Listing chat</title>
      </Head>

      <Layout userProfile={userProfile}>

        <Typography variant='h4'>
          Listing chat
        </Typography>

        <ViewChatSession
          postSummaryId={undefined}
          siteTopicListId={siteTopicListId}
          chatSession={chatSession}
          userProfileId={userProfile.id}
          instanceId={undefined}
          showInputTip={undefined}
          setShowInputTip={undefined}
          showNextTip={undefined}
          setShowNextTip={undefined} />
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
