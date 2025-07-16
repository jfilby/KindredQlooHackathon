import { PrismaClient } from '@prisma/client'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'

// Models
const techModel = new TechModel()

// Class
export class GetTechService {

  // Consts
  clName = 'GetTechService'

  // Code
  async getStandardLlmTech(
          prisma: PrismaClient,
          userProfileId: string | null) {

    // Get the standard LLM to use
    const tech = await
            techModel.getByVariantName(
              prisma,
              AiTechDefs.googleGemini_V2pt5FlashFree)

    // Return
    return tech
  }
}
