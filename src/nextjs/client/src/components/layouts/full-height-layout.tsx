import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import PageHeader from './header'
import Footer from './footer'
import LayoutBox from './layout-box'

interface Props {
  children: React.ReactNode
  projectName?: string | null
  ownerName?: string | null
  withHeader?: boolean
  userProfile: any | undefined
}

export const pageBodyWidthPlusPlus = '80em'
export const pageBodyWidthPlus = '60em'
export const pageBodyWidth = '54em'
export const columnBodyWidth = '40em'

export default function FullHeightLayout({
                          children,
                          projectName = null,
                          ownerName = null,
                          withHeader = true,
                          userProfile
                        }: Props) {

  // State
  const [_isMobile, setMobile] = useState<boolean|undefined>(undefined)

  // Effects
  // Note: this must be done in the file (too), instead of passing_isMobile as
  // a parameter, or the mobile header doesn't render.
  useEffect(() => {

    // Set isMobile
    setMobile(isMobile)
  }, [setMobile])

  // Render
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '100%' }}>

        {withHeader === true ?
          <>
            {_isMobile != null ?
              <PageHeader
                userProfile={userProfile} />
            :
              <></>
            }
          </>
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
            <main>
              {_isMobile != null ?
                <LayoutBox _isMobile={_isMobile}>
                  {children}
                </LayoutBox>
              :
                <></>
              }
            </main>
          </div>
        </div>
      
        <Footer />
      </div>
    </div>
  )
}
