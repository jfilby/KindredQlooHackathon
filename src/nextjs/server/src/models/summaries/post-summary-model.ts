import { Prisma } from '@prisma/client'

export class PostSummaryModel {

  // Consts
  clName = 'PostSummaryModel'

  // Code
  async create(
          prisma: Prisma.TransactionClient,
          postId: string,
          userProfileId: string,
          techId: string,
          status: string,
          postSummary: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postSummary.create({
        data: {
          postId: postId,
          userProfileId: userProfileId,
          techId: techId,
          status: status,
          postSummary: postSummary
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
          prisma: Prisma.TransactionClient,
          id: string,
          includeDetails: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var postSummary: any = null

    try {
      postSummary = await prisma.postSummary.findUnique({
        include: includeDetails ? {
          post: {
            include: {
              postUrl: true,
              site: true
            }
          },
          ofPostSummaryInsights: {
            include: {
              _count: {
                select: {
                  ofPostSummaryInsightComments: true
                }
              }
            },
            orderBy: [
              {
                index: 'asc'
              }
            ]
          },
        } : undefined,
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
          prisma: Prisma.TransactionClient,
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
          prisma: Prisma.TransactionClient,
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
              postUrl: true,
              site: true
            }
          },
          ofPostSummaryInsights: {
            include: {
              _count: {
                select: {
                  ofPostSummaryInsightComments: true
                }
              }
            },
            orderBy: [
              {
                index: 'asc'
              }
            ]
          },
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

    // Error
    return []
  }

  async getByUniqueKey(
          prisma: Prisma.TransactionClient,
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
          prisma: Prisma.TransactionClient,
          id: string,
          postId: string | undefined,
          userProfileId: string | undefined,
          techId: string | undefined,
          status: string | undefined,
          postSummary: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postSummary.update({
        data: {
          postId: postId,
          userProfileId: userProfileId,
          techId: techId,
          status: status,
          postSummary: postSummary
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
          postId: string | undefined,
          userProfileId: string | undefined,
          techId: string | undefined,
          status: string | undefined,
          postSummary: string | null | undefined) {

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

      if (techId === undefined) {
        console.error(`${fnName}: id is null and techId is undefined`)
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

      // Create
      return await
               this.create(
                 prisma,
                 postId,
                 userProfileId,
                 techId,
                 status,
                 postSummary)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postId,
                 userProfileId,
                 techId,
                 status,
                 postSummary)
    }
  }
}
