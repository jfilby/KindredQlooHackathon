import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { QlooEntityModel } from '@/models/qloo/qloo-entity-model'
import { QlooUtilsFetchService } from './qloo-fetch-service'

// Models
const qlooEntityModel = new QlooEntityModel()

// Services
const qlooUtilsFetchService = new QlooUtilsFetchService()

// Class
export class GetQlooInsightsService {

  // Consts
  clName = 'GetQlooInsightsService'

  // Code
  async get(type: string,
            take: number = 3,
            qlooEntityIds: string[] | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.get()`

    // Validate
    if (type == null) {
      throw new CustomError(`${fnName}: type == null`)
    }

    if (take == null) {
      throw new CustomError(`${fnName}: take == null`)
    }

    if (take <= 1) {
      throw new CustomError(`${fnName}: take <= 1`)
    }

    // Initial URL
    var uri = `/v2/insights?`

    // Add tags to the URL
    var uriAdditions: string[] = [
      `take=${take}`
    ]

    if (type != null) {

      uriAdditions.push(`filter.type=` + encodeURIComponent(type))
    }

    if (qlooEntityIds != null) {

      uriAdditions.push(`filter.results.entities=` + qlooEntityIds.join(','))
    }

    // Complete the URL
    uri += uriAdditions.join('&')

    // Fetch
    const results = await
            qlooUtilsFetchService.fetch(uri)

    // Debug
    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Return
    return results
  }

  async getAndSave(
          prisma: PrismaClient,
          type: string,
          take: number = 3,
          qlooEntityIds: string[] | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.getAndSave()`

    // Get
    const getResults = await
            this.get(
              type,
              take,
              qlooEntityIds)

    // Validate
    if (getResults.results == null ||
        getResults.results.entities == null) {
      return
    }

    // Save the results
    for (const result of getResults.results.entities) {

      // Save the entity
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
    }
  }

  async setMissingQlooEntityIds(prisma: PrismaClient) {

    // Get entities
    const entities = await
            qlooEntityModel.filter(
              prisma,
              undefined,  // isTrending
              undefined)  // types

    // Return if no entities to process
    if (entities.length === 0) {
      return
    }

    // Get entityIds
    const qlooEntityIds = entities.map((entity: any) => entity.qlooEntityId)

    // Query
    await this.getAndSave(
            prisma,
            entities[0].types[0],
            3,  // take
            qlooEntityIds)
  }
}
