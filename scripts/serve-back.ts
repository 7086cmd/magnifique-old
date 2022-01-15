/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { build } from 'esbuild'
import { ESLint } from 'eslint'
import chalk from 'chalk'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import glob from 'glob'
import { exec } from 'child_process'

const __dirname = resolve()
const packageFile = JSON.parse(readFileSync(resolve(__dirname, './package.json')).toString())
packageFile.main = 'dist/main.js'
writeFileSync(resolve(__dirname, './package.json'), JSON.stringify(packageFile, null, 4))
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
}
lintFile()
const list = [...glob.sync('src/modules/**/*.*'), ...glob.sync('src/modules/*.*'), ...glob.sync('src/client/**/*.*'), ...glob.sync('src/client/*.*'), 'src/main.ts', 'src/preload.ts']
// exec(`electron dist/main.js`).stdout?.on('data', (data) => {
//     console.log(data)
// })
exec(`vite`).stdout?.on('data', (data) => {
    console.log(data)
})
build({
    entryPoints: list,
    outdir: 'dist',
    platform: 'node',
    format: 'cjs',
    metafile: true,
    loader: {
        '.ts': 'ts',
        '.png': 'file',
    },
    watch: {
        onRebuild: (error) => {
            if (error) {
                console.log(chalk.red('Build Failed: ' + error.message))
            } else {
                lintFile()
            }
        },
    },
    target: ['node16'],
    outExtension: {
        '.js': '.js',
    },
    logLevel: 'debug',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]',
    color: true,
    define: {
        'process.env.NODE_ENV': "'development'",
        'process.env.PRELOAD_PLACE': "'preload.js'",
    },
    mainFields: ['main', 'module'],
    banner: {
        js: '/* Copyright© 2022 7086cmd(Wu Chengyu) in Ningbo Zhenhai Jiaochuan Academy. */',
    },
})
