import { CustomError } from '@/serene-core-server/types/errors'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { SiteTopicListPostModel } from '@/models/social-media/site-topic-list-post-model'

// Models
const postSummaryModel = new PostSummaryModel()
const siteTopicListPostModel = new SiteTopicListPostModel()

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
    throw new CustomError(`${fnName}: args.siteTopicListId == null`)
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

  // Build a map from postId to index
  const postOrderMap = new Map(
    siteTopicListPosts.map((post, idx) => [post.postId, post.index ?? idx])
  )

  // Sort postSummaries based on the original index
  const sortedPostSummaries = postSummaries.sort(
    (a, b) => (postOrderMap.get(a.postId) ?? 0) - (postOrderMap.get(b.postId) ?? 0)
  )

  // Return
  return postSummaries
}
