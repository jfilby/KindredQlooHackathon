import { PrismaClient, UserProfile } from '@prisma/client'
import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { SereneAiSetup } from '@/serene-ai-server/services/setup/setup-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { AgentUserService } from '@/services/agents/agent-user-service'
import { QlooSetupService } from '@/services/qloo/qloo-setup-service'
import { SocialMediaSetupService } from '@/social-media/setup-service'

// Services
const agentUserService = new AgentUserService()
const chatSettingsModel = new ChatSettingsModel()
const qlooSetupService = new QlooSetupService()
const sereneAiSetup = new SereneAiSetup()
const socialMediaSetupService = new SocialMediaSetupService()

// Class
export class SetupService {

  // Consts
  clName = 'SetupService'

  // Code
  async chatSettingsSetup(
          prisma: any,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.chatSettingsSetup()`

    // Get the tech and agent for the chat settings
    const agentUserResults = await
            agentUserService.getDefaultAgentUserForChatSettings(prisma)

    // Debug
    console.log(`${fnName}: upserting ChatSettings record with ` +
                `userProfileId: ${userProfileId}`)

    // Upsert ChatSetting record
    for (const chatSettingsName of ServerOnlyTypes.chatSettingsNames) {

      await chatSettingsModel.upsert(
              prisma,
              undefined,  // id
              null,       // baseChatSettingsId
              BaseDataTypes.activeStatus,
              true,       // isEncryptedAtRest
              true,       // isJsonMode
              true,       // isPinned
              chatSettingsName,
              agentUserResults.agentUser.id,
              null,       // prompt
              null,       // appCustom
              userProfileId)
    }
  }

  async run(prisma: PrismaClient,
            adminUserProfile: UserProfile) {

    // Chat settings names
    await this.chatSettingsSetup(
            prisma,
            adminUserProfile.id)

    // Serene AI setup
    await sereneAiSetup.setup(
            prisma,
            adminUserProfile.id)

    // Qloo setup
    await qlooSetupService.run(
            prisma,
            adminUserProfile)

    // Social media setup
    await socialMediaSetupService.setup(prisma)
  }
}
