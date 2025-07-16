import { CustomError } from '@/serene-core-server/types/errors'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import { AgentUserModel } from '@/serene-ai-server/models/agents/agent-user-model'

// Models
const agentUserModel = new AgentUserModel()

// Class
export class AgentUserService {

  // Consts
  clName = 'AgentUserService'

  // Code
  async getDefaultAgentUserForChatSettings(prisma: any) {

    // Debug
    const fnName = `${this.clName}.getDefaultAgentUserForChatSettings()`

    // Upsert Agent record
    const agentUser = await
            agentUserModel.upsert(
              prisma,
              undefined,                        // id
              BaseDataTypes.batchAgentRefId,   // uniqueRefId
              BaseDataTypes.batchAgentName,
              BaseDataTypes.batchAgentRole,
              10,                               // maxPrevMessages
              null)                             // defaultPrompt

    if (agentUser == null) {
      console.error(`${fnName}: agentUser == null`)
      throw new CustomError(`${fnName}: agentUser == null`)
    }

    return {
      agentUser: agentUser
    }
  }
}
