/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { build } from 'esbuild'
import { ESLint } from 'eslint'
import chalk from 'chalk'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import glob from 'glob'
import lintFile from './lint.mjs'
import electron from 'electron'
import { exec, spawn } from 'child_process'
import { createServer } from 'vite'
import { platform } from 'os'
import { watch } from 'chokidar'

const getGlob = () => [...glob.sync('src/modules/**/*.*'), ...glob.sync('src/*.*'), ...glob.sync('src/examples/*.*'), ...glob.sync('src/client/*.*'), ...glob.sync('src/client/**/*.*')]

const __dirname = resolve()
const packageFile = JSON.parse(readFileSync(resolve(__dirname, './package.json')).toString())
packageFile.main = 'dist/main.js'
writeFileSync(resolve(__dirname, './package.json'), JSON.stringify(packageFile, null, 4))

platform === 'win32' && exec('taskkill /f /im electron.exe')

const generate = async () => {
  await build({
    entryPoints: getGlob(),
    outdir: 'dist',
    platform: 'node',
    format: 'cjs',
    metafile: true,
    loader: {
      '.ts': 'ts',
      '.png': 'file',
    },
    target: ['node16'],
    logLevel: 'silent',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'development'",
    },
    mainFields: ['main', 'module'],
    banner: {
      js: '/* Copyright© 2022 7086cmd. */',
    },
  })
  console.log(chalk.green(`[Build] ${getGlob().length} files have built.`))
}
let runner
let isbuilding = false

const execElectron = () => {
  if (runner !== undefined) {
    runner.kill()
  }
  exec(`taskkill /f /im electron.exe`)
  runner = spawn(electron, [resolve('dist', 'main.js')])
  runner.stdout?.on('data', (data) => {
    console.log(chalk.cyan(`[App] ${data}`))
  })
  runner.stderr?.on('data', (data) => {
    console.error(chalk.red(`[App Err] ${data}`))
  })
}

generate().then(() => execElectron())

createServer()
  .then((result) => {
    return result.listen()
  })
  .then((result) => {
    console.log(chalk.green('Front End Server Started.'))
    console.log(chalk.blue('[Vite] ----- DEV --- SERVER --- URL -----'))
    result.printUrls()
    console.log(chalk.blue('[Vite] ----------------------------------'))
  })

let oldGlob = getGlob()

let watcher = watch(oldGlob)

watcher.on('change', (path) => {
  console.log(chalk.blue(`[Watcher] File ${path} changed.`))
  console.log(chalk.green('[Lint] Linting...'))
  lintFile()
    .then(() => generate())
    .then(() => execElectron())
  oldGlob = Array.of(getGlob())
})

setInterval(() => {
  if (getGlob().length !== oldGlob.length && !isbuilding) {
    isbuilding = true
    console.log(chalk.blue('[Watcher] Foelder change effected. rebuilding...'))
    watcher.close()
    watcher = watch(getGlob())
    console.log(chalk.green('[Lint] Linting...'))
    lintFile()
      .then(() => generate())
      .then(() => execElectron())
      .then(() => (oldGlob = getGlob()))
      .then(() => (isbuilding = true))
  }
}, 500)
