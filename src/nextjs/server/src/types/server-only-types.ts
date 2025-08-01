import { BaseDataTypes } from '@/shared/types/base-data-types'

export class ServerOnlyTypes {

  // Feature flags
  static socialMediaBatchPipelineFeatureFlag = 'socialMediaBatchPipeline'

  // Chat settings
  static defaultChatSettingsName = 'default'
  static kindredChatSettingsName = 'kindred'

  static chatSettingsNames = [
    this.defaultChatSettingsName,
    this.kindredChatSettingsName
  ]

  static chatSettings = [
    {
      name: this.defaultChatSettingsName,
      agentUniqueRef: BaseDataTypes.batchAgentRefId,
      isJsonMode: true
    },
    {
      name: this.kindredChatSettingsName,
      agentUniqueRef: BaseDataTypes.kindredAgentRefId,
      isJsonMode: false
    }
  ]

  // Social media sites
  static hnSiteName = 'HN'

  static socialMediaSites = [
    this.hnSiteName
  ]

  static socialMediaUrls = {
    [this.hnSiteName]: `https://news.ycombinator.com/item?id={externalId}`
  }

  static socialMediaCommentUrls = {
    [this.hnSiteName]: `https://news.ycombinator.com/item?id={externalId}`
  }

  // Social media ranking types
  static frontPageRankingType = 'front-page'

  // Site-independent site topics
  static allSiteTopic = 'all'

  // Listing-related durations
  static timeToGenListingInMins = 20
  static listingFreqInHours = 8

  // User interests
  static actualUserInterestType = 'A'
  static recommendedUserInterestType = 'R'
}
