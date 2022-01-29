/* eslint-disable no-console */
import { build as buildFrontEnd } from 'vite'
import { build as buildBackEnd, analyzeMetafile } from 'esbuild'
import { build as buildApp } from 'electron-builder'
import { build as buildDocs } from 'vitepress'
import { ESLint } from 'eslint'
import chalk from 'chalk'
import { resolve } from 'path'
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { platform } from 'os'
import { exec } from 'child_process'
const __dirname = resolve()
// Edit Main
const packageFile = JSON.parse(readFileSync(resolve(__dirname, './package.json')).toString())
packageFile.main = 'dist/main.min.js'
delete packageFile['type']
writeFileSync(resolve(__dirname, './package.json'), JSON.stringify(packageFile, null, 4))
const list = readdirSync(resolve(__dirname, './src/modules'))
for (let i = 0; i in list; i++) {
  list[i] = 'src/modules/' + list[i]
}
const lintFile = async () => {
  const eslint = new ESLint()
  const results = await eslint.lintFiles(['src/**/*.ts', 'src/main.ts', 'src/**/*.vue'])
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
;(async () => {
  if (platform() == 'darwin') {
    exec('pnpm install dmg-license -D')
  } else {
    console.log(platform(), 'Skipped to install dmg-license.')
  }
  await lintFile()
  await buildFrontEnd()
  await buildDocs(resolve(__dirname, './docs')).then(() => {
    try {
      mkdirSync(resolve(__dirname, './dist/docs'))
      mkdirSync(resolve(__dirname, './dist/docs/assets'))
      // eslint-disable-next-line no-empty
    } catch (_) {}
    const folderlist = readdirSync(resolve(__dirname, './docs/.vitepress/dist'), {
      withFileTypes: true,
    })
    const childfolderlist = readdirSync(resolve(__dirname, './docs/.vitepress/dist/assets'), {
      withFileTypes: true,
    })
    for (let i = 0; i in folderlist; i++) {
      if (folderlist[i].isFile() == true) {
        try {
          writeFileSync(resolve(__dirname, './dist/docs', folderlist[i].name), readFileSync(resolve(__dirname, './docs/.vitepress/dist', folderlist[i].name)))
          // eslint-disable-next-line no-empty
        } catch (_) {}
      }
    }
    for (let i = 0; i in childfolderlist; i++) {
      if (childfolderlist[i].isFile() == true) {
        try {
          writeFileSync(resolve(__dirname, './dist/docs/assets', childfolderlist[i].name), readFileSync(resolve(__dirname, './docs/.vitepress/dist/assets', childfolderlist[i].name)))
          // eslint-disable-next-line no-empty
        } catch (_) {}
      }
    }
  })
  await buildBackEnd({
    entryPoints: ['src/main.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
      'process.env.PRELOAD_PLACE': "'preload.js'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd(Wu Chengyu) in Ningbo Zhenhai Jiaochuan Academy. */',
    },
    treeShaking: true,
    external: ['electron'],
  })
  await buildBackEnd({
    entryPoints: ['src/preload.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
      'process.env.PRELOAD_PLACE': "'preload.js'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd(Wu Chengyu) in Ningbo Zhenhai Jiaochuan Academy. */',
    },
    treeShaking: true,
    external: ['electron'],
  })
  await buildBackEnd({
    entryPoints: ['src/client/main.js'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.client.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
      'process.env.PRELOAD_PLACE': "'preload.js'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd(Wu Chengyu) in Ningbo Zhenhai Jiaochuan Academy. */',
    },
    treeShaking: true,
    external: ['electron'],
  })
  await buildBackEnd({
    entryPoints: ['src/client/preload.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.client.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
      'process.env.PRELOAD_PLACE': "'preload.js'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd(Wu Chengyu) in Ningbo Zhenhai Jiaochuan Academy. */',
    },
    treeShaking: true,
    external: ['electron'],
  })
})()
