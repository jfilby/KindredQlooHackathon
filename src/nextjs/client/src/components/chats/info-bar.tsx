import { Link, Typography } from '@mui/material'

interface Props {
  instanceId: string
  chatSession: any
}

export default function ChatInfoBar({
                          instanceId,
                          chatSession
                        }: Props) {

  // Render
  return (
    <div style={{ marginBottom: '1em' }}>
      {/* <Typography style={{ display: 'inline-block' }}>
        Discussing&nbsp;
      </Typography> */}

      {chatSession.proposal != null ?
        <>
          <Typography style={{ display: 'inline-block' }}>
            proposal:&nbsp;
          </Typography>
          <Link
            href={`/i/${instanceId}/proposal/${chatSession.proposal.id}`}
            style={{ display: 'inline-block' }}>
            <Typography>
              {chatSession.proposal.name}
            </Typography>
          </Link>
        </>
      :
        <></>
      }
    </div>
  )
}
