import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { QlooEntityCategory } from '@/types/qloo-types'
import { QlooEntityModel } from '@/models/qloo/qloo-entity-model'
import { QlooUtilsFetchService } from './qloo-fetch-service'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'

// Models
const qlooEntityModel = new QlooEntityModel()
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()

// Services
const qlooUtilsFetchService = new QlooUtilsFetchService()

// Class
export class GetQlooInsightsService {

  // Consts
  clName = 'GetQlooInsightsService'

  // Code
  async get(type: string | undefined,
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

      uriAdditions.push(`signal.interests.entities=` + qlooEntityIds.join(','))
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

  async getRecommendedInterests(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getRecommendedInterests()`

    console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Get the user's interests
    const userEntityInterestGroup = await
            userEntityInterestGroupModel.getByUniqueKey(
              prisma,
              userProfileId,
              true)  // includeEntityInterests

    /* Debug
    console.log(
      `${fnName}: userEntityInterestGroup.entityInterestGroup.ofEntityInterestItems: ` +
      JSON.stringify(userEntityInterestGroup.entityInterestGroup.ofEntityInterestItems)) */

    // Validate
    if (userEntityInterestGroup?.entityInterestGroup?.ofEntityInterestItems == null) {
      return
    }

    // Get entityInterestItems
    const entityInterestItems =
            userEntityInterestGroup.entityInterestGroup.ofEntityInterestItems

    // Get entityInterests
    const entityInterests =
            entityInterestItems.map(
              (entityInterestItem: any) => entityInterestItem.entityInterest)

    // Get qlooEntityIds
    const qlooEntityIds: string[] = []

    for (const entityInterest of entityInterests) {

      if (entityInterest.status === BaseDataTypes.activeStatus &&
          entityInterest.qlooEntityId != null) {

        qlooEntityIds.push(entityInterest.qlooEntity.qlooEntityId)
      }
    }

    // Debug
    console.log(`${fnName}: qlooEntityIds: ` +
                JSON.stringify(qlooEntityIds))

    // Get recommended interests from Qloo
    const results = await
            this.get(
              QlooEntityCategory.book,  // type
              3,                        // take
              qlooEntityIds)

    // Debug
    console.log(`${fnName}: results: ` + JSON.stringify(results))
  }
}
