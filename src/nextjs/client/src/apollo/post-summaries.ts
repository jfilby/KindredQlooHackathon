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
        postId
        userProfileId
        status
        socialMediaUrl
        postSummary
        insights {
          name
          description
          commentsCount
        }
        otherComments
        updated
        post {
          site {
            name
          }
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
