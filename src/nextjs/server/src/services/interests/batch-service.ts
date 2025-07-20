import { BatchJob, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { UserInterestTextModel } from '@/models/interests/user-interest-text-model'
import { InterestGroupService } from './interest-group-service'
import { UserInterestsMutateService } from './user-interests-mutate-service'

// Models
const batchJobModel = new BatchJobModel()
const userInterestTextModel = new UserInterestTextModel()

// Services
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

    // Get all interests as text (to be processed)
    const userInterestTexts = await
            userInterestTextModel.filter(prisma)

    if (userInterestTexts == null) {
      throw new CustomError(`${fnName}: userInterestTexts == null`)
    }

    // Convert interests text to definite interests
    for (const userInterestText of userInterestTexts) {

      await userInterestsMutateService.upsertUserInterestsByText(
              prisma,
              userInterestText.userProfileId,
              userInterestText.text)

      // Delete UserInterestText
      await userInterestTextModel.deleteById(
              prisma,
              userInterestText.id)
    }

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

  async groupAndFindSimilarInterests(
          prisma: PrismaClient,
          batchJob: BatchJob) {

    // Group interests
    await this.groupInterests(prisma)

    // Find similar interests
    await this.findSimilarInterests(prisma)

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

  async groupInterests(prisma: PrismaClient) {

    // Get/create interest groups
    await interestGroupService.getOrCreateMissingGroups(prisma)

    // Create embeddings missing for any interest groups
    await interestGroupService.creatingMissingEmbeddings(prisma)
  }

  async findSimilarInterests(prisma: PrismaClient) {

    // Identify groups that need similar interests to be found
    ;

    // Find and save similar interests for groups needing that
    ;
  }
}
