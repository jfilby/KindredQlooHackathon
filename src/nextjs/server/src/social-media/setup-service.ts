import { PrismaClient } from '@prisma/client'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { SiteModel } from '@/models/social-media/site-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'

// Models
const siteModel = new SiteModel()
const siteTopicModel = new SiteTopicModel()

// Class
export class SocialMediaSetupService {

  // Consts
  clName = 'SocialMediaSetupService'

  // Code
  async setup(prisma: PrismaClient) {

    // Upsert Site records
    for (const siteName of ServerOnlyTypes.socialMediaSites) {

      await siteModel.upsert(
              prisma,
              undefined,  // id
              siteName)
    }

    // Get the HN site
    const hnSite = await
            siteModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.hnSiteName)

    // Define a front-page topic for HN
    await siteTopicModel.upsert(
            prisma,
            undefined,  // id
            hnSite.id,
            'front-page')
  }
}
