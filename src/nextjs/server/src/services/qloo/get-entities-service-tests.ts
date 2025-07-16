import { PrismaClient } from '@prisma/client'
import { QlooEntityCategory } from '@/types/qloo-types'
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
    await getQlooEntitiesService.getAndSave(
            prisma,
            `John Wick`,
            3,  // take
            QlooEntityCategory.movie)
  }
}
