import { BatchJob, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { QlooEntityModel } from '@/models/qloo/qloo-entity-model'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'
import { GetQlooInsightsService } from '../qloo/get-insights-service'
import { InterestGroupService } from './interest-group-service'
import { UserInterestsMutateService } from './user-interests-mutate-service'

// Models
const batchJobModel = new BatchJobModel()
const qlooEntityModel = new QlooEntityModel()
const userInterestsTextModel = new UserInterestsTextModel()

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

    // Get the UserInterestsText to be processed
    const userInterestsText = await
            userInterestsTextModel.getById(
              prisma,
              batchJob.refId)

    if (userInterestsText == null) {
      throw new CustomError(`${fnName}: userInterestsText == null`)
    }

    // Convert interests text to definite interests
    await userInterestsMutateService.upsertUserInterestsByText(
            prisma,
            userInterestsText.userProfileId,
            userInterestsText.text)

    // Delete UserInterestsText
    await userInterestsTextModel.deleteById(
            prisma,
            userInterestsText.id)

    // Batch job completed
    batchJob = await
      batchJobModel.update(
        prisma,
        batchJob.id,
        undefined,  // instanceId
        undefined,  // runInATransaction
        BatchTypes.completedBatchJobStatus,
        100)        // progressPct

    // Return
    return {
      status: true
    }
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
