import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { GetQlooEntitiesService } from '../qloo/get-entities-service'

// Models
const entityInterestModel = new EntityInterestModel()

// Services
const getQlooEntitiesService = new GetQlooEntitiesService()

// Class
export class EntityInterestService {

  // Debug
  clName = 'EntityInterestService'

  // Code
  async processNewEntityInterest(
          prisma: PrismaClient,
          entityInterest: any) {

    // Try to get the category for the EntityInterest's interestType
    var qlooEntityId: string | null = null

    if (entityInterest.interestType != null &&
        entityInterest.interestType.qlooEntityType != null) {

      // Try to get a Qloo entity for the interest
      const qlooEntityIds = await
              getQlooEntitiesService.getAndSave(
                prisma,
                entityInterest.name,
                2,       // take (must be >=1)
                entityInterest.interestType.qlooEntityType)

      // If a matching Qloo entity was found
      if (qlooEntityIds.length > 0) {
        qlooEntityId = qlooEntityIds[0]
      }
    }

    // Set EntityInterest with any qlooEntityId found and to active status
    await entityInterestModel.update(
            prisma,
            entityInterest.id,
            undefined,  // interestTypeId
            qlooEntityId,
            BaseDataTypes.activeStatus,
            undefined)  // name
  }

  async processNewEntityInterests(prisma: PrismaClient) {

    // Get EntityInterests in new status
    const entityInterests = await
            entityInterestModel.filter(
              prisma,
              undefined,  // interestTypeId
              undefined,  // qlooEntityId
              BaseDataTypes.newStatus,
              undefined,  // siteTopicId
              true)       // includeInterestTypes

    // Process each one
    for (const entityInterest of entityInterests) {

      await this.processNewEntityInterest(
              prisma,
              entityInterest)
    }
  }

  async getOrCreate(
          prisma: PrismaClient,
          interestTypeId: string,
          name: string) {

    // Trim and lowercase the name
    const lowerName = name.trim().toLowerCase()

    // Check if a record already exists
    var entityInterest = await
          entityInterestModel.getByUniqueKey(
            prisma,
            interestTypeId,
            lowerName)

    // Create a record if none exists
    if (entityInterest == null) {

      entityInterest = await
        entityInterestModel.create(
          prisma,
          interestTypeId,
          null,       // qlooEntityId
          BaseDataTypes.newStatus,
          lowerName)
    }

    // Return
    return entityInterest
  }
}
