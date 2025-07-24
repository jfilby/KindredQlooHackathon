import { BatchJob, PrismaClient } from '@prisma/client'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { SiteTopicEntityInterestGroupModel } from '@/models/interests/site-topic-entity-interest-group-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'
import { GetTechService } from '../tech/get-tech-service'
import { InterestGroupService } from './interest-group-service'

// Models
const entityInterestModel = new EntityInterestModel()
const interestTypeModel = new InterestTypeModel()
const siteTopicEntityInterestGroupModel = new SiteTopicEntityInterestGroupModel()
const siteTopicModel = new SiteTopicModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()
const interestGroupService = new InterestGroupService()

// Class
export class SiteTopicInterestsMutateService {

  // Consts
  clName = 'SiteTopicInterestsMutateService'

  // Code
  async createAllMissingStarterInterests(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.createAllMissingStarterInterests()`

    // Get site topics with no entity interest groups
    const siteTopics = await
            siteTopicModel.getWithMissingEntityInterestGroups(prisma)

    // Validate
    if (siteTopics == null) {
      throw new CustomError(`${fnName}: siteTopics == null`)
    }

    // Create starter interest groups
    for (const siteTopic of siteTopics) {

      await this.createStarterInterestGroups(
              prisma,
              userProfileId,
              siteTopic)
    }
  }

  async createStarterInterestGroups(
          prisma: PrismaClient,
          userProfileId: string,
          siteTopic: any) {

    // Debug
    const fnName = `${this.clName}.createStarterInterestGroups()`

    // Get tech
    const tech = await
            getTechService.getStandardLlmTech(prisma)

    // Get InterestTypes
    const entityInterests = await
            entityInterestModel.filter(
              prisma)

    if (entityInterests == null) {
      throw new CustomError(`${fnName}: entityInterests == null`)
    }

    if (entityInterests.length === 0) {
      throw new CustomError(`${fnName}: entityInterests.length === 0`)
    }

    // Define the prompt
    var prompt =
          `# Prompt\n` +
          `\n` +
          `## General instructions\n` +
          `- This is for site: ${siteTopic.site.name}.\n` +
          `- This is for the site topic: ${siteTopic.name}.\n` +
          `- Generate a series of 5-10 topics that the posts would be ` +
          `  about.\n` +
          `- The interestNames should be in natural, but lower case.\n` +
          `\n` +
          `Entity interests: ` + JSON.stringify(entityInterests) + `\n` +
          `\n` +
          `An example:\n` +
          `[\n` +
          `  {\n` +
          `    "interestTypeId": "..".\n` +
          `    "interestName": ".."\n` +
          `  }\n` +
          `]\n`

    // LLM request
    const queryResults = await
            agentLlmService.agentSingleShotLlmRequest(
              prisma,
              tech,
              userProfileId,
              null,       // instanceId
              ServerOnlyTypes.defaultChatSettingsName,
              BaseDataTypes.batchAgentRefId,
              BaseDataTypes.batchAgentName,
              BaseDataTypes.batchAgentRole,
              prompt,
              true)       // isJsonMode

    // Validate
    if (queryResults == null) {

      console.log(`${fnName}: queryResults == null`)
      return
    }

    // Process
    const results = await
            this.processQueryResults(
              prisma,
              siteTopic.id,
              queryResults)

    // Return
    return results
  }

  async createStarterInterestGroupsByBatchJob(
          prisma: PrismaClient,
          batchJob: BatchJob) {

    // Debug
    const fnName = `${this.clName}.createStarterInterestGroupsByBatchJob()`

    // Validate
    if (batchJob == null) {
      throw new CustomError(`${fnName}: batchJob == null`)
    }

    if (batchJob.userProfileId == null) {
      throw new CustomError(`${fnName}: batchJob.userProfileId == null`)
    }

    if (batchJob.userProfileId == null) {
      throw new CustomError(`${fnName}: batchJob.refId == null`)
    }

    // Call the main function
    const results = await
            this.createStarterInterestGroups(
              prisma,
              batchJob.userProfileId,
              batchJob.refId)

    // Return
    return results
  }

  async processQueryResults(
          prisma: PrismaClient,
          siteTopicId: string,
          queryResults: any) {

    // Debug
    const fnName = `${this.clName}.createStarterInterestGroups()`

    // Validate
    if (queryResults.json == null) {
      throw new CustomError(`${fnName}: queryResults.json == null`)
    }

    if (!Array.isArray(queryResults.json)) {
      throw new CustomError(`${fnName}: queryResults.json isn't an array`)
    }

    // Upsert
    var entityInterestIds: string[] = []

    for (var interest of queryResults.json) {

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

      // Lowercase the interestName
      const interestName = (interest.interestName as string).toLowerCase()

      // Validate interestTypeId exists
      const interestType = await
              interestTypeModel.getById(
                prisma,
                interest.interestTypeId)

      if (interestType) {
        throw new CustomError(`${fnName}: InterestType not found for id: ` +
                              `${interest.interestTypeId}`)
      }

      // Upsert the entity interest
      const entityInterest = await
              entityInterestModel.getByUniqueKey(
                prisma,
                interest.interestTypeId,
                interestName)

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

    // Upsert the SiteTopicEntityInterestGroup
    const siteTopicEntityInterestGroup = await
            siteTopicEntityInterestGroupModel.upsert(
              prisma,
              undefined,  // id
              siteTopicId,
              entityInterestGroup.id)
  }
}
