import Head from 'next/head'
import { useState } from 'react'
import { Box } from '@mui/material'
// import { loadServerPage } from '@/services/page/load-server-page'
// import { pageBodyWidthPlus } from '@/components/layout/full-height-layout'
// import ToolpadLayout from '@/components/layout/toolpad-layout'
import AiPersonaChatNavBar from '../../archive/components/chats/ai-persona-chat-nav-bar'
import ViewChatSession from '../../archive/components/chats/view-session'
import GraphTest from '@/components/cytoscape/graph'

interface Props {
  userProfile: any
  aiPersona: any
  chatSession: any
  domainRecordResults: any
}

export default function ViewAiPersonaChatPage({
                          userProfile,
                          aiPersona,
                          chatSession,
                          domainRecordResults
                        }: Props) {

  // State
  const [pathname, setPathname] = useState(`/test`)
  const [prompt, setPrompt] = useState<string>('')

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - AI persona chat</title>
      </Head>

      <GraphTest />

      {/* <ToolpadLayout
        userProfile={userProfile}
        instance={instance}
        pathname={pathname}
        setPathname={setPathname}>

        <Box
          style={{ margin: '0 auto', width: pageBodyWidthPlus, verticalAlign: 'textTop' }}
          sx={{ bgcolor: 'background.default' }}>

          <>
            <AiPersonaChatNavBar
              aiPersona={aiPersona} />

            {chatSession != null ?
              <ViewChatSession
                chatSession={chatSession}
                userProfileId={userProfile.id}
                aiPersonaId={aiPersona.id}
                showInputTip={undefined}
                setShowInputTip={undefined}
                showNextTip={undefined}
                setShowNextTip={undefined} />
            :
              <></>
            }
          </>
        </Box>
      </ToolpadLayout> */}
    </>
  )
}

/* export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           {
             getAiPersonaById: true,
             loadChatByAiPersonaId: true,
             verifyAdminUsersOnly: false,
             verifyLoggedInUsersOnly: true
           })
} */
