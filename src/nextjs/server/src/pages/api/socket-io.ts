// server/src/apis/socket-io.ts
import express from 'express'
import http from 'http'
import { prisma } from '@/db'
import { Server as SocketIoServer } from 'socket.io'

// const prisma = new PrismaClient()
const app = express()
const server = http.createServer(app)
const io = new SocketIoServer(
                 server,
                 {
                   cors: {
                     origin: '*',
                   },
                   // transports: ['websocket']
                 })

// Services
;

// On socket.io events
io.on('connection', (socket) => {
  console.log('A user connected')

  // Handle chat session join event with authorization
  socket.on('joinChatSession', async (data) => {
    const { chatSessionId, chatSessionToken, chatParticipantId } = data

    // Validate chat session based on the token
    const chatSession = await prisma.chatSession.findUnique({
      where: {
        id: chatSessionId,
        token: chatSessionToken,
      },
    })

    const chatParticipantCount = await prisma.chatParticipant.count({
      where: {
        id: chatParticipantId,
        chatSessionId: chatSessionId
      }
    })

    if (chatSession != null &&
        chatParticipantCount > 0) {

      socket.join(chatSessionId)
      console.log(`User joined chatSession with id: ${chatSessionId}`)

      // Inform the client that they have successfully joined the chat session
      socket.emit('chatSessionIdJoined', chatSessionId)
    } else {

      // Inform the client about authorization failure
      socket.emit('authorizationFailed')
    }
  })

  // Handle messages from clients in async
  socket.on('message', async (data) => {

    // Debug
    const fnName = `socket.on('message')`
    // console.log(`message: data: ${JSON.stringify(data)}`)

    // Broadcast the message to all clients in the specified chat session
    const { chatSessionId, chatParticipantId, instanceId, name, userProfileId, contents } = data

    io.to(chatSessionId).emit('message', data)

    // Debug
    console.log(`${fnName}: contents: ` + JSON.stringify(contents))

    // Transaction
    var replyData: any = {}

    console.log(`${fnName}: replyData: ` + JSON.stringify(replyData))

    io.to(chatSessionId).emit('message', replyData)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

const socketIoPort = Number(process.env.NEXT_PUBLIC_SOCKETIO_PORT)  // or any other port you prefer
server.listen(
  socketIoPort,
  () => {
    console.log(`Socket.io server is running on port ${socketIoPort}`)
  })

// export default server
const socketIoHandler = async (req: any, res: any) => {
}

export default socketIoHandler
