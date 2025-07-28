import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'
import { pageBodyWidthPlus } from '@/components/layouts/full-height-layout'
import LoadUserEntityInterestsByFilter from '@/components/user-interests/load-by-filter'
import RecommendedInterests from '@/components/user-interests/recommended-list'
import TextEditUserInterests from '@/components/user-interests/text-edit'

interface Props {
  userProfile: any
}

export default function InterestsPage({
                          userProfile
                        }: Props) {

  // Session
  const { data: session } = useSession()

  // State
  const [userInterestsText, setUserInterestsText] = useState<any | undefined>(undefined)
  const [recommendedInterests, setRecommendedInterests] = useState<any[] | undefined>(undefined)

  const [text, setText] = useState<string | undefined>(undefined)
  const [loadedUserInterests, setLoadedUserInterests] = useState(false)

  // Effects
  useEffect(() => {

    setText(userInterestsText?.text ?? '')
  }, [loadedUserInterests])

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Your interests</title>
      </Head>

      <Layout userProfile={userProfile}>

        <Box
          style={{ margin: '0 auto', width: pageBodyWidthPlus, textAlign: 'center', verticalAlign: 'textTop' }}
          sx={{ bgcolor: 'background.default' }}>

          <Typography variant='h4'>
            My interests
          </Typography>

          <Typography variant='body1'>
            Aside from general tags/topics, you can get better recommendations
            by using these categories:
          </Typography>

          <Typography
            style={{ marginBottom: '1em' }}
            variant='body2'>
            artist, book, brand, destination, movie,
            person, place, podcast, tv_show, videogame
          </Typography>

          {text !== undefined ?

            <TextEditUserInterests
              userProfileId={userProfile.id}
              text={text}
              setText={setText} />
          :
            <Typography>
              Loading..
            </Typography>
          }

          {!session ?
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              You&apos;re not signed in, but changes to your interests will
              persist for this session.
            </Typography>
          :
            <></>
          }

          {userInterestsText != null &&
           recommendedInterests != null ?

            <RecommendedInterests
              text={text}
              setText={setText}
              recommendedInterests={recommendedInterests} />
          :
            <></>
          }
        </Box>
      </Layout>

      <LoadUserEntityInterestsByFilter
        userProfileId={userProfile.id}
        setUserInterestsText={setUserInterestsText}
        setRecommendedInterests={setRecommendedInterests}
        setLoadedUserInterests={setLoadedUserInterests} />
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
