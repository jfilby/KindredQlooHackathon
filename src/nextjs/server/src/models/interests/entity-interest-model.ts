import { PrismaClient } from '@prisma/client'

export class EntityInterestModel {

  // Consts
  clName = 'EntityInterestModel'

  // Code
  async create(
          prisma: PrismaClient,
          interestTypeId: string,
          qlooEntityId: string | null,
          status: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.entityInterest.create({
        data: {
          interestTypeId: interestTypeId,
          qlooEntityId: qlooEntityId,
          status: status,
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
      return await prisma.entityInterest.delete({
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
          interestTypeId: string | undefined = undefined,
          qlooEntityId: string | null | undefined = undefined,
          status: string | undefined = undefined,
          siteTopicId: string | undefined = undefined,
          includeInterestTypes: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.entityInterest.findMany({
        include: {
          interestType: includeInterestTypes
        },
        where: {
          interestTypeId: interestTypeId,
          qlooEntityId: qlooEntityId,
          status: status,
          ofEntityInterestItems: siteTopicId ? {
            some: {
              entityInterestGroup: {
                ofSiteTopicEntityInterestGroup: {
                  some: {
                    siteTopicId: siteTopicId
                  }
                }
              }
            }
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
    var entityInterest: any = null

    try {
      entityInterest = await prisma.entityInterest.findUnique({
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
    return entityInterest
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.entityInterest.findMany({
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
          interestTypeId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (interestTypeId == null) {
      console.error(`${fnName}: interestTypeId == null`)
      throw 'Validation error'
    }

    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var entityInterest: any = null

    try {
      entityInterest = await prisma.entityInterest.findFirst({
        where: {
          interestTypeId: interestTypeId,
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
    return entityInterest
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          interestTypeId: string | undefined,
          qlooEntityId: string | null | undefined,
          status: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.entityInterest.update({
        data: {
          interestTypeId: interestTypeId,
          qlooEntityId: qlooEntityId,
          status: status,
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
          interestTypeId: string | undefined,
          qlooEntityId: string | null | undefined,
          status: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        interestTypeId != null &&
        name != null) {

      const entityInterest = await
              this.getByUniqueKey(
                prisma,
                interestTypeId,
                name)

      if (entityInterest != null) {
        id = entityInterest.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (interestTypeId == null) {
        console.error(`${fnName}: id is null and interestTypeId is null`)
        throw 'Prisma error'
      }

      if (qlooEntityId === undefined) {
        console.error(`${fnName}: id is null and qlooEntityId is undefined`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
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
                 interestTypeId,
                 qlooEntityId,
                 status,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 interestTypeId,
                 qlooEntityId,
                 status,
                 name)
    }
  }
}
