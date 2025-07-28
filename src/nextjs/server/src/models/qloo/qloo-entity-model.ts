import { PrismaClient } from '@prisma/client'

export class QlooEntityModel {

  // Consts
  clName = 'QlooEntityModel'

  // Code
  async create(
          prisma: PrismaClient,
          qlooEntityId: string,
          isTrending: boolean,
          name: string,
          disambiguation: string | null,
          types: string[],
          popularity: number | null,
          json: any) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.qlooEntity.create({
        data: {
          qlooEntityId: qlooEntityId,
          isTrending: isTrending,
          name: name,
          disambiguation: disambiguation,
          types: types,
          popularity: popularity,
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
          types: string[] | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.qlooEntity.findMany({
        where: {
          isTrending: isTrending,
          types: types ? {
            hasEvery: types
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
          qlooEntityId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (qlooEntityId == null) {
      console.error(`${fnName}: qlooEntityId == null`)
      throw 'Validation error'
    }

    // Query
    var qlooEntity: any = null

    try {
      qlooEntity = await prisma.qlooEntity.findFirst({
        where: {
          qlooEntityId: qlooEntityId
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
          qlooEntityId: string | undefined,
          isTrending: boolean | undefined,
          name: string | undefined,
          disambiguation: string | null | undefined,
          types: string[] | undefined,
          popularity: number | null | undefined,
          json: any | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.qlooEntity.update({
        data: {
          qlooEntityId: qlooEntityId,
          isTrending: isTrending,
          name: name,
          disambiguation: disambiguation,
          types: types,
          popularity: popularity,
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
          qlooEntityId: string | undefined,
          isTrending: boolean | undefined,
          name: string | undefined,
          disambiguation: string | null | undefined,
          types: string[] | undefined,
          popularity: number | null | undefined,
          json: any | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        qlooEntityId != null) {

      const qlooEntity = await
              this.getByUniqueKey(
                prisma,
                qlooEntityId)

      if (qlooEntity != null) {
        id = qlooEntity.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (qlooEntityId == null) {
        console.error(`${fnName}: id is null and qlooEntityId is null`)
        throw 'Prisma error'
      }

      if (isTrending == null) {
        console.error(`${fnName}: id is null and isTrending is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (disambiguation === undefined) {
        console.error(`${fnName}: id is null and disambiguation is undefined`)
        throw 'Prisma error'
      }

      if (types == null) {
        console.error(`${fnName}: id is null and types is null`)
        throw 'Prisma error'
      }

      if (popularity === undefined) {
        console.error(`${fnName}: id is null and popularity is undefined`)
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
                 qlooEntityId,
                 isTrending,
                 name,
                 disambiguation,
                 types,
                 popularity,
                 json)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 qlooEntityId,
                 isTrending,
                 name,
                 disambiguation,
                 types,
                 popularity,
                 json)
    }
  }
}
