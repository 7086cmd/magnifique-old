/* eslint-disable no-console */
import { execSync } from 'child_process'
import { ESLint } from 'eslint'
import chalk from 'chalk'
import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'
const __dirname = resolve()
const lintFile = async () => {
    const eslint = new ESLint()
    const results = await eslint.lintFiles(['src/**/*.ts', 'src/main.ts', 'src/**/*.vue'])
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
lintFile().then(() => {
    // eslint-disable-next-line prefer-const
    let packageFile = JSON.parse(readFileSync(resolve(__dirname, './package.json')).toString())
    packageFile.main = 'dist/main.min.js'
    writeFileSync(resolve(__dirname, './package.json'), JSON.stringify(packageFile, '', 4))
    execSync('git add .')
    execSync(`git commit -m "${process.argv[process.argv.length - 1]}"`)
    execSync('git push -u origin main')
    packageFile.main = 'src/main.ts'
    writeFileSync(resolve(__dirname, './package.json'), JSON.stringify(packageFile, '', 4))
})
