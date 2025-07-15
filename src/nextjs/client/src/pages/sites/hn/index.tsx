import Head from 'next/head'
import { useState } from 'react'
import { Box } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import FullHeightLayout, { pageBodyWidthPlus } from '@/components/layouts/full-height-layout'

interface Props {
  userProfile: any
}

export default function HnPostSummariesPage({
                          userProfile
                        }: Props) {

  // State
  const [pathname, setPathname] = useState(`/test`)
  const [prompt, setPrompt] = useState<string>('')

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - HN summaries</title>
      </Head>

      <FullHeightLayout
        userProfileId={userProfile.id}>

        <Box
          style={{ margin: '0 auto', width: pageBodyWidthPlus, verticalAlign: 'textTop' }}
          sx={{ bgcolor: 'background.default' }}>

          <>
          </>
        </Box>
      </FullHeightLayout>
    </>
  )
}

export async function getServerSideProps(context: any) {

  return loadServerPage(
           context,
           {
             verifyAdminUsersOnly: false,
             verifyLoggedInUsersOnly: true
           })
}
