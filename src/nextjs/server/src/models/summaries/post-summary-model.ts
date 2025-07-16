import { PrismaClient } from '@prisma/client'

export class PostSummaryModel {

  // Consts
  clName = 'PostSummaryModel'

  // Code
  async create(
          prisma: PrismaClient,
          postId: string,
          userProfileId: string,
          status: string,
          text: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postSummary.create({
        data: {
          postId: postId,
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
      return await prisma.postSummary.delete({
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
    var postSummary: any = null

    try {
      postSummary = await prisma.postSummary.findUnique({
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
    return postSummary
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.postSummary.findMany({
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

  async getByPostIdsAndUserProfileId(
          prisma: PrismaClient,
          postIds: string[],
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByPostIdsAndUserProfileId()`

    // Query
    try {
      return await prisma.postSummary.findMany({
        include: {
          post: {
            include: {
              postUrl: true
            }
          }
        },
        where: {
          postId: {
            in: postIds
          },
          userProfileId: userProfileId
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
          postId: string,
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (postId == null) {
      console.error(`${fnName}: postId == null`)
      throw 'Validation error'
    }

    // Query
    var postSummary: any = null

    try {
      postSummary = await prisma.postSummary.findFirst({
        where: {
          postId: postId,
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
    return postSummary
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          postId: string | undefined,
          userProfileId: string | undefined,
          status: string | undefined,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postSummary.update({
        data: {
          postId: postId,
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
          postId: string | undefined,
          userProfileId: string | undefined,
          status: string | undefined,
          text: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        postId != null &&
        userProfileId != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                postId,
                userProfileId)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (postId == null) {
        console.error(`${fnName}: id is null and postId is null`)
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
                 postId,
                 userProfileId,
                 status,
                 text)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postId,
                 userProfileId,
                 status,
                 text)
    }
  }
}
