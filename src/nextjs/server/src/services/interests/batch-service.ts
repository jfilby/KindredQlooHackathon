import { BatchJob, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { EntityInterestGroupModel } from '@/models/interests/entity-interest-group-model'
import { EntityInterestItemModel } from '@/models/interests/entity-interest-item-model'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'
import { EntityInterestService } from './entity-interest-service'
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
  }

  async groupInterests(prisma: PrismaClient) {

    // Get/create interest groups
    await interestGroupService.getOrCreateMissingGroups(prisma)

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
    const userEntityInterestGroup = await
            userEntityInterestGroupModel.getByUniqueKey(
              prisma,
              userProfileId,
              ServerOnlyTypes.actualUserInterestType)

    if (userEntityInterestGroup == null) {
      return
    }

    // Delete the items in the group
    await entityInterestItemModel.deleteByEntityInterestGroupId(
            prisma,
            userEntityInterestGroup.entityInterestGroupId)

    // Update the EntityInterestGroup to set embeddingGenerated to null
    await entityInterestGroupModel.update(
            prisma,
            userEntityInterestGroup.entityInterestGroupId,
            undefined,  // uniqueHash
            undefined,  // embeddingTechId
            null,       // embeddingGenerated
            undefined)  // lastSimilarFound
  }
}
