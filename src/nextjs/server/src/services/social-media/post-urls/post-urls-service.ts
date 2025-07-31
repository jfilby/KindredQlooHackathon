const jsdom = require('jsdom')
const { JSDOM } = jsdom
import puppeteer, { Browser } from 'puppeteer'
import { Readability } from '@mozilla/readability'
import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { PostUrlModel } from '@/models/social-media/post-url-model'

// Models
const postUrlModel = new PostUrlModel()

// Class
export class PostUrlsService {

  // Consts
  clName = 'PostUrlsService'

  // Code
  async extractArticle(url: string) {

    // Debug
    const fnName = `${this.clName}.extractArticle()`

    console.log(`${fnName}: starting with url: ${url}`)

    // Validate
    if (url == null) {
      return null
    }

    // Get content with Puppeteer
    // Note: empty exceptions could occur if any necessary OS packages are not
    // installed.
    var browser: Browser | undefined = await
          puppeteer.launch({ headless: true })

    // console.log(`${fnName}: browser launched`)

    // Wrapped in a try/catch block to prevent zombie processes left in case of
    // failure.
    var article: any = undefined

    try {
      // Process the page
      const page = await browser.newPage()

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

      const html = await page.content()

      await browser.close()
      browser = undefined

      // Debug
      // console.log(`${fnName}: browser closed OK`)

      const doc = new JSDOM(html, { url })

      // Parse with Readability
      const reader = new Readability(doc.window.document)
      article = reader.parse()

      // Debug
      // console.log(`${fnName}: page parsed OK`)

    } catch(e: any) {

      // Gracefully handle the exception
      console.error(`${fnName}: e: `, e)

    } finally {
      // Always close the browser if not already closed
      if (browser != null) {
        await browser.close()
      }
    }

    // Handle a null article
    if (article == null) {
      return null
    }

    // Remove redundant tab chars and set nulls to blank strings
    if (article.title == null) {
      article.title = ''
    }

    if (article.textContent != null) {
      article.textContent = article.textContent.replace(/\t+/g, '\t')
    } else {
      article.textContent = ''
    }

    // Return
    return {
      title: article.title,
      content: article.textContent
    }
  }

  async getPending(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getPending()`

    // Get post URLs
    const postUrls = await
            postUrlModel.filter(
              prisma,
              BaseDataTypes.newStatus)

    // Validate
    if (postUrls == null) {
      throw new CustomError(`${fnName}: postUrls == null`)
    }

    // Fetch and save URLs
    for (const postUrl of postUrls) {

      // Fetch the URL
      var results: any = undefined

      try {

        // Debug
        // console.log(`${fnName}: postUrl: ` + JSON.stringify(postUrl))

        // Extract title and content
        results = await
          this.extractArticle(postUrl.url)
      } catch (e: any) {

        console.error(`${fnName}: e: ` + JSON.stringify(e))
      }

      // Did the fetch fail, or were no title or text extracted?
      var status: string = BaseDataTypes.activeStatus
      var title: string | null = null
      var content: string | null = null

      if (results == null ||
          (results.title == null &&
           results.content == null)) {

        // Failed
        status = BaseDataTypes.failedStatus
      } else {
        title = results.title
        content = results.content
      }

      // Save
      await postUrlModel.update(
              prisma,
              postUrl.id,
              undefined,  // url
              status,
              title,
              content)
    }
  }
}
