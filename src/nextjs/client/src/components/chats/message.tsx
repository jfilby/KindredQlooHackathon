const { v4: uuidv4 } = require('uuid')
import { useState } from 'react'
import { ListItem, Typography } from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import Markdown from 'react-markdown'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import MessageAvatar from '@/serene-ai-client/components/chat/view/avatar'
import TransactionChangesDialog from '../dialogs/transaction-changes/dialog'

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

  // State
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false)
  const [json, setJson] = useState<any[]>([])

  // Functions
  const renderSwitch = (content: any) => {

    // Consts
    const json = content.json ? JSON.parse(content.json) : undefined

    // Render switch in a function: https://stackoverflow.com/a/52618847
    switch (content.type) {

      case '':
      case 'md':
        return <div style={{ marginLeft: '1em' }}>
                <MessageAvatar from={message.name} />
                  <Markdown
                    // renderers={{ heading: customHeadingRenderer }}
                    >
                    {content.text}
                  </Markdown>
              </div>

      case 'tn':
        return <ListItem
                  alignItems='flex-start'
                  style={{ marginLeft: '3em' }}>
                  <LabeledIconButton
                    icon={ReceiptIcon}
                    label={`${json.changesCount} nested changes`}
                    onClick={(e: any) => {
                      setJson(json)
                      setJsonDialogOpen(true)
                    }}
                    style={undefined} />
                </ListItem>

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

      <TransactionChangesDialog
        open={jsonDialogOpen}
        name='Changes'
        setOpen={setJsonDialogOpen}
        uiTransaction={json} />
    </>
  )
}
