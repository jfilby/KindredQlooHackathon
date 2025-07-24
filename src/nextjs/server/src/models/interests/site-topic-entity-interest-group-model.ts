import { PrismaClient } from '@prisma/client'

export class SiteTopicEntityInterestGroupModel {

  // Consts
  clName = 'SiteTopicEntityInterestGroupModel'

  // Code
  async create(
          prisma: PrismaClient,
          siteTopicId: string,
          entityInterestGroupId: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.siteTopicEntityInterestGroup.create({
        data: {
          siteTopicId: siteTopicId,
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
      return await prisma.siteTopicEntityInterestGroup.delete({
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
          siteTopicId: string | undefined,
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.siteTopicEntityInterestGroup.findMany({
        where: {
          siteTopicId: siteTopicId,
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
    var siteTopicEntityInterestGroup: any = null

    try {
      siteTopicEntityInterestGroup = await prisma.siteTopicEntityInterestGroup.findUnique({
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
    return siteTopicEntityInterestGroup
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.siteTopicEntityInterestGroup.findMany({
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
          siteTopicId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (siteTopicId == null) {
      console.error(`${fnName}: siteTopicId == null`)
      throw 'Validation error'
    }

    // Query
    var siteTopicEntityInterestGroup: any = null

    try {
      siteTopicEntityInterestGroup = await prisma.siteTopicEntityInterestGroup.findFirst({
        where: {
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
    return siteTopicEntityInterestGroup
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          siteTopicId: string | undefined,
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.siteTopicEntityInterestGroup.update({
        data: {
          siteTopicId: siteTopicId,
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
          siteTopicId: string | undefined,
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        siteTopicId != null) {

      const siteTopicEntityInterestGroup = await
              this.getByUniqueKey(
                prisma,
                siteTopicId)

      if (siteTopicEntityInterestGroup != null) {
        id = siteTopicEntityInterestGroup.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (siteTopicId == null) {
        console.error(`${fnName}: id is null and siteTopicId is null`)
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
                 siteTopicId,
                 entityInterestGroupId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 siteTopicId,
                 entityInterestGroupId)
    }
  }
}
