export class QlooApiDetails {

  static apiUrl = process.env.QLOO_API_URL
  static apiKey = process.env.QLOO_API_KEY
}

export enum QlooEntityType {
  brandEntityUrn = 'urn:entity:brand'
}

export enum QlooTag {
  genreAction = 'urn:tag:genre:action'
}
