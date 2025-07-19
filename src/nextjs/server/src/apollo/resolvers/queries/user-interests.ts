import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { UserEntityInterestModel } from '@/models/interests/user-entity-interest-model'

// Models
const userEntityInterestModel = new UserEntityInterestModel()

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
  const userEntityInterests = await
          userEntityInterestModel.filter(
            prisma,
            args.userProfileId,
            undefined,  // entityInterestId
            true)       // includeEntityInterest

  // Return
  return {
    status: true,
    userEntityInterests: userEntityInterests
  }
}
