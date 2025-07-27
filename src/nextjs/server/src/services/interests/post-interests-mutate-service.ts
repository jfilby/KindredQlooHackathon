import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { PostEntityInterestGroupModel } from '@/models/interests/post-entity-interest-group-model'
import { EntityInterestService } from './entity-interest-service'
import { InterestGroupService } from './interest-group-service'

// Models
const interestTypeModel = new InterestTypeModel()
const postEntityInterestGroupModel = new PostEntityInterestGroupModel()

// Services
const entityInterestService = new EntityInterestService()
const interestGroupService = new InterestGroupService()

// Class
export class PostInterestsMutateService {

  // Consts
  clName = 'PostInterestsMutateService'

  // Code
  async process(
          prisma: PrismaClient,
          postId: string,
          queryResults: any) {

    // Debug
    const fnName = `${this.clName}.process()`

    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Validate
    if (queryResults.json.interests == null) {
      throw new CustomError(`${fnName}: queryResults.json.interests == null`)
    }

    if (!Array.isArray(queryResults.json.interests)) {
      throw new CustomError(`${fnName}: queryResults.json.interests isn't ` +
                            `an array`)
    }

    // Upsert
    var entityInterestIds: string[] = []

    for (var interest of queryResults.json.interests) {

      // Validate interest
      if (interest == null) {
        throw new CustomError(`${fnName}: interest == null`)
      }

      if (interest.interestTypeId == null) {
        throw new CustomError(`${fnName}: interest.interestTypeId == null`)
      }

      if (interest.interestName == null) {
        throw new CustomError(`${fnName}: interest.interestName == null`)
      }

      // Validate interestTypeId exists
      const interestType = await
              interestTypeModel.getById(
                prisma,
                interest.interestTypeId)

      if (interestType == null) {

        console.warn(`${fnName}: InterestType not found for id: ` +
                     `${interest.interestTypeId}`)

        continue
      }

      // Get/create EntityInterest
      const entityInterest = await
              entityInterestService.getOrCreate(
                prisma,
                interest.interestTypeId,
                interest.interestName)

      // Add to entityInterestIds
      entityInterestIds.push(entityInterest.id)
    }

    // Return early if no entityInterestIds
    if (entityInterestIds.length === 0) {
      return
    }

    // Get/create the EntityInterestGroup
    const entityInterestGroup = await
            interestGroupService.getOrCreate(
              prisma,
              entityInterestIds)

    // Validate
    if (entityInterestGroup == null) {
      throw new CustomError(`${fnName}: entityInterestGroup == null`)
    }

    // Upsert the PostEntityInterestGroup
    const postEntityInterestGroup = await
            postEntityInterestGroupModel.upsert(
              prisma,
              undefined,  // id
              postId,
              entityInterestGroup.id)
  }

  async verifyInterestTypeIds(
          prisma: PrismaClient,
          interests: any[]) {

    // Debug
    const fnName = `${this.clName}.verifyInterestTypeIds()`

    // Validate interests
    if (interests == null) {

      console.log(`${fnName}: interests == null`)

      return {
        status: false
      }
    }

    if (!Array.isArray(interests)) {

      console.log(`${fnName}: interests isn't an array`)

      return {
        status: false
      }
    }

    // Iterate interests
    for (const interest of interests) {

      const interestType = await
              interestTypeModel.getById(
                prisma,
                interest.interestTypeId)

      if (interestType == null) {

        console.log(`${fnName}: interestType not found for id: ` +
                    `${interest.interestTypeId}`)

        return {
          status: false
        }
      }
    }

    // Return OK
    return {
      status: true
    }
  }
}
