import { BatchJob, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { QlooEntityModel } from '@/models/qloo/qloo-entity-model'
import { UserInterestTextModel } from '@/models/interests/user-interest-text-model'
import { GetQlooInsightsService } from '../qloo/get-insights-service'
import { InterestGroupService } from './interest-group-service'
import { UserInterestsMutateService } from './user-interests-mutate-service'

// Models
const batchJobModel = new BatchJobModel()
const qlooEntityModel = new QlooEntityModel()
const userInterestTextModel = new UserInterestTextModel()

// Services
const getQlooInsightsService = new GetQlooInsightsService()
const interestGroupService = new InterestGroupService()
const userInterestsMutateService = new UserInterestsMutateService()

// Class
export class InterestsBatchService {

  // Debug
  clName = 'InterestsBatchService'

  // Code
  async createInterests(
          prisma: PrismaClient,
          batchJob: BatchJob) {

    // Debug
    const fnName = `${this.clName}.createInterests()`

    // Validate
    if (batchJob.refId == null) {
      throw new CustomError(`${fnName}: batchJob.refId == null`)
    }

    // Get the UserInterestText to be processed
    const userInterestText = await
            userInterestTextModel.getById(
              prisma,
              batchJob.refId)

    if (userInterestText == null) {
      throw new CustomError(`${fnName}: userInterestText == null`)
    }

    // Convert interests text to definite interests
    await userInterestsMutateService.upsertUserInterestsByText(
            prisma,
            userInterestText.userProfileId,
            userInterestText.text)

    // Delete UserInterestText
    await userInterestTextModel.deleteById(
            prisma,
            userInterestText.id)

    // Batch job completed
    batchJob = await
      batchJobModel.update(
        prisma,
        batchJob.id,
        undefined,  // instanceId
        undefined,  // runInATransaction
        BatchTypes.completedBatchJobStatus,
        100)        // progressPct
  }

  async groupAndFindSimilarInterests(prisma: PrismaClient) {

    // Group interests
    await this.groupInterests(prisma)

    // Find similar interests
    await this.findSimilarInterests(prisma)
  }

  async groupInterests(prisma: PrismaClient) {

    // Get/create interest groups
    await interestGroupService.getOrCreateMissingGroups(prisma)

    // Create embeddings missing for any interest groups
    await interestGroupService.creatingMissingEmbeddings(prisma)
  }

  async findSimilarInterests(prisma: PrismaClient) {

    // Find and save similar interests for groups needing that
    await interestGroupService.findAndSetSimilarEntityInterests(prisma)
  }
}
