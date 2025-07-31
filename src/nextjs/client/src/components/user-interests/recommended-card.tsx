import AddIcon from '@mui/icons-material/Add'
import { Link, Typography } from '@mui/material'

interface Props {
  text: any
  setText: any
  recommendedInterest: any
}

export default function ViewRecommendedInterestCard({
                          text,
                          setText,
                          recommendedInterest
                        }: Props) {

  // Consts
  const label = `${recommendedInterest.name} (${recommendedInterest.interestType.name.toLowerCase()})`

  // Functions
  function addRecommendation() {

    // Validate
    var newText = ''

    if (text != null) {
      newText = text
    }

    const lowerText = text.toLowerCase()

    // Don't add if the interest's text already exists
    if (lowerText.indexOf(label.toLowerCase()) >= 0) {
      return
    }

    // Add recommendation
    if (!text.endsWith('\n')) {

      newText = text  + `\n`
    }

    newText += `${label}\n`

    // console.log(newText)

    setText(newText)
  }

  // Render
  return (
    <span style={{ display: 'inline-block' }}>

      {/* <p>recommendedInterest: {JSON.stringify(recommendedInterest)}</p> */}

      <Link
        onClick={(e: any) => addRecommendation()}
        sx={{ color: 'black', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginRight: '2em' }}
        underline='hover'>

        <AddIcon
          fontSize='small'
          sx={{ mr: 0.5 }} />

        <Typography
          variant='body1'>
          {label}
        </Typography>
      </Link>

    </span>
  )
}
