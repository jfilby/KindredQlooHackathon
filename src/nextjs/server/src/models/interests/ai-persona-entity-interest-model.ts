import { PrismaClient } from '@prisma/client'

export class AiPersonaEntityInterestModel {

  // Consts
  clName = 'AiPersonaEntityInterestModel'

  // Code
  async create(
          prisma: PrismaClient,
          aiPersonaId: string,
          entityInterestId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.aiPersonaEntityInterest.create({
        data: {
          aiPersonaId: aiPersonaId,
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
      return await prisma.aiPersonaEntityInterest.delete({
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
          aiPersonaId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.aiPersonaEntityInterest.findMany({
        where: {
          aiPersonaId: aiPersonaId,
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
    var aiPersonaEntityInterest: any = null

    try {
      aiPersonaEntityInterest = await prisma.aiPersonaEntityInterest.findUnique({
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
    return aiPersonaEntityInterest
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.aiPersonaEntityInterest.findMany({
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
          aiPersonaId: string,
          entityInterestId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (aiPersonaId == null) {
      console.error(`${fnName}: aiPersonaId == null`)
      throw 'Validation error'
    }

    if (entityInterestId == null) {
      console.error(`${fnName}: entityInterestId == null`)
      throw 'Validation error'
    }

    // Query
    var aiPersonaEntityInterest: any = null

    try {
      aiPersonaEntityInterest = await prisma.aiPersonaEntityInterest.findFirst({
        where: {
          aiPersonaId: aiPersonaId,
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
    return aiPersonaEntityInterest
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          aiPersonaId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.aiPersonaEntityInterest.update({
        data: {
          aiPersonaId: aiPersonaId,
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
          aiPersonaId: string | undefined,
          entityInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        aiPersonaId != null &&
        entityInterestId != null) {

      const aiPersonaEntityInterest = await
              this.getByUniqueKey(
                prisma,
                aiPersonaId,
                entityInterestId)

      if (aiPersonaEntityInterest != null) {
        id = aiPersonaEntityInterest.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (aiPersonaId == null) {
        console.error(`${fnName}: id is null and aiPersonaId is null`)
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
                 aiPersonaId,
                 entityInterestId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 aiPersonaId,
                 entityInterestId)
    }
  }
}
