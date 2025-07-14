import { PrismaClient } from '@prisma/client'

export class ResultUrlModel {

  // Consts
  clName = 'ResultUrlModel'

  // Code
  async create(
          prisma: PrismaClient,
          url: string,
          title: string,
          verifiedOk: boolean,
          lastPinged: Date | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.resultUrl.create({
        data: {
          url: url,
          title: title,
          verifiedOk: verifiedOk,
          lastPinged: lastPinged
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
      return await prisma.resultUrl.delete({
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
    var resultUrl: any = null

    try {
      resultUrl = await prisma.resultUrl.findUnique({
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
    return resultUrl
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.resultUrl.findMany({
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
    var resultUrl: any = null

    try {
      resultUrl = await prisma.resultUrl.findFirst({
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
    return resultUrl
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          url: string | undefined,
          title: string | undefined,
          verifiedOk: boolean | undefined,
          lastPinged: Date | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.resultUrl.update({
        data: {
          url: url,
          title: title,
          verifiedOk: verifiedOk,
          lastPinged: lastPinged
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
          title: string | undefined,
          verifiedOk: boolean | undefined,
          lastPinged: Date | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        url != null) {

      const resultUrl = await
              this.getByUniqueKey(
                prisma,
                url)

      if (resultUrl != null) {
        id = resultUrl.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (url == null) {
        console.error(`${fnName}: id is null and url is null`)
        throw 'Prisma error'
      }

      if (title == null) {
        console.error(`${fnName}: id is null and title is null`)
        throw 'Prisma error'
      }

      if (verifiedOk == null) {
        console.error(`${fnName}: id is null and verifiedOk is null`)
        throw 'Prisma error'
      }

      if (lastPinged === undefined) {
        console.error(`${fnName}: id is null and lastPinged is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 url,
                 title,
                 verifiedOk,
                 lastPinged)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 url,
                 title,
                 verifiedOk,
                 lastPinged)
    }
  }
}
