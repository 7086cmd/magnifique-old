/* eslint-disable no-console */
import { ESLint } from 'eslint'
import chalk from 'chalk'
const lintFile = async () => {
  const eslint = new ESLint({
    fix: true,
  })
  const results = await eslint.lintFiles(['src/**/*.ts', 'src/main.ts', 'src/**/*.vue'])
  await ESLint.outputFixes(results)
  // console.log(JSON.stringify(results, '', 4))
  let tw = 0,
    te = 0
  let hasw = false
  for (let i = 0; i in results; i++) {
    if (results[i].messages.length != 0) {
      console.log(chalk.underline(results[i].filePath))
      hasw = true
    }
    for (let j = 0; j in results[i].messages; j++) {
      if (results[i].messages[j].severity == 1) {
        console.log(
          '  ' +
            chalk.dim(`${results[i].messages[j].line}:${results[i].messages[j].column}`) +
            '  ' +
            chalk.yellow('warning') +
            '  ' +
            results[i].messages[j].message +
            '  ' +
            chalk.dim(results[i].messages[j].ruleId)
        )
      } else if (results[i].messages[j].severity == 2) {
        console.log(
          '  ' +
            chalk.dim(`${results[i].messages[j].line}:${results[i].messages[j].column}`) +
            '  ' +
            chalk.red('error') +
            '  ' +
            results[i].messages[j].message +
            '  ' +
            chalk.dim(results[i].messages[j].ruleId)
        )
      }
    }
    if (results[i].messages.length != 0) {
      console.log()
    }
    tw += results[i].warningCount
    te += results[i].errorCount
  }
  if (hasw) {
    console.log(chalk.bold.yellow(`✖ ${tw + te} problems (${te} errors, ${tw} warnings)`))
  }
  if (te > 0) {
    console.log(chalk.dim.red('Builder is waiting for no error.'))
  }
}
lintFile()
export default lintFile
