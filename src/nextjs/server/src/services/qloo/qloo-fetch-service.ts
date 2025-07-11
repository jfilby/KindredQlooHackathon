import { CustomError } from '@/serene-core-server/types/errors'
import { QlooApiDetails } from '@/types/qloo-types'

export class QlooUtilsFetchService {

  // Consts
  clName = 'QlooUtilsFetchService'

  // Code
  async fetch(uri: string) {

    // Debug
    const fnName = `${this.clName}.fetch()`

    console.log(`${fnName}: uri: ${uri}`)

    // Validate
    if (QlooApiDetails.apiUrl == null) {
      throw new CustomError(`${fnName}: Qloo API url isn't set`)
    }
    
    if (QlooApiDetails.apiKey == null) {
      throw new CustomError(`${fnName}: Qloo API key isn't set`)
    }

    // Define the full URL
    var url = `${QlooApiDetails.apiUrl}${uri}`

    // Debug
    console.log(`${fnName}: url: ${url}`)

    // Fetch
    try {
      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': QlooApiDetails.apiKey!
          }
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
}
