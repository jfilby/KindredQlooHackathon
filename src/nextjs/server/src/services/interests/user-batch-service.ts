import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'

// Models
const batchJobModel = new BatchJobModel()

// Class
export class UserInterestsBatchService {

  // Debug
  clName = 'UserInterestsBatchService'

  // Code
  async getUserInterestsStatus(
          prisma: PrismaClient,
          userProfileId: string) {

    // Interests updating?
    var userInterestsStatus = BaseDataTypes.activeStatus

    // Get new/active batch jobs to update user interests
    const interestsBatchJobs = await
            batchJobModel.getByStatusesAndJobTypeAndRefModelAndRefId(
              prisma,
              null,  // instanceId
              [
                BaseDataTypes.newStatus,
                BaseDataTypes.activeStatus
              ],
              BatchTypes.createInterestsJobType,
              BatchTypes.userInterestsTextModel,
              undefined,  // refId
              userProfileId)

    // Debug
    // console.log(`${fnName}: interestsBatchJobs.length: ` +
    //             `${interestsBatchJobs.length}`)

    // If processing
    if (interestsBatchJobs.length > 0) {
      userInterestsStatus = BaseDataTypes.newStatus
    }

    // Return
    return userInterestsStatus
  }
}
