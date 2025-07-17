import { PrismaClient } from '@prisma/client'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { UserInterestModel } from '@/models/interests/user-interest-model'
import { GetTechService } from '../llms/get-tech-service'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'

// Models
const entityInterestModel = new EntityInterestModel()
const userInterestModel = new UserInterestModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()

// Class
export class UserInterestsMutateService {

  // Consts
  clName = 'UserInterestsMutateService'

  // Code
  groupEntityInterestsByInterestTypes(entityInterests: any[]) {

    // Group by
    const groupedByInterestType = entityInterests.reduce((acc, entityInterest) => {

      const interestTypeName = entityInterest.interestType?.name ?? 'Unknown';

      if (!acc[interestTypeName]) {
        acc[interestTypeName] = []
      }

      acc[interestTypeName].push(entityInterest)
      return acc
    }, {} as Record<string, typeof entityInterests>)

    // Return
    return groupedByInterestType
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
          `Generate a list of EntityInterests from the input text.` +
          `\n`

    // Get a list of existing EntityInterests
    const entityInterests = await
            entityInterestModel.filter(
              prisma,
              undefined,  // interestTypeId
              true)       // includeInterestTypes

    // Group by interestTypes
    const entityInterestsByInterestType =
            this.groupEntityInterestsByInterestTypes(entityInterests)

    // Add to the prompt
    prompt +=
      `# Interests\n` +
      JSON.stringify(entityInterestsByInterestType)

    // Define the output
    prompt +=
      `# Results\n` +
      `The results should follow this JSON example:\n` +
      `\n` +
      `[\n` +
      `  {\n` +
      `    "<InterestType.name>": [\n` +
      `      "<EntityInterest.name>",` +
      `    ]\n` +
      `  }\n` +
      `]\n` +
      `\n`

    // Finish the prompt with the input text
    prompt +=
      `# Input\n` +
      `The input text is: ` + text

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

    // Debug
    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Return
    return {
      status: true
    }
  }
}
