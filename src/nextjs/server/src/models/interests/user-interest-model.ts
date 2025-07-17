import { PrismaClient } from '@prisma/client'

export class UserInterestModel {

  // Consts
  clName = 'UserInterestModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          entityInterestId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.userInterest.create({
        data: {
          userProfileId: userProfileId,
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
      return await prisma.userInterest.delete({
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
          userProfileId: string | undefined,
          entityInterestId: string | undefined = undefined,
          includeEntityInterest: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.userInterest.findMany({
        include: {
          entityInterest: includeEntityInterest ? {
            include: {
              interestType: true
            }
          } : undefined
        },
        where: {
          userProfileId: userProfileId,
          entityInterestId: entityInterestId
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
    var userInterest: any = null

    try {
      userInterest = await prisma.userInterest.findUnique({
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
    return userInterest
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.userInterest.findMany({
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
          userProfileId: string,
          entityInterestId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (userProfileId == null) {
      console.error(`${fnName}: userProfileId == null`)
      throw 'Validation error'
    }

    if (entityInterestId == null) {
      console.error(`${fnName}: entityInterestId == null`)
      throw 'Validation error'
    }

    // Query
    var userInterest: any = null

    try {
      userInterest = await prisma.userInterest.findFirst({
        where: {
          userProfileId: userProfileId,
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
    return userInterest
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.userInterest.update({
        data: {
          userProfileId: userProfileId,
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
          userProfileId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null &&
        entityInterestId != null) {

      const userInterest = await
              this.getByUniqueKey(
                prisma,
                userProfileId,
                entityInterestId)

      if (userInterest != null) {
        id = userInterest.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
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
                 userProfileId,
                 entityInterestId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 entityInterestId)
    }
  }
}
