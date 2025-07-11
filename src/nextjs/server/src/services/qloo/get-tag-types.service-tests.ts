import { PrismaClient } from '@prisma/client'
import { GetQlooTagTypesService } from './get-tag-types.service'

// Services
const getQlooTagTypesService = new GetQlooTagTypesService()

// Class
export class GetQlooTagTypesServiceTests {

  // Consts
  clName = 'GetQlooTagTypesServiceTests'

  // Code
  async tests(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.tests()`

    // Query
    const results = await
            getQlooTagTypesService.get()

    console.log(`${fnName}: entities: ` + JSON.stringify(results))
  }
}
