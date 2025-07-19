import { createHash } from 'crypto'
import { EntityInterest, PrismaClient } from '@prisma/client'
import { EntityInterestGroupModel } from '@/models/interests/entity-interest-group-model'
import { EntityInterestItemModel } from '@/models/interests/entity-interest-item-model'
import { GetTechService } from '../tech/get-tech-service'

// Models
const entityInterestGroupModel = new EntityInterestGroupModel()
const entityInterestItemModel = new EntityInterestItemModel()

// Services
const getTechService = new GetTechService()

// Class
export class InterestGroupService {

  async getOrCreate(
          prisma: PrismaClient,
          entityInterests: EntityInterest[]) {

    // Get a unique hash
    const uniqueHash = this.getUniqueHash(entityInterests)

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

    for (const entityInterest of entityInterests) {

      const entityInterestItem = await
              entityInterestItemModel.create(
                prisma,
                entityInterestGroup.id,
                entityInterest.id)
    }
  }

  getUniqueHash(entityInterests: EntityInterest[]) {

    // Extract the ids
    const ids = entityInterests.map((entityInterest: EntityInterest) =>
                  entityInterest.id)

    // Sort (to ensure uniquess)
    const sorted = [...new Set(ids)].sort()

    const data = sorted.join('|')
    const hash = createHash('sha256').update(data).digest('hex')

    // Return
    return hash
  }
}
