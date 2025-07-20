import { PrismaClient } from '@prisma/client'

export class UserInterestTextModel {

  // Consts
  clName = 'UserInterestTextModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          batchJobId: string,
          text: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.userInterestText.create({
        data: {
          userProfileId: userProfileId,
          batchJobId: batchJobId,
          text: text
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete
    try {
      return await prisma.userInterestText.delete({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async filter(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.userInterestText.findMany({
        where: {}
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var userInterestText: any = null

    try {
      userInterestText = await prisma.userInterestText.findUnique({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return userInterestText
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.userInterestText.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (userProfileId == null) {
      console.error(`${fnName}: userProfileId == null`)
      throw 'Validation error'
    }

    // Query
    var userInterestText: any = null

    try {
      userInterestText = await prisma.userInterestText.findFirst({
        where: {
          userProfileId: userProfileId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return userInterestText
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          batchJobId: string | undefined,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.userInterestText.update({
        data: {
          userProfileId: userProfileId,
          batchJobId: batchJobId,
          text: text
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async upsert(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          batchJobId: string | undefined,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null) {

      const userInterestText = await
              this.getByUniqueKey(
                prisma,
                userProfileId)

      if (userInterestText != null) {
        id = userInterestText.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
        throw 'Prisma error'
      }

      if (batchJobId == null) {
        console.error(`${fnName}: id is null and batchJobId is null`)
        throw 'Prisma error'
      }

      if (text == null) {
        console.error(`${fnName}: id is null and text is null`)
        throw 'Prisma error'
      }


      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 batchJobId,
                 text)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 batchJobId,
                 text)
    }
  }
}
