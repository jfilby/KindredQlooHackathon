import { PrismaClient } from '@prisma/client'

export class EntityInterestItemModel {

  // Consts
  clName = 'EntityInterestItemModel'

  // Code
  async create(
          prisma: PrismaClient,
          entityInterestGroupId: string,
          entityInterestId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.entityInterestItem.create({
        data: {
          entityInterestGroupId: entityInterestGroupId,
          entityInterestId: entityInterestId
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
      return await prisma.entityInterestItem.delete({
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
          entityInterestGroupId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.entityInterestItem.findMany({
        where: {
          entityInterestGroupId: entityInterestGroupId,
          entityInterestId: entityInterestId
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
    var entityInterestItem: any = null

    try {
      entityInterestItem = await prisma.entityInterestItem.findUnique({
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
    return entityInterestItem
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.entityInterestItem.findMany({
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
          entityInterestGroupId: string,
          entityInterestId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (entityInterestGroupId == null) {
      console.error(`${fnName}: entityInterestGroupId == null`)
      throw 'Validation error'
    }

    if (entityInterestId == null) {
      console.error(`${fnName}: entityInterestId == null`)
      throw 'Validation error'
    }

    // Query
    var entityInterestItem: any = null

    try {
      entityInterestItem = await prisma.entityInterestItem.findFirst({
        where: {
          entityInterestGroupId: entityInterestGroupId,
          entityInterestId: entityInterestId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return entityInterestItem
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          entityInterestGroupId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.entityInterestItem.update({
        data: {
          entityInterestGroupId: entityInterestGroupId,
          entityInterestId: entityInterestId
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
          entityInterestGroupId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        entityInterestGroupId != null &&
        entityInterestId != null) {

      const entityInterestItem = await
              this.getByUniqueKey(
                prisma,
                entityInterestGroupId,
                entityInterestId)

      if (entityInterestItem != null) {
        id = entityInterestItem.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (entityInterestGroupId == null) {
        console.error(`${fnName}: id is null and entityInterestGroupId is null`)
        throw 'Prisma error'
      }

      if (entityInterestId == null) {
        console.error(`${fnName}: id is null and entityInterestId is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 entityInterestGroupId,
                 entityInterestId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 entityInterestGroupId,
                 entityInterestId)
    }
  }
}
