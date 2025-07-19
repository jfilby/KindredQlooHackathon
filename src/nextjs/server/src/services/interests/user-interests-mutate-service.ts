import { EntityInterest, InterestType, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { UserInterestModel } from '@/models/interests/user-interest-model'
import { GetTechService } from '../tech/get-tech-service'

// Models
const entityInterestModel = new EntityInterestModel()
const interestTypeModel = new InterestTypeModel()
const userInterestModel = new UserInterestModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()

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

    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Upsert user interests
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
          var entityInterest = await
                entityInterestModel.getByUniqueKey(
                  prisma,
                  interestType.id,
                  interest)

          if (entityInterest == null) {

            entityInterest = await
              entityInterestModel.create(
                prisma,
                interestType.id,
                null,       // qlooEntityId
                null,       // siteTopicId
                interest)
          }

          // Get/create UserInterest
          var userInterest = await
                userInterestModel.getByUniqueKey(
                  prisma,
                  userProfileId,
                  entityInterest.id)

          if (userInterest == null) {

            userInterest = await
              userInterestModel.create(
                prisma,
                userProfileId,
                entityInterest.id)
          }
        }
      }
    }

    // Return
    return {
      status: true
    }
  }

  async upsertUserInterestsByText(
          prisma: PrismaClient,
          userProfileId: string,
          text: string) {

    // Debug
    const fnName = `${this.clName}.upsertUserInterestsByText()`

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
          `- These will be the interests grouped by interest type. Don't ` +
          `  generate an empty list if there are valid interests in the ` +
          `  text.\n` +
          `- Some items in the text could be abbreviated.\n` +
          `\n`

    // Get a list of interest types
    const interestTypes = await
            interestTypeModel.filter(prisma)

    const interestTypeNames = interestTypes.map(
            (interestTypeRecord: InterestType) => interestTypeRecord.name)

    // Add interest types to the prompt
    prompt +=
      `# Interest types\n` +
      `The list of interest types: ` + JSON.stringify(interestTypes) +
      `\n\n`

    // Add to the prompt
    prompt +=
      `# Interests\n` +
      `Here are a list of known interests by interestType:\n`

    for (const interestType of interestTypes) {

      // Get a list of existing EntityInterests
      const entityInterests = await
              entityInterestModel.filter(
                prisma,
                interestType.id,
                true)  // includeInterestTypes

      const interests = entityInterests.map(
              (entityInterest: EntityInterest) => entityInterest.name)

      prompt += `${interestType.name}: ${interests}\n`
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
