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

  // Get anon user
  const anonUserProfile = await
          usersService.getUserProfileByEmail(
            prisma,
            ServerTestTypes.anonUserEmail)

  // Validate
  if (anonUserProfile == null) {
    throw new CustomError(`${fnName}: anonUserProfile == null`)
  }

  // Set forUserProfileId
  const forUserProfileId = anonUserProfile.id

  // Filter
  const results = await
          summarizePostQueryService.filter(
            prisma,
            forUserProfileId,
            args.siteTopicListId)

  // Return
  return results
}
