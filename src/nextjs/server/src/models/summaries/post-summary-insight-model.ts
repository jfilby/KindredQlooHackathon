import { PrismaClient } from '@prisma/client'

export class PostSummaryInsightModel {

  // Consts
  clName = 'PostSummaryInsightModel'

  // Code
  async create(
          prisma: PrismaClient,
          postSummaryId: string,
          index: number,
          name: string,
          description: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postSummaryInsight.create({
        data: {
          postSummaryId: postSummaryId,
          index: index,
          name: name,
          description: description
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
      return await prisma.postSummaryInsight.delete({
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
    var postSummaryInsight: any = null

    try {
      postSummaryInsight = await prisma.postSummaryInsight.findUnique({
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
    return postSummaryInsight
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.postSummaryInsight.findMany({
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
          postSummaryId: string,
          index: number) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (postSummaryId == null) {
      console.error(`${fnName}: postSummaryId == null`)
      throw 'Validation error'
    }

    if (index == null) {
      console.error(`${fnName}: index == null`)
      throw 'Validation error'
    }

    // Query
    var postSummaryInsight: any = null

    try {
      postSummaryInsight = await prisma.postSummaryInsight.findFirst({
        where: {
          postSummaryId: postSummaryId,
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
    return postSummaryInsight
  }

  async update(
          prisma: PrismaClient,
          id: string,
          postSummaryId: string | undefined,
          index: number | undefined,
          name: string | undefined,
          description: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postSummaryInsight.update({
        data: {
          postSummaryId: postSummaryId,
          index: index,
          name: name,
          description: description
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
          postSummaryId: string | undefined,
          index: number | undefined,
          name: string | undefined,
          description: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        postSummaryId != null &&
        index != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                postSummaryId,
                index)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (postSummaryId == null) {
        console.error(`${fnName}: id is null and postSummaryId is null`)
        throw 'Prisma error'
      }

      if (index == null) {
        console.error(`${fnName}: id is null and index is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (description == null) {
        console.error(`${fnName}: id is null and description is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 postSummaryId,
                 index,
                 name,
                 description)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postSummaryId,
                 index,
                 name,
                 description)
    }
  }
}
