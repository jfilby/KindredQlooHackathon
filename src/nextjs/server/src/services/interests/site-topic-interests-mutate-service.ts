import { BatchJob, PrismaClient } from '@prisma/client'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { CustomError } from '@/serene-core-server/types/errors'
import { UsersService } from '@/serene-core-server/services/users/service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { BatchTypes } from '@/types/batch-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { ServerTestTypes } from '@/types/server-test-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { SiteTopicEntityInterestGroupModel } from '@/models/interests/site-topic-entity-interest-group-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'
import { EntityInterestService } from './entity-interest-service'
import { GetTechService } from '../tech/get-tech-service'
import { InterestGroupService } from './interest-group-service'
import { PostInterestsMutateService } from './post-interests-mutate-service'

// Models
const batchJobModel = new BatchJobModel()
const entityInterestModel = new EntityInterestModel()
const interestTypeModel = new InterestTypeModel()
const siteTopicEntityInterestGroupModel = new SiteTopicEntityInterestGroupModel()
const siteTopicModel = new SiteTopicModel()

// Services
const agentLlmService = new AgentLlmService()
const entityInterestService = new EntityInterestService()
const getTechService = new GetTechService()
const interestGroupService = new InterestGroupService()
const postInterestsMutateService = new PostInterestsMutateService()
const usersService = new UsersService()

// Class
export class SiteTopicInterestsMutateService {

  // Consts
  clName = 'SiteTopicInterestsMutateService'

  // Code
  async createAllMissingStarterInterests(
          prisma: PrismaClient,
          userProfileId: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.createAllMissingStarterInterests()`

    // console.log(`${fnName}: starting with userProfileId: ${userProfileId}`)

    // Get admin user if no userProfileId specified
    if (userProfileId == null) {

      const adminUserProfile = await
        usersService.getOrCreateUserByEmail(
          prisma,
          ServerTestTypes.adminUserEmail,
          undefined)  // defaultUserPreferences

      if (adminUserProfile == null) {
        throw new CustomError(`${fnName}: adminUserProfile == null`)
      }

      userProfileId = adminUserProfile.id
    }

    // Validate
    if (userProfileId == null) {
      throw new CustomError(`${fnName}: userProfileId == null`)
    }

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
              siteTopic.id)
    }
  }

  async createStarterInterestGroups(
          prisma: PrismaClient,
          userProfileId: string,
          siteTopicId: string) {

    // Debug
    const fnName = `${this.clName}.createStarterInterestGroups()`

    // Get tech
    const tech = await
            getTechService.getStandardLlmTech(prisma)

    // Get SiteTopic
    const siteTopic = await
            siteTopicModel.getById(
              prisma,
              siteTopicId)

    // Validate
    if (siteTopic == null) {
      throw new CustomError(`${fnName}: siteTopic == null`)
    }

    // Get InterestTypes
    const interestTypes = await
            interestTypeModel.filter(prisma)

    if (interestTypes == null) {
      throw new CustomError(`${fnName}: interestTypes == null`)
    }

    // Get EntityInterests
    const entityInterests = await
            entityInterestModel.filter(
              prisma,
              undefined,  // interestTypeId
              undefined,  // qlooEntityId
              undefined,  // status
              siteTopicId,
              false)      // includeInterestTypes

    if (entityInterests == null) {
      throw new CustomError(`${fnName}: entityInterests == null`)
    }

    // No need to run if 5+ interests exist for the SiteTopic
    if (entityInterests.length >= 5) {
      return {
        status: true
      }
    }

    // Debug
    console.log(`${fnName}: siteTopic: ` + JSON.stringify(siteTopic))
    console.log(`${fnName}: entityInterests: ` + JSON.stringify(entityInterests))
    console.log(`${fnName}: interestTypes: ` + JSON.stringify(interestTypes))

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
          `Interest types: ` + JSON.stringify(interestTypes) + `\n` +
          `\n` +
          `An example:\n` +
          `[\n` +
          `  {\n` +
          `    "interestTypeId": "..",\n` +
          `    "interestName": ".."\n` +
          `  }\n` +
          `]\n`

    // LLM request tries
    var queryResults: any = undefined

    for (var i = 0; i < 5; i++) {

      // LLM request
      queryResults = await
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

      // Verify interestTypeIds
      const interestTypeIdsExist = await
              postInterestsMutateService.verifyInterestTypeIds(
                prisma,
                queryResults.json)

      if (interestTypeIdsExist.status === false) {
        continue
      }

      // Passed validation
      break
    }

    // Validate
    if (queryResults == null) {

      console.log(`${fnName}: queryResults == null`)

      return {
        status: false,
        message: `${fnName}: queryResults == null`
      }
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

    if (batchJob.refId == null) {
      throw new CustomError(`${fnName}: batchJob.refId == null`)
    }

    // Call the main function
    const results = await
            this.createStarterInterestGroups(
              prisma,
              batchJob.userProfileId,
              batchJob.refId)

    // Set BatchJob to completed
    await batchJobModel.update(
            prisma,
            batchJob.id,
            undefined,  // instanceId,
            undefined,  // runInATransaction
            BatchTypes.completedBatchJobStatus,
            100,        // progressPct
            null)       // message

    // Return
    return results
  }

  async processQueryResults(
          prisma: PrismaClient,
          siteTopicId: string,
          queryResults: any) {

    // Debug
    const fnName = `${this.clName}.createStarterInterestGroups()`

    // console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

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

      // Validate interestTypeId exists
      const interestType = await
              interestTypeModel.getById(
                prisma,
                interest.interestTypeId)

      if (interestType == null) {
        throw new CustomError(`${fnName}: InterestType not found for id: ` +
                              `${interest.interestTypeId}`)
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
      return {
        status: true
      }
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

    // Return OK
    return {
      status: true
    }
  }
}
