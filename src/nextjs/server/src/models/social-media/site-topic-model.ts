import { PrismaClient } from '@prisma/client'

export class SiteTopicModel {

  // Consts
  clName = 'SiteTopicModel'

  // Code
  async create(
          prisma: PrismaClient,
          siteId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.siteTopic.create({
        data: {
          siteId: siteId,
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
      return await prisma.siteTopic.delete({
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
    var siteTopic: any = null

    try {
      siteTopic = await prisma.siteTopic.findUnique({
        include: {
          site: true
        },
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
    return siteTopic
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.siteTopic.findMany({
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
          siteId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (siteId == null) {
      console.error(`${fnName}: siteId == null`)
      throw 'Validation error'
    }

    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var siteTopic: any = null

    try {
      siteTopic = await prisma.siteTopic.findFirst({
        where: {
          siteId: siteId,
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
    return siteTopic
  }

  async getWithMissingEntityInterestGroups(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getWithMissingEntityInterestGroups()`

    // Query
    try {
      return await prisma.siteTopic.findMany({
        include: {
          site: true
        },
        where: {
          ofSiteTopicEntityInterestGroup: {
            none: {}
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

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          siteId: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.siteTopic.update({
        data: {
          siteId: siteId,
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
          siteId: string | undefined,
          name: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        siteId != null &&
        name != null) {

      const post = await
              this.getByUniqueKey(
                prisma,
                siteId,
                name)

      if (post != null) {
        id = post.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (siteId == null) {
        console.error(`${fnName}: id is null and siteId is null`)
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
                 siteId,
                 name)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 siteId,
                 name)
    }
  }
}
