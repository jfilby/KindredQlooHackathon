import { gql } from '@apollo/client'

export const upsertUserSiteTopicMutation = gql`
  mutation upsertUserSiteTopic(
             $userProfileId: String!,
             $siteTopicId: String!,
             $rankBy: String!) {
    upsertUserSiteTopic(
      userProfileId: $userProfileId,
      siteTopicId: $siteTopicId,
      rankBy: $rankBy) {

      status
      message
    }
  }
`
