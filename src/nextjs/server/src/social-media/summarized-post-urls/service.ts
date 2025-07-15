import { PostUrl, PostUrlSummary, PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { PostUrlSummaryModel } from '@/models/summaries/post-url-summary-model'
import { PostUrlModel } from '@/models/social-media/post-url-model'

// Models
const postUrlModel = new PostUrlModel()
const postUrlSummaryModel = new PostUrlSummaryModel()
const techModel = new TechModel()

// Services
const agentLlmService = new AgentLlmService()

// Class
export class SummarizePostUrlService {

  // Consts
  clName = 'SummarizePostUrlService'

  // Code
  async getTech(
          prisma: PrismaClient,
          userProfileId: string | null) {

    // Get the default (GPT 4o)
    const tech = await
            techModel.getByVariantName(
              prisma,
              AiTechDefs.googleGemini_V2pt5FlashFree)
              // AiTechDefs.openRouter_MistralSmall3pt2_24b_Chutes)

    // Return
    return tech
  }

  async run(prisma: PrismaClient,
            userProfileId: string) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Get all unsummarized post URLs
    const postUrls = await
            postUrlModel.getUnsummarized(
              prisma,
              100)  // Max 100 at a time

    // Validate
    if (postUrls == null) {
      throw new CustomError(`${fnName}: postUrls == null`)
    }

    // Summarize posts without being user specific
    for (const postUrl of postUrls) {

      await this.summarizePostUrl(
              prisma,
              postUrl,
              userProfileId,
              null)  // Not personalized
    }
  }

  async summarizePostUrl(
          prisma: PrismaClient,
          postUrl: PostUrl,
          userProfileId: string,
          forUserProfileId: string | null) {

    // Debug
    const fnName = `${this.clName}.summarizePostUrl()`

    // Skip those with existing summaries, or recently summarized
    var postUrlSummary = await
          postUrlSummaryModel.getByUniqueKey(
            prisma,
            postUrl.id,
            forUserProfileId)

    if (postUrlSummary == null) {

      console.log(`${fnName}: postUrlSummary == null for postUrlId: ` +
                  postUrl.id)
    }

    if (postUrlSummary != null) {
      return
    }

    // Debug
    console.log(`${fnName}: proceeding to summarize..`)

    // Summarize post
    await this.summarizePostUrlWithLlm(
            prisma,
            userProfileId,
            forUserProfileId,
            postUrl,
            postUrlSummary)
  }

  async summarizePostUrlWithLlm(
          prisma: PrismaClient,
          userProfileId: string,
          forUserProfileId: string | null,
          postUrl: PostUrl,
          postUrlSummary: PostUrlSummary | null) {

    // Debug
    const fnName = `${this.clName}.summarizePostUrlWithLlm()`

    console.log(`${fnName}: starting with postUrlSummary: ` +
                JSON.stringify(postUrlSummary))

    // Get the LLM
    const tech = await
            this.getTech(
              prisma,
              userProfileId)

    // Debug
    // console.log(`${fnName}: tech: ` + JSON.stringify(tech))

    // Get post
    const postJson = {
      title: postUrl.title
    }

    // Define the prompt
    var prompt =
          `# Prompt\n` +
          `\n` +
          `## General instructions\n` +
          `- Summarize the following web page in markdown, but don't ` +
          `  mention that it's a summary or that it's in markdown.\n` +
          `- Don't use headings. Only use bold text if something really ` +
          `  needs to stand out.\n` +
          `- There's no need to generate a title.\n`

    // Existing summary post?
    if (postUrlSummary != null &&
        postUrlSummary.text != null) {

      // Continue general instructions
      prompt +=
        `- There's an existing post summary, try to only update it if ` +
        `  needed.\n`

      // Existing post url summary text
      prompt +=
        `## Existing post url summary\n` +
        postUrlSummary.text +
        `\n`
    }

    if (postUrl != null) {

      if (postUrl.title != null ||
          postUrl.text != null) {

        prompt +=
          `## Content from the post's URL\n`

        if (postUrl.title != null) {
          prompt += `- title: ${postUrl.title}`
        }

        if (postUrl.text != null) {
          prompt += `- text: ${postUrl.text}`
        }
      }
    }

    // Query via AIC
    var queryResults: any = undefined

    for (var i = 0; i < 5; i++) {

      try {
        queryResults = await
          agentLlmService.agentSingleShotLlmRequest(
          prisma,
            tech,
            userProfileId,
            null,       // instanceId
            ServerOnlyTypes.defaultChatSettingsName,
            BaseDataTypes.searchAgentRefId,
            BaseDataTypes.searchAgentName,
            BaseDataTypes.searchAgentRole,
            prompt,
            true,       // isEncryptedAtRest
            false,      // isJsonMode
            false)      // tryGetFromCache

      } catch(e: any) {
        console.log(`${fnName}: exception: ` + JSON.stringify(e))
      }

      if (queryResults != null) {
        break
      }
    }

    // Validate
    if (queryResults == null) {

      console.log(`${fnName}: queryResults == null after several tries`)
      return
    }

    // Debug
    console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Extract the summary text
    var text = ''

    for (const message of queryResults.messages) {

      if (text.length > 0) {
        text += '\n\n'
      }

      text += message.text
    }

    // Upsert the PostSummary
    postUrlSummary = await
      postUrlSummaryModel.upsert(
        prisma,
        undefined,  // id
        postUrl.id,
        forUserProfileId,
        BaseDataTypes.activeStatus,
        text)
  }
}
