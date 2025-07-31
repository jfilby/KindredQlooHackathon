import { EntityInterest, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { BatchTypes } from '@/types/batch-types'
import { QlooEntityInsightsApiType } from '@/types/qloo-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { BatchJobModel } from '@/models/batch/batch-job-model'
import { EntityInterestItemModel } from '@/models/interests/entity-interest-item-model'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { UserEntityInterestGroupModel } from '@/models/interests/user-entity-interest-group-model'
import { UserInterestsTextModel } from '@/models/interests/user-interests-text-model'
import { EntityInterestService } from './entity-interest-service'
import { GetTechService } from '../tech/get-tech-service'
import { InterestGroupService } from './interest-group-service'

// Models
const batchJobModel = new BatchJobModel()
const entityInterestItemModel = new EntityInterestItemModel()
const entityInterestModel = new EntityInterestModel()
const interestTypeModel = new InterestTypeModel()
const userEntityInterestGroupModel = new UserEntityInterestGroupModel()
const userInterestsTextModel = new UserInterestsTextModel()

// Services
const agentLlmService = new AgentLlmService()
const entityInterestService = new EntityInterestService()
const getTechService = new GetTechService()
const interestGroupService = new InterestGroupService()

// Class
export class UserInterestsMutateService {

  // Consts
  clName = 'UserInterestsMutateService'

  // Code
  async processQueryResults(
          prisma: PrismaClient,
          userProfileId: string,
          queryResults: any) {

    // Debug
    const fnName = `${this.clName}.processQueryResults()`

    // console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Upsert user interests
    var entityInterestIds: string[] = []

    for (const interestsEntry of queryResults.json) {

      // Debug
      console.log(`${fnName}: interestsEntry: ` +
                  JSON.stringify(interestsEntry))

      // Iterate the interestsEntry map
      for (const interestTypeName in interestsEntry) {

        // Lookup the InterestType
        const interestType = await
                interestTypeModel.getByUniqueKey(
                  prisma,
                  interestTypeName)

        // Get interests
        const interests = interestsEntry[interestTypeName]

        // Debug
        console.log(`${fnName}: interestType: ${interestTypeName} - ` +
                    `interests: ` + JSON.stringify(interests))

        // Get/create EntityInterests and UserInterests
        for (const interest of interests) {

          // Get/create EntityInterest
          const entityInterest = await
                  entityInterestService.getOrCreate(
                    prisma,
                    interestType.id,
                    interest)

          // Add to entityInterestIds
          entityInterestIds.push(entityInterest.id)
        }
      }
    }

    // Get/create the UserEntityInterestGroup
    var userEntityInterestGroup = await
          userEntityInterestGroupModel.getByUniqueKey(
            prisma,
            userProfileId,
            ServerOnlyTypes.actualUserInterestType)

    if (userEntityInterestGroup == null) {

      userEntityInterestGroup = await
        userEntityInterestGroupModel.create(
          prisma,
          userProfileId,
          null,   // entityInterestGroupId
          ServerOnlyTypes.actualUserInterestType,
          true)  // reset
    }

    // Get/create interests group
    if (userEntityInterestGroup.reset === true) {

      // Debug
      console.log(`${fnName}: entityInterestIds: ` +
                  JSON.stringify(entityInterestIds))

      // Get/create
      const entityInterestGroup = await
              interestGroupService.getOrCreate(
                prisma,
                entityInterestIds)

      // Set for the user
      userEntityInterestGroup = await
        userEntityInterestGroupModel.update(
          prisma,
          userEntityInterestGroup.id,
          undefined,  // userProfileId
          entityInterestGroup.id,
          undefined,  // type
          false)      // reset
    }

    // Return
    return {
      status: true
    }
  }

  async processUpdatedUserInterestsText(
          prisma: PrismaClient,
          userProfileId: string,
          text: string) {

    // Debug
    const fnName = `${this.clName}.processUpdatedUserInterestsText()`

    // Get the existing UserInterestsText to verify that the text changed
    var userInterestsText = await
          userInterestsTextModel.getByUniqueKey(
            prisma,
            userProfileId)

    if (userInterestsText?.text != null) {

      if (userInterestsText.text.trim().toLowerCase() ===
          text.trim().toLowerCase()) {

        return
      }
    }

    // Upsert UserInterestsText
    userInterestsText = await
      userInterestsTextModel.upsert(
        prisma,
        undefined,  // id
        userProfileId,
        text)

    // Reset any recommended interests
    await this.resetUserEntityInterestsGroups(
            prisma,
            userProfileId)

    // Determine if a BatchJob has already been created
    const batchJobs = await
            batchJobModel.getByStatusesAndJobTypeAndRefModelAndRefId(
              prisma,
              null,  // instanceId
              [
                BatchTypes.newBatchJobStatus,
                BatchTypes.activeBatchJobStatus
              ],
              BatchTypes.createInterestsJobType,
              BatchTypes.userInterestsTextModel,
              userInterestsText.id)

    if (batchJobs.length === 0) {

      // Create a BatchJob to process the text
      // runInATransaction is true to prevent missing vital record processing
      const batchJob = await
              batchJobModel.upsert(
                prisma,
                undefined,  // id
                null,       // instanceId
                true,       // runInATransaction
                BatchTypes.newBatchJobStatus,
                0,          // progressPct
                null,       // message
                BatchTypes.createInterestsJobType,
                BatchTypes.userInterestsTextModel,
                userInterestsText.id,
                null,       // parameters
                null,       // results
                userProfileId)
    }
  }

  async resetUserEntityInterestsGroups(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.resetUserEntityInterestsGroups()`

    // Process each UserEntityInterestGroup
    var userEntityInterestGroups = await
          userEntityInterestGroupModel.filter(
            prisma,
            userProfileId,
            undefined,
            undefined,
            true)  // reset

    for (const userEntityInterestGroup of userEntityInterestGroups) {

      // Unset the entityInterestGroup
      await userEntityInterestGroupModel.update(
              prisma,
              userEntityInterestGroup.id,
              undefined,  // userProfileId
              undefined,  // entityInterestGroupId
              undefined,  // type
              true)       // reset
    }
  }

  async upsertUserInterestsByText(
          prisma: PrismaClient,
          userProfileId: string,
          text: string) {

    // Debug
    const fnName = `${this.clName}.upsertUserInterestsByText()`

    console.log(`${fnName}: starting..`)

    // Validate
    if (text == null) {
      throw new CustomError(`${fnName}: text == null`)
    }

    // Get the LLM
    const tech = await
            getTechService.getStandardLlmTech(
              prisma,
              userProfileId)

    // Debug
    // console.log(`${fnName}: tech: ` + JSON.stringify(tech))

    // Define the prompt
    var prompt =
          `# General instructions\n` +
          `- You must generate a list of interests grouped by interestType ` +
          `  from the input text.\n` +
          `- These will be the interests grouped by the listed interest ` +
          `  types.\n` +
          `- You must generate an entry for every individual interest in ` +
          `  the input text.\n` +
          `- Some items in the text could be abbreviated.\n` +
          `\n`

    // Get a list of interest types
    const allInterestTypes = await
            interestTypeModel.filter(prisma)

    // Filter out types not included in the Qloo Insights API
    const preferredInterestTypes =
            allInterestTypes.filter(
              (i: any) => Object.values(QlooEntityInsightsApiType).includes(i.qlooEntityType))

    // Debug
    // console.log(`${fnName}: interestTypes: ` +
    //             JSON.stringify(interestTypes))

    // Add interest types to the prompt
    prompt +=
      `# Interest types\n` +
      `The list of interest types: ` + JSON.stringify(allInterestTypes) + `\n` +
      `The list of preferred interest types: ` + JSON.stringify(preferredInterestTypes) + `\n` +
      `\n`

    // Add to the prompt
    prompt +=
      `# Interests\n` +
      `- The interest names are generated, the list of known interests here ` +
      `  are only to prevent slight variances that aren't helpful.\n\n`

    for (const interestType of allInterestTypes) {

      // Get a list of existing EntityInterests
      const entityInterests = await
              entityInterestModel.filter(
                prisma,
                interestType.id,
                undefined,  // qlooEntityId
                undefined,  // status
                undefined,  // siteTopicId
                true)       // includeInterestTypes

      const interests = entityInterests.map(
              (entityInterest: EntityInterest) => entityInterest.name)

      if (interests.length > 0) {
        prompt += `${interestType.name}: ${interests}\n`
      }
    }

    prompt += `\n`

    // Define the output
    prompt +=
      `# Results\n` +
      `- The results must be in an array.\n` +
      `- Only known interestTypes can be used. Interests should be reused ` +
      `  where they already exist, but add more if needed.\n` +
      `\n` +
      `The results should follow this JSON example:\n` +
      `\n` +
      `[\n` +
      `  {\n` +
      `    "<interestType>": [\n` +
      `      "<interest>",` +
      `    ]\n` +
      `  }\n` +
      `]\n` +
      `\n`

    // Finish the prompt with the input text
    prompt +=
      `# Input\n` +
      `The input text to process is: ` + text

    // Debug
    console.log(`${fnName}: prompt: ${prompt}`)

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
              userProfileId,
              queryResults)

    // Return
    return results
  }
}
