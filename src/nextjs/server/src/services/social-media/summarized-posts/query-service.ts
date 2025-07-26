import { PrismaClient, Site } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { PostEntityInterestGroupModel } from '@/models/interests/post-entity-interest-group-model'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { SiteModel } from '@/models/social-media/site-model'
import { SiteTopicListModel } from '@/models/social-media/site-topic-list-model'
import { SiteTopicListPostModel } from '@/models/social-media/site-topic-list-post-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'

// Models
const postEntityInterestGroupModel = new PostEntityInterestGroupModel()
const postSummaryModel = new PostSummaryModel()
const siteModel = new SiteModel()
const siteTopicListModel = new SiteTopicListModel()
const siteTopicListPostModel = new SiteTopicListPostModel()
const siteTopicModel = new SiteTopicModel()
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()

// Class
export class SummarizePostQueryService {

  // Consts
  clName = 'SummarizePostQueryService'

  // Code
  addSocialMediaDetails(
    site: Site,
    postSummaries: any) {

    for (var postSummary of postSummaries) {

      postSummary.site = site

      if (postSummary.post.externalId != null) {

        postSummary.socialMediaUrl =
          ServerOnlyTypes.socialMediaUrls[site.name].replace(
            '{externalId}',
            postSummary.post.externalId)
      }
    }
  }

  async filterLatest(
          prisma: PrismaClient,
          forUserProfileId: string,
          inSiteTopicListId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Get Site
    const site = await
            siteModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.hnSiteName)

    // Validate
    if (site == null) {
      throw new CustomError(`${fnName}: site == null`)
    }

    // Get siteTopicListId
    var siteTopicListId: string

    if (inSiteTopicListId != null) {

      siteTopicListId = inSiteTopicListId
    } else {

      // Get the default

      // Get SiteTopic
      const siteTopic = await
              siteTopicModel.getByUniqueKey(
                prisma,
                site.id,
                ServerOnlyTypes.allSiteTopic)

      // Validate
      if (siteTopic == null) {
        return {
          status: true,
          message: `No such topic`
        }
      }

      // Get SiteTopicList
      const siteTopicList = await
              siteTopicListModel.getLatestBySiteTopicIdAndStatus(
                prisma,
                siteTopic.id,
                ServerOnlyTypes.frontPageRankingType,
                BaseDataTypes.activeStatus)

      if (siteTopicList == null) {

        return {
          status: true,
          message: `No listings`
        }
      }

      // Set siteTopicListId
      siteTopicListId = siteTopicList.id
    }

    // Debug
    console.log(`${fnName}: siteTopicListId: ${siteTopicListId}`)

    // Get posts for the site topic list
    const siteTopicListPosts = await
            siteTopicListPostModel.filter(
              prisma,
              siteTopicListId)

    // Validate
    if (siteTopicListPosts == null) {
      throw new CustomError(`${fnName}: siteTopicListPosts == null`)
    }

    // Debug
    console.log(`${fnName}: siteTopicListPosts: ${siteTopicListPosts.length}`)

    // Get postIds
    const postIds = siteTopicListPosts.map(post => post.postId)

    // Debug
    console.log(`${fnName}: postIds: ` + JSON.stringify(postIds))

    // Get post summaries
    var postSummaries = await
          postSummaryModel.getByPostIdsAndUserProfileId(
            prisma,
            postIds,
            forUserProfileId)

    // Validate
    if (postSummaries == null) {
      throw new CustomError(`${fnName}: postSummaries == null`)
    }

    /* Debug: output the 1st post summary
    if (postSummaries.length > 0) {
      console.log(`${fnName}: postSummaries[0]: ` +
                  JSON.stringify(postSummaries[0]))
    } */

    // Rename sortedPostSummaries.ofPostSummaryInsights to .insights
    const renamedPostSummaries1 =
            postSummaries.map(
              ({ ofPostSummaryInsights, ...rest }) => ({
                ...rest,
                insights: ofPostSummaryInsights}))

    const renamedPostSummaries2 =
            renamedPostSummaries1.map(post => ({
              ...post,
              insights: post.insights.map(({ _count, ...rest }) => ({
                ...rest,
                commentsCount: _count.ofPostSummaryInsightComments
              }))
            }))

    // Add social media links
    this.addSocialMediaDetails(
      site,
      postSummaries)

    // Debug
    console.log(`${fnName}: postSummaries: ${postSummaries.length}`)

    // Build a map from postId to index
    const postOrderMap = new Map(
      siteTopicListPosts.map((post, idx) =>
        [post.postId, post.index !== undefined ? post.index : idx]))

    // Sort postSummaries based on the original index
    var sortedPostSummaries = renamedPostSummaries2.sort(
      (a, b) =>
        (postOrderMap.get(a.postId) ?? 0) - (postOrderMap.get(b.postId) ?? 0))

    // Debug
    console.log(`${fnName}: sortedPostSummaries: ${sortedPostSummaries.length}`)

    // Get postIds
    const sortedPostIds =
            sortedPostSummaries.map(
              sortedPostSummary => sortedPostSummary.postId)

    // Debug
    console.log(`${fnName}: sortedPostIds: ` + JSON.stringify(sortedPostIds))

    /* Debug: output the 1st post summary
    if (sortedPostSummaries.length > 0) {
      console.log(`${fnName}: sortedPostSummaries[0]: ` +
                  JSON.stringify(sortedPostSummaries[0]))
    } */

    // Re-rank?
    if (forUserProfileId != null) {

      await this.reRankByInterests(
              prisma,
              forUserProfileId,
              sortedPostIds,
              sortedPostSummaries)
    }

    // Return
    return {
      status: true,
      postSummaries: sortedPostSummaries
    }
  }

  async reRankByInterests(
          prisma: PrismaClient,
          userProfileId: string,
          postIds: string[],
          postSummaries: any[]) {

    // Debug
    const fnName = `${this.clName}.reRankByInterests()`

    console.log(`${fnName}: starting with userProfileId: ${userProfileId}`)

    // A notNull function
    function notNull<T>(value: T | null): value is T {
      return value !== null
    }

    // Get user EntityInterestGroups
    const userEntityInterestGroup = await
            userEntityInterestGroupModel.getByUniqueKey(
              prisma,
              userProfileId)

    if (userEntityInterestGroup == null) {
      return
    }

    // Debug
    console.log(`${fnName}: has userEntityInterestGroup: ` +
                `${userEntityInterestGroup}`)

    // Get post summary interests ranked by similarity with user interests
    postIds = await
      postEntityInterestGroupModel.filterAndOrderBySimilarEntityInterestGroups(
        prisma,
        userEntityInterestGroup.entityInterestGroupId,
        postIds)

    // Build a map from postId to index
    const postOrderMap = new Map(
      postSummaries.map((post, idx) =>
        [post.postId, post.index !== undefined ? post.index : idx]))

    // Sort by reranked sortedPostIds
    postSummaries = postSummaries.sort(
      (a, b) =>
        (postOrderMap.get(a.postId) ?? 0) - (postOrderMap.get(b.postId) ?? 0))
  }
}
