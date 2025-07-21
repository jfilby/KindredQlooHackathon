import { CustomError } from '@/serene-core-server/types/errors'
import { SummarizePostUtilsService } from './utils-service'

// Services
const summarizePostUtilsService = new SummarizePostUtilsService()

// Class
export class SummarizePostUtilsServiceTests {

  // Consts
  clName = 'SummarizePostUtilsServiceTests'

  // Code
  tests() {

    this.testFixBulletedPoints1()
    this.testFixBulletedPoints2()
    this.testFixBulletedPoints3()
  }

  testFixBulletedPoints1() {

    // Debug
    const fnName = `${this.clName}.testFixBulletedPoints1()`

    // Text to fix: missing bullet points and new-lines
    const textToFix =
            `**Effectiveness**: One commenter posits ..` +
            `**Practicality**: Another shared a ..` +
            `**Conceptual Roots**: The core idea of ..`

    const expectedFixedText =
            `- **Effectiveness**: One commenter posits ..\n` +
            `- **Practicality**: Another shared a ..\n` +
            `- **Conceptual Roots**: The core idea of ..`

    // Call fix function
    const fixedText = summarizePostUtilsService.fixBulletedPoints(textToFix)

    // Debug
    console.log(`${fnName}: fixedText: ${fixedText.length}`)
    console.log(`${fnName}: expectedFixedText: ${expectedFixedText.length}`)

    // Fixed?
    if (fixedText !== expectedFixedText) {

      console.log(`${fnName}: fixedText: ${fixedText}`)
      console.log(`${fnName}: expectedFixedText: ${expectedFixedText}`)

      throw new CustomError(`${fnName}: fixedText !== expectedFixedText`)
    }
  }

  testFixBulletedPoints2() {

    // Debug
    const fnName = `${this.clName}.testFixBulletedPoints2()`

    // Text to fix: missing some bullet points and new-lines
    const textToFix =
            `- **Effectiveness**: One commenter posits ..` +
            `**Practicality**: Another shared a ..\n` +
            `**Conceptual Roots**: The core idea of ..`

    const expectedFixedText =
            `- **Effectiveness**: One commenter posits ..\n` +
            `- **Practicality**: Another shared a ..\n` +
            `- **Conceptual Roots**: The core idea of ..`

    // Call fix function
    const fixedText = summarizePostUtilsService.fixBulletedPoints(textToFix)

    // Debug
    console.log(`${fnName}: fixedText: ${fixedText.length}`)
    console.log(`${fnName}: expectedFixedText: ${expectedFixedText.length}`)

    // Fixed?
    if (fixedText !== expectedFixedText) {

      console.log(`${fnName}: fixedText: ${fixedText}`)
      console.log(`${fnName}: expectedFixedText: ${expectedFixedText}`)

      throw new CustomError(`${fnName}: fixedText !== expectedFixedText`)
    }
  }

  testFixBulletedPoints3() {

    // Debug
    const fnName = `${this.clName}.testFixBulletedPoints3()`

    // Text to fix: nothing missing
    const textToFix =
            `- **Effectiveness**: One commenter posits ..\n` +
            `- **Practicality**: Another shared a ..\n` +
            `- **Conceptual Roots**: The core idea of ..`

    const expectedFixedText =
            `- **Effectiveness**: One commenter posits ..\n` +
            `- **Practicality**: Another shared a ..\n` +
            `- **Conceptual Roots**: The core idea of ..`

    // Call fix function
    const fixedText = summarizePostUtilsService.fixBulletedPoints(textToFix)

    // Debug
    console.log(`${fnName}: fixedText: ${fixedText.length}`)
    console.log(`${fnName}: expectedFixedText: ${expectedFixedText.length}`)

    // Fixed?
    if (fixedText !== expectedFixedText) {

      console.log(`${fnName}: fixedText: ${fixedText}`)
      console.log(`${fnName}: expectedFixedText: ${expectedFixedText}`)

      throw new CustomError(`${fnName}: fixedText !== expectedFixedText`)
    }
  }
}
