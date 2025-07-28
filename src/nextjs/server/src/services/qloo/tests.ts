import { PrismaClient } from '@prisma/client'
import { GetQlooEntitiesServiceTests } from './get-entities-service-tests'
import { GetQlooInsightsServiceTests } from './get-insights-service-tests'
import { GetQlooTagTypesServiceTests } from './get-tag-types.service-tests'

// Services
const getQlooEntitiesServiceTests = new GetQlooEntitiesServiceTests()
const getQlooInsightsServiceTests = new GetQlooInsightsServiceTests()
const getQlooTagTypesServiceTests = new GetQlooTagTypesServiceTests()

// Class
export class QlooTests {

  // Consts
  clName = 'QlooTests'

  // Code
  async tests(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Call each service test
    // await getQlooTagTypesServiceTests.tests(prisma)

    // await getQlooEntitiesServiceTests.tests(prisma)

    await getQlooInsightsServiceTests.tests(
            prisma,
            userProfileId)
  }
}
