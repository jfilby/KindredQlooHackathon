// Note: based on the Serene AI component ViewChatSession
const { v4: uuidv4 } = require('uuid')
import { useEffect, useRef, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { io } from 'socket.io-client'
import { Alert, Button, TextareaAutosize } from '@mui/material'
import { getChatMessagesQuery } from '@/apollo/chats'
import ChatSessionMessages from './messages'

// Get/create a Socket.io object. This needs to be done outside of the
// function, which would otherwise constantly retry the object creation,
// causing mass reconnects. Possibly only on dev, even so, this is the best
// place to create the Socket.io object.
const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_IO_URL}`)

// Page function interface
interface Props {
  postSummaryId: string | undefined
  siteTopicListId: string | undefined
  chatSession: any
  userProfileId: string
  instanceId: string | undefined
  showInputTip: boolean | undefined
  setShowInputTip: any
  showNextTip: boolean | undefined
  setShowNextTip: any
}

export default function ViewChatSession({
                          postSummaryId,
                          siteTopicListId,
                          chatSession,
                          userProfileId,  // should be fromChatParticipantId (or both)
                          instanceId,
                          showInputTip,
                          setShowInputTip,
                          showNextTip,
                          setShowNextTip
                        }: Props) {

  // Consts
  const chatSessionId = chatSession != null ? chatSession.id : null

  // Refs
  const myMessageInput = useRef<any>(null)

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState(undefined)
  const [chatSessionToken, setChatSessionToken] = useState(chatSession != null ? chatSession.token : uuidv4())
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [chatParticipant, setChatParticipant] = useState<any>(undefined)
  const [myTurn, setMyTurn] = useState(true)
  const [myMessage, setMyMessage] = useState('')
  const [lastMyMessage, setLastMyMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [chatHeight, setChatHeight] = useState(getChatBoxHeight())

  // GraphQL
  const [fetchChatMessages] =
    useLazyQuery(getChatMessagesQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  function getChatBoxHeight() {

    var height = 56

    // Alert
    if (alertSeverity != null) {
      height -= 6
    }

    /* Quick responses
    if (myTurn === true && messages.length === 0) {
      height -= 6
    } */

    return `${height}vh`
  }

  async function getChatMessages() {

    // Validate
    if (chatSession == null) {
      return
    }

    // Get project
    const getChatMessagesData =
      await fetchChatMessages(
        {
          variables: {
            chatSessionId: chatSession.id,
            userProfileId: userProfileId
          }
        })

    const results = getChatMessagesData.data.getChatMessages

    if (results != null) {

      // Deserialize contents
      var thisMessages: any[] = []

      for (const message of results.chatMessages) {

        var thisMessage = message
        thisMessage.contents = JSON.parse(message.message)

        thisMessages.push(thisMessage)
      }

      setMessages(thisMessages)
    }
  }

  const handleJoinChatSession = () => {

    // console.log(`Sending joinChatSession message..`)

    socket.emit('joinChatSession', {
      chatSessionId,
      chatSessionToken,
      userProfileId
    })
  }

  const handleSendMessage = (inputMessage = '') => {

    // Stop further input until a reply is given
    setMyTurn(false)

    // Whitespace trimmed message
    var prepMyMessage: string

    if (inputMessage !== '') {
      prepMyMessage = inputMessage.trim()
    } else {
      prepMyMessage = myMessage.trim()
    }

    // Emit a 'message' event to the server
    socket.emit('message', {
        sentByAi: false,
        postSummaryId: postSummaryId,
        siteTopicListId: siteTopicListId,
        chatSessionId: chatSessionId,
        chatSessionToken: chatSessionToken,
        chatParticipantId: chatParticipant ? chatParticipant.id : null,
        userProfileId: userProfileId,
        instanceId: instanceId,
        name: chatParticipant ? chatParticipant.name : 'User',
        contents: [{
          type: '',
          text: prepMyMessage
        }]
    })

    setLastMyMessage(prepMyMessage)
    setMyMessage('')  // Clear the message input field after sending the message
  }

  const handleSendMessageAndTextboxFocus = (inputMessage = '') => {
    handleSendMessage(inputMessage)
    myMessageInput.current.focus()
  }

  function setTipsVisible() {

    if (showInputTip != null) {

      if (messages.length === 0) {
        setShowInputTip(true)
      } else if (showInputTip === true &&
                 messages.length > 0) {

        setShowInputTip(false)
      }
    }

    if (messages.length > 0 &&
      showNextTip === false) {
      setShowNextTip(true)
    }
  }

  // Handle received messages from the server
  socket.on('message', (newMessage: any) => {

    // Debug
    // console.log(`message: ${JSON.stringify(newMessage)}`)

    // Validate
    if (newMessage != null) {

      // Is there a chatParticipantId to be used?
      if (chatParticipant == null &&
          newMessage.chatParticipantId != null) {

        setChatParticipant({
          id: newMessage.chatParticipantId
        })
      }

      // Is this an error?
      if (newMessage.contents[0].type === 'error') {

        setAlertSeverity('error')
        setMessage(newMessage.contents[0].text)
        setMyMessage(lastMyMessage)

        // Remove the last (unhandled message)
        setMessages(messages.slice(0, messages.length - 1))

        // Re-enable the user's turn, to try again
        setMyTurn(true)
      } else {
        setAlertSeverity(undefined)

        // Update the messages state with the new message
        setMessages(messages.concat(newMessage))

        // AI's turn is done
        if (newMessage.sentByAi === true) {
          setMyTurn(true)
        }
      }
    }
  })

  socket.on('chatSessionIdJoined', (chatSessionToken: string) => {

    // console.log(`Successfully joined chat session: ${chatSessionToken}`)
    setIsAuthorized(true)
    // Handle chatSession join on the client-side if needed
  })

  socket.on('authorizationFailed', () => {
    // console.log('Authorization failed. You cannot join the chatSession.')
    // Handle authorization failure on the client-side if needed
    setIsAuthorized(false)
  })

  /* socket.on('connection', (socket) => {
    // console.log(socket.id)
    console.log('connected')
  })

  socket.on('disconnect', () => {
    console.log(socket.id)  // undefined
  })

  socket.on('data', () => {
    console.log(socket.id)  // undefined
  }) */

  // Effects
  // Startup
  useEffect(() => {

    // Fetch data function
    const fetchData = async () => {

      // Get chat messages
      await getChatMessages()
    }

    // Validate
    if (chatSession != null) {

      // Find and set the chatParticipant
      for (const thisChatParticipant of chatSession.chatParticipants) {

        if (thisChatParticipant.userProfileId === userProfileId) {
          setChatParticipant(thisChatParticipant)
          // console.log(`chatParticipant: ${JSON.stringify(thisChatParticipant)}`)
        }
      }
    }

    // Get async results
    const result = fetchData()
      .catch(console.error)

    // Join chat session
    handleJoinChatSession()

    // Autofocus
    if (myMessageInput.current) {
      myMessageInput.current.focus()
    }
  }, [])

  useEffect(() => {
    setChatHeight(getChatBoxHeight())
    setTipsVisible()
  }, [alertSeverity, messages])

  // Render
  return (
    <div style={{ border: '1px solid #888', padding: '0.5em', height: chatHeight }}>

      {/* <p>chatSession: {JSON.stringify(chatSession)}</p>
      <p>chatSessionToken: {JSON.stringify(chatSessionToken)}</p> */}

      <ChatSessionMessages
        messages={messages}
        myTurn={myTurn}
        userProfileId={userProfileId} />
      <>
      {alertSeverity && message ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
        :
        <></>
      }
      </>
      <>
        <TextareaAutosize
          autoComplete='off'
          autoFocus
          minRows={2}
          onChange={(e) => setMyMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && myTurn === false) {
              e.preventDefault()
            }
          }}
          onKeyUp={e => {
            if (e.key === 'Enter' && myTurn === true) {

              if (e.shiftKey || e.ctrlKey) {
                setMyMessage(myMessage + '\n')
              } else {
                handleSendMessage()
              }
            }
          }}
          ref={myMessageInput}
          style={{ border: '1px solid #ccc', marginRight: '0.5em', verticalAlign: 'top', width: '80%' }}
          value={myMessage} />

        <Button
          disabled={!myTurn}
          onClick={(e) => { handleSendMessage() }}
          style={{ verticalAlign: 'top' }}>
          Send
        </Button>
      </>
    </div>
  )
}
