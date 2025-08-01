import { PrismaClient } from '@prisma/client'

export class InterestTypeModel {

  // Consts
  clName = 'InterestTypeModel'

  // Code
  async create(
          prisma: PrismaClient,
          qlooEntityType: string | null,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.interestType.create({
        data: {
          qlooEntityType: qlooEntityType,
          name: name
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
      return await prisma.interestType.delete({
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
      return await prisma.interestType.findMany({
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
    var interestType: any = null

    try {
      interestType = await prisma.interestType.findUnique({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      console.log(`${fnName}: error: ` + JSON.stringify(error))

      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return interestType
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.interestType.findMany({
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

  async getByQlooEntityType(
          prisma: PrismaClient,
          qlooEntityType: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (qlooEntityType == null) {
      console.error(`${fnName}: qlooEntityType == null`)
      throw 'Validation error'
    }

    // Query
    var interestType: any = null

    try {
      interestType = await prisma.interestType.findFirst({
        where: {
          qlooEntityType: qlooEntityType
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return interestType
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
    var interestType: any = null

    try {
      interestType = await prisma.interestType.findFirst({
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
    return interestType
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          qlooEntityType: string | null | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.interestType.update({
        data: {
          qlooEntityType: qlooEntityType,
          name: name
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
          qlooEntityType: string | null | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        name != null) {

      const interestType = await
              this.getByUniqueKey(
                prisma,
                name)

      if (interestType != null) {
        id = interestType.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (qlooEntityType === undefined) {
        console.error(`${fnName}: id is null and qlooEntityType is undefined`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 qlooEntityType,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 qlooEntityType,
                 name)
    }
  }
}
