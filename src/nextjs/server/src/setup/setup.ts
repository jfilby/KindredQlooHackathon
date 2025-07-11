import { PrismaClient, UserProfile } from '@prisma/client'
import { QlooSetupService } from '@/services/qloo/qloo-setup-service'

// Services
const qlooSetupService = new QlooSetupService()

// Class
export class SetupService {

  // Consts
  clName = 'SetupService'

  // Code
  async run(prisma: PrismaClient,
            adminUser: UserProfile) {

    // Qloo setup
    await qlooSetupService.run(
            prisma,
            adminUser)
  }
}
