import { PrismaClient } from '@prisma/client'

export class UserEntityInterestGroupModel {

  // Consts
  clName = 'UserEntityInterestGroupModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          entityInterestGroupId: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.userEntityInterestGroup.create({
        data: {
          userProfileId: userProfileId,
          entityInterestGroupId: entityInterestGroupId
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
      return await prisma.userEntityInterestGroup.delete({
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
          entityInterestGroupId: string | null | undefined = undefined,
          includeEntityInterestGroup: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.userEntityInterestGroup.findMany({
        include: {
          entityInterestGroup: includeEntityInterestGroup
        },
        where: {
          userProfileId: userProfileId,
          entityInterestGroupId: entityInterestGroupId
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
    var userEntityInterestGroup: any = null

    try {
      userEntityInterestGroup = await prisma.userEntityInterestGroup.findUnique({
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
    return userEntityInterestGroup
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.userEntityInterestGroup.findMany({
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
          userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (userProfileId == null) {
      console.error(`${fnName}: userProfileId == null`)
      throw 'Validation error'
    }

    // Query
    var userEntityInterestGroup: any = null

    try {
      userEntityInterestGroup = await prisma.userEntityInterestGroup.findFirst({
        where: {
          userProfileId: userProfileId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return userEntityInterestGroup
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.userEntityInterestGroup.update({
        data: {
          userProfileId: userProfileId,
          entityInterestGroupId: entityInterestGroupId
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
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null) {

      const userEntityInterestGroup = await
              this.getByUniqueKey(
                prisma,
                userProfileId)

      if (userEntityInterestGroup != null) {
        id = userEntityInterestGroup.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
        throw 'Prisma error'
      }

      if (entityInterestGroupId === undefined) {
        console.error(`${fnName}: id is null and entityInterestGroupId is undefined`)
        throw 'Prisma error'
      }


      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 entityInterestGroupId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 entityInterestGroupId)
    }
  }
}
