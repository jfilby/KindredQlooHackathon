import { Prisma } from '@prisma/client'
import { ChatSettingsModel } from '@/serene-core-server/models/chat/chat-settings-model'
import { ChatSessionService } from '@/serene-ai-server/services/chats/sessions/chat-session-service'
import { CustomError } from '@/serene-core-server/types/errors'

// Models
const chatSettingsModel = new ChatSettingsModel()

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
          chatSessionOptions: any) {

    // Debug
    const fnName = `${this.clName}.getOrCreateChatSession()`

    console.log(`${fnName}: starting with chatSettingsName: ` +
                `${chatSettingsName}`)

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
      console.log(`${fnName}: returning with existing chatSession..`)

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
      postSummaryId: postSummaryId
    }

    // Debug
    console.log(`${fnName}: creating chatSession..`)

    // Determine the name of the chat session
    var name = `Talk about postSummaryId: ${postSummaryId} with user: ` +
               `${userProfileId}`

    // Get the prompt
    const prompt = await
            this.getPrompt(
              prisma,
              userProfileId,
              postSummaryId)

    // Debug
    console.log(`${fnName}: creating ChatSession..`)

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
    console.log(`${fnName}: created chatSession: ` +
                JSON.stringify(chatSessionResults.chatSession))

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
          postSummaryId: string) {

    return ''
  }
}
