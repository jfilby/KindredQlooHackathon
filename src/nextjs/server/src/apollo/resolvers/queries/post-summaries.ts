import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { ServerTestTypes } from '@/types/server-test-types'
import { SummarizePostQueryService } from '@/services/social-media/summarized-posts/query-service'

// Services
const summarizePostQueryService = new SummarizePostQueryService()
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
