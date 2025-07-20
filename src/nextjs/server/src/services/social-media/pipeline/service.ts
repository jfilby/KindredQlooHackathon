import { BatchJob, PrismaClient, Site } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { HackerNewAlgoliaService } from '../site-specific/hn-algolia-service'
import { PostUrlsService } from '../post-urls/post-urls-service'
import { SummarizePostMutateService } from '@/services/social-media/summarized-posts/mutate-service'
import { SummarizePostUrlService } from '@/services/social-media/summarized-post-urls/service'

// Models
const batchJobModel = new BatchJobModel()

// Services
const hackerNewAlgoliaService = new HackerNewAlgoliaService()
const postUrlsService = new PostUrlsService()
const summarizePostMutateService = new SummarizePostMutateService()
const summarizePostUrlService = new SummarizePostUrlService()

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

  async run(prisma: PrismaClient,
            userProfileId: string,
            forUserProfileId: string,
            site: Site,
            batchJob: BatchJob) {

    // Debug
    const fnName = `${this.clName}.run()`

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

    // Set the BatchJob status to completed
    batchJob = await
      batchJobModel.update(
        prisma,
        batchJob.id,
        undefined,  // instanceId
        undefined,  // runInATransaction
        BatchTypes.completedBatchJobStatus,
        100,        // progressPct
        null)       // message
  }
}
