import { PrismaClient } from '@prisma/client'

export class QlooTagTypeModel {

  // Consts
  clName = 'QlooTagTypeModel'

  // Code
  async create(
          prisma: PrismaClient,
          urn: string,
          entityTypes: string[]) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.qlooTagType.create({
        data: {
          urn: urn,
          entityTypes: entityTypes
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async count(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.count()`

    // Create record
    try {
      return await prisma.qlooTagType.count({
        where: {}
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
      return await prisma.qlooTagType.delete({
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

  async filter(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.qlooTagType.findMany({
        where: {}
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
    var qlooTagType: any = null

    try {
      qlooTagType = await prisma.qlooTagType.findUnique({
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
    return qlooTagType
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.qlooTagType.findMany({
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
          urn: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (urn == null) {
      console.error(`${fnName}: urn == null`)
      throw 'Validation error'
    }

    // Query
    var qlooTagType: any = null

    try {
      qlooTagType = await prisma.qlooTagType.findFirst({
        where: {
          urn: urn
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return qlooTagType
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          urn: string | undefined,
          entityTypes: string[] | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.qlooTagType.update({
        data: {
          urn: urn,
          entityTypes: entityTypes
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
          urn: string | undefined,
          entityTypes: string[] | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        urn != null) {

      const qlooTagType = await
              this.getByUniqueKey(
                prisma,
                urn)

      if (qlooTagType != null) {
        id = qlooTagType.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (urn == null) {
        console.error(`${fnName}: id is null and urn is null`)
        throw 'Prisma error'
      }

      if (entityTypes == null) {
        console.error(`${fnName}: id is null and entityTypes is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 urn,
                 entityTypes)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 urn,
                 entityTypes)
    }
  }
}
