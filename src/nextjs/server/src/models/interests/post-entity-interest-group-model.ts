import { PrismaClient } from '@prisma/client'

export class PostEntityInterestGroupModel {

  // Consts
  clName = 'PostEntityInterestGroupModel'

  // Code
  async create(
          prisma: PrismaClient,
          postId: string,
          entityInterestGroupId: string | null) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.postEntityInterestGroup.create({
        data: {
          postId: postId,
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
      return await prisma.postEntityInterestGroup.delete({
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
          postId: string | undefined,
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.postEntityInterestGroup.findMany({
        where: {
          postId: postId,
          entityInterestGroupId: entityInterestGroupId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filterAndOrderBySimilarEntityInterestGroups(
          prisma: PrismaClient,
          entityInterestGroupIdOfUser: string,
          sortedPostIds: string[]) {

    // Debug
    const fnName = `${this.clName}.findSimilar()`

    // Order by similarity
    const rankedPosts = await
            prisma.$queryRawUnsafe<string[]>(`
              SELECT peig.post_id
                FROM post_entity_interest_group peig,
                     entity_interest_group eigp,  /* groups for posts */
                     entity_interest_group eigu   /* groups for users */
               WHERE eigp.id = peig.entity_interest_group_id
                 AND eigu.id = $1
                 AND peig.post_id = ANY($2::uuid[])
               ORDER BY eigp.embedding <=> eigu.embedding;
                        post_id
            `,
            entityInterestGroupIdOfUser,
            sortedPostIds)

    // Debug
    console.log(`${fnName}: rankedPosts: ` + JSON.stringify(rankedPosts))

    // Return
    return rankedPosts
  }

  async getById(
          prisma: PrismaClient,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var postEntityInterestGroup: any = null

    try {
      postEntityInterestGroup = await prisma.postEntityInterestGroup.findUnique({
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
    return postEntityInterestGroup
  }

  async getByIds(
          prisma: PrismaClient,
          ids: string[]) {

    // Debug
    const fnName = `${this.clName}.getByIds()`

    // Query
    try {
      return await prisma.postEntityInterestGroup.findMany({
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
          postId: string) {

    // Debug
    const fnName = `${this.clName}.getByUniqueKey()`

    // Validate
    if (postId == null) {
      console.error(`${fnName}: postId == null`)
      throw 'Validation error'
    }

    // Query
    var postEntityInterestGroup: any = null

    try {
      postEntityInterestGroup = await prisma.postEntityInterestGroup.findFirst({
        where: {
          postId: postId
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return postEntityInterestGroup
  }

  async update(
          prisma: PrismaClient,
          id: string | undefined,
          postId: string | undefined,
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.postEntityInterestGroup.update({
        data: {
          postId: postId,
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
          postId: string | undefined,
          entityInterestGroupId: string | null | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    console.log(`${fnName}: starting..`)

    // If id isn't specified, but the unique keys are, try to get the record
    if (id == null &&
        postId != null) {

      const postEntityInterestGroup = await
              this.getByUniqueKey(
                prisma,
                postId)

      if (postEntityInterestGroup != null) {
        id = postEntityInterestGroup.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (postId == null) {
        console.error(`${fnName}: id is null and postId is null`)
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
                 postId,
                 entityInterestGroupId)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 postId,
                 entityInterestGroupId)
    }
  }
}
