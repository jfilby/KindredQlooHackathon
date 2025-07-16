// Serene Core query imports
import { isAdminUser } from '@/serene-core-server/apollo/resolvers/queries/access'
// import { getOrCreateChatSession } from '@/serene-ai-server/apollo/resolvers/mutations/chats'
// import { getTipsByUserProfileIdAndTags, tipGotItExists } from '@/serene-core-server/apollo/resolvers/queries/tips'

// Serene Core mutations imports
// import { getChatMessages, getChatSessions } from '@/serene-ai-server/apollo/resolvers/queries/chats'
import { createBlankUser, createUserByEmail, getOrCreateSignedOutUser, getOrCreateUserByEmail } from '@/serene-core-server/apollo/resolvers/mutations/users'
import { validateProfileCompleted } from '@/serene-core-server/apollo/resolvers/queries/profile'
// import { deleteTipGotIt, upsertTipGotIt } from '@/serene-core-server/apollo/resolvers/mutations/tips'
import { userById, verifySignedInUserProfileId } from '@/serene-core-server/apollo/resolvers/queries/users'
import { getUserPreferences } from '@/serene-core-server/apollo/resolvers/queries/user-preferences'
import { upsertUserPreference } from '@/serene-core-server/apollo/resolvers/mutations/user-preferences'

// Kindred queries imports
import { getPostSummaries } from './queries/post-summaries'

// Kindred mutations imports
import { loadServerStartData } from './mutations/server-data-start'

// Code
const Query = {

  // Serene Core
  // ---

  // Chats
  // getChatMessages,
  // getChatParticipants,
  // getChatSession,

  // Profile
  validateProfileCompleted,

  // Quotas
  // getResourceQuotaUsage,

  // Tech
  // getTechs,

  // Tips
  // getTipsByUserProfileIdAndTags,
  // tipGotItExists,

  // Users
  isAdminUser,
  userById,
  verifySignedInUserProfileId,

  // User preferences
  getUserPreferences,

  // Kindred
  // ---

  getPostSummaries
}

const Mutation = {

  // Serene Core
  // ---

  // Chats
  // getOrCreateChatSession,

  // Tips
  // deleteTipGotIt,
  // upsertTipGotIt,

  // Users
  createBlankUser,
  createUserByEmail,
  getOrCreateSignedOutUser,
  getOrCreateUserByEmail,

  // User preferences
  upsertUserPreference,

  // Kindred
  // ---

  loadServerStartData
}

const resolvers = { Query, Mutation }

export default resolvers
