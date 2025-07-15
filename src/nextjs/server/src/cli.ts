// Load the env file
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` })

// Requires/imports
import { prisma } from './db'
import { TechProviderMutateService } from '@/serene-core-server/services/tech/tech-provider-mutate-service'
import { UsersService } from '@/serene-core-server/services/users/service'
import { HackerNewAlgoliaTestsService } from './social-media/site-specific/hn-algolia-service-tests'
import { ServerTestTypes } from './types/server-test-types'
import { SearchQueryServiceTests } from './services/search/search-query-service-tests'
import { SetupService } from './setup/setup'
import { Tests } from './services/tests/tests'

// Main batch
(async () => {

  // Debug
  const fnName = 'cli.ts'

  // Consts
  const importFromHnCommand = 'import-from-hn'
  const loadTechProviderApiKeysCommand = 'load-tech-provider-api-keys'
  const searchCommand = 'search'
  const setupCommand = 'setup'
  const testCommand = 'test'

  const commands = [
          importFromHnCommand,
          loadTechProviderApiKeysCommand,
          searchCommand,
          setupCommand,
          testCommand
        ]

  // Test to run
  const command = process.argv[2]

  console.log(`${fnName}: comand to run: ${command}`)

  // Services
  const hackerNewAlgoliaTestsService = new HackerNewAlgoliaTestsService()
  const searchQueryServiceTests = new SearchQueryServiceTests()
  const setupService = new SetupService()
  const techProviderMutateService = new TechProviderMutateService()
  const tests = new Tests()
  const usersService = new UsersService()

  // Get admin user that created the instance
  const adminUserProfile = await
          usersService.getOrCreateUserByEmail(
            prisma,
            ServerTestTypes.adminUserEmail,
            undefined)  // defaultUserPreferences

  // Get/create a regular (non-admin) user
  const regularTestUserProfile = await
          usersService.getOrCreateUserByEmail(
            prisma,
            ServerTestTypes.regularTestUserEmail,
            undefined)  // defaultUserPreferences

  // Run the chosen command
  switch (command) {

    case importFromHnCommand: {

      await hackerNewAlgoliaTestsService.run(prisma)

      break
    }

    case loadTechProviderApiKeysCommand: {

      await techProviderMutateService.cliLoadJsonStr(prisma)

      break
    }

    case searchCommand: {

      await searchQueryServiceTests.testInputSearch(
              prisma,
              regularTestUserProfile)

      break
    }

    case setupCommand: {

      await setupService.run(
              prisma,
              adminUserProfile)

      break
    }

    case testCommand: {

      await tests.run(
              prisma,
              adminUserProfile,
              regularTestUserProfile,
              process.argv[3])

      break
    }

    default: {
      console.log(`${fnName}: invalid command, selection is: ` +
                  JSON.stringify(commands))

      await prisma.$disconnect()
      process.exit(1)
    }
  }

  // Done
  await prisma.$disconnect()
  process.exit(0)
})()
