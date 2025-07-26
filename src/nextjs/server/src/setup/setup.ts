import { PrismaClient, UserProfile } from '@prisma/client'
import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { FeatureFlagModel } from '@/serene-core-server/models/feature-flags/feature-flag-model'
import { SereneAiSetup } from '@/serene-ai-server/services/setup/setup-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { AgentUserService } from '@/services/agents/agent-user-service'
import { InterestsSetupService } from '@/services/interests/setup-service'
import { QlooSetupService } from '@/services/qloo/qloo-setup-service'
import { SocialMediaSetupService } from '@/services/social-media/setup-service'

// Models
const featureFlagModel = new FeatureFlagModel()

// Services
const agentUserService = new AgentUserService()
const chatSettingsModel = new ChatSettingsModel()
const interestsSetupService = new InterestsSetupService()
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

  async featureFlags(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.featureFlags()`

    // Add feature flags
    await featureFlagModel.upsert(
            prisma,
            undefined,  // id
            null,       // userProfileId
            null,       // instanceId
            ServerOnlyTypes.socialMediaBatchPipelineFeatureFlag,
            true)       // enabled
  }

  async run(prisma: PrismaClient,
            adminUserProfile: UserProfile) {

    // Debug
    const fnName = `${this.clName}.run()`

    // console.log(`${fnName}: starting..`)

    // Feature flags
    await this.featureFlags(prisma)

    // Chat settings names
    await this.chatSettingsSetup(
            prisma,
            adminUserProfile.id)

    // Serene AI setup
    await sereneAiSetup.setup(
            prisma,
            adminUserProfile.id)

    // Qloo setup
    await qlooSetupService.setup(
            prisma,
            adminUserProfile)

    // Interests setup
    await interestsSetupService.setup(
            prisma,
            adminUserProfile.id)

    // Social media setup
    await socialMediaSetupService.setup(
            prisma,
            adminUserProfile.id)
  }
}
