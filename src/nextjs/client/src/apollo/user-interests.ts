import { gql } from '@apollo/client'

export const getUserInterestsQuery = gql`
  query getUserInterests($userProfileId: String!) {
    getUserInterests(userProfileId: $userProfileId) {

      status
      message
      userEntityInterests {
        id
        userProfileId
        entityInterest {
          id
          interestType {
            id
            name
          }
          name
        }
      }
      userInterestsText
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
