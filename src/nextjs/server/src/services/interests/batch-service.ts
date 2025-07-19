import { BatchJob, PrismaClient } from '@prisma/client'
import { InterestGroupService } from './interest-group-service'

// Services
const interestGroupService = new InterestGroupService()

// Class
export class InterestsBatchService {

  // Debug
  clName = 'InterestsBatchService'

  // Code
  async createInterests(
          prisma: PrismaClient,
          batchJob: BatchJob) {

    // Convert interests text to definite interests
    ;
  }

  async groupAndFindSimilarInterests(
          prisma: PrismaClient,
          batchJob: BatchJob) {

    // Group interests
    await this.groupInterests(prisma)

    // Find similar interests
    await this.findSimilarInterests(prisma)
  }

  async groupInterests(prisma: PrismaClient) {

    // Get/create interest groups
    await interestGroupService.getOrCreateMissingGroups(prisma)

    // Create embeddings missing for any interest groups
    ;
  }

  async findSimilarInterests(prisma: PrismaClient) {

    // Identify groups that need similar interests to be found
    ;

    // Find and save similar interests for groups needing that
    ;
  }
}
