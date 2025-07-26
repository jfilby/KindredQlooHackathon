import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'

// Code
export async function loadServerStartData(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `loadServerStartData()`

  // console.log(`${fnName}: args: ` + JSON.stringify(args))
  // console.log(`${fnName}: loading instance..`)

  // Load chat session
  var chatSession: any = undefined

  /* if (args.loadChatSession === true &&
      (args.chatSessionId != null ||
       args.chatSettingsName != null)) {

    // Debug
    console.log(`${fnName}: loading chat session..`)

    // Load chat session
    var chatSessionResults: any = null

    await prisma.$transaction(async (transactionPrisma: any) => {

      try {
        chatSessionResults = await
          instanceChatsService.getOrCreateChatSession(
            transactionPrisma,
            args.instanceId,
            args.userProfileId,
            args.chatSessionId,
            null,  // externalIntegration
            null,  // externalId
            args.chatSettingsName,
            args.agentId,
            args.domainId,
            chatSessionOptions)
      } catch (error) {
        if (error instanceof CustomError) {
          return {
            status: false,
            message: error.message
          }
        } else {
          return {
            status: false,
            message: `Unexpected error: ${error}`
          }
        }
      }
    })

    // Debug
    // console.log(`${fnName}: chatSessionResults: ` +
    //             JSON.stringify(chatSessionResults))

    // Handle chatSessionResults
    if (chatSessionResults.status === false) {
      return chatSessionResults
    }

    chatSession = chatSessionResults.chatSession
  } */

  // Debug
  console.log(`${fnName}: returning OK..`)

  // Return
  return {
    status: true,
    chatSession: chatSession
  }
}
