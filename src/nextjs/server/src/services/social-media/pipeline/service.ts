import { PrismaClient, Site } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { SiteModel } from '@/models/social-media/site-model'
import { HackerNewAlgoliaService } from '../site-specific/hn-algolia-service'
import { PostUrlsService } from '../post-urls/post-urls-service'
import { SummarizePostMutateService } from '@/services/social-media/summarized-posts/mutate-service'
import { SummarizePostUrlService } from '@/services/social-media/summarized-post-urls/service'

// Models
const siteModel = new SiteModel()

// Services
const hackerNewAlgoliaService = new HackerNewAlgoliaService()
const postUrlsService = new PostUrlsService()
const summarizePostMutateService = new SummarizePostMutateService()
const summarizePostUrlService = new SummarizePostUrlService()
const usersService = new UsersService()

export class SocialMediaBatchPipelineService {

  // Consts
  clName = 'SocialMediaBatchPipelineService'

  // Code
  async importSite(
          prisma: PrismaClient,
          site: Site) {

    // Debug
    const fnName = `${this.clName}.importSite()`

    // Import by site
    switch (site.name) {

      case ServerOnlyTypes.hnSiteName: {

        const results = await
                hackerNewAlgoliaService.getFrontPageStories(
                prisma,
                site.id)

        return results
      }

      default: {
        throw new CustomError(`${fnName}: unhandled site.name: ${site.name}`)
      }
    }
  }

  async runForAllSites(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.runForAllSites()`

    // Get anon user
    const anonUserProfile = await
            usersService.getUserProfileByEmail(
              prisma,
              ServerTestTypes.anonUserEmail)

    // Get the sites to process
    const sites = await
            siteModel.filter(prisma)

    // Validate
    if (sites == null) {
      throw new CustomError(`${fnName}: sites == null`)
    }

    // Process each site
    for (const site of sites) {

      await this.runForSite(
              prisma,
              anonUserProfile.id,
              site)
    }
  }

  async runForSite(
          prisma: PrismaClient,
          userProfileId: string,
          site: Site) {

    // Debug
    const fnName = `${this.clName}.runForSite()`

    // All summarization is done for the admin user
    const forUserProfileId = userProfileId

    // Import
    await this.importSite(
            prisma,
            site)

    // Get post URLs
    await postUrlsService.getPending(prisma)

    // Summarize posts
    await summarizePostMutateService.run(
            prisma,
            userProfileId,
            forUserProfileId)

    // Summarize post URLs
    await summarizePostUrlService.run(
            prisma,
            userProfileId,
            forUserProfileId)
  }
}
