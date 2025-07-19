import { PrismaClient } from '@prisma/client'
import { StringUtilsService } from '@/serene-core-server/services/utils/string-utils-service'
import { QlooEntityCategory } from '@/types/qloo-types'
import { InterestTypeModel } from '@/models/interests/interest-type-model'

// Services
const interestTypeModel = new InterestTypeModel()
const stringUtilsService = new StringUtilsService()

// Class
export class InterestsSetupService {

  // Consts
  clName = 'InterestsSetupService'

  // Code
  async setup(
          prisma: PrismaClient,
          userProfileId: string) {

    // Upsert InterestTypes
    for (const [key, value] of Object.entries(QlooEntityCategory)) {

      // Get the name
      const name = stringUtilsService.toNaturalCase(key)

      // Upsert InterestType
      const interestType = await
              interestTypeModel.upsert(
                prisma,
                undefined,  // id
                value,      // qlooEntityType
                null,       // siteTopicId
                name)
    }
  }
}
