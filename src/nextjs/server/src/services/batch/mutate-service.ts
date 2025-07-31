import { PrismaClient } from '@prisma/client'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'

// Models
const batchJobModel = new BatchJobModel()

// Class
export class BatchMutateService {

  // Consts
  clName = ''

  // Code
  async housekeeping(prisma: PrismaClient) {

    // Get all completed BatchJobs
    const completedBatchJobs = await
            batchJobModel.filter(
              prisma,
              undefined,
              [BatchTypes.completedBatchJobStatus],
              undefined,
              undefined,
              undefined)

    // Delete completed batch jobs
    for (const completedBatchJob of completedBatchJobs) {

      await batchJobModel.deleteById(
              prisma,
              completedBatchJob.id)
    }
  }
}
