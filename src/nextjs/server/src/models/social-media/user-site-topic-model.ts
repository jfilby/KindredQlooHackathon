import { PrismaClient } from '@prisma/client'

export class UserSiteTopicModel {

  // Consts
  clName = 'UserSiteTopicModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          siteTopicId: string,
          rankBy: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.userSiteTopic.create({
        data: {
          userProfileId: userProfileId,
          siteTopicId: siteTopicId,
          rankBy: rankBy
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
      return await prisma.userSiteTopic.delete({
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
          userProfileId: string | undefined = undefined) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    try {
      return await prisma.userSiteTopic.findMany({
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
  }

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var userSiteTopic: any = null

    try {
      userSiteTopic = await prisma.userSiteTopic.findUnique({
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
    return userSiteTopic
  }

  async getByUniqueKey(
          prisma: PrismaClient,
          userProfileId: string,
          siteTopicId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (userProfileId == null) {
      console.error(`${fnName}: userProfileId == null`)
      throw 'Validation error'
    }

    if (siteTopicId == null) {
      console.error(`${fnName}: siteTopicId == null`)
      throw 'Validation error'
    }

    // Query
    var userSiteTopic: any = null

    try {
      userSiteTopic = await prisma.userSiteTopic.findFirst({
        where: {
          userProfileId: userProfileId,
          siteTopicId: siteTopicId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return userSiteTopic
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          siteTopicId: string | undefined,
          rankBy: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.userSiteTopic.update({
        data: {
          userProfileId: userProfileId,
          siteTopicId: siteTopicId,
          rankBy: rankBy
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
          siteTopicId: string | undefined,
          rankBy: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null &&
        siteTopicId != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                userProfileId,
                siteTopicId)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
        throw 'Prisma error'
      }

      if (siteTopicId == null) {
        console.error(`${fnName}: id is null and siteTopicId is null`)
        throw 'Prisma error'
      }

      if (rankBy == null) {
        console.error(`${fnName}: id is null and rankBy is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 siteTopicId,
                 rankBy)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 siteTopicId,
                 rankBy)
    }
  }
}
