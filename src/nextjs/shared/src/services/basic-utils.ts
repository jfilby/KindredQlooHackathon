export class BasicSharedUtils {

  getShortLocaleString(date: Date) {

    const tz = date.toLocaleDateString('en', {
                 day: '2-digit',
                 timeZoneName: 'short'
               }).slice(4) 

    return `${date.toLocaleString()} ${tz}`
  }

  getSnippet(
    text: string,
    maxChars: number) {

    if (text.length < maxChars) {
      return text
    }

    return text.substring(0, maxChars) + '..'
  }
}
