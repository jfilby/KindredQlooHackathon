import { PrismaClient } from '@prisma/client'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { SiteModel } from '@/models/social-media/site-model'

// Models
const siteModel = new SiteModel()

// Class
export class SocialMediaSetupService {

  // Consts
  clName = 'SocialMediaSetupService'

  // Code
  async setup(prisma: PrismaClient) {

    for (const siteName of ServerOnlyTypes.socialMediaSites) {

      await siteModel.upsert(
              prisma,
              undefined,  // id
              siteName)
    }
  }
}
