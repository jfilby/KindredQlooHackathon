export class ServerOnlyTypes {

  // Chat settings
  static defaultChatSettingsName = 'default'

  static chatSettingsNames = [
    this.defaultChatSettingsName
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
}
