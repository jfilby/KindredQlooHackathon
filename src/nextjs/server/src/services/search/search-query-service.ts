import { PrismaClient } from '@prisma/client'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { SearchQueryModel } from '@/models/search/search-query-model'
import { GetTechService } from '../tech/get-tech-service'

// Models
const searchQueryModel = new SearchQueryModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()

// Class
export class SearchQueryService {

  // Consts
  clName = 'SearchQueryService'

  // Code
  async search(
          prisma: PrismaClient,
          userProfile: any,
          query: string) {

    // Debug
    const fnName = `${this.clName}.search()`

    // If the userProfileId if the user is signed-in only
    var userProfileIdIfSignedIn: string | null = null

    if (userProfile.user != null) {
      userProfileIdIfSignedIn = userProfile.id
    }

    // Format the query
    query = query.trim().toLowerCase()

    // Upsert the query
    const searchQuery = await
            searchQueryModel.upsert(
              prisma,
              undefined,  // id
              userProfile.id,
              query)

    // Get the LLM
    const tech = await
            getTechService.getStandardLlmTech(
              prisma,
              userProfile.id)

    // Debug
    // console.log(`${fnName}: tech: ` + JSON.stringify(tech))

    // Define the prompt
    const prompt =
            `You must use your knowledge base as a discovery engine to \n` +
            `generate concept graphs based on a query.\n` +
            `\n` +
            `How to decide what to generate:\n` +
            `- If the query is ambiguous then return results for all ` +
            `possible concepts.\n` +
            `- If the query is specific then return concepts for the ` +
            `topic.\n` +
            `\n` +
            `Return 10 results for the query: ${query}\n` +
            `\n` +
            `The results must be in JSON, based on this example:\n` +
            `{\n` +
            `  "title": "Notion",\n` +
            `  "specifically": "productivity software"\n` +
            `  "graph: [\n` +
            `    {\n` +
            `      "id": "about",\n` +
            `      "title": "About",\n` +
            `      "specifically": "about notion",\n` +
            `      "relatedIds": [ "examples" ]\n` +
            `    },\n` +
            `    {\n` +
            `      "id": "examples",\n` +
            `      "title": "Examples",\n` +
            `      "specifically": "examples of using notion",\n` +
            `      "relatedIds": [ "about" ]\n` +
            `    }\n` +
            `  ]\n` +
            `}\n` +
            `\n` +
            `Notes:\n` +
            `- The title and specifically fields must be 80 chars at most.\n`

    // LLM requests
    const queryResults = await
            agentLlmService.agentSingleShotLlmRequest(
              prisma,
              tech,
              userProfile.id,
              null,       // instanceId
              ServerOnlyTypes.defaultChatSettingsName,
              BaseDataTypes.batchAgentRefId,
              BaseDataTypes.batchAgentName,
              BaseDataTypes.batchAgentRole,
              prompt,
              true)       // isJsonMode

    // Debug
    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))
  }
}
