import { PrismaClient, User } from '@prisma/client'
import { UserModel } from '@/serene-core-server/models/users/user-model'
import { UsersService } from '@/serene-core-server/services/users/service'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { GetTechService } from '../llms/get-tech-service'

// Models
const userModel = new UserModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()
const usersService = new UsersService()

// Class
export class UsersGenMutateService {

  // Consts
  clName = 'UsersGenMutateService'

  // Code
  async generateUser(
          prisma: PrismaClient,
          adminUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.generateUser()`

    // LLM request to generate a user with initial interests
    var prompt =
          `# General instructions\n` +
          `Please generate 5 new users with various interests.\n` +
          `\n`

    // List all existing tester emails
    const testerEmails = await
            this.getTesterEmails(prisma)

    prompt +=
      `# Existing emails\n` +
      `Don't use an existing tester email: ` + JSON.stringify(testerEmails) +
      `\n\n`

    // Example
    prompt +=
      `\n` +
      `# Example\n` +
      `The example JSON follows:\n\n` +
      `[\n` +
      `  {\n` +
      `    "name": "John T Booker"\n` +
      `    "email": "tester-john.t.booker@aiconstrux.com",\n` +
      `    "interests": [\n` +
      `      {\n` +
      `        "books": [ "Snow Crash", "The Left Hand of Darkness" ],\n` +
      `        "movies": [ "Ghost in the Shell", "Children of Men" ],\n` +
      `        "music": [ "Boards of Canada", "Trent Reznor" ]\n` +
      `      }\n` +
      `    ]\n` +
      `  }\n` +
      `]\n`

    // Get the LLM
    const tech = await
            getTechService.getStandardLlmTech(
              prisma,
              adminUserProfileId)

    // LLM requests
    var queryResults: any = undefined

    for (var i = 0; i < 5; i++) {

      try {
        queryResults = await
          agentLlmService.agentSingleShotLlmRequest(
          prisma,
            tech,
            adminUserProfileId,
            null,       // instanceId
            ServerOnlyTypes.defaultChatSettingsName,
            BaseDataTypes.searchAgentRefId,
            BaseDataTypes.searchAgentName,
            BaseDataTypes.searchAgentRole,
            prompt,
            true,       // isEncryptedAtRest
            false,      // isJsonMode
            false)      // tryGetFromCache

      } catch(e: any) {
        console.log(`${fnName}: exception: ` + JSON.stringify(e))
      }

      if (queryResults != null) {
        break
      }
    }

    // Validate
    if (queryResults == null) {

      console.log(`${fnName}: queryResults == null after several tries`)
      return
    }

    // Debug
    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Process
    for (const userDetails of queryResults.messages) {

      // Get/create a test user
      const testerUserProfile = await
              usersService.getOrCreateUserByEmail(
                prisma,
                userDetails.email,
                undefined)  // defaultUserPreferences

      // Create interests
      ;
    }
  }

  async generateUsers(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.generateUsers()`

    // Generate users until enough are available
    ;
  }

  async getTesterEmails(prisma: PrismaClient) {

    // Get all users
    const users = await
            userModel.filter(prisma)

    // Filter out only tester emails
    const testerUsers = users.filter((user: User) => {
      user.email?.startsWith('tester-') &&
      user.email?.endsWith('@kindred.fit')
    })

    // Got only emails
    const testerEmails = testerUsers.map((user: User) => user.email)

    // Return
    return testerEmails
  }
}
