// Load the env file
require('dotenv').config({ path: `../server/.env.${process.env.NODE_ENV}` })

// Requires/imports
const { PrismaClient } = require('../server/node_modules/@prisma/client')
import { CustomError } from '@/serene-core-server/types/errors'
import { FeatureFlagModel } from '@/serene-core-server/models/feature-flags/feature-flag-model'
import { BatchTypes } from '@/types/batch-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { InterestsBatchService } from '@/services/interests/batch-service'
import { SiteTopicInterestsMutateService } from '@/services/interests/site-topic-interests-mutate-service'
import { SocialMediaBatchPipelineService } from '@/services/social-media/pipeline/service'

const prisma = new PrismaClient()

// Models
const featureFlagModel = new FeatureFlagModel()

// Services
const interestsBatchService = new InterestsBatchService()
const siteTopicInterestsMutateService = new SiteTopicInterestsMutateService()
const socialMediaBatchPipelineService = new SocialMediaBatchPipelineService()

// Settings
const concurrentJobs = 4
const sleepSeconds = 1

// Consts
const seconds20InMs = 20 * 1000
const minutes5InMs = 5 * 60 * 1000
const minutes15InMs = 5 * 60 * 1000 * 15
const hours1InMs = 1000 * 60 * 60
const hours6InMs = 1000 * 60 * 60 * 6

// Functions
async function dispatchBatchJobByType(
                 prismaForJob: any,
                 batchJobModelQuery: any,
                 batchJob: any) {

  // Debug
  const fnName = 'dispatchBatchJobByType()'

  // Get parameters
  console.log(`${fnName}: batchJob: ` + JSON.stringify(batchJob))
  console.log(`${fnName}: parameters: ` + JSON.stringify(batchJob.parameters))

  // Dispatch by job type
  try {

    switch(batchJob.jobType) {

      case BatchTypes.createInterestsJobType: {

        return await interestsBatchService.createInterests(
                       prismaForJob,
                       batchJob)
      }

      case BatchTypes.createSiteTopicInterests: {

        return await siteTopicInterestsMutateService.createStarterInterestGroupsByBatchJob(
                       prismaForJob,
                       batchJob)
      }

      default: {
        return {
          status: false,
          message: `Unhandled jobType: ${batchJob.jobType}`
        }
      }
    }
  } catch(error) {
    if (error instanceof CustomError) {
      return {
        status: false,
        message: error.message
      }
    } else {
      return {
        status: false,
        message: `Unexpected error: ${error}`
      }
    }
  }
}

async function interval20s(prisma: any) {

  // Debug
  const fnName = 'interval20s'

  // console.log(`${fnName}: starting..`)

  // Actions
  ;
}

async function interval5m(prisma: any) {

  ;
}

async function interval15m(prisma: any) {

  // Debug
  const fnName = 'interval15m'

  console.log(`${fnName}: starting..`)

  // Create missing interests for site topics
  await siteTopicInterestsMutateService.createAllMissingStarterInterests(prisma)

  // Group and find similar interests
  await interestsBatchService.batchProcessing(prisma)

  // Social media batch pipeline
  const socialMediaBatchPipelineFeatureFlag = await
          featureFlagModel.getByUniqueKey(
            prisma,
            null,
            null,
            ServerOnlyTypes.socialMediaBatchPipelineFeatureFlag)

  if (socialMediaBatchPipelineFeatureFlag != null &&
      socialMediaBatchPipelineFeatureFlag.enabled == true) {

    await socialMediaBatchPipelineService.runForAllSites(prisma)
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Main batch
(async () => {

  // Debug
  const fnName = 'index.ts'

  // console.log(`${fnName}: starting..`)

  // Vars
  var lastInterval20s = new Date().getTime()
  var lastInterval5m = new Date().getTime()
  var lastInterval15m = new Date().getTime()
  var lastInterval1d = new Date().getTime()

  // Models
  const batchJobModel = new BatchJobModel()

  // Immediate housekeeping (later runs will be every x minutes)
  await interval20s(prisma)
  await interval5m(prisma)
  await interval15m(prisma)

  // Batch loop
  while (true) {

    // Get pending batch jobs
    const batchJobsPending = await
            batchJobModel.getUniqueByStatus(
              prisma,
              undefined,
              BatchTypes.newBatchJobStatus,
              concurrentJobs)

    // Debug
    // console.log(`${fnName}: batchJobsPending: ${batchJobsPending.length}`)

    // 20s interval
    if (new Date().getTime() - lastInterval20s >= seconds20InMs) {

      await interval20s(prisma)
      lastInterval20s = new Date().getTime()
    }

    // If there are no batch jobs to run, then perform housekeeping at 5m intervals
    if (batchJobsPending.length === 0) {

      if (new Date().getTime() - lastInterval5m >= minutes5InMs) {

        await interval5m(prisma)
        lastInterval5m = new Date().getTime()
      }
    }

    if (new Date().getTime() - lastInterval15m >= minutes15InMs) {

      await interval15m(prisma)
      lastInterval15m = new Date().getTime()
    }

    // Get batch jobs as promises to run
    const promises = batchJobsPending.map(async (batchJobPending) => {

      // Set the BatchJob status to active
      batchJobPending = await
        batchJobModel.update(
          prisma,
          batchJobPending.id,
          undefined,  // instanceId
          undefined,  // runInATransaction
          BatchTypes.activeBatchJobStatus)

      // Run by job type (running in a transaction is optional)
      var results: any = undefined

      if (batchJobPending.runInATransaction === true) {

        // Run in a transaction
        await prisma.$transaction(async (transactionPrisma: any) => {
          results = await
            dispatchBatchJobByType(
              transactionPrisma,
              batchJobModel,
              batchJobPending)
        },
        {
          maxWait: 5 * 60000, // default: 5m
          timeout: 5 * 60000, // default: 5m
          // isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        })
      } else {

        // Run without a transaction
        results = await
          dispatchBatchJobByType(
            prisma,
            batchJobModel,
            batchJobPending)
      }

      // Handle returning results
      var status: string
      var message: string | null

      if (results.status === true) {
        status = BatchTypes.completedBatchJobStatus
        message = null
      } else {
        status = BatchTypes.failedBatchJobStatus
        message = results.message
      }

      await batchJobModel.upsert(
              prisma,
              batchJobPending.id,
              undefined,
              undefined,
              status,
              undefined,  // progressPct
              message,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined)
    })

    // Sleep 3s if no batch jobs were pending
    if (batchJobsPending.length === 0) {
      const seconds1 = 1000 * sleepSeconds
      await sleep(seconds1 * 3)
    }

    // Execute promises in parallel
    await Promise.all(promises)
  }

  await prisma.$disconnect()
})()
