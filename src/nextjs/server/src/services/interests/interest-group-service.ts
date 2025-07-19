import { createHash } from 'crypto'
import { PrismaClient, UserEntityInterest, UserEntityInterestGroup } from '@prisma/client'
import { EntityInterestGroupModel } from '@/models/interests/entity-interest-group-model'
import { EntityInterestItemModel } from '@/models/interests/entity-interest-item-model'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'
import { UserEntityInterestModel } from '@/models/interests/user-entity-interest-model'
import { GetTechService } from '../tech/get-tech-service'

// Models
const entityInterestGroupModel = new EntityInterestGroupModel()
const entityInterestItemModel = new EntityInterestItemModel()
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()
const userEntityInterestModel = new UserEntityInterestModel()

// Services
const getTechService = new GetTechService()

// Class
export class InterestGroupService {

  async getOrCreateMissingGroups(prisma: PrismaClient) {

    // Get a list of UserEntityInterestGroups missing an entityInterestGroupId
    const userEntityInterestGroups = await
            userEntityInterestGroupModel.filter(
              prisma,
              undefined,  // userProfileId
              null)       // entityInterestGroupId

    // Process each UserEntityInterestGroup
    for (const userEntityInterestGroup of userEntityInterestGroups) {

      const userEntityInterests = await
              userEntityInterestModel.filter(
                prisma,
                userEntityInterestGroup.userProfileId,
                undefined,
                false)  // includeEntityInterests

      // Get entityInterestIds
      const entityInterestIds = userEntityInterests.map(
        (userEntityInterest: UserEntityInterest) =>
          userEntityInterest.entityInterestId)

      // Get/create the missing group
      const entityInterestGroup = await
              this.getOrCreate(
                prisma,
                entityInterestIds)

      // Assign to UserEntityInterestGroup
      await userEntityInterestGroupModel.update(
              prisma,
              userEntityInterestGroup.id,
              undefined,  // userProfileId
              entityInterestGroup.id)
    }
  }

  async getOrCreate(
          prisma: PrismaClient,
          entityInterestIds: string[]) {

    // Get a unique hash
    const uniqueHash = this.getUniqueHash(entityInterestIds)

    // Try to find an existing record
    var entityInterestGroup = await
          entityInterestGroupModel.getByUniqueKey(
            prisma,
            uniqueHash,
            true)  // includeEntityInterestItems

    if (entityInterestGroup != null) {
      return entityInterestGroup
    }

    // Get embeddingTech
    const embeddingTech = await
            getTechService.getEmbeddingsTech(prisma)

    // Create records
    entityInterestGroup = await
      entityInterestGroupModel.create(
        prisma,
        uniqueHash,
        embeddingTech.id,
        [])  // embedding

    for (const entityInterestId of entityInterestIds) {

      const entityInterestItem = await
              entityInterestItemModel.create(
                prisma,
                entityInterestGroup.id,
                entityInterestId)
    }

    // Return
    return entityInterestGroup
  }

  getUniqueHash(entityInterestIds: string[]) {

    // Sort (to ensure uniquess)
    const sorted = [...new Set(entityInterestIds)].sort()

    const data = sorted.join('|')
    const hash = createHash('sha256').update(data).digest('hex')

    // Return
    return hash
  }
}
