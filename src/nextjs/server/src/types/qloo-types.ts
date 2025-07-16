export class QlooApiDetails {

  static apiUrl = process.env.QLOO_API_URL
  static apiKey = process.env.QLOO_API_KEY
}

export enum QlooEntityCategory {
  actor = 'urn:entity:actor',
  album = 'urn:entity:album',
  artist = 'urn:entity:artist',
  author = 'urn:entity:author',
  book = 'urn:entity:book',
  brand = 'urn:entity:brand',
  destination = 'urn:entity:destination',
  director = 'urn:entity:director',
  locality = 'urn:entity:locality',
  movie = 'urn:entity:movie',
  person = 'urn:entity:person',
  place = 'urn:entity:place',
  podcast = 'urn:entity:podcast',
  tv_show = 'urn:entity:tv_show',
  videogame = 'urn:entity:videogame',
  demographics = 'urn:demographics',
  tag = 'urn:entity:tag'
}

export enum QlooTag {
  genreAction = 'urn:tag:genre:action'
}
