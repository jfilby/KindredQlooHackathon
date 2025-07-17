import { gql } from '@apollo/client'

export const getPostSummariesQuery = gql`
  query getPostSummaries(
          $userProfileId: String!,
          $siteTopicListId: String) {
    getPostSummaries(
      userProfileId: $userProfileId,
      siteTopicListId: $siteTopicListId) {

      status
      message
      postSummaries {
        id
        site {
          name
        }
        postId
        userProfileId
        status
        socialMediaUrl
        postSummary
        topComments
        otherComments
        updated
        post {
          title
          posted
          postUrl {
            url
          }
        }
      }
    }
  }
`
