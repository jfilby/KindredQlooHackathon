import { CustomError } from '@/serene-core-server/types/errors'

export class HackerNewService {

  // Consts
  clName = 'HackerNewService'

  // Code
  async fetch(path: string) {

    // Debug
    const fnName = `${this.clName}.fetch()`

    // Header
    var headers: any = {
      'Content-Type': 'application/json',
    }

    // Determine URL
    const baseUrl = `https://hacker-news.firebaseio.com/${path}`

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

        console.error(`${fnName}: status: ${response.status}: ` +
                      `${response.statusText}`)

        const errorData = await response.json()

        console.error(`${fnName}: errorData: ` + JSON.stringify(errorData))
        throw new Error(`${fnName}: error: ${response.status} ` +
                        `${response.statusText}`)
      }

    } catch (error) {
      console.error(`${fnName}: error calling local API:`, error)
    }
  }

  /* async getAllPendingItems() {

    // Get a batch of pending items
    ;

    // Get each item
    for (const itemId of itemIds) {

      await this.getItem(itemId)
    }
  } */

  async getItem(itemId: string) {

    // Debug
    const fnName = `${this.clName}.getItem()`

    // Fetch results
    const results = await
            this.fetch(`v0/item/${itemId}.json`)

    // Debug
    console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Save the item
    ;

    // Get each comment
    ;
  }

  async getStories(storyType: string) {

    // Debug
    const fnName = `${this.clName}.getStories()`

    // Determine path by storyType
    if (!['best', 'top'].includes(storyType)) {

      throw new CustomError(`${fnName}: invalid storyType: ${storyType}`)
    }

    // Fetch results
    const results = await
            this.fetch(`v0/${storyType}stories.json`)

    // Debug
    console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Validate
    if (!Array.isArray(results)) {
      throw new CustomError(`${fnName}: results isn't an array`)
    }

    // Get each item (post)
    for (const itemId of results) {

      // Get the item by id
      await this.getItem(itemId)
    }
  }

  async import() {

    // Get best stories
    await this.getStories('best')

    // Get top stories
    await this.getStories('top')

    // Get all items
    // await this.getAllPendingItems()
  }
}
