import { PrismaClient, UserProfile } from '@prisma/client'
import { GetQlooTagTypesService } from './get-tag-types.service'

// Services
const getQlooTagTypesService = new GetQlooTagTypesService()

// Class
export class QlooSetupService {

  // Consts
  clName = 'QlooSetupService'

  // Code
  async run(prisma: PrismaClient,
            userProfile: UserProfile) {

    // Get and save tag types
    await getQlooTagTypesService.getAndSave(prisma)
  }
}
