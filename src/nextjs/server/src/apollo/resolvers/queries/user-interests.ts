import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { UserEntityInterestModel } from '@/models/interests/user-entity-interest-model'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'

// Models
const userEntityInterestModel = new UserEntityInterestModel()
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

  // Filter
  const userEntityInterests = await
          userEntityInterestModel.filter(
            prisma,
            args.userProfileId,
            undefined,  // entityInterestId
            true)       // includeEntityInterest

  // Return
  return {
    status: true,
    userEntityInterests: userEntityInterests,
    userInterestsText: userInterestsText
  }
}
