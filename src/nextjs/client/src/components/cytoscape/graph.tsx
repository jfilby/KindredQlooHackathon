const cytoscape = require('cytoscape')
import { Typography } from '@mui/material'
import { useEffect, useRef } from 'react'

interface Props {}

export default function GraphTest({}: Props) {

  const graphRef = useRef(null)

  const drawGraph = () => {

  const cy = cytoscape({
    container: graphRef.current,
    elements: [
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      {
        data: {
          id: 'ab',
          source: 'a',
          target: 'b'
        }
      }]
    })
  }

  useEffect(() => {
    drawGraph()
  }, [])

  return (
    <div style={{ border: '1px solid #888' }}>
     <Typography
       style={{ marginLeft: '0.2em' }}
       variant='h6'>
      Graph test
    </Typography>

    <div
      ref={graphRef}
      style={{ width: '100%', height: '80vh' }}>
    </div>
    </div>
  )
}
