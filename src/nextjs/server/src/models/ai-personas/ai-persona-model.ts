import { PrismaClient } from '@prisma/client'

export class AiPersonaModel {

  // Consts
  clName = 'AiPersonaModel'

  // Code
  async create(
          prisma: PrismaClient,
          userProfileId: string,
          status: string,
          name: string,
          gender: string,
          dateOfBirth: Date,
          description: string,
          prompt: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.aiPersona.create({
        data: {
          userProfileId: userProfileId,
          status: status,
          name: name,
          gender: gender,
          dateOfBirth: dateOfBirth,
          description: description,
          prompt: prompt
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
      return await prisma.aiPersona.delete({
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
          status: string | undefined,
          name: string | undefined,
          gender: string | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.aiPersona.findMany({
        where: {
          userProfileId: userProfileId,
          status: status,
          name: name,
          gender: gender
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
    var aiPersona: any = null

    try {
      aiPersona = await prisma.aiPersona.findUnique({
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
    return aiPersona
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.aiPersona.findMany({
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
          name: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (userProfileId == null) {
      console.error(`${fnName}: userProfileId == null`)
      throw 'Validation error'
    }

    if (name == null) {
      console.error(`${fnName}: name == null`)
      throw 'Validation error'
    }

    // Query
    var aiPersona: any = null

    try {
      aiPersona = await prisma.aiPersona.findFirst({
        where: {
          userProfileId: userProfileId,
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
    return aiPersona
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          userProfileId: string | undefined,
          status: string | undefined,
          name: string | undefined,
          gender: string | undefined,
          dateOfBirth: Date | undefined,
          description: string | undefined,
          prompt: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.aiPersona.update({
        data: {
          userProfileId: userProfileId,
          status: status,
          name: name,
          gender: gender,
          dateOfBirth: dateOfBirth,
          description: description,
          prompt: prompt
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
          status: string | undefined,
          name: string | undefined,
          gender: string | undefined,
          dateOfBirth: Date | undefined,
          description: string | undefined,
          prompt: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        userProfileId != null &&
        name != null) {

      const aiPersona = await
              this.getByUniqueKey(
                prisma,
                userProfileId,
                name)

      if (aiPersona != null) {
        id = aiPersona.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (userProfileId == null) {
        console.error(`${fnName}: id is null and userProfileId is null`)
        throw 'Prisma error'
      }

      if (status == null) {
        console.error(`${fnName}: id is null and status is null`)
        throw 'Prisma error'
      }

      if (name == null) {
        console.error(`${fnName}: id is null and name is null`)
        throw 'Prisma error'
      }

      if (gender == null) {
        console.error(`${fnName}: id is null and gender is null`)
        throw 'Prisma error'
      }

      if (dateOfBirth == null) {
        console.error(`${fnName}: id is null and dateOfBirth is null`)
        throw 'Prisma error'
      }

      if (description == null) {
        console.error(`${fnName}: id is null and description is null`)
        throw 'Prisma error'
      }

      if (prompt === undefined) {
        console.error(`${fnName}: id is null and prompt is undefined`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 userProfileId,
                 status,
                 name,
                 gender,
                 dateOfBirth,
                 description,
                 prompt)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 userProfileId,
                 status,
                 name,
                 gender,
                 dateOfBirth,
                 description,
                 prompt)
    }
  }
}
