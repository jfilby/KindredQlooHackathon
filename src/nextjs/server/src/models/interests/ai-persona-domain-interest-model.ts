import { PrismaClient } from '@prisma/client'

export class AiPersonaDomainInterestModel {

  // Consts
  clName = 'AiPersonaDomainInterestModel'

  // Code
  async create(
          prisma: PrismaClient,
          aiPersonaId: string,
          domainInterestId: string) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.aiPersonaDomainInterest.create({
        data: {
          aiPersonaId: aiPersonaId,
          domainInterestId: domainInterestId
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
      return await prisma.aiPersonaDomainInterest.delete({
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
          domainInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.aiPersonaDomainInterest.findMany({
        where: {
          aiPersonaId: aiPersonaId,
          domainInterestId: domainInterestId
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
    var aiPersonaDomainInterest: any = null

    try {
      aiPersonaDomainInterest = await prisma.aiPersonaDomainInterest.findUnique({
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
    return aiPersonaDomainInterest
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.aiPersonaDomainInterest.findMany({
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
          domainInterestId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (aiPersonaId == null) {
      console.error(`${fnName}: aiPersonaId == null`)
      throw 'Validation error'
    }

    if (domainInterestId == null) {
      console.error(`${fnName}: domainInterestId == null`)
      throw 'Validation error'
    }

    // Query
    var aiPersonaDomainInterest: any = null

    try {
      aiPersonaDomainInterest = await prisma.aiPersonaDomainInterest.findFirst({
        where: {
          aiPersonaId: aiPersonaId,
          domainInterestId: domainInterestId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return aiPersonaDomainInterest
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          aiPersonaId: string | undefined,
          domainInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.aiPersonaDomainInterest.update({
        data: {
          aiPersonaId: aiPersonaId,
          domainInterestId: domainInterestId
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
          domainInterestId: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        aiPersonaId != null &&
        domainInterestId != null) {

      const aiPersonaDomainInterest = await
              this.getByUniqueKey(
                prisma,
                aiPersonaId,
                domainInterestId)

      if (aiPersonaDomainInterest != null) {
        id = aiPersonaDomainInterest.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (aiPersonaId == null) {
        console.error(`${fnName}: id is null and aiPersonaId is null`)
        throw 'Prisma error'
      }

      if (domainInterestId == null) {
        console.error(`${fnName}: id is null and domainInterestId is null`)
        throw 'Prisma error'
      }


      // Create
      return await
               this.create(
                 prisma,
                 aiPersonaId,
                 domainInterestId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 aiPersonaId,
                 domainInterestId)
    }
  }
}
