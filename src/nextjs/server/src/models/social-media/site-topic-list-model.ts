import { PrismaClient } from '@prisma/client'
import { BaseDataTypes } from '@/shared/types/base-data-types'

export class SiteTopicListModel {

  // Consts
  clName = 'SiteTopicListModel'

  // Code
  async create(
          prisma: PrismaClient,
          siteTopicId: string,
          techId: string,
          rankingType: string,
          listed: Date,
          status: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.siteTopicList.create({
        data: {
          siteTopicId: siteTopicId,
          techId: techId,
          rankingType: rankingType,
          listed: listed,
          status: status
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
      return await prisma.siteTopicList.delete({
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

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var siteTopicList: any = null

    try {
      siteTopicList = await prisma.siteTopicList.findUnique({
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
    return siteTopicList
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.siteTopicList.findMany({
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
          siteTopicId: string,
          rankingType: string,
          listed: Date) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (siteTopicId == null) {
      console.error(`${fnName}: siteTopicId == null`)
      throw 'Validation error'
    }

    if (rankingType == null) {
      console.error(`${fnName}: rankingType == null`)
      throw 'Validation error'
    }

    if (listed == null) {
      console.error(`${fnName}: listed == null`)
      throw 'Validation error'
    }

    // Query
    var siteTopicList: any = null

    try {
      siteTopicList = await prisma.siteTopicList.findFirst({
        where: {
          siteTopicId: siteTopicId,
          rankingType: rankingType,
          listed: listed
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return siteTopicList
  }

  async getLatestByNewStatusAndDaysAgo(
          prisma: PrismaClient,
          startingDaysAgo: number) {

    // Debug
    const fnName = `${this.clName}.getLatestByNewStatusAndDaysAgo()`

    // Validate
    if (startingDaysAgo == null) {
      console.error(`${fnName}: startingDaysAgo == null`)
      throw 'Validation error'
    }

    // Starting date
    const now = new Date();
    const xDaysAgo = new Date(now)
    xDaysAgo.setDate(now.getDate() - startingDaysAgo)

    // Query
    try {
      return await prisma.siteTopicList.findMany({
        include: {
          tech: true
        },
        where: {
          status: BaseDataTypes.newStatus,
          listed: {
            gte: xDaysAgo
          }
        },
        orderBy: [
          {
            listed: 'desc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async getLatestBySiteTopicIdAndStatus(
          prisma: PrismaClient,
          siteTopicId: string,
          rankingType: string,
          status: string) {

    // Debug
    const fnName = `${this.clName}.getLatestBySiteTopicIdAndStatus()`

    // Validate
    if (siteTopicId == null) {
      console.error(`${fnName}: siteTopicId == null`)
      throw 'Validation error'
    }

    if (rankingType == null) {
      console.error(`${fnName}: rankingType == null`)
      throw 'Validation error'
    }

    if (status == null) {
      console.error(`${fnName}: status == null`)
      throw 'Validation error'
    }

    // Query
    var siteTopicList: any = null

    try {
      siteTopicList = await prisma.siteTopicList.findFirst({
        where: {
          siteTopicId: siteTopicId,
          rankingType: rankingType,
          status: status
        },
        orderBy: [
          {
            listed: 'desc'
          }
        ]
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return siteTopicList
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          siteTopicId: string | undefined,
          techId: string | undefined,
          rankingType: string | undefined,
          listed: Date | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.siteTopicList.update({
        data: {
          siteTopicId: siteTopicId,
          techId: techId,
          rankingType: rankingType,
          listed: listed,
          status: status
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
          techId: string | undefined,
          rankingType: string | undefined,
          listed: Date | undefined,
          status: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        siteTopicId != null &&
        rankingType != null &&
        listed != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                siteTopicId,
                rankingType,
                listed)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (siteTopicId == null) {
        console.error(`${fnName}: id is null and siteTopicId is null`)
        throw 'Prisma error'
      }

      if (techId === undefined) {
        console.error(`${fnName}: id is null and techId is undefined`)
        throw 'Prisma error'
      }

      if (rankingType == null) {
        console.error(`${fnName}: id is null and rankingType is null`)
        throw 'Prisma error'
      }

      if (listed == null) {
        console.error(`${fnName}: id is null and listed is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 siteTopicId,
                 techId,
                 rankingType,
                 listed,
                 status)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 siteTopicId,
                 techId,
                 rankingType,
                 listed,
                 status)
    }
  }
}
