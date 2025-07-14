import { SignIn } from '@aiconstrux/client'

export class AiConstruxDetails {

  // API access
  static apiKey = process.env.AIC_APIKEY!
  static secret = process.env.AIC_SECRET!

  // User/project
  static userProfileId = process.env.USER_PROFILE_ID!
  static projectEnvId = process.env.PROJECT_ENV_ID!

  // Sign-in
  static signIn: SignIn = {
    apiKey: this.apiKey,
    secret: this.secret,
    projectEnvId: this.projectEnvId
  }

  // Agents
  static queryAgentId = process.env.QUERY_AGENT_ID!

  // Entities
  ;
}
