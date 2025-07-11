import { PrismaClient } from '@prisma/client'
import { QlooUtilsFetchService } from './qloo-fetch-service'
import { QlooTagTypeModel } from '@/models/qloo/qloo-tag-type-model'

// Models
const qlooTagTypeModel = new QlooTagTypeModel()

// Services
const qlooUtilsFetchService = new QlooUtilsFetchService()

// Class
export class GetQlooTagTypesService {

  // Consts
  clName = 'GetQlooTagTypesService'

  // Code
  async get() {

    // Debug
    const fnName = `${this.clName}.get()`

    // Initial URL
    var uri = `/v2/tags/types?`

    // Fetch
    const results = await
            qlooUtilsFetchService.fetch(uri)

    // Return
    return results
  }

  async getAndSave(prisma: PrismaClient) {

    // Debug
    const fnName = `${this.clName}.getAndSave()`

    // Are the tag types already loaded
    const count = await
            qlooTagTypeModel.count(prisma)

    if (count > 0) {
      console.log(`${fnName}: Qloo tag types already exist, skipping..`)
      return
    }

    // Get the tag types
    const results = await this.get()

    // Save the tag types
    for (const tag_type of results.results.tag_types) {

      const entityTypes = tag_type.parents.map((p: any) => p.type)

      const qlooTagType = await
              qlooTagTypeModel.upsert(
                prisma,
                undefined,      // id
                tag_type.type,  // urn
                entityTypes)
    }
  }
}
