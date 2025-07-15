import { PrismaClient } from '@prisma/client'

export class PostModel {

  // Consts
  clName = 'PostModel'

  // Code
  async create(
          prisma: PrismaClient,
          siteId: string,
          text: string,
          externalId: string | null,
          posted: Date) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.post.create({
        data: {
          siteId: siteId,
          text: text,
          externalId: externalId,
          posted: posted
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
      return await prisma.post.delete({
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
    var post: any = null

    try {
      post = await prisma.post.findUnique({
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
    return post
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.post.findMany({
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
          siteId: string,
          externalId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (siteId == null) {
      console.error(`${fnName}: siteId == null`)
      throw 'Validation error'
    }

    if (externalId == null) {
      console.error(`${fnName}: externalId == null`)
      throw 'Validation error'
    }

    // Query
    var post: any = null

    try {
      post = await prisma.post.findFirst({
        where: {
          siteId: siteId,
          externalId: externalId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return post
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          siteId: string | undefined,
          text: string | undefined,
          externalId: string | null | undefined,
          posted: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.post.update({
        data: {
          siteId: siteId,
          text: text,
          externalId: externalId,
          posted: posted
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
          siteId: string | undefined,
          text: string | undefined,
          externalId: string | null | undefined,
          posted: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        siteId != null &&
        externalId != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                siteId,
                externalId)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (siteId == null) {
        console.error(`${fnName}: id is null and siteId is null`)
        throw 'Prisma error'
      }

      if (text == null) {
        console.error(`${fnName}: id is null and text is null`)
        throw 'Prisma error'
      }

      if (externalId === undefined) {
        console.error(`${fnName}: id is null and externalId is externalId`)
        throw 'Prisma error'
      }

      if (posted == null) {
        console.error(`${fnName}: id is null and posted is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 siteId,
                 text,
                 externalId,
                 posted)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 siteId,
                 text,
                 externalId,
                 posted)
    }
  }
}
