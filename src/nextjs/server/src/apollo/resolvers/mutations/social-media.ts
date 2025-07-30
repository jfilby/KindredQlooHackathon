import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UserSiteTopicModel } from '@/models/social-media/user-site-topic-model'

// Models
const userSiteTopicModel = new UserSiteTopicModel()

// Code
export async function upsertUserSiteTopic(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `upsertUserSiteTopic()`

  // Validate
  if (args.userProfileId == null) {
    throw new CustomError(`${fnName}: args.userProfileId == null`)
  }

  if (args.siteTopicId == null) {
    throw new CustomError(`${fnName}: args.siteTopicId == null`)
  }

  if (args.rankBy == null) {
    throw new CustomError(`${fnName}: args.rankBy == null`)
  }

  // Upsert
  const userSiteTopic = await
          userSiteTopicModel.upsert(
            prisma,
            undefined,  // id
            args.userProfileId,
            args.siteTopicId,
            args.rankBy)

  // Return
  return {
    status: true
  }
}
