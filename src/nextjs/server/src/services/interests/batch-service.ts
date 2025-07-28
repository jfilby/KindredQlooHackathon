import { BatchJob, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { EntityInterestGroupModel } from '@/models/interests/entity-interest-group-model'
import { EntityInterestItemModel } from '@/models/interests/entity-interest-item-model'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'
import { EntityInterestService } from './entity-interest-service'
import { GetQlooInsightsService } from '../qloo/get-insights-service'
import { InterestGroupService } from './interest-group-service'
import { UserInterestsMutateService } from './user-interests-mutate-service'

// Models
const batchJobModel = new BatchJobModel()
const entityInterestGroupModel = new EntityInterestGroupModel()
const entityInterestItemModel = new EntityInterestItemModel()
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()
const userInterestsTextModel = new UserInterestsTextModel()

// Services
const entityInterestService = new EntityInterestService()
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

    console.log(`${fnName}: starting..`)

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

    // Reset the user's entity interest group
    const entityInterestGroup = await
            this.resetUserGroupInterest(
              prisma,
              userInterestsText.userProfileId)

    // Convert interests text to definite interests
    await userInterestsMutateService.upsertUserInterestsByText(
            prisma,
            userInterestsText.userProfileId,
            userInterestsText.text)

    // Group interests
    await this.groupInterests(prisma)

    // Batch job completed
    batchJob = await
      batchJobModel.update(
        prisma,
        batchJob.id,
        undefined,  // instanceId
        undefined,  // runInATransaction
        BatchTypes.completedBatchJobStatus,
        100,        // progressPct
        null)       // message

    // Return
    return {
      status: true
    }
  }

  async batchProcessing(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.batchProcessing()`

    console.log(`${fnName}: starting..`)

    // Group interests
    await this.groupInterests(prisma)

    // Find similar interests
    await this.findSimilarInterests(prisma)

    // Process new entity interests
    await entityInterestService.processNewEntityInterests(prisma)

    // Get recommended entity interests
    await getQlooInsightsService.getAllRecommendedInterests(prisma)
  }

  async groupInterests(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.groupInterests()`

    console.log(`${fnName}: starting..`)

    // Create embeddings missing for any interest groups
    await interestGroupService.creatingMissingEmbeddings(prisma)
  }

  async findSimilarInterests(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.findSimilarInterests()`

    console.log(`${fnName}: starting..`)

    // Find and save similar interests for groups needing that
    await interestGroupService.findAndSetSimilarEntityInterests(prisma)
  }

  async resetUserGroupInterest(
          prisma: PrismaClient,
          userProfileId: string) {

    // Try to get an existing UserEntityInterestGroup
    const userEntityInterestGroups = await
            userEntityInterestGroupModel.filter(
              prisma,
              userProfileId)

    for (const userEntityInterestGroup of userEntityInterestGroups) {

      // Update the EntityInterestGroup to set embeddingGenerated to null
      await userEntityInterestGroupModel.update(
              prisma,
              userEntityInterestGroup.id,
              undefined,  // userProfileId
              undefined,  // entityInterestGroupId
              undefined,  // type
              true)       // reset
    }
  }
}
