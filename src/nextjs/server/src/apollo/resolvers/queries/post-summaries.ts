import { CustomError } from '@/serene-core-server/types/errors'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { SiteModel } from '@/models/social-media/site-model'
import { SiteTopicListModel } from '@/models/social-media/site-topic-list-model'
import { SiteTopicListPostModel } from '@/models/social-media/site-topic-list-post-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'

// Models
const postSummaryModel = new PostSummaryModel()
const siteModel = new SiteModel()
const siteTopicListModel = new SiteTopicListModel()
const siteTopicListPostModel = new SiteTopicListPostModel()
const siteTopicModel = new SiteTopicModel()

// Code
export async function getPostSummaries(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getPostSummaries()`

  // Validate
  if (args.siteTopicListId == null) {

    // Get HN site
    const site = await
            siteModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.hnSiteName)

    // Validate
    if (site == null) {
      throw new CustomError(`${fnName}: site == null`)
    }

    // Get SiteTopic
    const siteTopic = await
            siteTopicModel.getByUniqueKey(
              prisma,
              site.id,
              'front-page')

    // Validate
    if (siteTopic == null) {
      return {
        status: true,
        message: `No such topic`
      }
    }

    // Get SiteTopicList
    const siteTopicList = await
            siteTopicListModel.getLatestBySiteTopicId(
              prisma,
              siteTopic.id,
              'front-page')  // rankingType

    if (siteTopicList == null) {

      return {
        status: true,
        message: `No listings`
      }
    }
  }

  // Get posts for the site topic list
  const siteTopicListPosts = await
          siteTopicListPostModel.filter(
            prisma,
            args.siteTopicListId)

  // Validate
  if (siteTopicListPosts == null) {
    throw new CustomError(`${fnName}: siteTopicListPosts == null`)
  }

  // Debug
  console.log(`${fnName}: siteTopicListPosts: ${siteTopicListPosts.length}`)

  // Get postIds
  const postIds = siteTopicListPosts.map(post => post.postId)

  // Get post summaries
  const postSummaries = await
          postSummaryModel.getByPostIdsAndUserProfileId(
            prisma,
            postIds,
            null)  // userProfileId

  // Validate
  if (postSummaries == null) {
    throw new CustomError(`${fnName}: postSummaries == null`)
  }

  // Debug
  console.log(`${fnName}: postSummaries: ${postSummaries.length}`)

  // Build a map from postId to index
  const postOrderMap = new Map(
    siteTopicListPosts.map((post, idx) => [post.postId, post.index ?? idx])
  )

  // Sort postSummaries based on the original index
  const sortedPostSummaries = postSummaries.sort(
    (a, b) => (postOrderMap.get(a.postId) ?? 0) - (postOrderMap.get(b.postId) ?? 0)
  )

  // Debug
  console.log(`${fnName}: sortedPostSummaries: ${sortedPostSummaries.length}`)

  // Return
  return {
    status: true,
    postSummaries: sortedPostSummaries
  }
}
