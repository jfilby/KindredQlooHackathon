import { PrismaClient, UserProfile } from '@prisma/client'
import { InterestsBatchServiceTests } from '../interests/batch-service-tests'
import { QlooTests } from '../qloo/tests'
import { UserInterestsMutateServiceTests } from '../interests/user-interests-mutate-service-tests'

// Services
const interestsBatchServiceTests = new InterestsBatchServiceTests()
const qlooTests = new QlooTests()
const userInterestsMutateServiceTests = new UserInterestsMutateServiceTests()

// Class
export class Tests {

  // Consts
  clName = 'Tests'

  interestsTests = 'interests'
  postSummaryTests = 'post-summary'
  qlooTests = 'qloo'
  upsertInterestsCommand = 'upsert-interests'

  tests = [
    this.interestsTests,
    this.postSummaryTests,
    this.qlooTests,
    this.upsertInterestsCommand
  ]

  // Code
  async run(prisma: PrismaClient,
            adminUserProfile: UserProfile,
            regularTestUserProfile: UserProfile,
            test: string) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Run the test
    switch (test) {

      case this.interestsTests: {

        await userInterestsMutateServiceTests.tests(
                prisma,
                regularTestUserProfile.id)

        break
      }

      case this.qlooTests: {

        await qlooTests.tests(
                prisma,
                adminUserProfile.id)

        break
      }

      case this.upsertInterestsCommand: {

        await interestsBatchServiceTests.testCreateInterests(prisma)
        break
      }

      default: {
        console.log(`${fnName}: invalid test: ${test}`)
        console.log(`${fnName}: available tests: ${this.tests}`)
      }
    }
  }
}
