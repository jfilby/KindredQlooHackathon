import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { UserInterestModel } from '@/models/interests/user-interest-model'

// Models
const userInterestModel = new UserInterestModel()

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

  // Filter
  const userInterests = await
          userInterestModel.filter(
            prisma,
            args.userProfileId,
            undefined,  // entityInterestId
            true)       // includeEntityInterest

  // Return
  return {
    status: true,
    userInterests: userInterests
  }
}
