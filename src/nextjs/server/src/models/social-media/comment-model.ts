import { PrismaClient } from '@prisma/client'

export class CommentModel {

  // Consts
  clName = 'CommentModel'

  // Code
  async create(
          prisma: PrismaClient,
          parentId: string | null,
          postId: string,
          externalId: string | null,
          text: string,
          posted: Date) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.comment.create({
        data: {
          parentId: parentId,
          postId: postId,
          externalId: externalId,
          text: text,
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
      return await prisma.comment.delete({
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

  async existsById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.existsById()`

    // Query
    var comment: any = null

    try {
      comment = await prisma.comment.findFirst({
        select: {
          id: true
        },
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
    if (comment != null) {
      return true
    } else {
      return false
    }
  }

  async filter(
          prisma: PrismaClient,
          postId: string) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.comment.findMany({
        where: {
          postId: postId
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
    var comment: any = null

    try {
      comment = await prisma.comment.findUnique({
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
    return comment
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.comment.findMany({
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
          externalId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (postId == null) {
      console.error(`${fnName}: postId == null`)
      throw 'Validation error'
    }

    if (externalId == null) {
      console.error(`${fnName}: externalId == null`)
      throw 'Validation error'
    }

    // Query
    var comment: any = null

    try {
      comment = await prisma.comment.findFirst({
        where: {
          postId: postId,
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
    return comment
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          parentId: string | null | undefined,
          postId: string | undefined,
          externalId: string | null | undefined,
          text: string | undefined,
          posted: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.comment.update({
        data: {
          parentId: parentId,
          postId: postId,
          externalId: externalId,
          text: text,
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
          parentId: string | null | undefined,
          postId: string | undefined,
          externalId: string | null | undefined,
          text: string | undefined,
          posted: Date | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        postId != null &&
        externalId != null) {

      const comment = await
              this.getByUniqueKey(
                prisma,
                postId,
                externalId)

      if (comment != null) {
        id = comment.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (parentId === undefined) {
        console.error(`${fnName}: id is null and parentId is undefined`)
        throw 'Prisma error'
      }

      if (postId == null) {
        console.error(`${fnName}: id is null and postId is null`)
        throw 'Prisma error'
      }

      if (externalId === undefined) {
        console.error(`${fnName}: id is null and externalId is undefined`)
        throw 'Prisma error'
      }

      if (text == null) {
        console.error(`${fnName}: id is null and text is null`)
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
                 parentId,
                 postId,
                 externalId,
                 text,
                 posted)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 parentId,
                 postId,
                 externalId,
                 text,
                 posted)
    }
  }
}
