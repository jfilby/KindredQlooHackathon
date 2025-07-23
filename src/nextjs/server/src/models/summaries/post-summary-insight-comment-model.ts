import { PrismaClient } from '@prisma/client'

export class PostSummaryInsightCommentModel {

  // Consts
  clName = 'PostSummaryInsightCommentModel'

  // Code
  async create(
          prisma: PrismaClient,
          postSummaryInsightId: string,
          commentId: string,
          index: number) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postSummaryInsightComment.create({
        data: {
          postSummaryInsightId: postSummaryInsightId,
          commentId: commentId,
          index: index
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
      return await prisma.postSummaryInsightComment.delete({
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

  async deleteByPostSummaryInsightId(
          prisma: PrismaClient,
          postSummaryInsightId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByPostSummaryInsightId()`

    // Delete
    try {
      return await prisma.postSummaryInsightComment.deleteMany({
        where: {
          postSummaryInsightId: postSummaryInsightId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async filter(
          prisma: PrismaClient,
          postSummaryInsightId: string,
          includeComments: boolean) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.postSummaryInsightComment.findMany({
        include: {
          comment: includeComments ? {
            include: {
              post: {
                include: {
                  site: true
                }
              }
            }
          } : undefined
        },
        where: {
          postSummaryInsightId: postSummaryInsightId
        },
        orderBy: {
          index: 'asc'
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
    var postSummaryInsightComment: any = null

    try {
      postSummaryInsightComment = await prisma.postSummaryInsightComment.findUnique({
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
    return postSummaryInsightComment
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.postSummaryInsightComment.findMany({
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
          postSummaryInsightId: string,
          commentId: string | undefined,
          index: number | undefined) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // console.log(
    //   `${fnName}: starting with postSummaryInsightId: ` +
    //   `${postSummaryInsightId} commentId: ${commentId} index: ${index}`)

    // Validate
    if (postSummaryInsightId == null) {
      console.error(`${fnName}: postSummaryInsightId == null`)
      throw 'Validation error'
    }

    if (commentId == null && index == null) {
      console.error(`${fnName}: commentId == null && index == null`)
      throw 'Validation error'
    }

    // Debug
    // console.log(`${fnName}: trying 1st unique key..`)

    // Query 1st unique key
    var postSummaryInsightComment: any = null

    try {
      postSummaryInsightComment = await prisma.postSummaryInsightComment.findFirst({
        where: {
          postSummaryInsightId: postSummaryInsightId,
          commentId: commentId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return if found
    if (postSummaryInsightComment != null) {
      return postSummaryInsightComment
    }

    // Debug
    // console.log(`${fnName}: trying 2nd unique key..`)

    // Query 2nd unique key
    try {
      postSummaryInsightComment = await prisma.postSummaryInsightComment.findFirst({
        where: {
          postSummaryInsightId: postSummaryInsightId,
          index: index
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return postSummaryInsightComment
  }

  async update(
          prisma: PrismaClient,
          id: string,
          postSummaryInsightId: string | undefined,
          commentId: string | undefined,
          index: number | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postSummaryInsightComment.update({
        data: {
          postSummaryInsightId: postSummaryInsightId,
          commentId: commentId,
          index: index
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
          postSummaryInsightId: string | undefined,
          commentId: string | undefined,
          index: number | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(
    //   `${fnName}: starting with postSummaryInsightId: ` +
    //   `${postSummaryInsightId} commentId: ${commentId} index: ${index}`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        postSummaryInsightId != null &&
        (commentId != null ||
         index != null)) {

      const postSummaryInsightComment = await
              this.getByUniqueKey(
                prisma,
                postSummaryInsightId,
                commentId,
                index)

      if (postSummaryInsightComment != null) {
        id = postSummaryInsightComment.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (postSummaryInsightId == null) {
        console.error(`${fnName}: id is null and postSummaryInsightId is null`)
        throw 'Prisma error'
      }

      if (commentId == null) {
        console.error(`${fnName}: id is null and commentId is null`)
        throw 'Prisma error'
      }

      if (index == null) {
        console.error(`${fnName}: id is null and index is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 postSummaryInsightId,
                 commentId,
                 index)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postSummaryInsightId,
                 commentId,
                 index)
    }
  }
}
