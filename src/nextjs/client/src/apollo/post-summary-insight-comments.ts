import { gql } from '@apollo/client'

export const getPostSummaryInsightCommentsQuery = gql`
  query getPostSummaryInsightComments(
          $postSummaryInsightId: String!) {
    getPostSummaryInsightComments(
      postSummaryInsightId: $postSummaryInsightId) {

      status
      message
      postSummaryInsightComments {
        id
        comment {
          id
          url
          text
        }
      }
    }
  }
`
