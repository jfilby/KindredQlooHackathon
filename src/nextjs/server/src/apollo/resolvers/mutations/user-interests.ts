import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
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

  // Run in a transaction
  await prisma.$transaction(async (transactionPrisma: any) => {

    await userInterestsMutateService.processUpdatedUserInterestsText(
            transactionPrisma,
            args.userProfileId,
            args.text)
  })

  // Return
  return {
    status: true
  }
}
