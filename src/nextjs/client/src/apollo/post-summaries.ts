import { gql } from '@apollo/client'

export const getPostSummariesQuery = gql`
  query getPostSummaries(
          $userProfileId: String!,
          $siteTopicListId: String!) {
    getPostSummaries(
      userProfileId: $userProfileId,
      siteTopicListId: $siteTopicListId) {

      status
      message
      postSummary {
        id
        postId
        userProfileId
        status
        text
        updated
      }
    }
  }
`
