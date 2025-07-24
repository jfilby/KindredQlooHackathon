export class BatchTypes {

  // Batch job statuses
  static activeBatchJobStatus = 'A'
  static completedBatchJobStatus = 'C'
  static failedBatchJobStatus = 'F'
  static newBatchJobStatus = 'N'

  // Batch job names
  static createInterestsJobType = 'createInterests'
  static createSiteTopicInterests = 'createSiteTopicInterests'

  // Ref models
  static siteTopicModel = 'SiteTopic'
  static userInterestsTextModel = 'UserInterestsText'
}
