import { Typography } from '@mui/material'
import ViewAiPersonaCard from './card'

interface Props {
  userProfileId: string
  instanceId: string
  entity: any
  aiPersonas: any[]
}

export default function ListAiPersonas({
                          userProfileId,
                          instanceId,
                          entity,
                          aiPersonas
                        }: Props) {

  // Consts
  const addUrl = `/ai-personas/add`

  // Render
  return (
    <div style={{ marginBottom: '2em' }}>
      {aiPersonas != null ?
        <>

          <div style={{ marginBottom: '2em' }}>

            <Typography variant='h5'>
              AI personas
            </Typography>
          </div>

          {aiPersonas.length > 0 ?
            <>
              {aiPersonas.map(aiPersona => (
                <ViewAiPersonaCard
                  key={aiPersona.id}
                  userProfileId={userProfileId}
                  aiPersona={aiPersona} />
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No AI personas to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
