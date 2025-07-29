import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { SiteTopicListModel } from '@/models/social-media/site-topic-list-model'

// Models
const siteTopicListModel = new SiteTopicListModel()

// Class
export class SummarizePostUtilsService {

  // Consts
  clName = 'SummarizePostUtilsService'

  // Code
  async getTimeToNextSummary(
          prisma: PrismaClient,
          siteTopicId: string) {

    // Get the latest listing for the site topic
    const siteTopicList = await
            siteTopicListModel.getLatestBySiteTopicIdAndStatus(
              prisma,
              siteTopicId,
              ServerOnlyTypes.frontPageRankingType,
              BaseDataTypes.activeStatus)

    if (siteTopicList == null) {
      return {
        status: true
      }
    }

    // Get the listing time + freq to generate next listing (hours)
    const nextListing =
            new Date(siteTopicList.listed.getTime() +
            ServerOnlyTypes.listingFreqInHours * 60 * 60 * 1000 +
            ServerOnlyTypes.timeToGenListingInMins * 60 * 1000)

    // Get the wait time till the next listing
    const now = new Date()
    const diffMs = nextListing.getTime() - now.getTime()

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    // Overdue
    const overdue = diffMs < 0

    // Get the wait time as a string
    const waitTime =
      diffHours > 0
        ? `${diffHours} hour${diffHours > 1 ? 's' : ''} and ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`
        : `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;

    // Overdue or ready?
    var overdueOrReady = 'overdue'

    // Return
    return {
      status: true,
      overdueOrReady: overdueOrReady,
      waitTime: waitTime
    }
  }
}
