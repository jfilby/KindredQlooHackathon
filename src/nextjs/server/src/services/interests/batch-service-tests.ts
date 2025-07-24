import { PrismaClient } from '@prisma/client'
import { ConsoleService } from '@/serene-core-server/services/console/service'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { InterestsBatchService } from '../interests/batch-service'

// Models
const batchJobModel = new BatchJobModel()

// Services
const consoleService = new ConsoleService()
const interestsBatchService = new InterestsBatchService()

// Class
export class InterestsBatchServiceTests {

  // Debug
  clName = 'InterestsBatchServiceTests'

  // Code
  async testCreateInterests(prisma: PrismaClient) {

    const batchJobId = await
            consoleService.askQuestion('batchJobId> ')

    const batchJob = await
            batchJobModel.getById(
              prisma,
              batchJobId)

    await interestsBatchService.createInterests(
            prisma,
            batchJob)
  }
}
