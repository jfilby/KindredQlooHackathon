import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { CommentModel } from '@/models/social-media/comment-model'
import { PostModel } from '@/models/social-media/post-model'
import { PostUrlModel } from '@/models/social-media/post-url-model'
import { SiteTopicListModel } from '@/models/social-media/site-topic-list-model'
import { SiteTopicListPostModel } from '@/models/social-media/site-topic-list-post-model'
import { SiteTopicModel } from '@/models/social-media/site-topic-model'
import { GetTechService } from '@/services/tech/get-tech-service'

// Models
const commentModel = new CommentModel()
const postModel = new PostModel()
const postUrlModel = new PostUrlModel()
const siteTopicModel = new SiteTopicModel()
const siteTopicListModel = new SiteTopicListModel()
const siteTopicListPostModel = new SiteTopicListPostModel()

// Services
const getTechService = new GetTechService()

// Class
export class HackerNewAlgoliaService {

  // Consts
  clName = 'HackerNewAlgoliaService'

  // Code
  async fetch(path: string) {

    // Debug
    const fnName = `${this.clName}.fetch()`

    // Header
    var headers: any = {
      'Content-Type': 'application/json',
    }

    // Determine URL
    const baseUrl = `http://hn.algolia.com/${path}`

    // Debug
    // console.log(`${fnName}: sending POST request to: ` + baseUrl)
    // console.log(`${fnName}: body: ` + JSON.stringify(bodyJson))

    // Fetch
    try {
      const response = await
              fetch(
                baseUrl,
                {
                  method: 'GET',
                  headers: headers
                })

      if (response.ok) {

        return await response.json()

      } else {

        // Response error handling
        console.error(`${fnName}: status: ${response.status}: ` +
                      `${response.statusText}`)

        const errorData = await response.json()

        console.error(`${fnName}: path: ${path} errorData: ` +
                      JSON.stringify(errorData))

        return {
          status: false,
          responseStatus: response.status
        }
      }

    } catch (error) {
      console.error(`${fnName}: error calling local API:`, error)
    }
  }

  async getFrontPageStories(
          prisma: PrismaClient,
          siteId: string) {

    // Debug
    const fnName = `${this.clName}.getStories()`

    // Fetch
    const results = await
            this.fetch(`api/v1/search?tags=front_page`)

    // Handle errors
    if (results.status === false) {
      return results
    }

    // Debug
    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Get the SiteTopic for HN front-page
    const siteTopic = await
            siteTopicModel.getByUniqueKey(
              prisma,
              siteId,
              'front-page')  // name

    // Validate
    if (siteTopic == null) {
      throw new CustomError(`${fnName}: siteTopic == null`)
    }

    // Get the LLM
    const tech = await
            getTechService.getStandardLlmTech(
              prisma,
              undefined)

    // Validate
    if (tech == null) {
      throw new CustomError(`${fnName}: tech == null`)
    }

    // Define the listing date/time
    const listed = new Date()

    // Define the ranking type
    const rankingType = 'front-page'

    // Check if this has been done recently, if so skip creating a new
    // SiteTopicList.
    var siteTopicList = await
          siteTopicListModel.getRecentlyCreated(
            prisma,
            siteTopic.id,
            tech.id,
            rankingType,
            ServerOnlyTypes.listingFreqInHours)  // hoursAgo

    if (siteTopicList != null) {
      return
    }

    // Create SiteTopicList
    siteTopicList = await
      siteTopicListModel.create(
        prisma,
        siteTopic.id,
        tech.id,
        rankingType,
        listed,
        BaseDataTypes.newStatus)

    // Save each hit as a post
    var index = 0

    for (const hit of results.hits) {

      // Get/create PostUrl
      var postUrl: any = null

      if (hit.url != null) {

        postUrl = await
          postUrlModel.getByUniqueKey(
            prisma,
            hit.url)

        if (postUrl == null) {

          postUrl = await
            postUrlModel.create(
              prisma,
              hit.url,
              false,  // verified
              null,   // title
              null)   // text
        }
      }

      // Upsert Post
      const post = await
              postModel.upsert(
                prisma,
                undefined,  // id
                siteId,
                postUrl.id,
                hit.objectID,
                hit.title,
                hit.created_at,
                null)       // checkedComments

      // Create SiteTopicListPost
      await siteTopicListPostModel.create(
              prisma,
              siteTopicList.id,
              post.id,
              null,  // postSummaryId
              index)

      // Inc index
      index += 1

      // Get top comments for the post
      for (const commentId of hit.children) {

        // Fetch comments
        const commentsResults = await
                this.fetch(`api/v1/items/${commentId}`)

        if (results.status === false) {
          continue
        }

        // Debug
        // console.log(`${fnName}: commentsResults: ` +
        //             JSON.stringify(commentsResults))

        // Children
        if (commentsResults.children == null) {
          continue
        }

        // Upsert each comment
        for (const item of commentsResults.children) {

          // Validate
          if (item.text == null) {
            continue
          }

          // Upsert Comment
          const comment = await
                  commentModel.upsert(
                    prisma,
                    undefined,  // id
                    null,       // parentId
                    post.id,
                    item.id.toString(),
                    item.text,
                    item.created_at)

          // Children?
          if (item.children == null) {
            continue
          }

          // Go 1-level down
          for (const childItem of item.children) {

            // Validate
            if (childItem.text == null) {
              continue
            }

            // Upsert Comment
            const childComment = await
                    commentModel.upsert(
                      prisma,
                      undefined,   // id
                      comment.id,  // parentId
                      post.id,
                      childItem.id.toString(),
                      childItem.text,
                      childItem.created_at)
          }
        }
      }
    }
  }
}
