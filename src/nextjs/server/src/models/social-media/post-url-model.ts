import { PrismaClient } from '@prisma/client'

export class PostUrlModel {

  // Consts
  clName = 'PostUrlModel'

  // Code
  async create(
          prisma: PrismaClient,
          url: string,
          status: string,
          title: string | null,
          text: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postUrl.create({
        data: {
          url: url,
          status: status,
          title: title,
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
      return await prisma.postUrl.delete({
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
          prisma: PrismaClient,
          status: string) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.postUrl.findMany({
        where: {
          status: status
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
    var postUrl: any = null

    try {
      postUrl = await prisma.postUrl.findUnique({
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
    return postUrl
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.postUrl.findMany({
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
          url: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (url == null) {
      console.error(`${fnName}: url == null`)
      throw 'Validation error'
    }

    // Query
    var postUrl: any = null

    try {
      postUrl = await prisma.postUrl.findFirst({
        where: {
          url: url
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return postUrl
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          url: string | undefined,
          status: string | undefined,
          title: string | null | undefined,
          text: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postUrl.update({
        data: {
          url: url,
          status: status,
          title: title,
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
          url: string | undefined,
          status: string | undefined,
          title: string | null | undefined,
          text: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        url != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                url)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (url == null) {
        console.error(`${fnName}: id is null and url is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (title === undefined) {
        console.error(`${fnName}: id is null and title is undefined`)
        throw 'Prisma error'
      }

      if (text === undefined) {
        console.error(`${fnName}: id is null and text is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 url,
                 status,
                 title,
                 text)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 url,
                 status,
                 title,
                 text)
    }
  }
}
