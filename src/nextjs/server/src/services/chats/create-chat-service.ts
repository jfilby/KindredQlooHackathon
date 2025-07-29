import { Prisma } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { ChatSessionService } from '@/serene-ai-server/services/chats/sessions/chat-session-service'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { SiteModel } from '@/models/social-media/site-model'
import { SiteTopicListPostModel } from '@/models/social-media/site-topic-list-post-model'

// Models
const chatSettingsModel = new ChatSettingsModel()
const postSummaryModel = new PostSummaryModel()
const siteModel = new SiteModel()
const siteTopicListPostModel = new SiteTopicListPostModel()

// Services
const chatSessionService = new ChatSessionService()

// Class
export class CreateChatSessionService {

  // Debug
  clName = 'CreateChatSessionService'

  // Code
  async getOrCreateChatSession(
          prisma: Prisma.TransactionClient,
          instanceId: string | null,
          userProfileId: string,
          chatSessionId: string,
          externalIntegration: string | null,
          externalId: string | null,
          chatSettingsName: string,
          agentId: string,
          postSummaryId: string,
          siteTopicListId: string,
          chatSessionOptions: any) {

    // Debug
    const fnName = `${this.clName}.getOrCreateChatSession()`

    // console.log(`${fnName}: starting with chatSettingsName: ` +
    //             `${chatSettingsName}`)

    // Get ChatSettings
    const chatSettings = await
            chatSettingsModel.getByName(
              prisma,
              chatSettingsName)

    // Validate
    if (chatSettings == null) {
      throw new CustomError(`${fnName}: chatSettings == null`)
    }

    // Get InstanceChat and related records
    if (chatSessionId != null) {

      const chatSessionResults = await
              chatSessionService.getChatSessionById(
                prisma,
                chatSessionId,
                userProfileId)

      // Debug
      // console.log(`${fnName}: returning with existing chatSession..`)

      // Formulate return var
      var chatSession = chatSessionResults.chatSession

      // Return
      return {
        status: true,
        chatSession: chatSession
      }
    }

    // If an agent is specified then create a new ChatSettings record
    var appCustom: any = {
      postSummaryId: postSummaryId,
      siteTopicListId: siteTopicListId
    }

    // Debug
    // console.log(`${fnName}: creating chatSession..`)

    // Determine the name of the chat session
    var name = `Talk about postSummaryId: ${postSummaryId} with user: ` +
               `${userProfileId}`

    // Get the prompt
    const prompt = await
            this.getPrompt(
              prisma,
              userProfileId,
              postSummaryId,
              siteTopicListId)

    // Debug
    // console.log(`${fnName}: creating ChatSession..`)

    // Create ChatSession
    const chatSessionResults = await
            chatSessionService.createChatSession(
              prisma,
              chatSettings.id,
              userProfileId,
              instanceId,
              chatSettings.isEncryptedAtRest,
              chatSettings.isJsonMode,
              prompt,
              appCustom,
              name,
              externalIntegration,
              externalId)

    // Debug
    // console.log(`${fnName}: created chatSession: ` +
    //             JSON.stringify(chatSessionResults.chatSession))

    // Formulate return var
    var chatSession = chatSessionResults.chatSession

    // Return
    return {
      status: true,
      chatSession: chatSession
    }
  }

  async getPrompt(
          prisma: Prisma.TransactionClient,
          userProfileId: string,
          postSummaryId: string | undefined,
          siteTopicListId: string | undefined): Promise<string> {

    // Debug
    const fnName = `${this.clName}.getPrompt()`

    // Initial prompt
    var prompt =
          `# Prompt\n` +
          `\n` +
          `## General instructions\n` +
          `\n` +
          `- You are Kindred, an AI that will talk to users to help them ` +
          `  understand social media posts and their comments.\n` +
          `- You must also take into account any linked story and what ` +
          `  it's about.\n` +
          `- Take on the personality of a top commenter of the social ` +
          `  media site.\n `

    // Get Site
    prompt += await
      this.getPromptForSite(prisma)

    // Get PostSummary
    if (postSummaryId != null) {

      prompt += await
        this.getPromptForPostSummary(
          prisma,
          postSummaryId)

    } else if (siteTopicListId != null) {

      prompt += await
        this.getPromptForSiteTopicList(
          prisma,
          siteTopicListId)
    }

    // Return
    return prompt
  }

  async getPromptForPostSummary(
          prisma: Prisma.TransactionClient,
          postSummaryId: string) {

    // Debug
    const fnName = `${this.clName}.getPromptForPostSummary()`

    // Get PostSummary and its details
    const postSummary = await
            postSummaryModel.getById(
              prisma,
              postSummaryId,
              true)  // includeDetails

    // Validate
    if (postSummary == null) {
      throw new CustomError(`${fnName}: postSummary == null`)
    }

    // Define prompt section
    const prompt =
            `## Post summary\n` +
            `\n` +
            `Post summary: ` + JSON.stringify(postSummary) +
            `\n`

    // Return
    return prompt
  }

  async getPromptForSite(prisma: Prisma.TransactionClient) {

    // Debug
    const fnName = `${this.clName}.getPromptForSite()`

    // Get Site
    const site = await
            siteModel.getByUniqueKey(
              prisma,
              ServerOnlyTypes.hnSiteName)

    // Validate
    if (site == null) {
      throw new CustomError(`${fnName}: site == null`)
    }

    // Define prompt section
    const prompt =
            `## Site\n` +
            `\n` +
            `Posts are from ${site.name}\n` +
            `\n`

    // Return
    return prompt
  }

  async getPromptForSiteTopicList(
          prisma: Prisma.TransactionClient,
          siteTopicListId: string) {

    // Debug
    const fnName = `${this.clName}.getPromptForSiteTopicList()`

    // Get posts for the listing
    const siteTopicListPosts = await
            siteTopicListPostModel.filter(
              prisma,
              siteTopicListId)

    // Validate
    if (siteTopicListPosts == null) {
      throw new CustomError(`${fnName}: siteTopicListPosts == null`)
    }

    // Get details for each PostSummary
    var prompt = ''

    for (const siteTopicListPost of siteTopicListPosts) {

      if (siteTopicListPost.postSummaryId != null) {

        prompt +=
          this.getPromptForPostSummary(
            prisma,
            siteTopicListPost.postSummaryId) +
          `\n`
      }
    }

    // Return
    return prompt
  }
}
