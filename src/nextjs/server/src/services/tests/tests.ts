import { PrismaClient, UserProfile } from '@prisma/client'
import { QlooTests } from '../qloo/tests'

export class Tests {

  // Consts
  clName = 'Tests'

  qlooTest = 'qloo'

  tests = [
    this.qlooTest
  ]

  // Services
  qlooTests = new QlooTests()

  // Code
  async run(prisma: PrismaClient,
            adminUserProfile: UserProfile,
            regularTestUserProfile: UserProfile,
            test: string) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Run the test
    switch (test) {

      case this.qlooTest: {

        await this.qlooTests.tests(prisma)
        break
      }

      default: {
        console.log(`${fnName}: invalid test: ${test}`)
        console.log(`${fnName}: available tests: ${this.tests}`)
      }
    }
  }
}
