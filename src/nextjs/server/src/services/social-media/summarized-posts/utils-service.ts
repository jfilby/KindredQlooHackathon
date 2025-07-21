// Class
export class SummarizePostUtilsService {

  // Consts
  clName = 'SummarizePostUtilsService'

  // Code
  fixBulletedPoints(text: string): string {

    // Debug
    const fnName = `${this.clName}.fixBulletedPoints()`

    // Split by bullet points
    const bulletedParts = text.split('- ')

    // Split by bolded text as the starting point
    var parts: string[] = []

    for (const bulletedPart of bulletedParts) {

      const bulletParts = bulletedPart.split(/(?=\*\*[^*]+\*\*:)/g)

      parts = parts.concat(bulletParts)
    }

    // Debug
    console.log(`${fnName}: parts: ${parts}`)

    // Fix formatting for each part if needed, adding new-lines to all but the
    // last bullet point.
    var text = ''

    for (var i = 0; i < parts.length; i++) {

      var part = parts[i].trim()

      if (part === '') {
        continue
      }

      if (!part.startsWith('-')) {
        part = '- ' + part
      }

      text += part

      if (i < parts.length - 1) {

        text += `\n`
      }
    }

    // Return
    return text
  }
}
