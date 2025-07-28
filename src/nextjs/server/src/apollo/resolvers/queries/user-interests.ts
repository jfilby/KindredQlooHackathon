import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'

// Models
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()
const userInterestsTextModel = new UserInterestsTextModel()

// Code
export async function getUserInterests(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getUserInterests()`

  // Validate
  if (args.userProfileId == null) {
    throw new CustomError(`${fnName}: args.userProfileId == null`)
  }

  // Get UserInterestsText if any
  const userInterestsText = await
          userInterestsTextModel.getByUniqueKey(
            prisma,
            args.userProfileId)

  // Get recommended interests
  const userEntityInterestGroup = await
          userEntityInterestGroupModel.getByUniqueKey(
            prisma,
            args.userProfileId,
            ServerOnlyTypes.recommendedUserInterestType,
            true)  // includeEntityInterests

    // Debug
    // console.log(`${fnName}: userEntityInterestGroup: ` +
    //             JSON.stringify(userEntityInterestGroup))

    // Validate/get
    var entityInterests: any[] = []

    if (userEntityInterestGroup?.entityInterestGroup?.ofEntityInterestItems != null) {

      // Get entityInterestItems
      const entityInterestItems =
              userEntityInterestGroup.entityInterestGroup.ofEntityInterestItems

      // Get entityInterests
      entityInterests =
        entityInterestItems.map(
          (entityInterestItem: any) => entityInterestItem.entityInterest)
  }

  // Return
  return {
    status: true,
    userInterestsText: userInterestsText,
    recommendedInterests: entityInterests
  }
}
