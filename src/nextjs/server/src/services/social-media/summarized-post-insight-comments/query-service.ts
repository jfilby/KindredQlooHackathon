const he = require('he')
const sanitizeHtml = require('sanitize-html')
import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { StringUtilsService } from '@/serene-core-server/services/utils/string-utils-service'
import { ServerOnlyTypes } from '@/types/server-only-types'
import { PostSummaryInsightCommentModel } from '@/models/summaries/post-summary-insight-comment-model'

// Models
const postSummaryInsightCommentModel = new PostSummaryInsightCommentModel()

// Services
const stringUtilsService = new StringUtilsService()

// Class
export class SummarizedPostQueryInsightCommentsService {

  // Consts
  clName = 'SummarizedPostQueryInsightCommentsService'

  // Code
  async filter(
          prisma: PrismaClient,
          postSummaryInsightId: string) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Filter
    const postSummaryInsightComments = await
            postSummaryInsightCommentModel.filter(
              prisma,
              postSummaryInsightId,
              true)  // includeComments

    // Validate
    if (postSummaryInsightComments == null) {
      throw new CustomError(`${fnName}: postSummaryInsightComments == null`)
    }

    // Set URL for each comment
    for (const postSummaryInsightComment of postSummaryInsightComments) {

      // Get comment as any
      var comment: any = postSummaryInsightComment.comment

      // Validate
      if (comment == null) {
        continue
      }

      // Process text
      this.processText(comment)

      // Get URL
      this.getUrl(comment)
    }

    // Return
    return {
      status: true,
      postSummaryInsightComments: postSummaryInsightComments
    }
  }

  processText(comment: any) {

    // Shorten text
    comment.text =
      stringUtilsService.getSnippet(
        comment.text,
        255)

    // Sanitize HTML
    comment.text =
      sanitizeHtml(
        comment.text,
        {
          allowedTags: [],
          allowedAttributes: {}
        })

    // Process with he
    comment.text =
      he.decode(
        comment.text,
        {
          'encodeEverything': true
        })
  }

  getUrl(comment: any) {

    comment.url =
      ServerOnlyTypes.socialMediaCommentUrls[comment.post.site.name].replace(
        '{externalId}',
        comment.externalId)
  }
}
