import { PrismaClient } from '@prisma/client'

export class QlooAudiencePersonaModel {

  // Consts
  clName = 'QlooAudiencePersonaModel'

  // Code
  async create(
          prisma: PrismaClient,
          qlooAudienceId: string,
          name: string,
          description: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.qlooAudiencePersona.create({
        data: {
          qlooAudienceId: qlooAudienceId,
          name: name,
          description: description
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
      return await prisma.qlooAudiencePersona.delete({
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
          qlooAudienceId: string) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.qlooAudiencePersona.findMany({
        where: {
          qlooAudienceId: qlooAudienceId
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
    var qlooAudiencePersona: any = null

    try {
      qlooAudiencePersona = await prisma.qlooAudiencePersona.findUnique({
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
    return qlooAudiencePersona
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.qlooAudiencePersona.findMany({
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
          qlooAudienceId: string,
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (qlooAudienceId == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    if (name == null) {
      console.error(`${fnName}: qlooAudienceId == null`)
      throw 'Validation error'
    }

    // Query
    var qlooAudiencePersona: any = null

    try {
      qlooAudiencePersona = await prisma.qlooAudiencePersona.findFirst({
        where: {
          qlooAudienceId: qlooAudienceId,
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
    return qlooAudiencePersona
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          qlooAudienceId: string | undefined,
          name: string | undefined,
          description: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.qlooAudiencePersona.update({
        data: {
          qlooAudienceId: qlooAudienceId,
          name: name,
          description: description
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
          qlooAudienceId: string | undefined,
          name: string | undefined,
          description: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        qlooAudienceId != null &&
        name != null) {

      const qlooAudiencePersona = await
              this.getByUniqueKey(
                prisma,
                qlooAudienceId,
                name)

      if (qlooAudiencePersona != null) {
        id = qlooAudiencePersona.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (qlooAudienceId == null) {
        console.error(`${fnName}: id is null and qlooAudienceId is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (description == null) {
        console.error(`${fnName}: id is null and description is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 qlooAudienceId,
                 name,
                 description)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 qlooAudienceId,
                 name,
                 description)
    }
  }
}
