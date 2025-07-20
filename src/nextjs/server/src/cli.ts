// Load the env file
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` })

// Requires/imports
import { prisma } from './db'
import { TechProviderMutateService } from '@/serene-core-server/services/tech/tech-provider-mutate-service'
import { UsersService } from '@/serene-core-server/services/users/service'
import { GenTestUsersMutateService } from './services/tribes/gen-test-users-mutate-service'
import { HackerNewAlgoliaTestsService } from './services/social-media/site-specific/hn-algolia-service-tests'
import { PostUrlsService } from './services/social-media/post-urls/post-urls-service'
import { ServerTestTypes } from './types/server-test-types'
// import { SearchQueryServiceTests } from '../archive/models/search/search/search-query-service-tests'
import { SetupService } from './setup/setup'
import { SummarizePostMutateService } from './services/social-media/summarized-posts/mutate-service'
import { SummarizePostUrlService } from './services/social-media/summarized-post-urls/service'
import { Tests } from './services/tests/tests'

// Main batch
(async () => {

  // Debug
  const fnName = 'cli.ts'

  // Consts
  const importFromHnCommand = 'import-from-hn'
  const genTestUserCommand = 'gen-test-user'
  const getPostUrlsCommand = 'get-post-urls'
  const loadTechProviderApiKeysCommand = 'load-tech-provider-api-keys'
  // const searchCommand = 'search'
  const setupCommand = 'setup'
  const summarizePostsCommand = 'summarize-posts'
  const summarizePostUrlsCommand = 'summarize-post-urls'
  const testCommand = 'test'

  const commands = [
          importFromHnCommand,
          genTestUserCommand,
          getPostUrlsCommand,
          loadTechProviderApiKeysCommand,
          // searchCommand,
          setupCommand,
          summarizePostsCommand,
          summarizePostUrlsCommand,
          testCommand
        ]

  // Test to run
  const command = process.argv[2]

  console.log(`${fnName}: comand to run: ${command}`)

  // Services
  const genTestUsersMutateService = new GenTestUsersMutateService()
  const hackerNewAlgoliaTestsService = new HackerNewAlgoliaTestsService()
  const postUrlsService = new PostUrlsService()
  // const searchQueryServiceTests = new SearchQueryServiceTests()
  const setupService = new SetupService()
  const summarizePostMutateService = new SummarizePostMutateService()
  const summarizePostUrlService = new SummarizePostUrlService()
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

  // Get/create a regular (non-admin) user for the anonymous reader
  const anonUserProfile = await
          usersService.getOrCreateUserByEmail(
            prisma,
            ServerTestTypes.anonUserEmail,
            undefined)  // defaultUserPreferences

  // Run the chosen command
  switch (command) {

    case genTestUserCommand: {

      await genTestUsersMutateService.generateUserInTransaction(
              prisma,
              adminUserProfile.id)

      break
    }

    case importFromHnCommand: {

      await hackerNewAlgoliaTestsService.run(prisma)

      break
    }

    case getPostUrlsCommand: {

      await postUrlsService.getPending(prisma)

      break
    }

    case loadTechProviderApiKeysCommand: {

      await techProviderMutateService.cliLoadJsonStr(prisma)

      break
    }

    /* case searchCommand: {

      await searchQueryServiceTests.testInputSearch(
              prisma,
              regularTestUserProfile)

      break
    } */

    case setupCommand: {

      await setupService.run(
              prisma,
              adminUserProfile)

      break
    }

    case summarizePostsCommand: {

      await summarizePostMutateService.run(
              prisma,
              adminUserProfile.id,
              anonUserProfile.id)

      break
    }

    case summarizePostUrlsCommand: {

      await summarizePostUrlService.run(
              prisma,
              adminUserProfile.id,
              anonUserProfile.id)

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
