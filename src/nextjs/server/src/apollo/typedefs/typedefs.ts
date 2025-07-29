export const typeDefs = `#graphql

  # Serene Core (types)
  # ---

  type ChatMessage {
    id: String!
    name: String!
    message: String!
    created: String!
    updated: String
  }

  type ChatMessageResults {
    status: Boolean!
    message: String
    chatMessages: [ChatMessage]
  }

  type ChatParticipant {
    id: String!
    userProfileId: String!
    name: String
  }

  type ChatParticipantResults {
    status: Boolean!
    message: String
    chatParticipants: [ChatParticipant]
  }

  type ChatSession {
    id: String!
    status: String!
    updated: String!
    chatParticipants: [ChatParticipant]
  }

  type ChatSessionResults {
    status: Boolean!
    message: String
    chatSession: ChatSession
  }

  type Comment {
    id: String!
    url: String!
    text: String!
  }

  type ExistsResults {
    status: Boolean!
    message: String
    exists: Boolean
  }

  type StatusAndMessage {
    status: Boolean!
    message: String
  }

  type StatusAndMessageAndId {
    status: Boolean!
    message: String
    id: String
  }

  type Tip {
    id: String!
    name: String!
    tags: [String]
  }

  type TipsResults {
    status: Boolean!
    message: String
    tips: [Tip]
  }

  type User {
    id: String!
    name: String
  }

  type UserPreference {
    category: String!
    key: String!
    value: String
    values: [String]
  }

  type UserProfile {
    id: String!
    userId: String
    user: User
    isAdmin: Boolean!
  }

  # Kindred (types)
  # ---

  type EntityInterest {
    id: String!
    interestType: InterestType!
    name: String!
  }

  type InterestType {
    id: String!
    name: String!
  }

  type Post {
    site: Site!
    title: String!
    posted: String!
    postUrl: PostUrl!
  }

  type PostSummaryInsight {
    id: String!
    name: String!
    description: String!
    commentsCount: Int!
  }

  type PostSummaryInsightComment {
    id: String!
    comment: Comment!
  }

  type PostSummary {
    id: String!
    postId: String!
    userProfileId: String
    status: String!
    socialMediaUrl: String
    postSummary: String
    insights: [PostSummaryInsight]
    otherComments: String
    updated: String!
    post: Post!
  }

  type PostSummaryResults {
    status: Boolean!
    message: String
    postSummaries: [PostSummary]
  }

  type PostSummaryInsightCommentResults {
    status: Boolean!
    message: String
    postSummaryInsightComments: [PostSummaryInsightComment]
  }

  type PostUrl {
    url: String!
  }

  type PostUrlSummary {
    id: String!
    postUrlId: String!
    userProfileId: String
    status: String!
    text: String!
    updated: String!
  }

  type ServerStartData {
    status: Boolean!
    message: String
    chatSession: ChatSession
  }

  type Site {
    id: String!
    name: String!
  }

  type StatusAndFoundAndMessage {
    status: Boolean!
    found: Boolean!
    message: String
  }

  type UserInterestsText {
    id: String!
    text: String!
  }

  type UserInterestsResults {
    status: Boolean!
    message: String
    userInterestsText: UserInterestsText
    recommendedInterests: [EntityInterest]
  }

  # Queries
  # ---

  type Query {

    # Serene Core
    # ---

    # Chats
    getChatMessages(
      chatSessionId: String,
      userProfileId: String!,
      lastMessageId: String): ChatMessageResults!

    getChatParticipants(
      chatSessionId: String,
      userProfileId: String!): ChatParticipantResults!

    getChatSession(
      chatSessionId: String,
      userProfileId: String!): ChatSessionResults!

    getChatSessions(
      status: String,
      userProfileId: String!): [ChatSession]

    # Profile
    validateProfileCompleted(
      forAction: String!,
      userProfileId: String!): StatusAndMessage!

    # Tips
    getTipsByUserProfileIdAndTags(
      userProfileId: String!,
      tags: [String]): TipsResults!

    tipGotItExists(
      name: String!,
      userProfileId: String!): ExistsResults!

    # Users
    isAdminUser(userProfileId: String!): StatusAndMessage!
    userById(userProfileId: String!): UserProfile
    verifySignedInUserProfileId(userProfileId: String!): Boolean

    # User preferences
    getUserPreferences(
      userProfileId: String!,
      category: String!,
      keys: [String]): [UserPreference]

    # Kindred
    # ---

    # Summaries
    getPostSummaries(
      userProfileId: String!,
      siteTopicListId: String): PostSummaryResults!
    getPostSummaryInsightComments(
      postSummaryInsightId: String!): PostSummaryInsightCommentResults!

    # Interests
    getUserInterests(userProfileId: String!): UserInterestsResults!
  }

  type Mutation {

    # Serene Core
    # ---

    # Users
    createBlankUser: UserProfile!
    createUserByEmail(email: String!): UserProfile!
    deactivateUserProfileCurrentIFile(id: String!): Boolean
    getOrCreateSignedOutUser(
      signedOutId: String,
      defaultUserPreferences: String): UserProfile!
    getOrCreateUserByEmail(
      email: String!,
      defaultUserPreferences: String): UserProfile!
  
    # Tips
    deleteTipGotIt(
      name: String,
      userProfileId: String!): StatusAndMessage!

    upsertTipGotIt(
      name: String!,
      userProfileId: String!): StatusAndMessage!

    # User preferences
    upsertUserPreference(
      userProfileId: String!,
      category: String!,
      key: String!,
      value: String,
      values: [String]): Boolean

    # Kindred
    # ---

    # Start
    loadServerStartData(
      userProfileId: String!,
      loadChatSession: Boolean,
      chatSessionId: String,
      chatSettingsName: String,
      postSummaryId: String,
      siteTopicListId: String): ServerStartData!

    # Admin
    runAdminFix(userProfileId: String!): StatusAndMessage!
    runBaseDataSetup(userProfileId: String!): StatusAndMessage!
    runDemosSetup(userProfileId: String!): StatusAndMessage!
    runSetup(userProfileId: String!): StatusAndMessage!
    runTests(userProfileId: String!): StatusAndMessage!

    # Interests
    upsertUserInterestsByText(
      userProfileId: String!,
      text: String!): StatusAndMessage!
  }
`
