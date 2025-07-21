import { PrismaClient, UserProfile } from '@prisma/client'
import { QlooTests } from '../qloo/tests'
import { SummarizePostUtilsServiceTests } from '../social-media/summarized-posts/utils-service-tests'
import { UserInterestsMutateServiceTests } from '../interests/user-interests-mutate-service-tests'

// Services
const qlooTests = new QlooTests()
const summarizePostUtilsServiceTests = new SummarizePostUtilsServiceTests()
const userInterestsMutateServiceTests = new UserInterestsMutateServiceTests()

// Class
export class Tests {

  // Consts
  clName = 'Tests'

  interestsTests = 'interests'
  postSummaryTests = 'post-summary'
  qlooTests = 'qloo'

  tests = [
    this.interestsTests,
    this.postSummaryTests,
    this.qlooTests
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

      case this.postSummaryTests: {

        await summarizePostUtilsServiceTests.tests()

        break
      }

      case this.qlooTests: {

        await qlooTests.tests(prisma)
        break
      }

      default: {
        console.log(`${fnName}: invalid test: ${test}`)
        console.log(`${fnName}: available tests: ${this.tests}`)
      }
    }
  }
}
