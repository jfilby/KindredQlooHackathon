import { PrismaClient } from '@prisma/client'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { SiteModel } from '@/models/social-media/site-model'
import { HackerNewAlgoliaService } from './hn-algolia-service'

// Models
const siteModel = new SiteModel()

// Services
const hackerNewAlgoliaService = new HackerNewAlgoliaService()

// Class
export class HackerNewAlgoliaTestsService {

  // Consts
  clName = 'HackerNewAlgoliaTestsService'

  // Code
  async run(prisma: PrismaClient) {

    // Get the Site
    const site = await
            siteModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.hnSiteName)

    // Run the import
    await hackerNewAlgoliaService.getFrontPageStories(
            prisma,
            site.id)
  }
}
