import Head from 'next/head'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {  Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LinkIcon from '@mui/icons-material/Link'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { StringUtilsService } from '@/serene-core-client/services/utils/string'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import LoadPostSummaryById from '@/components/post-summaries/load-by-id'
import ViewChatSession from '@/components/chats/view-session'

interface Props {
  userProfile: any
  chatSession: any
  postSummaryId: string
}

export default function PostSummaryChatPage({
                          userProfile,
                          chatSession,
                          postSummaryId
                        }: Props) {

  // Consts
  const backUrl = '/'

  // Services
  const stringUtilsService = new StringUtilsService()

  // Session
  const { data: session } = useSession()

  // State
  const [postSummary, setPostSummary] = useState<any>(undefined)

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Post summary chat</title>
      </Head>

      <Layout userProfile={userProfile}>

         <div style={{ textAlign: 'center' }}>
          <Typography
            variant='h4'>
            {postSummary != null ?
              <>{postSummary.post.title}</>
            :
              <>Post summary</>
            }
          </Typography>
        </div>

        <div>
          {postSummary != null ?
            <>
              <LabeledIconButton
                icon={ArrowBackIcon}
                label='Back'
                onClick={(e: any) => window.location.href = backUrl}
                style={{ marginRight: '1em' }} />

              {postSummary?.socialMediaUrl != null ?
                <>
                  <LabeledIconButton
                    icon={LinkIcon}
                    label={postSummary.post.site.name}
                    onClick={(e: any) => {
                      window.open(postSummary.socialMediaUrl, '_blank')?.focus()
                    }} />
                </>
              :
                <></>
              }
            </>
          :
            <></>
          }
        </div>

        <Typography
          style={{ marginBottom: '1em', textAlign: 'left' }}
          variant='body1'>
          {postSummary != null ?
            <>{stringUtilsService.getSnippet(postSummary.postSummary, 255)}</>
          :
            <>...</>
          }
        </Typography>

        <ViewChatSession
          postSummaryId={postSummaryId}
          siteTopicListId={undefined}
          chatSession={chatSession}
          userProfileId={userProfile.id}
          instanceId={undefined}
          showInputTip={undefined}
          setShowInputTip={undefined}
          showNextTip={undefined}
          setShowNextTip={undefined} />
      </Layout>

      <LoadPostSummaryById
        id={postSummaryId}
        userProfileId={userProfile.id}
        setPostSummary={setPostSummary} />
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
