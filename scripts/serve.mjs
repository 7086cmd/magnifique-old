/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { build } from 'esbuild'
import { ESLint } from 'eslint'
import chalk from 'chalk'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import glob from 'glob'
import lintFile from './lint.mjs'
const __dirname = resolve()
const packageFile = JSON.parse(readFileSync(resolve(__dirname, './package.json')).toString())
packageFile.main = 'dist/main.js'
writeFileSync(resolve(__dirname, './package.json'), JSON.stringify(packageFile, null, 4))

lintFile()
const list = [...glob.sync('src/modules/**/*.*'), ...glob.sync('src/modules/*.*'), ...glob.sync('src/client/**/*.*'), ...glob.sync('src/client/*.*'), 'src/main.ts', 'src/preload.ts']
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
