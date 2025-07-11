import { PrismaClient } from '@prisma/client'
import { QlooEntityType } from '@/types/qloo-types'
import { GetQlooEntitiesService } from './get-entities-service'

// Services
const getQlooEntitiesService = new GetQlooEntitiesService()

// Class
export class GetQlooEntitiesServiceTests {

  // Consts
  clName = 'GetQlooEntitiesServiceTests'

  // Code
  async tests(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Query
    const results = await
            getQlooEntitiesService.get(
                `Notion SaaS`,
                [QlooEntityType.brandEntityUrn])

    console.log(`${fnName}: entities: ` + JSON.stringify(results))
  }
}
