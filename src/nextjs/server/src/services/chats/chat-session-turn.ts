import { PrismaClient } from '@prisma/client'
import { UserProfileModel } from '@/serene-core-server/models/users/user-profile-model'
import { UsersService } from '@/serene-core-server/services/users/service'
import { ChatMessage } from '@/serene-ai-server/types/server-only-types'
import { ChatService } from '@/serene-ai-server/services/llm-apis/chat-service'
import { GetTechService } from '../tech/get-tech-service'

// Models
const userProfileModel = new UserProfileModel()

// Services
const chatService = new ChatService()
const getTechService = new GetTechService()
const usersService = new UsersService()

// Class
export class ChatSessionTurnService {

  // Consts
  clName = 'ChatSessionTurnService'

  // Code
  async turn(prisma: PrismaClient,
             userProfileId: string,
             chatSessionId: string,
             fromChatParticipantId: string,
             postSummaryId: string,
             fromContents: ChatMessage[]) {

    // Debug
    const fnName = `${this.clName}.turn()`

    // Get UserProfile
    const fromUserProfile = await
            userProfileModel.getById(
              prisma,
              userProfileId)

    // Get User
    const user = await
            usersService.getUserByUserProfileId(
              prisma,
              userProfileId)

    var fromName = 'User'

    if (user?.name != null) {
      fromName = user.name
    }

    // Get LLM tech
    const tech = await
            getTechService.getStandardLlmTech(prisma)

    // LLM call
    const chatMessageResults = await
            chatService.runSessionTurn(
              prisma,
              tech.id,
              chatSessionId,
              fromChatParticipantId,
              fromUserProfile,
              fromName,
              fromContents)

    // Debug
    console.log(`${fnName}: chatMessageResults: ` +
                JSON.stringify(chatMessageResults))

    // Convert to ChatMessage[]
    var aiChatMessages: ChatMessage[] = []

    for (const message of chatMessageResults.toContents) {

      aiChatMessages.push({
        type: '',
        text: message.text
      })
    }

    // Return
    return {
      chatSessionId: chatMessageResults.chatSessionId,
      sentByAi: true,
      chatParticipantId: chatMessageResults.chatParticipantId,
      name: chatMessageResults.toName,
      contents: aiChatMessages
    }
  }
}
