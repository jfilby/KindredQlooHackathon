import { PrismaClient } from '@prisma/client'
import { UserSiteTopicModel } from '@/models/social-media/user-site-topic-model'
import { ServerOnlyTypes } from '@/types/server-only-types'

// Models
const userSiteTopicModel = new UserSiteTopicModel()

// Class
export class MutateUserSiteTopicService {

  // Consts
  clName = 'MutateUserSiteTopicService'

  // Code
  async getOrCreate(
          prisma: PrismaClient,
          userProfileId: string,
          siteTopicId: string) {

    // Debug
    const fnName = `${this.clName}.getOrCreate()`

    // Try to get the UserSiteTopic
    var userSiteTopic = await
          userSiteTopicModel.getByUniqueKey(
            prisma,
            userProfileId,
            siteTopicId)

    // Validate
    if (userSiteTopic != null) {
      return userSiteTopic
    }

    // Create
    userSiteTopic = await
      userSiteTopicModel.create(
        prisma,
        userProfileId,
        siteTopicId,
        ServerOnlyTypes.frontPageRankingType)

    // Return
    return userSiteTopic
  }
}
