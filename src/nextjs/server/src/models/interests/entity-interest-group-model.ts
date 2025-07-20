import { EntityInterestGroup, PrismaClient } from '@prisma/client'

export class EntityInterestGroupModel {

  // Consts
  clName = 'EntityInterestGroupModel'

  // Code
  async create(
          prisma: PrismaClient,
          uniqueHash: string,
          embeddingTechId: string,
          embedding: number[],
          lastSimilarFound: Date | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.entityInterestGroup.create({
        data: {
          uniqueHash: uniqueHash,
          embeddingTechId: embeddingTechId,
          embedding: embedding,
          lastSimilarFound: lastSimilarFound
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
      return await prisma.entityInterestGroup.delete({
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

  async filterByHasEmbedding(
          prisma: PrismaClient,
          hasEmbedding: boolean,
          includeEntityInterestItems: boolean) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Validate
    if (hasEmbedding === null) {
      console.error(`${fnName}: hasEmbedding === null`)
      throw 'Validation error'
    }

    // Query
    try {
      return await prisma.entityInterestGroup.findMany({
        include: {
          ofEntityInterestItems: includeEntityInterestItems,
        },
        where: {
          embedding: hasEmbedding
          ? { hasSome: [0] }    // has at least one float
          : { equals: [] },     // embedding is exactly empty
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async filterByLastSimilarFound(
          prisma: PrismaClient,
          lteLastSimilarFound: Date | null) {

    // Debug
    const fnName = `${this.clName}.filterByLastSimilarFound()`

    // Validate
    if (lteLastSimilarFound === undefined) {
      console.error(`${fnName}: startingLastSimilarFound === undefined`)
      throw 'Validation error'
    }

    // Query
    try {
      return await prisma.entityInterestGroup.findMany({
        where: {
          lastSimilarFound: lteLastSimilarFound != null ? {
            lte: lteLastSimilarFound
          } : null
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }
  }

  async findSimilar(
          prisma: PrismaClient,
          fromId: string) {

    // Identify similar groups
    const similarGroups = await
            prisma.$queryRawUnsafe<EntityInterestGroup[]>(`
              SELECT eig2.*
              FROM entity_interest_group eig1,
                   entity_interest_group eig2
              WHERE eig1.id = $1
                AND eig1.id != eig2.id
              ORDER BY eig1.embedding <=> eig2.embedding
              LIMIT 10;
            `,
            fromId)

    // Return
    return similarGroups
  }

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var entityInterestGroup: any = null

    try {
      entityInterestGroup = await prisma.entityInterestGroup.findUnique({
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
    return entityInterestGroup
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.entityInterestGroup.findMany({
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
          uniqueHash: string,
          includeEntityInterestItems: boolean = false) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (uniqueHash == null) {
      console.error(`${fnName}: uniqueHash == null`)
      throw 'Validation error'
    }

    // Query
    var entityInterestGroup: any = null

    try {
      entityInterestGroup = await prisma.entityInterestGroup.findFirst({
        include: {
          ofEntityInterestItems: includeEntityInterestItems
        },
        where: {
          uniqueHash: uniqueHash
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return entityInterestGroup
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          uniqueHash: string | undefined,
          embeddingTechId: string | undefined,
          embedding: number[] | undefined,
          lastSimilarFound: Date | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.entityInterestGroup.update({
        data: {
          uniqueHash: uniqueHash,
          embeddingTechId: embeddingTechId,
          embedding: embedding,
          lastSimilarFound: lastSimilarFound
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
          uniqueHash: string | undefined,
          embeddingTechId: string | undefined,
          embedding: number[] | undefined,
          lastSimilarFound: Date | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        uniqueHash != null) {

      const entityInterestGroup = await
              this.getByUniqueKey(
                prisma,
                uniqueHash)

      if (entityInterestGroup != null) {
        id = entityInterestGroup.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (uniqueHash == null) {
        console.error(`${fnName}: id is null and uniqueHash is null`)
        throw 'Prisma error'
      }

      if (embeddingTechId == null) {
        console.error(`${fnName}: id is null and embeddingTechId is null`)
        throw 'Prisma error'
      }

      if (embedding == null) {
        console.error(`${fnName}: id is null and embedding is null`)
        throw 'Prisma error'
      }

      if (lastSimilarFound === undefined) {
        console.error(`${fnName}: id is null and lastSimilarFound is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 uniqueHash,
                 embeddingTechId,
                 embedding,
                 lastSimilarFound)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 uniqueHash,
                 embeddingTechId,
                 embedding,
                 lastSimilarFound)
    }
  }
}
