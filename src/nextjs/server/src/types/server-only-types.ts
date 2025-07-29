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
      agentUniqueRef: BaseDataTypes.batchAgentRefId
    },
    {
      name: this.kindredChatSettingsName,
      agentUniqueRef: BaseDataTypes.kindredAgentRefId
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

  // Frequency to create listings
  static listingFreqInHours = 6

  // User interests
  static actualUserInterestType = 'A'
  static recommendedUserInterestType = 'R'
}
