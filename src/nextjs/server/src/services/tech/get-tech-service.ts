import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'

// Models
const techModel = new TechModel()

// Class
export class GetTechService {

  // Consts
  clName = 'GetTechService'

  // Code
  async getEmbeddingsTech(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getEmbeddingsTech()`

    // Defined LLM variant name
    const variantName = process.env.STANDARD_EMBEDDINGS_VARIANT_NAME!

    // Get the standard LLM to use
    const tech = await
            techModel.getByVariantName(
              prisma,
              variantName)

    // Validate
    if (tech == null) {
      throw new CustomError(`${fnName}: tech == null for variantName: ` +
                            `${variantName}`
      )
    }

    // Return
    return tech
  }

  async getStandardLlmTech(
          prisma: PrismaClient,
          userProfileId: string | null) {

    // Debug
    const fnName = `${this.clName}.getStandardLlmTech()`

    // Defined LLM variant name
    const variantName = process.env.STANDARD_LLM_VARIANT_NAME!

    // Get the standard LLM to use
    const tech = await
            techModel.getByVariantName(
              prisma,
              variantName)

    // Validate
    if (tech == null) {
      throw new CustomError(`${fnName}: tech == null for variantName: ` +
                            `${variantName}`
      )
    }

    // Return
    return tech
  }
}
