import { PrismaClient } from '@prisma/client'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'

// Models
const entityInterestModel = new EntityInterestModel()

// Class
export class EntityInterestService {

  // Debug
  clName = 'EntityInterestService'

  // Code
  async getOrCreate(
          prisma: PrismaClient,
          interestTypeId: string,
          name: string) {

    // Lowercase the name
    const lowerName = name.toLowerCase()

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
          lowerName)
    }

    // Return
    return entityInterest
  }
}
