import { PrismaClient, User } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { UserModel } from '@/serene-core-server/models/users/user-model'
import { UsersService } from '@/serene-core-server/services/users/service'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { QlooEntityCategory } from '@/types/qloo-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { UserEntityInterestModel } from '@/models/interests/user-entity-interest-model'
import { GetTechService } from '../llms/get-tech-service'

// Models
const entityInterestModel = new EntityInterestModel()
const interestTypeModel = new InterestTypeModel()
const userEntityInterestModel = new UserEntityInterestModel()
const userModel = new UserModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()
const usersService = new UsersService()

// Class
export class GenTestUsersMutateService {

  // Consts
  clName = 'GenTestUsersMutateService'

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

    // Add types
    prompt +=
      `# Interest types\n` +
      `Each interest belongs to a type (category). Here are the available ` +
      `types: ` + JSON.stringify(QlooEntityCategory) + `\n\n`

    // Example
    prompt +=
      `\n` +
      `# Example\n` +
      `The example JSON follows:\n\n` +
      `[\n` +
      `  {\n` +
      `    "name": "John T Booker"\n` +
      `    "email": "tester-john.t.booker@aiconstrux.com",\n` +
      `    "interests": {\n` +
      `      "urn:entity:books": [ "Snow Crash", "The Left Hand of Darkness" ],\n` +
      `      "urn:entity:movies": [ "Ghost in the Shell", "Children of Men" ],\n` +
      `      "urn:entity:music": [ "Boards of Canada", "Trent Reznor" ]\n` +
      `    }\n` +
      `  }\n` +
      `]\n`

    // Get the LLM
    const tech = await
            getTechService.getStandardLlmTech(
              prisma,
              adminUserProfileId)

    // LLM requests
    const queryResults = await
            agentLlmService.agentSingleShotLlmRequest(
              prisma,
              tech,
              adminUserProfileId,
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

    if (queryResults.json == null) {

      console.log(`${fnName}: queryResults.json == null`)
      return
    }

    // Debug
    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Process
    for (const userDetails of queryResults.json) {

      // Validate email
      if (userDetails.email == null) {
        throw new CustomError(`${fnName}: userDetails.email == null`)
      }

      // Get/create a test user
      const testerUserProfile = await
              usersService.getOrCreateUserByEmail(
                prisma,
                userDetails.email,
                undefined)  // defaultUserPreferences

      // Debug
      console.log(`${fnName}: userDetails.interests: ` +
                  JSON.stringify(userDetails.interests))

      // Create interests
      for (const [entityType, interests] of
             Object.entries(userDetails.interests)) {

        // Debug
        console.log(`${fnName}: entityType: ${entityType} interests: ` +
                    `${interests}`)

        // Get InterestType
        const interestType = await
                interestTypeModel.getByQlooEntityType(
                  prisma,
                  entityType)

        // Validate
        if (interestType == null) {

          throw new CustomError(
                      `${fnName}: interestType == null for entityType: ` +
                      entityType)
        }

        // Upsert entity interests
        for (const interest of interests as string[]) {

          const entityInterest = await
                  entityInterestModel.upsert(
                    prisma,
                    undefined,  // id
                    interestType.id,
                    null,       // qlooEntityId
                    interest)   // name

          const userEntityInterest = await
                  userEntityInterestModel.upsert(
                    prisma,
                    undefined,  // id
                    testerUserProfile.id,
                    entityInterest.id)
        }
      }
    }
  }

  async generateUserInTransaction(
          prisma: PrismaClient,
          adminUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.generateUserInTransaction()`

    // Transaction
    await prisma.$transaction(async (transactionPrisma: any) => {

      // Generate user
      await this.generateUser(
              transactionPrisma,
              adminUserProfileId)
    },
    {
      maxWait: 5 * 60000, // default: 5m
      timeout: 5 * 60000, // default: 5m
    })
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
