import { PrismaClient } from '@prisma/client'

export class SharedEntityInterestGroupModel {

  // Consts
  clName = 'SharedEntityInterestGroupModel'

  // Code
  async create(
          prisma: PrismaClient,
          entityInterestGroupAId: string,
          entityInterestGroupBId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Sort ids
    const sortedIds = [entityInterestGroupAId, entityInterestGroupBId].sort()

    // Create record
    try {
      return await prisma.sharedEntityInterestGroup.create({
        data: {
          entityInterestGroupAId: sortedIds[0],
          entityInterestGroupBId: sortedIds[1]
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
      return await prisma.sharedEntityInterestGroup.delete({
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

  async findByEntityInterestGroupId(
          prisma: PrismaClient,
          entityInterestGroupId: string) {

    // Debug
    const fnName = `${this.clName}.filterByLastSimilarFound()`

    // Validate
    if (entityInterestGroupId == null) {
      console.error(`${fnName}: entityInterestGroupId == null`)
      throw 'Validation error'
    }

    // Query
    try {
      return await prisma.sharedEntityInterestGroup.findMany({
        where: {
          OR: [
            {
              entityInterestGroupAId: entityInterestGroupId
            },
            {
              entityInterestGroupBId: entityInterestGroupId
            }
          ]
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
    var sharedEntityInterestGroup: any = null

    try {
      sharedEntityInterestGroup = await prisma.sharedEntityInterestGroup.findUnique({
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
    return sharedEntityInterestGroup
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.sharedEntityInterestGroup.findMany({
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
          entityInterestGroupAId: string,
          entityInterestGroupBId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (entityInterestGroupAId == null) {
      console.error(`${fnName}: entityInterestGroupAId == null`)
      throw 'Validation error'
    }

    if (entityInterestGroupBId == null) {
      console.error(`${fnName}: entityInterestGroupBId == null`)
      throw 'Validation error'
    }

    // Sort ids
    const sortedIds = [entityInterestGroupAId, entityInterestGroupBId].sort()

    // Query
    var sharedEntityInterestGroup: any = null

    try {
      sharedEntityInterestGroup = await prisma.sharedEntityInterestGroup.findFirst({
        where: {
          entityInterestGroupAId: sortedIds[0],
          entityInterestGroupBId: sortedIds[1]
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return sharedEntityInterestGroup
  }

  async getOrCreate(
          prisma: PrismaClient,
          entityInterestGroupAId: string,
          entityInterestGroupBId: string) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // Try to get
    const sharedEntityInterestGroup = await
            this.getByUniqueKey(
              prisma,
              entityInterestGroupAId,
              entityInterestGroupBId)

    if (sharedEntityInterestGroup != null) {
      return sharedEntityInterestGroup
    }

    // Create

    // Validate for create (mainly for type validation of the create call)
    if (entityInterestGroupAId == null) {
      console.error(`${fnName}: id is null and entityInterestGroupAId is null`)
      throw 'Prisma error'
    }

    if (entityInterestGroupBId == null) {
      console.error(`${fnName}: id is null and entityInterestGroupBId is null`)
      throw 'Prisma error'
    }

    // Create
    return await
              this.create(
               prisma,
               entityInterestGroupAId,
               entityInterestGroupBId)
  }
}
