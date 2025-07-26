import { gql } from '@apollo/client'

export const loadServerStartDataMutation = gql`
  mutation loadServerStartData(
             $userProfileId: String!,
             $loadChatSession: Boolean,
             $chatSessionId: String,
             $chatSettingsName: String) {
    loadServerStartData(
      userProfileId: $userProfileId,
      loadChatSession: $loadChatSession,
      chatSessionId: $chatSessionId,
      chatSettingsName: $chatSettingsName) {

      status
      message
      chatSession {
        id
        status
        chatParticipants {
          id
          userProfileId
        }
      }
    }
  }
`
