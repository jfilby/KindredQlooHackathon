import { prisma } from '@/db'
import { CustomError } from '@/serene-core-server/types/errors'
import { SummarizedPostQueryInsightCommentsService } from '@/services/social-media/summarized-post-insight-comments/query-service'

// Services
const summarizedPostQueryInsightCommentsService = new SummarizedPostQueryInsightCommentsService()

// Code
export async function getPostSummaryInsightComments(
                        parent: any,
                        args: any,
                        context: any,
                        info: any) {

  // Debug
  const fnName = `getPostSummaries()`

  // Validate
  if (args.postSummaryInsightId == null) {
    throw new CustomError(`${fnName}: args.postSummaryInsightId == null`)
  }

  // Filter
  const results = await
          summarizedPostQueryInsightCommentsService.filter(
            prisma,
            args.postSummaryInsightId)

  // Return
  return results
}
