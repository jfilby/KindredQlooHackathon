import { QlooEntityType, QlooTag } from '@/types/qloo-types'
import { QlooUtilsFetchService } from './qloo-fetch-service'

// Services
const qlooUtilsFetchService = new QlooUtilsFetchService()

// Class
export class GetQlooEntitiesService {

  // Consts
  clName = 'GetQlooEntitiesService'

  // Code
  async get(query: string,
            types: QlooEntityType[] | undefined = undefined,
            tags: QlooTag[] | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.get()`

    // Initial URL
    var uri = `/search?`

    // Add tags to the URL
    var uriAdditions: string[] = []

    if (query != null) {

      uriAdditions.push(`query=` + encodeURIComponent(query))
    }

    if (types != null) {

      const uriTypes: string[] = types.map(type => encodeURIComponent(type))

      uriAdditions.push(`types=` + uriTypes.join(','))
    }

    if (tags != null) {

      const uriTags: string[] = tags.map(tag => encodeURIComponent(tag))

      uriAdditions.push(`filter.tags=` + uriTags.join(','))
    }

    // Complete the URL
    uri += uriAdditions.join('&')

    // Fetch
    const results = await
            qlooUtilsFetchService.fetch(uri)

    // Return
    return results
  }
}
