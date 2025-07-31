import Head from 'next/head'
import { Image } from 'mui-image'
import { Typography } from '@mui/material'
import { loadServerPage } from '@/services/page/load-server-page'
import Layout from '@/components/layouts/layout'

interface Props {
  userProfile: any
}

export default function AboutPage({
                          userProfile
                        }: Props) {

  // Render
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - About</title>
      </Head>

      <Layout userProfile={userProfile}>

        <Typography variant='h4'>
          About
        </Typography>

        <div style={{ position: 'relative', height: '90vh', width: '100%' }}>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("http://localhost:3001/kindred-logo.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0,
          }}/>

          <div style={{ position: 'relative', zIndex: 1, color: 'black', padding: '2rem' }}>
            <Typography
              style={{ color: 'black', textAlign: 'left' }}
              variant='body1'>

            Kindred summaries HackerNews posts and their related information. These
            summaries are then displayed on a web page, make it fast and easy to stay
            up-to-date with the latest HN posts.
            <br/><br/>

            Each post summary includes links to both the story's URL if present and the
            original post on HN. A list of key insights is presented per post. Clicking an
            insight shows its most relevant comments in-line, each clickable to view the
            original on HN.
            <br/><br/>

            You can also chat with Kindred about a post summary to ask any questions you
            may have about the story, the post and its comments.
            <br/><br/>

            Easily specify your interests and tastes, which can be related to or
            independent of the social media site summarized. The system uses this
            information to rerank the post summaries according to each user's interests.
            <br/><br/>

            Tastes include books, movies, podcasts and more. Recommendedations for tastes
            are also sourced once any tastes are initially added, via Qloo's insights API.
          </Typography>
          </div>
        </div>

     </Layout>
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
