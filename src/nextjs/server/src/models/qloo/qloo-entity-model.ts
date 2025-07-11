import { PrismaClient } from '@prisma/client'

export class QlooEntityModel {

  // Consts
  clName = 'QlooEntityModel'

  // Code
  async create(
          prisma: PrismaClient,
          isTrending: boolean,
          name: string,
          keywords: string[],
          json: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.qlooEntity.create({
        data: {
          isTrending: isTrending,
          name: name,
          keywords: keywords,
          json: json
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
      return await prisma.qlooEntity.delete({
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
          isTrending: boolean | undefined,
          keywords: string[] | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.qlooEntity.findMany({
        where: {
          isTrending: isTrending,
          keywords: keywords ? {
            hasEvery: keywords
          } : undefined
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var qlooEntity: any = null

    try {
      qlooEntity = await prisma.qlooEntity.findUnique({
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
    return qlooEntity
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.qlooEntity.findMany({
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
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var qlooEntity: any = null

    try {
      qlooEntity = await prisma.qlooEntity.findFirst({
        where: {
          name: name
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return qlooEntity
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          isTrending: boolean | undefined,
          name: string | undefined,
          keywords: string[] | undefined,
          json: any | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.qlooEntity.update({
        data: {
          isTrending: isTrending,
          name: name,
          keywords: keywords,
          json: json
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
          isTrending: boolean | undefined,
          name: string | undefined,
          keywords: string[] | undefined,
          json: any | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        name != null) {

      const qlooEntity = await
              this.getByUniqueKey(
                prisma,
                name)

      if (qlooEntity != null) {
        id = qlooEntity.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (isTrending == null) {
        console.error(`${fnName}: id is null and isTrending is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (keywords == null) {
        console.error(`${fnName}: id is null and keywords is null`)
        throw 'Prisma error'
      }

      if (json == null) {
        console.error(`${fnName}: id is null and json is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 isTrending,
                 name,
                 keywords,
                 json)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 isTrending,
                 name,
                 keywords,
                 json)
    }
  }
}
