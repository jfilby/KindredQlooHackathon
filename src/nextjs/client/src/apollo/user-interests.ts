import { gql } from '@apollo/client'

export const getUserInterestsQuery = gql`
  query getUserInterests(
          $userProfileId: String!) {
    getUserInterests(
      userProfileId: $userProfileId) {

      status
      message
      userInterestsText {
        id
        text
      }
    }
  }
`

export const upsertUserInterestsTextMutation = gql`
  mutation upsertUserInterestsByText(
             $userProfileId: String!,
             $text: String!) {
    upsertUserInterestsByText(
      userProfileId: $userProfileId,
      text: $text) {

      status
      message
    }
  }
`
