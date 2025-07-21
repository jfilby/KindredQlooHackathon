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
          postSummary: string | null,
          topComments: any | null,
          topCommentsString: string | null,
          otherComments: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postSummary.create({
        data: {
          postId: postId,
          userProfileId: userProfileId,
          status: status,
          postSummary: postSummary,
          topComments: topComments,
          topCommentsString: topCommentsString,
          otherComments: otherComments
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
          postSummary: string | null | undefined,
          topComments: any | null | undefined,
          topCommentsString: string | null | undefined,
          otherComments: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postSummary.update({
        data: {
          postId: postId,
          userProfileId: userProfileId,
          status: status,
          postSummary: postSummary,
          topComments: topComments,
          topCommentsString: topCommentsString,
          otherComments: otherComments
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
          postSummary: string | null | undefined,
          topComments: any | null | undefined,
          topCommentsString: string | null | undefined,
          otherComments: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

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

      if (postSummary === undefined) {
        console.error(`${fnName}: id is null and postSummary is undefined`)
        throw 'Prisma error'
      }

      if (topComments === undefined) {
        console.error(`${fnName}: id is null and topComments is undefined`)
        throw 'Prisma error'
      }

      if (topCommentsString === undefined) {
        console.error(`${fnName}: id is null and topCommentsString is undefined`)
        throw 'Prisma error'
      }

      if (otherComments === undefined) {
        console.error(`${fnName}: id is null and otherComments is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 postId,
                 userProfileId,
                 status,
                 postSummary,
                 topComments,
                 topCommentsString,
                 otherComments)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postId,
                 userProfileId,
                 status,
                 postSummary,
                 topComments,
                 topCommentsString,
                 otherComments)
    }
  }
}
