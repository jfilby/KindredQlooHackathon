import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import PageHeader from './header'
import Footer from './footer'
import LayoutBox from './layout-box'

interface Props {
  children: React.ReactNode
  projectName?: string | null
  ownerName?: string | null
  userProfile: any | undefined
}

export const pageBodyWidth = '54em'
export const columnBodyWidth = '40em'

export default function Layout({
                          children,
                          projectName = null,
                          ownerName = null,
                          userProfile
                        }: Props) {

  // State
  const [_isMobile, setMobile] = useState<boolean|undefined>(undefined)

  // Effects
  useEffect(() => {

    // Set isMobile
    setMobile(isMobile)
  }, [setMobile])

  // Render
  return (
    <>
      {_isMobile != null ?
        <PageHeader
          userProfile={userProfile} />
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

      <div style={{ marginBottom: '2.5em' }} />
        <main>
          {_isMobile != null ?
            <LayoutBox _isMobile={_isMobile}>
              {children}
            </LayoutBox>
          :
            <></>
          }
        </main>
      <Footer />
    </>
  )
}
