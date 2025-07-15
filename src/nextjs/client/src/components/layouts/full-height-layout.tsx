import PageHeader from './header'
import Footer from './footer'

interface Props {
  children: React.ReactNode
  projectName?: string | null
  ownerName?: string | null
  withHeader?: boolean
  userProfileId: string | undefined
}

export const pageBodyWidthPlus = '60em'
export const pageBodyWidth = '54em'
export const columnBodyWidth = '40em'

export default function FullHeightLayout({
                          children,
                          projectName = null,
                          ownerName = null,
                          withHeader = true,
                          userProfileId
                        }: Props) {

  // Render
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '100%' }}>

        {withHeader === true ?
          <PageHeader userProfileId={userProfileId} />
        :
          <></>
        }

        {projectName != null ?
          <div style={{ textAlign: 'center' }}>
            <h3>
              {projectName}
              {ownerName != null ?
                <>
                  &nbsp;
                  <span style={{ fontWeight: '400' }}>(owner: {ownerName})</span>
                </>
              :
                <></>
              }
            </h3>
          </div>
        :
          <></>
        }

        <div style={{ marginTop: '1em' }}>
          <div style={{ display: 'inline-block' }}>
            <main>{children}</main>
          </div>
        </div>
      
        <Footer />
      </div>
    </div>
  )
}
