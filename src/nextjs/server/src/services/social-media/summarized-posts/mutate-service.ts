import { Post, PostUrl, PrismaClient, Site, SiteTopicList } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { AgentLlmService } from '@/serene-ai-server/services/llm-apis/agent-llm-service'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { CommentModel } from '@/models/social-media/comment-model'
import { EntityInterestModel } from '@/models/interests/entity-interest-model'
import { InterestTypeModel } from '@/models/interests/interest-type-model'
import { PostInterestsMutateService } from '@/services/interests/post-interests-mutate-service'
import { PostSummaryInsightCommentModel } from '@/models/summaries/post-summary-insight-comment-model'
import { PostSummaryInsightModel } from '@/models/summaries/post-summary-insight-model'
import { PostSummaryModel } from '@/models/summaries/post-summary-model'
import { PostUrlModel } from '@/models/social-media/post-url-model'
import { SiteModel } from '@/models/social-media/site-model'
import { SiteTopicListModel } from '@/models/social-media/site-topic-list-model'
import { SiteTopicListPostModel } from '@/models/social-media/site-topic-list-post-model'

// Models
const commentModel = new CommentModel()
const entityInterestModel = new EntityInterestModel()
const interestTypeModel = new InterestTypeModel()
const postInterestsMutateService = new PostInterestsMutateService()
const postSummaryInsightCommentModel = new PostSummaryInsightCommentModel()
const postSummaryInsightModel = new PostSummaryInsightModel()
const postSummaryModel = new PostSummaryModel()
const postUrlModel = new PostUrlModel()
const siteModel = new SiteModel()
const siteTopicListModel = new SiteTopicListModel()
const siteTopicListPostModel = new SiteTopicListPostModel()

// Services
const agentLlmService = new AgentLlmService()

// Class
export class SummarizePostMutateService {

  // Consts
  clName = 'SummarizePostMutateService'

  // Code
  async deleteInsightsWithComments(
          prisma: PrismaClient,
          postSummaryId: string) {

    // Debug
    const fnName = `${this.clName}.deleteInsightsWithComments()`

    // Get existing insights, if any
    const postSummaryInsights = await
            postSummaryInsightModel.filter(
              prisma,
              postSummaryId)

    // Validate
    if (postSummaryInsights == null) {
      throw new CustomError(`${fnName}: postSummaryInsights == null`)
    }

    // Delete them
    for (const postSummaryInsight of postSummaryInsights) {

      // Delete any existing comments
      await postSummaryInsightCommentModel.deleteByPostSummaryInsightId(
              prisma,
              postSummaryInsight.id)

      // Delete the insight
      await postSummaryInsightModel.deleteById(
              prisma,
              postSummaryInsight.id)
    }
  }

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
          techId: string,
          postId: string,
          queryResults: any) {

    // Extract the summary texts
    var part1 = ''
    var part2: any = null

    if (queryResults.json.part1 != null) {
      part1 = queryResults.json.part1
    }

    if (queryResults.json.part2 != null) {
      part2 = queryResults.json.part2
    }

    // Upsert the PostSummary
    const postSummary = await
            postSummaryModel.upsert(
              prisma,
              undefined,  // id
              postId,
              forUserProfileId,
              techId,
              BaseDataTypes.activeStatus,
              part1)

    // Delete any exising insights and comments, to prevent conflicts from a
    // previous summary
    await this.deleteInsightsWithComments(
            prisma,
            postSummary.id)

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

    // Process post interests
    await postInterestsMutateService.process(
            prisma,
            postId,
            queryResults)

    // Return
    return postSummary
  }

  async run(prisma: PrismaClient,
            userProfileId: string,
            forUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.run()`

    // Get SiteTopicLists to summarize posts for.
    const siteTopicLists = await
            siteTopicListModel.getLatestByNewStatusAndDaysAgo(
              prisma,
              7)  // startingDaysAgo

    // Validate
    if (siteTopicLists == null) {
      throw new CustomError(`${fnName}: siteTopicLists == null`)
    }

    // Debug
    console.log(`${fnName}: siteTopicLists: ${siteTopicLists.length}`)

    // Summarize posts for each list
    for (const siteTopicList of siteTopicLists) {

      // Get posts to summarize
      const siteTopicListPosts = await
              siteTopicListPostModel.filter(
                prisma,
                siteTopicList.id,
                true,  // includePosts
                true)  // includePostSummaries

      // Validate
      if (siteTopicListPosts == null) {
        throw new CustomError(`${fnName}: siteTopicListPosts == null`)
      }

      // Debug
      console.log(`${fnName}: siteTopicListPosts for siteTopicListId: ` +
                  `${siteTopicList.id}: ${siteTopicListPosts.length}`)

      // Summarize posts without being user specific
      for (const siteTopicListPost of siteTopicListPosts) {

        await this.summarizePost(
                prisma,
                siteTopicList,
                siteTopicListPost,
                userProfileId,
                forUserProfileId)
      }

      // Update SiteTopicList to Active
      const updatedSiteTopicList = await
              siteTopicListModel.update(
                prisma,
                siteTopicList.id,
                undefined,    // siteTopicId
                undefined,    // techId
                undefined,    // rankingType
                undefined,    // listed
                BaseDataTypes.activeStatus)
    }
  }

  async summarizePost(
          prisma: PrismaClient,
          siteTopicList: SiteTopicList,
          siteTopicListPost: any,
          userProfileId: string,
          forUserProfileId: string) {

    // Debug
    const fnName = `${this.clName}.summarizePost()`

    console.log(`${fnName}: siteTopicListPost.id: ${siteTopicListPost.id}`)

    // Skip those with existing summaries, or recently summarized
    if (siteTopicListPost.postSummary != null) {

      // Get the time since last summarized
      const duration =
              this.getDurationFrom(siteTopicListPost.postSummary.updated)

      // Debug
      // console.log(`${fnName}: duration: ` + JSON.stringify(duration))

      // Don't summarize anymore after 1 day
      if (duration.days >= 1) {

        await postSummaryModel.update(
                prisma,
                siteTopicListPost.postSummary.id,
                siteTopicListPost.post.id,
                forUserProfileId,
                undefined,  // techId
                BaseDataTypes.inactiveStatus,
                undefined)  // postSummary

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
              siteTopicListPost.post.siteId)

    // Validate
    if (site == null) {
      throw new CustomError(`${fnName}: site == null`)
    }

    // Summarize post
    const postSummary = await
            this.summarizePostWithLlm(
              prisma,
              siteTopicList,
              userProfileId,
              forUserProfileId,
              site,
              siteTopicListPost.post,
              siteTopicListPost.postSummary)

    // Validate
    if (postSummary == null) {
      // Skip, could have been due to PROHIBITED_CONTENT (Gemini)
      return
    }

    // Update SiteTopicListPost
    siteTopicListPost = await
      siteTopicListPostModel.update(
        prisma,
        siteTopicListPost.id,
        undefined,  // siteTopicListId
        undefined,  // postId
        postSummary.id,
        undefined)  // index
  }

  async summarizePostWithLlm(
          prisma: PrismaClient,
          siteTopicList: SiteTopicList,
          userProfileId: string,
          forUserProfileId: string,
          site: Site,
          post: Post,
          postSummary: any | null) {

    // Debug
    const fnName = `${this.clName}.summarizePostWithLlm()`

    // console.log(`${fnName}: starting with postSummary: ` +
    //             JSON.stringify(postSummary))

    // Get tech from the listing
    const tech = (siteTopicList as any).tech

    // Validate
    if (tech == null) {
      throw new CustomError(`${fnName}: tech == null`)
    }

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

    // Get InterestTypes
    const interestTypes = await
            interestTypeModel.filter(prisma)

    if (interestTypes == null) {
      throw new CustomError(`${fnName}: interestTypes == null`)
    }

    // Get EntityInterests
    const entityInterests = await
            entityInterestModel.filter(
              prisma,
              undefined,  // interestTypeId
              siteTopicList.siteTopicId,
              false)      // includeInterestTypes

    if (entityInterests == null) {
      throw new CustomError(`${fnName}: entityInterests == null`)
    }

    if (entityInterests.length === 0) {
      // Not yet ready to summarize posts
      console.log(`${fnName}: entityInterests.length === 0 (not ready)`)
      return null
    }

    /* Debug
    if (entityInterests.length > 0) {
      console.log(`${fnName}: entityInterests: ` +
                  JSON.stringify(entityInterests))

      throw new CustomError(`${fnName}: STOP TO TEST`)
    } */

    // Define the prompt
    var prompt =
          `# Prompt\n` +
          `\n` +
          `## General instructions\n` +
          `- Summarize the following post into 2 parts, each a markdown ` +
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
          `- Don't consider comments that are too terse, unhelpful or ` +
          `  proven wrong by follow-on comments.\n` +
          `- Add a list of interests from the entityInterests list provided.` +
          `  You may add one interest that's not in the list if it's ` +
          `  relevant.\n` +
          `\n` +
          `Entity interests: ` + JSON.stringify(entityInterests) + `\n` +
          `Interest types: ` + JSON.stringify(interestTypes) + `\n` +
          `\n`

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
      `  "interests": [\n` +
      `    {\n` +
      `      "interestTypeId": "..",\n` +
      `      "interestName": ".."\n` +
      `    }\n` +
      `  ]\n` +
      `}\n` +
      `\n` +
      `- The value part1 must be a string.\n` +
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

    // Debug
    // console.log(`${fnName}: prompt: ${prompt}`)

    // LLM request (try 5 times)
    var queryResults: any = undefined

    for (var i = 0; i < 5; i++) {

      // LLM request
      try {
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
      } catch(e: any) {

        // For now skip the post summary if the LLM call fails
        continue
      }

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

      // Verify interestTypeIds
      const interestTypeIdsExist = await
              postInterestsMutateService.verifyInterestTypeIds(
                prisma,
                queryResults.json.interests)

      if (interestTypeIdsExist.status === false) {
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

      return null
    }

    // Process results
    postSummary = await
      this.processResults(
        prisma,
        forUserProfileId,
        tech.id,
        post.id,
        queryResults)

    // Return
    return postSummary
  }
}
