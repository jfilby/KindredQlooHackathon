import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { UserInterestsMutateService } from '@/services/interests/user-interests-mutate-service'

// Services
const userInterestsMutateService = new UserInterestsMutateService()

// Code
export async function upsertUserInterestsByText(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `upsertUserInterestsByText()`

  // Validate
  if (args.userProfileId == null) {
    throw new CustomError(`${fnName}: args.userProfileId == null`)
  }

  if (args.text == null) {
    throw new CustomError(`${fnName}: args.text == null`)
  }

  // Call upsert UserInterests by text
  const results = await
          userInterestsMutateService.upsertUserInterestsByText(
            prisma,
            args.userProfileId,
            args.text)

  // Return
  return results
}
