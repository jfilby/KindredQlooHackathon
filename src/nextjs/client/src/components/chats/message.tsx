const { v4: uuidv4 } = require('uuid')
import { Typography } from '@mui/material'
import Markdown from 'react-markdown'
import MessageAvatar from '@/serene-ai-client/components/chat/view/avatar'

interface Props {
  message: any
}

interface HeadingProps {
  level: number
  children: React.ReactNode
}

export default function Message({ message }: Props) {

  const customHeadingRenderer: React.FC<HeadingProps> = ({ level, children }) => {
    // Render all headings as h6
    return <h6>{children}</h6>
  }

  // Functions
  const renderSwitch = (content: any) => {

    // Consts
    const json = content.json ? JSON.parse(content.json) : undefined

    // Render switch in a function: https://stackoverflow.com/a/52618847
    switch (content.type) {

      case '':
      case 'md':
        return <div style={{ marginLeft: '1em', textAlign: 'left' }}>
                <MessageAvatar from={message.name} />
                  <Markdown
                    // renderers={{ heading: customHeadingRenderer }}
                    >
                    {content.text}
                  </Markdown>
              </div>

      default:
        return <Typography variant='body2' style={{ fontWeight: 'bold' }}>
                 Unhandled content type: {JSON.stringify(content.type)}
               </Typography>
    }
  }

  // Render
  return (
    <>
      {message.contents ?
        <>
          {message.contents.map((content: any) => (
            <div key={uuidv4()}>
              {renderSwitch(content)}
            </div>
          ))}
        </>
      :
        <p>message: {JSON.stringify(message)}</p>
      }
    </>
  )
}
