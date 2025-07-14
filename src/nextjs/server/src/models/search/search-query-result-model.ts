import { PrismaClient } from '@prisma/client'

export class SearchQueryResultModel {

  // Consts
  clName = 'SearchQueryResultModel'

  // Code
  async create(
          prisma: PrismaClient,
          searchQueryId: string,
          index: number,
          title: string,
          description: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.searchQueryResult.create({
        data: {
          searchQueryId: searchQueryId,
          index: index,
          title: title,
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
      return await prisma.searchQueryResult.delete({
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
    var searchQueryResult: any = null

    try {
      searchQueryResult = await prisma.searchQueryResult.findUnique({
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
    return searchQueryResult
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.searchQueryResult.findMany({
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
          searchQueryId: string,
          title: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (searchQueryId == null) {
      console.error(`${fnName}: searchQueryId == null`)
      throw 'Validation error'
    }

    if (title == null) {
      console.error(`${fnName}: title == null`)
      throw 'Validation error'
    }

    // Query
    var searchQueryResult: any = null

    try {
      searchQueryResult = await prisma.searchQueryResult.findFirst({
        where: {
          searchQueryId: searchQueryId,
          title: title
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return searchQueryResult
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          searchQueryId: string | undefined,
          index: number | undefined,
          title: string | undefined,
          description: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.searchQueryResult.update({
        data: {
          searchQueryId: searchQueryId,
          index: index,
          title: title,
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
          searchQueryId: string | undefined,
          index: number | undefined,
          title: string | undefined,
          description: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        searchQueryId != null &&
        title != null) {

      const searchQueryResult = await
              this.getByUniqueKey(
                prisma,
                searchQueryId,
                title)

      if (searchQueryResult != null) {
        id = searchQueryResult.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (searchQueryId == null) {
        console.error(`${fnName}: id is null and searchQueryId is null`)
        throw 'Prisma error'
      }

      if (title == null) {
        console.error(`${fnName}: id is null and title is null`)
        throw 'Prisma error'
      }

      if (index == null) {
        console.error(`${fnName}: id is null and index is null`)
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
                 searchQueryId,
                 index,
                 title,
                 description)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 searchQueryId,
                 index,
                 title,
                 description)
    }
  }
}
