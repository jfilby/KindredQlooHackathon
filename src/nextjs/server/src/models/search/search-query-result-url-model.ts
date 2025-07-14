import { PrismaClient } from '@prisma/client'

export class SearchQueryResultUrlModel {

  // Consts
  clName = 'SearchQueryResultUrlModel'

  // Code
  async create(
          prisma: PrismaClient,
          searchQueryResultId: string,
          urlId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.searchQueryResultUrl.create({
        data: {
          searchQueryResultId: searchQueryResultId,
          urlId: urlId
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
      return await prisma.searchQueryResultUrl.delete({
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
    var searchQueryResultUrl: any = null

    try {
      searchQueryResultUrl = await prisma.searchQueryResultUrl.findUnique({
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
    return searchQueryResultUrl
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.searchQueryResultUrl.findMany({
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
          searchQueryResultId: string,
          urlId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (searchQueryResultId == null) {
      console.error(`${fnName}: userProfileId == null`)
      throw 'Validation error'
    }

    if (urlId == null) {
      console.error(`${fnName}: urlId == null`)
      throw 'Validation error'
    }

    // Query
    var searchQueryResultUrl: any = null

    try {
      searchQueryResultUrl = await prisma.searchQueryResultUrl.findFirst({
        where: {
          searchQueryResultId: searchQueryResultId,
          urlId: urlId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return searchQueryResultUrl
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          searchQueryResultId: string | undefined,
          urlId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.searchQueryResultUrl.update({
        data: {
          searchQueryResultId: searchQueryResultId,
          urlId: urlId
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
          searchQueryResultId: string | undefined,
          urlId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        searchQueryResultId != null &&
        urlId != null) {

      const searchQueryResultUrl = await
              this.getByUniqueKey(
                prisma,
                searchQueryResultId,
                urlId)

      if (searchQueryResultUrl != null) {
        id = searchQueryResultUrl.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (searchQueryResultId == null) {
        console.error(`${fnName}: id is null and searchQueryResultId is null`)
        throw 'Prisma error'
      }

      if (urlId == null) {
        console.error(`${fnName}: id is null and urlId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 searchQueryResultId,
                 urlId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 searchQueryResultId,
                 urlId)
    }
  }
}
