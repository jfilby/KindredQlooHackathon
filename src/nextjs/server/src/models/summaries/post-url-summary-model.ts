import { PrismaClient } from '@prisma/client'

export class PostUrlSummaryModel {

  // Consts
  clName = 'PostUrlSummaryModel'

  // Code
  async create(
          prisma: PrismaClient,
          postUrlId: string,
          userProfileId: string,
          status: string,
          text: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postUrlSummary.create({
        data: {
          postUrlId: postUrlId,
          userProfileId: userProfileId,
          status: status,
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
      return await prisma.postUrlSummary.delete({
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

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var postUrlSummary: any = null

    try {
      postUrlSummary = await prisma.postUrlSummary.findUnique({
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
    return postUrlSummary
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.postUrlSummary.findMany({
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
          postUrlId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (postUrlId == null) {
      console.error(`${fnName}: postUrlId == null`)
      throw 'Validation error'
    }

    // Query
    var postUrlSummary: any = null

    try {
      postUrlSummary = await prisma.postUrlSummary.findFirst({
        where: {
          postUrlId: postUrlId,
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
    return postUrlSummary
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          postUrlId: string | undefined,
          userProfileId: string | undefined,
          status: string | undefined,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postUrlSummary.update({
        data: {
          postUrlId: postUrlId,
          userProfileId: userProfileId,
          status: status,
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
          postUrlId: string | undefined,
          userProfileId: string | undefined,
          status: string | undefined,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        postUrlId != null &&
        userProfileId != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                postUrlId,
                userProfileId)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (postUrlId == null) {
        console.error(`${fnName}: id is null and postUrlId is null`)
        throw 'Prisma error'
      }

      if (userProfileId === undefined) {
        console.error(`${fnName}: id is null and userProfileId is undefined`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
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
                 postUrlId,
                 userProfileId,
                 status,
                 text)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postUrlId,
                 userProfileId,
                 status,
                 text)
    }
  }
}
