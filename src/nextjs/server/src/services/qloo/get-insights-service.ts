import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { QlooEntityCategory } from '@/types/qloo-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { QlooEntityModel } from '@/models/qloo/qloo-entity-model'
import { InterestGroupService } from '../interests/interest-group-service'
import { QlooUtilsFetchService } from './qloo-fetch-service'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'

// Models
const entityInterestModel = new EntityInterestModel()
const interestTypeModel = new InterestTypeModel()
const qlooEntityModel = new QlooEntityModel()
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()

// Services
const interestGroupService = new InterestGroupService()
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

    // Get a random selection of 10 entityIds
    if (qlooEntityIds != null) {
      qlooEntityIds = this.randomLimited(qlooEntityIds)
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
      uriAdditions.push(`filter.exclude.entities=` + qlooEntityIds.join(','))
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

  async getAllRecommendedInterests(prisma: PrismaClient) {

    // Get users with actual interests ready to reset
    const userEntityInterestGroups = await
            userEntityInterestGroupModel.filter(
              prisma,
              undefined,  // userProfileId
              undefined,  // entityInterestGroupId
              ServerOnlyTypes.actualUserInterestType,
              false)       // reset

    // Get recommended interests from Qloo
    for (const userEntityInterestGroup of userEntityInterestGroups) {

      // Check for an existing recommended UserEntityInterestGroup
      const recommendedUserEntityInterestGroup = await
              userEntityInterestGroupModel.getByUniqueKey(
                prisma,
                userEntityInterestGroup.userProfileId,
                ServerOnlyTypes.recommendedUserInterestType)

      if (recommendedUserEntityInterestGroup != null &&
          recommendedUserEntityInterestGroup.reset === false) {
        continue
      }

      // Generate recommended interests
      await this.getRecommendedInterests(
              prisma,
              userEntityInterestGroup.userProfileId)
    }
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

    // Debug
    console.log(`${fnName}: getResults: ` + JSON.stringify(getResults))

    // Validate
    if (getResults.results == null ||
        getResults.results.entities == null) {
      return []
    }

    // Debug
    // console.log(`${fnName}: getResults: ` + JSON.stringify(getResults))

    // Get the InterestType
    const interestType = await
            interestTypeModel.getByQlooEntityType(
              prisma,
              type)

    // Validate
    if (interestType == null) {
      throw new CustomError(
                  `${fnName}: interestType == null for type: ${type}`)
    }

    // Save the results
    var entityInterestIds: string[] = []

    for (const result of getResults.results.entities) {

      // Debug
      // console.log(`${fnName}: result: ` + JSON.stringify(result))

      // Set undefined values to null
      if (result.disambiguation === undefined) {
        result.disambiguation = null
      }

      if (result.popularity === undefined) {
        result.popularity = null
      }

      // Get types
      var types: string[] = []

      if (result.types != null) {
        types = result.types

      } else if (result.type != null) {
        types = [result.type]
      }

      // Save the QlooEntity
      const qlooEntity = await
              qlooEntityModel.upsert(
                prisma,
                undefined,  // id
                result.entity_id,
                false,      // isTrending
                result.name,
                result.disambiguation,
                types,
                result.popularity,
                result)

      // Upsert the EntityInterest
      const entityInterest = await
              entityInterestModel.upsert(
                prisma,
                undefined,  // id
                interestType.id,
                qlooEntity.id,
                BaseDataTypes.activeStatus,
                result.name)

      // Add to entityInterestIds
      entityInterestIds.push(entityInterest.id)
    }

    // Return
    return entityInterestIds
  }

  async getRecommendedInterests(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getRecommendedInterests()`

    console.log(`${fnName}: userProfileId: ${userProfileId}`)

    // Check the recommended UserEntityInterestGroup
    var userEntityInterestGroup = await
          userEntityInterestGroupModel.getByUniqueKey(
            prisma,
            userProfileId,
            ServerOnlyTypes.recommendedUserInterestType)

    if (userEntityInterestGroup != null) {
      if (userEntityInterestGroup.reset === false) {
        return
      }
    }

    // Get recommended interests from Qloo
    var allEntityInterestIds: string[] = []

    for (const type of Object.values(QlooEntityCategory)) {

      // Get qlooEntityIds
      const qlooEntityIds = await
              this.getUserEntityInterestsByQlooEntityType(
                prisma,
                userProfileId,
                type)

      // Debug
      console.log(`${fnName}: qlooEntityIds: ` +
                  JSON.stringify(qlooEntityIds))

      if (qlooEntityIds.length === 0) {
        continue
      }

      // Get and save entity interests
      const entityInterestIds = await
              this.getAndSave(
                prisma,
                type,
                3,  // take
                qlooEntityIds)

      allEntityInterestIds = allEntityInterestIds.concat(entityInterestIds)
    }

    // Don't create an EntityInterestGroup if there are no entityInterestIds
    if (allEntityInterestIds.length === 0) {

      console.log(`${fnName}: allEntityInterestIds.length === 0`)

      // Update userEntityInterestGroup and set reset to false
      if (userEntityInterestGroup != null) {

        userEntityInterestGroup = await
          userEntityInterestGroupModel.update(
            prisma,
            userEntityInterestGroup.id,
            undefined,  // userProfileId
            undefined,  // entityInterestGroupId
            undefined,  // type
            false)      // reset
      }

      return
    }

    // Debug
    console.log(`${fnName}: allEntityInterestIds: ` +
                JSON.stringify(allEntityInterestIds))

    // Get/create the EntityInterestGroup
    const entityInterestGroup = await
            interestGroupService.getOrCreate(
              prisma,
              allEntityInterestIds)

    // Upsert the UserEntityInterestGroup
    userEntityInterestGroup = await
      userEntityInterestGroupModel.upsert(
        prisma,
        undefined,  // id
        userProfileId,
        entityInterestGroup.id,
        ServerOnlyTypes.recommendedUserInterestType,
        false)      // reset

    // Debug
    console.log(`${fnName}: returning..`)
  }

  async getUserEntityInterestsByQlooEntityType(
          prisma: PrismaClient,
          userProfileId: string,
          qlooEntityType: string) {

    // Get the user's actual interests
    const userEntityInterestGroup = await
            userEntityInterestGroupModel.getByUniqueKey(
              prisma,
              userProfileId,
              ServerOnlyTypes.actualUserInterestType,
              true)  // includeEntityInterests

    /* Debug
    console.log(
      `${fnName}: userEntityInterestGroup.entityInterestGroup.ofEntityInterestItems: ` +
      JSON.stringify(userEntityInterestGroup.entityInterestGroup.ofEntityInterestItems)) */

    // Validate
    if (userEntityInterestGroup?.entityInterestGroup?.ofEntityInterestItems == null) {
      return []
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

      // Add qlooEntityIds of the required category
      if (entityInterest.status === BaseDataTypes.activeStatus &&
          entityInterest.qlooEntityId != null &&
          entityInterest.interestType.qlooEntityType === qlooEntityType) {

        qlooEntityIds.push(entityInterest.qlooEntity.qlooEntityId)
      }
    }

    return qlooEntityIds
  }

  randomLimited(qlooEntityIds: string[]) {

    if (!Array.isArray(qlooEntityIds)) return []

    const shuffled = [...qlooEntityIds].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 10)
  }
}
