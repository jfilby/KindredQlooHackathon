import { PrismaClient } from '@prisma/client'
import { UserInterestsMutateService } from './user-interests-mutate-service'

// Services
const userInterestsMutateService = new UserInterestsMutateService()

// Class
export class UserInterestsMutateServiceTests {

  // Consts
  clName = 'UserInterestsMutateServiceTests'

  // Code
  async tests(
          prisma: PrismaClient,
          userProfileId: string) {

    // Text
    const text = `Trent Raznor, John Wick, HN`

    // Convert texts to interests
    await userInterestsMutateService.upsertUserInterestsByText(
            prisma,
            userProfileId,
            text)
  }
}
