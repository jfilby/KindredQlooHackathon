import { PrismaClient, UserProfile } from '@prisma/client'
import { AgentUserModel } from '@/serene-ai-server/models/agents/agent-user-model'
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
const agentUserModel = new AgentUserModel()
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

    // Debug
    console.log(`${fnName}: upserting ChatSettings record with ` +
                `userProfileId: ${userProfileId}`)

    // Upsert AgentUser records
    await agentUserService.setup(prisma)

    // Upsert ChatSetting records
    for (const chatSetting of ServerOnlyTypes.chatSettings) {

      // Get the tech and agent for the chat settings
      const agentUser = await
              agentUserModel.getByUniqueRefId(
                prisma,
                chatSetting.agentUniqueRef)

      // Upsert ChatSettings
      await chatSettingsModel.upsert(
              prisma,
              undefined,  // id
              null,       // baseChatSettingsId
              BaseDataTypes.activeStatus,
              true,       // isEncryptedAtRest
              true,       // isJsonMode
              true,       // isPinned
              chatSetting.name,
              agentUser.id,
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
