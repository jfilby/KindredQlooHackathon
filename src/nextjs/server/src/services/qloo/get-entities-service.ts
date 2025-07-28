import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { QlooEntityCategory } from '@/types/qloo-types'
import { QlooEntityModel } from '@/models/qloo/qloo-entity-model'
import { QlooUtilsFetchService } from './qloo-fetch-service'

// Models
const qlooEntityModel = new QlooEntityModel()

// Services
const qlooUtilsFetchService = new QlooUtilsFetchService()

// Class
export class GetQlooEntitiesService {

  // Consts
  clName = 'GetQlooEntitiesService'

  // Code
  async get(query: string,
            take: number = 3,
            category: QlooEntityCategory | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.get()`

    // Validate
    if (query == null) {
      throw new CustomError(`${fnName}: query == null`)
    }

    if (take == null) {
      throw new CustomError(`${fnName}: take == null`)
    }

    if (take <= 1) {
      throw new CustomError(`${fnName}: take: <= 1`)
    }

    // Initial URL
    var uri = `/search?`

    // Add tags to the URL
    var uriAdditions: string[] = [
      `take=${take}`
    ]

    if (query != null) {

      uriAdditions.push(`query=` + encodeURIComponent(query))
    }

    if (category != null) {

      const uriTypes: string[] =
              [category].map(category => encodeURIComponent(category))

      uriAdditions.push(`types=` + uriTypes.join(','))
    }

    // Complete the URL
    uri += uriAdditions.join('&')

    // Fetch
    const results = await
            qlooUtilsFetchService.fetch(uri)

    // Return
    return results
  }

  async getAndSave(
          prisma: PrismaClient,
          query: string,
          take: number = 3,
          category: QlooEntityCategory | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.getAndSave()`

    // Get
    const getResults = await
            this.get(
              query,
              take,
              category)

    // Validate
    if (getResults.results == null) {
      return []
    }

    // Save the results
    const qlooEntityIds: string[] = []

    for (const result of getResults.results) {

      // Debug
      console.log(`${fnName}: result: ` + JSON.stringify(result))

      // Set undefined values to null
      if (result.disambiguation === undefined) {
        result.disambiguation = null
      }

      if (result.popularity === undefined) {
        result.popularity = null
      }

      // Upsert QlooEntity
      const qlooEntity = await
              qlooEntityModel.upsert(
                prisma,
                undefined,  // id
                result.entity_id,
                false,      // isTrending
                result.name,
                result.disambiguation,
                result.types,
                result.popularity,
                result)

      // Debug
      console.log(`${fnName}: QlooEntity upserted`)

      // Add id
      qlooEntityIds.push(qlooEntity.id)
    }

    // Return
    return qlooEntityIds
  }
}
