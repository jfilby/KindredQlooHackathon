import { Prisma } from '@prisma/client'

export class SiteTopicListPostModel {

  // Consts
  clName = 'SiteTopicListPostModel'

  // Code
  async create(
          prisma: Prisma.TransactionClient,
          siteTopicListId: string,
          postId: string,
          postSummaryId: string | null,
          index: number) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.siteTopicListPost.create({
        data: {
          siteTopicListId: siteTopicListId,
          postId: postId,
          postSummaryId: postSummaryId,
          index: index
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteById(
          prisma: Prisma.TransactionClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.deleteById()`

    // Delete
    try {
      return await prisma.siteTopicListPost.delete({
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

  async filter(
          prisma: Prisma.TransactionClient,
          siteTopicListId: string,
          includePosts: boolean = false,
          includePostSummaries: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.siteTopicListPost.findMany({
        include: {
          post: includePosts,
          postSummary: includePostSummaries
        },
        where: {
          siteTopicListId: siteTopicListId
        },
        orderBy: [
          {
            index: 'asc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getById(
          prisma: Prisma.TransactionClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var siteTopicListPost: any = null

    try {
      siteTopicListPost = await prisma.siteTopicListPost.findUnique({
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
    return siteTopicListPost
  }

  async getByIds(
          prisma: Prisma.TransactionClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.siteTopicListPost.findMany({
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
          prisma: Prisma.TransactionClient,
          siteTopicListId: string,
          index: number) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (siteTopicListId == null) {
      console.error(`${fnName}: siteTopicListId == null`)
      throw 'Validation error'
    }

    if (index == null) {
      console.error(`${fnName}: index == null`)
      throw 'Validation error'
    }

    // Query
    var siteTopicListPost: any = null

    try {
      siteTopicListPost = await prisma.siteTopicListPost.findFirst({
        where: {
          siteTopicListId: siteTopicListId,
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
    return siteTopicListPost
  }

  async update(
          prisma: Prisma.TransactionClient,
          id: string | undefined,
          siteTopicListId: string | undefined,
          postId: string | undefined,
          postSummaryId: string | null | undefined,
          index: number | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.siteTopicListPost.update({
        data: {
          siteTopicListId: siteTopicListId,
          postId: postId,
          postSummaryId: postSummaryId,
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
          prisma: Prisma.TransactionClient,
          id: string | undefined,
          siteTopicListId: string | undefined,
          postId: string | undefined,
          postSummaryId: string | null | undefined,
          index: number | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        siteTopicListId != null &&
        index != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                siteTopicListId,
                index)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (siteTopicListId == null) {
        console.error(`${fnName}: id is null and siteTopicListId is null`)
        throw 'Prisma error'
      }

      if (postId == null) {
        console.error(`${fnName}: id is null and postId is null`)
        throw 'Prisma error'
      }

      if (postSummaryId == undefined) {
        console.error(`${fnName}: id is null and postSummaryId is undefined`)
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
                 siteTopicListId,
                 postId,
                 postSummaryId,
                 index)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 siteTopicListId,
                 postId,
                 postSummaryId,
                 index)
    }
  }
}
