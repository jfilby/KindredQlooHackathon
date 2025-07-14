import { PrismaClient, UserProfile } from '@prisma/client'
import { ConsoleService } from '@/serene-core-server/services/console/service'
import { SearchQueryService } from './search-query-service'

// Services
const consoleService = new ConsoleService()
const searchQueryService = new SearchQueryService()

// Class
export class SearchQueryServiceTests {

  // Consts
  clName = 'SearchQueryService'

  // Code
  async testInputSearch(
          prisma: PrismaClient,
          userProfile: UserProfile) {

    // Get query
    const query = await
            consoleService.askQuestion(`Query> `)

    // Search
    await searchQueryService.search(
            prisma,
            userProfile,
            query)
  }
}
