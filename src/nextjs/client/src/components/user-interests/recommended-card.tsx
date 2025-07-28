import AddIcon from '@mui/icons-material/Add'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'

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

      <LabeledIconButton
        icon={AddIcon}
        label={label}
        onClick={(e: any) => addRecommendation()}
        style={{ display: 'inline-block', marginRight: '2em' }} />

    </span>
  )
}
