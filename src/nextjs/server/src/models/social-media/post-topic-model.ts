import { PrismaClient } from '@prisma/client'

export class PostTopicModel {

  // Consts
  clName = 'PostTopicModel'

  // Code
  async create(
          prisma: PrismaClient,
          postId: string,
          siteTopicId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postTopic.create({
        data: {
          postId: postId,
          siteTopicId: siteTopicId
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
      return await prisma.postTopic.delete({
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
    var postTopic: any = null

    try {
      postTopic = await prisma.postTopic.findUnique({
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
    return postTopic
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.postTopic.findMany({
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
          postId: string,
          siteTopicId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (postId == null) {
      console.error(`${fnName}: postId == null`)
      throw 'Validation error'
    }

    if (siteTopicId == null) {
      console.error(`${fnName}: siteTopicId == null`)
      throw 'Validation error'
    }

    // Query
    var postTopic: any = null

    try {
      postTopic = await prisma.postTopic.findFirst({
        where: {
          postId: postId,
          siteTopicId: siteTopicId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return postTopic
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          postId: string | undefined,
          siteTopicId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postTopic.update({
        data: {
          postId: postId,
          siteTopicId: siteTopicId
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
          siteTopicId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        postId != null &&
        siteTopicId != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                postId,
                siteTopicId)

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

      if (siteTopicId == null) {
        console.error(`${fnName}: id is null and siteTopicId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 postId,
                 siteTopicId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postId,
                 siteTopicId)
    }
  }
}
