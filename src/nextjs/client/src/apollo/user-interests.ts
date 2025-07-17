import { gql } from '@apollo/client'

export const getUserInterestsQuery = gql`
  query getUserInterests($userProfileId: String!) {
    getUserInterests(userProfileId: $userProfileId) {

      status
      message
      userInterests {
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
    }
  }
`
