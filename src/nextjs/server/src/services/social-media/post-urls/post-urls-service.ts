const jsdom = require('jsdom')
const { JSDOM } = jsdom
import puppeteer from 'puppeteer'
import { Readability } from '@mozilla/readability'
import { PrismaClient } from '@prisma/client'
import { CustomError } from '@/serene-core-server/types/errors'
import { PostUrlModel } from '@/models/social-media/post-url-model'

// Models
const postUrlModel = new PostUrlModel()

// Class
export class PostUrlsService {

  // Consts
  clName = 'PostUrlsService'

  // Code
  async extractArticle(url: string) {

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

    const html = await page.content()
    await browser.close()

    const doc = new JSDOM(html, { url })
    const reader = new Readability(doc.window.document)
    const article = reader.parse();

    return {
      title: article?.title || '',
      content: article?.textContent || '',
    }
  }

  async getPending(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getPending()`

    // Get post URLs
    const postUrls = await
            postUrlModel.filter(
              prisma,
              false)  // verified

    // Validate
    if (postUrls == null) {
      throw new CustomError(`${fnName}: postUrls == null`)
    }

    // Fetch and save URLs
    for (const postUrl of postUrls) {

      // Fetch the URL
      var results: any = undefined

      try {
        results = await
          this.extractArticle(postUrl.url)
      } catch (e: any) {

        console.error(`${fnName}: e: ` + JSON.stringify(e))
      }

      // Did the fetch fail, or were no title or text extracted?
      if (results == null ||
          (results.title == null &&
           results.content == null)) {

        continue
      }

      // Save
      await postUrlModel.update(
              prisma,
              postUrl.id,
              undefined,  // url
              true,       // verified
              results.title,
              results.content)
    }
  }
}
