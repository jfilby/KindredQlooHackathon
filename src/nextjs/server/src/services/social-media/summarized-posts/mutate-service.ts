import { Post, PostUrl, PrismaClient, Site } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { CommentModel } from '@/models/social-media/comment-model'
import { PostModel } from '@/models/social-media/post-model'
import { PostSummaryInsightCommentModel } from '@/models/summaries/post-summary-insight-comment-model'
import { PostSummaryInsightModel } from '@/models/summaries/post-summary-insight-model'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { PostUrlModel } from '@/models/social-media/post-url-model'
import { SiteModel } from '@/models/social-media/site-model'
import { GetTechService } from '@/services/tech/get-tech-service'

// Models
const commentModel = new CommentModel()
const postModel = new PostModel()
const postSummaryInsightCommentModel = new PostSummaryInsightCommentModel()
const postSummaryInsightModel = new PostSummaryInsightModel()
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

  getTopCommentsAsString(topComments: any[]): string {

    // Build the string
    var text = ''

    for (const topComment of topComments) {

      if (topComment.name == null ||
          topComment.description == null) {

        continue
      }

      if (text.length > 0) {
        text += `\n`
      }

      text += `- **${topComment.name}**: ${topComment.description}`
    }

    // Return
    return text
  }

  async processResults(
          prisma: PrismaClient,
          forUserProfileId: string,
          postId: string,
          queryResults: any) {

    // Extract the summary texts
    var part1 = ''
    var part2: any = null
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
    const postSummary = await
            postSummaryModel.upsert(
              prisma,
              undefined,  // id
              postId,
              forUserProfileId,
              BaseDataTypes.activeStatus,
              part1,
              part3)

    // Upserts into PostSummaryInsight
    if (part2 != null) {

      var insightIndex = 0

      for (const insight of part2) {

        // Debug
        // console.log(`${fnName}: insight: ` + JSON.stringify(insight))

        // Upsert
        const postSummaryInsight = await
                postSummaryInsightModel.upsert(
                  prisma,
                  undefined,  // id
                  postSummary.id,
                  insightIndex,
                  insight.name,
                  insight.description)

        // Comments?
        if (insight.commentIds != null) {

          // Upsert comments
          var commentIndex = 0
          var commentIds: string[] = []

          for (const commentId of insight.commentIds) {

            // Already processed for this insight?
            if (commentIds.includes(commentId)) {
              continue
            }

            commentIds.push(commentId)

            // Verify comment id
            const commentExists = await
                    commentModel.existsById(
                      prisma,
                      commentId)

            if (commentExists === true) {

              const comment = await
                      postSummaryInsightCommentModel.upsert(
                        prisma,
                        undefined,  // id
                        postSummaryInsight.id,
                        commentId,
                        commentIndex)

              commentIndex += 1
            }
          }
        }

        // Inc insightIndex
        insightIndex += 1
      }
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
              7)  // startingDaysAgo

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
          postSummary: any | null) {

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
          `- Field part2 should be an array of the top insightful comments ` +
          `  or points (3 at most, each with a name and description). Each ` +
          `  point's description should be two sentences at most.\n` +
          `  Each insight in part2 should be backed up by up to 5 ` +
          `  commentIds (get from the id field of the comments).\n` +
          `- Field part3 should be a summary about the remaining comments. ` +
          `  3 sentences at most and don't duplicate anything ` +
          `  already written.\n ` +
          `- Don't consider comments that are too terse, unhelpful or ` +
          `  proven wrong by follow-on comments.\n`

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
      `  "part2": [\n` +
      `    {\n` +
      `      name: "insight 1",\n` +
      `      description: "..",\n` +
      `      commentIds: [ "clid349538458" ]\n` +
      `    {\n` +
      `  ],\n` +
      `  "part3": "...\n"\n` +
      `}\n` +
      `\n` +
      `- Values for fields part1, part2 and part3 must be strings.\n` +
      `\n`

    // Existing summary post?
    if (postSummary != null) {

      // Existing post summary text
      prompt +=
        `## Existing post summary\n` +
        `### Part 1 (post summary)` +
        `${postSummary.postSummary ?? ''}\n` +
        `\n` +
        `### Part 2 (top comments)\n` +
        `${JSON.stringify(postSummary.ofPostSummaryComments)}\n` +
        `\n` +
        `### Part 3 (other comments)\n` +
        `${postSummary.otherComments ?? ''}\n` +
        `\n\n`
    }

    // Social-media post
    prompt +=
      `## ${site.name} post\n` +
      post.title +
      `\n` +
      `The post is: ` + JSON.stringify(postJson) +
      `\n\n`

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

      // Part 2 must be an array
      if (queryResults.json.part2 != null &&
          !Array.isArray(queryResults.json.part2)) {

        console.log(`${fnName}: queryResults.json.part2 isn't an array`)
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

    // Process results
    await this.processResults(
            prisma,
            forUserProfileId,
            post.id,
            queryResults)
  }
}
