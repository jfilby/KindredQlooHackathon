import { PrismaClient } from '@prisma/client'
import { QlooEntityModel } from '@/models/qloo/qloo-entity-model'
import { GetQlooInsightsService } from './get-insights-service'

// Models
const qlooEntityModel = new QlooEntityModel()

// Services
const getQlooInsightsService = new GetQlooInsightsService()

// Class
export class GetQlooInsightsServiceTests {

  // Consts
  clName = 'GetQlooInsightsServiceTests'

  // Code
  async tests(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Get entities
    const entities = await
            qlooEntityModel.filter(
              prisma,
              undefined,  // isTrending
              undefined)  // types

    // Get entityIds
    const qlooEntityIds = entities.map((entity: any) => entity.qlooEntityId)

    // Query
    await getQlooInsightsService.getAndSave(
            prisma,
            entities[0].types[0],
            3,  // take
            qlooEntityIds)
  }
}
