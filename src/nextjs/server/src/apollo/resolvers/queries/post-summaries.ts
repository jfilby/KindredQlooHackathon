import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { ServerTestTypes } from '@/types/server-test-types'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'
import { SummarizePostQueryService } from '@/services/social-media/summarized-posts/query-service'
import { SummarizePostUtilsService } from '@/services/social-media/summarized-posts/utils-service'

// Models
const postSummaryModel = new PostSummaryModel()
const siteTopicModel = new SiteTopicModel()

// Services
const summarizePostQueryService = new SummarizePostQueryService()
const summarizePostUtilsService = new SummarizePostUtilsService()
const usersService = new UsersService()

// Code
export async function getPostSummaries(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getPostSummaries()`

  // Get the given user, if specified
  var userProfile: any = undefined

  if (args.userProfileId != null) {

    userProfile = await
      usersService.getById(
        prisma,
        args.userProfileId)
  }

  // Get anon user
  const anonUserProfile = await
          usersService.getUserProfileByEmail(
            prisma,
            ServerTestTypes.anonUserEmail)

  // Set for anonymous user if the given user isn't signed-in
  if (userProfile == null ||
      userProfile.userId == null) {

    userProfile = anonUserProfile
  }

  // Validate
  if (userProfile == null) {
    throw new CustomError(`${fnName}: userProfile == null`)
  }

  // Filter
  const results = await
          summarizePostQueryService.filterLatest(
            prisma,
            anonUserProfile.id,
            userProfile.id,
            args.siteTopicListId)

  // Return
  return results
}

export async function getPostSummary(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getPostSummary()`

  // Get the given user, if specified
  var userProfile: any = undefined

  if (args.userProfileId != null) {

    userProfile = await
      usersService.getById(
        prisma,
        args.userProfileId)
  }

  // Get anon user
  const anonUserProfile = await
          usersService.getUserProfileByEmail(
            prisma,
            ServerTestTypes.anonUserEmail)

  // Set for anonymous user if the given user isn't signed-in
  if (userProfile == null ||
      userProfile.userId == null) {

    userProfile = anonUserProfile
  }

  // Validate
  if (userProfile == null) {
    throw new CustomError(`${fnName}: userProfile == null`)
  }

  // Filter
  const postSummary = await
          postSummaryModel.getById(
            prisma,
            args.id,
            true)  // includeDetails

  // Add social media details
  summarizePostQueryService.addSocialMediaDetails(
    postSummary.post.site,
    [postSummary])

  // Return
  return {
    status: true,
    postSummary: postSummary
  }
}

export async function getTimeToNextListing(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getTimeToNextListing()`

  // Validate/get default
  var siteTopicId = args.siteTopicId

  if (args.siteTopicListId == null) {

    // Get the default
    const siteTopics = await
            siteTopicModel.filter(prisma)

    // Validate
    if (siteTopics == null) {
      throw new CustomError(`${fnName}: siteTopics == null`)
    }

    if (siteTopics.length !== 1) {
      throw new CustomError(`${fnName}: siteTopics !== 1`)
    }

    // Get siteTopicId
    siteTopicId = siteTopics[0].id
  }

  // Get time to next listing
  const results = await
          summarizePostUtilsService.getTimeToNextSummary(
            prisma,
            siteTopicId)

  // Return
  return results
}
