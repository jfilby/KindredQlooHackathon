import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { BatchTypes } from '@/types/batch-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'

// Models
const batchJobModel = new BatchJobModel()
const userInterestsTextModel = new UserInterestsTextModel()

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

    // Upsert UserInterestsText
    const userInterestsText = await
            userInterestsTextModel.upsert(
              prisma,
              undefined,  // id
              args.userProfileId,
              args.text)

    // Create a BatchJob to process the text
    // runInATransaction is true to prevent missing vital record processing
    const batchJob = await
            batchJobModel.upsert(
              prisma,
              undefined,  // id
              null,       // instanceId
              true,       // runInATransaction
              BatchTypes.newBatchJobStatus,
              0,          // progressPct
              null,       // message
              BatchTypes.createInterestsJobType,
              BatchTypes.userInterestsTextModel,
              userInterestsText.id,
              null,       // parameters
              null,       // results
              args.userProfileId)
  })

  // Return
  return {
    status: true
  }
}
