import { gql } from '@apollo/client'

export const getChatMessagesQuery = gql`
  query getChatMessages(
          $chatSessionId: String,
          $userProfileId: String!,
          $lastMessageId: String) {
    getChatMessages(
      chatSessionId: $chatSessionId,
      userProfileId: $userProfileId,
      lastMessageId: $lastMessageId) {

      status
      message
      chatMessages {
        id
        name
        message
        created
        updated
      }
    }
  }
`
