import { Post, PostSummary, PostUrl, PrismaClient, Site } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { TechModel } from '@/serene-core-server/models/tech/tech-model'
import { AiTechDefs } from '@/serene-ai-server/types/tech-defs'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { CommentModel } from '@/models/social-media/comment-model'
import { PostModel } from '@/models/social-media/post-model'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { PostUrlModel } from '@/models/social-media/post-url-model'
import { SiteModel } from '@/models/social-media/site-model'

// Models
const commentModel = new CommentModel()
const postModel = new PostModel()
const postSummaryModel = new PostSummaryModel()
const postUrlModel = new PostUrlModel()
const siteModel = new SiteModel()
const techModel = new TechModel()

// Services
const agentLlmService = new AgentLlmService()

// Class
export class SummarizePostMutateService {

  // Consts
  clName = 'SummarizePostMutateService'

  // Code
  async getCommentsJson(
          prisma: PrismaClient,
          postId: string) {

    // Debug
    const fnName = `${this.clName}.getCommentsJson()`

    // Get comments
    const comments = await
            commentModel.filter(
              prisma,
              postId)

    // Validate
    if (comments == null) {
      throw new CustomError(`${fnName}: comments == null`)
    }

    // Add to commentsJson
    var commentsJson: any[] = []

    for (const comment of comments) {

      commentsJson.push({
        id: comment.id,
        parentId: comment.parentId,
        text: comment.text
      })
    }

    // Return
    return commentsJson
  }

  getDurationFrom(date: Date) {

    const now = new Date();
    const diffMs = now.getTime() - date.getTime()  // difference in ms

    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    return {
      hours: diffHours,
      days: diffDays,
    }
  }

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
            userProfileId: string,
            forUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Get all recent posts
    const posts = await
            postModel.getLatest(
              prisma,
              3)  // startingDaysAgo

    // Validate
    if (posts == null) {
      throw new CustomError(`${fnName}: posts == null`)
    }

    // Summarize posts without being user specific
    for (const post of posts) {

      await this.summarizePost(
              prisma,
              post,
              userProfileId,
              forUserProfileId)
    }
  }

  async summarizePost(
          prisma: PrismaClient,
          post: Post,
          userProfileId: string,
          forUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.summarizePost()`

    // Skip those with existing summaries, or recently summarized
    var postSummary = await
          postSummaryModel.getByUniqueKey(
            prisma,
            post.id,
            forUserProfileId)

    if (postSummary == null) {
      console.log(`${fnName}: postSummary == null for postId: ` + post.id)
    }

    if (postSummary != null) {

      // Get the time since last summarized
      const duration = this.getDurationFrom(postSummary.updated)

      // Debug
      console.log(`${fnName}: duration: ` + JSON.stringify(duration))

      // Don't summarize anymore after 1 day
      if (duration.days >= 1) {

        await postSummaryModel.update(
                prisma,
                postSummary.id,
                post.id,
                forUserProfileId,
                BaseDataTypes.inactiveStatus,
                undefined)  // text

        return
      }

      // Don't summarize yet if not yet 4 hours since last summarized
      if (duration.hours < 4) {
        return
      }
    }

    // Debug
    console.log(`${fnName}: proceeding to summarize..`)

    // Get Site
    const site = await
            siteModel.getById(
              prisma,
              post.siteId)

    // Validate
    if (site == null) {
      throw new CustomError(`${fnName}: site == null`)
    }

    // Summarize post
    await this.summarizePostWithLlm(
            prisma,
            userProfileId,
            forUserProfileId,
            site,
            post,
            postSummary)
  }

  async summarizePostWithLlm(
          prisma: PrismaClient,
          userProfileId: string,
          forUserProfileId: string,
          site: Site,
          post: Post,
          postSummary: PostSummary | null) {

    // Debug
    const fnName = `${this.clName}.summarizePostWithLlm()`

    console.log(`${fnName}: starting with postSummary: ` +
                JSON.stringify(postSummary))

    // Get the LLM
    const tech = await
            this.getTech(
              prisma,
              userProfileId)

    // Debug
    // console.log(`${fnName}: tech: ` + JSON.stringify(tech))

    // Get post
    const postJson = {
      title: post.title
    }

    // Get PostUrl
    var postUrl: PostUrl | undefined = undefined

    if (post.postUrlId != null) {

      postUrl = await
        postUrlModel.getById(
          prisma,
          post.postUrlId)
    }

    // Get comments
    const commentsJson = await
            this.getCommentsJson(
              prisma,
              post.id)

    // Define the prompt
    var prompt =
          `# Prompt\n` +
          `\n` +
          `## General instructions\n` +
          `- Summarize the following post in markdown, but don't mention ` +
          `  that it's a summary or that it's in markdown.\n` +
          `- Write in the style of a ${site.name} top commenter.\n` +
          `- Don't use headings. Only use bold text if something really ` +
          `  needs to stand out.\n` +
          `- This summary will appear just below the title, so don't ` +
          `  duplicate it.\n` +
          `- The first half of the summary should be about the post/url ` +
          `  content. It should be 1-3 sentences at most, written in clear, ` +
          `  concise language that doesn't waffle and shouldn't include` +
          `  what's already in the title.\n` +
          `- The second half of the summary should be about the ` +
          `  ${site.name} post and its comments, but don't duplicate ` +
          `  anything already written for the summary.\n` +
          `- Don't consider comments that are too terse, unhelpful or ` +
          `  proven wrong by follow-on comments.`

    // Existing summary post?
    if (postSummary != null &&
        postSummary.text != null) {

      // Continue general instructions
      prompt +=
        `- There's an existing post summary, try to only update it if ` +
        `  needed.\n`

      // Existing post summary text
      prompt +=
        `## Existing post summary\n` +
        postSummary.text +
        `\n`
    }

    // Social-media post
    prompt +=
      `## ${site.name} post\n` +
      post.title +
      `\n` +
      `The post is: ` + JSON.stringify(postJson) +
      `\n`

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

    prompt +=
      `## ${site.name} comments\n` +
      `\n` +
      `The comments follow: ` + JSON.stringify(commentsJson)

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
    postSummary = await
      postSummaryModel.upsert(
        prisma,
        undefined,  // id
        post.id,
        forUserProfileId,
        BaseDataTypes.activeStatus,
        text)
  }
}
