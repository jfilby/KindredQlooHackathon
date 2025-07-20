import { CustomError } from '@/serene-core-server/types/errors'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { UserInterestTextModel } from '@/models/interests/user-interest-text-model'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { BatchTypes } from '@/types/batch-types'

// Models
const batchJobModel = new BatchJobModel()
const userInterestTextModel = new UserInterestTextModel()

// Code
export async function upsertUserInterestsByText(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `upsertUserInterestsByText()`

  // Validate
  if (args.userProfileId == null) {
    throw new CustomError(`${fnName}: args.userProfileId == null`)
  }

  if (args.text == null) {
    throw new CustomError(`${fnName}: args.text == null`)
  }

  // Run in a transaction
  await prisma.$transaction(async (transactionPrisma: any) => {

    // Upsert UserInterestText
    const userInterestText = await
            userInterestTextModel.upsert(
              prisma,
              undefined,  // id
              args.userProfileId,
              args.text)

    // Create a BatchJob to process the text
    const batchJob = await
            batchJobModel.upsert(
              prisma,
              undefined,  // id
              null,       // instanceId
              false,      // runInATransaction
              BatchTypes.newBatchJobStatus,
              0,          // progressPct
              null,       // message
              BatchTypes.createInterestsJobType,
              BatchTypes.userInterestTextModel,
              userInterestText.id,
              null,       // parameters
              null,       // results
              args.userProfileId)
  })

  // Return
  return {
    status: true
  }
}
