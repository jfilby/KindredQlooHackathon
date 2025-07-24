import { PrismaClient } from '@prisma/client'
import { BatchTypes } from '@/types/batch-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { SiteModel } from '@/models/social-media/site-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'

// Models
const batchJobModel = new BatchJobModel()
const siteModel = new SiteModel()
const siteTopicModel = new SiteTopicModel()

// Class
export class SocialMediaSetupService {

  // Consts
  clName = 'SocialMediaSetupService'

  // Code
  async setup(
          prisma: PrismaClient,
          userProfileId: string) {

    // Upsert Site records
    for (const siteName of ServerOnlyTypes.socialMediaSites) {

      await siteModel.upsert(
              prisma,
              undefined,  // id
              siteName)
    }

    // Get the HN site
    const hnSite = await
            siteModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.hnSiteName)

    // Define a front-page topic for HN
    const siteTopic = await
            siteTopicModel.upsert(
              prisma,
              undefined,  // id
              hnSite.id,
              ServerOnlyTypes.allSiteTopic)

    // Get/create a BatchJob to add interests for the site topic
    var batchJob = await
          batchJobModel.getByStatusesAndJobTypeAndRefModelAndRefId(
            prisma,
            null,  // instanceId
            [
              BatchTypes.newBatchJobStatus,
              BatchTypes.activeBatchJobStatus
            ],
            BatchTypes.createSiteTopicInterests,
            BatchTypes.siteTopicModel,
            siteTopic.id)

    if (batchJob == null) {

      batchJob = await
        batchJobModel.create(
          prisma,
          null,   // instanceId
          false,  // runInATransaction
          BatchTypes.newBatchJobStatus,
          0,      // progressPct
          null,   // message
          BatchTypes.createSiteTopicInterests,
          BatchTypes.siteTopicModel,
          siteTopic.id,
          null,   // parameters
          null,   // results
          userProfileId)
    }
  }
}
