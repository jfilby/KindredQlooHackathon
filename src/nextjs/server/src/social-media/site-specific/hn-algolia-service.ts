import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { CommentModel } from '@/models/social-media/comment-model'
import { PostModel } from '@/models/social-media/post-model'
import { PostUrlModel } from '@/models/social-media/post-url-model'

// Models
const commentModel = new CommentModel()
const postModel = new PostModel()
const postUrlModel = new PostUrlModel()

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
    console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Save each hit as a post
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

      // Get top comments for the post
      for (const commentId of hit.children) {

        // Fetch comments
        const commentsResults = await
                this.fetch(`api/v1/items/${commentId}`)

        if (results.status === false) {
          continue
        }

        // Debug
        console.log(`${fnName}: commentsResults: ` +
                    JSON.stringify(commentsResults))

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
