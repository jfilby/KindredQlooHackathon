// Load the env file
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` })

// Requires/imports
import { prisma } from './db'
import { UsersService } from '@/serene-core-server/services/users/service'
import { ServerTestTypes } from './types/server-test-types'
import { SetupService } from './setup/setup'
import { Tests } from './services/tests/tests'

// Main batch
(async () => {

  // Debug
  const fnName = 'cli.ts'

  // Consts
  const setupCommand = 'setup'
  const testCommand = 'test'

  const commands = [
          setupCommand,
          testCommand
        ]

  // Test to run
  const command = process.argv[2]

  console.log(`${fnName}: comand to run: ${command}`)

  // Services
  const setupService = new SetupService()
  const tests = new Tests()
  const usersService = new UsersService()

  // Get admin user that created the instance
  const adminUserProfile = await
          usersService.getUserProfileByEmail(
            prisma,
            ServerTestTypes.adminUserEmail)

  // Get/create a regular (non-admin) user
  const regularTestUserProfile = await
          usersService.getOrCreateUserByEmail(
            prisma,
            ServerTestTypes.regularTestUserEmail,
            undefined)  // defaultUserPreferences

  // Run the chosen command
  switch (command) {

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
    }
  }

  // Done
  await prisma.$disconnect()
})()
