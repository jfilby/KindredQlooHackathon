import { PrismaClient } from '@prisma/client'

export class QlooAudienceModel {

  // Consts
  clName = 'QlooAudienceModel'

  // Code
  async create(
          prisma: PrismaClient,
          name: string,
          platforms: string[],
          keywords: string[]) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.qlooAudience.create({
        data: {
          name: name,
          platforms: platforms,
          keywords: keywords
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
      return await prisma.qlooAudience.delete({
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
          name: string) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.qlooAudience.findMany({
        where: {
          name: name
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
    var qlooAudience: any = null

    try {
      qlooAudience = await prisma.qlooAudience.findUnique({
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
    return qlooAudience
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.qlooAudience.findMany({
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
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var qlooAudience: any = null

    try {
      qlooAudience = await prisma.qlooAudience.findFirst({
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
    return qlooAudience
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          name: string | undefined,
          platforms: string[] | undefined,
          keywords: string[] | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.qlooAudience.update({
        data: {
          name: name,
          platforms: platforms,
          keywords: keywords
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
          name: string | undefined,
          platforms: string[] | undefined,
          keywords: string[] | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        name != null) {

      const qlooAudience = await
              this.getByUniqueKey(
                prisma,
                name)

      if (qlooAudience != null) {
        id = qlooAudience.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (platforms == null) {
        console.error(`${fnName}: id is null and platforms is null`)
        throw 'Prisma error'
      }

      if (keywords == null) {
        console.error(`${fnName}: id is null and keywords is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 name,
                 platforms,
                 keywords)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 name,
                 platforms,
                 keywords)
    }
  }
}
