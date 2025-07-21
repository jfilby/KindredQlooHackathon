import { Post, PostSummary, PostUrl, PrismaClient, Site } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { CommentModel } from '@/models/social-media/comment-model'
import { PostModel } from '@/models/social-media/post-model'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { PostUrlModel } from '@/models/social-media/post-url-model'
import { SiteModel } from '@/models/social-media/site-model'
import { GetTechService } from '@/services/tech/get-tech-service'

// Models
const commentModel = new CommentModel()
const postModel = new PostModel()
const postSummaryModel = new PostSummaryModel()
const postUrlModel = new PostUrlModel()
const siteModel = new SiteModel()

// Services
const agentLlmService = new AgentLlmService()
const getTechService = new GetTechService()

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

    /* if (postSummary == null) {
      console.log(`${fnName}: postSummary == null for postId: ` + post.id)
    } */

    if (postSummary != null) {

      // Get the time since last summarized
      const duration = this.getDurationFrom(postSummary.updated)

      // Debug
      // console.log(`${fnName}: duration: ` + JSON.stringify(duration))

      // Don't summarize anymore after 1 day
      if (duration.days >= 1) {

        await postSummaryModel.update(
                prisma,
                postSummary.id,
                post.id,
                forUserProfileId,
                BaseDataTypes.inactiveStatus,
                undefined,  // postSummary
                undefined,  // topComments
                undefined)  // otherComments

        return
      }

      // Don't summarize yet if not yet 4 hours since last summarized
      if (duration.hours < 4) {
        return
      }
    }

    // Debug
    // console.log(`${fnName}: proceeding to summarize..`)

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

    // console.log(`${fnName}: starting with postSummary: ` +
    //             JSON.stringify(postSummary))

    // Get the LLM
    const tech = await
            getTechService.getStandardLlmTech(
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
          `- Summarize the following post into 3 parts, each a markdown ` +
          `  string, but don't mention that it's a summary or that it's in ` +
          `  markdown.\n` +
          `- Write in the style of a ${site.name} top commenter.\n` +
          `- Don't use headings. Only use bold text if directed to.\n` +
          `- Field part1 should be a summary of the url content and/or ` +
          `  the post. It should be 1-3 sentences at most, written in ` +
          `  clear, concise language that doesn't waffle and shouldn't ` +
          `  include anything not obvious from reading the title.\n` +
          `- If part1 would be redundant (of the title) then skip it, ` +
          `  unless the title is only a word or term (then you should ` +
          `  explain what it means, unless there's nothing to go on).\n` +
          `- Field part2 should be bullet points of the top insightful ` +
          `  comments (3 at most, each on a new line, with context if ` +
          `  needed). Each point should be two sentences at most.\n` +
          `- Field part3 should be a summary about the remaining comments. ` +
          `  3 sentences at most and don't duplicate anything ` +
          `  already written.\n ` +
          `- Don't consider comments that are too terse, unhelpful or ` +
          `  proven wrong by follow-on comments.\n` +
          `- Bulleted points should start with bold terms that are key to ` +
          `  scanning the summary quickly, e.g.: **Tech**: this is ...\n`

    // Existing summary post?
    if (postSummary != null) {

      // Continue general instructions
      prompt +=
        `- There's an existing post summary, try to only update it if ` +
        `  needed.\n`
    }

    // Results
    prompt += 
      `## Results\n` +
      `Format your results as follows:\n` +
      `{\n` +
      `  "part1": "...\n",\n` +
      `  "part2": "- ...\n- ...\n- ...\n",\n` +
      `  "part3": "...\n"\n` +
      `}\n` +
      `\n` +
      `- Values for fields part1, part2 and part3 must be strings.\n` +
      `- The part2 field isn't an array, just a string.\n` +
      `\n`

    // Existing summary post?
    if (postSummary != null) {

      // Existing post summary text
      prompt +=
        `## Existing post summary\n` +
        `### Part 1 (post summary)` +
        `${postSummary.postSummary ?? ''}` +
        `\n` +
        `### Part 2 (top comments)` +
        `${postSummary.topComments ?? ''}` +
        `\n` +
        `### Part 3 (other comments)` +
        `${postSummary.otherComments ?? ''}` +
        `\n\n`
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

    // LLM request (try 5 times)
    var queryResults: any = undefined

    for (var i = 0; i < 5; i++) {

      // LLM request
      queryResults = await
        agentLlmService.agentSingleShotLlmRequest(
          prisma,
          tech,
          userProfileId,
          null,       // instanceId
          ServerOnlyTypes.defaultChatSettingsName,
          BaseDataTypes.batchAgentRefId,
          BaseDataTypes.batchAgentName,
          BaseDataTypes.batchAgentRole,
          prompt,
          true)       // isJsonMode

      // Validate
      if (queryResults == null) {
        console.log(`${fnName}: queryResults == null`)
        continue
      }

      if (queryResults.json == null) {
        console.log(`${fnName}: queryResults.json == null`)
        console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))
        continue
      }

      // Common mistake LLMs sometimes make is to make the top comments into an
      // array.
      if (queryResults.json.part2 != null &&
          Array.isArray(queryResults.json.part2)) {

        console.log(`${fnName}: queryResults.json.part2 is an array`)
        continue
      }

      // Passed validation
      break
    }

    // Debug
    // console.log(`${fnName}: queryResults: ` + JSON.stringify(queryResults))

    // Time-out?
    if (queryResults == null) {

      console.warn(`${fnName}: timed-out trying to summarize post: ` +
                   `${post.id} with an LLM`)

      return
    }

    // Extract the summary texts
    var part1 = ''
    var part2 = ''
    var part3 = ''

    if (queryResults.json.part1 != null) {
      part1 = queryResults.json.part1
    }

    if (queryResults.json.part2 != null) {
      part2 = queryResults.json.part2
    }

    if (queryResults.json.part3 != null) {
      part3 = queryResults.json.part3
    }

    // Upsert the PostSummary
    postSummary = await
      postSummaryModel.upsert(
        prisma,
        undefined,  // id
        post.id,
        forUserProfileId,
        BaseDataTypes.activeStatus,
        part1,
        part2,
        part3)
  }
}
