import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'

// Models
const userInterestsTextModel = new UserInterestsTextModel()

// Code
export async function getUserInterests(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getPostSummaries()`

  // Validate
  if (args.userProfileId == null) {
    throw new CustomError(`${fnName}: args.userProfileId == null`)
  }

  // Get UserInterestsText if any
  const userInterestsText = await
          userInterestsTextModel.getByUniqueKey(
            prisma,
            args.userProfileId)

  // Return
  return {
    status: true,
    userInterestsText: userInterestsText
  }
}
