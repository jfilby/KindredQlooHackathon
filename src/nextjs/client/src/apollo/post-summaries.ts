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
      siteTopicListId
      postSummaries {
        id
        postId
        userProfileId
        status
        socialMediaUrl
        postSummary
        insights {
          id
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

export const getPostSummaryQuery = gql`
  query getPostSummary(
          $userProfileId: String!,
          $id: String) {
    getPostSummary(
      userProfileId: $userProfileId,
      id: $id) {

      status
      message
      postSummary {
        id
        postId
        userProfileId
        status
        socialMediaUrl
        postSummary
        insights {
          id
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

export const getTimeToNextListingQuery = gql`
  query getTimeToNextListing(
          $siteTopicListId: String!) {
    getTimeToNextListing(
      siteTopicListId: $siteTopicListId) {

      status
      message
      overdueOrReady
      waitTime
    }
  }
`
