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
  async tests(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.tests()`

    console.log(`${fnName}: starting..`)

    // Get recommended entities
    await getQlooInsightsService.getRecommendedInterests(
            prisma,
            userProfileId)
  }
}
