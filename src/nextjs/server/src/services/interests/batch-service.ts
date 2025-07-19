import { BatchJob, PrismaClient } from '@prisma/client'

export class InterestsBatchService {

  // Debug
  clName = 'InterestsBatchService'

  // Code
  async runCreateInterestsWithGroups(
          prisma: PrismaClient,
          batchJob: BatchJob) {

    // Convert interests text to definite interests
    ;

    // Create any new interest groups
    ;

    // Create embeddings missing for any interest groups
    ;
  }

  async runFindSimilarInterests(
          prisma: PrismaClient,
          batchJob: BatchJob) {

    // Identify groups that need similar interests to be found
    ;

    // Find and save similar interests for groups needing that
    ;
  }
}
