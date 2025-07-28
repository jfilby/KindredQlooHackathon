import { createHash } from 'crypto'
import { EntityInterest, EntityInterestGroup, EntityInterestItem, PrismaClient, UserEntityInterest } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { OpenAiEmbeddingsService } from '@/serene-ai-server/services/llm-apis/openai/embeddings-api'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { EntityInterestGroupModel } from '@/models/interests/entity-interest-group-model'
import { EntityInterestItemModel } from '@/models/interests/entity-interest-item-model'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { SharedEntityInterestGroupModel } from '@/models/interests/shared-entity-interest-group-model'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'
import { UserEntityInterestModel } from '@/models/interests/user-entity-interest-model'
import { GetTechService } from '../tech/get-tech-service'

// Models
const entityInterestGroupModel = new EntityInterestGroupModel()
const entityInterestItemModel = new EntityInterestItemModel()
const entityInterestModel = new EntityInterestModel()
const sharedEntityInterestGroupModel = new SharedEntityInterestGroupModel()
const techModel = new TechModel()
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()
const userEntityInterestModel = new UserEntityInterestModel()

// Services
const getTechService = new GetTechService()
const openAiEmbeddingsService = new OpenAiEmbeddingsService()

// Class
export class InterestGroupService {

  // Consts
  clName = 'InterestGroupService'

  // Code
  async creatingMissingEmbeddings(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.creatingMissingEmbeddings()`

    // Get records with missing embeddings
    const entityInterestGroups = await
            entityInterestGroupModel.filterByHasEmbedding(
              prisma,
              false,  // hasEmbedding
              true)   // includeEntityInterestItems

    // Validate
    if (entityInterestGroups == null) {
      throw new CustomError(`${fnName}: entityInterestGroups == null`)
    }

    // Process each group's embeddings
    for (const entityInterestGroup of entityInterestGroups) {

      // Get entityInterestIds
      const entityInterestIds =
              entityInterestGroup.ofEntityInterestItems.map(
                (entityInterestItem: EntityInterestItem) =>
                  entityInterestItem.entityInterestId)

      // Get EntityInterests
      const entityInterests = await
              entityInterestModel.getByIds(
                prisma,
                entityInterestIds)

      if (entityInterests == null) {
        throw new CustomError(`${fnName}: entityInterests == null`)
      }

      // Get the text for the embedding
      var entityInterestNames =
              entityInterests.map((entityInterest: EntityInterest) =>
                entityInterest.name)

      entityInterestNames = entityInterestNames.sort()

      // Validate
      if (entityInterestGroup.embeddingTechId == null) {
        throw new CustomError(
                    `${fnName}: entityInterestGroup.embeddingTechId == null`)
      }

      // Get embedding tech
      const embeddingsTech = await
              techModel.getById(
                prisma,
                entityInterestGroup.embeddingTechId)

      if (embeddingsTech == null) {
        throw new CustomError(`${fnName}: embeddingsTech == null`)
      }

      // Create the embedding
      const results = await
              openAiEmbeddingsService.requestEmbedding(
                prisma,
                embeddingsTech,
                entityInterestNames.join(', '))

      // Validate
      if (results == null) {
        throw new CustomError(`${fnName}: results == null`)
      }

      if (results.embedding == null) {
        throw new CustomError(`${fnName}: results.embedding == null`)
      }

      // Set the embedding
      await entityInterestGroupModel.setEmbedding(
              prisma,
              entityInterestGroup.id,
              results.embedding)
    }
  }

  async findAndSetSimilarEntityInterests(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.findAndSetSimilarEntityInterests()`

    console.log(`${fnName}: starting..`)

    // Look for entity interest groups have don't have similar interests groups
    var entityInterestGroups = await
          entityInterestGroupModel.filterByLastSimilarFound(
            prisma,
            null)  // lteLastSimilarFound

    if (entityInterestGroups == null) {
      throw new CustomError(`${fnName}: entityInterestGroups == null`)
    }

    // Find similar interests
    for (const entityInterestGroup of entityInterestGroups) {

      await this.findSimilarEntityInterests(
              prisma,
              entityInterestGroup)
    }

    // Look for entity interest groups that need to be updated
    const now = new Date()
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(now.getMonth() - 3)

    entityInterestGroups = await
      entityInterestGroupModel.filterByLastSimilarFound(
        prisma,
        null)  // lteLastSimilarFound

    if (entityInterestGroups == null) {
      throw new CustomError(`${fnName}: entityInterestGroups == null`)
    }

    // Find similar interests
    for (const entityInterestGroup of entityInterestGroups) {

      await this.findSimilarEntityInterests(
              prisma,
              entityInterestGroup)
    }

    // Debug
    console.log(`${fnName}: returning..`)
  }

  async findSimilarEntityInterests(
          prisma: PrismaClient,
          entityInterestGroup: EntityInterestGroup) {

    // Debug
    const fnName = `${this.clName}.findSimilarEntityInterests()`

    console.log(`${fnName}: starting..`)

    // Identify groups that need similar interests to be found
    const similarEntityInterestGroups = await
            entityInterestGroupModel.findSimilar(
              prisma,
              entityInterestGroup.id)

    // Set similar interests
    for (const similarEntityInterestGroup of similarEntityInterestGroups) {

      await sharedEntityInterestGroupModel.getOrCreate(
              prisma,
              entityInterestGroup.id,
              similarEntityInterestGroup.id)
    }

    // Set lastSimilarFound
    entityInterestGroup = await
      entityInterestGroupModel.update(
        prisma,
        entityInterestGroup.id,
        undefined,   // uniqueHash
        undefined,   // embeddingTechId
        undefined,   // embeddingGenerated
        new Date())  // lastSimilarFound

    console.log(`${fnName}: returning..`)
  }

  async getOrCreateMissingGroups(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getOrCreateMissingGroups()`

    console.log(`${fnName}: starting..`)

    // Get a list of UserEntityInterestGroups missing an entityInterestGroupId
    const userEntityInterestGroups = await
            userEntityInterestGroupModel.filter(
              prisma,
              undefined,  // userProfileId
              null,       // entityInterestGroupId
              ServerOnlyTypes.actualUserInterestType)

    // Process each UserEntityInterestGroup
    for (const userEntityInterestGroup of userEntityInterestGroups) {

      const userEntityInterests = await
              userEntityInterestModel.filter(
                prisma,
                userEntityInterestGroup.userProfileId)

      // Get entityInterestIds
      const entityInterestIds = userEntityInterests.map(
        (userEntityInterest: UserEntityInterest) =>
          userEntityInterest.entityInterestId)

      // Get/create the missing group
      const entityInterestGroup = await
              this.getOrCreate(
                prisma,
                entityInterestIds)

      // Assign to UserEntityInterestGroup
      await userEntityInterestGroupModel.update(
              prisma,
              userEntityInterestGroup.id,
              undefined,  // userProfileId
              entityInterestGroup.id,
              undefined)  // type
    }
  }

  async getOrCreate(
          prisma: PrismaClient,
          entityInterestIds: string[]) {

    // Debug
    const fnName = `${this.clName}.getOrCreate()`

    console.log(`${fnName}: starting with entityInterestIds: ` +
                JSON.stringify(entityInterestIds))

    // Get a unique hash
    const uniqueHash = this.getUniqueHash(entityInterestIds)

    // Try to find an existing record
    var entityInterestGroup = await
          entityInterestGroupModel.getByUniqueKey(
            prisma,
            uniqueHash,
            true)  // includeEntityInterestItems

    if (entityInterestGroup != null) {
      return entityInterestGroup
    }

    // Get embeddingTech
    const embeddingTech = await
            getTechService.getEmbeddingsTech(prisma)

    // Create records
    entityInterestGroup = await
      entityInterestGroupModel.create(
        prisma,
        uniqueHash,
        embeddingTech.id,
        null,  // embeddingGenerated
        null)  // lastSimilarFound

    for (const entityInterestId of entityInterestIds) {

      const entityInterestItem = await
              entityInterestItemModel.create(
                prisma,
                entityInterestGroup.id,
                entityInterestId)
    }

    // Debug
    console.log(`${fnName}: returning..`)

    // Return
    return entityInterestGroup
  }

  getUniqueHash(entityInterestIds: string[]) {

    // Sort (to ensure uniquess)
    const sorted = [...new Set(entityInterestIds)].sort()

    const data = sorted.join('|')
    const hash = createHash('sha256').update(data).digest('hex')

    // Return
    return hash
  }
}
